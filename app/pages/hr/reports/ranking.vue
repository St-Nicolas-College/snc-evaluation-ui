<template>
  <div class="space-y-6 pb-10">
    <section class="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-800 px-6 py-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] sm:px-8">
      <div class="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-cyan-300/10 blur-3xl" />
      <div class="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">Human Resource Reports</p>
          <div class="mt-3 flex flex-wrap items-center gap-3">
            <h1 class="text-3xl font-black tracking-tight sm:text-[34px]">Faculty Ranking Report</h1>
            <span class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100 backdrop-blur-sm">Consolidated Report</span>
          </div>
          <p class="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
            Review and export faculty and dean ranking results by academic period, department, personnel role, and assigned rank.
          </p>
        </div>
        <div v-if="activeScheme" class="min-w-[250px] rounded-[22px] border border-white/15 bg-white/10 px-5 py-4 shadow-inner backdrop-blur-md">
          <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-100">Active Ranking Scheme</p>
          <p class="mt-1 text-sm font-bold">{{ activeScheme.name }}</p>
          <p class="mt-0.5 text-xs text-blue-100">{{ activeScheme.academic_year || activeScheme.version || 'Current Scheme' }}</p>
        </div>
      </div>
    </section>

    <section>
      <div class="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Report Overview</p>
          <h2 class="mt-1 text-lg font-black text-gray-900 dark:text-white">Ranking Summary</h2>
        </div>
        <p class="text-xs text-gray-500">Summary values reflect the currently filtered ranking records.</p>
      </div>
      <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Personnel" :value="reportSummary.total" icon="i-lucide-users" description="Filtered ranking records" tone="info" />
        <StatCard label="Average Points" :value="reportSummary.averagePoints" icon="i-lucide-chart-no-axes-column-increasing" description="Average total ranking points" tone="primary" />
        <StatCard label="With Salary Rate" :value="reportSummary.rateConfigured" icon="i-lucide-badge-check" description="Records with assigned salary rate" tone="success" />
        <StatCard label="Rate Missing" :value="reportSummary.rateMissing" icon="i-lucide-triangle-alert" description="Needs salary-rate configuration" tone="warning" />
      </div>
    </section>

    <section class="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5 flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
            <UIcon name="i-lucide-sliders-horizontal" class="size-5" />
          </div>
          <div>
            <h2 class="font-bold text-gray-900 dark:text-white">Report Filters</h2>
            <p class="mt-1 text-xs text-gray-500">Select the academic period and personnel scope to include in the report.</p>
          </div>
        </div>
        <span v-if="hasActiveFilters" class="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">Filters Active</span>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Ranking Scheme"><USelectMenu v-model="selectedScheme" :items="schemeFilterOptions" value-key="value" class="w-full" /></UFormField>
        <UFormField label="School Year"><USelectMenu v-model="selectedSchoolYear" :items="schoolYearOptions" value-key="value" class="w-full" /></UFormField>
        <UFormField label="Semester"><USelectMenu v-model="selectedSemester" :items="semesterFilterOptions" value-key="value" class="w-full" /></UFormField>
        <UFormField label="Department"><USelectMenu v-model="selectedDepartment" :items="departmentOptions" value-key="value" class="w-full" /></UFormField>
        <UFormField label="Role"><USelectMenu v-model="selectedRole" :items="roleOptions" value-key="value" class="w-full" /></UFormField>
        <UFormField label="Rank"><USelectMenu v-model="selectedRank" :items="rankOptions" value-key="value" class="w-full" /></UFormField>
      </div>
      <div class="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
        <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Search name, employee no., department, or rank..." class="w-full max-w-xl" />
        <div class="flex flex-wrap gap-2">
          <UButton v-if="hasActiveFilters" color="neutral" variant="soft" icon="i-lucide-filter-x" @click="clearFilters">Clear Filters</UButton>
          <UButton color="neutral" variant="outline" icon="i-lucide-refresh-cw" :loading="loading" @click="loadData">Refresh</UButton>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-3 rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900">
      <div>
        <p class="font-bold text-gray-900 dark:text-white">Report Export</p>
        <p class="mt-1 text-xs text-gray-500">Preview or download the currently filtered ranking report.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <UButton color="neutral" variant="soft" icon="i-lucide-file-search" :loading="pdfLoading && pdfAction === 'preview'" :disabled="!filteredRankings.length || pdfLoading" @click="previewPdf">Preview PDF</UButton>
        <UButton color="primary" variant="soft" icon="i-lucide-download" :loading="pdfLoading && pdfAction === 'download'" :disabled="!filteredRankings.length || pdfLoading" @click="downloadPdf">Download PDF</UButton>
        <UButton
          color="success"
          variant="soft"
          icon="i-lucide-file-spreadsheet"
          :disabled="!filteredRankings.length"
          @click="exportExcel"
        >
          Export Excel
        </UButton>
      </div>
    </section>

    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="index in 6" :key="index" class="h-20 rounded-2xl" />
    </div>

    <section v-else-if="loadError" class="rounded-[24px] border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/20">
      <div class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40"><UIcon name="i-lucide-triangle-alert" class="size-7" /></div>
      <h2 class="mt-4 font-bold text-gray-900 dark:text-white">Unable to load ranking report</h2>
      <p class="mt-2 text-sm text-gray-500">{{ loadError }}</p>
      <UButton class="mt-5" icon="i-lucide-refresh-cw" @click="loadData">Try Again</UButton>
    </section>

    <section v-else class="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex flex-col gap-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10">
        <div class="flex items-center gap-3">
          <div class="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><UIcon name="i-lucide-file-chart-column" class="size-5" /></div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Consolidated Ranking Report</p>
            <h2 class="mt-1 text-base font-black text-gray-900 dark:text-white">Faculty and Dean Ranking Results</h2>
            <p class="mt-1 text-xs text-gray-500">Showing <span class="font-semibold text-gray-700 dark:text-gray-300">{{ paginationStart }}–{{ paginationEnd }}</span> of <span class="font-semibold text-gray-700 dark:text-gray-300">{{ filteredRankings.length }}</span> filtered records.</p>
          </div>
        </div>
        <div class="flex items-center gap-2"><span class="text-xs text-gray-500">Rows per page</span><USelectMenu v-model="pageSize" :items="pageSizeOptions" value-key="value" class="w-24" /></div>
      </div>

      <div v-if="!filteredRankings.length" class="px-6 py-16 text-center">
        <div class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-800"><UIcon name="i-lucide-file-search-2" class="size-7" /></div>
        <h3 class="mt-4 font-bold text-gray-900 dark:text-white">No ranking records found</h3>
        <p class="mt-2 text-sm text-gray-500">Change the report filters or compute faculty rankings first.</p>
      </div>

      <template v-else>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1450px] text-sm">
            <thead class="border-b border-gray-200 bg-slate-100/80 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600 dark:border-gray-800 dark:bg-gray-950/70 dark:text-slate-400">
              <tr>
                <th class="px-5 py-3.5 text-left">Personnel</th><th class="px-4 py-3.5 text-left">Department</th><th class="px-4 py-3.5 text-center">Educational<br/>Qualification</th><th class="px-4 py-3.5 text-center">Loyalty</th><th class="px-4 py-3.5 text-center">Evaluation</th><th class="px-4 py-3.5 text-center">CSR</th><th class="px-4 py-3.5 text-center">Total<br/>Points</th><th class="px-4 py-3.5 text-left">Rank</th><th class="px-4 py-3.5 text-right">Salary Rate</th><th class="px-4 py-3.5 text-left">School Year</th><th class="px-4 py-3.5 text-left">Semester</th><th class="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="ranking in paginatedRankings" :key="ranking.documentId || ranking.id" class="transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-950/10">
                <td class="px-5 py-4"><div class="flex items-center gap-3"><div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">{{ initials(teacherName(ranking.teacher)) }}</div><div class="min-w-0"><p class="font-bold text-gray-900 dark:text-white">{{ teacherName(ranking.teacher) }}</p><p class="mt-1 text-xs text-gray-500">{{ ranking.teacher?.employee_no || ranking.teacher?.user?.username || 'N/A' }} · {{ teacherRole(ranking.teacher) }}</p></div></div></td>
                <td class="px-4 py-4">{{ teacherDepartment(ranking.teacher) }}</td>
                <td class="px-4 py-4 text-center"><UBadge color="info" variant="subtle">{{ points(ranking.educational_qualification_total_points) }}</UBadge></td>
                <td class="px-4 py-4 text-center">{{ points(ranking.loyalty_points) }}</td>
                <td class="px-4 py-4 text-center"><UBadge color="success" variant="subtle">{{ points(ranking.evaluation_points) }}</UBadge></td>
                <td class="px-4 py-4 text-center">{{ points(ranking.csr_points) }}</td>
                <td class="px-4 py-4 text-center"><UBadge color="primary" variant="subtle">{{ points(ranking.total_ranking_points) }}</UBadge></td>
                <td class="px-4 py-4"><p class="font-bold text-gray-900 dark:text-white">{{ ranking.rank_name || 'Not assigned' }}</p><p v-if="ranking.rank_code" class="mt-1 text-xs text-gray-500">{{ ranking.rank_code }}</p></td>
                <td class="px-4 py-4 text-right"><span v-if="getAssignedSalaryRate(ranking) !== null" class="font-black text-gray-900 dark:text-white">{{ currency(getAssignedSalaryRate(ranking)) }}</span><span v-else class="text-xs font-semibold text-gray-500">Not configured</span></td>
                <td class="px-4 py-4">{{ ranking.school_year || 'N/A' }}</td><td class="px-4 py-4">{{ ranking.semester || 'N/A' }}</td>
                <td class="px-5 py-4 text-center"><UButton v-if="ranking.teacher?.documentId" size="xs" color="neutral" variant="soft" icon="i-lucide-eye" :to="`/hr/ranking/faculty/${ranking.teacher.documentId}?ranking=${ranking.documentId}`">View</UButton></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex flex-col gap-3 border-t border-gray-200 bg-gray-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-950/30">
          <p class="text-xs text-gray-500">Page <span class="font-semibold text-gray-700 dark:text-gray-300">{{ currentPage }}</span> of <span class="font-semibold text-gray-700 dark:text-gray-300">{{ totalPages }}</span> · {{ filteredRankings.length }} record{{ filteredRankings.length === 1 ? '' : 's' }}</p>
          <UPagination v-model:page="currentPage" :total="filteredRankings.length" :items-per-page="pageSize" :sibling-count="1" show-edges />
        </div>
      </template>
    </section>

    <UModal v-model:open="pdfPreviewOpen" id="hr-ranking-report-pdf-preview" :ui="{ content: 'max-w-7xl' }">
      <template #content>
        <div class="flex h-[90vh] flex-col overflow-hidden bg-white dark:bg-gray-950">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <div><h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ pdfFileName }}</h3><p class="mt-0.5 text-xs text-gray-500">Consolidated Faculty Ranking Report</p></div>
            <div class="flex items-center gap-2"><UButton icon="i-lucide-download" :disabled="!pdfBlob" @click="downloadExistingPdf">Download PDF</UButton><UButton color="neutral" variant="ghost" icon="i-lucide-x" square @click="closePdfPreview" /></div>
          </div>
          <div class="min-h-0 flex-1 bg-gray-100 p-3 dark:bg-gray-900"><iframe v-if="pdfPreviewUrl" :src="pdfPreviewUrl" title="Faculty Ranking Report PDF Preview" class="h-full w-full rounded-xl border border-gray-300 bg-white dark:border-gray-700" /></div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx-js-style"

