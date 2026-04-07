<template>
 <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Scale Options</span>
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
          {{ scaleOptions.length }}
          row(s) selected.
        </div>
        <div class="flex items-center gap-1.5">
          <UPagination v-model:page="page" :total="scaleOptions.length" :items-per-page="itemsPerPage" />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>


//@ts-nocheck
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Admin']
})

const { $api } = useNuxtApp();
const modal = ref(false)
const loading = ref(true)
const scaleOptions = ref([]);
const page = ref(1)
const itemsPerPage = 10
const table = ref()
const globalFilter = ref('')
const rowSelection = ref({})
const toast = useToast()

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
  { accessorKey: 'label', header: 'Label' },
  { accessorKey: 'value', header: 'Value' },
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
  return scaleOptions.value.slice(start, end)
})

const selectedCount = computed(() => 
  table.value?.tableApi?.getFilteredSelectedRowModel().rows.length || 0
)

// -------------------- API Fetch  / Functions --------------------

// fetch scale options
const getScaleOptions = async () => {
  try {
    const res = await $api("/scale-options");
    scaleOptions.value= res.data.sort((a, b) => a.id - b.id);
    loading.value = false
  } catch (err) {
    console.error(err);
    loading.value = false
  }
}

// delete selected scale options
const deleteSelected = () => {
  const selectedRows =
    table.value?.tableApi?.getFilteredSelectedRowModel().rows || []

  const selectedIds = selectedRows.map(r => r.original.documentId)

  scaleOptions.value = scaleOptions.value.filter(
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

onMounted(async () => {
  await getScaleOptions();
})
</script>

<style>

</style>