<template>
  <div class="space-y-7">
    <!-- =========================================================

      STUDENT WELCOME BANNER

    ========================================================== -->

    <section
      class="relative overflow-hidden rounded-3xl border border-primary-500/20 bg-gradient-to-br from-primary-700 via-primary-600 to-emerald-600 p-6 text-white shadow-lg shadow-primary-900/10 sm:p-8"
    >
      <!-- Decorative elements -->

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
            <UIcon name="i-lucide-graduation-cap" class="size-4" />

            Student Evaluation Portal
          </div>

          <h1 class="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Welcome back, {{ studentDisplayName }}
          </h1>

          <p
            class="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base"
          >
            Complete your assigned evaluations and help improve teaching,
            learning, and school services through meaningful feedback.
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
              <UIcon name="i-lucide-circle-check-big" class="size-4" />

              {{ submitted }} submitted
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

        <div class="flex flex-wrap items-center gap-3">
          <UButton
            to="/student/evaluate"
            icon="i-lucide-clipboard-pen-line"
            color="neutral"
            variant="solid"
            size="lg"
            class="bg-white text-primary-700 shadow-sm hover:bg-white/90 dark:bg-white dark:text-primary-700"
          >
            Start Evaluation
          </UButton>

          <UButton
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="outline"
            size="lg"
            class="border-white/30 bg-white/10 text-white hover:bg-white/20"
            :loading="loading"
            :disabled="loading"
            @click="loadDashboard"
          >
            Refresh
          </UButton>
        </div>
      </div>
    </section>

    <!-- =========================================================

      LOADING STATE

    ========================================================== -->

    <template v-if="loading">
      <section>
        <div class="mb-4">
          <USkeleton class="h-5 w-44" />

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
          v-for="item in 2"
          :key="item"
          :ui="{
            root: 'rounded-2xl border-gray-200 dark:border-gray-800',

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
    </template>

    <template v-else>
      <!-- =========================================================

        STUDENT PROFILE ERROR

      ========================================================== -->

      <UCard
        v-if="!studentRecord"
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
            Student profile not found
          </h2>

          <p
            class="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400"
          >
            Your account is not currently connected to a student record. Please
            contact the system administrator.
          </p>
        </div>
      </UCard>

      <template v-else>
        <!-- =========================================================

          EVALUATION OVERVIEW

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
                  My Evaluation Overview
                </h2>

                <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  Track assigned teachers and current-period evaluation
                  progress.
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
              v-for="stat in studentStats"
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

          COMPLETION PROGRESS

        ========================================================== -->

        <section>
          <UCard
            :ui="{
              root: 'overflow-hidden rounded-3xl border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900',

              body: 'p-0',
            }"
          >
            <div class="grid grid-cols-1 xl:grid-cols-[0.8fr_1.2fr]">
              <!-- PROGRESS PANEL -->

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
                      <UIcon name="i-lucide-list-checks" class="size-6" />
                    </div>

                    <span
                      class="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300"
                    >
                      <UIcon name="i-lucide-activity" class="size-3.5" />

                      Evaluation Progress
                    </span>
                  </div>

                  <p class="mt-7 text-sm font-medium text-white/60">
                    Overall Completion
                  </p>

                  <div class="mt-2 flex items-end gap-3">
                    <p class="text-5xl font-bold tracking-tight sm:text-6xl">
                      {{ completionPercentage }}%
                    </p>

                    <span class="mb-1 text-sm text-white/50"> completed </span>
                  </div>

                  <p class="mt-4 text-sm leading-6 text-white/65">
                    You have completed

                    <strong class="font-semibold text-white">
                      {{ submitted }}
                    </strong>

                    of

                    <strong class="font-semibold text-white">
                      {{ expectedTotalEvaluations }}
                    </strong>

                    expected evaluations.
                  </p>

                  <div
                    class="mt-7 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
                  >
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-white/60"> Completion progress </span>

                      <span class="font-semibold text-white">
                        {{ submitted }}/{{ expectedTotalEvaluations }}
                      </span>
                    </div>

                    <div
                      class="mt-3 h-3 overflow-hidden rounded-full bg-white/10"
                    >
                      <div
                        class="h-full rounded-full bg-gradient-to-r from-primary-400 to-emerald-400 transition-all duration-700"
                        :style="{
                          width: `${completionPercentage}%`,
                        }"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- STATUS DETAILS -->

              <div class="p-6 sm:p-7">
                <div
                  class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <h2
                      class="text-base font-semibold text-gray-900 dark:text-white"
                    >
                      Evaluation Status
                    </h2>

                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Summary of your evaluation completion status.
                    </p>
                  </div>

                  <UBadge :color="completionBadgeColor" variant="subtle">
                    {{ completionStatus }}
                  </UBadge>
                </div>

                <div class="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div
                    class="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20"
                  >
                    <div class="flex items-center justify-between">
                      <div
                        class="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                      >
                        <UIcon
                          name="i-lucide-circle-check-big"
                          class="size-5"
                        />
                      </div>

                      <span
                        class="text-2xl font-bold text-emerald-700 dark:text-emerald-400"
                      >
                        {{ submitted }}
                      </span>
                    </div>

                    <p
                      class="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200"
                    >
                      Submitted
                    </p>

                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Evaluations successfully completed.
                    </p>
                  </div>

                  <div
                    class="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-900/60 dark:bg-amber-950/20"
                  >
                    <div class="flex items-center justify-between">
                      <div
                        class="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                      >
                        <UIcon name="i-lucide-clock-3" class="size-5" />
                      </div>

                      <span
                        class="text-2xl font-bold text-amber-700 dark:text-amber-400"
                      >
                        {{ pending }}
                      </span>
                    </div>

                    <p
                      class="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200"
                    >
                      Pending
                    </p>

                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Evaluations still waiting for completion.
                    </p>
                  </div>
                </div>

                <div
                  v-if="pending > 0"
                  class="mt-5 rounded-2xl border border-primary-200 bg-primary-50/60 p-4 dark:border-primary-900/60 dark:bg-primary-950/20"
                >
                  <div class="flex items-start gap-3">
                    <div
                      class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400"
                    >
                      <UIcon name="i-lucide-lightbulb" class="size-4" />
                    </div>

                    <div>
                      <p
                        class="text-sm font-semibold text-gray-800 dark:text-gray-200"
                      >
                        You still have pending evaluations
                      </p>

                      <p
                        class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400"
                      >
                        Complete your remaining evaluations before the
                        evaluation period closes.
                      </p>

                      <UButton
                        to="/student/evaluate"
                        size="sm"
                        class="mt-3"
                        icon="i-lucide-arrow-right"
                      >
                        Continue Evaluating
                      </UButton>
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  class="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20"
                >
                  <div class="flex items-start gap-3">
                    <div
                      class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                    >
                      <UIcon name="i-lucide-party-popper" class="size-4" />
                    </div>

                    <div>
                      <p
                        class="text-sm font-semibold text-gray-800 dark:text-gray-200"
                      >
                        All evaluations completed
                      </p>

                      <p
                        class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400"
                      >
                        Thank you for providing meaningful feedback.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </section>

        <!-- =========================================================

          GUIDELINES AND QUICK ACTIONS

        ========================================================== -->

        <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <!-- QUICK ACTIONS -->

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
                  class="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400"
                >
                  <UIcon name="i-lucide-zap" class="size-5" />
                </div>

                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Quick Actions
                  </h3>

                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Access your evaluation pages.
                  </p>
                </div>
              </div>
            </template>

            <div class="space-y-3">
              <NuxtLink
                v-for="action in quickActions"
                :key="action.label"
                :to="action.to"
                class="group flex items-center gap-3 rounded-2xl border border-gray-200 p-4 transition-all hover:border-primary-300 hover:bg-primary-50/40 dark:border-gray-800 dark:hover:border-primary-700 dark:hover:bg-primary-950/20"
              >
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl"
                  :class="action.iconClass"
                >
                  <UIcon :name="action.icon" class="size-5" />
                </div>

                <div class="min-w-0 flex-1">
                  <p
                    class="text-sm font-semibold text-gray-800 dark:text-gray-200"
                  >
                    {{ action.label }}
                  </p>

                  <p class="mt-0.5 text-xs text-gray-400">
                    {{ action.description }}
                  </p>
                </div>

                <UIcon
                  name="i-lucide-chevron-right"
                  class="size-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-primary-500"
                />
              </NuxtLink>
            </div>
          </UCard>

          <!-- EVALUATION GUIDELINES -->

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
                  class="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                >
                  <UIcon name="i-lucide-notebook-tabs" class="size-5" />
                </div>

                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Evaluation Guidelines
                  </h3>

                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Helpful reminders before submitting feedback.
                  </p>
                </div>
              </div>
            </template>

            <div class="space-y-4">
              <div
                v-for="(guideline, index) in evaluationGuidelines"
                :key="guideline.title"
                class="flex items-start gap-3"
              >
                <div
                  class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  {{ index + 1 }}
                </div>

                <div>
                  <p
                    class="text-sm font-semibold text-gray-800 dark:text-gray-200"
                  >
                    {{ guideline.title }}
                  </p>

                  <p
                    class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400"
                  >
                    {{ guideline.description }}
                  </p>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- =========================================================

          RECENT SUBMISSIONS

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
                  class="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                >
                  <UIcon name="i-lucide-history" class="size-5" />
                </div>

                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Recent Submissions
                  </h3>

                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Your latest Student → Faculty evaluations for the active
                    period.
                  </p>
                </div>
              </div>

              <UBadge color="neutral" variant="subtle">
                Latest {{ recentEvaluations.length }}
              </UBadge>
            </div>
          </template>

          <div v-if="recentEvaluations.length" class="overflow-x-auto">
            <table class="w-full min-w-[760px] text-sm">
              <thead
                class="border-b border-gray-200 bg-gray-50/80 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
              >
                <tr>
                  <th class="px-5 py-3 text-left font-semibold">
                    Evaluation Target
                  </th>

                  <th class="px-5 py-3 text-left font-semibold">Subject</th>

                  <th class="px-5 py-3 text-center font-semibold">Status</th>

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

                      <div>
                        <p class="font-medium text-gray-800 dark:text-gray-200">
                          {{ evaluation.target }}
                        </p>

                        <p class="mt-0.5 text-xs text-gray-400">
                          Student → Faculty
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {{ evaluation.subject }}
                  </td>

                  <td class="px-5 py-4 text-center">
                    <UBadge color="success" variant="subtle">
                      Submitted
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
              No evaluation submissions yet
            </p>

            <p class="mt-1 text-xs text-gray-400">
              Your completed evaluations will appear here.
            </p>

            <UButton
              to="/student/evaluate"
              icon="i-lucide-clipboard-pen-line"
              size="sm"
              class="mt-4"
            >
              Start Evaluation
            </UButton>
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

