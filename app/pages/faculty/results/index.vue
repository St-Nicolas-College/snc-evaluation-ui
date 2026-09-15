<template>
  <div class="space-y-6 pb-10">
    <!-- =====================================================

      PAGE HERO

    ====================================================== -->

    <section
      class="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7 dark:border-emerald-900"
    >
      <div
        class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
      ></div>

      <div
        class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-teal-300/15 blur-3xl"
      ></div>

      <div
        class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"
      >
        <div class="flex min-w-0 items-start gap-4">
          <div
            class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex"
          >
            <UIcon name="i-lucide-chart-column-big" class="size-7" />
          </div>

          <div class="min-w-0">
            <div
              class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-50"
            >
              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Faculty Portal
              </span>

              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Evaluation Results
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              My Evaluation Results
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Review your evaluation performance, ratings, feedback, and
              academic-period results from students and administrators.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================

      FACULTY PROFILE

    ====================================================== -->

    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6"
      >
        <div
          class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-bold text-white shadow-lg shadow-emerald-500/20"
        >
          {{ facultyInitials }}
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2
              class="truncate text-base font-bold text-gray-900 sm:text-lg dark:text-white"
            >
              {{ facultyName }}
            </h2>

            <UBadge color="success" variant="subtle" size="sm">
              Faculty
            </UBadge>
          </div>

          <div
            class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400"
          >
            <span class="flex items-center gap-1.5">
              <UIcon name="i-lucide-building-2" class="size-3.5" />

              {{ facultyDepartment }}
            </span>

            <span v-if="facultyEmail" class="flex items-center gap-1.5">
              <UIcon name="i-lucide-mail" class="size-3.5" />

              {{ facultyEmail }}
            </span>
          </div>
        </div>

        <div
          v-if="activeSchoolYear"
          class="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-left sm:text-right dark:border-emerald-900 dark:bg-emerald-950/30"
        >
          <p
            class="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400"
          >
            Active Period
          </p>

          <p class="mt-1 text-xs font-bold text-gray-800 dark:text-gray-200">
            {{ activeSemester }} · {{ activeSchoolYearLabel }}
          </p>
        </div>
      </div>
    </section>

    <!-- =====================================================

      LOADING

    ====================================================== -->

    <div v-if="pending" class="space-y-5">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <USkeleton
          v-for="index in 4"
          :key="index"
          class="h-32 w-full rounded-2xl"
        />
      </div>

      <USkeleton class="h-24 w-full rounded-2xl" />

      <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <USkeleton
          v-for="index in 4"
          :key="index"
          class="h-72 w-full rounded-2xl"
        />
      </div>
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
        Unable to load your results
      </h2>

      <p
        class="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400"
      >
        {{ loadError }}
      </p>

      <UButton
        class="mt-5"
        icon="i-lucide-refresh-cw"
        :loading="pending"
        @click="loadData"
      >
        Try Again
      </UButton>
    </section>

    <template v-else>
      <!-- ===================================================

        SUMMARY CARDS

      ==================================================== -->

      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/20"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                Student Evaluations
              </p>

              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ studentEvaluationCount }}
              </p>

              <p class="mt-1 text-xs text-blue-600 dark:text-blue-400">
                Current active period
              </p>
            </div>

            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
            >
              <UIcon name="i-lucide-graduation-cap" class="size-5" />
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl border border-violet-100 bg-violet-50/70 p-5 dark:border-violet-900 dark:bg-violet-950/20"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                Dean Evaluations
              </p>

              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ deanEvaluationCount }}
              </p>

              <p class="mt-1 text-xs text-violet-600 dark:text-violet-400">
                Current active period
              </p>
            </div>

            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
            >
              <UIcon name="i-lucide-building-2" class="size-5" />
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl border border-amber-100 bg-amber-50/70 p-5 dark:border-amber-900 dark:bg-amber-950/20"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                Student Average
              </p>

              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                <template v-if="studentEvaluationCount">
                  {{ studentAverage }}
                  <span class="text-sm font-medium text-gray-400">
                    / {{ studentScaleMax }}
                  </span>
                </template>
                <span
                  v-else
                  class="text-base font-semibold text-gray-500 dark:text-gray-400"
                >
                  No evaluations yet
                </span>
              </p>

              <p class="mt-1 text-xs text-amber-600 dark:text-amber-400">
                Current active period
              </p>
            </div>

            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
            >
              <UIcon name="i-lucide-book-open-check" class="size-5" />
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 dark:border-emerald-900 dark:bg-emerald-950/20"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                Dean Average
              </p>

              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                <template v-if="deanEvaluationCount">
                  {{ deanAverage }}
                  <span class="text-sm font-medium text-gray-400">
                    / {{ deanScaleMax }}
                  </span>
                </template>
                <span
                  v-else
                  class="text-base font-semibold text-gray-500 dark:text-gray-400"
                >
                  No evaluations yet
                </span>
              </p>

              <UBadge
                v-if="deanEvaluationCount"
                :color="deanAverageColor"
                variant="subtle"
                size="sm"
                class="mt-1.5"
              >
                {{ deanAverageLabel }}
              </UBadge>
            </div>

            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
            >
              <UIcon name="i-lucide-chart-no-axes-combined" class="size-5" />
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================

        SCORE DISTRIBUTION

      ==================================================== -->

      <section
        v-if="studentEvaluationCount"
        class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]"
      >
        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-sm font-bold text-gray-900 dark:text-white">
                Rating Distribution
              </h2>

              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Distribution of recorded evaluation averages.
              </p>
            </div>

            <UBadge color="neutral" variant="subtle">
              {{ studentEvaluationCount }} student evaluations
            </UBadge>
          </div>

          <div class="mt-5 space-y-4">
            <div v-for="item in ratingDistribution" :key="item.label">
              <div class="flex items-center justify-between text-xs">
                <span class="font-medium text-gray-600 dark:text-gray-400">
                  {{ item.label }}
                </span>

                <span class="font-bold text-gray-900 dark:text-white">
                  {{ item.count }}
                </span>
              </div>

              <div
                class="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
              >
                <div
                  class="h-full rounded-full transition-[width] duration-500"
                  :class="item.barClass"
                  :style="{
                    width: `${item.percentage}%`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
            >
              <UIcon name="i-lucide-award" class="size-5" />
            </div>

            <div>
              <h2 class="text-sm font-bold text-gray-900 dark:text-white">
                Student Performance Summary
              </h2>

              <p
                class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400"
              >
                Performance interpretation based on Student Evaluation records
                only.
              </p>
            </div>
          </div>

          <div
            class="mt-5 rounded-2xl border p-5 text-center"
            :class="getScoreContainerClass(Number(studentAverage))"
          >
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Student Rating
            </p>

            <p class="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
              {{ studentAverage }}
            </p>

            <p class="mt-1 text-xs text-gray-400">
              out of {{ studentScaleMax }}
            </p>

            <UBadge
              :color="getScoreColour(Number(studentAverage))"
              variant="subtle"
              class="mt-3"
            >
              {{
                activeStudentResults[0]
                  ? getScaleLabel(
                      activeStudentResults[0],
                      Number(studentAverage),
                    ) ||
                    getScoreLabel(
                      getNormalisedAverageScore(activeStudentResults[0]),
                    )
                  : "No Score"
              }}
            </UBadge>
          </div>
        </div>
      </section>

      <!-- ===================================================

        FILTERS

      ==================================================== -->

      <section
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
        >
          <div>
            <h2 class="text-sm font-bold text-gray-900 dark:text-white">
              Evaluation Results
            </h2>

            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Search and filter your evaluation records.
            </p>
          </div>

          <div
            class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[240px_190px_190px_190px]"
          >
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Search subject or evaluator..."
              class="w-full"
            />

            <USelectMenu
              v-model="selectedSource"
              :items="sourceFilterOptions"
              value-key="value"
              class="w-full"
            />

            <USelectMenu
              v-model="selectedSemester"
              :items="semesterFilterOptions"
              value-key="value"
              class="w-full"
            />

            <USelectMenu
              v-model="selectedSchoolYear"
              :items="schoolYearFilterOptions"
              value-key="value"
              class="w-full"
            />
          </div>
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
            v-if="selectedSource !== 'all'"
            color="primary"
            variant="subtle"
          >
            {{ selectedSourceLabel }}
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
            color="info"
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

      <!-- ===================================================

        EMPTY STATE

      ==================================================== -->

      <section
        v-if="!filteredResults.length"
        class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-900"
      >
        <div
          class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
        >
          <UIcon
            :name="
              results.length
                ? 'i-lucide-search-x'
                : 'i-lucide-chart-no-axes-column'
            "
            class="size-8"
          />
        </div>

        <h2 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
          {{
            results.length ? "No matching results" : "No evaluation results yet"
          }}
        </h2>

        <p
          class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400"
        >
          {{
            results.length
              ? "Try changing or clearing the current search and filters."
              : "Your submitted evaluation results will appear here once evaluation records are available."
          }}
        </p>

        <UButton
          v-if="results.length"
          class="mt-5"
          color="neutral"
          variant="outline"
          icon="i-lucide-rotate-ccw"
          @click="clearFilters"
        >
          Clear Filters
        </UButton>
      </section>

      <!-- ===================================================

        RESULT CARDS

      ==================================================== -->

      <section
        v-else
        class="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3"
      >
        <article
          v-for="result in paginatedResults"
          :key="result.documentId || result.id"
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <!-- HEADER -->

          <div
            class="relative overflow-hidden px-4 py-4 text-white"
            :class="
              getSourceType(result) === 'student'
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950'
                : getSourceType(result) === 'dean'
                  ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950'
                  : 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900'
            "
          >
            <div
              class="pointer-events-none absolute -right-10 -top-14 size-36 rounded-full bg-white/10 blur-3xl"
            ></div>

            <div class="relative flex items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10"
                  :class="
                    getSourceType(result) === 'student'
                      ? 'text-blue-300'
                      : getSourceType(result) === 'dean'
                        ? 'text-violet-300'
                        : 'text-gray-300'
                  "
                >
                  <UIcon
                    :name="
                      getSourceType(result) === 'student'
                        ? 'i-lucide-graduation-cap'
                        : getSourceType(result) === 'dean'
                          ? 'i-lucide-building-2'
                          : 'i-lucide-clipboard-list'
                    "
                    class="size-4.5"
                  />
                </div>

                <div class="min-w-0">
                  <p
                    class="text-[9px] font-semibold uppercase tracking-[0.14em]"
                    :class="
                      getSourceType(result) === 'student'
                        ? 'text-blue-300'
                        : getSourceType(result) === 'dean'
                          ? 'text-violet-300'
                          : 'text-gray-300'
                    "
                  >
                    {{ getSourceLabel(result) }}
                  </p>

                  <h2 class="mt-0.5 truncate text-base font-bold">
                    {{ getResultTitle(result) }}
                  </h2>

                  <p class="mt-0.5 truncate text-[11px] text-slate-300">
                    {{ getEvaluatorLabel(result) }}
                  </p>
                </div>
              </div>

              <UBadge
                :color="
                  getSourceType(result) === 'student'
                    ? 'info'
                    : getSourceType(result) === 'dean'
                      ? 'primary'
                      : 'neutral'
                "
                variant="solid"
                size="sm"
                class="shrink-0"
              >
                {{ getSourceBadgeLabel(result) }}
              </UBadge>
            </div>
          </div>

          <div class="space-y-4 p-4">
            <!-- META -->

            <div class="grid grid-cols-2 gap-2">
              <div
                class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p
                  class="text-[9px] font-semibold uppercase tracking-wide text-gray-400"
                >
                  Semester
                </p>

                <p
                  class="mt-1 truncate text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  {{ getSemester(result) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p
                  class="text-[9px] font-semibold uppercase tracking-wide text-gray-400"
                >
                  School Year
                </p>

                <p
                  class="mt-1 truncate text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  {{ getSchoolYear(result) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p
                  class="text-[9px] font-semibold uppercase tracking-wide text-gray-400"
                >
                  Date
                </p>

                <p
                  class="mt-1 truncate text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  {{ formatDate(getEvaluationDate(result)) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p
                  class="text-[9px] font-semibold uppercase tracking-wide text-gray-400"
                >
                  Responses
                </p>

                <p
                  class="mt-1 truncate text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  {{ getResponses(result).length }}
                </p>
              </div>
            </div>

            <!-- SCORE -->

            <div
              class="rounded-xl border p-4"
              :class="getScoreContainerClass(getNormalisedAverageScore(result))"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p
                    class="text-[10px] font-medium text-gray-500 dark:text-gray-400"
                  >
                    Evaluation Score
                  </p>

                  <div class="mt-1 flex items-end gap-1.5">
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">
                      {{ formatScore(getAverageScore(result)) }}
                    </p>

                    <span class="mb-0.5 text-xs font-medium text-gray-400">
                      / {{ getDisplayScaleMax(result) }}
                    </span>
                  </div>

                  <UBadge
                    :color="getScoreColour(getNormalisedAverageScore(result))"
                    variant="subtle"
                    size="sm"
                    class="mt-1.5"
                  >
                    {{
                      getScaleLabel(result, getAverageScore(result)) ||
                      getScoreLabel(getNormalisedAverageScore(result))
                    }}
                  </UBadge>
                </div>

                <UIcon
                  name="i-lucide-chart-no-axes-combined"
                  class="size-7"
                  :class="getScoreIconClass(getNormalisedAverageScore(result))"
                />
              </div>
            </div>

            <!-- COMMENTS -->

            <div
              v-if="getPrimaryComment(result)"
              class="rounded-xl border border-violet-100 bg-violet-50/60 p-3.5 dark:border-violet-900 dark:bg-violet-950/20"
            >
              <div class="flex items-start gap-2.5">
                <div
                  class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
                >
                  <UIcon name="i-lucide-message-square-text" class="size-3.5" />
                </div>

                <div class="min-w-0">
                  <p
                    class="text-[11px] font-bold text-gray-900 dark:text-white"
                  >
                    Feedback
                  </p>

                  <p
                    class="mt-1 line-clamp-3 whitespace-pre-line text-xs leading-5 text-gray-600 dark:text-gray-400"
                  >
                    {{ getPrimaryComment(result) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- FOOTER -->

            <div
              class="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-800"
            >
              <p class="text-[10px] text-gray-400">
                ID: {{ getRecordReference(result) }}
              </p>

              <UButton
                color="neutral"
                variant="soft"
                size="xs"
                trailing-icon="i-lucide-chevron-right"
                @click="openResultDetails(result)"
              >
                View Details
              </UButton>
            </div>
          </div>
        </article>
      </section>

      <!-- ===================================================

        PAGINATION

      ==================================================== -->

      <section
        v-if="filteredResults.length > itemsPerPage"
        class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900"
      >
        <p
          class="text-center text-xs text-gray-500 sm:text-left dark:text-gray-400"
        >
          Showing {{ paginationStart }}–{{ paginationEnd }} of

          {{ filteredResults.length }} results
        </p>

        <div class="flex items-center justify-center gap-2">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-chevron-left"
            square
            :disabled="currentPage === 1"
            @click="previousPage"
          />

          <div
            class="min-w-28 rounded-xl bg-gray-100 px-3 py-2 text-center text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            Page {{ currentPage }} of {{ totalPages }}
          </div>

          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-chevron-right"
            square
            :disabled="currentPage === totalPages"
            @click="nextPage"
          />
        </div>
      </section>
    </template>

    <!-- =====================================================

      DETAILS MODAL

    ====================================================== -->

    <UModal v-model:open="detailsOpen">
      <template #content>
        <div
          v-if="selectedResult"
          class="relative max-h-[85vh] overflow-y-auto rounded-[28px] border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-6 py-6 text-white"
          >
            <div
              class="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-emerald-500/20 blur-3xl"
            ></div>

            <div class="relative flex items-start justify-between gap-4">
              <div class="flex min-w-0 items-center gap-4">
                <div
                  class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-300"
                >
                  <UIcon name="i-lucide-chart-column-big" class="size-6" />
                </div>

                <div class="min-w-0">
                  <p
                    class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300"
                  >
                    Evaluation Result
                  </p>

                  <h2 class="mt-1 truncate text-xl font-bold">
                    {{ getResultTitle(selectedResult) }}
                  </h2>

                  <p class="mt-1 truncate text-xs text-slate-300">
                    {{ getSourceLabel(selectedResult) }}
                  </p>
                </div>
              </div>

              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                square
                class="text-white hover:bg-white/10"
                @click="detailsOpen = false"
              />
            </div>
          </div>

          <div class="space-y-5 p-6">
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-[10px] uppercase text-gray-400">Semester</p>

                <p
                  class="mt-1 text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  {{ getSemester(selectedResult) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-[10px] uppercase text-gray-400">School Year</p>

                <p
                  class="mt-1 text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  {{ getSchoolYear(selectedResult) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-[10px] uppercase text-gray-400">Date</p>

                <p
                  class="mt-1 text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  {{ formatDate(getEvaluationDate(selectedResult)) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/20"
              >
                <p class="text-[10px] uppercase text-gray-400">Average</p>

                <p
                  class="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-400"
                >
                  {{ formatScore(getAverageScore(selectedResult)) }}/{{
                    getDisplayScaleMax(selectedResult)
                  }}
                </p>
              </div>
            </div>

            <div
              v-if="getStrengths(selectedResult)"
              class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20"
            >
              <h3
                class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                <UIcon
                  name="i-lucide-thumbs-up"
                  class="size-4 text-emerald-500"
                />

                Strengths
              </h3>

              <p
                class="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                {{ getStrengths(selectedResult) }}
              </p>
            </div>

            <div
              v-if="getAreasForImprovement(selectedResult)"
              class="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/20"
            >
              <h3
                class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                <UIcon
                  name="i-lucide-lightbulb"
                  class="size-4 text-amber-500"
                />

                Areas for Improvement
              </h3>

              <p
                class="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                {{ getAreasForImprovement(selectedResult) }}
              </p>
            </div>

            <div
              v-if="getEffectiveness(selectedResult)"
              class="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/20"
            >
              <h3
                class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                <UIcon name="i-lucide-zap" class="size-4 text-blue-500" />

                Ways to Be More Effective
              </h3>

              <p
                class="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                {{ getEffectiveness(selectedResult) }}
              </p>
            </div>

            <div
              v-if="getSuggestedActivities(selectedResult)"
              class="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4 dark:border-cyan-900 dark:bg-cyan-950/20"
            >
              <h3
                class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                <UIcon
                  name="i-lucide-graduation-cap"
                  class="size-4 text-cyan-500"
                />

                Suggested Improvement Activities
              </h3>

              <p
                class="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                {{ getSuggestedActivities(selectedResult) }}
              </p>
            </div>

            <div
              v-if="getComment(selectedResult)"
              class="rounded-2xl border border-violet-100 bg-violet-50/60 p-4 dark:border-violet-900 dark:bg-violet-950/20"
            >
              <h3
                class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                <UIcon
                  name="i-lucide-message-square-text"
                  class="size-4 text-violet-500"
                />

                Additional Comment
              </h3>

              <p
                class="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                {{ getComment(selectedResult) }}
              </p>
            </div>

            <div
              v-if="getResponses(selectedResult).length"
              class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <div
                class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                  Recorded Responses
                </h3>
              </div>

              <div class="divide-y divide-gray-200 dark:divide-gray-800">
                <div
                  v-for="(response, index) in getResponses(selectedResult)"
                  :key="response.criterionId || index"
                  class="flex items-start justify-between gap-4 px-4 py-3"
                >
                  <div class="flex min-w-0 items-start gap-3">
                    <span
                      class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {{ index + 1 }}
                    </span>

                    <p
                      class="text-sm leading-6 text-gray-600 dark:text-gray-400"
                    >
                      {{ response.question || `Criterion ${index + 1}` }}
                    </p>
                  </div>

                  <span
                    class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                  >
                    {{ response.score }}
                  </span>
                </div>
              </div>
            </div>

            <div
              v-else
              class="rounded-2xl border border-dashed border-gray-300 px-5 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400"
            >
              Detailed criterion responses are unavailable.
            </div>

            <div class="flex justify-end">
              <UButton
                color="neutral"
                variant="soft"
                @click="detailsOpen = false"
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
  middleware: ["auth", "role"],

  role: ["Admin", "Faculty"],
});

