<template>
  <div class="space-y-6 pb-10">
    <section class="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7 dark:border-emerald-900">
      <div class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-teal-300/15 blur-3xl" />

      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex min-w-0 items-start gap-4">
          <div class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex">
            <UIcon name="i-lucide-clipboard-pen-line" class="size-7" />
          </div>

          <div class="min-w-0">
            <div class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-50">
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur">Faculty Portal</span>
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur">Faculty – Dean/Coordinator</span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Dean/Coordinator Evaluation</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Evaluate the Dean or Coordinator assigned to your department by rating all criteria and providing constructive written feedback.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-[390px]">
          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">{{ availableTargetCount }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">Available</p>
          </div>
          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">{{ selectedTargetIds.length }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">Selected</p>
          </div>
          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">{{ completedEvaluationCount }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">Complete</p>
          </div>
        </div>
      </div>
    </section>

    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center gap-4 px-5 py-4 sm:px-6">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 p-1 dark:border-emerald-900 dark:bg-emerald-950/30">
          <img src="/logo.png" alt="St. Nicolas College" class="size-9 object-contain">
        </div>
        <div class="min-w-0 flex-1">
          <h2 class="text-sm font-bold uppercase tracking-tight text-gray-900 sm:text-base dark:text-white">St. Nicolas College of Business and Technology</h2>
          <p class="mt-0.5 text-xs leading-5 text-gray-500 dark:text-gray-400">MEL-VI Bldg., Jose Abad Santos Avenue, City of San Fernando, Pampanga · Tel. No. (045) 455-0958</p>
        </div>
        <div class="hidden rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-right sm:block dark:border-emerald-900 dark:bg-emerald-950/30">
          <p class="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Evaluation Form</p>
          <p class="mt-0.5 text-xs font-bold text-gray-800 dark:text-gray-200">Faculty – Dean/Coordinator</p>
        </div>
      </div>
    </section>

    <div v-if="pending" class="grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
      <div class="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <USkeleton class="h-6 w-40 rounded-lg" />
        <USkeleton v-for="index in 4" :key="index" class="h-16 w-full rounded-xl" />
      </div>
      <div class="space-y-5">
        <USkeleton class="h-32 w-full rounded-2xl" />
        <USkeleton class="h-[520px] w-full rounded-2xl" />
      </div>
    </div>

    <section v-else-if="loadError" class="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900 dark:bg-red-950/20">
      <div class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
        <UIcon name="i-lucide-triangle-alert" class="size-7" />
      </div>
      <h2 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">Unable to load the evaluation form</h2>
      <p class="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400">{{ loadError }}</p>
      <UButton class="mt-5" icon="i-lucide-refresh-cw" :loading="pending" @click="loadData">Try Again</UButton>
    </section>

    <template v-else>
      <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="border-b border-gray-200 px-5 py-4 sm:px-6 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <div class="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
              <UIcon name="i-lucide-calendar-range" class="size-4.5" />
            </div>
            <div>
              <h2 class="text-sm font-bold text-gray-900 dark:text-white">Active Evaluation Period</h2>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Semester, school year, and department are loaded automatically.</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
          <UFormField label="Semester">
            <USelectMenu v-model="form.semester" :items="semesterOptions" value-key="value" disabled icon="i-lucide-calendar-days" placeholder="No active semester" class="w-full" size="lg" />
          </UFormField>
          <UFormField label="School Year">
            <UInput v-model="form.school_year" disabled icon="i-lucide-graduation-cap" placeholder="No active school year" class="w-full" size="lg" />
          </UFormField>
          <UFormField label="Evaluation Date">
            <UInput v-model="form.date" type="date" icon="i-lucide-calendar-check" class="w-full" size="lg" />
          </UFormField>
          <UFormField label="Department">
            <UInput v-model="form.department" disabled icon="i-lucide-building-2" placeholder="No department" class="w-full" size="lg" />
          </UFormField>
        </div>

        <div v-if="checkingExistingEvaluations" class="flex items-center gap-2 border-t border-gray-200 px-5 py-3 text-xs text-gray-500 sm:px-6 dark:border-gray-800 dark:text-gray-400">
          <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin text-emerald-500" />
          Checking your previous evaluations...
        </div>
      </section>

      <section v-if="!activeSchoolYear" class="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-900 dark:bg-amber-950/20">
        <div class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
          <UIcon name="i-lucide-calendar-x" class="size-7" />
        </div>
        <h2 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">No active evaluation period</h2>
        <p class="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600 dark:text-gray-400">The administrator has not configured an active school year and semester.</p>
      </section>

      <div v-else class="grid grid-cols-1 items-start gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:sticky xl:top-5 dark:border-gray-800 dark:bg-gray-900">
          <div class="border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white px-5 py-4 dark:border-gray-800 dark:from-gray-900 dark:to-gray-900">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <UIcon name="i-lucide-building-2" class="size-4 text-emerald-600 dark:text-emerald-400" />
                  Dean/Coordinator
                </h2>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Select one or more to evaluate.</p>
              </div>
              <UBadge color="primary" variant="subtle" size="sm">{{ selectedTargetIds.length }}/{{ availableTargetCount }}</UBadge>
            </div>
          </div>

          <div class="max-h-[430px] overflow-y-auto p-3">
            <div v-if="targetOptions.length === 0" class="px-3 py-10 text-center">
              <div class="mx-auto flex size-11 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-gray-800">
                <UIcon name="i-lucide-user-x" class="size-5" />
              </div>
              <p class="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">No Dean or Coordinator found</p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Contact the administrator for assistance.</p>
            </div>

            <UCheckboxGroup
              v-else
              v-model="selectedTargetIds"
              value-key="value"
              :items="targetOptions"
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
                  'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60'
                ].join(' ')
              }"
            >
              <template #label="{ item }">
                <div class="min-w-0 pr-1">
                  <p class="truncate text-sm font-semibold text-gray-800 group-has-[:checked]:text-emerald-700 dark:text-gray-200 dark:group-has-[:checked]:text-emerald-400">{{ item.label }}</p>
                  <p v-if="item.description" class="mt-0.5 truncate text-[11px] text-gray-500 dark:text-gray-400">{{ item.description }}</p>
                </div>
              </template>
            </UCheckboxGroup>
          </div>

          <div class="border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500 dark:text-gray-400">Evaluation progress</span>
              <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ overallProgress }}%</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
              <div class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" :style="{ width: `${overallProgress}%` }" />
            </div>
          </div>
        </aside>

        <div class="min-w-0 space-y-5">
          <section v-if="!selectedTargetIds.length" class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-900">
            <div class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
              <UIcon name="i-lucide-mouse-pointer-click" class="size-8" />
            </div>
            <h3 class="mt-5 text-lg font-bold text-gray-900 dark:text-white">Select a Dean or Coordinator</h3>
            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">Choose at least one Dean or Coordinator from the left panel.</p>
          </section>

          <template v-else>
            <section class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900">
              <div class="flex min-w-0 items-center gap-3">
                <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <UIcon name="i-lucide-user-round-check" class="size-5" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Currently evaluating</p>
                  <p class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ currentEvaluationTargetName }}</p>
                </div>
              </div>

              <div class="flex items-center justify-between gap-2 sm:justify-end">
                <UButton color="neutral" variant="outline" icon="i-lucide-chevron-left" :disabled="currentPage === 1" square @click="prevPage" />
                <div class="min-w-24 rounded-xl bg-gray-100 px-3 py-2 text-center text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">{{ currentPage }} of {{ totalPages }}</div>
                <UButton color="neutral" variant="outline" icon="i-lucide-chevron-right" :disabled="currentPage === totalPages" square @click="nextPage" />
              </div>
            </section>

            <section v-for="evaluation in paginatedEvaluations" :key="evaluation.deanCoordinatorId" class="rounded-[24px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div class="relative overflow-hidden rounded-t-[24px] border-b border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-5 py-6 text-white sm:px-7 dark:border-gray-800">
                <div class="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-emerald-500/20 blur-3xl" />
                <div class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div class="flex min-w-0 items-center gap-4">
                    <div class="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-300 backdrop-blur">
                      <UIcon name="i-lucide-building-2" class="size-7" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Dean/Coordinator Evaluation</p>
                      <h2 class="mt-1 truncate text-xl font-bold">{{ targetMap[String(evaluation.deanCoordinatorId)]?.name || 'Unknown' }}</h2>
                      <p class="mt-1 text-xs text-slate-300">Evaluation {{ currentPage }} of {{ totalPages }}</p>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                    <div class="flex items-center justify-between gap-5">
                      <div>
                        <p class="text-[10px] uppercase text-slate-300">Completion</p>
                        <p class="mt-0.5 text-lg font-bold">{{ getEvaluationProgress(evaluation) }}%</p>
                      </div>
                      <div class="flex size-10 items-center justify-center rounded-xl" :class="isEvaluationComplete(evaluation) ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300'">
                        <UIcon :name="isEvaluationComplete(evaluation) ? 'i-lucide-circle-check' : 'i-lucide-clock-3'" class="size-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-7 p-4 sm:p-6 lg:p-7">
                <div class="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                  <div class="flex items-start gap-3">
                    <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      <UIcon name="i-lucide-info" class="size-4.5" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <h3 class="text-sm font-bold text-gray-900 dark:text-white">Rating Guide</h3>
                      <p class="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400">Select one rating for every criterion.</p>
                      <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <div v-for="rating in ratingGuide" :key="rating.score" class="rounded-xl border border-blue-100 bg-white px-3 py-2 text-center dark:border-blue-900 dark:bg-gray-900">
                          <p class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ rating.score }}</p>
                          <p class="mt-0.5 text-[10px] font-medium text-gray-500 dark:text-gray-400">{{ rating.label }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-5">
                  <div v-for="section in sections" :key="section.id" class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
                    <div class="flex items-center justify-between gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3.5 sm:px-5 dark:border-gray-800 dark:bg-gray-950/50">
                      <div class="flex min-w-0 items-center gap-3">
                        <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                          <UIcon name="i-lucide-list-checks" class="size-4" />
                        </div>
                        <h3 class="truncate text-sm font-bold text-gray-900 dark:text-white">{{ section.title }}</h3>
                      </div>
                      <UBadge color="neutral" variant="subtle" size="sm">{{ getSectionAnsweredCount(evaluation, section) }}/{{ section.evaluation_criteria?.length || 0 }}</UBadge>
                    </div>

                    <div class="divide-y divide-gray-200 dark:divide-gray-800">
                      <div v-for="criterion in section.evaluation_criteria" :key="criterion.id" class="grid grid-cols-1 gap-4 px-4 py-4 transition-colors hover:bg-gray-50 sm:px-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center dark:hover:bg-gray-950/40">
                        <div class="flex min-w-0 items-start gap-3">
                          <span class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">{{ criterion.order }}</span>
                          <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">{{ criterion.statement }}</p>
                        </div>

                        <div class="grid grid-cols-4 gap-1.5 rounded-xl bg-gray-100 p-1.5 dark:bg-gray-800">
                          <label v-for="score in [4, 3, 2, 1]" :key="score" class="group cursor-pointer">
                            <input v-model="evaluation.responses[criterion.id]" :value="Number(score)" type="radio" class="peer sr-only">
                            <span class="flex h-10 items-center justify-center rounded-lg text-sm font-bold text-gray-500 transition-all group-hover:bg-white group-hover:text-emerald-600 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:shadow-md dark:text-gray-400 dark:group-hover:bg-gray-700 dark:group-hover:text-emerald-400">{{ score }}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div class="overflow-hidden rounded-2xl border border-emerald-100 dark:border-emerald-900">
                    <div class="border-b border-emerald-100 bg-emerald-50 px-4 py-3.5 dark:border-emerald-900 dark:bg-emerald-950/20">
                      <h3 class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"><UIcon name="i-lucide-thumbs-up" class="size-4 text-emerald-500" />Strengths</h3>
                    </div>
                    <div class="p-4"><UTextarea v-model="evaluation.strengths" :rows="5" autoresize placeholder="Describe the strongest qualities..." class="w-full" /></div>
                  </div>

                  <div class="overflow-hidden rounded-2xl border border-amber-100 dark:border-amber-900">
                    <div class="border-b border-amber-100 bg-amber-50 px-4 py-3.5 dark:border-amber-900 dark:bg-amber-950/20">
                      <h3 class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"><UIcon name="i-lucide-lightbulb" class="size-4 text-amber-500" />Areas for Improvement</h3>
                    </div>
                    <div class="p-4"><UTextarea v-model="evaluation.areas_for_improvement" :rows="5" autoresize placeholder="Suggest areas that may be improved..." class="w-full" /></div>
                  </div>
                </div>

                <div class="overflow-hidden rounded-2xl border border-violet-100 dark:border-violet-900">
                  <div class="border-b border-violet-100 bg-violet-50 px-4 py-3.5 dark:border-violet-900 dark:bg-violet-950/20">
                    <h3 class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"><UIcon name="i-lucide-message-square-text" class="size-4 text-violet-500" />Additional Comment</h3>
                  </div>
                  <div class="p-4"><UTextarea v-model="evaluation.comment" :rows="4" autoresize placeholder="Add any additional constructive comment..." class="w-full" /></div>
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div class="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Answered Items</p>
                    <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ getAnsweredCount(evaluation) }} <span class="text-sm font-medium text-gray-400">/ {{ totalCriteriaCount }}</span></p>
                  </div>
                  <div class="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/20">
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Score</p>
                    <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ getTotalScore(evaluation) }}</p>
                  </div>
                  <div class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Average Score</p>
                    <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ getAverageScore(evaluation) }} <span class="text-sm font-medium text-gray-400">/ 4</span></p>
                  </div>
                </div>
              </div>
            </section>

            <section v-if="selectedTargetIds.length > 1" class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900">
              <UButton color="neutral" variant="outline" icon="i-lucide-arrow-left" :disabled="currentPage === 1" @click="prevPage">Previous</UButton>
              <div class="text-center">
                <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">Evaluation {{ currentPage }} of {{ totalPages }}</p>
                <p class="mt-0.5 text-xs text-gray-400">{{ completedEvaluationCount }} evaluation(s) complete</p>
              </div>
              <UButton color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right" :disabled="currentPage === totalPages" @click="nextPage">Next</UButton>
            </section>

            <div v-if="submitError" class="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
              <UIcon name="i-lucide-circle-alert" class="mt-0.5 size-5 shrink-0 text-red-600 dark:text-red-400" />
              <p class="text-sm font-medium text-red-700 dark:text-red-300">{{ submitError }}</p>
            </div>

            <section class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900">
              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">Submit Evaluations</h3>
                <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">Review all ratings before submitting. Submitted evaluations may no longer be edited.</p>
              </div>
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
                <UButton color="neutral" variant="outline" icon="i-lucide-rotate-ccw" :disabled="submitLoading" @click="resetForm">Reset Responses</UButton>
                <UButton icon="i-lucide-send" size="lg" :loading="submitLoading" :disabled="!isFormValid || submitLoading" @click="openSubmitConfirmation">Submit All Evaluations</UButton>
              </div>
            </section>
          </template>
        </div>
      </div>
    </template>

    <UModal v-model:open="confirmationOpen">
      <template #content>
        <div class="relative overflow-hidden rounded-[28px] border border-white/20 bg-white/95 shadow-[0_20px_80px_rgba(15,23,42,0.20)] backdrop-blur-2xl dark:border-gray-800 dark:bg-gray-900/95">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 dark:from-emerald-950/20 dark:via-gray-900 dark:to-teal-950/20" />
          <div class="absolute -right-10 -top-10 size-44 rounded-full bg-emerald-500/10 blur-3xl" />

          <div class="relative p-7">
            <div class="mx-auto flex size-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/30">
              <UIcon name="i-lucide-send" class="size-9" />
            </div>

            <div class="mt-5 text-center">
              <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Submit evaluations?</h2>
              <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">You are submitting <strong>{{ form.evaluations.length }}</strong> Dean/Coordinator evaluation(s). Submitted evaluations may no longer be edited.</p>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-3">
              <div class="rounded-2xl border border-emerald-100 bg-white/70 p-4 text-center dark:border-emerald-900 dark:bg-gray-950/40">
                <p class="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Semester</p>
                <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">{{ form.semester }}</p>
              </div>
              <div class="rounded-2xl border border-emerald-100 bg-white/70 p-4 text-center dark:border-emerald-900 dark:bg-gray-950/40">
                <p class="text-[10px] font-semibold uppercase tracking-wide text-gray-400">School Year</p>
                <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">{{ form.school_year }}</p>
              </div>
            </div>

            <div class="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40">
              <div class="flex items-center justify-between"><span class="text-sm text-gray-500 dark:text-gray-400">Department</span><span class="text-sm font-bold text-gray-900 dark:text-white">{{ form.department }}</span></div>
              <div class="mt-3 flex items-center justify-between"><span class="text-sm text-gray-500 dark:text-gray-400">Evaluations</span><span class="text-sm font-bold text-gray-900 dark:text-white">{{ form.evaluations.length }}</span></div>
            </div>

            <div class="mt-7 flex gap-3">
              <UButton block color="neutral" variant="soft" size="lg" class="rounded-2xl" :disabled="submitLoading" @click="confirmationOpen = false">Review Again</UButton>
              <UButton block size="lg" icon="i-lucide-send" class="rounded-2xl" :loading="submitLoading" @click="submitEvaluation">Confirm Submission</UButton>
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
  role: ['Faculty']
})

