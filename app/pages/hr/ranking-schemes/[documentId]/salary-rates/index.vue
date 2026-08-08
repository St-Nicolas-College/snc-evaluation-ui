<template>
  <div class="space-y-6 pb-10">
    <!-- LOADING -->
    <div v-if="loading" class="space-y-5">
      <USkeleton class="h-52 rounded-[34px]" />
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <USkeleton
          v-for="index in 4"
          :key="index"
          class="h-28 rounded-[24px]"
        />
      </div>
      <USkeleton class="h-80 rounded-[28px]" />
    </div>

    <!-- ERROR -->
    <section
      v-else-if="loadError"
      class="rounded-[28px] border border-red-200 bg-red-50 p-10 text-center shadow-sm dark:border-red-900 dark:bg-red-950/20"
    >
      <div
        class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40"
      >
        <UIcon name="i-lucide-triangle-alert" class="size-8" />
      </div>

      <h2 class="mt-4 text-lg font-black text-gray-900 dark:text-white">
        Unable to load salary rates
      </h2>

      <p class="mt-2 text-sm text-gray-500">
        {{ loadError }}
      </p>

      <div class="mt-6 flex flex-wrap justify-center gap-2">
        <UButton
          :to="`/hr/ranking-schemes/${documentId}`"
          color="neutral"
          variant="soft"
          icon="i-lucide-arrow-left"
        >
          Back to Scheme
        </UButton>

        <UButton icon="i-lucide-refresh-cw" @click="loadData">
          Retry
        </UButton>
      </div>
    </section>

    <template v-else-if="scheme">
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
                class="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-100"
              >
                {{ scheme.academic_year || "Current" }}
              </span>
            </div>

            <h1 class="mt-4 text-3xl font-black tracking-tight sm:text-[36px]">
              Salary Rates
            </h1>

            <p class="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
              Manage compensation-rate records, point references, below-minimum
              rules, effectivity dates, status, and display order for this
              ranking scheme.
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <UButton
              :to="`/hr/ranking-schemes/${documentId}`"
              color="neutral"
              variant="soft"
              icon="i-lucide-arrow-left"
            >
              Back to Scheme
            </UButton>

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
              color="neutral"
              variant="solid"
              size="lg"
              icon="i-lucide-plus"
              class="shadow-lg shadow-black/10"
              @click="openCreateDialog"
            >
              Add Salary Rate
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
              Salary Rate Summary
            </h2>
          </div>

          <p class="text-xs text-gray-500">
            Overview of all salary-rate records under this scheme.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <article
            class="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-blue-500/15 via-blue-500/5 to-transparent"
            />

            <div class="relative flex items-start justify-between gap-4">
              <div>
                <p
                  class="text-xs font-bold uppercase tracking-[0.08em] text-gray-500"
                >
                  Total Rates
                </p>

                <p
                  class="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white"
                >
                  {{ summary.total }}
                </p>

                <p class="mt-1.5 text-[11px] leading-4 text-gray-400">
                  All configuration records
                </p>
              </div>

              <div
                class="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-950/30 dark:text-blue-400"
              >
                <UIcon name="i-lucide-layers-3" class="size-5" />
              </div>
            </div>
          </article>

          <article
            class="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent"
            />

            <div class="relative flex items-start justify-between gap-4">
              <div>
                <p
                  class="text-xs font-bold uppercase tracking-[0.08em] text-gray-500"
                >
                  Active
                </p>

                <p
                  class="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white"
                >
                  {{ summary.active }}
                </p>

                <p class="mt-1.5 text-[11px] leading-4 text-gray-400">
                  Available for assignment
                </p>
              </div>

              <div
                class="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm dark:bg-emerald-950/30 dark:text-emerald-400"
              >
                <UIcon name="i-lucide-circle-check-big" class="size-5" />
              </div>
            </div>
          </article>

          <article
            class="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-violet-500/15 via-violet-500/5 to-transparent"
            />

            <div class="relative flex items-start justify-between gap-4">
              <div>
                <p
                  class="text-xs font-bold uppercase tracking-[0.08em] text-gray-500"
                >
                  Below Minimum
                </p>

                <p
                  class="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white"
                >
                  {{ summary.belowMinimum }}
                </p>

                <p class="mt-1.5 text-[11px] leading-4 text-gray-400">
                  Special threshold records
                </p>
              </div>

              <div
                class="flex size-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 shadow-sm dark:bg-violet-950/30 dark:text-violet-400"
              >
                <UIcon name="i-lucide-gauge" class="size-5" />
              </div>
            </div>
          </article>

          <article
            class="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent"
            />

            <div class="relative flex items-start justify-between gap-4">
              <div>
                <p
                  class="text-xs font-bold uppercase tracking-[0.08em] text-gray-500"
                >
                  Highest Rate
                </p>

                <p
                  class="mt-3 text-xl font-black tracking-tight text-gray-900 dark:text-white"
                >
                  {{ php(summary.highestRate) }}
                </p>

                <p class="mt-1.5 text-[11px] leading-4 text-gray-400">
                  Maximum configured rate
                </p>
              </div>

              <div
                class="flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-sm dark:bg-amber-950/30 dark:text-amber-400"
              >
                <UIcon name="i-lucide-wallet-cards" class="size-5" />
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- SELECTED SCHEME -->
      <section
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
                Selected Ranking Scheme
              </p>

              <h2 class="mt-1 text-lg font-black text-gray-900 dark:text-white">
                {{ scheme.name }}
              </h2>

              <p class="mt-1 text-sm text-gray-500">
                {{ scheme.academic_year || "No academic year" }}
                <span class="mx-1">•</span>
                {{ summary.total }} salary rate{{
                  summary.total === 1 ? "" : "s"
                }}
                <span class="mx-1">•</span>
                {{ summary.active }} active
              </p>
            </div>
          </div>

          <UButton
            color="neutral"
            variant="soft"
            icon="i-lucide-eye"
            :to="`/hr/ranking-schemes/${documentId}`"
          >
            View Scheme
          </UButton>
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
                Find salary rates by name, code, remarks, status, or type.
              </p>
            </div>
          </div>

          <span
            v-if="
              searchQuery.trim() ||
              selectedStatus !== 'all' ||
              selectedType !== 'all'
            "
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
              placeholder="Search rate name, code, remarks..."
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

          <UFormField label="Rate Type">
            <USelectMenu
              v-model="selectedType"
              :items="typeOptions"
              value-key="value"
              class="w-full"
            />
          </UFormField>
        </div>

        <div
          class="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
        >
          <p class="text-xs text-gray-500">
            {{ filteredRates.length }} result{{
              filteredRates.length === 1 ? "" : "s"
            }}
          </p>

          <UButton
            v-if="
              searchQuery.trim() ||
              selectedStatus !== 'all' ||
              selectedType !== 'all'
            "
            color="neutral"
            variant="soft"
            icon="i-lucide-filter-x"
            @click="
              searchQuery = '';
              selectedStatus = 'all';
              selectedType = 'all';
            "
          >
            Clear Filters
          </UButton>
        </div>
      </section>

      <!-- RECORDS -->
      <section
        class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
            >
              <UIcon name="i-lucide-wallet-cards" class="size-5" />
            </div>

            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
              >
                Ranking Configuration
              </p>

              <h2 class="mt-1 font-black text-gray-900 dark:text-white">
                Salary Rate Records
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Showing {{ paginatedRates.length }} of
                {{ filteredRates.length }} record{{
                  filteredRates.length === 1 ? "" : "s"
                }}.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">
              Rows per page
            </span>

            <USelectMenu
              v-model="pageSize"
              :items="pageSizeOptions"
              value-key="value"
              class="w-24"
            />
          </div>
        </div>

        <!-- EMPTY -->
        <div v-if="!filteredRates.length" class="px-6 py-16 text-center">
          <div
            class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
          >
            <UIcon name="i-lucide-wallet-cards" class="size-7" />
          </div>

          <h3 class="mt-4 font-bold text-gray-900 dark:text-white">
            No salary rates found
          </h3>

          <p class="mt-2 text-sm text-gray-500">
            {{
              searchQuery.trim() ||
              selectedStatus !== "all" ||
              selectedType !== "all"
                ? "Try adjusting your search or filters."
                : "Add your first salary rate to begin configuring compensation rates."
            }}
          </p>

          <div class="mt-5 flex flex-wrap justify-center gap-2">
            <UButton
              v-if="
                searchQuery.trim() ||
                selectedStatus !== 'all' ||
                selectedType !== 'all'
              "
              color="neutral"
              variant="soft"
              icon="i-lucide-filter-x"
              @click="
                searchQuery = '';
                selectedStatus = 'all';
                selectedType = 'all';
              "
            >
              Clear Filters
            </UButton>

            <UButton
              v-else
              icon="i-lucide-plus"
              @click="openCreateDialog"
            >
              Add Salary Rate
            </UButton>
          </div>
        </div>

        <template v-else>
          <!-- DESKTOP TABLE -->
          <div class="hidden overflow-x-auto lg:block">
            <table class="w-full min-w-[1260px] text-sm">
              <thead
                class="border-b border-gray-200 bg-slate-100/80 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600 dark:border-gray-800 dark:bg-gray-950/70 dark:text-slate-400"
              >
                <tr>
                  <th class="px-5 py-3.5 text-left">Rate</th>
                  <th class="px-4 py-3.5 text-center">Point Value</th>
                  <th class="px-4 py-3.5 text-center">Type</th>
                  <th class="px-4 py-3.5 text-center">Below Points</th>
                  <th class="px-4 py-3.5 text-right">Maximum Rate</th>
                  <th class="px-4 py-3.5 text-center">Effectivity</th>
                  <th class="px-4 py-3.5 text-center">Order</th>
                  <th class="px-4 py-3.5 text-center">Status</th>
                  <th class="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr
                  v-for="rate in paginatedRates"
                  :key="rate.documentId || rate.id"
                  class="group transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-950/10"
                >
                  <td class="px-5 py-4">
                    <div class="flex items-start gap-3">
                      <div
                        class="flex size-10 shrink-0 items-center justify-center rounded-xl"
                        :class="
                          rate.is_active
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                            : 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                        "
                      >
                        <UIcon name="i-lucide-banknote" class="size-5" />
                      </div>

                      <div class="min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                          <p class="font-bold text-gray-900 dark:text-white">
                            {{ rate.rate_name }}
                          </p>

                          <span
                            v-if="rate.is_active"
                            class="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                          >
                            Current
                          </span>
                        </div>

                        <p class="mt-1 text-xs text-gray-500">
                          {{ rate.rate_code }}
                        </p>

                        <p
                          v-if="rate.remarks"
                          class="mt-1 max-w-[320px] truncate text-[11px] text-gray-400"
                        >
                          {{ rate.remarks }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="px-4 py-4 text-center">
                    <span
                      class="inline-flex min-w-14 items-center justify-center rounded-xl bg-violet-50 px-2.5 py-1.5 text-xs font-black text-violet-700 dark:bg-violet-950/30 dark:text-violet-300"
                    >
                      {{
                        rate.point_value === null ||
                        rate.point_value === undefined
                          ? "—"
                          : points(rate.point_value)
                      }}
                    </span>
                  </td>

                  <td class="px-4 py-4 text-center">
                    <UBadge
                      :color="rate.is_below_minimum ? 'warning' : 'neutral'"
                      variant="subtle"
                    >
                      {{
                        rate.is_below_minimum
                          ? "Below Minimum"
                          : "Standard"
                      }}
                    </UBadge>
                  </td>

                  <td class="px-4 py-4 text-center">
                    {{
                      rate.below_points === null ||
                      rate.below_points === undefined
                        ? "—"
                        : points(rate.below_points)
                    }}
                  </td>

                  <td class="px-4 py-4 text-right">
                    <span
                      class="inline-flex items-center justify-center rounded-xl bg-amber-50 px-2.5 py-1.5 text-xs font-black text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                    >
                      {{ php(rate.max_rate) }}
                    </span>
                  </td>

                  <td class="px-4 py-4 text-center">
                    <p class="font-semibold text-gray-800 dark:text-gray-200">
                      {{ shortDate(rate.effective_date) }}
                    </p>

                    <p
                      v-if="rate.end_date"
                      class="mt-1 text-xs text-gray-500"
                    >
                      to {{ shortDate(rate.end_date) }}
                    </p>
                  </td>

                  <td class="px-4 py-4 text-center">
                    <span
                      class="inline-flex min-w-12 items-center justify-center rounded-xl bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                    >
                      {{ rate.sort_order }}
                    </span>
                  </td>

                  <td class="px-4 py-4 text-center">
                    <UBadge
                      :color="rate.is_active ? 'success' : 'neutral'"
                      variant="subtle"
                    >
                      {{ rate.is_active ? "Active" : "Inactive" }}
                    </UBadge>
                  </td>

                  <td class="px-5 py-4">
                    <div class="flex justify-center gap-2">
                      <UButton
                        size="xs"
                        color="neutral"
                        variant="soft"
                        icon="i-lucide-pencil"
                        @click="openEditDialog(rate)"
                      >
                        Edit
                      </UButton>

                      <UButton
                        size="xs"
                        color="error"
                        variant="soft"
                        icon="i-lucide-trash-2"
                        @click="openDeleteDialog(rate)"
                      >
                        Delete
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
              v-for="rate in paginatedRates"
              :key="rate.documentId || rate.id"
              class="rounded-[22px] border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex size-11 shrink-0 items-center justify-center rounded-2xl"
                  :class="
                    rate.is_active
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                  "
                >
                  <UIcon name="i-lucide-banknote" class="size-5" />
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="font-black text-gray-900 dark:text-white">
                      {{ rate.rate_name }}
                    </h3>

                    <UBadge
                      :color="rate.is_active ? 'success' : 'neutral'"
                      variant="subtle"
                    >
                      {{ rate.is_active ? "Active" : "Inactive" }}
                    </UBadge>
                  </div>

                  <p class="mt-1 truncate text-xs text-gray-500">
                    {{ rate.rate_code }}
                  </p>
                </div>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-2">
                <div class="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-950/30">
                  <p
                    class="text-[9px] font-bold uppercase tracking-wide text-gray-400"
                  >
                    Point Value
                  </p>

                  <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                    {{
                      rate.point_value === null ||
                      rate.point_value === undefined
                        ? "—"
                        : points(rate.point_value)
                    }}
                  </p>
                </div>

                <div class="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-950/30">
                  <p
                    class="text-[9px] font-bold uppercase tracking-wide text-gray-400"
                  >
                    Maximum Rate
                  </p>

                  <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                    {{ php(rate.max_rate) }}
                  </p>
                </div>

                <div class="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-950/30">
                  <p
                    class="text-[9px] font-bold uppercase tracking-wide text-gray-400"
                  >
                    Type
                  </p>

                  <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                    {{
                      rate.is_below_minimum
                        ? "Below Minimum"
                        : "Standard"
                    }}
                  </p>
                </div>

                <div class="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-950/30">
                  <p
                    class="text-[9px] font-bold uppercase tracking-wide text-gray-400"
                  >
                    Order
                  </p>

                  <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                    {{ rate.sort_order }}
                  </p>
                </div>
              </div>

              <div
                v-if="rate.effective_date || rate.end_date"
                class="mt-3 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5 text-xs leading-5 text-gray-500 dark:border-gray-800 dark:bg-gray-950/30"
              >
                {{ shortDate(rate.effective_date) }}
                <template v-if="rate.end_date">
                  – {{ shortDate(rate.end_date) }}
                </template>
              </div>

              <div
                class="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800"
              >
                <UButton
                  size="xs"
                  color="neutral"
                  variant="soft"
                  icon="i-lucide-pencil"
                  @click="openEditDialog(rate)"
                >
                  Edit
                </UButton>

                <UButton
                  size="xs"
                  color="error"
                  variant="soft"
                  icon="i-lucide-trash-2"
                  @click="openDeleteDialog(rate)"
                >
                  Delete
                </UButton>
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
              {{ filteredRates.length }} record{{
                filteredRates.length === 1 ? "" : "s"
              }}
            </p>

            <UPagination
              v-model:page="currentPage"
              :total="filteredRates.length"
              :items-per-page="pageSize"
              :sibling-count="1"
              show-edges
            />
          </div>
        </template>
      </section>

      <!-- CREATE DIALOG -->
      <UModal
        v-model:open="createDialogOpen"
        :ui="{
          content: 'sm:max-w-5xl overflow-hidden rounded-[30px]',
        }"
      >
        <template #content>
          <div class="flex max-h-[92vh] flex-col">
            <!-- HEADER -->
            <div
              class="shrink-0 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-6 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-start gap-3">
                  <div
                    class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  >
                    <UIcon name="i-lucide-plus" class="size-5" />
                  </div>

                  <div>
                    <p
                      class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
                    >
                      Ranking Configuration
                    </p>

                    <h2
                      class="mt-1 text-lg font-black text-gray-900 dark:text-white"
                    >
                      Create Salary Rate
                    </h2>

                    <p class="mt-1 text-xs text-gray-500">
                      Add a new compensation-rate record to {{ scheme.name }}.
                    </p>
                  </div>
                </div>

                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-x"
                  :disabled="creating"
                  @click="createDialogOpen = false"
                />
              </div>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto">
              <UForm
                :state="createForm"
                class="grid min-h-full lg:grid-cols-[300px_minmax(0,1fr)]"
                @submit="createSalaryRate"
              >
                <!-- LIVE PREVIEW -->
                <aside
                  class="border-b border-gray-200 bg-slate-950 p-6 text-white lg:border-b-0 lg:border-r dark:border-gray-800"
                >
                  <div class="lg:sticky lg:top-6">
                    <p
                      class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300"
                    >
                      Live Preview
                    </p>

                    <div
                      class="mt-4 rounded-[24px] border border-white/10 bg-white/5 p-5"
                    >
                      <div
                        class="flex size-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300"
                      >
                        <UIcon name="i-lucide-banknote" class="size-6" />
                      </div>

                      <h3 class="mt-4 text-xl font-black">
                        {{ createForm.rate_name || "New Salary Rate" }}
                      </h3>

                      <p class="mt-1 break-all text-xs text-slate-400">
                        {{ createRateCode || "rate-code" }}
                      </p>

                      <div class="mt-5 space-y-3">
                        <div class="rounded-xl bg-white/5 px-3 py-3">
                          <p
                            class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                          >
                            Point Value
                          </p>
                          <p class="mt-1 font-black">
                            {{
                              createForm.point_value === null ||
                              createForm.point_value === ""
                                ? "Not set"
                                : points(createForm.point_value)
                            }}
                          </p>
                        </div>

                        <div class="rounded-xl bg-white/5 px-3 py-3">
                          <p
                            class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                          >
                            Maximum Rate
                          </p>
                          <p class="mt-1 font-black">
                            {{ php(createForm.max_rate) }}
                          </p>
                        </div>

                        <div class="rounded-xl bg-white/5 px-3 py-3">
                          <p
                            class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                          >
                            Rate Type
                          </p>
                          <p class="mt-1 font-black">
                            {{
                              createForm.is_below_minimum
                                ? "Below Minimum"
                                : "Standard"
                            }}
                          </p>
                        </div>

                        <div class="rounded-xl bg-white/5 px-3 py-3">
                          <p
                            class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                          >
                            Sort Order
                          </p>
                          <p class="mt-1 font-black">
                            {{ createForm.sort_order }}
                          </p>
                        </div>
                      </div>

                      <div class="mt-4">
                        <UBadge
                          :color="createForm.is_active ? 'success' : 'neutral'"
                          variant="subtle"
                        >
                          {{ createForm.is_active ? "Active" : "Inactive" }}
                        </UBadge>
                      </div>
                    </div>

                    <p class="mt-4 text-xs leading-5 text-slate-400">
                      The preview updates as you complete the form.
                    </p>
                  </div>
                </aside>

                <!-- FORM -->
                <div class="space-y-6 p-6">
                  <section>
                    <div class="mb-4 flex items-center gap-3">
                      <div
                        class="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                      >
                        <UIcon name="i-lucide-id-card" class="size-4" />
                      </div>

                      <div>
                        <h3
                          class="text-sm font-black text-gray-900 dark:text-white"
                        >
                          Rate Information
                        </h3>
                        <p class="mt-0.5 text-xs text-gray-500">
                          Define the salary-rate identity and point reference.
                        </p>
                      </div>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                      <UFormField
                        label="Rate Name"
                        required
                        class="sm:col-span-2"
                      >
                        <UInput
                          v-model="createForm.rate_name"
                          placeholder="Example: Instructor Rate 1"
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField
                        label="Generated Rate Code"
                        class="sm:col-span-2"
                      >
                        <UInput
                          :model-value="createRateCode"
                          disabled
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField label="Point Value">
                        <UInput
                          v-model.number="createForm.point_value"
                          type="number"
                          min="0"
                          step="0.01"
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField label="Maximum Rate" required>
                        <UInput
                          v-model.number="createForm.max_rate"
                          type="number"
                          min="0"
                          step="0.01"
                          class="w-full"
                        />
                      </UFormField>
                    </div>
                  </section>

                  <div class="border-t border-gray-100 dark:border-gray-800" />

                  <section>
                    <div class="mb-4 flex items-center gap-3">
                      <div
                        class="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400"
                      >
                        <UIcon name="i-lucide-gauge" class="size-4" />
                      </div>

                      <div>
                        <h3
                          class="text-sm font-black text-gray-900 dark:text-white"
                        >
                          Threshold Rules
                        </h3>
                        <p class="mt-0.5 text-xs text-gray-500">
                          Configure special handling for below-minimum points.
                        </p>
                      </div>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                      <UFormField label="Below Minimum Rule">
                        <div
                          class="flex min-h-[76px] items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30"
                        >
                          <div>
                            <p
                              class="text-sm font-semibold text-gray-900 dark:text-white"
                            >
                              {{
                                createForm.is_below_minimum
                                  ? "Enabled"
                                  : "Disabled"
                              }}
                            </p>

                            <p class="mt-0.5 text-xs text-gray-500">
                              Use a special threshold below a point value.
                            </p>
                          </div>

                          <USwitch
                            v-model="createForm.is_below_minimum"
                          />
                        </div>
                      </UFormField>

                      <UFormField label="Below Points">
                        <UInput
                          v-model.number="createForm.below_points"
                          type="number"
                          min="0"
                          step="0.01"
                          :disabled="!createForm.is_below_minimum"
                          class="w-full"
                        />
                      </UFormField>
                    </div>
                  </section>

                  <div class="border-t border-gray-100 dark:border-gray-800" />

                  <section>
                    <div class="mb-4 flex items-center gap-3">
                      <div
                        class="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                      >
                        <UIcon name="i-lucide-calendar-range" class="size-4" />
                      </div>

                      <div>
                        <h3
                          class="text-sm font-black text-gray-900 dark:text-white"
                        >
                          Effectivity and Availability
                        </h3>
                        <p class="mt-0.5 text-xs text-gray-500">
                          Set the valid date range, order, and availability.
                        </p>
                      </div>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                      <UFormField label="Effective Date">
                        <UInput
                          v-model="createForm.effective_date"
                          type="date"
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField label="End Date">
                        <UInput
                          v-model="createForm.end_date"
                          type="date"
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField label="Sort Order" required>
                        <UInput
                          v-model.number="createForm.sort_order"
                          type="number"
                          min="1"
                          step="1"
                          icon="i-lucide-arrow-down-1-0"
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField label="Status">
                        <div
                          class="flex min-h-[76px] items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30"
                        >
                          <div>
                            <p
                              class="text-sm font-semibold text-gray-900 dark:text-white"
                            >
                              {{ createForm.is_active ? "Active" : "Inactive" }}
                            </p>

                            <p class="mt-0.5 text-xs text-gray-500">
                              Available for faculty salary assignment.
                            </p>
                          </div>

                          <USwitch
                            v-model="createForm.is_active"
                          />
                        </div>
                      </UFormField>

                      <UFormField
                        label="Remarks"
                        class="sm:col-span-2"
                      >
                        <UTextarea
                          v-model="createForm.remarks"
                          :rows="3"
                          placeholder="Optional notes..."
                          class="w-full"
                        />
                      </UFormField>
                    </div>
                  </section>

                  <div
                    v-if="createValidationMessage"
                    class="rounded-[18px] border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300"
                  >
                    <div class="flex items-start gap-3">
                      <UIcon
                        name="i-lucide-triangle-alert"
                        class="mt-0.5 size-4 shrink-0"
                      />
                      <span>{{ createValidationMessage }}</span>
                    </div>
                  </div>

                  <div
                    class="sticky bottom-0 -mx-6 -mb-6 flex flex-col-reverse gap-2 border-t border-gray-200 bg-white/95 px-6 py-4 backdrop-blur sm:flex-row sm:justify-end dark:border-gray-800 dark:bg-gray-900/95"
                  >
                    <UButton
                      type="button"
                      color="neutral"
                      variant="soft"
                      :disabled="creating"
                      @click="createDialogOpen = false"
                    >
                      Cancel
                    </UButton>

                    <UButton
                      type="submit"
                      icon="i-lucide-save"
                      :loading="creating"
                    >
                      Create Salary Rate
                    </UButton>
                  </div>
                </div>
              </UForm>
            </div>
          </div>
        </template>
      </UModal>

      <!-- EDIT DIALOG -->
      <UModal
        v-model:open="editDialogOpen"
        :ui="{
          content: 'sm:max-w-5xl overflow-hidden rounded-[30px]',
        }"
      >
        <template #content>
          <div class="flex max-h-[92vh] flex-col">
            <div
              class="shrink-0 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-6 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-start gap-3">
                  <div
                    class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  >
                    <UIcon name="i-lucide-pencil" class="size-5" />
                  </div>

                  <div>
                    <p
                      class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
                    >
                      Ranking Configuration
                    </p>

                    <h2
                      class="mt-1 text-lg font-black text-gray-900 dark:text-white"
                    >
                      Edit Salary Rate
                    </h2>

                    <p class="mt-1 text-xs text-gray-500">
                      Update {{ editForm.rate_name || "salary rate" }}.
                    </p>
                  </div>
                </div>

                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-x"
                  :disabled="updating"
                  @click="editDialogOpen = false"
                />
              </div>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto">
              <UForm
                :state="editForm"
                class="grid min-h-full lg:grid-cols-[300px_minmax(0,1fr)]"
                @submit="updateSalaryRate"
              >
                <!-- LIVE PREVIEW -->
                <aside
                  class="border-b border-gray-200 bg-slate-950 p-6 text-white lg:border-b-0 lg:border-r dark:border-gray-800"
                >
                  <div class="lg:sticky lg:top-6">
                    <p
                      class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300"
                    >
                      Live Preview
                    </p>

                    <div
                      class="mt-4 rounded-[24px] border border-white/10 bg-white/5 p-5"
                    >
                      <div
                        class="flex size-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300"
                      >
                        <UIcon name="i-lucide-banknote" class="size-6" />
                      </div>

                      <h3 class="mt-4 text-xl font-black">
                        {{ editForm.rate_name || "Salary Rate" }}
                      </h3>

                      <p class="mt-1 break-all text-xs text-slate-400">
                        {{ editForm.rate_code || "rate-code" }}
                      </p>

                      <div class="mt-5 space-y-3">
                        <div class="rounded-xl bg-white/5 px-3 py-3">
                          <p
                            class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                          >
                            Point Value
                          </p>
                          <p class="mt-1 font-black">
                            {{
                              editForm.point_value === null ||
                              editForm.point_value === ""
                                ? "Not set"
                                : points(editForm.point_value)
                            }}
                          </p>
                        </div>

                        <div class="rounded-xl bg-white/5 px-3 py-3">
                          <p
                            class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                          >
                            Maximum Rate
                          </p>
                          <p class="mt-1 font-black">
                            {{ php(editForm.max_rate) }}
                          </p>
                        </div>

                        <div class="rounded-xl bg-white/5 px-3 py-3">
                          <p
                            class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                          >
                            Rate Type
                          </p>
                          <p class="mt-1 font-black">
                            {{
                              editForm.is_below_minimum
                                ? "Below Minimum"
                                : "Standard"
                            }}
                          </p>
                        </div>

                        <div class="rounded-xl bg-white/5 px-3 py-3">
                          <p
                            class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                          >
                            Sort Order
                          </p>
                          <p class="mt-1 font-black">
                            {{ editForm.sort_order }}
                          </p>
                        </div>
                      </div>

                      <div class="mt-4">
                        <UBadge
                          :color="editForm.is_active ? 'success' : 'neutral'"
                          variant="subtle"
                        >
                          {{ editForm.is_active ? "Active" : "Inactive" }}
                        </UBadge>
                      </div>
                    </div>
                  </div>
                </aside>

                <!-- FORM -->
                <div class="space-y-6 p-6">
                  <section>
                    <div class="mb-4 flex items-center gap-3">
                      <div
                        class="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                      >
                        <UIcon name="i-lucide-id-card" class="size-4" />
                      </div>

                      <div>
                        <h3
                          class="text-sm font-black text-gray-900 dark:text-white"
                        >
                          Rate Information
                        </h3>
                        <p class="mt-0.5 text-xs text-gray-500">
                          Update the salary-rate identity and point reference.
                        </p>
                      </div>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                      <UFormField
                        label="Rate Name"
                        required
                        class="sm:col-span-2"
                      >
                        <UInput
                          v-model="editForm.rate_name"
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField
                        label="Rate Code"
                        class="sm:col-span-2"
                      >
                        <UInput
                          :model-value="editForm.rate_code"
                          disabled
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField label="Point Value">
                        <UInput
                          v-model.number="editForm.point_value"
                          type="number"
                          min="0"
                          step="0.01"
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField label="Maximum Rate" required>
                        <UInput
                          v-model.number="editForm.max_rate"
                          type="number"
                          min="0"
                          step="0.01"
                          class="w-full"
                        />
                      </UFormField>
                    </div>
                  </section>

                  <div class="border-t border-gray-100 dark:border-gray-800" />

                  <section>
                    <div class="mb-4 flex items-center gap-3">
                      <div
                        class="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400"
                      >
                        <UIcon name="i-lucide-gauge" class="size-4" />
                      </div>

                      <div>
                        <h3
                          class="text-sm font-black text-gray-900 dark:text-white"
                        >
                          Threshold Rules
                        </h3>
                        <p class="mt-0.5 text-xs text-gray-500">
                          Update special handling for below-minimum points.
                        </p>
                      </div>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                      <UFormField label="Below Minimum Rule">
                        <div
                          class="flex min-h-[76px] items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30"
                        >
                          <div>
                            <p
                              class="text-sm font-semibold text-gray-900 dark:text-white"
                            >
                              {{
                                editForm.is_below_minimum
                                  ? "Enabled"
                                  : "Disabled"
                              }}
                            </p>

                            <p class="mt-0.5 text-xs text-gray-500">
                              Use a special threshold below a point value.
                            </p>
                          </div>

                          <USwitch
                            v-model="editForm.is_below_minimum"
                          />
                        </div>
                      </UFormField>

                      <UFormField label="Below Points">
                        <UInput
                          v-model.number="editForm.below_points"
                          type="number"
                          min="0"
                          step="0.01"
                          :disabled="!editForm.is_below_minimum"
                          class="w-full"
                        />
                      </UFormField>
                    </div>
                  </section>

                  <div class="border-t border-gray-100 dark:border-gray-800" />

                  <section>
                    <div class="mb-4 flex items-center gap-3">
                      <div
                        class="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                      >
                        <UIcon name="i-lucide-calendar-range" class="size-4" />
                      </div>

                      <div>
                        <h3
                          class="text-sm font-black text-gray-900 dark:text-white"
                        >
                          Effectivity and Availability
                        </h3>
                        <p class="mt-0.5 text-xs text-gray-500">
                          Update the valid date range, order, and availability.
                        </p>
                      </div>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                      <UFormField label="Effective Date">
                        <UInput
                          v-model="editForm.effective_date"
                          type="date"
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField label="End Date">
                        <UInput
                          v-model="editForm.end_date"
                          type="date"
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField label="Sort Order" required>
                        <UInput
                          v-model.number="editForm.sort_order"
                          type="number"
                          min="1"
                          step="1"
                          icon="i-lucide-arrow-down-1-0"
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField label="Status">
                        <div
                          class="flex min-h-[76px] items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30"
                        >
                          <div>
                            <p
                              class="text-sm font-semibold text-gray-900 dark:text-white"
                            >
                              {{ editForm.is_active ? "Active" : "Inactive" }}
                            </p>

                            <p class="mt-0.5 text-xs text-gray-500">
                              Available for faculty salary assignment.
                            </p>
                          </div>

                          <USwitch
                            v-model="editForm.is_active"
                          />
                        </div>
                      </UFormField>

                      <UFormField
                        label="Remarks"
                        class="sm:col-span-2"
                      >
                        <UTextarea
                          v-model="editForm.remarks"
                          :rows="3"
                          class="w-full"
                        />
                      </UFormField>
                    </div>
                  </section>

                  <div
                    v-if="editValidationMessage"
                    class="rounded-[18px] border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300"
                  >
                    <div class="flex items-start gap-3">
                      <UIcon
                        name="i-lucide-triangle-alert"
                        class="mt-0.5 size-4 shrink-0"
                      />
                      <span>{{ editValidationMessage }}</span>
                    </div>
                  </div>

                  <div
                    class="sticky bottom-0 -mx-6 -mb-6 flex flex-col-reverse gap-2 border-t border-gray-200 bg-white/95 px-6 py-4 backdrop-blur sm:flex-row sm:justify-end dark:border-gray-800 dark:bg-gray-900/95"
                  >
                    <UButton
                      type="button"
                      color="neutral"
                      variant="soft"
                      :disabled="updating"
                      @click="editDialogOpen = false"
                    >
                      Cancel
                    </UButton>

                    <UButton
                      type="submit"
                      icon="i-lucide-save"
                      :loading="updating"
                    >
                      Save Changes
                    </UButton>
                  </div>
                </div>
              </UForm>
            </div>
          </div>
        </template>
      </UModal>

      <!-- DELETE DIALOG -->
      <UModal
        v-model:open="deleteDialogOpen"
        :ui="{
          content: 'sm:max-w-md overflow-hidden rounded-[28px]',
        }"
      >
        <template #content>
          <div class="p-7">
            <div
              class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30"
            >
              <UIcon name="i-lucide-trash-2" class="size-7" />
            </div>

            <div class="mt-4 text-center">
              <p
                class="text-[10px] font-bold uppercase tracking-[0.16em] text-red-500"
              >
                Destructive Action
              </p>

              <h2 class="mt-1 text-lg font-black text-gray-900 dark:text-white">
                Delete Salary Rate?
              </h2>

              <p class="mt-2 text-sm leading-6 text-gray-500">
                You are about to delete
                <span class="font-bold text-gray-800 dark:text-gray-200">
                  {{ deleteTarget?.rate_name || "this salary rate" }}
                </span>.
              </p>
            </div>

            <div
              v-if="deleteTargetHasRankings"
              class="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300"
            >
              This salary rate is already referenced by faculty ranking records
              and cannot be deleted. Set it to inactive instead.
            </div>

            <div
              v-else
              class="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs leading-5 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300"
            >
              This action cannot be undone. The salary-rate record will be
              permanently removed from this ranking scheme.
            </div>

            <div class="mt-6 flex gap-2">
              <UButton
                class="flex-1"
                color="neutral"
                variant="soft"
                :disabled="deleting"
                @click="deleteDialogOpen = false"
              >
                Cancel
              </UButton>

              <UButton
                class="flex-1"
                color="error"
                icon="i-lucide-trash-2"
                :loading="deleting"
                :disabled="deleteTargetHasRankings"
                @click="deleteSalaryRate"
              >
                Delete Salary Rate
              </UButton>
            </div>
          </div>
        </template>
      </UModal>
    </template>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  middleware: ["auth", "role"],
  role: ["HR", "Admin"],
})

