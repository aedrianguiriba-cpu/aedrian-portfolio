import { useEffect, useRef, useState } from 'react'
import { Clapperboard, Code2, Network, Palette, Wrench } from 'lucide-react'
import Parallax from './Parallax'
import SectionHeading from './SectionHeading'
import { skillGroups } from '../data'

const simpleIcon = (slug) => `https://cdn.simpleicons.org/${slug}`
const icons8 = (slug) => `https://img.icons8.com/color/96/${slug}.png`

const SKILL_ICONS = {
  HTML: { src: simpleIcon('html5') },
  CSS: { src: simpleIcon('css') },
  JavaScript: { src: simpleIcon('javascript') },
  PHP: { src: simpleIcon('php') },
  'C++': { src: simpleIcon('cplusplus') },
  Dart: { src: simpleIcon('dart') },
  Flutter: { src: simpleIcon('flutter') },
  'Visual Basic': { src: icons8('vb') },
  SQL: { src: icons8('sql') },
  Supabase: { src: simpleIcon('supabase') },
  Firebase: { src: simpleIcon('firebase') },
  'Adobe Photoshop': { src: icons8('adobe-photoshop') },
  'Adobe Illustrator': { src: icons8('adobe-illustrator') },
  'Adobe Premiere Pro': { src: icons8('adobe-premiere-pro') },
  Figma: { src: simpleIcon('figma') },
  Canva: { src: icons8('canva') },
  CapCut: { Icon: Clapperboard },
  'Hardware & Software Troubleshooting': { Icon: Wrench },
  'Systems Analysis': { Icon: Network },
}

const GROUP_ICONS = {
  'Programming & Development': Code2,
  'Software & Design Tools': Palette,
  'IT & Systems': Wrench,
}

const SKILL_DESCRIPTIONS = {
  HTML: 'The markup language I use to structure every web page I build.',
  CSS: 'Styling language for crafting responsive, polished interfaces.',
  JavaScript: 'The scripting language behind the interactivity in my web apps.',
  PHP: 'Server-side language I use for backend logic and database-driven sites.',
  'C++': 'A core language from my CS foundation, useful for performance-critical logic.',
  Dart: 'The language behind every Flutter app I build.',
  Flutter: 'My go-to framework for shipping cross-platform mobile apps from one codebase.',
  'Visual Basic': 'Where I got my start with structured programming and desktop apps.',
  SQL: 'Querying and structuring the relational data behind the apps I build.',
  Supabase: 'Open-source backend-as-a-service I use for auth, databases, and storage.',
  Firebase: "Google's backend platform for real-time data, auth, and hosting.",
  'Adobe Photoshop': 'Photo editing and raster graphics for marketing and UI assets.',
  'Adobe Illustrator': 'Vector design tool for logos, icons, and print-ready artwork.',
  'Adobe Premiere Pro': 'Video editing software I use for promotional and social content.',
  Figma: 'Where I design and prototype interfaces before writing a line of code.',
  Canva: 'Fast, collaborative design tool for social and marketing graphics.',
  CapCut: 'Quick-turnaround video editing for short-form content.',
  'Hardware & Software Troubleshooting': 'Diagnosing and resolving issues across devices, networks, and systems.',
  'Systems Analysis': 'Breaking down business needs into structured, buildable technical requirements.',
}

const skills = skillGroups.flatMap((group) =>
  group.items.map((name) => ({
    name,
    group: group.title,
    description: SKILL_DESCRIPTIONS[name] ?? 'One of the tools in my stack.',
  }))
)

const WHEEL_RADIUS = 300
const FLIGHT_MS = 900

function SkillLogo({ name, size = 20 }) {
  const entry = SKILL_ICONS[name]
  if (!entry) return null

  if (entry.src) {
    return <img src={entry.src} alt="" style={{ height: size, width: size }} className="shrink-0" loading="lazy" />
  }

  const Icon = entry.Icon
  return <Icon size={size} className="shrink-0 text-accent" />
}

