import { Mail, MapPin, Phone } from 'lucide-react'
import { profile } from '../data'

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-muted">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            <Mail size={14} />
            {profile.email}
          </a>
          <a
            href={`tel:${profile.phone}`}
            className="inline-flex items-center gap-2 hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            <Phone size={14} />
            {profile.phone}
          </a>
          <span className="inline-flex items-center gap-2">
            <MapPin size={14} />
            {profile.location}
          </span>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <a href="#home" className="hover:text-foreground transition-colors duration-200 cursor-pointer">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
