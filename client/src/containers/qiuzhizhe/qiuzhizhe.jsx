import React, { Component } from 'react'
import { connect} from 'react-redux'
import UserList from '../../components/user-list/user-list'
import {getUserList} from '../../redux/actions'

class Qiuzhizhe extends Component {
    componentDidMount(){
        this.props.getUserList('boss')
    }
    render() {
        return (
            <div>
                <UserList userList={this.props.userlist} />
            </div>
        )
    }
}
export default connect(
    state=>({userlist:state.userlist}),
    {getUserList}
)(Qiuzhizhe)