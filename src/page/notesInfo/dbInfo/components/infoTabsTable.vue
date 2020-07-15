<template>
    <div class="infoTabsTable">
        <el-table class="tablelist" :data="tableData"  style="width: 100%"  align="center"  >
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="table-expand">
                    <el-form-item inline class="item" label="注释代码数">
                        <span>{{ props.row.commentCodeNum }}</span>
                    </el-form-item>
                    <el-form-item inline class="item" label="空代码数">
                        <span>{{ props.row.blankCodeNum }}</span>
                    </el-form-item>
                    <el-form-item v-if="toggleData==='formInfo'" inline class="item" label="显示field数">
                        <span>{{ props.row.displayField }}</span>
                    </el-form-item>
                    <el-form-item v-if="toggleData==='formInfo'" inline class="item" label="特定条件下显示Field数">
                        <span>{{ props.row.conditionalField }}</span>
                    </el-form-item>
                    <el-form-item v-if="toggleData==='formInfo'" inline class="item" label="隐藏field数">
                        <span>{{ props.row.hideFields }}</span>
                    </el-form-item>
                    </el-form>
                </template>
                </el-table-column>
             <el-table-column prop="name" label="名称" sortable></el-table-column>
            <el-table-column prop="alias" label="别名" sortable></el-table-column>
            <el-table-column prop="allCodeNum" label="代码总数" sortable></el-table-column>
            <el-table-column prop="usefulCodeNum" label="有用代码" sortable></el-table-column>
            <el-table-column prop="callTimes" label="调用次数" sortable></el-table-column>
            <el-table-column prop="docNum"  v-if="toggleData==='formInfo'" label="文书数" sortable></el-table-column>
            <el-table-column prop="totalField" v-if="toggleData==='formInfo'" label="field总数" sortable></el-table-column>
            <el-table-column prop="buttonNum" v-if="toggleData==='formInfo'" label="button总数" sortable></el-table-column>
            <el-table-column prop="actionNum" v-if="toggleData!=='agentInfo'" label="action总数" sortable></el-table-column>
            <el-table-column prop="actionNum" v-if="toggleData==='viewInfo'" label="列数" sortable></el-table-column>
            <el-table-column prop="isSchedule" v-if="toggleData==='agentInfo'" label="isSchedule" sortable></el-table-column>
            <el-table-column prop="scheduleTime" v-if="toggleData==='agentInfo'" label="scheduleTime" width=380 sortable></el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
         data(){
             return {
                tableData:[],
                tableHeight:0,
             }
         },
         props:{
            toggleData:[String],
            dbName:[String],
            pageData:{
                pageNo: {
                    type: Number,
                    default: 1
                    },
                pageSize: {
                    type: Number,
                    default: 10
                    },
            }
         },
         mounted(){
             this.setTableHeight();
             window.onresize = () => {
                this.setTableHeight();
             }
           
         },
        watch: {
            // 监听属性的变化，可以接收参数;
             toggleData(v) {
                this.showTableData(v);
            },
            pageData:{
        　　　　handler(newValue, oldValue) {
        　　　　　 this.showTableData(this.toggleData);
        　　　　},
　　　　        deep: true
　　         }
         },
         methods:{
             setTableHeight(){
                this.$nextTick(() => {
                   this.tableHeight =  document.body.clientHeight - 280
                })
             },
             showTableData(item){
                const para =Object.assign({dbName:this.dbName},this.pageData);
                switch (item) {
                    case "formInfo":
                        this.showFormData(para);
                        break;
                    case "viewInfo":
                        this.showViewData(para);
                        break;
                    case "agentInfo":
                        this.showAgentData(para);
                        break;
                    }
              },
             showFormData(para){
                this.$api.notesInfo.getFormList(para).then(res => {
                this.tableData = res.data.data.formInfo;
                this.$emit('resetToalData',res.data.data.total)
               });
             },
             showViewData(para){
                this.$api.notesInfo.getViewList(para).then(res => {
                this.tableData = res.data.data.viewInfo;
                this.$emit('resetToalData',res.data.data.total)
               });
             },
             showAgentData(para){
                const _this = this;
                this.$api.notesInfo.getAgentList(para).then(res => {
                _this.loading = false;
                _this.tableData = res.data.data.agentInfo;
                 this.$emit('resetToalData',res.data.data.total)
               });
             },
         },
        
    }
</script>

<style lang="less">
  .table-expand {
    font-size: 0;
  }
  .table-expand .item {
    width: 50px;
    color: #6b8dbd;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
