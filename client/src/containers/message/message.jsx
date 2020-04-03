import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'
const Item = List.Item
const Brief = Item.Brief


function getLastMsgs(chatMsgs,userid) {//根据chatMsgs找到发给本人的最后一条信息
    const lastMsgObjs = {}
    chatMsgs.forEach(msg => {
        if(msg.to===userid&&!msg.read){//判断信息是否发给本人且处于未读状态，并记录下来
            msg.unReadCount=1;
        }else{
            msg.unReadCount=0
        }
        const chatId = msg.chat_id//取出chat_id，注意：无论是对方发给我的，还是我发给对方的信息都同属于一个chat_id
        let lastMsg = lastMsgObjs[chatId]

        if (!lastMsg) {
            lastMsgObjs[chatId] = msg
        } else {
            const unReadCount=lastMsg.unReadCount + msg.unReadCount//记录下总共未读的数量，虽然最后在页面上只显示最后一条信息，但最后一条信息的unReadCount是会变的
            if (msg.create_time > lastMsg.create_time) {//跟据信息的时间去判断哪一条是最后的信息
                lastMsgObjs[chatId] = msg
            }
            lastMsgObjs[chatId].unReadCount=unReadCount
        }
    })
    const lastMsgs = Object.values(lastMsgObjs)//取出对象lastMsgObjs的值并组成数组，以便显示
    lastMsgs.sort(function (m1, m2) {//使显示页面的最上面的一项始终显示最近的一条消息
        return m2.create_time - m1.create_time
    })
    return lastMsgs
}

class Message extends Component {
    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chat
        const lastMsgs = getLastMsgs(chatMsgs,user._id)
        return (
            <List id='messageList'>
                {
                    lastMsgs.map(msg => {
                        const targetUser = msg.to === user._id ? users[msg.from] : users[msg.to]//跟据users去找出对方的个人信息
                        const targetUserId=msg.to===user._id ? msg.from:msg.to
                        return (
                            <Item
                                key={msg._id}
                                extra={<Badge text={msg.unReadCount} />}
                                thumb={targetUser.header ? require(`../../assets/imgs/${targetUser.header}.png`) : null}
                                arrow='horizontal'
                                onClick={()=>this.props.history.push(`/chat/${targetUserId}`)}
                            >
                                {msg.content}
                                <Brief>{targetUser.username}</Brief>
                            </Item>
                        )
                    }
                    )
                }

            </List>
        )
    }
}
export default connect(
    state => ({ user: state.user, chat: state.chat }),
    {}
)(Message)