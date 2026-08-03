<template>
  <div class="space-y-6 pb-10">
    <section
      class="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7"
    >
      <div class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />

      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex items-start gap-4">
          <div class="hidden size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 sm:flex">
            <UIcon name="i-lucide-folder-check" class="size-7" />
          </div>

          <div>
            <div class="mb-2 flex flex-wrap gap-2 text-xs">
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
                Dean Portal
              </span>

              <span
                v-if="departmentName"
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1"
              >
                {{ departmentName }}
              </span>
            </div>

            <h1 class="text-2xl font-bold sm:text-3xl">
              Department Faculty Portfolios
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Review portfolio completion, submitted qualifications, evidence,
              and verification progress for faculty members in your department.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <HeroStat label="Faculty" :value="summary.total" />
          <HeroStat label="Pending" :value="summary.pending" />
          <HeroStat label="Verified" :value="summary.verified" />
        </div>
      </div>
    </section>

    <section class="grid grid-cols-2 gap-3 xl:grid-cols-5">
      <KpiCard label="Portfolios" :value="summary.total" icon="i-lucide-folders" tone="blue" />
      <KpiCard label="For Verification" :value="summary.pending" icon="i-lucide-clock-3" tone="amber" />
      <KpiCard label="Verified Entries" :value="summary.verifiedEntries" icon="i-lucide-badge-check" tone="emerald" />
      <KpiCard label="Needs Correction" :value="summary.needsCorrection" icon="i-lucide-file-warning" tone="red" />
      <KpiCard label="Average Completion" :value="`${summary.averageCompletion}%`" icon="i-lucide-chart-no-axes-combined" tone="violet" />
    </section>

    <section class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-1 flex-col gap-3 sm:flex-row">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search faculty, employee number, or portfolio..."
            class="w-full sm:max-w-md"
            @keyup.enter="loadPortfolios"
          />

          <USelectMenu
            v-model="selectedPortfolioStatus"
            :items="portfolioStatusOptions"
            value-key="value"
            class="w-full sm:w-56"
          />
        </div>

        <div class="flex gap-2">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-rotate-ccw"
            @click="clearFilters"
          >
            Reset
          </UButton>

          <UButton
            icon="i-lucide-refresh-cw"
            :loading="loading"
            @click="loadPortfolios"
          >
            Refresh
          </UButton>
        </div>
      </div>
    </section>

    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="index in 6" :key="index" class="h-20 rounded-2xl" />
    </div>

    <section
      v-else-if="loadError"
      class="rounded-2xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <UIcon name="i-lucide-triangle-alert" class="mx-auto size-9 text-red-600" />
      <h2 class="mt-4 font-bold">Unable to load department portfolios</h2>
      <p class="mt-2 text-sm text-gray-500">{{ loadError }}</p>
      <UButton class="mt-5" @click="loadPortfolios">Try Again</UButton>
    </section>

    <section
      v-else
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h2 class="font-bold text-gray-900 dark:text-white">
          Faculty Portfolio Overview
        </h2>

        <p class="mt-1 text-xs text-gray-500">
          Showing {{ portfolios.length }} of {{ pagination.total }} portfolio records.
        </p>
      </div>

      <div v-if="!portfolios.length" class="px-6 py-16 text-center">
        <UIcon name="i-lucide-folder-search" class="mx-auto size-10 text-gray-400" />
        <h3 class="mt-4 font-bold">No portfolios found</h3>
        <p class="mt-2 text-sm text-gray-500">No faculty portfolios matched the selected filters.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[1160px] text-sm">
          <thead class="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40">
            <tr>
              <th class="px-5 py-3 text-left">Faculty</th>
              <th class="px-4 py-3 text-left">Portfolio No.</th>
              <th class="px-4 py-3 text-center">Completion</th>
              <th class="px-4 py-3 text-center">Entries</th>
              <th class="px-4 py-3 text-center">For Verification</th>
              <th class="px-4 py-3 text-center">Verified</th>
              <th class="px-4 py-3 text-center">Needs Correction</th>
              <th class="px-4 py-3 text-center">Portfolio Status</th>
              <th class="px-4 py-3 text-left">Updated</th>
              <th class="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="portfolio in portfolios"
              :key="portfolio.documentId"
              class="hover:bg-gray-50/80 dark:hover:bg-gray-950/30"
            >
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex size-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
                    {{ initials(getFacultyName(portfolio)) }}
                  </div>

                  <div>
                    <p class="font-bold text-gray-900 dark:text-white">
                      {{ getFacultyName(portfolio) }}
                    </p>

                    <p class="mt-0.5 text-xs text-gray-500">
                      {{ portfolio.faculty?.employee_no || portfolio.faculty?.user?.username || 'No employee number' }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-4 py-4 font-medium">{{ portfolio.portfolio_no }}</td>

              <td class="px-4 py-4">
                <div class="mx-auto w-28">
                  <div class="mb-1 text-center text-xs font-bold">
                    {{ Math.round(Number(portfolio.completion_percentage || 0)) }}%
                  </div>

                  <div class="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      class="h-full rounded-full bg-emerald-500"
                      :style="{ width: `${Math.min(Number(portfolio.completion_percentage || 0), 100)}%` }"
                    />
                  </div>
                </div>
              </td>

              <td class="px-4 py-4 text-center font-semibold">
                {{ portfolio.summary?.total_entries || 0 }}
              </td>

              <td class="px-4 py-4 text-center">
                <CountBadge :value="portfolio.summary?.for_verification || 0" tone="amber" />
              </td>

              <td class="px-4 py-4 text-center">
                <CountBadge :value="portfolio.summary?.verified || 0" tone="emerald" />
              </td>

              <td class="px-4 py-4 text-center">
                <CountBadge :value="portfolio.summary?.needs_correction || 0" tone="red" />
              </td>

              <td class="px-4 py-4 text-center">
                <UBadge :color="statusColor(portfolio.portfolio_status)" variant="subtle">
                  {{ formatStatus(portfolio.portfolio_status) }}
                </UBadge>
              </td>

              <td class="px-4 py-4 text-gray-500">
                {{ formatDate(portfolio.updatedAt) }}
              </td>

              <td class="px-5 py-4 text-center">
                <UButton
                  v-if="getPortfolioDocumentId(portfolio)"
                  size="xs"
                  icon="i-lucide-eye"
                  :to="`/dean/portfolio/faculty/${getPortfolioDocumentId(portfolio)}`"
                >
                  Review
                </UButton>

                <UBadge
                  v-else
                  color="error"
                  variant="subtle"
                  icon="i-lucide-triangle-alert"
                >
                  Missing ID
                </UBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
        <p class="text-xs text-gray-500">
          Page {{ pagination.page }} of {{ pagination.pageCount }}
        </p>

        <div class="flex gap-2">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-chevron-left"
            square
            :disabled="pagination.page <= 1"
            @click="changePage(pagination.page - 1)"
          />

          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-chevron-right"
            square
            :disabled="pagination.page >= pagination.pageCount"
            @click="changePage(pagination.page + 1)"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Dean']
})

