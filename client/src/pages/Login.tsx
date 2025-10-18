import { useState } from 'react'
import { API } from '../api'
import { setToken } from '../auth'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      const { data } = await API.post('/auth/login', { email, password })
      setToken(data.token)
      nav('/dashboard')
    } catch (e: any) {
      setErr(e.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-xl animate-fade-in">
      <div className="glass-panel p-10 sm:p-12">
        <div className="section-title">Sign in</div>
        <h1 className="mt-4 text-3xl font-semibold text-white">Welcome back</h1>
        <p className="mt-3 text-sm text-white/60">
          Access your personalised training intelligence. Enter your credentials to ignite today’s session.
        </p>
        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">Email</label>
            <input
              className="input-field"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">Password</label>
            <input
              className="input-field"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {err && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-300">
              {err}
            </div>
          )}
          <button type="submit" className="accent-button w-full justify-center" disabled={loading}>
            {loading ? 'Signing in…' : 'Log in'}
          </button>
        </form>
      </div>
      <p className="mt-6 text-center text-sm text-white/60">
        No account yet?{' '}
        <Link className="font-semibold text-white transition hover:text-red-400" to="/register">
          Create one now
        </Link>
      </p>
    </div>
  )
}
