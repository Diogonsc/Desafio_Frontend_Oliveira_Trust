<template>
  <div class="containerWaves">
    <div class="line leftToRight"></div>
    <div class="line rightToLeft"></div>
    <div class="line leftToRight"></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "BackgroundWaves",
  setup() {
    return {};
  },
});
</script>

<style scoped>
.containerWaves {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 200px;
  color: #fff;
  overflow: hidden;
}

.line {
  width: 100%;
  height: 2px;
  background-color: #ccc;
  position: absolute;
}

.line:nth-child(1) {
  top: 0;
}

.line:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}

.line:nth-child(3) {
  bottom: 0;
}

.leftToRight {
  animation: rippleLeftToRight 6s infinite linear alternate;
}

.rightToLeft {
  animation: rippleRightToLeft 6s infinite linear alternate;
}

@keyframes rippleLeftToRight {
  0% {
    left: -100%;
    transform: translateY(0);
  }
  50% {
    left: 100%;
    transform: translateY(-10px);
  }
  100% {
    left: 200%;
    transform: translateY(0);
  }
}

@keyframes rippleRightToLeft {
  0% {
    left: 100%;
    transform: translateY(0);
  }
  50% {
    left: -100%;
    transform: translateY(10px);
  }
  100% {
    left: -200%;
    transform: translateY(0);
  }
}
</style>
