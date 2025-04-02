import type { Metadata } from "next"
import { Container, Typography, Box, Link as MuiLink } from "@mui/material"
import Link from "next/link"
import LoginForm from "@/src/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <main
    className="w-full flex flex-col min-h-screen items-center justify-center py-4"
    style={{ backgroundImage: "url('/salesbg.jpg')", backgroundSize: "cover", backgroundRepeat: "no-repeat", height: "100vh" }}
    >
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography component="h1" variant="h4" fontWeight="bold">
          Sign in to your account
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Or{" "}
            <Link href="/auth/register" passHref>
              <MuiLink underline="hover">create a new account</MuiLink>
            </Link>
          </Typography>
        </Box>
      </Box>
      <LoginForm />
    </main>
  )
}

