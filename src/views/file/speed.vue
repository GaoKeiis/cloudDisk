<template>
  <div class="speed">
    <div class="speed-left">
      <ul>
        <li v-for="(item,ind) in speedArr" :key="ind" :class="activeClass == ind ? 'speed-action':''" @click="speedLeft(item,ind)">
          <img :src="item.imgUrl">
          {{ item.name }}
        </li>
      </ul>
      <!--  style="display:none;" -->
      <div id="filePicker" style="display: none;">选择文件</div>
    </div>
    <div class="speed-right" v-show="activeClass == 0">
        <div class="speed-right-head">
          <div class="speed-right-progress" style="width:38%;">
            <p>上传总进度</p>
            <!-- <el-progress id="progress" color="#FA5C0C" :text-inside="true" :stroke-width="14" :percentage="70"></el-progress> -->
            <!-- <p>1.5 MB / S</p> -->
          </div>
        
          <div class="speed-right-time">
            <p>开始时间</p>
            <p>完成时间</p>
            <p class="speed-right-eye">剩余时间 <img src="../../assets/eye-icon.png" @click="eyeFn()"></p>
          </div>
          <div class="speed-right-btn">
            <p @click="wholeOper(0)">全部暂停</p>
            <p @click="wholeOper(1)">全部取消</p>
          </div>
        </div>
        <div class="speed-right-tree">
          <el-tree
            :expand-on-click-node="false"
            :default-expand-all="true"
            :data="data"
            :props="defaultProps"
          >
          <div class="custom-tree-node" slot-scope="{ node, data }">
              <div class="tree-file">
                <img v-if="suffixFun(data.suffix)" :src="suffixFun(data.suffix)">
                <img v-else src="../../assets/other-icon.png">
                <p>
                  {{ node.label }}
                  <span v-if="sizeFormatter(data.size)">{{ sizeFormatter(data.size) }}</span>
                </p>
              </div>
              <div class="progressta" v-if="data.suffix.indexOf('folder')>-1">
              <el-progress v-if="data.suffix.indexOf('folder')>-1" id="progress" color="#FA5C0C" :text-inside="true" :stroke-width="14" :percentage="percent"></el-progress> 
              </div>
              <div class="progressta" v-else>
                
              <el-progress v-if="data.isOver" id="progress" :class="'progress'+data.id" color="#34D0B6" :text-inside="true" :stroke-width="14" :percentage="100"></el-progress>
              <el-progress v-else id="progress" :class="'progress'+data.id" color="#FA5C0C" :text-inside="true" :stroke-width="14" :percentage="data.progress">
              </el-progress>
                <span v-if="data.isOver" :class="'down'+data.id">
                  上传完成
                </span>
                <span v-else :class="'down'+data.id">
                  等待中...
                </span>
              </div>
                <div class="times">
                  <div v-if="data.suffix.indexOf('folder')>-1"></div>
                  <div v-else class="starts" :class="'time'+data.id">
                    <div class="start">{{ data.startTime }}<span v-if="data.startTime == ''" style="visibility: hidden;">2020-11-03 11:18:55</span></div>
                    <div class="complete">{{ data.endTime }}<span v-if="data.endTime == ''" style="visibility: hidden;">2020-11-03 11:18:55</span></div>
                    <div v-if="data.isOver" class="surplus">
                      <span style="visibility: hidden;">2020-11-03 11:18:55</span>
                      <img src="../../assets/complete.svg">
                    </div>
                    <div v-else class="surplus">
                      {{ dateDiff(data.startTime,data.endTime) }}
                    </div>
                  </div>
                </div>
                <div v-if="data.isOver" class="funBtn" :class="'funBtn'+data.id">
                  <div style="visibility: hidden;">
                    <img src="../../assets/suspend-icon.png">
                  </div>
                  <div style="visibility: hidden;">
                    <img src="../../assets/start-icon.png">
                  </div>
                  <div @click="folderFn(data)">
                  <img src="../../assets/folder-icon.png">
                  </div>
                </div>
                <div v-else class="funBtn" :class="'funBtn'+data.id">
                  <div @click="stop(data)" class="stopClass">
                    <img src="../../assets/suspend-icon.png">
                  </div>
                  <div @click="resume(data)" class="resumeClass resNone">
                    <img src="../../assets/start-icon.png">
                  </div>
                  <div @click="remove(data)">
                    <img src="../../assets/close-icon.png">
                  </div>
                  <div @click="folderFn(data)">
                  <img src="../../assets/folder-icon.png">
                  </div>
                </div>
            </div>
          </el-tree>
        </div>
      <vue-upload
            ref="uploader"
            uploadButton="#filePicker"
            multiple
            @fileChange="fileChange"
            @progress="onProgress"
            @success="onSuccess"
            @uploadError="onUploadError"
      ></vue-upload>
    </div>
    <div class="speed-right" v-show="activeClass != 0">
      <div class="speed-right-head">
        <div class="speed-right-progress" style="width:38%;">
          <p>下载总进度</p>
          <!-- <el-progress id="progress" color="#FA5C0C" :text-inside="true" :stroke-width="14" :percentage="70"></el-progress> -->
          <!-- <p>1.5 MB / S</p> -->
        </div>
        <div class="speed-right-time">
          <p>开始时间</p>
          <p>完成时间</p>
          <p class="speed-right-eye">剩余时间 <img src="../../assets/eye-icon.png" @click="downloadeyeFn()"></p>
        </div>
        <div class="speed-right-btn">
          <p @click="downloadOper(0)" style="visibility: hidden;">全部暂停</p>
          <p @click="downloadOper(1)">全部取消</p>
        </div>
      </div>
      <div class="speed-right-tree">
          <el-tree
            :expand-on-click-node="false"
            :default-expand-all="true"
            :data="downdata"
            :props="defaultProps"
          >
          <div class="custom-tree-node" slot-scope="{ node, data }">
              <div class="tree-file">
                <img v-if="suffixFun(data.suffix)" :src="suffixFun(data.suffix)">
                <img v-else src="../../assets/other-icon.png">
                <p>
                  {{ node.label }}
                  <span v-if="sizeFormatter(data.size)">{{ sizeFormatter(data.size) }}</span>
                </p>
              </div>
              <div class="progressta" v-if="data.suffix.indexOf('folder')>-1">
              <el-progress v-if="data.suffix.indexOf('folder')>-1" id="progress" color="#FA5C0C" :text-inside="true" :stroke-width="14" :percentage="percent"></el-progress> 
              </div>
              <div class="progressta" v-else>
              <el-progress v-if="data.isOver" id="progress" :class="'downdress'+data.id" color="#34D0B6" :text-inside="true" :stroke-width="14" :percentage="100"></el-progress>
              <el-progress v-else id="progress" :class="'downdress'+data.id" color="#FA5C0C" :text-inside="true" :stroke-width="14" :percentage="data.progress">
              </el-progress>
                <span v-if="data.isOver" :class="'downd'+data.id">
                  下载完成
                </span>
                <span v-else :class="'downd'+data.id">
                  等待中...
                </span>
              </div>
                <div class="times">
                  <div v-if="data.suffix.indexOf('folder')>-1"></div>
                  <div v-else class="starts" :class="'time'+data.id">
                    <div class="start">{{ data.startTime }}<span v-if="data.startTime == ''" style="visibility: hidden;">2020-11-03 11:18:55</span></div>
                    <div class="complete">{{ data.endTime }}<span v-if="data.endTime == ''" style="visibility: hidden;">2020-11-03 11:18:55</span></div>
                    <div v-if="data.isOver" class="surplus">
                      <span style="visibility: hidden;">2020-11-03 11:18:55</span>
                      <img src="../../assets/complete.svg">
                    </div>
                    <div v-else class="surplus">
                      {{ dateDiff(data.createTime,data.updateTime) }}
                    </div>
                  </div>
                </div>
                <div v-if="data.isOver" class="funBtn" :class="'downBtn'+data.id">
                  <div style="visibility: hidden;">
                    <img src="../../assets/suspend-icon.png">
                  </div>
                  <div style="visibility: hidden;">
                    <img src="../../assets/start-icon.png">
                  </div>
                  <div>
                  <img src="../../assets/folder-icon.png" @click="downloadfolderFn(data)">
                  </div>
                </div>
                <div v-else class="funBtn" :class="'downBtn'+data.id">
                  <div @click="downloadstop(data)" class="downloadstopClass" style="visibility:hidden;">
                    <img src="../../assets/suspend-icon.png">
                  </div>
                  <div @click="downloadresume(data)" class="downloadresumeClass resNone" style="visibility:hidden;">
                    <img src="../../assets/start-icon.png">
                  </div>
                  <div @click="downloadremove(data)" class="closeIcon">
                    <img src="../../assets/close-icon.png">
                  </div>
                  <div>
                  <img src="../../assets/folder-icon.png" @click="downloadfolderFn(data)">
                  </div>
                </div>
            </div>
          </el-tree>
        </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
      //  eslint-disable-next-line
