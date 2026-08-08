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
              class="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-100"
            >
              {{ scheme?.academic_year || "Current" }}
            </span>
          </div>

          <h1 class="mt-4 text-3xl font-black tracking-tight sm:text-[36px]">
            Rank Bands
          </h1>

          <p class="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
            Manage rank levels, point thresholds, qualification requirements,
            salary boundaries, sequence, and availability for this ranking
            scheme.
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
            Add Rank Band
          </UButton>
        </div>
      </div>
    </section>

    <!-- SUMMARY HEADER -->
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
            Rank Band Summary
          </h2>
        </div>

        <p class="text-xs text-gray-500">
          Overview of all rank-band records under this scheme.
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
                Total Bands
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
                Available for ranking
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
                Highest Points
              </p>
              <p
                class="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white"
              >
                {{ summary.highestPoints }}
              </p>
              <p class="mt-1.5 text-[11px] leading-4 text-gray-400">
                Maximum configured score
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
                Maximum salary boundary
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
      v-if="scheme && !loading"
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
              {{ summary.total }} rank band{{
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
              Find rank bands by name, level, requirement, or status.
            </p>
          </div>
        </div>

        <span
          v-if="searchQuery.trim() || selectedStatus !== 'all'"
          class="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
        >
          Filters Active
        </span>
      </div>

      <div class="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        <UFormField label="Search">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search rank name, level, requirement..."
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
      </div>

      <div
        class="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <p class="text-xs text-gray-500">
          {{ filteredBands.length }} result{{
            filteredBands.length === 1 ? "" : "s"
          }}
        </p>

        <UButton
          v-if="searchQuery.trim() || selectedStatus !== 'all'"
          color="neutral"
          variant="soft"
          icon="i-lucide-filter-x"
          @click="
            searchQuery = '';
            selectedStatus = 'all';
          "
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
            Unable to load rank bands
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
              Rank Band Records
            </h2>

            <p class="mt-1 text-xs text-gray-500">
              Showing {{ paginatedBands.length }} of
              {{ filteredBands.length }} record{{
                filteredBands.length === 1 ? "" : "s"
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

      <!-- EMPTY -->
      <div v-if="!filteredBands.length" class="px-6 py-16 text-center">
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
        >
          <UIcon name="i-lucide-trophy" class="size-7" />
        </div>

        <h3 class="mt-4 font-bold text-gray-900 dark:text-white">
          No rank bands found
        </h3>

        <p class="mt-2 text-sm text-gray-500">
          {{
            searchQuery.trim() || selectedStatus !== "all"
              ? "Try adjusting your search or filters."
              : "Add your first rank band to begin configuring the rank scale."
          }}
        </p>

        <div class="mt-5 flex flex-wrap justify-center gap-2">
          <UButton
            v-if="searchQuery.trim() || selectedStatus !== 'all'"
            color="neutral"
            variant="soft"
            icon="i-lucide-filter-x"
            @click="
              searchQuery = '';
              selectedStatus = 'all';
            "
          >
            Clear Filters
          </UButton>

          <UButton
            v-else
            icon="i-lucide-plus"
            @click="openCreateDialog"
          >
            Add Rank Band
          </UButton>
        </div>
      </div>

      <template v-else>
        <!-- DESKTOP TABLE -->
        <div class="hidden overflow-x-auto lg:block">
          <table class="w-full min-w-[1220px] text-sm">
            <thead
              class="border-b border-gray-200 bg-slate-100/80 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600 dark:border-gray-800 dark:bg-gray-950/70 dark:text-slate-400"
            >
              <tr>
                <th class="px-5 py-3.5 text-left">Rank</th>
                <th class="px-4 py-3.5 text-center">Level</th>
                <th class="px-4 py-3.5 text-left">Educational Requirement</th>
                <th class="px-4 py-3.5 text-center">Point Range</th>
                <th class="px-4 py-3.5 text-center">Rate Range</th>
                <th class="px-4 py-3.5 text-center">Sequence</th>
                <th class="px-4 py-3.5 text-center">Status</th>
                <th class="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="band in paginatedBands"
                :key="band.documentId || band.id"
                class="group transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-950/10"
              >
                <td class="px-5 py-4">
                  <div class="flex items-start gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-xl"
                      :class="
                        band.is_active
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                      "
                    >
                      <UIcon
                        :name="
                          band.is_active
                            ? 'i-lucide-award'
                            : 'i-lucide-trophy'
                        "
                        class="size-5"
                      />
                    </div>

                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <p class="font-bold text-gray-900 dark:text-white">
                          {{ formatRankName(band.rank_name) }}
                        </p>

                        <span
                          v-if="band.is_active"
                          class="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                        >
                          Current
                        </span>
                      </div>

                      <p class="mt-1 text-xs text-gray-500">
                        Rank Level {{ band.rank_level }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-4 text-center">
                  <span
                    class="inline-flex min-w-12 items-center justify-center rounded-xl bg-gray-100 px-2.5 py-1.5 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {{ band.rank_level }}
                  </span>
                </td>

                <td class="max-w-[350px] px-4 py-4">
                  <p
                    class="line-clamp-2 text-xs leading-5 text-gray-600 dark:text-gray-300"
                  >
                    {{ band.educational_requirement || "Not specified" }}
                  </p>
                </td>

                <td class="px-4 py-4 text-center">
                  <span
                    class="inline-flex min-w-24 items-center justify-center rounded-xl bg-violet-50 px-2.5 py-1.5 text-xs font-black text-violet-700 dark:bg-violet-950/30 dark:text-violet-300"
                  >
                    {{ points(band.minimum_points) }} –
                    {{ points(band.maximum_points) }}
                  </span>
                </td>

                <td class="px-4 py-4 text-center">
                  <span
                    class="inline-flex items-center justify-center rounded-xl bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                  >
                    {{ php(band.minimum_rate) }} –
                    {{ php(band.maximum_rate) }}
                  </span>
                </td>

                <td class="px-4 py-4 text-center">
                  <span
                    class="inline-flex min-w-12 items-center justify-center rounded-xl bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                  >
                    {{ band.sequence }}
                  </span>
                </td>

                <td class="px-4 py-4 text-center">
                  <UBadge
                    :color="band.is_active ? 'success' : 'neutral'"
                    variant="subtle"
                  >
                    {{ band.is_active ? "Active" : "Inactive" }}
                  </UBadge>
                </td>

                <td class="px-5 py-4">
                  <div class="flex justify-center gap-2">
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="soft"
                      icon="i-lucide-pencil"
                      @click="openEditDialog(band)"
                    >
                      Edit
                    </UButton>

                    <UButton
                      size="xs"
                      color="error"
                      variant="soft"
                      icon="i-lucide-trash-2"
                      @click="openDeleteDialog(band)"
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
            v-for="band in paginatedBands"
            :key="band.documentId || band.id"
            class="rounded-[22px] border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex size-11 shrink-0 items-center justify-center rounded-2xl"
                :class="
                  band.is_active
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                    : 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                "
              >
                <UIcon name="i-lucide-award" class="size-5" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-black text-gray-900 dark:text-white">
                    {{ formatRankName(band.rank_name) }}
                  </h3>

                  <UBadge
                    :color="band.is_active ? 'success' : 'neutral'"
                    variant="subtle"
                  >
                    {{ band.is_active ? "Active" : "Inactive" }}
                  </UBadge>
                </div>

                <p class="mt-1 text-xs text-gray-500">
                  Rank Level {{ band.rank_level }}
                </p>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-2">
              <div class="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-950/30">
                <p class="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                  Point Range
                </p>
                <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                  {{ points(band.minimum_points) }} –
                  {{ points(band.maximum_points) }}
                </p>
              </div>

              <div class="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-950/30">
                <p class="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                  Sequence
                </p>
                <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                  {{ band.sequence }}
                </p>
              </div>

              <div
                class="col-span-2 rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-950/30"
              >
                <p class="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                  Rate Range
                </p>
                <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                  {{ php(band.minimum_rate) }} –
                  {{ php(band.maximum_rate) }}
                </p>
              </div>
            </div>

            <div
              v-if="band.educational_requirement"
              class="mt-3 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5 text-xs leading-5 text-gray-500 dark:border-gray-800 dark:bg-gray-950/30"
            >
              {{ band.educational_requirement }}
            </div>

            <div
              class="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800"
            >
              <UButton
                size="xs"
                color="neutral"
                variant="soft"
                icon="i-lucide-pencil"
                @click="openEditDialog(band)"
              >
                Edit
              </UButton>

              <UButton
                size="xs"
                color="error"
                variant="soft"
                icon="i-lucide-trash-2"
                @click="openDeleteDialog(band)"
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
            {{ filteredBands.length }} record{{
              filteredBands.length === 1 ? "" : "s"
            }}
          </p>

          <UPagination
            v-model:page="currentPage"
            :total="filteredBands.length"
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

                  <h2 class="mt-1 text-lg font-black text-gray-900 dark:text-white">
                    Create Rank Band
                  </h2>

                  <p class="mt-1 text-xs text-gray-500">
                    Add a new level to {{ scheme.name }}.
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
              class="grid min-h-full lg:grid-cols-[280px_minmax(0,1fr)]"
              @submit="createRankBand"
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
                      class="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300"
                    >
                      <UIcon name="i-lucide-award" class="size-6" />
                    </div>

                    <h3 class="mt-4 text-xl font-black">
                      {{ createRankPreview }}
                    </h3>

                    <p class="mt-1 text-xs text-slate-400">
                      {{ scheme.academic_year }}
                    </p>

                    <div class="mt-5 space-y-3">
                      <div class="rounded-xl bg-white/5 px-3 py-3">
                        <p
                          class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                        >
                          Point Range
                        </p>
                        <p class="mt-1 font-black">
                          {{ points(createForm.minimum_points) }} –
                          {{ points(createForm.maximum_points) }}
                        </p>
                      </div>

                      <div class="rounded-xl bg-white/5 px-3 py-3">
                        <p
                          class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                        >
                          Salary Range
                        </p>
                        <p class="mt-1 text-sm font-black">
                          {{ php(createForm.minimum_rate) }} –
                          {{ php(createForm.maximum_rate) }}
                        </p>
                      </div>

                      <div class="rounded-xl bg-white/5 px-3 py-3">
                        <p
                          class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                        >
                          Sequence
                        </p>
                        <p class="mt-1 font-black">
                          {{ createForm.sequence }}
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
                      <h3 class="text-sm font-black text-gray-900 dark:text-white">
                        Rank Information
                      </h3>
                      <p class="mt-0.5 text-xs text-gray-500">
                        Define rank identity and educational requirement.
                      </p>
                    </div>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField label="Rank Name" required>
                      <USelectMenu
                        v-model="createForm.rank_name"
                        :items="rankNameOptions"
                        value-key="value"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Rank Level" required>
                      <UInput
                        v-model.number="createForm.rank_level"
                        type="number"
                        min="1"
                        step="1"
                        icon="i-lucide-list-ordered"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField
                      label="Educational Requirement"
                      class="sm:col-span-2"
                    >
                      <UTextarea
                        v-model="createForm.educational_requirement"
                        :rows="3"
                        placeholder="Optional educational requirement..."
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
                      <h3 class="text-sm font-black text-gray-900 dark:text-white">
                        Point and Salary Ranges
                      </h3>
                      <p class="mt-0.5 text-xs text-gray-500">
                        Set qualification points and salary boundaries.
                      </p>
                    </div>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField label="Minimum Points" required>
                      <UInput
                        v-model.number="createForm.minimum_points"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Maximum Points" required>
                      <UInput
                        v-model.number="createForm.maximum_points"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Minimum Rate" required>
                      <UInput
                        v-model.number="createForm.minimum_rate"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Maximum Rate" required>
                      <UInput
                        v-model.number="createForm.maximum_rate"
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
                      class="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                    >
                      <UIcon name="i-lucide-settings-2" class="size-4" />
                    </div>

                    <div>
                      <h3 class="text-sm font-black text-gray-900 dark:text-white">
                        Sequence and Availability
                      </h3>
                      <p class="mt-0.5 text-xs text-gray-500">
                        Control order and whether this band can be used.
                      </p>
                    </div>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField label="Sequence" required>
                      <UInput
                        v-model.number="createForm.sequence"
                        type="number"
                        min="1"
                        step="1"
                        icon="i-lucide-arrow-down-1-0"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Status">
                      <div
                        class="flex min-h-[72px] items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30"
                      >
                        <div>
                          <p class="text-sm font-semibold text-gray-900 dark:text-white">
                            {{ createForm.is_active ? "Active" : "Inactive" }}
                          </p>
                          <p class="mt-0.5 text-xs text-gray-500">
                            Available for automatic rank assignment.
                          </p>
                        </div>

                        <USwitch v-model="createForm.is_active" />
                      </div>
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
                    Create Rank Band
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

                  <h2 class="mt-1 text-lg font-black text-gray-900 dark:text-white">
                    Edit Rank Band
                  </h2>

                  <p class="mt-1 text-xs text-gray-500">
                    Update {{ editRankPreview }}.
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
              class="grid min-h-full lg:grid-cols-[280px_minmax(0,1fr)]"
              @submit="updateRankBand"
            >
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
                      <UIcon name="i-lucide-award" class="size-6" />
                    </div>

                    <h3 class="mt-4 text-xl font-black">
                      {{ editRankPreview }}
                    </h3>

                    <p class="mt-1 text-xs text-slate-400">
                      {{ scheme.academic_year }}
                    </p>

                    <div class="mt-5 space-y-3">
                      <div class="rounded-xl bg-white/5 px-3 py-3">
                        <p
                          class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                        >
                          Point Range
                        </p>
                        <p class="mt-1 font-black">
                          {{ points(editForm.minimum_points) }} –
                          {{ points(editForm.maximum_points) }}
                        </p>
                      </div>

                      <div class="rounded-xl bg-white/5 px-3 py-3">
                        <p
                          class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                        >
                          Salary Range
                        </p>
                        <p class="mt-1 text-sm font-black">
                          {{ php(editForm.minimum_rate) }} –
                          {{ php(editForm.maximum_rate) }}
                        </p>
                      </div>

                      <div class="rounded-xl bg-white/5 px-3 py-3">
                        <p
                          class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                        >
                          Sequence
                        </p>
                        <p class="mt-1 font-black">
                          {{ editForm.sequence }}
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

              <div class="space-y-6 p-6">
                <section>
                  <div class="mb-4 flex items-center gap-3">
                    <div
                      class="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                    >
                      <UIcon name="i-lucide-id-card" class="size-4" />
                    </div>

                    <div>
                      <h3 class="text-sm font-black text-gray-900 dark:text-white">
                        Rank Information
                      </h3>
                      <p class="mt-0.5 text-xs text-gray-500">
                        Update rank identity and qualification requirements.
                      </p>
                    </div>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField label="Rank Name" required>
                      <USelectMenu
                        v-model="editForm.rank_name"
                        :items="rankNameOptions"
                        value-key="value"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Rank Level" required>
                      <UInput
                        v-model.number="editForm.rank_level"
                        type="number"
                        min="1"
                        step="1"
                        icon="i-lucide-list-ordered"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField
                      label="Educational Requirement"
                      class="sm:col-span-2"
                    >
                      <UTextarea
                        v-model="editForm.educational_requirement"
                        :rows="3"
                        placeholder="Optional educational requirement..."
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
                      <h3 class="text-sm font-black text-gray-900 dark:text-white">
                        Point and Salary Ranges
                      </h3>
                      <p class="mt-0.5 text-xs text-gray-500">
                        Update qualification points and salary boundaries.
                      </p>
                    </div>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField label="Minimum Points" required>
                      <UInput
                        v-model.number="editForm.minimum_points"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Maximum Points" required>
                      <UInput
                        v-model.number="editForm.maximum_points"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Minimum Rate" required>
                      <UInput
                        v-model.number="editForm.minimum_rate"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Maximum Rate" required>
                      <UInput
                        v-model.number="editForm.maximum_rate"
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
                      class="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                    >
                      <UIcon name="i-lucide-settings-2" class="size-4" />
                    </div>

                    <div>
                      <h3 class="text-sm font-black text-gray-900 dark:text-white">
                        Sequence and Availability
                      </h3>
                      <p class="mt-0.5 text-xs text-gray-500">
                        Control order and whether this band can be used.
                      </p>
                    </div>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField label="Sequence" required>
                      <UInput
                        v-model.number="editForm.sequence"
                        type="number"
                        min="1"
                        step="1"
                        icon="i-lucide-arrow-down-1-0"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Status">
                      <div
                        class="flex min-h-[72px] items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30"
                      >
                        <div>
                          <p class="text-sm font-semibold text-gray-900 dark:text-white">
                            {{ editForm.is_active ? "Active" : "Inactive" }}
                          </p>
                          <p class="mt-0.5 text-xs text-gray-500">
                            Available for automatic rank assignment.
                          </p>
                        </div>

                        <USwitch v-model="editForm.is_active" />
                      </div>
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

    <!-- DELETE CONFIRMATION -->
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
              Delete Rank Band?
            </h2>

            <p class="mt-2 text-sm leading-6 text-gray-500">
              You are about to delete
              <span class="font-bold text-gray-800 dark:text-gray-200">
                {{ deleteTargetLabel }}
              </span>.
            </p>
          </div>

          <div
            v-if="deleteTargetHasRankings"
            class="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300"
          >
            This rank band is already referenced by faculty ranking records and
            cannot be deleted. Set it to inactive instead.
          </div>

          <div
            v-else
            class="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs leading-5 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300"
          >
            This action cannot be undone. The rank band will be permanently
            removed from this ranking scheme.
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
              @click="deleteRankBand"
            >
              Delete Rank Band
            </UButton>
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
  role: ["HR", "Admin"],
})

const route = useRoute()
const { $api } = useNuxtApp()
const toast = useToast()

const loading = ref(false)
const loadError = ref("")

const scheme = ref<any>(null)
const bands = ref<any[]>([])

const searchQuery = ref("")
const selectedStatus = ref("all")

const currentPage = ref(1)
const pageSize = ref(10)

const createDialogOpen = ref(false)
const creating = ref(false)

const editDialogOpen = ref(false)
const updating = ref(false)
const editingBand = ref<any>(null)

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

const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]

const rankNameOptions = [
  { label: "Instructor", value: "instructor" },
  { label: "Assistant Professor", value: "assistant_professor" },
  { label: "Associate Professor", value: "associate_professor" },
  { label: "Professor", value: "professor" },
]

const createForm = reactive({
  rank_name: "instructor",
  rank_level: 1,
  educational_requirement: "",
  minimum_points: 0,
  maximum_points: 0,
  minimum_rate: 0,
  maximum_rate: 0,
  sequence: 1,
  is_active: true,
})

const editForm = reactive({
  rank_name: "instructor",
  rank_level: 1,
  educational_requirement: "",
  minimum_points: 0,
  maximum_points: 0,
  minimum_rate: 0,
  maximum_rate: 0,
  sequence: 1,
  is_active: true,
})

const formatRankName = (value: string) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())

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

const filteredBands = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return bands.value.filter((band: any) => {
    const searchable = [
      formatRankName(band.rank_name),
      band.rank_level,
      band.educational_requirement,
      band.minimum_points,
      band.maximum_points,
    ]
      .filter((value) => value !== null && value !== undefined)
      .join(" ")
      .toLowerCase()

    const matchesSearch =
      !query || searchable.includes(query)

    const matchesStatus =
      selectedStatus.value === "all" ||
      (selectedStatus.value === "active" && band.is_active) ||
      (selectedStatus.value === "inactive" && !band.is_active)

    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(filteredBands.value.length / pageSize.value),
  ),
)

const paginatedBands = computed(() => {
  const start =
    (currentPage.value - 1) * pageSize.value

  return filteredBands.value.slice(
    start,
    start + pageSize.value,
  )
})

const summary = computed(() => {
  const highestPoints = bands.value.length
    ? Math.max(
        ...bands.value.map((band: any) =>
          Number(band.maximum_points || 0),
        ),
      )
    : 0

  const highestRate = bands.value.length
    ? Math.max(
        ...bands.value.map((band: any) =>
          Number(band.maximum_rate || 0),
        ),
      )
    : 0

  return {
    total: bands.value.length,
    active: bands.value.filter((band: any) => band.is_active).length,
    highestPoints,
    highestRate,
  }
})

const createRankPreview = computed(() =>
  `${formatRankName(createForm.rank_name)} ${Number(
    createForm.rank_level || 1,
  )}`,
)

const createPointRangeValid = computed(() => {
  const min = Number(createForm.minimum_points)
  const max = Number(createForm.maximum_points)

  return (
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    min >= 0 &&
    max >= 0 &&
    min <= max
  )
})

const createRateRangeValid = computed(() => {
  const min = Number(createForm.minimum_rate)
  const max = Number(createForm.maximum_rate)

  return (
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    min >= 0 &&
    max >= 0 &&
    min <= max
  )
})

const duplicateRankExists = computed(() =>
  bands.value.some(
    (band: any) =>
      band.rank_name === createForm.rank_name &&
      Number(band.rank_level) === Number(createForm.rank_level),
  ),
)

const overlappingPointBand = computed(() => {
  if (!createForm.is_active) {
    return null
  }

  const newMin = Number(createForm.minimum_points)
  const newMax = Number(createForm.maximum_points)

  if (!Number.isFinite(newMin) || !Number.isFinite(newMax)) {
    return null
  }

  return (
    bands.value.find((band: any) => {
      if (!band.is_active) {
        return false
      }

      const existingMin = Number(band.minimum_points)
      const existingMax = Number(band.maximum_points)

      if (
        !Number.isFinite(existingMin) ||
        !Number.isFinite(existingMax)
      ) {
        return false
      }

      return newMin <= existingMax && newMax >= existingMin
    }) || null
  )
})

const createValidationMessage = computed(() => {
  if (!createForm.rank_name) {
    return "Rank name is required."
  }

  if (
    !Number.isInteger(Number(createForm.rank_level)) ||
    Number(createForm.rank_level) < 1
  ) {
    return "Rank level must be a whole number greater than or equal to 1."
  }

  if (!createPointRangeValid.value) {
    return "Minimum points must be less than or equal to maximum points."
  }

  if (!createRateRangeValid.value) {
    return "Minimum rate must be less than or equal to maximum rate."
  }

  if (
    !Number.isInteger(Number(createForm.sequence)) ||
    Number(createForm.sequence) < 1
  ) {
    return "Sequence must be a whole number greater than or equal to 1."
  }

  if (duplicateRankExists.value) {
    return `${createRankPreview.value} already exists in this ranking scheme.`
  }

  if (overlappingPointBand.value) {
    const band = overlappingPointBand.value

    return `The point range overlaps with ${formatRankName(
      band.rank_name,
    )} ${band.rank_level} (${points(
      band.minimum_points,
    )}–${points(band.maximum_points)}).`
  }

  return ""
})

const editRankPreview = computed(() =>
  `${formatRankName(editForm.rank_name)} ${Number(
    editForm.rank_level || 1,
  )}`,
)

const editPointRangeValid = computed(() => {
  const min = Number(editForm.minimum_points)
  const max = Number(editForm.maximum_points)

  return (
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    min >= 0 &&
    max >= 0 &&
    min <= max
  )
})

const editRateRangeValid = computed(() => {
  const min = Number(editForm.minimum_rate)
  const max = Number(editForm.maximum_rate)

  return (
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    min >= 0 &&
    max >= 0 &&
    min <= max
  )
})

const editDuplicateRankExists = computed(() =>
  bands.value.some(
    (band: any) =>
      band.documentId !== editingBand.value?.documentId &&
      band.rank_name === editForm.rank_name &&
      Number(band.rank_level) === Number(editForm.rank_level),
  ),
)

const editOverlappingPointBand = computed(() => {
  if (!editForm.is_active) {
    return null
  }

  const newMin = Number(editForm.minimum_points)
  const newMax = Number(editForm.maximum_points)

  if (!Number.isFinite(newMin) || !Number.isFinite(newMax)) {
    return null
  }

  return (
    bands.value.find((band: any) => {
      if (
        band.documentId === editingBand.value?.documentId ||
        !band.is_active
      ) {
        return false
      }

      const existingMin = Number(band.minimum_points)
      const existingMax = Number(band.maximum_points)

      if (
        !Number.isFinite(existingMin) ||
        !Number.isFinite(existingMax)
      ) {
        return false
      }

      return newMin <= existingMax && newMax >= existingMin
    }) || null
  )
})

const editValidationMessage = computed(() => {
  if (!editForm.rank_name) {
    return "Rank name is required."
  }

  if (
    !Number.isInteger(Number(editForm.rank_level)) ||
    Number(editForm.rank_level) < 1
  ) {
    return "Rank level must be a whole number greater than or equal to 1."
  }

  if (!editPointRangeValid.value) {
    return "Minimum points must be less than or equal to maximum points."
  }

  if (!editRateRangeValid.value) {
    return "Minimum rate must be less than or equal to maximum rate."
  }

  if (
    !Number.isInteger(Number(editForm.sequence)) ||
    Number(editForm.sequence) < 1
  ) {
    return "Sequence must be a whole number greater than or equal to 1."
  }

  if (editDuplicateRankExists.value) {
    return `${editRankPreview.value} already exists in this ranking scheme.`
  }

  if (editOverlappingPointBand.value) {
    const band = editOverlappingPointBand.value

    return `The point range overlaps with ${formatRankName(
      band.rank_name,
    )} ${band.rank_level} (${points(
      band.minimum_points,
    )}–${points(band.maximum_points)}).`
  }

  return ""
})

const openEditDialog = (band: any) => {
  editingBand.value = band

  editForm.rank_name = band.rank_name || "instructor"
  editForm.rank_level = Number(band.rank_level || 1)
  editForm.educational_requirement =
    band.educational_requirement || ""
  editForm.minimum_points = Number(band.minimum_points || 0)
  editForm.maximum_points = Number(band.maximum_points || 0)
  editForm.minimum_rate = Number(band.minimum_rate || 0)
  editForm.maximum_rate = Number(band.maximum_rate || 0)
  editForm.sequence = Number(band.sequence || 1)
  editForm.is_active = Boolean(band.is_active)

  editDialogOpen.value = true
}

const updateRankBand = async () => {
  if (!editingBand.value?.documentId) {
    return
  }

  if (editValidationMessage.value) {
    toast.add({
      title: "Unable to update rank band",
      description: editValidationMessage.value,
      color: "error",
      icon: "i-lucide-triangle-alert",
    })
    return
  }

  updating.value = true

  try {
    const response: any = await $api(
      `/rank-bands/${editingBand.value.documentId}`,
      {
        method: "PUT",
        body: {
          data: {
            rank_name: editForm.rank_name,
            rank_level: Number(editForm.rank_level),
            educational_requirement:
              editForm.educational_requirement.trim() || null,
            minimum_points: Number(editForm.minimum_points),
            maximum_points: Number(editForm.maximum_points),
            minimum_rate: Number(editForm.minimum_rate),
            maximum_rate: Number(editForm.maximum_rate),
            sequence: Number(editForm.sequence),
            is_active: Boolean(editForm.is_active),
            ranking_scheme: documentId.value,
          },
        },
      },
    )

    const updated = response?.data

    if (updated) {
      const index = bands.value.findIndex(
        (band: any) =>
          band.documentId === editingBand.value.documentId,
      )

      if (index !== -1) {
        bands.value[index] = updated
      }

      bands.value.sort(
        (a: any, b: any) =>
          Number(a.sequence || 0) - Number(b.sequence || 0),
      )
    } else {
      await loadData()
    }

    toast.add({
      title: "Rank band updated",
      description: `${editRankPreview.value} was updated successfully.`,
      color: "success",
      icon: "i-lucide-circle-check-big",
    })

    editDialogOpen.value = false
    editingBand.value = null
  } catch (error: any) {
    console.error("Update rank band error:", error)

    toast.add({
      title: "Unable to update rank band",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "The rank band could not be updated.",
      color: "error",
      icon: "i-lucide-triangle-alert",
    })
  } finally {
    updating.value = false
  }
}

const deleteTargetLabel = computed(() => {
  if (!deleteTarget.value) {
    return "this rank band"
  }

  return `${formatRankName(deleteTarget.value.rank_name)} ${
    deleteTarget.value.rank_level || ""
  }`.trim()
})

const deleteTargetHasRankings = computed(() =>
  Boolean(deleteTarget.value?.faculty_rankings?.length),
)

const openDeleteDialog = (band: any) => {
  deleteTarget.value = band
  deleteDialogOpen.value = true
}

const deleteRankBand = async () => {
  if (
    !deleteTarget.value?.documentId ||
    deleteTargetHasRankings.value
  ) {
    return
  }

  deleting.value = true

  try {
    await $api(`/rank-bands/${deleteTarget.value.documentId}`, {
      method: "DELETE",
    })

    bands.value = bands.value.filter(
      (band: any) =>
        band.documentId !== deleteTarget.value.documentId,
    )

    toast.add({
      title: "Rank band deleted",
      description: `${deleteTargetLabel.value} was deleted successfully.`,
      color: "success",
      icon: "i-lucide-circle-check-big",
    })

    deleteDialogOpen.value = false
    deleteTarget.value = null
  } catch (error: any) {
    console.error("Delete rank band error:", error)

    toast.add({
      title: "Unable to delete rank band",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "The rank band could not be deleted.",
      color: "error",
      icon: "i-lucide-triangle-alert",
    })
  } finally {
    deleting.value = false
  }
}

const resetCreateForm = () => {
  createForm.rank_name = "instructor"
  createForm.rank_level = 1
  createForm.educational_requirement = ""
  createForm.minimum_points = 0
  createForm.maximum_points = 0
  createForm.minimum_rate = 0
  createForm.maximum_rate = 0
  createForm.is_active = true

  const maxSequence = bands.value.length
    ? Math.max(
        ...bands.value.map((band: any) =>
          Number(band.sequence || 0),
        ),
      )
    : 0

  createForm.sequence = maxSequence + 1
}

const openCreateDialog = () => {
  resetCreateForm()
  createDialogOpen.value = true
}

const createRankBand = async () => {
  if (createValidationMessage.value) {
    toast.add({
      title: "Unable to create rank band",
      description: createValidationMessage.value,
      color: "error",
      icon: "i-lucide-triangle-alert",
    })
    return
  }

  creating.value = true

  try {
    const response: any = await $api("/rank-bands", {
      method: "POST",
      body: {
        data: {
          rank_name: createForm.rank_name,
          rank_level: Number(createForm.rank_level),
          educational_requirement:
            createForm.educational_requirement.trim() || null,
          minimum_points: Number(createForm.minimum_points),
          maximum_points: Number(createForm.maximum_points),
          minimum_rate: Number(createForm.minimum_rate),
          maximum_rate: Number(createForm.maximum_rate),
          sequence: Number(createForm.sequence),
          is_active: Boolean(createForm.is_active),
          ranking_scheme: documentId.value,
        },
      },
    })

    if (response?.data) {
      bands.value.push(response.data)
      bands.value.sort(
        (a: any, b: any) =>
          Number(a.sequence || 0) -
          Number(b.sequence || 0),
      )
    } else {
      await loadData()
    }

    toast.add({
      title: "Rank band created",
      description: `${createRankPreview.value} was created successfully.`,
      color: "success",
      icon: "i-lucide-circle-check-big",
    })

    createDialogOpen.value = false
    resetCreateForm()
  } catch (error: any) {
    console.error("Create rank band error:", error)

    toast.add({
      title: "Unable to create rank band",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "The rank band could not be created.",
      color: "error",
      icon: "i-lucide-triangle-alert",
    })
  } finally {
    creating.value = false
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
      bandsResponse,
    ]: any[] = await Promise.all([
      $api(
        `/ranking-schemes/${documentId.value}`,
      ),

      $api("/rank-bands", {
        query: {
          "filters[ranking_scheme][documentId][$eq]":
            documentId.value,
          "populate[ranking_scheme]": true,
          "populate[faculty_rankings]": true,
          "sort[0]": "sequence:asc",
          "pagination[page]": 1,
          "pagination[pageSize]": 1000,
        },
      }),
    ])

    scheme.value =
      schemeResponse?.data || null

    bands.value =
      bandsResponse?.data || []
  } catch (error: any) {
    console.error(
      "Rank band loading error:",
      error,
    )

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to load rank bands."
  } finally {
    loading.value = false
  }
}

watch(
  [
    searchQuery,
    selectedStatus,
    pageSize,
  ],
  () => {
    currentPage.value = 1
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
