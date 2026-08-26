<template>
  <div class="space-y-6 pb-10">
    <!-- =====================================================
      PAGE HERO
    ====================================================== -->
    <section
      class="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7 dark:border-emerald-900"
    >
      <div
        class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
      />

      <div
        class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"
      >
        <div class="flex items-start gap-4">
          <div
            class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 sm:flex"
          >
            <UIcon name="i-lucide-users-round" class="size-7" />
          </div>

          <div>
            <div class="mb-2 flex gap-2 text-xs">
              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1"
              >
                Dean Portal
              </span>

              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1"
              >
                Class Assignment
              </span>
            </div>

            <h1 class="text-2xl font-bold sm:text-3xl">
              Faculty Class Assignment
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Assign faculty members to a specific course, year level, and
              section for the current academic period.
            </p>
          </div>
        </div>

        <div
          class="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur"
        >
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100"
          >
            Active Academic Period
          </p>

          <p class="mt-1 text-sm font-bold">
            {{ activePeriodLabel }}
          </p>
        </div>
      </div>
    </section>

    <!-- =====================================================
      FILTERS
    ====================================================== -->
    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          >
            <UIcon name="i-lucide-sliders-horizontal" class="size-5" />
          </div>

          <div>
            <h2 class="text-sm font-bold text-gray-900 dark:text-white">
              Select Class
            </h2>

            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Choose the course, year level, and section you want to manage.
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 p-5 sm:p-6 md:grid-cols-3">
        <UFormField label="Course">
          <USelectMenu
            v-model="filters.course"
            :items="courseOptions"
            value-key="value"
            placeholder="Select course"
            :loading="loadingCourses"
            class="w-full"
            @update:model-value="onCourseChanged"
          />
        </UFormField>

        <UFormField label="Year Level">
          <USelectMenu
            v-model="filters.year_level"
            :items="yearLevelOptions"
            value-key="value"
            placeholder="Select year level"
            :disabled="!filters.course"
            class="w-full"
            @update:model-value="onYearChanged"
          />
        </UFormField>

        <UFormField label="Section">
          <USelectMenu
            v-model="filters.section"
            :items="sectionOptions"
            value-key="value"
            :disabled="!filters.course || !filters.year_level"
            :placeholder="
              filters.year_level ? 'Select section' : 'Select year level first'
            "
            class="w-full"
            @update:model-value="loadClassAssignments"
          />
        </UFormField>
      </div>
    </section>

    <!-- =====================================================
      SELECTED CLASS SUMMARY
    ====================================================== -->
    <section
      v-if="isClassSelected"
      class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400"
          >
            Selected Class
          </p>

          <h2 class="mt-1 text-xl font-bold text-gray-900 dark:text-white">
            {{ selectedClassLabel }}
          </h2>

          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ selectedTeacherIds.length }}
            faculty member{{ selectedTeacherIds.length === 1 ? "" : "s" }}
            currently selected.
          </p>
        </div>

        <UBadge color="success" variant="subtle">
          {{ activePeriodLabel }}
        </UBadge>
      </div>
    </section>

    <!-- =====================================================
      FACULTY LIST
    ====================================================== -->
    <section
      v-if="isClassSelected"
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <div>
          <h2 class="text-sm font-bold text-gray-900 dark:text-white">
            Assign Faculty
          </h2>

          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Select all faculty members who handle this class.
          </p>
        </div>

        <UInput
          v-model="facultySearch"
          icon="i-lucide-search"
          placeholder="Search faculty..."
          class="w-full sm:w-64"
        />
      </div>

      <!-- Loading -->
      <div
        v-if="loadingAssignments || loadingTeachers"
        class="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        <USkeleton v-for="index in 6" :key="index" class="h-24 rounded-2xl" />
      </div>

      <!-- Empty -->
      <div v-else-if="!filteredTeachers.length" class="px-6 py-12 text-center">
        <UIcon name="i-lucide-users-x" class="mx-auto size-10 text-gray-400" />

        <h3 class="mt-4 text-sm font-bold text-gray-900 dark:text-white">
          No faculty found
        </h3>
      </div>

      <!-- Faculty -->
      <div
        v-else
        class="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        <button
          v-for="teacher in filteredTeachers"
          :key="teacher.id"
          type="button"
          class="flex items-center gap-4 rounded-2xl border p-4 text-left transition"
          :class="
            isTeacherSelected(teacher.id)
              ? 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-200 dark:border-emerald-800 dark:bg-emerald-950/20'
              : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/40 dark:border-gray-800 dark:hover:border-emerald-900'
          "
          @click="toggleTeacher(teacher.id)"
        >
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-xl"
            :class="
              isTeacherSelected(teacher.id)
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
            "
          >
            <UIcon name="i-lucide-user-round" class="size-5" />
          </div>

          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-bold text-gray-900 dark:text-white">
              {{ teacher.name || "Unnamed Faculty" }}
            </p>

            <p class="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
              {{
                teacher.department?.name ||
                teacher.department?.department_name ||
                "Department not specified"
              }}
            </p>
          </div>

          <div
            class="flex size-6 shrink-0 items-center justify-center rounded-full border"
            :class="
              isTeacherSelected(teacher.id)
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-gray-300 bg-white text-transparent dark:border-gray-700 dark:bg-gray-900'
            "
          >
            <UIcon name="i-lucide-check" class="size-3.5" />
          </div>
        </button>
      </div>

      <!-- Actions -->
      <div
        class="flex flex-col gap-3 border-t border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ selectedTeacherIds.length }}
          faculty selected
        </p>

        <div class="flex gap-2">
          <UButton
            color="neutral"
            variant="outline"
            :disabled="saving"
            @click="resetSelection"
          >
            Reset
          </UButton>

          <UButton
            icon="i-lucide-save"
            :loading="saving"
            :disabled="saving"
            @click="saveAssignments"
          >
            Save Assignments
          </UButton>
        </div>
      </div>
    </section>

    <!-- =====================================================
      NO CLASS SELECTED
    ====================================================== -->
    <section
      v-else
      class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-900"
    >
      <div
        class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
      >
        <UIcon name="i-lucide-school" class="size-8" />
      </div>

      <h2 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
        Select a class
      </h2>

      <p
        class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400"
      >
        Choose the course, year level, and section before assigning faculty.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  middleware: ["auth", "role"],
  role: ["Dean"],
});

