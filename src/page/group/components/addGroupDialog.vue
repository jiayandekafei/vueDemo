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
        <el-form-item prop="Groupname" label="项目名:">
          <el-input type="text" v-model="form.Groupname"  :disabled="GroupNameTxtDisable"></el-input>
        </el-form-item>
            <el-form-item  label="客户" prop="customer">
              <el-select  v-model="infoForm.customer" auto-complete="off" placeholder="please input customer title">
                <el-option v-for="item in customers" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
        <el-form-item prop="notes_server" label="notes服务器:">
          <el-input type="text" v-model="form.notes_server" ></el-input>
        </el-form-item>
        <el-form-item prop="notes_user" label="notes服务器用户:">
          <el-input type="text" v-model="form.notes_user" ></el-input>
        </el-form-item>
        <el-form-item prop="notes_password" label="notes服务器密码:">
          <el-input type="text" v-model="form.notes_password"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="简介:">
          <el-input type="text" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item class="text_right">
          <el-button @click="isVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit(form)">提 交</el-button>
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
    let validateData = (rule, value, callback) => {};
    return {
      GroupNameTxtDisable: true,
      isVisible: this.isShow,
      form: {
      },
      form_rules: {
        username: [
          { required: true, message: "项目名不能为空！", trigger: "blur" }
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
    ...mapGetters(["addGroupDialog"])
  },
  created() {
    if (this.addGroupDialog.type === "edit") {
      this.form = this.dialogRow;
      this.GroupNameTxtDisable=true
      //this.$refs["form"].resetFields();
    } else {
     // this.$refs["form"].resetFields();
     this.GroupNameTxtDisable=false
     this.getCustomerList()
    }
  },
  mounted() {},
  methods: {
    
    // 获取客户列表数据
    getCustomerList() {
      const _this = this;
      const para ={isSelect:true}
      this.$api.customer.getCustomerList(para).then(res => {
        _this.customers = res.data.data.customers;
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
            this.$api.Group.updateGroup(para).then(res => {
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
            this.$api.Group.addGroup(para).then(res => {
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
