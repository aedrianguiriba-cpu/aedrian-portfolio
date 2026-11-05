import { useEffect } from 'react'
import { Download, X } from 'lucide-react'
import { generateResumePdf } from '../lib/generateResumePdf'
import { profile, experience, education, skillGroups, certifications } from '../data'

const roles = profile.role.split('|').map((role) => role.trim())

export default function ResumeModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return

    const handleKeydown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeydown)
    document.documentElement.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeydown)
      document.documentElement.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:p-0 sm:p-8">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm print:hidden"
        onClick={onClose}
      />

      <div className="relative flex h-full max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden border border-accent/25 bg-accent/10 shadow-2xl shadow-black/40 backdrop-blur-2xl print:h-auto print:max-h-none print:border-0 print:bg-white print:shadow-none print:backdrop-blur-none">
        <span className="pointer-events-none absolute -left-px -top-px z-10 h-4 w-4 border-l-2 border-t-2 border-accent/70 print:hidden" />
        <span className="pointer-events-none absolute -right-px -top-px z-10 h-4 w-4 border-r-2 border-t-2 border-accent/70 print:hidden" />
        <span className="pointer-events-none absolute -left-px -bottom-px z-10 h-4 w-4 border-b-2 border-l-2 border-accent/70 print:hidden" />
        <span className="pointer-events-none absolute -right-px -bottom-px z-10 h-4 w-4 border-b-2 border-r-2 border-accent/70 print:hidden" />

        <div className="relative flex items-center justify-between gap-4 border-b border-accent/20 bg-accent/10 px-5 py-3 shadow-[0_1px_16px_var(--color-accent-soft)] backdrop-blur-xl print:hidden">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
            <span className="hud-blink h-1.5 w-1.5 rounded-full bg-accent" />
            Resume<span className="text-accent">.</span>cv
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => generateResumePdf()}
              aria-label="Download resume as PDF"
              className="inline-flex h-8 w-8 items-center justify-center text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
            >
              <Download size={16} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume preview"
              className="inline-flex h-8 w-8 items-center justify-center text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="hud-scrollbar relative overflow-y-auto print:overflow-visible">
          <div className="resume-print relative min-h-full px-6 py-10 sm:px-10 sm:py-12">
            <header className="relative border-b border-border pb-6">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                <span className="hud-blink h-1.5 w-1.5 rounded-full bg-accent" />
                Curriculum Vitae
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{profile.name}</h1>
              <p className="mt-1.5 text-sm font-medium uppercase tracking-wide text-accent">
                {roles.join(' · ')}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-muted">
                <span>{profile.location}</span>
                <span>{profile.github.replace('https://', '')}</span>
                <span>{profile.linkedin.replace('https://www.', '')}</span>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{profile.tagline}</p>
            </header>

            <section className="mt-8">
              <h2 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                <span className="hud-blink h-1.5 w-1.5 rounded-full bg-accent" />
                Experience
              </h2>
              <div className="mt-3 space-y-5 border-t border-border pt-4">
                {experience.map((job) => (
                  <div key={job.role + job.company}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                      <h3 className="text-sm font-semibold text-foreground">{job.role}</h3>
                      <span className="font-mono text-xs text-accent">[ {job.period} ]</span>
                    </div>
                    <p className="text-sm font-medium text-muted">{job.company}</p>
                    {job.points?.length > 0 && (
                      <ul className="mt-1.5 space-y-1">
                        {job.points.map((point) => (
                          <li key={point} className="flex gap-2 text-sm leading-relaxed text-muted">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                <span className="hud-blink h-1.5 w-1.5 rounded-full bg-accent" />
                Education
              </h2>
              <div className="mt-3 space-y-3 border-t border-border pt-4">
                {education.map((item) => (
                  <div key={item.degree}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                      <h3 className="text-sm font-semibold text-foreground">{item.degree}</h3>
                      <span className="font-mono text-xs text-accent">[ {item.period} ]</span>
                    </div>
                    <p className="text-sm font-medium text-muted">{item.school}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                <span className="hud-blink h-1.5 w-1.5 rounded-full bg-accent" />
                Skills
              </h2>
              <div className="mt-3 space-y-2 border-t border-border pt-4">
                {skillGroups.map((group) => (
                  <div key={group.title} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                    <span className="font-semibold text-foreground">{group.title}:</span>
                    <span className="text-muted">{group.items.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                <span className="hud-blink h-1.5 w-1.5 rounded-full bg-accent" />
                Certifications
              </h2>
              <div className="mt-3 space-y-2 border-t border-border pt-4">
                {certifications.map((cert) => (
                  <div key={cert.title} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                    <h3 className="text-sm font-medium text-foreground">{cert.title}</h3>
                    <span className="font-mono text-xs text-accent">[ {cert.year} ]</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
