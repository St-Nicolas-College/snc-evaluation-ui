<template>
  <div class="space-y-6 pb-10">
    <!-- PAGE HEADER -->
    <section
      class="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-800 px-6 py-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] sm:px-8"
    >
      <div
        class="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-cyan-300/10 blur-3xl"
      />

      <div
        class="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"
      >
        <div>
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-blue-100"
          >
            Human Resource Portal
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-3">
            <h1 class="text-3xl font-black tracking-tight sm:text-[34px]">
              Faculty Ranking Management
            </h1>

            <span
              class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100 backdrop-blur-sm"
            >
              HR Ranking Module
            </span>
          </div>

          <p class="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
            Compute and review faculty and dean ranking results using
            educational qualification, loyalty, evaluation, corporate social
            responsibility, rank bands, and the official salary-rate table.
          </p>
        </div>

        <div
          v-if="activeScheme"
          class="min-w-[250px] rounded-[22px] border border-white/15 bg-white/10 px-5 py-4 shadow-inner backdrop-blur-md"
        >
          <p
            class="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-100"
          >
            Active Ranking Scheme
          </p>

          <p class="mt-1 text-sm font-bold">
            {{ activeScheme.name }}
          </p>

          <p class="mt-0.5 text-xs text-blue-100">
            {{
              activeScheme.academic_year ||
              activeScheme.version ||
              "Current Scheme"
            }}
          </p>
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
            Ranking Overview
          </p>

          <h2 class="mt-1 text-lg font-black text-gray-900 dark:text-white">
            Current Ranking Status
          </h2>
        </div>

        <p class="text-xs text-gray-500">
          Live summary based on the currently loaded faculty and dean records.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard
          label="Personnel"
          :value="summary.total"
          icon="i-lucide-users"
          description="Faculty and deans"
          tone="info"
        />

        <SummaryCard
          label="Computed"
          :value="summary.computed"
          icon="i-lucide-circle-check-big"
          description="With ranking results"
          tone="success"
        />

        <SummaryCard
          label="Pending"
          :value="summary.pending"
          icon="i-lucide-clock-3"
          description="Not yet computed"
          tone="neutral"
        />

        <SummaryCard
          label="Rate Missing"
          :value="summary.rateMissing"
          icon="i-lucide-triangle-alert"
          description="Needs salary-rate setup"
          tone="warning"
        />
      </div>
    </section>

    <!-- SEARCH / FILTERS -->
    <section
      class="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="mb-5 flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
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
              Narrow the list by personnel, role, department, or ranking status.
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

      <div
        class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"
      >
        <div class="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <UFormField label="Search">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Name, employee no., department..."
              class="w-full"
            />
          </UFormField>

          <UFormField label="Role">
            <USelectMenu
              v-model="selectedRole"
              :items="roleOptions"
              value-key="value"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Department">
            <USelectMenu
              v-model="selectedDepartment"
              :items="departmentOptions"
              value-key="value"
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

        <div class="flex flex-wrap gap-2">
          <UButton
            v-if="hasActiveFilters"
            color="neutral"
            variant="soft"
            icon="i-lucide-filter-x"
            @click="clearFilters"
          >
            Clear Filters
          </UButton>

          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-refresh-cw"
            :loading="loading"
            @click="loadData"
          >
            Refresh
          </UButton>

          <UButton
            icon="i-lucide-calculator"
            @click="openBatchCompute"
          >
            Batch Compute
          </UButton>
        </div>
      </div>
    </section>

    <!-- LOADING -->
    <div v-if="loading" class="space-y-3">
      <USkeleton
        v-for="i in 6"
        :key="i"
        class="h-24 rounded-2xl"
      />
    </div>

    <!-- ERROR -->
    <section
      v-else-if="loadError"
      class="rounded-[24px] border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <div
        class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40"
      >
        <UIcon name="i-lucide-triangle-alert" class="size-7" />
      </div>

      <h2 class="mt-4 font-bold text-gray-900 dark:text-white">
        Unable to load ranking records
      </h2>

      <p class="mt-2 text-sm text-gray-500">
        {{ loadError }}
      </p>

      <UButton
        class="mt-5"
        icon="i-lucide-refresh-cw"
        @click="loadData"
      >
        Try Again
      </UButton>
    </section>

    <!-- RANKING TABLE -->
    <section
      v-else
      class="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex flex-col gap-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          >
            <UIcon name="i-lucide-table-properties" class="size-5" />
          </div>

          <div>
            <p
              class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
            >
              Ranking Records
            </p>

            <h2 class="mt-1 text-base font-black text-gray-900 dark:text-white">
              Faculty and Dean Rankings
            </h2>

            <p class="mt-1 text-xs text-gray-500">
              Showing
              <span class="font-semibold text-gray-700 dark:text-gray-300">
                {{ paginationStart }}–{{ paginationEnd }}
              </span>
              of
              <span class="font-semibold text-gray-700 dark:text-gray-300">
                {{ filteredRows.length }}
              </span>
              filtered records.
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

      <div
        v-if="!filteredRows.length"
        class="px-6 py-16 text-center"
      >
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-800"
        >
          <UIcon name="i-lucide-search-x" class="size-7" />
        </div>

        <h3 class="mt-4 font-bold text-gray-900 dark:text-white">
          No ranking records found
        </h3>

        <p class="mt-2 text-sm text-gray-500">
          Try changing your search or filters.
        </p>

        <UButton
          v-if="hasActiveFilters"
          class="mt-4"
          color="neutral"
          variant="soft"
          icon="i-lucide-filter-x"
          @click="clearFilters"
        >
          Clear Filters
        </UButton>
      </div>

      <template v-else>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1500px] text-sm">
            <thead
              class="border-b border-gray-200 bg-slate-100/80 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600 dark:border-gray-800 dark:bg-gray-950/70 dark:text-slate-400"
            >
              <tr>
                <th class="px-5 py-3.5 text-left">
                  Personnel
                </th>

                <th class="px-4 py-3.5 text-left">
                  Department
                </th>

                <th class="px-4 py-3.5 text-center">
                  Educational<br />
                  Qualification
                </th>

                <th class="px-4 py-3.5 text-center">
                  Loyalty
                </th>

                <th class="px-4 py-3.5 text-center">
                  Evaluation
                </th>

                <th class="px-4 py-3.5 text-center">
                  Corporate Social<br />
                  Responsibility
                </th>

                <th class="px-4 py-3.5 text-center">
                  Portfolio<br />
                  Total
                </th>

                <th class="px-4 py-3.5 text-center">
                  Ranking<br />
                  Total
                </th>

                <th class="px-4 py-3.5 text-left">
                  Rank
                </th>

                <th class="px-4 py-3.5 text-right">
                  Salary Rate
                </th>

                <th class="px-4 py-3.5 text-center">
                  Status
                </th>

                <th class="px-5 py-3.5 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody
              class="divide-y divide-gray-100 dark:divide-gray-800"
            >
              <tr
                v-for="row in paginatedRows"
                :key="row.teacher.documentId"
                class="transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-950/10"
              >
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                    >
                      {{ initials(teacherName(row.teacher)) }}
                    </div>

                    <div class="min-w-0">
                      <p
                        class="font-bold text-gray-900 dark:text-white"
                      >
                        {{ teacherName(row.teacher) }}
                      </p>

                      <div
                        class="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500"
                      >
                        <span>
                          {{
                            row.teacher.employee_no ||
                            row.teacher.user?.username ||
                            "N/A"
                          }}
                        </span>

                        <span>•</span>

                        <span>
                          {{ teacherRole(row.teacher) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-4">
                  <span
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {{ teacherDepartment(row.teacher) }}
                  </span>
                </td>

                <td class="px-4 py-4 text-center">
                  <UBadge color="info" variant="subtle">
                    {{
                      points(
                        row.ranking
                          ?.educational_qualification_total_points,
                      )
                    }}
                  </UBadge>
                </td>

                <td class="px-4 py-4 text-center">
                  {{ points(row.ranking?.loyalty_points) }}
                </td>

                <td class="px-4 py-4 text-center font-semibold">
                  <UBadge color="success" variant="subtle">
                    {{
                      points(
                        row.ranking?.evaluation_points,
                      )
                    }}
                  </UBadge>
                </td>

                <td class="px-4 py-4 text-center">
                  {{ points(row.ranking?.csr_points) }}
                </td>

                <td class="px-4 py-4 text-center font-semibold">
                  <UBadge color="neutral" variant="subtle">
                    {{
                      points(
                        row.ranking?.total_portfolio_points,
                      )
                    }}
                  </UBadge>
                </td>

                <td class="px-4 py-4 text-center">
                  <UBadge color="primary" variant="subtle">
                    {{
                      points(
                        row.ranking?.total_ranking_points,
                      )
                    }}
                  </UBadge>
                </td>

                <td class="px-4 py-4">
                  <div v-if="row.ranking?.rank_name">
                    <p
                      class="font-bold text-gray-900 dark:text-white"
                    >
                      {{ row.ranking.rank_name }}
                    </p>

                    <p
                      v-if="row.ranking.rank_code"
                      class="mt-1 text-xs text-gray-500"
                    >
                      {{ row.ranking.rank_code }}
                    </p>
                  </div>

                  <span
                    v-else
                    class="text-xs font-semibold text-gray-500"
                  >
                    Not assigned
                  </span>
                </td>

                <td class="px-4 py-4 text-right">
                  <span
                    v-if="
                      getAssignedSalaryRate(
                        row.ranking,
                      ) !== null
                    "
                    class="font-black text-gray-900 dark:text-white"
                  >
                    {{
                      currency(
                        getAssignedSalaryRate(
                          row.ranking,
                        ),
                      )
                    }}
                  </span>

                  <span
                    v-else
                    class="text-xs font-semibold text-gray-500"
                  >
                    Not configured
                  </span>
                </td>

                <td class="px-4 py-4 text-center">
                  <UBadge
                    v-if="row.ranking"
                    :color="
                      row.ranking
                        .rate_assignment_status ===
                      'not_configured'
                        ? 'warning'
                        : 'success'
                    "
                    variant="subtle"
                  >
                    {{
                      row.ranking
                        .rate_assignment_status ===
                      "not_configured"
                        ? "Rate Missing"
                        : "Computed"
                    }}
                  </UBadge>

                  <UBadge
                    v-else
                    color="neutral"
                    variant="subtle"
                  >
                    Not Computed
                  </UBadge>
                </td>

                <td class="px-5 py-4">
                  <div class="flex justify-center gap-2">
                    <UButton
                      size="xs"
                      :icon="
                        row.ranking
                          ? 'i-lucide-refresh-cw'
                          : 'i-lucide-calculator'
                      "
                      @click="openCompute(row)"
                    >
                      {{
                        row.ranking
                          ? "Recompute"
                          : "Compute"
                      }}
                    </UButton>

                    <UButton
                      v-if="row.ranking"
                      size="xs"
                      color="neutral"
                      variant="soft"
                      icon="i-lucide-eye"
                      :to="`/hr/ranking/faculty/${row.teacher.documentId}?ranking=${row.ranking.documentId}`"
                    >
                      View
                    </UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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
            {{ filteredRows.length }} record{{
              filteredRows.length === 1 ? "" : "s"
            }}
          </p>

          <UPagination
            v-model:page="currentPage"
            :total="filteredRows.length"
            :items-per-page="pageSize"
            :sibling-count="1"
            show-edges
          />
        </div>
      </template>
    </section>

    <!-- BATCH COMPUTE MODAL -->
    <UModal
      v-model:open="batchComputeOpen"
      id="hr-batch-compute-ranking"
      :ui="{ content: 'max-w-3xl' }"
    >
      <template #content>
        <div
          class="max-h-[90vh] overflow-y-auto rounded-[30px] bg-white dark:bg-gray-900"
        >
          <div
            class="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-6 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              >
                <UIcon name="i-lucide-calculator" class="size-5" />
              </div>

              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                  Batch Compute Faculty Rankings
                </h2>

                <p class="mt-1 text-sm text-gray-500">
                  Compute multiple faculty and dean ranking records in one operation.
                </p>
              </div>
            </div>
          </div>

          <UForm
            :state="batchForm"
            class="space-y-6 p-6"
            @submit="batchComputeRankings"
          >
            <section>
              <p
                class="text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400"
              >
                Ranking Period
              </p>

              <div class="mt-4 grid gap-4 sm:grid-cols-2">
                <UFormField
                  label="Ranking Scheme"
                  required
                  class="sm:col-span-2"
                >
                  <USelectMenu
                    v-model="batchForm.ranking_scheme_document_id"
                    :items="schemeOptions"
                    value-key="value"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="School Year" required>
                  <UInput
                    v-model="batchForm.school_year"
                    placeholder="2026-2027"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Semester" required>
                  <USelectMenu
                    v-model="batchForm.semester"
                    :items="semesterOptions"
                    value-key="value"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </section>

            <USeparator />

            <section>
              <p
                class="text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400"
              >
                Personnel Scope
              </p>

              <p class="mt-1 text-xs text-gray-500">
                Choose which personnel should be included in this batch.
              </p>

              <div class="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  class="rounded-2xl border p-4 text-left transition"
                  :class="
                    batchForm.scope === 'pending'
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/10 dark:border-blue-500 dark:bg-blue-950/20'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/40 dark:border-gray-800 dark:hover:border-blue-900 dark:hover:bg-blue-950/10'
                  "
                  @click="batchForm.scope = 'pending'"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="font-bold text-gray-900 dark:text-white">
                        Only Not Computed
                      </p>

                      <p class="mt-1 text-xs leading-5 text-gray-500">
                        Process only personnel without a ranking for the selected
                        scheme, school year, and semester.
                      </p>
                    </div>

                    <UIcon
                      name="i-lucide-clock-3"
                      class="mt-0.5 size-5 text-blue-600"
                    />
                  </div>
                </button>

                <button
                  type="button"
                  class="rounded-2xl border p-4 text-left transition"
                  :class="
                    batchForm.scope === 'all'
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/10 dark:border-blue-500 dark:bg-blue-950/20'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/40 dark:border-gray-800 dark:hover:border-blue-900 dark:hover:bg-blue-950/10'
                  "
                  @click="batchForm.scope = 'all'"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="font-bold text-gray-900 dark:text-white">
                        All Faculty & Deans
                      </p>

                      <p class="mt-1 text-xs leading-5 text-gray-500">
                        Recompute all eligible personnel. Finalized records
                        remain protected by the backend.
                      </p>
                    </div>

                    <UIcon
                      name="i-lucide-users"
                      class="mt-0.5 size-5 text-blue-600"
                    />
                  </div>
                </button>
              </div>
            </section>

            <section
              class="rounded-[22px] border border-blue-100 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/20"
            >
              <div
                class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p class="font-bold text-gray-900 dark:text-white">
                    Batch Summary
                  </p>

                  <p class="mt-1 text-xs text-gray-500">
                    Based on the selected scheme, period, and personnel scope.
                  </p>
                </div>

                <div class="text-left sm:text-right">
                  <p
                    class="text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400"
                  >
                    Personnel to Process
                  </p>

                  <p
                    class="mt-1 text-3xl font-black text-blue-700 dark:text-blue-300"
                  >
                    {{ batchTeacherDocumentIds.length }}
                  </p>
                </div>
              </div>

              <div
                v-if="batchTeacherDocumentIds.length === 0"
                class="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300"
              >
                No personnel match the selected batch scope and period.
              </div>
            </section>

            <div
              class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800"
            >
              <UButton
                color="neutral"
                variant="soft"
                @click="batchComputeOpen = false"
              >
                Cancel
              </UButton>

              <UButton
                type="submit"
                icon="i-lucide-calculator"
                :loading="batchComputing"
                :disabled="batchTeacherDocumentIds.length === 0"
              >
                Compute {{ batchTeacherDocumentIds.length }} Ranking{{
                  batchTeacherDocumentIds.length === 1 ? "" : "s"
                }}
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- BATCH RESULT MODAL -->
    <UModal
      v-model:open="batchResultOpen"
      id="hr-batch-ranking-result"
      :ui="{ content: 'max-w-4xl' }"
    >
      <template #content>
        <div
          class="max-h-[90vh] overflow-y-auto rounded-[30px] bg-white dark:bg-gray-900"
        >
          <div
            class="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-emerald-50/40 px-6 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/10"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex size-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
              >
                <UIcon
                  name="i-lucide-circle-check-big"
                  class="size-5"
                />
              </div>

              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                  Batch Computation Completed
                </h2>

                <p class="mt-1 text-sm text-gray-500">
                  Review the results of the latest batch faculty ranking computation.
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-6 p-6">
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ResultStat
                label="Requested"
                :value="batchResult?.requested || 0"
                tone="info"
              />

              <ResultStat
                label="Successful"
                :value="batchResult?.successful || 0"
                tone="success"
              />

              <ResultStat
                label="Failed"
                :value="batchResult?.failed || 0"
                tone="danger"
              />

              <ResultStat
                label="Skipped"
                :value="batchResult?.skipped || 0"
                tone="warning"
              />
            </div>

            <section
              v-if="batchResult?.results?.length"
              class="overflow-hidden rounded-[22px] border border-gray-200 dark:border-gray-800"
            >
              <div
                class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <h3 class="font-bold text-gray-900 dark:text-white">
                  Successful Computations
                </h3>
              </div>

              <div
                class="divide-y divide-gray-100 dark:divide-gray-800"
              >
                <div
                  v-for="item in batchResult.results"
                  :key="item.teacher_document_id"
                  class="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p
                      class="font-semibold text-gray-900 dark:text-white"
                    >
                      {{
                        batchResultTeacherName(
                          item.teacher_document_id,
                        )
                      }}
                    </p>

                    <p class="mt-1 text-xs text-gray-500">
                      {{ item.rank || "Rank not assigned" }}
                      <span class="mx-1">•</span>
                      {{ points(item.total_points) }} pts
                    </p>
                  </div>

                  <UBadge color="success" variant="subtle">
                    Computed
                  </UBadge>
                </div>
              </div>
            </section>

            <section
              v-if="batchResult?.errors?.length"
              class="overflow-hidden rounded-[22px] border border-gray-200 dark:border-gray-800"
            >
              <div
                class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <h3 class="font-bold text-gray-900 dark:text-white">
                  Failed or Skipped
                </h3>
              </div>

              <div
                class="divide-y divide-gray-100 dark:divide-gray-800"
              >
                <div
                  v-for="item in batchResult.errors"
                  :key="`${item.teacher_document_id}-${item.status}`"
                  class="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div class="min-w-0">
                    <p
                      class="font-semibold text-gray-900 dark:text-white"
                    >
                      {{
                        batchResultTeacherName(
                          item.teacher_document_id,
                        )
                      }}
                    </p>

                    <p class="mt-1 text-xs leading-5 text-gray-500">
                      {{ item.message }}
                    </p>
                  </div>

                  <UBadge
                    :color="
                      item.status === 'skipped'
                        ? 'warning'
                        : 'error'
                    "
                    variant="subtle"
                  >
                    {{
                      item.status === "skipped"
                        ? "Skipped"
                        : "Failed"
                    }}
                  </UBadge>
                </div>
              </div>
            </section>

            <div
              class="flex justify-end border-t border-gray-200 pt-5 dark:border-gray-800"
            >
              <UButton
                icon="i-lucide-check"
                @click="batchResultOpen = false"
              >
                Done
              </UButton>
            </div>
          </div>
        </div>
      </template>
    </UModal>

    <!-- INDIVIDUAL COMPUTE MODAL -->
    <UModal
      v-model:open="computeOpen"
      :ui="{ content: 'max-w-2xl' }"
    >
      <template #content>
        <div
          class="max-h-[90vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900"
        >
          <div
            class="border-b border-gray-200 px-6 py-5 dark:border-gray-800"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
              >
                <UIcon
                  name="i-lucide-calculator"
                  class="size-5"
                />
              </div>

              <div>
                <h2 class="text-lg font-bold">
                  {{
                    selectedRow?.ranking
                      ? "Recompute Ranking"
                      : "Compute Ranking"
                  }}
                </h2>

                <p class="mt-1 text-sm text-gray-500">
                  {{
                    selectedRow
                      ? teacherName(
                          selectedRow.teacher,
                        )
                      : ""
                  }}
                </p>
              </div>
            </div>
          </div>

          <UForm
            :state="form"
            class="space-y-5 p-6"
            @submit="computeRanking"
          >
            <UFormField
              label="Ranking Scheme"
              required
            >
              <USelectMenu
                v-model="
                  form.ranking_scheme_document_id
                "
                :items="schemeOptions"
                value-key="value"
                class="w-full"
              />
            </UFormField>

            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField
                label="School Year"
                required
              >
                <UInput
                  v-model="form.school_year"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Semester"
                required
              >
                <USelectMenu
                  v-model="form.semester"
                  :items="semesterOptions"
                  value-key="value"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div
              class="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-800 dark:border-blue-900 dark:bg-blue-950/20 dark:text-blue-300"
            >
              The computation will refresh the personnel's portfolio,
              evaluation, assigned rank, and salary-rate information using the
              selected ranking scheme.
            </div>

            <div
              class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800"
            >
              <UButton
                color="neutral"
                variant="soft"
                @click="closeCompute"
              >
                Cancel
              </UButton>

              <UButton
                type="submit"
                icon="i-lucide-calculator"
                :loading="computing"
              >
                {{
                  selectedRow?.ranking
                    ? "Recompute Ranking"
                    : "Compute Ranking"
                }}
              </UButton>
            </div>
          </UForm>
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

const { $api } = useNuxtApp()
const toast = useToast()

// STATE
const loading = ref(false)
const computing = ref(false)
const batchComputing = ref(false)
const loadError = ref("")

const teachers = ref<any[]>([])
const rankings = ref<any[]>([])
const schemes = ref<any[]>([])

const searchQuery = ref("")
const selectedRole = ref("all")
const selectedDepartment = ref("all")
const selectedStatus = ref("all")

const computeOpen = ref(false)
const selectedRow = ref<any>(null)

const batchComputeOpen = ref(false)
const batchResultOpen = ref(false)
const batchResult = ref<any>(null)

// PAGINATION
const currentPage = ref(1)
const pageSize = ref(10)

const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]

// FORMS
const form = reactive({
  ranking_scheme_document_id: "",
  school_year: "2026-2027",
  semester: "1st Semester",
})

const batchForm = reactive({
  ranking_scheme_document_id: "",
  school_year: "2026-2027",
  semester: "1st Semester",
  scope: "pending",
})

// OPTIONS
const semesterOptions = [
  {
    label: "1st Semester",
    value: "1st Semester",
  },
  {
    label: "2nd Semester",
    value: "2nd Semester",
  },
  {
    label: "Summer",
    value: "Summer",
  },
  {
    label: "Annual",
    value: "Annual",
  },
]

const roleOptions = [
  {
    label: "All Roles",
    value: "all",
  },
  {
    label: "Faculty",
    value: "Faculty",
  },
  {
    label: "Dean",
    value: "Dean",
  },
]

const statusOptions = [
  {
    label: "All States",
    value: "all",
  },
  {
    label: "Computed",
    value: "computed",
  },
  {
    label: "Not Computed",
    value: "pending",
  },
  {
    label: "Rate Missing",
    value: "rate_missing",
  },
]

// HELPERS
const teacherName = (
  teacher: any,
) =>
  teacher?.name ||
  teacher?.full_name ||
  teacher?.user?.username ||
  "Faculty Member"

const teacherRole = (
  teacher: any,
) =>
  teacher?.user?.role?.name ||
  teacher?.user?.role?.type ||
  teacher?.role ||
  "Faculty"

const teacherDepartment = (
  teacher: any,
) => {
  const department =
    teacher?.department?.name ??
    teacher?.department?.data?.name ??
    teacher?.department?.data
      ?.attributes?.name ??
    teacher?.department?.attributes?.name

  return (
    department ||
    "Not specified"
  )
}

const initials = (
  value: string,
) =>
  String(value || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part
        .charAt(0)
        .toUpperCase(),
    )
    .join("")

const points = (
  value: unknown,
) => {
  const parsed =
    Number(value ?? 0)

  if (
    !Number.isFinite(parsed)
  ) {
    return "0"
  }

  return Number.isInteger(parsed)
    ? String(parsed)
    : String(parsed).replace(
        /\.?0+$/,
        "",
      )
}

const getAssignedSalaryRate = (
  ranking: any,
): number | null => {
  const value =
    ranking?.salary_rate ??
    ranking?.salary_rate_record
      ?.max_rate

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null
  }

  const parsed =
    Number(value)

  return Number.isFinite(parsed)
    ? parsed
    : null
}

