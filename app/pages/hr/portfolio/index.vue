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
            Human Resource Portal
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-3">
            <h1 class="text-3xl font-black tracking-tight sm:text-[34px]">
              Faculty Portfolios
            </h1>

            <span
              class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100 backdrop-blur-sm"
            >
              Portfolio Management
            </span>
          </div>

          <p class="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
            Review faculty and dean portfolio records, monitor portfolio entry
            counts, and open each personnel profile to manage ranking-related
            portfolio information.
          </p>
        </div>

        <div
          class="grid min-w-[280px] grid-cols-2 gap-2 rounded-[22px] border border-white/15 bg-white/10 p-3 backdrop-blur-md"
        >
          <div class="rounded-2xl bg-white/10 px-4 py-3">
            <p
              class="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-100"
            >
              Personnel
            </p>
            <p class="mt-1 text-xl font-black">
              {{ summary.total }}
            </p>
          </div>

          <div class="rounded-2xl bg-white/10 px-4 py-3">
            <p
              class="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-100"
            >
              Entries
            </p>
            <p class="mt-1 text-xl font-black">
              {{ summary.totalEntries }}
            </p>
          </div>
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
            Portfolio Overview
          </p>

          <h2 class="mt-1 text-lg font-black text-gray-900 dark:text-white">
            Personnel Portfolio Status
          </h2>
        </div>

        <p class="text-xs text-gray-500">
          Summary of faculty, dean, and portfolio entry records.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Total Personnel"
          :value="summary.total"
          icon="i-lucide-users"
          description="Faculty and deans"
          tone="info"
        />

        <StatCard
          label="Faculty"
          :value="summary.faculty"
          icon="i-lucide-presentation"
          description="Faculty records"
          tone="success"
        />

        <StatCard
          label="Deans"
          :value="summary.deans"
          icon="i-lucide-building-2"
          description="Dean records"
          tone="neutral"
        />

        <StatCard
          label="Portfolio Entries"
          :value="summary.totalEntries"
          icon="i-lucide-files"
          description="All recorded entries"
          tone="warning"
        />
      </div>
    </section>

    <!-- SEARCH AND FILTERS -->
    <section
      class="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="mb-5 flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
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
              Search and Filters
            </h2>

            <p class="mt-1 text-xs text-gray-500">
              Find personnel by name, employee number, role, or department.
            </p>
          </div>
        </div>

        <span
          v-if="hasActiveFilters"
          class="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
        >
          Filters Active
        </span>
      </div>

      <div
        class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"
      >
        <div class="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <UFormField label="Search">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Name, employee no., email..."
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

          <UFormField label="Department">
            <USelectMenu
              v-model="selectedDepartment"
              :items="departmentOptions"
              value-key="value"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton
            v-if="hasActiveFilters"
            color="neutral"
            variant="soft"
            icon="i-lucide-filter-x"
            @click="resetFilters"
          >
            Clear Filters
          </UButton>

          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-refresh-cw"
            :loading="loading"
            @click="loadTeachers"
          >
            Refresh
          </UButton>
        </div>
      </div>
    </section>

    <!-- LOADING -->
    <div v-if="loading" class="space-y-3">
      <USkeleton
        v-for="index in 6"
        :key="index"
        class="h-20 rounded-2xl"
      />
    </div>

    <!-- ERROR -->
    <section
      v-else-if="loadError"
      class="rounded-[24px] border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/20"
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
        Unable to load personnel records
      </h2>

      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {{ loadError }}
      </p>

      <UButton
        class="mt-5"
        icon="i-lucide-refresh-cw"
        @click="loadTeachers"
      >
        Try Again
      </UButton>
    </section>

    <!-- PERSONNEL TABLE -->
    <section
      v-else
      class="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex flex-col gap-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          >
            <UIcon
              name="i-lucide-folder-kanban"
              class="size-5"
            />
          </div>

          <div>
            <p
              class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
            >
              Portfolio Records
            </p>

            <h2 class="mt-1 text-base font-black text-gray-900 dark:text-white">
              Faculty and Dean Records
            </h2>

            <p class="mt-1 text-xs text-gray-500">
              Showing
              <span class="font-semibold text-gray-700 dark:text-gray-300">
                {{ paginationStart }}–{{ paginationEnd }}
              </span>
              of
              <span class="font-semibold text-gray-700 dark:text-gray-300">
                {{ filteredTeachers.length }}
              </span>
              filtered records.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500">
            Rows per page
          </span>

          <USelectMenu
            v-model="pageSize"
            :items="pageSizeOptions"
            value-key="value"
            class="w-24"
          />
        </div>
      </div>

      <!-- EMPTY -->
      <div
        v-if="!filteredTeachers.length"
        class="px-6 py-16 text-center"
      >
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-800"
        >
          <UIcon
            name="i-lucide-user-search"
            class="size-7"
          />
        </div>

        <h3 class="mt-4 font-bold text-gray-900 dark:text-white">
          No personnel records found
        </h3>

        <p class="mt-2 text-sm text-gray-500">
          Try changing your search or filters.
        </p>

        <UButton
          v-if="hasActiveFilters"
          class="mt-4"
          color="neutral"
          variant="soft"
          icon="i-lucide-filter-x"
          @click="resetFilters"
        >
          Clear Filters
        </UButton>
      </div>

      <template v-else>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1100px] text-sm">
            <thead
              class="border-b border-gray-200 bg-slate-100/80 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600 dark:border-gray-800 dark:bg-gray-950/70 dark:text-slate-400"
            >
              <tr>
                <th class="px-5 py-3.5 text-left">
                  Personnel
                </th>
                <th class="px-4 py-3.5 text-left">
                  Employee No.
                </th>
                <th class="px-4 py-3.5 text-left">
                  Role
                </th>
                <th class="px-4 py-3.5 text-left">
                  Department
                </th>
                <th class="px-4 py-3.5 text-center">
                  Portfolio Entries
                </th>
                <th class="px-5 py-3.5 text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody
              class="divide-y divide-gray-100 dark:divide-gray-800"
            >
              <tr
                v-for="teacher in paginatedTeachers"
                :key="teacher.documentId || teacher.id"
                class="transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-950/10"
              >
                <!-- PERSONNEL -->
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xs font-black text-blue-700 ring-1 ring-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:ring-blue-900"
                    >
                      {{ initials(getTeacherName(teacher)) }}
                    </div>

                    <div class="min-w-0">
                      <p
                        class="truncate font-bold text-gray-900 dark:text-white"
                      >
                        {{ getTeacherName(teacher) }}
                      </p>

                      <p
                        class="mt-1 truncate text-xs text-gray-500"
                      >
                        {{ teacher.user?.email || "No email address" }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- EMPLOYEE NUMBER -->
                <td class="px-4 py-4">
                  <span
                    class="font-medium text-gray-700 dark:text-gray-300"
                  >
                    {{
                      teacher.employee_no ||
                      teacher.user?.username ||
                      "N/A"
                    }}
                  </span>
                </td>

                <!-- ROLE -->
                <td class="px-4 py-4">
                  <UBadge
                    :color="
                      getTeacherRole(teacher) === 'Dean'
                        ? 'primary'
                        : 'neutral'
                    "
                    variant="subtle"
                  >
                    {{ getTeacherRole(teacher) }}
                  </UBadge>
                </td>

                <!-- DEPARTMENT -->
                <td class="px-4 py-4">
                  <span
                    class="font-medium text-gray-700 dark:text-gray-300"
                  >
                    {{ getTeacherDepartment(teacher) }}
                  </span>
                </td>

                <!-- ENTRY COUNT -->
                <td class="px-4 py-4 text-center">
                  <div class="inline-flex items-center gap-2">
                    <UBadge
                      color="info"
                      variant="subtle"
                    >
                      {{
                        teacher.portfolio_entries?.length ||
                        0
                      }}
                    </UBadge>

                    <span class="text-xs text-gray-400">
                      entr{{
                        Number(
                          teacher.portfolio_entries?.length ||
                            0,
                        ) === 1
                          ? "y"
                          : "ies"
                      }}
                    </span>
                  </div>
                </td>

                <!-- ACTION -->
                <td class="px-5 py-4 text-center">
                  <UButton
                    v-if="getTeacherDocumentId(teacher)"
                    size="sm"
                    color="primary"
                    variant="soft"
                    icon="i-lucide-folder-open"
                    :to="`/hr/portfolio/faculty/${getTeacherDocumentId(teacher)}`"
                  >
                    Manage Portfolio
                  </UButton>

                  <UBadge
                    v-else
                    color="error"
                    variant="subtle"
                  >
                    Missing ID
                  </UBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGINATION -->
        <div
          class="flex flex-col gap-3 border-t border-gray-200 bg-gray-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-950/30"
        >
          <p class="text-xs text-gray-500">
            Page
            <span class="font-semibold text-gray-700 dark:text-gray-300">
              {{ currentPage }}
            </span>
            of
            <span class="font-semibold text-gray-700 dark:text-gray-300">
              {{ totalPages }}
            </span>
            ·
            {{ filteredTeachers.length }} record{{
              filteredTeachers.length === 1 ? "" : "s"
            }}
          </p>

          <UPagination
            v-model:page="currentPage"
            :total="filteredTeachers.length"
            :items-per-page="pageSize"
            :sibling-count="1"
            show-edges
          />
        </div>
      </template>
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

// STATE
const loading = ref(false)
const loadError = ref("")
const teachers = ref<any[]>([])

const searchQuery = ref("")
const selectedRole = ref("all")
const selectedDepartment = ref("all")

// PAGINATION
const currentPage = ref(1)
const pageSize = ref(10)

const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]

