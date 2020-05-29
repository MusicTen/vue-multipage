<template>
  <div class="cancellation">
    <div class="pop">
      <div class="header">
        <div class="title"></div>
        <div class="closeIcon" @click="close()"></div>
      </div>
      <div class="main">
        <p>假日特殊福利，广告10倍领取奖励</p>
        <div class="content">
          <div
            v-for="(v, i) in dayList"
            :class="{
              normal: true,
              alSignUp: v === 0,
              addBorder: v === 1 || v === 2 || v === 3,
              waitGetReward: v === 4
            }"
            :key="i"
            @click="signUp(v, i)"
          >
            <img class="dayIcon" :src="require(`../../assets/img/51Day/dayIcon_${i + 1}.png`)" @click="close" alt />
            <div class="redPacketIcon"></div>
            <div :class="{ amount: true, waitAmountBg: v === 4 }">{{ packetAmount[i] }}红包卷</div>
            <div :class="{ getBtn: true, allowGet: v === 2 }">
              <div class="vdIcon" v-if="v === 3"></div>
              {{ v === 1 ? '签到' : v === 3 ? '补签' : v === 4 ? '待领取' : v === 0 ? '已领取' : '' }}
            </div>
          </div>
          <div class="dizhuBg">
            <div class="fudai"></div>
            <div class="aperture"></div>
            <div v-if="signDay === 5" class="getFudai" @click="getLuckBag()"></div>
          </div>
        </div>
      </div>
      <div class="footer">已经签到{{ signDay }}天，连续5天，可获得额外福袋</div>
    </div>
  </div>
