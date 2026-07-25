<template>
  <div class="relative min-h-screen overflow-hidden bg-slate-950">
    <!-- Decorative background -->
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl"
      />

      <div
        class="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl"
      />

      <div
        class="absolute inset-0 opacity-[0.04]"
        :style="{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }"
      />
    </div>

    <div class="relative grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <!-- LEFT BRANDING PANEL -->
      <section
        class="relative hidden min-h-screen flex-col justify-between overflow-hidden p-10 text-white lg:flex xl:p-14"
      >
        <div class="relative z-10 flex items-center gap-4">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur"
          >
            <img
              src="/logo.png"
              alt="School logo"
              class="h-11 w-11 object-contain"
            />
          </div>

          <div>
            <p class="text-lg font-bold tracking-tight">
              Faculty Evaluation System
            </p>
            <p class="text-sm text-slate-300">
              St. Nicolas College
            </p>
          </div>
        </div>

        <div class="relative z-10 max-w-2xl">
          <div
            class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-300/20 bg-primary-400/10 px-4 py-2 text-sm text-primary-100 backdrop-blur"
          >
            <UIcon name="i-lucide-sparkles" class="size-4" />
            AI-powered evaluation and feedback analysis
          </div>

          <h1
            class="max-w-xl text-4xl font-bold leading-tight tracking-tight xl:text-5xl"
          >
            Supporting better teaching through meaningful feedback.
          </h1>

          <p class="mt-6 max-w-xl text-base leading-7 text-slate-300 xl:text-lg">
            A secure platform for students, faculty members, deans, and
            administrators to participate in structured evaluations and
            data-driven institutional improvement.
          </p>

          <div class="mt-10 grid max-w-xl grid-cols-2 gap-4">
            <div
              class="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
            >
              <div
                class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-400/15 text-primary-200"
              >
                <UIcon name="i-lucide-message-square-text" class="size-5" />
              </div>

              <p class="font-semibold">Structured Feedback</p>
              <p class="mt-1 text-sm leading-5 text-slate-400">
                Organized evaluation criteria for accurate reporting.
              </p>
            </div>

            <div
              class="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
            >
              <div
                class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200"
              >
                <UIcon name="i-lucide-brain-circuit" class="size-5" />
              </div>

              <p class="font-semibold">Sentiment Insights</p>
              <p class="mt-1 text-sm leading-5 text-slate-400">
                AI-assisted analysis of student faculty feedback.
              </p>
            </div>
          </div>
        </div>

        <div
          class="relative z-10 flex items-center justify-between text-xs text-slate-400"
        >
          <span>
            © {{ currentYear }} St. Nicolas College
          </span>

          <span class="flex items-center gap-2">
            <UIcon name="i-lucide-shield-check" class="size-4" />
            Secure access
          </span>
        </div>
      </section>

      <!-- RIGHT LOGIN PANEL -->
      <section
        class="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:bg-white/[0.03] lg:px-10"
      >
        <div class="w-full max-w-md">
          <!-- Mobile branding -->
          <div class="mb-8 text-center lg:hidden">
            <div
              class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 shadow-xl backdrop-blur"
            >
              <img
                src="/logo.png"
                alt="School logo"
                class="h-16 w-16 object-contain"
              />
            </div>

            <h1 class="text-xl font-bold text-white">
              Faculty Evaluation System
            </h1>

            <p class="mt-1 text-sm text-slate-400">
              St. Nicolas College
            </p>
          </div>

          <UPageCard
            class="border border-white/10 bg-white shadow-2xl shadow-black/20 dark:bg-slate-900"
            :ui="{
              root: 'rounded-3xl',
              body: 'p-6 sm:p-8'
            }"
          >
            <!-- Header -->
            <div class="mb-8">
              <div
                class="mb-5 hidden h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400 lg:flex"
              >
                <UIcon name="i-lucide-log-in" class="size-6" />
              </div>

              <h2
                class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                Welcome back
              </h2>

              <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Enter your credentials to access the evaluation system.
              </p>
            </div>

            <!-- Login Form -->
            <UForm
              :schema="schema"
              :state="state"
              class="space-y-5"
              @submit="onSubmit"
            >
              <UFormField
                label="Username"
                name="username"
                required
              >
                <UInput
                  v-model="state.username"
                  icon="i-lucide-user"
                  placeholder="Enter your username"
                  autocomplete="username"
                  size="xl"
                  class="w-full"
                  :disabled="loading"
                />
              </UFormField>

              <UFormField
                label="Password"
                name="password"
                required
              >
                <UInput
                  id="password"
                  v-model="state.password"
                  icon="i-lucide-lock-keyhole"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  class="w-full"
                  size="xl"
                  :type="showPassword ? 'text' : 'password'"
                  :disabled="loading"
                  :ui="{ trailing: 'pe-1' }"
                  @keydown.enter="handleEnter"
                >
                  <template #trailing>
                    <UButton
                      type="button"
                      color="neutral"
                      variant="link"
                      size="sm"
                      tabindex="-1"
                      :icon="
                        showPassword
                          ? 'i-lucide-eye-off'
                          : 'i-lucide-eye'
                      "
                      :aria-label="
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      "
                      :aria-pressed="showPassword"
                      aria-controls="password"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </UInput>
              </UFormField>

              <div class="flex items-center justify-between">
                <UCheckbox
                  v-model="rememberMe"
                  label="Remember username"
                  :disabled="loading"
                />

                <span
                  class="flex items-center gap-1 text-xs text-gray-400"
                >
                  <UIcon name="i-lucide-lock" class="size-3.5" />
                  Secure login
                </span>
              </div>

              <UButton
                type="submit"
                size="xl"
                block
                class="mt-2"
                :loading="loading"
                :disabled="loading"
                trailing-icon="i-lucide-arrow-right"
              >
                {{ loading ? 'Signing in...' : 'Sign in' }}
              </UButton>
            </UForm>

            <!-- Information footer -->
            <div class="mt-8 border-t border-gray-200 pt-5 dark:border-gray-800">
              <div
                class="flex items-start gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60"
              >
                <UIcon
                  name="i-lucide-circle-help"
                  class="mt-0.5 size-4 shrink-0 text-gray-400"
                />

                <p class="text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Contact the system administrator if you cannot access your
                  account or have forgotten your credentials.
                </p>
              </div>
            </div>
          </UPageCard>

          <p class="mt-6 text-center text-xs text-slate-400">
            Authorized users only. Your activity may be recorded for security
            and audit purposes.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const { login } = useAuth()
const toast = useToast()

const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)

const currentYear = new Date().getFullYear()

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username is required'),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: '',
  password: ''
})

onMounted(() => {
  const savedUsername = localStorage.getItem('evaluation_username')

  if (savedUsername) {
    state.username = savedUsername
    rememberMe.value = true
  }
})

const handleEnter = () => {
  if (loading.value) return
}

const onSubmit = async (
  payload: FormSubmitEvent<Schema>
) => {
  if (loading.value) return

  loading.value = true

  try {
    await login(
      payload.data.username,
      payload.data.password
    )

    if (rememberMe.value) {
      localStorage.setItem(
        'evaluation_username',
        payload.data.username
      )
    } else {
      localStorage.removeItem('evaluation_username')
    }

    toast.add({
      title: 'Welcome back',
      description: 'You have successfully signed in.',
      icon: 'i-lucide-circle-check',
      color: 'success'
    })

    await navigateTo('/')
  } catch (error) {
    console.error('Login error:', error)

    toast.add({
      title: 'Unable to sign in',
      description: 'The username or password you entered is incorrect.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Hide the native password reveal button in Microsoft Edge. */
::-ms-reveal {
  display: none;
}
</style>