const route = useRoute()
const { $api } = useNuxtApp()
const toast = useToast()

const loading = ref(false)
const loadError = ref("")

const scheme = ref<any>(null)
const rates = ref<any[]>([])

const searchQuery = ref("")
const selectedStatus = ref("all")
const selectedType = ref("all")

const currentPage = ref(1)
const pageSize = ref(10)

const createDialogOpen = ref(false)
const creating = ref(false)

const editDialogOpen = ref(false)
const updating = ref(false)
const editingRate = ref<any>(null)

const deleteDialogOpen = ref(false)
const deleting = ref(false)
const deleteTarget = ref<any>(null)

const documentId = computed(() =>
  String(route.params.documentId || "").trim(),
)

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

const typeOptions = [
  { label: "All Types", value: "all" },
  { label: "Standard", value: "standard" },
  { label: "Below Minimum", value: "below_minimum" },
]

const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]

const createForm = reactive({
  rate_name: "",
  point_value: null as any,
  is_below_minimum: false,
  below_points: null as any,
  max_rate: 0,
  effective_date: "",
  end_date: "",
  is_active: true,
  sort_order: 1,
  remarks: "",
})

const editForm = reactive({
  rate_code: "",
  rate_name: "",
  point_value: null as any,
  is_below_minimum: false,
  below_points: null as any,
  max_rate: 0,
  effective_date: "",
  end_date: "",
  is_active: true,
  sort_order: 1,
  remarks: "",
})

