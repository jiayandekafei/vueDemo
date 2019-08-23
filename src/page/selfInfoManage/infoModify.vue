<template>
    <div class="fillcontain" ref="fillcontain">
        <div class="info_container" ref="info_container">
            <el-row class="info_row row" :gutter="10">
            <div class="area">
                <p class="title"><i class="fa fa-edit"></i>修改个人信息</p>
                <el-form class="form"  :model="infoForm" :rules="infoRules" ref="infoForm" label-width="80px">
                    <el-form-item label="userName">
                        <el-input v-model="infoForm.username"  size="mini" disabled placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="email" prop="email">
                        <el-input v-model="infoForm.email" size="mini" placeholder="请输入绑定邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="group" prop="props">
                      <el-cascader :options="options" :props="props" collapse-tags clearable></el-cascader>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('infoForm')">提交</el-button>
                        <el-button @click="resetForm('infoForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            </el-row>
        </div>
    </div>
</template>

<script>
   import * as mutils from '@/utils/mUtils'

    export default {
        data(){
            return {
               infoForm:{
                   props: { multiple: true },
                   username:'',
                   email:'',
                    options: [{
          value: 1,
          label: '东南',
          children: [{
            value: 2,
            label: '上海',
            children: [
              { value: 3, label: '普陀' },
              { value: 4, label: '黄埔' },
              { value: 5, label: '徐汇' }
            ]
          }, {
            value: 7,
            label: '江苏',
            children: [
              { value: 8, label: '南京' },
              { value: 9, label: '苏州' },
              { value: 10, label: '无锡' }
            ]
          }, {
            value: 12,
            label: '浙江',
            children: [
              { value: 13, label: '杭州' },
              { value: 14, label: '宁波' },
              { value: 15, label: '嘉兴' }
            ]
          }]
        }, {
          value: 17,
          label: '西北',
          children: [{
            value: 18,
            label: '陕西',
            children: [
              { value: 19, label: '西安' },
              { value: 20, label: '延安' }
            ]
          }, {
            value: 21,
            label: '新疆维吾尔族自治区',
            children: [
              { value: 22, label: '乌鲁木齐' },
              { value: 23, label: '克拉玛依' }
            ]
          }]
        }]
               },
               infoRules: {
                    email: [
                        {required: true,validator: validateEmail,trigger: 'blur'}
                    ],
               },
            };
             // 附带callback(),是在明确通过验证的情况下去掉输入框上的loading
            let validateEmail = (rule, value, callback) => {
                if(value == ''){
                    callback(new Error('请输入邮箱~'));
                    return;
                }
                let emailRegex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if (!emailRegex.test(value)) {
                    callback(new Error('邮箱格式不正确！'))
                } else {
                    callback();
                }
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
            showUsername(){
                let userinfo = mutils.getStore('userinfo');
                this.infoForm.username = userinfo.username;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formName == 'pwdForm'){
                            this.showMessage('success','修改密码成功~');
                        }else if(formName == 'infoForm'){ // 判断手机服务是否为空
                            this.phoneForm.phone = this.infoForm.telphone;
                            for(let key in this.phoneForm){
                                if(this.phoneForm[key] == ''){
                                    this.showMessage('warning','请您选择手机服务~');
                                    return;
                                }
                            }
                        }else if(formName == 'phoneForm'){// 判断修改信息是否为空
                            this.infoForm.telphone = this.phoneForm.phone;
                            for(let key in this.infoForm){
                                if(this.infoForm[key] == ''){
                                    this.showMessage('warning','请您修改相关信息~');
                                    return;
                                }
                            }
                        }
                        //保存修改的相关信息
						let userinfo = this.infoForm;
                        let phoneinfo = this.phoneForm;
						let userData = Object.assign(userinfo, phoneinfo);
                        console.log(userData);
                        // axios({
                        //     type:'get',
                        //     path:'/api/user/infoModify',
                        //     data:userData,
                        //     fn:data=>{
						// 		console.log(data);
						// 		if(data.status == 1){
						// 			this.showMessage('success','修改密码成功~');
                        //             this.$router.push('/infoList');
						// 		}else{
						// 			 this.$message.error('修改失败请重试')
						// 		}
						// 	},
						// 	errFn:(res)=>{
                        //         this.showMessage('error',res.message);
                        //     }
						// })

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


