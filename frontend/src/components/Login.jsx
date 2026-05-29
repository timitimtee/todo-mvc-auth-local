import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState([])
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data.errors) {
      setErrors(data.errors)
    } else {
      navigate('/todos')
    }
  }

  return (
    <div>
      {errors.map((err, i) => (
        <div key={i} className="alert alert-danger">{err.msg}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
