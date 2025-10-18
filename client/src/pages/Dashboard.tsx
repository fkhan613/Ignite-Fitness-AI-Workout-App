import { useEffect, useState } from 'react'
import { API } from '../api'

export default function Dashboard() {
  const [me, setMe] = useState<any>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [goals, setGoals] = useState<string[]>(['hypertrophy'])
  const [equipment, setEquipment] = useState<string>('dumbbells,bench,barbell,rack')

  useEffect(()=>{
    (async ()=>{
      try {
        const { data } = await API.get('/auth/me')
        setMe(data)
        setGoals(data.goals || ['hypertrophy'])
        setEquipment((data.equipmentOwned||[]).join(','))
      } catch {}
    })()
  }, [])

  async function save() {
    setMessage(null)
    try {
      const { data } = await API.put('/auth/me', {
        goals,
        equipmentOwned: equipment.split(',').map(s=>s.trim()).filter(Boolean)
      })
      setMe(data)
      setMessage('Saved!')
    } catch {
      setMessage('Failed to save')
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border rounded bg-white">
          <h2 className="font-semibold mb-2">Profile & Preferences</h2>
          <label className="block text-sm mb-1">Goals (comma-separated: strength, hypertrophy, endurance, fat_loss)</label>
          <input className="w-full border px-3 py-2 rounded mb-3" value={goals.join(',')} onChange={e=>setGoals(e.target.value.split(',').map(s=>s.trim()))} />
          <label className="block text-sm mb-1">Equipment Owned (comma-separated)</label>
          <input className="w-full border px-3 py-2 rounded mb-3" value={equipment} onChange={e=>setEquipment(e.target.value)} />
          <button onClick={save} className="bg-black text-white px-4 py-2 rounded">Save</button>
          {message && <div className="text-sm mt-2">{message}</div>}
        </div>
        <div className="p-4 border rounded bg-white">
          <h2 className="font-semibold mb-2">Quick Tips</h2>
          <ul className="list-disc ml-5 text-sm space-y-1">
            <li>Set your equipment to improve recommendation quality.</li>
            <li>Use the Recommend tab before each workout to tailor your session.</li>
            <li>Log sets during the session to unlock charts & analytics.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
