<template>
  <div class="space-y-6 pb-8">
    <!-- HERO -->
    <section
      class="relative overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-5 py-6 text-white shadow-xl shadow-blue-900/10 sm:px-7 sm:py-7"
    >
      <div class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-violet-300/15 blur-3xl" />

      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex min-w-0 items-start gap-4">
          <div
            class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex"
          >
            <UIcon name="i-lucide-graduation-cap" class="size-7" />
          </div>

          <div class="min-w-0">
            <div class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-blue-50">
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur">
                Administrator Portal
              </span>

              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur">
                Student Management
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Student Management
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-blue-50/90">
              Register student accounts, maintain academic information, and
              manage assigned faculty members.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">{{ summary.total }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-blue-100">
              Students
            </p>
          </div>

          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">{{ summary.courses }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-blue-100">
              Courses
            </p>
          </div>

          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">{{ summary.assignments }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-blue-100">
              Assignments
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- KPI CARDS -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Students"
        :value="summary.total"
        icon="i-lucide-users-round"
        tone="blue"
      />

      <StatCard
        label="Represented Courses"
        :value="summary.courses"
        icon="i-lucide-book-copy"
        tone="violet"
      />

      <StatCard
        label="Sections"
        :value="summary.sections"
        icon="i-lucide-panels-top-left"
        tone="emerald"
      />

      <StatCard
        label="Teacher Assignments"
        :value="summary.assignments"
        icon="i-lucide-user-round-check"
        tone="amber"
      />
    </section>

    <!-- TOOLBAR -->
    <section
      class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div class="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <UInput
            v-model="globalFilter"
            icon="i-lucide-search"
            placeholder="Search student, ID, email..."
            class="w-full"
          />

          <USelectMenu
            v-model="selectedCourse"
            :items="courseFilterOptions"
            value-key="value"
            class="w-full"
          />

          <USelectMenu
            v-model="selectedYearLevel"
            :items="yearLevelFilterOptions"
            value-key="value"
            class="w-full"
          />

          <USelectMenu
            v-model="selectedSection"
            :items="sectionFilterOptions"
            value-key="value"
            class="w-full"
          />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <UButton
            v-if="selectedCount > 0"
            color="error"
            variant="soft"
            icon="i-lucide-trash-2"
            @click="requestDeleteSelected"
          >
            Delete Selected

            <template #trailing>
              <UKbd>{{ selectedCount }}</UKbd>
            </template>
          </UButton>

          <UButton icon="i-lucide-plus" @click="openCreateModal">
            New Student
          </UButton>
        </div>
      </div>

      <div
        v-if="hasActiveFilters"
        class="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-800"
      >
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
          Active filters:
        </span>

        <UBadge v-if="globalFilter" color="neutral" variant="subtle">
          Search: {{ globalFilter }}
        </UBadge>

        <UBadge v-if="selectedCourse !== 'all'" color="primary" variant="subtle">
          {{ selectedCourseLabel }}
        </UBadge>

        <UBadge v-if="selectedYearLevel !== 'all'" color="success" variant="subtle">
          {{ selectedYearLevel }}
        </UBadge>

        <UBadge v-if="selectedSection !== 'all'" color="warning" variant="subtle">
          {{ selectedSection }}
        </UBadge>

        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          @click="clearFilters"
        >
          Clear filters
        </UButton>
      </div>
    </section>

    <!-- TABLE -->
    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Student Directory
          </h2>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Showing {{ filteredStudents.length }} of {{ students.length }}
            student{{ students.length === 1 ? '' : 's' }}.
          </p>
        </div>

        <USelect
          v-model="itemsPerPage"
          :items="pageSizeOptions"
          class="w-full sm:w-32"
        />
      </div>

      <div v-if="loading" class="space-y-3 p-5">
        <USkeleton v-for="index in 6" :key="index" class="h-14 w-full rounded-xl" />
      </div>

      <div v-else-if="loadError" class="px-6 py-14 text-center">
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
        >
          <UIcon name="i-lucide-triangle-alert" class="size-7" />
        </div>

        <h3 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
          Unable to load students
        </h3>

        <p class="mx-auto mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400">
          {{ loadError }}
        </p>

        <UButton class="mt-5" icon="i-lucide-refresh-cw" @click="getStudents">
          Try Again
        </UButton>
      </div>

      <div v-else-if="!filteredStudents.length" class="px-6 py-16 text-center">
        <div
          class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
        >
          <UIcon
            :name="students.length ? 'i-lucide-search-x' : 'i-lucide-graduation-cap'"
            class="size-8"
          />
        </div>

        <h3 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
          {{ students.length ? 'No matching students found' : 'No student records yet' }}
        </h3>

        <p class="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
          {{
            students.length
              ? 'Try changing or clearing the current filters.'
              : 'Create the first student account to begin managing enrolment records.'
          }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[1080px] text-sm">
          <thead
            class="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40 dark:text-gray-400"
          >
            <tr>
              <th class="w-12 px-4 py-3 text-center">
                <UCheckbox
                  :model-value="isCurrentPageSelected"
                  :indeterminate="isCurrentPagePartiallySelected"
                  @update:model-value="toggleCurrentPageSelection(!!$event)"
                />
              </th>

              <th class="px-4 py-3 text-left">Student ID</th>
              <th class="px-4 py-3 text-left">Student</th>
              <th class="px-4 py-3 text-left">Course</th>
              <th class="px-4 py-3 text-left">Year Level</th>
              <th class="px-4 py-3 text-left">Section</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-center">Teachers</th>
              <th class="w-20 px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="student in paginatedStudents"
              :key="getStudentKey(student)"
              class="transition hover:bg-gray-50/80 dark:hover:bg-gray-950/30"
            >
              <td class="px-4 py-4 text-center">
                <UCheckbox
                  :model-value="isRowSelected(student)"
                  @update:model-value="toggleRowSelection(student, !!$event)"
                />
              </td>

              <td class="px-4 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">
                {{ student.student_id || '—' }}
              </td>

              <td class="px-4 py-4">
                <div class="flex min-w-0 items-center gap-3">
                  <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm"
                  >
                    {{ createInitials(student.name) }}
                  </div>

                  <div class="min-w-0">
                    <p class="truncate font-bold text-gray-900 dark:text-white">
                      {{ student.name || 'Unnamed Student' }}
                    </p>

                    <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                      {{ student.user?.username || 'No username' }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-4 py-4">
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200">
                    {{ student.course?.code || '—' }}
                  </p>

                  <p class="mt-0.5 max-w-[220px] truncate text-xs text-gray-500 dark:text-gray-400">
                    {{ student.course?.name || 'Not assigned' }}
                  </p>
                </div>
              </td>

              <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
                {{ student.year_level || '—' }}
              </td>

              <td class="px-4 py-4">
                <UBadge color="neutral" variant="subtle">
                  {{ student.section || 'No section' }}
                </UBadge>
              </td>

              <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
                {{ student.user?.email || '—' }}
              </td>

              <td class="px-4 py-4 text-center">
                <UTooltip
                  v-if="student.assigned_teachers?.length"
                  :text="student.assigned_teachers.map((teacher: any) => teacher.name).join(', ')"
                >
                  <UBadge color="primary" variant="subtle">
                    {{ student.assigned_teachers.length }}
                  </UBadge>
                </UTooltip>

                <span v-else class="text-xs text-gray-400">0</span>
              </td>

              <td class="px-4 py-4 text-center">
                <UDropdownMenu :items="getDropdownActions(student)">
                  <UButton
                    icon="i-lucide-ellipsis-vertical"
                    color="neutral"
                    variant="ghost"
                    square
                  />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="filteredStudents.length"
        class="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <div class="text-center text-xs text-gray-500 sm:text-left dark:text-gray-400">
          Showing {{ paginationStart }}–{{ paginationEnd }} of
          {{ filteredStudents.length }} records
          <span v-if="selectedCount">• {{ selectedCount }} selected</span>
        </div>

        <div class="flex items-center justify-center gap-2">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-chevron-left"
            square
            :disabled="page <= 1"
            @click="page -= 1"
          />

          <div
            class="min-w-28 rounded-xl bg-gray-100 px-3 py-2 text-center text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            Page {{ page }} of {{ totalPages }}
          </div>

          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-chevron-right"
            square
            :disabled="page >= totalPages"
            @click="page += 1"
          />
        </div>
      </div>
    </section>

    <!-- CREATE MODAL -->
    <UModal
      v-model:open="createModal"
      title="Register Student"
      description="Create a new student account and academic profile."
      :ui="{ content: 'max-w-3xl' }"
    >
      <template #content>
        <div class="max-h-[88vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900">
          <ModalHeader
            title="Register Student"
            description="Create a new student account and academic profile."
            icon="i-lucide-user-plus"
            @close="createModal = false"
          />

          <UForm :state="createForm" class="space-y-5 p-6" @submit="createStudent">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UFormField label="Student ID" name="student_id" required>
                <UInput
                  v-model="createForm.student_id"
                  placeholder="Enter student ID"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Full Name" name="name" required>
                <UInput
                  v-model="createForm.name"
                  placeholder="Enter complete name"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Course" name="course" required>
                <USelectMenu
                  v-model="createForm.course"
                  :items="courseOptions"
                  value-key="value"
                  placeholder="Select course"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Year Level" name="year_level" required>
                <USelectMenu
                  v-model="createForm.year_level"
                  :items="yearLevelOptions"
                  value-key="value"
                  placeholder="Select year level"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Section" name="section" required>
                <UInput
                  v-model="createForm.section"
                  placeholder="e.g. A"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Username"
                name="username"
                description="Automatically uses the Student ID."
                required
              >
                <UInput
                  v-model="createForm.username"
                  autocomplete="username"
                  placeholder="Student ID will be used"
                  icon="i-lucide-badge-check"
                  readonly
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Email" name="email" required>
                <UInput
                  v-model="createForm.email"
                  type="email"
                  autocomplete="email"
                  placeholder="name@example.com"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Password" name="password" required>
                <UInput
                  v-model="createForm.password"
                  :type="showCreatePassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Enter temporary password"
                  class="w-full"
                >
                  <template #trailing>
                    <UButton
                      color="neutral"
                      variant="ghost"
                      size="xs"
                      :icon="showCreatePassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                      square
                      type="button"
                      @click="showCreatePassword = !showCreatePassword"
                    />
                  </template>
                </UInput>
              </UFormField>
            </div>

            <div
              class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800"
            >
              <UButton
                color="neutral"
                variant="outline"
                type="button"
                @click="createModal = false"
              >
                Cancel
              </UButton>

              <UButton
                type="submit"
                icon="i-lucide-save"
                :loading="loadingCreate"
                :disabled="loadingCreate"
              >
                Register Student
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- EDIT MODAL -->
    <UModal
      v-model:open="editModal"
      title="Edit Student"
      description="Update student information and assigned faculty members."
      :ui="{ content: 'max-w-4xl' }"
    >
      <template #content>
        <div class="max-h-[90vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900">
          <ModalHeader
            title="Edit Student"
            description="Update student information and assigned faculty members."
            icon="i-lucide-user-round-cog"
            tone="blue"
            @close="editModal = false"
          />

          <UForm :state="editForm" class="space-y-6 p-6" @submit="updateStudent">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UFormField label="Student ID" name="student_id" required>
                <UInput v-model="editForm.student_id" class="w-full" />
              </UFormField>

              <UFormField label="Full Name" name="name" required>
                <UInput v-model="editForm.name" class="w-full" />
              </UFormField>

              <UFormField label="Course" name="course" required>
                <USelectMenu
                  v-model="editForm.course"
                  :items="courseOptions"
                  value-key="value"
                  placeholder="Select course"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Year Level" name="year_level" required>
                <USelectMenu
                  v-model="editForm.year_level"
                  :items="yearLevelOptions"
                  value-key="value"
                  placeholder="Select year level"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Section" name="section" required>
                <UInput v-model="editForm.section" class="w-full" />
              </UFormField>

              <UFormField label="Email" name="email" required>
                <UInput v-model="editForm.email" type="email" class="w-full" />
              </UFormField>
            </div>

            <section class="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
              <div class="mb-4">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                  Assigned Teachers
                </h3>

                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Select the faculty members assigned to this student.
                </p>
              </div>

              <UFormField name="assigned_teachers">
                <USelectMenu
                  v-model="editForm.assigned_teachers"
                  :items="teacherOptions"
                  value-key="value"
                  multiple
                  class="w-full"
                  placeholder="Select assigned teachers"
                />
              </UFormField>

              <div
                v-if="assignedTeacherPreview.length"
                class="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <div
                  class="border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-400"
                >
                  {{ assignedTeacherPreview.length }}
                  teacher{{ assignedTeacherPreview.length === 1 ? '' : 's' }} assigned
                </div>

                <div class="max-h-64 overflow-y-auto">
                  <table class="w-full text-sm">
                    <thead
                      class="sticky top-0 bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-950 dark:text-gray-400"
                    >
                      <tr>
                        <th class="px-4 py-3 text-left">Employee No.</th>
                        <th class="px-4 py-3 text-left">Teacher</th>
                        <th class="px-4 py-3 text-left">Department</th>
                        <th class="w-16 px-4 py-3 text-center">Remove</th>
                      </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                      <tr
                        v-for="teacher in assignedTeacherPreview"
                        :key="teacher.documentId || teacher.id"
                      >
                        <td class="px-4 py-3 font-mono text-xs">
                          {{ teacher.employee_no || '—' }}
                        </td>

                        <td class="px-4 py-3 font-medium">
                          {{ teacher.name }}
                        </td>

                        <td class="px-4 py-3 text-gray-500">
                          {{ teacher.department?.name || '—' }}
                        </td>

                        <td class="px-4 py-3 text-center">
                          <UButton
                            color="error"
                            variant="ghost"
                            size="xs"
                            icon="i-lucide-x"
                            square
                            type="button"
                            @click="removeTeacher(teacher.documentId || teacher.id)"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div
                v-else
                class="mt-4 rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400"
              >
                No assigned teachers selected.
              </div>
            </section>

            <div
              class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800"
            >
              <UButton
                color="neutral"
                variant="outline"
                type="button"
                @click="editModal = false"
              >
                Cancel
              </UButton>

              <UButton
                type="submit"
                icon="i-lucide-save"
                :loading="loadingUpdate"
                :disabled="loadingUpdate"
              >
                Save Changes
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- DELETE CONFIRMATION -->
    <UModal
      v-model:open="deleteModal"
      title="Confirm Student Deletion"
      description="Confirm the permanent deletion of the selected student record or records."
      :ui="{ content: 'max-w-md' }"
    >
      <template #content>
        <div class="rounded-[24px] bg-white p-6 dark:bg-gray-900">
          <div
            class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
          >
            <UIcon name="i-lucide-trash-2" class="size-7" />
          </div>

          <h2 class="mt-4 text-center text-xl font-bold text-gray-900 dark:text-white">
            {{ deleteTargetType === 'multiple' ? 'Delete selected students?' : 'Delete student?' }}
          </h2>

          <p class="mt-2 text-center text-sm leading-6 text-gray-500 dark:text-gray-400">
            {{
              deleteTargetType === 'multiple'
                ? `This will permanently delete ${selectedCount} selected record${selectedCount === 1 ? '' : 's'} and their linked user accounts.`
                : `This will permanently delete ${deleteTarget?.name || 'this student'} and the linked user account.`
            }}
          </p>

          <div class="mt-6 flex gap-2">
            <UButton
              color="neutral"
              variant="outline"
              class="flex-1 justify-center"
              @click="closeDeleteModal"
            >
              Cancel
            </UButton>

            <UButton
              color="error"
              icon="i-lucide-trash-2"
              class="flex-1 justify-center"
              :loading="loadingDelete"
              @click="confirmDelete"
            >
              Delete
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
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

const StatCard = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    icon: String,
    tone: {
      type: String,
      default: 'blue'
    }
  },

  setup(props) {
    const tones: Record<string, string> = {
      blue:
        'border-blue-100 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20',
      violet:
        'border-violet-100 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/20',
      emerald:
        'border-emerald-100 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20',
      amber:
        'border-amber-100 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20'
    }

    const iconTones: Record<string, string> = {
      blue:
        'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
      violet:
        'bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
      emerald:
        'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
      amber:
        'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
    }

    return () =>
      h(
        'div',
        {
          class: `rounded-2xl border p-5 ${tones[props.tone] || tones.blue}`
        },
        [
          h('div', { class: 'flex items-center justify-between' }, [
            h('div', {}, [
              h(
                'p',
                {
                  class: 'text-xs font-medium text-gray-500 dark:text-gray-400'
                },
                props.label
              ),

              h(
                'p',
                {
                  class: 'mt-2 text-2xl font-bold text-gray-900 dark:text-white'
                },
                String(props.value ?? 0)
              )
            ]),

            h(
              'div',
              {
                class: `flex size-11 items-center justify-center rounded-2xl ${
                  iconTones[props.tone] || iconTones.blue
                }`
              },
              [
                h(resolveComponent('UIcon'), {
                  name: props.icon,
                  class: 'size-5'
                })
              ]
            )
          ])
        ]
      )
  }
})

