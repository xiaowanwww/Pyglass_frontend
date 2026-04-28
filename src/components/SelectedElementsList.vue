<template>
  <div class="selected-elements-panel">
    <div class="panel-header">
      <div>
        <div class="text-subtitle1 text-weight-medium">已选择的元素</div>
        <div class="text-caption" :class="statusClass">{{ statusText }}</div>
      </div>

      <div v-if="localSelectedElements.length > 0" class="header-actions">
        <q-btn
          label="重新选择元素"
          icon="refresh"
          color="primary"
          outline
          @click="emit('clear-elements')"
        />
        <q-btn
          label="保存元素占比"
          icon="save"
          color="positive"
          unelevated
          :disable="!canSave"
          @click="saveElements"
        />
      </div>
    </div>

    <q-scroll-area class="selected-scroll">
      <q-list v-if="localSelectedElements.length > 0" bordered separator>
        <q-item
          v-for="(element, index) in localSelectedElements"
          :key="element.symbol"
        >
          <q-item-section>
            <q-item-label>{{ element.symbol }}</q-item-label>
            <q-item-label caption>{{ element.name }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-input
              v-model.number="element.quantity"
              type="number"
              min="0"
              @update:model-value="updateQuantity(index, $event)"
              style="width: 100px"
              dense
              outlined
            />
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else class="empty-state text-grey-5">
        No elements selected.
      </div>
    </q-scroll-area>

    <q-table
      :rows="elementsWithPercentage"
      :columns="columns"
      row-key="symbol"
      :rows-per-page-options="[0]"
      virtual-scroll
      dense
      flat
      bordered
      class="q-mt-md percentage-table"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { socketRDF } from "boot/socketio";

const socket = socketRDF;
const emit = defineEmits(["clear-elements"]);
const props = defineProps({
  selectedElements: {
    type: Array,
    required: true,
  },
});

const normalizeElement = (element, existingElement) => ({
  ...element,
  quantity: existingElement?.quantity ?? element.quantity ?? 1,
});

const localSelectedElements = ref(
  props.selectedElements.map((element) => normalizeElement(element))
);
const elementsWithPercentage = ref([]);
const saveState = ref("idle");

const columns = [
  { name: "symbol", label: "Element", field: "symbol", align: "left" },
  { name: "quantity", label: "Quantity", field: "quantity", align: "center" },
  {
    name: "percentage",
    label: "Percentage",
    field: "percentage",
    align: "center",
  },
];

const totalQuantity = computed(() =>
  localSelectedElements.value.reduce(
    (sum, element) => sum + (Number(element.quantity) || 0),
    0
  )
);

const hasInvalidQuantity = computed(() =>
  localSelectedElements.value.some((element) => {
    const quantity = Number(element.quantity);
    return !Number.isFinite(quantity) || quantity < 0;
  })
);

const canSave = computed(
  () =>
    localSelectedElements.value.length > 0 &&
    totalQuantity.value > 0 &&
    !hasInvalidQuantity.value
);

const statusText = computed(() => {
  if (localSelectedElements.value.length === 0) {
    return "请选择元素";
  }

  if (!canSave.value) {
    return "请输入有效数量";
  }

  return saveState.value === "saved" ? "已保存" : "未保存";
});

const statusClass = computed(() => ({
  "text-positive": saveState.value === "saved" && canSave.value,
  "text-warning": saveState.value !== "saved" && canSave.value,
  "text-negative": localSelectedElements.value.length > 0 && !canSave.value,
}));

const updateQuantity = (index, newQuantity) => {
  localSelectedElements.value[index].quantity = newQuantity;
  saveState.value = "dirty";
};

const saveElements = () => {
  if (!canSave.value) {
    return;
  }

  elementsWithPercentage.value = localSelectedElements.value.map((element) => ({
    ...element,
    percentage: Number(element.quantity) / totalQuantity.value,
  }));

  const selectedFields = elementsWithPercentage.value.map((element) => ({
    atomicNumber: element.atomicNumber,
    symbol: element.symbol,
    percentage: element.percentage,
  }));
  socket.emit("select_elements", selectedFields);
  saveState.value = "saved";
  console.log("Elements with percentage:", elementsWithPercentage.value);
};

// 监听 selectedElements 的变化，更新本地副本
watch(
  () => props.selectedElements,
  (newSelectedElements) => {
    localSelectedElements.value = newSelectedElements.map((element) => {
      const existingElement = localSelectedElements.value.find(
        (localElement) => localElement.symbol === element.symbol
      );
      return normalizeElement(element, existingElement);
    });

    if (newSelectedElements.length === 0) {
      elementsWithPercentage.value = [];
      saveState.value = "idle";
      return;
    }

    saveState.value = "dirty";
  },
  { deep: true }
);
</script>

<style scoped>
.selected-elements-panel {
  min-height: 100%;
  padding: 16px;
  border: 1px solid rgba(110, 126, 154, 0.35);
  border-radius: 8px;
  background: rgba(16, 20, 31, 0.72);
}

.panel-header {
  min-height: 40px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.selected-scroll {
  height: 260px;
}

.empty-state {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(110, 126, 154, 0.35);
  border-radius: 8px;
}

.percentage-table {
  height: 260px;
}
</style>
