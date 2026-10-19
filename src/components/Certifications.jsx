import { Award } from 'lucide-react'
import HudPanel from './HudPanel'
import Parallax from './Parallax'
import SectionHeading from './SectionHeading'
import { certifications } from '../data'

export default function Certifications() {
  return (
    <section id="certifications" className="relative scroll-mt-16 overflow-hidden px-6 py-24">
      <Parallax
        speed={0.18}
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Certifications"
          title="Credentials I've earned"
          description="Continued learning across project management, governance, and technical practice."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <HudPanel
              key={cert.title}
              className="flex items-start gap-4 p-6 transition-colors duration-200 hover:border-accent/50"
            >
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-accent/30 bg-accent-soft text-accent">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold leading-snug text-foreground">{cert.title}</h3>
                <p className="mt-1 font-mono text-sm text-accent">[ {cert.year} ]</p>
              </div>
            </HudPanel>
          ))}
        </div>
      </div>
    </section>
  )
}
