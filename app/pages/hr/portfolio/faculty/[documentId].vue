<template>
  <div class="space-y-6 pb-10">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <UButton
        to="/hr/portfolio"
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
      >
        Back to Faculty Portfolios
      </UButton>

      <div class="flex gap-2">
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

    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-44 rounded-3xl" />
      <USkeleton class="h-[500px] rounded-3xl" />
    </div>

    <section
      v-else-if="loadError"
      class="rounded-2xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <UIcon
        name="i-lucide-triangle-alert"
        class="mx-auto size-9 text-red-600"
      />
      <h2 class="mt-4 font-bold text-gray-900 dark:text-white">
        Unable to load faculty portfolio
      </h2>
      <p class="mt-2 text-sm text-gray-500">{{ loadError }}</p>
    </section>

    <template v-else-if="teacher">
      <section
        class="rounded-[28px] bg-gradient-to-br from-indigo-950 via-blue-950 to-cyan-950 px-6 py-7 text-white shadow-xl"
      >
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
          HR Portfolio Management
        </p>
        <h1 class="mt-2 text-3xl font-black">{{ teacherName }}</h1>
        <p class="mt-2 text-sm text-blue-100">
          {{ teacherRole }} · {{ departmentName }} ·
          {{
            teacher.employee_no ||
            teacher.user?.username ||
            "No employee number"
          }}
        </p>

        <div class="mt-5 flex flex-wrap gap-2">
          <UBadge color="neutral" variant="subtle">
            {{ entries.length }} Total Entries
          </UBadge>
          <UBadge color="success" variant="subtle">
            {{ currentCount }} Current
          </UBadge>
          <UBadge color="neutral" variant="subtle">
            {{ inactiveCount }} Inactive
          </UBadge>
        </div>
      </section>

      <section
        class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex flex-col gap-3 xl:flex-row">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search portfolio entries..."
            class="w-full xl:max-w-md"
          />

          <USelectMenu
            v-model="selectedType"
            :items="typeFilterOptions"
            value-key="value"
            class="w-full xl:w-64"
          />

          <USelectMenu
            v-model="selectedState"
            :items="stateOptions"
            value-key="value"
            class="w-full xl:w-52"
          />
        </div>
      </section>

      <section
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2 class="font-bold text-gray-900 dark:text-white">
            Portfolio Entries
          </h2>
          <p class="mt-1 text-xs text-gray-500">
            HR directly manages official portfolio records.
          </p>
        </div>

        <div v-if="!filteredEntries.length" class="px-6 py-16 text-center">
          <UIcon
            name="i-lucide-folder-open"
            class="mx-auto size-10 text-gray-400"
          />
          <h3 class="mt-4 font-bold text-gray-900 dark:text-white">
            No portfolio entries found
          </h3>
          <UButton class="mt-5" icon="i-lucide-plus" @click="openCreateDialog">
            Add Portfolio Entry
          </UButton>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[1180px] text-sm">
            <thead
              class="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40"
            >
              <tr>
                <th class="px-5 py-3 text-left">Entry Type</th>
                <th class="px-4 py-3 text-left">Title and Description</th>
                <th class="px-4 py-3 text-left">Institution / Issuer</th>
                <th class="px-4 py-3 text-left">Date Earned</th>
                <th class="px-4 py-3 text-left">Expiration</th>
                <th class="px-4 py-3 text-center">Points</th>
                <th class="px-4 py-3 text-center">Status</th>
                <th class="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="entry in filteredEntries"
                :key="entry.documentId || entry.id"
                class="align-top transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-950/30"
              >
                <td class="px-5 py-4">
                  <UBadge color="neutral" variant="subtle">
                    {{ formatStatus(entry.entry_type) }}
                  </UBadge>
                </td>

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

                <td class="px-4 py-4">
                  <p class="font-medium text-gray-800 dark:text-gray-200">
                    {{ entry.institution || "N/A" }}
                  </p>

                  <p v-if="entry.issuer" class="mt-1 text-xs text-gray-500">
                    Issuer: {{ entry.issuer }}
                  </p>
                </td>

                <td
                  class="whitespace-nowrap px-4 py-4 text-gray-600 dark:text-gray-300"
                >
                  {{ formatDate(entry.date_earned) }}
                </td>

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
                    class="mt-1 text-[11px] text-gray-400"
                  >
                    {{ expirationLabel(entry.expiration_date) }}
                  </p>
                </td>

                <td class="px-4 py-4 text-center">
                  <UBadge color="info" variant="subtle">
                    {{ formatPoints(entry.points) }}
                  </UBadge>
                </td>

                <td class="px-4 py-4 text-center">
                  <UBadge
                    :color="entry.is_current !== false ? 'success' : 'neutral'"
                    variant="subtle"
                  >
                    {{ entry.is_current !== false ? "Current" : "Inactive" }}
                  </UBadge>
                </td>

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
      </section>
    </template>

    <UModal
      v-model:open="entryDialogOpen"
      id="hr-portfolio-entry-form"
      :ui="{ content: 'max-w-4xl' }"
    >
      <template #content>
        <div
          class="max-h-[90vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900"
        >
          <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              {{
                editingEntry ? "Edit Portfolio Entry" : "Add Portfolio Entry"
              }}
            </h2>
            <p class="mt-1 text-sm text-gray-500">
              Maintain the official HR portfolio record for {{ teacherName }}.
            </p>
          </div>

          <UForm :state="form" class="space-y-5 p-6" @submit="saveEntry">
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

            <UFormField label="Description">
              <UTextarea v-model="form.description" :rows="3" class="w-full" />
            </UFormField>

            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="Institution / Organization">
                <UInput v-model="form.institution" class="w-full" />
              </UFormField>

              <UFormField label="Issuer">
                <UInput v-model="form.issuer" class="w-full" />
              </UFormField>
            </div>

            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <UFormField label="Reference Number">
                <UInput v-model="form.reference_number" class="w-full" />
              </UFormField>

              <UFormField label="Date Earned">
                <UInput v-model="form.date_earned" type="date" class="w-full" />
              </UFormField>

              <UFormField label="Start Date">
                <UInput v-model="form.start_date" type="date" class="w-full" />
              </UFormField>

              <UFormField label="End Date">
                <UInput v-model="form.end_date" type="date" class="w-full" />
              </UFormField>
            </div>

            <div class="grid gap-4 sm:grid-cols-3">
              <UFormField label="Expiration Date">
                <UInput
                  v-model="form.expiration_date"
                  type="date"
                  class="w-full"
                />
              </UFormField>

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

            <div
              v-if="isEvaluationEntry"
              class="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/20"
            >
              <div class="mb-4">
                <p class="font-semibold text-gray-900 dark:text-white">
                  Evaluation Period
                </p>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This period ensures that the manual evaluation points are used
                  only for the selected ranking cycle.
                </p>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
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
            </div>

            <UFormField label="Remarks">
              <UTextarea v-model="form.remarks" :rows="3" class="w-full" />
            </UFormField>

            <UCheckbox
              v-model="form.is_current"
              label="This is a current and active portfolio entry"
            />

            <div
              class="flex justify-end gap-2 border-t border-gray-200 pt-5 dark:border-gray-800"
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

    <UModal v-model:open="deleteDialogOpen" id="hr-delete-portfolio-entry">
      <template #content>
        <div class="rounded-[28px] bg-white p-6 dark:bg-gray-900">
          <div class="text-center">
            <UIcon
              name="i-lucide-trash-2"
              class="mx-auto size-10 text-red-600"
            />
            <h2 class="mt-4 text-lg font-bold">Delete portfolio entry?</h2>
            <p class="mt-2 text-sm text-gray-500">
              {{ deletingEntry?.title }}
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
  { label: "1st Semester", value: "1st Semester" },
  { label: "2nd Semester", value: "2nd Semester" },
  { label: "Summer", value: "Summer" },
];

