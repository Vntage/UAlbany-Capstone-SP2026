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
      <nav className="w-full bg-white/95 backdrop-blur-md relative z-20 border-b border-gray-200">
        <div className="flex justify-between items-center w-full px-8 md:px-12 py-6 max-w-[1440px] mx-auto">
          <h1 className="text-2xl font-black text-sky-700 font-headline tracking-tight">
            Financial Monitoring and Insight System
          </h1>

          {/* Buttons container */}
          <div className="flex items-center gap-4">
            <Link to="/login">
              <button className="bg-sky-600 text-white px-6 py-2 rounded shadow hover:bg-sky-700 transition-colors duration-200 font-semibold">
                Login
              </button>
            </Link>

            <Link
              to="/signup"
              className="text-sky-600 font-semibold hover:underline transition-colors duration-200"
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
  className="w-full bg-sky-100 border-b border-gray-200 relative z-10 transition-all duration-300 ease-in-out"
>
  <div className="flex justify-start items-center w-full px-8 md:px-12 py-3 gap-8 max-w-[1440px] mx-auto">
    <Link
      className="font-label uppercase tracking-widest text-sky-700 font-bold text-sm border-b-2 border-sky-600 pb-1 opacity-80 hover:opacity-100 transition-opacity"
      to="#"
    >
      Solutions
    </Link>
    <Link
      className="font-label uppercase tracking-widest text-sky-600 opacity-80 hover:opacity-100 transition-opacity"
      to="#"
    >
      Outreach
    </Link>
    <Link
      className="font-label uppercase tracking-widest text-sky-600 opacity-80 hover:opacity-100 transition-opacity"
      to="#"
    >
      Company
    </Link>
  </div>
</nav>

<style>
  {`
    .nav-hidden {
      transform: translateY(-100%);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    }
  `}
</style>
    </header>
  )
}