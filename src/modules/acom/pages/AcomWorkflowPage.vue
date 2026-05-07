<template>
  <q-page class="q-px-md q-pb-md workflow-page">
    <q-tabs
      v-model="activeStep"
      dense
      no-caps
      class="bg-grey-10 text-white rounded-borders"
      active-color="cyan-4"
      indicator-color="cyan-4"
      align="left"
    >
      <q-tab name="data" label="1. 数据加载" />
      <q-tab name="simulation" label="2. 模拟与匹配" />
      <q-tab name="viewer" label="3. ACOM 查看" />
    </q-tabs>

    <q-tab-panels v-model="activeStep" animated class="q-mt-md bg-transparent">
      <q-tab-panel name="data" class="q-pa-none">
        <StepDataPanel />
      </q-tab-panel>
      <q-tab-panel name="simulation" class="q-pa-none">
        <StepSimulationPanel />
      </q-tab-panel>
      <q-tab-panel name="viewer" class="q-pa-none">
        <StepViewerPanel />
      </q-tab-panel>
    </q-tab-panels>

    <q-page-sticky position="bottom" :offset="[0, 12]" class="full-width">
      <div class="footer-actions q-px-md q-py-sm">
        <div class="row q-col-gutter-sm justify-center">
          <div class="col-auto">
            <q-btn
              color="primary"
              outline
              label="上一步"
              :disable="activeStep === steps[0]"
              @click="prevStep"
            />
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              label="下一步"
              :disable="activeStep === steps[steps.length - 1]"
              @click="nextStep"
            />
          </div>
        </div>
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import StepDataPanel from "src/modules/acom/components/StepDataPanel.vue";
import StepSimulationPanel from "src/modules/acom/components/StepSimulationPanel.vue";
import StepViewerPanel from "src/modules/acom/components/StepViewerPanel.vue";

const steps = ["data", "simulation", "viewer"];
const activeStep = ref("data");

const nextStep = () => {
  const index = steps.indexOf(activeStep.value);
  if (index < steps.length - 1) {
    activeStep.value = steps[index + 1];
  }
};

const prevStep = () => {
  const index = steps.indexOf(activeStep.value);
  if (index > 0) {
    activeStep.value = steps[index - 1];
  }
};

defineOptions({
  name: "AcomWorkflowPage",
});
</script>

<style scoped>
.workflow-page {
  padding-bottom: 88px;
}

.footer-actions {
  background: rgba(16, 20, 31, 0.9);
  border: 1px solid rgba(110, 126, 154, 0.35);
  border-radius: 12px;
  backdrop-filter: blur(6px);
}
</style>
