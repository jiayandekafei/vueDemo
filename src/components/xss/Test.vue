 <template>
    <p v-html="$xss(msg)">
        
    </p>
</template>

<script>
    export default {
        data() {
            return {
                msg: "<a onclick=\"alert('ff')\">aaa<\/a>"
               // msg: "<a href=\"https://www.baidu.com\">aaa<\/a>"
            }
        },
       
    }
</script>