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
        <UInput v-model="globalFilter" class="max-w-sm" icon="i-lucide-search" placeholder="Search..." />
        <div class="flex flex-wrap items-center gap-1.5">
          <UButton v-if="selectedCount > 0" label="Delete" color="error" variant="subtle" icon="i-lucide-trash"
            @click="deleteSelected">
            <template #trailing>
              <UKbd>{{ selectedCount }}</UKbd>
            </template>
          </UButton>
          <UButton label="New customer" icon="i-lucide-plus" @click="modal = !modal" />
          <UModal v-model:open="modal">
            <template #title>
              Modal with description
            </template>
            <template #body>
              <!-- <Placeholder class="h-48 m-4" /> -->
            </template>
          </UModal>
        </div>
      </div>
      <UTable ref="table" v-model:row-selection="rowSelection" v-model:global-filter="globalFilter"
        :data="paginatedData" :loading="loading" loading-color="primary" loading-animation="carousel" :columns="columns"
        class="shrink-0" :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0'
        }">

        <template #action-cell="{ row }">
          <UDropdownMenu :items="getDropdownActions(row.original)">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" aria-label="Actions" />
          </UDropdownMenu>
        </template>
      </UTable>
      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }}
          of
          {{ criteria.length }}
          row(s) selected.
        </div>
        <div class="flex items-center gap-1.5">
          <UPagination v-model:page="page" :total="criteria.length" :items-per-page="itemsPerPage" />
        </div>
      </div>


      <!-- MODAL -->
      <UModal v-model:open="editModal">
        <template #title>
          Edit Evaluation Criteria
        </template>
        <template #body>
          <UForm :state="state" class="space-y-4" @submit="updateCriteria">
            <UFormField label="Key" name="key">
              <UInput v-model="state.key" placeholder="Enter a key" class="w-full" size="xl" />
            </UFormField>
            <UFormField label="Label" name="label">
              <UInput v-model="state.label" placeholder="Enter a label" class="w-full" size="xl" />
            </UFormField>
            <UFormField label="Max Score" name="maxScore">
              <UInput v-model="state.maxScore" placeholder="Enter Max Score" class="w-full" size="xl" />
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

//@ts-nocheck
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Admin']
})

import type { DropdownMenuItem } from '@nuxt/ui';
import { useClipboard } from '@vueuse/core'

const { $api } = useNuxtApp();
const loading = ref(true)
const loadingUpdate = ref(false)
const modal = ref(false)
const editModal = ref(false)
const page = ref(1)
const itemsPerPage = 10
const criteria = ref([])
const key = ref(null)
const selected = ref<Record<string, boolean>>({})
const table = ref()
const rowSelection = ref({})
const toast = useToast()
const globalFilter = ref('')
const selectedId = ref({})
const { copy } = useClipboard()
type Schema = z.output<typeof schema>;
const state = reactive<Partial<Schema>>({
  key: undefined,
  label: undefined,
  maxScore: undefined
});


const columns = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsAllRowsSelected(),
        'onUpdate:modelValue': (value: boolean) =>
          table.toggleAllRowsSelected(!!value)
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean) =>
          row.toggleSelected(!!value)
      })
  },
  {
    id: 'id',
    header: 'ID',
    cell: ({ row }) => (page.value - 1) * itemsPerPage + row.index + 1
  },
  { accessorKey: 'key', header: 'Key' },
  { accessorKey: 'label', header: 'Label' },
  { accessorKey: 'maxScore', header: 'Max Score' },
  {
    accessorKey: 'createdAt', header: 'Created At',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }
  },
  {
    id: 'action'
  },
]

function getDropdownActions(user: User): DropdownMenuItem[][] {
  return [
    [
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
          selectedId.value = user.documentId
          console.log(user)
          state.key = user.key
          state.label = user.label
          state.maxScore = user.maxScore
          //copy(user.documentId)

        }
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error'
      }
    ]
  ]
}

// ------------------ Computer Properties ------------------------------
const paginatedData = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return criteria.value.slice(start, end)
})

const selectedCount = computed(() =>
  table.value?.tableApi?.getFilteredSelectedRowModel().rows.length || 0
)

// -------------------- API Fetch  / Functions --------------------

// fetch evaluation criteria
const getEvaluationCriteria = async () => {
  try {
    const res = await $api("/evaluation-criterias");
    criteria.value = res.data.sort((a, b) => a.id - b.id);
    loading.value = false
    //console.log(criteria.value)
  } catch (err) {
    console.log(err);
    loading.value = false
  }
};

// delete selected criteria
const deleteSelected = () => {
  const selectedRows =
    table.value?.tableApi?.getFilteredSelectedRowModel().rows || []

  const selectedIds = selectedRows.map(r => r.original.documentId)

  criteria.value = criteria.value.filter(
    row => !selectedIds.includes(row.documentId)
  )

  console.log("Selected Row: ", selectedIds)

  toast.add({
    title: 'Deleted Successfully',
    color: 'error',
    icon: 'i-lucide-circle-x'
  })
  // reset selection
  rowSelection.value = {}
}

// update criteria
const updateCriteria = async () => {
  loadingUpdate.value = true
  try {
    const payload = {
      data: {
        key: state.key,
        label: state.label,
        maxScore: state.maxScore
      }
    }
    const res = await $api(`/evaluation-criterias/${selectedId.value}`, {
      method: 'PUT',
      body: payload
    })
    toast.add({
      title: 'Updated Successfully',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    getEvaluationCriteria()
    loadingUpdate.value = false
    editModal.value = false
    console.log('Successfully updated!', res)
  } catch (err) {
    console.error(err)
    loadingUpdate.value = false
  }


}

onMounted(async () => {
  await getEvaluationCriteria();
});
</script>

<style></style>