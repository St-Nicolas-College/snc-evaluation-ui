<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span>Settings</span>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
//@ts-nocheck
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Admin']
})
</script>

<style>

</style>