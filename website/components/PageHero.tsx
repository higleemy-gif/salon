import { Reveal } from "@/components/ui";

export function PageHero({
  eyebrow,
  title,
  subtitle
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative bg-black-pure pt-40 sm:pt-44 pb-14 sm:pb-20 overflow-hidden">
      <div
        className="absolute inset-x-0 top-24 mx-auto h-64 w-[600px] max-w-full rounded-full opacity-10 blur-3xl"
        style={{ backgroundImage: "var(--gradient-gold)" }}
      />
      <div className="relative container-narrow text-center">
        <Reveal>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="heading-serif mt-4 text-4xl sm:text-6xl md:text-7xl text-gold-light">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-gold-pale/75">
              {subtitle}
            </p>
          )}
          <div
            className="mx-auto mt-8 h-px w-28"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          />
        </Reveal>
      </div>
    </section>
  );
}
