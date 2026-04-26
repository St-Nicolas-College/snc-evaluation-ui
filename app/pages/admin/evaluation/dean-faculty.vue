<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #title>
          <span class="text-sm text-gray-500 uppercase">
            Dean to Faculty Evaluation Results
          </span>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- FILTERS -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-5">
            <UFormField label="School Year">
              <UInput v-model="filters.school_year" placeholder="2025-2026" class="w-full"/>
            </UFormField>

            <UFormField label="Semester">
              <USelectMenu
                v-model="filters.semester"
                :items="semesterOptions"
                value-key="value"
                placeholder="Select semester"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Department">
              <UInput v-model="filters.department" placeholder="BSIT" class="w-full" />
            </UFormField>

            <UFormField label="Search Faculty">
              <UInput v-model="filters.search" placeholder="Faculty name" class="w-full" />
            </UFormField>

            <div class="flex items-end gap-2">
              <UButton
                label="Search"
                icon="i-lucide-search"
                :loading="pending"
                @click="searchResults"
                block
              />

              <UButton
                label="Reset"
                color="neutral"
                variant="outline"
                icon="i-lucide-repeat"
                @click="resetFilters"
              block
              />
            </div>
            
          </div>
        </div>

        <!-- TABLE CARD -->
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div>
              <h2 class="text-lg font-semibold text-gray-800">
                Evaluation Results
              </h2>
              <p class="text-sm text-gray-500">
                Showing {{ evaluations.length }} of {{ total }} records
              </p>
            </div>
          </div>

          <div v-if="pending" class="py-12 text-center text-gray-500">
            Loading results...
          </div>

          <div v-else-if="!evaluations.length" class="py-12 text-center text-gray-500">
            No Dean to Faculty evaluation results found.
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 text-xs uppercase text-gray-600">
                <tr>
                  <th class="px-4 py-3 text-left">Faculty</th>
                  <th class="px-4 py-3 text-left">Department</th>
                  <th class="px-4 py-3 text-left">Evaluator</th>
                  <th class="px-4 py-3 text-left">School Year</th>
                  <th class="px-4 py-3 text-left">Semester</th>
                  <th class="px-4 py-3 text-center">Total</th>
                  <th class="px-4 py-3 text-center">Average</th>
                  <th class="px-4 py-3 text-center">Rating</th>
                  <th class="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="evaluation in evaluations"
                  :key="evaluation.id"
                  class="transition hover:bg-gray-50"
                >
                  <td class="px-4 py-3 font-medium text-gray-800">
                    {{ evaluation.teacher?.name || 'Unknown Faculty' }}
                  </td>

                  <td class="px-4 py-3 text-gray-600">
                    {{ evaluation.teacher?.department || evaluation.batch?.department || 'N/A' }}
                  </td>

                  <td class="px-4 py-3 text-gray-600">
                    {{ getEvaluatorName(evaluation) }}
                  </td>

                  <td class="px-4 py-3 text-gray-600">
                    {{ evaluation.batch?.school_year || 'N/A' }}
                  </td>

                  <td class="px-4 py-3 text-gray-600">
                    {{ evaluation.batch?.semester || 'N/A' }}
                  </td>

                  <td class="px-4 py-3 text-center font-semibold">
                    {{ evaluation.total_score || 0 }}
                  </td>

                  <td class="px-4 py-3 text-center font-semibold">
                    {{ Number(evaluation.average_score || 0).toFixed(2) }}
                  </td>

                  <td class="px-4 py-3 text-center">
                    <span
                      class="rounded-full px-2 py-1 text-xs font-semibold"
                      :class="ratingBadge(evaluation.average_score)"
                    >
                      {{ getRatingLabel(evaluation.average_score) }}
                    </span>
                  </td>

                  <td class="px-4 py-3 text-center">
                    <UButton
                      size="xs"
                      color="primary"
                      variant="soft"
                      icon="i-lucide-eye"
                      @click="openDetails(evaluation)"
                    >
                      View
                    </UButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- PAGINATION -->
          <div class="flex items-center justify-between border-t border-gray-200 px-5 py-4">
            <div class="text-sm text-gray-500">
              Page {{ page }} of {{ totalPages }}
            </div>

            <div class="flex items-center gap-2">
              <UButton
                label="Previous"
                color="neutral"
                variant="outline"
                :disabled="page <= 1"
                @click="prevPage"
              />

              <UButton
                label="Next"
                color="neutral"
                variant="outline"
                :disabled="page >= totalPages"
                @click="nextPage"
              />
            </div>
          </div>
        </div>

        <!-- DETAILS MODAL -->
        <UModal v-model:open="showDetails">
          <template #content>
            <div
              v-if="selectedEvaluation"
              class="max-h-[85vh] overflow-y-auto p-6"
            >
              <div class="mb-5">
                <h2 class="text-xl font-bold text-gray-800">
                  {{ selectedEvaluation.teacher?.name || 'Unknown Faculty' }}
                </h2>
                <p class="text-sm text-gray-500">
                  {{ selectedEvaluation.teacher?.department || selectedEvaluation.batch?.department || 'N/A' }}
                </p>
              </div>

              <div class="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div class="rounded-lg bg-gray-50 p-3 text-center">
                  <p class="text-xs text-gray-500">Total</p>
                  <p class="text-lg font-bold">
                    {{ selectedEvaluation.total_score || 0 }}
                  </p>
                </div>

                <div class="rounded-lg bg-gray-50 p-3 text-center">
                  <p class="text-xs text-gray-500">Average</p>
                  <p class="text-lg font-bold">
                    {{ Number(selectedEvaluation.average_score || 0).toFixed(2) }}
                  </p>
                </div>

                <div class="rounded-lg bg-gray-50 p-3 text-center">
                  <p class="text-xs text-gray-500">Rating</p>
                  <p class="text-lg font-bold">
                    {{ getRatingLabel(selectedEvaluation.average_score) }}
                  </p>
                </div>
              </div>

              <div class="mb-5 overflow-x-auto rounded-lg border border-gray-200">
                <table class="w-full text-sm">
                  <thead class="bg-gray-50 text-xs uppercase text-gray-600">
                    <tr>
                      <th class="px-3 py-2 text-left">Criteria</th>
                      <th class="px-3 py-2 text-center">Score</th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-gray-100">
                    <tr
                      v-for="item in formatResponses(selectedEvaluation.responses)"
                      :key="item.criteria_id"
                    >
                      <td class="px-3 py-2">
                        {{ item.statement }}
                      </td>

                      <td class="px-3 py-2 text-center font-bold">
                        {{ item.score }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="rounded-lg border border-gray-200">
                  <div class="border-b border-gray-200 bg-gray-50 px-3 py-2 font-bold">
                    1. Teacher's Greatest Strengths
                  </div>
                  <div class="min-h-20 p-3 text-sm">
                    {{ selectedEvaluation.strengths || 'N/A' }}
                  </div>
                </div>

                <div class="rounded-lg border border-gray-200">
                  <div class="border-b border-gray-200 bg-gray-50 px-3 py-2 font-bold">
                    2. In what ways could she/he be more effective?
                  </div>
                  <div class="min-h-20 p-3 text-sm">
                    {{ selectedEvaluation.effectiveness || 'N/A' }}
                  </div>
                </div>

                <div class="rounded-lg border border-gray-200">
                  <div class="border-b border-gray-200 bg-gray-50 px-3 py-2 font-bold">
                    3. Areas for Improvement
                  </div>
                  <div class="min-h-20 p-3 text-sm">
                    {{ selectedEvaluation.areas_for_improvement || 'N/A' }}
                  </div>
                </div>

                <div class="rounded-lg border border-gray-200">
                  <div class="border-b border-gray-200 bg-gray-50 px-3 py-2 font-bold">
                    4. Suggested Teaching Improvement Activities
                  </div>
                  <div class="min-h-20 p-3 text-sm">
                    {{ selectedEvaluation.suggested_activities || 'N/A' }}
                  </div>
                </div>

                <div class="rounded-lg border border-gray-200 md:col-span-2">
                  <div class="border-b border-gray-200 bg-gray-50 px-3 py-2 font-bold">
                    5. Overall Rating Explanation
                  </div>
                  <div class="min-h-20 p-3 text-sm">
                    {{ selectedEvaluation.comment || 'N/A' }}
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <UButton
                  color="neutral"
                  variant="outline"
                  @click="showDetails = false"
                >
                  Close
                </UButton>
              </div>
            </div>
          </template>
        </UModal>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
// @ts-nocheck
definePageMeta({
  middleware: ['auth']
})

const { $api } = useNuxtApp()

const pending = ref(false)
const evaluations = ref([])
const selectedEvaluation = ref(null)
const showDetails = ref(false)

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const filters = reactive({
  school_year: '',
  semester: '',
  department: '',
  search: ''
})

const semesterOptions = [
  { label: '1st Semester', value: '1st Semester' },
  { label: '2nd Semester', value: '2nd Semester' },
  { label: 'Summer', value: 'Summer' }
]

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value))
)

