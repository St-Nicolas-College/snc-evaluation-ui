<template>
  <div class="space-y-6 pb-8">
    <!-- =====================================================
      HERO
    ====================================================== -->
    <section
      class="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7"
    >
      <div
        class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-teal-300/15 blur-3xl"
      />

      <div
        class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"
      >
        <div class="flex min-w-0 items-start gap-4">
          <div
            class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex"
          >
            <UIcon name="i-lucide-users-round" class="size-7" />
          </div>

          <div class="min-w-0">
            <div
              class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-50"
            >
              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Administrator Portal
              </span>

              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Faculty Management
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Faculty Management
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Register faculty and Dean accounts, manage departments, roles,
              contact information, and subject assignments.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">{{ summary.total }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">
              Total
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">{{ summary.faculty }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">
              Faculty
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">{{ summary.deans }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">
              Deans
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
      KPI CARDS
    ====================================================== -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Personnel"
        :value="summary.total"
        icon="i-lucide-users-round"
        tone="emerald"
      />

      <StatCard
        label="Faculty Accounts"
        :value="summary.faculty"
        icon="i-lucide-user-round-check"
        tone="blue"
      />

      <StatCard
        label="Dean Accounts"
        :value="summary.deans"
        icon="i-lucide-shield-check"
        tone="violet"
      />

      <StatCard
        label="Subject Assignments"
        :value="summary.assignments"
        icon="i-lucide-book-open-check"
        tone="amber"
      />
    </section>

    <!-- =====================================================
      TOOLBAR
    ====================================================== -->
    <section
      class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
      >
        <div class="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <UInput
            v-model="globalFilter"
            icon="i-lucide-search"
            placeholder="Search employee no., name, email..."
            class="w-full"
          />

          <USelectMenu
            v-model="selectedDepartment"
            :items="departmentFilterOptions"
            value-key="value"
            class="w-full"
          />

          <USelectMenu
            v-model="selectedRole"
            :items="roleFilterOptions"
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

          <UButton
            icon="i-lucide-plus"
            @click="openCreateModal"
          >
            New Faculty
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

        <UBadge
          v-if="selectedDepartment !== 'all'"
          color="primary"
          variant="subtle"
        >
          {{ selectedDepartmentLabel }}
        </UBadge>

        <UBadge
          v-if="selectedRole !== 'all'"
          color="success"
          variant="subtle"
        >
          {{ selectedRole }}
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

    <!-- =====================================================
      TABLE
    ====================================================== -->
    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Faculty Directory
          </h2>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Showing {{ filteredTeachers.length }} of {{ teachers.length }}
            record{{ teachers.length === 1 ? '' : 's' }}.
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
          Unable to load faculty
        </h3>

        <p class="mx-auto mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400">
          {{ loadError }}
        </p>

        <UButton
          class="mt-5"
          icon="i-lucide-refresh-cw"
          @click="getTeachers"
        >
          Try Again
        </UButton>
      </div>

      <div v-else-if="!filteredTeachers.length" class="px-6 py-16 text-center">
        <div
          class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
        >
          <UIcon
            :name="teachers.length ? 'i-lucide-search-x' : 'i-lucide-users-round'"
            class="size-8"
          />
        </div>

        <h3 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
          {{ teachers.length ? 'No matching faculty found' : 'No faculty records yet' }}
        </h3>

        <p class="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
          {{
            teachers.length
              ? 'Try changing or clearing the current filters.'
              : 'Create the first faculty account to begin managing personnel.'
          }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[1120px] text-sm">
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

              <th class="px-4 py-3 text-left">Employee No.</th>
              <th class="px-4 py-3 text-left">Faculty</th>
              <th class="px-4 py-3 text-left">Department</th>
              <th class="px-4 py-3 text-left">Role</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-left">Assigned Subjects</th>
              <th class="w-20 px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="teacher in paginatedTeachers"
              :key="getTeacherKey(teacher)"
              class="transition hover:bg-gray-50/80 dark:hover:bg-gray-950/30"
            >
              <td class="px-4 py-4 text-center">
                <UCheckbox
                  :model-value="isRowSelected(teacher)"
                  @update:model-value="toggleRowSelection(teacher, !!$event)"
                />
              </td>

              <td class="px-4 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">
                {{ teacher.employee_no || '—' }}
              </td>

              <td class="px-4 py-4">
                <div class="flex min-w-0 items-center gap-3">
                  <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm"
                  >
                    {{ createInitials(teacher.name) }}
                  </div>

                  <div class="min-w-0">
                    <p class="truncate font-bold text-gray-900 dark:text-white">
                      {{ teacher.name || 'Unnamed Faculty' }}
                    </p>

                    <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                      {{ teacher.user?.username || 'No username' }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
                {{ teacher.department?.name || 'Not assigned' }}
              </td>

              <td class="px-4 py-4">
                <UBadge
                  :color="teacher.user?.role?.name === 'Dean' ? 'warning' : 'primary'"
                  variant="subtle"
                >
                  {{ teacher.user?.role?.name || 'No role' }}
                </UBadge>
              </td>

              <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
                {{ teacher.user?.email || '—' }}
              </td>

              <td class="px-4 py-4">
                <UTooltip
                  v-if="teacher.assigned_subjects?.length"
                  :text="formatSubjectTooltip(teacher.assigned_subjects)"
                >
                  <div class="flex max-w-[330px] flex-wrap gap-1">
                    <UBadge
                      v-for="subject in teacher.assigned_subjects.slice(0, 3)"
                      :key="subject.documentId || subject.id"
                      color="primary"
                      variant="soft"
                    >
                      {{ subject.code || subject.name }}
                    </UBadge>

                    <UBadge
                      v-if="teacher.assigned_subjects.length > 3"
                      color="neutral"
                      variant="soft"
                    >
                      +{{ teacher.assigned_subjects.length - 3 }} more
                    </UBadge>
                  </div>
                </UTooltip>

                <span v-else class="text-xs text-gray-400">
                  No subjects assigned
                </span>
              </td>

              <td class="px-4 py-4 text-center">
                <UDropdownMenu :items="getDropdownActions(teacher)">
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
        v-if="filteredTeachers.length"
        class="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <div class="text-center text-xs text-gray-500 sm:text-left dark:text-gray-400">
          Showing {{ paginationStart }}–{{ paginationEnd }} of
          {{ filteredTeachers.length }} records
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

    <!-- =====================================================
      CREATE MODAL
    ====================================================== -->
    <UModal v-model:open="createModal" :ui="{ content: 'max-w-3xl' }">
      <template #content>
        <div class="max-h-[88vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900">
          <ModalHeader
            title="Register Faculty"
            description="Create a new Faculty or Dean account."
            icon="i-lucide-user-plus"
            @close="createModal = false"
          />

          <UForm :state="createForm" class="space-y-5 p-6" @submit="createTeacher">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UFormField label="Employee No." name="employee_no" required>
                <UInput
                  v-model="createForm.employee_no"
                  placeholder="e.g. EMP-001"
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

              <UFormField label="Department" name="department" required>
                <USelectMenu
                  v-model="createForm.department"
                  :items="departmentOptions"
                  value-key="value"
                  placeholder="Select department"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Role" name="roleName" required>
                <USelectMenu
                  v-model="createForm.roleName"
                  :items="roleOptions"
                  value-key="value"
                  placeholder="Select role"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Username" name="username" required>
                <UInput
                  v-model="createForm.username"
                  autocomplete="username"
                  placeholder="Enter username"
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

              <UFormField label="Password" name="password" required class="md:col-span-2">
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

            <div class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800">
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
                Register Faculty
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- =====================================================
      EDIT MODAL
    ====================================================== -->
    <UModal v-model:open="editModal" :ui="{ content: 'max-w-4xl' }">
      <template #content>
        <div class="max-h-[90vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900">
          <ModalHeader
            title="Edit Faculty"
            description="Update account details and subject assignments."
            icon="i-lucide-user-round-cog"
            tone="blue"
            @close="editModal = false"
          />

          <UForm :state="editForm" class="space-y-6 p-6" @submit="updateTeacher">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UFormField label="Employee No." name="employee_no" required>
                <UInput v-model="editForm.employee_no" class="w-full" />
              </UFormField>

              <UFormField label="Full Name" name="name" required>
                <UInput v-model="editForm.name" class="w-full" />
              </UFormField>

              <UFormField label="Department" name="department" required>
                <USelectMenu
                  v-model="editForm.department"
                  :items="departmentOptions"
                  value-key="value"
                  class="w-full"
                  placeholder="Select department"
                />
              </UFormField>

              <UFormField label="Role" name="roleName" required>
                <USelectMenu
                  v-model="editForm.roleName"
                  :items="roleOptions"
                  value-key="value"
                  class="w-full"
                  placeholder="Select role"
                />
              </UFormField>

              <UFormField label="Email" name="email" required class="md:col-span-2">
                <UInput v-model="editForm.email" type="email" class="w-full" />
              </UFormField>
            </div>

            <section
              class="rounded-2xl border border-gray-200 p-4 dark:border-gray-800"
            >
              <div class="mb-4">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                  Assigned Subjects
                </h3>

                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Select every subject currently handled by this faculty member.
                </p>
              </div>

              <UFormField name="assigned_subjects">
                <USelectMenu
                  v-model="editForm.assigned_subjects"
                  :items="subjectOptions"
                  value-key="value"
                  multiple
                  class="w-full"
                  placeholder="Select assigned subjects"
                />
              </UFormField>

              <div
                v-if="assignedSubjectPreview.length"
                class="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <table class="w-full text-sm">
                  <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-950/40">
                    <tr>
                      <th class="px-4 py-3 text-left">Code</th>
                      <th class="px-4 py-3 text-left">Subject</th>
                      <th class="px-4 py-3 text-left">Course</th>
                      <th class="w-16 px-4 py-3 text-center">Remove</th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr
                      v-for="subject in assignedSubjectPreview"
                      :key="subject.documentId || subject.id"
                    >
                      <td class="px-4 py-3 font-mono text-xs">
                        {{ subject.code || '—' }}
                      </td>

                      <td class="px-4 py-3 font-medium">
                        {{ subject.name }}
                      </td>

                      <td class="px-4 py-3 text-gray-500">
                        {{ subject.course?.name || '—' }}
                      </td>

                      <td class="px-4 py-3 text-center">
                        <UButton
                          color="error"
                          variant="ghost"
                          size="xs"
                          icon="i-lucide-x"
                          square
                          type="button"
                          @click="removeSubject(subject.documentId || subject.id)"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                v-else
                class="mt-4 rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400"
              >
                No assigned subjects selected.
              </div>
            </section>

            <div class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800">
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

    <!-- =====================================================
      DELETE CONFIRMATION
    ====================================================== -->
    <UModal v-model:open="deleteModal" :ui="{ content: 'max-w-md' }">
      <template #content>
        <div class="rounded-[24px] bg-white p-6 dark:bg-gray-900">
          <div
            class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
          >
            <UIcon name="i-lucide-trash-2" class="size-7" />
          </div>

          <h2 class="mt-4 text-center text-xl font-bold text-gray-900 dark:text-white">
            {{ deleteTargetType === 'multiple' ? 'Delete selected faculty?' : 'Delete faculty?' }}
          </h2>

          <p class="mt-2 text-center text-sm leading-6 text-gray-500 dark:text-gray-400">
            {{
              deleteTargetType === 'multiple'
                ? `This will permanently delete ${selectedCount} selected record${selectedCount === 1 ? '' : 's'}.`
                : `This will permanently delete ${deleteTarget?.name || 'this faculty record'}.`
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
      default: 'emerald'
    }
  },

  setup(props) {
    const tones: Record<string, string> = {
      emerald:
        'border-emerald-100 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20',
      blue:
        'border-blue-100 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20',
      violet:
        'border-violet-100 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/20',
      amber:
        'border-amber-100 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20'
    }

    const iconTones: Record<string, string> = {
      emerald:
        'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
      blue:
        'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
      violet:
        'bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
      amber:
        'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
    }

    return () =>
      h(
        'div',
        {
          class: `rounded-2xl border p-5 ${tones[props.tone] || tones.emerald}`
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
                  iconTones[props.tone] || iconTones.emerald
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
      default: 'emerald'
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
              : 'relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-6 py-6 text-white'
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
const selectedDepartment = ref('all')
const selectedRole = ref('all')

const teachers = ref<any[]>([])
const subjects = ref<any[]>([])
const departments = ref<any[]>([])

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

const roleOptions = [
  { label: 'Faculty', value: 'Faculty' },
  { label: 'Dean', value: 'Dean' }
]

const roleFilterOptions = [
  { label: 'All Roles', value: 'all' },
  ...roleOptions
]

const createForm = reactive({
  employee_no: '',
  name: '',
  department: null as any,
  roleName: '',
  username: '',
  email: '',
  password: ''
})

const editForm = reactive({
  employee_no: '',
  name: '',
  department: null as any,
  roleName: '',
  email: '',
  assigned_subjects: [] as string[]
})

const summary = computed(() => ({
  total: teachers.value.length,

  faculty: teachers.value.filter(
    teacher => teacher?.user?.role?.name === 'Faculty'
  ).length,

  deans: teachers.value.filter(
    teacher => teacher?.user?.role?.name === 'Dean'
  ).length,

  assignments: teachers.value.reduce(
    (sum, teacher) =>
      sum + (teacher?.assigned_subjects?.length || 0),
    0
  )
}))

const departmentOptions = computed(() =>
  departments.value.map(department => ({
    label: department.name,
    value: department.id
  }))
)

const departmentFilterOptions = computed(() => [
  {
    label: 'All Departments',
    value: 'all'
  },

  ...departments.value.map(department => ({
    label: department.name,
    value: String(department.id)
  }))
])

const selectedDepartmentLabel = computed(() =>
  departmentFilterOptions.value.find(
    option => option.value === selectedDepartment.value
  )?.label || 'Department'
)

const subjectOptions = computed(() =>
  subjects.value.map(subject => ({
    label: `${subject.code ? `${subject.code} - ` : ''}${subject.name}${
      subject.course?.name ? ` (${subject.course.name})` : ''
    }`,

    value: subject.documentId || subject.id
  }))
)

const filteredTeachers = computed(() => {
  const keyword = globalFilter.value.trim().toLowerCase()

  return teachers.value.filter(teacher => {
    const searchable = [
      teacher.employee_no,
      teacher.name,
      teacher.department?.name,
      teacher.user?.username,
      teacher.user?.email,
      teacher.user?.role?.name,
      ...(teacher.assigned_subjects || []).flatMap((subject: any) => [
        subject.code,
        subject.name
      ])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesSearch =
      !keyword || searchable.includes(keyword)

    const matchesDepartment =
      selectedDepartment.value === 'all' ||
      String(teacher.department?.id) === selectedDepartment.value

    const matchesRole =
      selectedRole.value === 'all' ||
      teacher.user?.role?.name === selectedRole.value

    return matchesSearch && matchesDepartment && matchesRole
  })
})

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(
      filteredTeachers.value.length /
      Number(itemsPerPage.value)
    )
  )
)

const paginatedTeachers = computed(() => {
  const start =
    (page.value - 1) *
    Number(itemsPerPage.value)

  return filteredTeachers.value.slice(
    start,
    start + Number(itemsPerPage.value)
  )
})

const paginationStart = computed(() =>
  filteredTeachers.value.length
    ? (page.value - 1) *
        Number(itemsPerPage.value) +
      1
    : 0
)

const paginationEnd = computed(() =>
  Math.min(
    page.value *
      Number(itemsPerPage.value),
    filteredTeachers.value.length
  )
)

const selectedCount = computed(() =>
  Object.values(selectedRows.value).filter(Boolean).length
)

const assignedSubjectPreview = computed(() =>
  subjects.value.filter(subject =>
    editForm.assigned_subjects.includes(
      subject.documentId || subject.id
    )
  )
)

const hasActiveFilters = computed(() =>
  Boolean(
    globalFilter.value ||
    selectedDepartment.value !== 'all' ||
    selectedRole.value !== 'all'
  )
)

const isCurrentPageSelected = computed(() =>
  paginatedTeachers.value.length > 0 &&
  paginatedTeachers.value.every(isRowSelected)
)

const isCurrentPagePartiallySelected = computed(() => {
  const selectedOnPage =
    paginatedTeachers.value.filter(isRowSelected).length

  return (
    selectedOnPage > 0 &&
    selectedOnPage < paginatedTeachers.value.length
  )
})

const getTeacherKey = (teacher: any) =>
  teacher?.documentId || teacher?.id

const createInitials = (value: string) =>
  String(value || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part =>
      part.charAt(0).toUpperCase()
    )
    .join('')

const formatSubjectTooltip = (items: any[]) =>
  items
    .map(subject =>
      subject.code
        ? `${subject.code} - ${subject.name}`
        : subject.name
    )
    .join(', ')

const resetCreateForm = () => {
  createForm.employee_no = ''
  createForm.name = ''
  createForm.department = null
  createForm.roleName = ''
  createForm.username = ''
  createForm.email = ''
  createForm.password = ''

  showCreatePassword.value = false
}

const resetEditForm = () => {
  editForm.employee_no = ''
  editForm.name = ''
  editForm.department = null
  editForm.roleName = ''
  editForm.email = ''
  editForm.assigned_subjects = []

  selectedId.value = null
}

const openCreateModal = () => {
  resetCreateForm()
  createModal.value = true
}

const openEditModal = (row: any) => {
  selectedId.value = row.id

  editForm.employee_no = row.employee_no || ''
  editForm.name = row.name || ''
  editForm.department = row.department?.id || null
  editForm.roleName = row.user?.role?.name || ''
  editForm.email = row.user?.email || ''

  editForm.assigned_subjects =
    row.assigned_subjects?.map(
      (subject: any) =>
        subject.documentId || subject.id
    ) || []

  editModal.value = true
}

const clearFilters = () => {
  globalFilter.value = ''
  selectedDepartment.value = 'all'
  selectedRole.value = 'all'
  page.value = 1
}

const toggleRowSelection = (
  row: any,
  value: boolean
) => {
  selectedRows.value = {
    ...selectedRows.value,
    [getTeacherKey(row)]: value
  }
}

const isRowSelected = (row: any) =>
  Boolean(
    selectedRows.value[
      getTeacherKey(row)
    ]
  )

const toggleCurrentPageSelection = (
  value: boolean
) => {
  const next = {
    ...selectedRows.value
  }

  paginatedTeachers.value.forEach(row => {
    next[getTeacherKey(row)] = value
  })

  selectedRows.value = next
}

const getDropdownActions = (
  row: any
): DropdownMenuItem[][] => [
  [
    {
      type: 'label',
      label: 'Actions'
    },

    {
      type: 'separator'
    },

    {
      label: 'Edit Faculty',
      icon: 'i-lucide-edit-3',

      onSelect() {
        openEditModal(row)
      }
    },

    {
      label: 'Delete Faculty',
      icon: 'i-lucide-trash-2',
      color: 'error',

      onSelect() {
        requestDeleteOne(row)
      }
    }
  ]
]

const removeSubject = (id: string) => {
  editForm.assigned_subjects =
    editForm.assigned_subjects.filter(
      subjectId => subjectId !== id
    )
}

const getDepartments = async () => {
  try {
    const res: any = await $api(
      '/departments',
      {
        query: {
          'sort[0]': 'name:asc',
          'pagination[pageSize]': 100
        }
      }
    )

    departments.value = res.data || []
  } catch (error) {
    console.error(
      'Department loading error:',
      error
    )

    departments.value = []
  }
}

const getSubjects = async () => {
  try {
    const res: any = await $api(
      '/subjects',
      {
        query: {
          'populate[course][populate][0]':
            'department',

          'sort[0]':
            'name:asc',

          'pagination[pageSize]':
            500
        }
      }
    )

    subjects.value = res.data || []
  } catch (error) {
    console.error(
      'Subject loading error:',
      error
    )

    subjects.value = []
  }
}

const getTeachers = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const res: any = await $api(
      '/teachers',
      {
        query: {
          'populate[department]':
            true,

          'populate[assigned_subjects][populate][0]':
            'course',

          'populate[user][populate][0]':
            'role',

          'sort[0]':
            'name:asc',

          'pagination[pageSize]':
            10000
        }
      }
    )

    teachers.value = res.data || []

    const availableKeys = new Set(
      teachers.value.map(getTeacherKey)
    )

    selectedRows.value =
      Object.fromEntries(
        Object.entries(
          selectedRows.value
        ).filter(([key]) =>
          availableKeys.has(key)
        )
      )

    if (page.value > totalPages.value) {
      page.value = totalPages.value
    }
  } catch (error: any) {
    console.error(
      'Faculty loading error:',
      error
    )

    teachers.value = []

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to load faculty records.'
  } finally {
    loading.value = false
  }
}

const validateCreateForm = () => {
  if (
    !createForm.employee_no.trim() ||
    !createForm.name.trim() ||
    !createForm.department ||
    !createForm.roleName ||
    !createForm.username.trim() ||
    !createForm.email.trim() ||
    !createForm.password
  ) {
    toast.add({
      title: 'Incomplete information',
      description:
        'Complete all required fields before registering the faculty account.',
      icon: 'i-lucide-circle-alert',
      color: 'warning'
    })

    return false
  }

  return true
}

const validateEditForm = () => {
  if (
    !editForm.employee_no.trim() ||
    !editForm.name.trim() ||
    !editForm.department ||
    !editForm.roleName ||
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

const createTeacher = async () => {
  if (!validateCreateForm()) {
    return
  }

  loadingCreate.value = true

  try {
    await $api('/teachers/register', {
      method: 'POST',

      body: {
        employee_no:
          createForm.employee_no.trim(),

        name:
          createForm.name.trim(),

        department:
          createForm.department,

        roleName:
          createForm.roleName,

        username:
          createForm.username.trim(),

        email:
          createForm.email.trim(),

        password:
          createForm.password
      }
    })

    toast.add({
      title: 'Faculty registered',
      description:
        'The faculty account was created successfully.',
      icon: 'i-lucide-circle-check',
      color: 'success'
    })

    createModal.value = false
    resetCreateForm()

    await getTeachers()
  } catch (error: any) {
    console.error(
      'Faculty creation error:',
      error
    )

    toast.add({
      title: 'Unable to register faculty',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        'Failed to create the faculty account.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loadingCreate.value = false
  }
}

const updateTeacher = async () => {
  if (!validateEditForm()) {
    return
  }

  loadingUpdate.value = true

  try {
    await $api(
      `/teachers/update-with-user/${selectedId.value}`,
      {
        method: 'PUT',

        body: {
          employee_no:
            editForm.employee_no.trim(),

          name:
            editForm.name.trim(),

          department:
            editForm.department,

          email:
            editForm.email.trim(),

          roleName:
            editForm.roleName,

          assigned_subjects:
            editForm.assigned_subjects
        }
      }
    )

    toast.add({
      title: 'Faculty updated',
      description:
        'The faculty record was updated successfully.',
      icon: 'i-lucide-circle-check',
      color: 'success'
    })

    editModal.value = false
    resetEditForm()

    await getTeachers()
  } catch (error: any) {
    console.error(
      'Faculty update error:',
      error
    )

    toast.add({
      title: 'Unable to update faculty',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        'Failed to update the faculty record.',
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
  await $api(
    `/teachers/${getTeacherKey(row)}`,
    {
      method: 'DELETE'
    }
  )

  const key = getTeacherKey(row)

  const next = {
    ...selectedRows.value
  }

  delete next[key]
  selectedRows.value = next
}

const deleteSelected = async () => {
  const selectedItems =
    teachers.value.filter(item =>
      selectedRows.value[
        getTeacherKey(item)
      ]
    )

  await Promise.all(
    selectedItems.map(item =>
      $api(
        `/teachers/${getTeacherKey(item)}`,
        {
          method: 'DELETE'
        }
      )
    )
  )

  selectedRows.value = {}
}

const confirmDelete = async () => {
  loadingDelete.value = true

  try {
    if (
      deleteTargetType.value === 'multiple'
    ) {
      await deleteSelected()

      toast.add({
        title: 'Faculty records deleted',
        description:
          'The selected faculty records were deleted successfully.',
        icon: 'i-lucide-circle-check',
        color: 'success'
      })
    } else if (deleteTarget.value) {
      await deleteOne(deleteTarget.value)

      toast.add({
        title: 'Faculty deleted',
        description:
          'The faculty record was deleted successfully.',
        icon: 'i-lucide-circle-check',
        color: 'success'
      })
    }

    closeDeleteModal()
    await getTeachers()
  } catch (error: any) {
    console.error(
      'Faculty deletion error:',
      error
    )

    toast.add({
      title: 'Unable to delete faculty',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        'Failed to delete the selected faculty record.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loadingDelete.value = false
  }
}

watch(
  [
    globalFilter,
    selectedDepartment,
    selectedRole,
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
    getDepartments(),
    getSubjects(),
    getTeachers()
  ])
})
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