const { $api } = useNuxtApp()
const { user } = useAuth()
const toast = useToast()

const pending = ref(true)
const loadError = ref('')
const submitLoading = ref(false)
const submitError = ref('')

const selectedTargetIds = ref<number[]>([])
const currentPage = ref(1)
const itemsPerPage = 1

const targets = ref<any[]>([])
const sections = ref<any[]>([])
const evaluationType = ref<any>(null)
const existingEvaluations = ref<any[]>([])
const loggedInTeacher = ref<any>(null)
const departmentId = ref<number | null>(null)
const activeSchoolYear = ref<any>(null)
const checkingExistingEvaluations = ref(false)
const confirmationOpen = ref(false)

const semesterOptions = [
  { label: '1st Semester', value: '1st Semester' },
  { label: '2nd Semester', value: '2nd Semester' },
  { label: 'Summer', value: 'Summer' }
]

const ratingGuide = [
  { score: 4, label: 'Superior' },
  { score: 3, label: 'Average' },
  { score: 2, label: 'Fair' },
  { score: 1, label: 'Needs Improvement' }
]

const form = reactive({
  semester: '',
  school_year: '',
  date: new Date().toISOString().slice(0, 10),
  department: '',
  evaluations: [] as any[]
})

const targetOptions = computed(() =>
  targets.value.map((item: any) => {
    const alreadyEvaluated = existingEvaluations.value.some(
      (evaluation: any) => evaluation.dean_coordinator?.id === item.id
    )

    return {
      label: alreadyEvaluated ? `${item.name} (Already Evaluated)` : item.name,
      description: alreadyEvaluated
        ? 'Evaluation already submitted for this period.'
        : item.department?.name || form.department,
      value: item.id,
      disabled: alreadyEvaluated
    }
  })
)

