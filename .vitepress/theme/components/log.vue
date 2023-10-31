<template>
  <div class="main">
    <div class="maintitle">
      <img class="img" src="/public/catear.gif" />
      <p>stillwarter搬砖日志</p>
    </div>

    <div class="expected">一周计划书（准备..）</div>
    <div class="expected">导出功能（准备..）</div>
    <div class="expected">解析功能（准备..）</div>

    <div class="log">
      <div class="logitem" v-for="(item,index) in worklog" :key="index">

        <div class="date">
          <p class="mouth" v-if="themouth<=9">
             0{{themouth}}-
          </p>
          <p class="mouth" v-else>
             {{themouth}}-
          </p>
          <p class="day" v-if="index<=8">
            0{{index+1}} 
          </p>
          <p class="day" v-else>
            {{index+1}}
          </p>
        </div>

        <div class="nomark" v-if="!item.iswork">
          <span style="font-family:'normal'">🈚</span>
          今天没有记录捏
        </div>
        
        <div class="workcontent" v-if="item.iswork">
          <div class="workitem" v-for="(citem,cindex) in item.workcontent" :key="cindex">
            <p class="worknmame">{{cindex+1}}.{{citem.name}}</p>
            <p class="workdes">
              {{citem.des}}
            </p>
            <div class="workaim" v-if="citem.aim">
              搬砖目标：{{citem.aim}}
            </div>

            <div class="workstatus" v-if="!citem.status">
              暂无更多内容...
            </div>

            <div class="workstatus" v-if="citem.status">
              现状：
              <p class="item" v-for="(sitem,sindex) in citem.status" :key="sindex">
                  {{sindex+1}}.{{sitem}}
              </p>
            </div>

            <div class="worktodo" v-if="citem.todo">
              预想：
              <p class="item" v-for="(titem,tindex) in citem.todo" :key="tindex">
                  {{tindex+1}}.{{titem}}
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {worklog} from "./data/log.js"
const themouth=ref('')
themouth.value=new Date().getMonth()+1


</script>

<style lang="less" scoped>
.main{
  padding:12px;
  padding-top:0;
  font-family: "catbite";
  margin-bottom:100px;
  .maintitle {
    
    max-width: calc(var(--vp-layout-max-width) - 64px);
    display: flex;
    align-items: center;
    padding: 0 20px;
    margin: 0 auto;
    .img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
    p {
      font-size: 18px;
      display: flex;
      margin: 20px 0;
    }
  }

  .expected{
    max-width: calc(var(--vp-layout-max-width) - 64px);
    display: flex;
    padding: 0 20px;
    margin: 0 auto;
  }

  .log{
     padding: 0 20px;
     max-width: calc(var(--vp-layout-max-width) - 64px);
     margin: 0 auto;
     .date{
       display:flex;
       .mouth{
        font-size:14px;
       }
       .day{
        font-size:12px;
       }
     }
     
  }
  .nomark{
    max-width: calc(var(--vp-layout-max-width) - 64px);
    margin: 0 auto;
    margin-top:12px;
    margin-bottom:6px;
    font-size:12px;
    text-indent:1em;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    box-shadow: 3px 3px 8px 1px rgba(203, 203, 203, 0.39);
    padding:12px;
  }

  .workcontent{
    max-width: calc(var(--vp-layout-max-width) - 64px);
    margin: 0 auto;
    margin-top:12px;
    margin-bottom:6px;
    font-size:12px;
    text-indent:1em;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    box-shadow: 3px 3px 8px 1px rgba(203, 203, 203, 0.39);
    padding:12px;
    .workitem{
      position:relative;
      margin-bottom:30px;
      .worknmame{
        font-size:16px;
      }
      .workdes{
        position:relative;
        top:-2px;
        line-height:14px;
      }
      .workdes::after{
        content:"";
        display:block;
        width:calc(100% - 24px);
        height:0;
        border:1px solid #ddc6ca;
        border-radius:50%;
        padding:1px;
        background:#d77fcc;
        margin:2px auto
      }
    }
    .workitem:last-child{
      margin-bottom:0;
    }
  }
}
</style>