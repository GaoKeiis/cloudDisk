<template>
  <el-menu :default-active="navbarActive" class="navbar-menu" @select="navbarFn">
    <el-menu-item
      v-for="(item, ind) in navbar"
      :key="ind"
      :index="item.index"
      @click="linkToFileList(item.urlPath)"
      class="navbar-list"
    >
      <img :src="item.imgUrl">
      <p slot="title">{{ item.text }}</p>
    </el-menu-item>
  </el-menu>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'Aside',
  data () {
    return {
      navbarActive: '1',
      navbar: [{
        name: 'folder',
        index: '1',
        text:'文件',
        imgUrl: require("../../assets/folder.svg"),
        urlPath:'/folder/file'
      }, {
        name: 'speed',
        index: '2',
        text:'进度',
        imgUrl:require("../../assets/speed.png"),
        urlPath:'/folder/1'
      }]
    }
  },
  watch: {
    '$route' () {
      this.routerFn();
    }
  },
  mounted() {
    this.routerFn();
  },
  methods: {
    routerFn() {
      let currentPath = this.$router.currentRoute.path;
      if(currentPath == "/folder/file" || currentPath == "/folder/1" || currentPath == "/folder/file/record"){
           this.navbar = []
            this.navbar.push({
              name: 'folder',
              index: '1',
              text:'文件',
              imgUrl: require("../../assets/folder.svg"),
              urlPath:'/folder/file'
            }, {
              name: 'speed',
              index: '2',
              text:'进度',
              imgUrl:require("../../assets/speed.png"),
              urlPath:'/folder/1'
            })
            this.$nextTick(()=>{
              if(currentPath == "/folder/1") {
                $('.navbar-menu').find("li").eq(1).addClass('is-active').siblings().removeClass("is-active")
              } else {
                $('.navbar-menu').find("li").eq(0).addClass('is-active').siblings().removeClass("is-active")
              }
            })
        } else {
           this.navbar = []
          this.navbar.push({
              name: 'task',
              index: '1',
              text:'任务',
              imgUrl: require("../../assets/folder.svg"),
              urlPath:'/folder/2'
            }, {
              name: 'ganttchart',
              index: '2',
              text:'甘特图',
              imgUrl:require("../../assets/ganttchart.png"),
              urlPath:'/folder/4'
            }, {
              name: 'implement',
              index: '3',
              text:'执行',
              imgUrl:require("../../assets/implement.png"),
              urlPath:'/folder/5'
            })
            this.$nextTick(()=>{
              if(currentPath == "/folder/2") {
                $('.navbar-menu').find("li").eq(0).addClass('is-active').siblings().removeClass("is-active")
              } else if(currentPath == "/folder/4") {
                $('.navbar-menu').find("li").eq(1).addClass('is-active').siblings().removeClass("is-active")
              } else if(currentPath == "/folder/5") {
                $('.navbar-menu').find("li").eq(2).addClass('is-active').siblings().removeClass("is-active")
              }
            })
        }
    },
    linkToFileList(paths) {
      this.$router.push(paths)
    },
    navbarFn(index) {
       $('.navbar-menu').find("li").eq(index-1).addClass('is-active').siblings().removeClass("is-active");
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar-menu{
  border-right:0;
  .is-active{
    background: #fa5c0c;
    color: #ffffff;
    height: 60px;
    line-height: 33px;
    text-align: center;
    padding: 0px !important;
    p {
      padding-top: 10px;
      line-height: 0;
    }
   img {
     height: 20px;
   }
  }
}
.navbar-list {
  line-height: unset;
   background-color:#373737;
   color: #fff;
    height: 60px;
    line-height: 33px;
    text-align: center;
    padding: 0px !important;
    width: 100%;
    img {
      height: 20px;
    }
    p {
      padding-top: 10px;
      line-height: 0;
    }
}
</style>