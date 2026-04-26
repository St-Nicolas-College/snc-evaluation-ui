<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Subject Management</span>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <UInput v-model="globalFilter" icon="i-lucide-search" placeholder="Search subject..." class="max-w-sm" />

        <UButton label="New Subject" icon="i-lucide-plus" @click="openCreateModal" />
      </div>

      <div class="mt-4 overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-3 text-left">Code</th>
              <th class="border border-gray-300 px-4 py-3 text-left">Name</th>
              <th class="border border-gray-300 px-4 py-3 text-left">Course</th>
              <th class="w-20 border border-gray-300 px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="3" class="px-4 py-4 text-center text-gray-500">
                Loading subjects...
              </td>
            </tr>

            <tr v-else-if="filteredSubjects.length === 0">
              <td colspan="3" class="px-4 py-4 text-center text-gray-500">
                No subjects found.
              </td>
            </tr>

            <tr v-for="subject in filteredSubjects" :key="subject.documentId">
              <td class="border border-gray-300 px-4 py-1">
                {{ subject.code || '-' }}
              </td>

              <td class="border border-gray-300 px-4 py-1">
                {{ subject.name }}
              </td>
              <td class="border border-gray-300 px-4 py-1">
                {{ subject.course?.name || '-' }}
              </td>

              <td class="border border-gray-300 px-4 py-1 text-center">
                <UDropdownMenu :items="getDropdownActions(subject)">
                  <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create Modal -->
      <UModal v-model:open="createModal">
        <template #title>
          Add Subject
        </template>

        <template #body>
          <UForm :state="createForm" class="space-y-4" @submit="createSubject">
            <UFormField label="Subject Code">
              <UInput v-model="createForm.code" class="w-full" placeholder="Example: IT101" />
            </UFormField>

            <UFormField label="Subject Name">
              <UInput v-model="createForm.name" class="w-full" placeholder="Example: Programming 1" />
            </UFormField>
            <UFormField label="Course">
              <USelectMenu v-model="createForm.course" :items="courseOptions" value-key="value"
                placeholder="Select course" class="w-full" />
            </UFormField>

            <div class="flex justify-end">
              <UButton :loading="loadingCreate" type="submit" label="Save" class="w-32 justify-center" />
            </div>
          </UForm>
        </template>
      </UModal>

      <!-- Edit Modal -->
      <UModal v-model:open="editModal">
        <template #title>
          Edit Subject
        </template>

        <template #body>
          <UForm :state="editForm" class="space-y-4" @submit="updateSubject">
            <UFormField label="Subject Code">
              <UInput v-model="editForm.code" class="w-full" />
            </UFormField>

            <UFormField label="Subject Name">
              <UInput v-model="editForm.name" class="w-full" />
            </UFormField>

            <UFormField label="Course">
              <USelectMenu v-model="editForm.course" :items="courseOptions" value-key="value"
                placeholder="Select course" class="w-full" />
            </UFormField>
            <div class="flex justify-end">
              <UButton :loading="loadingUpdate" type="submit" label="Update" class="w-32 justify-center" />
            </div>
          </UForm>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
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

const loading = ref(false)
const loadingCreate = ref(false)
const loadingUpdate = ref(false)

const createModal = ref(false)
const editModal = ref(false)

const subjects = ref([])
const selectedSubjectId = ref('')
const globalFilter = ref('')
const courses = ref([])

const createForm = reactive({
  code: '',
  name: '',
  course: null
})

const editForm = reactive({
  code: '',
  name: '',
  course: null
})

const filteredSubjects = computed(() => {
  const keyword = globalFilter.value.toLowerCase().trim()

  if (!keyword) return subjects.value

  return subjects.value.filter((subject: any) =>
    subject.code?.toLowerCase().includes(keyword) ||
    subject.name?.toLowerCase().includes(keyword)
  )
})

const resetCreateForm = () => {
  createForm.code = ''
  createForm.name = ''
}

const resetEditForm = () => {
  editForm.code = ''
  editForm.name = ''
}

const openCreateModal = () => {
  resetCreateForm()
  createModal.value = true
}


const courseOptions = computed(() =>
  courses.value.map((c: any) => ({
    label: `${c.name} (${c.department?.name || 'No Dept'})`,
    value: c.id
  }))
)

const getCourses = async () => {
  const res = await $api('/courses', {
    query: {
      'populate[department]': true,
      'sort[0]': 'name:asc',
      'pagination[pageSize]': 200
    }
  })

  courses.value = res.data || []
}

const getSubjects = async () => {
  try {
    loading.value = true

    const res = await $api('/subjects', {
      query: {
        'populate[course][populate][0]': 'department',
        'sort[0]': 'name:asc',
        'pagination[pageSize]': 200
      }
    })

    subjects.value = res.data || []
  } catch (err) {
    console.log(err)

    toast.add({
      title: 'Error',
      description: 'Failed to load subjects.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const createSubject = async () => {
  if (!createForm.name) {
    toast.add({
      title: 'Error',
      description: 'Subject name is required.',
      color: 'error'
    })
    return
  }

  try {
    loadingCreate.value = true

    await $api('/subjects', {
      method: 'POST',
      body: {
        data: {
          code: createForm.code,
          name: createForm.name,
          course: createForm.course
        }
      }
    })

    toast.add({
      title: 'Success',
      description: 'Subject created successfully.',
      color: 'success'
    })

    createModal.value = false
    resetCreateForm()
    await getSubjects()
  } catch (err: any) {
    console.log(err)

    toast.add({
      title: 'Error',
      description: err?.data?.error?.message || 'Failed to create subject.',
      color: 'error'
    })
  } finally {
    loadingCreate.value = false
  }
}

const updateSubject = async () => {
  if (!editForm.name) {
    toast.add({
      title: 'Error',
      description: 'Subject name is required.',
      color: 'error'
    })
    return
  }

  try {
    loadingUpdate.value = true

    await $api(`/subjects/${selectedSubjectId.value}`, {
      method: 'PUT',
      body: {
        data: {
          code: editForm.code,
          name: editForm.name,
          course: editForm.course
        }
      }
    })

    toast.add({
      title: 'Success',
      description: 'Subject updated successfully.',
      color: 'success'
    })

    editModal.value = false
    resetEditForm()
    await getSubjects()
  } catch (err: any) {
    console.log(err)

    toast.add({
      title: 'Error',
      description: err?.data?.error?.message || 'Failed to update subject.',
      color: 'error'
    })
  } finally {
    loadingUpdate.value = false
  }
}

const deleteSubject = async (subject: any) => {
  try {
    await $api(`/subjects/${subject.documentId}`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Success',
      description: 'Subject deleted successfully.',
      color: 'success'
    })

    await getSubjects()
  } catch (err: any) {
    console.log(err)

    toast.add({
      title: 'Error',
      description: err?.data?.error?.message || 'Failed to delete subject.',
      color: 'error'
    })
  }
}

const getDropdownActions = (subject: any): DropdownMenuItem[][] => {
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
        selectedSubjectId.value = subject.documentId
        editForm.code = subject.code || ''
        editForm.name = subject.name || ''
        editForm.course = subject.course?.id || null
        editModal.value = true
      }
    },
    {
      label: 'Delete',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        deleteSubject(subject)
      }
    }
  ]]
}

onMounted(() => {
  getSubjects()
  getCourses()
})
</script>