const { $api } = useNuxtApp();

const { user } = useAuth();

const toast = useToast();

/* =========================================================

   STATE

\========================================================= */

const results = ref<any[]>([]);

const facultyProfile = ref<any>(null);

const activeSchoolYear = ref<any>(null);

const pending = ref(true);

const loadError = ref("");

const searchQuery = ref("");

const selectedSource = ref("all");

const selectedSemester = ref("all");

const selectedSchoolYear = ref("all");

const currentPage = ref(1);

const itemsPerPage = 6;

const detailsOpen = ref(false);

const selectedResult = ref<any>(null);

/* =========================================================

   FACULTY INFORMATION

\========================================================= */

const facultyName = computed(() => {
  return (
    facultyProfile.value?.name ||
    facultyProfile.value?.full_name ||
    user.value?.name ||
    user.value?.username ||
    "Faculty Member"
  );
});

const facultyDepartment = computed(() => {
  return facultyProfile.value?.department?.name || "No department assigned";
});

const facultyEmail = computed(() => {
  return (
    facultyProfile.value?.email ||
    facultyProfile.value?.user?.email ||
    user.value?.email ||
    ""
  );
});

const facultyInitials = computed(() => {
  return facultyName.value

    .trim()

    .split(/\s+/)

    .slice(0, 2)

    .map((part: string) => part.charAt(0).toUpperCase())

    .join("");
});

