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
              Evaluation Management
            </span>

            <span
              class="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-100"
            >
              Admin Configuration
            </span>
          </div>

          <h1 class="mt-4 text-3xl font-black tracking-tight sm:text-[36px]">
            Evaluation Types
          </h1>

          <p class="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
            Manage rating-based and text/comment-based evaluation flows,
            including their score scales and related evaluation records.
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
            color="neutral"
            variant="solid"
            size="lg"
            icon="i-lucide-plus"
            class="shadow-lg shadow-black/10"
            @click="openCreateDialog"
          >
            Add Evaluation Type
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
            Evaluation Type Summary
          </h2>
        </div>

        <p class="text-xs text-gray-500">
          Current evaluation configurations available in the system.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <article
          class="relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-blue-500/15 via-blue-500/5 to-transparent"
          />
          <div class="relative flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-gray-500">
                Evaluation Types
              </p>
              <p class="mt-3 text-3xl font-black text-gray-900 dark:text-white">
                {{ summary.total }}
              </p>
              <p class="mt-1 text-[11px] text-gray-400">
                All configured flows
              </p>
            </div>

            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
            >
              <UIcon name="i-lucide-workflow" class="size-5" />
            </div>
          </div>
        </article>

        <article
          class="relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent"
          />
          <div class="relative flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-gray-500">
                Rating Types
              </p>
              <p class="mt-3 text-3xl font-black text-gray-900 dark:text-white">
                {{ summary.rating }}
              </p>
              <p class="mt-1 text-[11px] text-gray-400">
                Uses numerical rating scales
              </p>
            </div>

            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
            >
              <UIcon name="i-lucide-star" class="size-5" />
            </div>
          </div>
        </article>

        <article
          class="relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cyan-500/15 via-cyan-500/5 to-transparent"
          />
          <div class="relative flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-gray-500">
                Text Types
              </p>
              <p class="mt-3 text-3xl font-black text-gray-900 dark:text-white">
                {{ summary.text }}
              </p>
              <p class="mt-1 text-[11px] text-gray-400">
                Uses written responses
              </p>
            </div>

            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400"
            >
              <UIcon name="i-lucide-message-square-text" class="size-5" />
            </div>
          </div>
        </article>

        <article
          class="relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-violet-500/15 via-violet-500/5 to-transparent"
          />
          <div class="relative flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-gray-500">
                Sections
              </p>
              <p class="mt-3 text-3xl font-black text-gray-900 dark:text-white">
                {{ summary.sections }}
              </p>
              <p class="mt-1 text-[11px] text-gray-400">
                Related evaluation sections
              </p>
            </div>

            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400"
            >
              <UIcon name="i-lucide-layout-list" class="size-5" />
            </div>
          </div>
        </article>
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
              Search by name, code, response type, or scale label.
            </p>
          </div>
        </div>

        <span
          v-if="searchQuery.trim() || selectedResponseType !== 'all'"
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
            placeholder="Search evaluation type..."
            class="w-full"
          />
        </UFormField>

        <UFormField label="Response Type">
          <USelectMenu
            v-model="selectedResponseType"
            :items="responseTypeFilterOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>
      </div>

      <div
        class="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <p class="text-xs text-gray-500">
          {{ filteredTypes.length }} result{{
            filteredTypes.length === 1 ? "" : "s"
          }}
        </p>

        <UButton
          v-if="searchQuery.trim() || selectedResponseType !== 'all'"
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
        <UIcon
          name="i-lucide-triangle-alert"
          class="mt-0.5 size-5 shrink-0 text-red-600"
        />
        <div>
          <p class="font-bold text-red-900 dark:text-red-200">
            Unable to load evaluation types
          </p>
          <p class="mt-1 text-xs text-red-700 dark:text-red-300">
            {{ loadError }}
          </p>
        </div>
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
            <UIcon name="i-lucide-workflow" class="size-5" />
          </div>

          <div>
            <p
              class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
            >
              Evaluation Management
            </p>

            <h2 class="mt-1 font-black text-gray-900 dark:text-white">
              Evaluation Type Records
            </h2>

            <p class="mt-1 text-xs text-gray-500">
              Showing {{ paginatedTypes.length }} of
              {{ filteredTypes.length }} record{{
                filteredTypes.length === 1 ? "" : "s"
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
      <div v-if="!filteredTypes.length" class="px-6 py-16 text-center">
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
        >
          <UIcon name="i-lucide-workflow" class="size-7" />
        </div>

        <h3 class="mt-4 font-bold text-gray-900 dark:text-white">
          No evaluation types found
        </h3>

        <p class="mt-2 text-sm text-gray-500">
          Add your first evaluation type or adjust the current filters.
        </p>
      </div>

      <template v-else>
        <!-- DESKTOP TABLE -->
        <div class="hidden overflow-x-auto lg:block">
          <table class="w-full min-w-[1180px] text-sm">
            <thead
              class="border-b border-gray-200 bg-slate-100/80 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600 dark:border-gray-800 dark:bg-gray-950/70 dark:text-slate-400"
            >
              <tr>
                <th class="px-5 py-3.5 text-left">Evaluation Type</th>
                <th class="px-4 py-3.5 text-center">Response Type</th>
                <th class="px-4 py-3.5 text-center">Score Range</th>
                <th class="px-4 py-3.5 text-center">Sections</th>
                <th class="px-4 py-3.5 text-center">Batches</th>
                <th class="px-4 py-3.5 text-left">Configuration</th>
                <th class="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="item in paginatedTypes"
                :key="item.documentId || item.id"
                class="transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-950/10"
              >
                <td class="px-5 py-4">
                  <div class="flex items-start gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-xl"
                      :class="
                        normalizedResponseType(item) === 'text'
                          ? 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400'
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                      "
                    >
                      <UIcon
                        :name="
                          normalizedResponseType(item) === 'text'
                            ? 'i-lucide-message-square-text'
                            : 'i-lucide-star'
                        "
                        class="size-5"
                      />
                    </div>

                    <div class="min-w-0">
                      <p class="font-bold text-gray-900 dark:text-white">
                        {{ item.name || "Unnamed Evaluation Type" }}
                      </p>

                      <p class="mt-1 text-xs text-gray-500">
                        {{ item.code || "No code" }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-4 text-center">
                  <UBadge
                    :color="
                      normalizedResponseType(item) === 'text'
                        ? 'info'
                        : 'primary'
                    "
                    variant="subtle"
                  >
                    {{
                      normalizedResponseType(item) === "text"
                        ? "Text / Comment"
                        : "Rating Scale"
                    }}
                  </UBadge>
                </td>

                <td class="px-4 py-4 text-center">
                  <span
                    v-if="normalizedResponseType(item) === 'rating'"
                    class="inline-flex rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700 dark:bg-violet-950/30 dark:text-violet-300"
                  >
                    {{ item.min_score ?? "—" }} – {{ item.max_score ?? "—" }}
                  </span>

                  <span v-else class="text-xs font-semibold text-gray-400">
                    Not applicable
                  </span>
                </td>

                <td class="px-4 py-4 text-center">
                  <span
                    class="inline-flex min-w-12 items-center justify-center rounded-xl bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                  >
                    {{ relationCount(item.evaluation_sections) }}
                  </span>
                </td>

                <td class="px-4 py-4 text-center">
                  <span
                    class="inline-flex min-w-12 items-center justify-center rounded-xl bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                  >
                    {{ relationCount(item.evaluation_batches) }}
                  </span>
                </td>

                <td class="max-w-[360px] px-4 py-4">
                  <div
                    v-if="normalizedResponseType(item) === 'text'"
                    class="inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300"
                  >
                    <UIcon name="i-lucide-message-square-text" class="size-4" />
                    Written response only
                  </div>

                  <div v-else class="flex flex-wrap gap-1.5">
                    <span
                      v-for="scale in scalePreview(item)"
                      :key="`${item.documentId || item.id}-${scale.score}`"
                      class="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:border-gray-800 dark:bg-gray-950/30 dark:text-gray-300"
                    >
                      {{ scale.score }} = {{ scale.label }}
                    </span>

                    <span
                      v-if="!scalePreview(item).length"
                      class="text-xs text-gray-400"
                    >
                      No scale labels
                    </span>
                  </div>
                </td>

                <td class="px-5 py-4">
                  <div class="flex justify-center gap-2">
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="soft"
                      icon="i-lucide-pencil"
                      @click="openEditDialog(item)"
                    >
                      Edit
                    </UButton>

                    <UButton
                      size="xs"
                      color="error"
                      variant="soft"
                      icon="i-lucide-trash-2"
                      @click="openDeleteDialog(item)"
                    >
                      Delete
                    </UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- MOBILE -->
        <div class="grid gap-3 p-4 lg:hidden">
          <article
            v-for="item in paginatedTypes"
            :key="item.documentId || item.id"
            class="rounded-[22px] border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex size-11 shrink-0 items-center justify-center rounded-2xl"
                :class="
                  normalizedResponseType(item) === 'text'
                    ? 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400'
                    : 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                "
              >
                <UIcon
                  :name="
                    normalizedResponseType(item) === 'text'
                      ? 'i-lucide-message-square-text'
                      : 'i-lucide-star'
                  "
                  class="size-5"
                />
              </div>

              <div class="min-w-0 flex-1">
                <h3 class="font-black text-gray-900 dark:text-white">
                  {{ item.name }}
                </h3>

                <p class="mt-1 truncate text-xs text-gray-500">
                  {{ item.code }}
                </p>
              </div>

              <UBadge
                :color="
                  normalizedResponseType(item) === 'text'
                    ? 'info'
                    : 'primary'
                "
                variant="subtle"
              >
                {{
                  normalizedResponseType(item) === "text"
                    ? "Text"
                    : "Rating"
                }}
              </UBadge>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-2">
              <div class="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-950/30">
                <p class="text-[9px] font-bold uppercase text-gray-400">
                  Score Range
                </p>

                <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                  {{
                    normalizedResponseType(item) === "text"
                      ? "N/A"
                      : `${item.min_score ?? "—"} – ${item.max_score ?? "—"}`
                  }}
                </p>
              </div>

              <div class="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-950/30">
                <p class="text-[9px] font-bold uppercase text-gray-400">
                  Sections
                </p>

                <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                  {{ relationCount(item.evaluation_sections) }}
                </p>
              </div>
            </div>

            <div
              class="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800"
            >
              <UButton
                size="xs"
                color="neutral"
                variant="soft"
                icon="i-lucide-pencil"
                @click="openEditDialog(item)"
              >
                Edit
              </UButton>

              <UButton
                size="xs"
                color="error"
                variant="soft"
                icon="i-lucide-trash-2"
                @click="openDeleteDialog(item)"
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
            Page {{ currentPage }} of {{ totalPages }} ·
            {{ filteredTypes.length }} record{{
              filteredTypes.length === 1 ? "" : "s"
            }}
          </p>

          <UPagination
            v-model:page="currentPage"
            :total="filteredTypes.length"
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
                    Evaluation Management
                  </p>

                  <h2
                    class="mt-1 text-lg font-black text-gray-900 dark:text-white"
                  >
                    Create Evaluation Type
                  </h2>

                  <p class="mt-1 text-xs text-gray-500">
                    Choose how this evaluation type collects responses.
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
              @submit="createEvaluationType"
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
                      class="flex size-12 items-center justify-center rounded-2xl"
                      :class="
                        createForm.response_type === 'text'
                          ? 'bg-cyan-500/15 text-cyan-300'
                          : 'bg-blue-500/15 text-blue-300'
                      "
                    >
                      <UIcon
                        :name="
                          createForm.response_type === 'text'
                            ? 'i-lucide-message-square-text'
                            : 'i-lucide-star'
                        "
                        class="size-6"
                      />
                    </div>

                    <h3 class="mt-4 text-xl font-black">
                      {{ createForm.name || "New Evaluation Type" }}
                    </h3>

                    <p class="mt-1 break-all text-xs text-slate-400">
                      {{ createCode || "evaluation-type-code" }}
                    </p>

                    <div class="mt-5 rounded-xl bg-white/5 px-3 py-3">
                      <p
                        class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                      >
                        Response Type
                      </p>

                      <p class="mt-1 font-black">
                        {{
                          createForm.response_type === "text"
                            ? "Text / Comment"
                            : "Rating Scale"
                        }}
                      </p>
                    </div>

                    <template v-if="createForm.response_type === 'rating'">
                      <div class="mt-3 grid grid-cols-2 gap-2">
                        <div class="rounded-xl bg-white/5 px-3 py-3">
                          <p class="text-[9px] font-bold uppercase text-slate-400">
                            Min Score
                          </p>
                          <p class="mt-1 font-black">
                            {{ createForm.min_score }}
                          </p>
                        </div>

                        <div class="rounded-xl bg-white/5 px-3 py-3">
                          <p class="text-[9px] font-bold uppercase text-slate-400">
                            Max Score
                          </p>
                          <p class="mt-1 font-black">
                            {{ createForm.max_score }}
                          </p>
                        </div>
                      </div>

                      <div class="mt-4 space-y-2">
                        <div
                          v-for="row in createScaleRows"
                          :key="`create-preview-${row.score}`"
                          class="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-3 py-2"
                        >
                          <span class="font-black text-blue-300">
                            {{ row.score }}
                          </span>
                          <span class="truncate text-xs text-slate-300">
                            {{ row.label || "No label yet" }}
                          </span>
                        </div>
                      </div>
                    </template>

                    <div
                      v-else
                      class="mt-4 rounded-xl border border-cyan-400/15 bg-cyan-400/10 p-3 text-xs leading-5 text-cyan-100"
                    >
                      Evaluators will answer using written comments or text
                      responses. No numerical rating scale is used.
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
                      <h3 class="text-sm font-black text-gray-900 dark:text-white">
                        General Information
                      </h3>

                      <p class="mt-0.5 text-xs text-gray-500">
                        Define the evaluation type and how responses are collected.
                      </p>
                    </div>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField
                      label="Evaluation Type Name"
                      required
                      class="sm:col-span-2"
                    >
                      <UInput
                        v-model="createForm.name"
                        placeholder="Example: Student - Faculty"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField
                      label="Generated Code"
                      class="sm:col-span-2"
                    >
                      <UInput
                        :model-value="createCode"
                        disabled
                        class="w-full"
                      />
                    </UFormField>

                    <!-- RESPONSE TYPE SELECTOR -->
                    <UFormField
                      label="Response Type"
                      required
                      class="sm:col-span-2"
                    >
                      <USelectMenu
                        v-model="createForm.response_type"
                        :items="responseTypeOptions"
                        value-key="value"
                        class="w-full"
                      />
                    </UFormField>

                    <template v-if="createForm.response_type === 'rating'">
                      <UFormField label="Minimum Score" required>
                        <UInput
                          v-model.number="createForm.min_score"
                          type="number"
                          step="1"
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField label="Maximum Score" required>
                        <UInput
                          v-model.number="createForm.max_score"
                          type="number"
                          step="1"
                          class="w-full"
                        />
                      </UFormField>
                    </template>

                    <div
                      v-else
                      class="sm:col-span-2 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/20"
                    >
                      <div class="flex items-start gap-3">
                        <UIcon
                          name="i-lucide-message-square-text"
                          class="mt-0.5 size-5 shrink-0 text-cyan-600"
                        />

                        <div>
                          <p
                            class="text-sm font-bold text-cyan-900 dark:text-cyan-200"
                          >
                            Text / Comment Evaluation
                          </p>

                          <p
                            class="mt-1 text-xs leading-5 text-cyan-700 dark:text-cyan-300"
                          >
                            Minimum Score, Maximum Score, and Rating Scale Labels
                            are not used for this evaluation type.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <template v-if="createForm.response_type === 'rating'">
                  <div class="border-t border-gray-100 dark:border-gray-800" />

                  <section>
                    <div
                      class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                        >
                          <UIcon name="i-lucide-star" class="size-4" />
                        </div>

                        <div>
                          <h3
                            class="text-sm font-black text-gray-900 dark:text-white"
                          >
                            Rating Scale Builder
                          </h3>

                          <p class="mt-0.5 text-xs text-gray-500">
                            Enter a label for each numerical score.
                          </p>
                        </div>
                      </div>

                      <span
                        class="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                      >
                        {{ createScaleRows.length }} Levels
                      </span>
                    </div>

                    <div
                      class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
                    >
                      <div
                        class="grid grid-cols-[90px_1fr] border-b border-gray-200 bg-gray-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-950/30"
                      >
                        <span>Score</span>
                        <span>Rating Label</span>
                      </div>

                      <div
                        class="divide-y divide-gray-100 dark:divide-gray-800"
                      >
                        <div
                          v-for="row in createScaleRows"
                          :key="`create-scale-${row.score}`"
                          class="grid grid-cols-[90px_1fr] items-center gap-3 px-4 py-3"
                        >
                          <div
                            class="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                          >
                            {{ row.score }}
                          </div>

                          <UInput
                            v-model="row.label"
                            :placeholder="`Label for score ${row.score}`"
                            class="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </template>

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
                    Create Evaluation Type
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
                    Evaluation Management
                  </p>

                  <h2
                    class="mt-1 text-lg font-black text-gray-900 dark:text-white"
                  >
                    Edit Evaluation Type
                  </h2>

                  <p class="mt-1 text-xs text-gray-500">
                    Update {{ editForm.name || "evaluation type" }}.
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
              @submit="updateEvaluationType"
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
                      class="flex size-12 items-center justify-center rounded-2xl"
                      :class="
                        editForm.response_type === 'text'
                          ? 'bg-cyan-500/15 text-cyan-300'
                          : 'bg-blue-500/15 text-blue-300'
                      "
                    >
                      <UIcon
                        :name="
                          editForm.response_type === 'text'
                            ? 'i-lucide-message-square-text'
                            : 'i-lucide-star'
                        "
                        class="size-6"
                      />
                    </div>

                    <h3 class="mt-4 text-xl font-black">
                      {{ editForm.name || "Evaluation Type" }}
                    </h3>

                    <p class="mt-1 break-all text-xs text-slate-400">
                      {{ editCode || "evaluation-type-code" }}
                    </p>

                    <div class="mt-5 rounded-xl bg-white/5 px-3 py-3">
                      <p
                        class="text-[9px] font-bold uppercase tracking-wide text-slate-400"
                      >
                        Response Type
                      </p>

                      <p class="mt-1 font-black">
                        {{
                          editForm.response_type === "text"
                            ? "Text / Comment"
                            : "Rating Scale"
                        }}
                      </p>
                    </div>

                    <template v-if="editForm.response_type === 'rating'">
                      <div class="mt-3 grid grid-cols-2 gap-2">
                        <div class="rounded-xl bg-white/5 px-3 py-3">
                          <p class="text-[9px] font-bold uppercase text-slate-400">
                            Min Score
                          </p>
                          <p class="mt-1 font-black">
                            {{ editForm.min_score }}
                          </p>
                        </div>

                        <div class="rounded-xl bg-white/5 px-3 py-3">
                          <p class="text-[9px] font-bold uppercase text-slate-400">
                            Max Score
                          </p>
                          <p class="mt-1 font-black">
                            {{ editForm.max_score }}
                          </p>
                        </div>
                      </div>

                      <div class="mt-4 space-y-2">
                        <div
                          v-for="row in editScaleRows"
                          :key="`edit-preview-${row.score}`"
                          class="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-3 py-2"
                        >
                          <span class="font-black text-blue-300">
                            {{ row.score }}
                          </span>

                          <span class="truncate text-xs text-slate-300">
                            {{ row.label || "No label yet" }}
                          </span>
                        </div>
                      </div>
                    </template>

                    <div
                      v-else
                      class="mt-4 rounded-xl border border-cyan-400/15 bg-cyan-400/10 p-3 text-xs leading-5 text-cyan-100"
                    >
                      Written responses only. No numerical rating scale is used.
                    </div>

                    <div
                      v-if="editingType"
                      class="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-4"
                    >
                      <div class="rounded-xl bg-white/5 px-3 py-3">
                        <p class="text-xs text-slate-400">Sections</p>
                        <p class="mt-1 font-black">
                          {{ relationCount(editingType.evaluation_sections) }}
                        </p>
                      </div>

                      <div class="rounded-xl bg-white/5 px-3 py-3">
                        <p class="text-xs text-slate-400">Batches</p>
                        <p class="mt-1 font-black">
                          {{ relationCount(editingType.evaluation_batches) }}
                        </p>
                      </div>
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
                      <h3 class="text-sm font-black text-gray-900 dark:text-white">
                        General Information
                      </h3>

                      <p class="mt-0.5 text-xs text-gray-500">
                        Update the evaluation type and response configuration.
                      </p>
                    </div>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField
                      label="Evaluation Type Name"
                      required
                      class="sm:col-span-2"
                    >
                      <UInput
                        v-model="editForm.name"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField
                      label="Generated Code"
                      class="sm:col-span-2"
                    >
                      <UInput
                        :model-value="editCode"
                        disabled
                        class="w-full"
                      />
                    </UFormField>

                    <!-- RESPONSE TYPE SELECTOR -->
                    <UFormField
                      label="Response Type"
                      required
                      class="sm:col-span-2"
                    >
                      <USelectMenu
                        v-model="editForm.response_type"
                        :items="responseTypeOptions"
                        value-key="value"
                        class="w-full"
                      />
                    </UFormField>

                    <template v-if="editForm.response_type === 'rating'">
                      <UFormField label="Minimum Score" required>
                        <UInput
                          v-model.number="editForm.min_score"
                          type="number"
                          step="1"
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField label="Maximum Score" required>
                        <UInput
                          v-model.number="editForm.max_score"
                          type="number"
                          step="1"
                          class="w-full"
                        />
                      </UFormField>
                    </template>

                    <div
                      v-else
                      class="sm:col-span-2 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/20"
                    >
                      <div class="flex items-start gap-3">
                        <UIcon
                          name="i-lucide-message-square-text"
                          class="mt-0.5 size-5 shrink-0 text-cyan-600"
                        />

                        <div>
                          <p
                            class="text-sm font-bold text-cyan-900 dark:text-cyan-200"
                          >
                            Text / Comment Evaluation
                          </p>

                          <p
                            class="mt-1 text-xs leading-5 text-cyan-700 dark:text-cyan-300"
                          >
                            Saving this type as Text / Comment will set
                            min_score, max_score, and scale_labels to null.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <template v-if="editForm.response_type === 'rating'">
                  <div class="border-t border-gray-100 dark:border-gray-800" />

                  <section>
                    <div
                      class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                        >
                          <UIcon name="i-lucide-star" class="size-4" />
                        </div>

                        <div>
                          <h3
                            class="text-sm font-black text-gray-900 dark:text-white"
                          >
                            Rating Scale Builder
                          </h3>

                          <p class="mt-0.5 text-xs text-gray-500">
                            Update each rating label.
                          </p>
                        </div>
                      </div>

                      <span
                        class="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                      >
                        {{ editScaleRows.length }} Levels
                      </span>
                    </div>

                    <div
                      class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
                    >
                      <div
                        class="grid grid-cols-[90px_1fr] border-b border-gray-200 bg-gray-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-950/30"
                      >
                        <span>Score</span>
                        <span>Rating Label</span>
                      </div>

                      <div
                        class="divide-y divide-gray-100 dark:divide-gray-800"
                      >
                        <div
                          v-for="row in editScaleRows"
                          :key="`edit-scale-${row.score}`"
                          class="grid grid-cols-[90px_1fr] items-center gap-3 px-4 py-3"
                        >
                          <div
                            class="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                          >
                            {{ row.score }}
                          </div>

                          <UInput
                            v-model="row.label"
                            :placeholder="`Label for score ${row.score}`"
                            class="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </template>

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
              Delete Evaluation Type?
            </h2>

            <p class="mt-2 text-sm leading-6 text-gray-500">
              You are about to delete
              <span class="font-bold text-gray-800 dark:text-gray-200">
                {{ deleteTarget?.name || "this evaluation type" }}
              </span>.
            </p>
          </div>

          <div
            v-if="deleteTargetHasRelations"
            class="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300"
          >
            This evaluation type is still connected to evaluation sections or
            batches. Remove or reassign those relationships before deleting it.
          </div>

          <div
            v-else
            class="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs leading-5 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300"
          >
            This action cannot be undone.
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
              :disabled="deleteTargetHasRelations"
              @click="deleteEvaluationType"
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
  role: ["Admin"],
})

const { $api } = useNuxtApp()
const toast = useToast()

const loading = ref(false)
const loadError = ref("")

const evaluationTypes = ref<any[]>([])

const searchQuery = ref("")
const selectedResponseType = ref("all")

const currentPage = ref(1)
const pageSize = ref(10)

const createDialogOpen = ref(false)
const creating = ref(false)

const editDialogOpen = ref(false)
const updating = ref(false)
const editingType = ref<any>(null)

const deleteDialogOpen = ref(false)
const deleting = ref(false)
const deleteTarget = ref<any>(null)

const responseTypeOptions = [
  {
    label: "Rating Scale",
    value: "rating",
  },
  {
    label: "Text / Comment",
    value: "text",
  },
]

const responseTypeFilterOptions = [
  {
    label: "All Response Types",
    value: "all",
  },
  ...responseTypeOptions,
]

const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]

