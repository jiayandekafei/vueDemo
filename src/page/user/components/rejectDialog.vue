<template>
  <el-dialog
    title="reject"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false"
    @close="closeDialog"
  >
    <div class="form">
      <el-form
        ref="form"
        :model="form"
        :label-width="dialog.formLabelWidth"
        style="margin:10px;width:auto;"
      >
        <el-form-item prop="reason" label="原因:">
          <el-input type="text" v-model="form.reason" ></el-input>
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
import { getToken } from '@/utils/auth'
export default {
  name: "rejectDialogs",
  data() {
    return {
      isVisible: this.isShow,
      form: {
        reason: "",
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
 
  },
  created() {
      this.form = this.dialogRow;
  },
  mounted() {},
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    //表单提交
    onSubmit(form) {
          const para = {
             userId: this.dialogRow.userId,
             groupId:this.dialogRow.groupId,
             sender:this.$store.getters.name,
             description :this.dialogRow.reason,
             type:2,
             acceptor:this.dialogRow.username
          }
          this.$api.user.reject(para).then(res => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            //this.$refs[form].resetFields();
            this.isVisible = false;
            this.$emit("getUserList");
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
