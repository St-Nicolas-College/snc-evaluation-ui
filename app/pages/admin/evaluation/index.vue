<template>
 <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Admin Evaluation</span>
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