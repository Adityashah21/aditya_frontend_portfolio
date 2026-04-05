import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import ScrollReveal from './ScrollReveal'
import api from '../utils/api'

const CATEGORY_COLORS = {
  Frontend:  { bar: 'from-cyan-400 to-cyber-primary',   text: '#00f0ff' },
  Backend:   { bar: 'from-purple-500 to-cyber-secondary',text: '#7c3aed' },
  Database:  { bar: 'from-green-400 to-emerald-500',     text: '#00ff88' },
  DevOps:    { bar: 'from-orange-400 to-amber-500',      text: '#ff9900' },
  'AI/ML':   { bar: 'from-pink-400 to-cyber-accent',    text: '#ff00ff' },
  Tools:     { bar: 'from-blue-400 to-indigo-500',       text: '#60a5fa' },
  Other:     { bar: 'from-gray-400 to-gray-500',         text: '#9ca3af' },
}

function SkillBar({ skill, index, inView }) {
  const colors = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.Other
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="cyber-card p-4"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-rajdhani font-semibold text-base text-cyber-text">{skill.name}</span>
        <span className="font-orbitron text-xs font-bold" style={{ color: colors.text }}>
          {skill.proficiency}%
        </span>
      </div>
      <div className="skill-bar-track">
        <motion.div
          className={`skill-bar-fill bg-gradient-to-r ${colors.bar}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.proficiency}%` } : { width: 0 }}
          transition={{ delay: index * 0.06 + 0.2, duration: 1.2, ease: [0.16,1,0.3,1] }}
          style={{ boxShadow: `0 0 8px ${colors.text}66` }}
        />
      </div>
    </motion.div>
  )
}

// Default skills shown if backend has none
const DEFAULT_SKILLS = [
  { _id: '1', name: 'React.js',      category: 'Frontend', proficiency: 88 },
  { _id: '2', name: 'Node.js',       category: 'Backend',  proficiency: 82 },
  { _id: '3', name: 'MongoDB',       category: 'Database', proficiency: 78 },
  { _id: '4', name: 'Tailwind CSS',  category: 'Frontend', proficiency: 92 },
  { _id: '5', name: 'Express.js',    category: 'Backend',  proficiency: 80 },
  { _id: '6', name: 'JavaScript',    category: 'Frontend', proficiency: 90 },
]

export default function Skills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    api.get('/skills')
      .then(r => { setSkills(r.data.length ? r.data : DEFAULT_SKILLS); setLoading(false) })
      .catch(() => { setSkills(DEFAULT_SKILLS); setLoading(false) })
  }, [])

  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <section id="skills" className="py-28 px-6 relative" ref={ref}>
      {/* BG accent */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(124,58,237,0.04) 0%, transparent 60%)' }} />

      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="mb-14">
            <p className="section-label mb-3">// LEVEL 3</p>
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl">
              <span className="text-white">SKILL</span>
              <span className="neon-cyan ml-3">_TREE</span>
            </h2>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="terminal-line text-center">Loading skill tree...</div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, items], ci) => (
              <ScrollReveal key={category} delay={ci * 0.1}>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-px" style={{ background: CATEGORY_COLORS[category]?.text || '#00f0ff' }} />
                    <span className="font-orbitron text-xs tracking-widest"
                      style={{ color: CATEGORY_COLORS[category]?.text || '#00f0ff' }}>
                      {category.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {items.map((s, i) => (
                      <SkillBar key={s._id} skill={s} index={i} inView={inView} />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}