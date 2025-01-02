<template>
  <div>
    <el-row :gutter="20" style="border-width: 1px; border-style: solid;border-color: rgba(215, 215, 215, 1);padding: 10px 2px;">
      <el-col :span="12">
        <el-form ref="ruleForm" :inline="false" :model="form" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="定位地址" prop="reportAddress">
                <el-input v-model="form.address" @input="addressInputChange"/>
                <el-popover
                    placement="bottom"
                    trigger="manual"
                    v-model="addressVisible">
                  <map-poi @selectPoi="selectPoi" :poi-list="poiList"></map-poi>
                </el-popover>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="12">
        <div  style="width: 100%;height: 700px;margin-top: 10px;">
          <amap-view ref="ampView" @createPointMark="getAddressByCoordinate" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AmapView from './component/map.vue'
import { getAddressByPoint, searchPOI } from './component/amapApi'
import MapPoi from './component/mapPoi.vue'
export default {
  name: 'example',
  components: {
    MapPoi,
    AmapView,
  },
  data() {
    return {
      dialogVisible: false,
      addressVisible: false,
      debounceFunc: null,
      form: {
        geoX: null,
        geoY: null,
        address: null
      },
      rules: {
      },
      poiList: [],
    }
  },
  methods: {
    /**
     * 选择一个关键字查询出来的位置，地图定位位置并标点
     * @param point
     */
    selectPoi(point) {
      if(point){
        this.$refs.ampView.flyTo(point.split(","))
        this.getAddressByCoordinate(point.split(","))
      }
    },
    /**
     * 逆地址解析
     * @param point
     */
    getAddressByCoordinate(point = []) {
      if(point.length < 2){
        return
      }
      this.addressVisible = false
      this.form.geoX = point[0]
      this.form.geoY = point[1]
      getAddressByPoint(point).then((res) => {
        this.form.address = res.data
      })
    },
    /**
     * 手动输入地址触发关键字查询
     */
    addressInputChange() {

      if(!this.debounceFunc) {
        this.getDebounce(this.getPoi)
      }
      this.debounceFunc()

    },
    /**
     * 关键字查询
     */
    getPoi() {
      searchPOI(this.form.address).then((res) => {
        this.addressVisible = true
        this.poiList = res.data
      })
    },
    /**
     * 防抖
     * @param func
     * @param delay
     */
    getDebounce(func,delay = 1000) {
      function debounce(func, delay) {
        let timer = null;
        return function () {
          clearTimeout(timer);
          timer = setTimeout(() => {
            func.apply(this, arguments);
          }, delay);
        };
      }
      this.debounceFunc = debounce(func, delay);
    }
  }
}
</script>

<style scoped lang="scss">
</style>
