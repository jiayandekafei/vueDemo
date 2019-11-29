<template>
  <el-dialog
    :visible.sync="isVisible"
    :title="addGroupDialog.title"
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
        <el-form-item prop="groupname" label="项目名:">
          <el-input type="text" v-model="form.groupname"  :disabled="groupNameTxtDisable"></el-input>
        </el-form-item>
        <el-form-item  label="客户" prop="customerId">
              <el-select  v-model="form.customerId" auto-complete="off" placeholder="please input customer customername">
                <el-option v-for="item in customers" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="server" label="notes服务器:">
          <el-input type="text" v-model="form.server" ></el-input>
        </el-form-item>
        <el-form-item prop="serverUser" label="notes服务器用户:">
          <el-input type="text" v-model="form.serverUser" ></el-input>
        </el-form-item>
        <el-form-item prop="serverPassword" label="notes服务器密码:">
          <el-input type="text" v-model="form.serverPassword"></el-input>
        </el-form-item>
        <el-form-item prop="notesDBPath" label="notes DB路径:">
          <el-input type="text" v-model="form.notesDBPath"></el-input>
        </el-form-item>
        <el-form-item prop="exportResultPath" label="notes DB导出结果路径:">
          <el-input type="text" v-model="form.exportResultPath"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="简介:">
          <el-input type="text" v-model="form.description"></el-input>
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
import { getToken } from '@/utils/auth'
export default {
  name: "addGroupDialogs",
  data() {
    //validate customername 
      let validateGroupname = (rule, value, callback) => {
        if(this.addGroupDialog.type === "add"){
          if(value === ''){
              callback(new Error('请输入项目名'));
              return;
          }
          this.$api.group.checkGroup( this.form.groupname).then(res=>{
              if(res.data.data===true){
                callback(new Error('项目已存在！'))
                  
                }else{
                  callback();
                }
          });
        }else{
          callback();
        }
      };
    return {
      groupNameTxtDisable: true,
      isVisible: this.isShow,
      customers:[],
      form: {
        customer:''
      },
      form_rules: {
        groupname: [
          { required: true, validator:validateGroupname}
        ]
      },
      //详情弹框信息
      dialog: {
        width: "400px",
        formLabelWidth: "150px"
      }
    };
  },
  props: {
    isShow: Boolean,
    dialogRow: Object
  },
  computed: {
    ...mapGetters(["addGroupDialog"])
  },
  created() {
     this.getCustomerList()
    if (this.addGroupDialog.type === "edit") {
      this.form = this.dialogRow;
      this.groupNameTxtDisable=true
      //this.$refs["form"].resetFields();
    } else {
     // this.$refs["form"].resetFields();
     this.groupNameTxtDisable=false
    }
  },
  mounted() {},
  methods: {
    
    // 获取客户列表数据
    getCustomerList() {
      const _this = this;
      const para ={isSelect:true,
                   pageNo:1,
                   limit:30
                   }
        this.$api.customer.getCustomerList(para).then(res => {
        res.data.data.customers.forEach(customer=>{
              var cust ={
                value:customer.customerId,
                label:customer.customername
              }
              this.customers.push(cust)
        });
      });
    },

    onScreeoutMoney() {},
    onAddGroup() {},
    closeDialog() {
      this.$emit("closeDialog");
    },
    //表单提交
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          let formData = this[form];
          const para = Object.assign({}, formData);
          // edit
          if (this.addGroupDialog.type === "edit") {
            this.$api.group.updateGroup(para).then(res => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$refs[form].resetFields();
              this.isVisible = false;
              this.$emit("getGroupList");
            });
          } else {
            // add
            this.$api.group.addGroup(para).then(res => {
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.$refs[form].resetFields();
              this.isVisible = false;
              this.$emit("getGroupList");
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
