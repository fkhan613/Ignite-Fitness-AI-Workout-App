import { useEffect, useMemo, useState } from 'react'
import { API } from '../api'

export default function Recommend() {
  const [energy, setEnergy] = useState(3)
  const [timeMin, setTimeMin] = useState(50)
  const [equipment, setEquipment] = useState('')
  const [soreness, setSoreness] = useState<Record<string, number>>({})
  const [plan, setPlan] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await API.get('/auth/me')
        setEquipment((data.equipmentOwned || []).join(', '))
      } catch {}
    })()
  }, [])

  const equipmentList = useMemo(
    () => equipment.split(',').map((s) => s.trim()).filter(Boolean),
    [equipment]
  )

  async function getPlan() {
    setErr(null)
    setPlan(null)
    setLoading(true)
    try {
      const { data } = await API.post('/recommendations', {
        energy,
        timeAvailableMin: timeMin,
        soreness,
        equipmentOverride: equipmentList
      })
      setPlan(data)
    } catch (e: any) {
      setErr(e.response?.data?.error || 'Failed to build your plan.')
    } finally {
      setLoading(false)
    }
  }

  async function startSession() {
    if (!plan) return
    const plannedBlocks = plan.plan.map((p: any) => ({
      exerciseId: p.exerciseId,
      targetSets: p.sets,
      targetReps: p.reps,
      restSec: p.restSec
    }))
    try {
      await API.post('/sessions', {
        date: new Date().toISOString(),
        energy,
        soreness,
        availableEquipment: equipmentList,
        timeAvailableMin: timeMin,
        plannedBlocks,
        actualSets: []
      })
      alert('Session created. Go to Sessions to log sets.')
    } catch (e: any) {
      alert(e.response?.data?.error || 'We could not start the session just yet.')
    }
  }

  return (
    <div className="space-y-12 animate-fade-in">
      <section className="glass-panel p-8 sm:p-10">
        <div className="section-title">Plan builder</div>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Craft your next session</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60 sm:text-base">
              Feed Ignite your energy, time, and available kit. We’ll design a minimal, high-impact block list that adapts on the fly.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/70 shadow-inner shadow-white/10">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Energy scale</p>
            <p className="mt-2 text-2xl font-semibold text-white">{energy}/5</p>
            <p className="mt-1 text-xs text-white/50">Slide to match how ready you feel.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass-panel p-8 sm:p-10">
          <div className="section-title">Inputs</div>
          <h2 className="card-title mt-3">Session parameters</h2>
          <p className="mt-3 text-sm text-white/60">
            Every field is optional, but the more context you give, the sharper the plan.
          </p>
          <div className="panel-divider my-8" />

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">Energy (1-5)</label>
              <input
                type="range"
                min={1}
                max={5}
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
                  Time available (min)
                </label>
                <input
                  className="input-field"
                  type="number"
                  min={15}
                  value={timeMin}
                  onChange={(e) => setTimeMin(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
                  Equipment override
                </label>
                <input
                  className="input-field"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  placeholder="dumbbells, kettlebell, bike"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">Soreness map</span>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setSoreness({})}
                >
                  Reset soreness
                </button>
              </div>
              <p className="text-xs text-white/50">
                Track how each muscle group feels. Lower numbers mean fresher muscles ready to push.
              </p>
              <SorenessEditor soreness={soreness} onChange={setSoreness} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={getPlan} className="accent-button" disabled={loading}>
                {loading ? 'Generating…' : 'Generate plan'}
              </button>
              {err && (
                <span className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-300">
                  {err}
                </span>
              )}
            </div>
          </div>
        </div>

        <aside className="glass-panel flex h-full flex-col p-8 sm:p-10">
          <div className="section-title">Output</div>
          <h2 className="card-title mt-3">Your AI plan</h2>
          <p className="mt-3 text-sm text-white/60">
            Plans blend hypertrophy and strength to match your focus. Every block transitions smoothly.
          </p>

          <div className="panel-divider my-8" />

          {!plan ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-sm text-white/50">
              Awaiting inputs. Generate to see sets, reps, and rest tailored to you.
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-6">
              <p className="text-sm text-white/70">{plan.rationale}</p>
              <ul className="space-y-4">
                {plan.plan.map((p: any, idx: number) => (
                  <li
                    key={idx}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 shadow-inner shadow-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/60"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{p.name}</span>
                      <span className="text-xs uppercase tracking-[0.3em] text-red-400/90">{p.focus || 'Block'}</span>
                    </div>
                    <div className="mt-2 text-xs text-white/60">
                      {p.sets} sets × {p.reps} reps &bull; Rest {p.restSec}s
                    </div>
                  </li>
                ))}
              </ul>
              <button onClick={startSession} className="accent-button mt-auto w-full justify-center">
                Start this session
              </button>
            </div>
          )}
        </aside>
      </section>
    </div>
  )
}

type SorenessEditorProps = {
  soreness: Record<string, number>
  onChange: (value: Record<string, number>) => void
}

const muscleGroups = ['chest', 'back', 'legs', 'glutes', 'core', 'shoulders', 'arms']

function SorenessEditor({ soreness, onChange }: SorenessEditorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {muscleGroups.map((group) => {
        const current = soreness[group] ?? 1
        return (
          <div
            key={group}
            className="rounded-2xl border border-white/10 bg-black/30 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/60"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold capitalize text-white">{group}</span>
              <span className="text-xs text-white/50">{current}/5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={current}
              onChange={(e) => onChange({ ...soreness, [group]: Number(e.target.value) })}
              className="mt-3 w-full accent-red-500"
            />
            <button
              type="button"
              className="mt-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/40 transition hover:text-red-300"
              onClick={() => {
                const next = { ...soreness }
                delete next[group]
                onChange(next)
              }}
            >
              Clear
            </button>
          </div>
        )
      })}
    </div>
  )
}
