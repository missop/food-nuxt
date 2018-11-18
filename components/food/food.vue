<template>
  <transition name="move">
    <div class="food-content" v-show="showFlag" ref="foodContent">
      <div>
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back">
            <i class="icon-arrow_lift" @click="hide"></i>
          </div>
        </div>
        <div class="content">
          <div class="detail">
            <h1 class="title">{{food.name}}</h1>
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
            <div class="price">
              <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food" v-show="food.count"></cartcontrol>
            </div>
            <transition name="fade">
              <!--使用.stop.prevent阻止冒泡事件和默认事件，避免穿透-->
              <!--这个购物车按钮只有在商品数量为0时才显示-->
              <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count===0">
                <span>加入购物车</span>
              </div>
            </transition>
          </div>
          <split></split>
          <div class="info">
            <h1 class="title">商品介绍</h1>
            <p>{{food.info}}</p>
          </div>
          <split></split>
          <div class="ratings">
            <div class="ratingselect-wrapper">
              <h1 class="title">商品评价</h1>
              <ratingselect :select-type="selectType" :only-content="onlyContent"
                            :desc="desc" :ratings="food.ratings"
                            @select="selectRating" @toggle="toggleContent"></ratingselect>
            </div>
            <div class="ratings-content">
              <ul v-show="food.ratings && food.ratings.length">
                <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
                  <span class="time">{{rating.rateTime | formatDate}}</span>
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img :src="rating.avatar" alt="" width="12" height="12">
                  </div>
                  <div class="content">
                    <i :class="{'icon-thumb_down':rating.rateType===1,'icon-thumb_up'
                    :rating.rateType===0}"></i>
                    <span>{{rating.text}}</span>
                  </div>
                </li>
              </ul>
              <div v-show="!food.ratings || !food.ratings.length" class="no-rating">暂无评价</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import cartcontrol from '../../components/cartcontrol/cartcontrol';
  import split from '../../components/split/split';
  import ratingselect from '../../components/ratingselect/ratingselect';
  import {formatDate} from '../../assets/javascript/date';

  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
//        这里声明几个在ratingselect组件中需要的数据
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      show() {
//          设置默认值
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = true;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodContent, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      needShow(type, text) {
//          如果只显示内容又没有文字则过滤掉
        if (this.onlyContent && !text) {
          return false;
        }
//        如果不需要显示内容或者有文字的话则全部显示
        if (this.selectType === ALL) {
          return true;
        } else {
//            最后则过滤掉和点击的type不同的评价
          return type === this.selectType;
        }
      },
      selectRating(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggleContent(content) {
        this.onlyContent = content;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      addFirst(event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('add', event.target);
        Vue.set(this.food, 'count', 1);
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl"
  .food-content
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    &.move-enter-active, &.move-leave-active
      transition: all .2s linear
      transform: translate3d(0, 0, 0)
    &.move-enter, &.move-leave-to
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff
    .content
      .detail
        padding: 18px
        line-height: 10px
        font-size: 10px
        color: rgb(147, 153, 159)
        .title
          margin-bottom: 8px
          line-height: 14px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .sell-count
          margin-right: 12px
        .price
          padding: 18px 0 0 0
          .now
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .old
            line-height: 24px
            font-size: 10px
            color: rgb(77, 85, 93)
            text-decoration: line-through
        .cartcontrol-wrapper
          float: right
          margin-top: -30px
        .buy
          float: right
          margin-top: -26px
          padding: 6px 12px
          border-radius: 12px
          background: rgb(0, 160, 220)
          span
            line-height: 12px
            font-size: 10px
            color: rgb(255, 255, 255)
      .gap
        height: 16px
        border-top: 1px solid rgba(7, 17, 27, .1)
        border-bottom: 1px solid rgba(7, 17, 27, .1)
        background: #f3f5f7
      .info
        padding: 18px
        p
          padding: 6px 8px 0 8px
          line-height: 24px
          font-size: 12px
          font-weight: 200
          color: rgb(77, 85, 93)
      .ratings
        .ratingselect-wrapper
          padding: 18px 18px 0 18px
          border-1px(rgba(7, 17, 27, .1))
          .title
            padding-bottom: 18px
          .only
            padding: 12px 0
            line-height: 24px
            color: rgb(147, 153, 159)
            .icon-check_circle
              display: inline-block
              vertical-align: top
              margin-right: 4px
              font-size: 24px
            span
              display: inline-block
              font-size: 12px
        .ratings-content
          padding: 0 18px
          .rating-item
            position: relative
            padding: 16px 0
            border-1px(rgba(7, 17, 27, .1))
            .time
              display: inline-block
              padding-bottom: 6px
              line-height: 12px
              font-size: 10px
              color: rgb(7, 17, 27)
            .user
              position: absolute
              right: 0
              top: 19px
              font-size: 0
              .name
                display: inline-block
                vertical-align: top
                line-height: 12px
                font-size: 10px
                color: rgb(147, 153, 159)
              img
                border-radius: 50%
                margin-left: 6px
            .content
              font-size: 0
              .icon-thumb_down, .icon-thumb_up
                margin-right: 4px
                line-height: 16px
                font-size: 12px
              .icon-thumb_down
                color: rgb(147, 154, 159)
              .icon-thumb_up
                color: rgb(0, 160, 220)
              span
                line-height: 16px
                font-size: 12px
                color: rgb(7, 17, 27)
          .no-rating
            padding: 16px 0
            font-size: 12px
            color: rgb(147, 153, 159)
</style>
