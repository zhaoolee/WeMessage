import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'
import Taro from '@tarojs/taro';

export default class Index extends Component {
  state={
    message: []
  }
  componentWillMount () { }

  async componentDidMount () { 

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

    // 获取用户登录

    Taro.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          Taro.request({
            url: 'https://v2fy.com/wemessage/onLogin',
            data: {
              code: res.code
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <View>
          {this.state.message.map((value)=>{
            return <View dangerouslySetInnerHTML={{__html: `<div>${value.name}</div><div>${value.text}</div>`}}></View>
          })}
        </View>

      </View>
    )
  }
}
