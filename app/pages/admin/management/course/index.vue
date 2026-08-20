<template>
  <div class="space-y-6 pb-8">
    <!-- =====================================================
      HERO
    ====================================================== -->
    <section
      class="relative overflow-hidden rounded-[28px] border border-violet-100 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 px-5 py-6 text-white shadow-xl shadow-violet-900/10 sm:px-7 sm:py-7"
    >
      <div
        class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-fuchsia-300/15 blur-3xl"
      />

      <div
        class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"
      >
        <div class="flex min-w-0 items-start gap-4">
          <div
            class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex"
          >
            <UIcon name="i-lucide-book-copy" class="size-7" />
          </div>

          <div class="min-w-0">
            <div
              class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-violet-50"
            >
              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Administrator Portal
              </span>

              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Course Management
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Course Management
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-violet-50/90">
              Create and maintain academic programmes and connect every course
              to its corresponding department.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">{{ summary.total }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-violet-100">
              Courses
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">{{ summary.departments }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-violet-100">
              Departments
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">{{ summary.unassigned }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-violet-100">
              Unassigned
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
        label="Total Courses"
        :value="summary.total"
        icon="i-lucide-book-copy"
        tone="violet"
      />

      <StatCard
        label="Active Departments"
        :value="summary.departments"
        icon="i-lucide-building-2"
        tone="blue"
      />

      <StatCard
        label="Assigned Courses"
        :value="summary.assigned"
        icon="i-lucide-link-2"
        tone="emerald"
      />

      <StatCard
        label="Unassigned Courses"
        :value="summary.unassigned"
        icon="i-lucide-unlink"
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
        class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
      >
        <div class="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
          <UInput
            v-model="globalFilter"
            icon="i-lucide-search"
            placeholder="Search course code, name, or department..."
            class="w-full"
          />

          <USelectMenu
            v-model="selectedDepartment"
            :items="departmentFilterOptions"
            value-key="value"
            class="w-full"
          />
        </div>

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
            New Course
          </UButton>
        </div>
      </div>

      <div
        v-if="hasActiveFilters"
        class="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-800"
      >
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
          Active filters:
        </span>

        <UBadge v-if="globalFilter" color="neutral" variant="subtle">
          Search: {{ globalFilter }}
        </UBadge>

        <UBadge
          v-if="selectedDepartment !== 'all'"
          color="primary"
          variant="subtle"
        >
          {{ selectedDepartmentLabel }}
        </UBadge>

        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          @click="clearFilters"
        >
          Clear filters
        </UButton>
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
            Course Directory
          </h2>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Showing {{ filteredCourses.length }} of {{ courses.length }}
            course{{ courses.length === 1 ? '' : 's' }}.
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
          Unable to load courses
        </h3>

        <p
          class="mx-auto mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400"
        >
          {{ loadError }}
        </p>

        <UButton class="mt-5" icon="i-lucide-refresh-cw" @click="getCourses">
          Try Again
        </UButton>
      </div>

      <div v-else-if="!filteredCourses.length" class="px-6 py-16 text-center">
        <div
          class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400"
        >
          <UIcon
            :name="courses.length ? 'i-lucide-search-x' : 'i-lucide-book-copy'"
            class="size-8"
          />
        </div>

        <h3 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
          {{
            courses.length
              ? 'No matching courses found'
              : 'No course records yet'
          }}
        </h3>

        <p
          class="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400"
        >
          {{
            courses.length
              ? 'Try changing or clearing the current filters.'
              : 'Create the first course to begin organising academic programmes.'
          }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[820px] text-sm">
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

              <!-- <th class="px-4 py-3 text-left">Code</th> -->
              <th class="px-4 py-3 text-left">Course Name</th>
              <th class="px-4 py-3 text-left">Department</th>
              <th class="w-20 px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="course in paginatedCourses"
              :key="getCourseKey(course)"
              class="transition hover:bg-gray-50/80 dark:hover:bg-gray-950/30"
            >
              <td class="px-4 py-4 text-center">
                <UCheckbox
                  :model-value="isRowSelected(course)"
                  @update:model-value="toggleRowSelection(course, !!$event)"
                />
              </td>

              <!-- <td class="px-4 py-4">
                <UBadge color="primary" variant="subtle">
                  {{ formatCourseCode(course.code) }}
                </UBadge>
              </td> -->

              <td class="px-4 py-4">
                <div class="flex min-w-0 items-center gap-3">
                  <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm"
                  >
                    <UIcon name="i-lucide-book-open" class="size-5" />
                  </div>

                  <div class="min-w-0">
                    <p class="font-bold text-gray-900 dark:text-white">
                      {{ course.name || 'Unnamed Course' }}
                    </p>

                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      Academic programme
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-4 py-4">
                <div
                  v-if="course.department"
                  class="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                >
                  <UIcon name="i-lucide-building-2" class="size-4 text-gray-400" />
                  <span>{{ course.department.name }}</span>
                </div>

                <UBadge v-else color="warning" variant="subtle">
                  Not assigned
                </UBadge>
              </td>

              <td class="px-4 py-4 text-center">
                <UDropdownMenu :items="getDropdownActions(course)">
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
        v-if="filteredCourses.length"
        class="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <div
          class="text-center text-xs text-gray-500 sm:text-left dark:text-gray-400"
        >
          Showing {{ paginationStart }}–{{ paginationEnd }} of
          {{ filteredCourses.length }} records
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
      title="Add Course"
      description="Create a new academic course and assign it to a department."
      :ui="{ content: 'max-w-2xl' }"
    >
      <template #content>
        <div
          class="max-h-[88vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900"
        >
          <ModalHeader
            title="Add Course"
            description="Create a new academic programme."
            icon="i-lucide-book-plus"
            @close="createModal = false"
          />

          <UForm
            :state="createForm"
            class="space-y-5 p-6"
            @submit="createCourse"
          >
            <UFormField label="Course Code" name="code" required>
              <UInput
                v-model="createForm.code"
                placeholder="Example: BSIT"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Course Name" name="name" required>
              <UInput
                v-model="createForm.name"
                placeholder="Example: Bachelor of Science in Information Technology"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Department" name="department" required>
              <USelectMenu
                v-model="createForm.department"
                :items="departmentOptions"
                value-key="value"
                placeholder="Select department"
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
                Save Course
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
      title="Edit Course"
      description="Update the selected course and department assignment."
      :ui="{ content: 'max-w-2xl' }"
    >
      <template #content>
        <div
          class="max-h-[88vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900"
        >
          <ModalHeader
            title="Edit Course"
            description="Update course details and department assignment."
            icon="i-lucide-book-marked"
            tone="blue"
            @close="editModal = false"
          />

          <UForm
            :state="editForm"
            class="space-y-5 p-6"
            @submit="updateCourse"
          >
            <UFormField label="Course Code" name="code" required>
              <UInput v-model="editForm.code" class="w-full" />
            </UFormField>

            <UFormField label="Course Name" name="name" required>
              <UInput v-model="editForm.name" class="w-full" />
            </UFormField>

            <UFormField label="Department" name="department" required>
              <USelectMenu
                v-model="editForm.department"
                :items="departmentOptions"
                value-key="value"
                placeholder="Select department"
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
      title="Confirm Course Deletion"
      description="Confirm the permanent deletion of the selected course record or records."
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
                ? 'Delete selected courses?'
                : 'Delete course?'
            }}
          </h2>

          <p
            class="mt-2 text-center text-sm leading-6 text-gray-500 dark:text-gray-400"
          >
            {{
              deleteTargetType === 'multiple'
                ? `This will permanently delete ${selectedCount} selected course record${selectedCount === 1 ? '' : 's'}.`
                : `This will permanently delete ${deleteTarget?.name || 'this course'}.`
            }}
          </p>

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
  role: ['Admin', 'HR']
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
      default: 'violet'
    }
  },

  setup(props) {
    const tones: Record<string, string> = {
      violet:
        'border-violet-100 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/20',
      blue:
        'border-blue-100 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20',
      emerald:
        'border-emerald-100 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20',
      amber:
        'border-amber-100 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20'
    }

    const iconTones: Record<string, string> = {
      violet:
        'bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
      blue:
        'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
      emerald:
        'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
      amber:
        'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
    }

    return () =>
      h(
        'div',
        {
          class: `rounded-2xl border p-5 ${tones[props.tone] || tones.violet}`
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
                  iconTones[props.tone] || iconTones.violet
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
      default: 'violet'
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
              : 'relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 px-6 py-6 text-white'
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

const courses = ref<any[]>([])
const departments = ref<any[]>([])

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
const selectedDepartment = ref('all')

const page = ref(1)
const itemsPerPage = ref(10)

const pageSizeOptions = [
  { label: '10 rows', value: 10 },
  { label: '20 rows', value: 20 },
  { label: '50 rows', value: 50 },
  { label: '100 rows', value: 100 }
]

const createForm = reactive({
  code: '',
  name: '',
  department: null as any
})

const editForm = reactive({
  code: '',
  name: '',
  department: null as any
})

const summary = computed(() => ({
  total: courses.value.length,

  departments: new Set(
    courses.value
      .map(course => course.department?.id)
      .filter(Boolean)
  ).size,

  assigned: courses.value.filter(
    course => Boolean(course.department)
  ).length,

  unassigned: courses.value.filter(
    course => !course.department
  ).length
}))

const departmentOptions = computed(() =>
  departments.value.map(department => ({
    label: department.name,
    value: department.id
  }))
)

const departmentFilterOptions = computed(() => [
  {
    label: 'All Departments',
    value: 'all'
  },

  ...departments.value.map(department => ({
    label: department.name,
    value: String(department.id)
  }))
])

const selectedDepartmentLabel = computed(() =>
  departmentFilterOptions.value.find(
    option => option.value === selectedDepartment.value
  )?.label || 'Department'
)

const filteredCourses = computed(() => {
  const keyword = globalFilter.value
    .trim()
    .toLowerCase()

  return courses.value.filter(course => {
    const searchable = [
      course.code,
      course.name,
      course.department?.name
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesSearch =
      !keyword || searchable.includes(keyword)

    const matchesDepartment =
      selectedDepartment.value === 'all' ||
      String(course.department?.id) === selectedDepartment.value

    return matchesSearch && matchesDepartment
  })
})

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(
      filteredCourses.value.length /
        Number(itemsPerPage.value)
    )
  )
)

const paginatedCourses = computed(() => {
  const start =
    (page.value - 1) *
    Number(itemsPerPage.value)

  return filteredCourses.value.slice(
    start,
    start + Number(itemsPerPage.value)
  )
})

const paginationStart = computed(() =>
  filteredCourses.value.length
    ? (page.value - 1) *
        Number(itemsPerPage.value) +
      1
    : 0
)

const paginationEnd = computed(() =>
  Math.min(
    page.value * Number(itemsPerPage.value),
    filteredCourses.value.length
  )
)

const selectedCount = computed(() =>
  Object.values(selectedRows.value).filter(Boolean).length
)

const hasActiveFilters = computed(() =>
  Boolean(
    globalFilter.value ||
    selectedDepartment.value !== 'all'
  )
)

const isCurrentPageSelected = computed(() =>
  paginatedCourses.value.length > 0 &&
  paginatedCourses.value.every(isRowSelected)
)

const isCurrentPagePartiallySelected = computed(() => {
  const selectedOnPage =
    paginatedCourses.value.filter(isRowSelected).length

  return (
    selectedOnPage > 0 &&
    selectedOnPage < paginatedCourses.value.length
  )
})

const getCourseKey = (course: any) =>
  course?.documentId || course?.id

const formatCourseCode = (value: any) =>
  String(value || 'NO CODE').toUpperCase()

const resetCreateForm = () => {
  createForm.code = ''
  createForm.name = ''
  createForm.department = null
}

const resetEditForm = () => {
  editForm.code = ''
  editForm.name = ''
  editForm.department = null
  selectedId.value = null
}

const openCreateModal = () => {
  resetCreateForm()
  createModal.value = true
}

const openEditModal = (row: any) => {
  // Standard Strapi document update routes use documentId.
  selectedId.value =
    row.documentId || row.id

  editForm.code =
    row.code || ''

  editForm.name =
    row.name || ''

  editForm.department =
    row.department?.id || null

  editModal.value = true
}

const clearFilters = () => {
  globalFilter.value = ''
  selectedDepartment.value = 'all'
  page.value = 1
}

const toggleRowSelection = (
  row: any,
  value: boolean
) => {
  selectedRows.value = {
    ...selectedRows.value,
    [getCourseKey(row)]: value
  }
}

const isRowSelected = (row: any) =>
  Boolean(
    selectedRows.value[
      getCourseKey(row)
    ]
  )

const toggleCurrentPageSelection = (
  value: boolean
) => {
  const next = {
    ...selectedRows.value
  }

  paginatedCourses.value.forEach(row => {
    next[getCourseKey(row)] = value
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
      label: 'Edit Course',
      icon: 'i-lucide-edit-3',

      onSelect() {
        openEditModal(row)
      }
    },

    {
      label: 'Delete Course',
      icon: 'i-lucide-trash-2',
      color: 'error',

      onSelect() {
        requestDeleteOne(row)
      }
    }
  ]
]

const getCourses = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const res: any = await $api(
      '/courses',
      {
        query: {
          'populate[department]':
            true,

          'sort[0]':
            'name:asc',

          'pagination[pageSize]':
            10000
        }
      }
    )

    courses.value =
      res.data || []

    const availableKeys = new Set(
      courses.value.map(getCourseKey)
    )

    selectedRows.value =
      Object.fromEntries(
        Object.entries(
          selectedRows.value
        ).filter(([key]) =>
          availableKeys.has(key)
        )
      )

    if (
      page.value > totalPages.value
    ) {
      page.value = totalPages.value
    }
  } catch (error: any) {
    console.error(
      'Course loading error:',
      error
    )

    courses.value = []

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to load course records.'
  } finally {
    loading.value = false
  }
}

