<template>
  <div class="space-y-6">
    <div class="rounded-2xl border border-gray-200 p-6 ">
      <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold">Admin Dashboard</h1>
          <p class="text-sm text-gray-500">
            Overview of students, teachers, subjects, and evaluations.
          </p>
        </div>

        <UButton
          icon="i-lucide-refresh-cw"
          variant="outline"
          :loading="loading"
          @click="loadDashboard"
        >
          Refresh
        </UButton>
      </div>
    </div>

    <div v-if="loading" class="py-10 text-center text-gray-500">
      Loading dashboard...
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <UCard :ui="{ root: 'rounded-2xl shadow-sm' }">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500">Students</div>
              <div class="mt-1 text-3xl font-bold">{{ totalStudents }}</div>
            </div>
            <div class="rounded-xl bg-primary-50 p-3 text-primary-600">
              <UIcon name="i-lucide-graduation-cap" class="size-6" />
            </div>
          </div>
        </UCard>

        <UCard :ui="{ root: 'rounded-2xl shadow-sm' }">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500">Teachers</div>
              <div class="mt-1 text-3xl font-bold">{{ totalTeachers }}</div>
            </div>
            <div class="rounded-xl bg-primary-50 p-3 text-primary-600">
              <UIcon name="i-lucide-users" class="size-6" />
            </div>
          </div>
        </UCard>

        <UCard :ui="{ root: 'rounded-2xl shadow-sm' }">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500">Subjects</div>
              <div class="mt-1 text-3xl font-bold">{{ totalSubjects }}</div>
            </div>
            <div class="rounded-xl bg-primary-50 p-3 text-primary-600">
              <UIcon name="i-lucide-book-open" class="size-6" />
            </div>
          </div>
        </UCard>

        <UCard :ui="{ root: 'rounded-2xl shadow-sm' }">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500">Evaluations</div>
              <div class="mt-1 text-3xl font-bold">{{ totalEvaluations }}</div>
            </div>
            <div class="rounded-xl bg-primary-50 p-3 text-primary-600">
              <UIcon name="i-lucide-clipboard-check" class="size-6" />
            </div>
          </div>
        </UCard>

        <UCard :ui="{ root: 'rounded-2xl shadow-sm' }">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500">Overall Average</div>
              <div class="mt-1 text-3xl font-bold">{{ overallAverage }}</div>
            </div>
            <div class="rounded-xl bg-primary-50 p-3 text-primary-600">
              <UIcon name="i-lucide-star" class="size-6" />
            </div>
          </div>
        </UCard>
      </div>

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <UCard :ui="{ root: 'rounded-2xl shadow-sm' }">
          <template #header>
            <div>
              <div class="font-semibold">Top Faculty</div>
              <div class="text-xs text-gray-500">Based on average evaluation score</div>
            </div>
          </template>

          <UTable :data="topFaculty" :columns="facultyColumns">
            <template #average-cell="{ row }">
              <UBadge color="primary" variant="soft">
                {{ row.original.average }}
              </UBadge>
            </template>
          </UTable>
        </UCard>

        <UCard :ui="{ root: 'rounded-2xl shadow-sm' }">
          <template #header>
            <div>
              <div class="font-semibold">Section Summary</div>
              <div class="text-xs text-gray-500">Average score by criteria section</div>
            </div>
          </template>

          <UTable :data="sectionSummary" :columns="sectionColumns">
            <template #average-cell="{ row }">
              <UBadge color="primary" variant="soft">
                {{ row.original.average }}
              </UBadge>
            </template>
          </UTable>
        </UCard>
      </div>

      <UCard :ui="{ root: 'rounded-2xl shadow-sm' }">
        <template #header>
          <div>
            <div class="font-semibold">Recent Evaluations</div>
            <div class="text-xs text-gray-500">Latest submitted evaluations</div>
          </div>
        </template>

        <UTable :data="recentEvaluations" :columns="recentColumns">
          <template #type-cell="{ row }">
            <UBadge
              :color="row.original.type === 'Student - Faculty' ? 'primary' : 'neutral'"
              variant="soft"
            >
              {{ row.original.type }}
            </UBadge>
          </template>

          <template #average-cell="{ row }">
            <span class="font-semibold">{{ row.original.average }}</span>
          </template>
        </UTable>
      </UCard>
    </template>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
