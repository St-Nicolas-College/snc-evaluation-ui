<template>
  <div class="space-y-7">
    <!-- =========================================================
      WELCOME BANNER
    ========================================================== -->
    <section
      class="relative overflow-hidden rounded-3xl border border-primary-500/20 bg-gradient-to-br from-primary-700 via-primary-600 to-emerald-600 p-6 text-white shadow-lg shadow-primary-900/10 sm:p-8"
    >
      <!-- Decorative background -->
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
          backgroundSize: '36px 36px'
        }"
      />

      <div
        class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="max-w-3xl">
          <div
            class="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur"
          >
            <UIcon
              name="i-lucide-layout-dashboard"
              class="size-4"
            />

            Administrator Overview
          </div>

          <h1
            class="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
          >
            Welcome to the Evaluation Dashboard
          </h1>

          <p
            class="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base"
          >
            Monitor users, evaluation activity, faculty performance, section
            scores, and AI-powered student feedback insights.
          </p>

          <div
            class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/75"
          >
            <span class="inline-flex items-center gap-1.5">
              <UIcon
                name="i-lucide-calendar-days"
                class="size-4"
              />

              {{ currentDate }}
            </span>

            <span class="hidden size-1 rounded-full bg-white/40 sm:block" />

            <span class="inline-flex items-center gap-1.5">
              <UIcon
                name="i-lucide-database"
                class="size-4"
              />

              {{ totalEvaluations.toLocaleString() }} evaluation records
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

              System online
            </span>
          </div>
        </div>

        <div class="flex shrink-0 items-center">
          <UButton
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="solid"
            size="lg"
            class="bg-white text-primary-700 shadow-sm hover:bg-white/90 dark:bg-white dark:text-primary-700"
            :loading="loading"
            :disabled="loading"
            @click="loadDashboard"
          >
            Refresh Data
          </UButton>
        </div>
      </div>
    </section>

    <!-- =========================================================
      QUICK ACTIONS
    ========================================================== -->
    <section>
      <div class="mb-4">
        <h2
          class="text-base font-semibold text-gray-900 dark:text-white"
        >
          Quick Actions
        </h2>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Open frequently used administration pages.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.to"
          class="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-700"
        >
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
            :class="action.iconClass"
          >
            <UIcon
              :name="action.icon"
              class="size-5"
            />
          </div>

          <div class="min-w-0 flex-1">
            <p
              class="truncate text-sm font-semibold text-gray-800 dark:text-gray-200"
            >
              {{ action.label }}
            </p>

            <p class="mt-0.5 truncate text-xs text-gray-400">
              {{ action.description }}
            </p>
          </div>

          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-gray-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary-500"
          />
        </NuxtLink>
      </div>
    </section>

    <!-- =========================================================
      LOADING STATE
    ========================================================== -->
    <template v-if="loading">
      <section>
        <div class="mb-4">
          <USkeleton class="h-5 w-36" />
          <USkeleton class="mt-2 h-4 w-64" />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <UCard
            v-for="item in 5"
            :key="item"
            :ui="{
              root: 'rounded-2xl border-gray-200 dark:border-gray-800',
              body: 'p-5'
            }"
          >
            <div class="flex items-start justify-between">
              <USkeleton class="size-11 rounded-xl" />
              <USkeleton class="h-5 w-16 rounded-full" />
            </div>

            <USkeleton class="mt-5 h-4 w-24" />
            <USkeleton class="mt-3 h-9 w-20" />
            <USkeleton class="mt-3 h-3 w-36" />
            <USkeleton class="mt-5 h-px w-full" />
            <USkeleton class="mt-3 h-3 w-full" />
          </UCard>
        </div>
      </section>

      <UCard
        :ui="{
          root: 'rounded-3xl border-gray-200 dark:border-gray-800',
          body: 'p-6'
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
            body: 'p-5'
          }"
        >
          <USkeleton class="mb-5 h-5 w-40" />

          <div class="space-y-4">
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
        SYSTEM OVERVIEW
      ========================================================== -->
      <section>
        <div
          class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400"
            >
              <UIcon
                name="i-lucide-chart-no-axes-combined"
                class="size-5"
              />
            </div>

            <div>
              <h2
                class="text-base font-semibold text-gray-900 dark:text-white"
              >
                System Overview
              </h2>

              <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Current records and overall evaluation performance.
              </p>
            </div>
          </div>

          <div
            class="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
          >
            <span class="relative flex size-2">
              <span
                class="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"
              />

              <span
                class="relative inline-flex size-2 rounded-full bg-emerald-500"
              />
            </span>

            Live system data
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <article
            v-for="stat in primaryStats"
            :key="stat.label"
            class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:shadow-black/20"
          >
            <!-- Coloured accent -->
            <div
              class="absolute inset-x-0 top-0 h-1"
              :class="stat.accentClass"
            />

            <!-- Decorative circle -->
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
                  <UIcon
                    :name="stat.icon"
                    class="size-5"
                  />
                </div>

                <UBadge
                  color="neutral"
                  variant="subtle"
                  size="sm"
                >
                  {{ stat.badge }}
                </UBadge>
              </div>

              <div class="mt-5">
                <p
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
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
              </div>

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
                    <UIcon
                      :name="stat.footerIcon"
                      class="size-3.5"
                    />

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
            body: 'p-0'
          }"
        >
          <div class="grid grid-cols-1 xl:grid-cols-[0.85fr_1.15fr]">
            <!-- AI SCORE PANEL -->
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
                    <UIcon
                      name="i-lucide-brain-circuit"
                      class="size-6"
                    />
                  </div>

                  <span
                    class="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300"
                  >
                    <UIcon
                      name="i-lucide-sparkles"
                      class="size-3.5"
                    />

                    AI Powered
                  </span>
                </div>

                <p class="mt-7 text-sm font-medium text-white/60">
                  Average Sentiment Score
                </p>

                <div class="mt-2 flex flex-wrap items-end gap-3">
                  <p class="text-5xl font-bold tracking-tight sm:text-6xl">
                    {{ averageSentimentScore }}
                  </p>

                  <span class="mb-1 text-sm text-white/50">
                    from -1 to +1
                  </span>
                </div>

                <div class="mt-4 flex items-center gap-2">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                    :class="overallSentimentClass"
                  >
                    <UIcon
                      :name="overallSentimentIcon"
                      class="size-3.5"
                    />

                    {{ overallSentimentLabel }}
                  </span>
                </div>

                <p class="mt-4 text-sm leading-6 text-white/65">
                  Based on
                  <strong class="font-semibold text-white">
                    {{ analyzedFeedbackCount }}
                  </strong>
                  analysed Student → Faculty comment{{
                    analyzedFeedbackCount === 1 ? '' : 's'
                  }}.
                </p>

                <!-- Score scale -->
                <div
                  class="mt-7 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
                >
                  <div
                    class="flex items-center justify-between text-[11px] font-medium"
                  >
                    <span class="text-red-300">
                      Negative
                    </span>

                    <span class="text-white/60">
                      Neutral
                    </span>

                    <span class="text-emerald-300">
                      Positive
                    </span>
                  </div>

                  <div
                    class="relative mt-3 h-2.5 rounded-full bg-gradient-to-r from-red-500 via-gray-400 to-emerald-500"
                  >
                    <span
                      class="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-950 shadow-lg transition-all duration-700"
                      :style="{
                        left: `${sentimentScorePercentage}%`
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
                    Distribution of AI-classified written comments.
                  </p>
                </div>

                <div
                  class="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                >
                  {{ analyzedFeedbackCount }} comments analysed
                </div>
              </div>

              <div
                v-if="analyzedFeedbackCount"
                class="mt-7 space-y-6"
              >
                <div
                  v-for="sentiment in sentimentDistribution"
                  :key="sentiment.label"
                >
                  <div
                    class="mb-2.5 flex items-center justify-between gap-4"
                  >
                    <div class="flex min-w-0 items-center gap-3">
                      <div
                        class="flex size-10 shrink-0 items-center justify-center rounded-xl"
                        :class="sentiment.iconClass"
                      >
                        <UIcon
                          :name="sentiment.icon"
                          class="size-5"
                        />
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
                        width: `${sentiment.percentage}%`
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
                  <UIcon
                    name="i-lucide-message-square-off"
                    class="size-6"
                  />
                </div>

                <p
                  class="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  No analysed comments yet
                </p>

                <p class="mt-1 max-w-xs text-xs leading-5 text-gray-400">
                  Sentiment distribution will appear after students submit
                  comments that have been processed by the AI.
                </p>
              </div>
            </div>
          </div>
        </UCard>
      </section>

      <!-- =========================================================
        FACULTY AND SECTION PERFORMANCE
      ========================================================== -->
      <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <!-- TOP FACULTY -->
        <UCard
          :ui="{
            root: 'overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900',
            header: 'border-b border-gray-200 px-5 py-4 dark:border-gray-800',
            body: 'p-0'
          }"
        >
          <template #header>
            <div class="flex items-center justify-between gap-4">
              <div class="flex min-w-0 items-center gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                >
                  <UIcon
                    name="i-lucide-trophy"
                    class="size-5"
                  />
                </div>

                <div class="min-w-0">
                  <h3
                    class="truncate font-semibold text-gray-900 dark:text-white"
                  >
                    Top Faculty
                  </h3>

                  <p class="truncate text-xs text-gray-500 dark:text-gray-400">
                    Ranked by average evaluation score
                  </p>
                </div>
              </div>

              <UBadge
                color="warning"
                variant="subtle"
              >
                Top 5
              </UBadge>
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
                  evaluation{{ faculty.count === 1 ? '' : 's' }}
                </p>
              </div>

              <div class="shrink-0 text-right">
                <p
                  class="text-lg font-bold text-gray-900 dark:text-white"
                >
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

          <div
            v-else
            class="px-5 py-14 text-center"
          >
            <div
              class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
            >
              <UIcon
                name="i-lucide-chart-no-axes-column"
                class="size-6"
              />
            </div>

            <p
              class="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              No faculty rankings yet
            </p>

            <p class="mt-1 text-xs text-gray-400">
              Rankings will appear after evaluations are submitted.
            </p>
          </div>
        </UCard>

        <!-- SECTION SUMMARY -->
        <UCard
          :ui="{
            root: 'overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900',
            header: 'border-b border-gray-200 px-5 py-4 dark:border-gray-800',
            body: 'p-0'
          }"
        >
          <template #header>
            <div class="flex items-center gap-3">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
              >
                <UIcon
                  name="i-lucide-chart-bar-big"
                  class="size-5"
                />
              </div>

              <div class="min-w-0">
                <h3
                  class="truncate font-semibold text-gray-900 dark:text-white"
                >
                  Section Summary
                </h3>

                <p class="truncate text-xs text-gray-500 dark:text-gray-400">
                  Average score by evaluation section
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
                    rated item{{ section.items === 1 ? '' : 's' }}
                  </p>
                </div>

                <UBadge
                  :color="scoreColor(section.average)"
                  variant="subtle"
                >
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
                    width: `${scorePercentage(section.average)}%`
                  }"
                />
              </div>

              <div
                class="mt-1.5 flex items-center justify-between text-[10px] text-gray-400"
              >
                <span>0</span>
                <span>{{ maximumRating }}</span>
              </div>
            </div>
          </div>

          <div
            v-else
            class="px-5 py-14 text-center"
          >
            <div
              class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
            >
              <UIcon
                name="i-lucide-list-checks"
                class="size-6"
              />
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
        RECENT EVALUATIONS
      ========================================================== -->
      <UCard
        :ui="{
          root: 'overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900',
          header: 'border-b border-gray-200 px-5 py-4 dark:border-gray-800',
          body: 'p-0'
        }"
      >
        <template #header>
          <div
            class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400"
              >
                <UIcon
                  name="i-lucide-history"
                  class="size-5"
                />
              </div>

              <div>
                <h3
                  class="font-semibold text-gray-900 dark:text-white"
                >
                  Recent Evaluations
                </h3>

                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Latest evaluation submissions across the system
                </p>
              </div>
            </div>

            <UBadge
              color="neutral"
              variant="subtle"
            >
              Latest {{ recentEvaluations.length }}
            </UBadge>
          </div>
        </template>

        <div
          v-if="recentEvaluations.length"
          class="overflow-x-auto"
        >
          <table class="w-full min-w-[850px] text-sm">
            <thead
              class="border-b border-gray-200 bg-gray-50/80 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
            >
              <tr>
                <th class="px-5 py-3 text-left font-semibold">
                  Target
                </th>

                <th class="px-5 py-3 text-left font-semibold">
                  Evaluation Type
                </th>

                <th class="px-5 py-3 text-center font-semibold">
                  Average
                </th>

                <th class="px-5 py-3 text-center font-semibold">
                  Rating
                </th>

                <th class="px-5 py-3 text-center font-semibold">
                  Sentiment
                </th>

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

                <td class="px-5 py-4 text-center">
                  <span
                    class="inline-flex min-w-14 justify-center rounded-lg px-2.5 py-1 font-semibold"
                    :class="averageClass(evaluation.average)"
                  >
                    {{ evaluation.average.toFixed(2) }}
                  </span>
                </td>

                <td class="px-5 py-4 text-center">
                  <span
                    class="text-xs font-medium text-gray-600 dark:text-gray-300"
                  >
                    {{ getPerformanceLabel(evaluation.average) }}
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

        <div
          v-else
          class="px-5 py-16 text-center"
        >
          <div
            class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800"
          >
            <UIcon
              name="i-lucide-inbox"
              class="size-6"
            />
          </div>

          <p
            class="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            No evaluation submissions yet
          </p>

          <p class="mt-1 text-xs text-gray-400">
            Recent evaluation activity will appear in this section.
          </p>
        </div>
      </UCard>

      <!-- LAST UPDATED -->
      <div
        class="flex items-center justify-end text-xs text-gray-400 dark:text-gray-500"
      >
        <UIcon
          name="i-lucide-clock-3"
          class="mr-1.5 size-3.5"
        />

        Last updated: {{ lastUpdated }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

const { $api } = useNuxtApp()
const toast = useToast()

const maximumRating = 4

const loading = ref(true)

const students = ref<any[]>([])
const teachers = ref<any[]>([])
const subjects = ref<any[]>([])
const evaluations = ref<any[]>([])

const lastUpdatedAt = ref<Date | null>(null)

/* =========================================================
   QUICK ACTIONS

   Update these paths when your actual page routes are different.
========================================================= */

const quickActions = [
  {
    label: 'Manage Students',
    description: 'View student accounts',
    to: '/admin/management/student',
    icon: 'i-lucide-graduation-cap',
    iconClass:
      'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
  },
  {
    label: 'Manage Faculty',
    description: 'View faculty accounts',
    to: '/admin/management/faculty',
    icon: 'i-lucide-users-round',
    iconClass:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
  },
  {
    label: 'Evaluation Results',
    description: 'Review submitted results',
    to: '/admin/evaluation/student-faculty',
    icon: 'i-lucide-chart-column-big',
    iconClass:
      'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400'
  },
  {
    label: 'Evaluation Setup',
    description: 'Configure sections and criteria',
    to: '/admin/management/section',
    icon: 'i-lucide-settings-2',
    iconClass:
      'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400'
  }
]

/* =========================================================
   DATE AND UPDATE INFORMATION
========================================================= */

const currentDate = computed(() =>
  new Date().toLocaleDateString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)

const lastUpdated = computed(() => {
  if (!lastUpdatedAt.value) {
    return 'Not yet updated'
  }

  return lastUpdatedAt.value.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
})

/* =========================================================
   MAIN TOTALS
========================================================= */

const totalStudents = computed(() => students.value.length)
const totalTeachers = computed(() => teachers.value.length)
const totalSubjects = computed(() => subjects.value.length)
const totalEvaluations = computed(() => evaluations.value.length)

const validScoreEvaluations = computed(() =>
  evaluations.value.filter(
    (evaluation: any) =>
      Number(evaluation.average_score) > 0
  )
)

const overallAverage = computed(() => {
  if (!validScoreEvaluations.value.length) {
    return '0.00'
  }

  const total = validScoreEvaluations.value.reduce(
    (sum: number, evaluation: any) =>
      sum + Number(evaluation.average_score || 0),
    0
  )

  return (
    total / validScoreEvaluations.value.length
  ).toFixed(2)
})

const getPerformanceLabel = (average: number) => {
  const score = Number(average || 0)

  if (score >= 3.5) return 'Excellent'
  if (score >= 2.5) return 'Satisfactory'
  if (score >= 1.5) return 'Fair'
  if (score > 0) return 'Needs Improvement'

  return 'No Data'
}

/* =========================================================
   STATISTIC CARDS
========================================================= */

const primaryStats = computed(() => [
  {
    label: 'Students',
    value: totalStudents.value.toLocaleString(),
    description: 'Registered student accounts',
    icon: 'i-lucide-graduation-cap',
    iconClass:
      'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    decoration: 'bg-blue-500',
    accentClass: 'bg-blue-500',
    badge: 'Users',
    suffix: '',
    footerLabel: 'Account records',
    footerValue: 'Active',
    footerIcon: 'i-lucide-circle-check',
    footerClass:
      'text-emerald-600 dark:text-emerald-400'
  },
  {
    label: 'Faculty',
    value: totalTeachers.value.toLocaleString(),
    description: 'Registered faculty members',
    icon: 'i-lucide-users-round',
    iconClass:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
    decoration: 'bg-emerald-500',
    accentClass: 'bg-emerald-500',
    badge: 'Personnel',
    suffix: '',
    footerLabel: 'Faculty records',
    footerValue: 'Available',
    footerIcon: 'i-lucide-circle-check',
    footerClass:
      'text-emerald-600 dark:text-emerald-400'
  },
  {
    label: 'Subjects',
    value: totalSubjects.value.toLocaleString(),
    description: 'Available academic subjects',
    icon: 'i-lucide-book-open',
    iconClass:
      'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400',
    decoration: 'bg-violet-500',
    accentClass: 'bg-violet-500',
    badge: 'Academic',
    suffix: '',
    footerLabel: 'Subject records',
    footerValue: 'Configured',
    footerIcon: 'i-lucide-settings-2',
    footerClass:
      'text-violet-600 dark:text-violet-400'
  },
  {
    label: 'Evaluations',
    value: totalEvaluations.value.toLocaleString(),
    description: 'Total submitted evaluations',
    icon: 'i-lucide-clipboard-check',
    iconClass:
      'bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400',
    decoration: 'bg-orange-500',
    accentClass: 'bg-orange-500',
    badge: 'Records',
    suffix: '',
    footerLabel: 'Submission status',
    footerValue: 'Recorded',
    footerIcon: 'i-lucide-database',
    footerClass:
      'text-orange-600 dark:text-orange-400'
  },
  {
    label: 'Overall Average',
    value: overallAverage.value,
    description: 'Average criteria rating',
    icon: 'i-lucide-star',
    iconClass:
      'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
    decoration: 'bg-amber-500',
    accentClass: 'bg-amber-500',
    badge: 'Performance',
    suffix: `/ ${maximumRating.toFixed(2)}`,
    footerLabel: 'Rating level',
    footerValue: getPerformanceLabel(
      Number(overallAverage.value)
    ),
    footerIcon: 'i-lucide-trending-up',
    footerClass:
      'text-amber-600 dark:text-amber-400'
  }
])

/* =========================================================
   SENTIMENT ANALYSIS
========================================================= */

const studentFacultyEvaluations = computed(() =>
  evaluations.value.filter((evaluation: any) => {
    const typeCode =
      evaluation.batch?.evaluation_type?.code ||
      evaluation.evaluation_type?.code

    if (typeCode) {
      return typeCode === 'student-faculty'
    }

    return Boolean(evaluation.teacher)
  })
)

const analyzedEvaluations = computed(() =>
  studentFacultyEvaluations.value.filter(
    (evaluation: any) =>
      ['Positive', 'Neutral', 'Negative'].includes(
        evaluation.feedback_sentiment
      )
  )
)

const analyzedFeedbackCount = computed(
  () => analyzedEvaluations.value.length
)

const positiveCount = computed(
  () =>
    analyzedEvaluations.value.filter(
      (evaluation: any) =>
        evaluation.feedback_sentiment === 'Positive'
    ).length
)

const neutralCount = computed(
  () =>
    analyzedEvaluations.value.filter(
      (evaluation: any) =>
        evaluation.feedback_sentiment === 'Neutral'
    ).length
)

const negativeCount = computed(
  () =>
    analyzedEvaluations.value.filter(
      (evaluation: any) =>
        evaluation.feedback_sentiment === 'Negative'
    ).length
)

const averageSentimentScore = computed(() => {
  if (!analyzedEvaluations.value.length) {
    return '0.00'
  }

  const total = analyzedEvaluations.value.reduce(
    (sum: number, evaluation: any) =>
      sum +
      Number(
        evaluation.feedback_sentiment_score || 0
      ),
    0
  )

  return (
    total / analyzedEvaluations.value.length
  ).toFixed(2)
})

const sentimentScorePercentage = computed(() => {
  const score = Number(averageSentimentScore.value)

  // Convert -1 to +1 into 0% to 100%.
  const percentage = ((score + 1) / 2) * 100

  return Math.min(
    100,
    Math.max(0, Math.round(percentage))
  )
})

const overallSentimentLabel = computed(() => {
  const score = Number(averageSentimentScore.value)

  if (!analyzedFeedbackCount.value) {
    return 'No Sentiment Data'
  }

  if (score >= 0.25) return 'Generally Positive'
  if (score <= -0.25) return 'Generally Negative'

  return 'Generally Neutral'
})

const overallSentimentIcon = computed(() => {
  const score = Number(averageSentimentScore.value)

  if (!analyzedFeedbackCount.value) {
    return 'i-lucide-message-square-off'
  }

  if (score >= 0.25) return 'i-lucide-smile'
  if (score <= -0.25) return 'i-lucide-frown'

  return 'i-lucide-meh'
})

const overallSentimentClass = computed(() => {
  const score = Number(averageSentimentScore.value)

  if (!analyzedFeedbackCount.value) {
    return 'bg-white/10 text-white/60'
  }

  if (score >= 0.25) {
    return 'bg-emerald-400/15 text-emerald-300'
  }

  if (score <= -0.25) {
    return 'bg-red-400/15 text-red-300'
  }

  return 'bg-white/10 text-white/70'
})

const getPercentage = (value: number) => {
  if (!analyzedFeedbackCount.value) {
    return 0
  }

  return Math.round(
    (value / analyzedFeedbackCount.value) * 100
  )
}

const sentimentDistribution = computed(() => [
  {
    label: 'Positive',
    description: 'Favourable and encouraging feedback',
    count: positiveCount.value,
    percentage: getPercentage(positiveCount.value),
    icon: 'i-lucide-smile',
    iconClass:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    progressClass: 'bg-emerald-500'
  },
  {
    label: 'Neutral',
    description: 'Balanced or non-emotional feedback',
    count: neutralCount.value,
    percentage: getPercentage(neutralCount.value),
    icon: 'i-lucide-meh',
    iconClass:
      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    progressClass: 'bg-gray-400'
  },
  {
    label: 'Negative',
    description: 'Critical feedback requiring attention',
    count: negativeCount.value,
    percentage: getPercentage(negativeCount.value),
    icon: 'i-lucide-frown',
    iconClass:
      'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400',
    progressClass: 'bg-red-500'
  }
])

/* =========================================================
   TOP FACULTY
========================================================= */

const topFaculty = computed(() => {
  const grouped: Record<string, any> = {}

  evaluations.value.forEach((evaluation: any) => {
    if (!evaluation.teacher) return

    const teacherKey =
      evaluation.teacher.documentId ||
      evaluation.teacher.id

    if (!teacherKey) return

    if (!grouped[teacherKey]) {
      grouped[teacherKey] = {
        id: teacherKey,
        name:
          evaluation.teacher.name ||
          'Unknown Faculty',
        count: 0,
        totalAverage: 0,
        average: 0
      }
    }

    grouped[teacherKey].count += 1

    grouped[teacherKey].totalAverage += Number(
      evaluation.average_score || 0
    )
  })

  return Object.values(grouped)
    .map((faculty: any) => ({
      ...faculty,

      average: faculty.count
        ? Number(
            (
              faculty.totalAverage /
              faculty.count
            ).toFixed(2)
          )
        : 0
    }))
    .sort(
      (first: any, second: any) =>
        second.average - first.average
    )
    .slice(0, 5)
})

/* =========================================================
   SECTION SUMMARY
========================================================= */

const sectionSummary = computed(() => {
  const grouped: Record<string, any> = {}

  evaluations.value.forEach((evaluation: any) => {
    const responses = Array.isArray(
      evaluation.responses
    )
      ? evaluation.responses
      : []

    responses.forEach((response: any) => {
      const section =
        response.section || 'Uncategorized'

      if (!grouped[section]) {
        grouped[section] = {
          section,
          sectionOrder:
            Number(response.sectionOrder) || 0,
          totalScore: 0,
          items: 0,
          average: 0
        }
      }

      grouped[section].totalScore += Number(
        response.score || 0
      )

      grouped[section].items += 1
    })
  })

  return Object.values(grouped)
    .map((section: any) => ({
      ...section,

      average: section.items
        ? Number(
            (
              section.totalScore /
              section.items
            ).toFixed(2)
          )
        : 0
    }))
    .sort(
      (first: any, second: any) =>
        first.sectionOrder - second.sectionOrder
    )
})

/* =========================================================
   RECENT EVALUATIONS
========================================================= */

const recentEvaluations = computed(() =>
  evaluations.value
    .slice(0, 10)
    .map((evaluation: any) => ({
      id:
        evaluation.documentId ||
        evaluation.id ||
        `${evaluation.createdAt}-${evaluation.average_score}`,

      target:
        evaluation.teacher?.name ||
        evaluation.dean_coordinator?.name ||
        'Unknown',

      type: getEvaluationType(evaluation),

      average: Number(
        evaluation.average_score || 0
      ),

      sentiment:
        evaluation.feedback_sentiment ||
        'Not Analysed',

      date: formatDate(evaluation.createdAt)
    }))
)

const getEvaluationType = (evaluation: any) => {
  const code =
    evaluation.batch?.evaluation_type?.code ||
    evaluation.evaluation_type?.code

  const typeMap: Record<string, string> = {
    'student-faculty': 'Student → Faculty',
    'faculty-dean': 'Faculty → Dean',
    'faculty-dean-coordinator': 'Faculty → Dean',
    'dean-faculty': 'Dean → Faculty',
    'dean-to-faculty': 'Dean → Faculty',
    'student-school': 'Student → School'
  }

  if (code && typeMap[code]) {
    return typeMap[code]
  }

  if (evaluation.dean_coordinator) {
    return 'Faculty → Dean'
  }

  if (evaluation.teacher) {
    return 'Student → Faculty'
  }

  return 'Other Evaluation'
}

/* =========================================================
   DISPLAY HELPERS
========================================================= */

const formatDate = (value: string) => {
  if (!value) return '-'

  return new Date(value).toLocaleDateString(
    'en-PH',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  )
}

const getInitials = (name: string) => {
  if (!name) return 'U'

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part: string) =>
      part.charAt(0).toUpperCase()
    )
    .join('')
}

