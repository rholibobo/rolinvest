"use client"

import { Box, CircularProgress, Typography } from "@mui/material"
import DashboardPage from "./Dashboard"
import { useEffect } from "react"
import { useAuth } from "@/src/context/auth-context"

export default function ProtectedDashboardPage() {
    const { isAuthenticated, isLoading } = useAuth()
  
    // Add an additional check at the page level
    useEffect(() => {
      // If authentication check is complete and user is not authenticated
      if (!isLoading && !isAuthenticated && typeof window !== "undefined") {
        window.location.href = "/auth/login"
      }
    }, [isAuthenticated, isLoading])
  
    // Show loading state while checking authentication
    if (isLoading) {
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
  
    // If not authenticated, show loading while redirect happens
    if (!isAuthenticated) {
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
            Redirecting to login...
          </Typography>
        </Box>
      )
    }
  
    // If authenticated, render the dashboard content
    return <DashboardPage />
  }
  