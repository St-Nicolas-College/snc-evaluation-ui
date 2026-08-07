<template>
  <div class="space-y-6 pb-10">
    <!-- PAGE HEADER -->
    <section
      class="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-800 px-6 py-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] sm:px-8"
    >
      <div
        class="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
      />

      <div
        class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-cyan-300/10 blur-3xl"
      />

      <div
        class="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"
      >
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-100"
            >
              Ranking Configuration
            </span>

            <span
              class="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100"
            >
              New Scheme
            </span>
          </div>

          <h1 class="mt-4 text-3xl font-black tracking-tight sm:text-[34px]">
            Create Ranking Scheme
          </h1>

          <p class="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
            Create a new faculty ranking configuration including academic year,
            evaluation limits, effective dates, total points, and scheme status.
          </p>
        </div>

        <UButton
          to="/hr/ranking-schemes"
          color="neutral"
          variant="soft"
          icon="i-lucide-arrow-left"
        >
          Back to Schemes
        </UButton>
      </div>
    </section>

    <!-- FORM -->
    <UForm
      :state="form"
      class="space-y-6"
      @submit="saveScheme"
    >
      <!-- BASIC INFORMATION -->
      <section
        class="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-6 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
            >
              <UIcon name="i-lucide-layers-3" class="size-5" />
            </div>

            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
              >
                Step 1
              </p>

              <h2 class="mt-1 font-black text-gray-900 dark:text-white">
                Basic Configuration
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Define the identity and academic year of this ranking scheme.
              </p>
            </div>
          </div>
        </div>

        <div class="grid gap-5 p-6 md:grid-cols-2">
          <UFormField
            label="Scheme Name"
            required
            class="md:col-span-2"
          >
            <UInput
              v-model="form.name"
              icon="i-lucide-signature"
              placeholder="SNC Faculty Ranking Scheme 2026"
              class="w-full"
            />

            <template #hint>
              The scheme code is automatically generated from this name.
            </template>
          </UFormField>

          <UFormField
            label="Version"
            required
          >
            <UInput
              v-model="form.version"
              icon="i-lucide-git-branch"
              placeholder="1.0"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Academic Year"
            required
          >
            <UInput
              v-model="form.academic_year"
              icon="i-lucide-calendar-days"
              placeholder="2026-2027"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Generated Scheme Code"
            class="md:col-span-2"
          >
            <UInput
              :model-value="form.code"
              icon="i-lucide-hash"
              disabled
              class="w-full"
            />

            <template #hint>
              Generated automatically and submitted to Strapi as the required UID.
            </template>
          </UFormField>

          <UFormField
            label="Description"
            class="md:col-span-2"
          >
            <UTextarea
              v-model="form.description"
              :rows="4"
              placeholder="Describe the purpose of this ranking scheme..."
              class="w-full"
            />
          </UFormField>
        </div>
      </section>

      <!-- EFFECTIVE PERIOD -->
      <section
        class="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-emerald-50/40 px-6 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/10"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
            >
              <UIcon name="i-lucide-calendar-range" class="size-5" />
            </div>

            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400"
              >
                Step 2
              </p>

              <h2 class="mt-1 font-black text-gray-900 dark:text-white">
                Effective Period and Status
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Set the validity period and whether this scheme is available for ranking.
              </p>
            </div>
          </div>
        </div>

        <div class="grid gap-5 p-6 md:grid-cols-2">
          <UFormField
            label="Effective Date"
            required
          >
            <UInput
              v-model="form.effective_date"
              type="date"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Expiration Date">
            <UInput
              v-model="form.expiration_date"
              type="date"
              class="w-full"
            />

            <template #hint>
              Leave blank if there is no predetermined expiration date.
            </template>
          </UFormField>

          <UFormField
            label="Scheme Status"
            required
          >
            <USelectMenu
              v-model="form.scheme_status"
              :items="statusOptions"
              value-key="value"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Scheme Availability">
            <div
              class="flex min-h-[76px] items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50/60 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex size-9 shrink-0 items-center justify-center rounded-xl"
                  :class="
                    form.is_active
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  "
                >
                  <UIcon
                    :name="
                      form.is_active
                        ? 'i-lucide-circle-check-big'
                        : 'i-lucide-circle-pause'
                    "
                    class="size-4"
                  />
                </div>

                <div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ form.is_active ? "Active Scheme" : "Inactive Scheme" }}
                  </p>

                  <p class="mt-0.5 text-xs leading-5 text-gray-500">
                    {{
                      form.is_active
                        ? "This scheme can be used for ranking computation."
                        : "This scheme will not be used for ranking computation."
                    }}
                  </p>
                </div>
              </div>

              <USwitch v-model="form.is_active" />
            </div>
          </UFormField>
        </div>

        <div
          v-if="form.is_active"
          class="mx-6 mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20"
        >
          <div class="flex items-start gap-3">
            <UIcon
              name="i-lucide-shield-check"
              class="mt-0.5 size-5 shrink-0 text-emerald-600"
            />

            <div>
              <p
                class="text-sm font-bold text-emerald-900 dark:text-emerald-200"
              >
                This scheme will be active after creation
              </p>

              <p
                class="mt-1 text-xs leading-5 text-emerald-700 dark:text-emerald-300"
              >
                Ranking computation can reference this configuration immediately after it is saved.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- EVALUATION CONFIGURATION -->
      <section
        class="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-violet-50/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950/10"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20"
            >
              <UIcon name="i-lucide-calculator" class="size-5" />
            </div>

            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400"
              >
                Step 3
              </p>

              <h2 class="mt-1 font-black text-gray-900 dark:text-white">
                Evaluation Point Limits
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                The Evaluation Max value is calculated automatically.
              </p>
            </div>
          </div>

          <div
            class="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2 text-right dark:border-violet-900 dark:bg-violet-950/20"
          >
            <p
              class="text-[9px] font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400"
            >
              Evaluation Max
            </p>

            <p
              class="mt-0.5 text-xl font-black text-violet-900 dark:text-violet-100"
            >
              {{ formatPoints(evaluationMaxPoints) }}
            </p>
          </div>
        </div>

        <div class="grid gap-4 p-6 md:grid-cols-3">
          <!-- STUDENT -->
          <div
            class="rounded-[22px] border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-950/30"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
              >
                <UIcon name="i-lucide-graduation-cap" class="size-5" />
              </div>

              <div>
                <p class="text-sm font-bold text-gray-900 dark:text-white">
                  Student Evaluation
                </p>

                <p class="mt-1 text-xs leading-5 text-gray-500">
                  Maximum points from student evaluation.
                </p>
              </div>
            </div>

            <UInput
              v-model.number="form.student_evaluation_max_points"
              type="number"
              min="0"
              step="0.01"
              class="mt-4 w-full"
            />
          </div>

          <!-- IMMEDIATE SUPERIOR -->
          <div
            class="rounded-[22px] border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-950/30"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
              >
                <UIcon name="i-lucide-user-round-check" class="size-5" />
              </div>

              <div>
                <p class="text-sm font-bold text-gray-900 dark:text-white">
                  Immediate Superior
                </p>

                <p class="mt-1 text-xs leading-5 text-gray-500">
                  Maximum points from immediate superior evaluation.
                </p>
              </div>
            </div>

            <UInput
              v-model.number="form.immediate_superior_max_points"
              type="number"
              min="0"
              step="0.01"
              class="mt-4 w-full"
            />
          </div>

          <!-- HR -->
          <div
            class="rounded-[22px] border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-950/30"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
              >
                <UIcon name="i-lucide-briefcase-business" class="size-5" />
              </div>

              <div>
                <p class="text-sm font-bold text-gray-900 dark:text-white">
                  HR Evaluation
                </p>

                <p class="mt-1 text-xs leading-5 text-gray-500">
                  Maximum points from HR evaluation.
                </p>
              </div>
            </div>

            <UInput
              v-model.number="form.hr_evaluation_max_points"
              type="number"
              min="0"
              step="0.01"
              class="mt-4 w-full"
            />
          </div>
        </div>

        <!-- FORMULA -->
        <div
          class="mx-6 mb-6 rounded-[22px] border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-indigo-50 p-5 dark:border-violet-900 dark:from-violet-950/20 dark:via-gray-900 dark:to-indigo-950/10"
        >
          <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400"
              >
                Automatic Calculation
              </p>

              <p class="mt-2 text-lg font-black text-gray-900 dark:text-white">
                {{ formatPoints(form.student_evaluation_max_points) }}
                <span class="mx-1 text-gray-400">+</span>
                {{ formatPoints(form.immediate_superior_max_points) }}
                <span class="mx-1 text-gray-400">+</span>
                {{ formatPoints(form.hr_evaluation_max_points) }}
                <span class="mx-1 text-gray-400">=</span>
                <span class="text-violet-600 dark:text-violet-400">
                  {{ formatPoints(evaluationMaxPoints) }}
                </span>
              </p>

              <p class="mt-1 text-xs text-gray-500">
                Student + Immediate Superior + HR Evaluation
              </p>
            </div>

            <div
              class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-2xl font-black text-white shadow-lg shadow-violet-600/20"
            >
              {{ formatPoints(evaluationMaxPoints) }}
            </div>
          </div>
        </div>
      </section>

      <!-- TOTAL POINTS / REMARKS -->
      <section
        class="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-amber-50/40 px-6 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/10"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-11 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20"
            >
              <UIcon name="i-lucide-notebook-pen" class="size-5" />
            </div>

            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400"
              >
                Step 4
              </p>

              <h2 class="mt-1 font-black text-gray-900 dark:text-white">
                Total Points and Notes
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Define the overall ranking-point ceiling and optional notes.
              </p>
            </div>
          </div>
        </div>

        <div class="grid gap-5 p-6 md:grid-cols-2">
          <UFormField label="Total Maximum Points">
            <div
              class="rounded-2xl border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                >
                  <UIcon name="i-lucide-gauge" class="size-5" />
                </div>

                <UInput
                  v-model.number="form.total_max_points"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="100"
                  class="w-full"
                />
              </div>

              <p class="mt-3 text-xs leading-5 text-gray-500">
                Maximum possible ranking points for the entire ranking scheme.
              </p>
            </div>
          </UFormField>

          <UFormField label="Remarks">
            <UTextarea
              v-model="form.remarks"
              :rows="5"
              placeholder="Optional configuration notes..."
              class="w-full"
            />
          </UFormField>
        </div>
      </section>

      <!-- CONFIGURATION PREVIEW -->
      <section
        class="relative overflow-hidden rounded-[26px] border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-5 shadow-sm dark:border-blue-900 dark:from-blue-950/20 dark:via-gray-900 dark:to-cyan-950/10"
      >
        <div
          class="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-blue-500/10 blur-3xl"
        />

        <div class="relative">
          <div
            class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400"
              >
                Configuration Preview
              </p>

              <h2 class="mt-1 font-black text-gray-900 dark:text-white">
                Scheme Summary
              </h2>
            </div>

            <UBadge
              :color="form.is_active ? 'success' : 'neutral'"
              variant="subtle"
            >
              {{ form.is_active ? "Will be Active" : "Will be Inactive" }}
            </UBadge>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div
              class="rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 shadow-sm dark:border-blue-900 dark:bg-gray-900/70"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-calendar-days"
                  class="size-4 text-blue-500"
                />

                <p
                  class="text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400"
                >
                  Academic Year
                </p>
              </div>

              <p
                class="mt-2 truncate font-black text-gray-900 dark:text-white"
              >
                {{ form.academic_year || "Not specified" }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 shadow-sm dark:border-blue-900 dark:bg-gray-900/70"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-git-branch"
                  class="size-4 text-blue-500"
                />

                <p
                  class="text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400"
                >
                  Version
                </p>
              </div>

              <p
                class="mt-2 truncate font-black text-gray-900 dark:text-white"
              >
                {{ form.version || "Not specified" }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 shadow-sm dark:border-blue-900 dark:bg-gray-900/70"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-calculator"
                  class="size-4 text-blue-500"
                />

                <p
                  class="text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400"
                >
                  Evaluation Max
                </p>
              </div>

              <p
                class="mt-2 truncate font-black text-gray-900 dark:text-white"
              >
                {{ formatPoints(evaluationMaxPoints) }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 shadow-sm dark:border-blue-900 dark:bg-gray-900/70"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-gauge"
                  class="size-4 text-blue-500"
                />

                <p
                  class="text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400"
                >
                  Total Max
                </p>
              </div>

              <p
                class="mt-2 truncate font-black text-gray-900 dark:text-white"
              >
                {{ formatPoints(form.total_max_points) }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 shadow-sm dark:border-blue-900 dark:bg-gray-900/70"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-badge-check"
                  class="size-4 text-blue-500"
                />

                <p
                  class="text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400"
                >
                  Status
                </p>
              </div>

              <p
                class="mt-2 truncate font-black text-gray-900 dark:text-white"
              >
                {{ formatStatus(form.scheme_status) }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ACTIONS -->
      <div
        class="rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p
              class="text-sm font-semibold text-gray-900 dark:text-white"
            >
              Create this ranking scheme
            </p>

            <p class="mt-0.5 text-xs text-gray-500">
              Review the configuration above before saving.
            </p>
          </div>

          <div class="flex flex-col-reverse gap-2 sm:flex-row">
            <UButton
              to="/hr/ranking-schemes"
              color="neutral"
              variant="soft"
              :disabled="saving"
            >
              Cancel
            </UButton>

            <UButton
              type="submit"
              icon="i-lucide-save"
              :loading="saving"
            >
              Create Ranking Scheme
            </UButton>
          </div>
        </div>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  middleware: ["auth", "role"],
  role: ["HR", "Admin"],
})

const { $api } = useNuxtApp()

const router = useRouter()
const toast = useToast()

const saving = ref(false)

const form = reactive({
  name: "",
  code: "",

  version: "1.0",

  description: "",

  effective_date: "",
  expiration_date: "",

  academic_year: "",

  is_active: false,

  scheme_status: "draft",

  student_evaluation_max_points: 5,

  immediate_superior_max_points: 4,

  hr_evaluation_max_points: 4,

  total_max_points: 100,

  remarks: "",
})

const statusOptions = [
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Archived",
    value: "archived",
  },
]

const slugify = (
  value: string,
) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    )

const evaluationMaxPoints = computed(() => {
  const student =
    Number(
      form.student_evaluation_max_points ||
        0,
    )

  const superior =
    Number(
      form.immediate_superior_max_points ||
        0,
    )

  const hr =
    Number(
      form.hr_evaluation_max_points ||
        0,
    )

  return (
    student +
    superior +
    hr
  )
})

const formatPoints = (
  value: unknown,
) => {
  const parsed =
    Number(value ?? 0)

  if (
    !Number.isFinite(parsed)
  ) {
    return "0"
  }

  return Number.isInteger(parsed)
    ? String(parsed)
    : parsed
        .toFixed(2)
        .replace(
          /\.?0+$/,
          "",
        )
}

const formatStatus = (
  value: string,
) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    )

