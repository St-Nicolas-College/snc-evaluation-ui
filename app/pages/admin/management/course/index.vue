<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Course Management</span>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- TOP BAR -->
      <div class="flex flex-wrap items-center justify-between gap-2">
        <UInput v-model="globalFilter" icon="i-lucide-search" placeholder="Search course..." class="max-w-sm" />

        <div class="flex items-center gap-2">
          <UButton v-if="selectedCount > 0" label="Delete" color="error" variant="subtle" icon="i-lucide-trash"
            @click="deleteSelected">
            <template #trailing>
              <UKbd>{{ selectedCount }}</UKbd>
            </template>
          </UButton>

          <UButton label="New Course" icon="i-lucide-plus" @click="openCreateModal" />
        </div>
      </div>

      <!-- TABLE -->
      <div class="mt-4 overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="w-12 border border-gray-300 px-3 py-3 text-center"></th>
              <th class="border border-gray-300 px-4 py-3 text-left">Code</th>
              <th class="border border-gray-300 px-4 py-3 text-left">Name</th>
              <th class="border border-gray-300 px-4 py-3 text-left">Department</th>
              <th class="w-20 border border-gray-300 px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                Loading courses...
              </td>
            </tr>

            <tr v-else-if="paginatedCourses.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                No courses found.
              </td>
            </tr>

            <tr v-for="course in paginatedCourses" :key="course.id">
              <td class="border border-gray-300 px-3 py-1 text-center">
                <UCheckbox :model-value="isRowSelected(course)"
                  @update:model-value="toggleRowSelection(course, !!$event)" />
              </td>

              <td class="border border-gray-300 px-4 py-1 font-semibold uppercase">
                {{ course.code }}
              </td>
              <td class="border border-gray-300 px-4 py-1">{{ course.name }}</td>
              <td class="border border-gray-300 px-4 py-1">
                {{ course.department?.name || '-' }}
              </td>

              <td class="border border-gray-300 px-4 py-1 text-center">
                <UDropdownMenu :items="getDropdownActions(course)">
                  <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="mt-4 flex items-center justify-between gap-3 border-t border-default pt-4">
        <div class="text-sm text-muted">
          {{ selectedCount }} of {{ filteredCourses.length }} row(s) selected.
        </div>

        <UPagination v-model:page="page" :total="filteredCourses.length" :items-per-page="itemsPerPage" />
      </div>

      <!-- CREATE MODAL -->
      <UModal v-model:open="createModal">
        <template #title>
          Add Course
        </template>

        <template #body>
          <UForm :state="createForm" class="space-y-4" @submit="createCourse">
           
              <UFormField label="Course Code" name="code">
                <UInput v-model="createForm.code" placeholder="Example: BSIT" class="w-full" />
              </UFormField>

              <UFormField label="Course Name" name="name">
                <UInput v-model="createForm.name" placeholder="Example: Bachelor of Science in Information Technology"
                  class="w-full" />
              </UFormField>

              <UFormField label="Department" name="department">
                <USelectMenu v-model="createForm.department" :items="departmentOptions" value-key="value"
                  placeholder="Select department" class="w-full" />
              </UFormField>
         

            <UButton :label="loadingCreate ? 'Saving...' : 'Save'" :disabled="loadingCreate" type="submit" class="mt-3"
              size="lg" block />
          </UForm>
        </template>
      </UModal>

      <!-- EDIT MODAL -->
      <UModal v-model:open="editModal">
        <template #title>Edit Course</template>

        <template #body>
          <UForm :state="editForm" @submit="updateCourse" class="space-y-4">
            <UFormField label="Code">
              <UInput v-model="editForm.code" class="w-full" />
            </UFormField>

            <UFormField label="Course Name">
              <UInput v-model="editForm.name" class="w-full" />
            </UFormField>

            <UFormField label="Department">
              <USelectMenu v-model="editForm.department" :items="departmentOptions" value-key="value" class="w-full" />
            </UFormField>

            <UButton type="submit" :loading="loadingUpdate" lass="w-32 justify-center" block>
              Update
            </UButton>
          </UForm>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
//@ts-nocheck
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Admin']
})

const { $api } = useNuxtApp()
const toast = useToast()

const courses = ref([])
const departments = ref([])

const loading = ref(true)
const loadingCreate = ref(false)
const loadingUpdate = ref(false)

const createModal = ref(false)
const editModal = ref(false)

const selectedRows = ref({})
const selectedId = ref(null)

const globalFilter = ref('')
const page = ref(1)
const itemsPerPage = 10

const createForm = reactive({
  code: '',
  name: '',
  department: null
})

const editForm = reactive({
  code: '',
  name: '',
  department: null
})

function resetCreateForm() {
  createForm.code = ''
  createForm.name = ''
  createForm.department = null
}

