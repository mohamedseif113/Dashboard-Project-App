export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[PWA] Service Worker registered:", registration.scope)

        // Check for updates periodically
        setInterval(() => {
          registration.update()
        }, 60000) // Check every minute
      })
      .catch((error) => {
        console.error("[PWA] Service Worker registration failed:", error)
      })
  })
}

export function unregisterServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return
  }

  navigator.serviceWorker.ready
    .then((registration) => {
      registration.unregister()
      console.log("[PWA] Service Worker unregistered")
    })
    .catch((error) => {
      console.error("[PWA] Service Worker unregistration failed:", error)
    })
}

export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  return false
}

export function checkPWAInstallability() {
  if (typeof window === "undefined") {
    return { isInstallable: false, isInstalled: false }
  }

  const isInstalled = window.matchMedia("(display-mode: standalone)").matches
  const isInstallable = "BeforeInstallPromptEvent" in window

  return { isInstallable, isInstalled }
}
