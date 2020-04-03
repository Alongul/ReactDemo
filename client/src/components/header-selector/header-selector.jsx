import React, { Component } from 'react'
import {List,Grid} from 'antd-mobile'
import  PropTypes from 'prop-types'

export default class HeaderSelector extends Component {
    static propTypes={
      setHeader:PropTypes.func.isRequired
    }
    state={
        icon:null
    }
    constructor(props){
        super(props)
        this.headerList=[]
        for(let i=0;i<20;i++){
            this.headerList.push({
                text:'头像'+(i+1),
                icon:require(`../../assets/imgs/头像${i+1}.png`)
            })
        }
    }
    selectHeader = ({icon, text}) => { 
        // 更新当前组件的状态 
        this.setState({icon}) // 更新父组件的状态 
        this.props.setHeader(text) 
    }
    render() {
        const listheader=!this.state.icon ? '请选择头像':(
            <div>
                已选择头像:<img src={this.state.icon}></img>
            </div>
        )
        return (
            <div>
                <List renderHeader={() => listheader}> 
                <Grid data={this.headerList} columnNum={5} onClick={this.selectHeader}/> 
                </List>              
            </div>
        )
    }
}
