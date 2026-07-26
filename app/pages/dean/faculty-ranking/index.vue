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
              name="i-lucide-trophy"
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
                Dean Portal
              </span>

              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Department Performance
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Department Faculty Ranking
            </h1>

            <p
              class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90"
            >
              Review the performance ranking of faculty members in your
              department using available student and Dean evaluation records.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ rankedFaculty.length }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100"
            >
              Ranked Faculty
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ totalEvaluationCount }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100"
            >
              Evaluations
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ institutionAverage }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100"
            >
              Department Avg.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
      DEAN PROFILE / ACTIVE PERIOD
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
          {{ deanInitials }}
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2
              class="truncate text-base font-bold text-gray-900 sm:text-lg dark:text-white"
            >
              {{ deanName }}
            </h2>

            <UBadge
              color="success"
              variant="subtle"
              size="sm"
            >
              Dean
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

              {{ deanDepartment }}
            </span>

            <span
              v-if="deanEmail"
              class="flex items-center gap-1.5"
            >
              <UIcon
                name="i-lucide-mail"
                class="size-3.5"
              />

              {{ deanEmail }}
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
      <div
        class="grid grid-cols-1 gap-5 md:grid-cols-3"
      >
        <USkeleton
          v-for="index in 3"
          :key="index"
          class="h-64 w-full rounded-2xl"
        />
      </div>

      <USkeleton class="h-24 w-full rounded-2xl" />

      <div
        class="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3"
      >
        <USkeleton
          v-for="index in 6"
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
        <UIcon
          name="i-lucide-triangle-alert"
          class="size-7"
        />
      </div>

      <h2
        class="mt-4 text-lg font-bold text-gray-900 dark:text-white"
      >
        Unable to load department rankings
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
        TOP 3
      ==================================================== -->
      <section
        v-if="topThree.length"
        class="grid grid-cols-1 items-end gap-5 md:grid-cols-3"
      >
        <article
          v-if="topThree[1]"
          class="order-2 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm md:order-1 dark:border-slate-700 dark:bg-gray-900"
        >
          <div
            class="relative overflow-hidden bg-gradient-to-br from-slate-500 to-slate-700 px-5 py-6 text-center text-white"
          >
            <div
              class="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-xl font-bold"
            >
              {{ getFacultyInitials(topThree[1]) }}
            </div>

            <div
              class="mx-auto mt-4 flex size-9 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700"
            >
              2
            </div>

            <h2 class="mt-3 truncate text-base font-bold">
              {{ topThree[1].name }}
            </h2>

            <p class="mt-1 truncate text-xs text-slate-200">
              {{ topThree[1].department }}
            </p>
          </div>

          <div class="p-5 text-center">
            <p class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ formatScore(topThree[1].overallAverage) }}
            </p>

            <p class="mt-1 text-xs text-gray-400">
              Overall Average
            </p>

            <UBadge
              :color="getScoreColor(topThree[1].overallAverage)"
              variant="subtle"
              class="mt-3"
            >
              {{ getScoreLabel(topThree[1].overallAverage) }}
            </UBadge>
          </div>
        </article>

        <article
          v-if="topThree[0]"
          class="order-1 overflow-hidden rounded-[28px] border border-amber-200 bg-white shadow-xl shadow-amber-900/10 md:order-2 dark:border-amber-800 dark:bg-gray-900"
        >
          <div
            class="relative overflow-hidden bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 px-5 py-8 text-center text-white"
          >
            <div
              class="mx-auto flex size-16 items-center justify-center rounded-[22px] border border-white/25 bg-white/20 text-2xl font-bold shadow-lg"
            >
              {{ getFacultyInitials(topThree[0]) }}
            </div>

            <div
              class="mx-auto mt-4 flex size-11 items-center justify-center rounded-full bg-white font-bold text-amber-600 shadow-lg"
            >
              <UIcon
                name="i-lucide-crown"
                class="size-5"
              />
            </div>

            <h2 class="mt-3 truncate text-lg font-bold">
              {{ topThree[0].name }}
            </h2>

            <p class="mt-1 truncate text-xs text-amber-50">
              {{ topThree[0].department }}
            </p>
          </div>

          <div class="p-6 text-center">
            <p class="text-4xl font-bold text-gray-900 dark:text-white">
              {{ formatScore(topThree[0].overallAverage) }}
            </p>

            <p class="mt-1 text-xs text-gray-400">
              Overall Average
            </p>

            <UBadge
              :color="getScoreColor(topThree[0].overallAverage)"
              variant="subtle"
              class="mt-3"
            >
              {{ getScoreLabel(topThree[0].overallAverage) }}
            </UBadge>
          </div>
        </article>

        <article
          v-if="topThree[2]"
          class="order-3 overflow-hidden rounded-[24px] border border-orange-200 bg-white shadow-sm dark:border-orange-900 dark:bg-gray-900"
        >
          <div
            class="relative overflow-hidden bg-gradient-to-br from-orange-600 to-amber-800 px-5 py-6 text-center text-white"
          >
            <div
              class="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-xl font-bold"
            >
              {{ getFacultyInitials(topThree[2]) }}
            </div>

            <div
              class="mx-auto mt-4 flex size-9 items-center justify-center rounded-full bg-orange-200 font-bold text-orange-800"
            >
              3
            </div>

            <h2 class="mt-3 truncate text-base font-bold">
              {{ topThree[2].name }}
            </h2>

            <p class="mt-1 truncate text-xs text-orange-100">
              {{ topThree[2].department }}
            </p>
          </div>

          <div class="p-5 text-center">
            <p class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ formatScore(topThree[2].overallAverage) }}
            </p>

            <p class="mt-1 text-xs text-gray-400">
              Overall Average
            </p>

            <UBadge
              :color="getScoreColor(topThree[2].overallAverage)"
              variant="subtle"
              class="mt-3"
            >
              {{ getScoreLabel(topThree[2].overallAverage) }}
            </UBadge>
          </div>
        </article>
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
              Department Leaderboard
            </h2>

            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Search and filter faculty ranking records.
            </p>
          </div>

          <div
            class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[240px_190px_190px]"
          >
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Search faculty..."
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
        v-if="!filteredRanking.length"
        class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-900"
      >
        <div
          class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
        >
          <UIcon
            :name="rankedFaculty.length ? 'i-lucide-search-x' : 'i-lucide-trophy'"
            class="size-8"
          />
        </div>

        <h2 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
          {{
            rankedFaculty.length
              ? 'No matching faculty found'
              : 'No ranking data available'
          }}
        </h2>

        <p
          class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400"
        >
          {{
            rankedFaculty.length
              ? 'Try changing or clearing the current search and filters.'
              : 'Department faculty rankings will appear once evaluation records are available.'
          }}
        </p>

        <UButton
          v-if="rankedFaculty.length"
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
        RANKING CARDS
      ==================================================== -->
      <section
        v-else
        class="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3"
      >
        <article
          v-for="faculty in paginatedRanking"
          :key="faculty.teacherKey"
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
                  {{ getFacultyInitials(faculty) }}
                </div>

                <div class="min-w-0">
                  <p
                    class="text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-300"
                  >
                    Faculty Rank
                  </p>

                  <h2 class="mt-0.5 truncate text-base font-bold">
                    {{ faculty.name }}
                  </h2>

                  <p class="mt-0.5 truncate text-[11px] text-slate-300">
                    {{ faculty.department }}
                  </p>
                </div>
              </div>

              <div
                class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold"
              >
                #{{ faculty.rank }}
              </div>
            </div>
          </div>

          <div class="space-y-4 p-4">
            <div
              class="rounded-xl border p-4"
              :class="getScoreContainerClass(faculty.overallAverage)"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p
                    class="text-[10px] font-medium text-gray-500 dark:text-gray-400"
                  >
                    Overall Score
                  </p>

                  <div class="mt-1 flex items-end gap-1.5">
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">
                      {{ formatScore(faculty.overallAverage) }}
                    </p>

                    <span class="mb-1 text-xs font-medium text-gray-400">
                      / 5
                    </span>
                  </div>

                  <UBadge
                    :color="getScoreColor(faculty.overallAverage)"
                    variant="subtle"
                    size="sm"
                    class="mt-1.5"
                  >
                    {{ getScoreLabel(faculty.overallAverage) }}
                  </UBadge>
                </div>

                <UIcon
                  name="i-lucide-chart-no-axes-combined"
                  class="size-8"
                  :class="getScoreIconClass(faculty.overallAverage)"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div
                class="rounded-xl border border-blue-100 bg-blue-50/70 p-3 dark:border-blue-900 dark:bg-blue-950/20"
              >
                <p class="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                  Student Avg.
                </p>

                <p class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {{ formatScore(faculty.studentAverage) }}
                </p>

                <p class="mt-0.5 text-[10px] text-gray-400">
                  {{ faculty.studentEvaluationCount }} evaluation(s)
                </p>
              </div>

              <div
                class="rounded-xl border border-violet-100 bg-violet-50/70 p-3 dark:border-violet-900 dark:bg-violet-950/20"
              >
                <p class="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                  Dean Avg.
                </p>

                <p class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {{ formatScore(faculty.deanAverage) }}
                </p>

                <p class="mt-0.5 text-[10px] text-gray-400">
                  {{ faculty.deanEvaluationCount }} evaluation(s)
                </p>
              </div>

              <div
                class="rounded-xl border border-amber-100 bg-amber-50/70 p-3 dark:border-amber-900 dark:bg-amber-950/20"
              >
                <p class="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                  Subjects
                </p>

                <p class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {{ faculty.subjectCount }}
                </p>
              </div>

              <div
                class="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 dark:border-emerald-900 dark:bg-emerald-950/20"
              >
                <p class="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                  Total Records
                </p>

                <p class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {{ faculty.evaluationCount }}
                </p>
              </div>
            </div>

            <div
              class="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-800"
            >
              <p class="text-[10px] text-gray-400">
                Rank #{{ faculty.rank }} of {{ filteredRanking.length }}
              </p>

              <UButton
                color="neutral"
                variant="soft"
                size="xs"
                trailing-icon="i-lucide-chevron-right"
                @click="openFacultyDetails(faculty)"
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
        v-if="filteredRanking.length > itemsPerPage"
        class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900"
      >
        <p class="text-center text-xs text-gray-500 sm:text-left dark:text-gray-400">
          Showing {{ paginationStart }}–{{ paginationEnd }} of
          {{ filteredRanking.length }} faculty members
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
          v-if="selectedFaculty"
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
                  {{ getFacultyInitials(selectedFaculty) }}
                </div>

                <div class="min-w-0">
                  <p
                    class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300"
                  >
                    Faculty Ranking Details
                  </p>

                  <h2 class="mt-1 truncate text-xl font-bold">
                    {{ selectedFaculty.name }}
                  </h2>

                  <p class="mt-1 truncate text-xs text-slate-300">
                    {{ selectedFaculty.department }}
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
                class="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center dark:border-amber-900 dark:bg-amber-950/20"
              >
                <p class="text-[10px] uppercase text-gray-400">
                  Rank
                </p>

                <p class="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">
                  #{{ selectedFaculty.rank }}
                </p>
              </div>

              <div
                class="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center dark:border-emerald-900 dark:bg-emerald-950/20"
              >
                <p class="text-[10px] uppercase text-gray-400">
                  Overall
                </p>

                <p class="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  {{ formatScore(selectedFaculty.overallAverage) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-blue-100 bg-blue-50 p-3 text-center dark:border-blue-900 dark:bg-blue-950/20"
              >
                <p class="text-[10px] uppercase text-gray-400">
                  Student
                </p>

                <p class="mt-1 text-xl font-bold text-blue-700 dark:text-blue-400">
                  {{ formatScore(selectedFaculty.studentAverage) }}
                </p>
              </div>

              <div
                class="rounded-xl border border-violet-100 bg-violet-50 p-3 text-center dark:border-violet-900 dark:bg-violet-950/20"
              >
                <p class="text-[10px] uppercase text-gray-400">
                  Dean
                </p>

                <p class="mt-1 text-xl font-bold text-violet-700 dark:text-violet-400">
                  {{ formatScore(selectedFaculty.deanAverage) }}
                </p>
              </div>
            </div>

            <div
              class="rounded-2xl border border-gray-200 p-4 dark:border-gray-800"
            >
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                Evaluation Summary
              </h3>

              <div class="mt-4 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    Student evaluations
                  </span>

                  <span class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ selectedFaculty.studentEvaluationCount }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    Dean evaluations
                  </span>

                  <span class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ selectedFaculty.deanEvaluationCount }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    Subjects evaluated
                  </span>

                  <span class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ selectedFaculty.subjectCount }}
                  </span>
                </div>

                <div
                  class="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-800"
                >
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    Total records
                  </span>

                  <span class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ selectedFaculty.evaluationCount }}
                  </span>
                </div>
              </div>
            </div>

            <div
              v-if="selectedFaculty.subjects.length"
              class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <div
                class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                  Evaluated Subjects
                </h3>
              </div>

              <div class="divide-y divide-gray-200 dark:divide-gray-800">
                <div
                  v-for="subject in selectedFaculty.subjects"
                  :key="subject.key"
                  class="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div class="min-w-0">
                    <p class="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                      {{ subject.name }}
                    </p>
                  </div>

                  <span class="shrink-0 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {{ subject.count }} record(s)
                  </span>
                </div>
              </div>
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
  role: ['Dean', 'Admin']
})

