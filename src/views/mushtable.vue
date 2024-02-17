<template>
	<div>
		<div class="container">
			<div class="search-box">
				<el-input v-model="query.name" placeholder="用户名" class="search-input mr10" clearable></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="mushroomId" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="mushroomName" label="菌菇名" align="center"></el-table-column>
				<el-table-column prop="category" label="父级分类"></el-table-column>
				<el-table-column prop="mushroomImage" label="图片" align="center">
					<template #default="scope">
						<div
							@click="upCategoryImg(scope.$index, scope.row)">查看图片</div>
					</template>
					<!-- <div @click="upCategoryImg = true">查看图片</div> -->
				</el-table-column>
				<el-table-column prop="isEat" label="是否能食用"></el-table-column>
				<el-table-column prop="isPoison" label="是否有毒"></el-table-column>
				<el-table-column prop="mushroomLocation" label="分布地点" align="center"></el-table-column>
				<!-- <el-table-column prop="env" label="生长环境" align="center"></el-table-column> -->
				<el-table-column prop="mushroomDesc" label="描述" align="center"></el-table-column>
				<el-table-column prop="mushroom3d" label="3d模型" align="center"></el-table-column>

				<!-- <el-table-column prop="date" label="注册时间" align="center"></el-table-column> -->
				<el-table-column label="操作" width="280" align="center">
					<template #default="scope">
						<el-button
							type="primary"
							size="small"
							:icon="Edit"
							@click="handleEdit(scope.$index, scope.row)"
							v-permiss="15"
						>
							编辑
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
			:title="idEdit ? '修改菌菇' : '添加菌菇'"
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
		<el-dialog
			title="上传图片"
			v-model="cansee"
			width="500px"
			destroy-on-close
			:close-on-click-modal="false"
		>
			<MushroomImg :data="imgData" :update="updateImg"/>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, CirclePlusFilled, View } from '@element-plus/icons-vue';
import { fetchData } from '../api/mush';
import TableEdit from '../components/mushtable-edit.vue';
import TableDetail from '../components/table-detail.vue';
import MushroomImg from '../components/mushrooms-img.vue'
import axios from 'axios';

// 定义一个接口，用于定义数据表格中每个项目的类型
interface TableItem {
	mushroomId: number;
	mushroomName: string;
	category: string;
	mushroomImage: string;
	isEat: number;
	isPoison: number;
	mushroomLocation: string;
	mushroomDesc: string;
	mushroom3d: string;
}

const query = reactive({
	address: '',
	name: '',
	pageIndex: 1,
	pageSize: 10
});
// 存储表格数据
const tableData = ref<TableItem[]>([]);

// 存储分页总数
const pageTotal = ref(0);

// 获取表格数据
const getData = async () => {
	const res = await fetchData();
	console.log(res.data.data);
	const eg = [
		{
			mushroomId: 0,
			mushroomName: '蘑菇',
			category: 'ke',
			mushroomImage: '0',
			isEat: 1,
			isPoison: 0,
			mushroomLocation: '杭州',
			mushroomDesc: '蘑菇',
			mushroom3d: '0'
		}
	]
	tableData.value = res.data.data;
	// tableData.value = eg
	// pageTotal.value = res.data.pageTotal || 50;
};
getData();

// 查询操作
const handleSearch = async() => {
	const searchUrl = 'http://182.92.65.28:8080/mushrooms/getMushroomByCategory' + query.name
	const res = await axios.get(searchUrl);
	console.log(res.data.data);
	tableData.value = res.data.data;
	// query.pageIndex = 1;
	// getData();
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};

// 删除操作
const handleDelete = (index: number, row: TableItem) => {
	let dataF = row
	let mushroomId = dataF.mushroomId;
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(async () => {
			console.log(mushroomId);
			
			const deleteUrl = 'http://182.92.65.28:8080/mushrooms/' + mushroomId;
			await axios.delete(deleteUrl, {
				params: {
					id: mushroomId
				}
			})
			.then(res => {
				console.log(res);
				ElMessage.success('删除成功');
				tableData.value.splice(index, 1);
			});
			
		})
		.catch(() => {});
};

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

// 更行数据
const updateData = (row: TableItem) => {
	idEdit.value ? (tableData.value[idx] = row) : tableData.value.unshift(row);
	console.log(tableData.value);
	closeDialog();
};

const closeDialog = () => {
	visible.value = false;
	idEdit.value = false;
};
const updateImg = (row: TableItem) => {
	// 
}

const visible1 = ref(false);
/* const handleView = (row: TableItem) => {
	rowData.value = row;
	visible1.value = true;
}; */

// 图片上传
const cansee = ref(false)
const imgData = ref({})
const upCategoryImg = (index: number, row: TableItem) => {
	idx = index
	imgData.value = row
	cansee.value = true
}
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
