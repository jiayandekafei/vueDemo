<template>
  <div class="fillcontain">
    <approve-seach  @searchList="getUserList" @onBatchApproveUser="onBatchApproveUser"></approve-seach>
    <div class="table_container">
      <el-table class="tablelist" v-loading="loading" :data="tableData" style="width: 100%" align="center" @selection-change="selectTable"  @select-all="selectAll" >
        <el-table-column v-if="idFlag" prop="id" label="id" align="center" width="180"></el-table-column>
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column prop="username" label="用户姓名"  sortable width="240"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="280"></el-table-column>
        <el-table-column prop="groupname" label="所属项目" align="center" ></el-table-column>
        <el-table-column prop="rolename" label="角色" align="center" width="100" ></el-table-column>
        <el-table-column prop="job" label="职位" align="center" width="100" ></el-table-column>
        <el-table-column prop="operation" align="center" label="操作" width="320">
          <template slot-scope="scope">
            <el-button type="success" icon="edit" size="mini"  @click="onApprove(scope.row)" :disabled="scope.row.aprroveButDisable">通过</el-button>
            <el-button type="warning" icon="edit" size="mini" @click="onReject(scope.row)" :disabled="scope.row.rejectButDisable">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageTotal="pageTotal" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" ></pagination>
      <addUserDialog v-if="addUserDialog.show" :isShow="addUserDialog.show" :dialogRow="addUserDialog.dialogRow" @getUserList="getUserList" @closeDialog="hideaddUserDialog"></addUserDialog>
      <rejectDialog v-if="rejectDialog.show" :isShow="rejectDialog.show" :dialogRow="rejectDialog.dialogRow" @getUserList="getUserList" @closeDialog="hideRejectDialog"></rejectDialog>
    </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as mutils from "@/utils/mUtils";
import * as comUtils from "@/utils/comUtils";
import approveSeach from "./components/approveSearch";
import addUserDialog from "./components/addUserDialog";
import rejectDialog from "./components/rejectDialog";
import Pagination from "@/components/pagination";
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      editDisable :!comUtils.isSuperUserOrPM(),
      deleteDisable :!comUtils.isSuperUserOrPM(),
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
      rejectDialog: {
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
            list: [],
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
    approveSeach,
    rejectDialog,
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
        superuser: getToken('superuser'),
        groups: comUtils.getCurrentUserGroups(),
        isapprove:true
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
              groupLength : user.groupLength,
              userId : user.userId,
              username : user.username,
              status : user.status,
              email : user.email,
              job : user.jobTitle,
              superuser: user.superuser
              };
          // user group
          if(user.groupLength>0){
            _user.groupId = user.groups[0].groupId;
            _user.roleId = user.groups[0].roleId;
            _user.groupname = user.groups[0].groupName;
            _user.rolename = user.groups[0].roleName;
            if(!_this.fields.group.filter.list.some(item =>item.value===user.groups[0].groupName )){
                  var _group = {
                    value: user.groups[0].groupName,
                    text: user.groups[0].groupName
                  }
                  _this.fields.group.filter.list.push(_group)
            }
          }
        _users.push(_user);
        });
        _this.tableData = _users;
      });
    },
   onBatchApproveUser() {
     var _this=this
      this.$confirm("确认批量通过吗?", "提示", {
        type: "warning"
      }).then(() => {
         var users=[];
         _this.rowIds.map(item => {
            var user={
             userId:item.userId,
             groups:[{
                  userId:item.userId,
                  roleId:item.roleId,
                  groupId:item.groupId,
              }]
            }
           users.push(user);
         });
         const param={users:users}
         _this.$api.user.batchApprove(param).then(res => {
          this.$message({
            message: "approved",
            type: "success"
          });
          this.getUserList();
        });

      }).catch(() => {});
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
    // reject
    onReject(row) {
      this.rejectDialog.dialogRow = row;
      this.showRejectDialog();
    },
   
    // approve user request
    onApprove(row) {
      const para ={
          userId:row.userId,
          groups:[{
              userId:row.userId,
              roleId:row.roleId,
              groupId:row.groupId,
           }]
        }
        this.$api.user.approve(para).then(res => {
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
        this.rowIds.push(item.userId);
      });
      this.setSearchBtn(val);
    },
    setSearchBtn(val) {
      let isFlag = true;
      if (val.length > 0  && comUtils.isSuperUserOrPM()) {
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
       if (('W'===row.status || null===row.status) && comUtils.isSuperUserOrPM()){
           return false;
       }else{
           return true;
       }
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


