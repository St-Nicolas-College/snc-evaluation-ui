<template>
  <div class="space-y-6 pb-8">
    <!-- =====================================================
      HERO
    ====================================================== -->
    <section
      class="relative overflow-hidden rounded-[28px] border border-cyan-100 bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 px-5 py-6 text-white shadow-xl shadow-cyan-900/10 sm:px-7 sm:py-7"
    >
      <div
        class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-blue-300/15 blur-3xl"
      />

      <div
        class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"
      >
        <div class="flex min-w-0 items-start gap-4">
          <div
            class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex"
          >
            <UIcon
              name="i-lucide-message-square-text"
              class="size-7"
            />
          </div>

          <div class="min-w-0">
            <div
              class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-cyan-50"
            >
              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Administrator Portal
              </span>

              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                School-Wide Feedback
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Overall Feedback Results
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-cyan-50/90">
              Review student feedback about school facilities, services, and
              the overall learning experience.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ summary.totalSubmissions }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-cyan-100"
            >
              Submissions
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ summary.totalAnswers }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-cyan-100"
            >
              Answers
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ summary.totalSections }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-cyan-100"
            >
              Sections
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
      KPI CARDS
    ====================================================== -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        class="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Submissions
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ summary.totalSubmissions }}
            </p>
          </div>

          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          >
            <UIcon name="i-lucide-files" class="size-5" />
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-violet-100 bg-violet-50/70 p-5 dark:border-violet-900 dark:bg-violet-950/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Unique Students
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ summary.totalStudents }}
            </p>
          </div>

          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
          >
            <UIcon name="i-lucide-users-round" class="size-5" />
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-amber-100 bg-amber-50/70 p-5 dark:border-amber-900 dark:bg-amber-950/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Answers
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ summary.totalAnswers }}
            </p>
          </div>

          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          >
            <UIcon name="i-lucide-list-checks" class="size-5" />
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5 dark:border-cyan-900 dark:bg-cyan-950/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Feedback Sections
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ summary.totalSections }}
            </p>
          </div>

          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400"
          >
            <UIcon name="i-lucide-layout-list" class="size-5" />
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
      FILTERS
    ====================================================== -->
    <section
      class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="mb-4">
        <h2 class="text-sm font-bold text-gray-900 dark:text-white">
          Overall Feedback Filters
        </h2>

        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Search and filter feedback submissions by course and academic period.
        </p>
      </div>

      <div
        class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(240px,1.25fr)_minmax(190px,1fr)_minmax(180px,0.9fr)_minmax(180px,0.9fr)]"
      >
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search student, course, or answer..."
          class="w-full"
        />

        <USelectMenu
          v-model="selectedCourse"
          :items="courseOptions"
          value-key="value"
          class="w-full"
        />

        <USelectMenu
          v-model="selectedSemester"
          :items="semesterOptions"
          value-key="value"
          class="w-full"
        />

        <USelectMenu
          v-model="selectedSchoolYear"
          :items="schoolYearOptions"
          value-key="value"
          class="w-full"
        />
      </div>

      <div
        v-if="hasActiveFilters"
        class="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-800"
      >
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
          Active filters:
        </span>

        <UBadge v-if="searchQuery" color="neutral" variant="subtle">
          Search: {{ searchQuery }}
        </UBadge>

        <UBadge
          v-if="selectedCourse !== 'all'"
          color="primary"
          variant="subtle"
        >
          {{ selectedCourse }}
        </UBadge>

        <UBadge
          v-if="selectedSemester !== 'all'"
          color="success"
          variant="subtle"
        >
          {{ selectedSemester }}
        </UBadge>

        <UBadge
          v-if="selectedSchoolYear !== 'all'"
          color="warning"
          variant="subtle"
        >
          {{ selectedSchoolYear }}
        </UBadge>

        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
          icon="i-lucide-x"
          @click="clearFilters"
        >
          Clear filters
        </UButton>
      </div>
    </section>

    <!-- =====================================================
      LOADING
    ====================================================== -->
    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-20 w-full rounded-2xl" />
      <USkeleton class="h-[420px] w-full rounded-2xl" />
    </div>

    <!-- =====================================================
      ERROR
    ====================================================== -->
    <section
      v-else-if="loadError"
      class="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <div
        class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
      >
        <UIcon name="i-lucide-triangle-alert" class="size-7" />
      </div>

      <h2 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
        Unable to load feedback
      </h2>

      <p
        class="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400"
      >
        {{ loadError }}
      </p>

      <UButton
        class="mt-5"
        icon="i-lucide-refresh-cw"
        @click="getOverallFeedbacks"
      >
        Try Again
      </UButton>
    </section>

    <template v-else>
      <!-- ===================================================
        SUBMISSION TABLE
      ==================================================== -->
      <section
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between dark:border-gray-800"
        >
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              Submission List
            </h2>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Showing {{ filteredFeedbacks.length }} feedback submission{{
                filteredFeedbacks.length === 1 ? '' : 's'
              }}.
            </p>
          </div>

          <USelect
            v-model="pageSize"
            :items="pageSizeOptions"
            class="w-full sm:w-32"
          />
        </div>

        <div v-if="!filteredFeedbacks.length" class="px-6 py-16 text-center">
          <div
            class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400"
          >
            <UIcon
              :name="
                feedbacks.length
                  ? 'i-lucide-search-x'
                  : 'i-lucide-message-square-off'
              "
              class="size-8"
            />
          </div>

          <h3 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
            {{
              feedbacks.length
                ? 'No matching feedback found'
                : 'No overall feedback available'
            }}
          </h3>

          <p
            class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400"
          >
            {{
              feedbacks.length
                ? 'Try changing or clearing the current filters.'
                : 'No overall feedback submissions were found.'
            }}
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[980px] text-sm">
            <thead
              class="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40 dark:text-gray-400"
            >
              <tr>
                <th class="px-5 py-3 text-left">Student</th>
                <th class="px-4 py-3 text-left">Course</th>
                <th class="px-4 py-3 text-left">School Year</th>
                <th class="px-4 py-3 text-left">Semester</th>
                <th class="px-4 py-3 text-center">Answers</th>
                <th class="px-4 py-3 text-left">Date</th>
                <th class="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="feedback in paginatedFeedbacks"
                :key="getFeedbackKey(feedback)"
                class="transition hover:bg-gray-50/80 dark:hover:bg-gray-950/30"
              >
                <td class="px-5 py-4">
                  <div class="flex min-w-0 items-center gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm"
                    >
                      {{ createInitials(getStudentName(feedback)) }}
                    </div>

                    <div class="min-w-0">
                      <p
                        class="truncate font-bold text-gray-900 dark:text-white"
                      >
                        {{ getStudentName(feedback) }}
                      </p>

                      <p
                        class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400"
                      >
                        {{ feedback.student?.student_id || 'No student ID' }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
                  {{ getCourseName(feedback) }}
                </td>

                <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
                  {{ getSchoolYear(feedback) }}
                </td>

                <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
                  {{ getSemester(feedback) }}
                </td>

                <td class="px-4 py-4 text-center font-semibold">
                  {{ getResponses(feedback).length }}
                </td>

                <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
                  {{ formatDate(getFeedbackDate(feedback)) }}
                </td>

                <td class="px-5 py-4 text-center">
                  <UButton
                    size="xs"
                    color="neutral"
                    variant="soft"
                    icon="i-lucide-eye"
                    @click="openFeedback(feedback)"
                  >
                    View
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="filteredFeedbacks.length"
          class="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
        >
          <p
            class="text-center text-xs text-gray-500 sm:text-left dark:text-gray-400"
          >
            Showing {{ paginationStart }}–{{ paginationEnd }} of
            {{ filteredFeedbacks.length }} submissions
          </p>

          <div class="flex items-center justify-center gap-2">
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-chevron-left"
              square
              :disabled="page <= 1"
              @click="prevPage"
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
              @click="nextPage"
            />
          </div>
        </div>
      </section>

      <!-- ===================================================
        GROUPED RESPONSE ANALYTICS
      ==================================================== -->
      <section class="space-y-5">
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Grouped Response Summary
          </h2>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Responses are grouped by section and question.
          </p>
        </div>

        <section
          v-for="section in groupedResponseSections"
          :key="section.name"
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-950/40"
          >
            <div>
              <h3
                class="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-white"
              >
                {{ section.name }}
              </h3>

              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ section.answerCount }} answer{{
                  section.answerCount === 1 ? '' : 's'
                }}
                across {{ section.questions.length }} question{{
                  section.questions.length === 1 ? '' : 's'
                }}.
              </p>
            </div>

            <UBadge color="info" variant="subtle">
              {{ section.questions.length }}
              question{{ section.questions.length === 1 ? '' : 's' }}
            </UBadge>
          </div>

          <div class="divide-y divide-gray-200 dark:divide-gray-800">
            <article
              v-for="question in section.questions"
              :key="question.question"
              class="p-5"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white">
                    {{ question.question }}
                  </h4>

                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {{ question.answers.length }} response{{
                      question.answers.length === 1 ? '' : 's'
                    }}
                  </p>
                </div>

                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :icon="
                    expandedQuestions.has(
                      getQuestionKey(section.name, question.question)
                    )
                      ? 'i-lucide-chevron-up'
                      : 'i-lucide-chevron-down'
                  "
                  @click="
                    toggleQuestion(
                      section.name,
                      question.question
                    )
                  "
                >
                  {{
                    expandedQuestions.has(
                      getQuestionKey(section.name, question.question)
                    )
                      ? 'Hide'
                      : 'Show'
                  }}
                </UButton>
              </div>

              <div
                v-if="
                  expandedQuestions.has(
                    getQuestionKey(section.name, question.question)
                  )
                "
                class="mt-4 space-y-3"
              >
                <div
                  v-for="(answer, index) in question.answers"
                  :key="`${question.question}-${index}`"
                  class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40"
                >
                  <p
                    class="whitespace-pre-line text-sm leading-6 text-gray-700 dark:text-gray-300"
                  >
                    {{ answer.answer || 'No answer provided.' }}
                  </p>

                  <div
                    class="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400"
                  >
                    <span>{{ answer.student }}</span>
                    <span>•</span>
                    <span>{{ answer.course }}</span>
                    <span>•</span>
                    <span>{{ answer.semester }}</span>
                    <span>•</span>
                    <span>{{ answer.school_year }}</span>
                    <span>•</span>
                    <span>{{ formatDate(answer.date) }}</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      </section>
    </template>

    <!-- =====================================================
      DETAILS MODAL
    ====================================================== -->
    <UModal v-model:open="showDetails">
      <template #content>
        <div
          v-if="selectedFeedback"
          class="max-h-[88vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900"
        >
          <div
            class="relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-6 py-6 text-white"
          >
            <div
              class="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-white/10 blur-3xl"
            />

            <div class="relative flex items-start justify-between gap-4">
              <div class="flex min-w-0 items-center gap-4">
                <div
                  class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 font-bold"
                >
                  {{ createInitials(getStudentName(selectedFeedback)) }}
                </div>

                <div class="min-w-0">
                  <p
                    class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200"
                  >
                    Overall Feedback Submission
                  </p>

                  <h2 class="mt-1 truncate text-xl font-bold">
                    {{ getStudentName(selectedFeedback) }}
                  </h2>

                  <p class="mt-1 truncate text-xs text-slate-300">
                    {{ getCourseName(selectedFeedback) }}
                  </p>
                </div>
              </div>

              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                square
                class="text-white hover:bg-white/10"
                @click="showDetails = false"
              />
            </div>
          </div>

          <div class="space-y-5 p-6">
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <InfoBox
                label="Answers"
                :value="getResponses(selectedFeedback).length"
              />

              <InfoBox
                label="Semester"
                :value="getSemester(selectedFeedback)"
              />

              <InfoBox
                label="School Year"
                :value="getSchoolYear(selectedFeedback)"
              />

              <InfoBox
                label="Date"
                :value="formatDate(getFeedbackDate(selectedFeedback))"
                tone="cyan"
              />
            </div>

            <section
              v-if="getResponses(selectedFeedback).length"
              class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <div
                class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                  Feedback Responses
                </h3>
              </div>

              <div class="divide-y divide-gray-200 dark:divide-gray-800">
                <article
                  v-for="(response, index) in getResponses(selectedFeedback)"
                  :key="`${response.section}-${response.question}-${index}`"
                  class="p-4"
                >
                  <div class="flex items-start gap-3">
                    <span
                      class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-xs font-bold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400"
                    >
                      {{ index + 1 }}
                    </span>

                    <div class="min-w-0">
                      <UBadge color="info" variant="subtle" size="sm">
                        {{ response.section || response.category || 'General' }}
                      </UBadge>

                      <h4
                        class="mt-2 text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                      >
                        {{ response.question || 'No question' }}
                      </h4>

                      <p
                        class="mt-2 whitespace-pre-line rounded-xl bg-gray-50 p-3 text-sm leading-6 text-gray-600 dark:bg-gray-950/40 dark:text-gray-400"
                      >
                        {{ response.answer || 'No answer provided.' }}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <div
              v-else
              class="rounded-2xl border border-dashed border-gray-300 px-5 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400"
            >
              This submission does not contain any responses.
            </div>

            <div class="flex justify-end">
              <UButton
                color="neutral"
                variant="outline"
                @click="showDetails = false"
              >
                Close
              </UButton>
            </div>
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

