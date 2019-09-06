<template>
    <div class="tree">     
    <el-tree :data="data5" node-key="id"  default-expand-all >
      <span class="custom-tree-node" slot-scope="{node}">
        <el-radio v-if="showRadio(node)" v-model="node.parent.radio" :label="node.id" @change="setParent(node)" >{{ node.label }}</el-radio>
        <el-checkbox v-else-if="showCheckbox(node)" v-model="node.checked" @change="clearChildren(node)">{{ node.label }}</el-checkbox> 
        <span v-else>{{ node.label }}</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
    export default {
        data () {
             const data = [{
                    label: '所属项目组及其角色',
                    children: [{
                    id: 1,
                    label: 'group1',
                    children: [{
                        id: 3,
                        label: 'admin'
                    }, {
                        id: 4,
                        label: 'PM'
                    }, {
                        id: 5,
                        label: 'user'
                    }],
                    radio:'',
                    checked:true
                     }]
                }];
        return {
            data5: JSON.parse(JSON.stringify(data)),

              }
        },
        methods: {
            showRadio(node){
                return node.childNodes.length === 0 ? true : false
            },
            showCheckbox(node){
                return node.childNodes.length === 3 ? true : false
            },
            setParent(node){

                 node.parent.checked = true
            },
            clearChildren(node){
          if(node.checked===false)     
                {
                node.radio= ''
                } 
                
            }
        }
    }
</script>

<style scoped>

</style>