declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseChartFileResponse_ = {
    code?: number;
    data?: ChartFileResponse;
    message?: string;
  };

  type BaseResponseChartFilesResponse_ = {
    code?: number;
    data?: ChartFilesResponse;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageResult_ = {
    code?: number;
    data?: PageResult_;
    message?: string;
  };

  type BaseResponsePageUser_ = {
    code?: number;
    data?: PageUser_;
    message?: string;
  };

  type BaseResponseUserInfoResponse_ = {
    code?: number;
    data?: UserInfoResponse;
    message?: string;
  };

  type ChartDeleteRequest = {
    id?: number;
  };

  type ChartEditRequest = {
    chatData?: string;
    genChart?: string;
    genName?: string;
    genResult?: string;
    goal?: string;
    id?: number;
    isDelete?: number;
    updateTime?: string;
    userId?: number;
  };

  type ChartFileResponse = {
    codeComment?: string;
    codeNorm?: string;
    codeNormStr?: string;
    codeProfile?: string;
    codeSuggestion?: string;
    genName?: string;
    goal?: string;
    usedToken?: string;
    userId?: number;
  };

  type ChartFilesResponse = {
    codeAPI?: string;
    codeCataloguePath?: string;
    codeComment?: string;
    codeEntity?: string;
    codeNorm?: string;
    codeNormStr?: string;
    codeProfile?: string;
    codeRun?: string;
    codeSuggestion?: string;
    codeTechnology?: string;
    genName?: string;
    goal?: string;
    usedToken?: string;
    userId?: number;
  };

  type ChartQueryRequest = {
    current?: number;
    genName?: string;
    goal?: string;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type ChartUpdateRequest = {
    chatData?: string;
    genChart?: string;
    genName?: string;
    genResult?: string;
    goal?: string;
    id?: number;
    isDelete?: number;
    updateTime?: string;
    userId?: number;
  };

  type FileAIGCUsingPOSTParams = {
    genName?: string;
    goal?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageResult_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Result[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUser_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: User[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type Result = {
    codeAPI?: string;
    codeCataloguePath?: string;
    codeComment?: string;
    codeEntity?: string;
    codeNorm?: string;
    codeNormStr?: string;
    codeProfile?: string;
    codeRun?: string;
    codeSuggestion?: string;
    codeTechnology?: string;
    createTime?: string;
    genName?: string;
    goal?: string;
    id?: number;
    isDelete?: number;
    rawData?: string;
    updateTime?: string;
    usedToken?: string;
    userId?: number;
  };

  type TextAIGCUsingPOSTParams = {
    genName?: string;
    goal?: string;
    /** Text */
    Text?: string;
  };

  type User = {
    availableBalance?: number;
    cashBalance?: number;
    createTime?: string;
    id?: number;
    isDelete?: number;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
    userRole?: string;
    voucherBalance?: number;
  };

  type UserDeleteRequest = {
    id?: number;
  };

  type UserInfoResponse = {
    createTime?: string;
    id?: number;
    token?: string;
    updateTime?: string;
    usedToken?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateRequest = {
    updateTime?: string;
    userAccount?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
  };
}
