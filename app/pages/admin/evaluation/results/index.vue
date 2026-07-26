<template>
  <div class="space-y-6 pb-10">
    <section class="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7 dark:border-emerald-900">
      <div class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-teal-300/15 blur-3xl" />

      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex min-w-0 items-start gap-4">
          <div class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex">
            <UIcon name="i-lucide-chart-no-axes-combined" class="size-7" />
          </div>

          <div class="min-w-0">
            <div class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-50">
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur">Administrator Portal</span>
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur">Evaluation Analytics</span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Evaluation Results</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Review submitted results from all four evaluation types using one centralised reporting page.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">{{ summary.totalRecords }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">Records</p>
          </div>

          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">{{ summary.totalEvaluators }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">Evaluators</p>
          </div>

          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">{{ summary.averageScore }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">Average</p>
          </div>
        </div>
      </div>
    </section>

    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="grid grid-cols-1 gap-2 p-3 md:grid-cols-2 xl:grid-cols-4">
        <button
          v-for="tab in evaluationTabs"
          :key="tab.value"
          type="button"
          class="flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all"
          :class="
            activeTab === tab.value
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-950'
              : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-emerald-950/20'
          "
          @click="changeTab(tab.value)"
        >
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-xl"
            :class="
              activeTab === tab.value
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
            "
          >
            <UIcon :name="tab.icon" class="size-4.5" />
          </div>

          <div class="min-w-0">
            <p class="truncate text-sm font-bold">{{ tab.label }}</p>
            <p class="mt-0.5 text-[10px] opacity-70">{{ tab.description }}</p>
          </div>
        </button>
      </div>
    </section>

    <div v-if="loading" class="space-y-5">
      <USkeleton class="h-24 w-full rounded-2xl" />
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <USkeleton v-for="index in 6" :key="index" class="h-80 w-full rounded-2xl" />
      </div>
    </div>

    <section
      v-else-if="loadError"
      class="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <div class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
        <UIcon name="i-lucide-triangle-alert" class="size-7" />
      </div>

      <h2 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">Unable to load evaluation results</h2>
      <p class="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400">{{ loadError }}</p>

      <UButton class="mt-5" icon="i-lucide-refresh-cw" :loading="loading" @click="loadCurrentTab">
        Try Again
      </UButton>
    </section>

    <template v-else>
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Records" :value="summary.totalRecords" icon="i-lucide-files" tone="blue" />
        <SummaryCard title="Unique Evaluators" :value="summary.totalEvaluators" icon="i-lucide-users-round" tone="violet" />
        <SummaryCard title="Evaluated Targets" :value="summary.totalTargets" icon="i-lucide-user-round-check" tone="amber" />
        <SummaryCard title="Average Score" :value="`${summary.averageScore} / ${currentScale}`" icon="i-lucide-chart-no-axes-combined" tone="emerald" />
      </section>

      <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 class="text-sm font-bold text-gray-900 dark:text-white">{{ currentTabLabel }} Results</h2>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Search and filter submitted evaluation records.</p>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[240px_200px_190px_190px]">
            <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Search records..." class="w-full" />
            <USelectMenu v-model="selectedDepartment" :items="departmentOptions" value-key="value" class="w-full" />
            <USelectMenu v-model="selectedSemester" :items="semesterOptions" value-key="value" class="w-full" />
            <USelectMenu v-model="selectedSchoolYear" :items="schoolYearOptions" value-key="value" class="w-full" />
          </div>
        </div>

        <div
          v-if="hasActiveFilters"
          class="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-800"
        >
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Active filters:</span>

          <UBadge v-if="searchQuery" color="neutral" variant="subtle">Search: {{ searchQuery }}</UBadge>
          <UBadge v-if="selectedDepartment !== 'all'" color="primary" variant="subtle">{{ selectedDepartment }}</UBadge>
          <UBadge v-if="selectedSemester !== 'all'" color="success" variant="subtle">{{ selectedSemester }}</UBadge>
          <UBadge v-if="selectedSchoolYear !== 'all'" color="info" variant="subtle">{{ selectedSchoolYear }}</UBadge>

          <UButton color="neutral" variant="ghost" size="xs" icon="i-lucide-x" @click="clearFilters">
            Clear filters
          </UButton>
        </div>
      </section>

      <section
        v-if="!groupedResults.length"
        class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-900"
      >
        <div class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
          <UIcon :name="records.length ? 'i-lucide-search-x' : 'i-lucide-file-chart-column'" class="size-8" />
        </div>

        <h2 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
          {{ records.length ? 'No matching records found' : 'No evaluation results available' }}
        </h2>

        <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
          {{
            records.length
              ? 'Try changing or clearing the current search and filters.'
              : `No submitted ${currentTabLabel.toLowerCase()} records were found.`
          }}
        </p>
      </section>

      <section v-else class="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="group in paginatedGroups"
          :key="group.key"
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="relative overflow-hidden px-4 py-4 text-white" :class="currentTabHeaderClass">
            <div class="pointer-events-none absolute -right-10 -top-14 size-36 rounded-full bg-white/10 blur-3xl" />

            <div class="relative flex items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <div class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 font-bold">
                  {{ createInitials(group.name) }}
                </div>

                <div class="min-w-0">
                  <p class="text-[9px] font-semibold uppercase tracking-[0.14em] opacity-80">
                    {{ currentTabLabel }}
                  </p>

                  <h2 class="mt-0.5 truncate text-base font-bold">
                    {{ group.name }}
                  </h2>

                  <p class="mt-0.5 truncate text-[11px] text-slate-300">
                    {{ group.department }}
                  </p>
                </div>
              </div>

              <UBadge color="success" variant="solid" size="sm" class="shrink-0">
                {{ group.recordCount }}
                record{{ group.recordCount === 1 ? '' : 's' }}
              </UBadge>
            </div>
          </div>

          <div class="space-y-4 p-4">
            <div class="grid grid-cols-2 gap-2">
              <InfoCell label="Evaluations" :value="group.recordCount" />
              <InfoCell label="Evaluators" :value="group.evaluatorCount" />
              <InfoCell
                :label="activeTab === 'student-faculty' ? 'Subjects' : 'Periods'"
                :value="activeTab === 'student-faculty' ? group.subjectCount : group.schoolYears.length"
              />
              <InfoCell
                label="Latest Record"
                :value="formatDate(getEvaluationDate(group.latestRecord))"
              />
            </div>

            <div
              class="rounded-xl border p-4"
              :class="getScoreContainerClass(group.averageScore)"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                    Consolidated Average
                  </p>

                  <div class="mt-1 flex items-end gap-1.5">
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">
                      {{ formatScore(group.averageScore) }}
                    </p>

                    <span class="mb-1 text-xs font-medium text-gray-400">
                      / {{ currentScale }}
                    </span>
                  </div>

                  <UBadge
                    :color="getScoreColor(group.averageScore)"
                    variant="subtle"
                    size="sm"
                    class="mt-1.5"
                  >
                    {{ getScoreLabel(group.averageScore) }}
                  </UBadge>
                </div>

                <UIcon
                  name="i-lucide-chart-no-axes-combined"
                  class="size-8"
                  :class="getScoreIconClass(group.averageScore)"
                />
              </div>
            </div>

            <div class="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-800">
              <p class="text-[10px] text-gray-400">
                {{ group.schoolYears.join(', ') || 'No academic period' }}
              </p>

              <UButton
                color="neutral"
                variant="soft"
                size="xs"
                trailing-icon="i-lucide-chevron-right"
                @click="openDetails(group)"
              >
                View Records
              </UButton>
            </div>
          </div>
        </article>
      </section>

      <section
        v-if="groupedResults.length > itemsPerPage"
        class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900"
      >
        <p class="text-center text-xs text-gray-500 sm:text-left dark:text-gray-400">
          Showing {{ paginationStart }}–{{ paginationEnd }} of {{ groupedResults.length }} grouped results
        </p>

        <div class="flex items-center justify-center gap-2">
          <UButton color="neutral" variant="outline" icon="i-lucide-chevron-left" square :disabled="page === 1" @click="previousPage" />

          <div class="min-w-28 rounded-xl bg-gray-100 px-3 py-2 text-center text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            Page {{ page }} of {{ totalPages }}
          </div>

          <UButton color="neutral" variant="outline" icon="i-lucide-chevron-right" square :disabled="page === totalPages" @click="nextPage" />
        </div>
      </section>
    </template>

    <UModal v-model:open="detailsOpen">
      <template #content>
        <div
          v-if="selectedRecord"
          class="relative max-h-[85vh] overflow-y-auto rounded-[28px] border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="relative overflow-hidden rounded-t-[28px] px-6 py-6 text-white" :class="currentTabHeaderClass">
            <div class="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-white/10 blur-3xl" />

            <div class="relative flex items-start justify-between gap-4">
              <div class="flex min-w-0 items-center gap-4">
                <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                  <UIcon :name="currentTabIcon" class="size-6" />
                </div>

                <div class="min-w-0">
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">{{ currentTabLabel }}</p>
                  <h2 class="mt-1 truncate text-xl font-bold">{{ getRecordTitle(selectedRecord) }}</h2>
                  <p class="mt-1 truncate text-xs text-slate-300">{{ getRecordSubtitle(selectedRecord) }}</p>
                </div>
              </div>

              <UButton color="neutral" variant="ghost" icon="i-lucide-x" square class="text-white hover:bg-white/10" @click="detailsOpen = false" />
            </div>
          </div>

          <div class="space-y-5 p-6">
            <section
              v-if="selectedGroup?.records?.length"
              class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <div class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                      {{ selectedGroup.name }}
                    </h3>

                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {{ selectedGroup.recordCount }}
                      evaluation record{{ selectedGroup.recordCount === 1 ? '' : 's' }}
                    </p>
                  </div>

                  <UBadge color="success" variant="subtle">
                    Average: {{ formatScore(selectedGroup.averageScore) }}
                  </UBadge>
                </div>
              </div>

              <div class="max-h-60 divide-y divide-gray-200 overflow-y-auto dark:divide-gray-800">
                <button
                  v-for="(record, index) in selectedGroup.records"
                  :key="getRecordKey(record)"
                  type="button"
                  class="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-950/40"
                  :class="
                    getRecordKey(selectedRecord) === getRecordKey(record)
                      ? 'bg-emerald-50 dark:bg-emerald-950/20'
                      : ''
                  "
                  @click="selectGroupRecord(record)"
                >
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      Record {{ index + 1 }}
                    </p>

                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {{ getSemester(record) }} ·
                      {{ getSchoolYear(record) }} ·
                      {{ formatDate(getEvaluationDate(record)) }}
                    </p>
                  </div>

                  <UBadge
                    :color="getScoreColor(getDisplayScore(record))"
                    variant="subtle"
                  >
                    {{ formatScore(getDisplayScore(record)) }}
                  </UBadge>
                </button>
              </div>
            </section>

            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <InfoCell label="Semester" :value="getSemester(selectedRecord)" />
              <InfoCell label="School Year" :value="getSchoolYear(selectedRecord)" />
              <InfoCell label="Date" :value="formatDate(getEvaluationDate(selectedRecord))" />
              <InfoCell label="Average" :value="`${formatScore(getDisplayScore(selectedRecord))}/${currentScale}`" tone="emerald" />
            </div>

            <div
              v-for="feedback in getFeedbackSections(selectedRecord)"
              :key="feedback.label"
              class="rounded-2xl border p-4"
              :class="feedback.class"
            >
              <h3 class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <UIcon :name="feedback.icon" class="size-4" />
                {{ feedback.label }}
              </h3>

              <p class="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400">
                {{ feedback.value }}
              </p>
            </div>

            <div
              v-if="getResponses(selectedRecord).length"
              class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <div class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">Recorded Responses</h3>
              </div>

              <div class="divide-y divide-gray-200 dark:divide-gray-800">
                <div
                  v-for="(response, index) in getResponses(selectedRecord)"
                  :key="response.criterionId || index"
                  class="flex items-start justify-between gap-4 px-4 py-3"
                >
                  <div class="flex min-w-0 items-start gap-3">
                    <span class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {{ index + 1 }}
                    </span>

                    <p class="text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {{ response.question || `Criterion ${index + 1}` }}
                    </p>
                  </div>

                  <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    {{ response.score }}
                  </span>
                </div>
              </div>
            </div>

            <div v-else class="rounded-2xl border border-dashed border-gray-300 px-5 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              Detailed criterion responses are unavailable.
            </div>

            <div class="flex justify-end">
              <UButton color="neutral" variant="soft" @click="detailsOpen = false">Close</UButton>
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
  role: ['Admin']
})

