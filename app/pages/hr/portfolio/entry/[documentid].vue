<template>
  <div class="space-y-6 pb-10">
    <div class="flex items-center justify-between gap-3">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        to="/hr/portfolio/verification"
      >
        Back to Verification Queue
      </UButton>

      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-refresh-cw"
        :loading="loading"
        @click="loadEntry"
      >
        Refresh
      </UButton>
    </div>

    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-44 rounded-3xl" />
      <USkeleton class="h-[520px] rounded-3xl" />
    </div>

    <section
      v-else-if="loadError"
      class="rounded-2xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <UIcon
        name="i-lucide-triangle-alert"
        class="mx-auto size-9 text-red-600"
      />

      <h2 class="mt-4 font-bold">
        Unable to load portfolio entry
      </h2>

      <p class="mt-2 text-sm text-gray-500">
        {{ loadError }}
      </p>
    </section>

    <template v-else-if="entry">
      <section
        class="rounded-[28px] bg-gradient-to-br from-indigo-950 via-blue-950 to-cyan-950 px-6 py-7 text-white shadow-xl"
      >
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
          HR Portfolio Verification
        </p>

        <h1 class="mt-2 text-2xl font-black">
          {{ entry.title }}
        </h1>

        <p class="mt-2 text-sm text-blue-100">
          {{ facultyName }} · {{ facultyDepartment }}
        </p>

        <div class="mt-4 flex flex-wrap gap-2">
          <UBadge
            color="neutral"
            variant="subtle"
          >
            {{ formatStatus(entry.entry_type) }}
          </UBadge>

          <UBadge
            :color="statusColor(entry.verification_status)"
            variant="subtle"
          >
            {{ formatStatus(entry.verification_status) }}
          </UBadge>
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div class="space-y-4">
          <section
            class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <h2 class="font-bold">
              Entry Information
            </h2>

            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoBox
                label="Faculty / Dean"
                :value="facultyName"
              />
              <InfoBox
                label="Department"
                :value="facultyDepartment"
              />
              <InfoBox
                label="Institution"
                :value="entry.institution || 'N/A'"
              />
              <InfoBox
                label="Issuer"
                :value="entry.issuer || 'N/A'"
              />
              <InfoBox
                label="Date Earned"
                :value="formatDate(entry.date_earned)"
              />
              <InfoBox
                label="Quantity"
                :value="entry.quantity || 1"
              />
            </div>

            <p class="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {{ entry.description || 'No description provided.' }}
            </p>
          </section>

          <section
            class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <h2 class="font-bold">
                Supporting Evidence
              </h2>
            </div>

            <div
              v-if="!entry.evidence?.length"
              class="p-10 text-center text-sm text-gray-500"
            >
              No evidence attached.
            </div>

            <div
              v-else
              class="divide-y divide-gray-100 dark:divide-gray-800"
            >
              <div
                v-for="evidence in entry.evidence"
                :key="evidence.documentId || evidence.id"
                class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p class="font-semibold">
                    {{ evidence.title }}
                  </p>

                  <p class="mt-1 text-xs text-gray-500">
                    {{ formatStatus(evidence.evidence_type) }}
                    ·
                    {{ formatStatus(evidence.verification_status) }}
                  </p>
                </div>

                <UButton
                  v-if="fileUrl(evidence)"
                  :to="fileUrl(evidence)"
                  target="_blank"
                  size="xs"
                  color="neutral"
                  variant="soft"
                  icon="i-lucide-external-link"
                >
                  Open File
                </UButton>
              </div>
            </div>
          </section>
        </div>

        <div class="space-y-4">
          <section
            class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <h2 class="font-bold">
              HR Review Actions
            </h2>

            <p class="mt-2 text-sm text-gray-500">
              Review the supporting evidence before choosing an official action.
            </p>

            <div class="mt-5 grid gap-2">
              <UButton
                v-if="canReview"
                color="success"
                icon="i-lucide-badge-check"
                @click="openDecision('verify')"
              >
                Verify Entry
              </UButton>

              <UButton
                v-if="canReview"
                color="warning"
                variant="soft"
                icon="i-lucide-undo-2"
                @click="openDecision('return')"
              >
                Return for Correction
              </UButton>

              <UButton
                v-if="canReview"
                color="error"
                variant="soft"
                icon="i-lucide-x"
                @click="openDecision('reject')"
              >
                Reject Entry
              </UButton>

              <UButton
                v-if="canExpire"
                color="error"
                variant="outline"
                icon="i-lucide-calendar-x"
                @click="openDecision('expire')"
              >
                Mark as Expired
              </UButton>

              <UButton
                v-if="canReopen"
                color="neutral"
                variant="outline"
                icon="i-lucide-lock-open"
                @click="openDecision('reopen')"
              >
                Reopen Entry
              </UButton>
            </div>
          </section>

          <section
            class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <h2 class="font-bold">
                Verification History
              </h2>
            </div>

            <div
              v-if="!entry.verification_history?.length"
              class="p-10 text-center text-sm text-gray-500"
            >
              No verification history.
            </div>

            <div
              v-else
              class="divide-y divide-gray-100 dark:divide-gray-800"
            >
              <div
                v-for="history in entry.verification_history"
                :key="history.documentId || history.id"
                class="px-5 py-4"
              >
                <div class="flex items-center justify-between gap-3">
                  <p class="font-semibold">
                    {{ formatStatus(history.new_status) }}
                  </p>

                  <p class="text-xs text-gray-500">
                    {{ formatDateTime(history.review_date) }}
                  </p>
                </div>

                <p class="mt-1 text-xs text-gray-500">
                  {{ history.reviewer?.username || history.reviewer?.email || 'System' }}
                </p>

                <p
                  v-if="history.remarks"
                  class="mt-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  {{ history.remarks }}
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </template>

    <UModal
      v-model:open="decisionOpen"
      id="hr-portfolio-entry-decision"
      title="HR Verification Decision"
      description="Confirm the selected portfolio action."
      :ui="{ content: 'max-w-xl' }"
    >
      <template #content>
        <div class="rounded-[28px] bg-white p-6 dark:bg-gray-900">
          <h2 class="text-lg font-bold">
            {{ decisionTitle }}
          </h2>

          <p class="mt-2 text-sm text-gray-500">
            {{ entry?.title }}
          </p>

          <UFormField
            class="mt-5"
            label="HR Remarks"
            :required="decisionAction !== 'verify'"
          >
            <UTextarea
              v-model="remarks"
              :rows="5"
              placeholder="Enter verification findings or instructions"
              class="w-full"
            />
          </UFormField>

          <div class="mt-6 flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="soft"
              @click="closeDecision"
            >
              Cancel
            </UButton>

            <UButton
              :color="decisionColor"
              :icon="decisionIcon"
              :loading="submitting"
              @click="submitDecision"
            >
              {{ decisionTitle }}
            </UButton>
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
  role: ['HR', 'Admin']
})

