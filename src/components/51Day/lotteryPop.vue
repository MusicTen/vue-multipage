<template>
  <div class="pop" @touchmove.prevent @click="close">
    <div class="content" @click.stop>
      <img class="popTitle" src="../../assets/img/51Day/pop_title.png" alt />
      <div class="pannel winning" v-if="isShowLv1">
        <img class="title" src="../../assets/img/51Day/title1.png" alt />
        <div class="poker">
          <img v-for="v in yesterday.reward" :key="v" :src="require(`../../assets/img/poker/${v}.png`)" alt />
        </div>
      </div>
      <div class="pannel mine" v-if="isShowMine">
        <img class="title" src="../../assets/img/51Day/title2.png" alt />
        <ul class="poker">
          <li v-for="(v, i) in list" :class="['items', 'lv' + v.lv]" :key="i">
            <img v-for="item in v.card" :key="item" :src="require(`../../assets/img/poker/${item}.png`)" alt />
          </li>
          <li v-if="list.length == 3" class="items"></li>
          <li v-if="list.length == 0" class="nodata"><img src="../../assets/img/51Day/noRecordBg.png" alt /></li>
        </ul>
      </div>
      <div class="pannel rule" v-if="isShowLv1 && !isShowMine">
        <img class="title" src="../../assets/img/51Day/title3.png" alt />
        <ul>
          <li>
            <span>二等奖：</span>5张花色，顺序，数字与一等奖同样的牌<br />
            6张花色，数字与一等奖同样的牌<br />
            6张顺序，数字与一等奖同样的牌<br />
            6张花色，顺序与一等奖同样的牌
          </li>
          <li>
            <span>三等奖：</span>4张花色，顺序，数字与一等奖同样的牌<br />
            5张花色，数字与一等奖同样的牌<br />
            5张顺序，数字与一等奖同样的牌<br />
            5张花色，顺序与一等奖同样的牌
          </li>
          <li>
            <span>四等奖：</span>3张花色，顺序，数字与一等奖同样的牌<br />
            4张花色，数字与一等奖同样的牌<br />
            4张顺序，数字与一等奖同样的牌<br />
            4张花色，顺序与一等奖同样的牌
          </li>
          <li>
            <span>五等奖：</span>2张花色，顺序，数字与一等奖同样的牌<br />
            3张花色，数字与一等奖同样的牌<br />
            3张顺序，数字与一等奖同样的牌<br />
            3张花色，顺序与一等奖同样的牌
          </li>
        </ul>
      </div>
      <div class="tips" v-if="!isShowLv1 && isShowMine">
        <span>当日对局数：{{ today.num }}</span
        ><span>还可额外获得彩票数：{{ today.surplus }}</span>
      </div>
      <ul class="btns" v-if="isShowLv1 && isShowMine">
        <li v-for="v in 2" :key="v" @click="handleBtn(v)"></li>
      </ul>
      <img
        class="receive"
        v-if="isShowLv1 && !isShowMine && yesterday.has_reward && !yesterday.received"
        @click="receive"
        src="../../assets/img/51Day/btn1.png"
        alt
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'lotteryPop',
  data() {
    return {
      isShowLv1: 1,
      isShowMine: 1,
      today: {
        status: 1, //是否报名
        list: [
          //今日或者昨日彩票信息
          {
            card: ['36', '2', '38', '17', '46', '11'],
            lv: 0
          },
          {
            card: ['6', '22', '8', '7', '4', '1'],
            lv: 0
          },
          {
            card: ['37', '3', '31', '19', '6', '10'],
            lv: 0
          }
        ],
        reward: [], // 今日或者昨日彩票一等奖
        has_reward: 0, //今日或者昨日是否获奖
        received: 0, //今日或者昨日奖励是否已领取
        num: 10, //当日报名之后游玩次数
        surplus: 0 //当日还可获得彩票数
      },
      yesterday: {
        status: 1,
        list: [
          {
            card: ['33', '51', '20', '38', '26', '8'],
            lv: 0
          },
          {
            card: ['13', '21', '10', '1', '23', '3'],
            lv: 1
          },
          {
            card: ['13', '11', '10', '31', '23', '8'],
            lv: 3
          },
          {
            card: ['1', '41', '16', '21', '24', '18'],
            lv: 0
          },
          {
            card: ['1', '41', '16', '21', '25', '18'],
            lv: 0
          }
        ],
        reward: ['13', '21', '10', '1', '23', '3'],
        has_reward: 0,
        received: 0
      }
    }
  },
  computed: {
    list() {
      return this.isShowLv1 ? this.yesterday.list : this.today.list
    }
  },
  created() {},
  methods: {
    close() {
      this.$emit('update:isShowLotteryPop', false)
    },
    handleBtn(i) {
      if (i === 1) {
        this.isShowLv1 = 0
        this.isShowMine = 1
      } else {
        this.isShowLv1 = 1
        this.isShowMine = 0
      }
    },
    receive() {
      this.$emit('ShowRewardRes')
    }
  }
}
</script>