export default function Skills() {
  const [selected, setSelected] = useState(null)
  const [flight, setFlight] = useState(null)

  const badgeRefs = useRef([])
  const destRef = useRef(null)
  const landTimeoutRef = useRef(null)
  const flightFrameRef = useRef(null)

  // The description updates instantly on hover; the flight below is a purely
  // decorative overlay that animates alongside it, independent of timing.
  useEffect(() => {
    if (selected === null) return

    const badgeEl = badgeRefs.current[selected]
    const destEl = destRef.current
    if (!badgeEl || !destEl) return

    const from = badgeEl.getBoundingClientRect()
    const to = destEl.getBoundingClientRect()
    if (from.width === 0 || to.width === 0) return

    clearTimeout(landTimeoutRef.current)
    cancelAnimationFrame(flightFrameRef.current)

    const fromCenter = { x: from.left + from.width / 2, y: from.top + from.height / 2 }
    const toCenter = { x: to.left + to.width / 2, y: to.top + to.height / 2 }

    setFlight({
      name: skills[selected].name,
      size: to.width,
      left: toCenter.x,
      top: toCenter.y,
      dx: fromCenter.x - toCenter.x,
      dy: fromCenter.y - toCenter.y,
      scale: from.width / to.width,
      arrived: false,
    })

    flightFrameRef.current = requestAnimationFrame(() => {
      flightFrameRef.current = requestAnimationFrame(() => {
        setFlight((f) => (f ? { ...f, arrived: true } : f))
      })
    })

    landTimeoutRef.current = setTimeout(() => {
      setFlight(null)
    }, FLIGHT_MS)

    return () => {
      clearTimeout(landTimeoutRef.current)
      cancelAnimationFrame(flightFrameRef.current)
      setFlight(null)
    }
  }, [selected])

  const active = selected !== null ? skills[selected] : null

  return (
    <section id="skills" className="relative scroll-mt-16 overflow-hidden px-6 py-24 lg:flex lg:min-h-[860px] lg:flex-col lg:justify-center">
      <Parallax
        speed={0.18}
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]"
      />

      {/* Wheel bleeds off the right edge of the section — only its left half is visible */}
      <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 lg:block">
        <div className="pointer-events-auto relative h-[700px] w-[700px]">
          {/* HUD corner brackets */}
          {[
            'left-0 top-0 border-l border-t',
            'right-0 top-0 border-r border-t',
            'left-0 bottom-0 border-l border-b',
            'right-0 bottom-0 border-r border-b',
          ].map((pos) => (
            <div
              key={pos}
              className={`pointer-events-none absolute h-6 w-6 border-accent/40 ${pos}`}
            />
          ))}

          {/* Outer tick dial, counter-rotating slowly */}
          <div className="wheel-ring-outer absolute inset-0">
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              <circle
                cx="350"
                cy="350"
                r={WHEEL_RADIUS + 40}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="1"
              />
              {Array.from({ length: 24 }, (_, i) => {
                const rad = ((i * 15) * Math.PI) / 180
                const r1 = WHEEL_RADIUS + 40
                const r2 = i % 2 === 0 ? r1 + 10 : r1 + 5
                return (
                  <line
                    key={i}
                    x1={350 + r1 * Math.cos(rad)}
                    y1={350 + r1 * Math.sin(rad)}
                    x2={350 + r2 * Math.cos(rad)}
                    y2={350 + r2 * Math.sin(rad)}
                    stroke="var(--color-accent)"
                    strokeOpacity="0.3"
                    strokeWidth="1"
                  />
                )
              })}
            </svg>
          </div>

          <div className="wheel-ring absolute inset-0">
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              <circle
                cx="350"
                cy="350"
                r={WHEEL_RADIUS}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="1.5"
              />
              {skills.map((skill, i) => {
                const rad = ((360 / skills.length) * i * Math.PI) / 180
                const x = 350 + WHEEL_RADIUS * Math.cos(rad)
                const y = 350 + WHEEL_RADIUS * Math.sin(rad)
                return (
                  <line
                    key={skill.name}
                    x1="350"
                    y1="350"
                    x2={x}
                    y2={y}
                    stroke="var(--color-border)"
                    strokeWidth="1"
                  />
                )
              })}
            </svg>

            {skills.map((skill, i) => {
              const angle = (360 / skills.length) * i
              const isActive = i === selected

              return (
                <div
                  key={skill.name}
                  className={`absolute left-1/2 top-1/2 -ml-10 -mt-10 h-20 w-20 transition-opacity duration-300 ease-out ${
                    isActive ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ transform: `rotate(${angle}deg) translate(${WHEEL_RADIUS}px) rotate(${-angle}deg)` }}
                >
                  <div className="wheel-icon h-full w-full">
                    <div
                      ref={(el) => (badgeRefs.current[i] = el)}
                      onMouseEnter={() => setSelected(i)}
                      className={`flex h-full w-full items-center justify-center transition-transform duration-300 ease-out ${
                        isActive ? 'pointer-events-none' : 'cursor-pointer hover:scale-110'
                      }`}
                    >
                      <SkillLogo name={skill.name} size={44} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {flight && (
        <div
          className="pointer-events-none fixed z-50 flex items-center justify-center transition-transform ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            left: flight.left,
            top: flight.top,
            width: flight.size,
            height: flight.size,
            marginLeft: -flight.size / 2,
            marginTop: -flight.size / 2,
            transitionDuration: `${FLIGHT_MS}ms`,
            willChange: 'transform',
            transform: flight.arrived
              ? 'translate(0, 0) scale(1)'
              : `translate(${flight.dx}px, ${flight.dy}px) scale(${flight.scale})`,
          }}
        >
          <SkillLogo name={flight.name} size={flight.size} />
        </div>
      )}

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Skills"
          title="Tools I use to build products"
          description="A versatile stack spanning web and mobile development, design software, and core IT fundamentals."
        />

        <div className="mt-16 hidden lg:block lg:max-w-md">
          <div className="relative border border-border bg-surface/60 p-7">
            <div className="absolute -left-px -top-px h-3 w-3 border-l border-t border-accent/60" />
            <div className="absolute -right-px -bottom-px h-3 w-3 border-b border-r border-accent/60" />
            <div className="absolute inset-x-0 top-0 h-px bg-accent/40" />

            <div className="flex items-center justify-between gap-4">
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted">
                <span className="hud-blink h-1.5 w-1.5 rounded-full bg-accent" />
                {active ? active.group : 'Skill spotlight'}
              </p>
              {active && (
                <p className="font-mono text-xs tabular-nums text-accent">
                  {String(selected + 1).padStart(2, '0')} / {String(skills.length).padStart(2, '0')}
                </p>
              )}
            </div>

            <div className="mt-3 h-px w-full bg-border">
              <div
                className="h-px bg-accent transition-all duration-300 ease-out"
                style={{ width: active ? `${((selected + 1) / skills.length) * 100}%` : '0%' }}
              />
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div
                ref={destRef}
                className={`flex h-14 w-14 shrink-0 items-center justify-center border bg-background/60 transition-colors duration-300 ${
                  active ? 'border-accent/60' : 'border-border'
                }`}
              >
                {active && !flight ? (
                  <SkillLogo name={active.name} size={34} />
                ) : (
                  <span className="h-6 w-6 rounded-full border border-dashed border-border" />
                )}
              </div>
              <h3 className="text-2xl font-bold leading-tight text-foreground">
                {active ? active.name : 'Explore the stack'}
              </h3>
            </div>

            <p className="mt-4 min-h-[2.5rem] text-sm leading-relaxed text-muted">
              {active ? active.description : 'Hover any icon in the wheel to bring it into view.'}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-5">
              {skillGroups.map((group) => {
                const GroupIcon = GROUP_ICONS[group.title]
                const isActiveGroup = active?.group === group.title
                return (
                  <span
                    key={group.title}
                    className={`flex items-center justify-center gap-1.5 border px-2 py-2 text-center font-mono text-[11px] uppercase leading-tight tracking-wide transition-colors duration-200 ${
                      isActiveGroup
                        ? 'border-accent bg-accent-soft text-accent'
                        : 'border-border text-muted'
                    }`}
                  >
                    {GroupIcon && <GroupIcon size={12} className="shrink-0" />}
                    {group.title}
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        {/* Readable fallback for smaller screens */}
        <div className="mt-16 space-y-10 lg:hidden">
          {skillGroups.map((group) => {
            const GroupIcon = GROUP_ICONS[group.title]
            return (
              <div key={group.title}>
                <div className="flex items-center gap-3">
                  {GroupIcon && (
                    <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <GroupIcon size={18} />
                    </div>
                  )}
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
                    {group.title}
                  </h3>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {group.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 rounded-xl border border-border bg-surface/60 px-3 py-2.5 transition-colors duration-200 hover:border-accent/50"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background/60">
                        <SkillLogo name={item} />
                      </span>
                      <span className="font-mono text-sm leading-snug text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
