<template>
  <div class="space-y-6">
    <!-- Welcome -->
    <section
      class="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-700 px-6 py-7 text-white shadow-xl"
    >
      <div class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />

      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div class="mb-2 flex flex-wrap gap-2 text-xs">
            <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
              Human Resource Portal
            </span>

            <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
              Faculty Portfolio Verification
            </span>
          </div>

          <h1 class="text-2xl font-black sm:text-3xl">
            Welcome, {{ displayName }}
          </h1>

          <p class="mt-2 max-w-3xl text-sm leading-6 text-blue-100">
            Monitor faculty and dean portfolios, review submitted evidence,
            track expiring credentials, and prepare verified records for ranking.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <HeroStat label="Portfolios" :value="stats.totalPortfolios" />
          <HeroStat label="Pending" :value="stats.forVerification" />
          <HeroStat label="Verified" :value="stats.verifiedEntries" />
        </div>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <USkeleton
          v-for="index in 4"
          :key="index"
          class="h-28 rounded-2xl"
        />
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <USkeleton class="h-[380px] rounded-2xl" />
        <USkeleton class="h-[380px] rounded-2xl" />
      </div>
    </div>

    <template v-else>
      <!-- KPI cards -->
      <section class="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Total Portfolios"
          :value="stats.totalPortfolios"
          icon="i-lucide-folders"
          tone="blue"
        />

        <StatCard
          label="For Verification"
          :value="stats.forVerification"
          icon="i-lucide-list-checks"
          tone="amber"
        />

        <StatCard
          label="Verified Entries"
          :value="stats.verifiedEntries"
          icon="i-lucide-badge-check"
          tone="emerald"
        />

        <StatCard
          label="Needs Correction"
          :value="stats.needsCorrection"
          icon="i-lucide-file-warning"
          tone="red"
        />
      </section>

      <!-- Secondary KPI -->
      <section class="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <MiniCard
          label="Partially Verified"
          :value="stats.partiallyVerified"
          icon="i-lucide-circle-dashed"
        />

        <MiniCard
          label="Fully Verified"
          :value="stats.verifiedPortfolios"
          icon="i-lucide-shield-check"
        />

        <MiniCard
          label="Expired Credentials"
          :value="stats.expired"
          icon="i-lucide-calendar-x"
        />

        <MiniCard
          label="Expiring in 30 Days"
          :value="stats.expiringSoon"
          icon="i-lucide-calendar-clock"
        />
      </section>

      <!-- Main content -->
      <section class="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <!-- Queue -->
        <div
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <div>
              <h2 class="font-bold text-gray-900 dark:text-white">
                Recent Verification Queue
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Recently submitted faculty and dean portfolio entries.
              </p>
            </div>

            <UButton
              to="/hr/portfolio/verification"
              size="sm"
              icon="i-lucide-arrow-right"
            >
              Open Queue
            </UButton>
          </div>

          <div
            v-if="!verificationQueue.length"
            class="px-6 py-16 text-center"
          >
            <UIcon
              name="i-lucide-inbox"
              class="mx-auto size-10 text-gray-400"
            />

            <h3 class="mt-4 font-bold text-gray-900 dark:text-white">
              Verification queue is clear
            </h3>

            <p class="mt-2 text-sm text-gray-500">
              No portfolio entries are currently waiting for HR review.
            </p>
          </div>

          <div
            v-else
            class="divide-y divide-gray-100 dark:divide-gray-800"
          >
            <div
              v-for="entry in verificationQueue"
              :key="entry.documentId || entry.id"
              class="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="min-w-0">
                <div class="flex flex-wrap gap-2">
                  <UBadge color="neutral" variant="subtle">
                    {{ formatStatus(entry.entry_type) }}
                  </UBadge>

                  <UBadge color="warning" variant="subtle">
                    {{ formatStatus(entry.verification_status) }}
                  </UBadge>
                </div>

                <p class="mt-2 truncate font-bold text-gray-900 dark:text-white">
                  {{ entry.title }}
                </p>

                <p class="mt-1 truncate text-xs text-gray-500">
                  {{ facultyName(entry) }}
                  ·
                  {{ facultyDepartment(entry) }}
                </p>
              </div>

              <UButton
                :to="`/hr/portfolio/entry/${entry.documentId}`"
                size="xs"
                color="neutral"
                variant="soft"
                icon="i-lucide-eye"
              >
                Review
              </UButton>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 class="font-bold text-gray-900 dark:text-white">
            Quick Actions
          </h2>

          <p class="mt-1 text-xs text-gray-500">
            Open frequently used HR modules.
          </p>

          <div class="mt-5 grid gap-3">
            <QuickAction
              label="Verification Queue"
              description="Review submitted portfolio entries."
              icon="i-lucide-list-checks"
              to="/hr/portfolio/verification"
            />

            <QuickAction
              label="All Portfolios"
              description="Monitor faculty and dean portfolios."
              icon="i-lucide-folders"
              to="/hr/portfolio"
            />

            <QuickAction
              label="Verification History"
              description="Review HR verification audit records."
              icon="i-lucide-history"
              to="/hr/portfolio/history"
            />

            <QuickAction
              label="Expiring Credentials"
              description="Monitor licenses and certifications."
              icon="i-lucide-calendar-clock"
              to="/hr/portfolio/expiring"
            />

            <QuickAction
              label="Ranking Verification"
              description="Check faculty ranking readiness."
              icon="i-lucide-shield-check"
              to="/hr/ranking/verification"
            />
          </div>
        </div>
      </section>

      <!-- Portfolio status -->
      <section class="grid gap-4 xl:grid-cols-2">
        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-bold text-gray-900 dark:text-white">
                Portfolio Status Overview
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Current portfolio distribution across the institution.
              </p>
            </div>

            <UButton
              to="/hr/portfolio"
              size="xs"
              color="neutral"
              variant="soft"
            >
              View All
            </UButton>
          </div>

          <div class="mt-5 space-y-4">
            <ProgressRow
              label="Verified"
              :value="stats.verifiedPortfolios"
              :total="stats.totalPortfolios"
            />

            <ProgressRow
              label="Partially Verified"
              :value="stats.partiallyVerified"
              :total="stats.totalPortfolios"
            />

            <ProgressRow
              label="For Verification"
              :value="stats.portfoliosForVerification"
              :total="stats.totalPortfolios"
            />

            <ProgressRow
              label="Needs Correction"
              :value="stats.portfoliosNeedsCorrection"
              :total="stats.totalPortfolios"
            />
          </div>
        </div>

        <!-- Recent verified -->
        <div
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <h2 class="font-bold text-gray-900 dark:text-white">
              Recently Verified Entries
            </h2>

            <p class="mt-1 text-xs text-gray-500">
              Latest portfolio entries verified by HR.
            </p>
          </div>

          <div
            v-if="!recentVerified.length"
            class="px-6 py-16 text-center text-sm text-gray-500"
          >
            No recently verified entries.
          </div>

          <div
            v-else
            class="divide-y divide-gray-100 dark:divide-gray-800"
          >
            <div
              v-for="entry in recentVerified"
              :key="entry.documentId || entry.id"
              class="px-5 py-4"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate font-semibold text-gray-900 dark:text-white">
                    {{ entry.title }}
                  </p>

                  <p class="mt-1 truncate text-xs text-gray-500">
                    {{ facultyName(entry) }}
                  </p>
                </div>

                <UBadge color="success" variant="subtle">
                  Verified
                </UBadge>
              </div>

              <p class="mt-2 text-xs text-gray-500">
                {{ formatDate(entry.verified_at || entry.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Error -->
    <section
      v-if="loadError"
      class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300"
    >
      <div class="flex items-start gap-3">
        <UIcon
          name="i-lucide-triangle-alert"
          class="mt-0.5 size-5 shrink-0"
        />

        <div>
          <p class="font-semibold">
            Some dashboard information could not be loaded.
          </p>

          <p class="mt-1">
            {{ loadError }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

const { $api } = useNuxtApp()
const { user } = useAuth()

const loading = ref(false)
const loadError = ref('')

const verificationQueue = ref<any[]>([])
const recentVerified = ref<any[]>([])
const portfolios = ref<any[]>([])
const allEntries = ref<any[]>([])

const displayName = computed(() =>
  user.value?.full_name ||
  user.value?.name ||
  user.value?.username ||
  'HR Personnel'
)

const stats = computed(() => {
  const now = Date.now()
  const thirtyDays = 30 * 24 * 60 * 60 * 1000

  return {
    totalPortfolios:
      portfolios.value.length,

    forVerification:
      allEntries.value.filter((entry: any) =>
        ['for_verification', 'pending'].includes(
          entry.verification_status
        )
      ).length,

    verifiedEntries:
      allEntries.value.filter(
        (entry: any) =>
          entry.verification_status === 'verified'
      ).length,

    needsCorrection:
      allEntries.value.filter(
        (entry: any) =>
          entry.verification_status === 'needs_correction'
      ).length,

    expired:
      allEntries.value.filter(
        (entry: any) =>
          entry.verification_status === 'expired'
      ).length,

    expiringSoon:
      allEntries.value.filter((entry: any) => {
        if (!entry.expiration_date) return false

        const expiration =
          new Date(entry.expiration_date).getTime()

        return (
          expiration >= now &&
          expiration <= now + thirtyDays
        )
      }).length,

    verifiedPortfolios:
      portfolios.value.filter(
        (portfolio: any) =>
          portfolio.portfolio_status === 'verified'
      ).length,

    partiallyVerified:
      portfolios.value.filter(
        (portfolio: any) =>
          portfolio.portfolio_status === 'partially_verified'
      ).length,

    portfoliosForVerification:
      portfolios.value.filter(
        (portfolio: any) =>
          portfolio.portfolio_status === 'for_verification'
      ).length,

    portfoliosNeedsCorrection:
      portfolios.value.filter(
        (portfolio: any) =>
          portfolio.portfolio_status === 'needs_correction'
      ).length
  }
})

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

const StatCard = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    icon: String,
    tone: String
  },

  setup(props) {
    const tones: Record<string, string> = {
      blue:
        'border-blue-100 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20',
      amber:
        'border-amber-100 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20',
      emerald:
        'border-emerald-100 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20',
      red:
        'border-red-100 bg-red-50/70 dark:border-red-900 dark:bg-red-950/20'
    }

    return () =>
      h(
        'div',
        {
          class:
            `rounded-2xl border p-4 ${tones[props.tone || 'blue']}`
        },
        [
          h(
            'div',
            {
              class:
                'flex items-center justify-between gap-3'
            },
            [
              h('div', {}, [
                h(
                  'p',
                  {
                    class:
                      'text-xs font-medium text-gray-500'
                  },
                  props.label
                ),

                h(
                  'p',
                  {
                    class:
                      'mt-2 text-2xl font-black text-gray-900 dark:text-white'
                  },
                  String(props.value ?? 0)
                )
              ]),

              h(
                resolveComponent('UIcon'),
                {
                  name: props.icon,
                  class: 'size-5'
                }
              )
            ]
          )
        ]
      )
  }
})

const MiniCard = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    icon: String
  },

  setup(props) {
    return () =>
      h(
        'div',
        {
          class:
            'rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900'
        },
        [
          h(
            'div',
            {
              class:
                'flex items-center justify-between gap-3'
            },
            [
              h('div', {}, [
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
                      'mt-2 text-xl font-black text-gray-900 dark:text-white'
                  },
                  String(props.value ?? 0)
                )
              ]),

              h(
                resolveComponent('UIcon'),
                {
                  name: props.icon,
                  class:
                    'size-5 text-blue-600'
                }
              )
            ]
          )
        ]
      )
  }
})