const ModalHeader = defineComponent({
  emits: ['close'],

  props: {
    title: String,
    description: String,
    icon: String,
    tone: {
      type: String,
      default: 'indigo'
    }
  },

  setup(props, { emit }) {
    return () =>
      h(
        'div',
        {
          class:
            props.tone === 'blue'
              ? 'relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 px-6 py-6 text-white'
              : 'relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-6 py-6 text-white'
        },
        [
          h('div', {
            class:
              'pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-white/10 blur-3xl'
          }),

          h(
            'div',
            {
              class: 'relative flex items-start justify-between gap-4'
            },
            [
              h(
                'div',
                {
                  class: 'flex min-w-0 items-center gap-4'
                },
                [
                  h(
                    'div',
                    {
                      class:
                        'flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10'
                    },
                    [
                      h(resolveComponent('UIcon'), {
                        name: props.icon,
                        class: 'size-6'
                      })
                    ]
                  ),

                  h('div', { class: 'min-w-0' }, [
                    h(
                      'h2',
                      {
                        class: 'text-xl font-bold'
                      },
                      props.title
                    ),

                    h(
                      'p',
                      {
                        class: 'mt-1 text-xs text-slate-300'
                      },
                      props.description
                    )
                  ])
                ]
              ),

              h(resolveComponent('UButton'), {
                color: 'neutral',
                variant: 'ghost',
                icon: 'i-lucide-x',
                square: true,
                class: 'text-white hover:bg-white/10',
                onClick: () => emit('close')
              })
            ]
          )
        ]
      )
  }
})

