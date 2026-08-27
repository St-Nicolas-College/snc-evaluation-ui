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
      <div
        class="border-b border-gray-200 px-5 py-4 dark:border-gray-800"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          >
            <UIcon
              name="i-lucide-sliders-horizontal"
              class="size-5"
            />
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

      <div
        class="grid grid-cols-1 gap-4 p-5 sm:p-6 md:grid-cols-3"
      >
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
              filters.year_level
                ? 'Select section'
                : 'Select year level first'
            "
            class="w-full"
            @update:model-value="onSectionChanged"
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
            {{ selectedTeacherIds?.length || 0 }}
            faculty member{{ (selectedTeacherIds?.length || 0) === 1 ? "" : "s" }}
            currently selected
            <span class="mx-1">•</span>
            {{ classStudents?.length || 0 }}
            student{{ (classStudents?.length || 0) === 1 ? "" : "s" }}
            registered in this class.
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

      <div
        v-if="loadingAssignments || loadingTeachers"
        class="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        <USkeleton
          v-for="index in 6"
          :key="index"
          class="h-24 rounded-2xl"
        />
      </div>

      <div
        v-else-if="!(filteredTeachers?.length || 0)"
        class="px-6 py-12 text-center"
      >
        <UIcon
          name="i-lucide-users-x"
          class="mx-auto size-10 text-gray-400"
        />

        <h3 class="mt-4 text-sm font-bold text-gray-900 dark:text-white">
          No faculty found
        </h3>
      </div>

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

      <div
        class="flex flex-col gap-3 border-t border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ selectedTeacherIds?.length || 0 }}
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
      CLASS STUDENTS
    ====================================================== -->
    <section
      v-if="isClassSelected"
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          >
            <UIcon name="i-lucide-users" class="size-5" />
          </div>

          <div>
            <h2 class="text-sm font-bold text-gray-900 dark:text-white">
              Students in {{ selectedClassLabel }}
            </h2>

            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Students registered under the selected course, year level, and section.
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <UBadge color="primary" variant="subtle">
            {{ classStudents?.length || 0 }}
            Student{{ (classStudents?.length || 0) === 1 ? "" : "s" }}
          </UBadge>

          <UInput
            v-model="studentSearch"
            icon="i-lucide-search"
            placeholder="Search students..."
            class="w-full sm:w-64"
          />
        </div>
      </div>

      <div
        v-if="loadingStudents"
        class="space-y-3 p-5"
      >
        <USkeleton
          v-for="index in 5"
          :key="index"
          class="h-16 w-full rounded-xl"
        />
      </div>

      <div
        v-else-if="!(filteredClassStudents?.length || 0)"
        class="px-6 py-12 text-center"
      >
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
        >
          <UIcon name="i-lucide-user-round-x" class="size-7" />
        </div>

        <h3 class="mt-4 text-sm font-bold text-gray-900 dark:text-white">
          {{
            (classStudents?.length || 0)
              ? "No matching students"
              : "No students found"
          }}
        </h3>

        <p
          class="mx-auto mt-2 max-w-md text-xs leading-5 text-gray-500 dark:text-gray-400"
        >
          {{
            (classStudents?.length || 0)
              ? "Try changing your search."
              : "There are currently no students registered under this class."
          }}
        </p>
      </div>

      <div
        v-else
        class="overflow-x-auto"
      >
        <table class="w-full min-w-[760px] text-sm">
          <thead
            class="border-b border-gray-200 bg-gray-50/80 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
          >
            <tr>
              <th class="w-14 px-5 py-3 text-center font-semibold">#</th>
              <th class="px-5 py-3 text-left font-semibold">Student ID</th>
              <th class="px-5 py-3 text-left font-semibold">Student Name</th>
              <th class="px-5 py-3 text-left font-semibold">Course</th>
              <th class="px-5 py-3 text-center font-semibold">Year Level</th>
              <th class="px-5 py-3 text-center font-semibold">Section</th>
            </tr>
          </thead>

          <tbody
            class="divide-y divide-gray-100 dark:divide-gray-800"
          >
            <tr
              v-for="(student, index) in filteredClassStudents"
              :key="student.documentId || student.id"
              class="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
            >
              <td class="px-5 py-4 text-center text-xs text-gray-400">
                {{ index + 1 }}
              </td>

              <td
                class="px-5 py-4 font-mono text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                {{ student.student_id || "—" }}
              </td>

              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <UAvatar
                    :alt="student.name || 'Student'"
                    :text="getStudentInitials(student.name)"
                    size="sm"
                  />

                  <div class="min-w-0">
                    <p
                      class="truncate font-semibold text-gray-900 dark:text-white"
                    >
                      {{ student.name || "Unnamed Student" }}
                    </p>

                    <p
                      v-if="student.email"
                      class="mt-0.5 truncate text-xs text-gray-400"
                    >
                      {{ student.email }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-5 py-4 text-gray-600 dark:text-gray-300">
                {{
                  student.course?.code ||
                  student.course?.name ||
                  "—"
                }}
              </td>

              <td
                class="px-5 py-4 text-center text-gray-600 dark:text-gray-300"
              >
                {{ student.year_level || "—" }}
              </td>

              <td class="px-5 py-4 text-center">
                <UBadge color="neutral" variant="subtle">
                  {{ student.section || "—" }}
                </UBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- =====================================================
      NO CLASS SELECTED
    ====================================================== -->
    <section
      v-if="!isClassSelected"
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
  role: ["Dean"]
})

