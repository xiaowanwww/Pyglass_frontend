<template>
  <q-tabs v-model="currentTab" dense align="left" class="bg-black text-white shadow-2">
    <q-tab name="home" label="主页" />
    <q-tab name="rdf" label="RDF工作流" />
    <q-tab name="sim" label="SIM" />
    <q-tab name="xem" label="ACOM VIEWER" />
  </q-tabs>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const currentTab = computed({
  get() {
  if (route.path.startsWith("/workspace/rdf")) {
    return "rdf";
  }

  if (route.name === "DiffSim") {
    return "sim";
  }

  if (route.name === "AcomViewer") {
    return "xem";
  }

  return "home";
  },
  set(tab) {
    const targetMap = {
      home: { name: "home" },
      rdf: { name: "rdf_workflow_v2" },
      sim: { name: "DiffSim" },
      xem: { name: "AcomViewer" },
    };

    const target = targetMap[tab];
    if (target) {
      router.push(target);
    }
  },
});

defineOptions({
  name: "AppTopNav",
});
</script>