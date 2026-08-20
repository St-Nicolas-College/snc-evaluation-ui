<template>
  <div class="space-y-6 pb-8">
    <!-- =====================================================
      HERO
    ====================================================== -->
    <section
      class="relative overflow-hidden rounded-[28px] border border-cyan-100 bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 px-5 py-6 text-white shadow-xl shadow-cyan-900/10 sm:px-7 sm:py-7"
    >
      <div
        class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-blue-300/15 blur-3xl"
      />

      <div
        class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"
      >
        <div class="flex min-w-0 items-start gap-4">
          <div
            class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex"
          >
            <UIcon
              name="i-lucide-message-square-text"
              class="size-7"
            />
          </div>

          <div class="min-w-0">
            <div
              class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-cyan-50"
            >
              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Administrator Portal
              </span>

              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                School-Wide Feedback
              </span>

              <span
                v-if="evaluationType"
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                {{ evaluationTypeLabel }}
              </span>

              <span
                v-if="evaluationType"
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                {{ responseTypeLabel }}
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Overall Feedback Results
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-cyan-50/90">
              Review written Student - School feedback about facilities,
              services, and the overall learning experience. This page uses
              the configured Text / Comment Evaluation Type and focuses on
              themes, priorities, strengths, concerns, and recommended actions.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ summary.totalSubmissions }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-cyan-100"
            >
              Submissions
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ summary.totalAnswers }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-cyan-100"
            >
              Answers
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ summary.totalSections }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-cyan-100"
            >
              Sections
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
      KPI CARDS
    ====================================================== -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        class="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Submissions
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ summary.totalSubmissions }}
            </p>
          </div>

          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          >
            <UIcon name="i-lucide-files" class="size-5" />
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-violet-100 bg-violet-50/70 p-5 dark:border-violet-900 dark:bg-violet-950/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Unique Students
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ summary.totalStudents }}
            </p>
          </div>

          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
          >
            <UIcon name="i-lucide-users-round" class="size-5" />
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-amber-100 bg-amber-50/70 p-5 dark:border-amber-900 dark:bg-amber-950/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Answers
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ summary.totalAnswers }}
            </p>
          </div>

          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          >
            <UIcon name="i-lucide-list-checks" class="size-5" />
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5 dark:border-cyan-900 dark:bg-cyan-950/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Feedback Sections
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ summary.totalSections }}
            </p>
          </div>

          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400"
          >
            <UIcon name="i-lucide-layout-list" class="size-5" />
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
      EXECUTIVE FEEDBACK SUMMARY
    ====================================================== -->
    <section
      class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="border-b border-gray-200 bg-gradient-to-r from-slate-50 via-white to-cyan-50 px-5 py-4 dark:border-gray-800 dark:from-slate-950/50 dark:via-gray-900 dark:to-cyan-950/20"
      >
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-800"
            >
              <UIcon name="i-lucide-layout-dashboard" class="size-5" />
            </div>

            <div>
              <h2 class="text-sm font-bold text-gray-900 dark:text-white">
                Executive Feedback Summary
              </h2>

              <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                A management-level view of the most important patterns found in the currently filtered Student - School written feedback.
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <UBadge
              v-if="evaluationType"
              color="info"
              variant="subtle"
              icon="i-lucide-message-square-text"
            >
              {{ evaluationTypeLabel }}
            </UBadge>

            <UBadge color="neutral" variant="subtle">
              {{ responseTypeLabel }}
            </UBadge>
          </div>
        </div>
      </div>

      <div class="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
        <article
          class="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-950/30"
        >
          <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
            Overall Sentiment
          </p>

          <div class="mt-2 flex items-center justify-between gap-3">
            <p class="text-xl font-black text-gray-950 dark:text-white">
              {{ overallSentimentAnalysis.overallSentiment }}
            </p>

            <UBadge
              :color="sentimentColor(overallSentimentAnalysis.overallSentiment)"
              variant="subtle"
            >
              {{ overallSentimentAnalysis.analysedAnswers }} analysed
            </UBadge>
          </div>
        </article>

        <article
          class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20"
        >
          <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
            Top Strength
          </p>

          <p class="mt-2 text-base font-black text-gray-950 dark:text-white">
            {{ executiveSummary.topStrength }}
          </p>

          <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
            Most frequently positive area in the current feedback set.
          </p>
        </article>

        <article
          class="rounded-2xl border border-red-100 bg-red-50/60 p-4 dark:border-red-900 dark:bg-red-950/20"
        >
          <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-red-700 dark:text-red-400">
            Top Concern
          </p>

          <p class="mt-2 text-base font-black text-gray-950 dark:text-white">
            {{ executiveSummary.topConcern }}
          </p>

          <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
            Highest-priority concern based on mentions and negative feedback.
          </p>
        </article>

        <article
          class="rounded-2xl border border-violet-100 bg-violet-50/60 p-4 dark:border-violet-900 dark:bg-violet-950/20"
        >
          <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-400">
            Most Mentioned Theme
          </p>

          <p class="mt-2 text-base font-black text-gray-950 dark:text-white">
            {{ executiveSummary.mostMentionedTheme }}
          </p>

          <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
            The topic appearing most often in written responses.
          </p>
        </article>

        <article
          class="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/20"
        >
          <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400">
            Highest Priority
          </p>

          <div class="mt-2 flex items-center gap-2">
            <p class="text-base font-black text-gray-950 dark:text-white">
              {{ executiveSummary.highestPriority }}
            </p>

            <UBadge
              :color="priorityColor(executiveSummary.highestPriorityLevel)"
              variant="subtle"
            >
              {{ executiveSummary.highestPriorityLevel }}
            </UBadge>
          </div>

          <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
            Priority is derived from issue frequency and negative-response percentage.
          </p>
        </article>

        <article
          class="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4 dark:border-cyan-900 dark:bg-cyan-950/20"
        >
          <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-400">
            Recommended Immediate Action
          </p>

          <p class="mt-2 text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200">
            {{ executiveSummary.recommendedAction }}
          </p>
        </article>
      </div>
    </section>

    <!-- =====================================================
      KEY ISSUES & PRIORITIES
    ====================================================== -->
    <section
      class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="border-b border-gray-200 bg-gradient-to-r from-red-50 via-white to-amber-50 px-5 py-4 dark:border-gray-800 dark:from-red-950/20 dark:via-gray-900 dark:to-amber-950/20"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
          >
            <UIcon name="i-lucide-triangle-alert" class="size-5" />
          </div>

          <div>
            <h2 class="text-sm font-bold text-gray-900 dark:text-white">
              Key Issues & Priorities
            </h2>

            <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Frequently mentioned school-wide concerns ranked using response volume and negative sentiment.
            </p>
          </div>
        </div>
      </div>

      <div v-if="priorityIssues.length" class="divide-y divide-gray-200 dark:divide-gray-800">
        <article
          v-for="(issue, index) in priorityIssues"
          :key="issue.key"
          class="grid gap-4 p-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center"
        >
          <div
            class="flex size-10 items-center justify-center rounded-2xl bg-gray-100 text-sm font-black text-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            {{ index + 1 }}
          </div>

          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-bold text-gray-900 dark:text-white">
                {{ issue.label }}
              </h3>

              <UBadge
                :color="priorityColor(issue.priority)"
                variant="subtle"
              >
                {{ issue.priority }} Priority
              </UBadge>
            </div>

            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ issue.mentions }} mention{{ issue.mentions === 1 ? '' : 's' }}
              · {{ formatNumber(issue.negativePercentage) }}% negative
              · {{ formatNumber(issue.positivePercentage) }}% positive
            </p>

            <p class="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {{ issue.recommendedAction }}
            </p>
          </div>

          <div class="min-w-[150px]">
            <div class="flex items-center justify-between text-[10px] font-semibold text-gray-500">
              <span>Negative</span>
              <span>{{ formatNumber(issue.negativePercentage) }}%</span>
            </div>

            <div class="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                class="h-full rounded-full bg-red-500"
                :style="{ width: `${Math.min(100, issue.negativePercentage)}%` }"
              />
            </div>
          </div>
        </article>
      </div>

      <div v-else class="px-6 py-12 text-center">
        <UIcon name="i-lucide-circle-check-big" class="mx-auto size-9 text-emerald-500" />
        <p class="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
          No priority issue detected
        </p>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          There are not enough concern-related responses in the current filtered set.
        </p>
      </div>
    </section>

    <!-- =====================================================
      STRENGTHS & CONCERNS
    ====================================================== -->
    <section class="grid gap-4 xl:grid-cols-2">
      <article
        class="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm dark:border-emerald-900 dark:bg-gray-900"
      >
        <div
          class="border-b border-emerald-100 bg-emerald-50/70 px-5 py-4 dark:border-emerald-900 dark:bg-emerald-950/20"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            >
              <UIcon name="i-lucide-thumbs-up" class="size-5" />
            </div>

            <div>
              <h2 class="text-sm font-bold text-gray-900 dark:text-white">
                What Students Appreciate
              </h2>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Representative positive observations from the current feedback set.
              </p>
            </div>
          </div>
        </div>

        <div v-if="strengthInsights.length" class="space-y-3 p-5">
          <div
            v-for="item in strengthInsights"
            :key="item"
            class="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 text-sm leading-6 text-gray-700 dark:border-emerald-900 dark:bg-emerald-950/10 dark:text-gray-300"
          >
            <span class="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span>{{ item }}</span>
          </div>
        </div>

        <div v-else class="px-5 py-10 text-center">
          <UIcon name="i-lucide-message-square-off" class="mx-auto size-8 text-gray-400" />
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No representative positive responses are available.
          </p>
        </div>
      </article>

      <article
        class="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm dark:border-amber-900 dark:bg-gray-900"
      >
        <div
          class="border-b border-amber-100 bg-amber-50/70 px-5 py-4 dark:border-amber-900 dark:bg-amber-950/20"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            >
              <UIcon name="i-lucide-wrench" class="size-5" />
            </div>

            <div>
              <h2 class="text-sm font-bold text-gray-900 dark:text-white">
                What Students Want Improved
              </h2>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Representative concerns and actionable requests from written responses.
              </p>
            </div>
          </div>
        </div>

        <div v-if="concernInsights.length" class="space-y-3 p-5">
          <div
            v-for="item in concernInsights"
            :key="item"
            class="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 text-sm leading-6 text-gray-700 dark:border-amber-900 dark:bg-amber-950/10 dark:text-gray-300"
          >
            <span class="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
            <span>{{ item }}</span>
          </div>
        </div>

        <div v-else class="px-5 py-10 text-center">
          <UIcon name="i-lucide-circle-check" class="mx-auto size-8 text-emerald-500" />
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No representative improvement concern was detected.
          </p>
        </div>
      </article>
    </section>

    <!-- =====================================================
      FILTERS
    ====================================================== -->
    <section
      class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="mb-4">
        <h2 class="text-sm font-bold text-gray-900 dark:text-white">
          Overall Feedback Filters
        </h2>

        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Search and filter feedback submissions by course and academic period.
        </p>

        <div class="mt-3 flex flex-wrap gap-2">
          <UBadge
            v-if="evaluationType"
            color="info"
            variant="subtle"
            icon="i-lucide-message-square-text"
          >
            {{ evaluationTypeLabel }}
          </UBadge>

          <UBadge
            v-if="evaluationType"
            color="neutral"
            variant="subtle"
          >
            Response Type: {{ responseTypeLabel }}
          </UBadge>
        </div>
      </div>

      <div
        class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(240px,1.25fr)_minmax(190px,1fr)_minmax(180px,0.9fr)_minmax(180px,0.9fr)]"
      >
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search student, course, or answer..."
          class="w-full"
        />

        <USelectMenu
          v-model="selectedCourse"
          :items="courseOptions"
          value-key="value"
          class="w-full"
        />

        <USelectMenu
          v-model="selectedSemester"
          :items="semesterOptions"
          value-key="value"
          class="w-full"
        />

        <USelectMenu
          v-model="selectedSchoolYear"
          :items="schoolYearOptions"
          value-key="value"
          class="w-full"
        />
      </div>

      <div
        v-if="hasActiveFilters"
        class="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-800"
      >
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
          Active filters:
        </span>

        <UBadge v-if="searchQuery" color="neutral" variant="subtle">
          Search: {{ searchQuery }}
        </UBadge>

        <UBadge
          v-if="selectedCourse !== 'all'"
          color="primary"
          variant="subtle"
        >
          {{ selectedCourse }}
        </UBadge>

        <UBadge
          v-if="selectedSemester !== 'all'"
          color="success"
          variant="subtle"
        >
          {{ selectedSemester }}
        </UBadge>

        <UBadge
          v-if="selectedSchoolYear !== 'all'"
          color="warning"
          variant="subtle"
        >
          {{ selectedSchoolYear }}
        </UBadge>

        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
          icon="i-lucide-x"
          @click="clearFilters"
        >
          Clear filters
        </UButton>
      </div>
    </section>

    <!-- =====================================================
      LOADING
    ====================================================== -->
    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-20 w-full rounded-2xl" />
      <USkeleton class="h-[420px] w-full rounded-2xl" />
    </div>

    <!-- =====================================================
      ERROR
    ====================================================== -->
    <section
      v-else-if="loadError"
      class="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <div
        class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
      >
        <UIcon name="i-lucide-triangle-alert" class="size-7" />
      </div>

      <h2 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
        Unable to load feedback
      </h2>

      <p
        class="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400"
      >
        {{ loadError }}
      </p>

      <UButton
        class="mt-5"
        icon="i-lucide-refresh-cw"
        @click="getOverallFeedbacks"
      >
        Try Again
      </UButton>
    </section>

    <template v-else>
      <!-- ===================================================
        SUBMISSION TABLE
      ==================================================== -->
      <section
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between dark:border-gray-800"
        >
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              Submission List
            </h2>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Showing {{ filteredFeedbacks.length }} feedback submission{{
                filteredFeedbacks.length === 1 ? '' : 's'
              }}.
            </p>
          </div>

          <USelect
            v-model="pageSize"
            :items="pageSizeOptions"
            class="w-full sm:w-32"
          />
        </div>

        <div v-if="!filteredFeedbacks.length" class="px-6 py-16 text-center">
          <div
            class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400"
          >
            <UIcon
              :name="
                feedbacks.length
                  ? 'i-lucide-search-x'
                  : 'i-lucide-message-square-off'
              "
              class="size-8"
            />
          </div>

          <h3 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
            {{
              feedbacks.length
                ? 'No matching feedback found'
                : 'No overall feedback available'
            }}
          </h3>

          <p
            class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400"
          >
            {{
              feedbacks.length
                ? 'Try changing or clearing the current filters.'
                : 'No overall feedback submissions were found.'
            }}
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[980px] text-sm">
            <thead
              class="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40 dark:text-gray-400"
            >
              <tr>
                <th class="px-5 py-3 text-left">Student</th>
                <th class="px-4 py-3 text-left">Course</th>
                <th class="px-4 py-3 text-left">School Year</th>
                <th class="px-4 py-3 text-left">Semester</th>
                <th class="px-4 py-3 text-center">Answers</th>
                <th class="px-4 py-3 text-left">Date</th>
                <th class="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="feedback in paginatedFeedbacks"
                :key="getFeedbackKey(feedback)"
                class="transition hover:bg-gray-50/80 dark:hover:bg-gray-950/30"
              >
                <td class="px-5 py-4">
                  <div class="flex min-w-0 items-center gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm"
                    >
                      {{ createInitials(getStudentName(feedback)) }}
                    </div>

                    <div class="min-w-0">
                      <p
                        class="truncate font-bold text-gray-900 dark:text-white"
                      >
                        {{ getStudentName(feedback) }}
                      </p>

                      <p
                        class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400"
                      >
                        {{ feedback.student?.student_id || 'No student ID' }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
                  {{ getCourseName(feedback) }}
                </td>

                <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
                  {{ getSchoolYear(feedback) }}
                </td>

                <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
                  {{ getSemester(feedback) }}
                </td>

                <td class="px-4 py-4 text-center font-semibold">
                  {{ getResponses(feedback).length }}
                </td>

                <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
                  {{ formatDate(getFeedbackDate(feedback)) }}
                </td>

                <td class="px-5 py-4 text-center">
                  <UButton
                    size="xs"
                    color="neutral"
                    variant="soft"
                    icon="i-lucide-eye"
                    @click="openFeedback(feedback)"
                  >
                    View
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="filteredFeedbacks.length"
          class="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
        >
          <p
            class="text-center text-xs text-gray-500 sm:text-left dark:text-gray-400"
          >
            Showing {{ paginationStart }}–{{ paginationEnd }} of
            {{ filteredFeedbacks.length }} submissions
          </p>

          <div class="flex items-center justify-center gap-2">
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-chevron-left"
              square
              :disabled="page <= 1"
              @click="prevPage"
            />

            <div
              class="min-w-28 rounded-xl bg-gray-100 px-3 py-2 text-center text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              Page {{ page }} of {{ totalPages }}
            </div>

            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-chevron-right"
              square
              :disabled="page >= totalPages"
              @click="nextPage"
            />
          </div>
        </div>
      </section>

      <!-- ===================================================
        OVERALL AI SENTIMENT ANALYSIS
      ==================================================== -->
      <section
        class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="border-b border-gray-200 bg-gradient-to-r from-cyan-50 via-white to-emerald-50 px-5 py-4 dark:border-gray-800 dark:from-cyan-950/20 dark:via-gray-900 dark:to-emerald-950/20"
        >
          <div
            class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"
              >
                <UIcon name="i-lucide-sparkles" class="size-5" />
              </div>

              <div>
                <h2 class="text-sm font-bold text-gray-900 dark:text-white">
                  Overall AI Sentiment Analysis
                </h2>

                <p
                  class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400"
                >
                  Consolidated sentiment analysis of the written responses
                  from the currently filtered overall feedback submissions.
                </p>
              </div>
            </div>

            <UBadge
              :color="sentimentColor(overallSentimentAnalysis.overallSentiment)"
              variant="subtle"
              size="lg"
            >
              {{ overallSentimentAnalysis.overallSentiment }}
            </UBadge>
          </div>
        </div>

        <div class="space-y-5 p-5">
          <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article
              class="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p
                    class="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400"
                  >
                    Positive
                  </p>

                  <p
                    class="mt-2 text-2xl font-black text-gray-950 dark:text-white"
                  >
                    {{ overallSentimentAnalysis.positive }}
                  </p>

                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {{
                      formatNumber(
                        overallSentimentAnalysis.positivePercentage
                      )
                    }}%
                  </p>
                </div>

                <div
                  class="flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  <UIcon name="i-lucide-smile" class="size-5" />
                </div>
              </div>
            </article>

            <article
              class="rounded-2xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p
                    class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-600 dark:text-gray-400"
                  >
                    Neutral
                  </p>

                  <p
                    class="mt-2 text-2xl font-black text-gray-950 dark:text-white"
                  >
                    {{ overallSentimentAnalysis.neutral }}
                  </p>

                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {{
                      formatNumber(
                        overallSentimentAnalysis.neutralPercentage
                      )
                    }}%
                  </p>
                </div>

                <div
                  class="flex size-10 items-center justify-center rounded-2xl bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  <UIcon name="i-lucide-meh" class="size-5" />
                </div>
              </div>
            </article>

            <article
              class="rounded-2xl border border-red-100 bg-red-50/70 p-4 dark:border-red-900/60 dark:bg-red-950/20"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p
                    class="text-[10px] font-bold uppercase tracking-[0.14em] text-red-700 dark:text-red-400"
                  >
                    Negative
                  </p>

                  <p
                    class="mt-2 text-2xl font-black text-gray-950 dark:text-white"
                  >
                    {{ overallSentimentAnalysis.negative }}
                  </p>

                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {{
                      formatNumber(
                        overallSentimentAnalysis.negativePercentage
                      )
                    }}%
                  </p>
                </div>

                <div
                  class="flex size-10 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                >
                  <UIcon name="i-lucide-frown" class="size-5" />
                </div>
              </div>
            </article>

            <article
              class="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4 dark:border-cyan-900/60 dark:bg-cyan-950/20"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p
                    class="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-400"
                  >
                    Analysed Answers
                  </p>

                  <p
                    class="mt-2 text-2xl font-black text-gray-950 dark:text-white"
                  >
                    {{ overallSentimentAnalysis.analysedAnswers }}
                  </p>

                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    of {{ filteredAnswerCount }} written answers
                  </p>
                </div>

                <div
                  class="flex size-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"
                >
                  <UIcon
                    name="i-lucide-message-square-text"
                    class="size-5"
                  />
                </div>
              </div>
            </article>
          </div>

          <div
            class="grid overflow-hidden rounded-2xl border border-gray-200 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] dark:border-gray-800"
          >
            <div class="p-5">
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-brain-circuit"
                  class="size-4 text-cyan-600 dark:text-cyan-400"
                />

                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                  Consolidated Interpretation
                </h3>
              </div>

              <p
                class="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300"
              >
                {{ overallSentimentAnalysis.summary }}
              </p>

              <div
                v-if="overallSentimentAnalysis.keywords.length"
                class="mt-4"
              >
                <p
                  class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400"
                >
                  Common AI Keywords
                </p>

                <div class="mt-2 flex flex-wrap gap-2">
                  <UBadge
                    v-for="keyword in overallSentimentAnalysis.keywords"
                    :key="keyword"
                    color="neutral"
                    variant="subtle"
                  >
                    {{ keyword }}
                  </UBadge>
                </div>
              </div>
            </div>

            <div
              class="border-t border-gray-200 bg-gray-50/70 p-5 lg:border-l lg:border-t-0 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-lightbulb"
                  class="size-4 text-amber-600 dark:text-amber-400"
                />

                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                  Recommended Focus
                </h3>
              </div>

              <ul
                v-if="overallSentimentAnalysis.suggestions.length"
                class="mt-3 space-y-3"
              >
                <li
                  v-for="(
                    suggestion, index
                  ) in overallSentimentAnalysis.suggestions"
                  :key="`${index}-${suggestion}`"
                  class="flex gap-2 text-sm leading-6 text-gray-600 dark:text-gray-300"
                >
                  <span
                    class="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500"
                  />

                  <span>{{ suggestion }}</span>
                </li>
              </ul>

              <p
                v-else
                class="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400"
              >
                No stored AI recommendations are available for the selected
                feedback records.
              </p>
            </div>
          </div>

          <div
            v-if="!overallSentimentAnalysis.analysedAnswers"
            class="rounded-2xl border border-dashed border-gray-300 px-5 py-8 text-center dark:border-gray-700"
          >
            <UIcon
              name="i-lucide-message-square-off"
              class="mx-auto size-8 text-gray-400"
            />

            <p
              class="mt-3 text-sm font-semibold text-gray-900 dark:text-white"
            >
              No written answers available for sentiment analysis
            </p>
          </div>
        </div>
      </section>

      <!-- ===================================================
        GROUPED RESPONSE ANALYTICS
      ==================================================== -->
      <section class="space-y-5">
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Grouped Response Summary
          </h2>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Each question contains its own sentiment analysis, consolidated summary, common themes, recommendations, and optional raw responses.
          </p>
        </div>

        <section
          v-for="section in groupedResponseSections"
          :key="section.name"
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-950/40"
          >
            <div>
              <h3
                class="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-white"
              >
                {{ section.name }}
              </h3>

              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ section.answerCount }} answer{{
                  section.answerCount === 1 ? '' : 's'
                }}
                across {{ section.questions.length }} question{{
                  section.questions.length === 1 ? '' : 's'
                }}.
              </p>
            </div>

            <UBadge color="info" variant="subtle">
              {{ section.questions.length }}
              question{{ section.questions.length === 1 ? '' : 's' }}
            </UBadge>
          </div>

          <div class="divide-y divide-gray-200 dark:divide-gray-800">
            <article
              v-for="question in section.questions"
              :key="question.question"
              class="p-5"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white">
                    {{ question.question }}
                  </h4>

                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {{ question.answers.length }} response{{
                      question.answers.length === 1 ? '' : 's'
                    }}
                  </p>
                </div>

                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :icon="
                    expandedQuestions.has(
                      getQuestionKey(section.name, question.question)
                    )
                      ? 'i-lucide-chevron-up'
                      : 'i-lucide-chevron-down'
                  "
                  @click="
                    toggleQuestion(
                      section.name,
                      question.question
                    )
                  "
                >
                  {{
                    expandedQuestions.has(
                      getQuestionKey(section.name, question.question)
                    )
                      ? 'Hide'
                      : 'Show'
                  }}
                </UButton>
              </div>

              <div
                v-if="
                  expandedQuestions.has(
                    getQuestionKey(section.name, question.question)
                  )
                "
                class="mt-4 space-y-4"
              >
                <section
                  class="overflow-hidden rounded-2xl border border-cyan-100 bg-cyan-50/60 dark:border-cyan-900 dark:bg-cyan-950/20"
                >
                  <div
                    class="flex flex-col gap-3 border-b border-cyan-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-cyan-900"
                  >
                    <div>
                      <p
                        class="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-400"
                      >
                        Consolidated Question Summary
                      </p>

                      <p
                        class="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300"
                      >
                        {{ getQuestionSummary(question).summary }}
                      </p>
                    </div>

                    <UBadge
                      :color="
                        sentimentColor(
                          getQuestionSummary(question).overallSentiment
                        )
                      "
                      variant="subtle"
                    >
                      {{ getQuestionSummary(question).overallSentiment }}
                    </UBadge>
                  </div>

                  <div class="grid gap-3 p-4 sm:grid-cols-3">
                    <div
                      class="rounded-xl border border-emerald-100 bg-white/80 p-3 dark:border-emerald-900 dark:bg-gray-950/30"
                    >
                      <div class="flex items-center justify-between gap-3">
                        <div>
                          <p class="text-[10px] font-bold uppercase text-emerald-600">
                            Positive
                          </p>

                          <p class="mt-1 text-xl font-black">
                            {{ getQuestionSummary(question).positive }}
                          </p>
                        </div>

                        <p class="text-sm font-black text-emerald-600">
                          {{ formatNumber(getQuestionSummary(question).positivePercentage) }}%
                        </p>
                      </div>

                      <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950">
                        <div
                          class="h-full rounded-full bg-emerald-500"
                          :style="{
                            width: `${getQuestionSummary(question).positivePercentage}%`
                          }"
                        />
                      </div>
                    </div>

                    <div
                      class="rounded-xl border border-gray-200 bg-white/80 p-3 dark:border-gray-800 dark:bg-gray-950/30"
                    >
                      <div class="flex items-center justify-between gap-3">
                        <div>
                          <p class="text-[10px] font-bold uppercase text-gray-500">
                            Neutral
                          </p>

                          <p class="mt-1 text-xl font-black">
                            {{ getQuestionSummary(question).neutral }}
                          </p>
                        </div>

                        <p class="text-sm font-black text-gray-500">
                          {{ formatNumber(getQuestionSummary(question).neutralPercentage) }}%
                        </p>
                      </div>

                      <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        <div
                          class="h-full rounded-full bg-gray-500"
                          :style="{
                            width: `${getQuestionSummary(question).neutralPercentage}%`
                          }"
                        />
                      </div>
                    </div>

                    <div
                      class="rounded-xl border border-red-100 bg-white/80 p-3 dark:border-red-900 dark:bg-gray-950/30"
                    >
                      <div class="flex items-center justify-between gap-3">
                        <div>
                          <p class="text-[10px] font-bold uppercase text-red-600">
                            Negative
                          </p>

                          <p class="mt-1 text-xl font-black">
                            {{ getQuestionSummary(question).negative }}
                          </p>
                        </div>

                        <p class="text-sm font-black text-red-600">
                          {{ formatNumber(getQuestionSummary(question).negativePercentage) }}%
                        </p>
                      </div>

                      <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-red-100 dark:bg-red-950">
                        <div
                          class="h-full rounded-full bg-red-500"
                          :style="{
                            width: `${getQuestionSummary(question).negativePercentage}%`
                          }"
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    class="grid border-t border-cyan-100 lg:grid-cols-2 dark:border-cyan-900"
                  >
                    <div class="px-4 py-4">
                      <p
                        class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400"
                      >
                        Common Themes
                      </p>

                      <div
                        v-if="getQuestionSummary(question).themes.length"
                        class="mt-2 flex flex-wrap gap-2"
                      >
                        <UBadge
                          v-for="theme in getQuestionSummary(question).themes"
                          :key="theme"
                          color="neutral"
                          variant="subtle"
                        >
                          {{ theme }}
                        </UBadge>
                      </div>

                      <p
                        v-else
                        class="mt-2 text-sm text-gray-500 dark:text-gray-400"
                      >
                        No recurring themes were detected.
                      </p>
                    </div>

                    <div
                      class="border-t border-cyan-100 bg-white/55 px-4 py-4 lg:border-l lg:border-t-0 dark:border-cyan-900 dark:bg-gray-950/20"
                    >
                      <p
                        class="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400"
                      >
                        Response-Based Recommended Actions
                      </p>

                      <p
                        class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400"
                      >
                        Generated from the written responses submitted for this specific question.
                      </p>

                      <ul
                        v-if="getQuestionSummary(question).recommendations.length"
                        class="mt-2 space-y-2"
                      >
                        <li
                          v-for="(
                            recommendation, recommendationIndex
                          ) in getQuestionSummary(question).recommendations"
                          :key="`${recommendationIndex}-${recommendation}`"
                          class="flex gap-2 text-sm leading-6 text-gray-600 dark:text-gray-300"
                        >
                          <span
                            class="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500"
                          />

                          <span>{{ recommendation }}</span>
                        </li>
                      </ul>

                      <p
                        v-else
                        class="mt-2 text-sm text-gray-500 dark:text-gray-400"
                      >
                        Continue monitoring this question in future evaluation periods.
                      </p>
                    </div>
                  </div>
                </section>

                <section
                  class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950/20"
                >
                  <div
                    class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h5 class="text-sm font-bold text-gray-900 dark:text-white">
                        Representative Responses
                      </h5>

                      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Showing up to 5 examples from
                        {{ question.answers.length }} total responses.
                      </p>
                    </div>

                    <UButton
                      color="neutral"
                      variant="soft"
                      size="xs"
                      :icon="
                        expandedRawResponses.has(
                          getQuestionKey(section.name, question.question)
                        )
                          ? 'i-lucide-eye-off'
                          : 'i-lucide-list'
                      "
                      @click="
                        toggleRawResponses(
                          section.name,
                          question.question
                        )
                      "
                    >
                      {{
                        expandedRawResponses.has(
                          getQuestionKey(section.name, question.question)
                        )
                          ? 'Hide All Responses'
                          : `View All ${question.answers.length} Responses`
                      }}
                    </UButton>
                  </div>

                  <div class="mt-4 space-y-3">
                    <div
                      v-for="(answer, index) in getVisibleAnswers(
                        section.name,
                        question
                      )"
                      :key="`${question.question}-${index}-${answer.student}`"
                      class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40"
                    >
                      <p
                        class="whitespace-pre-line text-sm leading-6 text-gray-700 dark:text-gray-300"
                      >
                        {{ answer.answer || 'No answer provided.' }}
                      </p>

                      <div
                        class="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400"
                      >
                        <span>{{ answer.student }}</span>
                        <span>•</span>
                        <span>{{ answer.course }}</span>
                        <span>•</span>
                        <span>{{ answer.semester }}</span>
                        <span>•</span>
                        <span>{{ answer.school_year }}</span>
                        <span>•</span>
                        <span>{{ formatDate(answer.date) }}</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </article>
          </div>
        </section>
      </section>
    </template>

    <!-- =====================================================
      DETAILS MODAL
    ====================================================== -->
    <UModal
      v-model:open="showDetails"
      id="overall-feedback-submission-details-dialog"
      title="Overall Feedback Submission"
      description="View the selected student's complete school-wide feedback responses."
      :ui="{ content: 'max-w-5xl' }"
    >
      <template #content>
        <div
          v-if="selectedFeedback"
          class="max-h-[88vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900"
        >
          <div
            class="relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-6 py-6 text-white"
          >
            <div
              class="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-white/10 blur-3xl"
            />

            <div class="relative flex items-start justify-between gap-4">
              <div class="flex min-w-0 items-center gap-4">
                <div
                  class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 font-bold"
                >
                  {{ createInitials(getStudentName(selectedFeedback)) }}
                </div>

                <div class="min-w-0">
                  <p
                    class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200"
                  >
                    Overall Feedback Submission
                  </p>

                  <h2 class="mt-1 truncate text-xl font-bold">
                    {{ getStudentName(selectedFeedback) }}
                  </h2>

                  <p class="mt-1 truncate text-xs text-slate-300">
                    {{ getCourseName(selectedFeedback) }}
                  </p>
                </div>
              </div>

              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                square
                class="text-white hover:bg-white/10"
                @click="showDetails = false"
              />
            </div>
          </div>

          <div class="space-y-5 p-6">
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <InfoBox
                label="Answers"
                :value="getResponses(selectedFeedback).length"
              />

              <InfoBox
                label="Semester"
                :value="getSemester(selectedFeedback)"
              />

              <InfoBox
                label="School Year"
                :value="getSchoolYear(selectedFeedback)"
              />

              <InfoBox
                label="Date"
                :value="formatDate(getFeedbackDate(selectedFeedback))"
                tone="cyan"
              />

              <InfoBox
                label="Response Type"
                :value="responseTypeLabel"
                tone="cyan"
              />
            </div>

            <section
              v-if="getResponses(selectedFeedback).length"
              class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <div
                class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                  Feedback Responses
                </h3>
              </div>

              <div class="divide-y divide-gray-200 dark:divide-gray-800">
                <article
                  v-for="(response, index) in getResponses(selectedFeedback)"
                  :key="`${response.section}-${response.question}-${index}`"
                  class="p-4"
                >
                  <div class="flex items-start gap-3">
                    <span
                      class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-xs font-bold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400"
                    >
                      {{ index + 1 }}
                    </span>

                    <div class="min-w-0">
                      <UBadge color="info" variant="subtle" size="sm">
                        {{ response.section || response.category || 'General' }}
                      </UBadge>

                      <h4
                        class="mt-2 text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                      >
                        {{ response.question || 'No question' }}
                      </h4>

                      <p
                        class="mt-2 whitespace-pre-line rounded-xl bg-gray-50 p-3 text-sm leading-6 text-gray-600 dark:bg-gray-950/40 dark:text-gray-400"
                      >
                        {{ response.answer || 'No answer provided.' }}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <div
              v-else
              class="rounded-2xl border border-dashed border-gray-300 px-5 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400"
            >
              This submission does not contain any responses.
            </div>

            <div class="flex justify-end">
              <UButton
                color="neutral"
                variant="outline"
                @click="showDetails = false"
              >
                Close
              </UButton>
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
  role: ['Admin', "HR"]
})

