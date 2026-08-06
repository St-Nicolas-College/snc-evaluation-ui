<template>
  <div class="space-y-6 pb-10">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <UButton
        to="/hr/ranking"
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
      >
        Back to Faculty Ranking
      </UButton>

      <div class="flex gap-2">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-refresh-cw"
          :loading="loading"
          @click="loadData"
        >
          Refresh
        </UButton>

        <UButton
          v-if="teacher"
          icon="i-lucide-calculator"
          @click="openComputeDialog"
        >
          Recompute Ranking
        </UButton>
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-48 rounded-3xl" />
      <USkeleton class="h-32 rounded-3xl" />
      <USkeleton class="h-[520px] rounded-3xl" />
    </div>

    <section
      v-else-if="loadError"
      class="rounded-2xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <UIcon
        name="i-lucide-triangle-alert"
        class="mx-auto size-10 text-red-600"
      />

      <h2 class="mt-4 font-bold text-gray-900 dark:text-white">
        Unable to load ranking breakdown
      </h2>

      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {{ loadError }}
      </p>

      <UButton class="mt-5" @click="loadData">
        Try Again
      </UButton>
    </section>

    <template v-else-if="teacher">
      <section
        class="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-950 via-blue-950 to-cyan-950 px-6 py-7 text-white shadow-xl"
      >
        <div
          class="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-white/10 blur-3xl"
        />

        <div
          class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex size-16 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-xl font-black"
            >
              {{ initials(teacherName) }}
            </div>

            <div>
              <p
                class="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300"
              >
                Faculty Ranking Breakdown
              </p>

              <h1 class="mt-2 text-2xl font-black sm:text-3xl">
                {{ teacherName }}
              </h1>

              <p class="mt-2 text-sm text-blue-100">
                {{ teacherRole }}
                ·
                {{ departmentName }}
                ·
                {{
                  teacher.employee_no ||
                  teacher.user?.username ||
                  "No employee number"
                }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <HeroStat
              label="Portfolio"
              :value="formatPoints(ranking?.total_portfolio_points)"
            />

            <HeroStat
              label="Evaluation"
              :value="formatPoints(ranking?.evaluation_points)"
            />

            <HeroStat
              label="Total"
              :value="formatPoints(ranking?.total_ranking_points)"
            />

            <HeroStat
              label="MAX RATE"
              :value="formatPlainAmount(ranking?.max_rate)"
            />
          </div>
        </div>
      </section>

      <section
        v-if="!ranking"
        class="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-900 dark:bg-amber-950/20"
      >
        <UIcon
          name="i-lucide-calculator"
          class="mx-auto size-10 text-amber-600"
        />

        <h2 class="mt-4 font-bold text-gray-900 dark:text-white">
          No ranking has been computed
        </h2>

        <p class="mt-2 text-sm text-gray-500">
          Compute the ranking first to view the complete points breakdown.
        </p>

        <UButton
          class="mt-5"
          icon="i-lucide-calculator"
          @click="openComputeDialog"
        >
          Compute Ranking
        </UButton>
      </section>

      <template v-else>
        <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Ranking Scheme"
            :value="ranking.ranking_scheme?.name || 'Not specified'"
            icon="i-lucide-scroll-text"
          />

          <SummaryCard
            label="Academic Period"
            :value="`${ranking.school_year || 'N/A'} · ${ranking.semester || 'N/A'}`"
            icon="i-lucide-calendar-days"
          />

          <SummaryCard
            label="Assigned Rank"
            :value="ranking.rank_name || 'Not assigned'"
            icon="i-lucide-award"
          />

          <SummaryCard
            label="MAX RATE"
            :value="formatCurrency(ranking.max_rate)"
            icon="i-lucide-philippine-peso"
          />
        </section>

        <section class="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div
            class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              class="border-b border-gray-200 px-5 py-4 dark:border-gray-800"
            >
              <h2 class="font-bold text-gray-900 dark:text-white">
                Ranking Category Breakdown
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Points contributed by each ranking category.
              </p>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full min-w-[680px] text-sm">
                <thead
                  class="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500 dark:bg-gray-950/40"
                >
                  <tr>
                    <th class="px-5 py-3 text-left">Category</th>
                    <th class="px-4 py-3 text-left">Source</th>
                    <th class="px-5 py-3 text-right">Points</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr
                    v-for="item in categoryRows"
                    :key="item.key"
                    class="hover:bg-gray-50/80 dark:hover:bg-gray-950/30"
                  >
                    <td class="px-5 py-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                        >
                          <UIcon :name="item.icon" class="size-4" />
                        </div>

                        <span class="font-semibold text-gray-900 dark:text-white">
                          {{ item.label }}
                        </span>
                      </div>
                    </td>

                    <td class="px-4 py-4 text-gray-500">
                      {{ item.source }}
                    </td>

                    <td class="px-5 py-4 text-right">
                      <UBadge color="info" variant="subtle">
                        {{ formatPoints(item.points) }}
                      </UBadge>
                    </td>
                  </tr>
                </tbody>

                <tfoot
                  class="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/40"
                >
                  <tr>
                    <td colspan="2" class="px-5 py-4 font-bold">
                      Total Portfolio Points
                    </td>

                    <td class="px-5 py-4 text-right font-black">
                      {{ formatPoints(ranking.total_portfolio_points) }}
                    </td>
                  </tr>

                  <tr>
                    <td colspan="2" class="px-5 py-4 font-bold">
                      Total Evaluation Points
                    </td>

                    <td class="px-5 py-4 text-right font-black">
                      {{ formatPoints(ranking.evaluation_points) }}
                    </td>
                  </tr>

                  <tr class="text-base">
                    <td colspan="2" class="px-5 py-4 font-black">
                      Total Ranking Points
                    </td>

                    <td class="px-5 py-4 text-right font-black text-blue-700 dark:text-blue-400">
                      {{ formatPoints(ranking.total_ranking_points) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div class="space-y-6">
            <section
              class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h2 class="font-bold text-gray-900 dark:text-white">
                Evaluation Sources
              </h2>

              <p class="mt-1 text-xs text-gray-500">
                Automatic and manual evaluation components used in the ranking.
              </p>

              <div class="mt-5 space-y-3">
                <EvaluationCard
                  label="Student Evaluation"
                  :points="ranking.student_evaluation_points"
                  :maximum="studentMaximum"
                  source="Automatic"
                  :rating="studentRating"
                  icon="i-lucide-graduation-cap"
                />

                <EvaluationCard
                  label="Immediate Superior"
                  :points="ranking.immediate_superior_evaluation_points"
                  :maximum="superiorMaximum"
                  :source="isDean ? 'Manual HR Entry' : 'Automatic'"
                  :rating="superiorRating"
                  icon="i-lucide-user-round-check"
                />

                <EvaluationCard
                  label="HR Evaluation"
                  :points="ranking.hr_evaluation_points"
                  :maximum="hrMaximum"
                  source="Manual HR Entry"
                  :rating="hrRating"
                  icon="i-lucide-briefcase-business"
                />
              </div>
            </section>

            <section
              class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h2 class="font-bold text-gray-900 dark:text-white">
                Rank and Rate Assignment
              </h2>

              <div class="mt-5 space-y-4">
                <InfoRow
                  label="Rank"
                  :value="ranking.rank_name || 'Not assigned'"
                />

                <InfoRow
                  label="Rank Code"
                  :value="ranking.rank_code || 'N/A'"
                />

                <InfoRow
                  label="MAX RATE"
                  :value="formatCurrency(ranking.max_rate)"
                />

                <InfoRow
                  label="Rate Status"
                  :value="formatStatus(ranking.rate_assignment_status)"
                />

                <InfoRow
                  label="Computation Status"
                  :value="formatStatus(ranking.computation_status)"
                />

                <InfoRow
                  label="Computed At"
                  :value="formatDateTime(ranking.computed_at)"
                />
              </div>

              <div
                v-if="ranking.rate_assignment_message"
                class="mt-5 rounded-xl bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-950/40 dark:text-gray-300"
              >
                {{ ranking.rate_assignment_message }}
              </div>
            </section>
          </div>
        </section>

        <section
          v-if="ranking.remarks"
          class="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/20"
        >
          <div class="flex gap-3">
            <UIcon
              name="i-lucide-info"
              class="mt-0.5 size-5 shrink-0 text-amber-600"
            />

            <div>
              <h2 class="font-bold text-gray-900 dark:text-white">
                Computation Remarks
              </h2>

              <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {{ ranking.remarks }}
              </p>
            </div>
          </div>
        </section>
      </template>
    </template>

    <UModal
      v-model:open="computeDialogOpen"
      id="hr-recompute-ranking-detail"
      :ui="{ content: 'max-w-2xl' }"
    >
      <template #content>
        <div
          class="max-h-[90vh] overflow-y-auto rounded-[28px] bg-white dark:bg-gray-900"
        >
          <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ ranking ? "Recompute Ranking" : "Compute Ranking" }}
            </h2>

            <p class="mt-1 text-sm text-gray-500">
              {{ teacherName }}
            </p>
          </div>

          <UForm
            :state="computeForm"
            class="space-y-5 p-6"
            @submit="computeRanking"
          >
            <UFormField label="Ranking Scheme" required>
              <USelectMenu
                v-model="computeForm.ranking_scheme_document_id"
                :items="schemeOptions"
                value-key="value"
                class="w-full"
              />
            </UFormField>

            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="School Year" required>
                <UInput
                  v-model="computeForm.school_year"
                  placeholder="2026-2027"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Semester" required>
                <USelectMenu
                  v-model="computeForm.semester"
                  :items="semesterOptions"
                  value-key="value"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div
              class="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800"
            >
              <UButton
                color="neutral"
                variant="soft"
                @click="computeDialogOpen = false"
              >
                Cancel
              </UButton>

              <UButton
                type="submit"
                icon="i-lucide-calculator"
                :loading="computing"
              >
                {{ ranking ? "Recompute" : "Compute Ranking" }}
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  middleware: ["auth", "role"],
  role: ["HR", "Admin"],
});

