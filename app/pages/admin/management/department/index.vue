<template>
  <div class="space-y-6 pb-8">
    <!-- =====================================================
      HERO
    ====================================================== -->
    <section
      class="relative overflow-hidden rounded-[28px] border border-cyan-100 bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 px-5 py-6 text-white shadow-xl shadow-cyan-900/10 sm:px-7 sm:py-7"
    >
      <div
        class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-blue-300/15 blur-3xl"
      />

      <div
        class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"
      >
        <div class="flex min-w-0 items-start gap-4">
          <div
            class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex"
          >
            <UIcon name="i-lucide-building-2" class="size-7" />
          </div>

          <div class="min-w-0">
            <div
              class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-cyan-50"
            >
              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Administrator Portal
              </span>

              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Department Management
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Department Management
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-cyan-50/90">
              Create and maintain academic departments used across courses,
              faculty records, and evaluation workflows.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">{{ summary.total }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-cyan-100">
              Departments
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">{{ summary.courses }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-cyan-100">
              Courses
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">{{ summary.faculty }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-cyan-100">
              Faculty
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
      KPI CARDS
    ====================================================== -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Departments"
        :value="summary.total"
        icon="i-lucide-building-2"
        tone="cyan"
      />

      <StatCard
        label="Linked Courses"
        :value="summary.courses"
        icon="i-lucide-book-copy"
        tone="violet"
      />

      <StatCard
        label="Linked Faculty"
        :value="summary.faculty"
        icon="i-lucide-users-round"
        tone="emerald"
      />

      <StatCard
        label="Unused Departments"
        :value="summary.unused"
        icon="i-lucide-circle-minus"
        tone="amber"
      />
    </section>

    <!-- =====================================================
      TOOLBAR
    ====================================================== -->
    <section
      class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <UInput
          v-model="globalFilter"
          icon="i-lucide-search"
          placeholder="Search department..."
          class="w-full sm:max-w-md"
        />

        <div class="flex flex-wrap items-center gap-2">
          <UButton
            v-if="selectedCount > 0"
            color="error"
            variant="soft"
            icon="i-lucide-trash-2"
            @click="requestDeleteSelected"
          >
            Delete Selected

            <template #trailing>
              <UKbd>{{ selectedCount }}</UKbd>
            </template>
          </UButton>

          <UButton icon="i-lucide-plus" @click="openCreateModal">
            New Department
          </UButton>
        </div>
      </div>
    </section>

    <!-- =====================================================
      TABLE
    ====================================================== -->
    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Department Directory
          </h2>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Showing {{ filteredDepartments.length }} of {{ departments.length }}
            department{{ departments.length === 1 ? '' : 's' }}.
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
          class="h-14 w-full rounded-xl"
        />
      </div>

      <div v-else-if="loadError" class="px-6 py-14 text-center">
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
        >
          <UIcon name="i-lucide-triangle-alert" class="size-7" />
        </div>

        <h3 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
          Unable to load departments
        </h3>

        <p
          class="mx-auto mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400"
        >
          {{ loadError }}
        </p>

        <UButton class="mt-5" icon="i-lucide-refresh-cw" @click="loadData">
          Try Again
        </UButton>
      </div>

      <div
        v-else-if="!filteredDepartments.length"
        class="px-6 py-16 text-center"
      >
        <div
          class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400"
        >
          <UIcon
            :name="
              departments.length
                ? 'i-lucide-search-x'
                : 'i-lucide-building-2'
            "
            class="size-8"
          />
        </div>

        <h3 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
          {{
            departments.length
              ? 'No matching departments found'
              : 'No department records yet'
          }}
        </h3>

        <p
          class="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400"
        >
          {{
            departments.length
              ? 'Try changing or clearing the current search.'
              : 'Create the first department to begin organising courses and faculty.'
          }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[840px] text-sm">
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

              <th class="px-4 py-3 text-left">Department</th>
              <th class="px-4 py-3 text-center">Courses</th>
              <th class="px-4 py-3 text-center">Faculty</th>
              <th class="px-4 py-3 text-center">Status</th>
              <th class="w-20 px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="department in paginatedDepartments"
              :key="getDepartmentKey(department)"
              class="transition hover:bg-gray-50/80 dark:hover:bg-gray-950/30"
            >
              <td class="px-4 py-4 text-center">
                <UCheckbox
                  :model-value="isRowSelected(department)"
                  @update:model-value="toggleRowSelection(department, !!$event)"
                />
              </td>

              <td class="px-4 py-4">
                <div class="flex min-w-0 items-center gap-3">
                  <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm"
                  >
                    <UIcon name="i-lucide-building-2" class="size-5" />
                  </div>

                  <div class="min-w-0">
                    <p class="font-bold text-gray-900 dark:text-white">
                      {{ department.name || 'Unnamed Department' }}
                    </p>

                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      Academic department
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-4 py-4 text-center">
                <UBadge color="primary" variant="subtle">
                  {{ getDepartmentCourseCount(department) }}
                </UBadge>
              </td>

              <td class="px-4 py-4 text-center">
                <UBadge color="success" variant="subtle">
                  {{ getDepartmentFacultyCount(department) }}
                </UBadge>
              </td>

              <td class="px-4 py-4 text-center">
                <UBadge
                  :color="getDepartmentUsageCount(department) ? 'success' : 'warning'"
                  variant="subtle"
                >
                  {{
                    getDepartmentUsageCount(department)
                      ? 'In Use'
                      : 'Unused'
                  }}
                </UBadge>
              </td>

              <td class="px-4 py-4 text-center">
                <UDropdownMenu :items="getDropdownActions(department)">
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
        v-if="filteredDepartments.length"
        class="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <div
          class="text-center text-xs text-gray-500 sm:text-left dark:text-gray-400"
        >
          Showing {{ paginationStart }}–{{ paginationEnd }} of
          {{ filteredDepartments.length }} records
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

    <!-- =====================================================
      CREATE MODAL
    ====================================================== -->
    <UModal
      v-model:open="createModal"
      title="Add Department"
      description="Create a new academic department."
      :ui="{ content: 'max-w-xl' }"
    >
      <template #content>
        <div
          class="max-h-[88vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900"
        >
          <ModalHeader
            title="Add Department"
            description="Create a new academic department."
            icon="i-lucide-building-2"
            @close="createModal = false"
          />

          <UForm
            :state="createForm"
            class="space-y-5 p-6"
            @submit="createDepartment"
          >
            <UFormField label="Department Name" name="name" required>
              <UInput
                v-model="createForm.name"
                placeholder="Example: College of Information Technology"
                class="w-full"
              />
            </UFormField>

            <div
              class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800"
            >
              <UButton
                color="neutral"
                variant="outline"
                type="button"
                @click="createModal = false"
              >
                Cancel
              </UButton>

              <UButton
                type="submit"
                icon="i-lucide-save"
                :loading="loadingCreate"
                :disabled="loadingCreate"
              >
                Save Department
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- =====================================================
      EDIT MODAL
    ====================================================== -->
    <UModal
      v-model:open="editModal"
      title="Edit Department"
      description="Update the selected department."
      :ui="{ content: 'max-w-xl' }"
    >
      <template #content>
        <div
          class="max-h-[88vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900"
        >
          <ModalHeader
            title="Edit Department"
            description="Update the department name."
            icon="i-lucide-building-2"
            tone="blue"
            @close="editModal = false"
          />

          <UForm
            :state="editForm"
            class="space-y-5 p-6"
            @submit="updateDepartment"
          >
            <UFormField label="Department Name" name="name" required>
              <UInput v-model="editForm.name" class="w-full" />
            </UFormField>

            <div
              class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800"
            >
              <UButton
                color="neutral"
                variant="outline"
                type="button"
                @click="editModal = false"
              >
                Cancel
              </UButton>

              <UButton
                type="submit"
                icon="i-lucide-save"
                :loading="loadingUpdate"
                :disabled="loadingUpdate"
              >
                Save Changes
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- =====================================================
      DELETE CONFIRMATION
    ====================================================== -->
    <UModal
      v-model:open="deleteModal"
      title="Confirm Department Deletion"
      description="Confirm deletion of the selected department record or records."
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
              deleteTargetType === 'multiple'
                ? 'Delete selected departments?'
                : 'Delete department?'
            }}
          </h2>

          <p
            class="mt-2 text-center text-sm leading-6 text-gray-500 dark:text-gray-400"
          >
            {{
              deleteTargetType === 'multiple'
                ? `This will permanently delete ${selectedCount} selected department record${selectedCount === 1 ? '' : 's'}.`
                : `This will permanently delete ${deleteTarget?.name || 'this department'}.`
            }}
          </p>

          <div
            v-if="deleteWarning"
            class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-400"
          >
            <div class="flex items-start gap-2">
              <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-4 shrink-0" />
              <p>{{ deleteWarning }}</p>
            </div>
          </div>

          <div class="mt-6 flex gap-2">
            <UButton
              color="neutral"
              variant="outline"
              class="flex-1 justify-center"
              @click="closeDeleteModal"
            >
              Cancel
            </UButton>

            <UButton
              color="error"
              icon="i-lucide-trash-2"
              class="flex-1 justify-center"
              :loading="loadingDelete"
              :disabled="Boolean(deleteWarning)"
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
  role: ['Admin']
})