const { $api } = useNuxtApp()
const toast = useToast()

const courses = ref<any[]>([])
const teachers = ref<any[]>([])
const classStudents = ref<any[]>([])

const loadingCourses = ref(false)
const loadingTeachers = ref(false)
const loadingAssignments = ref(false)
const loadingStudents = ref(false)

const saving = ref(false)
const activePeriod = ref<any>(null)

const facultySearch = ref("")
const studentSearch = ref("")

const selectedTeacherIds = ref<number[]>([])
const originalTeacherIds = ref<number[]>([])

const filters = reactive({
  course: null as any,
  year_level: "",
  section: ""
})

const yearLevelOptions = [
  { label: "1st Year", value: "1st Year" },
  { label: "2nd Year", value: "2nd Year" },
  { label: "3rd Year", value: "3rd Year" },
  { label: "4th Year", value: "4th Year" },
  { label: "5th Year", value: "5th Year" }
]

const sectionOptionsMap: Record<string, string[]> = {
  "1st Year": ["1A", "1B", "1C"],
  "2nd Year": ["2A", "2B", "2C"],
  "3rd Year": ["3A", "3B", "3C"],
  "4th Year": ["4A", "4B", "4C"],
  "5th Year": ["5A", "5B", "5C"]
}

const courseOptions = computed(() => {
  const list = Array.isArray(courses.value)
    ? courses.value
    : []

  return list.map((course: any) => ({
    label:
      `${course?.code?.toUpperCase() || "NO CODE"} - ${course?.name || "Unnamed Course"}`,
    value:
      course?.id
  }))
})

const sectionOptions = computed(() => {
  const rows =
    sectionOptionsMap[
      String(filters.year_level || "")
    ] || []

  return rows.map(section => ({
    label: section,
    value: section
  }))
})

const isClassSelected = computed(() =>
  Boolean(
    filters.course &&
    filters.year_level &&
    filters.section
  )
)

const selectedCourse = computed(() => {
  const list = Array.isArray(courses.value)
    ? courses.value
    : []

  return list.find(
    (course: any) =>
      Number(course?.id) ===
      Number(filters.course)
  )
})