definePageMeta({ middleware: ["auth", "role"], role: ["HR", "Admin"] })

const { $api } = useNuxtApp()
const toast = useToast()
const loading = ref(false)
const loadError = ref("")
const rankings = ref<any[]>([])
const schemes = ref<any[]>([])

const searchQuery = ref("")
const selectedScheme = ref("all")
const selectedSchoolYear = ref("all")
const selectedSemester = ref("all")
const selectedDepartment = ref("all")
const selectedRole = ref("all")
const selectedRank = ref("all")

const currentPage = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [{ label: "10", value: 10 }, { label: "25", value: 25 }, { label: "50", value: 50 }, { label: "100", value: 100 }]

const pdfLoading = ref(false)
const pdfAction = ref<"" | "preview" | "download">("")
const pdfPreviewOpen = ref(false)
const pdfPreviewUrl = ref("")
const pdfBlob = ref<Blob | null>(null)

const teacherName = (t:any) => t?.name || t?.full_name || t?.user?.username || "Faculty Member"
const teacherRole = (t:any) => t?.user?.role?.name || t?.user?.role?.type || t?.role || "Faculty"
const teacherDepartment = (t:any) => t?.department?.name ?? t?.department?.data?.name ?? t?.department?.data?.attributes?.name ?? t?.department?.attributes?.name ?? "Not specified"
const initials = (value:string) => String(value || "?").split(/\s+/).filter(Boolean).slice(0,2).map(p => p.charAt(0).toUpperCase()).join("")
const points = (value:unknown) => { const n = Number(value ?? 0); return Number.isFinite(n) ? (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, "")) : "0" }
const getAssignedSalaryRate = (ranking:any):number|null => { const v = ranking?.salary_rate ?? ranking?.salary_rate_record?.max_rate; if (v === null || v === undefined || v === "") return null; const n = Number(v); return Number.isFinite(n) ? n : null }
const currency = (value:unknown) => { const n = Number(value); return Number.isFinite(n) ? new Intl.NumberFormat("en-PH", { style:"currency", currency:"PHP", minimumFractionDigits:2, maximumFractionDigits:2 }).format(n) : "Not configured" }
const phpAmount = (value:unknown) => { const n = Number(value); return Number.isFinite(n) ? `PHP ${new Intl.NumberFormat("en-PH", { minimumFractionDigits:2, maximumFractionDigits:2 }).format(n)}` : "Not configured" }

