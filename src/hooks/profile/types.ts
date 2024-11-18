export interface UserProfile {
  id: string
  name: string | null
  email: string
  role: 'ADMIN' | 'CUSTOMER'
}

export interface UpdateProfileData {
  name: string
}
