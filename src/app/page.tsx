import Link from "next/link"
import { Button, Container, Typography, Box, Paper } from "@mui/material"

export default function Home() {
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography component="h1" variant="h4" fontWeight="bold">
            Welcome
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please sign in to your account or create a new one
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Link href="/auth/login" style={{ textDecoration: "none", width: "100%" }}>
            <Button variant="contained" fullWidth size="large">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register" style={{ textDecoration: "none", width: "100%" }}>
            <Button variant="outlined" fullWidth size="large">
              Create Account
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  )
}

