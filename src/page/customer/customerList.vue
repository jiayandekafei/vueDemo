<template>
  <div class="fillcontain">
    <search-item
      @showDialog="showAddCustomerDialog"
      @searchList="getCustomerList"
      @onBatchDelCustomer="onBatchDelCustomer"
    ></search-item>
    <div class="table_container">
      <el-table
        class="tablelist"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        align="center"
        @selection-change="selectTable"
        @select-all="selectAll"
       >
        <el-table-column v-if="idFlag" prop="id" label="id" align="center" width="180"></el-table-column>
        <el-table-column type="selection" align="center" width="40"></el-table-column>
        <el-table-column prop="customername" label="客户姓名" width="240"></el-table-column>
        <el-table-column prop="description" label="简介" ></el-table-column>
        <el-table-column prop="operation" align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="edit" size="mini" @click="onEditCustomer(scope.row)">编辑</el-button>
            <el-button type="danger" icon="delete" size="mini" @click="onDeleteCustomer(scope.row)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pageTotal="pageTotal"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
      <addCustomerDialog
        v-if="addCustomerDialog.show"
        :isShow="addCustomerDialog.show"
        :dialogRow="addCustomerDialog.dialogRow"
        @getCustomerList="getCustomerList"
        @closeDialog="hideaddCustomerDialog"
      ></addCustomerDialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as mutils from "@/utils/mUtils";
import SearchItem from "./components/searchItem";
import addCustomerDialog from "./components/addCustomerDialog";
import Pagination from "@/components/pagination";
 import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      tableData: [],
      tableHeight: 0,
      loading: true,
      idFlag: false,
      isShow: false, //
      editid: "",
      rowIds: [],
      sortnum: 0,
      addCustomerDialog: {
        show: false,
        dialogRow: {}
      },
      pageData: {
        pageNo: 1,
        limit: 20,
        name: ""
      },
      pageTotal: 0,
    };
  },
  components: {
    SearchItem,
    addCustomerDialog,
    Pagination
  },
  computed: {
    ...mapGetters(["search"])
  },
  mounted() {
    this.getCustomerList();
  },
  methods: {
    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = document.body.clientHeight - 300;
      });
    },
    // 获取用户列表数据
    getCustomerList() {
      const _this = this;
      const currentCustomer = {
        userId: getToken('userid'),
        superuser: getToken('superuser'),
        isSelect:false
      };
      const para = Object.assign({},currentCustomer,this.pageData,this.search);
      this.$api.customer.getCustomerList(para).then(res => {
        _this.loading = false;
        _this.pageTotal = res.data.data.total;
       
        _this.tableData = res.data.data.customers;
      });
    },

    // 显示用户弹框
    showAddCustomerDialog(val) {
      this.$store.commit("SET_CUSTOMER_DIALOG_TITLE", val);
      this.addCustomerDialog.show = true;
    },
    hideaddCustomerDialog() {
      this.addCustomerDialog.show = false;
    },
    // 上下分页
    handleCurrentChange(val) {
      this.pageData.pageNo = val;
      this.getCustomerList();
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.pageData.limit = val;
      this.getCustomerList();
    },

    // 编辑操作方法
    onEditCustomer(row) {
      this.addCustomerDialog.dialogRow = row;
      this.showAddCustomerDialog();
    },
    // 删除数据
    onDeleteCustomer(row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
          this.$api.customer.deleteCustomer(row.customer_id).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getCustomerList();
          });
        })
        .catch(() => {});
    },
    onBatchDelCustomer() {
      this.$confirm("确认批量删除记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          const ids = this.rowIds.map(item => item.customer_id).toString();
          const para = { customerIds: ids };
          this.$api.customer.batchDeleteCustomer(para).then(res => {
            console.log(res)
            this.$message({
              message: "批量删除成功",
              type: "success"
            });
            this.getCustomerList();
          });
        })
        .catch(() => {});
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    selectTable(val) {
      this.rowIds=val;
      this.setSearchBtn(val);
    },
    // 用户全选checkbox时触发该事件
    selectAll(val) {
      val.forEach(item => {
        this.rowIds.push(item.id);
      });
      this.setSearchBtn(val);
    },
    setSearchBtn(val) {
      let isFlag = true;
      if (val.length > 0) {
        isFlag = false;
      } else {
        isFlag = true;
      }
      this.$store.commit("SET_SEARCHBTN_DISABLED", isFlag);
    },

  }
};
</script>

<style lang="less" scoped>
.table_container {
  padding: 10px;
  background: #fff;
  border-radius: 2px;
}
.el-dialog--small {
  width: 600px !important;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>


