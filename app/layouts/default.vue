<template>
  <UDashboardGroup>
    <UDashboardSidebar v-model:collapsed="collapsed" collapsible resizable :storage="false" class="bg-elevated/25" :ui="{
      header: 'border-b border-default',
      footer: 'border-t border-default'
    }">

      <template #header="{ collapsed }">
        <div class="flex items-center gap-3">
          <!-- <img src="/SNC-Logo.png" alt="Logo" class="w-10 h-10 rounded-lg"> -->
          <UAvatar src="/logo.png" />
          <div v-if="!collapsed" class="flex flex-col leading-tight">
            <span class="font-semibold uppercase text-sm">St. Nicolas College</span>
            <span class="text-xs text-gray-500">of Business and Technology </span>
          </div>
        </div>
      </template>
      <template #default="{ collapsed }">
        <UNavigationMenu :collapsed="collapsed" :items="items[0]" orientation="vertical" />
        <!-- <UNavigationMenu :collapsed="collapsed" :items="items[1]" orientation="vertical" class="mt-auto" /> -->
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" class="w-full" />
      </template>
    </UDashboardSidebar>
    <slot />
  </UDashboardGroup>
</template>

<script lang="ts" setup>

//@ts-nocheck
const { user, logout } = useAuth()
const collapsed = ref(false)
const sidebarKey = ref(0)
const open = ref(false)      // key to force remount

const roleMenus: Record<string, NavigationMenuItem[][]> = {
  Admin: [
    [
      { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' },
      // { label: 'Faculty', icon: 'i-lucide-user-round', to: '/admin/faculty' },
      // { label: 'Student', icon: 'i-lucide-user-round', to: '/admin/student' },
      // { label: 'Subjects', icon: 'i-lucide-notebook-text', to: '/admin/subjects' },

      {
        label: 'Evaluation',
        icon: 'i-lucide-clipboard-check',
        to: '/admin/evaluation',
        defaultOpen: open,
        type: 'trigger',
        children: [{
          label: 'Student - Faculty',
          icon: 'i-lucide-circle-small',
          to: '/admin/evaluation',
          exact: true,
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'Faculty - Dean',
          icon: 'i-lucide-circle-small',
          to: '/admin/evaluation/faculty-dean',
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'Summary',
          icon: 'i-lucide-circle-small',
          to: '/admin/evaluation/evaluation-summary',
          onSelect: () => {
            open.value = false
          }
        },
        ]
      },
      {
        label: 'Management',
        icon: 'i-lucide-user-round-cog',
        //to: '/admin/management',
        //defaultOpen: open,
        type: 'trigger',
        children: [{
          label: 'Faculty',
          icon: 'i-lucide-circle-small',
          to: '/admin/management/faculty',
          exact: true,
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'Students',
          icon: 'i-lucide-circle-small',
          to: '/admin/management/student',
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'Subjects',
          icon: 'i-lucide-circle-small',
          to: '/admin/management/subjects',
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'Section',
          icon: 'i-lucide-circle-small',
          to: '/admin/management/section',
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'Criteria',
          icon: 'i-lucide-circle-small',
          to: '/admin/management/criteria',
          onSelect: () => {
            open.value = false
          }
        },]
      },
      { label: 'Feedback', icon: 'i-lucide-circle-user-round', to: '/admin/feedback' },
      {
        label: 'Settings',
        icon: 'i-lucide-settings',
        defaultOpen: false,
        children: [{
          label: 'General'
        }, {
          label: 'Members'
        }, {
          label: 'Notifications'
        }]
      }
    ],
  ],
  Dean: [
    [
      { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' },
      // { label: 'Student', icon: 'i-lucide-user-round', to: '/student' },
      { label: 'Evaluate', icon: 'i-heroicons-clipboard-document-check', to: '/dean/evaluation'},
      { label: 'My Evaluations', icon: 'i-heroicons-user-circle', },
      { label: 'Faculty', icon: 'i-heroicons-user-circle', }
    ]
  ],
  Student: [
    [
      { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' },
      // { label: 'Student', icon: 'i-lucide-user-round', to: '/student' },
      { label: 'Evaluate', icon: 'i-heroicons-clipboard-document-check', to: '/evaluate' },
      { label: 'My Evaluations', icon: 'i-heroicons-user-circle', to: '/my-evaluations' }
    ]
  ],
  Faculty: [
    [
      { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' },
      { label: 'Evaluate', icon: 'i-heroicons-clipboard-document-check', to: '/faculty/evaluation' },
      { label: 'Results', icon: 'i-lucide-circle-user-round', to: '/faculty/results' },
      { label: 'Rank', icon: 'i-lucide-circle-user-round', to: '/faculty/rank' }
    ]
  ]
}

const items = computed(() => {
  const role = user?.value.role || 'Student'
  return roleMenus[role] || []
})

// const items: NavigationMenuItem[][] = [[{
//   label: 'Dashboard',
//   icon: 'i-lucide-layout-dashboard',
//   to: '/',
//   //active: true
// }, {
//   label: 'Student',
//   icon: 'i-lucide-user-round',
//   to: '/student'
// }, {
//   label: 'Faculty',
//   icon: 'i-lucide-circle-user-round',
//   to: '/faculty'
// },
// ], [{
//   label: 'Feedback',
//   icon: 'i-lucide-message-circle',
//   to: 'https://github.com/nuxt-ui-templates/dashboard',
//   target: '_blank'
// }, {
//   label: 'Help & Support',
//   icon: 'i-lucide-info',
//   to: 'https://github.com/nuxt/ui',
//   target: '_blank'
// }]]


// const resetSidebar = () => {
//   if (process.client) {
//     // Clear the Nuxt UI stored cookie
//     document.cookie = 'nuxt-ui:sidebar-collapsed=; Max-Age=0; path=/'

//     // Force sidebar to remount
//     sidebarKey.value++
//   }

//   // Set your default collapsed state
//   collapsed.value = true
// }



onMounted(() => {
  //resetSidebar()
  collapsed.value = false

})
</script>

<style></style>