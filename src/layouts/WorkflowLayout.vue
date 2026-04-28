<template>
  <q-layout view="hHh lpr lFf">
    <q-header class="bg-black text-white">
      <AppTopNav />
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
import AppTopNav from "components/AppTopNav.vue";

defineOptions({
  name: "WorkflowLayout",
});
</script>
