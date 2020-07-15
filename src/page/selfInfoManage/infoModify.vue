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
            <el-form-item  label="职位" prop="job">
              <el-select  v-model="infoForm.job" auto-complete="off" placeholder="please input job title">
                <el-option v-for="item in jobs" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
              <el-tree :data="infoForm.group" >
              <span class="custom-tree-node" slot-scope="{node,data}">
                <el-radio v-if="showRadio(node)" v-model="node.parent.data.radio" :label="data.id" @change="setParent(node)" >{{ node.label }}</el-radio>
                <el-checkbox v-else-if="showCheckbox(node)" v-model="data.checked" :label="data.id" @change="clearChildren(node)" >{{ node.label}}</el-checkbox> 
                <span v-else>{{ node.label }}</span>
              </span>
            </el-tree>
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
/* eslint-disable */ 
  import * as mutils from "@/utils/mUtils";
  import { getToken } from '@/utils/auth'
  import * as comUtils from "@/utils/comUtils";
export default {
  data() {
    return {
        infoForm: {
          props: { multiple: true },
          username: '',
          email: '',
          job: '',
          group: [],
          jobs : ''
        },
       jobs : mutils.getJobs(),
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
  created() {
   this.getGroupRole()
  },
  mounted() {
    const userinfo =this.$store.getters.userinfo
    this.infoForm.username=userinfo.username
    this.infoForm.email=userinfo.email
    this.infoForm.job=userinfo.jobTitle
 
    mutils.setContentHeight(this, this.$refs.fillcontain, 170);
  },
  methods: {
    showMessage(type, message) {
      this.$message({
        type: type,
        message: message
      });
    },
    setParent(node){
      node.parent.data.checked=true
    },
     setReqBody() {
       var reqBody={   
         userId: getToken('userid'),
         username:this.infoForm.username,
	       email:this.infoForm.email,
		     jobTitle:this.infoForm.job,
         groups: [],
         groupChange:true
        };
       var groups=[];
       const children = this.infoForm.group[0].children;
       children.forEach(element => {
          if(element.checked===true){
             var group={};
            group.userId= getToken('userid'),
            group.groupId = element.id;
            group.roleId = element.radio;
            groups.push(group);
          }
       });
       reqBody.groups=groups;
       return reqBody
    },
    showUsername() {
      let userinfo = mutils.getStore("userinfo");
      this.infoForm.username = userinfo.username;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //保存修改的相关信息
         var para= this.setReqBody() ;
          let oldgroups = this.$store.getters.userinfo.groups;
          let newgroups = para.groups;
          var groupChange = this.groupChangeCheck(oldgroups,newgroups);
          this.$api.user.updateUser(para).then(res =>{
          this.showMessage("success", "update scussfully");
          location.reload
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  
    groupChangeCheck(oldgroup,newgroup){
   // 判断数组的长度
      if (oldgroup.length !== newgroup.length) {
          return false
      } else {
          // 循环遍历数组的值进行比较
          for (let i = 0; i < oldgroup.length; i++) {
              if (oldgroup[i].roleId.toString() !== newgroup[i].roleId 
                    || oldgroup[i].groupId !== newgroup[i].groupId) {
                  return false
              }
          }
          return true;
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
     showRadio(node){
                return node.childNodes.length === 0 
            },
    showCheckbox(node){
        return node.childNodes.length === 2 
    },
 
    clearChildren(node){
       if(node.checked===false) {
         node.data.radio= ''
        } 
    },
    
    getGroupRole(){
       let _this=this;
       const para = {
        userId: getToken('userid'),
        groups: comUtils.getCurrentUserGroups(0),
        superuser : 'Y',
        type:3,
        groupId:0,
        roleId:0
      }
			 this.$api.user.getGroupTree(para).then(res => {
              const groups = res.data.data;
              groups[0].label=this.$t('commons.groupRole')
              _this.infoForm.group= JSON.parse(JSON.stringify(groups));
              });
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


