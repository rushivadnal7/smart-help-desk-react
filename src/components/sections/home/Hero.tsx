"use client"

import { PrimaryButton } from "@/components/ui/AnimatedPrimaryButton"
import { RotateWords } from "@/components/ui/RotateWords"
import { SecondaryButton } from "@/components/ui/SecondaryButton"
import { motion } from "framer-motion"
import { useRef } from "react"

export default function Hero() {

  const targetRef = useRef<HTMLDivElement | null>(null)

  const handleScroll = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }


  return (
    <section
      id="hero"
      className="min-h-screen relative z-10 flex items-center  max-w-screen justify-center text-white overflow-hidden "
    >
      <div className="container mx-auto max-w-7xl  flex justify-between flex-col-reverse md:flex-row gap-12 items-center">

        {/* Left Side - Content */}
        <div className="z-30 text-center md:text-left">
          <div className="w-full hidden md:flex  items-center justify-center md:justify-start">
            <RotateWords
              text="AI that can"
              words={["analyze", "respond", "prioritize", "assist"]}
            />
          </div>

          <p className="mt-5 max-w-xl hidden md:block mx-auto md:mx-0 text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
            AI-driven sales automation & insights. Empower your team, close more
            deals, and maximize revenue effortlessly.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
            {/* <SecondaryButton className="border-2 w-full sm:w-auto">
              Watch Demo
            </SecondaryButton> */}
            <PrimaryButton
              className="w-full sm:w-auto"
              onClick={() => {
                document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Get started for free
            </PrimaryButton>

          </div>
        </div>

        {/* Right Side - Video */}
        <div className="flex flex-col md:justify-end-safe md:items-end items-center justify-center ">
          <div className="w-full flex md:hidden items-center justify-center md:justify-start">
            <RotateWords
              text="AI that can"
              words={["analyze", "respond", "prioritize", "assist"]}
            />
          </div>

          <p className="mt-5 max-w-80 text-justify  md:hidden block  mx-auto md:mx-0 text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
            AI-driven sales automation & insights. Empower your team, close more
            deals, and maximize revenue effortlessly.
          </p>
 
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-[280px] h-[280px]  sm:w-[350px] sm:h-[350px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden shadow-2xl"
          >
            <img
              src="/hero-bg-video.gif"
              alt="Hero animation"
              className="w-full h-full object-cover"
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
