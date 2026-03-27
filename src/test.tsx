// npx tsx src/test.tsx

const API_KEY = 'fa078bd9b9e5053ebbbeccea24796bff'

async function testApi() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    )

    const data = await response.json()

    console.log('Movies:', data.results)
  } catch (error) {
    console.error('Error:', error)
  }
}

testApi()
