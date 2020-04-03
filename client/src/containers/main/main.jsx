import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'


import BossInfo from '../boss_info/boss_info'
import QiuzhiInfo from '../qiuzhi_info/qiuzhi_info'
import Boss from '../boss/boss'
import Qiuzhizhe from '../qiuzhizhe/qiuzhizhe'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/not-found/not-found'
import Chat from '../../containers/chat/chat'


import { connect } from 'react-redux'
import Cookies from 'js-cookie'
import { getRedirectTo } from '../../utils'
import { getUser } from '../../redux/actions'
import { NavBar } from 'antd-mobile'
import NavFooter from '../../components/nav-footer/nav-footer'

class Main extends Component {

    navList = [
        {
            path: '/boss', // 路由路径 
            component: Boss,
            title: '求职者列表',
            icon: 'dashen',
            text: '求职者',
        },
        {
            path: '/qiuzhi', // 路由路径 
            component: Qiuzhizhe,
            title: '老板列表',
            icon: 'laoban',
            text: '老板',
        },
        {
            path: '/message', // 路由路径 
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息',
        },
        {
            path: '/personal', // 路由路径
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人',
        }
    ]
    componentDidMount() {
        const userid = Cookies.get('userid')
        const { _id } = this.props.user
        if (userid && !_id) {
            this.props.getUser()
        }
    }

    render() {
        const path = this.props.location.pathname
        const userid = Cookies.get('userid')
        if (!userid) {
            return <Redirect to='/login' />
        }

        const { user,unReadCount } = this.props
        if (!user._id) {
            return null // 不做任何显示
        } else { // 请求根路径时, 自动 跳转到对应的用户主界面
            if (path === '/') {
                const pathname = getRedirectTo(user.type, user.header)
                return <Redirect to={pathname} />
            }
        }

        const navList = this.navList
        const currentNav = navList.find(nav => nav.path === path)

        if (currentNav) {
            if (user.type === 'boss') {
                navList[1].hide = true
            } else {
                navList[0].hide = true
            }
        }

        return (
            <div>
                {currentNav ? <NavBar className='sticky-header'>{currentNav.title}</NavBar> : null}
                <Switch>
                    {
                        navList.map(nav => <Route path={nav.path} component={nav.component} />)
                    }
                    <Route path='/bossinfo' component={BossInfo}></Route>
                    <Route path='/qiuzhiinfo' component={QiuzhiInfo}></Route>
                    <Route path='/chat/:userid' component={Chat}></Route>
                    <Route component={NotFound}></Route>
                </Switch>
                {currentNav ? <NavFooter navList={this.navList} unReadCount={unReadCount}/> : null}
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user,unReadCount:state.chat.unReadCount }),
    { getUser }
)(Main)