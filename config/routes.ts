export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
    ],
  },
  { name: 'Github源代码分析', path: '/chart', icon: 'dashboard', component: './AddChart' },
  { name: '数据与可视化', path: '/history', icon: 'database', component: './History' },
  { name: '共享数据大厅', path: '/post/index', icon: 'table', component: './Post/index' },
  { path: '/post/PostData', component: './Post/PostData' },
  { name: '个人收藏', path: '/post/PostFavour', icon: 'star', component: './Post/PostFavour' },
  { name: '个人信息', path: '/user/info', icon: 'user', component: './User/UserInfo' },
  { path: '/', redirect: '/chart' },
  { path: '*', layout: false, component: './404' },
];
