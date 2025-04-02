"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  password: string // We'll store this for local verification
  fullName: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window !== "undefined") {
          // Check if user is logged in
          const storedAuthStatus = localStorage.getItem("isAuthenticated") === "true"
          const storedUser = localStorage.getItem("currentUser")
          const storedRememberMe = localStorage.getItem("rememberMe") === "true"

          if (storedAuthStatus && storedUser) {
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
            setRememberMe(storedRememberMe)
          }
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Set up inactivity timer if user is logged in and rememberMe is false
  useEffect(() => {
    if (isAuthenticated && !rememberMe) {
      resetInactivityTimer()

      // Add event listeners to reset the timer on user activity
      const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]

      const resetTimer = () => resetInactivityTimer()

      events.forEach((event) => {
        window.addEventListener(event, resetTimer)
      })

      return () => {
        if (inactivityTimer) {
          clearTimeout(inactivityTimer)
        }

        events.forEach((event) => {
          window.removeEventListener(event, resetTimer)
        })
      }
    }
  }, [isAuthenticated, rememberMe])

  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
    }

    // Auto logout after 1 minutes (60000 ms) of inactivity
    const newTimer = setTimeout(() => {
      logout()
      router.push("/auth/login")
    }, 60000)

    setInactivityTimer(newTimer)
  }

  const register = async (email: string, password: string, fullName: string) => {
    setIsLoading(true)

    try {
      // Generate a unique ID
      const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Create new user object
      const newUser = {
        id: userId,
        email,
        password, // In a real app, you would hash this password
        fullName,
      }

      // Get existing users or initialize empty array
      const existingUsersJSON = localStorage.getItem("users")
      const existingUsers = existingUsersJSON ? JSON.parse(existingUsersJSON) : []

      // Check if email already exists
      const emailExists = existingUsers.some((user: User) => user.email === email)
      if (emailExists) {
        throw new Error("Email already registered")
      }

      // Add new user to array
      existingUsers.push(newUser)

      // Save updated users array
      localStorage.setItem("users", JSON.stringify(existingUsers))

      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string, keepLoggedIn: boolean) => {
    setIsLoading(true)

    try {
      // Get users from local storage
      const usersJSON = localStorage.getItem("users")
      if (!usersJSON) {
        throw new Error("Invalid email or password")
      }

      const users = JSON.parse(usersJSON)

      // Find user with matching email and password
      const foundUser = users.find((user: User) => user.email === email && user.password === password)

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      // Set authenticated user
      setUser(foundUser)
      setIsAuthenticated(true)
      setRememberMe(keepLoggedIn)

      // Store in localStorage for persistence
      localStorage.setItem("currentUser", JSON.stringify(foundUser))
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("rememberMe", keepLoggedIn.toString())

      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("currentUser")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("rememberMe")

    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
      setInactivityTimer(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

