<template>
    <div class="simiTabTable">
        <el-table class="tablelist" :data="tableData"  style="width: 90%"  height="650" align="center" :span-method="catagorySpanMethod" >
                <el-table-column prop="categoryNo" label="分类番号" sortable width="120"></el-table-column>
                <el-table-column prop="formName" label="form名" width="420"></el-table-column>
                <el-table-column prop="fieldNum" label="field数" ></el-table-column>
                <el-table-column prop="codeNum" label="有效代码行数" ></el-table-column>
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
            dbName:[String]
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
         },
         methods:{
             setTableHeight(){
                this.$nextTick(() => {
                   this.tableHeight =  document.body.clientHeight - 280
                })
             },
             showTableData(item){
                     this.getSimiData(this.dbName);
             },
             // get DB similarity data
            getSimiData(para) {
            const _this = this;
            this.$api.notesInfo.getFormSimiData(para).then(res => {
                _this.loading = false;
                _this.tableData = res.data.data.simiData;
               });
            },
           catagorySpanMethod({ row, column, rowIndex, columnIndex }) {
               if(columnIndex===0 ){
                  if ( row.categorySize > 1) {
                        return {
                            rowspan: row.categorySize,
                            colspan: 1
                           };
                        } else if ( row.categorySize == 1){
                            return {
                                rowspan: 1,
                                colspan: 1
                            }; 
                        }else{
                            return {
                                rowspan: 0,
                                colspan: 0
                            }; 
                        }
                  }else{
                    return {
                            rowspan: 1,
                            colspan: 1
                        }; 
                    }
            },
         },
    }
</script>

<style lang="less">

</style>