const validate = () => {
  if (!form.name.trim()) {
    return "Scheme name is required."
  }

  if (!form.code.trim()) {
    return "Scheme code is required."
  }

  if (!form.version.trim()) {
    return "Version is required."
  }

  if (
    !form.academic_year.trim()
  ) {
    return "Academic year is required."
  }

  if (!form.effective_date) {
    return "Effective date is required."
  }

  if (
    form.expiration_date &&
    new Date(
      form.expiration_date,
    ).getTime() <
      new Date(
        form.effective_date,
      ).getTime()
  ) {
    return "Expiration date cannot be earlier than the effective date."
  }

  const numericFields = [
    form.student_evaluation_max_points,
    form.immediate_superior_max_points,
    form.hr_evaluation_max_points,
    form.total_max_points,
  ]

  if (
    numericFields.some(
      (value) =>
        !Number.isFinite(
          Number(value),
        ) ||
        Number(value) < 0,
    )
  ) {
    return "Point values must be valid numbers greater than or equal to zero."
  }

  return ""
}

const saveScheme = async () => {
  const validationError =
    validate()

  if (validationError) {
    toast.add({
      title:
        "Unable to create scheme",

      description:
        validationError,

      color: "error",

      icon:
        "i-lucide-triangle-alert",
    })

    return
  }

  saving.value = true

  try {
    const payload = {
      name:
        form.name.trim(),

      code:
        form.code.trim(),

      version:
        form.version.trim(),

      description:
        form.description.trim() ||
        null,

      effective_date:
        form.effective_date,

      expiration_date:
        form.expiration_date ||
        null,

      academic_year:
        form.academic_year.trim(),

      is_active:
        Boolean(
          form.is_active,
        ),

      scheme_status:
        form.scheme_status,

      evaluation_max_points:
        evaluationMaxPoints.value,

      student_evaluation_max_points:
        Number(
          form.student_evaluation_max_points ||
            0,
        ),

      immediate_superior_max_points:
        Number(
          form.immediate_superior_max_points ||
            0,
        ),

      hr_evaluation_max_points:
        Number(
          form.hr_evaluation_max_points ||
            0,
        ),

      total_max_points:
        Number(
          form.total_max_points ||
            0,
        ),

      remarks:
        form.remarks.trim() ||
        null,
    }

    const response: any =
      await $api(
        "/ranking-schemes",
        {
          method: "POST",

          body: {
            data: payload,
          },
        },
      )

    const created =
      response?.data

    toast.add({
      title:
        "Ranking scheme created",

      description:
        `${form.name} was created successfully.`,

      color: "success",

      icon:
        "i-lucide-circle-check-big",
    })

    if (
      created?.documentId
    ) {
      await router.push(
        `/hr/ranking-schemes/${created.documentId}`,
      )

      return
    }

    await router.push(
      "/hr/ranking-schemes",
    )
  } catch (error: any) {
    console.error(
      "Ranking scheme create error:",
      error,
    )

    toast.add({
      title:
        "Unable to create ranking scheme",

      description:
        error?.data?.error
          ?.message ||
        error?.data?.message ||
        error?.message ||
        "The ranking scheme could not be created.",

      color: "error",

      icon:
        "i-lucide-triangle-alert",
    })
  } finally {
    saving.value = false
  }
}

// Automatically generate required UID from the scheme name.
watch(
  () =>
    form.name,
  (name) => {
    form.code =
      slugify(name)
  },
)

// Keep status and is_active synchronized.
watch(
  () =>
    form.scheme_status,
  (status) => {
    if (
      status === "active"
    ) {
      form.is_active = true
    }

    if (
      status === "archived"
    ) {
      form.is_active = false
    }
  },
)

watch(
  () =>
    form.is_active,
  (active) => {
    if (
      active &&
      form.scheme_status ===
        "draft"
    ) {
      form.scheme_status =
        "active"
    }

    if (
      !active &&
      form.scheme_status ===
        "active"
    ) {
      form.scheme_status =
        "draft"
    }
  },
)
</script>
