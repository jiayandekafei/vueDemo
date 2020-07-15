<template>
    <div class="fillcontain" ref="fillcontain">
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
                        <el-button type="primary" @click="submitForm('exportForm')">提交</el-button>
                        <el-button @click="resetForm('exportForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            </el-col>

            <el-col :span="8">
                <div class="area">
                    <div class="simiarea">
                        <p class="title"><i class="fa fa-edit"></i>DB分类</p>
                            <el-form class="form"  :model="simiForm" :rules="simiRules" ref="simiForm" label-width="100px">
                            <el-form-item label="原密码" prop="password">
                                <el-input type="password" v-model="simiForm.password" auto-complete="off" size="mini" placeholder="请输入原密码"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('simiForm')">提交</el-button>
                                <el-button @click="resetForm('simiForm')">重置</el-button>
                            </el-form-item>
                            </el-form>
                    </div>
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

    export default {
        data(){
            return {
               groups:[],
               exportForm:{
                   type:'2',
                   dbName:'',
                   groupId:''
               },
               simiForm:{
                   password:'',
                   
               },
               exportRules: {
                    dbName: [
                        { required: true, message: '请输入DB名称', trigger: 'blur' },
                    ],
                   
                    groupId: [
                        { required: true, message: '请选择项目组', trigger: 'blur' },
                    ],
                    
               },
               simiRules: {
                    password: [
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                    ],
                   
               },
            };
        },
        created(){
           this.getGroupList()
        },
      	mounted() {
            mutils.setContentHeight(this,this.$refs.fillcontain,170);
	    },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formName === 'simiForm'){
                            this.showMessage('success','修改密码成功~');
                        }else if(formName === 'exportForm'){ 
                            var param={ type: this.exportForm.type,
                                        groupId:this.exportForm.groupId,
                                        dbName:this.exportForm.dbName
                                        }; 
                            this.$api.notesInfo.exportDBInfo(param).then(res =>{
                                      this.$message({
                                            message: "导出",
                                            type: "success"
                                        });
                                    });
                        }
                     } else {
                        return false;
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
   }
</style>


