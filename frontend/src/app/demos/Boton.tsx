"use client";

import { useEffect, useRef, useState } from "react";

const ROUND_SECONDS = 20;
const BOTS = [
  { name: "turbo_dedo", cps: 6.5 },
  { name: "click_master", cps: 5.2 },
  { name: "mateo-07", cps: 4.1 },
  { name: "ana_gta", cps: 3.3 },
];
// Clics humanos tienen variación; un script hace intervalos casi idénticos
const MIN_SAMPLES = 15;
const MAX_HUMAN_STDDEV_MS = 6;

function stddev(xs: number[]) {
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  return Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length);
}

export default function Boton() {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [mine, setMine] = useState(0);
  const [bots, setBots] = useState(BOTS.map(() => 0));
  const [batches, setBatches] = useState<number[]>([]);
  const [flagged, setFlagged] = useState(false);
  const pending = useRef(0);
  const times = useRef<number[]>([]);

  // La ronda termina sola cuando el contador llega a 0
  const active = running && timeLeft > 0;

  useEffect(() => {
    if (!active) return;
    const tick = setInterval(() => {
      // Cada segundo: el cliente envía un lote y los bots avanzan
      const batch = pending.current;
      pending.current = 0;
      setMine((m) => m + batch);
      setBatches((b) => [batch, ...b].slice(0, 6));
      setBots((prev) => prev.map((v, i) => v + Math.max(0, Math.round(BOTS[i].cps + (Math.random() - 0.5) * 3))));
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(tick);
  }, [active]);

  function start() {
    pending.current = 0;
    times.current = [];
    setMine(0);
    setBots(BOTS.map(() => 0));
    setBatches([]);
    setFlagged(false);
    setTimeLeft(ROUND_SECONDS);
    setRunning(true);
  }

  function press() {
    if (!active) return;
    pending.current += 1;
    const now = performance.now();
    times.current = [...times.current, now].slice(-MIN_SAMPLES - 1);
    if (times.current.length > MIN_SAMPLES) {
      const gaps = times.current.slice(1).map((t, i) => t - times.current[i]);
      if (stddev(gaps) < MAX_HUMAN_STDDEV_MS) setFlagged(true);
    }
  }

  const board = [
    { name: flagged ? "tú (en revisión)" : "tú", score: flagged ? 0 : mine, me: true },
    ...BOTS.map((b, i) => ({ name: b.name, score: bots[i], me: false })),
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="grid items-center gap-6 md:grid-cols-[1fr_1fr]">
      <div className="flex flex-col items-center gap-4">
        <p className="font-mono text-sm text-muted">
          {active ? `Ronda en curso · ${timeLeft}s` : timeLeft <= 0 ? "Ronda cerrada" : `Ronda de ${ROUND_SECONDS}s`}
        </p>
        <button
          onPointerDown={active ? press : start}
          className="h-40 w-40 select-none rounded-full bg-[#dc2626] text-lg font-bold text-white shadow-[0_8px_0_#991b1b] transition active:translate-y-1.5 active:shadow-[0_2px_0_#991b1b]"
        >
          {active ? "¡DALE!" : "Empezar"}
        </button>
        <p className="font-mono text-xs text-muted">
          Lotes enviados: {batches.length ? batches.join(" · ") : "—"}
        </p>
        {flagged && (
          <p className="rounded-md bg-closed-soft px-3 py-2 text-center text-xs text-closed">
            Ritmo demasiado regular: el anti-trampa marcó la sesión para revisión.
          </p>
        )}
      </div>
      <ol className="flex flex-col gap-1.5">
        <p className="mb-1 font-mono text-xs uppercase tracking-wide text-muted">Top en vivo</p>
        {board.map((r, i) => (
          <li
            key={r.name}
            className={`flex justify-between rounded-md px-3 py-2 text-sm ${r.me ? "bg-ink text-paper" : "bg-paper"}`}
          >
            <span>
              {i + 1}. {r.name}
            </span>
            <span className="font-mono">{r.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
