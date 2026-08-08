<template>
  <div class="space-y-6 pb-10">
    <section
      class="relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-slate-950 via-emerald-900 to-teal-800 px-6 py-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:px-8"
    >
      <div class="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-emerald-300/10 blur-3xl" />

      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div class="max-w-4xl">
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100">
              Rank Band Management
            </span>

            <span
              v-if="scheme"
              class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-100"
            >
              {{ scheme.academic_year || "Current Scheme" }}
            </span>
          </div>

          <h1 class="mt-4 text-3xl font-black tracking-tight sm:text-[36px]">
            Create Rank Band
          </h1>

          <p v-if="scheme" class="mt-2 text-sm font-semibold text-emerald-100">
            {{ scheme.name }}
          </p>

          <p class="mt-3 max-w-3xl text-sm leading-6 text-emerald-100">
            Define a faculty rank level, portfolio-point range, educational
            requirement, salary-rate range, sequence, and availability.
          </p>
        </div>

        <UButton
          :to="`/hr/ranking-schemes/${documentId}/rank-bands`"
          color="neutral"
          variant="soft"
          icon="i-lucide-arrow-left"
        >
          Back to Rank Bands
        </UButton>
      </div>
    </section>

    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-64 rounded-[28px]" />
      <USkeleton class="h-72 rounded-[28px]" />
    </div>

    <section
      v-else-if="loadError"
      class="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <UIcon name="i-lucide-triangle-alert" class="mx-auto size-10 text-red-600" />
      <h2 class="mt-4 font-bold text-gray-900 dark:text-white">Unable to load ranking scheme</h2>
      <p class="mt-2 text-sm text-gray-500">{{ loadError }}</p>
      <UButton class="mt-5" icon="i-lucide-refresh-cw" @click="loadData">Try Again</UButton>
    </section>

    <UForm v-else-if="scheme" :state="form" class="space-y-6" @submit="saveRankBand">
      <section class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-emerald-50/40 px-6 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/10">
          <div class="flex items-center gap-3">
            <div class="flex size-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
              <UIcon name="i-lucide-award" class="size-5" />
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">Step 1</p>
              <h2 class="mt-1 font-black text-gray-900 dark:text-white">Rank Identity</h2>
              <p class="mt-1 text-xs text-gray-500">Select the rank family and level shown in faculty ranking results.</p>
            </div>
          </div>
        </div>

        <div class="grid gap-5 p-6 md:grid-cols-2">
          <UFormField label="Rank Name" required>
            <USelectMenu
              v-model="form.rank_name"
              :items="rankNameOptions"
              value-key="value"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Rank Level" required>
            <UInput
              v-model.number="form.rank_level"
              type="number"
              min="1"
              step="1"
              icon="i-lucide-list-ordered"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Educational Requirement" class="md:col-span-2">
            <UTextarea
              v-model="form.educational_requirement"
              :rows="3"
              placeholder="Example: Master's degree or equivalent qualification"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="mx-6 mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
          <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">Rank Preview</p>
          <p class="mt-2 text-xl font-black text-gray-900 dark:text-white">{{ rankPreview }}</p>
        </div>
      </section>

      <section class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/40 px-6 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/10">
          <div class="flex items-center gap-3">
            <div class="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <UIcon name="i-lucide-gauge" class="size-5" />
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Step 2</p>
              <h2 class="mt-1 font-black text-gray-900 dark:text-white">Portfolio Point Range</h2>
              <p class="mt-1 text-xs text-gray-500">Define the score range for this rank band.</p>
            </div>
          </div>
        </div>

        <div class="grid gap-5 p-6 md:grid-cols-2">
          <UFormField label="Minimum Points" required>
            <UInput v-model.number="form.minimum_points" type="number" min="0" step="0.01" class="w-full" />
          </UFormField>

          <UFormField label="Maximum Points" required>
            <UInput v-model.number="form.maximum_points" type="number" min="0" step="0.01" class="w-full" />
          </UFormField>
        </div>

        <div class="mx-6 mb-6 flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/20">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Point Range Preview</p>
            <p class="mt-1 text-lg font-black text-gray-900 dark:text-white">
              {{ points(form.minimum_points) }} – {{ points(form.maximum_points) }}
            </p>
          </div>
          <UBadge :color="pointRangeValid ? 'success' : 'error'" variant="subtle">
            {{ pointRangeValid ? "Valid Range" : "Invalid Range" }}
          </UBadge>
        </div>
      </section>

      <section class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-amber-50/40 px-6 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/10">
          <div class="flex items-center gap-3">
            <div class="flex size-11 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <UIcon name="i-lucide-wallet-cards" class="size-5" />
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">Step 3</p>
              <h2 class="mt-1 font-black text-gray-900 dark:text-white">Salary Rate Range</h2>
              <p class="mt-1 text-xs text-gray-500">Configure the minimum and maximum salary rate for this rank.</p>
            </div>
          </div>
        </div>

        <div class="grid gap-5 p-6 md:grid-cols-2">
          <UFormField label="Minimum Rate" required>
            <UInput v-model.number="form.minimum_rate" type="number" min="0" step="0.01" class="w-full" />
          </UFormField>

          <UFormField label="Maximum Rate" required>
            <UInput v-model.number="form.maximum_rate" type="number" min="0" step="0.01" class="w-full" />
          </UFormField>
        </div>

        <div class="mx-6 mb-6 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900 dark:bg-amber-950/20">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">Salary Range Preview</p>
            <p class="mt-1 text-lg font-black text-gray-900 dark:text-white">
              {{ php(form.minimum_rate) }} – {{ php(form.maximum_rate) }}
            </p>
          </div>
          <UBadge :color="rateRangeValid ? 'success' : 'error'" variant="subtle">
            {{ rateRangeValid ? "Valid Range" : "Invalid Range" }}
          </UBadge>
        </div>
      </section>

      <section class="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-violet-50/40 px-6 py-5 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950/10">
          <div class="flex items-center gap-3">
            <div class="flex size-11 items-center justify-center rounded-2xl bg-violet-600 text-white">
              <UIcon name="i-lucide-settings-2" class="size-5" />
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">Step 4</p>
              <h2 class="mt-1 font-black text-gray-900 dark:text-white">Sequence and Availability</h2>
              <p class="mt-1 text-xs text-gray-500">Set display order and whether this band is active.</p>
            </div>
          </div>
        </div>

        <div class="grid gap-5 p-6 md:grid-cols-2">
          <UFormField label="Sequence" required>
            <UInput
              v-model.number="form.sequence"
              type="number"
              min="1"
              step="1"
              icon="i-lucide-arrow-down-1-0"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Rank Band Status">
            <div class="flex min-h-[76px] items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50/60 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/30">
              <div>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ form.is_active ? "Active Rank Band" : "Inactive Rank Band" }}
                </p>
                <p class="mt-0.5 text-xs text-gray-500">
                  {{ form.is_active ? "Available for automatic rank assignment." : "Excluded from automatic rank assignment." }}
                </p>
              </div>
              <USwitch v-model="form.is_active" />
            </div>
          </UFormField>
        </div>
      </section>

      <section class="rounded-[28px] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-5 dark:border-emerald-900 dark:from-emerald-950/20 dark:via-gray-900 dark:to-teal-950/10">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">Rank Band Preview</p>
            <h2 class="mt-1 text-xl font-black text-gray-900 dark:text-white">{{ rankPreview }}</h2>
            <p class="mt-2 text-sm text-gray-500">
              {{ points(form.minimum_points) }}–{{ points(form.maximum_points) }} points ·
              {{ php(form.minimum_rate) }}–{{ php(form.maximum_rate) }}
            </p>
          </div>

          <UBadge :color="form.is_active ? 'success' : 'neutral'" variant="subtle">
            {{ form.is_active ? "Active" : "Inactive" }}
          </UBadge>
        </div>
      </section>

      <div class="rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">Create this rank band</p>
            <p class="mt-0.5 text-xs text-gray-500">
              Duplicate ranks and overlapping active point ranges are checked before saving.
            </p>
          </div>

          <div class="flex flex-col-reverse gap-2 sm:flex-row">
            <UButton
              :to="`/hr/ranking-schemes/${documentId}/rank-bands`"
              color="neutral"
              variant="soft"
              :disabled="saving"
            >
              Cancel
            </UButton>

            <UButton type="submit" icon="i-lucide-save" :loading="saving">
              Create Rank Band
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

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const toast = useToast()

