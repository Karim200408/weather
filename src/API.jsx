const API_KEY = import.meta.env.VITE_API_KEY

export async function getForecast(city, date) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
  const response = await fetch(url)

  console.log(response)
  if (!response.ok) throw new Error('Weather request failed')

  const data = await response.json()
  console.log(data)
  const items = date ? data.list.filter((item) => item.dt_txt.startsWith(date)) : data.list

  return items.slice(0, 8).map((item) => ({
    day: item.dt_txt,
    condition: item.weather[0].main,
    temp: item.main.temp,
  }))
}