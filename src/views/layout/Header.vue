<template>
  <div class="header-container">
    <div class="head—left">
      <div class="head—title">
          <router-link to="/">
          <i class="el-icon-arrow-left"></i>
          小土天空
        </router-link>
          <i class="el-icon-setting"></i>
      </div>
        <div class="head-tab">
           <el-tabs v-model="activeName">
            <el-tab-pane label="任务" name="2"></el-tab-pane>
            <el-tab-pane label="云盘" name="file"></el-tab-pane>
            <!-- <el-tab-pane label="成员" name="3"></el-tab-pane> -->
          </el-tabs>
        </div>
    </div>
    <div class="head-right">
        <img src="../../assets/voice-icon.png">
        <img src="../../assets/remind.png">
        <img src="../../assets/LeavingMessage.png">
        <el-avatar :size="26" :src="require('@/assets/user.jpeg')"></el-avatar>
        张三
    </div>
    
  </div>
</template>

<script>
export default {
   data() {
      return {
        activeName: 'file'
      };
    },
    watch: {
    'activeName':function(val) {
        let urlStr = '/folder/' + val;
        this.$router.push(urlStr);
    },
    '$route' (to) {
      if(to.path == "/folder/speed" || to.path == "/folder/1") {
        this.activeName = 'file'
      } else if(to.path == "/folder/2" || to.path == "/folder/4") {
        this.activeName = '2'
      } else if(to.path == "/folder/3") {
        this.activeName = '3'
      }
    }
  },
  created() {
      if(this.$route.path == "/folder/speed" || this.$route.path == "/folder/1") {
        this.activeName = 'file'
      } else if(this.$route.path == "/folder/2" || this.$route.path == "/folder/4") {
        this.activeName = '2'
      } else if(this.$route.path == "/folder/3") {
        this.activeName = '3'
      }
  },
}
</script>
<style>
  .el-tabs .el-tabs__header{
    margin: 0;
  }
  .el-tabs__item.is-active {
    color: #FA5C0C;
  }
  .el-tabs__active-bar{
    background: #FA5C0C;
    height: 3px;
  }
  .el-tabs__item{
    color: #707070;
  }
</style>
<style lang="scss" scoped>
@import "src/styles/index.scss";
.header-container {
  width: 98%;
  margin: 0 auto;
  height: 100%;
  color: #373737;
    display: flex;
    justify-content: space-between;
    align-items: center;
  .head—left{
    display: flex;
      align-items: center;
     .head—title{
      display: flex;
      align-items: center;
      justify-content: space-between;
     border-right: 1px solid #373737;
     padding-right: 10px;
     }
    a {
      display: flex;
      align-items: center;
      color: #373737;
      font-size: 18px;
      font-weight: bolder;   
      padding-right: 20px; 
      i{
        padding-right: 10px;
        font-weight: bolder;
        font-size: 18px;
      }
    }
    i{
      font-size: 18px;
        padding-right: 10px;
    }
    .head-tab{
      padding-left: 30px;
      padding-bottom: 2px;
    }
  }
    .el-avatar {
      margin-left: auto;
      cursor: pointer;
      border: 1px solid #00A8FF;
      margin-right: 6px;
    }
    .head-right{
      display: flex;
      align-items: center;
      color: #707070;
      font-size: 14px;
      padding-right: 20px;
      img{
        width: 20px;
        cursor: pointer;
        margin-right: 24px;
        &:nth-child(2) {
          height: 20px;
        }
      }
      i{
        font-size: 20px;
        color: #2c2c2c;
        cursor: pointer;
        margin-right: 24px;
      }
      .el-icon-chat-dot-square{
        border-right: 1px solid #707070;
        padding-right: 24px;
      }
    }
}
</style>