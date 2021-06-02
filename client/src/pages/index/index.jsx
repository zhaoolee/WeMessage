import { Component } from 'react'
import { View, Text, Button, Input, Textarea, Image } from '@tarojs/components'
import './index.scss'
import Taro from '@tarojs/taro';


export default class Index extends Component {


  constructor(props){
    super(props);

    this.state = {
      message: [],
      userInfo: "",
      nickName: "",
      avatarUrl: "",
      gender: "", //性别 0：未知、1：男、2：女
      province: "",
      city: "",
      country: "",
    }

    this.getUserProfile = this.getUserProfile.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  async getUserInfo(){

    
    let res = await new Promise((resolve, reject)=>{
      Taro.getUserInfo({
        success: function(res) {
          console.log(res);
          resolve(res);
        }
      })

    })

    var userInfo = res.userInfo
    var nickName = userInfo.nickName
    var avatarUrl = userInfo.avatarUrl
    var gender = userInfo.gender //性别 0：未知、1：男、2：女
    var province = userInfo.province
    var city = userInfo.city
    var country = userInfo.country

    this.setState({
      userInfo,
      nickName,
      avatarUrl,
      gender,
      province,
      city,
      country,
    },()=>{
      console.log("this.state==>>", this.state);
    })

  }




  componentWillMount() { }

  async componentDidMount() {

    const res = await Taro.request({
      method: "get",
      url: "https://v2fy.com/wemessage/message",
      header: {
        'content-type': 'application/json' // 默认值
      }
    })

    this.setState({
      message: res.data.data
    })

    this.getUserInfo();





    

  }

  getUserProfile(){



    Taro.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setState({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })

  }


  

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className='index'>

        <Button onClick={this.getUserProfile}>自动填写用户信息</Button>
        {/* <Image
          style='width: 300px;height: 100px;background: #fff;'
          src='nerv_logo.png'
        /> */}
        <Text>用户名:{}</Text>




        <Textarea className='index-message' autoFocus/>
        <Button style='background-color:#79685c;color:#ffffff;'>发送留言</Button>
        <View>
          {this.state.message.map((value) => {
            return <View dangerouslySetInnerHTML={{ __html: `<div>${value.name}</div><div>${value.text}</div>` }}></View>
          })}
        </View>
      </View>
    )
  }
}