const activeSemester = computed(() => {
  return activeSchoolYear.value?.semester || "";
});

const activeSchoolYearLabel = computed(() => {
  return activeSchoolYear.value?.school_year || "";
});

/* =========================================================

   FILTER OPTIONS

\========================================================= */

const sourceFilterOptions = [
  {
    label: "All Sources",

    value: "all",
  },

  {
    label: "Student Evaluations",

    value: "student",
  },

  {
    label: "Dean Evaluations",

    value: "dean",
  },
];

const semesterFilterOptions = computed(() => {
  const values = Array.from(
    new Set(
      results.value

        .map((result) => getSemester(result))

        .filter((value) => value && value !== "Not specified"),
    ),
  );

  return [
    {
      label: "All Semesters",

      value: "all",
    },

    ...values.map((value) => ({
      label: value,

      value,
    })),
  ];
});

const schoolYearFilterOptions = computed(() => {
  const values = Array.from(
    new Set(
      results.value

        .map((result) => getSchoolYear(result))

        .filter((value) => value && value !== "Not specified"),
    ),
  )

    .sort()

    .reverse();

  return [
    {
      label: "All School Years",

      value: "all",
    },

    ...values.map((value) => ({
      label: value,

      value,
    })),
  ];
});

const selectedSourceLabel = computed(() => {
  return (
    sourceFilterOptions.find((item) => item.value === selectedSource.value)
      ?.label || "All Sources"
  );
});