const { $api } = useNuxtApp()
const toast = useToast()

const InfoBox = defineComponent({
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
            props.tone === 'cyan'
              ? 'rounded-xl border border-cyan-100 bg-cyan-50 p-3 dark:border-cyan-900 dark:bg-cyan-950/20'
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
                props.tone === 'cyan'
                  ? 'mt-1 text-sm font-bold text-cyan-700 dark:text-cyan-400'
                  : 'mt-1 text-sm font-bold text-gray-800 dark:text-gray-200'
            },
            String(props.value ?? '')
          )
        ]
      )
  }
})

const loading = ref(false)
const loadError = ref('')
const feedbacks = ref<any[]>([])
const evaluationType = ref<any>(null)

const selectedFeedback = ref<any>(null)
const showDetails = ref(false)

const searchQuery = ref('')
const selectedCourse = ref('all')
const selectedSemester = ref('all')
const selectedSchoolYear = ref('all')

const page = ref(1)
const pageSize = ref(20)

const expandedQuestions = ref<Set<string>>(new Set())
const expandedRawResponses = ref<Set<string>>(new Set())

const pageSizeOptions = [
  { label: '10 rows', value: 10 },
  { label: '20 rows', value: 20 },
  { label: '50 rows', value: 50 },
  { label: '100 rows', value: 100 }
]

