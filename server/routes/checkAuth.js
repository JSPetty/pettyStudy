const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const cfg = require('../../config/appConfig')

//要抽取的
const judgeUserAuth = async(req, res, next) => {

  let getUserAuth = await fetch(`${cfg.fw}`, {
    cache: 'no-cache',
    credentials: 'include',
    method : "get",
    headers: {
      'content-type': 'application/json;charset=utf-8',
      'Accept': '*/*'
    }
  }).then(res => {
    if (res.status >= 200 && res.status < 300) {
      return res;
    }
    const error    = new Error(res.statusText);
    error.response = res;
    throw error;
  }).then(res => {
    return res.json()
  }).catch(err => err)
  //用户有权限
  if(getUserAuth.code == 0 && getUserAuth.data){
    next()
  }else{
    //用户没有权限
    console.error("该用户没有权限，跳转至无权限页面！")
    res.redirect("http://localhost:3001/")
  }
}

router.all('*', function(req, res, next) {
  judgeUserAuth(req, res, next)
});

module.exports = router;