const loading = ref(true)
const loadError = ref('')
const loadingCreate = ref(false)
const loadingUpdate = ref(false)
const loadingDelete = ref(false)

const createModal = ref(false)
const editModal = ref(false)
const deleteModal = ref(false)
const showCreatePassword = ref(false)

const page = ref(1)
const itemsPerPage = ref(10)

const globalFilter = ref('')
const selectedCourse = ref('all')
const selectedYearLevel = ref('all')
const selectedSection = ref('all')

const students = ref<any[]>([])
const teachers = ref<any[]>([])
const courses = ref<any[]>([])

const selectedId = ref<any>(null)
const selectedRows = ref<Record<string | number, boolean>>({})

const deleteTarget = ref<any>(null)
const deleteTargetType = ref<'single' | 'multiple'>('single')

const pageSizeOptions = [
  { label: '10 rows', value: 10 },
  { label: '20 rows', value: 20 },
  { label: '50 rows', value: 50 },
  { label: '100 rows', value: 100 }
]

const yearLevelOptions = [
  { label: '1st Year', value: '1st Year' },
  { label: '2nd Year', value: '2nd Year' },
  { label: '3rd Year', value: '3rd Year' },
  { label: '4th Year', value: '4th Year' },
  { label: '5th Year', value: '5th Year' }
]