const currency = (
  value: unknown,
) => {
  const parsed =
    Number(value)

  if (
    !Number.isFinite(parsed)
  ) {
    return "Not configured"
  }

  return new Intl.NumberFormat(
    "en-PH",
    {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(parsed)
}

// COMPUTED
const activeScheme = computed(() =>
  schemes.value.find(
    (scheme: any) =>
      scheme.is_active === true &&
      scheme.scheme_status ===
        "active",
  ),
)

const schemeOptions = computed(() =>
  schemes.value.map(
    (scheme: any) => ({
      label: `${scheme.name} (${
        scheme.academic_year ||
        scheme.version ||
        "Current"
      })`,
      value: scheme.documentId,
    }),
  ),
)

const departmentOptions = computed(() => {
  const departments = Array.from(
    new Set(
      teachers.value
        .map((teacher: any) =>
          teacherDepartment(
            teacher,
          ),
        )
        .filter(
          (department) =>
            department &&
            department !==
              "Not specified",
        ),
    ),
  ).sort()

  return [
    {
      label: "All Departments",
      value: "all",
    },
    ...departments.map(
      (department) => ({
        label: department,
        value: department,
      }),
    ),
  ]
})

const rows = computed(() =>
  teachers.value.map(
    (teacher: any) => ({
      teacher,
      ranking:
        rankings.value.find(
          (ranking: any) =>
            ranking?.teacher
              ?.documentId ===
            teacher.documentId,
        ) || null,
    }),
  ),
)

const filteredRows = computed(() => {
  const query =
    searchQuery.value
      .trim()
      .toLowerCase()

  return rows.value.filter(
    (row: any) => {
      const role =
        teacherRole(
          row.teacher,
        )

      const department =
        teacherDepartment(
          row.teacher,
        )

      const searchableText = [
        teacherName(row.teacher),
        row.teacher.employee_no,
        row.teacher.user?.username,
        department,
        role,
        row.ranking?.rank_name,
        row.ranking?.rank_code,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      const matchesStatus =
        selectedStatus.value ===
          "all" ||
        (selectedStatus.value ===
          "computed" &&
          row.ranking) ||
        (selectedStatus.value ===
          "pending" &&
          !row.ranking) ||
        (selectedStatus.value ===
          "rate_missing" &&
          row.ranking
            ?.rate_assignment_status ===
            "not_configured")

      const matchesRole =
        selectedRole.value ===
          "all" ||
        role ===
          selectedRole.value

      const matchesDepartment =
        selectedDepartment.value ===
          "all" ||
        department ===
          selectedDepartment.value

      const matchesSearch =
        !query ||
        searchableText.includes(
          query,
        )

      return (
        matchesSearch &&
        matchesRole &&
        matchesDepartment &&
        matchesStatus
      )
    },
  )
})

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(
      filteredRows.value.length /
        pageSize.value,
    ),
  ),
)

const paginatedRows = computed(() => {
  const start =
    (currentPage.value - 1) *
    pageSize.value

  return filteredRows.value.slice(
    start,
    start + pageSize.value,
  )
})

const paginationStart = computed(() => {
  if (
    !filteredRows.value.length
  ) {
    return 0
  }

  return (
    (currentPage.value - 1) *
      pageSize.value +
    1
  )
})

const paginationEnd = computed(() =>
  Math.min(
    currentPage.value *
      pageSize.value,
    filteredRows.value.length,
  ),
)

const hasActiveFilters = computed(
  () =>
    Boolean(
      searchQuery.value.trim(),
    ) ||
    selectedRole.value !==
      "all" ||
    selectedDepartment.value !==
      "all" ||
    selectedStatus.value !==
      "all",
)

const summary = computed(() => ({
  total:
    rows.value.length,

  computed:
    rows.value.filter(
      (row: any) =>
        row.ranking,
    ).length,

  pending:
    rows.value.filter(
      (row: any) =>
        !row.ranking,
    ).length,

  rateMissing:
    rows.value.filter(
      (row: any) =>
        row.ranking
          ?.rate_assignment_status ===
        "not_configured",
    ).length,
}))

const batchTeacherDocumentIds = computed(() => {
  const schemeDocumentId =
    batchForm
      .ranking_scheme_document_id

  const schoolYear =
    String(
      batchForm.school_year ||
        "",
    ).trim()

  const semester =
    String(
      batchForm.semester ||
        "",
    ).trim()

  if (
    !schemeDocumentId ||
    !schoolYear ||
    !semester
  ) {
    return []
  }

  const allTeacherIds =
    teachers.value
      .map(
        (teacher: any) =>
          teacher?.documentId,
      )
      .filter(Boolean)

  if (
    batchForm.scope ===
    "all"
  ) {
    return allTeacherIds
  }

  return allTeacherIds.filter(
    (
      teacherDocumentId: string,
    ) => {
      const existing =
        rankings.value.find(
          (ranking: any) =>
            ranking?.teacher
              ?.documentId ===
              teacherDocumentId &&
            ranking?.ranking_scheme
              ?.documentId ===
              schemeDocumentId &&
            String(
              ranking?.school_year ||
                "",
            ).trim() ===
              schoolYear &&
            String(
              ranking?.semester ||
                "",
            ).trim() ===
              semester,
        )

      return !existing
    },
  )
})

// LOCAL COMPONENTS
const ResultStat = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    tone: {
      type: String,
      default: "info",
    },
  },

  setup(props) {
    const tones: Record<
      string,
      string
    > = {
      info:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
      success:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
      warning:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
      danger:
        "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300",
    }

    return () =>
      h(
        "div",
        {
          class: `rounded-2xl p-4 ${
            tones[props.tone] ||
            tones.info
          }`,
        },
        [
          h(
            "p",
            {
              class:
                "text-[10px] font-bold uppercase tracking-[0.1em]",
            },
            props.label,
          ),

          h(
            "p",
            {
              class:
                "mt-2 text-3xl font-black",
            },
            String(
              props.value ?? 0,
            ),
          ),
        ],
      )
  },
})

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
    const toneClasses: Record<
      string,
      any
    > = {
      info: {
        icon:
          "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
        accent:
          "from-blue-500/15 via-blue-500/5 to-transparent",
      },

      success: {
        icon:
          "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
        accent:
          "from-emerald-500/15 via-emerald-500/5 to-transparent",
      },

      warning: {
        icon:
          "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
        accent:
          "from-amber-500/15 via-amber-500/5 to-transparent",
      },

      neutral: {
        icon:
          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        accent:
          "from-slate-500/10 via-slate-500/5 to-transparent",
      },
    }

    return () => {
      const tone =
        toneClasses[
          props.tone
        ] ||
        toneClasses.info

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
              class:
                "relative flex items-start justify-between gap-4",
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
                  String(
                    props.value ?? 0,
                  ),
                ),

                h(
                  "p",
                  {
                    class:
                      "mt-1.5 text-[11px] leading-4 text-gray-400",
                  },
                  props.description ||
                    "",
                ),
              ]),

              h(
                "div",
                {
                  class: `flex size-11 items-center justify-center rounded-2xl shadow-sm ${tone.icon}`,
                },
                [
                  h(
                    resolveComponent(
                      "UIcon",
                    ),
                    {
                      name:
                        props.icon,
                      class:
                        "size-5",
                    },
                  ),
                ],
              ),
            ],
          ),
        ],
      )
    }
  },
})

