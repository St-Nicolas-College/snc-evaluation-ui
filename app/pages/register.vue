<template>
  <div
    class="min-h-screen bg-[#f3f6f4] px-4 py-6 sm:px-6 lg:px-8 dark:bg-gray-950"
  >
    <div class="mx-auto w-full max-w-6xl">
      <!-- =====================================================
        TOP BRAND BAR
      ====================================================== -->
      <div
        class="mb-5 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-gray-200 dark:ring-gray-700"
          >
            <img
              src="/logo.png"
              alt="St. Nicolas College"
              class="size-8 object-contain"
            />
          </div>

          <div>
            <p class="text-sm font-black text-gray-950 dark:text-white">
              SNC Evaluation System
            </p>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Student Self-Registration
            </p>
          </div>
        </div>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-arrow-left"
          class="rounded-xl"
          @click="goToLogin"
        >
          Back to Login
        </UButton>
      </div>

      <!-- =====================================================
        HERO
      ====================================================== -->
      <section
        class="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-emerald-700 via-green-700 to-teal-800 px-6 py-7 text-white shadow-xl shadow-emerald-900/10 sm:px-8 sm:py-8"
      >
        <div
          class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
        />
        <div
          class="pointer-events-none absolute -bottom-20 left-1/3 size-56 rounded-full bg-cyan-300/10 blur-3xl"
        />

        <div
          class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="max-w-2xl">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold backdrop-blur"
              >
                Student Account Setup
              </span>

              <span
                class="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold backdrop-blur"
              >
                Public Registration
              </span>
            </div>

            <h1 class="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Create your student account
            </h1>

            <p class="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/90">
              Register using your official student information. Your Student ID
              will automatically become your login username.
            </p>
          </div>

          <div
            class="grid w-full gap-2 sm:grid-cols-3 lg:w-auto lg:min-w-[420px]"
          >
            <HeroStep
              number="01"
              icon="i-lucide-id-card"
              label="Student Details"
            />

            <HeroStep
              number="02"
              icon="i-lucide-shield-check"
              label="Account Security"
            />

            <HeroStep number="03" icon="i-lucide-log-in" label="Sign In" />
          </div>
        </div>
      </section>

      <!-- =====================================================
        SUCCESS STATE
      ====================================================== -->
      <section
        v-if="registrationSuccess"
        class="mt-5 overflow-hidden rounded-[28px] border border-emerald-200 bg-white p-8 text-center shadow-sm dark:border-emerald-900 dark:bg-gray-900"
      >
        <div
          class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
        >
          <UIcon name="i-lucide-circle-check-big" class="size-8" />
        </div>

        <h2 class="mt-5 text-2xl font-black text-gray-950 dark:text-white">
          Registration successful
        </h2>

        <p
          class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-300"
        >
          Your student account is ready. Use your Student ID and password to
          sign in.
        </p>

        <div
          class="mx-auto mt-6 max-w-sm rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left dark:border-gray-800 dark:bg-gray-950/40"
        >
          <p
            class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400"
          >
            Login Username
          </p>

          <div class="mt-2 flex items-center gap-2">
            <UIcon
              name="i-lucide-badge-check"
              class="size-4 text-emerald-600"
            />
            <p
              class="font-mono text-base font-bold text-gray-900 dark:text-white"
            >
              {{ registeredStudentId }}
            </p>
          </div>
        </div>

        <UButton
          size="lg"
          icon="i-lucide-log-in"
          class="mt-6 rounded-xl px-6"
          @click="goToLogin"
        >
          Continue to Login
        </UButton>
      </section>

      <!-- =====================================================
        REGISTRATION FORM
      ====================================================== -->
      <UForm v-else :state="form" class="mt-5" @submit="registerStudent">
        <div class="grid gap-5 lg:grid-cols-2">
          <!-- STUDENT INFORMATION -->
          <section
            class="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="flex items-center justify-between border-b border-gray-200 bg-gray-50/70 px-5 py-4 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                >
                  <UIcon name="i-lucide-user-round" class="size-5" />
                </div>

                <div>
                  <h2 class="text-sm font-black text-gray-900 dark:text-white">
                    Student Information
                  </h2>
                  <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Personal and academic details
                  </p>
                </div>
              </div>

              <UBadge color="info" variant="subtle"> Step 1 </UBadge>
            </div>

            <div class="space-y-4 p-5 sm:p-6">
              <div class="grid gap-4 sm:grid-cols-2">
                <UFormField label="Student ID" name="student_id" required>
                  <UInput
                    v-model="form.student_id"
                    placeholder="e.g. 26-00001"
                    icon="i-lucide-id-card"
                    autocomplete="username"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Full Name" name="name" required>
                  <UInput
                    v-model="form.name"
                    placeholder="Enter complete name"
                    icon="i-lucide-user"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <UFormField label="Course" name="course" required>
                <USelectMenu
                  v-model="form.course"
                  :items="courseOptions"
                  value-key="value"
                  placeholder="Select course"
                  :loading="loadingCourses"
                  class="w-full"
                />
              </UFormField>

              <div class="grid gap-4 sm:grid-cols-2">
                <UFormField label="Year Level" name="year_level" required>
                  <USelectMenu
                    v-model="form.year_level"
                    :items="yearLevelOptions"
                    value-key="value"
                    placeholder="Select year level"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Section" name="section" required>
                  <USelectMenu
                    v-model="form.section"
                    :items="sectionOptions"
                    value-key="value"
                    :disabled="!form.year_level"
                    :placeholder="
                      form.year_level
                        ? 'Select section'
                        : 'Select year level first'
                    "
                    class="w-full"
                  />
                </UFormField>
              </div>

              <div
                class="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/20"
              >
                <div class="flex items-start gap-3">
                  <UIcon
                    name="i-lucide-info"
                    class="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400"
                  />

                  <p class="text-xs leading-5 text-blue-800 dark:text-blue-300">
                    Use the same Student ID, course, year level, and section
                    recorded by the school.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- ACCOUNT SECURITY -->
          <section
            class="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="flex items-center justify-between border-b border-gray-200 bg-gray-50/70 px-5 py-4 dark:border-gray-800 dark:bg-gray-950/30"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400"
                >
                  <UIcon name="i-lucide-shield-user" class="size-5" />
                </div>

                <div>
                  <h2 class="text-sm font-black text-gray-900 dark:text-white">
                    Account Security
                  </h2>
                  <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Username, email, and password
                  </p>
                </div>
              </div>

              <UBadge color="secondary" variant="subtle"> Step 2 </UBadge>
            </div>

            <div class="space-y-4 p-5 sm:p-6">
              <UFormField
                label="Username"
                name="username"
                description="Automatically generated from your Student ID."
              >
                <UInput
                  :model-value="normalizedStudentId"
                  icon="i-lucide-badge-check"
                  readonly
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Email Address" name="email" required>
                <UInput
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  placeholder="student@example.com"
                  icon="i-lucide-mail"
                  class="w-full"
                />
              </UFormField>

              <div class="grid gap-4 sm:grid-cols-2">
                <UFormField label="Password" name="password" required>
                  <UInput
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="new-password"
                    placeholder="Minimum 6 characters"
                    icon="i-lucide-lock-keyhole"
                    class="w-full"
                  >
                    <template #trailing>
                      <UButton
                        type="button"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                        :icon="
                          showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'
                        "
                        square
                        @click="showPassword = !showPassword"
                      />
                    </template>
                  </UInput>
                </UFormField>

                <UFormField
                  label="Confirm Password"
                  name="confirm_password"
                  required
                >
                  <UInput
                    v-model="form.confirm_password"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    autocomplete="new-password"
                    placeholder="Re-enter password"
                    icon="i-lucide-lock-keyhole"
                    class="w-full"
                  >
                    <template #trailing>
                      <UButton
                        type="button"
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
              </div>

              <div
                class="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-950/20"
              >
                <div class="flex items-start gap-3">
                  <UIcon
                    name="i-lucide-lock-keyhole"
                    class="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                  />

                  <p
                    class="text-xs leading-5 text-emerald-800 dark:text-emerald-300"
                  >
                    After registration, sign in using your
                    <strong>Student ID</strong>
                    as your username.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <UAlert
          v-if="submitError"
          class="mt-5"
          color="error"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          title="Unable to register"
          :description="submitError"
        />

        <!-- ACTION BAR -->
        <div
          class="mt-5 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
            >
              <UIcon name="i-lucide-shield-check" class="size-4" />
            </div>

            <div>
              <p class="text-xs font-bold text-gray-900 dark:text-white">
                Student-only account
              </p>
              <p
                class="mt-1 text-[11px] leading-5 text-gray-500 dark:text-gray-400"
              >
                Public registration cannot create administrative accounts.
              </p>
            </div>
          </div>

          <div class="flex gap-2 sm:justify-end">
            <UButton
              type="button"
              color="neutral"
              variant="outline"
              class="rounded-xl"
              @click="resetForm"
            >
              Clear Form
            </UButton>

            <UButton
              type="submit"
              icon="i-lucide-user-round-plus"
              :loading="submitting"
              :disabled="submitting"
              class="rounded-xl px-6"
            >
              Create Account
            </UButton>
          </div>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  layout: false,
});

