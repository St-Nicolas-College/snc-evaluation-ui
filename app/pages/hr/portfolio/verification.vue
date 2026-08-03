<template>
  <div class="space-y-6 pb-10">
    <section
      class="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-700 px-6 py-7 text-white shadow-xl"
    >
      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div class="mb-2 flex flex-wrap gap-2 text-xs">
            <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
              Human Resource Portal
            </span>

            <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
              Final Portfolio Verification
            </span>
          </div>

          <h1 class="text-2xl font-black sm:text-3xl">
            Portfolio Verification Queue
          </h1>

          <p class="mt-2 max-w-3xl text-sm leading-6 text-blue-100">
            Review submitted faculty and dean portfolio entries, inspect evidence,
            and perform official verification actions.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <HeroStat label="Queue" :value="pagination.total" />
          <HeroStat label="Visible" :value="entries.length" />
          <HeroStat label="Page" :value="pagination.page" />
        </div>
      </div>
    </section>

    <section
      class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-1 flex-col gap-3 sm:flex-row">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search faculty, dean, title, department..."
            class="w-full sm:max-w-md"
            @keyup.enter="loadQueue"
          />

          <USelectMenu
            v-model="selectedEntryType"
            :items="entryTypeOptions"
            value-key="value"
            class="w-full sm:w-56"
          />

          <USelectMenu
            v-model="selectedStatus"
            :items="statusOptions"
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
            @click="loadQueue"
          >
            Refresh
          </UButton>
        </div>
      </div>
    </section>

    <div v-if="loading" class="space-y-3">
      <USkeleton
        v-for="index in 6"
        :key="index"
        class="h-24 rounded-2xl"
      />
    </div>

    <section
      v-else-if="loadError"
      class="rounded-2xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <UIcon
        name="i-lucide-triangle-alert"
        class="mx-auto size-9 text-red-600"
      />

      <h2 class="mt-4 font-bold">
        Unable to load verification queue
      </h2>

      <p class="mt-2 text-sm text-gray-500">
        {{ loadError }}
      </p>
    </section>

    <section
      v-else
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h2 class="font-bold">
          Submitted Portfolio Entries
        </h2>

        <p class="mt-1 text-xs text-gray-500">
          Showing {{ entries.length }} of {{ pagination.total }} records.
        </p>
      </div>

      <div
        v-if="!entries.length"
        class="px-6 py-16 text-center"
      >
        <UIcon
          name="i-lucide-inbox"
          class="mx-auto size-10 text-gray-400"
        />

        <h3 class="mt-4 font-bold">
          No entries found
        </h3>

        <p class="mt-2 text-sm text-gray-500">
          No portfolio entries matched the selected filters.
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[1120px] text-sm">
          <thead class="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40">
            <tr>
              <th class="px-5 py-3 text-left">Faculty / Dean</th>
              <th class="px-4 py-3 text-left">Department</th>
              <th class="px-4 py-3 text-left">Entry</th>
              <th class="px-4 py-3 text-center">Evidence</th>
              <th class="px-4 py-3 text-center">Status</th>
              <th class="px-4 py-3 text-left">Updated</th>
              <th class="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="entry in entries"
              :key="entry.documentId || entry.id"
              class="hover:bg-gray-50/80 dark:hover:bg-gray-950/30"
            >
              <td class="px-5 py-4">
                <p class="font-bold">
                  {{ facultyName(entry) }}
                </p>

                <p class="mt-1 text-xs text-gray-500">
                  {{ facultyEmployeeNo(entry) }}
                </p>
              </td>

              <td class="px-4 py-4">
                {{ facultyDepartment(entry) }}
              </td>

              <td class="px-4 py-4">
                <p class="font-semibold">
                  {{ entry.title }}
                </p>

                <p class="mt-1 text-xs text-gray-500">
                  {{ formatStatus(entry.entry_type) }}
                </p>
              </td>

              <td class="px-4 py-4 text-center">
                <UBadge
                  color="neutral"
                  variant="subtle"
                  icon="i-lucide-paperclip"
                >
                  {{ entry.evidence?.length || 0 }}
                </UBadge>
              </td>

              <td class="px-4 py-4 text-center">
                <UBadge
                  :color="statusColor(entry.verification_status)"
                  variant="subtle"
                >
                  {{ formatStatus(entry.verification_status) }}
                </UBadge>
              </td>

              <td class="px-4 py-4 text-gray-500">
                {{ formatDate(entry.updatedAt) }}
              </td>

              <td class="px-5 py-4 text-center">
                <UButton
                  size="xs"
                  icon="i-lucide-eye"
                  :to="`/hr/portfolio/entry/${entry.documentId}`"
                >
                  Review
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800">
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
  role: ['HR', 'Admin']
})

