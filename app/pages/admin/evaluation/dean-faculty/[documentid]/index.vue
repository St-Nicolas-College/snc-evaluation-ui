<template>
  <div class="space-y-5 pb-10">
    <!-- =====================================================
         PAGE TOOLBAR
    ====================================================== -->
    <div
      class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white/80 px-3 py-2 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/80"
    >
      <div class="flex flex-wrap items-center gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-arrow-left"
          class="print:hidden"
          @click="goBack"
        >
          Back to Dean–Faculty Results
        </UButton>

        <!-- <UButton
          color="primary"
          variant="soft"
          icon="i-lucide-printer"
          class="print:hidden"
          :disabled="pending || !selectedGroup || isGeneratingPdf"
          @click="printReport"
        >
          Print Report
        </UButton> -->
      </div>

      <div
        v-if="hasValidFacultyId"
        class="hidden text-right sm:block print:hidden"
      >
        <!-- <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
          Faculty Member document ID
        </p>

        <p
          class="max-w-[280px] truncate text-xs font-semibold text-gray-700 dark:text-gray-300"
        >
          {{ facultyDocumentId }}
        </p> -->

        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-file-search"
          class="print:hidden mr-2"
          :loading="isGeneratingPdf && pdfAction === 'preview'"
          :disabled="pending || !selectedGroup || isGeneratingPdf"
          @click="previewPdfReport"
        >
          Preview Report
        </UButton>

        <UButton
          color="primary"
          icon="i-lucide-download"
          class="print:hidden"
          :loading="isGeneratingPdf && pdfAction === 'download'"
          :disabled="pending || !selectedGroup || isGeneratingPdf"
          @click="downloadPdfReport"
        >
          Download Report
        </UButton>
      </div>
    </div>

    <!-- =====================================================
         LOADING
    ====================================================== -->
    <div
      v-if="pending"
      class="flex min-h-[360px] items-center justify-center rounded-[28px] border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="text-center">
        <UIcon
          name="i-lucide-loader-circle"
          class="mx-auto size-8 animate-spin text-violet-600"
        />

        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Loading Faculty evaluation summary...
        </p>
      </div>
    </div>

    <!-- =====================================================
         ERROR
    ====================================================== -->
    <div
      v-else-if="loadError"
      class="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <UIcon
        name="i-lucide-triangle-alert"
        class="mx-auto size-9 text-red-600"
      />

      <h1 class="mt-3 text-lg font-bold text-red-900 dark:text-red-200">
        Unable to load Faculty evaluation summary
      </h1>

      <p class="mx-auto mt-2 max-w-xl text-sm text-red-700 dark:text-red-300">
        {{ loadError }}
      </p>

      <UButton
        class="mt-5"
        color="error"
        variant="soft"
        icon="i-lucide-refresh-cw"
        @click="getResults"
      >
        Try Again
      </UButton>
    </div>

    <!-- =====================================================
         SUMMARY
    ====================================================== -->
    <div
      v-if="selectedGroup"
      class="overflow-hidden rounded-[30px] border border-gray-200/80 bg-white shadow-[0_24px_70px_-32px_rgba(15,23,42,0.35)] dark:border-gray-800 dark:bg-gray-900"
    >
      <!-- HERO -->
      <div
        class="relative overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-950 px-5 py-6 text-white sm:px-7 sm:py-7"
      >
        <div
          class="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-violet-400/20 blur-3xl"
        />
        <div
          class="pointer-events-none absolute -bottom-24 left-1/3 size-56 rounded-full bg-cyan-400/10 blur-3xl"
        />
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%)]"
        />

        <div
          class="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
        >
          <div class="flex min-w-0 items-center gap-4">
            <div
              class="flex size-16 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-xl font-black shadow-inner shadow-white/5 backdrop-blur"
            >
              {{ createInitials(selectedGroup.name) }}
            </div>

            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <p
                  class="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300"
                >
                  Faculty Evaluation Summary
                </p>

                <UBadge color="primary" variant="subtle">
                  {{ selectedGroup.recordCount }} Responses
                </UBadge>

                <UBadge
                  v-if="evaluationType"
                  color="info"
                  variant="subtle"
                >
                  {{ evaluationType.name }} ·
                  {{ ratingMinScore ?? "—" }}–{{ ratingMaxScore ?? "—" }}
                </UBadge>
              </div>

              <h1
                class="mt-2 truncate text-2xl font-black tracking-tight sm:text-3xl"
              >
                {{ selectedGroup.name }}
              </h1>

              <div
                class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300"
              >
                <span class="inline-flex items-center gap-1.5">
                  <UIcon name="i-lucide-building-2" class="size-3.5" />
                  {{ selectedGroup.department }}
                </span>

                <span class="inline-flex items-center gap-1.5">
                  <UIcon name="i-lucide-users" class="size-3.5" />
                  {{ selectedGroup.evaluatorCount }} Dean Evaluators
                </span>

                <span class="inline-flex items-center gap-1.5">
                  <UIcon name="i-lucide-list-checks" class="size-3.5" />
                  {{ selectedGroup.criteriaCount }} Criteria
                </span>
              </div>

              <div class="mt-4 grid max-w-xl gap-2 sm:grid-cols-2">
                <div
                  class="rounded-2xl border border-white/10 bg-white/10 px-3.5 py-3 backdrop-blur"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-violet-400/15 text-violet-300"
                    >
                      <UIcon name="i-lucide-calendar-range" class="size-4" />
                    </div>

                    <div class="min-w-0">
                      <p
                        class="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400"
                      >
                        Current Semester
                      </p>

                      <p class="mt-0.5 truncate text-xs font-bold text-white">
                        {{ currentSemesterLabel }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="rounded-2xl border border-white/10 bg-white/10 px-3.5 py-3 backdrop-blur"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300"
                    >
                      <UIcon name="i-lucide-graduation-cap" class="size-4" />
                    </div>

                    <div class="min-w-0">
                      <p
                        class="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400"
                      >
                        Current School Year
                      </p>

                      <p class="mt-0.5 truncate text-xs font-bold text-white">
                        {{ currentSchoolYearLabel }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-xl shadow-black/10 backdrop-blur-md sm:min-w-[250px]"
          >
            <div class="flex items-center justify-between gap-4">
              <div>
                <p
                  class="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-200"
                >
                  Overall Rating
                </p>

                <p class="mt-1 text-4xl font-black tracking-tight">
                  {{ formatNumber(selectedGroup.averageScore) }}
                  <span class="text-lg font-semibold text-slate-300">/{{ ratingMaxScore ?? "—" }}</span>
                </p>
              </div>

              <div
                class="flex size-12 items-center justify-center rounded-2xl bg-amber-400/15"
              >
                <UIcon
                  name="i-lucide-star"
                  class="size-6 fill-amber-400 text-amber-400"
                />
              </div>
            </div>

            <div class="mt-3 flex items-center gap-1">
              <UIcon
                v-for="rating in ratingScale"
                :key="`overall-rating-${rating.score}`"
                name="i-lucide-star"
                class="size-4"
                :title="`${rating.score} - ${rating.label}`"
                :class="
                  Number(rating.score) <= Math.round(selectedGroup.averageScore)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-white/25'
                "
              />
            </div>

            <div class="mt-3 flex items-center justify-between gap-3">
              <UBadge
                :color="ratingColor(selectedGroup.averageScore)"
                variant="subtle"
              >
                {{ getRatingLabel(selectedGroup.averageScore) }}
              </UBadge>

              <p class="text-[11px] text-slate-300">
                {{ selectedGroup.totalRatingResponses }} ratings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-5 p-4 sm:p-6">
        <!-- EVALUATION PERIOD -->
        <!-- <section
          class="overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-amber-50 shadow-sm dark:border-violet-900/50 dark:from-violet-950/20 dark:via-gray-900 dark:to-amber-950/10"
        >
          <div
            class="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
              >
                <UIcon name="i-lucide-calendar-days" class="size-5" />
              </div>

              <div>
                <p
                  class="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-400"
                >
                  Evaluation Period
                </p>

                <h2
                  class="mt-1 text-base font-black text-gray-950 dark:text-white"
                >
                  {{ currentSemesterLabel }} · {{ currentSchoolYearLabel }}
                </h2>

                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  All ratings, criteria summaries, comments, strengths, and
                  improvement areas on this page are based on this academic
                  period.
                </p>
              </div>
            </div>

            <div class="grid shrink-0 grid-cols-2 gap-2">
              <div
                class="min-w-[132px] rounded-2xl border border-white bg-white/80 px-3 py-2.5 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950/60"
              >
                <p
                  class="text-[9px] font-bold uppercase tracking-[0.13em] text-gray-400"
                >
                  Semester
                </p>

                <p class="mt-1 text-xs font-black text-gray-900 dark:text-white">
                  {{ currentSemesterLabel }}
                </p>
              </div>

              <div
                class="min-w-[132px] rounded-2xl border border-white bg-white/80 px-3 py-2.5 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950/60"
              >
                <p
                  class="text-[9px] font-bold uppercase tracking-[0.13em] text-gray-400"
                >
                  School Year
                </p>

                <p class="mt-1 text-xs font-black text-gray-900 dark:text-white">
                  {{ currentSchoolYearLabel }}
                </p>
              </div>
            </div>
          </div>
        </section> -->

        <!-- KPI CARDS -->
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="card in summaryCards"
            :key="card.label"
            class="group rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:from-gray-900 dark:to-gray-950/60"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p
                  class="text-[10px] font-bold uppercase tracking-[0.14em]"
                  :class="card.labelClass"
                >
                  {{ card.label }}
                </p>

                <p
                  class="mt-2 text-2xl font-black tracking-tight text-gray-950 dark:text-white"
                >
                  {{ card.value }}
                </p>

                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{ card.caption }}
                </p>
              </div>

              <div
                class="flex size-11 items-center justify-center rounded-2xl"
                :class="card.iconClass"
              >
                <UIcon :name="card.icon" class="size-5" />
              </div>
            </div>
          </article>
        </div>

        <!-- SUMMARY NAVIGATION -->
        <div
          class="sticky top-3 z-20 rounded-2xl border border-gray-200/80 bg-white/90 p-1.5 shadow-lg shadow-slate-900/5 backdrop-blur-xl print:hidden dark:border-gray-800 dark:bg-gray-900/90"
        >
          <div class="grid grid-cols-3 gap-2">
            <UButton
              v-for="tab in summaryTabs"
              :key="tab.value"
              :icon="tab.icon"
              :color="activeTab === tab.value ? 'primary' : 'neutral'"
              :variant="activeTab === tab.value ? 'soft' : 'ghost'"
              class="justify-center rounded-xl py-2.5 font-semibold"
              @click="activeTab = tab.value"
            >
              {{ tab.label }}
            </UButton>
          </div>
        </div>

        <!-- =================================================
             OVERVIEW TAB
        ================================================== -->
        <div v-show="activeTab === 'overview'" class="space-y-5 print:block">
          <!-- CONSOLIDATED SUMMARY -->
          <section
            class="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="border-b border-gray-200/80 bg-gradient-to-r from-gray-50 to-white px-5 py-4 dark:border-gray-800 dark:from-gray-950/60 dark:to-gray-900"
            >
              <div
                class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                    Consolidated Faculty Summary
                  </h3>

                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Combined result from
                    {{ selectedGroup.evaluatorCount }}
                    Dean respondent{{
                      selectedGroup.evaluatorCount === 1 ? "" : "s"
                    }}.
                  </p>
                </div>

                <UBadge
                  :color="ratingColor(selectedGroup.averageScore)"
                  variant="subtle"
                  size="lg"
                >
                  {{ formatNumber(selectedGroup.averageScore) }}/{{ ratingMaxScore ?? "—" }} ·
                  {{ getRatingLabel(selectedGroup.averageScore) }}
                </UBadge>
              </div>
            </div>

            <div
              class="grid grid-cols-1 gap-3 border-t border-gray-200 p-4 sm:grid-cols-2 xl:grid-cols-4 dark:border-gray-800"
            >
              <div
                v-for="rating in ratingScaleDescending"
                :key="`rating-${rating.score}`"
                class="group rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:from-gray-900 dark:to-gray-950/60"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="flex items-center gap-1">
                      <UIcon
                        name="i-lucide-star"
                        class="size-3.5 fill-amber-400 text-amber-400"
                      />

                      <p
                        class="text-xs font-bold text-gray-900 dark:text-white"
                      >
                        {{ rating.score }} Point
                      </p>
                    </div>

                    <p
                      class="mt-1 text-[10px] text-gray-500 dark:text-gray-400"
                    >
                      {{ rating.label }}
                    </p>
                  </div>

                  <p
                    class="text-xl font-black tracking-tight text-gray-900 dark:text-white"
                  >
                    {{ selectedGroup.ratingDistribution[rating.score] || 0 }}
                  </p>
                </div>

                <div
                  class="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
                >
                  <div
                    class="h-full rounded-full bg-amber-400 transition-all"
                    :style="{
                      width: `${getRatingPercentage(
                        selectedGroup.ratingDistribution[rating.score] || 0,
                        selectedGroup.totalRatingResponses,
                      )}%`,
                    }"
                  />
                </div>

                <div class="mt-2 flex items-center justify-between gap-2">
                  <p class="text-[10px] text-gray-500 dark:text-gray-400">
                    Responses
                  </p>

                  <p
                    class="text-[10px] font-bold text-gray-700 dark:text-gray-300"
                  >
                    {{
                      formatNumber(
                        getRatingPercentage(
                          selectedGroup.ratingDistribution[rating.score] || 0,
                          selectedGroup.totalRatingResponses,
                        ),
                      )
                    }}%
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- WRITTEN FEEDBACK SUMMARY -->
          <section class="grid gap-4 lg:grid-cols-2">
            <article
              class="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/20"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  <UIcon name="i-lucide-thumbs-up" class="size-5" />
                </div>

                <div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                    Consolidated Strengths
                  </h3>

                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Combined faculty strengths identified by Dean evaluators.
                  </p>
                </div>
              </div>

              <div v-if="consolidatedStrengths.length" class="mt-4 space-y-3">
                <div
                  v-for="(item, index) in consolidatedStrengths"
                  :key="`${index}-${item}`"
                  class="flex gap-3 rounded-2xl border border-emerald-100 bg-white/70 p-3 text-sm leading-6 text-gray-600 dark:border-emerald-900 dark:bg-gray-950/30 dark:text-gray-300"
                >
                  <span
                    class="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500"
                  />
                  <span>{{ item }}</span>
                </div>
              </div>

              <div
                v-else
                class="mt-4 rounded-2xl border border-dashed border-emerald-200 px-4 py-7 text-center dark:border-emerald-900"
              >
                <UIcon
                  name="i-lucide-message-square-off"
                  class="mx-auto size-7 text-emerald-400"
                />

                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No written strengths were submitted.
                </p>
              </div>
            </article>

            <article
              class="rounded-3xl border border-amber-100 bg-amber-50/60 p-5 shadow-sm dark:border-amber-900 dark:bg-amber-950/20"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                >
                  <UIcon name="i-lucide-lightbulb" class="size-5" />
                </div>

                <div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                    Areas for Improvement
                  </h3>

                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Combined areas for improvement identified by Dean
                    evaluators.
                  </p>
                </div>
              </div>

              <div
                v-if="consolidatedImprovements.length"
                class="mt-4 space-y-3"
              >
                <div
                  v-for="(item, index) in consolidatedImprovements"
                  :key="`${index}-${item}`"
                  class="flex gap-3 rounded-2xl border border-amber-100 bg-white/70 p-3 text-sm leading-6 text-gray-600 dark:border-amber-900 dark:bg-gray-950/30 dark:text-gray-300"
                >
                  <span
                    class="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500"
                  />
                  <span>{{ item }}</span>
                </div>
              </div>

              <div
                v-else
                class="mt-4 rounded-2xl border border-dashed border-amber-200 px-4 py-7 text-center dark:border-amber-900"
              >
                <UIcon
                  name="i-lucide-message-square-off"
                  class="mx-auto size-7 text-amber-400"
                />

                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No areas for improvement were submitted.
                </p>
              </div>
            </article>
          </section>

          <!-- COMMENTS SUMMARY -->
          <section
            class="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="border-b border-gray-200/80 bg-gradient-to-r from-violet-50 via-white to-indigo-50 px-5 py-4 dark:border-gray-800 dark:from-violet-950/20 dark:via-gray-900 dark:to-indigo-950/20"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                >
                  <UIcon name="i-lucide-message-square-text" class="size-5" />
                </div>

                <div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                    Consolidated Dean Comments
                  </h3>

                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Written comments submitted by Dean evaluators for this
                    faculty member.
                  </p>
                </div>
              </div>
            </div>

            <div
              v-if="consolidatedComments.length"
              class="grid gap-3 p-5 lg:grid-cols-2"
            >
              <article
                v-for="(comment, index) in consolidatedComments"
                :key="`${index}-${comment}`"
                class="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:bg-gray-950/30 dark:text-gray-300"
              >
                {{ comment }}
              </article>
            </div>

            <div v-else class="px-5 py-10 text-center">
              <UIcon
                name="i-lucide-message-square-off"
                class="mx-auto size-8 text-gray-400"
              />

              <p
                class="mt-3 text-sm font-semibold text-gray-900 dark:text-white"
              >
                No written comments available
              </p>
            </div>
          </section>

          <!-- OVERALL AI SENTIMENT ANALYSIS -->
          <section
            class="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="border-b border-gray-200/80 bg-gradient-to-r from-violet-50 via-white to-emerald-50 px-5 py-4 dark:border-gray-800 dark:from-violet-950/20 dark:via-gray-900 dark:to-emerald-950/20"
            >
              <div
                class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                  >
                    <UIcon name="i-lucide-sparkles" class="size-5" />
                  </div>

                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                      Overall AI Sentiment Analysis
                    </h3>

                    <p
                      class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400"
                    >
                      Consolidated analysis of Dean comments and available AI
                      sentiment results submitted for this Dean or Coordinator.
                    </p>
                  </div>
                </div>

                <UBadge
                  :color="
                    sentimentColor(
                      selectedFacultySentimentAnalysis.overallSentiment,
                    )
                  "
                  variant="subtle"
                  size="lg"
                >
                  {{ selectedFacultySentimentAnalysis.overallSentiment }}
                </UBadge>
              </div>
            </div>

            <div class="space-y-5 p-5">
              <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article
                  class="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <p
                        class="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400"
                      >
                        Positive
                      </p>

                      <p
                        class="mt-2 text-2xl font-black text-gray-950 dark:text-white"
                      >
                        {{ selectedFacultySentimentAnalysis.positive }}
                      </p>

                      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {{
                          formatNumber(
                            selectedFacultySentimentAnalysis.positivePercentage,
                          )
                        }}%
                      </p>
                    </div>

                    <div
                      class="flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    >
                      <UIcon name="i-lucide-smile" class="size-5" />
                    </div>
                  </div>
                </article>

                <article
                  class="rounded-2xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-950/30"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <p
                        class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-600 dark:text-gray-400"
                      >
                        Neutral
                      </p>

                      <p
                        class="mt-2 text-2xl font-black text-gray-950 dark:text-white"
                      >
                        {{ selectedFacultySentimentAnalysis.neutral }}
                      </p>

                      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {{
                          formatNumber(
                            selectedFacultySentimentAnalysis.neutralPercentage,
                          )
                        }}%
                      </p>
                    </div>

                    <div
                      class="flex size-10 items-center justify-center rounded-2xl bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      <UIcon name="i-lucide-meh" class="size-5" />
                    </div>
                  </div>
                </article>

                <article
                  class="rounded-2xl border border-red-100 bg-red-50/70 p-4 dark:border-red-900/60 dark:bg-red-950/20"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <p
                        class="text-[10px] font-bold uppercase tracking-[0.14em] text-red-700 dark:text-red-400"
                      >
                        Negative
                      </p>

                      <p
                        class="mt-2 text-2xl font-black text-gray-950 dark:text-white"
                      >
                        {{ selectedFacultySentimentAnalysis.negative }}
                      </p>

                      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {{
                          formatNumber(
                            selectedFacultySentimentAnalysis.negativePercentage,
                          )
                        }}%
                      </p>
                    </div>

                    <div
                      class="flex size-10 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    >
                      <UIcon name="i-lucide-frown" class="size-5" />
                    </div>
                  </div>
                </article>

                <article
                  class="rounded-2xl border border-violet-100 bg-violet-50/70 p-4 dark:border-violet-900/60 dark:bg-violet-950/20"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <p
                        class="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-400"
                      >
                        Analysed Comments
                      </p>

                      <p
                        class="mt-2 text-2xl font-black text-gray-950 dark:text-white"
                      >
                        {{ selectedFacultySentimentAnalysis.analysedComments }}
                      </p>

                      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        of {{ selectedGroup.recordCount }} evaluations
                      </p>
                    </div>

                    <div
                      class="flex size-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                    >
                      <UIcon
                        name="i-lucide-message-square-text"
                        class="size-5"
                      />
                    </div>
                  </div>
                </article>
              </div>

              <div
                class="grid overflow-hidden rounded-2xl border border-gray-200 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] dark:border-gray-800"
              >
                <div class="p-5">
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-lucide-brain-circuit"
                      class="size-4 text-violet-600 dark:text-violet-400"
                    />

                    <h4 class="text-sm font-bold text-gray-900 dark:text-white">
                      Consolidated Interpretation
                    </h4>
                  </div>

                  <p
                    class="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300"
                  >
                    {{ selectedFacultySentimentAnalysis.summary }}
                  </p>

                  <div
                    v-if="selectedFacultySentimentAnalysis.keywords.length"
                    class="mt-4"
                  >
                    <p
                      class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400"
                    >
                      Common AI Keywords
                    </p>

                    <div class="mt-2 flex flex-wrap gap-2">
                      <UBadge
                        v-for="keyword in selectedFacultySentimentAnalysis.keywords"
                        :key="keyword"
                        color="neutral"
                        variant="subtle"
                      >
                        {{ keyword }}
                      </UBadge>
                    </div>
                  </div>
                </div>

                <div
                  class="border-t border-gray-200 bg-gray-50/70 p-5 lg:border-l lg:border-t-0 dark:border-gray-800 dark:bg-gray-950/30"
                >
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-lucide-lightbulb"
                      class="size-4 text-amber-600 dark:text-amber-400"
                    />

                    <h4 class="text-sm font-bold text-gray-900 dark:text-white">
                      Recommended Focus
                    </h4>
                  </div>

                  <ul
                    v-if="selectedFacultySentimentAnalysis.suggestions.length"
                    class="mt-3 space-y-3"
                  >
                    <li
                      v-for="(
                        suggestion, index
                      ) in selectedFacultySentimentAnalysis.suggestions"
                      :key="`${index}-${suggestion}`"
                      class="flex gap-2 text-sm leading-6 text-gray-600 dark:text-gray-300"
                    >
                      <span
                        class="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500"
                      />
                      <span>{{ suggestion }}</span>
                    </li>
                  </ul>

                  <p
                    v-else
                    class="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400"
                  >
                    No consolidated AI suggestions are available for the
                    selected faculty member.
                  </p>
                </div>
              </div>

              <div
                v-if="!selectedFacultySentimentAnalysis.analysedComments"
                class="rounded-2xl border border-dashed border-gray-300 px-5 py-8 text-center dark:border-gray-700"
              >
                <UIcon
                  name="i-lucide-message-square-off"
                  class="mx-auto size-8 text-gray-400"
                />

                <p
                  class="mt-3 text-sm font-semibold text-gray-900 dark:text-white"
                >
                  No comments available for sentiment analysis
                </p>

                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  The rating summary is available, but no written faculty
                  feedback or stored sentiment result was found.
                </p>
              </div>
            </div>
          </section>
        </div>

        <!-- =================================================
             CRITERIA TAB
        ================================================== -->
        <div v-show="activeTab === 'criteria'" class="space-y-5 print:block">
          <section
            class="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="border-b border-gray-200/80 bg-gradient-to-r from-gray-50 to-white px-5 py-4 dark:border-gray-800 dark:from-gray-950/60 dark:to-gray-900"
            >
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                Criteria Summary
              </h3>

              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Consolidated average and rating distribution for every Dean
                evaluation criterion.
              </p>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full min-w-[860px] text-sm">
                <thead
                  class="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40 dark:text-gray-400"
                >
                  <tr>
                    <th class="px-4 py-3 text-left">Criterion</th>
                    <th class="px-3 py-3 text-center">Responses</th>
                    <th class="px-3 py-3 text-center">Average</th>
                    <th
                      v-for="rating in ratingScaleDescending"
                      :key="`criterion-rating-head-${rating.score}`"
                      class="px-3 py-3 text-center"
                      :title="rating.label"
                    >
                      {{ rating.score }}
                    </th>
                    <th class="px-4 py-3 text-center">Rating</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr
                    v-for="criterion in selectedGroup.criteriaSummary"
                    :key="criterion.criteriaId"
                  >
                    <td
                      class="max-w-md px-4 py-3 text-gray-700 dark:text-gray-300"
                    >
                      {{ criterion.statement }}
                    </td>

                    <td class="px-3 py-3 text-center font-semibold">
                      {{ criterion.responseCount }}
                    </td>

                    <td
                      class="px-3 py-3 text-center font-bold text-violet-700 dark:text-violet-400"
                    >
                      {{ formatNumber(criterion.averageScore) }}
                    </td>

                    <td
                      v-for="rating in ratingScaleDescending"
                      :key="`${criterion.criteriaId}-${rating.score}`"
                      class="px-3 py-3 text-center"
                    >
                      {{ criterion.distribution[rating.score] || 0 }}
                    </td>

                    <td class="px-4 py-3 text-center">
                      <span
                        class="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
                        :class="ratingBadge(criterion.averageScore)"
                      >
                        {{ getRatingLabel(criterion.averageScore) }}
                      </span>
                    </td>
                  </tr>

                  <tr v-if="!selectedGroup.criteriaSummary.length">
                    <td
                      :colspan="4 + ratingScaleDescending.length"
                      class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No criterion responses are available.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <!-- =================================================
             RECORDS TAB
        ================================================== -->
        <div v-show="activeTab === 'records'" class="space-y-5 print:block">
          <section
            class="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="border-b border-gray-200/80 bg-gradient-to-r from-gray-50 to-white px-5 py-4 dark:border-gray-800 dark:from-gray-950/60 dark:to-gray-900"
            >
              <div
                class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                    Faculty Evaluation Records
                  </h3>

                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {{ filteredRecordRows.length }} record{{
                      filteredRecordRows.length === 1 ? "" : "s"
                    }}
                    found.
                  </p>
                </div>

                <div class="grid gap-2 sm:grid-cols-2">
                  <UInput
                    v-model="recordSearch"
                    icon="i-lucide-search"
                    placeholder="Search faculty or comment"
                  />

                  <USelect
                    v-model="recordRating"
                    :items="ratingOptions"
                    value-key="value"
                    label-key="label"
                  />
                </div>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full min-w-[980px] text-sm">
                <thead
                  class="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40 dark:text-gray-400"
                >
                  <tr>
                    <th class="px-4 py-3 text-left">Dean Evaluator</th>
                    <th class="px-4 py-3 text-left">Submitted</th>
                    <th class="px-4 py-3 text-center">Semester</th>
                    <th class="px-4 py-3 text-center">School Year</th>
                    <th class="px-4 py-3 text-center">Subject</th>
                    <th class="px-4 py-3 text-center">Average</th>
                    <th class="px-4 py-3 text-left">Comment</th>
                    <th class="px-4 py-3 text-center print:hidden">Action</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr
                    v-for="record in paginatedRecordRows"
                    :key="getEvaluationKey(record)"
                    class="transition hover:bg-gray-50 dark:hover:bg-gray-950/40"
                  >
                    <td class="px-4 py-3">
                      <p class="font-semibold text-gray-900 dark:text-white">
                        {{ getEvaluatorName(record) }}
                      </p>
                    </td>

                    <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {{ formatDate(getEvaluationDate(record)) }}
                    </td>

                    <td
                      class="px-4 py-3 text-center text-gray-600 dark:text-gray-400"
                    >
                      {{ getSemester(record) }}
                    </td>

                    <td
                      class="px-4 py-3 text-center text-gray-600 dark:text-gray-400"
                    >
                      {{ getSchoolYear(record) }}
                    </td>

                    <td
                      class="px-4 py-3 text-center text-gray-600 dark:text-gray-400"
                    >
                      {{ getSubjectName(record) }}
                    </td>

                    <td class="px-4 py-3 text-center">
                      <UBadge
                        :color="ratingColor(getRecordAverage(record))"
                        variant="subtle"
                      >
                        {{ formatNumber(getRecordAverage(record)) }}
                        / {{ ratingMaxScore ?? "—" }}
                      </UBadge>
                    </td>

                    <td
                      class="max-w-[300px] px-4 py-3 text-gray-600 dark:text-gray-400"
                    >
                      <p class="truncate" :title="getRecordComment(record)">
                        {{ getRecordComment(record) }}
                      </p>
                    </td>

                    <td class="px-4 py-3 text-center print:hidden">
                      <UButton
                        size="xs"
                        color="neutral"
                        variant="soft"
                        icon="i-lucide-eye"
                        @click="openEvaluationRecord(record)"
                      >
                        View
                      </UButton>
                    </td>
                  </tr>

                  <tr v-if="!paginatedRecordRows.length">
                    <td
                      colspan="8"
                      class="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      No evaluation records match the selected filters.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              class="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 print:hidden sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
            >
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Showing
                {{
                  filteredRecordRows.length
                    ? (recordPage - 1) * recordPageSize + 1
                    : 0
                }}–
                {{
                  Math.min(
                    recordPage * recordPageSize,
                    filteredRecordRows.length,
                  )
                }}
                of {{ filteredRecordRows.length }}
              </p>

              <div class="flex items-center gap-3">
                <USelect
                  v-model="recordPageSize"
                  :items="pageSizeOptions"
                  value-key="value"
                  label-key="label"
                  class="w-32"
                />

                <UPagination
                  v-model:page="recordPage"
                  :items-per-page="recordPageSize"
                  :total="filteredRecordRows.length"
                />
              </div>
            </div>
          </section>
        </div>

        <div class="flex justify-end print:hidden">
          <UButton color="neutral" variant="outline" @click="goBack">
            Close
          </UButton>
        </div>
      </div>
    </div>

    <!-- =====================================================
         RECORD DETAILS MODAL
    ====================================================== -->
    <UModal
      v-model:open="showEvaluationDialog"
      id="dean-faculty-evaluation-record-dialog"
      title="Faculty Evaluation Record Details"
      description="View the selected Dean evaluator's scores, comments, strengths, and areas for improvement."
      :ui="{ content: 'max-w-5xl' }"
    >
      <template #content>
        <div
          v-if="selectedEvaluation"
          class="max-h-[88vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900"
        >
          <div
            class="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800"
          >
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-wide text-violet-600"
              >
                Faculty Evaluation
              </p>

              <h3 class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                {{ getEvaluatorName(selectedEvaluation) }}
              </h3>

              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ getSubjectName(selectedEvaluation) }} ·
                {{ getSemester(selectedEvaluation) }} ·
                {{ getSchoolYear(selectedEvaluation) }} ·
                {{ formatDate(getEvaluationDate(selectedEvaluation)) }}
              </p>
            </div>

            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              square
              @click="showEvaluationDialog = false"
            />
          </div>

          <div class="space-y-4 p-5">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Total Score
                </p>

                <p class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {{ selectedEvaluation.total_score || 0 }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-xs text-gray-500 dark:text-gray-400">Average</p>

                <p
                  class="mt-1 text-lg font-bold text-violet-700 dark:text-violet-400"
                >
                  {{ formatNumber(getRecordAverage(selectedEvaluation)) }}
                  / {{ ratingMaxScore ?? "—" }}
                </p>
              </div>

              <div
                class="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-800 dark:bg-gray-950/40"
              >
                <p class="text-xs text-gray-500 dark:text-gray-400">Rating</p>

                <p class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {{ getRatingLabel(getRecordAverage(selectedEvaluation)) }}
                </p>
              </div>
            </div>

            <section
              class="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div
                class="border-b border-gray-200/80 bg-gradient-to-r from-gray-50 to-white px-5 py-4 dark:border-gray-800 dark:from-gray-950/60 dark:to-gray-900"
              >
                <h4 class="text-sm font-bold text-gray-900 dark:text-white">
                  Criteria Responses
                </h4>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead
                    class="bg-gray-50 text-xs uppercase text-gray-600 dark:bg-gray-950/40 dark:text-gray-400"
                  >
                    <tr>
                      <th class="px-4 py-3 text-left">Criterion</th>
                      <th class="px-4 py-3 text-center">Score</th>
                      <th class="px-4 py-3 text-center">Interpretation</th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr
                      v-for="item in formatResponses(
                        selectedEvaluation.responses,
                      )"
                      :key="item.criteria_id"
                    >
                      <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {{ item.statement }}
                      </td>

                      <td
                        class="px-4 py-3 text-center font-bold text-gray-900 dark:text-white"
                      >
                        {{ item.score }}
                        / {{ ratingMaxScore ?? "—" }}
                      </td>

                      <td class="px-4 py-3 text-center">
                        {{ getRatingLabel(item.score) }}
                      </td>
                    </tr>

                    <tr
                      v-if="
                        !formatResponses(selectedEvaluation.responses).length
                      "
                    >
                      <td
                        colspan="3"
                        class="px-4 py-8 text-center text-gray-500"
                      >
                        No criterion responses are available.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section
              class="rounded-2xl border border-gray-200 p-4 dark:border-gray-800"
            >
              <h4 class="text-sm font-bold text-gray-900 dark:text-white">
                Faculty Comment
              </h4>

              <p
                class="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                {{ getRecordComment(selectedEvaluation) }}
              </p>
            </section>

            <div class="grid gap-4 md:grid-cols-2">
              <section
                class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20"
              >
                <h4
                  class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"
                >
                  <UIcon name="i-lucide-thumbs-up" class="size-4" />
                  Strengths
                </h4>

                <p
                  class="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400"
                >
                  {{
                    selectedEvaluation.strengths ||
                    "No strengths were provided."
                  }}
                </p>
              </section>

              <section
                class="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/20"
              >
                <h4
                  class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"
                >
                  <UIcon name="i-lucide-lightbulb" class="size-4" />
                  Areas for Improvement
                </h4>

                <p
                  class="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-400"
                >
                  {{
                    selectedEvaluation.areas_for_improvement ||
                    "No areas for improvement were provided."
                  }}
                </p>
              </section>
            </div>
          </div>
        </div>
      </template>
    </UModal>

    <!-- =====================================================
         PDF PREVIEW MODAL
    ====================================================== -->
    <UModal
      v-model:open="showPdfPreview"
      id="dean-faculty-evaluation-pdf-preview-dialog"
      title="Dean–Faculty Evaluation PDF Preview"
      description="Preview the official Dean–Faculty evaluation report before downloading or printing the PDF."
      :ui="{ content: 'max-w-7xl' }"
    >
      <template #content>
        <div
          class="flex h-[90vh] flex-col overflow-hidden bg-white dark:bg-gray-950"
        >
          <div
            class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800"
          >
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                {{ pdfFileName }}
              </h3>

              <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Official Dean–Faculty Evaluation Report
              </p>
            </div>

            <div class="flex items-center gap-2">
              <UButton
                color="primary"
                icon="i-lucide-download"
                :disabled="!pdfPreviewBlob"
                @click="downloadExistingPdf"
              >
                Download PDF
              </UButton>

              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                square
                @click="closePdfPreview"
              />
            </div>
          </div>

          <div class="min-h-0 flex-1 bg-gray-100 p-3 dark:bg-gray-900">
            <iframe
              v-if="pdfPreviewUrl"
              :src="pdfPreviewUrl"
              title="Dean–Faculty Evaluation PDF Preview"
              class="h-full w-full rounded-xl border border-gray-300 bg-white dark:border-gray-700"
            />

            <div
              v-else
              class="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950"
            >
              <div class="text-center">
                <UIcon
                  name="i-lucide-loader-circle"
                  class="mx-auto size-8 animate-spin text-violet-600"
                />

                <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Preparing PDF preview...
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UModal>

    <!-- =====================================================
         NOT FOUND
    ====================================================== -->
    <div
      v-if="!pending && !loadError && !selectedGroup"
      class="rounded-[28px] border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900"
    >
      <UIcon
        name="i-lucide-user-round-x"
        class="mx-auto size-10 text-gray-400"
      />

      <h1 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
        Faculty summary not found
      </h1>

      <p class="mx-auto mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400">
        No Dean–Faculty evaluation records were found for this Dean or
        Coordinator.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const SNC_LOGO_DATA_URL =
  "data:image/jpeg;base64,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vjbSLogCcLn1Ncc8LWhvE644ilLaR0dLVKLVrGbGy4Q56c1ZE0THAkUn61g4tbo1Uk9mPNLSde9LSGFFFFABRRRQAUUUUAFFFFABRRRQAGkFLSd6AFooooAKKKKAEpaQDFBIHU0ALRURuYVzmVBj3qrNrFhApZ7hBj3qlGUtkS5Jbsvd6WuZuvHOj2xIMwP0NYF78UrKLIgXd6VvDCVpbRMpYqlHeR6LTHljjGXdV+prxa++Kd9LuEKlfSsK58Z6xfrzMy/jXbTyitLfQ46maUo7anutz4h020z5lwnHoa5q/wDiZplszLEdxFeKTX9zM582dyT71GsTOcojOTXbTyemvjdzkqZrN/CrHf6l8Ub6V2FumEPSuXv/ABRq19y9wwU9s1Da6HqV7hIrZhnvium0z4Z6ldMpuCUWuvlwmGXRHNzYnEPqcRPI0rje7Oxq1b6dd3LBILdjnvivYdP+GWn27K82HYV1lnodhZACK3QEdyK5qub0oX9mrm9LK6kvjdjxXTPhxquoOrSgohrvdH+GdhZlXuPnYdq70KFGAAB7UteVVzKvUvZ2PSpZfRh0uUrPSbKxUCCBF98Vdoorgcm3dnaklogooopDCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooACAeozVSfTLO5z5sCN+FW6Kak1sJxT3OWv/Aek3hLeUFJ9q5XUfhSjMXt5PpXqdFddPH16e0jmng6M94ngt98PNWtmJjUsBWHdeHdTtwTNbNge1fSpAI5ANQS2VtOpWSFGB9q7qec1F8cbnFPKYP4WfLzW8gOHhZce1JI7LgI7KRX0bc+EtKuQQ1uoz6CsW6+GulznKjbXZHN6ElaSscsssrRd4s8Wt9Wv7cArcvx05rQTxhrCOrJOxx713t58KVYnyX+lYVx8MdQtwWj5rdYnCVVa6Mnh8TT1syrbfEfV4GBkJYVq23xYuUkzNH8tc5deCNYtufKLA+1Ubjw5qcCgyWrflQ8NhamyQLEYmG9z0KH4tRtOA8fyd60x8U9OMirjg968ffSruBcvavg+1RCxmK/6hx74rJ5Xh5bFrMq8dz3tfH+jlQTMAT71LD450eaTZ54H4189m2lzj58ijyZlOQXHvWbyil3Zos0qH0h/wlOk5x9qX86G8U6Uo5uV/OvnIm4GMTP+dLvuSMGV/wA6z/seH8xf9qy/lPoweKtJP/Lyv50q+KdKZtouVz9a+cQ1yOkr/nSh7kHIlfP1o/seH8w/7Vl/KfRreKdKTrcr+dIPFWkn/l5X86+cy9yesr/nSbrnH+tf86P7Hh/ML+1Zfyn0ePE+lEZFyv50f8JPpW0t9pTj3r5wD3Sgjzn596dG90uQ0z4PvT/sen/MxPNZ9ke9y+PtGjcr5wJHvUcnxC0hIyRIC3pmvAzbymTf85oeCRpFZVcn0q1lFJatsn+1Kj0SPaT8UtODFQvIrKl+LaCYqsXy15h9jnznyHyfapBo95Iu5bV8fStf7Lw8dTL+0a7O6u/itdh90cfy1lXHxH1afcykqD0FYsPhnVLmPcLZsD2rTtvAmrXEYbyivtitFh8LDsQ6+Jn3M9/FGryElrlhu7ZqhLql9M5WS5cqfeu2tPhffzbWlOPaty1+FMIcGaTik8Tg6S0aH9XxVR6pnkb72JLMzVLBbyyYWOF2J74r3S1+HOlQLh1DfhWza+FtKtQNlupI9RWM83oxfuq5tHK6svidjwW28M6rdMAlswB74resvhvqtw43gqte4R2kEQASJBj2qbAHSuKpnNR/ArHVDKqa+J3PMrH4VW67WuHye9dRY+CdJsgP3IYj1FdLRXDUx1epvI7aeDow2iVoNPtbcDyoUXHtVnpRRXK23udCSWwUUUUhhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA1kRvvKD9RUclpbyjDwofqKKKabWwmk9ytcaNYXMex7dQPYVUPhXSihXyjz7j/CiitI1qkdpMzlQpyd3Ezn+H2iu5Ym5BPoy/8AxNMl+HGiSptL3QHqHX/4miitfr2I/nZl9SofyoqD4VaAP+W9/wD9/E/+Ipf+FV6D/wA97/8A7+J/8TRRV/2jiv52T9Qw38iD/hVeg/8APe//AO/if/E0f8Kr0H/nvf8A/fxP/iaKKP7RxX87D6hhv5EH/Cq9B/573/8A38T/AOJo/wCFV6D/AM97/wD7+J/8TRRR/aOK/nYfUMN/Ig/4VXoP/Pe//wC/if8AxNH/AAqrQc/8fF//AN/E/wDiKKKP7RxX87D6hhv5EW0+HWiIgUNdED1df/iafF8P9FhkDg3BI7Flx/6DRRUPG4h/bZawdBfZRo/8ItpZx+5PH0/wq5FpNjFGEW3TA9RRRWUq1SW8maRoU46pFhLWCMYSJAPYVIEVRgKB9BRRWbbe5oklsLRRRSGFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/9k=";

