<template>
  <div class="space-y-6 pb-10">
    <section class="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7 dark:border-emerald-900">
      <div class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex items-start gap-4">
          <div class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 sm:flex">
            <UIcon name="i-lucide-users-round" class="size-7" />
          </div>
          <div>
            <div class="mb-2 flex gap-2 text-xs">
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">Student Portal</span>
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">Teacher Assignment</span>
            </div>
            <h1 class="text-2xl font-bold sm:text-3xl">My Teachers</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Manage your teachers for the current school year and semester.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <HeroStat :value="assignments.length" label="Assigned" />
          <HeroStat :value="activeSemester || '—'" label="Semester" small />
          <HeroStat :value="activeSchoolYearLabel || '—'" label="School Year" small />
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-bold text-gray-900 dark:text-white">
            {{ studentProfile?.name || 'Student Account' }}
          </p>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ studentProfile?.student_id || '—' }}
            <span v-if="studentProfile?.course?.code"> · {{ studentProfile.course.code }}</span>
            <span v-if="studentProfile?.year_level"> · {{ studentProfile.year_level }}</span>
            <span v-if="studentProfile?.section"> · {{ studentProfile.section }}</span>
          </p>
        </div>

        <div v-if="activePeriod" class="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/30">
          <p class="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">Active Academic Period</p>
          <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
            {{ activeSemester }} · {{ activeSchoolYearLabel }}
          </p>
        </div>
      </div>
    </section>

    <div v-if="pending" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <USkeleton v-for="i in 6" :key="i" class="h-48 rounded-2xl" />
    </div>

    <section v-else-if="loadError" class="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900 dark:bg-red-950/20">
      <UIcon name="i-lucide-triangle-alert" class="mx-auto size-8 text-red-600" />
      <h2 class="mt-4 text-lg font-bold">Unable to load your teachers</h2>
      <p class="mt-2 text-sm text-gray-500">{{ loadError }}</p>
      <UButton class="mt-5" icon="i-lucide-refresh-cw" @click="loadData">Try Again</UButton>
    </section>

    <template v-else>
      <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 class="text-sm font-bold">Current Teacher Assignments</h2>
            <p class="mt-1 text-xs text-gray-500">Teachers assigned to you for the active academic period.</p>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row">
            <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Search teacher..." class="sm:w-64" />
            <UButton icon="i-lucide-user-round-plus" :disabled="!activePeriod" @click="openAddTeachers">
              Add Teachers
            </UButton>
          </div>
        </div>
      </section>

      <section v-if="!activePeriod" class="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-10 text-center dark:border-amber-900 dark:bg-amber-950/20">
        <UIcon name="i-lucide-calendar-x-2" class="mx-auto size-8 text-amber-600" />
        <h2 class="mt-4 text-lg font-bold">No active academic period</h2>
        <p class="mt-2 text-sm text-gray-500">An active school year and semester is required before teachers can be assigned.</p>
      </section>

      <section v-else-if="!filteredAssignments.length" class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-900">
        <UIcon name="i-lucide-users-round" class="mx-auto size-10 text-emerald-600" />
        <h2 class="mt-4 text-lg font-bold">{{ assignments.length ? 'No matching teachers' : 'No teachers assigned yet' }}</h2>
        <p class="mt-2 text-sm text-gray-500">
          {{ assignments.length ? 'Try changing your search.' : 'Add the teachers currently teaching you.' }}
        </p>
        <UButton v-if="!assignments.length" class="mt-5" icon="i-lucide-user-round-plus" @click="openAddTeachers">
          Add My Teachers
        </UButton>
      </section>

      <section v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="assignment in filteredAssignments" :key="assignment.documentId || assignment.id"
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-5 py-5 text-white">
            <div class="flex items-start justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <div class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-emerald-300">
                  <UIcon name="i-lucide-presentation" class="size-5" />
                </div>
                <div class="min-w-0">
                  <p class="text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-300">Assigned Faculty</p>
                  <h2 class="mt-1 truncate text-base font-bold">{{ getTeacherName(assignment) }}</h2>
                </div>
              </div>
              <UBadge color="success" variant="solid" size="sm">Active</UBadge>
            </div>
          </div>

          <div class="space-y-4 p-5">
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40">
              <p class="text-[9px] uppercase tracking-wide text-gray-400">Department</p>
              <p class="mt-1 text-xs font-bold">{{ getDepartmentName(assignment) }}</p>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <InfoBox label="Semester" :value="getAssignmentSemester(assignment)" />
              <InfoBox label="School Year" :value="getAssignmentSchoolYear(assignment)" />
            </div>

            <div class="flex justify-end border-t border-gray-200 pt-3 dark:border-gray-800">
              <UButton color="error" variant="ghost" size="xs" icon="i-lucide-user-round-x"
                @click="openRemoveConfirmation(assignment)">
                Remove
              </UButton>
            </div>
          </div>
        </article>
      </section>
    </template>


    <!-- Previous Teacher Assignments -->
    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
          >
            <UIcon name="i-lucide-history" class="size-4" />
          </div>

          <div>
            <h2 class="text-sm font-bold text-gray-900 dark:text-white">
              Previous Teacher Assignments
            </h2>

            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Teachers from your previous semesters and school years.
            </p>
          </div>
        </div>

        <UBadge color="neutral" variant="subtle">
          {{ assignmentHistory.length }}
          period{{ assignmentHistory.length === 1 ? "" : "s" }}
        </UBadge>
      </div>

      <div
        v-if="historyPending"
        class="space-y-3 p-5 sm:p-6"
      >
        <USkeleton
          v-for="index in 3"
          :key="index"
          class="h-28 w-full rounded-2xl"
        />
      </div>

      <div
        v-else-if="!assignmentHistory.length"
        class="px-6 py-10 text-center"
      >
        <div
          class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
        >
          <UIcon name="i-lucide-history" class="size-5" />
        </div>

        <h3 class="mt-4 text-sm font-bold text-gray-900 dark:text-white">
          No previous assignments yet
        </h3>

        <p
          class="mx-auto mt-2 max-w-md text-xs leading-5 text-gray-500 dark:text-gray-400"
        >
          Previous teacher assignments will appear here after the active
          academic period changes.
        </p>
      </div>

      <div
        v-else
        class="divide-y divide-gray-200 dark:divide-gray-800"
      >
        <div
          v-for="period in assignmentHistory"
          :key="
            period.documentId ||
            period.id ||
            `${period.school_year}-${period.semester}`
          "
          class="p-5 sm:p-6"
        >
          <div
            class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p
                class="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400"
              >
                Previous Academic Period
              </p>

              <h3 class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                {{ period.semester || "Semester not specified" }}
                ·
                {{ period.school_year || "School year not specified" }}
              </h3>
            </div>

            <UBadge color="neutral" variant="subtle">
              {{ period.assignments?.length || 0 }}
              teacher{{ (period.assignments?.length || 0) === 1 ? "" : "s" }}
            </UBadge>
          </div>

          <div
            class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
          >
            <div
              v-for="assignment in period.assignments || []"
              :key="assignment.documentId || assignment.id"
              class="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
                >
                  <UIcon
                    name="i-lucide-presentation"
                    class="size-4"
                  />
                </div>

                <div class="min-w-0">
                  <p
                    class="truncate text-sm font-bold text-gray-900 dark:text-white"
                  >
                    {{
                      assignment?.teacher?.name ||
                      "Unknown Faculty"
                    }}
                  </p>

                  <p
                    class="mt-1 truncate text-xs text-gray-500 dark:text-gray-400"
                  >
                    {{
                      assignment?.teacher?.department?.name ||
                      assignment?.teacher?.department?.department_name ||
                      "Department not specified"
                    }}
                  </p>
                </div>
              </div>

              <div
                class="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-800"
              >
                <span class="text-[10px] text-gray-400">
                  Historical assignment
                </span>

                <UBadge
                  :color="assignment?.is_active ? 'success' : 'neutral'"
                  variant="subtle"
                  size="sm"
                >
                  {{
                    assignment?.is_active
                      ? "Active Record"
                      : "Archived"
                  }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <UModal v-model:open="addTeachersOpen">
      <template #content>
        <div class="max-h-[88vh] overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-6 py-6 text-white">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Teacher Assignment</p>
                <h2 class="mt-1 text-xl font-bold">Add My Teachers</h2>
                <p class="mt-1 text-xs text-slate-300">{{ activeSemester }} · {{ activeSchoolYearLabel }}</p>
              </div>
              <UButton color="neutral" variant="ghost" icon="i-lucide-x" square class="text-white" @click="addTeachersOpen = false" />
            </div>
          </div>

          <div class="flex max-h-[calc(88vh-120px)] flex-col">
            <div class="border-b border-gray-200 p-5 dark:border-gray-800">
              <UInput v-model="availableSearch" icon="i-lucide-search" placeholder="Search faculty or department..." class="w-full" />
              <p class="mt-2 text-xs text-gray-500">{{ selectedTeacherIds.length }} selected</p>
            </div>

            <div v-if="availablePending" class="space-y-3 overflow-y-auto p-5">
              <USkeleton v-for="i in 5" :key="i" class="h-20 rounded-xl" />
            </div>

            <div v-else-if="!filteredAvailableTeachers.length" class="px-6 py-12 text-center">
              <UIcon name="i-lucide-circle-check-big" class="mx-auto size-8 text-emerald-600" />
              <h3 class="mt-3 font-bold">No additional teachers available</h3>
            </div>

            <div v-else class="space-y-2 overflow-y-auto p-5">
              <button
                v-for="teacher in filteredAvailableTeachers"
                :key="teacher.id"
                type="button"
                class="flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition"
                :class="isTeacherSelected(teacher.id)
                  ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20'
                  : 'border-gray-200 hover:border-emerald-200 dark:border-gray-800'"
                @click="toggleTeacherSelection(teacher.id)"
              >
                <div class="flex size-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                  <UIcon name="i-lucide-user-round" class="size-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-bold">{{ teacher.name || 'Unnamed Faculty' }}</p>
                  <p class="mt-1 truncate text-xs text-gray-500">
                    {{ teacher.department?.name || teacher.department?.department_name || 'Department not specified' }}
                  </p>
                </div>
                <UIcon v-if="isTeacherSelected(teacher.id)" name="i-lucide-circle-check-big" class="size-5 text-emerald-600" />
              </button>
            </div>

            <div class="flex justify-end gap-2 border-t border-gray-200 p-5 dark:border-gray-800">
              <UButton color="neutral" variant="outline" @click="addTeachersOpen = false">Cancel</UButton>
              <UButton icon="i-lucide-user-round-plus" :loading="savingTeachers"
                :disabled="!selectedTeacherIds.length || savingTeachers" @click="saveSelectedTeachers">
                Add Teachers
              </UButton>
            </div>
          </div>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="removeOpen">
      <template #content>
        <div class="rounded-[26px] border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          <UIcon name="i-lucide-user-round-x" class="mx-auto size-10 text-red-600" />
          <h2 class="mt-4 text-lg font-bold">Remove this teacher?</h2>
          <p class="mt-2 text-sm text-gray-500">
            {{ removeTarget ? `${getTeacherName(removeTarget)} will be removed from your current assignments.` : '' }}
          </p>
          <div class="mt-6 flex justify-center gap-2">
            <UButton color="neutral" variant="outline" @click="closeRemoveConfirmation">Cancel</UButton>
            <UButton color="error" :loading="removingTeacher" @click="confirmRemoveTeacher">Remove Teacher</UButton>
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
  role: ["Student"]
})

