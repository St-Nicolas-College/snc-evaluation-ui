<template>
  <div class="space-y-6 pb-10">
    <!-- =====================================================
      HERO
    ====================================================== -->
    <section
      class="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7 dark:border-emerald-900"
    >
      <div class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-teal-300/15 blur-3xl" />

      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex min-w-0 items-start gap-4">
          <div
            class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex"
          >
            <UIcon name="i-lucide-users-round" class="size-7" />
          </div>

          <div class="min-w-0">
            <div class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-50">
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur">
                Dean Portal
              </span>

              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur">
                Faculty Management
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Department Faculty Management
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Register, update, and manage faculty accounts within your department.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 sm:min-w-[300px]">
          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">
              {{ teachers.length }}
            </p>

            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">
              Faculty
            </p>
          </div>

          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">
              {{ deanDepartmentId ? 1 : 0 }}
            </p>

            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">
              Department
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
      DEAN PROFILE
    ====================================================== -->
    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <div
          class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-bold text-white shadow-lg shadow-emerald-500/20"
        >
          {{ deanInitials }}
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="truncate text-base font-bold text-gray-900 sm:text-lg dark:text-white">
              {{ deanName }}
            </h2>

            <UBadge color="success" variant="subtle" size="sm">
              Dean
            </UBadge>
          </div>

          <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span class="flex items-center gap-1.5">
              <UIcon name="i-lucide-building-2" class="size-3.5" />
              {{ deanDepartment }}
            </span>

            <span v-if="deanEmail" class="flex items-center gap-1.5">
              <UIcon name="i-lucide-mail" class="size-3.5" />
              {{ deanEmail }}
            </span>
          </div>
        </div>

        <div
          class="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-left sm:text-right dark:border-emerald-900 dark:bg-emerald-950/30"
        >
          <p class="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            Management Scope
          </p>

          <p class="mt-1 text-xs font-bold text-gray-800 dark:text-gray-200">
            {{ deanDepartment }}
          </p>
        </div>
      </div>
    </section>

    <!-- =====================================================
      ERROR
    ====================================================== -->
    <section
      v-if="loadError"
      class="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <UIcon name="i-lucide-triangle-alert" class="mx-auto size-7 text-red-600 dark:text-red-400" />

      <h2 class="mt-3 text-base font-bold text-gray-900 dark:text-white">
        Unable to load faculty management
      </h2>

      <p class="mx-auto mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400">
        {{ loadError }}
      </p>

      <UButton
        class="mt-4"
        icon="i-lucide-refresh-cw"
        :loading="loading"
        @click="loadData"
      >
        Try Again
      </UButton>
    </section>

    <template v-else>
      <!-- ===================================================
        TOOLBAR
      ==================================================== -->
      <section
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 class="text-sm font-bold text-gray-900 dark:text-white">
              Faculty Directory
            </h2>

            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Only faculty accounts assigned to your department are shown.
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <UInput
              v-model="globalFilter"
              icon="i-lucide-search"
              placeholder="Search faculty..."
              class="w-full sm:w-72"
            />

            <UButton
              v-if="selectedCount > 0"
              color="error"
              variant="subtle"
              icon="i-lucide-trash"
              @click="openBulkDeleteConfirmation"
            >
              Delete Selected

              <template #trailing>
                <UKbd>{{ selectedCount }}</UKbd>
              </template>
            </UButton>

            <UButton
              icon="i-lucide-plus"
              @click="openCreateModal"
            >
              New Faculty
            </UButton>
          </div>
        </div>
      </section>

      <!-- ===================================================
        TABLE
      ==================================================== -->
      <section
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="overflow-x-auto">
          <table class="min-w-[900px] w-full border-collapse">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/40">
                <th class="w-12 px-4 py-3 text-center">
                  <UCheckbox
                    :model-value="allVisibleSelected"
                    @update:model-value="toggleSelectVisible(!!$event)"
                  />
                </th>

                <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Employee No.
                </th>

                <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Faculty
                </th>

                <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Department
                </th>

                <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </th>

                <th class="w-20 px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr v-if="loading">
                <td colspan="6" class="px-4 py-12 text-center">
                  <UIcon name="i-lucide-loader-circle" class="mx-auto size-6 animate-spin text-emerald-500" />
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Loading faculty...
                  </p>
                </td>
              </tr>

              <tr v-else-if="paginatedTeachers.length === 0">
                <td colspan="6" class="px-4 py-12 text-center">
                  <div class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
                    <UIcon name="i-lucide-users-round" class="size-7" />
                  </div>

                  <p class="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    No faculty found
                  </p>

                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Register a faculty member or change your search.
                  </p>
                </td>
              </tr>

              <tr
                v-for="teacher in paginatedTeachers"
                :key="teacher.documentId || teacher.id"
                class="transition hover:bg-gray-50 dark:hover:bg-gray-950/40"
              >
                <td class="px-4 py-3 text-center">
                  <UCheckbox
                    :model-value="isRowSelected(teacher)"
                    @update:model-value="toggleRowSelection(teacher, !!$event)"
                  />
                </td>

                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {{ teacher.employee_no || '-' }}
                </td>

                <td class="px-4 py-3">
                  <div class="flex min-w-0 items-center gap-3">
                    <div
                      class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    >
                      {{ createInitials(teacher.name) }}
                    </div>

                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {{ teacher.name }}
                      </p>

                      <p class="mt-0.5 text-[11px] text-gray-400">
                        Faculty
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {{ teacher.department?.name || deanDepartment }}
                </td>

                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {{ teacher.user?.email || '-' }}
                </td>

                <td class="px-4 py-3 text-center">
                  <UDropdownMenu :items="getDropdownActions(teacher)">
                    <UButton
                      icon="i-lucide-ellipsis-vertical"
                      color="neutral"
                      variant="ghost"
                      square
                    />
                  </UDropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
        >
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ selectedCount }} of {{ filteredTeachers.length }} row(s) selected.
          </div>

          <UPagination
            v-model:page="page"
            :total="filteredTeachers.length"
            :items-per-page="itemsPerPage"
          />
        </div>
      </section>
    </template>

    <!-- =====================================================
      CREATE MODAL
    ====================================================== -->
    <UModal v-model:open="createModal" :ui="{ content: 'max-w-3xl' }">
      <template #content>
        <div class="max-h-[90vh] overflow-y-auto rounded-[28px] border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          <div class="relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-6 py-6 text-white">
            <div class="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-emerald-500/20 blur-3xl" />

            <div class="relative flex items-start justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-300">
                  <UIcon name="i-lucide-user-plus" class="size-6" />
                </div>

                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    Department Faculty
                  </p>

                  <h2 class="mt-1 text-xl font-bold">
                    Register Faculty
                  </h2>

                  <p class="mt-1 text-xs text-slate-300">
                    The account will automatically be assigned to {{ deanDepartment }}.
                  </p>
                </div>
              </div>

              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                square
                class="text-white hover:bg-white/10"
                @click="createModal = false"
              />
            </div>
          </div>

          <UForm
            :state="createForm"
            class="space-y-5 p-6"
            @submit="createTeacher"
          >
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UFormField label="Employee No." name="employee_no" required>
                <UInput
                  v-model="createForm.employee_no"
                  icon="i-lucide-id-card"
                  class="w-full"
                  placeholder="Enter employee number"
                />
              </UFormField>

              <UFormField label="Full Name" name="name" required>
                <UInput
                  v-model="createForm.name"
                  icon="i-lucide-user-round"
                  class="w-full"
                  placeholder="Enter full name"
                />
              </UFormField>

              <UFormField label="Department">
                <UInput
                  :model-value="deanDepartment"
                  icon="i-lucide-building-2"
                  class="w-full"
                  disabled
                />
              </UFormField>

              <UFormField label="Role">
                <UInput
                  model-value="Faculty"
                  icon="i-lucide-badge-check"
                  class="w-full"
                  disabled
                />
              </UFormField>

              <UFormField
                label="Username"
                name="username"
                description="Automatically uses the Employee No."
                required
              >
                <UInput
                  v-model="createForm.username"
                  icon="i-lucide-badge-check"
                  class="w-full"
                  placeholder="Employee No. will be used"
                  autocomplete="username"
                  readonly
                />
              </UFormField>

              <UFormField label="Email" name="email" required>
                <UInput
                  v-model="createForm.email"
                  type="email"
                  icon="i-lucide-mail"
                  class="w-full"
                  placeholder="Enter email address"
                  autocomplete="email"
                />
              </UFormField>

              <UFormField label="Password" name="password" required class="md:col-span-2">
                <UInput
                  v-model="createForm.password"
                  type="password"
                  icon="i-lucide-lock-keyhole"
                  class="w-full"
                  placeholder="Enter temporary password"
                  autocomplete="new-password"
                />
              </UFormField>
            </div>

            <div class="flex justify-end gap-2 border-t border-gray-200 pt-5 dark:border-gray-800">
              <UButton
                color="neutral"
                variant="soft"
                :disabled="loadingCreate"
                @click="createModal = false"
              >
                Cancel
              </UButton>

              <UButton
                type="submit"
                icon="i-lucide-save"
                :loading="loadingCreate"
                :disabled="!isCreateFormValid"
              >
                Register Faculty
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- =====================================================
      EDIT MODAL
    ====================================================== -->
    <UModal v-model:open="editModal" :ui="{ content: 'max-w-4xl' }">
      <template #content>
        <div class="max-h-[90vh] overflow-y-auto rounded-[28px] border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          <div class="relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-6 py-6 text-white">
            <div class="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-emerald-500/20 blur-3xl" />

            <div class="relative flex items-start justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-300">
                  <UIcon name="i-lucide-user-round-pen" class="size-6" />
                </div>

                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    Department Faculty
                  </p>

                  <h2 class="mt-1 text-xl font-bold">
                    Edit Faculty
                  </h2>

                  <p class="mt-1 text-xs text-slate-300">
                    Update faculty account information.
                  </p>
                </div>
              </div>

              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                square
                class="text-white hover:bg-white/10"
                @click="editModal = false"
              />
            </div>
          </div>

          <UForm
            :state="editForm"
            class="space-y-5 p-6"
            @submit="updateTeacher"
          >
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UFormField label="Employee No." name="employee_no" required>
                <UInput
                  v-model="editForm.employee_no"
                  icon="i-lucide-id-card"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Full Name" name="name" required>
                <UInput
                  v-model="editForm.name"
                  icon="i-lucide-user-round"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Department">
                <UInput
                  :model-value="deanDepartment"
                  icon="i-lucide-building-2"
                  class="w-full"
                  disabled
                />
              </UFormField>

              <UFormField label="Role">
                <UInput
                  model-value="Faculty"
                  icon="i-lucide-badge-check"
                  class="w-full"
                  disabled
                />
              </UFormField>

              <UFormField label="Email" name="email" required class="md:col-span-2">
                <UInput
                  v-model="editForm.email"
                  type="email"
                  icon="i-lucide-mail"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="flex justify-end gap-2 border-t border-gray-200 pt-5 dark:border-gray-800">
              <UButton
                color="neutral"
                variant="soft"
                :disabled="loadingUpdate"
                @click="editModal = false"
              >
                Cancel
              </UButton>

              <UButton
                type="submit"
                icon="i-lucide-save"
                :loading="loadingUpdate"
                :disabled="!isEditFormValid"
              >
                Update Faculty
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- =====================================================
      DELETE CONFIRMATION
    ====================================================== -->
    <UModal v-model:open="deleteModal">
      <template #content>
        <div class="rounded-[28px] border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          <div class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
            <UIcon name="i-lucide-trash-2" class="size-8" />
          </div>

          <div class="mt-5 text-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ deleteMode === 'bulk' ? 'Delete selected faculty?' : 'Delete faculty account?' }}
            </h2>

            <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {{
                deleteMode === 'bulk'
                  ? `You are about to delete ${selectedCount} faculty account(s).`
                  : `You are about to delete ${deleteTarget?.name || 'this faculty account'}.`
              }}
              This action cannot be undone.
            </p>
          </div>

          <div class="mt-6 flex gap-3">
            <UButton
              block
              color="neutral"
              variant="soft"
              :disabled="loadingDelete"
              @click="deleteModal = false"
            >
              Cancel
            </UButton>

            <UButton
              block
              color="error"
              icon="i-lucide-trash-2"
              :loading="loadingDelete"
              @click="confirmDelete"
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
  middleware: ['auth', 'role'],
  role: ['Dean', 'Admin']
})

