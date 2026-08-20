<template>
  <div class="space-y-6 pb-10">
    <!-- =====================================================
      HERO
    ====================================================== -->
    <section
      class="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7 dark:border-emerald-900"
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
            <UIcon name="i-lucide-school" class="size-7" />
          </div>

          <div class="min-w-0">
            <div
              class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-50"
            >
              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Student Portal
              </span>

              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Student – School
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Overall School Performance
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Share your experience and observations about the institution, its
              services, facilities, and overall performance.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[360px]">
          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ allCriteria.length }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100"
            >
              Questions
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">
              {{ answeredCount }}
            </p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100"
            >
              Answered
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"
          >
            <p class="text-2xl font-bold">{{ completionProgress }}%</p>

            <p
              class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100"
            >
              Complete
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
      SCHOOL INFORMATION
    ====================================================== -->
    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex items-center gap-4 px-5 py-4 sm:px-6">
        <div
          class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 p-1 dark:border-emerald-900 dark:bg-emerald-950/30"
        >
          <img
            src="/logo.png"
            alt="St. Nicolas College"
            class="size-9 object-contain"
          />
        </div>

        <div class="min-w-0 flex-1">
          <h2
            class="text-sm font-bold uppercase tracking-tight text-gray-900 sm:text-base dark:text-white"
          >
            St. Nicolas College of Business and Technology
          </h2>

          <p class="mt-0.5 text-xs leading-5 text-gray-500 dark:text-gray-400">
            MEL-VI Bldg., Jose Abad Santos Avenue, City of San Fernando,
            Pampanga · Tel. No. (045) 455-0958
          </p>
        </div>

        <div
          class="hidden rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-right sm:block dark:border-emerald-900 dark:bg-emerald-950/30"
        >
          <p
            class="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400"
          >
            Feedback Form
          </p>

          <p class="mt-0.5 text-xs font-bold text-gray-800 dark:text-gray-200">
            Student – School
          </p>

          <p class="mt-1 text-[10px] font-medium text-cyan-600 dark:text-cyan-400">
            Text / Comment
          </p>
        </div>
      </div>
    </section>

    <!-- =====================================================
      LOADING STATE
    ====================================================== -->
    <div v-if="pending || !pageReady" class="space-y-5">
      <USkeleton class="h-32 w-full rounded-2xl" />
      <USkeleton class="h-56 w-full rounded-2xl" />
      <USkeleton class="h-80 w-full rounded-2xl" />
    </div>

    <!-- =====================================================
      LOAD ERROR
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
        Unable to load the feedback form
      </h2>

      <p
        class="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400"
      >
        {{ loadError }}
      </p>

      <UButton
        class="mt-5"
        icon="i-lucide-refresh-cw"
        :loading="pending"
        @click="loadData"
      >
        Try Again
      </UButton>
    </section>

    <template v-else>
      <!-- ===================================================
        ACADEMIC PERIOD
      ==================================================== -->
      <section
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="border-b border-gray-200 px-5 py-4 sm:px-6 dark:border-gray-800"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
            >
              <UIcon name="i-lucide-calendar-range" class="size-4.5" />
            </div>

            <div>
              <h2 class="text-sm font-bold text-gray-900 dark:text-white">
                Active Evaluation Period
              </h2>

              <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                The semester and school year are based on the active academic
                period.
              </p>
            </div>
          </div>
        </div>

        <div
          class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3"
        >
          <UFormField label="Semester">
            <USelectMenu
              v-model="form.semester"
              :items="semesterOptions"
              value-key="value"
              disabled
              icon="i-lucide-calendar-days"
              placeholder="No active semester"
              class="w-full"
              size="lg"
            />
          </UFormField>

          <UFormField label="School Year">
            <UInput
              v-model="form.schoolYear"
              disabled
              icon="i-lucide-graduation-cap"
              placeholder="No active school year"
              class="w-full"
              size="lg"
            />
          </UFormField>

          <UFormField label="Submission Date">
            <UInput
              v-model="form.date"
              type="date"
              icon="i-lucide-calendar-check"
              :disabled="isSubmitted || checkingSubmission"
              class="w-full"
              size="lg"
            />
          </UFormField>
        </div>

        <div
          v-if="checkingSubmission"
          class="flex items-center gap-2 border-t border-gray-200 px-5 py-3 text-xs text-gray-500 sm:px-6 dark:border-gray-800 dark:text-gray-400"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="size-4 animate-spin text-emerald-500"
          />

          Checking your previous submission...
        </div>
      </section>

      <!-- ===================================================
        NO ACTIVE SCHOOL YEAR
      ==================================================== -->
      <section
        v-if="!activeSchoolYear"
        class="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-900 dark:bg-amber-950/20"
      >
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        >
          <UIcon name="i-lucide-calendar-x" class="size-7" />
        </div>

        <h2 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
          No active evaluation period
        </h2>

        <p
          class="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600 dark:text-gray-400"
        >
          The administrator has not configured an active school year and
          semester. The feedback form cannot be submitted yet.
        </p>
      </section>

      <!-- ===================================================
        ALREADY SUBMITTED
      ==================================================== -->
      <section
        v-else-if="isSubmitted"
        class="relative overflow-hidden rounded-[28px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-7 shadow-sm sm:p-10 dark:border-emerald-900 dark:from-emerald-950/25 dark:via-gray-900 dark:to-teal-950/20"
      >
        <div
          class="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-emerald-300/20 blur-3xl"
        />

        <div class="relative text-center">
          <div
            class="mx-auto flex size-20 items-center justify-center rounded-[26px] bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25"
          >
            <UIcon name="i-lucide-circle-check-big" class="size-10" />
          </div>

          <UBadge color="success" variant="subtle" class="mt-5">
            Feedback Submitted
          </UBadge>

          <h2
            class="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Thank you for your feedback
          </h2>

          <p
            class="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400"
          >
            You have already submitted your overall school feedback for
            <strong>{{ semesterValue }}</strong
            >, <strong>{{ form.schoolYear }}</strong
            >. No further action is required.
          </p>

          <div
            class="mx-auto mt-7 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <div
              class="rounded-2xl border border-emerald-100 bg-white/70 p-4 dark:border-emerald-900 dark:bg-gray-900/70"
            >
              <p
                class="text-[10px] font-semibold uppercase tracking-wide text-gray-400"
              >
                Semester
              </p>

              <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                {{ semesterValue }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-emerald-100 bg-white/70 p-4 dark:border-emerald-900 dark:bg-gray-900/70"
            >
              <p
                class="text-[10px] font-semibold uppercase tracking-wide text-gray-400"
              >
                School Year
              </p>

              <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                {{ form.schoolYear }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================
        NO CRITERIA
      ==================================================== -->
      <section
        v-else-if="!sections.length"
        class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-900"
      >
        <div
          class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
        >
          <UIcon name="i-lucide-list-x" class="size-8" />
        </div>

        <h2 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">
          No feedback questions found
        </h2>

        <p
          class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400"
        >
          Overall school feedback criteria have not been configured. Please
          contact the administrator.
        </p>
      </section>

      <!-- ===================================================
        FEEDBACK FORM
      ==================================================== -->
      <template v-else>
        <!-- INSTRUCTIONS -->
        <section
          class="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/20"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
            >
              <UIcon name="i-lucide-info" class="size-5" />
            </div>

            <div class="min-w-0">
              <h2 class="text-sm font-bold text-gray-900 dark:text-white">
                Feedback Instructions
              </h2>

              <p
                class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                This evaluation uses the
                <strong>{{ evaluationType?.name }}</strong>
                <strong>Text / Comment</strong> response type. Answer every
                question honestly and constructively using written feedback.
                Your responses will help SNC improve its services, facilities,
                processes, and student experience.
              </p>

              <div class="mt-3 flex flex-wrap items-center gap-2">
                <UBadge color="info" variant="subtle">
                  <UIcon name="i-lucide-message-square-text" class="mr-1 size-3.5" />
                  Text / Comment
                </UBadge>

                <span class="text-[11px] text-gray-500 dark:text-gray-400">
                  No numerical rating scale is required.
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- PROGRESS -->
        <section
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 class="text-sm font-bold text-gray-900 dark:text-white">
                Form Completion
              </h2>

              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ answeredCount }} of {{ allCriteria.length }}
                questions answered
              </p>
            </div>

            <div
              class="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
            >
              {{ completionProgress }}%
            </div>
          </div>

          <div
            class="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
          >
            <div
              class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-[width] duration-500"
              :style="{ width: `${completionProgress}%` }"
            />
          </div>
        </section>

        <!-- QUESTIONS -->
        <section class="space-y-5">
          <article
            v-for="(section, sectionIndex) in sections"
            :key="section.id"
            class="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-5 py-5 text-white sm:px-6 dark:border-gray-800"
            >
              <div
                class="pointer-events-none absolute -right-12 -top-16 size-44 rounded-full bg-emerald-500/20 blur-3xl"
              />

              <div class="relative flex items-center justify-between gap-4">
                <div class="flex min-w-0 items-center gap-3">
                  <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-emerald-300"
                  >
                    <UIcon name="i-lucide-message-square-more" class="size-5" />
                  </div>

                  <div class="min-w-0">
                    <p
                      class="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300"
                    >
                      Feedback Section {{ sectionIndex + 1 }}
                    </p>

                    <h2 class="mt-1 truncate text-base font-bold sm:text-lg">
                      {{ section.title }}
                    </h2>
                  </div>
                </div>

                <UBadge color="neutral" variant="solid" size="sm">
                  {{ getSectionAnsweredCount(section) }}/{{
                    section.evaluation_criteria?.length || 0
                  }}
                </UBadge>
              </div>
            </div>

            <div class="divide-y divide-gray-200 dark:divide-gray-800">
              <div
                v-for="criteria in section.evaluation_criteria"
                :key="criteria.id"
                :data-criteria-id="criteria.id"
                class="scroll-mt-24 p-5 sm:p-6"
              >
                <div class="flex items-start gap-3">
                  <span
                    class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                  >
                    {{ criteria.order }}
                  </span>

                  <div class="min-w-0 flex-1">
                    <div
                      class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <p
                        class="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200"
                      >
                        {{ criteria.statement }}
                      </p>

                      <UBadge
                        v-if="isCriteriaAnswered(criteria.id)"
                        color="success"
                        variant="subtle"
                        size="sm"
                        class="shrink-0"
                      >
                        Answered
                      </UBadge>
                    </div>

                    <UTextarea
                      v-model="responses[criteria.id]"
                      :rows="4"
                      autoresize
                      placeholder="Write a clear and constructive answer..."
                      class="mt-3 w-full"
                      :disabled="submitLoading"
                    />

                    <div
                      class="mt-2 flex items-center justify-between gap-3 text-[11px]"
                    >
                      <span
                        :class="
                          isCriteriaAnswered(criteria.id)
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-400'
                        "
                      >
                        {{
                          isCriteriaAnswered(criteria.id)
                            ? "Response completed"
                            : "A response is required"
                        }}
                      </span>

                      <span class="shrink-0 text-gray-400">
                        {{ String(responses[criteria.id] || "").length }}
                        characters
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>

        <!-- SUBMISSION ERROR -->
        <div
          v-if="submitError"
          class="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20"
        >
          <UIcon
            name="i-lucide-circle-alert"
            class="mt-0.5 size-5 shrink-0 text-red-600 dark:text-red-400"
          />

          <p class="text-sm font-medium text-red-700 dark:text-red-300">
            {{ submitError }}
          </p>
        </div>

        <!-- SUBMISSION PANEL -->
        <section
          class="sticky bottom-4 z-20 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white/95 p-5 shadow-xl shadow-slate-900/10 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900/95"
        >
          <div>
            <div class="flex items-center gap-2">
              <div
                class="flex size-9 items-center justify-center rounded-xl"
                :class="
                  isFormValid
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                "
              >
                <UIcon
                  :name="
                    isFormValid
                      ? 'i-lucide-circle-check'
                      : 'i-lucide-circle-alert'
                  "
                  class="size-4.5"
                />
              </div>

              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                  {{
                    isFormValid ? "Ready to submit" : "Complete all questions"
                  }}
                </h3>

                <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {{
                    unansweredCount
                      ? `${unansweredCount} required response(s) remaining.`
                      : "Review your responses before submitting."
                  }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-rotate-ccw"
              :disabled="submitLoading"
              @click="resetForm"
            >
              Reset Responses
            </UButton>

            <UButton
              icon="i-lucide-send"
              size="lg"
              :loading="submitLoading"
              :disabled="!isFormValid || submitLoading"
              @click="openSubmitConfirmation"
            >
              Submit Feedback
            </UButton>
          </div>
        </section>
      </template>
    </template>

    <!-- =====================================================
      SUBMISSION CONFIRMATION
    ====================================================== -->
    <UModal v-model:open="confirmationOpen">
      <template #content>
        <div
          class="relative overflow-hidden rounded-[28px] border border-white/20 bg-white/95 shadow-[0_20px_80px_rgba(15,23,42,0.20)] backdrop-blur-2xl dark:border-gray-800 dark:bg-gray-900/95"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 dark:from-emerald-950/20 dark:via-gray-900 dark:to-teal-950/20"
          />

          <div
            class="absolute -right-10 -top-10 size-44 rounded-full bg-emerald-500/10 blur-3xl"
          />

          <div class="relative p-7">
            <div
              class="mx-auto flex size-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/30"
            >
              <UIcon name="i-lucide-send" class="size-9" />
            </div>

            <div class="mt-5 text-center">
              <h2
                class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                Submit your feedback?
              </h2>

              <p
                class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400"
              >
                You have answered all {{ allCriteria.length }}
                questions. Submitted feedback may no longer be edited.
              </p>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-3">
              <div
                class="rounded-2xl border border-emerald-100 bg-white/70 p-4 text-center dark:border-emerald-900 dark:bg-gray-950/40"
              >
                <p
                  class="text-[10px] font-semibold uppercase tracking-wide text-gray-400"
                >
                  Semester
                </p>

                <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                  {{ semesterValue }}
                </p>
              </div>

              <div
                class="rounded-2xl border border-emerald-100 bg-white/70 p-4 text-center dark:border-emerald-900 dark:bg-gray-950/40"
              >
                <p
                  class="text-[10px] font-semibold uppercase tracking-wide text-gray-400"
                >
                  School Year
                </p>

                <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                  {{ form.schoolYear }}
                </p>
              </div>
            </div>

            <div class="mt-7 flex gap-3">
              <UButton
                block
                color="neutral"
                variant="soft"
                size="lg"
                class="rounded-2xl"
                :disabled="submitLoading"
                @click="confirmationOpen = false"
              >
                Review Again
              </UButton>

              <UButton
                block
                size="lg"
                icon="i-lucide-send"
                class="rounded-2xl"
                :loading="submitLoading"
                @click="submitOverallFeedback"
              >
                Confirm Submission
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
  middleware: ["auth", "role"],
  role: ["Student"],
});

