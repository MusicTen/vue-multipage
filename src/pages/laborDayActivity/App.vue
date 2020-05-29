<template>
  <div class="laborDayActivity">
    <div class="laborDayActivityTitle"></div>
    <div v-if="showBm === false">
      <section
        :class="{ list: true, isSginedUp: v.status == 1 }"
        v-for="(v, i) in gameList"
        :key="i"
        @click="goDetail(v, i)"
      >
        <p class="time">{{ v.bm_time_str }}</p>
        <p class="time">{{ v.reward_time_str }}</p>
        <div class="tips">
          <p v-if="i == 0 || i == 1">
            报名人数: {{ (i == 0 ? v.lottery51_info.register : v.workers_info.total) | filterNum }}
          </p>
          <p v-if="i == 0">奖池累计: {{ (v.lottery51_info.total / 0.3) | filterNum }}</p>
          <p v-if="i == 2">
            参与人数:
            {{
              Date.now()
                .toString()
                .slice(2, 8)
            }}
          </p>
        </div>
        <img
          class="explain"
          @click.stop="explain(i)"
          :src="require(`../../assets/img/51Day/mark${i + 1}.png`)"
          alt=""
        />
      </section>
    </div>
    <div
      v-else
      :class="{
        signUp: signUpClass === true,
        second: secondClass === true,
        third: thirdClass === true
      }"
      @click="returnList()"
    >
      <div class="time">
        <p>{{ gameList[gameType].bm_time_str }}</p>
        <p>{{ gameList[gameType].reward_time_str }}</p>
      </div>
      <div class="tips">
        <p v-if="gameType == 0 || gameType == 1">
          报名人数:
          {{
            (gameType == 0 ? gameList[gameType].lottery51_info.register : gameList[gameType].workers_info.total)
              | filterNum
          }}
        </p>
        <p v-if="gameType == 0">奖池累计: {{ (gameList[gameType].lottery51_info.total / 0.3) | filterNum }}</p>
      </div>
      <img
        class="explain"
        @click.stop="explain(gameType)"
        :src="require(`../../assets/img/51Day/mark${gameType + 1}.png`)"
        alt=""
      />
      <div class="main" @click.stop="">
        <div class="bmTxt">已报名人数：{{ this.infoTxt1 | filterNum }}人</div>
        <div class="bmTxt">
          {{ this.gameType === 0 ? '一等奖已累计：' : '第一名获得：' }}{{ this.infoTxt2 | filterNum }}红包券
        </div>
        <div class="bmTxt">
          报名：
          <div class="selectBmType">
            <div>{{ bmType[0].t }}</div>
            <div :class="{ showOption: show === true }" @click.stop="bmTypeSelected(bmType[1].code)">
              {{ bmType[1].t }}
            </div>
            <div @click.stop="showOptionFu()" class="selectIcon"></div>
          </div>
        </div>
        <div class="bmBtn" @click.stop="bmEvent()" v-if="bmType[0].code === 2">
          <div class="videoIcon"></div>
          <div class="bmWordIcon"></div>
        </div>
        <div class="bmBtn" @click.stop="bmEvent()" v-else>
          <div class="bmWordIcon center"></div>
        </div>
      </div>
    </div>
    <lotteryPop v-if="isShowLotteryPop" :isShowLotteryPop.sync="isShowLotteryPop" @ShowRewardRes="ShowRewardRes" />
    <signInModal v-if="isSignInModal" :isSignInModal.sync="isSignInModal"></signInModal>
    <ActivityRule
      :ruleType="ruleType"
      v-if="isShowActivityRule"
      :isShowActivityRule.sync="isShowActivityRule"
    ></ActivityRule>
  </div>
</template>

<script>
import lotteryPop from '@/components/51Day/lotteryPop.vue'
import signInModal from '@/components/51Day/signInModal.vue'
import ActivityRule from '@/components/51Day/activityRule.vue'

export default {
  name: 'order',
  components: {
    lotteryPop,
    signInModal,
    ActivityRule
  },
  data() {
    return {
      gameList: [
        {
          status: -3,
          bm_time_str: '报名:0:00-24:00',
          reward_time_str: '开奖：24:00',
          lottery51_info: { register: 150, total: 150 }
        },
        {
          status: -4,
          bm_time_str: '报名:0:00-23:00',
          reward_time_str: '开奖：23:10',
          workers_info: { total: 150, first_reward: 150 }
        },
        { status: -4, bm_time_str: '活动时间：全天 ', reward_time_str: '' }
      ],
      infoTxt1: '',
      infoTxt2: '',
      signUpClass: true,
      secondClass: false,
      thirdClass: false,
      showBm: false,
      bmType: [
        {
          t: '500红包券',
          code: 1
        },
        {
          t: '看视频',
          code: 2
        }
      ],
      show: false,
      isShowLotteryPop: 0,
      isSignInModal: 0,
      isLuckyRewardModal: 0,
      isShowActivityRule: 0,
      lt: '',
      gameType: 0,
      ruleType: 0,
      type: 1,
      modalTxt: ''
    }
  },
  created() {},
  mounted() {},
  filters: {
    filterNum: value => {
      if (value >= 10000) {
        if (value / 10000 >= 10000) {
          value = (value / 100000000).toString()
          let index = value.indexOf('.')
          if (index !== -1) {
            value = value.substring(0, 1 + index + 1)
          } else {
            value = value.substring(0)
          }
          return parseFloat(parseFloat(value).toFixed(1)) + '亿'
        } else {
          value = (value / 10000).toString()
          let index = value.indexOf('.')
          if (index !== -1) {
            value = value.substring(0, 1 + index + 1)
          } else {
            value = value.substring(0)
          }
          return parseFloat(parseFloat(value).toFixed(1)) + '万'
        }
      } else {
        return value
      }
    }
  },
  methods: {
    bmEvent() {},
    goDetail(v, i) {
      if (v.status == -3) {
        this.isShowLotteryPop = 1
        return
      }
      this.gameType = i
      if (i === 0) {
        if (v.status === 1) {
          this.isShowLotteryPop = 1
        } else {
          this.showBm = true
          this.signUpClass = true
          this.infoTxt1 = v.lottery51_info.register
          this.infoTxt2 = v.lottery51_info.total
        }
      } else if (i === 1) {
        if (v.status !== 1) {
          this.showBm = true
          this.secondClass = true
          this.infoTxt1 = v.workers_info.total
          this.infoTxt2 = v.workers_info.first_reward
        }
      } else {
        this.isSignInModal = 1
      }
    },
    bmTypeSelected(c) {
      this.type = c
      this.bmType.reverse()
      this.showOptionFu()
    },
    returnList() {
      this.showBm = false
      this.signUpClass = true
      this.secondClass = false
      this.thirdClass = false
      this.show = false
    },
    showOptionFu() {
      this.show = !this.show
    },
    ShowRewardRes() {
      this.isShowLotteryPop = false
    },
    explain(i) {
      // console.log(i)
      this.ruleType = i
      this.isShowActivityRule = 1
    },
    goPlayZp() {}
  }
}
</script>

<style lang="less" scoped>
@import '../../style/reset.css';
@import '../../style/laborDayActivity.less';
</style>
