<template>
  <div class="q-pa-md element-workspace">
    <div class="periodic-table-panel">
      <div
        v-for="(row, rowIndex) in periodicTableRows"
        :key="rowIndex"
        class="row q-gutter-y justify-center no-wrap"
        :style="{
          marginBottom: rowIndex === 6 ? '10px' : '0',
        }"
      >
        <q-btn-group square>
          <q-btn
            v-for="element in row"
            :key="element.symbol"
            :label="element.symbol"
            :color="isSelected(element) ? 'dark' : getColor(element.category)"
            class="periodic-element"
            :transparent="element.atomicNumber === 0"
            :style="{ width: getWidth(element.category), height: '34px' }"
            :flat="element.atomicNumber === 0"
            :disable="element.atomicNumber === 0"
            @click="addElement(element)"
          >
            <q-tooltip v-if="element.atomicNumber !== 0">
              <strong>{{ element.name }}</strong> ({{
                element.atomicNumber
              }})<br />
              {{ element.category }}
            </q-tooltip>
          </q-btn>
        </q-btn-group>
      </div>

    </div>

    <SelectedElementsList
      :selectedElements="selectedElements"
      class="selected-panel"
      @clear-elements="clearElements"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { periodicTableRows } from "assets/periodicData";
import SelectedElementsList from "components/SelectedElementsList.vue";

const selectedElements = ref([]);

const getColor = (category) => {
  switch (category) {
    case "Alkali Metal":
      return "blue-4";
    case "Alkaline Earth Metal":
      return "green-5";
    case "Transition Metal":
      return "grey-8";
    case "Lanthanide":
      return "pink-4";
    case "Actinide":
      return "purple-4";
    case "Post-transition Metal":
      return "teal-6";
    case "Metalloid":
      return "orange-6";
    case "Nonmetal":
      return "red-5";
    case "Halogen":
      return "deep-orange-8";
    case "Noble Gas":
      return "cyan-8";
    default:
      return "grey-3";
  }
};

const getWidth = (category) => {
  return "42px";
};

const addElement = (element) => {
  const existingIndex = selectedElements.value.findIndex(
    (el) => el.symbol === element.symbol
  );

  if (existingIndex === -1) {
    selectedElements.value.push({ ...element, quantity: 1 });
  } else {
    selectedElements.value.splice(existingIndex, 1);
  }
  console.log(selectedElements.value);
};

const isSelected = (element) => {
  return selectedElements.value.some((el) => el.symbol === element.symbol);
};

const clearElements = () => {
  selectedElements.value = [];
};
</script>

<style scoped>
.periodic-element {
  text-transform: none;
  font-size: 13px;
  padding: 0;
}

.element-workspace {
  display: grid;
  grid-template-columns: minmax(0, max-content) minmax(360px, 1fr);
  gap: 16px;
  align-items: start;
  overflow-x: auto;
}

.periodic-table-panel {
  min-width: 0;
}

.selected-panel {
  min-width: 360px;
}

@media (max-width: 1200px) {
  .element-workspace {
    grid-template-columns: 1fr;
  }
}
</style>
