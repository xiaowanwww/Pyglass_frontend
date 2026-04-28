<template>
  <q-layout view="hHh lpr lFf">
    <q-header>
      <AppTopNav />
    </q-header>

    <q-page-container>
      <q-page class="row">
        <div class="col-2 col-lg-1">
          <q-tabs vertical no-caps>
            <q-route-tab
              label="Select Area"
              :to="{ name: 'Select_Area' }"
              exact
            />
            <q-route-tab label="View" :to="{ name: 'View_Area' }" exact />
            <q-route-tab label="Set Probe" :to="{ name: 'Set_Probe' }" exact />
            <q-route-tab
              label="Detect Bragg Disks"
              :to="{ name: 'Detect_Bragg_Disks' }"
              exact
            />
            <q-route-tab
              label="Calibrate Center"
              :to="{ name: 'Calibrate_Center' }"
              exact
            />
            <q-route-tab
              label="Calibrate Ellipticity"
              :to="{ name: 'Calibrate_Ellipticity' }"
              exact
            />
            <q-route-tab
              label="Calibrate Pixel Size"
              :to="{ name: 'Calibrate_Pixel_Size' }"
              exact
            />
            <q-route-tab
              label="ACOOOOOM!"
              :to="{ name: 'Calculate_ACOM' }"
              exact
            />
          </q-tabs>
        </div>
        <div class="col">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>

  <!-- <router-view /> -->
</template>

<script setup>
import AppTopNav from "components/AppTopNav.vue";

defineOptions({
  name: "ACOMLayout",
});
</script>
