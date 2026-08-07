<template>
  <div class="space-y-6 pb-10">
    <!-- PAGE ACTIONS -->
    <div
      class="flex flex-col gap-3 rounded-[22px] border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900"
    >
      <UButton
        to="/hr/portfolio"
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
      >
        Back to Faculty Portfolios
      </UButton>

      <div class="flex flex-wrap gap-2">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-refresh-cw"
          :loading="loading"
          @click="loadData"
        >
          Refresh
        </UButton>

        <UButton icon="i-lucide-plus" @click="openCreateDialog">
          Add Portfolio Entry
        </UButton>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-52 rounded-[30px]" />

      <div class="grid gap-3 sm:grid-cols-3">
        <USkeleton
          v-for="index in 3"
          :key="index"
          class="h-24 rounded-[22px]"
        />
      </div>

      <USkeleton class="h-[500px] rounded-[26px]" />
    </div>

    <!-- ERROR -->
    <section
      v-else-if="loadError"
      class="rounded-[26px] border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <div
        class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40"
      >
        <UIcon name="i-lucide-triangle-alert" class="size-7" />
      </div>

      <h2 class="mt-4 font-bold text-gray-900 dark:text-white">
        Unable to load faculty portfolio
      </h2>

      <p class="mt-2 text-sm text-gray-500">
        {{ loadError }}
      </p>

      <UButton class="mt-5" icon="i-lucide-refresh-cw" @click="loadData">
        Try Again
      </UButton>
    </section>

    <template v-else-if="teacher">
      <!-- PERSONNEL HEADER -->
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
          class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"
        >
          <div class="flex min-w-0 items-center gap-4">
            <div
              class="flex size-16 shrink-0 items-center justify-center rounded-[22px] border border-white/15 bg-white/10 text-xl font-black shadow-inner"
            >
              {{ initials(teacherName) }}
            </div>

            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100"
                >
                  HR Portfolio Management
                </span>

                <span
                  class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold text-blue-100"
                >
                  {{ teacherRole }}
                </span>
              </div>

              <h1
                class="mt-3 truncate text-2xl font-black tracking-tight sm:text-3xl"
              >
                {{ teacherName }}
              </h1>

              <p class="mt-2 text-sm text-blue-100">
                {{ departmentName }}
                <span class="mx-1.5 text-blue-300/60">•</span>
                {{
                  teacher.employee_no ||
                  teacher.user?.username ||
                  "No employee number"
                }}
              </p>

              <p v-if="teacher.user?.email" class="mt-1 text-xs text-blue-200">
                {{ teacher.user.email }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 xl:min-w-[420px]">
            <HeaderStat
              label="Total Entries"
              :value="entries.length"
              icon="i-lucide-files"
            />

            <HeaderStat
              label="Current"
              :value="currentCount"
              icon="i-lucide-circle-check-big"
            />

            <HeaderStat
              label="Inactive"
              :value="inactiveCount"
              icon="i-lucide-archive"
            />
          </div>
        </div>
      </section>

      <!-- PORTFOLIO OVERVIEW -->
      <section>
        <div
          class="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p
              class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
            >
              Portfolio Overview
            </p>

            <h2 class="mt-1 text-lg font-black text-gray-900 dark:text-white">
              Entry Status Summary
            </h2>
          </div>

          <p class="text-xs text-gray-500">
            Current status of this personnel's official HR portfolio.
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Total Portfolio Entries"
            :value="entries.length"
            icon="i-lucide-folder-kanban"
            description="All recorded portfolio items"
            tone="info"
          />

          <StatCard
            label="Current Entries"
            :value="currentCount"
            icon="i-lucide-circle-check-big"
            description="Included in active portfolio records"
            tone="success"
          />

          <StatCard
            label="Inactive Entries"
            :value="inactiveCount"
            icon="i-lucide-archive"
            description="Inactive or historical records"
            tone="neutral"
          />
        </div>
      </section>

      <!-- SEARCH AND FILTERS -->
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
                Find portfolio records by title, type, institution, issuer, or
                record status.
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
          <div class="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <UFormField label="Search">
              <UInput
                v-model="searchQuery"
                icon="i-lucide-search"
                placeholder="Search portfolio entries..."
                class="w-full"
              />
            </UFormField>

            <UFormField label="Entry Type">
              <USelectMenu
                v-model="selectedType"
                :items="typeFilterOptions"
                value-key="value"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Record Status">
              <USelectMenu
                v-model="selectedState"
                :items="stateOptions"
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

            <UButton icon="i-lucide-plus" @click="openCreateDialog">
              Add Entry
            </UButton>
          </div>
        </div>
      </section>

      <!-- PORTFOLIO ENTRIES -->
      <section
        class="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
            >
              <UIcon name="i-lucide-folder-open" class="size-5" />
            </div>

            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
              >
                Official Records
              </p>

              <h2
                class="mt-1 text-base font-black text-gray-900 dark:text-white"
              >
                Portfolio Entries
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Showing
                <span class="font-semibold text-gray-700 dark:text-gray-300">
                  {{ paginationStart }}–{{ paginationEnd }}
                </span>
                of
                <span class="font-semibold text-gray-700 dark:text-gray-300">
                  {{ filteredEntries.length }}
                </span>
                filtered records.
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
        <div v-if="!filteredEntries.length" class="px-6 py-16 text-center">
          <div
            class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-800"
          >
            <UIcon name="i-lucide-folder-open" class="size-7" />
          </div>

          <h3 class="mt-4 font-bold text-gray-900 dark:text-white">
            No portfolio entries found
          </h3>

          <p class="mt-2 text-sm text-gray-500">
            {{
              hasActiveFilters
                ? "Try changing your search or filters."
                : "Add the first official portfolio entry for this personnel."
            }}
          </p>

          <div class="mt-5 flex justify-center gap-2">
            <UButton
              v-if="hasActiveFilters"
              color="neutral"
              variant="soft"
              icon="i-lucide-filter-x"
              @click="clearFilters"
            >
              Clear Filters
            </UButton>

            <UButton icon="i-lucide-plus" @click="openCreateDialog">
              Add Portfolio Entry
            </UButton>
          </div>
        </div>

        <template v-else>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[1220px] text-sm">
              <thead
                class="border-b border-gray-200 bg-slate-100/80 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600 dark:border-gray-800 dark:bg-gray-950/70 dark:text-slate-400"
              >
                <tr>
                  <th class="px-5 py-3.5 text-left">Entry Type</th>

                  <th class="px-4 py-3.5 text-left">Title and Description</th>

                  <th class="px-4 py-3.5 text-left">Institution / Issuer</th>

                  <th class="px-4 py-3.5 text-left">Date Earned</th>

                  <th class="px-4 py-3.5 text-left">Expiration</th>

                  <th class="px-4 py-3.5 text-center">Points</th>

                  <th class="px-4 py-3.5 text-center">Status</th>

                  <th class="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr
                  v-for="entry in paginatedEntries"
                  :key="entry.documentId || entry.id"
                  class="align-top transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-950/10"
                >
                  <!-- ENTRY TYPE -->
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-2">
                      <div
                        class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-600 dark:bg-gray-950/40 dark:text-gray-300"
                      >
                        <UIcon
                          :name="entryTypeIcon(entry.entry_type)"
                          class="size-4"
                        />
                      </div>

                      <UBadge color="neutral" variant="subtle">
                        {{ formatStatus(entry.entry_type) }}
                      </UBadge>
                    </div>
                  </td>

                  <!-- TITLE -->
                  <td class="max-w-[360px] px-4 py-4">
                    <p class="font-bold text-gray-900 dark:text-white">
                      {{ entry.title }}
                    </p>

                    <p
                      v-if="entry.description"
                      class="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400"
                    >
                      {{ entry.description }}
                    </p>

                    <p
                      v-if="entry.reference_number"
                      class="mt-2 text-[11px] text-gray-400"
                    >
                      Ref. No.: {{ entry.reference_number }}
                    </p>

                    <div
                      v-if="entry.entry_type === 'evaluation'"
                      class="mt-2 flex flex-wrap gap-2"
                    >
                      <UBadge color="info" variant="subtle" size="xs">
                        {{ entry.school_year || "No school year" }}
                      </UBadge>

                      <UBadge color="neutral" variant="subtle" size="xs">
                        {{ entry.semester || "No semester" }}
                      </UBadge>
                    </div>
                  </td>

                  <!-- INSTITUTION / ISSUER -->
                  <td class="px-4 py-4">
                    <p class="font-medium text-gray-800 dark:text-gray-200">
                      {{ entry.institution || "N/A" }}
                    </p>

                    <p v-if="entry.issuer" class="mt-1 text-xs text-gray-500">
                      Issuer: {{ entry.issuer }}
                    </p>
                  </td>

                  <!-- DATE EARNED -->
                  <td
                    class="whitespace-nowrap px-4 py-4 text-gray-600 dark:text-gray-300"
                  >
                    {{ formatDate(entry.date_earned) }}
                  </td>

                  <!-- EXPIRATION -->
                  <td class="whitespace-nowrap px-4 py-4">
                    <span
                      :class="
                        isExpired(entry.expiration_date)
                          ? 'font-semibold text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-gray-300'
                      "
                    >
                      {{ formatDate(entry.expiration_date) }}
                    </span>

                    <p
                      v-if="entry.expiration_date"
                      class="mt-1 text-[11px]"
                      :class="
                        isExpired(entry.expiration_date)
                          ? 'text-red-500'
                          : 'text-gray-400'
                      "
                    >
                      {{ expirationLabel(entry.expiration_date) }}
                    </p>
                  </td>

                  <!-- POINTS -->
                  <td class="px-4 py-4 text-center">
                    <UBadge color="info" variant="subtle">
                      {{ formatPoints(entry.points) }}
                    </UBadge>
                  </td>

                  <!-- STATUS -->
                  <td class="px-4 py-4 text-center">
                    <UBadge
                      :color="
                        entry.is_current !== false ? 'success' : 'neutral'
                      "
                      variant="subtle"
                    >
                      {{ entry.is_current !== false ? "Current" : "Inactive" }}
                    </UBadge>
                  </td>

                  <!-- ACTIONS -->
                  <td class="px-5 py-4">
                    <div class="flex items-center justify-center gap-2">
                      <UTooltip text="Edit portfolio entry">
                        <UButton
                          size="xs"
                          color="neutral"
                          variant="outline"
                          icon="i-lucide-pencil"
                          square
                          @click="openEditDialog(entry)"
                        />
                      </UTooltip>

                      <UTooltip text="Delete portfolio entry">
                        <UButton
                          size="xs"
                          color="error"
                          variant="soft"
                          icon="i-lucide-trash-2"
                          square
                          @click="openDeleteDialog(entry)"
                        />
                      </UTooltip>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
              {{ filteredEntries.length }} record{{
                filteredEntries.length === 1 ? "" : "s"
              }}
            </p>

            <UPagination
              v-model:page="currentPage"
              :total="filteredEntries.length"
              :items-per-page="pageSize"
              :sibling-count="1"
              show-edges
            />
          </div>
        </template>
      </section>
    </template>

    <!-- ENTRY FORM MODAL -->
    <UModal
      v-model:open="entryDialogOpen"
      id="hr-portfolio-entry-form"
      :ui="{ content: 'max-w-4xl' }"
    >
      <template #content>
        <div
          class="max-h-[90vh] overflow-y-auto rounded-[30px] bg-white dark:bg-gray-900"
        >
          <!-- MODAL HEADER -->
          <div
            class="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-6 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              >
                <UIcon
                  :name="editingEntry ? 'i-lucide-pencil' : 'i-lucide-plus'"
                  class="size-5"
                />
              </div>

              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                  {{
                    editingEntry
                      ? "Edit Portfolio Entry"
                      : "Add Portfolio Entry"
                  }}
                </h2>

                <p class="mt-1 text-sm text-gray-500">
                  Maintain the official HR portfolio record for
                  {{ teacherName }}.
                </p>
              </div>
            </div>
          </div>

          <UForm :state="form" class="space-y-6 p-6" @submit="saveEntry">
            <!-- BASIC INFORMATION -->
            <section>
              <div class="mb-4">
                <p
                  class="text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400"
                >
                  Basic Information
                </p>

                <p class="mt-1 text-xs text-gray-500">
                  Identify the portfolio category and official record title.
                </p>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <UFormField label="Entry Type" required>
                  <USelectMenu
                    v-model="form.entry_type"
                    :items="entryTypeOptions"
                    value-key="value"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Title" required>
                  <USelectMenu
                    v-if="isEvaluationEntry"
                    v-model="form.title"
                    :items="manualEvaluationTitleOptions"
                    value-key="value"
                    placeholder="Select evaluation title"
                    class="w-full"
                  />

                  <UInput
                    v-else
                    v-model="form.title"
                    placeholder="Enter portfolio entry title"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <UFormField label="Description" class="mt-4">
                <UTextarea
                  v-model="form.description"
                  :rows="3"
                  class="w-full"
                />
              </UFormField>
            </section>

            <USeparator />

            <!-- SOURCE INFORMATION -->
            <section>
              <div class="mb-4">
                <p
                  class="text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400"
                >
                  Source Information
                </p>

                <p class="mt-1 text-xs text-gray-500">
                  Record the organization, issuer, and reference details.
                </p>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <UFormField label="Institution / Organization">
                  <UInput v-model="form.institution" class="w-full" />
                </UFormField>

                <UFormField label="Issuer">
                  <UInput v-model="form.issuer" class="w-full" />
                </UFormField>
              </div>

              <UFormField label="Reference Number" class="mt-4">
                <UInput v-model="form.reference_number" class="w-full" />
              </UFormField>
            </section>

            <USeparator />

            <!-- DATES AND POINTS -->
            <section>
              <div class="mb-4">
                <p
                  class="text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400"
                >
                  Dates and Ranking Points
                </p>

                <p class="mt-1 text-xs text-gray-500">
                  Enter the relevant dates and approved ranking points.
                </p>
              </div>

              <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <UFormField label="Date Earned">
                  <UInput
                    v-model="form.date_earned"
                    type="date"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Start Date">
                  <UInput
                    v-model="form.start_date"
                    type="date"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="End Date">
                  <UInput v-model="form.end_date" type="date" class="w-full" />
                </UFormField>

                <UFormField label="Expiration Date">
                  <UInput
                    v-model="form.expiration_date"
                    type="date"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <div class="mt-4 grid gap-4 sm:grid-cols-2">
                <UFormField
                  label="Points"
                  description="Official ranking points assigned according to the approved faculty ranking guidelines."
                  required
                >
                  <UInput
                    v-model.number="form.points"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full"
                    placeholder="0"
                  />
                </UFormField>

                <UFormField label="Years Count">
                  <UInput
                    v-model.number="form.years_count"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </section>

            <!-- EVALUATION PERIOD -->
            <section
              v-if="isEvaluationEntry"
              class="rounded-[22px] border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900 dark:bg-blue-950/20"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white"
                >
                  <UIcon name="i-lucide-calendar-range" class="size-5" />
                </div>

                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">
                    Evaluation Period
                  </p>

                  <p
                    class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400"
                  >
                    Manual evaluation points are applied only to the selected
                    ranking period.
                  </p>
                </div>
              </div>

              <div class="mt-5 grid gap-4 sm:grid-cols-2">
                <UFormField
                  label="School Year"
                  description="Example: 2026-2027"
                  required
                >
                  <UInput
                    v-model="form.school_year"
                    placeholder="2026-2027"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Semester" required>
                  <USelectMenu
                    v-model="form.semester"
                    :items="semesterOptions"
                    value-key="value"
                    placeholder="Select semester"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </section>

            <USeparator />

            <!-- REMARKS / STATUS -->
            <section>
              <div class="mb-4">
                <p
                  class="text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400"
                >
                  Remarks and Status
                </p>

                <p class="mt-1 text-xs text-gray-500">
                  Add optional notes and define whether this record is active.
                </p>
              </div>

              <UFormField label="Remarks">
                <UTextarea v-model="form.remarks" :rows="3" class="w-full" />
              </UFormField>

              <div
                class="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/30"
              >
                <UCheckbox
                  v-model="form.is_current"
                  label="This is a current and active portfolio entry"
                />
              </div>
            </section>

            <!-- ACTIONS -->
            <div
              class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800"
            >
              <UButton color="neutral" variant="soft" @click="closeEntryDialog">
                Cancel
              </UButton>

              <UButton type="submit" icon="i-lucide-save" :loading="saving">
                {{ editingEntry ? "Save Changes" : "Add Entry" }}
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- DELETE MODAL -->
    <UModal v-model:open="deleteDialogOpen" id="hr-delete-portfolio-entry">
      <template #content>
        <div class="rounded-[28px] bg-white p-6 dark:bg-gray-900">
          <div class="text-center">
            <div
              class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30"
            >
              <UIcon name="i-lucide-trash-2" class="size-7" />
            </div>

            <h2 class="mt-4 text-lg font-bold">Delete portfolio entry?</h2>

            <p class="mt-2 text-sm text-gray-500">
              {{ deletingEntry?.title }}
            </p>

            <p class="mt-2 text-xs leading-5 text-gray-400">
              This action permanently removes the selected official HR portfolio
              record.
            </p>
          </div>

          <div class="mt-6 flex gap-2">
            <UButton
              block
              color="neutral"
              variant="soft"
              @click="closeDeleteDialog"
            >
              Cancel
            </UButton>

            <UButton
              block
              color="error"
              icon="i-lucide-trash-2"
              :loading="deleting"
              @click="deleteEntry"
            >
              Delete
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
});