definePageMeta({
  middleware: ["auth", "role"],
  role: ["Admin", "HR"],
});

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();

const pending = ref(false);
const loadError = ref("");
const evaluations = ref<any[]>([]);
const evaluationType = ref<any>(null);

const activeTab = ref("overview");
const recordSearch = ref("");
const recordRating = ref("all");
const recordPage = ref(1);
const recordPageSize = ref(10);

const showEvaluationDialog = ref(false);
const selectedEvaluation = ref<any>(null);

const showPdfPreview = ref(false);
const pdfPreviewUrl = ref("");
const pdfPreviewBlob = ref<Blob | null>(null);
const isGeneratingPdf = ref(false);
const pdfAction = ref<"preview" | "download" | "">("");

const summaryTabs = [
  {
    label: "Overview",
    value: "overview",
    icon: "i-lucide-layout-dashboard",
  },
  {
    label: "Criteria",
    value: "criteria",
    icon: "i-lucide-list-checks",
  },
  {
    label: "Evaluation Records",
    value: "records",
    icon: "i-lucide-files",
  },
];

/* =========================================================
   DYNAMIC EVALUATION TYPE / RATING SCALE
========================================================= */

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

const ratingScale = computed(() => {
  if (evaluationResponseType.value !== "rating") {
    return [];
  }

  const labels = normalizedScaleLabels.value;

  const configuredScores = Object.keys(labels)
    .map((score) => Number(score))
    .filter((score) => Number.isFinite(score))
    .sort((a, b) => a - b);

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

    for (let score = minScore; score <= maxScore; score += 1) {
      rows.push({
        score,
        label: `Rating ${score}`,
      });
    }

    return rows;
  }

  return [];
});

