export type User = {
  id: string
  email: string
  fullName: string
}

export type AuthContextType = {
  user: User | null
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}