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
            <UIcon name="i-lucide-file-clock" class="size-7" />
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
                Evaluation Records
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              My Faculty Evaluations
            </h1>

            <p
              class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90"
            >
              Review faculty evaluations you submitted for the selected
              academic period.
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
              Avg. Rating
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

            <UBadge color="success" variant="subtle" size="sm">
              Dean
            </UBadge>
          </div>

          <div
            class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400"
          >
            <span class="flex items-center gap-1.5">
              <UIcon name="i-lucide-building-2" class="size-3.5" />
              {{ deanDepartment }}
            </span>

            <span
              v-if="deanEmail"
              class="flex items-center gap-1.5"
            >
              <UIcon name="i-lucide-mail" class="size-3.5" />
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
      <USkeleton class="h-24 w-full rounded-2xl" />
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
      <!-- =====================================================
        SUMMARY
      ====================================================== -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/20"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                Submitted Records
              </p>
              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ totalRecordCount }}
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
                Evaluated Faculty
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
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                Selected Period
              </p>
              <p
                class="mt-2 truncate text-sm font-bold text-gray-900 dark:text-white"
              >
                {{ selectedSemester || '—' }}
              </p>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {{ selectedSchoolYear || '—' }}
              </p>
            </div>

            <div
              class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
            >
              <UIcon name="i-lucide-calendar-range" class="size-5" />
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
                <span class="text-sm font-medium text-gray-400">
                  / {{ maximumRating }}
                </span>
              </p>

              <UBadge
                :color="getScoreColor(Number(overallAverage))"
                variant="subtle"
                size="sm"
                class="mt-1.5"
              >
                {{ getScoreLabel(Number(overallAverage)) }}
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

      <!-- =====================================================
        FILTERS / PERIOD SELECTOR
      ====================================================== -->
      <section
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
        >
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-sm font-bold text-gray-900 dark:text-white">
                Evaluation Records
              </h2>

              <UBadge
                v-if="selectedPeriodIsActive"
                color="success"
                variant="subtle"
                size="sm"
              >
                Active Period
              </UBadge>
            </div>

            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Select a semester and school year to review current or previous
              evaluation records.
            </p>
          </div>

          <div
            class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:w-auto xl:grid-cols-[230px_180px_180px_120px]"
          >
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Search faculty..."
              class="w-full"
            />

            <USelectMenu
              v-model="selectedSemester"
              :items="semesterOptions"
              value-key="value"
              placeholder="Select semester"
              class="w-full"
              :disabled="periodLoading || !selectedSchoolYear"
            />

            <USelectMenu
              v-model="selectedSchoolYear"
              :items="schoolYearOptions"
              value-key="value"
              placeholder="Select school year"
              class="w-full"
              :disabled="periodLoading"
              @update:model-value="onSchoolYearChanged"
            />

            <USelectMenu
              v-model="itemsPerPage"
              :items="rowOptions"
              value-key="value"
              class="w-full"
            />
          </div>
        </div>

        <div
          v-if="recordsLoading"
          class="mt-4 flex items-center gap-2 border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="size-4 animate-spin text-emerald-500"
          />
          Loading evaluation records for the selected period...
        </div>
      </section>

      <!-- =====================================================
        EMPTY STATE
      ====================================================== -->
      <section
        v-if="!recordsLoading && !filteredRecords.length"
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
              : 'No evaluations for this period'
          }}
        </h2>

        <p
          class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400"
        >
          {{
            records.length
              ? 'Try changing or clearing your faculty search.'
              : `No Dean-Faculty evaluations were found for ${selectedSemester || 'the selected semester'} · ${selectedSchoolYear || 'the selected school year'}.`
          }}
        </p>

        <UButton
          v-if="searchQuery"
          class="mt-5"
          color="neutral"
          variant="outline"
          icon="i-lucide-rotate-ccw"
          @click="clearSearch"
        >
          Clear Search
        </UButton>
      </section>

      <!-- =====================================================
        EVALUATION RECORDS TABLE
      ====================================================== -->
      <section
        v-else-if="!recordsLoading"
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
        >
          <div>
            <h2 class="text-sm font-bold text-gray-900 dark:text-white">
              Submitted Evaluations
            </h2>

            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Showing {{ filteredRecords.length }}
              {{ filteredRecords.length === 1 ? 'evaluation' : 'evaluations' }}
              for {{ selectedSemester }} · {{ selectedSchoolYear }}.
            </p>
          </div>

          <UBadge
            :color="selectedPeriodIsActive ? 'success' : 'neutral'"
            variant="subtle"
            size="sm"
          >
            {{ selectedSemester }} · {{ selectedSchoolYear }}
          </UBadge>
        </div>

        <!-- Desktop Table -->
        <div class="hidden overflow-x-auto md:block">
          <table class="w-full min-w-[950px]">
            <thead
              class="border-b border-gray-200 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-950/40"
            >
              <tr>
                <th
                  class="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  Faculty
                </th>

                <th
                  class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  Department
                </th>

                <th
                  class="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  Responses
                </th>

                <th
                  class="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  Average
                </th>

                <th
                  class="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  Rating
                </th>

                <th
                  class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  Date
                </th>

                <th
                  class="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr
                v-for="record in paginatedRecords"
                :key="record.documentId || record.id"
                class="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/30"
              >
                <!-- Faculty -->
                <td class="px-5 py-4">
                  <div class="flex min-w-0 items-center gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-violet-900 text-xs font-bold text-white shadow-sm"
                    >
                      {{ getFacultyInitials(record) }}
                    </div>

                    <div class="min-w-0">
                      <p
                        class="truncate text-sm font-bold text-gray-900 dark:text-white"
                      >
                        {{ getFacultyName(record) }}
                      </p>

                      <p class="mt-0.5 text-[10px] text-gray-400">
                        Ref: {{ getRecordReference(record) }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Department -->
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-lucide-building-2"
                      class="size-3.5 shrink-0 text-gray-400"
                    />

                    <span
                      class="text-xs font-medium text-gray-600 dark:text-gray-300"
                    >
                      {{ getDepartment(record) }}
                    </span>
                  </div>
                </td>

                <!-- Responses -->
                <td class="px-4 py-4 text-center">
                  <span class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ getResponses(record).length }}
                  </span>
                </td>

                <!-- Average -->
                <td class="px-4 py-4 text-center">
                  <div class="inline-flex items-baseline gap-1">
                    <span
                      class="text-sm font-bold text-gray-900 dark:text-white"
                    >
                      {{ formatScore(getAverageScore(record)) }}
                    </span>

                    <span class="text-[10px] text-gray-400">
                      / {{ maximumRating }}
                    </span>
                  </div>
                </td>

                <!-- Rating -->
                <td class="px-4 py-4 text-center">
                  <UBadge
                    :color="getScoreColor(getAverageScore(record))"
                    variant="subtle"
                    size="sm"
                  >
                    {{ getScoreLabel(getAverageScore(record)) }}
                  </UBadge>
                </td>

                <!-- Date -->
                <td class="px-4 py-4">
                  <div>
                    <p
                      class="text-xs font-medium text-gray-700 dark:text-gray-300"
                    >
                      {{ formatDate(getEvaluationDate(record)) }}
                    </p>

                    <p class="mt-0.5 text-[10px] text-gray-400">
                      Submitted
                    </p>
                  </div>
                </td>

                <!-- Action -->
                <td class="px-5 py-4 text-right">
                  <UButton
                    color="neutral"
                    variant="soft"
                    size="xs"
                    icon="i-lucide-eye"
                    @click="openRecordDetails(record)"
                  >
                    View Details
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile -->
        <div
          class="divide-y divide-gray-200 md:hidden dark:divide-gray-800"
        >
          <div
            v-for="record in paginatedRecords"
            :key="record.documentId || record.id"
            class="space-y-4 p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-violet-900 text-xs font-bold text-white"
                >
                  {{ getFacultyInitials(record) }}
                </div>

                <div class="min-w-0">
                  <p
                    class="truncate text-sm font-bold text-gray-900 dark:text-white"
                  >
                    {{ getFacultyName(record) }}
                  </p>

                  <p
                    class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400"
                  >
                    {{ getDepartment(record) }}
                  </p>
                </div>
              </div>

              <UBadge
                :color="getScoreColor(getAverageScore(record))"
                variant="subtle"
                size="sm"
              >
                {{ getScoreLabel(getAverageScore(record)) }}
              </UBadge>
            </div>

            <div
              class="grid grid-cols-3 divide-x divide-gray-200 rounded-xl border border-gray-200 bg-gray-50 dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-950/40"
            >
              <div class="p-3 text-center">
                <p
                  class="text-[9px] font-semibold uppercase text-gray-400"
                >
                  Average
                </p>
                <p
                  class="mt-1 text-sm font-bold text-gray-900 dark:text-white"
                >
                  {{ formatScore(getAverageScore(record)) }}/{{ maximumRating }}
                </p>
              </div>

              <div class="p-3 text-center">
                <p
                  class="text-[9px] font-semibold uppercase text-gray-400"
                >
                  Responses
                </p>
                <p
                  class="mt-1 text-sm font-bold text-gray-900 dark:text-white"
                >
                  {{ getResponses(record).length }}
                </p>
              </div>

              <div class="p-3 text-center">
                <p
                  class="text-[9px] font-semibold uppercase text-gray-400"
                >
                  Date
                </p>
                <p
                  class="mt-1 text-xs font-bold text-gray-900 dark:text-white"
                >
                  {{ formatDate(getEvaluationDate(record)) }}
                </p>
              </div>
            </div>

            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              icon="i-lucide-eye"
              block
              @click="openRecordDetails(record)"
            >
              View Details
            </UButton>
          </div>
        </div>
      </section>

      <!-- =====================================================
        PAGINATION
      ====================================================== -->
      <section
        v-if="filteredRecords.length > itemsPerPage"
        class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900"
      >
        <p
          class="text-center text-xs text-gray-500 sm:text-left dark:text-gray-400"
        >
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
            class="relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 px-6 py-6 text-white"
          >
            <div
              class="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-violet-500/20 blur-3xl"
            />

            <div class="relative flex items-start justify-between gap-4">
              <div class="flex min-w-0 items-center gap-4">
                <div
                  class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 font-bold text-violet-300"
                >
                  {{ getFacultyInitials(selectedRecord) }}
                </div>

                <div class="min-w-0">
                  <p
                    class="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300"
                  >
                    Submitted Evaluation
                  </p>

                  <h2 class="mt-1 truncate text-xl font-bold">
                    {{ getFacultyName(selectedRecord) }}
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
                <p
                  class="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-400"
                >
                  {{ formatScore(getAverageScore(selectedRecord)) }}/{{
                    maximumRating
                  }}
                </p>
              </div>
            </div>

            <div
              v-if="getStrengths(selectedRecord)"
              class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20"
            >
              <h3
                class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                <UIcon
                  name="i-lucide-thumbs-up"
                  class="size-4 text-emerald-500"
                />
                Greatest Strengths
              </h3>

              <p
                class="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                {{ getStrengths(selectedRecord) }}
              </p>
            </div>

            <div
              v-if="getEffectiveness(selectedRecord)"
              class="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/20"
            >
              <h3
                class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                <UIcon
                  name="i-lucide-zap"
                  class="size-4 text-blue-500"
                />
                Ways to Be More Effective
              </h3>

              <p
                class="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                {{ getEffectiveness(selectedRecord) }}
              </p>
            </div>

            <div
              v-if="getAreasForImprovement(selectedRecord)"
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
                {{ getAreasForImprovement(selectedRecord) }}
              </p>
            </div>

            <div
              v-if="getSuggestedActivities(selectedRecord)"
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
                {{ getSuggestedActivities(selectedRecord) }}
              </p>
            </div>

            <div
              v-if="getComment(selectedRecord)"
              class="rounded-2xl border border-violet-100 bg-violet-50/60 p-4 dark:border-violet-900 dark:bg-violet-950/20"
            >
              <h3
                class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                <UIcon
                  name="i-lucide-message-square-text"
                  class="size-4 text-violet-500"
                />
                Overall Rating and Comment
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
  middleware: ['auth', 'role'],
  role: ['Dean', 'Admin']
})

