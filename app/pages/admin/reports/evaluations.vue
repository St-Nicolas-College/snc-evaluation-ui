<template>
  <div class="space-y-6 pb-10">
    <!-- HERO -->
    <section
      class="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7"
    >
      <div class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-teal-300/15 blur-3xl" />

      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex min-w-0 items-start gap-4">
          <div class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex">
            <UIcon name="i-lucide-file-chart-column" class="size-7" />
          </div>

          <div class="min-w-0">
            <div class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-50">
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">Administrator Portal</span>
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">Evaluation Reports</span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Consolidated Evaluation Reports
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Generate grouped summaries, criterion results, respondent records,
              sentiment analysis, and PDF reports for every evaluation type.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">{{ summary.totalTargets }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">Groups</p>
          </div>

          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">{{ summary.totalEvaluations }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">Evaluations</p>
          </div>

          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">{{ summary.averageScore }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">Average</p>
          </div>
        </div>
      </div>
    </section>

    <!-- EVALUATION TYPE -->
    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 xl:grid-cols-4">
        <button
          v-for="type in evaluationTypes"
          :key="type.value"
          type="button"
          class="flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition"
          :class="
            activeType === type.value
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-950'
              : 'border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-gray-700 dark:text-gray-300'
          "
          @click="changeType(type.value)"
        >
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-xl"
            :class="activeType === type.value ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'"
          >
            <UIcon :name="type.icon" class="size-5" />
          </div>

          <div class="min-w-0">
            <p class="truncate text-sm font-bold">{{ type.label }}</p>
            <p class="mt-0.5 truncate text-[10px] opacity-70">{{ type.description }}</p>
          </div>
        </button>
      </div>
    </section>

    <!-- KPI -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Evaluation Groups" :value="summary.totalTargets" icon="i-lucide-users-round" tone="blue" />
      <KpiCard label="Evaluation Records" :value="summary.totalEvaluations" icon="i-lucide-files" tone="violet" />
      <KpiCard :label="currentType.evaluatorLabel" :value="summary.totalEvaluators" icon="i-lucide-user-round-check" tone="amber" />
      <KpiCard label="Overall Average" :value="`${summary.averageScore} / 5`" icon="i-lucide-chart-no-axes-combined" tone="emerald" />
    </section>

    <!-- FILTERS -->
    <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 class="text-sm font-bold text-gray-900 dark:text-white">
            {{ currentType.label }} Report
          </h2>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Search and filter grouped evaluation results.
          </p>

          <div class="mt-3 flex flex-wrap gap-2">
            <UBadge v-if="activeSemester !== 'all'" color="success" variant="subtle" icon="i-lucide-calendar-range">
              Current Semester: {{ activeSemester }}
            </UBadge>
            <UBadge v-if="activeSchoolYear !== 'all'" color="warning" variant="subtle" icon="i-lucide-graduation-cap">
              Current School Year: {{ activeSchoolYear }}
            </UBadge>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-lucide-file-search"
            :loading="isGeneratingPdf && pdfAction === 'preview'"
            :disabled="isGeneratingPdf || !filteredGroups.length"
            @click="previewPdfReport"
          >
            Preview PDF
          </UButton>

          <UButton
            color="primary"
            icon="i-lucide-download"
            :loading="isGeneratingPdf && pdfAction === 'download'"
            :disabled="isGeneratingPdf || !filteredGroups.length"
            @click="downloadPdfReport"
          >
            Download PDF
          </UButton>
        </div>
      </div>

      <div class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.2fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(170px,0.9fr)_minmax(170px,0.9fr)]">
        <UInput v-model="searchQuery" icon="i-lucide-search" :placeholder="`Search ${currentType.targetLabel.toLowerCase()}...`" class="w-full" />

        <USelectMenu v-model="selectedTarget" :items="targetOptions" value-key="value" class="w-full" />
        <USelectMenu v-model="selectedDepartment" :items="departmentOptions" value-key="value" class="w-full" />
        <USelectMenu v-model="selectedSemester" :items="semesterOptions" value-key="value" class="w-full" />
        <USelectMenu v-model="selectedSchoolYear" :items="schoolYearOptions" value-key="value" class="w-full" />
      </div>

      <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-800">
        <span class="text-xs font-medium text-gray-500">Active filters:</span>
        <UBadge v-if="searchQuery" color="neutral" variant="subtle">Search: {{ searchQuery }}</UBadge>
        <UBadge v-if="selectedTarget !== 'all'" color="primary" variant="subtle">{{ getSelectedLabel(targetOptions, selectedTarget) }}</UBadge>
        <UBadge v-if="selectedDepartment !== 'all'" color="info" variant="subtle">{{ selectedDepartment }}</UBadge>
        <UBadge v-if="selectedSemester !== 'all'" color="success" variant="subtle">{{ selectedSemester }}</UBadge>
        <UBadge v-if="selectedSchoolYear !== 'all'" color="warning" variant="subtle">{{ selectedSchoolYear }}</UBadge>

        <UButton color="neutral" variant="ghost" size="xs" icon="i-lucide-x" @click="clearFilters">
          Clear filters
        </UButton>
      </div>
    </section>

    <!-- LOADING / ERROR -->
    <div v-if="pending" class="space-y-4">
      <USkeleton class="h-20 w-full rounded-2xl" />
      <USkeleton class="h-[520px] w-full rounded-2xl" />
    </div>

    <section
      v-else-if="loadError"
      class="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <UIcon name="i-lucide-triangle-alert" class="mx-auto size-9 text-red-600" />
      <h2 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">Unable to load report</h2>
      <p class="mx-auto mt-2 max-w-lg text-sm text-gray-500">{{ loadError }}</p>
      <UButton class="mt-5" icon="i-lucide-refresh-cw" @click="getResults">Try Again</UButton>
    </section>

    <!-- GROUPED TABLE -->
    <section
      v-else
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between dark:border-gray-800">
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Grouped Evaluation Results</h2>
          <p class="mt-1 text-sm text-gray-500">
            Showing {{ filteredGroups.length }} group{{ filteredGroups.length === 1 ? '' : 's' }}
            from {{ filteredEvaluationRecords.length }} evaluation record{{ filteredEvaluationRecords.length === 1 ? '' : 's' }}.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <USelect v-model="pageSize" :items="pageSizeOptions" class="w-32" />
        </div>
      </div>

      <div v-if="!filteredGroups.length" class="px-6 py-16 text-center">
        <UIcon name="i-lucide-file-chart-column" class="mx-auto size-10 text-gray-400" />
        <h3 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">No evaluation results available</h3>
        <p class="mt-2 text-sm text-gray-500">No records matched the selected filters.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[1180px] text-sm">
          <thead class="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40">
            <tr>
              <th class="px-5 py-3 text-left">{{ currentType.targetLabel }}</th>
              <th class="px-4 py-3 text-left">Department</th>
              <th class="px-4 py-3 text-center">Evaluations</th>
              <th class="px-4 py-3 text-center">{{ currentType.evaluatorShortLabel }}</th>
              <th class="px-4 py-3 text-center">Criteria</th>
              <th class="px-4 py-3 text-center">Average</th>
              <th class="px-4 py-3 text-center">Rating</th>
              <th class="px-4 py-3 text-center">Positive</th>
              <th class="px-4 py-3 text-center">Negative</th>
              <th class="px-4 py-3 text-left">Latest</th>
              <th class="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="group in paginatedGroups" :key="group.key" class="transition hover:bg-gray-50/80 dark:hover:bg-gray-950/30">
              <td class="px-5 py-4">
                <div class="flex min-w-0 items-center gap-3">
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                    {{ createInitials(group.name) }}
                  </div>
                  <div class="min-w-0">
                    <p class="truncate font-bold text-gray-900 dark:text-white">{{ group.name }}</p>
                    <p class="mt-0.5 truncate text-xs text-gray-500">{{ group.schoolYears.join(', ') || 'No school year' }}</p>
                  </div>
                </div>
              </td>

              <td class="px-4 py-4 text-gray-600 dark:text-gray-300">{{ group.department }}</td>
              <td class="px-4 py-4 text-center font-semibold">{{ group.recordCount }}</td>
              <td class="px-4 py-4 text-center font-semibold">{{ group.evaluatorCount }}</td>
              <td class="px-4 py-4 text-center font-semibold">{{ group.criteriaCount }}</td>

              <td class="px-4 py-4 text-center">
                <div class="font-bold text-gray-900 dark:text-white">{{ formatNumber(group.averageScore) }}</div>
                <div class="text-[10px] text-gray-400">out of 5</div>
              </td>

              <td class="px-4 py-4 text-center">
                <span class="inline-flex rounded-full px-2 py-1 text-xs font-semibold" :class="ratingBadge(group.averageScore)">
                  {{ getRatingLabel(group.averageScore) }}
                </span>
              </td>

              <td class="px-4 py-4 text-center">
                <span class="inline-flex min-w-8 justify-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  {{ group.sentiments.positive }}
                </span>
              </td>

              <td class="px-4 py-4 text-center">
                <span class="inline-flex min-w-8 justify-center rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-400">
                  {{ group.sentiments.negative }}
                </span>
              </td>

              <td class="px-4 py-4 text-gray-600 dark:text-gray-300">{{ formatDate(group.latestDate) }}</td>

              <td class="px-5 py-4 text-center">
                <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-eye" @click="openSummary(group)">
                  View Summary
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredGroups.length" class="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
        <p class="text-center text-xs text-gray-500 sm:text-left">
          Showing {{ paginationStart }}–{{ paginationEnd }} of {{ filteredGroups.length }} groups
        </p>

        <div class="flex items-center justify-center gap-2">
          <UButton color="neutral" variant="outline" icon="i-lucide-chevron-left" square :disabled="page <= 1" @click="page--" />
          <div class="min-w-28 rounded-xl bg-gray-100 px-3 py-2 text-center text-xs font-semibold dark:bg-gray-800">
            Page {{ page }} of {{ totalPages }}
          </div>
          <UButton color="neutral" variant="outline" icon="i-lucide-chevron-right" square :disabled="page >= totalPages" @click="page++" />
        </div>
      </div>
    </section>

    <!-- SUMMARY MODAL -->
    <UModal
      v-model:open="showSummaryDialog"
      id="consolidated-evaluation-summary-dialog"
      title="Evaluation Summary"
      description="Review grouped ratings, criteria, sentiment, and individual records."
      :ui="{ content: 'max-w-7xl' }"
    >
      <template #content>
        <div v-if="selectedGroup" class="max-h-[90vh] overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <div class="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-6 text-white">
            <div class="flex items-start justify-between gap-4">
              <div class="flex min-w-0 items-center gap-4">
                <div class="flex size-16 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-xl font-black">
                  {{ createInitials(selectedGroup.name) }}
                </div>
                <div class="min-w-0">
                  <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">{{ currentType.label }} Summary</p>
                  <h2 class="mt-2 truncate text-2xl font-black">{{ selectedGroup.name }}</h2>
                  <p class="mt-1 text-sm text-slate-300">{{ selectedGroup.department }}</p>
                </div>
              </div>

              <UButton color="neutral" variant="ghost" icon="i-lucide-x" square class="text-white" @click="showSummaryDialog = false" />
            </div>
          </div>

          <div class="space-y-5 p-5">
            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <MiniCard label="Evaluations" :value="selectedGroup.recordCount" />
              <MiniCard :label="currentType.evaluatorShortLabel" :value="selectedGroup.evaluatorCount" />
              <MiniCard label="Criteria" :value="selectedGroup.criteriaCount" />
              <MiniCard label="Average" :value="`${formatNumber(selectedGroup.averageScore)} / 5`" />
              <MiniCard label="Completion" :value="`${formatNumber(selectedGroup.completionRate)}%`" />
            </div>

            <div class="grid gap-5 xl:grid-cols-2">
              <section class="overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                  <h3 class="text-sm font-bold">Rating Distribution</h3>
                </div>
                <div class="grid grid-cols-5 gap-2 p-4">
                  <div v-for="score in [5,4,3,2,1]" :key="score" class="rounded-xl border border-gray-200 p-3 text-center dark:border-gray-800">
                    <p class="text-xs font-semibold">{{ score }} Star</p>
                    <p class="mt-2 text-xl font-black">{{ selectedGroup.ratingDistribution[score] || 0 }}</p>
                    <p class="mt-1 text-[10px] text-gray-500">
                      {{ formatNumber(getRatingPercentage(selectedGroup.ratingDistribution[score] || 0, selectedGroup.totalRatingResponses)) }}%
                    </p>
                  </div>
                </div>
              </section>

              <section class="overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                  <h3 class="text-sm font-bold">AI Sentiment Summary</h3>
                </div>
                <div class="grid grid-cols-3 gap-3 p-4">
                  <SentimentCard label="Positive" :value="selectedGroup.sentiments.positive" tone="positive" />
                  <SentimentCard label="Neutral" :value="selectedGroup.sentiments.neutral" tone="neutral" />
                  <SentimentCard label="Negative" :value="selectedGroup.sentiments.negative" tone="negative" />
                </div>
              </section>
            </div>

            <section class="overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                <h3 class="text-sm font-bold">Criteria Summary</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-sm">
                  <thead class="bg-gray-50 text-[11px] uppercase text-gray-500 dark:bg-gray-950/40">
                    <tr>
                      <th class="px-4 py-3 text-left">Criterion</th>
                      <th class="px-3 py-3 text-center">Responses</th>
                      <th class="px-3 py-3 text-center">Average</th>
                      <th class="px-3 py-3 text-center">5</th>
                      <th class="px-3 py-3 text-center">4</th>
                      <th class="px-3 py-3 text-center">3</th>
                      <th class="px-3 py-3 text-center">2</th>
                      <th class="px-3 py-3 text-center">1</th>
                      <th class="px-4 py-3 text-center">Rating</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr v-for="criterion in selectedGroup.criteriaSummary" :key="criterion.criteriaId">
                      <td class="max-w-md px-4 py-3">{{ criterion.statement }}</td>
                      <td class="px-3 py-3 text-center">{{ criterion.responseCount }}</td>
                      <td class="px-3 py-3 text-center font-bold text-emerald-700">{{ formatNumber(criterion.averageScore) }}</td>
                      <td class="px-3 py-3 text-center">{{ criterion.distribution[5] || 0 }}</td>
                      <td class="px-3 py-3 text-center">{{ criterion.distribution[4] || 0 }}</td>
                      <td class="px-3 py-3 text-center">{{ criterion.distribution[3] || 0 }}</td>
                      <td class="px-3 py-3 text-center">{{ criterion.distribution[2] || 0 }}</td>
                      <td class="px-3 py-3 text-center">{{ criterion.distribution[1] || 0 }}</td>
                      <td class="px-4 py-3 text-center">
                        <span class="inline-flex rounded-full px-2 py-1 text-xs font-semibold" :class="ratingBadge(criterion.averageScore)">
                          {{ getRatingLabel(criterion.averageScore) }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="!selectedGroup.criteriaSummary.length">
                      <td colspan="9" class="px-4 py-10 text-center text-gray-500">No criterion responses are available.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                <h3 class="text-sm font-bold">Individual Evaluation Records</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full min-w-[980px] text-sm">
                  <thead class="bg-gray-50 text-[11px] uppercase text-gray-500 dark:bg-gray-950/40">
                    <tr>
                      <th class="px-4 py-3 text-left">{{ currentType.evaluatorSingularLabel }}</th>
                      <th class="px-4 py-3 text-left">Submitted</th>
                      <th class="px-4 py-3 text-center">Semester</th>
                      <th class="px-4 py-3 text-center">School Year</th>
                      <th class="px-4 py-3 text-center">Average</th>
                      <th class="px-4 py-3 text-center">Sentiment</th>
                      <th class="px-4 py-3 text-left">Comment</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr v-for="record in selectedGroup.records" :key="getEvaluationKey(record)">
                      <td class="px-4 py-3 font-semibold">{{ getRecordLabel(record) }}</td>
                      <td class="px-4 py-3 text-gray-600">{{ formatDate(getEvaluationDate(record)) }}</td>
                      <td class="px-4 py-3 text-center">{{ getSemester(record) }}</td>
                      <td class="px-4 py-3 text-center">{{ getSchoolYear(record) }}</td>
                      <td class="px-4 py-3 text-center font-bold">{{ formatNumber(getRecordAverage(record)) }}</td>
                      <td class="px-4 py-3 text-center">
                        <span class="inline-flex rounded-full px-2 py-1 text-xs font-semibold" :class="sentimentBadge(record.feedback_sentiment)">
                          {{ record.feedback_sentiment || 'Neutral' }}
                        </span>
                      </td>
                      <td class="max-w-[320px] px-4 py-3">
                        <p class="truncate" :title="getRecordComment(record)">{{ getRecordComment(record) }}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </template>
    </UModal>

    <!-- PDF PREVIEW -->
    <UModal
      v-model:open="showPdfPreview"
      id="consolidated-evaluation-pdf-preview-dialog"
      title="Evaluation Report PDF Preview"
      description="Preview the generated report before downloading."
      :ui="{ content: 'max-w-7xl' }"
    >
      <template #content>
        <div class="flex h-[90vh] flex-col overflow-hidden bg-white dark:bg-gray-950">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <div>
              <h3 class="text-sm font-bold">{{ pdfFileName }}</h3>
              <p class="mt-0.5 text-xs text-gray-500">{{ currentType.label }} Consolidated Report</p>
            </div>

            <div class="flex items-center gap-2">
              <UButton color="primary" icon="i-lucide-download" :disabled="!pdfPreviewUrl" @click="downloadExistingPdf">
                Download PDF
              </UButton>
              <UButton color="neutral" variant="ghost" icon="i-lucide-x" square @click="closePdfPreview" />
            </div>
          </div>

          <div class="min-h-0 flex-1 bg-gray-100 p-3 dark:bg-gray-900">
            <iframe v-if="pdfPreviewUrl" :src="pdfPreviewUrl" class="h-full w-full rounded-xl border bg-white" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

definePageMeta({
  middleware: ["auth", "role"],
  role: ["Admin"],
});

const { $api } = useNuxtApp();
const toast = useToast();

const evaluationTypes = [
  {
    label: "Student – Faculty",
    value: "student-faculty",
    icon: "i-lucide-graduation-cap",
    description: "Student ratings of faculty",
    targetLabel: "Faculty",
    evaluatorLabel: "Unique Students",
    evaluatorShortLabel: "Students",
    evaluatorSingularLabel: "Student",
  },
  {
    label: "Faculty – Dean",
    value: "faculty-dean-coordinator",
    icon: "i-lucide-building-2",
    description: "Faculty ratings of deans",
    targetLabel: "Dean",
    evaluatorLabel: "Unique Faculty",
    evaluatorShortLabel: "Faculty",
    evaluatorSingularLabel: "Faculty Evaluator",
  },
  {
    label: "Dean – Faculty",
    value: "dean-to-faculty",
    icon: "i-lucide-presentation",
    description: "Dean ratings of faculty",
    targetLabel: "Faculty",
    evaluatorLabel: "Unique Deans",
    evaluatorShortLabel: "Deans",
    evaluatorSingularLabel: "Dean Evaluator",
  },
  {
    label: "Overall Feedback",
    value: "student-school",
    icon: "i-lucide-school",
    description: "Student feedback about the school",
    targetLabel: "School Area",
    evaluatorLabel: "Unique Students",
    evaluatorShortLabel: "Students",
    evaluatorSingularLabel: "Student",
  },
];

const activeType = ref("student-faculty");
const evaluations = ref<any[]>([]);
const pending = ref(false);
const loadError = ref("");

const activeSchoolYear = ref("all");
const activeSemester = ref("all");

const searchQuery = ref("");
const selectedTarget = ref("all");
const selectedDepartment = ref("all");
const selectedSemester = ref("all");
const selectedSchoolYear = ref("all");

const page = ref(1);
const pageSize = ref(20);
const pageSizeOptions = [
  { label: "10 rows", value: 10 },
  { label: "20 rows", value: 20 },
  { label: "50 rows", value: 50 },
  { label: "100 rows", value: 100 },
];

const showSummaryDialog = ref(false);
const selectedGroup = ref<any>(null);

const isGeneratingPdf = ref(false);
const pdfAction = ref("");
const showPdfPreview = ref(false);
const pdfPreviewUrl = ref("");
const pdfFileName = ref("");

const currentType = computed(() =>
  evaluationTypes.find((item) => item.value === activeType.value) || evaluationTypes[0],
);

const KpiCard = defineComponent({
  props: { label: String, value: [String, Number], icon: String, tone: String },
  setup(props) {
    const toneClasses: any = {
      blue: "border-blue-100 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20",
      violet: "border-violet-100 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/20",
      amber: "border-amber-100 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20",
      emerald: "border-emerald-100 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20",
    };

    return () =>
      h("div", { class: `rounded-2xl border p-5 ${toneClasses[props.tone]}` }, [
        h("div", { class: "flex items-center justify-between" }, [
          h("div", {}, [
            h("p", { class: "text-xs font-medium text-gray-500" }, props.label),
            h("p", { class: "mt-2 text-2xl font-bold text-gray-900 dark:text-white" }, String(props.value ?? 0)),
          ]),
          h(resolveComponent("UIcon"), { name: props.icon, class: "size-6" }),
        ]),
      ]);
  },
});

const MiniCard = defineComponent({
  props: { label: String, value: [String, Number] },
  setup(props) {
    return () =>
      h("div", { class: "rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900" }, [
        h("p", { class: "text-[10px] font-bold uppercase tracking-wide text-gray-500" }, props.label),
        h("p", { class: "mt-2 text-xl font-black" }, String(props.value ?? 0)),
      ]);
  },
});

const SentimentCard = defineComponent({
  props: { label: String, value: [String, Number], tone: String },
  setup(props) {
    const classes: any = {
      positive: "border-emerald-100 bg-emerald-50 text-emerald-700",
      neutral: "border-gray-200 bg-gray-50 text-gray-700",
      negative: "border-red-100 bg-red-50 text-red-700",
    };
    return () =>
      h("div", { class: `rounded-2xl border p-4 text-center ${classes[props.tone]}` }, [
        h("p", { class: "text-xs font-bold" }, props.label),
        h("p", { class: "mt-2 text-2xl font-black" }, String(props.value ?? 0)),
      ]);
  },
});

type NormalizedResponse = {
  criteriaId: string;
  statement: string;
  score: number;
};

const normalizeResponses = (responses: any): NormalizedResponse[] => {
  if (!responses) return [];

  let parsed = responses;

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }

  if (Array.isArray(parsed)) {
    return parsed
      .map((item: any, index: number) => {
        const rawCriteriaId =
          item?.criteria_id ??
          item?.criteriaId ??
          item?.criterion_id ??
          item?.criterionId ??
          item?.evaluation_criteria_id ??
          item?.evaluationCriteriaId ??
          item?.criterion?.documentId ??
          item?.criterion?.id ??
          item?.evaluation_criterion?.documentId ??
          item?.evaluation_criterion?.id ??
          item?.documentId ??
          item?.id ??
          index + 1;

        const rawScore =
          item?.score ??
          item?.value ??
          item?.rating ??
          item?.response ??
          item?.answer ??
          0;

        const rawStatement =
          item?.statement ??
          item?.question ??
          item?.criteria ??
          item?.criterion?.statement ??
          item?.evaluation_criterion?.statement ??
          `Criterion #${rawCriteriaId}`;

        return {
          criteriaId: String(rawCriteriaId),
          statement: String(rawStatement),
          score: Number(rawScore),
        };
      })
      .filter((item) => item.criteriaId && Number.isFinite(item.score) && item.score >= 1 && item.score <= 5);
  }

  if (typeof parsed === "object" && parsed !== null) {
    return Object.entries(parsed)
      .map(([criteriaId, value]: [string, any]) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
          const rawCriteriaId =
            value?.criteria_id ??
            value?.criteriaId ??
            value?.criterion_id ??
            value?.criterionId ??
            value?.evaluation_criteria_id ??
            value?.evaluationCriteriaId ??
            value?.criterion?.documentId ??
            value?.criterion?.id ??
            value?.documentId ??
            value?.id ??
            criteriaId;

          return {
            criteriaId: String(rawCriteriaId),
            statement: String(
              value?.statement ??
              value?.question ??
              value?.criteria ??
              value?.criterion?.statement ??
              value?.evaluation_criterion?.statement ??
              `Criterion #${rawCriteriaId}`,
            ),
            score: Number(
              value?.score ??
              value?.value ??
              value?.rating ??
              value?.response ??
              value?.answer ??
              0,
            ),
          };
        }

        return {
          criteriaId: String(criteriaId),
          statement: `Criterion #${criteriaId}`,
          score: Number(value),
        };
      })
      .filter((item) => item.criteriaId && Number.isFinite(item.score) && item.score >= 1 && item.score <= 5);
  }

  return [];
};

