<template>
<div class="leaving">
  <div class="leaving-describe">
    <p>需求描述</p>
    <el-input type="textarea" v-model="desc" placeholder="输入任务描述"></el-input>
   <div v-if="desc" class="textareaBtn" @click="describeChange()">
      <span>
       确定
      </span>
   </div>
   <div v-else class="textareaBtn">
      <span style="background: rgb(245, 247, 250);color: rgb(112, 112, 112);">
       确定
      </span>
   </div>
  </div>
  <div class="input-leaving">
    <p>留言</p>
    <ul v-if="leavingList.length>0">
      <li v-for="(item,ind) in leavingList" :key="ind">
        <div class="leaving-list">
          <div class="leaving-left">
          <img v-if="item.imgUrl" :src="item.imgUrl">
          <img v-else src="../assets/person-icon.png">
          <div>
            <h6>{{ item.userName }}</h6>
            <p>{{ item.userRole }}</p>
            <time>{{ item.createTime }}</time>
          </div>
          </div>
          <div class="leaving-right" @click="taskdelete(item.id)">
            <img src="../assets/taskdelete.png">
          </div>
        </div>
        <p class="leaving-content">{{ item.content }}</p>
      </li>
    </ul>
    <div v-else class="LeavList">
      暂无留言
    </div>
    <div class="leavingBtn">
       <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="learea" placeholder="输入留言内容"></el-input>
      <span v-if="learea!=''" @click="leavingdete">留言</span>
      <span v-else style="background:#F5F7FA;color: #707070">留言</span>
      <span @click="leavingcancel">取消</span>
    </div>
  </div>
</div>
</template>

<script>

import {
  //  eslint-disable-next-line
  getTaskChatCreate,
  //  eslint-disable-next-line
  getTaskChatList,
  getTaskChatDelete,
  getTaskUpdate
} from '@/apis/api'
import $ from 'jquery'
export default {
    name: 'leaving',
    props:['handleStr'],
    data() {
        return {
          desc:'',
          learea: '',
          taskIds:'',
          leavingList:[]
        };
    },
    mounted() {
      this.taskIds = this.handleStr.id
        this.desc = this.handleStr.descreption
        this.taskChatListFn()
        
      this.$nextTick(()=> {
        // 监听窗口大小变化
        if($(".abow_dialog .el-dialog").length>0) {
          $(".input-leaving").height($(".abow_dialog .el-dialog").innerHeight())
        }
      })
      window.eventBus.$on("handleNode",(handle)=>{
        this.desc = handle.descreption
        this.taskIds = handle.id
        this.taskChatListFn()
      });
    },
    methods: {
      taskChatListFn() {
        getTaskChatList({taskId:this.taskIds}).then((res)=>{
          if(res.data.code == 200) {
            this.leavingList = res.data.data
          } else {
            this.$message.error(res.data.message);
          }
        })
      },
      taskdelete(chatId) { // 删除
        getTaskChatDelete({id:chatId}).then((res)=>{
          if(res.data.code == 200) {
            this.taskChatListFn()
            this.$message.success("删除成功");
          } else {
            this.$message.error(res.data.message);
          }
        })
      },
      leavingdete() {
        getTaskChatCreate({content:this.learea,taskId:this.taskIds}).then((res)=>{
          if(res.data.code == 200) {
            this.learea = '';
            this.taskChatListFn()
          } else {
            this.$message.error(res.data.message);
          }
        })
      },
      leavingcancel() {
        this.learea = ''
      },
      describeChange() {
        let dto = {
          descreption: this.desc,
          id: this.handleStr.id
        }
        getTaskUpdate(dto).then((res)=>{
          if(res.data.code == 200) {
            window.eventBus.$emit("ToupdateData",true);
          } else {
            this.$message.error(res.data.message);
          }
        })
      }
    },
};
</script>

<style lang="scss" scope>
.textareaBtn{
    text-align: right;
       margin-top: 19px;
    margin-bottom: 7px;
   span{
      font-size: 14px;
    cursor: pointer;
    background: #FA5C0C;
    color: #fff;
    padding: 6px 14px;
    width: 100px;
    margin-right: 10px;
   }
}
.leaving{
  display: flex;
  height: calc(100% - 200px);
  width: 100%;
  margin-bottom: 14px;
  padding: 0 15px;
}
.leaving-describe{
  width: 50%;
  display: flex;
  flex-direction: column;
  p {
    color: #373737;
    font-size: 14px;
    padding-bottom: 8px;
  }
  .el-textarea{
    flex: 1;
    textarea{
      height: 100%;
    }
  }
}
.input-leaving{
  width: 50%;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-right: 20px;
  p {
    color: #373737;
    font-size: 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid #373737;
  }
  ul {
    overflow-y: scroll;
    height: 100%;
    border-bottom: 1px solid #373737;
    margin-bottom: 10px;
    li{
      padding-top: 10px;
    }
  }
  .LeavList{
    overflow-y: scroll;
    height: 100%;
    border-bottom: 1px solid #373737;
    margin-bottom: 10px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.input-leaving ul::-webkit-scrollbar {
    width: 4px;    
}
.input-leaving ul::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px #70707080;
    background: #70707080;
}
.input-leaving ul::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px #DFDFDF;
    border-radius: 0;
    background:transparent;
}
.leaving-list {
  display: flex;
  justify-content: space-between;
  .leaving-left {
  display: flex;
    img {
      height: 35px;
    }
    div {
      padding-left: 8px;
      h6 {
        color: #373737;
        font-size: 14px;
        font-weight: 500;
      }
      p {
        font-size: 12px;
        color: #707070;
        padding-bottom: 0px;
        border-bottom: 0;
      }
      time{
        font-size: 12px;
        color: #C5C5C5;
      }
    }
  }
.leaving-right{
  img {
    height: 20px;
    cursor: pointer;
  }
}
}
.input-leaving .leaving-content{
  padding-top: 10px;
  padding-left: 40px;
  color: #373737;
  font-size: 16px;
  font-weight: 600;
  border-bottom:1px solid #DFDFDF;
}
.leavingBtn {
  span {
    margin-top: 14px;
    margin-bottom: 2px;
    display: inline-block;
    font-size: 14px;
    color: #707070;
    cursor: pointer;
    &:nth-child(2) {
      background: #FA5C0C;
      color: #fff;
      padding: 6px 14px;
      margin-right: 20px;
    }
  }
}
</style>
