import { getAction, postAction,postFileAction,downloadFileUrl } from './file'
// 首页文件
let ClouDiskUrl = 'http://124.70.51.21:9001/api-fb';
let ClouDiskApiAuth = 'http://124.70.51.21:9001/api-auth';

// 初始化 -> 资源=当前剧组下所有的业务文件夹
const getHomeInit = (params)=>getAction('/resource/init', params);
// 所有文件的数量和大小 <- 资源首页
const getHomeCountFile = (params)=>getAction('/resource/home/countFile', params);
// 操作日志列表
const getResourceLog = (params)=>getAction(ClouDiskUrl+ '/resourceLog/list', params);
// 树状列表文件夹
const getTreeList = (params)=>getAction('/resource/folder/treeList', params);
// 移动文件
const getFileMove = (params)=>getAction('/resource/file/move', params);
// 移动文件夹
const getFolderMove = (params)=>getAction('/resource/folder/move', params);
// 复制文件
const getFileCopy = (params)=>getAction('/resource/file/copy', params);
// 复制文件夹
const getFolderCopy = (params)=>getAction('/resource/folder/copy', params);

// 获取首页文件夹
const getHomeData = (params)=>getAction('/resource/home', params);
// 获取首页文件夹下的资源
const getHomeList = (params)=>getAction('/resource/list', params);
// 新建文件夹
const getCreateData = (params)=>getAction('/resource/folder/create', params);
// 重命名文件夹
const getFolderRename = (params)=>getAction('/resource/folder/rename', params);

// 重命名文件
const getFileRename = (params)=>getAction('/resource/file/rename', params);
// 删除文件
const getFileDelete = (params)=>getAction('/resource/file/delete', params);
// 删除文件夹
const getFolderDelete = (params)=>getAction('/resource/folder/delete', params);
// 小文件上传
const postFileUpload = (params)=>postFileAction('/resource/file/upload', params);
// 预览文件
const getPreview = (params)=>getAction('/resource/file/preview', params);
// 文件权限
const getAlloAuths = (params)=>getAction('/resource/folder/alloAuths', params);
// // 文件成员
// const getUsers = (params)=>getAction('/crew/users', params);
// 文件成员
// const getUsers = (params)=>getAction('/user/listUnderCrew', params);
const getUsers = (params)=>getAction(ClouDiskApiAuth+ '/crew/listUser', params);
//当前剧组下某个成员基本信息
const getSelectUser = (params)=>getAction(ClouDiskApiAuth+ '/crew/selectUser', params);
// 某个用户的权限集
const getListAuthsOfUser = (params)=>getAction('/resource/folder/listAuthsOfUser', params);

// 注册上传文件
const getFileinit = (params)=>getAction("/resource/bigfile/upload/init",params);
const postActioninit = (params)=>postAction('/resource/bigfile/upload/do', params);
const getMerge = (params)=>getAction('/resource/bigfile/upload/merge', params);

const getuploadList = (params)=>getAction(ClouDiskUrl+ '/fileProgress/upload/list', params);
const getuploadSelect = (params)=>getAction(ClouDiskUrl+ '/fileProgress/upload/select', params);
const getuploadDelete = (params)=>getAction(ClouDiskUrl+ '/fileProgress/upload/delete', params);
// 下载文件
const getDownloadList = (params)=>getAction(ClouDiskUrl+ '/fileProgress/download/list', params);
const getDownloadDelete = (params)=>getAction(ClouDiskUrl+ '/fileProgress/download/delete', params);
const getDownloadStart = (params)=>getAction('/resource/bigfile/download/start', params);
const getDownloadEnd = (params)=>getAction('/resource/bigfile/download/end', params);

// 小文件下载
const getFileDownload = (params)=>downloadFileUrl('/resource/file/download', params);


// 任务模块
const getTaskList = (params)=>getAction(ClouDiskUrl+ '/task/list', params);

// 任务新增
const getTaskCreate = (params)=>getAction(ClouDiskUrl+ '/task/create', params);
// 任务修改
const getTaskUpdate = (params)=>postAction(ClouDiskUrl+ '/task/update', params);
// 任务删除
const getTaskDelete = (params)=>getAction(ClouDiskUrl+ '/task/delete', params);
// 任务甘特图
const getTaskGanter = (params)=>getAction(ClouDiskUrl+ '/task/ganter', params);


// 任务留言新增
const getTaskChatCreate = (params)=>getAction(ClouDiskUrl+ '/taskChat/create', params);
// 任务留言列表
const getTaskChatList = (params)=>getAction(ClouDiskUrl+ '/taskChat/list', params);
// 任务留言删除
const getTaskChatDelete = (params)=>getAction(ClouDiskUrl+ '/taskChat/delete', params);
// 任务参与人列表
const getTaskPartnerList = (params)=>getAction(ClouDiskUrl+ '/taskPartner/list', params);
// 任务参与人新增
const getTaskPartnerCreate= (params)=>getAction(ClouDiskUrl+ '/taskPartner/create', params);
// 任务参与人删除
const getTaskPartnerDelete = (params)=>getAction(ClouDiskUrl+ '/taskPartner/delete', params);

// 创建任务之前->首先创建该任务的文件夹
const getCreateTaskFolder = (params)=>getAction('/resource/business/createTaskFolder', params);
// 查询业务模块所在的文件夹ID
const getSelectFolderId = (params)=>getAction('/resource/business/selectFolderId', params);
// 我的任务列表
const getWhoAmI = (params)=>getAction(ClouDiskUrl+ '/task/listWhoAmI', params);
//  我参与的列表
const getListIamPartner = (params)=>getAction(ClouDiskUrl+ '/task/listIamPartner', params);

// 执行列表接口
const getTaskPaint = (params)=>getAction(ClouDiskUrl+ '/taskExcution/paint', params);
// 执行列表接口
const getPaintIamPartner = (params)=>getAction(ClouDiskUrl+ '/taskExcution/paintIamPartner', params);



export {
  getPaintIamPartner,
  getListIamPartner,
  getTaskPaint,
  getWhoAmI,
  getSelectFolderId,
  getCreateTaskFolder,
  getTaskGanter,
  getTaskPartnerCreate,
  getTaskPartnerDelete,
  getTaskPartnerList,
  getListAuthsOfUser,
  getSelectUser,
  getTaskChatDelete,
  getTaskChatCreate,
  getTaskChatList,
  getTaskDelete,
  getTaskCreate,
  getTaskUpdate,
  getTaskList,
  getDownloadStart,
  getDownloadEnd,
  getDownloadList,
  getDownloadDelete,
  getUsers,
  getFileCopy,
  getFolderCopy,
  getFileMove,
  getFolderMove,
  getTreeList,
  getFileDownload,
  getAlloAuths,
  getPreview,
  postFileUpload,
  getFolderDelete,
  getFileDelete,
  getFileRename,
  getCreateData,
  getHomeList,
  getFolderRename,
  getFileinit,
  postActioninit,
  getMerge,
  getuploadList,
  getuploadSelect,
  getuploadDelete,
  getHomeData,
  getHomeCountFile,
  getResourceLog,
  getHomeInit
}