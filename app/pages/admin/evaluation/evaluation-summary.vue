<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Evaluation Summary</span>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <UFormField label="Evaluation Type">
            <USelectMenu
              v-model="selectedType"
              :items="typeOptions"
              value-key="value"
              placeholder="Select type"
              class="w-full"
            />
          </UFormField>

          <UFormField label="School Year">
            <UInput v-model="schoolYear" placeholder="2025-2026" />
          </UFormField>

          <UFormField label="Semester">
            <UInput v-model="semester" placeholder="2nd Semester" />
          </UFormField>

          <div class="flex items-end">
            <UButton
              label="Load Summary"
              icon="i-lucide-search"
              :loading="loading"
              class="w-full justify-center"
              @click="getEvaluations"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <UCard>
            <div class="text-sm text-gray-500">Total Evaluations</div>
            <div class="text-3xl font-bold">{{ totalEvaluations }}</div>
          </UCard>

          <UCard>
            <div class="text-sm text-gray-500">Overall Average</div>
            <div class="text-3xl font-bold">{{ overallAverage }}</div>
          </UCard>

          <UCard>
            <div class="text-sm text-gray-500">Total Responses</div>
            <div class="text-3xl font-bold">{{ totalResponses }}</div>
          </UCard>
        </div>

        <UCard>
          <template #header>
            <div class="font-semibold">Summary by Person</div>
          </template>

          <UTable
            :data="personSummary"
            :columns="personColumns"
            :loading="loading"
          >
            <template #average-cell="{ row }">
              <span class="font-bold">{{ row.original.average }}</span>
            </template>

            <template #empty>
              <div class="py-6 text-center text-gray-500">
                No evaluation summary found.
              </div>
            </template>
          </UTable>
        </UCard>

        <UCard>
          <template #header>
            <div class="font-semibold">Summary by Section</div>
          </template>

          <UTable
            :data="sectionSummary"
            :columns="sectionColumns"
            :loading="loading"
          >
            <template #average-cell="{ row }">
              <span class="font-bold">{{ row.original.average }}</span>
            </template>

            <template #empty>
              <div class="py-6 text-center text-gray-500">
                No section summary found.
              </div>
            </template>
          </UTable>
        </UCard>
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
const evaluations = ref([])

const selectedType = ref('student-faculty')
const schoolYear = ref('')
const semester = ref('')

const typeOptions = [
  {
    label: 'Student - Faculty',
    value: 'student-faculty'
  },
  {
    label: 'Faculty - Dean/Coordinator',
    value: 'faculty-dean-coordinator'
  },
  {
    label: 'Dean/Coordinator - Faculty',
    value: 'dean-to-faculty'
  }
]

const personColumns = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'count',
    header: 'Evaluations'
  },
  {
    accessorKey: 'totalScore',
    header: 'Total Score'
  },
  {
    accessorKey: 'average',
    header: 'Average'
  }
]

const sectionColumns = [
  {
    accessorKey: 'section',
    header: 'Section'
  },
  {
    accessorKey: 'items',
    header: 'Items Rated'
  },
  {
    accessorKey: 'totalScore',
    header: 'Total Score'
  },
  {
    accessorKey: 'average',
    header: 'Average'
  }
]

const totalEvaluations = computed(() => evaluations.value.length)

const totalResponses = computed(() =>
  evaluations.value.reduce(
    (sum: number, evaluation: any) =>
      sum + (evaluation.responses?.length || 0),
    0
  )
)

const overallAverage = computed(() => {
  if (!evaluations.value.length) return 0

  const total = evaluations.value.reduce(
    (sum: number, evaluation: any) =>
      sum + Number(evaluation.average_score || 0),
    0
  )

  return Number((total / evaluations.value.length).toFixed(2))
})

const personSummary = computed(() => {
  const grouped: Record<string, any> = {}

  evaluations.value.forEach((evaluation: any) => {
    const person =
      selectedType.value === 'student-faculty'
        ? evaluation.teacher
        : evaluation.dean_coordinator

    if (!person) return

    const key = person.id || person.documentId

    if (!grouped[key]) {
      grouped[key] = {
        name: person.name,
        count: 0,
        totalAverage: 0,
        totalScore: 0,
        average: 0
      }
    }

    grouped[key].count += 1
    grouped[key].totalAverage += Number(evaluation.average_score || 0)
    grouped[key].totalScore += Number(evaluation.total_score || 0)
  })

  return Object.values(grouped)
    .map((item: any) => ({
      ...item,
      average: item.count
        ? Number((item.totalAverage / item.count).toFixed(2))
        : 0
    }))
    .sort((a: any, b: any) => b.average - a.average)
})

const sectionSummary = computed(() => {
  const grouped: Record<string, any> = {}

  evaluations.value.forEach((evaluation: any) => {
    const responses = evaluation.responses || []

    responses.forEach((response: any) => {
      const sectionName = response.section || 'Uncategorized'
      const sectionOrder = Number(response.sectionOrder || 0)

      if (!grouped[sectionName]) {
        grouped[sectionName] = {
          section: sectionName,
          sectionOrder,
          totalScore: 0,
          items: 0,
          average: 0
        }
      }

      grouped[sectionName].totalScore += Number(response.score || 0)
      grouped[sectionName].items += 1
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

const getEvaluations = async () => {
  try {
    loading.value = true

    const query: any = {
      'filters[batch][evaluation_type][code][$eq]': selectedType.value,
      'populate[teacher]': true,
      'populate[dean_coordinator]': true,
      'populate[subject]': true,
      'populate[batch][populate]': 'evaluation_type',
      'sort[0]': 'createdAt:desc',
      'pagination[pageSize]': 500
    }

    if (schoolYear.value) {
      query['filters[batch][school_year][$eq]'] = schoolYear.value
    }

    if (semester.value) {
      query['filters[batch][semester][$eq]'] = semester.value
    }

    const res = await $api('/evaluations', { query })

    evaluations.value = res.data || []
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getEvaluations()
})
</script>