/* =========================================================

   SUMMARY

\========================================================= */

const isActivePeriodResult = (result: any) => {
  if (!activeSchoolYear.value) return false;

  return (
    getSemester(result) === activeSchoolYear.value.semester &&
    getSchoolYear(result) === activeSchoolYear.value.school_year
  );
};

const activePeriodResults = computed(() =>
  results.value.filter(isActivePeriodResult),
);

const activeStudentResults = computed(() =>
  activePeriodResults.value.filter(
    (result) => getSourceType(result) === "student",
  ),
);

const activeDeanResults = computed(() =>
  activePeriodResults.value.filter(
    (result) => getSourceType(result) === "dean",
  ),
);

const studentResults = computed(() => {
  return results.value.filter((result) => getSourceType(result) === "student");
});

const deanResults = computed(() => {
  return results.value.filter((result) => getSourceType(result) === "dean");
});

const totalEvaluationCount = computed(() => {
  return results.value.length;
});

const studentEvaluationCount = computed(() => {
  return activeStudentResults.value.length;
});

const deanEvaluationCount = computed(() => {
  return activeDeanResults.value.length;
});

const evaluatedSubjectCount = computed(() => {
  const values = new Set(
    studentResults.value

      .map(
        (result) =>
          result?.subject?.documentId ||
          result?.subject?.id ||
          result?.subject?.name,
      )

      .filter(Boolean),
  );

  return values.size;
});

