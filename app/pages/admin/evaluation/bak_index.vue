<template>
  <div class="space-y-6 pb-8">
    <!-- =====================================================
          HERO
        ====================================================== -->
    <section
      class="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7"
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
            <UIcon name="i-lucide-graduation-cap" class="size-7" />
          </div>

          <div class="min-w-0">
            <div
              class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-50"
            >
              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Administrator Portal
              </span>

              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Grouped by Faculty
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Student – Faculty Results
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Review consolidated student evaluations in a scalable table
              designed for large faculty datasets.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ summary.totalFaculty }}
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
              {{ summary.totalEvaluations }}
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
              {{ summary.averageScore }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100"
            >
              Average
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
              Faculty Groups
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ summary.totalFaculty }}
            </p>
          </div>

          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          >
            <UIcon name="i-lucide-users-round" class="size-5" />
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-violet-100 bg-violet-50/70 p-5 dark:border-violet-900 dark:bg-violet-950/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Evaluation Records
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ summary.totalEvaluations }}
            </p>
          </div>

          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
          >
            <UIcon name="i-lucide-files" class="size-5" />
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-amber-100 bg-amber-50/70 p-5 dark:border-amber-900 dark:bg-amber-950/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Unique Students
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ summary.totalEvaluators }}
            </p>
          </div>

          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          >
            <UIcon name="i-lucide-user-round-check" class="size-5" />
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
              {{ summary.averageScore }}
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

    <!-- =====================================================
          FILTERS
        ====================================================== -->
    <section
      class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="mb-4">
        <h2 class="text-sm font-bold text-gray-900 dark:text-white">
          Student – Faculty Results
        </h2>

        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Search and filter grouped faculty evaluation results.
        </p>
      </div>

      <div
        class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.2fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(170px,0.9fr)_minmax(170px,0.9fr)]"
      >
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search faculty..."
          class="w-full"
        />

        <USelectMenu
          v-model="selectedFaculty"
          :items="facultyOptions"
          value-key="value"
          class="w-full"
        />

        <USelectMenu
          v-model="selectedDepartment"
          :items="departmentOptions"
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
          v-if="selectedFaculty !== 'all'"
          color="primary"
          variant="subtle"
        >
          {{ getSelectedLabel(facultyOptions, selectedFaculty) }}
        </UBadge>

        <UBadge
          v-if="selectedDepartment !== 'all'"
          color="info"
          variant="subtle"
        >
          {{ selectedDepartment }}
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
    <div v-if="pending" class="space-y-4">
      <USkeleton class="h-20 w-full rounded-2xl" />
      <USkeleton class="h-[520px] w-full rounded-2xl" />
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
        Unable to load results
      </h2>

      <p
        class="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400"
      >
        {{ loadError }}
      </p>

      <UButton class="mt-5" icon="i-lucide-refresh-cw" @click="getResults">
        Try Again
      </UButton>
    </section>

    <template v-else>
      <!-- ===================================================
            TABLE CARD
          ==================================================== -->
      <section
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between dark:border-gray-800"
        >
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              Grouped Evaluation Results
            </h2>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Showing {{ filteredGroups.length }} faculty group{{
                filteredGroups.length === 1 ? "" : "s"
              }}
              from {{ filteredEvaluationRecords.length }} evaluation record{{
                filteredEvaluationRecords.length === 1 ? "" : "s"
              }}.
            </p>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Search faculty or department..."
              class="w-full sm:w-72"
            />

            <USelect
              v-model="pageSize"
              :items="pageSizeOptions"
              class="w-full sm:w-28"
            />
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div v-if="!filteredGroups.length" class="px-6 py-16 text-center">
          <div
            class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
          >
            <UIcon
              :name="
                groupedResults.length
                  ? 'i-lucide-search-x'
                  : 'i-lucide-file-chart-column'
              "
              class="size-8"
            />
          </div>

          <h3 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
            {{
              groupedResults.length
                ? "No matching faculty found"
                : "No evaluation results available"
            }}
          </h3>

          <p
            class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400"
          >
            {{
              groupedResults.length
                ? "Try another faculty name or department."
                : "No Student – Faculty evaluation results matched the selected filters."
            }}
          </p>
        </div>

        <!-- TABLE -->
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[1080px] text-sm">
            <thead
              class="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40 dark:text-gray-400"
            >
              <tr>
                <th class="px-5 py-3 text-left">Faculty</th>
                <th class="px-4 py-3 text-left">Department</th>
                <th class="px-4 py-3 text-center">Evaluations</th>
                <th class="px-4 py-3 text-center">Students</th>
                <th class="px-4 py-3 text-center">Average</th>
                <th class="px-4 py-3 text-center">Rating</th>
                <th class="px-4 py-3 text-center">Positive</th>
                <th class="px-4 py-3 text-center">Negative</th>
                <th class="px-4 py-3 text-left">Latest</th>
                <th class="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="group in paginatedGroups"
                :key="group.key"
                class="transition hover:bg-gray-50/80 dark:hover:bg-gray-950/30"
              >
                <td class="px-5 py-4">
                  <div class="flex min-w-0 items-center gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm"
                    >
                      {{ createInitials(group.name) }}
                    </div>

                    <div class="min-w-0">
                      <p
                        class="truncate font-bold text-gray-900 dark:text-white"
                      >
                        {{ group.name }}
                      </p>

                      <p
                        class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400"
                      >
                        {{ group.schoolYears.join(", ") || "No school year" }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
                  {{ group.department }}
                </td>

                <td class="px-4 py-4 text-center font-semibold">
                  {{ group.recordCount }}
                </td>

                <td class="px-4 py-4 text-center font-semibold">
                  {{ group.evaluatorCount }}
                </td>

                <td class="px-4 py-4 text-center">
                  <div class="font-bold text-gray-900 dark:text-white">
                    {{ formatNumber(group.averageScore) }}
                  </div>

                  <div class="text-[10px] text-gray-400">out of 5</div>
                </td>

                <td class="px-4 py-4 text-center">
                  <span
                    class="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
                    :class="ratingBadge(group.averageScore)"
                  >
                    {{ getRatingLabel(group.averageScore) }}
                  </span>
                </td>

                <td class="px-4 py-4 text-center">
                  <span
                    class="inline-flex min-w-8 justify-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                  >
                    {{ group.sentiments.positive }}
                  </span>
                </td>

                <td class="px-4 py-4 text-center">
                  <span
                    class="inline-flex min-w-8 justify-center rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-400"
                  >
                    {{ group.sentiments.negative }}
                  </span>
                </td>

                <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
                  {{ formatDate(group.latestDate) }}
                </td>

                <td class="px-5 py-4 text-center">
                  <UButton
                    size="xs"
                    color="neutral"
                    variant="soft"
                    icon="i-lucide-eye"
                    @click="openGroup(group)"
                  >
                    View
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGINATION -->
        <div
          v-if="filteredGroups.length"
          class="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
        >
          <p
            class="text-center text-xs text-gray-500 sm:text-left dark:text-gray-400"
          >
            Showing {{ paginationStart }}–{{ paginationEnd }} of
            {{ filteredGroups.length }} faculty groups
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
    </template>

    <!-- =====================================================
          DETAILS MODAL
        ====================================================== -->
    <UModal
      id="student-faculty-result-details"
      v-model:open="showGroupDetails"
      title="Faculty Evaluation Summary"
      description="View the consolidated student evaluation summary, criteria averages, rating distribution, and individual records."
    >
      <template #content>
        <div
          v-if="selectedGroup"
          class="max-h-[88vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900"
        >
          <div
            class="relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-6 py-6 text-white"
          >
            <div
              class="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-white/10 blur-3xl"
            />

            <div class="relative flex items-start justify-between gap-4">
              <div class="flex min-w-0 items-center gap-4">
                <div
                  class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 font-bold"
                >
                  {{ createInitials(selectedGroup.name) }}
                </div>

                <div class="min-w-0">
                  <p
                    class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200"
                  >
                    Faculty Evaluation Summary
                  </p>

                  <h2 class="mt-1 truncate text-xl font-bold">
                    {{ selectedGroup.name }}
                  </h2>

                  <p class="mt-1 truncate text-xs text-slate-300">
                    {{ selectedGroup.department }}
                  </p>
                </div>
              </div>

              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                square
                class="text-white hover:bg-white/10"
                @click="showGroupDetails = false"
              />
            </div>
          </div>

          <div class="space-y-5 p-6">
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-[10px] uppercase text-gray-400">Evaluations</p>

                <p
                  class="mt-1 text-sm font-bold text-gray-800 dark:text-gray-200"
                >
                  {{ selectedGroup.recordCount }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-[10px] uppercase text-gray-400">Students</p>

                <p
                  class="mt-1 text-sm font-bold text-gray-800 dark:text-gray-200"
                >
                  {{ selectedGroup.evaluatorCount }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-[10px] uppercase text-gray-400">Criteria</p>

                <p
                  class="mt-1 text-sm font-bold text-gray-800 dark:text-gray-200"
                >
                  {{ selectedGroup.criteriaCount }}
                </p>
              </div>

              <div
                class="rounded-xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/20"
              >
                <p class="text-[10px] uppercase text-gray-400">Average</p>

                <p
                  class="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-400"
                >
                  {{ formatNumber(selectedGroup.averageScore) }}/5
                </p>
              </div>
            </div>


            <!-- CONSOLIDATED FACULTY SUMMARY -->
            <section
              class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <div
                class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <div
                  class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                      Consolidated Faculty Summary
                    </h3>

                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Combined result from
                      {{ selectedGroup.evaluatorCount }}
                      student respondent{{
                        selectedGroup.evaluatorCount === 1 ? "" : "s"
                      }}.
                    </p>
                  </div>

                  <UBadge
                    :color="ratingColor(selectedGroup.averageScore)"
                    variant="subtle"
                    size="lg"
                  >
                    {{ formatNumber(selectedGroup.averageScore) }}/5 ·
                    {{ getRatingLabel(selectedGroup.averageScore) }}
                  </UBadge>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
                <div
                  class="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-950/40"
                >
                  <p class="text-[10px] uppercase text-gray-400">Students</p>
                  <p class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                    {{ selectedGroup.evaluatorCount }}
                  </p>
                </div>

                <div
                  class="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-950/40"
                >
                  <p class="text-[10px] uppercase text-gray-400">Criteria</p>
                  <p class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                    {{ selectedGroup.criteriaCount }}
                  </p>
                </div>

                <div
                  class="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-950/40"
                >
                  <p class="text-[10px] uppercase text-gray-400">
                    Ratings Received
                  </p>
                  <p class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                    {{ selectedGroup.totalRatingResponses }}
                  </p>
                </div>

                <div
                  class="rounded-xl bg-emerald-50 p-3 text-center dark:bg-emerald-950/20"
                >
                  <p class="text-[10px] uppercase text-gray-400">Completion</p>
                  <p
                    class="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-400"
                  >
                    {{ selectedGroup.completionRate }}%
                  </p>
                </div>
              </div>

              <div
                class="grid grid-cols-5 gap-2 border-t border-gray-200 p-4 dark:border-gray-800"
              >
                <div
                  v-for="score in [5, 4, 3, 2, 1]"
                  :key="score"
                  class="rounded-xl bg-gray-50 p-2 text-center dark:bg-gray-950/40"
                >
                  <p class="text-[10px] font-semibold uppercase text-gray-400">
                    Rating {{ score }}
                  </p>
                  <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                    {{ selectedGroup.ratingDistribution[score] || 0 }}
                  </p>
                </div>
              </div>
            </section>

            <!-- CRITERIA SUMMARY -->
            <section
              class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <div
                class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                  Criteria Summary
                </h3>

                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Consolidated average and rating distribution for every
                  evaluation criterion.
                </p>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-sm">
                  <thead
                    class="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40 dark:text-gray-400"
                  >
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

                  <tbody
                    class="divide-y divide-gray-100 dark:divide-gray-800"
                  >
                    <tr
                      v-for="criterion in selectedGroup.criteriaSummary"
                      :key="criterion.criteriaId"
                    >
                      <td
                        class="max-w-md px-4 py-3 text-gray-700 dark:text-gray-300"
                      >
                        {{ criterion.statement }}
                      </td>

                      <td class="px-3 py-3 text-center font-semibold">
                        {{ criterion.responseCount }}
                      </td>

                      <td
                        class="px-3 py-3 text-center font-bold text-emerald-700 dark:text-emerald-400"
                      >
                        {{ formatNumber(criterion.averageScore) }}
                      </td>

                      <td class="px-3 py-3 text-center">
                        {{ criterion.distribution[5] || 0 }}
                      </td>
                      <td class="px-3 py-3 text-center">
                        {{ criterion.distribution[4] || 0 }}
                      </td>
                      <td class="px-3 py-3 text-center">
                        {{ criterion.distribution[3] || 0 }}
                      </td>
                      <td class="px-3 py-3 text-center">
                        {{ criterion.distribution[2] || 0 }}
                      </td>
                      <td class="px-3 py-3 text-center">
                        {{ criterion.distribution[1] || 0 }}
                      </td>

                      <td class="px-4 py-3 text-center">
                        <span
                          class="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
                          :class="ratingBadge(criterion.averageScore)"
                        >
                          {{ getRatingLabel(criterion.averageScore) }}
                        </span>
                      </td>
                    </tr>

                    <tr v-if="!selectedGroup.criteriaSummary.length">
                      <td
                        colspan="9"
                        class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        No criterion responses are available.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- RECORD SELECTOR -->
            <section
              class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <div
                class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                  Evaluation Records
                </h3>

                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Select a record to inspect its criteria, comment, and AI
                  analysis.
                </p>
              </div>

              <div
                class="max-h-64 divide-y divide-gray-200 overflow-y-auto dark:divide-gray-800"
              >
                <button
                  v-for="record in selectedGroup.records"
                  :key="getEvaluationKey(record)"
                  type="button"
                  class="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-950/40"
                  :class="
                    getEvaluationKey(selectedEvaluation) ===
                    getEvaluationKey(record)
                      ? 'bg-emerald-50 dark:bg-emerald-950/20'
                      : ''
                  "
                  @click="selectEvaluation(record)"
                >
                  <div class="min-w-0">
                    <p
                      class="truncate text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      {{ getRecordLabel(record) }}
                    </p>

                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {{ getSemester(record) }} · {{ getSchoolYear(record) }} ·
                      {{ formatDate(getEvaluationDate(record)) }}
                    </p>
                  </div>

                  <div class="flex shrink-0 items-center gap-2">
                    <span
                      class="rounded-full px-2 py-1 text-xs font-semibold"
                      :class="sentimentBadge(record.feedback_sentiment)"
                    >
                      {{ record.feedback_sentiment || "Neutral" }}
                    </span>

                    <UBadge
                      :color="ratingColor(record.average_score)"
                      variant="subtle"
                    >
                      {{ formatNumber(record.average_score) }}
                    </UBadge>
                  </div>
                </button>
              </div>
            </section>

            <template v-if="selectedEvaluation">
              <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div
                  class="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-800 dark:bg-gray-950/40"
                >
                  <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>

                  <p
                    class="mt-1 text-lg font-bold text-gray-900 dark:text-white"
                  >
                    {{ selectedEvaluation.total_score || 0 }}
                  </p>
                </div>

                <div
                  class="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-800 dark:bg-gray-950/40"
                >
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Average
                  </p>

                  <p
                    class="mt-1 text-lg font-bold text-gray-900 dark:text-white"
                  >
                    {{ formatNumber(selectedEvaluation.average_score) }}
                  </p>
                </div>

                <div
                  class="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-800 dark:bg-gray-950/40"
                >
                  <p class="text-xs text-gray-500 dark:text-gray-400">Rating</p>

                  <p
                    class="mt-1 text-lg font-bold text-gray-900 dark:text-white"
                  >
                    {{ getRatingLabel(selectedEvaluation.average_score) }}
                  </p>
                </div>
              </div>

              <section
                class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
              >
                <div
                  class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40"
                >
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                    Criteria Responses
                  </h3>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead
                      class="bg-gray-50 text-xs uppercase text-gray-600 dark:bg-gray-950/40 dark:text-gray-400"
                    >
                      <tr>
                        <th class="px-4 py-3 text-left">Criteria</th>

                        <th class="px-4 py-3 text-center">Score</th>
                      </tr>
                    </thead>

                    <tbody
                      class="divide-y divide-gray-100 dark:divide-gray-800"
                    >
                      <tr
                        v-for="item in formatResponses(
                          selectedEvaluation.responses,
                        )"
                        :key="item.criteria_id"
                      >
                        <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {{ item.statement }}
                        </td>

                        <td
                          class="px-4 py-3 text-center font-bold text-gray-900 dark:text-white"
                        >
                          {{ item.score }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section
                class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
              >
                <div
                  class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40"
                >
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                    Student Comment
                  </h3>
                </div>

                <p
                  class="min-h-24 whitespace-pre-line p-4 text-sm leading-6 text-gray-600 dark:text-gray-400"
                >
                  {{ selectedEvaluation.comment || "No comment provided." }}
                </p>
              </section>

              <section
                class="overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/50 dark:border-violet-900 dark:bg-violet-950/20"
              >
                <div
                  class="border-b border-violet-100 px-4 py-3 dark:border-violet-900"
                >
                  <h3
                    class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"
                  >
                    <UIcon
                      name="i-lucide-sparkles"
                      class="size-4 text-violet-600"
                    />

                    AI Sentiment Analysis
                  </h3>
                </div>

                <div class="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
                  <div
                    class="rounded-xl border border-white/60 bg-white/70 p-3 text-center dark:border-gray-800 dark:bg-gray-900/60"
                  >
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Sentiment
                    </p>

                    <span
                      class="mt-2 inline-block rounded-full px-2 py-1 text-xs font-semibold"
                      :class="
                        sentimentBadge(selectedEvaluation.feedback_sentiment)
                      "
                    >
                      {{ selectedEvaluation.feedback_sentiment || "Neutral" }}
                    </span>
                  </div>

                  <div
                    class="rounded-xl border border-white/60 bg-white/70 p-3 text-center dark:border-gray-800 dark:bg-gray-900/60"
                  >
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Keywords
                    </p>

                    <p
                      class="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200"
                    >
                      {{ formatKeywords(selectedEvaluation.feedback_keywords) }}
                    </p>
                  </div>
                </div>

                <div
                  class="border-t border-violet-100 p-4 dark:border-violet-900"
                >
                  <p
                    class="text-xs font-semibold text-gray-500 dark:text-gray-400"
                  >
                    AI Summary
                  </p>

                  <p
                    class="mt-1 whitespace-pre-line text-sm leading-6 text-gray-700 dark:text-gray-300"
                  >
                    {{
                      selectedEvaluation.feedback_sentiment_summary ||
                      "No AI summary available."
                    }}
                  </p>
                </div>

                <div
                  class="border-t border-violet-100 p-4 dark:border-violet-900"
                >
                  <p
                    class="text-xs font-semibold text-gray-500 dark:text-gray-400"
                  >
                    AI Suggestion
                  </p>

                  <p
                    class="mt-1 whitespace-pre-line text-sm leading-6 text-gray-700 dark:text-gray-300"
                  >
                    {{
                      selectedEvaluation.feedback_sentiment_suggestion ||
                      "No AI suggestion available."
                    }}
                  </p>
                </div>
              </section>
            </template>

            <div class="flex justify-end">
              <UButton
                color="neutral"
                variant="outline"
                @click="showGroupDetails = false"
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
  role: ["Admin"],
});

const { $api } = useNuxtApp();
const toast = useToast();

const pending = ref(false);
const loadError = ref("");

const evaluations = ref<any[]>([]);

const selectedGroup = ref<any>(null);
const selectedEvaluation = ref<any>(null);
const showGroupDetails = ref(false);

const searchQuery = ref("");
const selectedFaculty = ref("all");
const selectedDepartment = ref("all");
const selectedSemester = ref("all");
const selectedSchoolYear = ref("all");

const page = ref(1);
const pageSize = ref(20);

const pageSizeOptions = [
  {
    label: "10 rows",
    value: 10,
  },
  {
    label: "20 rows",
    value: 20,
  },
  {
    label: "50 rows",
    value: 50,
  },
  {
    label: "100 rows",
    value: 100,
  },
];

const makeOptions = (values: any[], allLabel: string) => {
  const uniqueValues = Array.from(
    new Set(
      values.filter(
        (value) => value && value !== "N/A" && value !== "Not specified",
      ),
    ),
  ).sort((a, b) => String(a).localeCompare(String(b)));

  return [
    {
      label: allLabel,
      value: "all",
    },
    ...uniqueValues.map((value) => ({
      label: String(value),
      value,
    })),
  ];
};

const facultyOptions = computed(() => {
  const facultyMap = new Map<string, string>();

  evaluations.value.forEach((evaluation: any) => {
    const value = String(
      evaluation?.teacher?.documentId ||
        evaluation?.teacher?.id ||
        evaluation?.teacher?.name ||
        "",
    );

    const label = evaluation?.teacher?.name || "Unknown Faculty";

    if (value) {
      facultyMap.set(value, label);
    }
  });

  return [
    {
      label: "All Faculty",
      value: "all",
    },
    ...Array.from(facultyMap.entries())
      .map(([value, label]) => ({
        label,
        value,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];
});

const departmentOptions = computed(() =>
  makeOptions(
    evaluations.value.map((evaluation) => getEvaluationDepartment(evaluation)),
    "All Departments",
  ),
);

const semesterOptions = computed(() =>
  makeOptions(
    evaluations.value.map((evaluation) => getSemester(evaluation)),
    "All Semesters",
  ),
);

const schoolYearOptions = computed(() => {
  const options = makeOptions(
    evaluations.value.map((evaluation) => getSchoolYear(evaluation)),
    "All School Years",
  );

  return [
    options[0],
    ...options
      .slice(1)
      .sort((a, b) => String(b.value).localeCompare(String(a.value))),
  ];
});


type NormalizedResponse = {
  criteriaId: string;
  statement: string;
  score: number;
};

const normalizeResponses = (responses: any): NormalizedResponse[] => {
  if (!responses) {
    return [];
  }

  let parsedResponses = responses;

  if (typeof parsedResponses === "string") {
    try {
      parsedResponses = JSON.parse(parsedResponses);
    } catch {
      return [];
    }
  }

  if (Array.isArray(parsedResponses)) {
    return parsedResponses
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
      .filter(
        (item) =>
          item.criteriaId &&
          Number.isFinite(item.score) &&
          item.score >= 1 &&
          item.score <= 5,
      );
  }

  if (
    typeof parsedResponses === "object" &&
    parsedResponses !== null
  ) {
    return Object.entries(parsedResponses)
      .map(([criteriaId, value]: [string, any]) => {
        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value)
        ) {
          const rawCriteriaId =
            value?.criteria_id ??
            value?.criteriaId ??
            value?.criterion_id ??
            value?.criterionId ??
            value?.evaluation_criteria_id ??
            value?.evaluationCriteriaId ??
            value?.criterion?.documentId ??
            value?.criterion?.id ??
            value?.evaluation_criterion?.documentId ??
            value?.evaluation_criterion?.id ??
            value?.documentId ??
            value?.id ??
            criteriaId;

          const rawStatement =
            value?.statement ??
            value?.question ??
            value?.criteria ??
            value?.criterion?.statement ??
            value?.evaluation_criterion?.statement ??
            `Criterion #${rawCriteriaId}`;

          const rawScore =
            value?.score ??
            value?.value ??
            value?.rating ??
            value?.response ??
            value?.answer ??
            0;

          return {
            criteriaId: String(rawCriteriaId),
            statement: String(rawStatement),
            score: Number(rawScore),
          };
        }

        return {
          criteriaId: String(criteriaId),
          statement: `Criterion #${criteriaId}`,
          score: Number(value),
        };
      })
      .filter(
        (item) =>
          item.criteriaId &&
          Number.isFinite(item.score) &&
          item.score >= 1 &&
          item.score <= 5,
      );
  }

  return [];
};

const filteredEvaluationRecords = computed(() => {
  return evaluations.value.filter((evaluation: any) => {
    const teacherKey = String(
      evaluation?.teacher?.documentId ||
        evaluation?.teacher?.id ||
        evaluation?.teacher?.name ||
        "",
    );

    const department = getEvaluationDepartment(evaluation);
    const semester = getSemester(evaluation);
    const schoolYear = getSchoolYear(evaluation);

    const matchesFaculty =
      selectedFaculty.value === "all" ||
      teacherKey === String(selectedFaculty.value);

    const matchesDepartment =
      selectedDepartment.value === "all" ||
      department === selectedDepartment.value;

    const matchesSemester =
      selectedSemester.value === "all" ||
      semester === selectedSemester.value;

    const matchesSchoolYear =
      selectedSchoolYear.value === "all" ||
      schoolYear === selectedSchoolYear.value;

    return (
      matchesFaculty &&
      matchesDepartment &&
      matchesSemester &&
      matchesSchoolYear
    );
  });
});

const groupedResults = computed(() => {
  const groups = new Map<string, any>();

  filteredEvaluationRecords.value.forEach((evaluation: any) => {
    const teacherKey = String(
      evaluation?.teacher?.documentId ||
        evaluation?.teacher?.id ||
        evaluation?.teacher?.name ||
        "unknown-faculty",
    );

    if (!groups.has(teacherKey)) {
      groups.set(teacherKey, {
        key: teacherKey,
        teacherId:
          evaluation?.teacher?.documentId || evaluation?.teacher?.id || "",
        name: evaluation?.teacher?.name || "Unknown Faculty",
        department: getEvaluationDepartment(evaluation),
        records: [],
        evaluatorKeys: new Set<string>(),
        semesterValues: new Set<string>(),
        schoolYearValues: new Set<string>(),
        criteriaMap: new Map<string, any>(),
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
        totalRatingScore: 0,
        totalRatingResponses: 0,
      });
    }

    const group = groups.get(teacherKey);
    group.records.push(evaluation);

    const evaluatorKey = String(
      evaluation?.evaluator_user?.documentId ||
        evaluation?.evaluator_user?.id ||
        "",
    );

    if (evaluatorKey) {
      group.evaluatorKeys.add(evaluatorKey);
    }

    const semester = getSemester(evaluation);
    const schoolYear = getSchoolYear(evaluation);

    if (semester !== "N/A") {
      group.semesterValues.add(semester);
    }

    if (schoolYear !== "N/A") {
      group.schoolYearValues.add(schoolYear);
    }

    normalizeResponses(evaluation.responses).forEach((response) => {
      if (!group.criteriaMap.has(response.criteriaId)) {
        group.criteriaMap.set(response.criteriaId, {
          criteriaId: response.criteriaId,
          statement: response.statement,
          totalScore: 0,
          responseCount: 0,
          distribution: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
          },
        });
      }

      const criterion = group.criteriaMap.get(response.criteriaId);

      if (
        criterion.statement.startsWith("Criterion #") &&
        !response.statement.startsWith("Criterion #")
      ) {
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
          const sentiment = String(
            record?.feedback_sentiment || "Neutral",
          ).toLowerCase();

          if (sentiment === "positive") {
            result.positive += 1;
          } else if (sentiment === "negative") {
            result.negative += 1;
          } else {
            result.neutral += 1;
          }

          return result;
        },
        {
          positive: 0,
          negative: 0,
          neutral: 0,
        },
      );

      const sortedRecords = [...group.records].sort(
        (a: any, b: any) =>
          new Date(getEvaluationDate(b) || 0).getTime() -
          new Date(getEvaluationDate(a) || 0).getTime(),
      );

      const criteriaSummary = Array.from(group.criteriaMap.values())
        .map((criterion: any) => {
          const averageScore = criterion.responseCount
            ? criterion.totalScore / criterion.responseCount
            : 0;

          return {
            ...criterion,
            averageScore,
            ratingLabel: getRatingLabel(averageScore),
          };
        })
        .sort((a: any, b: any) => {
          const first = Number(a.criteriaId);
          const second = Number(b.criteriaId);

          if (Number.isFinite(first) && Number.isFinite(second)) {
            return first - second;
          }

          return String(a.criteriaId).localeCompare(String(b.criteriaId));
        });

      const overallAverage = group.totalRatingResponses
        ? group.totalRatingScore / group.totalRatingResponses
        : 0;

      const expectedResponses =
        group.evaluatorKeys.size * criteriaSummary.length;

      const completionRate = expectedResponses
        ? Math.min(
            100,
            Math.round(
              (group.totalRatingResponses / expectedResponses) * 100,
            ),
          )
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
        totalRatingScore: group.totalRatingScore,
        totalRatingResponses: group.totalRatingResponses,
        averageScore: overallAverage,
        ratingDistribution: group.ratingDistribution,
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
    ]
      .join(" ")
      .toLowerCase();

    return !query || searchable.includes(query);
  });
});

const hasActiveFilters = computed(() =>
  Boolean(
    searchQuery.value ||
    selectedFaculty.value !== "all" ||
    selectedDepartment.value !== "all" ||
    selectedSemester.value !== "all" ||
    selectedSchoolYear.value !== "all",
  ),
);

const getSelectedLabel = (options: any[], value: any) => {
  return (
    options.find((option) => option.value === value)?.label ||
    String(value || "")
  );
};

const summary = computed(() => {
  const evaluatorKeys = new Set<string>();

  filteredEvaluationRecords.value.forEach((evaluation: any) => {
    const evaluatorKey = String(
      evaluation?.evaluator_user?.documentId ||
        evaluation?.evaluator_user?.id ||
        "",
    );

    if (evaluatorKey) {
      evaluatorKeys.add(evaluatorKey);
    }
  });

  const totalScore = groupedResults.value.reduce(
    (sum, group) => sum + Number(group.totalRatingScore || 0),
    0,
  );

  const totalResponses = groupedResults.value.reduce(
    (sum, group) => sum + Number(group.totalRatingResponses || 0),
    0,
  );

  return {
    totalFaculty: groupedResults.value.length,
    totalEvaluations: filteredEvaluationRecords.value.length,
    totalEvaluators: evaluatorKeys.size,
    averageScore: totalResponses
      ? (totalScore / totalResponses).toFixed(2)
      : "0.00",
  };
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredGroups.value.length / Number(pageSize.value))),
);

