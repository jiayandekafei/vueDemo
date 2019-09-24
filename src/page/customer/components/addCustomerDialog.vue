<template>
  <el-dialog
    :visible.sync="isVisible"
    :title="addCustomerDialog.title"
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
        <el-form-item prop="customername" label="客户名:">
          <el-input type="text" v-model="form.customername"  :disabled="customerNameTxtDisable"></el-input>
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
  name: "addCustomerDialogs",
  data() {
    //validate customername 
      let validateCustomername = (rule, value, callback) => {
        if(this.addCustomerDialog.type === "add"){
          if(value === ''){
              callback(new Error('请输入客户名'));
              return;
          }
          this.$api.customer.checkCustomer( this.form.customername).then(res=>{
              if(res.data.data===true){
                callback(new Error('客户已存在！'))
                  
                }else{
                  callback();
                }
          });
        }else{
          callback();
        }
      };
    return {
      customerNameTxtDisable: true,
      isVisible: this.isShow,
      form: {
      },
      form_rules: {
        customername: [
          { required: true, validator:validateCustomername }
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
    ...mapGetters(["addCustomerDialog"])
  },
  created() {
    if (this.addCustomerDialog.type === "edit") {
      this.form = this.dialogRow;
      this.customerNameTxtDisable=true
      //this.$refs["form"].resetFields();
    } else {
     // this.$refs["form"].resetFields();
     this.customerNameTxtDisable=false
    }
  },
  mounted() {},
  methods: {
    showAddCustomerDialog() {},
    onAddCustomer() {},
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
          if (this.addCustomerDialog.type === "edit") {
            this.$api.customer.updateCustomer(para).then(res => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$refs[form].resetFields();
              this.isVisible = false;
              this.$emit("getCustomerList");
            });
          } else {
            // add
            this.$api.customer.addCustomer(para).then(res => {
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.$refs[form].resetFields();
              this.isVisible = false;
              this.$emit("getCustomerList");
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
