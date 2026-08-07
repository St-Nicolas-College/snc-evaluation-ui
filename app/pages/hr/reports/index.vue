<template>
  <div class="space-y-6 pb-10">
    <!-- PAGE HEADER -->
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
        class="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"
      >
        <div>
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-blue-100"
          >
            Human Resource Portal
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-3">
            <h1
              class="text-3xl font-black tracking-tight sm:text-[34px]"
            >
              HR Reports
            </h1>

            <span
              class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100 backdrop-blur-sm"
            >
              Reports Center
            </span>
          </div>

          <p
            class="mt-3 max-w-3xl text-sm leading-6 text-blue-100"
          >
            Access consolidated faculty ranking reports and executive ranking
            analytics from one central HR reporting workspace.
          </p>
        </div>

        <div
          v-if="activeScheme"
          class="min-w-[270px] rounded-[22px] border border-white/15 bg-white/10 px-5 py-4 shadow-inner backdrop-blur-md"
        >
          <p
            class="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-100"
          >
            Current Ranking Period
          </p>

          <p class="mt-1 text-sm font-bold">
            {{ activeScheme.name }}
          </p>

          <p class="mt-1 text-xs text-blue-100">
            {{ currentSchoolYear }}
            <span class="mx-1">•</span>
            {{ currentSemester }}
          </p>
        </div>
      </div>
    </section>

    <!-- SUMMARY -->
    <section>
      <div
        class="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p
            class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
          >
            Reports Overview
          </p>

          <h2
            class="mt-1 text-lg font-black text-gray-900 dark:text-white"
          >
            Reporting Workspace
          </h2>
        </div>

        <p class="text-xs text-gray-500">
          Current summary from the active faculty ranking period.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Available Reports"
          value="1"
          icon="i-lucide-file-chart-column"
          description="Faculty Ranking Report"
          tone="info"
        />

        <StatCard
          label="Analytics Dashboards"
          value="1"
          icon="i-lucide-chart-no-axes-combined"
          description="Faculty Ranking Analytics"
          tone="primary"
        />

        <StatCard
          label="Computed Rankings"
          :value="summary.computedRankings"
          icon="i-lucide-circle-check-big"
          description="Current ranking records"
          tone="success"
        />

        <StatCard
          label="Personnel"
          :value="summary.totalPersonnel"
          icon="i-lucide-users"
          description="Faculty and deans"
          tone="neutral"
        />
      </div>
    </section>

    <!-- LOADING -->
    <div
      v-if="loading"
      class="grid gap-4 lg:grid-cols-2"
    >
      <USkeleton class="h-64 rounded-[26px]" />
      <USkeleton class="h-64 rounded-[26px]" />
    </div>

    <!-- ERROR -->
    <section
      v-else-if="loadError"
      class="rounded-[24px] border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/20"
    >
      <div class="flex items-start gap-3">
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
        >
          <UIcon
            name="i-lucide-triangle-alert"
            class="size-5"
          />
        </div>

        <div>
          <p
            class="font-semibold text-amber-900 dark:text-amber-200"
          >
            Some report summary information could not be loaded.
          </p>

          <p class="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-300">
            {{ loadError }}
          </p>
        </div>
      </div>
    </section>

    <!-- REPORT MODULES -->
    <section v-else class="grid gap-5 lg:grid-cols-2">
      <!-- RANKING REPORT -->
      <NuxtLink
        to="/hr/reports/ranking"
        class="group relative overflow-hidden rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-900"
      >
        <div
          class="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full bg-blue-500/10 blur-3xl"
        />

        <div class="relative">
          <div
            class="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          >
            <UIcon
              name="i-lucide-file-chart-column"
              class="size-6"
            />
          </div>

          <div class="mt-5">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p
                  class="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400"
                >
                  Official Report
                </p>

                <h2
                  class="mt-1 text-xl font-black text-gray-900 dark:text-white"
                >
                  Faculty Ranking Report
                </h2>
              </div>

              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-5 text-gray-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-600"
              />
            </div>

            <p class="mt-3 text-sm leading-6 text-gray-500">
              Review consolidated faculty and dean ranking results with filters
              for school year, semester, department, role, and assigned rank.
            </p>
          </div>

          <div
            class="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            <FeatureChip
              icon="i-lucide-filter"
              label="Filters"
            />

            <FeatureChip
              icon="i-lucide-file-search"
              label="PDF Preview"
            />

            <FeatureChip
              icon="i-lucide-download"
              label="PDF Export"
            />

            <FeatureChip
              icon="i-lucide-file-spreadsheet"
              label="Excel Export"
            />
          </div>

          <div
            class="mt-6 flex items-center justify-between rounded-2xl bg-blue-50 px-4 py-3 dark:bg-blue-950/20"
          >
            <div>
              <p class="text-xs font-semibold text-blue-700 dark:text-blue-300">
                Current Records
              </p>

              <p class="mt-1 text-lg font-black text-blue-900 dark:text-blue-100">
                {{ summary.computedRankings }}
              </p>
            </div>

            <span
              class="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400"
            >
              Open Report
            </span>
          </div>
        </div>
      </NuxtLink>

      <!-- ANALYTICS -->
      <NuxtLink
        to="/hr/ranking/analytics"
        class="group relative overflow-hidden rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-violet-900"
      >
        <div
          class="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full bg-violet-500/10 blur-3xl"
        />

        <div class="relative">
          <div
            class="flex size-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20"
          >
            <UIcon
              name="i-lucide-chart-no-axes-combined"
              class="size-6"
            />
          </div>

          <div class="mt-5">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p
                  class="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400"
                >
                  Executive Analytics
                </p>

                <h2
                  class="mt-1 text-xl font-black text-gray-900 dark:text-white"
                >
                  Faculty Ranking Analytics
                </h2>
              </div>

              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-5 text-gray-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-violet-600"
              />
            </div>

            <p class="mt-3 text-sm leading-6 text-gray-500">
              Explore KPI summaries, rank distribution, department averages,
              portfolio breakdown, salary-rate distribution, top rankings, and
              historical trends.
            </p>
          </div>

          <div
            class="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            <FeatureChip
              icon="i-lucide-gauge"
              label="KPIs"
            />

            <FeatureChip
              icon="i-lucide-chart-bar-big"
              label="Charts"
            />

            <FeatureChip
              icon="i-lucide-trophy"
              label="Top 10"
            />

            <FeatureChip
              icon="i-lucide-chart-spline"
              label="Trends"
            />
          </div>

          <div
            class="mt-6 flex items-center justify-between rounded-2xl bg-violet-50 px-4 py-3 dark:bg-violet-950/20"
          >
            <div>
              <p
                class="text-xs font-semibold text-violet-700 dark:text-violet-300"
              >
                Average Ranking Points
              </p>

              <p
                class="mt-1 text-lg font-black text-violet-900 dark:text-violet-100"
              >
                {{ summary.averagePoints }}
              </p>
            </div>

            <span
              class="text-xs font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400"
            >
              Open Analytics
            </span>
          </div>
        </div>
      </NuxtLink>
    </section>

    <!-- CURRENT PERIOD -->
    <section
      class="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
          >
            <UIcon
              name="i-lucide-calendar-range"
              class="size-5"
            />
          </div>

          <div>
            <h2
              class="font-bold text-gray-900 dark:text-white"
            >
              Current Reporting Period
            </h2>

            <p class="mt-1 text-xs text-gray-500">
              New report pages automatically default to the active academic period.
            </p>
          </div>
        </div>

        <div
          class="grid grid-cols-2 gap-2 sm:min-w-[360px]"
        >
          <div
            class="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30"
          >
            <p
              class="text-[10px] font-bold uppercase tracking-wide text-gray-500"
            >
              School Year
            </p>

            <p
              class="mt-1 font-black text-gray-900 dark:text-white"
            >
              {{ currentSchoolYear }}
            </p>
          </div>

          <div
            class="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30"
          >
            <p
              class="text-[10px] font-bold uppercase tracking-wide text-gray-500"
            >
              Semester
            </p>

            <p
              class="mt-1 font-black text-gray-900 dark:text-white"
            >
              {{ currentSemester }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  middleware: ["auth", "role"],
  role: ["HR", "Admin"],
})

