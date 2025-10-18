import { useEffect, useState } from 'react'
import { API } from '../api'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Sessions() {
  const [sessions, setSessions] = useState<any[]>([])
  const [weekly, setWeekly] = useState<any>({})

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await API.get('/sessions')
        setSessions(data)
        const w = await API.get('/stats/volume-weekly')
        setWeekly(w.data)
      } catch {}
    })()
  }, [])

  const weeklyData = Object.entries(weekly).map(([k, v]) => ({ week: k, volume: v as number }))

  function addSet(sessionId: string) {
    const exId = prompt('exerciseId? (from plan)') || ''
    const reps = Number(prompt('reps?') || '10')
    const loadKg = Number(prompt('load (kg)?') || '20')
    API.patch(`/sessions/${sessionId}`, {
      $push: { actualSets: { exerciseId: exId, setNo: 1, reps, loadKg } }
    }).then(() => {
      alert('Logged set (refresh page to see latest).')
    })
  }

  return (
    <div className="space-y-12 animate-fade-in">
      <section className="glass-panel p-8 sm:p-10">
        <div className="section-title">Performance</div>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Session insights</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60 sm:text-base">
              Review the blocks you’ve completed, add sets on the fly, and watch weekly volume evolve in real time.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/70 shadow-inner shadow-white/10">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Total sessions logged</p>
            <p className="mt-2 text-2xl font-semibold text-white">{sessions.length}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
        <div className="glass-panel p-8 sm:p-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="section-title">Recent</div>
              <h2 className="card-title mt-3">Latest sessions</h2>
            </div>
            <span className="text-xs text-white/50">Tap a session to add quick sets.</span>
          </div>
          <div className="panel-divider my-8" />
          {sessions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-sm text-white/60">
              No sessions yet. Generate a plan and start logging to see your timeline light up.
            </div>
          ) : (
            <ul className="space-y-4">
              {sessions.map((s) => (
                <li
                  key={s._id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/60"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {new Date(s.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                      <p className="text-xs text-white/60">
                        Energy {s.energy} • {s.timeAvailableMin} min available
                      </p>
                    </div>
                    <button className="secondary-button" onClick={() => addSet(s._id)}>
                      Quick add set
                    </button>
                  </div>
                  <div className="mt-4 grid gap-4 rounded-2xl bg-black/40 p-4 text-xs text-white/60 sm:grid-cols-3">
                    <div>
                      <p className="font-semibold text-white/80">Planned blocks</p>
                      <p className="mt-1 text-lg font-semibold text-white">{s.plannedBlocks?.length || 0}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-white/80">Logged sets</p>
                      <p className="mt-1 text-lg font-semibold text-white">{s.actualSets?.length || 0}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-white/80">Status</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.35em] text-red-400/90">
                        {s.actualSets?.length ? 'In progress' : 'Planned'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="glass-panel p-8 sm:p-10">
          <div className="section-title">Volume</div>
          <h2 className="card-title mt-3">Weekly load</h2>
          <p className="mt-3 text-sm text-white/60">
            Volume blends all logged sets. Track how consistently you’re building workload week over week.
          </p>
          <div className="panel-divider my-8" />
          {weeklyData.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-sm text-white/60">
              No volume yet. Logging sets will populate this chart automatically.
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="week" stroke="#ffffff88" tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff88" tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0f0f0f', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                  />
                  <Bar dataKey="volume" radius={[12, 12, 4, 4]} fill="url(#volumeGradient)" />
                  <defs>
                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </aside>
      </section>
    </div>
  )
}
