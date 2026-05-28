import type {
  AuthActionResult,
  AuthRegisterData,
  AuthUpdatePayload,
  User,
} from '../types/auth'

const STORAGE_CURRENT_USER_KEY = 'neonfest_current_user'
const STORAGE_USERS_KEY = 'neonfest_users'
const ADMIN_EMAIL = 'admin@gmail.com'

function parseStoredUsers(): User[] {
  try {
    const stored = localStorage.getItem(STORAGE_USERS_KEY) || '[]'
    return JSON.parse(stored) as User[]
  } catch {
    return []
  }
}

function writeStoredUsers(users: User[]) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser(): User | null {
  try {
    const storedUser = localStorage.getItem(STORAGE_CURRENT_USER_KEY)
    if (!storedUser) return null
    return JSON.parse(storedUser) as User
  } catch {
    return null
  }
}

export function setCurrentUser(user: User) {
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user))
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY)
}

export function createUser(data: AuthRegisterData): AuthActionResult {
  const normalizedEmail = data.email.trim().toLowerCase()
  const users = parseStoredUsers()
  const existing = users.find((user) => user.email === normalizedEmail)

  if (existing) {
    return {
      success: false,
      message:
        'Já existe uma conta com esse e-mail. Faça login ou use outro endereço.',
    }
  }

  const role = normalizedEmail === ADMIN_EMAIL ? 'admin' : 'participant'
  const now = new Date().toISOString()
  const newUser: User = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    name: data.name.trim(),
    email: normalizedEmail,
    password: data.password,
    role,
    avatarUrl: null,
    createdAt: now,
  }

  writeStoredUsers([...users, newUser])
  setCurrentUser(newUser)

  return {
    success: true,
    message: 'Conta criada com sucesso. Bem-vindo ao Neon Sound Festival 2027!',
    user: newUser,
  }
}

export function authenticateUser(
  email: string,
  password: string,
): AuthActionResult {
  const normalizedEmail = email.trim().toLowerCase()
  const users = parseStoredUsers()
  const foundUser = users.find((user) => user.email === normalizedEmail)

  if (!foundUser) {
    return {
      success: false,
      message: 'Conta não encontrada. Verifique seu e-mail ou cadastre-se.',
    }
  }

  if (foundUser.password !== password) {
    return {
      success: false,
      message: 'Senha incorreta. Tente novamente ou recupere sua senha.',
    }
  }

  setCurrentUser(foundUser)

  return {
    success: true,
    message: 'Login realizado com sucesso.',
    user: foundUser,
  }
}

export function updateUserProfile(
  payload: AuthUpdatePayload,
  currentUser: User,
): AuthActionResult {
  const users = parseStoredUsers()
  const normalizedEmail = payload.email.trim().toLowerCase()
  const duplicateEmail = users.find(
    (user) => user.email === normalizedEmail && user.id !== currentUser.id,
  )

  if (duplicateEmail) {
    return {
      success: false,
      message: 'Esse e-mail já está em uso por outra conta.',
    }
  }

  const updatedUser: User = {
    ...currentUser,
    name: payload.name.trim(),
    email: normalizedEmail,
    avatarUrl: payload.avatarUrl ?? currentUser.avatarUrl,
    password: payload.password ?? currentUser.password,
  }

  const updatedUsers = users.map((user) =>
    user.id === currentUser.id ? updatedUser : user,
  )

  writeStoredUsers(updatedUsers)
  setCurrentUser(updatedUser)

  return {
    success: true,
    message: 'Perfil atualizado com sucesso.',
    user: updatedUser,
  }
}

export function resetPasswordRequest(email: string): AuthActionResult {
  const normalizedEmail = email.trim().toLowerCase()
  const users = parseStoredUsers()
  const foundUser = users.find((user) => user.email === normalizedEmail)

  if (!foundUser) {
    return {
      success: false,
      message: 'Não encontramos essa conta. Verifique o e-mail informado.',
    }
  }

  return {
    success: true,
    message:
      'Se essa conta existir, você receberá instruções para redefinir a senha em breve.',
  }
}
