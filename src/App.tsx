import { Route, Routes } from 'react-router-dom'
import MovieBrowse from './pages/MovieBrowse'
import MovieDetail from './pages/MovieDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieBrowse />} />
      <Route path="/movie/:movieId" element={<MovieDetail />} />
    </Routes>
  )
}
