import { useEffect, useRef } from 'react'

export default function Parallax({ speed = 0.2, className = '', ariaHidden = true, children }) {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ticking = false

    const apply = () => {
      ticking = false
      if (ref.current) {
        ref.current.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`
      }
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(apply)
      }
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return (
    <div ref={ref} className={className} aria-hidden={ariaHidden || undefined}>
      {children}
    </div>
  )
}