const { $api } = useNuxtApp()
const toast = useToast()

const SummaryCard = defineComponent({
  props: {
    title: String,
    value: [String, Number],
    icon: String,
    tone: {
      type: String,
      default: 'blue'
    }
  },
  setup(props) {
    const classes = computed(() => {
      const map: Record<string, string> = {
        blue: 'border-blue-100 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20',
        violet: 'border-violet-100 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/20',
        amber: 'border-amber-100 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20',
        emerald: 'border-emerald-100 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20'
      }

      return map[props.tone] || map.blue
    })

    return () =>
      h(
        'div',
        {
          class: [
            'rounded-2xl border p-5',
            classes.value
          ]
        },
        [
          h(
            'div',
            {
              class: 'flex items-center justify-between'
            },
            [
              h('div', {}, [
                h(
                  'p',
                  {
                    class: 'text-xs font-medium text-gray-500 dark:text-gray-400'
                  },
                  props.title
                ),
                h(
                  'p',
                  {
                    class: 'mt-2 text-2xl font-bold text-gray-900 dark:text-white'
                  },
                  String(props.value ?? '')
                )
              ]),
              h(
                resolveComponent('UIcon'),
                {
                  name: props.icon,
                  class: 'size-6'
                }
              )
            ]
          )
        ]
      )
  }
})

