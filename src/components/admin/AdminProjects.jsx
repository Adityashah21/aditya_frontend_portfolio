import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../utils/api'

const EMPTY = {
  title: '', description: '', techStack: '',
  liveLink: '', githubLink: '', videoDemo: '',
  thumbnail: '', thumbnailId: '', featured: false, order: 0,
}

const Label = ({ children }) => (
  <label className="block font-mono text-xs text-cyber-dim tracking-widest mb-2">{children}</label>
)
const Input = ({ ...props }) => (
  <input {...props}
    className="w-full bg-cyber-bg border border-cyber-primary/20 text-cyber-text font-mono text-sm px-4 py-3 rounded-md outline-none focus:border-cyber-primary focus:shadow-[0_0_0_2px_rgba(0,240,255,0.15)] transition-all placeholder:text-cyber-dim" />
)

export default function AdminProjects() {
  const [projects, setProjects]     = useState([])
  const [showForm, setShowForm]     = useState(false)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(EMPTY)
  const [loading, setLoading]       = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [uploadPct, setUploadPct]   = useState(0)
  const [toast, setToast]           = useState(null)
  const fileRef                     = useRef(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchProjects = () =>
    api.get('/projects').then(r => setProjects(r.data)).catch(() => {})

  useEffect(() => { fetchProjects() }, [])

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowForm(true) }
  const openEdit = (p) => {
    setForm({
      title:       p.title       || '',
      description: p.description || '',
      techStack:   Array.isArray(p.techStack) ? p.techStack.join(', ') : '',
      liveLink:    p.liveLink    || '',
      githubLink:  p.githubLink  || '',
      videoDemo:   p.videoDemo   || '',
      thumbnail:   p.thumbnail   || '',
      thumbnailId: p.thumbnailId || '',
      featured:    Boolean(p.featured),
      order:       Number(p.order) || 0,
    })
    setEditing(p._id)
    setShowForm(true)
  }

  // Upload image to Cloudinary via backend
  const handleImageUpload = async (file) => {
    if (!file) return
    setUploading(true)
    setUploadPct(0)
    try {
      const fd = new FormData()
      fd.append('image', file)

      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setUploadPct(Math.round((e.loaded / e.total) * 100))
        },
      })

      // Save URL and public_id into form
      setForm(f => ({ ...f, thumbnail: res.data.url, thumbnailId: res.data.public_id }))
      showToast('Image uploaded ✓')
    } catch (err) {
      showToast('Image upload failed: ' + (err.response?.data?.error || err.message), 'error')
    } finally {
      setUploading(false)
      setUploadPct(0)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (uploading) { showToast('Wait for image upload to finish', 'error'); return }
    setLoading(true)

    const payload = {
      title:       form.title.trim(),
      description: form.description.trim(),
      techStack:   form.techStack.split(',').map(s => s.trim()).filter(Boolean),
      liveLink:    form.liveLink.trim(),
      githubLink:  form.githubLink.trim(),
      videoDemo:   form.videoDemo.trim(),
      thumbnail:   form.thumbnail.trim(),
      thumbnailId: form.thumbnailId.trim(),
      featured:    Boolean(form.featured),
      order:       Number(form.order) || 0,
    }

    try {
      if (editing) {
        await api.put(`/projects/${editing}`, payload)
        showToast('Project updated ✓')
      } else {
        await api.post('/projects', payload)
        showToast('Project added ✓')
      }
      setShowForm(false)
      setEditing(null)
      setForm(EMPTY)
      fetchProjects()
    } catch (err) {
      showToast('Error: ' + (err.response?.data?.error || err.message), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await api.delete(`/projects/${id}`)
      showToast('Deleted')
      fetchProjects()
    } catch (err) {
      showToast('Delete failed', 'error')
    }
  }

  const removeImage = () => {
    setForm(f => ({ ...f, thumbnail: '', thumbnailId: '' }))
    if (fileRef.current) fileRef.current.value = ''
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="min-h-screen bg-cyber-bg bg-grid scanlines">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[300] font-mono text-sm px-5 py-3 rounded border max-w-sm"
            style={{
              background:  toast.type === 'error' ? 'rgba(255,68,102,0.15)' : 'rgba(0,240,255,0.1)',
              borderColor: toast.type === 'error' ? '#ff4466' : '#00f0ff',
              color:       toast.type === 'error' ? '#ff4466' : '#00f0ff',
            }}>
            {toast.msg}
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
            <h1 className="font-orbitron font-bold text-3xl neon-cyan">PROJECTS</h1>
          </div>
          <button className="btn-cyber text-xs px-5 py-2" onClick={openAdd}>
            + ADD PROJECT
          </button>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.88)' }}
              onClick={e => e.target === e.currentTarget && setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="cyber-card w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto"
              >
                <h2 className="font-orbitron font-bold text-xl neon-cyan mb-6">
                  {editing ? 'EDIT PROJECT' : 'NEW PROJECT'}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                  <div><Label>TITLE *</Label>
                    <Input value={form.title} onChange={set('title')} required placeholder="My Project" />
                  </div>

                  <div><Label>DESCRIPTION *</Label>
                    <textarea value={form.description} onChange={set('description')} required rows={3}
                      placeholder="What does this project do?"
                      className="w-full bg-cyber-bg border border-cyber-primary/20 text-cyber-text font-mono text-sm px-4 py-3 rounded-md outline-none focus:border-cyber-primary transition-all placeholder:text-cyber-dim resize-vertical" />
                  </div>

                  <div><Label>TECH STACK (comma separated)</Label>
                    <Input value={form.techStack} onChange={set('techStack')} placeholder="React, Node.js, MongoDB" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>LIVE URL</Label>
                      <Input value={form.liveLink} onChange={set('liveLink')} placeholder="https://..." />
                    </div>
                    <div><Label>GITHUB URL</Label>
                      <Input value={form.githubLink} onChange={set('githubLink')} placeholder="https://github.com/..." />
                    </div>
                  </div>

                  <div><Label>VIDEO DEMO URL</Label>
                    <Input value={form.videoDemo} onChange={set('videoDemo')} placeholder="https://youtube.com/..." />
                  </div>

                  {/* ── Image Upload ── */}
                  <div>
                    <Label>THUMBNAIL IMAGE</Label>

                    {/* Preview box */}
                    {form.thumbnail ? (
                      <div className="relative mb-3 rounded-md overflow-hidden group"
                        style={{ border: '1px solid rgba(0,240,255,0.2)' }}>
                        <img src={form.thumbnail} alt="thumbnail"
                          className="w-full h-40 object-cover" />
                        {/* Remove button */}
                        <button type="button" onClick={removeImage}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: 'rgba(255,68,102,0.85)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                          ✕
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5"
                          style={{ background: 'rgba(0,0,0,0.6)' }}>
                          <p className="font-mono text-xs text-cyber-primary truncate">✓ Image uploaded</p>
                        </div>
                      </div>
                    ) : (
                      /* Drop zone / picker */
                      <div
                        onClick={() => fileRef.current?.click()}
                        className="w-full h-32 rounded-md flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
                        style={{
                          border: '2px dashed rgba(0,240,255,0.25)',
                          background: 'rgba(0,240,255,0.02)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,240,255,0.5)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,240,255,0.25)'}
                      >
                        {uploading ? (
                          <>
                            <div className="w-32 h-1.5 rounded bg-cyber-surface overflow-hidden">
                              <div className="h-full rounded transition-all duration-300"
                                style={{ width: `${uploadPct}%`, background: 'linear-gradient(90deg, #00f0ff, #7c3aed)' }} />
                            </div>
                            <p className="font-mono text-xs text-cyber-primary">Uploading {uploadPct}%...</p>
                          </>
                        ) : (
                          <>
                            <span className="text-3xl">📁</span>
                            <p className="font-mono text-xs text-cyber-dim">Click to select image</p>
                            <p className="font-mono text-xs text-cyber-dim" style={{ fontSize: 10 }}>JPG, PNG, WEBP — max 5MB</p>
                          </>
                        )}
                      </div>
                    )}

                    {/* Hidden file input */}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                      }}
                    />
                  </div>

                  {/* Featured */}
                  <label className="flex items-center gap-3 cursor-pointer font-mono text-sm text-cyber-muted select-none">
                    <input type="checkbox" checked={form.featured}
                      onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                      className="w-4 h-4 accent-cyber-primary cursor-pointer" />
                    Mark as Featured
                  </label>

                  {/* Submit */}
                  <div className="flex gap-3 mt-2">
                    <button type="submit"
                      className="btn-cyber flex-1 justify-center"
                      disabled={loading || uploading}
                      style={{ opacity: (loading || uploading) ? 0.6 : 1 }}>
                      {loading ? 'SAVING...' : uploading ? 'UPLOADING...' : editing ? 'UPDATE PROJECT' : 'ADD PROJECT'}
                    </button>
                    <button type="button"
                      onClick={() => { setShowForm(false); setEditing(null) }}
                      className="flex-1 font-orbitron text-xs py-3 px-4 rounded border border-cyber-primary/20 text-cyber-dim hover:border-cyber-primary/40 transition-all">
                      CANCEL
                    </button>
                  </div>

                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects list */}
        <div className="flex flex-col gap-3">
          {projects.length === 0 ? (
            <p className="font-mono text-sm text-cyber-dim text-center py-16">
              // No projects yet — click ADD PROJECT to get started
            </p>
          ) : projects.map((p, i) => (
            <motion.div key={p._id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="cyber-card px-5 py-4 flex items-center gap-4 justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {p.thumbnail ? (
                  <img src={p.thumbnail} alt={p.title}
                    className="w-16 h-11 object-cover rounded flex-shrink-0"
                    onError={e => { e.target.style.display = 'none' }} />
                ) : (
                  <div className="w-16 h-11 rounded flex-shrink-0 flex items-center justify-center text-xl"
                    style={{ background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.1)' }}>
                    🎮
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-orbitron font-bold text-sm text-cyber-text truncate">
                    {p.title}
                    {p.featured && <span className="ml-2 font-mono text-xs text-cyber-primary">★</span>}
                  </h3>
                  <p className="font-mono text-xs text-cyber-dim truncate mt-0.5">
                    {Array.isArray(p.techStack) && p.techStack.length > 0 ? p.techStack.join(', ') : 'No tech stack'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(p)}
                  className="font-mono text-xs px-3 py-1.5 rounded border border-cyber-primary/20 text-cyber-primary hover:border-cyber-primary/50 hover:bg-cyber-primary/5 transition-all">
                  edit
                </button>
                <button onClick={() => handleDelete(p._id)}
                  className="font-mono text-xs px-3 py-1.5 rounded border border-red-500/20 text-red-400 hover:border-red-500/50 hover:bg-red-500/5 transition-all">
                  del
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}