// FILTER ACTION
const clearFilters = () => {
  searchQuery.value = ""
  selectedRole.value =
    "all"
  selectedDepartment.value =
    "all"
  selectedStatus.value =
    "all"
  currentPage.value = 1
}

// BATCH COMPUTE
const openBatchCompute = () => {
  const scheme =
    activeScheme.value ||
    schemes.value[0]

  batchForm.ranking_scheme_document_id =
    scheme?.documentId || ""

  batchForm.school_year =
    scheme?.academic_year ||
    "2026-2027"

  batchForm.semester =
    "1st Semester"

  batchForm.scope =
    "pending"

  batchResult.value =
    null

  batchComputeOpen.value =
    true
}

const batchResultTeacherName = (
  teacherDocumentId: string,
) => {
  const teacher =
    teachers.value.find(
      (item: any) =>
        item?.documentId ===
        teacherDocumentId,
    )

  return teacher
    ? teacherName(teacher)
    : teacherDocumentId
}

const batchComputeRankings =
  async () => {
    if (
      !batchForm
        .ranking_scheme_document_id ||
      !batchForm.school_year.trim() ||
      !batchForm.semester
    ) {
      toast.add({
        title:
          "Incomplete batch settings",
        description:
          "Ranking scheme, school year, and semester are required.",
        color: "error",
        icon:
          "i-lucide-triangle-alert",
      })

      return
    }

    const teacherDocumentIds =
      batchTeacherDocumentIds.value

    if (
      !teacherDocumentIds.length
    ) {
      toast.add({
        title:
          "No personnel to process",
        description:
          "No faculty or dean matches the selected batch scope.",
        color: "warning",
        icon:
          "i-lucide-info",
      })

      return
    }

    batchComputing.value =
      true

    try {
      const response: any =
        await $api(
          "/faculty-rankings/batch-compute",
          {
            method: "POST",

            body: {
              data: {
                ranking_scheme_document_id:
                  batchForm
                    .ranking_scheme_document_id,

                school_year:
                  batchForm
                    .school_year
                    .trim(),

                semester:
                  batchForm
                    .semester,

                teacher_document_ids:
                  teacherDocumentIds,
              },
            },
          },
        )

      batchResult.value =
        response?.data ||
        response ||
        null

      batchComputeOpen.value =
        false

      batchResultOpen.value =
        true

      toast.add({
        title:
          "Batch computation completed",
        description: `${
          batchResult.value
            ?.successful || 0
        } ranking${
          Number(
            batchResult.value
              ?.successful || 0,
          ) === 1
            ? ""
            : "s"
        } computed successfully.`,
        color: "success",
        icon:
          "i-lucide-circle-check-big",
      })

      await loadData()
    } catch (error: any) {
      toast.add({
        title:
          "Batch computation failed",

        description:
          error?.data?.error
            ?.message ||
          error?.data?.message ||
          error?.message ||
          "Unable to batch compute faculty rankings.",

        color: "error",
        icon:
          "i-lucide-triangle-alert",
      })
    } finally {
      batchComputing.value =
        false
    }
  }

