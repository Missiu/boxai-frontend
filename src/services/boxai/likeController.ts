// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /like/add */
export async function doLike(body: API.FavoriteAddDTO, options?: { [key: string]: any }) {
  return request<API.RBoolean>('/like/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
