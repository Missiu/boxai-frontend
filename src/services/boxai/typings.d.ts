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

  type BaseResponseInt_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePagePost_ = {
    code?: number;
    data?: PagePost_;
    message?: string;
  };

  type BaseResponsePagePostVO_ = {
    code?: number;
    data?: PagePostVO_;
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
    codeRun?: string;
    codeSuggestion?: string;
    codeTechnology?: string;
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
    id?: number;
    rawData?: string;
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

  type PagePost_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Post[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PagePostVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: PostVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
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

  type Post = {
    content?: string;
    createTime?: string;
    favourNum?: number;
    id?: number;
    isDelete?: number;
    resultId?: number;
    thumbNum?: number;
    updateTime?: string;
    userId?: number;
  };

  type PostFavourAddRequest = {
    postId?: number;
  };

  type PostQueryRequest = {
    content?: string;
    current?: number;
    pageSize?: number;
    resultId?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    title?: string;
    userId?: number;
  };

  type PostThumbAddRequest = {
    postId?: number;
  };

  type PostVO = {
    codeProfile?: string;
    content?: string;
    createTime?: string;
    favourNum?: number;
    genName?: string;
    id?: number;
    isDelete?: number;
    resultId?: number;
    thumbNum?: number;
    updateTime?: string;
    userAvatar?: string;
    userId?: number;
    userName?: string;
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

  type shareWorksUsingPOSTParams = {
    content?: string;
    id?: number;
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
    availableBalance?: number;
    cashBalance?: number;
    createTime?: string;
    id?: number;
    token?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
    voucherBalance?: number;
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

  type UserUpInfoRequest = {
    userAccount?: string;
    userName?: string;
    userProfile?: string;
  };

  type UserUpPassword = {
    checkPassword?: string;
    newPassword?: string;
    oldPassword?: string;
  };
}
