<template>
  <div class="moneyTree">
    <img class="reward" src="@/assets/img/tree/reward.png" @click="getRewardList" alt />
    <p class="countDown">
      下轮免费倒计时：<span>{{ remainingTime }}</span>
    </p>
    <div class="tree" @click="feel" ref="refbox"></div>
    <ul class="btns">
      <li>
        <img src="@/assets/img/tree/btn_blue5.png" @click="invite" alt />
        <div class="tips" v-if="current_invite_num >= need_invite_num">免费次数:{{ invite_times }}次</div>
        <div class="tips" v-else>
          邀请好友 <span>{{ current_invite_num }}</span> / {{ need_invite_num }}
        </div>
      </li>
      <li>
        <img @click="shake" :src="shakeSrc" alt />
        <div class="tips" v-if="adv">看视频继续抽奖</div>
        <div class="tips" v-else>免费次数:{{ times }}次</div>
      </li>
    </ul>
    <!-- <div class="ad"></div> -->
    <div class="popRecord" v-if="isShowRecord">
      <div class="main list">
        <img class="close" src="@/assets/img/tree/close.png" @click="close(1)" alt />
        <h3>中奖记录</h3>
        <ul v-if="rewardList.length !== 0">
          <li v-for="(v, i) in rewardList" :key="i">
            <img v-if="v.reward_type === 1" src="@/assets/img/tree/cat_coin1.png" alt />
            <img v-else src="@/assets/img/tree/cat_fish.png" alt />
            <div>
              <h4>{{ v.reward_type === 1 ? '喵币' : '小鱼干' }}奖励</h4>
              <p>
                获得{{ v.reward_type === 1 ? v.reward_value : v.reward_value | Format
                }}{{ v.reward_type === 1 ? '喵币' : '小鱼干' }}
              </p>
            </div>
          </li>
        </ul>
        <div v-else class="nodata">
          <img src="@/assets/img/tree/nodata.png" alt />
          您还没有任何中奖记录~
        </div>
      </div>
    </div>
    <div class="popReward" v-if="isShowReward">
      <div class="main light">
        <img src="@/assets/img/tree/close.png" class="close" @click="close(2)" alt />
        <img src="@/assets/img/tree/title.png" class="title" alt />
        <img src="@/assets/img/tree/light1.png" :class="['bg', { rotate: isRotate }]" alt />
        <img src="@/assets/img/tree/light2.png" class="bg1" alt />
        <h3>{{ reward_type === 3 ? '什么都没有摇到' : '恭喜你获得' }}</h3>
        <p v-if="reward_type !== 3">
          +{{ reward_type === 1 ? reward_value : reward_value | Format }}{{ reward_type === 1 ? '喵币' : '小鱼干' }}
        </p>
        <img v-if="reward_type === 1" src="@/assets/img/tree/cat_coin2.png" class="coinOrFish" alt />
        <img v-else-if="reward_type === 2" src="@/assets/img/tree/cat_fish1.png" class="coinOrFish" alt />
        <img v-else src="@/assets/img/tree/cat.png" class="coinOrFish" alt />
        <button @click="playAgain">{{ reward_type === 3 ? '再接再厉' : '继续游戏' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getFormatFortune } from '@/utils/util.js'
import lottie from 'lottie-web'
const shakePng = require('@/assets/img/tree/btn_yellow5.png')
// const bg_ad = require('@/assets/img/tree/bg_ad.png')
const shakeGif = require('@/assets/img/tree/shake.gif')
const animateJsonPath = './json/lottie-web/tree/data.json'
export default {
  data() {
    return {
      isPlay: 0,
      isFinished: 0,
      isShowRecord: 0,
      isShowReward: 0,
      isRotate: 0,
      shakeSrc: shakeGif,
      lottieAnimation: null,
      littletime: 10000,
      times: 5,
      adv: 0,
      invite_times: 50,
      current_invite_num: 0,
      need_invite_num: 5,
      rewardList: [],
      reward_type: 1,
      reward_value: 0,
      clickType: 0,
      audio: null,
      music: ''
    }
  },
  computed: {
    remainingTime() {
      let tips = '00:00:00'
      if (this.littletime > 0) {
        var hours = Math.floor(this.littletime / 3600)
        var minutes = Math.floor(this.littletime / 60) % 60
        var seconds = this.littletime % 60
        hours = hours < 10 ? '0' + hours : hours
        minutes = minutes < 10 ? '0' + minutes : minutes
        seconds = seconds < 10 ? '0' + seconds : seconds
        tips = hours + ':' + minutes + ':' + seconds
      }
      return tips
    }
  },
  filters: {
    Format(value) {
      return getFormatFortune(value)
    }
  },
  created() {},
  mounted() {
    this.loadAnimation()
    this.countDown()
  },
  methods: {
    getRewardList() {
      this.isShowRecord = 1
    },
    close(idx) {
      if (idx === 1) {
        this.isShowRecord = 0
      } else {
        this.isShowReward = this.isRotate = 0
        this.shakeSrc = shakeGif
      }
    },
    playAgain() {
      this.close(2)
    },
    shake() {
      this.clickType = 1
      this.shakeSrc = shakePng
      this.lottieAnimation.playSegments([1, 25], true)
    },
    async invite() {
      this.clickType = 0
      this.shakeSrc = shakePng
      this.lottieAnimation.playSegments([1, 25], true)
    },
    feel() {
      if (this.isPlay) return
      this.isPlay = 1
      this.lottieAnimation.playSegments([25, 50], true)
    },
    loadAnimation() {
      this.lottieAnimation = lottie.loadAnimation({
        container: this.$refs.refbox,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: animateJsonPath
      })
      this.handleAnimate()
    },
    handleAnimate() {
      this.lottieAnimation.addEventListener('complete', () => {
        this.isPlay = 0
        if (this.shakeSrc === shakePng) {
          this.handleShake(0)
        }
      })
    },
    handleShake() {
      if (!this.times) return
      --this.times
      let arr = [1, 2, 3]
      this.reward_type = arr[Math.floor(Math.random() * arr.length)]
      this.reward_value = 500
      this.showPop()
    },
    showPop() {
      this.isShowReward = 1
      setTimeout(() => {
        this.isRotate = 1
      }, 500)
    },
    countDown() {
      this.timer = setInterval(() => {
        this.littletime--
        if (this.littletime < 0) {
          clearInterval(this.timer)
        }
      }, 1000)
    },
    // 音效
    playMusic() {
      this.audio = new Audio()
      this.audio.src = this.music
      this.audio.play()
    }
  }
}
</script>

<style lang="less">
@import '~@/style/reset.css';
@import '~@/style/moneyTree.less';
</style>
