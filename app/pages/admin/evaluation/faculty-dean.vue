<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Dean Evaluation Result</span>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <UFormField label="Select Dean / Coordinator">
            <USelectMenu
              v-model="selectedDeanId"
              :items="deanOptions"
              value-key="value"
              placeholder="Choose dean / coordinator"
              class="w-full"
            />
          </UFormField>
          <UFormField label="School Year">
    <UInput
      v-model="selectedSchoolYear"
      placeholder="2025-2026"
      class="w-full"
    />
  </UFormField>

  <UFormField label="Semester">
    <USelectMenu
      v-model="selectedSemester"
      :items="semesterOptions"
      value-key="value"
      placeholder="Select semester"
      class="w-full"
    />
  </UFormField>
        </div>

        <div v-if="loading" class="py-10 text-center text-gray-500">
          Loading evaluations...
        </div>

        <div
          v-else-if="selectedDeanId && evaluations.length === 0"
          class="py-10 text-center text-gray-500"
        >
          No evaluations found for this dean/coordinator.
        </div>

        <div v-else-if="selectedDeanId" class="space-y-6">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
            <UCard>
              <div class="text-sm text-gray-500">Total Evaluations</div>
              <div class="text-2xl font-bold">{{ totalEvaluations }}</div>
            </UCard>

            <UCard>
              <div class="text-sm text-gray-500">Overall Average</div>
              <div class="text-2xl font-bold">{{ overallAverage }}</div>
            </UCard>

            <UCard>
              <div class="text-sm text-gray-500">With Comments</div>
              <div class="text-2xl font-bold">{{ commentCount }}</div>
            </UCard>

            <UCard>
              <div class="text-sm text-gray-500">Total Response Items</div>
              <div class="text-2xl font-bold">{{ totalResponses }}</div>
            </UCard>
          </div>

          <UCard>
            <template #header>
              <div class="font-bold text-lg">Section Summary</div>
            </template>

            <UTable :data="sectionSummary" :columns="sectionColumns">
              <template #average-cell="{ row }">
                <span class="font-bold">{{ row.original.average }}</span>
              </template>

              <template #empty>
                <div class="py-6 text-center text-gray-500">
                  No section summary available.
                </div>
              </template>
            </UTable>
          </UCard>

          <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <UCard v-if="strengthsList.length > 0">
              <template #header>
                <div class="font-bold text-lg">Strengths</div>
              </template>

              <div class="space-y-3">
                <div
                  v-for="item in strengthsList"
                  :key="`strength-${item.id}`"
                  class="rounded-lg border border-gray-300 p-4"
                >
                  <div class="mb-1 text-xs text-gray-500">
                    {{ formatDate(item.createdAt) }}
                  </div>
                  <div class="text-sm text-gray-700">
                    {{ item.strengths }}
                  </div>
                </div>
              </div>
            </UCard>

            <UCard v-if="improvementList.length > 0">
              <template #header>
                <div class="font-bold text-lg">Areas for Improvement</div>
              </template>

              <div class="space-y-3">
                <div
                  v-for="item in improvementList"
                  :key="`improvement-${item.id}`"
                  class="rounded-lg border border-gray-300 p-4"
                >
                  <div class="mb-1 text-xs text-gray-500">
                    {{ formatDate(item.createdAt) }}
                  </div>
                  <div class="text-sm text-gray-700">
                    {{ item.areas_for_improvement }}
                  </div>
                </div>
              </div>
            </UCard>
          </div>

          <UCard v-if="commentsList.length > 0">
            <template #header>
              <div class="font-bold text-lg">Comments</div>
            </template>

            <div class="space-y-3">
              <div
                v-for="item in commentsList"
                :key="`comment-${item.id}`"
                class="rounded-lg border border-gray-300 p-4"
              >
                <div class="mb-1 text-xs text-gray-500">
                  {{ formatDate(item.createdAt) }}
                </div>
                <div class="text-sm text-gray-700">
                  {{ item.comment }}
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <div v-else class="py-10 text-center text-gray-500">
          Please select a dean/coordinator to view evaluations.
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

const deans = ref([])
const selectedDeanId = ref('')
const evaluations = ref([])
const loading = ref(false)

const sectionColumns = [
  { accessorKey: 'section', header: 'Section' },
  { accessorKey: 'totalScore', header: 'Total Score' },
  { accessorKey: 'totalItems', header: 'Items Rated' },
  { accessorKey: 'average', header: 'Average' }
]