const { $api } = useNuxtApp()

const loading = ref(false)
const loadError = ref('')
const portfolios = ref<any[]>([])
const departmentName = ref('')

const searchQuery = ref('')
const selectedPortfolioStatus = ref('')

const pagination = reactive({
  page: 1,
  pageSize: 20,
  pageCount: 1,
  total: 0
})

const portfolioStatusOptions = [
  { label: 'All Portfolio Statuses', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'For Verification', value: 'for_verification' },
  { label: 'Partially Verified', value: 'partially_verified' },
  { label: 'Verified', value: 'verified' },
  { label: 'Needs Correction', value: 'needs_correction' },
  { label: 'Archived', value: 'archived' }
]

const summary = computed(() => {
  const all = portfolios.value
  const completion = all.map(item => Number(item.completion_percentage || 0))

  return {
    total: pagination.total,
    pending: all.filter(item => Number(item.summary?.for_verification || 0) > 0).length,
    verified: all.filter(item => item.portfolio_status === 'verified').length,
    verifiedEntries: all.reduce((sum, item) => sum + Number(item.summary?.verified || 0), 0),
    needsCorrection: all.reduce((sum, item) => sum + Number(item.summary?.needs_correction || 0), 0),
    averageCompletion: completion.length
      ? Math.round(completion.reduce((sum, value) => sum + value, 0) / completion.length)
      : 0
  }
})

