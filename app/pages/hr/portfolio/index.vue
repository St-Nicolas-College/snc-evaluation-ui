<template>
  <div class="space-y-6 pb-10">
    <section class="rounded-[28px] bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-700 px-6 py-7 text-white shadow-xl">
      <p class="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
        Human Resource Portal
      </p>
      <h1 class="mt-2 text-3xl font-black">Faculty Portfolios</h1>
      <p class="mt-2 max-w-3xl text-sm text-blue-100">
        View faculty and dean records, then open a personnel profile to manage portfolio entries.
      </p>
    </section>

    <section class="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <StatCard label="Total Personnel" :value="summary.total" icon="i-lucide-users" />
      <StatCard label="Faculty" :value="summary.faculty" icon="i-lucide-presentation" />
      <StatCard label="Deans" :value="summary.deans" icon="i-lucide-building-2" />
      <StatCard label="Portfolio Entries" :value="summary.totalEntries" icon="i-lucide-files" />
    </section>

    <section class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-1 flex-col gap-3 sm:flex-row">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search name, employee number, or department..."
            class="w-full sm:max-w-md"
          />

          <USelectMenu
            v-model="selectedRole"
            :items="roleOptions"
            value-key="value"
            class="w-full sm:w-52"
          />

          <USelectMenu
            v-model="selectedDepartment"
            :items="departmentOptions"
            value-key="value"
            class="w-full sm:w-60"
          />
        </div>

        <div class="flex gap-2">
          <UButton color="neutral" variant="outline" icon="i-lucide-rotate-ccw" @click="resetFilters">
            Reset
          </UButton>

          <UButton icon="i-lucide-refresh-cw" :loading="loading" @click="loadTeachers">
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
      <h2 class="mt-4 font-bold text-gray-900 dark:text-white">
        Unable to load personnel records
      </h2>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {{ loadError }}
      </p>
      <UButton class="mt-5" @click="loadTeachers">Try Again</UButton>
    </section>

    <section
      v-else
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h2 class="font-bold text-gray-900 dark:text-white">
          Faculty and Dean Records
        </h2>
        <p class="mt-1 text-xs text-gray-500">
          Showing {{ filteredTeachers.length }} of {{ teachers.length }} records.
        </p>
      </div>

      <div v-if="!filteredTeachers.length" class="px-6 py-16 text-center">
        <UIcon name="i-lucide-user-search" class="mx-auto size-10 text-gray-400" />
        <h3 class="mt-4 font-bold text-gray-900 dark:text-white">
          No personnel records found
        </h3>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[1040px] text-sm">
          <thead class="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40">
            <tr>
              <th class="px-5 py-3 text-left">Personnel</th>
              <th class="px-4 py-3 text-left">Employee No.</th>
              <th class="px-4 py-3 text-left">Role</th>
              <th class="px-4 py-3 text-left">Department</th>
              <th class="px-4 py-3 text-center">Entries</th>
              <th class="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="teacher in filteredTeachers"
              :key="teacher.documentId || teacher.id"
              class="hover:bg-gray-50/80 dark:hover:bg-gray-950/30"
            >
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex size-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
                    {{ initials(getTeacherName(teacher)) }}
                  </div>
                  <div class="min-w-0">
                    <p class="truncate font-bold text-gray-900 dark:text-white">
                      {{ getTeacherName(teacher) }}
                    </p>
                    <p class="mt-0.5 truncate text-xs text-gray-500">
                      {{ teacher.user?.email || 'No email address' }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-4 py-4">
                {{ teacher.employee_no || teacher.user?.username || 'N/A' }}
              </td>

              <td class="px-4 py-4">
                <UBadge color="neutral" variant="subtle">
                  {{ getTeacherRole(teacher) }}
                </UBadge>
              </td>

              <td class="px-4 py-4">
                {{ teacher.department?.name || 'Not specified' }}
              </td>

              <td class="px-4 py-4 text-center">
                <UBadge color="info" variant="subtle">
                  {{ teacher.portfolio_entries?.length || 0 }}
                </UBadge>
              </td>

              <td class="px-5 py-4 text-center">
                <UButton
                  v-if="getTeacherDocumentId(teacher)"
                  size="xs"
                  icon="i-lucide-folder-open"
                  :to="`/hr/portfolio/faculty/${getTeacherDocumentId(teacher)}`"
                >
                  Manage Portfolio
                </UButton>

                <UBadge v-else color="error" variant="subtle">
                  Missing ID
                </UBadge>
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

definePageMeta({
  middleware: ['auth', 'role'],
  role: ['HR', 'Admin']
})

const { $api } = useNuxtApp()

const loading = ref(false)
const loadError = ref('')
const teachers = ref<any[]>([])

const searchQuery = ref('')
const selectedRole = ref('all')
const selectedDepartment = ref('all')

const roleOptions = [
  { label: 'All Roles', value: 'all' },
  { label: 'Faculty', value: 'Faculty' },
  { label: 'Dean', value: 'Dean' }
]

const departmentOptions = computed(() => {
  const departments = Array.from(
    new Set(
      teachers.value
        .map((teacher: any) => teacher?.department?.name)
        .filter(Boolean)
    )
  ).sort()

  return [
    { label: 'All Departments', value: 'all' },
    ...departments.map((value: any) => ({ label: value, value }))
  ]
})

const summary = computed(() => ({
  total: teachers.value.length,
  faculty: teachers.value.filter(
    (teacher: any) => getTeacherRole(teacher) === 'Faculty'
  ).length,
  deans: teachers.value.filter(
    (teacher: any) => getTeacherRole(teacher) === 'Dean'
  ).length,
  totalEntries: teachers.value.reduce(
    (sum: number, teacher: any) =>
      sum + Number(teacher?.portfolio_entries?.length || 0),
    0
  )
}))

const filteredTeachers = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return teachers.value.filter((teacher: any) => {
    const role = getTeacherRole(teacher)
    const department = teacher?.department?.name || ''

    const searchable = [
      getTeacherName(teacher),
      teacher?.employee_no,
      teacher?.user?.username,
      teacher?.user?.email,
      role,
      department
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return (
      (!keyword || searchable.includes(keyword)) &&
      (selectedRole.value === 'all' || role === selectedRole.value) &&
      (selectedDepartment.value === 'all' ||
        department === selectedDepartment.value)
    )
  })
})

