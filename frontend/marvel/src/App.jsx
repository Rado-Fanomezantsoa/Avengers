import { useEffect, useMemo, useState } from 'react'

const API = 'http://localhost:8080'

export default function App() {
  const [characters, setCharacters] = useState([])
  const [form, setForm] = useState({ name: '', realName: '', universe: '' })
  const [editingId, setEditingId] = useState(null)
  const [query, setQuery] = useState('')

  const fetchCharacters = async () => {
    const res = await fetch(`${API}/characters`)
    setCharacters(await res.json())
  }

  useEffect(() => { fetchCharacters() }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return characters.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.realName.toLowerCase().includes(q) ||
      c.universe.toLowerCase().includes(q)
    )
  }, [characters, query])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const addCharacter = async () => {
    if (!form.name || !form.realName || !form.universe) return
    await fetch(`${API}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ name: '', realName: '', universe: '' })
    fetchCharacters()
  }

  const startEdit = (c) => {
    setEditingId(c.id)
    setForm({ name: c.name, realName: c.realName, universe: c.universe })
  }

  const saveEdit = async () => {
    await fetch(`${API}/characters/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setEditingId(null)
    setForm({ name: '', realName: '', universe: '' })
    fetchCharacters()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ name: '', realName: '', universe: '' })
  }

  const deleteCharacter = async (id) => {
    await fetch(`${API}/characters/${id}`, { method: 'DELETE' })
    fetchCharacters()
  }

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Marvel Characters</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-2 md:items-end">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border rounded-xl p-3"/>
          <input name="realName" value={form.realName} onChange={handleChange} placeholder="Real Name" className="border rounded-xl p-3"/>
          <input name="universe" value={form.universe} onChange={handleChange} placeholder="Universe" className="border rounded-xl p-3"/>
        </div>
        {editingId ? (
          <div className="flex gap-2">
            <button onClick={saveEdit} className="px-4 py-3 rounded-xl bg-emerald-600 text-white">Save</button>
            <button onClick={cancelEdit} className="px-4 py-3 rounded-xl bg-gray-300">Cancel</button>
          </div>
        ) : (
          <button onClick={addCharacter} className="px-4 py-3 rounded-xl bg-blue-600 text-white w-full md:w-auto">Add</button>
        )}
      </div>

      <div className="mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name / real name / universe"
          className="w-full border rounded-xl p-3"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div key={c.id} className="flex flex-col rounded-xl shadow-2xl items-center text-center justify-center p-4 gap-3">
            <div className="text-sm md:text-base">
              <span className="font-semibold">{c.name}</span><br/>
              <span className="text-gray-500">Real Name: {c.realName}</span><br/>
              <span className="text-gray-400"> {c.universe}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(c)} className="px-3 py-1.5 rounded-lg bg-green-400 text-white">Edit</button>
              <button onClick={() => deleteCharacter(c.id)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white">Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-6 text-center text-gray-500">No characters</div>
        )}
      </div>
    </div>
  )
}
