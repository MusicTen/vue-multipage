<template>
  <div class="cancellation">
    <div :class="[ruleType > 0 ? 'pop pop1' : 'pop']">
      <img class="close" src="@/assets/img/51Day/cancelNameAuth.png" @click="close" alt />
      <div class="header"></div>
      <div class="content" v-if="ruleType === 0">
        <p>活动规则：</p>
        <p>1.用户在活动开放期间可自行选择报名方式，参与活动。</p>
        <p>2.活动内累计对局数，获取额外彩票等功能需在用户报名后方才生效开始计算。</p>
        <p>3.活动开放期间所有用户均可报名参与活动。</p>
        <p>4.每日活动截止时间当日24:00，当日奖项将于次日0:00后公布。</p>
        <p>5.用户获奖后可在奖项公布页面进入领取通道，领取时将由系统发放奖励至对应账户。</p>
        <p>6.所有奖项的中奖用户平分该奖项奖池，如余数不整除，余数不余发放。</p>
        <p>7.奖项说明</p>
        <p class="text-indent">一等奖 奖池总红包券的30%。</p>
        <p class="text-indent">二等奖 奖池总红包券的10%。</p>
        <p class="text-indent">三等奖 奖池总红包券的5%。</p>
        <p class="text-indent">四等奖 固定奖励为800红包券。</p>
        <p class="text-indent">五等奖 固定奖励为500红包券。</p>
        <p>8.获奖用户领奖时间为当日公布奖项后至次日公布奖项前，即次日0:00至次日23:59分。</p>
        <p>9.获奖用户逾期不领取奖励视为自动放弃。</p>
        <p>10.参与活动期间如全程托管的对局将不计算在对局数内。</p>
        <p>
          11.如因不可抗力或情势变更（包括但不限于重大自然灾害事件、政府主管部门指令停止举办活调整、活动遭受严重网络攻击或系统故障等）导致本活动无法继续举办，有权决定暂停或终止本活动；
        </p>
      </div>
      <div class="content" v-else-if="ruleType === 1">
        <p>活动规则：</p>
        <p>1.用户在活动开放期间可自行选择报名方式，参与活动。</p>
        <p>2.活动每日0：00开启报名。</p>
        <p>3.活动开放期间所有用户均可报名参与活动</p>
        <p>4.活动内累计对局数，需在用户报名后生效，未报名时对局不计数。</p>
        <p>5.每日活动截止时间23:00，奖项公分将于23:10后公布。</p>
        <p>6.23:10分后系统将会发放对应奖励至对应用户账户。</p>
        <p>7.参与活动期间如全程托管的对局将不计算在对局数内</p>
        <p>
          8.如因不可抗力或情势变更（包括但不限于重大自然灾害事件、政府主管部门指令停止举办活调整、活动遭受严重网络攻击或系统故障等）导致本活动无法继续举办，有权决定暂停或终止本活动；
        </p>
      </div>
      <div class="content" v-else>
        <p>活动规则：</p>
        <p>1.用户在活动开放期间登录游戏即可在对应页面进行签到获取奖励。</p>
        <p>2.获取奖励后，可通过观看视频使奖励翻10倍</p>
        <p>3.连续5天登录，在第五天时更将获得额外福袋</p>
        <p>
          4.如因不可抗力或情势变更（包括但不限于重大自然灾害事件、政府主管部门指令停止举办活调整、活动遭受严重网络攻击或系统故障等）导致本活动无法继续举办，有权决定暂停或终止本活动；
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: '',
      IDnum: ''
    }
  },
  props: {
    ruleType: Number
  },
  mounted() {},
  methods: {
    close() {
      this.$emit('update:isShowActivityRule', false)
    }
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
    height: 10.42rem;
    // background: #fffae0;
    border-radius: 0.3rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: url('~@/assets/img/51Day/bg_luckyRewardModal.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .header {
      height: 1.06rem;
      background-image: url('~@/assets/img/51Day/activityRuleTitle.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 5.7rem;
      /* margin: 0; */
      margin-left: 0.8rem;
      margin-top: -0.4rem;
    }
    .close {
      width: 0.95rem;
      height: 0.96rem;
      position: absolute;
      top: -0.34rem;
      right: 0.01rem;
    }
    .content {
      width: 6.13rem;
      height: 8.3rem;
      margin: 0.6rem auto 0;
      font-size: 0.22rem;
      font-weight: bold;
      color: #9b4900;
      overflow: auto;
      p {
        text-align: left;
        line-height: 0.26rem;
        text-align: justify;
      }
      .text-indent {
        text-indent: 0.22rem;
      }
    }
    button {
      width: 2.72rem;
      height: 1.17rem;
      font-size: 0.46rem;
      font-weight: bold;
      text-align: center;
      color: #fff;
      resize: none;
      outline: none;
      border: none;
      background: url('~@/assets/img/51Day/bg_close.png') no-repeat center center;
      background-size: 100% 100%;
      margin-top: 0.57rem;
      -webkit-text-stroke: 0.02rem #1757b7;
      text-stroke: 0.02rem #1757b7;
    }
  }
  .pop1 {
    height: 6.22rem;
    background-image: url('~@/assets/img/51Day/bg_modal.png');
    .content {
      height: 4.3rem;
      p {
        line-height: 0.3rem;
      }
    }
  }
}
</style>