import type { DropdownMenuItem } from '@nuxt/ui'

const { $api } = useNuxtApp()
const toast = useToast()

const StatCard = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    icon: String,
    tone: {
      type: String,
      default: 'cyan'
    }
  },

  setup(props) {
    const tones: Record<string, string> = {
      cyan:
        'border-cyan-100 bg-cyan-50/70 dark:border-cyan-900 dark:bg-cyan-950/20',
      violet:
        'border-violet-100 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/20',
      emerald:
        'border-emerald-100 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20',
      amber:
        'border-amber-100 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20'
    }

    const iconTones: Record<string, string> = {
      cyan:
        'bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400',
      violet:
        'bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
      emerald:
        'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
      amber:
        'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
    }

    return () =>
      h(
        'div',
        {
          class: `rounded-2xl border p-5 ${tones[props.tone] || tones.cyan}`
        },
        [
          h('div', { class: 'flex items-center justify-between' }, [
            h('div', {}, [
              h(
                'p',
                {
                  class:
                    'text-xs font-medium text-gray-500 dark:text-gray-400'
                },
                props.label
              ),

              h(
                'p',
                {
                  class:
                    'mt-2 text-2xl font-bold text-gray-900 dark:text-white'
                },
                String(props.value ?? 0)
              )
            ]),

            h(
              'div',
              {
                class: `flex size-11 items-center justify-center rounded-2xl ${
                  iconTones[props.tone] || iconTones.cyan
                }`
              },
              [
                h(resolveComponent('UIcon'), {
                  name: props.icon,
                  class: 'size-5'
                })
              ]
            )
          ])
        ]
      )
  }
})

