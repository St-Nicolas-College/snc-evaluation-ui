<template>
  <div class="space-y-6 pb-10">
    <!-- Header -->
    <section
      class="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 py-6 text-white shadow-xl shadow-emerald-900/10 sm:px-7 sm:py-7"
    >
      <div class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-teal-300/15 blur-3xl" />

      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex min-w-0 items-start gap-4">
          <div class="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex">
            <UIcon name="i-lucide-folder-kanban" class="size-7" />
          </div>

          <div class="min-w-0">
            <div class="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-50">
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
                Faculty Portal
              </span>

              <span
                v-if="portfolio?.portfolio_status"
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1"
              >
                {{ formatStatus(portfolio.portfolio_status) }}
              </span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Faculty Portfolio
            </h1>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">
              Maintain your qualifications, professional records, achievements,
              service activities, and supporting evidence for faculty ranking.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 sm:min-w-[300px]">
          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">
              {{ summary.totalEntries }}
            </p>

            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">
              Entries
            </p>
          </div>

          <div class="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-xl">
            <p class="text-2xl font-bold">
              {{ formatPercentage(portfolio?.completion_percentage) }}
            </p>

            <p class="mt-1 text-[10px] uppercase tracking-wide text-emerald-100">
              Complete
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-28 w-full rounded-2xl" />
      <USkeleton class="h-24 w-full rounded-2xl" />
      <USkeleton class="h-[460px] w-full rounded-2xl" />
    </div>

    <!-- Error -->
    <section
      v-else-if="loadError"
      class="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <UIcon name="i-lucide-triangle-alert" class="mx-auto size-10 text-red-600" />

      <h2 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
        Unable to load your portfolio
      </h2>

      <p class="mx-auto mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400">
        {{ loadError }}
      </p>

      <UButton class="mt-5" icon="i-lucide-refresh-cw" @click="loadPortfolio">
        Try Again
      </UButton>
    </section>

    <template v-else>
      <!-- Profile summary -->
      <section class="grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex min-w-0 items-center gap-4">
              <div class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg font-black text-white">
                {{ facultyInitials }}
              </div>

              <div class="min-w-0">
                <p class="truncate text-lg font-bold text-gray-900 dark:text-white">
                  {{ facultyName }}
                </p>

                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ facultyDepartment }}
                </p>

                <div class="mt-2 flex flex-wrap gap-2">
                  <UBadge color="neutral" variant="subtle" icon="i-lucide-hash">
                    {{ portfolio?.portfolio_no || 'No portfolio number' }}
                  </UBadge>

                  <UBadge
                    :color="portfolioStatusColor"
                    variant="subtle"
                    icon="i-lucide-shield-check"
                  >
                    {{ formatStatus(portfolio?.portfolio_status || 'draft') }}
                  </UBadge>
                </div>
              </div>
            </div>

            <UButton
              color="neutral"
              variant="soft"
              icon="i-lucide-refresh-cw"
              :loading="recalculating"
              @click="recalculatePortfolio"
            >
              Recalculate
            </UButton>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Portfolio Completion
              </p>

              <p class="mt-2 text-3xl font-black text-gray-900 dark:text-white">
                {{ formatPercentage(portfolio?.completion_percentage) }}
              </p>
            </div>

            <div class="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
              <UIcon name="i-lucide-chart-no-axes-combined" class="size-6" />
            </div>
          </div>

          <div class="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              class="h-full rounded-full bg-emerald-500 transition-all"
              :style="{ width: `${Math.min(Number(portfolio?.completion_percentage || 0), 100)}%` }"
            />
          </div>

          <p class="mt-3 text-xs leading-5 text-gray-500 dark:text-gray-400">
            Completion is based on verified portfolio sections, not only the
            number of uploaded files.
          </p>
        </div>
      </section>

      <!-- KPI -->
      <section class="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <StatCard label="Total Entries" :value="summary.totalEntries" icon="i-lucide-files" tone="blue" />
        <StatCard label="Verified" :value="summary.verified" icon="i-lucide-badge-check" tone="emerald" />
        <StatCard label="For Verification" :value="summary.forVerification" icon="i-lucide-clock-3" tone="amber" />
        <StatCard label="Needs Correction" :value="summary.needsCorrection" icon="i-lucide-file-warning" tone="red" />
        <StatCard label="Draft" :value="summary.draft" icon="i-lucide-file-pen-line" tone="violet" />
      </section>

      <!-- Toolbar -->
      <section class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div class="flex flex-1 flex-col gap-3 sm:flex-row">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Search portfolio entries..."
              class="w-full sm:max-w-md"
            />

            <USelectMenu
              v-model="selectedStatus"
              :items="statusOptions"
              value-key="value"
              class="w-full sm:w-56"
            />
          </div>

          <div class="flex flex-wrap gap-2">
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-refresh-cw"
              :loading="loading"
              @click="loadPortfolio"
            >
              Refresh
            </UButton>

            <UButton
              icon="i-lucide-plus"
              @click="openCreateEntry"
            >
              Add Portfolio Entry
            </UButton>
          </div>
        </div>
      </section>

      <!-- Category tabs -->
      <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="overflow-x-auto border-b border-gray-200 dark:border-gray-800">
          <div class="flex min-w-max gap-1 p-2">
            <button
              v-for="category in categoryTabs"
              :key="category.value"
              type="button"
              class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition"
              :class="
                selectedCategory === category.value
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              "
              @click="selectedCategory = category.value"
            >
              <UIcon :name="category.icon" class="size-4" />
              <span>{{ category.label }}</span>

              <span
                class="rounded-full px-1.5 py-0.5 text-[10px]"
                :class="
                  selectedCategory === category.value
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800'
                "
              >
                {{ categoryCount(category.value) }}
              </span>
            </button>
          </div>
        </div>

        <div v-if="!filteredEntries.length" class="px-6 py-16 text-center">
          <UIcon name="i-lucide-folder-open" class="mx-auto size-11 text-gray-400" />

          <h3 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
            No portfolio entries found
          </h3>

          <p class="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
            Add your qualifications, activities, experience, and evidence to
            begin building your faculty portfolio.
          </p>

          <UButton class="mt-5" icon="i-lucide-plus" @click="openCreateEntry">
            Add First Entry
          </UButton>
        </div>

        <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
          <article
            v-for="entry in filteredEntries"
            :key="entry.documentId || entry.id"
            class="px-5 py-5"
          >
            <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <UBadge color="neutral" variant="subtle">
                    {{ getEntryTypeLabel(entry.entry_type) }}
                  </UBadge>

                  <UBadge :color="entryStatusColor(entry.verification_status)" variant="subtle">
                    {{ formatStatus(entry.verification_status) }}
                  </UBadge>

                  <UBadge
                    v-if="entry.is_locked"
                    color="warning"
                    variant="subtle"
                    icon="i-lucide-lock-keyhole"
                  >
                    Locked
                  </UBadge>
                </div>

                <h3 class="mt-3 text-base font-bold text-gray-900 dark:text-white">
                  {{ entry.title }}
                </h3>

                <p
                  v-if="entry.description"
                  class="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300"
                >
                  {{ entry.description }}
                </p>

                <div class="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <span v-if="entry.institution" class="inline-flex items-center gap-1.5">
                    <UIcon name="i-lucide-building-2" class="size-3.5" />
                    {{ entry.institution }}
                  </span>

                  <span v-if="entry.issuer" class="inline-flex items-center gap-1.5">
                    <UIcon name="i-lucide-stamp" class="size-3.5" />
                    {{ entry.issuer }}
                  </span>

                  <span v-if="entry.date_earned" class="inline-flex items-center gap-1.5">
                    <UIcon name="i-lucide-calendar-days" class="size-3.5" />
                    {{ formatDate(entry.date_earned) }}
                  </span>

                  <span class="inline-flex items-center gap-1.5">
                    <UIcon name="i-lucide-paperclip" class="size-3.5" />
                    {{ entry.evidence?.length || 0 }} evidence file{{ (entry.evidence?.length || 0) === 1 ? '' : 's' }}
                  </span>
                </div>

                <div
                  v-if="entry.remarks"
                  class="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300"
                >
                  <p class="font-semibold">Reviewer remarks</p>
                  <p class="mt-1 leading-5">{{ entry.remarks }}</p>
                </div>
              </div>

              <div class="flex shrink-0 flex-wrap gap-2">
                <UButton
                  size="sm"
                  color="neutral"
                  variant="soft"
                  icon="i-lucide-eye"
                  @click="openEntryDetails(entry)"
                >
                  View
                </UButton>

                <UButton
                  v-if="canEditEntry(entry)"
                  size="sm"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-pencil"
                  @click="openEditEntry(entry)"
                >
                  Edit
                </UButton>

                <UButton
                  v-if="canUploadEvidence(entry)"
                  size="sm"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-upload"
                  @click="openEvidenceDialog(entry)"
                >
                  Evidence
                </UButton>

                <UButton
                  v-if="canSubmitEntry(entry)"
                  size="sm"
                  icon="i-lucide-send"
                  :loading="actionEntryId === getEntryId(entry)"
                  @click="submitEntry(entry)"
                >
                  Submit
                </UButton>
              </div>
            </div>
          </article>
        </div>
      </section>
    </template>

    <!-- Create / Edit Entry -->
    <UModal
      id="faculty-portfolio-entry-modal"
      v-model:open="entryDialogOpen"
      :title="editingEntry ? 'Edit Portfolio Entry' : 'Add Portfolio Entry'"
      description="Provide the details of your qualification, activity, achievement, or experience."
      :ui="{ content: 'max-w-4xl' }"
    >
      <template #content>
        <div class="max-h-[90vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900">
          <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ editingEntry ? 'Edit Portfolio Entry' : 'Add Portfolio Entry' }}
            </h2>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Save the entry as a draft, upload evidence, then submit it for verification.
            </p>
          </div>

          <UForm :state="entryForm" class="space-y-5 p-6" @submit="saveEntry">
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="Entry Type" name="entry_type" required>
                <USelectMenu
                  v-model="entryForm.entry_type"
                  :items="entryTypeOptions"
                  value-key="value"
                  placeholder="Select entry type"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Title" name="title" required>
                <UInput
                  v-model="entryForm.title"
                  placeholder="Enter title"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField label="Description" name="description">
              <UTextarea
                v-model="entryForm.description"
                :rows="3"
                placeholder="Add relevant details"
                class="w-full"
              />
            </UFormField>

            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="Institution / Organization" name="institution">
                <UInput
                  v-model="entryForm.institution"
                  placeholder="Institution or organization"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Issuer" name="issuer">
                <UInput
                  v-model="entryForm.issuer"
                  placeholder="Issuing organization"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <UFormField label="Reference Number" name="reference_number">
                <UInput
                  v-model="entryForm.reference_number"
                  placeholder="Optional reference"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Date Earned" name="date_earned">
                <UInput v-model="entryForm.date_earned" type="date" class="w-full" />
              </UFormField>

              <UFormField label="Start Date" name="start_date">
                <UInput v-model="entryForm.start_date" type="date" class="w-full" />
              </UFormField>

              <UFormField label="End Date" name="end_date">
                <UInput v-model="entryForm.end_date" type="date" class="w-full" />
              </UFormField>
            </div>

            <div class="grid gap-4 sm:grid-cols-3">
              <UFormField label="Expiration Date" name="expiration_date">
                <UInput v-model="entryForm.expiration_date" type="date" class="w-full" />
              </UFormField>

              <UFormField label="Quantity" name="quantity" required>
                <UInput
                  v-model.number="entryForm.quantity"
                  type="number"
                  min="1"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Years Count" name="years_count">
                <UInput
                  v-model.number="entryForm.years_count"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField label="Remarks" name="remarks">
              <UTextarea
                v-model="entryForm.remarks"
                :rows="3"
                placeholder="Optional notes"
                class="w-full"
              />
            </UFormField>

            <div class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800">
              <UButton color="neutral" variant="soft" @click="closeEntryDialog">
                Cancel
              </UButton>

              <UButton
                type="submit"
                icon="i-lucide-save"
                :loading="savingEntry"
              >
                {{ editingEntry ? 'Save Changes' : 'Save Draft' }}
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- Evidence Upload -->
    <UModal
      id="faculty-portfolio-evidence-modal"
      v-model:open="evidenceDialogOpen"
      title="Upload Evidence"
      description="Attach a supporting document to the selected portfolio entry."
      :ui="{ content: 'max-w-2xl' }"
    >
      <template #content>
        <div class="max-h-[90vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900">
          <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              Upload Supporting Evidence
            </h2>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ evidenceEntry?.title }}
            </p>
          </div>

          <UForm :state="evidenceForm" class="space-y-5 p-6" @submit="uploadEvidence">
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="Evidence Type" name="evidence_type" required>
                <USelectMenu
                  v-model="evidenceForm.evidence_type"
                  :items="evidenceTypeOptions"
                  value-key="value"
                  placeholder="Select evidence type"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Title" name="title" required>
                <UInput
                  v-model="evidenceForm.title"
                  placeholder="Document title"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="grid gap-4 sm:grid-cols-3">
              <UFormField label="Document Number" name="document_number">
                <UInput v-model="evidenceForm.document_number" class="w-full" />
              </UFormField>

              <UFormField label="Issue Date" name="issue_date">
                <UInput v-model="evidenceForm.issue_date" type="date" class="w-full" />
              </UFormField>

              <UFormField label="Expiration Date" name="expiration_date">
                <UInput v-model="evidenceForm.expiration_date" type="date" class="w-full" />
              </UFormField>
            </div>

            <UFormField label="File" name="file" required>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                class="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                @change="handleEvidenceFile"
              />
            </UFormField>

            <UFormField label="Remarks" name="remarks">
              <UTextarea v-model="evidenceForm.remarks" :rows="3" class="w-full" />
            </UFormField>

            <div class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800">
              <UButton color="neutral" variant="soft" @click="closeEvidenceDialog">
                Cancel
              </UButton>

              <UButton
                type="submit"
                icon="i-lucide-upload"
                :loading="uploadingEvidence"
              >
                Upload Evidence
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- Entry details -->
    <UModal
      id="faculty-portfolio-entry-details-modal"
      v-model:open="detailsDialogOpen"
      title="Portfolio Entry Details"
      description="Review the entry, evidence, and verification history."
      :ui="{ content: 'max-w-4xl' }"
    >
      <template #content>
        <div v-if="detailsEntry" class="max-h-[90vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900">
          <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-6 text-white">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-[0.16em] text-emerald-300">
                  {{ getEntryTypeLabel(detailsEntry.entry_type) }}
                </p>

                <h2 class="mt-2 text-xl font-black">
                  {{ detailsEntry.title }}
                </h2>

                <p class="mt-1 text-sm text-slate-300">
                  {{ formatStatus(detailsEntry.verification_status) }}
                </p>
              </div>

              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                square
                class="text-white"
                @click="detailsDialogOpen = false"
              />
            </div>
          </div>

          <div class="space-y-5 p-6">
            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InfoBox label="Institution" :value="detailsEntry.institution || 'N/A'" />
              <InfoBox label="Issuer" :value="detailsEntry.issuer || 'N/A'" />
              <InfoBox label="Date Earned" :value="formatDate(detailsEntry.date_earned)" />
              <InfoBox label="Quantity" :value="detailsEntry.quantity || 1" />
            </div>

            <section class="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                Description
              </h3>

              <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {{ detailsEntry.description || 'No description provided.' }}
              </p>
            </section>

            <section class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
              <div class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                  Evidence
                </h3>
              </div>

              <div v-if="!detailsEntry.evidence?.length" class="px-4 py-8 text-center text-sm text-gray-500">
                No evidence uploaded.
              </div>

              <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
                <div
                  v-for="evidence in detailsEntry.evidence"
                  :key="evidence.documentId || evidence.id"
                  class="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">
                      {{ evidence.title }}
                    </p>

                    <p class="mt-1 text-xs text-gray-500">
                      {{ formatStatus(evidence.evidence_type) }}
                      ·
                      {{ formatStatus(evidence.verification_status) }}
                    </p>
                  </div>

                  <UButton
                    v-if="getEvidenceUrl(evidence)"
                    size="xs"
                    color="neutral"
                    variant="soft"
                    icon="i-lucide-external-link"
                    :to="getEvidenceUrl(evidence)"
                    target="_blank"
                  >
                    Open File
                  </UButton>
                </div>
              </div>
            </section>

            <section class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
              <div class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                  Verification History
                </h3>
              </div>

              <div v-if="!detailsEntry.verification_history?.length" class="px-4 py-8 text-center text-sm text-gray-500">
                No verification history yet.
              </div>

              <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
                <div
                  v-for="history in detailsEntry.verification_history"
                  :key="history.documentId || history.id"
                  class="px-4 py-4"
                >
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <p class="font-semibold text-gray-900 dark:text-white">
                      {{ formatStatus(history.new_status) }}
                    </p>

                    <p class="text-xs text-gray-500">
                      {{ formatDateTime(history.review_date) }}
                    </p>
                  </div>

                  <p class="mt-1 text-xs text-gray-500">
                    Reviewed by:
                    {{ history.reviewer?.username || history.reviewer?.email || 'System' }}
                  </p>

                  <p v-if="history.remarks" class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {{ history.remarks }}
                  </p>
                </div>
              </div>
            </section>

            <div class="flex justify-end">
              <UButton color="neutral" variant="soft" @click="detailsDialogOpen = false">
                Close
              </UButton>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  middleware: ['auth', 'role'],
  role: ['Faculty']
})

