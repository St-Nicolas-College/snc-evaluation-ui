<template>
  <div class="space-y-6 pb-8">
    <!-- =====================================================
          HERO
        ====================================================== -->
    <section
      class="relative overflow-hidden rounded-[28px] border border-violet-100 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-5 py-6 text-white shadow-xl shadow-violet-900/10 sm:px-7 sm:py-7"
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
            <UIcon name="i-lucide-building-2" class="size-7" />
          </div>

          <div class="min-w-0">
            <div
              class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-violet-50"
            >
              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Administrator Portal
              </span>

              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Grouped by Dean
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Faculty – Dean Results
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-violet-50/90">
              Review consolidated faculty evaluations in a scalable table designed for large Dean and Coordinator datasets.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ summary.totalDeans }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-violet-100"
            >
              Dean Groups
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ summary.totalEvaluations }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-violet-100"
            >
              Evaluations
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ summary.averageScore }}
              <span class="text-sm font-medium text-violet-100">
                / {{ ratingMaxScore ?? "—" }}
              </span>
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-violet-100"
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
              Dean Groups
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ summary.totalDeans }}
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
              Unique Faculty
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
          Faculty – Dean Results
        </h2>

        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Search and filter grouped Dean or Coordinator evaluation results.
        </p>

        <div class="mt-3 flex flex-wrap gap-2">
          <UBadge
            v-if="evaluationType"
            color="info"
            variant="subtle"
            icon="i-lucide-star"
          >
            {{ evaluationType.name }} ·
            {{ ratingMinScore ?? "—" }}–{{ ratingMaxScore ?? "—" }}
          </UBadge>
        </div>
      </div>

      <div
        class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.2fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(170px,0.9fr)_minmax(170px,0.9fr)]"
      >
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search Dean or Coordinator..."
          class="w-full"
        />

        <USelectMenu
          v-model="selectedDean"
          :items="deanOptions"
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
          v-if="selectedDean !== 'all'"
          color="primary"
          variant="subtle"
        >
          {{ getSelectedLabel(deanOptions, selectedDean) }}
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
              Showing {{ filteredGroups.length }} Dean group{{
                filteredGroups.length === 1 ? "" : "s"
              }}
              from {{ evaluations.length }} evaluation record{{
                evaluations.length === 1 ? "" : "s"
              }}.
            </p>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Search Dean or Coordinator or department..."
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
                ? "No matching Dean or Coordinator found"
                : "No evaluation results available"
            }}
          </h3>

          <p
            class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400"
          >
            {{
              groupedResults.length
                ? "Try another Dean, Coordinator, or department."
                : "No Faculty – Dean evaluation results matched the selected filters."
            }}
          </p>
        </div>

        <!-- TABLE -->
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[1180px] text-sm">
            <thead
              class="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40 dark:text-gray-400"
            >
              <tr>
                <th class="px-5 py-3 text-left">Dean / Coordinator</th>
                <th class="px-4 py-3 text-left">Department</th>
                <th class="px-4 py-3 text-center">Periods</th>
                <th class="px-4 py-3 text-center">Evaluations</th>
                <th class="px-4 py-3 text-center">Faculty</th>
                <th class="px-4 py-3 text-center">Average</th>
                <th class="px-4 py-3 text-center">Rating</th>
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
                  {{ group.periodCount }}
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
            {{ filteredGroups.length }} Dean groups
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

const searchQuery = ref("");
const selectedDean = ref("all");
const selectedDepartment = ref("all");
const selectedSemester = ref("all");
const selectedSchoolYear = ref("all");

const activePeriodLoading = ref(false);

const loadActiveAcademicPeriod = async () => {
  activePeriodLoading.value = true;

  try {
    const response: any = await $api("/school-years", {
      query: {
        "filters[active_sy][$eq]": true,
        "pagination[pageSize]": 1,
        "sort[0]": "createdAt:desc",
      },
    });

    const activeRecord = response?.data?.[0];

    if (!activeRecord) {
      return;
    }

    selectedSchoolYear.value =
      activeRecord?.school_year || "all";

    selectedSemester.value =
      activeRecord?.semester || "all";
  } catch (error) {
    console.warn(
      "Unable to load the active academic period:",
      error,
    );
  } finally {
    activePeriodLoading.value = false;
  }
};

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

