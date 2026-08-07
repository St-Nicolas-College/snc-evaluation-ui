<template>
  <div class="space-y-6 pb-10">
    <!-- HERO -->
    <section
      class="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-800 px-6 py-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] sm:px-8"
    >
      <div
        class="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-cyan-300/10 blur-3xl"
      />

      <div
        class="relative flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between"
      >
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100"
            >
              Human Resource Portal
            </span>

            <span
              class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-100"
            >
              Portfolio & Faculty Ranking
            </span>
          </div>

          <h1 class="mt-4 text-3xl font-black tracking-tight sm:text-[34px]">
            Welcome, {{ displayName }}
          </h1>

          <p class="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
            Manage faculty and dean portfolio records, monitor active entries,
            and review completed faculty ranking results from one HR dashboard.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-2 xl:min-w-[430px]">
          <HeroStat
            label="Personnel"
            :value="stats.totalPersonnel"
            icon="i-lucide-users"
          />

          <HeroStat
            label="Entries"
            :value="stats.totalEntries"
            icon="i-lucide-files"
          />

          <HeroStat
            label="Ranked"
            :value="stats.computedRankings"
            icon="i-lucide-award"
          />
        </div>
      </div>
    </section>

    <!-- LOADING -->
    <div v-if="loading" class="space-y-4">
      <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <USkeleton
          v-for="index in 4"
          :key="index"
          class="h-32 rounded-[24px]"
        />
      </div>

      <div class="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <USkeleton class="h-[390px] rounded-[26px]" />
        <USkeleton class="h-[390px] rounded-[26px]" />
      </div>
    </div>

    <!-- ERROR -->
    <section
      v-else-if="loadError"
      class="rounded-[26px] border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <div
        class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40"
      >
        <UIcon name="i-lucide-triangle-alert" class="size-7" />
      </div>

      <h2 class="mt-4 font-bold text-gray-900 dark:text-white">
        Unable to load HR dashboard
      </h2>

      <p class="mt-2 text-sm text-gray-500">
        {{ loadError }}
      </p>

      <UButton
        class="mt-5"
        icon="i-lucide-refresh-cw"
        @click="loadDashboard"
      >
        Try Again
      </UButton>
    </section>

    <template v-else>
      <!-- KPI -->
      <section>
        <div
          class="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p
              class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
            >
              HR Overview
            </p>

            <h2 class="mt-1 text-lg font-black text-gray-900 dark:text-white">
              Faculty Portfolio and Ranking Status
            </h2>
          </div>

          <p class="text-xs text-gray-500">
            Live summary from your existing Teacher, Portfolio Entry, and
            Faculty Ranking records.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard
            label="Total Personnel"
            :value="stats.totalPersonnel"
            icon="i-lucide-users"
            description="Faculty and deans"
            tone="info"
          />

          <StatCard
            label="Portfolio Entries"
            :value="stats.totalEntries"
            icon="i-lucide-files"
            description="All official HR portfolio entries"
            tone="success"
          />

          <StatCard
            label="Computed Rankings"
            :value="stats.computedRankings"
            icon="i-lucide-calculator"
            description="Personnel with ranking results"
            tone="primary"
          />

          <StatCard
            label="Not Yet Ranked"
            :value="stats.pendingRankings"
            icon="i-lucide-clock-3"
            description="Personnel pending ranking computation"
            tone="warning"
          />
        </div>
      </section>

      <!-- SECONDARY STATUS -->
      <section
        class="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800"
        >
          <div
            class="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
          >
            <UIcon name="i-lucide-activity" class="size-5" />
          </div>

          <div>
            <h2 class="font-bold text-gray-900 dark:text-white">
              Portfolio Health
            </h2>

            <p class="mt-1 text-xs text-gray-500">
              Current and inactive portfolio records together with ranking-rate
              readiness.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <MiniCard
            label="Current Entries"
            :value="stats.currentEntries"
            icon="i-lucide-circle-check-big"
            tone="success"
          />

          <MiniCard
            label="Inactive Entries"
            :value="stats.inactiveEntries"
            icon="i-lucide-archive"
            tone="neutral"
          />

          <MiniCard
            label="Rate Configured"
            :value="stats.rateConfigured"
            icon="i-lucide-badge-check"
            tone="info"
          />

          <MiniCard
            label="Rate Missing"
            :value="stats.rateMissing"
            icon="i-lucide-triangle-alert"
            tone="warning"
          />
        </div>
      </section>

      <!-- MAIN CONTENT -->
      <section class="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <!-- RECENT PORTFOLIO ENTRIES -->
        <div
          class="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex flex-col gap-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              >
                <UIcon name="i-lucide-files" class="size-5" />
              </div>

              <div>
                <p
                  class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
                >
                  Latest Records
                </p>

                <h2 class="mt-1 text-base font-black text-gray-900 dark:text-white">
                  Recent Portfolio Entries
                </h2>

                <p class="mt-1 text-xs text-gray-500">
                  Latest official HR portfolio records added to the system.
                </p>
              </div>
            </div>

            <UButton
              to="/hr/portfolio"
              size="sm"
              icon="i-lucide-arrow-right"
            >
              View Portfolios
            </UButton>
          </div>

          <div
            v-if="!recentEntries.length"
            class="px-6 py-16 text-center"
          >
            <div
              class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-800"
            >
              <UIcon name="i-lucide-inbox" class="size-7" />
            </div>

            <h3 class="mt-4 font-bold text-gray-900 dark:text-white">
              No portfolio entries yet
            </h3>

            <p class="mt-2 text-sm text-gray-500">
              Portfolio records will appear here after HR adds them.
            </p>
          </div>

          <div
            v-else
            class="divide-y divide-gray-100 dark:divide-gray-800"
          >
            <div
              v-for="entry in recentEntries"
              :key="entry.documentId || entry.id"
              class="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-blue-50/30 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-blue-950/10"
            >
              <div class="flex min-w-0 items-start gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-600 dark:bg-gray-950/40 dark:text-gray-300"
                >
                  <UIcon
                    :name="entryTypeIcon(entry.entry_type)"
                    class="size-4"
                  />
                </div>

                <div class="min-w-0">
                  <div class="flex flex-wrap gap-2">
                    <UBadge color="neutral" variant="subtle">
                      {{ formatStatus(entry.entry_type) }}
                    </UBadge>

                    <UBadge
                      :color="entry.is_current !== false ? 'success' : 'neutral'"
                      variant="subtle"
                    >
                      {{ entry.is_current !== false ? "Current" : "Inactive" }}
                    </UBadge>
                  </div>

                  <p
                    class="mt-2 truncate font-bold text-gray-900 dark:text-white"
                  >
                    {{ entry.title || "Untitled Entry" }}
                  </p>

                  <p class="mt-1 truncate text-xs text-gray-500">
                    {{ entryTeacherName(entry) }}
                    <span class="mx-1">•</span>
                    {{ entryTeacherDepartment(entry) }}
                  </p>
                </div>
              </div>

              <div class="text-left sm:text-right">
                <p class="text-sm font-black text-gray-900 dark:text-white">
                  {{ formatPoints(entry.points) }} pts
                </p>

                <p class="mt-1 text-xs text-gray-400">
                  {{ formatDate(entry.date_earned || entry.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- QUICK ACTIONS -->
        <div
          class="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
            >
              <UIcon name="i-lucide-zap" class="size-5" />
            </div>

            <div>
              <h2 class="font-bold text-gray-900 dark:text-white">
                Quick Actions
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Open frequently used HR modules.
              </p>
            </div>
          </div>

          <div class="mt-5 grid gap-3">
            <QuickAction
              label="Faculty Portfolios"
              description="Manage faculty and dean portfolio entries."
              icon="i-lucide-folders"
              to="/hr/portfolio"
              tone="info"
            />

            <QuickAction
              label="Faculty Ranking"
              description="Compute and review ranking results."
              icon="i-lucide-chart-no-axes-column-increasing"
              to="/hr/ranking"
              tone="success"
            />
          </div>
        </div>
      </section>

      <!-- RANKING STATUS -->
      <section class="grid gap-5 xl:grid-cols-2">
        <div
          class="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
            >
              <UIcon name="i-lucide-chart-pie" class="size-5" />
            </div>

            <div>
              <h2 class="font-bold text-gray-900 dark:text-white">
                Ranking Completion
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Ranking computation progress across faculty and deans.
              </p>
            </div>
          </div>

          <div class="mt-6 space-y-5">
            <ProgressRow
              label="Computed"
              :value="stats.computedRankings"
              :total="stats.totalPersonnel"
              tone="success"
            />

            <ProgressRow
              label="Not Yet Computed"
              :value="stats.pendingRankings"
              :total="stats.totalPersonnel"
              tone="warning"
            />

            <ProgressRow
              label="Salary Rate Configured"
              :value="stats.rateConfigured"
              :total="stats.computedRankings"
              tone="info"
            />

            <ProgressRow
              label="Salary Rate Missing"
              :value="stats.rateMissing"
              :total="stats.computedRankings"
              tone="danger"
            />
          </div>
        </div>

        <!-- RECENT RANKINGS -->
        <div
          class="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex items-center gap-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-emerald-50/40 px-5 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/10"
          >
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
            >
              <UIcon name="i-lucide-award" class="size-5" />
            </div>

            <div>
              <h2 class="font-bold text-gray-900 dark:text-white">
                Recently Computed Rankings
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Latest completed faculty ranking records.
              </p>
            </div>
          </div>

          <div
            v-if="!recentRankings.length"
            class="px-6 py-16 text-center"
          >
            <div
              class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-800"
            >
              <UIcon name="i-lucide-award" class="size-7" />
            </div>

            <p class="mt-4 text-sm font-medium text-gray-500">
              No computed rankings yet.
            </p>
          </div>

          <div
            v-else
            class="divide-y divide-gray-100 dark:divide-gray-800"
          >
            <NuxtLink
              v-for="ranking in recentRankings"
              :key="ranking.documentId || ranking.id"
              :to="
                ranking.teacher?.documentId
                  ? `/hr/ranking/faculty/${ranking.teacher.documentId}?ranking=${ranking.documentId}`
                  : '/hr/ranking'
              "
              class="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10"
            >
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
              >
                <UIcon name="i-lucide-award" class="size-4" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p
                      class="truncate font-semibold text-gray-900 dark:text-white"
                    >
                      {{ rankingTeacherName(ranking) }}
                    </p>

                    <p class="mt-1 truncate text-xs text-gray-500">
                      {{ ranking.rank_name || "Rank not assigned" }}
                    </p>
                  </div>

                  <UBadge color="success" variant="subtle">
                    {{ formatPoints(ranking.total_ranking_points) }} pts
                  </UBadge>
                </div>

                <p class="mt-2 text-xs text-gray-400">
                  {{ formatDate(ranking.computed_at || ranking.updatedAt) }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

const { $api } = useNuxtApp()
const { user } = useAuth()

// STATE
const loading = ref(false)
const loadError = ref("")

const teachers = ref<any[]>([])
const portfolioEntries = ref<any[]>([])
const rankings = ref<any[]>([])
const rankingSchemes = ref<any[]>([])

// USER
const displayName = computed(
  () =>
    user.value?.full_name ||
    user.value?.name ||
    user.value?.username ||
    "HR Personnel",
)

// HELPERS
const teacherRole = (teacher: any) =>
  teacher?.user?.role?.name ||
  teacher?.user?.role?.type ||
  teacher?.role ||
  "Faculty"

const teacherName = (teacher: any) =>
  teacher?.name ||
  teacher?.full_name ||
  teacher?.user?.username ||
  "Faculty Member"

const teacherDepartment = (teacher: any) => {
  const department =
    teacher?.department?.name ??
    teacher?.department?.data?.name ??
    teacher?.department?.data?.attributes?.name ??
    teacher?.department?.attributes?.name

  return department || "Department not specified"
}

const entryTeacher = (entry: any) =>
  entry?.teacher || {}

const entryTeacherName = (entry: any) =>
  teacherName(entryTeacher(entry))

const entryTeacherDepartment = (entry: any) =>
  teacherDepartment(entryTeacher(entry))

const rankingTeacherName = (ranking: any) =>
  teacherName(ranking?.teacher || {})

const entryTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    educational_qualifications: "i-lucide-graduation-cap",
    eligibility: "i-lucide-badge-check",
    training_seminars: "i-lucide-presentation",
    research: "i-lucide-flask-conical",
    awards_recognition: "i-lucide-trophy",
    professional_experience: "i-lucide-briefcase",
    loyalty: "i-lucide-heart-handshake",
    evaluation: "i-lucide-clipboard-check",
    corporate_social_responsibility: "i-lucide-hand-heart",
  }

  return icons[type] || "i-lucide-file-text"
}

const formatStatus = (value: string) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())

const formatDate = (value: any) => {
  if (!value) return "N/A"

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
}

const formatPoints = (value: unknown) => {
  const parsed = Number(value ?? 0)

  if (!Number.isFinite(parsed)) {
    return "0"
  }

  return Number.isInteger(parsed)
    ? String(parsed)
    : parsed.toFixed(2).replace(/\.?0+$/, "")
}

// DASHBOARD COMPUTED
const personnel = computed(() =>
  teachers.value.filter((teacher: any) =>
    ["Faculty", "Dean"].includes(teacherRole(teacher)),
  ),
)

const stats = computed(() => {
  const totalPersonnel = personnel.value.length

  const computedTeacherIds = new Set(
    rankings.value
      .map((ranking: any) => ranking?.teacher?.documentId)
      .filter(Boolean),
  )

  const computedRankings = personnel.value.filter((teacher: any) =>
    computedTeacherIds.has(teacher.documentId),
  ).length

  const currentEntries = portfolioEntries.value.filter(
    (entry: any) => entry.is_current !== false,
  ).length

  const inactiveEntries = portfolioEntries.value.filter(
    (entry: any) => entry.is_current === false,
  ).length

  const computedRankingRecords = rankings.value.filter(
    (ranking: any) => ranking?.computation_status === "computed",
  )

  const rateMissing = computedRankingRecords.filter(
    (ranking: any) =>
      ranking?.rate_assignment_status === "not_configured",
  ).length

  return {
    totalPersonnel,
    totalEntries: portfolioEntries.value.length,
    currentEntries,
    inactiveEntries,
    computedRankings,
    pendingRankings: Math.max(totalPersonnel - computedRankings, 0),
    rateMissing,
    rateConfigured: Math.max(computedRankings - rateMissing, 0),
  }
})

const recentEntries = computed(() =>
  [...portfolioEntries.value]
    .sort((a: any, b: any) => {
      const aDate = new Date(a?.createdAt || a?.date_earned || 0).getTime()
      const bDate = new Date(b?.createdAt || b?.date_earned || 0).getTime()

      return bDate - aDate
    })
    .slice(0, 5),
)

const recentRankings = computed(() =>
  [...rankings.value]
    .filter((ranking: any) => ranking?.computation_status === "computed")
    .sort((a: any, b: any) => {
      const aDate = new Date(a?.computed_at || a?.updatedAt || 0).getTime()
      const bDate = new Date(b?.computed_at || b?.updatedAt || 0).getTime()

      return bDate - aDate
    })
    .slice(0, 5),
)

// LOCAL UI COMPONENTS
const HeroStat = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    icon: String,
  },

  setup(props) {
    return () =>
      h(
        "div",
        {
          class:
            "rounded-[20px] border border-white/15 bg-white/10 p-3 backdrop-blur-sm",
        },
        [
          h(
            "div",
            {
              class: "flex items-center justify-between gap-2",
            },
            [
              h(resolveComponent("UIcon"), {
                name: props.icon,
                class: "size-4 text-cyan-200",
              }),

              h(
                "span",
                {
                  class:
                    "text-[9px] font-bold uppercase tracking-[0.12em] text-blue-100",
                },
                props.label,
              ),
            ],
          ),

          h(
            "p",
            {
              class: "mt-3 text-2xl font-black",
            },
            String(props.value ?? 0),
          ),
        ],
      )
  },
})

