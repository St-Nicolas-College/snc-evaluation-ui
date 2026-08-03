<template>
  <div class="space-y-6 pb-10">
    <div class="flex items-center justify-between gap-3">
      <UButton to="/hr/portfolio" color="neutral" variant="ghost" icon="i-lucide-arrow-left">Back to Portfolios</UButton>
      <UButton icon="i-lucide-refresh-cw" color="neutral" variant="outline" :loading="loading" @click="loadPortfolio">Refresh</UButton>
    </div>

    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-44 rounded-3xl" />
      <USkeleton class="h-[480px] rounded-3xl" />
    </div>

    <section v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-700">
      {{ errorMessage }}
    </section>

    <template v-else-if="portfolio">
      <section class="rounded-[28px] bg-gradient-to-br from-indigo-950 via-blue-950 to-cyan-950 px-6 py-7 text-white shadow-xl">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">HR Portfolio Viewer</p>
        <h1 class="mt-2 text-3xl font-black">{{ facultyName }}</h1>
        <p class="mt-2 text-sm text-blue-100">{{ departmentName }} · {{ portfolio.portfolio_no }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <UBadge color="neutral" variant="subtle">{{ Math.round(Number(portfolio.completion_percentage || 0)) }}% Complete</UBadge>
          <UBadge :color="statusColor(portfolio.portfolio_status)" variant="subtle">{{ formatStatus(portfolio.portfolio_status) }}</UBadge>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <Stat label="Entries" :value="entries.length" />
        <Stat label="Draft" :value="count('draft')" />
        <Stat label="For Verification" :value="count('for_verification')" />
        <Stat label="Verified" :value="count('verified')" />
        <Stat label="Needs Correction" :value="count('needs_correction')" />
      </section>

      <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2 class="font-bold">Portfolio Entries</h2>
        </div>
        <div v-if="!entries.length" class="p-16 text-center text-sm text-gray-500">No portfolio entries.</div>
        <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
          <article v-for="entry in entries" :key="entry.documentId" class="flex flex-col gap-4 px-5 py-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div class="flex flex-wrap gap-2">
                <UBadge color="neutral" variant="subtle">{{ formatStatus(entry.entry_type) }}</UBadge>
                <UBadge :color="statusColor(entry.verification_status)" variant="subtle">{{ formatStatus(entry.verification_status) }}</UBadge>
              </div>
              <h3 class="mt-3 font-bold">{{ entry.title }}</h3>
              <p v-if="entry.description" class="mt-2 max-w-3xl text-sm text-gray-600 dark:text-gray-300">{{ entry.description }}</p>
            </div>
            <UButton size="sm" :to="`/hr/portfolio/entry/${entry.documentId}`" icon="i-lucide-eye">Review Entry</UButton>
          </article>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
definePageMeta({ middleware: ['auth', 'role'], role: ['HR', 'Admin'] })
const route = useRoute()
const { $api } = useNuxtApp()
const loading = ref(false)
const errorMessage = ref('')
const portfolio = ref<any>(null)

const entries = computed(() => Array.isArray(portfolio.value?.entries) ? portfolio.value.entries : [])
const facultyName = computed(() => portfolio.value?.faculty?.name || portfolio.value?.faculty?.full_name || portfolio.value?.faculty?.user?.username || 'Faculty Member')
const departmentName = computed(() => portfolio.value?.faculty?.department?.name || 'Department not specified')

const Stat = defineComponent({
  props: { label: String, value: [String, Number] },
  setup(props) {
    return () => h('div', { class: 'rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900' }, [
      h('p', { class: 'text-xs text-gray-500' }, props.label),
      h('p', { class: 'mt-2 text-xl font-black' }, String(props.value ?? 0))
    ])
  }
})
const count = (status: string) => entries.value.filter((x: any) => x.verification_status === status).length
const formatStatus = (value: string) => String(value || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
const statusColor = (value: string) => value === 'verified' ? 'success' : value === 'for_verification' ? 'warning' : value === 'needs_correction' || value === 'rejected' || value === 'expired' ? 'error' : 'neutral'

const getId = () => {
  const v: any = route.params.documentId ?? Object.values(route.params || {})[0]
  return String(Array.isArray(v) ? v[0] : v || '').trim()
}
const loadPortfolio = async () => {
  const id = getId()
  if (!id) return
  loading.value = true
  errorMessage.value = ''
  try {
    const response: any = await $api(`/faculty-portfolios/${encodeURIComponent(id)}`, {
      query: {
        'populate[faculty][populate][department]': true,
        'populate[faculty][populate][user]': true,
        'populate[entries][populate][evidence][populate][file]': true,
        'populate[entries][populate][verification_history][populate][reviewer]': true
      }
    })
    portfolio.value = response?.data || response || null
  } catch (error: any) {
    errorMessage.value = error?.data?.error?.message || error?.message || 'Unable to load portfolio.'
  } finally {
    loading.value = false
  }
}
onMounted(loadPortfolio)
</script>
