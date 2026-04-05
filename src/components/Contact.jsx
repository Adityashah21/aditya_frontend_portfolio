import { useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const SOCIALS = [
  { label: 'GITHUB',   href: 'https://github.com/Adityashah21',          icon: '⌥', color: '#00f0ff' },
  { label: 'LINKEDIN', href: 'https://linkedin.com/in/aditya-shah',       icon: '◈', color: '#7c3aed' },
  { label: 'EMAIL',    href: 'mailto:adityashah@email.com',               icon: '✉', color: '#ff00ff' },
]

export default function Contact() {
  const [hover, setHover] = useState(null)

  return (
    <section id="contact" className="py-28 px-6 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(124,58,237,0.05) 0%, transparent 60%)' }} />

      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <p className="section-label mb-3">// LEVEL 5</p>
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6">
            <span className="text-white">LET'S</span>
            <span className="neon-cyan ml-3">_CONNECT</span>
          </h2>
          <p className="text-cyber-muted font-mono text-sm mb-14">
            // let's build something amazing together
          </p>
        </ScrollReveal>

        {/* Social links */}
        <div className="flex justify-center gap-8 flex-wrap mb-20">
          {SOCIALS.map(({ label, href, icon, color }, i) => (
            <ScrollReveal key={label} delay={i * 0.12}>
              <motion.a
                href={href} target="_blank" rel="noreferrer"
                whileHover={{ scale: 1.08, y: -4 }}
                onHoverStart={() => setHover(label)}
                onHoverEnd={() => setHover(null)}
                className="flex flex-col items-center gap-3 group"
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  animate={hover === label ? { boxShadow: `0 0 30px ${color}66` } : { boxShadow: '0 0 0px transparent' }}
                  className="cyber-card w-20 h-20 flex items-center justify-center text-3xl"
                  style={{ borderColor: hover === label ? color : undefined }}
                >
                  <span>{icon}</span>
                </motion.div>
                <span className="font-orbitron text-xs tracking-widest"
                  style={{ color: hover === label ? color : 'rgba(224,242,254,0.4)' }}>
                  {label}
                </span>
              </motion.a>
            </ScrollReveal>
          ))}
        </div>

        {/* Footer */}
        <ScrollReveal delay={0.4}>
          <div className="border-t border-cyber-primary/10 pt-10">
            <div className="holo-border inline-block mb-6">
              <div className="bg-cyber-bg px-6 py-2">
                <span className="font-orbitron text-xs tracking-widest text-cyber-primary">
                  QUEST COMPLETE
                </span>
              </div>
            </div>
            <p className="font-mono text-xs text-cyber-dim">
              © {new Date().getFullYear()} ADITYA SHAH — BUILT WITH REACT + NODE.JS
            </p>
            <p className="font-mono text-xs text-cyber-dim mt-2">
              // Thanks for visiting 🎮
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}