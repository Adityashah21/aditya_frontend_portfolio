import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import GlitchText from './GlitchText'

const ROLES = ['FULL STACK DEVELOPER', 'MERN STACK ENGINEER', 'AI ENTHUSIAST', 'REACT DEVELOPER']

function useTypewriter(texts, speed = 80) {
  const [display, setDisplay] = useState('')
  const [ti, setTi] = useState(0)
  const [ci, setCi] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[ti]
    let t
    if (!deleting) {
      if (ci < current.length) t = setTimeout(() => { setDisplay(current.slice(0, ci + 1)); setCi(c => c + 1) }, speed)
      else t = setTimeout(() => setDeleting(true), 2000)
    } else {
      if (ci > 0) t = setTimeout(() => { setDisplay(current.slice(0, ci - 1)); setCi(c => c - 1) }, speed / 2)
      else { setDeleting(false); setTi(i => (i + 1) % texts.length) }
    }
    return () => clearTimeout(t)
  }, [display, ci, deleting, ti])

  return display
}

export default function Hero() {
  const role = useTypewriter(ROLES)

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-grid">

      {/* Animated background rings */}
      {[400, 600, 800].map((size, i) => (
        <motion.div key={size}
          animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.04, 1] }}
          transition={{ rotate: { duration: 20 + i * 8, repeat: Infinity, ease: 'linear' }, scale: { duration: 4 + i, repeat: Infinity } }}
          className="absolute rounded-full border border-cyber-primary/5"
          style={{ width: size, height: size }} />
      ))}

      {/* Glow blob */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* Decorative corners */}
      <div className="absolute top-10 left-10 w-10 h-10 border-t-2 border-l-2 border-cyber-primary/30" />
      <div className="absolute top-10 right-10 w-10 h-10 border-t-2 border-r-2 border-cyber-primary/30" />
      <div className="absolute bottom-10 left-10 w-10 h-10 border-b-2 border-l-2 border-cyber-primary/30" />
      <div className="absolute bottom-10 right-10 w-10 h-10 border-b-2 border-r-2 border-cyber-primary/30" />

      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Terminal prefix */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="terminal-line mb-4">
          <span className="text-cyber-muted">player@portfolio:~$</span>{' '}
          <span className="cmd">./initialize.sh</span>
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="font-orbitron font-black mb-4"
          style={{ fontSize: 'clamp(40px, 8vw, 96px)', lineHeight: 1 }}>
          <span className="text-white">ADITYA </span>
          <GlitchText text="SHAH" className="neon-cyan" />
        </motion.h1>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="font-orbitron mb-8"
          style={{ fontSize: 'clamp(14px, 2.5vw, 22px)', minHeight: 32 }}>
          <span className="text-cyber-secondary">{role}</span>
          <span className="neon-cyan animate-blink ml-1">▋</span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="text-cyber-muted text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          B.Tech CSE @ GNIOT (2023–2027). Building full-stack web apps and AI integrations.
          Top-50 TechClasher Hackathon. Yukti-NIR Start-up Challenge.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          className="flex flex-wrap gap-4 justify-center">
          <button className="btn-cyber" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
            ▶ VIEW PROJECTS
          </button>
          <button className="btn-cyber btn-cyber-purple" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            ✉ CONTACT ME
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          className="flex justify-center gap-12 mt-16 flex-wrap">
          {[['2+', 'YEARS CODING'], ['10+', 'PROJECTS BUILT'], ['TOP 50', 'TECHCLASHER']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="font-orbitron font-black text-3xl neon-cyan">{val}</div>
              <div className="terminal-line text-xs mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="terminal-line text-xs">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-cyber-primary to-transparent" />
      </motion.div>
    </section>
  )
}