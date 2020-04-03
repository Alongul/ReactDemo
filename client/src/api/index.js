import ajax from './ajax'

export const reqRegister=(user)=>ajax('/register',user,'POST')

export const reqLogin=(user)=>ajax('/login',user,'POST')

export const reqUpdateUser=(user)=>ajax('/update',user,'POST')

export const reqUser=()=>ajax('/user')

export const reqUserList=(type)=>ajax('/userlist',{type})

//发送请求获取消息列表
export const reqChatList=()=>ajax('/msglist')

//发送请求去更新数据库中的消息未读属性
export const reqReadMsg=(from)=>ajax('readmsg',{from},'POST')