<template>
	 <div class='footer'>
      
        <p class="beian">{{$t('commons.copyright')}}</p>
    </div>
</template>


<script>
   

export default {
    name: "footerNav",
	data(){
		return {
           
		}
	},
	methods:{

	}
}
</script>

<style lang="less">
	.footer{
        position: fixed;
        bottom: 0px;
        width: 100%;
        padding: 10px 0;
        font-size:12px;
        text-align: center;
        background: #fff;
        position: fixed;
        bottom: 0;
        p{
            line-height: 30px;
        }
        .intro{
            width: 240px;
            margin: 0 auto;
            justify-content: space-between;
            align-items: center;
        }
    }
</style>