/* =========================================================
   EVALUATION TYPE CONFIGURATION
========================================================= */

const evaluationResponseType = computed(() => {
  return evaluationType.value?.response_type || 'text'
})

const isTextEvaluation = computed(() => {
  return evaluationResponseType.value === 'text'
})

const evaluationTypeLabel = computed(() => {
  return evaluationType.value?.name || 'Student - School'
})

const responseTypeLabel = computed(() => {
  return isTextEvaluation.value
    ? 'Text / Comment'
    : String(evaluationResponseType.value || 'Unknown')
})

const makeOptions = (
  values: any[],
  allLabel: string
) => {
  const uniqueValues = Array.from(
    new Set(
      values.filter(
        value =>
          value &&
          value !== 'N/A' &&
          value !== 'Not specified'
      )
    )
  ).sort((a, b) =>
    String(a).localeCompare(String(b))
  )

  return [
    {
      label: allLabel,
      value: 'all'
    },
    ...uniqueValues.map(value => ({
      label: String(value),
      value
    }))
  ]
}

const courseOptions = computed(() =>
  makeOptions(
    feedbacks.value.map(getCourseName),
    'All Courses'
  )
)

const semesterOptions = computed(() =>
  makeOptions(
    feedbacks.value.map(getSemester),
    'All Semesters'
  )
)

