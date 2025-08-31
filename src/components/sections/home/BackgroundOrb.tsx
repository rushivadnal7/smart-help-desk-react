"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function BackgroundOrb() {
  const orbRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!orbRef.current) return

    // ✅ Scroll expand effect when leaving Hero
    const expandTween = gsap.to(orbRef.current, {
      scale: 12,            // grow until it fills screen
      borderRadius: "0%",   // optional → morphs into a full rect
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: "#hero",          // anchor to hero section
        start: "bottom bottom",    // when bottom of hero hits bottom of viewport
        end: "bottom top",         // until hero scrolls completely out
        scrub: true,
      },
    })

    return () => {
      expandTween.scrollTrigger?.kill()
      expandTween.kill()
    }
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[40] flex items-center justify-center"
    >
      {/* Orb container */}
      <motion.div
        ref={orbRef}
        className="relative w-[300px] h-[300px] rounded-full"
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glow layers */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2
                     w-[560px] h-[560px] rounded-full
                     bg-gradient-to-t from-cyan-400 via-blue-500 to-transparent
                     blur-3xl opacity-60"
          animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.04, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2
                     w-[380px] h-[380px] rounded-full
                     bg-gradient-to-t from-blue-300 via-cyan-300 to-transparent
                     blur-2xl opacity-40"
          animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2
                     w-[200px] h-[200px] rounded-full
                     bg-gradient-to-t from-white via-cyan-200 to-transparent
                     blur-xl opacity-25"
          animate={{ opacity: [0.22, 0.35, 0.22], scale: [1, 1.12, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  )
}