const InfoCell = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    tone: {
      type: String,
      default: 'neutral'
    }
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class:
            props.tone === 'emerald'
              ? 'rounded-xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/20'
              : 'rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40'
        },
        [
          h(
            'p',
            {
              class: 'text-[10px] uppercase text-gray-400'
            },
            props.label
          ),
          h(
            'p',
            {
              class:
                props.tone === 'emerald'
                  ? 'mt-1 truncate text-xs font-bold text-emerald-700 dark:text-emerald-400'
                  : 'mt-1 truncate text-xs font-bold text-gray-800 dark:text-gray-200'
            },
            String(props.value ?? '')
          )
        ]
      )
  }
})

const evaluationTabs = [
  {
    label: 'Student – Faculty',
    value: 'student-faculty',
    icon: 'i-lucide-graduation-cap',
    description: 'Student ratings of faculty'
  },
  {
    label: 'Faculty – Dean',
    value: 'faculty-dean-coordinator',
    icon: 'i-lucide-building-2',
    description: 'Faculty ratings of deans'
  },
  {
    label: 'Dean – Faculty',
    value: 'dean-to-faculty',
    icon: 'i-lucide-presentation',
    description: 'Dean ratings of faculty'
  },
  {
    label: 'Overall Feedback',
    value: 'student-school',
    icon: 'i-lucide-message-square-text',
    description: 'Student school feedback'
  }
]