const QuickAction = defineComponent({
  props: {
    label: String,
    description: String,
    icon: String,
    to: String
  },

  setup(props) {
    return () =>
      h(
        resolveComponent('NuxtLink'),
        {
          to: props.to,
          class:
            'group flex items-center gap-3 rounded-2xl border border-gray-200 p-4 transition hover:border-blue-200 hover:bg-blue-50 dark:border-gray-800 dark:hover:border-blue-900 dark:hover:bg-blue-950/20'
        },
        {
          default: () => [
            h(
              'div',
              {
                class:
                  'flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/40'
              },
              [
                h(
                  resolveComponent('UIcon'),
                  {
                    name: props.icon,
                    class: 'size-5'
                  }
                )
              ]
            ),

            h(
              'div',
              {
                class:
                  'min-w-0 flex-1'
              },
              [
                h(
                  'p',
                  {
                    class:
                      'font-semibold text-gray-900 dark:text-white'
                  },
                  props.label
                ),

                h(
                  'p',
                  {
                    class:
                      'mt-1 text-xs text-gray-500'
                  },
                  props.description
                )
              ]
            ),

            h(
              resolveComponent('UIcon'),
              {
                name:
                  'i-lucide-chevron-right',
                class:
                  'size-4 text-gray-400'
              }
            )
          ]
        }
      )
  }
})

