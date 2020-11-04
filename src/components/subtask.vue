<template>
  <div class="file-tasks">
    <div class="task">
        <div class="task-left-head">
          <div class="task-left-search">
            <el-input @keyup.enter.native="openterChange()" size="small" v-model="opensearch" placeholder="新建任务，按回车键保存。" />
            <span @click="insertFn()">插入任务模板</span>
              <el-popover
                placement="bottom-end"
                title="批量创建任务"
                v-model="visible"
                trigger="click">
                <div class="search-head">
                  <p>任务名称固定部分</p>
                  <p>起始编号</p>
                  <p>任务数量</p>
                </div>
                <div class="custom-tree-node">
                    <div class="content-input">
                      <el-input size="small" v-model="taskName" />
                      <el-input size="small" v-model="startNum" />
                      <el-input size="small" v-model="numberTasks" />
                    </div>
                    <div class="search-condition">
                      <div class="level-task">
                        <el-dropdown placement="bottom-start" trigger="click" @command="handleCommand">
                          <p class="el-dropdown-link">
                            <span>{{ dropdownLink }}</span> 级任务
                          </p>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                            v-for="item in levelArr"
                            :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                      <div class="person-charge">
                        <el-popover
                          placement="bottom-start"
                          popper-class="popofolder"
                          trigger="click"
                          v-model="visiblePerson"
                          >
                        <el-input
                          placeholder="搜索成员"
                          suffix-icon="el-icon-search"
                          size="small"
                          v-model="filterText">
                        </el-input>
                        <el-tree
                          :data="jurisdData"
                          :props="jurisdProps"
                          :expand-on-click-node="false"
                          class="person-tree"
                          placement="bottom-start"
                          default-expand-all
                          :filter-node-method="jurisdfilter"
                          ref="tree">
                            <div class="jurisd-node" slot-scope="{ node, data }">
                              <div class="jurisd-custom">
                                <img v-if="data.imgUrl" :src="data.imgUrl">
                                <img v-else src="../assets/person-icon.png">
                                <p>
                                  {{ node.label }}
                                  <br />
                                  <span v-for="(items,ind) in data.roles" :key='ind'>{{items}}</span>
                                </p>
                              </div>
                            </div>
                        </el-tree>
                            <div class="person-btn">
                              <el-button size="small" @click="personBuild()">确定</el-button>
                              <el-button size="small" @click="visiblePerson = !visiblePerson">取消</el-button>
                            </div>
                          <div slot="reference" class="person">
                            <img :src="personImg">
                            <p v-if="personVal == '负责人'">{{ personVal }}</p>
                            <p v-else>{{ personVal.split(',')[0] }}<br>{{ personVal.split(',')[1] }}</p>
                          </div>
                        </el-popover>
                      </div>
                      <!-- <div class="examine">
                        <el-dropdown trigger="click" @command="examineCommand">
                          <p class="examine-link">
                          <img src="../assets/examine-icon.png">{{ examineLink }}
                          </p>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                            v-for="item in examineArr"
                            :key="item.value" :command="item.value"><i v-if="item.label == '新建审核流程'" class="el-icon-circle-plus-outline"></i>{{ item.label }}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div> -->
                      <div class="subtask">
                        <el-checkbox v-model="subtask">插入子任务</el-checkbox>
                      </div>
                    </div>
                </div>
                <div class="btn">
                  <el-button size="small" @click="detBuild()">确定</el-button>
                  <el-button size="small" @click="detvisible()">取消</el-button>
                </div>
                <span slot="reference">批量插入任务</span>
              </el-popover>
          </div>
        </div>
        <div class="task-left-condition">
            <span>全选</span>
            <span>保存为任务模板</span>
            <el-select size="small" v-model="values" placeholder="全部状态">
              <el-option
              class="task-status"
                v-for="item in cities"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <img v-if="item.imgUrl" :src="item.imgUrl">
                <span>{{ item.label }}</span>
              </el-option>
            </el-select>
            <el-select size="small" v-model="levevalue" placeholder="全部级别">
              <el-option
                class="task-level"
                v-for="item in levelArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <img :src="item.imgUrl">
                <span>{{ item.label }}</span>
              </el-option>
            </el-select>
                <el-input
                  suffix-icon="el-icon-search"
                  size="small"
                  v-model="conditionsearch"
                  placeholder="搜索"
                  class="condition"
                />
            <span @click="deleteTask">删除</span>
        </div>
      <div class="task-list subtask-list">
         <el-tree
             :expand-on-click-node="false"
            :data="taskList"
            :props="taskProps"
            node-key="id"
            class="task-tree"
            default-expand-all
            highlight-current
            :filter-node-method="taskfilter"
            ref="taskTree">
              <div class="task-node" slot-scope="{ node, data }" @mouseover="overMask('oper'+data.id)" @mouseout="outMask('oper'+data.id)">
                <div class="task-custom">
                  <p>
                    <span v-if="data.notRead"></span>
                    {{ node.label }}
                  </p>
                  <div class="task-exhibition">
                    <div class="task-operation" :class="'oper'+data.id" v-if="data.jurisdiction == 1" style="visibility: hidden;">
                      <img src="../assets/modify.png">
                      <img src="../assets/taskdelete.png">
                    </div>
                    <div class="task-operation" v-else style="visibility: hidden;">
                      <img src="../assets/modify.png">
                      <img src="../assets/taskdelete.png">
                    </div>
                    <div class="taskStatus" v-if="data.status == 2">
                      <img src="../assets/complete.svg" style="height: 20px;">
                      <span style="color:#006957;padding-right:10px;">完成</span>
                    </div>
                    <div class="taskStatus" v-else-if="data.status == 3">
                      <img src="../assets/havehand.png">
                      <span style="color:#FA5C0C;">进行中</span>
                    </div>
                    <div class="taskStatus" v-if="data.status == 1">
                      <img src="../assets/Underreview.png">
                      <span style="color:#FA3E54;">审核中</span>
                    </div>
                    <div class="taskStatus" v-if="data.status == 0">
                      <img src="../assets/hangair.png">
                      <span style="color:rgb(143 143 143);">未开始</span>
                    </div>
                    <div class="tasklevel" v-if="data.level == 0">
                     A
                    </div>
                    <div class="tasklevel" v-else-if="data.level == 1">
                     B
                    </div>
                    <div class="tasklevel" v-else-if="data.level == 2">
                     C
                    </div>
                    <div class="tasklevel" v-else-if="data.level == 3">
                     D
                    </div>
                    <div class="tasklevel" v-else-if="data.level == 4">
                     E
                    </div>
                    <div class="tasklevel" v-else-if="data.level == 5">
                     F
                    </div>
                    <div class="taskPerson">
                      <img v-if="data.imgUrl" :src="data.imgUrl">
                      <img v-else src="../assets/person-icon.png">
                      {{ data.person }}
                    </div>
                    <div class="taskTime">
                      <span v-if="data.startTime">{{ data.startTime.split(' ')[0].split('-')[1] }}年{{ data.startTime.split(' ')[0].split('-')[2] }}月  -  </span>
                      <span v-else style="visibility: hidden;">10年20月 - </span>
                      <span v-if="data.endTime">{{ data.endTime.split(' ')[0].split('-')[1] }}年{{ data.endTime.split(' ')[0].split('-')[2] }}月</span>
                      <span v-else style="visibility: hidden;">10年31月</span>
                    </div>
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

