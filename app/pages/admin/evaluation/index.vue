<template>
 <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Admin Evaluation</span>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="space-y-6">
        <div class="max-w-md">
          <UFormField label="Select Faculty">
            <USelectMenu
              v-model="selectedFacultyId"
              :items="facultyOptions"
              value-key="value"
              placeholder="Choose faculty"
            />
          </UFormField>
        </div>

        <div v-if="loading" class="py-10 text-center text-gray-500">
          Loading evaluations...
        </div>

        <div
          v-else-if="selectedFacultyId && evaluations.length === 0"
          class="py-10 text-center text-gray-500"
        >
          No evaluations found for this faculty.
        </div>

        <div v-else-if="selectedFacultyId" class="space-y-6">
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
              <div class="font-bold text-lg">
                Section Summary
              </div>
            </template>

            <div class="overflow-x-auto">
              <table class="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-2 text-left">Section</th>
                    <th class="border border-gray-300 px-4 py-2 text-center">Total Score</th>
                    <th class="border border-gray-300 px-4 py-2 text-center">Items Rated</th>
                    <th class="border border-gray-300 px-4 py-2 text-center">Average</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="section in sectionSummary" :key="section.section">
                    <td class="border border-gray-300 px-4 py-2 font-medium">
                      {{ section.section }}
                    </td>
                    <td class="border border-gray-300 px-4 py-2 text-center">
                      {{ section.totalScore }}
                    </td>
                    <td class="border border-gray-300 px-4 py-2 text-center">
                      {{ section.totalItems }}
                    </td>
                    <td class="border border-gray-300 px-4 py-2 text-center font-bold">
                      {{ section.average }}
                    </td>
                  </tr>

                  <tr v-if="sectionSummary.length === 0">
                    <td colspan="4" class="border border-gray-300 px-4 py-6 text-center text-gray-500">
                      No section summary available.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </UCard>

          <UCard v-if="commentsList.length > 0">
            <template #header>
              <div class="font-bold text-lg">
                Comments
              </div>
            </template>

            <div class="space-y-3">
              <div
                v-for="item in commentsList"
                :key="item.id"
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
          Please select a faculty to view evaluations.
        </div>
      </div>

    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
//@ts-nocheck
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Admin']
})

const { $api } = useNuxtApp()

const faculties = ref([])
const selectedFacultyId = ref('')
const evaluations = ref([])
const loading = ref(false)

const facultyOptions = computed(() =>
  faculties.value.map((faculty: any) => ({
    label: faculty.name,
    value: faculty.id
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
    .sort((a: any, b: any) => {
      if (a.sectionOrder === b.sectionOrder) {
        return a.section.localeCompare(b.section)
      }
      return a.sectionOrder - b.sectionOrder
    })
})

const getFaculties = async () => {
  try {
    const res = await $api('/teachers', {
      query: {
        sort: ['name:asc'],
        pagination: {
          pageSize: 100
        }
      }
    })

    faculties.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const getFacultyEvaluations = async () => {
  if (!selectedFacultyId.value) {
    evaluations.value = []
    return
  }

  try {
    loading.value = true

    const res = await $api('/evaluations', {
      query: {
        'filters[teacher][id][$eq]': selectedFacultyId.value,
        'populate[teacher]': true,
        'populate[batch]': true,
        'sort[0]': 'createdAt:desc',
        'pagination[pageSize]': 100
      }
    })

    evaluations.value = res.data
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

watch(selectedFacultyId, async () => {
  await getFacultyEvaluations()
})

onMounted(async () => {
  await getFaculties()
})
</script>

<style>

</style>