<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar v-model:collapsed="collapsed" collapsible resizable class="bg-elevated/25" :ui="{
      header: 'border-b border-default',
      footer: 'border-t border-default'
    }">

      <template #header>

      </template>
      <template #default="{ collapsed }">
        <UNavigationMenu :collapsed="collapsed" :items="items[0]" orientation="vertical" />
        <!-- <UNavigationMenu :collapsed="collapsed" :items="items[1]" orientation="vertical" class="mt-auto" /> -->
      </template>

      <template #footer="{ collapsed }">
        <!-- <UserMenu :collapsed="collapsed" class="w-full" /> -->
      </template>
    </UDashboardSidebar>
    <slot />
  </UDashboardGroup>
</template>

<script lang="ts" setup>
//@ts-nocheck
const collapsed = ref(true)
const items: NavigationMenuItem[][] = [[{
  label: 'Dashboard',
  icon: 'i-lucide-layout-dashboard',
  to: '/',
  //active: true
}, {
  label: 'Student',
  icon: 'i-lucide-user-round',
  to: '/student'
}, {
  label: 'Faculty',
  icon: 'i-lucide-circle-user-round',
  to: '/faculty'
},
], [{
  label: 'Feedback',
  icon: 'i-lucide-message-circle',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}, {
  label: 'Help & Support',
  icon: 'i-lucide-info',
  to: 'https://github.com/nuxt/ui',
  target: '_blank'
}]]
</script>

<style></style>