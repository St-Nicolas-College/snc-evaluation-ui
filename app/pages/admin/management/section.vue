<template>
      <div class="space-y-6 pb-8">
        <section
          class="relative overflow-hidden rounded-[28px] border border-emerald-200 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7"
        >
          <div
            class="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
          />
          <div
            class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-cyan-300/15 blur-3xl"
          />

          <div
            class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"
          >
            <div class="flex min-w-0 items-start gap-4">
              <div
                class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex"
              >
                <UIcon name="i-lucide-layout-list" class="size-7" />
              </div>

              <div class="min-w-0">
                <div
                  class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-50"
                >
                  <span
                    class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1"
                    >Administrator Portal</span
                  >
                  <span
                    class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1"
                    >Evaluation Builder</span
                  >
                </div>
                <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
                  Evaluation Sections
                </h1>
                <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
                  Organise evaluation questions into clear categories and assign
                  every section to the correct evaluation type.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
              <HeroStat label="Sections" :value="summary.total" />
              <HeroStat label="Types Used" :value="summary.typesUsed" />
              <HeroStat label="Unassigned" :value="summary.unassigned" />
            </div>
          </div>
        </section>

        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Sections"
            :value="summary.total"
            description="All configured categories"
            icon="i-lucide-layout-list"
            tone="emerald"
          />
          <StatCard
            label="Evaluation Types"
            :value="summary.availableTypes"
            description="Available questionnaire types"
            icon="i-lucide-tags"
            tone="violet"
          />
          <StatCard
            label="Types in Use"
            :value="summary.typesUsed"
            description="Types with assigned sections"
            icon="i-lucide-link-2"
            tone="blue"
          />
          <StatCard
            label="Largest Group"
            :value="mostUsedType?.count || 0"
            :description="mostUsedType?.label || 'No data available'"
            icon="i-lucide-bar-chart-3"
            tone="amber"
          />
        </section>

        <section
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
          >
            <div class="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              <UInput
                v-model="globalFilter"
                icon="i-lucide-search"
                placeholder="Search section title, order, or evaluation type..."
                class="w-full"
              />
              <USelectMenu
                v-model="selectedEvaluationType"
                :items="evaluationTypeFilterOptions"
                value-key="value"
                class="w-full"
              />
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <UButton
                v-if="selectedCount"
                color="error"
                variant="soft"
                icon="i-lucide-trash-2"
                @click="requestDeleteSelected"
              >
                Delete Selected
                <template #trailing
                  ><UKbd>{{ selectedCount }}</UKbd></template
                >
              </UButton>
              <UButton icon="i-lucide-plus" @click="openCreateModal"
                >New Section</UButton
              >
            </div>
          </div>

          <div
            v-if="hasActiveFilters"
            class="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-800"
          >
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400"
              >Active filters:</span
            >
            <UBadge v-if="globalFilter" color="neutral" variant="subtle"
              >Search: {{ globalFilter }}</UBadge
            >
            <UBadge
              v-if="selectedEvaluationType !== 'all'"
              color="primary"
              variant="subtle"
              >{{ selectedEvaluationTypeLabel }}</UBadge
            >
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              @click="clearFilters"
              >Clear filters</UButton
            >
          </div>
        </section>

        <section
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
          >
            <div>
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                Section Directory
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Showing {{ filteredSections.length }} of
                {{ sections.length }} section{{
                  sections.length === 1 ? "" : "s"
                }}.
              </p>
            </div>
            <USelect
              v-model="itemsPerPage"
              :items="pageSizeOptions"
              class="w-full sm:w-32"
            />
          </div>

          <div v-if="loading" class="space-y-3 p-5">
            <USkeleton
              v-for="index in 6"
              :key="index"
              class="h-16 w-full rounded-xl"
            />
          </div>

          <div v-else-if="loadError" class="px-6 py-14 text-center">
            <div
              class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
            >
              <UIcon name="i-lucide-triangle-alert" class="size-7" />
            </div>
            <h3 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
              Unable to load evaluation sections
            </h3>
            <p
              class="mx-auto mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400"
            >
              {{ loadError }}
            </p>
            <UButton
              class="mt-5"
              icon="i-lucide-refresh-cw"
              @click="getEvaluationSections"
              >Try Again</UButton
            >
          </div>

          <div
            v-else-if="!filteredSections.length"
            class="px-6 py-16 text-center"
          >
            <div
              class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
            >
              <UIcon
                :name="
                  sections.length ? 'i-lucide-search-x' : 'i-lucide-layout-list'
                "
                class="size-8"
              />
            </div>
            <h3 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
              {{
                sections.length
                  ? "No matching sections found"
                  : "No evaluation sections yet"
              }}
            </h3>
            <p
              class="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400"
            >
              {{
                sections.length
                  ? "Try changing or clearing the current filters."
                  : "Create the first section to begin organising your evaluation criteria."
              }}
            </p>
            <UButton
              v-if="!sections.length"
              class="mt-5"
              icon="i-lucide-plus"
              @click="openCreateModal"
              >Create First Section</UButton
            >
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full min-w-[850px] text-sm">
              <thead
                class="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40 dark:text-gray-400"
              >
                <tr>
                  <th class="w-12 px-4 py-3 text-center">
                    <UCheckbox
                      :model-value="isCurrentPageSelected"
                      :indeterminate="isCurrentPagePartiallySelected"
                      @update:model-value="toggleCurrentPageSelection(!!$event)"
                    />
                  </th>
                  <th class="w-24 px-4 py-3 text-center">Order</th>
                  <th class="px-4 py-3 text-left">Evaluation Section</th>
                  <th class="px-4 py-3 text-left">Evaluation Type</th>
                  <th class="w-20 px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr
                  v-for="row in paginatedSections"
                  :key="getRowKey(row)"
                  class="transition hover:bg-gray-50/80 dark:hover:bg-gray-950/30"
                >
                  <td class="px-4 py-4 text-center">
                    <UCheckbox
                      :model-value="isRowSelected(row)"
                      @update:model-value="toggleRowSelection(row, !!$event)"
                    />
                  </td>
                  <td class="px-4 py-4 text-center">
                    <div
                      class="mx-auto flex size-9 items-center justify-center rounded-xl bg-gray-100 font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    >
                      {{ row.order ?? "—" }}
                    </div>
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex min-w-0 items-center gap-3">
                      <div
                        class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm"
                      >
                        <UIcon name="i-lucide-list-tree" class="size-5" />
                      </div>
                      <div class="min-w-0">
                        <p class="font-bold text-gray-900 dark:text-white">
                          {{ row.title || "Untitled Section" }}
                        </p>
                        <p
                          class="mt-0.5 text-xs text-gray-500 dark:text-gray-400"
                        >
                          Display order #{{ row.order ?? "—" }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4">
                    <UBadge
                      v-if="row.evaluation_type"
                      color="primary"
                      variant="subtle"
                      >{{
                        row.evaluation_type?.name ||
                        row.evaluation_type?.title ||
                        row.evaluation_type?.code ||
                        "Evaluation Type"
                      }}</UBadge
                    >
                    <UBadge v-else color="warning" variant="subtle"
                      >Not assigned</UBadge
                    >
                  </td>
                  <td class="px-4 py-4 text-center">
                    <UDropdownMenu :items="getDropdownActions(row)">
                      <UButton
                        icon="i-lucide-ellipsis-vertical"
                        color="neutral"
                        variant="ghost"
                        square
                        aria-label="Section actions"
                      />
                    </UDropdownMenu>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="filteredSections.length"
            class="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
          >
            <div
              class="text-center text-xs text-gray-500 sm:text-left dark:text-gray-400"
            >
              Showing {{ paginationStart }}–{{ paginationEnd }} of
              {{ filteredSections.length }} records
              <span v-if="selectedCount">• {{ selectedCount }} selected</span>
            </div>
            <div class="flex items-center justify-center gap-2">
              <UButton
                color="neutral"
                variant="outline"
                icon="i-lucide-chevron-left"
                square
                :disabled="page <= 1"
                @click="page -= 1"
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
                @click="page += 1"
              />
            </div>
          </div>
        </section>

        <UModal
          v-model:open="createModal"
          title="Add Evaluation Section"
          description="Create a new category for an evaluation form."
          :ui="{ content: 'max-w-2xl' }"
        >
          <template #content>
            <FormModalHeader
              title="Add Evaluation Section"
              description="Create a category for grouping evaluation criteria."
              icon="i-lucide-list-plus"
              @close="createModal = false"
            />
            <UForm
              :state="createForm"
              class="space-y-5 rounded-b-[28px] bg-white p-6 dark:bg-gray-900"
              @submit="createSection"
            >
              <SectionFields
                :form="createForm"
                :evaluation-type-options="evaluationTypeOptions"
              />
              <div
                class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800"
              >
                <UButton
                  color="neutral"
                  variant="outline"
                  type="button"
                  @click="createModal = false"
                  >Cancel</UButton
                >
                <UButton
                  type="submit"
                  icon="i-lucide-save"
                  :loading="loadingCreate"
                  :disabled="loadingCreate"
                  >Save Section</UButton
                >
              </div>
            </UForm>
          </template>
        </UModal>

        <UModal
          v-model:open="editModal"
          title="Edit Evaluation Section"
          description="Update the selected evaluation section."
          :ui="{ content: 'max-w-2xl' }"
        >
          <template #content>
            <FormModalHeader
              title="Edit Evaluation Section"
              description="Update the selected section and evaluation type."
              icon="i-lucide-list-restart"
              tone="blue"
              @close="editModal = false"
            />
            <UForm
              :state="editForm"
              class="space-y-5 rounded-b-[28px] bg-white p-6 dark:bg-gray-900"
              @submit="updateSection"
            >
              <SectionFields
                :form="editForm"
                :evaluation-type-options="evaluationTypeOptions"
              />
              <div
                class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800"
              >
                <UButton
                  color="neutral"
                  variant="outline"
                  type="button"
                  @click="editModal = false"
                  >Cancel</UButton
                >
                <UButton
                  type="submit"
                  icon="i-lucide-save"
                  :loading="loadingUpdate"
                  :disabled="loadingUpdate"
                  >Save Changes</UButton
                >
              </div>
            </UForm>
          </template>
        </UModal>

        <UModal
          v-model:open="deleteModal"
          title="Confirm Section Deletion"
          description="Confirm deletion of the selected evaluation section record or records."
          :ui="{ content: 'max-w-md' }"
        >
          <template #content>
            <div class="rounded-[24px] bg-white p-6 dark:bg-gray-900">
              <div
                class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
              >
                <UIcon name="i-lucide-trash-2" class="size-7" />
              </div>
              <h2
                class="mt-4 text-center text-xl font-bold text-gray-900 dark:text-white"
              >
                {{
                  deleteTargetType === "multiple"
                    ? "Delete selected sections?"
                    : "Delete evaluation section?"
                }}
              </h2>
              <p
                class="mt-2 text-center text-sm leading-6 text-gray-500 dark:text-gray-400"
              >
                {{
                  deleteTargetType === "multiple"
                    ? `This will permanently delete ${selectedCount} selected section${selectedCount === 1 ? "" : "s"}.`
                    : `This will permanently delete ${deleteTarget?.title || "this evaluation section"}.`
                }}
              </p>
              <div
                class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
              >
                Make sure the section is not needed by an existing evaluation
                form before deleting it.
              </div>
              <div class="mt-6 flex gap-2">
                <UButton
                  color="neutral"
                  variant="outline"
                  class="flex-1 justify-center"
                  @click="closeDeleteModal"
                  >Cancel</UButton
                >
                <UButton
                  color="error"
                  icon="i-lucide-trash-2"
                  class="flex-1 justify-center"
                  :loading="loadingDelete"
                  @click="confirmDelete"
                  >Delete</UButton
                >
              </div>
            </div>
          </template>
        </UModal>
      </div>
