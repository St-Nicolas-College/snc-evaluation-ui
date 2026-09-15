<script setup lang="ts">
// @ts-nocheck

import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const colorMode = useColorMode();
const toast = useToast();

const { user, logout } = useAuth();

const collapsed = ref(false);
const mobileOpen = ref(false);
const logoutOpen = ref(false);

const openGroups = ref<string[]>([
  "Evaluation",
  "Management",
  "Evaluation Results",
  "Management",
  "Portfolio Management",
  "Ranking",
  "Ranking Configuration",
  "Reports",
]);

/* =========================================================
   USER INFORMATION
========================================================= */

const currentRole = computed(() => {
  return user.value?.role || "Student";
});

const displayName = computed(() => {
  return (
    user.value?.full_name ||
    user.value?.name ||
    user.value?.username ||
    "System User"
  );
});

const userEmail = computed(() => {
  return user.value?.email || "No email address";
});

const userAvatar = computed(() => {
  const avatar = user.value?.avatar || user.value?.profile_picture;

  if (typeof avatar === "string") {
    return avatar;
  }

  return avatar?.url || undefined;
});

const userInitials = computed(() => {
  return displayName.value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part: string) => part.charAt(0).toUpperCase())
    .join("");
});

/* =========================================================
   ROLE INFORMATION
========================================================= */

const roleInformationMap: Record<string, any> = {
  Admin: {
    label: "Administrator",
    description: "System-wide management",
    icon: "i-lucide-shield-check",
    color: "primary",
  },

  Dean: {
    label: "Dean",
    description: "Department management",
    icon: "i-lucide-building-2",
    color: "success",
  },

  Faculty: {
    label: "Faculty",
    description: "Faculty evaluation portal",
    icon: "i-lucide-presentation",
    color: "primary",
  },

  Student: {
    label: "Student",
    description: "Student evaluation portal",
    icon: "i-lucide-graduation-cap",
    color: "info",
  },

  HR: {
    label: "Human Resource",
    description: "Portfolio verification and personnel records",
    icon: "i-lucide-briefcase-business",
    color: "info",
  },
};

const roleInformation = computed(() => {
  return roleInformationMap[currentRole.value] || roleInformationMap.Student;
});

/* =========================================================
   ROLE-BASED NAVIGATION
========================================================= */

