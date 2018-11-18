<template>
  <div class="rating-select">
    <div class="rating-type">
      <span @click="select(2,$event)" class="all" :class="{'active':selectType===2}">{{desc.all}}<span
        class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="positive" :class="{'active':selectType===0}">{{desc.positive}}<span
        class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="negative" :class="{'active':selectType===1}">{{desc.negative}}<span
        class="count">{{negatives.length}}</span></span>
    </div>
    <div @click="toggleContent" class="rating-choice" :class="{'on':onlyContent}">
      <i class="icon-check_circle"></i>
      <span>只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    data() {
      return {
        mySelectType: this.selectType,
        myOnlyContent: this.onlyContent
      };
    },
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    watch: {
      selectType(val) {
        this.mySelectType = val;
      },
      onlyContent(val) {
        this.myOnlyContent = val;
      }
    },
    methods: {
      select(type, event) {
        if (!event._constructed) {
          return;
        }
        this.mySelectType = type;
        this.$emit('select', type);
      },
      toggleContent(event) {
        if (!event._constructed) {
          return;
        }
        this.myOnlyContent = !this.onlyContent;
        this.$emit('toggle', this.myOnlyContent);
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    }
  };
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl"
  .rating-select
    .rating-type
      width: 100%
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, .1))
      font-size: 0
      .all, .positive, .negative
        display: inline-block
        padding: 8px 12px
        border-radius: 1px
        margin-right: 8px
        font-size: 12px
        .count
          margin-left: 5px
          font-size: 8px
        &.active
          color: rgb(255, 255, 255)
      .all, .positive
        background: rgba(0, 160, 220, .2)
        &.active
          background: rgb(0, 160, 220)
      .negative
        background: rgba(77, 85, 93, .2)
        &.active
          background: rgb(77, 85, 93)
    .rating-choice
      padding: 12px 0
      line-height: 24px
      font-size: 0
      color: rgb(147, 153, 159)
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      span
        display: inline-block
        vertical-align: top
        font-size: 12px
</style>
