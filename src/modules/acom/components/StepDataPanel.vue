<template>
  <section>
    <q-card flat bordered class="q-mb-md bg-blue-grey-10">
      <q-card-section>
        <div class="text-h6">第 1 步：数据加载</div>
        <div class="text-subtitle2 q-mt-sm text-grey-4">
          提示：打开实验 4D-STEM 数据文件，检查左右图像显示，并根据需要调整图像参数。
        </div>
      </q-card-section>
    </q-card>

    <div class="legacy-host">
      <ViewDm4Legacy />
    </div>
  </section>
</template>

<script setup>
import ViewDm4Legacy from "src/pages/ViewDM4.vue";

defineOptions({
  name: "AcomStepDataPanel",
});
</script>

<style scoped>
.legacy-host :deep(.q-page) {
  padding: 0 !important;
}
</style>
