<template>
  <UDashboardPanel>
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

    <template #body>
      <div class="mx-auto w-full">
        <div class="mb-6 text-center">
          <h2 class="text-xl font-bold uppercase">
            St. Nicolas College of Business and Technology
          </h2>
          <p class="text-sm">
            MEL-VI Bldg., Jose Abad Santos Avenue, City of San Fernando Pampanga
          </p>
          <p class="text-sm">Tel. No.: (045) 455-0958</p>
          <h1 class="mt-3 text-2xl font-extrabold uppercase">
            Performance Evaluation Form
          </h1>
          <p class="font-medium">Student - Faculty</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <!-- LEFT SIDE -->
        <div class="h-fit rounded-lg border border-gray-300 p-4 lg:col-span-1">
          <div class="mb-3 flex items-center justify-between">
            <div class="font-bold">Assigned Teacher(s)</div>
            <div class="text-sm text-gray-500">
              {{ selectedTeacherIds.length }} selected
            </div>
          </div>

          <div v-if="pending" class="py-6 text-center">
            Loading teachers...
          </div>

          <div v-else-if="teacherCheckboxItems.length === 0" class="py-6 text-center text-gray-500">
            No assigned teachers found.
          </div>

          <div v-else>
            <UCheckboxGroup v-model="selectedTeacherIds" value-key="value" :items="teacherCheckboxItems" :ui="{
              fieldset: 'grid grid-cols-1 gap-3',
              item: 'rounded-lg border border-gray-300 p-4 hover:border-primary-500 transition'
            }">
              <template #label="{ item }">
                <div class="flex flex-col">
                  <span class="font-medium">{{ item.label }}</span>
                  <!-- <span v-if="item.description" class="text-xs text-gray-500">
                    {{ item.description }}
                  </span> -->
                </div>
              </template>
            </UCheckboxGroup>
          </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="space-y-8 lg:col-span-3">
          <div class="mb-4 border rounded-lg border-gray-300 p-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <UFormField label="Semester">
                <USelectMenu v-model="form.semester" :items="semesterOptions" value-key="value"
                  placeholder="Select semester" class="w-full" />
              </UFormField>

              <UFormField label="School Year">
                <UInput v-model="form.schoolYear" placeholder="2025-2026" class="w-full" />
              </UFormField>

              <UFormField label="Date">
                <UInput v-model="form.date" type="date" class="w-full" />
              </UFormField>
            </div>
          </div>

          <div v-if="!pending && selectedTeacherIds.length"
            class="flex items-center justify-between rounded-lg border border-gray-300 p-4">
            <div class="font-semibold">
              Selected Teachers: {{ selectedTeacherIds.length }}
            </div>

            <div class="flex items-center gap-2">
              <UButton color="neutral" variant="outline" :disabled="currentPage === 1" @click="prevPage">
                Previous
              </UButton>

              <span class="text-sm font-medium">
                Page {{ currentPage }} of {{ totalPages }}
              </span>

              <UButton color="neutral" variant="outline" :disabled="currentPage === totalPages" @click="nextPage">
                Next
              </UButton>
            </div>
          </div>

          <div v-if="error" class="py-10 text-center text-red-500">
            Failed to load form data.
          </div>

          <div v-else-if="!pending && !selectedTeacherIds.length"
            class="rounded-lg border border-gray-300 p-4 py-10 text-center text-gray-500">
            Please select at least one teacher to start evaluation.
          </div>

          <div v-else-if="!pending" class="space-y-8">
            <div v-for="evaluation in paginatedEvaluations" :key="evaluation.teacherId"
              class="rounded-xl border border-gray-300 p-10">
              <div class="mb-4">
                <h3 class="text-lg font-bold">Teacher Evaluation</h3>
                <p class="text-sm text-gray-600">
                  {{ teacherMap[String(evaluation.teacherId)]?.name || 'Unknown Teacher' }}
                </p>
              </div>

              <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <UFormField label="Teacher">
                  <UInput :model-value="teacherMap[String(evaluation.teacherId)]?.name || ''" disabled class="w-full" />
                </UFormField>

                <UFormField label="Subject">
                  <USelectMenu v-model="evaluation.subjectId" value-key="value"
                    :items="getSubjectOptions(evaluation.teacherId)" placeholder="Select subject" class="w-full" />
                </UFormField>
              </div>

              <div class="mb-4 text-center">
                <p class="font-semibold">
                  Please rate the teacher on each of the items listed below.
                </p>

                <div class="mt-2 flex flex-wrap justify-center gap-6 text-sm font-bold">
                  <span>5. Outstanding</span>
                  <span>4. Excellent</span>
                  <span>3. Satisfactory</span>
                  <span>2. Fair</span>
                  <span>1. Poor</span>
                </div>
              </div>

              <div class="space-y-4">
                <div v-for="section in sections" :key="section.id" class="overflow-x-auto">
                  <table class="w-full border-collapse border border-gray-500 text-sm">
                    <thead>
                      <tr>
                        <th colspan="7"
                          class="border border-gray-500 bg-gray-100 px-3 py-2 text-left text-base font-bold">
                          {{ section.title }}
                        </th>
                      </tr>

                      <tr class="bg-gray-50">
                        <th colspan="2" class="border border-gray-500 px-3 py-2 text-left">
                          Criteria
                        </th>
                        <th class="w-12 border border-gray-500 px-2 py-2 text-center">5</th>
                        <th class="w-12 border border-gray-500 px-2 py-2 text-center">4</th>
                        <th class="w-12 border border-gray-500 px-2 py-2 text-center">3</th>
                        <th class="w-12 border border-gray-500 px-2 py-2 text-center">2</th>
                        <th class="w-12 border border-gray-500 px-2 py-2 text-center">1</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="criterion in section.evaluation_criteria" :key="criterion.id">
                        <td class="border border-gray-500 px-3 py-2 text-center">
                          {{ criterion.order }}
                        </td>

                        <td class="border border-gray-500 px-3 py-2">
                          {{ criterion.statement }}
                        </td>

                        <td v-for="score in [5, 4, 3, 2, 1]" :key="score" class="border border-gray-500 text-center">
                          <input v-model="evaluation.responses[criterion.id]" :value="Number(score)" type="radio"
                            class="h-4 w-4">
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="border border-gray-500">
                  <div class="border-b border-gray-500 bg-gray-100 px-3 py-2 font-bold">
                    Strongest and Weakest points of the teacher:
                  </div>

                  <div class="p-3">
                    <UTextarea v-model="evaluation.comment" :rows="6" class="w-full" />
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

            <div v-if="selectedTeacherIds.length > 1" class="flex items-center justify-center gap-2">
              <UButton color="neutral" variant="outline" :disabled="currentPage === 1" @click="prevPage">
                Previous
              </UButton>

              <span class="text-sm font-medium">
                Page {{ currentPage }} of {{ totalPages }}
              </span>

              <UButton color="neutral" variant="outline" :disabled="currentPage === totalPages" @click="nextPage">
                Next
              </UButton>
            </div>

            <div v-if="submitError" class="text-sm font-medium text-red-600">
              {{ submitError }}
            </div>

            <div v-if="submitSuccess" class="text-sm font-medium text-green-600">
              {{ submitSuccess }}
            </div>

            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="outline" @click="resetForm">
                Reset
              </UButton>

              <UButton :loading="submitLoading" :disabled="!isFormValid" @click="submitEvaluation">
                Submit All Evaluations
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
// @ts-nocheck
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Student']
})

