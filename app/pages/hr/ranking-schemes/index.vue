<template>
  <div class="space-y-6 pb-10">
    <!-- PAGE HEADER -->
    <section
      class="relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-800 px-6 py-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] sm:px-8"
    >
      <div
        class="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
      />

      <div
        class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-cyan-300/10 blur-3xl"
      />

      <div
        class="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"
      >
        <div class="max-w-3xl">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-100 backdrop-blur-sm"
            >
              Ranking Configuration
            </span>

            <span
              v-if="activeScheme"
              class="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-100"
            >
              Active: {{ activeScheme.academic_year || "Current" }}
            </span>
          </div>

          <h1 class="mt-4 text-3xl font-black tracking-tight sm:text-[36px]">
            Ranking Schemes
          </h1>

          <p class="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
            Manage faculty ranking configurations, academic-year versions,
            evaluation point limits, rank bands, and salary-rate references.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-lucide-refresh-cw"
            :loading="loading"
            @click="loadData"
          >
            Refresh
          </UButton>

          <UButton
            to="/hr/ranking-schemes/create"
            icon="i-lucide-plus"
            size="lg"
            color="neutral"
            variant="solid"
            class="shadow-lg shadow-black/10"
          >
            Create Scheme
          </UButton>
        </div>
      </div>
    </section>

    <!-- SUMMARY -->
    <section>
      <div
        class="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p
            class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
          >
            Configuration Overview
          </p>

          <h2 class="mt-1 text-lg font-black text-gray-900 dark:text-white">
            Scheme Status Summary
          </h2>
        </div>

        <p class="text-xs text-gray-500">
          Overview of all ranking schemes stored in the system.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard
          label="Total Schemes"
          :value="summary.total"
          icon="i-lucide-layers-3"
          description="All configuration records"
          tone="info"
        />

        <SummaryCard
          label="Active"
          :value="summary.active"
          icon="i-lucide-circle-check-big"
          description="Currently available for ranking"
          tone="success"
        />

        <SummaryCard
          label="Draft"
          :value="summary.draft"
          icon="i-lucide-pencil-ruler"
          description="Still being configured"
          tone="warning"
        />

        <SummaryCard
          label="Archived"
          :value="summary.archived"
          icon="i-lucide-archive"
          description="Historical configurations"
          tone="neutral"
        />
      </div>
    </section>

    <!-- ACTIVE SCHEME -->
    <section
      v-if="activeScheme && !loading"
      class="relative overflow-hidden rounded-[26px] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-5 shadow-sm dark:border-emerald-900 dark:from-emerald-950/20 dark:via-gray-900 dark:to-teal-950/10"
    >
      <div
        class="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-emerald-400/10 blur-3xl"
      />

      <div
        class="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
          >
            <UIcon name="i-lucide-badge-check" class="size-6" />
          </div>

          <div>
            <p
              class="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400"
            >
              Current Active Scheme
            </p>

            <h2 class="mt-1 text-lg font-black text-gray-900 dark:text-white">
              {{ activeScheme.name }}
            </h2>

            <p class="mt-1 text-sm text-gray-500">
              {{ activeScheme.academic_year || "No academic year" }}
              <span class="mx-1">•</span>
              Version {{ activeScheme.version || "N/A" }}
              <span class="mx-1">•</span>
              {{ activeScheme.code }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-lucide-eye"
            :to="`/hr/ranking-schemes/${activeScheme.documentId}`"
          >
            View Scheme
          </UButton>

          <UButton
            icon="i-lucide-pencil"
            :to="`/hr/ranking-schemes/${activeScheme.documentId}/edit`"
          >
            Edit Active Scheme
          </UButton>
        </div>
      </div>
    </section>

    <!-- FILTERS -->
    <section
      class="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="mb-5 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
          >
            <UIcon name="i-lucide-sliders-horizontal" class="size-5" />
          </div>

          <div>
            <h2 class="font-bold text-gray-900 dark:text-white">
              Search and Filters
            </h2>

            <p class="mt-1 text-xs text-gray-500">
              Find schemes by name, code, version, status, or academic year.
            </p>
          </div>
        </div>

        <span
          v-if="hasActiveFilters"
          class="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
        >
          Filters Active
        </span>
      </div>

      <div class="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr]">
        <UFormField label="Search">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search scheme name, code, version..."
            class="w-full"
          />
        </UFormField>

        <UFormField label="Status">
          <USelectMenu
            v-model="selectedStatus"
            :items="statusOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Academic Year">
          <USelectMenu
            v-model="selectedAcademicYear"
            :items="academicYearOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>
      </div>

      <div
        class="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <p class="text-xs text-gray-500">
          {{ filteredSchemes.length }} result{{
            filteredSchemes.length === 1 ? "" : "s"
          }}
        </p>

        <UButton
          v-if="hasActiveFilters"
          color="neutral"
          variant="soft"
          icon="i-lucide-filter-x"
          @click="clearFilters"
        >
          Clear Filters
        </UButton>
      </div>
    </section>

    <!-- ERROR -->
    <section
      v-if="loadError && !loading"
      class="rounded-[24px] border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/20"
    >
      <div class="flex items-start gap-3">
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/40"
        >
          <UIcon name="i-lucide-triangle-alert" class="size-5" />
        </div>

        <div class="min-w-0 flex-1">
          <p class="font-bold text-red-900 dark:text-red-200">
            Unable to load ranking schemes
          </p>

          <p class="mt-1 text-xs leading-5 text-red-700 dark:text-red-300">
            {{ loadError }}
          </p>
        </div>

        <UButton
          color="error"
          variant="soft"
          size="xs"
          icon="i-lucide-refresh-cw"
          @click="loadData"
        >
          Retry
        </UButton>
      </div>
    </section>

    <!-- RECORDS -->
    <section
      class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <!-- TABLE HEADER -->
      <div
        class="flex flex-col gap-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          >
            <UIcon name="i-lucide-list-ordered" class="size-5" />
          </div>

          <div>
            <p
              class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
            >
              Ranking Configuration
            </p>

            <h2 class="mt-1 font-black text-gray-900 dark:text-white">
              Ranking Scheme Records
            </h2>

            <p class="mt-1 text-xs text-gray-500">
              Showing {{ paginationStart }}–{{ paginationEnd }} of
              {{ filteredSchemes.length }} scheme record{{
                filteredSchemes.length === 1 ? "" : "s"
              }}.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500"> Rows per page </span>

          <USelectMenu
            v-model="pageSize"
            :items="pageSizeOptions"
            value-key="value"
            class="w-24"
          />
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="space-y-3 p-5">
        <USkeleton v-for="index in 5" :key="index" class="h-24 rounded-2xl" />
      </div>

      <!-- EMPTY -->
      <div v-else-if="!filteredSchemes.length" class="px-6 py-16 text-center">
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
        >
          <UIcon name="i-lucide-layers-3" class="size-7" />
        </div>

        <h3 class="mt-4 font-bold text-gray-900 dark:text-white">
          No ranking schemes found
        </h3>

        <p class="mt-2 text-sm text-gray-500">
          {{
            hasActiveFilters
              ? "Try adjusting your search or filters."
              : "Create your first ranking scheme to begin configuration."
          }}
        </p>

        <div class="mt-5 flex flex-wrap justify-center gap-2">
          <UButton
            v-if="hasActiveFilters"
            color="neutral"
            variant="soft"
            icon="i-lucide-filter-x"
            @click="clearFilters"
          >
            Clear Filters
          </UButton>

          <UButton v-else to="/hr/ranking-schemes/create" icon="i-lucide-plus">
            Create Scheme
          </UButton>
        </div>
      </div>

      <template v-else>
        <!-- DESKTOP TABLE -->
        <div class="hidden overflow-x-auto lg:block">
          <table class="w-full min-w-[1280px] text-sm">
            <thead
              class="border-b border-gray-200 bg-slate-100/80 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600 dark:border-gray-800 dark:bg-gray-950/70 dark:text-slate-400"
            >
              <tr>
                <th class="px-5 py-3.5 text-left">Scheme</th>

                <th class="px-4 py-3.5 text-left">Academic Year</th>

                <th class="px-4 py-3.5 text-center">Version</th>

                <th class="px-4 py-3.5 text-center">Evaluation Max</th>

                <th class="px-4 py-3.5 text-center">Total Max</th>

                <th class="px-4 py-3.5 text-center">Rank Bands</th>

                <th class="px-4 py-3.5 text-center">Salary Rates</th>

                <th class="px-4 py-3.5 text-center">Status</th>

                <th class="px-4 py-3.5 text-center">Availability</th>

                <th class="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="scheme in paginatedSchemes"
                :key="scheme.documentId"
                class="group transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-950/10"
              >
                <!-- SCHEME -->
                <td class="px-5 py-4">
                  <div class="flex items-start gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-xl"
                      :class="
                        scheme.is_active
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                      "
                    >
                      <UIcon
                        :name="
                          scheme.is_active
                            ? 'i-lucide-badge-check'
                            : 'i-lucide-layers-3'
                        "
                        class="size-5"
                      />
                    </div>

                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <p
                          class="max-w-[320px] truncate font-bold text-gray-900 dark:text-white"
                        >
                          {{ scheme.name }}
                        </p>

                        <span
                          v-if="scheme.is_active"
                          class="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                        >
                          Current
                        </span>
                      </div>

                      <p class="mt-1 truncate text-xs text-gray-500">
                        {{ scheme.code }}
                      </p>

                      <p
                        v-if="scheme.description"
                        class="mt-1 max-w-[360px] truncate text-[11px] text-gray-400"
                      >
                        {{ scheme.description }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- AY -->
                <td class="px-4 py-4">
                  <p class="font-semibold text-gray-800 dark:text-gray-200">
                    {{ scheme.academic_year || "N/A" }}
                  </p>

                  <p class="mt-1 text-xs text-gray-500">
                    {{ dateRangeLabel(scheme) }}
                  </p>
                </td>

                <!-- VERSION -->
                <td class="px-4 py-4 text-center">
                  <span
                    class="inline-flex min-w-12 items-center justify-center rounded-xl bg-gray-100 px-2.5 py-1.5 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {{ scheme.version || "N/A" }}
                  </span>
                </td>

                <!-- EVAL MAX -->
                <td class="px-4 py-4 text-center">
                  <PointPill
                    :value="points(scheme.evaluation_max_points)"
                    tone="violet"
                  />
                </td>

                <!-- TOTAL MAX -->
                <td class="px-4 py-4 text-center">
                  <PointPill
                    :value="points(scheme.total_max_points)"
                    tone="blue"
                  />
                </td>

                <!-- RANK BANDS -->
                <td class="px-4 py-4 text-center">
                  <CountBadge
                    :value="scheme.rank_bands?.length || 0"
                    icon="i-lucide-trophy"
                    tone="emerald"
                  />
                </td>

                <!-- SALARY RATES -->
                <td class="px-4 py-4 text-center">
                  <CountBadge
                    :value="scheme.salary_rates?.length || 0"
                    icon="i-lucide-wallet-cards"
                    tone="amber"
                  />
                </td>

                <!-- STATUS -->
                <td class="px-4 py-4 text-center">
                  <UBadge
                    :color="statusColor(scheme.scheme_status)"
                    variant="subtle"
                  >
                    {{ formatStatus(scheme.scheme_status) }}
                  </UBadge>
                </td>

                <!-- ACTIVE -->
                <td class="px-4 py-4 text-center">
                  <UBadge
                    :color="scheme.is_active ? 'success' : 'neutral'"
                    variant="subtle"
                  >
                    {{ scheme.is_active ? "Active" : "Inactive" }}
                  </UBadge>
                </td>

                <!-- ACTIONS -->
                <td class="px-5 py-4">
                  <div class="flex justify-center gap-2">
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="soft"
                      icon="i-lucide-eye"
                      :to="`/hr/ranking-schemes/${scheme.documentId}`"
                    >
                      View
                    </UButton>

                    <UButton
                      size="xs"
                      icon="i-lucide-pencil"
                      :to="`/hr/ranking-schemes/${scheme.documentId}/edit`"
                    >
                      Edit
                    </UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- MOBILE/TABLET CARDS -->
        <div class="grid gap-3 p-4 lg:hidden">
          <article
            v-for="scheme in paginatedSchemes"
            :key="scheme.documentId"
            class="rounded-[22px] border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex size-11 shrink-0 items-center justify-center rounded-2xl"
                :class="
                  scheme.is_active
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                    : 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                "
              >
                <UIcon
                  :name="
                    scheme.is_active
                      ? 'i-lucide-badge-check'
                      : 'i-lucide-layers-3'
                  "
                  class="size-5"
                />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-black text-gray-900 dark:text-white">
                    {{ scheme.name }}
                  </h3>

                  <UBadge
                    :color="statusColor(scheme.scheme_status)"
                    variant="subtle"
                  >
                    {{ formatStatus(scheme.scheme_status) }}
                  </UBadge>
                </div>

                <p class="mt-1 truncate text-xs text-gray-500">
                  {{ scheme.code }}
                </p>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <MiniInfo
                label="Academic Year"
                :value="scheme.academic_year || 'N/A'"
              />

              <MiniInfo label="Version" :value="scheme.version || 'N/A'" />

              <MiniInfo
                label="Rank Bands"
                :value="scheme.rank_bands?.length || 0"
              />

              <MiniInfo
                label="Salary Rates"
                :value="scheme.salary_rates?.length || 0"
              />
            </div>

            <div
              class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800"
            >
              <div class="flex flex-wrap gap-2">
                <UBadge
                  :color="scheme.is_active ? 'success' : 'neutral'"
                  variant="subtle"
                >
                  {{ scheme.is_active ? "Active" : "Inactive" }}
                </UBadge>

                <span class="text-xs text-gray-500">
                  Eval Max:
                  <strong class="text-gray-700 dark:text-gray-300">
                    {{ points(scheme.evaluation_max_points) }}
                  </strong>
                </span>

                <span class="text-xs text-gray-500">
                  Total Max:
                  <strong class="text-gray-700 dark:text-gray-300">
                    {{ points(scheme.total_max_points) }}
                  </strong>
                </span>
              </div>

              <div class="flex gap-2">
                <UButton
                  size="xs"
                  color="neutral"
                  variant="soft"
                  icon="i-lucide-eye"
                  :to="`/hr/ranking-schemes/${scheme.documentId}`"
                >
                  View
                </UButton>

                <UButton
                  size="xs"
                  icon="i-lucide-pencil"
                  :to="`/hr/ranking-schemes/${scheme.documentId}/edit`"
                >
                  Edit
                </UButton>
              </div>
            </div>
          </article>
        </div>

        <!-- PAGINATION -->
        <div
          class="flex flex-col gap-3 border-t border-gray-200 bg-gray-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-950/30"
        >
          <p class="text-xs text-gray-500">
            Page
            <span class="font-semibold text-gray-700 dark:text-gray-300">
              {{ currentPage }}
            </span>
            of
            <span class="font-semibold text-gray-700 dark:text-gray-300">
              {{ totalPages }}
            </span>
            ·
            {{ filteredSchemes.length }} record{{
              filteredSchemes.length === 1 ? "" : "s"
            }}
          </p>

          <UPagination
            v-model:page="currentPage"
            :total="filteredSchemes.length"
            :items-per-page="pageSize"
            :sibling-count="1"
            show-edges
          />
        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  middleware: ["auth", "role"],
  role: ["HR", "Admin"],
});

