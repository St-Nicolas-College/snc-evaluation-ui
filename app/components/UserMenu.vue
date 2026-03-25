<script setup lang="ts">
// @ts-nocheck
import type { DropdownMenuItem } from '@nuxt/ui'
const { user, logout } = useAuth()
defineProps<{
  collapsed?: boolean
}>()
const overlay = useOverlay()
const colorMode = useColorMode()
const appConfig = useAppConfig()
const showLogoutModal = ref(false)
const loading = ref(false)
const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone']

const userDetails = ref({
  name: `${user.value?.user_info?.first_name} ${user.value?.user_info?.last_name}`,
  avatar: {
    src: '/SNC-Logo.png',
    alt: `${user.value?.user_info?.first_name} ${user.value?.user_info?.last_name} || 'User'`
  }
})



const handleLogoutClick = async () => {
  showLogoutModal.value = true
}

const handleLogout = async () => {
  loading.value = true
  await new Promise(r => setTimeout(r, 1500))
  logout()
}


const items = computed<DropdownMenuItem[][]>(() => ([[{
  type: 'label',
  label: userDetails.value.name,
  avatar: userDetails.value.avatar
}], [{
  label: 'Profile',
  icon: 'i-lucide-user'
}, {
  label: 'Settings',
  icon: 'i-lucide-settings',
  to: '/settings'
}], [{
  label: 'Theme',
  icon: 'i-lucide-palette',
  children: [{
    label: 'Primary',
    slot: 'chip',
    chip: appConfig.ui.colors.primary,
    content: {
      align: 'center',
      collisionPadding: 16
    },
    children: colors.map(color => ({
      label: color,
      chip: color,
      slot: 'chip',
      checked: appConfig.ui.colors.primary === color,
      type: 'checkbox',
      onSelect: (e) => {
        e.preventDefault()

        appConfig.ui.colors.primary = color
      }
    }))
  }, {
    label: 'Neutral',
    slot: 'chip',
    chip: appConfig.ui.colors.neutral === 'neutral' ? 'old-neutral' : appConfig.ui.colors.neutral,
    content: {
      align: 'end',
      collisionPadding: 16
    },
    children: neutrals.map(color => ({
      label: color,
      chip: color === 'neutral' ? 'old-neutral' : color,
      slot: 'chip',
      type: 'checkbox',
      checked: appConfig.ui.colors.neutral === color,
      onSelect: (e) => {
        e.preventDefault()

        appConfig.ui.colors.neutral = color
      }
    }))
  }]
}, {
  label: 'Appearance',
  icon: 'i-lucide-sun-moon',
  children: [{
    label: 'Light',
    icon: 'i-lucide-sun',
    type: 'checkbox',
    checked: colorMode.value === 'light',
    onSelect(e: Event) {
      e.preventDefault()

      colorMode.preference = 'light'
    }
  }, {
    label: 'Dark',
    icon: 'i-lucide-moon',
    type: 'checkbox',
    checked: colorMode.value === 'dark',
    onUpdateChecked(checked: boolean) {
      if (checked) {
        colorMode.preference = 'dark'
      }
    },
    onSelect(e: Event) {
      e.preventDefault()
    }
  }]
}], [{
  label: 'Log out',
  icon: 'i-lucide-log-out',
  onSelect: async (e: Event) => {
    e.preventDefault() // VERY IMPORTANT (prevents auto navigation)
    handleLogoutClick()
  }
}]]))
</script>

<template>
  <div>
    <UDropdownMenu :items="items" :content="{ align: 'center', collisionPadding: 12 }"
      :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }">
      <UButton v-bind="{
        ...userDetails,
        label: collapsed ? undefined : userDetails?.name,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }" color="neutral" variant="ghost" block :square="collapsed" class="data-[state=open]:bg-elevated" :ui="{
        trailingIcon: 'text-dimmed'
      }" />

      <template #chip-leading="{ item }">
        <div class="inline-flex items-center justify-center shrink-0 size-5">
          <span class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2" :style="{
            '--chip-light': `var(--color-${(item as any).chip}-500)`,
            '--chip-dark': `var(--color-${(item as any).chip}-400)`
          }" />
        </div>
      </template>
    </UDropdownMenu>


   <UModal 
  v-model:open="showLogoutModal" 
  :ui="{ 
    content: 'sm:max-w-sm', 
    overlay: 'backdrop-blur-sm' 
  }"
>
  <template #content>
    <div class="p-6">
      <div class="flex flex-col items-center text-center">
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
          <UIcon 
            name="i-lucide-log-out" 
            class="h-6 w-6 text-red-600 dark:text-red-400" 
          />
        </div>
        
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Sign out of your account?
        </h3>
        
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          You will need to enter your credentials again to access your dashboard.
        </p>
      </div>

      <div class="mt-8 flex flex-col gap-3">
        <UButton
          :label="loading ? 'Signing Out...' : 'Yes, Sign out'"
          color="error"
          block
          size="lg"
          :loading="loading"
          @click="handleLogout"
        />
        <UButton
          label="Stay logged in"
          variant="ghost"
          color="neutral"
          block
          size="lg"
          @click="showLogoutModal = false"
        />
      </div>
    </div>
  </template>
</UModal>
  </div>
</template>
