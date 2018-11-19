<template>
  <div class="ratingses" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.score}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.score}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :select-type="selectType" :only-content="onlyContent"
                    :desc="desc" :ratings="ratings" @select="selectRating"
                    @toggle="toggleContent"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item"
              v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28" alt="">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.
length">
                <i class="icon-thumb_up"></i>
                <span v-for="item in rating.recommend" class="item">{{item}}</span>
              </div>
              <span class="time">{{rating.rateTime | formatDate}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import star from "../../components/star/star";
import ratingselect from "../../components/ratingselect/ratingselect";
import split from "../../components/split/split";
import { formatDate } from "../../assets/javascript/date";
import api from "../../assets/javascript/data";

const ALL = 2;

export default {
  data() {
    return {
      seller: {}
    };
  },
  data() {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: "全部",
        positive: "满意",
        negative: "不满意"
      }
    };
  },
  methods: {
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
    }
  },
  created() {
    this.seller = api.seller;
    this.ratings = api.ratings;
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.ratings, {
        click: true
      });
    });
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  components: {
    star,
    ratingselect,
    split
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/mixin';

.ratingses {
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;

    .overview {
        display: flex;
        padding: 18px 0;

        .overview-left {
            flex: 0 0 137px;
            padding: 6px 0;
            width: 137px;
            border-right: 1px solid rgba(7, 17, 27, 0.1);
            text-align: center;

            @media (max-width: 320px) {
                flex: 0 0 120px;
                width: 120px;
            }

            .score {
                margin-bottom: 6px;
                line-height: 28px;
                font-size: 24px;
                color: rgb(255, 153, 0);
            }

            .title {
                margin-bottom: 8px;
                line-height: 12px;
                font-size: 12px;
                color: rgb(7, 17, 27);
            }

            .rank {
                line-height: 10px;
                font-size: 10px;
                color: rgb(147, 153, 159);
            }
        }

        .overview-right {
            flex: 1;
            padding: 6px 0 6px 24px;

            @media (max-width: 320px) {
                padding-left: 6px;
            }

            .score-wrapper {
                margin-bottom: 8px;
                font-size: 0;

                .title {
                    display: inline-block;
                    vertical-align: top;
                    margin: 2px 12px 0 0;
                    font-size: 12px;
                    color: rgb(7, 17, 27);
                }

                .star {
                    display: inline-block;
                    vertical-align: top;
                    margin-right: 12px;
                }

                .score {
                    display: inline-block;
                    vertical-align: top;
                    line-height: 18px;
                    font-size: 12px;
                    color: rgb(255, 153, 0);
                }
            }

            .delivery-wrapper {
                line-height: 18px;
                font-size: 0;

                .title {
                    display: inline-block;
                    margin-right: 12px;
                    font-size: 12px;
                    color: rgb(7, 17, 27);
                }

                .delivery {
                    display: inline-block;
                    font-size: 12px;
                    color: rgb(147, 153, 159);
                }
            }
        }
    }

    .rating-select {
        padding: 18px 18px 0 18px;
        border-1px(rgba(7, 17, 27, 0.1));
    }

    .rating-wrapper {
        padding: 0 18px;

        .rating-item {
            display: flex;
            padding: 18px 0;
            font-size: 0;
            border-1px(rgba(7, 17, 27, 0.1));

            .avatar {
                flex: 0 0 28px;

                img {
                    border-radius: 50%;
                }
            }

            .content {
                position: relative;
                flex: 1;
                margin-left: 12px;

                .name {
                    line-height: 12px;
                    font-size: 10px;
                    color: rgb(7, 17, 27);
                }

                .star-wrapper {
                    padding: 4px 0 6px 0;

                    .star {
                        display: inline-block;
                        vertical-align: top;
                        margin-right: 6px;
                    }

                    .delivery {
                        display: inline-block;
                        vertical-align: top;
                        line-height: 12px;
                        font-size: 10px;
                        font-weight: 200;
                        color: rgb(147, 153, 159);
                    }
                }

                .text {
                    line-height: 18px;
                    font-size: 12px;
                    color: rgb(7, 17, 27);
                    margin-bottom: 8px;
                }

                .recommend {
                    line-height: 16px;
                    font-size: 0;

                    .icon-thumb_up, .item {
                        display: inline-block;
                    }

                    .icon-thumb_up {
                        font-size: 12px;
                        color: rgb(0, 160, 220);
                    }

                    .item {
                        margin: 0 0 4px 8px;
                        padding: 0 6px;
                        border: 1px solid rgba(7, 17, 27, 0.1);
                        border-radius: 2px;
                        font-size: 9px;
                        color: rgb(147, 153, 159);
                        background-color: rgb(255, 255, 255);
                    }
                }

                .time {
                    position: absolute;
                    right: 0;
                    top: 0;
                    line-height: 12px;
                    font-size: 10px;
                    font-weight: 200;
                    color: rgb(147, 153, 159);
                }
            }
        }
    }
}
</style>
