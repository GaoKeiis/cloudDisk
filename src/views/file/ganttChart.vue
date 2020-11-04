<template>
  <div class="file-task">
    <div class="task-left">
      <div>
        <div class="task-left-head">
          <ul>
            <li
              v-for="(item, ind) in headArr"
              :key="ind"
              :class="headInd == ind ? 'headActive':''"
              @click="headClick(ind)"
            >{{ item }}</li>
          </ul>
        </div>
        <div class="task-left-condition">
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
        </div>
      </div>
      <div class="task-list">
         <el-tree
            :expand-on-click-node="false"
            :data="taskList"
            :props="taskProps"
            class="tasks-tree"
            node-key="id"
              
            highlight-current
            :filter-node-method="taskfilter"
            @node-expand="expandFn"
            @node-collapse="collapseFn"
            @node-click="nodeClickFn"
            ref="taskTree">
              <div class="task-node" slot-scope="{ node, data }">
                <div class="task-custom" @dblclick="dialogClack(node.label,data)">
                  <p>
                    <span v-if="data.notRead"></span>
                    {{ node.label }}
                  </p>
                  <div class="task-exhibition">
                    <div class="taskStatus" v-if="data.status == 2">
                      <img src="../../assets/complete.svg" style="height: 20px;">
                      <span style="color:#006957;padding-right:10px;">完成</span>
                    </div>
                    <div class="taskStatus" v-else-if="data.status == 3">
                      <img src="../../assets/havehand.png">
                      <span style="color:#FA5C0C;">进行中</span>
                    </div>
                    <div class="taskStatus" v-if="data.status == 1">
                      <img src="../../assets/Underreview.png">
                      <span style="color:#FA3E54;">审核中</span>
                    </div>
                    <div class="taskStatus" v-if="data.status == 0">
                      <img src="../../assets/hangair.png">
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
                  </div>
                </div>
              </div>
          </el-tree>
    <el-dialog
      :title="dialogVal"
      :visible.sync="dialogVisible"
      class="abow_dialog"
      lock-scroll
      destroy-on-close
      width="50%">
      <div class="task-dialog">
      <div class="right-operation">
        <div class="right-states">
          <el-dropdown trigger="click" @command="statesCommand">
            <p class="examine-link">
            <img :src="statesItem.imgUrl">{{ statesItem.label }}
            </p>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
              v-for="item in citiesAll"
              class="statesCla"
              :key="item.value" :command="item.value">
               <img v-if="item.imgUrl" :src="item.imgUrl">{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
          <div class="right-task">
            <el-dropdown trigger="click" @command="taskCommand">
              <p class="el-dropdown-link">
                <span>{{ taskLink }}</span> 级任务
              </p>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                v-for="item in levelsAll"
                :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
            <div class="right-person">
              <el-popover
                placement="bottom-end"
                popper-class="popofolder"
                trigger="click"
                v-model="rightPerson"
                >
              <el-input
                placeholder="搜索成员"
                suffix-icon="el-icon-search"
                size="small"
                v-model="rightText">
              </el-input>
              <el-tree
            :expand-on-click-node="false"
               :data="rightData"
                :props="rightProps"
                class="person-tree"
                  
                :filter-node-method="rightfilter"
                show-checkbox
                check-strictly
                node-key="userId"
                @check="choiceGroupNode"
                ref="rightTree">
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
                        <br />
                        <span v-for="(items,ind) in data.roles" :key='ind'>{{items}}</span>
                      </p>
                    </div>
                  </div>
              </el-tree>
              <div class="person-btn">
                <el-button size="small" @click="rightBuind()">确定</el-button>
                <el-button size="small" @click="rightPerson = !rightPerson">取消</el-button>
              </div>
            <div slot="reference" class="person">
              <div v-if="rightpersonImg">
                <img v-if="rightpersonVal.split(';')[2] == 1" :src="rightpersonImg" style="border:1px solid #00A8FF;border-radius: 100%;">
                <img v-else-if="rightpersonVal.split(';')[2] == 2"  :src="rightpersonImg" style="border:1px solid #FF0066;border-radius: 100%;">
                <img v-else :src="rightpersonImg">
              </div>
              <div v-else>
                <img v-if="rightpersonVal.split(';')[2] == 1" src="../../assets/person-icon.png" style="border:1px solid #00A8FF;border-radius: 100%;">
                <img v-else-if="rightpersonVal.split(';')[2] == 2"  src="../../assets/person-icon.png" style="border:1px solid #FF0066;border-radius: 100%;">
                <img v-else src="../../assets/person-icon.png">
              </div>
              <p v-if="rightpersonVal == '负责人'">{{ rightpersonVal }}</p>
              <p v-else>{{ rightpersonVal.split(';')[0] }}<br/>
                <span v-for="(items,ind) in JSON.parse(rightpersonVal.split(';')[1])" :key='ind'>{{items}}</span>
              </p>
            </div>
          </el-popover>
        </div>
         <div class="right-sTime">
            <el-date-picker
              v-model="sTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="sTimeChange()"
              placeholder="开始时间">
            </el-date-picker>
        </div>
        <div class="right-eTime">
            <el-date-picker
              v-model="eTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :disabled='eTimeTrue'
              @change="eTimeChange()"
              :picker-options="pickerOptions"
              placeholder="截止时间">
            </el-date-picker>
        </div>
        <!-- <div class="right-technological">
          <el-dropdown trigger="click" @command="technological">
            <p class="examine-link">
            <img src="../../assets/examine-icon.png">{{ technologicalLink }}
            </p>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
              v-for="item in examineArr"
              :key="item.value" :command="item.value"><i v-if="item.label == '新建审核流程'" class="el-icon-circle-plus-outline"></i>{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div> -->
      </div>
      <div class="right-participants">
       <div class="participants-choice">
          <el-popover
            placement="bottom-start"
            popper-class="choicefolder"
            trigger="click"
            v-model="choicePerson"
            >
          <el-input
            placeholder="搜索成员"
            suffix-icon="el-icon-search"
            size="small"
            v-model="choiceText">
          </el-input>
             <el-tree
           :expand-on-click-node="false"
            :data="jurisdData"
            :props="jurisdProps"
            show-checkbox
            class="choice-tree"
              
            check-on-click-node
                node-key="userId"
            :filter-node-method="choicefilter"
            ref="choicetree">
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
                        <br />
                        <span v-for="(items,ind) in data.roles" :key='ind'>{{items}}</span>
                      </p>
                </div>
              </div>
          </el-tree>
              <div class="person-btn">
                <el-button size="small" @click="choiceBuild()">确定</el-button>
                <el-button size="small" @click="choicePerson = !choicePerson">取消</el-button>
              </div>
            <div slot="reference" class="person">
              <p>参与人</p>
              <img src="../../assets/participants-icon.png">
            </div>
          </el-popover>
       </div>
       <ul class="participants-list">
         <li v-for="(item,ind) in participantsArr" :key="ind" @mouseover="overPants(ind)" @mouseout="outPants(ind)">
           <div v-if="item.imgurl">
             <img v-if="item.sex == 1" :src="item.imgurl" style="border:1px solid #00A8FF;border-radius: 100%;">
             <img v-else-if="item.sex == 2" :src="item.imgurl" style="border:1px solid #FF0066;border-radius: 100%;">
             <img v-else :src="item.imgurl">
           </div>
           <div v-else>
             <img v-if="item.sex == 1" src="../../assets/person-icon.png" style="border:1px solid #00A8FF;border-radius: 100%;">
             <img v-else-if="item.sex == 2" src="../../assets/person-icon.png" style="border:1px solid #FF0066;border-radius: 100%;">
             <img v-else src="../../assets/person-icon.png">
           </div>
           <div>
             <p>{{ item.namr }}</p>
             <p>
               <span v-for="(items,ind) in item.text" :key="ind">{{ items }}</span>
             </p>
           </div>
           <div class="deleteImg" @click="deleteImgFn(item)">
             <img src="../../assets/taskdelete.png">
           </div>
         </li>
       </ul>
      </div>
      <div class="right-details">
        <ul class="detailsTab">
          <li v-for="(item,ind) in detailsTab" :class="tabInd == ind?'tabAction':''" :key="ind" @click="detailsTabFn(ind)">
            <img :src="item.imgUrl">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <leaving v-if="tabInd == 0" :handleStr="handleStr"></leaving>
      <subtask v-if="tabInd == 1" :handleStr='handleStr'></subtask>
      <taskfiles v-if="tabInd == 2" :handleStr='handleStr'></taskfiles>
      <taskreview v-if="tabInd == 3" :handleStr='handleStr'></taskreview>
      <activity v-if="tabInd == 4"></activity>
    </div>
    </el-dialog>
      </div>
    </div>
    <div class="task-right">
      <ul class="ganttList">
        <li v-for="(item,ind) in list" :key="ind" @click="ganttClass(ind)" :class="actionInd == ind?'actions':''">{{ item }}</li>
      </ul>
      <div style="height:700px;" ref="gantt"></div>
    </div>
  </div>
</template>
 
<script>
import gantt from 'dhtmlx-gantt'
import $ from 'jquery'
import leaving from '../../components/leaving'
import activity from '../../components/activity'
import taskfiles from '../../components/taskfiles'
import taskreview from '../../components/taskreview'
import subtask from '../../components/subtask'

import {
  //  eslint-disable-next-line
  getTaskList,
  getUsers,
  getTaskUpdate,
  getTaskPartnerCreate,
  getTaskPartnerList,
  getSelectUser,
  //  eslint-disable-next-line
  getTaskGanter,
  getTaskPartnerDelete,
  getWhoAmI,
  getListIamPartner
} from '@/apis/api'
export default {
  name: "gantt",
  components:{
    leaving,activity,taskfiles,taskreview,subtask
  },
  data() {
    return {
      tasks: {
        data: []
      },
      tabInd: 0,
      handleStr:[],
      dialogVal:'',
      headArr: ['全部任务', '我创建的', '我负责的', '我参与的'],
      dialogVisible: false,
      participantsArr:[],
      pickerOptions: this.pickerStartDate(),
      subtask: true,
      visible: false,
      choicePerson: false,
      rightPerson: false,
      personImg: require("../../assets/person-icon.png"),
      rightpersonImg: require("../../assets/person-icon.png"),
      headInd: 0,
      conditionsearch: '',
      sTime: '',
      eTime: '',
      eTimeTrue:false,
      detailsTab: [
        {
          imgUrl: require('../../assets/communicate.png'),
          name: '任务沟通'
        },
        {
          imgUrl: require('../../assets/subtask.png'),
          name: '子任务'
        },
        {
          imgUrl: require('../../assets/task-file.png'),
          name: '任务文件'
        },
        {
          imgUrl: require('../../assets/task-review.png'),
          name: '任务审核'
        },
        {
          imgUrl: require('../../assets/activity.png'),
          name: '活动日志'
        }
      ],
      detailsTabselect: [
          require('../../assets/communication-select.png'),
          require('../../assets/subtask-select.png'),
          require('../../assets/task-file-select.png'),
          require('../../assets/task-review-select.png'),
          require('../../assets/activity-select.png')
      ],
      statesItem: {
        imgUrl: require("../../assets/hangair.png"),
        label: '未开始'
      },
      technologicalLink: '未审核',
      personVal: '负责人',
      rightpersonVal: '负责人',
      taskLink: 'C',
       choiceText: '',
       rightText: '',
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
      rightProps: {
        children: 'children',
        label: 'realName'
      },
      rightData:[],
      cities: [
        {
        value: '',
        label: '全部状态'
      },{
        value: '0',
        label: '未开始',
        imgUrl: require("../../assets/hangair.png")
      }, {
        value: '3',
        label: '进行中',
        imgUrl: require("../../assets/havehand.png")
      }, {
        value: '1',
        label: '审核中',
        imgUrl: require("../../assets/Underreview.png")
      }, {
        value: '2',
        label: '完成',
        imgUrl: require("../../assets/complete.svg")
      }],
      citiesAll: [
        {
        value: '0',
        label: '未开始',
        imgUrl: require("../../assets/hangair.png")
      }, {
        value: '3',
        label: '进行中',
        imgUrl: require("../../assets/havehand.png")
      }, {
        value: '1',
        label: '审核中',
        imgUrl: require("../../assets/Underreview.png")
      }, {
        value: '2',
        label: '完成',
        imgUrl: require("../../assets/complete.svg")
      }],
      levelsAll: [
        {
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
      values: '全部状态',
      TaskClickId:'',
      actionInd: 0,
      leaderIdStrs:'',
      list: ['今天','日','周','月']
    };
  },
    watch: {
    conditionsearch(val) {
      this.$refs.taskTree.filter(val);
    },
    TaskClickId(val) {
     this.$refs.taskTree.setCurrentKey(val);
    },
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
  },
  created(){
    this.initData()
  },
  mounted() {
    this.getUsersFn()
    window.eventBus.$on("ToupdateData",()=>{
      this.getTaskListFn()
    });
      this.getTaskListFn()
    $('.task-node').map((ind,item)=>{
      let paddingLeft = $(item).parent().css("padding-left");
      $(item).find('.task-exhibition').css("margin-left",'-'+paddingLeft)
    })
    this.ganttFn()
  },
  methods: {
    ganttFn() {
      //自适应甘特图的尺寸大小, 使得在不出现滚动条的情况下, 显示全部任务
        gantt.config.autosize = true;
        let that = this;
      gantt.attachEvent("onTaskClick", (id)=>{
            that.TaskClickId = id
            return true
      })
      gantt.attachEvent("onTaskDblClick", (id)=>{
        that.Gantdouble(id,that.taskList)
            return false;
        });
        gantt.attachEvent("onAfterTaskUpdate", function(id,item){ // 拖动进度事件
          new Date(item.end_date).getMonth() ,new Date(item.end_date).getDate()
          let endDate = new Date(item.end_date).getDate()>=10?new Date(item.end_date).getDate():"0"+new Date(item.end_date).getDate()
          let endMonth = (new Date(item.end_date).getMonth()+1)>=10?(new Date(item.end_date).getMonth()+1):'0'+(new Date(item.end_date).getMonth()+1)
          let endYear = new Date(item.end_date).getFullYear()
          let startDate = new Date(item.start_date).getDate()>=10?new Date(item.start_date).getDate():"0"+new Date(item.start_date).getDate()
          let startMonth = (new Date(item.start_date).getMonth()+1)>=10?(new Date(item.start_date).getMonth()+1):'0'+(new Date(item.start_date).getMonth()+1)
          let startYear = new Date(item.start_date).getFullYear()
          let endTime = endYear+'-'+endMonth+'-'+endDate
          let startTime = startYear+'-'+startMonth+'-'+startDate
          let dto = {
            endTime: endTime,
            startTime:startTime,
            id: id
          }
          getTaskUpdate(dto).then((res)=>{
            if(res.data.code == 200) {
              that.getTaskListFn()
            } else {
              that.$message.error(res.data.message);
            }
          })
        });
        gantt.config.show_errors = false;//发生异常时，允许弹出警告到UI界面
        gantt.templates.timeline_cell_class = function(item,date){
          var stamp = new Date()
          // var itemTime = new Date(item.start_date)
          if(stamp.getMonth()+1 == date.getMonth()+1 && stamp.getDate() == date.getDate()) {
            return 'samedays';
          }
            if(date.getDay()== 0 || date.getDay()== 6){
                return 'weekend';
            }
        };
        gantt.config.show_grid = false;
        gantt.config.drag_move = false;
        gantt.config.order_branch = true;
        //时间轴图表中，如果不设置，只有行边框，区分上下的任务，设置之后带有列的边框，整个时间轴变成格子状。
        // gantt.config.show_task_cells = true
        
        gantt.config.scale_unit = "month";
        gantt.config.fit_tasks = true;
        gantt.config.step = 1;
        gantt.config.date_scale = "%m"+"月";
        //当task的长度改变时，自动调整图表坐标轴区间用于适配task的长度
        gantt.config.row_height = 50;
        gantt.config.subscales = [{ unit: "day", step: 1, date: "%j"+"日" } ];
        //当右侧不止显示年份时，可以添加展示月日，添加一个就加一行
        gantt.config.scale_height = 54;//甘特图右侧表头的高度
        gantt.config.min_column_width = 50;
        //下面日期的宽度，会随时间长短宽度变化。但是设置最小宽度后，当时间跨度到达一定长度，就会展示最小宽度
        gantt.i18n.setLocale("cn"); //使用中文
        gantt.config.time_step = 0;
        gantt.config.min_duration = 24*60*60*1000;
          //任务条显示内容
          gantt.templates.task_text = function(start, end, task) {
            let bgColor;
            if(task.imgurl == "") {
              task.imgurl = 'data:image/png;base64,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';
            }
            if(task.sex == 1) {
              bgColor = "border:1px solid #00A8FF;border-radius: 100%;"
            } else if(task.sex == 2) {
              bgColor = "border:1px solid #FF0066;border-radius: 100%;"
            } else {
              bgColor = ""
            }
            let str=`<div class="taskbar">
                  <div class="taskbar-basic">
                    <img src="${task.imgurl}" style="${bgColor}">
                    <article>
                      ${ task.name }
                      <br/>
                      ${task.roles?task.roles.map(items => `
                        <span>${items}</span>
                      `).join(''):''}
                    </article>
                  </div>
                  <div class="taskbar-time">
                    <article>${new Date(start).getMonth()+1}月${new Date(start).getDate()}日 - </article>
                    <article>${new Date(end).getMonth()+1}月${new Date(end).getDate()}日</article>
                  </div>
            </div>`;
            return str
          } 
        gantt.init(that.$refs.gantt);  //初始化
        gantt.parse(that.tasks);
        gantt.showDate(new Date())
        if($(".samedays").position()) {
          gantt.scrollTo($(".samedays").position().left-400, 0);
        }
    },
   overPants(ind) {
      $('.participants-list li').eq(ind).find(".deleteImg").css('visibility','visible')
    },
    outPants(ind) {
      $('.participants-list li').eq(ind).find(".deleteImg").css('visibility',' hidden')
    },
    Gantdouble(id,data) {
      data.map((item)=>{
        if(item.id == id*1) {
          this.dialogVal = item.name
          this.handleStr = {
            descreption: item.descreption,
            id: item.id,
            folderId:item.folderId
          }
          window.eventBus.$emit("handleNode",{
              descreption: item.descreption,
              id: item.id
          });
          this.levelArr.map((item)=>{
            if(item.value == item.level) {
              this.taskLink = item.label.split("")[0];
            }
          })
          this.sTime = item.startTime
          this.eTime = item.endTime
          this.rightpersonVal = item.person+ ';' +JSON.stringify(item.roles)+ ';' +data.sex;
          this.rightpersonImg = item.imgUrl
          this.participantsFn()
          this.dialogVisible = true;
          this.cities.map((item)=>{
            if(item.value == item.status) {
              this.statesItem = item
            }
          })
        this.leaderIdStrs = data.leaderIdStr
    
          this.rightPerson = false;
          this.choicePerson = false;
          this.$nextTick(() => {
          $(".detailsTab").find('li').eq(0).addClass("tabAction").siblings().removeClass("tabAction")
          this.detailsTab.map((item,ind)=>{
              $(".detailsTab").find('li').eq(ind).find('img').attr("src",item.imgUrl);
          })
          this.tabInd = 0
            if(this.$refs.rightTree) {
              this.$refs.rightTree.setCheckedKeys([data.leaderIdStr]);
            }
          })
        } else {
          if(item.children.length>0) {
            this.Gantdouble(id,item.children)
          }
        }
      })
    },
    getUsersFn() {
      getUsers().then((res)=>{
        if(res.data.code == 200) {
            this.jurisdData = res.data.data;
            this.rightData = res.data.data;
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    getTaskListFn(str) {
      getTaskList(str).then((res)=>{
        if(res.data.code == 200) {
           this.selectUserFn(res.data.data)
          setTimeout(()=>{
            this.taskList = res.data.data
          },200)
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
    selectUserFn(data) {
      data.map((item)=>{
        if(item.leaderIdStr) {
          getSelectUser({userIdStr:item.leaderIdStr}).then((res)=>{
            if(res.data.code == 200) {
              item.person = res.data.data.realName
              item.imgUrl = res.data.data.bigImgUrl
              item.roles = res.data.data.roles
              item.sex = res.data.data.sex
              if(item.children.length>0) {
                this.selectUserFn(item.children)
              }
            } else {
              this.$message.error(res.data.message);
            }
          })
        } else {
          item.person = '参与人'
          item.imgUrl = ''
          item.roles = ''
          item.sex = ''
        }
      })
    },
    ganttClass(inds) {
      this.actionInd = inds; 
      if(inds == 0) {
        gantt.showDate(new Date())
        if($(".samedays").position()) {
          gantt.scrollTo($(".samedays").position().left-400, 0);
        }
      } else if(inds == 1) {
        gantt.config.scale_unit = "month";
        gantt.config.step = 1;
        gantt.config.date_scale = "%m"+"月";
        gantt.config.subscales = [{ unit: "day", step: 1, date: "%j"+"日" }];
        gantt.init(this.$refs.gantt);  //初始化
      } else if(inds == 2) {
        gantt.config.scale_unit = "month";
        gantt.config.step = 1;
        gantt.config.date_scale = "%m"+"月";
        gantt.config.subscales = [{ unit: "day", step: 1, date: "星期"+"%D" }];
        gantt.init(this.$refs.gantt);  //初始化
      } else if(inds == 3) {
        gantt.config.scale_unit = "month";
        gantt.config.step = 1;
        gantt.config.date_scale = "%m"+"月";
        gantt.config.subscales = [];
        gantt.init(this.$refs.gantt);  //初始化
      }
    },
    expandFn(data) {
      this.tasks.data.map((item)=>{
        if(item.id == data.id) {
            item.open = true
        }
      })
      gantt.init(this.$refs.gantt);  //初始化
      gantt.parse(this.tasks); 
    },
    nodeClickFn(data) {
      $(".gantt_task_row").map((ind,item)=>{
        $(item).removeClass("gantt_selected")
        if($(item).attr("task_id") == data.id){
          $(item).addClass("gantt_selected")
        }
      })
    },
    collapseFn(data) {
      this.tasks.data.map((item)=>{
        if(item.id == data.id) {
            item.open = false
        }
      })
      gantt.init(this.$refs.gantt);  //初始化
      gantt.parse(this.tasks); 
    },
    initData() {
      getTaskGanter().then((res)=>{
        if(res.data.code == 200) {
        this.tasks.data = []
          if(res.data.data) {
            res.data.data.map(function(current) {
                  current.parent = current.pid
                  current.open = false
                  if (current.status == 2) { //完成
                    current.color = '#34D0B699'
                  } else if (current.status == 3) { //审核中
                    current.color = '#FA708099'
                  } else if (current.status == 0) { //未完成
                    current.color = '#8f8f8f'
                  } else if (current.status == 1) { //进行中
                    current.color = '#FFAB7399'
                  }
                getSelectUser({userIdStr:current.leaderIdStr}).then((Seleres)=>{
                  if(Seleres.data.code == 200) {
                    current.name = Seleres.data.data.realName
                    current.imgurl = Seleres.data.data.bigImgUrl
                    current.roles = Seleres.data.data.roles
                    current.sex = Seleres.data.data.sex
                  } else {
                    this.$message.error(Seleres.data.message);
                  }
                })
              })
            setTimeout(()=>{
              this.tasks.data = res.data.data
              gantt.init(this.$refs.gantt);  //初始化
              gantt.parse(this.tasks);
            },200)
          }
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
     pickerStartDate() {
      var _this = this;
      return {
        disabledDate(time) {
          var time1 = new Date(_this.sTime).getTime();// 开始日期时间戳
          return time.getTime() < time1;
        }
      }
    },
    statesCommand(command) {
      this.citiesAll.map((item)=>{
        if(item.value == command) {
          this.statesItem = item
        }
      })
      let dto = {
        status:command,
        id: this.handleStr.id
      }
      getTaskUpdate(dto).then((res)=>{
        if(res.data.code == 200) {
          this.getTaskListFn()
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    taskCommand(command) {
      this.levelsAll.map((item)=>{
        if(item.value == command) {
          this.taskLink = item.label.split("")[0];
        }
      })
      let dto = {
        level:command,
        id: this.handleStr.id
      }
      getTaskUpdate(dto).then((res)=>{
        if(res.data.code == 200) {
          this.getTaskListFn()
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    choiceGroupNode(a, b) {
      if (b.checkedKeys.length > 0) {
        this.$refs.rightTree.setCheckedKeys([a.userId]);
      }
    },
    rightBuind() {
      if(this.$refs.rightTree.getCheckedNodes().length>0){
        this.rightpersonVal = this.$refs.rightTree.getCheckedNodes()[0].realName+ ';' +JSON.stringify(this.$refs.rightTree.getCheckedNodes()[0].roles)+ ';' +this.$refs.rightTree.getCheckedNodes()[0].sex;
        this.rightpersonImg = this.$refs.rightTree.getCheckedNodes()[0].imgUrl
        this.rightPerson = false;
        let dto = {
          leaderIdStr:this.$refs.rightTree.getCheckedNodes()[0].userId,
          id: this.handleStr.id
        }
        getTaskUpdate(dto).then((res)=>{
          if(res.data.code == 200) {
            this.getTaskListFn()
          } else {
            this.$message.error(res.data.message);
          }
        })
      } else {
        this.$refs.rightTree.setCheckedKeys([this.leaderIdStrs]);
        this.rightPerson = false;
      }
    },
    sTimeChange() {
      if(this.sTime) {
        this.eTimeTrue = false
        let dto = {
          startTime:this.sTime,
          id: this.handleStr.id
        }
        getTaskUpdate(dto).then((res)=>{
          if(res.data.code == 200) {
            this.getTaskListFn()
          } else {
            this.$message.error(res.data.message);
          }
        })
      } else {
        this.eTimeTrue = true
      }
    },
    eTimeChange() {
      if(this.eTime) {
        let dto = {
          endTime:this.eTime,
          id: this.handleStr.id
        }
        getTaskUpdate(dto).then((res)=>{
          if(res.data.code == 200) {
            this.getTaskListFn()
          } else {
            this.$message.error(res.data.message);
          }
        })
      }
    },
    detailsTabFn(ind) {
      this.tabInd = ind
      this.detailsTab.map((item,inds) =>{
        if(inds == ind) {
          $(".detailsTab").find('li').eq(ind).find('img').attr("src",this.detailsTabselect[ind]);
        } else {
          $(".detailsTab").find('li').eq(inds).find('img').attr("src",item.imgUrl);
        }
      })
    },
    technological(command) {
      this.examineArr.map((item)=>{
        if(item.value == command) {
          this.technologicalLink = item.label;
        }
      })
    },
     participantsFn() {
      getTaskPartnerList({taskId:this.handleStr.id}).then((res)=>{
        if(res.data.code == 200) {
          let userArr = [];
          if(this.$refs.choicetree) {
            this.$refs.choicetree.setCheckedKeys([]);
          }
           res.data.data.map((item)=>{
              getSelectUser({userIdStr:item.partnerIdStr}).then((res)=>{
                if(res.data.code == 200) {
                  item.namr = res.data.data.realName
                  item.imgurl = res.data.data.bigImgUrl
                  item.text = res.data.data.roles
                  item.userId = res.data.data.userId
                  item.sex = res.data.data.sex
                  userArr.push(res.data.data.userId)
                } else {
                  this.$message.error(res.data.message);
                }
              })
           })
           setTimeout(()=>{
            this.participantsArr = this.unarrque(res.data.data)
              if(this.$refs.choicetree) {
                this.$refs.choicetree.setCheckedKeys(userArr);
              }
           },200)
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    choiceBuild() {
        if(this.$refs.choicetree.getCheckedNodes().length>0){
          this.$refs.choicetree.getCheckedNodes().map((item)=>{
              getTaskPartnerCreate({taskId:this.handleStr.id,partnerIdStr:item.userId}).then((res)=>{
                if(res.data.code == 200) {
                  this.choicePerson = false;
                  this.participantsFn()
                } else {
                  this.$message.error(res.data.message);
                }
              })
          })
      } else {
        let userArr = [];
        this.participantsArr.map((item)=>{
          userArr.push(item.userId)
        })
          this.$refs.choicetree.setCheckedKeys(userArr)
          this.choicePerson = false;
      }
    },
    deleteImgFn(data) {
      getTaskPartnerDelete({id:data.id}).then((res)=>{
        if(res.data.code == 200) {
          this.$message.success("删除成功");
          this.participantsFn()
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    unarrque(arrInfo) {
    let newobj = {};
      arrInfo = arrInfo.reduce (function(item,next){
      newobj[next.namr] ? ' ' : newobj[next.namr]  = true && item.push(next)
      return item;
      },[])
      return arrInfo
    },
    dialogClack(dialog,data) {
     this.handleStr = {
        descreption: data.descreption,
        id: data.id,
        folderId:data.folderId
      }
    window.eventBus.$emit("handleNode",{
        descreption: data.descreption,
        id: data.id
    });
      this.leaderIdStrs = data.leaderIdStr
    
        this.rightPerson = false;
          this.choicePerson = false;
      this.levelArr.map((item)=>{
        if(item.value == data.level) {
          this.taskLink = item.label.split("")[0];
        }
      })
      this.sTime = data.startTime
      this.eTime = data.endTime
      this.dialogVal = dialog
      this.dialogVisible = true;
      
        this.rightpersonVal = data.person+ ';' +JSON.stringify(data.roles)+ ';' +data.sex;
        this.rightpersonImg = data.imgUrl
        this.participantsFn()
      this.cities.map((item)=>{
        if(item.value == data.status) {
          this.statesItem = item
        }
      })
       this.$nextTick(() => {
        $(".detailsTab").find('li').eq(0).addClass("tabAction").siblings().removeClass("tabAction")
        this.detailsTab.map((item,ind)=>{
           $(".detailsTab").find('li').eq(ind).find('img').attr("src",item.imgUrl);
        })
        this.tabInd = 0
        $(".detailsTab").find('li').eq(0).find('img').attr("src",this.detailsTabselect[0]);
        if(this.$refs.rightTree) {
          this.$refs.rightTree.setCheckedKeys([data.leaderIdStr]);
        }
      });
    },
    rightfilter(value, data) { // 权限搜索按钮
      if (!value) return true;
      return data.fileName.indexOf(value) !== -1;
    },
    choicefilter(value, data) { // 权限搜索按钮
      if (!value) return true;
      return data.fileName.indexOf(value) !== -1;
    },
    taskfilter(value, data) { // 权限搜索按钮
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    headClick(ind) {
      this.headInd = ind
      if(ind == 0) {
        this.getTaskListFn()
      } else if(ind == 3) {
        getListIamPartner().then((res)=>{
          if(res.data.code == 200) {
            this.selectUserFn(res.data.data)
            setTimeout(()=>{
              this.taskList = res.data.data
            },200)
            this.$nextTick(()=>{
              $('.taskNode').map((ind,item)=>{
                let paddingLeft = $(item).parent().css("padding-left");
                $(item).find('.task-exhibition').css("margin-left",'-'+paddingLeft)
              })
            })
          } else {
            this.$message.error(res.data.message);
          }
        })
      }  else {
        getWhoAmI({amI:ind}).then((res)=>{
          if(res.data.code == 200) {
            this.selectUserFn(res.data.data)
            setTimeout(()=>{
              this.taskList = res.data.data
            },200)
            this.$nextTick(()=>{
              $('.taskNode').map((ind,item)=>{
                let paddingLeft = $(item).parent().css("padding-left");
                $(item).find('.task-exhibition').css("margin-left",'-'+paddingLeft)
              })
            })
          } else {
            this.$message.error(res.data.message);
          }
        })
      }
    }
  }
}; 
  </script>
  <style lang="scss" scoped>
  .ganttList {
    display: flex;
    align-items: center;
    padding-top: 5px;
    padding-bottom: 5px;
    li {
      border: 1px solid #FA5C0C;
      color: #FA5C0C;
      font-size: 14px;
      cursor: pointer;
      padding: 2px 0;
      width: 40px;
      text-align: center;
      margin-left: 10px;
    }
    .actions{
      background: #FA5C0C;
      color: #fff;
    }
  }
.file-task{
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
}
.task-left {
  background: #707070;
  height: 100%;
  width: 24%;
  display: flex;
  flex-direction: column;
  min-width: 340px;
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
        white-space: nowrap;
        cursor: pointer;
        font-size: 16px;
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
.task-list{
  flex: 0.99;
  height: 100%;
  overflow-y: scroll;
}
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
.choice-tree{
  margin-top: 8px;
  margin-bottom: 8px;
  border: 1px solid #D3D3D3;
  padding-right: 10px;
  padding-bottom: 10px;
  overflow-y: scroll;
  max-height: 200px;
}
.jurisd-custom{
  display: flex;
  align-items: center;
  img {
    height: 26px;
    border-radius: 100%;
  }
  p{
    padding-left: 8px;
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
    background: #FA5C0C;
    color: #fff;
    font-size: 14px;
    text-align: center;
    padding:0 20px;
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
      flex: 2;
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
      flex: 1;
      text-align: center;
      color: #373737;
      font-size: 18px;
      font-weight: 500;
      min-width: 80px;
    }
  }
  .task-exhibition{
    display: flex;
    align-items: center;
    flex: 1;
  }
  .tasks-tree {
    padding-top: 6px;
    background: #DFDFDF;
  }

.task-right{
  width: 76%;
  height: 100%;
}
.task-dialog{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.right-operation{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 8px 15px;
}
.right-states{
    cursor: pointer;
  .examine-link{
    display: flex;
    align-items: center;
      white-space: nowrap;
    color: #373737;
    font-size: 14px;
    img {
      height: 20px;
      margin-right: 6px;
    }
  }
}
.right-person{
    cursor: pointer;
  .person {
    display: flex;
    align-items: center;
    img {
      height: 26px;
      margin-right: 6px;
    }
    p {
      color: #373737;
      font-size: 14px;
    }
  }
}
.statesCla{
  display: flex;
  align-items: center;
  img {
    height: 20px;
    margin-right: 6px;
  }
}
.right-task{
    cursor: pointer;
  p{
    font-size: 16px;
    color: #373737;
    span {
      font-size: 20px;
      font-weight: 500;
    }
  }
}
.right-technological{
  p {
    color: #373737;
    font-size: 14px;
  display: flex;
  align-items: center;
    img {
      height: 26px;
      margin-right: 6px;
    }
  }
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
.right-participants{
  display: flex;
  align-items: center;
}
.participants-choice{
  padding-left: 15px;
  .person{
    display: flex;
    align-items: center;
      p {
        font-size: 14px;
        color: #707070;
        padding-right: 8px;
      }
    img {
      height: 30px;
    }
  }
}

.participants-list{
  padding-left: 10px;
  display: flex;
  align-items: center;
  li {
    display: flex;
    align-items: center;
    padding-right: 16px;
    img {
      height: 30px;
    }
    div {
      padding-left: 8px;
      p {
          font-size: 12px;
          color: #707070;
          &:nth-child(1) {
            font-weight: bold;
            color: #373737;
          }
      }
    }
    .deleteImg{
      padding-left: 20px;
      visibility: hidden;
      cursor: pointer;
      img{
        height: 16px;
      }
    }
  }
}
.detailsTab{
  display: flex;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 4px;
  margin-bottom: 10px;
  border-bottom: 1px solid #C5C5C5;
  li {
    display: flex;
    align-items: center;
    color: #C5C5C5;
    font-size: 14px;
    border-right: 1px solid #C5C5C5;
    padding:0 15px;
    white-space: nowrap;
    cursor: pointer;
    &:last-child{
      border-right: 0;
    }
    img {
      height: 14px;
      margin-right: 4px;
    }
    
  }
  .tabAction{
  color: #FA5C0C;
}
}
</style>
<style lang="scss">
.gantt_task_content{
  text-align: left;
}
  .taskbar{
    line-height: 22px;
    display: flex;
    align-items: center;
    height: 100%;
    .taskbar-basic{
      display: flex;
      align-items: center;
      img {
        height: 30px;
        margin-left: 10px;
      }
      article{
        text-align: left;
        font-size: 13px;
        line-height: 18px;
        color: #373737;
        padding-left: 8px;
        span{
          color: #707070;
          font-size: 8px;
          padding-right: 8px;
          font-size: 12px;
        }
      }
    }
    .taskbar-time{
      display: flex;
      align-items: center;
      color: #373737;
      font-size: 14px;
    }
  }
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
  background: #fff;
}
  .tasks-tree .el-tree-node .el-tree-node__content {
    height: 48px;
    border-bottom: 1px solid #EBEEF5;
    margin-top: 0;
  }
.condition {
      margin-right: 5px;
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
}.task-left-condition .el-select .el-select__caret{
    color: #fff;
}
.task-left-search .el-input__inner{
  border-radius: 0;
}
.person-tree{
  overflow-y: scroll;
  max-height: 200px;
}
</style>
<style lang='scss'>

    @import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
    .el-dialog {
        margin-top: 4vh !important;
    }
.el-dialog--center .el-dialog__body{
      padding: 0px 25px 10px;
}
.weekend {
    background:#DFDFDF33;
}
.samedays{
  background: #FFAB7333;
}
.gantt_layout_cell_border_bottom{
  border-bottom: 0;
}
.gantt_selected .weekend {
    background:#f7eb91;
}
.gantt_task_line .gantt_task_progress_drag{
  visibility: hidden;
}
.gantt_link_control.task_left,.gantt_link_control.task_right{
  display: none;
}
</style>