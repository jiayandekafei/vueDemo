	<!--列表-->
		<template>
			<el-table :data="users" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="username" label="username" width="120" sortable>
				</el-table-column>
				<el-table-column prop="password" label="password" width="500" sortable>
				</el-table-column>
			</el-table>
		</template>
    <script>
	export default {
		data() {
			return {
				users: [
				]
			}
		},
		methods: {
			//获取用户列表
			getUser() {
               let _this=this;
			   this.$api.user.userList({
                            }).then(res => {
                            this.users=res.data.data.users;
                            });
			}
		},
		created() {
			this.getUser();
		}
	};

</script>

<style scoped>

</style>