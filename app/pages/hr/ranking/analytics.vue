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
        class="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"
      >
        <div>
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-blue-100"
          >
            Human Resource Analytics
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-3">
            <h1
              class="text-3xl font-black tracking-tight sm:text-[34px]"
            >
              Faculty Ranking Analytics
            </h1>

            <span
              class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100 backdrop-blur-sm"
            >
              Executive Dashboard
            </span>
          </div>

          <p
            class="mt-3 max-w-3xl text-sm leading-6 text-blue-100"
          >
            Analyze faculty and dean ranking performance by academic period,
            department, role, ranking points, rank assignment, and salary rate.
          </p>
        </div>

        <div
          v-if="activeScheme"
          class="min-w-[260px] rounded-[22px] border border-white/15 bg-white/10 px-5 py-4 shadow-inner backdrop-blur-md"
        >
          <p
            class="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-100"
          >
            Active Ranking Scheme
          </p>

          <p class="mt-1 text-sm font-bold">
            {{ activeScheme.name }}
          </p>

          <p class="mt-1 text-xs text-blue-100">
            {{
              selectedSchoolYear === "all"
                ? "All School Years"
                : selectedSchoolYear
            }}
            <span class="mx-1">•</span>
            {{
              selectedSemester === "all"
                ? "All Semesters"
                : selectedSemester
            }}
          </p>
        </div>
      </div>
    </section>

    <!-- FILTERS -->
    <section
      class="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="mb-5 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
          >
            <UIcon
              name="i-lucide-sliders-horizontal"
              class="size-5"
            />
          </div>

          <div>
            <h2 class="font-bold text-gray-900 dark:text-white">
              Analytics Filters
            </h2>

            <p class="mt-1 text-xs text-gray-500">
              Dashboard cards and charts update automatically when filters change.
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <UButton
            v-if="hasActiveFilters"
            color="neutral"
            variant="soft"
            icon="i-lucide-filter-x"
            @click="clearFilters"
          >
            Reset Filters
          </UButton>

          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-refresh-cw"
            :loading="loading"
            @click="loadData"
          >
            Refresh
          </UButton>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <UFormField label="School Year">
          <USelectMenu
            v-model="selectedSchoolYear"
            :items="schoolYearOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Semester">
          <USelectMenu
            v-model="selectedSemester"
            :items="semesterOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Department">
          <USelectMenu
            v-model="selectedDepartment"
            :items="departmentOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Role">
          <USelectMenu
            v-model="selectedRole"
            :items="roleOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>
      </div>
    </section>

    <!-- LOADING -->
    <div v-if="loading" class="space-y-5">
      <div class="grid grid-cols-2 gap-3 xl:grid-cols-6">
        <USkeleton
          v-for="index in 6"
          :key="index"
          class="h-32 rounded-[24px]"
        />
      </div>

      <div class="grid gap-5 xl:grid-cols-2">
        <USkeleton
          v-for="index in 4"
          :key="`chart-${index}`"
          class="h-[430px] rounded-[26px]"
        />
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
        <UIcon
          name="i-lucide-triangle-alert"
          class="size-7"
        />
      </div>

      <h2 class="mt-4 font-bold text-gray-900 dark:text-white">
        Unable to load faculty ranking analytics
      </h2>

      <p class="mt-2 text-sm text-gray-500">
        {{ loadError }}
      </p>

      <UButton
        class="mt-5"
        icon="i-lucide-refresh-cw"
        @click="loadData"
      >
        Try Again
      </UButton>
    </section>

    <template v-else>
      <!-- KPI SECTION -->
      <section>
        <div
          class="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p
              class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
            >
              Ranking Overview
            </p>

            <h2 class="mt-1 text-lg font-black text-gray-900 dark:text-white">
              Current Analytics Summary
            </h2>
          </div>

          <p class="text-xs text-gray-500">
            Summary values reflect the selected academic period and personnel filters.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 xl:grid-cols-6">
          <AnalyticsCard
            label="Total Personnel"
            :value="analytics.totalPersonnel"
            icon="i-lucide-users"
            description="Faculty and deans"
            tone="info"
          />

          <AnalyticsCard
            label="Computed"
            :value="analytics.computed"
            icon="i-lucide-circle-check-big"
            description="Ranking records"
            tone="success"
          />

          <AnalyticsCard
            label="Pending"
            :value="analytics.pending"
            icon="i-lucide-clock-3"
            description="Not yet computed"
            tone="warning"
          />

          <AnalyticsCard
            label="Average Points"
            :value="analytics.averagePoints"
            icon="i-lucide-chart-no-axes-column-increasing"
            description="Ranking average"
            tone="primary"
          />

          <AnalyticsCard
            label="Highest Points"
            :value="analytics.highestPoints"
            icon="i-lucide-trophy"
            :description="analytics.highestRank"
            tone="accent"
          />

          <AnalyticsCard
            label="Average Salary"
            :value="analytics.averageSalary"
            icon="i-lucide-wallet-cards"
            description="Configured salary rates"
            tone="neutral"
          />
        </div>
      </section>

      <!-- ANALYTICS CHARTS -->
      <section class="grid gap-5 xl:grid-cols-2">
        <!-- RANK DISTRIBUTION -->
        <div
          class="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
            >
              <UIcon
                name="i-lucide-award"
                class="size-5"
              />
            </div>

            <div>
              <h2 class="font-bold text-gray-900 dark:text-white">
                Rank Distribution
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Number of personnel assigned to each faculty rank.
              </p>
            </div>
          </div>

          <div
            v-if="!rankDistribution.values.length"
            class="flex h-[340px] items-center justify-center"
          >
            <EmptyChart
              icon="i-lucide-award"
              text="No rank distribution data"
            />
          </div>

          <ClientOnly v-else>
            <ApexChart
              class="mt-5"
              type="bar"
              height="340"
              :options="rankChartOptions"
              :series="rankChartSeries"
            />

            <template #fallback>
              <USkeleton
                class="mt-5 h-[340px] rounded-2xl"
              />
            </template>
          </ClientOnly>
        </div>

        <!-- DEPARTMENT AVERAGE -->
        <div
          class="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
            >
              <UIcon
                name="i-lucide-building-2"
                class="size-5"
              />
            </div>

            <div>
              <h2 class="font-bold text-gray-900 dark:text-white">
                Department Average Ranking
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Average total ranking points by department.
              </p>
            </div>
          </div>

          <div
            v-if="!departmentAverage.values.length"
            class="flex h-[340px] items-center justify-center"
          >
            <EmptyChart
              icon="i-lucide-building-2"
              text="No department ranking data"
            />
          </div>

          <ClientOnly v-else>
            <ApexChart
              class="mt-5"
              type="bar"
              height="340"
              :options="departmentChartOptions"
              :series="departmentChartSeries"
            />

            <template #fallback>
              <USkeleton
                class="mt-5 h-[340px] rounded-2xl"
              />
            </template>
          </ClientOnly>
        </div>

        <!-- PORTFOLIO BREAKDOWN -->
        <div
          class="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
            >
              <UIcon
                name="i-lucide-chart-pie"
                class="size-5"
              />
            </div>

            <div>
              <h2 class="font-bold text-gray-900 dark:text-white">
                Portfolio Breakdown
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Average contribution of the four major ranking criteria.
              </p>
            </div>
          </div>

          <div
            v-if="!hasPortfolioData"
            class="flex h-[340px] items-center justify-center"
          >
            <EmptyChart
              icon="i-lucide-chart-pie"
              text="No portfolio breakdown data"
            />
          </div>

          <ClientOnly v-else>
            <ApexChart
              class="mt-5"
              type="donut"
              height="340"
              :options="portfolioChartOptions"
              :series="portfolioChartSeries"
            />

            <template #fallback>
              <USkeleton
                class="mt-5 h-[340px] rounded-2xl"
              />
            </template>
          </ClientOnly>
        </div>

        <!-- SALARY DISTRIBUTION -->
        <div
          class="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
            >
              <UIcon
                name="i-lucide-wallet-cards"
                class="size-5"
              />
            </div>

            <div>
              <h2 class="font-bold text-gray-900 dark:text-white">
                Salary Rate Distribution
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Personnel distribution by assigned salary rate.
              </p>
            </div>
          </div>

          <div
            v-if="!salaryDistribution.values.length"
            class="flex h-[340px] items-center justify-center"
          >
            <EmptyChart
              icon="i-lucide-wallet-cards"
              text="No salary-rate data"
            />
          </div>

          <ClientOnly v-else>
            <ApexChart
              class="mt-5"
              type="bar"
              height="340"
              :options="salaryChartOptions"
              :series="salaryChartSeries"
            />

            <template #fallback>
              <USkeleton
                class="mt-5 h-[340px] rounded-2xl"
              />
            </template>
          </ClientOnly>
        </div>
      </section>

      <!-- TOP 10 + HISTORICAL TREND -->
      <section
        class="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]"
      >
        <!-- TOP 10 -->
        <div
          class="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-amber-50/40 px-5 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/10"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex size-11 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20"
              >
                <UIcon
                  name="i-lucide-trophy"
                  class="size-5"
                />
              </div>

              <div>
                <p
                  class="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400"
                >
                  Leaderboard
                </p>

                <h2
                  class="mt-1 font-black text-gray-900 dark:text-white"
                >
                  Top 10 Faculty Rankings
                </h2>

                <p
                  class="mt-1 text-xs text-gray-500"
                >
                  Highest ranking points for the selected period.
                </p>
              </div>
            </div>
          </div>

          <div
            v-if="!topFacultyRankings.length"
            class="px-6 py-16 text-center"
          >
            <div
              class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
            >
              <UIcon
                name="i-lucide-trophy"
                class="size-6"
              />
            </div>

            <p
              class="mt-3 text-sm text-gray-500"
            >
              No ranking records available.
            </p>
          </div>

          <div
            v-else
            class="divide-y divide-gray-100 dark:divide-gray-800"
          >
            <NuxtLink
              v-for="(
                ranking,
                index
              ) in topFacultyRankings"
              :key="
                ranking.documentId ||
                ranking.id
              "
              :to="
                ranking.teacher
                  ?.documentId
                  ? `/hr/ranking/faculty/${ranking.teacher.documentId}?ranking=${ranking.documentId}`
                  : '/hr/ranking'
              "
              class="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-amber-50/30 dark:hover:bg-amber-950/10"
            >
              <div
                class="flex size-9 shrink-0 items-center justify-center rounded-xl font-black"
                :class="
                  index === 0
                    ? 'bg-amber-100 text-amber-700'
                    : index === 1
                      ? 'bg-slate-200 text-slate-700'
                      : index === 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                "
              >
                {{ index + 1 }}
              </div>

              <div
                class="min-w-0 flex-1"
              >
                <p
                  class="truncate font-bold text-gray-900 dark:text-white"
                >
                  {{
                    teacherName(
                      ranking.teacher,
                    )
                  }}
                </p>

                <p
                  class="mt-1 truncate text-xs text-gray-500"
                >
                  {{
                    ranking.rank_name ||
                    "Rank not assigned"
                  }}
                  <span class="mx-1">•</span>
                  {{
                    teacherDepartment(
                      ranking.teacher,
                    )
                  }}
                </p>
              </div>

              <div class="text-right">
                <p
                  class="text-lg font-black text-gray-900 dark:text-white"
                >
                  {{
                    formatNumber(
                      Number(
                        ranking.total_ranking_points ||
                          0,
                      ),
                      2,
                    )
                  }}
                </p>

                <p
                  class="text-[10px] uppercase tracking-wide text-gray-400"
                >
                  Points
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- HISTORICAL TREND -->
        <div
          class="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400"
            >
              <UIcon
                name="i-lucide-chart-spline"
                class="size-5"
              />
            </div>

            <div>
              <h2
                class="font-bold text-gray-900 dark:text-white"
              >
                Historical Ranking Trend
              </h2>

              <p
                class="mt-1 text-xs text-gray-500"
              >
                Average ranking points across semesters and school years.
              </p>
            </div>
          </div>

          <div
            v-if="
              !historicalTrend
                .values.length
            "
            class="flex h-[390px] items-center justify-center"
          >
            <EmptyChart
              icon="i-lucide-chart-spline"
              text="No historical ranking data"
            />
          </div>

          <ClientOnly v-else>
            <ApexChart
              class="mt-5"
              type="line"
              height="390"
              :options="
                historicalChartOptions
              "
              :series="
                historicalChartSeries
              "
            />

            <template #fallback>
              <USkeleton
                class="mt-5 h-[390px] rounded-2xl"
              />
            </template>
          </ClientOnly>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  middleware: ["auth", "role"],
  role: ["HR", "Admin"],
})

