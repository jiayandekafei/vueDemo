<template>
    <div class="fillcontain">
        <search-item @showDialog="showAddUserDialog" @searchList="getUserList" @onBatchDelUser="onBatchDelUser"></search-item>
        <div class="table_container">
            <el-table
             class="tablelist"
                v-loading="loading"
                :data="tableData"
                style="width: 100%"
                align='center'
                @select="selectTable"
                @select-all="selectAll"
                :span-method="rowSpanByGroup"
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
                width="240">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                 width="340"
                >
            </el-table-column>
            <el-table-column
                prop="group.name"
                label="所属项目"
                align='center'
                >
            </el-table-column>
             <el-table-column
                prop="role.name"
                label="角色"
                align='center'
                >
            </el-table-column>
            <el-table-column
                prop="job"
                label="职位"
                align='center'
                :formatter="formatterType"
                :filters="fields.job.filter.list"
                :filter-method="filterType">
            </el-table-column>
             <el-table-column
                prop="status"
                label="状态"
                align='center'
                >
            </el-table-column>
            
            <el-table-column
                prop="operation"
                align='center'
                label="操作"
                width="360">
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
                     <el-button 
                        type="green" 
                        icon='edit' 
                        size="mini"
                        @click='onEditMoney(scope.row)'
                    >approve</el-button>
                　　 <el-button 
                        type="green" 
                        icon='edit' 
                        size="mini"
                        @click='onEditMoney(scope.row)'
                    >reject</el-button>
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
                    0: 'PG',
                    1: 'SE',
                    2: 'SSE',
                    3: 'PM',
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
                                text: 'PG',
                                value: 0
                            },{
                                text: 'SE',
                                value: 1
                            }, {
                                text: 'SSE',
                                value: 2
                            }, {
                                text: 'PM',
                                value: 3
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
                const _this =this
                const para = {
                    userId:'1',
                    superuser:'Y',
                };
                this.$api.user.getUserList(para).then(res => {
                     _this.loading = false;
                     _this.pageTotal = res.data.total
                     _this.tableData = res.data.data.users
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
            },
           rowSpanByGroup({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                if (rowIndex % 2 === 0) {
                    return {
                    rowspan: 2,
                    colspan: 1
                    };
                } else {
                    return {
                    rowspan: 0,
                    colspan: 0
                    };
                }
                }
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
     
    td {
        /* border-left: 1px solid #EBEEF5; */
        /* border-right: 1px solid #EBEEF5; */
        border: 1px solid #EBEEF5 !important;
    }
</style>


