// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /post/delete */
export async function deletePosts(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePostsParams,
  options?: { [key: string]: any },
) {
  return request<API.RBoolean>('/post/delete', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /post/list/page */
export async function listPosts(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listPostsParams,
  body: API.PostQueryDTO,
  options?: { [key: string]: any },
) {
  return request<API.RPagePostListQueryVO>('/post/list/page', {
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

/** 此处后端没有提供注释 POST /post/share */
export async function sharePosts(body: API.PostAddDTO, options?: { [key: string]: any }) {
  return request<API.RBoolean>('/post/share', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
