<template>

    <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Faculty Rank</span>
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
  role: ['Admin', 'Faculty']
})
</script>

<style>

</style>