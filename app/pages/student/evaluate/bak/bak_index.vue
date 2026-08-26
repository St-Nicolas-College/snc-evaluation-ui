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

      <div class="mx-auto w-full max-w-[1600px] bg-white p-6 shadow">
      <div class="mb-6 text-center">
        <h2 class="text-xl font-bold uppercase">St. Nicolas College of Business and Technology</h2>
        <p class="text-sm">MEL-VI Bldg., Jose Abad Santos Avenue, City of San Fernando Pampanga</p>
        <p class="text-sm">Tel. No.: (045) 455-0958</p>
        <h1 class="mt-3 text-2xl font-extrabold uppercase">Performance Evaluation Form</h1>
        <p class="font-medium">Student - Faculty</p>
      </div>

      <div class="mb-4 border border-gray-400 p-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <UFormField label="Semester">
            <UInput v-model="form.semester" />
          </UFormField>

          <UFormField label="School Year">
            <UInput v-model="form.schoolYear" />
          </UFormField>

          <UFormField label="Date">
            <UInput v-model="form.date" type="date" />
          </UFormField>

          <UFormField label="Course & Year Level" class="md:col-span-2">
            <UInput v-model="form.courseYearLevel" />
          </UFormField>

          <UFormField label="Days & Time">
            <UInput v-model="form.daysTime" />
          </UFormField>
        </div>
      </div>

      <div class="mb-6 border border-gray-400 p-4">
        <div class="mb-3 flex items-center justify-between">
          <div class="font-bold">Select Teacher(s)</div>
          <div class="text-sm text-gray-500">
            {{ selectedTeacherIds.length }} selected
          </div>
        </div>

        <div v-if="pending" class="py-6 text-center">
          Loading teachers...
        </div>

        <div v-else>
          <UCheckboxGroup
            v-model="selectedTeacherIds"
            value-key="value"
            :items="teacherCheckboxItems"
            :ui="{
              fieldset: 'grid grid-cols-1 gap-3 md:grid-cols-2',
              item: 'rounded-lg border border-gray-300 p-4 hover:border-primary-500 transition'
            }"
          >
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

      <div v-if="!pending && selectedTeacherIds.length" class="mb-4 flex items-center justify-between">
        <div class="font-semibold">
          Selected Teachers: {{ selectedTeacherIds.length }}
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

      <div v-if="error" class="py-10 text-center text-red-500">
        Failed to load form data.
      </div>

      <div v-else-if="!pending && !selectedTeacherIds.length" class="py-10 text-center text-gray-500">
        Please select at least one teacher to start evaluation.
      </div>

      <div v-else-if="!pending" class="space-y-8">
        <div
          v-for="evaluation in paginatedEvaluations"
          :key="evaluation.teacherId"
          class="border border-gray-400 p-4"
        >
          <div class="mb-4">
            <h3 class="text-lg font-bold">Teacher Evaluation</h3>
            <p class="text-sm text-gray-600">
              {{ teacherMap[evaluation.teacherId]?.name || 'Unknown Teacher' }}
            </p>
          </div>

          <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <UFormField label="Teacher">
              <UInput :model-value="teacherMap[evaluation.teacherId]?.name || ''" disabled />
            </UFormField>

            <UFormField label="Subject">
              <USelectMenu
                v-model="evaluation.subjectId"
                value-key="value"
                :items="subjectOptions"
                placeholder="Select subject"
              />
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
            <div
              v-for="section in sections"
              :key="section.id"
              class="overflow-x-auto"
            >
              <table class="w-full border-collapse border border-gray-500 text-sm">
                <thead>
                  <tr>
                    <th colspan="7" class="border border-gray-500 bg-gray-100 px-3 py-2 text-left text-base font-bold">
                      {{ section.title }}
                    </th>
                  </tr>
                  <tr class="bg-gray-50">
                    <!-- <th>#</th> -->
                    <th colspan="2" class="border border-gray-500 px-3 py-2 text-left">Criteria</th>
                    <th class="border border-gray-500 px-2 py-2 text-center w-12">5</th>
                    <th class="border border-gray-500 px-2 py-2 text-center w-12">4</th>
                    <th class="border border-gray-500 px-2 py-2 text-center w-12">3</th>
                    <th class="border border-gray-500 px-2 py-2 text-center w-12">2</th>
                    <th class="border border-gray-500 px-2 py-2 text-center w-12">1</th>
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
                      <!-- {{ criterion.order }}. {{ criterion.statement }} -->
                      {{ criterion.statement }}
                    </td>

                    <td
                      v-for="score in [5, 4, 3, 2, 1]"
                      :key="score"
                      class="border border-gray-500 text-center"
                    >
                      <input
                        v-model="evaluation.responses[criterion.id]"
                        :value="score"
                        
                        type="radio"
                        class="h-4 w-4"
                      >
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
                <UTextarea
                  v-model="evaluation.comment"
                  :rows="6"
                  class="w-full"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div class="border border-gray-500 p-3">
                <div class="text-sm font-semibold">Answered Items</div>
                <div class="text-lg font-bold">{{ getAnsweredCount(evaluation) }}</div>
              </div>

              <div class="border border-gray-500 p-3">
                <div class="text-sm font-semibold">Total Score</div>
                <div class="text-lg font-bold">{{ getTotalScore(evaluation) }}</div>
              </div>

              <div class="border border-gray-500 p-3">
                <div class="text-sm font-semibold">Average Score</div>
                <div class="text-lg font-bold">{{ getAverageScore(evaluation) }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedTeacherIds.length > 2" class="flex items-center justify-center gap-2">
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
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
//@ts-nocheck
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Student']
})
//@ts-nocheck
const { $api } = useNuxtApp();
const toast = useToast();

