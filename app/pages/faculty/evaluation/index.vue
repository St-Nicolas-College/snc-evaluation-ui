<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #title>
          <span class="text-sm text-gray-500 uppercase">
            Peers Evaluation Form
          </span>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full rounded-lg bg-white p-6 shadow">
        <div class="mb-6 text-center">
          <h2 class="text-xl font-bold uppercase">
            St. Nicolas College of Business and Technology
          </h2>
          <p class="text-sm">
            MEL-VI Bldg., Jose Abad Santos Avenue, City of San Fernando Pampanga
          </p>
          <p class="text-sm">Tel. No.: 861-3181</p>
          <h1 class="mt-3 text-2xl font-extrabold uppercase">
            Peers Evaluation Form
          </h1>
          <p class="font-medium">Faculty - Dean/Coordinator</p>
        </div>

        <div class="mb-4 border border-gray-400 p-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
            <UFormField label="Semester">
              <USelectMenu
                v-model="form.semester"
                :items="semesterOptions"
                value-key="value"
                placeholder="Select semester"
                class="w-full"
              />
            </UFormField>

            <UFormField label="School Year">
              <UInput v-model="form.school_year" class="w-full" />
            </UFormField>

            <UFormField label="Date">
              <UInput v-model="form.date" type="date" class="w-full" />
            </UFormField>

            <UFormField label="Department">
              <UInput v-model="form.department" class="w-full" readonly />
            </UFormField>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <!-- LEFT SIDE -->
          <div class="lg:col-span-1">
            <div class="rounded-lg border border-gray-400 p-4">
              <div class="mb-3 flex items-center justify-between">
                <div class="font-bold">Select Dean/Coordinator</div>
                <div class="text-sm text-gray-500">
                  {{ selectedTargetIds.length }} selected
                </div>
              </div>

              <div v-if="pending" class="py-6 text-center">
                Loading...
              </div>

              <div v-else class="overflow-y-auto pr-2">
                <UCheckboxGroup
                  v-model="selectedTargetIds"
                  value-key="value"
                  :items="targetOptions"
                  :ui="{
                    fieldset: 'grid grid-cols-1 gap-3',
                    item: 'rounded-lg border border-gray-300 p-4 hover:border-primary-500 transition'
                  }"
                >
                  <template #label="{ item }">
                    <div class="flex flex-col">
                      <span class="font-medium">{{ item.label }}</span>
                    </div>
                  </template>
                </UCheckboxGroup>
              </div>
            </div>
          </div>

          <!-- RIGHT SIDE -->
          <div class="lg:col-span-3">
            <div v-if="pending" class="py-10 text-center text-gray-500">
              Loading...
            </div>

            <div
              v-else-if="!selectedTargetIds.length"
              class="py-10 text-center text-gray-500"
            >
              Please select at least one dean/coordinator to start evaluation.
            </div>

            <div v-else class="space-y-8">
              <div class="mb-4 flex items-center justify-between">
                <div class="font-semibold">
                  Selected: {{ selectedTargetIds.length }}
                </div>

                <div class="flex items-center gap-2">
                  <UButton
                    color="neutral"
                    variant="outline"
                    :disabled="currentPage === 1"
                    @click="prevPage"
                  >
                    Previous
                  </UButton>

                  <span class="text-sm font-medium">
                    Page {{ currentPage }} of {{ totalPages }}
                  </span>

                  <UButton
                    color="neutral"
                    variant="outline"
                    :disabled="currentPage === totalPages"
                    @click="nextPage"
                  >
                    Next
                  </UButton>
                </div>
              </div>

              <div
                v-for="evaluation in paginatedEvaluations"
                :key="evaluation.deanCoordinatorId"
                class="rounded-lg border border-gray-400 p-4"
              >
                <div class="mb-4">
                  <h3 class="text-lg font-bold">Dean/Coordinator Evaluation</h3>
                  <p class="text-sm text-gray-600">
                    {{ targetMap[String(evaluation.deanCoordinatorId)]?.name || 'Unknown' }}
                  </p>
                </div>

                <div class="mb-4 text-center">
                  <p class="font-semibold">
                    Please rate the Dean/Coordinator on each of the items listed below.
                  </p>

                  <div class="mt-2 flex flex-wrap justify-center gap-6 text-sm font-bold">
                    <span>4 - Superior</span>
                    <span>3 - Average</span>
                    <span>2 - Fair</span>
                    <span>1 - Needs Improvement</span>
                  </div>
                </div>

                <div class="space-y-4">
                  <div
                    v-for="section in sections"
                    :key="section.id"
                    class="overflow-x-auto"
                  >
                    <table class="w-full border-collapse border border-gray-500 text-sm">
                      <thead>
                        <tr>
                          <th
                            colspan="6"
                            class="border border-gray-500 bg-gray-100 px-3 py-2 text-left text-base font-bold"
                          >
                            {{ section.title }}
                          </th>
                        </tr>

                        <tr class="bg-gray-50">
                          <th colspan="2" class="border border-gray-500 px-3 py-2 text-left">
                            Criteria
                          </th>
                          <th class="w-12 border border-gray-500 px-2 py-2 text-center">4</th>
                          <th class="w-12 border border-gray-500 px-2 py-2 text-center">3</th>
                          <th class="w-12 border border-gray-500 px-2 py-2 text-center">2</th>
                          <th class="w-12 border border-gray-500 px-2 py-2 text-center">1</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="criterion in section.evaluation_criteria"
                          :key="criterion.id"
                        >
                          <td class="border px-3 py-2 text-left">
                            {{ criterion.order }}
                          </td>

                          <td class="border border-gray-500 px-3 py-2">
                            {{ criterion.statement }}
                          </td>

                          <td
                            v-for="score in [4, 3, 2, 1]"
                            :key="score"
                            class="border border-gray-500 text-center"
                          >
                            <input
                              v-model="evaluation.responses[criterion.id]"
                              :value="Number(score)"
                              :name="`dean-${evaluation.deanCoordinatorId}-criteria-${criterion.id}`"
                              type="radio"
                              class="h-4 w-4"
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div class="border border-gray-500">
                      <div class="border-b border-gray-500 bg-gray-100 px-3 py-2 font-bold">
                        Strengths
                      </div>
                      <div class="p-3">
                        <UTextarea v-model="evaluation.strengths" :rows="6" class="w-full" />
                      </div>
                    </div>

                    <div class="border border-gray-500">
                      <div class="border-b border-gray-500 bg-gray-100 px-3 py-2 font-bold">
                        Areas for Improvements
                      </div>
                      <div class="p-3">
                        <UTextarea v-model="evaluation.areas_for_improvement" :rows="6" class="w-full" />
                      </div>
                    </div>
                  </div>

                  <div class="border border-gray-500">
                    <div class="border-b border-gray-500 bg-gray-100 px-3 py-2 font-bold">
                      Additional Comment
                    </div>
                    <div class="p-3">
                      <UTextarea v-model="evaluation.comment" :rows="4" class="w-full" />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div class="border border-gray-500 p-3">
                      <div class="text-sm font-semibold">Answered Items</div>
                      <div class="text-lg font-bold">
                        {{ getAnsweredCount(evaluation) }}
                      </div>
                    </div>

                    <div class="border border-gray-500 p-3">
                      <div class="text-sm font-semibold">Total Score</div>
                      <div class="text-lg font-bold">
                        {{ getTotalScore(evaluation) }}
                      </div>
                    </div>

                    <div class="border border-gray-500 p-3">
                      <div class="text-sm font-semibold">Average Score</div>
                      <div class="text-lg font-bold">
                        {{ getAverageScore(evaluation) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="submitError" class="text-sm font-medium text-red-600">
                {{ submitError }}
              </div>

              <div class="flex justify-end gap-2">
                <UButton color="neutral" variant="outline" @click="resetForm">
                  Reset
                </UButton>

                <UButton
                  :loading="submitLoading"
                  :disabled="!isFormValid"
                  @click="submitEvaluation"
                >
                  Submit All Evaluations
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
// @ts-nocheck
const { $api } = useNuxtApp()
const { user } = useAuth()
const toast = useToast()

const pending = ref(true)
const submitLoading = ref(false)
const submitError = ref('')

const selectedTargetIds = ref<number[]>([])
const currentPage = ref(1)
const itemsPerPage = 2

const targets = ref([])
const sections = ref([])
const evaluationType = ref(null)
const existingEvaluations = ref([])
const loggedInTeacher = ref(null)
const departmentId = ref<number | null>(null)

const semesterOptions = [
  { label: '1st Semester', value: '1st Semester' },
  { label: '2nd Semester', value: '2nd Semester' },
  { label: 'Summer', value: 'Summer' }
]

const form = reactive({
  semester: '',
  school_year: '',
  date: new Date().toISOString().slice(0, 10),

  // IMPORTANT: this stays STRING because evaluation-batch.department is string
  department: '',

  evaluations: [] as any[]
})

const targetOptions = computed(() =>
  targets.value.map((item: any) => {
    const alreadyEvaluated = existingEvaluations.value.some(
      (evaluation: any) => evaluation.dean_coordinator?.id === item.id
    )

    return {
      label: alreadyEvaluated
        ? `${item.name} (Already Evaluated)`
        : item.name,
      value: item.id,
      disabled: alreadyEvaluated
    }
  })
)

const targetMap = computed(() => {
  const map: Record<string, any> = {}

  targets.value.forEach((item: any) => {
    map[String(item.id)] = item
  })

  return map
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(form.evaluations.length / itemsPerPage))
)

const paginatedEvaluations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return form.evaluations.slice(start, start + itemsPerPage)
})

