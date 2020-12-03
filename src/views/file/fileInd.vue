<template>
  <div class="file-all">
      <div class="file-list">
        <div class="file-list-head">
          <ul>
            <li @click="fileoperation(0)">
                <img src="../../assets/folder-icon.svg">
                <p>新建</p>
                <p>文件夹</p>
            </li>
            <li @click="fileoperation(1)">
                <el-popover
                placement="bottom-start"
                popper-class="popofolder"
                trigger="click"
                v-model="visible"
                >
                <el-input
                  placeholder="输入关键字进行过滤"
                  v-model="filtertreeText">
                </el-input>
                <el-tree
            :expand-on-click-node="false"
                  class="filter-tree"
                  :data="filterdata"
                  :props="defaultProps"
                  default-expand-all
                  :filter-node-method="filterNode"
                  @node-click="handleNodeClick"
                  ref="filtree">
                  <div class="custom-tree-node" slot-scope="{ node }">
                    <div class="filter-custom">
                      <img src="../../assets/folder-icon.png">
                       <p v-if="node.label !='新建文件夹'">
                       {{ node.label }}
                      </p>
                      <p v-else><el-input size="mini" v-focus @blur="treefolderChange()" v-model="treefolderName" placeholder="请输入内容"></el-input></p>
                    </div>
                  </div>
                </el-tree>
                <div class="buttons">
                  <el-button :disabled="newlyBtn" size="small" @click="newlyBuild()">新建文件夹</el-button>
                  <el-button :disabled='deterBtn' type="danger" size="small" @click="deterPop()">确定</el-button>
                  <el-button size="small" @click="cancelPop()">取消</el-button>
                </div>
                <div slot="reference">
                <img src="../../assets/move-icon.svg">
                <p>移动到</p>
                <i class="el-icon-caret-bottom"></i>
                </div>
              </el-popover>
            </li>
            <li @click="fileoperation(2)">
                <el-popover
                placement="bottom-start"
                popper-class="popofolder"
                trigger="click"
                v-model="copyvisible"
                >
                <el-input
                  placeholder="输入关键字进行过滤"
                  v-model="copyfilterText">
                </el-input>
                <el-tree
                  :expand-on-click-node="false"
                  class="filter-tree"
                  :data="copyData"
                  :props="defaultProps"
                  default-expand-all
                  :filter-node-method="copyfilterNode"
                  @node-click="copyhandleNodeClick"
                  ref="copytree">
                  <div class="custom-tree-node" slot-scope="{ node,data}">
                    <div class="filter-custom">
                      <img src="../../assets/folder-icon.png">
                      <p v-if="node.label !='新建文件夹'">
                       {{ node.label }}
                      </p>
                      <p v-else><el-input size="mini" v-focus @blur="copyfolderChange(data)" v-model="copyfolderName" placeholder="请输入内容"></el-input></p>
                    </div>
                  </div>
                </el-tree>
                <div class="buttons">
                  <el-button :disabled="copynewlyBtn" size="small" @click="copynewlyBuild()">新建文件夹</el-button>
                  <el-button :disabled='copydeterBtn' type="danger" size="small" @click="copydeterPop()">确定</el-button>
                  <el-button size="small" @click="copycancelPop()">取消</el-button>
                </div>
                <div slot="reference">
                  <img src="../../assets/copy-icon.svg">
                  <p>复制到</p>
                  <i class="el-icon-caret-bottom"></i>
                </div>
              </el-popover>
            </li>
            <li @click="fileoperation(3)">
              <img src="../../assets/delete-icon.svg">
              <p>删除</p>
              <p>文件</p>
            </li>
            <li  @click="fileoperation(4)">
              <img src="../../assets/rename-icon.svg">
              <p>文件</p>
              <p>重命名</p>
            </li>
            <li @click="fileoperation(5)">
              <img src="../../assets/upload-icon.svg">
              <p>上传</p>
              <p>文件</p>
            </li>
            <li  @click="fileoperation(6)">
              <img src="../../assets/download-icon.svg">
              <p>下载</p>
              <p>文件</p>
            </li>
            <li  @click="fileoperation(7)">
              <img src="../../assets/jurisdiction-icon.svg">
              <p>文件</p>
              <p>权限</p>
            </li>
            <li @click="fileoperation(8)">
              <img src="../../assets/operation-icon.svg">
              <p>操作</p>
              <p>记录</p>
            </li>
          </ul>
          <div class="file-conten-head">
            <div class="file-conten-left">
              <i class="el-icon-arrow-left" @click="BackOff"></i>
              <i class="el-icon-arrow-right" @click="forwardFn"></i>
              <i class="el-icon-refresh-right" @click="refreshFn"></i>
            </div>
            <div class="file-conten-link">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <!-- eslint-disable-next-line -->
                <el-breadcrumb-item
                  v-for="(items,ind) in breadcrumb"
                  :key="ind"
                  :to="{ path: '/folder/file',query:{'originId': items.id,'names':items.name}}"
                >
                  {{items.name}}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <div class="file-conten-right">
              <el-input class="right-input" v-model="rightsearch" suffix-icon="el-icon-search" size="mini" placeholder="文字搜索"></el-input>
            </div>
          </div>
        </div>
        <div class="file-list-conten">
          <ul class="file-list-transverse" v-if="listTrue">
            <li
              v-for="(listItem,ind) in filist"
              :key="ind"
              @dblclick="transverseFn(listItem)"
              @click.stop.prevent="transverseClick(listItem,$event,ind)"
              :data-id="listItem.id"
              :data-type="listItem.type"
              :data-size="listItem.size"
            >
                <img v-if="suffixFun(listItem.suffix)" :src="suffixFun(listItem.suffix)">
                <img v-else src="../../assets/other-icon.png">
              <p v-if="listItem.name !='新建文件夹'">
              <span>{{ listItem.name }}</span>
                <el-input v-show="false" size="mini" v-focus @blur="renameChange(listItem,$event)" v-model="listItem.name" placeholder="请输入内容"></el-input>
              </p>
              <p v-else><el-input size="mini" v-focus @change="folderChange" v-model="folderName" placeholder="请输入内容"></el-input></p>
            </li>
          </ul>
          <div class="file-list-details" v-else>
            <el-table
              ref="multipleTable" 
              :data="filist"
              style="width: 100%"
              height="100%"
              type="index"
              :row-class-name="tableRowClassName"
              @row-click="handleCurrentChange"
              @row-dblclick="transverseFn">
              <el-table-column
                prop="name"
                label="文件名"
                sortable
                show-overflow-tooltip
                min-width="3">
                <template slot-scope="scope">
                  <div class="file-list-name" :data-id="scope.row.id" :data-type="scope.row.type" :data-size="scope.row.size">
                    <img v-if="suffixFun(scope.row.suffix)" :src="suffixFun(scope.row.suffix)">
                    <img v-else src="../../assets/other-icon.png">
                   <p v-if="scope.row.name !='新建文件夹'">
                    <router-link v-if="scope.row.type == 1" class="file-name" :to="{path:'/folder/file',query:{'originId':scope.row.id,'names':scope.row.name}}">{{ scope.row.name }}</router-link>
                     <a v-else class="file-name">{{ scope.row.name }}</a>
                      <el-input v-show="false" size="mini" v-focus @blur="renameChange(scope.row,$event)" v-model="scope.row.name" placeholder="请输入内容"></el-input>
                    </p>
                    <p v-else><el-input size="mini" v-focus @blur="folderChange" v-model="folderName" placeholder="请输入内容"></el-input></p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="updateTime"
                label="修改日期"
                sortable
                show-overflow-tooltip
                :formatter="dateFormatter"
                min-width="2">
              </el-table-column>
              <el-table-column
                prop="size"
                label="大小"
                sortable
                :formatter="sizeFormatter"
                min-width="6">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="file-list-footer">
          <div class="foot-left">
            <p>{{ CountFile.totalNum }} 个文件</p>
            <el-progress class="progress" color="#FA5C0C" :show-text="false" :stroke-width="10" :percentage="GetPercent()"></el-progress>
            <p>{{ Math.floor(CountFile.totalSize*100)/100 }} GB</p>
            <P>/ {{ CountFile.crewSize }} GB</P>
          </div>
          <div class="foot-right">
            <img
              v-for="(itemImg,ind) in urlImg"
              :key="ind"
              :src="itemImg"
              @click="imgFn(ind)"
            >
          </div>
        </div>
      </div>
      <el-drawer
          title="文件权限"
          :visible.sync="drawer"
          direction="rtl"
          size="50%"
          :modal="false"
          :modal-append-to-body="false"
          :close-on-press-escape="true"
          :before-close="handleClose">
        <div class="jurisd">
          <div class="jurisd-left">
            <el-input
              placeholder="搜索成员"
              suffix-icon="el-icon-search"
              size="small"
              v-model="jurisfilterText">
            </el-input>
            <el-tree
              :expand-on-click-node="false"
              :data="jurisdData"
              :props="jurisdProps"
              show-checkbox
              check-strictly
              node-key="userId"
              default-expand-all
              @check="checkGroupNode"
              :filter-node-method="jurisdfilter"
              ref="juristree">
                <div class="jurisd-node" slot-scope="{ node, data }">
                  <div class="jurisd-custom">
                  <div v-if="data.imgurl">
                      <img v-if="data.sex == 1" :src="data.imgurl" style="border:1px solid #00A8FF;border-radius: 100%;">
                      <img v-else-if="data.sex == 2" :src="data.imgurl" style="border:1px solid #FF0066;border-radius: 100%;">
                      <img v-else :src="data.imgurl">
                    </div>
                    <div v-else>
                      <img v-if="data.sex == 1" src="../../assets/person-icon.png" style="border:1px solid #00A8FF;border-radius: 100%;">
                      <img v-else-if="data.sex == 2" src="../../assets/person-icon.png" style="border:1px solid #FF0066;border-radius: 100%;">
                      <img v-else src="../../assets/person-icon.png">
                    </div>
                    <p>
                      {{ node.label }}
                    <br/>
                    <span v-for="(items,ind) in data.roles" :key='ind' style="padding-right:8px;">{{items}}</span>
                    </p>
                  </div>
                </div>
            </el-tree>
          </div>
          <div class="jurisd-right">
            <h4>文件夹权限设置</h4>
            <el-checkbox-group v-model="checkList">
            <ul>
              <li>
                <el-checkbox label="0" @change="changesFile()">查看文件</el-checkbox>
              </li>
              <li>
                <el-checkbox label="1" @change="changesFile()">新建文件夹</el-checkbox>
                <el-checkbox label="2" @change="changesFile()">上传文件</el-checkbox>
              </li>
              <li>
                <el-checkbox label="3" @change="changesFile()">下载文件</el-checkbox>
              </li>
              <li>
                <el-checkbox label="4" @change="changesFile()">文件重命名</el-checkbox>
              </li>
              <li>
                <el-checkbox label="7" @change="changesFile()">删除文件</el-checkbox>
              </li>
              <li>
                <el-checkbox :disabled="moveFile" label="5" @change="changesFile()">移动文件</el-checkbox>
                <el-checkbox :disabled="copyFile" label="6" @change="changesFile()">复制文件</el-checkbox>
              </li>
            </ul>
            </el-checkbox-group>
            <div class="jurisd-tips">
              <h6>注：</h6>
              <p>
                1、移动文件：需同时拥有当前文件的<span>下载权限</span>、<span>删除权限</span>和目标文件夹的<span>上传权限</span>。
              </p>
              <p>
                2、复制权限：需同时拥有当前文件的<span>下载权限</span>和目标文件夹的<span>上传权限</span>。
              </p>
            </div>
          </div>
        </div>
      </el-drawer>
  </div>
