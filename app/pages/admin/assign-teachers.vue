<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #title>
          <span class="text-sm text-gray-500 uppercase">
            Assign Teachers to Student
          </span>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto max-w-5xl space-y-6">
        <UCard>
          <template #header>
            <div class="font-semibold text-lg">
              Student Teacher Assignment
            </div>
          </template>

          <div class="space-y-5">
            <UFormField label="Select Student">
              <USelectMenu
                v-model="selectedStudentId"
                :items="studentOptions"
                value-key="value"
                placeholder="Choose student"
                class="w-full"
              />
            </UFormField>

            <div v-if="selectedStudent" class="rounded-lg border border-gray-300 p-4">
              <div class="font-semibold">
                {{ selectedStudent.name }}
              </div>
              <div class="text-sm text-gray-500">
                {{ selectedStudent.student_id }} |
                {{ selectedStudent.course }} |
                {{ selectedStudent.year_level }} |
                {{ selectedStudent.section }}
              </div>
            </div>

            <div v-if="selectedStudentId" class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="font-bold">
                  Assign Teacher(s)
                </div>

                <div class="text-sm text-gray-500">
                  {{ selectedTeacherIds.length }} selected
                </div>
              </div>

              <UCheckboxGroup
                v-model="selectedTeacherIds"
                value-key="value"
                :items="teacherOptions"
                :ui="{
                  fieldset: 'grid grid-cols-1 gap-3 md:grid-cols-2',
                  item: 'rounded-lg border border-gray-300 p-4 hover:border-primary-500 transition'
                }"
              >
                <template #label="{ item }">
                  <div class="flex flex-col">
                    <span class="font-medium">{{ item.label }}</span>
                    <span v-if="item.description" class="text-xs text-gray-500">
                      {{ item.description }}
                    </span>
                  </div>
                </template>
              </UCheckboxGroup>
            </div>

            <div v-else class="rounded-lg border border-gray-300 p-6 text-center text-gray-500">
              Please select a student first.
            </div>

            <div class="flex justify-end gap-2">
              <UButton
                color="neutral"
                variant="outline"
                @click="resetSelection"
              >
                Reset
              </UButton>

              <UButton
                :loading="saving"
                :disabled="!selectedStudentId"
                @click="saveAssignedTeachers"
              >
                Save Assigned Teachers
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
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

const loading = ref(false)
const saving = ref(false)

const students = ref([])
const teachers = ref([])

const selectedStudentId = ref(null)
const selectedTeacherIds = ref([])

const studentOptions = computed(() =>
  students.value.map((student: any) => ({
    label: `${student.name} (${student.student_id})`,
    value: student.documentId
  }))
)

const teacherOptions = computed(() =>
  teachers.value.map((teacher: any) => ({
    label: teacher.name,
    description: teacher.department || teacher.user?.role?.name || '',
    value: teacher.documentId
  }))
)

const selectedStudent = computed(() =>
  students.value.find((student: any) => student.documentId === selectedStudentId.value)
)

const getStudents = async () => {
  const res = await $api('/students', {
    query: {
      'populate[assigned_teachers]': true,
      'sort[0]': 'name:asc',
      'pagination[pageSize]': 200
    }
  })

  students.value = res.data || []
}

const getTeachers = async () => {
  const res = await $api('/teachers', {
    query: {
      'populate[user][populate]': 'role',
      'sort[0]': 'name:asc',
      'pagination[pageSize]': 200
    }
  })

  teachers.value = res.data || []
}

watch(selectedStudentId, (documentId) => {
  const student = students.value.find((item: any) => item.documentId === documentId)

  selectedTeacherIds.value =
    student?.assigned_teachers?.map((teacher: any) => teacher.documentId) || []
})

const saveAssignedTeachers = async () => {
  if (!selectedStudentId.value) return

  try {
    saving.value = true

    await $api(`/students/${selectedStudentId.value}`, {
      method: 'PUT',
      body: {
        data: {
          assigned_teachers: {
            set: selectedTeacherIds.value
          }
        }
      }
    })

    toast.add({
      title: 'Success',
      description: 'Teachers assigned successfully.',
      color: 'success'
    })

    await getStudents()
  } catch (err: any) {
    console.log(err)

    toast.add({
      title: 'Error',
      description: err?.data?.error?.message || 'Failed to assign teachers.',
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}

const resetSelection = () => {
  selectedStudentId.value = null
  selectedTeacherIds.value = []
}

onMounted(async () => {
  try {
    loading.value = true

    await Promise.all([
      getStudents(),
      getTeachers()
    ])
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
})
</script>

<style>

</style>