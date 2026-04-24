<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Teacher Management</span>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <UInput v-model="globalFilter" icon="i-lucide-search" placeholder="Search teacher..." class="max-w-sm" />

        <div class="flex items-center gap-2">
          <UButton v-if="selectedCount > 0" label="Delete" color="error" variant="subtle" icon="i-lucide-trash"
            @click="deleteSelected">
            <template #trailing>
              <UKbd>{{ selectedCount }}</UKbd>
            </template>
          </UButton>

          <UButton label="New Teacher" icon="i-lucide-plus" @click="openCreateModal" />
        </div>
      </div>

      <div class="mt-4 overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="w-12 border border-gray-300 px-3 py-3 text-center"></th>
              <th class="border border-gray-300 px-4 py-3 text-left">Employee No.</th>
              <th class="border border-gray-300 px-4 py-3 text-left">Name</th>
              <th class="border border-gray-300 px-4 py-3 text-left">Department</th>
              <th class="border border-gray-300 px-4 py-3 text-left">Role</th>
              <th class="border border-gray-300 px-4 py-3 text-left">Email</th>
              <th class="border border-gray-300 px-4 py-3 text-left">
                Assigned Subjects
              </th>
              <th class="w-20 border border-gray-300 px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                Loading teachers...
              </td>
            </tr>

            <tr v-else-if="paginatedTeachers.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                No teachers found.
              </td>
            </tr>

            <tr v-for="teacher in paginatedTeachers" :key="teacher.documentId || teacher.id">
              <td class="border border-gray-300 px-3 py-1 text-center">
                <UCheckbox :model-value="isRowSelected(teacher)"
                  @update:model-value="toggleRowSelection(teacher, !!$event)" />
              </td>

              <td class="border border-gray-300 px-4 py-1">
                {{ teacher.employee_no || '-' }}
              </td>

              <td class="border border-gray-300 px-4 py-1">
                {{ teacher.name }}
              </td>

              <td class="border border-gray-300 px-4 py-1">
                {{ teacher.department || '-' }}
              </td>

              <td class="border border-gray-300 px-4 py-1">
                {{ teacher.user?.role?.name || '-' }}
              </td>

              <td class="border border-gray-300 px-4 py-1">
                {{ teacher.user?.email || '-' }}
              </td>
              <td class="border border-gray-300 px-4 py-1">
                <UTooltip v-if="teacher.assigned_subjects?.length"
                  :text="teacher.assigned_subjects.map((s: any) => s.code ? `${s.code} - ${s.name}` : s.name).join(', ')">
                  <div class="flex flex-wrap gap-1">
                    <UBadge v-for="subject in teacher.assigned_subjects.slice(0, 3)" :key="subject.id" color="primary"
                      variant="soft">
                      {{ subject.code || subject.name }}
                    </UBadge>

                    <UBadge v-if="teacher.assigned_subjects.length > 3" color="neutral" variant="soft">
                      +{{ teacher.assigned_subjects.length - 3 }} more
                    </UBadge>
                  </div>
                </UTooltip>

                <span v-else class="text-gray-400">
                  No subjects
                </span>
              </td>

              <td class="border border-gray-300 px-4 py-1 text-center">
                <UDropdownMenu :items="getDropdownActions(teacher)">
                  <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex items-center justify-between gap-3 border-t border-default pt-4">
        <div class="text-sm text-muted">
          {{ selectedCount }} of {{ filteredTeachers.length }} row(s) selected.
        </div>

        <UPagination v-model:page="page" :total="filteredTeachers.length" :items-per-page="itemsPerPage" />
      </div>

      <!-- CREATE MODAL -->
      <UModal v-model:open="createModal">
        <template #title>
          Register Teacher
        </template>

        <template #body>
          <UForm :state="createForm" class="space-y-4" @submit="createTeacher">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UFormField label="Employee No." name="employee_no">
                <UInput v-model="createForm.employee_no" class="w-full" />
              </UFormField>

              <UFormField label="Full Name" name="name">
                <UInput v-model="createForm.name" class="w-full" />
              </UFormField>

              <UFormField label="Department" name="department">
                <UInput v-model="createForm.department" class="w-full" />
              </UFormField>

              <UFormField label="Role" name="roleName">
                <USelectMenu v-model="createForm.roleName" :items="roleOptions" value-key="value" class="w-full"
                  placeholder="Select role" />
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
          Edit Teacher
        </template>

        <template #body>
          <!-- <UForm :state="editForm" class="space-y-4" @submit="updateTeacher">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UFormField label="Employee No." name="employee_no">
                <UInput v-model="editForm.employee_no" class="w-full" />
              </UFormField>

              <UFormField label="Full Name" name="name">
                <UInput v-model="editForm.name" class="w-full" />
              </UFormField>

              <UFormField label="Department" name="department">
                <UInput v-model="editForm.department" class="w-full" />
              </UFormField>

              <UFormField label="Role" name="roleName">
                <USelectMenu v-model="editForm.roleName" :items="roleOptions" value-key="value" class="w-full"
                  placeholder="Select role" />
              </UFormField>

              <UFormField label="Email" name="email">
                <UInput v-model="editForm.email" type="email" class="w-full" />
              </UFormField>

              <UFormField label="Assigned Subjects">
                <USelectMenu v-model="editForm.assigned_subjects" :items="subjectOptions" value-key="value" multiple
                  class="w-full" placeholder="Select subjects" />
              </UFormField>
            </div>

            <UButton :label="loadingUpdate ? 'Updating...' : 'Update'" :disabled="loadingUpdate" type="submit"
              class="mt-3" size="lg" block />
          </UForm> -->

          <UForm :state="editForm" class="space-y-4" @submit="updateTeacher">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UFormField label="Employee No." name="employee_no">
                <UInput v-model="editForm.employee_no" class="w-full" />
              </UFormField>

              <UFormField label="Full Name" name="name">
                <UInput v-model="editForm.name" class="w-full" />
              </UFormField>

              <UFormField label="Department" name="department">
                <UInput v-model="editForm.department" class="w-full" />
              </UFormField>

              <UFormField label="Email" name="email">
                <UInput v-model="editForm.email" type="email" class="w-full" />
              </UFormField>

              <UFormField label="Role" name="roleName">
                <USelectMenu v-model="editForm.roleName" :items="roleOptions" value-key="value" class="w-full"
                  placeholder="Select role" />
              </UFormField>
            </div>

            <div class="space-y-3">
              <UFormField label="Assigned Subjects">
                <USelectMenu v-model="editForm.assigned_subjects" :items="subjectOptions" value-key="value" multiple
                  class="w-full" placeholder="Select assigned subjects">
                <!-- Selected items as chips -->
                    <template #default="{ modelValue }">
                      <div class="flex flex-wrap gap-1">
                        <UBadge v-for="id in modelValue" :key="id" color="primary" variant="soft"
                          class="flex items-center gap-1">
                          {{ getSubjectName(id) }}

                          <UIcon name="i-lucide-x" class="cursor-pointer" @click.stop="removeSubject(id)" />
                        </UBadge>

                        <span v-if="!modelValue?.length" class="text-gray-400">
                          Select assigned teachers
                        </span>
                      </div>
                    </template>
                </USelectMenu>
              </UFormField>

              <div class="overflow-x-auto rounded-lg border border-gray-300">
                <table class="w-full border-collapse text-sm">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="border border-gray-300 px-3 py-2 text-left">Code</th>
                      <th class="border border-gray-300 px-3 py-2 text-left">Subject</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-if="assignedSubjectPreview.length === 0">
                      <td colspan="2" class="px-3 py-4 text-center text-gray-500">
                        No assigned subjects selected.
                      </td>
                    </tr>

                    <tr v-for="subject in assignedSubjectPreview" :key="subject.documentId || subject.id">
                      <td class="border border-gray-300 px-3 py-2">
                        {{ subject.code || '-' }}
                      </td>

                      <td class="border border-gray-300 px-3 py-2">
                        {{ subject.name }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-4 flex justify-end">
              <UButton :label="loadingUpdate ? 'Updating...' : 'Update'" :disabled="loadingUpdate" type="submit"
                size="lg" class="w-40 justify-center" />
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

const teachers = ref([])
const selectedId = ref(null)
const selectedUserId = ref(null)
const selectedRows = ref<Record<string | number, boolean>>({})
const subjects = ref([])

const roleOptions = [
  { label: 'Faculty', value: 'Faculty' },
  { label: 'Dean', value: 'Dean' },
]

const createForm = reactive({
  employee_no: '',
  name: '',
  department: '',
  roleName: '',
  username: '',
  email: '',
  password: ''
})

const editForm = reactive({
  employee_no: '',
  name: '',
  department: '',
  roleName: '',
  email: '',
  assigned_subjects: [] as string[]
})

const filteredTeachers = computed(() => {
  const keyword = globalFilter.value?.toLowerCase()?.trim()
  if (!keyword) return teachers.value

  return teachers.value.filter((item: any) =>
    item.employee_no?.toLowerCase().includes(keyword) ||
    item.name?.toLowerCase().includes(keyword) ||
    item.department?.toLowerCase().includes(keyword) ||
    item.user?.email?.toLowerCase().includes(keyword) ||
    item.user?.role?.name?.toLowerCase().includes(keyword)
  )
})

const paginatedTeachers = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTeachers.value.slice(start, end)
})