const schoolYearOptions = computed(() => {
  const options = makeOptions(
    feedbacks.value.map(getSchoolYear),
    'All School Years'
  )

  return [
    options[0],
    ...options
      .slice(1)
      .sort((a, b) =>
        String(b.value).localeCompare(
          String(a.value)
        )
      )
  ]
})

const filteredFeedbacks = computed(() => {
  const query = searchQuery.value
    .trim()
    .toLowerCase()

  return feedbacks.value.filter(feedback => {
    const responseText = getResponses(feedback)
      .map(response =>
        [
          response.section,
          response.category,
          response.question,
          response.answer
        ].join(' ')
      )
      .join(' ')

    const searchable = [
      getStudentName(feedback),
      getCourseName(feedback),
      getSemester(feedback),
      getSchoolYear(feedback),
      responseText
    ]
      .join(' ')
      .toLowerCase()

    const matchesSearch =
      !query ||
      searchable.includes(query)

    const matchesCourse =
      selectedCourse.value === 'all' ||
      getCourseName(feedback) === selectedCourse.value

    const matchesSemester =
      selectedSemester.value === 'all' ||
      getSemester(feedback) === selectedSemester.value

    const matchesSchoolYear =
      selectedSchoolYear.value === 'all' ||
      getSchoolYear(feedback) === selectedSchoolYear.value

    return (
      matchesSearch &&
      matchesCourse &&
      matchesSemester &&
      matchesSchoolYear
    )
  })
})