const createEvaluation = (deanCoordinatorId: number | string) => ({
  deanCoordinatorId: Number(deanCoordinatorId),
  strengths: '',
  areas_for_improvement: '',
  comment: '',
  responses: {} as Record<number, number>
})

const syncEvaluationsFromSelection = () => {
  const existingMap = new Map(
    form.evaluations.map((evaluation) => [
      Number(evaluation.deanCoordinatorId),
      evaluation
    ])
  )

  form.evaluations = selectedTargetIds.value.map((id) => {
    const numericId = Number(id)
    return existingMap.get(numericId) || createEvaluation(numericId)
  })

  currentPage.value = 1
}

watch(selectedTargetIds, () => {
  syncEvaluationsFromSelection()
}, { deep: true })

const filteredCriteria = computed(() =>
  sections.value.flatMap((section: any) => section.evaluation_criteria || [])
)

const totalCriteriaCount = computed(() => filteredCriteria.value.length)

const getAnsweredCount = (evaluation: any) =>
  Object.keys(evaluation.responses).length

const getTotalScore = (evaluation: any) =>
  Object.values(evaluation.responses).reduce(
    (sum: number, score: any) => sum + Number(score),
    0
  )

const getAverageScore = (evaluation: any) => {
  const answered = getAnsweredCount(evaluation)
  if (!answered) return 0

  return Number((getTotalScore(evaluation) / answered).toFixed(2))
}

