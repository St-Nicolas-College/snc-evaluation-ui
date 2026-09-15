<template>
  <div class="space-y-7">
    <!-- =========================================================

      FACULTY WELCOME BANNER

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
            <UIcon name="i-lucide-presentation" class="size-4" />

            Faculty Performance Overview
          </div>

          <h1 class="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Welcome back, {{ facultyDisplayName }}
          </h1>

          <p
            class="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base"
          >
            Review your evaluation performance, student feedback, section
            ratings, and AI-powered sentiment insights.
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
              <UIcon name="i-lucide-clipboard-check" class="size-4" />

              {{ total }} evaluation{{ total === 1 ? "" : "s" }}
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

              {{ activePeriodLabel }}
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

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <UCard
            v-for="item in 4"
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

      <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <UCard
          v-for="card in 2"
          :key="card"
          :ui="{
            root: 'rounded-3xl border-gray-200 dark:border-gray-800',

            body: 'p-6',
          }"
        >
          <USkeleton class="h-5 w-44" />

          <div class="mt-6 space-y-4">
            <USkeleton
              v-for="row in 4"
              :key="row"
              class="h-14 w-full rounded-xl"
            />
          </div>
        </UCard>
      </div>

      <UCard
        :ui="{
          root: 'rounded-2xl border-gray-200 dark:border-gray-800',

          body: 'p-6',
        }"
      >
        <USkeleton class="h-5 w-52" />

        <div class="mt-6 space-y-4">
          <USkeleton
            v-for="row in 5"
            :key="row"
            class="h-14 w-full rounded-xl"
          />
        </div>
      </UCard>
    </template>

    <template v-else>
      <!-- =========================================================

        NO FACULTY RECORD

      ========================================================== -->

      <UCard
        v-if="!facultyRecord"
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
            Faculty profile not found
          </h2>

          <p
            class="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400"
          >
            Your user account is not currently connected to a faculty record.
            Please contact the system administrator.
          </p>
        </div>
      </UCard>

      <template v-else>
        <!-- =========================================================

          PERFORMANCE OVERVIEW

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
                  My Performance Overview
                </h2>

                <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  Summary of Student → Faculty evaluations for
                  {{ activePeriodLabel }}.
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

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article
              v-for="stat in performanceStats"
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
                    <span class="text-xs text-gray-400">
                      {{ stat.footerLabel }}
                    </span>

                    <span
                      class="inline-flex items-center gap-1 text-xs font-semibold"
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

          SENTIMENT OVERVIEW

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
                    }}.
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
                      Distribution of AI-classified written comments.
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
                    Sentiment insights will appear after students submit written
                    comments.
                  </p>
                </div>
              </div>
            </div>
          </UCard>
        </section>

        <!-- =========================================================

          SECTION PERFORMANCE AND RATING DISTRIBUTION

        ========================================================== -->

        <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <!-- SECTION PERFORMANCE -->

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

                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Section Performance
                  </h3>

                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Your average score for each criteria section
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

            <EmptyDashboardState
              v-else
              icon="i-lucide-list-checks"
              title="No section data available"
              description="Section performance will appear after evaluations are submitted."
            />
          </UCard>

          <!-- RATING DISTRIBUTION -->

          <UCard
            :ui="{
              root: 'overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900',

              header: 'border-b border-gray-200 px-5 py-4 dark:border-gray-800',

              body: 'p-5',
            }"
          >
            <template #header>
              <div class="flex items-center gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400"
                >
                  <UIcon name="i-lucide-chart-pie" class="size-5" />
                </div>

                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Rating Distribution
                  </h3>

                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Breakdown of your evaluation ratings
                  </p>
                </div>
              </div>
            </template>

            <div v-if="total" class="space-y-5">
              <div v-for="rating in ratingDistribution" :key="rating.label">
                <div class="mb-2 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-9 items-center justify-center rounded-xl"
                      :class="rating.iconClass"
                    >
                      <UIcon :name="rating.icon" class="size-4" />
                    </div>

                    <div>
                      <p
                        class="text-sm font-semibold text-gray-800 dark:text-gray-200"
                      >
                        {{ rating.label }}
                      </p>

                      <p class="text-xs text-gray-400">
                        {{ rating.range }}
                      </p>
                    </div>
                  </div>

                  <div class="text-right">
                    <p class="text-sm font-bold text-gray-900 dark:text-white">
                      {{ rating.count }}
                    </p>

                    <p class="text-xs text-gray-400">
                      {{ rating.percentage }}%
                    </p>
                  </div>
                </div>

                <div
                  class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
                >
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="rating.progressClass"
                    :style="{
                      width: `${rating.percentage}%`,
                    }"
                  />
                </div>
              </div>
            </div>

            <EmptyDashboardState
              v-else
              icon="i-lucide-chart-pie"
              title="No rating data available"
              description="Rating distribution will appear after your evaluations are submitted."
            />
          </UCard>
        </div>

        <!-- =========================================================

          RECENT COMMENTS

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
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                >
                  <UIcon name="i-lucide-message-square-text" class="size-5" />
                </div>

                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Recent Student Feedback
                  </h3>

                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Latest written comments from your evaluations
                  </p>
                </div>
              </div>

              <UBadge color="neutral" variant="subtle">
                {{ recentComments.length }} comments
              </UBadge>
            </div>
          </template>

          <div
            v-if="recentComments.length"
            class="divide-y divide-gray-100 dark:divide-gray-800"
          >
            <article
              v-for="comment in recentComments"
              :key="comment.id"
              class="px-5 py-5 transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-800/30"
            >
              <div class="flex items-start gap-4">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-2xl"
                  :class="sentimentIconClass(comment.sentiment)"
                >
                  <UIcon
                    :name="sentimentIcon(comment.sentiment)"
                    class="size-5"
                  />
                </div>

                <div class="min-w-0 flex-1">
                  <div
                    class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div class="flex flex-wrap items-center gap-2">
                      <UBadge
                        :color="sentimentColor(comment.sentiment)"
                        variant="subtle"
                      >
                        {{ comment.sentiment }}
                      </UBadge>

                      <span
                        v-if="comment.subject"
                        class="text-xs text-gray-400"
                      >
                        {{ comment.subject }}
                      </span>
                    </div>

                    <span class="text-xs text-gray-400">
                      {{ comment.date }}
                    </span>
                  </div>

                  <blockquote
                    class="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300"
                  >
                    “{{ comment.comment }}”
                  </blockquote>

                  <div
                    v-if="comment.summary"
                    class="mt-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60"
                  >
                    <div class="flex items-start gap-2">
                      <UIcon
                        name="i-lucide-sparkles"
                        class="mt-0.5 size-4 shrink-0 text-primary-500"
                      />

                      <div>
                        <p
                          class="text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                        >
                          AI Summary
                        </p>

                        <p
                          class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400"
                        >
                          {{ comment.summary }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <EmptyDashboardState
            v-else
            icon="i-lucide-message-square-off"
            title="No written feedback yet"
            description="Student comments will appear here after evaluations are submitted."
          />
        </UCard>

        <!-- =========================================================

          RECENT EVALUATIONS

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
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
                >
                  <UIcon name="i-lucide-history" class="size-5" />
                </div>

                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Recent Evaluation History
                  </h3>

                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Your most recently submitted evaluation records
                  </p>
                </div>
              </div>

              <UBadge color="neutral" variant="subtle">
                Latest {{ recentEvaluations.length }}
              </UBadge>
            </div>
          </template>

          <div v-if="recentEvaluations.length" class="overflow-x-auto">
            <table class="w-full min-w-[780px] text-sm">
              <thead
                class="border-b border-gray-200 bg-gray-50/80 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
              >
                <tr>
                  <th class="px-5 py-3 text-left font-semibold">Subject</th>

                  <th class="px-5 py-3 text-center font-semibold">Average</th>

                  <th class="px-5 py-3 text-center font-semibold">Rating</th>

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
                      <div
                        class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400"
                      >
                        <UIcon name="i-lucide-book-open" class="size-4" />
                      </div>

                      <div>
                        <p class="font-medium text-gray-800 dark:text-gray-200">
                          {{ evaluation.subject }}
                        </p>

                        <p class="mt-0.5 text-xs text-gray-400">
                          Student → Faculty
                        </p>
                      </div>
                    </div>
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

          <EmptyDashboardState
            v-else
            icon="i-lucide-inbox"
            title="No evaluations available"
            description="Your evaluation history will appear here after students submit evaluations."
          />
        </UCard>

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

const loading = ref(true);
const facultyRecord = ref<any>(null);
const evaluations = ref<any[]>([]);
const evaluationType = ref<any>(null);
const activeSchoolYear = ref<any>(null);
const lastUpdatedAt = ref<Date | null>(null);

/* =========================================================
   ACTIVE PERIOD + RATING CONFIGURATION
========================================================= */
const activePeriodLabel = computed(() => {
  if (!activeSchoolYear.value) return "No active academic period";
  const sy = activeSchoolYear.value?.school_year || "No School Year";
  const semester = activeSchoolYear.value?.semester || "No Semester";
  return `${sy} • ${semester}`;
});

const normalizedScaleLabels = computed<Record<string, string>>(() => {
  const labels = evaluationType.value?.scale_labels;
  if (!labels || typeof labels !== "object" || Array.isArray(labels)) return {};
  return labels;
});

const ratingGuide = computed(() => {
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
    const rows: any[] = [];
    for (let score = maxScore; score >= minScore; score -= 1) {
      rows.push({ score, label: `Rating ${score}` });
    }
    return rows;
  }

  return [];
});