const makeOptions = (values: any[], allLabel: string) => {
  const uniqueValues = Array.from(
    new Set(values.filter((value) => value && value !== "N/A" && value !== "Not specified")),
  ).sort((a, b) => String(a).localeCompare(String(b)));

  return [
    { label: allLabel, value: "all" },
    ...uniqueValues.map((value) => ({ label: String(value), value })),
  ];
};

const targetOptions = computed(() => {
  const map = new Map<string, string>();

  evaluations.value.forEach((evaluation) => {
    const key = getTargetKey(evaluation);
    const label = getTargetName(evaluation);
    if (key) map.set(key, label);
  });

  return [
    { label: `All ${currentType.value.targetLabel}`, value: "all" },
    ...Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];
});

const departmentOptions = computed(() =>
  makeOptions(evaluations.value.map(getEvaluationDepartment), "All Departments"),
);

const semesterOptions = computed(() =>
  makeOptions(evaluations.value.map(getSemester), "All Semesters"),
);

const schoolYearOptions = computed(() => {
  const options = makeOptions(evaluations.value.map(getSchoolYear), "All School Years");
  return [options[0], ...options.slice(1).sort((a, b) => String(b.value).localeCompare(String(a.value)))];
});

const filteredEvaluationRecords = computed(() =>
  evaluations.value.filter((evaluation) => {
    const matchesTarget = selectedTarget.value === "all" || getTargetKey(evaluation) === String(selectedTarget.value);
    const matchesDepartment = selectedDepartment.value === "all" || getEvaluationDepartment(evaluation) === selectedDepartment.value;
    const matchesSemester = selectedSemester.value === "all" || getSemester(evaluation) === selectedSemester.value;
    const matchesSchoolYear = selectedSchoolYear.value === "all" || getSchoolYear(evaluation) === selectedSchoolYear.value;

    return matchesTarget && matchesDepartment && matchesSemester && matchesSchoolYear;
  }),
);