/* =========================================================
   DYNAMIC EVALUATION TYPE / RATING SCALE
========================================================= */

const evaluationResponseType = computed(() => {
  return evaluationType.value?.response_type || "rating";
});

const normalizedScaleLabels = computed<Record<string, string>>(() => {
  const labels = evaluationType.value?.scale_labels;

  if (!labels || typeof labels !== "object" || Array.isArray(labels)) {
    return {};
  }

  return labels;
});

const ratingScale = computed(() => {
  if (evaluationResponseType.value !== "rating") {
    return [];
  }

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
      rows.push({
        score,
        label: `Rating ${score}`,
      });
    }

    return rows;
  }

  return [];
});

const ratingScores = computed(() =>
  ratingScale.value.map((item) => Number(item.score)),
);

const ratingMinScore = computed(() => {
  if (!ratingScores.value.length) return null;
  return Math.min(...ratingScores.value);
});

const ratingMaxScore = computed(() => {
  if (!ratingScores.value.length) return null;
  return Math.max(...ratingScores.value);
});

const getNearestRating = (average: number) => {
  const avg = Number(average);

  if (!Number.isFinite(avg) || avg <= 0 || !ratingScale.value.length) {
    return null;
  }

  return [...ratingScale.value].sort((a, b) => {
    const distanceA = Math.abs(Number(a.score) - avg);
    const distanceB = Math.abs(Number(b.score) - avg);

    if (distanceA === distanceB) {
      return Number(b.score) - Number(a.score);
    }

    return distanceA - distanceB;
  })[0] || null;
};

const getRatingPosition = (average: number) => {
  const nearest = getNearestRating(average);

  if (!nearest) return 0;

  if (ratingScale.value.length <= 1) {
    return 1;
  }

  const index = ratingScale.value.findIndex(
    (item) => Number(item.score) === Number(nearest.score),
  );

  return index < 0
    ? 0
    : index / (ratingScale.value.length - 1);
};

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

