const pilares = [
  {
    icono: "🌿",
    titulo: "Naturaleza",
    descripcion: "Materiales puros y sagrados.",
  },
  {
    icono: "📖",
    titulo: "Sabiduría",
    descripcion: "Conocimiento ancestral.",
  },
  {
    icono: "🤍",
    titulo: "Compasión",
    descripcion: "Cuidado centrado en el alma.",
  },
];

export default function AboutSection() {
  return (
    <section id="nuestra-esencia" className="py-20 md:py-24 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-(--container-max) mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Nuestra Esencia
          </h2>
          <div className="w-16 h-0.5 bg-secondary mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20">
            <h3 className="font-display text-xl text-primary mb-4">
              El Legado de Santa Hildegarda
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              Inspirados por las enseñanzas de Santa Hildegarda de Bingen,
              doctora de la Iglesia y pionera en la medicina natural, unimos la
              profunda espiritualidad católica con la artesanía de bisutería
              devocional. Creemos en la <em>viriditas</em>, la fuerza vital y
              sanadora otorgada por Dios, que guía cada pieza que creamos.
            </p>
          </div>

          <div className="md:col-span-4 bg-primary-container text-on-primary-container rounded-2xl p-8 flex flex-col gap-4">
            <span className="text-3xl">🙏</span>
            <h3 className="font-display text-xl text-on-primary">Misión</h3>
            <p className="text-on-primary-container/90 leading-relaxed">
              Acompañar la vida espiritual de nuestra comunidad a través de
              bisutería católica elaborada con devoción y materiales nobles.
            </p>
          </div>

          <div className="md:col-span-8 bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20">
            <h3 className="font-display text-xl text-primary mb-6">
              Nuestros Pilares
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {pilares.map((pilar) => (
                <div key={pilar.titulo} className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden="true">
                    {pilar.icono}
                  </span>
                  <div>
                    <h4 className="font-semibold text-primary text-sm mb-1">
                      {pilar.titulo}
                    </h4>
                    <p className="text-on-surface-variant text-sm">
                      {pilar.descripcion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 flex flex-col gap-4">
            <span className="text-3xl">✨</span>
            <h3 className="font-display text-xl text-primary">Visión</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Ser un referente en bisutería católica, reconocidos por nuestra
              devoción, excelencia artesanal y fidelidad a la fe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
