<template>
  <q-page class="q-pa-md preprocess-page">
    <section class="status-strip q-mb-md">
      <div
        v-for="step in steps"
        :key="step.name"
        class="status-step"
        :class="{ active: step.name === 'preprocess' }"
      >
        <div class="status-index">{{ step.index }}</div>
        <div class="status-label">{{ step.label }}</div>
      </div>
    </section>

    <section class="preprocess-grid">
      <q-card flat bordered class="control-panel">
        <q-card-section>
          <div class="panel-title">左侧图像</div>
          <div class="panel-subtitle">输入图像 Input Image</div>

          <q-item>
            <q-item-section>
              <q-item-label overline>Gamma</q-item-label>
              <q-slider
                v-model="leftGamma"
                :min="0.1"
                :max="2.5"
                :step="0.05"
                @update:model-value="adjustLeftImage"
              />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label overline>对比度 Contrast</q-item-label>
              <q-slider
                v-model="leftContrast"
                :min="0"
                :max="5"
                :step="0.1"
                @update:model-value="adjustLeftImage"
              />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label overline>亮度 Brightness</q-item-label>
              <q-slider
                v-model="leftBrightness"
                :min="0"
                :max="1"
                :step="0.01"
                @update:model-value="adjustLeftImage"
              />
            </q-item-section>
          </q-item>

          <q-separator dark spaced />

          <div class="panel-subtitle q-mb-sm">处理操作 Processing</div>
          <q-btn
            class="full-width q-mb-sm"
            color="primary"
            outline
            label="发送到右图"
            @click="sendLeftToRight"
          />
          <q-btn
            class="full-width q-mb-sm"
            color="primary"
            outline
            label="均值滤波"
            @click="recordPendingOperation('均值滤波')"
          />
          <q-btn
            class="full-width q-mb-sm"
            color="primary"
            outline
            label="背景校正"
            @click="recordPendingOperation('背景校正')"
          />
          <q-btn
            class="full-width"
            color="primary"
            label="保存左图"
            @click="saveImage(leftImageData, 'preprocess-left.png')"
          />
        </q-card-section>
      </q-card>

      <section class="image-stage">
        <q-card flat bordered class="image-card">
          <q-card-section class="image-card-header">
            <div>
              <div class="image-title">左侧图像</div>
              <div class="image-caption">用于预处理的输入图像</div>
            </div>
          </q-card-section>
          <q-card-section class="image-frame">
            <q-img
              v-if="leftImageData"
              :src="`data:image/png;base64,${leftImageData}`"
              fit="contain"
            />
            <div v-else class="empty-image">请先在主页打开文件</div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="image-card">
          <q-card-section class="image-card-header">
            <div>
              <div class="image-title">右侧图像</div>
              <div class="image-caption">处理结果或衍射图样预览</div>
            </div>
          </q-card-section>
          <q-card-section class="image-frame">
            <q-img
              v-if="rightImageData"
              :src="`data:image/png;base64,${rightImageData}`"
              fit="contain"
            />
            <div v-else class="empty-image">暂无右侧图像</div>
          </q-card-section>
        </q-card>
      </section>

      <q-card flat bordered class="control-panel">
        <q-card-section>
          <div class="panel-title">右侧图像</div>
          <div class="panel-subtitle">输出图像 Output Image</div>

          <q-item>
            <q-item-section>
              <q-item-label overline>图像索引 Image Index</q-item-label>
              <q-slider
                v-model="rightImageIndex"
                :min="0"
                :max="indexRange"
                @update:model-value="changeRightImage"
              />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label overline>Gamma</q-item-label>
              <q-slider
                v-model="rightGamma"
                :min="0.1"
                :max="2.5"
                :step="0.05"
                @update:model-value="adjustRightImage"
              />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label overline>对比度 Contrast</q-item-label>
              <q-slider
                v-model="rightContrast"
                :min="0"
                :max="5"
                :step="0.1"
                @update:model-value="adjustRightImage"
              />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label overline>亮度 Brightness</q-item-label>
              <q-slider
                v-model="rightBrightness"
                :min="0"
                :max="1"
                :step="0.01"
                @update:model-value="adjustRightImage"
              />
            </q-item-section>
          </q-item>

          <q-toggle
            v-model="logScale"
            class="q-mt-sm"
            label="对数显示 Log Scale"
            @update:model-value="adjustRightImage"
          />

          <q-btn
            class="full-width q-mt-md"
            color="primary"
            label="保存右图"
            @click="saveImage(rightImageData, 'preprocess-right.png')"
          />
        </q-card-section>
      </q-card>
    </section>

    <q-card flat bordered class="log-panel q-mt-md">
      <q-card-section>
        <div class="panel-title">操作日志与历史图像</div>
        <div class="panel-subtitle">Log & History</div>
      </q-card-section>

      <q-card-section class="log-content">
        <div class="log-list">
          <div v-for="item in logs" :key="item.id" class="log-item">
            <span class="log-time">{{ item.time }}</span>
            <span>{{ item.message }}</span>
          </div>
        </div>

        <div class="history-list">
          <q-card
            v-for="item in historyImages"
            :key="item.id"
            flat
            bordered
            class="history-card"
          >
            <q-img :src="`data:image/png;base64,${item.image}`" fit="contain" />
            <q-card-section class="history-caption">
              {{ item.label }}
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useQuasar } from "quasar";
import { socketRDF, socketViewer } from "boot/socketio";

