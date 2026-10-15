import { useEffect, useState } from 'react'
import { getForecast } from './API.jsx'

function App() {
  const [city, setCity] = useState('Sydney')
  const [date, setDate] = useState('')
  const [rows, setRows] = useState([])
  const [saved, setSaved] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/requests')
      .then((response) => response.json())
      .then(setSaved)
  }, [])

  function onSubmit(event) {
    event.preventDefault()
    setError('')
    getForecast(city, date)
      .then((nextRows) => {
        setRows(nextRows)
        const first = nextRows[0]
        const weather = first ? `${first.condition}, ${Math.round(first.temp)}°C` : 'No data'
        return fetch('/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city, weather }),
        })
      })
      .then((response) => response.json())
      .then(setSaved)
      .catch(() => setError('Could not load the forecast'))
  }

  return (
    <div className="shell">
      <header>
        <h1>Weather</h1>
      </header>
      <div className="content">
        <aside>
          <form onSubmit={onSubmit}>
            <label>
              City
              <input value={city} onChange={(event) => setCity(event.target.value)} />
            </label>
            <label>
              Date
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </label>
            <button type="submit">Get prediction</button>
          </form>
        </aside>
        <main>
          {error && <p>{error}</p>}
          <table className="forecast">
            <thead>
              <tr>
                <th>Day</th>
                <th>Condition</th>
                <th>Temperature</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.day}>
                  <td>{item.day}</td>
                  <td>{item.condition}</td>
                  <td>{Math.round(item.temp)}°C</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Saved</h2>
          <ul>
            {saved.map((item) => (
              <li key={item.id}>
                {item.city}: {item.weather}
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  )
}

export default App
