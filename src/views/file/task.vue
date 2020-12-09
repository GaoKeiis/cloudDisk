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
          <div class="task-left-search">
            <el-input @keyup.enter.native="opeChange()" size="small" v-model="opensearch" placeholder="新建任务，按回车键保存。" />
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
                          
                          show-checkbox
                          check-strictly
                          node-key="userId"
                          @check="checkGroupNode"
                          :filter-node-method="jurisdfilter"
                          ref="tree">
                            <div class="jurisd-node" slot-scope="{ node, data }">
                              <div class="jurisd-custom">
                                <img v-if="data.imgUrl" :src="data.imgUrl">
                                <img v-else src="../../assets/person-icon.png">
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
                            <img v-if="personImg" :src="personImg">
                            <img v-else src="../../assets/person-icon.png">
                            <p v-if="personVal == '负责人'">{{ personVal }}</p>
                            <p v-else>{{ personVal.split(';')[0] }}<br>
                              <span v-for="(items,ind) in JSON.parse(personVal.split(';')[1])" :key='ind'>{{items}}</span>
                            </p>
                          </div>
                        </el-popover>
                      </div>
                      <!-- <div class="examine">
                        <el-dropdown trigger="click" @command="examineCommand">
                          <p class="examine-link">
                          <img src="../../assets/examine-icon.png">{{ examineLink }}
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
                  <el-button size="small" @click="visible = !visible">取消</el-button>
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
            <span @click="deleteTask()">删除</span>
        </div>
      </div>
      <div class="task-list">
        <el-tree
            :expand-on-click-node="false"
            :data="taskList"
            :props="taskProps"
            node-key="id"
            class="task-tree"
            highlight-current
            :filter-node-method="taskfilter"
            @node-click="handleNodeClick"
            ref="taskTree">
              <div class="taskNode" slot-scope="{ node, data }" @mouseover="mouseoverMask('operation'+data.id)" @mouseout="changeMask('operation'+data.id)">
                <div class="task-custom">
                  <p :title="node.label">
                    <span v-if="data.notRead"></span>
                    {{ node.label }}
                  </p>
                  <div class="task-exhibition">
                    <div class="task-operation" :class="'operation'+data.id" v-if="data.jurisdiction == 1" style="visibility: hidden;">
                      <img src="../../assets/modify.png">
                      <img src="../../assets/taskdelete.png">
                    </div>
                    <div class="task-operation" v-else style="visibility: hidden;">
                      <img src="../../assets/modify.png">
                      <img src="../../assets/taskdelete.png">
                    </div>
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
                    <div class="taskPerson">
                      <div v-if="data.imgUrl">
                        <img v-if="data.sex == 1" :src="data.imgUrl" style="border:1px solid #00A8FF;border-radius: 100%;">
                        <img v-else-if="data.sex == 2" :src="data.imgUrl" style="border:1px solid #FF0066;border-radius: 100%;">
                        <img v-else :src="data.imgUrl">
                      </div>
                      <div v-else>
                        <img v-if="data.sex == 1" src="../../assets/person-icon.png" style="border:1px solid #00A8FF;border-radius: 100%;">
                        <img v-else-if="data.sex == 2" src="../../assets/person-icon.png" style="border:1px solid #FF0066;border-radius: 100%;">
                        <img v-else src="../../assets/person-icon.png">
                      </div>
                      <article>
                        {{ data.person }}
                        <!-- <br/>
                        <span v-for="(items,ind) in data.roles" :key='ind'>{{items}}</span> -->
                      </article>
                    </div>
                    <div class="taskTime">
                      <span v-if="data.startTime">{{ data.startTime.split(' ')[0].split('-')[1] }}月{{ data.startTime.split(' ')[0].split('-')[2] }}日  -  </span>
                      <span v-else style="visibility: hidden;">10年20月 - </span>
                      <span v-if="data.endTime">{{ data.endTime.split(' ')[0].split('-')[1] }}月{{ data.endTime.split(' ')[0].split('-')[2] }}日</span>
                      <span v-else style="visibility: hidden;">10年31月</span>
                    </div>
                  </div>
                </div>
              </div>
          </el-tree>
      </div>
    </div>
    <div class="task-right" v-if="rightName">
      <div class="right-head">
        {{ rightName }}
      </div>
      <div class="right-operation">
        <div class="right-states">
          <el-dropdown trigger="click" placement="bottom-start" @command="statesCommand">
            <p class="examine-link">
            <img :src="statesItem.imgUrl">{{ statesItem.label }}
            </p>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
              v-for="item in citiesPops"
              class="statesCla"
              :key="item.value" :command="item.value">
               <img v-if="item.imgUrl" :src="item.imgUrl">{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
          <div class="right-task">
            <el-dropdown placement="bottom-start" trigger="click" @command="taskCommand">
              <p class="el-dropdown-link">
                <span>{{ taskLink }}</span> 级任务
              </p>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                v-for="item in levelArrs"
                :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
            <div class="right-person">
              <el-popover
                placement="bottom-start"
                popper-class="popofolder"
                v-model="rightPerson"
                >
              <el-input
                placeholder="搜索成员"
                suffix-icon="el-icon-search"
                size="small"
                v-model="rightText">
              </el-input>
              <el-tree
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
              :disabled='eTimeTrue'
              @change="eTimeChange()"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="截止时间">
            </el-date-picker>
        </div>
        <!-- <div class="right-technological">
          <el-dropdown placement="bottom-start" trigger="click" @command="technological">
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
            node-key="userId"
            
            check-on-click-node
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
                    <br/>
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
               <span v-for="(items,ind) in item.text" :key="ind" style="padding-right:8px;">{{ items }}</span>
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
      <leaving v-if="tabInd == 0" :handleStr='handleStr'></leaving>
      <subtask v-if="tabInd == 1" :handleStr='handleStr'></subtask>
      <taskfiles v-if="tabInd == 2" :handleStr='handleStr'></taskfiles>
      <taskreview v-if="tabInd == 3" :handleStr='handleStr'></taskreview>
      <activity v-if="tabInd == 4"></activity>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import leaving from '../../components/leaving'
import activity from '../../components/activity'
import taskfiles from '../../components/taskfiles'
import taskreview from '../../components/taskreview'
import subtask from '../../components/subtask'
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
  //  eslint-disable-next-line
  getSelectUser,
  //  eslint-disable-next-line
  getTaskPartnerCreate,
  //  eslint-disable-next-line
  getTaskPartnerDelete,
  //  eslint-disable-next-line
  getTaskPartnerList,
  //  eslint-disable-next-line
  getCreateTaskFolder,
  getWhoAmI,
  getListIamPartner,
  //  eslint-disable-next-line
  getSelectFolderId,
} from '@/apis/api'
export default {
  data() {
    return {
      tabInd: 0,
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
      headArr: ['全部任务', '我创建的', '我负责的', '我参与的'],
      opensearch: '',
      eTimeTrue: true,
      sTime: '',
      eTime: '',
      participantsArr:[],
      pickerOptions: this.pickerStartDate(),
      subtask: true,
      visible: false,
      choicePerson: false,
      visiblePerson: false,
      rightPerson: false,
      personImg: require("../../assets/person-icon.png"),
      rightpersonImg: require("../../assets/person-icon.png"),
      headInd: 0,
      conditionsearch: '',
      statesItem: {
        imgUrl: require("../../assets/hangair.png"),
        label: '未开始'
      },
      examineLink: '未审核',
      technologicalLink: '未审核',
      personVal: '负责人',
      rightpersonVal: '负责人',
      taskName:'',
      dropdownLink: 'C',
      taskLink: 'C',
      filterText: '',
      choiceText: '',
      rightText: '',
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
      citiesPops: [
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
      levelArrs: [
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
      rightName: '',
      handleStr:'',
      leaderIdStrs:''
    }
  },
  components: {
    leaving,activity,taskfiles,taskreview,subtask
  },
  watch: {
    visible() {
      this.dropdownLink = 'C';
      this.personVal = "负责人";
      this.personImg = require("../../assets/person-icon.png");
      this.subtask = true
      // this.examineLink = "未审核"
      this.taskName = ''
      this.startNum = ''
      this.numberTasks = ''
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
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    conditionsearch(val) {
      this.$refs.taskTree.filter(val);
    },
    rightText(val) {
      this.$refs.rightTree.filter(val);
    },
    choiceText(val) {
      this.$refs.choicetree.filter(val);
    },
  },
  mounted(){
    window.eventBus.$on("ToupdateData",()=>{
      this.getTaskListFn()
    });
    this.getTaskListFn()
    this.getUsersFn()
  },
  methods: {
    getTaskListFn(str) {
      getTaskList(str).then((res)=>{
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
    overPants(ind) {
      $('.participants-list li').eq(ind).find(".deleteImg").css('visibility','visible')
    },
    outPants(ind) {
      $('.participants-list li').eq(ind).find(".deleteImg").css('visibility',' hidden')
    },
    mouseoverMask(operation) {
      if($('.'+operation).length>0) {
        $('.'+operation).css("visibility",'visible')
      }
    },
    changeMask(operation) {
      if($('.'+operation).length>0) {
        $('.'+operation).css("visibility",'hidden')
      }
    },
    opeChange() {
      let str;
      if(this.$refs.taskTree.getCurrentNode()) {
        getCreateTaskFolder({name: this.opensearch,pFolderId:this.$refs.taskTree.getCurrentNode().folderId}).then((res)=>{
          if(res.data.code == 200) {
            str = {
              name: this.opensearch,
              pid: this.$refs.taskTree.getCurrentNode().id,
              folderId: res.data.data.folderId
            }
            this.getTaskCreateFn(str)
          } else {
            this.$message.error(res.data.message);
          }
        })
      } else {
        getSelectFolderId({businessType: 1}).then((res)=>{
          if(res.data.code == 200) {
            getCreateTaskFolder({name: this.opensearch,pFolderId: res.data.data.folderId}).then((resq)=>{
              if(res.data.code == 200) {
                    str = {
                      name: this.opensearch,
                      folderId: resq.data.data.folderId,
                    }
                  this.getTaskCreateFn(str)
              } else {
                this.$message.error(res.data.message);
              }
            })
          } else {
            this.$message.error(res.data.message);
          }
        })
      }
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
    deleteTask() {
      if(this.$refs.taskTree.getCurrentNode()) {
        getTaskDelete({id:this.$refs.taskTree.getCurrentNode().id}).then((res)=>{
          if(res.data.code == 200) {
            this.$message.success('删除成功');
            this.rightName = ''
            this.getTaskListFn()
          } else {
            this.$message.error(res.data.message);
          }
        })
      } else {
        this.$message.error('请选择任务');
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
    pickerStartDate() {
      var _this = this;
      return {
        disabledDate(time) {
          var time1 = new Date(_this.sTime).getTime();// 开始日期时间戳
          return time.getTime() < time1;
        }
      }
    },
    participantsFn() {
      this.participantsArr = []
      getTaskPartnerList({taskId:this.handleStr.id}).then((res)=>{
        if(res.data.code == 200) {
          let userArr = []
          this.$refs.choicetree.setCheckedKeys([]);
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
            this.$refs.choicetree.setCheckedKeys(userArr);
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
    rightBuind() {
      if(this.$refs.rightTree.getCheckedNodes().length>0){
        this.rightpersonVal = this.$refs.rightTree.getCheckedNodes()[0].realName+ ';' +JSON.stringify(this.$refs.rightTree.getCheckedNodes()[0].roles)+ ';' +JSON.stringify(this.$refs.rightTree.getCheckedNodes()[0].sex);
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
    handleNodeClick(data) {
     this.handleStr = {
        descreption: data.descreption,
        id: data.id,
        folderId:data.folderId
      }
    window.eventBus.$emit("handleNode",{
        descreption: data.descreption,
        id: data.id
    });
      this.rightName = data.name
      
      this.citiesPops.map((item) =>{
        if(item.value == data.status) {
          this.statesItem = item
        }
      })
      this.rightPerson = false;
      this.choicePerson = false;
      this.rightpersonVal = data.person+ ';' +JSON.stringify(data.roles)+ ';' +data.sex;
      this.rightpersonImg = data.imgUrl
      this.taskLink = this.levelArrs[data.level].label.split("")[0];
      this.sTime = data.startTime
      this.eTime = data.endTime
      this.leaderIdStrs = data.leaderIdStr
      this.participantsFn()
      this.$nextTick(()=>{
        $(".detailsTab").find('li').eq(0).addClass("tabAction").siblings().removeClass("tabAction")
        this.detailsTab.map((item,ind)=>{
          $(".detailsTab").find('li').eq(ind).find('img').attr("src",item.imgUrl);
        })
        this.tabInd = 0
        $(".detailsTab").find('li').eq(0).find('img').attr("src",this.detailsTabselect[0]);
        this.$refs.rightTree.setCheckedKeys([data.leaderIdStr]);
      })
    },
    statesCommand(command) {
      this.citiesPops.map((item) =>{
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
      this.levelArrs.map((item)=>{
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
    personBuild() {
      if(this.$refs.tree.getCheckedNodes().length>0){
        this.personVal = this.$refs.tree.getCheckedNodes()[0].fileName+ ';' +JSON.stringify(this.$refs.tree.getCheckedNodes()[0].roles);
        this.personImg = this.$refs.tree.getCheckedNodes()[0].imgUrl
      } else {
        this.personVal = "负责人"
        this.personImg = require("../../assets/person-icon.png")
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
      return data.realName.indexOf(value) !== -1;
    },
    checkGroupNode(a, b) {
        if (b.checkedKeys.length > 0) {
          this.$refs.tree.setCheckedKeys([a.userId]);
        }
    },
    choiceGroupNode(a, b) {
      if (b.checkedKeys.length > 0) {
        this.$refs.rightTree.setCheckedKeys([a.userId]);
      }
    },
    rightfilter(value, data) { // 权限搜索按钮
      if (!value) return true;
      return data.realName.indexOf(value) !== -1;
    },
    choicefilter(value, data) { // 权限搜索按钮
      if (!value) return true;
      return data.realName.indexOf(value) !== -1;
    },
    detBuild() { // 移动取消按钮
      this.dropdownLink = 'C';
      this.personVal = "负责人";
      this.personImg = require("../../assets/person-icon.png");
      this.subtask = true
      // this.examineLink = "未审核"
      this.visible = false
      this.taskName = ''
      this.startNum = ''
      this.numberTasks = ''
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
      } else {
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
    },
    insertFn() {
      console.log(1)
    }
  },
}
</script>

<style lang="scss" scoped>
.choice-tree{
  margin-top: 8px;
  margin-bottom: 8px;
  border: 1px solid #D3D3D3;
  padding-right: 10px;
  padding-bottom: 10px;
  overflow-y: scroll;
  max-height: 200px;
}
.file-task{
  display: flex;
  align-items: center;
  height: 100%;
}
.task-left {
  background: #707070;
  height: 100%;
  width: 44%;
  display: flex;
  flex-direction: column;
  min-width: 540px;
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
      white-space: nowrap;
      img {
        width: 25px;
        margin-right: 10px;
      }
    }
  }
}
.task-list{
  flex: 0.99;
  height: 100%;
  overflow: hidden;
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
    font-size: 14px;
    color: #373737;
    span{
      padding-right: 6px;
      font-size: 12px;
      color: #707070;
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
    &:first-child{
      width: 80px;
    }
    &:last-child{
      width: 80px;
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
  .taskNode{
    width: 100%;
  }
  
  .task-custom{
    display: flex;
    align-items: center;
    p {
      font-size: 16px;
      color: #373737;
      flex: 0.6;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 120px;
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
      min-width: 70px;
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
      min-width: 100px;
      color: #707070;
      font-size: 16px;
      img {
        height: 25px;
        margin-right: 6px;
      }
      article{
        max-width: 70px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
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
.task-right{
  height: 100%;
  width: 60%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.right-head{
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0d7d7;
  color: #373737;
  font-size: 16px;
  padding-left: 20px;
}
.right-operation{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 8px 30px 8px 20px;
}
.right-states{
    cursor: pointer;
  .examine-link{
    white-space: nowrap;
    display: flex;
    align-items: center;
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
      span{
        padding-right: 5px;
      }
    }
  }
}
.statesCla{
  display: flex;
  align-items: center;
  padding: 0 30px;
  line-height: 30px;
    &:nth-child(4) {
      img {
        height: 22px;
      }
    }
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
  padding-left: 20px;
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
            font-size: 14px;
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
    padding:0 20px;
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
.right-sTime .el-date-editor.el-input {
  width: 140px;
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
.right-eTime .el-input__inner{
    border: 0;
  }
.right-eTime .el-date-editor.el-input {
  width: 140px;
}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
  background: #fff;
}

  .task-tree .el-tree-node .el-tree-node__content {
    height: 46px;
    margin-top: 0px;
    border-bottom: 1px solid #d9d8d8;
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
    min-width: 100px;
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