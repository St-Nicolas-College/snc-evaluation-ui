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
      <!-- <UTable ref="table" v-model:row-selection="rowSelection" v-model:global-filter="globalFilter"
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
      </UTable> -->

      <!-- <UTable :data="tableRows" :columns="columns" :loading="loading">
        <template #order-cell="{ row }">
          <div v-if="row.original?.type === 'section'" class="font-bold text-transparent select-none">
            -
          </div>
          <div v-else>
            {{ row.original?.order }}
          </div>
        </template>
        <template #statement-cell="{ row }">
          <div v-if="row.original?.type === 'section'" class="font-bold bg-gray-100 px-2 py-2 rounded">
            {{ row.original?.title }}
          </div>

          <div v-else>
            {{ row.original?.statement }}
          </div>
        </template>
      </UTable> -->

      <div class="overflow-x-auto">
  <table class="w-full border-collapse border border-gray-300">
    <tbody>
      <template v-for="row in tableRows" :key="row.id">
        <!-- spacer -->
        <tr v-if="row.type === 'spacer'">
          <td colspan="2" class="h-4 border-0 bg-transparent"></td>
        </tr>

        <!-- section header -->
        <tr v-else-if="row.type === 'section'">
          <td
            colspan="2"
            class="bg-gray-100 px-4 py-3 font-bold text-gray-700 border border-gray-300"
          >
            {{ row.title }}
          </td>
        </tr>

        <!-- criterion row -->
        <tr v-else>
          <td class="w-12 border border-gray-300 px-4 py-3 text-center align-top">
            {{ row.order }}
          </td>
          <td class="border border-gray-300 px-4 py-3 align-top">
            {{ row.statement }}
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</div>

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


// const columns = [
//   {
//     id: 'select',
//     header: ({ table }) =>
//       h(UCheckbox, {
//         modelValue: table.getIsAllRowsSelected(),
//         'onUpdate:modelValue': (value: boolean) =>
//           table.toggleAllRowsSelected(!!value)
//       }),
//     cell: ({ row }) =>
//       h(UCheckbox, {
//         modelValue: row.getIsSelected(),
//         'onUpdate:modelValue': (value: boolean) =>
//           row.toggleSelected(!!value)
//       })
//   },
//   {
//     id: 'id',
//     header: 'ID',
//     cell: ({ row }) => (page.value - 1) * itemsPerPage + row.index + 1
//   },
//   { accessorKey: 'statement', header: 'Statement' },
//   { accessorKey: 'order', header: 'Order' },
//   // { accessorKey: 'maxScore', header: 'Max Score' },
//   {
//     accessorKey: 'createdAt', header: 'Created At',
//     cell: ({ row }) => {
//       return new Date(row.getValue('createdAt')).toLocaleString('en-US', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//       })
//     }
//   },
//   {
//     id: 'action'
//   },
// ]

const columns = [
  {
    accessorKey: "order",
    header: "#"
  },
  {
    accessorKey: "statement",
    header: "Evaluation Criteria"
  }
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

// Grouped criteria
const groupedCriteria = computed(() => {
  const grouped = criteria.value.reduce((acc: any, item: any) => {
    const sectionId = item.section?.id;

    if (!sectionId) return acc;

    if (!acc[sectionId]) {
      acc[sectionId] = {
        id: item.section.id,
        title: item.section.title,
        order: item.section.order,
        evaluation_criteria: []
      };
    }

    acc[sectionId].evaluation_criteria.push(item);
    return acc;
  }, {});

  return Object.values(grouped)
    .sort((a: any, b: any) => a.order - b.order)
    .map((section: any) => ({
      ...section,
      evaluation_criteria: section.evaluation_criteria.sort(
        (a: any, b: any) => a.order - b.order
      )
    }));
})

const tableRows = computed(() => {
  const rows: any[] = []

  groupedCriteria.value.forEach((section: any) => {
    rows.push({
      type: 'section',
      id: `section-${section.id}`,
      title: section.title
    })

    section.evaluation_criteria.forEach((criterion: any) => {
      rows.push({
        type: "criterion",
        id: criterion.id,
        order: criterion.order,
        statement: criterion.statement,
        sectionTitle: section.title
      })
    });
  })

  return rows
})

watch(tableRows, (val) => {
  console.log("tableRows:", val)
})

// -------------------- API Fetch  / Functions --------------------

// fetch evaluation criteria
const getEvaluationCriteria = async () => {
  try {
    const res = await $api("/evaluation-criterias", {
      query: {
        populate: "section",
        pagination: {
          pageSize: 100
        }
      }
    });
    //criteria.value = res.data.sort((a, b) => a.id - b.id);
    criteria.value = res.data
    console.log("List of criteria: ", criteria.value)
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