</template>

<script>
import $ from 'jquery'
//  eslint-disable-next-line
import { formatSize, formatDateTime } from '@/utils'
import { getAction } from '../../apis/file.js'
//  eslint-disable-next-line
import axios from 'axios'
//  eslint-disable-next-line
var CancelToken = axios.CancelToken;
//  eslint-disable-next-line
window.source = CancelToken.source();
window.cancels = {}
//  eslint-disable-next-line
import {
  //  eslint-disable-next-line
  getFileMove,
  //  eslint-disable-next-line
  getFolderMove,
  getTreeList,
  getHomeData,
  getHomeCountFile,
  getCreateData,
  getHomeList,
  getFileCopy,
  //  eslint-disable-next-line
  getDownloadStart,
  //  eslint-disable-next-line
  getFolderCopy,
  //  eslint-disable-next-line
   getFolderRename,
  //  eslint-disable-next-line
  getFileRename,
  //  eslint-disable-next-line
  getFileDelete,
  //  eslint-disable-next-line
   getFolderDelete,
  //  eslint-disable-next-line
  getPreview,
  //  eslint-disable-next-line
  getAlloAuths,
  //  eslint-disable-next-line
  getUsers,
  //  eslint-disable-next-line
  getFileDownload,
  //  eslint-disable-next-line
  getListAuthsOfUser
} from '@/apis/api'
export default {
  name: 'FileList',
  data() {
    return {
      checkList:[],
      downIstrue: true,
      drawer: false,
      filtertreeText:'',
      copyfilterText:'',
       filterText: '',
       jurisfilterText: '',
       copyFile:true,
       moveFile:true,
       deterBtn: true,
       newlyBtn: true,
       copydeterBtn: true,
       source:'',
       copynewlyBtn: true,
       jurisdData:[],
       jurisdProps: {
          children: 'children',
          label: 'realName'
        },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      filterdata: [],
      copyData:[],
      folderName:'新建文件夹',
      urlImgselect:[
        require("../../assets/vertical-select.png"),
        require("../../assets/list-select.png")
      ],
      listTrue: true,
      urlImg:[
        require("../../assets/vertical.png"),
        require("../../assets/list.png")
      ],
      rightsearch: '',
      isshift: false,
      isctrl: false,
      visible: false,
      copyvisible: false,
      breadcrumb: [{
        name:'首页',
        id:''
      }],
      filist:[],
      ctrlArr: [],
      moveselection: '',
      copyselection: '',
      shiftArr: [],
      homeId: '',
      CountFile: '',
      heckGroupUserId:'',
      loadingIstrue: '',
      treefolder: true,
      copyfolder: true,
      copyfolderName:'新建文件夹',
      treefolderName:'新建文件夹',
      folderArr:[],
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
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    },
    filtertreeText (val) {
      this.$refs.filtree.filter(val);
    },
    copyfilterText (val) {
      this.$refs.copytree.filter(val);
    },
    jurisfilterText (val) {
      this.$refs.juristree.filter(val);
    },
    rightsearch (val) {
      if (val) {
        let Objectfilist=JSON.parse(JSON.stringify(this.filist))
          this.filist = []
          Objectfilist.filter((item) => {
            if(item.name.includes(val)) {
                this.filist.push(item)
            }
          })
      } else {
        this.mergeFn(this.$route.query.originId)
      }
    },
    '$route' (to) {
      this.shiftArr = [];
      this.ctrlArr = [];
      $(".file-list-transverse li").removeClass("transverseClass");
      $(".el-table__row").removeClass("current-action");
      this.mergeFn(to.query.originId)
    },
    '$store.state.folderId' (item) {
      if(item == 1) {
        this.mergeFn(this.$route.query.originId)
      }
    }
  },
  created() {
    this.keyevent();
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
  mounted () {
    console.log(getAction("http://124.70.51.21:9201/test"))
    this.mergeFn(this.$route.query.originId)
    $(".foot-right").find('img').eq(1).attr('src',this.urlImgselect[1]).siblings().attr('src',this.urlImg[0]);
    this.getHomeCountFileFn()
    window.eventBus.$on("uploadClick",(obj)=>{
      if(obj.uploadId == 1){
        this.getHomeListFn(this.$route.query.originId)
      }
    });
  },
  methods: {
    treefolderChange() {
      if(this.treefolderName!='新建文件夹') {
        let newlyStr = {
          pFolderId: this.moveselection.id,
          folderName: this.treefolderName,
          resourceName: this.treefolderName,
        }
        getCreateData(newlyStr).then((res)=>{
          if(res.data.code == 200) {
            this.$message.success('创建成功');
            this.treefolderName = "新建文件夹"
            this.treefolder = true;
            this.deterBtn = false
            this.getHomeListFn(this.$route.query.originId)
            this.getTreeListFn()
          } else {
            this.$message.error(res.data.message);
          }
        })
      } else {
        this.deterBtn = true
        this.treefolder = false;
        this.$message.error('请输入文件夹名称');
      }
    },
    copyfolderChange() {
      if(this.copyfolderName!='新建文件夹') {
        let newlyStr = {
          pFolderId: this.copyselection.id,
          folderName: this.copyfolderName,
          resourceName: this.copyfolderName,
        }
        getCreateData(newlyStr).then((res)=>{
          if(res.data.code == 200) {
            this.$message.success('创建成功');
            this.copyfolderName = "新建文件夹"
            this.copyfolder = true;
            this.copydeterBtn = false
            this.getHomeListFn(this.$route.query.originId)
            this.getTreeListFn()
          } else {
            this.$message.error(res.data.message);
          }
        })
      } else {
        this.copydeterBtn = true
        this.copyfolder = false;
        this.$message.error('请输入文件夹名称');
      }
    },
    checkGroupNode (a, b) {
        if (b.checkedKeys.length > 0) {
          this.$refs.juristree.setCheckedKeys([a.userId]);
          this.heckGroupUserId = a.userId;
            let folderIds;
            if(this.shiftArr.length>0) {
              folderIds = this.shiftArr[0].dataId
            } else {
              folderIds = this.ctrlArr[0].dataId
            }
            getListAuthsOfUser({folderId:folderIds,userIdStr:a.userId}).then((res)=>{
              if(res.data.code == 200) {
                if(res.data.data) {
                  res.data.data.map(item=>{
                    this.checkList.push(''+item+'')
                  })
                  if(this.checkList.indexOf('2')>0 && this.checkList.indexOf('3')>0 &&this.checkList.indexOf('7')>0 ) {
                    this.moveFile = false
                    this.copyFile = false
                  } else if(this.checkList.indexOf('2')>0 && this.checkList.indexOf('3')>0 ) {
                    this.moveFile = true
                    this.copyFile = false
                  } else {
                    
                    this.moveFile =true
                    this.copyFile = true
                  }
                } else {
                  this.checkList = []
                  this.moveFile = true
                  this.copyFile = true
                }
              } else if(res.data.code == 777) {
                b.checkedKeys = []
                this.heckGroupUserId = ''
                this.checkList = []
                a.disabled = true
                this.moveFile = true
                this.copyFile = true
                this.$refs.juristree.setCheckedKeys([]);
                this.$message.error('无权限设置该成员权限');
              } else {
                this.$message.error(res.data.message);
              }
            })
        } else {
          this.heckGroupUserId = ''
          this.checkList = []
          this.moveFile = true
          this.copyFile = true
        }
    },
    GetPercent() {
      var num = parseFloat(this.CountFile.totalSize);
      var total = parseFloat(this.CountFile.crewSize );
      if (isNaN(num) || isNaN(total)) {
          return 0;
      }
      return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00);
    },
    BackOff() {
        if (this.$route.query.originId) {
          // this.$router.back(-1)
          let locaArr = JSON.parse(localStorage.getItem("breadArr"))
          // locaArr.pop();
          locaArr.map((item,ind)=>{
              if(item.id == this.$route.query.originId) {
                this.$router.push({path:'/folder/file',query:{"originId":locaArr[ind-1].id,"names":locaArr[ind-1].name}})
              }
          })
          // localStorage.setItem("breadArr",JSON.stringify(locaArr))
          
        } else {
          this.$router.push('/folder/file')
          this.breadcrumb = [];
          this.breadcrumb.push({
          name:'首页',
          id:''
        })
      }
    },
    forwardFn() {
          let locaArr = JSON.parse(localStorage.getItem("breadArr"))
        if (this.$route.query.originId) {
          locaArr.map((item,ind)=>{
              if(item.id == this.$route.query.originId) {
                this.$router.push({path:'/folder/file',query:{"originId":locaArr[ind+1].id,"names":locaArr[ind+1].name}})
              }
          })
        } else {
          this.$router.push({path:'/folder/file',query:{"originId":locaArr[1].id,"names":locaArr[1].name}})
        }
      // history.forward();
    },
    refreshFn() {
      const loading = this.$loading({
        lock: true,
        text: '刷新中，请稍候'
      });
      setTimeout(()=>{
        loading.close();
      },500)
      this.mergeFn(this.$route.query.originId)
    },
    suffixFun(suffix) { // 判断图标
      //  eslint-disable-next-line
      var suffixUrl = '';
      if(suffix !='' && suffix!=0 && suffix!=undefined) {
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
            } else if(item.text == 'folder') {
              suffixUrl = require('../../assets/folder-icon.png')
            }
          }
        })
      } else {
        suffixUrl = require('../../assets/folder-icon.png')
      }
      return suffixUrl
    },
    getHomeDataFn() {
      getHomeData().then((res) => {
        if(res.data.code == 200) {
          this.filist = res.data.data
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
    getTreeListFn() {
      getTreeList().then((res) => {
          if(res.data.code == 200) {
            this.copyData = res.data.data
            this.filterdata = res.data.data
          } else {
            this.$message.error(res.data.message);
          }
        }).catch((err) => {
          this.$message.error(err.data.message);
        });
    },
    getHomeListFn(rowId) { // 资源下列表
        var listId = { folderId:rowId }
        getHomeList(listId).then((res) => {
          if(res.data.code == 200) {
            res.data.data.map((item)=>{
              item.resourceName = item.name
            })
            this.filist = res.data.data;
            $(".file-list-transverse").find('li').map((ind,item)=>{
              $(item).removeClass('transverseClass')
            })
            $(".el-table__row").map((ind,item)=>{
              $(item).removeClass('current-action')
            })
          } else if(res.data.code == 777) {
            this.$message.error("无权限查看该文件，请通知管理员");
            this.breadcrumb.splice(this.breadcrumb.length-1, this.breadcrumb.length)
            this.$router.push({path:'/folder/file',query:{'originId':this.breadcrumb[this.breadcrumb.length-1].id,"names":this.breadcrumb[this.breadcrumb.length-1].name}})
            localStorage.setItem("breadArr",JSON.stringify(this.breadcrumb))
          } else {
            this.$message.error(res.data.message);
          }
        })
    },
    changesFile() { // 权限
      if(this.heckGroupUserId) {
          // 0-查看文件 ；1-新建文件夹；2-上传文件；3-下载文件；4-重命名文件；5-移动文件；6-复制文件；7-删除文件
          
          if(this.checkList.indexOf('2')>0 && this.checkList.indexOf('3')>0 &&this.checkList.indexOf('7')>0 ) {
            this.moveFile = false
            this.copyFile = false
          } else if(this.checkList.indexOf('2')>0 && this.checkList.indexOf('3')>0 ) {
            if(this.checkList.indexOf('5')>0) {
              this.checkList.splice(this.checkList.indexOf('5'),1);
            }
            this.moveFile = true
            this.copyFile = false
          } else {
            this.moveFile = true
            this.copyFile = true
            if(this.checkList.indexOf('5')>0) {
              this.checkList.splice(this.checkList.indexOf('5'),1);
            }
            if(this.checkList.indexOf('6')>0) {
              this.checkList.splice(this.checkList.indexOf('6'),1);
            }
          }
            let folderIds,resourceName;
            if(this.shiftArr.length>0) {
              folderIds = this.shiftArr[0].dataId
              resourceName = this.shiftArr[0].name
            } else {
              folderIds = this.ctrlArr[0].dataId
              resourceName = this.ctrlArr[0].name
            }
            
            setTimeout(()=>{
              getAlloAuths({
                folderAuths:this.unique(this.checkList),
                folderId:folderIds,
                userIdStr:this.heckGroupUserId,
                resourceName: resourceName
              }).then(()=>{
                this.$message.success("设置成功");
              })
            },1000)
        } else {
          this.$message.error("请选择成员");
          this.checkList = []
          this.moveFile = true
          this.copyFile = true
        }
    },
    handleClose(done) { // 权限关闭
      $(".file-list").width("100%");
      $(".file-list-transverse li").removeClass("transverseClass")
      $(".el-table__row").removeClass('current-action')
      this.ctrlArr = [];
      this.shiftArr = [];
      done();
    },
    jurisdfilter(value, data) { // 权限搜索按钮
      if (!value) return true;
      return data.realName.indexOf(value) !== -1;
    },
    handleNodeClick(data) { // 移动点击
      if(this.treefolder) {
        this.moveselection = data
        this.deterBtn = false
        this.newlyBtn = false
      } else {
        this.deterBtn = true
        this.newlyBtn = true
      }
    },
    newlyBuild() { // 移动新建按钮
      const newChild = { id: this.moveselection.id++, name: '新建文件夹',type:"folder", children: [] };
      this.moveselection.children.push(newChild);
      this.deterBtn = true
      this.newlyBtn = true
    },
    deterPop() { // 移动确认按钮
      if(this.shiftArr.length>0) {
        this.loadingFn()
        this.shiftArr.map((item)=>{
          if(item.dataType == 1) {
            let FolderStr={
              folderId: item.dataId,
              targetFolderId:this.moveselection.id
            }
            getFolderMove(FolderStr).then((res)=>{
              if(res.data.code == 200) {
                this.getHomeListFn(this.$route.query.originId)
                this.deterBtn = true
                this.newlyBtn = true
                this.visible = false;
                this.$message.success('移动成功');
                 this.loadingIstrue.close();
              } else {
                this.$message.error(res.data.message);
              }
            })
          } else {
            let FileStr={
              fileId: item.dataId,
              targetFolderId:this.moveselection.id
            }
            getFileMove(FileStr).then((res)=>{
              if(res.data.code == 200) {
                this.getHomeListFn(this.$route.query.originId)
                this.deterBtn = true
                this.newlyBtn = true
                this.visible = false;
                this.$message.success('移动成功');
                 this.loadingIstrue.close();
              } else {
                this.$message.error(res.data.message);
              }
            })
          }
        })
      } else if(this.ctrlArr.length>0) {
        this.loadingFn()
        this.ctrlArr.map((item)=>{
          if(item.dataType == 1) {
            let FolderStr={
              folderId: item.dataId,
              targetFolderId:this.moveselection.id
            }
            getFolderMove(FolderStr).then((res)=>{
              if(res.data.code == 200) {
                this.$message.success('移动成功');
                 this.loadingIstrue.close();
                this.getHomeListFn(this.$route.query.originId)
                this.deterBtn = true
                this.newlyBtn = true
                this.visible = false;
              } else {
                this.$message.error(res.data.message);
              }
            })
          } else {
            let FileStr={
              fileId: item.dataId,
              targetFolderId:this.moveselection.id
            }
            getFileMove(FileStr).then((res)=>{
              if(res.data.code == 200) {
                this.$message.success('移动成功');
                 this.loadingIstrue.close();
                this.getHomeListFn(this.$route.query.originId)
                this.deterBtn = true
                this.newlyBtn = true
                this.visible = false;
              } else {
                this.$message.error(res.data.message);
              }
            })
          }
        })
        } else {
        this.$message.error("请选中要移动的文件或文件夹");
      }
    },
    cancelPop() { // 移动取消按钮
      this.deterBtn = true
      this.newlyBtn = true
      this.visible = false;
      this.treefolder = true;
    },
    filterNode(value, data) { // 复制搜索按钮
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    copyhandleNodeClick(data) { // 复制点击
      if(this.copyfolder) {
        this.copyselection = data
        this.copydeterBtn = false
        this.copynewlyBtn = false
      } else {
        this.copydeterBtn = true
        this.copynewlyBtn = true
      }
    },
    copynewlyBuild() { // 复制新建按钮
      const newChild = { id: this.copyselection.id++, name: '新建文件夹',type:"folder", children: [] };
      this.copyselection.children.push(newChild);
        this.copydeterBtn = true
        this.copynewlyBtn = true
    },
    copydeterPop() { // 复制确认按钮
       if(this.shiftArr.length>0) {
        this.loadingFn()
        this.shiftArr.map((item)=>{
          if(item.dataType == 1) {
            let FolderStr={
              folderId: item.dataId,
              targetFolderId:this.copyselection.id
            }
            getFolderCopy(FolderStr).then((res)=>{
              if(res.data.code == 200) {
                this.getHomeListFn(this.$route.query.originId)
                this.copydeterBtn = true
                this.copynewlyBtn = true
                this.copyvisible = false;
                this.$message.success('复制成功');
                 this.loadingIstrue.close();
              } else {
                this.$message.error(res.data.message);
              }
            })
          } else {
            let FileStr={
              fileId: item.dataId,
              targetFolderId:this.copyselection.id
            }
            getFileCopy(FileStr).then((res)=>{
              if(res.data.code == 200) {
                this.getHomeListFn(this.$route.query.originId)
                this.copydeterBtn = true
                this.copynewlyBtn = true
                this.copyvisible = false;
                this.$message.success('复制成功');
                 this.loadingIstrue.close();
              } else {
                this.$message.error(res.data.message);
              }
            })
          }
        })
      } else if(this.ctrlArr.length>0) {
        this.loadingFn()
        this.ctrlArr.map((item)=>{
          if(item.dataType == 1) {
            let FolderStr={
              folderId: item.dataId,
              targetFolderId:this.copyselection.id
            }
            getFolderMove(FolderStr).then((res)=>{
              if(res.data.code == 200) {
                this.$message.success('复制成功');
                 this.loadingIstrue.close();
                this.getHomeListFn(this.$route.query.originId)
                this.copydeterBtn = true
                this.copynewlyBtn = true
                this.copyvisible = false;
              } else {
                this.$message.error(res.data.message);
              }
            })
          } else {
            let FileStr={
              fileId: item.dataId,
              targetFolderId:this.copyselection.id
            }
            getFileMove(FileStr).then((res)=>{
              if(res.data.code == 200) {
                this.$message.success('复制成功');
                 this.loadingIstrue.close();
                this.getHomeListFn(this.$route.query.originId)
                this.copydeterBtn = true
                this.copynewlyBtn = true
                this.copyvisible = false;
              } else {
                this.$message.error(res.data.message);
              }
            })
          }
        })
        } else {
        this.$message.error("请选中要移动的文件或文件夹");
      }
    },
    copycancelPop() { // 复制取消按钮
      this.copydeterBtn = true
      this.copynewlyBtn = true
      this.copyvisible = false;
      this.copyfolder = true
    },
    copyfilterNode(value, data) { // 移动搜索按钮
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    renameChange(renameItem,event) { // 修改文件名称
    if(renameItem.type == 1) {
      let renameStr = {
        folderTargetName: renameItem.name,
        folderId: renameItem.id,
        resourceName: renameItem.resourceName
      }
       getFolderRename(renameStr).then((res)=>{
         if(res.data.code == 200) {
            $(event.target).parent('div').prev().show();
            $(event.target).parent('div').hide();
            $('.current-action').find(".file-list-name p div").hide()
            $('.current-action').find('.file-list-name p a').show()
            $(event.target).parents('li').removeClass('transverseClass');
            if($(".transverseClass").length<=0 && $(".current-action").length<=0){
              this.getHomeListFn(this.$route.query.originId)
              this.$message.success(res.data.message);
            }
         } else {
            this.$message.error(res.data.message);
         }
       });
      // this.shiftArr.length this.ctrlArr.length
    } else {
      let renameStr = {
        fileTargetName: renameItem.name,
        fileId: renameItem.id,
        resourceName: renameItem.resourceName
      }
      getFileRename(renameStr).then((res)=>{
         if(res.data.code == 200) {
            $(event.target).parent('div').prev().show();
            $(event.target).parent('div').hide();
            $(event.target).parents('li').removeClass('transverseClass');
            if($(".transverseClass").length<=0 && $(".current-action").length<=0){
              this.getHomeListFn(this.$route.query.originId)
              this.$message.success(res.data.message);
            }
         } else {
            this.$message.error(res.data.message);
         }
       });
    }
    },
    folderChange(){
      let folderName
      if(this.folderName) { // 修改文件夹名称
      folderName = this.folderName
      } else {
        folderName = "新建文件夹"
      }
        let newlyStr = {
          pFolderId: this.$route.query.originId,
          folderName: folderName,
          resourceName: folderName,
        }
        getCreateData(newlyStr).then((res)=>{
          if(res.data.code == 200) {
            this.$message.success('创建成功');
            this.folderName = "新建文件夹"
            this.getHomeListFn(this.$route.query.originId)
          } else {
            this.$message.error(res.data.message);
          }
        })
    },
    fileoperation(fileInd){
      if(fileInd == 0) { // 新建
      if(this.$route.query.originId) {
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
      } else {
        this.$message.warning("首页禁止操作文件夹");
      }
      } else if(fileInd == 1) { // 移动
        if(this.$route.query.originId) {
          if(this.shiftArr.length>0 || this.ctrlArr.length>0) {
            this.visible = true
            this.getTreeListFn();
          } else {
            this.visible = false;
            this.$message.error('请选择文件或文件夹');
          }
        } else {
          this.visible = false;
          this.$message.warning("首页禁止操作文件夹");
        }
      } else if(fileInd == 2) { // 复制
        if(this.$route.query.originId) {
          if(this.shiftArr.length>0 || this.ctrlArr.length>0) {
            this.copyvisible = true
            this.getTreeListFn();
          } else {
            this.copyvisible = false;
            this.$message.error('请选择文件或文件夹');
          }
        } else {
          this.copyvisible = false;
          this.$message.warning("首页禁止操作文件夹");
        }
      } else if(fileInd == 3) { // 删除
        if(this.$route.query.originId) {
          let resouName = [];
          if(this.shiftArr.length>0) {
              let FileArr = []
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
                        this.getHomeListFn(this.$route.query.originId)
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
                getFileDelete({fileIds:this.unique(FileArr),resourceName:resouName.join(","),folderId:this.$route.query.originId}).then((res)=>{
                  if(res.data.code == 200) {
                    this.$message.success('删除成功');
                    this.getHomeListFn(this.$route.query.originId)
                  } else {
                    this.$message.error(res.data.message);
                  }
                })
              }
            })
          } else if(this.ctrlArr.length>0) {
              let FileArr = [];
              let resouName=[];
              this.$confirm('确定要删除?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
              this.ctrlArr.map((item)=>{
                if(item.dataType == 1) {
                  getFolderDelete({folderId :item.dataId,resourceName:item.name}).then((res)=>{
                    if(res.data.code == 200) {
                      this.$message.success('删除成功');
                      this.getHomeListFn(this.$route.query.originId)
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
                getFileDelete({fileIds:this.unique(FileArr),resourceName:resouName.join(","),folderId:this.$route.query.originId}).then((res)=>{
                  if(res.data.code == 200) {
                    this.$message.success('删除成功');
                    this.getHomeListFn(this.$route.query.originId)
                  } else {
                    this.$message.error(res.data.message);
                  }
                })
              }
            })
          } else {
            this.$message.error('请选择文件或文件夹');
          }
        } else {
          this.$message.warning("首页禁止操作文件夹");
        }
      } else if(fileInd == 4) { // 重命名
        if(this.$route.query.originId) {
          if(this.shiftArr.length>0) {
            $('.transverseClass').find("p div").show()
              $('.transverseClass').find("p span").hide()
          } else if(this.ctrlArr.length>0) {
              $('.current-action').find(".file-list-name p div").show()
              $('.current-action').find('.file-list-name p a').hide()
          } else {
            this.$message.error('请选择文件或文件夹');
          }
        }else {
          this.$message.warning("首页禁止操作文件夹");
        }
      } else if(fileInd == 5) { // 上传
        if(this.$route.query.originId) {
          if(this.shiftArr.length>0 && this.shiftArr.length<2) {
            if(this.shiftArr[0].dataType == 1) {
              $('.webuploader-element-invisible').eq(0).trigger('click');
            } else {
              this.$message.error('请选择文件夹');
              $(".file-list-transverse li").removeClass("transverseClass")
              this.shiftArr = []
            }
          } else if(this.ctrlArr.length>0 && this.ctrlArr.length<2) {
            if(this.ctrlArr[0].dataType == 1) {
              $('.webuploader-element-invisible').eq(0).trigger('click');
            } else {
              this.$message.error('请选择文件夹');
              $(".el-table__row").removeClass('current-action')
              this.ctrlArr = []
            }
          } else {
              $('.webuploader-element-invisible').eq(0).trigger('click');
          }
        }else {
          this.$message.warning("首页禁止操作文件夹");
        }
      } else if(fileInd == 6) { // 下载
        if(this.$route.query.originId) {
          this.downloadFn();
        } else {
          this.$message.warning("首页禁止操作文件夹");
        }
      } else if(fileInd == 7) { // 权限
        this.drawer = true;
        $(".file-list").width("62%");
        this.jurisdictionFn();
      } else if(fileInd == 8) { // 操作
        this.$router.push({
          path: '/folder/file/record'
        })
      }
    },
    jurisdictionFn() {
      if(this.drawer) {
          if(this.$refs.juristree) {
            this.$refs.juristree.setCheckedKeys([])
            this.checkList = []
          }
        if(this.shiftArr.length>0 && this.shiftArr.length<2) {
          if(this.shiftArr[0].dataType == 1) {
            getUsers().then((res)=>{
              if(res.data.code == 200) {
                this.jurisdData = res.data.data
                this.jurisdData.map((item)=>{
                  item.disabled = false
                })
              } else {
                this.$message.error(res.data.message);
              }
            })
          } else {
            $(".file-list").width("100%");
            this.drawer = false;
            this.$message.error('请选择文件夹');
            $(".file-list-transverse li").removeClass("transverseClass")
            this.shiftArr = []
          }
        } else if(this.ctrlArr.length>0 && this.ctrlArr.length<2) {
          if(this.ctrlArr[0].dataType == 1) {
            getUsers().then((res)=>{
              if(res.data.code == 200) {
                this.jurisdData = res.data.data
                this.jurisdData.map((item)=>{
                  item.disabled = false
                })
              } else {
                this.$message.error(res.data.message);
              }
            })
          } else {
              $(".el-table__row").removeClass('current-action')
              $(".file-list").width("100%");
              this.ctrlArr = []
              this.drawer = false;
              this.$message.error('请选择文件夹');
          }
        } else {
          if(this.shiftArr.length>1 || this.ctrlArr.length>1) {
            $(".file-list-transverse li").removeClass("transverseClass")
            $(".el-table__row").removeClass('current-action')
            this.shiftArr = []
            this.ctrlArr = []
          }
            $(".file-list").width("100%");
            this.drawer = false;
            this.$message.error('请选择单个文件夹');
        }
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
            if(item.type !== 1) {
              filesizeArr.map((filistitem) => {
                if(item.id == filistitem.dataId) {
                  filistitem.filePath = item.path
                }
              })
            } else {
              this.$message.warning('所选文件包括文件夹，只下载文件');
            }
          })
          filesizeArr.map((filistitem) => {
            if(filistitem.dataType !== 1) {
              getDownloadStart({fileId:filistitem.dataId,resourceName:filistitem.name}).then((res)=>{
                filistitem.fileDownloadId = res.data.data.fileDownloadId;
                that.$message.success('请前往进度页面，查看下载进度')
              })
            }
          })
          let newobj = {};
          filesizeArr = filesizeArr.reduce(function(item,next){
            newobj[next.dataId] ? ' ' : newobj[next.dataId]  = true && item.push(next)
            return item;
          },[])
          filesizeArr.map((item)=>{
            if(item.dataType !== 1) {
              if(item.dataSize > 2048000) {
                  let allFileData = [];
                  var bytesPerPiece = 2048000;
                  let totalPieces = Math.ceil(item.dataSize / bytesPerPiece);
          //      window.eventBus.$on("startProgress",(progress)=>{
          //         let allFileData = progress.progressArr.allFileData.sort((a,b)=>{ 
          //           return a.ind-b.ind
          //         });
          //         let totalPieces = progress.progressArr.totalPieces;
          //         for(var i = progress.progressArr.total;i<totalPieces;i++) {
          //             let bytesStas=bytesPerPiece * i;
          //             let bytesEnd = progress.progressArr.bytesEnd + bytesStas
          //             if(bytesEnd >= progress.progressAr/r.filesize
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
                          bytesPerPiece:bytesPerPiece,
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
            }
          })
      }
    },
    transverseClick(columns,event,enebtnd) {
      let eventLi
      if(event.target.tagName == "LI") {
        eventLi = $(event.srcElement)
      } else {
        eventLi = $(event.srcElement).parent()
        if(event.target.tagName == "SPAN") {
          eventLi = $(event.srcElement).parent().parent()
        }
      }
       if(this.isshift) { // 按下shift
          if(eventLi.hasClass("transverseClass")) {
            eventLi.nextAll().removeClass("transverseClass");
              this.shiftArr.map((item,ind)=> {
                if( item.dataId == columns.id ) {
                  this.shiftArr.splice(ind, 1);
                  let newobj = {};
                  this.shiftArr =this.shiftArr.reduce(function(item,next){
                    newobj[next.dataId] ? ' ' : newobj[next.dataId]  = true && item.push(next)
                    return item;
                  },[])
                }
              })
          } else {
            let enebtInd = 0;
            $(".file-list-transverse li").map((ind,item)=>{
              if($(item).hasClass("transverseClass")) {
                enebtInd = ind
              }
            })
            if(enebtnd > enebtInd) {
              for(var i = enebtInd; i<=enebtnd; i++) {
                $(".file-list-transverse li").eq(i).addClass("transverseClass");
                  this.shiftArr.push({
                    dataId:$(".file-list-transverse li").eq(i).attr("data-id") * 1,
                    dataType:$(".file-list-transverse li").eq(i).attr("data-type"),
                    dataSize:$(".file-list-transverse li").eq(i).attr("data-size"),
                    name:$(".file-list-transverse li").eq(i).find("p span").text()
                  })
              }
            } else {
              for(var j = enebtnd; j<=enebtInd; j++) {
                $(".file-list-transverse li").eq(j).addClass("transverseClass");
                  this.shiftArr.push({
                    dataId:$(".file-list-transverse li").eq(j).attr("data-id") * 1,
                    dataType:$(".file-list-transverse li").eq(j).attr("data-type"),
                    dataSize:$(".file-list-transverse li").eq(j).attr("data-size"),
                    name:$(".file-list-transverse li").eq(j).find("p span").text()
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
            if(eventLi.hasClass("transverseClass")) {
              eventLi.removeClass("transverseClass");
              this.shiftArr.map((item,ind)=> {
                if( item.dataId == columns.id) {
                  this.shiftArr.splice(ind, 1);
                  let newobj = {};
                  this.shiftArr =this.shiftArr.reduce(function(item,next){
                    newobj[next.dataId] ? ' ' : newobj[next.dataId]  = true && item.push(next)
                    return item;
                  },[])
                }
              })
          } else {
            eventLi.addClass("transverseClass");
              this.shiftArr.push({
                dataId:columns.id,
                dataType:columns.type,
                dataSize:columns.size,
                name:columns.name
              })
            let newobj = {};
            this.shiftArr = this.shiftArr.reduce(function(item,next){
              newobj[next.dataId] ? ' ' : newobj[next.dataId]  = true && item.push(next)
              return item;
            },[])
          }
      }else {
        if(eventLi.find('p span').css("display")!=undefined && eventLi.find('p span').css("display")!=="none") {
          this.shiftArr = [];
          eventLi.addClass("transverseClass").siblings().removeClass("transverseClass");
              this.shiftArr.push({
                dataId:columns.id,
                dataType:columns.type,
                dataSize:columns.size,
                name:columns.name
              })
        }
      }
        this.jurisdictionFn()
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
    tableRowClassName({row, rowIndex}) {
      row.row_index = rowIndex;
    },
    handleCurrentChange(row, column, event) { // 点击
      setTimeout(()=>{
        if(this.isshift) { // 按下shift
        if($(event.srcElement).parents('.el-table__row').hasClass("current-action")) {
            $(event.srcElement).parents('.el-table__row').nextAll().removeClass("current-action");
              this.ctrlArr.map((item,ind)=> {
                if( item.dataId == row.id ) {
                  this.ctrlArr.splice(ind, 1);
                  let newobj = {};
                  this.ctrlArr =this.ctrlArr.reduce(function(item,next){
                    newobj[next.dataId] ? ' ' : newobj[next.dataId]  = true && item.push(next)
                    return item;
                  },[])
                }
              })
          } else {
            let enebtInd = 0;
            let enebtnd = row.row_index;
            $(".el-table__row").map((ind,item)=>{
              if($(item).hasClass("current-action")) {
                enebtInd = ind
              }
            })
            if(enebtnd > enebtInd) {
              for(var i = enebtInd; i<=enebtnd; i++) {
                $(".el-table__row").eq(i).addClass("current-action");
                  this.ctrlArr.push({
                    dataId:$(".el-table__row").eq(i).find('.file-list-name').attr("data-id") * 1,
                    dataType:$(".el-table__row").eq(i).find('.file-list-name').attr("data-type"),
                    dataSize:$(".el-table__row").eq(i).find('.file-list-name').attr("data-size"),
                    name: $(".el-table__row").eq(i).find('.file-list-name p a').text()
                  })
              }
            } else {
              for(var j = enebtnd; j<= enebtInd; j++) {
                $(".el-table__row").eq(j).addClass("current-action");
                  this.ctrlArr.push({
                    dataId:$(".el-table__row").eq(j).find('.file-list-name').attr("data-id") * 1,
                    dataType:$(".el-table__row").eq(j).find('.file-list-name').attr("data-type"),
                    dataSize:$(".el-table__row").eq(j).find('.file-list-name').attr("data-size"),
                    name: $(".el-table__row").eq(j).find('.file-list-name p a').text()
                  })
              }
            }
            let newobj = {};
            this.ctrlArr =this.ctrlArr.reduce(function(item,next){
              newobj[next.dataId] ? ' ' : newobj[next.dataId]  = true && item.push(next)
              return item;
            },[])
          }
        } else if(this.isctrl) { // 按下ctrl
          if($(event.srcElement).parents('.el-table__row').hasClass("current-action")) {
            $(event.srcElement).parents('.el-table__row').removeClass("current-action");
            this.ctrlArr.map((item,ind)=> {
              if( item.dataId == row.id) {
                this.ctrlArr.splice(ind, 1);
                  let newobj = {};
                  this.ctrlArr =this.ctrlArr.reduce(function(item,next){
                    newobj[next.dataId] ? ' ' : newobj[next.dataId]  = true && item.push(next)
                    return item;
                  },[])
              }
            })
          } else {
            $(event.srcElement).parents('.el-table__row').addClass("current-action");
            this.ctrlArr.push({
              dataId:row.id * 1,
              dataType:row.type,
              dataSize:row.size,
              name:row.name
            })
            let newobj = {};
            this.ctrlArr =this.ctrlArr.reduce(function(item,next){
              newobj[next.dataId] ? ' ' : newobj[next.dataId]  = true && item.push(next)
              return item;
            },[])
          }
        } else {
        if($(event.srcElement).find('p a').css("display")!=undefined && $(event.srcElement).find('p a').css("display")!="none") {
          this.ctrlArr = [];
          $(event.srcElement).parents('.el-table__row').addClass("current-action").siblings().removeClass("current-action")
          this.ctrlArr.push({
              dataId:row.id * 1,
              dataType:row.type,
              dataSize:row.size,
              name:row.name
            })
          }
        }
        this.jurisdictionFn()
      },100)
    },
    dateFormatter(row) {
      if(row.updateTime) {
        return row.updateTime
      } else {
        return "--:--:--"
      }
    },
    sizeFormatter (row) {
      let size
      if(row == undefined || row.size == '') {
        return size = '-'
      } else {
       size = formatSize(row.size, 2)
        if (row.type === 'folder' || size === undefined) {
          return '-'
        }
      }
      return size
    },
    transverseFn (row){ // 双击
        if(row.type == 1) {
          this.homeId = row.id
          this.breadcrumb.push({
            id:row.id,
            name:row.name
          })
          this.$router.push({path:'/folder/file',query:{'originId': row.id,'names':row.name}})
          let obj = {};
          this.breadcrumb = this.breadcrumb.reduce((cur,next) => {
              obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
              return cur;
          },[])
          localStorage.setItem("breadArr",JSON.stringify(this.breadcrumb))
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
    imgFn(ind) {
      let imgInd = $(".foot-right").find('img').eq(ind).siblings().index();
      $(".foot-right").find('img').eq(ind).attr('src',this.urlImgselect[ind]).siblings().attr('src',this.urlImg[imgInd]);
      this.ctrlArr = [];
      this.shiftArr = [];
      this.drawer = false;
      $(".file-list").width("100%");
      $(".file-list-transverse li").removeClass("transverseClass")
      $(".el-table__row").removeClass('current-action')
      if(ind == 0) {
        this.listTrue = false;
      } else {
        this.listTrue = true;
      }
    },
    loadingFn(){
      this.loadingIstrue = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr) && res.set(arr, 1))
    },
    mergeFn(originId) {
      if(originId) {
        this.getHomeListFn(originId)
        if(localStorage.getItem("breadArr")) {
          let locaArr = JSON.parse(localStorage.getItem("breadArr"));
          this.breadcrumb = locaArr
          this.breadcrumb.map((item,ind) =>{
            if(item.name == this.$route.query.names) {
              this.breadcrumb.splice(ind+1, this.breadcrumb.length)
            }
          })
        } else {
          this.getHomeDataFn()
          this.breadcrumb = [];
          this.breadcrumb.push({
          name:'首页',
          id:''
      });
          this.$router.push('/folder/file')
        }
      } else {
        this.getHomeDataFn()
        this.breadcrumb = [];
        this.breadcrumb.push({
        name:'首页',
        id:''
      })
          this.$router.push('/folder/file')
      }
  }
  },
}
</script>

<style lang="scss" scoped>
.file-all{
  height: 98%;
  display: flex;
}
.file-list{
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.file-list-details{
  height: 100%;
}
.file-list-name{
  display: flex;
  align-items: center;
  img {
    height: 35px;
    
  }
  a{
    padding-left: 8px;
  }
}
.file-list-head{
  ul{
    display: flex;
    align-items: center;
    background: #F5F6F7;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    li {
      text-align: center;
      margin-right: 50px;
      color: #373737;
      cursor: pointer;
       &:nth-child(1) {
         margin-top: -10px;
       }
      &:nth-child(3) {
        border-right: 1px solid #C5C5C5;
        margin-right: 30px;
        padding-right: 30px;
      }
      &:nth-child(5) {
        border-right: 1px solid #C5C5C5;
        margin-right: 30px;
        padding-right: 30px;
      }
      &:nth-child(7) {
        border-right: 1px solid #C5C5C5;
        margin-right: 30px;
        padding-right: 30px;
      }
      &:nth-child(8) {
        border-right: 1px solid #C5C5C5;
        margin-right: 30px;
        padding-right: 30px;
      }
      &:nth-child(9) {
        border-right: 1px solid #C5C5C5;
        margin-right: 30px;
        padding-right: 30px;
      }
      img{
        width: 35px;
      }
      p{
        color: #373737;
        font-size: 14px;
        white-space: nowrap;
      }
      i{
        font-size: 18px;
      }
    }
  }
}
.file-list-conten{
  flex: 1;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
}
/*滚动条样式*/
.file-list-conten::-webkit-scrollbar {
    width: 4px;    
}
.file-list-conten::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px #70707080;
    background: #70707080;
}
.file-list-conten::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px #DFDFDF;
    border-radius: 0;
    background:transparent;
}
.file-name{
  display: inline-block;
  text-decoration: none;
  color: #000;
  cursor: pointer;
}
.file-conten-head{
  display: flex;
  align-items: center;
  border-top: 1px solid #C5C5C5;
  border-bottom: 1px solid #C5C5C5;
  padding: 10px 14px;
  .file-conten-left{
    i{
      font-size: 16px;
      color: #000000;
      font-weight: bolder;
      padding-right: 16px;
      cursor: pointer;
    }
  }
  .file-conten-link{
    flex: 4;
  }
  .file-conten-right{
    flex: 0.6;
    text-align: right;
    padding-left: 10px;
    border-left: 1px solid #C5C5C5;
  }
}
.file-list-footer{
  border-top: 1px solid #00000029;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px 0;
  .foot-left{
    display: flex;
    align-items: center;
    p{
      color: #373737;
      font-size: 12px;
      font-weight: 500;
      &:nth-child(1) {
        border-right: 1px solid #C5C5C5;
        padding-right: 10px;
      }
      &:nth-child(3) {
        padding-left: 10px;
        padding-right: 3px;
      }
    }
    .progress{
      width: 6vw;
      margin-left: 10px;
    }
  }
}
.foot-right{
  display: flex;
  align-items: center;
  img{
    width: 20px;
    cursor: pointer;
    &:nth-child(1){
      width: 25px;
      padding-right: 10px;
    }
  }
}
.file-list-transverse{
  display: flex;
  flex-wrap: wrap;
  padding: 30px 20px 20px;
  text-align: center;
  li{
    width: 5%;
    padding: 10px 0;
    min-width: 150px;
    margin-bottom: 20px;
    cursor: pointer;
    margin-right: 18px;
    img {
      height: 54px;
    }
    p{
      color: #373737;
      font-size: 16px;
      padding-top: 10px;
      padding-left: 10px;
      padding-right: 10px;
      word-break: break-all;
    }
  }
}
.transverseClass{
  background: #D3F6F1;
  box-shadow: 0px 0px 6px #9CE4D8;
  border-radius: 4px;
}
.filter-custom{
  display: flex;
  align-items: center;
  img {
    width: 20px;
    margin-right: 6px;
  }
}

.popofolder{
  display: flex;
  flex-direction: column;
  align-items: center;
  
}
.filter-tree{
  flex: 1;
  overflow-y: scroll;
  max-height: 300px;
  padding-bottom: 8px;
  padding-top: 6px;
  border: 1px solid #D3D3D3;
  margin-top: 8px;
  margin-bottom: 8px;
}
.buttons{
  display: flex;
  justify-content: space-between;
  button{
    &:nth-child(1) {
      margin-right: 70px;
    }
  }
}
.jurisd{
  display: flex;
  background: #DFDFDF;
  height: 100%;
  .jurisd-left{
    padding-top: 10px;
    width: 18vw;
    height: 100%;
    padding-left: 10px;
    padding-right: 10px;
    .jurisd-custom{
      display: flex;
      align-items: center;
      img {
        width: 22px;
        border-radius: 100%;
      }
      p{
        padding-left: 8px;
      }
    }
  }
  .jurisd-right {
    background: #fff;
    width: 100%;
    box-shadow: 0px 0px 6px #00000029;
    padding: 12px 20px 0;
    h4{
      color: #373737;
      font-size: 15px;
      padding-bottom: 20px;
      font-weight: bolder;
    }
    ul {
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #FA5C0C;
        border-bottom: 0;
        padding: 10px 14px;
        color: #373737;
        font-size: 14px;
        &:nth-child(6) {
          border-bottom: 1px solid #FA5C0C;
        }
      }
    }
    .jurisd-tips{
      padding-top: 14px;
      h6 {
        color: #373737;
        font-size: 14px;
      }
      p{
        color: #373737;
        font-size: 14px;
        line-height: 20px;
        span{
          color: #FA5C0C;
        }
      }
    }
  }
}
</style>
<style  lang="scss">
.file-all .el-drawer__wrapper{
  width: 100%;
  position: unset !important;
}
.file-all .el-drawer.rtl {
  width: 100% !important;
}
:focus{
    outline:0;
}
.jurisd-right ul li .el-checkbox__input.is-checked .el-checkbox__inner{
      background-color: #FA5C0C;
    border-color: #FA5C0C;
}
.jurisd-right .el-checkbox__input.is-checked+.el-checkbox__label {
  color: #373737;
}
.jurisd .el-tree{
    background: #DFDFDF;
}
.el-drawer__header{
  margin-bottom: 0;
  padding: 10px 20px;
  border-bottom: 1px solid #707070;
  box-shadow: 0px 0px 6px #00000029;
  min-height: 20px;
  span {
    color: #373737;
    font-weight: 500;
    font-size: 14px;
  }
}
.right-input .el-input__inner {
  border: 0;
  min-width: 100px;
}
    
.el-table .cell.el-tooltip{
  display: flex;
  align-items: center;
}
.el-table td, .el-table th.is-leaf{
  border: 0;
  padding: 5px 0;
}
.el-table .current-action{
  background: #D3F6F1;
  border-radius: 4px;
}

/*滚动条样式*/
.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
    width: 4px;    
}
.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
}
.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
}
</style>