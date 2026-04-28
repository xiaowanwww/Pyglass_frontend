<template>
  <q-tabs dense align="left" class="bg-black text-white shadow-2">
    <q-route-tab :to="{ name: 'home' }" exact label="主页" />
    <q-route-tab :to="{ name: 'rdf_workflow_v2' }" label="RDF工作流" />
    <q-route-tab :to="{ name: 'DiffSim' }" label="SIM" />
    <q-route-tab :to="{ name: 'AcomViewer' }" label="ACOM VIEWER" />
  </q-tabs>
</template>

<script setup>
defineOptions({
  name: "AppTopNav",
});
</script>