// FILTER OPTIONS
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

// HELPERS
const getTeacherName = (teacher: any) =>
  teacher?.name ||
  teacher?.full_name ||
  teacher?.user?.username ||
  "Faculty Member"

const getTeacherRole = (teacher: any) =>
  teacher?.user?.role?.name ||
  teacher?.user?.role?.type ||
  teacher?.role ||
  "Faculty"

const getTeacherDepartment = (
  teacher: any,
) => {
  const department =
    teacher?.department?.name ??
    teacher?.department?.data?.name ??
    teacher?.department?.data?.attributes
      ?.name ??
    teacher?.department?.attributes?.name

  return (
    department ||
    "Not specified"
  )
}

const getTeacherDocumentId = (
  teacher: any,
) => {
  const value =
    teacher?.documentId ||
    teacher?.document_id ||
    ""

  const documentId =
    String(value).trim()

  return [
    "",
    "undefined",
    "null",
  ].includes(documentId)
    ? ""
    : documentId
}

const initials = (value: string) =>
  String(value || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part
        .charAt(0)
        .toUpperCase(),
    )
    .join("")

// COMPUTED
const departmentOptions = computed(() => {
  const departments = Array.from(
    new Set(
      teachers.value
        .map((teacher: any) =>
          getTeacherDepartment(
            teacher,
          ),
        )
        .filter(
          (department) =>
            department &&
            department !==
              "Not specified",
        ),
    ),
  ).sort()

  return [
    {
      label: "All Departments",
      value: "all",
    },
    ...departments.map(
      (department) => ({
        label: department,
        value: department,
      }),
    ),
  ]
})

