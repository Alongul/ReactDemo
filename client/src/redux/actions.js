import {
    reqRegister,
    reqLogin,
    reqUpdateUser,
    reqUser,
    reqUserList,
    reqChatList,
    reqReadMsg
} from '../api'

import { AUTH_SUCCESS, ERROR_MSG, RECEIVE_USER, RESET_USER, RECEIVE_USER_LIST, RECEIVE_MSG_LIST, RECEIVE_MSG, MSG_READ } from './action-types'
import io from 'socket.io-client'


function initIO(dispatch, userid) {
    if (!io.socket) {
        io.socket = io('ws://localhost:4000')
        // 绑定'receiveMessage'的监听, 来接收服务器发送的消息 
        io.socket.on('receiveMsg', function (chatMsg) {
            if (chatMsg.from === userid || userid === chatMsg.to) {
                dispatch(receiveMsg(chatMsg, userid))
            }
        })
    }
}

//获取信息列表的异步action函数
async function getMsgList(dispatch, userid) {
    initIO(dispatch, userid)//初始化IO
    const response = await reqChatList()
    const result = response.data
    if (result.code === 0) {
        const { users, chatMsgs } = result.data
        dispatch(receivemsglist({ users, chatMsgs, userid }))//分发同步action
    }

}


const outSuccess = (user) => ({ type: AUTH_SUCCESS, data: user })
const errorMsg = (msg) => ({ type: ERROR_MSG, data: msg })
const receive_user = (user) => ({ type: RECEIVE_USER, data: user })
export const reset_user = (msg) => ({ type: RESET_USER, data: msg })
export const receiveuserlist = (userList) => ({ type: RECEIVE_USER_LIST, data: userList })
const receivemsglist = ({ users, chatMsgs, userid }) => ({ type: RECEIVE_MSG_LIST, data: { users, chatMsgs, userid } })
const receiveMsg = (chatMsg, userid) => ({ type: RECEIVE_MSG, data: { chatMsg, userid } })
const msgread = (count, from, to) => ({ type: MSG_READ, data: { count, from, to } })

export const Register = (user) => {
    const { username, password, password2, type } = user
    if (!username) {
        return errorMsg('用户名必须指定！')
    }
    if (!password) {
        return errorMsg('密码必须指定！')

    }
    if (password !== password2) {
        return errorMsg('两次密码不同！')
    }
    return async dispatch => {
        const response = await reqRegister({ username, password, type })
        const result = response.data
        if (result.code === 0) {
            getMsgList(dispatch, result.data._id)//在注册成功后发起获取聊天信息的请求
            dispatch(outSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
    }
}

export const Login = (user) => {
    const { username, password } = user
    if (!username) {
        return errorMsg('用户名必须指定！')
    }
    if (!password) {
        return errorMsg('密码必须指定！')

    }
    return async dispatch => {
        const response = await reqLogin(user)
        const result = response.data
        if (result.code === 0) {
            getMsgList(dispatch, result.data._id)//在登录成功后发起消息列表请求
            dispatch(outSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
    }
}

export const updateUser = (user) => {
    return async dispatch => {
        const response = await reqUpdateUser(user)
        const result = response.data
        if (result.code === 0) {
            dispatch(receive_user(result.data))
        } else {
            dispatch(reset_user(result.data))
        }
    }
}

//根据浏览器中cookie来进行自动获取本地用户的个人信息
export const getUser = () => {
    return async dispatch => {
        const response = await reqUser()
        const result = response.data
        if (result.code === 0) {
            getMsgList(dispatch, result.data._id)//获取信息列表
            dispatch(receive_user(result.data))
        } else {
            dispatch(reset_user(result.data))
        }
    }
}

export const getUserList = (type) => {
    return async dispatch => {
        const response = await reqUserList(type)
        const result = response.data
        if (result.code === 0) {
            dispatch(receiveuserlist(result.data))
        }
    }
}

export const sendMsg = ({ from, to, content }) => {
    return dispatch => {
        io.socket.emit('sendMsg', { from, to, content })
    }
}

export const readMsg = (from, to) => {
    return async dispatch => {
        const response = await reqReadMsg(from)
        const result = response.data
        if (result.code === 0) {
            const count = result.data
            dispatch(msgread(count, from, to))
        }
    }

}

