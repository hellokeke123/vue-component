<template>
  <section>
    <section class="poi-container" @click="selectPoi(item)" v-for="item in poiList">
      <section class="poi-name">{{item[paramMap.name]}}</section>
      <section  class="poi-value">{{item[paramMap.address]}}</section>
    </section>
  </section>
</template>

<script>
export default {
  name: 'mapPoi',
  props: {
    poiList: {
      type: Array,
      default: () => {
        return []
      }
    },
    paramMap: {
      type: Object,
      default: () => {
        return {
          name: 'name',
          address: 'address',
          location: 'location'
        }
      }
    }
  },
  methods: {
    selectPoi(item) {
      this.$emit("selectPoi",item[this.paramMap.location])
    },
  }
}
</script>

<style scoped lang="scss">
.poi-container{
  padding: 10px;
  border-bottom: 1px solid #dcdfe6;
  cursor: pointer;
  .poi-name {
    color: #3385ff;
    line-height: 22px;
  }
  .poi-value{

  }

}
</style>
