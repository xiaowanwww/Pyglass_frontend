<template>
  <section>
    <q-card flat bordered class="q-mb-md bg-blue-grey-10">
      <q-card-section>
        <div class="text-h6">第 2 步：模拟与匹配</div>
        <div class="text-subtitle2 q-mt-sm text-grey-4">
          提示：导入 CIF 结构，生成取向网格和模拟衍射库，然后运行模板匹配并保存结果。
        </div>
        <div class="text-subtitle2 q-mt-sm text-grey-4">
          提示：可加载已保存的模拟库。
        </div>
      </q-card-section>
    </q-card>

    <div class="legacy-host">
      <DiffSimLegacy />
    </div>
  </section>
</template>

<script setup>
import DiffSimLegacy from "src/pages/DiffSim/DiffSim.vue";

defineOptions({
  name: "AcomStepSimulationPanel",
});
</script>

<style scoped>
.legacy-host :deep(.q-page) {
  padding: 0 !important;
}
</style>
