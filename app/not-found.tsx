"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";

function NotFound() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 px-6 py-12 text-zinc-900">
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(#a1a1aa_0.7px,transparent_0.7px)] [background-size:24px_24px] opacity-30" />
            </div>

            <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                {/* Illustration */}
                <div className="relative mb-2 w-full max-w-md">
                    <div className="absolute inset-10 rounded-full bg-violet-300/20 blur-3xl" />
                    <Image
                        src="/not-found.svg"
                        alt="Page not found illustration"
                        width={500}
                        height={400}
                        priority
                        className="relative h-auto w-full drop-shadow-sm"
                    />
                </div>

                {/* Error badge */}
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" />
                    <span className="text-sm font-medium text-zinc-600">
                        Error 404 · Page not found
                    </span>
                </div>

                {/* Main content */}
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                    Oops! Lost in{" "}
                    <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                        space?
                    </span>
                </h1>

                <p className="mt-5 max-w-lg text-base leading-7 text-zinc-500 sm:text-lg">
                    The page you&apos;re looking for doesn&apos;t exist or may have been
                    moved. Let&apos;s get you back on track.
                </p>

                {/* Actions */}
                <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                    <Link
                        href="/"
                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                    >
                        <Home size={18} />
                        Back to Home
                        <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>

                <p className="mt-12 text-xs font-medium tracking-wide text-zinc-400">
                    LOST YOUR WAY? IT HAPPENS.
                </p>
            </section>
        </main>
    );
}

export default NotFound;