const { $api } = useNuxtApp()
const toast = useToast()

const InfoBox = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    tone: {
      type: String,
      default: 'neutral'
    }
  },

  setup(props) {
    return () =>
      h(
        'div',
        {
          class:
            props.tone === 'cyan'
              ? 'rounded-xl border border-cyan-100 bg-cyan-50 p-3 dark:border-cyan-900 dark:bg-cyan-950/20'
              : 'rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40'
        },
        [
          h(
            'p',
            {
              class: 'text-[10px] uppercase text-gray-400'
            },
            props.label
          ),

          h(
            'p',
            {
              class:
                props.tone === 'cyan'
                  ? 'mt-1 text-sm font-bold text-cyan-700 dark:text-cyan-400'
                  : 'mt-1 text-sm font-bold text-gray-800 dark:text-gray-200'
            },
            String(props.value ?? '')
          )
        ]
      )
  }
})

const loading = ref(false)
const loadError = ref('')
const feedbacks = ref<any[]>([])

const selectedFeedback = ref<any>(null)
const showDetails = ref(false)

const searchQuery = ref('')
const selectedCourse = ref('all')
const selectedSemester = ref('all')
const selectedSchoolYear = ref('all')

const page = ref(1)
const pageSize = ref(20)

const expandedQuestions = ref<Set<string>>(new Set())