const slugify = (value: string) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const createRateCode = computed(() =>
  slugify(createForm.rate_name),
)

const points = (value: unknown) => {
  const parsed = Number(value ?? 0)

  if (!Number.isFinite(parsed)) {
    return "0"
  }

  return Number.isInteger(parsed)
    ? String(parsed)
    : parsed.toFixed(2).replace(/\.?0+$/, "")
}

const php = (value: unknown) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return "PHP 0.00"
  }

  return `PHP ${new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed)}`
}

const shortDate = (value: any) => {
  if (!value) {
    return "—"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const filteredRates = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return rates.value.filter((rate: any) => {
    const searchable = [
      rate.rate_name,
      rate.rate_code,
      rate.remarks,
      rate.point_value,
      rate.below_points,
      rate.max_rate,
    ]
      .filter((value) => value !== null && value !== undefined)
      .join(" ")
      .toLowerCase()

    const matchesSearch =
      !query || searchable.includes(query)

    const matchesStatus =
      selectedStatus.value === "all" ||
      (selectedStatus.value === "active" && rate.is_active) ||
      (selectedStatus.value === "inactive" && !rate.is_active)

    const matchesType =
      selectedType.value === "all" ||
      (selectedType.value === "standard" && !rate.is_below_minimum) ||
      (selectedType.value === "below_minimum" && rate.is_below_minimum)

    return matchesSearch && matchesStatus && matchesType
  })
})

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(filteredRates.value.length / pageSize.value),
  ),
)

