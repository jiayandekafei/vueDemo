<template>
  	<div class="login_page">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer">
			     <div class='titleArea rflex'>
					<img class="logo" :src="logo" alt="pagoda">
				</div>
		    	<el-form :model="loginForm" :rules="rules" ref="loginForm" class="loginForm">
					<el-form-item prop="username" class="login-item">
					    <span class="fa-tips"><i class="el-icon-user"></i></span>
						<el-input @keyup.enter.native ="submitForm('loginForm')"  class="area" type="text" placeholder="username" v-model="loginForm.username" ></el-input>
					</el-form-item>
					<el-form-item prop="password" class="login-item">
					    <span class="fa-tips"><i class="el-icon-unlock"></i></span>
						<el-input @keyup.enter.native ="submitForm('loginForm')" class="area" type="password" placeholder="password" v-model="loginForm.password"></el-input>
					</el-form-item>
					<el-form-item>
				    	<el-button type="primary"  @click="submitForm('loginForm')" class="submit_btn">SIGN IN</el-button>
				  	</el-form-item>
				</el-form>
			   <div class="register">
				 <router-link to="/register"  >have no accouts?sign up</router-link>
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
			return {
				logo:logoImg,
				loginForm: {
					username: 'admin',
					password: '123456'
				},
				rules: {
					username: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
						{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
			        ],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
				}
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
		    submitForm(loginForm) {
				let _this = this;
				this.$refs[loginForm].validate((valid) => {
					if (valid) {
						this.logining = true;
						this.$api.login.login({
						username:  _this.loginForm.username,
						password:  _this.loginForm.password
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
	.login_page{
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
	
		.loginForm{
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
	.loginForm{
		
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
	.register {
	 text-align: right;
	 font-size: 14px;
     color: #1ab2ff
}
</style>
