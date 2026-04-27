<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Evaluation Section</span>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput v-model="globalFilter" class="max-w-sm" icon="i-lucide-search" placeholder="Search section..." />

        <div class="flex flex-wrap items-center gap-1.5">
          <UButton v-if="selectedCount > 0" label="Delete" color="error" variant="subtle" icon="i-lucide-trash"
            @click="deleteSelected">
            <template #trailing>
              <UKbd>{{ selectedCount }}</UKbd>
            </template>
          </UButton>

          <UButton label="New Section" icon="i-lucide-plus" @click="openCreateModal" />
        </div>
      </div>

      <div class="mt-4 overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="w-12 border border-gray-300 px-3 py-2 text-center"></th>
              <th class="w-24 border border-gray-300 px-4 py-2 text-center">Order</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Title</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Evaluation Type</th>
              <th class="w-20 border border-gray-300 px-4 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                Loading sections...
              </td>
            </tr>

            <tr v-else-if="paginatedSections.length === 0">
              <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                No evaluation sections found.
              </td>
            </tr>

            <tr v-for="row in paginatedSections" :key="row.documentId || row.id">
              <td class="w-12 border border-gray-300 px-3 py-1 text-center">
                <UCheckbox :model-value="isRowSelected(row)" @update:model-value="toggleRowSelection(row, !!$event)" />
              </td>

              <td class="w-24 border border-gray-300 px-4 py-1 text-center">
                {{ row.order }}
              </td>

              <td class="border border-gray-300 px-4 py-1">
                {{ row.title }}
              </td>
              <td class="border border-gray-300 px-4 py-1">
                {{ row.evaluation_type?.name || row.evaluation_type?.code || '—' }}
              </td>

              <td class="w-20 border border-gray-300 px-4 py-1 text-center">
                <UDropdownMenu :items="getDropdownActions(row)">
                  <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" aria-label="Actions" />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex items-center justify-between gap-3 border-t border-default pt-4">
        <div class="text-sm text-muted">
          {{ selectedCount }} of {{ filteredSections.length }} row(s) selected.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination v-model:page="page" :total="filteredSections.length" :items-per-page="itemsPerPage" />
        </div>
      </div>

      <UModal v-model:open="modal">
        <template #title>
          Add Evaluation Section
        </template>

        <template #body>
          <UForm :state="state" class="space-y-4" @submit="createSection">
            <UFormField label="Order" name="order">
              <UInput v-model="state.order" type="number" placeholder="Enter order" class="w-full" size="xl" />
            </UFormField>

            <UFormField label="Title" name="title">
              <UInput v-model="state.title" placeholder="Enter section title" class="w-full" size="xl" />
            </UFormField>

            <UFormField label="Evaluation Type" name="evaluation_type">
              <USelectMenu v-model="state.evaluation_type" :items="evaluationTypeOptions" value-key="value"
                placeholder="Select evaluation type" class="w-full" size="xl" />
            </UFormField>

            <UButton :label="loadingCreate ? 'Saving...' : 'Save'" :disabled="loadingCreate" type="submit" class="mt-3"
              size="lg" block />
          </UForm>
        </template>
      </UModal>

      <UModal v-model:open="editModal">
        <template #title>
          Edit Evaluation Section
        </template>

        <template #body>
          <UForm :state="state" class="space-y-4" @submit="updateSection">
            <UFormField label="Order" name="order">
              <UInput v-model="state.order" type="number" placeholder="Enter order" class="w-full" size="xl" />
            </UFormField>

            <UFormField label="Title" name="title">
              <UInput v-model="state.title" placeholder="Enter section title" class="w-full" size="xl" />
            </UFormField>

            <UFormField label="Evaluation Type" name="evaluation_type">
              <USelectMenu v-model="state.evaluation_type" :items="evaluationTypeOptions" value-key="value"
                placeholder="Select evaluation type" class="w-full" size="xl" />
            </UFormField>

            <UButton :label="loadingUpdate ? 'Updating...' : 'Update'" :disabled="loadingUpdate" type="submit"
              class="mt-3" size="lg" block />
          </UForm>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
// @ts-nocheck
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Admin']
})

