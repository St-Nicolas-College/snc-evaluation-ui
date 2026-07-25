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
      />

      <div
        class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-teal-300/15 blur-3xl"
      />

      <div
        class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"
      >
        <div class="flex min-w-0 items-start gap-4">
          <div
            class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex"
          >
            <UIcon name="i-lucide-history" class="size-7" />
          </div>

          <div class="min-w-0">
            <div
              class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-50"
            >
              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Student Portal
              </span>

              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Evaluation History
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              My Evaluations
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Review the faculty evaluations you have submitted, including the
              subject, academic period, date, and recorded rating.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ totalEvaluationCount }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100"
            >
              Submitted
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ evaluatedFacultyCount }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100"
            >
              Faculty
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ overallAverage }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100"
            >
              Avg. Score
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
      SCHOOL INFORMATION
    ====================================================== -->
    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex items-center gap-4 px-5 py-4 sm:px-6">
        <div
          class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 p-1 dark:border-emerald-900 dark:bg-emerald-950/30"
        >
          <img
            src="/logo.png"
            alt="St. Nicolas College"
            class="size-9 object-contain"
          />
        </div>

        <div class="min-w-0 flex-1">
          <h2
            class="text-sm font-bold uppercase tracking-tight text-gray-900 sm:text-base dark:text-white"
          >
            St. Nicolas College of Business and Technology
          </h2>

          <p class="mt-0.5 text-xs leading-5 text-gray-500 dark:text-gray-400">
            Student evaluation records and submission history
          </p>
        </div>

        <div
          v-if="activeSchoolYear"
          class="hidden rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-right sm:block dark:border-emerald-900 dark:bg-emerald-950/30"
        >
          <p
            class="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400"
          >
            Active Period
          </p>

          <p class="mt-0.5 text-xs font-bold text-gray-800 dark:text-gray-200">
            {{ activeSemester }} · {{ activeSchoolYearLabel }}
          </p>
        </div>
      </div>
    </section>

    <!-- =====================================================
      LOADING STATE
    ====================================================== -->
    <div v-if="pending" class="space-y-5">
      <USkeleton class="h-28 w-full rounded-2xl" />

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <USkeleton
          v-for="index in 4"
          :key="index"
          class="h-64 w-full rounded-2xl"
        />
      </div>
    </div>

    <!-- =====================================================
      ERROR STATE
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
        Unable to load your evaluations
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
                Faculty Evaluations
              </p>

              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ totalEvaluationCount }}
              </p>
            </div>

            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
            >
              <UIcon name="i-lucide-clipboard-check" class="size-5" />
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl border border-violet-100 bg-violet-50/70 p-5 dark:border-violet-900 dark:bg-violet-950/20"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                Faculty Evaluated
              </p>

              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ evaluatedFacultyCount }}
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
                Subjects Evaluated
              </p>

              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ evaluatedSubjectCount }}
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
                Overall Average
              </p>

              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ overallAverage }}
                <span class="text-sm font-medium text-gray-400"> / 5 </span>
              </p>
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
              Evaluation Records
            </h2>

            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Search and filter your submitted faculty evaluations.
            </p>
          </div>

          <div
            class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:w-auto xl:grid-cols-[280px_190px_190px]"
          >
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Search faculty or subject..."
              class="w-full"
            />

            <USelectMenu
              v-model="selectedSemester"
              :items="semesterFilterOptions"
              value-key="value"
              placeholder="All semesters"
              class="w-full"
            />

            <USelectMenu
              v-model="selectedSchoolYear"
              :items="schoolYearFilterOptions"
              value-key="value"
              placeholder="All school years"
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
            v-if="selectedSemester !== 'all'"
            color="primary"
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
        v-if="!filteredEvaluations.length"
        class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-900"
      >
        <div
          class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
        >
          <UIcon
            :name="
              evaluations.length ? 'i-lucide-search-x' : 'i-lucide-clipboard-x'
            "
            class="size-8"
          />
        </div>

        <h2 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
          {{
            evaluations.length
              ? "No matching evaluations"
              : "No submitted evaluations yet"
          }}
        </h2>

        <p
          class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400"
        >
          {{
            evaluations.length
              ? "Try changing or clearing your current search and filters."
              : "Your completed faculty evaluations will appear here after submission."
          }}
        </p>

        <UButton
          v-if="evaluations.length"
          class="mt-5"
          color="neutral"
          variant="outline"
          icon="i-lucide-rotate-ccw"
          @click="clearFilters"
        >
          Clear Filters
        </UButton>

        <UButton
          v-else
          class="mt-5"
          to="/student/evaluate"
          icon="i-lucide-clipboard-pen-line"
        >
          Evaluate Faculty
        </UButton>
      </section>

      <!-- ===================================================
        EVALUATION RECORDS
      ==================================================== -->
      <section
        v-else
        class="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3"
      >
        <article
          v-for="group in paginatedTeacherGroups"
          :key="group.teacherKey"
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <!-- FACULTY HEADER -->
          <div
            class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-4 py-4 text-white"
          >
            <div
              class="pointer-events-none absolute -right-10 -top-14 size-36 rounded-full bg-emerald-500/20 blur-3xl"
            />

            <div class="relative flex items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-emerald-300"
                >
                  <UIcon name="i-lucide-presentation" class="size-4.5" />
                </div>

                <div class="min-w-0">
                  <p
                    class="text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-300"
                  >
                    Faculty Evaluation
                  </p>

                  <h2 class="mt-0.5 truncate text-base font-bold">
                    {{ group.teacherName }}
                  </h2>

                  <p class="mt-0.5 text-[11px] text-slate-300">
                    {{ group.subjectCount }}
                    evaluated
                    {{ group.subjectCount === 1 ? "subject" : "subjects" }}
                  </p>
                </div>
              </div>

              <UBadge
                color="success"
                variant="solid"
                size="sm"
                class="shrink-0"
              >
                Submitted
              </UBadge>
            </div>
          </div>

          <div class="space-y-4 p-4">
            <!-- FACULTY SUMMARY -->
            <div class="grid grid-cols-2 gap-2">
              <div
                class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p
                  class="text-[9px] font-semibold uppercase tracking-wide text-gray-400"
                >
                  Subjects
                </p>

                <p class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {{ group.subjectCount }}
                </p>
              </div>

              <div
                class="rounded-xl border px-3 py-2.5"
                :class="getScoreContainerClass(group.averageScore)"
              >
                <p
                  class="text-[9px] font-semibold uppercase tracking-wide text-gray-400"
                >
                  Overall Average
                </p>

                <div class="mt-1 flex items-end gap-1">
                  <p class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ formatScore(group.averageScore) }}
                  </p>

                  <span class="mb-0.5 text-xs text-gray-400"> / 5 </span>
                </div>
              </div>
            </div>

            <!-- SUBJECT LIST -->
            <div class="space-y-2">
              <div
                v-for="evaluation in group.evaluations"
                :key="evaluation.documentId || evaluation.id"
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <div
                        class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                      >
                        <UIcon name="i-lucide-book-open" class="size-3.5" />
                      </div>

                      <p
                        class="truncate text-xs font-bold text-gray-900 dark:text-white"
                      >
                        {{ getSubjectName(evaluation) }}
                      </p>
                    </div>

                    <div
                      class="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400"
                    >
                      <span>
                        {{ getSemester(evaluation) }}
                      </span>

                      <span>•</span>

                      <span>
                        {{ getSchoolYear(evaluation) }}
                      </span>

                      <span>•</span>

                      <span>
                        {{ formatDate(getEvaluationDate(evaluation)) }}
                      </span>
                    </div>

                    <p
                      v-if="getComment(evaluation)"
                      class="mt-2 line-clamp-2 text-xs leading-5 text-gray-600 dark:text-gray-400"
                    >
                      {{ getComment(evaluation) }}
                    </p>
                  </div>

                  <div class="shrink-0 text-right">
                    <p class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ formatScore(getAverageScore(evaluation)) }}
                    </p>

                    <UBadge
                      :color="getScoreColour(getAverageScore(evaluation))"
                      variant="subtle"
                      size="sm"
                      class="mt-1"
                    >
                      {{ getScoreLabel(getAverageScore(evaluation)) }}
                    </UBadge>
                  </div>
                </div>

                <div
                  class="mt-3 flex justify-end border-t border-gray-200 pt-2 dark:border-gray-800"
                >
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    trailing-icon="i-lucide-chevron-right"
                    @click="openEvaluationDetails(evaluation)"
                  >
                    View Subject Details
                  </UButton>
                </div>
              </div>
            </div>

            <!-- FACULTY FOOTER -->
            <div
              class="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-800"
            >
              <p class="text-[10px] text-gray-400">
                {{ group.subjectCount }} evaluation record(s)
              </p>

              <UBadge
                :color="getScoreColour(group.averageScore)"
                variant="subtle"
              >
                {{ getScoreLabel(group.averageScore) }}
              </UBadge>
            </div>
          </div>
        </article>
      </section>

      <!-- ===================================================
        PAGINATION
      ==================================================== -->
      <section
        v-if="groupedEvaluations.length > itemsPerPage"
        class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900"
      >
        <p
          class="text-center text-xs text-gray-500 sm:text-left dark:text-gray-400"
        >
          Showing {{ paginationStart }}–{{ paginationEnd }} of
          {{ groupedEvaluations.length }} faculty members
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
      EVALUATION DETAILS MODAL
    ====================================================== -->
    <UModal v-model:open="detailsOpen">
      <template #content>
        <div
          v-if="selectedEvaluation"
          class="relative max-h-[85vh] overflow-y-auto rounded-[28px] border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-6 py-6 text-white"
          >
            <div
              class="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-emerald-500/20 blur-3xl"
            />

            <div class="relative">
              <div class="flex items-start justify-between gap-4">
                <div class="flex min-w-0 items-center gap-4">
                  <div
                    class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-300"
                  >
                    <UIcon name="i-lucide-clipboard-check" class="size-6" />
                  </div>

                  <div class="min-w-0">
                    <p
                      class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300"
                    >
                      Evaluation Details
                    </p>

                    <h2 class="mt-1 truncate text-xl font-bold">
                      {{ getTeacherName(selectedEvaluation) }}
                    </h2>

                    <p class="mt-1 truncate text-xs text-slate-300">
                      {{ getSubjectName(selectedEvaluation) }}
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
                  {{ getSemester(selectedEvaluation) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-[10px] uppercase text-gray-400">School Year</p>

                <p
                  class="mt-1 text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  {{ getSchoolYear(selectedEvaluation) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-[10px] uppercase text-gray-400">Date</p>

                <p
                  class="mt-1 text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  {{ formatDate(getEvaluationDate(selectedEvaluation)) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/20"
              >
                <p class="text-[10px] uppercase text-gray-400">Average</p>

                <p
                  class="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-400"
                >
                  {{ formatScore(getAverageScore(selectedEvaluation)) }}/5
                </p>
              </div>
            </div>

            <div
              v-if="getComment(selectedEvaluation)"
              class="rounded-2xl border border-violet-100 bg-violet-50/60 p-4 dark:border-violet-900 dark:bg-violet-950/20"
            >
              <h3
                class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                <UIcon
                  name="i-lucide-message-square-text"
                  class="size-4 text-violet-500"
                />

                Written Feedback
              </h3>

              <p
                class="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                {{ getComment(selectedEvaluation) }}
              </p>
            </div>

            <div
              v-if="getResponses(selectedEvaluation).length"
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
                  v-for="(response, index) in getResponses(selectedEvaluation)"
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
              Detailed criterion responses are not available in this record.
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
  role: ["Student"],
});

