import { useEffect, useRef } from 'react'

const STAR_COUNT = 180
const PARALLAX_STRENGTH = 36
const METEOR_DELAY_MIN = 2500
const METEOR_DELAY_MAX = 6500

export default function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = window.innerWidth
    let height = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      depth: Math.random() * 0.8 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.1,
      accent: Math.random() < 0.12,
    }))

    const accentColor =
      getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#3b82f6'

    const mouse = { x: width / 2, y: height / 2 }
    const handleMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    if (!reduced) window.addEventListener('mousemove', handleMove)

    let meteors = []
    let meteorTimeout

    const spawnMeteor = () => {
      const angle = (20 + Math.random() * 20) * (Math.PI / 180)
      const speed = 9 + Math.random() * 7
      meteors.push({
        x: Math.random() * width * 0.7,
        y: -20 - Math.random() * 80,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 80 + speed * 10,
        life: 0,
        maxLife: 90 + Math.random() * 40,
      })

      meteorTimeout = setTimeout(
        spawnMeteor,
        METEOR_DELAY_MIN + Math.random() * (METEOR_DELAY_MAX - METEOR_DELAY_MIN)
      )
    }
    if (!reduced) {
      meteorTimeout = setTimeout(spawnMeteor, 1500 + Math.random() * 2000)
    }

    let frame
    const draw = (time) => {
      ctx.clearRect(0, 0, width, height)

      const dx = (mouse.x - width / 2) / width
      const dy = (mouse.y - height / 2) / height

      for (const star of stars) {
        const offsetX = reduced ? 0 : -dx * PARALLAX_STRENGTH * star.depth
        const offsetY = reduced ? 0 : -dy * PARALLAX_STRENGTH * star.depth
        const twinkle = reduced
          ? 0.6
          : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 0.001 * star.speed + star.phase))

        ctx.beginPath()
        ctx.fillStyle = star.accent ? accentColor : '#ffffff'
        ctx.globalAlpha = twinkle
        ctx.arc(star.x * width + offsetX, star.y * height + offsetY, star.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      if (meteors.length) {
        meteors.forEach((m) => {
          m.x += m.vx
          m.y += m.vy
          m.life += 1

          const fadeIn = Math.min(m.life / 10, 1)
          const fadeOut = Math.min((m.maxLife - m.life) / 20, 1)
          const alpha = Math.max(0, Math.min(fadeIn, fadeOut))

          const norm = Math.hypot(m.vx, m.vy) || 1
          const tailX = m.x - (m.vx / norm) * m.length
          const tailY = m.y - (m.vy / norm) * m.length

          const gradient = ctx.createLinearGradient(tailX, tailY, m.x, m.y)
          gradient.addColorStop(0, 'rgba(255,255,255,0)')
          gradient.addColorStop(1, `rgba(255,255,255,${alpha})`)

          ctx.beginPath()
          ctx.strokeStyle = gradient
          ctx.lineWidth = 0.6
          ctx.lineCap = 'round'
          ctx.moveTo(tailX, tailY)
          ctx.lineTo(m.x, m.y)
          ctx.stroke()

          ctx.beginPath()
          ctx.fillStyle = `rgba(255,255,255,${alpha})`
          ctx.arc(m.x, m.y, 0.7, 0, Math.PI * 2)
          ctx.fill()
        })

        meteors = meteors.filter(
          (m) => m.life < m.maxLife && m.x < width + 100 && m.y < height + 100
        )
      }

      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMove)
      clearTimeout(meteorTimeout)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