</template>

<script setup lang="ts">
// @ts-nocheck
definePageMeta({ middleware: ["auth", "role"], role: ["Admin"] });

import type { DropdownMenuItem } from "@nuxt/ui";

const { $api } = useNuxtApp();
const toast = useToast();

const HeroStat = defineComponent({
  props: { label: String, value: [String, Number] },
  setup: (props) => () =>
    h(
      "div",
      {
        class:
          "rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl",
      },
      [
        h("p", { class: "text-2xl font-bold" }, String(props.value ?? 0)),
        h(
          "p",
          {
            class: "mt-1 text-[10px] uppercase tracking-wide text-emerald-100",
          },
          props.label,
        ),
      ],
    ),
});

const StatCard = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    description: String,
    icon: String,
    tone: String,
  },
  setup(props) {
    const tones = {
      emerald:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
      violet:
        "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
      blue: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
      amber:
        "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    };
    return () =>
      h(
        "div",
        {
          class:
            "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900",
        },
        [
          h("div", { class: "flex items-center justify-between gap-4" }, [
            h("div", {}, [
              h(
                "p",
                {
                  class: "text-xs font-medium text-gray-500 dark:text-gray-400",
                },
                props.label,
              ),
              h(
                "p",
                {
                  class:
                    "mt-2 text-2xl font-bold text-gray-900 dark:text-white",
                },
                String(props.value ?? 0),
              ),
              h(
                "p",
                { class: "mt-1 text-xs text-gray-500 dark:text-gray-400" },
                props.description,
              ),
            ]),
            h(
              "div",
              {
                class: `flex size-11 shrink-0 items-center justify-center rounded-2xl ${tones[props.tone] || tones.emerald}`,
              },
              [
                h(resolveComponent("UIcon"), {
                  name: props.icon,
                  class: "size-5",
                }),
              ],
            ),
          ]),
        ],
      );
  },
});