const roleMenus: Record<string, NavigationMenuItem[]> = {
  Admin: [
    {
      label: "Dashboard",
      icon: "i-lucide-layout-dashboard",
      to: "/",
      exact: true,
    },
    {
      label: "Evaluation",
      icon: "i-lucide-clipboard-check",
      children: [
        {
          label: "Student – Faculty",
          icon: "i-lucide-graduation-cap",
          to: "/admin/evaluation/student-faculty",
        },
        {
          label: "Faculty – Dean",
          icon: "i-lucide-building-2",
          to: "/admin/evaluation/faculty-dean",
        },
        {
          label: "Dean – Faculty",
          icon: "i-lucide-presentation",
          to: "/admin/evaluation/dean-faculty",
        },
        {
          label: "Overall Feedback",
          icon: "i-lucide-message-square-text",
          to: "/admin/evaluation/overall-feedbacks",
        },
        // {
        //   label: "Evaluation Results",
        //   icon: "i-lucide-chart-no-axes-combined",
        //   to: "/admin/evaluation/results",
        //   exact: true,
        // },
      ],
    },
    {
      label: "Management",
      icon: "i-lucide-settings-2",
      children: [
        {
          label: "Faculty",
          icon: "i-lucide-users-round",
          to: "/admin/management/faculty",
          exact: true,
        },
        {
          label: "Students",
          icon: "i-lucide-graduation-cap",
          to: "/admin/management/student",
          exact: true,
        },
        {
          label: "Departments",
          icon: "i-lucide-building-2",
          to: "/admin/management/department",
          exact: true,
        },
        {
          label: "Courses",
          icon: "i-lucide-book-copy",
          to: "/admin/management/course",
          exact: true,
        },
        // {
        //   label: "Subjects",
        //   icon: "i-lucide-book-open",
        //   to: "/admin/management/subjects",
        //   exact: true,
        // },
        {
          label: "Evaluation Types",
          icon: "i-lucide-workflow",
          to: "/admin/management/evaluation-type",
        },
        {
          label: "Evaluation Sections",
          icon: "i-lucide-panels-top-left",
          to: "/admin/management/section",
          exact: true,
        },
        {
          label: "Evaluation Criteria",
          icon: "i-lucide-list-checks",
          to: "/admin/management/criteria",
          exact: true,
        },
      ],
    },
    {
      label: "Evaluation Reports",
      icon: "i-lucide-file-chart-column",
      to: "/admin/reports/evaluations",
    },
  ],

  Dean: [
    {
      label: "Dashboard",
      icon: "i-lucide-layout-dashboard",
      to: "/",
      exact: true,
    },
    {
      label: "Evaluate Faculty",
      icon: "i-lucide-clipboard-pen-line",
      to: "/dean/evaluation",
    },
    {
      label: "My Evaluations",
      icon: "i-lucide-file-chart-column",
      to: "/dean/my-evaluations",
    },
    {
      label: "Department Faculty",
      icon: "i-lucide-users-round",
      to: "/dean/faculty",
      exact: true,
    },

    {
      label: "Class Assignments",
      icon: "i-lucide-users-round",
      to: "/dean/class-assignments",
    },
    {
      label: "Faculty Ranking",
      icon: "i-lucide-trophy",
      to: "/dean/faculty-ranking",
      exact: true,
    },
    {
      label: "Account Settings",
      icon: "i-lucide-settings",
      to: "/dean/settings",
    },
  ],

  Faculty: [
  {
    label: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    to: "/",
    exact: true,
  },
  {
    label: "Evaluate Dean",
    icon: "i-lucide-clipboard-pen-line",
    to: "/faculty/evaluation",
  },
  {
    label: "My Results",
    icon: "i-lucide-chart-column-big",
    to: "/faculty/results",
  },
  {
    label: "My Dean Evaluations",
    icon: "i-lucide-file-clock",
    to: "/faculty/dean-evaluation-records",
  },
  {
    label: "Account Settings",
    icon: "i-lucide-settings",
    to: "/faculty/settings",
  },
],

  HR: [
    {
      label: "Dashboard",
      icon: "i-lucide-layout-dashboard",
      to: "/",
      exact: true,
    },

    {
      label: "Evaluation Results",
      icon: "i-lucide-chart-no-axes-combined",
      children: [
        {
          label: "Student – Faculty",
          icon: "i-lucide-graduation-cap",
          to: "/admin/evaluation/student-faculty",
        },
        {
          label: "Faculty – Dean",
          icon: "i-lucide-building-2",
          to: "/admin/evaluation/faculty-dean",
        },
        {
          label: "Dean – Faculty",
          icon: "i-lucide-presentation",
          to: "/admin/evaluation/dean-faculty",
        },
        {
          label: "Overall Feedback",
          icon: "i-lucide-message-square-text",
          to: "/admin/evaluation/overall-feedbacks",
        },
      ],
    },

    {
      label: "Management",
      icon: "i-lucide-settings-2",
      children: [
        {
          label: "Faculty",
          icon: "i-lucide-users-round",
          to: "/admin/management/faculty",
          exact: true,
        },
        {
          label: "Students",
          icon: "i-lucide-graduation-cap",
          to: "/admin/management/student",
          exact: true,
        },
        {
          label: "Departments",
          icon: "i-lucide-building-2",
          to: "/admin/management/department",
          exact: true,
        },
        {
          label: "Courses",
          icon: "i-lucide-book-copy",
          to: "/admin/management/course",
          exact: true,
        },
        {
          label: "Evaluation Types",
          icon: "i-lucide-workflow",
          to: "/admin/management/evaluation-type",
        },
        {
          label: "Evaluation Sections",
          icon: "i-lucide-panels-top-left",
          to: "/admin/management/section",
          exact: true,
        },
        {
          label: "Evaluation Criteria",
          icon: "i-lucide-list-checks",
          to: "/admin/management/criteria",
          exact: true,
        },
      ],
    },

    {
      label: "Faculty Portfolios",
      icon: "i-lucide-folder-kanban",
      to: "/hr/portfolio",
    },

    {
      label: "Faculty Ranking",
      icon: "i-lucide-trophy",
      children: [
        {
          label: "Ranking Management",
          icon: "i-lucide-list-ordered",
          to: "/hr/ranking",
          exact: true,
        },
        {
          label: "Ranking Analytics",
          icon: "i-lucide-chart-no-axes-combined",
          to: "/hr/ranking/analytics",
        },
      ],
    },

    {
      label: "Ranking Configuration",
      icon: "i-lucide-settings-2",
      children: [
        {
          label: "Ranking Schemes",
          icon: "i-lucide-layers-3",
          to: "/hr/ranking-schemes",
        },
      ],
    },

    {
      label: "Reports",
      icon: "i-lucide-files",
      children: [
        {
          label: "Reports Overview",
          icon: "i-lucide-layout-dashboard",
          to: "/hr/reports",
          exact: true,
        },
        {
          label: "Faculty Ranking Report",
          icon: "i-lucide-file-chart-column",
          to: "/hr/reports/ranking",
        },
      ],
    },

    // {
    //   label: "My Profile",
    //   icon: "i-lucide-user-round",
    //   to: "/hr/profile",
    // },
  ],

  Student: [
    {
      label: "Dashboard",
      icon: "i-lucide-layout-dashboard",
      to: "/",
      exact: true,
    },
    {
      label: "Evaluation",
      icon: "i-lucide-clipboard-check",
      children: [
        {
          label: "Evaluate Faculty",
          icon: "i-lucide-presentation",
          to: "/student/evaluate",
          exact: true,
        },
        {
          label: "Overall Feedbacks",
          icon: "i-lucide-school",
          to: "/student/overall-performance",
        },
      ],
    },
    {
      label: "My Evaluations",
      icon: "i-lucide-history",
      to: "/student/my-evaluations",
    },
    {
      label: "My Teachers",
      icon: "i-lucide-users-round",
      to: "/student/my-teachers",
    },
    {
      label: "Account Settings",
      icon: "i-lucide-settings-2",
      to: "/student/settings",
    },
  ],
};