const paginatedGroups = computed(() => {
  const size = Number(pageSize.value);
  const start = (page.value - 1) * size;

  return filteredGroups.value.slice(start, start + size);
});

const paginationStart = computed(() => {
  if (!filteredGroups.value.length) {
    return 0;
  }

  return (page.value - 1) * Number(pageSize.value) + 1;
});

const paginationEnd = computed(() =>
  Math.min(page.value * Number(pageSize.value), filteredGroups.value.length),
);

const getEvaluationDepartment = (evaluation: any) => {
  return (
    evaluation?.teacher?.department?.name ||
    evaluation?.teacher?.department ||
    "Not specified"
  );
};

const getRecordLabel = (evaluation: any) => {
  const evaluatorName =
    evaluation?.evaluator_user?.username ||
    evaluation?.evaluator_user?.email ||
    "";

  return evaluatorName
    ? `Student Evaluation · ${evaluatorName}`
    : "Student Evaluation";
};

const getSemester = (evaluation: any) => {
  return evaluation?.batch?.semester || "N/A";
};

const getSchoolYear = (evaluation: any) => {
  return evaluation?.batch?.school_year || "N/A";
};

const getEvaluationDate = (evaluation: any) => {
  return (
    evaluation?.batch?.date || evaluation?.date || evaluation?.createdAt || null
  );
};