const FormModalHeader = defineComponent({
  emits: ["close"],
  props: {
    title: String,
    description: String,
    icon: String,
    tone: { type: String, default: "emerald" },
  },
  setup(props, { emit }) {
    return () =>
      h(
        "div",
        {
          class: `relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 ${props.tone === "blue" ? "to-blue-950" : "to-emerald-950"} px-6 py-6 text-white`,
        },
        [
          h("div", {
            class:
              "pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-white/10 blur-3xl",
          }),
          h(
            "div",
            { class: "relative flex items-start justify-between gap-4" },
            [
              h("div", { class: "flex min-w-0 items-center gap-4" }, [
                h(
                  "div",
                  {
                    class:
                      "flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10",
                  },
                  [
                    h(resolveComponent("UIcon"), {
                      name: props.icon,
                      class: "size-6",
                    }),
                  ],
                ),
                h("div", {}, [
                  h("h2", { class: "text-xl font-bold" }, props.title),
                  h(
                    "p",
                    { class: "mt-1 text-xs text-slate-300" },
                    props.description,
                  ),
                ]),
              ]),
              h(resolveComponent("UButton"), {
                color: "neutral",
                variant: "ghost",
                icon: "i-lucide-x",
                square: true,
                class: "text-white hover:bg-white/10",
                onClick: () => emit("close"),
              }),
            ],
          ),
        ],
      );
  },
});