const rankingClass = (index: number) => {
  if (index === 0) {
    return 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
  }

  if (index === 1) {
    return 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }

  if (index === 2) {
    return 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400'
  }

  return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
}

const scorePercentage = (average: number) => {
  const score = Number(average || 0)

  return Math.min(
    100,
    Math.max(
      0,
      (score / maximumRating) * 100
    )
  )
}

const scoreColor = (average: number) => {
  const score = Number(average)

  if (score >= 3.5) return 'success'
  if (score >= 2.5) return 'primary'
  if (score >= 1.5) return 'warning'

  return 'error'
}

const scoreProgressClass = (average: number) => {
  const score = Number(average)

  if (score >= 3.5) return 'bg-emerald-500'
  if (score >= 2.5) return 'bg-blue-500'
  if (score >= 1.5) return 'bg-amber-500'

  return 'bg-red-500'
}

const averageClass = (average: number) => {
  const score = Number(average)

  if (score >= 3.5) {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
  }

  if (score >= 2.5) {
    return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
  }

  if (score >= 1.5) {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
  }

  return 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
}

const sentimentColor = (sentiment: string) => {
  if (sentiment === 'Positive') return 'success'
  if (sentiment === 'Negative') return 'error'
  if (sentiment === 'Neutral') return 'neutral'

  return 'neutral'
}