const getDepartments = async () => {
  try {
    const res: any = await $api(
      '/departments',
      {
        query: {
          'sort[0]':
            'name:asc',

          'pagination[pageSize]':
            500
        }
      }
    )

    departments.value =
      res.data || []
  } catch (error) {
    console.error(
      'Department loading error:',
      error
    )

    departments.value = []
  }
}

const validateForm = (
  form: typeof createForm | typeof editForm
) => {
  if (
    !form.code.trim() ||
    !form.name.trim() ||
    !form.department
  ) {
    toast.add({
      title: 'Incomplete information',
      description:
        'Enter the course code, course name, and department.',
      icon: 'i-lucide-circle-alert',
      color: 'warning'
    })

    return false
  }

  return true
}

const courseCodeExists = (
  code: string,
  excludeDocumentId?: any
) => {
  const normalisedCode =
    code.trim().toLowerCase()

  return courses.value.some(course => {
    const sameCode =
      String(course.code || '')
        .trim()
        .toLowerCase() === normalisedCode

    const isExcluded =
      excludeDocumentId &&
      getCourseKey(course) === excludeDocumentId

    return sameCode && !isExcluded
  })
}

const createCourse = async () => {
  if (!validateForm(createForm)) {
    return
  }

  if (courseCodeExists(createForm.code)) {
    toast.add({
      title: 'Duplicate course code',
      description:
        'A course with this code already exists.',
      icon: 'i-lucide-circle-alert',
      color: 'warning'
    })

    return
  }

  loadingCreate.value = true

  try {
    await $api('/courses', {
      method: 'POST',

      body: {
        data: {
          code:
            createForm.code
              .trim()
              .toLowerCase(),

          name:
            createForm.name.trim(),

          department:
            createForm.department
        }
      }
    })

    toast.add({
      title: 'Course created',
      description:
        'The course was created successfully.',
      icon: 'i-lucide-circle-check',
      color: 'success'
    })

    createModal.value = false
    resetCreateForm()

    await getCourses()
  } catch (error: any) {
    console.error(
      'Course creation error:',
      error
    )

    toast.add({
      title: 'Unable to create course',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        'Failed to create the course.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loadingCreate.value = false
  }
}

const updateCourse = async () => {
  if (!validateForm(editForm)) {
    return
  }

  if (
    courseCodeExists(
      editForm.code,
      selectedId.value
    )
  ) {
    toast.add({
      title: 'Duplicate course code',
      description:
        'Another course already uses this code.',
      icon: 'i-lucide-circle-alert',
      color: 'warning'
    })

    return
  }

  loadingUpdate.value = true

  try {
    await $api(
      `/courses/${selectedId.value}`,
      {
        method: 'PUT',

        body: {
          data: {
            code:
              editForm.code
                .trim()
                .toLowerCase(),

            name:
              editForm.name.trim(),

            department:
              editForm.department
          }
        }
      }
    )

    toast.add({
      title: 'Course updated',
      description:
        'The course was updated successfully.',
      icon: 'i-lucide-circle-check',
      color: 'success'
    })

    editModal.value = false
    resetEditForm()

    await getCourses()
  } catch (error: any) {
    console.error(
      'Course update error:',
      error
    )

    toast.add({
      title: 'Unable to update course',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        'Failed to update the course.',
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
    `/courses/${getCourseKey(row)}`,
    {
      method: 'DELETE'
    }
  )

  const next = {
    ...selectedRows.value
  }

  delete next[getCourseKey(row)]
  selectedRows.value = next
}

const deleteSelected = async () => {
  const selected =
    courses.value.filter(course =>
      selectedRows.value[
        getCourseKey(course)
      ]
    )

  await Promise.all(
    selected.map(course =>
      $api(
        `/courses/${getCourseKey(course)}`,
        {
          method: 'DELETE'
        }
      )
    )
  )

  selectedRows.value = {}
}

const confirmDelete = async () => {
  loadingDelete.value = true

  try {
    if (
      deleteTargetType.value === 'multiple'
    ) {
      await deleteSelected()

      toast.add({
        title: 'Courses deleted',
        description:
          'The selected course records were deleted successfully.',
        icon: 'i-lucide-circle-check',
        color: 'success'
      })
    } else if (deleteTarget.value) {
      await deleteOne(deleteTarget.value)

      toast.add({
        title: 'Course deleted',
        description:
          'The course was deleted successfully.',
        icon: 'i-lucide-circle-check',
        color: 'success'
      })
    }

    closeDeleteModal()
    await getCourses()
  } catch (error: any) {
    console.error(
      'Course deletion error:',
      error
    )

    toast.add({
      title: 'Unable to delete course',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        'Failed to delete the selected course record.',
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
    selectedDepartment,
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

onMounted(async () => {
  await Promise.all([
    getCourses(),
    getDepartments()
  ])
})
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