const groupedResults = computed(() => {
  const groups = new Map<string, any>();

  filteredEvaluationRecords.value.forEach((evaluation) => {
    const targetKey = getTargetKey(evaluation);

    if (!groups.has(targetKey)) {
      groups.set(targetKey, {
        key: targetKey,
        name: getTargetName(evaluation),
        department: getEvaluationDepartment(evaluation),
        records: [],
        evaluatorKeys: new Set<string>(),
        semesterValues: new Set<string>(),
        schoolYearValues: new Set<string>(),
        criteriaMap: new Map<string, any>(),
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        totalRatingScore: 0,
        totalRatingResponses: 0,
      });
    }

    const group = groups.get(targetKey);
    group.records.push(evaluation);

    const evaluatorKey = getEvaluatorKey(evaluation);
    if (evaluatorKey) group.evaluatorKeys.add(evaluatorKey);

    const semester = getSemester(evaluation);
    const schoolYear = getSchoolYear(evaluation);
    if (semester !== "N/A") group.semesterValues.add(semester);
    if (schoolYear !== "N/A") group.schoolYearValues.add(schoolYear);

    normalizeResponses(evaluation.responses).forEach((response) => {
      if (!group.criteriaMap.has(response.criteriaId)) {
        group.criteriaMap.set(response.criteriaId, {
          criteriaId: response.criteriaId,
          statement: response.statement,
          totalScore: 0,
          responseCount: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        });
      }

      const criterion = group.criteriaMap.get(response.criteriaId);

      if (criterion.statement.startsWith("Criterion #") && !response.statement.startsWith("Criterion #")) {
        criterion.statement = response.statement;
      }

      criterion.totalScore += response.score;
      criterion.responseCount += 1;
      criterion.distribution[response.score] += 1;

      group.ratingDistribution[response.score] += 1;
      group.totalRatingScore += response.score;
      group.totalRatingResponses += 1;
    });
  });

  return Array.from(groups.values())
    .map((group) => {
      const sentiments = group.records.reduce(
        (result: any, record: any) => {
          const sentiment = String(record?.feedback_sentiment || "Neutral").toLowerCase();
          if (sentiment === "positive") result.positive += 1;
          else if (sentiment === "negative") result.negative += 1;
          else result.neutral += 1;
          return result;
        },
        { positive: 0, negative: 0, neutral: 0 },
      );

      const sortedRecords = [...group.records].sort(
        (a, b) => new Date(getEvaluationDate(b) || 0).getTime() - new Date(getEvaluationDate(a) || 0).getTime(),
      );

      const criteriaSummary = Array.from(group.criteriaMap.values())
        .map((criterion: any) => ({
          ...criterion,
          averageScore: criterion.responseCount ? criterion.totalScore / criterion.responseCount : 0,
        }))
        .sort((a: any, b: any) => {
          const first = Number(a.criteriaId);
          const second = Number(b.criteriaId);
          if (Number.isFinite(first) && Number.isFinite(second)) return first - second;
          return String(a.criteriaId).localeCompare(String(b.criteriaId));
        });

      const overallAverage = group.totalRatingResponses
        ? group.totalRatingScore / group.totalRatingResponses
        : averageOfRecords(group.records);

      const expectedResponses = group.evaluatorKeys.size * criteriaSummary.length;
      const completionRate = expectedResponses
        ? Math.min(100, Math.round((group.totalRatingResponses / expectedResponses) * 100))
        : 0;

      return {
        ...group,
        records: sortedRecords,
        recordCount: sortedRecords.length,
        evaluatorCount: group.evaluatorKeys.size,
        semesters: Array.from(group.semesterValues),
        schoolYears: Array.from(group.schoolYearValues),
        criteriaSummary,
        criteriaCount: criteriaSummary.length,
        averageScore: overallAverage,
        completionRate,
        sentiments,
        latestDate: getEvaluationDate(sortedRecords[0]),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
});

const filteredGroups = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return groupedResults.value.filter((group) => {
    const searchable = [
      group.name,
      group.department,
      ...group.schoolYears,
      ...group.semesters,
    ].join(" ").toLowerCase();

    return !query || searchable.includes(query);
  });
});

const summary = computed(() => {
  const evaluatorKeys = new Set(
    filteredEvaluationRecords.value.map(getEvaluatorKey).filter(Boolean),
  );

  const totalScore = groupedResults.value.reduce((sum, group) => sum + Number(group.totalRatingScore || 0), 0);
  const totalResponses = groupedResults.value.reduce((sum, group) => sum + Number(group.totalRatingResponses || 0), 0);

  const fallbackAverages = groupedResults.value.map((group) => group.averageScore).filter((value) => value > 0);
  const fallbackAverage = fallbackAverages.length
    ? fallbackAverages.reduce((sum, value) => sum + value, 0) / fallbackAverages.length
    : 0;

  return {
    totalTargets: groupedResults.value.length,
    totalEvaluations: filteredEvaluationRecords.value.length,
    totalEvaluators: evaluatorKeys.size,
    averageScore: totalResponses
      ? (totalScore / totalResponses).toFixed(2)
      : fallbackAverage.toFixed(2),
  };
});

const hasActiveFilters = computed(() =>
  Boolean(
    searchQuery.value ||
    selectedTarget.value !== "all" ||
    selectedDepartment.value !== "all" ||
    selectedSemester.value !== "all" ||
    selectedSchoolYear.value !== "all",
  ),
);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredGroups.value.length / Number(pageSize.value))),
);

