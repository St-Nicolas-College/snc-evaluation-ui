<template>
  <div class="space-y-6 pb-10">
    <PageHeader title="All Faculty and Dean Portfolios" subtitle="Monitor portfolio completion and verification status across the institution." />

    <section class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-1 flex-col gap-3 sm:flex-row">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Search faculty, employee number, portfolio..." class="w-full sm:max-w-md" />
          <USelectMenu v-model="status" :items="statusOptions" value-key="value" class="w-full sm:w-56" />
        </div>
        <UButton icon="i-lucide-refresh-cw" :loading="loading" @click="loadPortfolios">Refresh</UButton>
      </div>
    </section>

    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div v-if="loading" class="space-y-3 p-5">
        <USkeleton v-for="i in 6" :key="i" class="h-20 rounded-xl" />
      </div>

      <div v-else-if="!filtered.length" class="p-16 text-center text-sm text-gray-500">
        No portfolio records found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[1000px] text-sm">
          <thead class="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40">
            <tr>
              <th class="px-5 py-3 text-left">Faculty / Dean</th>
              <th class="px-4 py-3 text-left">Department</th>
              <th class="px-4 py-3 text-left">Portfolio No.</th>
              <th class="px-4 py-3 text-center">Completion</th>
              <th class="px-4 py-3 text-center">Status</th>
              <th class="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filtered" :key="item.documentId">
              <td class="px-5 py-4">
                <p class="font-bold">{{ facultyName(item) }}</p>
                <p class="mt-1 text-xs text-gray-500">{{ item.faculty?.employee_no || item.faculty?.user?.username || 'No employee number' }}</p>
              </td>
              <td class="px-4 py-4">{{ item.faculty?.department?.name || 'Not specified' }}</td>
              <td class="px-4 py-4">{{ item.portfolio_no }}</td>
              <td class="px-4 py-4 text-center">{{ Math.round(Number(item.completion_percentage || 0)) }}%</td>
              <td class="px-4 py-4 text-center"><UBadge :color="statusColor(item.portfolio_status)" variant="subtle">{{ formatStatus(item.portfolio_status) }}</UBadge></td>
              <td class="px-5 py-4 text-center">
                <UButton size="xs" :to="`/hr/portfolio/faculty/${item.documentId}`" icon="i-lucide-eye">View</UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
definePageMeta({ middleware: ['auth', 'role'], role: ['HR', 'Admin'] })
const { $api } = useNuxtApp()
const loading = ref(false)
const portfolios = ref<any[]>([])
const search = ref('')
const status = ref('')
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'For Verification', value: 'for_verification' },
  { label: 'Partially Verified', value: 'partially_verified' },
  { label: 'Verified', value: 'verified' },
  { label: 'Needs Correction', value: 'needs_correction' }
]

const PageHeader = defineComponent({
  props: { title: String, subtitle: String },
  setup(props) {
    return () => h('section', { class: 'rounded-[28px] bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-700 px-6 py-7 text-white shadow-xl' }, [
      h('p', { class: 'text-xs font-bold uppercase tracking-[0.18em] text-blue-100' }, 'Human Resource Portal'),
      h('h1', { class: 'mt-2 text-3xl font-black' }, props.title),
      h('p', { class: 'mt-2 max-w-3xl text-sm text-blue-100' }, props.subtitle)
    ])
  }
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return portfolios.value.filter((item: any) => {
    const text = [
      item.portfolio_no,
      item.portfolio_status,
      facultyName(item),
      item.faculty?.employee_no,
      item.faculty?.department?.name
    ].filter(Boolean).join(' ').toLowerCase()
    return (!q || text.includes(q)) && (!status.value || item.portfolio_status === status.value)
  })
})

const facultyName = (item: any) =>
  item?.faculty?.name || item?.faculty?.full_name || item?.faculty?.user?.username || 'Faculty Member'

const formatStatus = (value: string) =>
  String(value || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

const statusColor = (value: string) =>
  value === 'verified' ? 'success' :
  value === 'for_verification' ? 'warning' :
  value === 'partially_verified' ? 'info' :
  value === 'needs_correction' ? 'error' : 'neutral'

const loadPortfolios = async () => {
  loading.value = true
  try {
    const response: any = await $api('/faculty-portfolios', {
      query: {
        'populate[faculty][populate][department]': true,
        'populate[faculty][populate][user]': true,
        'pagination[page]': 1,
        'pagination[pageSize]': 1000,
        'sort[0]': 'updatedAt:desc'
      }
    })
    portfolios.value = response?.data || []
  } catch (error) {
    console.error(error)
    portfolios.value = []
  } finally {
    loading.value = false
  }
}
onMounted(loadPortfolios)
</script>