const { $api } = useNuxtApp()

// STATE
const loading = ref(false)
const loadError = ref("")

const teachers = ref<any[]>([])
const rankings = ref<any[]>([])
const schemes = ref<any[]>([])

const selectedSchoolYear = ref("all")
const selectedSemester = ref("all")
const selectedDepartment = ref("all")
const selectedRole = ref("all")

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

const teacherDepartment = (
  teacher: any,
) => {
  const department =
    teacher?.department?.name ??
    teacher?.department?.data?.name ??
    teacher?.department?.data
      ?.attributes?.name ??
    teacher?.department
      ?.attributes?.name

  return (
    department ||
    "Not specified"
  )
}

const getAssignedSalaryRate = (
  ranking: any,
): number | null => {
  const value =
    ranking?.salary_rate ??
    ranking?.salary_rate_record
      ?.max_rate

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed)
    ? parsed
    : null
}

const formatNumber = (
  value: number,
  decimals = 2,
) =>
  new Intl.NumberFormat(
    "en-PH",
    {
      minimumFractionDigits:
        decimals,
      maximumFractionDigits:
        decimals,
    },
  ).format(value)

const formatPhp = (
  value: number,
) =>
  `PHP ${formatNumber(value, 2)}`

// OPTIONS
const activeScheme = computed(() =>
  schemes.value.find(
    (scheme: any) =>
      scheme.is_active === true &&
      scheme.scheme_status ===
        "active",
  ),
)

