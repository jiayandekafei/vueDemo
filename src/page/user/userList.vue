<template>
  <div class="fillcontain">
    <search-item
      @showDialog="showAddUserDialog"
      @searchList="getUserList"
      @onBatchDelUser="onBatchDelUser"
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
        :span-method="rowSpanByGroup"
       >
        <el-table-column v-if="idFlag" prop="id" label="id" align="center" width="180"></el-table-column>
        <el-table-column type="selection" align="center" width="40"></el-table-column>
        <el-table-column prop="username" label="用户姓名" width="240"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="340"></el-table-column>
        <el-table-column prop="groupname" label="所属项目" align="center"></el-table-column>
        <el-table-column prop="rolename" label="角色" align="center"></el-table-column>
        <el-table-column
          prop="job"
          label="职位"
          align="center"
          :formatter="formatterType"
          :filters="fields.job.filter.list"
          :filter-method="filterType"
        ></el-table-column>
        <el-table-column prop="status" label="状态" align="center"></el-table-column>

        <el-table-column prop="operation" align="center" label="操作" width="360">
          <template slot-scope="scope">
            <el-button type="primary" icon="edit" size="mini" @click="onEditUser(scope.row)">编辑</el-button>
            <el-button type="danger" icon="delete" size="mini" @click="onDeleteUser(scope.row)" >删除</el-button>
            <el-button type="success" icon="edit" size="mini" @click="onApprove(scope.row)" :disabled="scope.row.aprroveButDisable">通过</el-button>
            <el-button type="warning" icon="edit" size="mini" @click="onReject(scope.row)" :disabled="scope.row.rejectButDisable">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pageTotal="pageTotal"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
      <addUserDialog
        v-if="addUserDialog.show"
        :isShow="addUserDialog.show"
        :dialogRow="addUserDialog.dialogRow"
        @getUserList="getUserList"
        @closeDialog="hideaddUserDialog"
      ></addUserDialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as mutils from "@/utils/mUtils";
import SearchItem from "./components/searchItem";
import addUserDialog from "./components/addUserDialog";
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
      job_list: {
        "PG": "PG",
        "SE": "SE",
        "SSE": "SSE",
        "PM": "PM"
      },
      addUserDialog: {
        show: false,
        dialogRow: {}
      },
      pageData: {
        pageNo: 1,
        limit: 20,
        name: ""
      },
      pageTotal: 0,
      // 用于列表筛选
      fields: {
        job: {
          filter: {
            list: [
              {
                text: "PG",
                value: "PG"
              },
              {
                text: "SE",
                value: "SE"
              },
              {
                text: "SSE",
                value: "SSE"
              },
              {
                text: "PM",
                value: "PM"
              }
            ],
            multiple: true
          }
        }
      }
    };
  },
  components: {
    SearchItem,
    addUserDialog,
    Pagination
  },
  computed: {
    ...mapGetters(["search"])
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = document.body.clientHeight - 300;
      });
    },
    // 获取用户列表数据
    getUserList() {
      const _this = this;
      const currentUser = {
        userId: getToken('userid'),
        superuser: getToken('superuser')
      };
      const para = Object.assign({},currentUser,this.pageData,this.search);
      this.$api.user.getUserList(para).then(res => {
        _this.loading = false;
        _this.pageTotal = res.data.data.total;
        var _users = [];
        res.data.data.users.forEach(user => {
          var _user = {};
           if(user.status==='W'){
             _user.aprroveButDisable=false
             _user.rejectButDisable=false
           }
          var groupLength = user.groups.length;
          if (user.groups.length === 0) {
            _user.groups = 0;
            this.editCommonUserData(_user, user);
            _users.push(_user);
          } else {
            user.groups.forEach((group, index) => {
              _user = {};
              if (groupLength ==1){
                _user.groups = 0;
              }else if (index === 0) {
                _user.groups = groupLength;
              } else {
                _user.groups = 1;
              }
              this.editCommonUserData(_user, user);
              _user.groupname = group.groupName;
              _user.rolename = group.roleName;
              _users.push(_user);
            });
          }
        });
        _this.tableData = _users;
      });
    },

    editCommonUserData(_user, user) {
      _user.userId = user.userId;
      _user.username = user.username;
      _user.status = user.status;
      _user.email = user.email;
      _user.job = user.jobTitle;
      var groups = user.group;
      groups[0].label=this.$t('commons.groupRole')
      _user.group = groups;
    },
    // 显示用户弹框
    showAddUserDialog(val) {
      this.$store.commit("SET_DIALOG_TITLE", val);
      this.addUserDialog.show = true;
    },
    hideaddUserDialog() {
      this.addUserDialog.show = false;
    },
    // 上下分页
    handleCurrentChange(val) {
      this.pageData.pageNo = val;
      this.getUserList();
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.pageData.limit = val;
      this.getUserList();
    },

    /**
     * 格式化状态
     */
    formatterType(item) {
      //const type = parseInt(item.job);
      return this.job_list[item.job];
    },
    filterType(value, item) {
      // const type = parseInt(item.incomePayType);
      return this.job_list[value] == this.job_list[item.job];
    },
    // 编辑操作方法
    onEditUser(row) {
      this.addUserDialog.dialogRow = row;
      this.showAddUserDialog();
    },
    // 删除数据
    onDeleteUser(row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
          this.$api.user.deleteUser(row.userId).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUserList();
          });
        })
        .catch(() => {});
    },
    onBatchDelUser() {
      this.$confirm("确认批量删除记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          const ids = this.rowIds.map(item => item.userId).toString();
          const para = { userIds: ids };
          this.$api.user.batchDeleteUser(para).then(res => {
            console.log(res)
            this.$message({
              message: "批量删除成功",
              type: "success"
            });
            this.getUserList();
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
    rowSpanByGroup({ row, column, rowIndex, columnIndex }) {
      const groups = this.tableData[rowIndex].groups;
      if (columnIndex < 3 || columnIndex > 4) {
        if (groups > 1) {
          return {
            rowspan: groups,
            colspan: 1
          };
        } else  if (groups === 1){
           return {
            rowspan: 0,
            colspan: 0
          };
        }else {
           return {
            rowspan: 1,
            colspan: 1
          };
        }
      }
    }
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
  text-align: left;
  margin-top: 10px;
}
</style>


