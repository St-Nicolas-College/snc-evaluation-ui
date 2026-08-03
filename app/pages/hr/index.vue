<template>
  <div class="space-y-6 pb-10">
    <section class="rounded-[28px] bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-700 px-6 py-7 text-white shadow-xl">
      <p class="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">Human Resource Portal</p>
      <h1 class="mt-2 text-3xl font-black">HR Dashboard</h1>
      <p class="mt-2 max-w-3xl text-sm leading-6 text-blue-100">
        Monitor faculty portfolios, verification workload, expiring credentials,
        and ranking readiness.
      </p>
    </section>

    <section class="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <StatCard label="Total Portfolios" :value="stats.totalPortfolios" icon="i-lucide-folders" />
      <StatCard label="For Verification" :value="stats.forVerification" icon="i-lucide-list-checks" />
      <StatCard label="Verified Entries" :value="stats.verified" icon="i-lucide-badge-check" />
      <StatCard label="Needs Correction" :value="stats.needsCorrection" icon="i-lucide-file-warning" />
    </section>

    <section class="grid gap-4 xl:grid-cols-2">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-bold">Verification Queue</h2>
            <p class="mt-1 text-xs text-gray-500">Recently submitted portfolio entries.</p>
          </div>
          <UButton to="/hr/portfolio/verification" size="sm" icon="i-lucide-arrow-right">Open Queue</UButton>
        </div>

        <div v-if="loading" class="mt-5 space-y-3">
          <USkeleton v-for="i in 4" :key="i" class="h-16 rounded-xl" />
        </div>

        <div v-else-if="!queue.length" class="mt-5 rounded-xl bg-gray-50 p-8 text-center text-sm text-gray-500 dark:bg-gray-950/40">
          No submitted entries waiting for verification.
        </div>

        <div v-else class="mt-5 divide-y divide-gray-100 dark:divide-gray-800">
          <div v-for="entry in queue" :key="entry.documentId" class="flex items-center justify-between gap-4 py-3">
            <div class="min-w-0">
              <p class="truncate font-semibold">{{ entry.title }}</p>
              <p class="mt-1 truncate text-xs text-gray-500">{{ facultyName(entry) }} · {{ formatStatus(entry.entry_type) }}</p>
            </div>
            <UButton :to="`/hr/portfolio/entry/${entry.documentId}`" size="xs" color="neutral" variant="soft">Review</UButton>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 class="font-bold">Quick Access</h2>
        <div class="mt-5 grid gap-3 sm:grid-cols-2">
          <QuickLink label="All Portfolios" icon="i-lucide-folders" to="/hr/portfolio" />
          <QuickLink label="Verification Queue" icon="i-lucide-list-checks" to="/hr/portfolio/verification" />
          <QuickLink label="Verification History" icon="i-lucide-history" to="/hr/portfolio/history" />
          <QuickLink label="Expiring Credentials" icon="i-lucide-calendar-clock" to="/hr/portfolio/expiring" />
          <QuickLink label="Ranking Overview" icon="i-lucide-trophy" to="/hr/ranking" />
          <QuickLink label="Reports" icon="i-lucide-files" to="/hr/reports" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
definePageMeta({ middleware: ['auth', 'role'], role: ['HR', 'Admin'] })

const { $api } = useNuxtApp()
const loading = ref(false)
const queue = ref<any[]>([])
const stats = reactive({
  totalPortfolios: 0,
  forVerification: 0,
  verified: 0,
  needsCorrection: 0
})

const StatCard = defineComponent({
  props: { label: String, value: [String, Number], icon: String },
  setup(props) {
    return () => h('div', { class: 'rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900' }, [
      h('div', { class: 'flex items-center justify-between' }, [
        h('div', {}, [
          h('p', { class: 'text-xs text-gray-500' }, props.label),
          h('p', { class: 'mt-2 text-2xl font-black' }, String(props.value ?? 0))
        ]),
        h(resolveComponent('UIcon'), { name: props.icon, class: 'size-5' })
      ])
    ])
  }
})

const QuickLink = defineComponent({
  props: { label: String, icon: String, to: String },
  setup(props) {
    return () => h(resolveComponent('UButton'), {
      to: props.to,
      color: 'neutral',
      variant: 'soft',
      icon: props.icon,
      block: true,
      class: 'justify-start'
    }, () => props.label)
  }
})

const facultyName = (entry: any) =>
  entry?.faculty_portfolio?.faculty?.name ||
  entry?.faculty_portfolio?.faculty?.full_name ||
  entry?.faculty_portfolio?.faculty?.user?.username ||
  'Faculty Member'

const formatStatus = (value: string) =>
  String(value || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

const loadDashboard = async () => {
  loading.value = true
  try {
    const [queueRes, portfolioRes]: any[] = await Promise.all([
      $api('/portfolio-entries/verification-queue', {
        query: { page: 1, pageSize: 5, verification_status: 'for_verification' }
      }),
      $api('/faculty-portfolios', {
        query: { 'pagination[page]': 1, 'pagination[pageSize]': 1000 }
      })
    ])

    queue.value = queueRes?.data || []
    stats.forVerification = queueRes?.meta?.pagination?.total || queue.value.length
    stats.totalPortfolios = portfolioRes?.meta?.pagination?.total || portfolioRes?.data?.length || 0

    const allStatuses: any = await $api('/portfolio-entries/verification-queue', {
      query: { page: 1, pageSize: 1000, verification_status: '' }
    })

    const rows = allStatuses?.data || []
    stats.verified = rows.filter((x: any) => x.verification_status === 'verified').length
    stats.needsCorrection = rows.filter((x: any) => x.verification_status === 'needs_correction').length
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>