const StatCard = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    icon: String
  },

  setup(props) {
    return () =>
      h('div', {
        class:
          'rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900'
      }, [
        h('div', { class: 'flex items-center justify-between gap-3' }, [
          h('div', {}, [
            h('p', { class: 'text-xs text-gray-500' }, props.label),
            h('p', {
              class: 'mt-2 text-2xl font-black text-gray-900 dark:text-white'
            }, String(props.value ?? 0))
          ]),
          h(resolveComponent('UIcon'), {
            name: props.icon,
            class: 'size-5 text-blue-600'
          })
        ])
      ])
  }
})

const getTeacherName = (teacher: any) =>
  teacher?.name ||
  teacher?.full_name ||
  teacher?.user?.username ||
  'Faculty Member'

const getTeacherRole = (teacher: any) =>
  teacher?.user?.role?.name ||
  teacher?.user?.role?.type ||
  teacher?.role ||
  'Faculty'

const getTeacherDocumentId = (teacher: any) => {
  const value = teacher?.documentId || teacher?.document_id || ''
  const documentId = String(value).trim()

  return ['', 'undefined', 'null'].includes(documentId)
    ? ''
    : documentId
}

const initials = (value: string) =>
  String(value || '')
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')

const resetFilters = () => {
  searchQuery.value = ''
  selectedRole.value = 'all'
  selectedDepartment.value = 'all'
}

const loadTeachers = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const response: any = await $api('/teachers', {
      query: {
        'populate[department]': true,
        'populate[user][populate][role]': true,
        'populate[portfolio_entries]': true,
        'pagination[page]': 1,
        'pagination[pageSize]': 1000
      }
    })

    teachers.value = (response?.data || []).filter(
      (teacher: any) =>
        ['Faculty', 'Dean'].includes(getTeacherRole(teacher))
    )
  } catch (error: any) {
    teachers.value = []
    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Unable to load faculty and dean records.'
  } finally {
    loading.value = false
  }
}

onMounted(loadTeachers)
</script>