const activeTab = ref('student-faculty')
const records = ref<any[]>([])
const loading = ref(true)
const loadError = ref('')

const searchQuery = ref('')
const selectedDepartment = ref('all')
const selectedSemester = ref('all')
const selectedSchoolYear = ref('all')

const page = ref(1)
const itemsPerPage = 6

const detailsOpen = ref(false)
const selectedGroup = ref<any>(null)
const selectedRecord = ref<any>(null)

const currentTab = computed(() => {
  return evaluationTabs.find(tab => tab.value === activeTab.value) || evaluationTabs[0]
})

const currentTabLabel = computed(() => currentTab.value.label)
const currentTabIcon = computed(() => currentTab.value.icon)

const currentScale = computed(() => {
  return ['faculty-dean-coordinator', 'dean-to-faculty'].includes(activeTab.value)
    ? 4
    : 5
})

const currentTabHeaderClass = computed(() => {
  if (activeTab.value === 'student-faculty') {
    return 'bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950'
  }

  if (activeTab.value === 'faculty-dean-coordinator') {
    return 'bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950'
  }

  if (activeTab.value === 'dean-to-faculty') {
    return 'bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950'
  }

  return 'bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950'
})

const summary = computed(() => {
  const scores = records.value.map(getDisplayScore).filter(score => score > 0)

  const evaluators = new Set(
    records.value.map(getEvaluatorKey).filter(Boolean)
  )

  const targets = new Set(
    records.value.map(getTargetKey).filter(Boolean)
  )

  return {
    totalRecords: records.value.length,
    totalEvaluators: evaluators.size,
    totalTargets: targets.size,
    averageScore:
      scores.length
        ? (
            scores.reduce((sum, score) => sum + score, 0) /
            scores.length
          ).toFixed(2)
        : '0.00'
  }
})