const { $api } = useNuxtApp()
const { user } = useAuth()
const toast = useToast()

const teachers = ref<any[]>([])
const evaluations = ref<any[]>([])
const currentDean = ref<any>(null)
const activeSchoolYear = ref<any>(null)

const pending = ref(true)
const loadError = ref('')

const searchQuery = ref('')
const selectedSemester = ref('all')
const selectedSchoolYear = ref('all')

const currentPage = ref(1)
const itemsPerPage = 9

const detailsOpen = ref(false)
const selectedFaculty = ref<any>(null)

const activeSemester = computed(() => {
  return activeSchoolYear.value?.semester || ''
})

const activeSchoolYearLabel = computed(() => {
  return activeSchoolYear.value?.school_year || ''
})

const deanName = computed(() => {
  return (
    currentDean.value?.name ||
    currentDean.value?.full_name ||
    user.value?.name ||
    user.value?.username ||
    'Dean'
  )
})

const deanDepartment = computed(() => {
  return (
    currentDean.value?.department?.name ||
    'No department assigned'
  )
})

const deanEmail = computed(() => {
  return (
    currentDean.value?.email ||
    currentDean.value?.user?.email ||
    user.value?.email ||
    ''
  )
})

const deanInitials = computed(() => {
  return createInitials(deanName.value)
})

