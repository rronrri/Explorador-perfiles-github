"use client";

import { useEffect, useState } from "react";
import Phone from "./Phone";

const START = new Date("2024-03-03T00:00:00");
const PHRASES = [
  "Cada día contigo es mi favorito.",
  "Gracias por hacer simples los días difíciles.",
  "Contigo hasta los lunes son buenos.",
];

export default function Pwa() {
  const [now, setNow] = useState<Date | null>(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    // La fecha se toma al montar (no en el build estático) para evitar desajustes de hidratación
    const t0 = setTimeout(() => setNow(new Date()), 0);
    const t = setTimeout(() => setToast(true), 1200);
    return () => {
      clearTimeout(t0);
      clearTimeout(t);
    };
  }, []);

  const days = now ? Math.floor((now.getTime() - START.getTime()) / 86_400_000) : 0;
  const phrase = now ? PHRASES[now.getDate() % PHRASES.length] : "";

  return (
    <Phone>
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#ffe4e6] to-[#fff1f2] p-6 text-center text-[#881337]">
        {toast && (
          <button
            onClick={() => setToast(false)}
            className="absolute inset-x-3 top-3 rounded-2xl bg-white/95 p-3 text-left text-xs text-black shadow-lg"
          >
            <b>Nosotros</b> · ahora
            <br />
            Hoy cumplimos {days} días 💗
          </button>
        )}
        <p className="text-sm uppercase tracking-widest">Juntos desde hace</p>
        <p className="text-6xl font-bold">{days}</p>
        <p className="text-lg">días</p>
        <p className="mt-4 text-base italic">“{phrase}”</p>
        <div className="mt-6 grid w-full grid-cols-3 gap-2">
          {["#fda4af", "#fecdd3", "#fb7185"].map((c) => (
            <div key={c} className="aspect-square rounded-lg" style={{ background: c }} />
          ))}
        </div>
        <p className="text-xs opacity-70">Recuerdos · datos de ejemplo</p>
      </div>
    </Phone>
  );
}