const calculateCollectionAverage = (collection: any[]) => {
  const scores = collection

    .map((result) => getNormalisedAverageScore(result))

    .filter((score) => score > 0);

  if (!scores.length) {
    return "0.00";
  }

  return (
    scores.reduce(
      (sum, score) => sum + score,

      0,
    ) / scores.length
  ).toFixed(2);
};

const studentAverage = computed(() => {
  return getActualCollectionAverage(activeStudentResults.value);
});

const deanAverage = computed(() => {
  return getActualCollectionAverage(activeDeanResults.value);
});

const studentScaleMax = computed(() => getSourceScaleMax("student"));
const deanScaleMax = computed(() => getSourceScaleMax("dean"));

const deanAverageLabel = computed(() => {
  const result = activeDeanResults.value[0];

  if (!result || Number(deanAverage.value) <= 0) {
    return "No Score";
  }

  return (
    getScaleLabel(result, Number(deanAverage.value)) ||
    getScoreLabel(
      getNormalisedAverageScore({
        ...result,
        average_score: Number(deanAverage.value),
      }),
    )
  );
});

const deanAverageColor = computed(() => {
  const result = activeDeanResults.value[0];

  if (!result || Number(deanAverage.value) <= 0) {
    return "neutral";
  }

  return getScoreColour(
    getNormalisedAverageScore({
      ...result,
      average_score: Number(deanAverage.value),
    }),
  );
});

const overallAverage = computed(() => {
  return calculateCollectionAverage(results.value);
});

