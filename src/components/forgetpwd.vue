<template>
  <div class="forget-wrap">
    <div class="forget-box">
      <span class="forget-con">请输入你注册时填写的电子邮箱:</span>
      <i-form ref="form" :model="user" :rules="rules">
        <FormItem prop="email">
          <Input type="text" v-model="user.email" class="emailbut" placeholder="请输入你的电子邮箱" style="width: 400px"></Input>
        </FormItem>
      </i-form>
      <span class="forget-tip">1分钟内你的邮箱会收到重置密码邮件,若发送不成功，请联系相关人员。</span>
      <Button class="forgetbut" @click="sendmail" type="primary">发送邮件</Button>
      <Button class="forgetbut" @click="goback" type="primary">返回首页</Button>
    </div>
  </div>
</template>

<script>
  import Form from 'iview/src/components/form/form';
  import FormItem from 'iview/src/components/form/form-item';
  import Input from 'iview/src/components/input/input';
  import Button from 'iview/src/components/button/button';
  import {
    Select,
    Option
  } from 'iview/src/components/select';
  import AV from 'leancloud-storage';
  import Modal from 'iview/src/components/Modal/index.js';
  import MessageTips from 'iview/src/components/message';
  import api from '@/api/index';
  import Promise from 'bluebird';
  import userApi from '@/api/user';
  export default {
    name: 'forgetpwd',
    components: {
      'i-form': Form,
      FormItem,
      Button,
      Modal,
      Input,
      MessageTips
    },
    props: {
      // user: Object,
    },
    data() {
      return {
        user: {
          email: ''
        },
        rules: {
          email: [{
              required: true,
              message: '请填写邮箱',
              trigger: 'blur'
            },
            {
              type: 'email',
              message: '邮箱格式不正确',
              trigger: 'blur'
            }
          ]
        },
      }
    },
    methods: {
      sendmail() {
        let emailval = this.user.email;
        this.$refs.form.validate(
          isValidated => {
            if (!isValidated) return;
            AV.User.requestPasswordReset(emailval).then(d => {
              MessageTips.info({
                content: '重置密码邮件已经发送至 ' + emailval,
                closable: true,
                duration: 3
              });
            });
          });
      },
      goback() {
        this.$router.push('/');
      }
    }
  }
</script>

<style>
  .forget-wrap {
    padding: 20px 0;
  }
  .forget-box {
    width: 400px;
    margin-top: calc(30% - 120px);
    margin-left: auto;
    margin-right: auto;
  }
  .emailbut {
    height: 34px;
    padding-left: 10px;
  }
  .forget-con {
    display: inline-block;
    width: 100%;
    line-height: 40px;
    padding-left: 10px;
  }
  .forget-tip {
    line-height: 40px;
    padding-left: 10px;
    color: #1296ff;
  }
  .forgetbut {
    display: block;
    margin: 20px auto;
  }
  .ivu-form-item-error-tip {
    padding-left: 10px;

  }
</style>
