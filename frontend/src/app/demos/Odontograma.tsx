"use client";

import { useState } from "react";
import type { Lang } from "../data/projects";

// Numeración FDI: arcada superior 18→11 | 21→28, inferior 48→41 | 31→38
const UPPER = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
type Face = "vestibular" | "mesial" | "oclusal" | "distal" | "lingual";

const CONDITIONS = {
  caries: { color: "#dc2626", cie: "K02.1" },
  obturacion: { color: "#2563eb", cie: "Z98.8" },
  fractura: { color: "#d97706", cie: "S02.5" },
  sellante: { color: "#16a34a", cie: "Z29.8" },
} as const;

const T = {
  es: {
    conditions: {
      caries: ["Caries", "Caries de la dentina"],
      obturacion: ["Obturación", "Restauración existente"],
      fractura: ["Fractura", "Fractura de diente"],
      sellante: ["Sellante", "Medida profiláctica"],
    },
    faces: { vestibular: "vestibular", mesial: "mesial", oclusal: "oclusal", distal: "distal", lingual: "lingual" },
    erase: "Borrar",
    tooth: "Pieza",
    diagnosis: "Diagnóstico",
    none: "Sin hallazgos.",
  },
  en: {
    conditions: {
      caries: ["Caries", "Caries of dentine"],
      obturacion: ["Filling", "Existing restoration"],
      fractura: ["Fracture", "Fracture of tooth"],
      sellante: ["Sealant", "Prophylactic measure"],
    },
    faces: { vestibular: "buccal", mesial: "mesial", oclusal: "occlusal", distal: "distal", lingual: "lingual" },
    erase: "Erase",
    tooth: "Tooth",
    diagnosis: "Diagnosis (ICD-10)",
    none: "No findings.",
  },
};
type Condition = keyof typeof CONDITIONS;

type Chart = Record<string, Condition>; // clave: "pieza-cara"

function Tooth({
  n,
  chart,
  selected,
  onFace,
  t,
}: {
  t: (typeof T)["es"];
  n: number;
  chart: Chart;
  selected: boolean;
  onFace: (face: Face) => void;
}) {
  const fill = (face: Face) => {
    const c = chart[`${n}-${face}`];
    return c ? CONDITIONS[c].color : "var(--card)";
  };
  // Cara superior/inferior según arcada para que "vestibular" quede siempre hacia afuera
  const upper = n < 30;
  const top: Face = upper ? "vestibular" : "lingual";
  const bottom: Face = upper ? "lingual" : "vestibular";
  // Cuadrantes 1 y 4 se dibujan a la izquierda: su cara mesial mira hacia la línea media (derecha)
  const quadrant = Math.floor(n / 10);
  const left: Face = quadrant === 1 || quadrant === 4 ? "distal" : "mesial";
  const right: Face = left === "distal" ? "mesial" : "distal";
  const poly = (points: string, face: Face) => (
    <polygon
      points={points}
      fill={fill(face)}
      stroke="var(--muted)"
      strokeWidth={0.8}
      className="cursor-pointer transition-opacity hover:opacity-70"
      onClick={() => onFace(face)}
    >
      <title>{`${t.tooth} ${n} · ${t.faces[face]}`}</title>
    </polygon>
  );
  return (
    <div className="flex flex-col items-center gap-0.5">
      {upper && <span className="font-mono text-[10px] text-muted">{n}</span>}
      <svg
        viewBox="0 0 30 30"
        className={`h-7 w-7 sm:h-9 sm:w-9 ${selected ? "rounded ring-2 ring-merged" : ""}`}
      >
        {poly("0,0 30,0 20,10 10,10", top)}
        {poly("0,0 10,10 10,20 0,30", left)}
        {poly("10,10 20,10 20,20 10,20", "oclusal")}
        {poly("30,0 30,30 20,20 20,10", right)}
        {poly("0,30 10,20 20,20 30,30", bottom)}
      </svg>
      {!upper && <span className="font-mono text-[10px] text-muted">{n}</span>}
    </div>
  );
}

export default function Odontograma({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [tool, setTool] = useState<Condition | "borrar">("caries");
  const [chart, setChart] = useState<Chart>({ "16-oclusal": "obturacion", "36-distal": "caries" });
  const [last, setLast] = useState<number | null>(null);

  function mark(n: number, face: Face) {
    setLast(n);
    setChart((prev) => {
      const next = { ...prev };
      const key = `${n}-${face}`;
      if (tool === "borrar" || next[key] === tool) delete next[key];
      else next[key] = tool;
      return next;
    });
  }

  const findings = Object.entries(chart).sort(([a], [b]) => parseInt(a) - parseInt(b));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CONDITIONS) as Condition[]).map((c) => (
          <button
            key={c}
            onClick={() => setTool(c)}
            className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition ${
              tool === c ? "border-ink bg-paper font-semibold" : "border-line"
            }`}
          >
            <span className="h-3 w-3 rounded-sm" style={{ background: CONDITIONS[c].color }} />
            {t.conditions[c][0]}
          </button>
        ))}
        <button
          onClick={() => setTool("borrar")}
          className={`rounded-md border px-3 py-1.5 text-sm ${tool === "borrar" ? "border-ink font-semibold" : "border-line"}`}
        >
          {t.erase}
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-line bg-paper p-3">
        <div className="mx-auto flex w-max flex-col gap-3">
          {[UPPER, LOWER].map((row, i) => (
            <div key={i} className="flex gap-1">
              {row.map((n, j) => (
                <div key={n} className={j === 8 ? "ml-3 border-l border-dashed border-line pl-3" : ""}>
                  <Tooth t={t} n={n} chart={chart} selected={last === n} onFace={(f) => mark(n, f)} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">
          {t.diagnosis} ({findings.length})
        </p>
        {findings.length === 0 ? (
          <p className="text-sm text-muted">{t.none}</p>
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line text-sm">
            {findings.map(([key, c]) => {
              const [n, face] = key.split("-");
              return (
                <li key={key} className="flex items-center justify-between gap-3 px-3 py-2">
                  <span>
                    <b>
                      {t.tooth} {n}
                    </b>{" "}
                    · {t.faces[face as Face]} · {t.conditions[c][0]}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {CONDITIONS[c].cie} {t.conditions[c][1]}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
