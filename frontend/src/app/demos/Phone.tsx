// Marco de celular para las demos móviles (Verbum, PWA)
export default function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[300px] rounded-[2.2rem] border-[10px] border-ink bg-ink shadow-xl">
      <div className="relative h-[560px] overflow-hidden rounded-[1.6rem] bg-card">{children}</div>
    </div>
  );
}