const { $api } = useNuxtApp()
const config = useRuntimeConfig()
const toast = useToast()

const loading = ref(false)
const loadError = ref('')
const recalculating = ref(false)
const portfolio = ref<any>(null)

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedStatus = ref('all')

const entryDialogOpen = ref(false)
const evidenceDialogOpen = ref(false)
const detailsDialogOpen = ref(false)

const editingEntry = ref<any>(null)
const evidenceEntry = ref<any>(null)
const detailsEntry = ref<any>(null)

const savingEntry = ref(false)
const uploadingEvidence = ref(false)
const actionEntryId = ref('')
const selectedEvidenceFile = ref<File | null>(null)

const categoryTabs = [
  { label: 'All Entries', value: 'all', icon: 'i-lucide-layout-grid' },
  { label: 'Education', value: 'educational_attainment', icon: 'i-lucide-graduation-cap' },
  { label: 'Eligibility & Licenses', value: 'eligibility_group', icon: 'i-lucide-badge-check' },
  { label: 'Training & Seminars', value: 'training_group', icon: 'i-lucide-presentation' },
  { label: 'Research', value: 'research_group', icon: 'i-lucide-book-open-check' },
  { label: 'Awards', value: 'award', icon: 'i-lucide-award' },
  { label: 'Experience', value: 'professional_experience', icon: 'i-lucide-briefcase-business' },
  { label: 'Institutional Service', value: 'institutional_service', icon: 'i-lucide-building-2' },
  { label: 'Community Service', value: 'community_service', icon: 'i-lucide-hand-heart' }
]

