import Image from "next/image";

export default function VisualSupport() {
  return (
    <section className="px-margin-mobile md:px-margin-desktop py-16 md:py-20">
      <div className="max-w-(--container-max) mx-auto relative rounded-2xl overflow-hidden">
        <div className="relative aspect-[16/9] md:aspect-[21/9]">
          <Image
            src="/images/image-01.jpg"
            alt="Rosario y medalla de la Sagrada Familia sostenidos con devoción"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
          <p className="font-display text-xl md:text-3xl text-white max-w-xl leading-snug">
            &ldquo;Cada pieza se elabora con fe, para acompañar tu vida espiritual&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