const ModalHeader = defineComponent({
  emits: ['close'],

  props: {
    title: String,
    description: String,
    icon: String,
    tone: {
      type: String,
      default: 'cyan'
    }
  },

  setup(props, { emit }) {
    return () =>
      h(
        'div',
        {
          class:
            props.tone === 'blue'
              ? 'relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 px-6 py-6 text-white'
              : 'relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-6 py-6 text-white'
        },
        [
          h('div', {
            class:
              'pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-white/10 blur-3xl'
          }),

          h(
            'div',
            {
              class: 'relative flex items-start justify-between gap-4'
            },
            [
              h(
                'div',
                {
                  class: 'flex min-w-0 items-center gap-4'
                },
                [
                  h(
                    'div',
                    {
                      class:
                        'flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10'
                    },
                    [
                      h(resolveComponent('UIcon'), {
                        name: props.icon,
                        class: 'size-6'
                      })
                    ]
                  ),

                  h('div', { class: 'min-w-0' }, [
                    h(
                      'h2',
                      {
                        class: 'text-xl font-bold'
                      },
                      props.title
                    ),

                    h(
                      'p',
                      {
                        class: 'mt-1 text-xs text-slate-300'
                      },
                      props.description
                    )
                  ])
                ]
              ),

              h(resolveComponent('UButton'), {
                color: 'neutral',
                variant: 'ghost',
                icon: 'i-lucide-x',
                square: true,
                class: 'text-white hover:bg-white/10',
                onClick: () => emit('close')
              })
            ]
          )
        ]
      )
  }
})

