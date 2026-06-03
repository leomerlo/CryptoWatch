import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebounce } from '@/shared/hooks/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500))

    expect(result.current).toBe('hello')
  })

  it('updates after the delay when the value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'a', delay: 500 },
    })

    rerender({ value: 'ab', delay: 500 })

    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('ab')
  })

  it('resets the timer when the value changes again before the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    rerender({ value: 'abc' })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('abc')
  })
})