const loading = ref(false)
const saving = ref(false)
const loadError = ref("")

const scheme = ref<any>(null)
const existingBands = ref<any[]>([])

const documentId = computed(() =>
  String(route.params.documentId || "").trim(),
)

const form = reactive({
  rank_name: "instructor",
  rank_level: 1,
  educational_requirement: "",
  minimum_points: 0,
  maximum_points: 0,
  minimum_rate: 0,
  maximum_rate: 0,
  sequence: 1,
  is_active: true,
})

const rankNameOptions = [
  { label: "Instructor", value: "instructor" },
  { label: "Assistant Professor", value: "assistant_professor" },
  { label: "Associate Professor", value: "associate_professor" },
  { label: "Professor", value: "professor" },
]

const formatRankName = (value: string) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())

const rankPreview = computed(
  () => `${formatRankName(form.rank_name)} ${Number(form.rank_level || 1)}`,
)

const pointRangeValid = computed(() => {
  const min = Number(form.minimum_points)
  const max = Number(form.maximum_points)

  return (
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    min >= 0 &&
    max >= 0 &&
    min <= max
  )
})

const rateRangeValid = computed(() => {
  const min = Number(form.minimum_rate)
  const max = Number(form.maximum_rate)

  return (
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    min >= 0 &&
    max >= 0 &&
    min <= max
  )
})

