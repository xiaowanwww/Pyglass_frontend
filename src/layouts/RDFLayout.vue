<template>
  <div>
    <q-toolbar class="bg-grey-10 text-white">
      <q-toolbar-title>RDF 工作流</q-toolbar-title>
    </q-toolbar>

    <router-view />
  </div>
</template>

<script setup>
defineOptions({
  name: "RDFLayout",
});
</script>
