<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 uppercase">Dashboard</span>
          </div>
        </template>
        <template #right>
          <UColorModeSwitch />

        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <!-- Loading -->
      <div v-if="!user" class="py-10 text-center text-gray-500">
        Loading...
      </div>

      <!-- ADMIN -->
      <div v-else-if="role === 'Admin'">
        <DashboardAdminDashboard />
      </div>

      <!-- DEAN -->
      <div v-else-if="role === 'Dean'">
        <div class="py-10 text-center text-gray-500">
          Dean Page
        </div>
        <!-- <DashboardAdminDashboard /> -->
      </div>

      <!-- FACULTY -->
      <div v-else-if="role === 'Faculty'">
        <DashboardFacultyDashboard />
      </div>

      <!-- STUDENT -->
      <div v-else-if="role === 'Student'">
        <DashboardStudentDashboard />
      </div>

      <!-- FALLBACK -->
      <div v-else class="py-10 text-center text-gray-500">
        Unknown role: {{ role }}
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
//@ts-nocheck
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Admin','Dean', 'Faculty', 'Student']
})
const { user } = useAuth()
const { $api } = useNuxtApp()

const loading = ref(true)

const faculties = ref([])
const sections = ref([])
const criteria = ref([])
const evaluations = ref([])

const totalFaculties = computed(() => faculties.value.length)
const totalSections = computed(() => sections.value.length)
const totalCriteria = computed(() => criteria.value.length)
const totalEvaluations = computed(() => evaluations.value.length)

const role = computed(() => {
  return user.value?.role || ''
})

const overallAverage = computed(() => {
  if (!evaluations.value.length) return 0

  const total = evaluations.value.reduce(
    (sum: number, item: any) => sum + Number(item.average_score || 0),
    0
  )

  return Number((total / evaluations.value.length).toFixed(2))
})

const recentEvaluations = computed(() =>
  [...evaluations.value]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)
)

const facultySummary = computed(() => {
  const grouped: Record<string, any> = {}

  evaluations.value.forEach((item: any) => {
    const teacherId = item.teacher?.id
    const teacherName = item.teacher?.name || 'Unknown Faculty'

    if (!teacherId) return

    if (!grouped[teacherId]) {
      grouped[teacherId] = {
        teacherId,
        teacherName,
        totalAverage: 0,
        count: 0,
        average: 0
      }
    }

    grouped[teacherId].totalAverage += Number(item.average_score || 0)
    grouped[teacherId].count += 1
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

const getFaculties = async () => {
  const res = await $api('/teachers', {
    query: {
      pagination: { pageSize: 100 }
    }
  })
  faculties.value = res.data || []
}

const getSections = async () => {
  const res = await $api('/evaluation-sections', {
    query: {
      pagination: { pageSize: 100 }
    }
  })
  sections.value = res.data || []
}

const getCriteria = async () => {
  const res = await $api('/evaluation-criterias', {
    query: {
      pagination: { pageSize: 100 }
    }
  })
  criteria.value = res.data || []
}

const getEvaluations = async () => {
  const res = await $api('/evaluations', {
    query: {
      'populate[teacher]': true,
      pagination: { pageSize: 100 }
    }
  })
  evaluations.value = res.data || []
}

const formatDate = (value: string) => {
  if (!value) return '-'

  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(async () => {
  try {
    loading.value = true

    await Promise.all([
      getFaculties(),
      getSections(),
      getCriteria(),
      getEvaluations()
    ])
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
})
</script>

<style></style>