const paginatedGroups = computed(() => {
  const size = Number(pageSize.value);
  const start = (page.value - 1) * size;
  return filteredGroups.value.slice(start, start + size);
});

const paginationStart = computed(() =>
  filteredGroups.value.length ? (page.value - 1) * Number(pageSize.value) + 1 : 0,
);

const paginationEnd = computed(() =>
  Math.min(page.value * Number(pageSize.value), filteredGroups.value.length),
);

const getTargetKey = (evaluation: any) => {
  if (activeType.value === "faculty-dean-coordinator") {
    return String(
      evaluation?.dean_coordinator?.documentId ||
      evaluation?.dean_coordinator?.id ||
      "unknown-dean",
    );
  }

  if (activeType.value === "student-school") {
    return String(
      evaluation?.service?.documentId ||
      evaluation?.service?.id ||
      evaluation?.category?.documentId ||
      evaluation?.category?.id ||
      evaluation?.department?.documentId ||
      evaluation?.department?.id ||
      "school-performance",
    );
  }

  return String(
    evaluation?.teacher?.documentId ||
    evaluation?.teacher?.id ||
    "unknown-faculty",
  );
};

const getTargetName = (evaluation: any) => {
  if (activeType.value === "faculty-dean-coordinator") {
    return (
      evaluation?.dean_coordinator?.name ||
      "Unknown Dean"
    );
  }

  if (activeType.value === "student-school") {
    return (
      evaluation?.service?.name ||
      evaluation?.category?.name ||
      evaluation?.department?.name ||
      "School Performance"
    );
  }

  return evaluation?.teacher?.name || "Unknown Faculty";
};

