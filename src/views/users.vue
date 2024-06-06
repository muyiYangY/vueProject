<template>
  <div class="search-box">
    <el-input v-model="query.name" placeholder="输入用户名" class="search-input mr10" clearable></el-input>
    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    <el-button type="warning" icon="el-icon-circle-plus" @click="handleAdd">新增</el-button>
  </div>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="userId" label="用户ID" width="100" />
    <el-table-column prop="username" label="用户名" width="150" />
    <el-table-column prop="email" label="邮箱" width="200" />
    <el-table-column prop="gender" label="性别" width="100" />
    <el-table-column prop="address" label="地址" width="100" />
    <el-table-column prop="birthdate" label="生日" width="100" />
    <el-table-column prop="registrationTime" label="注册时间" width="100" />
    <el-table-column prop="level" label="等级" width="100" />
    <el-table-column prop="nickName" label="昵称" width="150" />
    <!-- <el-table-column prop="avatar" label="头像" width="150">
      <template #default="scope">
        <el-upload>
          <img v-if="scope.row.avatar" :src="'http://101.200.79.152:8080' + scope.row.avatar" alt="avatar" style="width: 100px; height: auto;" />
          <div v-else>上传头像</div>
        </el-upload>
      </template>
    </el-table-column> -->
    <el-table-column prop="backImg" label="背景图片" width="150">
      <template #default="scope">
        <el-upload
          :before-upload="bkupload"
          :on-success="(response, file) => bkuploadsuccess(response, file, scope.row)"
          :show-file-list="false">
          <img v-if="scope.row.backImg" :src="scope.row.backImg" alt="background" style="width: 100px; height: auto;" />
          <div v-else>上传背景</div>
        </el-upload>
      </template>
    </el-table-column>
    <el-table-column prop="userImage" label="用户图片" width="150">
    <template #default="scope">
      <el-upload
        :before-upload="userImageUpload"
        :on-success="(response, file) => userImageUploadSuccess(response, file, scope.row)"
        :show-file-list="false">
        <img v-if="scope.row.userImage" :src="scope.row.userImage" alt="user" style="width: 100px; height: auto;" />
        <div v-else>上传用户图片</div>
        </el-upload>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="userImage" label="用户图片" width="150" /> -->
    <el-table-column prop="bio" label="简介" width="200" />
    <el-table-column label="操作" width="150">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog title="新增/编辑" v-model="visible">
    <el-form :model="form">
      <el-form-item label="用户ID">
        <el-input v-model="form.userId" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="form.gender"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="生日">
        <el-input v-model="form.birthdate"></el-input>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-input v-model="form.registrationTime"></el-input>
      </el-form-item>
      <el-form-item label="等级">
        <el-input v-model="form.level"></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickName"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          :before-upload="handleImageChange"
          list-type="picture-card"
          :show-file-list="false">
          <img v-if="form.avatar" :src="form.avatar" alt="avatar" class="table-td-thumb" />
          <i v-else class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="背景图片">
        <el-upload
          :before-upload="handleBackgroundChange"
          list-type="picture-card"
          :show-file-list="false">
          <img v-if="form.backImg" :src="form.backImg" alt="background" class="table-td-thumb" />
          <i v-else class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户图片">
        <el-input v-model="form.userImage"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="form.bio"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>


<script lang="ts" setup>
import { ref } from 'vue';
import { usersget } from '../api/ymushapi'

interface TableData {
  userId: number;
  username: string;
  email: string;
  gender: string;
  address: string;
  birthdate: string;
  registrationTime: string;
  level: number;
  nickName: string;
  avatar: string;
  backImg: string;
  userImage: string;
  bio: string;
}

const tableData = ref<TableData[]>([]);

const query = ref({ name: '' });
const visible = ref(false);
const isEdit = ref(false);
const form = ref<TableData>({
  userId: 0,
  username: '',
  email: '',
  gender: '',
  address: '',
  birthdate: '',
  registrationTime: '',
  level: 0,
  nickName: '',
  avatar: '',
  backImg: '',
  userImage: '',
  bio: ''
});

// 获取数据
const getData = async () => {
  const token = localStorage.getItem('token');
  console.log(token);
  const res = await usersget(token)
  console.log(res);
  // 处理日期格式
  /* const processedData = res.data.map(item => {
    return {
      ...item,
      registrationTime: item.registrationTime.split('T')[0],
      birthdate: item.birthdate.split('T')[0]
    };
  });

  tableData.value = processedData; */
}
getData()

const handleSearch = async () => {
  console.log('Search:', query.value.name);
  const token = localStorage.getItem('token');
  console.log(token);
  const res = await usersget(token);
  console.log(res);
  if (res && res.data) {
    tableData.value = res.data.map((user: any) => ({
      userId: user.userId,
      username: user.username,
      email: user.email,
      gender: user.gender,
      address: user.address,
      birthdate: user.birthdate,
      registrationTime: user.registrationTime,
      level: user.level,
      nickName: user.nickName,
      avatar: `http://101.200.79.152:8080/${user.avatar}`,
      backImg: `http://101.200.79.152:8080/${user.backImg}`,
      userImage: user.userImage,
      bio: user.bio
    }));
  }
};

const handleAdd = () => {
  isEdit.value = false;
  form.value = {
    userId: 0,
    username: '',
    email: '',
    gender: '',
    address: '',
    birthdate: '',
    registrationTime: '',
    level: 0,
    nickName: '',
    avatar: '',
    backImg: '',
    userImage: '',
    bio: ''
  };
  visible.value = true;
};

const handleEdit = (index: number, row: TableData) => {
  isEdit.value = true;
  form.value = { ...row };
  visible.value = true;
};

const handleDelete = (index: number, row: TableData) => {
  tableData.value.splice(index, 1);
  console.log('Delete:', index, row);
};

const handleImageChange = (file) => {
  const rawFile = file.file;
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.avatar = e.target?.result as string;
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
    form.value.backImg = e.target?.result as string;
  };
  reader.readAsDataURL(rawFile);
};

const bkupload = (file) => {
  // 处理上传背景图片逻辑
}

const bkuploadsuccess = (response, file, row) => {
  // 处理上传背景图片成功逻辑
}

const userImageUpload = (file) => {

}
const userImageUploadSuccess = (response, file, row) => {
  row.userImage = response.url
}
const handleSubmit = () => {
  if (isEdit.value) {
    const index = tableData.value.findIndex(item => item.userId === form.value.userId);
    if (index !== -1) {
      tableData.value[index] = { ...form.value };
    }
  } else {
    form.value.userId = tableData.value.length ? Math.max(...tableData.value.map(item => item.userId)) + 1 : 1;
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
