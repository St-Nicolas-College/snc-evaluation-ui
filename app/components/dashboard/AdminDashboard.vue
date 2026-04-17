<template>
 <div class="space-y-6">
        <div v-if="loading" class="py-10 text-center text-gray-500">
          Loading dashboard...
        </div>

        <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <UCard>
            <div class="text-sm text-gray-500">Total Faculties</div>
            <div class="text-3xl font-bold">{{ totalFaculties }}</div>
          </UCard>

          <UCard>
            <div class="text-sm text-gray-500">Evaluation Sections</div>
            <div class="text-3xl font-bold">{{ totalSections }}</div>
          </UCard>

          <UCard>
            <div class="text-sm text-gray-500">Evaluation Criteria</div>
            <div class="text-3xl font-bold">{{ totalCriteria }}</div>
          </UCard>

          <UCard>
            <div class="text-sm text-gray-500">Total Evaluations</div>
            <div class="text-3xl font-bold">{{ totalEvaluations }}</div>
          </UCard>

          <UCard>
            <div class="text-sm text-gray-500">Overall Average</div>
            <div class="text-3xl font-bold">{{ overallAverage }}</div>
          </UCard>
        </div>

        <div v-if="!loading" class="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <UCard>
            <template #header>
              <div class="font-semibold">Recent Evaluations</div>
            </template>

            <div v-if="recentEvaluations.length === 0" class="text-sm text-gray-500">
              No evaluations yet.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="item in recentEvaluations"
                :key="item.id"
                class="rounded-lg border border-gray-200 p-3"
              >
                <div class="font-medium">
                  {{ item.teacher?.name || 'Unknown Faculty' }}
                </div>
                <div class="text-sm text-gray-500">
                  Avg: {{ item.average_score || 0 }} | Total: {{ item.total_score || 0 }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ formatDate(item.createdAt) }}
                </div>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div class="font-semibold">Top Faculty Averages</div>
            </template>

            <div v-if="facultySummary.length === 0" class="text-sm text-gray-500">
              No faculty evaluation summary yet.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="item in facultySummary"
                :key="item.teacherId"
                class="flex items-center justify-between rounded-lg border border-gray-200 p-3"
              >
                <div>
                  <div class="font-medium">{{ item.teacherName }}</div>
                  <div class="text-sm text-gray-500">
                    {{ item.count }} evaluation(s)
                  </div>
                </div>
                <div class="text-lg font-bold">
                  {{ item.average }}
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
</template>

<script lang="ts" setup>
//@ts-nocheck
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

<style>

</style>