const route = useRoute();
const { $api } = useNuxtApp();
const toast = useToast();

const loading = ref(false);
const computing = ref(false);
const loadError = ref("");

const teacher = ref<any>(null);
const ranking = ref<any>(null);
const rankingSchemes = ref<any[]>([]);

const computeDialogOpen = ref(false);

const computeForm = reactive({
  ranking_scheme_document_id: "",
  school_year: "2026-2027",
  semester: "1st Semester",
});

const semesterOptions = [
  { label: "1st Semester", value: "1st Semester" },
  { label: "2nd Semester", value: "2nd Semester" },
  { label: "Summer", value: "Summer" },
  { label: "Annual", value: "Annual" },
];

const teacherName = computed(
  () =>
    teacher.value?.name ||
    teacher.value?.full_name ||
    teacher.value?.user?.username ||
    "Faculty Member",
);

const teacherRole = computed(
  () =>
    teacher.value?.user?.role?.name ||
    teacher.value?.user?.role?.type ||
    teacher.value?.role ||
    "Faculty",
);

const isDean = computed(() =>
  String(teacherRole.value || "")
    .trim()
    .toLowerCase()
    .includes("dean"),
);

const departmentName = computed(
  () => teacher.value?.department?.name || "Department not specified",
);

const activeScheme = computed(() =>
  rankingSchemes.value.find(
    (scheme: any) =>
      scheme.is_active === true && scheme.scheme_status === "active",
  ),
);

