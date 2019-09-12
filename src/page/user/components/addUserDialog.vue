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
          <el-input type="text" v-model="form.username"></el-input>
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
          <el-button type="primary" @click="onSubmit(form)">提 交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "addUserDialogs",
  data() {
    let validateData = (rule, value, callback) => {};
    return {
      isVisible: this.isShow,
      form: {
        job: "",
        username: "",
        group: ""
      },
      jobs: [
        {
          value: "PG",
          label: "PG"
        },
        {
          value: "SE",
          label: "SE"
        },
        {
          value: "SSE",
          label: "SSE"
        },
        {
          value: "PM",
          label: "PM"
        }
      ],
      form_rules: {
        username: [
          { required: true, message: "用户名不能为空！", trigger: "blur" }
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
      this.form.incomePayType = this.dialogRow.incomePayType.toString();
      this.form.pay = -this.dialogRow.pay;
    } else {
      this.getGroupRole();
      this.$refs["form"].resetFields();
    }
  },
  mounted() {},
  methods: {
    onScreeoutMoney() {},
    onAddMoney() {},
    closeDialog() {
      this.$emit("closeDialog");
    },
    getGroupRole() {
      let _this = this;
      this.$api.user.getGroupTree(getToken("userid")).then(res => {
        const groups = res.data.data;
        groups[0].label = this.$t("commons.groupRole");
        _this.form.group = JSON.parse(JSON.stringify(groups));
      });
    },
    //表单提交
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          let formData = this[form];
          const para = Object.assign({}, formData);
          // edit
          if (this.addUserDialog.type === "edit") {
            updateMoney(para).then(res => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$refs["form"].resetFields();
              this.isVisible = false;
              this.$emit("getFundList");
            });
          } else {
            // add
            addMoney(para).then(res => {
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.$refs["form"].resetFields();
              this.isVisible = false;
              this.$emit("getFundList");
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