const createForm = reactive({
  student_id: '',
  name: '',
  course: null as any,
  year_level: '',
  section: '',
  username: '',
  email: '',
  password: ''
})

const editForm = reactive({
  student_id: '',
  name: '',
  course: null as any,
  year_level: '',
  section: '',
  email: '',
  assigned_teachers: [] as string[]
})

const courseOptions = computed(() =>
  courses.value.map(course => ({
    label: `${course.code?.toUpperCase() || 'NO CODE'} - ${course.name}`,
    value: course.id
  }))
)

const courseFilterOptions = computed(() => [
  {
    label: 'All Courses',
    value: 'all'
  },

  ...courses.value.map(course => ({
    label: `${course.code?.toUpperCase() || 'NO CODE'} - ${course.name}`,
    value: String(course.id)
  }))
])

const selectedCourseLabel = computed(() =>
  courseFilterOptions.value.find(
    option => option.value === selectedCourse.value
  )?.label || 'Course'
)

const yearLevelFilterOptions = computed(() => {
  const values = Array.from(
    new Set(
      students.value
        .map(student => student.year_level)
        .filter(Boolean)
    )
  ).sort((a, b) => String(a).localeCompare(String(b)))

  return [
    { label: 'All Year Levels', value: 'all' },
    ...values.map(value => ({
      label: String(value),
      value: String(value)
    }))
  ]
})

