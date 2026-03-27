import type { Meta, StoryObj } from '@storybook/react-vite'
import type { MovieDetails } from '../lib/api_client'
import MovieDetail from './MovieDetail'

const sampleMovieDetails = {
  id: 9901,
  title: 'Storybook Sample Film',
  original_title: 'Storybook Sample Film',
  tagline: 'A demo detail page in isolation.',
  overview:
    'This copy exists only for Storybook. It shows how the layout reads with a typical overview paragraph, stats, and metadata blocks without calling the TMDB API.',
  poster_path: 'https://picsum.photos/seed/detail-poster/500/750',
  backdrop_path: 'https://picsum.photos/seed/detail-back/1280/720',
  release_date: '2024-06-14',
  runtime: 118,
  vote_average: 8.1,
  vote_count: 12_450,
  popularity: 64.3,
  status: 'Released',
  budget: 35_000_000,
  revenue: 128_000_000,
  genres: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
  ],
  production_companies: [
    { id: 1, name: 'Demo Pictures Ltd.', logo_path: null },
    { id: 2, name: 'Sample Studio', logo_path: null },
  ],
  production_countries: [
    { iso_3166_1: 'US', name: 'United States' },
    { iso_3166_1: 'CA', name: 'Canada' },
  ],
  spoken_languages: [
    { english_name: 'English', iso_639_1: 'en', name: 'English' },
    { english_name: 'Spanish', iso_639_1: 'es', name: 'Spanish' },
  ],
  homepage: 'https://example.com/storybook-demo',
  imdb_id: 'tt1234567',
  original_language: 'en',
} satisfies MovieDetails

const meta = {
  component: MovieDetail,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MovieDetail>

export default meta
type Story = StoryObj<typeof meta>

export const WithDemoData: Story = {
  args: {
    storybookDemo: sampleMovieDetails,
  },
}