const activeScheme = computed(() => schemes.value.find((s:any) => s.is_active === true && s.scheme_status === "active"))
const schemeFilterOptions = computed(() => [{ label:"All Ranking Schemes", value:"all" }, ...schemes.value.map((s:any) => ({ label:s.name || "Unnamed Scheme", value:s.documentId }))])
const schoolYearOptions = computed(() => [{ label:"All School Years", value:"all" }, ...Array.from(new Set(rankings.value.map((r:any) => r.school_year).filter(Boolean))).sort().map((v:any) => ({ label:v, value:v }))])
const semesterFilterOptions = computed(() => [{ label:"All Semesters", value:"all" }, ...Array.from(new Set(rankings.value.map((r:any) => r.semester).filter(Boolean))).map((v:any) => ({ label:v, value:v }))])
const departmentOptions = computed(() => [{ label:"All Departments", value:"all" }, ...Array.from(new Set(rankings.value.map((r:any) => teacherDepartment(r.teacher)).filter((v:any) => v && v !== "Not specified"))).sort().map((v:any) => ({ label:v, value:v }))])
const roleOptions = [{ label:"All Roles", value:"all" }, { label:"Faculty", value:"Faculty" }, { label:"Dean", value:"Dean" }]
const rankOptions = computed(() => [{ label:"All Ranks", value:"all" }, ...Array.from(new Set(rankings.value.map((r:any) => r.rank_name).filter(Boolean))).sort().map((v:any) => ({ label:v, value:v }))])

