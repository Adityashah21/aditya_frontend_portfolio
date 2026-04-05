import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const { login }               = useAuth()
  const navigate                = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/admin')
    } catch {
      setError('ACCESS DENIED — Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cyber-bg bg-grid scanlines flex items-center justify-center px-6">

      {/* Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Corner decorations */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyber-primary/50" />
        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-cyber-primary/50" />
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-cyber-primary/50" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyber-primary/50" />

        <div className="cyber-card p-8">
          {/* Header */}
          <div className="mb-8">
            <p className="section-label mb-2">// RESTRICTED AREA</p>
            <h1 className="font-orbitron font-black text-3xl">
              <span className="text-white">ADMIN</span>
              <span className="neon-cyan ml-2">LOGIN</span>
            </h1>
            <p className="font-mono text-xs text-cyber-dim mt-2">
              // Authorized personnel only
            </p>
          </div>

          {/* autoComplete="off" on form, new-password on inputs to block autofill */}
          <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-5">

            {/* Hidden dummy fields trick — fools browser autofill */}
            <input type="text"     style={{ display: 'none' }} readOnly />
            <input type="password" style={{ display: 'none' }} readOnly />

            {/* Email */}
            <div>
              <label className="block font-mono text-xs text-cyber-dim tracking-widest mb-2">
                EMAIL_ADDRESS
              </label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@portfolio.dev"
                autoComplete="off"
                name="admin-email-field"
                className="w-full bg-cyber-bg border border-cyber-primary/20 text-cyber-text font-mono text-sm px-4 py-3 rounded-md outline-none focus:border-cyber-primary focus:shadow-[0_0_0_2px_rgba(0,240,255,0.15)] transition-all placeholder:text-cyber-dim"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-mono text-xs text-cyber-dim tracking-widest mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                autoComplete="new-password"
                name="admin-password-field"
                className="w-full bg-cyber-bg border border-cyber-primary/20 text-cyber-text font-mono text-sm px-4 py-3 rounded-md outline-none focus:border-cyber-primary focus:shadow-[0_0_0_2px_rgba(0,240,255,0.15)] transition-all placeholder:text-cyber-dim"
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-mono text-xs text-red-400 border border-red-500/20 bg-red-500/5 px-4 py-2 rounded"
              >
                ✕ {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-cyber w-full justify-center mt-2"
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block w-3 h-3 border border-cyber-primary border-t-transparent rounded-full" />
                  AUTHENTICATING...
                </span>
              ) : '▶ ENTER DASHBOARD'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-cyber-primary/10">
            <a href="/" className="font-mono text-xs text-cyber-dim hover:text-cyber-primary transition-colors">
              ← Back to portfolio
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}