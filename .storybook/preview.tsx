import type { Preview } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'

// MovieCard (and other components) rely on shared CSS variables from the app.
import '../src/css/global.css'

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