const getEvaluationDepartment = (evaluation: any) => {
  const teacherDepartment = evaluation?.teacher?.department;
  const deanDepartment = evaluation?.dean_coordinator?.department;
  const directDepartment = evaluation?.department;
  const course = evaluation?.course;
  const studentCourse = evaluation?.student?.course;

  if (activeType.value === "student-school") {
    return (
      course?.name ||
      course?.course_name ||
      studentCourse?.name ||
      studentCourse?.course_name ||
      directDepartment?.name ||
      directDepartment?.department_name ||
      (typeof course === "string" ? course : "") ||
      (typeof studentCourse === "string" ? studentCourse : "") ||
      "School-wide"
    );
  }

  return (
    teacherDepartment?.name ||
    teacherDepartment?.department_name ||
    (typeof teacherDepartment === "string" ? teacherDepartment : "") ||
    deanDepartment?.name ||
    deanDepartment?.department_name ||
    (typeof deanDepartment === "string" ? deanDepartment : "") ||
    directDepartment?.name ||
    directDepartment?.department_name ||
    (typeof directDepartment === "string" ? directDepartment : "") ||
    "Not specified"
  );
};

const getEvaluatorKey = (evaluation: any) =>
  String(
    evaluation?.evaluator_user?.documentId ||
    evaluation?.evaluator_user?.id ||
    evaluation?.student?.documentId ||
    evaluation?.student?.id ||
    "",
  );

