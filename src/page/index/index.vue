<template>
<section class="data_section" ref="data_section"  v-loading.fullscreen.lock="loading"> 
<el-row :gutter="10" class="row_list">
<el-col :span="24">
<div class="row_right row_base">
<el-col :span="6">
<div class="likeBgcolor data_list rflex">
<div class="leftItem cflex wflex">
<p class="investor">{{ $t('index.userNumber') }}</p>
<p class="number">{{this.userCount}}<span class="perTitle">({{ $t('index.person') }})</span></p>
<p class="cardText">Decreased by 50%</p>
</div>
<div class="rightItem">
   <span class="svg-icon"><i class="el-icon-user"></i></span>
</div>
</div>
</el-col>
<el-col :span="6">
<div class="pay taxBgcolor data_list rflex">
<div class="leftItem cflex wflex">
<p class="investor">{{ $t('index.projectNumber') }}</p>
<p class="number">{{this.groupCount}}<span class="perTitle">({{ $t('index.customer') }})</span></p>
<p class="cardText">Decreased by 30%</p>
</div>
<div class="rightItem">
<span class="svg-icon"><i class="el-icon-s-marketing"></i></span>
</div>
</div>
</el-col>
<el-col :span="6">
<div class="linkBgColor data_list rflex">
<div class="leftItem cflex wflex">
<p class="investor">{{ $t('index.customerNumber') }}</p>
<p class="number">{{this.customerCount}}<span class="perTitle">({{ $t('index.customer') }})</span></p>
<p class="cardText">Decreased by 30%</p>
</div>
<div class="rightItem">
<span class="svg-icon"><i class="el-icon-s-custom"></i></span>
</div>
</div>
</el-col>
<el-col :span="6">
<div class="keleBgColor data_list rflex">
<div class="leftItem cflex wflex">
<p class="investor">{{ $t('index.wattingUserNumber') }}</p>
<p class="number">{{this.waitUserCount}}<span class="perTitle">({{ $t('index.person') }})</span></p>
<p class="cardText">Decreased by 80%</p>
</div>
<div class="rightItem">
<span class="svg-icon"><i class="el-icon-user"></i></span>
</div>
</div>
</el-col>
</div>
</el-col>
</el-row>
<el-row :gutter="10" class="row_list order_list">
<el-col :span="7">
<msg-list></msg-list>
</el-col>
<el-col :span="10">
<bar-chart type="barChart" ></bar-chart>
</el-col>
<el-col :span="7">
    <pie-chart type="ordertype" ></pie-chart>
</el-col>
</el-row>
</section>
</template>

<script>
/* eslint-disable */ 
import msgList from "./components/message";  // 日志列表
import barChart from '@/components/echarts/barChart' // 
import pieChart from '@/components/echarts/pieChart' // 用户分布图

export default {
 data(){ 
    return {
	   loading:true,
	   userCount:0,
	   customerCount:0,
	   groupCount:0,
	   waitUserCount:0
       }
     },
  components: {
	  msgList,
    barChart,
    pieChart,
   },
   created(){
     this.getStatistics()
	},
	mounted(){
	this.loading = false;
	},
   methods: {
    getStatistics(type, message) {
	  const _this =this;
      this.$api.login.getStatistics().then(res => {
             _this.userCount=res.data.data.sumUser
             _this.groupCount=res.data.data.sumGroup
			 _this.customerCount=res.data.data.sumCustomer
			 _this.waitUserCount=res.data.data.sumWaitUser
              });
	   }
	 },
}
</script>

<style lang="less" scoped>
.data_section{
margin: 20px;
border-radius: 2px;
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
height: 370px;
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
.data_list{
text-align: center;
font-size: 14px;
            border-radius: 6px;
padding: 10px;
color:#fff;
height: 80px;
.leftItem{
align-items: start;
justify-content: space-between;
text-align: center;
}
.rightItem{
width:62px;
display: flex;
align-items: center;
justify-content: center;
.svg-icon{
font-size: 30px;
}
}
    .number{
font-size: 22px;
font-weight: bold;
.perTitle{
font-size: 13px;
       margin-left: 5px;
}
}
}
.pay{
.leftItem{
justify-content: space-around;
}
}

}
  
</style>