const groupedResponseSections = computed(() => {
  const sections = new Map<string, any>()

  filteredFeedbacks.value.forEach(feedback => {
    getResponses(feedback).forEach(response => {
      const sectionName =
        response.section ||
        response.category ||
        'General'

      const question =
        response.question ||
        'No question'

      if (!sections.has(sectionName)) {
        sections.set(sectionName, {
          name: sectionName,
          questions: new Map<string, any[]>()
        })
      }

      const section = sections.get(sectionName)

      if (!section.questions.has(question)) {
        section.questions.set(question, [])
      }

      section.questions.get(question).push({
        answer: response.answer,
        student: getStudentName(feedback),
        course: getCourseName(feedback),
        semester: getSemester(feedback),
        school_year: getSchoolYear(feedback),
        date: getFeedbackDate(feedback),

        feedback_sentiment:
          response?.feedback_sentiment ||
          response?.sentiment ||
          response?.ai_sentiment ||
          '',

        feedback_keywords:
          response?.feedback_keywords ||
          response?.sentiment_keywords ||
          response?.ai_keywords ||
          [],

        feedback_sentiment_summary:
          response?.feedback_sentiment_summary ||
          response?.sentiment_summary ||
          response?.ai_summary ||
          '',

        feedback_sentiment_suggestion:
          response?.feedback_sentiment_suggestion ||
          response?.sentiment_suggestion ||
          response?.ai_suggestion ||
          ''
      })
    })
  })

  return Array.from(sections.values())
    .map(section => {
      const questions = Array.from(
        section.questions.entries()
      ).map(([question, answers]) => ({
        question,
        answers
      }))

      return {
        name: section.name,
        questions,
        answerCount: questions.reduce(
          (sum, question) =>
            sum + question.answers.length,
          0
        )
      }
    })
    .sort((a, b) =>
      a.name.localeCompare(b.name)
    )
})

const normalizeSentiment = (value: any) => {
  const sentiment = String(value || '')
    .trim()
    .toLowerCase()

  if (
    sentiment.includes('positive') ||
    sentiment === 'good'
  ) {
    return 'Positive'
  }

  if (
    sentiment.includes('negative') ||
    sentiment === 'bad'
  ) {
    return 'Negative'
  }

  return 'Neutral'
}

const classifyResponseSentiment = (response: any) => {
  const storedSentiment =
    response?.feedback_sentiment ||
    response?.sentiment ||
    response?.ai_sentiment ||
    ''

  if (storedSentiment) {
    return normalizeSentiment(storedSentiment)
  }

  /*
   * Fallback only when no stored AI sentiment exists.
   * This is a lightweight keyword estimate, not a replacement
   * for your backend/OpenAI sentiment service.
   */
  const answer = String(response?.answer || '')
    .trim()
    .toLowerCase()

  const positiveWords = [
    'good',
    'great',
    'excellent',
    'helpful',
    'clean',
    'satisfied',
    'friendly',
    'effective',
    'comfortable',
    'organized',
    'accessible',
    'responsive'
  ]

  const negativeWords = [
    'bad',
    'poor',
    'dirty',
    'slow',
    'insufficient',
    'unavailable',
    'problem',
    'issue',
    'difficult',
    'improve',
    'crowded',
    'broken'
  ]

  const positiveScore = positiveWords.filter(
    word => answer.includes(word)
  ).length

  const negativeScore = negativeWords.filter(
    word => answer.includes(word)
  ).length

  if (positiveScore > negativeScore) {
    return 'Positive'
  }

  if (negativeScore > positiveScore) {
    return 'Negative'
  }

  return 'Neutral'
}

const formatSentimentKeywords = (value: any): string[] => {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
      .flatMap(item =>
        String(
          typeof item === 'string'
            ? item
            : item?.keyword ||
              item?.label ||
              item?.value ||
              ''
        ).split(',')
      )
      .map(item => item.trim())
      .filter(Boolean)
  }

  if (typeof value === 'object') {
    return Object.values(value)
      .flatMap(item =>
        String(item || '').split(',')
      )
      .map(item => item.trim())
      .filter(Boolean)
  }

  return String(value)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

const filteredAnswerCount = computed(() =>
  filteredFeedbacks.value.reduce(
    (total, feedback) =>
      total +
      getResponses(feedback).filter(response =>
        String(response?.answer || '').trim()
      ).length,
    0
  )
)

const overallSentimentAnalysis = computed(() => {
  const counts = {
    Positive: 0,
    Neutral: 0,
    Negative: 0
  }

  const keywords: string[] = []
  const suggestions: string[] = []
  const summaries: string[] = []

  let analysedAnswers = 0

  filteredFeedbacks.value.forEach(feedback => {
    getResponses(feedback).forEach(response => {
      const answer = String(
        response?.answer || ''
      ).trim()

      if (!answer) {
        return
      }

      analysedAnswers += 1

      const sentiment =
        classifyResponseSentiment(response)

      counts[sentiment] += 1

      keywords.push(
        ...formatSentimentKeywords(
          response?.feedback_keywords ||
          response?.sentiment_keywords ||
          response?.ai_keywords
        )
      )

      const summaryText = String(
        response?.feedback_sentiment_summary ||
        response?.sentiment_summary ||
        response?.ai_summary ||
        ''
      ).trim()

      if (summaryText) {
        summaries.push(summaryText)
      }

      const suggestionText = String(
        response?.feedback_sentiment_suggestion ||
        response?.sentiment_suggestion ||
        response?.ai_suggestion ||
        ''
      ).trim()

      if (suggestionText) {
        suggestions.push(suggestionText)
      }
    })
  })

  const total =
    counts.Positive +
    counts.Neutral +
    counts.Negative

  let overallSentiment = 'Neutral'

  if (
    counts.Positive > counts.Neutral &&
    counts.Positive > counts.Negative
  ) {
    overallSentiment = 'Positive'
  } else if (
    counts.Negative > counts.Positive &&
    counts.Negative > counts.Neutral
  ) {
    overallSentiment = 'Negative'
  }

  const uniqueKeywords = Array.from(
    new Set(
      keywords.map(keyword =>
        keyword.toLowerCase()
      )
    )
  ).slice(0, 12)

  const uniqueSuggestions = Array.from(
    new Set(suggestions)
  ).slice(0, 8)

  const summary =
    summaries[0] ||
    (
      analysedAnswers
        ? `The currently filtered school-wide feedback is predominantly ${overallSentiment.toLowerCase()}. This consolidated result is based on ${analysedAnswers} written answer${
            analysedAnswers === 1 ? '' : 's'
          } from ${filteredFeedbacks.value.length} submission${
            filteredFeedbacks.value.length === 1 ? '' : 's'
          }.`
        : 'No written student answers are available for sentiment analysis.'
    )

  return {
    overallSentiment,
    positive: counts.Positive,
    neutral: counts.Neutral,
    negative: counts.Negative,
    analysedAnswers,

    positivePercentage: total
      ? (counts.Positive / total) * 100
      : 0,

    neutralPercentage: total
      ? (counts.Neutral / total) * 100
      : 0,

    negativePercentage: total
      ? (counts.Negative / total) * 100
      : 0,

    keywords: uniqueKeywords,
    suggestions: uniqueSuggestions,
    summary
  }
})

const sentimentColor = (sentiment: any) => {
  const value = normalizeSentiment(sentiment)

  if (value === 'Positive') {
    return 'success'
  }

  if (value === 'Negative') {
    return 'error'
  }

  return 'neutral'
}

const formatNumber = (value: any) => {
  const number = Number(value)

  return Number.isFinite(number)
    ? number.toFixed(2)
    : '0.00'
}

const summary = computed(() => {
  const studentKeys = new Set(
    feedbacks.value
      .map(
        feedback =>
          feedback?.student?.documentId ||
          feedback?.student?.id ||
          feedback?.evaluator_user?.documentId ||
          feedback?.evaluator_user?.id ||
          getStudentName(feedback)
      )
      .filter(Boolean)
  )

  const sectionKeys = new Set<string>()
  let totalAnswers = 0

  feedbacks.value.forEach(feedback => {
    getResponses(feedback).forEach(response => {
      totalAnswers += 1

      sectionKeys.add(
        response.section ||
        response.category ||
        'General'
      )
    })
  })

  return {
    totalSubmissions: feedbacks.value.length,
    totalStudents: studentKeys.size,
    totalAnswers,
    totalSections: sectionKeys.size
  }
})

const hasActiveFilters = computed(() =>
  Boolean(
    searchQuery.value ||
    selectedCourse.value !== 'all' ||
    selectedSemester.value !== 'all' ||
    selectedSchoolYear.value !== 'all'
  )
)

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(
      filteredFeedbacks.value.length /
      Number(pageSize.value)
    )
  )
)

const paginatedFeedbacks = computed(() => {
  const size = Number(pageSize.value)
  const start = (page.value - 1) * size

  return filteredFeedbacks.value.slice(
    start,
    start + size
  )
})

const paginationStart = computed(() =>
  filteredFeedbacks.value.length
    ? (page.value - 1) *
        Number(pageSize.value) +
      1
    : 0
)

const paginationEnd = computed(() =>
  Math.min(
    page.value * Number(pageSize.value),
    filteredFeedbacks.value.length
  )
)

const getStudentName = (feedback: any) => {
  const student = feedback?.student
  const evaluator = feedback?.evaluator_user

  const firstName =
    student?.first_name ||
    student?.user_info?.first_name ||
    evaluator?.user_info?.first_name ||
    ''

  const middleName =
    student?.middle_name ||
    student?.user_info?.middle_name ||
    evaluator?.user_info?.middle_name ||
    ''

  const lastName =
    student?.last_name ||
    student?.user_info?.last_name ||
    evaluator?.user_info?.last_name ||
    ''

  const constructedName = [
    firstName,
    middleName,
    lastName
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  return (
    student?.name ||
    student?.full_name ||
    constructedName ||
    evaluator?.name ||
    evaluator?.full_name ||
    evaluator?.username ||
    evaluator?.email ||
    student?.student_id ||
    'Unknown Student'
  )
}

const getCourseName = (feedback: any) =>
  feedback?.course?.code ||
  feedback?.course?.name ||
  'N/A'

const getSemester = (feedback: any) =>
  feedback?.semester || 'N/A'

const getSchoolYear = (feedback: any) =>
  feedback?.school_year || 'N/A'

const getFeedbackDate = (feedback: any) =>
  feedback?.date ||
  feedback?.submittedAt ||
  feedback?.createdAt ||
  null

const getResponses = (feedback: any) => {
  const responses =
    feedback?.responses ||
    feedback?.answers ||
    []

  return Array.isArray(responses)
    ? responses
    : []
}

const getFeedbackKey = (feedback: any) =>
  feedback?.documentId ||
  feedback?.id ||
  `${getStudentName(feedback)}-${getFeedbackDate(feedback)}`

const getQuestionKey = (
  section: string,
  question: string
) =>
  `${section}::${question}`

const toggleQuestion = (
  section: string,
  question: string
) => {
  const key = getQuestionKey(
    section,
    question
  )

  const next = new Set(
    expandedQuestions.value
  )

  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }

  expandedQuestions.value = next
}