const { $api } = useNuxtApp()

const loading = ref(false)
const loadError = ref("")

const rankings = ref<any[]>([])
const teachers = ref<any[]>([])
const schemes = ref<any[]>([])

const teacherRole = (teacher: any) =>
  teacher?.user?.role?.name ||
  teacher?.user?.role?.type ||
  teacher?.role ||
  "Faculty"

const activeScheme = computed(() =>
  schemes.value.find(
    (scheme: any) =>
      scheme.is_active === true &&
      scheme.scheme_status ===
        "active",
  ),
)

const currentSchoolYear = computed(() => {
  const active =
    activeScheme.value

  const fromScheme =
    active?.school_year ??
    active?.academic_year

  if (fromScheme) {
    return fromScheme
  }

  const values =
    rankings.value
      .map(
        (ranking: any) =>
          ranking.school_year,
      )
      .filter(Boolean)
      .sort()
      .reverse()

  return (
    values[0] ||
    "Not configured"
  )
})

const currentSemester = computed(() => {
  const active =
    activeScheme.value

  if (active?.semester) {
    return active.semester
  }

  const preferredOrder = [
    "1st Semester",
    "2nd Semester",
    "Summer",
    "Annual",
  ]

  const values =
    Array.from(
      new Set(
        rankings.value
          .filter(
            (ranking: any) =>
              currentSchoolYear.value ===
                "Not configured" ||
              ranking.school_year ===
                currentSchoolYear.value,
          )
          .map(
            (ranking: any) =>
              ranking.semester,
          )
          .filter(Boolean),
      ),
    )

  return (
    preferredOrder.find(
      (semester) =>
        values.includes(
          semester,
        ),
    ) ||
    values[0] ||
    "Not configured"
  )
})