const StatCard = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    icon: String,
    description: String,
    tone: {
      type: String,
      default: "info",
    },
  },

  setup(props) {
    const tones: Record<string, any> = {
      info: {
        icon:
          "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
        accent:
          "from-blue-500/15 via-blue-500/5 to-transparent",
      },
      primary: {
        icon:
          "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400",
        accent:
          "from-indigo-500/15 via-indigo-500/5 to-transparent",
      },
      success: {
        icon:
          "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
        accent:
          "from-emerald-500/15 via-emerald-500/5 to-transparent",
      },
      warning: {
        icon:
          "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
        accent:
          "from-amber-500/15 via-amber-500/5 to-transparent",
      },
    }

    return () => {
      const tone = tones[props.tone] || tones.info

      return h(
        "div",
        {
          class:
            "group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900",
        },
        [
          h("div", {
            class: `pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${tone.accent}`,
          }),

          h(
            "div",
            {
              class: "relative flex items-start justify-between gap-4",
            },
            [
              h("div", {}, [
                h(
                  "p",
                  {
                    class:
                      "text-xs font-bold uppercase tracking-[0.08em] text-gray-500",
                  },
                  props.label,
                ),

                h(
                  "p",
                  {
                    class:
                      "mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white",
                  },
                  String(props.value ?? 0),
                ),

                h(
                  "p",
                  {
                    class:
                      "mt-1.5 text-[11px] leading-4 text-gray-400",
                  },
                  props.description || "",
                ),
              ]),

              h(
                "div",
                {
                  class: `flex size-11 items-center justify-center rounded-2xl shadow-sm ${tone.icon}`,
                },
                [
                  h(resolveComponent("UIcon"), {
                    name: props.icon,
                    class: "size-5",
                  }),
                ],
              ),
            ],
          ),
        ],
      )
    }
  },
})