const paginatedRates = computed(() => {
  const start =
    (currentPage.value - 1) * pageSize.value

  return filteredRates.value.slice(
    start,
    start + pageSize.value,
  )
})

const summary = computed(() => ({
  total: rates.value.length,
  active: rates.value.filter((rate: any) => rate.is_active).length,
  belowMinimum: rates.value.filter(
    (rate: any) => rate.is_below_minimum,
  ).length,
  highestRate: rates.value.length
    ? Math.max(
        ...rates.value.map((rate: any) =>
          Number(rate.max_rate || 0),
        ),
      )
    : 0,
}))

const duplicateCreateName = computed(() =>
  rates.value.some(
    (rate: any) =>
      String(rate.rate_name || "").trim().toLowerCase() ===
      createForm.rate_name.trim().toLowerCase(),
  ),
)

const duplicateCreateCode = computed(() =>
  rates.value.some(
    (rate: any) =>
      String(rate.rate_code || "").trim().toLowerCase() ===
      createRateCode.value.toLowerCase(),
  ),
)

const createValidationMessage = computed(() => {
  if (!createForm.rate_name.trim()) {
    return "Rate name is required."
  }

  if (!createRateCode.value) {
    return "A valid rate code could not be generated."
  }

  if (duplicateCreateName.value || duplicateCreateCode.value) {
    return "A salary rate with the same name or generated code already exists in this ranking scheme."
  }

  if (
    createForm.point_value !== null &&
    createForm.point_value !== "" &&
    Number(createForm.point_value) < 0
  ) {
    return "Point value cannot be negative."
  }

  if (Number(createForm.max_rate) < 0) {
    return "Maximum rate cannot be negative."
  }

  if (
    createForm.is_below_minimum &&
    (
      createForm.below_points === null ||
      createForm.below_points === "" ||
      Number(createForm.below_points) < 0
    )
  ) {
    return "Below points is required when Below Minimum Rule is enabled."
  }

  if (
    !Number.isInteger(Number(createForm.sort_order)) ||
    Number(createForm.sort_order) < 1
  ) {
    return "Sort order must be a whole number greater than or equal to 1."
  }

  if (
    createForm.effective_date &&
    createForm.end_date &&
    new Date(createForm.end_date).getTime() <
      new Date(createForm.effective_date).getTime()
  ) {
    return "End date cannot be earlier than the effective date."
  }

  return ""
})

