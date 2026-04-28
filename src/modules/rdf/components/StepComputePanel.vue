<template>
  <section>
    <q-card flat bordered class="q-mb-md bg-blue-grey-10">
      <q-card-section>
        <div class="text-h6">第 3 步：计算与结果预览</div>
        <div class="text-subtitle2 q-mt-sm text-grey-4">
          目标：调整 RDF 参数并观察曲线变化，确认后进入结果页导出。
        </div>
        <div class="text-body2 q-mt-sm text-grey-5">
          完成条件：图像区域与 6 张曲线可正常更新且无报错。
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
