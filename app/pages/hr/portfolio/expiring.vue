<template>
  <div class="space-y-6 pb-10">
    <Header title="Expiring Credentials" subtitle="Monitor licenses, certifications, and supporting records nearing expiration." />
    <section class="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <Card label="Expired" :value="summary.expired" />
      <Card label="Within 30 Days" :value="summary.days30" />
      <Card label="Within 60 Days" :value="summary.days60" />
      <Card label="Within 90 Days" :value="summary.days90" />
    </section>
    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div v-if="loading" class="space-y-3 p-5"><USkeleton v-for="i in 6" :key="i" class="h-16 rounded-xl" /></div>
      <div v-else-if="!rows.length" class="p-16 text-center text-sm text-gray-500">No expiring credentials found.</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[900px] text-sm">
          <thead class="bg-gray-50 text-[10px] uppercase text-gray-500 dark:bg-gray-950/40">
            <tr><th class="px-5 py-3 text-left">Faculty / Dean</th><th class="px-4 py-3 text-left">Credential</th><th class="px-4 py-3 text-left">Type</th><th class="px-4 py-3 text-left">Expiration</th><th class="px-4 py-3 text-center">Days</th><th class="px-5 py-3 text-center">Action</th></tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="row in rows" :key="row.documentId">
              <td class="px-5 py-4">{{ facultyName(row) }}</td>
              <td class="px-4 py-4 font-semibold">{{ row.title }}</td>
              <td class="px-4 py-4">{{ formatStatus(row.entry_type) }}</td>
              <td class="px-4 py-4">{{ formatDate(row.expiration_date) }}</td>
              <td class="px-4 py-4 text-center">{{ daysUntil(row.expiration_date) }}</td>
              <td class="px-5 py-4 text-center"><UButton :to="`/hr/portfolio/entry/${row.documentId}`" size="xs">Review</UButton></td>
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
const Header = defineComponent({ props: { title: String, subtitle: String }, setup: p => () => h('section', { class: 'rounded-[28px] bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-700 px-6 py-7 text-white shadow-xl' }, [h('h1', { class: 'text-3xl font-black' }, p.title), h('p', { class: 'mt-2 text-sm text-blue-100' }, p.subtitle)]) })
const Card = defineComponent({ props: { label: String, value: [String, Number] }, setup: p => () => h('div', { class: 'rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900' }, [h('p', { class: 'text-xs text-gray-500' }, p.label), h('p', { class: 'mt-2 text-2xl font-black' }, String(p.value ?? 0))]) })
const daysUntil = (v: any) => Math.ceil((new Date(v).getTime() - Date.now()) / 86400000)
const summary = computed(() => ({
  expired: rows.value.filter(x => daysUntil(x.expiration_date) < 0).length,
  days30: rows.value.filter(x => daysUntil(x.expiration_date) >= 0 && daysUntil(x.expiration_date) <= 30).length,
  days60: rows.value.filter(x => daysUntil(x.expiration_date) > 30 && daysUntil(x.expiration_date) <= 60).length,
  days90: rows.value.filter(x => daysUntil(x.expiration_date) > 60 && daysUntil(x.expiration_date) <= 90).length
}))
const facultyName = (x: any) => x?.faculty_portfolio?.faculty?.name || x?.faculty_portfolio?.faculty?.full_name || x?.faculty_portfolio?.faculty?.user?.username || 'Faculty Member'
const formatStatus = (v: string) => String(v || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
const formatDate = (v: any) => v ? new Date(v).toLocaleDateString('en-PH') : 'N/A'
const load = async () => {
  loading.value = true
  try {
    const r: any = await $api('/portfolio-entries', {
      query: {
        'filters[expiration_date][$notNull]': true,
        'populate[faculty_portfolio][populate][faculty][populate][user]': true,
        'pagination[page]': 1,
        'pagination[pageSize]': 1000,
        'sort[0]': 'expiration_date:asc'
      }
    })
    rows.value = r?.data || []
  } finally { loading.value = false }
}
onMounted(load)
</script>
