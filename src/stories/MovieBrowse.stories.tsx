import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Genre, Movie } from '../lib/api_client'
import MovieBrowse, {
  type MovieBrowseStorybookDemo,
} from '../pages/MovieBrowse'

const browseGenres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
]

const browseMovies: Movie[] = [
  {
    id: 101,
    title: 'Neon Harbor',
    overview: 'A demo movie for Storybook.',
    poster_path: 'https://picsum.photos/seed/browse-a/342/513',
    release_date: '2024-03-12',
    vote_average: 7.4,
    vote_count: 890,
    popularity: 88.2,
    genre_ids: [28, 18],
  },
  {
    id: 102,
    title: 'Quiet Sunday',
    overview: 'Another demo listing.',
    poster_path: 'https://picsum.photos/seed/browse-b/342/513',
    release_date: '2023-11-05',
    vote_average: 8.6,
    vote_count: 1200,
    popularity: 72.1,
    genre_ids: [35],
  },
  {
    id: 103,
    title: 'Long Road North',
    overview: 'Third demo card.',
    poster_path: 'https://picsum.photos/seed/browse-c/342/513',
    release_date: '2022-07-20',
    vote_average: 6.9,
    vote_count: 340,
    popularity: 55.0,
    genre_ids: [18],
  },
]

const storybookBrowseDemo: MovieBrowseStorybookDemo = {
  movies: browseMovies,
  genres: browseGenres,
}

const meta = {
  component: MovieBrowse,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MovieBrowse>

export default meta
type Story = StoryObj<typeof meta>

export const WithDemoData: Story = {
  args: {
    storybookDemo: storybookBrowseDemo,
  },
}
