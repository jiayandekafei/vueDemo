<template>
  <div class="simi_gen_container searchArea">
        <el-dialog title="提示" :visible.sync="tipDialogVisible" width="30%" :before-close="handleClose">
         <span >将会重新对{{this.group.groupname}}的所有DB进行分类，{{this.group.groupname}}所对应的的服务器为:{{this.group.server}},导出DB所在路径为：{{this.group.exportResultPath}},你确定要继续吗?</span>
         <span slot="footer" class="dialog-footer">
            <el-button @click="tipDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click='onAnalyse("simi_gen_data")'>确 定</el-button>
         </span>
       </el-dialog>
        <el-dialog title="提示" :visible.sync="proDialogVisible" width="30%" :before-close="handleClose">
          <span class="msgSpan">{{genMessage}}</span>
          <div class="scaleProgress">
            <s-progress v-if="showProgress" :progressStatus="progressStatus" :color="color"></s-progress> 
            <el-button @click="closeProgress()">取 消</el-button>
            <el-button type="primary" @click='closeProgress()'>确 定</el-button>
        　</div>
       </el-dialog>
        <el-form 
            :inline="true" 
            :model='simi_gen_data' 
            :rules="rules"
            ref="simi_gen_data" 
            class="demo-form-inline genForm">
              <el-form-item  label="项目:" prop="groupId">
                  <el-select  v-model="simi_gen_data.groupId" auto-complete="off" placeholder="请选择项目组" @change="groupChange">
                  <el-option v-for="item in groups" :key="item.groupId" :label="item.groupname" :value="item.groupId" :value-key="item.groupId">
                  </el-option>
                  </el-select>
              </el-form-item>
            <el-form-item  label="比较对象:" prop="type">
                <el-select  v-model="simi_gen_data.type" auto-complete="off" placeholder="请选择比较对象">
                  <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="去除非表示部分">
               <el-switch  v-model="simi_gen_data.hideExcept" active-color="#409EFF" inactive-color="#ff4949"> </el-switch>
            </el-form-item>
            <el-form-item label="相似值">
                <el-input v-model="simi_gen_data.simiValue" placeholder="相似值" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size ="mini" icon="search" @click="statusCheck()">相似DB作成</el-button>
            </el-form-item>
            <el-form-item class="btnRight">
                <el-button type="primary" size ="mini" icon="view" @click='onExport()'>导出excel</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
/* eslint-disable */ 
   import * as comUtils from "@/utils/comUtils";
   import { getToken } from '@/utils/auth';
   import sProgress from '@/components/progress'

  export default {
      name:'simiGenItem',
      data(){
          return {
            tipDialogVisible: false,
            proDialogVisible: false,
            genMessage:"正在分析数据，请稍后！",
            groups:[],
            group:{},
            showProgress:false,
            progressStatus:false,
            color:'#6f7ad3',
            types:comUtils.getCompareTypes(),
            simi_gen_data:{
                   groupName: 0,
                   simiValue:0.9,
                   hideExcept: true,
                   type:'',
                   groupId:0
            },
            rules: {
                groupId: [
                    { required: true, message: '请选择项目', trigger: 'blur' },
                ],
                type: [
                    { required: true, message: '请选择比较对象', trigger: 'blur' },
                ]
            }
          }
      },
      components: {
            sProgress,
         },
       computed:{

      },
      created(){
          this.getGroupList()
          this.simi_gen_data.type=this.types[0].value   
      },
      methods:{
             // 获取项目列表数据
           getGroupList() {
              const _this = this;
              const para = {
                      superuser: getToken('superuser'),
                      groups: comUtils.getCurrentUserGroups()
                    };
                this.$api.group.getGroupList(para).then(res => {
                  _this.groups = res.data.data.groups
                  _this.simi_gen_data.groupId = res.data.data.groups[0].groupId
                  _this.group= this.groups[0]
                  this.$emit('getSimiData',this.simi_gen_data.groupId) 
              });
            },
           
           async statusCheck(){
               const status = {
                     groupId: this.simi_gen_data.groupId,
                     type: 2,
                   };
               const response = await this.$api.exe.getExeStatus(status); 
              if(response.data.data.status==='C'){
                  this.tipDialogVisible = true
              }else{
                    this.$message({
                          message: "其他用户正在分析数据，请稍后",
                          
                      });
              }
           },
           //生成数据
            onAnalyse(genForm) {
              this.tipDialogVisible = false
              this.proDialogVisible = true
              const para = {
                type: this.simi_gen_data.type,
                      groupId: this.simi_gen_data.groupId,
                      hideExcept: this.simi_gen_data.hideExcept,
                      simiValue: this.simi_gen_data.simiValue,
                    };
              this.showProgress = true
                this.$api.notesInfo.analyzeDBSimi(para).then(res => {
                this.progressStatus = true
                this.color = "#5cb87a"
                this.genMessage="数据分析完成并已保存数据到数据库。"
              });
            },

             // 导出excel
           onExport() {
             this.$emit('exportFile')
            },

          groupChange(selVal) {
            this.$emit('getSimiData',selVal)
            },
          handleClose(done) {
            this.$confirm('操作还没有完成可能导致数据丢失，确定要关闭吗？')
              .then(_ => {
                done();
              })
              .catch(_ => {});
            },
          closeProgress () {
              this.showProgress = false
              this.progressStatus = false
              this.color='#6f7ad3'
              this.proDialogVisible=false
              this.$emit('getSimiData',this.simi_gen_data.groupId)
            },
         
          }
  }
</script>

<style lang="less" scoped>
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
    .scaleProgress {
    transform: scaleY(0.75);
    margin-bottom: 50px;
    margin-left: 10px;
    width: 80%;
    //position: fixed;
}
    .msgSpan {
     margin-left: 70px;
     font-size: 15px;
}
</style>
