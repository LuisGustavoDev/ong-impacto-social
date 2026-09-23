export default function Home() {
  return (
    <main id="conteudo" className="flex-1">
      {/* Placeholders temporários só para testar os links âncora da Navbar. */}
      {["inicio", "causa", "impacto", "como-ajudar", "historias"].map((id) => (
        <section
          key={id}
          id={id}
          className="grid h-[70vh] place-items-center border-b border-dashed border-slate-300 text-2xl font-bold text-ink odd:bg-surface"
        >
          #{id}
        </section>
      ))}
    </main>
  );
}