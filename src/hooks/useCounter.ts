import { useState } from 'react'


export function useCounter(initialCount = 0) {
  const [count, setCount] = useState(initialCount)

  const incrementCount = () => {
    setCount((count) => count + 1)
  }

  const decrementCount = () => {
    setCount((count) => count - 1)
  }

  const clearCount = () => {
    setCount(() => 0)
  }

  return { count, incrementCount, decrementCount, clearCount }
}
