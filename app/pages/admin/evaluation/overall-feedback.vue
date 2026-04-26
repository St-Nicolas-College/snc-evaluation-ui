<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #title>
          <span class="text-sm text-gray-500 uppercase">
            Overall Feedback Summary
          </span>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <div>
          <h1 class="text-2xl font-bold">
            Overall Feedback Dashboard
          </h1>
          <p class="text-sm text-gray-500">
            Student feedback about school facilities, services, and general experience.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <UCard>
            <div class="text-sm text-gray-500">
              Total Submissions
            </div>
            <div class="text-3xl font-bold">
              {{ totalResponses }}
            </div>
          </UCard>

          <UCard>
            <div class="text-sm text-gray-500">
              School Year
            </div>
            <div class="text-xl font-bold">
              {{ filters.schoolYear || 'All' }}
            </div>
          </UCard>

          <UCard>
            <div class="text-sm text-gray-500">
              Semester
            </div>
            <div class="text-xl font-bold">
              {{ filters.semester || 'All' }}
            </div>
          </UCard>
        </div>

        <UCard>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <UFormField label="School Year">
              <USelectMenu
                v-model="filters.schoolYear"
                :items="schoolYears"
                value-key="value"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Semester">
              <USelectMenu
                v-model="filters.semester"
                :items="semesterOptions"
                value-key="value"
                class="w-full"
              />
            </UFormField>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="font-bold">
              Submission List
            </div>
          </template>

          <div v-if="loading" class="py-10 text-center">
            Loading feedbacks...
          </div>

          <UTable
            v-else
            :data="tableRows"
            :columns="columns"
          />
        </UCard>

        <div class="space-y-6">
          <UCard
            v-for="(questions, section) in groupedResponses"
            :key="section"
          >
            <template #header>
              <div class="font-bold uppercase">
                {{ section }}
              </div>
            </template>

            <div class="space-y-6">
              <div
                v-for="(answers, question) in questions"
                :key="question"
                class="rounded-lg border border-gray-300 p-4"
              >
                <div class="mb-3 font-semibold">
                  {{ question }}
                </div>

                <div class="space-y-3">
                  <div
                    v-for="(item, index) in answers"
                    :key="index"
                    class="rounded-lg bg-gray-50 p-3"
                  >
                    <p class="text-sm">
                      {{ item.answer }}
                    </p>

                    <div class="mt-2 text-xs text-gray-500">
                      {{ item.student }} • {{ item.course }} • {{ item.semester }} • {{ item.school_year }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
// @ts-nocheck
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Admin']
})

const { $api } = useNuxtApp()

const loading = ref(false)
const feedbacks = ref([])
const schoolYears = ref([])

const filters = reactive({
  schoolYear: '',
  semester: ''
})

const semesterOptions = [
  { label: 'All Semesters', value: '' },
  { label: '1st Semester', value: '1st Semester' },
  { label: '2nd Semester', value: '2nd Semester' },
  { label: 'Summer', value: 'Summer' }
]

const getSchoolYears = async () => {
  const res = await $api('/school-years', {
    query: {
      'sort[0]': 'createdAt:desc',
      'pagination[pageSize]': 100
    }
  })

  schoolYears.value = [
    { label: 'All School Years', value: '' },
    ...res.data.map((item: any) => ({
      label: `${item.school_year} - ${item.semester}`,
      value: item.school_year
    }))
  ]
}

const getOverallFeedbacks = async () => {
  try {
    loading.value = true

    const query: any = {
      'populate[student]': true,
      'populate[course]': true,
      'populate[evaluator_user]': true,
      'sort[0]': 'createdAt:desc',
      'pagination[pageSize]': 500
    }

    if (filters.schoolYear) {
      query['filters[school_year][$eq]'] = filters.schoolYear
    }

    if (filters.semester) {
      query['filters[semester][$eq]'] = filters.semester
    }

    const res = await $api('/overall-feedbacks', { query })

    feedbacks.value = res.data || []
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const totalResponses = computed(() => feedbacks.value.length)

const groupedResponses = computed(() => {
  const groups: any = {}

  feedbacks.value.forEach((feedback: any) => {
    const responses = feedback.responses || []

    responses.forEach((response: any) => {
      const section = response.section || response.category || 'General'
      const question = response.question || 'No question'

      if (!groups[section]) {
        groups[section] = {}
      }

      if (!groups[section][question]) {
        groups[section][question] = []
      }

      groups[section][question].push({
        answer: response.answer,
        student: feedback.student?.name || feedback.student?.student_id || 'Unknown Student',
        course: feedback.course?.code || feedback.course?.name || 'N/A',
        semester: feedback.semester,
        school_year: feedback.school_year,
        date: feedback.date || feedback.createdAt
      })
    })
  })

  return groups
})

const tableRows = computed(() => {
  return feedbacks.value.map((item: any, index: number) => ({
    no: index + 1,
    student: item.student?.name || item.student?.student_id || 'Unknown Student',
    course: item.course?.code || item.course?.name || 'N/A',
    semester: item.semester,
    school_year: item.school_year,
    date: item.date || item.createdAt,
    answers: item.responses?.length || 0
  }))
})

const columns = [
  { accessorKey: 'no', header: '#' },
  { accessorKey: 'student', header: 'Student' },
  { accessorKey: 'course', header: 'Course' },
  { accessorKey: 'semester', header: 'Semester' },
  { accessorKey: 'school_year', header: 'School Year' },
  { accessorKey: 'answers', header: 'Answers' },
  { accessorKey: 'date', header: 'Date' }
]

watch(
  () => [filters.schoolYear, filters.semester],
  async () => {
    await getOverallFeedbacks()
  }
)

onMounted(async () => {
  await getSchoolYears()
  await getOverallFeedbacks()
})
</script>

<style>

</style>