const filteredRankings = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return rankings.value.filter((r:any) => {
    const dept = teacherDepartment(r.teacher)
    const role = teacherRole(r.teacher)
    const searchable = [teacherName(r.teacher), r.teacher?.employee_no, r.teacher?.user?.username, dept, role, r.rank_name, r.rank_code, r.school_year, r.semester].filter(Boolean).join(" ").toLowerCase()
    return (!q || searchable.includes(q)) &&
      (selectedScheme.value === "all" || r?.ranking_scheme?.documentId === selectedScheme.value) &&
      (selectedSchoolYear.value === "all" || r.school_year === selectedSchoolYear.value) &&
      (selectedSemester.value === "all" || r.semester === selectedSemester.value) &&
      (selectedDepartment.value === "all" || dept === selectedDepartment.value) &&
      (selectedRole.value === "all" || role === selectedRole.value) &&
      (selectedRank.value === "all" || r.rank_name === selectedRank.value)
  })
})

const reportSummary = computed(() => {
  const total = filteredRankings.value.length
  const sum = filteredRankings.value.reduce((a:number,r:any) => a + Number(r.total_ranking_points || 0), 0)
  const rateConfigured = filteredRankings.value.filter((r:any) => getAssignedSalaryRate(r) !== null && r.rate_assignment_status !== "not_configured").length
  return { total, averagePoints: total ? points(sum / total) : "0", rateConfigured, rateMissing: total - rateConfigured }
})

const hasActiveFilters = computed(() => Boolean(searchQuery.value.trim()) || [selectedScheme.value, selectedSchoolYear.value, selectedSemester.value, selectedDepartment.value, selectedRole.value, selectedRank.value].some(v => v !== "all"))
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRankings.value.length / pageSize.value)))
const paginatedRankings = computed(() => { const start = (currentPage.value - 1) * pageSize.value; return filteredRankings.value.slice(start, start + pageSize.value) })
const paginationStart = computed(() => filteredRankings.value.length ? (currentPage.value - 1) * pageSize.value + 1 : 0)
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, filteredRankings.value.length))
const pdfFileName = computed(() => `Faculty-Ranking-Report-${selectedSchoolYear.value === "all" ? "All-School-Years" : selectedSchoolYear.value}-${selectedSemester.value === "all" ? "All-Semesters" : selectedSemester.value.replace(/[^a-zA-Z0-9]+/g,"-")}.pdf`)

const StatCard = defineComponent({ props:{ label:String, value:[String,Number], icon:String, description:String, tone:{type:String,default:"info"} }, setup(props){ const tones:any={info:{icon:"bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",accent:"from-blue-500/15 via-blue-500/5 to-transparent"},primary:{icon:"bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400",accent:"from-indigo-500/15 via-indigo-500/5 to-transparent"},success:{icon:"bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",accent:"from-emerald-500/15 via-emerald-500/5 to-transparent"},warning:{icon:"bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",accent:"from-amber-500/15 via-amber-500/5 to-transparent"}}; return () => { const tone=tones[props.tone]||tones.info; return h("div",{class:"group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"},[h("div",{class:`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${tone.accent}`}),h("div",{class:"relative flex items-start justify-between gap-4"},[h("div",{},[h("p",{class:"text-xs font-bold uppercase tracking-[0.08em] text-gray-500"},props.label),h("p",{class:"mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white"},String(props.value??0)),h("p",{class:"mt-1.5 text-[11px] leading-4 text-gray-400"},props.description||"")]),h("div",{class:`flex size-11 items-center justify-center rounded-2xl shadow-sm ${tone.icon}`},[h(resolveComponent("UIcon"),{name:props.icon,class:"size-5"})])])]) } } })