const MiniCard = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    icon: String,
    tone: {
      type: String,
      default: "info",
    },
  },

  setup(props) {
    const tones: Record<string, string> = {
      info:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
      success:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
      warning:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
      neutral:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    }

    return () =>
      h(
        "div",
        {
          class:
            "rounded-[20px] border border-gray-200 bg-gray-50/60 p-4 transition hover:border-blue-200 hover:bg-blue-50/30 dark:border-gray-800 dark:bg-gray-950/30",
        },
        [
          h(
            "div",
            {
              class: "flex items-start justify-between gap-3",
            },
            [
              h("div", {}, [
                h(
                  "p",
                  {
                    class: "text-xs font-semibold text-gray-500",
                  },
                  props.label,
                ),

                h(
                  "p",
                  {
                    class:
                      "mt-2 text-2xl font-black text-gray-900 dark:text-white",
                  },
                  String(props.value ?? 0),
                ),
              ]),

              h(
                "div",
                {
                  class: `flex size-9 items-center justify-center rounded-xl ${
                    tones[props.tone] || tones.info
                  }`,
                },
                [
                  h(resolveComponent("UIcon"), {
                    name: props.icon,
                    class: "size-4",
                  }),
                ],
              ),
            ],
          ),
        ],
      )
  },
})

const QuickAction = defineComponent({
  props: {
    label: String,
    description: String,
    icon: String,
    to: String,
    tone: {
      type: String,
      default: "info",
    },
  },

  setup(props) {
    const tones: Record<string, string> = {
      info:
        "bg-blue-50 text-blue-600 group-hover:bg-blue-600 dark:bg-blue-950/40",
      success:
        "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 dark:bg-emerald-950/40",
    }

    return () =>
      h(
        resolveComponent("NuxtLink"),
        {
          to: props.to,
          class:
            "group flex items-center gap-3 rounded-[18px] border border-gray-200 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm dark:border-gray-800 dark:hover:border-blue-900 dark:hover:bg-blue-950/20",
        },
        {
          default: () => [
            h(
              "div",
              {
                class: `flex size-10 shrink-0 items-center justify-center rounded-xl transition group-hover:text-white ${
                  tones[props.tone] || tones.info
                }`,
              },
              [
                h(resolveComponent("UIcon"), {
                  name: props.icon,
                  class: "size-5",
                }),
              ],
            ),

            h(
              "div",
              {
                class: "min-w-0 flex-1",
              },
              [
                h(
                  "p",
                  {
                    class:
                      "font-semibold text-gray-900 dark:text-white",
                  },
                  props.label,
                ),

                h(
                  "p",
                  {
                    class: "mt-1 text-xs leading-5 text-gray-500",
                  },
                  props.description,
                ),
              ],
            ),

            h(resolveComponent("UIcon"), {
              name: "i-lucide-chevron-right",
              class:
                "size-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600",
            }),
          ],
        },
      )
  },
})