const route = useRoute();
const { $api } = useNuxtApp();
const toast = useToast();

// STATE
const loading = ref(false);
const loadError = ref("");
const teacher = ref<any>(null);
const entries = ref<any[]>([]);

const searchQuery = ref("");
const selectedType = ref("all");
const selectedState = ref("all");

const entryDialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const editingEntry = ref<any>(null);
const deletingEntry = ref<any>(null);

const saving = ref(false);
const deleting = ref(false);

// PAGINATION
const currentPage = ref(1);
const pageSize = ref(10);

const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

// ENTRY OPTIONS
const entryTypeOptions = [
  {
    label: "Educational Qualifications",
    value: "educational_qualifications",
  },
  {
    label: "Eligibility",
    value: "eligibility",
  },
  {
    label: "Training and Seminars",
    value: "training_seminars",
  },
  {
    label: "Research",
    value: "research",
  },
  {
    label: "Awards and Recognition",
    value: "awards_recognition",
  },
  {
    label: "Professional Experience",
    value: "professional_experience",
  },
  {
    label: "Loyalty",
    value: "loyalty",
  },
  {
    label: "Evaluation",
    value: "evaluation",
  },
  {
    label: "Corporate Social Responsibility",
    value: "corporate_social_responsibility",
  },
];

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
];