const clearFilters = () => {
  searchQuery.value = ""
  selectedDepartment.value = "all"
  selectedRole.value = "all"
  selectedRank.value = "all"
  currentPage.value = 1

  applyDefaultReportPeriod()
}

const exportExcel = () => {
  if (!import.meta.client) {
    return
  }

  if (!filteredRankings.value.length) {
    return
  }

  const selectedSchemeName =
    selectedScheme.value === "all"
      ? "All Ranking Schemes"
      : schemes.value.find(
          (scheme: any) =>
            scheme.documentId ===
            selectedScheme.value,
        )?.name || "Selected Scheme"

  const selectedSchoolYearLabel =
    selectedSchoolYear.value === "all"
      ? "All School Years"
      : selectedSchoolYear.value

  const selectedSemesterLabel =
    selectedSemester.value === "all"
      ? "All Semesters"
      : selectedSemester.value

  const selectedDepartmentLabel =
    selectedDepartment.value === "all"
      ? "All Departments"
      : selectedDepartment.value

  const selectedRoleLabel =
    selectedRole.value === "all"
      ? "All Roles"
      : selectedRole.value

  const selectedRankLabel =
    selectedRank.value === "all"
      ? "All Ranks"
      : selectedRank.value

  const headers = [
    "Personnel",
    "Employee No.",
    "Role",
    "Department",
    "Educational Qualification",
    "Loyalty",
    "Evaluation",
    "Corporate Social Responsibility",
    "Total Ranking Points",
    "Rank",
    "Rank Code",
    "Salary Rate",
    "School Year",
    "Semester",
    "Ranking Scheme",
    "Computation Status",
    "Rate Assignment Status",
  ]

  const dataRows =
    filteredRankings.value.map(
      (ranking: any) => [
        teacherName(
          ranking.teacher,
        ),

        ranking.teacher
          ?.employee_no ||
          ranking.teacher?.user
            ?.username ||
          "",

        teacherRole(
          ranking.teacher,
        ),

        teacherDepartment(
          ranking.teacher,
        ),

        Number(
          ranking
            .educational_qualification_total_points ||
            0,
        ),

        Number(
          ranking.loyalty_points ||
            0,
        ),

        Number(
          ranking.evaluation_points ||
            0,
        ),

        Number(
          ranking.csr_points ||
            0,
        ),

        Number(
          ranking.total_ranking_points ||
            0,
        ),

        ranking.rank_name || "",

        ranking.rank_code || "",

        getAssignedSalaryRate(
          ranking,
        ) ?? "",

        ranking.school_year || "",

        ranking.semester || "",

        ranking.ranking_scheme
          ?.name || "",

        ranking.computation_status ||
          "",

        ranking.rate_assignment_status ||
          "",
      ],
    )

  const reportSheetData = [
    [
      "ST. NICOLAS COLLEGE OF BUSINESS AND TECHNOLOGY",
      ...Array(16).fill(""),
    ],
    [
      "FACULTY RANKING REPORT",
      ...Array(16).fill(""),
    ],
    [
      `School Year: ${selectedSchoolYearLabel}   |   Semester: ${selectedSemesterLabel}`,
      ...Array(16).fill(""),
    ],
    [
      `Department: ${selectedDepartmentLabel}   |   Role: ${selectedRoleLabel}   |   Rank: ${selectedRankLabel}`,
      ...Array(16).fill(""),
    ],
    [
      `Ranking Scheme: ${selectedSchemeName}`,
      ...Array(16).fill(""),
    ],
    Array(17).fill(""),
    headers,
    ...dataRows,
  ]

  const worksheet =
    XLSX.utils.aoa_to_sheet(
      reportSheetData,
    )

  worksheet["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: 16 },
    },
    {
      s: { r: 1, c: 0 },
      e: { r: 1, c: 16 },
    },
    {
      s: { r: 2, c: 0 },
      e: { r: 2, c: 16 },
    },
    {
      s: { r: 3, c: 0 },
      e: { r: 3, c: 16 },
    },
    {
      s: { r: 4, c: 0 },
      e: { r: 4, c: 16 },
    },
  ]

  worksheet["!cols"] = [
    { wch: 28 },
    { wch: 16 },
    { wch: 12 },
    { wch: 34 },
    { wch: 23 },
    { wch: 12 },
    { wch: 12 },
    { wch: 31 },
    { wch: 20 },
    { wch: 22 },
    { wch: 15 },
    { wch: 17 },
    { wch: 16 },
    { wch: 18 },
    { wch: 28 },
    { wch: 20 },
    { wch: 23 },
  ]

  worksheet["!rows"] = [
    { hpt: 26 },
    { hpt: 22 },
    { hpt: 18 },
    { hpt: 18 },
    { hpt: 18 },
    { hpt: 8 },
    { hpt: 32 },
  ]

  worksheet["!autofilter"] = {
    ref: `A7:Q${
      dataRows.length + 7
    }`,
  }

  worksheet["!freeze"] = {
    xSplit: 0,
    ySplit: 7,
    topLeftCell: "A8",
    activePane: "bottomLeft",
    state: "frozen",
  }

  const darkBlue =
    "0F172A"

  const blue =
    "1D4ED8"

  const lightBlue =
    "EFF6FF"

  const lightGray =
    "F8FAFC"

  const borderColor =
    "CBD5E1"

  const white =
    "FFFFFF"

  const titleStyle = {
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

  const reportTitleStyle = {
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

  const subtitleStyle = {
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

  const headerStyle = {
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

  worksheet["A1"].s =
    titleStyle

  worksheet["A2"].s =
    reportTitleStyle

  for (
    const address of [
      "A3",
      "A4",
      "A5",
    ]
  ) {
    worksheet[address].s =
      subtitleStyle
  }

  for (
    let column = 0;
    column < headers.length;
    column += 1
  ) {
    const address =
      XLSX.utils.encode_cell({
        r: 6,
        c: column,
      })

    worksheet[address].s =
      headerStyle
  }

  for (
    let rowIndex = 0;
    rowIndex < dataRows.length;
    rowIndex += 1
  ) {
    const sheetRow =
      rowIndex + 7

    const isAlternate =
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
            rgb: isAlternate
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
            ].includes(column)
              ? "center"
              : column === 11
                ? "right"
                : "left",
          wrapText:
            [
              0,
              3,
              4,
              7,
              14,
              15,
              16,
            ].includes(column),
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
          4,
          5,
          6,
          7,
          8,
        ].includes(column) &&
        typeof cell.v ===
          "number"
      ) {
        cell.z = "0.00"
      }

      if (
        column === 11 &&
        typeof cell.v ===
          "number"
      ) {
        cell.z =
          '"PHP" #,##0.00'
      }
    }
  }

  const summarySheetData = [
    [
      "FACULTY RANKING REPORT SUMMARY",
      "",
    ],
    [
      "Generated",
      new Date().toLocaleString(
        "en-PH",
      ),
    ],
    [
      "Ranking Scheme",
      selectedSchemeName,
    ],
    [
      "School Year",
      selectedSchoolYearLabel,
    ],
    [
      "Semester",
      selectedSemesterLabel,
    ],
    [
      "Department",
      selectedDepartmentLabel,
    ],
    [
      "Role",
      selectedRoleLabel,
    ],
    [
      "Rank",
      selectedRankLabel,
    ],
    [
      "",
      "",
    ],
    [
      "Total Personnel",
      reportSummary.value.total,
    ],
    [
      "Average Points",
      Number(
        reportSummary.value
          .averagePoints || 0,
      ),
    ],
    [
      "With Salary Rate",
      reportSummary.value
        .rateConfigured,
    ],
    [
      "Rate Missing",
      reportSummary.value
        .rateMissing,
    ],
  ]

  const summarySheet =
    XLSX.utils.aoa_to_sheet(
      summarySheetData,
    )

  summarySheet["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: 1 },
    },
  ]

  summarySheet["!cols"] = [
    { wch: 27 },
    { wch: 42 },
  ]

  summarySheet["!rows"] = [
    { hpt: 26 },
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

  for (
    let row = 1;
    row <
    summarySheetData.length;
    row += 1
  ) {
    const labelCell =
      summarySheet[
        `A${row + 1}`
      ]

    const valueCell =
      summarySheet[
        `B${row + 1}`
      ]

    if (
      !labelCell &&
      !valueCell
    ) {
      continue
    }

    if (labelCell) {
      labelCell.s = {
        font: {
          name: "Arial",
          sz: 10,
          bold:
            row >= 9,
          color: {
            rgb: "334155",
          },
        },
        fill: {
          fgColor: {
            rgb:
              row >= 9
                ? lightBlue
                : white,
          },
        },
        alignment: {
          vertical: "center",
        },
        border:
          row >= 9
            ? {
                top: {
                  style: "thin",
                  color: {
                    rgb:
                      borderColor,
                  },
                },
                bottom: {
                  style: "thin",
                  color: {
                    rgb:
                      borderColor,
                  },
                },
                left: {
                  style: "thin",
                  color: {
                    rgb:
                      borderColor,
                  },
                },
                right: {
                  style: "thin",
                  color: {
                    rgb:
                      borderColor,
                  },
                },
              }
            : undefined,
      }
    }

    if (valueCell) {
      valueCell.s = {
        font: {
          name: "Arial",
          sz: 10,
          bold:
            row >= 9,
          color: {
            rgb:
              row >= 9
                ? "0F172A"
                : "475569",
          },
        },
        fill: {
          fgColor: {
            rgb:
              row >= 9
                ? lightBlue
                : white,
          },
        },
        alignment: {
          vertical: "center",
        },
        border:
          row >= 9
            ? {
                top: {
                  style: "thin",
                  color: {
                    rgb:
                      borderColor,
                  },
                },
                bottom: {
                  style: "thin",
                  color: {
                    rgb:
                      borderColor,
                  },
                },
                left: {
                  style: "thin",
                  color: {
                    rgb:
                      borderColor,
                  },
                },
                right: {
                  style: "thin",
                  color: {
                    rgb:
                      borderColor,
                  },
                },
              }
            : undefined,
      }
    }
  }

  if (
    summarySheet["B11"] &&
    typeof summarySheet["B11"].v ===
      "number"
  ) {
    summarySheet["B11"].z =
      "0.00"
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
    "Faculty Ranking",
  )

  const schoolYear =
    selectedSchoolYear.value ===
    "all"
      ? "All-School-Years"
      : String(
          selectedSchoolYear.value,
        )
          .replace(
            /[^a-zA-Z0-9]+/g,
            "-",
          )
          .replace(
            /^-+|-+$/g,
            "",
          )

  const semester =
    selectedSemester.value ===
    "all"
      ? "All-Semesters"
      : String(
          selectedSemester.value,
        )
          .replace(
            /[^a-zA-Z0-9]+/g,
            "-",
          )
          .replace(
            /^-+|-+$/g,
            "",
          )

  XLSX.writeFile(
    workbook,
    `Faculty-Ranking-Report-${schoolYear}-${semester}.xlsx`,
    {
      compression: true,
    },
  )
}

