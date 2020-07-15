<template>
  <el-dialog
    :visible.sync="isVisible"
    :title="addUserDialog.title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false"
    @close="closeDialog"
  >
    <div class="form">
      <el-form
        ref="form"
        :model="form"
        :rules="form_rules"
        :label-width="dialog.formLabelWidth"
        style="margin:10px;width:auto;"
      >
        <el-form-item prop="username" label="用户名:">
          <el-input type="text" v-model="form.username"  :disabled="userNameTxtDisable"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱:">
          <el-input type="text" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="职位:">
          <el-select v-model="form.job" placeholder="职位">
            <el-option
              v-for="item in jobs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> 
         <el-form-item  v-if="isSuperuser==='Y'" label="超级管理员">
               <el-switch v-model="form.superuser"> </el-switch>
         </el-form-item>
        <el-form-item>
          <el-tree :data="form.group">
            <span class="custom-tree-node" slot-scope="{node,data}">
              <el-radio
                v-if="showRadio(node)"
                v-model="node.parent.data.radio"
                :label="data.id"
                @change="setParent(node)"
              >{{ node.label }}</el-radio>
              <el-checkbox
                v-else-if="showCheckbox(node)"
                v-model="data.checked"
                :label="data.id"
                @change="clearChildren(node)"
              >{{ node.label}}</el-checkbox>
              <span v-else>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-form-item>
        <el-form-item class="text_right">
          <el-button @click="isVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getToken } from '@/utils/auth';
import * as mutils from "@/utils/mUtils";
import * as comUtils from "@/utils/comUtils";
export default {
  name: "addUserDialogs",
  data() {
   //validate email 
         let validateEmail = (rule, value, callback) => {
               
                let emailRegex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if (value!==undefined && value!==null && value!=='' && !emailRegex.test(value)) {
                    callback(new Error('邮箱格式不正确！'))
                } else {
                    callback();
                }
			};
			//validate username 
         let validateUsername = (rule, value, callback) => {
           if(this.addUserDialog.type === "add"){
              if(value == ''){
                  callback(new Error('请输入用户名'));
                  return;
              }
              this.$api.user.checkUser( this.form.username).then(res=>{
                  if(res.data.data===true){
                    callback(new Error('用户已存在！'))
                      
                    }else{
                      callback();
                    }
              });
           }else{
              callback();
           }
         };
    return {
      userNameTxtDisable: true,
      isVisible: this.isShow,
      isSuperuser: getToken('superuser'),
      form: {
        job: "",
        username: "",
        group: [],
        superuser:false
      },
      jobs: mutils.getJobs(),
      form_rules: {
        username: [
          { required: true,  validator:validateUsername }
        ],
        email: [
          { required: false,  validator:validateEmail }
        ]
      },
      //详情弹框信息
      dialog: {
        width: "400px",
        formLabelWidth: "120px"
      }
    };
  },
  props: {
    isShow: Boolean,
    dialogRow: Object
  },
  computed: {
    ...mapGetters(["addUserDialog"])
  },
  created() {
    if (this.addUserDialog.type === "edit") {
      this.form = this.dialogRow;
      this.form.superuser=this.dialogRow.tempSuper==='Y'
      this.userNameTxtDisable=true
      //this.$refs["form"].resetFields();
    } else {
      const para = {
        groups: comUtils.getCurrentUserGroups(),
        superuser : getToken('superuser') ,
        type:1,
        groupId:0,
        roleId:0
      }
      this.getGroupRole(para);
     // this.$refs["form"].resetFields();
     this.userNameTxtDisable=false
    }
  },
  mounted() {},
  methods: {
    onScreeoutMoney() {},
    onAddUser() {},
    closeDialog() {
      this.$emit("closeDialog");
    },
    showRadio(node){
                return node.childNodes.length === 0 
            },
    setParent(node){
      node.parent.data.checked=true
    },
    showCheckbox(node){
        return node.childNodes.length === 2 
    },
 
    clearChildren(node){
       if(node.checked===false) {
         node.data.radio= ''
        } 
    },
    getGroupRole(para) {
      let _this = this;
      this.$api.user.getGroupTree(para).then(res => {
        const groups = res.data.data;
        groups[0].label = this.$t("commons.groupRole");
        _this.form.group = JSON.parse(JSON.stringify(groups));
      });
    },
    setReqBody() {
       var reqBody={    
         userId:this.form.userId,   
         username:this.form.username,
	       email:this.form.email,
         jobTitle:this.form.job,
         superuser:this.form.superuser,
         groups: [],
         groupChange:false
        };
	     var groups= []
       const children = this.form.group[0].children;
       children.forEach(element => {
          if(element.checked===true){
             var group={};
            group.groupId = element.id;
            group.roleId = element.radio;
            groups.push(group);
          }
       });
       reqBody.groups=groups;
       return reqBody
    },
    //表单提交
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          // edit
          if (this.addUserDialog.type === "edit") {
            this.$api.user.updateUser(this.setReqBody()).then(res => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              //this.$refs[form].resetFields();
              this.isVisible = false;
              this.$emit("getUserList");
            });
          } else {
            // add
            this.$api.user.addUser(this.setReqBody()).then(res => {
              this.$message({
                message: "新增成功",
                type: "success"
              });
              //this.$refs[form].resetFields();
              this.isVisible = false;
              this.$emit("getUserList");
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.search_container {
  margin-bottom: 20px;
}
.btnRight {
  float: right;
  margin-right: 0px !important;
}
.searchArea {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  padding: 18px 18px 0;
}
</style>