const { $api } = useNuxtApp();
const { user } = useAuth();
const toast = useToast();

/* =========================================================
   STATE
========================================================= */

const evaluations = ref<any[]>([]);
const activeSchoolYear = ref<any>(null);

const pending = ref(true);
const loadError = ref("");

const searchQuery = ref("");
const selectedSemester = ref("all");
const selectedSchoolYear = ref("all");

const currentPage = ref(1);
const itemsPerPage = 6;

const detailsOpen = ref(false);
const selectedEvaluation = ref<any>(null);

/* =========================================================
   ACTIVE PERIOD
========================================================= */

const activeSemester = computed(() => {
  return activeSchoolYear.value?.semester || "";
});

const activeSchoolYearLabel = computed(() => {
  return activeSchoolYear.value?.school_year || "";
});

/* =========================================================
   FILTER OPTIONS
========================================================= */

const semesterFilterOptions = computed(() => {
  const values = Array.from(
    new Set(
      evaluations.value
        .map((evaluation) => getSemester(evaluation))
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
      evaluations.value
        .map((evaluation) => getSchoolYear(evaluation))
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

/* =========================================================
   SUMMARY
========================================================= */

const totalEvaluationCount = computed(() => {
  return evaluations.value.length;
});

const evaluatedFacultyCount = computed(() => {
  const ids = new Set(
    evaluations.value
      .map(
        (evaluation) =>
          evaluation.teacher?.id ||
          evaluation.teacher?.documentId ||
          evaluation.teacher?.name,
      )
      .filter(Boolean),
  );

  return ids.size;
});

const evaluatedSubjectCount = computed(() => {
  const ids = new Set(
    evaluations.value
      .map(
        (evaluation) =>
          evaluation.subject?.id ||
          evaluation.subject?.documentId ||
          evaluation.subject?.name,
      )
      .filter(Boolean),
  );

  return ids.size;
});

const overallAverage = computed(() => {
  const scores = evaluations.value
    .map((evaluation) => getAverageScore(evaluation))
    .filter((score) => score > 0);

  if (!scores.length) {
    return "0.00";
  }

  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  return average.toFixed(2);
});

/* =========================================================
   FILTERED DATA
========================================================= */

const filteredEvaluations = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return evaluations.value.filter((evaluation) => {
    const teacherName = getTeacherName(evaluation).toLowerCase();

    const subjectName = getSubjectName(evaluation).toLowerCase();

    const semester = getSemester(evaluation);

    const schoolYear = getSchoolYear(evaluation);

    const matchesSearch =
      !query || teacherName.includes(query) || subjectName.includes(query);

    const matchesSemester =
      selectedSemester.value === "all" || semester === selectedSemester.value;

    const matchesSchoolYear =
      selectedSchoolYear.value === "all" ||
      schoolYear === selectedSchoolYear.value;

    return matchesSearch && matchesSemester && matchesSchoolYear;
  });
});

const groupedEvaluations = computed(() => {
  const groups = new Map<string, any>();

  filteredEvaluations.value.forEach((evaluation: any) => {
    const teacherKey = String(
      evaluation.teacher?.documentId ||
        evaluation.teacher?.id ||
        getTeacherName(evaluation),
    );

    if (!groups.has(teacherKey)) {
      groups.set(teacherKey, {
        teacherKey,
        teacher: evaluation.teacher,
        teacherName: getTeacherName(evaluation),
        evaluations: [],
      });
    }

    groups.get(teacherKey).evaluations.push(evaluation);
  });

  return Array.from(groups.values()).map((group) => {
    const validScores = group.evaluations
      .map((evaluation: any) => getAverageScore(evaluation))
      .filter((score: number) => score > 0);

    const averageScore = validScores.length
      ? validScores.reduce((total: number, score: number) => total + score, 0) /
        validScores.length
      : 0;

    return {
      ...group,
      averageScore,
      subjectCount: group.evaluations.length,
    };
  });
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(groupedEvaluations.value.length / itemsPerPage));
});

const paginatedTeacherGroups = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;

  return groupedEvaluations.value.slice(start, start + itemsPerPage);
});

