"use client";

import { useEffect, useState } from "react";
import type { Lang } from "../data/projects";
import { sha256 } from "./hash";

interface Block {
  data: string;
  prev: string;
  hash: string;
}

const T = {
  es: {
    events: ["Riego", "Poda", "Fertilización", "Medición: 1,20 m", "Revisión fitosanitaria"],
    genesis: "Génesis · PlantChain Cuenca",
    token: (n: number, place: string) => `Token #${n} · Árbol nativo · ${place}`,
    event: (n: number, e: string) => `Evento árbol #${n} · ${e}`,
    tampered: " (alterado)",
    sponsor: "Apadrinar árbol",
    care: "Registrar cuidado",
    tamper: "Intentar alterar el bloque 1",
    block: "Bloque",
    valid: "✓ válido",
    invalid: "✕ inválido",
  },
  en: {
    events: ["Watering", "Pruning", "Fertilizing", "Measurement: 1.20 m", "Plant health check"],
    genesis: "Genesis · PlantChain Cuenca",
    token: (n: number, place: string) => `Token #${n} · Native tree · ${place}`,
    event: (n: number, e: string) => `Tree #${n} event · ${e}`,
    tampered: " (tampered)",
    sponsor: "Sponsor a tree",
    care: "Record care",
    tamper: "Try to tamper with block 1",
    block: "Block",
    valid: "✓ valid",
    invalid: "✕ invalid",
  },
};
const PLACES = ["Parque de la Madre", "Orillas del Tomebamba", "Parque El Paraíso", "Av. Solano"];

async function makeBlock(data: string, prev: string): Promise<Block> {
  return { data, prev, hash: await sha256(prev + data) };
}

export default function PlantChain({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [chain, setChain] = useState<Block[]>([]);
  const [valid, setValid] = useState<boolean[]>([]);

  useEffect(() => {
    makeBlock(t.genesis, "0".repeat(64)).then((b) => setChain([b]));
  }, [t]);

  // Un bloque es válido si su hash coincide con su contenido y enlaza el hash del anterior
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      chain.map(async (b, i) => (await sha256(b.prev + b.data)) === b.hash && (i === 0 || b.prev === chain[i - 1].hash)),
    ).then((v) => !cancelled && setValid(v));
    return () => {
      cancelled = true;
    };
  }, [chain]);

  async function append(data: string) {
    const prev = chain[chain.length - 1];
    if (!prev) return;
    const block = await makeBlock(data, prev.hash);
    setChain((c) => [...c, block]);
  }

  const trees = chain.filter((b) => b.data.startsWith("Token")).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() =>
            append(t.token(trees + 1, PLACES[trees % PLACES.length]))
          }
          className="rounded-md bg-[#16a34a] px-3 py-1.5 text-sm font-semibold text-white"
        >
          {t.sponsor}
        </button>
        <button
          disabled={trees === 0}
          onClick={() => append(t.event(trees, t.events[chain.length % t.events.length]))}
          className="rounded-md border border-line px-3 py-1.5 text-sm disabled:opacity-40"
        >
          {t.care}
        </button>
        <button
          disabled={chain.length < 2}
          onClick={() => setChain((c) => c.map((b, i) => (i === 1 ? { ...b, data: b.data + t.tampered } : b)))}
          className="rounded-md border border-closed/40 px-3 py-1.5 text-sm text-closed disabled:opacity-40"
        >
          {t.tamper}
        </button>
      </div>
      <ol className="flex flex-col gap-2">
        {chain.map((b, i) => (
          <li
            key={i}
            className={`rounded-lg border p-3 text-sm ${
              valid[i] === false ? "border-closed bg-closed-soft" : "border-line bg-paper"
            }`}
          >
            <div className="flex justify-between gap-2">
              <b>
                {t.block} {i} · {b.data}
              </b>
              <span className={`font-mono text-xs ${valid[i] === false ? "text-closed" : "text-open"}`}>
                {valid[i] === false ? t.invalid : t.valid}
              </span>
            </div>
            <p className="mt-1 break-all font-mono text-[11px] text-muted">prev {b.prev.slice(0, 24)}…</p>
            <p className="break-all font-mono text-[11px] text-muted">hash {b.hash.slice(0, 24)}…</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
