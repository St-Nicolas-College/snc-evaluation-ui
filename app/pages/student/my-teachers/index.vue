<template>
  <div class="space-y-6 pb-10">
    <section class="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7 dark:border-emerald-900">
      <div class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-teal-300/15 blur-3xl" />

      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex min-w-0 items-start gap-4">
          <div class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex">
            <UIcon name="i-lucide-users-round" class="size-7" />
          </div>

          <div class="min-w-0">
            <div class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-50">
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur">
                Student Portal
              </span>
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur">
                Dean-Assigned Faculty
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              My Teachers
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              View the faculty members assigned to your class by the Dean for the current academic period.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">{{ assignments.length }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">Assigned</p>
          </div>

          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="truncate text-sm font-bold sm:text-base">{{ activeSemester || "—" }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">Semester</p>
          </div>

          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="truncate text-sm font-bold sm:text-base">{{ activeSchoolYear || "—" }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">School Year</p>
          </div>
        </div>
      </div>
    </section>

    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex min-w-0 items-center gap-4">
          <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 p-1 dark:border-emerald-900 dark:bg-emerald-950/30">
            <img src="/logo.png" alt="St. Nicolas College" class="size-9 object-contain" />
          </div>

          <div class="min-w-0">
            <h2 class="truncate text-sm font-bold uppercase tracking-tight text-gray-900 sm:text-base dark:text-white">
              {{ studentProfile?.name || "Student Account" }}
            </h2>

            <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
              <span v-if="studentProfile?.student_id">{{ studentProfile.student_id }}</span>
              <span v-if="classLabel">•</span>
              <span v-if="classLabel">{{ classLabel }}</span>
              <span v-if="studentProfile?.year_level">•</span>
              <span v-if="studentProfile?.year_level">{{ studentProfile.year_level }}</span>
            </div>
          </div>
        </div>

        <div
          v-if="activePeriod"
          class="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/30"
        >
          <p class="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            Active Academic Period
          </p>
          <p class="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100">
            {{ activeSemester }} · {{ activeSchoolYear }}
          </p>
        </div>
      </div>
    </section>

    <div
      v-if="pending"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <USkeleton
        v-for="index in 6"
        :key="index"
        class="h-48 w-full rounded-2xl"
      />
    </div>

    <section
      v-else-if="loadError"
      class="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <UIcon name="i-lucide-triangle-alert" class="mx-auto size-8 text-red-600" />
      <h2 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
        Unable to load your teachers
      </h2>
      <p class="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400">
        {{ loadError }}
      </p>
      <UButton class="mt-5" icon="i-lucide-refresh-cw" @click="loadData">
        Try Again
      </UButton>
    </section>

    <template v-else>
      <section class="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/20">
        <div class="flex items-start gap-3">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <UIcon name="i-lucide-info" class="size-4" />
          </div>

          <div>
            <p class="text-sm font-bold text-gray-900 dark:text-white">
              Teacher assignments are managed by your Dean
            </p>
            <p class="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400">
              Your teacher list is automatically based on your course, year level, section, and the current active academic period.
            </p>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 class="text-sm font-bold text-gray-900 dark:text-white">
              Current Assigned Faculty
            </h2>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Faculty handling {{ classLabel || "your class" }} for the current academic period.
            </p>
          </div>

          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search teacher or department..."
            class="w-full sm:w-72"
          />
        </div>
      </section>

      <section
        v-if="!activePeriod"
        class="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-10 text-center dark:border-amber-900 dark:bg-amber-950/20"
      >
        <UIcon name="i-lucide-calendar-x-2" class="mx-auto size-8 text-amber-600" />
        <h2 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
          No active academic period
        </h2>
      </section>

      <section
        v-else-if="!filteredAssignments.length"
        class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-900"
      >
        <UIcon name="i-lucide-users-round" class="mx-auto size-10 text-emerald-600" />
        <h2 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
          {{ assignments.length ? "No matching faculty" : "No faculty assigned yet" }}
        </h2>
        <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
          {{
            assignments.length
              ? "Try changing your search."
              : "Your Dean has not assigned faculty members to this class for the active academic period yet."
          }}
        </p>
      </section>

      <section
        v-else
        class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <article
          v-for="assignment in filteredAssignments"
          :key="assignment.documentId || assignment.id"
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-5 py-5 text-white">
            <div class="flex items-start justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <div class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-emerald-300">
                  <UIcon name="i-lucide-presentation" class="size-5" />
                </div>

                <div class="min-w-0">
                  <p class="text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                    Assigned Faculty
                  </p>
                  <h2 class="mt-1 truncate text-base font-bold">
                    {{ getTeacherName(assignment) }}
                  </h2>
                </div>
              </div>

              <UBadge color="success" variant="solid" size="sm">
                Assigned
              </UBadge>
            </div>
          </div>

          <div class="space-y-4 p-5">
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40">
              <p class="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                Department
              </p>
              <p class="mt-1 text-xs font-bold text-gray-900 dark:text-white">
                {{ getDepartmentName(assignment) }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div class="rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2.5 dark:border-emerald-900 dark:bg-emerald-950/20">
                <p class="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                  Semester
                </p>
                <p class="mt-1 text-xs font-bold text-gray-900 dark:text-white">
                  {{ activeSemester || "—" }}
                </p>
              </div>

              <div class="rounded-xl border border-violet-100 bg-violet-50/70 px-3 py-2.5 dark:border-violet-900 dark:bg-violet-950/20">
                <p class="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                  Class
                </p>
                <p class="mt-1 text-xs font-bold text-gray-900 dark:text-white">
                  {{ classLabel || "—" }}
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </template>
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
const classInfo = ref<any>(null)
const activePeriod = ref<any>(null)
const assignments = ref<any[]>([])

const searchQuery = ref("")

const activeSemester = computed(() => {
  return activePeriod.value?.semester || ""
})

const activeSchoolYear = computed(() => {
  return activePeriod.value?.school_year || ""
})

const classLabel = computed(() => {
  return (
    classInfo.value?.label ||
    [
      studentProfile.value?.course?.code,
      studentProfile.value?.section
    ]
      .filter(Boolean)
      .join("-")
  )
})

const filteredAssignments = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return assignments.value
  }

  return assignments.value.filter((assignment: any) => {
    const teacher = getTeacherName(assignment).toLowerCase()
    const department = getDepartmentName(assignment).toLowerCase()

    return (
      teacher.includes(query) ||
      department.includes(query)
    )
  })
})

