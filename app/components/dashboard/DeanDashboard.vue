<template>
  <div class="space-y-7">
    <!-- =========================================================
      DEAN WELCOME BANNER
    ========================================================== -->
    <section
      class="relative overflow-hidden rounded-3xl border border-primary-500/20 bg-gradient-to-br from-primary-700 via-primary-600 to-emerald-600 p-6 text-white shadow-lg shadow-primary-900/10 sm:p-8"
    >
      <div
        class="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-white/10 blur-3xl"
      />

      <div
        class="pointer-events-none absolute -bottom-28 left-1/3 size-64 rounded-full bg-emerald-300/20 blur-3xl"
      />

      <div
        class="pointer-events-none absolute inset-0 opacity-[0.05]"
        :style="{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }"
      />

      <div
        class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="max-w-3xl">
          <div
            class="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur"
          >
            <UIcon name="i-lucide-building-2" class="size-4" />

            Department Performance Overview
          </div>

          <h1 class="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Welcome back, {{ deanDisplayName }}
          </h1>

          <p
            class="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base"
          >
            Monitor faculty performance, departmental evaluation results,
            student feedback, and section-level insights.
          </p>

          <div
            class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/75"
          >
            <span class="inline-flex items-center gap-1.5">
              <UIcon name="i-lucide-calendar-days" class="size-4" />

              {{ currentDate }}
            </span>

            <span class="hidden size-1 rounded-full bg-white/40 sm:block" />

            <span class="inline-flex items-center gap-1.5">
              <UIcon name="i-lucide-users-round" class="size-4" />

              {{ totalDepartmentFaculty }}
              faculty member{{ totalDepartmentFaculty === 1 ? "" : "s" }}
            </span>

            <span class="hidden size-1 rounded-full bg-white/40 sm:block" />

            <span class="inline-flex items-center gap-1.5">
              <span class="relative flex size-2">
                <span
                  class="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-75"
                />

                <span
                  class="relative inline-flex size-2 rounded-full bg-emerald-300"
                />
              </span>

              Department data available
            </span>
          </div>
        </div>

        <UButton
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="solid"
          size="lg"
          class="w-fit bg-white text-primary-700 shadow-sm hover:bg-white/90 dark:bg-white dark:text-primary-700"
          :loading="loading"
          :disabled="loading"
          @click="loadDashboard"
        >
          Refresh Data
        </UButton>
      </div>
    </section>

    <!-- =========================================================
      LOADING STATE
    ========================================================== -->
    <template v-if="loading">
      <section>
        <div class="mb-4">
          <USkeleton class="h-5 w-40" />
          <USkeleton class="mt-2 h-4 w-72" />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <UCard
            v-for="item in 5"
            :key="item"
            :ui="{
              root: 'rounded-2xl border-gray-200 dark:border-gray-800',
              body: 'p-5',
            }"
          >
            <div class="flex items-start justify-between">
              <USkeleton class="size-11 rounded-xl" />
              <USkeleton class="h-5 w-16 rounded-full" />
            </div>

            <USkeleton class="mt-5 h-4 w-28" />
            <USkeleton class="mt-3 h-9 w-20" />
            <USkeleton class="mt-3 h-3 w-40" />
          </UCard>
        </div>
      </section>

      <UCard
        :ui="{
          root: 'rounded-3xl border-gray-200 dark:border-gray-800',
          body: 'p-6',
        }"
      >
        <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            <USkeleton class="h-12 w-12 rounded-2xl" />
            <USkeleton class="mt-6 h-4 w-40" />
            <USkeleton class="mt-3 h-12 w-24" />
            <USkeleton class="mt-4 h-4 w-72" />
            <USkeleton class="mt-6 h-20 w-full rounded-2xl" />
          </div>

          <div class="space-y-5">
            <USkeleton class="h-5 w-48" />

            <USkeleton
              v-for="row in 3"
              :key="row"
              class="h-16 w-full rounded-xl"
            />
          </div>
        </div>
      </UCard>

      <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <UCard
          v-for="item in 2"
          :key="item"
          :ui="{
            root: 'rounded-2xl border-gray-200 dark:border-gray-800',
            body: 'p-5',
          }"
        >
          <USkeleton class="h-5 w-44" />

          <div class="mt-6 space-y-4">
            <USkeleton
              v-for="row in 5"
              :key="row"
              class="h-14 w-full rounded-xl"
            />
          </div>
        </UCard>
      </div>
    </template>

    <template v-else>
      <!-- =========================================================
        DEAN PROFILE ERROR
      ========================================================== -->
      <UCard
        v-if="!deanRecord"
        :ui="{
          root: 'rounded-3xl border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20',
          body: 'p-8',
        }"
      >
        <div class="text-center">
          <div
            class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          >
            <UIcon name="i-lucide-user-round-x" class="size-7" />
          </div>

          <h2 class="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
            Dean profile not found
          </h2>

          <p
            class="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400"
          >
            Your account is not currently connected to a teacher record with the
            Dean role. Please contact the system administrator.
          </p>
        </div>
      </UCard>

      <template v-else>
        <!-- =========================================================
          DEPARTMENT OVERVIEW
        ========================================================== -->
        <section>
          <div
            class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400"
              >
                <UIcon name="i-lucide-chart-no-axes-combined" class="size-5" />
              </div>

              <div>
                <h2
                  class="text-base font-semibold text-gray-900 dark:text-white"
                >
                  Department Overview
                </h2>

                <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  Summary of faculty and evaluation activity.
                </p>
              </div>
            </div>

            <div
              class="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
            >
              <UIcon name="i-lucide-clock-3" class="size-3.5" />

              Updated {{ lastUpdated }}
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <article
              v-for="stat in departmentStats"
              :key="stat.label"
              class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:shadow-black/20"
            >
              <div
                class="absolute inset-x-0 top-0 h-1"
                :class="stat.accentClass"
              />

              <div
                class="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-[0.08] transition-transform duration-300 group-hover:scale-125"
                :class="stat.decoration"
              />

              <div class="relative p-5">
                <div class="flex items-start justify-between gap-4">
                  <div
                    class="flex size-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                    :class="stat.iconClass"
                  >
                    <UIcon :name="stat.icon" class="size-5" />
                  </div>

                  <UBadge color="neutral" variant="subtle" size="sm">
                    {{ stat.badge }}
                  </UBadge>
                </div>

                <p
                  class="mt-5 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {{ stat.label }}
                </p>

                <div class="mt-1 flex items-end gap-2">
                  <p
                    class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
                  >
                    {{ stat.value }}
                  </p>

                  <span
                    v-if="stat.suffix"
                    class="mb-1 text-xs font-medium text-gray-400"
                  >
                    {{ stat.suffix }}
                  </span>
                </div>

                <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  {{ stat.description }}
                </p>

                <div
                  class="mt-4 border-t border-gray-100 pt-3 dark:border-gray-800"
                >
                  <div class="flex items-center justify-between gap-2">
                    <span class="truncate text-xs text-gray-400">
                      {{ stat.footerLabel }}
                    </span>

                    <span
                      class="inline-flex shrink-0 items-center gap-1 text-xs font-semibold"
                      :class="stat.footerClass"
                    >
                      <UIcon :name="stat.footerIcon" class="size-3.5" />

                      {{ stat.footerValue }}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <!-- =========================================================
          AI SENTIMENT OVERVIEW
        ========================================================== -->
        <section>
          <UCard
            :ui="{
              root: 'overflow-hidden rounded-3xl border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900',
              body: 'p-0',
            }"
          >
            <div class="grid grid-cols-1 xl:grid-cols-[0.85fr_1.15fr]">
              <!-- AI SCORE -->
              <div
                class="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 p-6 text-white dark:border-gray-800 sm:p-7 xl:border-b-0 xl:border-r"
              >
                <div
                  class="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary-500/20 blur-3xl"
                />

                <div
                  class="pointer-events-none absolute -bottom-20 -left-16 size-52 rounded-full bg-emerald-500/10 blur-3xl"
                />

                <div class="relative">
                  <div class="flex items-center justify-between gap-4">
                    <div
                      class="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur"
                    >
                      <UIcon name="i-lucide-brain-circuit" class="size-6" />
                    </div>

                    <span
                      class="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300"
                    >
                      <UIcon name="i-lucide-sparkles" class="size-3.5" />

                      AI Powered
                    </span>
                  </div>

                  <p class="mt-7 text-sm font-medium text-white/60">
                    Department Sentiment Score
                  </p>

                  <div class="mt-2 flex flex-wrap items-end gap-3">
                    <p class="text-5xl font-bold tracking-tight sm:text-6xl">
                      {{ averageSentimentScore }}
                    </p>

                    <span class="mb-1 text-sm text-white/50">
                      from -1 to +1
                    </span>
                  </div>

                  <div class="mt-4">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                      :class="overallSentimentClass"
                    >
                      <UIcon :name="overallSentimentIcon" class="size-3.5" />

                      {{ overallSentimentLabel }}
                    </span>
                  </div>

                  <p class="mt-4 text-sm leading-6 text-white/65">
                    Based on
                    <strong class="font-semibold text-white">
                      {{ analyzedFeedbackCount }}
                    </strong>
                    analysed student comment{{
                      analyzedFeedbackCount === 1 ? "" : "s"
                    }}
                    for faculty in your department.
                  </p>

                  <div
                    class="mt-7 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
                  >
                    <div
                      class="flex items-center justify-between text-[11px] font-medium"
                    >
                      <span class="text-red-300"> Negative </span>

                      <span class="text-white/60"> Neutral </span>

                      <span class="text-emerald-300"> Positive </span>
                    </div>

                    <div
                      class="relative mt-3 h-2.5 rounded-full bg-gradient-to-r from-red-500 via-gray-400 to-emerald-500"
                    >
                      <span
                        class="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-950 shadow-lg transition-all duration-700"
                        :style="{
                          left: `${sentimentScorePercentage}%`,
                        }"
                      />
                    </div>

                    <div
                      class="mt-2 flex justify-between text-[10px] text-white/40"
                    >
                      <span>-1.00</span>
                      <span>0.00</span>
                      <span>+1.00</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SENTIMENT DISTRIBUTION -->
              <div class="p-6 sm:p-7">
                <div
                  class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <h2
                      class="text-base font-semibold text-gray-900 dark:text-white"
                    >
                      Student Feedback Sentiment
                    </h2>

                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Distribution of faculty comments in your department.
                    </p>
                  </div>

                  <div
                    class="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  >
                    {{ analyzedFeedbackCount }} comments
                  </div>
                </div>

                <div v-if="analyzedFeedbackCount" class="mt-7 space-y-6">
                  <div
                    v-for="sentiment in sentimentDistribution"
                    :key="sentiment.label"
                  >
                    <div class="mb-2.5 flex items-center justify-between gap-4">
                      <div class="flex min-w-0 items-center gap-3">
                        <div
                          class="flex size-10 shrink-0 items-center justify-center rounded-xl"
                          :class="sentiment.iconClass"
                        >
                          <UIcon :name="sentiment.icon" class="size-5" />
                        </div>

                        <div class="min-w-0">
                          <p
                            class="text-sm font-semibold text-gray-800 dark:text-gray-200"
                          >
                            {{ sentiment.label }}
                          </p>

                          <p class="truncate text-xs text-gray-400">
                            {{ sentiment.description }}
                          </p>
                        </div>
                      </div>

                      <div class="shrink-0 text-right">
                        <p
                          class="text-base font-bold text-gray-900 dark:text-white"
                        >
                          {{ sentiment.count }}
                        </p>

                        <p class="text-xs text-gray-400">
                          {{ sentiment.percentage }}%
                        </p>
                      </div>
                    </div>

                    <div
                      class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
                    >
                      <div
                        class="h-full rounded-full transition-all duration-700"
                        :class="sentiment.progressClass"
                        :style="{
                          width: `${sentiment.percentage}%`,
                        }"
                      />
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  class="flex min-h-64 flex-col items-center justify-center text-center"
                >
                  <div
                    class="flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
                  >
                    <UIcon name="i-lucide-message-square-off" class="size-6" />
                  </div>

                  <p
                    class="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    No analysed comments yet
                  </p>

                  <p class="mt-1 max-w-xs text-xs leading-5 text-gray-400">
                    Sentiment insights will appear after student feedback is
                    processed.
                  </p>
                </div>
              </div>
            </div>
          </UCard>
        </section>

        <!-- =========================================================
          TOP FACULTY AND SECTION PERFORMANCE
        ========================================================== -->
        <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <!-- TOP FACULTY -->
          <UCard
            :ui="{
              root: 'overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900',
              header: 'border-b border-gray-200 px-5 py-4 dark:border-gray-800',
              body: 'p-0',
            }"
          >
            <template #header>
              <div class="flex items-center justify-between gap-4">
                <div class="flex min-w-0 items-center gap-3">
                  <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                  >
                    <UIcon name="i-lucide-trophy" class="size-5" />
                  </div>

                  <div class="min-w-0">
                    <h3
                      class="truncate font-semibold text-gray-900 dark:text-white"
                    >
                      Top Department Faculty
                    </h3>

                    <p
                      class="truncate text-xs text-gray-500 dark:text-gray-400"
                    >
                      Ranked by average student evaluation score
                    </p>
                  </div>
                </div>

                <UBadge color="warning" variant="subtle"> Top 5 </UBadge>
              </div>
            </template>

            <div
              v-if="topFaculty.length"
              class="divide-y divide-gray-100 dark:divide-gray-800"
            >
              <div
                v-for="(faculty, index) in topFaculty"
                :key="faculty.id"
                class="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
              >
                <div
                  class="flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                  :class="rankingClass(index)"
                >
                  {{ index + 1 }}
                </div>

                <UAvatar
                  :alt="faculty.name"
                  :text="getInitials(faculty.name)"
                  size="md"
                />

                <div class="min-w-0 flex-1">
                  <p
                    class="truncate text-sm font-semibold text-gray-800 dark:text-gray-200"
                  >
                    {{ faculty.name }}
                  </p>

                  <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {{ faculty.count }}
                    evaluation{{ faculty.count === 1 ? "" : "s" }}
                  </p>
                </div>

                <div class="shrink-0 text-right">
                  <p class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ faculty.average.toFixed(2) }}
                  </p>

                  <div class="mt-1 flex items-center justify-end gap-0.5">
                    <UIcon
                      v-for="star in maximumRating"
                      :key="star"
                      name="i-lucide-star"
                      class="size-3"
                      :class="
                        star <= Math.round(faculty.average)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-200 dark:text-gray-700'
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="px-5 py-14 text-center">
              <div
                class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
              >
                <UIcon name="i-lucide-chart-no-axes-column" class="size-6" />
              </div>

              <p
                class="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                No faculty rankings yet
              </p>

              <p class="mt-1 text-xs text-gray-400">
                Rankings will appear after faculty receive evaluations.
              </p>
            </div>
          </UCard>

          <!-- SECTION SUMMARY -->
          <UCard
            :ui="{
              root: 'overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900',
              header: 'border-b border-gray-200 px-5 py-4 dark:border-gray-800',
              body: 'p-0',
            }"
          >
            <template #header>
              <div class="flex items-center gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                >
                  <UIcon name="i-lucide-chart-bar-big" class="size-5" />
                </div>

                <div class="min-w-0">
                  <h3
                    class="truncate font-semibold text-gray-900 dark:text-white"
                  >
                    Section Performance
                  </h3>

                  <p class="truncate text-xs text-gray-500 dark:text-gray-400">
                    Department average by evaluation section
                  </p>
                </div>
              </div>
            </template>

            <div
              v-if="sectionSummary.length"
              class="divide-y divide-gray-100 dark:divide-gray-800"
            >
              <div
                v-for="section in sectionSummary"
                :key="section.section"
                class="px-5 py-4"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="min-w-0">
                    <p
                      class="truncate text-sm font-medium text-gray-800 dark:text-gray-200"
                    >
                      {{ section.section }}
                    </p>

                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {{ section.items }}
                      response{{ section.items === 1 ? "" : "s" }}
                    </p>
                  </div>

                  <UBadge :color="scoreColor(section.average)" variant="subtle">
                    {{ section.average.toFixed(2) }}
                  </UBadge>
                </div>

                <div
                  class="mt-3 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
                >
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="scoreProgressClass(section.average)"
                    :style="{
                      width: `${scorePercentage(section.average)}%`,
                    }"
                  />
                </div>

                <div
                  class="mt-1.5 flex justify-between text-[10px] text-gray-400"
                >
                  <span>0</span>
                  <span>{{ maximumRating }}</span>
                </div>
              </div>
            </div>

            <div v-else class="px-5 py-14 text-center">
              <div
                class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
              >
                <UIcon name="i-lucide-list-checks" class="size-6" />
              </div>

              <p
                class="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                No section data available
              </p>

              <p class="mt-1 text-xs text-gray-400">
                Section scores will appear after evaluations are recorded.
              </p>
            </div>
          </UCard>
        </div>

        <!-- =========================================================
          RECENT ACTIVITY
        ========================================================== -->
        <UCard
          :ui="{
            root: 'overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900',
            header: 'border-b border-gray-200 px-5 py-4 dark:border-gray-800',
            body: 'p-0',
          }"
        >
          <template #header>
            <div
              class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400"
                >
                  <UIcon name="i-lucide-history" class="size-5" />
                </div>

                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Recent Department Evaluations
                  </h3>

                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Latest evaluation records involving your department
                  </p>
                </div>
              </div>

              <UBadge color="neutral" variant="subtle">
                Latest {{ recentEvaluations.length }}
              </UBadge>
            </div>
          </template>

          <div v-if="recentEvaluations.length" class="overflow-x-auto">
            <table class="w-full min-w-[900px] text-sm">
              <thead
                class="border-b border-gray-200 bg-gray-50/80 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
              >
                <tr>
                  <th class="px-5 py-3 text-left font-semibold">
                    Evaluation Target
                  </th>

                  <th class="px-5 py-3 text-left font-semibold">Type</th>

                  <th class="px-5 py-3 text-left font-semibold">Subject</th>

                  <th class="px-5 py-3 text-center font-semibold">Average</th>

                  <th class="px-5 py-3 text-center font-semibold">Sentiment</th>

                  <th class="px-5 py-3 text-right font-semibold">
                    Date Submitted
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr
                  v-for="evaluation in recentEvaluations"
                  :key="evaluation.id"
                  class="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
                >
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <UAvatar
                        :alt="evaluation.target"
                        :text="getInitials(evaluation.target)"
                        size="sm"
                      />

                      <div class="min-w-0">
                        <p
                          class="truncate font-medium text-gray-800 dark:text-gray-200"
                        >
                          {{ evaluation.target }}
                        </p>

                        <p class="mt-0.5 text-xs text-gray-400">
                          Evaluation recipient
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="px-5 py-4">
                    <UBadge
                      :color="evaluationTypeColor(evaluation.type)"
                      variant="subtle"
                    >
                      {{ evaluation.type }}
                    </UBadge>
                  </td>

                  <td class="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {{ evaluation.subject }}
                  </td>

                  <td class="px-5 py-4 text-center">
                    <span
                      class="inline-flex min-w-14 justify-center rounded-lg px-2.5 py-1 font-semibold"
                      :class="averageClass(evaluation.average)"
                    >
                      {{ evaluation.average.toFixed(2) }}
                    </span>
                  </td>

                  <td class="px-5 py-4 text-center">
                    <UBadge
                      :color="sentimentColor(evaluation.sentiment)"
                      variant="subtle"
                    >
                      {{ evaluation.sentiment }}
                    </UBadge>
                  </td>

                  <td
                    class="whitespace-nowrap px-5 py-4 text-right text-gray-500 dark:text-gray-400"
                  >
                    {{ evaluation.date }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="px-5 py-16 text-center">
            <div
              class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
            >
              <UIcon name="i-lucide-inbox" class="size-6" />
            </div>

            <p
              class="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              No department evaluations available
            </p>

            <p class="mt-1 text-xs text-gray-400">
              Recent departmental evaluation records will appear here.
            </p>
          </div>
        </UCard>

        <!-- LAST UPDATED -->
        <div
          class="flex items-center justify-end text-xs text-gray-400 dark:text-gray-500"
        >
          <UIcon name="i-lucide-clock-3" class="mr-1.5 size-3.5" />

          Last updated: {{ lastUpdated }}
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

const { $api } = useNuxtApp();
const { user } = useAuth();
const toast = useToast();

const maximumRating = 4;

const loading = ref(true);

const deanRecord = ref<any>(null);
const departmentFaculty = ref<any[]>([]);
const evaluations = ref<any[]>([]);

const lastUpdatedAt = ref<Date | null>(null);

/* =========================================================
   DEAN INFORMATION
========================================================= */

const deanDisplayName = computed(() => {
  return (
    deanRecord.value?.name ||
    deanRecord.value?.full_name ||
    user.value?.full_name ||
    user.value?.name ||
    user.value?.username ||
    "Dean"
  );
});

const departmentName = computed(() => {
  return (
    deanRecord.value?.department?.name ||
    deanRecord.value?.department ||
    "Department"
  );
});

const currentDate = computed(() =>
  new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
);

const lastUpdated = computed(() => {
  if (!lastUpdatedAt.value) {
    return "Not yet updated";
  }

  return lastUpdatedAt.value.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
});

/* =========================================================
   MAIN TOTALS
========================================================= */

const totalDepartmentFaculty = computed(() => departmentFaculty.value.length);

const studentFacultyEvaluations = computed(() =>
  evaluations.value.filter((evaluation: any) => {
    const code =
      evaluation.batch?.evaluation_type?.code ||
      evaluation.evaluation_type?.code;

    if (code) {
      return code === "student-faculty";
    }

    return Boolean(evaluation.teacher);
  }),
);

const facultyDeanEvaluations = computed(() =>
  evaluations.value.filter((evaluation: any) => {
    const code =
      evaluation.batch?.evaluation_type?.code ||
      evaluation.evaluation_type?.code;

    return ["faculty-dean", "faculty-dean-coordinator"].includes(code);
  }),
);

const deanFacultyEvaluations = computed(() =>
  evaluations.value.filter((evaluation: any) => {
    const code =
      evaluation.batch?.evaluation_type?.code ||
      evaluation.evaluation_type?.code;

    return ["dean-faculty", "dean-to-faculty"].includes(code);
  }),
);

const totalDepartmentEvaluations = computed(() => evaluations.value.length);

const validEvaluations = computed(() =>
  studentFacultyEvaluations.value.filter(
    (evaluation: any) => Number(evaluation.average_score) > 0,
  ),
);

const departmentAverage = computed(() => {
  if (!validEvaluations.value.length) {
    return "0.00";
  }

  const total = validEvaluations.value.reduce(
    (sum: number, evaluation: any) =>
      sum + Number(evaluation.average_score || 0),
    0,
  );

  return (total / validEvaluations.value.length).toFixed(2);
});

const getPerformanceLabel = (value: number) => {
  const score = Number(value || 0);

  if (score >= 3.5) return "Excellent";
  if (score >= 2.5) return "Satisfactory";
  if (score >= 1.5) return "Fair";
  if (score > 0) return "Needs Improvement";

  return "No Data";
};

/* =========================================================
   DEPARTMENT STAT CARDS
========================================================= */

const departmentStats = computed(() => [
  {
    label: "Department Faculty",
    value: totalDepartmentFaculty.value.toLocaleString(),
    description: `Faculty assigned to ${departmentName.value}`,
    icon: "i-lucide-users-round",
    iconClass:
      "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    decoration: "bg-blue-500",
    accentClass: "bg-blue-500",
    badge: "Faculty",
    suffix: "",
    footerLabel: "Personnel records",
    footerValue: totalDepartmentFaculty.value ? "Available" : "No Data",
    footerIcon: totalDepartmentFaculty.value
      ? "i-lucide-circle-check"
      : "i-lucide-circle-minus",
    footerClass: totalDepartmentFaculty.value
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-gray-400",
  },
  {
    label: "Student Evaluations",
    value: studentFacultyEvaluations.value.length.toLocaleString(),
    description: "Student → Faculty evaluations",
    icon: "i-lucide-graduation-cap",
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    decoration: "bg-emerald-500",
    accentClass: "bg-emerald-500",
    badge: "Feedback",
    suffix: "",
    footerLabel: "Evaluation source",
    footerValue: "Students",
    footerIcon: "i-lucide-message-square-text",
    footerClass: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Faculty to Dean",
    value: facultyDeanEvaluations.value.length.toLocaleString(),
    description: "Faculty feedback submitted to dean",
    icon: "i-lucide-building-2",
    iconClass:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    decoration: "bg-violet-500",
    accentClass: "bg-violet-500",
    badge: "Dean",
    suffix: "",
    footerLabel: "Evaluation direction",
    footerValue: "Faculty → Dean",
    footerIcon: "i-lucide-arrow-right",
    footerClass: "text-violet-600 dark:text-violet-400",
  },
  {
    label: "Dean to Faculty",
    value: deanFacultyEvaluations.value.length.toLocaleString(),
    description: "Dean evaluation records",
    icon: "i-lucide-clipboard-pen-line",
    iconClass:
      "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
    decoration: "bg-orange-500",
    accentClass: "bg-orange-500",
    badge: "Reviews",
    suffix: "",
    footerLabel: "Evaluation direction",
    footerValue: "Dean → Faculty",
    footerIcon: "i-lucide-arrow-right",
    footerClass: "text-orange-600 dark:text-orange-400",
  },
  {
    label: "Department Average",
    value: departmentAverage.value,
    description: "Average student evaluation score",
    icon: "i-lucide-star",
    iconClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    decoration: "bg-amber-500",
    accentClass: "bg-amber-500",
    badge: "Performance",
    suffix: `/ ${maximumRating.toFixed(2)}`,
    footerLabel: "Rating level",
    footerValue: getPerformanceLabel(Number(departmentAverage.value)),
    footerIcon: "i-lucide-trending-up",
    footerClass: "text-amber-600 dark:text-amber-400",
  },
]);

/* =========================================================
   SENTIMENT ANALYSIS
========================================================= */

const analyzedEvaluations = computed(() =>
  studentFacultyEvaluations.value.filter((evaluation: any) =>
    ["Positive", "Neutral", "Negative"].includes(evaluation.feedback_sentiment),
  ),
);

const analyzedFeedbackCount = computed(() => analyzedEvaluations.value.length);

const positiveCount = computed(
  () =>
    analyzedEvaluations.value.filter(
      (evaluation: any) => evaluation.feedback_sentiment === "Positive",
    ).length,
);

const neutralCount = computed(
  () =>
    analyzedEvaluations.value.filter(
      (evaluation: any) => evaluation.feedback_sentiment === "Neutral",
    ).length,
);

const negativeCount = computed(
  () =>
    analyzedEvaluations.value.filter(
      (evaluation: any) => evaluation.feedback_sentiment === "Negative",
    ).length,
);

const averageSentimentScore = computed(() => {
  if (!analyzedEvaluations.value.length) {
    return "0.00";
  }

  const totalScore = analyzedEvaluations.value.reduce(
    (sum: number, evaluation: any) =>
      sum + Number(evaluation.feedback_sentiment_score || 0),
    0,
  );

  return (totalScore / analyzedEvaluations.value.length).toFixed(2);
});

const sentimentScorePercentage = computed(() => {
  const score = Number(averageSentimentScore.value);

  const percentage = ((score + 1) / 2) * 100;

  return Math.min(100, Math.max(0, Math.round(percentage)));
});

const overallSentimentLabel = computed(() => {
  if (!analyzedFeedbackCount.value) {
    return "No Sentiment Data";
  }

  const score = Number(averageSentimentScore.value);

  if (score >= 0.25) return "Generally Positive";
  if (score <= -0.25) return "Generally Negative";

  return "Generally Neutral";
});

const overallSentimentIcon = computed(() => {
  if (!analyzedFeedbackCount.value) {
    return "i-lucide-message-square-off";
  }

  const score = Number(averageSentimentScore.value);

  if (score >= 0.25) return "i-lucide-smile";
  if (score <= -0.25) return "i-lucide-frown";

  return "i-lucide-meh";
});

const overallSentimentClass = computed(() => {
  if (!analyzedFeedbackCount.value) {
    return "bg-white/10 text-white/60";
  }

  const score = Number(averageSentimentScore.value);

  if (score >= 0.25) {
    return "bg-emerald-400/15 text-emerald-300";
  }

  if (score <= -0.25) {
    return "bg-red-400/15 text-red-300";
  }

  return "bg-white/10 text-white/70";
});

const getSentimentPercentage = (count: number) => {
  if (!analyzedFeedbackCount.value) {
    return 0;
  }

  return Math.round((count / analyzedFeedbackCount.value) * 100);
};

const sentimentDistribution = computed(() => [
  {
    label: "Positive",
    description: "Favourable and encouraging feedback",
    count: positiveCount.value,
    percentage: getSentimentPercentage(positiveCount.value),
    icon: "i-lucide-smile",
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    progressClass: "bg-emerald-500",
  },
  {
    label: "Neutral",
    description: "Balanced or non-emotional feedback",
    count: neutralCount.value,
    percentage: getSentimentPercentage(neutralCount.value),
    icon: "i-lucide-meh",
    iconClass: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    progressClass: "bg-gray-400",
  },
  {
    label: "Negative",
    description: "Critical feedback requiring attention",
    count: negativeCount.value,
    percentage: getSentimentPercentage(negativeCount.value),
    icon: "i-lucide-frown",
    iconClass: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    progressClass: "bg-red-500",
  },
]);

/* =========================================================
   TOP FACULTY
========================================================= */

const topFaculty = computed(() => {
  const grouped: Record<string, any> = {};

  studentFacultyEvaluations.value.forEach((evaluation: any) => {
    if (!evaluation.teacher) return;

    const key = evaluation.teacher.documentId || evaluation.teacher.id;

    if (!key) return;

    if (!grouped[key]) {
      grouped[key] = {
        id: key,
        name: evaluation.teacher.name || "Unknown Faculty",
        count: 0,
        totalAverage: 0,
        average: 0,
      };
    }

    grouped[key].count += 1;

    grouped[key].totalAverage += Number(evaluation.average_score || 0);
  });

  return Object.values(grouped)
    .map((faculty: any) => ({
      ...faculty,

      average: faculty.count
        ? Number((faculty.totalAverage / faculty.count).toFixed(2))
        : 0,
    }))
    .sort((first: any, second: any) => second.average - first.average)
    .slice(0, 5);
});

/* =========================================================
   SECTION PERFORMANCE
========================================================= */

const sectionSummary = computed(() => {
  const grouped: Record<string, any> = {};

  studentFacultyEvaluations.value.forEach((evaluation: any) => {
    const responses = Array.isArray(evaluation.responses)
      ? evaluation.responses
      : [];

    responses.forEach((response: any) => {
      const section = response.section || "Uncategorized";

      if (!grouped[section]) {
        grouped[section] = {
          section,
          sectionOrder: Number(response.sectionOrder) || 0,
          totalScore: 0,
          items: 0,
          average: 0,
        };
      }

      grouped[section].totalScore += Number(response.score || 0);

      grouped[section].items += 1;
    });
  });

  return Object.values(grouped)
    .map((section: any) => ({
      ...section,

      average: section.items
        ? Number((section.totalScore / section.items).toFixed(2))
        : 0,
    }))
    .sort(
      (first: any, second: any) => first.sectionOrder - second.sectionOrder,
    );
});

/* =========================================================
   RECENT EVALUATIONS
========================================================= */

const recentEvaluations = computed(() =>
  evaluations.value.slice(0, 10).map((evaluation: any) => ({
    id:
      evaluation.documentId ||
      evaluation.id ||
      `${evaluation.createdAt}-${evaluation.average_score}`,

    target:
      evaluation.teacher?.name ||
      evaluation.dean_coordinator?.name ||
      "Unknown",

    type: getEvaluationType(evaluation),

    subject:
      evaluation.subject?.name ||
      evaluation.subject?.subject_name ||
      "No Subject",

    average: Number(evaluation.average_score || 0),

    sentiment: evaluation.feedback_sentiment || "Not Analysed",

    date: formatDate(evaluation.createdAt),
  })),
);

const getEvaluationType = (evaluation: any) => {
  const code =
    evaluation.batch?.evaluation_type?.code || evaluation.evaluation_type?.code;

  const typeMap: Record<string, string> = {
    "student-faculty": "Student → Faculty",
    "faculty-dean": "Faculty → Dean",
    "faculty-dean-coordinator": "Faculty → Dean",
    "dean-faculty": "Dean → Faculty",
    "dean-to-faculty": "Dean → Faculty",
    "student-school": "Student → School",
  };

  if (code && typeMap[code]) {
    return typeMap[code];
  }

  if (evaluation.dean_coordinator) {
    return "Faculty → Dean";
  }

  if (evaluation.teacher) {
    return "Student → Faculty";
  }

  return "Other Evaluation";
};

/* =========================================================
   DISPLAY HELPERS
========================================================= */

const formatDate = (value: string) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getInitials = (name: string) => {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part: string) => part.charAt(0).toUpperCase())
    .join("");
};

