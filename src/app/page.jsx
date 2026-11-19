"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import RainEffect from "@/components/RainEffect"
import FirstScreen from "@/components/FirstScreen"
import dynamic from "next/dynamic"
import CuteLoader from "@/components/CuteLoader"
import FloatingHearts from "@/components/FloatingHearts"
import Music from "@/components/Music"
import { questionOne, questionTwo, photos } from "@/data"

// Later screens (sweetalert, swiper, confetti) are split out of the first download
const loadQuestion = () => import("@/components/QuestionScreen")
const loadBalloons = () => import("@/components/BalloonsScreen")
const loadPhotos = () => import("@/components/PhotoScreen")
const loadFinal = () => import("@/components/FinalScreen")
const QuestionScreen = dynamic(loadQuestion, { ssr: false })
const BalloonsScreen = dynamic(loadBalloons, { ssr: false })
const PhotoScreen = dynamic(loadPhotos, { ssr: false })
const FinalScreen = dynamic(loadFinal, { ssr: false })

export default function ProposalSite() {
  const [currentScreen, setCurrentScreen] = useState("loader")
  const [isLoading, setIsLoading] = useState(true)
  const [musicStarted, setMusicStarted] = useState(false)

  useEffect(() => {
    // The loader is already visible (server-rendered) while the code downloads,
    // so only wait for whatever is left of ~1.2s since the page opened.
    // On a slow phone that's usually 0 — the first screen comes straight in.
    const remaining = Math.max(0, 1200 - performance.now())
    const timer = setTimeout(() => {
      setIsLoading(false)
      setCurrentScreen("first")
    }, remaining)

    // Once the first screen is up, fetch the later screens' code in the background
    const warmup = setTimeout(() => {
      loadQuestion(); loadBalloons(); loadPhotos(); loadFinal()
    }, 1500)

    return () => { clearTimeout(timer); clearTimeout(warmup) }
  }, [])

  // Preload photos one by one, only after the first screen is passed —
  // so they never slow down the first load on mobile, but are ready before the photo screen.
  const preloadStarted = useRef(false)
  useEffect(() => {
    if (currentScreen === "loader" || currentScreen === "first" || preloadStarted.current) return
    preloadStarted.current = true
    let i = 0
    const next = () => {
      if (i >= photos.length) return
      const img = new window.Image()
      img.onload = img.onerror = next
      img.src = photos[i++].src
    }
    next()
  }, [currentScreen])

  const nextScreen = (screen) => {
    if (!musicStarted) {
      setMusicStarted(true)
    }
    setCurrentScreen(screen)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-fuchsia-950/30 via-black/70 to-rose-950/40 relative overflow-hidden">

      {/* Dots background */}
      <div className="fixed inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-size-[40px_40px] opacity-10" />

      {/* Radial gradients for background (no CSS blur — it's very slow on phones;
          the wider gradient fade gives the same soft glow) */}
      <div className="fixed inset-0 z-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 25%, rgba(75, 0, 79, 0.6), transparent 55%)",
      }} />

      <div className="fixed inset-0 z-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 80% 80%, rgba(77, 2, 24, 0.6), transparent 55%)",
      }} />

      <div className="fixed inset-0 z-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(80, 0, 92, 0.5), transparent 55%)",
      }} />

      {!isLoading && <RainEffect />}

      <FloatingHearts />

      <Music shouldPlay={musicStarted} />

      <AnimatePresence mode="wait">
        {isLoading && <CuteLoader key="loader" onComplete={() => setCurrentScreen("first")} />}

        {currentScreen === "first" && <FirstScreen key="first" onNext={() => nextScreen("question1")} />}

        {currentScreen === "question1" && (
          <QuestionScreen
            key="question1"
            question={questionOne}
            onYes={() => nextScreen("question2")}
            isFirst={true}
          />
        )}

        {currentScreen === "question2" && (
          <QuestionScreen
            key="question2"
            question={questionTwo}
            onYes={() => nextScreen("balloons")}
            isFirst={false}
          />
        )}

        {currentScreen === "balloons" && <BalloonsScreen key="balloons" onNext={() => nextScreen("photos")} />}

        {currentScreen === "photos" && <PhotoScreen key="photos" onNext={() => nextScreen("final")} />}

        {currentScreen === "final" && <FinalScreen key="final" />}
      </AnimatePresence>

      {/* Watermark */}
      {/* <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 1,
        }}
        className="fixed bottom-4 right-4 text-[13px] text-white/40 pointer-events-none z-50 font-light">
        @anujbuilds
      </motion.div> */}
    </div>
  )
}