const createForm = reactive({
  name: "",
  response_type: "rating",
  min_score: 1,
  max_score: 5,
})

const editForm = reactive({
  name: "",
  response_type: "rating",
  min_score: 1,
  max_score: 5,
})

const createScaleRows = ref<any[]>([])
const editScaleRows = ref<any[]>([])

const slugify = (value: string) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const createCode = computed(() =>
  slugify(createForm.name),
)

const editCode = computed(() =>
  slugify(editForm.name),
)

const relationCount = (value: any) => {
  if (Array.isArray(value)) {
    return value.length
  }

  if (Array.isArray(value?.data)) {
    return value.data.length
  }

  return 0
}

const normalizeScaleLabels = (value: any) => {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return {}
  }

  if (Array.isArray(value)) {
    const output: Record<string, string> = {}

    value.forEach((item: any) => {
      if (
        item?.score !== undefined &&
        item?.score !== null
      ) {
        output[String(item.score)] =
          String(item.label || "")
      }
    })

    return output
  }

  return value
}

const normalizedResponseType = (item: any) => {
  if (
    item?.response_type === "rating" ||
    item?.response_type === "text"
  ) {
    return item.response_type
  }

  const noScores =
    item?.min_score === null ||
    item?.min_score === undefined

  const noMaxScore =
    item?.max_score === null ||
    item?.max_score === undefined

  const noScale =
    !item?.scale_labels ||
    !Object.keys(
      normalizeScaleLabels(
        item?.scale_labels,
      ),
    ).length

  return noScores &&
    noMaxScore &&
    noScale
    ? "text"
    : "rating"
}

