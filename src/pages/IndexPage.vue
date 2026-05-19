<template>
  <q-page class="home-page">
    <div class="home-hero">
      <div class="home-glow home-glow-left"></div>
      <div class="home-glow home-glow-right"></div>

      <div class="home-card">
        <div class="home-title">Pyglass</div>
        <div class="home-subtitle">
          一个面向衍射图像分析与材料计算的工作台。
        </div>
        <div class="home-actions">
          <q-btn
            color="primary"
            unelevated
            label="打开文件"
            :loading="isUploading"
            @click="openFile"
          />
        </div>
        <div v-if="selectedFile" class="home-file">
          当前文件：{{ selectedFile }}
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useQuasar } from "quasar";
import { socketRDF, socketViewer } from "boot/socketio";

const $q = useQuasar();
const selectedFile = ref("");
const isUploading = ref(false);
const socket = socketViewer;

const openFile = async () => {
  if (!window.myAPI || typeof window.myAPI.openFileDialog !== "function") {
    $q.notify({
      message:
        "当前为网页模式，无法调用系统文件对话框。请使用 Electron 模式运行。",
      color: "warning",
      icon: "warning",
      position: "center",
      timeout: 2000,
    });
    return;
  }

  try {
    const filePaths = await window.myAPI.openFileDialog();
    if (filePaths && filePaths.length > 0) {
      selectedFile.value = filePaths[0];
      isUploading.value = true;
      $q.loading.show();
      socket.emit("upload_dm4", selectedFile.value);
    }
  } catch (error) {
    console.error("Failed to open file dialog:", error);
    isUploading.value = false;
    $q.loading.hide();
    $q.notify({
      message: "打开文件对话框失败，请重试。",
      color: "negative",
      icon: "error",
      position: "center",
      timeout: 1500,
    });
  }
};

const handleFileNameResponse = (data) => {
  isUploading.value = false;
  $q.loading.hide();

  if (data.success) {
    socketRDF.emit("load_image_rdf", true);
    $q.notify({
      message: "文件已加载，将用于后续步骤。",
      color: "primary",
      icon: "cloud_done",
      position: "center",
      timeout: 1200,
    });
  }
};

onMounted(() => {
  socket.on("file_name_response", handleFileNameResponse);
});

onUnmounted(() => {
  socket.off("file_name_response", handleFileNameResponse);
});

defineOptions({
  name: "IndexPage",
});
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 56px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(rgba(8, 12, 18, 0.6), rgba(8, 12, 18, 0.78)),
    radial-gradient(circle at top left, rgba(0, 188, 212, 0.18), transparent 30%),
    radial-gradient(circle at bottom right, rgba(63, 81, 181, 0.2), transparent 28%),
    url("../assets/home_background.png") center / cover no-repeat;
}

.home-hero {
  position: relative;
  width: min(900px, 100%);
  padding: 32px;
}

.home-card {
  position: relative;
  z-index: 2;
  padding: 56px 36px;
  text-align: center;
}

.home-title {
  font-size: clamp(3.4rem, 9vw, 6.8rem);
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #f4f7fb;
  text-shadow: 0 0 24px rgba(0, 188, 212, 0.22);
}

.home-subtitle {
  max-width: 760px;
  margin: 22px auto 0;
  color: rgba(229, 236, 244, 0.82);
  font-size: 1.08rem;
  line-height: 1.9;
}

.home-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.home-actions :deep(.q-btn) {
  min-width: 176px;
  min-height: 46px;
  font-size: 0.98rem;
}

.home-file {
  max-width: 760px;
  margin: 16px auto 0;
  color: rgba(229, 236, 244, 0.86);
  font-size: 0.92rem;
  line-height: 1.6;
  overflow-wrap: anywhere;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
}

.home-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(40px);
  opacity: 0.75;
}

.home-glow-left {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 4%;
  background: rgba(0, 188, 212, 0.22);
}

.home-glow-right {
  width: 260px;
  height: 260px;
  right: 3%;
  bottom: 6%;
  background: rgba(63, 81, 181, 0.18);
}

@media (max-width: 600px) {
  .home-hero {
    padding: 16px;
  }

  .home-card {
    padding: 40px 22px;
  }

  .home-subtitle {
    font-size: 1rem;
    line-height: 1.8;
  }

  .home-actions :deep(.q-btn) {
    width: 100%;
  }
}
</style>
