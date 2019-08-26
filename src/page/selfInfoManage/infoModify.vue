<template>
  <div class="fillcontain" ref="fillcontain">
    <div class="info_container" ref="info_container">
      <el-row class="info_row row" :gutter="10">
        <div class="area">
          <p class="title">
            <i class="fa fa-edit"></i>修改个人信息
          </p>
          <el-form class="form" :model="infoForm" :rules="infoRules" ref="infoForm" label-width="80px" >
            <el-form-item label="用户名">
              <el-input v-model="infoForm.username" size="mini" disabled placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="电邮" prop="email">
              <el-input v-model="infoForm.email" size="mini" placeholder="请输入绑定邮箱"></el-input>
            </el-form-item>
            <el-form-item label="所属组织以及角色" prop="props">
              <el-cascader :options="options"  :props="infoForm.props" clearable></el-cascader>
            </el-form-item>
            <el-form-item  label="职位" prop="job">
              <el-select style="" v-model="infoForm.job" auto-complete="off" placeholder="please input job title">
                <el-option v-for="item in jobs" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
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
import * as mutils from "@/utils/mUtils";

export default {
  data() {
    return {
      infoForm: {
        props: { multiple: true },
        username: "",
        email: "",
        job: '',
      },
      options: [
          {
            value: 1,
            label: "项目一",
            children: [
              {
                value: 2,
                label: "Admin"
              },
              {
                value: 7,
                label: "PM"
              },
              {
                value: 12,
                label: "User"
              }
            ]
          },   {
            value: 2,
            label: "项目二",
            children: [
              {
                value: 2,
                label: "Admin"
              },
              {
                value: 7,
                label: "PM"
              },
              {
                value: 12,
                label: "User"
              }
            ]
          }
        ],
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
      infoRules: {
        email: [{ required: true, validator: validateEmail, trigger: "blur" }]
      }
    };
     
    // 附带callback(),是在明确通过验证的情况下去掉输入框上的loading
    let validateEmail = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入邮箱"));
        return;
      }
      let emailRegex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!emailRegex.test(value)) {
        callback(new Error("邮箱格式不正确！"));
      } else {
        callback();
      }
    };
  },
  created() {},
  mounted() {
    mutils.setContentHeight(this, this.$refs.fillcontain, 170);
  },
  methods: {
    showMessage(type, message) {
      this.$message({
        type: type,
        message: message
      });
    },
    showUsername() {
      let userinfo = mutils.getStore("userinfo");
      this.infoForm.username = userinfo.username;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        
            this.showMessage("success", "update scussfully");
          
          //保存修改的相关信息
          let userinfo = this.infoForm;
      
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
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.info_container {
  padding: 20px;
  background: #fff;
  box-sizing: border-box;
  overflow: auto;
}
.title {
  text-align: center;
  width: 100%;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  background-color: #3bc5ff;
  border: 1px solid #3bc5ff;
  color: white;
  display: block;
  .fa {
    margin-right: 5px;
  }
}
.info_row {
  .area {
    border: 1px solid #dfdfdf;
    height: 100%;
    font-size: 14px;
    padding: 10px;
    .form {
      width: 90%;
      margin-top: 20px;
    }
  }
}
</style>