const scalePreview = (item: any) =>
  Object.entries(
    normalizeScaleLabels(
      item?.scale_labels,
    ),
  )
    .map(([score, label]) => ({
      score: Number(score),
      label: String(label || ""),
    }))
    .sort(
      (a, b) =>
        a.score - b.score,
    )

const filteredTypes = computed(() => {
  const query =
    searchQuery.value
      .trim()
      .toLowerCase()

  return evaluationTypes.value.filter(
    (item: any) => {
      const responseType =
        normalizedResponseType(item)

      const matchesType =
        selectedResponseType.value === "all" ||
        selectedResponseType.value === responseType

      const scaleText =
        scalePreview(item)
          .map(
            (entry) =>
              `${entry.score} ${entry.label}`,
          )
          .join(" ")

      const searchable = [
        item.name,
        item.code,
        responseType,
        item.min_score,
        item.max_score,
        scaleText,
      ]
        .filter(
          (value) =>
            value !== null &&
            value !== undefined,
        )
        .join(" ")
        .toLowerCase()

      const matchesSearch =
        !query ||
        searchable.includes(query)

      return (
        matchesSearch &&
        matchesType
      )
    },
  )
})

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(
      filteredTypes.value.length /
        pageSize.value,
    ),
  ),
)

const paginatedTypes = computed(() => {
  const start =
    (currentPage.value - 1) *
    pageSize.value

  return filteredTypes.value.slice(
    start,
    start + pageSize.value,
  )
})

