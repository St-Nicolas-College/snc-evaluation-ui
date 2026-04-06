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
          <UButton label="New customer" icon="i-lucide-plus" />
        </div>
      </div>
      <UTable ref="table" v-model:row-selection="rowSelection" v-model:global-filter="globalFilter" :data="paginatedData" :loading="loading"
        loading-color="primary" loading-animation="carousel" :columns="columns" class="shrink-0" :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0'
        }" />
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


    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>

//@ts-nocheck
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Admin']
})

import { useClipboard } from '@vueuse/core'

const { $api } = useNuxtApp();
const loading = ref(true)
const page = ref(1)
const itemsPerPage = 10
const criteria = ref([])
const key = ref(null)
const selected = ref<Record<string, boolean>>({})
const table = ref()
const rowSelection = ref({})
const toast = useToast()
const globalFilter = ref('')
const { copy } = useClipboard()

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
    id: 'actions',
    meta: {
      class: {
        td: 'text-right'
      }
    },
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          content: {
            align: 'end'
          },
          items: getRowItems(row),
          'arial-label': 'Actions dropdown'
        },
        () =>
          h(UButton, {
            icon: 'i-lucide-ellipsis-vertical',
            color: 'neutral',
            variant: 'ghost',
            'arial-label': 'Actions dropdown'
          })
      )
    }
  }
]

const paginatedData = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return criteria.value.slice(start, end)
})

const selectedCount = computed(() =>
  table.value?.tableApi?.getFilteredSelectedRowModel().rows.length || 0
)

// -------------------- API Fetch  / Functions --------------------

function getRowItems(row: Row<Payment>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Copy payment ID',
      onSelect() {
        copy(row.original.id)

        toast.add({
          title: 'Payment ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'View customer'
    },
    {
      label: 'View payment details'
    }
  ]
}

const getEvaluationCriteria = async () => {
  try {
    const res = await $api("/evaluation-criterias");
    criteria.value = res.data;
    loading.value = false
    //console.log(criteria.value)
  } catch (err) {
    console.log(err);
    loading.value = false
  }
};

const deleteSelected = () => {
  const selectedRows =
    table.value?.tableApi?.getFilteredSelectedRowModel().rows || []

  const selectedIds = selectedRows.map(r => r.original.id)

  criteria.value = criteria.value.filter(
    row => !selectedIds.includes(row.id)
  )

  // reset selection
  rowSelection.value = {}
}

onMounted(async () => {
  await getEvaluationCriteria();
});
</script>

<style></style>