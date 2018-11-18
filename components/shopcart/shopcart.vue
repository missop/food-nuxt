<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
          </div>
          <div class="count" v-show="totalCount">{{totalCount}}</div>
        </div>
        <div class="total" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
        <div class="extra">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="right" :class="{'highlight':totalPrice>=minPrice}" @click.stop="pay(totalPrice)">{{payDesc}}</div>
    </div>
    <div class="ball-container">
      <div v-for="ball in balls">
        <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from '../../components/cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';

  export default {
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      };
    },
    methods: {
      drop(el) {
//          遍历balls并且将其show属性全部设置为true，同时
//        添加el属性，指向加号
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
//            判断bal的show是否为false
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
//              返回元素相对于视口偏移位置
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter(el, done) {
        /* eslint-disable no-unused-vars */
//        触发重绘html
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          // Vue为了知道过渡的完成，必须设置相应的事件监听器。
          el.addEventListener('transitionend', done);
        });
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      hideList() {
        this.fold = true;
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      pay(totalPrice) {
        alert(`总价为${totalPrice}`);
      }
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}起送`;
        }
        if (this.totalPrice > 0 && this.totalPrice < this.minPrice) {
          let extra = this.minPrice - this.totalPrice;
          return `￥还差${extra}起送`;
        }
        if (this.totalPrice >= this.minPrice) {
          return `去结算`;
        }
      },
      listShow() {
        if (!this.totalCount) {
//          如果没有点餐，那么返回false，遮罩不显示
          this.fold = true;
          return false;
        }
//        这里的fold是用来判断是否已经有数量了
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
//              如果没有绑定betterScroll
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
//                如果绑定了就刷新一下
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    components: {
      cartcontrol
    }
  };
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl"
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      z-index: 50
      .left
        flex: 1
        font-size: 0
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          vertical-align: top
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: rgba(255, 255, 255, 0.4)
            &.highlight
              background: #00A0DC
              .icon-shopping_cart
                color: #FFF
          .count
            position: absolute
            left: 32px
            bottom: 42px
            width: 24px
            height: 16px
            border-radius: 6px
            line-height: 16px
            text-align: center
            font-size: 9px
            font-weight: 700
            color: #fff
            background: #F01414
        .total
          display: inline-block
          margin: 12px 0;
          padding: 0 12px 0 0
          border-right: 1px solid rgba(255, 255, 255, .1)
          line-height: 24px
          font-size: 16px
          color: rgba(255, 255, 255, .4)
          &.highlight
            color: #FFF
        .extra
          display: inline-block
          vertical-align: top
          margin-top: 12px
          padding-left: 12px
          line-height: 24px
          font-size: 12px
          color: rgba(255, 255, 255, .4)
      .right
        flex: 0 0 105px
        width: 105px
        line-height: 48px
        text-align: center
        font-size: 12px
        color: #979A9C
        font-weight: 700
        background: #ccc
        &.highlight
          color: #fff
          background: #00b43c
    .ball-container
      z-index: 50
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(220, 0, 0)
          transition: all .4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all .5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        padding: 0 18px
        line-height: 40px
        background: #f3f5f7
        border-1px(rgba(7, 17, 27, .1))
        .title
          display: inline-block
          font-size: 14px
          font-weight: 200
          color: rgb(7, 17, 27)
        .empty
          display: inline-block
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        background: #fff
        font-size: 0
        overflow: hidden
        .food
          position: relative
          padding: 12px 0
          line-height: 24px
          border-1px(rgba(7, 17, 27, .1))
          .name
            display: inline-block
            vertical-align: top
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 9px
            vertical-align: top
            padding: 0 12px 0 18px
            span
              font-size: 10px
              font-weight: 700
              color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
            vertical-align: top
    .list-mask
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: 30
      opacity: 1
      backdrop-filter: blur(10px)
      background: rgba(7, 17, 27, .6)
      &.fade-enter-active, &.fade-leave-active
        transition: all .5s
      &.fade-enter, &.fade-leave-active
        opacity: 0
        background: rgba(7, 17, 27, .1)
</style>