const typeFilterOptions = [
  {
    label: "All Entry Types",
    value: "all",
  },
  ...entryTypeOptions,
];

const stateOptions = [
  {
    label: "All Records",
    value: "all",
  },
  {
    label: "Current Only",
    value: "current",
  },
  {
    label: "Inactive Only",
    value: "inactive",
  },
];

// FORM
const createEmptyForm = () => ({
  entry_type: "",
  title: "",
  description: "",
  institution: "",
  issuer: "",
  reference_number: "",
  start_date: "",
  end_date: "",
  date_earned: "",
  expiration_date: "",
  points: 0,
  years_count: null,
  school_year: "",
  semester: "1st Semester",
  remarks: "",
  is_current: true,
});

const form = reactive(createEmptyForm());

// PERSONNEL COMPUTED
const teacherName = computed(
  () =>
    teacher.value?.name ||
    teacher.value?.full_name ||
    teacher.value?.user?.username ||
    "Faculty Member",
);

const teacherRole = computed(
  () =>
    teacher.value?.user?.role?.name ||
    teacher.value?.user?.role?.type ||
    teacher.value?.role ||
    "Faculty",
);

const isDean = computed(() =>
  String(teacherRole.value || "")
    .trim()
    .toLowerCase()
    .includes("dean"),
);