const selectedClassLabel = computed(() => {
  if (!isClassSelected.value) {
    return ""
  }

  const code =
    selectedCourse.value?.code ||
    selectedCourse.value?.name ||
    "COURSE"

  return `${String(code).toUpperCase()}-${filters.section}`
})

const activePeriodLabel = computed(() => {
  if (!activePeriod.value) {
    return "No active academic period"
  }

  return `${activePeriod.value?.semester || "Semester not set"} · ${activePeriod.value?.school_year || "School year not set"}`
})

const filteredTeachers = computed<any[]>(() => {
  const list = Array.isArray(teachers.value)
    ? teachers.value
    : []

  const query =
    String(facultySearch.value || "")
      .trim()
      .toLowerCase()

  if (!query) {
    return list
  }

  return list.filter((teacher: any) => {
    const name =
      String(
        teacher?.name || ""
      ).toLowerCase()

    const department =
      String(
        teacher?.department?.name ||
        teacher?.department?.department_name ||
        ""
      ).toLowerCase()

    return (
      name.includes(query) ||
      department.includes(query)
    )
  })
})

const filteredClassStudents = computed<any[]>(() => {
  const list = Array.isArray(classStudents.value)
    ? classStudents.value
    : []

  const query =
    String(studentSearch.value || "")
      .trim()
      .toLowerCase()

  if (!query) {
    return list
  }

  return list.filter((student: any) => {
    const studentId =
      String(student?.student_id || "")
        .toLowerCase()

    const name =
      String(student?.name || "")
        .toLowerCase()

    const email =
      String(student?.email || "")
        .toLowerCase()

    return (
      studentId.includes(query) ||
      name.includes(query) ||
      email.includes(query)
    )
  })
})