const summary = computed(() => ({
  total:
    evaluationTypes.value.length,

  rating:
    evaluationTypes.value.filter(
      (item) =>
        normalizedResponseType(item) ===
        "rating",
    ).length,

  text:
    evaluationTypes.value.filter(
      (item) =>
        normalizedResponseType(item) ===
        "text",
    ).length,

  sections:
    evaluationTypes.value.reduce(
      (total, item) =>
        total +
        relationCount(
          item.evaluation_sections,
        ),
      0,
    ),
}))

const makeScaleRows = (
  min: number,
  max: number,
  existing: Record<string, any> = {},
) => {
  const safeMin = Number(min)
  const safeMax = Number(max)

  if (
    !Number.isInteger(safeMin) ||
    !Number.isInteger(safeMax) ||
    safeMax < safeMin
  ) {
    return []
  }

  const rows = []

  for (
    let score = safeMin;
    score <= safeMax;
    score += 1
  ) {
    rows.push({
      score,
      label:
        existing[String(score)] ?? "",
    })
  }

  return rows
}

const rebuildCreateScaleRows = () => {
  if (
    createForm.response_type !==
    "rating"
  ) {
    createScaleRows.value = []
    return
  }

  const previous: Record<string, string> = {}

  createScaleRows.value.forEach(
    (row) => {
      previous[String(row.score)] =
        row.label
    },
  )

  createScaleRows.value =
    makeScaleRows(
      createForm.min_score,
      createForm.max_score,
      previous,
    )
}

