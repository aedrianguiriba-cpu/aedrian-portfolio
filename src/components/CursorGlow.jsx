import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const el = ref.current
    if (!el) return

    let frame
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let visible = false

    const apply = () => {
      el.style.transform = `translate(${x - 300}px, ${y - 300}px)`
      el.style.opacity = visible ? '1' : '0'
    }

    const handleMove = (e) => {
      x = e.clientX
      y = e.clientY
      visible = true
      if (!frame) frame = requestAnimationFrame(() => {
        frame = null
        apply()
      })
    }

    const handleLeave = (e) => {
      if (!e.relatedTarget && !e.toElement) {
        visible = false
        apply()
      }
    }

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseout', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseout', handleLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[600px] w-[600px] rounded-full opacity-0 transition-opacity duration-500"
      style={{
        background: 'radial-gradient(circle, var(--color-accent-soft) 0%, transparent 70%)',
      }}
    />
  )
}
