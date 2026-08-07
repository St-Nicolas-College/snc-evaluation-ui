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
            Human Resource Reports
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-3">
            <h1 class="text-3xl font-black tracking-tight sm:text-[34px]">
              Faculty Portfolio Report
            </h1>

            <span
              class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100 backdrop-blur-sm"
            >
              Consolidated Report
            </span>
          </div>

          <p class="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
            Review faculty and dean portfolio records, portfolio-point
            contributions, current and inactive entries, and personnel-level
            portfolio totals.
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
              {{ summary.totalPersonnel }}
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
            Current Report Summary
          </h2>
        </div>

        <p class="text-xs text-gray-500">
          Summary values reflect the currently filtered personnel records.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Personnel"
          :value="summary.totalPersonnel"
          icon="i-lucide-users"
          description="Faculty and deans"
          tone="info"
        />

        <StatCard
          label="Portfolio Entries"
          :value="summary.totalEntries"
          icon="i-lucide-files"
          description="Filtered official entries"
          tone="primary"
        />

        <StatCard
          label="Current Entries"
          :value="summary.currentEntries"
          icon="i-lucide-circle-check-big"
          description="Active portfolio records"
          tone="success"
        />

        <StatCard
          label="Total Points"
          :value="summary.totalPoints"
          icon="i-lucide-chart-no-axes-column-increasing"
          description="Filtered portfolio points"
          tone="warning"
        />
      </div>
    </section>

    <!-- FILTERS -->
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
            <UIcon name="i-lucide-sliders-horizontal" class="size-5" />
          </div>

          <div>
            <h2 class="font-bold text-gray-900 dark:text-white">
              Report Filters
            </h2>

            <p class="mt-1 text-xs text-gray-500">
              Filter portfolio records by personnel, department, role, entry type,
              status, and evaluation period.
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

      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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

        <UFormField label="Entry Type">
          <USelectMenu
            v-model="selectedEntryType"
            :items="entryTypeOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Record Status">
          <USelectMenu
            v-model="selectedStatus"
            :items="statusOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>

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
      </div>

      <div
        class="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search name, employee no., department..."
          class="w-full max-w-xl"
        />

        <div class="flex flex-wrap gap-2">
          <UButton
            v-if="hasActiveFilters"
            color="neutral"
            variant="soft"
            icon="i-lucide-filter-x"
            @click="clearFilters"
          >
            Clear Filters
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
    </section>

    <!-- EXPORT ACTIONS -->
    <section
      class="flex flex-col gap-3 rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900"
    >
      <div>
        <p class="font-bold text-gray-900 dark:text-white">
          Report Export
        </p>

        <p class="mt-1 text-xs text-gray-500">
          Preview, download, or export the currently filtered portfolio report.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-file-search"
          :loading="pdfLoading && pdfAction === 'preview'"
          :disabled="!filteredPersonnel.length || pdfLoading"
          @click="previewPdf"
        >
          Preview PDF
        </UButton>

        <UButton
          color="primary"
          variant="soft"
          icon="i-lucide-download"
          :loading="pdfLoading && pdfAction === 'download'"
          :disabled="!filteredPersonnel.length || pdfLoading"
          @click="downloadPdf"
        >
          Download PDF
        </UButton>

        <UButton
          color="success"
          variant="soft"
          icon="i-lucide-file-spreadsheet"
          :loading="excelLoading"
          :disabled="!filteredPersonnel.length || excelLoading"
          @click="exportExcel"
        >
          Export Excel
        </UButton>
      </div>
    </section>

    <!-- LOADING -->
    <div v-if="loading" class="space-y-3">
      <USkeleton
        v-for="index in 6"
        :key="index"
        class="h-24 rounded-2xl"
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
        <UIcon name="i-lucide-triangle-alert" class="size-7" />
      </div>

      <h2 class="mt-4 font-bold text-gray-900 dark:text-white">
        Unable to load portfolio report
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

    <!-- TABLE -->
    <section
      v-else
      class="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex flex-col gap-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          >
            <UIcon name="i-lucide-folder-kanban" class="size-5" />
          </div>

          <div>
            <p
              class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
            >
              Consolidated Portfolio Report
            </p>

            <h2 class="mt-1 text-base font-black text-gray-900 dark:text-white">
              Faculty and Dean Portfolio Summary
            </h2>

            <p class="mt-1 text-xs text-gray-500">
              Showing
              <span class="font-semibold text-gray-700 dark:text-gray-300">
                {{ paginationStart }}–{{ paginationEnd }}
              </span>
              of
              <span class="font-semibold text-gray-700 dark:text-gray-300">
                {{ filteredPersonnel.length }}
              </span>
              filtered personnel records.
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

      <div
        v-if="!filteredPersonnel.length"
        class="px-6 py-16 text-center"
      >
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-800"
        >
          <UIcon name="i-lucide-folder-search" class="size-7" />
        </div>

        <h3 class="mt-4 font-bold text-gray-900 dark:text-white">
          No portfolio records found
        </h3>

        <p class="mt-2 text-sm text-gray-500">
          Try changing your report filters.
        </p>
      </div>

      <template v-else>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1350px] text-sm">
            <thead
              class="border-b border-gray-200 bg-slate-100/80 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600 dark:border-gray-800 dark:bg-gray-950/70 dark:text-slate-400"
            >
              <tr>
                <th class="px-5 py-3.5 text-left">
                  Personnel
                </th>

                <th class="px-4 py-3.5 text-left">
                  Department
                </th>

                <th class="px-4 py-3.5 text-center">
                  Entries
                </th>

                <th class="px-4 py-3.5 text-center">
                  Current
                </th>

                <th class="px-4 py-3.5 text-center">
                  Educational<br />
                  Qualification
                </th>

                <th class="px-4 py-3.5 text-center">
                  Loyalty
                </th>

                <th class="px-4 py-3.5 text-center">
                  Evaluation
                </th>

                <th class="px-4 py-3.5 text-center">
                  CSR
                </th>

                <th class="px-4 py-3.5 text-center">
                  Total<br />
                  Points
                </th>

                <th class="px-4 py-3.5 text-left">
                  Latest Entry
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
                v-for="row in paginatedPersonnel"
                :key="row.teacher.documentId || row.teacher.id"
                class="transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-950/10"
              >
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                    >
                      {{ initials(teacherName(row.teacher)) }}
                    </div>

                    <div class="min-w-0">
                      <p
                        class="truncate font-bold text-gray-900 dark:text-white"
                      >
                        {{ teacherName(row.teacher) }}
                      </p>

                      <p class="mt-1 truncate text-xs text-gray-500">
                        {{
                          row.teacher.employee_no ||
                          row.teacher.user?.username ||
                          "N/A"
                        }}
                        <span class="mx-1">•</span>
                        {{ teacherRole(row.teacher) }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-4">
                  {{ teacherDepartment(row.teacher) }}
                </td>

                <td class="px-4 py-4 text-center">
                  <UBadge color="info" variant="subtle">
                    {{ row.entryCount }}
                  </UBadge>
                </td>

                <td class="px-4 py-4 text-center">
                  <UBadge color="success" variant="subtle">
                    {{ row.currentCount }}
                  </UBadge>
                </td>

                <td class="px-4 py-4 text-center">
                  {{ formatPoints(row.educationalQualification) }}
                </td>

                <td class="px-4 py-4 text-center">
                  {{ formatPoints(row.loyalty) }}
                </td>

                <td class="px-4 py-4 text-center">
                  {{ formatPoints(row.evaluation) }}
                </td>

                <td class="px-4 py-4 text-center">
                  {{ formatPoints(row.csr) }}
                </td>

                <td class="px-4 py-4 text-center">
                  <UBadge color="primary" variant="subtle">
                    {{ formatPoints(row.totalPoints) }}
                  </UBadge>
                </td>

                <td class="px-4 py-4">
                  <p class="font-medium text-gray-800 dark:text-gray-200">
                    {{ row.latestEntry?.title || "No entries" }}
                  </p>

                  <p class="mt-1 text-xs text-gray-500">
                    {{
                      row.latestEntry
                        ? formatDate(
                            row.latestEntry.date_earned ||
                              row.latestEntry.createdAt,
                          )
                        : "N/A"
                    }}
                  </p>
                </td>

                <td class="px-5 py-4 text-center">
                  <UButton
                    v-if="row.teacher.documentId"
                    size="xs"
                    color="neutral"
                    variant="soft"
                    icon="i-lucide-folder-open"
                    :to="`/hr/portfolio/faculty/${row.teacher.documentId}`"
                  >
                    View Portfolio
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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
            {{ filteredPersonnel.length }} personnel record{{
              filteredPersonnel.length === 1 ? "" : "s"
            }}
          </p>

          <UPagination
            v-model:page="currentPage"
            :total="filteredPersonnel.length"
            :items-per-page="pageSize"
            :sibling-count="1"
            show-edges
          />
        </div>
      </template>
    </section>

    <!-- PDF PREVIEW -->
    <UModal
      v-model:open="pdfPreviewOpen"
      id="hr-portfolio-report-pdf-preview"
      :ui="{ content: 'max-w-7xl' }"
    >
      <template #content>
        <div
          class="flex h-[90vh] flex-col overflow-hidden bg-white dark:bg-gray-950"
        >
          <div
            class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800"
          >
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                {{ pdfFileName }}
              </h3>

              <p class="mt-0.5 text-xs text-gray-500">
                Consolidated Faculty Portfolio Report
              </p>
            </div>

            <div class="flex items-center gap-2">
              <UButton
                icon="i-lucide-download"
                :disabled="!pdfBlob"
                @click="downloadExistingPdf"
              >
                Download PDF
              </UButton>

              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                square
                @click="closePdfPreview"
              />
            </div>
          </div>

          <div class="min-h-0 flex-1 bg-gray-100 p-3 dark:bg-gray-900">
            <iframe
              v-if="pdfPreviewUrl"
              :src="pdfPreviewUrl"
              title="Faculty Portfolio Report PDF Preview"
              class="h-full w-full rounded-xl border border-gray-300 bg-white dark:border-gray-700"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

definePageMeta({
  middleware: ["auth", "role"],
  role: ["HR", "Admin"],
})

const { $api } = useNuxtApp()
const toast = useToast()

// STATE
const loading = ref(false)
const loadError = ref("")

const teachers = ref<any[]>([])
const entries = ref<any[]>([])

const searchQuery = ref("")
const selectedDepartment = ref("all")
const selectedRole = ref("all")
const selectedEntryType = ref("all")
const selectedStatus = ref("all")
const selectedSchoolYear = ref("all")
const selectedSemester = ref("all")

// PAGINATION
const currentPage = ref(1)
const pageSize = ref(10)

const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]