const { $api } = useNuxtApp()
const { user } = useAuth()
const toast = useToast()

type Teacher = {
  id: number
  name: string
  department?: string
  email?: string
  assigned_subjects?: any[]
}

type EvaluationFormItem = {
  teacherId: number
  subjectId: number | null
  comment: string
  responses: Record<number, number>
}

const sections = ref<any[]>([])
const teachers = ref<any[]>([])

const pending = ref(true)
const error = ref<any>(null)

const submitLoading = ref(false)
const submitError = ref('')
const submitSuccess = ref('')

const selectedTeacherIds = ref<number[]>([])
const currentPage = ref(1)
const itemsPerPage = 1

const evaluationType = ref<any>(null)
const existingEvaluations = ref([])

const semesterOptions = [
  { label: '1st Semester', value: '1st Semester' },
  { label: '2nd Semester', value: '2nd Semester' },
  { label: 'Summer', value: 'Summer' }
]

const form = reactive({
  semester: '',
  schoolYear: '',
  //courseYearLevel: '',
  date: new Date().toISOString().slice(0, 10),
  evaluations: [] as EvaluationFormItem[]
})

const teacherCheckboxItems = computed(() =>
  teachers.value.map((teacher: any) => {
    const alreadyEvaluated = existingEvaluations.value.some(
      (evaluation: any) => evaluation.teacher?.id === teacher.id
    )

    return {
      label: alreadyEvaluated
        ? `${teacher.name} (Already Evaluated)`
        : teacher.name,
      description: teacher.department || '',
      value: teacher.id,
      disabled: alreadyEvaluated
    }
  })
)