/* --------------------------
STATE
---------------------------*/

type Teacher = {
  id: number
  name: string
  department?: string
  email?: string
}

type Subject = {
  id: number
  name?: string
  code?: string
  title?: string
}

type Criterion = {
  id: number
  statement: string
  order: number
}

type Section = {
  id: number
  title: string
  order: number
  evaluation_criterias: Criterion[]
}

type EvaluationFormItem = {
  teacherId: number
  subjectId: number | null
  comment: string
  responses: Record<number, number>
}


const sections = ref<any[]>([])
const teachers = ref<any[]>([])
const subjects = ref<any[]>([])

const pending = ref(true)
const error = ref<any>(null)
const submitLoading = ref(false)
const submitError = ref("")
const submitSuccess = ref("")

const selectedTeacherIds = ref<number[]>([])
const currentPage = ref(1)
const itemsPerPage = 1

const form = reactive({
  semester: '',
  schoolYear: '',
  date: '',
  courseYearLevel: '',
  daysTime: '',
  evaluations: [] as EvaluationFormItem[]
})


// const teacherOptions = computed(() =>
//   teachers.value.map((teacher: any) => ({
//     label: teacher.name,
//     value: teacher.id
//   }))
// )

const teacherCheckboxItems = computed(() =>
  teachers.value.map((teacher) => ({
    label: teacher.name,
    description: teacher.department || teacher.email || '',
    value: teacher.id
  }))
)

// const subjectOptions = computed(() =>
//   subjects.value.map((subject) => ({
//     label: subject.name || `${subject.code || ''}${subject.title ? ` - ${subject.title}` : ''}`,
//     value: subject.id
//   }))
// )

const teacherMap = computed(() => {
  const map: Record<number, Teacher> = {}
  for (const teacher of teachers.value) {
    map[teacher.id] = teacher
  }
  return map
})

const allCriteria = computed(() => {
  return sections.value.flatMap((section: any) => section.evaluation_criteria || [])
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(form.evaluations.length / itemsPerPage))
})

const paginatedEvaluations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return form.evaluations.slice(start, end)
})


const createEvaluation = (teacherId: number) => ({
  teacherId,
  //subjectId: null,
  comment: '',
  responses: {}
})

const syncEvaluationsFromSelection = () => {
  const existingMap = new Map(
    form.evaluations.map((evaluation) => [evaluation.teacherId, evaluation])
  )

  form.evaluations = selectedTeacherIds.value.map((teacherId) => {
    return existingMap.get(teacherId) || createEvaluation(teacherId)
  })

  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
}

watch(
  selectedTeacherIds,
  () => {
    syncEvaluationsFromSelection()
  },
  { deep: true }
)


// const toggleTeacher = (teacherId: number, checked: boolean) => {
//   if (checked) {
//     if (!selectedTeacherIds.value.includes(teacherId)) {
//       selectedTeacherIds.value.push(teacherId)
//     }
//   } else {
//     selectedTeacherIds.value = selectedTeacherIds.value.filter(id => id !== teacherId)
//   }

//   syncEvaluationsFromSelection()
// }