const sectionFilterOptions = computed(() => {
  const values = Array.from(
    new Set(
      students.value
        .map(student => student.section)
        .filter(Boolean)
    )
  ).sort((a, b) => String(a).localeCompare(String(b)))

  return [
    { label: 'All Sections', value: 'all' },
    ...values.map(value => ({
      label: String(value),
      value: String(value)
    }))
  ]
})

const teacherOptions = computed(() =>
  teachers.value.map(teacher => ({
    label: `${teacher.employee_no ? `${teacher.employee_no} - ` : ''}${teacher.name}`,
    value: teacher.documentId || teacher.id
  }))
)

const assignedTeacherPreview = computed(() =>
  teachers.value.filter(teacher =>
    editForm.assigned_teachers.includes(
      teacher.documentId || teacher.id
    )
  )
)

const summary = computed(() => ({
  total: students.value.length,

  courses: new Set(
    students.value
      .map(student => student.course?.id)
      .filter(Boolean)
  ).size,

  sections: new Set(
    students.value
      .map(student => student.section)
      .filter(Boolean)
  ).size,

  assignments: students.value.reduce(
    (sum, student) =>
      sum + (student.assigned_teachers?.length || 0),
    0
  )
}))

const filteredStudents = computed(() => {
  const keyword = globalFilter.value.trim().toLowerCase()

  return students.value.filter(student => {
    const searchable = [
      student.student_id,
      student.name,
      student.course?.code,
      student.course?.name,
      student.year_level,
      student.section,
      student.user?.username,
      student.user?.email,
      ...(student.assigned_teachers || []).map((teacher: any) => teacher.name)
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesSearch =
      !keyword || searchable.includes(keyword)

    const matchesCourse =
      selectedCourse.value === 'all' ||
      String(student.course?.id) === selectedCourse.value

    const matchesYear =
      selectedYearLevel.value === 'all' ||
      String(student.year_level) === selectedYearLevel.value

    const matchesSection =
      selectedSection.value === 'all' ||
      String(student.section) === selectedSection.value

    return matchesSearch && matchesCourse && matchesYear && matchesSection
  })
})

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(
      filteredStudents.value.length /
      Number(itemsPerPage.value)
    )
  )
)

