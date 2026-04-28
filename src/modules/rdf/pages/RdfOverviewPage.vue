<template>
  <q-page class="q-px-md q-pb-md">
    <div class="text-h5">RDF 概览</div>
    <div class="text-subtitle2 q-mt-sm text-grey-5">
      本模块用于从衍射图像计算 RDF 曲线，适合做材料结构分析与参数比对。
    </div>

    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12 col-lg-4">
        <q-card flat bordered class="full-height bg-blue-grey-10">
          <q-card-section>
            <div class="text-h6">输入要求</div>
            <ul class="q-mt-sm">
              <li>建议先在 View 模块确认 DM4 文件可正常加载。</li>
              <li>在流程页第 1 步上传数据并调整图像参数。</li>
              <li>在第 2 步选择元素并填写数量比例。</li>
            </ul>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-4">
        <q-card flat bordered class="full-height bg-blue-grey-10">
          <q-card-section>
            <div class="text-h6">输出结果</div>
            <ul class="q-mt-sm">
              <li>衍射图像预览与极坐标图。</li>
              <li>Diffraction Profile / Scattering Factor 等 6 类曲线。</li>
              <li>可用于后续报告或参数复现的设置记录。</li>
            </ul>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-4">
        <q-card flat bordered class="full-height bg-blue-grey-10">
          <q-card-section>
            <div class="text-h6">推荐顺序</div>
            <ol class="q-mt-sm">
              <li>先做上传与预处理。</li>
              <li>再做元素与占比设置。</li>
              <li>最后做计算与曲线检查。</li>
            </ol>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="q-mt-md bg-blue-grey-10">
      <q-card-section>
        <div class="text-h6">常见问题</div>
        <div class="q-mt-sm">
          1) 图像不更新：检查后端 socket 服务是否运行。<br />
          2) 曲线为空：确认第 2 步已保存元素比例。<br />
          3) 参数变化无反馈：先在第 1 步成功加载 DM4 后再计算。
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-sm q-mt-md">
      <div class="col-auto">
        <q-btn
          color="primary"
          label="开始使用（进入流程）"
          :to="{ name: 'rdf_workflow_v2' }"
        />
      </div>
      <div class="col-auto">
        <q-btn
          color="secondary"
          flat
          label="查看结果页示例"
          :to="{ name: 'rdf_result_v2' }"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "RdfOverviewPage",
});
</script>