const entryTypeOptions = [
  { label: 'Educational Attainment', value: 'educational_attainment' },
  { label: 'Eligibility', value: 'eligibility' },
  { label: 'License', value: 'license' },
  { label: 'Certification', value: 'certification' },
  { label: 'Training', value: 'training' },
  { label: 'Seminar', value: 'seminar' },
  { label: 'Resource Speaker', value: 'resource_speaker' },
  { label: 'Research', value: 'research' },
  { label: 'Publication', value: 'publication' },
  { label: 'Award', value: 'award' },
  { label: 'Professional Experience', value: 'professional_experience' },
  { label: 'Institutional Service', value: 'institutional_service' },
  { label: 'Community Service', value: 'community_service' },
  { label: 'Other', value: 'other' }
]

const evidenceTypeOptions = [
  { label: 'Diploma', value: 'diploma' },
  { label: 'Transcript', value: 'transcript' },
  { label: 'License', value: 'license' },
  { label: 'Certificate', value: 'certificate' },
  { label: 'Publication', value: 'publication' },
  { label: 'Award Document', value: 'award_document' },
  { label: 'Employment Record', value: 'employment_record' },
  { label: 'Service Record', value: 'service_record' },
  { label: 'Community Service Record', value: 'community_service_record' },
  { label: 'Other', value: 'other' }
]