const schoolYearOptions = computed(() => {
  const values =
    Array.from(
      new Set(
        rankings.value
          .map(
            (ranking: any) =>
              ranking.school_year,
          )
          .filter(Boolean),
      ),
    ).sort().reverse()

  return [
    {
      label:
        "All School Years",
      value: "all",
    },
    ...values.map(
      (value) => ({
        label: value,
        value,
      }),
    ),
  ]
})

const semesterOptions = computed(() => {
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
          .map(
            (ranking: any) =>
              ranking.semester,
          )
          .filter(Boolean),
      ),
    ).sort(
      (a: any, b: any) =>
        preferredOrder.indexOf(a) -
        preferredOrder.indexOf(b),
    )

  return [
    {
      label:
        "All Semesters",
      value: "all",
    },
    ...values.map(
      (value) => ({
        label: value,
        value,
      }),
    ),
  ]
})

const departmentOptions = computed(() => {
  const values =
    Array.from(
      new Set(
        teachers.value
          .map(
            (teacher: any) =>
              teacherDepartment(
                teacher,
              ),
          )
          .filter(
            (value) =>
              value &&
              value !==
                "Not specified",
          ),
      ),
    ).sort()

  return [
    {
      label:
        "All Departments",
      value: "all",
    },
    ...values.map(
      (value) => ({
        label: value,
        value,
      }),
    ),
  ]
})

