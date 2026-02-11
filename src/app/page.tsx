import Scene from "@/components/Scene";

export default function Home() {
  return (
    <main className="h-screen w-screen bg-slate-950">
      {/* This is the container for our 3D World */}
      <Scene />

      {/* This is a standard 2D UI layer on top */}

    </main>
  );
}