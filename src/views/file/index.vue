<template>
  <div style="height:100%;">
    <file-ind v-if="fileIndTrue"></file-ind>
    <member v-if="memberTrue"></member>
    <task v-if="taskTrue"></task>
    <gantt-chart v-if="ganttTrue"></gantt-chart>
    <file-speed v-show='speedTrue'></file-speed>
    <implement v-if='implementTrue'></implement>
  </div>
</template>


<script>
import fileInd from './fileInd';
import task from './task';
import member from './member';
import fileSpeed from './speed';
import ganttChart from './ganttChart';
import implement from './implement';
export default {
  name: 'Aside',
  components: {
      fileInd,task,member,fileSpeed,ganttChart,implement
  },
  data () {
    return {
      fileIndTrue: true,
      taskTrue: false,
      memberTrue: false,
      speedTrue: false,
      ganttTrue: false,
      implementTrue: false
    }
  },
  watch: {
    '$route' (to) {
      this.routerjudge(to.path)
    }
  },
  created() {
    this.routerjudge(this.$route.path)
  },
  methods: {
      routerjudge(paths) {
        if(paths == '/folder/file') {
            this.fileIndTrue = true
            this.taskTrue = false
            this.memberTrue = false
            this.speedTrue = false
            this.ganttTrue = false
            this.implementTrue = false
        } else if(paths == '/folder/1') {
            this.fileIndTrue = false
            this.taskTrue = false
            this.memberTrue = false
            this.speedTrue = true
            this.ganttTrue = false
            this.implementTrue = false
        } else if(paths == '/folder/2') {
            this.fileIndTrue = false
            this.taskTrue = true
            this.memberTrue = false
            this.speedTrue = false
            this.ganttTrue = false
            this.implementTrue = false
        } else if(paths == '/folder/3') {
            this.fileIndTrue = false
            this.taskTrue = false
            this.memberTrue = true
            this.speedTrue = false
            this.ganttTrue = false
            this.implementTrue = false
        } else if(paths == '/folder/4') {
            this.fileIndTrue = false
            this.taskTrue = false
            this.ganttTrue = true
            this.speedTrue = false
            this.memberTrue = false
            this.implementTrue = false
          } else if(paths == '/folder/5') {
            this.fileIndTrue = false
            this.taskTrue = false
            this.ganttTrue = false
            this.speedTrue = false
            this.memberTrue = false
            this.implementTrue = true
          }
      }
  }
}
</script>