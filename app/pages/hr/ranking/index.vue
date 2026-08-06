<template>
  <div class="space-y-6 pb-10">
    <section class="rounded-[28px] bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-700 px-6 py-7 text-white shadow-xl">
      <p class="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">Human Resource Portal</p>
      <h1 class="mt-2 text-3xl font-black">Faculty Ranking Management</h1>
      <p class="mt-2 max-w-3xl text-sm text-blue-100">
        Compute and review faculty and dean ranking results using portfolio points,
        evaluation points, rank bands, and the official salary-rate table.
      </p>
    </section>

    <section class="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <SummaryCard label="Personnel" :value="summary.total" icon="i-lucide-users" />
      <SummaryCard label="Computed" :value="summary.computed" icon="i-lucide-calculator" />
      <SummaryCard label="Pending" :value="summary.pending" icon="i-lucide-clock-3" />
      <SummaryCard label="Rate Missing" :value="summary.rateMissing" icon="i-lucide-triangle-alert" />
    </section>

    <section class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-1 flex-col gap-3 sm:flex-row">
          <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Search faculty or department..." class="w-full sm:max-w-md" />
          <USelectMenu v-model="selectedRole" :items="roleOptions" value-key="value" class="w-full sm:w-48" />
          <USelectMenu v-model="selectedDepartment" :items="departmentOptions" value-key="value" class="w-full sm:w-60" />
          <USelectMenu v-model="selectedStatus" :items="statusOptions" value-key="value" class="w-full sm:w-56" />
        </div>
        <UButton icon="i-lucide-refresh-cw" :loading="loading" @click="loadData">Refresh</UButton>
      </div>
    </section>

    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="i in 6" :key="i" class="h-24 rounded-2xl" />
    </div>

    <section v-else-if="loadError" class="rounded-2xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/20">
      <UIcon name="i-lucide-triangle-alert" class="mx-auto size-10 text-red-600" />
      <h2 class="mt-4 font-bold">Unable to load ranking records</h2>
      <p class="mt-2 text-sm text-gray-500">{{ loadError }}</p>
    </section>

    <section v-else class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h2 class="font-bold text-gray-900 dark:text-white">Faculty and Dean Rankings</h2>
        <p class="mt-1 text-xs text-gray-500">Showing {{ filteredRows.length }} of {{ rows.length }} records.</p>
      </div>

      <div v-if="!filteredRows.length" class="px-6 py-16 text-center text-sm text-gray-500">
        No ranking records found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[1500px] text-sm">
          <thead class="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40">
            <tr>
              <th class="px-5 py-3 text-left">Personnel</th>
              <th class="px-4 py-3 text-left">Department</th>
              <th class="px-4 py-3 text-center">
                Educational Qualification
              </th>
              <th class="px-4 py-3 text-center">Loyalty</th>
              <th class="px-4 py-3 text-center">Evaluation</th>
              <th class="px-4 py-3 text-center">
                Corporate Social Responsibility
              </th>
              <th class="px-4 py-3 text-center">Portfolio Total</th>
              <th class="px-4 py-3 text-center">Ranking Total</th>
              <th class="px-4 py-3 text-left">Rank</th>
              <th class="px-4 py-3 text-right">Salary Rate</th>
              <th class="px-4 py-3 text-center">Status</th>
              <th class="px-5 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="row in filteredRows" :key="row.teacher.documentId" class="hover:bg-gray-50/80 dark:hover:bg-gray-950/30">
              <td class="px-5 py-4">
                <p class="font-bold text-gray-900 dark:text-white">{{ teacherName(row.teacher) }}</p>
                <p class="mt-1 text-xs text-gray-500">{{ row.teacher.employee_no || row.teacher.user?.username || 'N/A' }} · {{ teacherRole(row.teacher) }}</p>
              </td>
              <td class="px-4 py-4">{{ row.teacher.department?.name || 'Not specified' }}</td>
              <td class="px-4 py-4 text-center">
                <UBadge color="info" variant="subtle">
                  {{
                    points(
                      row.ranking?.educational_qualification_total_points,
                    )
                  }}
                </UBadge>
              </td>

              <td class="px-4 py-4 text-center">
                {{ points(row.ranking?.loyalty_points) }}
              </td>

              <td class="px-4 py-4 text-center font-semibold">
                <UBadge color="success" variant="subtle">
                  {{ points(row.ranking?.evaluation_points) }}
                </UBadge>
              </td>

              <td class="px-4 py-4 text-center">
                {{ points(row.ranking?.csr_points) }}
              </td>

              <td class="px-4 py-4 text-center font-semibold">
                <UBadge color="neutral" variant="subtle">
                  {{ points(row.ranking?.total_portfolio_points) }}
                </UBadge>
              </td>

              <td class="px-4 py-4 text-center">
                <UBadge color="primary" variant="subtle">
                  {{ points(row.ranking?.total_ranking_points) }}
                </UBadge>
              </td>
              <td class="px-4 py-4">{{ row.ranking?.rank_name || 'Not assigned' }}</td>
              <td class="px-4 py-4 text-right">
                <span
                  v-if="getAssignedSalaryRate(row.ranking) !== null"
                  class="font-black text-gray-900 dark:text-white"
                >
                  {{ currency(getAssignedSalaryRate(row.ranking)) }}
                </span>

                <span
                  v-else
                  class="text-xs font-semibold text-gray-500"
                >
                  Not configured
                </span>
              </td>
              <td class="px-4 py-4 text-center">
                <UBadge v-if="row.ranking" :color="row.ranking.rate_assignment_status === 'not_configured' ? 'warning' : 'success'" variant="subtle">
                  {{ row.ranking.rate_assignment_status === 'not_configured' ? 'Rate Missing' : 'Computed' }}
                </UBadge>
                <UBadge v-else color="neutral" variant="subtle">Not Computed</UBadge>
              </td>
              <td class="px-5 py-4">
                <div class="flex justify-center gap-2">
                  <UButton size="xs" :icon="row.ranking ? 'i-lucide-refresh-cw' : 'i-lucide-calculator'" @click="openCompute(row)">
                    {{ row.ranking ? 'Recompute' : 'Compute' }}
                  </UButton>
                  <UButton v-if="row.ranking" size="xs" color="neutral" variant="soft" icon="i-lucide-eye" :to="`/hr/ranking/faculty/${row.teacher.documentId}?ranking=${row.ranking.documentId}`">
                    View
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <UModal v-model:open="computeOpen" :ui="{ content: 'max-w-2xl' }">
      <template #content>
        <div class="rounded-[28px] bg-white dark:bg-gray-900">
          <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <h2 class="text-lg font-bold">{{ selectedRow?.ranking ? 'Recompute Ranking' : 'Compute Ranking' }}</h2>
            <p class="mt-1 text-sm text-gray-500">{{ selectedRow ? teacherName(selectedRow.teacher) : '' }}</p>
          </div>
          <UForm :state="form" class="space-y-5 p-6" @submit="computeRanking">
            <UFormField label="Ranking Scheme" required>
              <USelectMenu v-model="form.ranking_scheme_document_id" :items="schemeOptions" value-key="value" class="w-full" />
            </UFormField>
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="School Year" required>
                <UInput v-model="form.school_year" class="w-full" />
              </UFormField>
              <UFormField label="Semester" required>
                <USelectMenu v-model="form.semester" :items="semesterOptions" value-key="value" class="w-full" />
              </UFormField>
            </div>
            <div class="flex justify-end gap-2 border-t border-gray-200 pt-5 dark:border-gray-800">
              <UButton color="neutral" variant="soft" @click="closeCompute">Cancel</UButton>
              <UButton type="submit" icon="i-lucide-calculator" :loading="computing">Compute Ranking</UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({ middleware: ['auth', 'role'], role: ['HR', 'Admin'] })

