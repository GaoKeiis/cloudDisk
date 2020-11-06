<template>
  <div class="taskfiles">
      <div class="taskfiles-head">
        <div class="taskfiles-all">
          <ul class="head-left">
          <li @click="operationFn(0)">
            <img src="../assets/folder-icon.png">
            新建
          </li>
          <li @click="operationFn(1)">
            <img src="../assets/recordoff.png">
            删除
          </li>
          <li @click="operationFn(5)">
            <img src="../assets/submit-review.png">
            提交审核
          </li>
        </ul>
        <ul class="head-right">
          <li @click="operationFn(2)">
            <img src="../assets/appoint-icon.png">
            指定
          </li>
          <li @click="operationFn(3)">
            <img src="../assets/folder-icon.png">
            打开
          </li>
          <li @click="operationFn(4)">
            <img src="../assets/downfile.png">
            下载
          </li>
        </ul>
        </div>
        <div class="taskfiles-address">
            <div class="file-conten-left" @click='taskRefresh'>
              <i class="el-icon-refresh-right"></i>
            </div>
            <div class="file-conten-link">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <!-- eslint-disable-next-line -->
                <el-breadcrumb-item
                  v-for="(items,ind) in breadcrumb"
                  :key="ind"
                  :to="{ path: addressURL,query:{'originId': items.id,'names':items.name}}"
                >
                  {{items.name}}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
        </div>
      </div>
      <div class="taskfiles-cont">
        <ul v-if="filist.length>0">
          <li v-for="(item,ind) in filist"
              :key="ind"
              @dblclick="transverseFn(item)"
              @click="filistClick(item,$event,ind)"
              :data-id="item.id"
              :data-type="item.type"
              :data-size="item.size"
          >
                <img v-if="suffixFun(item.text)" :src="suffixFun(item.suffix)">
                <img v-else src="../assets/other-icon.png">
                 <p v-if="item.name !='新建文件夹'">
                  {{ item.name }}
                 </p>
              <p v-else><el-input size="mini" v-focus @blur="folderChange" v-model="folderName" placeholder="请输入内容"></el-input></p>
          </li>
        </ul>
        <div v-else class="taskfiles-Tips">
          暂无数据
        </div>
      </div>
      <div class="taskfiles-foot">
         <p>{{ CountFile.totalNum }} 个文件</p>
        <p>{{ Math.floor(CountFile.totalSize*100)/100 }} GB</p>
        <P>/ {{ CountFile.crewSize }} GB</P>
      </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { getHomeCountFile,getHomeList,getPreview,getCreateData,getFolderDelete,getFileDelete,getFileDownload,getDownloadStart } from '@/apis/api'
