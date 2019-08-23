<template>
  	<div class="register_page">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer">
			  <div class='titleArea rflex'>
					 	<img class="logo" :src="logo" alt="pagoda">
				</div>
		    	<el-form :model="registerForm" :rules="rules" ref="registerForm" class="registerForm">
				  <el-form-item prop="username">
             <span class="fa-tips"><i class="el-icon-user"></i></span>
            <el-input v-model="registerForm.username" auto-complete="off" placeholder="please input username"></el-input>
          </el-form-item>
					<el-form-item prop="password">
             <span class="fa-tips"><i class="el-icon-unlock"></i></span>
            <el-input type="password" v-model="registerForm.password" auto-complete="off" placeholder="please input password"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
             <span class="fa-tips"><i class="el-icon-unlock"></i></span>
            <el-input type="password" v-model="registerForm.checkPass" auto-complete="off" placeholder="please input confirm password"></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <span class="fa-tips"><i class="el-icon-message"></i></span>
            <el-input type="email" v-model="registerForm.email" auto-complete="off" placeholder="please input email"></el-input>
          </el-form-item>
          <el-form-item>
            <span class="fa-tips"><i class="el-icon-s-cooperation"></i></span>
          <el-select style="width:100%" v-model="registerForm.job" auto-complete="off" placeholder="please input job title">
            <el-option v-for="item in jobs" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
           <el-form-item>
             <span class="fa-tips"><i class="el-icon-user-solid"></i></span>
           <el-select style="width:100%" v-model="registerForm.group" auto-complete="off" placeholder="please input job title">
            <el-option v-for="item in groups" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
           </el-form-item>
					<el-form-item>
				    	<el-button type="primary"  @click="submitForm('registerForm')" class="submit_btn">SIGN IN</el-button>
				  	</el-form-item>
				</el-form>
			   <div class="login">
				 <router-link to="/login"  >already have accouts?sign in</router-link>
			   </div>
	  		</section>
	  	</transition>
  	</div>
</template>

<script>
	import logoImg from "@/assets/img/company-logo.png";
	import { setToken } from '@/utils/auth'
	export default {
	    data(){
        //validate check password
        let validateSurepassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入确认密码'));
                } else if (value !== this.registerForm.newpassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                   callback();
                }
            };
        //validate email 
         let validateEmail = (rule, value, callback) => {
                if(value == ''){
                    callback(new Error('请输入邮箱'));
                    return;
                }
                let emailRegex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if (!emailRegex.test(value)) {
                    callback(new Error('邮箱格式不正确！'))
                } else {
                    callback();
                }
            };
			return {
				logo:logoImg,
				registerForm: {
          username: '',
          password: '',
          checkPass: '',
					email: '',
          job: '',
          group: '',

				},
				rules: {
					username: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
						{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
			        ],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
          ],
          	checkPass: [
						{ required: true, validator:validateSurepassword,trigger: 'blur' }
          ],
          	email: [
						{ required: true,validator:validateEmail, trigger: 'blur' }
					],
        },
        jobs: [{
          value: 'PG',
          label: 'PG'
        }, {
          value: 'SE',
          label: 'SE'
        }, {
          value: 'SSE',
          label: 'SSE'
        }, {
          value: 'PM',
          label: 'PM'
        }],
        groups: [{
          value: '01',
          label: 'group'
        }, {
          value: '02',
          label: 'group2'
        }],
			}
		},
		mounted(){
		},
		methods: {
			showMessage(type,message){
                this.$message({
                    type: type,
                    message: message
                });
            },
		    submitForm(registerForm) {
				let _this = this;
				this.$refs[registerForm].validate((valid) => {
					if (valid) {
						this.logining = true;
						this.$api.login.login({
						username:  _this.registerForm.username,
						password:  _this.registerForm.password
						}).then(res => {
						this.$store.commit('SET_TOKEN',res.data.data.token)
						console.log(res)
						setToken("Token",res.data.data.userDetail.role.role)
						_this.$router.push('/');
						this.$store.dispatch('initLeftMenu'); //设置左边菜单始终为展开状态
						});
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.register_page{
		position: absolute;
		width: 100%;
		height: 100%;
		background: url(../assets/img/bg9.jpg) no-repeat center center;
		background-size: 100% 100%;
	}
	.form_contianer{
		position: absolute;
		top: 50%;
    left: 50%;
		transform: translate(-50%,-50%);
		background: #fff;
		width:370px;
		border-radius: 5px;
		padding: 25px;
		text-align: center;
		.titleArea{
			justify-content: center;
   			align-items: center;
			text-transform: uppercase;
			font-size: 22px;
			width: 100%;
			padding-bottom: 20px;

			.title{
				i{
				   color: #FF6C60;
				}
			}
		}
	
		.registerForm{
			.submit_btn{
				width: 100%;
				padding:13px 0;
				font-size: 16px;
			}
			.fa-tips{
				position: absolute;
				left: 10px;
				z-index: 20;
				color: #FF7C1A;
				font-size: 18px;
				top: 50%;
				transform: translateY(-50%);
      }
	  }
	}
 
	.manage_tip{
		margin-bottom:20px;
		.title{
			font-family: cursive;
			font-weight: bold;
			font-size: 26px;
			color:#fff;
		}
		.logo{
			width:60px;
			height:60px;
		}
	}
	
	.tiparea{
		text-align:left;
		font-size: 12px;
		color: #4cbb15;
		padding: 10px 0;
		.tip{
			margin-left: 54px;
		}
		.tips{
			color:red;
		}
	}
	
	.form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}
	.registerForm{
		.el-byutton--primar{
			background-color:#FF7C1A !important;
			border:1px solid #FF7C1A !important;
		}
  }
	.sanFangArea{
		border-top: 1px solid #DCDFE6;
		padding: 10px 0;
		display: none;
		.title{
			font-size: 14px;
			color: #8b9196;
			margin-bottom: 10px;
		}
		ul{
			li{
				flex:1;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				.svg-icon{
					font-size: 24px;
				}
			}
		}
	}
	.login {
	 text-align: right;
	 font-size: 14px;
     color: #1ab2ff
}


</style>
