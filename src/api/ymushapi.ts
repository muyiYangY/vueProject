import { pa } from 'element-plus/es/locale';
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
// 关联位置
export const mushPlace = async (mushroomId: number, locationId: number) => {
    try {
        
        const response = await instance.post('/mushroomLocation',null, {
            params: {
                mushroomId: mushroomId,
                locationId: locationId
            }
        })
        return response;
    } catch (error) {
        console.log(error);
        
    }
}

export const mushPlaces = async (mushrooId: number, location: any) => {
    try {
        let data ={
            mushroomId: mushrooId,
            location: location
        }
        console.log(location);
        
        const response = await instance.post('/mushroomLocation/savemore', data )
        return response;
    } catch (error) {
        console.log(error);   
    }
}

export const mushPlaceDelete = async (mushroomId: number, locationId: number) => {
    try {
        const response = await instance.delete('/mushroomLocation', {
            params: {
                mushroomId: mushroomId,
                locationId: locationId
            }
        })
        return response;
    } catch (error) {
        console.log(error);
        
    }
}

export const mushPlaceDeleteAll = async(mushroomId: number) => {
    try {
        const response = await instance.delete('/mushroomLocation/all', {
            params: {
                mushroomId: mushroomId
            }
        })
        return response;
    } catch (error) {
        console.log(error);
        
    }
}

/* -----------------------------comments--------------------------------- */
// 评论区页面
// 获取信息
 export const commentsget = async () => {
    try {
        const response = await instance.get('/post/list')
        return response;
    } catch (error) {
        console.log(error);
        
    }
 }
 // 删除评论
 export const commentsdel = async (data: any) => {
    try {
        const response = await instance.delete('/post/' + data)
        return response;
    } catch (error) {
        console.log(error);
        
    }
 }


 /* -----------------------------users--------------------------------- */
 // 用户页面
 export const usersget = async (data: any) => {
    try {
        console.log(data);
        const response = await instance.get('/root/all', {
            headers: {
                'token': data
            }
        })
        return response;
    } catch (error) {
        console.log(error);
        
    }
 }

 // 创建用户
 export const usersbuild = async (data: any) => {
    try {
        console.log(data);
        const response = await instance.post('/root/createUsr', data, {
            headers: {
                Authorization: data
            }
        })
        return response;
    } catch (error) {
        console.log(error);
    }
 }

  /* -----------------------------videos--------------------------------- */
  // 获取video
  export const videoget = async () => {
    try {
        const response = await instance.get('/video/list')
        return response;
    } catch (error) {
        console.log(error);
        
    }
  }

  export const videoopen = async (data: any) => {
    try {
        console.log(data);
        console.log(typeof(data));
        const response = await instance.get('/video', data)
        return response
    } catch (error){        
        console.log(error);
        
    } 
  }


  /* -----------------------------map--------------------------------- */
  export const mapget = async (headers: any) => {
    try {
        console.log(headers);
        
        const response = await instance.get('/location', {headers})
        return response
    } catch (error) {
        console.log(error);
    }
  }

  export const mapsave = async (data: any, headers: any) => {
    try {
        // console.log('location:', data);
        // console.log('headers:', headers);
        
        const response = await instance.post('/location', data, {headers})
        return response
    } catch (error) {
        console.log(error);
        
    }
  }

  export const mapsavelist = async (data: any, headers: any) => {
    try {
        const response = await instance.post('/location/list', data, {headers})
        return response
    } catch (error) {
        console.log(error)
    }
  }

  export const mapdelete = async (data: number, headers: any) => {
    try {
        const response = await instance.delete('/location?id=' + data, {headers})
        return response
    } catch (error) {
        console.log(error);
        
    }
  }

  // 修改数据
  export const mapupdate = async (data: any, headers: any) => {
    try {
        const response = await instance.put('/location', data, {headers})
        return response
    } catch (error) {
        console.log(error);
        
    }
  }