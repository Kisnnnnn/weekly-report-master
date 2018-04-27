<template>
  <div class="signup-wrap">
    <div class="signup-box">
      <i-form ref="form" :model="user" :rules="rules">
        <Form-item prop="name">
          <i-input type="text" v-model="user.name" placeholder="请输入您的姓名"></i-input>
        </Form-item>
        <Form-item prop="pwd">
          <i-input type="password" v-model="user.pwd" placeholder="请输入密码"></i-input>
        </Form-item>
        <Form-item prop="email">
          <i-input type="text" v-model="user.email" placeholder="请输入邮箱"></i-input>
        </Form-item>
        <Form-item prop="userType">
          <i-select placeholder="请选择" v-model="user.userType">
            <i-option v-for="items in usertypes" :value="items.value" :key="items.value">{{ items.label }}</i-option>
          </i-select>
        </Form-item>
        <Form-item prop="groupIndex" v-if="groups.length">
          <i-select placeholder="请选择小组" v-model="user.groupIndex" style="margin-bottom:10px;">
            <!-- <i-option value="-1">请选择所在小组</i-option> -->
            <i-option v-for="item in groups" :key="item.name" :value="item.index">{{ item.name }}</i-option>
          </i-select>
        </Form-item>
        <Form-item style="text-align:center;">
          <ButtonGroup>
            <i-button type="primary" @click="signup">注册并登录</i-button>
            <i-button type="default" @click="login">已有账号，去登录</i-button>
          </ButtonGroup>
        </Form-item>
      </i-form>
    </div>
  </div>
</template>

<script>
  import Form from 'iview/src/components/form/form';
  import FormItem from 'iview/src/components/form/form-item';
  import Input from 'iview/src/components/input/input';
  import Button from 'iview/src/components/button/';
  import MessageTips from 'iview/src/components/message';
  import {
    Select,
    Option
  } from 'iview/src/components/select';
  import Modal from 'iview/src/components/Modal/index.js';
  import api from '@/api/index.js';
  window.api = api;
  export default {
    name: 'signup',
    components: {
      'i-form': Form,
      FormItem,
      ButtonGroup: Button.Group,
      'i-input': Input,
      'i-button': Button,
      'i-select': Select,
      'i-option': Option
    },
    created() {
      // 创建完成后获取小组数据
      api
        .getData('Group', false, {
          sort: 'asc',
          field: 'groupIndex'
        })
        .then(result => {
          result.forEach(item => {
            this.groups.push(item.attributes);
          });
        });
    },
    data() {
      return {
        user: {
          name: '',
          pwd: '',
          email: '',
          groupIndex: 0,
          userType: 0,
        },
        usertypes: [{
          value: 0,
          label: '正式员工'
        }, {
          value: 1,
          label: '试用员工'
        }, {
          value: 2,
          label: '实习员工'
        }],
        groups: [],
        rules: {
          name: [{
            required: true,
            message: '请填写用户名',
            trigger: 'blur'
          }],
          pwd: [{
            required: true,
            message: '请填写密码',
            trigger: 'blur'
          }],
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
          ],
          userType: [{
            type: 'number',
            required: true,
            message: '请选择',
            trigger: 'change'
          }],
          groupIndex: [{
            type: 'integer',
            required: true,
            message: '请选择小组',
            trigger: 'change'
          }],
        }
      };
    },
    computed: {
      groupName() {
        if (!this.groups.length || this.user.groupIndex === -1) return '';
        let val = this.groups.filter(item => item.index === this.user.groupIndex)[0].name;
        return val;
      }
    },
    methods: {
      signup() {
        this.$refs.form.validate(isValidated => {
          if (!isValidated) return;
          let groupName = this.groupName,
            user = {
              name: this.user.name,
              pwd: this.user.pwd,
              email: this.user.email,
              groupName: groupName,
              groupIndex: this.user.groupIndex,
              userType: this.user.userType
            };
          console.log(user);
          
          api.signUp(user).then(() => {
            MessageTips.success('注册成功！请进入对应邮箱验证账号！');
            this.$router.push('/');
          });
        });
      },
      login() {
        this.$router.push('/');
      }
    }
  };
</script>

<style>
  .signup-box {
    width: 300px;
    margin-top: -webkit-calc(30% - 120px);
    margin-top: calc(30% - 120px);
    margin-left: auto;
    margin-right: auto;
  }
</style>