const roleOptions = [
  {
    label: "All Roles",
    value: "all",
  },
  {
    label: "Faculty",
    value: "Faculty",
  },
  {
    label: "Dean",
    value: "Dean",
  },
]

// FILTERING
const filteredTeachers = computed(() =>
  teachers.value.filter(
    (teacher: any) => {
      const role =
        teacherRole(teacher)

      const department =
        teacherDepartment(
          teacher,
        )

      return (
        (
          selectedRole.value ===
            "all" ||
          role ===
            selectedRole.value
        ) &&
        (
          selectedDepartment.value ===
            "all" ||
          department ===
            selectedDepartment.value
        )
      )
    },
  ),
)

const filteredRankings = computed(() =>
  rankings.value.filter(
    (ranking: any) => {
      const role =
        teacherRole(
          ranking.teacher,
        )

      const department =
        teacherDepartment(
          ranking.teacher,
        )

      return (
        (
          selectedSchoolYear.value ===
            "all" ||
          ranking.school_year ===
            selectedSchoolYear.value
        ) &&
        (
          selectedSemester.value ===
            "all" ||
          ranking.semester ===
            selectedSemester.value
        ) &&
        (
          selectedDepartment.value ===
            "all" ||
          department ===
            selectedDepartment.value
        ) &&
        (
          selectedRole.value ===
            "all" ||
          role ===
            selectedRole.value
        )
      )
    },
  ),
)