const availableTargetCount = computed(() =>
  targetOptions.value.filter((item: any) => !item.disabled).length
)

const targetMap = computed(() => {
  const map: Record<string, any> = {}
  targets.value.forEach((item: any) => {
    map[String(item.id)] = item
  })
  return map
})

const filteredCriteria = computed(() =>
  sections.value.flatMap((section: any) => section.evaluation_criteria || [])
)

const totalCriteriaCount = computed(() => filteredCriteria.value.length)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(form.evaluations.length / itemsPerPage))
)

const paginatedEvaluations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return form.evaluations.slice(start, start + itemsPerPage)
})

const completedEvaluationCount = computed(() =>
  form.evaluations.filter((evaluation: any) => isEvaluationComplete(evaluation)).length
)

const overallProgress = computed(() => {
  if (!form.evaluations.length) return 0

  const totalRequired = form.evaluations.length * Math.max(totalCriteriaCount.value, 1)
  const totalAnswered = form.evaluations.reduce(
    (sum: number, evaluation: any) => sum + getAnsweredCount(evaluation),
    0
  )

  return Math.min(100, Math.round((totalAnswered / totalRequired) * 100))
})

const currentEvaluationTargetName = computed(() => {
  const evaluation = paginatedEvaluations.value[0]
  if (!evaluation) return 'No Dean or Coordinator selected'
  return targetMap.value[String(evaluation.deanCoordinatorId)]?.name || 'Unknown'
})