const ProgressRow = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    total: [String, Number],
    tone: {
      type: String,
      default: "info",
    },
  },

  setup(props) {
    const tones: Record<string, string> = {
      info: "bg-blue-600",
      success: "bg-emerald-600",
      warning: "bg-amber-500",
      danger: "bg-red-600",
    }

    return () => {
      const value = Number(props.value || 0)
      const total = Number(props.total || 0)

      const percentage =
        total > 0
          ? Math.round((value / total) * 100)
          : 0

      return h("div", {}, [
        h(
          "div",
          {
            class: "flex items-center justify-between gap-3 text-sm",
          },
          [
            h(
              "span",
              {
                class:
                  "font-medium text-gray-700 dark:text-gray-300",
              },
              props.label,
            ),

            h(
              "span",
              {
                class:
                  "font-bold text-gray-900 dark:text-white",
              },
              `${value} (${percentage}%)`,
            ),
          ],
        ),

        h(
          "div",
          {
            class:
              "mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800",
          },
          [
            h("div", {
              class: `h-full rounded-full transition-all ${
                tones[props.tone] || tones.info
              }`,
              style: {
                width: `${Math.min(percentage, 100)}%`,
              },
            }),
          ],
        ),
      ])
    }
  },
})

// DATA LOADING
const loadDashboard = async () => {
  loading.value = true
  loadError.value = ""

  try {
    const [
      teacherResponse,
      portfolioEntryResponse,
      rankingResponse,
      schemeResponse,
    ]: any[] = await Promise.all([
      $api("/teachers", {
        query: {
          "populate[department]": true,
          "populate[user][populate][role]": true,
          "pagination[page]": 1,
          "pagination[pageSize]": 1000,
        },
      }),

      $api("/portfolio-entries", {
        query: {
          "populate[teacher][populate][department]": true,
          "populate[teacher][populate][user]": true,
          "sort[0]": "createdAt:desc",
          "pagination[page]": 1,
          "pagination[pageSize]": 1000,
        },
      }),

      $api("/faculty-rankings", {
        query: {
          "populate[teacher]": true,
          "populate[ranking_scheme]": true,
          "populate[rank_band]": true,
          "populate[salary_rate_record]": true,
          "sort[0]": "computed_at:desc",
          "pagination[page]": 1,
          "pagination[pageSize]": 1000,
        },
      }),

      $api("/ranking-schemes", {
        query: {
          "filters[is_active][$eq]": true,
          "filters[scheme_status][$eq]": "active",
          "pagination[page]": 1,
          "pagination[pageSize]": 100,
        },
      }),
    ])

    teachers.value = teacherResponse?.data || []
    portfolioEntries.value = portfolioEntryResponse?.data || []
    rankings.value = rankingResponse?.data || []
    rankingSchemes.value = schemeResponse?.data || []
  } catch (error: any) {
    console.error("HR dashboard loading error:", error)

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to load HR dashboard records."
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>
