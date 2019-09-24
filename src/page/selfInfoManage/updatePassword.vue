<template>
    <div class="fillcontain" ref="fillcontain">
        <div class="info_container" ref="info_container">
            <el-row class="info_row row" :gutter="10">
            
            <el-col :span="8">
                <div class="area">
                    <div class="pwdarea">
                        <p class="title"><i class="fa fa-edit"></i>修改密码</p>
                            <el-form class="form"  :model="pwdForm" :rules="pwdRules" ref="pwdForm" label-width="100px">
                            <el-form-item label="原密码" prop="password">
                                <el-input type="password" v-model="pwdForm.password" auto-complete="off" size="mini" placeholder="请输入原密码"></el-input>
                            </el-form-item>
                            <el-form-item label="新密码" prop="newpassword">
                                <el-input type="password" v-model="pwdForm.newpassword" auto-complete="off" size="mini" placeholder="请输入新密码"></el-input>
                            </el-form-item>
                            <el-form-item label="确认新密码" prop="surepassword">
                                <el-input type="password" v-model="pwdForm.surepassword" auto-complete="off" size="mini" placeholder="请输入确认新密码"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('pwdForm')">提交</el-button>
                                <el-button @click="resetForm('pwdForm')">重置</el-button>
                            </el-form-item>
                            </el-form>
                    </div>
                </div>
            </el-col>

            
            </el-row>
        </div>
    </div>
</template>

<script>
   import * as mutils from '@/utils/mUtils'
   import {getToken}  from '@/utils/auth'

    export default {
        data(){
            const para = {
                     userId:getToken('userid'),
                     password:this.pwdForm.password
                 };
             // validateField:对部分表单字段进行校验的方法
            let validateOldpassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                    return;
                } 
                 
                this.$api.user.checkPassword( para).then(res=>{
                    if(res.data.data===true){
                        callback(new Error('旧密码不正确！'))
                        }else{
                        callback();
                        }
                 });

            };
            // validateField:对部分表单字段进行校验的方法
            let validateNewpassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else {
                    if (this.pwdForm.surepassword !== '') {
                        this.$refs.pwdForm.validateField('surepassword');
                    }
                    callback();
                }
            };
            let validateSurepassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入确认密码'));
                } else if (value !== this.pwdForm.newpassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                   callback();
                }
            };
            return {
               pwdForm:{
                   password:'',
                   newpassword:'',
                   surepassword:''
               },
               pwdRules: {
                    password: [
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                    ],
                    newpassword: [
                        { required: true, validator:validateNewpassword, trigger: 'blur' },
                    ],
                    surepassword: [
                        { required: true, validator:validateSurepassword, trigger: 'blur' },
                    ],
               },
            };
        },
        created(){
           
        },
      	mounted() {
            mutils.setContentHeight(this,this.$refs.fillcontain,170);
	    },
        methods: {
            showMessage(type,message){
                this.$message({
                    type: type,
                    message: message
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$api.user.updatePassword(para).then(res => {
                             this.showMessage('success','修改密码成功~');
                             location.reload
                         });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        }
    }
</script>

<style lang="less" scoped>
    .info_container{
       padding: 20px;
       background: #fff;
       box-sizing: border-box;
       overflow: auto;
    }
     .title{
        text-align:center;
        width:100%;
        height:30px;
        line-height:30px;
        cursor: pointer;
        background-color: #3bc5ff;
        border:1px solid #3bc5ff;
        color: white;
        display: block;
        .fa{
          margin-right:5px;
       }
    }
   .info_row{
        .area{
           border:1px solid #dfdfdf;
           height:100%;
           font-size:14px;
           padding:10px;
           .form{
               width:90%;
               margin-top:20px;
           }
        }
   }
</style>