const schemeOptions = computed(() =>
  rankingSchemes.value.map((scheme: any) => ({
    label: `${scheme.name} (${scheme.academic_year || scheme.version || "No version"})`,
    value: scheme.documentId,
  })),
);

const selectedScheme = computed(() =>
  rankingSchemes.value.find(
    (scheme: any) =>
      scheme.documentId === ranking.value?.ranking_scheme?.documentId,
  ) ||
  activeScheme.value ||
  null,
);

const studentMaximum = computed(
  () => Number(selectedScheme.value?.student_evaluation_max_points ?? 5),
);

const superiorMaximum = computed(
  () => Number(selectedScheme.value?.immediate_superior_max_points ?? 4),
);

const hrMaximum = computed(
  () => Number(selectedScheme.value?.hr_evaluation_max_points ?? 4),
);

const studentRating = computed(() =>
  resolveStudentRating(Number(ranking.value?.student_evaluation_points || 0)),
);

const superiorRating = computed(() =>
  resolveFourPointRating(
    Number(ranking.value?.immediate_superior_evaluation_points || 0),
  ),
);

const hrRating = computed(() =>
  resolveFourPointRating(Number(ranking.value?.hr_evaluation_points || 0)),
);

const categoryRows = computed(() => [
  {
    key: "educational_qualifications",
    label: "Educational Qualifications",
    source: "Portfolio Entry",
    points: ranking.value?.educational_qualification_points,
    icon: "i-lucide-graduation-cap",
  },
  {
    key: "eligibility",
    label: "Eligibility",
    source: "Portfolio Entry",
    points: ranking.value?.eligibility_points,
    icon: "i-lucide-badge-check",
  },
  {
    key: "training_seminars",
    label: "Training and Seminars",
    source: "Portfolio Entry",
    points: ranking.value?.training_seminar_points,
    icon: "i-lucide-presentation",
  },
  {
    key: "research",
    label: "Research",
    source: "Portfolio Entry",
    points: ranking.value?.research_points,
    icon: "i-lucide-flask-conical",
  },
  {
    key: "awards_recognition",
    label: "Awards and Recognition",
    source: "Portfolio Entry",
    points: ranking.value?.awards_recognition_points,
    icon: "i-lucide-trophy",
  },
  {
    key: "professional_experience",
    label: "Professional Experience",
    source: "Portfolio Entry",
    points: ranking.value?.professional_experience_points,
    icon: "i-lucide-briefcase",
  },
  {
    key: "loyalty",
    label: "Loyalty",
    source: "Portfolio Entry",
    points: ranking.value?.loyalty_points,
    icon: "i-lucide-heart-handshake",
  },
  {
    key: "corporate_social_responsibility",
    label: "Corporate Social Responsibility",
    source: "Portfolio Entry",
    points: ranking.value?.csr_points,
    icon: "i-lucide-hand-heart",
  },
]);