const isFormValid = computed(() => {
  if (!form.semester || !form.school_year || !form.date || !form.department) return false
  if (!form.evaluations.length) return false
  return form.evaluations.every((evaluation: any) => isEvaluationComplete(evaluation))
})

const createEvaluation = (deanCoordinatorId: number | string) => ({
  deanCoordinatorId: Number(deanCoordinatorId),
  strengths: '',
  areas_for_improvement: '',
  comment: '',
  responses: {} as Record<number, number>
})

const syncEvaluationsFromSelection = () => {
  const existingMap = new Map(
    form.evaluations.map((evaluation: any) => [
      Number(evaluation.deanCoordinatorId),
      evaluation
    ])
  )

  form.evaluations = selectedTargetIds.value.map((id) => {
    const numericId = Number(id)
    return existingMap.get(numericId) || createEvaluation(numericId)
  })

  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  if (!form.evaluations.length) currentPage.value = 1
}

const getAnsweredCount = (evaluation: any) => Object.keys(evaluation.responses).length

const getTotalScore = (evaluation: any) =>
  Object.values(evaluation.responses).reduce(
    (sum: number, score: any) => sum + Number(score),
    0
  )

const getAverageScore = (evaluation: any) => {
  const answered = getAnsweredCount(evaluation)
  if (!answered) return 0
  return Number((getTotalScore(evaluation) / answered).toFixed(2))
}