const { $api } = useNuxtApp()
const { user } = useAuth()
const toast = useToast()

const maximumRating = 4

const records = ref<any[]>([])
const deanProfile = ref<any>(null)
const schoolYears = ref<any[]>([])
const activeSchoolYear = ref<any>(null)

const pending = ref(true)
const periodLoading = ref(false)
const recordsLoading = ref(false)
const loadError = ref('')

const searchQuery = ref('')
const selectedSemester = ref('')
const selectedSchoolYear = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(20)

const detailsOpen = ref(false)
const selectedRecord = ref<any>(null)

let periodWatchReady = false

const rowOptions = [
  { label: '10 rows', value: 10 },
  { label: '20 rows', value: 20 },
  { label: '50 rows', value: 50 },
  { label: '100 rows', value: 100 }
]

const semesterOrder: Record<string, number> = {
  '1st Semester': 1,
  '2nd Semester': 2,
  Summer: 3
}

/* =========================================================
   DEAN INFORMATION
========================================================= */

const deanName = computed(() => {
  return (
    deanProfile.value?.name ||
    deanProfile.value?.full_name ||
    user.value?.name ||
    user.value?.username ||
    'Dean'
  )
})

const deanDepartment = computed(() => {
  return deanProfile.value?.department?.name || 'No department assigned'
})