const HeroStat = defineComponent({
  props: {
    label: String,
    value: [String, Number],
  },

  setup(props) {
    return () =>
      h(
        "div",
        {
          class:
            "rounded-2xl border border-white/15 bg-white/10 p-3 text-center",
        },
        [
          h(
            "p",
            {
              class: "text-xl font-bold sm:text-2xl",
            },
            String(props.value ?? 0),
          ),

          h(
            "p",
            {
              class:
                "mt-1 text-[10px] uppercase tracking-wide text-blue-100",
            },
            props.label,
          ),
        ],
      );
  },
});

const SummaryCard = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    icon: String,
  },

  setup(props) {
    return () =>
      h(
        "div",
        {
          class:
            "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900",
        },
        [
          h(
            "div",
            {
              class: "flex items-start justify-between gap-3",
            },
            [
              h("div", { class: "min-w-0" }, [
                h(
                  "p",
                  {
                    class: "text-xs text-gray-500",
                  },
                  props.label,
                ),

                h(
                  "p",
                  {
                    class:
                      "mt-2 truncate font-black text-gray-900 dark:text-white",
                  },
                  String(props.value ?? "N/A"),
                ),
              ]),

              h(resolveComponent("UIcon"), {
                name: props.icon,
                class: "size-5 shrink-0 text-blue-600",
              }),
            ],
          ),
        ],
      );
  },
});

