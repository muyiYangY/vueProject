<template>
  <div class="search-box">
    <el-input v-model="query.name" placeholder="输入用户名" class="search-input mr10" clearable></el-input>
    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    <el-button type="warning" icon="el-icon-circle-plus" @click="handleAdd">新增</el-button>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="userId" label="用户ID" width="80" />
    <el-table-column prop="userName" label="用户名" width="150" />
    <el-table-column prop="title" label="标题" width="80" />
    <el-table-column prop="content" label="内容" width="250" />
    <el-table-column prop="publishTime" label="发布时间" width="150" />
    <el-table-column prop="userImg" label="用户图片" width="150">
      <template #default="scope">
        <img :src="scope.row.userImg" alt="user image" style="width: 50px; height: auto;" />
      </template>
    </el-table-column>
    <el-table-column prop="img" label="图片" width="150">
      <template #default="scope">
        <img :src="scope.row.img" alt="image" style="width: 100px; height: auto;" />
      </template>
    </el-table-column>
    <el-table-column prop="likeCount" label="点赞数" width="100" />
    <el-table-column prop="postId" label="帖子ID" width="100" />
    <el-table-column prop="commentCount" label="评论数" width="100" />
    <el-table-column prop="viewCount" label="查看数" width="100" />
    <el-table-column label="操作" width="150">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="visible" title="编辑">
    <el-form :model="form">
      <el-form-item label="用户ID">
        <el-input v-model="form.userId"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-input v-model="form.publishTime"></el-input>
      </el-form-item>
      <el-form-item label="用户图片">
        <el-input v-model="form.userImg"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-input v-model="form.img"></el-input>
      </el-form-item>
      <el-form-item label="点赞数">
        <el-input v-model="form.likeCount"></el-input>
      </el-form-item>
      <el-form-item label="帖子ID">
        <el-input v-model="form.postId"></el-input>
      </el-form-item>
      <el-form-item label="评论数">
        <el-input v-model="form.commentCount"></el-input>
      </el-form-item>
      <el-form-item label="查看数">
        <el-input v-model="form.viewCount"></el-input>
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
import { commentsget, commentsdel } from '../api/ymushapi'

interface Comment {
  id: number;
  userId: number;
  userName: string;
  title: string;
  content: string;
  publishTime: string;
  userImg: string;
  img: string;
  likeCount: number;
  postId: number;
  commentCount: number;
  viewCount: number;
}

const query = ref({ name: ''})
const visible = ref(false)
const isEdit = ref(false)
const form = ref<Comment>({
  id: 0,
  userId: 0,
  userName: '',
  title: '',
  content: '',
  publishTime: '',
  userImg: '',
  img: '',
  likeCount: 0,
  postId: 0,
  commentCount: 0,
  viewCount: 0,
})

const tableData = ref<Comment[]>([
  { id: 1, userId: 1, userName: '用户1', title: '标题1', content: '内容1', publishTime: '2024-01-01', userImg: 'https://via.placeholder.com/50', img: 'https://via.placeholder.com/100', likeCount: 10, postId: 1, commentCount: 2, viewCount: 100 },
  { id: 2, userId: 2, userName: '用户2', title: '标题2', content: '内容2', publishTime: '2024-01-02', userImg: 'https://via.placeholder.com/50', img: 'https://via.placeholder.com/100', likeCount: 20, postId: 2, commentCount: 3, viewCount: 200 }
])

// 获取表格数据
const getData = async () => {
  const res = await commentsget()
  tableData.value = res.data.data
}
getData()

const handleSearch = async () => {
  console.log('Search:', query.value.name);
  const keyss = localStorage.getItem('token')
  console.log(keyss);
  const res = await commentsget()
  console.log(res.data.data);
  
};

const handleAdd = () => {
  isEdit.value = false;
  form.value = {
    id: 0,
    userId: 0,
    userName: '',
    title: '',
    content: '',
    publishTime: '',
    userImg: '',
    img: '',
    likeCount: 0,
    postId: 0,
    commentCount: 0,
    viewCount: 0,
  };
  visible.value = true;
};

const handleEdit = (index: number, row: Comment) => {
  isEdit.value = true;
  form.value = { ...row };
  visible.value = true;
  console.log('Edit:', index, row);
};

const handleDelete = async (index: number, row: Comment) => {
  // tableData.value.splice(index, 1);
  const res = await commentsdel(row.postId)
  console.log(res);
  
  // console.log('Delete:', index, row);
  // console.log(row.postId);
  
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

