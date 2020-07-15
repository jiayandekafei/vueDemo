<template>
    <div class="fillcontain" ref="fillcontain">
        <el-dialog title="提示" :visible.sync="tipDialogVisible" width="30%" :before-close="handleClose">
         <span ></span>
         <span slot="footer" class="dialog-footer">
            <el-button @click="tipDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click='dbExport("transformForm")'>确 定</el-button>
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
                <p class="title"><i class="fa fa-edit"></i>AAE转换</p>
                <el-form class="form"  :model="transformForm" :rules="exportRules" ref="transformForm" label-width="80px">
                    <el-form-item label="转换形式:">
                      <el-radio-group v-model="transformForm.type">
                        <el-radio label="1">单个</el-radio>
                        <el-radio label="2">多个</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item  v-if="transformForm.type==='1'" label="DB名称:" prop="dbName">
                        <el-input v-model="transformForm.dbName" size="mini" placeholder="请输入要导出的DB名(英文)"></el-input>
                    </el-form-item>
                    <el-form-item  label="项目:" prop="groupId">
                      <el-select  v-model="transformForm.groupId" auto-complete="off" placeholder="请选择需要导出的项目组">
                        <el-option v-for="item in groups" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item label="色系:" prop="color">
                        <el-select  v-model="transformForm.color" auto-complete="off" placeholder="请选择色系">
                            <el-option v-for="item in colors" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="statusCheck()">提交</el-button>
                        <el-button @click="resetForm('transformForm')">重置</el-button>
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
    import base from '@/api/base' 
    export default {
        data(){
              //validate dbName 
            let validateDBName = (rule, value, callback) => {
                    if(value == ''){
                        callback(new Error('请输入DB名'));
                        return;
                    }
                    let dbNameRegex = /^[^\u4E00-\u9FA5]+$/;
                    if (!dbNameRegex.test(value)) {
                        callback(new Error('请输入英文DB名！'))
                    } else {
                        callback();
                    }
                };
            return {
                groups:[],
                showProgress:false,
                progressStatus:false,
                tipDialogVisible: false,
            　　proDialogVisible: false,
                color:'#6f7ad3',
            　　genMessage:"正在分析数据，请稍后！",
               transformForm:{
                   type:'2',
                   dbName:'',
                   groupId:'',
                   color:'',
               },
               
               exportRules: {
                    dbName: [
                        { required: true, validator:validateDBName, trigger: 'blur' },
                    ],
                   
                    groupId: [
                        { required: true, message: '请选择项目组', trigger: 'blur' },
                    ],
                    color: [
                        { required: true, message: '请选择色系', trigger: 'blur' },
                    ],
                    
               },
               colors: [{
				value: '01',
				label: '青系'
				}, {
				value: '02',
				label: '緑系'
				}, {
				value: '03',
				label: '茶色系'
				}, {
				value: '04',
				label: '紫系'
				}],
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
            async dbExport(formName){
              this.tipDialogVisible = false
              this.proDialogVisible = true
              this.showProgress = true
                var param={ type: this.transformForm.type,
                            groupId:this.transformForm.groupId,
                            dbName:this.transformForm.dbName,
                            color:this.transformForm.color
                            }; 
                
                const response = await this.$api.aae.transform(param); 
                if(response.data.code===200){
                    this.genMessage='转换成功'
                    this.progressStatus = true
                    this.color = "#5cb87a"
                    var downPara={
                            groupId:this.transformForm.groupId,
                            fileName:response.data.data,
                    }
                    this.downLoad(downPara)
                }else{
                     this.genMessage='转换成功'
                     this.progressStatus = true
                     this.color = "#5cb87a"
                    }
                },
            downLoad(param) {
                var elemIF = document.createElement('iframe')
                elemIF.src = base.dev + '/file/download?fileName=' + param.fileName+'&groupId=' +param.groupId +'&type='+5
                elemIF.style.display = 'none'
                document.body.appendChild(elemIF)
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
                this.tipDialogVisible = true
            //    const status = {
            //          groupId: this.transformForm.groupId,
            //          type: 1,
            //        };
            //    const response = await this.$api.exe.getExeStatus(status); 
            //   if(response.data.data.status==='C'){
            //       this.tipDialogVisible = true
            //   }else{
            //         this.$message({
            //               message: "其他用户正在分析数据，请稍后",
                          
            //           });
            //   }
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


