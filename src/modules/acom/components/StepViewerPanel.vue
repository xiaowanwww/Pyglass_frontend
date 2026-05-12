<template>
  <section>
    <q-card flat bordered class="q-mb-md bg-blue-grey-10">
      <q-card-section>
        <div class="text-h6">第 3 步：ACOM 查看</div>
        <div class="text-subtitle2 q-mt-sm text-grey-4">
          提示：加载匹配结果和模拟库，设置对称性、投影方向与阈值，并点击 IPF 图检查模板叠加效果。
        </div>
      </q-card-section>
    </q-card>

    <div class="legacy-host">
      <AcomViewerLegacy />
    </div>
  </section>
</template>

<script setup>
import AcomViewerLegacy from "src/pages/ACOM_XEM/ACOM_Viewer.vue";

defineOptions({
  name: "AcomStepViewerPanel",
});
</script>

<style scoped>
.legacy-host :deep(.q-page) {
  padding: 0 !important;
}
</style>
