<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Student Management</span>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <UInput v-model="globalFilter" icon="i-lucide-search" placeholder="Search student..." class="max-w-sm" />

        <div class="flex items-center gap-2">
          <UButton v-if="selectedCount > 0" label="Delete" color="error" variant="subtle" icon="i-lucide-trash"
            @click="deleteSelected">
            <template #trailing>
              <UKbd>{{ selectedCount }}</UKbd>
            </template>
          </UButton>

          <UButton label="New Student" icon="i-lucide-plus" @click="openCreateModal" />
        </div>
      </div>

      <div class="mt-4 overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="w-12 border border-gray-300 px-3 py-3 text-center"></th>
              <th class="border border-gray-300 px-4 py-3 text-left">Student ID</th>
              <th class="border border-gray-300 px-4 py-3 text-left">Name</th>
              <th class="border border-gray-300 px-4 py-3 text-left">Course</th>
              <th class="border border-gray-300 px-4 py-3 text-left">Year Level</th>
              <th class="border border-gray-300 px-4 py-3 text-left">Section</th>
              <th class="border border-gray-300 px-4 py-3 text-left">Email</th>
              <th class="w-20 border border-gray-300 px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="px-4 py-8 text-center text-gray-500">
                Loading students...
              </td>
            </tr>

            <tr v-else-if="paginatedStudents.length === 0">
              <td colspan="8" class="px-4 py-8 text-center text-gray-500">
                No students found.
              </td>
            </tr>

            <tr v-for="student in paginatedStudents" :key="student.documentId || student.id">
              <td class="border border-gray-300 px-3 py-1 text-center">
                <UCheckbox :model-value="isRowSelected(student)"
                  @update:model-value="toggleRowSelection(student, !!$event)" />
              </td>

              <td class="border border-gray-300 px-4 py-1">
                {{ student.student_id }}
              </td>

              <td class="border border-gray-300 px-4 py-1">
                {{ student.name }}
              </td>

              <td class="border border-gray-300 px-4 py-1">
                {{ student.course || '-' }}
              </td>

              <td class="border border-gray-300 px-4 py-1">
                {{ student.year_level || '-' }}
              </td>

              <td class="border border-gray-300 px-4 py-1">
                {{ student.section || '-' }}
              </td>

              <td class="border border-gray-300 px-4 py-1">
                {{ student.email || '-' }}
              </td>

              <td class="border border-gray-300 px-4 py-1 text-center">
                <UDropdownMenu :items="getDropdownActions(student)">
                  <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex items-center justify-between gap-3 border-t border-default pt-4">
        <div class="text-sm text-muted">
          {{ selectedCount }} of {{ filteredStudents.length }} row(s) selected.
        </div>

        <UPagination v-model:page="page" :total="filteredStudents.length" :items-per-page="itemsPerPage" />
      </div>

      <!-- CREATE MODAL -->
      <UModal v-model:open="createModal">
        <template #title>
          Register Student
        </template>

        <template #body>
          <UForm :state="createForm" class="space-y-4" @submit="createStudent">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UFormField label="Student ID" name="student_id">
                <UInput v-model="createForm.student_id" class="w-full" />
              </UFormField>

              <UFormField label="Full Name" name="name">
                <UInput v-model="createForm.name" class="w-full" />
              </UFormField>

              <UFormField label="Course" name="course">
                <UInput v-model="createForm.course" class="w-full" />
              </UFormField>

              <UFormField label="Year Level" name="year_level">
                <UInput v-model="createForm.year_level" class="w-full" />
              </UFormField>

              <UFormField label="Section" name="section">
                <UInput v-model="createForm.section" class="w-full" />
              </UFormField>

              <UFormField label="Username" name="username">
                <UInput v-model="createForm.username" class="w-full" />
              </UFormField>

              <UFormField label="Email" name="email">
                <UInput v-model="createForm.email" type="email" class="w-full" />
              </UFormField>

              <UFormField label="Password" name="password">
                <UInput v-model="createForm.password" type="password" class="w-full" />
              </UFormField>
            </div>

            <UButton :label="loadingCreate ? 'Saving...' : 'Save'" :disabled="loadingCreate" type="submit" class="mt-3"
              size="lg" block />
          </UForm>
        </template>
      </UModal>

      <!-- EDIT MODAL -->
      <UModal v-model:open="editModal" :ui="{ content: 'max-w-4xl' }">
        <template #title>
          Edit Student
        </template>

        <template #body>
          <UForm :state="editForm" class="space-y-4" @submit="updateStudent">
            <div class="md:col-span-2 space-y-3">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <UFormField label="Student ID" name="student_id">
                  <UInput v-model="editForm.student_id" class="w-full" />
                </UFormField>

                <UFormField label="Full Name" name="name">
                  <UInput v-model="editForm.name" class="w-full" />
                </UFormField>

                <UFormField label="Course" name="course">
                  <UInput v-model="editForm.course" class="w-full" />
                </UFormField>

                <UFormField label="Year Level" name="year_level">
                  <UInput v-model="editForm.year_level" class="w-full" />
                </UFormField>

                <UFormField label="Section" name="section">
                  <UInput v-model="editForm.section" class="w-full" />
                </UFormField>

                <UFormField label="Email" name="email">
                  <UInput v-model="editForm.email" type="email" class="w-full" />
                </UFormField>
              </div>

              <div class="mt-4">
                <UFormField label="Assigned Teachers">
                  <USelectMenu v-model="editForm.assigned_teachers" :items="teacherOptions" value-key="value" multiple
                    class="w-full" placeholder="Select assigned teachers">
                    <!-- Selected items as chips -->
                    <template #default="{ modelValue }">
                      <div class="flex flex-wrap gap-1">
                        <UBadge v-for="id in modelValue" :key="id" color="primary" variant="soft"
                          class="flex items-center gap-1">
                          {{ getTeacherName(id) }}

                          <UIcon name="i-lucide-x" class="cursor-pointer" @click.stop="removeTeacher(id)" />
                        </UBadge>

                        <span v-if="!modelValue?.length" class="text-gray-400">
                          Select assigned teachers
                        </span>
                      </div>
                    </template>
                  </USelectMenu>

                </UFormField>
              </div>

              <!-- Assigned Teachers Preview Table -->
              <div class="max-h-64 overflow-x-auto rounded-lg border border-gray-300">
                <div class="text-sm text-gray-500 my-3 mx-3">
                  {{ assignedTeacherPreview.length }} teacher(s) assigned
                </div>
                <table class="w-full border-collapse text-sm">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="border border-gray-300 px-3 py-2 text-left">Employee No.</th>
                      <th class="border border-gray-300 px-3 py-2 text-left">Teacher</th>
                      <th class="border border-gray-300 px-3 py-2 text-left">Department</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-if="assignedTeacherPreview.length === 0">
                      <td colspan="3" class="px-3 py-4 text-center text-gray-500">
                        No assigned teachers selected.
                      </td>
                    </tr>

                    <tr v-for="teacher in assignedTeacherPreview" :key="teacher.documentId || teacher.id">
                      <td class="border border-gray-300 px-3 py-2">
                        {{ teacher.employee_no || '-' }}
                      </td>
                      <td class="border border-gray-300 px-3 py-2">
                        {{ teacher.name }}
                      </td>
                      <td class="border border-gray-300 px-3 py-2">
                        {{ teacher.department || '-' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="flex justify-end mt-4">
              <UButton :label="loadingUpdate ? 'Updating...' : 'Update'" :disabled="loadingUpdate" type="submit"
                class="mt-3" size="lg" />
            </div>
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

import type { DropdownMenuItem } from '@nuxt/ui'

const { $api } = useNuxtApp()
const toast = useToast()

const loading = ref(true)
const loadingCreate = ref(false)
const loadingUpdate = ref(false)

const createModal = ref(false)
const editModal = ref(false)

const page = ref(1)
const itemsPerPage = 10
const globalFilter = ref('')

const students = ref([])
const selectedId = ref(null)
const selectedUserId = ref(null)
const selectedRows = ref<Record<string | number, boolean>>({})
const teachers = ref([])

const createForm = reactive({
  student_id: '',
  name: '',
  course: '',
  year_level: '',
  section: '',
  username: '',
  email: '',
  password: ''
})

const editForm = reactive({
  student_id: '',
  name: '',
  course: '',
  year_level: '',
  section: '',
  email: '',
  assigned_teachers: [] as string[]
})

const filteredStudents = computed(() => {
  const keyword = globalFilter.value?.toLowerCase()?.trim()
  if (!keyword) return students.value

  return students.value.filter((item: any) =>
    item.student_id?.toLowerCase().includes(keyword) ||
    item.name?.toLowerCase().includes(keyword) ||
    item.course?.toLowerCase().includes(keyword) ||
    item.year_level?.toLowerCase().includes(keyword) ||
    item.section?.toLowerCase().includes(keyword) ||
    item.user?.email?.toLowerCase().includes(keyword)
  )
})

const paginatedStudents = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredStudents.value.slice(start, end)
})