const { $api } = useNuxtApp()
const { user } = useAuth()
const toast = useToast()

const pending = ref(true)
const loadError = ref("")
const studentProfile = ref<any>(null)
const activePeriod = ref<any>(null)
const assignments = ref<any[]>([])
const assignmentHistory = ref<any[]>([])
const historyPending = ref(false)
const searchQuery = ref("")

const addTeachersOpen = ref(false)
const availableTeachers = ref<any[]>([])
const availablePending = ref(false)
const availableSearch = ref("")
const selectedTeacherIds = ref<number[]>([])
const savingTeachers = ref(false)

const removeOpen = ref(false)
const removeTarget = ref<any>(null)
const removingTeacher = ref(false)

const activeSemester = computed(() => activePeriod.value?.semester || "")
const activeSchoolYearLabel = computed(() => activePeriod.value?.school_year || "")

const filteredAssignments = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return assignments.value
  return assignments.value.filter(a =>
    getTeacherName(a).toLowerCase().includes(q) ||
    getDepartmentName(a).toLowerCase().includes(q)
  )
})

const filteredAvailableTeachers = computed(() => {
  const q = availableSearch.value.trim().toLowerCase()
  if (!q) return availableTeachers.value
  return availableTeachers.value.filter(t =>
    String(t?.name || "").toLowerCase().includes(q) ||
    String(t?.department?.name || t?.department?.department_name || "").toLowerCase().includes(q)
  )
})