const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'For Verification', value: 'for_verification' },
  { label: 'Verified', value: 'verified' },
  { label: 'Needs Correction', value: 'needs_correction' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Expired', value: 'expired' }
]

const createEmptyEntryForm = () => ({
  entry_type: '',
  title: '',
  description: '',
  institution: '',
  issuer: '',
  reference_number: '',
  start_date: '',
  end_date: '',
  date_earned: '',
  expiration_date: '',
  quantity: 1,
  years_count: null as number | null,
  remarks: ''
})

const createEmptyEvidenceForm = () => ({
  evidence_type: '',
  title: '',
  document_number: '',
  issue_date: '',
  expiration_date: '',
  remarks: ''
})

const entryForm = reactive(createEmptyEntryForm())
const evidenceForm = reactive(createEmptyEvidenceForm())

const entries = computed(() =>
  Array.isArray(portfolio.value?.entries)
    ? portfolio.value.entries
    : []
)

const summary = computed(() => ({
  totalEntries: entries.value.length,
  verified: entries.value.filter((entry: any) => entry.verification_status === 'verified').length,
  forVerification: entries.value.filter((entry: any) =>
    ['for_verification', 'pending'].includes(entry.verification_status)
  ).length,
  needsCorrection: entries.value.filter((entry: any) => entry.verification_status === 'needs_correction').length,
  draft: entries.value.filter((entry: any) => entry.verification_status === 'draft').length
}))