const ProgressRow = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    total: [String, Number]
  },

  setup(props) {
    return () => {
      const value = Number(props.value || 0)
      const total = Number(props.total || 0)
      const percentage =
        total > 0
          ? Math.round((value / total) * 100)
          : 0

      return h('div', {}, [
        h(
          'div',
          {
            class:
              'flex items-center justify-between gap-3 text-sm'
          },
          [
            h(
              'span',
              {
                class:
                  'font-medium text-gray-700 dark:text-gray-300'
              },
              props.label
            ),

            h(
              'span',
              {
                class:
                  'font-bold text-gray-900 dark:text-white'
              },
              `${value} (${percentage}%)`
            )
          ]
        ),

        h(
          'div',
          {
            class:
              'mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800'
          },
          [
            h('div', {
              class:
                'h-full rounded-full bg-blue-600 transition-all',
              style: {
                width:
                  `${Math.min(percentage, 100)}%`
              }
            })
          ]
        )
      ])
    }
  }
})

const facultyRecord = (entry: any) =>
  entry?.faculty_portfolio?.faculty ||
  {}

const facultyName = (entry: any) =>
  facultyRecord(entry)?.name ||
  facultyRecord(entry)?.full_name ||
  facultyRecord(entry)?.user?.username ||
  'Faculty Member'

