<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{current:currentIndex===index}"
            @click="selectMenu(index,$event)">
          <span class="text">
            <span class="icon" v-show="item.type>0" :class
              ="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="detail border-1px" @click="selectFood(food,$event)">
              <div class="pic">
                <img :src="food.image" width="57" height="57" alt="">
              </div>
              <div class="info">
                <h1 class="name">{{food.name}}</h1>
                <p class="description" v-show="food.description">{{food.description}}</p>
                <div class="data">
                  <span class="sellCount">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old"
                                                                v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" :select-foods="selectFoods" @increment="incrementTotal"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="
seller.minPrice" ref="shopCart"></shopcart>
    <food :food="selectedFood" ref="food" @add="incrementTotal"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from '../../components/shopcart/shopcart';
  import food from '../../components/food/food';
  import cartcontrol from '../../components/cartcontrol/cartcontrol';
  import api from '../../assets/javascript/data';

  export default {
    data() {
      return {
        seller:{}
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    created() {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
      this.seller=api.seller;
      this.goods = api.goods;
      
      // console.log(this.seller);
      
      this.$nextTick(() => {
        this._initScroll();
        this._calculateHeight();
      });
    },
    methods: {
      selectMenu(index, event) {
        if (!event._constructed) {
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
      },
      _initScroll() {
        // console.log(this.$refs.menuWrapper.children);
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
//        使菜单栏可以滚动
        this.menuScroll.hasVerticalScroll = true;
        this.menuScroll.maxScrollY = -54.4;
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
//            监听实时滚动的位置
          probeType: 3,
          click: true
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
//        先把第一项添加进去
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      incrementTotal(target) {
//          异步执行，更加平稳
        this.$nextTick(() => {
          this.$refs.shopCart.drop(target);
        });
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || this.scrollY >= height1 && this.scrollY < height2) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    components: {
      shopcart,
      food,
      cartcontrol
    }
  };
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin"
  .goods
    display: flex
    position: absolute
    top: 175px
    bottom: 48px
    overflow: hidden
    .menu-wrapper
      display: flex
      flex: 0 0 80px
      background: #f3f5f7
      .menu-item
        padding: 0 12px
        .text
          display: table-cell
          vertical-align: middle
          width: 56px
          height: 54px
          border-1px(rgba(7, 17, 27, .1))
          line-height: 14px
          font-size: 12px
        .icon
          display: inline-block
          margin-right: 4px
          vertical-align: top
          width: 12px
          height: 12px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
      .current
        position: relative
        margin-top: -1px
        z-index: 10
        background: #fff
        .text
          font-weight: 700
          border-none()
    .foods-wrapper
      flex: 1
      .title
        height: 26px
        border-left: 2px solid #d9dde1
        padding-left: 14px
        line-height: 26px
        font-size: 12px
        color: rgb(147, 153, 159)
        background-color: #f3f5f7
      .detail
        display: flex
        margin: 18px 18px 0 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, .1))
        &:last-child
          border-none()
        .pic
          flex: 0 0 57px
          margin-right: 10px
        .info
          flex: 1
          .name
            padding: 2px 0 8px 0
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .description
            padding-bottom: 8px
          .description, .data
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .data
            margin-bottom: 8px
            .sellCount
              margin-right: 12px
          .price
            font-weight: 700
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              font-size: 10px
              text-decoration: line-through
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 10px
</style>
