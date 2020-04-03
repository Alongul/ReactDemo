import axios from 'axios'

export default function ajax(url,data={},type='GET'){
    if(type==='GET'){
        let paramstr=''
        Object.keys(data).forEach(key=>{
            paramstr+=key+'='+data[key]+'&'
        })
        if(paramstr){
            paramstr=paramstr.substring(0,paramstr.length-1)
        }
        
        return axios.get(url+'?'+paramstr)
    }else{
        return axios.post(url,data)
    }
}