const ratingScaleDescending = computed(() =>
  [...ratingScale.value].sort(
    (a, b) => Number(b.score) - Number(a.score),
  ),
);

const ratingScores = computed(() =>
  ratingScale.value.map((item) => Number(item.score)),
);

const ratingMinScore = computed(() => {
  if (!ratingScores.value.length) return null;

  return Math.min(...ratingScores.value);
});

const ratingMaxScore = computed(() => {
  if (!ratingScores.value.length) return null;

  return Math.max(...ratingScores.value);
});

const ratingOptions = computed(() => [
  {
    label: "All Ratings",
    value: "all",
  },
  ...ratingScaleDescending.value.map((item) => ({
    label: `${item.score} - ${item.label}`,
    value: String(item.score),
  })),
]);

const isConfiguredRatingScore = (value: any) => {
  const score = Number(value);

  return (
    Number.isFinite(score) &&
    ratingScores.value.includes(score)
  );
};

const createEmptyRatingDistribution = () => {
  const distribution: Record<number, number> = {};

  ratingScores.value.forEach((score) => {
    distribution[score] = 0;
  });

  return distribution;
};

const getNearestRating = (average: number) => {
  const avg = Number(average);

  if (
    !Number.isFinite(avg) ||
    avg <= 0 ||
    !ratingScale.value.length
  ) {
    return null;
  }

  return [...ratingScale.value].sort((a, b) => {
    const distanceA = Math.abs(Number(a.score) - avg);
    const distanceB = Math.abs(Number(b.score) - avg);

    if (distanceA === distanceB) {
      return Number(b.score) - Number(a.score);
    }

    return distanceA - distanceB;
  })[0] || null;
};