const HeroStat = defineComponent({
  props: { label: String, value: [String, Number] },
  setup(props) {
    return () =>
      h('div', { class: 'rounded-2xl border border-white/15 bg-white/10 p-3 text-center' }, [
        h('p', { class: 'text-2xl font-bold' }, String(props.value ?? 0)),
        h('p', { class: 'mt-1 text-[10px] uppercase tracking-wide text-emerald-100' }, props.label)
      ])
  }
})

const KpiCard = defineComponent({
  props: { label: String, value: [String, Number], icon: String, tone: String },
  setup(props) {
    const tones: any = {
      blue: 'border-blue-100 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20',
      amber: 'border-amber-100 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20',
      emerald: 'border-emerald-100 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20',
      red: 'border-red-100 bg-red-50/70 dark:border-red-900 dark:bg-red-950/20',
      violet: 'border-violet-100 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/20'
    }

    return () =>
      h('div', { class: `rounded-2xl border p-4 ${tones[props.tone]}` }, [
        h('div', { class: 'flex items-center justify-between' }, [
          h('div', {}, [
            h('p', { class: 'text-xs text-gray-500' }, props.label),
            h('p', { class: 'mt-2 text-2xl font-bold' }, String(props.value ?? 0))
          ]),
          h(resolveComponent('UIcon'), { name: props.icon, class: 'size-5' })
        ])
      ])
  }
})

const CountBadge = defineComponent({
  props: { value: [String, Number], tone: String },
  setup(props) {
    const tones: any = {
      amber: 'bg-amber-100 text-amber-700',
      emerald: 'bg-emerald-100 text-emerald-700',
      red: 'bg-red-100 text-red-700'
    }

    return () =>
      h('span', { class: `inline-flex min-w-8 justify-center rounded-full px-2 py-1 text-xs font-bold ${tones[props.tone]}` }, String(props.value ?? 0))
  }
})

const loadPortfolios = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const response: any = await $api('/faculty-portfolios/department', {
      query: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: searchQuery.value.trim() || undefined,
        portfolio_status: selectedPortfolioStatus.value || undefined
      }
    })

    portfolios.value = response?.data || []

    Object.assign(pagination, response?.meta?.pagination || {
      page: 1,
      pageSize: 20,
      pageCount: 1,
      total: 0
    })

    departmentName.value = response?.meta?.department?.name || ''
  } catch (error: any) {
    portfolios.value = []
    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to load department faculty portfolios.'
  } finally {
    loading.value = false
  }
}

const changePage = async (page: number) => {
  pagination.page = page
  await loadPortfolios()
}

const clearFilters = async () => {
  searchQuery.value = ''
  selectedPortfolioStatus.value = ''
  pagination.page = 1
  await loadPortfolios()
}

const getFacultyName = (portfolio: any) =>
  portfolio?.faculty?.name ||
  portfolio?.faculty?.full_name ||
  portfolio?.faculty?.user?.username ||
  'Faculty Member'

const getPortfolioDocumentId = (portfolio: any) => {
  const value =
    portfolio?.documentId ||
    portfolio?.document_id ||
    ''

  const documentId = String(value).trim()

  if (
    !documentId ||
    documentId === 'undefined' ||
    documentId === 'null'
  ) {
    return ''
  }

  return documentId
}

const initials = (name: string) =>
  String(name || '')
    .split(/\s+/)
    .slice(0, 2)
    .map(value => value.charAt(0).toUpperCase())
    .join('')

const formatStatus = (value: string) =>
  String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase())

const statusColor = (value: string) => {
  switch (value) {
    case 'verified':
      return 'success'
    case 'for_verification':
      return 'warning'
    case 'partially_verified':
      return 'info'
    case 'needs_correction':
      return 'error'
    default:
      return 'neutral'
  }
}

const formatDate = (value: any) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
}

watch(selectedPortfolioStatus, async () => {
  pagination.page = 1
  await loadPortfolios()
})

onMounted(loadPortfolios)
</script>
