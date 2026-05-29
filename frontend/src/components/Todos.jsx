import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Todos() {
  const [todos, setTodos] = useState([])
  const [left, setLeft] = useState(0)
  const [user, setUser] = useState(null)
  const [newTodo, setNewTodo] = useState('')
  const navigate = useNavigate()

  async function fetchTodos() {
    const res = await fetch('/todos')
    if (res.status === 401) {
      navigate('/login')
      return
    }
    const data = await res.json()
    setTodos(data.todos)
    setLeft(data.left)
    setUser(data.user)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  async function createTodo(e) {
    e.preventDefault()
    await fetch('/todos/createTodo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todoItem: newTodo }),
    })
    setNewTodo('')
    fetchTodos()
  }

  async function deleteTodo(id) {
    await fetch('/todos/deleteTodo', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todoIdFromJSFile: id }),
    })
    fetchTodos()
  }

  async function toggleTodo(id, completed) {
    const route = completed ? '/todos/markIncomplete' : '/todos/markComplete'
    await fetch(route, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todoIdFromJSFile: id }),
    })
    fetchTodos()
  }

  async function logout() {
    await fetch('/logout')
    navigate('/')
  }

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo._id} className="todoItem">
            <span
              className={todo.completed ? 'completed' : 'not'}
              onClick={() => toggleTodo(todo._id, todo.completed)}
            >
              {todo.todo}
            </span>
            <span className="del" onClick={() => deleteTodo(todo._id)}>Delete</span>
          </li>
        ))}
      </ul>
      {user && <h2>{user.userName} has {left} things left to do.</h2>}
      <form onSubmit={createTodo}>
        <input
          type="text"
          placeholder="Enter Todo Item"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
