<template>
  <div class="search_container searchArea">
        <el-form 
            :inline="true" 
            :model='search_data' 
            :rules="rules"
            ref="search_data" 
            class="demo-form-inline search-form">
            <el-form-item label="">
                <el-input v-model="search_data.name" placeholder="客户名"  @keyup.enter.native='onScreeoutGroup("search_data")'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size ="mini" icon="search" @click='onScreeoutGroup("search_data")'>筛选</el-button>
            </el-form-item>

            <el-form-item class="btnRight">
                <el-button type="primary" size ="mini" icon="view" @click='onBatchDelGroup()' :disabled="searchBtnDisabled">批量删除</el-button>
                <el-button type="primary" size ="mini" icon="view" @click='onAddGroup()'>添加</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
   import { mapGetters } from 'vuex'

  export default {
      name:'searchItem',
      data(){
          return {
            search_data:{
                name:''
            },
            rules: {
                name: [
                    { required: true, message: '请输入项目名', trigger: 'blur' },
                ]
            }
          }
      },
       computed:{
        ...mapGetters(['searchBtnDisabled']),

      },
      created(){
      },
      methods:{
          onScreeoutGroup(searchForm){
              this.$refs[searchForm].validate((valid) => {
					if (valid) {
                        this.$store.commit('SET_SEARCH',this.search_data);
                        this.$emit("searchList");
                    }
              })
          },
          onAddGroup(){
              this.$emit("showDialog",'add');
          },
          onBatchDelGroup(){
              this.$emit("onBatchDelGroup");
          }
      }
  }
</script>

<style lang="less" scoped>
    .search_container{
        margin-bottom: 20px;
    }
    .btnRight{
        float: right;
        margin-right: 0px !important;
    }
    .searchArea{
        background:rgba(255,255,255,1);
        border-radius:2px;
        padding: 18px 18px 0;
    }
</style>
