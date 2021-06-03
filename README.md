# WeMessage
一个打通微信公众号留言与WordPress留言的微信小程序,让微信精彩留言也能被互联网搜索引擎抓取~


## 环境配置

```
nvm install v14.16.0
nvm use v14.16.0
```

## 项目技术栈说明

- 本项目包含客户端和服务端两套程序,客户端源码在client文件夹中,服务端源码在server文件夹中
- 客户端使用小程序框架taro构建  , 安装命令npm i @tarojs/cli@3.2.10 -g
- 服务端使用稳健的Node.js框架Express

## 新建数据库，数据表


```sql
--创建数据库
CREATE DATABASE IF NOT EXISTS WEMESSAGE DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
--创建留言数据表
CREATE TABLE IF NOT EXISTS `message`(
   `snow` VARCHAR(100) NOT NULL comment '雪花字段',
   `markdown_file_name` VARCHAR(200) NOT NULL comment '与文章内容绑定的markdown文章名也可以放阅读原文的url',
   `nick_name` VARCHAR(100) default "" comment '用户昵称',
   `message` VARCHAR(1000) default "" comment '留言信息',
   `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '更新时间',
   PRIMARY KEY ( `snow` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```


## WordPress改造

- 在Wordpress目录下 wp-includes/functions.php 中加入以下代码，允许通过接口新增评论

```
function filter_rest_allow_anonymous_comments() {
return true;
}
add_filter('rest_allow_anonymous_comments','filter_rest_allow_anonymous_comments');
```
