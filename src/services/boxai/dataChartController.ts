// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /chart/delete */
export async function deleteChart(body: API.ChartDeleteDTO, options?: { [key: string]: any }) {
  return request<API.RBoolean>('/chart/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/gen/file */
export async function genFileChart(
  body: { file?: any; goalDescription?: any; generationName?: any },
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.RUniversalDataChartsVO>('/chart/gen/file', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/gen/file/async */
export async function genFileChartAsync(
  body: { file?: any; goalDescription?: any; generationName?: any },
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.RUniversalDataChartsVO>('/chart/gen/file/async', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/gen/multiple */
export async function genMultipleChart(
  body: { files?: any; goalDescription?: any; generationName?: any },
  files?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (files) {
    formData.append('files', files);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.RUniversalDataChartsVO>('/chart/gen/multiple', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/gen/multiple/sync */
export async function genMultipleChartAsync(
  body: { files?: any; goalDescription?: any; generationName?: any },
  files?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (files) {
    formData.append('files', files);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.RUniversalDataChartsVO>('/chart/gen/multiple/sync', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/gen/text */
export async function genTextChart(body: API.ChartCreatTextDTO, options?: { [key: string]: any }) {
  return request<API.RUniversalDataChartsVO>('/chart/gen/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/gen/text/sync */
export async function genTextChartSync(
  body: API.ChartCreatTextDTO,
  options?: { [key: string]: any },
) {
  return request<API.RUniversalDataChartsVO>('/chart/gen/text/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /chart/info */
export async function getChartInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChartInfoParams,
  options?: { [key: string]: any },
) {
  return request<API.RUniversalDataChartsVO>('/chart/info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /chart/info */
export async function updateChartInfo(body: API.ChartUpdateDTO, options?: { [key: string]: any }) {
  return request<API.RBoolean>('/chart/info', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chart/list/info */
export async function listChartInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listChartInfoParams,
  body: API.ChartQueryDTO,
  options?: { [key: string]: any },
) {
  return request<API.RPageUniversalDataChartsVO>('/chart/list/info', {
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
