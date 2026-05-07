<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md acom-viewer-workspace">
      <div class="col-3 controls-column">
        <q-card class="sidebar">
          <q-card-section>
            <div class="section-title">数据来源 Data Sources</div>
            <q-btn
              no-caps
              class="full-width q-mb-sm"
              color="primary"
              @click="openData"
            >
              <span v-if="selectedData">已选择 Selected: {{ selectedData }}</span>
              <span v-else>使用当前实验数据 Use Loaded Data</span>
            </q-btn>
            <q-btn
              no-caps
              class="full-width q-mb-sm"
              color="primary"
              @click="openResults"
            >
              <span v-if="selectedResults"
                >已选择结果 Selected Results: {{ selectedResults }}</span
              >
              <span v-else>导入匹配结果 Import Results</span>
            </q-btn>
            <q-btn
              no-caps
              class="full-width q-mb-sm"
              color="primary"
              @click="openSimulations"
            >
              <span v-if="selectedSimulations"
                >已选择模拟库 Selected Simulations: {{ selectedSimulations }}</span
              >
              <span v-else>导入模拟库 Import Simulations</span>
            </q-btn>

            <q-separator class="q-my-md" />

            <div class="section-title">取向图设置 IPF Settings</div>
            <q-select
              filled
              v-model="symmetry"
              :options="symmetry_options"
              label="对称性 Symmetry"
            />
            <q-select
              filled
              v-model="direction"
              :options="direction_options"
              label="投影方向 Projection Direction"
            />
            <q-input
              v-model.number="threshold"
              type="number"
              filled
              label="相关性阈值 Correlation Threshold"
            />

            <q-separator class="q-my-md" />

            <div class="section-title">图像调整 Image Adjustments</div>
            <q-item>
              <q-item-section>
                <q-item-label overline>Gamma</q-item-label>
                <q-slider
                  v-model="Gamma"
                  :min="0.1"
                  :max="2.5"
                  :step="0.05"
                  @update:model-value="ajustImage"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>对比度 Contrast</q-item-label>
                <q-slider
                  v-model="Contrast"
                  :min="0"
                  :max="5"
                  :step="0.1"
                  @update:model-value="ajustImage"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>亮度 Brightness</q-item-label>
                <q-slider
                  v-model="Brightness"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  @update:model-value="ajustImage"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>对数显示 Log Scale</q-item-label>
                <q-toggle
                  v-model="log_scale"
                  @update:model-value="ajustImage"
                />
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-9 q-pa-md viewer-column">
        <div class="column justify-center">
          <div class="col-6">
            <IPFSelect
              :mask_update_event="update_virtual_mask"
              :image_base64_str="IPFBase64"
              :socket="socket"
            />
          </div>

          <div class="col-6">
            <div class="row">
              <div class="col-6 col-lg-4">
                <q-img
                  :src="ImageBase64"
                  v-if="ImageBase64"
                  alt="Legend Image"
                  style="max-width: 100%; height: auto"
                />
              </div>
              <div class="col-4 col-lg-4">
                <img
                  :src="legendBase64"
                  v-if="legendBase64"
                  alt="Legend Image"
                  style="max-width: 100%; height: auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, watchPostEffect } from "vue";
import { useQuasar } from "quasar";
import { socketXem } from "boot/socketio";
import IPFSelect from "components/IPFSelect.vue";

const Gamma = ref(1);
const Contrast = ref(1);
const Brightness = ref(0);
const log_scale = ref(false);

const ajustImage = () => {
  socket.emit("update_adjust_params", {
    gamma: Gamma.value,
    contrast: Contrast.value,
    brightness: Brightness.value,
    log_scale: log_scale.value,
  });
  socket.emit("request_image", {});
};

const update_virtual_mask = "update_virtual_mask";
const selectedResults = ref(null);
const selectedSimulations = ref(null);
const selectedData = ref(null);
const legendBase64 = ref(null);
const ImageBase64 = ref(null);
const $q = useQuasar();
const socket = socketXem;
const direction = ref(null);
const direction_options = [
  { label: "X", value: "x" },
  { label: "Y", value: "y" },
  { label: "Z", value: "z" },
];
const symmetry = ref(null);
const symmetry_options = [
  { label: "Oh", value: "Oh" },
  { label: "Th", value: "Th" },
  { label: "D6h", value: "D6h" },
  { label: "C6h", value: "C6h" },
  { label: "D4h", value: "D4h" },
  { label: "C4h", value: "C4h" },
  { label: "D3d", value: "D3d" },
  { label: "S6", value: "S6" },
  { label: "D2h", value: "D2h" },
  { label: "C2h", value: "C2h" },
  { label: "Ci", value: "Ci" },
];
const threshold = ref(0.0125);
const IPFBase64 = ref(null);

const openFile = async (fileRef, type) => {
  const filePaths = await window.myAPI.openFileDialog();
  if (filePaths && filePaths.length > 0) {
    fileRef.value = filePaths[0]; // 只取第一个文件路径
    console.log(`${type} selected:`, fileRef.value);
    $q.loading.show();
    const eventMap = {
      results: "load_results",
      simulations: "load_simulations",
      data: "load_data",
    };
    const eventName = eventMap[type];
    socket.emit(eventName, { filePath: fileRef.value, type }); // 传递文件路径和类型标识
  } else {
    fileRef.value = null;
  }
};

const openResults = async () => {
  openFile(selectedResults, "results");
};

const openSimulations = async () => {
  openFile(selectedSimulations, "simulations");
};

const openData = async () => {
  $q.loading.show();
  socket.emit("load_data");
};

onMounted(() => {
  socket.on("load_data_success", (data) => {
    if (data.success) {
      console.log("data Loaded");
      $q.loading.hide();
      $q.notify({
        message: "Crystal Loaded",
        color: "primary",
        icon: "cloud_done",
        position: "center",
        timeout: 1000,
      });
    }
  });
  socket.on("load_results_success", (data) => {
    $q.loading.hide();
    $q.notify({
      message: "Grid Generated",
      color: "primary",
      icon: "cloud_done",
      position: "center",
      timeout: 1000,
    });
  });

  socket.on("load_simulations_success", (data) => {
    $q.loading.hide();
    $q.notify({
      message: "Simulation Success",
      color: "primary",
      icon: "cloud_done",
      position: "center",
      timeout: 1000,
    });
  });

  socket.on("update_legend", (data) => {
    legendBase64.value = `data:image/png;base64,${data.image_data}`;
  });

  socket.on("get_ipf_success", (data) => {
    IPFBase64.value = data.image_data;
  });

  socket.on("toverp", (data) => {
    if (data.error) {
      console.error(data.error);
    } else {
      console.log("Image Response Received");
      ImageBase64.value = `data:image/png;base64,${data.image_data}`;
    }
  });
});

watch(symmetry, (newSymmetry, oldSymmetry) => {
  if (newSymmetry !== oldSymmetry) {
    // 发送 symmetry 变化事件
    socket.emit("set_symmetry", { symmetry: newSymmetry });
  }
});

watch(
  [direction, threshold],
  ([newDirection, newThreshold], [oldDirection, oldThreshold]) => {
    // 当 direction 或 threshold 变化时...
    socket.emit("get_ipf", {
      direction: newDirection,
      threshold: newThreshold,
    });
  }
);
</script>

<style scoped>
.acom-viewer-workspace {
  align-items: flex-start;
}

.controls-column,
.viewer-column {
  min-height: 0;
}

.sidebar {
  height: auto;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.sidebar :deep(.q-field) {
  margin-bottom: 12px;
}
</style>
