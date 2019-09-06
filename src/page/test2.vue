<template>
    
<el-tree
    :data="treeData"
    :default-expanded-keys="parentEditArr"
    :default-checked-keys="editArr"
    ref="tree"
   
    node-key="id"
    show-checkbox
    @check="setSelectedNode"/>
</template>

<script>
    export default {
        
data () {
    return {
      editArr: [], // 设置默认选中
      parentEditArr: [], // 设置默认展开
      treeData: [{
                   id: 10,
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
                    radio:5
                     },{
                      id: 2,
                    label: 'group1',
                    children: [{
                        id: 6,
                        label: 'admin'
                    }, {
                        id: 7,
                        label: 'PM'
                    }, {
                        id: 8,
                        label: 'user'
                    }],
                    radio:0
                     }],
                     checkedList:[]
                }
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    };
  },
        methods: {
             setSelectedNode(data) {
                 console.log(data);
                this.$refs.tree.setCheckedNodes([data]);
                const node = this.$refs.tree.getCheckedNodes();
                console.log(node[0].id);
                this.editArr = [node[0].id];
                }
        }
    }
</script>

<style scoped>

</style>