"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Droplets, X, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

type WaitlistFloatProps = {
    brandName?: string
    collapseOffset?: number
    className?: string
}

export default function WaitlistFloat({
    brandName = "Summr",
    collapseOffset = 140,
    className,
}: WaitlistFloatProps = {}) {
    const [minimized, setMinimized] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const rafRef = useRef<number | null>(null)

    // Collapse on scroll
    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            rafRef.current = requestAnimationFrame(() => {
                const y = window.scrollY || document.documentElement.scrollTop
                setMinimized(y > collapseOffset)
            })
        }
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            window.removeEventListener("scroll", onScroll)
        }
    }, [collapseOffset])

    const onSubmit = async () => {
        setError(null)
        setSuccess(false)

        if (!name.trim()) {
            setError("Please enter your name.")
            return
        }
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        if (!emailOk) {
            setError("Please enter a valid email address.")
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), email: email.trim(), brand: brandName }),
            })
            // if (!res.ok) throw new Error("Request failed")
            setSuccess(true)
            setName("")
            setEmail("")
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            {/* Expanded glass panel */}
            <div
                className={cn(
                    "fixed top-8 right-8 z-50 transition-all duration-500 ease-out",
                    minimized ? "pointer-events-none opacity-0 translate-y-8 scale-95" : "opacity-100 translate-y-0 scale-100",
                    className,
                )}
                aria-hidden={minimized}
            >
                {/* Ambient glow effects */}
                <div className="absolute -inset-8 opacity-20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500 rounded-full blur-2xl animate-pulse delay-1000" />
                </div>

                <div className="relative w-72 bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden">
                    {/* Frosted glass overlay with subtle color tints */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/40 to-cyan-50/80 rounded-3xl" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-blue-100/30 via-transparent to-cyan-100/30 rounded-3xl" />
                    
                    {/* Subtle highlight on top edge */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/60 via-transparent to-transparent" />

                    {/* Header */}
                    <div className="relative p-6">
                        <div className="flex items-center justify-between ">
                            <h3 className="text-base font-semibold text-gray-900 tracking-tight">
                                Join {brandName}
                            </h3>
                            <button
                                onClick={() => setMinimized(true)}
                                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all duration-300"
                                aria-label="Minimize waitlist"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-600">Be the first to experience something extraordinary</p>
                    </div>

                    {/* Form */}
                    <div className="relative p-6 pt-0 space-y-4">
                        <div className="space-y-3 ">
                            <div className="relative">
                                <Input
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    autoComplete="name"
                                    className=" !text-xs h-10 bg-white/70 border-gray-200/80 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white/90 focus:border-blue-300/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-sm"
                                />
                            </div>
                            <div className="relative">
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className=" !text-xs h-10 bg-white/70 border-gray-200/80 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white/90 focus:border-blue-300/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-sm"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={onSubmit}
                            disabled={submitting || success}
                            className="w-full h-10 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 border-0 rounded-xl text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-300 disabled:opacity-50"
                        >
                            <Droplets className="mr-2 h-4 w-4" />
                            {submitting ? "Joining..." : success ? "Welcome aboard!" : "Join Waitlist"}
                        </Button>

                        <p className="text-[10px] text-gray-500 text-center">No spam, unsubscribe anytime</p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}
                        
                        {success && (
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-2 py-2 text-xs text-emerald-700">
                                <CheckCircle2 className="h-4 w-4" />
                                You&apos;re on the list! We&apos;ll be in touch soon.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Minimized pill button */}
            <div
                className={cn(
                    "fixed bottom-8 right-8 z-40 transition-all duration-500 ease-out",
                    minimized ? "opacity-100 translate-y-0 scale-100" : "pointer-events-none opacity-0 translate-y-8 scale-95",
                )}
            >
                <button
                    onClick={() => setMinimized(false)}
                    className="group relative flex items-center gap-3 h-14 px-6 bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-full text-gray-900 shadow-2xl shadow-black/10 hover:bg-white hover:border-gray-300/80 hover:shadow-xl transition-all duration-300"
                    aria-label="Expand join waitlist"
                >
                    {/* Button subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/60 to-cyan-50/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative flex items-center gap-3">
                        <Droplets className="h-5 w-5 text-cyan-600" />
                        <span className="font-medium">Join Waitlist</span>
                        
                    </div>
                </button>
            </div>
        </>
    )
}