const departmentOptions = computed(() =>
  makeOptions(
    records.value.map(getDepartment),
    'All Departments'
  )
)

const semesterOptions = computed(() =>
  makeOptions(
    records.value.map(getSemester),
    'All Semesters'
  )
)

const schoolYearOptions = computed(() => {
  const options = makeOptions(
    records.value.map(getSchoolYear),
    'All School Years'
  )

  return [
    options[0],
    ...options.slice(1).sort((a, b) =>
      String(b.value).localeCompare(String(a.value))
    )
  ]
})

const filteredRecords = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return records.value.filter(record => {
    const searchable = [
      getRecordTitle(record),
      getRecordSubtitle(record),
      getDepartment(record),
      getEvaluatorName(record),
      getTargetName(record),
      getPrimaryFeedback(record)
    ]
      .join(' ')
      .toLowerCase()

    return (
      (!query || searchable.includes(query)) &&
      (selectedDepartment.value === 'all' ||
        getDepartment(record) === selectedDepartment.value) &&
      (selectedSemester.value === 'all' ||
        getSemester(record) === selectedSemester.value) &&
      (selectedSchoolYear.value === 'all' ||
        getSchoolYear(record) === selectedSchoolYear.value)
    )
  })
})

const groupedResults = computed(() => {
  const groups = new Map<string, any>()

  filteredRecords.value.forEach((record: any) => {
    const key = String(getGroupKey(record))
    const name = getTargetName(record)

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        name,
        department: getDepartment(record),
        records: [],
        evaluatorKeys: new Set<string>(),
        semesterValues: new Set<string>(),
        schoolYearValues: new Set<string>()
      })
    }

    const group = groups.get(key)

    group.records.push(record)

    const evaluatorKey = getEvaluatorKey(record)

    if (evaluatorKey) {
      group.evaluatorKeys.add(evaluatorKey)
    }

    const semester = getSemester(record)
    const schoolYear = getSchoolYear(record)

    if (semester && semester !== 'Not specified') {
      group.semesterValues.add(semester)
    }

    if (schoolYear && schoolYear !== 'Not specified') {
      group.schoolYearValues.add(schoolYear)
    }
  })

  return Array.from(groups.values())
    .map(group => {
      const scores = group.records
        .map((record: any) => getDisplayScore(record))
        .filter((score: number) => score > 0)

      const subjectValues = new Set(
        group.records
          .map((record: any) => {
            const subject = record?.subject

            return (
              subject?.documentId ||
              subject?.id ||
              subject?.code ||
              subject?.name ||
              ''
            )
          })
          .filter(Boolean)
      )

      return {
        ...group,
        recordCount: group.records.length,
        evaluatorCount: group.evaluatorKeys.size,
        subjectCount: subjectValues.size,
        averageScore:
          scores.length
            ? scores.reduce(
                (sum: number, score: number) => sum + score,
                0
              ) / scores.length
            : 0,
        semesters: Array.from(group.semesterValues),
        schoolYears: Array.from(group.schoolYearValues),
        latestRecord: [...group.records].sort(
          (a: any, b: any) =>
            new Date(getEvaluationDate(b) || 0).getTime() -
            new Date(getEvaluationDate(a) || 0).getTime()
        )[0]
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
})

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(groupedResults.value.length / itemsPerPage)
  )
)

