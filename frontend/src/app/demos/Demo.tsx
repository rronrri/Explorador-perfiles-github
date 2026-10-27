"use client";

import type { DemoId, Lang } from "../data/projects";
import Boton from "./Boton";
import Erp from "./Erp";
import Kanban from "./Kanban";
import Odontograma from "./Odontograma";
import PlantChain from "./PlantChain";
import Pwa from "./Pwa";
import Sorteo from "./Sorteo";
import Verbum from "./Verbum";

export default function Demo({ id, lang }: { id: DemoId; lang: Lang }) {
  switch (id) {
    case "odontograma":
      return <Odontograma lang={lang} />;
    case "erp":
      return <Erp lang={lang} />;
    case "kanban":
      return <Kanban lang={lang} />;
    case "verbum":
      return <Verbum lang={lang} />;
    case "sorteo":
      return <Sorteo lang={lang} />;
    case "boton":
      return <Boton lang={lang} />;
    case "plantchain":
      return <PlantChain lang={lang} />;
    case "pwa":
      return <Pwa lang={lang} />;
    case "video":
      return (
        <video
          src="/media/belta.mp4"
          controls
          muted
          playsInline
          preload="metadata"
          className="w-full rounded-lg border border-line"
        />
      );
  }
}