const getResults = async () => {
  pending.value = true

  try {
    const query: any = {
      'filters[batch][evaluation_type][code][$eq]': 'dean-to-faculty',

      'populate[teacher]': true,
      'populate[evaluator_user]': true,
      'populate[batch][populate][0]': 'evaluation_type',

      'sort[0]': 'createdAt:desc',

      'pagination[page]': page.value,
      'pagination[pageSize]': pageSize.value
    }

    if (filters.school_year) {
      query['filters[batch][school_year][$eq]'] = filters.school_year
    }

    if (filters.semester) {
      query['filters[batch][semester][$eq]'] = filters.semester
    }

    if (filters.department) {
      query['filters[batch][department][$eq]'] = filters.department
    }

    if (filters.search) {
      query['filters[teacher][name][$containsi]'] = filters.search
    }

    const res: any = await $api('/evaluations', { query })

    evaluations.value = res.data || []
    total.value = res.meta?.pagination?.total || 0
  } catch (error) {
    console.error(error)
    evaluations.value = []
    total.value = 0
  } finally {
    pending.value = false
  }
}

const searchResults = async () => {
  page.value = 1
  await getResults()
}

const resetFilters = async () => {
  filters.school_year = ''
  filters.semester = ''
  filters.department = ''
  filters.search = ''

  page.value = 1
  await getResults()
}

