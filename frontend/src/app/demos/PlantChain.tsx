"use client";

import { useEffect, useState } from "react";
import { sha256 } from "./hash";

interface Block {
  data: string;
  prev: string;
  hash: string;
}

const EVENTS = ["Riego", "Poda", "Fertilización", "Medición: 1,20 m", "Revisión fitosanitaria"];
const PLACES = ["Parque de la Madre", "Orillas del Tomebamba", "Parque El Paraíso", "Av. Solano"];

async function makeBlock(data: string, prev: string): Promise<Block> {
  return { data, prev, hash: await sha256(prev + data) };
}

export default function PlantChain() {
  const [chain, setChain] = useState<Block[]>([]);
  const [valid, setValid] = useState<boolean[]>([]);

  useEffect(() => {
    makeBlock("Génesis · PlantChain Cuenca", "0".repeat(64)).then((b) => setChain([b]));
  }, []);

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
            append(`Token #${trees + 1} · Árbol nativo · ${PLACES[trees % PLACES.length]}`)
          }
          className="rounded-md bg-[#16a34a] px-3 py-1.5 text-sm font-semibold text-white"
        >
          Apadrinar árbol
        </button>
        <button
          disabled={trees === 0}
          onClick={() => append(`Evento árbol #${trees} · ${EVENTS[chain.length % EVENTS.length]}`)}
          className="rounded-md border border-line px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Registrar cuidado
        </button>
        <button
          disabled={chain.length < 2}
          onClick={() => setChain((c) => c.map((b, i) => (i === 1 ? { ...b, data: b.data + " (alterado)" } : b)))}
          className="rounded-md border border-closed/40 px-3 py-1.5 text-sm text-closed disabled:opacity-40"
        >
          Intentar alterar el bloque 1
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
                Bloque {i} · {b.data}
              </b>
              <span className={`font-mono text-xs ${valid[i] === false ? "text-closed" : "text-open"}`}>
                {valid[i] === false ? "✕ inválido" : "✓ válido"}
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