const departments = ref<any[]>([])
const courses = ref<any[]>([])
const teachers = ref<any[]>([])

const loading = ref(true)
const loadError = ref('')
const loadingCreate = ref(false)
const loadingUpdate = ref(false)
const loadingDelete = ref(false)

const createModal = ref(false)
const editModal = ref(false)
const deleteModal = ref(false)

const selectedRows = ref<Record<string | number, boolean>>({})
const selectedId = ref<any>(null)

const deleteTarget = ref<any>(null)
const deleteTargetType = ref<'single' | 'multiple'>('single')

const globalFilter = ref('')
const page = ref(1)
const itemsPerPage = ref(10)

const pageSizeOptions = [
  { label: '10 rows', value: 10 },
  { label: '20 rows', value: 20 },
  { label: '50 rows', value: 50 },
  { label: '100 rows', value: 100 }
]

const createForm = reactive({
  name: ''
})

const editForm = reactive({
  name: ''
})

const getDepartmentKey = (department: any) =>
  department?.documentId || department?.id

const getDepartmentCourseCount = (department: any) =>
  courses.value.filter(
    course =>
      String(course?.department?.id) ===
      String(department?.id)
  ).length

const getDepartmentFacultyCount = (department: any) =>
  teachers.value.filter(
    teacher =>
      String(teacher?.department?.id) ===
      String(department?.id)
  ).length

const getDepartmentUsageCount = (department: any) =>
  getDepartmentCourseCount(department) +
  getDepartmentFacultyCount(department)

const summary = computed(() => ({
  total: departments.value.length,
  courses: courses.value.length,
  faculty: teachers.value.length,

  unused: departments.value.filter(
    department =>
      getDepartmentUsageCount(department) === 0
  ).length
}))

const filteredDepartments = computed(() => {
  const keyword =
    globalFilter.value
      .trim()
      .toLowerCase()

  if (!keyword) {
    return departments.value
  }

  return departments.value.filter(
    department =>
      String(department?.name || '')
        .toLowerCase()
        .includes(keyword)
  )
})

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(
      filteredDepartments.value.length /
        Number(itemsPerPage.value)
    )
  )
)

const paginatedDepartments = computed(() => {
  const start =
    (page.value - 1) *
    Number(itemsPerPage.value)

  return filteredDepartments.value.slice(
    start,
    start + Number(itemsPerPage.value)
  )
})

const paginationStart = computed(() =>
  filteredDepartments.value.length
    ? (page.value - 1) *
        Number(itemsPerPage.value) +
      1
    : 0
)

const paginationEnd = computed(() =>
  Math.min(
    page.value *
      Number(itemsPerPage.value),
    filteredDepartments.value.length
  )
)

const selectedCount = computed(() =>
  Object.values(selectedRows.value).filter(Boolean).length
)

const isCurrentPageSelected = computed(() =>
  paginatedDepartments.value.length > 0 &&
  paginatedDepartments.value.every(isRowSelected)
)

const isCurrentPagePartiallySelected = computed(() => {
  const selectedOnPage =
    paginatedDepartments.value.filter(isRowSelected).length

  return (
    selectedOnPage > 0 &&
    selectedOnPage < paginatedDepartments.value.length
  )
})

const selectedDepartments = computed(() =>
  departments.value.filter(
    department =>
      selectedRows.value[
        getDepartmentKey(department)
      ]
  )
)