const editValidationMessage = computed(() => {
  if (!editForm.rate_name.trim()) {
    return "Rate name is required."
  }

  const duplicate = rates.value.some(
    (rate: any) =>
      rate.documentId !== editingRate.value?.documentId &&
      (
        String(rate.rate_name || "").trim().toLowerCase() ===
          editForm.rate_name.trim().toLowerCase() ||
        String(rate.rate_code || "").trim().toLowerCase() ===
          editForm.rate_code.trim().toLowerCase()
      ),
  )

  if (duplicate) {
    return "Another salary rate with the same name or code already exists in this ranking scheme."
  }

  if (
    editForm.point_value !== null &&
    editForm.point_value !== "" &&
    Number(editForm.point_value) < 0
  ) {
    return "Point value cannot be negative."
  }

  if (Number(editForm.max_rate) < 0) {
    return "Maximum rate cannot be negative."
  }

  if (
    editForm.is_below_minimum &&
    (
      editForm.below_points === null ||
      editForm.below_points === "" ||
      Number(editForm.below_points) < 0
    )
  ) {
    return "Below points is required when Below Minimum Rule is enabled."
  }

  if (
    !Number.isInteger(Number(editForm.sort_order)) ||
    Number(editForm.sort_order) < 1
  ) {
    return "Sort order must be a whole number greater than or equal to 1."
  }

  if (
    editForm.effective_date &&
    editForm.end_date &&
    new Date(editForm.end_date).getTime() <
      new Date(editForm.effective_date).getTime()
  ) {
    return "End date cannot be earlier than the effective date."
  }

  return ""
})