const facultyName = computed(() =>
  portfolio.value?.faculty?.name ||
  portfolio.value?.faculty?.full_name ||
  portfolio.value?.faculty?.user?.username ||
  'Faculty Member'
)

const facultyDepartment = computed(() =>
  portfolio.value?.faculty?.department?.name ||
  'Department not specified'
)

const facultyInitials = computed(() =>
  String(facultyName.value)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part: string) => part.charAt(0).toUpperCase())
    .join('')
)

const portfolioStatusColor = computed(() =>
  entryStatusColor(portfolio.value?.portfolio_status)
)

const filteredEntries = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return entries.value.filter((entry: any) => {
    const matchesSearch =
      !keyword ||
      [
        entry.title,
        entry.description,
        entry.institution,
        entry.issuer,
        entry.reference_number,
        entry.entry_type
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(keyword)

    const matchesStatus =
      selectedStatus.value === 'all' ||
      entry.verification_status === selectedStatus.value

    const matchesCategory =
      selectedCategory.value === 'all' ||
      normalizeCategory(entry.entry_type) === selectedCategory.value

    return matchesSearch && matchesStatus && matchesCategory
  })
})

const StatCard = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    icon: String,
    tone: String
  },
  setup(props) {
    const toneClasses: Record<string, string> = {
      blue: 'border-blue-100 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20',
      emerald: 'border-emerald-100 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20',
      amber: 'border-amber-100 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20',
      red: 'border-red-100 bg-red-50/70 dark:border-red-900 dark:bg-red-950/20',
      violet: 'border-violet-100 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/20'
    }

    return () =>
      h('div', { class: `rounded-2xl border p-4 ${toneClasses[props.tone || 'blue']}` }, [
        h('div', { class: 'flex items-center justify-between gap-3' }, [
          h('div', {}, [
            h('p', { class: 'text-xs font-medium text-gray-500' }, props.label),
            h('p', { class: 'mt-2 text-2xl font-bold text-gray-900 dark:text-white' }, String(props.value ?? 0))
          ]),
          h(resolveComponent('UIcon'), { name: props.icon, class: 'size-5' })
        ])
      ])
  }
})

