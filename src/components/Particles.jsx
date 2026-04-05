import { useEffect } from 'react'

export default function Particles() {
  useEffect(() => {
    const container = document.getElementById('particles-container')
    if (!container) return
    container.innerHTML = ''
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div')
      p.className = 'particle'
      p.style.left = Math.random() * 100 + 'vw'
      p.style.top = Math.random() * 100 + 'vh'
      p.style.width = (Math.random() * 2 + 1) + 'px'
      p.style.height = p.style.width
      p.style.animationDuration = (8 + Math.random() * 12) + 's'
      p.style.animationDelay = (Math.random() * 8) + 's'
      p.style.background = Math.random() > 0.6 ? '#7c3aed' : '#00f0ff'
      container.appendChild(p)
    }
  }, [])

  return (
    <div
      id="particles-container"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  )
}