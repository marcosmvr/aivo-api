export const REGISTER_INPUT_EXAMPLE = {
  name: 'João Silva',
  email: 'joao@exemplo.com.br',
  password: 'Password123!',
  role: 'GESTOR',
}

export const LOGIN_INPUT_EXAMPLE = {
  email: 'joao@exemplo.com.br',
  password: 'Password123!',
}

export const USER_RESPONSE_EXAMPLE = {
  id: '771e8400-e29b-41d4-a716-446655440000',
  name: 'João Silva',
  email: 'joao@exemplo.com.br',
  role: 'GESTOR',
  createdAt: '2026-02-05T12:00:00Z',
}

export const LOGIN_RESPONSE_EXAMPLE = {
  access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  user: USER_RESPONSE_EXAMPLE,
}