const isEvaluationComplete = (evaluation: any) =>
  Boolean(
    evaluation.deanCoordinatorId &&
    totalCriteriaCount.value > 0 &&
    getAnsweredCount(evaluation) === totalCriteriaCount.value
  )

const getEvaluationProgress = (evaluation: any) => {
  if (!totalCriteriaCount.value) return 0
  return Math.min(
    100,
    Math.round((getAnsweredCount(evaluation) / totalCriteriaCount.value) * 100)
  )
}

const getSectionAnsweredCount = (evaluation: any, section: any) => {
  const criteria = section.evaluation_criteria || []
  return criteria.filter(
    (criterion: any) => evaluation.responses[criterion.id] !== undefined
  ).length
}

const scrollToTop = async () => {
  await nextTick()
  if (!import.meta.client) return
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  await scrollToTop()
}

const prevPage = async () => goToPage(currentPage.value - 1)
const nextPage = async () => goToPage(currentPage.value + 1)

const getActiveSchoolYear = async () => {
  const response = await $api('/school-years', {
    query: {
      'filters[active_sy][$eq]': true,
      'pagination[pageSize]': 1
    }
  })

  activeSchoolYear.value = response.data?.[0] || null

  if (!activeSchoolYear.value) {
    form.semester = ''
    form.school_year = ''
    return
  }

  form.semester = activeSchoolYear.value.semester || ''
  form.school_year = activeSchoolYear.value.school_year || ''
}