<style lang="less" scoped>
.pop {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
  background-color: rgba(0, 0, 0, 0.7);
  .content {
    width: 7.44rem;
    height: 10.41rem;
    background: url('~@/assets/img/51Day/bg_pop.png') no-repeat left center;
    background-size: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .popTitle {
      width: 6.3rem;
      height: 1.06rem;
      position: relative;
      top: -0.3rem;
    }
    .close {
      width: 0.95rem;
      height: 0.96rem;
      position: absolute;
      top: -0.3rem;
      right: 0;
    }
    .pannel {
      width: 6.26rem;
      margin: 0 auto;
      background-color: #edd2ab;
      border: 0.04rem solid #f6ab3d;
      border-radius: 0.2rem;
      box-sizing: border-box;
      text-align: center;
      position: relative;
      .title {
        width: 5.21rem;
        height: 0.7rem;
        position: absolute;
        top: -0.35rem;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .winning {
      height: 1.83rem;
      margin-top: 0.1rem;
      margin-bottom: 0.55rem;
      padding: 0.5rem 0.3rem 0;
      .poker {
        display: flex;
        justify-content: space-around;
        img {
          width: 0.83rem;
          height: 1.07rem;
        }
      }
    }
    .mine {
      height: 6.03rem;
      padding-top: 0.5rem;
      margin-top: 0.1rem;
      .poker {
        width: 100%;
        height: 5.3rem;
        overflow: auto;
        list-style: none;
        &::-webkit-scrollbar {
          display: none;
        }
        .nodata {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-10%, -50%);
          &::before {
            content: '暂时还没有记录噢';
            font-size: 0.22rem;
            font-weight: bold;
            color: #9f3700;
            position: absolute;
            top: 0.3rem;
            left: -1.4rem;
          }
          img {
            width: 1.84rem;
            height: 2.14rem;
          }
        }
        .items {
          float: left;
          width: 50%;
          height: 1.4rem;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          img {
            width: 0.83rem;
            height: 1.07rem;
            margin-left: -0.5rem;
            &:nth-child(1) {
              margin-left: 0;
            }
          }
          &:nth-child(3),
          &:nth-child(4),
          &:nth-child(7),
          &:nth-child(8) {
            background-color: #efdaa7;
            border-bottom: 0.03rem solid #debb84;
          }
        }
        .lv1::after,
        .lv2::after,
        .lv3::after,
        .lv4::after,
        .lv5::after {
          content: '';
          width: 3.2rem;
          height: 1.38rem;
          background: url('~@/assets/img/51Day/lv1.png') no-repeat center bottom,
            url('~@/assets/img/51Day/border.png') no-repeat center;
          background-size: 1.68rem 0.58rem, 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .lv2::after {
          background: url('~@/assets/img/51Day/lv2.png') no-repeat center bottom,
            url('~@/assets/img/51Day/border.png') no-repeat center;
          background-size: 1.68rem 0.58rem, 100%;
        }
        .lv3::after {
          background: url('~@/assets/img/51Day/lv3.png') no-repeat center bottom,
            url('~@/assets/img/51Day/border.png') no-repeat center;
          background-size: 1.68rem 0.58rem, 100%;
        }
        .lv4::after {
          background: url('~@/assets/img/51Day/lv4.png') no-repeat center bottom,
            url('~@/assets/img/51Day/border.png') no-repeat center;
          background-size: 1.68rem 0.58rem, 100%;
        }
        .lv5::after {
          background: url('~@/assets/img/51Day/lv5.png') no-repeat center bottom,
            url('~@/assets/img/51Day/border.png') no-repeat center;
          background-size: 1.68rem 0.58rem, 100%;
        }
      }
    }
    .rule {
      height: 6.03rem;
      padding-top: 0.5rem;
      padding-left: 0.5rem;
      text-align: left;
      .title {
        width: 5.21rem;
        height: 0.7rem;
        position: absolute;
        top: -0.35rem;
        left: 50%;
        transform: translateX(-50%);
      }
      ul {
        padding-left: 1rem;
        li {
          font-size: 0.22rem;
          font-weight: bold;
          color: #9b4900;
          line-height: 0.3rem;
          text-indent: -4.4em;
          margin-bottom: 0.2rem;
          span {
            font-size: 0.24rem;
          }
        }
      }
    }
    .tips {
      width: 6.62rem;
      height: 0.72rem;
      line-height: 0.72rem;
      background-image: url('~@/assets/img/51Day/bg_myRank.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      // position: absolute;
      // bottom: 0.5rem;
      // left: 50%;
      // transform: translateX(-50%);
      margin: 0.9rem auto 0;
      box-sizing: border-box;
      padding: 0 0.35rem;
      font-size: 0.3rem;
      font-weight: bold;
      color: #cf271c;
      display: flex;
      justify-content: space-between;
    }
    .btns {
      width: 100%;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-around;
      position: absolute;
      bottom: 0;
      li {
        width: 2.72rem;
        height: 1.17rem;
        background: url('~@/assets/img/51Day/btn2.png') no-repeat center;
        background-size: 100%;
      }
      li:last-child {
        background-image: url('~@/assets/img/51Day/btn3.png');
      }
    }
    .receive {
      width: 2.73rem;
      height: 1.17rem;
      position: absolute;
      bottom: -0.2rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
