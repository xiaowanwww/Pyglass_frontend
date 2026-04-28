<template>
  <q-tabs dense align="left" class="bg-black text-white shadow-2">
    <q-route-tab name="home" label="主页" exact :to="{ name: 'home' }" />
    <q-route-tab
      name="rdf"
      label="RDF工作流"
      exact
      :to="{ name: 'rdf_workflow_v2' }"
    />
    <q-route-tab name="sim" label="SIM" exact :to="{ name: 'DiffSim' }" />
    <q-route-tab
      name="xem"
      label="ACOM VIEWER"
      exact
      :to="{ name: 'AcomViewer' }"
    />
  </q-tabs>
</template>

<script setup>
defineOptions({
  name: "AppTopNav",
});
</script>