<template>
  <UDashboardPanel>
    <!-- Header -->
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #title>
          <span class="text-sm text-gray-500 uppercase">Student Evaluation</span>
        </template>
      </UDashboardNavbar>
    </template>

    <!-- Body -->
    <template #body>
      <div class="flex flex-col lg:flex-row gap-6 px-4 py-6 lg:py-10">
        <!-- LEFT: Teacher Selection -->
        <div class="w-full lg:w-1/4">
          <UCard class="h-full lg:sticky lg:top-4">
            <template #header>
              <h2 class="text-lg font-semibold">Select Teachers</h2>
            </template>
            <div class="flex flex-col gap-2 overflow-y-auto">
              <UCheckboxGroup v-model="selectedTeacherIds" :items="teacherOptions" />
            </div>
          </UCard>
        </div>

        <!-- RIGHT: Evaluation Form -->
        <div class="w-full lg:w-3/4 flex flex-col gap-6">
          <!-- No teacher selected -->
          <div v-if="selectedTeacherIds.length === 0" class="text-center text-gray-400 py-20">
            <p class="text-lg">No teacher selected</p>
            <p class="text-sm">Please select at least one teacher above.</p>
          </div>

          <!-- Evaluation Wizard -->
          <div v-else-if="currentTeacher">
            <UCard>
              <!-- Teacher Info -->
               <template #header>
              <div class="flex items-center gap-4">
                <UAvatar icon="i-lucide-user" size="lg" />
                <div>
                  <p class="text-lg font-semibold">{{ currentTeacher.name }}</p>
                  <p class="text-sm text-gray-500">
                    {{ currentTeacher.department || currentTeacher.subject }}
                  </p>
                </div>
              </div>
              </template>

              <!-- Evaluation Criteria -->
              <div v-for="item in criteria" :key="item.key" class="mb-5">
                <div class="flex justify-between ">
                  <p class="font-medium">{{ item.label }}</p>
                  <span class="text-xs text-gray-400">{{
                    getLabel(currentTeacher.ratings[item.key])
                  }}</span>
                </div>

                <!-- <div class="flex justify-between text-xs text-gray-400">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div> -->

                <URadioGroup v-model="currentTeacher.ratings[item.key]" :items="scaleOptions" orientation="horizontal"
                  class="mt-2" :ui="{
                    fieldset: 'flex flex-wrap justify-between lg:justify-start gap-2 lg:gap-30'
                  }" />
              </div>

              <!-- Comment -->
              <UTextarea v-model="currentTeacher.comment" class="w-full mt-5" placeholder="Write feedback..." />

              <!-- Navigation -->
              <div class="flex flex-col sm:flex-row gap-3 sm:justify-between mt-6">
                <UButton variant="outline" block class="sm:w-auto" :disabled="currentIndex === 0" @click="prevTeacher">Previous</UButton>
                <UButton block class="sm:w-auto" v-if="!isLastTeacher" @click="nextTeacher">Next</UButton>
                <UButton block class="sm:w-auto" v-else :disabled="!isValid || submitted" @click="submit">
                  {{ submitted ? "Submitted" : "Submit Evaluations" }}
                </UButton>
              </div>

              <!-- Step Indicator -->
              <p class="text-center text-sm text-gray-400 mt-2">
                Teacher {{ currentIndex + 1 }} of
                {{ selectedTeacherIds.length }}
              </p>
            </UCard>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
//@ts-nocheck
import { ref, reactive, computed, watch, onMounted } from "vue";

const { $api } = useNuxtApp();
const { user } = useAuth();
const toast = useToast();

// -------------------- State --------------------
const allFaculties = ref([]); // Teachers
const criteria = ref([]); // Evaluation criteria
const selectedTeacherIds = ref([]); // IDs of selected teachers
const selectedFaculties = reactive([]); // Reactive teacher objects
const currentIndex = ref(0);
const submitted = ref(false);
const scaleOptions = ref([]); // Dynamic rating scale

// -------------------- Computed --------------------

// Checkbox options
const teacherOptions = computed(() =>
  allFaculties.value.map((f) => ({
    label: `${f.name} - ${f.department || f.subject}`,
    value: f.id,
  })),
);

