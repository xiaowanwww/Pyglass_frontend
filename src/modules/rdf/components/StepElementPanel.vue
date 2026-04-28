<template>
  <section>
    <q-card flat bordered class="q-mb-md bg-blue-grey-10">
      <q-card-section>
        <div class="text-h6">第 2 步：元素与占比设置</div>
        <div class="text-subtitle2 q-mt-sm text-grey-4">
          目标：选择元素并填写数量，系统会计算比例并发送到 RDF 后端。
        </div>
        <div class="text-body2 q-mt-sm text-grey-5">
          完成条件：点击“Save”后，右侧表格出现 Percentage 并成功发送。
        </div>
      </q-card-section>
    </q-card>

    <RdfTableLegacy />
  </section>
</template>

<script setup>
import RdfTableLegacy from "src/pages/RDF_table.vue";

defineOptions({
  name: "StepElementPanel",
});
</script>