const rebuildEditScaleRows = () => {
  if (
    editForm.response_type !==
    "rating"
  ) {
    editScaleRows.value = []
    return
  }

  const previous: Record<string, string> = {}

  editScaleRows.value.forEach(
    (row) => {
      previous[String(row.score)] =
        row.label
    },
  )

  editScaleRows.value =
    makeScaleRows(
      editForm.min_score,
      editForm.max_score,
      previous,
    )
}

const scaleRowsToJson = (
  rows: any[],
) => {
  const output: Record<string, string> = {}

  rows.forEach((row) => {
    output[String(row.score)] =
      String(row.label || "").trim()
  })

  return output
}

const createValidationMessage = computed(() => {
  if (!createForm.name.trim()) {
    return "Evaluation type name is required."
  }

  if (!createCode.value) {
    return "A valid code could not be generated."
  }

  const duplicate =
    evaluationTypes.value.some(
      (item: any) =>
        String(item.name || "")
          .trim()
          .toLowerCase() ===
          createForm.name
            .trim()
            .toLowerCase() ||
        String(item.code || "")
          .trim()
          .toLowerCase() ===
          createCode.value.toLowerCase(),
    )

  if (duplicate) {
    return "An evaluation type with the same name or code already exists."
  }

  if (
    createForm.response_type ===
    "text"
  ) {
    return ""
  }

  if (
    !Number.isInteger(
      Number(createForm.min_score),
    ) ||
    !Number.isInteger(
      Number(createForm.max_score),
    )
  ) {
    return "Minimum and maximum scores must be whole numbers."
  }

  if (
    Number(createForm.max_score) <
    Number(createForm.min_score)
  ) {
    return "Maximum score must be greater than or equal to minimum score."
  }

  if (!createScaleRows.value.length) {
    return "The rating scale must contain at least one level."
  }

  const emptyLabel =
    createScaleRows.value.find(
      (row) =>
        !String(row.label || "").trim(),
    )

  if (emptyLabel) {
    return `Please provide a rating label for score ${emptyLabel.score}.`
  }

  return ""
})

