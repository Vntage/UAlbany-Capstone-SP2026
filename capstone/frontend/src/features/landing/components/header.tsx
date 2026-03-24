import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const secondaryNavRef = useRef<HTMLElement>(null)
  let lastScrollY = 0

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (!secondaryNavRef.current) return

      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        secondaryNavRef.current.classList.add('nav-hidden')
      } else {
        secondaryNavRef.current.classList.remove('nav-hidden')
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Primary Nav */}
      <nav className="w-full bg-surface relative z-20 border-b border-outline-variant/10">
        <div className="flex justify-between items-center w-full px-12 py-6 max-w-[1440px] mx-auto">
          <h1 className="text-2xl font-black text-primary font-headline tracking-tight">
            Financial Monitoring and Insight System
          </h1>

          {/* Buttons container */}
          <div className="flex items-center gap-4">
            {/* Login button */}
            <Link to="/login">
              <button className="cta-gradient text-on-primary px-8 py-2.5 rounded shadow-ambient font-bold hover:brightness-110 transition-colors duration-200">
                Login
              </button>
            </Link>

            {/* Signup text link */}
            <Link
              to="/signup"
              className="text-primary font-bold hover:underline transition-colors duration-200"
            >
              Signup
            </Link>
          </div>
        </div>
      </nav>

      {/* Secondary Nav */}
      <nav
        ref={secondaryNavRef}
        id="secondary-nav"
        className="w-full bg-surface-container-low border-b border-outline-variant/10 relative z-10 transition-transform duration-400 ease-in-out"
      >
        <div className="flex justify-start items-center w-full px-12 py-3 gap-8 max-w-[1440px] mx-auto">
          <a
            className="font-label uppercase tracking-widest text-secondary font-bold text-sm border-b-2 border-primary pb-1 opacity-80 hover:opacity-100 transition-opacity"
            href="#"
          >
            Solutions
          </a>
          <a
            className="font-label uppercase tracking-widest text-on-surface-variant opacity-80 hover:opacity-100 transition-opacity"
            href="#"
          >
            Outreach
          </a>
          <a
            className="font-label uppercase tracking-widest text-on-surface-variant opacity-80 hover:opacity-100 transition-opacity"
            href="#"
          >
            Company
          </a>
        </div>
      </nav>

      {/* Tailwind nav-hidden class */}
      <style>
        {`
          .nav-hidden {
            transform: translateY(-100%);
            opacity: 0;
            pointer-events: none;
          }
        `}
      </style>
    </header>
  )
}