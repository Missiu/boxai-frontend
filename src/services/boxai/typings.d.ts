declare namespace API {
  type ChartCreatTextDTO = {
    goalDescription?: string;
    generationName?: string;
    text?: string;
  };

  type ChartDeleteDTO = {
    id?: number;
  };

  type ChartQueryDTO = {
    goalDescription?: string;
    generationName?: string;
    userId?: number;
    id?: number;
  };

  type ChartUpdateDTO = {
    goalDescription?: string;
    generationName?: string;
    codeComments?: string;
    codeProfileDescription?: string;
    codeEntities?: string;
    codeApis?: string;
    codeExecution?: string;
    codeSuggestions?: string;
    codeNormRadar?: string;
    codeNormRadarDescription?: string;
    codeTechnologyPie?: string;
    codeCatalogPath?: string;
    id?: number;
  };

  type deletePostsParams = {
    id: number;
  };

  type FavoriteAddDTO = {
    userId?: number;
    postId?: number;
  };

  type getChartInfoParams = {
    id: string;
  };

  type listChartInfoParams = {
    pageModel: PageModel;
  };

  type listFavoriteParams = {
    pageModel: PageModel;
  };

  type listPostsParams = {
    pageModel: PageModel;
  };

  type listUserInfoParams = {
    pageModel: PageModel;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
  };

  type PageModel = {
    page?: number;
    size?: number;
    allowDeep?: boolean;
  };

  type PagePostFavorListQueryVO = {
    records?: PostFavorListQueryVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PagePostFavorListQueryVO;
    searchCount?: PagePostFavorListQueryVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PagePostListQueryVO = {
    records?: PostListQueryVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PagePostListQueryVO;
    searchCount?: PagePostListQueryVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageUniversalDataChartsVO = {
    records?: UniversalDataChartsVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageUniversalDataChartsVO;
    searchCount?: PageUniversalDataChartsVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageUserInfoVO = {
    records?: UserInfoVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageUserInfoVO;
    searchCount?: PageUserInfoVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PostAddDTO = {
    content?: string;
    chartId?: number;
  };

  type PostFavorListQueryVO = {
    id?: number;
    likesCount?: number;
    favoritesCount?: number;
    content?: string;
    userId?: number;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
    nickname?: string;
    avatarUrl?: string;
    generationName?: string;
    codeProfileDescription?: string;
    postId?: number;
  };

  type PostListQueryVO = {
    id?: number;
    likesCount?: number;
    favoritesCount?: number;
    content?: string;
    userId?: number;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
    nickname?: string;
    avatarUrl?: string;
    generationName?: string;
    codeProfileDescription?: string;
    postId?: number;
  };

  type PostQueryDTO = {
    id?: number;
    generationName?: string;
    codeProfileDescription?: string;
    content?: string;
    userId?: number;
    nickname?: string;
    postId?: number;
  };

  type RBoolean = {
    code?: number;
    msg?: string;
    data?: boolean;
  };

  type RPagePostFavorListQueryVO = {
    code?: number;
    msg?: string;
    data?: PagePostFavorListQueryVO;
  };

  type RPagePostListQueryVO = {
    code?: number;
    msg?: string;
    data?: PagePostListQueryVO;
  };

  type RPageUniversalDataChartsVO = {
    code?: number;
    msg?: string;
    data?: PageUniversalDataChartsVO;
  };

  type RPageUserInfoVO = {
    code?: number;
    msg?: string;
    data?: PageUserInfoVO;
  };

  type RString = {
    code?: number;
    msg?: string;
    data?: string;
  };

  type RUniversalDataChartsVO = {
    code?: number;
    msg?: string;
    data?: UniversalDataChartsVO;
  };

  type RUserInfoVO = {
    code?: number;
    msg?: string;
    data?: UserInfoVO;
  };

  type UniversalDataChartsVO = {
    goalDescription?: string;
    generationName?: string;
    aiTokenUsage?: number;
    userId?: number;
    codeComments?: string;
    rawData?: string;
    codeProfileDescription?: string;
    codeEntities?: string;
    codeApis?: string;
    codeExecution?: string;
    codeSuggestions?: string;
    codeNormRadar?: string;
    codeNormRadarDescription?: string;
    codeTechnologyPie?: string;
    codeCatalogPath?: string;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
    fileType?: string;
    status?: string;
    execMessage?: string;
    id?: number;
  };

  type UserInfoVO = {
    id?: number;
    account?: string;
    nickname?: string;
    avatarUrl?: string;
    profile?: string;
    availableBalance?: number;
    voucherBalance?: number;
    cashBalance?: number;
    role?: string;
    createTime?: string;
    updateTime?: string;
    token?: string;
  };

  type UserLoginDTO = {
    userAccount: string;
    userPassword: string;
  };

  type UserQueryDTO = {
    id?: number;
    userAccount?: string;
    nickname?: string;
  };

  type UserRegisterDTO = {
    userAccount: string;
    userPassword: string;
    checkPassword: string;
  };

  type UserUpdateDTO = {
    nickname?: string;
    profile?: string;
    userAccount?: string;
  };

  type UserUpdateKeyDTO = {
    role?: string;
  };

  type UserUpdatePasswordDTO = {
    newPassword: string;
    checkPassword: string;
    oldPassword: string;
  };
}
