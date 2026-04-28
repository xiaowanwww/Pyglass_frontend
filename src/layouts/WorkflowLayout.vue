<template>
  <q-layout view="hHh lpr lFf">
    <q-header class="bg-black text-white">
      <q-toolbar>
        <q-toolbar-title>RDF 工作流</q-toolbar-title>
      </q-toolbar>
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