const EvaluationCard = defineComponent({
  props: {
    label: String,
    points: [String, Number],
    maximum: [String, Number],
    source: String,
    rating: String,
    icon: String,
  },

  setup(props) {
    return () =>
      h(
        "div",
        {
          class:
            "rounded-2xl border border-gray-200 p-4 dark:border-gray-800",
        },
        [
          h("div", { class: "flex items-start gap-3" }, [
            h(
              "div",
              {
                class:
                  "flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
              },
              [
                h(resolveComponent("UIcon"), {
                  name: props.icon,
                  class: "size-5",
                }),
              ],
            ),

            h("div", { class: "min-w-0 flex-1" }, [
              h(
                "p",
                {
                  class:
                    "font-semibold text-gray-900 dark:text-white",
                },
                props.label,
              ),

              h(
                "p",
                {
                  class: "mt-1 text-xs text-gray-500",
                },
                `${props.source} · ${props.rating || "No Rating"}`,
              ),

              h(
                "p",
                {
                  class:
                    "mt-2 text-lg font-black text-blue-700 dark:text-blue-400",
                },
                `${formatPoints(props.points)} / ${formatPoints(props.maximum)}`,
              ),
            ]),
          ]),
        ],
      );
  },
});

const InfoRow = defineComponent({
  props: {
    label: String,
    value: [String, Number],
  },

  setup(props) {
    return () =>
      h(
        "div",
        {
          class:
            "flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-gray-800",
        },
        [
          h(
            "span",
            {
              class: "text-sm text-gray-500",
            },
            props.label,
          ),

          h(
            "span",
            {
              class:
                "text-right text-sm font-semibold text-gray-900 dark:text-white",
            },
            String(props.value ?? "N/A"),
          ),
        ],
      );
  },
});

const getDocumentId = () => {
  const params = route.params || {};

  const raw =
    params.documentId ??
    params.documentid ??
    params.id ??
    Object.values(params)[0] ??
    "";

  return String(Array.isArray(raw) ? raw[0] : raw || "").trim();
};

const getRankingDocumentId = () => {
  const value = route.query.ranking;

  return String(Array.isArray(value) ? value[0] : value || "").trim();
};

const openComputeDialog = () => {
  const scheme =
    ranking.value?.ranking_scheme ||
    activeScheme.value ||
    rankingSchemes.value[0] ||
    null;

  computeForm.ranking_scheme_document_id =
    scheme?.documentId || "";

  computeForm.school_year =
    ranking.value?.school_year ||
    scheme?.academic_year ||
    "2026-2027";

  computeForm.semester =
    ranking.value?.semester ||
    "1st Semester";

  computeDialogOpen.value = true;
};

const computeRanking = async () => {
  const teacherDocumentId = teacher.value?.documentId || getDocumentId();

  if (!teacherDocumentId) {
    toast.add({
      title: "Teacher unavailable",
      description: "The personnel record has no valid document ID.",
      color: "error",
    });
    return;
  }

  if (!computeForm.ranking_scheme_document_id) {
    toast.add({
      title: "Ranking scheme required",
      description: "Select a ranking scheme before computing.",
      color: "error",
    });
    return;
  }

  if (!computeForm.school_year.trim()) {
    toast.add({
      title: "School year required",
      description: "Enter the applicable school year.",
      color: "error",
    });
    return;
  }

  computing.value = true;

  try {
    await $api(`/faculty-rankings/compute/${teacherDocumentId}`, {
      method: "POST",
      body: {
        data: {
          ranking_scheme_document_id:
            computeForm.ranking_scheme_document_id,
          school_year: computeForm.school_year.trim(),
          semester: computeForm.semester,
        },
      },
    });

    toast.add({
      title: ranking.value ? "Ranking recomputed" : "Ranking computed",
      description: `${teacherName.value}'s ranking was processed successfully.`,
      color: "success",
      icon: "i-lucide-circle-check",
    });

    computeDialogOpen.value = false;
    await loadData();
  } catch (error: any) {
    toast.add({
      title: "Unable to compute ranking",
      description:
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred.",
      color: "error",
    });
  } finally {
    computing.value = false;
  }
};

