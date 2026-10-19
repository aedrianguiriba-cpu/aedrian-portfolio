import Parallax from './Parallax'
import SectionHeading from './SectionHeading'
import { experience } from '../data'

export default function Experience() {
  return (
    <section id="experience" className="relative scroll-mt-16 overflow-hidden px-6 py-24">
      <Parallax
        speed={0.18}
        className="pointer-events-none absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-accent/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've worked"
          description="A track record spanning software development, education, and design."
        />

        <ol className="mt-16 space-y-10 border-l border-border pl-8">
          {experience.map((job) => (
            <li key={job.role + job.company} className="relative">
              <span className="absolute -left-[2.3rem] top-1.5 h-2.5 w-2.5 border-2 border-accent bg-background" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold text-foreground">{job.role}</h3>
                <span className="font-mono text-sm text-accent">[ {job.period} ]</span>
              </div>
              <p className="mt-1 text-sm font-medium text-muted">{job.company}</p>
              {job.points?.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {job.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