const { $api } = useNuxtApp();
const { user } = useAuth();
const toast = useToast();

/* =========================================================
   STATE
========================================================= */

const sections = ref<any[]>([]);
const evaluationType = ref<any>(null);
const activeSchoolYear = ref<any>(null);

const responses = ref<Record<string | number, string>>({});

const pending = ref(true);
const pageReady = ref(false);
const checkingSubmission = ref(false);
const isSubmitted = ref(false);

const submitLoading = ref(false);
const submitError = ref("");
const loadError = ref("");

const confirmationOpen = ref(false);

/* =========================================================
   FORM
========================================================= */

const form = reactive({
  semester: null as any,
  schoolYear: "",
  date: new Date().toISOString().slice(0, 10),
});

const semesterOptions = [
  {
    label: "1st Semester",
    value: "1st Semester",
  },
  {
    label: "2nd Semester",
    value: "2nd Semester",
  },
  {
    label: "Summer",
    value: "Summer",
  },
];

/* =========================================================
   COMPUTED
========================================================= */

const semesterValue = computed(() => {
  return form.semester?.value || form.semester || "";
});

const allCriteria = computed(() => {
  return sections.value.flatMap(
    (section: any) => section.evaluation_criteria || [],
  );
});

/* =========================================================
   RESPONSE TYPE FROM EVALUATION TYPE
========================================================= */

