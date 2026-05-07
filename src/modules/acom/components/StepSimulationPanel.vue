<template>
  <section class="legacy-host">
    <DiffSimLegacy />
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
