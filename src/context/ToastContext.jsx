import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Toaster } from '../components/ui/Toaster'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [confirmState, setConfirmState] = useState(null)

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (variant, message, options = {}) => {
      const id = ++toastId
      const duration = options.duration ?? 4200
      setToasts((prev) => [...prev, { id, variant, message, title: options.title }])
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss],
  )

  const api = useMemo(
    () => ({
      success: (message, options) => toast('success', message, options),
      error: (message, options) => toast('error', message, options),
      info: (message, options) => toast('info', message, options),
      dismiss,
      confirm: (options) =>
        new Promise((resolve) => {
          setConfirmState({
            ...options,
            resolve,
          })
        }),
    }),
    [toast, dismiss],
  )

  const closeConfirm = useCallback((result) => {
    setConfirmState((current) => {
      current?.resolve?.(result)
      return null
    })
  }, [])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
      <ConfirmDialog
        open={Boolean(confirmState)}
        title={confirmState?.title ?? 'Confirm'}
        description={confirmState?.description}
        confirmLabel={confirmState?.confirmLabel ?? 'Confirm'}
        cancelLabel={confirmState?.cancelLabel ?? 'Cancel'}
        variant={confirmState?.variant ?? 'primary'}
        onConfirm={() => closeConfirm(true)}
        onCancel={() => closeConfirm(false)}
      />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
