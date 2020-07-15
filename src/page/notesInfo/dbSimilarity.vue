<template>
       <div class="fillcontain " ref="fillcontain">
　　　　 <simiGenItem @exportFile="exportFile" @getSimiData="getSimiData"></simiGenItem>
        <el-row :gutter="10" class="row_list order_list">
         <el-col :span="16">
          <div class="table_container">
            <el-table class="tablelist" height="600" v-loading="loading"  :data="tableData"  style="width: 100%"  align="center" :span-method="catagorySpanMethod" >
                <el-table-column prop="categoryNo" label="分类番号" align="center"  width="100"></el-table-column>
                <el-table-column prop="enName" label="DBファイル名" width="160"></el-table-column>
                <el-table-column prop="jpName" label="DB名" ></el-table-column>
                <el-table-column prop="mainForm" label="主フォーム" ></el-table-column>
                <el-table-column prop="dbSize" label="DB数" align="center" width="100"></el-table-column>
            </el-table>
           </div>
        </el-col>
        <el-col :span="8">
          <pie-chart type="simi" :groupId="groupId" :reload="reload"></pie-chart>
        </el-col>
        </el-row>
       </div>
</template>

<script>
    import * as mutils from "@/utils/mUtils";
    import * as comUtils from "@/utils/comUtils";
    import { getToken } from '@/utils/auth';
    import simiGenItem from "./components/simiGenItem";
    import pieChart from '@/components/echarts/pieChart' // 用户分布图
    export default {
        data(){
            return {
               tableData: [],
               groups:[],
               loading: false,
               idFlag: false,
               groupId:0,
               reload:false
            };
        },
        components: {
            simiGenItem,
            pieChart,
         },
        created(){
           //this.getSimiData()
        },
      	mounted() {
            mutils.setContentHeight(this,this.$refs.fillcontain,170);
	    },
        methods: {
            // get DB similarity data
            getSimiData(groupId) {
            this.groupId=groupId;
            this.reload=true
            const _this = this;
            const para = {
                groupId: groupId
                  };
            this.$api.notesInfo.getDBSimiData(para).then(res => {
                _this.loading = false;
                _this.tableData = res.data.data.simiData;
                this.reload=false
               });
            },
           catagorySpanMethod({ row, column, rowIndex, columnIndex }) {
               if(columnIndex===0 ||columnIndex===4 ){
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
        formatJson(filterVal, jsonData) {
　　　　     return jsonData.map(v => filterVal.map(j => v[j]))
　           },
        genMerge(tableData) {
            var current_row = 1;
            var mergerRange = [];
　　　　    tableData.forEach(item =>{
                if(item.categorySize>1){
                      var col1 = {
                            s: {c: 0,r: current_row},
                            e: {c: 0,r: current_row + item.categorySize - 1}
                        };
                        mergerRange.push(col1);
                       var col2 = {
                            s: {c: 4,r: current_row},
                            e: {c: 4,r: current_row + item.categorySize - 1}
                        };
                         mergerRange.push(col2);
                   }
                   current_row = current_row + item.categorySize;
                })
                return mergerRange;
          },
        exportFile() {
        　　 require.ensure([], () => {
        　　　const { export_json_to_excel } = require('@/download/Export2Excel');
        　　　const tHeader = ["類似グループ", "DBファイル名", "DB名", "主フォーム", "DB数"];
        　　　const filterVal = ['categoryNo', 'enName', 'jpName','mainForm','dbSize'];
        　　　const list = this.tableData;
        　　　const data = this.formatJson(filterVal, list);
              const mergerRange=this.genMerge(list);
        　　　export_json_to_excel(tHeader, data, 'DB相似性',mergerRange);
        　　　})
            } ,
      },
    
    }
</script>

<style lang="less" scoped>
    .info_container{
       padding: 20px;
       background: #fff;
       box-sizing: border-box;
       overflow: auto;
       margin: 20px;
		border-radius: 2px;
    }
     .title{
        text-align:center;
        width:100%;
        height:30px;
        line-height:30px;
        cursor: pointer;
        background-color: #3bc5ff;
        border:1px solid #3bc5ff;
        color: white;
        display: block;
        .fa{
          margin-right:5px;
       }
    }
   .table_container {
     padding: 10px;
     background: #fff;
     border-radius: 2px;
   }
    .genForm{
        border:1px solid #dfdfdf;
        height:100%;
        font-size:14px;
        padding:10px;
        width:99%;
        margin-top:20px;
}

.row_list{
margin-bottom: 20px;
.row_base{
padding: 10px;
box-sizing: border-box;
background: #fff;
border-radius: 6px;
height: 120px;
}
}
  
.order_list{
.orderArea{
width: 100%;
height: 610px;
background: #fff !important;
border-radius: 6px;
box-sizing: border-box;
padding: 10px;
padding-top: 40px;
overflow: hidden;
}
.orderbarArea{
height: 370px;
}
}
</style>


