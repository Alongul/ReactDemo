import React, { Component } from 'react'
import {connect} from 'react-redux'
import {NavBar,InputItem,TextareaItem,Button} from 'antd-mobile'
import HeaderSelector from '../../components/header-selector/header-selector'
import { Redirect } from 'react-router-dom'
import {updateUser} from '../../redux/actions'

 class Qiuzhi extends Component {
    state = { 
        header: '', // 头像名称 
        info: '', // 个人简介 
        post: '', // 求职岗位 
    }
    handleChange = (name, val) => {
         this.setState({[name]: val}) 
    }
    setHeader = (header) => { 
        this.setState({header}) 
    }
    save=()=>{
        this.props.updateUser(this.state)
    }
    render() {
        const {header,type}=this.props.user
        if(header){
            const path=type==='qiuzhizhe'?'/qiuzhizhe':'/boss'
            return <Redirect to={path}/>
        }
        return (
            <div>
                <NavBar>请完善信息</NavBar>
                <HeaderSelector setHeader={this.setHeader}/>
                <InputItem placeholder='请输入求职岗位' onChange={val=>{this.handleChange('post',val)}}>求职岗位</InputItem>
                <TextareaItem title='个人介绍:' rows={3} onChange={val=>{this.handleChange('info',val)}}/>
                <Button type='primary' onClick={this.save}>保存</Button>
            </div>
        )
    }
}

export default connect(
    state=>({user:state.user}),
    {updateUser}
)(Qiuzhi)