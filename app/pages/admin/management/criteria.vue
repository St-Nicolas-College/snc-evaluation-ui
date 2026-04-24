<template>
   <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Evaluation Criteria</span>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          v-model="globalFilter"
          class="max-w-sm"
          icon="i-lucide-search"
          placeholder="Search..."
        />

        <div class="flex flex-wrap items-center gap-1.5">
          <UButton
            v-if="selectedCount > 0"
            label="Delete"
            color="error"
            variant="subtle"
            icon="i-lucide-trash"
            @click="deleteSelected"
          >
            <template #trailing>
              <UKbd>{{ selectedCount }}</UKbd>
            </template>
          </UButton>

          <UButton
            label="New Criteria"
            icon="i-lucide-plus"
            @click="openCreateModal"
          />

          <UModal v-model:open="modal">
            <template #title>
              Add Evaluation Criteria
            </template>

            <template #body>
              <UForm :state="state" class="space-y-4" @submit="createCriteria">
                <UFormField label="Section" name="section">
                  <USelectMenu
                    v-model="state.section"
                    :items="sectionOptions"
                    value-key="value"
                    placeholder="Select evaluation section"
                    class="w-full"
                    size="xl"
                  />
                </UFormField>

                <UFormField label="Order" name="order">
                  <UInput
                    v-model="state.order"
                    type="number"
                    placeholder="Enter order"
                    class="w-full"
                    size="xl"
                  />
                </UFormField>

                <UFormField label="Statement" name="statement">
                  <UTextarea
                    v-model="state.statement"
                    placeholder="Enter evaluation statement"
                    class="w-full"
                    :rows="4"
                  />
                </UFormField>

                <UButton
                  :label="loadingCreate ? 'Saving...' : 'Save'"
                  :disabled="loadingCreate"
                  type="submit"
                  class="mt-3"
                  size="lg"
                  block
                />
              </UForm>
            </template>
          </UModal>
        </div>
      </div>

      <div class="mt-4 overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <tbody>
            <template
             v-for="(row, index) in tableRows"
              :key="`${row.type}-${row.id}-${index}`"
            >
              <tr v-if="row.type === 'spacer'">
                <td colspan="4" class="h-4 border-0 bg-transparent"></td>
              </tr>

              <tr v-else-if="row.type === 'section'">
                <td
                  colspan="4"
                  class="border border-gray-300 bg-gray-100 px-4 py-2 font-bold text-gray-700"
                >
                  {{ row.title }}
                </td>
              </tr>

              <tr v-else>
                <td class="w-12 border border-gray-300 px-3 py-1 text-center">
                  <UCheckbox
                    :model-value="isRowSelected(row)"
                    @update:model-value="toggleRowSelection(row, !!$event)"
                  />
                </td>

                <td class="w-16 border border-gray-300 px-4 py-1 text-center align-top">
                  {{ row.order }}
                </td>

                <td class="border border-gray-300 px-4 py-1 align-top">
                  {{ row.statement }}
                </td>

                <td class="w-20 border border-gray-300 px-4 py-1 text-center">
                  <UDropdownMenu :items="getDropdownActions(row)">
                    <UButton
                      icon="i-lucide-ellipsis-vertical"
                      color="neutral"
                      variant="ghost"
                      aria-label="Actions"
                    />
                  </UDropdownMenu>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex items-center justify-between gap-3 border-t border-default pt-4">
        <div class="text-sm text-muted">
          {{ selectedCount }} of {{ filteredCriteriaRows.length }} row(s) selected.
        </div>

        <!-- <div class="flex items-center gap-1.5">
          <UPagination
            v-model:page="page"
            :total="filteredCriteriaRows.length"
            :items-per-page="itemsPerPage"
          />
        </div> -->
      </div>

      <UModal v-model:open="editModal">
        <template #title>
          Edit Evaluation Criteria
        </template>

        <template #body>
          <UForm :state="state" class="space-y-4" @submit="updateCriteria">
            <UFormField label="Section" name="section">
              <USelectMenu
                v-model="state.section"
                :items="sectionOptions"
                value-key="value"
                placeholder="Select evaluation section"
                class="w-full"
                size="xl"
              />
            </UFormField>

            <UFormField label="Order" name="order">
              <UInput
                v-model="state.order"
                type="number"
                placeholder="Enter order"
                class="w-full"
                size="xl"
              />
            </UFormField>

            <UFormField label="Statement" name="statement">
              <UTextarea
                v-model="state.statement"
                placeholder="Enter evaluation statement"
                class="w-full"
                :rows="4"
              />
            </UFormField>

            <UButton
              :label="loadingUpdate ? 'Updating...' : 'Update'"
              :disabled="loadingUpdate"
              type="submit"
              class="mt-3"
              size="lg"
              block
            />
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

import type { DropdownMenuItem } from '@nuxt/ui'

const { $api } = useNuxtApp()
const toast = useToast()

const loading = ref(true)
const loadingCreate = ref(false)
const loadingUpdate = ref(false)

const modal = ref(false)
const editModal = ref(false)

const criteria = ref([])
const sections = ref([])

const globalFilter = ref('')
const selectedId = ref(null)
const selectedRows = ref<Record<string, boolean>>({})

const state = reactive({
  statement: undefined,
  order: undefined,
  section: undefined
})

const sectionOptions = computed(() =>
  sections.value.map((section: any) => ({
    label: section.title,
    value: section.id
  }))
)