// EXPORT STATE
const pdfLoading = ref(false)
const pdfAction = ref<"" | "preview" | "download">("")
const pdfPreviewOpen = ref(false)
const pdfPreviewUrl = ref("")
const pdfBlob = ref<Blob | null>(null)
const excelLoading = ref(false)

// HELPERS
const teacherName = (teacher: any) =>
  teacher?.name ||
  teacher?.full_name ||
  teacher?.user?.username ||
  "Faculty Member"

const teacherRole = (teacher: any) =>
  teacher?.user?.role?.name ||
  teacher?.user?.role?.type ||
  teacher?.role ||
  "Faculty"

const teacherDepartment = (teacher: any) => {
  const department =
    teacher?.department?.name ??
    teacher?.department?.data?.name ??
    teacher?.department?.data?.attributes?.name ??
    teacher?.department?.attributes?.name

  return department || "Not specified"
}

const initials = (value: string) =>
  String(value || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

const formatPoints = (value: unknown) => {
  const parsed = Number(value ?? 0)

  if (!Number.isFinite(parsed)) {
    return "0"
  }

  return Number.isInteger(parsed)
    ? String(parsed)
    : parsed.toFixed(2).replace(/\.?0+$/, "")
}

const formatDate = (value: any) => {
  if (!value) {
    return "N/A"
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
}

const formatEntryType = (value: string) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())

// OPTIONS
const departmentOptions = computed(() => {
  const values = Array.from(
    new Set(
      teachers.value
        .map((teacher: any) => teacherDepartment(teacher))
        .filter(
          (value) =>
            value &&
            value !== "Not specified",
        ),
    ),
  ).sort()

  return [
    {
      label: "All Departments",
      value: "all",
    },
    ...values.map((value) => ({
      label: value,
      value,
    })),
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

const entryTypeOptions = [
  {
    label: "All Entry Types",
    value: "all",
  },
  {
    label: "Educational Qualifications",
    value: "educational_qualifications",
  },
  {
    label: "Eligibility",
    value: "eligibility",
  },
  {
    label: "Training and Seminars",
    value: "training_seminars",
  },
  {
    label: "Research",
    value: "research",
  },
  {
    label: "Awards and Recognition",
    value: "awards_recognition",
  },
  {
    label: "Professional Experience",
    value: "professional_experience",
  },
  {
    label: "Loyalty",
    value: "loyalty",
  },
  {
    label: "Evaluation",
    value: "evaluation",
  },
  {
    label: "Corporate Social Responsibility",
    value: "corporate_social_responsibility",
  },
]

const statusOptions = [
  {
    label: "All Records",
    value: "all",
  },
  {
    label: "Current Only",
    value: "current",
  },
  {
    label: "Inactive Only",
    value: "inactive",
  },
]

const schoolYearOptions = computed(() => {
  const values = Array.from(
    new Set(
      entries.value
        .map((entry: any) => entry.school_year)
        .filter(Boolean),
    ),
  ).sort().reverse()

  return [
    {
      label: "All School Years",
      value: "all",
    },
    ...values.map((value) => ({
      label: value,
      value,
    })),
  ]
})

const semesterOptions = computed(() => {
  const preferredOrder = [
    "1st Semester",
    "2nd Semester",
    "Summer",
    "Annual",
  ]

  const values = Array.from(
    new Set(
      entries.value
        .map((entry: any) => entry.semester)
        .filter(Boolean),
    ),
  ).sort(
    (a: any, b: any) =>
      preferredOrder.indexOf(a) -
      preferredOrder.indexOf(b),
  )

  return [
    {
      label: "All Semesters",
      value: "all",
    },
    ...values.map((value) => ({
      label: value,
      value,
    })),
  ]
})

// ENTRY FILTERING
const filteredEntries = computed(() => {
  return entries.value.filter(
    (entry: any) => {
      const matchesType =
        selectedEntryType.value === "all" ||
        entry.entry_type === selectedEntryType.value

      const matchesStatus =
        selectedStatus.value === "all" ||
        (
          selectedStatus.value === "current" &&
          entry.is_current !== false
        ) ||
        (
          selectedStatus.value === "inactive" &&
          entry.is_current === false
        )

      const matchesSchoolYear =
        selectedSchoolYear.value === "all" ||
        entry.school_year === selectedSchoolYear.value

      const matchesSemester =
        selectedSemester.value === "all" ||
        entry.semester === selectedSemester.value

      return (
        matchesType &&
        matchesStatus &&
        matchesSchoolYear &&
        matchesSemester
      )
    },
  )
})

// PERSONNEL AGGREGATION
const personnelRows = computed(() => {
  return teachers.value.map((teacher: any) => {
    const teacherEntries =
      filteredEntries.value.filter(
        (entry: any) =>
          entry?.teacher?.documentId === teacher.documentId ||
          entry?.teacher?.id === teacher.id,
      )

    const totalByTypes = (types: string[]) =>
      teacherEntries
        .filter((entry: any) =>
          types.includes(entry.entry_type),
        )
        .reduce(
          (sum: number, entry: any) =>
            sum + Number(entry.points || 0),
          0,
        )

    const educationalQualification = totalByTypes([
      "educational_qualifications",
      "eligibility",
      "training_seminars",
      "research",
      "awards_recognition",
      "professional_experience",
    ])

    const loyalty = totalByTypes([
      "loyalty",
    ])

    const evaluation = totalByTypes([
      "evaluation",
    ])

    const csr = totalByTypes([
      "corporate_social_responsibility",
    ])

    const sortedEntries = [...teacherEntries].sort(
      (a: any, b: any) => {
        const aDate = new Date(
          a.date_earned ||
            a.createdAt ||
            0,
        ).getTime()

        const bDate = new Date(
          b.date_earned ||
            b.createdAt ||
            0,
        ).getTime()

        return bDate - aDate
      },
    )

    return {
      teacher,

      entries:
        teacherEntries,

      entryCount:
        teacherEntries.length,

      currentCount:
        teacherEntries.filter(
          (entry: any) =>
            entry.is_current !== false,
        ).length,

      educationalQualification,

      loyalty,

      evaluation,

      csr,

      totalPoints:
        educationalQualification +
        loyalty +
        evaluation +
        csr,

      latestEntry:
        sortedEntries[0] || null,
    }
  })
})

const filteredPersonnel = computed(() => {
  const query =
    searchQuery.value
      .trim()
      .toLowerCase()

  return personnelRows.value.filter(
    (row: any) => {
      const role =
        teacherRole(row.teacher)

      const department =
        teacherDepartment(
          row.teacher,
        )

      const searchable = [
        teacherName(row.teacher),
        row.teacher.employee_no,
        row.teacher.user?.username,
        row.teacher.user?.email,
        role,
        department,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      const matchesSearch =
        !query ||
        searchable.includes(query)

      const matchesRole =
        selectedRole.value === "all" ||
        role === selectedRole.value

      const matchesDepartment =
        selectedDepartment.value === "all" ||
        department === selectedDepartment.value

      // When entry-specific filters are active, hide personnel with no matching entries.
      const entrySpecificFilterActive =
        selectedEntryType.value !== "all" ||
        selectedStatus.value !== "all" ||
        selectedSchoolYear.value !== "all" ||
        selectedSemester.value !== "all"

      const hasMatchingEntries =
        !entrySpecificFilterActive ||
        row.entryCount > 0

      return (
        matchesSearch &&
        matchesRole &&
        matchesDepartment &&
        hasMatchingEntries
      )
    },
  )
})

// SUMMARY
const summary = computed(() => ({
  totalPersonnel:
    filteredPersonnel.value.length,

  totalEntries:
    filteredPersonnel.value.reduce(
      (sum: number, row: any) =>
        sum + row.entryCount,
      0,
    ),

  currentEntries:
    filteredPersonnel.value.reduce(
      (sum: number, row: any) =>
        sum + row.currentCount,
      0,
    ),

  totalPoints:
    formatPoints(
      filteredPersonnel.value.reduce(
        (sum: number, row: any) =>
          sum + row.totalPoints,
        0,
      ),
    ),
}))

// PAGINATION
const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(
      filteredPersonnel.value.length /
        pageSize.value,
    ),
  ),
)

const paginatedPersonnel = computed(() => {
  const start =
    (currentPage.value - 1) *
    pageSize.value

  return filteredPersonnel.value.slice(
    start,
    start + pageSize.value,
  )
})

const paginationStart = computed(() => {
  if (!filteredPersonnel.value.length) {
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
    filteredPersonnel.value.length,
  ),
)

const hasActiveFilters = computed(
  () =>
    Boolean(searchQuery.value.trim()) ||
    selectedDepartment.value !== "all" ||
    selectedRole.value !== "all" ||
    selectedEntryType.value !== "all" ||
    selectedStatus.value !== "all" ||
    selectedSchoolYear.value !== "all" ||
    selectedSemester.value !== "all",
)

// LOCAL CARD
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

// FILTER ACTION
const clearFilters = () => {
  searchQuery.value = ""
  selectedDepartment.value = "all"
  selectedRole.value = "all"
  selectedEntryType.value = "all"
  selectedStatus.value = "all"
  selectedSchoolYear.value = "all"
  selectedSemester.value = "all"
  currentPage.value = 1
}

// FILE NAMES
const exportBaseName = computed(() => {
  const department =
    selectedDepartment.value === "all"
      ? "All-Departments"
      : selectedDepartment.value
          .replace(
            /[^a-zA-Z0-9]+/g,
            "-",
          )
          .replace(/^[-]+|[-]+$/g, "")

  return `Faculty-Portfolio-Report-${department}`
})

const pdfFileName = computed(
  () =>
    `${exportBaseName.value}.pdf`,
)

// PDF
const createPdfBlob = async () => {
  if (!import.meta.client) {
    throw new Error(
      "PDF generation is only available in the browser.",
    )
  }

  if (!filteredPersonnel.value.length) {
    throw new Error(
      "There are no portfolio records to include in the report.",
    )
  }

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  })

  const pageWidth =
    doc.internal.pageSize.getWidth()

  const pageHeight =
    doc.internal.pageSize.getHeight()

  const margin = 10

  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)

  doc.text(
    "ST. NICOLAS COLLEGE OF BUSINESS AND TECHNOLOGY",
    pageWidth / 2,
    12,
    {
      align: "center",
    },
  )

  doc.setFontSize(11)

  doc.text(
    "FACULTY PORTFOLIO REPORT",
    pageWidth / 2,
    18,
    {
      align: "center",
    },
  )

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)

  const filters = [
    `Department: ${
      selectedDepartment.value === "all"
        ? "All"
        : selectedDepartment.value
    }`,
    `Role: ${
      selectedRole.value === "all"
        ? "All"
        : selectedRole.value
    }`,
    `Entry Type: ${
      selectedEntryType.value === "all"
        ? "All"
        : formatEntryType(selectedEntryType.value)
    }`,
  ].join("   |   ")

  doc.text(
    filters,
    pageWidth / 2,
    24,
    {
      align: "center",
    },
  )

  autoTable(doc, {
    startY: 30,

    head: [
      [
        "Personnel",
        "Department",
        "Entries",
        "Current",
        "Educational Qualification",
        "Loyalty",
        "Evaluation",
        "CSR",
        "Total Points",
        "Latest Entry",
      ],
    ],

    body:
      filteredPersonnel.value.map(
        (row: any) => [
          teacherName(row.teacher),
          teacherDepartment(row.teacher),
          row.entryCount,
          row.currentCount,
          formatPoints(
            row.educationalQualification,
          ),
          formatPoints(row.loyalty),
          formatPoints(row.evaluation),
          formatPoints(row.csr),
          formatPoints(row.totalPoints),
          row.latestEntry?.title || "No entries",
        ],
      ),

    margin: {
      left: margin,
      right: margin,
      bottom: 14,
    },

    theme: "grid",

    styles: {
      font: "helvetica",
      fontSize: 7,
      cellPadding: 1.8,
      valign: "middle",
      overflow: "linebreak",
      lineWidth: 0.15,
      lineColor: [156, 163, 175],
      textColor: [17, 24, 39],
    },

    headStyles: {
      fontStyle: "bold",
      fillColor: [241, 245, 249],
      textColor: [17, 24, 39],
      halign: "center",
    },

    columnStyles: {
      0: {
        cellWidth: 38,
      },
      1: {
        cellWidth: 39,
      },
      2: {
        cellWidth: 14,
        halign: "center",
      },
      3: {
        cellWidth: 14,
        halign: "center",
      },
      4: {
        cellWidth: 27,
        halign: "center",
      },
      5: {
        cellWidth: 16,
        halign: "center",
      },
      6: {
        cellWidth: 18,
        halign: "center",
      },
      7: {
        cellWidth: 14,
        halign: "center",
      },
      8: {
        cellWidth: 18,
        halign: "center",
      },
      9: {
        cellWidth: 46,
      },
    },

    didDrawPage: () => {
      const pageNumber =
        doc.getCurrentPageInfo()
          .pageNumber

      doc.setFont(
        "helvetica",
        "normal",
      )

      doc.setFontSize(7)

      doc.text(
        `Generated ${new Date().toLocaleDateString("en-PH")} · Confidential`,
        margin,
        pageHeight - 6,
      )

      doc.text(
        `Page ${pageNumber}`,
        pageWidth - margin,
        pageHeight - 6,
        {
          align: "right",
        },
      )
    },
  })

  return doc.output("blob")
}