import type { DropdownMenuItem } from '@nuxt/ui'

const { $api } = useNuxtApp()
const { user } = useAuth()
const toast = useToast()

const loading = ref(true)
const loadingCreate = ref(false)
const loadingUpdate = ref(false)
const loadingDelete = ref(false)
const loadError = ref('')

const createModal = ref(false)
const editModal = ref(false)
const deleteModal = ref(false)

const deleteMode = ref<'single' | 'bulk'>('single')
const deleteTarget = ref<any>(null)

const page = ref(1)
const itemsPerPage = 10
const globalFilter = ref('')

const teachers = ref<any[]>([])
const deanProfile = ref<any>(null)

const selectedId = ref<any>(null)
const selectedRows = ref<Record<string | number, boolean>>({})

const createForm = reactive({
  employee_no: '',
  name: '',
  username: '',
  email: '',
  password: ''
})

const editForm = reactive({
  employee_no: '',
  name: '',
  email: ''
})

const deanName = computed(() => {
  return (
    deanProfile.value?.name ||
    deanProfile.value?.full_name ||
    user.value?.name ||
    user.value?.username ||
    'Dean'
  )
})

const deanDepartment = computed(() => {
  return (
    deanProfile.value?.department?.name ||
    'No department assigned'
  )
})

const deanDepartmentId = computed(() => {
  return (
    deanProfile.value?.department?.id ||
    null
  )
})

