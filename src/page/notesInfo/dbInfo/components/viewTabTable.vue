<template>
    <div class="viewTabsTable">
        <el-table class="tablelist" :data="tableData"  style="width: 100%"  align="center"  >
            <el-table-column prop="name" label="form名" width="420" sortable></el-table-column>
            <el-table-column prop="alias" label="别名" sortable></el-table-column>
            <el-table-column prop="totalField" label="field总数" sortable></el-table-column>
            <el-table-column prop="displayField" label="显示field数" sortable></el-table-column>
            <el-table-column prop="hideFields" label="隐藏field数" sortable></el-table-column>
            
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
            toggleData:[String]
         },
         mounted(){
             this.setTableHeight();
             window.onresize = () => {
                this.setTableHeight();
             }
           
         },
         methods:{
             setTableHeight(){
                this.$nextTick(() => {
                   this.tableHeight =  document.body.clientHeight - 280
                })
             },
             showTableData(para){
                const _this = this;
                this.$api.notesInfo.getFormList(para).then(res => {
                _this.loading = false;
                _this.tableData = res.data.data.formInfo;
                 this.$emit('resetToalData',res.data.data.total)
               });
             }
         },
        
    }
</script>

<style lang="less">

</style>
