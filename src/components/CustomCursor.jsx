import { useEffect, useRef, useState } from 'react'
import { MousePointer2 } from 'lucide-react'

const HOVER_SELECTOR = 'a, button, input, textarea, [data-cursor-hover]'
const RIPPLE_MS = 500
const RING_SIZE = 34

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [ripples, setRipples] = useState([])

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(fine && !reduced)
  }, [])

  useEffect(() => {
    if (!enabled) return

    document.documentElement.classList.add('custom-cursor-active')

    const handleMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }

    const handleOver = (e) => {
      setHovering(Boolean(e.target.closest?.(HOVER_SELECTOR)))
    }

    const handleDown = (e) => {
      setPressed(true)
      const id = `${Date.now()}-${Math.random()}`
      setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => {
        setRipples((r) => r.filter((ripple) => ripple.id !== id))
      }, RIPPLE_MS)
    }
    const handleUp = () => setPressed(false)

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleOver)
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200]"
      >
        {hovering ? (
          <div
            className={`relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 transition-all duration-150 ease-out ${
              pressed ? 'scale-75 border-white bg-white/10' : 'border-accent bg-accent/10'
            }`}
            style={{ width: RING_SIZE, height: RING_SIZE }}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${pressed ? 'bg-white' : 'bg-accent'}`} />
          </div>
        ) : (
          <MousePointer2
            size={24}
            className={`-translate-x-[6px] -translate-y-[3px] transition-all duration-150 ease-out ${
              pressed ? 'scale-90' : 'scale-100'
            }`}
            fill={pressed ? '#ffffff' : 'var(--color-accent)'}
            stroke="#06160d"
            strokeWidth={1.5}
          />
        )}
      </div>

      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          aria-hidden="true"
          className="cursor-ripple pointer-events-none fixed z-[199] h-10 w-10 rounded-full border-2 border-accent"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </>
  )
}
