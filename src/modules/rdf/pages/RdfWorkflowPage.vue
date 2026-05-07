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
      <q-tab name="upload" label="1. 上传与预处理" />
      <q-tab name="elements" label="2. 元素与占比" />
      <q-tab name="compute" label="3. 计算与预览" />
    </q-tabs>

    <q-tab-panels v-model="activeStep" animated class="q-mt-md bg-transparent">
      <q-tab-panel name="upload" class="q-pa-none">
        <StepUploadPanel />
      </q-tab-panel>
      <q-tab-panel name="elements" class="q-pa-none">
        <StepElementPanel />
      </q-tab-panel>
      <q-tab-panel name="compute" class="q-pa-none">
        <StepComputePanel />
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
import StepUploadPanel from "src/modules/rdf/components/StepUploadPanel.vue";
import StepElementPanel from "src/modules/rdf/components/StepElementPanel.vue";
import StepComputePanel from "src/modules/rdf/components/StepComputePanel.vue";

const steps = ["upload", "elements", "compute"];
const activeStep = ref("upload");

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
  name: "RdfWorkflowPage",
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
