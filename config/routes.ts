export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
    ],
  },
  { name: '数据分析', path: '/chart', icon: 'smile', component: './AddChart' },
  { name: '个人信息', path: '/user/info', icon: 'smile', component: './User/UserInfo' },
  { name: '历史记录', path: '/history', icon: 'smile', component: './History' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },
  // { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/chart' },
  { path: '*', layout: false, component: './404' },
];