function resetEditForm() {
  editForm.code = ''
  editForm.name = ''
  editForm.department = null
}

const filteredCourses = computed(() => {
  const keyword = globalFilter.value.toLowerCase()
  if (!keyword) return courses.value

  return courses.value.filter((c: any) =>
    c.code?.toLowerCase().includes(keyword) ||
    c.name?.toLowerCase().includes(keyword) ||
    c.department?.name?.toLowerCase().includes(keyword)
  )
})

const paginatedCourses = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return filteredCourses.value.slice(start, start + itemsPerPage)
})

const selectedCount = computed(() =>
  Object.values(selectedRows.value).filter(Boolean).length
)

const departmentOptions = computed(() =>
  departments.value.map((d: any) => ({
    label: d.name,
    value: d.id
  }))
)

const getCourses = async () => {
  loading.value = true

  const res = await $api('/courses', {
    query: {
      'populate[department]': true,
      'pagination[pageSize]': 200
    }
  })

  courses.value = res.data || []
  loading.value = false
}

const getDepartments = async () => {
  const res = await $api('/departments', {
    query: {
      'sort[0]': 'name:asc'
    }
  })
  departments.value = res.data || []
}

const createCourse = async () => {
  try {
    loadingCreate.value = true

    const exists = courses.value.find(
      (c: any) => c.code === createForm.code.trim().toLowerCase()
    )

    if (exists) {
      toast.add({
        title: 'Error',
        description: 'Course already exists.',
        color: 'error'
      })
      return
    }

    await $api('/courses', {
      method: 'POST',
      body: {
        data: {
          code: createForm.code.trim().toLowerCase(),
          name: createForm.name,
          department: createForm.department
        }
      }
    })

    toast.add({
      title: 'Success',
      description: 'Course created successfully.',
      color: 'success'
    })

    createModal.value = false
    resetCreateForm()
    await getCourses()
  } catch (err: any) {
    console.log(err)

    toast.add({
      title: 'Error',
      description:
        err?.data?.error?.message ||
        err?.data?.message ||
        'Failed to create course.',
      color: 'error'
    })
  } finally {
    loadingCreate.value = false
  }
}

const updateCourse = async () => {
  try {
    loadingUpdate.value = true

    await $api(`/courses/${selectedId.value}`, {
      method: 'PUT',
      body: {
        data: {
          code: editForm.code.trim().toLowerCase(),
          name: editForm.name,
          department: editForm.department
        }
      }
    })

    toast.add({
      title: 'Updated',
      description: 'Course updated successfully.',
      color: 'success'
    })

    editModal.value = false
    resetEditForm()
    await getCourses()
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description:
        err?.data?.error?.message ||
        'Failed to update course.',
      color: 'error'
    })
  } finally {
    loadingUpdate.value = false
  }
}

const deleteOne = async (row: any) => {
  try {
    await $api(`/courses/${row.documentId}`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Success',
      description: 'Course deleted successfully.',
      color: 'success'
    })

    delete selectedRows.value[row.id]
    delete selectedRows.value[row.documentId]

    await getCourses()
  } catch (err: any) {
    console.log(err)

    toast.add({
      title: 'Error',
      description: err?.data?.error?.message || 'Failed to delete course.',
      color: 'error'
    })
  }
}

const deleteSelected = async () => {
  const selected = courses.value.filter((course: any) =>
    selectedRows.value[course.id] || selectedRows.value[course.documentId]
  )

  try {
    await Promise.all(
      selected.map((course: any) =>
        $api(`/courses/${course.documentId}`, {
          method: 'DELETE'
        })
      )
    )

    selectedRows.value = {}

    toast.add({
      title: 'Success',
      description: 'Selected courses deleted successfully.',
      color: 'success'
    })

    await getCourses()
  } catch (err: any) {
    console.log(err)

    toast.add({
      title: 'Error',
      description: err?.data?.error?.message || 'Failed to delete selected courses.',
      color: 'error'
    })
  }
}



function toggleRowSelection(row: any, value: boolean) {
  const key = row.documentId || row.id
  selectedRows.value[key] = value
}

function isRowSelected(row: any) {
  const key = row.documentId || row.id
  return !!selectedRows.value[key]
}

function getDropdownActions(row: any) {
  return [[
    {
      label: 'Edit',
      icon: 'i-lucide-edit',
      onSelect() {
        selectedId.value = row.documentId
        editForm.code = row.code
        editForm.name = row.name
        editForm.department = row.department?.id
        editModal.value = true
      }
    },
    {
      label: 'Delete',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        deleteOne(row)
      }
    }
  ]]
}

watch(globalFilter, () => {
  page.value = 1
})

function openCreateModal() {
  createForm.code = ''
  createForm.name = ''
  createForm.department = null
  createModal.value = true
}

onMounted(() => {
  getCourses()
  getDepartments()
})
</script>