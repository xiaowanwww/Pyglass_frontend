<template>
  <q-layout view="hHh lpr lFf">
    <q-header>
      <AppTopNav />
    </q-header>
    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppTopNav from "components/AppTopNav.vue";

defineOptions({
  name: "RDFLayout",
});
</script>
