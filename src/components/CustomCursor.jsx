import { useEffect, useRef, useState } from 'react'
import { Pointer } from 'lucide-react'

const EASE = 0.18
const HOVER_SELECTOR = 'a, button, input, textarea, [data-cursor-hover]'
const RIPPLE_MS = 500

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
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

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: mouse.x, y: mouse.y }

    const handleMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`
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

    let frame
    const tick = () => {
      ring.x += (mouse.x - ring.x) * EASE
      ring.y += (mouse.y - ring.y) * EASE
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%)`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[200] rounded-full transition-[width,height,background-color] duration-150 ease-out ${
          pressed ? 'h-1 w-1 bg-foreground' : 'h-1.5 w-1.5 bg-accent'
        }`}
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200]"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-200 ease-out ${
            hovering ? 'h-12 w-12' : 'h-8 w-8'
          } ${
            pressed
              ? 'scale-75 border-accent bg-accent'
              : hovering
                ? 'border-accent bg-accent/10'
                : 'border-accent/50 bg-transparent'
          }`}
        >
          {hovering && (
            <Pointer
              size={16}
              strokeWidth={2.25}
              className={pressed ? 'text-[#06160d]' : 'text-accent'}
            />
          )}
        </div>
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
