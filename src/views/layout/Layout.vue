<template>
  <el-container class="app-container">
    <el-header height="50px">
      <Header></Header>
    </el-header>
    <el-container class="contains">
      <el-aside width="60px">
        <Aside></Aside>
      </el-aside>
      <el-main>
        <div class="main-container">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from '@/views/layout/Header'
import Aside from '@/views/layout/Aside'

export default {
  name: 'Layout',
  components: { Header, Aside }
}
</script>

<style lang="scss" scoped>
@import "src/styles/layout.scss";
.el-aside{
 background: #373737;
 border-right: 0;
 overflow: hidden;
}
.el-main{
  padding: 0;
}
.el-header{
  background: #ffffff;
  box-shadow: 0px 4px 4px #858585;
  margin-bottom: 10px;
}
.contains{
   overflow: scroll;
   margin-top: -3px;
}
 /*滚动条样式*/
.contains::-webkit-scrollbar {
    width: 0px;    
}
</style>