const deanEmail = computed(() => {
  return (
    deanProfile.value?.email ||
    deanProfile.value?.user?.email ||
    user.value?.email ||
    ''
  )
})

const deanInitials = computed(() => {
  return createInitials(deanName.value)
})

const activeSemester = computed(() => {
  return activeSchoolYear.value?.semester || ''
})

const activeSchoolYearLabel = computed(() => {
  return activeSchoolYear.value?.school_year || ''
})

const selectedPeriodIsActive = computed(() => {
  return (
    Boolean(activeSchoolYear.value) &&
    selectedSemester.value === activeSemester.value &&
    selectedSchoolYear.value === activeSchoolYearLabel.value
  )
})

/* =========================================================
   PERIOD OPTIONS
========================================================= */

const schoolYearOptions = computed(() => {
  const values = Array.from(
    new Set(
      schoolYears.value
        .map((item: any) => String(item?.school_year || '').trim())
        .filter(Boolean)
    )
  ).sort((a, b) => b.localeCompare(a))

  return values.map((value) => ({
    label:
      value === activeSchoolYearLabel.value
        ? `${value} (Active)`
        : value,
    value
  }))
})

const semesterOptions = computed(() => {
  if (!selectedSchoolYear.value) return []

  const values = Array.from(
    new Set(
      schoolYears.value
        .filter(
          (item: any) =>
            String(item?.school_year || '') ===
            String(selectedSchoolYear.value)
        )
        .map((item: any) => String(item?.semester || '').trim())
        .filter(Boolean)
    )
  ).sort(
    (a, b) =>
      (semesterOrder[a] ?? 99) -
      (semesterOrder[b] ?? 99)
  )

  return values.map((value) => ({
    label:
      value === activeSemester.value &&
      selectedSchoolYear.value === activeSchoolYearLabel.value
        ? `${value} (Active)`
        : value,
    value
  }))
})