const revokePdfUrl = () => {
  if (
    pdfPreviewUrl.value &&
    import.meta.client
  ) {
    URL.revokeObjectURL(
      pdfPreviewUrl.value,
    )
  }

  pdfPreviewUrl.value = ""
  pdfBlob.value = null
}

const triggerPdfDownload = (
  blob: Blob,
) => {
  const url =
    URL.createObjectURL(blob)

  const link =
    document.createElement("a")

  link.href = url
  link.download =
    pdfFileName.value

  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(
    () => URL.revokeObjectURL(url),
    500,
  )
}

const previewPdf = async () => {
  if (pdfLoading.value) {
    return
  }

  pdfLoading.value = true
  pdfAction.value = "preview"

  revokePdfUrl()

  try {
    const blob =
      await createPdfBlob()

    pdfBlob.value = blob

    pdfPreviewUrl.value =
      URL.createObjectURL(blob)

    pdfPreviewOpen.value =
      true
  } catch (error: any) {
    toast.add({
      title:
        "Unable to preview PDF",
      description:
        error?.message ||
        "The portfolio report could not be generated.",
      color: "error",
    })
  } finally {
    pdfLoading.value = false
    pdfAction.value = ""
  }
}

const downloadPdf = async () => {
  if (pdfLoading.value) {
    return
  }

  pdfLoading.value = true
  pdfAction.value = "download"

  try {
    const blob =
      await createPdfBlob()

    triggerPdfDownload(blob)
  } catch (error: any) {
    toast.add({
      title:
        "Unable to download PDF",
      description:
        error?.message ||
        "The portfolio report could not be generated.",
      color: "error",
    })
  } finally {
    pdfLoading.value = false
    pdfAction.value = ""
  }
}