import {formatSize} from '@/utils'
import vueUpload from '../../components/upload';

//  eslint-disable-next-line
import axios from 'axios'
//  eslint-disable-next-line
var CancelToken = axios.CancelToken;
      //  eslint-disable-next-line
import {getMerge,getuploadList,getuploadSelect,getuploadDelete,getTreeList,getDownloadList,getDownloadDelete,getDownloadEnd } from '@/apis/api'
export default {
  data() {
    return {
      activeClass: 0,
      percent: 0,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      downdata:[],
      ProgressfileIds: '',
      Progressfile: '',
      ProgfileIdArr:[],
      ProgfileArr:[],
      Percentint:'',
      Percent:0,
      treeStr:'',
      treesArr:[],
      BlobArr:[],
      treeAllArr:[],
      objStr:'',
      progressArr:'',
      PercentaArr:[],
      speedArr:[
        {
          imgUrl: require('../../assets/upload-icon.svg'),
          name:'上传',
        },
        {
          imgUrl: require('../../assets/download-icon.svg'),
          name:'下载',
        },
      ],
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
      Objectdata:'',
      downloadObjectdata:''
    }
  },
  components: {
      vueUpload
  },
  watch: {
    '$route' (to) {
      if(to.path == "/folder/1") {
        // this.uploadList();
        this.downdfileFn()
      }
    }
  },
  computed: {
      uploader() {
          return this.$refs.uploader;
      }
  },
  mounted(){
    $('.custom-tree-node').map((ind,item)=>{
      let paddingLeft = $(item).parent().css("padding-left");
      var lefts;
      if(parseInt(paddingLeft)>0) {
        lefts = (parseInt(paddingLeft)-(parseInt(paddingLeft)/18*10)) +'px'
      } else {
        lefts = '0px'
      }
      $(item).find('#progressta').css("margin-left",'-'+paddingLeft)
      $(item).find('.funBtn').css("padding-left",lefts)
    })
    this.uploadList();
    this.downdfileFn()
    window.addEventListener("beforeunload", e => {
      this.beforeunloadHandler(e);
  });
      this.PercentaArr=[];
    window.eventBus.$on("realProgress",(progress)=>{
        this.Percent+= Math.round((progress.bytesPerPiece/progress.filesize)*100);
        this.PercentaArr.push(this.Percent)
        this.PercentaArr.sort((a,b)=>{ 
          return a.ind-b.ind
        })
        this.downdata.map((item)=>{
          if(item.name == progress.name) {
            progress.fileId = item.id
          }
        })
        $('.downd'+progress.fileId).html('下载中...');
        for(var i = 0;i<this.PercentaArr.length;i++) {
          if(this.PercentaArr[i]<100) {
              $('.downdress'+progress.fileId).find('.el-progress-bar__inner').css("width",this.PercentaArr[i] + '%');
              $('.downdress'+progress.fileId).find('.el-progress-bar__innerText').html(this.PercentaArr[i]+ '%');
          }
        }
        this.progressArr = ""
        this.progressArr = progress
    });
    window.eventBus.$on("decreased",(obj)=>{
      var allFileArr = obj.allFileData.sort((a,b)=>{ 
        return a.ind-b.ind
      })
      this.objStr = obj
      let BlobArr=[];
      allFileArr.map((item)=>{
        BlobArr.push(item.data)
      })
      this.downdata.map((item)=>{
        if(item.name == obj.name) {
          obj.fileId = item.id
        }
      })
      this.PercentIntFn(obj.name,obj.fileDownloadId,obj.fileId,BlobArr)
    });
  },
  destroyed() {
    window.removeEventListener("beforeunload", e => {
        this.beforeunloadHandler(e);
    });
  },
  methods: {
    downloadfolderFn(data) {
      getTreeList().then((res) => {
         this.getTreeFn(data,res.data.data)
         this.treesArrFn(this.treesArr,this.treeStr.nodeParentId)
            this.$router.replace({
              path: '/folder/file',
              query:{
                originId: data.folderId,
                names: this.treeStr.id
              }
            })
            this.treeAllArr.unshift({
              name:"首页",
              id:''
            })
          let obj = {};
          this.treeAllArr = this.treeAllArr.reduce((cur,next) => {
              obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
              return cur;
          },[])
            localStorage.setItem("breadArr",JSON.stringify(this.treeAllArr))
      })
    },
    folderFn(data) {
       getTreeList().then((res) => {
         this.getTreeFn(data,res.data.data)
         this.treesArrFn(this.treesArr,this.treeStr.nodeParentId)
            this.$router.replace({
              path: '/folder/file',
              query:{
                originId: data.folderId,
                names: this.treeStr.id
              }
            })
            this.treeAllArr.unshift({
              name:"首页",
              id:''
            })
          let obj = {};
          this.treeAllArr = this.treeAllArr.reduce((cur,next) => {
              obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
              return cur;
          },[])
            localStorage.setItem("breadArr",JSON.stringify(this.treeAllArr))
      })
    },
    treesArrFn(treesArr,treeStr) {
       this.treeAllArr = [];
      treesArr.map((item)=>{
        if(item.nodeParentId == treeStr) {
          treesArr.map((tree)=>{
            if(item.nodeParentId == tree.id) {
              if(tree.nodeParentId !=0){
                 this.treesArrFn(treesArr,tree.nodeParentId)
                  this.treeAllArr.push({
                    name:tree.name,
                      id:tree.id
                  })
                  this.treeAllArr.push({
                    name:item.name,
                      id:item.id
                  })
              } else {
                  if(this.treeStr.id == item.id){
                     this.treeAllArr.unshift({
                    name:item.name,
                      id:item.id
                  })
                  }
              }
            }
          })
        }
      })
    },
    getTreeFn(data,treeArr) {
        treeArr.map((item)=>{
          this.treesArr.push({
              name:item.name,
              id:item.id,
              nodeParentId:item.nodeParentId
            })
          if(item.id == data.folderId) {
              this.treeStr = item;
          } else {
            if(item.children.length>0) {
              this.getTreeFn(data,item.children)
            }
          }
        })
    },
    downloadremove(data) {
      this.$confirm('是否将该文件删除?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let deleteStr = {
            fileDownloadId: data.id
          }
          getDownloadDelete(deleteStr).then((res) => {
            if(res.data.code == 200) {
              this.$message.success(res.data.message);
              this.downdfileFn()
            } else {
              this.$message.error(res.data.message);
            }
          })
        })
    },
    downdfileFn() {
      getDownloadList().then((res)=>{
        this.downdata = res.data.data;
        this.downloadObjectdata = res.data.data;
              this.Percent = 0;
              this.PercentaArr = []
      })
    },
    PercentIntFn(names,fileDownloadId,fileId,BlobArr) {
          $(".closeIcon").css('visibility','hidden');
          $('.downBtn'+fileId).find(".downloadresumeClass").css('visibility','hidden');
          $('.downBtn'+fileId).find(".downloadstopClass").css('visibility','hidden');
            getDownloadEnd({fileDownloadId:fileDownloadId,resourceName:names}).then(()=>{
              console.log(fileId)
              this.downdfileFn()
            })
            let link = document.createElement('a')
            let url='';
            // if('msSaveOrOpenBlob' in navigator){
            //   url = window.navigator.msSaveOrOpenBlob(new Blob(BlobArr));
            // } else {
            //   if (window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1) { 
            //     url = window.webkitURL.createObjectURL(new Blob(BlobArr)); 
            //   } 
            //   else { 
            //     url = window.URL.createObjectURL(new Blob(BlobArr))
            //   }
            // }
            url = window.URL.createObjectURL(new Blob(BlobArr))
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', names)
            document.body.appendChild(link)
            link.click()
            setTimeout(()=>{
              $('.downdress'+fileId).find('.el-progress-bar__inner').css("background","rgb(52, 208, 182)");
              $('.downdress'+fileId).find('.el-progress-bar__inner').css("width",'100%');
              $('.downdress'+fileId).find('.el-progress-bar__innerText').html('100%');
              this.$message.success('下载成功');
              $('.downd'+fileId).html('下载完成');
              this.Percent = 0;
              this.PercentaArr = []
              document.body.removeChild(link); //下载完成移除元素
              window.URL.revokeObjectURL(url); //释放掉blob对象
            },300)
    },
    getPercent(num, total){
      num = parseFloat(num);
      total = parseFloat(total);
      if (isNaN(num) || isNaN(total)) {
        return "-";
      }
      return total <= 0? "0%" : Math.round((num / total)*10000) / 100;
    },
    eyeFn() {
      if($(".speed-right-eye").find("img").hasClass("eyeIme")) {
        $(".speed-right-eye").find("img").removeClass("eyeIme").attr("src",require('../../assets/eye-icon.png'))
        this.data = this.Objectdata
      } else {
        this.data = []
          this.Objectdata.filter((item) => {
            if(!item.isOver) {
                this.data.push(item)
            }
          })
        $(".speed-right-eye").find("img").addClass("eyeIme").attr("src",require('../../assets/opening-icon.png'))
      }
    },
    downloadeyeFn() {
      if($(".speed-right-eye").find("img").hasClass("eyeIme")) {
        $(".speed-right-eye").find("img").removeClass("eyeIme").attr("src",require('../../assets/eye-icon.png'))
        this.downdata = this.downloadObjectdata
      } else {
        this.downdata = []
          this.downloadObjectdata.filter((item) => {
            if(!item.isOver) {
                this.downdata.push(item)
                return 
            }
          })
        $(".speed-right-eye").find("img").addClass("eyeIme").attr("src",require('../../assets/opening-icon.png'))
      }
    },
    beforeunloadHandler(e){
      if(this.ProgfileArr.length>0) {
        this.ProgfileArr.map((item)=>{
        // 取消并中断文件上传
          this.uploader.cancelFile(item);
        // 在队列中移除文件
          this.uploader.removeFile(item, true);
        })
        this.ProgfileIdArr.map((item)=>{
          let deleteStr = {
            fileId: item
          }
          getuploadDelete(deleteStr).then((res) => {
            if(res.data.data == 200) {
              this.uploadList()
            }
          })
        })
        e = e || window.event;
        if (e) {
          e.returnValue = "您是否确认离开此页面";
        }
        return "您是否确认离开此页面";
      }
      if(this.downdata.length>0) {
        this.downdata.map((item)=>{
          if(!item.isOver) {
            let deleteStr = {
              fileDownloadId: item.id
            }
            getDownloadDelete(deleteStr).then((res) => {
              if(res.data.code == 200) {
                this.downdfileFn()
              } else {
                this.$message.error(res.data.message);
              }
            })
          }
        })
        e = e || window.event;
        if (e) {
          e.returnValue = "您是否确认离开此页面";
        }
        return "您是否确认离开此页面";
      }
    },
    downloadOper(ind) {
      // let that = this
      if(ind == 0) {
        // window.source.cancel('Operation canceled by the user.')
          $(".downloadresumeClass").removeClass("resNone")
          $(".downloadstopClass").addClass("resNone")
      } else {
        this.$confirm('是否将全部文件删除?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let downloadArr = []
          this.downloadObjectdata.filter((item) => {
            if(!item.isOver) {
                downloadArr.push(item)
            }
          })
            downloadArr.map((item)=>{
              let deleteStr = {
                fileDownloadId: item.id
              }
              getDownloadDelete(deleteStr).then((res) => {
                if(res.data.code == 200) {
                  this.$message.success(res.data.message);
                  this.downdfileFn()
                } else {
                  this.$message.error(res.data.message);
                }
              })
            })
          })
      }
    },
    downloadresume(data) {
      // window.source = CancelToken.source();
      // window.eventBus.$emit("startProgress",{
      //   progressArr:this.progressArr,
      // });
       $(".downBtn"+data.id).find(".downloadresumeClass").addClass("resNone")
      $(".downBtn"+data.id).find(".downloadstopClass").removeClass("resNone")
    },
    downloadstop(data) {
      // window.cancels.tokens()
      // window.source.cancel('Operation canceled by the user.')
       $(".downBtn"+data.id).find(".downloadresumeClass").removeClass("resNone")
        $(".downBtn"+data.id).find(".downloadstopClass").addClass("resNone")
    },
    wholeOper(ind) {
      let that = this
      if(ind == 0) {
          if($(".speed-right-btn").find('p').eq(ind).text() == "全部暂停"){
            $(".speed-right-btn").find('p').eq(ind).html("全部开始")
            $(".resumeClass").removeClass("resNone")
            $(".stopClass").addClass("resNone")
            if(this.ProgfileArr.length>0) {
              this.ProgfileArr.map((item)=>{
                this.uploader.stop(item);
              })
            }
          } else {
            if(this.ProgfileArr.length>0) {
              this.ProgfileArr.map((item)=>{
                this.uploader.upload(item);
              })
            }
            $(".resumeClass").addClass("resNone")
            $(".stopClass").removeClass("resNone")
            $(".speed-right-btn").find('p').eq(ind).html("全部暂停")
          }
          
      } else {
        this.$confirm('是否将正在上传的全部文件删除?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.ProgfileArr.map((item)=>{
            // 取消并中断文件上传
              that.uploader.cancelFile(item);
            // 在队列中移除文件
              that.uploader.removeFile(item, true);
            })
            that.ProgfileIdArr.map((item)=>{
              let deleteStr = {
                fileId: item
              }
              getuploadDelete(deleteStr).then((res) => {
                if(res.data.code == 200) {
                  that.$message.success(res.data.message);
                  that.uploadList()
                }else{
                  that.$message.error(res.data.message);
                }
              })
            })
          })
      }
    },
    dateDiff(sDate,  eDate){ // 计算时间
      if(eDate) {
        var dateBegin = new Date(sDate);
        var dateEnd = new Date(eDate);
        var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
        var leave1 = dateDiff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));//计算出小时数
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000);   //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000);     //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000);
        if(dayDiff>0) {
          hours = hours<9?'0'+hours:hours
          minutes = minutes<9?'0'+minutes:minutes
          seconds = seconds<9?'0'+seconds:seconds
          dayDiff = dayDiff<9?'0'+dayDiff:dayDiff
          return dayDiff+'天'+hours+':'+minutes+':'+seconds
        } else {
          hours = hours<9?'0'+hours:hours
          minutes = minutes<9?'0'+minutes:minutes
          seconds = seconds<9?'0'+seconds:seconds
          return hours+':'+minutes+':'+seconds
        }
      }
    },
    suffixFun(suffix) { // 判断图标
      //  eslint-disable-next-line
      var suffixUrl = '';
      this.suffixArr.map((item)=> {
        if(item.arr.indexOf(suffix.toLowerCase())>-1) {
          if(item.text == 'excel') {
            suffixUrl = require('../../assets/Excel-icon.png')
          } else if(item.text == 'video') {
            suffixUrl = require('../../assets/video-icon.png')
          } else if(item.text == 'audio') {
            suffixUrl = require('../../assets/audio-icon.png')
          } else if(item.text == 'Word') {
            suffixUrl = require('../../assets/doc-icon.png')
          } else if(item.text == 'ppt') {
            suffixUrl = require('../../assets/ppt-icon.png')
          } else if(item.text == 'pdf') {
            suffixUrl = require('../../assets/pdf.png')
          } else if(item.text == 'img') {
            suffixUrl = require('../../assets/img-icon.png')
          } else if(item.text == 'photoshop') {
            suffixUrl = require('../../assets/Photoshop.png')
          } else if(item.text == 'Illustrator') {
            suffixUrl = require('../../assets/Illustrator.png')
          } else if(item.text == 'FinalCut') {
            suffixUrl = require('../../assets/FinalCut-icon.png')
          } else if(item.text == 'Premiere') {
            suffixUrl = require('../../assets/Premiere-icon.png')
          } else if(item.text == 'AfterEffects') {
            suffixUrl = require('../../assets/AfterEffects-icon.png')
          } else if(item.text == '字幕文件') {
            suffixUrl = require('../../assets/subtitle-icon.png')
          } else if(item.text == '压缩文件') {
            suffixUrl = require('../../assets/compress-icon.png')
          } else if(item.text == '文本文件') {
            suffixUrl = require('../../assets/tet-icon.png')
          }
        }
      })
      return suffixUrl
    },
    uploadList() {
      getuploadList().then((res) => {
          if(res.data.code == 200) {
            if(res.data.data){
              this.data = res.data.data
              this.Objectdata = res.data.data
                res.data.data.map((item)=>{
                    if(!item.isOver) {
                      this.uploadSelect(item.id)
                    }
              })
            } else {
              this.data = []
              this.Objectdata = []
            }
          } else {
            this.$message.error(res.data.message);
          }
      })
    },
    uploadSelect(uplodId) {
      let selectStr={
        fileId: uplodId
      }
      getuploadSelect(selectStr).then((res) => {
        if(res.data.code == 200) {
          $('.progress'+uplodId).find('.el-progress-bar__inner').css("width",res.data.data.uploadRate + '%');
          $('.progress'+uplodId).find('.el-progress-bar__innerText').html(res.data.data.uploadRate + '%');
          if(res.data.data.uploadRate == 100) {
            $('.progress'+uplodId).find('.el-progress-bar__inner').css("background","#FF8D40");
            $('.down'+uplodId).html('上传中')
          } else {
            $('.progress'+uplodId).find('.el-progress-bar__inner').css("background","#FF8D40");
            $('.down'+uplodId).html('等待中...')
          }
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    fileChange(file,fileIds) {
      if (!file.size) return;
        this.uploadList()
        this.ProgressfileIds = fileIds
        this.Progressfile = file;
        this.ProgfileIdArr = fileIds;
        this.ProgfileArr.push(file)
        setTimeout(()=>{
          this.ProgressfileIds.map((item)=>{
            $('.progress'+item).find(".resumeClass").addClass("resNone");
            $('.progress'+item).find(".stopClass").removeClass("resNone");
          })
          
        this.data.map((item)=>{
          if(item.name ==  file.name) {
            item.file = file
          }
        })
        },200)
    },
    curentTime() {
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        var ss = now.getSeconds();          //分

        var clock = year + "-";
        if(month < 10)
            clock += "0";

        clock += month + "-";
        if(day < 10)
            clock += "0";

        clock += day + " ";
        if(hh < 10)
            clock += "0";

        clock += hh + ":";
        if (mm < 10)
            clock += '0';
        clock += mm + ":";
        if (ss < 10)
            clock += '0';
        clock += ss;
        return clock;
    },
    onProgress(file, percent) {
      this.data.map((item)=>{
          if(item.name ==  file.name) {
          $('.progress'+item.id).find('.el-progress-bar__inner').css("width",Math.floor(percent*100)+'%')
          $('.progress'+item.id).find('.el-progress-bar__innerText').text(Math.floor(percent*100)+'%')
            $('.down'+ item.id).html("上传中")
          if(Math.floor(percent*100)+'%' == '100%') {
            $('.progress'+item.id).find('.el-progress-bar__inner').css("width",'100%')
            $('.progress'+item.id).find('.el-progress-bar__inner').css('background-color','#34D0B6')
          } else if(Math.floor(percent*100)+'%' == '0%') {
            $('.down'+ item.id).html("等待中...")
          }
          }
        })
    },
    onSuccess (fileIds) {
        fileIds.map((item)=>{
          let data={
              fileId:item
          }
      const loading = this.$loading({
        lock: true,
        text: '上传中，请稍候'
      });
      getMerge(data).then((res) => {
          if(res.data.code == 200) {
            window.eventBus.$emit("uploadClick", {
                uploadId:1
            });
            loading.close();
            this.$message.success("上传成功");
            $('.down'+item).html("上传完成")
            $(".funBtn"+item).find("div").eq(0).hide()
            $(".funBtn"+item).find("div").eq(1).hide()
            $(".funBtn"+item).find("div").eq(2).hide()
            this.uploadList()
          } else {
            this.$message.error(res.data.message);
          }
        })
      })
    },
    onUploadError(file) {
      // 取消并中断文件上传
      this.uploader.cancelFile(file);
      // 在队列中移除文件
      this.uploader.removeFile(file, true);
      this.uploader.reset()
      this.$message.error('上传失败，请重新上传');
      $('.down'+file.id).html("上传失败")
    },
    resume(data) {
      if(this.Progressfile) {
        this.uploader.upload(data.file);
        $('.funBtn'+data.id).find(".resumeClass").addClass("resNone")
        $('.funBtn'+data.id).find(".stopClass").removeClass("resNone")
      } else {
        this.$message.error('上传失败，请重新上传');
      }
    },
    stop(data) {
      if(this.Progressfile) {
        console.log(data.file,this.uploader.getFile(data.file.id))
        this.uploader.stop(data.file);
        $('.funBtn'+data.id).find(".resumeClass").removeClass("resNone")
        $('.funBtn'+data.id).find(".stopClass").addClass("resNone")
      } else {
        this.$message.error('上传失败，请重新上传');
      }
    },
    remove(file) {
      this.$confirm('是否将该文件删除?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let deleteStr = {
            fileId: file.id
          }
          if(this.ProgfileArr.length>0) {
            this.ProgfileArr.map((item)=>{
              if(item.name == file.name) {
                // 取消并中断文件上传
                this.uploader.cancelFile(item);
                // 在队列中移除文件
                this.uploader.removeFile(item, true);
              }
            })
          }
          getuploadDelete(deleteStr).then((res) => {
            if(res.data.code == 200) {
              this.$message.success(res.data.message);
              this.uploadList()
            } else {
              this.$message.error(res.data.message);
            }
          })
        })
    },
    sizeFormatter (row) {
      let size
      if(row == undefined || row.size == '') {
        return size = '-'
      } else {
        size = formatSize(row.size, 2)
        if (row.type === 'folder' || size === undefined) {
          return ''
        }
      }
      return size 
    },
    speedLeft(item,ind) {
      this.activeClass = ind
    },
  }
}
</script>