/* =========================================================
   SUMMARY
========================================================= */

const totalRecordCount = computed(() => {
  return records.value.length
})

const evaluatedFacultyCount = computed(() => {
  const values = new Set(
    records.value
      .map(
        (record: any) =>
          record?.teacher?.documentId ||
          record?.teacher?.id ||
          record?.teacher?.name
      )
      .filter(Boolean)
  )

  return values.size
})

const overallAverage = computed(() => {
  const scores = records.value
    .map((record: any) => getAverageScore(record))
    .filter((score: number) => score > 0)

  if (!scores.length) return '0.00'

  return (
    scores.reduce((sum: number, score: number) => sum + score, 0) /
    scores.length
  ).toFixed(2)
})

/* =========================================================
   FILTERING / PAGINATION
========================================================= */

const filteredRecords = computed(() => {
  const query = String(searchQuery.value || '')
    .trim()
    .toLowerCase()

  if (!query) return records.value

  return records.value.filter((record: any) => {
    const facultyName = getFacultyName(record).toLowerCase()
    const department = getDepartment(record).toLowerCase()

    return (
      facultyName.includes(query) ||
      department.includes(query)
    )
  })
})

const totalPages = computed(() => {
  return Math.max(
    1,
    Math.ceil(
      filteredRecords.value.length /
        Number(itemsPerPage.value || 20)
    )
  )
})