const { $api } = useNuxtApp();
const toast = useToast();
const router = useRouter();

const loadingCourses = ref(false);
const submitting = ref(false);
const submitError = ref("");

const registrationSuccess = ref(false);
const registeredStudentId = ref("");

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const courses = ref<any[]>([]);

const form = reactive({
  student_id: "",
  name: "",
  course: null as any,
  year_level: "",
  section: "",
  email: "",
  password: "",
  confirm_password: "",
});

const yearLevelOptions = [
  { label: "1st Year", value: "1st Year" },
  { label: "2nd Year", value: "2nd Year" },
  { label: "3rd Year", value: "3rd Year" },
  { label: "4th Year", value: "4th Year" },
  { label: "5th Year", value: "5th Year" },
];

const sectionOptionsMap: Record<string, string[]> = {
  "1st Year": ["1A", "1B", "1C", "1D", "1E", "1F", "1G", "1H", "1I", "1J", "1K", "1L"],
  "2nd Year": ["2A", "2B", "2C", "2D", "2E", "2F", "2G", "2H", "2I"],
  "3rd Year": ["3A", "3B", "3C", "3D", "3E", "3F", "3G", "3H", "3I"],
  "4th Year": ["4A", "4B", "4C", "4D", "4E", "4F", "4G", "4H", "4I"],
  "5th Year": ["5A", "5B", "5C", "5D", "5E", "5F", "5G", "5H", "5I"],
};

