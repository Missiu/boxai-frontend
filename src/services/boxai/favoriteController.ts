// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /favorite/add */
export async function doFavorite(body: API.FavoriteAddDTO, options?: { [key: string]: any }) {
  return request<API.RBoolean>('/favorite/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /favorite/list/page */
export async function listFavorite(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listFavoriteParams,
  options?: { [key: string]: any },
) {
  return request<API.RPagePostFavorListQueryVO>('/favorite/list/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
