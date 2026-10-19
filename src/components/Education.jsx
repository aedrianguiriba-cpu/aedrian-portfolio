import Parallax from './Parallax'
import SectionHeading from './SectionHeading'
import { education } from '../data'

export default function Education() {
  return (
    <section id="education" className="relative scroll-mt-16 overflow-hidden px-6 py-24">
      <Parallax
        speed={0.15}
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-accent/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Education"
          title="Academic background"
          description="Formal training that grounds my technical and analytical work."
        />

        <ol className="mt-16 space-y-10 border-l border-border pl-8">
          {education.map((item) => (
            <li key={item.degree} className="relative">
              <span className="absolute -left-[2.3rem] top-1.5 h-2.5 w-2.5 border-2 border-accent bg-background" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold text-foreground">{item.degree}</h3>
                <span className="font-mono text-sm text-accent">[ {item.period} ]</span>
              </div>
              <p className="mt-1 text-sm font-medium text-muted">{item.school}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
