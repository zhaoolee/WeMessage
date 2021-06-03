import { Component } from 'react'
import { View, Text, Button, Input, Textarea, Image } from '@tarojs/components'
import './index.scss'
import Taro from '@tarojs/taro';


export default class Index extends Component {


  constructor(props) {
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
      markdown_file_name: "https://v2fy.com/p/105-tide-2021-05-29/"
    }

    this.getUserProfile = this.getUserProfile.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  async getUserInfo() {

    console.log("自动获取");

    let res = await new Promise((resolve, reject) => {
      Taro.getUserInfo({
        success: function (res) {
          console.log("getInfo==>>", res);
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
    }, () => {
      console.log("this.state==>>", this.state);
    })

  }




  componentWillMount() { }

  async componentDidMount() {

    console.log("start=getUserInfo");

    this.getUserInfo();

    const res = await Taro.request({
      method: "get",
      url: "https://v2fy.com/wemessage/message",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        "markdown_file_name":this.state.markdown_file_name
      }

    })

    this.setState({
      message: res.data.data
    })




  }

  getUserProfile() {



    Taro.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log('res==>>', res);
        this.setState({
          userInfo: res.userInfo,
          hasUserInfo: true,
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          gender: res.userInfo.gender, //性别 0：未知、1：男、2：女
          province: res.userInfo.province,
          city:res.userInfo.city,
          country: res.userInfo.country
        })
      }
    })

  }




  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  async sendMessage(){

    await Taro.request({
      method: "post",
      url: "https://v2fy.com/wemessage/message",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        "markdown_file_name": "https://v2fy.com/p/105-tide-2021-05-29/",
        "nick_name": this.state.nickName,
        "message": "万物互联"
      }
    })

  }

  render() {
    return (
      <View className='index'>

        <Button onClick={this.getUserProfile}>自动填写用户信息</Button>
        {/* <Image
          style='width: 300px;height: 100px;background: #fff;'
          src='nerv_logo.png'
        /> */}
        <Text>用户名:{this.state.nickName}</Text>




        <Textarea className='index-message' autoFocus />
        <Button onClick={this.sendMessage} style='background-color:#79685c;color:#ffffff;'>发送留言</Button>
        <View>
          {this.state.message.map((value) => {
            return <View dangerouslySetInnerHTML={{ __html: `<div>${value.name}</div><div>${value.text}</div>` }}></View>
          })}
        </View>
      </View>
    )
  }
}
