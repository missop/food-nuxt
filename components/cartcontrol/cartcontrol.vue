<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="move-box">
        <transition name="roll">
          <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop="decreaseCart"></div>
        </transition><span class="cart-count" v-show="food.count>0">{{food.count}}</span>
      </div>
    </transition>
    <div class="cart-add icon-add_circle" @click.stop="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    created() {
    },
    methods: {
      addCart() {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
//        子组件通过$emit触发父组件的increment方法
        this.$emit('increment', event.target);
      },
      decreaseCart() {
        if (!event._constructed) {
          return;
        }
        if (this.food.count > 0) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .move-box, .cart-add
      vertical-align: top
      display: inline-block
      line-height: 24px
      font-size: 24px
    .cart-decrease, .cart-count
      display: inline-block
      vertical-align: top
    .cart-count
      margin-top: 5px
      line-height: 24px
      font-size: 10px
      color: rbg(147, 153, 159)
    .cart-decrease, .cart-add
      padding: 6px
      color: #00A0DC
    .move-box
      &.move-enter-active, &.move-leave-active
        opacity: 0
        transition: all .4s linear
      &.move-enter, &.move-leave-to
        transform: translate3d(0, 0, 0)
</style>
