'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toggleDarkMode } from '@/lib/theme'

interface NavigationProps {
  activePage?: 'jobs' | 'tracker' | 'resumes'
  showSearchBar?: boolean
}

export default function Navigation({
  activePage = 'jobs',
  showSearchBar = false,
}: NavigationProps) {
  const [isDark, setIsDark] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  function handleToggleDark() {
    toggleDarkMode()
    setIsDark((prev) => !prev)
  }

  const linkBase = 'transition-colors text-label-md'
  const activeLink =
    'text-secondary dark:text-secondary-fixed-dim font-bold border-b-2 border-secondary dark:border-secondary-fixed-dim pb-1'
  const inactiveLink =
    'text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim'

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface dark:bg-inverse-surface shadow-sm dark:shadow-none dark:border-b dark:border-outline">
      {/* Logo */}
      <Link
        href="/"
        className="text-headline-md font-bold text-primary dark:text-inverse-primary"
      >
        JobSpark
      </Link>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/" className={`${linkBase} ${activePage === 'jobs' ? activeLink : inactiveLink}`}>
          Jobs
        </Link>
        <Link href="/tracker" className={`${linkBase} ${activePage === 'tracker' ? activeLink : inactiveLink}`}>
          Tracker
        </Link>
        <Link href="/resume" className={`${linkBase} ${activePage === 'resumes' ? activeLink : inactiveLink}`}>
          My Resumes
        </Link>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {showSearchBar && (
          <div className="hidden md:flex items-center gap-2 bg-surface-container dark:bg-surface-container px-3 py-2 rounded-lg border border-outline-variant dark:border-outline">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-sm text-on-surface dark:text-inverse-on-surface placeholder:text-on-surface-variant w-40 outline-none"
              placeholder="Search jobs..."
              type="text"
            />
          </div>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={handleToggleDark}
          className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors p-2 rounded-full hover:bg-surface-container dark:hover:bg-surface-container"
          aria-label="Toggle dark mode"
        >
          <span className={`material-symbols-outlined ${isDark ? 'hidden' : 'block'}`}>dark_mode</span>
          <span className={`material-symbols-outlined ${isDark ? 'block' : 'hidden'}`}>light_mode</span>
        </button>

        {/* Notifications */}
        <button className="text-on-surface-variant hover:text-secondary transition-colors p-2 rounded-full">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        {/* Avatar placeholder */}
        <div className="w-8 h-8 rounded-full bg-surface-container dark:bg-surface-container border border-outline-variant flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">person</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-on-surface-variant p-2"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 w-full bg-surface dark:bg-inverse-surface border-b border-outline-variant dark:border-outline flex flex-col gap-1 px-4 py-4 md:hidden">
          <Link href="/" className={`${linkBase} py-2 ${activePage === 'jobs' ? 'text-secondary dark:text-secondary-fixed-dim font-bold' : inactiveLink}`}>
            Jobs
          </Link>
          <Link href="/tracker" className={`${linkBase} py-2 ${activePage === 'tracker' ? 'text-secondary dark:text-secondary-fixed-dim font-bold' : inactiveLink}`}>
            Tracker
          </Link>
          <Link href="/resume" className={`${linkBase} py-2 ${activePage === 'resumes' ? 'text-secondary dark:text-secondary-fixed-dim font-bold' : inactiveLink}`}>
            My Resumes
          </Link>
        </div>
      )}
    </nav>
  )
}