const stopWords = new Set([
  'the',
  'and',
  'for',
  'that',
  'this',
  'with',
  'from',
  'have',
  'has',
  'had',
  'was',
  'were',
  'are',
  'but',
  'not',
  'very',
  'more',
  'much',
  'can',
  'could',
  'would',
  'should',
  'there',
  'their',
  'they',
  'them',
  'our',
  'your',
  'you',
  'its',
  'into',
  'about',
  'because',
  'also',
  'just',
  'really',
  'still',
  'school',
  'student',
  'students'
])

/* =========================================================
   MANAGEMENT INSIGHTS
========================================================= */

const feedbackTopicDefinitions = [
  {
    key: 'internet',
    label: 'Internet / Wi-Fi',
    keywords: ['internet', 'wifi', 'wi-fi', 'network', 'signal', 'connection', 'connectivity'],
    action: 'Conduct a network coverage and reliability assessment in the areas most frequently mentioned by students, then prioritise access-point adjustment, repair, or capacity upgrades.'
  },
  {
    key: 'facilities',
    label: 'Classrooms & Facilities',
    keywords: ['classroom', 'facility', 'facilities', 'chair', 'desk', 'aircon', 'air conditioning', 'fan', 'lighting', 'room', 'building', 'ventilation'],
    action: 'Inspect the classrooms and facility items most frequently mentioned by students and prepare a prioritised repair, replacement, ventilation, lighting, or seating plan.'
  },
  {
    key: 'office-services',
    label: 'Office / Student Services',
    keywords: ['registrar', 'cashier', 'accounting', 'admission', 'guidance', 'office', 'service', 'queue', 'waiting', 'staff'],
    action: 'Review the most frequently mentioned student-service process, identify causes of delay or poor assistance, and set a measurable response-time or service-quality target.'
  },
  {
    key: 'library',
    label: 'Library & Learning Resources',
    keywords: ['library', 'book', 'books', 'reference', 'resources', 'learning resource', 'materials'],
    action: 'Review frequently requested books, references, digital materials, and library services, then prioritise the resources students report as limited or unavailable.'
  },
  {
    key: 'canteen',
    label: 'Canteen & Food Services',
    keywords: ['canteen', 'food', 'meal', 'price', 'affordable', 'water', 'drinking water'],
    action: 'Coordinate with the canteen operator to address recurring concerns about food quality, price, sanitation, variety, serving time, or drinking-water availability.'
  },
  {
    key: 'safety',
    label: 'Safety & Security',
    keywords: ['safety', 'safe', 'security', 'guard', 'gate', 'hazard', 'emergency'],
    action: 'Validate the reported safety concerns through an on-site inspection and assign corrective action to the responsible security or facilities personnel.'
  },
  {
    key: 'communication',
    label: 'Announcements & Communication',
    keywords: ['announcement', 'communication', 'information', 'notice', 'update', 'schedule'],
    action: 'Improve official communication by addressing the timing, clarity, completeness, and channel used for announcements most frequently mentioned by students.'
  },
  {
    key: 'activities',
    label: 'Student Activities & Programs',
    keywords: ['activity', 'activities', 'event', 'program', 'seminar', 'training', 'orientation'],
    action: 'Use the recurring comments to improve the schedule, content, variety, announcement, or delivery of future student activities and programs.'
  },
  {
    key: 'teaching',
    label: 'Teaching & Learning Experience',
    keywords: ['teacher', 'faculty', 'teaching', 'instruction', 'lesson', 'class', 'subject'],
    action: 'Review recurring instructional concerns with the appropriate academic unit and provide targeted support on lesson clarity, pacing, consultation, or feedback.'
  }
]

const allFilteredAnswers = computed(() => {
  const rows: any[] = []

  filteredFeedbacks.value.forEach(feedback => {
    getResponses(feedback).forEach(response => {
      const answer = String(response?.answer || '').trim()

      if (!answer) {
        return
      }

      rows.push({
        answer,
        response,
        student: getStudentName(feedback),
        course: getCourseName(feedback),
        semester: getSemester(feedback),
        schoolYear: getSchoolYear(feedback)
      })
    })
  })

  return rows
})

const getTopicMatches = (answer: string) => {
  const value = String(answer || '').toLowerCase()

  return feedbackTopicDefinitions.filter(topic =>
    topic.keywords.some(keyword =>
      value.includes(keyword)
    )
  )
}

const topicInsights = computed(() => {
  const map = new Map<string, any>()

  feedbackTopicDefinitions.forEach(topic => {
    map.set(topic.key, {
      ...topic,
      mentions: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
      examples: []
    })
  })

  allFilteredAnswers.value.forEach(item => {
    const matches = getTopicMatches(item.answer)

    matches.forEach(topic => {
      const record = map.get(topic.key)
      const sentiment = classifyResponseSentiment(item.response)

      record.mentions += 1
      record[sentiment.toLowerCase()] += 1

      if (record.examples.length < 5) {
        record.examples.push(item.answer)
      }
    })
  })

  return Array.from(map.values())
    .filter(item => item.mentions > 0)
    .map(item => {
      const total = item.mentions || 1
      const negativePercentage =
        (item.negative / total) * 100
      const positivePercentage =
        (item.positive / total) * 100
      const neutralPercentage =
        (item.neutral / total) * 100

      let priority = 'Low'

      if (
        negativePercentage >= 40 ||
        (item.negative >= 3 && negativePercentage >= 30)
      ) {
        priority = 'High'
      } else if (
        negativePercentage >= 20 ||
        item.negative >= 2
      ) {
        priority = 'Medium'
      }

      const priorityScore =
        item.negative * 4 +
        item.neutral * 1.25 +
        item.mentions * 0.5

      return {
        ...item,
        negativePercentage,
        positivePercentage,
        neutralPercentage,
        priority,
        priorityScore,
        recommendedAction: item.action
      }
    })
    .sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore
      }

      return b.mentions - a.mentions
    })
})

const priorityIssues = computed(() =>
  topicInsights.value
    .filter(item =>
      item.negative > 0 ||
      item.priority !== 'Low'
    )
    .slice(0, 6)
)

const priorityColor = (priority: any) => {
  const value = String(priority || '').toLowerCase()

  if (value === 'high') {
    return 'error'
  }

  if (value === 'medium') {
    return 'warning'
  }

  return 'neutral'
}

const compactInsight = (value: string, max = 170) => {
  const cleaned = String(value || '')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleaned.length <= max) {
    return cleaned
  }

  return `${cleaned.slice(0, max - 3)}...`
}

const strengthInsights = computed(() => {
  const values = allFilteredAnswers.value
    .filter(item =>
      classifyResponseSentiment(item.response) === 'Positive'
    )
    .map(item => compactInsight(item.answer))
    .filter(Boolean)

  return Array.from(new Set(values)).slice(0, 6)
})

const concernInsights = computed(() => {
  const values = allFilteredAnswers.value
    .filter(item => {
      const sentiment =
        classifyResponseSentiment(item.response)

      const answer = item.answer.toLowerCase()

      return (
        sentiment === 'Negative' ||
        [
          'need',
          'needs',
          'improve',
          'problem',
          'issue',
          'lack',
          'limited',
          'slow',
          'broken',
          'dirty',
          'crowded',
          'unavailable',
          'insufficient'
        ].some(word => answer.includes(word))
      )
    })
    .map(item => compactInsight(item.answer))
    .filter(Boolean)

  return Array.from(new Set(values)).slice(0, 6)
})

const executiveSummary = computed(() => {
  const topMentioned = [...topicInsights.value]
    .sort((a, b) => b.mentions - a.mentions)[0]

  const topPositive = [...topicInsights.value]
    .filter(item => item.positive > 0)
    .sort((a, b) => {
      if (b.positivePercentage !== a.positivePercentage) {
        return b.positivePercentage - a.positivePercentage
      }

      return b.positive - a.positive
    })[0]

  const topConcern = priorityIssues.value[0]

  return {
    topStrength:
      topPositive?.label ||
      (strengthInsights.value.length
        ? 'Positive written feedback'
        : 'No dominant strength detected'),

    topConcern:
      topConcern?.label ||
      'No major concern detected',

    mostMentionedTheme:
      topMentioned?.label ||
      'No recurring theme detected',

    highestPriority:
      topConcern?.label ||
      'No priority issue detected',

    highestPriorityLevel:
      topConcern?.priority || 'Low',

    recommendedAction:
      topConcern?.recommendedAction ||
      'Continue monitoring written feedback and compare the same questions in the next evaluation period.'
  }
})

const includesAny = (
  value: string,
  keywords: string[]
) =>
  keywords.some(keyword =>
    value.includes(keyword)
  )

const extractActionableResponses = (
  answers: any[]
) => {
  const actionableWords = [
    'add',
    'need',
    'needs',
    'more',
    'less',
    'improve',
    'provide',
    'increase',
    'reduce',
    'repair',
    'replace',
    'upgrade',
    'maintain',
    'clean',
    'organize',
    'organise',
    'allow',
    'extend',
    'open',
    'install',
    'monitor',
    'fix',
    'better',
    'faster',
    'earlier',
    'accessible',
    'available',
    'comfortable',
    'clearer',
    'stronger',
    'updated',
    'modern',
    'enough',
    'limited',
    'few',
    'sometimes',
    'occasionally'
  ]

  return answers
    .map((answer: any) =>
      String(answer?.answer || '').trim()
    )
    .filter(Boolean)
    .filter(answer => {
      const value = answer.toLowerCase()

      return actionableWords.some(word =>
        value.includes(word)
      )
    })
    .slice(0, 10)
}