const isEvaluationComplete = (evaluation: any) =>
  evaluation.deanCoordinatorId &&
  totalCriteriaCount.value > 0 &&
  getAnsweredCount(evaluation) === totalCriteriaCount.value

const isFormValid = computed(() => {
  if (!form.semester || !form.school_year || !form.date || !form.department) return false
  if (!form.evaluations.length) return false

  return form.evaluations.every((evaluation) => isEvaluationComplete(evaluation))
})

const getEvaluationType = async () => {
  const res = await $api('/evaluation-types', {
    query: {
      'filters[code][$eq]': 'faculty-dean-coordinator',
      'pagination[pageSize]': 1
    }
  })

  evaluationType.value = res.data?.[0] || null
}

const getLoggedInTeacher = async () => {
  if (!user.value?.id) return null

  const res = await $api('/teachers', {
    query: {
      'filters[user][id][$eq]': user.value.id,
      'populate[department]': true,
      'populate[user][populate][0]': 'role',
      'pagination[pageSize]': 1
    }
  })

  loggedInTeacher.value = res.data?.[0] || null

  departmentId.value = loggedInTeacher.value?.department?.id || null
  form.department = loggedInTeacher.value?.department?.name || ''

  return loggedInTeacher.value
}

const getExistingEvaluations = async () => {
  if (!user.value?.id || !form.semester || !form.school_year) return

  const res = await $api('/evaluations', {
    query: {
      'filters[evaluator_user][id][$eq]': user.value.id,
      'filters[batch][semester][$eq]': form.semester,
      'filters[batch][school_year][$eq]': form.school_year,
      'filters[batch][evaluation_type][code][$eq]': 'faculty-dean-coordinator',
      'populate[dean_coordinator]': true,
      'pagination[pageSize]': 100
    }
  })

  existingEvaluations.value = res.data || []
}

