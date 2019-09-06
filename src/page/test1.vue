<template>
<div class="hello">
{{msg}}
<el-tree
:data="data2"
show-checkbox
node-key="id"
:default-expanded-keys="[2, 3]"
:default-checked-keys="[5]"
:props="defaultProps">
<span slot-scope="{node,data}">
<span style="color:red">0000{{data.id}}</span>
</span>
</el-tree>
</div>
</template>

<script>
export default {
name: 'HelloWorld',
data () {
return {
msg: 'Welcome to Your Vue.js App',
data2: [{
id: 1,
label: '一级 1',
children: [{
id: 4,
label: '二级 1-1',
children: [{
id: 9,
label: '三级 1-1-1'
}, {
id: 10,
label: '三级 1-1-2'
}]
}]
}, {
id: 2,
label: '一级 2',
children: [{
id: 5,
label: '二级 2-1'
}, {
id: 6,
label: '二级 2-2'
}]
}, {
id: 3,
label: '一级 3',
children: [{
id: 7,
label: '二级 3-1'
}, {
id: 8,
label: '二级 3-2'
}]
}],
defaultProps: {
children: 'children',
label: 'label'
}
}
}
}
</script>

<style scoped>
</style>