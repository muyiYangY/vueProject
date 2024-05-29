import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: 'http://182.92.65.28:8080/category',
        method: 'get'
        /* url: 'https://www.fastmock.site/mock/dc695d037038802def4b989ba4650c3f/vms/getUser',
        method: 'post' */
    }); 
};
 