const deleteWarning = computed(() => {
  const targets =
    deleteTargetType.value === 'multiple'
      ? selectedDepartments.value
      : deleteTarget.value
        ? [deleteTarget.value]
        : []

  const usedDepartments = targets.filter(
    department =>
      getDepartmentUsageCount(department) > 0
  )

  if (!usedDepartments.length) {
    return ''
  }

  const names = usedDepartments
    .map(department => department.name)
    .join(', ')

  return `Deletion is blocked because the following department${usedDepartments.length === 1 ? ' is' : 's are'} still linked to courses or faculty: ${names}. Reassign those records first.`
})

const resetCreateForm = () => {
  createForm.name = ''
}

const resetEditForm = () => {
  editForm.name = ''
  selectedId.value = null
}

const openCreateModal = () => {
  resetCreateForm()
  createModal.value = true
}

const openEditModal = (row: any) => {
  selectedId.value =
    row.documentId || row.id

  editForm.name =
    row.name || ''

  editModal.value = true
}

const toggleRowSelection = (
  row: any,
  value: boolean
) => {
  selectedRows.value = {
    ...selectedRows.value,
    [getDepartmentKey(row)]: value
  }
}

const isRowSelected = (row: any) =>
  Boolean(
    selectedRows.value[
      getDepartmentKey(row)
    ]
  )

const toggleCurrentPageSelection = (
  value: boolean
) => {
  const next = {
    ...selectedRows.value
  }

  paginatedDepartments.value.forEach(row => {
    next[getDepartmentKey(row)] = value
  })

  selectedRows.value = next
}

const getDropdownActions = (
  row: any
): DropdownMenuItem[][] => [
  [
    {
      type: 'label',
      label: 'Actions'
    },

    {
      type: 'separator'
    },

    {
      label: 'Edit Department',
      icon: 'i-lucide-edit-3',

      onSelect() {
        openEditModal(row)
      }
    },

    {
      label: 'Delete Department',
      icon: 'i-lucide-trash-2',
      color: 'error',

      onSelect() {
        requestDeleteOne(row)
      }
    }
  ]
]

const loadData = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const [
      departmentsResponse,
      coursesResponse,
      teachersResponse
    ] = await Promise.all([
      $api('/departments', {
        query: {
          'sort[0]': 'name:asc',
          'pagination[pageSize]': 10000
        }
      }),

      $api('/courses', {
        query: {
          'populate[department]': true,
          'pagination[pageSize]': 10000
        }
      }),

      $api('/teachers', {
        query: {
          'populate[department]': true,
          'pagination[pageSize]': 10000
        }
      })
    ])

    departments.value =
      departmentsResponse?.data || []

    courses.value =
      coursesResponse?.data || []

    teachers.value =
      teachersResponse?.data || []

    const availableKeys = new Set(
      departments.value.map(getDepartmentKey)
    )

    selectedRows.value =
      Object.fromEntries(
        Object.entries(
          selectedRows.value
        ).filter(([key]) =>
          availableKeys.has(key)
        )
      )

    if (page.value > totalPages.value) {
      page.value = totalPages.value
    }
  } catch (error: any) {
    console.error(
      'Department management loading error:',
      error
    )

    departments.value = []
    courses.value = []
    teachers.value = []

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to load department management data.'
  } finally {
    loading.value = false
  }
}

const validateDepartmentName = (
  name: string
) => {
  if (!name.trim()) {
    toast.add({
      title: 'Department name required',
      description:
        'Enter a department name before saving.',
      icon: 'i-lucide-circle-alert',
      color: 'warning'
    })

    return false
  }

  return true
}

const departmentNameExists = (
  name: string,
  excludeKey?: any
) => {
  const normalisedName =
    name.trim().toLowerCase()

  return departments.value.some(
    department => {
      const sameName =
        String(department?.name || '')
          .trim()
          .toLowerCase() === normalisedName

      const isExcluded =
        excludeKey &&
        getDepartmentKey(department) ===
          excludeKey

      return sameName && !isExcluded
    }
  )
}

