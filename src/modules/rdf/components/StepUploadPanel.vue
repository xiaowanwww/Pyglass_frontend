<template>
  <section>
    <q-card flat bordered class="q-mb-md bg-blue-grey-10">
      <q-card-section>
        <div class="text-h6">第 1 步：上传数据与预处理</div>
        <div class="text-subtitle2 q-mt-sm text-grey-4">
          目标：上传 DM4 文件，调整左右图像参数并选择掩膜区域。
        </div>
        <div class="text-body2 q-mt-sm text-grey-5">
          输入要求：建议先在 View 模块确认数据可读，再回到本步骤完成选区。
        </div>
      </q-card-section>
    </q-card>

    <div class="legacy-host">
      <RdfSelLegacy />
    </div>
  </section>
</template>

<script setup>
import RdfSelLegacy from "src/pages/RDF_sel.vue";

defineOptions({
  name: "StepUploadPanel",
});
</script>

<style scoped>
.legacy-host :deep(.q-page) {
  padding: 0 !important;
}
</style>
