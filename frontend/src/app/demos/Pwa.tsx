"use client";

import { useEffect, useState } from "react";
import type { Lang } from "../data/projects";
import Phone from "./Phone";

const START = new Date("2024-03-03T00:00:00");
const T = {
  es: {
    phrases: ["Cada día contigo es mi favorito.", "Gracias por hacer simples los días difíciles.", "Contigo hasta los lunes son buenos."],
    app: "Nosotros",
    now: "ahora",
    notif: (d: number) => `Hoy cumplimos ${d} días 💗`,
    since: "Juntos desde hace",
    days: "días",
    memories: "Recuerdos · datos de ejemplo",
  },
  en: {
    phrases: ["Every day with you is my favorite.", "Thank you for making hard days simple.", "With you, even Mondays are good."],
    app: "Us",
    now: "now",
    notif: (d: number) => `Today we reach ${d} days 💗`,
    since: "Together for",
    days: "days",
    memories: "Memories · sample data",
  },
};

export default function Pwa({ lang }: { lang: Lang }) {
  const t = T[lang];
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
  const phrase = now ? t.phrases[now.getDate() % t.phrases.length] : "";

  return (
    <Phone>
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#ffe4e6] to-[#fff1f2] p-6 text-center text-[#881337]">
        {toast && (
          <button
            onClick={() => setToast(false)}
            className="absolute inset-x-3 top-3 rounded-2xl bg-white/95 p-3 text-left text-xs text-black shadow-lg"
          >
            <b>{t.app}</b> · {t.now}
            <br />
            {t.notif(days)}
          </button>
        )}
        <p className="text-sm uppercase tracking-widest">{t.since}</p>
        <p className="text-6xl font-bold">{days}</p>
        <p className="text-lg">{t.days}</p>
        <p className="mt-4 text-base italic">“{phrase}”</p>
        <div className="mt-6 grid w-full grid-cols-3 gap-2">
          {["#fda4af", "#fecdd3", "#fb7185"].map((c) => (
            <div key={c} className="aspect-square rounded-lg" style={{ background: c }} />
          ))}
        </div>
        <p className="text-xs opacity-70">{t.memories}</p>
      </div>
    </Phone>
  );
}
