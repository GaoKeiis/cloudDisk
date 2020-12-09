<template>
  <div class="file-record">
    <div class="record-head">
      <h6>操作记录</h6>
      <a @click="recordoff()">
        <img src="../../assets/recordoff.png">
      </a>
    </div>
    <div class="record-section">
      <el-table
        :data="tableData.filter(data => !opensearch || data.content.toLowerCase().includes(opensearch.toLowerCase()))"
        :height="tableHeight"
        v-loading = "pictLoading"
        element-loading-background = "rgba(0, 0, 0, 0.5)"
        element-loading-text = "数据正在加载中"
        element-loading-spinner = "el-icon-loading"
        ref="table"
        style="width: 100%;">
        <el-table-column
          label="操作者">
          <template slot-scope="scope">
            <div class="operator-name">
              <img v-if="scope.row.imgUrl" :src="scope.row.imgUrl">
              <img v-else src="../../assets/person-icon.png">
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
              <el-input
                suffix-icon="el-icon-search"
                size="small"
                v-model="opensearch"
                placeholder="搜索"
              >
              </el-input>
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
  </div>
</template>

<script>
import $ from 'jquery'
import { getResourceLog } from '@/apis/api'
  export default {
    props: ['recordId'],
    data() {
      return {
        opensearch: '',
        opench:'',
        tableData: [],
        pictLoading: true,
        tableHeight: 50,
      }
    },
    mounted() {
      window.eventBus.$on("recordPrpos",(record)=>{
        if(record.recordId) {
          this.resource()
        }
      });
        this.$nextTick(()=> {
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop;
            // 监听窗口大小变化
            let self = this;
            window.onresize = function() {
              if(self.$refs.table) {
                self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop
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
      },
      recordoff() {
        $('.secordNoe').hide();
        $('.file-list').css('display','flex');
        $(".file-all").css('height','98%')
      }
    },
  }
</script>

<style lang="scss" scoped>
.record-head{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  box-shadow: 0px 0px 6px #00000029;
  h6{
    color: #373737;
    font-size: 16px;
  }
  img {
    width: 20px;
    cursor: pointer;
  }
}
.opencontent{
  display: flex;
  align-items: center;
  p {
    white-space: nowrap;
    padding-right: 10px;
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
    padding-left: 10px;
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
<style>
.record-section .el-table th{
  background: #DFDFDF;
  color: #373737;
}
</style>