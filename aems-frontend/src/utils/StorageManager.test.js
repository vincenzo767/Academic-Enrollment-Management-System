/**
 * StorageManager.test.js
 * Unit tests for the StorageManager class
 * 
 * Run with: npm test StorageManager.test.js
 */

import StorageManager from '../utils/StorageManager'

describe('StorageManager', () => {
  let storageManager
  const testUserId = 'user-12345'

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    
    // Create new instance
    storageManager = new StorageManager('localStorage')
    storageManager.setCurrentUser(testUserId)
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('User Isolation', () => {
    test('Should create user-specific keys with userId', () => {
      storageManager.save('testData', { value: 'test' })
      
      const keys = storageManager.getAllKeys()
      expect(keys).toContain('testData')
      
      const fullKey = `user_${testUserId}_testData`
      expect(localStorage.getItem(fullKey)).toBeTruthy()
    })

    test('Should prevent data leakage between users', () => {
      // User A saves data
      storageManager.save('enrolledCourses', [1, 2, 3])
      
      // Switch to User B
      const userB = 'user-67890'
      storageManager.setCurrentUser(userB)
      
      // User B should not see User A's data
      const data = storageManager.get('enrolledCourses', [])
      expect(data).toEqual([])
      
      // Switch back to User A
      storageManager.setCurrentUser(testUserId)
      const userAData = storageManager.get('enrolledCourses', [])
      expect(userAData).toEqual([1, 2, 3])
    })

    test('Should clear only current user data on clearUserData()', () => {
      // User A saves data
      storageManager.save('data1', 'valueA')
      
      // User B saves data
      storageManager.setCurrentUser('user-67890')
      storageManager.save('data1', 'valueB')
      
      // Clear User B data
      storageManager.clearUserData()
      
      // User B data should be gone
      expect(storageManager.get('data1', null)).toBeNull()
      
      // User A data should still exist
      storageManager.setCurrentUser(testUserId)
      expect(storageManager.get('data1', null)).toBe('valueA')
    })
  })

  describe('Data Persistence', () => {
    test('Should save and retrieve data correctly', () => {
      const testData = { id: 1, name: 'Course 101', credits: 3 }
      
      storageManager.save('course', testData)
      const retrieved = storageManager.get('course')
      
      expect(retrieved).toEqual(testData)
    })

    test('Should return default value if key not found', () => {
      const defaultValue = { empty: true }
      const result = storageManager.get('nonexistent', defaultValue)
      
      expect(result).toEqual(defaultValue)
    })

    test('Should handle complex data types', () => {
      const complexData = {
        arrays: [1, 2, { nested: true }],
        objects: { key: 'value', deep: { level: 2 } },
        primitives: { string: 'text', number: 42, boolean: true, null: null }
      }
      
      storageManager.save('complex', complexData)
      const retrieved = storageManager.get('complex')
      
      expect(retrieved).toEqual(complexData)
    })

    test('Should handle empty arrays and objects', () => {
      storageManager.save('empty', { array: [], object: {} })
      const retrieved = storageManager.get('empty')
      
      expect(retrieved.array).toEqual([])
      expect(retrieved.object).toEqual({})
    })
  })

  describe('Data Removal', () => {
    test('Should remove specific keys', () => {
      storageManager.save('key1', 'value1')
      storageManager.save('key2', 'value2')
      
      storageManager.remove('key1')
      
      expect(storageManager.has('key1')).toBe(false)
      expect(storageManager.has('key2')).toBe(true)
    })

    test('Should handle removing non-existent keys gracefully', () => {
      // Should not throw
      expect(() => {
        storageManager.remove('nonexistent')
      }).not.toThrow()
    })

    test('Should clear all user data', () => {
      storageManager.save('key1', 'value1')
      storageManager.save('key2', 'value2')
      storageManager.save('key3', 'value3')
      
      storageManager.clearUserData()
      
      const keys = storageManager.getAllKeys()
      expect(keys).toHaveLength(0)
    })
  })

  describe('Key Management', () => {
    test('Should generate proper keys with user ID', () => {
      storageManager.save('data', 'value')
      
      const fullKey = `user_${testUserId}_data`
      expect(localStorage.getItem(fullKey)).toBeTruthy()
    })

    test('Should check key existence', () => {
      storageManager.save('exists', 'value')
      
      expect(storageManager.has('exists')).toBe(true)
      expect(storageManager.has('notexists')).toBe(false)
    })

    test('Should get all keys for current user', () => {
      storageManager.save('key1', 'val1')
      storageManager.save('key2', 'val2')
      storageManager.save('key3', 'val3')
      
      const keys = storageManager.getAllKeys()
      
      expect(keys).toContain('key1')
      expect(keys).toContain('key2')
      expect(keys).toContain('key3')
      expect(keys).toHaveLength(3)
    })

    test('Should only list keys for current user', () => {
      storageManager.save('userA-key', 'value')
      
      // Switch user
      storageManager.setCurrentUser('user-B')
      storageManager.save('userB-key', 'value')
      
      const keys = storageManager.getAllKeys()
      
      expect(keys).toContain('userB-key')
      expect(keys).not.toContain('userA-key')
    })
  })

  describe('Error Handling', () => {
    test('Should throw error if setting null user ID', () => {
      expect(() => {
        storageManager.setCurrentUser(null)
      }).toThrow()
    })

    test('Should throw error if setting empty user ID', () => {
      expect(() => {
        storageManager.setCurrentUser('')
      }).toThrow()
    })

    test('Should throw error when accessing storage without user ID', () => {
      const manager = new StorageManager('localStorage')
      // Don't set user ID
      
      expect(() => {
        manager.save('key', 'value')
      }).toThrow('No user ID set')
    })

    test('Should handle JSON parsing errors gracefully', () => {
      // Manually set invalid JSON in storage
      const key = `user_${testUserId}_bad`
      localStorage.setItem(key, 'not valid json')
      
      // Should return default without throwing
      const result = storageManager.get('bad', 'default')
      expect(result).toBe('default')
    })

    test('Should handle storage quota exceeded', () => {
      // Mock localStorage to throw quota error
      const originalSetItem = localStorage.setItem
      localStorage.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError')
      })
      
      const result = storageManager.save('key', 'value')
      expect(result).toBe(false)
      
      // Restore
      localStorage.setItem = originalSetItem
    })
  })

  describe('Storage Size Tracking', () => {
    test('Should calculate storage usage size', () => {
      storageManager.save('data1', 'value1')
      storageManager.save('data2', 'value2')
      
      const size = storageManager.getUsageSize()
      
      // Size should be greater than 0
      expect(size).toBeGreaterThan(0)
    })

    test('Should return 0 size for empty user', () => {
      storageManager.setCurrentUser('new-user')
      
      const size = storageManager.getUsageSize()
      expect(size).toBe(0)
    })

    test('Should only count current user size', () => {
      storageManager.save('large-data', 'x'.repeat(1000))
      const sizeA = storageManager.getUsageSize()
      
      storageManager.setCurrentUser('user-B')
      storageManager.save('small-data', 'y')
      const sizeB = storageManager.getUsageSize()
      
      expect(sizeA).toBeGreaterThan(sizeB)
    })
  })

  describe('Storage Availability Detection', () => {
    test('Should detect available storage', () => {
      expect(storageManager.isAvailable).toBe(true)
    })

    test('Should detect unavailable storage', () => {
      // Mock unavailable storage
      const originalSetItem = localStorage.setItem
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage disabled')
      })
      
      const manager = new StorageManager('localStorage')
      expect(manager.isAvailable).toBe(false)
      
      // Restore
      localStorage.setItem = originalSetItem
    })
  })

  describe('Current User Management', () => {
    test('Should set and get current user', () => {
      const userId = 'user-xyz'
      storageManager.setCurrentUser(userId)
      
      expect(storageManager.getCurrentUser()).toBe(userId)
    })

    test('Should change current user', () => {
      storageManager.setCurrentUser('user-1')
      expect(storageManager.getCurrentUser()).toBe('user-1')
      
      storageManager.setCurrentUser('user-2')
      expect(storageManager.getCurrentUser()).toBe('user-2')
    })
  })
})