const pageSizeOptions = [
  { label: '10 rows', value: 10 },
  { label: '20 rows', value: 20 },
  { label: '50 rows', value: 50 },
  { label: '100 rows', value: 100 }
]

const makeOptions = (
  values: any[],
  allLabel: string
) => {
  const uniqueValues = Array.from(
    new Set(
      values.filter(
        value =>
          value &&
          value !== 'N/A' &&
          value !== 'Not specified'
      )
    )
  ).sort((a, b) =>
    String(a).localeCompare(String(b))
  )

  return [
    {
      label: allLabel,
      value: 'all'
    },
    ...uniqueValues.map(value => ({
      label: String(value),
      value
    }))
  ]
}

const courseOptions = computed(() =>
  makeOptions(
    feedbacks.value.map(getCourseName),
    'All Courses'
  )
)

const semesterOptions = computed(() =>
  makeOptions(
    feedbacks.value.map(getSemester),
    'All Semesters'
  )
)

const schoolYearOptions = computed(() => {
  const options = makeOptions(
    feedbacks.value.map(getSchoolYear),
    'All School Years'
  )

  return [
    options[0],
    ...options
      .slice(1)
      .sort((a, b) =>
        String(b.value).localeCompare(
          String(a.value)
        )
      )
  ]
})

const filteredFeedbacks = computed(() => {
  const query = searchQuery.value
    .trim()
    .toLowerCase()

  return feedbacks.value.filter(feedback => {
    const responseText = getResponses(feedback)
      .map(response =>
        [
          response.section,
          response.category,
          response.question,
          response.answer
        ].join(' ')
      )
      .join(' ')

    const searchable = [
      getStudentName(feedback),
      getCourseName(feedback),
      getSemester(feedback),
      getSchoolYear(feedback),
      responseText
    ]
      .join(' ')
      .toLowerCase()

    const matchesSearch =
      !query ||
      searchable.includes(query)

    const matchesCourse =
      selectedCourse.value === 'all' ||
      getCourseName(feedback) === selectedCourse.value

    const matchesSemester =
      selectedSemester.value === 'all' ||
      getSemester(feedback) === selectedSemester.value

    const matchesSchoolYear =
      selectedSchoolYear.value === 'all' ||
      getSchoolYear(feedback) === selectedSchoolYear.value

    return (
      matchesSearch &&
      matchesCourse &&
      matchesSemester &&
      matchesSchoolYear
    )
  })
})

