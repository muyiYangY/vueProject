<template>
	<div>
		<div class="container">
			<div class="search-box">
				<el-input v-model="query.name" placeholder="输入菌菇名" class="search-input mr10" clearable></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="mushroomId" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="mushroomName" label="菌菇名" align="center"></el-table-column>
				<el-table-column prop="category" label="父级分类"></el-table-column>
				<el-table-column prop="mushroomImage" label="图片" align="center">
					<template #default="scope">
						<a href="javascript:void(0)" @click="upCategoryImg(scope.$index, scope.row)" style="color: red; font-style: italic;">查看图片</a>
						<!-- <div
							@click="upCategoryImg(scope.$index, scope.row)">查看图片
						</div> -->
					</template>
					<!-- <div @click="upCategoryImg = true">查看图片</div> -->
				</el-table-column>
				<el-table-column prop="isEat" label="是否能食用"></el-table-column>
				<el-table-column prop="isPoison" label="是否有毒"></el-table-column>
				<!-- <el-table-column prop="mushroomLocation" label="分布地点" align="center" width="150"></el-table-column> -->
				<el-table-column prop="locations" label="分布地点" align="center" width="150">
					<!-- <el-table-column label="省级行政区"/>
					<el-table-column label="城市"/> -->
					<template #default="scope">
						<div v-for="(location, index) in scope.row.locations" :key="index">
							{{ location.province }} - {{ location.city }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="mushroomDesc" label="描述"  width="200">
					<template #default="scope">
						<div style="white-space: pre-wrap;">{{ scope.row.mushroomDesc }}</div>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="mushroomDesc" label="描述" align="center" width="200"></el-table-column> -->
				<!-- <el-table-column prop="mushroom3d" label="3d模型" align="center"></el-table-column> -->

				<!-- <el-table-column prop="date" label="注册时间" align="center"></el-table-column> -->
				<el-table-column label="操作" width="280" align="center">
					<template #default="scope">
						<el-button
							type="primary"
							size="small"
							:icon="Edit"
							@click="addlocation(scope.$index, scope.row)"
							v-permiss="15">
							管理地点
						</el-button>
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
			<div class="example-pagination-block">
            <!-- <el-pagination 
                @size-change="changePage"
                @current-change="changeCurrentPage"
                background 
                layout="prev, pager, next" 
                :current-page="currentpage" 
                :page-size="pagesize"  
                :total="tableData.length" /> -->
        	</div>
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
		<el-dialog v-model="mapsee" title="选择地点" :custom-class="'custom-dialog'" height="500px" :style="{ height: '500px' }">
			<div class="dialog-content">
				<el-select-v2
					v-model="selectedOptions"
					:options="placedata"
					:props="selectProps"
					placeholder="请选择"
					class="el-select-v2"
					filterable
					multiple
				/>
				<el-table
					:data="placesuseddata"
					class="el-table"
				>
					<el-table-column prop="label" label="已存在地点" width="200" />
					<el-table-column label="操作" width="280" align="center">
					<template #default="scope">
						<el-button
							type="danger"
							size="small"
							:icon="Delete"
							@click="placedelete(scope.row)"
							v-permiss="16"
						>
							删除
						</el-button>
					</template>
				</el-table-column>
				</el-table>
				
			</div>
			<div slot="footer" class="dialog-footer custom-footer">
				<el-button type="danger" @click="placedeleteAll">全部删除</el-button>
				<el-button @click="mapsee = false">取消</el-button>
				<el-button type="primary" @click="mapsave">保存</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
import { Delete, Edit, Search, CirclePlusFilled, View } from '@element-plus/icons-vue';
import TableEdit from '../components/mushtable-edit.vue';
import TableDetail from '../components/table-detail.vue';
import MushroomImg from '../components/mushrooms-img.vue'
import { mushSearch, mushSearchOne, mushDelete, mapget, mushPlace, mushPlaces, mushPlaceDelete, mushPlaceDeleteAll } from '../api/ymushapi';


// 获取身份密钥
let token = localStorage.getItem('token')
  const headers = {
    token: token
  }
// 分页

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
	locations: { id: number; province: string; city: string; latitude: number; longitude: number; }[];
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
	const res = await mushSearch();
	console.log(res.data.data);
	tableData.value = res.data.data
	/* .map(item => {
		return {
			...item,
			locations: locations
		}
	}); */
};
getData();

