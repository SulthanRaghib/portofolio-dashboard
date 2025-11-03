import { STORAGE_KEYS } from "./config"

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  }
  return null
}

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  }
}

export const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
  }
}

export const isAuthenticated = () => {
  return !!getToken()
}