const summary = computed(() => {
  const periodRankings =
    rankings.value.filter(
      (ranking: any) => {
        const schoolYearMatches =
          currentSchoolYear.value ===
            "Not configured" ||
          ranking.school_year ===
            currentSchoolYear.value

        const semesterMatches =
          currentSemester.value ===
            "Not configured" ||
          ranking.semester ===
            currentSemester.value

        return (
          schoolYearMatches &&
          semesterMatches
        )
      },
    )

  const pointValues =
    periodRankings
      .map(
        (ranking: any) =>
          Number(
            ranking
              .total_ranking_points ||
              0,
          ),
      )
      .filter(
        (value: number) =>
          Number.isFinite(value),
      )

  const averagePoints =
    pointValues.length
      ? pointValues.reduce(
          (
            sum: number,
            value: number,
          ) => sum + value,
          0,
        ) /
        pointValues.length
      : 0

  return {
    totalPersonnel:
      teachers.value.length,

    computedRankings:
      periodRankings.length,

    averagePoints:
      new Intl.NumberFormat(
        "en-PH",
        {
          minimumFractionDigits:
            2,
          maximumFractionDigits:
            2,
        },
      ).format(
        averagePoints,
      ),
  }
})

// LOCAL COMPONENTS
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
    const tones: Record<
      string,
      any
    > = {
      info: {
        icon:
          "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
        accent:
          "from-blue-500/15 via-blue-500/5 to-transparent",
      },

      primary: {
        icon:
          "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
        accent:
          "from-violet-500/15 via-violet-500/5 to-transparent",
      },

      success: {
        icon:
          "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
        accent:
          "from-emerald-500/15 via-emerald-500/5 to-transparent",
      },

      neutral: {
        icon:
          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        accent:
          "from-slate-500/10 via-slate-500/5 to-transparent",
      },
    }

    return () => {
      const tone =
        tones[props.tone] ||
        tones.info

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
              class:
                "relative flex items-start justify-between gap-4",
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
                  String(
                    props.value ?? 0,
                  ),
                ),

                h(
                  "p",
                  {
                    class:
                      "mt-1.5 text-[11px] leading-4 text-gray-400",
                  },
                  props.description ||
                    "",
                ),
              ]),

              h(
                "div",
                {
                  class: `flex size-11 items-center justify-center rounded-2xl shadow-sm ${tone.icon}`,
                },
                [
                  h(
                    resolveComponent(
                      "UIcon",
                    ),
                    {
                      name:
                        props.icon,
                      class:
                        "size-5",
                    },
                  ),
                ],
              ),
            ],
          ),
        ],
      )
    }
  },
})

const FeatureChip = defineComponent({
  props: {
    icon: String,
    label: String,
  },

  setup(props) {
    return () =>
      h(
        "div",
        {
          class:
            "flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 dark:bg-gray-950/30 dark:text-gray-300",
        },
        [
          h(
            resolveComponent(
              "UIcon",
            ),
            {
              name:
                props.icon,
              class:
                "size-4 text-gray-400",
            },
          ),

          h(
            "span",
            {},
            props.label,
          ),
        ],
      )
  },
})

// DATA
const loadData = async () => {
  loading.value = true
  loadError.value = ""

  try {
    const [
      rankingResponse,
      teacherResponse,
      schemeResponse,
    ]: any[] =
      await Promise.all([
        $api(
          "/faculty-rankings",
          {
            query: {
              "populate[teacher]":
                true,
              "populate[ranking_scheme]":
                true,
              "pagination[page]":
                1,
              "pagination[pageSize]":
                1000,
            },
          },
        ),

        $api(
          "/teachers",
          {
            query: {
              "populate[user][populate][role]":
                true,
              "pagination[page]":
                1,
              "pagination[pageSize]":
                1000,
            },
          },
        ),

        $api(
          "/ranking-schemes",
          {
            query: {
              "pagination[page]":
                1,
              "pagination[pageSize]":
                100,
            },
          },
        ),
      ])

    rankings.value =
      rankingResponse?.data ||
      []

    teachers.value = (
      teacherResponse?.data ||
      []
    ).filter(
      (teacher: any) =>
        [
          "Faculty",
          "Dean",
        ].includes(
          teacherRole(
            teacher,
          ),
        ),
    )

    schemes.value =
      schemeResponse?.data ||
      []
  } catch (error: any) {
    console.error(
      "HR reports overview loading error:",
      error,
    )

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to load HR report summary."
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>
