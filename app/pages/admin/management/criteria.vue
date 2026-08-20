<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span
            class="text-sm font-medium uppercase tracking-wide text-gray-500"
          >
            Evaluation Criteria Management
          </span>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-5 pb-8">
        <section
          class="relative overflow-hidden rounded-[28px] border border-indigo-200 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-5 py-6 text-white shadow-xl shadow-indigo-900/10 sm:px-7"
        >
          <div
            class="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
          />
          <div
            class="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"
          >
            <div class="flex items-start gap-4">
              <div
                class="hidden size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 sm:flex"
              >
                <UIcon name="i-lucide-list-checks" class="size-7" />
              </div>
              <div>
                <div
                  class="mb-2 flex flex-wrap gap-2 text-xs font-medium text-indigo-50"
                >
                  <span
                    class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1"
                    >Administrator Portal</span
                  >
                  <span
                    class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1"
                    >Form Builder</span
                  >
                </div>
                <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
                  Evaluation Criteria
                </h1>
                <p class="mt-2 max-w-2xl text-sm leading-6 text-indigo-50/90">
                  Organise evaluation statements using collapsible evaluation
                  types and sections.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
              <div
                class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
              >
                <p class="text-2xl font-bold">{{ criteria.length }}</p>
                <p
                  class="mt-1 text-[10px] uppercase tracking-wide text-indigo-100"
                >
                  Criteria
                </p>
              </div>
              <div
                class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
              >
                <p class="text-2xl font-bold">
                  {{ groupedByEvaluationType.length }}
                </p>
                <p
                  class="mt-1 text-[10px] uppercase tracking-wide text-indigo-100"
                >
                  Types
                </p>
              </div>
              <div
                class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
              >
                <p class="text-2xl font-bold">{{ sections.length }}</p>
                <p
                  class="mt-1 text-[10px] uppercase tracking-wide text-indigo-100"
                >
                  Sections
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5"
        >
          <div
            class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
          >
            <div
              class="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
            >
              <UInput
                v-model="globalFilter"
                icon="i-lucide-search"
                placeholder="Search criteria, order, or section..."
              />
              <USelectMenu
                v-model="selectedEvaluationType"
                :items="evaluationTypeFilterOptions"
                value-key="value"
              />
              <USelectMenu
                v-model="selectedSection"
                :items="sectionFilterOptions"
                value-key="value"
              />
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-chevrons-down"
                @click="expandAllVisible"
                >Expand all</UButton
              >
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-chevrons-up"
                @click="collapseAll"
                >Collapse all</UButton
              >
              <UButton
                v-if="selectedCount"
                color="error"
                variant="soft"
                icon="i-lucide-trash-2"
                @click="requestDeleteSelected"
              >
                Delete <UKbd class="ml-1">{{ selectedCount }}</UKbd>
              </UButton>
              <UButton
                color="neutral"
                variant="outline"
                icon="i-lucide-eye"
                @click="openPreviewModal"
                >Preview</UButton
              >
              <UButton icon="i-lucide-plus" @click="openCreateModal()"
                >New Criterion</UButton
              >
            </div>
          </div>

          <div
            v-if="hasActiveFilters"
            class="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-800"
          >
            <span class="text-xs font-medium text-gray-500"
              >Active filters:</span
            >
            <UBadge v-if="globalFilter" color="neutral" variant="soft"
              >Search: {{ globalFilter }}</UBadge
            >
            <UBadge
              v-if="selectedEvaluationType !== 'all'"
              color="primary"
              variant="soft"
              >{{ selectedEvaluationTypeLabel }}</UBadge
            >
            <UBadge
              v-if="selectedSection !== 'all'"
              color="primary"
              variant="soft"
              >{{ selectedSectionLabel }}</UBadge
            >
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              @click="clearFilters"
              >Clear</UButton
            >
          </div>
        </section>

        <section v-if="loading" class="space-y-3">
          <USkeleton v-for="n in 4" :key="n" class="h-20 rounded-2xl" />
        </section>

        <section
          v-else-if="loadError"
          class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/20"
        >
          <UIcon
            name="i-lucide-triangle-alert"
            class="mx-auto size-10 text-red-500"
          />
          <h2 class="mt-3 font-bold text-red-700 dark:text-red-300">
            Unable to load evaluation criteria
          </h2>
          <p class="mt-1 text-sm text-red-600/80">{{ loadError }}</p>
          <UButton
            class="mt-4"
            color="error"
            variant="soft"
            icon="i-lucide-refresh-cw"
            @click="refreshData"
            >Try again</UButton
          >
        </section>

        <section
          v-else-if="!filteredGroupedByEvaluationType.length"
          class="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900"
        >
          <UIcon
            name="i-lucide-list-filter"
            class="mx-auto size-12 text-gray-300"
          />
          <h2 class="mt-4 text-lg font-bold">No criteria found</h2>
          <p class="mt-1 text-sm text-gray-500">
            Adjust your filters or create a new criterion.
          </p>
        </section>

        <section v-else class="space-y-3">
          <article
            v-for="typeGroup in filteredGroupedByEvaluationType"
            :key="typeGroup.id"
            class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <button
              type="button"
              class="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800/60 sm:px-5"
              @click="toggleType(typeGroup.id)"
            >
              <div
                class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white"
              >
                <UIcon name="i-lucide-clipboard-list" class="size-5" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="truncate font-bold text-gray-900 dark:text-white">
                    {{ typeGroup.title }}
                  </h2>
                  <UBadge color="primary" variant="subtle"
                    >{{ typeGroup.criteriaCount }} criteria</UBadge
                  >
                  <UBadge color="neutral" variant="soft"
                    >{{ typeGroup.sections.length }} sections</UBadge
                  >
                </div>
                <p class="mt-1 text-xs text-gray-500">
                  Click to
                  {{ isTypeOpen(typeGroup.id) ? "collapse" : "expand" }}
                </p>
              </div>
              <UIcon
                :name="
                  isTypeOpen(typeGroup.id)
                    ? 'i-lucide-chevron-up'
                    : 'i-lucide-chevron-down'
                "
                class="size-5 text-gray-400"
              />
            </button>

            <div
              v-if="isTypeOpen(typeGroup.id)"
              class="space-y-2 border-t border-gray-200 bg-gray-50/70 p-3 dark:border-gray-800 dark:bg-gray-950/30 sm:p-4"
            >
              <article
                v-for="section in typeGroup.sections"
                :key="section.id"
                class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              >
                <div class="flex items-center gap-3 px-3 py-3 sm:px-4">
                  <button
                    type="button"
                    class="flex min-w-0 flex-1 items-center gap-3 text-left"
                    @click="toggleSection(section.id)"
                  >
                    <div
                      class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                    >
                      <UIcon name="i-lucide-folder-tree" class="size-4" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3
                          class="truncate text-sm font-bold text-gray-900 dark:text-white"
                        >
                          {{ section.title }}
                        </h3>
                        <UBadge size="sm" color="neutral" variant="soft">{{
                          section.evaluation_criteria.length
                        }}</UBadge>
                      </div>
                      <p class="mt-0.5 text-[11px] text-gray-500">
                        Section order #{{ section.order }}
                      </p>
                    </div>
                    <UIcon
                      :name="
                        isSectionOpen(section.id)
                          ? 'i-lucide-chevron-up'
                          : 'i-lucide-chevron-down'
                      "
                      class="size-4 shrink-0 text-gray-400"
                    />
                  </button>

                  <div class="flex shrink-0 items-center gap-1">
                    <UCheckbox
                      :model-value="isSectionSelected(section)"
                      :indeterminate="isSectionPartiallySelected(section)"
                      @update:model-value="
                        toggleSectionSelection(section, !!$event)
                      "
                    />
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-plus"
                      square
                      aria-label="Add criterion"
                      @click="openCreateModal(section.id)"
                    />
                  </div>
                </div>

                <div
                  v-if="isSectionOpen(section.id)"
                  class="border-t border-gray-100 dark:border-gray-800"
                >
                  <div
                    v-for="(row, index) in section.evaluation_criteria"
                    :key="getRowKey(row)"
                    class="group flex items-start gap-3 border-b border-gray-100 px-3 py-3 last:border-b-0 hover:bg-indigo-50/40 dark:border-gray-800 dark:hover:bg-indigo-950/10 sm:px-4"
                  >
                    <UCheckbox
                      class="mt-1"
                      :model-value="isRowSelected(row)"
                      @update:model-value="toggleRowSelection(row, !!$event)"
                    />
                    <div
                      class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    >
                      {{ row.order }}
                    </div>
                    <div class="min-w-0 flex-1">
                      <p
                        class="text-sm leading-6 text-gray-800 dark:text-gray-100"
                      >
                        {{ row.statement }}
                      </p>
                    </div>
                    <div class="flex shrink-0 items-center gap-0.5">
                      <UButton
                        icon="i-lucide-chevron-up"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                        square
                        :disabled="index === 0 || movingId === getRowKey(row)"
                        aria-label="Move up"
                        @click="moveCriterion(section, index, -1)"
                      />
                      <UButton
                        icon="i-lucide-chevron-down"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                        square
                        :disabled="
                          index === section.evaluation_criteria.length - 1 ||
                          movingId === getRowKey(row)
                        "
                        aria-label="Move down"
                        @click="moveCriterion(section, index, 1)"
                      />
                      <UDropdownMenu :items="getDropdownActions(row)">
                        <UButton
                          icon="i-lucide-ellipsis-vertical"
                          color="neutral"
                          variant="ghost"
                          size="xs"
                          square
                          aria-label="Criterion actions"
                        />
                      </UDropdownMenu>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </article>
        </section>

        <UModal
          v-model:open="formModal"
          :title="
            isEditing ? 'Edit Evaluation Criterion' : 'Add Evaluation Criterion'
          "
          :description="
            isEditing
              ? 'Update the selected evaluation statement.'
              : 'Add a new statement to an evaluation section.'
          "
          :ui="{ content: 'max-w-2xl' }"
        >
          <template #content>
            <div
              class="max-h-[88vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900"
            >
              <div
                class="rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-6 py-6 text-white"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h2 class="text-xl font-bold">
                      {{
                        isEditing
                          ? "Edit Evaluation Criterion"
                          : "Add Evaluation Criterion"
                      }}
                    </h2>
                    <p class="mt-1 text-xs text-slate-300">
                      Configure the section, order, and evaluation statement.
                    </p>
                  </div>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    square
                    class="text-white"
                    @click="formModal = false"
                  />
                </div>
              </div>
              <UForm
                :state="form"
                class="space-y-5 p-6"
                @submit="saveCriterion"
              >
                <UFormField label="Evaluation Section" name="section" required>
                  <USelectMenu
                    v-model="form.section"
                    :items="sectionOptions"
                    value-key="value"
                    placeholder="Select evaluation section"
                    class="w-full"
                  />
                </UFormField>
                <UFormField label="Display Order" name="order" required>
                  <UInput
                    v-model="form.order"
                    type="number"
                    min="1"
                    class="w-full"
                  />
                </UFormField>
                <UFormField
                  label="Evaluation Statement"
                  name="statement"
                  required
                >
                  <UTextarea
                    v-model="form.statement"
                    placeholder="Enter the evaluation statement"
                    class="w-full"
                    :rows="5"
                    autoresize
                  />
                </UFormField>
                <div
                  class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800"
                >
                  <UButton
                    color="neutral"
                    variant="outline"
                    type="button"
                    @click="formModal = false"
                    >Cancel</UButton
                  >
                  <UButton
                    type="submit"
                    icon="i-lucide-save"
                    :loading="saving"
                    :disabled="saving"
                    >{{
                      isEditing ? "Save Changes" : "Save Criterion"
                    }}</UButton
                  >
                </div>
              </UForm>
            </div>
          </template>
        </UModal>

        <UModal
          v-model:open="deleteModal"
          title="Confirm Criteria Deletion"
          description="Confirm permanent deletion of the selected evaluation criterion or criteria."
          :ui="{ content: 'max-w-md' }"
        >
          <template #content>
            <div class="rounded-[24px] bg-white p-6 dark:bg-gray-900">
              <div
                class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
              >
                <UIcon name="i-lucide-trash-2" class="size-7" />
              </div>
              <h2 class="mt-4 text-center text-xl font-bold">
                {{
                  deleteMode === "multiple"
                    ? "Delete selected criteria?"
                    : "Delete this criterion?"
                }}
              </h2>
              <p class="mt-2 text-center text-sm leading-6 text-gray-500">
                {{
                  deleteMode === "multiple"
                    ? `This will permanently delete ${selectedCount} selected criteria.`
                    : "This evaluation statement will be permanently removed."
                }}
              </p>
              <div class="mt-6 flex gap-2">
                <UButton
                  color="neutral"
                  variant="outline"
                  class="flex-1 justify-center"
                  @click="deleteModal = false"
                  >Cancel</UButton
                >
                <UButton
                  color="error"
                  icon="i-lucide-trash-2"
                  class="flex-1 justify-center"
                  :loading="deleting"
                  @click="confirmDelete"
                  >Delete</UButton
                >
              </div>
            </div>
          </template>
        </UModal>

        <UModal
          v-model:open="previewModal"
          title="Evaluation Form Preview"
          description="Preview criteria for one selected evaluation type."
          :ui="{ content: 'max-w-4xl' }"
        >
          <template #content>
            <div
              class="max-h-[88vh] overflow-y-auto rounded-[24px] bg-gray-50 p-6 dark:bg-gray-950"
            >
              <div
                class="mb-5 flex flex-col gap-4 border-b border-gray-200 pb-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 class="text-xl font-bold">Evaluation Form Preview</h2>
                  <p class="mt-1 text-sm text-gray-500">
                    Preview one evaluation form at a time.
                  </p>
                </div>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-x"
                  square
                  @click="previewModal = false"
                />
              </div>

              <div
                class="mb-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <UFormField
                  label="Evaluation Type"
                  name="previewEvaluationType"
                >
                  <USelectMenu
                    v-model="previewEvaluationType"
                    :items="previewEvaluationTypeOptions"
                    value-key="value"
                    placeholder="Select evaluation type"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <div v-if="previewTypeGroup" class="space-y-4">
                <div class="rounded-2xl bg-indigo-600 px-5 py-4 text-white">
                  <div
                    class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p
                        class="text-xs font-medium uppercase tracking-wide text-indigo-100"
                      >
                        Evaluation Type
                      </p>
                      <h3 class="mt-1 text-lg font-bold">
                        {{ previewTypeGroup.title }}
                      </h3>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <UBadge color="neutral" variant="solid"
                        >{{ previewTypeGroup.sections.length }} sections</UBadge
                      >
                      <UBadge color="neutral" variant="solid"
                        >{{ previewTypeGroup.criteriaCount }} criteria</UBadge
                      >
                    </div>
                  </div>
                </div>

                <div
                  v-for="section in previewTypeGroup.sections"
                  :key="section.id"
                  class="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-gray-900 sm:px-6"
                >
                  <h4
                    class="text-base font-bold text-indigo-600 dark:text-indigo-400"
                  >
                    {{ section.title }}
                  </h4>

                  <div class="mt-5 space-y-6">
                    <div
                      v-for="(row, rowIndex) in section.evaluation_criteria"
                      :key="getRowKey(row)"
                    >
                      <div class="flex items-start gap-3">
                        <span
                          class="w-5 shrink-0 pt-0.5 text-sm font-semibold text-gray-400"
                        >
                          {{ rowIndex + 1 }}.
                        </span>
                        <p
                          class="text-sm leading-6 text-gray-800 dark:text-gray-100"
                        >
                          {{ row.statement }}
                        </p>
                      </div>

                      <div class="mt-3 flex flex-wrap gap-2 pl-8">
                        <button
                          v-for="choice in previewChoices"
                          :key="`${getRowKey(row)}-${choice.value}`"
                          type="button"
                          disabled
                          class="flex size-8 cursor-not-allowed items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-400 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500"
                          :aria-label="`Rating ${choice.value}`"
                        >
                          {{ choice.value }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900"
              >
                <UIcon
                  name="i-lucide-file-search"
                  class="mx-auto size-10 text-gray-300"
                />
                <h3 class="mt-3 font-bold">No evaluation type selected</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Choose an evaluation type to preview its form.
                </p>
              </div>
            </div>
          </template>
        </UModal>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
// @ts-nocheck
definePageMeta({ middleware: ["auth", "role"], role: ["Admin", "HR"] });

import type { DropdownMenuItem } from "@nuxt/ui";

const { $api } = useNuxtApp();
const toast = useToast();

const loading = ref(true);
const loadError = ref("");
const saving = ref(false);
const deleting = ref(false);
const movingId = ref(null);

const criteria = ref<any[]>([]);
const sections = ref<any[]>([]);
const globalFilter = ref("");
const selectedEvaluationType = ref("all");
const selectedSection = ref("all");
const selectedRows = ref<Record<string, boolean>>({});

const formModal = ref(false);
const previewModal = ref(false);
const previewEvaluationType = ref<string | null>(null);
const deleteModal = ref(false);
const isEditing = ref(false);
const selectedId = ref(null);
const deleteTarget = ref<any>(null);
const deleteMode = ref<"single" | "multiple">("single");

const openTypeIds = ref<Record<string, boolean>>({});
const openSectionIds = ref<Record<string, boolean>>({});

const form = reactive({ statement: "", order: 1 as any, section: null as any });

// Preview-only Likert choices. Update these labels if your live evaluation form
// uses different wording or scoring.
const previewChoices = [
  { value: 5, label: "Strongly Agree" },
  { value: 4, label: "Agree" },
  { value: 3, label: "Neutral" },
  { value: 2, label: "Disagree" },
  { value: 1, label: "Strongly Disagree" },
];

const evaluationTypes = computed(() => {
  const map = new Map<string, any>();
  for (const section of sections.value) {
    const type = section.evaluation_type;
    if (!type) continue;
    const key = String(type.id || type.documentId || type.code || type.name);
    if (!map.has(key)) map.set(key, type);
  }
  return [...map.values()].sort((a: any, b: any) =>
    String(a.name || a.title || a.code || "").localeCompare(
      String(b.name || b.title || b.code || ""),
    ),
  );
});

const sectionOptions = computed(() =>
  sections.value.map((section: any) => ({
    label: `${section.evaluation_type?.name || section.evaluation_type?.title || section.evaluation_type?.code || "Unassigned"} — ${section.title}`,
    value: section.documentId || section.id,
  })),
);

const evaluationTypeFilterOptions = computed(() => [
  { label: "All Evaluation Types", value: "all" },
  ...evaluationTypes.value.map((type: any) => ({
    label: type.name || type.title || type.code || "Unnamed Type",
    value: String(type.id || type.documentId || type.code || type.name),
  })),
]);

const previewEvaluationTypeOptions = computed(() =>
  groupedByEvaluationType.value.map((group: any) => ({
    label: `${group.title} (${group.criteriaCount} criteria)`,
    value: String(group.id),
  })),
);

const previewTypeGroup = computed(
  () =>
    groupedByEvaluationType.value.find(
      (group: any) =>
        String(group.id) === String(previewEvaluationType.value || ""),
    ) || null,
);

const sectionFilterOptions = computed(() => [
  { label: "All Evaluation Sections", value: "all" },
  ...sections.value
    .filter(
      (section: any) =>
        selectedEvaluationType.value === "all" ||
        getEvaluationTypeKey(section.evaluation_type) ===
          selectedEvaluationType.value,
    )
    .map((section: any) => ({
      label: section.title,
      value: String(section.documentId || section.id),
    })),
]);
const selectedEvaluationTypeLabel = computed(
  () =>
    evaluationTypeFilterOptions.value.find(
      (x) => x.value === selectedEvaluationType.value,
    )?.label || "Evaluation Type",
);
const selectedSectionLabel = computed(
  () =>
    sectionFilterOptions.value.find((x) => x.value === selectedSection.value)
      ?.label || "Section",
);
const selectedCount = computed(
  () => Object.values(selectedRows.value).filter(Boolean).length,
);
const hasActiveFilters = computed(() =>
  Boolean(
    globalFilter.value ||
    selectedEvaluationType.value !== "all" ||
    selectedSection.value !== "all",
  ),
);

const groupedCriteria = computed(() => {
  const grouped: Record<string, any> = {};
  for (const item of criteria.value) {
    const id = item.section?.documentId || item.section?.id;
    if (!id) continue;
    if (!grouped[id])
      grouped[id] = {
        id,
        title: item.section.title,
        order: item.section.order ?? 0,
        evaluation_type: item.section.evaluation_type || null,
        evaluation_criteria: [],
      };
    grouped[id].evaluation_criteria.push(item);
  }
  return Object.values(grouped)
    .sort((a: any, b: any) => a.order - b.order)
    .map((section: any) => ({
      ...section,
      evaluation_criteria: section.evaluation_criteria.sort(
        (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0),
      ),
    }));
});

function getEvaluationTypeKey(type: any) {
  if (!type) return "unassigned";
  return String(type.id || type.documentId || type.code || type.name);
}

const groupedByEvaluationType = computed(() => {
  const grouped: Record<string, any> = {};

  for (const section of groupedCriteria.value) {
    const type = section.evaluation_type;
    const typeKey = getEvaluationTypeKey(type);

    if (!grouped[typeKey]) {
      grouped[typeKey] = {
        id: typeKey,
        title:
          type?.name ||
          type?.title ||
          type?.code ||
          "Unassigned Evaluation Type",
        code: type?.code || "",
        order: type?.order ?? 9999,
        sections: [],
        criteriaCount: 0,
      };
    }

    grouped[typeKey].sections.push(section);
    grouped[typeKey].criteriaCount += section.evaluation_criteria.length;
  }

  return Object.values(grouped)
    .sort(
      (a: any, b: any) => a.order - b.order || a.title.localeCompare(b.title),
    )
    .map((group: any) => ({
      ...group,
      sections: group.sections.sort((a: any, b: any) => a.order - b.order),
    }));
});

const filteredGroupedCriteria = computed(() => {
  const keyword = globalFilter.value.trim().toLowerCase();
  return groupedCriteria.value
    .map((section: any) => {
      if (
        selectedEvaluationType.value !== "all" &&
        getEvaluationTypeKey(section.evaluation_type) !==
          selectedEvaluationType.value
      )
        return null;
      if (
        selectedSection.value !== "all" &&
        String(section.id) !== selectedSection.value
      )
        return null;
      const typeLabel =
        section.evaluation_type?.name ||
        section.evaluation_type?.title ||
        section.evaluation_type?.code ||
        "";
      const items = section.evaluation_criteria.filter(
        (row: any) =>
          !keyword ||
          `${row.statement} ${row.order} ${section.title} ${typeLabel}`
            .toLowerCase()
            .includes(keyword),
      );
      return items.length ? { ...section, evaluation_criteria: items } : null;
    })
    .filter(Boolean);
});

const filteredGroupedByEvaluationType = computed(() => {
  const grouped: Record<string, any> = {};

  for (const section of filteredGroupedCriteria.value) {
    const type = section.evaluation_type;
    const typeKey = getEvaluationTypeKey(type);
    if (!grouped[typeKey]) {
      grouped[typeKey] = {
        id: typeKey,
        title:
          type?.name ||
          type?.title ||
          type?.code ||
          "Unassigned Evaluation Type",
        code: type?.code || "",
        order: type?.order ?? 9999,
        sections: [],
        criteriaCount: 0,
      };
    }
    grouped[typeKey].sections.push(section);
    grouped[typeKey].criteriaCount += section.evaluation_criteria.length;
  }

  return Object.values(grouped)
    .sort(
      (a: any, b: any) => a.order - b.order || a.title.localeCompare(b.title),
    )
    .map((group: any) => ({
      ...group,
      sections: group.sections.sort((a: any, b: any) => a.order - b.order),
    }));
});

function isTypeOpen(id: any) {
  return !!openTypeIds.value[String(id)];
}
function isSectionOpen(id: any) {
  return !!openSectionIds.value[String(id)];
}
function toggleType(id: any) {
  const key = String(id);
  openTypeIds.value = { [key]: !openTypeIds.value[key] };
}
function toggleSection(id: any) {
  const key = String(id);
  openSectionIds.value = {
    ...openSectionIds.value,
    [key]: !openSectionIds.value[key],
  };
}
function expandAllVisible() {
  const types: Record<string, boolean> = {};
  const secs: Record<string, boolean> = {};
  for (const group of filteredGroupedByEvaluationType.value) {
    types[String(group.id)] = true;
    for (const section of group.sections) secs[String(section.id)] = true;
  }
  openTypeIds.value = types;
  openSectionIds.value = secs;
}
function collapseAll() {
  openTypeIds.value = {};
  openSectionIds.value = {};
}

function getRowKey(row: any) {
  return row.documentId || row.id;
}
function isRowSelected(row: any) {
  return !!selectedRows.value[getRowKey(row)];
}
function toggleRowSelection(row: any, value: boolean) {
  selectedRows.value = { ...selectedRows.value, [getRowKey(row)]: value };
}
function isSectionSelected(section: any) {
  return (
    section.evaluation_criteria.length > 0 &&
    section.evaluation_criteria.every(isRowSelected)
  );
}
function isSectionPartiallySelected(section: any) {
  const count = section.evaluation_criteria.filter(isRowSelected).length;
  return count > 0 && count < section.evaluation_criteria.length;
}
function toggleSectionSelection(section: any, value: boolean) {
  const next = { ...selectedRows.value };
  section.evaluation_criteria.forEach(
    (row: any) => (next[getRowKey(row)] = value),
  );
  selectedRows.value = next;
}
function clearFilters() {
  globalFilter.value = "";
  selectedEvaluationType.value = "all";
  selectedSection.value = "all";
}

function nextOrderForSection(sectionId: any) {
  const rows = criteria.value.filter(
    (x: any) =>
      String(x.section?.documentId || x.section?.id) === String(sectionId),
  );
  return rows.length
    ? Math.max(...rows.map((x: any) => Number(x.order) || 0)) + 1
    : 1;
}

function openPreviewModal() {
  const preferredType =
    selectedEvaluationType.value !== "all"
      ? selectedEvaluationType.value
      : groupedByEvaluationType.value[0]?.id;

  previewEvaluationType.value = preferredType ? String(preferredType) : null;
  previewModal.value = true;
}

function openCreateModal(sectionId?: any) {
  isEditing.value = false;
  selectedId.value = null;
  form.statement = "";
  form.section = sectionId || null;
  form.order = sectionId ? nextOrderForSection(sectionId) : 1;
  formModal.value = true;
}

function openEditModal(row: any) {
  isEditing.value = true;
  selectedId.value = getRowKey(row);
  form.statement = row.statement || "";
  form.order = row.order ?? 1;
  form.section = row.section?.documentId || row.section?.id || null;
  formModal.value = true;
}

function duplicateExists(statement: string, sectionId: any, exclude?: any) {
  return criteria.value.some(
    (row: any) =>
      String(row.statement || "")
        .trim()
        .toLowerCase() === statement.trim().toLowerCase() &&
      String(row.section?.documentId || row.section?.id) ===
        String(sectionId) &&
      String(getRowKey(row)) !== String(exclude || ""),
  );
}

async function saveCriterion() {
  if (!form.statement.trim() || !form.section || Number(form.order) < 1) {
    toast.add({
      title: "Incomplete information",
      description:
        "Select a section, enter a valid order, and provide an evaluation statement.",
      color: "warning",
      icon: "i-lucide-circle-alert",
    });
    return;
  }
  if (
    duplicateExists(
      form.statement,
      form.section,
      isEditing.value ? selectedId.value : null,
    )
  ) {
    toast.add({
      title: "Duplicate criterion",
      description:
        "This section already contains the same evaluation statement.",
      color: "warning",
      icon: "i-lucide-circle-alert",
    });
    return;
  }

  saving.value = true;
  try {
    const payload = {
      data: {
        statement: form.statement.trim(),
        order: Number(form.order),
        section: form.section?.value || form.section,
      },
    };
    await $api(
      isEditing.value
        ? `/evaluation-criterias/${selectedId.value}`
        : "/evaluation-criterias",
      { method: isEditing.value ? "PUT" : "POST", body: payload },
    );
    toast.add({
      title: isEditing.value ? "Criterion updated" : "Criterion created",
      color: "success",
      icon: "i-lucide-circle-check",
    });
    formModal.value = false;
    await getEvaluationCriteria();
  } catch (error: any) {
    toast.add({
      title: "Unable to save criterion",
      description:
        error?.data?.error?.message ||
        error?.message ||
        "The criterion could not be saved.",
      color: "error",
      icon: "i-lucide-triangle-alert",
    });
  } finally {
    saving.value = false;
  }
}

async function duplicateCriterion(row: any) {
  try {
    await $api("/evaluation-criterias", {
      method: "POST",
      body: {
        data: {
          statement: `${row.statement} (Copy)`,
          order: nextOrderForSection(
            row.section?.documentId || row.section?.id,
          ),
          section: row.section?.documentId || row.section?.id,
        },
      },
    });
    toast.add({
      title: "Criterion duplicated",
      color: "success",
      icon: "i-lucide-copy-check",
    });
    await getEvaluationCriteria();
  } catch (error: any) {
    toast.add({
      title: "Unable to duplicate criterion",
      description: error?.data?.error?.message || error?.message,
      color: "error",
      icon: "i-lucide-triangle-alert",
    });
  }
}

async function moveCriterion(section: any, index: number, direction: number) {
  const targetIndex = index + direction;
  const current = section.evaluation_criteria[index];
  const target = section.evaluation_criteria[targetIndex];
  if (!current || !target) return;
  movingId.value = getRowKey(current);
  try {
    await Promise.all([
      $api(`/evaluation-criterias/${getRowKey(current)}`, {
        method: "PUT",
        body: {
          data: {
            statement: current.statement,
            order: Number(target.order),
            section: current.section?.documentId || current.section?.id,
          },
        },
      }),
      $api(`/evaluation-criterias/${getRowKey(target)}`, {
        method: "PUT",
        body: {
          data: {
            statement: target.statement,
            order: Number(current.order),
            section: target.section?.documentId || target.section?.id,
          },
        },
      }),
    ]);
    await getEvaluationCriteria();
  } catch (error: any) {
    toast.add({
      title: "Unable to reorder criteria",
      description: error?.data?.error?.message || error?.message,
      color: "error",
      icon: "i-lucide-triangle-alert",
    });
  } finally {
    movingId.value = null;
  }
}

function getDropdownActions(row: any): DropdownMenuItem[][] {
  return [
    [
      { type: "label", label: "Actions" },
      { type: "separator" },
      {
        label: "Edit Criterion",
        icon: "i-lucide-edit-3",
        onSelect: () => openEditModal(row),
      },
      {
        label: "Duplicate",
        icon: "i-lucide-copy",
        onSelect: () => duplicateCriterion(row),
      },
      { type: "separator" },
      {
        label: "Delete Criterion",
        icon: "i-lucide-trash-2",
        color: "error",
        onSelect: () => requestDeleteOne(row),
      },
    ],
  ];
}

function requestDeleteOne(row: any) {
  deleteTarget.value = row;
  deleteMode.value = "single";
  deleteModal.value = true;
}
function requestDeleteSelected() {
  deleteTarget.value = null;
  deleteMode.value = "multiple";
  deleteModal.value = true;
}

async function confirmDelete() {
  deleting.value = true;
  try {
    if (deleteMode.value === "single") {
      await $api(`/evaluation-criterias/${getRowKey(deleteTarget.value)}`, {
        method: "DELETE",
      });
      const next = { ...selectedRows.value };
      delete next[getRowKey(deleteTarget.value)];
      selectedRows.value = next;
    } else {
      const items = criteria.value.filter(
        (row: any) => selectedRows.value[getRowKey(row)],
      );
      await Promise.all(
        items.map((row: any) =>
          $api(`/evaluation-criterias/${getRowKey(row)}`, { method: "DELETE" }),
        ),
      );
      selectedRows.value = {};
    }
    toast.add({
      title:
        deleteMode.value === "single"
          ? "Criterion deleted"
          : "Criteria deleted",
      color: "success",
      icon: "i-lucide-circle-check",
    });
    deleteModal.value = false;
    await getEvaluationCriteria();
  } catch (error: any) {
    toast.add({
      title: "Unable to delete criteria",
      description: error?.data?.error?.message || error?.message,
      color: "error",
      icon: "i-lucide-triangle-alert",
    });
  } finally {
    deleting.value = false;
  }
}

async function getEvaluationSections() {
  const res: any = await $api("/evaluation-sections", {
    query: {
      "populate[evaluation_type]": true,
      "sort[0]": "order:asc",
      "pagination[pageSize]": 10000,
    },
  });
  sections.value = res.data || [];
}

async function getEvaluationCriteria() {
  const res: any = await $api("/evaluation-criterias/list", {
    query: { populate: "section", pagination: { pageSize: 10000 } },
  });
  const sectionMap = new Map<string, any>();

  for (const section of sections.value) {
    if (section.id !== undefined && section.id !== null) {
      sectionMap.set(String(section.id), section);
    }

    if (section.documentId) {
      sectionMap.set(String(section.documentId), section);
    }
  }

  criteria.value = (res.data || []).map((item: any) => {
    const relationKey = item.section?.documentId || item.section?.id;
    const fullSection = sectionMap.get(String(relationKey));

    return fullSection
      ? {
          ...item,
          section: {
            ...item.section,
            ...fullSection,
            evaluation_type: fullSection.evaluation_type || null,
          },
        }
      : item;
  });
}

async function refreshData() {
  loading.value = true;
  loadError.value = "";
  try {
    await getEvaluationSections();
    await getEvaluationCriteria();
  } catch (error: any) {
    loadError.value =
      error?.data?.error?.message ||
      error?.message ||
      "Failed to load evaluation criteria.";
  } finally {
    loading.value = false;
  }
}

watch(selectedEvaluationType, () => {
  if (selectedSection.value !== "all") {
    const valid = sectionFilterOptions.value.some(
      (option) => option.value === selectedSection.value,
    );
    if (!valid) selectedSection.value = "all";
  }
});

onMounted(async () => {
  await refreshData();
  const firstType = filteredGroupedByEvaluationType.value[0];
  if (firstType) {
    openTypeIds.value = { [String(firstType.id)]: true };
    const firstSection = firstType.sections?.[0];
    if (firstSection)
      openSectionIds.value = { [String(firstSection.id)]: true };
  }
});
</script>
