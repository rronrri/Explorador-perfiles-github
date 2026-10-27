"use client";

import { useEffect, useState } from "react";
import type { Lang } from "../data/projects";
import { MEDIA } from "../data/media";

// Video del recorrido + galería de capturas reales, con visor ampliado
export default function Showcase({ slug, lang }: { slug: string; lang: Lang }) {
  const media = MEDIA[slug];
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % media.shots.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + media.shots.length) % media.shots.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, media]);

  if (!media) return null;
  const src = (file: string) => `/media/${slug}/${file}`;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted">{media.note[lang]}</p>
      {media.video && (
        <video
          src={src(media.video)}
          poster={media.shots[0] ? src(media.shots[0].file) : undefined}
          controls
          muted
          playsInline
          preload="metadata"
          className={`rounded-lg border border-line bg-black ${media.vertical ? "mx-auto max-h-[640px]" : "w-full"}`}
        />
      )}
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {media.shots.map((s, i) => (
          <li key={s.file}>
            <button
              onClick={() => setOpen(i)}
              className="group block w-full overflow-hidden rounded-lg border border-line bg-paper text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src(s.file)}
                alt={s[lang]}
                loading="lazy"
                className={`w-full object-cover object-top transition group-hover:opacity-90 ${
                  media.vertical ? "aspect-[9/16]" : "aspect-[16/10]"
                }`}
              />
              <span className="block px-2.5 py-2 text-xs text-muted">{s[lang]}</span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/85 p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src(media.shots[open].file)}
            alt={media.shots[open][lang]}
            className="max-h-[85vh] max-w-full rounded-md object-contain"
          />
          <p className="text-sm text-white/90">
            {media.shots[open][lang]} · {open + 1}/{media.shots.length}
          </p>
        </div>
      )}
    </div>
  );
}