const getRatingPosition = (average: number) => {
  const nearest = getNearestRating(average);

  if (!nearest) {
    return 0;
  }

  if (ratingScale.value.length <= 1) {
    return 1;
  }

  const index = ratingScale.value.findIndex(
    (item) =>
      Number(item.score) === Number(nearest.score),
  );

  return index < 0
    ? 0
    : index / (ratingScale.value.length - 1);
};

const pageSizeOptions = [
  { label: "10 rows", value: 10 },
  { label: "20 rows", value: 20 },
  { label: "50 rows", value: 50 },
];

const facultyDocumentId = computed(() =>
  String(
    route.params.documentId ||
      route.params.teacherId ||
      route.params.facultyId ||
      Object.values(route.params)[0] ||
      "",
  ),
);

const hasValidFacultyId = computed(() => Boolean(facultyDocumentId.value));

const selectedSemester = computed(() => String(route.query.semester || "all"));

const selectedSchoolYear = computed(() =>
  String(route.query.schoolYear || "all"),
);

const getFacultyName = (evaluation: any) => {
  const teacher = evaluation?.teacher;
  const info = teacher?.user?.user_info || teacher?.user_info || teacher || {};

  const constructedName = [
    info?.first_name,
    info?.middle_name,
    info?.last_name,
    info?.suffix,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    teacher?.name ||
    teacher?.full_name ||
    teacher?.display_name ||
    constructedName ||
    teacher?.user?.name ||
    teacher?.user?.full_name ||
    teacher?.user?.username ||
    teacher?.user?.email ||
    "Unknown Faculty"
  );
};