const loadData = async () => {
  const teacherDocumentId = getDocumentId();
  const requestedRankingDocumentId = getRankingDocumentId();

  if (
    !teacherDocumentId ||
    ["undefined", "null"].includes(teacherDocumentId)
  ) {
    loadError.value =
      "The selected personnel record does not have a valid document ID.";
    return;
  }

  loading.value = true;
  loadError.value = "";

  try {
    const [teacherResponse, schemeResponse]: any[] = await Promise.all([
      $api(`/teachers/${encodeURIComponent(teacherDocumentId)}`, {
        query: {
          "populate[department]": true,
          "populate[user][populate][role]": true,
        },
      }),

      $api("/ranking-schemes", {
        query: {
          "filters[scheme_status][$eq]": "active",
          "filters[is_active][$eq]": true,
          "sort[0]": "effective_date:desc",
          "pagination[page]": 1,
          "pagination[pageSize]": 100,
        },
      }),
    ]);

    teacher.value =
      teacherResponse?.data ||
      teacherResponse ||
      null;

    rankingSchemes.value =
      schemeResponse?.data || [];

    if (requestedRankingDocumentId) {
      const rankingResponse: any = await $api(
        `/faculty-rankings/${encodeURIComponent(requestedRankingDocumentId)}`,
        {
          query: {
            "populate[teacher][populate][department]": true,
            "populate[teacher][populate][user][populate][role]": true,
            "populate[ranking_scheme]": true,
            "populate[rank_band]": true,
            "populate[salary_rate_record]": true,
            "populate[computed_by]": true,
          },
        },
      );

      ranking.value =
        rankingResponse?.data ||
        rankingResponse ||
        null;
    } else {
      const rankingResponse: any = await $api("/faculty-rankings", {
        query: {
          "filters[teacher][documentId][$eq]": teacherDocumentId,
          "populate[teacher][populate][department]": true,
          "populate[teacher][populate][user][populate][role]": true,
          "populate[ranking_scheme]": true,
          "populate[rank_band]": true,
          "populate[salary_rate_record]": true,
          "populate[computed_by]": true,
          "sort[0]": "computed_at:desc",
          "pagination[page]": 1,
          "pagination[pageSize]": 1,
        },
      });

      ranking.value =
        rankingResponse?.data?.[0] ||
        null;
    }
  } catch (error: any) {
    teacher.value = null;
    ranking.value = null;
    rankingSchemes.value = [];

    loadError.value =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      "Unable to load the selected faculty ranking.";
  } finally {
    loading.value = false;
  }
};

const resolveStudentRating = (points: number) => {
  if (points >= 5) return "Outstanding";
  if (points >= 4) return "Excellent";
  if (points >= 3) return "Satisfactory";
  if (points >= 2) return "Fair";
  if (points >= 1) return "Poor";
  return "No Rating";
};

const resolveFourPointRating = (points: number) => {
  if (points >= 4) return "Excellent";
  if (points >= 3) return "Satisfactory";
  if (points >= 2) return "Fair";
  if (points >= 1) return "Poor";
  return "No Rating";
};

const initials = (value: string) =>
  String(value || "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const formatPoints = (value: unknown) => {
  const numberValue = Number(value ?? 0);

  if (!Number.isFinite(numberValue)) {
    return "0";
  }

  return Number.isInteger(numberValue)
    ? String(numberValue)
    : numberValue.toFixed(4).replace(/\.?0+$/, "");
};

const formatCurrency = (value: unknown) => {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return "Not configured";
  }

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

const formatPlainAmount = (value: unknown) => {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

const formatStatus = (value: unknown) =>
  String(value || "N/A")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatDateTime = (value: unknown) => {
  if (!value) return "N/A";

  const date = new Date(String(value));

  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
};

watch(
  () => route.fullPath,
  () => {
    loadData();
  },
);

onMounted(loadData);
</script>