const teacherMap = computed(() => {
  const map: Record<string, Teacher> = {}

  teachers.value.forEach((teacher: any) => {
    map[String(teacher.id)] = teacher
  })

  return map
})

const allCriteria = computed(() =>
  sections.value.flatMap((section: any) => section.evaluation_criteria || [])
)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(form.evaluations.length / itemsPerPage))
)

const paginatedEvaluations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return form.evaluations.slice(start, end)
})

const createEvaluation = (teacherId: number | string) => ({
  teacherId: Number(teacherId),
  subjectId: null,
  comment: '',
  responses: {} as Record<number, number>
})

const syncEvaluationsFromSelection = () => {
  const existingMap = new Map(
    form.evaluations.map((evaluation) => [
      Number(evaluation.teacherId),
      evaluation
    ])
  )

  form.evaluations = selectedTeacherIds.value.map((teacherId) => {
    const numericId = Number(teacherId)
    return existingMap.get(numericId) || createEvaluation(numericId)
  })

  currentPage.value = 1
}

watch(
  selectedTeacherIds,
  () => {
    syncEvaluationsFromSelection()
  },
  { deep: true }
)

const getSubjectOptions = (teacherId: number | string) => {
  const teacher = teacherMap.value[String(teacherId)]

  return (teacher?.assigned_subjects || []).map((subject: any) => {
    const alreadyEvaluated = existingEvaluations.value.some((evaluation: any) =>
      evaluation.teacher?.id === Number(teacherId) &&
      evaluation.subject?.id === subject.id
    )

    const courseCode = subject.course?.code?.toUpperCase()
    const subjectLabel = subject.code
      ? `${subject.code} - ${subject.name}`
      : subject.name

    const label = courseCode
      ? `${subjectLabel} - ${courseCode}`
      : subjectLabel

    return {
      label: alreadyEvaluated
        ? `${label} (Already Evaluated)`
        : label,
      value: subject.id,
      disabled: alreadyEvaluated
    }
  })
}
const getAnsweredCount = (evaluation: EvaluationFormItem) =>
  Object.keys(evaluation.responses).length

const getTotalScore = (evaluation: EvaluationFormItem) =>
  Object.values(evaluation.responses).reduce(
    (sum, score) => sum + Number(score),
    0
  )

const getAverageScore = (evaluation: EvaluationFormItem) => {
  const answered = getAnsweredCount(evaluation)
  if (!answered) return 0

  return Number((getTotalScore(evaluation) / answered).toFixed(2))
}

const isEvaluationComplete = (evaluation: EvaluationFormItem) =>
  Boolean(
    evaluation.teacherId &&
    evaluation.subjectId &&
    allCriteria.value.length > 0 &&
    getAnsweredCount(evaluation) === allCriteria.value.length
  )

