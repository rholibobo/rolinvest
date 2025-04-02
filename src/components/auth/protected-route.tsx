"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Box, CircularProgress, Typography } from "@mui/material"
import { useAuth } from "@/src/context/auth-context"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // If authentication check is complete
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login")
      }
      // Mark checking as complete regardless of authentication status
      setIsChecking(false)
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verifying authentication...
        </Typography>
      </Box>
    )
  }

  // If authenticated, render children
  return <>{children}</>
}

