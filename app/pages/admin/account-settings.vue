<template>
  <div class="space-y-6 pb-10">
    <!-- HERO -->
    <section
      class="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7 dark:border-emerald-900"
    >
      <div
        class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-teal-300/15 blur-3xl"
      />

      <div
        class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"
      >
        <div class="flex min-w-0 items-start gap-4">
          <div
            class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex"
          >
            <UIcon name="i-lucide-settings-2" class="size-7" />
          </div>

          <div class="min-w-0">
            <div
              class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-50"
            >
              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Administrator Portal
              </span>

              <span
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur"
              >
                Account Settings
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Account Settings
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Review your administrator account, update your email address, and
              manage your account security.
            </p>
          </div>
        </div>

        <div
          class="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur"
        >
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100"
          >
            Signed in as
          </p>

          <p class="mt-1 text-sm font-bold">
            {{ user?.username || "Administrator" }}
          </p>
        </div>
      </div>
    </section>

    <!-- LOADING -->
    <div v-if="loading" class="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <USkeleton class="h-[300px] rounded-3xl" />
      <USkeleton class="h-[420px] rounded-3xl" />
    </div>

    <!-- ERROR -->
    <section
      v-else-if="loadError"
      class="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <UIcon
        name="i-lucide-triangle-alert"
        class="mx-auto size-8 text-red-600"
      />

      <h2 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
        Unable to load account settings
      </h2>

      <p
        class="mx-auto mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400"
      >
        {{ loadError }}
      </p>

      <UButton
        class="mt-5"
        icon="i-lucide-refresh-cw"
        @click="loadSettings"
      >
        Try Again
      </UButton>
    </section>

    <template v-else>
      <!-- PROFILE -->
      <section
        class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white dark:border-gray-800"
        >
          <div
            class="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-emerald-500/20 blur-3xl"
          />

          <div class="relative flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              class="flex size-20 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-2xl font-bold backdrop-blur"
            >
              {{ adminInitials }}
            </div>

            <div class="min-w-0">
              <p
                class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300"
              >
                Administrator Account
              </p>

              <h2 class="mt-1 truncate text-2xl font-bold">
                {{ user?.username || "Administrator" }}
              </h2>

              <div
                class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300"
              >
                <span>{{ user?.email || "No Email" }}</span>

                <span>•</span>

                <span>{{ roleName }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
          <div
            v-for="item in profileItems"
            :key="item.label"
            class="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40"
          >
            <div class="flex items-start gap-3">
              <UIcon
                :name="item.icon"
                class="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
              />

              <div class="min-w-0">
                <p
                  class="text-[10px] font-semibold uppercase tracking-wide text-gray-400"
                >
                  {{ item.label }}
                </p>

                <p
                  class="mt-1 truncate text-sm font-bold text-gray-900 dark:text-white"
                >
                  {{ item.value }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="border-t border-gray-200 bg-gray-50/70 px-5 py-4 text-xs leading-5 text-gray-500 dark:border-gray-800 dark:bg-gray-950/30 dark:text-gray-400"
        >
          Your administrator username and role are managed by the system. You
          can update your email address and password below.
        </div>
      </section>

      <!-- ACCOUNT + PASSWORD -->
      <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <!-- ACCOUNT INFORMATION -->
        <section
          class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="border-b border-gray-200 px-5 py-4 sm:px-6 dark:border-gray-800"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
              >
                <UIcon name="i-lucide-user-cog" class="size-5" />
              </div>

              <div>
                <h2 class="text-sm font-bold text-gray-900 dark:text-white">
                  Account Information
                </h2>

                <p
                  class="mt-0.5 text-xs text-gray-500 dark:text-gray-400"
                >
                  Your username is used to sign in to your administrator
                  account.
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-5 p-5 sm:p-6">
            <UFormField label="Username">
              <UInput
                :model-value="user?.username || ''"
                icon="i-lucide-user-round"
                readonly
                disabled
                class="w-full"
              />
            </UFormField>

            <UFormField label="Role">
              <UInput
                :model-value="roleName"
                icon="i-lucide-shield-check"
                readonly
                disabled
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Email Address"
              required
              :error="emailError || undefined"
            >
              <UInput
                v-model="accountForm.email"
                type="email"
                icon="i-lucide-mail"
                placeholder="admin@example.com"
                class="w-full"
                @blur="emailTouched = true"
              />
            </UFormField>

            <div
              class="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/20"
            >
              <div class="flex items-start gap-3">
                <UIcon
                  name="i-lucide-info"
                  class="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400"
                />

                <p
                  class="text-xs leading-5 text-gray-600 dark:text-gray-400"
                >
                  Your email address is used for account-related communication.
                  Your username and administrator role cannot be changed from
                  this page.
                </p>
              </div>
            </div>

            <div class="flex justify-end">
              <UButton
                icon="i-lucide-save"
                :loading="savingEmail"
                :disabled="savingEmail || !emailChanged"
                @click="saveEmail"
              >
                Save Email
              </UButton>
            </div>
          </div>
        </section>

        <!-- PASSWORD -->
        <section
          class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="border-b border-gray-200 px-5 py-4 sm:px-6 dark:border-gray-800"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
              >
                <UIcon name="i-lucide-shield-check" class="size-5" />
              </div>

              <div>
                <h2 class="text-sm font-bold text-gray-900 dark:text-white">
                  Password & Security
                </h2>

                <p
                  class="mt-0.5 text-xs text-gray-500 dark:text-gray-400"
                >
                  Change your administrator password securely.
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-5 p-5 sm:p-6">
            <UFormField label="Current Password" required>
              <UInput
                v-model="passwordForm.current_password"
                :type="showCurrentPassword ? 'text' : 'password'"
                icon="i-lucide-lock-keyhole"
                placeholder="Enter current password"
                class="w-full"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    :icon="
                      showCurrentPassword
                        ? 'i-lucide-eye-off'
                        : 'i-lucide-eye'
                    "
                    square
                    @click="showCurrentPassword = !showCurrentPassword"
                  />
                </template>
              </UInput>
            </UFormField>

            <UFormField
              label="New Password"
              required
              :error="passwordError || undefined"
            >
              <UInput
                v-model="passwordForm.new_password"
                :type="showNewPassword ? 'text' : 'password'"
                icon="i-lucide-lock"
                placeholder="Minimum 8 characters"
                class="w-full"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    :icon="
                      showNewPassword
                        ? 'i-lucide-eye-off'
                        : 'i-lucide-eye'
                    "
                    square
                    @click="showNewPassword = !showNewPassword"
                  />
                </template>
              </UInput>
            </UFormField>

            <UFormField
              label="Confirm New Password"
              required
              :error="confirmPasswordError || undefined"
            >
              <UInput
                v-model="passwordForm.confirm_password"
                :type="showConfirmPassword ? 'text' : 'password'"
                icon="i-lucide-lock-keyhole"
                placeholder="Re-enter new password"
                class="w-full"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    :icon="
                      showConfirmPassword
                        ? 'i-lucide-eye-off'
                        : 'i-lucide-eye'
                    "
                    square
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </UInput>
            </UFormField>

            <div
              class="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 dark:border-amber-900 dark:bg-amber-950/20"
            >
              <div class="flex items-start gap-3">
                <UIcon
                  name="i-lucide-shield-alert"
                  class="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
                />

                <p
                  class="text-xs leading-5 text-gray-600 dark:text-gray-400"
                >
                  Use a password you do not reuse elsewhere. Your new password
                  must contain at least 8 characters and must be different from
                  your current password.
                </p>
              </div>
            </div>

            <div class="flex justify-end">
              <UButton
                icon="i-lucide-key-round"
                :loading="changingPassword"
                :disabled="changingPassword"
                @click="changePassword"
              >
                Change Password
              </UButton>
            </div>
          </div>
        </section>
      </div>

      <!-- HELP -->
      <section
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
            >
              <UIcon name="i-lucide-circle-help" class="size-5" />
            </div>

            <div>
              <h2 class="text-sm font-bold text-gray-900 dark:text-white">
                Need help with your account?
              </h2>

              <p
                class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400"
              >
                Make sure your administrator email address is current. If you
                can no longer access your account, contact the system
                maintainer.
              </p>
            </div>
          </div>

          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-arrow-left"
            to="/"
          >
            Back to Dashboard
          </UButton>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  middleware: ["auth", "role"],
  role: ["Admin"],
});