// INDIVIDUAL COMPUTE
const openCompute = (
  row: any,
) => {
  selectedRow.value = row

  const scheme =
    row.ranking
      ?.ranking_scheme ||
    activeScheme.value ||
    schemes.value[0]

  form.ranking_scheme_document_id =
    scheme?.documentId || ""

  form.school_year =
    row.ranking
      ?.school_year ||
    scheme?.academic_year ||
    "2026-2027"

  form.semester =
    row.ranking
      ?.semester ||
    "1st Semester"

  computeOpen.value = true
}

const closeCompute = () => {
  computeOpen.value = false
  selectedRow.value = null
}

const computeRanking =
  async () => {
    if (
      !selectedRow.value
        ?.teacher
        ?.documentId ||
      !form
        .ranking_scheme_document_id
    ) {
      return
    }

    computing.value = true

    try {
      await $api(
        `/faculty-rankings/compute/${selectedRow.value.teacher.documentId}`,
        {
          method: "POST",
          body: {
            data: {
              ...form,
            },
          },
        },
      )

      toast.add({
        title:
          "Ranking computed",
        description:
          "The faculty ranking has been updated successfully.",
        color: "success",
        icon:
          "i-lucide-circle-check",
      })

      closeCompute()

      await loadData()
    } catch (error: any) {
      toast.add({
        title:
          "Unable to compute ranking",
        description:
          error?.data?.error
            ?.message ||
          error?.message ||
          "The ranking could not be computed.",
        color: "error",
        icon:
          "i-lucide-triangle-alert",
      })
    } finally {
      computing.value = false
    }
  }

