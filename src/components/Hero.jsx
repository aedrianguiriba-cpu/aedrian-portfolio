import { useState } from 'react'
import { ArrowDown, ArrowUpRight, Award, Briefcase, CalendarClock, MapPin } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons'
import HudPanel from './HudPanel'
import Parallax from './Parallax'
import ResumeModal from './ResumeModal'
import { profile, stats } from '../data'

const roles = profile.role.split('|').map((role) => role.trim())

const STAT_ICONS = [CalendarClock, Briefcase, Award]

export default function Hero() {
  const [resumeOpen, setResumeOpen] = useState(false)

  return (
    <section
      id="home"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-6 pt-24 pb-16 md:pt-16"
    >
      <Parallax
        speed={0.08}
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
      />
      <Parallax
        speed={0.22}
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-10">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-sm text-muted">
              <span className="hud-blink h-2 w-2 rounded-full bg-accent" />
              Available for new opportunities
            </p>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-sm text-muted">
              <MapPin size={14} />
              {profile.location}
            </p>
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Hi, I'm {profile.name.split(' ')[0]},
            <br />
            <span className="text-accent text-glow">builder, designer & educator</span>
          </h1>

          <div className="mt-5 flex flex-wrap gap-2">
            {roles.map((role, i) => (
              <span
                key={role}
                className={`rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide ${
                  i === 0
                    ? 'border-accent/40 bg-accent-soft text-accent'
                    : 'border-border bg-surface/60 text-muted'
                }`}
              >
                {role}
              </span>
            ))}
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {profile.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#experience"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#06160d] shadow-lg shadow-accent/20 transition-transform duration-200 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
            >
              View my experience
              <ArrowUpRight size={18} />
            </a>
            <button
              type="button"
              onClick={() => setResumeOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:scale-[1.03] hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
            >
              View resume
              <ArrowUpRight size={18} />
            </button>
            <div className="flex items-center gap-2 pl-1">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-all duration-200 hover:scale-[1.05] hover:text-foreground hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-all duration-200 hover:scale-[1.05] hover:text-foreground hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <HudPanel className="hidden p-6 lg:block">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
              <span className="hud-blink h-1.5 w-1.5 rounded-full bg-accent" />
              Status
            </p>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">Online</p>
          </div>

          <dl className="mt-5 space-y-5">
            {stats.map((s, i) => {
              const Icon = STAT_ICONS[i]
              return (
                <div key={s.label} className="flex items-center gap-4">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-accent/30 bg-accent-soft text-accent">
                    <Icon size={18} />
                  </div>
                  <div>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-mono text-xl font-bold tabular-nums text-foreground">{s.value}</dd>
                    <p className="text-xs leading-snug text-muted">{s.label}</p>
                  </div>
                </div>
              )
            })}
          </dl>

          <div className="mt-6 border-t border-border pt-4 font-mono text-xs text-muted">
            <span className="text-accent">&gt;</span> open to new opportunities
            <span className="hud-blink ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-accent" />
          </div>
        </HudPanel>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce text-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:block"
      >
        <ArrowDown size={20} />
      </a>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </section>
  )
}