const downloadExistingPdf = () => {
  if (!pdfBlob.value) {
    return
  }

  triggerPdfDownload(
    pdfBlob.value,
  )
}

const closePdfPreview = () => {
  pdfPreviewOpen.value = false
  revokePdfUrl()
}

// EXCEL
const exportExcel = async () => {
  if (!import.meta.client) {
    return
  }

  if (!filteredPersonnel.value.length) {
    return
  }

  excelLoading.value = true

  try {
    const XLSX =
      await import(
        "xlsx-js-style"
      )

    const headers = [
      "Personnel",
      "Employee No.",
      "Role",
      "Department",
      "Portfolio Entries",
      "Current Entries",
      "Educational Qualification",
      "Loyalty",
      "Evaluation",
      "Corporate Social Responsibility",
      "Total Portfolio Points",
      "Latest Entry",
      "Latest Entry Date",
    ]

    const dataRows =
      filteredPersonnel.value.map(
        (row: any) => [
          teacherName(row.teacher),

          row.teacher.employee_no ||
            row.teacher.user?.username ||
            "",

          teacherRole(row.teacher),

          teacherDepartment(row.teacher),

          row.entryCount,

          row.currentCount,

          Number(
            row.educationalQualification ||
              0,
          ),

          Number(
            row.loyalty || 0,
          ),

          Number(
            row.evaluation || 0,
          ),

          Number(
            row.csr || 0,
          ),

          Number(
            row.totalPoints || 0,
          ),

          row.latestEntry?.title ||
            "",

          row.latestEntry
            ? formatDate(
                row.latestEntry.date_earned ||
                  row.latestEntry.createdAt,
              )
            : "",
        ],
      )

    const reportData = [
      [
        "ST. NICOLAS COLLEGE OF BUSINESS AND TECHNOLOGY",
        ...Array(12).fill(""),
      ],
      [
        "FACULTY PORTFOLIO REPORT",
        ...Array(12).fill(""),
      ],
      [
        `Department: ${
          selectedDepartment.value === "all"
            ? "All Departments"
            : selectedDepartment.value
        } | Role: ${
          selectedRole.value === "all"
            ? "All Roles"
            : selectedRole.value
        }`,
        ...Array(12).fill(""),
      ],
      [
        `Entry Type: ${
          selectedEntryType.value === "all"
            ? "All Entry Types"
            : formatEntryType(selectedEntryType.value)
        } | Status: ${
          selectedStatus.value === "all"
            ? "All Records"
            : selectedStatus.value === "current"
              ? "Current Only"
              : "Inactive Only"
        }`,
        ...Array(12).fill(""),
      ],
      Array(13).fill(""),
      headers,
      ...dataRows,
    ]

    const worksheet =
      XLSX.utils.aoa_to_sheet(
        reportData,
      )

    worksheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 12 },
      },
      {
        s: { r: 1, c: 0 },
        e: { r: 1, c: 12 },
      },
      {
        s: { r: 2, c: 0 },
        e: { r: 2, c: 12 },
      },
      {
        s: { r: 3, c: 0 },
        e: { r: 3, c: 12 },
      },
    ]

    worksheet["!cols"] = [
      { wch: 28 },
      { wch: 16 },
      { wch: 12 },
      { wch: 34 },
      { wch: 16 },
      { wch: 15 },
      { wch: 24 },
      { wch: 12 },
      { wch: 12 },
      { wch: 31 },
      { wch: 22 },
      { wch: 34 },
      { wch: 18 },
    ]

    worksheet["!rows"] = [
      { hpt: 26 },
      { hpt: 22 },
      { hpt: 18 },
      { hpt: 18 },
      { hpt: 8 },
      { hpt: 32 },
    ]

    worksheet["!autofilter"] = {
      ref: `A6:M${
        dataRows.length + 6
      }`,
    }

    const darkBlue = "0F172A"
    const blue = "1D4ED8"
    const lightBlue = "EFF6FF"
    const lightGray = "F8FAFC"
    const borderColor = "CBD5E1"
    const white = "FFFFFF"

    worksheet["A1"].s = {
      font: {
        name: "Arial",
        sz: 16,
        bold: true,
        color: {
          rgb: white,
        },
      },
      fill: {
        fgColor: {
          rgb: darkBlue,
        },
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    }

    worksheet["A2"].s = {
      font: {
        name: "Arial",
        sz: 13,
        bold: true,
        color: {
          rgb: white,
        },
      },
      fill: {
        fgColor: {
          rgb: blue,
        },
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    }

    for (
      const address of [
        "A3",
        "A4",
      ]
    ) {
      worksheet[address].s = {
        font: {
          name: "Arial",
          sz: 9,
          color: {
            rgb: "334155",
          },
        },
        fill: {
          fgColor: {
            rgb: lightBlue,
          },
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      }
    }

    for (
      let column = 0;
      column < headers.length;
      column += 1
    ) {
      const address =
        XLSX.utils.encode_cell({
          r: 5,
          c: column,
        })

      worksheet[address].s = {
        font: {
          name: "Arial",
          sz: 9,
          bold: true,
          color: {
            rgb: white,
          },
        },
        fill: {
          fgColor: {
            rgb: blue,
          },
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: true,
        },
        border: {
          top: {
            style: "thin",
            color: {
              rgb: borderColor,
            },
          },
          bottom: {
            style: "thin",
            color: {
              rgb: borderColor,
            },
          },
          left: {
            style: "thin",
            color: {
              rgb: borderColor,
            },
          },
          right: {
            style: "thin",
            color: {
              rgb: borderColor,
            },
          },
        },
      }
    }

    for (
      let rowIndex = 0;
      rowIndex < dataRows.length;
      rowIndex += 1
    ) {
      const sheetRow =
        rowIndex + 6

      const alternate =
        rowIndex % 2 === 1

      for (
        let column = 0;
        column < headers.length;
        column += 1
      ) {
        const address =
          XLSX.utils.encode_cell({
            r: sheetRow,
            c: column,
          })

        const cell =
          worksheet[address]

        if (!cell) {
          continue
        }

        cell.s = {
          font: {
            name: "Arial",
            sz: 9,
            color: {
              rgb: "1E293B",
            },
          },

          fill: {
            fgColor: {
              rgb: alternate
                ? lightGray
                : white,
            },
          },

          alignment: {
            vertical: "center",
            horizontal:
              [
                4,
                5,
                6,
                7,
                8,
                9,
                10,
              ].includes(column)
                ? "center"
                : "left",
            wrapText: true,
          },

          border: {
            top: {
              style: "thin",
              color: {
                rgb: borderColor,
              },
            },
            bottom: {
              style: "thin",
              color: {
                rgb: borderColor,
              },
            },
            left: {
              style: "thin",
              color: {
                rgb: borderColor,
              },
            },
            right: {
              style: "thin",
              color: {
                rgb: borderColor,
              },
            },
          },
        }

        if (
          [
            6,
            7,
            8,
            9,
            10,
          ].includes(column) &&
          typeof cell.v === "number"
        ) {
          cell.z = "0.00"
        }
      }
    }

    const summarySheet =
      XLSX.utils.aoa_to_sheet([
        [
          "FACULTY PORTFOLIO REPORT SUMMARY",
          "",
        ],
        [
          "Generated",
          new Date().toLocaleString(
            "en-PH",
          ),
        ],
        [
          "Department",
          selectedDepartment.value === "all"
            ? "All Departments"
            : selectedDepartment.value,
        ],
        [
          "Role",
          selectedRole.value === "all"
            ? "All Roles"
            : selectedRole.value,
        ],
        [
          "Entry Type",
          selectedEntryType.value === "all"
            ? "All Entry Types"
            : formatEntryType(selectedEntryType.value),
        ],
        [
          "Total Personnel",
          summary.value.totalPersonnel,
        ],
        [
          "Portfolio Entries",
          summary.value.totalEntries,
        ],
        [
          "Current Entries",
          summary.value.currentEntries,
        ],
        [
          "Total Points",
          Number(summary.value.totalPoints || 0),
        ],
      ])

    summarySheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 1 },
      },
    ]

    summarySheet["!cols"] = [
      { wch: 24 },
      { wch: 38 },
    ]

    summarySheet["A1"].s = {
      font: {
        name: "Arial",
        sz: 14,
        bold: true,
        color: {
          rgb: white,
        },
      },
      fill: {
        fgColor: {
          rgb: darkBlue,
        },
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    }

    const workbook =
      XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      summarySheet,
      "Summary",
    )

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Portfolio Report",
    )

    XLSX.writeFile(
      workbook,
      `${exportBaseName.value}.xlsx`,
      {
        compression: true,
      },
    )

    toast.add({
      title:
        "Excel exported",
      description:
        "The faculty portfolio report was exported successfully.",
      color: "success",
      icon:
        "i-lucide-file-spreadsheet",
    })
  } catch (error: any) {
    console.error(
      "Portfolio Excel export error:",
      error,
    )

    toast.add({
      title:
        "Unable to export Excel",
      description:
        error?.message ||
        "The Excel report could not be generated.",
      color: "error",
    })
  } finally {
    excelLoading.value = false
  }
}

// DATA LOADING
const loadData = async () => {
  loading.value = true
  loadError.value = ""

  try {
    const [
      teacherResponse,
      entryResponse,
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
          "/portfolio-entries",
          {
            query: {
              "populate[teacher][populate][department]":
                true,
              "populate[teacher][populate][user][populate][role]":
                true,
              "sort[0]":
                "date_earned:desc",
              "sort[1]":
                "createdAt:desc",
              "pagination[page]":
                1,
              "pagination[pageSize]":
                1000,
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

    entries.value =
      entryResponse?.data ||
      []
  } catch (error: any) {
    console.error(
      "Portfolio report loading error:",
      error,
    )

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to load faculty portfolio report records."
  } finally {
    loading.value = false
  }
}

// WATCHERS
watch(
  [
    searchQuery,
    selectedDepartment,
    selectedRole,
    selectedEntryType,
    selectedStatus,
    selectedSchoolYear,
    selectedSemester,
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
      currentPage.value >
      pages
    ) {
      currentPage.value =
        pages
    }
  },
)

onMounted(loadData)

onBeforeUnmount(() => {
  revokePdfUrl()
})
</script>