const createDepartment = async () => {
  if (
    !validateDepartmentName(
      createForm.name
    )
  ) {
    return
  }

  if (
    departmentNameExists(
      createForm.name
    )
  ) {
    toast.add({
      title: 'Duplicate department',
      description:
        'A department with this name already exists.',
      icon: 'i-lucide-circle-alert',
      color: 'warning'
    })

    return
  }

  loadingCreate.value = true

  try {
    await $api('/departments', {
      method: 'POST',

      body: {
        data: {
          name:
            createForm.name.trim()
        }
      }
    })

    toast.add({
      title: 'Department created',
      description:
        'The department was created successfully.',
      icon: 'i-lucide-circle-check',
      color: 'success'
    })

    createModal.value = false
    resetCreateForm()

    await loadData()
  } catch (error: any) {
    console.error(
      'Department creation error:',
      error
    )

    toast.add({
      title: 'Unable to create department',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        'Failed to create the department.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loadingCreate.value = false
  }
}

const updateDepartment = async () => {
  if (
    !validateDepartmentName(
      editForm.name
    )
  ) {
    return
  }

  if (
    departmentNameExists(
      editForm.name,
      selectedId.value
    )
  ) {
    toast.add({
      title: 'Duplicate department',
      description:
        'Another department already uses this name.',
      icon: 'i-lucide-circle-alert',
      color: 'warning'
    })

    return
  }

  loadingUpdate.value = true

  try {
    await $api(
      `/departments/${selectedId.value}`,
      {
        method: 'PUT',

        body: {
          data: {
            name:
              editForm.name.trim()
          }
        }
      }
    )

    toast.add({
      title: 'Department updated',
      description:
        'The department was updated successfully.',
      icon: 'i-lucide-circle-check',
      color: 'success'
    })

    editModal.value = false
    resetEditForm()

    await loadData()
  } catch (error: any) {
    console.error(
      'Department update error:',
      error
    )

    toast.add({
      title: 'Unable to update department',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        'Failed to update the department.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loadingUpdate.value = false
  }
}

const requestDeleteOne = (row: any) => {
  deleteTarget.value = row
  deleteTargetType.value = 'single'
  deleteModal.value = true
}

const requestDeleteSelected = () => {
  if (!selectedCount.value) {
    return
  }

  deleteTarget.value = null
  deleteTargetType.value = 'multiple'
  deleteModal.value = true
}

const closeDeleteModal = () => {
  deleteModal.value = false
  deleteTarget.value = null
  deleteTargetType.value = 'single'
}

const deleteOne = async (row: any) => {
  await $api(
    `/departments/${getDepartmentKey(row)}`,
    {
      method: 'DELETE'
    }
  )

  const next = {
    ...selectedRows.value
  }

  delete next[getDepartmentKey(row)]
  selectedRows.value = next
}

const deleteSelected = async () => {
  await Promise.all(
    selectedDepartments.value.map(
      department =>
        $api(
          `/departments/${getDepartmentKey(department)}`,
          {
            method: 'DELETE'
          }
        )
    )
  )

  selectedRows.value = {}
}

const confirmDelete = async () => {
  if (deleteWarning.value) {
    return
  }

  loadingDelete.value = true

  try {
    if (
      deleteTargetType.value ===
      'multiple'
    ) {
      await deleteSelected()

      toast.add({
        title: 'Departments deleted',
        description:
          'The selected department records were deleted successfully.',
        icon: 'i-lucide-circle-check',
        color: 'success'
      })
    } else if (deleteTarget.value) {
      await deleteOne(
        deleteTarget.value
      )

      toast.add({
        title: 'Department deleted',
        description:
          'The department was deleted successfully.',
        icon: 'i-lucide-circle-check',
        color: 'success'
      })
    }

    closeDeleteModal()
    await loadData()
  } catch (error: any) {
    console.error(
      'Department deletion error:',
      error
    )

    toast.add({
      title: 'Unable to delete department',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        'Failed to delete the selected department record.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loadingDelete.value = false
  }
}

watch(
  [
    globalFilter,
    itemsPerPage
  ],
  () => {
    page.value = 1
  }
)

watch(
  () => totalPages.value,
  value => {
    if (page.value > value) {
      page.value = value
    }
  }
)

onMounted(loadData)
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
