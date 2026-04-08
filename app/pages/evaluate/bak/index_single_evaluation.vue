<template>
  <UDashboardPanel>
    <!-- Header -->
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Student Evaluation</span>
        </template>
      </UDashboardNavbar>
    </template>

    <!-- Body -->
    <template #body>
      <div class="flex justify-center py-10 px-4">
        <div class="w-full max-w-3xl space-y-6">

          <!-- Faculty Info -->
          <UCard>
            <div class="flex items-center gap-4">
              <UAvatar icon="i-lucide-user" size="lg" />
              <div>
                <p class="text-lg font-semibold">Prof. John Doe</p>
                <p class="text-sm text-gray-500">
                  BSIT • Database Systems
                </p>
              </div>
            </div>
          </UCard>

          <!-- Progress -->
          <UProgress :value="progress" />

          <!-- Evaluation Form -->
          <UCard>
            <template #header>
              <h2 class="text-lg font-semibold">Faculty Evaluation</h2>
            </template>

            <div class="space-y-6">

              <!-- Criteria -->
              <div v-for="item in criteria" :key="item.key" class="space-y-2">
                <!-- Title + Label -->
                <div class="flex justify-between items-center">
                  <p class="font-medium">{{ item.label }}</p>
                  <span class="text-xs text-gray-400">{{ getLabel(form[item.key]) }}</span>
                </div>

                <!-- Scale Guide -->
                <div class="flex justify-between text-xs text-gray-400">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>

                <!-- RadioGroup (1–5) -->
                <URadioGroup
                  v-model="form[item.key]"
                  :items="radioItems"
                  orientation="horizontal"
                  class="flex gap-2"
                  option-class="px-3 py-1 border rounded-md cursor-pointer"
                  active-class="bg-primary text-white border-primary"
                />
              </div>

              <!-- Comment -->
              <UTextarea v-model="form.comment" placeholder="Write your feedback (optional)..." />

              <!-- Submit -->
              <UButton block size="lg" :disabled="!isValid || submitted" @click="submit">
                {{ submitted ? 'Submitted' : 'Submit Evaluation' }}
              </UButton>

            </div>
          </UCard>

        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
//@ts-nocheck
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Admin', 'Student']
})

import { reactive, ref, computed } from 'vue'

const toast = useToast()

// Criteria for evaluation
const criteria = [
  { key: 'teaching', label: 'Teaching Effectiveness' },
  { key: 'knowledge', label: 'Knowledge' },
  { key: 'communication', label: 'Communication' },
  { key: 'punctuality', label: 'Punctuality' },
  { key: 'professionalism', label: 'Professionalism' }
]

// Radio items (1–5) for URadioGroup
const radioItems = [
  '1 - Poor',
  '2 - Fair',
  '3 - Good',
  '4 - Very Good',
  '5 - Excellent'
]

// Form state
const form = reactive({
  teaching: null,
  knowledge: null,
  communication: null,
  punctuality: null,
  professionalism: null,
  comment: ''
})

// Submitted state
const submitted = ref(false)

// Validation (all criteria must be rated)
const isValid = computed(() => criteria.every(c => form[c.key] !== null))

// Progress calculation
const progress = computed(() => {
  const filled = criteria.filter(c => form[c.key] !== null).length
  return (filled / criteria.length) * 100
})

// Helper to show label for selected rating
const getLabel = (value: number | string | null) => {
  if (!value) return ''
  return value.toString().split(' - ')[1] // extracts "Poor", "Good", etc.
}

// Submit function
const submit = () => {
  submitted.value = true
  console.log('Evaluation submitted:', form)
  toast.add({
    title: 'Success',
    description: 'Evaluation submitted successfully!',
    color: 'green'
  })
}
</script>

<style></style>