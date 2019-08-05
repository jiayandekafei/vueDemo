<template>
  <div> 
    <div class="register-wrapper"> 
      <div id="register">
        <p class="title">sign up</p>
        <el-form
          :model="ruleForm2"
          status-icon
          :rules="rules2"
          ref="ruleForm2"
          label-width="0"
          class="demo-ruleForm"
        >
          <el-form-item prop="username">
            <el-input v-model="ruleForm2.username" auto-complete="off" placeholder="please input username"></el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="please input password"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="please input confirm password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2')" style="width:100%;">sign up</el-button>
            <p class="login" @click="gotoLogin">already have account？login</p>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script> 

export default {
  name: "Register", 
  data() {
    
    // <!--验证密码-->
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("please input password"))
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback()
      }
    }
    // <!--二次验证密码-->
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("please input confirm password"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("the password does not match"));
      } else {
        callback();
      }
    };
    return {  
      ruleForm2: {
        username:"",
        pass: "",
        checkPass: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: 'change' }],
        checkPass: [{ validator: validatePass2, trigger: 'change' }]
      }
    }
  }, 
  methods: {

    submitForm(formName) {
      this.$api.login.login({
                           username:  _this.ruleForm2.username,
                           password:  _this.ruleForm2.password
                            }).then(res => {
                            console.log(res.data);
                            _this.$router.push('/login');
                            });
    },

    gotoLogin() {
      this.$router.push({
        path: "/login"
      });
    },

    checkMobile(str) {
      let re = /^1\d{10}$/
      if (re.test(str)) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.loading-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #aedff8;
  display: flex;
  align-items: center;
  justify-content: center;
}
.register-wrapper img {
  position: absolute;
  z-index: 1;
}
.register-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
#register {
  max-width: 340px;
  margin: 60px auto;
  background: #fff;
  padding: 20px 40px;
  border-radius: 10px;
  position: relative;
  z-index: 9;
}
.title {
  font-size: 26px;
  line-height: 50px;
  font-weight: bold;
  margin: 10px;
  text-align: center;
}
.el-form-item {
  text-align: center;
}
.login {
  margin-top: 10px;
  font-size: 14px;
  line-height: 22px;
  color: #1ab2ff;
  cursor: pointer;
  text-align: left;
  text-indent: 8px;
  width: 160px;
}
.login:hover {
  color: #2c2fd6;
}
.code >>> .el-form-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.code button {
  margin-left: 20px;
  width: 140px;
  text-align: center;
}
.el-button--primary:focus {
  background: #409EFF;
  border-color: #409EFF;
  color: #fff;
}
</style>