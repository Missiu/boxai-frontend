// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** deleteUser POST /api/user/delete */
export async function deleteUserUsingPost(
  body: API.UserDeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/user/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getLoginUser GET /api/user/get/login */
export async function getLoginUserUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseUserInfoResponse_>('/api/user/get/login', {
    method: 'GET',
    ...(options || {}),
  });
}

/** listUserByPage POST /api/user/list/page */
export async function listUserByPageUsingPost(
  body: API.UserQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageUser_>('/api/user/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** userLogin POST /api/user/login */
export async function userLoginUsingPost(
  body: API.UserLoginRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseUserInfoResponse_>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** userLogout POST /api/user/logout */
export async function userLogoutUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** userRegister POST /api/user/register */
export async function userRegisterUsingPost(
  body: API.UserRegisterRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** upAccount POST /api/user/update/account */
export async function upAccountUsingPost(
  body: API.UserUpInfoRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/user/update/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** upUserName POST /api/user/update/name */
export async function upUserNameUsingPost(
  body: API.UserUpInfoRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/user/update/name', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** upPassword POST /api/user/update/password */
export async function upPasswordUsingPost(
  body: API.UserUpPassword,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/user/update/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** upUserProfile POST /api/user/update/profile */
export async function upUserProfileUsingPost(
  body: API.UserUpInfoRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/user/update/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