const { $api } = useNuxtApp()
const toast = useToast()

const loading = ref(false)
const computing = ref(false)
const loadError = ref('')
const teachers = ref<any[]>([])
const rankings = ref<any[]>([])
const schemes = ref<any[]>([])

const searchQuery = ref('')
const selectedRole = ref('all')
const selectedDepartment = ref('all')
const selectedStatus = ref('all')
const computeOpen = ref(false)
const selectedRow = ref<any>(null)

const form = reactive({ ranking_scheme_document_id: '', school_year: '2026-2027', semester: '1st Semester' })

const semesterOptions = [
  { label: '1st Semester', value: '1st Semester' },
  { label: '2nd Semester', value: '2nd Semester' },
  { label: 'Summer', value: 'Summer' },
  { label: 'Annual', value: 'Annual' },
]
const roleOptions = [
  { label: 'All Roles', value: 'all' },
  { label: 'Faculty', value: 'Faculty' },
  { label: 'Dean', value: 'Dean' },
]
const statusOptions = [
  { label: 'All States', value: 'all' },
  { label: 'Computed', value: 'computed' },
  { label: 'Not Computed', value: 'pending' },
  { label: 'Rate Missing', value: 'rate_missing' },
]

const activeScheme = computed(() => schemes.value.find((s:any) => s.is_active === true && s.scheme_status === 'active'))
const schemeOptions = computed(() => schemes.value.map((s:any) => ({ label: `${s.name} (${s.academic_year || s.version})`, value: s.documentId })))
const departmentOptions = computed(() => [
  { label: 'All Departments', value: 'all' },
  ...Array.from(new Set(teachers.value.map((t:any) => t.department?.name).filter(Boolean))).sort().map((v:any) => ({ label: v, value: v })),
])