const getRecordLabel = (evaluation: any) =>
  evaluation?.evaluator_user?.username ||
  evaluation?.evaluator_user?.name ||
  evaluation?.evaluator_user?.email ||
  evaluation?.student?.name ||
  `${currentType.value.evaluatorSingularLabel} Evaluation`;

const getSemester = (evaluation: any) =>
  evaluation?.batch?.semester ||
  evaluation?.semester ||
  "N/A";

const getSchoolYear = (evaluation: any) =>
  evaluation?.batch?.school_year ||
  evaluation?.school_year ||
  "N/A";

const getEvaluationDate = (evaluation: any) =>
  evaluation?.batch?.date ||
  evaluation?.date ||
  evaluation?.createdAt ||
  null;

const getEvaluationKey = (evaluation: any) =>
  evaluation?.documentId ||
  evaluation?.id ||
  `${getTargetKey(evaluation)}-${getEvaluatorKey(evaluation)}-${evaluation?.createdAt || ""}`;

const getRecordAverage = (record: any) => {
  const normalized = normalizeResponses(record?.responses);
  if (normalized.length) {
    return normalized.reduce((sum, item) => sum + item.score, 0) / normalized.length;
  }

  const direct = Number(record?.average_score ?? record?.average ?? record?.score);
  return Number.isFinite(direct) ? direct : 0;
};