const { $api } = useNuxtApp();
const toast = useToast();

/* =========================================================
   STATE
========================================================= */

const courses = ref<any[]>([]);
const teachers = ref<any[]>([]);

const loadingCourses = ref(false);
const loadingTeachers = ref(false);
const loadingAssignments = ref(false);
const saving = ref(false);

const activePeriod = ref<any>(null);

const facultySearch = ref("");

const selectedTeacherIds = ref<number[]>([]);
const originalTeacherIds = ref<number[]>([]);

const filters = reactive({
  course: null as any,
  year_level: "",
  section: "",
});

/* =========================================================
   OPTIONS
========================================================= */

const yearLevelOptions = [
  {
    label: "1st Year",
    value: "1st Year",
  },
  {
    label: "2nd Year",
    value: "2nd Year",
  },
  {
    label: "3rd Year",
    value: "3rd Year",
  },
  {
    label: "4th Year",
    value: "4th Year",
  },
  {
    label: "5th Year",
    value: "5th Year",
  },
];

const sectionOptionsMap: Record<string, string[]> = {
  "1st Year": ["1A", "1B", "1C"],

  "2nd Year": ["2A", "2B", "2C"],

  "3rd Year": ["3A", "3B", "3C"],

  "4th Year": ["4A", "4B", "4C"],

  "5th Year": ["5A", "5B", "5C"],
};

/* =========================================================
   COMPUTED
========================================================= */

const courseOptions = computed(() =>
  courses.value.map((course: any) => ({
    label: `${course.code?.toUpperCase() || "NO CODE"} - ${course.name}`,

    value: course.id,
  })),
);

const sectionOptions = computed(() => {
  const rows = sectionOptionsMap[filters.year_level] || [];

  return rows.map((section) => ({
    label: section,
    value: section,
  }));
});

const isClassSelected = computed(() =>
  Boolean(filters.course && filters.year_level && filters.section),
);

const selectedCourse = computed(() =>
  courses.value.find(
    (course: any) => Number(course.id) === Number(filters.course),
  ),
);

const selectedClassLabel = computed(() => {
  if (!isClassSelected.value) {
    return "";
  }

  const code =
    selectedCourse.value?.code || selectedCourse.value?.name || "COURSE";

  return `${code}-${filters.section}`;
});

const activePeriodLabel = computed(() => {
  if (!activePeriod.value) {
    return "No active academic period";
  }

  return `${activePeriod.value.semester} · ${activePeriod.value.school_year}`;
});