const facultyDepartment = (entry: any) =>
  facultyRecord(entry)?.department?.name ||
  'Department not specified'

const formatStatus = (value: string) =>
  String(value || '')
    .replace(/_/g, ' ')
    .replace(
      /\b\w/g,
      character =>
        character.toUpperCase()
    )

const formatDate = (value: any) => {
  if (!value) return 'N/A'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
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

const loadDashboard = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const [
      queueResponse,
      allEntriesResponse,
      portfolioResponse,
      verifiedResponse
    ]: any[] = await Promise.all([
      $api(
        '/portfolio-entries/verification-queue',
        {
          query: {
            page: 1,
            pageSize: 5,
            verification_status:
              'for_verification'
          }
        }
      ),

      $api(
        '/portfolio-entries/verification-queue',
        {
          query: {
            page: 1,
            pageSize: 1000,
            verification_status: ''
          }
        }
      ),

      $api('/faculty-portfolios', {
        query: {
          'populate[faculty][populate][department]':
            true,
          'populate[faculty][populate][user]':
            true,
          'pagination[page]': 1,
          'pagination[pageSize]': 1000
        }
      }),

      $api(
        '/portfolio-entries/verification-queue',
        {
          query: {
            page: 1,
            pageSize: 5,
            verification_status:
              'verified'
          }
        }
      )
    ])

    verificationQueue.value =
      queueResponse?.data || []

    allEntries.value =
      allEntriesResponse?.data || []

    portfolios.value =
      portfolioResponse?.data || []

    recentVerified.value =
      verifiedResponse?.data || []
  } catch (error: any) {
    console.error(
      'HR dashboard loading error:',
      error
    )

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Unable to load some HR dashboard records.'
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>
