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
      <div class="flex gap-6 px-4 py-10">
        <!-- LEFT: Teacher Selection -->
        <div class="w-1/4">
          <UCard class="h-full sticky top-4">
            <template #header>
              <h2 class="text-lg font-semibold">Select Teachers</h2>
            </template>

            <div class="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
              <UCheckboxGroup v-model="selectedTeacherIds" :items="teacherOptions" />
            </div>
          </UCard>
        </div>

        <!-- RIGHT: Evaluation -->
        <div class="w-3/4 flex flex-col gap-6">

          <!-- Empty State -->
          <div v-if="selectedFaculties.length === 0" class="text-center text-gray-400 py-20">
            <p class="text-lg">No teacher selected</p>
            <p class="text-sm">Please select at least one teacher on the left.</p>
          </div>

          <!-- Evaluation Cards -->
          <div v-for="faculty in selectedFaculties" :key="faculty.id">
            <UCard class="space-y-4">

              <!-- Faculty Info -->
              <div class="flex items-center gap-4">
                <UAvatar icon="i-lucide-user" size="lg" />
                <div>
                  <p class="text-lg font-semibold">{{ faculty.name }}</p>
                  <p class="text-sm text-gray-500">{{ faculty.subject }}</p>
                </div>
              </div>

              <!-- Criteria -->
              <div v-for="item in criteria" :key="item.key" class="space-y-2">
                <div class="flex justify-between">
                  <p class="font-medium">{{ item.label }}</p>
                  <span class="text-xs text-gray-400">
                    {{ getLabel(faculty.ratings[item.key]) }}
                  </span>
                </div>

                <div class="flex justify-between text-xs text-gray-400">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>

                <!-- Rating -->
                <URadioGroup v-model="faculty.ratings[item.key]" :items="radioItems" orientation="horizontal"
                  class="flex gap-2" option-class="px-3 py-1 border rounded-md cursor-pointer"
                  active-class="bg-primary text-white border-primary" />
              </div>

              <!-- Comment -->
              <UTextarea v-model="faculty.comment" placeholder="Write feedback..." />
            </UCard>
          </div>

          <!-- ✅ Submit Button (ONLY SHOWS IF TEACHER SELECTED) -->
          <UButton v-if="selectedFaculties.length > 0" block size="lg" :disabled="!isValid || submitted"
            @click="submit">
            {{ submitted ? 'Submitted' : 'Submit Evaluations' }}
          </UButton>

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

// 20 Faculty
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

// Create evaluation object
const createFacultyEvaluation = (faculty) => ({
  ...faculty,
  ratings: criteria.reduce((acc, c) => ({ ...acc, [c.key]: null }), {}),
  comment: ''
})

// Selected faculties
const selectedFaculties = computed(() =>
  allFaculties
    .filter(f => selectedTeacherIds.value.includes(f.id))
    .map(f => {
      if (!f.ratings) Object.assign(f, createFacultyEvaluation(f))
      return f
    })
)

// Checkbox options
const teacherOptions = allFaculties.map(f => ({
  label: f.name,
  value: f.id
}))

// Validation
const isValid = computed(() =>
  selectedFaculties.value.every(f =>
    criteria.every(c => f.ratings[c.key] !== null)
  )
)

// Label helper
const getLabel = (value: string | null) => {
  if (!value) return ''
  return value.split(' - ')[1]
}

// Submit
const submitted = ref(false)
const submit = () => {
  submitted.value = true
  console.log(selectedFaculties.value)

  toast.add({
    title: 'Success',
    description: 'Evaluations submitted!',
    color: 'green'
  })
}
</script>