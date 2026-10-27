"use client";

import type { DemoId } from "../data/projects";
import Boton from "./Boton";
import Erp from "./Erp";
import Kanban from "./Kanban";
import Odontograma from "./Odontograma";
import PlantChain from "./PlantChain";
import Pwa from "./Pwa";
import Sorteo from "./Sorteo";
import Verbum from "./Verbum";

export default function Demo({ id }: { id: DemoId }) {
  switch (id) {
    case "odontograma":
      return <Odontograma />;
    case "erp":
      return <Erp />;
    case "kanban":
      return <Kanban />;
    case "verbum":
      return <Verbum />;
    case "sorteo":
      return <Sorteo />;
    case "boton":
      return <Boton />;
    case "plantchain":
      return <PlantChain />;
    case "pwa":
      return <Pwa />;
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