const prevPage = async () => {
  if (page.value > 1) {
    page.value--
    await getResults()
  }
}

const nextPage = async () => {
  if (page.value < totalPages.value) {
    page.value++
    await getResults()
  }
}

const openDetails = (evaluation: any) => {
  selectedEvaluation.value = evaluation
  showDetails.value = true
}

const getEvaluatorName = (evaluation: any) => {
  const user = evaluation.evaluator_user

  return (
    user?.user_info?.first_name && user?.user_info?.last_name
      ? `${user.user_info.first_name} ${user.user_info.last_name}`
      : user?.username || user?.email || 'N/A'
  )
}

const formatResponses = (responses: any) => {
  if (!responses) return []

  if (Array.isArray(responses)) {
    return responses.map((item: any) => ({
      criteria_id: item.criteria_id || item.id,
      statement: item.statement || `Criteria #${item.criteria_id || item.id}`,
      score: item.score
    }))
  }

  return Object.entries(responses).map(([criteriaId, score]) => ({
    criteria_id: criteriaId,
    statement: `Criteria #${criteriaId}`,
    score
  }))
}

const getRatingLabel = (average: number) => {
  const avg = Number(average)

  if (avg >= 3.5) return 'Excellent'
  if (avg >= 2.5) return 'Satisfactory'
  if (avg >= 1.5) return 'Fair'
  if (avg > 0) return 'Needs Improvement'

  return 'N/A'
}

const ratingBadge = (average: number) => {
  const avg = Number(average)

  if (avg >= 3.5) return 'bg-green-100 text-green-700'
  if (avg >= 2.5) return 'bg-blue-100 text-blue-700'
  if (avg >= 1.5) return 'bg-yellow-100 text-yellow-700'
  if (avg > 0) return 'bg-red-100 text-red-700'

  return 'bg-gray-100 text-gray-600'
}

onMounted(async () => {
  await getResults()
})
</script>