const selectedSchoolYear = ref('')
const selectedSemester = ref('')

const semesterOptions = [
  { label: '1st Semester', value: '1st Semester' },
  { label: '2nd Semester', value: '2nd Semester' },
  { label: 'Summer', value: 'Summer' }
]

const deanOptions = computed(() =>
  deans.value.map((dean: any) => ({
    label: `${dean.name}${dean.department ? ` (${dean.department})` : ''}`,
    value: dean.id
  }))
)

const totalEvaluations = computed(() => evaluations.value.length)

const overallAverage = computed(() => {
  if (!evaluations.value.length) return 0

  const total = evaluations.value.reduce(
    (sum: number, item: any) => sum + Number(item.average_score || 0),
    0
  )

  return Number((total / evaluations.value.length).toFixed(2))
})

const commentCount = computed(() =>
  evaluations.value.filter((item: any) => item.comment?.trim()).length
)

const totalResponses = computed(() =>
  evaluations.value.reduce(
    (sum: number, evaluation: any) => sum + (evaluation.responses?.length || 0),
    0
  )
)

const commentsList = computed(() =>
  evaluations.value
    .filter((item: any) => item.comment?.trim())
    .map((item: any) => ({
      id: item.id,
      comment: item.comment,
      createdAt: item.createdAt
    }))
)

const strengthsList = computed(() =>
  evaluations.value
    .filter((item: any) => item.strengths?.trim())
    .map((item: any) => ({
      id: item.id,
      strengths: item.strengths,
      createdAt: item.createdAt
    }))
)

const improvementList = computed(() =>
  evaluations.value
    .filter((item: any) => item.areas_for_improvement?.trim())
    .map((item: any) => ({
      id: item.id,
      areas_for_improvement: item.areas_for_improvement,
      createdAt: item.createdAt
    }))
)

const sectionSummary = computed(() => {
  const grouped: Record<string, any> = {}

  evaluations.value.forEach((evaluation: any) => {
    const responses = evaluation.responses || []

    responses.forEach((item: any) => {
      const sectionName = item.section || 'Uncategorized'
      const sectionOrder = Number(item.sectionOrder || 0)

      if (!grouped[sectionName]) {
        grouped[sectionName] = {
          section: sectionName,
          sectionOrder,
          totalScore: 0,
          totalItems: 0,
          average: 0
        }
      }

      grouped[sectionName].totalScore += Number(item.score || 0)
      grouped[sectionName].totalItems += 1
    })
  })

  return Object.values(grouped)
    .map((section: any) => ({
      ...section,
      average: section.totalItems
        ? Number((section.totalScore / section.totalItems).toFixed(2))
        : 0
    }))
    .sort((a: any, b: any) => a.sectionOrder - b.sectionOrder)
})

const getDeans = async () => {
  try {
    const res = await $api('/teachers', {
      query: {
        'populate[user][populate]': 'role',
        'filters[user][role][name][$eq]': 'Dean',
        'sort[0]': 'name:asc',
        'pagination[pageSize]': 100
      }
    })

    deans.value = res.data || []
  } catch (err) {
    console.log(err)
  }
}

const getDeanEvaluations = async () => {
  if (!selectedDeanId.value) {
    evaluations.value = []
    return
  }

  try {
    loading.value = true

    const query: any = {
      'filters[dean_coordinator][id][$eq]': selectedDeanId.value,
      'filters[batch][evaluation_type][code][$eq]': 'faculty-dean-coordinator',
      'populate[dean_coordinator]': true,
      'populate[evaluator_user]': true,
      'populate[batch][populate]': 'evaluation_type',
      'sort[0]': 'createdAt:desc',
      'pagination[pageSize]': 300
    }

     if (selectedSchoolYear.value) {
      query['filters[batch][school_year][$eq]'] = selectedSchoolYear.value
    }

    if (selectedSemester.value) {
      query['filters[batch][semester][$eq]'] = selectedSemester.value
    }

    const res = await $api('/evaluations', { query })

    evaluations.value = res.data || []
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const formatDate = (value: string) => {
  if (!value) return '-'

  return new Date(value).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

watch([selectedDeanId, selectedSchoolYear, selectedSemester], async () => {
  await getDeanEvaluations()
})

onMounted(async () => {
  await getDeans()
})
</script>