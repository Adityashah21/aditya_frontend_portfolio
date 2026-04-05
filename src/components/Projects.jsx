import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import api from '../utils/api'

const DEFAULT_PROJECTS = [
  { _id: '1', title: 'Moodiary', description: 'Full MERN AI journal with Groq Llama 3.3 emotional analysis, Recharts analytics, dark glassmorphism UI.', techStack: ['React','Node.js','MongoDB','Groq AI'], liveLink: '', githubLink: 'https://github.com/Adityashah21', featured: true },
  { _id: '2', title: 'Smart City Travel', description: 'React app with 22-file modular architecture, transit tracking, route planner, weather dashboard.', techStack: ['React','Tailwind','Framer Motion'], liveLink: '', githubLink: '' },
]

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('ALL')

  useEffect(() => {
    api.get('/projects')
      .then(r => { setProjects(r.data.length ? r.data : DEFAULT_PROJECTS); setLoading(false) })
      .catch(() => { setProjects(DEFAULT_PROJECTS); setLoading(false) })
  }, [])

  const allTech = ['ALL', ...new Set(projects.flatMap(p => p.techStack || []))]
  const visible = filter === 'ALL' ? projects : projects.filter(p => p.techStack?.includes(filter))

  return (
    <section id="projects" className="py-28 px-6 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(0,240,255,0.03) 0%, transparent 60%)' }} />

      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-10">
            <p className="section-label mb-3">// LEVEL 4</p>
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl">
              <span className="text-white">MY</span>
              <span className="neon-purple ml-3">_PROJECTS</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Filter bar */}
        {!loading && allTech.length > 1 && (
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap gap-2 mb-10">
              {allTech.slice(0, 8).map(tech => (
                <button key={tech} onClick={() => setFilter(tech)}
                  className={`cyber-tag cursor-pointer transition-all duration-200 ${
                    filter === tech
                      ? 'bg-cyber-primary/20 border-cyber-primary text-cyber-primary shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                      : 'hover:border-cyber-primary/40 hover:text-cyber-text'
                  }`}>
                  {tech}
                </button>
              ))}
            </div>
          </ScrollReveal>
        )}

        {loading ? (
          <div className="terminal-line text-center">Loading projects...</div>
        ) : visible.length === 0 ? (
          <p className="terminal-line text-center">// No projects match this filter</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((p, i) => (
              <ScrollReveal key={p._id} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="cyber-card h-full flex flex-col overflow-hidden group"
                >
                  {/* Thumbnail */}
                  <div className="h-44 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.06), rgba(124,58,237,0.1))' }}>
                    {p.thumbnail
                      ? <img src={p.thumbnail} alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl">🎮</span>
                        </div>
                      )
                    }
                    {/* Scan line effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,240,255,0.04) 3px, rgba(0,240,255,0.04) 4px)' }} />
                    {p.featured && (
                      <span className="absolute top-3 right-3 font-orbitron text-xs px-2 py-1 rounded"
                        style={{ background: '#00f0ff', color: '#0a0e1a' }}>★ FEATURED</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <h3 className="font-orbitron font-bold text-lg text-cyber-text">{p.title}</h3>
                    <p className="text-cyber-muted text-sm leading-relaxed flex-1">{p.description}</p>

                    {p.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {p.techStack.map(t => <span key={t} className="cyber-tag">{t}</span>)}
                      </div>
                    )}

                    <div className="flex gap-3 mt-1 flex-wrap">
                      {p.liveLink && (
                        <a href={p.liveLink} target="_blank" rel="noreferrer"
                          className="font-mono text-xs text-cyber-primary hover:underline flex items-center gap-1">
                          ↗ Live Demo
                        </a>
                      )}
                      {p.githubLink && (
                        <a href={p.githubLink} target="_blank" rel="noreferrer"
                          className="font-mono text-xs text-cyber-muted hover:text-cyber-text flex items-center gap-1">
                          ⌥ Source
                        </a>
                      )}
                      {p.videoDemo && (
                        <a href={p.videoDemo} target="_blank" rel="noreferrer"
                          className="font-mono text-xs text-cyber-accent hover:underline flex items-center gap-1">
                          ▶ Demo
                        </a>
                      )}
                      {!p.liveLink && !p.githubLink && (
                        <span className="font-mono text-xs text-cyber-dim">// coming soon</span>
                      )}
                    </div>
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