const navigationItems = computed(() => {
  return roleMenus[currentRole.value] || roleMenus.Student;
});

/* =========================================================
   ACTIVE ROUTE HELPERS
========================================================= */

const normalizePath = (path: string) => {
  if (path === "/") return "/";

  return path.replace(/\/+$/, "");
};

const isActive = (path?: string, exact = false) => {
  if (!path) return false;

  const currentPath = normalizePath(route.path);
  const targetPath = normalizePath(path);

  if (exact || targetPath === "/") {
    return currentPath === targetPath;
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
};

const isGroupActive = (item: any) => {
  return item.children?.some((child: any) => isActive(child.to, child.exact));
};

const isGroupOpen = (label: string) => {
  return openGroups.value.includes(label);
};

const toggleGroup = (label: string) => {
  if (isGroupOpen(label)) {
    openGroups.value = openGroups.value.filter((item) => item !== label);
  } else {
    openGroups.value.push(label);
  }
};

const closeMobileSidebar = () => {
  mobileOpen.value = false;
};

/* =========================================================
   PAGE INFORMATION
========================================================= */

const dashboardPageInformation: Record<string, any> = {
  Admin: {
    title: "Administrator Dashboard",
    description: "Monitor evaluation activity and manage the system.",
    icon: "i-lucide-shield-check",
  },

  Dean: {
    title: "Dean Dashboard",
    description: "Review faculty evaluations and departmental performance.",
    icon: "i-lucide-building-2",
  },

  Faculty: {
    title: "Faculty Dashboard",
    description: "Review your evaluations and performance insights.",
    icon: "i-lucide-presentation",
  },

  Student: {
    title: "Student Dashboard",
    description: "Complete and monitor your assigned evaluations.",
    icon: "i-lucide-graduation-cap",
  },

  HR: {
    title: "Human Resource Dashboard",
    description:
      "Monitor portfolio verification, personnel records, and ranking readiness.",
    icon: "i-lucide-briefcase-business",
  },
};

const pageInformationMap: Record<string, any> = {
  "/admin/evaluation": {
    title: "Student – Faculty Evaluations",
    description: "Manage student evaluation records.",
    icon: "i-lucide-clipboard-check",
  },

  "/admin/evaluation/student-faculty": {
    title: "Student – Faculty Results",
    description: "Review student evaluations of faculty members.",
    icon: "i-lucide-graduation-cap",
  },

  "/admin/evaluation/faculty-dean": {
    title: "Faculty – Dean Results",
    description: "Review faculty evaluations of Deans and Coordinators.",
    icon: "i-lucide-building-2",
  },

  "/admin/evaluation/dean-faculty": {
    title: "Dean – Faculty Results",
    description: "Review Dean evaluations of faculty members.",
    icon: "i-lucide-presentation",
  },

  "/admin/evaluation/overall-feedback": {
    title: "Overall Feedback",
    description: "Review institution-wide feedback.",
    icon: "i-lucide-message-square-text",
  },

  "/admin/evaluation/overall-feedbacks": {
    title: "Overall Feedback Results",
    description:
      "Review Student – School written feedback and school-wide insights.",
    icon: "i-lucide-message-square-text",
  },

  "/admin/management/faculty": {
    title: "Faculty Management",
    description: "Manage faculty records and accounts.",
    icon: "i-lucide-users-round",
  },

  "/admin/management/student": {
    title: "Student Management",
    description: "Manage student records and accounts.",
    icon: "i-lucide-graduation-cap",
  },

  "/admin/management/department": {
    title: "Department Management",
    description: "Manage academic departments.",
    icon: "i-lucide-building-2",
  },

  "/admin/management/evaluation-type": {
    title: "Evaluation Type Management",
    description: "Manage evaluation response types, scales, and labels.",
    icon: "i-lucide-workflow",
  },

  "/admin/management/course": {
    title: "Course Management",
    description: "Manage academic courses.",
    icon: "i-lucide-book-copy",
  },

  "/admin/management/subjects": {
    title: "Subject Management",
    description: "Manage academic subjects.",
    icon: "i-lucide-book-open",
  },

  "/admin/management/section": {
    title: "Evaluation Section Management",
    description: "Manage evaluation sections.",
    icon: "i-lucide-panels-top-left",
  },

  "/admin/management/criteria": {
    title: "Evaluation Criteria",
    description: "Manage evaluation sections and criteria.",
    icon: "i-lucide-list-checks",
  },

  "/admin/evaluation/results": {
    title: "Evaluation Results",
    description: "Review and analyse all evaluation results.",
    icon: "i-lucide-chart-no-axes-combined",
  },

  "/dean/evaluation": {
    title: "Evaluate Faculty",
    description: "Complete faculty performance evaluations.",
    icon: "i-lucide-clipboard-pen-line",
  },

  "/dean/my-evaluations": {
    title: "My Evaluations",
    description: "Review evaluations submitted for you.",
    icon: "i-lucide-file-chart-column",
  },

  "/dean/faculty": {
    title: "Department Faculty",
    description: "Manage faculty members in your department.",
    icon: "i-lucide-users-round",
  },

  "/dean/faculty-ranking": {
    title: "Faculty Ranking",
    description: "Review department faculty performance rankings.",
    icon: "i-lucide-trophy",
  },

  "/faculty/evaluation": {
    title: "Evaluate Dean",
    description: "Complete your dean evaluation.",
    icon: "i-lucide-clipboard-pen-line",
  },

  "/faculty/results": {
    title: "My Results",
    description: "Review your evaluation results.",
    icon: "i-lucide-chart-column-big",
  },

  "/faculty/dean-evaluation-records": {
    title: "My Dean Evaluations",
    description: "Review evaluations you submitted for your Dean.",
    icon: "i-lucide-file-clock",
  },

  "/hr/portfolio": {
    title: "All Portfolios",
    description: "Monitor faculty and dean portfolio completion and status.",
    icon: "i-lucide-folders",
  },

  "/hr/portfolio/verification": {
    title: "Portfolio Verification Queue",
    description: "Review submitted portfolio entries and supporting evidence.",
    icon: "i-lucide-list-checks",
  },

  "/hr/portfolio/history": {
    title: "Verification History",
    description: "Review the audit trail of HR portfolio decisions.",
    icon: "i-lucide-history",
  },

  "/hr/portfolio/expiring": {
    title: "Expiring Credentials",
    description: "Monitor licenses and certifications nearing expiration.",
    icon: "i-lucide-calendar-clock",
  },

  "/hr/portfolio/reports": {
    title: "Portfolio Reports",
    description: "Open portfolio completion and verification reports.",
    icon: "i-lucide-file-chart-column",
  },

  "/hr/ranking": {
    title: "Ranking Overview",
    description: "Monitor faculty ranking readiness and verified records.",
    icon: "i-lucide-trophy",
  },

  "/hr/ranking/verification": {
    title: "Ranking Verification",
    description: "Confirm that faculty records are ready for ranking.",
    icon: "i-lucide-shield-check",
  },

  "/hr/employees": {
    title: "Employee Records",
    description: "Browse faculty and dean personnel records.",
    icon: "i-lucide-users",
  },

  "/hr/reports": {
    title: "HR Reports",
    description: "Open portfolio, verification, and ranking reports.",
    icon: "i-lucide-files",
  },

  "/hr/reports/portfolios": {
    title: "Portfolio Report",
    description: "Review portfolio completion and verification status.",
    icon: "i-lucide-folder-output",
  },

  "/hr/reports/verification": {
    title: "Verification Report",
    description: "Review HR verification decisions and audit records.",
    icon: "i-lucide-file-check-2",
  },

  "/hr/reports/ranking": {
    title: "Ranking Report",
    description: "Review faculty ranking readiness and results.",
    icon: "i-lucide-chart-column",
  },

  "/hr/profile": {
    title: "My HR Profile",
    description: "Review your Human Resource account information.",
    icon: "i-lucide-user-round",
  },

  "/student/evaluate": {
    title: "Evaluate Faculty",
    description: "Submit your faculty evaluations.",
    icon: "i-lucide-clipboard-pen-line",
  },

  "/student/overall-performance": {
    title: "Overall Performance",
    description: "Submit feedback about school services.",
    icon: "i-lucide-school",
  },

  "/student/my-evaluations": {
    title: "My Evaluations",
    description: "Review your completed evaluations.",
    icon: "i-lucide-history",
  },
};

const currentPage = computed(() => {
  const isRoleDashboard =
    route.path === "/" || (currentRole.value === "HR" && route.path === "/hr");

  if (isRoleDashboard) {
    return (
      dashboardPageInformation[currentRole.value] ||
      dashboardPageInformation.Student
    );
  }

  const page = pageInformationMap[route.path];

  if (page) return page;

  /*
   * Dynamic HR detail pages contain a documentId in the URL,
   * so they cannot be represented as exact keys in pageInformationMap.
   */
  if (route.path.startsWith("/hr/portfolio/entry/")) {
    return {
      title: "Portfolio Entry Review",
      description: "Review portfolio evidence and record the HR decision.",
      icon: "i-lucide-file-search-2",
    };
  }

  if (
    route.path.startsWith("/hr/portfolio/faculty/") ||
    route.path.startsWith("/hr/portfolio/dean/")
  ) {
    return {
      title: "Portfolio Details",
      description: "Review the complete faculty or dean portfolio.",
      icon: "i-lucide-folder-open",
    };
  }

  if (route.path.startsWith("/hr/ranking/faculty/")) {
    return {
      title: "Faculty Ranking Record",
      description: "Review an individual faculty ranking record.",
      icon: "i-lucide-trophy",
    };
  }

  if (route.path.startsWith("/hr/employees/")) {
    return {
      title: "Employee Profile",
      description: "Review the employee record and connected portfolio.",
      icon: "i-lucide-user-round-search",
    };
  }

  const segment = route.path.split("/").filter(Boolean).at(-1) || "Dashboard";

  const title = segment
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title,
    description: `${roleInformation.value.label} evaluation portal.`,
    icon: "i-lucide-panel-top",
  };
});

