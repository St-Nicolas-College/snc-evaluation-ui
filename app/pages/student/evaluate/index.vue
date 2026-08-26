<template>

  <div class="space-y-6 pb-10">

    <!-- =====================================================

      PAGE HERO

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

            <UIcon name="i-lucide-clipboard-check" class="size-7" />

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

                Student – Faculty

              </span>

            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">

              Faculty Performance Evaluation

            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">

              Evaluate your assigned faculty members by answering all evaluation

              criteria and providing constructive feedback.

            </p>

          </div>

        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[360px]">

          <div

            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"

          >

            <p class="text-2xl font-bold">

              {{ availableTeacherCount }}

            </p>

            <p

              class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100"

            >

              Available

            </p>

          </div>

          <div

            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"

          >

            <p class="text-2xl font-bold">

              {{ selectedTeacherIds.length }}

            </p>

            <p

              class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100"

            >

              Selected

            </p>

          </div>

          <div

            class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl"

          >

            <p class="text-2xl font-bold">

              {{ completedEvaluationCount }}

            </p>

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

            Evaluation Form

          </p>

          <p class="mt-0.5 text-xs font-bold text-gray-800 dark:text-gray-200">

            Student – Faculty

          </p>

        </div>

      </div>

    </section>

    <!-- =====================================================

      LOADING STATE

    ====================================================== -->

    <div

      v-if="pending"

      class="grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)]"

    >

      <div

        class="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"

      >

        <USkeleton class="h-6 w-40 rounded-lg" />

        <USkeleton

          v-for="index in 4"

          :key="index"

          class="h-16 w-full rounded-xl"

        />

      </div>

      <div class="space-y-5">

        <USkeleton class="h-32 w-full rounded-2xl" />

        <USkeleton class="h-[480px] w-full rounded-2xl" />

      </div>

    </div>

    <!-- =====================================================

      ERROR STATE

    ====================================================== -->

    <div

      v-else-if="error"

      class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/20"

    >

      <div

        class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"

      >

        <UIcon name="i-lucide-triangle-alert" class="size-7" />

      </div>

      <h2 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">

        Unable to load evaluation form

      </h2>

      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">

        The required faculty, criteria, or evaluation information could not be

        loaded.

      </p>

      <UButton class="mt-5" icon="i-lucide-refresh-cw" @click="loadData">

        Try Again

      </UButton>

    </div>

    <!-- =====================================================

      MAIN CONTENT

    ====================================================== -->

    <div

      v-else

      class="grid grid-cols-1 items-start gap-6 xl:grid-cols-[300px_minmax(0,1fr)]"

    >

      <!-- ===================================================

        ASSIGNED FACULTY PANEL

      ==================================================== -->

      <aside

        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:sticky xl:top-5 dark:border-gray-800 dark:bg-gray-900"

      >

        <div

          class="border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white px-5 py-4 dark:border-gray-800 dark:from-gray-900 dark:to-gray-900"

        >

          <div class="flex items-start justify-between gap-3">

            <div>

              <h2

                class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"

              >

                <UIcon

                  name="i-lucide-users-round"

                  class="size-4 text-emerald-600 dark:text-emerald-400"

                />

                Assigned Faculty

              </h2>

              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">

                Select faculty members to evaluate.

              </p>

            </div>

            <UBadge color="primary" variant="subtle" size="sm">

              {{ selectedTeacherIds.length }}/{{ availableTeacherCount }}

            </UBadge>

          </div>

        </div>

        <div class="max-h-[430px] overflow-y-auto p-3">

          <div

            v-if="teacherCheckboxItems.length === 0"

            class="px-3 py-10 text-center"

          >

            <div

              class="mx-auto flex size-11 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-gray-800"

            >

              <UIcon name="i-lucide-user-x" class="size-5" />

            </div>

            <p

              class="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300"

            >

              No faculty assigned

            </p>

            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">

              Add your current teachers first from the My Teachers page.

            </p>

            <UButton
              class="mt-4"
              size="sm"
              variant="soft"
              icon="i-lucide-users-round"
              to="/student/my-teachers"
            >
              Manage My Teachers
            </UButton>

          </div>

          <UCheckboxGroup

            v-else

            v-model="selectedTeacherIds"

            value-key="value"

            :items="teacherCheckboxItems"

            :ui="{

              fieldset: 'space-y-2',

              item: [

                'group rounded-xl border p-3 transition-all duration-200',

                'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40',

                'has-[:checked]:border-emerald-300 has-[:checked]:bg-emerald-50',

                'dark:border-gray-800 dark:hover:border-emerald-800',

                'dark:hover:bg-emerald-950/20',

                'dark:has-[:checked]:border-emerald-800',

                'dark:has-[:checked]:bg-emerald-950/25',

                'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60',

              ].join(' '),

            }"

          >

            <template #label="{ item }">

              <div class="min-w-0 pr-1">

                <p

                  class="truncate text-sm font-semibold text-gray-800 group-has-[:checked]:text-emerald-700 dark:text-gray-200 dark:group-has-[:checked]:text-emerald-400"

                >

                  {{ item.label }}

                </p>

                <p

                  v-if="item.description"

                  class="mt-0.5 truncate text-[11px] text-gray-500 dark:text-gray-400"

                >

                  {{ item.description }}

                </p>

              </div>

            </template>

          </UCheckboxGroup>

        </div>

        <div

          class="border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900"

        >

          <div class="flex items-center justify-between text-xs">

            <span class="text-gray-500 dark:text-gray-400">

              Evaluation progress

            </span>

            <span class="font-semibold text-emerald-600 dark:text-emerald-400">

              {{ overallProgress }}%

            </span>

          </div>

          <div

            class="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"

          >

            <div

              class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"

              :style="{ width: `${overallProgress}%` }"

            />

          </div>

        </div>

      </aside>

      <!-- ===================================================

        EVALUATION CONTENT

      ==================================================== -->

      <div class="min-w-0 space-y-5">

        <!-- EVALUATION PERIOD -->

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

                placeholder="No active semester"

                icon="i-lucide-calendar-days"

                class="w-full"

                size="lg"

              />

            </UFormField>

            <UFormField label="School Year">

              <UInput

                v-model="form.schoolYear"

                disabled

                placeholder="No active school year"

                icon="i-lucide-graduation-cap"

                class="w-full"

                size="lg"

              />

            </UFormField>

            <UFormField label="Evaluation Date">

              <UInput

                v-model="form.date"

                type="date"

                icon="i-lucide-calendar-check"

                class="w-full"

                size="lg"

              />

            </UFormField>

          </div>

          <div

            v-if="checkingExistingEvaluations"

            class="flex items-center gap-2 border-t border-gray-200 px-5 py-3 text-xs text-gray-500 sm:px-6 dark:border-gray-800 dark:text-gray-400"

          >

            <UIcon

              name="i-lucide-loader-circle"

              class="size-4 animate-spin text-emerald-500"

            />

            Checking your previous faculty evaluations...

          </div>

        </section>

        <!-- TERM REQUIRED -->

        <section

          v-if="!activeSchoolYear"

          class="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/20"

        >

          <div

            class="flex flex-col items-center text-center sm:flex-row sm:text-left"

          >

            <div

              class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"

            >

              <UIcon name="i-lucide-calendar-clock" class="size-6" />

            </div>

            <div class="mt-3 sm:ml-4 sm:mt-0">

              <h3 class="font-bold text-gray-900 dark:text-white">

                No active evaluation period

              </h3>

              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">

                The administrator has not configured an active semester and

                school year. Faculty evaluations cannot be submitted yet.

              </p>

            </div>

          </div>

        </section>

        <!-- NO FACULTY SELECTED -->

        <section

          v-else-if="!selectedTeacherIds.length"

          class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-900"

        >

          <div

            class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"

          >

            <UIcon name="i-lucide-mouse-pointer-click" class="size-8" />

          </div>

          <h3 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">

            Select a faculty member

          </h3>

          <p

            class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400"

          >

            Use the Assigned Faculty panel to choose at least one faculty member

            whose performance you want to evaluate.

          </p>

        </section>

        <template v-else>

          <!-- CURRENT FACULTY / PAGINATION -->

          <section

            class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900"

          >

            <div class="flex min-w-0 items-center gap-3">

              <div

                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"

              >

                <UIcon name="i-lucide-user-round-check" class="size-5" />

              </div>

              <div class="min-w-0">

                <p

                  class="text-xs font-medium uppercase tracking-wide text-gray-400"

                >

                  Currently evaluating

                </p>

                <p

                  class="truncate text-sm font-bold text-gray-900 dark:text-white"

                >

                  {{ currentEvaluationTeacherName }}

                </p>

              </div>

            </div>

            <div class="flex items-center justify-between gap-2 sm:justify-end">

              <UButton

                color="neutral"

                variant="outline"

                icon="i-lucide-chevron-left"

                :disabled="currentPage === 1"

                square

                @click="prevPage"

              />

              <div

                class="min-w-24 rounded-xl bg-gray-100 px-3 py-2 text-center text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300"

              >

                {{ currentPage }} of {{ totalPages }}

              </div>

              <UButton

                color="neutral"

                variant="outline"

                icon="i-lucide-chevron-right"

                :disabled="currentPage === totalPages"

                square

                @click="nextPage"

              />

            </div>

          </section>

          <!-- FACULTY EVALUATION FORM -->

          <section

            v-for="evaluation in paginatedEvaluations"

            :key="evaluation.teacherId"

            class="rounded-[24px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"

          >

            <!-- FACULTY HEADER -->

            <div

              class="relative overflow-hidden rounded-t-[24px] border-b border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-5 py-6 text-white sm:px-7 dark:border-gray-800"

            >

              <div

                class="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-emerald-500/20 blur-3xl"

              />

              <div

                class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"

              >

                <div class="flex min-w-0 items-center gap-4">

                  <div

                    class="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-300 backdrop-blur"

                  >

                    <UIcon name="i-lucide-presentation" class="size-7" />

                  </div>

                  <div class="min-w-0">

                    <p

                      class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300"

                    >

                      Faculty Evaluation

                    </p>

                    <h2 class="mt-1 truncate text-xl font-bold">

                      {{

                        teacherMap[String(evaluation.teacherId)]?.name ||

                        "Unknown Teacher"

                      }}

                    </h2>

                    <p class="mt-1 text-xs text-slate-300">

                      Evaluation {{ currentPage }} of {{ totalPages }}

                    </p>

                  </div>

                </div>

                <div

                  class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur"

                >

                  <div class="flex items-center justify-between gap-5">

                    <div>

                      <p class="text-[10px] uppercase text-slate-300">

                        Completion

                      </p>

                      <p class="mt-0.5 text-lg font-bold">

                        {{ getEvaluationProgress(evaluation) }}%

                      </p>

                    </div>

                    <div

                      class="flex size-10 items-center justify-center rounded-xl"

                      :class="

                        isEvaluationComplete(evaluation)

                          ? 'bg-emerald-500 text-white'

                          : 'bg-white/10 text-slate-300'

                      "

                    >

                      <UIcon

                        :name="

                          isEvaluationComplete(evaluation)

                            ? 'i-lucide-circle-check'

                            : 'i-lucide-clock-3'

                        "

                        class="size-5"

                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div class="space-y-7 p-4 sm:p-6 lg:p-7">

              <!-- FACULTY INFORMATION -->

              <div

                class="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40"

              >

                <UFormField label="Faculty Member">

                  <UInput

                    :model-value="

                      teacherMap[String(evaluation.teacherId)]?.name || ''

                    "

                    disabled

                    icon="i-lucide-user-round"

                    class="w-full"

                    size="lg"

                  />

                </UFormField>

              </div>

              <!-- RATING GUIDE -->

              <div

                class="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/20"

              >

                <div class="flex items-start gap-3">

                  <div

                    class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"

                  >

                    <UIcon name="i-lucide-info" class="size-4.5" />

                  </div>

                  <div class="min-w-0 flex-1">

                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">

                      Rating Guide

                    </h3>

                    <p

                      class="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400"

                    >

                      Select one rating for every criterion. This scale is

                      loaded from the

                      <strong>{{ evaluationType?.name }}</strong>

                      evaluation type configuration.

                    </p>

                    <div class="mt-3 grid gap-2" :style="ratingGridStyle">

                      <div

                        v-for="rating in ratingGuide"

                        :key="rating.score"

                        class="rounded-xl border border-blue-100 bg-white px-3 py-2 text-center dark:border-blue-900 dark:bg-gray-900"

                      >

                        <p

                          class="text-lg font-bold text-blue-600 dark:text-blue-400"

                        >

                          {{ rating.score }}

                        </p>

                        <p

                          class="mt-0.5 text-[10px] font-medium text-gray-500 dark:text-gray-400"

                        >

                          {{ rating.label }}

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              <!-- CRITERIA SECTIONS -->

              <div class="space-y-5">

                <div

                  v-for="section in sections"

                  :key="section.id"

                  class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"

                >

                  <div

                    class="flex items-center justify-between gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3.5 sm:px-5 dark:border-gray-800 dark:bg-gray-950/50"

                  >

                    <div class="flex min-w-0 items-center gap-3">

                      <div

                        class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"

                      >

                        <UIcon name="i-lucide-list-checks" class="size-4" />

                      </div>

                      <h3

                        class="truncate text-sm font-bold text-gray-900 dark:text-white"

                      >

                        {{ section.title }}

                      </h3>

                    </div>

                    <UBadge color="neutral" variant="subtle" size="sm">

                      {{ getSectionAnsweredCount(evaluation, section) }}/{{

                        section.evaluation_criteria?.length || 0

                      }}

                    </UBadge>

                  </div>

                  <div class="divide-y divide-gray-200 dark:divide-gray-800">

                    <div

                      v-for="criterion in section.evaluation_criteria"

                      :key="criterion.id"

                      class="grid grid-cols-1 gap-4 px-4 py-4 transition-colors hover:bg-gray-50 sm:px-5 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-center dark:hover:bg-gray-950/40"

                    >

                      <div class="flex min-w-0 items-start gap-3">

                        <span

                          class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300"

                        >

                          {{ criterion.order }}

                        </span>

                        <p

                          class="text-sm leading-6 text-gray-700 dark:text-gray-300"

                        >

                          {{ criterion.statement }}

                        </p>

                      </div>

                      <div

                        class="grid gap-1.5 rounded-xl bg-gray-100 p-1.5 dark:bg-gray-800"

                        :style="ratingGridStyle"

                      >

                        <label

                          v-for="rating in ratingGuide"

                          :key="rating.score"

                          class="group cursor-pointer"

                          :title="`${rating.score} - ${rating.label}`"

                        >

                          <input

                            v-model="evaluation.responses[criterion.id]"

                            :value="Number(rating.score)"

                            type="radio"

                            class="peer sr-only"

                          />

                          <span

                            class="flex h-10 items-center justify-center rounded-lg text-sm font-bold text-gray-500 transition-all group-hover:bg-white group-hover:text-emerald-600 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:shadow-md dark:text-gray-400 dark:group-hover:bg-gray-700 dark:group-hover:text-emerald-400"

                          >

                            {{ rating.score }}

                          </span>

                        </label>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              <!-- WRITTEN FEEDBACK -->

              <div

                class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"

              >

                <div

                  class="border-b border-gray-200 bg-gray-50 px-4 py-3.5 sm:px-5 dark:border-gray-800 dark:bg-gray-950/50"

                >

                  <div class="flex items-center gap-3">

                    <div

                      class="flex size-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"

                    >

                      <UIcon

                        name="i-lucide-message-square-text"

                        class="size-4"

                      />

                    </div>

                    <div>

                      <h3

                        class="text-sm font-bold text-gray-900 dark:text-white"

                      >

                        Written Feedback

                      </h3>

                      <p

                        class="mt-0.5 text-xs text-gray-500 dark:text-gray-400"

                      >

                        Share the strongest and weakest points of the faculty

                        member.

                      </p>

                    </div>

                  </div>

                </div>

                <div class="p-4 sm:p-5">

                  <UTextarea

                    v-model="evaluation.comment"

                    :rows="5"

                    autoresize

                    placeholder="Write respectful and constructive feedback..."

                    class="w-full"

                  />

                  <div

                    class="mt-2 flex items-center justify-between gap-3 text-[11px] text-gray-400"

                  >

                    <span> Written feedback is optional but encouraged. </span>

                    <span class="shrink-0">

                      {{ evaluation.comment?.length || 0 }} characters

                    </span>

                  </div>

                </div>

              </div>

              <!-- SCORE SUMMARY -->

              <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div

                  class="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/20"

                >

                  <div class="flex items-center justify-between">

                    <div>

                      <p

                        class="text-xs font-medium text-gray-500 dark:text-gray-400"

                      >

                        Answered Items

                      </p>

                      <p

                        class="mt-1 text-2xl font-bold text-gray-900 dark:text-white"

                      >

                        {{ getAnsweredCount(evaluation) }}

                        <span class="text-sm font-medium text-gray-400">

                          / {{ allCriteria.length }}

                        </span>

                      </p>

                    </div>

                    <UIcon

                      name="i-lucide-list-checks"

                      class="size-6 text-blue-500"

                    />

                  </div>

                </div>

                <div

                  class="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/20"

                >

                  <div class="flex items-center justify-between">

                    <div>

                      <p

                        class="text-xs font-medium text-gray-500 dark:text-gray-400"

                      >

                        Total Score

                      </p>

                      <p

                        class="mt-1 text-2xl font-bold text-gray-900 dark:text-white"

                      >

                        {{ getTotalScore(evaluation) }}

                      </p>

                    </div>

                    <UIcon

                      name="i-lucide-sigma"

                      class="size-6 text-amber-500"

                    />

                  </div>

                </div>

                <div

                  class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20"

                >

                  <div class="flex items-center justify-between">

                    <div>

                      <p

                        class="text-xs font-medium text-gray-500 dark:text-gray-400"

                      >

                        Average Score

                      </p>

                      <p

                        class="mt-1 text-2xl font-bold text-gray-900 dark:text-white"

                      >

                        {{ getAverageScore(evaluation) }}

                        <span class="text-sm font-medium text-gray-400">

                          / {{ ratingMaxScore ?? "—" }}

                        </span>

                      </p>

                    </div>

                    <UIcon

                      name="i-lucide-chart-no-axes-combined"

                      class="size-6 text-emerald-500"

                    />

                  </div>

                </div>

              </div>

            </div>

          </section>

          <!-- BOTTOM PAGINATION -->

          <section

            v-if="selectedTeacherIds.length > 1"

            class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900"

          >

            <UButton

              color="neutral"

              variant="outline"

              icon="i-lucide-arrow-left"

              :disabled="currentPage === 1"

              @click="prevPage"

            >

              Previous Faculty

            </UButton>

            <div class="text-center">

              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">

                Evaluation {{ currentPage }} of {{ totalPages }}

              </p>

              <p class="mt-0.5 text-xs text-gray-400">

                {{ completedEvaluationCount }} evaluation(s) complete

              </p>

            </div>

            <UButton

              color="neutral"

              variant="outline"

              trailing-icon="i-lucide-arrow-right"

              :disabled="currentPage === totalPages"

              @click="nextPage"

            >

              Next Faculty

            </UButton>

          </section>

          <!-- ERROR MESSAGE -->

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

          <!-- SUCCESS MESSAGE -->

          <div

            v-if="submitSuccess"

            class="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20"

          >

            <UIcon

              name="i-lucide-circle-check"

              class="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400"

            />

            <p

              class="text-sm font-medium text-emerald-700 dark:text-emerald-300"

            >

              {{ submitSuccess }}

            </p>

          </div>

          <!-- SUBMIT PANEL -->

          <section

            class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900"

          >

            <div>

              <h3 class="text-sm font-bold text-gray-900 dark:text-white">

                Submit Evaluations

              </h3>

              <p

                class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400"

              >

                Review your answers carefully. Submitted evaluations may no

                longer be editable.

              </p>

            </div>

            <div class="flex flex-col gap-2 sm:flex-row sm:items-center">

              <UButton

                color="neutral"

                variant="outline"

                icon="i-lucide-rotate-ccw"

                :disabled="submitLoading"

                @click="resetForm"

              >

                Reset Form

              </UButton>

              <UButton

                icon="i-lucide-send"

                size="lg"

                :loading="submitLoading"

                :disabled="!isFormValid || submitLoading"

                @click="openSubmitConfirmation"

              >

                Submit All Evaluations

              </UButton>

            </div>

          </section>

        </template>

      </div>

    </div>

    <!-- =====================================================

      SUBMISSION CONFIRMATION

    ====================================================== -->

    <UModal

      id="student-faculty-submit-confirmation"

      v-model:open="confirmationOpen"

      title="Submit faculty evaluations"

      description="Confirm submission of the completed faculty evaluations."

    >

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

                Submit faculty evaluations?

              </h2>

              <p

                class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400"

              >

                You are submitting

                <strong>{{ form.evaluations.length }}</strong>

                faculty evaluation(s). Submitted evaluations may no longer be

                edited.

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

                  {{ form.semester }}

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

            <div

              class="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40"

            >

              <div class="flex items-center justify-between">

                <span class="text-sm text-gray-500 dark:text-gray-400">

                  Faculty evaluations

                </span>

                <span class="text-sm font-bold text-gray-900 dark:text-white">

                  {{ form.evaluations.length }}

                </span>

              </div>

              <div class="mt-3 flex items-center justify-between">

                <span class="text-sm text-gray-500 dark:text-gray-400">

                  Total criteria answered

                </span>

                <span class="text-sm font-bold text-gray-900 dark:text-white">

                  {{ totalAnsweredCriteria }}

                </span>

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

                @click="submitEvaluation"

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

   TYPES