const groupedResponseSections = computed(() => {
  const sections = new Map<string, any>()

  filteredFeedbacks.value.forEach(feedback => {
    getResponses(feedback).forEach(response => {
      const sectionName =
        response.section ||
        response.category ||
        'General'

      const question =
        response.question ||
        'No question'

      if (!sections.has(sectionName)) {
        sections.set(sectionName, {
          name: sectionName,
          questions: new Map<string, any[]>()
        })
      }

      const section = sections.get(sectionName)

      if (!section.questions.has(question)) {
        section.questions.set(question, [])
      }

      section.questions.get(question).push({
        answer: response.answer,
        student: getStudentName(feedback),
        course: getCourseName(feedback),
        semester: getSemester(feedback),
        school_year: getSchoolYear(feedback),
        date: getFeedbackDate(feedback)
      })
    })
  })

  return Array.from(sections.values())
    .map(section => {
      const questions = Array.from(
        section.questions.entries()
      ).map(([question, answers]) => ({
        question,
        answers
      }))

      return {
        name: section.name,
        questions,
        answerCount: questions.reduce(
          (sum, question) =>
            sum + question.answers.length,
          0
        )
      }
    })
    .sort((a, b) =>
      a.name.localeCompare(b.name)
    )
})

const summary = computed(() => {
  const studentKeys = new Set(
    feedbacks.value
      .map(
        feedback =>
          feedback?.student?.documentId ||
          feedback?.student?.id ||
          feedback?.evaluator_user?.documentId ||
          feedback?.evaluator_user?.id ||
          getStudentName(feedback)
      )
      .filter(Boolean)
  )

  const sectionKeys = new Set<string>()
  let totalAnswers = 0

  feedbacks.value.forEach(feedback => {
    getResponses(feedback).forEach(response => {
      totalAnswers += 1

      sectionKeys.add(
        response.section ||
        response.category ||
        'General'
      )
    })
  })

  return {
    totalSubmissions: feedbacks.value.length,
    totalStudents: studentKeys.size,
    totalAnswers,
    totalSections: sectionKeys.size
  }
})