const SectionFields = defineComponent({
  props: { form: Object, evaluationTypeOptions: Array },
  setup(props) {
    return () => [
      h(
        resolveComponent("UFormField"),
        { label: "Display Order", name: "order", required: true },
        {
          default: () =>
            h(resolveComponent("UInput"), {
              modelValue: props.form.order,
              "onUpdate:modelValue": (value) => (props.form.order = value),
              type: "number",
              min: 1,
              placeholder: "Example: 1",
              class: "w-full",
            }),
        },
      ),
      h(
        resolveComponent("UFormField"),
        { label: "Section Title", name: "title", required: true },
        {
          default: () =>
            h(resolveComponent("UInput"), {
              modelValue: props.form.title,
              "onUpdate:modelValue": (value) => (props.form.title = value),
              placeholder: "Example: Teaching Competence",
              class: "w-full",
            }),
        },
      ),
      h(
        resolveComponent("UFormField"),
        { label: "Evaluation Type", name: "evaluation_type", required: true },
        {
          default: () =>
            h(resolveComponent("USelectMenu"), {
              modelValue: props.form.evaluation_type,
              "onUpdate:modelValue": (value) =>
                (props.form.evaluation_type = value),
              items: props.evaluationTypeOptions,
              valueKey: "value",
              placeholder: "Select evaluation type",
              class: "w-full",
            }),
        },
      ),
    ];
  },
});

