<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" @click="exportXlsx">导出Excel</el-button>
            </div>
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header">
                <el-table-column prop="mushroomId" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="mushroomName" label="菌菇名"></el-table-column>
                <!-- <el-table-column prop="level" label="分类等级"></el-table-column> -->
                <el-table-column prop="category" label="父级分类"></el-table-column>
                <el-table-column prop="mushroomImage" label="图片">
                    <template v-slot="{ row }">
                        <div>
                            <!-- 判断是否有图片链接，如果有则展示图片，否则显示上传组件 -->
                            <template v-if="row.mushroomImage">
                                <img :src="row.mushroomImage" alt="分类图片" style="max-width: 50px; max-height: 50px;">
                            </template>
                            <!-- <template v-else>
                                <el-upload
                                    action="#"
                                    :show-file-list="false"
                                    :before-upload="handleUpload"
                                    :http-request="uploadImage"
                                >
                                    <el-button type="text" icon="el-icon-upload2">上传图片</el-button>
                                </el-upload>

                            </template> -->
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="isEat" label="是否能食用"></el-table-column>
                <el-table-column prop="isPoison" label="是否有毒"></el-table-column>
                <el-table-column prop="mushroomLocation" label="分步地点"></el-table-column>
                <!-- <el-table-column prop="env" label="生长环境"></el-table-column> -->
                <el-table-column prop="mushroomDesc" label="分类描述">
                    <template v-slot="{ row }">
            
                   <!--<div v-if="row.isEditing">-->  
                        <!-- 富文本编辑器 -->
                    <!--<quill-editor v-model="row.desc" />-->    
                    <!--</div>-->    
                    <!--<div v-else>-->    
                        <!-- 显示富文本内容 -->
                        <div v-html="'<p>'+row.mushroomDesc+'</p>'"></div>
                     <!-- </div>-->  
                    </template>
                </el-table-column>
                <el-table-column prop="mould3d" label="３ｄ模型"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts" name="export">
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import { fetchData } from '../api/mush';

interface TableItem {
	mushroomId: number;
	mushroomName: string;
	category: number;
	mushroomImage: string;
	isEat: number;
	isPoison: number;
	mushroomLocation: string;
	mushroomDesc: string;
	mould3d: string;
}

const tableData = ref<TableItem[]>([]);
// 获取表格数据
const getData = async() => {
    const res = await fetchData();
	console.log(res.data.data);
	
	tableData.value = res.data.data;
};
getData();

const list = [['菌菇名', '父级分类', '图片URL', '是否能食用', '是否有毒', '分布地点', '分类描述', '3d模型']];
const exportXlsx = () => {
    tableData.value.map((item: any, i: number) => {
        const arr: any[] = [];
        arr.push(...[item.mushroomName, item.category, item.mushroomImage, item.isEat, item.isPoison, item.mushroomLocation, item.mushroomDesc, item.mould3d]);
        list.push(arr);
    });
    let WorkSheet = XLSX.utils.aoa_to_sheet(list);
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '第一页');
    XLSX.writeFile(new_workbook, `表格.xlsx`);
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #f56c6c;
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
