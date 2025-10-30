<template>
  <div class="dashboard-container">
    <nav class="navbar navbar-dark bg-dark">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">
          <i class="bi bi-speedometer2 me-2"></i>Dashboard
        </span>
        <button class="btn btn-outline-light" @click="handleLogout">
          <i class="bi bi-box-arrow-right me-2"></i>Logout
        </button>
      </div>
    </nav>

    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 mx-auto">
          <div class="card shadow-sm">
            <div class="card-body text-center p-5">
              <div class="mb-4">
                <div class="avatar-circle mx-auto mb-3">
                  <i class="bi bi-person-circle"></i>
                </div>
                <h2 class="mb-2">Welcome, {{ authStore.user?.name }}!</h2>
                <p class="text-muted">{{ authStore.user?.email }}</p>
              </div>

              <div class="alert alert-success" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                You are successfully logged in!
              </div>

              <div class="row mt-4">
                <div class="col-md-4">
                  <div class="stat-card">
                    <i class="bi bi-calendar-check stat-icon"></i>
                    <h5>Member Since</h5>
                    <p>{{ formatDate(authStore.user?.created_at) }}</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-card">
                    <i class="bi bi-shield-check stat-icon"></i>
                    <h5>Account Status</h5>
                    <p class="text-success fw-bold">Active</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-card">
                    <i class="bi bi-clock-history stat-icon"></i>
                    <h5>Last Login</h5>
                    <p>Just now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.avatar-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  color: white;
}

.stat-card {
  padding: 20px;
  border-radius: 10px;
  background: #f8f9fa;
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 40px;
  color: #667eea;
  margin-bottom: 10px;
}

.card {
  border: none;
  border-radius: 16px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>