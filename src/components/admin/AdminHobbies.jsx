import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../utils/api'

const EMPTY = { name: '', description: '', icon: '🎮', order: 0 }
const ICONS = ['🎮','🎵','📚','✈️','🎨','⚽','🏋️','🍕','📷','🎯','🧩','🎲','🌿','🏄','🎸']
const Label = ({ c }) => <label className="block font-mono text-xs text-cyber-dim tracking-widest mb-2">{c}</label>
const Input = (p) => <input {...p} className="w-full bg-cyber-bg border border-cyber-primary/20 text-cyber-text font-mono text-sm px-4 py-3 rounded-md outline-none focus:border-cyber-primary transition-all placeholder:text-cyber-dim" />

export default function AdminHobbies() {
  const [items, setItems]       = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [loading, setLoading]   = useState(false)
  const [toast, setToast]       = useState(null)

  const showToast = (msg, type='success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }
  const fetchAll  = () => api.get('/hobbies').then(r => setItems(r.data)).catch(() => {})

  useEffect(() => { fetchAll() }, [])

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setShowForm(true) }
  const openEdit = (item) => { setForm(item); setEditing(item._id); setShowForm(true) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      if (editing) { await api.put(`/hobbies/${editing}`, form); showToast('Updated') }
      else         { await api.post('/hobbies', form);           showToast('Added') }
      setShowForm(false); fetchAll()
    } catch (err) { showToast(err.response?.data?.error || 'Error', 'error') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return
    try { await api.delete(`/hobbies/${id}`); showToast('Deleted'); fetchAll() }
    catch { showToast('Failed', 'error') }
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="min-h-screen bg-cyber-bg bg-grid scanlines">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
            className="fixed top-6 right-6 z-[300] font-mono text-sm px-5 py-3 rounded border"
            style={{ background: toast.type==='error'?'rgba(255,68,102,0.1)':'rgba(0,240,255,0.1)', borderColor: toast.type==='error'?'#ff4466':'#00f0ff', color: toast.type==='error'?'#ff4466':'#00f0ff' }}>
            {toast.type==='error'?'✕':'✓'} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="font-mono text-xs text-cyber-dim hover:text-cyber-primary transition-colors">← dashboard</Link>
            <h1 className="font-orbitron font-bold text-3xl" style={{ color:'#60a5fa', textShadow:'0 0 10px #60a5fa66' }}>HOBBIES</h1>
          </div>
          <button className="btn-cyber text-xs px-5 py-2" onClick={openAdd}>+ ADD HOBBY</button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4"
              style={{ background:'rgba(0,0,0,0.85)' }}
              onClick={e => e.target===e.currentTarget && setShowForm(false)}>
              <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
                className="cyber-card w-full max-w-lg p-8">
                <h2 className="font-orbitron font-bold text-xl mb-6" style={{ color:'#60a5fa' }}>
                  {editing ? 'EDIT HOBBY' : 'NEW HOBBY'}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div><Label c="HOBBY NAME *" /><Input value={form.name} onChange={set('name')} required placeholder="Gaming" /></div>
                  <div>
                    <Label c="DESCRIPTION" />
                    <textarea value={form.description} onChange={set('description')} rows={2} placeholder="Tell us more..."
                      className="w-full bg-cyber-bg border border-cyber-primary/20 text-cyber-text font-mono text-sm px-4 py-3 rounded-md outline-none focus:border-cyber-primary transition-all placeholder:text-cyber-dim resize-vertical" />
                  </div>
                  <div>
                    <Label c="ICON (pick one)" />
                    <div className="flex flex-wrap gap-2 mt-1">
                      {ICONS.map(ic => (
                        <button key={ic} type="button" onClick={() => setForm(f => ({ ...f, icon: ic }))}
                          className="text-xl p-2 rounded border transition-all"
                          style={{ borderColor: form.icon===ic ? '#60a5fa' : 'rgba(0,240,255,0.1)', background: form.icon===ic ? 'rgba(96,165,250,0.1)' : 'transparent' }}>
                          {ic}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button type="submit" className="btn-cyber flex-1 justify-center" disabled={loading} style={{ opacity:loading?0.6:1 }}>
                      {loading ? 'SAVING...' : editing ? 'UPDATE' : 'ADD'}
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

        <div className="grid md:grid-cols-2 gap-3">
          {items.length === 0
            ? <p className="font-mono text-sm text-cyber-dim py-16 col-span-2 text-center">// No hobbies yet</p>
            : items.map((item, i) => (
              <motion.div key={item._id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                className="cyber-card px-5 py-4 flex items-center gap-4 justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <h3 className="font-orbitron font-bold text-sm text-cyber-text">{item.name}</h3>
                    {item.description && <p className="font-mono text-xs text-cyber-dim truncate mt-0.5">{item.description}</p>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(item)} className="font-mono text-xs px-3 py-1.5 rounded border border-cyber-primary/20 text-cyber-primary hover:border-cyber-primary/50 transition-all">edit</button>
                  <button onClick={() => handleDelete(item._id)} className="font-mono text-xs px-3 py-1.5 rounded border border-red-500/20 text-red-400 hover:bg-red-500/5 transition-all">del</button>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}