const loading = ref(true);
const loadError = ref("");
const loadingCreate = ref(false);
const loadingUpdate = ref(false);
const loadingDelete = ref(false);
const createModal = ref(false);
const editModal = ref(false);
const deleteModal = ref(false);
const page = ref(1);
const itemsPerPage = ref(10);
const sections = ref<any[]>([]);
const evaluationTypes = ref<any[]>([]);
const globalFilter = ref("");
const selectedEvaluationType = ref("all");
const selectedId = ref<any>(null);
const selectedRows = ref<Record<string | number, boolean>>({});
const deleteTarget = ref<any>(null);
const deleteTargetType = ref<"single" | "multiple">("single");

const createForm = reactive({
  title: "",
  order: 1 as any,
  evaluation_type: null as any,
});
const editForm = reactive({
  title: "",
  order: 1 as any,
  evaluation_type: null as any,
});
const pageSizeOptions = [
  { label: "10 rows", value: 10 },
  { label: "20 rows", value: 20 },
  { label: "50 rows", value: 50 },
  { label: "100 rows", value: 100 },
];

const summary = computed(() => {
  const typeIds = sections.value
    .map((row) => row.evaluation_type?.id)
    .filter(Boolean);
  return {
    total: sections.value.length,
    typesUsed: new Set(typeIds).size,
    availableTypes: evaluationTypes.value.length,
    unassigned: sections.value.filter((row) => !row.evaluation_type).length,
  };
});

const mostUsedType = computed(() => {
  const counts = new Map<string, any>();
  for (const row of sections.value) {
    const type = row.evaluation_type;
    if (!type) continue;
    const key = String(type.id || type.documentId || type.code || type.name);
    const current = counts.get(key);
    counts.set(key, {
      label: type.name || type.title || type.code || "Unknown Type",
      count: (current?.count || 0) + 1,
    });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count)[0] || null;
});

const evaluationTypeOptions = computed(() =>
  evaluationTypes.value.map((type) => ({
    label: type.name || type.title || type.code || "Unnamed Type",
    value: type.id,
  })),
);
const evaluationTypeFilterOptions = computed(() => [
  { label: "All Evaluation Types", value: "all" },
  ...evaluationTypes.value.map((type) => ({
    label: type.name || type.title || type.code || "Unnamed Type",
    value: String(type.id),
  })),
]);
const selectedEvaluationTypeLabel = computed(
  () =>
    evaluationTypeFilterOptions.value.find(
      (option) => option.value === selectedEvaluationType.value,
    )?.label || "Evaluation Type",
);

const filteredSections = computed(() => {
  const keyword = globalFilter.value.trim().toLowerCase();
  return sections.value.filter((item) => {
    const searchable = [
      item.title,
      item.order,
      item.evaluation_type?.name,
      item.evaluation_type?.title,
      item.evaluation_type?.code,
    ]
      .filter((v) => v !== undefined && v !== null)
      .join(" ")
      .toLowerCase();
    return (
      (!keyword || searchable.includes(keyword)) &&
      (selectedEvaluationType.value === "all" ||
        String(item.evaluation_type?.id) === selectedEvaluationType.value)
    );
  });
});

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(filteredSections.value.length / Number(itemsPerPage.value)),
  ),
);
const paginatedSections = computed(() =>
  filteredSections.value.slice(
    (page.value - 1) * Number(itemsPerPage.value),
    page.value * Number(itemsPerPage.value),
  ),
);
const paginationStart = computed(() =>
  filteredSections.value.length
    ? (page.value - 1) * Number(itemsPerPage.value) + 1
    : 0,
);
const paginationEnd = computed(() =>
  Math.min(
    page.value * Number(itemsPerPage.value),
    filteredSections.value.length,
  ),
);
const selectedCount = computed(
  () => Object.values(selectedRows.value).filter(Boolean).length,
);
const hasActiveFilters = computed(() =>
  Boolean(globalFilter.value || selectedEvaluationType.value !== "all"),
);
const isCurrentPageSelected = computed(
  () =>
    paginatedSections.value.length > 0 &&
    paginatedSections.value.every(isRowSelected),
);
const isCurrentPagePartiallySelected = computed(() => {
  const count = paginatedSections.value.filter(isRowSelected).length;
  return count > 0 && count < paginatedSections.value.length;
});

