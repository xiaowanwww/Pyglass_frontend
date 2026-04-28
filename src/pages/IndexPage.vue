<template>
  <q-page class="home-page">
    <div class="home-hero">
      <div class="home-glow home-glow-left"></div>
      <div class="home-glow home-glow-right"></div>

      <div class="home-card">
        <div class="home-title">Pyglass</div>
        <div class="home-subtitle">
          一个面向衍射图像分析与材料计算的前端工作台，支持 RDF、SIM 和 ACOM 相关流程。
          你可以从主页进入各个功能模块，按步骤完成数据查看、参数调整和结果分析。
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
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
    radial-gradient(circle at top left, rgba(0, 188, 212, 0.18), transparent 30%),
    radial-gradient(circle at bottom right, rgba(63, 81, 181, 0.2), transparent 28%),
    linear-gradient(180deg, #0f141d 0%, #141a24 100%);
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
  border-radius: 28px;
  text-align: center;
  background: rgba(10, 14, 20, 0.78);
  border: 1px solid rgba(110, 126, 154, 0.28);
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
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
}
</style>
