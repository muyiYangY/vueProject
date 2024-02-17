<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" @click="exportXlsx">导出Excel</el-button>
            </div>
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header">
                <el-table-column prop="categoryId" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="categoryName" label="类别"></el-table-column>
                <el-table-column prop="categoryLevel" label="分类等级"></el-table-column>
                <el-table-column prop="categoryParent" label="父级分类"></el-table-column>
                <el-table-column prop="categoryImg" label="分类图片"></el-table-column>
                <el-table-column prop="categoryDesc" label="分类描述"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts" name="export">
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import { fetchData } from '../api/index';
import axios from 'axios';

interface TableItem {
    categoryId: number;
	categoryName: string;
	categoryLevel: number;
	categoryParent: string;
	categoryImg: string;
	categoryDesc: string;
}

const tableData = ref<TableItem[]>([]);
// 获取表格数据
const getData = async() => {
    const res = await fetchData();
    console.log(res.data.data);
    
    tableData.value = res.data.data;
};
getData();

const list = [['序号', '类别', '分类等级', '父级分类', '分类图片', '分类描述']];
const exportXlsx = () => {
    tableData.value.map((item: any, i: number) => {
        const arr: any[] = [i + 1];
        arr.push(...[item.categoryName, item.categoryLevel, item.categoryParent, item.categoryImg, item.categoryDesc]);
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
