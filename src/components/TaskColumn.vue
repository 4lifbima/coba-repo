<script setup>
import TaskCard from './TaskCard.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    default: () => []
  },
  status: {
    type: String,
    required: true
  }
})

defineEmits(['dragstart', 'drop-task', 'edit', 'delete'])
</script>

<template>
  <div 
    class="flex flex-col h-full min-w-[300px] bg-dark-900/30 rounded-2xl border border-white/5 p-4"
    @dragover.prevent
    @drop="$emit('drop-task', status)"
  >
    <div class="flex items-center justify-between mb-4 px-2">
      <h2 class="text-lg font-display font-semibold text-white flex items-center gap-2">
        {{ title }}
        <span class="text-xs font-sans font-normal text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{{ tasks.length }}</span>
      </h2>
    </div>

    <div class="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
      <TaskCard 
        v-for="task in tasks" 
        :key="task.id" 
        :task="task"
        @dragstart="(e, t) => $emit('dragstart', e, t)"
        @edit="(t) => $emit('edit', t)"
        @delete="(t) => $emit('delete', t)"
      />
      
      <!-- Empty State -->
      <div v-if="tasks.length === 0" class="h-32 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-gray-600 text-sm">
        No tasks
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #444;
}
</style>
