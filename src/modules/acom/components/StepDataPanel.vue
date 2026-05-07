<template>
  <section class="legacy-host">
    <ViewDm4Legacy />
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
