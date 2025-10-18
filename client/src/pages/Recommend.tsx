import { useEffect, useState } from 'react'
import { API } from '../api'

export default function Recommend() {
  const [energy, setEnergy] = useState(3)
  const [timeMin, setTimeMin] = useState(50)
  const [equipment, setEquipment] = useState('')
  const [soreness, setSoreness] = useState<Record<string, number>>({})
  const [plan, setPlan] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(()=>{
    (async ()=>{
      try { 
        const { data } = await API.get('/auth/me')
        setEquipment((data.equipmentOwned||[]).join(','))
      } catch {}
    })()
  }, [])

  async function getPlan() {
    setErr(null)
    setPlan(null)
    try {
      const { data } = await API.post('/recommendations', {
        energy,
        timeAvailableMin: timeMin,
        soreness,
        equipmentOverride: equipment.split(',').map(s=>s.trim()).filter(Boolean)
      })
      setPlan(data)
    } catch (e: any) {
      setErr(e.response?.data?.error || 'Failed to get plan')
    }
  }

  async function startSession() {
    if (!plan) return
    const plannedBlocks = plan.plan.map((p:any)=> ({
      exerciseId: p.exerciseId,
      targetSets: p.sets,
      targetReps: p.reps,
      restSec: p.restSec
    }))
    const { data } = await API.post('/sessions', {
      date: new Date().toISOString(),
      energy, soreness,
      availableEquipment: equipment.split(',').map((s)=>s.trim()).filter(Boolean),
      timeAvailableMin: timeMin,
      plannedBlocks, actualSets: []
    })
    alert('Session created. Go to Sessions to log sets.')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Get a Tailored Plan</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border rounded bg-white">
          <label className="block text-sm mb-1">Energy (1-5)</label>
          <input type="range" min={1} max={5} value={energy} onChange={e=>setEnergy(Number(e.target.value))} />
          <div className="text-sm mb-3">Energy: {energy}</div>

          <label className="block text-sm mb-1">Time Available (min)</label>
          <input className="w-full border px-3 py-2 rounded mb-3" type="number" value={timeMin} onChange={e=>setTimeMin(Number(e.target.value))} />

          <label className="block text-sm mb-1">Equipment Override (comma-separated)</label>
          <input className="w-full border px-3 py-2 rounded mb-3" value={equipment} onChange={e=>setEquipment(e.target.value)} />

          <button onClick={getPlan} className="bg-black text-white px-4 py-2 rounded">Get Plan</button>
          {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
        </div>

        <div className="p-4 border rounded bg-white">
          <h2 className="font-semibold mb-2">Plan</h2>
          {!plan ? <div className="text-sm text-gray-600">No plan yet.</div> : (
            <div>
              <p className="text-sm mb-2">{plan.rationale}</p>
              <ul className="space-y-2">
                {plan.plan.map((p:any, idx:number)=>(
                  <li key={idx} className="border rounded p-2">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm">Sets: {p.sets} | Reps: {p.reps} | Rest: {p.restSec}s</div>
                  </li>
                ))}
              </ul>
              <button onClick={startSession} className="mt-3 bg-green-600 text-white px-4 py-2 rounded">Start Session</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