const semesterFilterOptions = computed(() => {
  const values = Array.from(
    new Set(
      evaluations.value
        .map(evaluation => getSemester(evaluation))
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
      evaluations.value
        .map(evaluation => getSchoolYear(evaluation))
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

const periodFilteredEvaluations = computed(() => {
  return evaluations.value.filter(evaluation => {
    const semester = getSemester(evaluation)
    const schoolYear = getSchoolYear(evaluation)

    const matchesSemester =
      selectedSemester.value === 'all' ||
      semester === selectedSemester.value

    const matchesSchoolYear =
      selectedSchoolYear.value === 'all' ||
      schoolYear === selectedSchoolYear.value

    return matchesSemester && matchesSchoolYear
  })
})

const rankedFaculty = computed(() => {
  const groups = new Map<string, any>()

  teachers.value.forEach((teacher: any) => {
    const key = getTeacherKey(teacher)

    groups.set(key, {
      teacherKey: key,
      teacher,
      name:
        teacher.name ||
        teacher.full_name ||
        'Unknown Faculty',
      department:
        teacher.department?.name ||
        deanDepartment.value,
      evaluations: []
    })
  })

  periodFilteredEvaluations.value.forEach((evaluation: any) => {
    const teacher = evaluation.teacher

    if (!teacher) return

    const key = getTeacherKey(teacher)

    if (!groups.has(key)) {
      groups.set(key, {
        teacherKey: key,
        teacher,
        name:
          teacher.name ||
          teacher.full_name ||
          'Unknown Faculty',
        department:
          teacher.department?.name ||
          deanDepartment.value,
        evaluations: []
      })
    }

    groups.get(key).evaluations.push(evaluation)
  })

  const ranking = Array.from(groups.values())
    .map(group => {
      const studentRecords = group.evaluations.filter(
        (evaluation: any) =>
          getSourceType(evaluation) === 'student'
      )

      const deanRecords = group.evaluations.filter(
        (evaluation: any) =>
          getSourceType(evaluation) === 'dean'
      )

      const studentAverage = calculateAverage(
        studentRecords.map((evaluation: any) =>
          getNormalisedScore(evaluation)
        )
      )

      const deanAverage = calculateAverage(
        deanRecords.map((evaluation: any) =>
          getNormalisedScore(evaluation)
        )
      )

      const allScores = group.evaluations
        .map((evaluation: any) =>
          getNormalisedScore(evaluation)
        )
        .filter((score: number) => score > 0)

      const overallAverage = calculateAverage(allScores)

      const subjectMap = new Map<string, any>()

      studentRecords.forEach((evaluation: any) => {
        const subject = evaluation.subject

        if (!subject) return

        const key = String(
          subject.documentId ||
          subject.id ||
          subject.name
        )

        if (!subjectMap.has(key)) {
          subjectMap.set(key, {
            key,
            name:
              subject.code && subject.name
                ? `${subject.code} - ${subject.name}`
                : subject.name ||
                  subject.code ||
                  'Unknown Subject',
            count: 0
          })
        }

        subjectMap.get(key).count += 1
      })

      return {
        ...group,
        studentAverage,
        deanAverage,
        overallAverage,
        studentEvaluationCount: studentRecords.length,
        deanEvaluationCount: deanRecords.length,
        evaluationCount: group.evaluations.length,
        subjects: Array.from(subjectMap.values()),
        subjectCount: subjectMap.size
      }
    })
    .filter(faculty => faculty.evaluationCount > 0)
    .sort((a, b) => {
      if (b.overallAverage !== a.overallAverage) {
        return b.overallAverage - a.overallAverage
      }

      return b.evaluationCount - a.evaluationCount
    })

  let previousScore: number | null = null
  let previousRank = 0

  return ranking.map((faculty, index) => {
    const rank =
      previousScore !== null &&
      faculty.overallAverage === previousScore
        ? previousRank
        : index + 1

    previousScore = faculty.overallAverage
    previousRank = rank

    return {
      ...faculty,
      rank
    }
  })
})

const topThree = computed(() => {
  return rankedFaculty.value.slice(0, 3)
})

const totalEvaluationCount = computed(() => {
  return periodFilteredEvaluations.value.length
})

const institutionAverage = computed(() => {
  const scores = rankedFaculty.value
    .map(faculty => faculty.overallAverage)
    .filter(score => score > 0)

  return formatScore(calculateAverage(scores))
})

const filteredRanking = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return rankedFaculty.value.filter(faculty => {
    return (
      !query ||
      faculty.name.toLowerCase().includes(query) ||
      faculty.department.toLowerCase().includes(query)
    )
  })
})

const totalPages = computed(() => {
  return Math.max(
    1,
    Math.ceil(
      filteredRanking.value.length /
      itemsPerPage
    )
  )
})

const paginatedRanking = computed(() => {
  const start =
    (currentPage.value - 1) *
    itemsPerPage

  return filteredRanking.value.slice(
    start,
    start + itemsPerPage
  )
})

const paginationStart = computed(() => {
  if (!filteredRanking.value.length) return 0

  return (
    (currentPage.value - 1) *
    itemsPerPage +
    1
  )
})

const paginationEnd = computed(() => {
  return Math.min(
    currentPage.value * itemsPerPage,
    filteredRanking.value.length
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

const getFacultyInitials = (faculty: any) => {
  return createInitials(faculty?.name || 'Faculty')
}

const getTeacherKey = (teacher: any) => {
  return String(
    teacher?.documentId ||
    teacher?.id ||
    teacher?.name ||
    teacher?.full_name
  )
}

const getEvaluationCode = (evaluation: any) => {
  return (
    evaluation?.batch
      ?.evaluation_type
      ?.code ||
    evaluation?.evaluation_type
      ?.code ||
    ''
  )
}

const getSourceType = (evaluation: any) => {
  const code = getEvaluationCode(evaluation)

  if (
    code === 'dean-faculty' ||
    evaluation?.dean_coordinator
  ) {
    return 'dean'
  }

  return 'student'
}

const getSemester = (evaluation: any) => {
  return (
    evaluation?.batch?.semester ||
    evaluation?.semester ||
    'Not specified'
  )
}

const getSchoolYear = (evaluation: any) => {
  return (
    evaluation?.batch?.school_year ||
    evaluation?.school_year ||
    'Not specified'
  )
}

const getResponses = (evaluation: any) => {
  const rawResponses = evaluation?.responses

  if (!rawResponses) return []

  if (Array.isArray(rawResponses)) {
    return rawResponses.map(
      (response: any, index: number) => ({
        criterionId:
          response.criterion_id ||
          response.criterionId ||
          response.id ||
          index,
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
        score: Number(score)
      })
    )
  }

  return []
}

const getRawAverageScore = (evaluation: any) => {
  const directScore = Number(
    evaluation?.average_score ??
    evaluation?.average ??
    evaluation?.score
  )

  if (
    Number.isFinite(directScore) &&
    directScore > 0
  ) {
    return directScore
  }

  const scores = getResponses(evaluation)
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

const getNormalisedScore = (evaluation: any) => {
  const score = getRawAverageScore(evaluation)

  if (!score) return 0

  if (
    getSourceType(evaluation) === 'dean' &&
    score <= 4
  ) {
    return (score / 4) * 5
  }

  return score
}

const calculateAverage = (scores: number[]) => {
  const validScores = scores.filter(
    score =>
      Number.isFinite(score) &&
      score > 0
  )

  if (!validScores.length) return 0

  return (
    validScores.reduce(
      (sum, score) => sum + score,
      0
    ) / validScores.length
  )
}

const formatScore = (score: number) => {
  if (!score) return '0.00'

  return Number(score).toFixed(2)
}

const getScoreLabel = (score: number) => {
  if (score >= 4.5) return 'Outstanding'
  if (score >= 3.5) return 'Excellent'
  if (score >= 2.5) return 'Satisfactory'
  if (score > 0) return 'Needs Improvement'
  return 'No Score'
}

const getScoreColor = (score: number) => {
  if (score >= 4.5) return 'success'
  if (score >= 3.5) return 'primary'
  if (score >= 2.5) return 'warning'
  return 'error'
}

const getScoreContainerClass = (score: number) => {
  if (score >= 4.5) {
    return [
      'border-emerald-100',
      'bg-emerald-50/70',
      'dark:border-emerald-900',
      'dark:bg-emerald-950/20'
    ]
  }

  if (score >= 3.5) {
    return [
      'border-blue-100',
      'bg-blue-50/70',
      'dark:border-blue-900',
      'dark:bg-blue-950/20'
    ]
  }

  if (score >= 2.5) {
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
  if (score >= 4.5) return 'text-emerald-500'
  if (score >= 3.5) return 'text-blue-500'
  if (score >= 2.5) return 'text-amber-500'
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

const openFacultyDetails = (faculty: any) => {
  selectedFaculty.value = faculty
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

const getCurrentDean = async () => {
  if (!user.value?.id) {
    currentDean.value = null
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

  currentDean.value =
    response.data?.[0] || null
}

const getTeachers = async () => {
  const departmentId =
    currentDean.value?.department?.id

  if (!departmentId) {
    teachers.value = []
    return
  }

  const response = await $api('/teachers', {
    query: {
      'filters[user][role][name][$eq]':
        'Faculty',
      'filters[department][id][$eq]':
        departmentId,
      'populate[department]':
        true,
      'populate[user][populate][0]':
        'role',
      'sort[0]':
        'name:asc',
      'pagination[pageSize]':
        500
    }
  })

  teachers.value =
    response.data || []
}

const getEvaluations = async () => {
  const departmentId =
    currentDean.value?.department?.id

  if (!departmentId) {
    evaluations.value = []
    return
  }

  const response = await $api('/evaluations', {
    query: {
      'filters[teacher][department][id][$eq]':
        departmentId,

      'filters[batch][evaluation_type][code][$in][0]':
        'student-faculty',

      'filters[batch][evaluation_type][code][$in][1]':
        'dean-faculty',

      'populate[teacher][populate][department]':
        true,

      'populate[subject][populate][course]':
        true,

      'populate[dean_coordinator]':
        true,

      'populate[batch][populate][evaluation_type]':
        true,

      'sort[0]':
        'createdAt:desc',

      'pagination[pageSize]':
        1000
    }
  })

  evaluations.value =
    response.data || []
}

const loadData = async () => {
  try {
    pending.value = true
    loadError.value = ''

    await Promise.all([
      getActiveSchoolYear(),
      getCurrentDean()
    ])

    if (!currentDean.value) {
      throw new Error(
        'The logged-in Dean profile could not be found.'
      )
    }

    if (!currentDean.value?.department?.id) {
      throw new Error(
        'The logged-in Dean is not assigned to a department.'
      )
    }

    await Promise.all([
      getTeachers(),
      getEvaluations()
    ])

    currentPage.value = 1
  } catch (error: any) {
    console.error(
      'Department faculty ranking loading error:',
      error
    )

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to load department faculty rankings.'

    toast.add({
      title: 'Unable to load rankings',
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
