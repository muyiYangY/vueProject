<template>
	<div>
		<div class="container">
			<div class="search-box">
				<el-input v-model="query.name" placeholder="输入类别名" class="search-input mr10" clearable></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="categoryId" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="categoryName" label="类别" align="center"></el-table-column>
				<el-table-column prop="categoryLevel" label="分类等级" align="center"></el-table-column>
				<el-table-column prop="categoryParent" label="父级分类" align="center"></el-table-column>
				<el-table-column label="图片" align="center">
					<template #default="scope">
						<el-upload
						class="table-td-thumb"
						action="http://101.200.79.152:8080/category/saveImage"
						:data="() => ({
							'categoryId': scope.row.categoryId,
							'imageFile': selectedImage
						})"
						:show-file-list="false"
						:on-success="(response, file) => handleAvatarSuccess(response, file, scope.row.categoryImg)"
						:before-upload="beforeAvatarUpload"
						:on-error="handleAvatarError"
						:z-index="10">
						<img v-if="scope.row.categoryImg" :src="scope.row.categoryImg" class="table-td-thumb">
						<div v-else>上传图片</div>
						</el-upload>
					</template>
				</el-table-column>
				<el-table-column prop="categoryDesc" label="描述" align="center"></el-table-column>
				<el-table-column label="操作" width="280" align="center">
					<template #default="scope">
						<el-button
							type="primary"
							size="small"
							:icon="Edit"
							@click="handleEdit(scope.$index, scope.row)"
							v-permiss="15"
						>
							修改
						</el-button>
						<el-button
							type="danger"
							size="small"
							:icon="Delete"
							@click="handleDelete(scope.$index, scope.row)"
							v-permiss="16"
						>
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					layout="total, prev, pager, next"
					:current-page="query.pageIndex"
					:page-size="query.pageSize"
					:total="pageTotal"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>
		<el-dialog
			:title="idEdit ? '修改类别' : '新增类别'"
			v-model="visible"
			width="500px"
			destroy-on-close
			:close-on-click-modal="false"
			@close="closeDialog"
		>
			<TableEdit :data="rowData" :edit="idEdit" :update="updateData" />
		</el-dialog>
		<el-dialog title="查看用户详情" v-model="visible1" width="700px" destroy-on-close>
			<TableDetail :data="rowData" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, CirclePlusFilled, View } from '@element-plus/icons-vue';
import { fetchData } from '../api/index';
import TableEdit from '../components/table-edit.vue';
import TableDetail from '../components/table-detail.vue';
import { Plus } from '@element-plus/icons-vue'
import { tableSearch, tableSearchOne, tableDelete } from '../api/ymushapi';

import type { UploadProps } from 'element-plus'
import axios from 'axios';
import type { UploadUserFile } from 'element-plus'

// 图片上传
const imageUrl = ref('')

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile, scope) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  console.log(response);
  scope = response.data;
}

let selectedImage: File | null = null;

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('上传的图片必须为jpg格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('上传图片大小不得大于2MB!')
    return false
  }
  selectedImage = rawFile;
  console.log(selectedImage);
  
  return true
}
const handleAvatarError: UploadProps['onError'] = (error, uploadFile) => {
  ElMessage.error('图片上传失败!')
  console.log(error);
}


// 总的
interface TableItem {
	categoryId: number;
	categoryName: string;
	categoryLevel: number;
	categoryParent: string;
	categoryImg: string;
	categoryDesc: string;
}

const query = reactive({
	address: '',
	name: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = async () => {
	const res = await tableSearch();
	console.log(res);
	tableData.value = res.data.data;
	pageTotal.value = res.data.pageTotal || 50;
};
getData();

// 查询操作   ???????
const handleSearch = async() => {
	const res = await tableSearchOne(query.name)
	//const searchUrl = 'http://182.92.65.28:8080/category/' + query.name
	//const res = await axios.get(searchUrl);
	console.log(res.data.data);
	tableData.value = res.data.data;
	query.pageIndex = 1;
	// getData();
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};

// 删除操作
const handleDelete = (index: number, row: TableItem) => {
	let dataE = row;
	let categoryId = dataE.categoryId
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(async () => {
			const res = await tableDelete(categoryId);
			console.log(res);
			if(res.data.code == 200) {
				ElMessage.success('删除成功');
				tableData.value.splice(index, 1);
				console.log(res);
			} else {
				ElMessage.error('删除失败');
				console.log(res);
				
			}
		})
		.catch(() => {});
};
// 上传图片
/* const handleSuccess = (response, file, fileList) => {
  ElMessage.success('图片上传成功');
  // 在这里添加处理上传成功后的逻辑
  getData(); // 更新表格数据
}; */

/* const beforeUpload = (file) => {
  // 在这里添加上传图片前的逻辑，例如检查图片格式、大小等
}; */
const visible = ref(false);
let idx: number = -1;
const idEdit = ref(false);
const rowData = ref({});
const handleEdit = (index: number, row: TableItem) => {
	idx = index;
	rowData.value = row;
	idEdit.value = true;
	visible.value = true;
};
const updateData = (row: TableItem) => {
	idEdit.value ? (tableData.value[idx] = row) : tableData.value.unshift(row);
	console.log(tableData.value);
	closeDialog();
};

const closeDialog = () => {
	visible.value = false;
	idEdit.value = false;
};

const visible1 = ref(false);
const handleView = (row: TableItem) => {
	rowData.value = row;
	visible1.value = true;
};
</script>

<style scoped>
.search-box {
	margin-bottom: 20px;
}

.search-input {
	width: 200px;
}

.mr10 {
	margin-right: 10px;
}
.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
</style>
