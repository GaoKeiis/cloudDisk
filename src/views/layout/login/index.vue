<template>
  <div class="file-sign">
    <div class="sign-cont">
      <div class="sign-logo">
        <img src="../../../assets/logo.png">
      </div>
      <div class="sign-verification">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="手机号 / 登录名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" placeholder="输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { postAction } from '../../../apis/file'
export default {
  name: 'Sign',
  data() {
    return {
      ruleForm: {
          phone: '',
          password:''
        },
        rules: {
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
    }
  },
  watch: {
    
  },
  mounted(){
    //绑定事件
     window.addEventListener('keydown',this.keyDown);
  },
  methods: {
    keyDown(e){
        //如果是回车则执行登录方法
      if(e.keyCode == 13){
        this.submitForm("ruleForm");
      }
    },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 17346578001 123456
      // http://192.168.10.48 本地
      // http://123.57.102.27:8999 线上
            postAction(
              `http://123.57.102.27:8999/api-auth/oauth/token?grant_type=password&username=${this.ruleForm.phone}&password=${this.ruleForm.password}&scope=all&client_id=${localStorage.getItem('client_id')}&client_secret=${localStorage.getItem('client_secret')}`
            ).then((res)=> {
              if(res.data.code == 200) {
                let token = res.data.data.token_type+' '+ res.data.data.access_token
                this.$cookies.set("token",token,"1d","/");
                this.$cookies.set("refreshToken",res.data.data.refresh_token,"30d","/");
                localStorage.setItem('headTitle',res.data.data.ext_2);
                this.$router.replace({
                  path: '/folder/file'
                })
              } else {
                this.$message.error(res.data.message)
              }
            })
          } else {
            return false;
          }
        });
      }
  }
}
</script>

<style lang="scss" scoped>
.file-sign{
  background: transparent linear-gradient(116deg, #F99FFF 0%, #00A287 100%) 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .sign-cont{
    background: #FFFFFF;
    box-shadow: 0px 3px 6px #00000029;
    width: 24%;
    padding: 60px 0;
    min-width: 420px;
  }
}
.sign-logo{
  display: flex;
  justify-content: center;
  padding-bottom: 60px;
  img {
    height: 70px;
  }
}
.sign-verification{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<style>
 .sign-verification .el-input__inner {
   border: 0;
   border-bottom: 1px solid #DCDFE6;
   border-radius: 0;
   padding: 0;
 }
 .sign-verification .demo-ruleForm{
   width: 60%;
 }
 .sign-verification .el-button--primary {
   width: 100%;
   background: #FA5C0C;
   box-shadow: 0px 5px 20px #FA5C0C80;
   border-radius: 4px;
   border-color: #FA5C0C;
   margin-top: 20px;
 }
</style>