const hasActiveFilters = computed(() =>
  Boolean(
    searchQuery.value ||
    selectedCourse.value !== 'all' ||
    selectedSemester.value !== 'all' ||
    selectedSchoolYear.value !== 'all'
  )
)

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(
      filteredFeedbacks.value.length /
      Number(pageSize.value)
    )
  )
)

const paginatedFeedbacks = computed(() => {
  const size = Number(pageSize.value)
  const start = (page.value - 1) * size

  return filteredFeedbacks.value.slice(
    start,
    start + size
  )
})

const paginationStart = computed(() =>
  filteredFeedbacks.value.length
    ? (page.value - 1) *
        Number(pageSize.value) +
      1
    : 0
)

const paginationEnd = computed(() =>
  Math.min(
    page.value * Number(pageSize.value),
    filteredFeedbacks.value.length
  )
)

const getStudentName = (feedback: any) => {
  const student = feedback?.student
  const evaluator = feedback?.evaluator_user

  const firstName =
    student?.first_name ||
    student?.user_info?.first_name ||
    evaluator?.user_info?.first_name ||
    ''

  const middleName =
    student?.middle_name ||
    student?.user_info?.middle_name ||
    evaluator?.user_info?.middle_name ||
    ''

  const lastName =
    student?.last_name ||
    student?.user_info?.last_name ||
    evaluator?.user_info?.last_name ||
    ''

  const constructedName = [
    firstName,
    middleName,
    lastName
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  return (
    student?.name ||
    student?.full_name ||
    constructedName ||
    evaluator?.name ||
    evaluator?.full_name ||
    evaluator?.username ||
    evaluator?.email ||
    student?.student_id ||
    'Unknown Student'
  )
}

const getCourseName = (feedback: any) =>
  feedback?.course?.code ||
  feedback?.course?.name ||
  'N/A'

const getSemester = (feedback: any) =>
  feedback?.semester || 'N/A'

const getSchoolYear = (feedback: any) =>
  feedback?.school_year || 'N/A'

const getFeedbackDate = (feedback: any) =>
  feedback?.date ||
  feedback?.submittedAt ||
  feedback?.createdAt ||
  null

const getResponses = (feedback: any) => {
  const responses =
    feedback?.responses ||
    feedback?.answers ||
    []

  return Array.isArray(responses)
    ? responses
    : []
}

const getFeedbackKey = (feedback: any) =>
  feedback?.documentId ||
  feedback?.id ||
  `${getStudentName(feedback)}-${getFeedbackDate(feedback)}`

const getQuestionKey = (
  section: string,
  question: string
) =>
  `${section}::${question}`

const toggleQuestion = (
  section: string,
  question: string
) => {
  const key = getQuestionKey(
    section,
    question
  )

  const next = new Set(
    expandedQuestions.value
  )

  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }

  expandedQuestions.value = next
}

