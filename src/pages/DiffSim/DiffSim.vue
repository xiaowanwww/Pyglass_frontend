<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md sim-workspace">
      <div class="col-3 controls-column">
        <q-card class="sidebar">
          <q-card-section>
            <div class="section-title">结构文件 Structure</div>
            <q-btn
              no-caps
              class="full-width q-mb-sm"
              color="primary"
              @click="openFile"
            >
              <span v-if="selectedFile">已选择 Selected: {{ selectedFile }}</span>
              <span v-else>导入 CIF 结构 Import CIF</span>
            </q-btn>

            <q-separator class="q-my-md" />

            <div class="section-title">取向网格 Orientation Grid</div>
            <q-select
              filled
              v-model="crystal_system"
              :options="options"
              label="晶系 Crystal System"
            />
            <q-input
              v-model.number="resolution"
              type="number"
              filled
              label="网格分辨率 Grid Resolution"
            />
            <q-btn
              no-caps
              class="full-width q-mb-sm"
              color="primary"
              @click="generate_grid"
            >
              生成取向网格 Generate Grid
            </q-btn>

            <q-separator class="q-my-md" />

            <div class="section-title">模拟参数 Simulation Parameters</div>
            <q-input
              v-model.number="accelerating_voltage"
              type="number"
              filled
              label="加速电压 Accelerating Voltage"
              suffix="KV"
            />
            <q-input
              v-model.number="min_intensity"
              type="number"
              filled
              label="最小可见强度 Min Visible Intensity"
            />
            <q-input
              v-model.number="image_size"
              type="number"
              filled
              label="图像尺寸 Image Size"
            />
            <q-input
              v-model.number="pixel_size"
              type="number"
              filled
              label="像素尺寸 Pixel Size"
              suffix="A^-1"
            />
            <q-input
              v-model.number="max_excitation_error"
              type="number"
              filled
              label="最大激发误差 Max Excitation Error"
            />
            <q-btn
              no-caps
              class="full-width q-mb-sm"
              color="primary"
              @click="simulate"
            >
              生成模拟库 Run Simulation
            </q-btn>

            <q-separator class="q-my-md" />

            <div class="section-title">模拟库 Simulation Library</div>
            <q-btn
              no-caps
              class="full-width q-mb-sm"
              color="primary"
              @click="loadFile"
            >
              加载模拟库 Load Simulation
            </q-btn>
            <q-btn
              no-caps
              class="full-width q-mb-sm"
              color="primary"
              @click="saveFile"
            >
              保存模拟库 Save Simulation
            </q-btn>

            <q-separator class="q-my-md" />

            <div class="section-title">匹配 Matching</div>
            <q-btn
              no-caps
              class="full-width q-mb-sm"
              color="primary"
              @click="doMatching"
            >
              运行模板匹配 Run Matching
            </q-btn>
            <q-btn
              no-caps
              class="full-width"
              color="primary"
              @click="saveResult"
            >
              保存匹配结果 Save Result
            </q-btn>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-4 chart-column">
        <div ref="gridChartContainer" class="chart-surface"></div>
      </div>
      <div class="col-5 chart-column">
        <q-card class="spot-size-card q-mb-sm">
          <div class="spot-size-title">
            衍射点大小 Spot Size: {{ symbolSizeFactor.toFixed(1) }}
          </div>
          <q-slider
            v-model="symbolSizeFactor"
            :min="0.1"
            :max="10"
            :step="0.1"
            class="q-pa-md"
          />
        </q-card>
        <div ref="simulationChartContainer" class="simulation-chart"></div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { socketSim } from "boot/socketio";
import { useQuasar } from "quasar";
import * as echarts from "echarts";