const deanEmail = computed(() => {
  return (
    deanProfile.value?.email ||
    deanProfile.value?.user?.email ||
    user.value?.email ||
    ''
  )
})

const deanInitials = computed(() => {
  return createInitials(deanName.value)
})



const isCreateFormValid = computed(() => {
  return Boolean(
    createForm.employee_no.trim() &&
    createForm.name.trim() &&
    createForm.username.trim() &&
    createForm.email.trim() &&
    createForm.password.trim() &&
    deanDepartmentId.value
  )
})

const isEditFormValid = computed(() => {
  return Boolean(
    editForm.employee_no.trim() &&
    editForm.name.trim() &&
    editForm.email.trim() &&
    deanDepartmentId.value &&
    selectedId.value
  )
})

const filteredTeachers = computed(() => {
  const keyword =
    globalFilter.value
      ?.toLowerCase()
      ?.trim()

  if (!keyword) {
    return teachers.value
  }

  return teachers.value.filter((item: any) =>
    item.employee_no
      ?.toLowerCase()
      .includes(keyword) ||
    item.name
      ?.toLowerCase()
      .includes(keyword) ||
    item.department
      ?.name
      ?.toLowerCase()
      .includes(keyword) ||
    item.user
      ?.email
      ?.toLowerCase()
      .includes(keyword)
  )
})

