import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavBar, List, InputItem,Icon } from 'antd-mobile'

import { sendMsg ,readMsg} from '../../redux/actions'

const Item = List.Item

class Chat extends Component {

    state = {
        content: ''
    }
    componentDidMount(){
        window.scrollTo(0,document.body.scrollHeight)//渲染前让组件页面加载到底部
    }
    componentDidUpdate(){
        window.scrollTo(0,document.body.scrollHeight)//更新状态后使组件页面加载到底部
    }
    componentWillUnmount(){
        const from=this.props.match.params.userid//获取当前用户id和聊天对方的id,并向服务端请求去更新数据该消息已读
        const to =this.props.user._id
        this.props.readMsg(from ,to)
    }
    handlesend = () => {//点击‘发送’按钮，向服务器端发送数据
        const from = this.props.user._id
        const to = this.props.match.params.userid
        const content = this.state.content
        if (content) {
            this.props.sendMsg({ from, to, content })
        }
        this.setState({ content: '' })
    }
    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chat
        const meId = user._id
        if (!users[meId]) {
            return null
        }
        const targetId = this.props.match.params.userid

        const chatId = [meId, targetId].sort().join('_')//根据chatId来判断chatMsgs中哪些信息需要显示在该页面
        const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)
      

        const targetHeader = users[targetId].header//显示对方头像
        const targetIcon = targetHeader ? require(`../../assets/imgs/${targetHeader}.png`) : null

        return (
            <div>
                <div id='chat-page'>
                    <NavBar 
                    id='chatNavbar'
                    onLeftClick={() => this.props.history.goBack()}
                    icon={<Icon type='left'/>}>{users[targetId].username}</NavBar> 
                    <List id='chatList' >
                        
                        {
                            msgs.map(msg => {//判断信息的类型，并显示
                                if (meId === msg.to) {
                                    return <Item key={msg._id} thumb={targetIcon} > {msg.content}</Item>
                                }
                                else {
                                    return <Item key={msg._id} className='chat-me' extra='我' >{msg.content}</Item>
                                }
                            })
                        }       
                    </List>
                    <div className='am-tab-bar'>
                        <InputItem placeholder="请输入" onChange={val => this.setState({ content: val })} value={this.state.content} extra={<span onClick={this.handlesend}>发送</span>} />
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(//借用react-redux库对组件进行包装
    state => ({ user: state.user, chat: state.chat }),
    {sendMsg,readMsg}
)(Chat)