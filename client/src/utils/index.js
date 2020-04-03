export function getRedirectTo(type,header){
    let path
    if(type==='boss'){
        path='/boss'
    }else{
        path='/qiuzhi'
    }
    if(!header){
        path+='info'
    }
    return path
}