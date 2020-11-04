// let ClouDiskUrl = 'http://192.168.10.48:9002/api-fb';
// let ClouDiskUrl = 'http://192.168.10.48:9201';

// 初始化 -> 资源=当前剧组下所有的业务文件夹
const getHomeInit = (params)=>getAction(ClouDiskUrl + '/resource/init', params);
// 所有文件的数量和大小 <- 资源首页
const getHomeCountFile = (params)=>getAction(ClouDiskUrl + '/resource/home/countFile', params);
// 操作日志列表
const getResourceLog = (params)=>getAction(ClouDiskUrl + '/resourceLog/list', params);
// 树状列表文件夹
const getTreeList = (params)=>getAction(ClouDiskUrl + '/resource/folder/treeList', params);
// 移动文件
const getFileMove = (params)=>getAction(ClouDiskUrl + '/resource/file/move', params);
// 移动文件夹
const getFolderMove = (params)=>getAction(ClouDiskUrl + '/resource/folder/move', params);
// 复制文件
const getFileCopy = (params)=>getAction(ClouDiskUrl + '/resource/file/copy', params);
// 复制文件夹
const getFolderCopy = (params)=>getAction(ClouDiskUrl + '/resource/folder/copy', params);

// 获取首页文件夹
const getHomeData = (params)=>getAction(ClouDiskUrl + '/resource/home', params);
// 获取首页文件夹下的资源
const getHomeList = (params)=>getAction(ClouDiskUrl + '/resource/list', params);
// 新建文件夹
const getCreateData = (params)=>getAction(ClouDiskUrl + '/resource/folder/create', params);
// 重命名文件夹
const getFolderRename = (params)=>getAction(ClouDiskUrl + '/resource/folder/rename', params);

// 重命名文件
const getFileRename = (params)=>getAction(ClouDiskUrl + '/resource/file/rename', params);
// 删除文件
const getFileDelete = (params)=>getAction(ClouDiskUrl + '/resource/file/delete', params);
// 删除文件夹
const getFolderDelete = (params)=>getAction(ClouDiskUrl + '/resource/folder/delete', params);
// 小文件上传
const postFileUpload = (params)=>postFileAction(ClouDiskUrl + '/resource/file/upload', params);
// 预览文件
const getPreview = (params)=>getAction(ClouDiskUrl + '/resource/file/preview', params);
// 文件权限
const getAlloAuths = (params)=>getAction(ClouDiskUrl + '/resource/folder/alloAuths', params);
// 文件成员
const getUsers = (params)=>getAction(ClouDiskUrl + '/crew/users', params);


// 注册上传文件
const getFileinit = (params)=>getAction(ClouDiskUrl + "/resource/bigfile/upload/init",params);
const postActioninit = (params)=>postAction(ClouDiskUrl + '/resource/bigfile/upload/do', params);
const getMerge = (params)=>getAction(ClouDiskUrl + '/resource/bigfile/upload/merge', params);
const getuploadList = (params)=>getAction(ClouDiskUrl + '/fileProgress/upload/list', params);
const getuploadSelect = (params)=>getAction(ClouDiskUrl + '/fileProgress/upload/select', params);
const getuploadDelete = (params)=>getAction(ClouDiskUrl + '/fileProgress/upload/delete', params);
// 下载文件
const getDownloadList = (params)=>getAction(ClouDiskUrl + '/fileProgress/download/list', params);
const getDownloadDelete = (params)=>getAction(ClouDiskUrl + '/fileProgress/download/delete', params);
const getDownloadStart = (params)=>getAction(ClouDiskUrl + '/resource/bigfile/download/start', params);
const getDownloadEnd = (params)=>getAction(ClouDiskUrl + '/resource/bigfile/download/end', params);

// 小文件下载
const getFileDownload = (params)=>downloadFileUrl(ClouDiskUrl + '/resource/file/download', params);