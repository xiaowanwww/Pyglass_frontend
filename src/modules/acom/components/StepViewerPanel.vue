<template>
  <section class="legacy-host">
    <AcomViewerLegacy />
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