// Integration Tests for Real-World Scenarios

describe('StorageManager - Integration Tests', () => {
  let manager

  beforeEach(() => {
    localStorage.clear()
    manager = new StorageManager('localStorage')
  })

  afterEach(() => {
    localStorage.clear()
  })

  test('Should handle student enrollment workflow', () => {
    // Student logs in
    manager.setCurrentUser('student-001')
    
    // Student enrolls in courses
    manager.save('enrolledIds', [101, 102, 103])
    manager.save('reservedIds', [201])
    manager.save('department', 'Computer Science')
    
    // Page refresh (new manager instance)
    const newManager = new StorageManager('localStorage')
    newManager.setCurrentUser('student-001')
    
    // Data persists
    expect(newManager.get('enrolledIds')).toEqual([101, 102, 103])
    expect(newManager.get('reservedIds')).toEqual([201])
    expect(newManager.get('department')).toBe('Computer Science')
  })

  test('Should handle multiple users on same device', () => {
    // Student A
    manager.setCurrentUser('student-001')
    manager.save('enrolledIds', [101, 102])
    
    // Student B logs in
    manager.setCurrentUser('student-002')
    manager.save('enrolledIds', [201, 202])
    
    // Verify isolation
    expect(manager.get('enrolledIds')).toEqual([201, 202])
    
    // Student A logs back in
    manager.setCurrentUser('student-001')
    expect(manager.get('enrolledIds')).toEqual([101, 102])
  })

  test('Should handle logout and login cycle', () => {
    // Login and enroll
    manager.setCurrentUser('student-001')
    manager.save('enrolledIds', [101, 102])
    
    // Logout
    manager.clearUserData()
    expect(manager.getAllKeys()).toHaveLength(0)
    
    // Login again - data is restored
    manager.setCurrentUser('student-001')
    expect(manager.get('enrolledIds')).toEqual([101, 102])
  })
})
