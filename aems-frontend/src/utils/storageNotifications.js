/**
 * storageNotifications.js
 * Utility for displaying storage-related toast notifications
 */

export function showStorageNotification(appContext, message, type = 'info') {
  if (!appContext || !appContext.addNotification) {
    console.log(`[Storage Notification - ${type}]: ${message}`)
    return
  }

  appContext.addNotification({
    text: message,
    type: type, // 'info', 'success', 'error', 'warning'
  })
}

/**
 * Show when storage is unavailable (private mode, quota exceeded, etc.)
 */
export function notifyStorageUnavailable(appContext) {
  showStorageNotification(
    appContext,
    'Storage is not available. Your changes will not persist across page refreshes.',
    'warning'
  )
}

/**
 * Show when data is restored from storage
 */
export function notifyDataRestored(appContext) {
  showStorageNotification(
    appContext,
    'Your previous session data has been restored.',
    'info'
  )
}

/**
 * Show when data is saved
 */
export function notifyDataSaved(appContext) {
  showStorageNotification(
    appContext,
    'Your changes have been saved.',
    'success'
  )
}

/**
 * Show when data is cleared (logout)
 */
export function notifyDataCleared(appContext) {
  showStorageNotification(
    appContext,
    'Session data cleared.',
    'info'
  )
}
