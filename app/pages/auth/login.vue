<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
  >
    <UPageCard class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center my-5">
        <img src="/logo.png" alt="Logo" class="w-18 mx-auto mb-4" />
        <h1 class="text-2xl font-bold">Welcome Back</h1>
        <p class="text-gray-500">Login to your account</p>
      </div>

      <!-- Form -->
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            icon="i-lucide-mail"
            placeholder="Enter your email"
            class="w-full"
            size="xl"
          />
        </UFormField>
        <UFormField label="Password" name="password">
          <UInput
            v-model="state.password"
            icon="i-lucide-lock"
            placeholder="Enter your password"
            class="w-full"
            size="xl"
            :type="show ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show"
              />
            </template>
          </UInput>
        </UFormField>

        <UButton :label="loading ? 'Logging in...' : 'Log in'" type="submit" class="mt-3" size="lg" :loading="loading" block
          />
        

        <!-- <USeparator label="OR" />

        <UButton
          block
          variant="outline"
          icon="i-lucide-github"
          @click="
            toast.add({ title: 'GitHub', description: 'Login with GitHub' })
          "
        >
          Continue with GitHub
        </UButton> -->
      </UForm>

      <!-- Footer -->
      <div class="text-center mt-4 text-sm">
        Don't have an account?
        <NuxtLink to="/auth/register" class="text-primary font-medium">
          Register
        </NuxtLink>
      </div>
    </UPageCard>
  </div>
</template>

<script lang="ts" setup>
// @ts-nocheck
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
definePageMeta({
  layout: "auth",
});

const toast = useToast();
const loading = ref(false);
const email = ref("admin@gmail.com");
const password = ref("admin123");
const show = ref(false)

type Schema = z.output<typeof schema>;
const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

const schema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string("Password is required")
    .min(8, "Must be at least 8 characters"),
});

// Login function
const onSubmit = async (payload: FormSubmitEvent<Schema>) => {
  loading.value = true;
  try {
    if (
      email.value === payload.data.email &&
      password.value === payload.data.password
    ) {
      await new Promise((r) => setTimeout(r, 1500));
      toast.add({
        title: "Login",
        description: "Successfully Logged In!",
        icon: "i-lucide-info",
      });
      navigateTo("/");
    } else {
      toast.add({
        title: "Error Login",
        description: "Invalid email or password!",
        icon: "i-lucide-triangle-alert",
        color: "error",
      });
      loading.value = false;
    }
  } catch (err) {
    toast.add({
      title: "Error Login",
      description: "Invalid email or password!",
      icon: "i-lucide-triangle-alert",
      color: "error",
    });
    loading.value = false;
  }
};
</script>

<style>
/* Hide the password reveal button in Edge */
::-ms-reveal {
    display: none;
}
</style>