const paginatedStudents = computed(() => {
  const start =
    (page.value - 1) *
    Number(itemsPerPage.value)

  return filteredStudents.value.slice(
    start,
    start + Number(itemsPerPage.value)
  )
})

const paginationStart = computed(() =>
  filteredStudents.value.length
    ? (page.value - 1) *
        Number(itemsPerPage.value) +
      1
    : 0
)

const paginationEnd = computed(() =>
  Math.min(
    page.value * Number(itemsPerPage.value),
    filteredStudents.value.length
  )
)

const selectedCount = computed(() =>
  Object.values(selectedRows.value).filter(Boolean).length
)

const hasActiveFilters = computed(() =>
  Boolean(
    globalFilter.value ||
    selectedCourse.value !== 'all' ||
    selectedYearLevel.value !== 'all' ||
    selectedSection.value !== 'all'
  )
)

const isCurrentPageSelected = computed(() =>
  paginatedStudents.value.length > 0 &&
  paginatedStudents.value.every(isRowSelected)
)

const isCurrentPagePartiallySelected = computed(() => {
  const selectedOnPage =
    paginatedStudents.value.filter(isRowSelected).length

  return (
    selectedOnPage > 0 &&
    selectedOnPage < paginatedStudents.value.length
  )
})

const getStudentKey = (student: any) =>
  student?.documentId || student?.id

