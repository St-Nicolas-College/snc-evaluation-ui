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
      <div class="flex gap-6 py-6 px-4">

        <!-- Left Sidebar: Select Teachers -->
        <div class="w-64">
          <UCard>
            <h3 class="font-semibold mb-2">Select Teachers</h3>
            <div class="flex flex-col gap-2">
              <!-- <UCheckbox v-for="teacher in allFaculties" :key="teacher.id" v-model="selectedTeacherIds"
                :label="teacher.name + ' - ' + teacher.department" :value="teacher.id" /> -->
              <UCheckbox v-for="teacher in allFaculties" :key="teacher.id" v-model="selectedTeacherIds"
                :label="teacher.name + ' - ' + teacher.subject" :value="teacher.id" />
            </div>
          </UCard>
        </div>

        <!-- Right Side: Evaluation Form -->
        <div class="flex-1">
          <div v-if="currentTeacher">
            <UCard>
              <h2 class="text-lg font-semibold mb-2">
                Evaluate: {{ currentTeacher.name }} - {{ currentTeacher.department }}
              </h2>

              <div v-for="item in criteria" :key="item.key" class="my-2">
                <p class="font-medium">{{ item.label }}</p>
                <URadioGroup v-model="currentTeacher.ratings[item.key]"
                  :items="scaleOptions.map(s => `${s.value} - ${s.label}`)" orientation="horizontal" />
              </div>

              <UTextarea v-model="currentTeacher.comment" placeholder="Optional feedback..." class="mt-3" />

              <div class="flex justify-between mt-4">
                <UButton :disabled="currentPage === 0" @click="prevPage" variant="outline">
                  Previous
                </UButton>

                <UButton v-if="!isLastPage" :disabled="!isValidCurrent" @click="nextPage">
                  Next
                </UButton>

                <UButton v-else :disabled="!isValidCurrent || submitted" color="green" @click="submit">
                  {{ submitted ? 'Submitted' : 'Submit Evaluation' }}
                </UButton>
              </div>

              <UProgress :value="progress" class="mt-3" />
            </UCard>
          </div>
          <div v-else>
            <p class="text-gray-500">Select teachers to start evaluating.</p>
          </div>
        </div>

      </div>
    </template>

  </UDashboardPanel>
</template>

<script setup lang="ts">
//@ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
const config = useRuntimeConfig()
// Page metadata
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Admin', 'Student']
})

const { $api } = useNuxtApp();
// Toast for notifications
const toast = useToast()

// State
const allFaculties = ref([])         // All teachers from backend
const criteria = ref([])             // Dynamic criteria from backend
const scaleOptions = ref([           // Scale labels
  { value: 1, label: 'Poor' },
  { value: 2, label: 'Fair' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Very Good' },
  { value: 5, label: 'Excellent' }
])

const selectedTeacherIds = ref<number[]>([])   // IDs of selected teachers
const selectedFaculties = reactive([]) // Teachers selected for evaluation

const currentPage = ref(0)           // Pagination
const submitted = ref(false)

// Fetch faculties and criteria dynamically
onMounted(async () => {
  // Fetch teachers
  //allFaculties.value = await $api(`/teachers`) // [{id, name, subject}, ...]
  const res = await $api('/teachers')
  console.log("Teachers: ", res.data)
  allFaculties.value = res.data

  // Fetch criteria
  const res2 = await $api('/evaluation-criterias') // [{key, label, maxScore}]

  criteria.value = res.data
})

// Watch selectedTeacherIds and create reactive teacher objects
watch([selectedTeacherIds, criteria], ([ids, crits]) => {
  if (!Array.isArray(ids) || !crits.length) return  // ensure ids is array

  selectedFaculties.splice(0, selectedFaculties.length)

  ids.forEach(id => {
    const teacher = allFaculties.value.find(t => t.id === id)
    if (teacher) {
      selectedFaculties.push({
        ...teacher,
        ratings: crits.reduce((acc, c) => ({ ...acc, [c.key]: null }), {}),
        comment: ''
      })
    }
  })

  currentPage.value = 0
})

// Pagination helpers
const currentTeacher = computed(() => selectedFaculties[currentPage.value])
const isLastPage = computed(() => currentPage.value === selectedFaculties.length - 1)
const progress = computed(() => {
  const filled = selectedFaculties.filter(f =>
    criteria.value.every(c => f.ratings[c.key] !== null)
  ).length
  return selectedFaculties.length === 0 ? 0 : (filled / selectedFaculties.length) * 100
})

// Validate current page
const isValidCurrent = computed(() =>
  criteria.value.every(c => currentTeacher.value?.ratings[c.key] !== null)
)

// Pagination functions
const nextPage = () => { if (!isLastPage.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 0) currentPage.value-- }

// Submit evaluations
const submit = async () => {
  submitted.value = true
  const payload = selectedFaculties.map(f => ({
    teacherId: f.id,
    ratings: f.ratings,
    comment: f.comment
  }))

  try {
    await $fetch('/api/submit-evaluation', {
      method: 'POST',
      body: payload
    })

    toast.add({ title: 'Success', description: 'Evaluations submitted!', color: 'green' })
  } catch (err) {
    console.error(err)
    toast.add({ title: 'Error', description: 'Failed to submit', color: 'red' })
    submitted.value = false
  }
}
</script>