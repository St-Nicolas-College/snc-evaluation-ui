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
              <span class="text-sm font-medium text-emerald-100">
                / {{ ratingMaxScore ?? "—" }}
              </span>
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
              <span class="text-sm font-medium text-gray-400">
                / {{ ratingMaxScore ?? "—" }}
              </span>
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

        <div class="mt-3 flex flex-wrap gap-2">
          <UBadge
            v-if="activeSemester !== 'all'"
            color="success"
            variant="subtle"
            icon="i-lucide-calendar-range"
          >
            Current Semester: {{ activeSemester }}
          </UBadge>

          <UBadge
            v-if="activeSchoolYear !== 'all'"
            color="warning"
            variant="subtle"
            icon="i-lucide-graduation-cap"
          >
            Current School Year: {{ activeSchoolYear }}
          </UBadge>

          <UBadge
            v-if="evaluationType"
            color="info"
            variant="subtle"
            icon="i-lucide-star"
          >
            {{ evaluationType.name }} · {{ ratingMinScore ?? "—" }}–{{
              ratingMaxScore ?? "—"
            }}
          </UBadge>
        </div>
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

                  <div class="text-[10px] text-gray-400">
                    out of {{ ratingMaxScore ?? "—" }}
                  </div>
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
                    @click="viewFacultySummary(group)"
                  >
                    View Summary
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
const evaluationType = ref<any>(null);

const activeSchoolYear = ref("all");
const activeSemester = ref("all");

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

/* =========================================================
   DYNAMIC RATING SCALE FROM EVALUATION TYPE
========================================================= */

const evaluationResponseType = computed(() => {
  return evaluationType.value?.response_type || "rating";
});

const normalizedScaleLabels = computed<Record<string, string>>(() => {
  const labels = evaluationType.value?.scale_labels;
  if (!labels || typeof labels !== "object" || Array.isArray(labels)) return {};
  return labels;
});

const ratingScale = computed(() => {
  const labels = normalizedScaleLabels.value;

  const configuredScores = Object.keys(labels)
    .map((score) => Number(score))
    .filter((score) => Number.isFinite(score))
    .sort((a, b) => a - b);

  if (configuredScores.length) {
    return configuredScores.map((score) => ({
      score,
      label: String(labels[String(score)] || `Rating ${score}`),
    }));
  }

  const minScore = Number(evaluationType.value?.min_score);
  const maxScore = Number(evaluationType.value?.max_score);

  if (
    Number.isFinite(minScore) &&
    Number.isFinite(maxScore) &&
    maxScore >= minScore
  ) {
    const rows = [];
    for (let score = minScore; score <= maxScore; score += 1) {
      rows.push({ score, label: `Rating ${score}` });
    }
    return rows;
  }

  return [];
});

const ratingScores = computed(() =>
  ratingScale.value.map((item) => Number(item.score)),
);

const ratingMinScore = computed(() =>
  ratingScores.value.length ? Math.min(...ratingScores.value) : null,
);

const ratingMaxScore = computed(() =>
  ratingScores.value.length ? Math.max(...ratingScores.value) : null,
);

const isConfiguredRatingScore = (value: any) => {
  const score = Number(value);
  return Number.isFinite(score) && ratingScores.value.includes(score);
};

const createEmptyRatingDistribution = () => {
  const distribution: Record<number, number> = {};
  ratingScores.value.forEach((score) => {
    distribution[score] = 0;
  });
  return distribution;
};

const getNearestRating = (average: number) => {
  const avg = Number(average);

  if (!Number.isFinite(avg) || avg <= 0 || !ratingScale.value.length) {
    return null;
  }

  return (
    [...ratingScale.value].sort((a, b) => {
      const da = Math.abs(Number(a.score) - avg);
      const db = Math.abs(Number(b.score) - avg);

      if (da === db) return Number(b.score) - Number(a.score);
      return da - db;
    })[0] || null
  );
};

