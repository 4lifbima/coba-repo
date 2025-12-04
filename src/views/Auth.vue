<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const isLogin = ref(true)
const loading = ref(false)
const email = ref('')
const password = ref('')
const errorMsg = ref('')

const handleAuth = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    if (isLogin.value) {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
      router.push('/')
    } else {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
      // Auto login or show message
      if (!error) {
          // For simplicity, just try to login or show success
           const { error: loginError } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
          })
          if (loginError) throw loginError
          router.push('/')
      }
    }
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-dark-900 p-4 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-500/5 rounded-full blur-[100px]"></div>
    </div>

    <div class="w-full max-w-md bg-dark-800/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl relative z-10">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">TaskMaster</h1>
        <p class="text-gray-400">Manage your tasks with elegance.</p>
      </div>

      <div class="flex bg-dark-700/50 p-1 rounded-xl mb-8">
        <button 
          @click="isLogin = true"
          class="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300"
          :class="isLogin ? 'bg-gold-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'"
        >
          Sign In
        </button>
        <button 
          @click="isLogin = false"
          class="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300"
          :class="!isLogin ? 'bg-gold-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'"
        >
          Sign Up
        </button>
      </div>

      <form @submit.prevent="handleAuth" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm text-gray-400 ml-1">Email</label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              v-model="email"
              type="email" 
              required
              class="w-full bg-dark-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm text-gray-400 ml-1">Password</label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              v-model="password"
              type="password" 
              required
              class="w-full bg-dark-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div v-if="errorMsg" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {{ errorMsg }}
        </div>

        <button 
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-gold-400 to-gold-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          <span v-else>{{ isLogin ? 'Sign In' : 'Create Account' }}</span>
          <ArrowRight v-if="!loading" class="w-5 h-5" />
        </button>
      </form>
    </div>
  </div>
</template>