watch(
  () => [form.semester, form.school_year],
  async () => {
    selectedTargetIds.value = []
    form.evaluations = []

    if (form.semester && form.school_year) {
      await getExistingEvaluations()
    }
  }
)

const getTargets = async () => {
  const teacherProfile = loggedInTeacher.value || await getLoggedInTeacher()

  if (!teacherProfile?.department?.id) {
    targets.value = []
    return
  }

  const res = await $api('/teachers', {
    query: {
      'populate[user][populate][0]': 'role',
      'populate[department]': true,

      // only Dean role
      'filters[user][role][name][$eq]': 'Dean',

      // same department as logged-in faculty
      'filters[department][id][$eq]': teacherProfile.department.id,

      'sort[0]': 'name:asc',
      'pagination[pageSize]': 100
    }
  })

  targets.value = res.data || []
}

const getSections = async () => {
  if (!evaluationType.value?.documentId) return

  const res = await $api('/evaluation-sections', {
    query: {
      'filters[evaluation_type][documentId][$eq]': evaluationType.value.documentId,
      'populate[evaluation_criteria][sort][0]': 'order:asc',
      'populate[evaluation_type]': true,
      'sort[0]': 'order:asc',
      'pagination[pageSize]': 100
    }
  })

  sections.value = res.data || []
}

const resetForm = () => {
  form.semester = ''
  form.school_year = ''
  form.date = new Date().toISOString().slice(0, 10)
  form.department = loggedInTeacher.value?.department?.name || ''

  form.evaluations = []
  selectedTargetIds.value = []
  currentPage.value = 1
  submitError.value = ''
}

const submitEvaluation = async () => {
  try {
    if (!evaluationType.value?.id) {
      alert('Evaluation type not found.')
      return
    }

    if (!isFormValid.value) {
      alert('Please complete all required fields.')
      return
    }

    submitLoading.value = true
    submitError.value = ''

    const evaluations = form.evaluations.map((evaluation) => ({
      dean_coordinator: evaluation.deanCoordinatorId,
      strengths: evaluation.strengths,
      areas_for_improvement: evaluation.areas_for_improvement,
      comment: evaluation.comment,
      responses: evaluation.responses
    }))

    await $api('/submit-multiple-evaluations', {
      method: 'POST',
      body: {
        evaluation_type: evaluationType.value.id,
        semester: form.semester,
        school_year: form.school_year,
        date: form.date,

        // IMPORTANT: string department name
        department: form.department,

        evaluations
      }
    })

    toast.add({
      title: 'Success',
      description: 'Faculty to Dean/Coordinator evaluation submitted successfully.',
      color: 'success'
    })

    await getExistingEvaluations()
    resetForm()
  } catch (err: any) {
    submitError.value =
      err?.data?.error?.message ||
      err?.data?.message ||
      'Failed to submit evaluations.'

    console.log(err)
  } finally {
    submitLoading.value = false
  }
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

onMounted(async () => {
  try {
    pending.value = true

    await getEvaluationType()

    if (!evaluationType.value) {
      alert('Evaluation type not configured in backend.')
      return
    }

    await getLoggedInTeacher()

    await Promise.all([
      getTargets(),
      getSections()
    ])
  } finally {
    pending.value = false
  }
})
</script>