const paginatedGroups = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return groupedResults.value.slice(start, start + itemsPerPage)
})

const paginationStart = computed(() =>
  groupedResults.value.length
    ? (page.value - 1) * itemsPerPage + 1
    : 0
)

const paginationEnd = computed(() =>
  Math.min(page.value * itemsPerPage, groupedResults.value.length)
)

const hasActiveFilters = computed(() =>
  Boolean(
    searchQuery.value ||
    selectedDepartment.value !== 'all' ||
    selectedSemester.value !== 'all' ||
    selectedSchoolYear.value !== 'all'
  )
)

const makeOptions = (values: any[], allLabel: string) => {
  const unique = Array.from(
    new Set(
      values.filter(value =>
        value &&
        value !== 'Not specified'
      )
    )
  ).sort()

  return [
    {
      label: allLabel,
      value: 'all'
    },
    ...unique.map(value => ({
      label: value,
      value
    }))
  ]
}

const getRecordKey = (record: any) =>
  record?.documentId ||
  record?.id ||
  JSON.stringify(record)

const getEvaluatorKey = (record: any) =>
  String(
    record?.evaluator_user?.documentId ||
    record?.evaluator_user?.id ||
    record?.student?.documentId ||
    record?.student?.id ||
    record?.createdBy?.id ||
    ''
  )

const getTargetKey = (record: any) =>
  String(
    record?.teacher?.documentId ||
    record?.teacher?.id ||
    record?.dean_coordinator?.documentId ||
    record?.dean_coordinator?.id ||
    record?.department?.documentId ||
    record?.department?.id ||
    record?.batch?.department ||
    ''
  )

const getEvaluatorName = (record: any) =>
  record?.evaluator_user?.name ||
  record?.evaluator_user?.full_name ||
  record?.evaluator_user?.username ||
  record?.student?.name ||
  record?.student?.full_name ||
  'Anonymous Evaluator'

const getTargetName = (record: any) => {
  if (activeTab.value === 'student-faculty') {
    return (
      record?.teacher?.name ||
      record?.teacher?.full_name ||
      'Faculty Member'
    )
  }

  if (activeTab.value === 'faculty-dean-coordinator') {
    return (
      record?.dean_coordinator?.name ||
      record?.dean_coordinator?.full_name ||
      'Dean/Coordinator'
    )
  }

  if (activeTab.value === 'dean-to-faculty') {
    return (
      record?.teacher?.name ||
      record?.teacher?.full_name ||
      'Faculty Member'
    )
  }

  return (
    record?.service?.name ||
    record?.category?.name ||
    record?.batch?.department ||
    'School Performance'
  )
}


const getGroupKey = (record: any) => {
  if (activeTab.value === 'student-school') {
    return (
      record?.department?.documentId ||
      record?.department?.id ||
      getDepartment(record)
    )
  }

  return (
    record?.teacher?.documentId ||
    record?.teacher?.id ||
    record?.dean_coordinator?.documentId ||
    record?.dean_coordinator?.id ||
    getTargetName(record)
  )
}

const createInitials = (value: string) => {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')
}

const getRecordTitle = (record: any) => {
  if (activeTab.value === 'student-faculty') {
    const subject = record?.subject

    if (subject?.code && subject?.name) {
      return `${subject.code} - ${subject.name}`
    }

    return subject?.name || subject?.code || getTargetName(record)
  }

  return getTargetName(record)
}

const getRecordSubtitle = (record: any) => {
  if (activeTab.value === 'student-faculty') {
    return getTargetName(record)
  }

  if (activeTab.value === 'student-school') {
    return 'Overall School Feedback'
  }

  return getEvaluatorName(record)
}

const getDepartment = (record: any) =>
  record?.teacher?.department?.name ||
  record?.dean_coordinator?.department?.name ||
  record?.department?.name ||
  record?.batch?.department ||
  record?.course?.department?.name ||
  'Not specified'

const getSemester = (record: any) =>
  record?.batch?.semester ||
  record?.semester ||
  'Not specified'

const getSchoolYear = (record: any) =>
  record?.batch?.school_year ||
  record?.school_year ||
  'Not specified'