/* =========================================================
   STATE
========================================================= */

const loading = ref(true);

const studentRecord = ref<any>(null);

const evaluations = ref<any[]>([]);

const teacherAssignments = ref<any[]>([]);

const activePeriod = ref<any>(null);

const lastUpdatedAt = ref<Date | null>(null);

/* =========================================================
   STUDENT INFORMATION
========================================================= */

const studentDisplayName = computed(() => {
  return (
    studentRecord.value?.name ||
    studentRecord.value?.full_name ||
    user.value?.full_name ||
    user.value?.name ||
    user.value?.username ||
    "Student"
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
   ACTIVE ACADEMIC PERIOD
========================================================= */

const activeSemester = computed(() => activePeriod.value?.semester || "");

const activeSchoolYear = computed(() => activePeriod.value?.school_year || "");

const activePeriodLabel = computed(() => {
  if (!activeSemester.value || !activeSchoolYear.value) {
    return "No active academic period";
  }

  return `${activeSemester.value} · ${activeSchoolYear.value}`;
});

/* =========================================================
   CURRENT-PERIOD EVALUATION TOTALS
========================================================= */

/*
 * One current teacher assignment represents one expected
 * Student → Faculty evaluation for the active academic period.
 */
const expectedTotalEvaluations = computed(
  () => teacherAssignments.value.length,
);

const submitted = computed(() => evaluations.value.length);

const pending = computed(() =>
  Math.max(0, expectedTotalEvaluations.value - submitted.value),
);

const completionPercentage = computed(() => {
  if (!expectedTotalEvaluations.value) {
    return 0;
  }

  const percentage = (submitted.value / expectedTotalEvaluations.value) * 100;

  return Math.min(100, Math.max(0, Math.round(percentage)));
});

const completionStatus = computed(() => {
  if (!activePeriod.value) {
    return "No Active Period";
  }

  if (!expectedTotalEvaluations.value) {
    return "No Assignments";
  }

  if (completionPercentage.value >= 100) {
    return "Completed";
  }

  if (completionPercentage.value > 0) {
    return "In Progress";
  }

  return "Not Started";
});

const completionBadgeColor = computed(() => {
  if (completionPercentage.value >= 100) {
    return "success";
  }

  if (completionPercentage.value > 0) {
    return "warning";
  }

  return "neutral";
});

/* =========================================================
   STATISTIC CARDS
========================================================= */

const studentStats = computed(() => [
  {
    label: "Assigned Teachers",
    value: teacherAssignments.value.length.toLocaleString(),
    description: "Faculty assigned for the active academic period",
    icon: "i-lucide-users-round",
    iconClass:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    decoration: "bg-violet-500",
    accentClass: "bg-violet-500",
    badge: "Current Period",
    suffix: "",
    footerLabel: "Academic period",
    footerValue: activeSemester.value || "Not Active",
    footerIcon: "i-lucide-calendar-range",
    footerClass: "text-violet-600 dark:text-violet-400",
  },
  {
    label: "Submitted",
    value: submitted.value.toLocaleString(),
    description: "Faculty evaluations completed this period",
    icon: "i-lucide-circle-check-big",
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    decoration: "bg-emerald-500",
    accentClass: "bg-emerald-500",
    badge: "Completed",
    suffix: "",
    footerLabel: "Submission status",
    footerValue: submitted.value ? "Recorded" : "No Submissions",
    footerIcon: submitted.value ? "i-lucide-database" : "i-lucide-circle-minus",
    footerClass: submitted.value
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-gray-400",
  },
  {
    label: "Pending",
    value: pending.value.toLocaleString(),
    description: "Assigned faculty still waiting for evaluation",
    icon: "i-lucide-clock-3",
    iconClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    decoration: "bg-amber-500",
    accentClass: "bg-amber-500",
    badge: "Remaining",
    suffix: "",
    footerLabel: "Action required",
    footerValue: pending.value ? "Complete Now" : "None",
    footerIcon: pending.value
      ? "i-lucide-triangle-alert"
      : "i-lucide-circle-check",
    footerClass: pending.value
      ? "text-amber-600 dark:text-amber-400"
      : "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Completion",
    value: completionPercentage.value,
    description: "Current-period evaluation completion",
    icon: "i-lucide-chart-no-axes-combined",
    iconClass:
      "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    decoration: "bg-blue-500",
    accentClass: "bg-blue-500",
    badge: "Progress",
    suffix: "%",
    footerLabel: "Current status",
    footerValue: completionStatus.value,
    footerIcon:
      completionPercentage.value >= 100
        ? "i-lucide-party-popper"
        : "i-lucide-activity",
    footerClass:
      completionPercentage.value >= 100
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-blue-600 dark:text-blue-400",
  },
]);

/* =========================================================
   QUICK ACTIONS
========================================================= */

const quickActions = [
  {
    label: "Start Evaluation",
    description: "Open available faculty evaluations",
    to: "/student/evaluate",
    icon: "i-lucide-clipboard-pen-line",
    iconClass:
      "bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400",
  },
  {
    label: "My Teachers",
    description: "Manage teachers for the active academic period",
    to: "/student/my-teachers",
    icon: "i-lucide-users-round",
    iconClass:
      "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  },
  {
    label: "Evaluation History",
    description: "Review your submitted evaluations",
    to: "/student/my-evaluations",
    icon: "i-lucide-history",
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  {
    label: "School Feedback",
    description: "Submit overall school feedback",
    to: "/student/overall-performance",
    icon: "i-lucide-school",
    iconClass:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  },
];

/* =========================================================
   EVALUATION GUIDELINES
========================================================= */

const evaluationGuidelines = [
  {
    title: "Provide honest feedback",
    description:
      "Base your ratings and comments on your actual classroom experience.",
  },
  {
    title: "Remain respectful",
    description:
      "Use professional and constructive language in written comments.",
  },
  {
    title: "Review before submitting",
    description:
      "Check your answers carefully because submitted evaluations may not be editable.",
  },
  {
    title: "Complete evaluations on time",
    description:
      "Submit all assigned evaluations before the evaluation period closes.",
  },
];

/* =========================================================
   RECENT EVALUATIONS
========================================================= */

const recentEvaluations = computed(() =>
  evaluations.value.slice(0, 10).map((evaluation: any) => ({
    id:
      evaluation.documentId ||
      evaluation.id ||
      `${evaluation.createdAt}-${evaluation.teacher?.name}`,

    target:
      evaluation.teacher?.name ||
      evaluation.dean_coordinator?.name ||
      "Unknown Faculty",

    subject:
      evaluation.subject?.name ||
      evaluation.subject?.subject_name ||
      "No Subject",

    date: formatDate(evaluation.createdAt),
  })),
);

/* =========================================================
   DISPLAY HELPERS
========================================================= */

const formatDate = (value: string) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getInitials = (name: string) => {
  if (!name) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part: string) => part.charAt(0).toUpperCase())
    .join("");
};

/* =========================================================
   LOAD STUDENT RECORD
========================================================= */

const getStudentRecord = async () => {
  const userId = user.value?.id || user.value?.documentId;

  if (!userId) {
    studentRecord.value = null;
    return;
  }

  const response = await $api("/students", {
    query: {
      "filters[user][id][$eq]": userId,

      "populate[user]": true,

      "populate[course]": true,

      "pagination[pageSize]": 1,
    },
  });

  studentRecord.value = response.data?.[0] || null;
};

/* =========================================================
   LOAD CURRENT TEACHER ASSIGNMENTS
========================================================= */

const getTeacherAssignments = async () => {
  const authenticatedUserId = user.value?.id || user.value?.documentId;

  if (!authenticatedUserId) {
    teacherAssignments.value = [];
    activePeriod.value = null;
    return;
  }

  const response: any = await $api("/student-teacher-assignments/me");

  teacherAssignments.value = response?.data || [];

  activePeriod.value = response?.active_period || null;

  /*
   * The secure assignment endpoint already resolves
   * the logged-in Student. Use it as a safe fallback.
   */
  if (!studentRecord.value && response?.student) {
    studentRecord.value = response.student;
  }
};

/* =========================================================
   LOAD CURRENT-PERIOD STUDENT EVALUATIONS
========================================================= */

const getEvaluations = async () => {
  const authenticatedUserId = user.value?.id || user.value?.documentId;

  if (
    !authenticatedUserId ||
    !activeSemester.value ||
    !activeSchoolYear.value
  ) {
    evaluations.value = [];
    return;
  }

  const response = await $api("/evaluations", {
    query: {
      "filters[evaluator_user][id][$eq]": authenticatedUserId,

      "filters[batch][evaluation_type][code][$eq]": "student-faculty",

      "filters[batch][semester][$eq]": activeSemester.value,

      "filters[batch][school_year][$eq]": activeSchoolYear.value,

      "populate[teacher]": true,

      "populate[subject]": true,

      "populate[evaluator_user]": true,

      "populate[batch][populate][0]": "evaluation_type",

      "sort[0]": "createdAt:desc",

      "pagination[pageSize]": 500,
    },
  });

  evaluations.value = response.data || [];
};

/* =========================================================
   LOAD DASHBOARD
========================================================= */

const loadDashboard = async () => {
  try {
    loading.value = true;

    await getStudentRecord();

    /*
     * Load assignments first because they provide
     * the active academic period required by the
     * evaluation query.
     */
    await getTeacherAssignments();

    await getEvaluations();

    lastUpdatedAt.value = new Date();
  } catch (error: any) {
    console.error("Student dashboard loading error:", error);

    studentRecord.value = null;
    evaluations.value = [];
    teacherAssignments.value = [];
    activePeriod.value = null;

    toast.add({
      title: "Unable to load dashboard",

      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Your student evaluation information could not be retrieved.",

      icon: "i-lucide-triangle-alert",

      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

/* =========================================================
   AUTH / INITIAL LOAD
========================================================= */

watch(
  user,
  async (value) => {
    if (value?.id) {
      await loadDashboard();
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
