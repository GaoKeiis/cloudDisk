<template>
<div class="activity">
   <el-table
    :data="tableData"
    :height="tableHeight"
    v-loading = "pictLoading"
    element-loading-background = "rgba(0, 0, 0, 0.5)"
    element-loading-text = "数据正在加载中"
    element-loading-spinner = "el-icon-loading"
    ref="table"
    style="width: 100%">
        <el-table-column
          label="操作者">
          <template slot-scope="scope">
            <div class="operator-name">
              <img :src="scope.row.imgUrl">
              <p>
                {{ scope.row.userName }}
                <span>
                {{ scope.row.position }}</span>
              </p>
            </div>
          </template>
        </el-table-column>
      <el-table-column
          label="操作内容"
          prop="content">
      <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="scope">
            <div class="opencontent">
              <p>操作内容</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作时间"
          align="center"
          prop="createTime">
        </el-table-column>
  </el-table>
</div>
</template>

<script>

import { getResourceLog } from '@/apis/api'
import $ from 'jquery'
export default {
    name: 'activity',
    data() {
        return {
        opench:'',
        tableData: [],
        pictLoading: true,
        tableHeight: 50,
      };
    },
    mounted() {
      this.resource()
       this.$nextTick(()=> {
            if($(".abow_dialog .el-dialog").length>0) {
              $(".activity").height($(".abow_dialog .el-dialog").innerHeight()+200)
              this.tableHeight = '100%';
            } else {
              this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop-5;
            }
            // 监听窗口大小变化
            let self = this;
            window.onresize = function() {
              if($(".abow_dialog .el-dialog").length<=0) {
                if(self.$refs.table) {
                  self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop-5;
                }
              }
            }
        })
    },
    methods: {
      resource() {
        getResourceLog().then((res)=>{
            if(res.data.code == 200) {
              this.tableData = res.data.data;
              this.pictLoading = false
            } else {
              this.$message.error(res.data.message);
            }
          })
      }
    },
};
</script>

<style lang="scss" scope>
.activity {
  height: 75%;
  padding-left: 10px;
  .el-table--border{
    border: 0;
  }
  .el-table th.is-leaf{
        border-bottom: 1px solid #C5C5C5;
  }
  .el-table td{
    border-bottom: 1px solid #C5C5C5;
  }
}
.operator-name{
  display: flex;
  align-items: center;
  img {
    height: 36px;
    border-radius: 100%;
  }
  p {
    color: #373737;
    font-size: 14px;
        line-height: 18px;
    span{
      display: block;
      color: #707070;
      font-size: 12px;
    }
  }
}
</style>