const getEvaluationDate = (record: any) =>
  record?.batch?.date ||
  record?.date ||
  record?.submittedAt ||
  record?.createdAt

const getResponses = (record: any) => {
  const raw =
    record?.responses ||
    record?.ratings ||
    record?.answers

  if (!raw) return []

  if (Array.isArray(raw)) {
    return raw.map((response: any, index: number) => ({
      criterionId:
        response.criterion_id ||
        response.criterionId ||
        response.id ||
        index,
      question:
        response.question ||
        response.statement ||
        response.label ||
        '',
      score: Number(
        response.score ??
        response.value ??
        response.rating
      )
    }))
  }

  if (typeof raw === 'object') {
    return Object.entries(raw).map(([criterionId, score]) => ({
      criterionId,
      question: '',
      score: Number(score)
    }))
  }

  return []
}

const getRawAverageScore = (record: any) => {
  const direct = Number(
    record?.average_score ??
    record?.average ??
    record?.score ??
    record?.overall_score
  )

  if (Number.isFinite(direct) && direct > 0) {
    return direct
  }

  const scores = getResponses(record)
    .map(response => Number(response.score))
    .filter(score => Number.isFinite(score))

  if (!scores.length) return 0

  return scores.reduce((sum, score) => sum + score, 0) / scores.length
}

const getDisplayScore = (record: any) =>
  getRawAverageScore(record)

const getPrimaryFeedback = (record: any) =>
  record?.comment ||
  record?.feedback ||
  record?.strengths ||
  record?.effectiveness ||
  record?.areas_for_improvement ||
  record?.suggested_activities ||
  record?.remarks ||
  record?.suggestion ||
  ''

const getFeedbackSections = (record: any) => {
  const sections = [
    {
      label: 'Strengths',
      value: record?.strengths,
      icon: 'i-lucide-thumbs-up',
      class: 'border-emerald-100 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20'
    },
    {
      label: 'Ways to Be More Effective',
      value: record?.effectiveness,
      icon: 'i-lucide-zap',
      class: 'border-blue-100 bg-blue-50/60 dark:border-blue-900 dark:bg-blue-950/20'
    },
    {
      label: 'Areas for Improvement',
      value:
        record?.areas_for_improvement ||
        record?.areasForImprovement,
      icon: 'i-lucide-lightbulb',
      class: 'border-amber-100 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/20'
    },
    {
      label: 'Suggested Activities',
      value:
        record?.suggested_activities ||
        record?.suggestedActivities,
      icon: 'i-lucide-graduation-cap',
      class: 'border-cyan-100 bg-cyan-50/60 dark:border-cyan-900 dark:bg-cyan-950/20'
    },
    {
      label: 'Comment',
      value:
        record?.comment ||
        record?.feedback ||
        record?.remarks,
      icon: 'i-lucide-message-square-text',
      class: 'border-violet-100 bg-violet-50/60 dark:border-violet-900 dark:bg-violet-950/20'
    }
  ]

  return sections.filter(section =>
    String(section.value || '').trim()
  )
}

const getRecordReference = (record: any) => {
  const value = record?.documentId || record?.id
  return value ? String(value).slice(-8) : 'N/A'
}

