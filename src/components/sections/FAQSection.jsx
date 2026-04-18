import { SectionHeading } from '../ui/SectionHeading'

export function FAQSection({ faq }) {
  return (
    <section className="pb-20 pt-16 sm:pb-24 sm:pt-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="FAQ"
          title="Helpful Information"
          description="If you need anything else, feel free to contact us."
        />
        <div className="mx-auto grid max-w-4xl gap-4">
          {faq.map((item) => (
            <details key={item.question} className="romance-card group p-5">
              <summary className="cursor-pointer list-none text-left font-medium text-romance-900">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-romance-700">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