// const isTeacherSelected = (teacherId: number) => {
//   return selectedTeacherIds.value.includes(teacherId)
// }


const getAnsweredCount = (evaluation: EvaluationFormItem) =>
  Object.keys(evaluation.responses).length

const getTotalScore = (evaluation: EvaluationFormItem) =>
  Object.values(evaluation.responses).reduce((sum, score) => sum + Number(score), 0)

const getAverageScore = (evaluation: EvaluationFormItem) => {
  const answered = getAnsweredCount(evaluation)
  if (!answered) return 0
  return Number((getTotalScore(evaluation) / answered).toFixed(2))
}


const isEvaluationComplete = (evaluation: EvaluationFormItem) => {
  return Boolean(
    evaluation.teacherId &&
    //evaluation.subjectId &&
    allCriteria.value.length > 0 &&
    getAnsweredCount(evaluation) === allCriteria.value.length
  )
}

const isFormValid = computed(() => {
  if (
    !form.semester ||
    !form.schoolYear ||
    !form.date ||
    !form.courseYearLevel ||
    !form.daysTime
  ) return false

  if (!form.evaluations.length) return false

  return form.evaluations.every((evaluation) => isEvaluationComplete(evaluation))
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const nextPage = () => goToPage(currentPage.value + 1)
const prevPage = () => goToPage(currentPage.value - 1)

/* --------------------------
GET SECTIONS (STRAPI)
---------------------------*/
const getSections = async () => {
  try {
    //pending.value = true

    const res = await $api("/evaluation-sections", {
      query: {
        "populate[evaluation_criteria][sort][0]": "order:asc",
        "sort[0]": "order:asc",
        "pagination[pageSize]": 100
      }
    })

    sections.value = res.data

  } catch (err) {
    error.value = err
    console.log(err)
  } finally {
    pending.value = false
  }
}

const getTeachers = async () => {
  try {
    const res = await $api("/teachers", {
      query: {
        "sort[0]": "name:asc",
        "pagination[pageSize]": 100
      }
    })

    teachers.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const loadData = async () => {
  try {
    pending.value = true
    error.value = null

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

/* --------------------------
SUBMIT
---------------------------*/
const submitEvaluation = async () => {
  submitError.value = ""
  submitSuccess.value = ""

  if (!form.semester || !form.schoolYear || !form.date) {
    submitError.value = "Please complete semester, school year, and date."
    return
  }

  if (!form.courseYearLevel || !form.daysTime) {
    submitError.value = "Please complete course/year level and days/time."
    return
  }

  if (!form.evaluations.length) {
    submitError.value = "Please add at least one teacher evaluation."
    return
  }

  const hasIncomplete = form.evaluations.some((evaluation) => !isEvaluationComplete(evaluation))
  if (hasIncomplete) {
    submitError.value = "Please complete all teacher evaluations before submitting."
    return
  }

  console.log("Form data: ", form.evaluations)

  try {
    submitLoading.value = true

    const evaluations = form.evaluations.map((evaluation) => ({
      teacher: evaluation.teacherId,
      subject: evaluation.subjectId,
      comment: evaluation.comment,
      responses: evaluation.responses
    }))

    console.log("Form Evaluation Data: ", evaluations)

    // const responses = Object.entries(form.responses).map(
    //   ([criterionId, score]) => ({
    //     criterion: Number(criterionId),
    //     score
    //   })
    // )

    await $api("/submit-multiple-evaluations", {
      method: "POST",
      body: {
        semester: form.semester,
        school_year: form.schoolYear,
        date: form.date,
        course: form.courseYearLevel,
        days_time: form.daysTime,
        evaluations
      }
    })

    toast.add({
      title: "Success",
      description: "Evaluation submitted successfully",
      color: "success",
    });
    submitSuccess.value = "Evaluation submitted successfully."
    resetForm()

  } catch (err: any) {
    submitError.value = err?.data?.error?.message || "Failed to submit evaluations."
    console.log(err)
  } finally {
    submitLoading.value = false
  }
}

/* --------------------------
RESET
---------------------------*/
const resetForm = () => {
  form.semester = ""
  form.schoolYear = ""
  form.date = ""
  form.courseYearLevel = ""
  form.daysTime = ""
  form.evaluations = []
  selectedTeacherIds.value = []
  currentPage.value = 1
  submitError.value = ""
  submitSuccess.value = ""
}

/* --------------------------
INIT
---------------------------*/
onMounted(() => {
  loadData()
})
</script>
