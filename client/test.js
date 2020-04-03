function test(str){
    let key=[]
    let val=[]
    let j=0
    let left,right
    let pos1,pos2
    left=str.indexOf('\"')
    right=str.indexOf('\"',left+1)
    while(j<str.length){
        let n=str.indexOf(';',j)
        if(n<right&&n>left){
            j=j+1   
        }else{
            pos2=n
            let sub=str.slice(pos1,pos2)
            key.push(sub.split('=')[0])
            val.push(sub.split('=')[1])
            pos1=pos2+1
            j=pos2+1;
        }
    }
    console.log(key)
    console.log(val)
}
let str='abc=b\\n;c=\\x61d;d=234;t=\\n;d=\"test;yes\";'
test(str)