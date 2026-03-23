import { useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p className="text-3xl font-bold underline bg-sky-950 text-red-500">
          Hello world!
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p>Log in to your account here: <Link to="/Login">Log in</Link> </p>
      <p>Register for an account here: <Link to="/Signup">Sign up</Link> </p>
    </>
  )
}

export default App