const sectionOptions = computed(() => {
  const sections = sectionOptionsMap[form.year_level] || [];

  return sections.map((section) => ({
    label: section,
    value: section,
  }));
});

const normalizedStudentId = computed(() =>
  String(form.student_id || "").trim(),
);

const courseOptions = computed(() =>
  courses.value.map((course) => ({
    label: `${course.code?.toUpperCase() || "NO CODE"} - ${course.name}`,
    value: course.id,
  })),
);

const validateForm = () => {
  submitError.value = "";

  if (
    !normalizedStudentId.value ||
    !form.name.trim() ||
    !form.course ||
    !form.year_level ||
    !form.section.trim() ||
    !form.email.trim() ||
    !form.password ||
    !form.confirm_password
  ) {
    submitError.value = "Complete all required fields.";
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(form.email.trim())) {
    submitError.value = "Enter a valid email address.";
    return false;
  }

  if (form.password.length < 6) {
    submitError.value = "Password must contain at least 6 characters.";
    return false;
  }

  if (form.password !== form.confirm_password) {
    submitError.value = "Passwords do not match.";
    return false;
  }

  return true;
};

const getCourses = async () => {
  loadingCourses.value = true;

  try {
    const response: any = await $api("/courses", {
      query: {
        "sort[0]": "name:asc",
        "pagination[pageSize]": 500,
      },
    });

    courses.value = response?.data || [];
  } catch (error) {
    console.error("Public course loading error:", error);

    courses.value = [];
    submitError.value = "Unable to load the available courses.";
  } finally {
    loadingCourses.value = false;
  }
};

const registerStudent = async () => {
  if (!validateForm()) return;

  submitting.value = true;
  submitError.value = "";

  try {
    await $api("/students/register", {
      method: "POST",

      body: {
        student_id: normalizedStudentId.value,
        name: form.name.trim(),
        course: form.course,
        year_level: form.year_level,
        section: form.section.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      },
    });

    registeredStudentId.value = normalizedStudentId.value;
    registrationSuccess.value = true;

    toast.add({
      title: "Registration successful",
      description: "Your student account has been created.",
      icon: "i-lucide-circle-check",
      color: "success",
    });
  } catch (error: any) {
    console.error("Student registration error:", error);

    submitError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to create your student account.";

    toast.add({
      title: "Registration failed",
      description: submitError.value,
      icon: "i-lucide-triangle-alert",
      color: "error",
    });
  } finally {
    submitting.value = false;
  }
};

const resetForm = () => {
  form.student_id = "";
  form.name = "";
  form.course = null;
  form.year_level = "";
  form.section = "";
  form.email = "";
  form.password = "";
  form.confirm_password = "";

  submitError.value = "";
  showPassword.value = false;
  showConfirmPassword.value = false;
};

const goToLogin = () => {
  router.push("/auth/login");
};

watch(
  () => form.year_level,
  () => {
    form.section = ''
  }
)

onMounted(() => {
  getCourses();
});

const HeroStep = defineComponent({
  props: {
    number: String,
    icon: String,
    label: String,
  },

  setup(props) {
    return () =>
      h(
        "div",
        {
          class:
            "rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur",
        },
        [
          h(
            "div",
            {
              class: "flex items-center gap-2",
            },
            [
              h(
                "div",
                {
                  class:
                    "flex size-8 shrink-0 items-center justify-center rounded-xl bg-white/10",
                },
                [
                  h(resolveComponent("UIcon"), {
                    name: props.icon,
                    class: "size-4",
                  }),
                ],
              ),

              h(
                "span",
                {
                  class:
                    "text-[9px] font-black tracking-[0.14em] text-emerald-100/70",
                },
                props.number,
              ),
            ],
          ),

          h(
            "p",
            {
              class: "mt-2 text-xs font-bold text-white",
            },
            props.label,
          ),
        ],
      );
  },
});
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
