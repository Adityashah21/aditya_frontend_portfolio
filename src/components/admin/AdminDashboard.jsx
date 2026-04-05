import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

const SECTIONS = [
  { label: 'PROJECTS',       path: '/admin/projects',       endpoint: '/projects',       icon: '◈', color: '#00f0ff', desc: 'Add, edit, delete projects' },
  { label: 'SKILLS',         path: '/admin/skills',         endpoint: '/skills',         icon: '⚡', color: '#7c3aed', desc: 'Manage skill tree entries' },
  { label: 'CERTIFICATIONS', path: '/admin/certifications', endpoint: '/certifications', icon: '🏆', color: '#00ff88', desc: 'Add certificates & courses' },
  { label: 'HACKATHONS',     path: '/admin/hackathons',     endpoint: '/hackathons',     icon: '🚀', color: '#ff9900', desc: 'Hackathon results & awards' },
  { label: 'SOFT SKILLS',    path: '/admin/softskills',     endpoint: '/softskills',     icon: '🧠', color: '#ff00ff', desc: 'Communication, leadership etc.' },
  { label: 'HOBBIES',        path: '/admin/hobbies',        endpoint: '/hobbies',        icon: '🎮', color: '#60a5fa', desc: 'Interests & hobbies' },
]

export default function AdminDashboard() {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [counts, setCounts] = useState({})

  useEffect(() => {
    SECTIONS.forEach(s =>
      api.get(s.endpoint)
        .then(r => setCounts(prev => ({ ...prev, [s.label]: r.data.length })))
        .catch(() => {})
    )
  }, [])

  return (
    <div className="min-h-screen bg-cyber-bg bg-grid scanlines">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-14 flex-wrap gap-4"
        >
          <div>
            <p className="font-mono text-xs text-cyber-primary/70 tracking-widest mb-2">// CONTROL CENTER</p>
            <h1 className="font-orbitron font-black text-4xl">
              <span className="text-white">ADMIN</span>
              <span className="neon-cyan ml-2">DASHBOARD</span>
            </h1>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a href="/" target="_blank"
              className="btn-cyber btn-cyber-purple text-xs px-4 py-2">
              ↗ VIEW PORTFOLIO
            </a>
            <button onClick={() => { logout(); navigate('/admin/login') }}
              className="font-orbitron text-xs px-4 py-2 rounded border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all">
              ⏻ LOGOUT
            </button>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {SECTIONS.map(({ label, path, icon, color, desc }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={path} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="cyber-card p-6 cursor-pointer h-full"
                  onMouseEnter={e => e.currentTarget.style.borderColor = color + '55'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = ''}
                >
                  <div className="text-3xl mb-3">{icon}</div>
                  <h2 className="font-orbitron font-bold text-base text-cyber-text mb-1">{label}</h2>
                  <p className="font-mono text-xs text-cyber-dim mb-4">{desc}</p>
                  <div className="font-orbitron font-black text-3xl" style={{ color }}>
                    {counts[label] ?? '—'}
                    <span className="font-mono text-xs text-cyber-dim ml-2 font-normal">entries</span>
                  </div>
                  <div className="mt-3 font-mono text-xs text-cyber-dim">Manage →</div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* System info */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="cyber-card p-5"
        >
          <p className="font-mono text-xs text-cyber-dim mb-3">// system info</p>
          <div className="grid md:grid-cols-3 gap-4 font-mono text-sm">
            {[
              ['STATUS',  'ONLINE',        '#00ff88'],
              ['AUTH',    'JWT TOKEN',     '#00f0ff'],
              ['DB',      'MONGODB ATLAS', '#7c3aed'],
            ].map(([k, v, c]) => (
              <div key={k}>
                <span className="text-cyber-dim text-xs">{k}: </span>
                <span style={{ color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}