// 查询操作
const handleSearch = async() => {
	console.log(query.name);
	if(query.name == ''){
		const res = await mushSearch();
		tableData.value = res.data.data;
	}else {
		const res = await mushSearchOne(query.name);
		tableData.value = res.data.data;
	}
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
			const res = await mushDelete(mushroomId);
			console.log(res);
			if(res.data.code == 200) {
				ElMessage.success('删除成功');
				tableData.value.splice(index, 1);
			} else {
				ElMessage.error('删除失败,联系管理员');
			}
			
		})
		.catch(() => {});
};
// ----------------------------------------------------------------------
// band to place
const mapsee = ref(false)
interface Option {
	id: number;
	key: number;
	label: string
	disabled: boolean
}
const selectProps = {
  value: 'id',
  label: 'label'
};

const placedata = ref<Option[]>([]);
const selectedOptions = ref([])

// dialog右侧表单 数据数组
let placesuseddata = ref([])

let selectedRow = ref()
const addlocation = async (index: number, row: any) => {
  console.log('index:', index, 'row', row);
  selectedRow.value = row.mushroomId
  placesuseddata.value = row.locations.map(location => ({
	label: `${location.province} - ${location.city}`,
	value: location.id
  }))
  console.log(selectedRow.value);
  
  const res = await mapget(headers);
  console.log(res.data.data);

  placedata.value = res.data.data.map((item: any, index: number) => {
	return {
	  id: item.id,
	  key: item.id,
	  label: `${item.province} - ${item.city}`,
	  disabled: false
	}
  })
  mapsee.value = true;
};


// single delete
const placedelete = async (row: any) => {
	console.log(selectedRow.value);
	
	console.log(row.value);
	ElMessageBox.confirm('确定要删除吗？', '提示', {
      type: 'warning'
    })
    .then(
      async () => {
        const res = await mushPlaceDelete(selectedRow.value, row.value)
        console.log(res);
        if(res.data.code = 200){
          ElMessage.success('删除成功')
		  placesuseddata.value = placesuseddata.value.filter(
          (place: any) => place.value !== row.value
        );
        } else {
          ElMessage.error('删除失败')
        }
        
      }
    )
}

// locations all delete
const placedeleteAll = async () => {
	const res = await mushPlaceDeleteAll(selectedRow.value)
	console.log(res);
	if(res.data.code = 200){
		ElMessage.success('删除成功')
		mapsee.value = false
		getData()
	} else {
		ElMessage.error('删除失败')
	}
	
}


const mapsave = async() => {
	mapsee.value = false
	console.log(selectedOptions.value[0]);
	if(selectedOptions.value.length == 1){
		const res = await mushPlace(selectedRow.value, selectedOptions.value[0])
		console.log(res);
	} else if (selectedOptions.value.length == 0) {
		ElMessage.success('保存成功')
	} else {
		console.log('多选',selectedOptions.value);
		// 将 Proxy 对象转换为数组
		const selectedArray = Array.from(selectedOptions.value);
		// const selectedArray = [...selectedOptions.value];  // 另一种转换方法

		console.log('转换后的数组', selectedArray);
		const res = await mushPlaces(selectedRow.value, selectedArray)
		console.log(res);
	}
	getData()
}
// ----------------------------------------------------------------------
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
.custom-dialog {
  position: relative;
}

.custom-footer {
  position: absolute;
  right: 20px;
  bottom: 20px;
}
.dialog-content {
	display: flex;
}

.dialog-content .el-select-v2 {
	width: 240px;
	margin-right: 20px;
}

.dialog-content .el-table {
	flex-grow: 1;
}
</style>