const paginatedTeachers = computed(() => {
  const start =
    (page.value - 1) *
    itemsPerPage

  return filteredTeachers.value.slice(
    start,
    start + itemsPerPage
  )
})

const selectedCount = computed(() => {
  return Object.values(
    selectedRows.value
  ).filter(Boolean).length
})

const allVisibleSelected = computed(() => {
  if (!paginatedTeachers.value.length) {
    return false
  }

  return paginatedTeachers.value.every(
    teacher =>
      isRowSelected(teacher)
  )
})



watch(globalFilter, () => {
  page.value = 1
})

watch(
  () => createForm.employee_no,
  value => {
    createForm.username = String(value || '').trim()
  }
)

const createInitials = (value: string) => {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part =>
      part.charAt(0).toUpperCase()
    )
    .join('')
}

const resetCreateForm = () => {
  createForm.employee_no = ''
  createForm.name = ''
  createForm.username = ''
  createForm.email = ''
  createForm.password = ''
}

const resetEditForm = () => {
  editForm.employee_no = ''
  editForm.name = ''
  editForm.email = ''
  selectedId.value = null
}

const openCreateModal = () => {
  resetCreateForm()
  createModal.value = true
}

const openEditModal = (row: any) => {
  selectedId.value =
    row.id

  editForm.employee_no =
    row.employee_no || ''

  editForm.name =
    row.name || ''

  editForm.email =
    row.user?.email || ''

  editModal.value = true
}

