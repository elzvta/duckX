export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold text-gradient">duckX</h1>
      <p className="text-foreground text-lg">Design system smoke test</p>
      <p className="text-muted-foreground text-sm">
        Montserrat · Tailwind v4 · mpmX.ai design tokens
      </p>
      <div className="glass rounded-lg p-6 w-full max-w-sm glow-green">
        <p className="text-foreground font-semibold mb-2">Glass card</p>
        <p className="text-muted-foreground text-sm">
          Glassmorphism with neon green glow
        </p>
      </div>
      <div className="flex gap-4">
        <div className="w-4 h-4 rounded-full bg-neon-green" title="neon-green" />
        <div className="w-4 h-4 rounded-full bg-neon-blue" title="neon-blue" />
        <div className="w-4 h-4 rounded-full bg-neon-teal" title="neon-teal" />
      </div>
    </main>
  );
}
