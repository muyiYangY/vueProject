import instance from './ymush';


// 类别编辑表 
// 获取页面内容
export const tableSearch = async () => {
    try {
        const response = await instance.get('/category');
        return response
    } catch (error) {
        console.log(error);
    }
}
// 查询操作
export const tableSearchOne = async (name: string) => {
    try {
        console.log(name);
        const response = await instance.get('/category/search/' + name);
        return response
    } catch (error) {
        console.log(error);
    }
}
// 删除操作
export const tableDelete = async (id: number) => {
    try {
        console.log(id);
        const response = await instance.delete('/category?categoryId=' + id);
        return response
    } catch (error) {
        console.log(error);
    }
}

// 表格编辑
export const tableEditSave = async (data: any) => {
    try {
        const response = await instance.post('/category/saveList', data);
        return response
    } catch (error){
        console.log(error);
    }
}
// 表格更新
export const tableEditUpdate = async (data: any) => {
    try {
        const response = await instance.put('/category', data);
        return response
    } catch (error){
        console.log(error);
    }
}

/* -----------------------------mushroom--------------------------------- */
// 菌菇编辑表
// 获取页面内容
export const mushSearch = async () => {
    try {
        const response = await instance.get('/mushrooms');
        return response
    } catch (error) {
        console.log(error);
    }
}
// 查询操作
export const mushSearchOne = async (name: string) => {
    try {
        console.log(name);
        const response = await instance.get('/mushrooms/search/' + name);
        return response
    } catch (error) {
        console.log(error);
    }
}

// 删除操作
export const mushDelete = async (id: number) => {
    try {
        const response = await instance.delete('/mushrooms/' + id);
        return response
    } catch (error) {
        console.log(error);
    }
}
// 图片操作
// 更新图片
export const mushImg = async (data: any) => {
    try {
        const response = await instance.post('/mushrooms/saveImage', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
              }
        });
        return response
    } catch (error) {
        console.log(error);
    }
}
// 获取图片
export const mushImgGet = async (data: any) => {
    try {
        console.log(data);
        
        const response = await instance.get('/mushrooms/getMushroomImgs/'+ data);
        return response
    } catch (error) {
        console.log(error);
    }
}
// 删除图片
export const mushImgDel = async (data: any) => {
    try {
        console.log(data);
        const response = await instance.delete('/mushrooms/image?imageId=' + data);
        return response
    } catch (error) {
        console.log(error);
    }
}

// 表格编辑
export const mushEidtSave = async (data: any) => {
    try {
        const response = await instance.post('/mushrooms', data)
        return response;
    } catch (error) {
        console.log(error);
        
    }
}
// 表格更新
export const mushEditUpdate = async (data: any) => {
    try {
        const reponse = await instance.put('/mushrooms/update', data)
        return reponse;
    } catch (error) {
        console.log(error);
    }
}
// 表格查询 
export const mushEditSearch = async () => {
    try {
        const reponse = await instance.get('/category/6')
        return reponse;
    } catch (error) {
        console.log(error);
    }
}