\========================================================= */

type Teacher = {

  id: number;

  name: string;

  department?: string;

  email?: string;

};

type EvaluationFormItem = {

  teacherId: number;

  comment: string;

  responses: Record<number, number>;

};

/* =========================================================

   STATE

\========================================================= */

const sections = ref<any[]>([]);

const teachers = ref<any[]>([]);

const pending = ref(true);

const error = ref<any>(null);

const submitLoading = ref(false);

const submitError = ref("");

const submitSuccess = ref("");

const selectedTeacherIds = ref<number[]>([]);

const currentPage = ref(1);

const itemsPerPage = 1;

const evaluationType = ref<any>(null);

const activeSchoolYear = ref<any>(null);

const existingEvaluations = ref<any[]>([]);

const checkingExistingEvaluations = ref(false);

const confirmationOpen = ref(false);

/* =========================================================

   OPTIONS

\========================================================= */

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

   FORM

\========================================================= */

const form = reactive({

  semester: "",

  schoolYear: "",

  date: new Date().toISOString().slice(0, 10),

  evaluations: [] as EvaluationFormItem[],

});

/* =========================================================

   COMPUTED DATA

\========================================================= */

const teacherCheckboxItems = computed(() =>

  teachers.value.map((teacher: any) => {

    const alreadyEvaluated = existingEvaluations.value.some(

      (evaluation: any) => evaluation.teacher?.id === teacher.id,

    );

    return {

      label: alreadyEvaluated ? `${teacher.name} (Completed)` : teacher.name,

      description: alreadyEvaluated

        ? "This faculty member has already been evaluated for the active period."

        : teacher.department || "Available for evaluation",

      value: teacher.id,

      disabled:

        alreadyEvaluated ||

        !activeSchoolYear.value ||

        checkingExistingEvaluations.value,

    };

  }),

);

