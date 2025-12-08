/**
 * StorageManager.js
 * Manages user-specific data persistence with security safeguards
 * 
 * Features:
 * - User-isolated storage keys (prevents data bleed between accounts)
 * - Automatic fallback for unavailable storage
 * - JSON serialization/deserialization with error handling
 * - Event listeners for multi-tab synchronization
 * - Sensitive data protection (no passwords stored)
 */

class StorageManager {
  constructor(storageType = 'localStorage') {
    this.storageType = storageType
    this.currentUserId = null
    this.listeners = new Map() // for storage change events
    this.isAvailable = this._checkStorageAvailable()
    
    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', this._handleStorageChange.bind(this))
  }

  /**
   * Check if storage is available (handles private browsing mode)
   */
  _checkStorageAvailable() {
    try {
      const storage = this._getStorage()
      const testKey = '__storage_test__'
      storage.setItem(testKey, 'test')
      storage.removeItem(testKey)
      return true
    } catch (e) {
      console.warn(`Storage (${this.storageType}) is not available. Data persistence disabled.`, e)
      return false
    }
  }

  /**
   * Get the storage object (localStorage or sessionStorage)
   */
  _getStorage() {
    if (this.storageType === 'sessionStorage') {
      return window.sessionStorage
    }
    return window.localStorage
  }

  /**
   * Generate a user-specific storage key
   * Format: user_{userId}_{dataKey}
   */
  _generateKey(dataKey) {
    if (!this.currentUserId) {
      throw new Error('No user ID set. Call setCurrentUser() first.')
    }
    return `user_${this.currentUserId}_${dataKey}`
  }

  /**
   * Set the current user ID
   * Call this after user login
   */
  setCurrentUser(userId) {
    if (!userId) {
      throw new Error('User ID cannot be null or empty')
    }
    this.currentUserId = userId
  }

  /**
   * Get the current user ID
   */
  getCurrentUser() {
    return this.currentUserId
  }

  /**
   * Save data for the current user
   */
  save(dataKey, data) {
    if (!this.isAvailable) {
      console.warn('Storage is not available. Data not persisted.')
      return false
    }

    try {
      const key = this._generateKey(dataKey)
      const serialized = JSON.stringify(data)
      this._getStorage().setItem(key, serialized)
      return true
    } catch (e) {
      console.error(`Failed to save data for key "${dataKey}":`, e)
      return false
    }
  }

  /**
   * Retrieve data for the current user
   */
  get(dataKey, defaultValue = null) {
    if (!this.isAvailable) {
      return defaultValue
    }

    try {
      const key = this._generateKey(dataKey)
      const stored = this._getStorage().getItem(key)
      if (stored === null) {
        return defaultValue
      }
      return JSON.parse(stored)
    } catch (e) {
      console.error(`Failed to retrieve data for key "${dataKey}":`, e)
      return defaultValue
    }
  }

  /**
   * Remove a specific data item for the current user
   */
  remove(dataKey) {
    if (!this.isAvailable) {
      return false
    }

    try {
      const key = this._generateKey(dataKey)
      this._getStorage().removeItem(key)
      return true
    } catch (e) {
      console.error(`Failed to remove data for key "${dataKey}":`, e)
      return false
    }
  }

  /**
   * Clear all data for the current user
   * Useful for logout
   */
  clearUserData() {
    if (!this.isAvailable || !this.currentUserId) {
      return false
    }

    try {
      const storage = this._getStorage()
      const prefix = `user_${this.currentUserId}_`
      const keysToRemove = []

      // Find all keys matching this user
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key)
        }
      }

      // Remove all user keys
      keysToRemove.forEach(key => storage.removeItem(key))
      return true
    } catch (e) {
      console.error('Failed to clear user data:', e)
      return false
    }
  }

  /**
   * Get all data keys for the current user
   */
  getAllKeys() {
    if (!this.isAvailable || !this.currentUserId) {
      return []
    }

    try {
      const storage = this._getStorage()
      const prefix = `user_${this.currentUserId}_`
      const keys = []

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key && key.startsWith(prefix)) {
          // Return key without prefix for convenience
          keys.push(key.substring(prefix.length))
        }
      }

      return keys
    } catch (e) {
      console.error('Failed to get all keys:', e)
      return []
    }
  }

  /**
   * Register a listener for storage changes
   * Callback receives: { key, action, newValue }
   */
  onDataChange(dataKey, callback) {
    if (!this.listeners.has(dataKey)) {
      this.listeners.set(dataKey, [])
    }
    this.listeners.get(dataKey).push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(dataKey)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  /**
   * Handle storage changes from other tabs/windows
   */
  _handleStorageChange(event) {
    if (!this.currentUserId) return

    const prefix = `user_${this.currentUserId}_`
    if (!event.key || !event.key.startsWith(prefix)) {
      return
    }

    const dataKey = event.key.substring(prefix.length)
    const callbacks = this.listeners.get(dataKey) || []

    callbacks.forEach(callback => {
      try {
        const newValue = event.newValue ? JSON.parse(event.newValue) : null
        callback({ key: dataKey, action: 'change', newValue })
      } catch (e) {
        console.error('Error in storage change callback:', e)
      }
    })
  }

  /**
   * Check if a key exists for the current user
   */
  has(dataKey) {
    if (!this.isAvailable) return false

    try {
      const key = this._generateKey(dataKey)
      return this._getStorage().getItem(key) !== null
    } catch (e) {
      return false
    }
  }

  /**
   * Get the size of stored data for the current user (in characters)
   */
  getUsageSize() {
    if (!this.isAvailable || !this.currentUserId) return 0

    try {
      const storage = this._getStorage()
      const prefix = `user_${this.currentUserId}_`
      let size = 0

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key && key.startsWith(prefix)) {
          const value = storage.getItem(key)
          size += key.length + (value ? value.length : 0)
        }
      }

      return size
    } catch (e) {
      return 0
    }
  }

  /**
   * Debug utility: log all stored data for current user
   */
  debugLog() {
    if (!this.currentUserId) {
      console.log('No user ID set')
      return
    }

    console.group(`Storage Debug: User ${this.currentUserId}`)
    console.log(`Storage Available: ${this.isAvailable}`)
    console.log(`Storage Type: ${this.storageType}`)
    console.log(`Usage Size: ${this.getUsageSize()} characters`)
    console.log('Stored Keys:')

    this.getAllKeys().forEach(key => {
      try {
        const value = this.get(key)
        console.log(`  ${key}:`, value)
      } catch (e) {
        console.log(`  ${key}: [ERROR]`, e)
      }
    })

    console.groupEnd()
  }
}

// Export singleton instance
export const storageManager = new StorageManager('localStorage')

export default StorageManager
