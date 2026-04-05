import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import api from '../utils/api'

export default function Certifications() {
  const [certs, setCerts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/certifications')
      .then(r => { setCerts(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (!loading && certs.length === 0) return null

  return (
    <section id="certifications" className="py-28 px-6 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.03) 0%, transparent 60%)' }} />

      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="mb-14">
            <p className="section-label mb-3">// ACHIEVEMENTS</p>
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl">
              <span className="text-white">CERTIFI</span>
              <span className="ml-1" style={{ color:'#00ff88', textShadow:'0 0 10px #00ff8866' }}>CATIONS</span>
            </h2>
          </div>
        </ScrollReveal>

        {loading ? (
          <p className="terminal-line">Loading certifications...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {certs.map((cert, i) => (
              <ScrollReveal key={cert._id} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="cyber-card p-5 h-full flex flex-col gap-3"
                  style={{ borderColor: 'rgba(0,255,136,0.1)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,255,136,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,255,136,0.1)'}
                >
                  {/* Thumbnail or icon */}
                  <div className="h-28 rounded-md overflow-hidden flex items-center justify-center"
                    style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.08)' }}>
                    {cert.thumbnail
                      ? <img src={cert.thumbnail} alt={cert.title} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                      : <span className="text-4xl">🏆</span>
                    }
                  </div>

                  <div className="flex-1">
                    <h3 className="font-orbitron font-bold text-sm text-cyber-text leading-snug">{cert.title}</h3>
                    <p className="font-mono text-xs mt-1" style={{ color: '#00ff88' }}>{cert.issuer}</p>
                    {cert.date && <p className="font-mono text-xs text-cyber-dim mt-0.5">{cert.date}</p>}
                  </div>

                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer"
                      className="font-mono text-xs hover:underline flex items-center gap-1"
                      style={{ color: '#00ff88' }}>
                      ↗ View Credential
                    </a>
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