const getEvaluationType = async () => {
  const response = await $api('/evaluation-types', {
    query: {
      'filters[code][$eq]': 'faculty-dean-coordinator',
      'pagination[pageSize]': 1
    }
  })

  evaluationType.value = response.data?.[0] || null
}

const getLoggedInTeacher = async () => {
  if (!user.value?.id) return null

  const response = await $api('/teachers', {
    query: {
      'filters[user][id][$eq]': user.value.id,
      'populate[department]': true,
      'populate[user][populate][0]': 'role',
      'pagination[pageSize]': 1
    }
  })

  loggedInTeacher.value = response.data?.[0] || null
  departmentId.value = loggedInTeacher.value?.department?.id || null
  form.department = loggedInTeacher.value?.department?.name || ''
  return loggedInTeacher.value
}

const getTargets = async () => {
  const teacherProfile = loggedInTeacher.value || await getLoggedInTeacher()

  if (!teacherProfile?.department?.id) {
    targets.value = []
    return
  }

  const response = await $api('/teachers', {
    query: {
      'populate[user][populate][0]': 'role',
      'populate[department]': true,
      'filters[user][role][name][$eq]': 'Dean',
      'filters[department][id][$eq]': teacherProfile.department.id,
      'sort[0]': 'name:asc',
      'pagination[pageSize]': 100
    }
  })

  targets.value = response.data || []
}

const getSections = async () => {
  if (!evaluationType.value?.documentId) return

  const response = await $api('/evaluation-sections', {
    query: {
      'filters[evaluation_type][documentId][$eq]': evaluationType.value.documentId,
      'populate[evaluation_criteria][sort][0]': 'order:asc',
      'populate[evaluation_type]': true,
      'sort[0]': 'order:asc',
      'pagination[pageSize]': 100
    }
  })

  sections.value = response.data || []
}

const getExistingEvaluations = async () => {
  if (!user.value?.id || !form.semester || !form.school_year) {
    existingEvaluations.value = []
    return
  }

  try {
    checkingExistingEvaluations.value = true

    const response = await $api('/evaluations', {
      query: {
        'filters[evaluator_user][id][$eq]': user.value.id,
        'filters[batch][semester][$eq]': form.semester,
        'filters[batch][school_year][$eq]': form.school_year,
        'filters[batch][evaluation_type][code][$eq]': 'faculty-dean-coordinator',
        'populate[dean_coordinator]': true,
        'pagination[pageSize]': 100
      }
    })

    existingEvaluations.value = response.data || []
  } catch (error) {
    console.error('Existing evaluation check error:', error)
    toast.add({
      title: 'Unable to check previous evaluations',
      description: 'Please refresh the page and try again.',
      icon: 'i-lucide-triangle-alert',
      color: 'warning'
    })
  } finally {
    checkingExistingEvaluations.value = false
  }
}