const selectedCount = computed(() =>
  Object.values(selectedRows.value).filter(Boolean).length
)

const assignedSubjectPreview = computed(() =>
  subjects.value.filter((subject: any) =>
    editForm.assigned_subjects.includes(subject.documentId)
  )
)

watch(globalFilter, () => {
  page.value = 1
})

function resetCreateForm() {
  createForm.employee_no = ''
  createForm.name = ''
  createForm.department = ''
  createForm.roleName = ''
  createForm.username = ''
  createForm.email = ''
  createForm.password = ''
}

function resetEditForm() {
  editForm.employee_no = ''
  editForm.name = ''
  editForm.department = ''
  editForm.roleName = ''
  editForm.email = ''
  editForm.assigned_subjects = []
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

        editForm.employee_no = row.employee_no || ''
        editForm.name = row.name || ''
        editForm.department = row.department || ''
        editForm.roleName = row.user?.role?.name || ''
        editForm.email = row.user?.email || ''

        // ✅ ADD THIS HERE
        editForm.assigned_subjects =
          row.assigned_subjects?.map((s: any) => s.documentId) || []

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

const getSubjects = async () => {
  const res = await $api('/subjects', {
    query: {
      'sort[0]': 'name:asc',
      'pagination[pageSize]': 100
    }
  })

  console.log('SUBJECTS:', res.data)
  subjects.value = res.data || []
}

const getSubjectName = (documentId: string) => {
  const subject = subjects.value.find(
    (t: any) => t.documentId === documentId
  )
  return subject?.name || 'Unknown'
}

const removeSubject = (id: string) => {
  editForm.assigned_subjects =
    editForm.assigned_subjects.filter((t: string) => t !== id)
}

const subjectOptions = computed(() =>
  subjects.value.map((s: any) => ({
    label: s.code ? `${s.code} - ${s.name}` : s.name,
    value: s.documentId
  }))
)


const getTeachers = async () => {
  try {
    loading.value = true

    const res = await $api('/teachers', {
      query: {
        'populate[assigned_subjects]': true,
        'populate[user][populate]': 'role',
        'sort[0]': 'name:asc',
        'pagination[pageSize]': 200
      }
    })

    teachers.value = res.data || []
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const createTeacher = async () => {
  try {
    loadingCreate.value = true

    await $api('/teachers/register', {
      method: 'POST',
      body: {
        employee_no: createForm.employee_no,
        name: createForm.name,
        department: createForm.department,
        roleName: createForm.roleName,
        username: createForm.username,
        email: createForm.email,
        password: createForm.password
      }
    })

    toast.add({
      title: 'Success',
      description: 'Teacher account created successfully.',
      color: 'success'
    })

    createModal.value = false
    resetCreateForm()
    await getTeachers()
  } catch (err: any) {
    console.log(err)
    toast.add({
      title: 'Error',
      description: err?.data?.error?.message || err?.data?.message || 'Failed to create teacher.',
      color: 'error'
    })
  } finally {
    loadingCreate.value = false
  }
}

const updateTeacher = async () => {
  try {
    loadingUpdate.value = true

    await $api(`/teachers/update-with-user/${selectedId.value}`, {
      method: 'PUT',
      body: {
        employee_no: editForm.employee_no,
        name: editForm.name,
        department: editForm.department,
        email: editForm.email,
        roleName: editForm.roleName,
        assigned_subjects: editForm.assigned_subjects
      }
    })

    toast.add({
      title: 'Success',
      description: 'Teacher updated successfully.',
      color: 'success'
    })

    editModal.value = false
    resetEditForm()
    await getTeachers()

  } catch (err: any) {
    console.log(err)

    toast.add({
      title: 'Error',
      description: err?.data?.error?.message || 'Failed to update teacher.',
      color: 'error'
    })
  } finally {
    loadingUpdate.value = false
  }
}

const deleteOne = async (row: any) => {
  try {
    await $api(`/teachers/${row.documentId || row.id}`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Success',
      description: 'Teacher deleted successfully.',
      color: 'success'
    })

    delete selectedRows.value[row.documentId || row.id]
    await getTeachers()
  } catch (err: any) {
    console.log(err)
    toast.add({
      title: 'Error',
      description: err?.data?.error?.message || 'Failed to delete teacher.',
      color: 'error'
    })
  }
}

const deleteSelected = async () => {
  const selectedItems = teachers.value.filter(
    (item: any) => selectedRows.value[item.documentId || item.id]
  )

  try {
    await Promise.all(
      selectedItems.map((item: any) =>
        $api(`/teachers/${item.documentId || item.id}`, {
          method: 'DELETE'
        })
      )
    )

    toast.add({
      title: 'Success',
      description: 'Selected teachers deleted successfully.',
      color: 'success'
    })

    selectedRows.value = {}
    await getTeachers()
  } catch (err: any) {
    console.log(err)
    toast.add({
      title: 'Error',
      description: err?.data?.error?.message || 'Failed to delete selected teachers.',
      color: 'error'
    })
  }
}

onMounted(() => {
  getTeachers()
  getSubjects()
})
</script>