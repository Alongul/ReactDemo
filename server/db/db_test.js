const md5 = require('blueimp-md5')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/gzhipin_test2')
const conn = mongoose.connection
conn.on('connected', function () {
    console.log('数据库连接成功')
})

const userSchema = mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, required: true },
    type: { type: String, required: true }
})
const UserModel = mongoose.model('user', userSchema)
function testSave(){
    const userModel=new UserModel({username:'Tom',password:md5('123'),type:'qiuzhizhe'})
    userModel.save(function(err,user){
        console.log('save',err,user)
    });
}
//testSave()

function testFind(){
    UserModel.find(function(err,users){
        console.log('find()',err,users)
    })
    UserModel.findOne({_id: '5e79e7ed8d45e346a4360d3f'}, function (err, user){
        console.log('findone()',err,user)

    }) 
}
testFind()

function testUpdate() { 
    UserModel.findByIdAndUpdate({_id: '5e79e7ed8d45e346a4360d3f'}, {username: 'Jack'}, function (err, olduser) {
         console.log('findByIdAndUpdate()', err, olduser)
        }) 
 }
 //testUpdate()
 
 function testDelete(){
     UserModel.remove({_id: '5e79e7ed8d45e346a4360d3f'}, function (err, result) 
     { console.log('remove()', err, result) })
 }

 //testDelete