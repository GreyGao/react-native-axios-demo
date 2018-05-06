/**
 * API 接口测试 in React Native
 * 2018.05.04
 * @GreyGao
 */

import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  CameraRoll,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';
import axios from 'axios'
import qs from 'qs'
import ImagePicker from 'react-native-image-picker'

type Props = {};
export default class App extends Component<Props> {
  state = {
    token: '',
    data: [],
    applyNote: '',
    file: null,
    photos: [],
    avatarSource: null,
  };

  // GET 请求数据
  getData = () => {
    return (
      axios({
        method: 'get',
        url: 'https://webapi.abcpen.com/api/course/getCourseInfoById?courseId=8888&version=v1.0.5'
      }).then((res) => {
          console.log(res);
          const data = res.data;
          this.setState({
            data: data,
            applyNote: data.data.applyNote
          })
        })
        .catch(function (error) {
          console.log(error);
        })
    )
  };

  // POST 登录获取token user/login
  login = () => {
    return (
      axios({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        url: 'https://pigai.abcpen.com/api/user/login',
        data: qs.stringify({
          mobile: '15267053970',
          password: '123456',
          sourceType: '1'
        })
      }).then((res) => {
        console.log(res)
        this.setState({
          token: res.data.data.token
        })
        console.log('token==',res.data.data.token)
      })
    )
  };

  // POST 添加题目 examQuestion/insertPersonal
  insertPersonal = () => {
    const token = this.state.token;
    // console.log('token==',token)
    return axios({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Token': token
      },
      method: 'post',
      url: 'https://pigai.abcpen.com/api/examQuestion/insertPersonal',
      data: qs.stringify({
        questionType: `1`,
        publicStatus: `2`,
        answers: `["A"]`,
        options: `[{"text":"选项1"},{"text":"选项2"},{"text":"选项3"},{"text":"选项4",}]`,
        content: `{"text":"测试题目"}`,
        resolve: `{"text":"解析部分"}`,
      })
    }).then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log(err)
    })
  };

  // POST 上传文件 file/upload
  uploadFile = (data) => {
    let form = new FormData();
    form.append('uploadFile', this.state.file);

    return (
      axios({
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        url: 'http://pigai.abcpen.com/api/user/login',
        data: form
      })
    )
  };
  // 从本机读取照片
  getPhotos = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then(r => {
        this.setState({ photos: r.edges });
      })
      .catch((err) => {
        //Error Loading Images
      });
  };

  try = () => {
    console.log(ImagePicker)

  };

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          API接口调试
        </Text>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
            { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
              <Image style={styles.avatar} source={this.state.avatarSource} />
            }
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7} style={styles.buttonView} onPress={this.getData}
          >
          <Text style={styles.buttonText}>GET请求</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7} style={styles.buttonView} onPress={this.try}>
          <Text style={styles.buttonText}>文件上传</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7} style={styles.buttonView} onPress={this.login}>
          <Text style={styles.buttonText}>登录</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7} style={styles.buttonView} onPress={this.insertPersonal}>
          <Text style={styles.buttonText}>添加题目</Text>
        </TouchableOpacity>
        <Text>{this.state.applyNote}</Text>
        <ScrollView>
          {this.state.photos.map((p, i) => {
            return (
              <Image
                key={i}
                style={{
                  width: 300,
                  height: 100,
                }}
                source={{ uri: p.node.image.uri }}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    color: 'red',
    fontSize: 20,
    marginTop: 30,
  },
  buttonView:{
    width: '90%',
    height:30,
    backgroundColor:'rgb(33, 150, 243)',
    paddingHorizontal:10,
    borderRadius:5,
    justifyContent:"center",
    alignItems:'center',
    margin:10,
  },
  buttonText:{
    color:"white",
    fontSize:12,
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  }

});