const getFacultyDepartment = (evaluation: any) => {
  const teacher = evaluation?.teacher;

  return (
    teacher?.department?.name ||
    teacher?.department ||
    teacher?.user?.user_info?.department?.name ||
    teacher?.user?.user_info?.department ||
    teacher?.user_info?.department?.name ||
    teacher?.user_info?.department ||
    "Not specified"
  );
};

const getSubjectName = (evaluation: any) => {
  return (
    evaluation?.subject?.name || evaluation?.subject?.subject_name || "N/A"
  );
};

const getEvaluatorName = (evaluation: any) => {
  const user = evaluation?.evaluator_user;
  const info = user?.user_info || user || {};

  const constructedName = [
    info?.first_name,
    info?.middle_name,
    info?.last_name,
    info?.suffix,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    user?.name ||
    user?.full_name ||
    constructedName ||
    user?.username ||
    user?.email ||
    "Unknown Dean"
  );
};

const getSemester = (evaluation: any) => evaluation?.batch?.semester || "N/A";

const getSchoolYear = (evaluation: any) =>
  evaluation?.batch?.school_year || "N/A";

const getEvaluationDate = (evaluation: any) =>
  evaluation?.batch?.date || evaluation?.date || evaluation?.createdAt || null;

const getEvaluationKey = (evaluation: any) => {
  if (!evaluation) return "";

  return String(
    evaluation?.documentId ||
      evaluation?.id ||
      `${evaluation?.teacher?.id || ""}-${
        evaluation?.evaluator_user?.id || ""
      }-${evaluation?.createdAt || ""}`,
  );
};

const formatResponses = (responses: any) => {
  if (!responses) return [];

  if (Array.isArray(responses)) {
    return responses.map((item: any) => ({
      criteria_id:
        item.criteria_id || item.criteriaId || item.id || item.statement,

      statement:
        item.statement ||
        item.question ||
        `Criterion #${item.criteria_id || item.criteriaId || item.id}`,

      score: Number(item.score ?? item.value ?? item.rating ?? 0),
    }));
  }

  return Object.entries(responses).map(([criteriaId, score]) => ({
    criteria_id: criteriaId,
    statement: `Criterion #${criteriaId}`,
    score: Number(score || 0),
  }));
};

const getRecordAverage = (record: any) => {
  const stored = Number(record?.average_score);

  if (Number.isFinite(stored) && stored > 0) {
    return stored;
  }

  const responses = formatResponses(record?.responses);

  if (!responses.length) return 0;

  return (
    responses.reduce(
      (sum: number, item: any) => sum + Number(item.score || 0),
      0,
    ) / responses.length
  );
};

const getRecordComment = (record: any) => {
  return (
    String(
      record?.comment || record?.comments || record?.feedback || "",
    ).trim() || "No additional comment provided."
  );
};