const toggleRowSelection = (
  row: any,
  value: boolean
) => {
  const key =
    row.documentId ||
    row.id

  selectedRows.value[key] =
    value
}

const toggleSelectVisible = (
  value: boolean
) => {
  paginatedTeachers.value.forEach(
    teacher => {
      const key =
        teacher.documentId ||
        teacher.id

      selectedRows.value[key] =
        value
    }
  )
}

const isRowSelected = (row: any) => {
  const key =
    row.documentId ||
    row.id

  return Boolean(
    selectedRows.value[key]
  )
}

const openSingleDeleteConfirmation = (
  row: any
) => {
  deleteMode.value = 'single'
  deleteTarget.value = row
  deleteModal.value = true
}

const openBulkDeleteConfirmation = () => {
  if (!selectedCount.value) {
    return
  }

  deleteMode.value = 'bulk'
  deleteTarget.value = null
  deleteModal.value = true
}

const getDropdownActions = (
  row: any
): DropdownMenuItem[][] => {
  return [[
    {
      type: 'label',
      label: 'Actions'
    },
    {
      type: 'separator'
    },
    {
      label: 'Edit Faculty',
      icon: 'i-lucide-edit',
      onSelect() {
        openEditModal(row)
      }
    },
    {
      label: 'Delete Faculty',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        openSingleDeleteConfirmation(row)
      }
    }
  ]]
}



const getDeanProfile = async () => {
  if (!user.value?.id) {
    deanProfile.value = null
    return
  }

  const response = await $api('/teachers', {
    query: {
      'filters[user][id][$eq]':
        user.value.id,

      'populate[department]':
        true,

      'populate[user]':
        true,

      'pagination[pageSize]':
        1
    }
  })

  deanProfile.value =
    response.data?.[0] || null
}


const getTeachers = async () => {
  if (!deanDepartmentId.value) {
    teachers.value = []
    return
  }

  const response = await $api('/teachers', {
    query: {
      'filters[user][role][name][$eq]':
        'Faculty',

      'filters[department][id][$eq]':
        deanDepartmentId.value,

      'populate[department]':
        true,

      'populate[user][populate][0]':
        'role',

      'sort[0]':
        'name:asc',

      'pagination[pageSize]':
        500
    }
  })

  teachers.value =
    response.data || []
}

