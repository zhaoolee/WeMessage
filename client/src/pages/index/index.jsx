import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'
import Taro from '@tarojs/taro';

export default class Index extends Component {

  componentWillMount () { }

  async componentDidMount () { 

    const res = await Taro.request({
      method: "get",
      url: "http://127.0.0.1:3000",
      data: {
        x: '1',
        y: '2'
      },
      header: {
        'content-type': 'application/json' // 默认值
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
      </View>
    )
  }
}
