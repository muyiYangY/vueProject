<template>
    <div>
        <div parent="container">
            <div parent="handle-box">
                <el-upload
                    action="#" 
                    :limit="1"
                    accept=".xlsx, .xls"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :http-request="handleMany"
                >
                    <el-button parent="mr10" type="success">批量导入</el-button>
                </el-upload>
                <el-link href="/template.xlsx" target="_blank">下载模板</el-link>
            </div>
            <el-table :data="tableData" border parent="table" header-cell-parent-name="table-header">
                <el-table-column prop="categoryId" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="categoryName" label="类别"></el-table-column>
                <el-table-column prop="categoryLevel" label="分类等级"></el-table-column>
                <el-table-column prop="categoryParent" label="父级分类"></el-table-column>
                <el-table-column prop="categoryImg" label="分类图片">
                    <template v-slot="{ row }">
                        <div>
                            <el-image 
                            style="width: 50px; height: 50px;"
                            :src="row.categoryImg" alt="分类图片"></el-image>
                        </div>
                    </template>
                    <!-- <template v-slot="{ row }">
                        <div>
                            判断是否有图片链接，如果有则展示图片，否则显示上传组件
                            <template v-if="row.image">
                                <img :src="row.image" alt="分类图片" style="max-width: 50px; max-height: 50px;">
                            </template>
                            <template v-else>
                                <el-upload
                                    action="#"
                                    :show-file-list="false"
                                    :before-upload="handleUpload"
                                    :http-request="uploadImage"
                                >
                                    <el-button type="text" icon="el-icon-upload2">上传图片</el-button>
                                </el-upload>

                            </template>
                        </div>
                    </template> -->
                </el-table-column>
                <el-table-column prop="categoryDesc" label="分类描述">
                    <template v-slot="{ row }">
            
                   <!--<div v-if="row.isEditing">-->  
                        <!-- 富文本编辑器 -->
                    <!--<quill-editor v-model="row.desc" />-->    
                    <!--</div>-->    
                    <!--<div v-else>-->    
                        <!-- 显示富文本内容 -->
                        <div v-html="'<p>'+row.categoryDesc+'</p>'"></div>
                     <!-- </div>-->  
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts" name="import">
import { UploadProps } from 'element-plus';
import { ref, reactive } from 'vue';
import { fetchData } from '../api/index';
import axios from 'axios';
import * as XLSX from 'xlsx';

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
const getData = async () => {
    const res = await fetchData();
    console.log(res.data.data);
    
    tableData.value = res.data.data;
};
getData();

const importList = ref<any>([]);
const beforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
    importList.value = await analysidesccel(rawFile);
    return true;
};
const analysidesccel = (file: any) => {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (e: any) {
            const data = e.target.result;
            let datajson = XLSX.read(data, {
                type: 'binary',
            });

            const sheetName = datajson.SheetNames[0];
            const result = XLSX.utils.sheet_to_json(datajson.Sheets[sheetName]);
            console.log(result);
            
            resolve(result);
        };
        
        reader.readAsBinaryString(file);
    });
};


const handleMany = async () => {
    // 获取当前表格中最大的 ID 值
    const maxId = Math.max(...tableData.value.map(item => item.categoryId), 0);

    // 把数据传给服务器后获取最新列表，这里只是示例，不做请求
    const list = importList.value.map((item: any, index: number) => {
        return {
            categoryId: maxId + index + 1,  // 生成唯一的新 ID
            categoryName: item['categoryName'],
            categoryLevel: item['categoryLevel'],
            categoryParent: item['categoryParent'],
            categoryDesc: item['categoryDesc'],
        };
    });
    const apiUrl = 'http://182.92.65.28:8080/category/saveList'
    console.log(list);
    
    axios.post(apiUrl, list)
    .then(function(res) {
        console.log(111);
        console.log(res);
    })
    .catch(function(error){
        console.log(222);
        console.log(error);
    });
    tableData.value.push(...list);
};
const handleUpload = (file) => {
    // 在这里可以进行文件验证等操作
    console.log('文件上传前的处理:', file);
    
    return true; // 允许上传
};

const uploadImage = (file) => {
    // 在这里进行实际的文件上传请求
    
    console.log('文件上传:', file);
    // 实际的上传逻辑，例如使用 axios 发送请求
};
</script>

<style scoped>
.handle-box {
    display: flex;
    margin-bottom: 20px;
}

.table {
    width: 100%;
    font-size: 14px;
}
.mr10 {
    margin-right: 10px;
}
</style>
