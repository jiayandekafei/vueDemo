<template>
    <div class="login-container">
        <el-form :model="ruleForm2" :rules="rules2"
         status-icon
         ref="ruleForm2" 
         label-position="left" 
         label-width="0px" 
         class="demo-ruleForm login-page">
            <h3 class="title">sign in</h3>
            <el-form-item prop="username">
                <el-input type="text" 
                    v-model="ruleForm2.username" 
                    auto-complete="off" 
                    placeholder="username"
                ></el-input>
            </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" 
                        v-model="ruleForm2.password" 
                        auto-complete="off" 
                        placeholder="password"
                    ></el-input>
                </el-form-item>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">login</el-button>
            </el-form-item>
            <div class="register">
              <router-link to="/register"  >have no accouts?sign up</router-link>
            </div>
        </el-form>
        
    </div>
    
</template>

<script>
export default {
    data(){
        return {
            logining: false,
            ruleForm2: {
                username: '',
                password: '',
            },
            rules2: {
                username: [{required: true, message: 'please enter your account', trigger: 'blur'}],
                password: [{required: true, message: 'please enter your password', trigger: 'blur'}]
            },
            checked: false
        }
    },
    methods: {
        handleSubmit(event){
             let _this = this;
             this.$refs.ruleForm2.validate((valid) => {
                if(valid){
                    this.logining = true;
                    this.$api.login.login({
                           username:  _this.ruleForm2.username,
                           password:  _this.ruleForm2.password
                            }).then(res => {
                            console.log(res.data);
                            this.$store.commit('set_token',res.data.data.token)
                            // 将用?token保存到vuex中
                          // window.localStorage.setItem('token', 'Bearer ' + res.data.data.token)
                            _this.$router.push('/user');
                            });
                }else{
                    return false;
                }
            })
            this.logining = false;
        }
    }
};
</script>

<style scoped>
.login-container {
    width: 100%;
    height: 100%;
}
.login-page {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
}
.register {
     text-align: right;
}
</style>