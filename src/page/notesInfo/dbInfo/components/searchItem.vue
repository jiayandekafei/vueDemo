<template>
  <div class="search_container searchArea">
    <el-form :inline="true" :model="search_data" ref="search_data" class="demo-form-inline search-form">
      <el-form-item label="">
        <el-select v-model="groupId" @change="onScreeoutGroup('search_data')" placeholder="请选择组" >
          <el-option  v-for="item in groupList" :key="item.groupId" :label="item.groupname" :value="item.groupId" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="search_data.enName" placeholder="DB名(英文)"  @keyup.enter.native='onScreeoutGroup("search_data")'></el-input>
      </el-form-item>
       <el-form-item label="">
        <el-input width="500" v-model="search_data.jpName" placeholder="DB名(日文)"  @keyup.enter.native='onScreeoutGroup("search_data")'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="search" @click="onScreeoutGroup('search_data')" >筛选</el-button>
      </el-form-item>
      <el-form-item class="btnRight">
        <el-button type="primary" size ="mini" icon="view" @click='onExport()'>导出excel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as comUtils from "@/utils/comUtils";
import { getToken } from "@/utils/auth";
import base from '@/api/base' 
export default {
  name: "searchItem",
  data() {
    return {
      groupList: [],
      groupId: "",
      search_data: {
        groupId:''
      }
    };
  },
  props:{
          type:[Number],
          dbName:[String],
        },
  created() {
    this.getGroupList();
  },
  methods: {
    // 获取项目列表数据
    getGroupList() {
      const _this = this;
      const currentGroup = {
        superuser: getToken("superuser"),
        groups: comUtils.getCurrentUserGroups()
      };
      const para = Object.assign({}, currentGroup);
      this.$api.group.getGroupList(para).then(res => {
        _this.groupList = res.data.data.groups;
        if (_this.groupList.length > 0) {
          _this.groupId = _this.groupList[0].groupId;
          _this.onScreeoutGroup("search_data");
        }
      });
      return _this.groupList;
    },
    onScreeoutGroup(searchForm) {
      const _this = this;
      _this.$refs[searchForm].validate(valid => {
        if (valid) {
          // _this.groupList.forEach(item => {
          //   if (item.groupId == _this.groupId) {
          //     _this.search_data.groupId = item.groupId;
          //   }
          // });
          _this.search_data.groupId = _this.groupId;
          this.$emit("searchList", _this.search_data);
        }
      });
    },
     onExport() {
          var elemIF = document.createElement('iframe')
          elemIF.src = base.dev +'/file/download?groupId=' + this.groupId + '&type='+this.type + '&fileName=' + this.dbName
          elemIF.style.display = 'none'
          document.body.appendChild(elemIF)
        },
  }
};
</script>

<style lang="less" scoped>
.search_container {
  margin-bottom: 20px;
}
.btnRight {
  float: right;
  margin-right: 100px !important;
}
.searchArea {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  padding: 18px 18px 0;
}
</style>
