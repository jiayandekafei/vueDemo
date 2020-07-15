<template>
    <div class="fillcontain" ref="fillcontain">
        <el-dialog title="提示" :visible.sync="tipDialogVisible" width="30%" :before-close="handleClose">
         <span >将会导出</span>
         <span slot="footer" class="dialog-footer">
            <el-button @click="tipDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click='dbExport("exportForm")'>确 定</el-button>
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
        <div class="info_container" ref="info_container">
            <el-row class="info_row row" :gutter="10">
            <el-col :span="8">
            <div class="area">
                <p class="title"><i class="fa fa-edit"></i>DB 导出</p>
                <el-form class="form"  :model="exportForm" :rules="exportRules" ref="exportForm" label-width="80px">
                    <el-form-item label="导出形式:">
                      <el-radio-group v-model="exportForm.type">
                        <el-radio label="1">单个</el-radio>
                        <el-radio label="2">多个</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item  v-if="exportForm.type==='1'" label="DB名称:" prop="dbName">
                        <el-input v-model="exportForm.dbName" size="mini" placeholder="请输入要导出的DB名(英文)"></el-input>
                    </el-form-item>
                    <el-form-item  label="项目:" prop="groupId">
                      <el-select  v-model="exportForm.groupId" auto-complete="off" placeholder="请选择需要导出的项目组">
                        <el-option v-for="item in groups" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="statusCheck()">提交</el-button>
                        <el-button @click="resetForm('exportForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import * as mutils from "@/utils/mUtils";
    import * as comUtils from "@/utils/comUtils";
    import { getToken } from '@/utils/auth';
    import sProgress from '@/components/progress'

    export default {
        data(){
            return {
                groups:[],
                showProgress:false,
                progressStatus:false,
                tipDialogVisible: false,
            　　proDialogVisible: false,
                color:'#6f7ad3',
            　　genMessage:"正在分析数据，请稍后！",
               exportForm:{
                   type:'2',
                   dbName:'',
                   groupId:''
               },
               exportRules: {
                    dbName: [
                        { required: true, message: '请输入DB名称', trigger: 'blur' },
                    ],
                   
                    groupId: [
                        { required: true, message: '请选择项目组', trigger: 'blur' },
                    ],
                    
               },
            };
        },
         components: {
            sProgress,
         },
        created(){
           this.getGroupList()
        },
      	mounted() {
            mutils.setContentHeight(this,this.$refs.fillcontain,170);
	    },
        methods: {
            dbExport(formName) {
              this.tipDialogVisible = false
              this.proDialogVisible = true
              this.showProgress = true
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var param={ type: this.exportForm.type,
                                    groupId:this.exportForm.groupId,
                                    dbName:this.exportForm.dbName
                                    }; 
                        this.$api.notesInfo.exportDBInfo(param).then(res =>{
                                    this.progressStatus = true
                                    this.color = "#5cb87a"
                                    this.genMessage="数据分析完成并已保存数据到数据库。"
                                });
                        }
                    
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 获取项目列表数据
           getGroupList() {
              const _this = this;
              const para = {
                      superuser: getToken('superuser'),
                      groups: comUtils.getCurrentUserGroups()
                    };
                this.$api.group.getGroupList(para).then(res => {
                res.data.data.groups.forEach(group=>{
                      var cust ={
                        value:group.groupId,
                        label:group.groupname
                      }
                      this.groups.push(cust)
                });
              });
            },

            async statusCheck(){
               const status = {
                     groupId: this.exportForm.groupId,
                     type: 1,
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
            },
        }
    }
</script>

<style lang="less" scoped>
    .info_container{
       padding: 20px;
       background: #fff;
       box-sizing: border-box;
       overflow: auto;
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
   .info_row{
        .area{
           border:1px solid #dfdfdf;
           height:100%;
           font-size:14px;
           padding:10px;
           .form{
               width:90%;
               margin-top:20px;
           }
        }
    .scaleProgress {
        transform: scaleY(0.75);
        margin-bottom: 50px;
        margin-left: 10px;
        width: 80%;
        //position: fixed;
}
   }
</style>


