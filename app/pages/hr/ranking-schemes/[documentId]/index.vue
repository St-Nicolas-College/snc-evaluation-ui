<template>
  <div class="space-y-6 pb-10">
    <!-- LOADING -->
    <div v-if="loading" class="space-y-5">
      <USkeleton class="h-52 rounded-[34px]" />
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <USkeleton
          v-for="i in 4"
          :key="i"
          class="h-28 rounded-[24px]"
        />
      </div>
      <USkeleton class="h-72 rounded-[28px]" />
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
        <UIcon
          name="i-lucide-triangle-alert"
          class="size-8"
        />
      </div>

      <h2 class="mt-4 text-lg font-black text-gray-900 dark:text-white">
        Unable to load ranking scheme
      </h2>

      <p class="mt-2 text-sm text-gray-500">
        {{ loadError }}
      </p>

      <div class="mt-6 flex flex-wrap justify-center gap-2">
        <UButton
          to="/hr/ranking-schemes"
          color="neutral"
          variant="soft"
          icon="i-lucide-arrow-left"
        >
          Back to Schemes
        </UButton>

        <UButton
          icon="i-lucide-refresh-cw"
          @click="loadScheme"
        >
          Retry
        </UButton>
      </div>
    </section>

    <template v-else-if="scheme">
      <!-- HERO -->
      <section
        class="relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-800 px-6 py-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:px-8"
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
          <div class="max-w-4xl">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-100"
              >
                Ranking Scheme
              </span>

              <UBadge
                :color="statusColor(scheme.scheme_status)"
                variant="subtle"
              >
                {{ formatStatus(scheme.scheme_status) }}
              </UBadge>

              <UBadge
                :color="scheme.is_active ? 'success' : 'neutral'"
                variant="subtle"
              >
                {{ scheme.is_active ? "Active" : "Inactive" }}
              </UBadge>
            </div>

            <h1
              class="mt-4 max-w-4xl text-3xl font-black tracking-tight sm:text-[36px]"
            >
              {{ scheme.name }}
            </h1>

            <p
              v-if="scheme.description"
              class="mt-3 max-w-3xl text-sm leading-6 text-blue-100"
            >
              {{ scheme.description }}
            </p>

            <div class="mt-5 flex flex-wrap gap-2 text-xs text-blue-100">
              <span
                class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5"
              >
                <UIcon name="i-lucide-calendar-days" class="size-3.5" />
                {{ scheme.academic_year || "No Academic Year" }}
              </span>

              <span
                class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5"
              >
                <UIcon name="i-lucide-git-branch" class="size-3.5" />
                Version {{ scheme.version || "N/A" }}
              </span>

              <span
                class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5"
              >
                <UIcon name="i-lucide-hash" class="size-3.5" />
                {{ scheme.code || "No code" }}
              </span>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <UButton
              to="/hr/ranking-schemes"
              color="neutral"
              variant="soft"
              icon="i-lucide-arrow-left"
            >
              Back
            </UButton>

            <UButton
              :to="`/hr/ranking-schemes/${scheme.documentId}/edit`"
              icon="i-lucide-pencil"
            >
              Edit Scheme
            </UButton>
          </div>
        </div>
      </section>

      <!-- METRICS -->
      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
                Academic Year
              </p>
              <p class="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                {{ scheme.academic_year || "N/A" }}
              </p>
              <p class="mt-1 text-xs text-gray-400">
                {{ formatDate(scheme.effective_date) }}
              </p>
            </div>
            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
            >
              <UIcon name="i-lucide-calendar-range" class="size-5" />
            </div>
          </div>
        </div>

        <div
          class="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
                Evaluation Max
              </p>
              <p class="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                {{ points(scheme.evaluation_max_points) }}
              </p>
              <p class="mt-1 text-xs text-gray-400">
                Maximum evaluation points
              </p>
            </div>
            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400"
            >
              <UIcon name="i-lucide-calculator" class="size-5" />
            </div>
          </div>
        </div>

        <div
          class="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
                Rank Bands
              </p>
              <p class="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                {{ rankBands.length }}
              </p>
              <p class="mt-1 text-xs text-gray-400">
                Configured rank levels
              </p>
            </div>
            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
            >
              <UIcon name="i-lucide-trophy" class="size-5" />
            </div>
          </div>
        </div>

        <div
          class="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
                Salary Rates
              </p>
              <p class="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                {{ salaryRates.length }}
              </p>
              <p class="mt-1 text-xs text-gray-400">
                Configured compensation rates
              </p>
            </div>
            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
            >
              <UIcon name="i-lucide-wallet-cards" class="size-5" />
            </div>
          </div>
        </div>
      </section>

      <!-- TWO-COLUMN OVERVIEW -->
      <section class="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <!-- GENERAL INFORMATION -->
        <div
          class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex items-center justify-between gap-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-6 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              >
                <UIcon name="i-lucide-file-cog" class="size-5" />
              </div>

              <div>
                <p
                  class="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400"
                >
                  Scheme Details
                </p>
                <h2 class="mt-1 font-black text-gray-900 dark:text-white">
                  General Information
                </h2>
              </div>
            </div>
          </div>

          <div class="grid gap-3 p-6 sm:grid-cols-2">
            <div
              class="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <p class="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Scheme Code
              </p>
              <p class="mt-1.5 font-semibold text-gray-900 dark:text-white">
                {{ scheme.code || "N/A" }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <p class="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Version
              </p>
              <p class="mt-1.5 font-semibold text-gray-900 dark:text-white">
                {{ scheme.version || "N/A" }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <p class="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Effective Date
              </p>
              <p class="mt-1.5 font-semibold text-gray-900 dark:text-white">
                {{ formatDate(scheme.effective_date) }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <p class="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Expiration Date
              </p>
              <p class="mt-1.5 font-semibold text-gray-900 dark:text-white">
                {{
                  scheme.expiration_date
                    ? formatDate(scheme.expiration_date)
                    : "No expiration"
                }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <p class="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Status
              </p>
              <div class="mt-2">
                <UBadge
                  :color="statusColor(scheme.scheme_status)"
                  variant="subtle"
                >
                  {{ formatStatus(scheme.scheme_status) }}
                </UBadge>
              </div>
            </div>

            <div
              class="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <p class="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Availability
              </p>
              <div class="mt-2">
                <UBadge
                  :color="scheme.is_active ? 'success' : 'neutral'"
                  variant="subtle"
                >
                  {{ scheme.is_active ? "Active" : "Inactive" }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>

        <!-- EVALUATION BREAKDOWN -->
        <div
          class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-violet-50/40 px-6 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950/10"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex size-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              >
                <UIcon name="i-lucide-calculator" class="size-5" />
              </div>

              <div>
                <p
                  class="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-600 dark:text-violet-400"
                >
                  Evaluation Configuration
                </p>
                <h2 class="mt-1 font-black text-gray-900 dark:text-white">
                  Point Breakdown
                </h2>
              </div>
            </div>
          </div>

          <div class="space-y-3 p-6">
            <div
              class="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                >
                  <UIcon name="i-lucide-graduation-cap" class="size-3.5" />
                </div>
                <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Student Evaluation
                </span>
              </div>

              <span class="text-lg font-black text-gray-900 dark:text-white">
                {{ points(scheme.student_evaluation_max_points) }}
              </span>
            </div>

            <div
              class="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                >
                  <UIcon name="i-lucide-user-round-check" class="size-3.5" />
                </div>
                <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Immediate Superior
                </span>
              </div>

              <span class="text-lg font-black text-gray-900 dark:text-white">
                {{ points(scheme.immediate_superior_max_points) }}
              </span>
            </div>

            <div
              class="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                >
                  <UIcon name="i-lucide-briefcase-business" class="size-3.5" />
                </div>
                <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  HR Evaluation
                </span>
              </div>

              <span class="text-lg font-black text-gray-900 dark:text-white">
                {{ points(scheme.hr_evaluation_max_points) }}
              </span>
            </div>

            <div
              class="mt-2 flex items-center justify-between rounded-2xl border border-violet-200 bg-violet-50 px-4 py-4 dark:border-violet-900 dark:bg-violet-950/20"
            >
              <div>
                <p
                  class="text-[10px] font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400"
                >
                  Evaluation Total
                </p>
                <p class="mt-1 text-xs text-violet-700 dark:text-violet-300">
                  Combined maximum points
                </p>
              </div>

              <span
                class="text-2xl font-black text-violet-700 dark:text-violet-300"
              >
                {{ points(scheme.evaluation_max_points) }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- CONFIGURATION TABLES -->
      <section
        class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <!-- SECTION HEADER -->
        <div
          class="flex flex-col gap-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-slate-800 text-white shadow-lg shadow-slate-800/20 dark:bg-slate-700"
            >
              <UIcon
                name="i-lucide-table-properties"
                class="size-5"
              />
            </div>

            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500"
              >
                Scheme Configuration
              </p>

              <h2
                class="mt-1 font-black text-gray-900 dark:text-white"
              >
                Rank Bands and Salary Rates
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Switch between configuration tables without extending the page.
              </p>
            </div>
          </div>

          <div
            class="inline-flex rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition"
              :class="
                activeConfigTab === 'rank-bands'
                  ? 'bg-white text-emerald-700 shadow-sm dark:bg-gray-900 dark:text-emerald-300'
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
              "
              @click="activeConfigTab = 'rank-bands'"
            >
              <UIcon
                name="i-lucide-trophy"
                class="size-3.5"
              />
              Rank Bands
              <span
                class="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                {{ rankBands.length }}
              </span>
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition"
              :class="
                activeConfigTab === 'salary-rates'
                  ? 'bg-white text-amber-700 shadow-sm dark:bg-gray-900 dark:text-amber-300'
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
              "
              @click="activeConfigTab = 'salary-rates'"
            >
              <UIcon
                name="i-lucide-wallet-cards"
                class="size-3.5"
              />
              Salary Rates
              <span
                class="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
              >
                {{ salaryRates.length }}
              </span>
            </button>
          </div>
        </div>

        <!-- RANK BANDS TAB -->
        <div v-if="activeConfigTab === 'rank-bands'">
          <div
            class="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3 dark:border-gray-800"
          >
            <div>
              <p
                class="text-sm font-bold text-gray-900 dark:text-white"
              >
                Rank Bands
              </p>

              <p class="mt-0.5 text-xs text-gray-500">
                Point and salary ranges used for automatic rank assignment.
              </p>
            </div>

            <UButton
              color="success"
              variant="soft"
              size="xs"
              icon="i-lucide-settings-2"
              disabled
            >
              Manage
            </UButton>
          </div>

          <div
            v-if="!rankBands.length"
            class="px-6 py-12 text-center"
          >
            <div
              class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30"
            >
              <UIcon
                name="i-lucide-trophy"
                class="size-6"
              />
            </div>

            <h3
              class="mt-3 font-bold text-gray-900 dark:text-white"
            >
              No rank bands configured
            </h3>

            <p class="mt-1 text-xs text-gray-500">
              Rank Band Management will be connected next.
            </p>
          </div>

          <div
            v-else
            class="max-h-[420px] overflow-auto"
          >
            <table
              class="w-full min-w-[900px] text-[12px]"
            >
              <thead
                class="sticky top-0 z-[1] border-b border-gray-200 bg-slate-100 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600 dark:border-gray-800 dark:bg-gray-950 dark:text-slate-400"
              >
                <tr>
                  <th class="px-4 py-2.5 text-left">
                    Rank
                  </th>
                  <th class="px-3 py-2.5 text-center">
                    Level
                  </th>
                  <th class="px-3 py-2.5 text-center">
                    Points
                  </th>
                  <th class="px-3 py-2.5 text-center">
                    Rate Range
                  </th>
                  <th class="px-3 py-2.5 text-center">
                    Sequence
                  </th>
                  <th class="px-3 py-2.5 text-center">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody
                class="divide-y divide-gray-100 dark:divide-gray-800"
              >
                <tr
                  v-for="band in rankBands"
                  :key="band.documentId || band.id"
                  class="transition-colors hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10"
                >
                  <td class="px-4 py-2.5">
                    <div class="flex items-center gap-2.5">
                      <div
                        class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                      >
                        <UIcon
                          name="i-lucide-award"
                          class="size-3.5"
                        />
                      </div>

                      <div>
                        <p
                          class="font-bold text-gray-900 dark:text-white"
                        >
                          {{ rankBandLabel(band) }}
                        </p>

                        <p
                          v-if="band.educational_requirement"
                          class="mt-0.5 text-[10px] text-gray-500"
                        >
                          {{ band.educational_requirement }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="px-3 py-2.5 text-center">
                    {{ band.rank_level }}
                  </td>

                  <td class="px-3 py-2.5 text-center">
                    <span
                      class="inline-flex rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                    >
                      {{ points(band.minimum_points) }} –
                      {{ points(band.maximum_points) }}
                    </span>
                  </td>

                  <td class="px-3 py-2.5 text-center">
                    <span
                      class="inline-flex rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                    >
                      {{ php(band.minimum_rate) }} –
                      {{ php(band.maximum_rate) }}
                    </span>
                  </td>

                  <td class="px-3 py-2.5 text-center">
                    {{ band.sequence || "—" }}
                  </td>

                  <td class="px-3 py-2.5 text-center">
                    <UBadge
                      :color="band.is_active ? 'success' : 'neutral'"
                      variant="subtle"
                      size="xs"
                    >
                      {{ band.is_active ? "Active" : "Inactive" }}
                    </UBadge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- SALARY RATES TAB -->
        <div v-else>
          <div
            class="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3 dark:border-gray-800"
          >
            <div>
              <p
                class="text-sm font-bold text-gray-900 dark:text-white"
              >
                Salary Rates
              </p>

              <p class="mt-0.5 text-xs text-gray-500">
                Salary-rate records associated with this ranking scheme.
              </p>
            </div>

            <UButton
              color="warning"
              variant="soft"
              size="xs"
              icon="i-lucide-settings-2"
              disabled
            >
              Manage
            </UButton>
          </div>

          <div
            v-if="!salaryRates.length"
            class="px-6 py-12 text-center"
          >
            <div
              class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-950/30"
            >
              <UIcon
                name="i-lucide-wallet-cards"
                class="size-6"
              />
            </div>

            <h3
              class="mt-3 font-bold text-gray-900 dark:text-white"
            >
              No salary rates configured
            </h3>

            <p class="mt-1 text-xs text-gray-500">
              Salary Rate Management will be connected later.
            </p>
          </div>

          <div
            v-else
            class="max-h-[420px] overflow-auto"
          >
            <table
              class="w-full min-w-[820px] text-[12px]"
            >
              <thead
                class="sticky top-0 z-[1] border-b border-gray-200 bg-slate-100 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600 dark:border-gray-800 dark:bg-gray-950 dark:text-slate-400"
              >
                <tr>
                  <th class="px-4 py-2.5 text-left">
                    Rate
                  </th>
                  <th class="px-3 py-2.5 text-center">
                    Point Value
                  </th>
                  <th class="px-3 py-2.5 text-center">
                    Below Points
                  </th>
                  <th class="px-3 py-2.5 text-right">
                    Salary Rate
                  </th>
                  <th class="px-3 py-2.5 text-center">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody
                class="divide-y divide-gray-100 dark:divide-gray-800"
              >
                <tr
                  v-for="rate in salaryRates"
                  :key="rate.documentId || rate.id"
                  class="transition-colors hover:bg-amber-50/30 dark:hover:bg-amber-950/10"
                >
                  <td class="px-4 py-2.5">
                    <div class="flex items-center gap-2.5">
                      <div
                        class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                      >
                        <UIcon
                          name="i-lucide-banknote"
                          class="size-3.5"
                        />
                      </div>

                      <div>
                        <p
                          class="font-bold text-gray-900 dark:text-white"
                        >
                          {{ rate.rate_name || "Salary Rate" }}
                        </p>

                        <p
                          v-if="rate.rate_code"
                          class="mt-0.5 text-[10px] text-gray-500"
                        >
                          {{ rate.rate_code }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="px-3 py-2.5 text-center">
                    {{
                      rate.point_value === null ||
                      rate.point_value === undefined
                        ? "—"
                        : points(rate.point_value)
                    }}
                  </td>

                  <td class="px-3 py-2.5 text-center">
                    {{
                      rate.below_points === null ||
                      rate.below_points === undefined
                        ? "—"
                        : points(rate.below_points)
                    }}
                  </td>

                  <td
                    class="px-3 py-2.5 text-right font-bold text-gray-900 dark:text-white"
                  >
                    {{ php(rate.max_rate) }}
                  </td>

                  <td class="px-3 py-2.5 text-center">
                    <UBadge
                      :color="rate.is_active ? 'success' : 'neutral'"
                      variant="subtle"
                      size="xs"
                    >
                      {{ rate.is_active ? "Active" : "Inactive" }}
                    </UBadge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- FOOTER -->
        <div
          class="border-t border-gray-100 bg-gray-50/50 px-5 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-950/20"
        >
          <template v-if="activeConfigTab === 'rank-bands'">
            Showing {{ rankBands.length }} rank band{{
              rankBands.length === 1 ? "" : "s"
            }}. Scroll inside the table when records exceed the visible area.
          </template>

          <template v-else>
            Showing {{ salaryRates.length }} salary-rate record{{
              salaryRates.length === 1 ? "" : "s"
            }}. Scroll inside the table when records exceed the visible area.
          </template>
        </div>
      </section>

      <!-- REMARKS -->
      <section
        v-if="scheme.remarks"
        class="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="border-b border-gray-200 bg-gray-50/60 px-6 py-5 dark:border-gray-800 dark:bg-gray-950/30"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              <UIcon name="i-lucide-notebook-text" class="size-5" />
            </div>

            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500"
              >
                Additional Information
              </p>
              <h2 class="mt-1 font-black text-gray-900 dark:text-white">
                Remarks
              </h2>
            </div>
          </div>
        </div>

        <p
          class="whitespace-pre-line p-6 text-sm leading-6 text-gray-700 dark:text-gray-300"
        >
          {{ scheme.remarks }}
        </p>
      </section>
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

const loading = ref(false)
const loadError = ref("")
const scheme = ref<any>(null)

const activeConfigTab = ref<"rank-bands" | "salary-rates">("rank-bands")

const documentId = computed(() =>
  String(
    route.params.documentId || "",
  ),
)

const rankBands = computed(() =>
  [...(scheme.value?.rank_bands || [])].sort(
    (a: any, b: any) =>
      Number(a.sequence || 0) -
      Number(b.sequence || 0),
  ),
)

const salaryRates = computed(() =>
  [...(scheme.value?.salary_rates || [])].sort(
    (a: any, b: any) =>
      Number(a.sort_order || 0) -
      Number(b.sort_order || 0),
  ),
)

const points = (value: unknown) => {
  const parsed = Number(value ?? 0)

  if (!Number.isFinite(parsed)) {
    return "0"
  }

  return Number.isInteger(parsed)
    ? String(parsed)
    : parsed
        .toFixed(2)
        .replace(/\.?0+$/, "")
}

const php = (value: unknown) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return "Not configured"
  }

  return `PHP ${new Intl.NumberFormat(
    "en-PH",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(parsed)}`
}

const formatDate = (value: any) => {
  if (!value) {
    return "N/A"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleDateString(
    "en-PH",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  )
}

const formatStatus = (value: string) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    )

const statusColor = (status: string) => {
  if (status === "active") {
    return "success"
  }

  if (status === "draft") {
    return "warning"
  }

  return "neutral"
}

const rankBandLabel = (band: any) => {
  const name = String(
    band.rank_name || "",
  )
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    )

  return `${name} ${band.rank_level || ""}`.trim()
}

const loadScheme = async () => {
  if (!documentId.value) {
    loadError.value =
      "Ranking scheme document ID is missing."
    return
  }

  loading.value = true
  loadError.value = ""

  try {
    const response: any =
      await $api(
        `/ranking-schemes/${documentId.value}`,
        {
          query: {
            "populate[rank_bands]": true,
            "populate[salary_rates]": true,
            "populate[categories]": true,
          },
        },
      )

    scheme.value =
      response?.data || null

    if (!scheme.value) {
      loadError.value =
        "Ranking scheme was not found."
    }
  } catch (error: any) {
    console.error(
      "Ranking scheme loading error:",
      error,
    )

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to load the ranking scheme."
  } finally {
    loading.value = false
  }
}

const SummaryCard = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    icon: String,
    tone: {
      type: String,
      default: "info",
    },
  },

  setup(props) {
    return () =>
      h(
        "div",
        {
          class:
            "rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900",
        },
        [
          h(
            "div",
            {
              class:
                "flex items-start justify-between gap-4",
            },
            [
              h("div", {}, [
                h(
                  "p",
                  {
                    class:
                      "text-xs font-bold uppercase tracking-wide text-gray-500",
                  },
                  props.label,
                ),

                h(
                  "p",
                  {
                    class:
                      "mt-3 text-2xl font-black text-gray-900 dark:text-white",
                  },
                  String(props.value ?? ""),
                ),
              ]),

              h(
                resolveComponent("UIcon"),
                {
                  name: props.icon,
                  class:
                    "size-6 text-blue-600",
                },
              ),
            ],
          ),
        ],
      )
  },
})

const InfoItem = defineComponent({
  props: {
    label: String,
    value: [String, Number],
  },

  setup(props) {
    return () =>
      h(
        "div",
        {
          class:
            "rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30",
        },
        [
          h(
            "p",
            {
              class:
                "text-[10px] font-bold uppercase tracking-wide text-gray-500",
            },
            props.label,
          ),

          h(
            "p",
            {
              class:
                "mt-1.5 font-semibold text-gray-900 dark:text-white",
            },
            String(props.value ?? "N/A"),
          ),
        ],
      )
  },
})

const PointCard = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    total: Boolean,
  },

  setup(props) {
    return () =>
      h(
        "div",
        {
          class:
            props.total
              ? "rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950/20"
              : "rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-950/30",
        },
        [
          h(
            "p",
            {
              class:
                "text-[10px] font-bold uppercase tracking-wide text-gray-500",
            },
            props.label,
          ),

          h(
            "p",
            {
              class:
                "mt-2 text-3xl font-black text-gray-900 dark:text-white",
            },
            String(props.value ?? 0),
          ),

          h(
            "p",
            {
              class:
                "mt-1 text-xs text-gray-400",
            },
            "Maximum points",
          ),
        ],
      )
  },
})

onMounted(loadScheme)
</script>