const editValidationMessage = computed(() => {
  if (!editForm.name.trim()) {
    return "Evaluation type name is required."
  }

  if (!editCode.value) {
    return "A valid code could not be generated."
  }

  const duplicate =
    evaluationTypes.value.some(
      (item: any) =>
        item.documentId !==
          editingType.value?.documentId &&
        (
          String(item.name || "")
            .trim()
            .toLowerCase() ===
            editForm.name
              .trim()
              .toLowerCase() ||
          String(item.code || "")
            .trim()
            .toLowerCase() ===
            editCode.value.toLowerCase()
        ),
    )

  if (duplicate) {
    return "Another evaluation type with the same name or code already exists."
  }

  if (
    editForm.response_type ===
    "text"
  ) {
    return ""
  }

  if (
    !Number.isInteger(
      Number(editForm.min_score),
    ) ||
    !Number.isInteger(
      Number(editForm.max_score),
    )
  ) {
    return "Minimum and maximum scores must be whole numbers."
  }

  if (
    Number(editForm.max_score) <
    Number(editForm.min_score)
  ) {
    return "Maximum score must be greater than or equal to minimum score."
  }

  if (!editScaleRows.value.length) {
    return "The rating scale must contain at least one level."
  }

  const emptyLabel =
    editScaleRows.value.find(
      (row) =>
        !String(row.label || "").trim(),
    )

  if (emptyLabel) {
    return `Please provide a rating label for score ${emptyLabel.score}.`
  }

  return ""
})

