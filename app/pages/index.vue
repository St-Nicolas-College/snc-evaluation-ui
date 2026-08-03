<template>
  <UDashboardPanel>
    <template #body>
      <div class="min-h-full bg-gray-50/50 dark:bg-gray-950/30">
        <!-- USER LOADING STATE -->
        <div
          v-if="!user"
          class="flex min-h-[65vh] items-center justify-center"
        >
          <div class="text-center">
            <div
              class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400"
            >
              <UIcon
                name="i-lucide-loader-circle"
                class="size-7 animate-spin"
              />
            </div>

            <p
              class="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Loading your dashboard
            </p>

            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Preparing your account information and system data.
            </p>
          </div>
        </div>

        <!-- ADMIN DASHBOARD -->
        <DashboardAdminDashboard
          v-else-if="role === 'Admin'"
        />

        <!-- DEAN DASHBOARD -->
        <DashboardDeanDashboard
          v-else-if="role === 'Dean'"
        />

        <!-- FACULTY DASHBOARD -->
        <DashboardFacultyDashboard
          v-else-if="role === 'Faculty'"
        />

        <!-- HR DASHBOARD -->
        <DashboardHRDashboard
          v-else-if="role === 'HR'"
        />

        <!-- STUDENT DASHBOARD -->
        <DashboardStudentDashboard
          v-else-if="role === 'Student'"
        />

        <!-- UNKNOWN ROLE -->
        <div
          v-else
          class="flex min-h-[65vh] items-center justify-center"
        >
          <div
            class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
            >
              <UIcon
                name="i-lucide-shield-alert"
                class="size-7"
              />
            </div>

            <h2
              class="mt-5 text-lg font-semibold text-gray-900 dark:text-white"
            >
              Dashboard unavailable
            </h2>

            <p
              class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400"
            >
              Your account does not have a recognised dashboard role. Please
              contact the system administrator.
            </p>

            <div
              class="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800/70"
            >
              <span class="text-gray-500 dark:text-gray-400">
                Current role:
              </span>

              <span
                class="ml-1 font-semibold text-gray-800 dark:text-gray-200"
              >
                {{ role || "No role assigned" }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  middleware: ["auth", "role"],
  role: [
    "Admin",
    "Dean",
    "Faculty",
    "HR",
    "Student",
  ],
});

const { user, logout } = useAuth();

/* =========================================================
   CURRENT ROLE
========================================================= */

const role = computed(() => {
  const currentRole =
    user.value?.role;

  if (
    typeof currentRole ===
    "string"
  ) {
    return currentRole;
  }

  return (
    currentRole?.name ||
    currentRole?.type ||
    ""
  );
});

/* =========================================================
   USER INFORMATION
========================================================= */

const displayName = computed(() => {
  return (
    user.value?.full_name ||
    user.value?.name ||
    user.value?.username ||
    "System User"
  );
});

const userInitials = computed(() => {
  const name =
    displayName.value.trim();

  if (!name) {
    return "U";
  }

  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part: string) =>
      part
        .charAt(0)
        .toUpperCase(),
    )
    .join("");
});

/* =========================================================
   DASHBOARD INFORMATION
========================================================= */

const dashboardTitle = computed(() => {
  switch (role.value) {
    case "Admin":
      return "Administrator Dashboard";

    case "Dean":
      return "Dean Dashboard";

    case "Faculty":
      return "Faculty Dashboard";

    case "HR":
      return "Human Resource Dashboard";

    case "Student":
      return "Student Dashboard";

    default:
      return "Dashboard";
  }
});

const dashboardDescription =
  computed(() => {
    switch (role.value) {
      case "Admin":
        return "Monitor evaluations, users, faculty performance and system activity.";

      case "Dean":
        return "Review faculty evaluations, department portfolios and departmental performance.";

      case "Faculty":
        return "View assigned evaluations, feedback, portfolio records and performance results.";

      case "HR":
        return "Review faculty and dean portfolios, verify supporting evidence, monitor expiring credentials and prepare verified records for ranking.";

      case "Student":
        return "Complete evaluations and monitor your submission progress.";

      default:
        return "Evaluation management and performance insights.";
    }
  });

const dashboardIcon = computed(() => {
  switch (role.value) {
    case "Admin":
      return "i-lucide-layout-dashboard";

    case "Dean":
      return "i-lucide-building-2";

    case "Faculty":
      return "i-lucide-presentation";

    case "HR":
      return "i-lucide-briefcase-business";

    case "Student":
      return "i-lucide-graduation-cap";

    default:
      return "i-lucide-gauge";
  }
});

/* =========================================================
   ROLE-BASED PROFILE LINKS
========================================================= */

const profilePath = computed(() => {
  switch (role.value) {
    case "HR":
      return "/hr/profile";

    default:
      return "/profile";
  }
});

const settingsPath = computed(() => {
  switch (role.value) {
    case "HR":
      return "/hr/profile";

    default:
      return "/settings";
  }
});

const profileItems = computed(() => [
  [
    {
      label:
        displayName.value,
      type: "label",
    },
  ],

  [
    {
      label: "My Profile",
      icon: "i-lucide-user",
      to: profilePath.value,
    },

    {
      label:
        "Account Settings",
      icon:
        "i-lucide-settings",
      to: settingsPath.value,
    },
  ],

  [
    {
      label: "Sign out",
      icon:
        "i-lucide-log-out",
      color: "error",
      onSelect:
        handleLogout,
    },
  ],
]);

/* =========================================================
   LOGOUT
========================================================= */

async function handleLogout() {
  try {
    await logout();

    await navigateTo(
      "/auth/login",
    );
  } catch (error) {
    console.error(
      "Logout error:",
      error,
    );
  }
}
</script>