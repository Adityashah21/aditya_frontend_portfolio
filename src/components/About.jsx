import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const BADGES = [
  { icon: '🎮', label: 'Problem Solver',  color: 'primary' },
  { icon: '⚡', label: 'Fast Learner',    color: 'secondary' },
  { icon: '🚀', label: 'Team Player',     color: 'primary' },
  { icon: '🤖', label: 'AI Enthusiast',   color: 'secondary' },
]

const STATS = [
  { val: '2023', label: 'STARTED CODING' },
  { val: 'MERN', label: 'PRIMARY STACK' },
  { val: 'B.Tech', label: 'CSE @ GNIOT' },
  { val: 'AI+', label: 'AI INTEGRATIONS' },
]

export default function About() {
  return (
    <section id="about" className="py-28 px-6 relative">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <ScrollReveal>
          <div className="mb-14">
            <p className="section-label mb-3">// LEVEL 1</p>
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl">
              <span className="text-white">ABOUT</span>
              <span className="neon-cyan ml-3">_ME</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Terminal card */}
          <ScrollReveal direction="left">
            <div className="cyber-card p-6 font-mono text-sm">
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyber-primary/10">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-cyber-dim text-xs">about.txt</span>
              </div>

              {[
                { prompt: 'cat about.txt', delay: 0 },
              ].map(({ prompt, delay }) => (
                <div key={prompt}>
                  <div className="terminal-line mb-3">
                    <span className="text-cyber-muted">~/portfolio$</span>{' '}
                    <span className="cmd">{prompt}</span>
                  </div>
                </div>
              ))}

              <motion.div
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }} viewport={{ once: true }}
                className="text-cyber-text leading-8 text-base font-rajdhani">
                <p className="mb-3 text-cyber-muted text-xs"># Student · Developer · Builder</p>
                <p>
                  I'm a <span className="text-cyber-primary">B.Tech CSE student</span> at GNIOT
                  (2023–2027), passionate about building things that live on the internet.
                </p>
                <p className="mt-3">
                  Specializing in the <span className="text-cyber-secondary">MERN stack</span> and
                  AI integrations. I've competed in hackathons, launched startup challenges, and
                  ship production-quality apps.
                </p>
                <p className="mt-3">
                  When not coding: exploring new frameworks, contributing to open source, and
                  leveling up every day.
                </p>
              </motion.div>

              <div className="mt-4 terminal-line text-xs">
                <span className="text-cyber-muted">~/portfolio$</span>
                <span className="animate-blink ml-1 text-cyber-primary">▋</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Badges */}
            <ScrollReveal direction="right" delay={0.1}>
              <div className="flex flex-wrap gap-3">
                {BADGES.map(({ icon, label, color }, i) => (
                  <motion.span key={label}
                    initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                    viewport={{ once: true }}
                    className="achievement"
                    style={{
                      background: color === 'primary' ? 'rgba(0,240,255,0.08)' : 'rgba(124,58,237,0.08)',
                      border: `1px solid ${color === 'primary' ? 'rgba(0,240,255,0.25)' : 'rgba(124,58,237,0.25)'}`,
                      color: color === 'primary' ? '#00f0ff' : '#7c3aed',
                      padding: '8px 16px', borderRadius: 6, fontSize: 14,
                      fontFamily: 'Rajdhani, sans-serif', fontWeight: 600,
                    }}>
                    {icon} {label}
                  </motion.span>
                ))}
              </div>
            </ScrollReveal>

            {/* Stats grid */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {STATS.map(({ val, label }, i) => (
                  <motion.div key={label}
                    whileHover={{ scale: 1.04, borderColor: 'rgba(0,240,255,0.4)' }}
                    className="cyber-card p-5 text-center cursor-default">
                    <div className="font-orbitron font-black text-2xl neon-cyan">{val}</div>
                    <div className="terminal-line text-xs mt-1">{label}</div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* GitHub link */}
            <ScrollReveal direction="right" delay={0.3}>
              <a href="https://github.com/Adityashah21" target="_blank" rel="noreferrer"
                className="btn-cyber w-full justify-center">
                ↗ VIEW GITHUB PROFILE
              </a>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}