const resetCreateForm = () => {
  createForm.name = ""
  createForm.response_type = "rating"
  createForm.min_score = 1
  createForm.max_score = 5

  createScaleRows.value = [
    { score: 1, label: "Poor" },
    { score: 2, label: "Fair" },
    {
      score: 3,
      label: "Satisfactory",
    },
    {
      score: 4,
      label: "Very Satisfactory",
    },
    {
      score: 5,
      label: "Excellent",
    },
  ]
}

const openCreateDialog = () => {
  resetCreateForm()
  createDialogOpen.value = true
}

const createEvaluationType = async () => {
  if (
    createValidationMessage.value
  ) {
    toast.add({
      title:
        "Unable to create evaluation type",
      description:
        createValidationMessage.value,
      color: "error",
      icon:
        "i-lucide-triangle-alert",
    })

    return
  }

  creating.value = true

  try {
    const response: any =
      await $api(
        "/evaluation-types",
        {
          method: "POST",
          body: {
            data: {
              name:
                createForm.name.trim(),

              code:
                createCode.value,

              response_type:
                createForm.response_type,

              min_score:
                createForm.response_type === "rating"
                  ? Number(createForm.min_score)
                  : null,

              max_score:
                createForm.response_type === "rating"
                  ? Number(createForm.max_score)
                  : null,

              scale_labels:
                createForm.response_type === "rating"
                  ? scaleRowsToJson(
                      createScaleRows.value,
                    )
                  : null,
            },
          },
        },
      )

    if (response?.data) {
      evaluationTypes.value.push(
        response.data,
      )
    } else {
      await loadData()
    }

    evaluationTypes.value.sort(
      (a: any, b: any) =>
        String(a.name || "").localeCompare(
          String(b.name || ""),
        ),
    )

    toast.add({
      title:
        "Evaluation type created",
      description:
        `${createForm.name} was created successfully.`,
      color: "success",
      icon:
        "i-lucide-circle-check-big",
    })

    createDialogOpen.value = false
  } catch (error: any) {
    console.error(
      "Create evaluation type error:",
      error,
    )

    toast.add({
      title:
        "Unable to create evaluation type",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "The evaluation type could not be created.",
      color: "error",
      icon:
        "i-lucide-triangle-alert",
    })
  } finally {
    creating.value = false
  }
}

const openEditDialog = (
  item: any,
) => {
  editingType.value = item

  editForm.name =
    item.name || ""

  editForm.response_type =
    normalizedResponseType(item)

  editForm.min_score =
    Number(
      item.min_score ?? 1,
    )

  editForm.max_score =
    Number(
      item.max_score ?? 5,
    )

  editScaleRows.value =
    editForm.response_type === "rating"
      ? makeScaleRows(
          editForm.min_score,
          editForm.max_score,
          normalizeScaleLabels(
            item.scale_labels,
          ),
        )
      : []

  editDialogOpen.value = true
}

