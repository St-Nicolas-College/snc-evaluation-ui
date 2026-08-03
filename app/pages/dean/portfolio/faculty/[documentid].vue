<template>
  <div class="space-y-6 pb-10">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        to="/dean/portfolio"
      >
        Back to Department Portfolios
      </UButton>

      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-refresh-cw"
        :loading="loading"
        @click="loadPortfolio"
      >
        Refresh
      </UButton>
    </div>

    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-48 rounded-3xl" />
      <USkeleton class="h-[520px] rounded-3xl" />
    </div>

    <section
      v-else-if="loadError"
      class="rounded-2xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <UIcon
        name="i-lucide-triangle-alert"
        class="mx-auto size-9 text-red-600"
      />

      <h2 class="mt-4 font-bold text-gray-900 dark:text-white">
        Unable to load faculty portfolio
      </h2>

      <p class="mx-auto mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
        {{ loadError }}
      </p>

      <div class="mt-5 flex justify-center gap-2">
        <UButton
          color="neutral"
          variant="outline"
          to="/dean/portfolio"
        >
          Back
        </UButton>

        <UButton
          icon="i-lucide-refresh-cw"
          @click="loadPortfolio"
        >
          Try Again
        </UButton>
      </div>
    </section>

    <template v-else-if="portfolio">
      <section
        class="overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-7 text-white shadow-xl"
      >
        <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div class="flex items-center gap-4">
            <div class="flex size-16 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-xl font-black">
              {{ initials(facultyName) }}
            </div>

            <div>
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Department Portfolio Viewer
              </p>

              <h1 class="mt-2 text-2xl font-black">
                {{ facultyName }}
              </h1>

              <p class="mt-1 text-sm text-slate-300">
                {{ facultyDepartment }} · {{ portfolio.portfolio_no }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 sm:min-w-[380px]">
            <HeaderStat label="Entries" :value="summary.total" />
            <HeaderStat label="Pending" :value="summary.pending" />
            <HeaderStat label="Verified" :value="summary.verified" />
          </div>
        </div>
      </section>

      <section
        class="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/20 dark:text-blue-300"
      >
        <div class="flex items-start gap-3">
          <UIcon
            name="i-lucide-eye"
            class="mt-0.5 size-5 shrink-0"
          />

          <p>
            This page is view-only. Human Resource personnel perform portfolio
            verification, correction, rejection, reopening, and expiration actions.
          </p>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <ReviewStat
          label="Completion"
          :value="`${Math.round(Number(portfolio.completion_percentage || 0))}%`"
        />
        <ReviewStat label="Draft" :value="summary.draft" />
        <ReviewStat label="For Verification" :value="summary.pending" />
        <ReviewStat label="Verified" :value="summary.verified" />
        <ReviewStat label="Needs Correction" :value="summary.needsCorrection" />
      </section>

      <section
        class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div class="flex flex-1 flex-col gap-3 sm:flex-row">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Search portfolio entries..."
              class="w-full sm:max-w-md"
            />

            <USelectMenu
              v-model="selectedStatus"
              :items="statusOptions"
              value-key="value"
              class="w-full sm:w-56"
            />
          </div>

          <UBadge
            :color="statusColor(portfolio.portfolio_status)"
            variant="subtle"
          >
            Portfolio: {{ formatStatus(portfolio.portfolio_status) }}
          </UBadge>
        </div>
      </section>

      <section
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2 class="font-bold">
            Portfolio Entries
          </h2>

          <p class="mt-1 text-xs text-gray-500">
            View faculty qualifications, activities, evidence, and HR verification history.
          </p>
        </div>

        <div
          v-if="!filteredEntries.length"
          class="px-6 py-16 text-center"
        >
          <UIcon
            name="i-lucide-folder-search"
            class="mx-auto size-10 text-gray-400"
          />

          <h3 class="mt-4 font-bold">
            No matching entries
          </h3>
        </div>

        <div
          v-else
          class="divide-y divide-gray-100 dark:divide-gray-800"
        >
          <article
            v-for="entry in filteredEntries"
            :key="entry.documentId || entry.id"
            class="px-5 py-5"
          >
            <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div class="min-w-0">
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    color="neutral"
                    variant="subtle"
                  >
                    {{ formatStatus(entry.entry_type) }}
                  </UBadge>

                  <UBadge
                    :color="statusColor(entry.verification_status)"
                    variant="subtle"
                  >
                    {{ formatStatus(entry.verification_status) }}
                  </UBadge>

                  <UBadge
                    color="neutral"
                    variant="subtle"
                    icon="i-lucide-paperclip"
                  >
                    {{ entry.evidence?.length || 0 }} Evidence
                  </UBadge>
                </div>

                <h3 class="mt-3 text-base font-bold">
                  {{ entry.title }}
                </h3>

                <p
                  v-if="entry.description"
                  class="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300"
                >
                  {{ entry.description }}
                </p>

                <div class="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                  <span v-if="entry.institution">
                    {{ entry.institution }}
                  </span>

                  <span v-if="entry.issuer">
                    {{ entry.issuer }}
                  </span>

                  <span v-if="entry.date_earned">
                    {{ formatDate(entry.date_earned) }}
                  </span>
                </div>

                <div
                  v-if="entry.remarks"
                  class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300"
                >
                  {{ entry.remarks }}
                </div>
              </div>

              <UButton
                size="sm"
                color="neutral"
                variant="soft"
                icon="i-lucide-eye"
                @click="openDetails(entry)"
              >
                View
              </UButton>
            </div>
          </article>
        </div>
      </section>
    </template>

    <UModal
      v-model:open="detailsOpen"
      id="dean-view-portfolio-entry"
      title="Portfolio Entry Details"
      description="View entry information, evidence, and HR verification history."
      :ui="{ content: 'max-w-5xl' }"
    >
      <template #content>
        <div
          v-if="selectedEntry"
          class="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900"
        >
          <div class="bg-slate-950 px-6 py-6 text-white">
            <p class="text-xs uppercase tracking-wider text-emerald-300">
              {{ formatStatus(selectedEntry.entry_type) }}
            </p>

            <h2 class="mt-2 text-xl font-black">
              {{ selectedEntry.title }}
            </h2>
          </div>

          <div class="space-y-5 p-6">
            <section class="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
              <h3 class="font-bold">
                Entry Information
              </h3>

              <p class="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {{ selectedEntry.description || 'No description provided.' }}
              </p>
            </section>

            <section class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
              <div class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40">
                <h3 class="font-bold">
                  Supporting Evidence
                </h3>
              </div>

              <div
                v-if="!selectedEntry.evidence?.length"
                class="p-8 text-center text-sm text-gray-500"
              >
                No evidence attached.
              </div>

              <div
                v-else
                class="divide-y divide-gray-100 dark:divide-gray-800"
              >
                <div
                  v-for="evidence in selectedEntry.evidence"
                  :key="evidence.documentId || evidence.id"
                  class="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p class="font-semibold">
                      {{ evidence.title }}
                    </p>

                    <p class="mt-1 text-xs text-gray-500">
                      {{ formatStatus(evidence.evidence_type) }}
                      ·
                      {{ formatStatus(evidence.verification_status) }}
                    </p>
                  </div>

                  <UButton
                    v-if="fileUrl(evidence)"
                    :to="fileUrl(evidence)"
                    target="_blank"
                    size="xs"
                    color="neutral"
                    variant="soft"
                    icon="i-lucide-external-link"
                  >
                    Open File
                  </UButton>
                </div>
              </div>
            </section>

            <section class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
              <div class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40">
                <h3 class="font-bold">
                  HR Verification History
                </h3>
              </div>

              <div
                v-if="!selectedEntry.verification_history?.length"
                class="p-8 text-center text-sm text-gray-500"
              >
                No verification history.
              </div>

              <div
                v-else
                class="divide-y divide-gray-100 dark:divide-gray-800"
              >
                <div
                  v-for="history in selectedEntry.verification_history"
                  :key="history.documentId || history.id"
                  class="px-4 py-4"
                >
                  <div class="flex items-center justify-between gap-3">
                    <p class="font-semibold">
                      {{ formatStatus(history.new_status) }}
                    </p>

                    <p class="text-xs text-gray-500">
                      {{ formatDateTime(history.review_date) }}
                    </p>
                  </div>

                  <p class="mt-1 text-xs text-gray-500">
                    {{ history.reviewer?.username || history.reviewer?.email || 'System' }}
                  </p>

                  <p
                    v-if="history.remarks"
                    class="mt-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    {{ history.remarks }}
                  </p>
                </div>
              </div>
            </section>

            <div class="flex justify-end">
              <UButton
                color="neutral"
                variant="soft"
                @click="detailsOpen = false"
              >
                Close
              </UButton>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Dean']
})

