import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null
  }),

  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    getError: (state) => state.error
  },

  actions: {
    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post(`${API_URL}/api/register`, userData)
        
        if (response.data.success) {
          this.token = response.data.data.token
          this.user = response.data.data.user
          this.isAuthenticated = true
          
          localStorage.setItem('token', this.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
          
          return { success: true, message: response.data.message }
        }
      } catch (error) {
        this.error = error.response?.data?.errors || error.response?.data?.message || 'Registration failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post(`${API_URL}/api/login`, credentials)
        
        if (response.data.success) {
          this.token = response.data.data.token
          this.user = response.data.data.user
          this.isAuthenticated = true
          
          localStorage.setItem('token', this.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
          
          return { success: true, message: response.data.message }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        if (this.token) {
          await axios.post(`${API_URL}/api/logout`)
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.token = null
        this.isAuthenticated = false
        
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      }
    },

    async fetchUser() {
      if (!this.token) return
      
      try {
        const response = await axios.get(`${API_URL}/api/user`)
        this.user = response.data.data
      } catch (error) {
        console.error('Fetch user error:', error)
        this.logout()
      }
    },

    initAuth() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        this.fetchUser()
      }
    }
  }
})