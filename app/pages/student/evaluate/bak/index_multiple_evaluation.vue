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
      <div class="flex justify-center py-10 px-4">
        <div class="w-full max-w-4xl space-y-6">

          <!-- Progress -->
          <UProgress :value="progress" />

          <!-- Faculty List -->
          <div
            v-for="faculty in faculties"
            :key="faculty.id"
          >
            <UCard class="space-y-4">

              <!-- Faculty Info -->
              <div class="flex items-center gap-4">
                <UAvatar icon="i-lucide-user" size="lg" />
                <div>
                  <p class="text-lg font-semibold">
                    {{ faculty.name }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ faculty.subject }}
                  </p>
                </div>
              </div>

              <!-- Criteria -->
              <div
                v-for="item in criteria"
                :key="item.key"
                class="space-y-2"
              >
                <div class="flex justify-between">
                  <p class="font-medium">
                    {{ item.label }}
                  </p>
                  <span class="text-xs text-gray-400">
                    {{ getLabel(faculty.ratings[item.key]) }}
                  </span>
                </div>

                <div class="flex justify-between text-xs text-gray-400">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>

                <!-- Radio -->
                <URadioGroup
                  v-model="faculty.ratings[item.key]"
                  :items="radioItems"
                  orientation="horizontal"
                  class="flex gap-2"
                  option-class="px-3 py-1 border rounded-md cursor-pointer"
                  active-class="bg-primary text-white border-primary"
                />
              </div>

              <!-- Comment -->
              <UTextarea
                v-model="faculty.comment"
                placeholder="Write feedback..."
              />

            </UCard>
          </div>

          <!-- Submit -->
          <UButton
            block
            size="lg"
            :disabled="!isValid || submitted"
            @click="submit"
          >
            {{ submitted ? 'Submitted' : 'Submit All Evaluations' }}
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

// Radio Items
const radioItems = [
  '1 - Poor',
  '2 - Fair',
  '3 - Good',
  '4 - Very Good',
  '5 - Excellent'
]

// Faculty List (sample)
const faculties = reactive([
  {
    id: 1,
    name: 'Prof. John Doe',
    subject: 'Database Systems',
    ratings: {
      teaching: null,
      knowledge: null,
      communication: null,
      punctuality: null,
      professionalism: null
    },
    comment: ''
  },
  {
    id: 2,
    name: 'Prof. Jane Smith',
    subject: 'Web Development',
    ratings: {
      teaching: null,
      knowledge: null,
      communication: null,
      punctuality: null,
      professionalism: null
    },
    comment: ''
  }
])

// Validation (all faculty evaluated)
const isValid = computed(() =>
  faculties.every(f =>
    criteria.every(c => f.ratings[c.key] !== null)
  )
)

// Progress
const progress = computed(() => {
  const total = faculties.length * criteria.length
  let filled = 0

  faculties.forEach(f => {
    criteria.forEach(c => {
      if (f.ratings[c.key] !== null) filled++
    })
  })

  return (filled / total) * 100
})

// Label helper
const getLabel = (value: string | null) => {
  if (!value) return ''
  return value.split(' - ')[1]
}

// Submit
const submitted = ref(false)

const submit = () => {
  submitted.value = true

  console.log('All evaluations:', faculties)

  toast.add({
    title: 'Success',
    description: 'All evaluations submitted!',
    color: 'green'
  })
}
</script>