const selectedCount = computed(() =>
  Object.values(selectedRows.value).filter(Boolean).length
)

watch(globalFilter, () => {
  page.value = 1
})

function resetCreateForm() {
  createForm.student_id = ''
  createForm.name = ''
  createForm.course = ''
  createForm.year_level = ''
  createForm.section = ''
  createForm.username = ''
  createForm.email = ''
  createForm.password = ''
}

function resetEditForm() {
  editForm.student_id = ''
  editForm.name = ''
  editForm.course = ''
  editForm.year_level = ''
  editForm.section = ''
  editForm.email = ''
  editForm.assigned_teachers = []
}

function openCreateModal() {
  resetCreateForm()
  createModal.value = true
}

function toggleRowSelection(row: any, value: boolean) {
  const key = row.documentId || row.id
  selectedRows.value[key] = value
}

function isRowSelected(row: any) {
  const key = row.documentId || row.id
  return !!selectedRows.value[key]
}

function getDropdownActions(row: any): DropdownMenuItem[][] {
  return [[
    {
      type: 'label',
      label: 'Actions'
    },
    {
      type: 'separator'
    },
    {
      label: 'Edit',
      icon: 'i-lucide-edit',
      onSelect() {
        selectedId.value = row.id
        selectedUserId.value = row.user?.id || null

        editForm.student_id = row.student_id || ''
        editForm.name = row.name || ''
        editForm.course = row.course || ''
        editForm.year_level = row.year_level || ''
        editForm.section = row.section || ''
        editForm.email = row.user?.email || ''
        editForm.assigned_teachers =
          row.assigned_teachers?.map((teacher: any) => teacher.documentId) || []

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

const teacherOptions = computed(() =>
  teachers.value.map((teacher: any) => ({
    label: teacher.name,
    value: teacher.documentId
  }))
)

const assignedTeacherPreview = computed(() =>
  teachers.value.filter((teacher: any) =>
    editForm.assigned_teachers.includes(teacher.documentId)
  )
)

const getStudents = async () => {
  try {
    loading.value = true

    const res = await $api('/students', {
      query: {
        'populate[user]': true,
        'populate[assigned_teachers]': true,
        'sort[0]': 'name:asc',
        'pagination[pageSize]': 200
      }
    })

    students.value = res.data || []
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const getTeacherName = (documentId: string) => {
  const teacher = teachers.value.find(
    (t: any) => t.documentId === documentId
  )
  return teacher?.name || 'Unknown'
}

const removeTeacher = (id: string) => {
  editForm.assigned_teachers =
    editForm.assigned_teachers.filter((t: string) => t !== id)
}

const getTeachers = async () => {
  const res = await $api('/teachers', {
    query: {
      'sort[0]': 'name:asc',
      'pagination[pageSize]': 200
    }
  })

  teachers.value = res.data || []
}

const createStudent = async () => {
  try {
    loadingCreate.value = true

    await $api('/students/register', {
      method: 'POST',
      body: {
        student_id: createForm.student_id,
        name: createForm.name,
        course: createForm.course,
        year_level: createForm.year_level,
        section: createForm.section,
        username: createForm.username,
        email: createForm.email,
        password: createForm.password
      }
    })

    toast.add({
      title: 'Success',
      description: 'Student account created successfully.',
      color: 'success'
    })

    createModal.value = false
    resetCreateForm()
    await getStudents()
  } catch (err: any) {
    console.log(err)
    toast.add({
      title: 'Error',
      description: err?.data?.error?.message || err?.data?.message || 'Failed to create student.',
      color: 'error'
    })
  } finally {
    loadingCreate.value = false
  }
}

const updateStudent = async () => {
  try {
    loadingUpdate.value = true

    await $api(`/students/update-with-user/${selectedId.value}`, {
      method: 'PUT',
      body: {
        student_id: editForm.student_id,
        name: editForm.name,
        course: editForm.course,
        year_level: editForm.year_level,
        section: editForm.section,
        email: editForm.email,
        assigned_teachers: editForm.assigned_teachers
      }
    })

    toast.add({
      title: 'Success',
      description: 'Student updated successfully.',
      color: 'success'
    })

    editModal.value = false
    resetEditForm()
    await getStudents()
  } catch (err: any) {
    console.log(err)
    toast.add({
      title: 'Error',
      description: err?.data?.error?.message || err?.data?.message || 'Failed to update student.',
      color: 'error'
    })
  } finally {
    loadingUpdate.value = false
  }
}

const deleteOne = async (row: any) => {
  try {
    await $api(`/students/delete-with-user/${row.id}`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Success',
      description: 'Student deleted successfully.',
      color: 'success'
    })

    delete selectedRows.value[row.id]
    await getStudents()
  } catch (err: any) {
    console.log(err)
    toast.add({
      title: 'Error',
      description: err?.data?.error?.message || 'Failed to delete student.',
      color: 'error'
    })
  }
}

const deleteSelected = async () => {
  const selectedItems = students.value.filter(
    (item: any) => selectedRows.value[item.id]
  )

  try {
    await Promise.all(
      selectedItems.map((item: any) =>
        $api(`/students/delete-with-user/${item.id}`, {
          method: 'DELETE'
        })
      )
    )

    toast.add({
      title: 'Success',
      description: 'Selected students deleted successfully.',
      color: 'success'
    })

    selectedRows.value = {}
    await getStudents()
  } catch (err: any) {
    console.log(err)
    toast.add({
      title: 'Error',
      description: err?.data?.error?.message || 'Failed to delete selected students.',
      color: 'error'
    })
  }
}

onMounted(async () => {
  await Promise.all([
    getStudents(),
    getTeachers()
  ])
})
</script>