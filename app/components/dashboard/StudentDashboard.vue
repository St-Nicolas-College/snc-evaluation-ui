<template>
  <div class="space-y-6">
    <div v-if="loading" class="py-10 text-center text-gray-500">
      Loading...
    </div>

    <div v-else>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UCard>
          <div class="text-sm text-gray-500">Evaluations Submitted</div>
          <div class="text-2xl font-bold">{{ submitted }}</div>
        </UCard>

        <UCard>
          <div class="text-sm text-gray-500">Pending (manual logic)</div>
          <div class="text-2xl font-bold">{{ pending }}</div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
//@ts-nocheck
const { $api } = useNuxtApp()
const { user } = useAuth()

const loading = ref(true)
const evaluations = ref([])

const submitted = computed(() => evaluations.value.length)

// ⚠️ You can improve this later with real logic
const pending = computed(() => Math.max(0, 5 - evaluations.value.length))

onMounted(async () => {
  try {
    loading.value = true

    const res = await $api('/evaluations', {
      query: {
        'filters[user][id][$eq]': user.value?.id,
        pagination: { pageSize: 100 }
      }
    })

    evaluations.value = res.data || []
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
})
</script>

<style>

</style>