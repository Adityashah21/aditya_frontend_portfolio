import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../utils/api'

const EMPTY = { name: '', organizer: '', result: '', date: '', description: '', certificate: '', order: 0 }

const Label = ({ c }) => (
  <label className="block font-mono text-xs text-cyber-dim tracking-widest mb-2">{c}</label>
)

const Input = (p) => (
  <input
    {...p}
    className="w-full bg-cyber-bg border border-cyber-primary/20 text-cyber-text font-mono text-sm px-4 py-3 rounded-md outline-none focus:border-cyber-primary transition-all placeholder:text-cyber-dim"
  />
)

export default function AdminHackathons() {
  const navigate = useNavigate()

  const [items, setItems]       = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [loading, setLoading]   = useState(false)
  const [toast, setToast]       = useState(null)

  const showToast = (msg, type='success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchAll = () =>
    api.get('/hackathons').then(r => setItems(r.data)).catch(() => {})

  useEffect(() => { fetchAll() }, [])

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setShowForm(true) }
  const openEdit = (item) => { setForm(item); setEditing(item._id); setShowForm(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editing) {
        await api.put(`/hackathons/${editing}`, form)
        showToast('Updated')
      } else {
        await api.post('/hackathons', form)
        showToast('Added')
      }
      setShowForm(false)
      fetchAll()
    } catch (err) {
      showToast(err.response?.data?.error || 'Error', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return
    try {
      await api.delete(`/hackathons/${id}`)
      showToast('Deleted')
      fetchAll()
    } catch {
      showToast('Failed', 'error')
    }
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const RESULT_COLORS = {
    'Winner': '#00ff88',
    'Runner-up': '#00f0ff',
    'Top 10': '#ff9900',
    'Top 50': '#7c3aed',
    'Participant': '#9ca3af'
  }

  return (
    <div className="min-h-screen bg-cyber-bg bg-grid scanlines">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity:0, y:-20 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-20 }}
            className="fixed top-6 right-6 z-[300] font-mono text-sm px-5 py-3 rounded border"
            style={{
              background: toast.type==='error' ? 'rgba(255,68,102,0.1)' : 'rgba(0,240,255,0.1)',
              borderColor: toast.type==='error' ? '#ff4466' : '#00f0ff',
              color: toast.type==='error' ? '#ff4466' : '#00f0ff'
            }}
          >
            {toast.type==='error' ? '✕' : '✓'} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">

          <div className="flex items-center gap-4">

            {/* 🔥 BACK BUTTON */}
            <button
              onClick={() => navigate('/admin')}
              className="font-orbitron text-xs px-4 py-2 rounded border border-cyber-primary/30 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary transition-all"
            >
              ← BACK TO DASHBOARD
            </button>

            <h1
              className="font-orbitron font-bold text-3xl"
              style={{ color:'#ff9900', textShadow:'0 0 10px #ff990066' }}
            >
              HACKATHONS
            </h1>
          </div>

          <button className="btn-cyber text-xs px-5 py-2" onClick={openAdd}>
            + ADD HACKATHON
          </button>
        </div>

        {/* Modal (unchanged) */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              exit={{ opacity:0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4"
              style={{ background:'rgba(0,0,0,0.85)' }}
              onClick={e => e.target===e.currentTarget && setShowForm(false)}
            >
              <motion.div
                initial={{ scale:0.9, opacity:0 }}
                animate={{ scale:1, opacity:1 }}
                exit={{ scale:0.9, opacity:0 }}
                className="cyber-card w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto"
              >
                <h2 className="font-orbitron font-bold text-xl mb-6" style={{ color:'#ff9900' }}>
                  {editing ? 'EDIT HACKATHON' : 'NEW HACKATHON'}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div><Label c="HACKATHON NAME *" /><Input value={form.name} onChange={set('name')} required /></div>
                  <div><Label c="ORGANIZER" /><Input value={form.organizer} onChange={set('organizer')} /></div>

                  <div className="grid grid-cols-2 gap-3">
                    <div><Label c="RESULT" /><Input value={form.result} onChange={set('result')} /></div>
                    <div><Label c="DATE" /><Input value={form.date} onChange={set('date')} /></div>
                  </div>

                  <div>
                    <Label c="DESCRIPTION" />
                    <textarea
                      value={form.description}
                      onChange={set('description')}
                      rows={3}
                      className="w-full bg-cyber-bg border border-cyber-primary/20 text-cyber-text font-mono text-sm px-4 py-3 rounded-md"
                    />
                  </div>

                  <div><Label c="CERTIFICATE URL" /><Input value={form.certificate} onChange={set('certificate')} /></div>

                  <div className="flex gap-3 mt-2">
                    <button type="submit" className="btn-cyber flex-1">{loading ? 'SAVING...' : 'SAVE'}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1">CANCEL</button>
                  </div>
                </form>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List (unchanged) */}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item._id} className="cyber-card flex justify-between p-4">
              <div>{item.name}</div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)}>edit</button>
                <button onClick={() => handleDelete(item._id)}>del</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}