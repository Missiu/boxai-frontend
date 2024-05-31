// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /user/delete */
export async function userDelete(options?: { [key: string]: any }) {
  return request<API.RBoolean>('/user/delete', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/info */
export async function userLoginInfo(options?: { [key: string]: any }) {
  return request<API.RUserInfoVO>('/user/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /user/info */
export async function updateUserInfo(body: API.UserUpdateDTO, options?: { [key: string]: any }) {
  return request<API.RBoolean>('/user/info', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /user/key */
export async function updateUserKey(body: API.UserUpdateKeyDTO, options?: { [key: string]: any }) {
  return request<API.RBoolean>('/user/key', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/list/info */
export async function listUserInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listUserInfoParams,
  body: API.UserQueryDTO,
  options?: { [key: string]: any },
) {
  return request<API.RPageUserInfoVO>('/user/list/info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/login */
export async function userLogin(body: API.UserLoginDTO, options?: { [key: string]: any }) {
  return request<API.RString>('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/logout */
export async function userLogout(options?: { [key: string]: any }) {
  return request<API.RBoolean>('/user/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /user/password */
export async function updateUserPassword(
  body: API.UserUpdatePasswordDTO,
  options?: { [key: string]: any },
) {
  return request<API.RBoolean>('/user/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/register */
export async function userRegister(body: API.UserRegisterDTO, options?: { [key: string]: any }) {
  return request<API.RString>('/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