const paginatedEvaluations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;

  return filteredEvaluations.value.slice(start, start + itemsPerPage);
});

const paginationStart = computed(() => {
  if (!groupedEvaluations.value.length) {
    return 0;
  }

  return (currentPage.value - 1) * itemsPerPage + 1;
});

const paginationEnd = computed(() => {
  return Math.min(
    currentPage.value * itemsPerPage,
    groupedEvaluations.value.length,
  );
});

const hasActiveFilters = computed(() => {
  return Boolean(
    searchQuery.value ||
    selectedSemester.value !== "all" ||
    selectedSchoolYear.value !== "all",
  );
});

/* =========================================================
   FIELD HELPERS
========================================================= */

const getTeacherName = (evaluation: any) => {
  return (
    evaluation?.teacher?.name ||
    evaluation?.teacher?.full_name ||
    "Unknown Faculty"
  );
};

const getSubjectName = (evaluation: any) => {
  const subject = evaluation?.subject;

  if (!subject) {
    return "No subject recorded";
  }

  if (subject.code && subject.name) {
    return `${subject.code} - ${subject.name}`;
  }

  return subject.name || subject.code || "Unknown Subject";
};

const getSemester = (evaluation: any) => {
  return evaluation?.batch?.semester || evaluation?.semester || "Not specified";
};

