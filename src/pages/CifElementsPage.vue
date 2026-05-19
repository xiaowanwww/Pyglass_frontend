<template>
  <q-page class="q-pa-md cif-page">
    <section class="status-strip q-mb-md">
      <div
        v-for="step in steps"
        :key="step.name"
        class="status-step"
        :class="{ active: step.name === 'cif' }"
      >
        <div class="status-index">{{ step.index }}</div>
        <div class="status-label">{{ step.label }}</div>
      </div>
    </section>

    <section class="cif-grid">
      <q-card flat bordered class="control-panel">
        <q-card-section>
          <div class="panel-title">导入 CIF</div>
          <div class="panel-subtitle">Crystal Structure</div>

          <q-btn
            no-caps
            class="full-width q-mt-md"
            color="primary"
            :loading="isLoadingStructure"
            @click="openCifFile"
          >
            <span v-if="selectedCif">重新导入 CIF</span>
            <span v-else>导入 CIF 文件</span>
          </q-btn>

          <div v-if="selectedCif" class="file-path q-mt-md">
            {{ selectedCif }}
          </div>

          <q-separator dark spaced />

          <div class="panel-title">当前状态</div>
          <div class="status-note q-mt-sm">
            {{ structureStatus }}
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="periodic-panel">
        <q-card-section>
          <div class="panel-title">选取元素</div>
          <div class="panel-subtitle">
            选择结构或 RDF 计算中需要使用的元素，并在右侧填写数量。
          </div>
        </q-card-section>

        <q-card-section class="periodic-table-wrap">
          <div
            v-for="(row, rowIndex) in periodicTableRows"
            :key="rowIndex"
            class="row q-gutter-y justify-center no-wrap"
            :style="{ marginBottom: rowIndex === 6 ? '10px' : '0' }"
          >
            <q-btn-group square>
              <q-btn
                v-for="element in row"
                :key="element.symbol"
                :label="element.symbol"
                :color="isSelected(element) ? 'cyan-8' : getColor(element.category)"
                class="periodic-element"
                :transparent="element.atomicNumber === 0"
                :style="{ width: getWidth(element.category), height: '34px' }"
                :flat="element.atomicNumber === 0"
                :disable="element.atomicNumber === 0"
                @click="toggleElement(element)"
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
        </q-card-section>
      </q-card>

      <SelectedElementsList
        :selected-elements="selectedElements"
        class="selected-panel"
        @clear-elements="clearElements"
      />
    </section>

    <q-card flat bordered class="log-panel q-mt-md">
      <q-card-section>
        <div class="panel-title">操作日志</div>
        <div class="panel-subtitle">Log</div>
      </q-card-section>
      <q-card-section>
        <div class="log-list">
          <div v-for="item in logs" :key="item.id" class="log-item">
            <span class="log-time">{{ item.time }}</span>
            <span>{{ item.message }}</span>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useQuasar } from "quasar";
import { periodicTableRows } from "assets/periodicData";
import { socketSim } from "boot/socketio";
import SelectedElementsList from "components/SelectedElementsList.vue";

const $q = useQuasar();
const socket = socketSim;

const steps = [
  { index: 1, name: "home", label: "主页" },
  { index: 2, name: "preprocess", label: "预处理" },
  { index: 3, name: "cif", label: "CIF 与元素" },
  { index: 4, name: "apps", label: "应用" },
  { index: 5, name: "summary", label: "总结" },
];

const selectedCif = ref("");
const selectedElements = ref([]);
const isLoadingStructure = ref(false);
const structureStatus = ref("尚未导入 CIF 文件。");
const logs = ref([]);

const addLog = (message) => {
  logs.value.unshift({
    id: Date.now() + Math.random(),
    time: new Date().toLocaleTimeString(),
    message,
  });
};

const openCifFile = async () => {
  if (!window.myAPI || typeof window.myAPI.openFileDialog !== "function") {
    $q.notify({
      message: "当前为网页模式，无法调用系统文件对话框。请使用 Electron 模式运行。",
      color: "warning",
      position: "center",
      timeout: 2000,
    });
    return;
  }

  const filePaths = await window.myAPI.openFileDialog();
  if (!filePaths || filePaths.length === 0) {
    return;
  }

  selectedCif.value = filePaths[0];
  isLoadingStructure.value = true;
  structureStatus.value = "正在加载 CIF 结构...";
  $q.loading.show();
  socket.emit("load_structure", selectedCif.value);
  addLog(`导入 CIF：${selectedCif.value}`);
};

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

