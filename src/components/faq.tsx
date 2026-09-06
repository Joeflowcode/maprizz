import { Plus } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { faqJsonLd } from "@/lib/seo";

export function Faq({
  items,
  light = false,
  withSchema = true,
}: {
  items: ReadonlyArray<{ question: string; answer: string }>;
  light?: boolean;
  withSchema?: boolean;
}) {
  return (
    <>
      <div className={light ? "border-t border-cream/15" : "border-t border-ink/15"}>
        {items.map((item, index) => (
          <details
            key={item.question}
            className={`group ${light ? "border-b border-cream/15" : "border-b border-ink/15"}`}
            open={index === 0}
          >
            <summary
              className={`grid cursor-pointer grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-6 text-left font-display text-lg font-semibold tracking-[-0.02em] sm:text-2xl ${
                light ? "text-cream" : "text-ink"
              }`}
            >
              <span className={`label ${light ? "text-accent" : "text-brand"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.question}
              <span aria-hidden="true" className={`faq-icon self-center ${light ? "text-accent" : "text-brand"}`}>
                <Plus className="h-5 w-5" />
              </span>
            </summary>
            <p
              className={`pb-7 pl-14 pr-10 text-[17px] leading-relaxed text-pretty ${light ? "text-mist" : "text-stone"}`}
            >
              {item.answer}
            </p>
          </details>
        ))}
      </div>
      {withSchema ? <JsonLd data={faqJsonLd(items)} /> : null}
    </>
  );
}