const { $api } = useNuxtApp()

const loading = ref(true)

const students = ref([])
const teachers = ref([])
const subjects = ref([])
const evaluations = ref([])

const facultyColumns = [
  { accessorKey: 'name', header: 'Faculty' },
  { accessorKey: 'count', header: 'Evaluations' },
  { accessorKey: 'average', header: 'Average' }
]

const sectionColumns = [
  { accessorKey: 'section', header: 'Section' },
  { accessorKey: 'items', header: 'Items Rated' },
  { accessorKey: 'average', header: 'Average' }
]

const recentColumns = [
  { accessorKey: 'target', header: 'Target' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'average', header: 'Average' },
  { accessorKey: 'date', header: 'Date' }
]

const totalStudents = computed(() => students.value.length)
const totalTeachers = computed(() => teachers.value.length)
const totalSubjects = computed(() => subjects.value.length)
const totalEvaluations = computed(() => evaluations.value.length)

const overallAverage = computed(() => {
  if (!evaluations.value.length) return 0

  const total = evaluations.value.reduce(
    (sum: number, item: any) => sum + Number(item.average_score || 0),
    0
  )

  return Number((total / evaluations.value.length).toFixed(2))
})

const topFaculty = computed(() => {
  const grouped: Record<string, any> = {}

  evaluations.value.forEach((evaluation: any) => {
    if (!evaluation.teacher) return

    const key = evaluation.teacher.id

    if (!grouped[key]) {
      grouped[key] = {
        name: evaluation.teacher.name,
        count: 0,
        totalAverage: 0,
        average: 0
      }
    }

    grouped[key].count += 1
    grouped[key].totalAverage += Number(evaluation.average_score || 0)
  })

  return Object.values(grouped)
    .map((item: any) => ({
      ...item,
      average: item.count
        ? Number((item.totalAverage / item.count).toFixed(2))
        : 0
    }))
    .sort((a: any, b: any) => b.average - a.average)
    .slice(0, 5)
})

const sectionSummary = computed(() => {
  const grouped: Record<string, any> = {}

  evaluations.value.forEach((evaluation: any) => {
    ;(evaluation.responses || []).forEach((response: any) => {
      const section = response.section || 'Uncategorized'

      if (!grouped[section]) {
        grouped[section] = {
          section,
          sectionOrder: response.sectionOrder || 0,
          totalScore: 0,
          items: 0,
          average: 0
        }
      }

      grouped[section].totalScore += Number(response.score || 0)
      grouped[section].items += 1
    })
  })

  return Object.values(grouped)
    .map((item: any) => ({
      ...item,
      average: item.items
        ? Number((item.totalScore / item.items).toFixed(2))
        : 0
    }))
    .sort((a: any, b: any) => a.sectionOrder - b.sectionOrder)
})

const recentEvaluations = computed(() =>
  evaluations.value.slice(0, 10).map((evaluation: any) => ({
    target:
      evaluation.teacher?.name ||
      evaluation.dean_coordinator?.name ||
      'Unknown',
    type: evaluation.teacher ? 'Student - Faculty' : 'Faculty - Dean',
    average: evaluation.average_score || 0,
    date: formatDate(evaluation.createdAt)
  }))
)

const formatDate = (value: string) => {
  if (!value) return '-'

  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadDashboard = async () => {
  try {
    loading.value = true

    const [studentRes, teacherRes, subjectRes, evaluationRes] =
      await Promise.all([
        $api('/students', {
          query: {
            'pagination[pageSize]': 500
          }
        }),
        $api('/teachers', {
          query: {
            'pagination[pageSize]': 500
          }
        }),
        $api('/subjects', {
          query: {
            'pagination[pageSize]': 500
          }
        }),
        $api('/evaluations', {
          query: {
            'populate[teacher]': true,
            'populate[dean_coordinator]': true,
            'sort[0]': 'createdAt:desc',
            'pagination[pageSize]': 500
          }
        })
      ])

    students.value = studentRes.data || []
    teachers.value = teacherRes.data || []
    subjects.value = subjectRes.data || []
    evaluations.value = evaluationRes.data || []
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>