import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { API } from '../api'

export default function Dashboard() {
  const [me, setMe] = useState<any>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [goals, setGoals] = useState<string[]>(['hypertrophy'])
  const [equipment, setEquipment] = useState<string>('dumbbells,bench,barbell,rack')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await API.get('/auth/me')
        setMe(data)
        setGoals(data.goals || ['hypertrophy'])
        setEquipment((data.equipmentOwned || []).join(', '))
      } catch {}
    })()
  }, [])

  const equipmentList = useMemo(
    () => equipment.split(',').map((s) => s.trim()).filter(Boolean),
    [equipment]
  )

  const primaryGoal = goals[0] ? goals[0].replace(/_/g, ' ') : 'hypertrophy'

  async function save() {
    setMessage(null)
    setSaving(true)
    try {
      const { data } = await API.put('/auth/me', {
        goals,
        equipmentOwned: equipmentList
      })
      setMe(data)
      setMessage('Preferences synced successfully!')
    } catch {
      setMessage('We could not save your preferences. Try again in a moment.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-12 animate-fade-in">
      <section className="glass-panel overflow-hidden p-8 sm:p-10">
        <div className="section-title">Welcome back</div>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              {me?.name ? `Hey, ${me.name.split(' ')[0]}!` : 'Hey, Athlete!'}
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/60 sm:text-base">
              Dial in your goals, equipment, and get AI-personalised workouts that flex to your energy every day.
            </p>
          </div>
          <div className="flex gap-4">
            <StatCard label="Primary Focus" value={primaryGoal} />
            <StatCard
              label="Ready Equipment"
              value={`${equipmentList.length} item${equipmentList.length === 1 ? '' : 's'}`}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="glass-panel p-8 sm:p-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="section-title">Profile</div>
              <h2 className="card-title mt-3">Personal Preferences</h2>
            </div>
            {message && (
              <span className="rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-medium text-white/70">
                {message}
              </span>
            )}
          </div>
          <p className="mt-4 text-sm text-white/60">
            Tune what you’re training for and what kit you have on hand so Ignite can design sessions that fit the moment.
          </p>
          <div className="panel-divider my-8" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
                Goals
              </label>
              <input
                className="input-field"
                value={goals.join(', ')}
                onChange={(e) =>
                  setGoals(
                    e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="strength, hypertrophy, endurance, fat_loss"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
                Equipment Owned
              </label>
              <input
                className="input-field"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="dumbbells, bench, rack"
              />
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={save}
              className="accent-button"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save preferences'}
            </button>
            <span className="text-xs text-white/50">
              Separate entries with commas to keep things sharp and simple.
            </span>
          </div>
        </div>

        <aside className="glass-panel flex flex-col gap-8 p-8 sm:p-10">
          <div>
            <div className="section-title">Momentum</div>
            <h2 className="card-title mt-3">Quick Tips</h2>
            <p className="mt-4 text-sm text-white/60">
              Layer these rituals into your routine to get the most from Ignite.
            </p>
          </div>
          <ul className="space-y-4 text-sm text-white/70">
            <TipItem title="Keep equipment fresh">
              Refresh your gear list whenever you switch spaces so recommendations stay realistic.
            </TipItem>
            <TipItem title="Prime each session">
              Check the Recommend tab before lifting to sync intensity with your daily energy.
            </TipItem>
            <TipItem title="Log the grind">
              Track sets in Sessions to unlock adaptive progress charts and load management.
            </TipItem>
          </ul>
        </aside>
      </section>
    </div>
  )
}

type TipProps = {
  title: string
  children: ReactNode
}

function TipItem({ title, children }: TipProps) {
  return (
    <li className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-red-400/60">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-xs text-white/60">{children}</p>
    </li>
  )
}

type StatCardProps = {
  label: string
  value: string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex min-w-[140px] flex-col justify-between rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white shadow-inner shadow-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/60">
      <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50">{label}</span>
      <span className="mt-3 text-lg font-semibold capitalize text-white">{value || '—'}</span>
    </div>
  )
}
