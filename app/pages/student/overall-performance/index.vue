<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #title>
          <span class="text-sm text-gray-500 uppercase">
            Overall Feedback
          </span>
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

          <p class="text-sm">
            Tel. No.: (045) 455-0958
          </p>

          <h1 class="mt-3 text-2xl font-extrabold uppercase">
            Overall Feedback Form
          </h1>

          <p class="font-medium">
            Student - School
          </p>
        </div>
      </div>

      <div class="space-y-8">
        <div class="rounded-lg border border-gray-300 p-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <UFormField label="Semester">
              <USelectMenu
                v-model="form.semester"
                :items="semesterOptions"
                disabled
                placeholder="Select semester"
                class="w-full"
              />
            </UFormField>

            <UFormField label="School Year">
              <UInput
                v-model="form.schoolYear"
                disabled
                placeholder="2025-2026"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Date">
              <UInput
                v-model="form.date"
                type="date"
                :disabled="isSubmitted || checkingSubmission"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <div v-if="pending || !pageReady" class="py-10 text-center">
          Loading form...
        </div>

        <div
          v-else-if="submitError"
          class="rounded-lg border border-red-300 p-6 text-center text-sm font-medium text-red-600"
        >
          {{ submitError }}
        </div>

        <div
          v-else-if="isSubmitted"
          class="rounded-xl border border-gray-300 p-10"
        >
          <UAlert
            color="warning"
            variant="soft"
            title="Already Evaluated"
            description="You already submitted your overall feedback for this semester and school year. This form is locked."
          />

          <div class="mt-6 text-center text-gray-500">
            No further action is needed.
          </div>
        </div>

        <div
          v-else-if="!sections.length"
          class="rounded-lg border border-gray-300 p-10 text-center text-gray-500"
        >
          No overall feedback criteria found.
        </div>

        <div v-else class="rounded-xl border border-gray-300 p-10">
          <div class="mb-4 text-center">
            <p class="font-semibold">
              Please answer the following items honestly.
            </p>

            <p class="text-sm text-gray-600">
              Your feedback will help improve the school services and facilities.
            </p>
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
                      colspan="2"
                      class="border border-gray-500 bg-gray-100 px-3 py-2 text-left text-base font-bold"
                    >
                      {{ section.title }}
                    </th>
                  </tr>

                  <tr class="bg-gray-50">
                    <th class="w-16 border border-gray-500 px-3 py-2 text-center">
                      No.
                    </th>

                    <th class="border border-gray-500 px-3 py-2 text-left">
                      Criteria / Answer
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="criteria in section.evaluation_criteria"
                    :key="criteria.id"
                  >
                    <td class="border border-gray-500 px-3 py-2 text-center align-top">
                      {{ criteria.order }}
                    </td>

                    <td class="border border-gray-500 px-3 py-2">
                      <p class="mb-2 font-medium">
                        {{ criteria.statement }}
                      </p>

                      <UTextarea
                        v-model="responses[criteria.id]"
                        :rows="4"
                        placeholder="Write your answer..."
                        class="w-full"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="submitError" class="text-sm font-medium text-red-600">
              {{ submitError }}
            </div>

            <div class="flex justify-end gap-2">
              <UButton
                color="neutral"
                variant="outline"
                @click="resetForm"
              >
                Reset
              </UButton>

              <UButton
                :loading="submitLoading"
                :disabled="!isFormValid || submitLoading"
                @click="submitOverallFeedback"
              >
                Submit Feedback
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

const sections = ref([])
const evaluationType = ref(null)
const activeSchoolYear = ref(null)

const responses = ref({})

const pending = ref(true)
const pageReady = ref(false)
const checkingSubmission = ref(false)
const isSubmitted = ref(false)

const submitLoading = ref(false)
const submitError = ref('')

const form = reactive({
  semester: null,
  schoolYear: '',
  date: new Date().toISOString().slice(0, 10)
})

const semesterOptions = [
  { label: '1st Semester', value: '1st Semester' },
  { label: '2nd Semester', value: '2nd Semester' },
  { label: 'Summer', value: 'Summer' }
]