const availableTeacherCount = computed(() => {

  return teacherCheckboxItems.value.filter((teacher: any) => !teacher.disabled)

    .length;

});

const teacherMap = computed(() => {

  const map: Record<string, Teacher> = {};

  teachers.value.forEach((teacher: any) => {

    map[String(teacher.id)] = teacher;

  });

  return map;

});

const allCriteria = computed(() =>

  sections.value.flatMap((section: any) => section.evaluation_criteria || []),

);

/* =========================================================

   DYNAMIC RATING SCALE FROM EVALUATION TYPE

\========================================================= */

const evaluationResponseType = computed(() => {

  return evaluationType.value?.response_type || "rating";

});

const normalizedScaleLabels = computed<Record<string, string>>(() => {

  const labels = evaluationType.value?.scale_labels;

  if (!labels || typeof labels !== "object" || Array.isArray(labels)) {

    return {};

  }

  return labels;

});

const ratingGuide = computed(() => {

  if (evaluationResponseType.value !== "rating") {

    return [];

  }

  const labels = normalizedScaleLabels.value;

  const configuredScores = Object.keys(labels)

    .map((score) => Number(score))

    .filter((score) => Number.isFinite(score))

    .sort((a, b) => b - a);

  if (configuredScores.length) {

    return configuredScores.map((score) => ({

      score,

      label: String(labels[String(score)] || `Rating ${score}`),

    }));

  }

  const minScore = Number(evaluationType.value?.min_score);

  const maxScore = Number(evaluationType.value?.max_score);

  if (

    Number.isFinite(minScore) &&

    Number.isFinite(maxScore) &&

    maxScore >= minScore

  ) {

    const rows = [];

    for (let score = maxScore; score >= minScore; score -= 1) {

      rows.push({

        score,

        label: `Rating ${score}`,

      });

    }

    return rows;

  }

  return [];

});