const route = useRoute()
const { $api } = useNuxtApp()
const config = useRuntimeConfig()

const loading = ref(false)
const loadError = ref('')
const portfolio = ref<any>(null)

const searchQuery = ref('')
const selectedStatus = ref('all')

const detailsOpen = ref(false)
const selectedEntry = ref<any>(null)

const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'For Verification', value: 'for_verification' },
  { label: 'Verified', value: 'verified' },
  { label: 'Needs Correction', value: 'needs_correction' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Expired', value: 'expired' }
]

const entries = computed(() =>
  Array.isArray(portfolio.value?.entries)
    ? portfolio.value.entries
    : []
)

const facultyName = computed(() =>
  portfolio.value?.faculty?.name ||
  portfolio.value?.faculty?.full_name ||
  portfolio.value?.faculty?.user?.username ||
  'Faculty Member'
)

const facultyDepartment = computed(() =>
  portfolio.value?.faculty?.department?.name ||
  'Department not specified'
)

const summary = computed(() => ({
  total: entries.value.length,
  draft: entries.value.filter(
    item => item.verification_status === 'draft'
  ).length,
  pending: entries.value.filter(
    item =>
      ['for_verification', 'pending'].includes(
        item.verification_status
      )
  ).length,
  verified: entries.value.filter(
    item => item.verification_status === 'verified'
  ).length,
  needsCorrection: entries.value.filter(
    item => item.verification_status === 'needs_correction'
  ).length
}))

