<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="text-center mb-4">
        <h2 class="auth-title">{{ isLoginMode ? 'Welcome Back' : 'Create Account' }}</h2>
        <p class="text-muted">{{ isLoginMode ? 'Login to your account' : 'Sign up to get started' }}</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Alert Messages -->
        <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-circle-fill me-2"></i>
          <span v-if="typeof errorMessage === 'string'">{{ errorMessage }}</span>
          <ul v-else class="mb-0">
            <li v-for="(errors, field) in errorMessage" :key="field">
              {{ errors.join(', ') }}
            </li>
          </ul>
          <button type="button" class="btn-close" @click="errorMessage = null"></button>
        </div>

        <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i>
          {{ successMessage }}
          <button type="button" class="btn-close" @click="successMessage = null"></button>
        </div>

        <!-- Name Field (Register Only) -->
        <div v-if="!isLoginMode" class="mb-3">
          <label for="name" class="form-label">Full Name</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-person"></i></span>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="formData.name"
              placeholder="Enter your name"
              required
            />
          </div>
        </div>

        <!-- Email Field -->
        <div class="mb-3">
          <label for="email" class="form-label">Email Address</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-envelope"></i></span>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="formData.email"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-lock"></i></span>
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              id="password"
              v-model="formData.password"
              placeholder="Enter your password"
              required
            />
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Confirm Password (Register Only) -->
        <div v-if="!isLoginMode" class="mb-3">
          <label for="password_confirmation" class="form-label">Confirm Password</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-control"
              id="password_confirmation"
              v-model="formData.password_confirmation"
              placeholder="Confirm your password"
              required
            />
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Remember Me (Login Only) -->
        <div v-if="isLoginMode" class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="remember" v-model="rememberMe" />
          <label class="form-check-label" for="remember">Remember me</label>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="authStore.loading">
          <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isLoginMode ? 'Login' : 'Register' }}
        </button>

        <!-- Toggle Mode -->
        <div class="text-center">
          <p class="mb-0">
            {{ isLoginMode ? "Don't have an account?" : 'Already have an account?' }}
            <a href="#" @click.prevent="toggleMode" class="text-decoration-none fw-bold">
              {{ isLoginMode ? 'Sign Up' : 'Login' }}
            </a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const isLoginMode = ref(true)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const rememberMe = ref(false)
const errorMessage = ref(null)
const successMessage = ref(null)

const formData = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const resetForm = () => {
  formData.name = ''
  formData.email = ''
  formData.password = ''
  formData.password_confirmation = ''
  errorMessage.value = null
  successMessage.value = null
}

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  resetForm()
}

const handleSubmit = async () => {
  errorMessage.value = null
  successMessage.value = null

  let result

  if (isLoginMode.value) {
    result = await authStore.login({
      email: formData.email,
      password: formData.password
    })
  } else {
    result = await authStore.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation
    })
  }

  if (result.success) {
    successMessage.value = result.message
    setTimeout(() => {
      resetForm()
    }, 1500)
  } else {
    errorMessage.value = result.error
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-title {
  color: #333;
  font-weight: 700;
  margin-bottom: 10px;
}

.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
}

.form-control {
  border-left: none;
}

.form-control:focus {
  box-shadow: none;
  border-color: #667eea;
}

.input-group:focus-within .input-group-text {
  border-color: #667eea;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

a {
  color: #667eea;
  transition: color 0.3s;
}

a:hover {
  color: #764ba2;
}
</style>