const getRowKey = (row: any) => row.documentId || row.id;
const getNextOrder = () =>
  sections.value.length
    ? Math.max(...sections.value.map((item) => Number(item.order) || 0)) + 1
    : 1;
const resetCreateForm = () =>
  Object.assign(createForm, {
    title: "",
    order: getNextOrder(),
    evaluation_type: null,
  });
const resetEditForm = () => {
  Object.assign(editForm, { title: "", order: 1, evaluation_type: null });
  selectedId.value = null;
};
const openCreateModal = () => {
  resetCreateForm();
  createModal.value = true;
};
const openEditModal = (row: any) => {
  selectedId.value = getRowKey(row);
  Object.assign(editForm, {
    title: row.title || "",
    order: row.order ?? 1,
    evaluation_type:
      row.evaluation_type?.id || row.evaluation_type?.value || null,
  });
  editModal.value = true;
};
const clearFilters = () => {
  globalFilter.value = "";
  selectedEvaluationType.value = "all";
  page.value = 1;
};
const toggleRowSelection = (row: any, value: boolean) =>
  (selectedRows.value = { ...selectedRows.value, [getRowKey(row)]: value });
const isRowSelected = (row: any) => Boolean(selectedRows.value[getRowKey(row)]);
const toggleCurrentPageSelection = (value: boolean) => {
  const next = { ...selectedRows.value };
  paginatedSections.value.forEach((row) => (next[getRowKey(row)] = value));
  selectedRows.value = next;
};

function getDropdownActions(row: any): DropdownMenuItem[][] {
  return [
    [
      { type: "label", label: "Actions" },
      { type: "separator" },
      {
        label: "Edit Section",
        icon: "i-lucide-edit-3",
        onSelect: () => openEditModal(row),
      },
      {
        label: "Delete Section",
        icon: "i-lucide-trash-2",
        color: "error",
        onSelect: () => requestDeleteOne(row),
      },
    ],
  ];
}

async function getEvaluationTypes() {
  try {
    const res: any = await $api("/evaluation-types", {
      query: { "sort[0]": "name:asc", "pagination[pageSize]": 10000 },
    });
    evaluationTypes.value = res.data || [];
  } catch (error) {
    console.error(error);
    evaluationTypes.value = [];
  }
}

async function getEvaluationSections() {
  loading.value = true;
  loadError.value = "";
  try {
    const res: any = await $api("/evaluation-sections", {
      query: {
        "populate[evaluation_type]": true,
        "sort[0]": "order:asc",
        "pagination[pageSize]": 10000,
      },
    });
    sections.value = res.data || [];
    const keys = new Set(sections.value.map((row) => String(getRowKey(row))));
    selectedRows.value = Object.fromEntries(
      Object.entries(selectedRows.value).filter(([key]) =>
        keys.has(String(key)),
      ),
    );
  } catch (error: any) {
    sections.value = [];
    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Failed to load evaluation sections.";
  } finally {
    loading.value = false;
  }
}

function validateForm(form: any) {
  if (!form.title.trim() || Number(form.order) < 1 || !form.evaluation_type) {
    toast.add({
      title: "Incomplete information",
      description: "Enter a section title, display order, and evaluation type.",
      color: "warning",
      icon: "i-lucide-circle-alert",
    });
    return false;
  }
  return true;
}

function duplicateSectionExists(
  title: string,
  evaluationTypeId: any,
  excludeKey?: any,
) {
  return sections.value.some(
    (row) =>
      String(row.title || "")
        .trim()
        .toLowerCase() === title.trim().toLowerCase() &&
      String(row.evaluation_type?.id) === String(evaluationTypeId) &&
      String(getRowKey(row)) !== String(excludeKey || ""),
  );
}

