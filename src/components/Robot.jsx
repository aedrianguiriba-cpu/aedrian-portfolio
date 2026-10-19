import { useEffect, useRef } from 'react'

const CELL = 13
const COLS = 14
const ROWS = 14
const MAX_OFFSET = 4
const LINE = '#8bac0f'
const EYE_SIZE = 2.7
const EYE_OVERFLOW = (CELL * (EYE_SIZE - 2)) / 2

// . empty  O outline  H head shell  V visor  R ear  B antenna bulb  0 eye socket
const GRID = [
  '......BB......',
  '......VV......',
  '......OO......',
  '......OO......',
  '....OOOOOO....',
  '..OOHHHHHHOO..',
  '.OHHHHHHHHHHO.',
  'ROHHVVVVVVHHOR',
  'ROHHV0000VHHOR',
  'ROHHV0000VHHOR',
  'ROHHVVVVVVHHOR',
  'ROHHO.O.O.HHOR',
  '.OHHHHHHHHHHO.',
  '..OOOOOOOOOO..',
]

const EYE_SOCKETS = [
  { col: 5, row: 8 },
  { col: 7, row: 8 },
]

function isFilled(r, c) {
  const row = GRID[r]
  if (!row) return false
  const cell = row[c]
  return cell && cell !== '.' && cell !== '0'
}

function isEdge(r, c) {
  return !isFilled(r - 1, c) || !isFilled(r + 1, c) || !isFilled(r, c - 1) || !isFilled(r, c + 1)
}

function Eye({ col, row, delay, eyeRef, pupilRef }) {
  return (
    <div
      ref={eyeRef}
      className="robot-blink absolute rounded-sm border-2"
      style={{
        left: col * CELL - EYE_OVERFLOW,
        top: row * CELL - EYE_OVERFLOW,
        width: CELL * EYE_SIZE,
        height: CELL * EYE_SIZE,
        borderColor: LINE,
        backgroundColor: `${LINE}26`,
        animationDelay: `${delay}s`,
      }}
    >
      <span
        ref={pupilRef}
        className="absolute left-1/2 top-1/2 h-3.5 w-3.5 rounded-full"
        style={{ backgroundColor: LINE, transform: 'translate(-50%, -50%)' }}
      />
    </div>
  )
}

export default function Robot({ className = '' }) {
  const leftEyeRef = useRef(null)
  const rightEyeRef = useRef(null)
  const leftPupilRef = useRef(null)
  const rightPupilRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const updateEye = (eyeEl, pupilEl, mouseX, mouseY) => {
      if (!eyeEl || !pupilEl) return
      const rect = eyeEl.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = mouseX - cx
      const dy = mouseY - cy
      const dist = Math.hypot(dx, dy) || 1
      const clamped = Math.min(dist, MAX_OFFSET)
      const x = (dx / dist) * clamped
      const y = (dy / dist) * clamped
      pupilEl.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
    }

    const handleMove = (e) => {
      updateEye(leftEyeRef.current, leftPupilRef.current, e.clientX, e.clientY)
      updateEye(rightEyeRef.current, rightPupilRef.current, e.clientX, e.clientY)
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div className={`select-none ${className}`} aria-hidden="true">
      {/* Monitor housing */}
      <div className="relative rounded-md border border-border bg-surface/60 p-4 backdrop-blur-md">
        <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-accent/60" />
        <span className="pointer-events-none absolute -right-px -bottom-px h-3 w-3 border-b border-r border-accent/60" />
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent/40" />

        {/* Screen bezel */}
        <div className="rounded-sm border bg-transparent p-2" style={{ borderColor: LINE }}>
          <div
            className="relative"
            style={{ width: COLS * CELL, height: ROWS * CELL, imageRendering: 'pixelated' }}
          >
            {GRID.map((row, r) =>
              row.split('').map((cell, c) => {
                if (cell === '.' || cell === '0') return null
                if (!isEdge(r, c)) return null
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`absolute ${cell === 'B' ? 'hud-blink' : ''}`}
                    style={{
                      left: c * CELL,
                      top: r * CELL,
                      width: CELL,
                      height: CELL,
                      backgroundColor: LINE,
                    }}
                  />
                )
              })
            )}

            {EYE_SOCKETS.map((socket, i) => (
              <Eye
                key={i}
                col={socket.col}
                row={socket.row}
                delay={i * 0.3}
                eyeRef={i === 0 ? leftEyeRef : rightEyeRef}
                pupilRef={i === 0 ? leftPupilRef : rightPupilRef}
              />
            ))}
          </div>
        </div>

        {/* Power light + brand text */}
        <div className="mt-3 flex items-center gap-2 pl-1">
          <span
            className="hud-blink h-2 w-2 rounded-full border"
            style={{ borderColor: LINE }}
          />
          <span
            className="font-mono text-xs font-bold tracking-wider"
            style={{ color: LINE }}
          >
            DEV•BOY
          </span>
        </div>
      </div>

      {/* Monitor stand */}
      <div className="mx-auto h-5 w-7 border-x border-b border-border bg-surface/60" />
      <div className="mx-auto h-2 w-24 rounded-full border border-border bg-surface/60" />
    </div>
  )
}