const resetCreateForm = () => {
  createForm.rate_name = ""
  createForm.point_value = null
  createForm.is_below_minimum = false
  createForm.below_points = null
  createForm.max_rate = 0
  createForm.effective_date = scheme.value?.effective_date || ""
  createForm.end_date = scheme.value?.expiration_date || ""
  createForm.is_active = true
  createForm.remarks = ""

  const maxOrder = rates.value.length
    ? Math.max(
        ...rates.value.map((rate: any) =>
          Number(rate.sort_order || 0),
        ),
      )
    : 0

  createForm.sort_order = maxOrder + 1
}

const openCreateDialog = () => {
  resetCreateForm()
  createDialogOpen.value = true
}

const createSalaryRate = async () => {
  if (createValidationMessage.value) {
    toast.add({
      title: "Unable to create salary rate",
      description: createValidationMessage.value,
      color: "error",
      icon: "i-lucide-triangle-alert",
    })
    return
  }

  creating.value = true

  try {
    const response: any = await $api("/salary-rates", {
      method: "POST",
      body: {
        data: {
          rate_name: createForm.rate_name.trim(),
          rate_code: createRateCode.value,
          point_value:
            createForm.point_value === null ||
            createForm.point_value === ""
              ? null
              : Number(createForm.point_value),
          is_below_minimum: Boolean(createForm.is_below_minimum),
          below_points:
            createForm.is_below_minimum
              ? Number(createForm.below_points)
              : null,
          max_rate: Number(createForm.max_rate),
          effective_date: createForm.effective_date || null,
          end_date: createForm.end_date || null,
          is_active: Boolean(createForm.is_active),
          sort_order: Number(createForm.sort_order),
          remarks: createForm.remarks.trim() || null,
          ranking_scheme: documentId.value,
        },
      },
    })

    if (response?.data) {
      rates.value.push(response.data)
      rates.value.sort(
        (a: any, b: any) =>
          Number(a.sort_order || 0) -
          Number(b.sort_order || 0),
      )
    } else {
      await loadData()
    }

    toast.add({
      title: "Salary rate created",
      description: `${createForm.rate_name} was created successfully.`,
      color: "success",
      icon: "i-lucide-circle-check-big",
    })

    createDialogOpen.value = false
  } catch (error: any) {
    console.error("Create salary rate error:", error)

    toast.add({
      title: "Unable to create salary rate",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "The salary rate could not be created.",
      color: "error",
      icon: "i-lucide-triangle-alert",
    })
  } finally {
    creating.value = false
  }
}