const ratingScores = computed(() =>
  ratingGuide.value.map((item: any) => Number(item.score)),
);
const minimumRating = computed(() =>
  ratingScores.value.length ? Math.min(...ratingScores.value) : 1,
);
const maximumRating = computed(() =>
  ratingScores.value.length ? Math.max(...ratingScores.value) : 5,
);

const ratingLabelForScore = (value: number) => {
  if (!ratingGuide.value.length || !Number(value)) return "No Data";
  const score = Number(value);
  const nearest = [...ratingGuide.value].sort(
    (a: any, b: any) =>
      Math.abs(Number(a.score) - score) - Math.abs(Number(b.score) - score),
  )[0];
  return nearest?.label || `Rating ${score.toFixed(2)}`;
};

const getPerformanceLabel = (value: number) => ratingLabelForScore(value);

/* =========================================================
   USER INFORMATION
========================================================= */
const facultyDisplayName = computed(() => {
  return (
    facultyRecord.value?.name ||
    user.value?.full_name ||
    user.value?.name ||
    user.value?.username ||
    "Faculty Member"
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
  if (!lastUpdatedAt.value) return "Not yet updated";
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
const total = computed(() => evaluations.value.length);
const validEvaluations = computed(() =>
  evaluations.value.filter(
    (evaluation: any) => Number(evaluation.average_score) > 0,
  ),
);

const average = computed(() => {
  if (!validEvaluations.value.length) return "0.00";
  const totalScore = validEvaluations.value.reduce(
    (sum: number, evaluation: any) =>
      sum + Number(evaluation.average_score || 0),
    0,
  );
  return (totalScore / validEvaluations.value.length).toFixed(2);
});

const highestScore = computed(() => {
  if (!validEvaluations.value.length) return "0.00";
  return Math.max(
    ...validEvaluations.value.map((evaluation: any) =>
      Number(evaluation.average_score || 0),
    ),
  ).toFixed(2);
});

const writtenCommentCount = computed(
  () =>
    evaluations.value.filter((evaluation: any) => evaluation.comment?.trim())
      .length,
);

/* =========================================================
   PERFORMANCE CARDS
========================================================= */
const performanceStats = computed(() => [
  {
    label: "My Evaluations",
    value: total.value.toLocaleString(),
    description: "Student evaluations this active period",
    icon: "i-lucide-clipboard-check",
    iconClass:
      "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    decoration: "bg-blue-500",
    accentClass: "bg-blue-500",
    badge: "Records",
    suffix: "",
    footerLabel: "Evaluation status",
    footerValue: total.value ? "Available" : "No Data",
    footerIcon: total.value ? "i-lucide-circle-check" : "i-lucide-circle-minus",
    footerClass: total.value
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-gray-400",
  },
  {
    label: "Average Score",
    value: average.value,
    description: "Active-period evaluation average",
    icon: "i-lucide-star",
    iconClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
    decoration: "bg-amber-500",
    accentClass: "bg-amber-500",
    badge: "Performance",
    suffix: `/ ${maximumRating.value.toFixed(2)}`,
    footerLabel: "Rating level",
    footerValue: getPerformanceLabel(Number(average.value)),
    footerIcon: "i-lucide-trending-up",
    footerClass: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Highest Score",
    value: highestScore.value,
    description: "Highest active-period evaluation",
    icon: "i-lucide-trophy",
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
    decoration: "bg-emerald-500",
    accentClass: "bg-emerald-500",
    badge: "Best",
    suffix: `/ ${maximumRating.value.toFixed(2)}`,
    footerLabel: "Best rating",
    footerValue: getPerformanceLabel(Number(highestScore.value)),
    footerIcon: "i-lucide-award",
    footerClass: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Written Feedback",
    value: writtenCommentCount.value.toLocaleString(),
    description: "Student comments this active period",
    icon: "i-lucide-message-square-text",
    iconClass:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
    decoration: "bg-violet-500",
    accentClass: "bg-violet-500",
    badge: "Comments",
    suffix: "",
    footerLabel: "Feedback status",
    footerValue: writtenCommentCount.value ? "Received" : "No Comments",
    footerIcon: writtenCommentCount.value
      ? "i-lucide-message-circle-check"
      : "i-lucide-message-circle-off",
    footerClass: writtenCommentCount.value
      ? "text-violet-600 dark:text-violet-400"
      : "text-gray-400",
  },
]);

/* =========================================================
   SENTIMENT ANALYSIS
========================================================= */
const analyzedEvaluations = computed(() =>
  evaluations.value.filter((evaluation: any) =>
    ["Positive", "Neutral", "Negative"].includes(evaluation.feedback_sentiment),
  ),
);
const analyzedFeedbackCount = computed(() => analyzedEvaluations.value.length);
const positiveCount = computed(
  () =>
    analyzedEvaluations.value.filter(
      (e: any) => e.feedback_sentiment === "Positive",
    ).length,
);
const neutralCount = computed(
  () =>
    analyzedEvaluations.value.filter(
      (e: any) => e.feedback_sentiment === "Neutral",
    ).length,
);
const negativeCount = computed(
  () =>
    analyzedEvaluations.value.filter(
      (e: any) => e.feedback_sentiment === "Negative",
    ).length,
);

const averageSentimentScore = computed(() => {
  if (!analyzedEvaluations.value.length) return "0.00";
  const score = analyzedEvaluations.value.reduce(
    (sum: number, evaluation: any) =>
      sum + Number(evaluation.feedback_sentiment_score || 0),
    0,
  );
  return (score / analyzedEvaluations.value.length).toFixed(2);
});

const sentimentScorePercentage = computed(() => {
  const percentage = ((Number(averageSentimentScore.value) + 1) / 2) * 100;
  return Math.min(100, Math.max(0, Math.round(percentage)));
});

const overallSentimentLabel = computed(() => {
  if (!analyzedFeedbackCount.value) return "No Sentiment Data";
  const score = Number(averageSentimentScore.value);
  if (score >= 0.25) return "Generally Positive";
  if (score <= -0.25) return "Generally Negative";
  return "Generally Neutral";
});
const overallSentimentIcon = computed(() => {
  if (!analyzedFeedbackCount.value) return "i-lucide-message-square-off";
  const score = Number(averageSentimentScore.value);
  if (score >= 0.25) return "i-lucide-smile";
  if (score <= -0.25) return "i-lucide-frown";
  return "i-lucide-meh";
});
const overallSentimentClass = computed(() => {
  if (!analyzedFeedbackCount.value) return "bg-white/10 text-white/60";
  const score = Number(averageSentimentScore.value);
  if (score >= 0.25) return "bg-emerald-400/15 text-emerald-300";
  if (score <= -0.25) return "bg-red-400/15 text-red-300";
  return "bg-white/10 text-white/70";
});
const getSentimentPercentage = (count: number) =>
  analyzedFeedbackCount.value
    ? Math.round((count / analyzedFeedbackCount.value) * 100)
    : 0;

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
   DYNAMIC RATING DISTRIBUTION
========================================================= */
const ratingDistribution = computed(() => {
  if (!ratingGuide.value.length) return [];
  const sorted = [...ratingGuide.value].sort(
    (a: any, b: any) => Number(b.score) - Number(a.score),
  );

  return sorted.map((item: any, index: number) => {
    const score = Number(item.score);
    const higher =
      index === 0
        ? maximumRating.value
        : (Number(sorted[index - 1].score) + score) / 2;
    const lower =
      index === sorted.length - 1
        ? minimumRating.value
        : (score + Number(sorted[index + 1].score)) / 2;
    const count = validEvaluations.value.filter((evaluation: any) => {
      const value = Number(evaluation.average_score || 0);
      if (index === 0) return value >= lower && value <= higher;
      return value >= lower && value < higher;
    }).length;
    const percentage = validEvaluations.value.length
      ? Math.round((count / validEvaluations.value.length) * 100)
      : 0;

    const iconSet = [
      "i-lucide-star",
      "i-lucide-thumbs-up",
      "i-lucide-minus",
      "i-lucide-triangle-alert",
    ];
    const classSet = [
      [
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
        "bg-emerald-500",
      ],
      [
        "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
        "bg-blue-500",
      ],
      [
        "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
        "bg-amber-500",
      ],
      [
        "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
        "bg-red-500",
      ],
    ];
    const styleIndex = Math.min(
      3,
      Math.floor((index * 4) / Math.max(sorted.length, 1)),
    );
    return {
      label: item.label,
      range: `${lower.toFixed(2)} – ${higher.toFixed(2)}`,
      count,
      percentage,
      icon: iconSet[styleIndex],
      iconClass: classSet[styleIndex][0],
      progressClass: classSet[styleIndex][1],
    };
  });
});

/* =========================================================
   SECTION SUMMARY
========================================================= */
const sectionSummary = computed(() => {
  const grouped: Record<string, any> = {};
  evaluations.value.forEach((evaluation: any) => {
    const responses = Array.isArray(evaluation.responses)
      ? evaluation.responses
      : [];
    responses.forEach((response: any) => {
      const section = response.section || "Uncategorized";
      if (!grouped[section])
        grouped[section] = {
          section,
          sectionOrder: Number(response.sectionOrder) || 0,
          totalScore: 0,
          items: 0,
          average: 0,
        };
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
    .sort((a: any, b: any) => a.sectionOrder - b.sectionOrder);
});

/* =========================================================
   COMMENTS + RECENT EVALUATIONS
========================================================= */
const formatDate = (value: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const recentComments = computed(() =>
  evaluations.value
    .filter((evaluation: any) => evaluation.comment?.trim())
    .slice(0, 5)
    .map((evaluation: any) => ({
      id: evaluation.documentId || evaluation.id,
      comment: evaluation.comment,
      subject:
        evaluation.subject?.name || evaluation.subject?.subject_name || "",
      sentiment: evaluation.feedback_sentiment || "Not Analysed",
      summary: evaluation.feedback_sentiment_summary || "",
      date: formatDate(evaluation.createdAt),
    })),
);

const recentEvaluations = computed(() =>
  evaluations.value.slice(0, 10).map((evaluation: any) => ({
    id: evaluation.documentId || evaluation.id,
    subject:
      evaluation.subject?.name ||
      evaluation.subject?.subject_name ||
      "No Subject",
    average: Number(evaluation.average_score || 0),
    sentiment: evaluation.feedback_sentiment || "Not Analysed",
    date: formatDate(evaluation.createdAt),
  })),
);

/* =========================================================
   UI HELPERS
========================================================= */
const scorePercentage = (value: number) => {
  const span = maximumRating.value - minimumRating.value;
  if (span <= 0) return Number(value) >= maximumRating.value ? 100 : 0;
  return Math.min(
    100,
    Math.max(0, ((Number(value) - minimumRating.value) / span) * 100),
  );
};

const scoreBandIndex = (value: number) => {
  const min = minimumRating.value,
    max = maximumRating.value;
  if (max <= min) return 0;
  const normalized = (Number(value) - min) / (max - min);
  if (normalized >= 0.75) return 0;
  if (normalized >= 0.5) return 1;
  if (normalized >= 0.25) return 2;
  return 3;
};
const scoreColor = (value: number) =>
  ["success", "primary", "warning", "error"][scoreBandIndex(value)];
const scoreProgressClass = (value: number) =>
  ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-red-500"][
    scoreBandIndex(value)
  ];
const averageClass = (value: number) =>
  [
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  ][scoreBandIndex(value)];

const sentimentColor = (sentiment: string) =>
  sentiment === "Positive"
    ? "success"
    : sentiment === "Negative"
      ? "error"
      : "neutral";
const sentimentIcon = (sentiment: string) =>
  sentiment === "Positive"
    ? "i-lucide-smile"
    : sentiment === "Negative"
      ? "i-lucide-frown"
      : sentiment === "Neutral"
        ? "i-lucide-meh"
        : "i-lucide-message-square";
const sentimentIconClass = (sentiment: string) => {
  if (sentiment === "Positive")
    return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400";
  if (sentiment === "Negative")
    return "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400";
  if (sentiment === "Neutral")
    return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  return "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400";
};

/* =========================================================
   API LOADERS
========================================================= */
const getActiveSchoolYear = async () => {
  const response: any = await $api("/school-years", {
    query: {
      "filters[active_sy][$eq]": true,
      "sort[0]": "updatedAt:desc",
      "pagination[pageSize]": 1,
    },
  });
  activeSchoolYear.value = response?.data?.[0] || null;
};

const getEvaluationType = async () => {
  const response: any = await $api("/evaluation-types", {
    query: {
      "filters[code][$eq]": "student-faculty",
      "pagination[pageSize]": 1,
    },
  });
  evaluationType.value = response?.data?.[0] || null;
};

const getFacultyRecord = async () => {
  const userId = user.value?.id || user.value?.documentId;
  if (!userId) {
    facultyRecord.value = null;
    return;
  }
  const response: any = await $api("/teachers", {
    query: {
      "filters[user][id][$eq]": userId,
      "populate[user][populate][0]": "role",
      "populate[department]": true,
      "pagination[pageSize]": 1,
    },
  });
  facultyRecord.value = response.data?.[0] || null;
};

const getEvaluations = async () => {
  if (!facultyRecord.value || !activeSchoolYear.value) {
    evaluations.value = [];
    return;
  }
  const facultyId = facultyRecord.value.id || facultyRecord.value.documentId;
  const response: any = await $api("/evaluations", {
    query: {
      "filters[teacher][id][$eq]": facultyId,
      "filters[batch][evaluation_type][code][$eq]": "student-faculty",
      "filters[batch][school_year][$eq]": activeSchoolYear.value.school_year,
      "filters[batch][semester][$eq]": activeSchoolYear.value.semester,
      "populate[teacher]": true,
      "populate[subject]": true,
      "populate[batch][populate][0]": "evaluation_type",
      "sort[0]": "createdAt:desc",
      "pagination[pageSize]": 500,
    },
  });
  evaluations.value = response.data || [];
};

const loadDashboard = async () => {
  try {
    loading.value = true;
    await Promise.all([
      getActiveSchoolYear(),
      getEvaluationType(),
      getFacultyRecord(),
    ]);
    await getEvaluations();
    lastUpdatedAt.value = new Date();
  } catch (error: any) {
    console.error("Faculty dashboard loading error:", error);
    evaluations.value = [];
    toast.add({
      title: "Unable to load dashboard",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Your faculty evaluation information could not be retrieved.",
      icon: "i-lucide-triangle-alert",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadDashboard());
</script>
