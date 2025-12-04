<script setup>
import { computed } from 'vue'
import { Calendar, AlertCircle, MoreHorizontal, Edit2, Trash2 } from 'lucide-vue-next'
import { useDateFormat } from '@vueuse/core'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const priorityColor = computed(() => {
  switch (props.task.priority) {
    case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20'
    case 'Medium': return 'text-gold-400 bg-gold-400/10 border-gold-400/20'
    case 'Low': return 'text-green-400 bg-green-400/10 border-green-400/20'
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
  }
})

const formattedDate = computed(() => {
  if (!props.task.due_date) return ''
  return useDateFormat(props.task.due_date, 'MMM D').value
})
</script>

<template>
  <div 
    class="group bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300 cursor-grab active:cursor-grabbing"
    draggable="true"
    @dragstart="$emit('dragstart', $event, task)"
  >
    <div class="flex justify-between items-start mb-3">
      <span 
        class="text-xs font-medium px-2 py-1 rounded-md border"
        :class="priorityColor"
      >
        {{ task.priority }}
      </span>
      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click.stop="$emit('edit', task)" class="text-gray-500 hover:text-gold-400 transition-colors p-1">
          <Edit2 class="w-3 h-3" />
        </button>
        <button @click.stop="$emit('delete', task)" class="text-gray-500 hover:text-red-400 transition-colors p-1">
          <Trash2 class="w-3 h-3" />
        </button>
      </div>
    </div>

    <h3 class="text-white font-medium mb-1 group-hover:text-gold-400 transition-colors">{{ task.title }}</h3>
    <p class="text-gray-400 text-sm line-clamp-2 mb-4">{{ task.description }}</p>

    <div class="flex items-center text-gray-500 text-xs gap-3">
      <div v-if="task.due_date" class="flex items-center gap-1">
        <Calendar class="w-3 h-3" />
        <span>{{ formattedDate }}</span>
      </div>
      <div class="flex items-center gap-1 ml-auto">
        <div class="w-5 h-5 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-[10px] text-white font-bold">
          U
        </div>
      </div>
    </div>
  </div>
</template>