const getRatingPosition = (average: number) => {
  const nearest = getNearestRating(average);
  if (!nearest) return 0;
  if (ratingScale.value.length <= 1) return 1;

  const index = ratingScale.value.findIndex(
    (item) => Number(item.score) === Number(nearest.score),
  );

  return index < 0 ? 0 : index / (ratingScale.value.length - 1);
};

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
      .filter((item) => item.criteriaId && isConfiguredRatingScore(item.score));
  }

  if (typeof parsedResponses === "object" && parsedResponses !== null) {
    return Object.entries(parsedResponses)
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
      .filter((item) => item.criteriaId && isConfiguredRatingScore(item.score));
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
      selectedSemester.value === "all" || semester === selectedSemester.value;

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
        teacherDocumentId: evaluation?.teacher?.documentId || "",
        teacherId:
          evaluation?.teacher?.documentId || evaluation?.teacher?.id || "",
        documentId:
          evaluation?.teacher?.documentId || evaluation?.teacher?.id || "",
        name: evaluation?.teacher?.name || "Unknown Faculty",
        department: getEvaluationDepartment(evaluation),
        records: [],
        evaluatorKeys: new Set<string>(),
        semesterValues: new Set<string>(),
        schoolYearValues: new Set<string>(),
        criteriaMap: new Map<string, any>(),
        ratingDistribution: createEmptyRatingDistribution(),
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
          distribution: createEmptyRatingDistribution(),
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

      if (criterion.distribution[response.score] === undefined) {
        criterion.distribution[response.score] = 0;
      }
      criterion.distribution[response.score] += 1;

      if (group.ratingDistribution[response.score] === undefined) {
        group.ratingDistribution[response.score] = 0;
      }
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
            Math.round((group.totalRatingResponses / expectedResponses) * 100),
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

const getEvaluationType = async () => {
  const response: any = await $api("/evaluation-types", {
    query: {
      "filters[code][$eq]": "student-faculty",
      "pagination[pageSize]": 1,
    },
  });

  evaluationType.value = response?.data?.[0] || null;

  if (!evaluationType.value) {
    throw new Error("Student-Faculty evaluation type is not configured.");
  }

  if (evaluationResponseType.value !== "rating") {
    throw new Error("Student-Faculty must use a Rating Scale response type.");
  }

  if (!ratingScale.value.length) {
    throw new Error(
      "The Student-Faculty evaluation type has no valid rating scale configured.",
    );
  }
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
  } catch (error) {
    console.error("Active academic period loading error:", error);

    activeSchoolYear.value = "all";
    activeSemester.value = "all";

    selectedSchoolYear.value = "all";
    selectedSemester.value = "all";

    toast.add({
      title: "Current academic period unavailable",
      description: "The active school year and semester could not be loaded.",
      icon: "i-lucide-info",
      color: "warning",
    });
  }
};

const initializePage = async () => {
  pending.value = true;
  loadError.value = "";

  try {
    await Promise.all([loadActiveAcademicPeriod(), getEvaluationType()]);

    await getResults();
  } catch (error: any) {
    console.error("Student-Faculty result initialization error:", error);

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Failed to initialize Student – Faculty evaluation results.";
  } finally {
    pending.value = false;
  }
};

const getResults = async () => {
  const shouldManagePending = !pending.value;

  if (shouldManagePending) {
    pending.value = true;
  }

  loadError.value = "";

  try {
    if (!evaluationType.value) {
      await getEvaluationType();
    }

    if (
      evaluationResponseType.value !== "rating" ||
      !ratingScale.value.length
    ) {
      throw new Error(
        "The Student-Faculty rating scale is not configured correctly.",
      );
    }

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
    if (shouldManagePending) {
      pending.value = false;
    }
  }
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedFaculty.value = "all";
  selectedDepartment.value = "all";

  selectedSemester.value = activeSemester.value || "all";

  selectedSchoolYear.value = activeSchoolYear.value || "all";

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

const viewFacultySummary = async (group: any) => {
  const documentId = String(
    group?.teacherDocumentId ||
      group?.teacherId ||
      group?.documentId ||
      group?.key ||
      "",
  ).trim();

  if (
    !documentId ||
    ["undefined", "null", "unknown-faculty"].includes(documentId.toLowerCase())
  ) {
    toast.add({
      title: "Unable to open summary",
      description:
        "The selected faculty record has no valid document identifier.",
      icon: "i-lucide-triangle-alert",
      color: "error",
    });

    return;
  }

  await navigateTo({
    path: `/admin/evaluation/student-faculty/${encodeURIComponent(documentId)}`,
    query: {
      semester: selectedSemester.value,
      schoolYear: selectedSchoolYear.value,
    },
  });
};

const formatResponses = (responses: any) => {
  return normalizeResponses(responses).map((item) => ({
    criteria_id: item.criteriaId,
    statement: item.statement,
    score: item.score,
  }));
};

const getRatingLabel = (average: number) => {
  const nearest = getNearestRating(average);
  return nearest?.label || "N/A";
};

const ratingBadge = (average: number) => {
  const position = getRatingPosition(average);

  if (position >= 0.875) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
  }
  if (position >= 0.625) {
    return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
  }
  if (position >= 0.375) {
    return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
  }
  if (position > 0) {
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
  }
  if (Number(average) > 0) {
    return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
  }

  return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
};

const ratingColor = (average: number) => {
  const position = getRatingPosition(average);

  if (position >= 0.875) return "success";
  if (position >= 0.625) return "primary";
  if (position >= 0.375) return "info";
  if (position > 0) return "warning";
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
  initializePage();
});
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
