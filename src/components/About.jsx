import { Code2, Palette, GraduationCap } from 'lucide-react'
import HudPanel from './HudPanel'
import Parallax from './Parallax'
import SectionHeading from './SectionHeading'

const points = [
  {
    icon: Code2,
    title: 'Software & systems',
    body: 'From web and mobile apps to systems analysis and hardware troubleshooting, I deliver tailored IT solutions end to end.',
  },
  {
    icon: Palette,
    title: 'Design-minded',
    body: 'Years of graphic design work means every interface I build is as considered visually as it is functionally.',
  },
  {
    icon: GraduationCap,
    title: 'Educator at heart',
    body: 'As a college instructor, I enjoy breaking down technical concepts and helping others build real understanding.',
  },
]

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-16 overflow-hidden px-6 py-24">
      <Parallax
        speed={0.15}
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="About me"
          title="Turning ideas into reliable software"
          description="I'm a versatile IT professional who moves fluidly between software development, graphic design, and teaching — bringing a well-rounded perspective to every project I take on."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {points.map(({ icon: Icon, title, body }) => (
            <HudPanel
              key={title}
              className="p-6 transition-colors duration-200 hover:border-accent/50"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center border border-accent/30 bg-accent-soft text-accent">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </HudPanel>
          ))}
        </div>
      </div>
    </section>
  )
}