const ratingDistribution = computed(() => {
  const scores = results.value

    .map((result) => getNormalisedAverageScore(result))

    .filter((score) => score > 0);

  const total = scores.length || 1;

  const categories = [
    {
      label: "Outstanding",

      count: scores.filter((score) => score >= 4.5).length,

      barClass: "bg-emerald-500",
    },

    {
      label: "Excellent",

      count: scores.filter((score) => score >= 3.5 && score < 4.5).length,

      barClass: "bg-blue-500",
    },

    {
      label: "Satisfactory",

      count: scores.filter((score) => score >= 2.5 && score < 3.5).length,

      barClass: "bg-amber-500",
    },

    {
      label: "Needs Improvement",

      count: scores.filter((score) => score > 0 && score < 2.5).length,

      barClass: "bg-red-500",
    },
  ];

  return categories.map((item) => ({
    ...item,

    percentage: Math.round((item.count / total) * 100),
  }));
});

/* =========================================================

   FILTERED RESULTS

\========================================================= */

const filteredResults = computed(() => {
  const query = searchQuery.value

    .trim()

    .toLowerCase();

  return results.value.filter((result) => {
    const title = getResultTitle(result).toLowerCase();

    const evaluator = getEvaluatorLabel(result).toLowerCase();

    const semester = getSemester(result);

    const schoolYear = getSchoolYear(result);

    const source = getSourceType(result);

    const matchesSearch =
      !query || title.includes(query) || evaluator.includes(query);

    const matchesSource =
      selectedSource.value === "all" || source === selectedSource.value;

    const matchesSemester =
      selectedSemester.value === "all" || semester === selectedSemester.value;

    const matchesSchoolYear =
      selectedSchoolYear.value === "all" ||
      schoolYear === selectedSchoolYear.value;

    return (
      matchesSearch && matchesSource && matchesSemester && matchesSchoolYear
    );
  });
});

const totalPages = computed(() => {
  return Math.max(
    1,

    Math.ceil(filteredResults.value.length / itemsPerPage),
  );
});

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;

  return filteredResults.value.slice(
    start,

    start + itemsPerPage,
  );
});

const paginationStart = computed(() => {
  if (!filteredResults.value.length) {
    return 0;
  }

  return (currentPage.value - 1) * itemsPerPage + 1;
});

const paginationEnd = computed(() => {
  return Math.min(
    currentPage.value * itemsPerPage,

    filteredResults.value.length,
  );
});

const hasActiveFilters = computed(() => {
  return Boolean(
    searchQuery.value ||
    selectedSource.value !== "all" ||
    selectedSemester.value !== "all" ||
    selectedSchoolYear.value !== "all",
  );
});

/* =========================================================

   RESULT HELPERS

\========================================================= */

const getEvaluationCode = (result: any) => {
  return (
    result?.batch?.evaluation_type?.code || result?.evaluation_type?.code || ""
  );
};

const getSourceType = (result: any) => {
  const code = getEvaluationCode(result);

  if (code === "dean-faculty" || code === "dean-to-faculty") {
    return "dean";
  }

  if (code === "student-faculty") {
    return "student";
  }

  return "unknown";
};

const getSourceLabel = (result: any) => {
  const source = getSourceType(result);

  if (source === "dean") {
    return "Dean – Faculty Evaluation";
  }

  if (source === "student") {
    return "Student – Faculty Evaluation";
  }

  return "Faculty Evaluation";
};

const getSourceBadgeLabel = (result: any) => {
  const source = getSourceType(result);

  if (source === "dean") {
    return "Dean";
  }

  if (source === "student") {
    return "Student";
  }

  return "Other";
};

const getResultTitle = (result: any) => {
  const source = getSourceType(result);

  if (source === "dean") {
    return "Faculty Performance";
  }

  const subject = result?.subject;

  if (!subject) {
    return "Faculty Performance";
  }

  if (subject.code && subject.name) {
    return `${subject.code} - ${subject.name}`;
  }

  return subject.name || subject.code || "Faculty Performance";
};

const getEvaluatorLabel = (result: any) => {
  const source = getSourceType(result);

  if (source === "dean") {
    return (
      result?.evaluator_user?.name ||
      result?.evaluator_user?.username ||
      "Dean Evaluation"
    );
  }

  if (source === "student") {
    return "Student Evaluation";
  }

  return "Evaluation";
};

const getSemester = (result: any) => {
  return result?.batch?.semester || result?.semester || "Not specified";
};

const getSchoolYear = (result: any) => {
  return result?.batch?.school_year || result?.school_year || "Not specified";
};

const getEvaluationDate = (result: any) => {
  return result?.batch?.date || result?.date || result?.createdAt;
};

const getComment = (result: any) => {
  return result?.comment || result?.feedback || "";
};

const getStrengths = (result: any) => {
  return result?.strengths || "";
};

const getAreasForImprovement = (result: any) => {
  return result?.areas_for_improvement || result?.areasForImprovement || "";
};

const getEffectiveness = (result: any) => {
  return result?.effectiveness || "";
};

const getSuggestedActivities = (result: any) => {
  return result?.suggested_activities || result?.suggestedActivities || "";
};

const getPrimaryComment = (result: any) => {
  return (
    getComment(result) ||
    getStrengths(result) ||
    getEffectiveness(result) ||
    getAreasForImprovement(result) ||
    getSuggestedActivities(result)
  );
};

const getResponses = (result: any) => {
  const rawResponses = result?.responses;

  if (!rawResponses) {
    return [];
  }

  if (Array.isArray(rawResponses)) {
    return rawResponses.map(
      (
        response: any,

        index: number,
      ) => ({
        criterionId:
          response.criterion_id || response.criterionId || response.id || index,

        question: response.question || response.statement || "",

        score: Number(response.score ?? response.value ?? response.rating),
      }),
    );
  }

  if (typeof rawResponses === "object") {
    return Object.entries(rawResponses).map(([criterionId, score]) => ({
      criterionId,

      question: "",

      score: Number(score),
    }));
  }

  return [];
};

