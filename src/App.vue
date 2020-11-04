<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import "./styles/common.css";
* {
  margin: 0px;
  padding: 0px;
}
html, body, #app {
  width: 100%;
  height: 100%;
}
#app{
  overflow: hidden;
}
html .el-textarea__inner{
      resize: none;
}
</style>