const paginatedRecords = computed(() => {
  const perPage = Number(itemsPerPage.value || 20)
  const start = (currentPage.value - 1) * perPage

  return filteredRecords.value.slice(
    start,
    start + perPage
  )
})

const paginationStart = computed(() => {
  if (!filteredRecords.value.length) return 0

  return (
    (currentPage.value - 1) *
      Number(itemsPerPage.value || 20) +
    1
  )
})

const paginationEnd = computed(() => {
  return Math.min(
    currentPage.value *
      Number(itemsPerPage.value || 20),
    filteredRecords.value.length
  )
})

/* =========================================================
   DISPLAY HELPERS
========================================================= */

const createInitials = (value: string) => {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

const getFacultyName = (record: any) => {
  return (
    record?.teacher?.name ||
    record?.teacher?.full_name ||
    'Faculty Member'
  )
}

const getFacultyInitials = (record: any) => {
  return createInitials(getFacultyName(record))
}

const getDepartment = (record: any) => {
  return (
    record?.teacher?.department?.name ||
    record?.batch?.department ||
    deanDepartment.value
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

const getEffectiveness = (record: any) => {
  return record?.effectiveness || ''
}

const getAreasForImprovement = (record: any) => {
  return (
    record?.areas_for_improvement ||
    record?.areasForImprovement ||
    ''
  )
}

const getSuggestedActivities = (record: any) => {
  return (
    record?.suggested_activities ||
    record?.suggestedActivities ||
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
    .map((response: any) => Number(response.score))
    .filter((score: number) => Number.isFinite(score))

  if (!scores.length) return 0

  return (
    scores.reduce(
      (sum: number, score: number) => sum + score,
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
  if (score >= 3.5) return 'Excellent'
  if (score >= 2.5) return 'Satisfactory'
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

/* =========================================================
   UI ACTIONS
========================================================= */

const clearSearch = () => {
  searchQuery.value = ''
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

const onSchoolYearChanged = async () => {
  const options = semesterOptions.value

  const selectedStillExists = options.some(
    (option: any) =>
      option.value === selectedSemester.value
  )

  if (!selectedStillExists) {
    selectedSemester.value =
      options[0]?.value || ''
  }
}

/* =========================================================
   LOAD SCHOOL YEARS
========================================================= */

const getSchoolYears = async () => {
  periodLoading.value = true

  try {
    const response = await $api('/school-years', {
      query: {
        'sort[0]': 'school_year:desc',
        'sort[1]': 'semester:asc',
        'pagination[pageSize]': 100
      }
    })

    schoolYears.value =
      Array.isArray(response?.data)
        ? response.data
        : []

    activeSchoolYear.value =
      schoolYears.value.find(
        (item: any) =>
          item?.active_sy === true ||
          item?.sy_status === 'Active'
      ) || null

    if (!activeSchoolYear.value) {
      const activeResponse = await $api('/school-years', {
        query: {
          'filters[active_sy][$eq]': true,
          'pagination[pageSize]': 1
        }
      })

      activeSchoolYear.value =
        activeResponse?.data?.[0] || null

      if (
        activeSchoolYear.value &&
        !schoolYears.value.some(
          (item: any) =>
            item?.id === activeSchoolYear.value?.id
        )
      ) {
        schoolYears.value.unshift(
          activeSchoolYear.value
        )
      }
    }

    if (activeSchoolYear.value) {
      selectedSchoolYear.value =
        activeSchoolYear.value.school_year || ''

      selectedSemester.value =
        activeSchoolYear.value.semester || ''
    } else if (schoolYears.value.length) {
      selectedSchoolYear.value =
        schoolYears.value[0]?.school_year || ''

      await nextTick()

      selectedSemester.value =
        semesterOptions.value[0]?.value ||
        schoolYears.value[0]?.semester ||
        ''
    } else {
      selectedSchoolYear.value = ''
      selectedSemester.value = ''
    }
  } finally {
    periodLoading.value = false
  }
}

/* =========================================================
   LOAD DEAN PROFILE
========================================================= */

const getDeanProfile = async () => {
  if (!user.value?.id) {
    deanProfile.value = null
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

  deanProfile.value =
    response?.data?.[0] || null
}

/* =========================================================
   LOAD MY DEAN-FACULTY EVALUATIONS
========================================================= */

const getMyFacultyEvaluations = async () => {
  if (
    !user.value?.id ||
    !selectedSemester.value ||
    !selectedSchoolYear.value
  ) {
    records.value = []
    return
  }

  try {
    recordsLoading.value = true

    const response = await $api('/evaluations', {
      query: {
        'filters[evaluator_user][id][$eq]':
          user.value.id,

        // Current Dean → Faculty evaluation type
        'filters[$or][0][batch][evaluation_type][code][$eq]':
          'dean-faculty',

        // Legacy Dean → Faculty evaluation type
        'filters[$or][1][batch][evaluation_type][code][$eq]':
          'dean-to-faculty',

        // Selected academic period
        'filters[batch][semester][$eq]':
          selectedSemester.value,

        'filters[batch][school_year][$eq]':
          selectedSchoolYear.value,

        'populate[teacher][populate][department]':
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
      Array.isArray(response?.data)
        ? response.data
        : []

    currentPage.value = 1
  } catch (error: any) {
    console.error(
      'Dean evaluation records loading error:',
      error
    )

    records.value = []

    toast.add({
      title: 'Unable to load evaluation records',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        'Failed to load records for the selected academic period.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    recordsLoading.value = false
  }
}

/* =========================================================
   INITIAL LOAD
========================================================= */

const loadData = async () => {
  try {
    pending.value = true
    loadError.value = ''
    periodWatchReady = false

    await Promise.all([
      getSchoolYears(),
      getDeanProfile()
    ])

    if (!deanProfile.value) {
      throw new Error(
        'The logged-in Dean profile could not be found.'
      )
    }

    if (
      !selectedSchoolYear.value ||
      !selectedSemester.value
    ) {
      throw new Error(
        'No school year and semester are configured.'
      )
    }

    await getMyFacultyEvaluations()

    periodWatchReady = true
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
      'Failed to load faculty evaluation records.'

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

/* =========================================================
   WATCHERS
========================================================= */

watch(
  [selectedSemester, selectedSchoolYear],
  async ([semester, schoolYear], [oldSemester, oldSchoolYear]) => {
    if (!periodWatchReady) return
    if (!semester || !schoolYear) return

    if (
      semester === oldSemester &&
      schoolYear === oldSchoolYear
    ) {
      return
    }

    searchQuery.value = ''
    currentPage.value = 1

    await getMyFacultyEvaluations()
  }
)

watch(
  [searchQuery, itemsPerPage],
  () => {
    currentPage.value = 1
  }
)

watch(
  () => totalPages.value,
  (value) => {
    if (currentPage.value > value) {
      currentPage.value = value
    }
  }
)

watch(
  user,
  async (value) => {
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
