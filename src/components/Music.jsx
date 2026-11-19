"use client"

import { backgroundMusic } from "@/data"
import { useEffect, useRef } from "react"

export default function Music({ shouldPlay }) {
    const audioRef = useRef(null)

    // Start downloading the music only after the page has loaded,
    // so it doesn't compete with the first screen.
    useEffect(() => {
        const timer = setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.preload = "auto"
                audioRef.current.load()
            }
        }, 3000)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (shouldPlay && audioRef.current) {
            audioRef.current.volume = 0.8
            audioRef.current.play().catch(console.log)
        }
    }, [shouldPlay])

    return (
        <audio ref={audioRef} loop preload="none">
            <source src={backgroundMusic} type="audio/mpeg" />
        </audio>
    )
}
