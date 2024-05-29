<template>
  <div>
    <!-- Table -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="objId" label="对象ID" width="100" />
      <el-table-column prop="title" label="标题" width="150" />
      <el-table-column prop="content" label="内容" width="250" />
      <el-table-column prop="video" label="视频" width="200">
        <template #default="scope">
          <video :src="scope.row.video" controls style="width: 200px; height: 200px;"></video>
        </template>
      </el-table-column>
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
        <el-form-item label="内容">
          <el-input v-model="editForm.content"></el-input>
        </el-form-item>
        <el-form-item label="视频">
          <input type="file" @change="handleFileChange" />
          <video v-if="editForm.video" :src="editForm.video" controls style="width: 200px; height: 200px;"></video>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

interface TableRow {
  id: number
  objId: string
  title: string
  content: string
  video: string
}

const tableData = ref<TableRow[]>([
  { id: 1, objId: '1', title: '标题1', content: '内容1', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 2, objId: '2', title: '标题2', content: '内容2', video: 'https://www.w3schools.com/html/mov_bbb.mp4' }
])

const dialogVisible = ref(false)
const editForm = ref<TableRow & { file?: File }>({
  id: 0,
  objId: '',
  title: '',
  content: '',
  video: '',
  file: undefined
})
const currentRowIndex = ref<number | null>(null)

const handleDelete = (index: number, row: TableRow) => {
  tableData.value.splice(index, 1)
  ElMessage.success('删除成功')
}

const handleEdit = (index: number, row: TableRow) => {
  currentRowIndex.value = index
  Object.assign(editForm.value, row)
  editForm.value.file = undefined // 清除文件
  dialogVisible.value = true
}

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    if (editForm.value.video) {
      URL.revokeObjectURL(editForm.value.video) // 释放之前的URL对象
    }
    editForm.value.file = file
    editForm.value.video = URL.createObjectURL(file)
  }
}

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
      objId: '',
      title: '',
      content: '',
      video: '',
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
