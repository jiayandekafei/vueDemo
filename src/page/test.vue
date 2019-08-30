<template>
    <div class="tree">     
    <el-tree :data="data5" node-key="id" default-expand-all >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <el-radio v-if="showRadio(node)" v-model="node.radio" :label="node.id">{{ node.label }}</el-radio>
        <span v-else>{{ node.label }}</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
    export default {
        data () {
             const data = [{
                    id: 1,
                    label: '一级 1',
                    children: [{
                    id: 4,
                    label: '二级 1-1',
                    children: [{
                        id: 9,
                        label: '三级 1-1-1',
                        radio: ''
                    }, {
                        id: 10,
                        label: '三级 1-1-2',
                        radio: ''
                    }]
                    }]
                }, {
                    id: 2,
                    label: '一级 2',
                    children: [{
                    id: 5,
                    label: '二级 2-1',
                    radio: ''
                    }, {
                    id: 6,
                    label: '二级 2-2',
                    radio: ''
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    children: [{
                    id: 7,
                    label: '二级 3-1',
                    radio: ''
                    }, {
                    id: 8,
                    label: '二级 3-2',
                    radio: ''
                    }]
              }];
        return {
            data5: JSON.parse(JSON.stringify(data))
              }
        },
        methods: {
            showRadio(node){
                return node.childNodes.length === 0 ? true : false
            },
            handleClick(data, checked, node){
                 if(checked == true){
                     this.checkedId = data.id;
                     this.$refs.treeForm.setCheckedNodes([data]);
                 }
            },
            nodeClick(data,checked,node){
                this.checkedId = data.id
                this.$refs.treeForm.setCheckedNodes([data]);
                
            },
            checkGroupNode: function (a, b) {
                if (b.checkedKeys.length > 0) {
                this.$refs.DeviceGroupTree.setCheckedKeys([a.id]);
                }
            }
        }
    }
</script>

<style scoped>

</style>