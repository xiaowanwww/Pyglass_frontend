<template>
  <q-layout view="hHh lpr lFf">
    <q-header class="bg-black text-white">
      <q-toolbar>
        <q-toolbar-title>RDF 工作流</q-toolbar-title>
      </q-toolbar>
      <q-tabs dense align="left" class="bg-grey-10 text-white">
        <q-route-tab
          label="步骤 1：概览"
          :to="{ name: 'rdf_overview_v2' }"
          exact
        />
        <q-route-tab
          label="步骤 2：流程"
          :to="{ name: 'rdf_workflow_v2' }"
          exact
        />
        <q-route-tab
          label="步骤 3：结果"
          :to="{ name: 'rdf_result_v2' }"
          exact
        />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
defineOptions({
  name: "WorkflowLayout",
});
</script>
