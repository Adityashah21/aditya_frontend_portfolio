import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Projects from './Projects'
import Certifications from './Certifications'
import Hackathons from './Hackathons'
import SoftSkills from './SoftSkills'
import Hobbies from './Hobbies'
import Contact from './Contact'
import Particles from './Particles'

export default function Home() {
  const navigate = useNavigate()

  // Secret: type "admin" anywhere on the page to go to admin login
  useEffect(() => {
    let typed = ''
    const handler = (e) => {
      if (e.key.length !== 1) return
      typed += e.key.toLowerCase()
      if (typed.length > 10) typed = typed.slice(-10)
      if (typed.endsWith('admin')) {
        typed = ''
        navigate('/admin/login')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate])

  return (
    <div className="scanlines bg-grid relative">
      <Particles />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Certifications />
      <Hackathons />
      <SoftSkills />
      <Hobbies />
      <Contact />
    </div>
  )
}