const { $api } = useNuxtApp()
const toast = useToast()

const loading = ref(true)
const loadingCreate = ref(false)
const loadingUpdate = ref(false)

const modal = ref(false)
const editModal = ref(false)

const page = ref(1)
const itemsPerPage = 10

const sections = ref([])
const globalFilter = ref('')
const selectedId = ref(null)
const selectedRows = ref<Record<string | number, boolean>>({})
const evaluationTypes = ref([])

const state = reactive({
  title: undefined,
  order: undefined,
  evaluation_type: undefined
})

const filteredSections = computed(() => {
  const keyword = globalFilter.value?.toLowerCase()?.trim()

  if (!keyword) return sections.value

  return sections.value.filter((item: any) =>
    item.title?.toLowerCase().includes(keyword) ||
    String(item.order ?? '').includes(keyword)
  )
})

const paginatedSections = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredSections.value.slice(start, end)
})

const selectedCount = computed(() =>
  Object.values(selectedRows.value).filter(Boolean).length
)

const evaluationTypeOptions = computed(() =>
  evaluationTypes.value.map((type: any) => ({
    label: `${type.name || type.title || type.code}`,
    value: type.id
  }))
)

watch(globalFilter, () => {
  page.value = 1
})

function resetForm() {
  state.title = undefined
  state.order = undefined
  state.evaluation_type = undefined
}

function openCreateModal() {
  resetForm()
  modal.value = true
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
        editModal.value = true
        selectedId.value = row.documentId || row.id
        state.title = row.title
        state.order = row.order
        state.evaluation_type =
          row.evaluation_type?.id ||
          row.evaluation_type?.value ||
          undefined
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

const getEvaluationTypes = async () => {
  const res = await $api('/evaluation-types', {
    query: {
      'sort[0]': 'name:asc',
      'pagination[pageSize]': 100
    }
  })

  evaluationTypes.value = res.data || []
}

const getEvaluationSections = async () => {
  try {
    loading.value = true

    const res = await $api('/evaluation-sections', {
      query: {
        'populate[evaluation_type]': true,
        'sort[0]': 'order:asc',
        'pagination[pageSize]': 100
      }
    })

    sections.value = res.data
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const createSection = async () => {
  loadingCreate.value = true

  try {
    const payload = {
      data: {
        title: state.title,
        order: Number(state.order),
        evaluation_type: state.evaluation_type?.value || state.evaluation_type
      }
    }

    await $api('/evaluation-sections', {
      method: 'POST',
      body: payload
    })

    toast.add({
      title: 'Section created successfully',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    modal.value = false
    resetForm()
    await getEvaluationSections()
  } catch (err) {
    console.error(err)
  } finally {
    loadingCreate.value = false
  }
}

const updateSection = async () => {
  loadingUpdate.value = true

  try {
    const payload = {
      data: {
        title: state.title,
        order: Number(state.order),
        evaluation_type: state.evaluation_type?.value || state.evaluation_type
      }
    }

    await $api(`/evaluation-sections/${selectedId.value}`, {
      method: 'PUT',
      body: payload
    })

    toast.add({
      title: 'Section updated successfully',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    editModal.value = false
    resetForm()
    await getEvaluationSections()
  } catch (err) {
    console.error(err)
  } finally {
    loadingUpdate.value = false
  }
}

const deleteOne = async (row: any) => {
  try {
    await $api(`/evaluation-sections/${row.documentId || row.id}`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Section deleted successfully',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })

    delete selectedRows.value[row.documentId || row.id]
    await getEvaluationSections()
  } catch (err) {
    console.error(err)
  }
}

const deleteSelected = async () => {
  const selectedItems = sections.value.filter(
    (item: any) => selectedRows.value[item.documentId || item.id]
  )

  try {
    await Promise.all(
      selectedItems.map((item: any) =>
        $api(`/evaluation-sections/${item.documentId || item.id}`, {
          method: 'DELETE'
        })
      )
    )

    toast.add({
      title: 'Selected sections deleted successfully',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })

    selectedRows.value = {}
    await getEvaluationSections()
  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
  await Promise.all([
    getEvaluationTypes(),
    getEvaluationSections()
  ])
})
</script>

<style></style>