const updateEvaluationType = async () => {
  if (
    !editingType.value?.documentId
  ) {
    return
  }

  if (
    editValidationMessage.value
  ) {
    toast.add({
      title:
        "Unable to update evaluation type",
      description:
        editValidationMessage.value,
      color: "error",
      icon:
        "i-lucide-triangle-alert",
    })

    return
  }

  updating.value = true

  try {
    const response: any =
      await $api(
        `/evaluation-types/${editingType.value.documentId}`,
        {
          method: "PUT",
          body: {
            data: {
              name:
                editForm.name.trim(),

              code:
                editCode.value,

              response_type:
                editForm.response_type,

              min_score:
                editForm.response_type === "rating"
                  ? Number(editForm.min_score)
                  : null,

              max_score:
                editForm.response_type === "rating"
                  ? Number(editForm.max_score)
                  : null,

              scale_labels:
                editForm.response_type === "rating"
                  ? scaleRowsToJson(
                      editScaleRows.value,
                    )
                  : null,
            },
          },
        },
      )

    const updated =
      response?.data

    if (updated) {
      const index =
        evaluationTypes.value.findIndex(
          (item: any) =>
            item.documentId ===
            editingType.value.documentId,
        )

      if (index !== -1) {
        evaluationTypes.value[index] =
          updated
      }
    } else {
      await loadData()
    }

    evaluationTypes.value.sort(
      (a: any, b: any) =>
        String(a.name || "").localeCompare(
          String(b.name || ""),
        ),
    )

    toast.add({
      title:
        "Evaluation type updated",
      description:
        `${editForm.name} was updated successfully.`,
      color: "success",
      icon:
        "i-lucide-circle-check-big",
    })

    editDialogOpen.value = false
    editingType.value = null
  } catch (error: any) {
    console.error(
      "Update evaluation type error:",
      error,
    )

    toast.add({
      title:
        "Unable to update evaluation type",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "The evaluation type could not be updated.",
      color: "error",
      icon:
        "i-lucide-triangle-alert",
    })
  } finally {
    updating.value = false
  }
}

const deleteTargetHasRelations =
  computed(() => {
    if (!deleteTarget.value) {
      return false
    }

    return (
      relationCount(
        deleteTarget.value
          .evaluation_sections,
      ) > 0 ||
      relationCount(
        deleteTarget.value
          .evaluation_batches,
      ) > 0
    )
  })

const openDeleteDialog = (
  item: any,
) => {
  deleteTarget.value = item
  deleteDialogOpen.value = true
}

const deleteEvaluationType = async () => {
  if (
    !deleteTarget.value?.documentId ||
    deleteTargetHasRelations.value
  ) {
    return
  }

  deleting.value = true

  try {
    await $api(
      `/evaluation-types/${deleteTarget.value.documentId}`,
      {
        method: "DELETE",
      },
    )

    evaluationTypes.value =
      evaluationTypes.value.filter(
        (item: any) =>
          item.documentId !==
          deleteTarget.value.documentId,
      )

    toast.add({
      title:
        "Evaluation type deleted",
      description:
        `${deleteTarget.value.name} was deleted successfully.`,
      color: "success",
      icon:
        "i-lucide-circle-check-big",
    })

    deleteDialogOpen.value = false
    deleteTarget.value = null
  } catch (error: any) {
    console.error(
      "Delete evaluation type error:",
      error,
    )

    toast.add({
      title:
        "Unable to delete evaluation type",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "The evaluation type could not be deleted.",
      color: "error",
      icon:
        "i-lucide-triangle-alert",
    })
  } finally {
    deleting.value = false
  }
}

const clearFilters = () => {
  searchQuery.value = ""
  selectedResponseType.value = "all"
}

const loadData = async () => {
  loading.value = true
  loadError.value = ""

  try {
    const response: any =
      await $api(
        "/evaluation-types",
        {
          query: {
            "populate[evaluation_sections]":
              true,

            "populate[evaluation_batches]":
              true,

            "sort[0]":
              "name:asc",

            "pagination[page]":
              1,

            "pagination[pageSize]":
              1000,
          },
        },
      )

    evaluationTypes.value =
      response?.data || []
  } catch (error: any) {
    console.error(
      "Evaluation type loading error:",
      error,
    )

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to load evaluation types."
  } finally {
    loading.value = false
  }
}

watch(
  [
    () => createForm.min_score,
    () => createForm.max_score,
  ],
  () => {
    if (
      createForm.response_type ===
      "rating"
    ) {
      rebuildCreateScaleRows()
    }
  },
)

watch(
  [
    () => editForm.min_score,
    () => editForm.max_score,
  ],
  () => {
    if (
      editForm.response_type ===
      "rating"
    ) {
      rebuildEditScaleRows()
    }
  },
)

watch(
  () => createForm.response_type,
  (type) => {
    if (type === "text") {
      createScaleRows.value = []
      return
    }

    createForm.min_score =
      Number.isInteger(
        Number(
          createForm.min_score,
        ),
      )
        ? Number(
            createForm.min_score,
          )
        : 1

    createForm.max_score =
      Number.isInteger(
        Number(
          createForm.max_score,
        ),
      )
        ? Number(
            createForm.max_score,
          )
        : 5

    if (
      createForm.max_score <
      createForm.min_score
    ) {
      createForm.min_score = 1
      createForm.max_score = 5
    }

    rebuildCreateScaleRows()
  },
)

watch(
  () => editForm.response_type,
  (type) => {
    if (type === "text") {
      editScaleRows.value = []
      return
    }

    editForm.min_score =
      Number.isInteger(
        Number(
          editForm.min_score,
        ),
      )
        ? Number(
            editForm.min_score,
          )
        : 1

    editForm.max_score =
      Number.isInteger(
        Number(
          editForm.max_score,
        ),
      )
        ? Number(
            editForm.max_score,
          )
        : 5

    if (
      editForm.max_score <
      editForm.min_score
    ) {
      editForm.min_score = 1
      editForm.max_score = 5
    }

    rebuildEditScaleRows()
  },
)

watch(
  [
    searchQuery,
    selectedResponseType,
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
      currentPage.value = pages
    }
  },
)

onMounted(loadData)
</script>