const openEditDialog = (rate: any) => {
  editingRate.value = rate

  editForm.rate_code = rate.rate_code || ""
  editForm.rate_name = rate.rate_name || ""
  editForm.point_value =
    rate.point_value === null || rate.point_value === undefined
      ? null
      : Number(rate.point_value)
  editForm.is_below_minimum = Boolean(rate.is_below_minimum)
  editForm.below_points =
    rate.below_points === null || rate.below_points === undefined
      ? null
      : Number(rate.below_points)
  editForm.max_rate = Number(rate.max_rate || 0)
  editForm.effective_date = rate.effective_date || ""
  editForm.end_date = rate.end_date || ""
  editForm.is_active = Boolean(rate.is_active)
  editForm.sort_order = Number(rate.sort_order || 1)
  editForm.remarks = rate.remarks || ""

  editDialogOpen.value = true
}

const updateSalaryRate = async () => {
  if (!editingRate.value?.documentId) {
    return
  }

  if (editValidationMessage.value) {
    toast.add({
      title: "Unable to update salary rate",
      description: editValidationMessage.value,
      color: "error",
      icon: "i-lucide-triangle-alert",
    })
    return
  }

  updating.value = true

  try {
    const response: any = await $api(
      `/salary-rates/${editingRate.value.documentId}`,
      {
        method: "PUT",
        body: {
          data: {
            rate_name: editForm.rate_name.trim(),
            rate_code: editForm.rate_code.trim(),
            point_value:
              editForm.point_value === null ||
              editForm.point_value === ""
                ? null
                : Number(editForm.point_value),
            is_below_minimum: Boolean(editForm.is_below_minimum),
            below_points:
              editForm.is_below_minimum
                ? Number(editForm.below_points)
                : null,
            max_rate: Number(editForm.max_rate),
            effective_date: editForm.effective_date || null,
            end_date: editForm.end_date || null,
            is_active: Boolean(editForm.is_active),
            sort_order: Number(editForm.sort_order),
            remarks: editForm.remarks.trim() || null,
            ranking_scheme: documentId.value,
          },
        },
      },
    )

    const updated = response?.data

    if (updated) {
      const index = rates.value.findIndex(
        (rate: any) =>
          rate.documentId === editingRate.value.documentId,
      )

      if (index !== -1) {
        rates.value[index] = updated
      }

      rates.value.sort(
        (a: any, b: any) =>
          Number(a.sort_order || 0) -
          Number(b.sort_order || 0),
      )
    } else {
      await loadData()
    }

    toast.add({
      title: "Salary rate updated",
      description: `${editForm.rate_name} was updated successfully.`,
      color: "success",
      icon: "i-lucide-circle-check-big",
    })

    editDialogOpen.value = false
    editingRate.value = null
  } catch (error: any) {
    console.error("Update salary rate error:", error)

    toast.add({
      title: "Unable to update salary rate",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "The salary rate could not be updated.",
      color: "error",
      icon: "i-lucide-triangle-alert",
    })
  } finally {
    updating.value = false
  }
}