const extractConcernPhrases = (
  answers: any[]
) => {
  const concernWords = [
    'bad',
    'poor',
    'dirty',
    'slow',
    'weak',
    'broken',
    'damaged',
    'limited',
    'insufficient',
    'unavailable',
    'unsafe',
    'crowded',
    'hot',
    'expensive',
    'delayed',
    'unclear',
    'difficult',
    'problem',
    'issue',
    'improve',
    'lack',
    'not working',
    'no internet',
    'long wait',
    'late',
    'rude',
    'unfriendly'
  ]

  return answers
    .map((answer: any) =>
      String(answer?.answer || '').trim()
    )
    .filter(Boolean)
    .filter(answer => {
      const value = answer.toLowerCase()

      return concernWords.some(word =>
        value.includes(word)
      )
    })
    .slice(0, 8)
}

const extractPositivePhrases = (
  answers: any[]
) => {
  const positiveWords = [
    'good',
    'great',
    'excellent',
    'helpful',
    'clean',
    'friendly',
    'effective',
    'comfortable',
    'organized',
    'accessible',
    'responsive',
    'satisfied'
  ]

  return answers
    .map((answer: any) =>
      String(answer?.answer || '').trim()
    )
    .filter(Boolean)
    .filter(answer => {
      const value = answer.toLowerCase()

      return positiveWords.some(word =>
        value.includes(word)
      )
    })
    .slice(0, 5)
}

const createActionFromNeutralResponse = ({
  question,
  response,
  themes
}: {
  question: string
  response: string
  themes: string[]
}) => {
  const questionText = String(
    question || ''
  ).toLowerCase()

  const responseText = String(
    response || ''
  ).toLowerCase()

  const combined = `${questionText} ${responseText} ${themes.join(
    ' '
  )}`

  if (
    includesAny(combined, [
      'clean',
      'restroom',
      'comfort room',
      'toilet',
      'trash',
      'garbage',
      'waste'
    ])
  ) {
    return 'Review the comments for this question and adjust the cleaning schedule, inspection frequency, or waste-management arrangements in the areas specifically mentioned by students.'
  }

  if (
    includesAny(combined, [
      'internet',
      'wifi',
      'wi-fi',
      'network',
      'signal',
      'computer',
      'laboratory',
      'lab'
    ])
  ) {
    return 'Assess the internet, Wi-Fi, computer, or laboratory concern mentioned in the neutral responses and implement the specific improvement most frequently requested by students.'
  }

  if (
    includesAny(combined, [
      'service',
      'office',
      'staff',
      'registrar',
      'cashier',
      'accounting',
      'admission',
      'guidance',
      'waiting',
      'queue'
    ])
  ) {
    return 'Review the neutral comments about office service and improve the specific process, response time, courtesy, or accessibility issue mentioned by students.'
  }

  if (
    includesAny(combined, [
      'facility',
      'classroom',
      'chair',
      'desk',
      'aircon',
      'air conditioning',
      'fan',
      'lighting',
      'room',
      'building'
    ])
  ) {
    return 'Inspect the classroom or facility item mentioned in the responses and carry out the requested repair, replacement, adjustment, or additional provision where feasible.'
  }

  if (
    includesAny(combined, [
      'library',
      'book',
      'reference',
      'learning resource',
      'resources'
    ])
  ) {
    return 'Use the neutral comments to identify the specific books, references, digital materials, or library services students want improved or made more available.'
  }

  if (
    includesAny(combined, [
      'canteen',
      'food',
      'meal',
      'price',
      'water'
    ])
  ) {
    return 'Review the canteen-related comments and address the specific request concerning price, food variety, sanitation, serving time, or drinking-water availability.'
  }

  if (
    includesAny(combined, [
      'teacher',
      'faculty',
      'teaching',
      'instruction',
      'lesson',
      'class'
    ])
  ) {
    return 'Review the neutral instructional comments and address the specific request related to lesson clarity, pacing, examples, consultation, or feedback.'
  }

  if (
    includesAny(combined, [
      'announcement',
      'communication',
      'information',
      'notice',
      'update'
    ])
  ) {
    return 'Improve the communication process based on the exact student comments, especially the timing, clarity, completeness, or channel used for announcements.'
  }

  if (
    includesAny(combined, [
      'activity',
      'event',
      'program',
      'seminar',
      'training',
      'orientation'
    ])
  ) {
    return 'Use the comments under this question to adjust the schedule, content, variety, or announcement of future student activities.'
  }

  const shortened =
    response.length > 140
      ? `${response.slice(0, 137)}...`
      : response

  return `Translate this student observation into a specific improvement task: “${shortened}” Assign the most relevant office and define a measurable completion target.`
}

const createActionFromConcern = ({
  question,
  concern,
  themes
}: {
  question: string
  concern: string
  themes: string[]
}) => {
  const questionText = String(
    question || ''
  ).toLowerCase()

  const concernText = String(
    concern || ''
  ).toLowerCase()

  const combined = `${questionText} ${concernText} ${themes.join(
    ' '
  )}`

  if (
    includesAny(combined, [
      'clean',
      'dirty',
      'restroom',
      'comfort room',
      'toilet',
      'trash',
      'garbage'
    ])
  ) {
    return 'Increase cleaning and inspection frequency in the specific areas repeatedly mentioned by students, then document each completed cleaning round.'
  }

  if (
    includesAny(combined, [
      'internet',
      'wifi',
      'wi-fi',
      'network',
      'signal',
      'computer',
      'laboratory',
      'lab'
    ])
  ) {
    return 'Conduct a technical inspection of the reported internet, Wi-Fi, computer, or laboratory issue and prioritise repair or replacement based on the frequency of student complaints.'
  }

  if (
    includesAny(combined, [
      'service',
      'office',
      'registrar',
      'cashier',
      'accounting',
      'admission',
      'guidance',
      'waiting',
      'queue',
      'staff'
    ])
  ) {
    return 'Review the service process mentioned in the responses, identify the cause of delays or poor assistance, and establish a measurable response-time standard.'
  }

  if (
    includesAny(combined, [
      'facility',
      'classroom',
      'chair',
      'desk',
      'aircon',
      'air conditioning',
      'fan',
      'lighting',
      'room',
      'building'
    ])
  ) {
    return 'Inspect the classrooms or facilities identified by students and prepare a prioritised repair, replacement, ventilation, lighting, or seating plan.'
  }

  if (
    includesAny(combined, [
      'security',
      'safety',
      'safe',
      'guard',
      'gate',
      'hazard',
      'emergency'
    ])
  ) {
    return 'Validate the reported safety concern through an on-site inspection and assign corrective action to the responsible security or facilities personnel.'
  }

  if (
    includesAny(combined, [
      'library',
      'book',
      'reference',
      'learning resource'
    ])
  ) {
    return 'Review the requested or unavailable library resources mentioned by students and prioritise frequently requested books, references, or digital materials.'
  }

  if (
    includesAny(combined, [
      'canteen',
      'food',
      'meal',
      'price',
      'water'
    ])
  ) {
    return 'Coordinate with the canteen operator to address the specific concerns raised about food quality, affordability, sanitation, variety, or drinking-water availability.'
  }

  if (
    includesAny(combined, [
      'teacher',
      'faculty',
      'teaching',
      'instruction',
      'lesson',
      'class'
    ])
  ) {
    return 'Discuss the recurring instructional concerns with the responsible academic unit and provide targeted support on lesson clarity, pacing, preparation, or feedback.'
  }

  if (
    includesAny(combined, [
      'announcement',
      'communication',
      'information',
      'notice',
      'update'
    ])
  ) {
    return 'Standardise official announcements and release complete information earlier through recognised school communication channels.'
  }

  if (
    includesAny(combined, [
      'activity',
      'event',
      'program',
      'seminar',
      'training',
      'orientation'
    ])
  ) {
    return 'Use the specific concerns and interests stated by students to improve the schedule, content, announcement, and delivery of future activities.'
  }

  const shortenedConcern =
    concern.length > 120
      ? `${concern.slice(0, 117)}...`
      : concern

  return `Review and validate the recurring concern expressed in the responses: “${shortenedConcern}” Then assign the responsible office to prepare and document a corrective action.`
}

