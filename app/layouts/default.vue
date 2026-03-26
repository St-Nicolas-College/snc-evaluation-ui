<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar :key="sidebarKey" v-model:collapsed="collapsed" collapsible resizable :storage="false" class="bg-elevated/25" :ui="{
      header: 'border-b border-default',
      footer: 'border-t border-default'
    }">

      <template #header="{ collapsed }">
        <div class="flex items-center gap-3">
          <!-- <img src="/SNC-Logo.png" alt="Logo" class="w-10 h-10 rounded-lg"> -->
          <UAvatar src="/logo.png" class="rounded-lg" />
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
const collapsed = ref(true)
const sidebarKey = ref(0)             // key to force remount

const roleMenus: Record<string, NavigationMenuItem[][]> = {
  Admin: [
    [
      { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' },
      { label: 'Student', icon: 'i-lucide-user-round', to: '/student' },
      { label: 'Faculty', icon: 'i-lucide-circle-user-round', to: '/faculty' }
    ],
  ],
  Student: [
    [
      { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' },
      { label: 'Student', icon: 'i-lucide-user-round', to: '/student' }
    ]
  ],
  Faculty: [
    [
      { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' },
      { label: 'Faculty', icon: 'i-lucide-circle-user-round', to: '/faculty' }
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


const resetSidebar = () => {
  if (process.client) {
    // Clear the Nuxt UI stored cookie
    document.cookie = 'nuxt-ui:sidebar-collapsed=; Max-Age=0; path=/'

    // Force sidebar to remount
    sidebarKey.value++
  }

  // Set your default collapsed state
  collapsed.value = true
}
onMounted(() => {
  resetSidebar()
})
</script>

<style></style>