const selectedGroup = computed(() => {
  if (!evaluations.value.length) return null;

  const facultyRecords = evaluations.value.filter((evaluation: any) => {
    const facultyId = String(
      evaluation?.teacher?.documentId || evaluation?.teacher?.id || "",
    );

    return (
      facultyId === facultyDocumentId.value ||
      getFacultyName(evaluation) === facultyDocumentId.value
    );
  });

  if (!facultyRecords.length) return null;

  const periodRecords = facultyRecords.filter((record: any) => {
    const matchesSemester =
      selectedSemester.value === "all" ||
      getSemester(record) === selectedSemester.value;

    const matchesSchoolYear =
      selectedSchoolYear.value === "all" ||
      getSchoolYear(record) === selectedSchoolYear.value;

    return matchesSemester && matchesSchoolYear;
  });

  const records = periodRecords.length ? periodRecords : facultyRecords;

  const evaluatorKeys = new Set(
    records.map(
      (record: any) =>
        record?.evaluator_user?.documentId ||
        record?.evaluator_user?.id ||
        getEvaluatorName(record),
    ),
  );

  const responseRows = records.flatMap((record: any) =>
    formatResponses(record.responses),
  );

  const scores = responseRows
    .map((item: any) => Number(item.score))
    .filter((score: number) =>
      isConfiguredRatingScore(score),
    );

  const ratingDistribution: Record<number, number> =
    createEmptyRatingDistribution();

  scores.forEach((score: number) => {
    if (ratingDistribution[score] === undefined) {
      ratingDistribution[score] = 0;
    }

    ratingDistribution[score] += 1;
  });

  const criteriaMap = new Map<string, any>();

  records.forEach((record: any) => {
    formatResponses(record.responses).forEach((item: any) => {
      const key = String(item.criteria_id);

      if (!criteriaMap.has(key)) {
        criteriaMap.set(key, {
          criteriaId: key,
          statement: item.statement,
          scores: [],
          distribution: createEmptyRatingDistribution(),
        });
      }

      const criterion = criteriaMap.get(key);

      if (isConfiguredRatingScore(item.score)) {
        criterion.scores.push(item.score);

        if (criterion.distribution[item.score] === undefined) {
          criterion.distribution[item.score] = 0;
        }

        criterion.distribution[item.score] += 1;
      }
    });
  });

  const criteriaSummary = Array.from(criteriaMap.values()).map(
    (criterion: any) => ({
      criteriaId: criterion.criteriaId,
      statement: criterion.statement,
      responseCount: criterion.scores.length,
      averageScore: criterion.scores.length
        ? criterion.scores.reduce(
            (sum: number, score: number) => sum + score,
            0,
          ) / criterion.scores.length
        : 0,
      distribution: criterion.distribution,
    }),
  );

  const expectedResponses = records.length * criteriaSummary.length;

  const completionRate = expectedResponses
    ? (scores.length / expectedResponses) * 100
    : 0;

  return {
    key: facultyDocumentId.value,
    name: getFacultyName(records[0]),
    department: getFacultyDepartment(records[0]),
    records: [...records].sort(
      (a: any, b: any) =>
        new Date(getEvaluationDate(b) || 0).getTime() -
        new Date(getEvaluationDate(a) || 0).getTime(),
    ),
    recordCount: records.length,
    evaluatorCount: evaluatorKeys.size,
    subjectCount: new Set(
      records
        .map((record: any) =>
          String(
            record?.subject?.documentId ||
              record?.subject?.id ||
              getSubjectName(record),
          ),
        )
        .filter(Boolean),
    ).size,
    subjects: Array.from(
      new Set(
        records
          .map((record: any) => getSubjectName(record))
          .filter((value: string) => value !== "N/A"),
      ),
    ),
    criteriaCount: criteriaSummary.length,
    criteriaSummary,
    ratingDistribution,
    totalRatingResponses: scores.length,
    averageScore: scores.length
      ? scores.reduce((sum: number, score: number) => sum + score, 0) /
        scores.length
      : 0,
    completionRate,
    semesters: Array.from(new Set(records.map(getSemester))).filter(
      (value) => value !== "N/A",
    ),
    schoolYears: Array.from(new Set(records.map(getSchoolYear))).filter(
      (value) => value !== "N/A",
    ),
  };
});

const currentSemesterLabel = computed(() => {
  if (selectedSemester.value && selectedSemester.value !== "all") {
    return selectedSemester.value;
  }

  return selectedGroup.value?.semesters?.join(", ") || "All Semesters";
});

const currentSchoolYearLabel = computed(() => {
  if (selectedSchoolYear.value && selectedSchoolYear.value !== "all") {
    return selectedSchoolYear.value;
  }

  return selectedGroup.value?.schoolYears?.join(", ") || "All School Years";
});

const generatedReportDate = computed(() =>
  new Intl.DateTimeFormat("en-PH", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date()),
);

const reportDocumentCode = "SNC-QA-DFE-001";

const reportSystemReference = computed(
  () => facultyDocumentId.value || "Not available",
);

const reportNumber = computed(() => {
  const deanPart = String(facultyDocumentId.value || "REPORT")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-8)
    .toUpperCase();

  return `SNC-DFE-${new Date().getFullYear()}-${deanPart || "REPORT"}`;
});

const pdfFileName = computed(() => {
  const deanName = String(selectedGroup.value?.name || "Dean")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const semester = String(currentSemesterLabel.value || "Semester")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const schoolYear = String(currentSchoolYearLabel.value || "School-Year")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return `${deanName}-${semester}-${schoolYear}-Dean-Faculty-Evaluation-Report.pdf`;
});

const consolidatedStrengths = computed(() =>
  Array.from(
    new Set(
      selectedGroup.value?.records
        ?.map((record: any) => String(record?.strengths || "").trim())
        .filter(Boolean) || [],
    ),
  ),
);

const consolidatedImprovements = computed(() =>
  Array.from(
    new Set(
      selectedGroup.value?.records
        ?.map((record: any) =>
          String(record?.areas_for_improvement || "").trim(),
        )
        .filter(Boolean) || [],
    ),
  ),
);

const consolidatedComments = computed(() =>
  Array.from(
    new Set(
      selectedGroup.value?.records
        ?.map((record: any) => {
          const value = String(
            record?.comment || record?.comments || record?.feedback || "",
          ).trim();

          return value;
        })
        .filter(Boolean) || [],
    ),
  ),
);

const normalizeSentiment = (value: any) => {
  const sentiment = String(value || "")
    .trim()
    .toLowerCase();

  if (sentiment.includes("positive") || sentiment === "good") {
    return "Positive";
  }

  if (sentiment.includes("negative") || sentiment === "bad") {
    return "Negative";
  }

  return "Neutral";
};

