import { useState } from 'react'
import { API } from '../api'
import { setToken } from '../auth'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      const { data } = await API.post('/auth/register', { email, password, name })
      setToken(data.token)
      nav('/dashboard')
    } catch (e: any) {
      setErr(e.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-xl animate-fade-in">
      <div className="glass-panel p-10 sm:p-12">
        <div className="section-title">Create account</div>
        <h1 className="mt-4 text-3xl font-semibold text-white">Join Ignite</h1>
        <p className="mt-3 text-sm text-white/60">
          Set up your profile to generate intelligent recommendations tailored to how you train.
        </p>
        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">Name</label>
            <input
              className="input-field"
              placeholder="Jordan Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              placeholder="Create a strong password"
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
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>
      <p className="mt-6 text-center text-sm text-white/60">
        Already have an account?{' '}
        <Link className="font-semibold text-white transition hover:text-red-400" to="/login">
          Log in
        </Link>
      </p>
    </div>
  )
}