const route = useRoute()
const { $api } = useNuxtApp()
const config = useRuntimeConfig()
const toast = useToast()

const loading = ref(false)
const loadError = ref('')
const entry = ref<any>(null)

const decisionOpen = ref(false)
const decisionAction = ref('')
const remarks = ref('')
const submitting = ref(false)

const faculty = computed(() =>
  entry.value?.faculty_portfolio?.faculty ||
  {}
)

const facultyName = computed(() =>
  faculty.value?.name ||
  faculty.value?.full_name ||
  faculty.value?.user?.username ||
  'Faculty Member'
)

const facultyDepartment = computed(() =>
  faculty.value?.department?.name ||
  'Department not specified'
)

const canReview = computed(() =>
  ['for_verification', 'pending'].includes(
    entry.value?.verification_status
  )
)

const canExpire = computed(() =>
  ['for_verification', 'pending', 'verified'].includes(
    entry.value?.verification_status
  )
)

const canReopen = computed(() =>
  ['verified', 'rejected', 'expired'].includes(
    entry.value?.verification_status
  )
)

const InfoBox = defineComponent({
  props: {
    label: String,
    value: [String, Number]
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class:
            'rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40'
        },
        [
          h(
            'p',
            {
              class:
                'text-[10px] font-bold uppercase tracking-wide text-gray-500'
            },
            props.label
          ),
          h(
            'p',
            {
              class:
                'mt-1 text-sm font-semibold'
            },
            String(props.value ?? '')
          )
        ]
      )
  }
})

const openDecision = (action: string) => {
  decisionAction.value = action
  remarks.value = ''
  decisionOpen.value = true
}

const closeDecision = () => {
  decisionOpen.value = false
  decisionAction.value = ''
  remarks.value = ''
}