async function createSection() {
  if (!validateForm(createForm)) return;
  if (duplicateSectionExists(createForm.title, createForm.evaluation_type))
    return toast.add({
      title: "Duplicate section",
      description:
        "This evaluation type already has a section with the same title.",
      color: "warning",
      icon: "i-lucide-circle-alert",
    });
  loadingCreate.value = true;
  try {
    await $api("/evaluation-sections", {
      method: "POST",
      body: {
        data: {
          title: createForm.title.trim(),
          order: Number(createForm.order),
          evaluation_type:
            createForm.evaluation_type?.value || createForm.evaluation_type,
        },
      },
    });
    toast.add({
      title: "Section created",
      description: "The evaluation section was created successfully.",
      color: "success",
      icon: "i-lucide-circle-check",
    });
    createModal.value = false;
    resetCreateForm();
    await getEvaluationSections();
  } catch (error: any) {
    toast.add({
      title: "Unable to create section",
      description:
        error?.data?.error?.message ||
        error?.message ||
        "Failed to create the evaluation section.",
      color: "error",
      icon: "i-lucide-triangle-alert",
    });
  } finally {
    loadingCreate.value = false;
  }
}

async function updateSection() {
  if (!validateForm(editForm)) return;
  if (
    duplicateSectionExists(
      editForm.title,
      editForm.evaluation_type,
      selectedId.value,
    )
  )
    return toast.add({
      title: "Duplicate section",
      description:
        "Another section in this evaluation type already uses the same title.",
      color: "warning",
      icon: "i-lucide-circle-alert",
    });
  loadingUpdate.value = true;
  try {
    await $api(`/evaluation-sections/${selectedId.value}`, {
      method: "PUT",
      body: {
        data: {
          title: editForm.title.trim(),
          order: Number(editForm.order),
          evaluation_type:
            editForm.evaluation_type?.value || editForm.evaluation_type,
        },
      },
    });
    toast.add({
      title: "Section updated",
      description: "The evaluation section was updated successfully.",
      color: "success",
      icon: "i-lucide-circle-check",
    });
    editModal.value = false;
    resetEditForm();
    await getEvaluationSections();
  } catch (error: any) {
    toast.add({
      title: "Unable to update section",
      description:
        error?.data?.error?.message ||
        error?.message ||
        "Failed to update the evaluation section.",
      color: "error",
      icon: "i-lucide-triangle-alert",
    });
  } finally {
    loadingUpdate.value = false;
  }
}

const requestDeleteOne = (row: any) => {
  deleteTarget.value = row;
  deleteTargetType.value = "single";
  deleteModal.value = true;
};
const requestDeleteSelected = () => {
  if (selectedCount.value) {
    deleteTarget.value = null;
    deleteTargetType.value = "multiple";
    deleteModal.value = true;
  }
};
const closeDeleteModal = () => {
  deleteModal.value = false;
  deleteTarget.value = null;
  deleteTargetType.value = "single";
};

async function confirmDelete() {
  loadingDelete.value = true;
  try {
    if (deleteTargetType.value === "multiple") {
      const selectedItems = sections.value.filter(
        (item) => selectedRows.value[getRowKey(item)],
      );
      await Promise.all(
        selectedItems.map((item) =>
          $api(`/evaluation-sections/${getRowKey(item)}`, { method: "DELETE" }),
        ),
      );
      selectedRows.value = {};
      toast.add({
        title: "Sections deleted",
        description:
          "The selected evaluation sections were deleted successfully.",
        color: "success",
        icon: "i-lucide-circle-check",
      });
    } else if (deleteTarget.value) {
      await $api(`/evaluation-sections/${getRowKey(deleteTarget.value)}`, {
        method: "DELETE",
      });
      toast.add({
        title: "Section deleted",
        description: "The evaluation section was deleted successfully.",
        color: "success",
        icon: "i-lucide-circle-check",
      });
    }
    closeDeleteModal();
    await getEvaluationSections();
  } catch (error: any) {
    toast.add({
      title: "Unable to delete section",
      description:
        error?.data?.error?.message ||
        error?.message ||
        "Failed to delete the selected evaluation section.",
      color: "error",
      icon: "i-lucide-triangle-alert",
    });
  } finally {
    loadingDelete.value = false;
  }
}

watch(
  [globalFilter, selectedEvaluationType, itemsPerPage],
  () => (page.value = 1),
);
watch(totalPages, (value) => {
  if (page.value > value) page.value = value;
});
onMounted(() => Promise.all([getEvaluationTypes(), getEvaluationSections()]));
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