const ratingScores = computed(() =>

  ratingGuide.value.map((item) => Number(item.score)),

);

const ratingMinScore = computed(() => {

  if (!ratingScores.value.length) {

    return null;

  }

  return Math.min(...ratingScores.value);

});

const ratingMaxScore = computed(() => {

  if (!ratingScores.value.length) {

    return null;

  }

  return Math.max(...ratingScores.value);

});

const ratingGridStyle = computed(() => ({

  gridTemplateColumns: `repeat(${Math.max(ratingGuide.value.length, 1)}, minmax(0, 1fr))`,

}));

const totalPages = computed(() =>

  Math.max(1, Math.ceil(form.evaluations.length / itemsPerPage)),

);

const paginatedEvaluations = computed(() => {

  const start = (currentPage.value - 1) * itemsPerPage;

  const end = start + itemsPerPage;

  return form.evaluations.slice(start, end);

});

const completedEvaluationCount = computed(() => {

  return form.evaluations.filter((evaluation) =>

    isEvaluationComplete(evaluation),

  ).length;

});

const overallProgress = computed(() => {

  if (!form.evaluations.length) {

    return 0;

  }

  const totalRequired =

    form.evaluations.length * Math.max(allCriteria.value.length, 1);

  const totalAnswered = form.evaluations.reduce(

    (sum, evaluation) => sum + getAnsweredCount(evaluation),

    0,

  );

  return Math.min(100, Math.round((totalAnswered / totalRequired) * 100));

});

