<template>
  <div class="search-box">
    <el-input v-model="query.name" placeholder="输入用户名" class="search-input mr10" clearable></el-input>
    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    <el-button type="warning" icon="el-icon-circle-plus" @click="handleAdd">新增</el-button>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="objId" label="对象ID" width="100" />
    <el-table-column prop="title" label="标题" width="150" />
    <el-table-column prop="content" label="内容" width="250" />
    <el-table-column prop="time" label="发布时间" width="150" />
    <el-table-column prop="token" label="Token" width="150" />
    <el-table-column prop="image" label="图片" width="150">
      <template #default="scope">
        <img :src="scope.row.image" alt="image" style="width: 100px; height: auto;" />
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="visible" title="编辑">
    <el-form :model="form">
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
      <el-form-item label="图片">
        <el-input v-model="form.image"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup name="comments">
import { ref } from 'vue'

interface Comment {
  id: number;
  objId: string;
  title: string;
  content: string;
  time: string;
  token: string;
  image: string;
}

const query = ref({ name: ''})
const visible = ref(false)
const isEdit = ref(false)
const form = ref<Comment>({
  id: 0,
  objId: '',
  title: '',
  content: '',
  time: '',
  token: '',
  image: '',
})

const tableData = ref<Comment[]>([
  { id: 1, objId: '1', title: '标题1', content: '内容1', time: '2024-01-01', token: 'token1', image: 'https://via.placeholder.com/100' },
  { id: 2, objId: '2', title: '标题2', content: '内容2', time: '2024-01-02', token: 'token2', image: 'https://via.placeholder.com/100' }
])

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
  };
  visible.value = true;
};

const handleEdit = (index: number, row: Comment) => {
  isEdit.value = true;
  form.value = { ...row };
  visible.value = true;
  console.log('Edit:', index, row);
};

const handleDelete = (index: number, row: Comment) => {
  tableData.value.splice(index, 1);
  console.log('Delete:', index, row);
};

const handleSave = () => {
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
