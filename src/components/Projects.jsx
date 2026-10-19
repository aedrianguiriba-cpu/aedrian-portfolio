import { useEffect, useState } from 'react'
import { ArrowUpRight, Star } from 'lucide-react'
import { GithubIcon } from './icons'
import HudPanel from './HudPanel'
import Parallax from './Parallax'
import SectionHeading from './SectionHeading'
import { profile } from '../data'

const REPO_COUNT = 6

export default function Projects() {
  const { githubUsername } = profile
  const [repos, setRepos] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false

    fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (cancelled) return
        const sorted = data
          .filter((repo) => !repo.fork && repo.name.toLowerCase() !== 'portfolio')
          .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
          .slice(0, REPO_COUNT)
        setRepos(sorted)
        setStatus('loaded')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [githubUsername])

  return (
    <section id="projects" className="relative scroll-mt-16 overflow-hidden px-6 py-24">
      <Parallax
        speed={0.15}
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-accent/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work"
          description="A live look at my contribution history and recent repositories on GitHub."
        />

        <HudPanel className="mt-16 overflow-hidden p-6">
          <img
            src={`https://ghchart.rshah.org/22c55e/${githubUsername}`}
            alt={`${profile.name}'s GitHub contribution graph`}
            className="w-full"
            loading="lazy"
          />
        </HudPanel>

        {status === 'loaded' && repos.length > 0 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {repos.map((repo) => (
              <HudPanel
                key={repo.id}
                as="a"
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col p-6 transition-colors duration-200 hover:border-accent/50 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold uppercase text-foreground">{repo.name}</h3>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-muted transition-colors duration-200 group-hover:text-accent"
                  />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {repo.description || 'No description provided.'}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
                  {repo.language && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-accent" />
                      {repo.language}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Star size={13} />
                    {repo.stargazers_count}
                  </span>
                </div>
              </HudPanel>
            ))}
          </div>
        )}

        {status === 'error' && (
          <p className="mt-6 text-sm text-muted">
            Couldn't load repositories right now — check them out directly on GitHub below.
          </p>
        )}

        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 border border-border px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wide text-foreground hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer"
        >
          <GithubIcon className="h-4.5 w-4.5" />
          View full profile on GitHub
          <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  )
}