const getEvaluationKey = (evaluation: any) => {
  if (!evaluation) {
    return "";
  }

  return (
    evaluation?.documentId ||
    evaluation?.id ||
    `${evaluation?.teacher?.id || ""}-${evaluation?.evaluator_user?.id || ""}-${evaluation?.createdAt || ""}`
  );
};

const createInitials = (value: string) => {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const formatNumber = (value: any) => {
  const number = Number(value);

  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
};

const formatDate = (value: any) => {
  if (!value) {
    return "N/A";
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

const getResults = async () => {
  pending.value = true;
  loadError.value = "";

  try {
    const query: any = {
      "filters[batch][evaluation_type][code][$eq]": "student-faculty",

      "populate[teacher][populate][department]": true,

      "populate[evaluator_user]": true,

      "populate[batch][populate][0]": "evaluation_type",

      "sort[0]": "createdAt:desc",

      /*
       * All Student – Faculty records are loaded once.
       * The visible filters are then applied locally,
       * matching the filter behaviour of the previous
       * Evaluation Results page.
       */
      "pagination[pageSize]": 10000,
    };

    const res: any = await $api("/evaluations", {
      query,
    });

    evaluations.value = res.data || [];

    /*
     * Optional diagnostics:
     *
     * console.log("First evaluation responses:", evaluations.value[0]?.responses);
     * console.log(
     *   "Normalized responses:",
     *   normalizeResponses(evaluations.value[0]?.responses),
     * );
     */

    page.value = 1;
  } catch (error: any) {
    console.error("Student-Faculty result loading error:", error);

    evaluations.value = [];

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Failed to load Student – Faculty evaluation results.";

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

const clearFilters = () => {
  searchQuery.value = "";
  selectedFaculty.value = "all";
  selectedDepartment.value = "all";
  selectedSemester.value = "all";
  selectedSchoolYear.value = "all";
  page.value = 1;
};

const prevPage = async () => {
  if (page.value <= 1) {
    return;
  }

  page.value -= 1;
  await scrollToTable();
};

const nextPage = async () => {
  if (page.value >= totalPages.value) {
    return;
  }

  page.value += 1;
  await scrollToTable();
};

const scrollToTable = async () => {
  await nextTick();

  if (!import.meta.client) {
    return;
  }

  window.scrollTo({
    top: 500,
    behavior: "smooth",
  });
};

const openGroup = (group: any) => {
  selectedGroup.value = group;
  selectedEvaluation.value = group.records?.[0] || null;

  showGroupDetails.value = true;
};

const selectEvaluation = (evaluation: any) => {
  selectedEvaluation.value = evaluation;
};

const formatResponses = (responses: any) => {
  return normalizeResponses(responses).map((item) => ({
    criteria_id: item.criteriaId,
    statement: item.statement,
    score: item.score,
  }));
};

const getRatingLabel = (average: number) => {
  const avg = Number(average);

  if (avg >= 4.5) {
    return "Outstanding";
  }

  if (avg >= 3.5) {
    return "Excellent";
  }

  if (avg >= 2.5) {
    return "Satisfactory";
  }

  if (avg >= 1.5) {
    return "Fair";
  }

  if (avg > 0) {
    return "Needs Improvement";
  }

  return "N/A";
};

const ratingBadge = (average: number) => {
  const avg = Number(average);

  if (avg >= 4.5) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
  }

  if (avg >= 3.5) {
    return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
  }

  if (avg >= 2.5) {
    return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
  }

  if (avg >= 1.5) {
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
  }

  if (avg > 0) {
    return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
  }

  return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
};

const ratingColor = (average: number) => {
  const avg = Number(average);

  if (avg >= 4.5) {
    return "success";
  }

  if (avg >= 3.5) {
    return "primary";
  }

  if (avg >= 2.5) {
    return "info";
  }

  if (avg >= 1.5) {
    return "warning";
  }

  return "error";
};

const sentimentBadge = (sentiment: string) => {
  const value = String(sentiment || "Neutral").toLowerCase();

  if (value === "positive") {
    return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
  }

  if (value === "negative") {
    return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
  }

  return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
};

const formatKeywords = (keywords: any) => {
  if (!keywords) {
    return "N/A";
  }

  if (Array.isArray(keywords)) {
    return keywords.length ? keywords.join(", ") : "N/A";
  }

  if (typeof keywords === "string") {
    return keywords.trim() || "N/A";
  }

  return "N/A";
};

watch(
  [
    searchQuery,
    selectedFaculty,
    selectedDepartment,
    selectedSemester,
    selectedSchoolYear,
    pageSize,
  ],
  () => {
    page.value = 1;
  },
);

watch(
  () => totalPages.value,
  (value) => {
    if (page.value > value) {
      page.value = value;
    }
  },
);

onMounted(() => {
  getResults();
});
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
