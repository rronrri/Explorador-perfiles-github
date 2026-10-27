"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lang } from "../data/projects";
import { sha256 } from "./hash";

const T = {
  es: { seed: "Semilla pública", list: "Participantes (uno por línea)", hash: "sha256(semilla | lista ordenada)", winner: "Ganador", note: "Cualquiera puede repetir este cálculo con la semilla y la lista publicadas y obtener el mismo ganador.", empty: "Agrega participantes." },
  en: { seed: "Public seed", list: "Participants (one per line)", hash: "sha256(seed | sorted list)", winner: "Winner", note: "Anyone can repeat this calculation with the published seed and list and get the same winner.", empty: "Add participants." },
};

const SAMPLE = ["ana_gta", "LuisPlays", "vicecity_fan", "Carla.R", "mateo-07", "leonida_king", "sofi.games", "JP_Ecuador"];

export default function Sorteo({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [seed, setSeed] = useState("bitcoin-block-912345");
  const [list, setList] = useState(SAMPLE.join("\n"));
  const [result, setResult] = useState<{ hash: string; index: number; winner: string } | null>(null);

  // Ganador = hash(semilla + lista ordenada) mod N: mismo resultado en cualquier computador
  const participants = useMemo(
    () =>
      list
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .sort(),
    [list],
  );

  useEffect(() => {
    if (!participants.length) return;
    let cancelled = false;
    sha256(`${seed}|${participants.join(",")}`).then((hash) => {
      if (cancelled) return;
      const index = Number(BigInt(`0x${hash}`) % BigInt(participants.length));
      setResult({ hash, index, winner: participants[index] });
    });
    return () => {
      cancelled = true;
    };
  }, [seed, participants]);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium">
          {t.seed}
          <input
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-card px-3 py-2 font-mono text-sm"
          />
        </label>
        <label className="text-sm font-medium">
          {t.list}
          <textarea
            value={list}
            onChange={(e) => setList(e.target.value)}
            rows={8}
            className="mt-1 w-full rounded-md border border-line bg-card px-3 py-2 font-mono text-sm"
          />
        </label>
      </div>
      <div className="flex flex-col justify-center gap-4 rounded-lg border border-line bg-paper p-5">
        {result && participants.length ? (
          <>
            <div>
              <p className="font-mono text-xs uppercase text-muted">{t.hash}</p>
              <p className="mt-1 break-all font-mono text-xs">{result.hash}</p>
            </div>
            <p className="font-mono text-xs text-muted">
              hash mod {participants.length} = {result.index}
            </p>
            <div>
              <p className="text-sm text-muted">{t.winner}</p>
              <p className="text-3xl font-bold">{result.winner}</p>
            </div>
            <p className="text-xs text-muted">
              {t.note}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted">{t.empty}</p>
        )}
      </div>
    </div>
  );
}
