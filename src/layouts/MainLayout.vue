<template>
  <q-layout view="hHh lpr lFf">
    <q-header class="bg-black text-white shadow-2">
      <AppTopNav />
    </q-header>

    <q-page-container :class="{ 'app-page-container': !isHomePage }">
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
const isHomePage = computed(() => route.name === "home");

defineOptions({
  name: "MainLayout",
});
</script>

<style scoped>
.app-page-container {
  min-height: 100vh;
  background:
    linear-gradient(rgba(11, 22, 40, 0.92), rgba(5, 12, 24, 0.96)),
    linear-gradient(135deg, rgba(0, 188, 212, 0.16), transparent 32%),
    linear-gradient(315deg, rgba(54, 91, 196, 0.22), transparent 34%),
    repeating-linear-gradient(
      90deg,
      rgba(120, 185, 255, 0.035) 0,
      rgba(120, 185, 255, 0.035) 1px,
      transparent 1px,
      transparent 44px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(120, 185, 255, 0.03) 0,
      rgba(120, 185, 255, 0.03) 1px,
      transparent 1px,
      transparent 44px
    ),
    #071426;
}
</style>