const decisionTitle = computed(() => {
  const labels: any = {
    verify: 'Verify Entry',
    return: 'Return for Correction',
    reject: 'Reject Entry',
    reopen: 'Reopen Entry',
    expire: 'Mark as Expired'
  }

  return labels[decisionAction.value] ||
    'Confirm Action'
})

const decisionColor = computed(() => {
  const colors: any = {
    verify: 'success',
    return: 'warning',
    reject: 'error',
    reopen: 'neutral',
    expire: 'error'
  }

  return colors[decisionAction.value] ||
    'primary'
})

const decisionIcon = computed(() => {
  const icons: any = {
    verify: 'i-lucide-badge-check',
    return: 'i-lucide-undo-2',
    reject: 'i-lucide-x',
    reopen: 'i-lucide-lock-open',
    expire: 'i-lucide-calendar-x'
  }

  return icons[decisionAction.value] ||
    'i-lucide-check'
})

const submitDecision = async () => {
  if (!entry.value?.documentId) {
    return
  }

  if (
    decisionAction.value !== 'verify' &&
    !remarks.value.trim()
  ) {
    toast.add({
      title: 'Remarks required',
      description:
        'Please provide HR remarks for this action.',
      color: 'error'
    })
    return
  }

  submitting.value = true

  try {
    const endpointMap: any = {
      verify: 'verify',
      return: 'return',
      reject: 'reject',
      reopen: 'reopen',
      expire: 'expire'
    }

    await $api(
      `/portfolio-entries/${entry.value.documentId}/${endpointMap[decisionAction.value]}`,
      {
        method: 'POST',
        body: {
          remarks:
            remarks.value.trim() ||
            undefined
        }
      }
    )

    toast.add({
      title: 'Portfolio entry updated',
      description:
        `${decisionTitle.value} completed successfully.`,
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    closeDecision()
    await loadEntry()
  } catch (error: any) {
    toast.add({
      title: 'Verification action failed',
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        'Unable to update the portfolio entry.',
      color: 'error'
    })
  } finally {
    submitting.value = false
  }
}

const getDocumentId = () => {
  const params = route.params || {}
  const direct =
    params.documentId ??
    params.documentid ??
    params.id
  const fallback =
    Object.values(params)[0]
  const raw =
    direct ??
    fallback ??
    ''
  const value =
    Array.isArray(raw)
      ? raw[0]
      : raw

  return String(value || '').trim()
}

const loadEntry = async () => {
  const documentId =
    getDocumentId()

  if (
    !documentId ||
    documentId === 'undefined' ||
    documentId === 'null'
  ) {
    entry.value = null
    loadError.value =
      'The selected portfolio entry does not have a valid document ID.'
    return
  }

  loading.value = true
  loadError.value = ''

  try {
    const response: any = await $api(
      `/portfolio-entries/verification-queue/${encodeURIComponent(documentId)}`
    )

    entry.value =
      response?.data ||
      response ||
      null
  } catch (error: any) {
    entry.value = null
    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      'Unable to load the portfolio entry.'
  } finally {
    loading.value = false
  }
}

const fileUrl = (evidence: any) => {
  const url =
    evidence?.file?.url

  if (!url) {
    return ''
  }

  if (/^https?:\/\//i.test(url)) {
    return url
  }

  const baseUrl = String(
    config.public.strapiUrl ||
      config.public.apiBase ||
      ''
  ).replace(/\/api\/?$/, '')

  return `${baseUrl}${url}`
}

const formatStatus = (value: string) =>
  String(value || '')
    .replace(/_/g, ' ')
    .replace(
      /\b\w/g,
      character =>
        character.toUpperCase()
    )

const statusColor = (value: string) => {
  switch (value) {
    case 'verified':
      return 'success'
    case 'for_verification':
    case 'pending':
      return 'warning'
    case 'needs_correction':
    case 'rejected':
    case 'expired':
      return 'error'
    default:
      return 'neutral'
  }
}

const formatDate = (value: any) => {
  if (!value) return 'N/A'

  const date = new Date(value)

  return Number.isNaN(
    date.getTime()
  )
    ? String(value)
    : date.toLocaleDateString(
        'en-PH',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }
      )
}

const formatDateTime = (value: any) => {
  if (!value) return 'N/A'

  const date = new Date(value)

  return Number.isNaN(
    date.getTime()
  )
    ? String(value)
    : date.toLocaleString(
        'en-PH',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        }
      )
}

watch(
  () => route.fullPath,
  () => {
    loadEntry()
  }
)

onMounted(loadEntry)
</script>
