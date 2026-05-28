import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export function useProtectedNavigation() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return useCallback(
    (path: string, message = 'Faça login para continuar.') => {
      if (!user) {
        toast.error(message)
        navigate('/login', { state: { redirectTo: path } })
        return false
      }

      navigate(path)
      return true
    },
    [navigate, user],
  )
}