const evaluationResponseType = computed(() => {
  return evaluationType.value?.response_type || "text";
});

const isTextEvaluation = computed(() => {
  return evaluationResponseType.value === "text";
});

const answeredCount = computed(() => {
  return allCriteria.value.filter(
    (criteria: any) =>
      String(responses.value[criteria.id] || "").trim().length > 0,
  ).length;
});

const unansweredCount = computed(() => {
  return Math.max(0, allCriteria.value.length - answeredCount.value);
});

const completionProgress = computed(() => {
  if (!allCriteria.value.length) {
    return 0;
  }

  return Math.round((answeredCount.value / allCriteria.value.length) * 100);
});

const isFormValid = computed(() => {
  if (!semesterValue.value || !form.schoolYear || !allCriteria.value.length) {
    return false;
  }

  return allCriteria.value.every(
    (criteria: any) =>
      String(responses.value[criteria.id] || "").trim().length > 0,
  );
});

/* =========================================================
   HELPERS
========================================================= */

const isCriteriaAnswered = (criteriaId: string | number) => {
  return String(responses.value[criteriaId] || "").trim().length > 0;
};

const getSectionAnsweredCount = (section: any) => {
  const criteria = section.evaluation_criteria || [];

  return criteria.filter((item: any) => isCriteriaAnswered(item.id)).length;
};