const { $api } = useNuxtApp();
const { user } = useAuth();
const toast = useToast();

const loading = ref(true);
const loadError = ref("");

const savingEmail = ref(false);
const changingPassword = ref(false);

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const originalEmail = ref("");
const emailTouched = ref(false);
const passwordSubmitted = ref(false);

const accountForm = reactive({
  email: "",
});

const passwordForm = reactive({
  current_password: "",
  new_password: "",
  confirm_password: "",
});

/**
 * ---------------------------------------------------------
 * ADMIN INITIALS
 * ---------------------------------------------------------
 */
const adminInitials = computed(() => {
  const name = String(user.value?.username || "Administrator").trim();

  return (
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((part: string) => part.charAt(0).toUpperCase())
      .join("") || "AD"
  );
});

/**
 * ---------------------------------------------------------
 * ROLE
 * ---------------------------------------------------------
 */
const roleName = computed(() => {
  return (
    user.value?.role?.name ||
    user.value?.role?.type ||
    "Admin"
  );
});

/**
 * ---------------------------------------------------------
 * PROFILE ITEMS
 * ---------------------------------------------------------
 */
const profileItems = computed(() => [
  {
    label: "Username",
    value: user.value?.username || "—",
    icon: "i-lucide-user-round",
  },
  {
    label: "Email Address",
    value: user.value?.email || accountForm.email || "—",
    icon: "i-lucide-mail",
  },
  {
    label: "Role",
    value: roleName.value,
    icon: "i-lucide-shield-check",
  },
]);

