import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getToken, setToken } from './auth'

export default function App() {
  const loc = useLocation()
  const nav = useNavigate()
  const token = getToken()
  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/dashboard" className="font-bold">SmartWorkout</Link>
          <Link to="/recommend" className={`hover:underline ${loc.pathname==='/recommend'?'font-semibold':''}`}>Recommend</Link>
          <Link to="/sessions" className={`hover:underline ${loc.pathname==='/sessions'?'font-semibold':''}`}>Sessions</Link>
          <div className="ml-auto flex items-center gap-3">
            {!token ? (
              <>
                <Link to="/login" className="text-sm px-3 py-1 rounded border">Login</Link>
                <Link to="/register" className="text-sm px-3 py-1 rounded bg-black text-white">Register</Link>
              </>
            ) : (
              <button onClick={()=>{ setToken(null); nav('/login'); }} className="text-sm px-3 py-1 rounded border">Logout</button>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}
