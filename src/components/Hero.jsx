import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons'
import Parallax from './Parallax'
import { profile, stats } from '../data'

const roles = profile.role.split('|').map((role) => role.trim())

export default function Hero() {
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

      <div className="relative mx-auto w-full max-w-6xl">
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
            Hi, I'm {profile.name.split(' ')[0]} —
            <br />
            <span className="text-accent text-glow">builder, designer & educator</span>
          </h1>

          <div className="mt-5 flex flex-wrap gap-2">
            {roles.map((role) => (
              <span
                key={role}
                className="rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-xs uppercase tracking-wide text-muted"
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
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#06160d] transition-transform duration-200 hover:scale-[1.03] cursor-pointer"
            >
              View my experience
              <ArrowUpRight size={18} />
            </a>
            <div className="flex items-center gap-2 pl-1">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted hover:text-foreground hover:border-accent transition-colors duration-200 cursor-pointer"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted hover:text-foreground hover:border-accent transition-colors duration-200 cursor-pointer"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <dl className="mt-12 flex max-w-xl divide-x divide-border border-t border-border pt-8">
            {stats.map((s) => (
              <div key={s.label} className="flex-1 pl-6 first:pl-0">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-mono text-2xl font-bold tabular-nums text-foreground sm:text-3xl">{s.value}</dd>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce text-muted hover:text-foreground sm:block"
      >
        <ArrowDown size={20} />
      </a>
    </section>
  )
}
