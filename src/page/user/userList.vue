<template>
    <div class="fillcontain">
        <search-item @showDialog="showAddUserDialog" @searchList="getUserList" @onBatchDelUser="onBatchDelUser"></search-item>
        <div class="table_container">
            <el-table
                v-loading="loading"
                :data="tableData"
                style="width: 100%"
                align='center'
                @select="selectTable"
                @select-all="selectAll"
                >
              <el-table-column
                v-if="idFlag"
                prop="id"
                label="id"
                align='center'
                width="180">
            </el-table-column>
            <el-table-column
                type="selection"
                align='center'
                width="40">
            </el-table-column>
              <el-table-column
                prop="username"
                label="用户姓名"
                align='center'
                width="80">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                align='center'
                >
            </el-table-column>
            <el-table-column
                prop="job"
                label="职位"
                align='center'
                width="130"
                :formatter="formatterType"
                :filters="fields.job.filter.list"
                :filter-method="filterType">
            </el-table-column>
            <el-table-column
                prop="operation"
                align='center'
                label="操作"
                width="180">
                <template slot-scope='scope'>
                    <el-button 
                        type="warning" 
                        icon='edit' 
                        size="mini"
                        @click='onEditMoney(scope.row)'
                    >编辑</el-button>
                    <el-button 
                        type="danger" 
                        icon='delete' 
                        size="mini"
                        @click='onDeleteMoney(scope.row,scope.$index)'
                    >删除</el-button>
                </template>
            </el-table-column>
            </el-table>
            <pagination :pageTotal="pageTotal" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
            <addUserDialog  v-if="addUserDialog.show" :isShow="addUserDialog.show" :dialogRow="addUserDialog.dialogRow"  @getFundList="getUserList"  @closeDialog="hideaddUserDialog"></addUserDialog>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import * as mutils from '@/utils/mUtils'
    import SearchItem from "./components/searchItem";
    import addUserDialog from "./components/addUserDialog";
    import Pagination from "@/components/pagination";

    export default {
        data(){
            return {
                tableData: [],
                tableHeight:0,
                loading:true,
                idFlag:false,
                isShow:false, // 
                editid:'',
                rowIds:[],
                sortnum:0,
                job_list: {
                    0: '提现',
                    1: '提现手续费',
                    2: '提现锁定',
                    3: '理财服务退出',
                    4: '购买宜定盈',
                    5: '充值',
                    6: '优惠券',
                    7: '充值礼券',
                    8: '转账'
                },
                addUserDialog:{  
                    show:false,
                    dialogRow:{}
                },
                incomePayData:{
                    page:1,
                    limit:20,
                    name:''
                },
                pageTotal:0,
                // 用于列表筛选
                fields: {
                    job:{
                        filter: {
                            list: [{
                                text: '提现',
                                value: 0
                            },{
                                text: '提现手续费',
                                value: 1
                            }, {
                                text: '提现锁定',
                                value: 2
                            }, {
                                text: '理财服务退出',
                                value: 3
                            }, {
                                text: '购买宜定盈',
                                value: 4
                            }, {
                                text: '充值',
                                value: 5
                            }, {
                                text: '优惠券',
                                value: 6
                            }, {
                                text: '充值礼券',
                                value: 7
                            }, {
                                text: '转账',
                                value: 8
                            }],
                            multiple: true
                        }
                    },
                },
               
            }
        },
        components:{
            SearchItem,
            addUserDialog,
            Pagination
        },
        computed:{
            ...mapGetters(['search'])
        },
      	mounted() {
            this.getUserList();
        
	   },
        methods: {
             setTableHeight(){
                this.$nextTick(() => {
                   this.tableHeight =  document.body.clientHeight - 300
                })
             },
            // 获取用户列表数据
            getUserList(){
                const para = {
                    userId:'1',
                    superuser:'Y',
                };
                this.$api.user.getUserList(para).then(res => {
                     this.loading = false;
                     this.pageTotal = res.data.total
                     this.tableData = res.data.users
                })
            },
            // 显示资金弹框
            showAddUserDialog(val){
                this.$store.commit('SET_DIALOG_TITLE', val)
                this.addUserDialog.show = true;
            },
            hideaddUserDialog(){
                this.addUserDialog.show = false;
            },
            // 上下分页
            handleCurrentChange(val){
                this.incomePayData.page = val;
                this.getUserList()
            },
            // 每页显示多少条
            handleSizeChange(val){
                this.incomePayData.limit = val;
                this.getUserList()
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
                return this.job_list[value] == this.job_list[item.incomePayType];
            },
            // 编辑操作方法
            onEditMoney(row){
                this.addUserDialog.dialogRow = row;
                this.showAddUserDialog();
            },
            // 删除数据
            onDeleteMoney(row){
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    const para = { id: row.id }
                    removeMoney(para).then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.getUserList()
                    })
                })
                .catch(() => {})
            },
            onBatchDelUser(){
                this.$confirm('确认批量删除记录吗?', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    const ids = this.rowIds.map(item => item.id).toString()
                    const para = { ids: ids }
                    batchremoveMoney(para).then(res => {
                        this.$message({
                            message: '批量删除成功',
                            type: 'success'
                        })
                        this.getUserList()
                    })
                })
                .catch(() => {})
            },
            // 当用户手动勾选数据行的 Checkbox 时触发的事件
            selectTable(val, row){
                this.setSearchBtn(val);
            },
            // 用户全选checkbox时触发该事件
            selectAll(val){
                 val.forEach((item) => {
                     this.rowIds.push(item.id);
                });
                this.setSearchBtn(val);
            },
            setSearchBtn(val){
                let isFlag = true;
                if(val.length > 0){
                    isFlag = false;
                }else{
                    isFlag = true;
                }
                this.$store.commit('SET_SEARCHBTN_DISABLED',isFlag);
            }
        },
    }
</script>

<style lang="less" scoped>
    .table_container{
        padding: 10px;
        background: #fff;
        border-radius: 2px;
    }
    .el-dialog--small{
       width: 600px !important;
    }
    .pagination{
        text-align: left;
        margin-top: 10px;
    }
     
</style>