const scrollToTop = async () => {
  await nextTick();

  if (!import.meta.client) {
    return;
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const scrollToFirstIncomplete = async () => {
  const firstIncomplete = allCriteria.value.find(
    (criteria: any) => !isCriteriaAnswered(criteria.id),
  );

  if (!firstIncomplete) {
    return;
  }

  await nextTick();

  const element = document.querySelector<HTMLElement>(
    `[data-criteria-id="${firstIncomplete.id}"]`,
  );

  element?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

/* =========================================================
   API: ACTIVE SCHOOL YEAR
========================================================= */

const getActiveSchoolYear = async () => {
  const response = await $api("/school-years", {
    query: {
      "filters[active_sy][$eq]": true,
      "pagination[pageSize]": 1,
    },
  });

  activeSchoolYear.value = response.data?.[0] || null;

  if (!activeSchoolYear.value) {
    form.semester = null;
    form.schoolYear = "";
    return;
  }

  form.semester = activeSchoolYear.value.semester;

  form.schoolYear = activeSchoolYear.value.school_year;
};

/* =========================================================
   API: EVALUATION TYPE
========================================================= */

const getEvaluationType = async () => {
  const response = await $api("/evaluation-types", {
    query: {
      "filters[code][$eq]": "student-school",

      "pagination[pageSize]": 1,
    },
  });

  evaluationType.value = response.data?.[0] || null;
};

/* =========================================================
   API: SECTIONS AND QUESTIONS
========================================================= */

const getSections = async () => {
  if (!evaluationType.value?.documentId) {
    return;
  }

  const response = await $api("/evaluation-sections", {
    query: {
      "filters[evaluation_type][documentId][$eq]":
        evaluationType.value.documentId,

      "populate[evaluation_criteria][sort][0]": "order:asc",

      "sort[0]": "order:asc",

      "pagination[pageSize]": 100,
    },
  });

  sections.value = response.data || [];
};

/* =========================================================
   API: CHECK EXISTING SUBMISSION
========================================================= */

const checkIfSubmitted = async () => {
  submitError.value = "";
  isSubmitted.value = false;

  if (!semesterValue.value || !form.schoolYear) {
    return;
  }

  checkingSubmission.value = true;

  try {
    const response = await $api("/overall-feedbacks/check-my-submission", {
      query: {
        semester: semesterValue.value,

        school_year: form.schoolYear,
      },
    });

    isSubmitted.value = response.submitted === true;
  } catch (error) {
    console.error("Submission check error:", error);

    toast.add({
      title: "Submission check failed",
      description:
        "We could not verify whether feedback was already submitted.",
      icon: "i-lucide-triangle-alert",
      color: "warning",
    });
  } finally {
    checkingSubmission.value = false;
  }
};

/* =========================================================
   LOAD PAGE DATA
========================================================= */

const loadData = async () => {
  try {
    pending.value = true;
    pageReady.value = false;
    loadError.value = "";
    submitError.value = "";

    await getActiveSchoolYear();
    await getEvaluationType();

    if (!evaluationType.value) {
      throw new Error("Student-School evaluation type is not configured.");
    }

    if (!isTextEvaluation.value) {
      throw new Error(
        "Student-School must use a Text / Comment response type.",
      );
    }

    await getSections();

    if (activeSchoolYear.value) {
      await checkIfSubmitted();
    }

    pageReady.value = true;
  } catch (error: any) {
    console.error("Overall feedback loading error:", error);

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Failed to load the overall feedback form.";

    pageReady.value = true;
  } finally {
    pending.value = false;
  }
};

/* =========================================================
   CONFIRMATION
========================================================= */

const openSubmitConfirmation = async () => {
  submitError.value = "";

  if (isSubmitted.value) {
    toast.add({
      title: "Already submitted",
      description: "You already submitted your overall feedback.",
      icon: "i-lucide-circle-alert",
      color: "warning",
    });

    return;
  }

  if (!evaluationType.value || !isTextEvaluation.value) {
    submitError.value =
      "The Student-School evaluation type is not configured as Text / Comment.";

    toast.add({
      title: "Invalid evaluation configuration",
      description: submitError.value,
      icon: "i-lucide-triangle-alert",
      color: "error",
    });

    return;
  }

  if (!isFormValid.value) {
    submitError.value = "Please answer every question before submitting.";

    toast.add({
      title: "Incomplete form",
      description: `${unansweredCount.value} response(s) still need to be completed.`,
      icon: "i-lucide-circle-alert",
      color: "warning",
    });

    await scrollToFirstIncomplete();
    return;
  }

  confirmationOpen.value = true;
};

/* =========================================================
   SUBMIT FEEDBACK
========================================================= */

const submitOverallFeedback = async () => {
  submitError.value = "";

  if (isSubmitted.value) {
    confirmationOpen.value = false;

    toast.add({
      title: "Already submitted",
      description: "You already submitted your overall feedback.",
      icon: "i-lucide-circle-alert",
      color: "warning",
    });

    return;
  }

  if (!evaluationType.value || !isTextEvaluation.value) {
    confirmationOpen.value = false;

    submitError.value =
      "The Student-School evaluation type is not configured as Text / Comment.";

    toast.add({
      title: "Invalid evaluation configuration",
      description: submitError.value,
      icon: "i-lucide-triangle-alert",
      color: "error",
    });

    return;
  }

  if (!isFormValid.value) {
    confirmationOpen.value = false;

    submitError.value = "Please answer every question before submitting.";

    await scrollToFirstIncomplete();
    return;
  }

  try {
    submitLoading.value = true;

    const formattedResponses = allCriteria.value.map((criteria: any) => ({
      criterion_id: criteria.id,

      question: criteria.statement,

      answer: String(responses.value[criteria.id] || "").trim(),
    }));

    await $api("/overall-feedbacks/create", {
      method: "POST",

      body: {
        data: {
          semester: semesterValue.value,

          school_year: form.schoolYear,

          date: form.date,

          subject: null,

          evaluation_type: evaluationType.value?.id || null,

          evaluation_type_code: evaluationType.value?.code || "student-school",

          response_type: evaluationResponseType.value,

          responses: formattedResponses,
        },
      },
    });

    confirmationOpen.value = false;
    responses.value = {};
    isSubmitted.value = true;

    toast.add({
      title: "Feedback submitted",
      description:
        "Thank you. Your overall school feedback was submitted successfully.",
      icon: "i-lucide-circle-check",
      color: "success",
    });

    await scrollToTop();
  } catch (error: any) {
    console.error("Overall feedback submission error:", error);

    confirmationOpen.value = false;

    const message =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Failed to submit overall feedback.";

    submitError.value = message;

    toast.add({
      title: "Submission failed",
      description: message,
      icon: "i-lucide-circle-alert",
      color: "error",
    });
  } finally {
    submitLoading.value = false;
  }
};

/* =========================================================
   RESET
========================================================= */

const resetForm = async () => {
  responses.value = {};
  submitError.value = "";

  toast.add({
    title: "Responses cleared",
    description: "All written responses have been reset.",
    icon: "i-lucide-rotate-ccw",
    color: "neutral",
  });

  await scrollToTop();
};

/* =========================================================
   WATCHERS
========================================================= */

watch(
  () => [semesterValue.value, form.schoolYear],
  async (newValue, oldValue) => {
    if (!pageReady.value) {
      return;
    }

    const [semester, schoolYear] = newValue;

    const [oldSemester, oldSchoolYear] = oldValue || [];

    if (semester === oldSemester && schoolYear === oldSchoolYear) {
      return;
    }

    responses.value = {};
    submitError.value = "";

    await checkIfSubmitted();
  },
);

watch(
  user,
  async (value) => {
    if (value?.id) {
      await loadData();
    }
  },
  {
    immediate: true,
  },
);
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