const summary = computed(() => ({
  total: teachers.value.length,

  faculty: teachers.value.filter(
    (teacher: any) =>
      getTeacherRole(teacher) ===
      "Faculty",
  ).length,

  deans: teachers.value.filter(
    (teacher: any) =>
      getTeacherRole(teacher) ===
      "Dean",
  ).length,

  totalEntries:
    teachers.value.reduce(
      (
        sum: number,
        teacher: any,
      ) =>
        sum +
        Number(
          teacher
            ?.portfolio_entries
            ?.length || 0,
        ),
      0,
    ),
}))

const filteredTeachers = computed(() => {
  const keyword =
    searchQuery.value
      .trim()
      .toLowerCase()

  return teachers.value.filter(
    (teacher: any) => {
      const role =
        getTeacherRole(teacher)

      const department =
        getTeacherDepartment(
          teacher,
        )

      const searchable = [
        getTeacherName(teacher),
        teacher?.employee_no,
        teacher?.user?.username,
        teacher?.user?.email,
        role,
        department,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      const matchesSearch =
        !keyword ||
        searchable.includes(keyword)

      const matchesRole =
        selectedRole.value ===
          "all" ||
        role === selectedRole.value

      const matchesDepartment =
        selectedDepartment.value ===
          "all" ||
        department ===
          selectedDepartment.value

      return (
        matchesSearch &&
        matchesRole &&
        matchesDepartment
      )
    },
  )
})

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(
      filteredTeachers.value.length /
        pageSize.value,
    ),
  ),
)

