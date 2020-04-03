import React, { Component } from 'react'
import { NavBar, WingBlank, List, InputItem, WhiteSpace, Button } from 'antd-mobile'
import Logo from '../../components/logo/logo'
import {connect} from 'react-redux'
import {Login} from '../../redux/actions'
import {Redirect} from 'react-router-dom'

class login extends Component {
    state={
        username:'',
        password:'',
     
    }
    login=()=>{
        this.props.Login(this.state)

    }
    handlechange=(name,val)=>{
        this.setState({
            [name]:val
        })
    }
    toRegister=()=>{
        this.props.history.replace('/register')
    }
    render() {
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
                        <WhiteSpace />
                    </List>
                    <WhiteSpace />
                    <Button type="primary" onClick={this.login}>登录</Button>
                    <WhiteSpace />
                    <Button onClick={this.toRegister}>没有账户</Button>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state=>({user:state.user}),
    {Login}
)(login)