</template>
<script>
import { throttle } from '@/utils/util.js'
export default {
  data() {
    return {
      dayList: [0, 1, 2, 3, 4], //0 已完成 1 普通签到 2 十倍签到 3 视频补签 4 待领取
      packetAmount: [0, 0, 0, 0, 0],
      lt: ''
    }
  },
  mounted() {
    this.initStatus()
  },
  computed: {
    signDay: function() {
      let n = 0
      this.dayList.forEach(e => {
        if (e === 0 || e === 2) {
          n = n + 1
        }
      })
      return n
    }
  },
  methods: {
    close() {
      this.$emit('update:isSignInModal', false)
    },
    initStatus() {},
    signUp: throttle(function(v, i) {
      let newArr = JSON.parse(JSON.stringify(this.dayList))
      if (v === 1) {
        newArr[i] = 2
        this.dayList = newArr
      } else if (v === 3) {
        newArr[i] = 2
        this.dayList = newArr
      } else if (v === 2) {
        newArr[i] = 0
        this.dayList = newArr
      }
    }, 2000),
    getLuckBag() {}
  }
}
</script>
<style lang="less" scoped>
.cancellation {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  .pop {
    width: 7.44rem;
    height: 9.5rem;
    border-radius: 0.3rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .header {
      widows: 100%;
      height: 1.36rem;
    }
    .title {
      width: 4.86rem;
      height: 1.36rem;
      background-image: url('~@/assets/img/51Day/signUpTitle.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      float: left;
      margin-left: 0.25rem;
    }
    .closeIcon {
      width: 0.5rem;
      height: 0.5rem;
      background-image: url('~@/assets/img/51Day/signUpCloseIcon.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      float: right;
      margin: 0.8rem 0.4rem 0 0;
    }
    .main {
      height: 7rem;
      width: 100%;
      p {
        width: 4rem;
        height: 0.24rem;
        color: #fbf5bf;
        font-size: 0.24rem;
        /* line-height: 1rem; */
        margin: 0.1rem 0.5rem;
        font-weight: bold;
      }
      .content {
        height: 7rem;
        width: 100%;

        .normal {
          width: 2.2rem;
          height: 2.9rem;
          // background-color: blue;
          float: left;
          position: relative;
          margin: 0.2rem 0 0 0.2rem;
          background-image: url('~@/assets/img/51Day/bg_signUpCur.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          .dayIcon {
            float: left;
            width: 0.84rem;
            margin: 0.03rem 0 0 0.05rem;
            position: absolute;
            left: 0;
          }
        }
        .normal:nth-of-type(1) {
          margin: 0 0 0 0.2rem;
        }
        .normal:nth-of-type(2) {
          margin: 0 0 0 0.2rem;
        }
        .normal:nth-of-type(3) {
          margin: 0 0 0 0.2rem;
        }
        .waitGetReward {
          background-image: url('~@/assets/img/51Day/bg_waitGetReward.png');
        }
        .alSignUp::before {
          content: '';
          width: 2.15rem;
          height: 2.83rem;
          background-image: url('~@/assets/img/51Day/signUpMask.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          float: left;
          position: relative;
          top: 0.021rem;
          left: 0.025rem;
          z-index: 10;
        }
        .addBorder::before {
          content: '';
          width: 2.38rem;
          height: 3.05rem;
          background-image: url('~@/assets/img/51Day/bg_border.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          float: left;
          position: relative;
          top: -0.12rem;
          left: -0.085rem;
          z-index: 10;
        }
        .redPacketIcon {
          width: 1.2rem;
          height: 1.11rem;
          background-image: url('~@/assets/img/51Day/hb_icon.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          position: absolute;
          top: 0.5rem;
          left: 0.55rem;
        }
        .amount {
          width: 1.62rem;
          height: 0.34rem;
          background-image: url('~@/assets/img/51Day/amount_bg.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          position: absolute;
          top: 1.7rem;
          left: 0.34rem;
          font-size: 0.23rem;
          text-align: center;
          color: #fffbcc;
          line-height: 0.34rem;
        }
        .waitAmountBg {
          background-image: url('~@/assets/img/51Day/waitGetAmount_bg.png');
          color: #d2392b;
        }
        .getBtn {
          width: 1.91rem;
          height: 0.46rem;
          color: #fffbcc;
          font-size: 0.36rem;
          position: absolute;
          left: 0.12rem;
          bottom: 0.2rem;
          line-height: 0.46rem;
          font-weight: bold;
        }
        .allowGet {
          background-image: url('~@/assets/img/51Day/allowGet_bg.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        .dizhuBg {
          width: 3.16rem;
          height: 3.69rem;
          background-image: url('~@/assets/img/51Day/dizhuBg.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          position: absolute;
          right: 0.05rem;
          bottom: 1.24rem;
          z-index: 11;
        }
        .fudai {
          width: 1.89rem;
          height: 2.2rem;
          background-image: url('~@/assets/img/51Day/fudaiBg.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          position: absolute;
          right: 0.55rem;
          top: 1.65rem;
          z-index: 10;
        }
        .aperture {
          width: 2.46rem;
          height: 2.46rem;
          background-image: url('~@/assets/img/51Day/aperture.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          position: absolute;
          right: 0.27rem;
          top: 1.7rem;
          z-index: 5;
          animation: apertureRotate 6s linear infinite;
        }
        @keyframes apertureRotate {
          /*以百分比来规定改变发生的时间 也可以通过"from"和"to",等价于0% 和 100%*/
          0% {
            /*rotate(2D旋转) scale(放大或者缩小) translate(移动) skew(翻转)*/
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
    }
    .footer {
      width: 7.5rem;
      height: 0.82rem;
      margin: 0.31rem auto 0;
      font-size: 0.28rem;
      font-weight: bold;
      line-height: 0.82rem;
      color: rgba(253, 240, 181, 1);
      background-image: url('~@/assets/img/51Day/signUpNoticeBg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      text-align: center;
    }
    .vdIcon {
      width: 0.43rem;
      height: 0.43rem;
      position: absolute;
      left: 0.1rem;
      top: 0.03rem;
      background-image: url('~@/assets/img/51Day/videoIcon.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .getFudai {
      width: 1.9rem;
      height: 0.65rem;
      background-image: url('~@/assets/img/51Day/getFudai.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 3.34rem;
      left: 0.7rem;
      z-index: 10;
    }
  }
}
</style>
