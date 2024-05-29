<template>
  <div class="search-box">
    <el-input v-model="query.name" placeholder="输入用户名" class="search-input mr10" clearable></el-input>
    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    <el-button type="warning" icon="el-icon-circle-plus" @click="handleAdd">新增</el-button>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="id" label="ID" width="50" />
    <el-table-column prop="objId" label="对象ID" width="100" />
    <el-table-column prop="title" label="标题" width="150" />
    <el-table-column prop="content" label="内容" width="200" />
    <el-table-column prop="time" label="发布时间" width="150" />
    <el-table-column prop="token" label="Token" width="150" />
    <el-table-column prop="image" label="头像" width="150">
      <template #default="scope">
        <el-upload>
          <img v-if="scope.row.image" :src="scope.row.image" alt="image" style="width: 100px; height: auto;" />
          <div v-else>上传头像</div>
        </el-upload>
        
      </template>
    </el-table-column>
    <el-table-column prop="background" label="背景" width="150">
      <template #default="scope">
        <el-upload
          :before-upload="bkupload"
          :on-success="(response, file) => bkuploadsuccess(response, file, scope.row)"
          :show-file-list="false">
          <img v-if="scope.row.background" :src="scope.row.background" alt="image" style="width: 100px; height: auto;" />
          <div v-else>上传背景</div>
        </el-upload>
        
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog title="新增/编辑" v-model="visible">
    <el-form :model="form">
      <el-form-item label="ID">
        <el-input v-model="form.id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="对象ID">
        <el-input v-model="form.objId"></el-input>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-input v-model="form.time"></el-input>
      </el-form-item>
      <el-form-item label="Token">
        <el-input v-model="form.token"></el-input>
      </el-form-item>
      <!-- <el-form-item label="头像">
        <el-upload
          :before-upload="handleImageChange"
          list-type="picture-card"
          :show-file-list="false"
        >
          <img v-if="form.image" :src="form.image" alt="image" class="table-td-thumb" />
          <i v-else class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="背景">
        <el-upload
          :before-upload="handleBackgroundChange"
          list-type="picture-card"
          :show-file-list="false"
        >
          <img v-if="form.background" :src="form.background" alt="background" class="table-td-thumb" />
          <i v-else class="el-icon-plus"></i>
        </el-upload>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface TableData {
  id: number;
  objId: string;
  title: string;
  content: string;
  time: string;
  token: string;
  image: string;
  background: string;
}

const tableData = ref<TableData[]>([
  { id: 1, objId: '1', title: '标题1', content: '内容1', time: '2023-01-01', token: 'token1', image: 'https://via.placeholder.com/100', background: 'https://via.placeholder.com/100' },
  { id: 2, objId: '2', title: '标题2', content: '内容2', time: '2023-01-02', token: 'token2', image: 'https://via.placeholder.com/100', background: 'https://via.placeholder.com/100'  },
  { id: 1, objId: '1', title: '标题1', content: '内容1', time: '2023-01-01', token: 'token1', image: '', background: 'https://via.placeholder.com/100' },
]);

const query = ref({ name: '' });
const visible = ref(false);  // 等价于useState????
const isEdit = ref(false);
const form = ref<TableData>({
  id: 0,
  objId: '',
  title: '',
  content: '',
  time: '',
  token: '',
  image: '',
  background: ''
});

const handleSearch = () => {
  console.log('Search:', query.value.name);
};

const handleAdd = () => {
  isEdit.value = false;
  form.value = {
    id: 0,
    objId: '',
    title: '',
    content: '',
    time: '',
    token: '',
    image: '',
    background: ''
  };
  visible.value = true;
};

const handleEdit = (index: number, row: TableData) => {
  isEdit.value = true;       // 定义为编辑
  form.value = { ...row };
  visible.value = true;       // 调出model框
};

const handleDelete = (index: number, row: TableData) => {
  tableData.value.splice(index, 1);
  console.log('Delete:', index, row);
};

const handleImageChange = (file) => {
  const rawFile = file.file;
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.image = e.target?.result as string;

    const formData = new FormData();
    formData.append('image', rawFile);
    console.log(formData);
    
  };
  reader.readAsDataURL(rawFile);
};

const handleBackgroundChange = (file) => {
  const rawFile = file.file;
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.background = e.target?.result as string;
  };
  reader.readAsDataURL(rawFile);
};

const bkupload = (file) => {

}

const bkuploadsuccess = (response, file, row) => {

}

const handleSubmit = () => {
  if (isEdit.value) {
    const index = tableData.value.findIndex(item => item.id === form.value.id);
    if (index !== -1) {
      tableData.value[index] = { ...form.value };
    }
  } else {
    form.value.id = tableData.value.length ? Math.max(...tableData.value.map(item => item.id)) + 1 : 1;
    tableData.value.push({ ...form.value });
  }
  visible.value = false;
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
  width: 100px;
  height: auto;
}

</style>