//  eslint-disable-next-line
import axios from 'axios'
//  eslint-disable-next-line
var CancelToken = axios.CancelToken;
//  eslint-disable-next-line
window.source = CancelToken.source();
window.cancels = {}
export default {
    name: 'taskfiles',
    props:['handleStr'],
    data() {
        return {
          filistItem:'',
           filist:[],
           CountFile:'',
           folderName:"新建文件夹",
           breadcrumb:[
             {
               id:'',
               name: '首页'
             }
           ],
           shiftArr:[],
           downIstrue:true,
          isshift: false,
          addressURL:'',
          suffixArr: [
          {
            text: 'video',
            arr:['wmv','asf','asx','rm','rmvb','mp4','3gp','3g2','mov','m4v','avi','dat','mkv','flv','f4v','vod','mpge','mpeg1','mpeg2','divx','xvid','dv','mkv','ogg','mod','swf','raw','crm','h.264','avc','m1v','m2t','m2v','m4a','r3d']
          },
          {
            text: 'audio',
            arr:['wav','flac','ape','alac','wavpack','wv','mp3','aac','opus','vorbis']
          },
          {
            text: 'Word',
            arr:['doc','docx','docm','dot','dotm','dotx','wps']
          },
          {
            text: 'ppt',
            arr:['ppt','pptx','pptm','potx','potm','ppam','ppsx','ppsm']
          },
          {
            text: 'pdf',
            arr:['pdf']
          },
          {
            text: 'img',
            arr:['jpg','jpeg','jpe','png','gif','svg','tga','bmp']
          },
          {
            text: 'photoshop',
            arr:['psd','pdd','psb','rle','dib','dic','dcm','dc3','eps','iff','tdi','jpx','jp2','j2c','j2k','jpc','pcx','pdp','tif','tiff','vda','icb','vst','pbm','pgm','ppm','pnm']
          },
          {
            text: 'Illustrator',
            arr:['idea','ai','ait','draw','line','sket','dog','dxf','cgm','cdr','emf','pic','rtf','pxr']
          },
          {
            text: 'FinalCut',
            arr:['caf','bwf','mts','fcp','ale','fcproject','dpx','caff','arcut','edl','movieproj']
          },
          {
            text: 'Premiere',
            arr:['prel','prproj']
          },
          {
            text: 'AfterEffects',
            arr:['aep','aepx']
          },
          {
            text: '字幕文件',
            arr:['dfxp','mcc','scc','srt','stl','ass','smi','ssa','sub','idx']
          },
          {
            text: '压缩文件',
            arr:['0','000','001','7z','ace','ain','alz','apz','ar','arc','ari','arj','axx','bh','bhx','boo','bz','bza','bz2','c00','c01','c02','cab','car','cbr','cbz','cp9','cpgz','cpt','dar','dd','dgc','efw','f','gca','gz','ha','hbc','hbc2','hbe','hki','hki1','hki2','hki3','hpk','hyp','ice','imp','ipk','ish','jar','jgz','jic','kgb','kz','lbr','lha','lnx','lqr','lz4','lzh','lzm','lzma','lzo','lzx','md','mint','mou','mpkg','mzp','nz','p7m','package','pae','pak','paq6','paq7','paq8','par','par2','pbi','pcv','pea','pf','pim','pit','piz','puz','pwa','qda','r00','r01','r02','r03','rar','rk','rnc','rpm','rte','rz','rzs','s00','s01','s02','s7z','sar','sdn','sea','sfs','sfx','sh','shar','shk','shr','sit','sitx','spt','sqx','sqz','tar','taz','tbz','tbz2','tgz','tlz','tlz4','txz','uc2','uha','uue','wot','xef','xx','xxe','xz','y','yz','yz1','z','zap','zip','zix','zoo','zz']
          },
          {
            text: '文本文件',
            arr:["txt"]
          }
      ],
        };
    },
    directives: {
      // 注册一个局部的自定义指令 v-focus
      focus: {
        // 指令的定义
        inserted: function (el) {
          // 聚焦元素
          el.querySelector('input').focus()
        }
      }
    },
    created() {
      this.keyevent();
    },
    watch:{
      '$route' (to) {
        this.breadcrumb.map((item,ind)=>{
          if(item.id == to.query.originId){
            this.breadcrumb = this.breadcrumb.slice(0,ind+1)
          }
        })
          let obj = {};
          this.breadcrumb = this.breadcrumb.reduce((cur,next) => {
              obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
              return cur;
          },[])
          if(to.query.originId) {
            this.getHomeListFn(to.query.originId)
          } else {
            this.getHomeListFn(this.handleStr.folderId)
          }
         this.$router.push({ query: {} });
      },
    },
    mounted() {
      this.getHomeCountFileFn();
      this.getHomeListFn(this.handleStr.folderId)
      this.$nextTick(()=> {
        // 监听窗口大小变化
        // 监听窗口大小变化
        if($(".abow_dialog .el-dialog").length>0) {
          this.addressURL = "/folder/4"
          $(".taskfiles-cont").height($(".abow_dialog .el-dialog").innerHeight()).css("flex",'none')
        } else{
          this.addressURL = "/folder/2"
        }
      })
    },
    methods: {
      folderChange(){  // 新建接口
      let folderName
      if(this.folderName) { // 修改文件夹名称
        folderName = this.folderName;
        let newlyStr = {
          pFolderId: this.breadcrumb[this.breadcrumb.length-1].id,
          folderName: folderName,
          resourceName: folderName,
        }
        getCreateData(newlyStr).then((res)=>{
          if(res.data.code == 200) {
            this.$message.success('创建成功');
            this.folderName = "新建文件夹"
            this.getHomeListFn(this.breadcrumb[this.breadcrumb.length-1].id)
          } else {
            this.$message.error(res.data.message);
          }
        })
      } else {
        this.$message.error("请填写文件夹名称");
      }
    },
      transverseFn (row){ // 双击
        if(row.type == 1) {
          this.breadcrumb.push({
            id:row.id,
            name:row.name
          })
          this.getHomeListFn(row.id)
          let obj = {};
          this.breadcrumb = this.breadcrumb.reduce((cur,next) => {
              obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
              return cur;
          },[])
        } else {
          getPreview({fileId:row.id}).then((res)=>{
               var blob = new Blob([res.data], {
                type: 'application/pdf;chartset=UTF-8'
              })
              let fileURL= URL.createObjectURL(blob)
              window.open(fileURL)
          })
        }
    },
      getHomeListFn(rowId) { // 资源下列表
        var listId = { folderId:rowId }
        getHomeList(listId).then((res) => {
          if(res.data.code == 200) {
             this.filist = res.data.data;
            $(".taskfiles-cont ul").find('li').map((ind,item)=>{
              $(item).removeClass('actionClass')
            })
          } else {
            this.$message.error(res.data.message);
          }
        }).catch((err) => {
          this.$message.error(err.data.message);
        });
    },
      getHomeCountFileFn() {
        getHomeCountFile().then((res) => {
          if(res.data.code == 200) {
            this.CountFile = res.data.data
          } else {
            this.$message.error(res.data.message);
          }
        }).catch((err) => {
          this.$message.error(err.data.message);
        });
      },
      filistClick(columns,event,enebtnd) {
        this.filistItem = columns
        let eventLi
         if(event.target.tagName == "LI") {
          eventLi = $(event.srcElement)
        } else {
          eventLi = $(event.srcElement).parent()
        }
       if(this.isshift) { // 按下shift
           if(eventLi.hasClass("actionClass")) {
            eventLi.nextAll().removeClass("actionClass");
              this.shiftArr.map((item,ind)=> {
                if( item.dataId == columns.id ) {
                  this.shiftArr.splice(ind, 1);
                }
              })
              let newobj = {};
              this.shiftArr =this.shiftArr.reduce(function(item,next){
                newobj[next.dataId] ? ' ' : newobj[next.dataId]  = true && item.push(next)
                return item;
              },[])
          } else {
            let enebtInd = 0;
            $(".taskfiles-cont ul li").map((ind,item)=>{
              if($(item).hasClass("actionClass")) {
                enebtInd = ind
              }
            })
            if(enebtnd > enebtInd) {
              for(var i = enebtInd; i<=enebtnd; i++) {
                $(".taskfiles-cont ul li").eq(i).addClass("actionClass");
                  this.shiftArr.push({
                    dataId:$(".taskfiles-cont ul li").eq(i).attr("data-id") * 1,
                    dataType:$(".taskfiles-cont ul li").eq(i).attr("data-type"),
                    dataSize:$(".taskfiles-cont ul li").eq(i).attr("data-size"),
                    name:$(".taskfiles-cont ul li").eq(i).find("p").text()
                  })
              }
            } else {
              for(var j = enebtnd; j<=enebtInd; j++) {
                $(".taskfiles-cont ul li").eq(j).addClass("actionClass");
                  this.shiftArr.push({
                    dataId:$(".taskfiles-cont ul li").eq(j).attr("data-id") * 1,
                    dataType:$(".taskfiles-cont ul li").eq(j).attr("data-type"),
                    dataSize:$(".taskfiles-cont ul li").eq(j).attr("data-size"),
                    name:$(".taskfiles-cont ul li").eq(j).find("p").text()
                  })
              }
            }
            let newobj = {};
           this.shiftArr = this.shiftArr.reduce(function(item,next){
              newobj[next.dataId] ? ' ' : newobj[next.dataId]  = true && item.push(next)
              return item;
            },[])
          }
       } else if(this.isctrl) { // 按下ctrl
            if(eventLi.hasClass("actionClass")) {
              eventLi.removeClass("actionClass");
              this.shiftArr.map((item,ind)=> {
                if( item.dataId == columns.id) {
                  this.shiftArr.splice(ind, 1);
                }
              })
          } else {
            eventLi.addClass("actionClass");
              this.shiftArr.push({
                dataId:columns.id,
                dataType:columns.type,
                dataSize:columns.size,
                name:columns.name
              })
          }
            let newobj = {};
            this.shiftArr = this.shiftArr.reduce(function(item,next){
              newobj[next.dataId] ? ' ' : newobj[next.dataId]  = true && item.push(next)
              return item;
            },[])
       }else {
          this.shiftArr = [];
          eventLi.addClass("actionClass").siblings().removeClass("actionClass");
              this.shiftArr.push({
                dataId:columns.id,
                dataType:columns.type,
                dataSize:columns.size,
                name:columns.name
              })
       }
      },
      keyevent() { 
        var that = this;
          document.onkeydown = function(e) {        //按下键盘      
          switch (e.keyCode) {        
          case 16:           
            that.isshift = true;     
              break;         
          case 17:          
            that.isctrl = true;        
            break;     
          }     
        };    
        document.onkeyup = function(e) {        //放弃键盘   
          switch (e.keyCode) {      
          case 16:           
            that.isshift = false;      
              break;        
          case 17:         
          that.isctrl = false;     
              break;       
          }     
        };
    },
      operationFn(inds) {
        if(inds == 0) {
          let isTrues = true;
          this.filist.map((item)=>{
            if(item.name == "新建文件夹") {
              isTrues = false;
            } else {
              isTrues = true;
            }
          })
          if(isTrues) {
            this.filist.push({ id: 1, name: '新建文件夹',type:"1", children: [] })
          } else {
            this.$message.warning("请先填写当前新建文件夹的名称");
          }
        } else if(inds == 1) {
          let FileArr = [];
          let resouName = [];
          this.$confirm('确定要删除?', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            this.shiftArr.map((item)=>{
              if(item.dataType == 1) {
                  getFolderDelete({folderId :item.dataId,resourceName:item.name}).then((res)=>{
                    if(res.data.code == 200) {
                      this.$message.success('删除成功');
                      this.getHomeListFn(this.breadcrumb[this.breadcrumb.length-1].id)
                    } else {
                      this.$message.error(res.data.message);
                    }
                  })
              } else {
                FileArr.push(item.dataId)
                resouName.push(item.name)
              }
            })
            if(FileArr.length>0) {
              let folderIds = this.breadcrumb[this.breadcrumb.length-1].id
             getFileDelete({fileIds:this.unique(FileArr),resourceName:resouName.join(","),folderId:folderIds}).then((res)=>{
                if(res.data.code == 200) {
                  this.$message.success('删除成功');
                  this.getHomeListFn(folderIds)
                } else {
                  this.$message.error(res.data.message);
                }
              })
            }
          })
        } else if(inds == 2) {
          console.log('指定')
        } else if(inds == 3) {
          this.getHomeListFn(this.filistItem.id)
        } else if(inds == 4) {
         this.downloadFn();
        } else if(inds == 5) {
         console.log('审核')
        }
      },
     downloadFn() {
      if(this.downIstrue) {
        this.downIstrue = false;
          var that = this;
      //  eslint-disable-next-line
          let filesizeArr,fileDownloadId;
          if(this.shiftArr.length>0) {
            filesizeArr = this.shiftArr
          } else if(this.ctrlArr.length>0) {
            filesizeArr = this.ctrlArr
          } else {
            this.$message.error('请选择文件');
            return;
          }
          that.filist.filter((item) => {
            filesizeArr.map((filistitem) => {
              if(item.id == filistitem.dataId) {
                filistitem.filePath = item.path
              }
            })
          })
          filesizeArr.map((filistitem) => {
            getDownloadStart({fileId:filistitem.dataId,resourceName:filistitem.name}).then((res)=>{
              filistitem.fileDownloadId = res.data.data.fileDownloadId;
            })
          })
          let newobj = {};
          filesizeArr = filesizeArr.reduce(function(item,next){
            newobj[next.dataId] ? ' ' : newobj[next.dataId]  = true && item.push(next)
            return item;
          },[])
          filesizeArr.map((item)=>{
            if(item.dataSize > 1048000) {
                let allFileData = [];
                var bytesPerPiece = 2048000;
                let totalPieces = Math.ceil(item.dataSize / bytesPerPiece);
        //       window.eventBus.$on("startProgress",(progress)=>{
        //         let allFileData = progress.progressArr.allFileData.sort((a,b)=>{ 
        //           return a.ind-b.ind
        //         });
        //         let totalPieces = progress.progressArr.totalPieces;
        //         for(var i = progress.progressArr.total;i<totalPieces;i++) {
        //             let bytesStas=bytesPerPiece * i;
        //             let bytesEnd = progress.progressArr.bytesEnd + bytesStas
        //             if(bytesEnd >= progress.progressArr.filesize){ 
        //                 bytesEnd = progress.progressArr.filesize
        //             }
        // //  eslint-disable-next-line
        //             let j = i
        // //  eslint-disable-next-line
        //             axios({
        //                 url: '/resource/bigfile/download/do',
        //                 params: {filePath :item.filePath},
        //                 method:'get',
        //                 headers: {'Range':'bytes='+bytesStas+'-'+bytesEnd},
        //                 responseType: 'blob',
        //                 cancelToken: window.source.token
        //               }).then((res)=>{
        //               allFileData.push({
        //                 data:res.data,
        //                 ind:j
        //               })
        //               let obj = {};
        //               let allFileArr = allFileData.reduce((cur,next) => {
        //                   obj[next.ind] ? "" : obj[next.ind] = true && cur.push(next);
        //                   return cur;
        //               },[])
        //               window.eventBus.$emit("realProgress",{
        //                 totalPieces:totalPieces,
        //                 filesize:item.filesize,
        //                 fileId:item.dataId,
        //                 total:j,
        //                 bytesStas:bytesStas,
        //                 bytesEnd:bytesEnd,
        //                 allFileData:allFileArr,
        //                 name: item.name
        //               });
        //               if(allFileArr.length == totalPieces) {
        //                 window.eventBus.$emit("decreased", {
        //                     totalPieces:totalPieces,
        //                     bytesPerPiece:bytesPerPiece,
        //                     filesize:item.filesize,
        //                     allFileData:allFileArr,
        //                     fileDownloadId:item.fileDownloadId,
        //                     fileId: item.dataId,
        //                     name:item.name
        //                 });
        //                 setTimeout(function(){
        //                   that.downIstrue =true
        //                 },500)
        //               }
        //             })
        //         }
        //       });
        //  eslint-disable-next-line
              for(var i = 0;i<totalPieces;i++) {
                  let bytesStas=bytesPerPiece * i;
                  let bytesEnd = bytesPerPiece + bytesStas
                  if(bytesEnd >= item.dataSize){ 
                      bytesEnd = item.dataSize
                  }
                  let j = i
                  allFileData = [];
                  window.cancels.randomId = item.dataId
                  axios({
                      url: '/resource/bigfile/download/do',
                      params: {filePath :item.filePath},
                      method:'get',
                      headers: {'Range':'bytes='+bytesStas+'-'+bytesEnd},
                      responseType: 'blob',
                      // cancelToken: window.source.token
                    //  cancelToken: new CancelToken(function executor(c){
                    //     window.cancels.tokens = c
                    //   })
                    }).then((res)=>{
                    allFileData.push({
                      data:res.data,
                      ind:j
                    })
                      window.eventBus.$emit("realProgress",{
                        totalPieces:totalPieces,
                        filesize:item.dataSize,
                        fileId:item.dataId,
                        total:j,
                        bytesStas:bytesStas,
                        bytesEnd:bytesEnd,
                        allFileData:allFileData,
                        name:item.name
                      });
                    if(allFileData.length == totalPieces) {
                      window.eventBus.$emit("decreased", {
                          totalPieces:totalPieces,
                          bytesPerPiece:bytesPerPiece,
                          filesize:item.dataSize,
                          allFileData:allFileData,
                          fileDownloadId:item.fileDownloadId,
                          fileId: item.dataId,
                          name:item.name
                      });
                      setTimeout(()=>{
                        that.downIstrue =true
                      },500)
                    }
                  })
                }
            } else {
              getFileDownload({fileId :item.dataId,resourceName:item.name}).then((res)=>{
                const blob = res.data;
                let link = document.createElement('a')
                let url = window.URL.createObjectURL(new Blob([blob]))
                    link.style.display = 'none'
                    link.href = url
                    link.setAttribute('download', $('.transverseClass').find('p span').text())
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link); //下载完成移除元素
                    window.URL.revokeObjectURL(url); //释放掉blob对象
                    setTimeout(()=>{
                      that.downIstrue =true
                    },500)
              })
            }
          })
      }
    },
    taskRefresh() {
      const loading = this.$loading({
        lock: true,
        text: '刷新中，请稍候'
      });
      setTimeout(()=>{
        loading.close();
      },500)
      if(this.breadcrumb[this.breadcrumb.length-1].id) {
        this.getHomeListFn(this.breadcrumb[this.breadcrumb.length-1].id)
      } else {
        this.getHomeListFn(this.handleStr.folderId)
      }
    },
    suffixFun(suffix) { // 判断图标
      //  eslint-disable-next-line
        var suffixUrl = '';
        if(suffix !='' && suffix!=0 && suffix!=undefined) {
          this.suffixArr.map((item)=> {
            if(item.arr.indexOf(suffix.toLowerCase())>-1) {
              if(item.text == 'excel') {
                suffixUrl = require('../assets/Excel-icon.png')
              } else if(item.text == 'video') {
                suffixUrl = require('../assets/video-icon.png')
              } else if(item.text == 'audio') {
                suffixUrl = require('../assets/audio-icon.png')
              } else if(item.text == 'Word') {
                suffixUrl = require('../assets/doc-icon.png')
              } else if(item.text == 'ppt') {
                suffixUrl = require('../assets/ppt-icon.png')
              } else if(item.text == 'pdf') {
                suffixUrl = require('../assets/pdf.png')
              } else if(item.text == 'img') {
                suffixUrl = require('../assets/img-icon.png')
              } else if(item.text == 'photoshop') {
                suffixUrl = require('../assets/Photoshop.png')
              } else if(item.text == 'Illustrator') {
                suffixUrl = require('../assets/Illustrator.png')
              } else if(item.text == 'FinalCut') {
                suffixUrl = require('../assets/FinalCut-icon.png')
              } else if(item.text == 'Premiere') {
                suffixUrl = require('../assets/Premiere-icon.png')
              } else if(item.text == 'AfterEffects') {
                suffixUrl = require('../assets/AfterEffects-icon.png')
              } else if(item.text == '字幕文件') {
                suffixUrl = require('../assets/subtitle-icon.png')
              } else if(item.text == '压缩文件') {
                suffixUrl = require('../assets/compress-icon.png')
              } else if(item.text == '文本文件') {
                suffixUrl = require('../assets/tet-icon.png')
              } else if(item.text == 'folder') {
                suffixUrl = require('../assets/folder-icon.png')
              }
            }
          })
        } else {
          suffixUrl = require('../assets/folder-icon.png')
        }
        return suffixUrl
      },
    },
};
</script>