const InfoBox = defineComponent({
  props: {
    label: String,
    value: [String, Number]
  },
  setup(props) {
    return () =>
      h('div', { class: 'rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40' }, [
        h('p', { class: 'text-[10px] font-bold uppercase tracking-wide text-gray-500' }, props.label),
        h('p', { class: 'mt-1 truncate text-sm font-semibold text-gray-900 dark:text-white' }, String(props.value ?? ''))
      ])
  }
})

const normalizeCategory = (entryType: string) => {
  if (['eligibility', 'license', 'certification'].includes(entryType)) {
    return 'eligibility_group'
  }

  if (['training', 'seminar', 'resource_speaker'].includes(entryType)) {
    return 'training_group'
  }

  if (['research', 'publication'].includes(entryType)) {
    return 'research_group'
  }

  return entryType
}

const categoryCount = (category: string) =>
  category === 'all'
    ? entries.value.length
    : entries.value.filter((entry: any) => normalizeCategory(entry.entry_type) === category).length

const getEntryTypeLabel = (value: string) =>
  entryTypeOptions.find(option => option.value === value)?.label ||
  formatStatus(value)

const getEntryId = (entry: any) =>
  String(entry?.documentId || entry?.id || '')

const canEditEntry = (entry: any) =>
  !entry?.is_locked &&
  ['draft', 'needs_correction'].includes(entry?.verification_status)

const canUploadEvidence = (entry: any) =>
  !entry?.is_locked &&
  ['draft', 'needs_correction'].includes(entry?.verification_status)

