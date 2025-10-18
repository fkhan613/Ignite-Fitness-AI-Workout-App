import { useEffect, useState } from 'react'
import { API } from '../api'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from 'recharts'

export default function Sessions() {
  const [sessions, setSessions] = useState<any[]>([])
  const [weekly, setWeekly] = useState<any>({})

  useEffect(()=>{
    (async ()=>{
      try {
        const { data } = await API.get('/sessions')
        setSessions(data)
        const w = await API.get('/stats/volume-weekly')
        setWeekly(w.data)
      } catch {}
    })()
  }, [])

  const weeklyData = Object.entries(weekly).map(([k,v])=>({ week: k, volume: v as number }))

  function addSet(sessionId: string) {
    const exId = prompt('exerciseId? (from plan)') || ''
    const reps = Number(prompt('reps?') || '10')
    const loadKg = Number(prompt('load (kg)?') || '20')
    API.patch(`/sessions/${sessionId}`, {
      $push: { actualSets: { exerciseId: exId, setNo: 1, reps, loadKg } }
    }).then(()=>{
      alert('Logged set (refresh page to see latest).')
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Sessions</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border rounded bg-white">
          <h2 className="font-semibold mb-2">Recent</h2>
          <ul className="space-y-2">
            {sessions.map(s=>(
              <li key={s._id} className="border rounded p-2">
                <div className="text-sm">{new Date(s.date).toLocaleString()} | Energy {s.energy} | Time {s.timeAvailableMin}m</div>
                <div className="text-xs text-gray-600">Planned: {s.plannedBlocks?.length} blocks | Logged sets: {s.actualSets?.length}</div>
                <button className="mt-2 text-sm px-2 py-1 rounded border" onClick={()=>addSet(s._id)}>Quick add set</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 border rounded bg-white">
          <h2 className="font-semibold mb-2">Weekly Volume</h2>
          {weeklyData.length === 0 ? <div className="text-sm text-gray-600">No volume yet.</div> : (
            <BarChart width={500} height={280} data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="volume" />
            </BarChart>
          )}
        </div>
      </div>
    </div>
  )
}