/**
 * ---------------------------------------------------------
 * EMAIL VALIDATION
 * ---------------------------------------------------------
 */
const emailError = computed(() => {
  if (!emailTouched.value) return "";

  const email = String(accountForm.email || "").trim();

  if (!email) {
    return "Email address is required.";
  }

  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!pattern.test(email)) {
    return "Enter a valid email address.";
  }

  return "";
});

const emailChanged = computed(() => {
  return (
    !emailError.value &&
    String(accountForm.email || "").trim().toLowerCase() !==
      String(originalEmail.value || "").trim().toLowerCase()
  );
});

/**
 * ---------------------------------------------------------
 * PASSWORD VALIDATION
 * ---------------------------------------------------------
 */
const passwordError = computed(() => {
  if (!passwordSubmitted.value) return "";

  const value = String(passwordForm.new_password || "");

  if (!value) {
    return "New password is required.";
  }

  if (value.length < 8) {
    return "Password must contain at least 8 characters.";
  }

  return "";
});

const confirmPasswordError = computed(() => {
  if (!passwordSubmitted.value) return "";

  if (!passwordForm.confirm_password) {
    return "Please confirm your new password.";
  }

  if (
    passwordForm.new_password !==
    passwordForm.confirm_password
  ) {
    return "Passwords do not match.";
  }

  return "";
});

/**
 * ---------------------------------------------------------
 * LOAD SETTINGS
 * ---------------------------------------------------------
 *
 * Admin has no Teacher record.
 * Everything comes directly from the authenticated user.
 */
const loadSettings = async () => {
  try {
    loading.value = true;
    loadError.value = "";

    if (!user.value?.id && !user.value?.documentId) {
      throw new Error(
        "Authenticated administrator account could not be resolved.",
      );
    }

    const email = String(user.value?.email || "");

    accountForm.email = email;
    originalEmail.value = email;
    emailTouched.value = false;
  } catch (error: any) {
    console.error("Admin settings loading error:", error);

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to load your account information.";
  } finally {
    loading.value = false;
  }
};

/**
 * ---------------------------------------------------------
 * SAVE EMAIL
 * ---------------------------------------------------------
 */
const saveEmail = async () => {
  emailTouched.value = true;

  if (
    emailError.value ||
    !emailChanged.value
  ) {
    return;
  }

  savingEmail.value = true;

  try {
    const email = String(accountForm.email || "")
      .trim()
      .toLowerCase();

    const response: any = await $api(
      "/account/me/settings",
      {
        method: "PUT",
        body: {
          email,
        },
      },
    );

    originalEmail.value = email;
    accountForm.email = email;
    emailTouched.value = false;

    /*
     * Keep the currently loaded auth user synchronized
     * when useAuth() exposes a mutable user ref.
     */
    if (user.value) {
      user.value.email =
        response?.data?.email ||
        email;
    }

    toast.add({
      title: "Email updated",
      description:
        response?.message ||
        "Your email address was updated successfully.",
      icon: "i-lucide-circle-check",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Unable to update email",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to update your email address.",
      icon: "i-lucide-triangle-alert",
      color: "error",
    });
  } finally {
    savingEmail.value = false;
  }
};

/**
 * ---------------------------------------------------------
 * CLEAR PASSWORD FORM
 * ---------------------------------------------------------
 */
const clearPasswordForm = () => {
  passwordForm.current_password = "";
  passwordForm.new_password = "";
  passwordForm.confirm_password = "";

  showCurrentPassword.value = false;
  showNewPassword.value = false;
  showConfirmPassword.value = false;
};

/**
 * ---------------------------------------------------------
 * CHANGE PASSWORD
 * ---------------------------------------------------------
 */
const changePassword = async () => {
  passwordSubmitted.value = true;

  if (!passwordForm.current_password) {
    toast.add({
      title: "Current password required",
      description: "Please enter your current password.",
      icon: "i-lucide-triangle-alert",
      color: "error",
    });

    return;
  }

  if (
    passwordError.value ||
    confirmPasswordError.value
  ) {
    return;
  }

  changingPassword.value = true;

  try {
    const response: any = await $api(
      "/account/me/change-password",
      {
        method: "PUT",
        body: {
          current_password:
            passwordForm.current_password,
          new_password:
            passwordForm.new_password,
        },
      },
    );

    clearPasswordForm();
    passwordSubmitted.value = false;

    toast.add({
      title: "Password changed",
      description:
        response?.message ||
        "Your password was changed successfully.",
      icon: "i-lucide-shield-check",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Unable to change password",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to change your password.",
      icon: "i-lucide-triangle-alert",
      color: "error",
    });
  } finally {
    changingPassword.value = false;
  }
};

/**
 * ---------------------------------------------------------
 * INITIAL LOAD
 * ---------------------------------------------------------
 */
watch(
  user,
  async (value) => {
    if (value?.id || value?.documentId) {
      await loadSettings();
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