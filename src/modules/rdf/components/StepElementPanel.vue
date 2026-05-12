<template>
  <section>
    <q-card flat bordered class="q-mb-md bg-blue-grey-10">
      <q-card-section>
        <div class="text-h6">第 2 步：元素与占比</div>
        <div class="text-subtitle2 q-mt-sm text-grey-4">
          提示：选择元素并填写数量，系统会自动计算比例。
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