const getRawAverageScore = (result: any) => {
  const directScore = Number(
    result?.average_score ?? result?.average ?? result?.score,
  );

  if (Number.isFinite(directScore) && directScore > 0) {
    return directScore;
  }

  const scores = getResponses(result)
    .map((response) => Number(response.score))

    .filter((score) => Number.isFinite(score));

  if (!scores.length) {
    return 0;
  }

  return (
    scores.reduce(
      (sum, score) => sum + score,

      0,
    ) / scores.length
  );
};

const getResultEvaluationType = (result: any) => {
  return result?.batch?.evaluation_type || result?.evaluation_type || null;
};

const getResultScaleBounds = (result: any) => {
  const type = getResultEvaluationType(result);
  const labels = type?.scale_labels;

  const labelScores =
    labels && typeof labels === "object" && !Array.isArray(labels)
      ? Object.keys(labels)
          .map((value) => Number(value))
          .filter((value) => Number.isFinite(value))
      : [];

  const configuredMin = Number(type?.min_score);
  const configuredMax = Number(type?.max_score);

  const min = Number.isFinite(configuredMin)
    ? configuredMin
    : labelScores.length
      ? Math.min(...labelScores)
      : 1;

  const max = Number.isFinite(configuredMax)
    ? configuredMax
    : labelScores.length
      ? Math.max(...labelScores)
      : 5;

  return { min, max: max > min ? max : 5 };
};

const getDisplayScaleMax = (result: any) => {
  return getResultScaleBounds(result).max;
};

const getActualAverageScore = (result: any) => {
  return getRawAverageScore(result);
};

const getScaleLabel = (result: any, score: number) => {
  const type = getResultEvaluationType(result);
  const labels = type?.scale_labels;

  if (!score || !labels) return "";

  // Object form: { "1": "Poor", "2": "Fair", ... }
  if (typeof labels === "object" && !Array.isArray(labels)) {
    const entries = Object.entries(labels)
      .map(([key, label]) => ({
        score: Number(key),
        label: String(label),
      }))
      .filter((item) => Number.isFinite(item.score))
      .sort((a, b) => a.score - b.score);

    if (entries.length) {
      const nearest = entries.reduce((best, item) =>
        Math.abs(item.score - score) < Math.abs(best.score - score)
          ? item
          : best,
      );
      return nearest.label;
    }
  }

  // Array form: [{ value/score/rating, label }]
  if (Array.isArray(labels)) {
    const entries = labels
      .map((item: any) => ({
        score: Number(item?.value ?? item?.score ?? item?.rating),
        label: String(item?.label ?? item?.name ?? item?.text ?? ""),
      }))
      .filter((item) => Number.isFinite(item.score) && item.label);

    if (entries.length) {
      const nearest = entries.reduce((best, item) =>
        Math.abs(item.score - score) < Math.abs(best.score - score)
          ? item
          : best,
      );
      return nearest.label;
    }
  }

  return "";
};

const getSourceScaleMax = (source: "student" | "dean") => {
  const activeCollection =
    source === "student" ? activeStudentResults.value : activeDeanResults.value;

  const historicalCollection =
    source === "student" ? studentResults.value : deanResults.value;

  const first =
    activeCollection.find((result) => getRawAverageScore(result) > 0) ||
    historicalCollection.find((result) => getRawAverageScore(result) > 0);

  return first ? getDisplayScaleMax(first) : 5;
};

const getActualCollectionAverage = (collection: any[]) => {
  const scores = collection
    .map((result) => getActualAverageScore(result))
    .filter((score) => Number.isFinite(score) && score > 0);

  if (!scores.length) return "0.00";

  return (
    scores.reduce((sum, score) => sum + score, 0) / scores.length
  ).toFixed(2);
};

const getNormalisedAverageScore = (result: any) => {
  const score = getRawAverageScore(result);
  if (!score) return 0;

  const { min, max } = getResultScaleBounds(result);

  // Normalize only for the common 5-point comparison display.
  // The original stored evaluation score is never changed.
  if (min === 1 && max === 5) return score;

  const clamped = Math.min(Math.max(score, min), max);
  return 1 + ((clamped - min) / (max - min)) * 4;
};

const getAverageScore = (result: any) => {
  return getActualAverageScore(result);
};

const getRecordReference = (result: any) => {
  const value = result?.documentId || result?.id;

  if (!value) {
    return "N/A";
  }

  return String(value).slice(-8);
};

/* =========================================================

   DISPLAY HELPERS

\========================================================= */