const $q = useQuasar();
const socket = socketViewer;
const previewMaskSize = 512;

const steps = [
  { index: 1, name: "home", label: "主页" },
  { index: 2, name: "preprocess", label: "预处理" },
  { index: 3, name: "cif", label: "CIF 与元素" },
  { index: 4, name: "apps", label: "应用" },
  { index: 5, name: "summary", label: "总结" },
];

const leftImageData = ref(null);
const rightImageData = ref(null);
const leftGamma = ref(1);
const leftContrast = ref(1);
const leftBrightness = ref(0);
const rightGamma = ref(1);
const rightContrast = ref(1);
const rightBrightness = ref(0);
const rightImageIndex = ref(0);
const indexRange = ref(0);
const logScale = ref(false);
const logs = ref([]);
const historyImages = ref([]);

const addLog = (message) => {
  logs.value.unshift({
    id: Date.now() + Math.random(),
    time: new Date().toLocaleTimeString(),
    message,
  });
};

const addHistoryImage = (image, label) => {
  if (!image) return;
  historyImages.value.unshift({
    id: Date.now() + Math.random(),
    image,
    label,
  });
};

const requestMeanVirtualImage = () => {
  const emptyMask = Array.from({ length: previewMaskSize }, () =>
    Array(previewMaskSize).fill(0)
  );

  socket.emit("update_virtual_mask", {
    mask: emptyMask,
    all_selections: [],
    width: previewMaskSize,
    height: previewMaskSize,
  });
};

const adjustLeftImage = () => {
  socket.emit("update_adjust_params", {
    gamma: leftGamma.value,
    contrast: leftContrast.value,
    brightness: leftBrightness.value,
    log_scale: logScale.value,
    side: "left",
  });
  socket.emit("request_image", { side: "left" });
  addLog("调整左侧图像显示参数");
};

const adjustRightImage = () => {
  socket.emit("update_adjust_params", {
    gamma: rightGamma.value,
    contrast: rightContrast.value,
    brightness: rightBrightness.value,
    log_scale: logScale.value,
    side: "right",
  });
  socket.emit("request_image", { side: "right" });
  addLog("调整右侧图像显示参数");
};

const changeRightImage = () => {
  socket.emit("set_index", { index: rightImageIndex.value });
  addLog(`切换右侧图像索引：${rightImageIndex.value}`);
};