const buildQuestionRecommendations = ({
  question,
  answers,
  themes,
  overallSentiment,
  positivePercentage,
  neutralPercentage,
  negativePercentage
}: any) => {
  const actions: string[] = []

  const addAction = (action: string) => {
    const normalized = action
      .trim()
      .toLowerCase()

    if (
      action &&
      !actions.some(
        existing =>
          existing.trim().toLowerCase() ===
          normalized
      )
    ) {
      actions.push(action)
    }
  }

  const concerns =
    extractConcernPhrases(answers)

  const actionableResponses =
    extractActionableResponses(answers)

  const positiveResponses =
    extractPositivePhrases(answers)

  /*
   * Recommendations are produced from the actual responses
   * belonging to this question. Each detected concern is turned
   * into a practical action that still considers the wording and
   * topic of the question.
   */
  concerns.forEach(concern => {
    addAction(
      createActionFromConcern({
        question,
        concern,
        themes
      })
    )
  })

  /*
   * Neutral does not mean that no action is possible.
   * Comments such as "add more chairs", "sometimes slow",
   * "needs clearer announcements", or "more books are needed"
   * are converted into response-based actions even when the
   * sentiment classifier labels them Neutral.
   */
  if (overallSentiment === 'Neutral') {
    actionableResponses.forEach(response => {
      addAction(
        createActionFromNeutralResponse({
          question,
          response,
          themes
        })
      )
    })
  }

  /*
   * When responses are mostly positive, preserve the practices
   * that students explicitly appreciated.
   */
  if (
    overallSentiment === 'Positive' &&
    positiveResponses.length
  ) {
    const example = positiveResponses[0]
    const shortened =
      example.length > 120
        ? `${example.slice(0, 117)}...`
        : example

    addAction(
      `Maintain and standardise the practice reflected in this positive response: “${shortened}”`
    )
  }

  /*
   * Add question-level management actions based on the actual
   * negative and neutral response rates.
   */
  if (negativePercentage >= 40) {
    addAction(
      'Treat this question as a priority improvement area, assign an accountable office, and require a dated corrective-action and progress report.'
    )
  } else if (negativePercentage >= 20) {
    addAction(
      'Include this question in the next departmental review and require the responsible office to address the recurring concerns identified in the responses.'
    )
  }

  if (
    neutralPercentage >= 40 &&
    concerns.length === 0
  ) {
    const neutralThemes = themes
      .slice(0, 3)
      .join(', ')

    if (neutralThemes) {
      addAction(
        `Clarify and improve the student experience related to ${neutralThemes} because many responses were neutral rather than clearly positive.`
      )

      addAction(
        `Review current practices connected to ${neutralThemes} and identify small, measurable improvements that may increase student satisfaction.`
      )
    } else {
      addAction(
        'Review the written responses for this question and identify which parts of the student experience were neither clearly satisfactory nor clearly problematic.'
      )
    }
  }

  if (!actions.length) {
    if (overallSentiment === 'Positive') {
      addAction(
        'Maintain the practices that received favourable responses and continue monitoring this question in the next evaluation period.'
      )
    } else if (
      overallSentiment === 'Neutral'
    ) {
      if (actionableResponses.length) {
        actionableResponses
          .slice(0, 3)
          .forEach(response => {
            addAction(
              createActionFromNeutralResponse({
                question,
                response,
                themes
              })
            )
          })
      } else if (themes.length) {
        addAction(
          `Review the neutral comments connected to ${themes
            .slice(0, 3)
            .join(', ')} and implement the most repeated student request as a specific improvement task.`
        )

        addAction(
          `Assign the responsible office to verify which concern related to ${themes
            .slice(0, 3)
            .join(', ')} appears most often in the comments and act on that concern first.`
        )
      } else {
        addAction(
          'Read the neutral comments for this question, identify the most repeated suggestion or observation, and convert it into a specific action with an assigned office and target date.'
        )
      }
    } else {
      addAction(
        themes.length
          ? `Review the responses related to ${themes
              .slice(0, 3)
              .join(', ')} and validate the specific improvements expected by students.`
          : 'Review the original responses for this question and identify the most frequently reported concern before deciding on corrective action.'
      )
    }
  }

  if (
    actions.length &&
    overallSentiment !== 'Positive'
  ) {
    addAction(
      `After implementing the recommended actions, measure the same question again and compare the positive, neutral, and negative response percentages.`
    )
  }

  return actions.slice(0, 5)
}

const getQuestionSummary = (question: any) => {
  const counts = {
    Positive: 0,
    Neutral: 0,
    Negative: 0
  }

  const wordFrequency = new Map<string, number>()
  const storedKeywords: string[] = []
  const storedSummaries: string[] = []
  const storedSuggestions: string[] = []

  question.answers.forEach((answer: any) => {
    const response = {
      answer: answer?.answer || '',
      feedback_sentiment:
        answer?.feedback_sentiment ||
        answer?.sentiment ||
        answer?.ai_sentiment ||
        ''
    }

    const sentiment =
      classifyResponseSentiment(response)

    counts[sentiment] += 1

    storedKeywords.push(
      ...formatSentimentKeywords(
        answer?.feedback_keywords ||
        answer?.sentiment_keywords ||
        answer?.ai_keywords
      )
    )

    const storedSummary = String(
      answer?.feedback_sentiment_summary ||
      answer?.sentiment_summary ||
      answer?.ai_summary ||
      ''
    ).trim()

    if (storedSummary) {
      storedSummaries.push(storedSummary)
    }

    const storedSuggestion = String(
      answer?.feedback_sentiment_suggestion ||
      answer?.sentiment_suggestion ||
      answer?.ai_suggestion ||
      ''
    ).trim()

    if (storedSuggestion) {
      storedSuggestions.push(storedSuggestion)
    }

    String(answer?.answer || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .map(word => word.trim())
      .filter(
        word =>
          word.length >= 4 &&
          !stopWords.has(word)
      )
      .forEach(word => {
        wordFrequency.set(
          word,
          (wordFrequency.get(word) || 0) + 1
        )
      })
  })

  const total = question.answers.length

  let overallSentiment = 'Neutral'

  if (
    counts.Positive > counts.Neutral &&
    counts.Positive > counts.Negative
  ) {
    overallSentiment = 'Positive'
  } else if (
    counts.Negative > counts.Positive &&
    counts.Negative > counts.Neutral
  ) {
    overallSentiment = 'Negative'
  }

  const extractedThemes = Array.from(
    wordFrequency.entries()
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([word]) => word)

  const themes = Array.from(
    new Set([
      ...storedKeywords.map(keyword =>
        String(keyword).toLowerCase()
      ),
      ...extractedThemes
    ])
  ).slice(0, 8)

  const positivePercentage = total
    ? (counts.Positive / total) * 100
    : 0

  const neutralPercentage = total
    ? (counts.Neutral / total) * 100
    : 0

  const negativePercentage = total
    ? (counts.Negative / total) * 100
    : 0

  const dominantText =
    overallSentiment === 'Positive'
      ? `Most responses are favourable, with ${formatNumber(
          positivePercentage
        )}% classified as positive.`
      : overallSentiment === 'Negative'
        ? `The responses indicate notable concerns, with ${formatNumber(
            negativePercentage
          )}% classified as negative.`
        : `The responses are generally mixed or neutral, with ${formatNumber(
            neutralPercentage
          )}% classified as neutral.`

  const themeText = themes.length
    ? `The most frequently mentioned themes include ${themes
        .slice(0, 5)
        .join(', ')}.`
    : 'No recurring themes were detected from the available responses.'

  const fallbackSummary = `${total} student response${
    total === 1 ? '' : 's'
  } were analysed for this question. ${dominantText} ${themeText}`

  const recommendations = Array.from(
    new Set(storedSuggestions)
  ).slice(0, 5)

  if (!recommendations.length) {
    recommendations.push(
      ...buildQuestionRecommendations({
        question: question.question,
        answers: question.answers,
        themes,
        overallSentiment,
        positivePercentage,
        neutralPercentage,
        negativePercentage
      })
    )
  }

  return {
    positive: counts.Positive,
    neutral: counts.Neutral,
    negative: counts.Negative,

    positivePercentage,
    neutralPercentage,
    negativePercentage,

    overallSentiment,
    themes,
    recommendations: recommendations.slice(0, 5),

    summary:
      storedSummaries[0] ||
      fallbackSummary
  }
}

const toggleRawResponses = (
  section: string,
  question: string
) => {
  const key = getQuestionKey(
    section,
    question
  )

  const next = new Set(
    expandedRawResponses.value
  )

  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }

  expandedRawResponses.value = next
}

const getVisibleAnswers = (
  section: string,
  question: any
) => {
  const key = getQuestionKey(
    section,
    question.question
  )

  if (expandedRawResponses.value.has(key)) {
    return question.answers
  }

  return question.answers.slice(0, 5)
}

const createInitials = (value: string) =>
  String(value || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part =>
      part.charAt(0).toUpperCase()
    )
    .join('')

const formatDate = (value: any) => {
  if (!value) {
    return 'N/A'
  }

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

const getEvaluationType = async () => {
  const response: any = await $api(
    '/evaluation-types',
    {
      query: {
        'filters[code][$eq]': 'student-school',
        'pagination[pageSize]': 1
      }
    }
  )

  evaluationType.value =
    response?.data?.[0] || null

  if (!evaluationType.value) {
    throw new Error(
      'Student-School evaluation type is not configured.'
    )
  }

  if (!isTextEvaluation.value) {
    throw new Error(
      'Student-School must use a Text / Comment response type.'
    )
  }
}

const getOverallFeedbacks = async () => {
  loading.value = true
  loadError.value = ''

  try {
    if (!evaluationType.value) {
      await getEvaluationType()
    }

    if (!isTextEvaluation.value) {
      throw new Error(
        'The Student-School evaluation type is not configured as Text / Comment.'
      )
    }

    const query: any = {
      'populate[student]':
        true,

      'populate[course]':
        true,

      'populate[evaluator_user][populate][0]':
        'user_info',

      'sort[0]':
        'createdAt:desc',

      'pagination[pageSize]':
        10000
    }

    const res: any = await $api(
      '/overall-feedbacks',
      {
        query
      }
    )

    feedbacks.value =
      res.data || []

    page.value = 1
  } catch (error: any) {
    console.error(
      'Overall feedback loading error:',
      error
    )

    feedbacks.value = []

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to load overall feedback submissions.'

    toast.add({
      title: 'Unable to load feedback',
      description: loadError.value,
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCourse.value = 'all'
  selectedSemester.value = 'all'
  selectedSchoolYear.value = 'all'
  page.value = 1
}

const prevPage = async () => {
  if (page.value <= 1) {
    return
  }

  page.value -= 1
  await scrollToTable()
}

const nextPage = async () => {
  if (page.value >= totalPages.value) {
    return
  }

  page.value += 1
  await scrollToTable()
}

const scrollToTable = async () => {
  await nextTick()

  if (!import.meta.client) {
    return
  }

  window.scrollTo({
    top: 500,
    behavior: 'smooth'
  })
}

const openFeedback = (feedback: any) => {
  selectedFeedback.value = feedback
  showDetails.value = true
}

watch(
  [
    searchQuery,
    selectedCourse,
    selectedSemester,
    selectedSchoolYear,
    pageSize
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

onMounted(async () => {
  try {
    await getEvaluationType()
    await getOverallFeedbacks()
  } catch (error: any) {
    console.error(
      'Student-School results initialization error:',
      error
    )

    feedbacks.value = []

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to initialize Student - School overall feedback results.'
  }
})
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