const currentEvaluationTeacherName = computed(() => {

  const evaluation = paginatedEvaluations.value[0];

  if (!evaluation) {

    return "No faculty selected";

  }

  return (

    teacherMap.value[String(evaluation.teacherId)]?.name || "Unknown Teacher"

  );

});

const totalAnsweredCriteria = computed(() => {

  return form.evaluations.reduce(

    (total, evaluation) => total + getAnsweredCount(evaluation),

    0,

  );

});

const isFormValid = computed(() => {

  if (!form.semester || !form.schoolYear) {

    return false;

  }

  if (!form.evaluations.length) {

    return false;

  }

  return form.evaluations.every((evaluation) =>

    isEvaluationComplete(evaluation),

  );

});

/* =========================================================

   EVALUATION HELPERS

\========================================================= */

const createEvaluation = (teacherId: number | string): EvaluationFormItem => ({

  teacherId: Number(teacherId),

  comment: "",

  responses: {},

});

const syncEvaluationsFromSelection = () => {

  const existingMap = new Map(

    form.evaluations.map((evaluation) => [

      Number(evaluation.teacherId),

      evaluation,

    ]),

  );

  form.evaluations = selectedTeacherIds.value.map((teacherId) => {

    const numericId = Number(teacherId);

    return existingMap.get(numericId) || createEvaluation(numericId);

  });

  if (currentPage.value > totalPages.value) {

    currentPage.value = totalPages.value;

  }

  if (!form.evaluations.length) {

    currentPage.value = 1;

  }

};

