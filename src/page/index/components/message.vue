
<template>
  <div class="logContainer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div  class="msg">
        <span class="svg-icon"><i class="el-icon-message"></i></span>
        <span class="svg-icon">通知公告：</span>
        </div>
      </div>
      <div class="logArea is-scroll-right">
            <div class="item" v-for="(item,index) in logsData" :key="index">
              <p class="timeArea">
                <span class="title">日期：</span>
                <span class="title time">{{item.createDate}}</span>
              </p>
              <div class="logContent">
                  <p class="title">消息内容：</p>
                  <ul class="logUl">
                    <li v-for="(citem,cindex) in item.messages" :key="cindex">{{citem}}</li>
                </ul>
              </div>
          </div>
      </div>
  </el-card>
  </div>
</template>

<script>

  export default {
    name:'msgList',
    data() {
      return {
        logsData:[],
      };
    },
    created(){
      this.getMessage()
    },
    methods: {
      getMessage() {
        const _this = this;
        const param={
          username:this.$store.getters.name,
        }
        this.$api.login.getMessages(param).then(res => {
              _this.logsData = res.data.data;
            });
      }
    }
  }
</script>

<style lang="less" scoped>
.logContainer{
    padding: 10px;
    background: #fff;
    box-sizing: border-box;
    height:370px;
    max-height: 370px;
    overflow: hidden;
    border-radius: 6px;
    .logArea{
       overflow: auto;
       height: 100%;
    }
   
    .item{
       .title{
         font-size: 13px;
       }
       .time{
         color:#87DE75;
       }
        .logContent{
          .logUl{
            padding-left: 30px;
            li{
              font-size: 12px;
              list-style: disc;
              line-height: 20px;
            }
          }
      }
    }
}
  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both;
  }
  .msg {
       background: #84cdf8;
       width: 130px;
       height: 30px;
       text-align: center;
  }
  .svg-icon {
       text-align:center;
       font-size: 20px;
       display:auto;
       
  }

</style>

