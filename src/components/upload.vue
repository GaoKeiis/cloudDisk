<template>
<div class="upload">
</div>
</template>

<script>

import $ from 'jquery'
import WebUploader from 'webuploader'
import SparkMD5 from 'spark-md5'
//  eslint-disable-next-line
var fileMd5;
//  eslint-disable-next-line
var fileName;
//  eslint-disable-next-line
import {getFileinit,postFileUpload} from '@/apis/api'
export default {
    name: 'vue-upload',
    props: {
        accept: {
            type: Object,
            default: null,
        },
        // 上传地址
        url: {
            type: String,
            default: '',
        },
        // 上传最大数量 默认为100
        fileNumLimit: {
            type: Number,
            default: 100,
        },
        // 大小限制 默认2M
        fileSingleSizeLimit: {
            type: Number,
            default: 2048000,
        },
        // 上传时传给后端的参数，一般为token，key等

        // 生成formData中文件的key，下面只是个例子，具体哪种形式和后端商议
        keyGenerator: {
            type: Function,
            default(file) {
                const currentTime = new Date().getTime();
                const key = `${currentTime}.${file.name}`;
                return key;
            },
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        // 上传按钮ID
        uploadButton: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            uploader: null,
            spark: new SparkMD5.ArrayBuffer(),
            uploadFile:'',
            fileIds: [],
            blockinds:0,
            filekinds:0,
        };
    },
    mounted() {
        this.initWebUpload();
    },
    methods: {
        md5File(file){
            var spark = new SparkMD5();
            spark.append(file.name)
            return spark.end()
        },
        initWebUpload() {
            let that = this;
            // let token = Vue.$cookies.get('token')
            this.uploader = WebUploader.create({
                auto: false, // 选完文件后，是否自动上传
                server:'/resource/bigfile/upload/do',  // 文件接收服务端
                pick: {
                    id: this.uploadButton,     // 选择文件的按钮
                    multiple: "true",   // 是否多文件上传 默认false
                    label: '',
                },
                accept: this.getAccept(this.accept),  // 允许选择文件格式。
                threads: 5,
                chunkRetry: 5,
                fileNumLimit: this.fileNumLimit, // 限制上传个数
                //fileSingleSizeLimit: this.fileSingleSizeLimit, // 限制单个上传图片的大小
                formData: {},  // 上传所需参数
                chunked: true,          //分片上传
                chunkSize: 2048000,    //分片大小
                duplicate: true,  // 重复上传
                method:'POST'
            });
            // 当有文件被添加进队列的时候，添加到页面预览
            this.uploader.on('fileQueued', (file) => {
                    let folderIds,resourceName;
                    if($(".transverseClass").attr("data-id")) {
                        folderIds = $(".transverseClass").attr("data-id")
                        resourceName = $(".transverseClass").find('p span').text()
                    } else if($(".current-action").attr("data-id")) {
                        folderIds = $(".current-action").attr("data-id")
                        resourceName = $(".current-action").find('p a').text()
                    } else {
                        folderIds = this.$route.query.originId
                        resourceName = this.$route.query.names
                    }
                if(file.size > 1048000) {
                       let Fileinitdata = {  
                            fileMd5: that.md5File(file),
                            fileName: file.name,
                            fileSize: file.size,
                            folderId: folderIds *1,
                            resourceName:resourceName
                        };
                      getFileinit(Fileinitdata).then((res) => {
                          if(res.data.code == 200) {
                            that.fileIds.push(res.data.data.fileId)
                            that.uploader.options.formData.fileId =  res.data.data.fileId;
                            that.blockinds = 0
                            that.$notify({
                                title: '成功',
                                message: '请前往进度页面，查看上传进度',
                                type: 'success'
                            });
                          } else {
                            that.$message.error(res.data.message);
                            }
                        }).catch((err) => {
                            that.$message.error(err.data.message);
                        });
                        let itemVal = setInterval(()=>{
                            if(that.fileIds.length) {
                                that.uploader.options.auto = true
                                that.uploader.upload()
                                this.$emit('fileChange', file,that.fileIds);
                                clearInterval(itemVal)
                            }
                        })
                } else {
                     var formData = new FormData();
                    formData.append("file",file.source.source);
                    formData.append("folderId", folderIds*1);
                    formData.append("resourceName", resourceName);
                    postFileUpload(formData).then((res)=>{
                        if(res.data.code == 200) {
                            window.eventBus.$emit("uploadClick", {
                                uploadId:1
                            });
                            that.$message.success('上传成功');
                        } else {
                            that.$message.error(res.data.message);
                        }
                    })
                }
            });
            // this.uploader.on('uploadStart', (file) => {
            //     console.log(file)
            // });
            // 文件上传过程中创建进度条实时显示。
            this.uploader.on('uploadProgress', (file, percentage) => {
                this.$emit('progress', file, percentage);
            });

            this.uploader.on('uploadBeforeSend', function( block, data,headers ) {
                // block为分块数据。
                // file为分块对应的file对象。
                $.extend(headers, {
                    "Authorization": that.$cookies.get('token')
                });
                if(block.chunk+1<=block.chunks) {
                    data.chunk = block.chunk+1
                    data.chunks = block.chunks
                    data.fileId = that.fileIds[that.filekinds-1]
                }
                if(block.chunk+1 == block.chunks) {
                    that.filekinds++;
                }
            });
            this.uploader.on('uploadSuccess', (file, response) => {
                console.log(file,response)
                if(response.code == 200) {
                    that.blockinds++;
                    if(that.fileIds.length == that.blockinds) {
                        this.$emit('success', that.fileIds);
                    }
                } else {
                    this.$message.error(response.data.message);
                }
            });
            this.uploader.on('uploadError', (file, reason) => {
                this.$emit('uploadError', file, reason);
            });

            this.uploader.on('error', (type) => {
                let errorMessage = '';
                if (type === 'F_EXCEED_SIZE') {
                    errorMessage = `文件大小不能超过${this.fileSingleSizeLimit / (1024 * 1000)}M`;
                } else if (type === 'Q_EXCEED_NUM_LIMIT') {
                    errorMessage = '文件上传已达到最大上限数';
                } else {
                    errorMessage = `上传出错！请检查后重新上传！错误代码${type}`;
                }

                this.$emit('error', errorMessage);
            });

            this.uploader.on('uploadComplete', (file, response) => {
                this.$emit('complete', file, response);
            });
        },

        upload(file) {
            this.uploader.upload(file);
        },
        stop(file) {
            this.uploader.stop(file);
        },
        // 取消并中断文件上传
        cancelFile(file) {
            this.uploader.cancelFile(file);
        },
        // 在队列中移除文件
        removeFile(file, bool) {
            this.uploader.removeFile(file, bool);
        },
        getAccept(accept) {
            switch (accept) {
                case 'text':
                    return {
                        title: 'Texts',
                        exteensions: 'xlsx,xlsm,xltx,xltm,xlam,csv,doc,docx,docm,dot,dotm,dotx,wps,ppt,pptx,pptm,potx,potm,ppam,ppsx,ppsm,pdf',
                        mimeTypes: '.xlsx,.xlsm,.xltx,.xltm,.xlam,.csv,.doc,.docx,.docm,.dot,.dotm,.dotx,.wps,.ppt,.pptx,.pptm,.potx,.potm,.ppam,.ppsx,.ppsm,.pdf'
                    };
                case 'audio':
                    return {
                        title: 'audios',
                        exteensions: 'wav,flac,ape,alac,wavpack,wv,mp3,aac,opus,vorbis',
                        mimeTypes: '.wav,.flac,.ape,.alac,.wavpack,.wv,.mp3,.aac,.opus,.vorbis'
                    };
                case 'video':
                    return {
                        title: 'Videos',
                        exteensions: 'wmv,asf,asx,rm,rmvb,mp4,3gp,3g2,mov,m4v,avi,dat,mkv,flv,f4v,vod,mpge,mpeg1,mpeg2,divx,xvid,dv,mkv,ogg,mod,swf,raw,crm,h.264,avc,m1v,m2t,m2v,m4a,r3d',
                        mimeTypes: '.wmv,.asf,.asx,.rm,.rmvb,.mp4,.3gp,.3g2,.mov,.m4v,.avi,.dat,.mkv,.flv,.f4v,.vod,.mpge,.mpeg1,.mpeg2,.divx,.xvid,.dv,.mkv,.ogg,.mod,.swf,.raw,.crm,.h.264,.avc,.m1v,.m2t,.m2v,.m4a,.r3d'
                    };
                case 'image':
                    return {
                        title: 'Images',
                        exteensions: 'jpg,jpeg,jpe,png,gif,svg,tga,bmp',
                        mimeTypes: '.jpg,.jpeg,.jpe,.png,.gif,.svg,.tga,.bmp'
                    };
                default: return accept
            }
        },

    },
};
</script>

<style lang="scss">
.webuploader-container {
    position: relative;
}
.webuploader-element-invisible {
    position: absolute !important;
    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    clip: rect(1px,1px,1px,1px);
}
.webuploader-pick {
    position: relative;
    display: inline-block;
    cursor: pointer;
    background: #00b7ee;
    padding: 10px 15px;
    color: #fff;
    text-align: center;
    border-radius: 3px;
    overflow: hidden;
}
.webuploader-pick-hover {
    background: #00a2d4;
}

.webuploader-pick-disable {
    opacity: 0.6;
    pointer-events:none;
}

</style>