const getAnsweredCount = (evaluation: EvaluationFormItem) => {

  if (evaluationResponseType.value !== "rating") {

    return 0;

  }

  return allCriteria.value.filter((criterion: any) => {

    const value = Number(evaluation.responses[criterion.id]);

    return ratingScores.value.includes(value);

  }).length;

};

const getTotalScore = (evaluation: EvaluationFormItem) => {

  return Object.values(evaluation.responses).reduce(

    (sum, score) => sum + Number(score),

    0,

  );

};

const getAverageScore = (evaluation: EvaluationFormItem) => {

  const answered = getAnsweredCount(evaluation);

  if (!answered) {

    return 0;

  }

  return Number((getTotalScore(evaluation) / answered).toFixed(2));

};

const isEvaluationComplete = (evaluation: EvaluationFormItem) => {

  if (

    !evaluation.teacherId ||

    !allCriteria.value.length ||

    evaluationResponseType.value !== "rating" ||

    !ratingScores.value.length

  ) {

    return false;

  }

  const criteriaIds = allCriteria.value.map((criterion: any) =>

    String(criterion.id),

  );

  return criteriaIds.every((criterionId) => {

    const value = Number(evaluation.responses[criterionId]);

    return ratingScores.value.includes(value);

  });

};

const getEvaluationProgress = (evaluation: EvaluationFormItem) => {

  if (!allCriteria.value.length) {

    return 0;

  }

  const answered = getAnsweredCount(evaluation);

  return Math.min(100, Math.round((answered / allCriteria.value.length) * 100));

};

