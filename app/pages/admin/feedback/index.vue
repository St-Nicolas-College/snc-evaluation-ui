<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Feedback</span>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <UPageGrid>

        <UPageCard class="lg:col-span-1">
          <!-- Form -->
          <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmitFeedback">
            <UFormField label="Feedback" name="feedback">
              <UTextarea v-model="state.feedback" icon="i-lucide-message-square-quote" placeholder="Enter a feedback"
                class="w-full" size="xl" />
            </UFormField>


            <UButton :label="loading ? 'Submitting...' : 'Submit'" type="submit" class="mt-3" size="lg"
              :loading="loading" block />


          </UForm>
        </UPageCard>
        <!-- <div v-if="loading === true" class="rounded-xl border lg:col-span-2 p-4 space-y-3">
          <USkeleton class="h-5 w-32" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-3/4" />
          <USkeleton class="h-40 w-full rounded-lg" />
        </div> -->

        <UPageCard class="lg:col-span-2">
          <template #title>
            <div class="flex items-center gap-2">
              Response
              <UBadge label="NEW" color="primary" variant="soft" />
            </div>
          </template>
          
            <div v-if="loading"  class="flex items-center justify-center py-10">
              <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin text-primary" />
            </div>
            <template v-else>
              <div class="flex gap-2">
                Sentiment: {{ ai_response.sentiment }}
              </div>
              <div class="flex  gap-2">
                Suggestion:
                {{ ai_response.suggestion }}

              </div>
            </template>

           
        
        </UPageCard>
      </UPageGrid>

    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
//@ts-nocheck
definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Admin']
})
const toast = useToast();
const loading = ref(false);
const ai_response = ref('')

const state = reactive<Partial<Schema>>({
  feedback: undefined,
});

const onSubmitFeedback = async (payload: FormSubmitEvent<Schema>) => {
  loading.value = true
  try {
    //console.log(payload.data.feedback)
    const res = await $fetch('/api/analyze', {
      method: 'POST',
      body: {
        feedback: payload.data.feedback
      }
    })

    ai_response.value = JSON.parse(res.output[0].content[0].text)
    toast.add({
      title: 'Success',
      description: 'Feedback analyzed successfully',
      color: 'success'
    })
    console.log(JSON.parse(res.output[0].content[0].text));
  } catch (err) {
    console.error('Error submitting feedback,', err)
    toast.add({
      title: 'Error',
      description: 'Failed to analyze feedback',
      color: 'error'
    })
    loading.value = false
  } finally {
    loading.value = false
  }
}
</script>

<style></style>