const filteredEntries = computed(() => {
  const keyword = searchQuery.value
    .trim()
    .toLowerCase()

  return entries.value.filter(entry => {
    const matchesStatus =
      selectedStatus.value === 'all' ||
      entry.verification_status ===
        selectedStatus.value

    const searchable = [
      entry.title,
      entry.description,
      entry.institution,
      entry.issuer,
      entry.entry_type
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return (
      matchesStatus &&
      (!keyword ||
        searchable.includes(keyword))
    )
  })
})

const HeaderStat = defineComponent({
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
                'mt-1 text-[10px] uppercase tracking-wide text-emerald-100'
            },
            props.label
          )
        ]
      )
  }
})

const ReviewStat = defineComponent({
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
            'rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'
        },
        [
          h(
            'p',
            {
              class:
                'text-xs text-gray-500'
            },
            props.label
          ),
          h(
            'p',
            {
              class:
                'mt-2 text-xl font-black'
            },
            String(props.value ?? 0)
          )
        ]
      )
  }
})

const openDetails = (entry: any) => {
  selectedEntry.value = entry
  detailsOpen.value = true
}

const getRouteDocumentId = () => {
  const params = route.params || {}
  const direct =
    params.documentId ??
    params.documentid ??
    params.id
  const fallback =
    Object.values(params)[0]
  const raw =
    direct ??
    fallback ??
    ''
  const value =
    Array.isArray(raw)
      ? raw[0]
      : raw

  return String(value || '').trim()
}

const loadPortfolio = async () => {
  const documentId =
    getRouteDocumentId()

  if (
    !documentId ||
    documentId === 'undefined' ||
    documentId === 'null'
  ) {
    portfolio.value = null
    loadError.value =
      'The selected faculty portfolio does not have a valid document ID.'
    return
  }

  loading.value = true
  loadError.value = ''

  try {
    const response: any = await $api(
      `/faculty-portfolios/department/${encodeURIComponent(documentId)}`
    )

    portfolio.value =
      response?.data ||
      response ||
      null

    if (!portfolio.value) {
      loadError.value =
        'The selected faculty portfolio could not be loaded.'
    }
  } catch (error: any) {
    portfolio.value = null
    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to load the faculty portfolio.'
  } finally {
    loading.value = false
  }
}

const fileUrl = (evidence: any) => {
  const url =
    evidence?.file?.url

  if (!url) {
    return ''
  }

  if (/^https?:\/\//i.test(url)) {
    return url
  }

  const baseUrl = String(
    config.public.strapiUrl ||
      config.public.apiBase ||
      ''
  ).replace(/\/api\/?$/, '')

  return `${baseUrl}${url}`
}

const initials = (value: string) =>
  String(value || '')
    .split(/\s+/)
    .slice(0, 2)
    .map(part =>
      part.charAt(0).toUpperCase()
    )
    .join('')

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
    case 'partially_verified':
      return 'info'
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

const formatDateTime = (value: any) => {
  if (!value) return 'N/A'

  const date = new Date(value)

  return Number.isNaN(
    date.getTime()
  )
    ? String(value)
    : date.toLocaleString(
        'en-PH',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        }
      )
}

watch(
  () => route.fullPath,
  () => {
    loadPortfolio()
  }
)

onMounted(loadPortfolio)
</script>