const getSectionAnsweredCount = (

  evaluation: EvaluationFormItem,

  section: any,

) => {

  const criteria = section.evaluation_criteria || [];

  return criteria.filter((criterion: any) => {

    const value = Number(evaluation.responses[criterion.id]);

    return ratingScores.value.includes(value);

  }).length;

};

/* =========================================================

   PAGINATION

\========================================================= */

const goToPage = (page: number) => {

  if (page < 1 || page > totalPages.value) {

    return;

  }

  currentPage.value = page;

};

const nextPage = async () => {

  goToPage(currentPage.value + 1);

  await scrollEvaluationPage();

};

const prevPage = async () => {

  goToPage(currentPage.value - 1);

  await scrollEvaluationPage();

};

const scrollEvaluationPage = async (behavior: ScrollBehavior = "smooth") => {

  await nextTick();

  if (!import.meta.client) {

    return;

  }

  window.scrollTo({

    top: 0,

    behavior,

  });

};

/* =========================================================

   API: ACTIVE SCHOOL YEAR

\========================================================= */

const getActiveSchoolYear = async () => {

  const response = await $api("/school-years", {

    query: {

      "filters[active_sy][$eq]": true,

      "pagination[pageSize]": 1,

    },

  });

  activeSchoolYear.value = response.data?.[0] || null;

  if (!activeSchoolYear.value) {

    form.semester = "";

    form.schoolYear = "";

    return;

  }

  form.semester = activeSchoolYear.value.semester || "";

  form.schoolYear = activeSchoolYear.value.school_year || "";

};

/* =========================================================

   API: EVALUATION TYPE

\========================================================= */

const getEvaluationType = async () => {

  const response = await $api("/evaluation-types", {

    query: {

      "filters[code][$eq]": "student-faculty",

      "pagination[pageSize]": 1,

    },

  });

  evaluationType.value = response.data?.[0] || null;

};

/* =========================================================

   API: SECTIONS AND CRITERIA

\========================================================= */

const getSections = async () => {

  if (!evaluationType.value?.documentId) {

    return;

  }

  const response = await $api("/evaluation-sections", {

    query: {

      "filters[evaluation_type][documentId][$eq]":

        evaluationType.value.documentId,

      "populate[evaluation_criteria][sort][0]": "order:asc",

      "populate[evaluation_type]": true,

      "sort[0]": "order:asc",

      "pagination[pageSize]": 100,

    },

  });

  sections.value = response.data || [];

};

/* =========================================================

   API: ASSIGNED FACULTY

\========================================================= */

const getTeachers = async () => {
  if (!user.value?.id) {
    teachers.value = []
    selectedTeacherIds.value = []
    form.evaluations = []
    currentPage.value = 1
    return
  }

  const response: any = await $api(
    "/student-teacher-assignments/me"
  )

  const assignmentRows = response?.data || []

  teachers.value = assignmentRows
    .map((assignment: any) => {
      const teacher = assignment?.teacher

      if (!teacher?.id) {
        return null
      }

      return {
        ...teacher,
        department:
          teacher?.department?.name ||
          teacher?.department?.department_name ||
          teacher?.department?.code ||
          "Department not specified"
      }
    })
    .filter(Boolean)

  selectedTeacherIds.value = []
  form.evaluations = []
  currentPage.value = 1
}

/* =========================================================

   API: EXISTING EVALUATIONS

\========================================================= */

const getExistingEvaluations = async () => {

  if (!user.value?.id || !form.semester || !form.schoolYear) {

    existingEvaluations.value = [];

    return;

  }

  try {

    checkingExistingEvaluations.value = true;

    const response = await $api("/evaluations", {

      query: {

        "filters[evaluator_user][id][$eq]": user.value.id,

        "filters[batch][semester][$eq]": form.semester,

        "filters[batch][school_year][$eq]": form.schoolYear,

        "filters[batch][evaluation_type][code][$eq]": "student-faculty",

        "populate[teacher]": true,

        "pagination[pageSize]": 300,

      },

    });

    existingEvaluations.value = response.data || [];

  } catch (err) {

    console.error("Existing evaluation check failed:", err);

    toast.add({

      title: "Unable to check previous evaluations",

      description: "Please refresh the page and try again.",

      icon: "i-lucide-triangle-alert",

      color: "warning",

    });

  } finally {

    checkingExistingEvaluations.value = false;

  }

};

/* =========================================================

   INITIAL DATA LOADING

\========================================================= */

const loadData = async () => {

  try {

    pending.value = true;

    error.value = null;

    submitError.value = "";

    await getActiveSchoolYear();

    await getEvaluationType();

    if (!evaluationType.value) {

      throw new Error("Student-Faculty evaluation type is not configured.");

    }

    if (evaluationResponseType.value !== "rating") {

      throw new Error("Student-Faculty must use a Rating Scale response type.");

    }

    if (!ratingGuide.value.length) {

      throw new Error(

        "The Student-Faculty evaluation type has no valid rating scale configured.",

      );

    }

    await Promise.all([getSections(), getTeachers()]);

    if (activeSchoolYear.value) {

      await getExistingEvaluations();

    }

  } catch (err: any) {

    console.error("Evaluation form loading error:", err);

    error.value = err;

    submitError.value =

      err?.data?.error?.message ||

      err?.data?.message ||

      err?.message ||

      "Failed to load the evaluation form.";

  } finally {

    pending.value = false;

  }

};

