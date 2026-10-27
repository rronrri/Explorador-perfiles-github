"use client";

import { useState } from "react";

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

const COLUMNS: { id: Column; label: string }[] = [
  { id: "pendiente", label: "Pendiente" },
  { id: "curso", label: "En curso" },
  { id: "aprobacion", label: "En aprobación" },
  { id: "hecho", label: "Hecho" },
];
// Mismos colores por prioridad que la app real
const PRIORITY: Record<Priority, { label: string; bg: string; fg: string }> = {
  baja: { label: "Baja", bg: "#dcfce7", fg: "#166534" },
  media: { label: "Media", bg: "#fef9c3", fg: "#854d0e" },
  alta: { label: "Alta", bg: "#ffedd5", fg: "#9a3412" },
  critica: { label: "Crítica", bg: "#fee2e2", fg: "#991b1b" },
};

const INITIAL: Task[] = [
  { id: 1, title: "Cerrar inventario de octubre", owner: "Ana", due: "28 oct", priority: "alta", column: "curso" },
  { id: 2, title: "Renovar dominio del sitio", owner: "Luis", due: "30 oct", priority: "critica", column: "pendiente" },
  { id: 3, title: "Subir facturas a Drive", owner: "Carla", due: "2 nov", priority: "media", column: "pendiente" },
  { id: 4, title: "Aprobar compra de laptops", owner: "Gerencia", due: "29 oct", priority: "alta", column: "aprobacion" },
  { id: 5, title: "Actualizar manual de onboarding", owner: "Ana", due: "10 nov", priority: "baja", column: "hecho" },
];

export default function Kanban() {
  const [tasks, setTasks] = useState(INITIAL);
  const [dragging, setDragging] = useState<number | null>(null);

  const move = (id: number, column: Column) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, column } : t)));
  const shift = (t: Task, dir: 1 | -1) => {
    const i = COLUMNS.findIndex((c) => c.id === t.column) + dir;
    if (i >= 0 && i < COLUMNS.length) move(t.id, COLUMNS[i].id);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((col) => (
        <div
          key={col.id}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => dragging !== null && move(dragging, col.id)}
          className="flex min-h-40 flex-col gap-2 rounded-lg border border-line bg-paper p-2"
        >
          <p className="px-1 font-mono text-xs uppercase tracking-wide text-muted">
            {col.label} · {tasks.filter((t) => t.column === col.id).length}
          </p>
          {tasks
            .filter((t) => t.column === col.id)
            .map((t) => (
              <article
                key={t.id}
                draggable
                onDragStart={() => setDragging(t.id)}
                onDragEnd={() => setDragging(null)}
                className="cursor-grab rounded-md border-l-4 bg-card p-2.5 text-sm shadow-sm active:cursor-grabbing"
                style={{ borderLeftColor: PRIORITY[t.priority].fg }}
              >
                <p className="font-medium">{t.title}</p>
                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted">
                  <span
                    className="rounded px-1.5 py-0.5 font-medium"
                    style={{ background: PRIORITY[t.priority].bg, color: PRIORITY[t.priority].fg }}
                  >
                    {PRIORITY[t.priority].label}
                  </span>
                  <span>
                    {t.owner} · {t.due}
                  </span>
                </div>
                {/* Botones para mover en pantallas táctiles, donde no hay drag & drop */}
                <div className="mt-2 flex justify-between text-xs">
                  <button onClick={() => shift(t, -1)} aria-label="Mover a la izquierda" className="text-muted hover:text-ink">
                    ←
                  </button>
                  <button onClick={() => shift(t, 1)} aria-label="Mover a la derecha" className="text-muted hover:text-ink">
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