const filteredTeachers = computed(() => {
  const query = facultySearch.value.trim().toLowerCase();

  if (!query) {
    return teachers.value;
  }

  return teachers.value.filter((teacher: any) => {
    const name = String(teacher?.name || "").toLowerCase();

    const department = String(
      teacher?.department?.name || teacher?.department?.department_name || "",
    ).toLowerCase();

    return name.includes(query) || department.includes(query);
  });
});

/* =========================================================
   API — COURSES
========================================================= */

const getCourses = async () => {
  loadingCourses.value = true;

  try {
    const response: any = await $api("/courses", {
      query: {
        "sort[0]": "name:asc",

        "pagination[pageSize]": 500,
      },
    });

    courses.value = response?.data || [];
  } finally {
    loadingCourses.value = false;
  }
};

/* =========================================================
   API — FACULTY
========================================================= */

const getTeachers = async () => {
  loadingTeachers.value = true;

  try {
    const response: any = await $api("/teachers", {
      query: {
        "populate[department]": true,

        "sort[0]": "name:asc",

        "pagination[pageSize]": 500,
      },
    });

    teachers.value = response?.data || [];
  } finally {
    loadingTeachers.value = false;
  }
};

/* =========================================================
   API — CLASS ASSIGNMENTS
========================================================= */

const loadClassAssignments = async () => {
  selectedTeacherIds.value = [];
  originalTeacherIds.value = [];

  if (!isClassSelected.value) {
    return;
  }

  loadingAssignments.value = true;

  try {
    const response: any = await $api("/faculty-class-assignments/class", {
      query: {
        course: filters.course,

        year_level: filters.year_level,

        section: filters.section,
      },
    });

    activePeriod.value = response?.active_period || null;

    const ids = (response?.data || [])
      .map((assignment: any) => Number(assignment?.teacher?.id))
      .filter(Boolean);

    selectedTeacherIds.value = [...ids];

    originalTeacherIds.value = [...ids];
  } catch (error: any) {
    console.error("Class assignments loading error:", error);

    toast.add({
      title: "Unable to load assignments",

      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to load faculty class assignments.",

      icon: "i-lucide-triangle-alert",

      color: "error",
    });
  } finally {
    loadingAssignments.value = false;
  }
};

/* =========================================================
   SELECTION
========================================================= */

const isTeacherSelected = (teacherId: number) => {
  return selectedTeacherIds.value.includes(Number(teacherId));
};

const toggleTeacher = (teacherId: number) => {
  const id = Number(teacherId);

  if (selectedTeacherIds.value.includes(id)) {
    selectedTeacherIds.value = selectedTeacherIds.value.filter(
      (item) => item !== id,
    );

    return;
  }

  selectedTeacherIds.value = [...selectedTeacherIds.value, id];
};

const resetSelection = () => {
  selectedTeacherIds.value = [...originalTeacherIds.value];
};

/* =========================================================
   SAVE
========================================================= */

const saveAssignments = async () => {
  if (!isClassSelected.value) {
    return;
  }

  saving.value = true;

  try {
    const response: any = await $api("/faculty-class-assignments/class", {
      method: "POST",

      body: {
        course: filters.course,

        year_level: filters.year_level,

        section: filters.section,

        teacher_ids: selectedTeacherIds.value,
      },
    });

    toast.add({
      title: "Assignments saved",

      description:
        response?.message ||
        "Class faculty assignments were saved successfully.",

      icon: "i-lucide-circle-check",

      color: "success",
    });

    await loadClassAssignments();
  } catch (error: any) {
    console.error("Save class assignments error:", error);

    toast.add({
      title: "Unable to save assignments",

      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to save class faculty assignments.",

      icon: "i-lucide-triangle-alert",

      color: "error",
    });
  } finally {
    saving.value = false;
  }
};

/* =========================================================
   FILTER CHANGES
========================================================= */

const onCourseChanged = () => {
  filters.year_level = "";
  filters.section = "";

  selectedTeacherIds.value = [];
  originalTeacherIds.value = [];
};

const onYearChanged = () => {
  filters.section = "";

  selectedTeacherIds.value = [];
  originalTeacherIds.value = [];
};

/* =========================================================
   LOAD
========================================================= */

onMounted(async () => {
  try {
    await Promise.all([getCourses(), getTeachers()]);
  } catch (error: any) {
    console.error("Dean class assignment loading error:", error);

    toast.add({
      title: "Unable to load page",

      description:
        "The required course or faculty information could not be loaded.",

      icon: "i-lucide-triangle-alert",

      color: "error",
    });
  }
});
</script>
