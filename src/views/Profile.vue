<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'
import { ArrowLeft, User, Lock, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const user = ref(null)
const loading = ref(false)
const message = ref('')
const errorMsg = ref('')

const password = ref('')
const confirmPassword = ref('')

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    router.push('/auth')
    return
  }
  user.value = session.user
})

const updatePassword = async () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Passwords do not match"
    return
  }
  
  loading.value = true
  message.value = ''
  errorMsg.value = ''
  
  try {
    const { error } = await supabase.auth.updateUser({
      password: password.value
    })
    
    if (error) throw error
    
    message.value = "Password updated successfully"
    password.value = ''
    confirmPassword.value = ''
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-dark-900 p-6">
    <div class="max-w-2xl mx-auto">
      <button @click="router.push('/')" class="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft class="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      <div class="bg-dark-800/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-xl">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-gold-500/20">
            {{ user?.email?.[0].toUpperCase() }}
          </div>
          <div>
            <h1 class="text-2xl font-display font-bold text-white">My Profile</h1>
            <p class="text-gray-400">{{ user?.email }}</p>
          </div>
        </div>

        <div class="space-y-6">
          <div class="border-t border-white/5 pt-6">
            <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Lock class="w-5 h-5 text-gold-500" />
              Change Password
            </h2>
            
            <form @submit.prevent="updatePassword" class="space-y-4 max-w-md">
              <div class="space-y-2">
                <label class="text-sm text-gray-400">New Password</label>
                <input 
                  v-model="password"
                  type="password" 
                  required
                  minlength="6"
                  class="w-full bg-dark-900/50 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-gold-500/50 transition-all"
                />
              </div>
              
              <div class="space-y-2">
                <label class="text-sm text-gray-400">Confirm Password</label>
                <input 
                  v-model="confirmPassword"
                  type="password" 
                  required
                  minlength="6"
                  class="w-full bg-dark-900/50 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-gold-500/50 transition-all"
                />
              </div>

              <div v-if="message" class="text-green-400 text-sm bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                {{ message }}
              </div>
              
              <div v-if="errorMsg" class="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {{ errorMsg }}
              </div>

              <button 
                type="submit"
                :disabled="loading"
                class="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-xl border border-white/10 transition-all flex items-center gap-2"
              >
                <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
                <span>Update Password</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
