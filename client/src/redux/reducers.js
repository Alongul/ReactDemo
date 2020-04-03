import { combineReducers} from 'redux'
import {AUTH_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER, RECEIVE_USER_LIST, RECEIVE_MSG_LIST, RECEIVE_MSG,MSG_READ} from './action-types'
import {getRedirectTo} from '../utils'


const initUser={
    username:'',
    type:'',
    msg:'',
    redirectTo:''
}
function user(state=initUser,action){
    switch(action.type){
        case AUTH_SUCCESS:
            const {type,header} =action.data
            return {...action.data,redirectTo:getRedirectTo(type,header)}
        case ERROR_MSG:
            return {...state,msg:action.data}
        case RECEIVE_USER:
            return action.data
        case RESET_USER:
            return {...initUser,msg:action.data}
        default:
            return state;
    }
}

const initUserList=[]
function userlist(state=initUserList,action){
    switch(action.type){
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }

}

const initChat={
    users:{},
    chatMsgs:[],
    unReadCount:0
}

function chat(state=initChat,action){
    switch(action.type){
        case RECEIVE_MSG_LIST:
            const {users,chatMsgs,userid}=action.data
            return {
                users,
                chatMsgs,
                //跟据chatMsgs来计算出，发给我的且未读的信息的个数
                unReadCount:chatMsgs.reduce((preTotal,msg)=>preTotal+(!msg.read&&msg.to===userid?1:0),0)
            }
        case RECEIVE_MSG://socket连接，当客户端接收到信息时触发
            const {chatMsg}=action.data
            return {
                users:state.users,
                //更新chatMsgs
                chatMsgs:[...state.chatMsgs,chatMsg],
                //判断这条新的信息，是否是发给我的且未读
                unReadCount:state.unReadCount+(!chatMsg.read&&chatMsg.to===action.data.userid?1:0)
            }
        case MSG_READ:
            const {from,to,count}=action.data
            return {
                users:state.users,
                chatMsgs:state.chatMsgs.map(msg=>{
                    if(msg.from===from&&msg.to===to&&!msg.read){
                        return {...msg,read:true}
                    }else{
                        return msg
                    }
                }),
                unReadCount:state.unReadCount-count
            }
        default:
            return state
    }
}


export default combineReducers({
    user,
    userlist,
    chat
})

