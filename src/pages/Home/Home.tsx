import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [topic, setTopic] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      navigate(`/presentation?topic=${encodeURIComponent(topic.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: 40 }}>
      <h2>Enter topic to generate slides:</h2>
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder='e.g. ai, code'
        style={{ padding: 8, fontSize: 16 }}
      />
      <button type='submit' style={{ marginLeft: 10, padding: 8 }}>
        Go to presentation
      </button>
    </form>
  )
}
