export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
    ],
  },
  { name: '数据分析', path: '/chart', icon: 'dashboard', component: './AddChart' },
  { name: '个人信息', path: '/user/info', icon: 'user', component: './User/UserInfo' },
  { name: '历史记录', path: '/history', icon: 'database', component: './History' },
  { path: '/', redirect: '/chart' },
  { path: '*', layout: false, component: './404' },
];
