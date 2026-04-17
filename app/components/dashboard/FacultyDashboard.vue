<template>
<div class="space-y-6">
    <div v-if="loading" class="py-10 text-center text-gray-500">
      Loading your evaluations...
    </div>

    <div v-else>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <UCard>
          <div class="text-sm text-gray-500">My Evaluations</div>
          <div class="text-2xl font-bold">{{ total }}</div>
        </UCard>

        <UCard>
          <div class="text-sm text-gray-500">Average Score</div>
          <div class="text-2xl font-bold">{{ average }}</div>
        </UCard>

        <UCard>
          <div class="text-sm text-gray-500">Latest Comment</div>
          <div class="text-sm">{{ latestComment }}</div>
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

const total = computed(() => evaluations.value.length)

const average = computed(() => {
  if (!evaluations.value.length) return 0
  const total = evaluations.value.reduce((s, e) => s + Number(e.average_score || 0), 0)
  return (total / evaluations.value.length).toFixed(2)
})

const latestComment = computed(() => {
  const item = evaluations.value.find(e => e.comment?.trim())
  return item?.comment || 'No comments yet'
})

onMounted(async () => {
  try {
    loading.value = true

    const res = await $api('/evaluations', {
      query: {
        'filters[teacher][id][$eq]': user.value?.id,
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