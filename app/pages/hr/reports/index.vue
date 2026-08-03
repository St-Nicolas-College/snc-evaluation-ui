<template>
  <div class="space-y-6 pb-10">
    <section class="rounded-[28px] bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-700 px-6 py-7 text-white shadow-xl">
      <p class="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">Human Resource Portal</p>
      <h1 class="mt-2 text-3xl font-black">HR Reports</h1>
      <p class="mt-2 max-w-3xl text-sm text-blue-100">Open portfolio, verification, and ranking reports.</p>
    </section>

    <section v-if="links.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <UButton
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        color="neutral"
        variant="soft"
        icon="i-lucide-arrow-right"
        class="justify-between rounded-2xl p-5"
      >
        {{ link.label }}
      </UButton>
    </section>

    <section v-else class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="text-center">
        <UIcon name="i-lucide-construction" class="mx-auto size-10 text-gray-400" />
        <h2 class="mt-4 font-bold">Page ready for backend integration</h2>
        <p class="mt-2 text-sm text-gray-500">
          The route and HR role protection are already configured. Connect this page to the related backend endpoint when that module is implemented.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['HR', 'Admin']
})

const links = [{"label": "Portfolio Report", "to": "/hr/reports/portfolios"}, {"label": "Verification Report", "to": "/hr/reports/verification"}, {"label": "Ranking Report", "to": "/hr/reports/ranking"}]
</script>
