<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'
import { LogOut, Plus, Layout, Settings } from 'lucide-vue-next'
import TaskColumn from '../components/TaskColumn.vue'
import CreateTaskModal from '../components/CreateTaskModal.vue'

const router = useRouter()
const user = ref(null)
const tasks = ref([])
const loading = ref(true)
const isModalOpen = ref(false)
const draggedTask = ref(null)

const columns = ['To-do', 'In Progress', 'Done']

const getTasksByStatus = (status) => {
  return tasks.value.filter(t => t.status === status)
}

onMounted(async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth')
      return
    }
    user.value = session.user
    await fetchTasks()
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
})

const fetchTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) console.error('Error fetching tasks:', error)
  else tasks.value = data || []
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/auth')
}

const taskToEdit = ref(null)

const handleTaskCreated = (newTask) => {
  tasks.value.unshift(newTask)
}

const handleTaskUpdated = (updatedTask) => {
  const index = tasks.value.findIndex(t => t.id === updatedTask.id)
  if (index !== -1) {
    tasks.value[index] = updatedTask
  }
}

const handleEditTask = (task) => {
  taskToEdit.value = task
  isModalOpen.value = true
}

const handleDeleteTask = async (task) => {
  if (!confirm('Are you sure you want to delete this task?')) return

  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', task.id)

    if (error) throw error
    
    tasks.value = tasks.value.filter(t => t.id !== task.id)
  } catch (error) {
    console.error('Error deleting task:', error)
    alert('Failed to delete task')
  }
}

const openNewTaskModal = () => {
  taskToEdit.value = null
  isModalOpen.value = true
}

const handleDragStart = (event, task) => {
  draggedTask.value = task
  event.dataTransfer.effectAllowed = 'move'
}

const handleDropTask = async (newStatus) => {
  if (!draggedTask.value || draggedTask.value.status === newStatus) return

  const taskToUpdate = draggedTask.value
  const oldStatus = taskToUpdate.status
  
  // Optimistic update
  taskToUpdate.status = newStatus
  
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskToUpdate.id)

    if (error) throw error
  } catch (error) {
    console.error('Error updating task:', error)
    // Revert on error
    taskToUpdate.status = oldStatus
    alert('Failed to update task status')
  } finally {
    draggedTask.value = null
  }
}
</script>

<template>
  <div class="min-h-screen bg-dark-900 flex flex-col">
    <!-- Header -->
    <header class="bg-dark-800/50 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center shadow-lg shadow-gold-500/20">
          <Layout class="w-5 h-5 text-white" />
        </div>
        <h1 class="text-xl font-display font-bold text-white">TaskMaster</h1>
      </div>

      <div class="flex items-center gap-4">
        <button @click="router.push('/profile')" class="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5 hover:bg-white/10 transition-all">
          <div class="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
            {{ user?.email?.[0].toUpperCase() }}
          </div>
          <span class="text-sm text-gray-300 hidden sm:block">{{ user?.email }}</span>
        </button>
        
        <button @click="handleLogout" class="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
          <LogOut class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-x-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-display font-bold text-white mb-1">Board</h2>
          <p class="text-gray-400 text-sm">Manage your tasks and projects</p>
        </div>
        <button 
          @click="openNewTaskModal"
          class="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-gold-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <Plus class="w-5 h-5" />
          <span>New Task</span>
        </button>
      </div>

      <!-- Kanban Board -->
      <div class="flex gap-6 h-[calc(100vh-200px)] min-w-fit pb-4">
        <TaskColumn 
          v-for="status in columns" 
          :key="status"
          :title="status"
          :status="status"
          :tasks="getTasksByStatus(status)"
          @dragstart="handleDragStart"
          @drop-task="handleDropTask"
          @edit="handleEditTask"
          @delete="handleDeleteTask"
        />
      </div>
    </main>

    <CreateTaskModal 
      :is-open="isModalOpen"
      :user-id="user?.id"
      :task-to-edit="taskToEdit"
      @close="isModalOpen = false"
      @task-created="handleTaskCreated"
      @task-updated="handleTaskUpdated"
    />
  </div>
</template>
