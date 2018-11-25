<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="data-box">
          <li class="data">
            <h2 class="text">起送价</h2>
            <div class="num">
              {{seller.minPrice}}<span>元</span>
            </div>
          </li>
          <li class="data">
            <h2 class="text">商家配送</h2>
            <div class="num">
              {{seller.deliveryPrice}}<span>元</span>
            </div>
          </li>
          <li class="data">
            <h2 class="text">平均配送时间</h2>
            <div class="num">
              {{seller.deliveryTime}}<span>分钟</span>
            </div>
          </li>
        </ul>
        <div class="favorite">
          <i class="icon-favorite" @click="toggleFavorite"
             :class="{'active':favorite}"></i>
          <p>{{favoriteText}}</p>
        </div>
      </div>
      <split></split>
      <div class="activity">
        <div class="notice">
          <h1 class="title">公告与活动</h1>
          <p class="text">{{seller.bulletin}}</p>
        </div>
        <ul>
          <li v-for="support in seller.supports" class="support">
            <i :class="classMap[support.type]" class="icon"></i>
            <span>{{support.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pics-wrapper" ref="picsWrapper">
          <ul class="pic-list" ref="picList">
            <li v-for="pic in seller.pics" class="pic-item">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info-item" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import star from "../../components/star/star";
import split from "../../components/split/split";
import BScroll from "better-scroll";
import { saveToLocal, loadFromLocal } from "../../assets/javascript/store";
import api from "../../assets/javascript/data";

export default {
  data() {
    return {
      seller: api.seller,
      favorite: null
    };
  },
  computed: {
    favoriteText() {
      return this.favorite ? "已收藏" : "收藏";
    }
  },
  created() {
    // console.log(this.seller);
    this.favorite = (()=>{
      return loadFromLocal(this.seller.id, "favorite", false);
    })
    this.classMap = ["decrease", "discount", "guarantee", "invoice", "special"];
  },
  watch: {
    seller() {
      this.$nextTick(() => {
        this._initScroll();
        this._initPicScroll();
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll();
      this._initPicScroll();
    });
  },
  methods: {
    _initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        });
      } else {
        this.scroll.refresh();
      }
    },
    _initPicScroll() {
      if (!this.picScroll) {
        if (this.seller.pics) {
          let picWith = 120;
          let margin = 6;
          let width = (picWith + margin) * this.seller.pics.length - margin;
          this.$refs.picList.style.width = width + "px";
          this.picScroll = new BScroll(this.$refs.picsWrapper, {
            scrollX: true,
            eventPassthrough: "vertical"
          });
        }
      } else {
        this.picScroll.refresh();
      }
    },
    toggleFavorite() {
      if (this._constructed) {
        return;
      }
      this.favorite = !this.favorite;
      saveToLocal(this.seller.id, "favorite", this.favorite);
    }
  },
  components: {
    star,
    split
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/mixin.styl';

.seller {
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;

  .overview {
    position: relative;
    padding: 18px;

    .title {
      line-height: 14px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }

    .desc {
      padding: 8px 0 18px 0;
      border-1px(rgba(7, 17, 27, 0.1));
      font-size: 0;

      .star {
        display: inline-block;
        vertical-align: top;
        margin-right: 8px;
      }

      .text {
        display: inline-block;
        vertical-align: top;
        margin: -2px 12px 0 0;
        line-height: 18px;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }

    .data-box {
      display: flex;

      .data {
        flex: 1;
        margin-top: 18px;
        border-right: 1px solid rgba(7, 17, 27, 0.1);
        text-align: center;

        &:last-child {
          border-right: none;
        }

        .text {
          margin-bottom: 4px;
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .num {
          line-height: 24px;
          font-size: 24px;
          font-weight: normal;
          color: rgb(7, 17, 27);

          span {
            font-size: 10px;
          }
        }
      }
    }

    .favorite {
      position: absolute;
      top: 18px;
      right: 6px;
      width: 58px;
      text-align: center;

      .icon-favorite {
        display: block;
        line-height: 24px;
        font-size: 24px;
        color: #d4d6d9;

        &.active {
          color: rgb(240, 20, 20);
        }
      }

      p {
        margin-top: 4px;
        line-height: 10px;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }
  }

  .activity {
    padding-top: 18px;
    margin: 0 18px;

    .notice {
      .title {
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      .text {
        padding: 8px 12px 16px 12px;
        line-height: 24px;
        font-size: 12px;
        font-weight: 200;
        color: rgb(240, 20, 20);
      }
    }

    .support {
      border-top: 1px solid rgba(7, 17, 27, 0.1);
      padding: 16px 12px;
      font-size: 0;

      .icon {
        display: inline-block;
        vertical-align: top;
        margin-right: 6px;
        width: 16px;
        height: 16px;
        background-size: 16px 16px;

        &.decrease {
          bg-image('decrease_4');
        }

        &.discount {
          bg-image('discount_4');
        }

        &.guarantee {
          bg-image('guarantee_4');
        }

        &.invoice {
          bg-image('invoice_4');
        }

        &.special {
          bg-image('special_4');
        }
      }

      span {
        display: inline-block;
        vertical-align: top;
        line-height: 16px;
        font-size: 12px;
        font-weight: 200;
        color: rgb(7, 17, 27);
      }
    }
  }

  .pics {
    padding: 18px 0 18px 18px;

    .title {
      line-height: 14px;
      font-size: 14px;
      color: rgb(7, 17, 27);
      margin-bottom: 12px;
    }

    .pics-wrapper {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      font-size: 0;

      .pic-list {
        width: 200%;

        .pic-item {
          display: inline-block;
          margin-right: 6px;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }

  .info {
    padding: 18px 18px 0 18px;

    .title {
      line-height: 14px;
      font-size: 14px;
      color: rgb(7, 17, 27);
      padding-bottom: 12px;
      border-1px(rgba(7, 17, 27, 0.1));
    }

    .info-item {
      padding: 16px 12px;
      line-height: 16px;
      font-size: 12px;
      font-weight: 200;
      color: rgb(7, 17, 27);
      border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        border-none();
      }
    }
  }
}
</style>