const symbolSizeFactor = ref(2);
const selectedFile = ref(null);
const $q = useQuasar();
const socket = socketSim;
const accelerating_voltage = ref(300);
const min_intensity = ref(0.001);
const image_size = ref(128);
const pixel_size = ref(0.0338);
const resolution = ref(10);
const options = [
  { label: "立方晶系 Cubic", value: "cubic" },
  { label: "六方晶系 Hexagonal", value: "hexagonal" },
  { label: "三方晶系 Trigonal", value: "trigonal" },
  { label: "四方晶系 Tetragonal", value: "tetragonal" },
  { label: "正交晶系 Orthorhombic", value: "orthorhombic" },
  { label: "单斜晶系 Monoclinic", value: "monoclinic" },
  { label: "三斜晶系 Triclinic", value: "triclinic" },
];
const crystal_system = ref(null);
const gridChartContainer = ref(null);
const simulationChartContainer = ref(null);
const max_excitation_error = ref(0.07);
const simulationData = ref(null);

let gridChart = null;
let simulationChart = null;

const loadFile = async () => {
  const filePaths = await window.myAPI.openFileDialog();
  if (filePaths && filePaths.length > 0) {
    selectedFile.value = filePaths[0];
    console.log(selectedFile.value);
    $q.loading.show();
    socket.emit("load_simulation", selectedFile.value);
  } else {
    selectedFile.value = null;
  }
};

const doMatching = () => {
  socket.emit("do_matching");
  $q.loading.show();
};

const saveResult = async () => {
  const filePaths = await window.myAPI.saveFileDialog();
  if (filePaths && filePaths.length > 0) {
    selectedFile.value = filePaths;
    console.log(selectedFile.value);
    $q.loading.show();
    socket.emit("save_result", selectedFile.value);
  } else {
    selectedFile.value = null;
  }
};

const openFile = async () => {
  const filePaths = await window.myAPI.openFileDialog();
  if (filePaths && filePaths.length > 0) {
    selectedFile.value = filePaths[0];
    console.log(selectedFile.value);
    $q.loading.show();
    socket.emit("load_structure", selectedFile.value);
  } else {
    selectedFile.value = null;
  }
};

const saveFile = async () => {
  const filePaths = await window.myAPI.saveFileDialog();
  if (filePaths && filePaths.length > 0) {
    selectedFile.value = filePaths;
    console.log(selectedFile.value);
    $q.loading.show();
    socket.emit("save_simulation", selectedFile.value);
  } else {
    selectedFile.value = null;
  }
};

const simulate = () => {
  socket.emit("simulate", {
    accelerating_voltage: accelerating_voltage.value,
    min_intensity: min_intensity.value,
    image_size: image_size.value,
    pixel_size: pixel_size.value,
    max_excitation_error: max_excitation_error.value,
  });
  $q.loading.show();
};

const generate_grid = () => {
  socket.emit("generate_grid", {
    resolution: resolution.value,
    crystal_system: crystal_system.value,
  });
  $q.loading.show();
};

const handleGridPointClick = (index) => {
  console.log("Clicked scatter point index:", index);
  createSimulationChart(simulationData.value, index);
};

const createGridChart = (data) => {
  if (gridChart) {
    gridChart.dispose();
  }

  gridChart = echarts.init(gridChartContainer.value);

  const gridData = [];
  if (data.grid_x && data.grid_y) {
    for (let i = 0; i < data.grid_x.length; i++) {
      gridData.push([data.grid_x[i], data.grid_y[i]]);
    }

    const option = {
      backgroundColor: "white",
      xAxis: {
        scale: true, // Enable scaling
      },
      yAxis: {
        scale: true,
      },
      series: [
        {
          symbolSize: 5,
          data: gridData,
          type: "scatter",
        },
      ],
      aspectRatio: 1, // Ensure x and y have same length
    };
    gridChart.setOption(option);
    gridChart.on("click", (params) => {
      console.log("Clicked scatter point index:", params.dataIndex);
      if (params.seriesType === "scatter") {
        handleGridPointClick(params.dataIndex);
      }
    });
  }
};

