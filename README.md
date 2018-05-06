# react-native-axios-demo
try to use axios in React Native.

### Install
```
npm i axios -D
```
### Import
```
import axios from 'axios'
```

### use `Get`
```javascript
getData = () => {
    return (
      axios({
        method: 'get',
        url: 'https://xxxxx.xxxxx.com/api/course/getCourseInfoById?courseId=8888&version=v1.0.5'
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
```
### use `Post`
> if you use `x-www-form-urlencoded` to send data, please import qs string first, then it can be used with axios.
```
npm i -D qs
```
#### type x-www-form-urlencoded

```javascript
  login = () => {
    return (
      axios({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        url: 'https://xxxxx.xxxxx.com/api/user/login',
        data: qs.stringify({
          mobile: 'xxxxxx',
          password: 'xxxxxx',
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
```
More for upload files will be update lately.
