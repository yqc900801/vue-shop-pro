<template>
    <div id="login-container">
      <div id="login-box">
        <div id="login-logo">
          <img src="../assets/img/logo.png" alt="">
        </div>

        <el-form ref="loginFormRef" :model="loginForm">
          <el-form-item>
            <el-input v-model="loginForm.username">
              <i slot="prefix" class="iconfont icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="loginForm.password">
              <i slot="prefix" class="iconfont icon-3702mima"></i>
            </el-input>
          </el-form-item>

          <el-row>
            <el-col :offset="15">
              <el-button type="primary">登录</el-button>
              <el-button type="info">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
</template>

<script>
export default {
data() {
  return {
    loginForm:{
      username:'',
      password:''
    }
  }
},
}
</script>

<style lang="less" scoped>
#login-container{
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login-box{
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    #login-logo {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .el-form{
      width: 100%;
      position: absolute;
      bottom: 0;
      padding: 20px;
      box-sizing: border-box
    }
  }
}
</style>