const paginatedTeachers = computed(() => {
  const start =
    (currentPage.value - 1) *
    pageSize.value

  return filteredTeachers.value.slice(
    start,
    start + pageSize.value,
  )
})

const paginationStart = computed(() => {
  if (
    !filteredTeachers.value.length
  ) {
    return 0
  }

  return (
    (currentPage.value - 1) *
      pageSize.value +
    1
  )
})

const paginationEnd = computed(() =>
  Math.min(
    currentPage.value *
      pageSize.value,
    filteredTeachers.value.length,
  ),
)

const hasActiveFilters = computed(
  () =>
    Boolean(
      searchQuery.value.trim(),
    ) ||
    selectedRole.value !== "all" ||
    selectedDepartment.value !==
      "all",
)

// STAT CARD
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
    const toneClasses: Record<
      string,
      any
    > = {
      info: {
        icon:
          "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
        accent:
          "from-blue-500/15 via-blue-500/5 to-transparent",
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

      neutral: {
        icon:
          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        accent:
          "from-slate-500/10 via-slate-500/5 to-transparent",
      },
    }

    return () => {
      const tone =
        toneClasses[
          props.tone
        ] || toneClasses.info

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

// ACTIONS
const resetFilters = () => {
  searchQuery.value = ""
  selectedRole.value = "all"
  selectedDepartment.value = "all"
  currentPage.value = 1
}

const loadTeachers = async () => {
  loading.value = true
  loadError.value = ""

  try {
    const response: any =
      await $api("/teachers", {
        query: {
          "populate[department]":
            true,
          "populate[user][populate][role]":
            true,
          "populate[portfolio_entries]":
            true,
          "pagination[page]": 1,
          "pagination[pageSize]":
            1000,
        },
      })

    teachers.value = (
      response?.data || []
    ).filter((teacher: any) =>
      ["Faculty", "Dean"].includes(
        getTeacherRole(teacher),
      ),
    )

    if (
      currentPage.value >
      totalPages.value
    ) {
      currentPage.value =
        totalPages.value
    }
  } catch (error: any) {
    teachers.value = []

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to load faculty and dean records."
  } finally {
    loading.value = false
  }
}

// WATCHERS
watch(
  [
    searchQuery,
    selectedRole,
    selectedDepartment,
    pageSize,
  ],
  () => {
    currentPage.value = 1
  },
)

watch(
  totalPages,
  (pages) => {
    if (
      currentPage.value > pages
    ) {
      currentPage.value = pages
    }
  },
)

onMounted(loadTeachers)
</script>
