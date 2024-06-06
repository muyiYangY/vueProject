<template>
  <div>
    <!-- Table -->
    <el-button @click="handleAdd">增加</el-button>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="videoid" label="视频ID" width="100" />
      <el-table-column prop="title" label="标题" width="150" />
      <el-table-column prop="description" label="描述" width="250" />
      <!-- <el-table-column prop="coverimage" label="视频" width="200">
        <template #default="scope">
          <video :src="scope.row.video" controls style="width: 200px; height: 200px;"></video>
        </template>
      </el-table-column> -->
      <el-table-column prop="coverimage" label="封面图片" width="200">
        <template #default="scope">
          <img :src="scope.row.coverimage" @click="handleImageClick(scope.row)" style="width: 200px; height: 200px;">
        </template>
      </el-table-column>
      <el-table-column prop="comments" label="评论" width="60" />
      <el-table-column prop="duration" label="时长" width="100" />
      <el-table-column prop="likes" label="喜欢" width="60" />
      <el-table-column prop="views" label="观看" width="60" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Edit Dialog -->
    <el-dialog v-model="dialogVisible" title="编辑信息">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="封面图片">
          <input type="file" @change="handleImageChange" />
          <img v-if="editForm.coverimage" :src="editForm.coverimage"  style="width: 200px; height: 200px;">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </el-dialog>

    <!-- video dialog -->
    <el-dialog v-model="videoDialogVisible" title="视频播放" width="50%">
      <video v-if="currentVideoSrc" :src="currentVideoSrc" controls autoplay style="width: 100%; height: auto;"></video>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { videoget, videoopen } from '../api/ymushapi'

interface TableRow {
  id: number
  videoid: number
  title: string
  description: string
  coverimage: string
  comments: number
  duration: string
  likes: number
  views: number
}

const tableData = ref<TableRow[]>([
  { id: 1, videoid: 1, title: '标题1', description: '描述1', coverimage: 'https://www.w3schools.com/w3css/img_lights.jpg', comments: 10, duration: '00:10:00', likes: 100, views: 1000 },
  { id: 2, videoid: 2, title: '标题2', description: '描述2', coverimage: 'https://www.w3schools.com/w3css/img_lights.jpg', comments: 20, duration: '00:20:00', likes: 200, views: 2000 }
])

const dialogVisible = ref(false)
const editForm = ref<TableRow & { file?: File }>({
  id: 0,
  videoid: 0,
  title: '',
  description: '',
  coverimage: '',
  comments: 0,
  duration: '',
  likes: 0,
  views: 0,
  file: undefined
})
const currentRowIndex = ref<number | null>(null)

const videoDialogVisible = ref(false)
const currentVideoSrc = ref('')

// 获取页面信息
const getData = async () => {
  const res = await videoget()
  tableData.value = res.data.data
}
getData()

// test
const handleAdd = async () => {
  const res = await videoget()
  console.log(res);
}

// 获取视频信息
const handleImageClick =  async (row: TableRow) => {
  console.log(row.videoid);
  const id = row.videoid
  const res = await videoopen(id)
  console.log(res);
  
  // currentVideoSrc.value = row.videoid // 根据实际数据结构设置视频源
  // videoDialogVisible.value = true
}


// 删除列表
const handleDelete = (index: number, row: TableRow) => {
  tableData.value.splice(index, 1)
  ElMessage.success('删除成功')
}

// 修改列表
const handleEdit = (index: number, row: TableRow) => {
  currentRowIndex.value = index
  Object.assign(editForm.value, row)
  editForm.value.file = undefined // 清除文件
  dialogVisible.value = true
}


// 更改封面信息
const handleImageChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      editForm.value.coverimage = e.target.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 保存修改数据
const handleSave = () => {
  if (currentRowIndex.value !== null) {
    const updatedRow = { ...editForm.value }
    console.log(updatedRow);
    
    delete updatedRow.file // 不保留文件对象在表格数据中
    tableData.value[currentRowIndex.value] = updatedRow

    // 模拟文件上传
    if (editForm.value.file) {
      console.log('Uploading file:', editForm.value.file)
      // 在这里处理实际的文件上传逻辑
    }

    dialogVisible.value = false
    ElMessage.success('保存成功')

    // 清除表单数据
    Object.assign(editForm.value, {
      id: 0,
      videoid: 0,
      title: '',
      description: '',
      coverimage: '',
      comments: 0,
      duration: '',
      likes: 0,
      views: 0,
      file: undefined
    })
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