const canSubmitEntry = (entry: any) =>
  !entry?.is_locked &&
  ['draft', 'needs_correction'].includes(entry?.verification_status) &&
  Array.isArray(entry?.evidence) &&
  entry.evidence.length > 0

const openCreateEntry = () => {
  Object.assign(entryForm, createEmptyEntryForm())
  editingEntry.value = null
  entryDialogOpen.value = true
}

const openEditEntry = (entry: any) => {
  editingEntry.value = entry

  Object.assign(entryForm, {
    entry_type: entry.entry_type || '',
    title: entry.title || '',
    description: entry.description || '',
    institution: entry.institution || '',
    issuer: entry.issuer || '',
    reference_number: entry.reference_number || '',
    start_date: toDateInput(entry.start_date),
    end_date: toDateInput(entry.end_date),
    date_earned: toDateInput(entry.date_earned),
    expiration_date: toDateInput(entry.expiration_date),
    quantity: Number(entry.quantity || 1),
    years_count: entry.years_count === null || entry.years_count === undefined
      ? null
      : Number(entry.years_count),
    remarks: entry.remarks || ''
  })

  entryDialogOpen.value = true
}

const closeEntryDialog = () => {
  entryDialogOpen.value = false
  editingEntry.value = null
  Object.assign(entryForm, createEmptyEntryForm())
}