// KPI ANALYTICS
const analytics = computed(() => {
  const rankingTeacherIds =
    new Set(
      filteredRankings.value
        .map(
          (ranking: any) =>
            ranking.teacher
              ?.documentId,
        )
        .filter(Boolean),
    )

  const computedCount =
    filteredTeachers.value.filter(
      (teacher: any) =>
        rankingTeacherIds.has(
          teacher.documentId,
        ),
    ).length

  const pointValues =
    filteredRankings.value
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

  const salaryValues =
    filteredRankings.value
      .map(
        (ranking: any) =>
          getAssignedSalaryRate(
            ranking,
          ),
      )
      .filter(
        (
          value: number | null,
        ): value is number =>
          value !== null &&
          Number.isFinite(value) &&
          value > 0,
      )

  const highestRanking =
    [...filteredRankings.value]
      .sort(
        (a: any, b: any) =>
          Number(
            b.total_ranking_points ||
              0,
          ) -
          Number(
            a.total_ranking_points ||
              0,
          ),
      )[0]

  const averagePoints =
    pointValues.length
      ? pointValues.reduce(
          (
            sum: number,
            value: number,
          ) => sum + value,
          0,
        ) / pointValues.length
      : 0

  const averageSalary =
    salaryValues.length
      ? salaryValues.reduce(
          (
            sum: number,
            value: number,
          ) => sum + value,
          0,
        ) / salaryValues.length
      : 0

  return {
    totalPersonnel:
      filteredTeachers.value
        .length,

    computed:
      computedCount,

    pending:
      Math.max(
        filteredTeachers.value
          .length -
          computedCount,
        0,
      ),

    averagePoints:
      formatNumber(
        averagePoints,
        2,
      ),

    highestPoints:
      highestRanking
        ? formatNumber(
            Number(
              highestRanking
                .total_ranking_points ||
                0,
            ),
            2,
          )
        : "0.00",

    highestRank:
      highestRanking
        ?.rank_name ||
      "No ranking data",

    averageSalary:
      formatPhp(
        averageSalary,
      ),
  }
})

// RANK DISTRIBUTION
const rankDistribution = computed(() => {
  const counts =
    new Map<
      string,
      number
    >()

  for (
    const ranking of
    filteredRankings.value
  ) {
    const rank =
      ranking.rank_name ||
      "Not Assigned"

    counts.set(
      rank,
      (counts.get(rank) ||
        0) + 1,
    )
  }

  const entries =
    Array.from(
      counts.entries(),
    ).sort(
      (a, b) =>
        b[1] - a[1],
    )

  return {
    categories:
      entries.map(
        ([rank]) => rank,
      ),

    values:
      entries.map(
        ([, count]) => count,
      ),
  }
})

// DEPARTMENT AVERAGE
const departmentAverage = computed(() => {
  const groups =
    new Map<
      string,
      number[]
    >()

  for (
    const ranking of
    filteredRankings.value
  ) {
    const department =
      teacherDepartment(
        ranking.teacher,
      )

    const totalPoints =
      Number(
        ranking
          .total_ranking_points ||
          0,
      )

    if (
      !Number.isFinite(
        totalPoints,
      )
    ) {
      continue
    }

    if (
      !groups.has(
        department,
      )
    ) {
      groups.set(
        department,
        [],
      )
    }

    groups
      .get(department)!
      .push(totalPoints)
  }

  const entries =
    Array.from(
      groups.entries(),
    )
      .map(
        ([
          department,
          values,
        ]) => ({
          department,

          average:
            values.length
              ? values.reduce(
                  (
                    sum,
                    value,
                  ) =>
                    sum +
                    value,
                  0,
                ) /
                values.length
              : 0,
        }),
      )
      .sort(
        (a, b) =>
          b.average -
          a.average,
      )

  return {
    categories:
      entries.map(
        (item) =>
          item.department,
      ),

    values:
      entries.map(
        (item) =>
          Number(
            item.average.toFixed(
              2,
            ),
          ),
      ),
  }
})