// Current teacher
const currentTeacher = computed(
  () => selectedFaculties[currentIndex.value] || null,
);

// Last teacher?
const isLastTeacher = computed(
  () => currentIndex.value === selectedFaculties.length - 1,
);

// Progress
const progress = computed(() => {
  if (!selectedFaculties.length) return 0;
  const done = selectedFaculties.filter((f) =>
    criteria.value.every((c) => f.ratings[c.key] !== null),
  ).length;
  return (done / selectedFaculties.length) * 100;
});

// Validation
const isValid = computed(() =>
  selectedFaculties.every((f) =>
    criteria.value.every((c) => f.ratings[c.key] !== null),
  ),
);

// -------------------- Helpers --------------------
const getLabel = (val) => {
  if (!val) return "";
  const option = scaleOptions.value.find((o) => o.value === val);
  return option ? option.label.split(" - ")[1] : "";
};

const nextTeacher = () => {
  if (!isLastTeacher.value) currentIndex.value++;
};
const prevTeacher = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};

// -------------------- Watchers --------------------
watch([selectedTeacherIds, criteria], ([ids, crits]) => {
  if (!crits.length) return;
  selectedFaculties.splice(0, selectedFaculties.length);
  ids.forEach((id) => {
    const teacher = allFaculties.value.find((t) => t.id === id);
    if (teacher) {
      selectedFaculties.push(
        reactive({
          ...teacher,
          ratings: crits.reduce((acc, c) => ({ ...acc, [c.key]: null }), {}),
          comment: "",
        }),
      );
    }
  });
  currentIndex.value = 0;
});

// -------------------- API Fetch --------------------
const getTeachers = async () => {
  try {
    const res = await $api("/teachers");
    allFaculties.value = res.data;
  } catch (err) {
    console.log(err);
  }
};

const getEvaluationCriteria = async () => {
  try {
    const res = await $api("/evaluation-criterias");
    criteria.value = res.data;
  } catch (err) {
    console.log(err);
  }
};

const getScaleOptions = async () => {
  try {
    const res = await $api("/scale-options");
    // Map to { label, value } for URadioGroup
    scaleOptions.value = res.data
      .sort((a, b) => a.value - b.value)
      .map((s: { value: number; label: string }) => ({
        label: `${s.value} - ${s.label}`,
        value: s.value,
      }));
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  await getTeachers();
  await getEvaluationCriteria();
  await getScaleOptions();
});

// -------------------- Submit --------------------
const submit = async () => {
  if (!isValid.value) return;
  submitted.value = true;

  try {
    for (const f of selectedFaculties) {
      // const payload = {
      //   data: {
      //     teacher: {
      //       connect: [Number(f.id)]
      //     },
      //     student: user.value.id,
      //     ratings: Object.fromEntries(
      //       Object.entries(f.ratings).map(([k, v]) => [k, Number(v)])
      //     ),
      //     comment: typeof f.comment === 'string'
      //       ? f.comment.replace(/^"|"$/g, '')
      //       : ''
      //   }
      // }

      //console.log('Submitting one:', payload)

      // Generate the current timestamp
      const submittedAt = new Date().toISOString();

      // 🔍 Check if already evaluated
      const existing = await $api("/evaluations", {
        method: "GET",
        params: {
          "filters[teacher][id][$eq]": Number(f.id),
          "filters[student][id][$eq]": Number(user.value.id),
        },
      });

      if (existing.data.length > 0) {
        toast.add({
          title: "Already Evaluated",
          description: `${f.name} already evaluated`,
          color: "warning",
        });
        continue; // skip
      }

      await $api("/evaluations", {
        method: "POST",
        body: {
          data: {
            teacher: { connect: [Number(f.id)] },
            student: user.value.id,
            ratings: f.ratings,
            comment: f.comment || "",
            submittedAt: submittedAt,
          },
        },
      });
    }

    toast.add({
      title: "Success",
      description: "All evaluations submitted!",
      color: "success",
    });
  } catch (err) {
    console.error(err);
    toast.add({
      title: "Error",
      description: "Submission failed",
      color: "error",
    });
    submitted.value = false;
  }
};
</script>
