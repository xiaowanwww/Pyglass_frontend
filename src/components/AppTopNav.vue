<template>
  <q-tabs dense align="left" class="bg-black text-white shadow-2">
    <q-route-tab :to="{ name: 'home' }" exact label="主页" />
    <q-route-tab :to="{ name: 'data_preprocess' }" label="数据预处理" />
    <q-route-tab :to="{ name: 'cif_elements' }" label="CIF与元素" />
    <q-route-tab :to="{ name: 'rdf_workflow_v2' }" label="RDF工作流" />
    <q-route-tab :to="{ name: 'acom_workflow' }" label="ACOM工作流" />
  </q-tabs>
</template>

<script setup>
defineOptions({
  name: "AppTopNav",
});
</script>