// PORTFOLIO BREAKDOWN
const portfolioBreakdown = computed(() => {
  const records =
    filteredRankings.value

  const labels = [
    "Educational Qualification",
    "Loyalty",
    "Evaluation",
    "CSR",
  ]

  if (!records.length) {
    return {
      labels,
      values: [
        0,
        0,
        0,
        0,
      ],
    }
  }

  const totals = {
    educational: 0,
    loyalty: 0,
    evaluation: 0,
    csr: 0,
  }

  for (
    const ranking of records
  ) {
    totals.educational +=
      Number(
        ranking
          .educational_qualification_total_points ||
          0,
      )

    totals.loyalty +=
      Number(
        ranking
          .loyalty_points ||
          0,
      )

    totals.evaluation +=
      Number(
        ranking
          .evaluation_points ||
          0,
      )

    totals.csr +=
      Number(
        ranking.csr_points ||
          0,
      )
  }

  return {
    labels,

    values: [
      totals.educational,
      totals.loyalty,
      totals.evaluation,
      totals.csr,
    ].map(
      (value) =>
        Number(
          (
            value /
            records.length
          ).toFixed(2),
        ),
    ),
  }
})

const hasPortfolioData = computed(() =>
  portfolioBreakdown.value
    .values.some(
      (value: number) =>
        Number(value) > 0,
    ),
)

// SALARY DISTRIBUTION
const salaryDistribution = computed(() => {
  const groups =
    new Map<
      number,
      number
    >()

  for (
    const ranking of
    filteredRankings.value
  ) {
    const rate =
      getAssignedSalaryRate(
        ranking,
      )

    if (
      rate === null ||
      !Number.isFinite(rate) ||
      rate <= 0
    ) {
      continue
    }

    groups.set(
      rate,
      (groups.get(rate) ||
        0) + 1,
    )
  }

  const entries =
    Array.from(
      groups.entries(),
    ).sort(
      (a, b) =>
        a[0] - b[0],
    )

  return {
    categories:
      entries.map(
        ([rate]) =>
          `PHP ${formatNumber(
            rate,
            2,
          )}`,
      ),

    values:
      entries.map(
        ([, count]) =>
          count,
      ),
  }
})

// TOP 10 FACULTY RANKINGS
const topFacultyRankings = computed(() =>
  [...filteredRankings.value]
    .sort(
      (a: any, b: any) =>
        Number(
          b.total_ranking_points || 0,
        ) -
        Number(
          a.total_ranking_points || 0,
        ),
    )
    .slice(0, 10),
)

// HISTORICAL RANKINGS
const historicalRankings = computed(() =>
  rankings.value.filter(
    (ranking: any) => {
      const role =
        teacherRole(
          ranking.teacher,
        )

      const department =
        teacherDepartment(
          ranking.teacher,
        )

      return (
        (
          selectedDepartment.value ===
            "all" ||
          department ===
            selectedDepartment.value
        ) &&
        (
          selectedRole.value ===
            "all" ||
          role ===
            selectedRole.value
        )
      )
    },
  ),
)

const historicalTrend = computed(() => {
  const groups =
    new Map<
      string,
      {
        schoolYear: string
        semester: string
        values: number[]
      }
    >()

  for (
    const ranking of
    historicalRankings.value
  ) {
    const schoolYear =
      ranking.school_year ||
      "Unknown"

    const semester =
      ranking.semester ||
      "Unknown"

    const key =
      `${schoolYear} - ${semester}`

    const value =
      Number(
        ranking.total_ranking_points ||
          0,
      )

    if (
      !Number.isFinite(value)
    ) {
      continue
    }

    if (!groups.has(key)) {
      groups.set(key, {
        schoolYear,
        semester,
        values: [],
      })
    }

    groups
      .get(key)!
      .values.push(value)
  }

  const semesterOrder: Record<
    string,
    number
  > = {
    "1st Semester": 1,
    "2nd Semester": 2,
    Summer: 3,
    Annual: 4,
  }

  const entries =
    Array.from(
      groups.entries(),
    )
      .map(
        ([
          label,
          group,
        ]) => ({
          label,

          schoolYear:
            group.schoolYear,

          semester:
            group.semester,

          average:
            group.values.length
              ? group.values.reduce(
                  (
                    sum,
                    item,
                  ) =>
                    sum + item,
                  0,
                ) /
                group.values.length
              : 0,
        }),
      )
      .sort((a, b) => {
        if (
          a.schoolYear !==
          b.schoolYear
        ) {
          return a.schoolYear.localeCompare(
            b.schoolYear,
          )
        }

        return (
          (
            semesterOrder[
              a.semester
            ] || 99
          ) -
          (
            semesterOrder[
              b.semester
            ] || 99
          )
        )
      })

  return {
    categories:
      entries.map(
        (item) =>
          item.label,
      ),

    values:
      entries.map(
        (item) =>
          Number(
            item.average.toFixed(
              2,
            ),
          ),
      ),
  }
})