const averageOfRecords = (records: any[]) => {
  const averages = records.map(getRecordAverage).filter((value) => value > 0);
  return averages.length ? averages.reduce((sum, value) => sum + value, 0) / averages.length : 0;
};

const getRecordComment = (record: any) =>
  record?.comment ||
  record?.feedback ||
  record?.remarks ||
  "No comment provided.";

const createInitials = (value: string) =>
  String(value || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const formatNumber = (value: any) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
};

const formatDate = (value: any) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
};

const getRatingLabel = (average: number) => {
  const avg = Number(average);
  if (avg >= 4.5) return "Outstanding";
  if (avg >= 3.5) return "Excellent";
  if (avg >= 2.5) return "Satisfactory";
  if (avg >= 1.5) return "Fair";
  if (avg > 0) return "Needs Improvement";
  return "N/A";
};

const ratingBadge = (average: number) => {
  const avg = Number(average);
  if (avg >= 4.5) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
  if (avg >= 3.5) return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
  if (avg >= 2.5) return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
  if (avg >= 1.5) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
  if (avg > 0) return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
  return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
};

const sentimentBadge = (sentiment: string) => {
  const value = String(sentiment || "Neutral").toLowerCase();
  if (value === "positive") return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
  if (value === "negative") return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
  return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
};

const getRatingPercentage = (frequency: number, total: number) =>
  total ? (Number(frequency) / Number(total)) * 100 : 0;

const getSelectedLabel = (options: any[], value: any) =>
  options.find((option) => option.value === value)?.label || String(value || "");

const openSummary = (group: any) => {
  selectedGroup.value = group;
  showSummaryDialog.value = true;
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedTarget.value = "all";
  selectedDepartment.value = "all";
  selectedSemester.value = activeSemester.value || "all";
  selectedSchoolYear.value = activeSchoolYear.value || "all";
  page.value = 1;
};

const changeType = async (value: string) => {
  if (activeType.value === value) return;
  activeType.value = value;
  selectedGroup.value = null;
  showSummaryDialog.value = false;
  clearFilters();
  await getResults();
};

const loadActiveAcademicPeriod = async () => {
  try {
    const response: any = await $api("/school-years", {
      query: {
        "filters[active_sy][$eq]": true,
        "sort[0]": "updatedAt:desc",
        "pagination[pageSize]": 1,
      },
    });

    const activeRecord = response?.data?.[0] || null;
    activeSchoolYear.value = String(activeRecord?.school_year || "all").trim();
    activeSemester.value = String(activeRecord?.semester || "all").trim();

    selectedSchoolYear.value = activeSchoolYear.value || "all";
    selectedSemester.value = activeSemester.value || "all";
  } catch {
    activeSchoolYear.value = "all";
    activeSemester.value = "all";
  }
};

