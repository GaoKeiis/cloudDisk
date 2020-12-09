<template>
  <div class="implement">
    <div class="implement-head">
      <ul>
        <li
          v-for="(item, ind) in headArr"
          :key="ind"
          :class="headInd == ind ? 'headActive':''"
          @click="headClick(ind)"
        >{{ item }}</li>
      </ul>
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
    <div class="condition-head">
        <p v-for="(item,ind) in conditionArr" :key="ind">
          {{ item.name }}
          <span>{{item.len}}/10</span>
        </p>
      </div>
    <div class="implement-condition">
      <div class="implement-list">
        <div class="implement-card">
          <div v-for="(item,ind) in taskExcutionArr.tasksTimeSeven" :key="ind" >
            <el-card class="box-card">
              <h6>{{ item.name }}</h6>
              <div class="implement-item">
                <div class="implement-flex">
                  <el-popover
                    placement="bottom-start"
                    v-model="item.implementstart"
                    popper-class="implement-popover"
                    trigger="click">
                    <ul>
                      <li v-for="(items,inds) in citiesArr" :key="inds" @click="popoverFn(ind,inds,item)">
                        <img :src="items.imgUrl">
                        {{ items.label }}
                      </li>
                    </ul>
                    
                    <div class="popoverItem"  slot="reference" v-if="item.status == 2">
                      <img src="../../assets/complete.svg" style="height: 20px;">
                      <span style="color:#006957;padding-right:10px;">完成</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-else-if="item.status == 3">
                      <img src="../../assets/havehand.png">
                      <span style="color:#FA5C0C;">进行中</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-if="item.status == 1">
                      <img src="../../assets/Underreview.png">
                      <span style="color:#FA3E54;">审核中</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-if="item.status == 0">
                      <img src="../../assets/hangair.png">
                      <span style="color:rgb(143 143 143);">未开始</span>
                    </div>
                  </el-popover>
                  
                    <div class="implement-level"  @click="dialogClack(item)" v-if="item.level == 0">
                     A
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 1">
                     B
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 2">
                     C
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 3">
                     D
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 4">
                     E
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 5">
                     F
                    </div>
                </div>
              </div>
              <div class="implement-time">
                <span v-if="item.startTime">{{ item.startTime.split(' ')[0].split('-')[1] }}月{{ item.startTime.split(' ')[0].split('-')[2] }}日  -  </span>
                <span v-else style="visibility: hidden;">10年20月 - </span>
                <span v-if="item.endTime">{{ item.endTime.split(' ')[0].split('-')[1] }}月{{ item.endTime.split(' ')[0].split('-')[2] }}日</span>
                <span v-else style="visibility: hidden;">10年31月</span>
              </div>
          </el-card>
          </div>
        </div>
        <div class="implement-card">
           <div v-for="(item,ind) in taskExcutionArr.tasksTimeThree" :key="ind">
            <el-card class="box-card">
              <h6>{{ item.name }}</h6>
              <div class="implement-item">
                <div class="implement-flex">
                  <el-popover
                    placement="bottom-start"
                    v-model="item.implementstart"
                    popper-class="implement-popover"
                    trigger="click">
                    <ul>
                      <li v-for="(items,inds) in citiesArr" :key="inds" @click="popoverFn(ind,inds,item)">
                        <img :src="items.imgUrl">
                        {{ items.label }}
                      </li>
                    </ul>
                    
                    <div class="popoverItem"  slot="reference" v-if="item.status == 2">
                      <img src="../../assets/complete.svg" style="height: 20px;">
                      <span style="color:#006957;padding-right:10px;">完成</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-else-if="item.status == 3">
                      <img src="../../assets/havehand.png">
                      <span style="color:#FA5C0C;">进行中</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-if="item.status == 1">
                      <img src="../../assets/Underreview.png">
                      <span style="color:#FA3E54;">审核中</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-if="item.status == 0">
                      <img src="../../assets/hangair.png">
                      <span style="color:rgb(143 143 143);">未开始</span>
                    </div>
                  </el-popover>
                  
                    <div class="implement-level"  @click="dialogClack(item)" v-if="item.level == 0">
                     A
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 1">
                     B
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 2">
                     C
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 3">
                     D
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 4">
                     E
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 5">
                     F
                    </div>
                </div>
              </div>
              <div class="implement-time">
                <span v-if="item.startTime">{{ item.startTime.split(' ')[0].split('-')[1] }}月{{ item.startTime.split(' ')[0].split('-')[2] }}日  -  </span>
                <span v-else style="visibility: hidden;">10年20月 - </span>
                <span v-if="item.endTime">{{ item.endTime.split(' ')[0].split('-')[1] }}月{{ item.endTime.split(' ')[0].split('-')[2] }}日</span>
                <span v-else style="visibility: hidden;">10年31月</span>
              </div>
          </el-card>
          </div>
        </div>
        <div class="implement-card">
           <div v-for="(item,ind) in taskExcutionArr.tasksTimeOther" :key="ind">
            <el-card class="box-card">
              <h6>{{ item.name }}</h6>
              <div class="implement-item">
                <div class="implement-flex">
                  <el-popover
                    placement="bottom-start"
                    v-model="item.implementstart"
                    popper-class="implement-popover"
                    trigger="click">
                    <ul>
                      <li v-for="(items,inds) in citiesArr" :key="inds" @click="popoverFn(ind,inds,item)">
                        <img :src="items.imgUrl">
                        {{ items.label }}
                      </li>
                    </ul>
                    
                    <div class="popoverItem"  slot="reference" v-if="item.status == 2">
                      <img src="../../assets/complete.svg" style="height: 20px;">
                      <span style="color:#006957;padding-right:10px;">完成</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-else-if="item.status == 3">
                      <img src="../../assets/havehand.png">
                      <span style="color:#FA5C0C;">进行中</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-if="item.status == 1">
                      <img src="../../assets/Underreview.png">
                      <span style="color:#FA3E54;">审核中</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-if="item.status == 0">
                      <img src="../../assets/hangair.png">
                      <span style="color:rgb(143 143 143);">未开始</span>
                    </div>
                  </el-popover>
                  
                    <div class="implement-level"  @click="dialogClack(item)" v-if="item.level == 0">
                     A
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 1">
                     B
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 2">
                     C
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 3">
                     D
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 4">
                     E
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 5">
                     F
                    </div>
                </div>
              </div>
              <div class="implement-time">
                <span v-if="item.startTime">{{ item.startTime.split(' ')[0].split('-')[1] }}月{{ item.startTime.split(' ')[0].split('-')[2] }}日  -  </span>
                <span v-else style="visibility: hidden;">10年20月 - </span>
                <span v-if="item.endTime">{{ item.endTime.split(' ')[0].split('-')[1] }}月{{ item.endTime.split(' ')[0].split('-')[2] }}日</span>
                <span v-else style="visibility: hidden;">10年31月</span>
              </div>
          </el-card>
          </div>
        </div>
        <div class="implement-card">
          <div v-for="(item,ind) in taskExcutionArr.tasksStatusIng" :key="ind">
            <el-card class="box-card">
              <h6>{{ item.name }}</h6>
              <div class="implement-item">
                <div class="implement-flex">
                  <el-popover
                    placement="bottom-start"
                    v-model="item.implementstart"
                    popper-class="implement-popover"
                    trigger="click">
                    <ul>
                      <li v-for="(items,inds) in citiesArr" :key="inds" @click="popoverFn(ind,inds,item)">
                        <img :src="items.imgUrl">
                        {{ items.label }}
                      </li>
                    </ul>
                    
                    <div class="popoverItem"  slot="reference" v-if="item.status == 2">
                      <img src="../../assets/complete.svg" style="height: 20px;">
                      <span style="color:#006957;padding-right:10px;">完成</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-else-if="item.status == 3">
                      <img src="../../assets/havehand.png">
                      <span style="color:#FA5C0C;">进行中</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-if="item.status == 1">
                      <img src="../../assets/Underreview.png">
                      <span style="color:#FA3E54;">审核中</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-if="item.status == 0">
                      <img src="../../assets/hangair.png">
                      <span style="color:rgb(143 143 143);">未开始</span>
                    </div>
                  </el-popover>
                  
                    <div class="implement-level"  @click="dialogClack(item)" v-if="item.level == 0">
                     A
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 1">
                     B
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 2">
                     C
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 3">
                     D
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 4">
                     E
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 5">
                     F
                    </div>
                </div>
              </div>
              <div class="implement-time">
                <span v-if="item.startTime">{{ item.startTime.split(' ')[0].split('-')[1] }}月{{ item.startTime.split(' ')[0].split('-')[2] }}日  -  </span>
                <span v-else style="visibility: hidden;">10年20月 - </span>
                <span v-if="item.endTime">{{ item.endTime.split(' ')[0].split('-')[1] }}月{{ item.endTime.split(' ')[0].split('-')[2] }}日</span>
                <span v-else style="visibility: hidden;">10年31月</span>
              </div>
          </el-card>
          </div>
        </div>
        <div class="implement-card">
           <div v-for="(item,ind) in taskExcutionArr.tasksStatusEnd" :key="ind">
            <el-card class="box-card">
              <h6>{{ item.name }}</h6>
              <div class="implement-item">
                <div class="implement-flex">
                  <el-popover
                    placement="bottom-start"
                    v-model="item.implementstart"
                    popper-class="implement-popover"
                    trigger="click">
                    <ul>
                      <li v-for="(items,inds) in citiesArr" :key="inds" @click="popoverFn(ind,inds,item)">
                        <img :src="items.imgUrl">
                        {{ items.label }}
                      </li>
                    </ul>
                    
                    <div class="popoverItem"  slot="reference" v-if="item.status == 2">
                      <img src="../../assets/complete.svg" style="height: 20px;">
                      <span style="color:#006957;padding-right:10px;">完成</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-else-if="item.status == 3">
                      <img src="../../assets/havehand.png">
                      <span style="color:#FA5C0C;">进行中</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-if="item.status == 1">
                      <img src="../../assets/Underreview.png">
                      <span style="color:#FA3E54;">审核中</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-if="item.status == 0">
                      <img src="../../assets/hangair.png">
                      <span style="color:rgb(143 143 143);">未开始</span>
                    </div>
                  </el-popover>
                  
                    <div class="implement-level"  @click="dialogClack(item)" v-if="item.level == 0">
                     A
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 1">
                     B
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 2">
                     C
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 3">
                     D
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 4">
                     E
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 5">
                     F
                    </div>
                </div>
              </div>
              <div class="implement-time">
                <span v-if="item.startTime">{{ item.startTime.split(' ')[0].split('-')[1] }}月{{ item.startTime.split(' ')[0].split('-')[2] }}日  -  </span>
                <span v-else style="visibility: hidden;">10年20月 - </span>
                <span v-if="item.endTime">{{ item.endTime.split(' ')[0].split('-')[1] }}月{{ item.endTime.split(' ')[0].split('-')[2] }}日</span>
                <span v-else style="visibility: hidden;">10年31月</span>
              </div>
          </el-card>
          </div>
        </div>
        <div class="implement-card">
          <div v-for="(item,ind) in taskExcutionArr.tasksStatusStart" :key="ind">
            <el-card class="box-card">
              <h6>{{ item.name }}</h6>
              <div class="implement-item">
                <div class="implement-flex">
                  <el-popover
                    placement="bottom-start"
                    v-model="item.implementstart"
                    popper-class="implement-popover"
                    trigger="click">
                    <ul>
                      <li v-for="(items,inds) in citiesArr" :key="inds" @click="popoverFn(ind,inds,item)">
                        <img :src="items.imgUrl">
                        {{ items.label }}
                      </li>
                    </ul>
                    
                    <div class="popoverItem"  slot="reference" v-if="item.status == 2">
                      <img src="../../assets/complete.svg" style="height: 20px;">
                      <span style="color:#006957;padding-right:10px;">完成</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-else-if="item.status == 3">
                      <img src="../../assets/havehand.png">
                      <span style="color:#FA5C0C;">进行中</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-if="item.status == 1">
                      <img src="../../assets/Underreview.png">
                      <span style="color:#FA3E54;">审核中</span>
                    </div>
                    <div class="popoverItem" slot="reference" v-if="item.status == 0">
                      <img src="../../assets/hangair.png">
                      <span style="color:rgb(143 143 143);">未开始</span>
                    </div>
                  </el-popover>
                  
                    <div class="implement-level"  @click="dialogClack(item)" v-if="item.level == 0">
                     A
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 1">
                     B
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 2">
                     C
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 3">
                     D
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 4">
                     E
                    </div>
                    <div class="implement-level"  @click="dialogClack(item)" v-else-if="item.level == 5">
                     F
                    </div>
                </div>
              </div>
              <div class="implement-time">
                <span v-if="item.startTime">{{ item.startTime.split(' ')[0].split('-')[1] }}月{{ item.startTime.split(' ')[0].split('-')[2] }}日  -  </span>
                <span v-else style="visibility: hidden;">10年20月 - </span>
                <span v-if="item.endTime">{{ item.endTime.split(' ')[0].split('-')[1] }}月{{ item.endTime.split(' ')[0].split('-')[2] }}日</span>
                <span v-else style="visibility: hidden;">10年31月</span>
              </div>
          </el-card>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogVal"
      :visible.sync="dialogVisible"
      class="abow_dialog"
      lock-scroll
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
              v-for="item in citiesPops"
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
                v-for="item in levelArrs"
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
                        <span v-for="(items,ind) in data.roles" :key='ind' style="padding-right: 8px;">{{items}}</span>
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
                    <br />
                    <span v-for="(items,ind) in data.roles" :key='ind' style="padding-right: 8px;">{{items}}</span>
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
  getTaskUpdate,
  //  eslint-disable-next-line
  getUsers,
  getSelectUser,
  getTaskPartnerCreate,
  getTaskPartnerList,
  getTaskPartnerDelete,
  getTaskPaint,
  getPaintIamPartner
} from '@/apis/api'
export default {
  components: {
    leaving,activity,taskfiles,taskreview,subtask
  },
  data() {
    return {
      handleStr:[],
      dialogVal: '',
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
      tabInd: 0,
      participantsArr:[],
      jurisdData:[],
      jurisdProps: {
        children: 'children',
        label: 'realName'
      },
      sTime: '',
      eTime: '',
      rightPerson: false,
      choicePerson: false,
      rightpersonImg: require("../../assets/person-icon.png"),
      pickerOptions: this.pickerStartDate(),
      dialogVisible: false,
      headInd: 0,
      popoverItem: '进行中',
      conditionsearch: '',
       choiceText: '',
       rightText: '',
       rightProps: {
        children: 'children',
        label: 'realName'
      },
      rightData:[],
      popoverStr:{
        name: '进行中',
        imgUrl: require("../../assets/havehand.png")
      },
      headArr: ['全部任务', '我创建的', '我负责的', '我参与的'],
      conditionArr: [
        {
          name:'7日内要完成',
        },
        {
          name:'3日内要完成',
        },
        {
          name:'其他进行中的',
        },
        {
          name:'审核中',
        },
        {
          name:'已完成',
        },
        {
          name:'未开始',
        },
      ],
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
      citiesArr: [
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
      citiesColor: ['#C5C5C5','#FA5C0C','#FA3E54','#00A287'],
      levevalue: '全部级别',
      values: '全部状态',
      taskLink: 'C',
      statesItem: {
        imgUrl: require("../../assets/hangair.png"),
        label: '未开始'
      },
      eTimeTrue: false,
      technologicalLink: '未审核',
      rightpersonVal: '负责人',
      leaderIdStrs:'',
      taskExcutionArr: '',
      tasksTimeSevens:'',
      tasksTimeThrees:'',
      tasksTimeOthers:'',
      tasksStatusIngs:'',
      tasksStatusEnds:'',
      tasksStatusStarts:'',
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
      detailsTabselect: [
          require('../../assets/communication-select.png'),
          require('../../assets/subtask-select.png'),
          require('../../assets/task-file-select.png'),
          require('../../assets/task-review-select.png'),
          require('../../assets/activity-select.png')
      ],
    }
  },
  watch: {
    conditionsearch(val) {
      if(val && this.values !='全部状态' && this.levevalue !='全部级别'){
        this.taskExcutionArr.tasksTimeSeven = this.tasksTimeSevens.filter(item => item.level == this.levevalue && item.status == this.values && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksTimeThree = this.tasksTimeThrees.filter(item =>  item.level == this.levevalue && item.status == this.values && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksTimeOther = this.tasksTimeOthers.filter(item =>  item.level == this.levevalue && item.status == this.values && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusIng = this.tasksStatusIngs.filter(item =>  item.level == this.levevalue && item.status == this.values && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusEnd = this.tasksStatusEnds.filter(item =>  item.level == this.levevalue && item.status == this.values && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusStart = this.tasksStatusStarts.filter(item =>  item.level == this.levevalue && item.status == this.values && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
      } else if(val && this.values !='全部状态' ) {
        this.taskExcutionArr.tasksTimeSeven = this.tasksTimeSevens.filter(item =>item.status == this.values && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksTimeThree = this.tasksTimeThrees.filter(item => item.status == this.values && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksTimeOther = this.tasksTimeOthers.filter(item => item.status == this.values && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusIng = this.tasksStatusIngs.filter(item => item.status == this.values && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusEnd = this.tasksStatusEnds.filter(item => item.status == this.values && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusStart = this.tasksStatusStarts.filter(item => item.status == this.values && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
      } else if(val && this.levevalue !='全部级别' ) {
          this.taskExcutionArr.tasksTimeSeven = this.tasksTimeSevens.filter(item => item.level == this.levevalue && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksTimeThree = this.tasksTimeThrees.filter(item =>  item.level == this.levevalue && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksTimeOther = this.tasksTimeOthers.filter(item =>  item.level == this.levevalue && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusIng = this.tasksStatusIngs.filter(item =>  item.level == this.levevalue && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusEnd = this.tasksStatusEnds.filter(item =>  item.level == this.levevalue && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusStart = this.tasksStatusStarts.filter(item =>  item.level == this.levevalue && item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
      } else if(val) {
        this.taskExcutionArr.tasksTimeSeven = this.tasksTimeSevens.filter(item =>item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksTimeThree = this.tasksTimeThrees.filter(item => item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksTimeOther = this.tasksTimeOthers.filter(item => item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusIng = this.tasksStatusIngs.filter(item => item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusEnd = this.tasksStatusEnds.filter(item => item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusStart = this.tasksStatusStarts.filter(item => item.name.toLowerCase().indexOf(val.toLowerCase())>=0);
      } else {
        this.getTaskPaintFn()
      }
      this.conditionArr.map((item) =>{
        if(item.name == '7日内要完成') {
          item.len = this.taskExcutionArr.tasksTimeSeven.length
        } else if(item.name == '3日内要完成') {
          item.len = this.taskExcutionArr.tasksTimeThree.length
        } else if(item.name == '其他进行中的') {
          item.len = this.taskExcutionArr.tasksTimeOther.length
        } else if(item.name == '审核中') {
          item.len = this.taskExcutionArr.tasksStatusIng.length
        } else if(item.name == '已完成') {
          item.len = this.taskExcutionArr.tasksStatusEnd.length
        } else if(item.name == '未开始') {
          item.len = this.taskExcutionArr.tasksStatusStart.length
        }
      })
    },
    rightText(val) {
      this.$refs.rightTree.filter(val);
    },
    values(val) {
      if(val && this.conditionsearch && this.levevalue !='全部级别' && this.levevalue){
        this.taskExcutionArr.tasksTimeSeven = this.tasksTimeSevens.filter(item => item.status == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0 && item.level == this.levevalue);
        this.taskExcutionArr.tasksTimeThree = this.tasksTimeThrees.filter(item => item.status == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0 && item.level == this.levevalue);
        this.taskExcutionArr.tasksTimeOther = this.tasksTimeOthers.filter(item => item.status == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0 && item.level == this.levevalue);
        this.taskExcutionArr.tasksStatusIng = this.tasksStatusIngs.filter(item => item.status == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0 && item.level == this.levevalue);
        this.taskExcutionArr.tasksStatusEnd = this.tasksStatusEnds.filter(item => item.status == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0 && item.level == this.levevalue);
        this.taskExcutionArr.tasksStatusStart = this.tasksStatusStarts.filter(item => item.status == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0 && item.level == this.levevalue);
      } else if(val && this.levevalue !='全部级别' && this.levevalue){
        this.taskExcutionArr.tasksTimeSeven = this.tasksTimeSevens.filter(item => item.status == val && item.level == this.levevalue);
        this.taskExcutionArr.tasksTimeThree = this.tasksTimeThrees.filter(item => item.status == val && item.level == this.levevalue);
        this.taskExcutionArr.tasksTimeOther = this.tasksTimeOthers.filter(item => item.status == val && item.level == this.levevalue);
        this.taskExcutionArr.tasksStatusIng = this.tasksStatusIngs.filter(item => item.status == val && item.level == this.levevalue);
        this.taskExcutionArr.tasksStatusEnd = this.tasksStatusEnds.filter(item => item.status == val && item.level == this.levevalue);
        this.taskExcutionArr.tasksStatusStart = this.tasksStatusStarts.filter(item => item.status == val && item.level == this.levevalue);
      } else if(val && this.conditionsearch){
        this.taskExcutionArr.tasksTimeSeven = this.tasksTimeSevens.filter(item => item.status == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksTimeThree = this.tasksTimeThrees.filter(item => item.status == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksTimeOther = this.tasksTimeOthers.filter(item => item.status == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusIng = this.tasksStatusIngs.filter(item => item.status == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusEnd = this.tasksStatusEnds.filter(item => item.status == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusStart = this.tasksStatusStarts.filter(item => item.status == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
      } else if(val){
        this.taskExcutionArr.tasksTimeSeven = this.tasksTimeSevens.filter(item => item.status == val);
        this.taskExcutionArr.tasksTimeThree = this.tasksTimeThrees.filter(item => item.status == val);
        this.taskExcutionArr.tasksTimeOther = this.tasksTimeOthers.filter(item => item.status == val);
        this.taskExcutionArr.tasksStatusIng = this.tasksStatusIngs.filter(item => item.status == val);
        this.taskExcutionArr.tasksStatusEnd = this.tasksStatusEnds.filter(item => item.status == val);
        this.taskExcutionArr.tasksStatusStart = this.tasksStatusStarts.filter(item => item.status == val);
      } else {
        this.getTaskPaintFn()
      }
      this.conditionArr.map((item) =>{
        if(item.name == '7日内要完成') {
          item.len = this.taskExcutionArr.tasksTimeSeven.length
        } else if(item.name == '3日内要完成') {
          item.len = this.taskExcutionArr.tasksTimeThree.length
        } else if(item.name == '其他进行中的') {
          item.len = this.taskExcutionArr.tasksTimeOther.length
        } else if(item.name == '审核中') {
          item.len = this.taskExcutionArr.tasksStatusIng.length
        } else if(item.name == '已完成') {
          item.len = this.taskExcutionArr.tasksStatusEnd.length
        } else if(item.name == '未开始') {
          item.len = this.taskExcutionArr.tasksStatusStart.length
        }
      })
    },
    levevalue(val) {
     if(val && this.conditionsearch && this.values !='全部状态' && this.values) {
        this.taskExcutionArr.tasksTimeSeven = this.tasksTimeSevens.filter(item => item.level == val && item.status == this.values && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksTimeThree = this.tasksTimeThrees.filter(item => item.level == val && item.status == this.values && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksTimeOther = this.tasksTimeOthers.filter(item => item.level == val && item.status == this.values && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusIng = this.tasksStatusIngs.filter(item => item.level == val && item.status == this.values && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusEnd = this.tasksStatusEnds.filter(item => item.level == val && item.status == this.values && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusStart = this.tasksStatusStarts.filter(item => item.level == val && item.status == this.values && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
      } else if(val && this.values !='全部状态' && this.values){
        this.taskExcutionArr.tasksTimeSeven = this.tasksTimeSevens.filter(item => item.level == val && item.status == this.values);
        this.taskExcutionArr.tasksTimeThree = this.tasksTimeThrees.filter(item => item.level == val && item.status == this.values);
        this.taskExcutionArr.tasksTimeOther = this.tasksTimeOthers.filter(item => item.level == val && item.status == this.values);
        this.taskExcutionArr.tasksStatusIng = this.tasksStatusIngs.filter(item => item.level == val && item.status == this.values);
        this.taskExcutionArr.tasksStatusEnd = this.tasksStatusEnds.filter(item => item.level == val && item.status == this.values);
        this.taskExcutionArr.tasksStatusStart = this.tasksStatusStarts.filter(item => item.level == val && item.status == this.values);
      } else if(val && this.conditionsearch){
         this.taskExcutionArr.tasksTimeSeven = this.tasksTimeSevens.filter(item => item.level == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksTimeThree = this.tasksTimeThrees.filter(item => item.level == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksTimeOther = this.tasksTimeOthers.filter(item => item.level == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusIng = this.tasksStatusIngs.filter(item => item.level == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusEnd = this.tasksStatusEnds.filter(item => item.level == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
        this.taskExcutionArr.tasksStatusStart = this.tasksStatusStarts.filter(item => item.level == val && item.name.toLowerCase().indexOf(this.conditionsearch.toLowerCase())>=0);
      } else if(val){
        this.taskExcutionArr.tasksTimeSeven = this.tasksTimeSevens.filter(item => item.level == val);
        this.taskExcutionArr.tasksTimeThree = this.tasksTimeThrees.filter(item => item.level == val);
        this.taskExcutionArr.tasksTimeOther = this.tasksTimeOthers.filter(item => item.level == val);
        this.taskExcutionArr.tasksStatusIng = this.tasksStatusIngs.filter(item => item.level == val);
        this.taskExcutionArr.tasksStatusEnd = this.tasksStatusEnds.filter(item => item.level == val);
        this.taskExcutionArr.tasksStatusStart = this.tasksStatusStarts.filter(item => item.level == val);
      } else {
        this.getTaskPaintFn()
      }
      this.conditionArr.map((item) =>{
        if(item.name == '7日内要完成') {
          item.len = this.taskExcutionArr.tasksTimeSeven.length
        } else if(item.name == '3日内要完成') {
          item.len = this.taskExcutionArr.tasksTimeThree.length
        } else if(item.name == '其他进行中的') {
          item.len = this.taskExcutionArr.tasksTimeOther.length
        } else if(item.name == '审核中') {
          item.len = this.taskExcutionArr.tasksStatusIng.length
        } else if(item.name == '已完成') {
          item.len = this.taskExcutionArr.tasksStatusEnd.length
        } else if(item.name == '未开始') {
          item.len = this.taskExcutionArr.tasksStatusStart.length
        }
      })
    },
    choiceText(val) {
      this.$refs.choiceTree.filter(val);
    },
  },
  created(){
  },
  mounted(){
    this.getUsersFn()
    window.eventBus.$on("ToupdateData",()=>{
      this.getTaskPaintFn()
    });
    this.getTaskPaintFn()
  },
  methods: {
    getTaskPaintFn(inds) {
      getTaskPaint({type:inds}).then((res)=>{
        if(res.data.code == 200) {
          if( res.data.data) {
            this.taskExcutionArr = res.data.data
            this.selectUserFn(res.data.data.tasksTimeSeven)
            this.selectUserFn(res.data.data.tasksTimeThree)
            this.selectUserFn(res.data.data.tasksTimeOther)
            this.selectUserFn(res.data.data.tasksStatusIng)
            this.selectUserFn(res.data.data.tasksStatusEnd)
            this.selectUserFn(res.data.data.tasksStatusStart)
            this.tasksTimeSevens = Object.assign(this.taskExcutionArr.tasksTimeSeven);
            this.tasksTimeThrees = Object.assign(this.taskExcutionArr.tasksTimeThree);
            this.tasksTimeOthers = Object.assign(this.taskExcutionArr.tasksTimeOther);
            this.tasksStatusIngs = Object.assign(this.taskExcutionArr.tasksStatusIng);
            this.tasksStatusEnds = Object.assign(this.taskExcutionArr.tasksStatusEnd);
            this.tasksStatusStarts = Object.assign(this.taskExcutionArr.tasksStatusStart);
            this.conditionArr.map((item) =>{
              if(item.name == '7日内要完成') {
                item.len = res.data.data.tasksTimeSeven.length
              } else if(item.name == '3日内要完成') {
                item.len = res.data.data.tasksTimeThree.length
              } else if(item.name == '其他进行中的') {
                item.len = res.data.data.tasksTimeOther.length
              } else if(item.name == '审核中') {
                item.len = res.data.data.tasksStatusIng.length
              } else if(item.name == '已完成') {
                item.len = res.data.data.tasksStatusEnd.length
              } else if(item.name == '未开始') {
                item.len = res.data.data.tasksStatusStart.length
              }
            })
          } else {
            this.taskExcutionArr = ''
            this.conditionArr.map((item) =>{
              if(item.name == '7日内要完成') {
                item.len = 0
              } else if(item.name == '3日内要完成') {
                item.len = 0
              } else if(item.name == '其他进行中的') {
                item.len =0
              } else if(item.name == '审核中') {
                item.len = 0
              } else if(item.name == '已完成') {
                item.len =0
              } else if(item.name == '未开始') {
                item.len = 0
              }
            })
          }
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    selectUserFn(data) {
      data.map((item)=>{
        getSelectUser({userIdStr:item.leaderIdStr}).then((res)=>{
          if(res.data.code == 200) {
            item.person = res.data.data.realName
            item.imgUrl = res.data.data.bigImgUrl
            item.roles = res.data.data.roles
            item.sex = res.data.data.sex
          } else {
            this.$message.error(res.data.message);
          }
        })
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
     participantsFn() {
      getTaskPartnerList({taskId:this.handleStr.id}).then((res)=>{
        if(res.data.code == 200) {
          let userArr = [];
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
    
    unarrque(arrInfo) {
    let newobj = {};
      arrInfo = arrInfo.reduce (function(item,next){
      newobj[next.namr] ? ' ' : newobj[next.namr]  = true && item.push(next)
      return item;
      },[])
      return arrInfo
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
   overPants(ind) {
      $('.participants-list li').eq(ind).find(".deleteImg").css('visibility','visible')
    },
    outPants(ind) {
      $('.participants-list li').eq(ind).find(".deleteImg").css('visibility',' hidden')
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
      this.citiesPops.map((item)=>{
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
          this.getTaskPaintFn()
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
          this.getTaskPaintFn()
        } else {
          this.$message.error(res.data.message);
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
            this.getTaskPaintFn()
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
            this.getTaskPaintFn()
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
            this.getTaskPaintFn()
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
    rightfilter(value, data) { // 权限搜索按钮
      if (!value) return true;
      return data.fileName.indexOf(value) !== -1;
    },
    choicefilter(value, data) { // 权限搜索按钮
      if (!value) return true;
      return data.fileName.indexOf(value) !== -1;
    },
    dialogClack(data) {
      this.rightPerson = false;
      this.handleStr = {
        descreption: data.descreption,
        id: data.id,
        folderId:data.folderId
      }
      window.eventBus.$emit("handleNode",{
          descreption: data.descreption,
          id: data.id
      });
      this.levelArrs.map((item)=>{
        if(item.value == data.level) {
          this.taskLink = item.label.split("")[0];
        }
      })
      this.sTime = data.startTime
      this.eTime = data.endTime
      this.dialogVal = data.name
      this.dialogVisible = true;
      this.choicePerson = false;
      this.rightpersonVal = data.person+ ';' +JSON.stringify(data.roles)+ ';' +data.sex;
      this.rightpersonImg = data.imgUrl
      this.participantsFn()
      this.leaderIdStrs = data.leaderIdStr
      this.citiesPops.map((item)=>{
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
      });
    },
    popoverFn(ind,inds,popoIs) {
      let dto = {
        status:this.citiesArr[inds].value,
        id: popoIs.id
      }
      getTaskUpdate(dto).then((res)=>{
        if(res.data.code == 200) {
          popoIs.implementstart = false
          $('.popoverItem').eq(ind).find('img').attr('src', this.citiesArr[inds].imgUrl)
          $('.popoverItem').eq(ind).find('span').text(this.citiesArr[inds].label).css('color', this.citiesColor[inds])
          this.getTaskPaintFn()
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    headClick(ind) {
      this.headInd = ind
       if(ind == 0) {
        this.getTaskPaintFn()
      } else if(ind == 3) {
        getPaintIamPartner().then((res)=>{
          if(res.data.code == 200) {
          if( res.data.data) {
            this.taskExcutionArr = res.data.data
            this.selectUserFn(res.data.data.tasksTimeSeven)
            this.selectUserFn(res.data.data.tasksTimeThree)
            this.selectUserFn(res.data.data.tasksTimeOther)
            this.selectUserFn(res.data.data.tasksStatusIng)
            this.selectUserFn(res.data.data.tasksStatusEnd)
            this.selectUserFn(res.data.data.tasksStatusStart)
              
            this.tasksTimeSevens = Object.assign(this.taskExcutionArr.tasksTimeSeven);
            this.tasksTimeThrees = Object.assign(this.taskExcutionArr.tasksTimeThree);
            this.tasksTimeOthers = Object.assign(this.taskExcutionArr.tasksTimeOther);
            this.tasksStatusIngs = Object.assign(this.taskExcutionArr.tasksStatusIng);
            this.tasksStatusEnds = Object.assign(this.taskExcutionArr.tasksStatusEnd);
            this.tasksStatusStarts = Object.assign(this.taskExcutionArr.tasksStatusStart);
            this.conditionArr.map((item) =>{
              if(item.name == '7日内要完成') {
                item.len = res.data.data.tasksTimeSeven.length
              } else if(item.name == '3日内要完成') {
                item.len = res.data.data.tasksTimeThree.length
              } else if(item.name == '其他进行中的') {
                item.len = res.data.data.tasksTimeOther.length
              } else if(item.name == '审核中') {
                item.len = res.data.data.tasksStatusIng.length
              } else if(item.name == '已完成') {
                item.len = res.data.data.tasksStatusEnd.length
              } else if(item.name == '未开始') {
                item.len = res.data.data.tasksStatusStart.length
              }
            })
          } else {
            this.taskExcutionArr = ''
            this.conditionArr.map((item) =>{
              if(item.name == '7日内要完成') {
                item.len = 0
              } else if(item.name == '3日内要完成') {
                item.len = 0
              } else if(item.name == '其他进行中的') {
                item.len =0
              } else if(item.name == '审核中') {
                item.len = 0
              } else if(item.name == '已完成') {
                item.len =0
              } else if(item.name == '未开始') {
                item.len = 0
              }
            })
          }
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
        this.getTaskPaintFn(ind)
      }
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
.implement{
  height: 100%;
  display: flex;
  flex-direction: column;
}
  .implement-head{
      background: #707070;
      display: flex;
      align-items: center;
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
    .el-select{
      margin-right: 5px;
    }
    .condition{
      width: 18vw;
    }
  }
.implement-condition{
  flex: 1;
  overflow-y: scroll;
}
/*滚动条样式*/
.implement-condition::-webkit-scrollbar {
    width: 4px;
}
.implement-condition::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px #70707080;
    background: #70707080;
}
.implement-condition::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px #DFDFDF;
    border-radius: 0;
    background:transparent;
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
  .task-exhibition{
    display: flex;
    align-items: center;
    flex: 1;
  }
.condition-head{
  display: flex;
  padding: 16px 16px;
  p {
    flex: 1;
    margin-left: 10px;
    font-size: 14px;
    color: #707070;
  }
}
.implement-list {
  padding-left: 16px;
  display: flex;
  .implement-card{
    flex: 1;
    margin-right: 20px;
  }
}
.box-card {
  margin-bottom: 14px;
  h6{
    color: #373737;
    font-size: 14px;
  }
}
.implement-item{
  padding-top: 20px;
  .implement-flex {
    display: flex;
    align-items: center;
  }
  .popoverItem {
    display: flex;
    align-items: center;
    img {
      height: 20px;
    }
    span {
      padding-left: 8px;
      font-size: 18px;
      white-space: nowrap;
    }
  }
  .implement-level{
    font-size: 24px;
    color: #373737;
    padding-left: 30px;
    cursor: pointer;
  }
}
.implement-time{
  font-size: 14px;
    color: #373737;
    padding-top: 16px;
}
.implement-popover{
  ul{
    padding:0 20px;
    li {
      cursor: pointer;
      display: flex;
      align-items: center;
      line-height: 34px;
      font-size: 16px;
      img {
        height: 22px;
        margin-right: 8px;
      }
    }
  }
}
.task-right{
  height: 100%;
  width: 100%;
  margin-top: -30px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.right-head{
  height: 42px;
  line-height: 42px;
  border-bottom: 1px solid #e0d7d7;
  color: #373737;
  font-size: 16px;
  padding-left: 15px;
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
      height: 26px;
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
    cursor: pointer;
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
    padding-right: 10px;
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
  margin-bottom: 20px;
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
.jurisd-custom{
  display: flex;
  align-items: center;
  img {
    height: 25px;
    border-radius: 100%;
  }
  p{
    padding-left: 8px;
  }
}
</style>
<style>
.implement-popover{
  min-width: 0;
}
.implement-head .el-select .el-input__inner{
  background: #FA5C0C;
    color: #fff;
  border: 0;
    border-radius: 0;
    width: 5.4vw;
    min-width: 103px;
}
.implement-head .el-select .el-select__caret{
    color: #fff;
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