const formatDate = (value: any) => {
  if (!value) {
    return "Not specified";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(
    "en-PH",

    {
      month: "short",

      day: "numeric",

      year: "numeric",
    },
  );
};

const formatScore = (score: number) => {
  if (!score) {
    return "0.00";
  }

  return Number(score).toFixed(2);
};

const getScoreLabel = (score: number) => {
  if (score >= 4.5) {
    return "Outstanding";
  }

  if (score >= 3.5) {
    return "Excellent";
  }

  if (score >= 2.5) {
    return "Satisfactory";
  }

  if (score > 0) {
    return "Needs Improvement";
  }

  return "No Score";
};

const getScoreColour = (score: number) => {
  if (score >= 4.5) {
    return "success";
  }

  if (score >= 3.5) {
    return "primary";
  }

  if (score >= 2.5) {
    return "warning";
  }

  return "error";
};

const getScoreContainerClass = (score: number) => {
  if (score >= 4.5) {
    return [
      "border-emerald-100",

      "bg-emerald-50/70",

      "dark:border-emerald-900",

      "dark:bg-emerald-950/20",
    ];
  }

  if (score >= 3.5) {
    return [
      "border-blue-100",

      "bg-blue-50/70",

      "dark:border-blue-900",

      "dark:bg-blue-950/20",
    ];
  }

  if (score >= 2.5) {
    return [
      "border-amber-100",

      "bg-amber-50/70",

      "dark:border-amber-900",

      "dark:bg-amber-950/20",
    ];
  }

  return [
    "border-red-100",

    "bg-red-50/70",

    "dark:border-red-900",

    "dark:bg-red-950/20",
  ];
};

const getScoreIconClass = (score: number) => {
  if (score >= 4.5) {
    return "text-emerald-500";
  }

  if (score >= 3.5) {
    return "text-blue-500";
  }

  if (score >= 2.5) {
    return "text-amber-500";
  }

  return "text-red-500";
};

/* =========================================================

   ACTIONS

\========================================================= */

const clearFilters = () => {
  searchQuery.value = "";

  selectedSource.value = "all";

  selectedSemester.value = "all";

  selectedSchoolYear.value = "all";

  currentPage.value = 1;
};

const scrollToTop = async () => {
  await nextTick();

  if (!import.meta.client) {
    return;
  }

  window.scrollTo({
    top: 0,

    behavior: "smooth",
  });
};

const previousPage = async () => {
  if (currentPage.value <= 1) {
    return;
  }

  currentPage.value -= 1;

  await scrollToTop();
};

const nextPage = async () => {
  if (currentPage.value >= totalPages.value) {
    return;
  }

  currentPage.value += 1;

  await scrollToTop();
};

const openResultDetails = (result: any) => {
  selectedResult.value = result;

  detailsOpen.value = true;
};

/* =========================================================

   API

\========================================================= */

const getActiveSchoolYear = async () => {
  try {
    const response = await $api(
      "/school-years",

      {
        query: {
          "filters[active_sy][$eq]": true,

          "pagination[pageSize]": 1,
        },
      },
    );

    activeSchoolYear.value = response.data?.[0] || null;
  } catch (error) {
    console.error(
      "Active school year error:",

      error,
    );

    activeSchoolYear.value = null;
  }
};

const getFacultyProfile = async () => {
  if (!user.value?.id) {
    facultyProfile.value = null;

    return;
  }

  const response = await $api(
    "/teachers",

    {
      query: {
        "filters[user][id][$eq]": user.value.id,

        "populate[department]": true,

        "populate[user]": true,

        "pagination[pageSize]": 1,
      },
    },
  );

  facultyProfile.value = response.data?.[0] || null;
};

const getFacultyResults = async () => {
  if (!facultyProfile.value) {
    results.value = [];

    return;
  }

  const teacherId = facultyProfile.value.id;

  const response = await $api(
    "/evaluations",

    {
      query: {
        "filters[teacher][id][$eq]": teacherId,

        "filters[batch][evaluation_type][code][$in][0]": "student-faculty",
        "filters[batch][evaluation_type][code][$in][1]": "dean-faculty",
        "filters[batch][evaluation_type][code][$in][2]": "dean-to-faculty",

        "populate[teacher]": true,

        "populate[subject][populate][course]": true,

        "populate[evaluator_user]": true,

        "populate[batch][populate][evaluation_type]": true,

        "sort[0]": "createdAt:desc",

        "pagination[pageSize]": 500,
      },
    },
  );

  results.value = response.data || [];
};

/* =========================================================

   LOAD

\========================================================= */

const loadData = async () => {
  try {
    pending.value = true;

    loadError.value = "";

    await Promise.all([getActiveSchoolYear(), getFacultyProfile()]);

    if (!facultyProfile.value) {
      throw new Error("The logged-in faculty profile could not be found.");
    }

    await getFacultyResults();

    // Show the active academic period by default.
    // Faculty may still choose All or a historical period from the filters.
    if (activeSchoolYear.value) {
      selectedSemester.value = activeSchoolYear.value.semester || "all";
      selectedSchoolYear.value = activeSchoolYear.value.school_year || "all";
    }

    currentPage.value = 1;
  } catch (error: any) {
    console.error(
      "Faculty results loading error:",

      error,
    );

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Failed to load faculty evaluation results.";

    toast.add({
      title: "Unable to load results",

      description: loadError.value,

      icon: "i-lucide-triangle-alert",

      color: "error",
    });
  } finally {
    pending.value = false;
  }
};

/* =========================================================

   WATCHERS

\========================================================= */

watch(
  [searchQuery, selectedSource, selectedSemester, selectedSchoolYear],

  () => {
    currentPage.value = 1;
  },
);

watch(
  () => totalPages.value,

  (value) => {
    if (currentPage.value > value) {
      currentPage.value = value;
    }
  },
);

watch(
  user,

  async (value) => {
    if (value?.id) {
      await loadData();
    }
  },

  {
    immediate: true,
  },
);
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
