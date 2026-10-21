import CommandPalette from './components/CommandPalette'
import CursorGlow from './components/CursorGlow'
import CustomCursor from './components/CustomCursor'
import StarField from './components/StarField'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Education from './components/Education'
import Certifications from './components/Certifications'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <StarField />
      <CursorGlow />
      <CustomCursor />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-[#06160d]"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
      </main>
      <Footer />
      <CommandPalette />
    </div>
  )
}
