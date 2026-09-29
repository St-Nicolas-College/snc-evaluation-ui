<template>
  <div class="space-y-7 pb-10">
    <!-- HERO -->
    <section class="relative overflow-hidden rounded-3xl border border-primary-500/20 bg-gradient-to-br from-primary-700 via-primary-600 to-emerald-600 p-6 text-white shadow-lg shadow-primary-900/10 sm:p-8">
      <div class="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-white/10 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-28 left-1/3 size-64 rounded-full bg-emerald-300/20 blur-3xl"></div>
      <div class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-3xl">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur">
              <UIcon name="i-lucide-layout-dashboard" class="size-4" />
              Administrator Overview
            </span>
            <span v-if="activeSchoolYear" class="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
              {{ activePeriodLabel }}
            </span>
          </div>
          <h1 class="mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">Welcome to the Evaluation Dashboard</h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">Monitor users, active-period evaluation activity, faculty performance, section scores, and AI-powered student feedback insights.</p>
          <div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/75">
            <span class="inline-flex items-center gap-1.5"><UIcon name="i-lucide-calendar-days" class="size-4" />{{ currentDate }}</span>
            <span class="inline-flex items-center gap-1.5"><UIcon name="i-lucide-database" class="size-4" />{{ totalEvaluations.toLocaleString() }} active-period evaluation records</span>
            <span class="inline-flex items-center gap-1.5"><span class="size-2 rounded-full bg-emerald-300"></span>System online</span>
          </div>
        </div>
        <UButton icon="i-lucide-refresh-cw" color="neutral" variant="solid" size="lg" class="bg-white text-primary-700 shadow-sm hover:bg-white/90 dark:bg-white dark:text-primary-700" :loading="loading" :disabled="loading" @click="loadDashboard">Refresh Data</UButton>
      </div>
    </section>

    <!-- QUICK ACTIONS -->
    <section>
      <div class="mb-4">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Open frequently used administration pages.</p>
      </div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <NuxtLink v-for="action in quickActions" :key="action.label" :to="action.to" class="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-700">
          <div class="flex size-11 shrink-0 items-center justify-center rounded-xl" :class="action.iconClass"><UIcon :name="action.icon" class="size-5" /></div>
          <div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">{{ action.label }}</p><p class="mt-0.5 truncate text-xs text-gray-400">{{ action.description }}</p></div>
          <UIcon name="i-lucide-chevron-right" class="size-4 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-primary-500" />
        </NuxtLink>
      </div>
    </section>

    <!-- LOADING -->
    <template v-if="loading">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"><USkeleton v-for="i in 5" :key="i" class="h-44 rounded-2xl" /></div>
      <div class="grid gap-4 xl:grid-cols-3"><USkeleton v-for="i in 3" :key="i" class="h-48 rounded-2xl" /></div>
      <USkeleton class="h-80 rounded-3xl" />
    </template>

    <template v-else>
      <!-- SYSTEM OVERVIEW -->
      <section>
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 class="text-base font-semibold text-gray-900 dark:text-white">System Overview</h2><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Current system records and active-period evaluation activity.</p></div>
          <div class="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">{{ activeSchoolYear ? activePeriodLabel : 'No active academic period' }}</div>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <article v-for="stat in primaryStats" :key="stat.label" class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div class="absolute inset-x-0 top-0 h-1" :class="stat.accentClass"></div>
            <div class="flex items-start justify-between"><div class="flex size-11 items-center justify-center rounded-2xl" :class="stat.iconClass"><UIcon :name="stat.icon" class="size-5" /></div><UBadge color="neutral" variant="subtle" size="sm">{{ stat.badge }}</UBadge></div>
            <p class="mt-5 text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
            <p class="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{{ stat.value }}</p>
            <p class="mt-2 text-xs text-gray-400">{{ stat.description }}</p>
            <div class="mt-4 border-t border-gray-100 pt-3 text-xs dark:border-gray-800"><span class="text-gray-400">{{ stat.footerLabel }}</span><p class="mt-1 truncate font-semibold" :class="stat.footerClass">{{ stat.footerValue }}</p></div>
          </article>
        </div>
      </section>

      <!-- ACTIVE PERIOD EVALUATION ACTIVITY -->
      <section>
        <div class="mb-4"><h2 class="text-base font-semibold text-gray-900 dark:text-white">Active Period Evaluation Activity</h2><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Each evaluation type uses its own configured scoring scale.</p></div>
        <div v-if="!activeSchoolYear" class="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">No active school year and semester is currently configured.</div>
        <div v-else class="grid gap-4 xl:grid-cols-3">
          <NuxtLink v-for="item in evaluationSummaries" :key="item.code" :to="item.to" class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            <div class="flex items-start justify-between"><div class="flex items-center gap-3"><div class="flex size-11 items-center justify-center rounded-xl" :class="item.iconClass"><UIcon :name="item.icon" class="size-5" /></div><div><p class="font-semibold text-gray-900 dark:text-white">{{ item.label }}</p><p class="mt-0.5 text-xs text-gray-500">{{ item.description }}</p></div></div><UIcon name="i-lucide-arrow-up-right" class="size-4 text-gray-400 group-hover:text-primary-500" /></div>
            <div class="mt-5 grid grid-cols-2 gap-3"><div class="rounded-xl bg-gray-50 p-3 dark:bg-gray-950/40"><p class="text-[10px] font-bold uppercase text-gray-400">Records</p><p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ item.summary.count }}</p></div><div class="rounded-xl bg-gray-50 p-3 dark:bg-gray-950/40"><p class="text-[10px] font-bold uppercase text-gray-400">Average</p><p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ item.summary.average > 0 && item.summary.maxScore ? `${item.summary.average.toFixed(2)} / ${item.summary.maxScore}` : '—' }}</p><p v-if="item.summary.label" class="mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">{{ item.summary.label }}</p></div></div>
          </NuxtLink>
        </div>
      </section>

      <!-- AI SENTIMENT -->
      <section>
        <UCard :ui="{ root: 'overflow-hidden rounded-3xl border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900', body: 'p-0' }">
          <div class="grid grid-cols-1 xl:grid-cols-[0.85fr_1.15fr]">
            <div class="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 p-6 text-white sm:p-7">
              <div class="flex items-center justify-between"><div class="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10"><UIcon name="i-lucide-brain-circuit" class="size-6" /></div><span class="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">AI Powered</span></div>
              <p class="mt-7 text-sm font-medium text-white/60">Average Sentiment Score</p>
              <div class="mt-2 flex items-end gap-3"><p class="text-5xl font-bold">{{ averageSentimentScore }}</p><span class="mb-1 text-sm text-white/50">from -1 to +1</span></div>
              <span class="mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="overallSentimentClass">{{ overallSentimentLabel }}</span>
              <p class="mt-4 text-sm leading-6 text-white/65">Based on <strong class="text-white">{{ analyzedFeedbackCount }}</strong> analysed Student → Faculty comment{{ analyzedFeedbackCount === 1 ? '' : 's' }} in the active period.</p>
              <div class="mt-7 rounded-2xl border border-white/10 bg-white/[0.06] p-4"><div class="flex justify-between text-[11px]"><span class="text-red-300">Negative</span><span class="text-white/60">Neutral</span><span class="text-emerald-300">Positive</span></div><div class="relative mt-3 h-2.5 rounded-full bg-gradient-to-r from-red-500 via-gray-400 to-emerald-500"><span class="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-950" :style="{ left: `${sentimentScorePercentage}%` }"></span></div></div>
            </div>
            <div class="p-6 sm:p-7">
              <h2 class="text-base font-semibold text-gray-900 dark:text-white">Student Feedback Sentiment</h2><p class="mt-1 text-sm text-gray-500">Distribution of AI-classified Student → Faculty comments.</p>
              <div v-if="analyzedFeedbackCount" class="mt-7 space-y-6"><div v-for="item in sentimentDistribution" :key="item.label"><div class="mb-2 flex items-center justify-between"><div><p class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ item.label }}</p><p class="text-xs text-gray-400">{{ item.description }}</p></div><div class="text-right"><p class="font-bold text-gray-900 dark:text-white">{{ item.count }}</p><p class="text-xs text-gray-400">{{ item.percentage }}%</p></div></div><div class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"><div class="h-full rounded-full" :class="item.progressClass" :style="{ width: `${item.percentage}%` }"></div></div></div></div>
              <div v-else class="flex min-h-56 flex-col items-center justify-center text-center"><UIcon name="i-lucide-message-square-off" class="size-8 text-gray-400" /><p class="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">No analysed comments yet</p></div>
            </div>
          </div>
        </UCard>
      </section>

      <!-- TOP FACULTY + SECTION SUMMARY -->
      <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <UCard :ui="{ root: 'overflow-hidden rounded-2xl border-gray-200 dark:border-gray-800', body: 'p-0' }">
          <template #header><div class="flex items-center justify-between"><div><h3 class="font-semibold text-gray-900 dark:text-white">Top Faculty</h3><p class="mt-1 text-xs text-gray-500">Student → Faculty evaluations only</p></div><UBadge color="warning" variant="subtle">Top 5</UBadge></div></template>
          <div v-if="topFaculty.length" class="divide-y divide-gray-100 dark:divide-gray-800"><div v-for="(facultyItem, index) in topFaculty" :key="facultyItem.id" class="flex items-center gap-3 px-5 py-4"><div class="flex size-9 items-center justify-center rounded-xl text-sm font-bold" :class="rankingClass(index)">{{ index + 1 }}</div><UAvatar :alt="facultyItem.name" :text="getInitials(facultyItem.name)" size="md" /><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">{{ facultyItem.name }}</p><p class="text-xs text-gray-500">{{ facultyItem.count }} evaluation{{ facultyItem.count === 1 ? '' : 's' }}</p></div><div class="text-right"><p class="text-lg font-bold text-gray-900 dark:text-white">{{ facultyItem.average.toFixed(2) }}</p><p class="text-xs text-gray-400">/ {{ studentFacultySummary.maxScore || '—' }}</p></div></div></div>
          <div v-else class="px-5 py-14 text-center text-sm text-gray-500">No Student → Faculty ranking data yet.</div>
        </UCard>

        <UCard :ui="{ root: 'overflow-hidden rounded-2xl border-gray-200 dark:border-gray-800', body: 'p-0' }">
          <template #header><div><h3 class="font-semibold text-gray-900 dark:text-white">Student → Faculty Section Summary</h3><p class="mt-1 text-xs text-gray-500">Average score by evaluation section for the active period</p></div></template>
          <div v-if="sectionSummary.length" class="divide-y divide-gray-100 dark:divide-gray-800"><div v-for="section in sectionSummary" :key="section.section" class="px-5 py-4"><div class="flex items-center justify-between"><div><p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ section.section }}</p><p class="text-xs text-gray-500">{{ section.items }} rated item{{ section.items === 1 ? '' : 's' }}</p></div><UBadge color="primary" variant="subtle">{{ section.average.toFixed(2) }}</UBadge></div><div class="mt-3 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"><div class="h-full rounded-full bg-primary-500" :style="{ width: `${scorePercentage(section.average, studentFacultySummary.maxScore)}%` }"></div></div></div></div>
          <div v-else class="px-5 py-14 text-center text-sm text-gray-500">No Student → Faculty section data available.</div>
        </UCard>
      </div>

      <!-- RECENT EVALUATIONS -->
      <UCard :ui="{ root: 'overflow-hidden rounded-2xl border-gray-200 dark:border-gray-800', body: 'p-0' }">
        <template #header><div class="flex items-center justify-between"><div><h3 class="font-semibold text-gray-900 dark:text-white">Recent Evaluations</h3><p class="mt-1 text-xs text-gray-500">Latest submissions for {{ activePeriodLabel }}</p></div><UBadge color="neutral" variant="subtle">Latest {{ recentEvaluations.length }}</UBadge></div></template>
        <div v-if="recentEvaluations.length" class="overflow-x-auto"><table class="w-full min-w-[850px] text-sm"><thead class="border-b border-gray-200 bg-gray-50/80 text-xs uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-800/50"><tr><th class="px-5 py-3 text-left">Target</th><th class="px-5 py-3 text-left">Evaluation Type</th><th class="px-5 py-3 text-center">Average</th><th class="px-5 py-3 text-center">Scale</th><th class="px-5 py-3 text-center">Sentiment</th><th class="px-5 py-3 text-right">Date Submitted</th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-gray-800"><tr v-for="evaluation in recentEvaluations" :key="evaluation.id"><td class="px-5 py-4 font-medium text-gray-800 dark:text-gray-200">{{ evaluation.target }}</td><td class="px-5 py-4"><UBadge :color="evaluationTypeColor(evaluation.type)" variant="subtle">{{ evaluation.type }}</UBadge></td><td class="px-5 py-4 text-center font-semibold">{{ evaluation.average > 0 ? evaluation.average.toFixed(2) : '—' }}</td><td class="px-5 py-4 text-center text-gray-500">{{ evaluation.maxScore || '—' }}</td><td class="px-5 py-4 text-center"><UBadge :color="sentimentColor(evaluation.sentiment)" variant="subtle">{{ evaluation.sentiment }}</UBadge></td><td class="px-5 py-4 text-right text-gray-500">{{ evaluation.date }}</td></tr></tbody></table></div>
        <div v-else class="px-5 py-16 text-center text-sm text-gray-500">No evaluation submissions for the active period.</div>
      </UCard>

      <div class="flex items-center justify-end text-xs text-gray-400"><UIcon name="i-lucide-clock-3" class="mr-1.5 size-3.5" />Last updated: {{ lastUpdated }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

const { $api } = useNuxtApp()
const toast = useToast()

const loading = ref(true)
const students = ref<any[]>([])
const teachers = ref<any[]>([])
const departments = ref<any[]>([])
const courses = ref<any[]>([])
const schoolYears = ref<any[]>([])
const evaluationTypes = ref<any[]>([])
const evaluations = ref<any[]>([])
const lastUpdatedAt = ref<Date | null>(null)

const quickActions = [
  { label: 'Manage Students', description: 'View student accounts', to: '/admin/management/student', icon: 'i-lucide-graduation-cap', iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' },
  { label: 'Manage Faculty', description: 'View faculty accounts', to: '/admin/management/faculty', icon: 'i-lucide-users-round', iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' },
  { label: 'Evaluation Results', description: 'Review submitted results', to: '/admin/evaluation/student-faculty', icon: 'i-lucide-chart-column-big', iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400' },
  { label: 'Evaluation Setup', description: 'Configure sections and criteria', to: '/admin/management/section', icon: 'i-lucide-settings-2', iconClass: 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400' }
]

const currentDate = computed(() => new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
const lastUpdated = computed(() => !lastUpdatedAt.value ? 'Not yet updated' : lastUpdatedAt.value.toLocaleString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }))

const activeSchoolYear = computed(() => schoolYears.value.find((item: any) => item?.active_sy === true || String(item?.sy_status || '').toLowerCase() === 'active') || null)
const activePeriodLabel = computed(() => activeSchoolYear.value ? [activeSchoolYear.value.semester, activeSchoolYear.value.school_year].filter(Boolean).join(' · ') : 'No Active Period')

const evaluationTypeCode = (evaluation: any) => evaluation?.batch?.evaluation_type?.code || evaluation?.evaluation_type?.code || ''
const getEvaluationTypeByCode = (code: string) => evaluationTypes.value.find((type: any) => type?.code === code) || null
const getScaleMax = (code: string) => { const value = Number(getEvaluationTypeByCode(code)?.max_score); return Number.isFinite(value) && value > 0 ? value : null }
const getScaleLabels = (code: string): Record<string, string> => {
  const raw = getEvaluationTypeByCode(code)?.scale_labels
  if (!raw) return {}
  if (typeof raw === 'string') { try { const parsed = JSON.parse(raw); return parsed && typeof parsed === 'object' ? parsed : {} } catch { return {} } }
  return typeof raw === 'object' ? raw : {}
}
const getEvaluationScore = (evaluation: any) => {
  for (const value of [evaluation?.average_score, evaluation?.average, evaluation?.score, evaluation?.overall_score, evaluation?.total_average]) {
    const parsed = Number(value)
    if (Number.isFinite(parsed) && parsed > 0) return parsed
  }
  const responses = Array.isArray(evaluation?.responses) ? evaluation.responses : []
  const scores = responses.map((response: any) => Number(response?.score ?? response?.rating ?? response?.value)).filter((value: number) => Number.isFinite(value) && value > 0)
  return scores.length ? scores.reduce((sum: number, value: number) => sum + value, 0) / scores.length : 0
}
const getEvaluationSummary = (code: string) => {
  const records = evaluations.value.filter((evaluation: any) => evaluationTypeCode(evaluation) === code)
  const scores = records.map(getEvaluationScore).filter((score: number) => score > 0)
  const average = scores.length ? scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length : 0
  const labels = getScaleLabels(code)
  return { count: records.length, average, maxScore: getScaleMax(code), label: average > 0 ? String(labels[String(Math.round(average))] || '') : '' }
}

const studentFacultySummary = computed(() => getEvaluationSummary('student-faculty'))
const deanFacultySummary = computed(() => getEvaluationSummary('dean-faculty'))
const facultyDeanSummary = computed(() => getEvaluationSummary('faculty-dean-coordinator'))
const evaluationSummaries = computed(() => [
  { code: 'student-faculty', label: 'Student → Faculty', description: 'Student evaluation of faculty', icon: 'i-lucide-graduation-cap', iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400', summary: studentFacultySummary.value, to: '/admin/evaluation/student-faculty' },
  { code: 'dean-faculty', label: 'Dean → Faculty', description: 'Dean evaluation of faculty', icon: 'i-lucide-presentation', iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400', summary: deanFacultySummary.value, to: '/admin/evaluation/dean-faculty' },
  { code: 'faculty-dean-coordinator', label: 'Faculty → Dean', description: 'Faculty evaluation of dean', icon: 'i-lucide-building-2', iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400', summary: facultyDeanSummary.value, to: '/admin/evaluation/faculty-dean' }
])

const faculty = computed(() => teachers.value.filter((teacher: any) => String(teacher?.user?.role?.name || teacher?.user?.role?.type || teacher?.role || '').toLowerCase() === 'faculty'))
const totalStudents = computed(() => students.value.length)
const totalFaculty = computed(() => faculty.value.length)
const totalDepartments = computed(() => departments.value.length)
const totalCourses = computed(() => courses.value.length)
const totalEvaluations = computed(() => evaluations.value.length)

const primaryStats = computed(() => [
  { label: 'Students', value: totalStudents.value.toLocaleString(), description: 'Registered student accounts', icon: 'i-lucide-graduation-cap', iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400', accentClass: 'bg-blue-500', badge: 'Users', footerLabel: 'Student records', footerValue: 'Registered', footerClass: 'text-blue-600 dark:text-blue-400' },
  { label: 'Faculty', value: totalFaculty.value.toLocaleString(), description: 'Registered faculty members', icon: 'i-lucide-users-round', iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400', accentClass: 'bg-emerald-500', badge: 'Personnel', footerLabel: 'Faculty records', footerValue: 'Available', footerClass: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Departments', value: totalDepartments.value.toLocaleString(), description: 'Academic departments', icon: 'i-lucide-building-2', iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400', accentClass: 'bg-violet-500', badge: 'Academic', footerLabel: 'Department records', footerValue: 'Configured', footerClass: 'text-violet-600 dark:text-violet-400' },
  { label: 'Courses', value: totalCourses.value.toLocaleString(), description: 'Configured academic courses', icon: 'i-lucide-book-copy', iconClass: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400', accentClass: 'bg-cyan-500', badge: 'Academic', footerLabel: 'Course records', footerValue: 'Configured', footerClass: 'text-cyan-600 dark:text-cyan-400' },
  { label: 'Active Evaluations', value: totalEvaluations.value.toLocaleString(), description: 'Current academic period', icon: 'i-lucide-clipboard-check', iconClass: 'bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400', accentClass: 'bg-orange-500', badge: 'Current', footerLabel: 'Academic period', footerValue: activeSchoolYear.value ? activePeriodLabel.value : 'Not configured', footerClass: activeSchoolYear.value ? 'text-orange-600 dark:text-orange-400' : 'text-amber-600 dark:text-amber-400' }
])

const studentFacultyEvaluations = computed(() => evaluations.value.filter((evaluation: any) => evaluationTypeCode(evaluation) === 'student-faculty'))
const analyzedEvaluations = computed(() => studentFacultyEvaluations.value.filter((evaluation: any) => ['Positive', 'Neutral', 'Negative'].includes(evaluation.feedback_sentiment)))
const analyzedFeedbackCount = computed(() => analyzedEvaluations.value.length)
const positiveCount = computed(() => analyzedEvaluations.value.filter((e: any) => e.feedback_sentiment === 'Positive').length)
const neutralCount = computed(() => analyzedEvaluations.value.filter((e: any) => e.feedback_sentiment === 'Neutral').length)
const negativeCount = computed(() => analyzedEvaluations.value.filter((e: any) => e.feedback_sentiment === 'Negative').length)
const averageSentimentScore = computed(() => analyzedEvaluations.value.length ? (analyzedEvaluations.value.reduce((sum: number, e: any) => sum + Number(e.feedback_sentiment_score || 0), 0) / analyzedEvaluations.value.length).toFixed(2) : '0.00')
const sentimentScorePercentage = computed(() => Math.min(100, Math.max(0, Math.round(((Number(averageSentimentScore.value) + 1) / 2) * 100))))
const overallSentimentLabel = computed(() => !analyzedFeedbackCount.value ? 'No Sentiment Data' : Number(averageSentimentScore.value) >= 0.25 ? 'Generally Positive' : Number(averageSentimentScore.value) <= -0.25 ? 'Generally Negative' : 'Generally Neutral')
const overallSentimentClass = computed(() => !analyzedFeedbackCount.value ? 'bg-white/10 text-white/60' : Number(averageSentimentScore.value) >= 0.25 ? 'bg-emerald-400/15 text-emerald-300' : Number(averageSentimentScore.value) <= -0.25 ? 'bg-red-400/15 text-red-300' : 'bg-white/10 text-white/70')
const percentage = (value: number) => analyzedFeedbackCount.value ? Math.round((value / analyzedFeedbackCount.value) * 100) : 0
const sentimentDistribution = computed(() => [
  { label: 'Positive', description: 'Favourable and encouraging feedback', count: positiveCount.value, percentage: percentage(positiveCount.value), progressClass: 'bg-emerald-500' },
  { label: 'Neutral', description: 'Balanced or non-emotional feedback', count: neutralCount.value, percentage: percentage(neutralCount.value), progressClass: 'bg-gray-400' },
  { label: 'Negative', description: 'Critical feedback requiring attention', count: negativeCount.value, percentage: percentage(negativeCount.value), progressClass: 'bg-red-500' }
])

const topFaculty = computed(() => {
  const grouped: Record<string, any> = {}
  studentFacultyEvaluations.value.forEach((evaluation: any) => {
    if (!evaluation.teacher) return
    const key = evaluation.teacher.documentId || evaluation.teacher.id
    const score = getEvaluationScore(evaluation)
    if (!key || score <= 0) return
    if (!grouped[key]) grouped[key] = { id: key, name: evaluation.teacher.name || evaluation.teacher.full_name || 'Unknown Faculty', count: 0, totalAverage: 0, average: 0 }
    grouped[key].count += 1
    grouped[key].totalAverage += score
  })
  return Object.values(grouped).map((item: any) => ({ ...item, average: item.count ? Number((item.totalAverage / item.count).toFixed(2)) : 0 })).filter((item: any) => item.count > 0).sort((a: any, b: any) => b.average - a.average).slice(0, 5)
})

const sectionSummary = computed(() => {
  const grouped: Record<string, any> = {}
  studentFacultyEvaluations.value.forEach((evaluation: any) => {
    const responses = Array.isArray(evaluation.responses) ? evaluation.responses : []
    responses.forEach((response: any) => {
      const section = response.section || 'Uncategorized'
      const score = Number(response.score || response.rating || response.value || 0)
      if (!Number.isFinite(score) || score <= 0) return
      if (!grouped[section]) grouped[section] = { section, sectionOrder: Number(response.sectionOrder) || 0, totalScore: 0, items: 0, average: 0 }
      grouped[section].totalScore += score
      grouped[section].items += 1
    })
  })
  return Object.values(grouped).map((item: any) => ({ ...item, average: item.items ? item.totalScore / item.items : 0 })).sort((a: any, b: any) => a.sectionOrder - b.sectionOrder)
})

const getEvaluationType = (evaluation: any) => ({ 'student-faculty': 'Student → Faculty', 'faculty-dean-coordinator': 'Faculty → Dean', 'dean-faculty': 'Dean → Faculty' }[evaluationTypeCode(evaluation)] || 'Other Evaluation')
const recentEvaluations = computed(() => evaluations.value.slice(0, 10).map((evaluation: any) => ({ id: evaluation.documentId || evaluation.id || `${evaluation.createdAt}-${evaluation.average_score}`, target: evaluation.teacher?.name || evaluation.dean_coordinator?.name || 'Unknown', type: getEvaluationType(evaluation), average: getEvaluationScore(evaluation), maxScore: getScaleMax(evaluationTypeCode(evaluation)), sentiment: evaluation.feedback_sentiment || 'Not Analysed', date: formatDate(evaluation.createdAt) })))

const formatDate = (value: string) => value ? new Date(value).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'
const getInitials = (name: string) => name ? name.trim().split(/\s+/).slice(0, 2).map((part: string) => part.charAt(0).toUpperCase()).join('') : 'U'
const rankingClass = (index: number) => index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' : index === 1 ? 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300' : index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
const scorePercentage = (average: number, maxScore: number | null) => maxScore && maxScore > 0 ? Math.min(100, Math.max(0, (Number(average || 0) / maxScore) * 100)) : 0
const sentimentColor = (sentiment: string) => sentiment === 'Positive' ? 'success' : sentiment === 'Negative' ? 'error' : 'neutral'
const evaluationTypeColor = (type: string) => type === 'Student → Faculty' ? 'primary' : type === 'Faculty → Dean' ? 'warning' : type === 'Dean → Faculty' ? 'success' : 'neutral'

const loadDashboard = async () => {
  try {
    loading.value = true
    const [studentResponse, teacherResponse, departmentResponse, courseResponse, schoolYearResponse, evaluationTypeResponse]: any[] = await Promise.all([
      $api('/students', { query: { 'pagination[page]': 1, 'pagination[pageSize]': 1000 } }),
      $api('/teachers', { query: { 'populate[user][populate][role]': true, 'populate[department]': true, 'pagination[page]': 1, 'pagination[pageSize]': 1000 } }),
      $api('/departments', { query: { 'pagination[page]': 1, 'pagination[pageSize]': 1000 } }),
      $api('/courses', { query: { 'pagination[page]': 1, 'pagination[pageSize]': 1000 } }),
      $api('/school-years', { query: { 'sort[0]': 'createdAt:desc', 'pagination[page]': 1, 'pagination[pageSize]': 100 } }),
      $api('/evaluation-types', { query: { 'pagination[page]': 1, 'pagination[pageSize]': 100 } })
    ])
    students.value = studentResponse?.data || []
    teachers.value = teacherResponse?.data || []
    departments.value = departmentResponse?.data || []
    courses.value = courseResponse?.data || []
    schoolYears.value = schoolYearResponse?.data || []
    evaluationTypes.value = evaluationTypeResponse?.data || []

    if (activeSchoolYear.value) {
      const evaluationResponse: any = await $api('/evaluations', { query: {
        'filters[batch][school_year][$eq]': activeSchoolYear.value.school_year,
        'filters[batch][semester][$eq]': activeSchoolYear.value.semester,
        'filters[batch][evaluation_type][code][$in][0]': 'student-faculty',
        'filters[batch][evaluation_type][code][$in][1]': 'dean-faculty',
        'filters[batch][evaluation_type][code][$in][2]': 'faculty-dean-coordinator',
        'populate[teacher]': true,
        'populate[dean_coordinator]': true,
        'populate[batch][populate][evaluation_type]': true,
        'sort[0]': 'createdAt:desc',
        'pagination[page]': 1,
        'pagination[pageSize]': 5000
      } })
      evaluations.value = evaluationResponse?.data || []
    } else evaluations.value = []
    lastUpdatedAt.value = new Date()
  } catch (error: any) {
    console.error('Admin dashboard loading error:', error)
    evaluations.value = []
    toast.add({ title: 'Unable to load dashboard', description: error?.data?.error?.message || error?.message || 'Some dashboard information could not be retrieved.', icon: 'i-lucide-triangle-alert', color: 'error' })
  } finally { loading.value = false }
}

onMounted(loadDashboard)
</script>