const getTeacherName = (assignment: any) => {
  return (
    assignment?.teacher?.name ||
    assignment?.teacher?.full_name ||
    "Unknown Faculty"
  )
}

const getDepartmentName = (assignment: any) => {
  return (
    assignment?.teacher?.department?.name ||
    assignment?.teacher?.department?.department_name ||
    "Department not specified"
  )
}

const getMyClassTeachers = async () => {
  const response: any = await $api(
    "/faculty-class-assignments/my-class-teachers"
  )

  assignments.value = response?.data || []
  studentProfile.value = response?.student || null
  classInfo.value = response?.class || null
  activePeriod.value = response?.active_period || null
}

const loadData = async () => {
  try {
    pending.value = true
    loadError.value = ""

    await getMyClassTeachers()
  } catch (error: any) {
    console.error("My teachers loading error:", error)

    assignments.value = []
    studentProfile.value = null
    classInfo.value = null
    activePeriod.value = null

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Failed to load your class faculty assignments."

    toast.add({
      title: "Unable to load teachers",
      description: loadError.value,
      icon: "i-lucide-triangle-alert",
      color: "error"
    })
  } finally {
    pending.value = false
  }
}

watch(
  user,
  async value => {
    if (value?.id) {
      await loadData()
    }
  },
  {
    immediate: true
  }
)
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
