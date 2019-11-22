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
       
       >
        <el-table-column v-if="idFlag" prop="id" label="id" align="center" width="180"></el-table-column>
        <el-table-column type="selection" align="center" width="40"></el-table-column>
        <el-table-column prop="username" label="用户姓名"  sortable width="240"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="280"></el-table-column>
        <el-table-column prop="groupname" label="所属项目" align="center" :filters="fields.group.filter.list" :filter-method="filterGroup"></el-table-column>
        <el-table-column prop="rolename" label="角色" align="center" width="100" :filters="fields.role.filter.list" :filter-method="filterRole"></el-table-column>
        <el-table-column prop="job" label="职位" align="center" width="100" :filters="fields.job.filter.list" :filter-method="filterJob"></el-table-column>
        <el-table-column prop="status" label="状态" :formatter="formatStatus" :filters="fields.status.filter.list" :filter-method="filterStatus" align="center"></el-table-column>
        <el-table-column prop="operation" align="center" label="操作" width="320">
          <template slot-scope="scope">
            <el-button type="primary" icon="edit" size="mini" @click="onEditUser(scope.row)">编辑</el-button>
            <el-button type="danger" icon="delete" size="mini" @click="onDeleteUser(scope.row)" >删除</el-button>
            <el-button type="success" icon="edit" size="mini"  @click="onApprove(scope.row)" :disabled="scope.row.aprroveButDisable">通过</el-button>
            <el-button type="warning" icon="edit" size="mini" @click="onReject(scope.row)" :disabled="scope.row.rejectButDisable">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageTotal="pageTotal" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" ></pagination>
      <addUserDialog v-if="addUserDialog.show" :isShow="addUserDialog.show" :dialogRow="addUserDialog.dialogRow" @getUserList="getUserList" @closeDialog="hideaddUserDialog"></addUserDialog>
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
      addUserDialog: {
        show: false,
        dialogRow: {}
      },
      pageData: {
        pageNo: 1,
        limit: 20,
        name: ""
      },
      status_list: {
         "W": "waiting for approve",
         "A": "approved",
         "R": "rejected"
            },
      pageTotal: 0,
      // 用于列表筛选
      fields: {
        job: {
          filter: {
            list: mutils.getJobs(),
            multiple: true
          }
        },
        group: {
          filter: {
            list: this.getFilterGroups(),
            multiple: true
          }
        },
        role: {
          filter: {
            list: mutils.getRoles(),
            multiple: true
          }
        },
        status: {
          filter: {
            list: [{  
                   text: 'waiting for approve',
                   value: 'W'
               },{
                  text: 'approved',
                  value: 'A'
              }, {
                 text: 'Rejected',
                 value: 'R'
              }],
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
    //判断当前的登录角色
    
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
          var _user = {   
                   aprroveButDisable:this.isApproveEnable(user),
                   rejectButDisable:this.isApproveEnable(user),
                   groups : user.groups.length
                   };
          this.fields.status.filter.list.push()
          var groupLength = user.groups.length;
          if (user.groups.length === 0) {
            this.editCommonUserData(_user, user);
            _users.push(_user);
          } else {
            user.groups.forEach((group, index) => {
              _user = { 
                   aprroveButDisable:this.isApproveEnable(user),
                   rejectButDisable:this.isApproveEnable(user),
                   groups : user.groups.length
                   };
              this.editCommonUserData(_user, user);
              _user.groupId = group.groupId;
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
      this.$store.commit("SET_USER_DIALOG_TITLE", val);
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
    filterGroup(value, row) {
      return row.groupname == value;
    },
    filterRole(value, row) {
      return row.rolename == value;
    },
    filterJob(value, row) {
      return row.job == value;
    },
    filterStatus(value, row) {
      return row.status == value;
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
         const param = {userId: row.userId,
                        groupId: row.groupId,
                        groupLength: row.groups };
          this.$api.user.deleteUser(param).then(res => {
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
      }).then(() => {
        var users=[];
         this.rowIds.map(item => {
            var user={
              userId: item.userId,
              groupId: item.groupId,
              groupLength: item.groups
            }
           users.push(user);
         });
         const param={users:users}
          this.$api.user.batchDeleteUser(param).then(res => {
               this.addUserDialog.show = false;
               this.$message({
                  message: "批量删除成功",
                  type: "success"
                });
            this.getUserList();
          }).catch( err=>{
            this.$message({
                  message: "删除失败!",
                  type: "success"
                });
          });
        })
        .catch(() => {});
    },
    // approve user request
    onApprove(row) {
          this.$api.user.approveUser(row.userId).then(res => {
            this.$message({
              message: "approved",
              type: "success"
            });
            this.getUserList();
          });
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
    },
    formatStatus(row, column) {
       return this.status_list[row.status];
    },

    isApproveEnable(row) {
       if ('W'===row.status && ('Y'===getToken('superuser')
                               ||'2'===store.getters.groupRole[row.groupId]
                                )){
           return false;
       }else{
           return true;
       }
    },

    
  // get groups
  getFilterGroups () {
    var filterGroups = []
      this.$api.group.getGroupFilterList().then(res => {
      res.data.data.groups.forEach(group => {
        var _group = {
          value: group.groupname,
          text: group.groupname
        }
        filterGroups.push(_group)
      })
    })
     return filterGroups
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
  text-align: right;
  margin-top: 10px;
}
</style>