const formatDate = (value: any) => {
  if (!value) return 'Not specified'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatScore = (score: number) =>
  score ? Number(score).toFixed(2) : '0.00'

const getScoreLabel = (score: number) => {
  if (currentScale.value === 4) {
    if (score >= 3.5) return 'Excellent'
    if (score >= 2.5) return 'Satisfactory'
    if (score >= 1.5) return 'Fair'
    if (score > 0) return 'Needs Improvement'
    return 'No Score'
  }

  if (score >= 4.5) return 'Outstanding'
  if (score >= 3.5) return 'Excellent'
  if (score >= 2.5) return 'Satisfactory'
  if (score > 0) return 'Needs Improvement'
  return 'No Score'
}

const getScoreColor = (score: number) => {
  if (currentScale.value === 4) {
    if (score >= 3.5) return 'success'
    if (score >= 2.5) return 'primary'
    if (score >= 1.5) return 'warning'
    return 'error'
  }

  if (score >= 4.5) return 'success'
  if (score >= 3.5) return 'primary'
  if (score >= 2.5) return 'warning'
  return 'error'
}

const getThresholds = () => {
  return currentScale.value === 4
    ? [3.5, 2.5, 1.5]
    : [4.5, 3.5, 2.5]
}

const getScoreContainerClass = (score: number) => {
  const [positive, medium, warning] = getThresholds()

  if (score >= positive) {
    return [
      'border-emerald-100',
      'bg-emerald-50/70',
      'dark:border-emerald-900',
      'dark:bg-emerald-950/20'
    ]
  }

  if (score >= medium) {
    return [
      'border-blue-100',
      'bg-blue-50/70',
      'dark:border-blue-900',
      'dark:bg-blue-950/20'
    ]
  }

  if (score >= warning) {
    return [
      'border-amber-100',
      'bg-amber-50/70',
      'dark:border-amber-900',
      'dark:bg-amber-950/20'
    ]
  }

  return [
    'border-red-100',
    'bg-red-50/70',
    'dark:border-red-900',
    'dark:bg-red-950/20'
  ]
}

const getScoreIconClass = (score: number) => {
  const [positive, medium, warning] = getThresholds()

  if (score >= positive) return 'text-emerald-500'
  if (score >= medium) return 'text-blue-500'
  if (score >= warning) return 'text-amber-500'
  return 'text-red-500'
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedDepartment.value = 'all'
  selectedSemester.value = 'all'
  selectedSchoolYear.value = 'all'
  page.value = 1
}

const changeTab = async (value: string) => {
  if (activeTab.value === value) return

  activeTab.value = value
  clearFilters()
  detailsOpen.value = false
  selectedGroup.value = null
  selectedRecord.value = null

  await loadCurrentTab()
}

const openDetails = (group: any) => {
  selectedGroup.value = group
  selectedRecord.value =
    group.latestRecord ||
    group.records?.[0] ||
    null

  detailsOpen.value = true
}

const selectGroupRecord = (record: any) => {
  selectedRecord.value = record
}

const previousPage = async () => {
  if (page.value <= 1) return
  page.value -= 1
  await scrollToTop()
}

const nextPage = async () => {
  if (page.value >= totalPages.value) return
  page.value += 1
  await scrollToTop()
}

const scrollToTop = async () => {
  await nextTick()

  if (!import.meta.client) return

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const getEvaluationRecords = async () => {
  const response = await $api('/evaluations', {
    query: {
      'filters[batch][evaluation_type][code][$eq]':
        activeTab.value,

      'populate[teacher][populate][department]':
        true,

      'populate[dean_coordinator][populate][department]':
        true,

      'populate[subject][populate][course]':
        true,

      'populate[evaluator_user]':
        true,

      'populate[batch][populate][evaluation_type]':
        true,

      'sort[0]':
        'createdAt:desc',

      'pagination[pageSize]':
        1000
    }
  })

  records.value = response.data || []
}

const getOverallFeedbackRecords = async () => {
  const response = await $api('/overall-feedbacks', {
    query: {
      'populate[evaluator_user]':
        true,

      'populate[department]':
        true,

      'populate[batch][populate][evaluation_type]':
        true,

      'sort[0]':
        'createdAt:desc',

      'pagination[pageSize]':
        1000
    }
  })

  records.value = response.data || []
}

const loadCurrentTab = async () => {
  try {
    loading.value = true
    loadError.value = ''

    if (activeTab.value === 'student-school') {
      await getOverallFeedbackRecords()
    } else {
      await getEvaluationRecords()
    }

    page.value = 1
  } catch (error: any) {
    console.error('Admin evaluation results loading error:', error)

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to load evaluation results.'

    toast.add({
      title: 'Unable to load results',
      description: loadError.value,
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

watch(
  [
    searchQuery,
    selectedDepartment,
    selectedSemester,
    selectedSchoolYear
  ],
  () => {
    page.value = 1
  }
)

watch(
  () => totalPages.value,
  value => {
    if (page.value > value) {
      page.value = value
    }
  }
)

onMounted(() => {
  loadCurrentTab()
})
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
