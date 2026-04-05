import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import api from '../utils/api'

export default function Hobbies() {
  const [hobbies, setHobbies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/hobbies')
      .then(r => { setHobbies(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (!loading && hobbies.length === 0) return null

  return (
    <section id="hobbies" className="py-28 px-6 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(96,165,250,0.03) 0%, transparent 60%)' }} />

      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="mb-14">
            <p className="section-label mb-3">// INTERESTS</p>
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl">
              <span className="text-white">HOB</span>
              <span className="ml-1" style={{ color:'#60a5fa', textShadow:'0 0 10px #60a5fa66' }}>BIES</span>
            </h2>
          </div>
        </ScrollReveal>

        {loading ? (
          <p className="terminal-line">Loading...</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {hobbies.map((hobby, i) => (
              <ScrollReveal key={hobby._id} delay={i * 0.06}>
                <motion.div
                  whileHover={{ scale: 1.06, y: -3 }}
                  className="cyber-card px-6 py-4 flex items-center gap-3 cursor-default"
                  style={{ borderColor: 'rgba(96,165,250,0.1)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(96,165,250,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(96,165,250,0.1)'}
                >
                  <motion.span
                    className="text-3xl"
                    whileHover={{ rotate: 15 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {hobby.icon}
                  </motion.span>
                  <div>
                    <h3 className="font-orbitron font-bold text-sm" style={{ color: '#60a5fa' }}>
                      {hobby.name}
                    </h3>
                    {hobby.description && (
                      <p className="font-mono text-xs text-cyber-dim mt-0.5 max-w-xs">
                        {hobby.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}