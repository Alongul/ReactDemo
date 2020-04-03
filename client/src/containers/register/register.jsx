import React, { Component } from 'react'
import { NavBar, WingBlank, List, InputItem, WhiteSpace, Radio, Button } from 'antd-mobile'
import Logo from '../../components/logo/logo'
import {connect} from 'react-redux'
import {Register} from '../../redux/actions'
import {Redirect} from 'react-router-dom'

const ListItem = List.Item
class register extends Component {

    state={
        username:'',
        password:'',
        password2:'',
        type:'',
    }
    register=()=>{
        this.props.Register(this.state)
    }
    handlechange=(name,val)=>{
        this.setState({
            [name]:val
        })
    }
    toLogin=()=>{
        this.props.history.replace('/login')
    }
    render() {
        const {type}=this.state
        const {msg,redirectTo}=this.props.user
        if(redirectTo){
            return <Redirect to={redirectTo}/>
        }
        return (
            <div>
                <NavBar>boss&nbsp;直&nbsp;聘</NavBar>
                <Logo />
                <WingBlank>
                    <List>
                        {msg ? <div className='error-msg'>{msg}</div>:null}
                        <WhiteSpace />
                        <InputItem placeholder='请输入用户名' onChange={val=>{this.handlechange('username',val)}}>用户名:</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder='请输入密码' type="password" onChange={val=>{this.handlechange('password',val)}}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder='请输入确认密码' type="password" onChange={val=>{this.handlechange('password2',val)}}>确认密码:</InputItem>
                        <WhiteSpace />
                    </List>
                    <ListItem>
                        <span>用户类型:</span>
                        &nbsp; &nbsp; &nbsp; &nbsp;
                        <Radio checked={type==='qiuzhizhe'}  onChange={()=>this.handlechange('type','qiuzhizhe')}>求职者</Radio>
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <Radio checked={type==='boss'} onChange={()=>this.handlechange('type','boss')}>boss</Radio>
                    </ListItem>
                    <WhiteSpace />
                    <Button type="primary" onClick={this.register}>注册</Button>
                    <WhiteSpace />
                    <Button onClick={this.toLogin}>已有账户</Button>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state=>({user:state.user}),
    {Register}
)(register)