const departmentName = computed(() => {
  const department =
    teacher.value?.department?.name ??
    teacher.value?.department?.data?.name ??
    teacher.value?.department?.data?.attributes?.name ??
    teacher.value?.department?.attributes?.name;

  return department || "Department not specified";
});

// ENTRY COMPUTED
const isEvaluationEntry = computed(() => form.entry_type === "evaluation");

const manualEvaluationTitleOptions = computed(() => {
  const options = [
    {
      label: "HR Evaluation",
      value: "HR Evaluation",
    },
  ];

  if (isDean.value) {
    options.unshift({
      label: "Immediate Superior Evaluation",
      value: "Immediate Superior Evaluation",
    });
  }

  return options;
});

const currentCount = computed(
  () => entries.value.filter((entry: any) => entry.is_current !== false).length,
);

const inactiveCount = computed(
  () => entries.value.filter((entry: any) => entry.is_current === false).length,
);

const filteredEntries = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase();

  return entries.value.filter((entry: any) => {
    const searchable = [
      entry.title,
      entry.description,
      entry.institution,
      entry.issuer,
      entry.reference_number,
      entry.entry_type,
      entry.school_year,
      entry.semester,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesState =
      selectedState.value === "all" ||
      (selectedState.value === "current" && entry.is_current !== false) ||
      (selectedState.value === "inactive" && entry.is_current === false);

    const matchesType =
      selectedType.value === "all" || entry.entry_type === selectedType.value;

    const matchesSearch = !keyword || searchable.includes(keyword);

    return matchesSearch && matchesType && matchesState;
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredEntries.value.length / pageSize.value)),
);

