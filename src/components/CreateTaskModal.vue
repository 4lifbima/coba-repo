<script setup>
import { ref, watch } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'
import { supabase } from '../supabase'

const props = defineProps({
  isOpen: Boolean,
  userId: String,
  taskToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'task-created', 'task-updated'])

const loading = ref(false)
const title = ref('')
const description = ref('')
const priority = ref('Medium')
const dueDate = ref('')

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.taskToEdit) {
      title.value = props.taskToEdit.title
      description.value = props.taskToEdit.description
      priority.value = props.taskToEdit.priority
      dueDate.value = props.taskToEdit.due_date ? props.taskToEdit.due_date.split('T')[0] : ''
    } else {
      title.value = ''
      description.value = ''
      priority.value = 'Medium'
      dueDate.value = ''
    }
  }
})

const handleSubmit = async () => {
  if (!title.value) return
  
  loading.value = true
  try {
    const taskData = {
      title: title.value,
      description: description.value,
      priority: priority.value,
      due_date: dueDate.value ? new Date(dueDate.value).toISOString() : null,
    }

    if (props.taskToEdit) {
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', props.taskToEdit.id)
        .select()
      
      if (error) throw error
      emit('task-updated', data[0])
    } else {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            ...taskData,
            status: 'To-do',
            user_id: props.userId
          }
        ])
        .select()

      if (error) throw error
      emit('task-created', data[0])
    }
    
    emit('close')
  } catch (error) {
    console.error('Error saving task:', error)
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="w-full max-w-md bg-dark-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-white/5">
        <h3 class="text-lg font-display font-semibold text-white">{{ taskToEdit ? 'Edit Task' : 'New Task' }}</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-4 space-y-4">
        <div class="space-y-2">
          <label class="text-sm text-gray-400">Title</label>
          <input 
            v-model="title"
            type="text" 
            required
            class="w-full bg-dark-900/50 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-gold-500/50 transition-all"
            placeholder="Task title"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm text-gray-400">Description</label>
          <textarea 
            v-model="description"
            rows="3"
            class="w-full bg-dark-900/50 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-gold-500/50 transition-all resize-none"
            placeholder="Task details..."
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm text-gray-400">Priority</label>
            <select 
              v-model="priority"
              class="w-full bg-dark-900/50 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-gold-500/50 transition-all appearance-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label class="text-sm text-gray-400">Due Date</label>
            <input 
              v-model="dueDate"
              type="date"
              class="w-full bg-dark-900/50 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-gold-500/50 transition-all"
            />
          </div>
        </div>

        <div class="pt-4">
          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-gold-500 hover:bg-gold-600 text-white font-medium py-2 rounded-xl shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            <span>{{ taskToEdit ? 'Save Changes' : 'Create Task' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