const loadData = async () => {
  try {
    pending.value = true
    loadError.value = ''
    submitError.value = ''

    await getActiveSchoolYear()
    await getEvaluationType()

    if (!activeSchoolYear.value) {
      throw new Error('No active school year and semester are configured.')
    }

    if (!evaluationType.value) {
      throw new Error('Faculty-Dean/Coordinator evaluation type is not configured.')
    }

    await getLoggedInTeacher()

    if (!loggedInTeacher.value) {
      throw new Error('The logged-in faculty profile could not be found.')
    }

    if (!form.department) {
      throw new Error('The faculty member is not assigned to a department.')
    }

    await Promise.all([getTargets(), getSections()])
    await getExistingEvaluations()
  } catch (error: any) {
    console.error('Faculty evaluation loading error:', error)
    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to load the evaluation form.'
  } finally {
    pending.value = false
  }
}

const openSubmitConfirmation = async () => {
  submitError.value = ''

  if (!isFormValid.value) {
    const incompleteIndex = form.evaluations.findIndex(
      (evaluation: any) => !isEvaluationComplete(evaluation)
    )

    if (incompleteIndex >= 0) currentPage.value = incompleteIndex + 1

    submitError.value = 'Please answer all criteria for every selected evaluation.'

    toast.add({
      title: 'Incomplete evaluations',
      description: 'Complete every selected Dean/Coordinator evaluation before submitting.',
      icon: 'i-lucide-circle-alert',
      color: 'warning'
    })

    await scrollToTop()
    return
  }

  confirmationOpen.value = true
}

const submitEvaluation = async () => {
  submitError.value = ''

  if (!evaluationType.value?.id) {
    submitError.value = 'Evaluation type not found.'
    return
  }

  if (!isFormValid.value) {
    confirmationOpen.value = false
    submitError.value = 'Please complete all required ratings.'
    return
  }

  try {
    submitLoading.value = true

    const evaluations = form.evaluations.map((evaluation: any) => ({
      dean_coordinator: evaluation.deanCoordinatorId,
      strengths: evaluation.strengths,
      areas_for_improvement: evaluation.areas_for_improvement,
      comment: evaluation.comment,
      responses: evaluation.responses
    }))

    await $api('/submit-multiple-evaluations', {
      method: 'POST',
      body: {
        evaluation_type: evaluationType.value.id,
        semester: form.semester,
        school_year: form.school_year,
        date: form.date,
        department: form.department,
        evaluations
      }
    })

    confirmationOpen.value = false

    toast.add({
      title: 'Evaluations submitted',
      description: 'Faculty to Dean/Coordinator evaluations were submitted successfully.',
      icon: 'i-lucide-circle-check',
      color: 'success'
    })

    await getExistingEvaluations()
    selectedTargetIds.value = []
    form.evaluations = []
    currentPage.value = 1
    await scrollToTop()
  } catch (error: any) {
    console.error('Faculty evaluation submission error:', error)
    confirmationOpen.value = false
    submitError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to submit evaluations.'

    toast.add({
      title: 'Submission failed',
      description: submitError.value,
      icon: 'i-lucide-circle-alert',
      color: 'error'
    })
  } finally {
    submitLoading.value = false
  }
}

const resetForm = async () => {
  form.date = new Date().toISOString().slice(0, 10)
  form.evaluations = []
  selectedTargetIds.value = []
  currentPage.value = 1
  submitError.value = ''

  toast.add({
    title: 'Responses cleared',
    description: 'The active semester, school year, and department were preserved.',
    icon: 'i-lucide-rotate-ccw',
    color: 'neutral'
  })

  await scrollToTop()
}

watch(
  selectedTargetIds,
  async (newSelection, oldSelection) => {
    syncEvaluationsFromSelection()
    submitError.value = ''

    if (newSelection.length > (oldSelection?.length || 0)) {
      currentPage.value = form.evaluations.length
      await scrollToTop()
    }
  },
  { deep: true }
)

watch(
  user,
  async (value) => {
    if (value?.id) await loadData()
  },
  { immediate: true }
)
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