const getStudentInitials = (name: string) => {
  if (!name) {
    return "ST"
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(
      (part: string) =>
        part.charAt(0).toUpperCase()
    )
    .join("")
}

const getCourses = async () => {
  loadingCourses.value = true

  try {
    const response: any =
      await $api("/courses", {
        query: {
          "sort[0]": "name:asc",
          "pagination[pageSize]": 500
        }
      })

    courses.value =
      Array.isArray(response?.data)
        ? response.data
        : []
  } catch (error: any) {
    courses.value = []

    toast.add({
      title: "Unable to load courses",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to load courses.",
      icon: "i-lucide-triangle-alert",
      color: "error"
    })
  } finally {
    loadingCourses.value = false
  }
}

const getTeachers = async () => {
  loadingTeachers.value = true

  try {
    const response: any =
      await $api("/teachers", {
        query: {
          "populate[department]": true,
          "sort[0]": "name:asc",
          "pagination[pageSize]": 500
        }
      })

    teachers.value =
      Array.isArray(response?.data)
        ? response.data
        : []
  } catch (error: any) {
    teachers.value = []

    toast.add({
      title: "Unable to load faculty",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to load faculty.",
      icon: "i-lucide-triangle-alert",
      color: "error"
    })
  } finally {
    loadingTeachers.value = false
  }
}

const loadClassAssignments = async () => {
  selectedTeacherIds.value = []
  originalTeacherIds.value = []

  if (!isClassSelected.value) {
    return
  }

  loadingAssignments.value = true

  try {
    const response: any =
      await $api(
        "/faculty-class-assignments/class",
        {
          query: {
            course: filters.course,
            year_level: filters.year_level,
            section: filters.section
          }
        }
      )

    activePeriod.value =
      response?.active_period || null

    const rows =
      Array.isArray(response?.data)
        ? response.data
        : []

    const ids = rows
      .map(
        (assignment: any) =>
          Number(
            assignment?.teacher?.id
          )
      )
      .filter(
        (id: number) =>
          Number.isFinite(id) &&
          id > 0
      )

    selectedTeacherIds.value =
      [...ids]

    originalTeacherIds.value =
      [...ids]
  } catch (error: any) {
    selectedTeacherIds.value = []
    originalTeacherIds.value = []

    toast.add({
      title:
        "Unable to load assignments",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to load faculty class assignments.",
      icon:
        "i-lucide-triangle-alert",
      color:
        "error"
    })
  } finally {
    loadingAssignments.value = false
  }
}

const getClassStudents = async () => {
  classStudents.value = []

  if (!isClassSelected.value) {
    return
  }

  loadingStudents.value = true

  try {
    const response: any =
      await $api("/students", {
        query: {
          "filters[course][id][$eq]":
            filters.course,

          "filters[year_level][$eq]":
            filters.year_level,

          "filters[section][$eq]":
            filters.section,

          "populate[course]":
            true,

          "sort[0]":
            "name:asc",

          "pagination[pageSize]":
            500
        }
      })

    classStudents.value =
      Array.isArray(response?.data)
        ? response.data
        : []
  } catch (error: any) {
    classStudents.value = []

    toast.add({
      title:
        "Unable to load students",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to load students for the selected class.",
      icon:
        "i-lucide-triangle-alert",
      color:
        "error"
    })
  } finally {
    loadingStudents.value = false
  }
}

const isTeacherSelected = (
  teacherId: number
) => {
  const list =
    Array.isArray(selectedTeacherIds.value)
      ? selectedTeacherIds.value
      : []

  return list.includes(
    Number(teacherId)
  )
}

const toggleTeacher = (
  teacherId: number
) => {
  const id =
    Number(teacherId)

  const list =
    Array.isArray(selectedTeacherIds.value)
      ? selectedTeacherIds.value
      : []

  if (list.includes(id)) {
    selectedTeacherIds.value =
      list.filter(
        item =>
          item !== id
      )

    return
  }

  selectedTeacherIds.value = [
    ...list,
    id
  ]
}

const resetSelection = () => {
  selectedTeacherIds.value =
    Array.isArray(originalTeacherIds.value)
      ? [...originalTeacherIds.value]
      : []
}

const saveAssignments = async () => {
  if (!isClassSelected.value) {
    return
  }

  saving.value = true

  try {
    const teacherIds =
      Array.isArray(selectedTeacherIds.value)
        ? selectedTeacherIds.value
        : []

    const response: any =
      await $api(
        "/faculty-class-assignments/class",
        {
          method: "POST",

          body: {
            course:
              filters.course,

            year_level:
              filters.year_level,

            section:
              filters.section,

            teacher_ids:
              teacherIds
          }
        }
      )

    toast.add({
      title:
        "Assignments saved",
      description:
        response?.message ||
        "Class faculty assignments were saved successfully.",
      icon:
        "i-lucide-circle-check",
      color:
        "success"
    })

    await loadClassAssignments()
  } catch (error: any) {
    toast.add({
      title:
        "Unable to save assignments",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to save class faculty assignments.",
      icon:
        "i-lucide-triangle-alert",
      color:
        "error"
    })
  } finally {
    saving.value = false
  }
}

const onCourseChanged = () => {
  filters.year_level = ""
  filters.section = ""

  selectedTeacherIds.value = []
  originalTeacherIds.value = []
  classStudents.value = []

  facultySearch.value = ""
  studentSearch.value = ""

  activePeriod.value = null
}

const onYearChanged = () => {
  filters.section = ""

  selectedTeacherIds.value = []
  originalTeacherIds.value = []
  classStudents.value = []

  facultySearch.value = ""
  studentSearch.value = ""

  activePeriod.value = null
}

const onSectionChanged = async () => {
  selectedTeacherIds.value = []
  originalTeacherIds.value = []

  classStudents.value = []

  facultySearch.value = ""
  studentSearch.value = ""

  if (!isClassSelected.value) {
    return
  }

  await Promise.all([
    loadClassAssignments(),
    getClassStudents()
  ])
}

onMounted(async () => {
  await Promise.all([
    getCourses(),
    getTeachers()
  ])
})
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