const deanOptions = computed(() => {
  const deanMap = new Map<string, string>();

  evaluations.value.forEach((evaluation: any) => {
    const value = String(
      evaluation?.dean_coordinator?.documentId ||
        evaluation?.dean_coordinator?.id ||
        getDeanName(evaluation) ||
        "",
    );

    const label = getDeanName(evaluation);

    if (value) {
      deanMap.set(value, label);
    }
  });

  return [
    {
      label: "All Deans / Coordinators",
      value: "all",
    },
    ...Array.from(deanMap.entries())
      .map(([value, label]) => ({
        label,
        value,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];
});

const departmentOptions = computed(() =>
  makeOptions(
    evaluations.value.map((evaluation) => getDeanDepartment(evaluation)),
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

const groupedResults = computed(() => {
  const groups = new Map<string, any>();

  evaluations.value.forEach((evaluation: any) => {
    const deanKey = String(
      evaluation?.dean_coordinator?.documentId ||
        evaluation?.dean_coordinator?.id ||
        getDeanName(evaluation) ||
        "unknown-dean",
    );

    if (!groups.has(deanKey)) {
      groups.set(deanKey, {
        key: deanKey,
        deanId:
          evaluation?.dean_coordinator?.documentId || evaluation?.dean_coordinator?.id || "",
        name: getDeanName(evaluation),
        department: getDeanDepartment(evaluation),
        records: [],
        evaluatorKeys: new Set<string>(),
        periodKeys: new Set<string>(),
        semesterValues: new Set<string>(),
        schoolYearValues: new Set<string>(),
      });
    }

    const group = groups.get(deanKey);
    group.records.push(evaluation);

    const evaluatorKey = String(
      evaluation?.evaluator_user?.documentId ||
        evaluation?.evaluator_user?.id ||
        getEvaluatorName(evaluation),
    );

    if (evaluatorKey) {
      group.evaluatorKeys.add(evaluatorKey);
    }

    const periodKey = `${getSemester(evaluation)}-${getSchoolYear(evaluation)}`;

    if (periodKey && periodKey !== "N/A-N/A") {
      group.periodKeys.add(periodKey);
    }

    const semester = getSemester(evaluation);
    const schoolYear = getSchoolYear(evaluation);

    if (semester !== "N/A") {
      group.semesterValues.add(semester);
    }

    if (schoolYear !== "N/A") {
      group.schoolYearValues.add(schoolYear);
    }
  });

  return Array.from(groups.values())
    .map((group) => {
      const validScores = group.records
        .map((record: any) => Number(record.average_score))
        .filter((score: number) => Number.isFinite(score) && score > 0);

      const sortedRecords = [...group.records].sort(
        (a: any, b: any) =>
          new Date(getEvaluationDate(b) || 0).getTime() -
          new Date(getEvaluationDate(a) || 0).getTime(),
      );

      return {
        ...group,
        records: sortedRecords,
        recordCount: group.records.length,
        evaluatorCount: group.evaluatorKeys.size,
        periodCount: group.periodKeys.size,
        semesters: Array.from(group.semesterValues),
        schoolYears: Array.from(group.schoolYearValues),
        averageScore: validScores.length
          ? validScores.reduce((sum: number, score: number) => sum + score, 0) /
            validScores.length
          : 0,
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

    const matchesSearch = !query || searchable.includes(query);

    const matchesFaculty =
      selectedDean.value === "all" ||
      group.key === selectedDean.value ||
      group.deanId === selectedDean.value;

    const matchesDepartment =
      selectedDepartment.value === "all" ||
      group.department === selectedDepartment.value;

    const matchesSemester =
      selectedSemester.value === "all" ||
      group.semesters.includes(selectedSemester.value);

    const matchesSchoolYear =
      selectedSchoolYear.value === "all" ||
      group.schoolYears.includes(selectedSchoolYear.value);

    return (
      matchesSearch &&
      matchesFaculty &&
      matchesDepartment &&
      matchesSemester &&
      matchesSchoolYear
    );
  });
});

const hasActiveFilters = computed(() =>
  Boolean(
    searchQuery.value ||
    selectedDean.value !== "all" ||
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
  const evaluationScores = evaluations.value
    .map((evaluation) => Number(evaluation.average_score))
    .filter((score) => Number.isFinite(score) && score > 0);

  const evaluatorKeys = new Set(
    evaluations.value
      .map(
        (evaluation) =>
          evaluation?.evaluator_user?.documentId ||
          evaluation?.evaluator_user?.id ||
          "",
      )
      .filter(Boolean),
  );

  return {
    totalDeans: groupedResults.value.length,
    totalEvaluations: evaluations.value.length,
    totalEvaluators: evaluatorKeys.size,
    averageScore: evaluationScores.length
      ? (
          evaluationScores.reduce((sum, score) => sum + score, 0) /
          evaluationScores.length
        ).toFixed(2)
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

const getDeanName = (evaluation: any) => {
  const dean = evaluation?.dean_coordinator

  const firstName =
    dean?.user?.user_info?.first_name ||
    dean?.user_info?.first_name ||
    dean?.first_name ||
    ''

  const middleName =
    dean?.user?.user_info?.middle_name ||
    dean?.user_info?.middle_name ||
    dean?.middle_name ||
    ''

  const lastName =
    dean?.user?.user_info?.last_name ||
    dean?.user_info?.last_name ||
    dean?.last_name ||
    ''

  const suffix =
    dean?.user?.user_info?.suffix ||
    dean?.user_info?.suffix ||
    dean?.suffix ||
    ''

  const constructedName = [
    firstName,
    middleName,
    lastName,
    suffix
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  return (
    dean?.name ||
    dean?.full_name ||
    dean?.display_name ||
    constructedName ||
    dean?.user?.name ||
    dean?.user?.full_name ||
    dean?.user?.username ||
    dean?.user?.email ||
    'Unknown Dean'
  )
}

const getDeanDepartment = (evaluation: any) => {
  const dean = evaluation?.dean_coordinator

  return (
    dean?.department?.name ||
    dean?.department ||
    dean?.user?.user_info?.department?.name ||
    dean?.user?.user_info?.department ||
    dean?.user_info?.department?.name ||
    dean?.user_info?.department ||
    evaluation?.batch?.department ||
    'Not specified'
  )
}

const getEvaluatorName = (evaluation: any) => {
  const user = evaluation?.evaluator_user

  const firstName =
    user?.user_info?.first_name ||
    user?.first_name ||
    ''

  const middleName =
    user?.user_info?.middle_name ||
    user?.middle_name ||
    ''

  const lastName =
    user?.user_info?.last_name ||
    user?.last_name ||
    ''

  const suffix =
    user?.user_info?.suffix ||
    user?.suffix ||
    ''

  const constructedName = [
    firstName,
    middleName,
    lastName,
    suffix
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  return (
    user?.name ||
    user?.full_name ||
    constructedName ||
    user?.username ||
    user?.email ||
    'Unknown Faculty'
  )
}

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
    `${evaluation?.dean_coordinator?.id || ""}-${evaluation?.evaluator_user?.id || ""}-${evaluation?.createdAt || ""}`
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
      "filters[code][$eq]": "faculty-dean-coordinator",
      "pagination[pageSize]": 1,
    },
  });

  evaluationType.value = response?.data?.[0] || null;

  if (!evaluationType.value) {
    throw new Error(
      "Faculty-Dean/Coordinator evaluation type is not configured.",
    );
  }

  if (evaluationResponseType.value !== "rating") {
    throw new Error(
      "Faculty-Dean/Coordinator must use a Rating Scale response type.",
    );
  }

  if (!ratingScale.value.length) {
    throw new Error(
      "The Faculty-Dean/Coordinator evaluation type has no valid rating scale configured.",
    );
  }
};

const getResults = async () => {
  pending.value = true
  loadError.value = ''

  try {
    if (!evaluationType.value) {
      await getEvaluationType();
    }

    if (
      evaluationResponseType.value !== "rating" ||
      !ratingScale.value.length
    ) {
      throw new Error(
        "The Faculty-Dean/Coordinator rating scale is not configured correctly.",
      );
    }

    const query: any = {
      'filters[batch][evaluation_type][code][$eq]':
        'faculty-dean-coordinator',

      populate: '*',

      'sort[0]': 'createdAt:desc',

      'pagination[pageSize]': 10000
    }

    const res: any = await $api('/evaluations', {
      query
    })

    console.log(
      'FACULTY-DEAN FULL RESPONSE:',
      JSON.parse(JSON.stringify(res))
    )

    console.log(
      'FIRST EVALUATION:',
      JSON.parse(
        JSON.stringify(res?.data?.[0] || null)
      )
    )

    console.log(
      'DEAN COORDINATOR:',
      JSON.parse(
        JSON.stringify(
          res?.data?.[0]?.dean_coordinator || null
        )
      )
    )

    evaluations.value = res.data || []
    page.value = 1
  } catch (error: any) {
    console.error(
      'Faculty-Dean result loading error:',
      error
    )

    evaluations.value = []

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to load Faculty – Dean evaluation results.'
  } finally {
    pending.value = false
  }
}

const clearFilters = () => {
  searchQuery.value = "";
  selectedDean.value = "all";
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

const openGroup = async (group: any) => {
  const deanId = String(
    group?.deanId ||
      group?.key ||
      "",
  );

  if (!deanId) {
    toast.add({
      title: "Unable to open summary",
      description: "The selected Dean or Coordinator has no valid document ID.",
      icon: "i-lucide-triangle-alert",
      color: "error",
    });

    return;
  }

  await navigateTo({
    path: `/admin/evaluation/faculty-dean/${encodeURIComponent(deanId)}`,
    query: {
      semester: selectedSemester.value,
      schoolYear: selectedSchoolYear.value,
    },
  });
};

const formatResponses = (responses: any) => {
  if (!responses) {
    return [];
  }

  if (Array.isArray(responses)) {
    return responses.map((item: any) => ({
      criteria_id: item.criteria_id || item.criteriaId || item.id,

      statement:
        item.statement ||
        item.question ||
        `Criteria #${item.criteria_id || item.criteriaId || item.id}`,

      score: item.score ?? item.value ?? item.rating ?? 0,
    }));
  }

  return Object.entries(responses).map(([criteriaId, score]) => ({
    criteria_id: criteriaId,
    statement: `Criteria #${criteriaId}`,
    score,
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

watch(
  [
    searchQuery,
    selectedDean,
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

onMounted(async () => {
  try {
    await Promise.all([
      loadActiveAcademicPeriod(),
      getEvaluationType(),
    ]);

    await getResults();
  } catch (error: any) {
    console.error(
      "Faculty-Dean result initialization error:",
      error,
    );

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Failed to initialize Faculty – Dean evaluation results.";
  }
});
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