<style lang="scss" scope>
.action {
  background: #DFDFDF;
}
.taskfiles{
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.taskfiles-all{
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #707070;
  padding-bottom: 15px;
  ul{
    display: flex;
    align-items: center;
    li {
      display: flex;
      align-items: center;
      color: #707070;
      font-size: 12px;
      cursor: pointer;
      img {
        padding-right: 6px;
      }
    }
  }
}
.head-left{
  padding-left: 15px;
  li {
      padding-right: 20px;
    img {
      height: 20px;
    }
  }
}
.head-right{
  padding-right: 15px;
  white-space: nowrap;
  li {
      padding-left: 20px;
    img {
      height: 14px;
    }
  }
}
.taskfiles-address{
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #707070;
}
.file-conten-left{
  padding-left: 15px;
  padding-right: 10px;
  border-right: 2px solid #C5C5C5;
  cursor: pointer;
  i {
    font-size: 14px;
    color: #000;
  }
}
.file-conten-link{
  padding-left: 15px;
  
}
.taskfiles-cont {
  flex: 0.98;
  overflow-y: scroll;
  ul {
    li {
      display: flex;
      align-items: center;
      padding: 5px 15px;
      color: #373737;
      font-size: 14px;
      img {
        width: 20px;
        padding-right: 6px;
      }
    }
  }
}
.taskfiles-foot{
  border-top: 1px solid #C5C5C5;
  padding: 10px 15px;
  color: #373737;
  font-size: 16px;

}
</style>