const createInitials = (value: string) =>
  String(value || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part =>
      part.charAt(0).toUpperCase()
    )
    .join('')

const formatDate = (value: any) => {
  if (!value) {
    return 'N/A'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getOverallFeedbacks = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const query: any = {
      'populate[student]':
        true,

      'populate[course]':
        true,

      'populate[evaluator_user][populate][0]':
        'user_info',

      'sort[0]':
        'createdAt:desc',

      'pagination[pageSize]':
        10000
    }

    const res: any = await $api(
      '/overall-feedbacks',
      {
        query
      }
    )

    feedbacks.value =
      res.data || []

    page.value = 1
  } catch (error: any) {
    console.error(
      'Overall feedback loading error:',
      error
    )

    feedbacks.value = []

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to load overall feedback submissions.'

    toast.add({
      title: 'Unable to load feedback',
      description: loadError.value,
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCourse.value = 'all'
  selectedSemester.value = 'all'
  selectedSchoolYear.value = 'all'
  page.value = 1
}

const prevPage = async () => {
  if (page.value <= 1) {
    return
  }

  page.value -= 1
  await scrollToTable()
}

const nextPage = async () => {
  if (page.value >= totalPages.value) {
    return
  }

  page.value += 1
  await scrollToTable()
}

const scrollToTable = async () => {
  await nextTick()

  if (!import.meta.client) {
    return
  }

  window.scrollTo({
    top: 500,
    behavior: 'smooth'
  })
}

const openFeedback = (feedback: any) => {
  selectedFeedback.value = feedback
  showDetails.value = true
}

watch(
  [
    searchQuery,
    selectedCourse,
    selectedSemester,
    selectedSchoolYear,
    pageSize
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

onMounted(() => {
  getOverallFeedbacks()
})
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
