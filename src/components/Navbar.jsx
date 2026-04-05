import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINKS = [
  { label: 'HOME',         href: '#hero' },
  { label: 'ABOUT',        href: '#about' },
  { label: 'SKILLS',       href: '#skills' },
  { label: 'PROJECTS',     href: '#projects' },
  { label: 'CERTS',        href: '#certifications' },
  { label: 'HACKATHONS',   href: '#hackathons' },
  { label: 'SOFT SKILLS',  href: '#softskills' },
  { label: 'HOBBIES',      href: '#hobbies' },
  { label: 'CONTACT',      href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [xp, setXp]             = useState(0)
  const [active, setActive]     = useState('hero')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(scrollTop > 40)
      setXp(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)

      const ids = LINKS.map(l => l.href.slice(1))
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i])
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(ids[i]); break
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* XP bar */}
      <div className="xp-bar">
        <div className="xp-fill" style={{ width: `${xp}%` }} />
      </div>

      <motion.nav
        initial={{ y: -80 }} animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,14,26,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,240,255,0.1)' : 'none',
          paddingTop: '4px',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo('#hero')}
            className="font-mono text-lg font-bold tracking-widest transition-all"
            style={{ color: '#00f0ff', textShadow: '0 0 12px #00f0ff', background: 'none', border: 'none', cursor: 'pointer' }}>
            &lt;AS /&gt;
          </button>

          {/* Desktop links — scrollable on smaller screens */}
          <div className="hidden md:flex items-center gap-6 overflow-x-auto">
            {LINKS.map(({ label, href }) => {
              const id = href.slice(1)
              return (
                <button key={href} onClick={() => scrollTo(href)}
                  className="font-orbitron text-xs tracking-wider transition-all duration-200 whitespace-nowrap flex-shrink-0"
                  style={{
                    color: active === id ? '#00f0ff' : 'rgba(224,242,254,0.45)',
                    textShadow: active === id ? '0 0 8px #00f0ff' : 'none',
                    background: 'none', border: 'none', cursor: 'pointer',
                    position: 'relative',
                  }}>
                  {label}
                  {active === id && (
                    <motion.div layoutId="nav-underline"
                      style={{ position:'absolute', bottom:-4, left:0, right:0, height:1, background:'#00f0ff', boxShadow:'0 0 6px #00f0ff' }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Mobile burger */}
          <button className="md:hidden text-xl" onClick={() => setMenuOpen(o => !o)}
            style={{ background:'none', border:'none', color:'#00f0ff', cursor:'pointer' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
              style={{ borderTop:'1px solid rgba(0,240,255,0.1)', background:'rgba(10,14,26,0.97)' }}
            >
              <div className="px-6 py-4 grid grid-cols-2 gap-3">
                {LINKS.map(({ label, href }) => (
                  <button key={href} onClick={() => scrollTo(href)}
                    className="font-orbitron text-xs tracking-wider text-left transition-colors py-2"
                    style={{ color:'rgba(224,242,254,0.5)', background:'none', border:'none', cursor:'pointer' }}
                    onMouseEnter={e => e.target.style.color='#00f0ff'}
                    onMouseLeave={e => e.target.style.color='rgba(224,242,254,0.5)'}>
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}