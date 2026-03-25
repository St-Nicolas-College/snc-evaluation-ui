<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <div class="flex flex-col">
            <span class="font-semibold uppercase text-green-400 text-lg">St. Nicolas College</span>
            <span class="text-sm text-gray-500 uppercase">Evaluation System</span>
          </div>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <UPageGrid class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <UPageCard v-for="i in 4" :key="i" title="Tailwind CSS" variant="subtle"
          to="https://tailwindcss.com/docs/v4-beta"
          description="Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements."
          icon="i-simple-icons-tailwindcss" />
      </UPageGrid>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>

</script>

<style></style>