<template>
  <section>
    <q-card flat bordered class="q-mb-md bg-blue-grey-10">
      <q-card-section>
        <div class="text-h6">第 3 步：计算与结果</div>
        <div class="text-subtitle2 q-mt-sm text-grey-4">
          提示：调整 RDF 参数，观察曲线变化。
        </div>
      </q-card-section>
    </q-card>

    <div class="legacy-host">
      <RdfPlotLegacy />
    </div>
  </section>
</template>

<script setup>
import RdfPlotLegacy from "src/pages/RDF_plot.vue";

defineOptions({
  name: "StepComputePanel",
});
</script>

<style scoped>
.legacy-host :deep(.q-page) {
  padding: 0 !important;
}
</style>