const isFormValid = computed(() => {
  if (!form.semester || !form.schoolYear) {
    return false
  }

  if (!form.evaluations.length) return false

  return form.evaluations.every((evaluation) =>
    isEvaluationComplete(evaluation)
  )
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const nextPage = () => goToPage(currentPage.value + 1)
const prevPage = () => goToPage(currentPage.value - 1)

const getEvaluationType = async () => {
  const res = await $api('/evaluation-types', {
    query: {
      'filters[code][$eq]': 'student-faculty',
      'pagination[pageSize]': 1
    }
  })

  evaluationType.value = res.data?.[0] || null
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

const getTeachers = async () => {
  if (!user.value?.id) return

  const res = await $api('/students', {
    query: {
      'filters[user][id][$eq]': user.value.id,
      // 'populate[assigned_teachers][populate][assigned_subjects][populate][course]': true,
      'populate[assigned_teachers][populate][assigned_subjects][populate][0]': 'course',
      'pagination[pageSize]': 1
    }
  })

  const student = res.data?.[0]

  teachers.value = student?.assigned_teachers || []

  selectedTeacherIds.value = teachers.value.map((teacher: any) => teacher.id)
  syncEvaluationsFromSelection()
}

// Get Existing Evaluations
const getExistingEvaluations = async () => {
  if (!user.value?.id || !form.semester || !form.schoolYear) return

  const res = await $api('/evaluations', {
    query: {
      'filters[evaluator_user][id][$eq]': user.value.id,
      'filters[batch][semester][$eq]': form.semester,
      'filters[batch][school_year][$eq]': form.schoolYear,
      'populate[subject]': true,
      'filters[batch][evaluation_type][code][$eq]': 'student-faculty',
      'populate[teacher]': true,
      'pagination[pageSize]': 300
    }
  })

  existingEvaluations.value = res.data || []
}

// Watch semester and school year
watch(
  () => [form.semester, form.schoolYear],
  async () => {
    selectedTeacherIds.value = []
    form.evaluations = []

    if (form.semester && form.schoolYear) {
      await getExistingEvaluations()
    }
  }
)

const loadData = async () => {
  try {
    pending.value = true
    error.value = null

    await getEvaluationType()

    if (!evaluationType.value) {
      submitError.value = 'Student-Faculty evaluation type is not configured.'
      return
    }

    await Promise.all([
      getSections(),
      getTeachers()
    ])
  } catch (err) {
    console.log(err)
    error.value = err
  } finally {
    pending.value = false
  }
}

const submitEvaluation = async () => {
  submitError.value = ''
  submitSuccess.value = ''

  if (!evaluationType.value?.id) {
    submitError.value = 'Evaluation type not found.'
    return
  }

  if (!form.semester || !form.schoolYear) {
    submitError.value = 'Please complete semester and school year.'
    return
  }

  // if (!form.courseYearLevel) {
  //   submitError.value = 'Please complete course and year level.'
  //   return
  // }

  if (!form.evaluations.length) {
    submitError.value = 'Please add at least one teacher evaluation.'
    return
  }

  const hasIncomplete = form.evaluations.some((evaluation) =>
    !isEvaluationComplete(evaluation)
  )

  if (hasIncomplete) {
    submitError.value = 'Please complete all teacher evaluations before submitting.'
    return
  }

  try {
    submitLoading.value = true

    const evaluations = form.evaluations.map((evaluation) => ({
      teacher: evaluation.teacherId,
      subject: evaluation.subjectId,
      comment: evaluation.comment,
      responses: evaluation.responses
    }))

    await $api('/submit-multiple-evaluations', {
      method: 'POST',
      body: {
        evaluation_type: evaluationType.value.id,
        semester: form.semester,
        school_year: form.schoolYear,
        date: form.date,
        // course: form.courseYearLevel,
        evaluations
      }
    })

    toast.add({
      title: 'Success',
      description: 'Evaluation submitted successfully.',
      color: 'success'
    })

    submitSuccess.value = 'Evaluation submitted successfully.'
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

const resetForm = () => {
  form.semester = ''
  form.schoolYear = ''
  //form.courseYearLevel = ''
  form.evaluations = []
  selectedTeacherIds.value = []
  currentPage.value = 1
  submitError.value = ''
  submitSuccess.value = ''
}

watch(
  user,
  async (val) => {
    if (val?.id) {
      await loadData()
    }
  },
  { immediate: true }
)
</script>