const createInitials = (value: string) =>
  String(value || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')

const resetCreateForm = () => {
  createForm.student_id = ''
  createForm.name = ''
  createForm.course = null
  createForm.year_level = ''
  createForm.section = ''
  createForm.username = ''
  createForm.email = ''
  createForm.password = ''

  showCreatePassword.value = false
}

const resetEditForm = () => {
  editForm.student_id = ''
  editForm.name = ''
  editForm.course = null
  editForm.year_level = ''
  editForm.section = ''
  editForm.email = ''
  editForm.assigned_teachers = []

  selectedId.value = null
}

const openCreateModal = () => {
  resetCreateForm()
  createModal.value = true
}

const openEditModal = (row: any) => {
  // The custom update endpoint expects the numeric Strapi ID.
  selectedId.value = row.id

  editForm.student_id = row.student_id || ''
  editForm.name = row.name || ''
  editForm.course = row.course?.id || null
  editForm.year_level = row.year_level || ''
  editForm.section = row.section || ''
  editForm.email = row.user?.email || ''

  editForm.assigned_teachers =
    row.assigned_teachers?.map(
      (teacher: any) =>
        teacher.documentId || teacher.id
    ) || []

  editModal.value = true
}

const clearFilters = () => {
  globalFilter.value = ''
  selectedCourse.value = 'all'
  selectedYearLevel.value = 'all'
  selectedSection.value = 'all'
  page.value = 1
}

const toggleRowSelection = (row: any, value: boolean) => {
  selectedRows.value = {
    ...selectedRows.value,
    [getStudentKey(row)]: value
  }
}

const isRowSelected = (row: any) =>
  Boolean(selectedRows.value[getStudentKey(row)])

const toggleCurrentPageSelection = (value: boolean) => {
  const next = {
    ...selectedRows.value
  }

  paginatedStudents.value.forEach(row => {
    next[getStudentKey(row)] = value
  })

  selectedRows.value = next
}

const getDropdownActions = (row: any): DropdownMenuItem[][] => [
  [
    {
      type: 'label',
      label: 'Actions'
    },

    {
      type: 'separator'
    },

    {
      label: 'Edit Student',
      icon: 'i-lucide-edit-3',

      onSelect() {
        openEditModal(row)
      }
    },

    {
      label: 'Delete Student',
      icon: 'i-lucide-trash-2',
      color: 'error',

      onSelect() {
        requestDeleteOne(row)
      }
    }
  ]
]

const removeTeacher = (id: string) => {
  editForm.assigned_teachers =
    editForm.assigned_teachers.filter(
      teacherId => teacherId !== id
    )
}

const getCourses = async () => {
  try {
    const res: any = await $api('/courses', {
      query: {
        'populate[department]': true,
        'sort[0]': 'name:asc',
        'pagination[pageSize]': 500
      }
    })

    courses.value = res.data || []
  } catch (error) {
    console.error('Course loading error:', error)
    courses.value = []
  }
}

const getTeachers = async () => {
  try {
    const res: any = await $api('/teachers', {
      query: {
        'populate[department]': true,
        'sort[0]': 'name:asc',
        'pagination[pageSize]': 10000
      }
    })

    teachers.value = res.data || []
  } catch (error) {
    console.error('Teacher loading error:', error)
    teachers.value = []
  }
}

const getStudents = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const res: any = await $api('/students', {
      query: {
        'populate[user]': true,
        'populate[assigned_teachers]': true,
        'populate[course][populate][0]': 'department',
        'sort[0]': 'name:asc',
        'pagination[pageSize]': 10000
      }
    })

    students.value = res.data || []

    const availableKeys = new Set(
      students.value.map(getStudentKey)
    )

    selectedRows.value = Object.fromEntries(
      Object.entries(selectedRows.value).filter(([key]) =>
        availableKeys.has(key)
      )
    )

    if (page.value > totalPages.value) {
      page.value = totalPages.value
    }
  } catch (error: any) {
    console.error('Student loading error:', error)

    students.value = []

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to load student records.'
  } finally {
    loading.value = false
  }
}

const validateCreateForm = () => {
  if (
    !createForm.student_id.trim() ||
    !createForm.name.trim() ||
    !createForm.course ||
    !createForm.year_level.trim() ||
    !createForm.section.trim() ||
    !createForm.username.trim() ||
    !createForm.email.trim() ||
    !createForm.password
  ) {
    toast.add({
      title: 'Incomplete information',
      description:
        'Complete all required fields before registering the student account.',
      icon: 'i-lucide-circle-alert',
      color: 'warning'
    })

    return false
  }

  return true
}

const validateEditForm = () => {
  if (
    !editForm.student_id.trim() ||
    !editForm.name.trim() ||
    !editForm.course ||
    !editForm.year_level.trim() ||
    !editForm.section.trim() ||
    !editForm.email.trim()
  ) {
    toast.add({
      title: 'Incomplete information',
      description:
        'Complete all required fields before saving the changes.',
      icon: 'i-lucide-circle-alert',
      color: 'warning'
    })

    return false
  }

  return true
}