const formatKeywords = (value: any): string[] => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) =>
        typeof item === "string"
          ? item.split(",")
          : String(item?.keyword || item?.label || item?.value || "").split(
              ",",
            ),
      )
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "object") {
    return Object.values(value)
      .flatMap((item) => String(item || "").split(","))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const selectedFacultySentimentAnalysis = computed(() => {
  const records = selectedGroup.value?.records || [];

  const counts = {
    Positive: 0,
    Neutral: 0,
    Negative: 0,
  };

  const keywords: string[] = [];
  const suggestions: string[] = [];
  const summaries: string[] = [];
  let analysedComments = 0;

  records.forEach((record: any) => {
    const comment = String(
      record?.comment || record?.comments || record?.feedback || "",
    ).trim();

    const storedSentiment =
      record?.feedback_sentiment ||
      record?.sentiment ||
      record?.ai_sentiment ||
      "";

    if (comment || storedSentiment) {
      analysedComments += 1;

      const sentiment = normalizeSentiment(storedSentiment);

      counts[sentiment] += 1;
    }

    keywords.push(
      ...formatKeywords(
        record?.feedback_keywords ||
          record?.sentiment_keywords ||
          record?.ai_keywords,
      ),
    );

    const summary = String(
      record?.feedback_sentiment_summary ||
        record?.sentiment_summary ||
        record?.ai_summary ||
        "",
    ).trim();

    if (summary) {
      summaries.push(summary);
    }

    const suggestion = String(
      record?.feedback_sentiment_suggestion ||
        record?.sentiment_suggestion ||
        record?.ai_suggestion ||
        record?.areas_for_improvement ||
        record?.effectiveness ||
        record?.suggested_activities ||
        "",
    ).trim();

    if (suggestion) {
      suggestions.push(suggestion);
    }
  });

  const total = counts.Positive + counts.Neutral + counts.Negative;

  let overallSentiment = "Neutral";

  if (counts.Positive > counts.Neutral && counts.Positive > counts.Negative) {
    overallSentiment = "Positive";
  } else if (
    counts.Negative > counts.Positive &&
    counts.Negative > counts.Neutral
  ) {
    overallSentiment = "Negative";
  }

  const uniqueKeywords = Array.from(
    new Set(keywords.map((keyword) => keyword.toLowerCase())),
  ).slice(0, 12);

  const uniqueSuggestions = Array.from(new Set(suggestions)).slice(0, 6);

  const summary =
    summaries[0] ||
    (analysedComments
      ? `The available faculty feedback is predominantly ${overallSentiment.toLowerCase()}. This consolidated result is based on ${analysedComments} analysed evaluation comment${
          analysedComments === 1 ? "" : "s"
        }.`
      : "No written faculty feedback or stored AI sentiment result is available for this faculty member.");

  return {
    overallSentiment,
    positive: counts.Positive,
    neutral: counts.Neutral,
    negative: counts.Negative,
    analysedComments,
    positivePercentage: total ? (counts.Positive / total) * 100 : 0,
    neutralPercentage: total ? (counts.Neutral / total) * 100 : 0,
    negativePercentage: total ? (counts.Negative / total) * 100 : 0,
    keywords: uniqueKeywords,
    suggestions: uniqueSuggestions,
    summary,
  };
});

const sentimentColor = (sentiment: any) => {
  const value = normalizeSentiment(sentiment);

  if (value === "Positive") return "success";
  if (value === "Negative") return "error";

  return "neutral";
};

const summaryCards = computed(() => [
  {
    label: "Evaluations",
    value: selectedGroup.value?.recordCount || 0,
    caption: "Submitted records",
    icon: "i-lucide-files",
    labelClass: "text-blue-600 dark:text-blue-400",
    iconClass:
      "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
  },
  {
    label: "Dean Evaluators",
    value: selectedGroup.value?.evaluatorCount || 0,
    caption: "Unique respondents",
    icon: "i-lucide-users-round",
    labelClass: "text-violet-600 dark:text-violet-400",
    iconClass:
      "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300",
  },
  {
    label: "Criteria",
    value: selectedGroup.value?.criteriaCount || 0,
    caption: "Leadership indicators",
    icon: "i-lucide-list-checks",
    labelClass: "text-amber-600 dark:text-amber-400",
    iconClass:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
  },
  {
    label: "Subjects",
    value: selectedGroup.value?.subjectCount || 0,
    caption: "Subjects represented",
    icon: "i-lucide-book-open-check",
    labelClass: "text-emerald-600 dark:text-emerald-400",
    iconClass:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
]);

const filteredRecordRows = computed(() => {
  const query = recordSearch.value.trim().toLowerCase();

  return (selectedGroup.value?.records || []).filter((record: any) => {
    const average = getRecordAverage(record);

    const matchesSearch =
      !query ||
      [
        getEvaluatorName(record),
        getSemester(record),
        getSchoolYear(record),
        getRecordComment(record),
        record?.strengths,
        record?.areas_for_improvement,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

    const label = getRatingLabel(average).toLowerCase().replace(/\s+/g, "-");

    const matchesRating =
      recordRating.value === "all" || label === recordRating.value;

    return matchesSearch && matchesRating;
  });
});

const recordTotalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(filteredRecordRows.value.length / Number(recordPageSize.value)),
  ),
);

const paginatedRecordRows = computed(() => {
  const size = Number(recordPageSize.value);
  const start = (recordPage.value - 1) * size;

  return filteredRecordRows.value.slice(start, start + size);
});

const createInitials = (value: string) =>
  String(value || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const formatNumber = (value: any) => {
  const number = Number(value);

  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
};

const formatDate = (value: any) => {
  if (!value) return "N/A";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

const getRatingLabel = (average: any) => {
  const nearest = getNearestRating(Number(average));

  return nearest?.label || "N/A";
};

const ratingColor = (average: any) => {
  const position =
    getRatingPosition(Number(average));

  if (position >= 0.875) return "success";
  if (position >= 0.625) return "primary";
  if (position >= 0.375) return "info";
  if (position > 0) return "warning";

  return "error";
};

const ratingBadge = (average: any) => {
  const position =
    getRatingPosition(Number(average));

  if (position >= 0.875) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
  }

  if (position >= 0.625) {
    return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
  }

  if (position >= 0.375) {
    return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
  }

  if (position > 0) {
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
  }

  if (Number(average) > 0) {
    return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
  }

  return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
};

const getRatingPercentage = (count: number, total: number) =>
  total ? (count / total) * 100 : 0;

const openEvaluationRecord = (record: any) => {
  selectedEvaluation.value = record;
  showEvaluationDialog.value = true;
};

const revokePdfPreviewUrl = () => {
  if (pdfPreviewUrl.value && import.meta.client) {
    URL.revokeObjectURL(pdfPreviewUrl.value);
  }

  pdfPreviewUrl.value = "";
  pdfPreviewBlob.value = null;
};

const triggerPdfDownload = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = pdfFileName.value;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const createPdfBlob = async (): Promise<Blob> => {
  if (!import.meta.client) {
    throw new Error("PDF generation is only available in the browser.");
  }

  if (!selectedGroup.value) {
    throw new Error("No Dean–Faculty evaluation summary is available.");
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const group: any = selectedGroup.value;
  const sentiment: any = selectedFacultySentimentAnalysis.value;

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginLeft = 14;
  const marginRight = 14;
  const contentWidth = pageWidth - marginLeft - marginRight;

  const black: [number, number, number] = [17, 24, 39];
  const border: [number, number, number] = [156, 163, 175];
  const light: [number, number, number] = [245, 245, 245];
  const white: [number, number, number] = [255, 255, 255];
  const navy: [number, number, number] = [21, 45, 92];

  let y = 14;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 17) {
      doc.addPage();
      y = 14;
    }
  };

  const addSectionTitle = (title: string) => {
    ensureSpace(12);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...black);
    doc.text(title, marginLeft, y);

    doc.setDrawColor(...black);
    doc.setLineWidth(0.35);
    doc.line(marginLeft, y + 2, pageWidth - marginRight, y + 2);

    y += 7;
  };

  const addWrappedParagraph = (
    value: string,
    options: {
      fontSize?: number;
      bold?: boolean;
      indent?: number;
    } = {},
  ) => {
    const fontSize = options.fontSize ?? 9;
    const indent = options.indent ?? 0;
    const usableWidth = contentWidth - indent;

    doc.setFont("helvetica", options.bold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(...black);

    const lines = doc.splitTextToSize(String(value || ""), usableWidth);

    const lineHeight = fontSize * 0.46;
    const requiredHeight = lines.length * lineHeight + 2;

    ensureSpace(requiredHeight);

    doc.text(lines, marginLeft + indent, y, {
      maxWidth: usableWidth,
    });

    y += requiredHeight;
  };

  const addTable = (
    head: any[][],
    body: any[][],
    options: Record<string, any> = {},
  ) => {
    ensureSpace(18);

    autoTable(doc, {
      startY: y,
      head,
      body,
      margin: {
        left: marginLeft,
        right: marginRight,
        bottom: 16,
      },
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 8,
        textColor: black,
        lineColor: border,
        lineWidth: 0.2,
        cellPadding: 2.1,
        valign: "middle",
        fillColor: white,
        overflow: "linebreak",
      },
      headStyles: {
        fontStyle: "bold",
        textColor: black,
        fillColor: light,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: white,
      },
      tableLineColor: border,
      tableLineWidth: 0.2,
      ...options,
    });

    y = (doc as any).lastAutoTable.finalY + 6;
  };

  // Institutional header
  const headerCenter = pageWidth / 2;
  const logoSize = 19;
  const logoX = marginLeft + 1;
  const logoY = y + 1;

  doc.addImage(
    SNC_LOGO_DATA_URL,
    "JPEG",
    logoX,
    logoY,
    logoSize,
    logoSize,
    undefined,
    "FAST",
  );

  const reportBoxWidth = 31;
  const reportBoxX = pageWidth - marginRight - reportBoxWidth;
  const schoolTextLeft = marginLeft + logoSize + 8;
  const schoolTextRight = reportBoxX - 7;
  const schoolTextCenter =
    schoolTextLeft + (schoolTextRight - schoolTextLeft) / 2;

  doc.setTextColor(...black);
  // doc.setFont("helvetica", "normal");
  // doc.setFontSize(7.8);
  // doc.text(
  //   "REPUBLIC OF THE PHILIPPINES",
  //   schoolTextCenter,
  //   y + 4.2,
  //   { align: "center" },
  // );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.2);
  doc.text(
    "ST. NICOLAS COLLEGE OF BUSINESS AND TECHNOLOGY",
    schoolTextCenter,
    y + 10.2,
    {
      align: "center",
      maxWidth: schoolTextRight - schoolTextLeft,
    },
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "Faculty Evaluation and Quality Assurance Office",
    schoolTextCenter,
    y + 16.2,
    {
      align: "center",
      maxWidth: schoolTextRight - schoolTextLeft,
    },
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.text("OFFICIAL REPORT", reportBoxX + reportBoxWidth / 2, y + 6, {
    align: "center",
  });

  doc.setDrawColor(...black);
  doc.setLineWidth(0.35);
  doc.rect(reportBoxX, y + 8.2, reportBoxWidth, 8);

  doc.setFontSize(7.5);
  doc.text("CONFIDENTIAL", reportBoxX + reportBoxWidth / 2, y + 13.4, {
    align: "center",
  });

  y += 23;

  doc.setDrawColor(...navy);
  doc.setLineWidth(0.8);
  doc.line(marginLeft, y, pageWidth - marginRight, y);

  y += 5.5;

  // Document control
  addTable(
    [],
    [
      [
        "Document Code",
        reportDocumentCode,
        "Report Number",
        reportNumber.value,
      ],
      // [
      //   "Classification",
      //   "Confidential – Internal Use Only",
      //   "Revision",
      //   "Rev. 00",
      // ],
      [
        "Prepared Date",
        generatedReportDate.value,
        "Retention",
        "Per institutional records policy",
      ],
    ],
    {
      showHead: "never",
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 28 },
        1: { cellWidth: 58 },
        2: { fontStyle: "bold", cellWidth: 28 },
        3: { cellWidth: contentWidth - 114 },
      },
    },
  );

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("DEAN–FACULTY EVALUATION REPORT", headerCenter, y, {
    align: "center",
  });

  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "Consolidated faculty performance results, faculty feedback, and AI sentiment analysis",
    headerCenter,
    y,
    { align: "center" },
  );

  y += 8;

  addSectionTitle("I. REPORT INFORMATION");

  addTable(
    [],
    [
      [
        "Faculty Member",
        group.name || "N/A",
        "Department",
        group.department || "N/A",
      ],
      [
        "Semester",
        currentSemesterLabel.value,
        "School Year",
        currentSchoolYearLabel.value,
      ],
      [
        "Total Evaluations",
        String(group.recordCount || 0),
        "Dean Evaluators",
        String(group.evaluatorCount || 0),
      ],
      [
        "Evaluation Criteria",
        String(group.criteriaCount || 0),
        "Date Generated",
        generatedReportDate.value,
      ],
      [
        "Report Status",
        "For Administrative Review",
        "System Reference",
        reportSystemReference.value,
      ],
    ],
    {
      showHead: "never",
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 29 },
        1: { cellWidth: 58 },
        2: { fontStyle: "bold", cellWidth: 29 },
        3: { cellWidth: contentWidth - 116 },
      },
    },
  );

  addSectionTitle("II. EXECUTIVE SUMMARY");

  addTable(
    [["Overall Rating", "Completion Rate", "Rating Responses", "AI Sentiment"]],
    [
      [
        `${formatNumber(group.averageScore)} / ${formatNumber(ratingMaxScore.value)}\n${getRatingLabel(
          group.averageScore,
        )}`,
        `${formatNumber(group.completionRate)}%`,
        String(group.totalRatingResponses || 0),
        sentiment.overallSentiment || "Neutral",
      ],
    ],
    {
      styles: {
        font: "helvetica",
        fontSize: 9,
        textColor: black,
        lineColor: border,
        lineWidth: 0.2,
        cellPadding: 3,
        halign: "center",
        valign: "middle",
        fillColor: white,
      },
      headStyles: {
        fontStyle: "bold",
        textColor: black,
        fillColor: light,
        halign: "center",
      },
    },
  );

  addWrappedParagraph(
    `Based on ${group.recordCount || 0} submitted evaluation record${
      Number(group.recordCount || 0) === 1 ? "" : "s"
    }, the selected faculty member obtained an overall weighted average of ${formatNumber(
      group.averageScore,
    )}, interpreted as ${getRatingLabel(
      group.averageScore,
    )}. The report covers ${group.criteriaCount || 0} evaluation criteria for ${currentSemesterLabel.value}, School Year ${currentSchoolYearLabel.value}.`,
  );

  addSectionTitle("III. OVERALL RATING DISTRIBUTION");

  const ratingRows = ratingScaleDescending.value.map((rating) => {
    const frequency = Number(
      group.ratingDistribution?.[rating.score] || 0,
    );

    return [
      String(rating.score),
      rating.label,
      String(frequency),
      `${formatNumber(
        getRatingPercentage(
          frequency,
          Number(group.totalRatingResponses || 0),
        ),
      )}%`,
    ];
  });

  ratingRows.push([
    "",
    "TOTAL",
    String(group.totalRatingResponses || 0),
    Number(group.totalRatingResponses || 0) ? "100.00%" : "0.00%",
  ]);

  addTable(
    [["Rating", "Interpretation", "Frequency", "Percentage"]],
    ratingRows,
    {
      columnStyles: {
        0: { halign: "center", cellWidth: 24 },
        1: { halign: "left" },
        2: { halign: "center", cellWidth: 34 },
        3: { halign: "center", cellWidth: 34 },
      },
      didParseCell: (data: any) => {
        if (
          data.section === "body" &&
          data.row.index === ratingRows.length - 1
        ) {
          data.cell.styles.fontStyle = "bold";
        }
      },
    },
  );

  doc.addPage();
  y = 14;

  addSectionTitle("IV. CONSOLIDATED RESULTS BY CRITERION");

  const criteriaRows = (group.criteriaSummary || []).map(
    (criterion: any, index: number) => [
      String(index + 1),
      criterion.statement || "Unnamed criterion",
      String(criterion.responseCount || 0),
      formatNumber(criterion.averageScore),
      getRatingLabel(criterion.averageScore),
    ],
  );

  if (!criteriaRows.length) {
    criteriaRows.push(["", "No criterion results are available.", "", "", ""]);
  }

  addTable(
    [["No.", "Evaluation Criterion", "Responses", "Mean", "Interpretation"]],
    criteriaRows,
    {
      columnStyles: {
        0: { halign: "center", cellWidth: 13 },
        1: { halign: "left", cellWidth: 87 },
        2: { halign: "center", cellWidth: 25 },
        3: { halign: "center", cellWidth: 22 },
        4: { halign: "center" },
      },
    },
  );

  doc.addPage();
  y = 14;
  addSectionTitle("V. CONSOLIDATED AI SENTIMENT ANALYSIS");

  addTable(
    [["Sentiment", "Frequency", "Percentage"]],
    [
      [
        "Positive",
        String(sentiment.positive || 0),
        `${formatNumber(sentiment.positivePercentage)}%`,
      ],
      [
        "Neutral",
        String(sentiment.neutral || 0),
        `${formatNumber(sentiment.neutralPercentage)}%`,
      ],
      [
        "Negative",
        String(sentiment.negative || 0),
        `${formatNumber(sentiment.negativePercentage)}%`,
      ],
    ],
    {
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "center", cellWidth: 42 },
        2: { halign: "center", cellWidth: 42 },
      },
    },
  );

  addWrappedParagraph("Consolidated Interpretation", { bold: true });

  addWrappedParagraph(
    sentiment.summary || "No consolidated AI sentiment summary is available.",
  );

  if (sentiment.keywords?.length) {
    addWrappedParagraph("Common Keywords", {
      bold: true,
    });

    addWrappedParagraph(sentiment.keywords.join(", "));
  }

  if (sentiment.suggestions?.length) {
    addWrappedParagraph("Recommended Areas for Attention", { bold: true });

    sentiment.suggestions.forEach((suggestion: string, index: number) => {
      addWrappedParagraph(`${index + 1}. ${suggestion}`, { indent: 3 });
    });
  }

  ensureSpace(65);

  addSectionTitle("VI. CERTIFICATION AND SIGN-OFF");

  addWrappedParagraph(
    "This report was generated from the official Dean–Faculty Evaluation System and reflects the records available for the stated academic period. It is intended solely for authorised institutional quality assurance, faculty development, academic review, and related administrative purposes.",
  );

  doc.setDrawColor(...border);
  doc.setLineWidth(0.2);
  doc.rect(marginLeft, y, contentWidth, 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Confidentiality Notice:", marginLeft + 3, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  const noticeLines = doc.splitTextToSize(
    "Faculty evaluation records and written comments must be handled in accordance with institutional privacy, records management, and data protection policies.",
    contentWidth - 38,
  );

  doc.text(noticeLines, marginLeft + 35, y + 5);

  y += 28;
  ensureSpace(36);

  const signatureWidth = (contentWidth - 20) / 3;

  const signatureLabels = [
    ["Prepared by", "Evaluation System Administrator"],
    ["Reviewed by", "Academic Administrator"],
    ["Approved / Noted by", "Executive Administrator"],
  ];

  signatureLabels.forEach(([label, role], index) => {
    const x = marginLeft + index * (signatureWidth + 10);

    doc.setDrawColor(...black);
    doc.line(x, y + 15, x + signatureWidth, y + 15);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(label, x + signatureWidth / 2, y + 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(role, x + signatureWidth / 2, y + 24, { align: "center" });

    doc.text("Date: __________________", x + signatureWidth / 2, y + 30, {
      align: "center",
    });
  });

  const pageCount = doc.getNumberOfPages();

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);

    doc.setDrawColor(...border);
    doc.setLineWidth(0.2);
    doc.line(
      marginLeft,
      pageHeight - 10,
      pageWidth - marginRight,
      pageHeight - 10,
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...black);

    doc.text(
      `${reportDocumentCode} · ${reportNumber.value} · Confidential`,
      marginLeft,
      pageHeight - 6,
    );

    doc.text(
      `Page ${page} of ${pageCount}`,
      pageWidth - marginRight,
      pageHeight - 6,
      { align: "right" },
    );
  }

  return doc.output("blob");
};