const saveEntry = async () => {
  if (!entryForm.entry_type || !entryForm.title.trim()) {
    toast.add({
      title: 'Incomplete entry',
      description: 'Entry type and title are required.',
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    })
    return
  }

  if (!portfolio.value?.documentId) return

  savingEntry.value = true

  try {
    const data = {
      //faculty_portfolio: portfolio.value.documentId,
      entry_type: entryForm.entry_type,
      title: entryForm.title.trim(),
      description: entryForm.description.trim() || null,
      institution: entryForm.institution.trim() || null,
      issuer: entryForm.issuer.trim() || null,
      reference_number: entryForm.reference_number.trim() || null,
      start_date: entryForm.start_date || null,
      end_date: entryForm.end_date || null,
      date_earned: entryForm.date_earned || null,
      expiration_date: entryForm.expiration_date || null,
      quantity: Number(entryForm.quantity || 1),
      years_count:
        entryForm.years_count === null || entryForm.years_count === undefined || entryForm.years_count === ''
          ? null
          : Number(entryForm.years_count),
      verification_status: editingEntry.value?.verification_status || 'draft',
      is_current: true,
      is_locked: false,
      remarks: entryForm.remarks.trim() || null
    }

    if (editingEntry.value) {
      await $api(`/portfolio-entries/${editingEntry.value.documentId}`, {
        method: 'PUT',
        body: { data }
      })
    } else {
      await $api('/portfolio-entries', {
        method: 'POST',
        body: { data }
      })
    }

    toast.add({
      title: editingEntry.value ? 'Entry updated' : 'Entry created',
      description: editingEntry.value
        ? 'The portfolio entry was updated successfully.'
        : 'The portfolio entry was saved as a draft.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    closeEntryDialog()
    await loadPortfolio()
  } catch (error: any) {
    toast.add({
      title: 'Unable to save entry',
      description: getErrorMessage(error),
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    })
  } finally {
    savingEntry.value = false
  }
}

const openEvidenceDialog = (entry: any) => {
  evidenceEntry.value = entry
  Object.assign(evidenceForm, createEmptyEvidenceForm())
  selectedEvidenceFile.value = null
  evidenceDialogOpen.value = true
}

const closeEvidenceDialog = () => {
  evidenceDialogOpen.value = false
  evidenceEntry.value = null
  selectedEvidenceFile.value = null
  Object.assign(evidenceForm, createEmptyEvidenceForm())
}

const handleEvidenceFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedEvidenceFile.value = target.files?.[0] || null
}

const uploadEvidence = async () => {
  if (
    !evidenceEntry.value?.documentId ||
    !evidenceForm.evidence_type ||
    !evidenceForm.title.trim() ||
    !selectedEvidenceFile.value
  ) {
    toast.add({
      title: 'Incomplete evidence',
      description: 'Evidence type, title, and file are required.',
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    })
    return
  }

  uploadingEvidence.value = true

  try {
    const formData = new FormData()
    formData.append('files', selectedEvidenceFile.value)

    const uploadResponse: any = await $api('/upload', {
      method: 'POST',
      body: formData
    })

    const uploadedFile = Array.isArray(uploadResponse)
      ? uploadResponse[0]
      : uploadResponse?.[0] || uploadResponse

    if (!uploadedFile?.id) {
      throw new Error('The file upload did not return a valid file record.')
    }

    await $api('/portfolio-evidences', {
      method: 'POST',
      body: {
        data: {
          portfolio_entry: evidenceEntry.value.documentId,
          evidence_type: evidenceForm.evidence_type,
          title: evidenceForm.title.trim(),
          document_number: evidenceForm.document_number.trim() || null,
          issue_date: evidenceForm.issue_date || null,
          expiration_date: evidenceForm.expiration_date || null,
          verification_status: 'pending',
          remarks: evidenceForm.remarks.trim() || null,
          file: uploadedFile.id
        }
      }
    })

    toast.add({
      title: 'Evidence uploaded',
      description: 'The supporting document was attached successfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    closeEvidenceDialog()
    await loadPortfolio()
  } catch (error: any) {
    toast.add({
      title: 'Unable to upload evidence',
      description: getErrorMessage(error),
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    })
  } finally {
    uploadingEvidence.value = false
  }
}

const submitEntry = async (entry: any) => {
  const documentId = getEntryId(entry)
  if (!documentId) return

  actionEntryId.value = documentId

  try {
    await $api(`/portfolio-entries/${documentId}/submit`, {
      method: 'POST'
    })

    toast.add({
      title: 'Entry submitted',
      description: 'The portfolio entry is now waiting for verification.',
      color: 'success',
      icon: 'i-lucide-send'
    })

    await loadPortfolio()
  } catch (error: any) {
    toast.add({
      title: 'Unable to submit entry',
      description: getErrorMessage(error),
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    })
  } finally {
    actionEntryId.value = ''
  }
}

const openEntryDetails = (entry: any) => {
  detailsEntry.value = entry
  detailsDialogOpen.value = true
}

const recalculatePortfolio = async () => {
  if (!portfolio.value?.documentId) return

  recalculating.value = true

  try {
    await $api(`/faculty-portfolios/${portfolio.value.documentId}/recalculate`, {
      method: 'POST'
    })

    await loadPortfolio()

    toast.add({
      title: 'Portfolio recalculated',
      description: 'Completion and portfolio status were updated.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
  } catch (error: any) {
    toast.add({
      title: 'Unable to recalculate portfolio',
      description: getErrorMessage(error),
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    })
  } finally {
    recalculating.value = false
  }
}

const loadPortfolio = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const response: any = await $api('/faculty-portfolios/me')
    portfolio.value = response?.data || response || null
  } catch (error: any) {
    console.error('Faculty portfolio loading error:', error)
    portfolio.value = null
    loadError.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}

const getEvidenceUrl = (evidence: any) => {
  const url = evidence?.file?.url
  if (!url) return ''

  if (/^https?:\/\//i.test(url)) {
    return url
  }

  const baseUrl = String(
    config.public.apiBase ||
    config.public.strapiUrl ||
    ''
  ).replace(/\/api\/?$/, '')

  return `${baseUrl}${url}`
}

const entryStatusColor = (status: string) => {
  switch (String(status || '').toLowerCase()) {
    case 'verified':
      return 'success'
    case 'for_verification':
    case 'pending':
      return 'warning'
    case 'needs_correction':
    case 'rejected':
    case 'expired':
      return 'error'
    case 'partially_verified':
      return 'info'
    default:
      return 'neutral'
  }
}

const formatStatus = (value: string) =>
  String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase())

const formatPercentage = (value: any) => {
  const number = Number(value || 0)
  return `${Number.isFinite(number) ? Math.round(number) : 0}%`
}

const formatDate = (value: any) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
}

const formatDateTime = (value: any) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
}

const toDateInput = (value: any) =>
  value ? String(value).slice(0, 10) : ''

const getErrorMessage = (error: any) =>
  error?.data?.error?.message ||
  error?.data?.message ||
  error?.message ||
  'An unexpected error occurred.'

watch([searchQuery, selectedCategory, selectedStatus], () => {
  // Reactive filter refresh only.
})

onMounted(loadPortfolio)
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