const deleteTargetHasRankings = computed(() =>
  Boolean(deleteTarget.value?.faculty_rankings?.length),
)

const openDeleteDialog = (rate: any) => {
  deleteTarget.value = rate
  deleteDialogOpen.value = true
}

const deleteSalaryRate = async () => {
  if (
    !deleteTarget.value?.documentId ||
    deleteTargetHasRankings.value
  ) {
    return
  }

  deleting.value = true

  try {
    await $api(
      `/salary-rates/${deleteTarget.value.documentId}`,
      {
        method: "DELETE",
      },
    )

    rates.value = rates.value.filter(
      (rate: any) =>
        rate.documentId !== deleteTarget.value.documentId,
    )

    toast.add({
      title: "Salary rate deleted",
      description: `${deleteTarget.value.rate_name} was deleted successfully.`,
      color: "success",
      icon: "i-lucide-circle-check-big",
    })

    deleteDialogOpen.value = false
    deleteTarget.value = null
  } catch (error: any) {
    console.error("Delete salary rate error:", error)

    toast.add({
      title: "Unable to delete salary rate",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "The salary rate could not be deleted.",
      color: "error",
      icon: "i-lucide-triangle-alert",
    })
  } finally {
    deleting.value = false
  }
}

const loadData = async () => {
  if (!documentId.value) {
    loadError.value =
      "Ranking scheme document ID is missing."
    return
  }

  loading.value = true
  loadError.value = ""

  try {
    const [
      schemeResponse,
      ratesResponse,
    ]: any[] = await Promise.all([
      $api(
        `/ranking-schemes/${documentId.value}`,
      ),

      $api("/salary-rates", {
        query: {
          "filters[ranking_scheme][documentId][$eq]":
            documentId.value,
          "populate[ranking_scheme]": true,
          "populate[faculty_rankings]": true,
          "sort[0]": "sort_order:asc",
          "pagination[page]": 1,
          "pagination[pageSize]": 1000,
        },
      }),
    ])

    scheme.value =
      schemeResponse?.data || null

    rates.value =
      ratesResponse?.data || []

    if (!scheme.value) {
      loadError.value =
        "Ranking scheme was not found."
    }
  } catch (error: any) {
    console.error(
      "Salary rate loading error:",
      error,
    )

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to load salary rates."
  } finally {
    loading.value = false
  }
}

watch(
  [
    searchQuery,
    selectedStatus,
    selectedType,
    pageSize,
  ],
  () => {
    currentPage.value = 1
  },
)

watch(
  () => createForm.is_below_minimum,
  (enabled) => {
    if (!enabled) {
      createForm.below_points = null
    }
  },
)

watch(
  () => editForm.is_below_minimum,
  (enabled) => {
    if (!enabled) {
      editForm.below_points = null
    }
  },
)

watch(
  totalPages,
  (pages) => {
    if (currentPage.value > pages) {
      currentPage.value = pages
    }
  },
)

onMounted(loadData)
</script>