const todayLabel = computed(() => {
  return new Date().toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
});

/* =========================================================
   THEME
========================================================= */

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

/* =========================================================
   LOGOUT
========================================================= */

const confirmLogout = async () => {
  try {
    logoutOpen.value = false;
    await logout();
  } catch (error) {
    console.error("Logout error:", error);

    toast.add({
      title: "Unable to sign out",
      description: "Please try again.",
      icon: "i-lucide-triangle-alert",
      color: "error",
    });
  }
};

/* =========================================================
   ROUTE WATCHER
========================================================= */

watch(
  () => route.path,
  () => {
    mobileOpen.value = false;

    navigationItems.value.forEach((item: any) => {
      if (item.children && isGroupActive(item) && !isGroupOpen(item.label)) {
        openGroups.value.push(item.label);
      }
    });
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div
    class="min-h-screen bg-[#f4f8f6] text-slate-900 dark:bg-gray-950 dark:text-slate-100"
  >
    <!-- =========================================================
      MOBILE BACKDROP
    ========================================================== -->
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-40 bg-slate-950/65 backdrop-blur-sm lg:hidden"
        @click="mobileOpen = false"
      />
    </Transition>

    <!-- =========================================================
      SNC ID SYSTEM-STYLE SIDEBAR
    ========================================================== -->
    <aside
      class="fixed inset-y-0 left-0 z-50 overflow-hidden border-r border-white/10 bg-[#0f172a]/98 shadow-2xl backdrop-blur-2xl transition-all duration-300"
      :class="[
        collapsed ? 'w-20' : 'w-64 xl:w-68',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <div class="flex h-full flex-col">
        <!-- SIDEBAR BRAND -->
        <div
          class="flex h-[82px] shrink-0 items-center border-b border-white/10 px-4"
        >
          <NuxtLink
            to="/"
            class="flex min-w-0 flex-1 items-center gap-3"
            @click="closeMobileSidebar"
          >
            <div
              class="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-1 shadow-[0_10px_30px_rgba(16,185,129,0.38)]"
            >
              <div
                class="flex size-full items-center justify-center rounded-[13px] bg-white"
              >
                <img
                  src="/logo.png"
                  alt="St. Nicolas College"
                  class="size-9 object-contain"
                />
              </div>
            </div>

            <Transition
              enter-active-class="transition duration-200"
              enter-from-class="-translate-x-2 opacity-0"
              enter-to-class="translate-x-0 opacity-100"
              leave-active-class="transition duration-150"
              leave-from-class="opacity-100"
              leave-to-class="-translate-x-2 opacity-0"
            >
              <div v-if="!collapsed" class="min-w-0">
                <h1
                  class="truncate text-sm font-semibold tracking-tight text-white"
                >
                  SNC Evaluation System
                </h1>

                <p class="mt-0.5 truncate text-[11px] text-slate-400">
                  Performance & Feedback
                </p>
              </div>
            </Transition>
          </NuxtLink>

          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            square
            class="ml-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
            @click="mobileOpen = false"
          />
        </div>

        <!-- COLLAPSE BUTTON -->
        <div class="hidden shrink-0 px-3 py-3 lg:block">
          <UTooltip
            :text="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
            :delay-duration="0"
          >
            <UButton
              block
              color="neutral"
              variant="soft"
              :icon="
                collapsed
                  ? 'i-lucide-panel-right-open'
                  : 'i-lucide-panel-left-close'
              "
              class="rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              @click="collapsed = !collapsed"
            >
              <span v-if="!collapsed"> Collapse Sidebar </span>
            </UButton>
          </UTooltip>
        </div>

        <!-- ROLE CARD -->
        <div v-if="!collapsed" class="shrink-0 px-3 pb-3">
          <div
            class="relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-white/[0.06] p-3 backdrop-blur-xl"
          >
            <div
              class="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full bg-emerald-500/15 blur-2xl"
            />

            <div class="relative flex items-center gap-3">
              <div
                class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300"
              >
                <UIcon :name="roleInformation.icon" class="size-4.5" />
              </div>

              <div class="min-w-0">
                <p class="truncate text-xs font-semibold text-white">
                  {{ roleInformation.label }} Portal
                </p>

                <p class="mt-0.5 truncate text-[10px] text-slate-400">
                  {{ roleInformation.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- NAVIGATION -->
        <nav class="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          <p
            v-if="!collapsed"
            class="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500"
          >
            Main Navigation
          </p>

          <div class="space-y-1">
            <template v-for="item in navigationItems" :key="item.label">
              <!-- NORMAL LINK -->
              <UTooltip
                v-if="!item.children"
                :text="collapsed ? item.label : ''"
                :disabled="!collapsed"
                :delay-duration="0"
              >
                <NuxtLink
                  :to="item.to"
                  class="group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                  :class="[
                    isActive(item.to, item.exact)
                      ? 'bg-white/10 text-white shadow-lg backdrop-blur'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white',
                    collapsed ? 'justify-center' : '',
                  ]"
                  @click="closeMobileSidebar"
                >
                  <span
                    v-if="isActive(item.to, item.exact) && !collapsed"
                    class="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-emerald-400"
                  />

                  <div
                    class="flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200"
                    :class="
                      isActive(item.to, item.exact)
                        ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'
                    "
                  >
                    <UIcon :name="item.icon" class="size-4" />
                  </div>

                  <span v-if="!collapsed" class="truncate">
                    {{ item.label }}
                  </span>
                </NuxtLink>
              </UTooltip>

              <!-- COLLAPSED GROUP POPOVER -->
              <UPopover
                v-else-if="collapsed"
                :content="{
                  side: 'right',
                  align: 'start',
                  sideOffset: 10,
                }"
              >
                <UTooltip :text="item.label" :delay-duration="0">
                  <button
                    type="button"
                    class="group relative flex w-full items-center justify-center rounded-2xl px-3 py-2.5 text-slate-400 transition-all hover:bg-white/5 hover:text-white"
                    :class="isGroupActive(item) ? 'bg-white/10 text-white' : ''"
                  >
                    <div
                      class="flex size-9 items-center justify-center rounded-xl transition-all"
                      :class="
                        isGroupActive(item)
                          ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25'
                          : 'bg-white/5 group-hover:bg-white/10'
                      "
                    >
                      <UIcon :name="item.icon" class="size-4" />
                    </div>
                  </button>
                </UTooltip>

                <template #content>
                  <div
                    class="w-60 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900"
                  >
                    <p
                      class="px-3 py-2 text-xs font-semibold text-gray-900 dark:text-white"
                    >
                      {{ item.label }}
                    </p>

                    <NuxtLink
                      v-for="child in item.children"
                      :key="child.label"
                      :to="child.to"
                      class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
                      :class="
                        isActive(child.to, child.exact)
                          ? 'bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                      "
                    >
                      <UIcon :name="child.icon" class="size-4" />

                      {{ child.label }}
                    </NuxtLink>
                  </div>
                </template>
              </UPopover>

              <!-- EXPANDED GROUP -->
              <div v-else>
                <button
                  type="button"
                  class="group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                  :class="
                    isGroupActive(item)
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  "
                  @click="toggleGroup(item.label)"
                >
                  <span
                    v-if="isGroupActive(item)"
                    class="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-emerald-400"
                  />

                  <div
                    class="flex size-9 shrink-0 items-center justify-center rounded-xl transition-all"
                    :class="
                      isGroupActive(item)
                        ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'
                    "
                  >
                    <UIcon :name="item.icon" class="size-4" />
                  </div>

                  <span class="min-w-0 flex-1 truncate text-left">
                    {{ item.label }}
                  </span>

                  <UIcon
                    name="i-lucide-chevron-down"
                    class="size-4 shrink-0 transition-transform duration-200"
                    :class="isGroupOpen(item.label) ? 'rotate-180' : ''"
                  />
                </button>

                <Transition
                  enter-active-class="transition-all duration-200"
                  enter-from-class="-translate-y-1 opacity-0"
                  enter-to-class="translate-y-0 opacity-100"
                  leave-active-class="transition-all duration-150"
                  leave-from-class="translate-y-0 opacity-100"
                  leave-to-class="-translate-y-1 opacity-0"
                >
                  <div
                    v-if="isGroupOpen(item.label)"
                    class="ml-7 mt-1 space-y-1 border-l border-white/10 pl-3"
                  >
                    <NuxtLink
                      v-for="child in item.children"
                      :key="child.label"
                      :to="child.to"
                      class="group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all"
                      :class="
                        isActive(child.to, child.exact)
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'text-slate-500 hover:bg-white/5 hover:text-white'
                      "
                      @click="closeMobileSidebar"
                    >
                      <UIcon :name="child.icon" class="size-3.5 shrink-0" />

                      <span class="truncate">
                        {{ child.label }}
                      </span>
                    </NuxtLink>
                  </div>
                </Transition>
              </div>
            </template>
          </div>
        </nav>

        <!-- USER FOOTER -->
        <div class="shrink-0 border-t border-white/10 p-3">
          <div
            class="rounded-3xl border border-white/10 bg-white/5 p-3 text-white backdrop-blur-xl"
            :class="collapsed ? 'px-2' : ''"
          >
            <div
              class="flex items-center"
              :class="collapsed ? 'justify-center' : 'gap-3'"
            >
              <UAvatar
                :src="userAvatar"
                :alt="displayName"
                :text="userInitials"
                size="md"
                class="shrink-0 ring-2 ring-emerald-500/20"
              />

              <div v-if="!collapsed" class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold">
                  {{ displayName }}
                </p>

                <div class="mt-0.5 flex items-center gap-1.5">
                  <span class="size-1.5 rounded-full bg-emerald-400" />

                  <p class="truncate text-xs text-slate-400">
                    {{ currentRole }}
                  </p>
                </div>
              </div>
            </div>

            <UTooltip
              :text="collapsed ? 'Sign out' : ''"
              :disabled="!collapsed"
              :delay-duration="0"
            >
              <UButton
                color="error"
                variant="soft"
                icon="i-lucide-log-out"
                class="mt-3 rounded-xl"
                :block="!collapsed"
                :square="collapsed"
                @click="logoutOpen = true"
              >
                <span v-if="!collapsed"> Sign Out </span>
              </UButton>
            </UTooltip>
          </div>
        </div>
      </div>
    </aside>

    <!-- =========================================================
      MAIN APPLICATION AREA
    ========================================================== -->
    <div
      class="min-h-screen min-w-0 transition-[padding] duration-300"
      :class="collapsed ? 'lg:pl-20' : 'lg:pl-64 xl:pl-68'"
    >
      <!-- MOBILE HEADER -->
      <header
        class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-emerald-100 bg-[#f4f8f6]/90 px-4 backdrop-blur-2xl lg:hidden dark:border-gray-800 dark:bg-gray-950/90"
      >
        <div class="flex min-w-0 items-center gap-3">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
          >
            <img
              src="/logo.png"
              alt="SNC"
              class="size-8 rounded-lg bg-white object-contain p-0.5"
            />
          </div>

          <div class="min-w-0">
            <p
              class="truncate text-sm font-bold text-slate-900 dark:text-white"
            >
              SNC Evaluation System
            </p>

            <p class="truncate text-xs text-slate-500 dark:text-slate-400">
              {{ currentPage.title }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <UButton
            :icon="
              colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'
            "
            color="neutral"
            variant="ghost"
            square
            @click="toggleColorMode"
          />

          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-menu"
            square
            @click="mobileOpen = true"
          />
        </div>
      </header>

      <!-- DESKTOP TOP BAR -->
      <header
        class="sticky top-0 z-30 hidden h-[74px] items-center justify-between border-b border-emerald-100 bg-white/80 px-6 backdrop-blur-2xl lg:flex dark:border-gray-800 dark:bg-gray-950/85"
      >
        <div class="flex min-w-0 items-center gap-3">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
          >
            <UIcon :name="currentPage.icon" class="size-5" />
          </div>

          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h2
                class="truncate text-base font-bold text-slate-900 dark:text-white"
              >
                {{ currentPage.title }}
              </h2>

              <UBadge :color="roleInformation.color" variant="subtle" size="sm">
                {{ currentRole }}
              </UBadge>
            </div>

            <p
              class="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400"
            >
              {{ currentPage.description }}
            </p>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <div
            class="hidden items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-xs text-emerald-700 xl:flex dark:border-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-400"
          >
            <UIcon name="i-lucide-calendar-days" class="size-4" />

            {{ todayLabel }}
          </div>

          <UTooltip
            :text="
              colorMode.value === 'dark'
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            "
          >
            <UButton
              :icon="
                colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'
              "
              color="neutral"
              variant="ghost"
              square
              class="rounded-xl"
              @click="toggleColorMode"
            />
          </UTooltip>

          <div class="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-800" />

          <div class="flex items-center gap-3 rounded-xl px-2 py-1.5">
            <UAvatar
              :src="userAvatar"
              :alt="displayName"
              :text="userInitials"
              size="sm"
              class="ring-2 ring-emerald-100 dark:ring-emerald-950"
            />

            <div class="hidden min-w-0 xl:block">
              <p
                class="max-w-36 truncate text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                {{ displayName }}
              </p>

              <p class="mt-0.5 text-[10px] text-slate-400">
                {{ currentRole }}
              </p>
            </div>
          </div>
        </div>
      </header>

      <!-- SCROLLABLE CONTENT -->
      <main class="min-w-0 overflow-x-hidden bg-[#f4f8f6] dark:bg-gray-950">
        <div
          class="mx-auto w-full max-w-[1680px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8"
        >
          <slot />
        </div>
      </main>
    </div>

    <!-- =========================================================
      LOGOUT MODAL
    ========================================================== -->
    <UModal v-model:open="logoutOpen">
      <template #content>
        <div
          class="relative overflow-hidden rounded-[28px] border border-white/20 bg-white/95 shadow-[0_20px_80px_rgba(15,23,42,0.20)] backdrop-blur-2xl dark:border-gray-800 dark:bg-gray-900/95"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-red-50/70 via-white to-emerald-50/40 dark:from-red-950/20 dark:via-gray-900 dark:to-emerald-950/20"
          />

          <div
            class="absolute right-0 top-0 size-40 rounded-full bg-red-500/10 blur-3xl"
          />

          <div
            class="absolute bottom-0 left-0 size-40 rounded-full bg-emerald-500/10 blur-3xl"
          />

          <div class="relative p-7">
            <div
              class="mx-auto flex size-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-[0_10px_40px_rgba(239,68,68,0.35)]"
            >
              <UIcon name="i-lucide-log-out" class="size-10" />
            </div>

            <div class="mt-5 text-center">
              <h2
                class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Sign out of your account?
              </h2>

              <p
                class="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400"
              >
                You are about to leave the SNC Evaluation System. You can sign
                in again at any time.
              </p>
            </div>

            <div
              class="mt-6 rounded-3xl border border-emerald-100 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-emerald-950 dark:bg-gray-950/50"
            >
              <div class="flex items-center gap-3">
                <UAvatar
                  :src="userAvatar"
                  :alt="displayName"
                  :text="userInitials"
                  size="lg"
                  class="ring-2 ring-emerald-100 dark:ring-emerald-950"
                />

                <div class="min-w-0 flex-1 text-left">
                  <p
                    class="truncate text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    {{ displayName }}
                  </p>

                  <p
                    class="truncate text-xs text-slate-500 dark:text-slate-400"
                  >
                    {{ userEmail }}
                  </p>

                  <UBadge
                    :color="roleInformation.color"
                    variant="subtle"
                    size="sm"
                    class="mt-2"
                  >
                    {{ currentRole }}
                  </UBadge>
                </div>
              </div>
            </div>

            <div class="mt-7 flex gap-3">
              <UButton
                block
                color="neutral"
                variant="soft"
                size="lg"
                class="rounded-2xl"
                @click="logoutOpen = false"
              >
                Stay Logged In
              </UButton>

              <UButton
                block
                color="error"
                size="lg"
                icon="i-lucide-log-out"
                class="rounded-2xl shadow-lg shadow-red-500/20"
                @click="confirmLogout"
              >
                Sign Out
              </UButton>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}

::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}

::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.35);
  border-radius: 999px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.55);
}

::-webkit-scrollbar-track {
  background: transparent;
}
</style>
