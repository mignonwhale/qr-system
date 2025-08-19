export interface Student {
  id: string
  name: string
  email: string
  createdAt: string
  lastAccessAt?: string
  qrCodePath?: string
}

export interface StudentInput {
  name: string
  email: string
}

export interface StudentsData {
  students: Student[]
  lastUpdated: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface StudentFormData {
  name: string
  email: string
}