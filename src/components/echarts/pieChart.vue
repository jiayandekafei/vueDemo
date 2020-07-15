<template>
    <div :id="id" class="orderArea"></div>
</template>
<script>
	import echarts from 'echarts'
    import echartsTheme from "./theme/westeros.json";
    export default {
        data(){
            return {
				 id:'ordertype',
				 myChart:null
            }
		},
		 props: {
            type: {
                type: String,
                default() {
                    return "ordertype"
                }
			},
			 groupId: {
                type: Number,
                default() {
                    return 0
				 }
			  },
			  reload: {
                type: Boolean,
                default() {
                    return false
				}
			  },
        },
        created(){
			this.loadChart(this.type);
		},
		beforeDestroy() {
			if (!this.myChart) {
				return
			}
			this.myChart.dispose();
			this.myChart = null;
        },
        methods: {
         	 async loadChart(type){
				 let  text= type==='simi'?"DB Similarity chart":"用户分布图";
				 const response = type==='simi'? await this.$api.notesInfo.getDBSimiPieData({groupId:this.groupId}):await this.$api.user.getUserPieData()
				 let data = {
					  title : {
						text: text,
						x:'center'
					},
					tooltip : {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
						orient: 'vertical',
						left: 'left',
						data: type==='simi'?response.data.data.categoryNo:response.data.data.groupNames
					},
					series : [
						{
							name: '比例',
							type: 'pie',
							radius : '50%',
                            center: ['60%', '50%'],
							data:type==='simi'?response.data.data.dbSimiPie:response.data.data.usePie,
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						},
					
					]
				   }
				    echarts.registerTheme('westeros', echartsTheme)
                    this.myChart = echarts.init(document.getElementById(this.id),'westeros');
                    this.myChart.setOption(data);
				
				return data;
			},
		},
	 watch: {
            // 监听属性的变化，可以接收参数;
            reload(v) {
				if(v){
					this.loadChart('simi');
				}
			},
			 groupId(v) {
					this.loadChart('simi');
            },
         },
    }
</script>

<style lang="less">

</style>