watch(symbolSizeFactor, () => {
  if (simulationChart) {
    const option = simulationChart.getOption();
    if (option.series && option.series.length > 0) {
      option.series[0].symbolSize = function (val) {
        return Math.sqrt(val[2]) * symbolSizeFactor.value;
      };
      simulationChart.setOption(option);
    }
  }
});

const createSimulationChart = (data, index) => {
  if (simulationChart) {
    simulationChart.dispose();
  }
  simulationChart = echarts.init(simulationChartContainer.value);

  const gridData = [];
  let maxIntensity = 0;

  if (data.coords && data.intensities && index != null) {
    const coordsSet = data.coords[index];
    const intensity = data.intensities[index];

    for (let i = 0; i < coordsSet.length; i++) {
      gridData.push([coordsSet[i][0], coordsSet[i][1], intensity[i]]);
      maxIntensity = Math.max(maxIntensity, intensity[i]);
    }

    const option = {
      backgroundColor: "white",
      xAxis: {
        scale: true,
      },
      yAxis: {
        scale: true,
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          const x = params.value[0];
          const y = params.value[1];
          const intensity = params.value[2];
          const distance = Math.sqrt(x * x + y * y); // Distance to origin
          const proportionalIntensity = (
            (intensity / maxIntensity) *
            100
          ).toFixed(4);
          return `Distance: ${distance.toFixed(
            3
          )}<br>Intensity: ${proportionalIntensity}%`;
        },
      },
      series: [
        {
          type: "scatter",
          data: gridData,
          symbolSize: function (val) {
            return Math.sqrt(val[2]) * symbolSizeFactor.value;
          },
          emphasis: {
            focus: "series",
          },
        },
      ],
      aspectRatio: 1, // Ensure x and y have same length
    };
    simulationChart.setOption(option);
  }
};

onMounted(() => {
  socket.on("load_structure_success", (data) => {
    if (data.success) {
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
  socket.on("generate_grid_success", (data) => {
    $q.loading.hide();
    $q.notify({
      message: "Grid Generated",
      color: "primary",
      icon: "cloud_done",
      position: "center",
      timeout: 1000,
    });
    createGridChart(data);
  });

  socket.on("simulate_success", (data) => {
    $q.loading.hide();
    $q.notify({
      message: "Simulation Success",
      color: "primary",
      icon: "cloud_done",
      position: "center",
      timeout: 1000,
    });
    simulationData.value = data;
    createSimulationChart(data, 0);
  });
  socket.on("save_simulate_success", (data) => {
    $q.loading.hide();
    $q.notify({
      message: "Save Simulation Success",
      color: "primary",
      icon: "cloud_done",
      position: "center",
      timeout: 1000,
    });
    simulationData.value = data;
    createSimulationChart(data, 0);
  });
  socket.on("do_matching_success", (data) => {
    $q.loading.hide();
    $q.notify({
      message: "Matching Success",
      color: "primary",
      icon: "cloud_done",
      position: "center",
      timeout: 1000,
    });
  });
  socket.on("save_result_success", (data) => {
    $q.loading.hide();
    $q.notify({
      message: "Result Saved",
      color: "primary",
      icon: "cloud_done",
      position: "center",
      timeout: 1000,
    });
  });
  socket.on("load_simulation_success", (data) => {
    $q.loading.hide();
    $q.notify({
      message: "Simulation Loaded",
      color: "primary",
      icon: "cloud_done",
      position: "center",
      timeout: 1000,
    });
    simulationData.value = data;
    createSimulationChart(data, 0);
  });
});

onUnmounted(() => {
  if (gridChart) {
    gridChart.dispose();
  }
  if (simulationChart) {
    simulationChart.dispose();
  }
});
</script>

<style scoped>
.sim-workspace {
  align-items: flex-start;
}

.controls-column,
.chart-column {
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

.chart-column {
  min-height: 680px;
}

.chart-surface {
  height: 680px;
}

.simulation-chart {
  height: 608px;
}

.spot-size-card {
  padding: 12px 16px 4px;
}

.spot-size-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 2px;
}
</style>