const semesterValue = computed(() => {
  return form.semester?.value || form.semester || ''
})

const getActiveSchoolYear = async () => {
  const res = await $api('/school-years', {
    query: {
      'filters[active_sy][$eq]': true,
      'pagination[pageSize]': 1
    }
  })

  activeSchoolYear.value = res.data?.[0] || null

  if (activeSchoolYear.value) {
    form.semester = {
      label: activeSchoolYear.value.semester,
      value: activeSchoolYear.value.semester
    }

    form.schoolYear = activeSchoolYear.value.school_year
  }
}

const getEvaluationType = async () => {
  const res = await $api('/evaluation-types', {
    query: {
      'filters[code][$eq]': 'student-school',
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
      'sort[0]': 'order:asc',
      'pagination[pageSize]': 100
    }
  })

  sections.value = res.data || []
}

const allCriteria = computed(() =>
  sections.value.flatMap(section => section.evaluation_criteria || [])
)

const isFormValid = computed(() => {
  if (!semesterValue.value || !form.schoolYear) return false

  return allCriteria.value.every(criteria =>
    String(responses.value[criteria.id] || '').trim()
  )
})

const checkIfSubmitted = async () => {
  submitError.value = ''
  isSubmitted.value = false

  if (!semesterValue.value || !form.schoolYear) return

  checkingSubmission.value = true

  try {
    const res = await $api('/overall-feedbacks/check-my-submission', {
      query: {
        semester: semesterValue.value,
        school_year: form.schoolYear
      }
    })

    isSubmitted.value = res.submitted === true
  } catch (err) {
    console.log(err)
  } finally {
    checkingSubmission.value = false
  }
}

const submitOverallFeedback = async () => {
  submitError.value = ''

  if (isSubmitted.value) {
    toast.add({
      title: 'Already Submitted',
      description: 'You already submitted your overall feedback.',
      color: 'warning'
    })
    return
  }

  if (!isFormValid.value) {
    submitError.value = 'Please answer all questions before submitting.'

    toast.add({
      title: 'Incomplete Form',
      description: 'Please answer all questions before submitting.',
      color: 'warning'
    })

    return
  }

  try {
    submitLoading.value = true

    const formattedResponses = allCriteria.value.map(criteria => ({
      criterion_id: criteria.id,
      question: criteria.statement,
      answer: responses.value[criteria.id]
    }))

    await $api('/overall-feedbacks/create', {
      method: 'POST',
      body: {
        data: {
          semester: semesterValue.value,
          school_year: form.schoolYear,
          date: form.date,
          subject: null,
          responses: formattedResponses
        }
      }
    })

    toast.add({
      title: 'Success',
      description: 'Overall feedback submitted successfully.',
      color: 'success'
    })

    responses.value = {}
    isSubmitted.value = true
  } catch (err: any) {
    console.log(err)

    const message =
      err?.data?.error?.message ||
      err?.data?.message ||
      'Failed to submit overall feedback.'

    submitError.value = message

    toast.add({
      title: 'Submission Failed',
      description: message,
      color: 'error'
    })
  } finally {
    submitLoading.value = false
  }
}

const resetForm = () => {
  responses.value = {}
  submitError.value = ''
}

const loadData = async () => {
  try {
    pending.value = true
    pageReady.value = false

    await getActiveSchoolYear()
    await getEvaluationType()

    if (!evaluationType.value) {
      submitError.value = 'Student-School evaluation type is not configured.'
      return
    }

    await getSections()
    await checkIfSubmitted()

    pageReady.value = true
  } catch (err) {
    console.log(err)
    submitError.value = 'Failed to load overall feedback form.'
  } finally {
    pending.value = false
  }
}

watch(
  () => [form.semester, form.schoolYear],
  async () => {
    if (!pageReady.value) return
    await checkIfSubmitted()
  },
  { deep: true }
)

watch(
  user,
  async val => {
    if (val?.id) {
      await loadData()
    }
  },
  { immediate: true }
)
</script>