const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;

  return filteredEntries.value.slice(start, start + pageSize.value);
});

const paginationStart = computed(() => {
  if (!filteredEntries.value.length) {
    return 0;
  }

  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() =>
  Math.min(currentPage.value * pageSize.value, filteredEntries.value.length),
);

const hasActiveFilters = computed(
  () =>
    Boolean(searchQuery.value.trim()) ||
    selectedType.value !== "all" ||
    selectedState.value !== "all",
);

// LOCAL UI COMPONENTS
const HeaderStat = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    icon: String,
  },

  setup(props) {
    return () =>
      h(
        "div",
        {
          class:
            "rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-sm",
        },
        [
          h(
            "div",
            {
              class: "flex items-center gap-2",
            },
            [
              h(resolveComponent("UIcon"), {
                name: props.icon,
                class: "size-4 text-cyan-200",
              }),

              h(
                "span",
                {
                  class:
                    "text-[9px] font-bold uppercase tracking-[0.1em] text-blue-100",
                },
                props.label,
              ),
            ],
          ),

          h(
            "p",
            {
              class: "mt-2 text-xl font-black",
            },
            String(props.value ?? 0),
          ),
        ],
      );
  },
});

const StatCard = defineComponent({
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
    const toneClasses: Record<string, any> = {
      info: {
        icon: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
        accent: "from-blue-500/15 via-blue-500/5 to-transparent",
      },

      success: {
        icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
        accent: "from-emerald-500/15 via-emerald-500/5 to-transparent",
      },

      neutral: {
        icon: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        accent: "from-slate-500/10 via-slate-500/5 to-transparent",
      },
    };

    return () => {
      const tone = toneClasses[props.tone] || toneClasses.info;

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

// DISPLAY HELPERS
const getDocumentId = () => {
  const params = route.params || {};

  const raw =
    params.documentId ??
    params.documentid ??
    params.id ??
    Object.values(params)[0] ??
    "";

  return String(Array.isArray(raw) ? raw[0] : raw || "").trim();
};

const initials = (value: string) =>
  String(value || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const entryTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    educational_qualifications: "i-lucide-graduation-cap",
    eligibility: "i-lucide-badge-check",
    training_seminars: "i-lucide-presentation",
    research: "i-lucide-flask-conical",
    awards_recognition: "i-lucide-trophy",
    professional_experience: "i-lucide-briefcase",
    loyalty: "i-lucide-heart-handshake",
    evaluation: "i-lucide-clipboard-check",
    corporate_social_responsibility: "i-lucide-hand-heart",
  };

  return icons[type] || "i-lucide-file-text";
};

const formatStatus = (value: string) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatDate = (value: any) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

const formatPoints = (value: unknown) => {
  const points = Number(value || 0);

  if (!Number.isFinite(points)) {
    return "0";
  }

  return Number.isInteger(points)
    ? String(points)
    : points.toFixed(2).replace(/\.?0+$/, "");
};

const toDateInput = (value: any) => (value ? String(value).slice(0, 10) : "");

// EXPIRATION HELPERS
const isExpired = (value: any) => {
  if (!value) {
    return false;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.getTime() < new Date().setHours(0, 0, 0, 0);
};

const expirationLabel = (value: any) => {
  if (!value) {
    return "";
  }

  const expirationDate = new Date(value);

  if (Number.isNaN(expirationDate.getTime())) {
    return "";
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  expirationDate.setHours(0, 0, 0, 0);

  const difference = Math.ceil(
    (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (difference < 0) {
    const days = Math.abs(difference);

    return `Expired ${days} day${days === 1 ? "" : "s"} ago`;
  }

  if (difference === 0) {
    return "Expires today";
  }

  return `Expires in ${difference} day${difference === 1 ? "" : "s"}`;
};

// FILTER ACTION
const clearFilters = () => {
  searchQuery.value = "";
  selectedType.value = "all";
  selectedState.value = "all";
  currentPage.value = 1;
};

// ENTRY ACTIONS
const openCreateDialog = () => {
  editingEntry.value = null;

  Object.assign(form, createEmptyForm());

  entryDialogOpen.value = true;
};

const openEditDialog = async (entry: any) => {
  editingEntry.value = entry;

  Object.assign(form, {
    entry_type: entry.entry_type || "",
    title: entry.title || "",
    description: entry.description || "",
    institution: entry.institution || "",
    issuer: entry.issuer || "",
    reference_number: entry.reference_number || "",
    start_date: toDateInput(entry.start_date),
    end_date: toDateInput(entry.end_date),
    date_earned: toDateInput(entry.date_earned),
    expiration_date: toDateInput(entry.expiration_date),
    points: Number(entry.points || 0),
    years_count:
      entry.years_count === null || entry.years_count === undefined
        ? null
        : Number(entry.years_count),
    school_year: entry.school_year || "",
    semester: entry.semester || "1st Semester",
    remarks: entry.remarks || "",
    is_current: entry.is_current !== false,
  });

  await nextTick();

  entryDialogOpen.value = true;
};

const closeEntryDialog = () => {
  entryDialogOpen.value = false;

  editingEntry.value = null;

  Object.assign(form, createEmptyForm());
};

const saveEntry = async () => {
  if (!form.entry_type || !form.title.trim()) {
    toast.add({
      title: "Incomplete entry",
      description: "Entry type and title are required.",
      color: "error",
    });

    return;
  }

  if (isEvaluationEntry.value) {
    if (!form.school_year.trim()) {
      toast.add({
        title: "School year required",
        description: "Evaluation entries must include a school year.",
        color: "error",
      });

      return;
    }

    if (!semesterOptions.some((item) => item.value === form.semester)) {
      toast.add({
        title: "Semester required",
        description: "Select a valid semester for the evaluation entry.",
        color: "error",
      });

      return;
    }

    if (form.title === "Student Evaluation") {
      toast.add({
        title: "Student Evaluation is automatic",
        description:
          "Student Evaluation points are generated from Student-to-Faculty evaluation results and must not be entered manually.",
        color: "error",
      });

      return;
    }

    if (!isDean.value && form.title === "Immediate Superior Evaluation") {
      toast.add({
        title: "Immediate Superior Evaluation is automatic",
        description:
          "For regular faculty members, these points are generated from Dean-to-Faculty evaluation results.",
        color: "error",
      });

      return;
    }
  }

  const teacherDocumentId = teacher.value?.documentId || getDocumentId();

  saving.value = true;

  try {
    const data: any = {
      teacher: teacherDocumentId,
      entry_type: form.entry_type,
      title: form.title.trim(),
      description: form.description.trim() || null,
      institution: form.institution.trim() || null,
      issuer: form.issuer.trim() || null,
      reference_number: form.reference_number.trim() || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      date_earned: form.date_earned || null,
      expiration_date: form.expiration_date || null,
      points: Number(form.points || 0),
      years_count:
        form.years_count === null || form.years_count === ""
          ? null
          : Number(form.years_count),
      remarks: form.remarks.trim() || null,
      is_current: Boolean(form.is_current),
    };

    if (isEvaluationEntry.value) {
      data.school_year = form.school_year.trim();
      data.semester = form.semester;
    }

    if (editingEntry.value?.documentId) {
      await $api(`/portfolio-entries/${editingEntry.value.documentId}`, {
        method: "PUT",
        body: {
          data,
        },
      });
    } else {
      await $api("/portfolio-entries", {
        method: "POST",
        body: {
          data,
        },
      });
    }

    toast.add({
      title: editingEntry.value
        ? "Portfolio entry updated"
        : "Portfolio entry added",
      description: "The official portfolio record has been saved successfully.",
      color: "success",
      icon: "i-lucide-circle-check",
    });

    closeEntryDialog();

    await loadData();
  } catch (error: any) {
    toast.add({
      title: "Unable to save portfolio entry",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred.",
      color: "error",
    });
  } finally {
    saving.value = false;
  }
};

// DELETE ACTIONS
const openDeleteDialog = (entry: any) => {
  deletingEntry.value = entry;

  deleteDialogOpen.value = true;
};

const closeDeleteDialog = () => {
  deletingEntry.value = null;

  deleteDialogOpen.value = false;
};

const deleteEntry = async () => {
  if (!deletingEntry.value?.documentId) {
    return;
  }

  deleting.value = true;

  try {
    await $api(`/portfolio-entries/${deletingEntry.value.documentId}`, {
      method: "DELETE",
    });

    toast.add({
      title: "Portfolio entry deleted",
      description: "The portfolio record has been removed.",
      color: "success",
      icon: "i-lucide-circle-check",
    });

    closeDeleteDialog();

    await loadData();
  } catch (error: any) {
    toast.add({
      title: "Unable to delete portfolio entry",
      description:
        error?.data?.error?.message || error?.data?.message || error?.message,
      color: "error",
    });
  } finally {
    deleting.value = false;
  }
};

// DATA LOADING
const loadData = async () => {
  const documentId = getDocumentId();

  if (!documentId || ["undefined", "null"].includes(documentId)) {
    loadError.value = "The selected personnel record has no valid document ID.";

    return;
  }

  loading.value = true;
  loadError.value = "";

  try {
    const [teacherResponse, entryResponse]: any[] = await Promise.all([
      $api(`/teachers/${encodeURIComponent(documentId)}`, {
        query: {
          "populate[department]": true,
          "populate[user][populate][role]": true,
        },
      }),

      $api("/portfolio-entries", {
        query: {
          "filters[teacher][documentId][$eq]": documentId,
          "sort[0]": "date_earned:desc",
          "sort[1]": "createdAt:desc",
          "pagination[page]": 1,
          "pagination[pageSize]": 1000,
        },
      }),
    ]);

    teacher.value = teacherResponse?.data || teacherResponse || null;

    entries.value = entryResponse?.data || [];

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  } catch (error: any) {
    teacher.value = null;
    entries.value = [];

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to load the selected personnel portfolio.";
  } finally {
    loading.value = false;
  }
};

// WATCHERS
watch(
  () => form.entry_type,
  (newType, oldType) => {
    if (newType === oldType) {
      return;
    }

    if (editingEntry.value) {
      return;
    }

    if (newType === "evaluation") {
      form.title = "";

      form.school_year = form.school_year || "2026-2027";

      form.semester = form.semester || "1st Semester";

      return;
    }

    if (oldType === "evaluation") {
      form.title = "";
      form.school_year = "";
      form.semester = "1st Semester";
    }
  },
);

watch([searchQuery, selectedType, selectedState, pageSize], () => {
  currentPage.value = 1;
});

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages;
  }
});

onMounted(loadData);
</script>