const points = (value: unknown) => {
  const parsed = Number(value ?? 0)

  if (!Number.isFinite(parsed)) {
    return "0"
  }

  return Number.isInteger(parsed)
    ? String(parsed)
    : parsed.toFixed(2).replace(/\.?0+$/, "")
}

const php = (value: unknown) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return "PHP 0.00"
  }

  return `PHP ${new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed)}`
}

const duplicateRankExists = computed(() =>
  existingBands.value.some(
    (band: any) =>
      band.rank_name === form.rank_name &&
      Number(band.rank_level) === Number(form.rank_level),
  ),
)

const overlappingPointBand = computed(() => {
  const newMin = Number(form.minimum_points)
  const newMax = Number(form.maximum_points)

  if (!Number.isFinite(newMin) || !Number.isFinite(newMax)) {
    return null
  }

  return (
    existingBands.value.find((band: any) => {
      if (!band.is_active) {
        return false
      }

      const existingMin = Number(band.minimum_points)
      const existingMax = Number(band.maximum_points)

      if (!Number.isFinite(existingMin) || !Number.isFinite(existingMax)) {
        return false
      }

      return newMin <= existingMax && newMax >= existingMin
    }) || null
  )
})

const validate = () => {
  if (!form.rank_name) {
    return "Rank name is required."
  }

  if (!Number.isInteger(Number(form.rank_level)) || Number(form.rank_level) < 1) {
    return "Rank level must be a whole number greater than or equal to 1."
  }

  if (!pointRangeValid.value) {
    return "Minimum points must be less than or equal to maximum points."
  }

  if (!rateRangeValid.value) {
    return "Minimum rate must be less than or equal to maximum rate."
  }

  if (!Number.isInteger(Number(form.sequence)) || Number(form.sequence) < 1) {
    return "Sequence must be a whole number greater than or equal to 1."
  }

  if (duplicateRankExists.value) {
    return `${rankPreview.value} already exists in this ranking scheme.`
  }

  if (form.is_active && overlappingPointBand.value) {
    const band = overlappingPointBand.value

    return `The point range overlaps with ${formatRankName(
      band.rank_name,
    )} ${band.rank_level} (${points(band.minimum_points)}–${points(
      band.maximum_points,
    )}).`
  }

  return ""
}

const loadData = async () => {
  if (!documentId.value) {
    loadError.value = "Ranking scheme document ID is missing."
    return
  }

  loading.value = true
  loadError.value = ""

  try {
    const [schemeResponse, bandsResponse]: any[] = await Promise.all([
      $api(`/ranking-schemes/${documentId.value}`),

      $api("/rank-bands", {
        query: {
          "filters[ranking_scheme][documentId][$eq]": documentId.value,
          "pagination[page]": 1,
          "pagination[pageSize]": 1000,
          "sort[0]": "sequence:asc",
        },
      }),
    ])

    scheme.value = schemeResponse?.data || null
    existingBands.value = bandsResponse?.data || []

    if (!scheme.value) {
      loadError.value = "Ranking scheme was not found."
      return
    }

    if (existingBands.value.length) {
      const maxSequence = Math.max(
        ...existingBands.value.map((band: any) => Number(band.sequence || 0)),
      )

      form.sequence = maxSequence + 1
    }
  } catch (error: any) {
    console.error("Create rank band loading error:", error)

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to load ranking scheme information."
  } finally {
    loading.value = false
  }
}

const saveRankBand = async () => {
  const validationError = validate()

  if (validationError) {
    toast.add({
      title: "Unable to create rank band",
      description: validationError,
      color: "error",
      icon: "i-lucide-triangle-alert",
    })
    return
  }

  saving.value = true

  try {
    const payload = {
      rank_name: form.rank_name,
      rank_level: Number(form.rank_level),
      educational_requirement:
        form.educational_requirement.trim() || null,
      minimum_points: Number(form.minimum_points),
      maximum_points: Number(form.maximum_points),
      minimum_rate: Number(form.minimum_rate),
      maximum_rate: Number(form.maximum_rate),
      sequence: Number(form.sequence),
      is_active: Boolean(form.is_active),
      ranking_scheme: documentId.value,
    }

    await $api("/rank-bands", {
      method: "POST",
      body: {
        data: payload,
      },
    })

    toast.add({
      title: "Rank band created",
      description: `${rankPreview.value} was created successfully.`,
      color: "success",
      icon: "i-lucide-circle-check-big",
    })

    await router.push(
      `/hr/ranking-schemes/${documentId.value}/rank-bands`,
    )
  } catch (error: any) {
    console.error("Create rank band error:", error)

    toast.add({
      title: "Unable to create rank band",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "The rank band could not be created.",
      color: "error",
      icon: "i-lucide-triangle-alert",
    })
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>
