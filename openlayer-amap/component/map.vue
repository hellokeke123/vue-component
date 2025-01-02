<template>
  <div class="whole">
    <div class="map" id="map-box" ref="mapBox"></div>
  </div>
</template>

<script>
import 'ol/css';
import { fromLonLat, toLonLat } from 'ol/proj'
import Map from 'ol/Map';
import View from 'ol/View';
import {Tile as TileLayer} from 'ol/layer';
import {defaults as Defaults} from 'ol/control';
import XYZ from 'ol/source/XYZ';
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import * as Style from 'ol/style'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'


export default {
  name: 'amap-view',
  mounted() {
    this.$nextTick(() => {
      this.initMap()
    })
  },
  data(){
    return {
      map: null,
      markPointVectorLayer: null, // 图标图层
      projection: 'EPSG:900913',
    }
  },
  methods: {
    /** 初始化地图 */
    initMap() {
      let that = this
      this.map = new Map({
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
            }),
          })
        ],
        view: new View({
          center: fromLonLat([114.057939,22.543527]), //深圳
          zoom: 11, // 设置初始化时的地图缩放层级
          projection: that.projection, // 坐标系
          maxZoom: 18, // 最大缩放层级
          minZoom: 4, // 最小缩放层级
        }),
        target: 'map-box', // 地图的dom
        controls: new Defaults({
          // 清除地图上的控件
          attribution: false,
          rotate: false,
          zoom: false,
        })
      });

      // 创建一个矢量图层来放置标记
      this.markPointVectorLayer = new VectorLayer({
        source:  new VectorSource(),
      });

      // 将矢量图层添加到地图
      this.map.addLayer(this.markPointVectorLayer);

      this.addLayerClickEvent()
    },
    // 点击沈佳妮
    addLayerClickEvent() {
      let that = this
      // 监听地图点击事件
      this.map.on('click', (event) => {
           //
          that.drawPointMark(event.coordinate)
      });
    },

    // 画点
    drawPointMark(coordinate) {
      let that = this

      let src =  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAkCAYAAACTz/ouAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZjQ1ZmE0YS1iZDNhLTdlNGItYTY3NS0zMzEyNGI4ZmIzYzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkU3NzVFMzY2QTE3MTFFNDk0NzlCQzI0M0YzQTZBNTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkU3NzVFMzU2QTE3MTFFNDk0NzlCQzI0M0YzQTZBNTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjUwOWMyMDhmLWQ5NjktMzk0ZC04YWE1LWNiOWI5M2MwNzJhMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2ZjQ1ZmE0YS1iZDNhLTdlNGItYTY3NS0zMzEyNGI4ZmIzYzQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7pQPCKAAAEFElEQVR42rRW32tcRRSeM3e7bDabJaaSWn8kFEsNwZcq+LIiUhTEp4JgH1T8EwKCFPHFtz5UpaUvFnxSrKgEEaU0JjYBoRaEWoqISJUSKpUQQ9h22c3u3hm/M3Pu3bk3m+xG6Alf5t65c77vnDPnzl1trVX3EwUFIyLVz66NRbMY3gCeBR4FJoANYBW4Anz61N34t36+TO64+SIvAGImOw28ejAyuoLH+5RVEcYYfm1FqoHxTqwN1nwJvA2h20MJgPwlDJ+DeHxSWzXI1gyx0CYuT0Dk+7yAzkX+MoZvpkH+IMg5vH4SPGcEvI7X4/Jb+B/Lr9UB+RSGz6YLpjgmkVNAGCJ05HtePxWZIi7nhWe7AOzspDbjo4p3PyEjQVbAWEL05ELgtQaokFXszzzbBKD6JIbjE9qTYlPEkctkHUEKFqFk3ro02YcFJ3y4x4Uvk8Frac3JO2LvPKyMKhhTMXLZeMHenjBfIlCQ8YURWZQWGY4kVbZ8Tb50pCiz3dan4H1hJWICOpYXmIkkOrIkabuF7s/RWL8XxG+oa+tef5Fk6Qj9OJMXqIRReCbKXXvBZN5mciFXssCqeYFuLOKWpEG5HGRTDXkgIrYXtfWaiYAM7bzALcwcLki6pLKrs2+bTZNJRK0U1EUqfPkuurIlvR07KLn2ZUvuTXgftG4svowtL3o1LzDftBQ4gbxYdHWOJZ84BclRgbFaVWb/ZEas6QXm8yX6bsuqP5pKHSlKqWmrnbyrjsxXhNIWdoWp1/G/nhavDQHmYb5MBjgFOfO5us2WgevZpd6cewEB/6xXwmR93Uc/J3zZswiTlzCcaVgKygEiRNWRtuiAlNHNlMyj4cnfF56+hx3bSaR4tWWzmzgITfQrynOZ/Xc8riULDvQEOmG9o3qdsRvaDuq2fHDMrgIiwt/bNzmLWO0OLhUy5qBegd96vy9eod8kFl/Ekfthx6q3Itr5c8n709X63fdqL17Hp7Ao0ybA9gwS+7dUfgedcq27Q915vq31pVPPPP8xvr/lABXGjiVK7IOna6VfJg/OoRQtkwvLtyVt/PDY4yebUVTOCTgMFMAi/dXh2bX1kdEz/QT+roydWnlkupVEHKAEbA4UWFhY2DTGtM7PHv26o/VqSM73H80eXcHzSoAyUAduwbc1UIBtcXFxtV7Yt3Gz+sAnJOcP21/V8Qtt0qWgJHXgV6z/BzC7tmnelpaWbn5x6Il5dMuG9efR5oVDMz9KxG3gBq8BukO3ad7uRoUba6XyxQONxut3yqMr96KCxiatLi8v/z7IVw8jACLz5+jY+Qhfo5/2H1iM4/j6MOSZ35CDrFarFS9PjPyM8eFheR33sAJs56Yeem7Ytf9LQEqq9yJQ2EuZVPDLZi8R3Vf7T4ABAHOiBrvRKIKxAAAAAElFTkSuQmCC'
      // 设置标记的样式
      const markerStyle = new Style.Style({
        image: new Style.Icon({
          src: src,  // 设置标记图标
          scale: 1,  // 缩放图标
        }),
      });

      // 创建一个标记（Feature）
      const marker = new Feature({
        geometry: new Point(coordinate),  // 使用点击的坐标创建标记
      });

      // 设置标记的样式
      marker.setStyle(markerStyle);

      // 清除原来标记后，重新将标记添加到矢量图层
      that.clearPointMarkers()
      that.markPointVectorLayer.getSource().addFeature(marker);

      that.$emit("createPointMark",toLonLat(coordinate))
    },
    // 清除所有标记
    clearPointMarkers() {
      if (this.markPointVectorLayer) {
        this.markPointVectorLayer.getSource().clear();  // 清空矢量源中的所有标记
      }
    },
    flyTo(lnglat = [],zoom = 15) {
      console.log("flyTo",lnglat)
      let newCenter = fromLonLat(lnglat);
      console.log("flyTo=>newCenter",newCenter)
      // 使用 animate 方法平滑过渡
      this.map.getView().animate({
        center: newCenter,
        zoom: zoom,
        duration: 1000  // 动画时长，单位：毫秒
      });
      this.drawPointMark(newCenter)
    }
  },
}
</script>



<style scoped lang="scss">
.whole {
  width: 100%;
  height: 100%;
  a {
    color: #127bc7;
  }

  .map {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: rgb(154 186 216);
  }
}
</style>
