import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import api from '../utils/api'

const RESULT_COLORS = {
  'Winner':      '#00ff88',
  'Runner-up':   '#00f0ff',
  'Top 10':      '#ff9900',
  'Top 50':      '#7c3aed',
  'Participant': '#9ca3af',
}

const getResultColor = (result) => {
  if (!result) return '#9ca3af'
  const key = Object.keys(RESULT_COLORS).find(k => result.toLowerCase().includes(k.toLowerCase()))
  return RESULT_COLORS[key] || '#ff9900'
}

export default function Hackathons() {
  const [hacks, setHacks]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/hackathons')
      .then(r => { setHacks(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (!loading && hacks.length === 0) return null

  return (
    <section id="hackathons" className="py-28 px-6 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(255,153,0,0.03) 0%, transparent 60%)' }} />

      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="mb-14">
            <p className="section-label mb-3">// COMPETITIONS</p>
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl">
              <span className="text-white">HACKA</span>
              <span className="ml-1" style={{ color:'#ff9900', textShadow:'0 0 10px #ff990066' }}>THONS</span>
            </h2>
          </div>
        </ScrollReveal>

        {loading ? (
          <p className="terminal-line">Loading hackathons...</p>
        ) : (
          <div className="flex flex-col gap-5">
            {hacks.map((hack, i) => {
              const color = getResultColor(hack.result)
              return (
                <ScrollReveal key={hack._id} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="cyber-card p-6 flex gap-5 items-start"
                    style={{ borderLeft: `3px solid ${color}` }}
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: color + '12', border: `1px solid ${color}22` }}>
                      🚀
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <h3 className="font-orbitron font-bold text-base text-cyber-text">{hack.name}</h3>
                        {hack.result && (
                          <span className="font-mono text-xs px-3 py-1 rounded border flex-shrink-0"
                            style={{ color, borderColor: color + '44', background: color + '11' }}>
                            {hack.result}
                          </span>
                        )}
                      </div>
                      {hack.organizer && (
                        <p className="font-mono text-xs mt-1" style={{ color }}>{hack.organizer}</p>
                      )}
                      {hack.date && (
                        <p className="font-mono text-xs text-cyber-dim mt-0.5">{hack.date}</p>
                      )}
                      {hack.description && (
                        <p className="text-cyber-muted text-sm mt-2 leading-relaxed">{hack.description}</p>
                      )}
                      {hack.certificate && (
                        <a href={hack.certificate} target="_blank" rel="noreferrer"
                          className="font-mono text-xs mt-2 inline-flex items-center gap-1 hover:underline"
                          style={{ color }}>
                          ↗ View Certificate
                        </a>
                      )}
                    </div>
                  </motion.div>
                </ScrollReveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}