/* =========================================================

   SUBMISSION

\========================================================= */

const openSubmitConfirmation = async () => {

  submitError.value = "";

  submitSuccess.value = "";

  if (!isFormValid.value) {

    const incompleteIndex = form.evaluations.findIndex(

      (evaluation) => !isEvaluationComplete(evaluation),

    );

    if (incompleteIndex >= 0) {

      currentPage.value = incompleteIndex + 1;

    }

    submitError.value =

      "Please answer all criteria for every faculty evaluation.";

    toast.add({

      title: "Incomplete evaluations",

      description:

        "Complete every selected faculty evaluation before submitting.",

      icon: "i-lucide-circle-alert",

      color: "warning",

    });

    await scrollEvaluationPage();

    return;

  }

  confirmationOpen.value = true;

};

const submitEvaluation = async () => {

  submitError.value = "";

  submitSuccess.value = "";

  if (!evaluationType.value?.id) {

    submitError.value = "Evaluation type not found.";

    return;

  }

  if (evaluationResponseType.value !== "rating" || !ratingScores.value.length) {

    submitError.value =

      "The Student-Faculty rating scale is not configured correctly.";

    return;

  }

  if (!activeSchoolYear.value || !form.semester || !form.schoolYear) {

    confirmationOpen.value = false;

    submitError.value = "No active semester and school year are configured.";

    return;

  }

  if (!form.evaluations.length) {

    submitError.value = "Please select at least one faculty member.";

    return;

  }

  const hasIncomplete = form.evaluations.some(

    (evaluation) => !isEvaluationComplete(evaluation),

  );

  if (hasIncomplete) {

    const incompleteIndex = form.evaluations.findIndex(

      (evaluation) => !isEvaluationComplete(evaluation),

    );

    currentPage.value = incompleteIndex + 1;

    submitError.value =

      "Please answer all criteria for every faculty evaluation.";

    await scrollEvaluationPage();

    return;

  }

  try {

    submitLoading.value = true;

    const evaluations = form.evaluations.map((evaluation) => ({

      teacher: evaluation.teacherId,

      comment: evaluation.comment,

      responses: evaluation.responses,

    }));

    await $api("/submit-multiple-evaluations", {

      method: "POST",

      body: {

        evaluation_type: evaluationType.value.id,

        semester: form.semester,

        school_year: form.schoolYear,

        date: form.date,

        evaluations,

      },

    });

    confirmationOpen.value = false;

    toast.add({

      title: "Evaluations submitted",

      description: "Your faculty evaluations were submitted successfully.",

      icon: "i-lucide-circle-check",

      color: "success",

    });

    submitSuccess.value = "Your evaluations were submitted successfully.";

    await getExistingEvaluations();

    selectedTeacherIds.value = [];

    form.evaluations = [];

    currentPage.value = 1;

    await scrollEvaluationPage();

  } catch (err: any) {

    confirmationOpen.value = false;

    console.error("Evaluation submission error:", err);

    submitError.value =

      err?.data?.error?.message ||

      err?.data?.message ||

      err?.message ||

      "Failed to submit evaluations.";

    toast.add({

      title: "Submission failed",

      description: submitError.value,

      icon: "i-lucide-circle-alert",

      color: "error",

    });

  } finally {

    submitLoading.value = false;

  }

};

/* =========================================================

   RESET

\========================================================= */

const resetForm = async () => {

  form.date = new Date().toISOString().slice(0, 10);

  form.evaluations = [];

  selectedTeacherIds.value = [];

  currentPage.value = 1;

  submitError.value = "";

  submitSuccess.value = "";

  toast.add({

    title: "Evaluation responses cleared",

    description: "The active semester and school year were preserved.",

    icon: "i-lucide-rotate-ccw",

    color: "neutral",

  });

  await scrollEvaluationPage();

};

/* =========================================================

   WATCHERS

\========================================================= */

watch(

  selectedTeacherIds,

  async (newSelection, oldSelection) => {

    syncEvaluationsFromSelection();

    submitError.value = "";

    submitSuccess.value = "";

    if (newSelection.length > (oldSelection?.length || 0)) {

      currentPage.value = form.evaluations.length;

      await scrollEvaluationPage();

    }

  },

  {

    deep: true,

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

::-webkit-scrollbar {

  width: 8px;

  height: 8px;

}

::-webkit-scrollbar-thumb {

  background: rgba(16, 185, 129, 0.32);

  border-radius: 999px;

}

::-webkit-scrollbar-thumb:hover {

  background: rgba(16, 185, 129, 0.5);

}

::-webkit-scrollbar-track {

  background: transparent;

}

</style>
