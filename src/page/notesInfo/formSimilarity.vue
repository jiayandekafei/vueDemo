<template>
    <div class="fillcontain" ref="fillcontain">
           <div class="simi_gen_container searchArea">
                <el-form :inline="true"  :model='genForm' :rules="genRules" ref="genForm"  class="genForm">
                    <el-form-item  label="项目:" prop="groupId">
                        <el-select  v-model="genForm.groupId" auto-complete="off" placeholder="请选择项目组">
                        <el-option v-for="item in groups" :key="item.groupId" :label="item.groupname" :value="item.groupId">
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="btnRight">
                        <el-button type="primary" size ="mini" icon="view" @click='onAnalyse()'>导出excel</el-button>
                    </el-form-item>
                </el-form>
          </div>
          <div class="table_container">
            <el-table class="tablelist" v-loading="loading"  :data="tableData"  style="width: 100%"  align="center" :span-method="catagorySpanMethod" >
                <el-table-column prop="categoryNo" label="分类番号" sortable width="120"></el-table-column>
                <el-table-column prop="formName" label="form名" width="420"></el-table-column>
                <el-table-column prop="fieldNum" label="field数" ></el-table-column>
                <el-table-column prop="codeNum" label="有效代码行数" ></el-table-column>
            </el-table>
             <pie-chart type="ordertype"></pie-chart>
         </div>
       
    </div>
</template>

<script>
    import * as mutils from "@/utils/mUtils";
    import * as comUtils from "@/utils/comUtils";
    import { getToken } from '@/utils/auth';
    export default {
        data(){
            return {
               tableData: [],
               groups:[],
               loading: false,
               idFlag: false,
               genForm:{  
                   groupId: '',
                 },
             genRules: {
                groupId: [
                    { required: true, message: '请选择项目', trigger: 'blur' },
                ],
                type: [
                    { required: true, message: '请选择比较对象', trigger: 'blur' },
                ]
            }
            };
        },
        components: {
         },
        created(){
            this.getGroupList();
           this.getSimiData()

        },
      	mounted() {
            mutils.setContentHeight(this,this.$refs.fillcontain,170);
	    },
        methods: {
             // 获取项目列表数据
           getGroupList() {
              const _this = this;
              const para = {
                      superuser: getToken('superuser'),
                      groups: comUtils.getCurrentUserGroups()
                    };
                this.$api.group.getGroupList(para).then(res => {
               _this.groups=res.data.data.groups
               this.genForm.groupId=this.groups[0].value    
              });
            },
              //生成数据
           onAnalyse(genForm) {
              const _this = this;
              const para = {
                      groupId: this.genForm.groupId,
                    };
                this.$api.notesInfo.analyzeFormSimi(para).then(res => {
                   this.$message({
                        message: "DB分类结束，数据已存入数据库.",
                        type: "success"
                   });
              });
            },
            // get DB similarity data
            getSimiData() {
            const _this = this;
            this.$api.notesInfo.getFormSimiData('YKH04031').then(res => {
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
        formatJson(filterVal, jsonData) {
　　　　     return jsonData.map(v => filterVal.map(j => v[j]))
　           },

        exportFile() {
              const _this = this
        　　 　require.ensure([], () => {
        　　　const { export_json_to_excel } = require('@/download/Export2Excel');
        　　　const tHeader = ['分类番号', '英文名', '日文名'];
        　　　const filterVal = ['categoryNo', 'enName', 'jpName'];
        　　　const list = _this.tableData;
        　　　const data = _this.formatJson(filterVal, list);
        　　　export_json_to_excel(tHeader, data, 'DB相似性');
        　　　})
            } 
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


   .simi_gen_container{
        margin-bottom: 20px;
    }
    .btnRight{
        float: right;
        margin-right: 100px !important;
        
    }
    .searchArea{
        background:rgba(255,255,255,1);
        border-radius:2px;
        padding: 18px 30px 0;
    }
   
</style>