const getResults = async () => {
  pending.value = true;
  loadError.value = "";

  try {
    if (activeType.value === "student-school") {
      const response: any = await $api("/overall-feedbacks", {
        query: {
          "populate[student]": true,
          "populate[course]": true,
          "populate[evaluator_user]": true,
          "sort[0]": "createdAt:desc",
          "pagination[pageSize]": 10000,
        },
      });

      evaluations.value = response?.data || [];
    } else {
      const query: any = {
        "filters[batch][evaluation_type][code][$eq]": activeType.value,
        "populate[evaluator_user]": true,
        "populate[batch][populate][0]": "evaluation_type",
        "sort[0]": "createdAt:desc",
        "pagination[pageSize]": 10000,
      };

      if (
        activeType.value === "student-faculty" ||
        activeType.value === "dean-to-faculty"
      ) {
        query["populate[teacher][populate][department]"] = true;
      }

      if (activeType.value === "faculty-dean-coordinator") {
        query["populate[dean_coordinator][populate][department]"] = true;
      }

      const response: any = await $api("/evaluations", { query });
      evaluations.value = response?.data || [];
    }

    page.value = 1;
  } catch (error: any) {
    console.error("Evaluation report loading error:", error);
    evaluations.value = [];
    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      `Failed to load ${currentType.value.label} evaluation results.`;

    toast.add({
      title: "Unable to load report",
      description: loadError.value,
      icon: "i-lucide-triangle-alert",
      color: "error",
    });
  } finally {
    pending.value = false;
  }
};

const initializePage = async () => {
  await loadActiveAcademicPeriod();
  await getResults();
};

const buildPdfReport = () => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const generatedDate = new Date().toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ST. NICOLAS COLLEGE OF BUSINESS AND TECHNOLOGY", pageWidth / 2, 14, { align: "center" });

  doc.setFontSize(13);
  doc.text(`${currentType.value.label.toUpperCase()} CONSOLIDATED REPORT`, pageWidth / 2, 22, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Semester: ${selectedSemester.value === "all" ? "All Semesters" : selectedSemester.value}   |   School Year: ${selectedSchoolYear.value === "all" ? "All School Years" : selectedSchoolYear.value}   |   Generated: ${generatedDate}`,
    pageWidth / 2,
    29,
    { align: "center" },
  );

  autoTable(doc, {
    startY: 36,
    head: [[
      currentType.value.targetLabel,
      "Department",
      "Evaluations",
      currentType.value.evaluatorShortLabel,
      "Criteria",
      "Average",
      "Interpretation",
      "Positive",
      "Neutral",
      "Negative",
    ]],
    body: filteredGroups.value.map((group) => [
      group.name,
      group.department,
      group.recordCount,
      group.evaluatorCount,
      group.criteriaCount,
      formatNumber(group.averageScore),
      getRatingLabel(group.averageScore),
      group.sentiments.positive,
      group.sentiments.neutral,
      group.sentiments.negative,
    ]),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fontStyle: "bold" },
    theme: "grid",
    margin: { left: 10, right: 10 },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 40;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Total Groups: ${summary.value.totalTargets}   |   Evaluations: ${summary.value.totalEvaluations}   |   Respondents: ${summary.value.totalEvaluators}   |   Overall Average: ${summary.value.averageScore}/5`,
    10,
    finalY + 8,
  );

  return doc;
};

const makePdfFileName = () => {
  const type = activeType.value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  const semester = String(selectedSemester.value || "all").replace(/[^a-z0-9]+/gi, "-");
  const schoolYear = String(selectedSchoolYear.value || "all").replace(/[^a-z0-9]+/gi, "-");
  return `${type}-evaluation-report-${semester}-${schoolYear}.pdf`;
};

const previewPdfReport = async () => {
  if (!filteredGroups.value.length) return;

  isGeneratingPdf.value = true;
  pdfAction.value = "preview";

  try {
    const doc = buildPdfReport();
    const blob = doc.output("blob");

    if (pdfPreviewUrl.value) URL.revokeObjectURL(pdfPreviewUrl.value);

    pdfPreviewUrl.value = URL.createObjectURL(blob);
    pdfFileName.value = makePdfFileName();
    showPdfPreview.value = true;
  } finally {
    isGeneratingPdf.value = false;
    pdfAction.value = "";
  }
};

const downloadPdfReport = async () => {
  if (!filteredGroups.value.length) return;

  isGeneratingPdf.value = true;
  pdfAction.value = "download";

  try {
    const doc = buildPdfReport();
    doc.save(makePdfFileName());
  } finally {
    isGeneratingPdf.value = false;
    pdfAction.value = "";
  }
};

const downloadExistingPdf = () => {
  if (!pdfPreviewUrl.value) return;

  const anchor = document.createElement("a");
  anchor.href = pdfPreviewUrl.value;
  anchor.download = pdfFileName.value;
  anchor.click();
};

const closePdfPreview = () => {
  showPdfPreview.value = false;

  if (pdfPreviewUrl.value) {
    URL.revokeObjectURL(pdfPreviewUrl.value);
    pdfPreviewUrl.value = "";
  }
};

watch(
  [searchQuery, selectedTarget, selectedDepartment, selectedSemester, selectedSchoolYear, pageSize],
  () => {
    page.value = 1;
  },
);

watch(
  () => totalPages.value,
  (value) => {
    if (page.value > value) page.value = value;
  },
);

onBeforeUnmount(() => {
  if (pdfPreviewUrl.value) URL.revokeObjectURL(pdfPreviewUrl.value);
});

onMounted(initializePage);
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
