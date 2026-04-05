import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../utils/api'

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'AI/ML', 'Tools', 'Other']
const EMPTY = { name: '', category: 'Frontend', proficiency: 80, order: 0 }

const CATEGORY_COLORS = {
  Frontend:  '#00f0ff',
  Backend:   '#7c3aed',
  Database:  '#00ff88',
  DevOps:    '#ff9900',
  'AI/ML':   '#ff00ff',
  Tools:     '#60a5fa',
  Other:     '#9ca3af',
}

const Label = ({ children }) => (
  <label className="block font-mono text-xs text-cyber-dim tracking-widest mb-2">{children}</label>
)

export default function AdminSkills() {
  const [skills, setSkills]   = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [toast, setToast]     = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetch = () => api.get('/skills').then(r => setSkills(r.data)).catch(() => {})
  useEffect(() => { fetch() }, [])

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setShowForm(true) }
  const openEdit = (s) => { setForm(s); setEditing(s._id); setShowForm(true) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      if (editing) { await api.put(`/skills/${editing}`, form); showToast('Skill updated') }
      else         { await api.post('/skills', form);           showToast('Skill added') }
      setShowForm(false); fetch()
    } catch (err) {
      showToast(err.response?.data?.message || 'Error', 'error')
    } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return
    try { await api.delete(`/skills/${id}`); showToast('Deleted'); fetch() }
    catch { showToast('Delete failed', 'error') }
  }

  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-cyber-bg bg-grid scanlines">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[300] font-mono text-sm px-5 py-3 rounded border"
            style={{
              background: toast.type === 'error' ? 'rgba(255,68,102,0.1)' : 'rgba(0,240,255,0.1)',
              borderColor: toast.type === 'error' ? '#ff4466' : '#00f0ff',
              color: toast.type === 'error' ? '#ff4466' : '#00f0ff',
            }}
          >
            {toast.type === 'error' ? '✕' : '✓'} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="font-mono text-xs text-cyber-dim hover:text-cyber-primary transition-colors">
              ← dashboard
            </Link>
            <h1 className="font-orbitron font-bold text-3xl neon-cyan">SKILLS</h1>
          </div>
          <button className="btn-cyber text-xs px-5 py-2" onClick={openAdd}>
            + ADD SKILL
          </button>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.85)' }}
              onClick={e => e.target === e.currentTarget && setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="cyber-card w-full max-w-md p-8"
              >
                <h2 className="font-orbitron font-bold text-xl neon-cyan mb-6">
                  {editing ? 'EDIT SKILL' : 'NEW SKILL'}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Name */}
                  <div>
                    <Label>SKILL NAME *</Label>
                    <input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                      placeholder="React.js"
                      className="w-full bg-cyber-bg border border-cyber-primary/20 text-cyber-text font-mono text-sm px-4 py-3 rounded-md outline-none focus:border-cyber-primary focus:shadow-[0_0_0_2px_rgba(0,240,255,0.15)] transition-all placeholder:text-cyber-dim"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label>CATEGORY</Label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-cyber-bg border border-cyber-primary/20 text-cyber-text font-mono text-sm px-4 py-3 rounded-md outline-none focus:border-cyber-primary transition-all"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Proficiency slider */}
                  <div>
                    <Label>PROFICIENCY: {form.proficiency}%</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range" min="0" max="100"
                        value={form.proficiency}
                        onChange={e => setForm(f => ({ ...f, proficiency: +e.target.value }))}
                        className="flex-1 accent-cyber-primary cursor-pointer"
                      />
                      <span className="font-orbitron text-sm w-10 text-right"
                        style={{ color: CATEGORY_COLORS[form.category] || '#00f0ff' }}>
                        {form.proficiency}
                      </span>
                    </div>
                    {/* Preview bar */}
                    <div className="mt-2 h-2 rounded bg-cyber-bg border border-cyber-primary/10 overflow-hidden">
                      <div
                        className="h-full rounded transition-all duration-300"
                        style={{
                          width: `${form.proficiency}%`,
                          background: `linear-gradient(90deg, ${CATEGORY_COLORS[form.category] || '#00f0ff'}, ${CATEGORY_COLORS[form.category] || '#00f0ff'}88)`,
                          boxShadow: `0 0 8px ${CATEGORY_COLORS[form.category] || '#00f0ff'}66`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Order */}
                  <div>
                    <Label>DISPLAY ORDER</Label>
                    <input
                      type="number"
                      value={form.order}
                      onChange={e => setForm(f => ({ ...f, order: +e.target.value }))}
                      className="w-full bg-cyber-bg border border-cyber-primary/20 text-cyber-text font-mono text-sm px-4 py-3 rounded-md outline-none focus:border-cyber-primary transition-all"
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button type="submit"
                      className="btn-cyber flex-1 justify-center"
                      disabled={loading}
                      style={{ opacity: loading ? 0.6 : 1 }}>
                      {loading ? 'SAVING...' : editing ? 'UPDATE' : 'ADD SKILL'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)}
                      className="flex-1 font-orbitron text-xs py-3 px-4 rounded border border-cyber-primary/20 text-cyber-dim hover:border-cyber-primary/40 transition-all">
                      CANCEL
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skills grouped by category */}
        {Object.keys(grouped).length === 0 ? (
          <p className="font-mono text-sm text-cyber-dim text-center py-16">
            // No skills yet — click ADD SKILL to get started
          </p>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-px" style={{ background: CATEGORY_COLORS[category] || '#00f0ff' }} />
                  <span className="font-orbitron text-xs tracking-widest"
                    style={{ color: CATEGORY_COLORS[category] || '#00f0ff' }}>
                    {category.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs text-cyber-dim">({items.length})</span>
                </div>

                <div className="flex flex-col gap-2">
                  {items.map((s, i) => (
                    <motion.div key={s._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="cyber-card px-5 py-4 flex items-center gap-4 justify-between"
                    >
                      {/* Skill info + mini bar */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-rajdhani font-semibold text-sm text-cyber-text">
                            {s.name}
                          </span>
                          <span className="font-orbitron text-xs font-bold ml-4 flex-shrink-0"
                            style={{ color: CATEGORY_COLORS[s.category] || '#00f0ff' }}>
                            {s.proficiency}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded bg-cyber-bg border border-cyber-primary/10 overflow-hidden">
                          <div
                            className="h-full rounded"
                            style={{
                              width: `${s.proficiency}%`,
                              background: CATEGORY_COLORS[s.category] || '#00f0ff',
                              boxShadow: `0 0 6px ${CATEGORY_COLORS[s.category] || '#00f0ff'}66`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0 ml-4">
                        <button onClick={() => openEdit(s)}
                          className="font-mono text-xs px-3 py-1.5 rounded border border-cyber-primary/20 text-cyber-primary hover:border-cyber-primary/50 transition-all">
                          edit
                        </button>
                        <button onClick={() => handleDelete(s._id)}
                          className="font-mono text-xs px-3 py-1.5 rounded border border-red-500/20 text-red-400 hover:border-red-500/50 hover:bg-red-500/5 transition-all">
                          del
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}