// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** deleteChart POST /api/chart/delete */
export async function deleteChartUsingPost(
  body: API.ChartDeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/chart/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** editChart POST /api/chart/edit */
export async function editChartUsingPost(
  body: API.ChartEditRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/chart/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** FileAIGC POST /api/chart/FileAIGC */
export async function fileAigcUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.FileAIGCUsingPOSTParams,
  body: {},
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

  return request<API.BaseResponseChartFileResponse_>('/api/chart/FileAIGC', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** FilesAIGC POST /api/chart/FilesAIGC */
export async function filesAigcUsingPost(
  body: {
    /** 文件数组 */
    files?: any[];
    genName?: string;
    goal?: string;
  },
  options?: { [key: string]: any },
) {
  const formData = new FormData();

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

  return request<API.BaseResponseChartFilesResponse_>('/api/chart/FilesAIGC', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** listMyChartByPage POST /api/chart/list/my/page */
export async function listMyChartByPageUsingPost(
  body: API.ChartQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageResult_>('/api/chart/list/my/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listChartByPage POST /api/chart/list/page */
export async function listChartByPageUsingPost(
  body: API.ChartQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageResult_>('/api/chart/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** TextAIGC POST /api/chart/TextAIGC */
export async function textAigcUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.TextAIGCUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseChartFileResponse_>('/api/chart/TextAIGC', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** updateCodeAPI POST /api/chart/update/codeAPI */
export async function updateCodeApiUsingPost(
  body: API.ChartUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/chart/update/codeAPI', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateCodeCataloguePath POST /api/chart/update/codeCataloguePath */
export async function updateCodeCataloguePathUsingPost(
  body: API.ChartUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/chart/update/codeCataloguePath', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateCodeComment POST /api/chart/update/codeComment */
export async function updateCodeCommentUsingPost(
  body: API.ChartUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/chart/update/codeComment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateCodeNormStr POST /api/chart/update/codeNormStr */
export async function updateCodeNormStrUsingPost(
  body: API.ChartUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/chart/update/codeNormStr', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateCodeProfile POST /api/chart/update/codeProfile */
export async function updateCodeProfileUsingPost(
  body: API.ChartUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/chart/update/codeProfile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateCodeRun POST /api/chart/update/codeRun */
export async function updateCodeRunUsingPost(
  body: API.ChartUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/chart/update/codeRun', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateCodeSuggestion POST /api/chart/update/codeSuggestion */
export async function updateCodeSuggestionUsingPost(
  body: API.ChartUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/chart/update/codeSuggestion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateGenName POST /api/chart/update/genName */
export async function updateGenNameUsingPost(
  body: API.ChartUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/chart/update/genName', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
