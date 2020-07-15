<template>
    <div class="fillcontain">
         <search-item @searchList="searchList" :type=4 :dbName="dbName"></search-item>
        <div class="tabContainer" ref="tabContainer">
            <el-tabs type="border-card">
                <el-tab-pane>
                    <span slot="label" @click="toggleTabs('formInfo')"><i class="fa fa-camera-retro"></i>form信息</span>
                    <info-tabs-table :toggleData="toggleData" :pageData="pageData" :dbName="dbName" @resetToalData="resetToalData" ref="InfoTab"></info-tabs-table>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label" @click="toggleTabs('viewInfo')"><i class="fa fa-camera-retro"></i>view信息</span>
                    <info-tabs-table :toggleData="toggleData" :pageData="pageData"  :dbName="dbName" @resetToalData="resetToalData" ref="InfoTab"></info-tabs-table>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label" @click="toggleTabs('agentInfo')"><i class="fa fa-camera-retro"></i>agent信息</span>
                    <info-tabs-table :toggleData="toggleData" :pageData="pageData" :dbName="dbName" @resetToalData="resetToalData" ref="InfoTab"></info-tabs-table>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label" @click="toggleTabs('simi')"><i class="fa fa-camera-retro"></i>form类似性</span>
                    <simi-tab-table :toggleData="toggleData" :dbName="dbName" ></simi-tab-table>
                </el-tab-pane>
               
            </el-tabs>
             <pagination v-if="toggleData!=='simi'" :pageTotal="pageTotal" :pageSize="pageData.pageSize" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
        </div>
    </div>
</template>

<script>
    import infoTabsTable from './components/infoTabsTable'
    import simiTabTable from './components/simiTabTable'
    import Pagination from "@/components/pagination"
    import searchItem from "./components/searchItem";

    export default {
        data(){
            return {
                toggleData:'',
                dbName:'',
                pageTotal:0,
                  pageData: {
                    pageNo: 1,
                    pageSize: 10,
                  },
            }
        },
        components: {
             infoTabsTable,
             simiTabTable,
             Pagination,
             searchItem,
        },
        mounted(){
            //  this.setTabHeight();
            //  window.onresize = () => {
            //     this.setTabHeight();
            //  }
            this.toggleData="formInfo"
            this.dbName = this.$route.params.dbName
            this.toggleTabs('formInfo')
        },
     
        methods: {
            searchList(searchObj) {
                this.search = searchObj;
                this.toggleTabs(this.toggleData);
                },
            setTabHeight(){
                this.$nextTick(() => {
                    this.$refs.tabContainer.style.height =  (document.body.clientHeight - 160)+'px'
                })
            },
            toggleTabs(item){
                // this.pageTotal.pageNo=1,
                // this.pageTotal.pageSize=10,
                this.toggleData=item;
            },
            resetToalData(val){
             this.pageTotal=val
            },
             // 上下分页
            handleCurrentChange(val) {
            this.pageData.pageNo = val;
            },
            // 每页显示多少条
            handleSizeChange(val) {
            this.pageData.pageSize = val;
            },
        }
    }
</script>

<style lang="less" scoped>
    .fa{
        margin-right:5px;
    }
  
</style>
