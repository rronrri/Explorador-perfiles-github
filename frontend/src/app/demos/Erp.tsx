"use client";

import { FormEvent, useMemo, useState } from "react";

type MovementType = "COMPRA" | "CONSUMO_PRODUCCION" | "VENTA" | "DEVOLUCION";
interface Movement {
  id: number;
  date: string;
  material: string;
  type: MovementType;
  grams: number; // positivo entra, negativo sale
}

const MATERIALS = ["Oro 18k", "Plata 925"];
const SIGN: Record<MovementType, 1 | -1> = {
  COMPRA: 1,
  DEVOLUCION: 1,
  CONSUMO_PRODUCCION: -1,
  VENTA: -1,
};
const STAGES = ["Fundición", "Armado", "Pulido", "Terminado"];

const fmt = (g: number) => `${g.toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} g`;

export default function Erp() {
  const [movements, setMovements] = useState<Movement[]>([
    { id: 1, date: "2026-10-01", material: "Oro 18k", type: "COMPRA", grams: 250 },
    { id: 2, date: "2026-10-03", material: "Plata 925", type: "COMPRA", grams: 800 },
    { id: 3, date: "2026-10-05", material: "Oro 18k", type: "CONSUMO_PRODUCCION", grams: -120 },
    { id: 4, date: "2026-10-09", material: "Plata 925", type: "VENTA", grams: -95.5 },
  ]);
  const [material, setMaterial] = useState(MATERIALS[0]);
  const [type, setType] = useState<MovementType>("COMPRA");
  const [grams, setGrams] = useState("10");

  // Orden de producción: gramos entregados a cada etapa y recibidos de vuelta
  const [stage, setStage] = useState(0);
  const [acts, setActs] = useState<{ stage: string; delivered: number; received: number }[]>([]);
  const [current, setCurrent] = useState(120);
  const [received, setReceived] = useState("118.6");

  // El saldo nunca se edita: siempre es la suma del historial
  const balances = useMemo(
    () =>
      MATERIALS.map((m) => ({
        material: m,
        balance: movements.filter((x) => x.material === m).reduce((s, x) => s + x.grams, 0),
      })),
    [movements],
  );

  function addMovement(e: FormEvent) {
    e.preventDefault();
    const g = Math.abs(parseFloat(grams));
    if (!g) return;
    setMovements((prev) => [
      ...prev,
      { id: prev.length + 1, date: new Date().toISOString().slice(0, 10), material, type, grams: g * SIGN[type] },
    ]);
  }

  function closeStage(e: FormEvent) {
    e.preventDefault();
    const r = parseFloat(received);
    if (!(r > 0) || r > current || stage >= STAGES.length - 1) return;
    setActs((prev) => [...prev, { stage: STAGES[stage], delivered: current, received: r }]);
    setCurrent(r);
    setStage((s) => s + 1);
    setReceived((r * 0.99).toFixed(2));
  }

  const totalLoss = acts.reduce((s, a) => s + a.delivered - a.received, 0);
  const input = "rounded-md border border-line bg-card px-2 py-1.5 text-sm";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="flex flex-col gap-3">
        <h3 className="font-semibold">Inventario por movimientos</h3>
        <div className="grid grid-cols-2 gap-2">
          {balances.map((b) => (
            <div key={b.material} className="rounded-lg border border-line bg-paper p-3">
              <p className="text-xs text-muted">{b.material}</p>
              <p className="font-mono text-lg font-semibold">{fmt(b.balance)}</p>
            </div>
          ))}
        </div>
        <form onSubmit={addMovement} className="flex flex-wrap gap-2">
          <select value={material} onChange={(e) => setMaterial(e.target.value)} className={input}>
            {MATERIALS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value as MovementType)} className={input}>
            {(Object.keys(SIGN) as MovementType[]).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            min="0"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
            className={`${input} w-24 font-mono`}
            aria-label="Gramos"
          />
          <button className="rounded-md bg-ink px-3 py-1.5 text-sm font-semibold text-paper">Registrar</button>
        </form>
        <div className="max-h-56 overflow-y-auto rounded-lg border border-line">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-paper text-muted">
              <tr>
                <th className="px-2 py-1.5">Fecha</th>
                <th className="px-2">Material</th>
                <th className="px-2">Tipo</th>
                <th className="px-2 text-right">Gramos</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {[...movements].reverse().map((m) => (
                <tr key={m.id} className="border-t border-line">
                  <td className="px-2 py-1.5">{m.date}</td>
                  <td className="px-2">{m.material}</td>
                  <td className="px-2">{m.type}</td>
                  <td className={`px-2 text-right ${m.grams < 0 ? "text-closed" : "text-open"}`}>
                    {m.grams > 0 ? "+" : ""}
                    {m.grams.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="font-semibold">Orden de producción OP-0142 · Anillo oro 18k</h3>
        <ol className="flex gap-1">
          {STAGES.map((s, i) => (
            <li
              key={s}
              className={`flex-1 rounded-md px-2 py-1.5 text-center text-xs font-medium ${
                i < stage ? "bg-open-soft text-open" : i === stage ? "bg-ink text-paper" : "bg-paper text-muted"
              }`}
            >
              {s}
            </li>
          ))}
        </ol>
        {stage < STAGES.length - 1 ? (
          <form onSubmit={closeStage} className="flex flex-wrap items-center gap-2 text-sm">
            <span>
              Acta de {STAGES[stage]}: entregado <b className="font-mono">{fmt(current)}</b>, recibido
            </span>
            <input
              type="number"
              step="0.01"
              value={received}
              onChange={(e) => setReceived(e.target.value)}
              className={`${input} w-24 font-mono`}
              aria-label="Gramos recibidos"
            />
            <button className="rounded-md bg-ink px-3 py-1.5 font-semibold text-paper">Cerrar etapa</button>
          </form>
        ) : (
          <p className="text-sm text-open">Orden terminada: {fmt(current)} de producto final.</p>
        )}
        <ul className="divide-y divide-line rounded-lg border border-line text-sm">
          {acts.length === 0 && <li className="px-3 py-2 text-muted">Aún no hay actas.</li>}
          {acts.map((a) => (
            <li key={a.stage} className="flex justify-between px-3 py-2 font-mono text-xs">
              <span>{a.stage}</span>
              <span>
                {fmt(a.delivered)} → {fmt(a.received)}{" "}
                <span className="text-closed">merma {fmt(a.delivered - a.received)}</span>
              </span>
            </li>
          ))}
        </ul>
        {acts.length > 0 && (
          <p className="text-sm">
            Merma acumulada: <b className="font-mono">{fmt(totalLoss)}</b> ({((totalLoss / 120) * 100).toFixed(2)} %)
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setStage(0);
            setActs([]);
            setCurrent(120);
            setReceived("118.6");
          }}
          className="self-start text-xs text-muted underline"
        >
          Reiniciar orden
        </button>
      </section>
    </div>
  );
}