const createPdfBlob = async () => {
  if (!import.meta.client) throw new Error("PDF generation is only available in the browser.")
  if (!filteredRankings.value.length) throw new Error("There are no ranking records to include in the report.")
  const doc = new jsPDF({ orientation:"landscape", unit:"mm", format:"a4", compress:true })
  const pageWidth=doc.internal.pageSize.getWidth(), pageHeight=doc.internal.pageSize.getHeight(), margin=10
  doc.setFont("helvetica","bold"); doc.setFontSize(14); doc.text("ST. NICOLAS COLLEGE OF BUSINESS AND TECHNOLOGY", pageWidth/2, 12, {align:"center"}); doc.setFontSize(11); doc.text("FACULTY RANKING REPORT", pageWidth/2, 18, {align:"center"}); doc.setFont("helvetica","normal"); doc.setFontSize(8)
  const filterText=[selectedSchoolYear.value !== "all" ? `School Year: ${selectedSchoolYear.value}` : "School Year: All", selectedSemester.value !== "all" ? `Semester: ${selectedSemester.value}` : "Semester: All", selectedDepartment.value !== "all" ? `Department: ${selectedDepartment.value}` : "Department: All"].join("   |   ")
  doc.text(filterText, pageWidth/2, 24, {align:"center"})
  autoTable(doc,{startY:30,head:[["Personnel","Department","EQ","Loyalty","Evaluation","CSR","Total","Rank","Salary Rate","School Year","Semester"]],body:filteredRankings.value.map((r:any)=>[teacherName(r.teacher),teacherDepartment(r.teacher),points(r.educational_qualification_total_points),points(r.loyalty_points),points(r.evaluation_points),points(r.csr_points),points(r.total_ranking_points),r.rank_name||"Not assigned",getAssignedSalaryRate(r)===null?"Not configured":phpAmount(getAssignedSalaryRate(r)),r.school_year||"N/A",r.semester||"N/A"]),margin:{left:margin,right:margin,bottom:14},theme:"grid",styles:{font:"helvetica",fontSize:7,cellPadding:1.8,valign:"middle",overflow:"linebreak",lineWidth:0.15,lineColor:[156,163,175],textColor:[17,24,39]},headStyles:{fontStyle:"bold",fillColor:[241,245,249],textColor:[17,24,39],halign:"center"},columnStyles:{0:{cellWidth:42},1:{cellWidth:42},2:{cellWidth:14,halign:"center"},3:{cellWidth:16,halign:"center"},4:{cellWidth:18,halign:"center"},5:{cellWidth:14,halign:"center"},6:{cellWidth:16,halign:"center"},7:{cellWidth:29},8:{cellWidth:26,halign:"right"},9:{cellWidth:23},10:{cellWidth:23}},didDrawPage:()=>{doc.setFont("helvetica","normal");doc.setFontSize(7);doc.text(`Generated ${new Date().toLocaleDateString("en-PH")} · Confidential`,margin,pageHeight-6);doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`,pageWidth-margin,pageHeight-6,{align:"right"})}})
  return doc.output("blob")
}

const revokePdfUrl = () => { if (pdfPreviewUrl.value && import.meta.client) URL.revokeObjectURL(pdfPreviewUrl.value); pdfPreviewUrl.value=""; pdfBlob.value=null }
const triggerDownload = (blob:Blob) => { const url=URL.createObjectURL(blob); const link=document.createElement("a"); link.href=url; link.download=pdfFileName.value; document.body.appendChild(link); link.click(); link.remove(); setTimeout(()=>URL.revokeObjectURL(url),500) }
const previewPdf = async () => { if(pdfLoading.value)return; pdfLoading.value=true; pdfAction.value="preview"; revokePdfUrl(); try{ const blob=await createPdfBlob(); pdfBlob.value=blob; pdfPreviewUrl.value=URL.createObjectURL(blob); pdfPreviewOpen.value=true }catch(error:any){toast.add({title:"Unable to preview PDF",description:error?.message||"The ranking report could not be generated.",color:"error"})}finally{pdfLoading.value=false;pdfAction.value=""} }
const downloadPdf = async () => { if(pdfLoading.value)return; pdfLoading.value=true; pdfAction.value="download"; try{triggerDownload(await createPdfBlob())}catch(error:any){toast.add({title:"Unable to download PDF",description:error?.message||"The ranking report could not be generated.",color:"error"})}finally{pdfLoading.value=false;pdfAction.value=""} }
const downloadExistingPdf = () => { if(pdfBlob.value) triggerDownload(pdfBlob.value) }
const closePdfPreview = () => { pdfPreviewOpen.value=false; revokePdfUrl() }

const applyDefaultReportPeriod = () => {
  const active =
    schemes.value.find(
      (scheme: any) =>
        scheme.is_active === true &&
        scheme.scheme_status === "active",
    )

  if (active?.documentId) {
    selectedScheme.value =
      active.documentId
  }

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
    schoolYearOptions.value.filter(
      (option: any) =>
        option.value !== "all",
    )

  if (
    activeSchoolYear &&
    availableSchoolYears.some(
      (option: any) =>
        option.value === activeSchoolYear,
    )
  ) {
    selectedSchoolYear.value =
      activeSchoolYear
  } else {
    selectedSchoolYear.value =
      availableSchoolYears[0]?.value ||
      "all"
  }

  const availableSemesters =
    semesterFilterOptions.value.filter(
      (option: any) =>
        option.value !== "all",
    )

  if (
    activeSemester &&
    availableSemesters.some(
      (option: any) =>
        option.value === activeSemester,
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
              option.value === semester,
          ),
      ) ||
      availableSemesters[0]?.value ||
      "all"
  }
}

const loadData = async () => {
  loading.value=true; loadError.value=""
  try{
    const [rankingResponse,schemeResponse]:any[] = await Promise.all([
      $api("/faculty-rankings",{query:{"populate[teacher][populate][department]":true,"populate[teacher][populate][user][populate][role]":true,"populate[ranking_scheme]":true,"populate[rank_band]":true,"populate[salary_rate_record]":true,"pagination[page]":1,"pagination[pageSize]":1000,"sort[0]":"school_year:desc","sort[1]":"computed_at:desc"}}),
      $api("/ranking-schemes",{query:{"pagination[page]":1,"pagination[pageSize]":100}})
    ])
    rankings.value=rankingResponse?.data||[]
    schemes.value=schemeResponse?.data||[]

    applyDefaultReportPeriod()
  }catch(error:any){console.error("Ranking report loading error:",error);loadError.value=error?.data?.error?.message||error?.data?.message||error?.message||"Unable to load ranking report records."}finally{loading.value=false}
}

watch([searchQuery,selectedScheme,selectedSchoolYear,selectedSemester,selectedDepartment,selectedRole,selectedRank,pageSize],()=>{currentPage.value=1})
watch(totalPages,(pages)=>{if(currentPage.value>pages)currentPage.value=pages})
onMounted(loadData)
onBeforeUnmount(revokePdfUrl)
</script>
