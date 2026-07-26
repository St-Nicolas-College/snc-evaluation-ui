<template>
  <div class="space-y-6 pb-10">
    <!-- =====================================================
      HERO
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
            <UIcon
              name="i-lucide-file-clock"
              class="size-7"
            />
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
                Evaluation Records
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              My Dean Evaluation Records
            </h1>

            <p
              class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90"
            >
              Review the evaluations you submitted for your Dean or Coordinator,
              including ratings, written feedback, and academic-period details.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ totalRecordCount }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100"
            >
              Records
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ evaluatedDeanCount }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100"
            >
              Deans
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
              Avg. Rating
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

            <UBadge
              color="success"
              variant="subtle"
              size="sm"
            >
              Faculty
            </UBadge>
          </div>

          <div
            class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400"
          >
            <span class="flex items-center gap-1.5">
              <UIcon
                name="i-lucide-building-2"
                class="size-3.5"
              />

              {{ facultyDepartment }}
            </span>

            <span
              v-if="facultyEmail"
              class="flex items-center gap-1.5"
            >
              <UIcon
                name="i-lucide-mail"
                class="size-3.5"
              />

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

          <p
            class="mt-1 text-xs font-bold text-gray-800 dark:text-gray-200"
          >
            {{ activeSemester }} · {{ activeSchoolYearLabel }}
          </p>
        </div>
      </div>
    </section>

    <!-- =====================================================
      LOADING
    ====================================================== -->
    <div
      v-if="pending"
      class="space-y-5"
    >
      <USkeleton class="h-24 w-full rounded-2xl" />

      <div
        class="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3"
      >
        <USkeleton
          v-for="index in 6"
          :key="index"
          class="h-80 w-full rounded-2xl"
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
        <UIcon
          name="i-lucide-triangle-alert"
          class="size-7"
        />
      </div>

      <h2
        class="mt-4 text-lg font-bold text-gray-900 dark:text-white"
      >
        Unable to load evaluation records
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
              Submitted Evaluations
            </h2>

            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Search and filter the Dean or Coordinator evaluations you submitted.
            </p>
          </div>

          <div
            class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[240px_190px_190px]"
          >
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Search Dean or Coordinator..."
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

          <UBadge
            v-if="searchQuery"
            color="neutral"
            variant="subtle"
          >
            Search: {{ searchQuery }}
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
        v-if="!filteredRecords.length"
        class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-900"
      >
        <div
          class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
        >
          <UIcon
            :name="records.length ? 'i-lucide-search-x' : 'i-lucide-file-clock'"
            class="size-8"
          />
        </div>

        <h2 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
          {{
            records.length
              ? 'No matching records found'
              : 'No Dean evaluation records yet'
          }}
        </h2>

        <p
          class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400"
        >
          {{
            records.length
              ? 'Try changing or clearing the current search and filters.'
              : 'Evaluations you submit for your Dean or Coordinator will appear here.'
          }}
        </p>

        <UButton
          v-if="records.length"
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
        RECORD CARDS
      ==================================================== -->
      <section
        v-else
        class="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3"
      >
        <article
          v-for="record in paginatedRecords"
          :key="record.documentId || record.id"
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-4 py-4 text-white"
          >
            <div
              class="pointer-events-none absolute -right-10 -top-14 size-36 rounded-full bg-emerald-500/20 blur-3xl"
            />

            <div class="relative flex items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <div
                  class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 font-bold text-emerald-300"
                >
                  {{ getDeanInitials(record) }}
                </div>

                <div class="min-w-0">
                  <p
                    class="text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-300"
                  >
                    Dean/Coordinator Evaluation
                  </p>

                  <h2 class="mt-0.5 truncate text-base font-bold">
                    {{ getDeanName(record) }}
                  </h2>

                  <p class="mt-0.5 truncate text-[11px] text-slate-300">
                    {{ getDepartment(record) }}
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
            <div class="grid grid-cols-2 gap-2">
              <div
                class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                  Semester
                </p>

                <p class="mt-1 truncate text-xs font-bold text-gray-800 dark:text-gray-200">
                  {{ getSemester(record) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                  School Year
                </p>

                <p class="mt-1 truncate text-xs font-bold text-gray-800 dark:text-gray-200">
                  {{ getSchoolYear(record) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                  Date
                </p>

                <p class="mt-1 truncate text-xs font-bold text-gray-800 dark:text-gray-200">
                  {{ formatDate(getEvaluationDate(record)) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                  Responses
                </p>

                <p class="mt-1 truncate text-xs font-bold text-gray-800 dark:text-gray-200">
                  {{ getResponses(record).length }}
                </p>
              </div>
            </div>

            <div
              class="rounded-xl border p-4"
              :class="getScoreContainerClass(getAverageScore(record))"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                    Average Rating
                  </p>

                  <div class="mt-1 flex items-end gap-1.5">
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">
                      {{ formatScore(getAverageScore(record)) }}
                    </p>

                    <span class="mb-1 text-xs font-medium text-gray-400">
                      / 4
                    </span>
                  </div>

                  <UBadge
                    :color="getScoreColor(getAverageScore(record))"
                    variant="subtle"
                    size="sm"
                    class="mt-1.5"
                  >
                    {{ getScoreLabel(getAverageScore(record)) }}
                  </UBadge>
                </div>

                <UIcon
                  name="i-lucide-chart-no-axes-combined"
                  class="size-8"
                  :class="getScoreIconClass(getAverageScore(record))"
                />
              </div>
            </div>

            <div
              v-if="getPrimaryFeedback(record)"
              class="rounded-xl border border-violet-100 bg-violet-50/60 p-3.5 dark:border-violet-900 dark:bg-violet-950/20"
            >
              <div class="flex items-start gap-2.5">
                <div
                  class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
                >
                  <UIcon
                    name="i-lucide-message-square-text"
                    class="size-3.5"
                  />
                </div>

                <div class="min-w-0">
                  <p class="text-[11px] font-bold text-gray-900 dark:text-white">
                    Written Feedback
                  </p>

                  <p
                    class="mt-1 line-clamp-3 whitespace-pre-line text-xs leading-5 text-gray-600 dark:text-gray-400"
                  >
                    {{ getPrimaryFeedback(record) }}
                  </p>
                </div>
              </div>
            </div>

            <div
              class="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-800"
            >
              <p class="text-[10px] text-gray-400">
                Ref: {{ getRecordReference(record) }}
              </p>

              <UButton
                color="neutral"
                variant="soft"
                size="xs"
                trailing-icon="i-lucide-chevron-right"
                @click="openRecordDetails(record)"
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
        v-if="filteredRecords.length > itemsPerPage"
        class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900"
      >
        <p class="text-center text-xs text-gray-500 sm:text-left dark:text-gray-400">
          Showing {{ paginationStart }}–{{ paginationEnd }} of
          {{ filteredRecords.length }} records
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
          v-if="selectedRecord"
          class="relative max-h-[85vh] overflow-y-auto rounded-[28px] border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-6 py-6 text-white"
          >
            <div
              class="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-emerald-500/20 blur-3xl"
            />

            <div class="relative flex items-start justify-between gap-4">
              <div class="flex min-w-0 items-center gap-4">
                <div
                  class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 font-bold text-emerald-300"
                >
                  {{ getDeanInitials(selectedRecord) }}
                </div>

                <div class="min-w-0">
                  <p
                    class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300"
                  >
                    Submitted Evaluation
                  </p>

                  <h2 class="mt-1 truncate text-xl font-bold">
                    {{ getDeanName(selectedRecord) }}
                  </h2>

                  <p class="mt-1 truncate text-xs text-slate-300">
                    {{ getDepartment(selectedRecord) }}
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
                <p class="text-[10px] uppercase text-gray-400">
                  Semester
                </p>

                <p class="mt-1 text-xs font-bold text-gray-800 dark:text-gray-200">
                  {{ getSemester(selectedRecord) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-[10px] uppercase text-gray-400">
                  School Year
                </p>

                <p class="mt-1 text-xs font-bold text-gray-800 dark:text-gray-200">
                  {{ getSchoolYear(selectedRecord) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-[10px] uppercase text-gray-400">
                  Date
                </p>

                <p class="mt-1 text-xs font-bold text-gray-800 dark:text-gray-200">
                  {{ formatDate(getEvaluationDate(selectedRecord)) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/20"
              >
                <p class="text-[10px] uppercase text-gray-400">
                  Average
                </p>

                <p class="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {{ formatScore(getAverageScore(selectedRecord)) }}/4
                </p>
              </div>
            </div>

            <div
              v-if="getStrengths(selectedRecord)"
              class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20"
            >
              <h3 class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <UIcon
                  name="i-lucide-thumbs-up"
                  class="size-4 text-emerald-500"
                />

                Strengths
              </h3>

              <p
                class="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                {{ getStrengths(selectedRecord) }}
              </p>
            </div>

            <div
              v-if="getAreasForImprovement(selectedRecord)"
              class="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/20"
            >
              <h3 class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <UIcon
                  name="i-lucide-lightbulb"
                  class="size-4 text-amber-500"
                />

                Areas for Improvement
              </h3>

              <p
                class="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                {{ getAreasForImprovement(selectedRecord) }}
              </p>
            </div>

            <div
              v-if="getComment(selectedRecord)"
              class="rounded-2xl border border-violet-100 bg-violet-50/60 p-4 dark:border-violet-900 dark:bg-violet-950/20"
            >
              <h3 class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <UIcon
                  name="i-lucide-message-square-text"
                  class="size-4 text-violet-500"
                />

                Additional Comment
              </h3>

              <p
                class="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                {{ getComment(selectedRecord) }}
              </p>
            </div>

            <div
              v-if="getResponses(selectedRecord).length"
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
                  v-for="(response, index) in getResponses(selectedRecord)"
                  :key="response.criterionId || index"
                  class="flex items-start justify-between gap-4 px-4 py-3"
                >
                  <div class="flex min-w-0 items-start gap-3">
                    <span
                      class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {{ index + 1 }}
                    </span>

                    <p class="text-sm leading-6 text-gray-600 dark:text-gray-400">
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
  middleware: ['auth', 'role'],
  role: ['Faculty']
})

const { $api } = useNuxtApp()
const { user } = useAuth()
const toast = useToast()

const records = ref<any[]>([])
const facultyProfile = ref<any>(null)
const activeSchoolYear = ref<any>(null)

const pending = ref(true)
const loadError = ref('')

const searchQuery = ref('')
const selectedSemester = ref('all')
const selectedSchoolYear = ref('all')

const currentPage = ref(1)
const itemsPerPage = 6

const detailsOpen = ref(false)
const selectedRecord = ref<any>(null)

const facultyName = computed(() => {
  return (
    facultyProfile.value?.name ||
    facultyProfile.value?.full_name ||
    user.value?.name ||
    user.value?.username ||
    'Faculty Member'
  )
})

const facultyDepartment = computed(() => {
  return (
    facultyProfile.value?.department?.name ||
    'No department assigned'
  )
})

const facultyEmail = computed(() => {
  return (
    facultyProfile.value?.email ||
    facultyProfile.value?.user?.email ||
    user.value?.email ||
    ''
  )
})

const facultyInitials = computed(() => {
  return createInitials(facultyName.value)
})

const activeSemester = computed(() => {
  return activeSchoolYear.value?.semester || ''
})

const activeSchoolYearLabel = computed(() => {
  return activeSchoolYear.value?.school_year || ''
})

const totalRecordCount = computed(() => {
  return records.value.length
})

const evaluatedDeanCount = computed(() => {
  const values = new Set(
    records.value
      .map(record =>
        record?.dean_coordinator?.documentId ||
        record?.dean_coordinator?.id ||
        record?.dean_coordinator?.name
      )
      .filter(Boolean)
  )

  return values.size
})

const overallAverage = computed(() => {
  const scores = records.value
    .map(record => getAverageScore(record))
    .filter(score => score > 0)

  if (!scores.length) return '0.00'

  return (
    scores.reduce((sum, score) => sum + score, 0) /
    scores.length
  ).toFixed(2)
})

const semesterFilterOptions = computed(() => {
  const values = Array.from(
    new Set(
      records.value
        .map(record => getSemester(record))
        .filter(
          value =>
            value &&
            value !== 'Not specified'
        )
    )
  )

  return [
    {
      label: 'All Semesters',
      value: 'all'
    },
    ...values.map(value => ({
      label: value,
      value
    }))
  ]
})

const schoolYearFilterOptions = computed(() => {
  const values = Array.from(
    new Set(
      records.value
        .map(record => getSchoolYear(record))
        .filter(
          value =>
            value &&
            value !== 'Not specified'
        )
    )
  )
    .sort()
    .reverse()

  return [
    {
      label: 'All School Years',
      value: 'all'
    },
    ...values.map(value => ({
      label: value,
      value
    }))
  ]
})

const filteredRecords = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return records.value.filter(record => {
    const deanName = getDeanName(record).toLowerCase()
    const department = getDepartment(record).toLowerCase()
    const semester = getSemester(record)
    const schoolYear = getSchoolYear(record)

    const matchesSearch =
      !query ||
      deanName.includes(query) ||
      department.includes(query)

    const matchesSemester =
      selectedSemester.value === 'all' ||
      semester === selectedSemester.value

    const matchesSchoolYear =
      selectedSchoolYear.value === 'all' ||
      schoolYear === selectedSchoolYear.value

    return (
      matchesSearch &&
      matchesSemester &&
      matchesSchoolYear
    )
  })
})

const totalPages = computed(() => {
  return Math.max(
    1,
    Math.ceil(
      filteredRecords.value.length /
      itemsPerPage
    )
  )
})

const paginatedRecords = computed(() => {
  const start =
    (currentPage.value - 1) *
    itemsPerPage

  return filteredRecords.value.slice(
    start,
    start + itemsPerPage
  )
})

const paginationStart = computed(() => {
  if (!filteredRecords.value.length) return 0

  return (
    (currentPage.value - 1) *
    itemsPerPage +
    1
  )
})

const paginationEnd = computed(() => {
  return Math.min(
    currentPage.value * itemsPerPage,
    filteredRecords.value.length
  )
})

const hasActiveFilters = computed(() => {
  return Boolean(
    searchQuery.value ||
    selectedSemester.value !== 'all' ||
    selectedSchoolYear.value !== 'all'
  )
})

const createInitials = (value: string) => {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part =>
      part.charAt(0).toUpperCase()
    )
    .join('')
}

const getDeanName = (record: any) => {
  return (
    record?.dean_coordinator?.name ||
    record?.dean_coordinator?.full_name ||
    'Dean/Coordinator'
  )
}

const getDeanInitials = (record: any) => {
  return createInitials(getDeanName(record))
}

const getDepartment = (record: any) => {
  return (
    record?.dean_coordinator?.department?.name ||
    record?.batch?.department ||
    facultyDepartment.value
  )
}

const getSemester = (record: any) => {
  return (
    record?.batch?.semester ||
    record?.semester ||
    'Not specified'
  )
}

const getSchoolYear = (record: any) => {
  return (
    record?.batch?.school_year ||
    record?.school_year ||
    'Not specified'
  )
}

const getEvaluationDate = (record: any) => {
  return (
    record?.batch?.date ||
    record?.date ||
    record?.createdAt
  )
}

const getStrengths = (record: any) => {
  return record?.strengths || ''
}

const getAreasForImprovement = (record: any) => {
  return (
    record?.areas_for_improvement ||
    record?.areasForImprovement ||
    ''
  )
}

const getComment = (record: any) => {
  return (
    record?.comment ||
    record?.feedback ||
    ''
  )
}

const getPrimaryFeedback = (record: any) => {
  return (
    getComment(record) ||
    getStrengths(record) ||
    getAreasForImprovement(record)
  )
}

const getResponses = (record: any) => {
  const rawResponses = record?.responses

  if (!rawResponses) return []

  if (Array.isArray(rawResponses)) {
    return rawResponses.map(
      (response: any, index: number) => ({
        criterionId:
          response.criterion_id ||
          response.criterionId ||
          response.id ||
          index,

        question:
          response.question ||
          response.statement ||
          '',

        score: Number(
          response.score ??
          response.value ??
          response.rating
        )
      })
    )
  }

  if (typeof rawResponses === 'object') {
    return Object.entries(rawResponses).map(
      ([criterionId, score]) => ({
        criterionId,
        question: '',
        score: Number(score)
      })
    )
  }

  return []
}

const getAverageScore = (record: any) => {
  const directScore = Number(
    record?.average_score ??
    record?.average ??
    record?.score
  )

  if (
    Number.isFinite(directScore) &&
    directScore > 0
  ) {
    return directScore
  }

  const scores = getResponses(record)
    .map(response => Number(response.score))
    .filter(score => Number.isFinite(score))

  if (!scores.length) return 0

  return (
    scores.reduce(
      (sum, score) => sum + score,
      0
    ) / scores.length
  )
}

const getRecordReference = (record: any) => {
  const value =
    record?.documentId ||
    record?.id

  if (!value) return 'N/A'

  return String(value).slice(-8)
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

const formatScore = (score: number) => {
  if (!score) return '0.00'

  return Number(score).toFixed(2)
}

const getScoreLabel = (score: number) => {
  if (score >= 3.5) return 'Superior'
  if (score >= 2.5) return 'Average'
  if (score >= 1.5) return 'Fair'
  if (score > 0) return 'Needs Improvement'
  return 'No Score'
}

const getScoreColor = (score: number) => {
  if (score >= 3.5) return 'success'
  if (score >= 2.5) return 'primary'
  if (score >= 1.5) return 'warning'
  return 'error'
}

const getScoreContainerClass = (score: number) => {
  if (score >= 3.5) {
    return [
      'border-emerald-100',
      'bg-emerald-50/70',
      'dark:border-emerald-900',
      'dark:bg-emerald-950/20'
    ]
  }

  if (score >= 2.5) {
    return [
      'border-blue-100',
      'bg-blue-50/70',
      'dark:border-blue-900',
      'dark:bg-blue-950/20'
    ]
  }

  if (score >= 1.5) {
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
  if (score >= 3.5) return 'text-emerald-500'
  if (score >= 2.5) return 'text-blue-500'
  if (score >= 1.5) return 'text-amber-500'
  return 'text-red-500'
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedSemester.value = 'all'
  selectedSchoolYear.value = 'all'
  currentPage.value = 1
}

const scrollToTop = async () => {
  await nextTick()

  if (!import.meta.client) return

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const previousPage = async () => {
  if (currentPage.value <= 1) return

  currentPage.value -= 1
  await scrollToTop()
}

const nextPage = async () => {
  if (currentPage.value >= totalPages.value) return

  currentPage.value += 1
  await scrollToTop()
}

const openRecordDetails = (record: any) => {
  selectedRecord.value = record
  detailsOpen.value = true
}

const getActiveSchoolYear = async () => {
  try {
    const response = await $api('/school-years', {
      query: {
        'filters[active_sy][$eq]': true,
        'pagination[pageSize]': 1
      }
    })

    activeSchoolYear.value =
      response.data?.[0] || null
  } catch (error) {
    console.error('Active school year error:', error)
    activeSchoolYear.value = null
  }
}

const getFacultyProfile = async () => {
  if (!user.value?.id) {
    facultyProfile.value = null
    return
  }

  const response = await $api('/teachers', {
    query: {
      'filters[user][id][$eq]':
        user.value.id,

      'populate[department]':
        true,

      'populate[user]':
        true,

      'pagination[pageSize]':
        1
    }
  })

  facultyProfile.value =
    response.data?.[0] || null
}

const getDeanEvaluationRecords = async () => {
  if (!user.value?.id) {
    records.value = []
    return
  }

  const response = await $api('/evaluations', {
    query: {
      'filters[evaluator_user][id][$eq]':
        user.value.id,

      'filters[batch][evaluation_type][code][$eq]':
        'faculty-dean-coordinator',

      'populate[dean_coordinator][populate][department]':
        true,

      'populate[batch][populate][evaluation_type]':
        true,

      'sort[0]':
        'createdAt:desc',

      'pagination[pageSize]':
        500
    }
  })

  records.value =
    response.data || []
}

const loadData = async () => {
  try {
    pending.value = true
    loadError.value = ''

    await Promise.all([
      getActiveSchoolYear(),
      getFacultyProfile(),
      getDeanEvaluationRecords()
    ])

    if (!facultyProfile.value) {
      throw new Error(
        'The logged-in faculty profile could not be found.'
      )
    }

    currentPage.value = 1
  } catch (error: any) {
    console.error(
      'Dean evaluation records loading error:',
      error
    )

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to load Dean evaluation records.'

    toast.add({
      title: 'Unable to load records',
      description: loadError.value,
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    pending.value = false
  }
}

watch(
  [
    searchQuery,
    selectedSemester,
    selectedSchoolYear
  ],
  () => {
    currentPage.value = 1
  }
)

watch(
  () => totalPages.value,
  value => {
    if (currentPage.value > value) {
      currentPage.value = value
    }
  }
)

watch(
  user,
  async value => {
    if (value?.id) {
      await loadData()
    }
  },
  {
    immediate: true
  }
)
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