const getWidth = () => "42px";

const toggleElement = (element) => {
  const existingIndex = selectedElements.value.findIndex(
    (selectedElement) => selectedElement.symbol === element.symbol
  );

  if (existingIndex === -1) {
    selectedElements.value.push({ ...element, quantity: 1 });
    addLog(`选择元素：${element.symbol}`);
    return;
  }

  selectedElements.value.splice(existingIndex, 1);
  addLog(`取消元素：${element.symbol}`);
};

const isSelected = (element) =>
  selectedElements.value.some(
    (selectedElement) => selectedElement.symbol === element.symbol
  );

const clearElements = () => {
  selectedElements.value = [];
  addLog("清空已选元素");
};

const handleLoadStructureSuccess = (data) => {
  isLoadingStructure.value = false;
  $q.loading.hide();

  if (data.success) {
    structureStatus.value = "CIF 结构已导入，可用于后续模拟与应用。";
    $q.notify({
      message: "CIF 结构已导入。",
      color: "primary",
      icon: "cloud_done",
      position: "center",
      timeout: 1200,
    });
    addLog("CIF 结构加载成功");
    return;
  }

  structureStatus.value = "CIF 结构加载失败。";
  addLog("CIF 结构加载失败");
};

onMounted(() => {
  socket.on("load_structure_success", handleLoadStructureSuccess);
  addLog("进入 CIF 与元素页面");
});

onUnmounted(() => {
  socket.off("load_structure_success", handleLoadStructureSuccess);
});

defineOptions({
  name: "CifElementsPage",
});
</script>

<style scoped>
.cif-page {
  min-height: calc(100vh - 56px);
}

.status-strip {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.status-step {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 10px 12px;
  border: 1px solid rgba(96, 165, 250, 0.18);
  border-radius: 8px;
  background: rgba(6, 18, 36, 0.72);
  color: rgba(229, 236, 244, 0.7);
}

.status-step.active {
  border-color: rgba(34, 211, 238, 0.62);
  background: linear-gradient(135deg, rgba(15, 45, 82, 0.95), rgba(4, 18, 39, 0.95));
  color: #f4f7fb;
}

.status-index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(34, 211, 238, 0.18);
  color: #9eeaf9;
}

.status-label {
  font-size: 0.92rem;
}

.cif-grid {
  display: grid;
  grid-template-columns: minmax(240px, 300px) minmax(0, max-content) minmax(360px, 1fr);
  gap: 16px;
  align-items: start;
  overflow-x: auto;
}

.control-panel,
.periodic-panel,
.selected-panel,
.log-panel {
  background: rgba(6, 18, 36, 0.82);
  border-color: rgba(96, 165, 250, 0.2);
  color: #f4f7fb;
}

.panel-title {
  font-size: 1.05rem;
  font-weight: 700;
}

.panel-subtitle,
.status-note {
  margin-top: 4px;
  color: rgba(229, 236, 244, 0.68);
  font-size: 0.86rem;
  line-height: 1.6;
}

.file-path {
  padding: 10px;
  border: 1px solid rgba(96, 165, 250, 0.16);
  border-radius: 8px;
  color: rgba(229, 236, 244, 0.78);
  background: rgba(2, 8, 18, 0.38);
  font-size: 0.82rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.periodic-table-wrap {
  min-width: 0;
}

.periodic-element {
  text-transform: none;
  font-size: 13px;
  padding: 0;
}

.log-list {
  max-height: 240px;
  overflow: auto;
}

.log-item {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(96, 165, 250, 0.12);
  color: rgba(229, 236, 244, 0.82);
}

.log-time {
  flex: 0 0 auto;
  color: rgba(34, 211, 238, 0.8);
}

@media (max-width: 1280px) {
  .cif-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 800px) {
  .status-strip {
    grid-template-columns: 1fr;
  }
}
</style>
