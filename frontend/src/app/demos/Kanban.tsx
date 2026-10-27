"use client";

import { useState } from "react";
import type { Lang } from "../data/projects";

type Priority = "baja" | "media" | "alta" | "critica";
type Column = "pendiente" | "curso" | "aprobacion" | "hecho";
interface Task {
  id: number;
  title: string;
  owner: string;
  due: string;
  priority: Priority;
  column: Column;
}

const COLUMNS: Column[] = ["pendiente", "curso", "aprobacion", "hecho"];
// Mismos colores por prioridad que la app real
const PRIORITY: Record<Priority, { bg: string; fg: string }> = {
  baja: { bg: "#dcfce7", fg: "#166534" },
  media: { bg: "#fef9c3", fg: "#854d0e" },
  alta: { bg: "#ffedd5", fg: "#9a3412" },
  critica: { bg: "#fee2e2", fg: "#991b1b" },
};

const T = {
  es: {
    columns: { pendiente: "Pendiente", curso: "En curso", aprobacion: "En aprobación", hecho: "Hecho" },
    priority: { baja: "Baja", media: "Media", alta: "Alta", critica: "Crítica" },
    titles: [
      "Cerrar inventario de octubre",
      "Renovar dominio del sitio",
      "Subir facturas a Drive",
      "Aprobar compra de laptops",
      "Actualizar manual de onboarding",
    ],
    left: "Mover a la izquierda",
    right: "Mover a la derecha",
  },
  en: {
    columns: { pendiente: "To do", curso: "In progress", aprobacion: "Awaiting approval", hecho: "Done" },
    priority: { baja: "Low", media: "Medium", alta: "High", critica: "Critical" },
    titles: [
      "Close October inventory",
      "Renew website domain",
      "Upload invoices to Drive",
      "Approve laptop purchase",
      "Update onboarding handbook",
    ],
    left: "Move left",
    right: "Move right",
  },
};

const INITIAL: Task[] = [
  { id: 1, title: "Cerrar inventario de octubre", owner: "Ana", due: "28 oct", priority: "alta", column: "curso" },
  { id: 2, title: "Renovar dominio del sitio", owner: "Luis", due: "30 oct", priority: "critica", column: "pendiente" },
  { id: 3, title: "Subir facturas a Drive", owner: "Carla", due: "2 nov", priority: "media", column: "pendiente" },
  { id: 4, title: "Aprobar compra de laptops", owner: "Gerencia", due: "29 oct", priority: "alta", column: "aprobacion" },
  { id: 5, title: "Actualizar manual de onboarding", owner: "Ana", due: "10 nov", priority: "baja", column: "hecho" },
];

export default function Kanban({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [tasks, setTasks] = useState(INITIAL);
  const [dragging, setDragging] = useState<number | null>(null);

  const move = (id: number, column: Column) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, column } : t)));
  const shift = (task: Task, dir: 1 | -1) => {
    const i = COLUMNS.indexOf(task.column) + dir;
    if (i >= 0 && i < COLUMNS.length) move(task.id, COLUMNS[i]);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((col) => (
        <div
          key={col}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => dragging !== null && move(dragging, col)}
          className="flex min-h-40 flex-col gap-2 rounded-lg border border-line bg-paper p-2"
        >
          <p className="px-1 font-mono text-xs uppercase tracking-wide text-muted">
            {t.columns[col]} · {tasks.filter((task) => task.column === col).length}
          </p>
          {tasks
            .filter((task) => task.column === col)
            .map((task) => (
              <article
                key={task.id}
                draggable
                onDragStart={() => setDragging(task.id)}
                onDragEnd={() => setDragging(null)}
                className="cursor-grab rounded-md border-l-4 bg-card p-2.5 text-sm shadow-sm active:cursor-grabbing"
                style={{ borderLeftColor: PRIORITY[task.priority].fg }}
              >
                <p className="font-medium">{t.titles[task.id - 1]}</p>
                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted">
                  <span
                    className="rounded px-1.5 py-0.5 font-medium"
                    style={{ background: PRIORITY[task.priority].bg, color: PRIORITY[task.priority].fg }}
                  >
                    {t.priority[task.priority]}
                  </span>
                  <span>
                    {task.owner} · {task.due}
                  </span>
                </div>
                {/* Botones para mover en pantallas táctiles, donde no hay drag & drop */}
                <div className="mt-2 flex justify-between text-xs">
                  <button onClick={() => shift(task, -1)} aria-label={t.left} className="text-muted hover:text-ink">
                    ←
                  </button>
                  <button onClick={() => shift(task, 1)} aria-label={t.right} className="text-muted hover:text-ink">
                    →
                  </button>
                </div>
              </article>
            ))}
        </div>
      ))}
    </div>
  );
}
