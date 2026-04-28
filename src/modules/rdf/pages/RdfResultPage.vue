<template>
  <q-page class="q-px-md q-pb-md">
    <div class="text-h5">RDF 结果</div>
    <div class="text-subtitle2 q-mt-sm text-grey-5">
      这里用于查看结果说明、关键参数回显和导出入口。当前为重构阶段占位，后续会接入真实结果数据。
    </div>

    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12 col-lg-6">
        <q-card flat bordered class="full-height bg-blue-grey-10">
          <q-card-section>
            <div class="text-h6">结果摘要</div>
            <div class="q-mt-sm text-body2">
              在此展示本次计算的核心结论，例如峰位、拟合质量、可解释性提示。
            </div>
            <q-separator class="q-my-md" />
            <div class="text-subtitle2">建议检查项</div>
            <ul class="q-mt-sm">
              <li>曲线是否连续、是否存在异常噪点。</li>
              <li>拟合区间设置是否与样品特征一致。</li>
              <li>参数修改后结果是否稳定。</li>
            </ul>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-6">
        <q-card flat bordered class="full-height bg-blue-grey-10">
          <q-card-section>
            <div class="text-h6">参数回显（占位）</div>
            <q-list dense class="q-mt-sm">
              <q-item>
                <q-item-section>q per pixel</q-item-section>
                <q-item-section side>0.036</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>Start / End Index</q-item-section>
                <q-item-section side>0 / 100</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>Fit Threshold</q-item-section>
                <q-item-section side>90%</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>r_min / r_max</q-item-section>
                <q-item-section side>0 / 10</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="q-mt-md bg-blue-grey-10">
      <q-card-section class="row items-center q-col-gutter-sm">
        <div class="col-12 col-lg">
          <div class="text-h6">导出与复现</div>
          <div class="text-body2 q-mt-xs">
            后续可在这里导出结果图、参数快照和日志，便于复现实验流程。
          </div>
        </div>
        <div class="col-auto">
          <q-btn color="primary" disable label="导出结果（开发中）" />
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-sm q-mt-md">
      <div class="col-auto">
        <q-btn
          color="primary"
          outline
          label="返回流程继续调整"
          :to="{ name: 'rdf_workflow_v2' }"
        />
      </div>
      <div class="col-auto">
        <q-btn
          color="secondary"
          flat
          label="回到概览"
          :to="{ name: 'rdf_overview_v2' }"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "RdfResultPage",
});
</script>