const getTeacherName = (a: any) =>
  a?.teacher?.name || a?.teacher?.full_name || "Unknown Faculty"

const getDepartmentName = (a: any) =>
  a?.teacher?.department?.name ||
  a?.teacher?.department?.department_name ||
  "Department not specified"

const getAssignmentSemester = (a: any) =>
  a?.school_year_record?.semester || activeSemester.value || "Not specified"

const getAssignmentSchoolYear = (a: any) =>
  a?.school_year_record?.school_year || activeSchoolYearLabel.value || "Not specified"

const getMyAssignments = async () => {
  const res: any = await $api("/student-teacher-assignments/me")
  assignments.value = res?.data || []
  studentProfile.value = res?.student || null
  activePeriod.value = res?.active_period || null
}


const getAssignmentHistory = async () => {
  historyPending.value = true

  try {
    const res: any = await $api(
      "/student-teacher-assignments/history"
    )

    assignmentHistory.value = res?.data || []
  } catch (error: any) {
    console.error(
      "Teacher assignment history loading error:",
      error
    )

    assignmentHistory.value = []
  } finally {
    historyPending.value = false
  }
}

const getAvailableTeachers = async () => {
  availablePending.value = true
  try {
    const res: any = await $api("/student-teacher-assignments/available-teachers")
    availableTeachers.value = res?.data || []
  } finally {
    availablePending.value = false
  }
}

