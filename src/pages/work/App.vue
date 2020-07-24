<template>
  <div>
    <div class="worksite">
      <img class="back" v-if="0" src="@/assets/img/work/back.png" alt />
      <div class="countDown" v-if="0">
        <p>{{ busyOrFree }}</p>
        <p>{{ countdown }}</p>
      </div>
      <div class="work" ref="refbox"></div>
      <div class="loading">
        <img src="@/assets/img/work/pig.png" alt /><br />
        正在生成场景...
      </div>
      <div class="panel">
        <h4>{{ busyOrFree }}</h4>
        <p>{{ countdown }}</p>
        <progress v-if="isWorking" :value="totalSecond - surplusSecond" :max="totalSecond"></progress>
      </div>
      <ul class="bubble" v-if="0">
        <li
          v-for="(v, i) in rewardList"
          :key="i"
          :class="
            v.reward_type > 1
              ? v.surplus_second > 0
                ? 'nofortune'
                : 'fortune'
              : v.surplus_second > 0
              ? 'nocion'
              : 'cion'
          "
          @click="receive(v)"
        >
          <p class="reward">{{ v.reward_value | Format }}{{ v.reward_type > 1 ? '' : '猪币' }}</p>
        </li>
      </ul>
    </div>
    <div class="worklist" :style="{ backgroundColor: color[curIdx] }">
      <div class="main">
        <ul>
          <li v-for="(v, i) in workList" :key="i">
            <img :src="workicon[i]" alt />
            <div class="introduce">
              <!-- <h3>{{ v.name }}<span>{{ v.minute }}分钟</span></h3> -->
              <h3>{{ v.name }}</h3>
              <p>
                可赚<span>{{ v.reward_value | Format }}{{ v.reward_type > 1 ? '福气值' : '猪币' }}</span>
              </p>
            </div>
            <button @click="work(i)" :class="v.status < 2 ? 'disable' : v.status > 2 ? 'receive' : 'working'">
              {{ btn[v.status] }}
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="pop" v-if="isShowPop">
      <img src="@/assets/img/work/bg_light.png" class="bg" alt />
      <div class="packet">
        <h3>获得猪币红包</h3>
        <p>
          <span>{{ curCion }}</span
          >猪币
        </p>
        <div @click="go">继续打工赚钱</div>
      </div>
      <img src="@/assets/img/work/btn_close.png" @click="close" class="close" alt />
    </div>
  </div>
</template>

<script>
import { getFormatFortune } from '@/utils/util.js'
// import * as PIXI from 'pixi.js-legacy'
let Application = PIXI.Application,
  Sprite = PIXI.Sprite,
  Graphics = PIXI.Graphics