// CHART OPTIONS
const rankChartOptions = computed(() => ({
  chart: {
    toolbar: {
      show: false,
    },

    animations: {
      enabled: true,
    },
  },

  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 5,
      distributed: false,
    },
  },

  dataLabels: {
    enabled: true,
  },

  grid: {
    borderColor:
      "#e5e7eb",
  },

  xaxis: {
    categories:
      rankDistribution.value
        .categories,

    title: {
      text: "Personnel",
    },
  },

  yaxis: {
    labels: {
      maxWidth: 180,
    },
  },

  tooltip: {
    y: {
      formatter: (
        value: number,
      ) =>
        `${value} personnel`,
    },
  },

  noData: {
    text:
      "No ranking data",
  },
}))

const rankChartSeries = computed(() => [
  {
    name: "Personnel",

    data:
      rankDistribution.value
        .values,
  },
])

const departmentChartOptions = computed(() => ({
  chart: {
    toolbar: {
      show: false,
    },

    animations: {
      enabled: true,
    },
  },

  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 5,
    },
  },

  dataLabels: {
    enabled: true,

    formatter: (
      value: number,
    ) =>
      Number(value).toFixed(
        2,
      ),
  },

  grid: {
    borderColor:
      "#e5e7eb",
  },

  xaxis: {
    categories:
      departmentAverage.value
        .categories,

    title: {
      text:
        "Average Ranking Points",
    },
  },

  yaxis: {
    labels: {
      maxWidth: 200,
    },
  },

  tooltip: {
    y: {
      formatter: (
        value: number,
      ) =>
        `${Number(
          value,
        ).toFixed(2)} points`,
    },
  },

  noData: {
    text:
      "No department data",
  },
}))

const departmentChartSeries = computed(() => [
  {
    name:
      "Average Points",

    data:
      departmentAverage.value
        .values,
  },
])

const portfolioChartOptions = computed(() => ({
  labels:
    portfolioBreakdown.value
      .labels,

  chart: {
    toolbar: {
      show: false,
    },
  },

  legend: {
    position: "bottom",
  },

  dataLabels: {
    enabled: true,

    formatter: (
      value: number,
    ) =>
      `${Number(
        value,
      ).toFixed(1)}%`,
  },

  tooltip: {
    y: {
      formatter: (
        value: number,
      ) =>
        `${Number(
          value,
        ).toFixed(2)} average points`,
    },
  },

  stroke: {
    width: 2,
  },

  noData: {
    text:
      "No portfolio data",
  },
}))

const portfolioChartSeries = computed(
  () =>
    portfolioBreakdown.value
      .values,
)

const salaryChartOptions = computed(() => ({
  chart: {
    toolbar: {
      show: false,
    },

    animations: {
      enabled: true,
    },
  },

  plotOptions: {
    bar: {
      borderRadius: 5,
      columnWidth: "60%",
    },
  },

  dataLabels: {
    enabled: false,
  },

  grid: {
    borderColor:
      "#e5e7eb",
  },

  xaxis: {
    categories:
      salaryDistribution.value
        .categories,

    labels: {
      rotate: -45,
      trim: true,
    },
  },

  yaxis: {
    min: 0,

    forceNiceScale: true,

    title: {
      text: "Personnel",
    },
  },

  tooltip: {
    y: {
      formatter: (
        value: number,
      ) =>
        `${value} personnel`,
    },
  },

  noData: {
    text:
      "No salary-rate data",
  },
}))

const salaryChartSeries = computed(() => [
  {
    name: "Personnel",

    data:
      salaryDistribution.value
        .values,
  },
])