const getSchoolYear = (evaluation: any) => {
  return (
    evaluation?.batch?.school_year || evaluation?.school_year || "Not specified"
  );
};

const getEvaluationDate = (evaluation: any) => {
  return evaluation?.batch?.date || evaluation?.date || evaluation?.createdAt;
};

const getComment = (evaluation: any) => {
  return evaluation?.comment || evaluation?.feedback || "";
};

const getAverageScore = (evaluation: any) => {
  const directScore = Number(
    evaluation?.average_score ?? evaluation?.average ?? evaluation?.score,
  );

  if (Number.isFinite(directScore) && directScore > 0) {
    return directScore;
  }

  const responses = getResponses(evaluation);

  const scores = responses
    .map((response) => Number(response.score))
    .filter((score) => Number.isFinite(score));

  if (!scores.length) {
    return 0;
  }

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

const getResponses = (evaluation: any) => {
  const rawResponses = evaluation?.responses;

  if (!rawResponses) {
    return [];
  }

  if (Array.isArray(rawResponses)) {
    return rawResponses.map((response: any, index: number) => ({
      criterionId:
        response.criterion_id || response.criterionId || response.id || index,

      question: response.question || response.statement || "",

      score: Number(response.score ?? response.value ?? response.rating),
    }));
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

const getRecordReference = (evaluation: any) => {
  const value = evaluation?.documentId || evaluation?.id;

  if (!value) {
    return "N/A";
  }

  return String(value).slice(-8);
};

/* =========================================================
   DISPLAY HELPERS
========================================================= */

const formatDate = (value: any) => {
  if (!value) {
    return "Not specified";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

  if (score >= 1.5) {
    return "Fair";
  }

  if (score > 0) {
    return "Poor";
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
   FILTER ACTIONS
========================================================= */

const clearFilters = () => {
  searchQuery.value = "";
  selectedSemester.value = "all";
  selectedSchoolYear.value = "all";
  currentPage.value = 1;
};

/* =========================================================
   PAGINATION ACTIONS
========================================================= */

const scrollToRecords = async () => {
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
  await scrollToRecords();
};

const nextPage = async () => {
  if (currentPage.value >= totalPages.value) {
    return;
  }

  currentPage.value += 1;
  await scrollToRecords();
};

/* =========================================================
   MODAL
========================================================= */

const openEvaluationDetails = (evaluation: any) => {
  selectedEvaluation.value = evaluation;

  detailsOpen.value = true;
};

/* =========================================================
   API
========================================================= */

const getActiveSchoolYear = async () => {
  try {
    const response = await $api("/school-years", {
      query: {
        "filters[active_sy][$eq]": true,

        "pagination[pageSize]": 1,
      },
    });

    activeSchoolYear.value = response.data?.[0] || null;
  } catch (error) {
    console.error("Active school year error:", error);

    activeSchoolYear.value = null;
  }
};

const getMyEvaluations = async () => {
  if (!user.value?.id) {
    evaluations.value = [];
    return;
  }

  const response = await $api("/evaluations", {
    query: {
      "filters[evaluator_user][id][$eq]": user.value.id,

      "filters[batch][evaluation_type][code][$eq]": "student-faculty",

      "populate[teacher]": true,

      "populate[subject][populate][course]": true,

      "populate[batch][populate][evaluation_type]": true,

      "sort[0]": "createdAt:desc",

      "pagination[pageSize]": 300,
    },
  });

  evaluations.value = response.data || [];
};

/* =========================================================
   LOAD DATA
========================================================= */

const loadData = async () => {
  try {
    pending.value = true;
    loadError.value = "";

    await Promise.all([getActiveSchoolYear(), getMyEvaluations()]);

    currentPage.value = 1;
  } catch (error: any) {
    console.error("My evaluations loading error:", error);

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Failed to load your submitted evaluations.";

    toast.add({
      title: "Unable to load evaluations",
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
========================================================= */

watch([searchQuery, selectedSemester, selectedSchoolYear], () => {
  currentPage.value = 1;
});

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
