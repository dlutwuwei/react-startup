import 'whatwg-fetch'
import { abortableFetch } from './abort-controller';

const defOpts = {
    mode: 'cors',
    credentials: 'include'
}

const defGetOpts = {
}

const defPostOpts = {
    headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
}

function toQueryString(obj) {
    return obj ? Object.keys(obj).map(function (key) {
        const val = obj[key]

        if (Array.isArray(val)) {
            return val.map(function (val2) {
                return encodeURIComponent(key + '[]') + '=' + encodeURIComponent(val2)
            }).join('&')
        }

        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : ''
}

function request(method, url, data, opts) {
    const isGet = method === 'get'

    const finalData = Object.assign(
        isGet ? { _: Date.now() } : {},
        data
    );

    const query = toQueryString(finalData)

    const finalUrl = isGet ? url + '?' + query : url
    const finalOpts = Object.assign(
        { method: method },
        defOpts,
        isGet ? defGetOpts : defPostOpts,
        opts
    );

    if(!isGet) {
        finalOpts.body = query;
    }

    return abortableFetch(finalUrl, finalOpts)
        .then((res) => {
            // http 返回成功
            if (res.status == 200) {
                return Promise.resolve(res)
            } else {
                return Promise.reject({ s: res.status })
            }
        })
        .then((res) => {
            // 处理response
            if (res.headers.get('content-type').indexOf('application/json') !== -1) {
                return res.json().catch(err => {
                    return Promise.reject({ s: 810, msg: '无法解析成JSON' })
                })
            } else {
                return Promise.reject({ s: 800, msg: '非JSON格式' })
            }
        })
        .then((data) => {
            // 判断返回的s值
            if(data.code === 0) {
                return Promise.resolve(data);
            } else {
                Promise.reject({ code: data.code, msg: `错误码${data.code}` })
            }
        })
}

export default {
    get(url, data, opts) {
        return request('get', url, data, opts)
    },
    post(url, data, opts) {
        return request('post', url, data, opts)
    }
}