const { $api } = useNuxtApp();

const loading = ref(false);
const loadError = ref("");
const schemes = ref<any[]>([]);

const searchQuery = ref("");
const selectedStatus = ref("all");
const selectedAcademicYear = ref("all");

const currentPage = ref(1);
const pageSize = ref(10);

const pageSizeOptions = [
  {
    label: "10",
    value: 10,
  },
  {
    label: "25",
    value: 25,
  },
  {
    label: "50",
    value: 50,
  },
  {
    label: "100",
    value: 100,
  },
];

const statusOptions = [
  {
    label: "All Statuses",
    value: "all",
  },
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Archived",
    value: "archived",
  },
];

const activeScheme = computed(() =>
  schemes.value.find(
    (scheme: any) =>
      scheme.is_active === true && scheme.scheme_status === "active",
  ),
);

const academicYearOptions = computed(() => {
  const years = Array.from(
    new Set(
      schemes.value.map((scheme: any) => scheme.academic_year).filter(Boolean),
    ),
  )
    .sort()
    .reverse();

  return [
    {
      label: "All Academic Years",
      value: "all",
    },

    ...years.map((year) => ({
      label: year,
      value: year,
    })),
  ];
});

const filteredSchemes = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return schemes.value.filter((scheme: any) => {
    const searchable = [
      scheme.name,
      scheme.code,
      scheme.version,
      scheme.academic_year,
      scheme.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (selectedStatus.value === "all" ||
        scheme.scheme_status === selectedStatus.value) &&
      (selectedAcademicYear.value === "all" ||
        scheme.academic_year === selectedAcademicYear.value)
    );
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredSchemes.value.length / pageSize.value)),
);