export default {
  data() {
    return {
      lt: null,
      openid: null,
      isWorking: false,
      level: 0,
      totalCoin: 0,
      workicon: [
        require('@/assets/img/work/task1.png'),
        require('@/assets/img/work/task2.png'),
        require('@/assets/img/work/task3.png'),
        require('@/assets/img/work/task4.png'),
        require('@/assets/img/work/task5.png')
      ],
      workList: [
        {
          name: '洗盘子',
          minute: 1,
          reward_type: 1,
          reward_value: 5000,
          status: 2
        },
        {
          name: '打扫家',
          minute: 1,
          reward_type: 1,
          reward_value: 10000,
          status: 2
        },
        {
          name: '去搬砖',
          minute: 1,
          reward_type: 1,
          reward_value: 15000,
          status: 2
        },
        {
          name: '开专车',
          minute: 1,
          reward_type: 1,
          reward_value: 20000,
          status: 2
        },
        {
          name: '写代码',
          minute: 1,
          reward_type: 1,
          reward_value: 25000,
          status: 2
        }
      ],
      rewardList: [],
      currentWork: {},
      Bg: null,
      Fg: null,
      isSwing: true,
      btn: ['已完成', '打工中', '去打工', '领奖励'],
      color: ['#C0E6F2', '#ACE3CD', '#939393', '#C8C8C8', '#C4E3F2', '#4BAA2A', '#F4F4F4'],
      json: [
        ['xipanzi', 'xipanzibg'],
        ['dasaojia', 'dasaojiabg'],
        ['banzhuan', 'banzhuanbg'],
        ['kaizhuanche', 'kaizhuanchebg'],
        ['qiaodaima', 'qiaodaimabg'],
        ['opencase', 'kongxian']
      ],
      timer: null,
      surplusSecond: 0,
      busyOrFree: '空闲中...',
      totalSecond: 3,
      curIdx: 6,
      isLoad: false,
      width: 0,
      isShowPop: 0,
      curCion: 5000
    }
  },
  filters: {
    Format(value) {
      return getFormatFortune(value)
    }
  },
  computed: {
    countdown() {
      if (this.surplusSecond < 1) return '努力打工才能赚钱哦'
      let minutes = ~~(~~(this.surplusSecond % 3600) / 60)
      let seconds = this.surplusSecond % 60
      return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.level = 1
      this.totalCoin = 10000
      this.getWidth()
      this.getWork()
      this.work(0)
    },
    async getWork() {
      await this.getResources(0)
      this.createWorking(0)
    },
    getWidth() {
      let { innerWidth } = window
      if (innerWidth > 0 && !localStorage.getItem('innerWidth')) {
        localStorage.setItem('innerWidth', innerWidth)
      }
      this.width = innerWidth < 1 ? localStorage.getItem('innerWidth') : innerWidth
    },
    createScense() {
      // 屏幕的设备像素比
      const devicePixelRatio = window.devicePixelRatio || 1
      const canvasHeight = (this.width / 750) * 690
      const app = new Application({
        width: this.width * devicePixelRatio,
        transparent: true,
        antialias: true,
        height: canvasHeight * devicePixelRatio,
        resolution: devicePixelRatio
      })
      app.renderer.autoResize = true
      this.$refs.refbox.appendChild(app.view)
      app.view.style.width = this.width + 'px'
      app.view.style.height = canvasHeight + 'px'
      app.renderer.resize(this.width, canvasHeight)
      app.stage.interactive = true
      return app
    },
    getResources(type) {
      this.isLoad = true
      const loader = PIXI.Loader.shared
      let FgJson = `./json/${this.json[type][0]}.json`
      let BgJson = `./json/${this.json[type][1]}.json`
      let pigPng = `https://static.qmpig8.com/pig/img/pig_${this.level}.png`
      let jsonArr = PIXI.Loader.shared.resources[pigPng] ? [FgJson, BgJson] : [FgJson, BgJson, pigPng]
      return new Promise(resolve => {
        if (PIXI.Loader.shared.resources[FgJson]) {
          this.isLoad = false
          resolve()
        }
        loader.add(jsonArr).load(() => {
          this.isLoad = false
          resolve()
        })
      })
    },
    createWorking(type) {
      let app = this.createScense()
      this.Bg = this.drawAnimatedSprite(this.json[type][1]) // 绘制背景
      this.Fg = this.drawAnimatedSprite(this.json[type][0]) // 绘制前景
      this.Bg.animationSpeed = 0.2
      this.Fg.animationSpeed = 0.2
      this.Bg.play()
      this.Fg.play()
      this.Fg.visible = type !== 5
      this.isWorking = type !== 5
      let pig = this.drawPig(this.level) // 绘制猪
      let shadow = this.drawShadow()
      app.ticker.add(() => {
        pig.rotation += 0.002 * Math.pow(-1, this.isSwing + 1)
        if (pig.rotation <= -0.02 || pig.rotation >= 0.08) {
          this.isSwing = !this.isSwing
        }
      })
      app.stage.addChild(this.Bg)
      app.stage.addChild(shadow)
      app.stage.addChild(pig)
      app.stage.addChild(this.Fg)
      this.curIdx = type
    },
    drawPig(level) {
      let pig = new Sprite(PIXI.Loader.shared.resources[`https://static.qmpig8.com/pig/img/pig_${level}.png`].texture)
      pig.width = 190
      pig.height = 190
      pig.anchor.set(0.5, 0.5)
      pig.x = this.width / 2
      pig.y = (this.width / 750) * 690 * 0.62
      pig.rotation = 0
      return pig
    },
    drawAnimatedSprite(type) {
      let sheet = PIXI.Loader.shared.resources[`./json/${type}.json`].spritesheet
      let animatedSprite = new PIXI.AnimatedSprite(sheet.animations[type])
      animatedSprite.width = this.width
      animatedSprite.height = (this.width / 750) * 690
      return animatedSprite
    },
    drawShadow() {
      let ellipse = new Graphics()
      ellipse.beginFill(0x5d5d5d, 0.4)
      ellipse.drawEllipse(this.width / 2, (this.width / 750) * 690 * 0.9, 30, 5)
      ellipse.endFill()
      return ellipse
    },
    async work(i) {
      if (this.isWorking) {
        return
      }
      if (this.workList[i].status === 3) {
        this.curCion = this.workList[i].reward_value
        this.isShowPop = 1
        return
      }
      this.isWorking = true
      this.workList[i].status = 1
      this.busyOrFree = this.workList[i].name
      this.updateWorking(i)
      this.updateTime()
    },
    updateTime() {
      this.surplusSecond = 3
      this.timer = setInterval(() => {
        this.surplusSecond -= 1
        if (this.surplusSecond < 1) {
          clearInterval(this.timer)
          this.isWorking = false
          this.busyOrFree = '空闲中'
          this.workList[this.curIdx].status = 3
          this.updateWorking(5)
        }
      }, 1000)
    },
    async updateWorking(type) {
      if (this.isLoad) return
      await this.getResources(type)
      this.Fg.textures =
        PIXI.Loader.shared.resources[`./json/${this.json[type][0]}.json`].spritesheet.animations[this.json[type][0]]
      this.Bg.textures =
        PIXI.Loader.shared.resources[`./json/${this.json[type][1]}.json`].spritesheet.animations[this.json[type][1]]
      this.Fg.play()
      this.Bg.play()
      this.Fg.visible = type !== 5
      this.Fg.width = this.width
      this.Bg.width = this.width
      this.Fg.height = (this.width / 750) * 690
      this.Bg.height = (this.width / 750) * 690
      this.curIdx = type
    },
    async receive(reward_type, reward_value, type) {
      this.$AppCenter.showLoading()
      let res = await this.$phpapi.getWorkReward({ openid: this.openid, lt: this.lt, type })
      this.$AppCenter.hideLoading()
      if (res.code !== 0) {
        return this.$AppCenter.openToast(res.message)
      }
      this.getWork()
      clearInterval(this.timer)
    },
    go() {
      window.playableSDK.openAppStore()
    },
    close() {
      this.isShowPop = 0
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/style/reset.css';
@import '~@/style/work.less';
</style>
