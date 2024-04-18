declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseChatCompletionResponse_ = {
    code?: number;
    data?: ChatCompletionResponse;
    message?: string;
  };

  type BaseResponseLoginUserResponse_ = {
    code?: number;
    data?: LoginUserResponse;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageChart_ = {
    code?: number;
    data?: PageChart_;
    message?: string;
  };

  type BaseResponsePageUser_ = {
    code?: number;
    data?: PageUser_;
    message?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    message?: string;
  };

  type Chart = {
    chatData?: string;
    createTime?: string;
    genChart?: string;
    genName?: string;
    genResult?: string;
    goal?: string;
    id?: number;
    isDelete?: number;
    updateTime?: string;
    userId?: number;
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
    createTime?: string;
    genChart?: string;
    genName?: string;
    genResult?: string;
    goal?: string;
    id?: number;
    isDelete?: number;
    updateTime?: string;
    userId?: number;
  };

  type ChatCompletionResponse = {
    genChart?: string;
  };

  type genChartByAiUsingPOSTParams = {
    genName?: string;
    goal?: string;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type LoginUserResponse = {
    createTime?: string;
    token?: string;
    updateTime?: string;
    usedToken?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageChart_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Chart[];
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

  type User = {
    createTime?: string;
    id?: number;
    isDelete?: number;
    token?: string;
    updateTime?: string;
    usedToken?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserDeleteRequest = {
    id?: number;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    id?: number;
    mpOpenId?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateMyRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
  };

  type UserUpdateRequest = {
    createTime?: string;
    id?: number;
    token?: string;
    updateTime?: string;
    usedToken?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
    userRole?: string;
  };
}