// DATA LOADING
const loadData = async () => {
  loading.value = true
  loadError.value = ""

  try {
    const [
      teacherResponse,
      rankingResponse,
      schemeResponse,
    ]: any[] =
      await Promise.all([
        $api(
          "/teachers",
          {
            query: {
              "populate[department]":
                true,
              "populate[user][populate][role]":
                true,
              "pagination[page]":
                1,
              "pagination[pageSize]":
                1000,
            },
          },
        ),

        $api(
          "/faculty-rankings",
          {
            query: {
              "populate[teacher]":
                true,
              "populate[ranking_scheme]":
                true,
              "populate[rank_band]":
                true,
              "populate[salary_rate_record]":
                true,
              "pagination[page]":
                1,
              "pagination[pageSize]":
                1000,
            },
          },
        ),

        $api(
          "/ranking-schemes",
          {
            query: {
              "filters[is_active][$eq]":
                true,
              "filters[scheme_status][$eq]":
                "active",
              "pagination[page]":
                1,
              "pagination[pageSize]":
                100,
            },
          },
        ),
      ])

    teachers.value = (
      teacherResponse?.data ||
      []
    ).filter(
      (teacher: any) =>
        [
          "Faculty",
          "Dean",
        ].includes(
          teacherRole(
            teacher,
          ),
        ),
    )

    rankings.value =
      rankingResponse?.data ||
      []

    schemes.value =
      schemeResponse?.data ||
      []

    if (
      currentPage.value >
      totalPages.value
    ) {
      currentPage.value =
        totalPages.value
    }
  } catch (error: any) {
    loadError.value =
      error?.data?.error
        ?.message ||
      error?.message ||
      "Unable to load ranking data."
  } finally {
    loading.value = false
  }
}

// WATCHERS
watch(
  [
    searchQuery,
    selectedRole,
    selectedDepartment,
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
    if (
      currentPage.value >
      pages
    ) {
      currentPage.value =
        pages
    }
  },
)

onMounted(loadData)
</script>
