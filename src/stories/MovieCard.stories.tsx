import type { Meta, StoryObj } from '@storybook/react-vite'
import MovieCard from '../components/MovieCard'

const meta = {
  component: MovieCard,
  tags: ['autodocs'],
  args: {
    id: 1,
  },
  decorators: [
    (Story) => (
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          maxWidth: 280,
          width: '100%',
          marginInline: 'auto',
        }}
      >
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof MovieCard>

export default meta
type Story = StoryObj<typeof meta>

// Absolute URL so the poster loads reliably in Storybook (TMDB can 403/block by referrer).
const demoPoster = 'https://picsum.photos/seed/moviecard-demo/342/513'

export const Default: Story = {
  args: {
    title: 'The Example Movie',
    poster_path: demoPoster,
    vote_average: 7.2,
    release_date: '2024-03-15',
  },
}

export const HighRating: Story = {
  args: {
    title: "Critics' Choice",
    poster_path: 'https://picsum.photos/seed/moviecard-high/342/513',
    vote_average: 9.4,
    release_date: '2023-11-22',
  },
}
