import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const USERS_KEY = 'fleetflow-auth-users'
const SESSION_KEY = 'fleetflow-auth-session'

const AuthContext = createContext(null)

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [bootstrapped, setBootstrapped] = useState(false)

  useEffect(() => {
    const session = readSession()
    if (session?.userId) {
      const match = readUsers().find((u) => u.id === session.userId)
      if (match) {
        setUser({ id: match.id, name: match.name, email: match.email })
      } else {
        writeSession(null)
      }
    }
    setBootstrapped(true)
  }, [])

  const login = useCallback(async (email, password) => {
    const normalized = email.trim().toLowerCase()
    const found = readUsers().find((u) => u.email === normalized)
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password')
    }
    const session = {
      userId: found.id,
      email: found.email,
      token: `ff_${found.id}_${Date.now()}`,
    }
    writeSession(session)
    setUser({ id: found.id, name: found.name, email: found.email })
    return found
  }, [])

  const signup = useCallback(async ({ name, email, password }) => {
    const normalized = email.trim().toLowerCase()
    const users = readUsers()
    if (users.some((u) => u.email === normalized)) {
      throw new Error('An account with this email already exists')
    }
    const newUser = {
      id: `user_${crypto.randomUUID?.() ?? Date.now()}`,
      name: name.trim(),
      email: normalized,
      password,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    writeUsers(users)
    const session = {
      userId: newUser.id,
      email: newUser.email,
      token: `ff_${newUser.id}_${Date.now()}`,
    }
    writeSession(session)
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email })
    return newUser
  }, [])

  const logout = useCallback(() => {
    writeSession(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      bootstrapped,
      login,
      signup,
      logout,
    }),
    [user, bootstrapped, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
