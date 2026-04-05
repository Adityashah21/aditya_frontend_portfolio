import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import api from '../utils/api'

export default function SoftSkills() {
  const [skills, setSkills]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/softskills')
      .then(r => { setSkills(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (!loading && skills.length === 0) return null

  return (
    <section id="softskills" className="py-28 px-6 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(255,0,255,0.03) 0%, transparent 60%)' }} />

      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="mb-14">
            <p className="section-label mb-3">// INTERPERSONAL</p>
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl">
              <span className="text-white">SOFT</span>
              <span className="ml-3" style={{ color:'#ff00ff', textShadow:'0 0 10px #ff00ff66' }}>SKILLS</span>
            </h2>
          </div>
        </ScrollReveal>

        {loading ? (
          <p className="terminal-line">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill, i) => (
              <ScrollReveal key={skill._id} delay={i * 0.07}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -3 }}
                  className="cyber-card p-5 flex flex-col items-center text-center gap-3 cursor-default"
                  style={{ borderColor: 'rgba(255,0,255,0.1)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,0,255,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,0,255,0.1)'}
                >
                  <motion.span
                    className="text-4xl"
                    whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {skill.icon}
                  </motion.span>
                  <h3 className="font-orbitron font-bold text-sm text-cyber-text leading-tight">
                    {skill.name}
                  </h3>
                  {skill.description && (
                    <p className="font-mono text-xs text-cyber-dim leading-relaxed">
                      {skill.description}
                    </p>
                  )}
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}