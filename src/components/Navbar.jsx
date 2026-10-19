import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { nav } from '../data'

const INTERACT_RADIUS = 150
const MAX_LEAN_DEG = 22
const IDLE_AMPLITUDE_DEG = 3
const STIFFNESS = 26
const DAMPING = 3.4
const STRETCH_PER_RAD_S = 0.03
const STRETCH_PER_PX_S = 0.0015
const MAX_STRETCH = 0.12
const PLUCK_RADIUS = 90
const PLUCK_STRENGTH = 26

const INITIAL_DROP = -150
const DROP_STAGGER = 0.09
const VERTICAL_STIFFNESS = 65
const VERTICAL_DAMPING = 6.5
const PULL_DOWN_MAX = 14

function smoothRopePath(points) {
  if (points.length < 2) return ''
  if (points.length === 2) {
    return `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)} L ${points[1][0].toFixed(1)} ${points[1][1].toFixed(1)}`
  }

  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

function pluckRopePoints(points, mouseLocal) {
  const plucked = [points[0]]
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]
    let midX = (p1[0] + p2[0]) / 2
    let midY = (p1[1] + p2[1]) / 2

    const dx = midX - mouseLocal.x
    const dy = midY - mouseLocal.y
    const dist = Math.hypot(dx, dy)
    if (dist < PLUCK_RADIUS && dist > 0.01) {
      const push = (1 - dist / PLUCK_RADIUS) * PLUCK_STRENGTH
      midX += (dx / dist) * push
      midY += (dy / dist) * push
    }

    plucked.push([midX, midY], p2)
  }
  return plucked
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#home')
  const observerRef = useRef(null)
  const asideRef = useRef(null)
  const itemRefs = useRef([])
  const knotRefs = useRef([])
  const pathRef = useRef(null)
  const physicsRef = useRef(null)
  const lastTimeRef = useRef(null)
  const mountTimeRef = useRef(null)

  const itemCount = nav.length + 1
  if (!physicsRef.current) {
    physicsRef.current = Array.from({ length: itemCount }, (_, i) => ({
      angle: 0,
      velocity: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random() * 0.25,
      y: INITIAL_DROP,
      yVelocity: 0,
      dropDelay: i * DROP_STAGGER,
    }))
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = ['#home', ...nav.map((item) => item.href)]
      .map((href) => document.querySelector(href))
      .filter(Boolean)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    sections.forEach((section) => observerRef.current.observe(section))
    return () => observerRef.current?.disconnect()
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const mouse = { x: -9999, y: -9999 }
    const handleMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const handleLeave = (e) => {
      if (!e.relatedTarget && !e.toElement) {
        mouse.x = -9999
        mouse.y = -9999
      }
    }

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseout', handleLeave)

    let frame
    const tick = (now) => {
      const dt = lastTimeRef.current ? Math.min((now - lastTimeRef.current) / 1000, 0.05) : 0.016
      lastTimeRef.current = now
      if (mountTimeRef.current === null) mountTimeRef.current = now
      const elapsed = (now - mountTimeRef.current) / 1000

      const asideEl = asideRef.current
      if (asideEl) {
        const asideRect = asideEl.getBoundingClientRect()
        const points = []

        itemRefs.current.forEach((el, i) => {
          if (!el) return
          const rect = el.getBoundingClientRect()
          const pivotX = rect.left + rect.width / 2
          const pivotY = rect.top
          const dx = mouse.x - pivotX
          const dy = mouse.y - pivotY
          const dist = Math.hypot(dx, dy)
          const falloff = dist < INTERACT_RADIUS ? 1 - dist / INTERACT_RADIUS : 0

          const phys = physicsRef.current[i]
          let targetDeg = Math.sin(now * 0.001 * phys.speed + phys.phase) * IDLE_AMPLITUDE_DEG
          if (falloff > 0) {
            const lean = Math.max(-1, Math.min(1, -dx / INTERACT_RADIUS))
            targetDeg = lean * MAX_LEAN_DEG * falloff
          }

          const targetRad = (targetDeg * Math.PI) / 180
          const angularAccel = STIFFNESS * (targetRad - phys.angle) - DAMPING * phys.velocity
          phys.velocity += angularAccel * dt
          phys.angle += phys.velocity * dt

          if (elapsed >= phys.dropDelay) {
            const targetY = falloff * PULL_DOWN_MAX
            const verticalAccel = VERTICAL_STIFFNESS * (targetY - phys.y) - VERTICAL_DAMPING * phys.yVelocity
            phys.yVelocity += verticalAccel * dt
            phys.y += phys.yVelocity * dt
          }

          const stretch =
            1 +
            Math.min(
              Math.abs(phys.velocity) * STRETCH_PER_RAD_S + Math.abs(phys.yVelocity) * STRETCH_PER_PX_S,
              MAX_STRETCH
            )
          el.style.transform = `translateY(${phys.y.toFixed(1)}px) rotate(${(phys.angle * 180) / Math.PI}deg) scaleY(${stretch.toFixed(3)})`

          const localX = pivotX - asideRect.left
          const localY = pivotY - asideRect.top
          points.push([localX, localY])

          const knot = knotRefs.current[i]
          if (knot) {
            knot.setAttribute('cx', localX.toFixed(1))
            knot.setAttribute('cy', localY.toFixed(1))
          }
        })

        if (pathRef.current && points.length > 1) {
          const mouseLocal = { x: mouse.x - asideRect.left, y: mouse.y - asideRect.top }
          pathRef.current.setAttribute('d', smoothRopePath(pluckRopePoints(points, mouseLocal)))
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseout', handleLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    window.history.pushState(null, '', href)
  }

  const setItemRef = (index) => (el) => {
    itemRefs.current[index] = el
  }

  const setKnotRef = (index) => (el) => {
    knotRefs.current[index] = el
  }

  return (
    <>
      {/* Floating side nav — desktop */}
      <aside
        ref={asideRef}
        className="fixed left-6 top-1/2 z-50 hidden -translate-y-1/2 md:block"
      >
        <div className="relative">
          <svg
            className="pointer-events-none absolute inset-0 overflow-visible"
            aria-hidden="true"
          >
            <path
              ref={pathRef}
              fill="none"
              stroke="var(--color-accent)"
              strokeOpacity="0.35"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {Array.from({ length: itemCount }, (_, i) => (
              <circle
                key={i}
                ref={setKnotRef(i)}
                r="2.5"
                fill="var(--color-accent)"
                fillOpacity="0.55"
              />
            ))}
          </svg>

          <nav className="relative flex flex-col items-end gap-3">
            <div
              ref={setItemRef(0)}
              style={{ transformOrigin: 'top center' }}
            >
              <a
                href="#home"
                onClick={(e) => handleNavClick(e, '#home')}
                aria-current={active === '#home' ? 'true' : undefined}
                className={`block whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold tracking-tight shadow-lg backdrop-blur-md transition-colors duration-200 ${
                  active === '#home'
                    ? 'border-accent bg-accent text-[#06160d] shadow-accent/30'
                    : 'border-border bg-surface/70 text-foreground shadow-black/20'
                }`}
              >
                Aedrian<span className={active === '#home' ? '' : 'text-accent'}>.</span>dev
              </a>
            </div>

            <ul className="flex flex-col items-end gap-3">
              {nav.map((item, i) => {
                const isActive = active === item.href
                return (
                  <li
                    key={item.href}
                    ref={setItemRef(i + 1)}
                    style={{ transformOrigin: 'top center' }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`block whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer backdrop-blur-md ${
                        isActive
                          ? 'border-accent bg-accent text-[#06160d] shadow-lg shadow-accent/30'
                          : 'border-border bg-surface/70 text-muted shadow-lg shadow-black/20 hover:text-foreground hover:border-accent/50'
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Floating top bar — mobile */}
      <header
        className={`fixed inset-x-4 top-4 z-50 rounded-2xl border border-border px-4 transition-colors duration-300 md:hidden ${
          scrolled || open ? 'bg-background/90 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-surface/60 backdrop-blur-md'
        }`}
      >
        <div className="flex h-14 items-center justify-between">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="font-semibold tracking-tight text-foreground"
          >
            Aedrian<span className="text-accent">.</span>dev
          </a>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground cursor-pointer"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-border pb-4">
            <ul className="flex flex-col px-1 pt-2 gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      handleNavClick(e, item.href)
                      setOpen(false)
                    }}
                    className={`block rounded-lg px-3 py-3 text-base transition-colors duration-200 ${
                      active === item.href ? 'text-accent' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </>
  )
}
