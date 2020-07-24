<template>
  <div class="mask">
    <div class="pop">
      <img class="top-close" src="~@/assets/img/turntable/gift-close.png" alt @click="close" />
      <div class="confirm" @click="confirm"></div>
    </div>
    <div class="canvas" ref="canvas"></div>
  </div>
</template>

<script>
import PixiApp from '@/utils/PixiApp'
export default {
  name: 'PopReward',
  props: {
    giftbag: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      app: null
    }
  },
  mounted() {
    let pixiApp = new PixiApp(this.giftbag)
    console.log(this.giftbag)
    this.$refs.canvas.appendChild(pixiApp.app.view)
    this.app = pixiApp
  },
  methods: {
    confirm() {
      this.close()
    },
    close() {
      this.$emit('update:isShow', false)
      this.app.removeApp()
    }
  }
}
</script>

<style lang="less" scoped>
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 110;
  background: url('~@/assets/img/turntable/mask-bg.png') no-repeat center center;
  background-size: 100% 100%;
  &::after {
    content: '';
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: -1;
  }
  .pop {
    width: 7.5rem;
    height: 7.3rem;
    padding: 0.7rem 0.5rem 0.4rem;
    // background: url('~@/assets/img/contest/bg-pop.png') no-repeat center center;
    background-size: 100% 100%;
    box-sizing: border-box;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -0.3rem;
    transform: translate(-50%, -50%);
    .title {
      width: 6.45rem;
      height: 1.27rem;
      position: absolute;
      top: -0.2rem;
      left: 50%;
      transform: translateX(-50%);
    }
    .top-close {
      width: 0.42rem;
      height: 0.42rem;
      position: absolute;
      top: -1.3rem;
      right: 0.16rem;
    }
    .confirm {
      width: 3.81rem;
      height: 1.2rem;
      position: absolute;
      left: 50%;
      top: calc(50% + 2.16rem);
      transform: translateX(-50%);
      background: url('~@/assets/img/turntable/text5.png') no-repeat center 0.36rem,
        url('~@/assets/img/turntable/btn_pink2.png') no-repeat;
      background-size: 1.66rem 0.44rem, 100%;
    }
  }
}
.canvas {
  width: 100%;
  height: 100%;
}
</style>