const createTeacher = async () => {
  if (!isCreateFormValid.value) {
    return
  }

  try {
    loadingCreate.value = true

    await $api('/teachers/register', {
      method: 'POST',
      body: {
        employee_no:
          createForm.employee_no.trim(),

        name:
          createForm.name.trim(),

        department:
          deanDepartmentId.value,

        roleName:
          'Faculty',

        username:
          createForm.employee_no.trim(),

        email:
          createForm.email.trim(),

        password:
          createForm.password
      }
    })

    toast.add({
      title: 'Faculty registered',
      description:
        'The faculty account was created and assigned to your department.',
      icon: 'i-lucide-circle-check-big',
      color: 'success'
    })

    createModal.value = false
    resetCreateForm()

    await getTeachers()
  } catch (error: any) {
    console.error(
      'Faculty creation error:',
      error
    )

    toast.add({
      title: 'Unable to register faculty',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        'Failed to create the faculty account.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loadingCreate.value = false
  }
}

const updateTeacher = async () => {
  if (!isEditFormValid.value) {
    return
  }

  try {
    loadingUpdate.value = true

    await $api(
      `/teachers/update-with-user/${selectedId.value}`,
      {
        method: 'PUT',
        body: {
          employee_no:
            editForm.employee_no.trim(),

          name:
            editForm.name.trim(),

          department:
            deanDepartmentId.value,

          email:
            editForm.email.trim(),

          roleName:
            'Faculty'
        }
      }
    )

    toast.add({
      title: 'Faculty updated',
      description:
        'Faculty information was updated successfully.',
      icon: 'i-lucide-circle-check-big',
      color: 'success'
    })

    editModal.value = false
    resetEditForm()

    await getTeachers()
  } catch (error: any) {
    console.error(
      'Faculty update error:',
      error
    )

    toast.add({
      title: 'Unable to update faculty',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        'Failed to update the faculty account.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loadingUpdate.value = false
  }
}

const deleteOne = async (
  row: any
) => {
  await $api(
    `/teachers/${row.documentId || row.id}`,
    {
      method: 'DELETE'
    }
  )

  delete selectedRows.value[
    row.documentId ||
    row.id
  ]
}

const deleteSelected = async () => {
  const selectedItems =
    teachers.value.filter(
      item =>
        selectedRows.value[
          item.documentId ||
          item.id
        ]
    )

  await Promise.all(
    selectedItems.map(
      item =>
        $api(
          `/teachers/${item.documentId || item.id}`,
          {
            method: 'DELETE'
          }
        )
    )
  )

  selectedRows.value = {}
}

const confirmDelete = async () => {
  try {
    loadingDelete.value = true

    if (deleteMode.value === 'bulk') {
      await deleteSelected()

      toast.add({
        title: 'Faculty deleted',
        description:
          'The selected faculty accounts were deleted successfully.',
        icon: 'i-lucide-circle-check-big',
        color: 'success'
      })
    } else if (deleteTarget.value) {
      await deleteOne(
        deleteTarget.value
      )

      toast.add({
        title: 'Faculty deleted',
        description:
          'The faculty account was deleted successfully.',
        icon: 'i-lucide-circle-check-big',
        color: 'success'
      })
    }

    deleteModal.value = false
    deleteTarget.value = null

    await getTeachers()
  } catch (error: any) {
    console.error(
      'Faculty deletion error:',
      error
    )

    toast.add({
      title: 'Unable to delete faculty',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        'Failed to delete the faculty account.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loadingDelete.value = false
  }
}

const loadData = async () => {
  try {
    loading.value = true
    loadError.value = ''

    await getDeanProfile()

    if (!deanProfile.value) {
      throw new Error(
        'The logged-in Dean profile could not be found.'
      )
    }

    if (!deanDepartmentId.value) {
      throw new Error(
        'The logged-in Dean is not assigned to a department.'
      )
    }

    await getTeachers()
  } catch (error: any) {
    console.error(
      'Department faculty management loading error:',
      error
    )

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to load department faculty management.'

    toast.add({
      title: 'Unable to load faculty',
      description: loadError.value,
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loading.value = false
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