const teacherName = (t:any) => t?.name || t?.full_name || t?.user?.username || 'Faculty Member'
const teacherRole = (t:any) => t?.user?.role?.name || t?.user?.role?.type || t?.role || 'Faculty'

const rows = computed(() => teachers.value.map((teacher:any) => ({
  teacher,
  ranking: rankings.value.find((r:any) => r?.teacher?.documentId === teacher.documentId) || null,
})))

const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return rows.value.filter((row:any) => {
    const role = teacherRole(row.teacher)
    const dept = row.teacher.department?.name || ''
    const text = [teacherName(row.teacher), row.teacher.employee_no, row.teacher.user?.username, dept, role].filter(Boolean).join(' ').toLowerCase()
    const statusOk = selectedStatus.value === 'all' ||
      (selectedStatus.value === 'computed' && row.ranking) ||
      (selectedStatus.value === 'pending' && !row.ranking) ||
      (selectedStatus.value === 'rate_missing' && row.ranking?.rate_assignment_status === 'not_configured')
    return (!q || text.includes(q)) &&
      (selectedRole.value === 'all' || role === selectedRole.value) &&
      (selectedDepartment.value === 'all' || dept === selectedDepartment.value) && statusOk
  })
})

const summary = computed(() => ({
  total: rows.value.length,
  computed: rows.value.filter((r:any) => r.ranking).length,
  pending: rows.value.filter((r:any) => !r.ranking).length,
  rateMissing: rows.value.filter((r:any) => r.ranking?.rate_assignment_status === 'not_configured').length,
}))

const SummaryCard = defineComponent({
  props: { label: String, value: [String, Number], icon: String },
  setup(props) {
    return () => h('div', { class: 'rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900' }, [
      h('div', { class: 'flex items-center justify-between gap-3' }, [
        h('div', {}, [
          h('p', { class: 'text-xs text-gray-500' }, props.label),
          h('p', { class: 'mt-2 text-2xl font-black text-gray-900 dark:text-white' }, String(props.value ?? 0)),
        ]),
        h(resolveComponent('UIcon'), { name: props.icon, class: 'size-5 text-blue-600' }),
      ]),
    ])
  },
})

const points = (value: unknown) => {
  const parsed = Number(value ?? 0)

  if (!Number.isFinite(parsed)) {
    return '0'
  }

  return Number.isInteger(parsed)
    ? String(parsed)
    : String(parsed).replace(/\.?0+$/, '')
}

const getAssignedSalaryRate = (
  ranking: any,
): number | null => {
  const value =
    ranking?.salary_rate ??
    ranking?.salary_rate_record?.max_rate

  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed)
    ? parsed
    : null
}

const currency = (value: unknown) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return 'Not configured'
  }

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed)
}

const openCompute = (row:any) => {
  selectedRow.value = row
  const scheme = row.ranking?.ranking_scheme || activeScheme.value || schemes.value[0]
  form.ranking_scheme_document_id = scheme?.documentId || ''
  form.school_year = row.ranking?.school_year || scheme?.academic_year || '2026-2027'
  form.semester = row.ranking?.semester || '1st Semester'
  computeOpen.value = true
}
const closeCompute = () => { computeOpen.value = false; selectedRow.value = null }

const computeRanking = async () => {
  if (!selectedRow.value?.teacher?.documentId || !form.ranking_scheme_document_id) return
  computing.value = true
  try {
    await $api(`/faculty-rankings/compute/${selectedRow.value.teacher.documentId}`, {
      method: 'POST',
      body: { data: { ...form } },
    })
    toast.add({ title: 'Ranking computed', color: 'success', icon: 'i-lucide-circle-check' })
    closeCompute()
    await loadData()
  } catch (error:any) {
    toast.add({ title: 'Unable to compute ranking', description: error?.data?.error?.message || error?.message, color: 'error' })
  } finally { computing.value = false }
}

const loadData = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const [t, r, s]:any[] = await Promise.all([
      $api('/teachers', { query: { 'populate[department]': true, 'populate[user][populate][role]': true, 'pagination[pageSize]': 1000 } }),
      $api('/faculty-rankings', {
        query: {
          'populate[teacher]': true,
          'populate[ranking_scheme]': true,
          'populate[rank_band]': true,
          'populate[salary_rate_record]': true,
          'pagination[page]': 1,
          'pagination[pageSize]': 1000,
        },
      }),
      $api('/ranking-schemes', { query: { 'filters[is_active][$eq]': true, 'filters[scheme_status][$eq]': 'active', 'pagination[pageSize]': 100 } }),
    ])
    teachers.value = (t?.data || []).filter((x:any) => ['Faculty', 'Dean'].includes(teacherRole(x)))
    rankings.value = r?.data || []
    schemes.value = s?.data || []
  } catch (error:any) {
    loadError.value = error?.data?.error?.message || error?.message || 'Unable to load ranking data.'
  } finally { loading.value = false }
}

onMounted(loadData)
</script>
