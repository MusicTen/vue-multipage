<template>
  <div class="turntable">
    <div class="wheel-wrapper">
      <div class="title">{{ get_bag_times }}</div>
      <div :class="['wheel-pointer', { 'wheel-pointer-bg': !click }]"></div>
      <div class="wheel-bg" :style="`transform: rotate(${wheelDeg}deg)`">
        <div class="prize-list">
          <div
            v-for="(item, index) in prizeListOrigin"
            :key="index"
            :class="[
              'prize-item-wrapper',
              { winning: index == curIdx },
              { checked: (index == curIdx && !click) || item.has > 0 }
            ]"
          >
            <div class="prize-item" :style="`transform: rotate(${(360 / prizeListOrigin.length) * index}deg)`">
              <div class="prize-icon">
                <img
                  :class="{ jelly: index == isShowJelly }"
                  :src="
                    require(`../../assets/img/turntable/icon_${item.type == 'prop' ? item.prop[0].id : item.type}.png`)
                  "
                />
              </div>
              <div class="prize-name">
                <img
                  :class="{ jelly: index == isShowJelly }"
                  :src="
                    require(`../../assets/img/turntable/text_${
                      item.type == 'prop'
                        ? item.prop[0].id
                        : item.type == 'ticket' && item[item.type] >= 300
                        ? item.type + '1'
                        : item.type
                    }.png`)
                  "
                />
                <span>{{ `x${item.type == 'prop' ? item.prop[0].num : item[item.type]}` }}</span>
              </div>
              <div :class="{ mark: true, narrow: index == isShowJelly }" v-if="item.has > 0">x{{ item.has }}</div>
              <div :class="{ lizi: index == isShowJelly }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="tips">
        还可以抽奖<span>{{ lottery }}</span
        >次
        <img @click="add" src="~@/assets/img/turntable/add.png" alt="" />
      </div>
      <ul class="btn">
        <li
          @click="onClickRotate"
          :class="[lottery < 1 ? (is_adv ? 'ad' : 'disabled2') : '', { hand: isShowFree }]"
        ></li>
        <li @click="onClickRoll" :class="{ disabled1: isFive, hand: isShowTen }"></li>
      </ul>
    </div>
    <div class="mask" v-if="isShowPop">
      <div class="pop">
        <img src="~@/assets/img/turntable/text11.png" alt="" />
        <p>(每日次数{{ video_add_times }}/{{ video_total_times }})</p>
        <ul>
          <li v-for="v in 2" :key="v" @click="handlePop(v)"></li>
        </ul>
      </div>
    </div>
    <PopReward v-if="isShow" :isShow.sync="isShow" :giftbag="giftbag" />
  </div>
</template>

