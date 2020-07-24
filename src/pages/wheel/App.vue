<template>
  <div class="content">
    <img class="play" @click="play" src="~@/assets/img/wheel/play.png" alt />
    <div class="tips">
      <div class="box">
        <div class="items">
          <span v-for="(item, index) in dataArr" :key="index">{{ item }}</span>
        </div>
      </div>
    </div>
    <div class="main">
      <ul>
        <li v-for="(item, i) in list" :key="i" :class="{ on: i == index }">
          <div>
            <img :src="item.img" alt />
            <!-- <p>{{ item.text }}</p> -->
          </div>
        </li>
        <img class="start" @click="startRoll" src="~@/assets/img/wheel/start.png" alt />
      </ul>
    </div>
    <div class="rule">
      <img src="~@/assets/img/wheel/rule.png" alt="" />
      <ul>
        <li>
          1、活动期间邀请1人获得3次机会、邀请5人获得15次机会、邀请10人获得30次机会、邀请30人获得90次机会、邀请50人获得150次机会；
        </li>
        <li>2、邀请的好友成功激活1人加3次机会、成功激活5人加15次机会、成功激活30人加90次机会；</li>
        <li>3、还有更多神秘大奖需邀请并激活100人以上才可获得；</li>
        <li>4、活动期间入喉发现账户出现违规行为，奖一律封号金币清零处理；</li>
        <li>5、活动中有任何疑问可咨询此<span>QQ号：3231689370</span></li>
      </ul>
    </div>
    <div class="mask" @touchmove.prevent v-if="isShowPop">
      <div class="how">
        <div class="pop">
          <img class="close" @click="close" src="~@/assets/img/wheel/close.png" alt />
          <ul class="task">
            <li v-for="(v, i) in task" :key="i">
              <h5>邀请{{ v.lv }}人</h5>
              <span>+{{ v.lv * 3 }}</span>
              <button :class="{ disable: v.status == 1, receive: v.status == 2 }">{{ btnStatus[v.status] }}</button>
            </li>
          </ul>
          <h4>如何获得更多抽奖机会</h4>
          <ul class="explain">
            <li>1、邀请的好友成功激活1人+3次</li>
            <li>2、邀请的好友成功激活5人+15次</li>
            <li>3、邀请的好友成功激活30人+90次</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="mask" @touchmove.prevent v-if="isShowReward">
      <div class="sub">
        <div class="title"></div>
        <div class="light">
          <img src="~@/assets/img/wheel/light.png" alt />
          <img src="~@/assets/img/wheel/bubble1.png" alt />
          <img src="~@/assets/img/wheel/bubble2.png" alt />
          <img src="~@/assets/img/wheel/close.png" alt />
        </div>
        <h5>获得奖励猪肉铺*2</h5>
        <p>添加客服QQ领取：36556555</p>
        <button @click="goon">继续游戏</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'wheel',
  data() {
    return {
      dataArr: [
        '您还有未激活的好友抽奖机会待领取哦！',
        '激活的好友数量越多额外获得的抽奖机会也会增加!',
        '您还有任务抽奖机会待领取哦！',
        '您还有未激活的好友抽奖机会待领取哦！',
        '激活的好友数量越多额外获得的抽奖机会也会增加!',
        '您还有任务抽奖机会待领取哦！'
      ],
      isStart: 1,
      score: 10, //消耗积分
      list: [
        { img: require('@/assets/img/wheel/1.png'), text: '少量猪币' },
        { img: require('@/assets/img/wheel/6.png'), text: '大量灵气' },
        { img: require('@/assets/img/wheel/2.png'), text: '中量猪币' },
        { img: require('@/assets/img/wheel/7.png'), text: '猪肉脯*1' },
        { img: require('@/assets/img/wheel/3.png'), text: '大量猪币' },
        { img: require('@/assets/img/wheel/10.png'), text: '谢谢参与' },
        { img: require('@/assets/img/wheel/8.png'), text: '现金红包' },
        { img: require('@/assets/img/wheel/4.png'), text: '少量灵气' },
        { img: require('@/assets/img/wheel/9.png'), text: '碎片*1' },
        { img: require('@/assets/img/wheel/5.png'), text: '大量灵气' },
        { img: require('@/assets/img/wheel/9.png'), text: '碎片*1' },
        { img: require('@/assets/img/wheel/8.png'), text: '现金红包' }
      ], //奖品1-9
      index: -1, // 当前转动到哪个位置，起点位置
      count: 12, // 总共有多少个位置
      timer: 0, // 每次转动定时器
      speed: 200, // 初始转动速度
      times: 0, // 转动次数
      cycle: 20, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
      prize: -1, // 中奖位置
      click: true,
      showToast: false, //显示中奖弹窗
      isShow: true,
      task: [
        { lv: 1, status: 1 },
        { lv: 5, status: 2 },
        { lv: 10, status: 0 },
        { lv: 30, status: 0 },
        { lv: 50, status: 0 }
      ],
      btnStatus: ['去领取', '已领取', '点击领取'],
      isShowPop: false,
      isShowReward: false
    }
  },
  mounted() {},
  methods: {
    startLottery() {
      if (!this.click) return
      this.startRoll()
      this.isShow = false
    },
    // 开始转动
    startRoll() {
      this.click = false
      this.times += 1 // 转动次数
      this.oneRoll() // 转动过程调用的每一次转动方法，这里是第一次调用初始化
      // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
      if (this.times > this.cycle + 10 && this.prize === this.index) {
        clearTimeout(this.timer) // 清除转动定时器，停止转动
        this.prize = -1
        this.times = 0
        this.speed = 200
        setTimeout(() => {
          this.click = this.isShowReward = true
        }, 500)
      } else {
        if (this.times < this.cycle) {
          this.speed -= 10 // 加快转动速度
        } else if (this.times === this.cycle) {
          const index = Math.floor(Math.random() * 12 + 1) // 随机获得一个中奖位置
          // console.log(index)
          this.prize = index //中奖位置,可由后台返回
          if (this.prize > 11) {
            this.prize = 11
          }
        } else if (
          this.times > this.cycle + 10 &&
          ((this.prize === 0 && this.index === 11) || this.prize === this.index + 1)
        ) {
          this.speed += 110
        } else {
          this.speed += 20
        }
        if (this.speed < 40) {
          this.speed = 40
        }
        this.timer = setTimeout(this.startRoll, this.speed)
      }
    },
    // 每一次转动
    oneRoll() {
      let index = this.index // 当前转动到哪个位置
      const count = this.count // 总共有多少个位置
      index += 1
      if (index > count - 1) {
        index = 0
      }
      this.index = index
    },
    play() {
      this.isShowPop = true
    },
    close() {
      this.isShowPop = false
    },
    goon() {
      this.isShowReward = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/style/reset.css';
@import '~@/style/wheel.less';
</style>