const evaluationTypeColor = (type: string) => {
  if (type === 'Student → Faculty') {
    return 'primary'
  }

  if (type === 'Faculty → Dean') {
    return 'warning'
  }

  if (type === 'Dean → Faculty') {
    return 'success'
  }

  if (type === 'Student → School') {
    return 'info'
  }

  return 'neutral'
}

/* =========================================================
   API LOADING
========================================================= */

const loadDashboard = async () => {
  try {
    loading.value = true

    const [
      studentResponse,
      teacherResponse,
      subjectResponse,
      evaluationResponse
    ] = await Promise.all([
      $api('/students', {
        query: {
          'pagination[pageSize]': 500
        }
      }),

      $api('/teachers', {
        query: {
          'pagination[pageSize]': 500
        }
      }),

      $api('/subjects', {
        query: {
          'pagination[pageSize]': 500
        }
      }),

      $api('/evaluations', {
        query: {
          'populate[teacher]': true,
          'populate[dean_coordinator]': true,
          'populate[batch][populate][0]':
            'evaluation_type',
          'sort[0]': 'createdAt:desc',
          'pagination[pageSize]': 500
        }
      })
    ])

    students.value =
      studentResponse.data || []

    teachers.value =
      teacherResponse.data || []

    subjects.value =
      subjectResponse.data || []

    evaluations.value =
      evaluationResponse.data || []

    lastUpdatedAt.value = new Date()
  } catch (error) {
    console.error(
      'Dashboard loading error:',
      error
    )

    students.value = []
    teachers.value = []
    subjects.value = []
    evaluations.value = []

    toast.add({
      title: 'Unable to load dashboard',
      description:
        'Some dashboard information could not be retrieved. Please try refreshing the page.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>