const historicalChartOptions = computed(() => ({
  chart: {
    toolbar: {
      show: false,
    },

    animations: {
      enabled: true,
    },
  },

  stroke: {
    curve: "smooth",
    width: 3,
  },

  markers: {
    size: 5,
  },

  dataLabels: {
    enabled: false,
  },

  grid: {
    borderColor:
      "#e5e7eb",
  },

  xaxis: {
    categories:
      historicalTrend.value
        .categories,

    labels: {
      rotate: -35,
      trim: true,
    },
  },

  yaxis: {
    title: {
      text:
        "Average Ranking Points",
    },
  },

  tooltip: {
    y: {
      formatter: (
        value: number,
      ) =>
        `${Number(
          value,
        ).toFixed(2)} points`,
    },
  },

  noData: {
    text:
      "No historical ranking data",
  },
}))

const historicalChartSeries = computed(() => [
  {
    name:
      "Average Ranking Points",

    data:
      historicalTrend.value
        .values,
  },
])

// FILTER RESET
const hasActiveFilters = computed(
  () =>
    selectedDepartment.value !==
      "all" ||
    selectedRole.value !==
      "all",
)

const applyDefaultPeriod = () => {
  const active =
    activeScheme.value

  const activeSchoolYear =
    String(
      active?.school_year ??
      active?.academic_year ??
      "",
    ).trim()

  const activeSemester =
    String(
      active?.semester ??
      "",
    ).trim()

  const availableSchoolYears =
    schoolYearOptions.value
      .filter(
        (option: any) =>
          option.value !==
          "all",
      )

  if (
    activeSchoolYear &&
    availableSchoolYears.some(
      (option: any) =>
        option.value ===
        activeSchoolYear,
    )
  ) {
    selectedSchoolYear.value =
      activeSchoolYear
  } else {
    selectedSchoolYear.value =
      availableSchoolYears[0]
        ?.value ||
      "all"
  }

  const availableSemesters =
    semesterOptions.value.filter(
      (option: any) =>
        option.value !==
        "all",
    )

  if (
    activeSemester &&
    availableSemesters.some(
      (option: any) =>
        option.value ===
        activeSemester,
    )
  ) {
    selectedSemester.value =
      activeSemester
  } else {
    const preferredOrder = [
      "1st Semester",
      "2nd Semester",
      "Summer",
      "Annual",
    ]

    selectedSemester.value =
      preferredOrder.find(
        (semester) =>
          availableSemesters.some(
            (option: any) =>
              option.value ===
              semester,
          ),
      ) ||
      availableSemesters[0]
        ?.value ||
      "all"
  }
}

const clearFilters = () => {
  selectedDepartment.value =
    "all"

  selectedRole.value =
    "all"

  applyDefaultPeriod()
}

// LOCAL COMPONENTS
const AnalyticsCard = defineComponent({
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

      accent: {
        icon:
          "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
        accent:
          "from-violet-500/15 via-violet-500/5 to-transparent",
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
                    props.value ??
                      0,
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

const EmptyChart = defineComponent({
  props: {
    icon: String,
    text: String,
  },

  setup(props) {
    return () =>
      h(
        "div",
        {
          class:
            "text-center",
        },
        [
          h(
            "div",
            {
              class:
                "mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800",
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
                    "size-6",
                },
              ),
            ],
          ),

          h(
            "p",
            {
              class:
                "mt-3 text-sm font-medium text-gray-500",
            },
            props.text ||
              "No data available",
          ),
        ],
      )
  },
})

// DATA LOADING
const loadData = async () => {
  loading.value = true
  loadError.value = ""

  try {
    const [
      teacherResponse,
      rankingResponse,
      schemeResponse,
    ]: any[] =
      await Promise.all([
        $api(
          "/teachers",
          {
            query: {
              "populate[department]":
                true,
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
          "/faculty-rankings",
          {
            query: {
              "populate[teacher][populate][department]":
                true,
              "populate[teacher][populate][user][populate][role]":
                true,
              "populate[ranking_scheme]":
                true,
              "populate[rank_band]":
                true,
              "populate[salary_rate_record]":
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
              "filters[is_active][$eq]":
                true,
              "filters[scheme_status][$eq]":
                "active",
              "pagination[page]":
                1,
              "pagination[pageSize]":
                100,
            },
          },
        ),
      ])

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

    rankings.value =
      rankingResponse?.data ||
      []

    schemes.value =
      schemeResponse?.data ||
      []

    applyDefaultPeriod()
  } catch (error: any) {
    console.error(
      "Faculty ranking analytics loading error:",
      error,
    )

    loadError.value =
      error?.data?.error
        ?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to load faculty ranking analytics."
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>
