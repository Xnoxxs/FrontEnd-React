import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('starts with count 0 by default', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('starts with custom initial count when provided', () => {
    const { result } = renderHook(() => useCounter(5))
    expect(result.current.count).toBe(5)
  })

  it('incrementCount increases count by 1', () => {
    const { result } = renderHook(() => useCounter(0))

    act(() => {
      result.current.incrementCount()
    })
    expect(result.current.count).toBe(1)

    act(() => {
      result.current.incrementCount()
    })
    expect(result.current.count).toBe(2)
  })

  it('decrementCount decreases count by 1', () => {
    const { result } = renderHook(() => useCounter(5))

    act(() => {
      result.current.decrementCount()
    })
    expect(result.current.count).toBe(4)

    act(() => {
      result.current.decrementCount()
    })
    expect(result.current.count).toBe(3)
  })

  it('clearCount resets count to 0', () => {
    const { result } = renderHook(() => useCounter(10))

    act(() => {
      result.current.clearCount()
    })
    expect(result.current.count).toBe(0)
  })

  it('all functions work together correctly', () => {
    const { result } = renderHook(() => useCounter(0))

    act(() => result.current.incrementCount())
    act(() => result.current.incrementCount())
    expect(result.current.count).toBe(2)

    act(() => result.current.decrementCount())
    expect(result.current.count).toBe(1)

    act(() => result.current.clearCount())
    expect(result.current.count).toBe(0)

    act(() => result.current.incrementCount())
    expect(result.current.count).toBe(1)
  })
})
