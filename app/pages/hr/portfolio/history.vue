<template>
  <div class="space-y-6 pb-10">
    <Header title="Verification History" subtitle="Review the complete audit trail of HR portfolio decisions." />
    <section class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <UInput v-model="search" icon="i-lucide-search" placeholder="Search entry, reviewer, remarks..." class="w-full sm:max-w-md" />
    </section>
    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div v-if="loading" class="space-y-3 p-5"><USkeleton v-for="i in 6" :key="i" class="h-16 rounded-xl" /></div>
      <div v-else-if="!filtered.length" class="p-16 text-center text-sm text-gray-500">No verification history found.</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[900px] text-sm">
          <thead class="bg-gray-50 text-[10px] uppercase text-gray-500 dark:bg-gray-950/40">
            <tr><th class="px-5 py-3 text-left">Date</th><th class="px-4 py-3 text-left">Entry</th><th class="px-4 py-3 text-left">Previous</th><th class="px-4 py-3 text-left">New</th><th class="px-4 py-3 text-left">Reviewer</th><th class="px-5 py-3 text-left">Remarks</th></tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="row in filtered" :key="row.documentId || row.id">
              <td class="px-5 py-4">{{ formatDate(row.review_date) }}</td>
              <td class="px-4 py-4">{{ row.portfolio_entry?.title || 'Portfolio Entry' }}</td>
              <td class="px-4 py-4">{{ formatStatus(row.previous_status) }}</td>
              <td class="px-4 py-4"><UBadge :color="statusColor(row.new_status)" variant="subtle">{{ formatStatus(row.new_status) }}</UBadge></td>
              <td class="px-4 py-4">{{ row.reviewer?.username || row.reviewer?.email || 'System' }}</td>
              <td class="px-5 py-4">{{ row.remarks || '—' }}</td>
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
const rows = ref<any[]>([])
const search = ref('')
const Header = defineComponent({ props: { title: String, subtitle: String }, setup: p => () => h('section', { class: 'rounded-[28px] bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-700 px-6 py-7 text-white shadow-xl' }, [h('h1', { class: 'text-3xl font-black' }, p.title), h('p', { class: 'mt-2 text-sm text-blue-100' }, p.subtitle)]) })
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return rows.value.filter((x: any) => !q || [x.portfolio_entry?.title, x.reviewer?.username, x.reviewer?.email, x.remarks, x.new_status].filter(Boolean).join(' ').toLowerCase().includes(q))
})
const formatStatus = (v: string) => String(v || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
const statusColor = (v: string) => v === 'verified' ? 'success' : v === 'needs_correction' || v === 'rejected' || v === 'expired' ? 'error' : 'warning'
const formatDate = (v: any) => v ? new Date(v).toLocaleString('en-PH') : 'N/A'
const load = async () => {
  loading.value = true
  try {
    const r: any = await $api('/portfolio-verifications', {
      query: {
        'populate[portfolio_entry]': true,
        'populate[reviewer]': true,
        'pagination[page]': 1,
        'pagination[pageSize]': 1000,
        'sort[0]': 'review_date:desc'
      }
    })
    rows.value = r?.data || []
  } finally { loading.value = false }
}
onMounted(load)
</script>
