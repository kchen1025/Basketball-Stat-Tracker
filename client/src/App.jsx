import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState('NO DATA YET')

  useEffect(() => {
    fetch("/api/cool")
      .then((res) => res.json())
      .then((data) => {        
        setData(data.message)
      })
  }, []);

  return (
    <>
      <div>
        {data}
      </div>
    </>
  )
}

export default App