const { $api } = useNuxtApp()

const loading = ref(false)
const loadError = ref('')
const entries = ref<any[]>([])

const searchQuery = ref('')
const selectedEntryType = ref('')
const selectedStatus = ref('for_verification')

const pagination = reactive({
  page: 1,
  pageSize: 20,
  pageCount: 1,
  total: 0
})

const entryTypeOptions = [
  { label: 'All Entry Types', value: '' },
  { label: 'Educational Attainment', value: 'educational_attainment' },
  { label: 'Eligibility', value: 'eligibility' },
  { label: 'License', value: 'license' },
  { label: 'Certification', value: 'certification' },
  { label: 'Training', value: 'training' },
  { label: 'Seminar', value: 'seminar' },
  { label: 'Resource Speaker', value: 'resource_speaker' },
  { label: 'Research', value: 'research' },
  { label: 'Publication', value: 'publication' },
  { label: 'Award', value: 'award' },
  { label: 'Professional Experience', value: 'professional_experience' },
  { label: 'Institutional Service', value: 'institutional_service' },
  { label: 'Community Service', value: 'community_service' }
]

const statusOptions = [
  { label: 'For Verification', value: 'for_verification' },
  { label: 'Verified', value: 'verified' },
  { label: 'Needs Correction', value: 'needs_correction' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Expired', value: 'expired' },
  { label: 'All Statuses', value: '' }
]

const HeroStat = defineComponent({
  props: {
    label: String,
    value: [String, Number]
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class:
            'rounded-2xl border border-white/15 bg-white/10 p-3 text-center'
        },
        [
          h(
            'p',
            {
              class:
                'text-2xl font-bold'
            },
            String(props.value ?? 0)
          ),
          h(
            'p',
            {
              class:
                'mt-1 text-[10px] uppercase tracking-wide text-blue-100'
            },
            props.label
          )
        ]
      )
  }
})

const loadQueue = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const response: any = await $api(
      '/portfolio-entries/verification-queue',
      {
        query: {
          page:
            pagination.page,
          pageSize:
            pagination.pageSize,
          search:
            searchQuery.value.trim() ||
            undefined,
          entry_type:
            selectedEntryType.value ||
            undefined,
          verification_status:
            selectedStatus.value ||
            undefined
        }
      }
    )

    entries.value =
      response?.data || []

    Object.assign(
      pagination,
      response?.meta?.pagination || {
        page: 1,
        pageSize: 20,
        pageCount: 1,
        total: 0
      }
    )
  } catch (error: any) {
    entries.value = []
    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Unable to load portfolio verification queue.'
  } finally {
    loading.value = false
  }
}

const changePage = async (page: number) => {
  pagination.page = page
  await loadQueue()
}

const clearFilters = async () => {
  searchQuery.value = ''
  selectedEntryType.value = ''
  selectedStatus.value =
    'for_verification'
  pagination.page = 1
  await loadQueue()
}

const faculty = (entry: any) =>
  entry?.faculty_portfolio?.faculty ||
  {}

const facultyName = (entry: any) =>
  faculty(entry)?.name ||
  faculty(entry)?.full_name ||
  faculty(entry)?.user?.username ||
  'Faculty Member'

const facultyEmployeeNo = (entry: any) =>
  faculty(entry)?.employee_no ||
  faculty(entry)?.user?.username ||
  'No employee number'

const facultyDepartment = (entry: any) =>
  faculty(entry)?.department?.name ||
  'Department not specified'

const formatStatus = (value: string) =>
  String(value || '')
    .replace(/_/g, ' ')
    .replace(
      /\b\w/g,
      character =>
        character.toUpperCase()
    )

const statusColor = (value: string) => {
  switch (value) {
    case 'verified':
      return 'success'
    case 'for_verification':
    case 'pending':
      return 'warning'
    case 'needs_correction':
    case 'rejected':
    case 'expired':
      return 'error'
    default:
      return 'neutral'
  }
}

const formatDate = (value: any) => {
  if (!value) return 'N/A'

  const date = new Date(value)

  return Number.isNaN(
    date.getTime()
  )
    ? String(value)
    : date.toLocaleDateString(
        'en-PH',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }
      )
}

watch(
  [
    selectedEntryType,
    selectedStatus
  ],
  async () => {
    pagination.page = 1
    await loadQueue()
  }
)

onMounted(loadQueue)
</script>