import {
  //  eslint-disable-next-line
  getTaskList,
  //  eslint-disable-next-line
  getTaskDelete,
  //  eslint-disable-next-line
  getTaskCreate,
  //  eslint-disable-next-line
  getTaskUpdate,
  getUsers,
  getCreateTaskFolder,
  //  eslint-disable-next-line
  getSelectFolderId
} from '@/apis/api'
export default {
  props:['handleStr'],
  data() {
    return {
      opensearch: '',
      participantsArr:[
        {
          imgurl: require("../assets/person-icon.png"),
          namr: '张二',
          text:'制作人'
        }
      ],
      subtask: true,
      visible: false,
      visiblePerson: false,
      personImg: require("../assets/person-icon.png"),
      conditionsearch: '',
      examineLink: '未审核',
      personVal: '负责人',
      taskName:'',
      dropdownLink: 'C',
       filterText: '',
      startNum:'',
      numberTasks: '',
      taskList:[],
      taskProps: {
        children: 'children',
        label: 'name'
      },
      jurisdProps: {
        children: 'children',
        label: 'realName'
      },
      jurisdData:[],
      cities: [
        {
        value: '',
        label: '全部状态'
      },{
        value: '0',
        label: '未开始',
        imgUrl: require("../assets/hangair.png")
      }, {
        value: '3',
        label: '进行中',
        imgUrl: require("../assets/havehand.png")
      }, {
        value: '1',
        label: '审核中',
        imgUrl: require("../assets/Underreview.png")
      }, {
        value: '2',
        label: '完成',
        imgUrl: require("../assets/complete.svg")
      }],
      levelArr: [
        {
        value: '',
        label: '全部级别'
        },{
          value: '0',
          label: 'A 级任务'
        }, {
          value: '1',
          label: 'B 级任务'
        }, {
          value: '2',
          label: 'C 级任务'
        }, {
          value: '3',
          label: 'D 级任务'
        }, {
          value: '4',
          label: 'E 级任务'
        }, {
          value: '5',
          label: 'F 级任务'
        }
      ],
      examineArr: [
        {
        value: '0',
        label: '负责人审核'
        },{
          value: '1',
          label: '美术审核流程'
        }, {
          value: '2',
          label: 'CG镜头审核流程'
        }, {
          value: '3',
          label: '新建审核流程'
        }
      ], 
      levevalue: '全部级别',
      values: '全部状态'
    }
  },
  watch: {
    levevalue(val) {
      let levelStr
      if(val) {
        levelStr = {
          level:val
        }
      }
      this.getTaskListFn(levelStr)
    },
    values(val) {
      let statusStr
      if(val) {
        statusStr = {
          status:val
        }
      }
      this.getTaskListFn(statusStr)
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    conditionsearch(val) {
      this.$refs.taskTree.filter(val);
    },
  },
  mounted(){
    $('.task-node').map((ind,item)=>{
      let paddingLeft = $(item).parent().css("padding-left");
      $(item).find('.task-exhibition').css("margin-left",'-'+paddingLeft)
    })
    
    this.$nextTick(()=> {
        // 监听窗口大小变化
        let that = this;
      if($(".abow_dialog .el-dialog").length>0) {
        $(".subtask-list").height($(".abow_dialog .el-dialog").innerHeight())
      } else {
        $(".task").height((window.innerHeight - that.$refs.taskTree.$el.offsetTop)+83)
      }
        window.onresize = function() {
          if($(".abow_dialog .el-dialog").length<0) {
            
            $(".task").height((window.innerHeight - that.$refs.taskTree.$el.offsetTop)+83)
          }
        }
    })
    this.getTaskListFn()
    this.getUsersFn()
  },
  methods: {
    getUsersFn() {
      getUsers().then((res)=>{
        if(res.data.code == 200) {
            this.jurisdData = res.data.data;
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    getTaskListFn(str) {
      getTaskList(str).then((res)=>{
        if(res.data.code == 200) {
          this.tasksArrFn(res.data.data)
          this.$nextTick(()=>{
            $('.task-node').map((ind,item)=>{
              let paddingLeft = $(item).parent().css("padding-left");
              $(item).find('.task-exhibition').css("margin-left",'-'+paddingLeft)
            })
          })
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    deleteTask() { // 删除
      if(this.$refs.taskTree.getCurrentNode()) {
        getTaskDelete({id:this.$refs.taskTree.getCurrentNode().id}).then((res)=>{
          if(res.data.code == 200) {
            this.$message.success('删除成功');
            this.taskList = []
            window.eventBus.$emit("ToupdateData",true);
            this.getTaskListFn()
          } else {
            this.$message.error(res.data.message);
          }
        })
      } else {
        this.$message.error('请选择任务');
      }
    },
    tasksArrFn(data) {
      data.map((item)=>{
        if(item.id == this.handleStr.id) {
          this.taskList = item.children
        } else {
          if(item.children.length>0) {
            this.tasksArrFn(item.children)
          }
        }
      })
    },
    overMask(operation) {
      if($('.'+operation).length>0) {
        $('.'+operation).css("visibility",'visible')
      }
    },
    outMask(operation) {
      if($('.'+operation).length>0) {
        $('.'+operation).css("visibility",'hidden')
      }
    },
    openterChange() {
      let str;
      console.log(this.handleStr)
        getCreateTaskFolder({name: this.opensearch,pFolderId:this.handleStr.folderId}).then((res)=>{
          if(res.data.code == 200) {
            str = {
              name: this.opensearch,
              pid: this.handleStr.id,
              folderId: res.data.data.folderId
            }
            this.getTaskCreateFn(str)
          } else {
            this.$message.error(res.data.message);
          }
        })
      // if(this.$refs.taskTree.getCurrentNode()) {
      //   getCreateTaskFolder({name: this.opensearch,pFolderId:this.$refs.taskTree.getCurrentNode().folderId}).then((res)=>{
      //     if(res.data.code == 200) {
      //       str = {
      //         name: this.opensearch,
      //         pid: this.$refs.taskTree.getCurrentNode().id,
      //         folderId: res.data.data.folderId
      //       }
      //       this.getTaskCreateFn(str)
      //     }
      //   })
      // } else {
      //   getSelectFolderId({businessType: 1}).then((res)=>{
      //     if(res.data.code == 200) {
      //       getCreateTaskFolder({name: this.opensearch,pFolderId: res.data.data.folderId}).then((resq)=>{
      //         if(res.data.code == 200) {
      //               str = {
      //                 name: this.opensearch,
      //                 folderId: resq.data.data.folderId,
      //               }
      //           this.getTaskCreateFn(str)
      //         }
      //       })
      //     }
      //   })
      // }
    },
    getTaskCreateFn(str) {
      getTaskCreate(str).then((res)=> {
        if(res.data.code == 200) {
          this.getTaskListFn()
          this.opensearch = ''
          this.$message.success('创建成功');
        } else {
          this.opensearch = ''
          this.$message.error(res.data.message);
        }
      })

    },
    personBuild() {
      if(this.$refs.tree.getCurrentNode()){
        this.personVal = this.$refs.tree.getCurrentNode().fileName+ ',' +this.$refs.tree.getCurrentNode().text;
        this.personImg = this.$refs.tree.getCurrentNode().imgUrl
      } else {
        this.personVal = "负责人"
        this.personImg = require("../assets/person-icon.png")
      }
      this.visiblePerson = false;
    },
    handleCommand(command) {
      this.levelArr.map((item)=>{
        if(item.value == command) {
          this.dropdownLink = item.label.split("")[0];
        }
      })
    },
    examineCommand(command) {
      this.examineArr.map((item)=>{
        if(item.value == command) {
          this.examineLink = item.label;
        }
      })
    },
    taskfilter(value, data) { // 权限搜索按钮
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    jurisdfilter(value, data) { // 权限搜索按钮
      if (!value) return true;
      return data.fileName.indexOf(value) !== -1;
    },
    detBuild() { // 移动确定按钮
      this.dropdownLink = 'C';
      this.personVal = "负责人";
      this.personImg = require("../assets/person-icon.png");
      this.subtask = true
      this.examineLink = "未审核"
      this.visible = false
      this.taskName = ''
      this.startNum = ''
      this.numberTasks = ''
    },
    detvisible() {
      this.visible = !this.visible;
      this.dropdownLink = 'C';
      this.personVal = "负责人";
      this.personImg = require("../assets/person-icon.png");
      this.subtask = true
      this.examineLink = "未审核"
      this.visible = false
      this.taskName = ''
      this.startNum = ''
      this.numberTasks = ''
    },
    insertFn() {
      console.log(1)
    }
  },
}
</script>

<style lang="scss" scoped>
.file-tasks{
  height: 100%;
}
.task {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-width: 450px;
  .task-left-head{
    ul {
      display: flex;
      align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #373737;
      li {
        color: #C5C5C5;
        border-right: 1px solid #C5C5C5;
        padding-right: 10px;
        padding-left: 10px;
        cursor: pointer;
        font-size: 16px;
        white-space: nowrap;
        &:last-child{
          border-right:0;
        }
      }
      .headActive {
        color: #FFFFFF;
      }
    }
    .task-left-search{
      padding: 4px 8px;
      display: flex;
      align-items: center;
      span{
        white-space: nowrap;
        background: #FA5C0C;
        height: 32px;
        line-height: 32px;
        padding: 0 6px;
        margin-left: 8px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
}

  .btn{
    text-align: right;
    button{
      width: 80px;
      &:nth-child(1) {
        background: #FA5C0C;
        color: #fff;
      }
    }
  }
.search-head{
  display: flex;
  p {
    flex: 1;
    &:nth-child(1){
      flex: 2;
    }
  }
}
.content-input {
  display: flex;
  padding-top: 10px;
  .el-input {
    flex: 1;
    margin-right: 10px;
    &:nth-child(1) {
      flex: 2;
    }
    &:nth-child(3) {
      margin-right: 0;
    }
  }
}
.search-condition{
  display: flex;
  align-items: center;
  padding-top: 10px;
  .level-task{
    flex: 0.3;
    .el-dropdown-link{
      color: #373737;
      font-size: 14px;
      span{
        font-size: 20px;
        font-weight: 500;
      }
    }
  }
  .person-charge {
    flex: 0.3;
    .person {
      display: flex;
      align-items: center;
      img{
        width: 30px;
      }
      p {
        font-size: 14px;
        color: #707070;
        padding-left: 6px;
        white-space: nowrap;
      }
    }
  }
  .examine {
    flex: 0.3;
    .el-dropdown{
          display: block;
    }
    .examine-link{
      font-size: 14px;
      display: flex;
      align-items: center;
      img {
        width: 30px;
        margin-right: 10px;
      }
    }
  }
}
.task-list{
  // flex: 1;
  // height: 100%;
  overflow-y: scroll;
}
/*滚动条样式*/
.task-list::-webkit-scrollbar {
    width: 4px;    
}
.task-list::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px #70707080;
    background: #70707080;
}
.task-list::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px #DFDFDF;
    border-radius: 0;
    background:transparent;
}
.jurisd-custom{
  display: flex;
  img {
    height: 30px;
    border-radius: 100%;
  }
  p{
    padding-left: 8px;
    span{
      padding-right: 5px;
    }
  }
}
.task-left-condition{
  display: flex;
  align-items: center;
  padding-left: 8px;
  padding-right: 3px;
  padding-top: 5px;
  padding-bottom: 8px;
  span {
    &:nth-child(1) {
      width: 100px;
    }
    &:last-child{
      width: 100px;
    }
    background: #FA5C0C;
    color: #fff;
    font-size: 14px;
    text-align: center;
    padding:0 10px;
    white-space: nowrap;
    height: 32px;
    line-height: 32px;
    margin-right: 5px;
    cursor: pointer;
  }
  .el-select{
    margin-right: 5px;
  }
}
  .task-status{
    padding: 0 30px;
    height: 30px;
    line-height: 30px;
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }
  .task-node{
    width: 100%;
  }
  
  .task-custom{
    display: flex;
    align-items: center;
    p {
      font-size: 16px;
      color: #373737;
      flex: 0.6;
      display: flex;
      align-items: center;
      span {
        width: 8px;
        height: 8px;
        background: #FA3E54;
        border-radius: 100%;
        display: inline-block;
        margin-right: 5px;
      }
    }
    .task-operation{
    flex: 1;
      img{
        height: 18px;
        margin-right: 8px;
      }
    }
    .taskStatus{
      display: flex;
      align-items: center;
      flex: 1;
      img {
        height: 18px;
      }
      span{
        font-size: 14px;
        padding-left: 5px;
      }
    }
    .tasklevel{
      text-align: center;
    flex: 1;
      color: #373737;
      font-size: 18px;
      font-weight: 500;
    }
    .taskPerson{
      padding-right: 10px;
      display: flex;
      align-items: center;
    flex: 1;
      img {
        height: 25px;
        margin-right: 8px;
      }
      color: #707070;
      font-size: 16px;
    }
    .taskTime {
      flex: 1;
      color: #373737;
      font-size: 14px;
      text-align: right;
      padding-right: 10px;
    }
  }
  .task-exhibition{
    display: flex;
    align-items: center;
    // justify-content: space-between;
    flex: 1;
  }
  .task-tree {
    background: #DFDFDF;
  }
.person-btn{
  text-align: right;
  button{
    width: 70px;
    &:nth-child(1) {
      background: #FA5C0C;
      color: #fff;
    }
  }
}
</style>
<style>
.el-icon-arrow-right{
  padding-left: 10px;
}
.el-icon-d-arrow-left{
  padding-right: 10px;
}
.el-select-dropdown__item{
line-height: 30px;
      padding: 0 30px;
}
.el-dropdown-menu__item{
      line-height: 30px;
      padding: 0 30px;
}
.right-sTime .el-input__inner{
    border: 0;
  }
.right-sTime .el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 120px;
}
.right-sTime .el-input__prefix,.right-eTime .el-input__prefix{
  border: 1px dashed #C5C5C5;
  border-radius: 100%;
  height: 25px;
  top: 6px;
}
.right-sTime .el-input--suffix .el-input__inner,.right-eTime .el-input--suffix .el-input__inner{
  padding-right: 0;
  padding-left: 38px;
}
.right-sTime .el-input__icon,.right-eTime .el-input__icon {
  line-height: 25px;
}
.right-eTime .el-input__inner{
    border: 0;
  }
.right-eTime .el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 120px;
}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
  background: #fff;
}

  .task-tree .el-tree-node .el-tree-node__content {
    height: 46px;
    margin-top: 0px;
    border-bottom: 1px solid #DFDFDF;
  }
.condition {
  margin-right: 5px;
  width: 66%;
}
  .condition .el-input__inner{
      border-radius: 0;
      background: #DFDFDF;
  }
.task-left-condition .el-select .el-input__inner{
  background: #FA5C0C;
    color: #fff;
  border: 0;
    border-radius: 0;
}
.task-left-condition .el-select .el-select__caret{
    color: #fff;
}
.task-left-search .el-input__inner{
  border-radius: 0;
}
.person-tree{
  overflow-y: scroll;
  max-height: 200px;
  border: 1px solid #DFDFDF;
  margin-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  padding-right: 10px;
}
</style>