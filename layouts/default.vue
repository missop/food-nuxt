<template>
<div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-items">
        <nuxt-link to="/goods" activeClass="active">商品</nuxt-link>
      </div>
      <div class="tab-items">
        <nuxt-link to="/ratings" activeClass="active">评价</nuxt-link>
      </div>
      <div class="tab-items">
        <nuxt-link to="/seller" activeClass="active">商家</nuxt-link>
      </div>
    </div>
    <nuxt/>
</div>
</template>

<script>
import VHeader from "../components/header/header";
import api from "../assets/javascript/data";
export default {
  data() {
    return {
      seller: {}
    };
  },
  created() {
    this.seller=api.seller;
  },
  components: {
    VHeader
  }
};
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
@import '../assets/stylus/mixin';

.tab {
  display: flex;
  z-index: 10;
  width: 100%;
  height: 41px;
  line-height: 40px;
  text-align: center;
  border-1px(rgba(7, 17, 27, 0.1));

  .tab-items {
    display: inline-block;
    flex: 1;

    a {
      &.active {
        color: rgb(240, 20, 20);
      }
    }
  }
}
</style>