const typeFilterOptions = [
  { label: "All Entry Types", value: "all" },
  ...entryTypeOptions,
];

const stateOptions = [
  { label: "All Records", value: "all" },
  { label: "Current Only", value: "current" },
  { label: "Inactive Only", value: "inactive" },
];

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

const isEvaluationEntry = computed(
  () => form.entry_type === "evaluation",
);

const manualEvaluationTitleOptions = computed(() => {
  const options = [
    { label: "HR Evaluation", value: "HR Evaluation" },
  ];

  if (isDean.value) {
    options.unshift({
      label: "Immediate Superior Evaluation",
      value: "Immediate Superior Evaluation",
    });
  }

  return options;
});

const departmentName = computed(
  () => teacher.value?.department?.name || "Department not specified",
);

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
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesState =
      selectedState.value === "all" ||
      (selectedState.value === "current" && entry.is_current !== false) ||
      (selectedState.value === "inactive" && entry.is_current === false);

    return (
      (!keyword || searchable.includes(keyword)) &&
      (selectedType.value === "all" ||
        entry.entry_type === selectedType.value) &&
      matchesState
    );
  });
});

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

    if (
      !isDean.value &&
      form.title === "Immediate Superior Evaluation"
    ) {
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
    const data = {
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
      school_year: isEvaluationEntry.value
        ? form.school_year.trim()
        : null,
      semester: isEvaluationEntry.value ? form.semester : null,
      remarks: form.remarks.trim() || null,
      is_current: Boolean(form.is_current),
    };

    if (editingEntry.value?.documentId) {
      await $api(`/portfolio-entries/${editingEntry.value.documentId}`, {
        method: "PUT",
        body: { data },
      });
    } else {
      await $api("/portfolio-entries", {
        method: "POST",
        body: { data },
      });
    }

    toast.add({
      title: editingEntry.value
        ? "Portfolio entry updated"
        : "Portfolio entry added",
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

const openDeleteDialog = (entry: any) => {
  deletingEntry.value = entry;
  deleteDialogOpen.value = true;
};

const closeDeleteDialog = () => {
  deletingEntry.value = null;
  deleteDialogOpen.value = false;
};

const deleteEntry = async () => {
  if (!deletingEntry.value?.documentId) return;

  deleting.value = true;

  try {
    await $api(`/portfolio-entries/${deletingEntry.value.documentId}`, {
      method: "DELETE",
    });

    toast.add({
      title: "Portfolio entry deleted",
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

const formatStatus = (value: string) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatDate = (value: any) => {
  if (!value) return "N/A";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

const isExpired = (value: any) => {
  if (!value) return false;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.getTime() < new Date().setHours(0, 0, 0, 0);
};

const expirationLabel = (value: any) => {
  if (!value) return "";

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

watch(
  () => form.entry_type,
  (newType, oldType) => {
    if (newType === oldType) {
      return;
    }

    // Preserve the existing title and period while loading an entry for editing.
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

onMounted(loadData);
</script>