const paginatedSchemes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;

  return filteredSchemes.value.slice(start, start + pageSize.value);
});

const paginationStart = computed(() => {
  if (!filteredSchemes.value.length) {
    return 0;
  }

  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() =>
  Math.min(currentPage.value * pageSize.value, filteredSchemes.value.length),
);

const summary = computed(() => ({
  total: schemes.value.length,

  active: schemes.value.filter(
    (scheme: any) => scheme.scheme_status === "active",
  ).length,

  draft: schemes.value.filter((scheme: any) => scheme.scheme_status === "draft")
    .length,

  archived: schemes.value.filter(
    (scheme: any) => scheme.scheme_status === "archived",
  ).length,
}));

const hasActiveFilters = computed(
  () =>
    Boolean(searchQuery.value.trim()) ||
    selectedStatus.value !== "all" ||
    selectedAcademicYear.value !== "all",
);

const points = (value: unknown) => {
  const number = Number(value ?? 0);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return Number.isInteger(number)
    ? String(number)
    : number.toFixed(2).replace(/\.?0+$/, "");
};

const formatStatus = (value: string) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const statusColor = (status: string) => {
  if (status === "active") {
    return "success";
  }

  if (status === "draft") {
    return "warning";
  }

  return "neutral";
};

const formatDate = (value: any) => {
  if (!value) {
    return "";
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

const dateRangeLabel = (scheme: any) => {
  const effective = formatDate(scheme?.effective_date);

  const expiration = formatDate(scheme?.expiration_date);

  if (effective && expiration) {
    return `${effective} – ${expiration}`;
  }

  if (effective) {
    return `Effective ${effective}`;
  }

  return "No effectivity date";
};

const clearFilters = () => {
  searchQuery.value = "";

  selectedStatus.value = "all";

  selectedAcademicYear.value = "all";

  currentPage.value = 1;
};

const loadData = async () => {
  loading.value = true;
  loadError.value = "";

  try {
    const response: any = await $api("/ranking-schemes", {
      query: {
        "populate[rank_bands]": true,

        "populate[salary_rates]": true,

        "pagination[page]": 1,

        "pagination[pageSize]": 1000,

        "sort[0]": "effective_date:desc",
      },
    });

    schemes.value = response?.data || [];
  } catch (error: any) {
    console.error("Ranking scheme loading error:", error);

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to load ranking schemes.";
  } finally {
    loading.value = false;
  }
};

/* ---------- LOCAL UI COMPONENTS ---------- */

const SummaryCard = defineComponent({
  props: {
    label: String,

    value: [String, Number],

    icon: String,

    description: String,

    tone: {
      type: String,
      default: "info",
    },
  },

  setup(props) {
    const tones: Record<string, any> = {
      info: {
        icon: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",

        accent: "from-blue-500/15 via-blue-500/5 to-transparent",
      },

      success: {
        icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",

        accent: "from-emerald-500/15 via-emerald-500/5 to-transparent",
      },

      warning: {
        icon: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",

        accent: "from-amber-500/15 via-amber-500/5 to-transparent",
      },

      neutral: {
        icon: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",

        accent: "from-slate-500/10 via-slate-500/5 to-transparent",
      },
    };

    return () => {
      const tone = tones[props.tone] || tones.info;

      return h(
        "div",
        {
          class:
            "group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900",
        },
        [
          h("div", {
            class: `pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${tone.accent}`,
          }),

          h(
            "div",
            {
              class: "relative flex items-start justify-between gap-4",
            },
            [
              h("div", {}, [
                h(
                  "p",
                  {
                    class:
                      "text-xs font-bold uppercase tracking-[0.08em] text-gray-500",
                  },
                  props.label,
                ),

                h(
                  "p",
                  {
                    class:
                      "mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white",
                  },
                  String(props.value ?? 0),
                ),

                h(
                  "p",
                  {
                    class: "mt-1.5 text-[11px] leading-4 text-gray-400",
                  },
                  props.description || "",
                ),
              ]),

              h(
                "div",
                {
                  class: `flex size-11 items-center justify-center rounded-2xl shadow-sm ${tone.icon}`,
                },
                [
                  h(resolveComponent("UIcon"), {
                    name: props.icon,

                    class: "size-5",
                  }),
                ],
              ),
            ],
          ),
        ],
      );
    };
  },
});

const PointPill = defineComponent({
  props: {
    value: [String, Number],

    tone: {
      type: String,
      default: "blue",
    },
  },

  setup(props) {
    const styles: Record<string, string> = {
      blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",

      violet:
        "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300",
    };

    return () =>
      h(
        "span",
        {
          class: `inline-flex min-w-14 items-center justify-center rounded-xl px-2.5 py-1.5 text-xs font-black ${
            styles[props.tone] || styles.blue
          }`,
        },
        String(props.value ?? 0),
      );
  },
});

const CountBadge = defineComponent({
  props: {
    value: [String, Number],

    icon: String,

    tone: {
      type: String,
      default: "emerald",
    },
  },

  setup(props) {
    const styles: Record<string, string> = {
      emerald:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",

      amber:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
    };

    return () =>
      h(
        "span",
        {
          class: `inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold ${
            styles[props.tone] || styles.emerald
          }`,
        },
        [
          h(resolveComponent("UIcon"), {
            name: props.icon,

            class: "size-3.5",
          }),

          h("span", {}, String(props.value ?? 0)),
        ],
      );
  },
});

const MiniInfo = defineComponent({
  props: {
    label: String,

    value: [String, Number],
  },

  setup(props) {
    return () =>
      h(
        "div",
        {
          class: "rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-950/30",
        },
        [
          h(
            "p",
            {
              class:
                "text-[9px] font-bold uppercase tracking-wide text-gray-400",
            },
            props.label,
          ),

          h(
            "p",
            {
              class: "mt-1 text-sm font-bold text-gray-900 dark:text-white",
            },
            String(props.value ?? "N/A"),
          ),
        ],
      );
  },
});

watch([searchQuery, selectedStatus, selectedAcademicYear, pageSize], () => {
  currentPage.value = 1;
});

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages;
  }
});

onMounted(loadData);
</script>