const rankingClass = (index: number) => {
  if (index === 0) {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400";
  }

  if (index === 1) {
    return "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }

  if (index === 2) {
    return "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400";
  }

  return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
};

const scorePercentage = (value: number) => {
  const score = Number(value || 0);

  return Math.min(100, Math.max(0, (score / maximumRating) * 100));
};

const scoreColor = (value: number) => {
  const score = Number(value);

  if (score >= 3.5) return "success";
  if (score >= 2.5) return "primary";
  if (score >= 1.5) return "warning";

  return "error";
};

const scoreProgressClass = (value: number) => {
  const score = Number(value);

  if (score >= 3.5) return "bg-emerald-500";
  if (score >= 2.5) return "bg-blue-500";
  if (score >= 1.5) return "bg-amber-500";

  return "bg-red-500";
};

const averageClass = (value: number) => {
  const score = Number(value);

  if (score >= 3.5) {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";
  }

  if (score >= 2.5) {
    return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";
  }

  if (score >= 1.5) {
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
  }

  return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";
};

const sentimentColor = (sentiment: string) => {
  if (sentiment === "Positive") return "success";
  if (sentiment === "Negative") return "error";
  if (sentiment === "Neutral") return "neutral";

  return "neutral";
};

const evaluationTypeColor = (type: string) => {
  if (type === "Student → Faculty") {
    return "primary";
  }

  if (type === "Faculty → Dean") {
    return "warning";
  }

  if (type === "Dean → Faculty") {
    return "success";
  }

  if (type === "Student → School") {
    return "info";
  }

  return "neutral";
};

/* =========================================================
   LOAD DEAN TEACHER RECORD
========================================================= */

const getDeanRecord = async () => {
  const userId =
    user.value?.id ||
    user.value?.documentId

  if (!userId) {
    deanRecord.value = null
    return
  }

  const response = await $api('/teachers', {
    query: {
      'filters[user][id][$eq]': userId,

      'populate[user][populate][0]': 'role',
      'populate[department]': true,

      'pagination[pageSize]': 1
    }
  })

  deanRecord.value =
    response.data?.[0] || null
}

/* =========================================================
   LOAD FACULTY IN THE DEAN'S DEPARTMENT
========================================================= */

const getDepartmentFaculty = async () => {
  if (!deanRecord.value) {
    departmentFaculty.value = []
    return
  }

  const departmentId =
    deanRecord.value.department?.id ||
    deanRecord.value.department?.documentId

  const departmentName =
    deanRecord.value.department?.name ||
    deanRecord.value.department

  const query: Record<string, any> = {
    'populate[user][populate][0]': 'role',
    'populate[department]': true,

    'filters[user][role][name][$eq]': 'Faculty',

    'sort[0]': 'name:asc',
    'pagination[pageSize]': 500
  }

  if (departmentId) {
    query['filters[department][id][$eq]'] =
      departmentId
  } else if (departmentName) {
    query['filters[department][$eq]'] =
      departmentName
  }

  const response = await $api('/teachers', {
    query
  })

  departmentFaculty.value =
    response.data || []
}

/* =========================================================
   LOAD DEPARTMENT EVALUATIONS
========================================================= */

const getEvaluations = async () => {
  if (!deanRecord.value) {
    evaluations.value = []
    return
  }

  const deanTeacherId =
    deanRecord.value.id ||
    deanRecord.value.documentId

  const facultyIds = departmentFaculty.value
    .map((faculty: any) =>
      faculty.id ||
      faculty.documentId
    )
    .filter(Boolean)

  const query: Record<string, any> = {
    'populate[teacher]': true,
    'populate[subject]': true,
    'populate[dean_coordinator]': true,
    'populate[evaluator_user]': true,

    'populate[batch][populate][0]':
      'evaluation_type',

    'sort[0]': 'createdAt:desc',
    'pagination[pageSize]': 500
  }

  let filterIndex = 0

  /*
   * Faculty → Dean evaluations.
   *
   * Keep this relation name only when your Evaluation
   * schema still uses "dean_coordinator".
   */
  if (deanTeacherId) {
    query[
      `filters[$or][${filterIndex}][dean_coordinator][id][$eq]`
    ] = deanTeacherId

    filterIndex++
  }

  /*
   * Student → Faculty and Dean → Faculty evaluations
   * for teachers in the dean's department.
   */
  if (facultyIds.length) {
    query[
      `filters[$or][${filterIndex}][teacher][id][$in]`
    ] = facultyIds
  }

  const response = await $api('/evaluations', {
    query
  })

  evaluations.value =
    response.data || []
}

/* =========================================================
   LOAD DASHBOARD
========================================================= */

const loadDashboard = async () => {
  try {
    loading.value = true

    await getDeanRecord()
    await getDepartmentFaculty()
    await getEvaluations()

    lastUpdatedAt.value = new Date()
  } catch (error) {
    console.error(
      'Dean dashboard loading error:',
      error
    )

    deanRecord.value = null
    departmentFaculty.value = []
    evaluations.value = []

    toast.add({
      title: 'Unable to load dashboard',
      description:
        'Your departmental evaluation information could not be retrieved.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard();
});
</script>