const openAddTeachers = async () => {
  availableSearch.value = ""
  selectedTeacherIds.value = []
  addTeachersOpen.value = true
  await getAvailableTeachers()
}

const isTeacherSelected = (id: number) =>
  selectedTeacherIds.value.includes(Number(id))

const toggleTeacherSelection = (id: number) => {
  id = Number(id)
  selectedTeacherIds.value = isTeacherSelected(id)
    ? selectedTeacherIds.value.filter(x => x !== id)
    : [...selectedTeacherIds.value, id]
}

const saveSelectedTeachers = async () => {
  if (!selectedTeacherIds.value.length) return
  savingTeachers.value = true
  try {
    const res: any = await $api("/student-teacher-assignments/me", {
      method: "POST",
      body: { teacher_ids: selectedTeacherIds.value }
    })

    toast.add({
      title: "Teachers added",
      description: res?.message || "Teacher assignments saved successfully.",
      icon: "i-lucide-circle-check",
      color: "success"
    })

    addTeachersOpen.value = false

    await Promise.all([
      getMyAssignments(),
      getAssignmentHistory()
    ])
  } catch (error: any) {
    toast.add({
      title: "Unable to add teachers",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to save teacher assignments.",
      icon: "i-lucide-triangle-alert",
      color: "error"
    })
  } finally {
    savingTeachers.value = false
  }
}

const openRemoveConfirmation = (assignment: any) => {
  removeTarget.value = assignment
  removeOpen.value = true
}

const closeRemoveConfirmation = () => {
  if (removingTeacher.value) return
  removeOpen.value = false
  removeTarget.value = null
}

const confirmRemoveTeacher = async () => {
  const id = removeTarget.value?.id
  if (!id) return

  removingTeacher.value = true
  try {
    await $api(`/student-teacher-assignments/me/${id}`, {
      method: "DELETE"
    })

    toast.add({
      title: "Teacher removed",
      description: "The teacher was removed from your current assignments.",
      icon: "i-lucide-circle-check",
      color: "success"
    })

    removeOpen.value = false
    removeTarget.value = null

    await Promise.all([
      getMyAssignments(),
      getAssignmentHistory()
    ])
  } finally {
    removingTeacher.value = false
  }
}

const loadData = async () => {
  try {
    pending.value = true
    loadError.value = ""

    await Promise.all([
      getMyAssignments(),
      getAssignmentHistory()
    ])
  } catch (error: any) {
    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Failed to load your teacher assignments."
  } finally {
    pending.value = false
  }
}

watch(
  user,
  async value => {
    if (value?.id) await loadData()
  },
  { immediate: true }
)

const HeroStat = defineComponent({
  props: { value: [String, Number], label: String, small: Boolean },
  setup(props) {
    return () =>
      h("div", { class: "rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl" }, [
        h("p", { class: props.small ? "truncate text-sm font-bold sm:text-base" : "text-2xl font-bold" }, String(props.value ?? "—")),
        h("p", { class: "mt-1 text-[10px] uppercase tracking-wide text-emerald-100" }, props.label)
      ])
  }
})

const InfoBox = defineComponent({
  props: { label: String, value: String },
  setup(props) {
    return () =>
      h("div", { class: "rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/40" }, [
        h("p", { class: "text-[9px] font-semibold uppercase tracking-wide text-gray-400" }, props.label),
        h("p", { class: "mt-1 text-xs font-bold text-gray-900 dark:text-white" }, props.value)
      ])
  }
})
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