<style lang="scss" scoped>
.speed{
  display: flex;
  height: 100%;
  .speed-left{
    width: 99px;
    border-right: 1px solid #373737;
    .speed-action {
      background: #FF8D40;
      color: #fff;
    }
    ul{
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #373737;
        font-size: 16px;
        margin-bottom: 10px;
        padding: 10px 0;
        cursor: pointer;
        white-space: nowrap;
        img{
           width: 20px;
           padding-right: 6px;
        }
      }
    }
  }
}
.speed-right{
  width: 100%;
  overflow: hidden;
}
.speed-right-head{
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #707070;
  justify-content: space-between;
    #progress{
      width: 24vw;
      margin-left: 10px;
    }
    p{
      color: #373737;
      font-size: 14px;
      font-weight: 400;
    }
    div{
       display: flex;
      align-items: center;
      white-space: nowrap;
    }
    .speed-right-progress{
      p{
         &:nth-child(1) {
           padding-right: 10px;
         }
         &:nth-child(3) {
           padding-left: 14px;
         }
      }
     
    }
    .speed-right-time{
      justify-content: space-between;
      width: 40%;
      white-space: nowrap;
      p{
        &:nth-child(3) {
          display: flex;
          align-items: center;
          img {
            cursor: pointer;
            height: 20px;
            margin-left: 8px;
          }
        }
      }
    }
    .speed-right-btn{
      p {
        background: #FF8D40;
        color: #fff;
        padding: 3px 6px;
        cursor: pointer;
        &:nth-child(1){
          margin-right: 8px;
        }
      }
    }
}
.speed-right-tree{
  overflow-y: scroll;
  height: 100%;
}
.tree-file{
  display: flex;
  align-items: center;
  width: 20%;
  img {
    width: 24px;
    margin-right: 10px;
  }
  p{
    color: #373737;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    span{
      font-size: 12px;
      color: #707070;
      display: block;
    }
  }
}
.times{
    width: 40%;
  padding-left: 3.5%;
  .starts{
    display: flex;
    justify-content: space-between;
  }
  .start{
    font-size: 12px;
  }
  .surplus{
    font-size: 12px;
    img {
      height: 20px;
    }
  }
  .complete{
    font-size: 12px;
  }
}
.progressta{
  width: 19%;
}
.custom-tree-node{
  display: flex;
  align-items: center;
  width: 100%;
  #progress{
    width: 100%;
  }
  .funBtn{
    display: flex;
    flex: 1;
    width: 100%;
    padding-left: 20px;
    div{
      flex: 1;
      text-align: center;
    }
    img{
      width: 20px;
    }
  }
  .progressta{
    span{
      font-size: 12px;
    }
  }
}
.resNone{
  display: none;
}
</style>
<style>
.speed-right-head #progress .el-progress-bar__outer{
      border-radius: unset;
}
.speed-right-head #progress .el-progress-bar__inner{
  border-radius: unset;
}
.progressta #progress .el-progress-bar__outer{
      border-radius: unset;
}
.progressta #progress .el-progress-bar__inner{
  border-radius: unset;
}
.el-tree-node__content{
  height: 30px;
  margin-top: 10px;
}
.speed-right-tree .el-tree{
  padding-bottom: 60px;
}
</style>