const sendLeftToRight = () => {
  if (!leftImageData.value) {
    $q.notify({
      message: "当前没有可输出的左侧图像。",
      color: "warning",
      position: "center",
      timeout: 1200,
    });
    return;
  }

  rightImageData.value = leftImageData.value;
  addHistoryImage(rightImageData.value, "左图输出到右图");
  addLog("将左侧图像输出到右侧图像");
};

const recordPendingOperation = (operationName) => {
  addLog(`${operationName}：前端按钮已预留，后端接口待接入`);
  $q.notify({
    message: `${operationName}暂未接入后端。`,
    color: "info",
    position: "center",
    timeout: 1200,
  });
};

const saveImage = (image, fileName) => {
  if (!image) {
    $q.notify({
      message: "当前没有可保存的图像。",
      color: "warning",
      position: "center",
      timeout: 1200,
    });
    return;
  }

  const link = document.createElement("a");
  link.href = `data:image/png;base64,${image}`;
  link.download = fileName;
  link.click();
  addLog(`保存图像：${fileName}`);
};

const handleRightImageResponse = (data) => {
  if (data.error) {
    console.error(data.error);
    return;
  }

  rightImageData.value = data.image_data;
  addHistoryImage(data.image_data, `右图 ${rightImageIndex.value}`);
};

const handleLeftImageResponse = (data) => {
  if (data.error) {
    console.error(data.error);
    return;
  }

  leftImageData.value = data.image_data;
};

const handleFileNameResponse = (data) => {
  if (!data.success) return;
  indexRange.value = data.index_range - 1;
  requestMeanVirtualImage();
  socket.emit("set_index", { index: rightImageIndex.value });
  socketRDF.emit("load_image_rdf", true);
  addLog("数据文件已加载，预处理图像已刷新");
};

onMounted(() => {
  socket.on("right_image_response", handleRightImageResponse);
  socket.on("left_image_response", handleLeftImageResponse);
  socket.on("file_name_response", handleFileNameResponse);

  requestMeanVirtualImage();
  socket.emit("set_index", { index: rightImageIndex.value });
  addLog("进入数据预处理页面");
});

onUnmounted(() => {
  socket.off("right_image_response", handleRightImageResponse);
  socket.off("left_image_response", handleLeftImageResponse);
  socket.off("file_name_response", handleFileNameResponse);
});

defineOptions({
  name: "DataPreprocessPage",
});
</script>

<style scoped>
.preprocess-page {
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

.preprocess-grid {
  display: grid;
  grid-template-columns: minmax(230px, 280px) minmax(0, 1fr) minmax(230px, 280px);
  gap: 16px;
  align-items: start;
}

.control-panel,
.image-card,
.log-panel {
  background: rgba(6, 18, 36, 0.82);
  border-color: rgba(96, 165, 250, 0.2);
  color: #f4f7fb;
}

.panel-title,
.image-title {
  font-size: 1.05rem;
  font-weight: 700;
}

.panel-subtitle,
.image-caption {
  margin-top: 4px;
  color: rgba(229, 236, 244, 0.68);
  font-size: 0.86rem;
}

.image-stage {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.image-card-header {
  min-height: 72px;
}

.image-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 520px;
  background: rgba(2, 8, 18, 0.48);
}

.image-frame :deep(.q-img) {
  width: 100%;
  max-height: 500px;
}

.empty-image {
  color: rgba(229, 236, 244, 0.58);
}

.log-content {
  display: grid;
  grid-template-columns: minmax(260px, 360px) 1fr;
  gap: 16px;
}

.log-list {
  max-height: 260px;
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

.history-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.history-card {
  background: rgba(2, 8, 18, 0.44);
  border-color: rgba(96, 165, 250, 0.16);
  color: #f4f7fb;
}

.history-card :deep(.q-img) {
  height: 120px;
}

.history-caption {
  padding: 8px;
  color: rgba(229, 236, 244, 0.72);
  font-size: 0.78rem;
}

@media (max-width: 1200px) {
  .preprocess-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 800px) {
  .status-strip,
  .image-stage,
  .log-content {
    grid-template-columns: 1fr;
  }
}
</style>
