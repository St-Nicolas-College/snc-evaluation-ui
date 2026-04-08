<template>
  <UDashboardPanel>

    <!-- Header -->
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">
            Student Evaluation
          </span>
        </template>
      </UDashboardNavbar>
    </template>

    <!-- Body -->
    <template #body>
      <div class="flex gap-6 px-4 py-10 ">
        <!-- Teacher Selection & Wizard -->
        <div class="w-1/4">
          <!-- Select Teachers -->
          <UCard class="h-full sticky top-4">
            <template #header>
              <h2 class="text-lg font-semibold">Select Teachers to Evaluate</h2>
            </template>
            <div class="flex flex-col gap-2  overflow-y-auto">
              <UCheckboxGroup v-model="selectedTeacherIds" :items="teacherOptions" />
            </div>
          </UCard>
          </div>

          <!-- RIGHT: Evaluation -->
          <div class="w-3/4 flex flex-col gap-6">
            <!-- Empty state -->
            <div v-if="selectedTeacherIds.length === 0" class="text-center text-gray-400 py-20">
              <p class="text-lg">No teacher selected</p>
              <p class="text-sm">Please select at least one teacher above.</p>
            </div>

            <!-- Evaluation Wizard -->
            <div v-else>
              <UCard class="space-y-4">

                <!-- Current Teacher Info -->
                <div class="flex items-center gap-4">
                  <UAvatar icon="i-lucide-user" size="lg" />
                  <div>
                    <p class="text-lg font-semibold">{{ currentTeacher.name }}</p>
                    <p class="text-sm text-gray-500">{{ currentTeacher.subject }}</p>
                  </div>
                </div>

                <!-- Evaluation Criteria -->
                <div v-for="item in criteria" :key="item.key" class="space-y-2">
                  <div class="flex justify-between">
                    <p class="font-medium">{{ item.label }}</p>
                    <span class="text-xs text-gray-400">
                      {{ getLabel(currentTeacher.ratings[item.key]) }}
                    </span>
                  </div>

                  <div class="flex justify-between text-xs text-gray-400">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>

                  <URadioGroup v-model="currentTeacher.ratings[item.key]" :items="radioItems" orientation="horizontal"
                    class="flex gap-2" option-class="px-3 py-1 border rounded-md cursor-pointer"
                    active-class="bg-primary text-white border-primary" />
                </div>

                <!-- Comment -->
                <UTextarea v-model="currentTeacher.comment" placeholder="Write feedback..." />

                <!-- Wizard Navigation -->
                <div class="flex justify-between mt-4">
                  <UButton variant="outline" :disabled="currentIndex === 0" @click="prevTeacher">
                    Previous
                  </UButton>

                  <UButton v-if="!isLastTeacher" @click="nextTeacher">
                    Next
                  </UButton>

                  <UButton v-else :disabled="!isValid || submitted" @click="submit">
                    {{ submitted ? 'Submitted' : 'Submit Evaluations' }}
                  </UButton>
                </div>

                <!-- Step Indicator -->
                <p class="text-center text-sm text-gray-400 mt-2">
                  Teacher {{ currentIndex + 1 }} of {{ selectedTeacherIds.length }}
                </p>
              </UCard>
            </div>
          </div>

    
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
//@ts-nocheck
import { reactive, ref, computed } from 'vue'

const toast = useToast()

// Criteria
const criteria = [
  { key: 'teaching', label: 'Teaching Effectiveness' },
  { key: 'knowledge', label: 'Knowledge' },
  { key: 'communication', label: 'Communication' },
  { key: 'punctuality', label: 'Punctuality' },
  { key: 'professionalism', label: 'Professionalism' }
]

// Ratings
const radioItems = [
  '1 - Poor',
  '2 - Fair',
  '3 - Good',
  '4 - Very Good',
  '5 - Excellent'
]

// Hardcoded 20 teachers
const allFaculties = reactive([
  { id: 1, name: 'Prof. John Doe', subject: 'Database Systems' },
  { id: 2, name: 'Prof. Jane Smith', subject: 'Web Development' },
  { id: 3, name: 'Prof. Mark Lee', subject: 'Algorithms' },
  { id: 4, name: 'Prof. Anna Cruz', subject: 'Software Engineering' },
  { id: 5, name: 'Prof. David Tan', subject: 'Computer Networks' },
  { id: 6, name: 'Prof. Maria Santos', subject: 'Information Systems' },
  { id: 7, name: 'Prof. Kevin Lim', subject: 'Operating Systems' },
  { id: 8, name: 'Prof. Carla Reyes', subject: 'Human Computer Interaction' },
  { id: 9, name: 'Prof. Brian Ong', subject: 'Artificial Intelligence' },
  { id: 10, name: 'Prof. Sophia Lee', subject: 'Machine Learning' },
  { id: 11, name: 'Prof. Daniel Kim', subject: 'Cybersecurity' },
  { id: 12, name: 'Prof. Angela Yu', subject: 'Mobile Development' },
  { id: 13, name: 'Prof. Patrick Chua', subject: 'Cloud Computing' },
  { id: 14, name: 'Prof. Nicole Garcia', subject: 'Data Structures' },
  { id: 15, name: 'Prof. Mark Santos', subject: 'Discrete Mathematics' },
  { id: 16, name: 'Prof. John Lim', subject: 'System Analysis' },
  { id: 17, name: 'Prof. Grace Tan', subject: 'Project Management' },
  { id: 18, name: 'Prof. Leo Fernandez', subject: 'Game Development' },
  { id: 19, name: 'Prof. Ella Cruz', subject: 'Multimedia Systems' },
  { id: 20, name: 'Prof. Ryan Bautista', subject: 'IT Ethics' }
])

// Selected teachers
const selectedTeacherIds = ref([])

// Map teachers to evaluation
const selectedFaculties = computed(() =>
  allFaculties
    .filter(f => selectedTeacherIds.value.includes(f.id))
    .map(f => {
      if (!f.ratings) f.ratings = criteria.reduce((acc, c) => ({ ...acc, [c.key]: null }), {})
      if (!f.comment) f.comment = ''
      return f
    })
)

// Checkbox options
const teacherOptions = allFaculties.map(f => ({ label: f.name, value: f.id }))

// Current teacher index
const currentIndex = ref(0)
const currentTeacher = computed(() => selectedFaculties.value[currentIndex.value] || {})

// Navigation
const isLastTeacher = computed(() => currentIndex.value === selectedFaculties.value.length - 1)
const nextTeacher = () => { if (!isLastTeacher.value) currentIndex.value++ }
const prevTeacher = () => { if (currentIndex.value > 0) currentIndex.value-- }

// Validation
const isValid = computed(() =>
  selectedFaculties.value.every(f =>
    criteria.every(c => f.ratings[c.key] !== null)
  )
)

// Label helper
const getLabel = (value: string | null) => value ? value.split(' - ')[1] : ''

// Submit
const submitted = ref(false)
const submit = () => {
  submitted.value = true
  console.log('Submitted evaluations:', selectedFaculties.value)
  toast.add({ title: 'Success', description: 'Evaluations submitted!', color: 'green' })
}
</script>