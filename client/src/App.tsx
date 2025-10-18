import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getToken, setToken } from './auth'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/recommend', label: 'Recommend' },
  { href: '/sessions', label: 'Sessions' }
]

export default function App() {
  const loc = useLocation()
  const nav = useNavigate()
  const token = getToken()

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-18rem] h-[34rem] w-[34rem] rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute top-[30%] left-[-16rem] h-[28rem] w-[28rem] rounded-full bg-red-700/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] right-[5%] h-[24rem] w-[24rem] rounded-full bg-white/5 blur-3xl" />
      </div>

      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-10 px-6 py-5">
          <Link
            to="/dashboard"
            className="group relative flex items-center gap-3 text-lg font-semibold text-white"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500 text-sm font-bold tracking-[0.25em] text-white shadow-lg shadow-red-500/40 transition-transform duration-300 group-hover:-translate-y-0.5">
              SW
            </span>
            <span className="flex flex-col leading-none">
              <span className="uppercase tracking-[0.6em] text-xs text-white/70">Ignite</span>
              <span className="text-base font-semibold">SmartWorkout</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              const isActive = loc.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`group relative text-xs font-medium uppercase tracking-[0.4em] transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 -bottom-2 h-[2px] w-full origin-left bg-gradient-to-r from-red-500 via-red-400 to-transparent transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              )
            })}
          </div>

          <div className="ml-auto flex items-center gap-3">
            {!token ? (
              <>
                <Link to="/login" className="secondary-button">Login</Link>
                <Link to="/register" className="accent-button">Join Now</Link>
              </>
            ) : (
              <button
                onClick={() => {
                  setToken(null)
                  nav('/login')
                }}
                className="secondary-button"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-16 sm:pt-20">
        <Outlet />
      </main>
    </div>
  )
}
