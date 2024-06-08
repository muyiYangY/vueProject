<template>
    <div class="search-box" style="display: flex;">
      <el-button type="warning" icon="CirclePlusFilled" @click="handleAdd">新增</el-button>
      <el-upload
        action="#"
        :limit="1"
        accept=".xlsx, .xls"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="handleMany">
        <el-button type="success">批量导入</el-button>
      </el-upload>
      
    </div>
    <el-table :data="locations" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="50"></el-table-column>
      <el-table-column prop="province" label="省" width="150"></el-table-column>
      <el-table-column prop="city" label="市" width="150"></el-table-column>
      <el-table-column prop="latitude" label="纬度" width="120"></el-table-column>
      <el-table-column prop="longitude" label="经度" width="120"></el-table-column>
      <el-table-column prop="description" label="描述" width="300"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增" v-model="visible">
      <el-form :model="form">
        <el-form-item label="ID">
          <el-input v-model="form.id" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="form.province"></el-input>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="form.city"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="form.latitude"></el-input>
        </el-form-item>
        <el-form-item label="经度">
          <el-input v-model="form.longitude"></el-input>
        </el-form-item>
        <el-form-item label="描述" >
          <el-input v-model="form.description"></el-input>    <!-- disabled="true" -->
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import * as XLSX from 'xlsx';
  import 'element-plus/dist/index.css';
  import { ElTable, ElTableColumn, ElMessage, ElMessageBox } from 'element-plus';
  import { mapget, mapsave, mapdelete, mapsavelist, mapupdate } from '../api/ymushapi'
  import { Delete, Edit, Search, CirclePlusFilled, View } from '@element-plus/icons-vue';
  
  interface Location {
    id: number;
    province: string;
    city: string;
    latitude: number;
    longitude: number;
    description: string
  }
  
  const locations = ref<Location[]>([
    { id: 1, province: 'Province A', city: 'City A', latitude: 34.0522, longitude: -118.2437, description:'111' },
    { id: 2, province: 'Province B', city: 'City B', latitude: 36.1699, longitude: -115.1398, description: '2222' },
    // 添加更多数据项
  ]);

  const visible = ref(false)
  const isEdit = ref(false)
  const form = ref<Location>({
    id: null,
    province: '',
    city: '',
    latitude: null,
    longitude: null,
    description: ''
  })

  // 获取身份密钥
  let token = localStorage.getItem('token')
  const headers = {
    token: token
  }

  // 获取页面信息
  const getData = async () => {
    const res = await mapget(headers)
    locations.value = res.data.data
  }
  getData()
  const handleAdd = async () => {
    form.value = {
        id: null,
        province: '',
        city: '',
        latitude: null,
        longitude: null,
        description: ''
      }
    visible.value = true
    console.log(isEdit.value);
    
  }

  const handleSave = async () => {
    console.log(form.value);
    let info = {
      province: form.value.province,
      city: form.value.city,
      latitude: form.value.latitude,
      longitude: form.value.longitude,
      description: form.value.description
    }
    if(!isEdit.value){
      const res = await mapsave(info, headers)
      console.log(res);
      if(res.data.code == 200){
        ElMessage.success('保存成功!!')
        visible.value = false
        getData()
      } else {
        ElMessage.error('保存失败')
      }
    } else {
      // 修改数据
      let inffoo = {
        id: form.value.id,
        province: form.value.province,
        city: form.value.city,
        latitude: form.value.latitude,
        longitude: form.value.longitude,
        description: form.value.description
      }
      console.log(inffoo);
      
      const res = await mapupdate(inffoo, headers)
      if(res.data.code == 200){
        ElMessage.success('修改成功!!')
        visible.value = false
        getData()
      } else {
        ElMessage.error('修改失败')
      }
      
    }
    
  }

  // 修改表单
  const handleEdit = async (index: number, row: Location) => {
    isEdit.value = true
    form.value = {...row}
    visible.value = true
    console.log(index, row);
  }

  // 删除数据
  const handleDelete = async (index: number, row: Location) => {
    console.log('index:' ,index, 'row: ',row);
    ElMessageBox.confirm('确定要删除吗？', '提示', {
      type: 'warning'
    })
    .then(
      async () => {
        const res = await mapdelete(row.id, headers)
        console.log(res);
        if(res.data.code = 200){
          ElMessage.success('删除成功')
          getData()
        } else {
          ElMessage.error('删除失败')
        }
        
      }
    )
  }

  // 导入excel表格
  const importList = ref<any>([])
  const beforeUpload = async (rawFile: any) => {
    importList.value = await analysidesccel(rawFile);
    return true;
  }
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
  const handleMany = async() => {
    const list = importList.value.map((item: any, index: number) => {
      return {
        province: item['省'],
        city: item['市'],
        latitude: item['纬度'],
        longitude: item['经度'],
        description: item['描述']
      }
    })
    console.log(list);
    const res = await mapsavelist(list, headers)
    console.log(res);
    if(res.data.code == 200 ){
      ElMessage.success('添加成功')
      getData()
    } else {
      ElMessage.error('添加失败')
    }
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
    width: 100px;
    height: auto;
  }
  
  </style>
  