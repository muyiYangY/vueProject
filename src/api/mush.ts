import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: 'http://182.92.65.28:8080/mushrooms',
        method: 'get'
    }); 
};
