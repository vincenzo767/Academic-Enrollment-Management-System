/**
 * usePersistentState.js
 * React hook for managing user-specific persistent state
 * 
 * Usage:
 *   const [value, setValue, isLoaded] = usePersistentState('formData', defaultValue)
 * 
 * Features:
 * - Automatic save to storage on state change
 * - Automatic restore on component mount
 * - Syncs across tabs/windows
 * - Handles storage unavailability gracefully
 * - Provides loading state indicator
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { storageManager } from './StorageManager'

export function usePersistentState(dataKey, initialValue) {
  const [value, setValue] = useState(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)
  const unsubscribeRef = useRef(null)

  // Load from storage on mount
  useEffect(() => {
    try {
      const userId = storageManager.getCurrentUser()
      if (!userId) {
        console.warn('No user ID set in StorageManager. Persistent state may not work correctly.')
        setIsLoaded(true)
        return
      }

      const stored = storageManager.get(dataKey, initialValue)
      setValue(stored)
      setIsLoaded(true)

      // Subscribe to changes from other tabs
      unsubscribeRef.current = storageManager.onDataChange(dataKey, ({ newValue }) => {
        setValue(newValue !== null ? newValue : initialValue)
      })
    } catch (e) {
      console.error(`Failed to initialize persistent state for "${dataKey}":`, e)
      setIsLoaded(true)
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [dataKey, initialValue])

  // Save to storage whenever value changes
  useEffect(() => {
    if (!isLoaded) return

    try {
      const userId = storageManager.getCurrentUser()
      if (!userId) {
        console.warn('No user ID set. Cannot persist state.')
        return
      }

      storageManager.save(dataKey, value)
    } catch (e) {
      console.error(`Failed to persist state for "${dataKey}":`, e)
    }
  }, [value, dataKey, isLoaded])

  return [value, setValue, isLoaded]
}

export default usePersistentState