const previewPdfReport = async () => {
  if (isGeneratingPdf.value) return;

  isGeneratingPdf.value = true;
  pdfAction.value = "preview";
  showPdfPreview.value = true;
  revokePdfPreviewUrl();

  try {
    const blob = await createPdfBlob();

    pdfPreviewBlob.value = blob;
    pdfPreviewUrl.value = URL.createObjectURL(blob);
  } catch (error: any) {
    showPdfPreview.value = false;

    console.error("Dean–Faculty PDF preview generation error:", error);

    loadError.value =
      error?.message || "The Dean–Faculty PDF could not be generated.";
  } finally {
    isGeneratingPdf.value = false;
    pdfAction.value = "";
  }
};

const downloadPdfReport = async () => {
  if (isGeneratingPdf.value) return;

  isGeneratingPdf.value = true;
  pdfAction.value = "download";

  try {
    const blob = await createPdfBlob();
    triggerPdfDownload(blob);
  } catch (error: any) {
    console.error("Dean–Faculty PDF download generation error:", error);

    loadError.value =
      error?.message || "The Dean–Faculty PDF could not be generated.";
  } finally {
    isGeneratingPdf.value = false;
    pdfAction.value = "";
  }
};

const downloadExistingPdf = () => {
  if (!pdfPreviewBlob.value) return;

  triggerPdfDownload(pdfPreviewBlob.value);
};

const closePdfPreview = () => {
  showPdfPreview.value = false;
  revokePdfPreviewUrl();
};

const getEvaluationType = async () => {
  const response: any = await $api("/evaluation-types", {
    query: {
      "filters[code][$eq]": "dean-faculty",
      "pagination[pageSize]": 1,
    },
  });

  evaluationType.value = response?.data?.[0] || null;

  if (!evaluationType.value) {
    throw new Error(
      "Dean-Faculty evaluation type is not configured.",
    );
  }

  if (evaluationResponseType.value !== "rating") {
    throw new Error(
      "Dean-Faculty must use a Rating Scale response type.",
    );
  }

  if (!ratingScale.value.length) {
    throw new Error(
      "The Dean-Faculty evaluation type has no valid rating scale configured.",
    );
  }
};

const getResults = async () => {
  pending.value = true;
  loadError.value = "";

  try {
    if (!evaluationType.value) {
      await getEvaluationType();
    }

    if (
      evaluationResponseType.value !== "rating" ||
      !ratingScale.value.length
    ) {
      throw new Error(
        "The Dean-Faculty rating scale is not configured correctly.",
      );
    }

    const response: any = await $api("/evaluations", {
      query: {
        "filters[batch][evaluation_type][code][$eq]": "dean-faculty",

        "populate[teacher][populate][department]": true,
        "populate[subject]": true,
        "populate[evaluator_user][populate][0]": "user_info",
        "populate[batch][populate][0]": "evaluation_type",

        "sort[0]": "createdAt:desc",
        "pagination[pageSize]": 10000,
      },
    });

    evaluations.value = response?.data || [];

    if (!selectedGroup.value) {
      loadError.value =
        "No Dean–Faculty evaluation summary was found for the selected faculty member.";
    }
  } catch (error: any) {
    evaluations.value = [];

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Failed to load the Dean–Faculty evaluation summary.";
  } finally {
    pending.value = false;
  }
};

const goBack = () => {
  router.push("/admin/evaluation/dean-faculty");
};

const printReport = async () => {
  await nextTick();

  if (import.meta.client) {
    window.print();
  }
};

watch([recordSearch, recordRating, recordPageSize], () => {
  recordPage.value = 1;
});

watch(recordTotalPages, (total) => {
  if (recordPage.value > total) {
    recordPage.value = total;
  }
});

onBeforeUnmount(() => {
  revokePdfPreviewUrl();
});

onMounted(async () => {
  try {
    await getEvaluationType();
    await getResults();
  } catch (error: any) {
    console.error(
      "Dean-Faculty summary initialization error:",
      error,
    );

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Failed to initialize the Dean – Faculty evaluation summary.";
  }
});
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}

@media print {
  @page {
    size: A4 portrait;
    margin: 12mm;
  }

  html,
  body {
    background: #ffffff !important;
  }

  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .print\:hidden {
    display: none !important;
  }

  .print\:block {
    display: block !important;
  }

  main,
  [class*="overflow-y-auto"],
  [class*="overflow-auto"] {
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
  }

  section,
  article,
  table,
  tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  thead {
    display: table-header-group;
  }

  [class*="shadow-"] {
    box-shadow: none !important;
  }
}
</style>