const groupedCriteria = computed(() => {
  const grouped = criteria.value.reduce((acc: any, item: any) => {
    const sectionId = item?.section?.id
    if (!sectionId) return acc

    if (!acc[sectionId]) {
      acc[sectionId] = {
        id: item.section.id,
        title: item.section.title,
        order: item.section.order ?? 0,
        evaluation_criteria: []
      }
    }

    acc[sectionId].evaluation_criteria.push(item)
    return acc
  }, {})

  return Object.values(grouped)
    .sort((a: any, b: any) => a.order - b.order)
    .map((section: any) => ({
      ...section,
      evaluation_criteria: section.evaluation_criteria.sort(
        (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)
      )
    }))
})

const filteredGroupedCriteria = computed(() => {
  const keyword = globalFilter.value?.toLowerCase()?.trim()
  if (!keyword) return groupedCriteria.value

  return groupedCriteria.value
    .map((section: any) => {
      const matched = section.evaluation_criteria.filter((criterion: any) =>
        criterion.statement?.toLowerCase().includes(keyword) ||
        section.title?.toLowerCase().includes(keyword) ||
        String(criterion.order ?? '').includes(keyword)
      )

      return {
        ...section,
        evaluation_criteria: matched
      }
    })
    .filter((section: any) => section.evaluation_criteria.length > 0)
})

const filteredCriteriaRows = computed(() =>
  filteredGroupedCriteria.value.flatMap((section: any) =>
    section.evaluation_criteria.map((criterion: any) => ({
      ...criterion,
      sectionTitle: section.title,
      sectionOrder: section.order
    }))
  )
)


const tableRows = computed(() => {
  if (!filteredCriteriaRows.value.length) return []

  const grouped = filteredCriteriaRows.value.reduce((acc: any, item: any) => {
    const sectionId = item.section?.id
    if (!sectionId) return acc

    if (!acc[sectionId]) {
      acc[sectionId] = {
        id: item.section.id,
        title: item.section.title,
        order: item.section.order ?? 0,
        items: []
      }
    }

    acc[sectionId].items.push(item)
    return acc
  }, {})

  const rows: any[] = []

  Object.values(grouped)
    .sort((a: any, b: any) => a.order - b.order)
    .forEach((section: any, index: number) => {
      if (index > 0) {
        rows.push({
          type: 'spacer',
          id: `spacer-${section.id}-${index}`
        })
      }

      rows.push({
        type: 'section',
        id: `section-${section.id}`,
        title: section.title
      })

      section.items
        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
        .forEach((criterion: any) => {
          rows.push({
            type: 'criterion',
            id: criterion.id,
            documentId: criterion.documentId,
            order: criterion.order,
            statement: criterion.statement,
            section: criterion.section
          })
        })
    })

  return rows
})

const selectedCount = computed(() =>
  Object.values(selectedRows.value).filter(Boolean).length
)

function resetForm() {
  state.statement = undefined
  state.order = undefined
  state.section = undefined
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
        state.statement = row.statement
        state.order = row.order
        state.section = row.section?.id || undefined
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

const getEvaluationSections = async () => {
  try {
    const res = await $api('/evaluation-sections', {
      query: {
        sort: ['order:asc'],
        pagination: {
          pageSize: 100
        }
      }
    })

    sections.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const getEvaluationCriteria = async () => {
  try {
    const res = await $api('/evaluation-criterias/list', {
      query: {
        populate: 'section',
        pagination: {
          pageSize: 100
        }
      }
    })

    criteria.value = res.data
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const createCriteria = async () => {
  loadingCreate.value = true

  try {
    const payload = {
      data: {
        statement: state.statement,
        order: Number(state.order),
        section: state.section
      }
    }

    await $api('/evaluation-criterias', {
      method: 'POST',
      body: payload
    })

    toast.add({
      title: 'Created Successfully',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    modal.value = false
    resetForm()
    await getEvaluationCriteria()
  } catch (err) {
    console.error(err)
  } finally {
    loadingCreate.value = false
  }
}

const updateCriteria = async () => {
  loadingUpdate.value = true

  try {
    const payload = {
      data: {
        statement: state.statement,
        order: Number(state.order),
        section: state.section
      }
    }

    await $api(`/evaluation-criterias/${selectedId.value}`, {
      method: 'PUT',
      body: payload
    })

    toast.add({
      title: 'Updated Successfully',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    editModal.value = false
    resetForm()
    await getEvaluationCriteria()
  } catch (err) {
    console.error(err)
  } finally {
    loadingUpdate.value = false
  }
}

const deleteOne = async (row: any) => {
  try {
    await $api(`/evaluation-criterias/${row.documentId || row.id}`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Deleted Successfully',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })

    delete selectedRows.value[row.documentId || row.id]
    await getEvaluationCriteria()
  } catch (err) {
    console.error(err)
  }
}

const deleteSelected = async () => {
  const selectedItems = criteria.value.filter(
    (item: any) => selectedRows.value[item.documentId || item.id]
  )

  try {
    await Promise.all(
      selectedItems.map((item: any) =>
        $api(`/evaluation-criterias/${item.documentId || item.id}`, {
          method: 'DELETE'
        })
      )
    )

    toast.add({
      title: 'Deleted Successfully',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })

    selectedRows.value = {}
    await getEvaluationCriteria()
  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([
    getEvaluationSections(),
    getEvaluationCriteria()
  ])
})
</script>

<style></style>