<script>
import { throttle } from '@/utils/util.js'
import PopReward from '@/components/PopReward'
const music = [require('@/assets/media/turn.mp3'), require('@/assets/media/select.mp3')]
export default {
  name: 'turntable',
  components: {
    PopReward
  },
  data() {
    return {
      isShow: 0,
      lottery: 10,
      curIdx: -1,
      rolling: false,
      wheelDeg: 0,
      prizeNumber: 10,
      words: {
        ticket: '红包',
        gold: '糖果',
        2: '锤子',
        5: '糖果罐',
        6: '步数+3',
        103: '魔方球'
      },
      prizeListOrigin: [
        {
          num: 1, // 编号
          type: 'ticket', // 奖励类型 ticket：红包券 2：糖果 3：道具
          ticket: 300, // 红包券
          gold: 0, // 糖果
          prop: [
            // 道具
            // {
            //   id: 2, // 道具编号
            //   num: 1 // 道具数量
            // }
          ],
          has: 0
        },
        {
          num: 2,
          type: 'prop',
          ticket: 0,
          gold: 0,
          prop: [
            {
              id: 2,
              num: 1
            }
          ],
          has: 0
        },
        {
          num: 3,
          type: 'gold',
          ticket: 0,
          gold: 500,
          prop: [],
          has: 0
        },
        {
          num: 4,
          type: 'prop',
          ticket: 0,
          gold: 300,
          prop: [
            {
              id: 5,
              num: 1
            }
          ],
          has: 0
        },
        {
          num: 5,
          type: 'ticket',
          ticket: 66,
          gold: 0,
          prop: [],
          has: 0
        },
        {
          num: 6,
          type: 'prop',
          ticket: 0,
          gold: 0,
          prop: [
            {
              id: 103,
              num: 1
            }
          ],
          has: 0
        },
        {
          num: 7,
          type: 'gold',
          ticket: 0,
          gold: 100,
          prop: [],
          has: 0
        },
        {
          num: 8,
          type: 'prop',
          ticket: 0,
          gold: 0,
          prop: [
            {
              id: 6,
              num: 1
            }
          ],
          has: 0
        }
      ],
      // 五连抽
      // index: -1, // 当前转动到哪个位置，起点位置
      count: 8, // 总共有多少个位置
      timer: null, // 每次转动定时器
      speed: 60, // 初始转动速度
      times: 0, // 转动次数
      cycle: 6, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
      prize: -1, // 中奖位置
      click: true,
      ten: 0,
      tenRes: [],
      isShowJelly: -1,
      giftbag: [
        // {
        //   id: 'gold',
        //   num: 30
        // },
        {
          id: 2,
          num: 1
        },
        // {
        //   id: 103,
        //   num: 1
        // }
      ],
      isShowFree: false,
      isShowTen: false,
      is_adv: true,
      get_bag_times: 1,
      continuous_draw_surplus_times: 3,
      video_add_times: 0,
      video_total_times: 3,
      isShowPop: false,
      audio: null,
      isHou: false
    }
  },
  computed: {
    isFive() {
      if (this.continuous_draw_surplus_times < 1) return true
      if (this.lottery > 4) return false
      if (this.video_add_times < 3) return false
      return true
    }
  },
  mounted() {},
  methods: {
    start() {
      if (this.lottery < 5) return this.onClickRotate()
      this.onClickRoll()
    },
    onClickRotate: throttle(function() {
      if (!this.lottery) return console.log('没有次数了')
      if (!this.click || this.rolling) return console.log('正在抽奖哦')
      this.playMusic(0)
      this.startRotate()
    }, 1500),
    // 单抽
    startRotate() {
      this.curIdx = -1
      const { wheelDeg, prizeListOrigin } = this
      this.rolling = true
      const random = Math.floor(Math.random() * prizeListOrigin.length)
      this.wheelDeg = wheelDeg - (wheelDeg % 360) + 4 * 360 + (360 - (360 / prizeListOrigin.length) * random)
      let timer1 = setTimeout(() => {
        this.playMusic(1)
        this.curIdx = random
        this.isShowJelly = random
        clearTimeout(timer1)
        let timer2 = setTimeout(() => {
          this.rolling = false
          this.isShow = true
          this.curIdx = -1
          this.isShowJelly = -1
          clearTimeout(timer2)
        }, 1000)
        console.log('Result1：' + random)
      }, 1220)
    },
    onClickRoll: throttle(async function() {
      if (this.continuous_draw_surplus_times < 1) return console.log('今日3次五连抽机会已用完')
      if (!this.click || this.rolling) return console.log('正在抽奖哦')
      this.click = false
      this.startRoll()
    }, 2000),
    // 5连抽转动
    startRoll() {
      this.isShowJelly = -1
      this.times += 1 // 转动次数
      this.oneRoll() // 转动过程调用的每一次转动方法，这里是第一次调用初始化
      // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
      if (this.times > this.cycle + 5 && this.prize === this.curIdx) {
        clearTimeout(this.timer) // 清除转动定时器，停止转动
        console.log('结果：', this.prize)
        this.prizeListOrigin[this.prize].has++
        this.isShowJelly = this.prize
        this.prize = -1
        this.times = 0
        this.speed = 60
        this.ten++
        this.playMusic(1)
        if (this.ten < 5) {
          let timer1 = setTimeout(() => {
            this.startRoll()
            clearTimeout(timer1)
          }, 300)
        } else {
          let timer2 = setTimeout(() => {
            this.isShow = true
            this.ten = 0
            this.click = true
            this.curIdx = -1
            this.prizeListOrigin = this.prizeListOrigin.map(item => {
              item.has = 0
              return item
            })
            clearTimeout(timer2)
          }, 1000)
        }
      } else {
        if (this.times < this.cycle) {
          this.speed -= 40 // 加快转动速度
        } else if (this.times === this.cycle) {
          const random = Math.floor(Math.random() * this.prizeListOrigin.length) // 随机获得一个中奖位置
          this.prize = random
          if (this.prize > 7) {
            this.prize = 7
          }
        }
        // else if (
        //   this.times > this.cycle + 8 &&
        //   ((this.prize === 0 && this.curIdx === 7) ||
        //     this.prize === this.curIdx + 1)
        // ) {
        //   this.speed += 110
        // } else {
        //   this.speed += 30
        // }
        if (this.speed < 30) {
          this.speed = 20
        }
        this.timer = setTimeout(this.startRoll, this.speed)
      }
    },
    // 每一次转动
    oneRoll() {
      let index = this.curIdx // 当前转动到哪个位置
      const count = this.count // 总共有多少个位置
      index += 1
      if (index > count - 1) {
        index = 0
      }
      this.curIdx = index
    },
    add() {
      this.isShowPop = true
    },
    handlePop(i) {
      if (i < 2) return (this.isShowPop = false)
      this.lottery++
      this.video_add_times++
      this.isShowPop = false
    },
    setCookie(name = 'isShowFree', value = 1) {
      let now = new Date()
      let tomorrow = now - (now % (24 * 60 * 60 * 1000)) + 24 * 60 * 60 * 1000
      let expires = new Date(tomorrow).toUTCString()
      document.cookie = `${name}=${value};expires=${expires};`
    },
    getCookie(name = 'isShowFree') {
      var reg = /\s/g
      var result = document.cookie.replace(reg, '')
      var resultArr = result.split(';')
      for (var i = 0; i < resultArr.length; i++) {
        var nameArr = resultArr[i].split('=')
        if (nameArr[0] == name) {
          return nameArr[1]
        }
      }
    },
    // 音效
    playMusic(index) {
      if (this.isHou) return
      if (!this.audio) this.audio = new Audio()
      this.audio.src = music[index]
      this.audio.play()
    }
  },
  watch: {
    lottery(val) {
      if (val > 4) {
        if (this.getCookie('isShowTen') > 0) return
        this.isShowTen = 1
        this.setCookie('isShowTen')
        return
      }
      if (val > 0) {
        if (this.getCookie() > 0) return
        this.isShowFree = 1
        this.setCookie()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/style/reset.css';
@import '~@/style/turntable.less';
</style>
