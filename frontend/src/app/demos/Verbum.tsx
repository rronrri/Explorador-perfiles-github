"use client";

import { useState } from "react";
import Phone from "./Phone";

const FEED = [
  {
    ref: "Salmo 23:1",
    text: "Jehová es mi pastor; nada me faltará.",
    reflection: "Hoy no estás solo: Dios cuida de ti como un pastor cuida a su rebaño.",
    tags: ["confianza", "paz"],
    bg: "linear-gradient(160deg,#4c1d95,#7c3aed 60%,#c4b5fd)",
  },
  {
    ref: "Mateo 6:14",
    text: "Porque si perdonáis a los hombres sus ofensas, os perdonará también a vosotros vuestro Padre celestial.",
    reflection: "Perdonar libera primero a quien perdona.",
    tags: ["perdón", "familia"],
    bg: "linear-gradient(160deg,#78350f,#d97706 60%,#fde68a)",
  },
  {
    ref: "Isaías 40:31",
    text: "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas.",
    reflection: "La esperanza renueva las fuerzas en cualquier edad.",
    tags: ["esperanza", "fuerza"],
    bg: "linear-gradient(160deg,#0c4a6e,#0284c7 60%,#bae6fd)",
  },
  {
    ref: "1 Corintios 13:4",
    text: "El amor es sufrido, es benigno; el amor no tiene envidia.",
    reflection: "Un gesto amable hoy puede cambiarle el día a alguien.",
    tags: ["amor", "familia"],
    bg: "linear-gradient(160deg,#831843,#db2777 60%,#fbcfe8)",
  },
];

export default function Verbum() {
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const q = query.trim().toLowerCase();
  // Búsqueda "semántica" simulada: por tema, no solo por palabra exacta
  const items = q
    ? FEED.filter((f) => f.tags.some((t) => t.startsWith(q)) || f.text.toLowerCase().includes(q))
    : FEED;

  return (
    <Phone>
      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="¿Qué dice la Biblia sobre…?"
          className="w-full rounded-full bg-white/95 px-4 py-2.5 text-base text-black outline-none"
        />
      </div>
      <div className="h-full snap-y snap-mandatory overflow-y-auto">
        {items.length === 0 && (
          <p className="p-6 pt-24 text-center text-lg text-muted">Prueba con: perdón, esperanza, familia…</p>
        )}
        {items.map((f) => (
          <section
            key={f.ref}
            className="relative flex h-full snap-start flex-col justify-end gap-3 p-6 pb-10 text-white"
            style={{ background: f.bg }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Video del día</p>
            <p className="text-2xl font-semibold leading-snug">“{f.text}”</p>
            <p className="text-lg font-bold">{f.ref}</p>
            <p className="text-base opacity-90">{f.reflection}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setSaved((s) => (s.includes(f.ref) ? s.filter((x) => x !== f.ref) : [...s, f.ref]))}
                className="rounded-full bg-white/20 px-4 py-2 text-base font-semibold backdrop-blur"
              >
                {saved.includes(f.ref) ? "★ Guardado" : "☆ Guardar"}
              </button>
              <span className="rounded-full bg-white/20 px-4 py-2 text-base font-semibold backdrop-blur">
                Compartir
              </span>
            </div>
          </section>
        ))}
      </div>
    </Phone>
  );
}
