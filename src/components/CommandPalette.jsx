import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Mail, Search } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons'
import { nav, profile } from '../data'

function buildCommands() {
  const navCommands = [
    { id: 'home', label: 'Home', hint: 'section', action: { type: 'scroll', href: '#home' } },
    ...nav.map((item) => ({
      id: item.href,
      label: item.label,
      hint: 'section',
      action: { type: 'scroll', href: item.href },
    })),
  ]

  const actionCommands = [
    {
      id: 'email',
      label: `Email ${profile.name.split(' ')[0]}`,
      hint: profile.email,
      icon: Mail,
      action: { type: 'link', href: `mailto:${profile.email}` },
    },
    {
      id: 'github',
      label: 'Open GitHub profile',
      hint: 'external',
      icon: GithubIcon,
      action: { type: 'link', href: profile.github, external: true },
    },
    {
      id: 'linkedin',
      label: 'Open LinkedIn profile',
      hint: 'external',
      icon: LinkedinIcon,
      action: { type: 'link', href: profile.linkedin, external: true },
    },
  ]

  return [...navCommands, ...actionCommands]
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)

  const commands = useMemo(buildCommands, [])
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => c.label.toLowerCase().includes(q))
  }, [commands, query])

  useEffect(() => {
    const handleKeydown = (e) => {
      const isK = e.key.toLowerCase() === 'k'
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      document.documentElement.style.overflow = 'hidden'
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const runCommand = (command) => {
    if (!command) return
    if (command.action.type === 'scroll') {
      const el = document.querySelector(command.action.href)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.history.pushState(null, '', command.action.href)
    } else if (command.action.type === 'link') {
      if (command.action.external) {
        window.open(command.action.href, '_blank', 'noreferrer')
      } else {
        window.location.href = command.action.href
      }
    }
    setOpen(false)
  }

  const handleInputKeydown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      runCommand(results[activeIndex])
    }
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[15vh]">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-lg border border-border bg-surface shadow-2xl shadow-black/40">
            <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-accent/60" />
            <span className="pointer-events-none absolute -right-px -bottom-px h-3 w-3 border-b border-r border-accent/60" />

            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search size={16} className="shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeydown}
                placeholder="Jump to a section or action…"
                className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted focus:outline-none"
              />
              <span className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted">
                esc
              </span>
            </div>

            <ul className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-muted">No matches.</li>
              )}
              {results.map((command, i) => {
                const Icon = command.icon ?? ArrowUpRight
                const isActive = i === activeIndex
                return (
                  <li key={command.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => runCommand(command)}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors duration-100 cursor-pointer ${
                        isActive ? 'bg-accent-soft text-accent' : 'text-foreground'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-[15px] w-[15px] shrink-0" />
                        {command.label}
                      </span>
                      <span className="font-mono text-xs text-muted">{command.hint}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
