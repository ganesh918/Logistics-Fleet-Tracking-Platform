import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { cn } from '../../utils/cn'

export function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const mainRef = useRef(null)
  const { pathname } = useLocation()
  const isTrackingPage = pathname === '/tracking'

  useEffect(() => {
    setMobileOpen(false)
    mainRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <div className="h-screen overflow-hidden bg-surface-50 dark:bg-surface-50">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex h-screen flex-col lg:pl-64">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main
          ref={mainRef}
          className={cn(
            'flex min-h-0 flex-1 flex-col overflow-x-hidden p-4 sm:p-6',
            isTrackingPage ? 'overflow-y-auto scroll-smooth' : 'overflow-y-auto',
          )}
        >
          <div key={pathname} className="fleet-page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