const createStudent = async () => {
  if (!validateCreateForm()) {
    return
  }

  loadingCreate.value = true

  try {
    await $api('/students/register', {
      method: 'POST',

      body: {
        student_id: createForm.student_id.trim(),
        name: createForm.name.trim(),
        course: createForm.course,
        year_level: createForm.year_level.trim(),
        section: createForm.section.trim(),
        username: createForm.student_id.trim(),
        email: createForm.email.trim(),
        password: createForm.password
      }
    })

    toast.add({
      title: 'Student registered',
      description:
        'The student account was created successfully.',
      icon: 'i-lucide-circle-check',
      color: 'success'
    })

    createModal.value = false
    resetCreateForm()

    await getStudents()
  } catch (error: any) {
    console.error('Student creation error:', error)

    toast.add({
      title: 'Unable to register student',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        'Failed to create the student account.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loadingCreate.value = false
  }
}

const updateStudent = async () => {
  if (!validateEditForm()) {
    return
  }

  loadingUpdate.value = true

  try {
    await $api(
      `/students/update-with-user/${selectedId.value}`,
      {
        method: 'PUT',

        body: {
          student_id: editForm.student_id.trim(),
          name: editForm.name.trim(),
          course: editForm.course,
          year_level: editForm.year_level.trim(),
          section: editForm.section.trim(),
          email: editForm.email.trim(),
          assigned_teachers: editForm.assigned_teachers
        }
      }
    )

    toast.add({
      title: 'Student updated',
      description:
        'The student record was updated successfully.',
      icon: 'i-lucide-circle-check',
      color: 'success'
    })

    editModal.value = false
    resetEditForm()

    await getStudents()
  } catch (error: any) {
    console.error('Student update error:', error)

    toast.add({
      title: 'Unable to update student',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        'Failed to update the student record.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loadingUpdate.value = false
  }
}

const requestDeleteOne = (row: any) => {
  deleteTarget.value = row
  deleteTargetType.value = 'single'
  deleteModal.value = true
}

const requestDeleteSelected = () => {
  if (!selectedCount.value) {
    return
  }

  deleteTarget.value = null
  deleteTargetType.value = 'multiple'
  deleteModal.value = true
}

const closeDeleteModal = () => {
  deleteModal.value = false
  deleteTarget.value = null
  deleteTargetType.value = 'single'
}

const deleteOne = async (row: any) => {
  // The custom delete route expects the numeric Strapi ID.
  await $api(`/students/delete-with-user/${row.id}`, {
    method: 'DELETE'
  })

  const next = {
    ...selectedRows.value
  }

  delete next[getStudentKey(row)]
  selectedRows.value = next
}

const deleteSelected = async () => {
  const selectedItems = students.value.filter(item =>
    selectedRows.value[getStudentKey(item)]
  )

  await Promise.all(
    selectedItems.map(item =>
      $api(`/students/delete-with-user/${item.id}`, {
        method: 'DELETE'
      })
    )
  )

  selectedRows.value = {}
}

const confirmDelete = async () => {
  loadingDelete.value = true

  try {
    if (deleteTargetType.value === 'multiple') {
      await deleteSelected()

      toast.add({
        title: 'Students deleted',
        description:
          'The selected students and linked user accounts were deleted successfully.',
        icon: 'i-lucide-circle-check',
        color: 'success'
      })
    } else if (deleteTarget.value) {
      await deleteOne(deleteTarget.value)

      toast.add({
        title: 'Student deleted',
        description:
          'The student and linked user account were deleted successfully.',
        icon: 'i-lucide-circle-check',
        color: 'success'
      })
    }

    closeDeleteModal()
    await getStudents()
  } catch (error: any) {
    console.error('Student deletion error:', error)

    toast.add({
      title: 'Unable to delete student',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        'Failed to delete the selected student record.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loadingDelete.value = false
  }
}

watch(
  () => createForm.student_id,
  value => {
    createForm.username = String(value || '').trim()
  }
)

watch(
  [
    globalFilter,
    selectedCourse,
    selectedYearLevel,
    selectedSection,
    itemsPerPage
  ],
  () => {
    page.value = 1
  }
)

watch(
  () => totalPages.value,
  value => {
    if (page.value > value) {
      page.value = value
    }
  }
)

onMounted(async () => {
  await Promise.all([
    getStudents(),
    getTeachers(),
    getCourses()
  ])
})
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
