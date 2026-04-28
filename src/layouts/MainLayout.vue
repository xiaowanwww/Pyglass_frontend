<template>
  <q-layout view="hHh lpr lFf">
    <q-header v-if="!hideTopNav" class="bg-black text-white shadow-2">
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
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppTopNav from "components/AppTopNav.vue";

const route = useRoute();
const hideTopNav = computed(() => route.path.startsWith("/workspace/rdf"));

defineOptions({
  name: "MainLayout",
});
</script>
