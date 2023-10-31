<template>
  <div class="main">
    <div class="shodow" ref="shadow">
      <div class="maintitle">
        <img class="img" src="/public/catear.gif" />
        <p>plan B 启动！</p>
      </div>

      <div class="date">
        <div class="datebox">
          <div class="titlebox">
            <p style="cursor: pointer;" @click="export2Excel">🈺</p>
            <p class="title">日常工作</p>
            <button class="btn" @click="opendatepanel">⏳</button>
          </div>
          <div class="content" v-if="nowtask.length==0">
            现在没有任务捏... 
          </div>
          <div class="content" v-else>
            <div class="thetask" v-for="(item,index) in nowtask" :key="index">
              <div class="taggoing" style="margin-bottom:8px;" v-if="item.time && !item.finish">
                进行中
                <p class="going">
                  <p v-for="(item,index) in 4" class="point">.</p>
                </p>
              </div>

              <div class="taggoing" style="margin-bottom:8px;color: #38d170;" v-if="!item.time || item.finish">
                已完成
              </div>

              <p class="tasktime" v-if="item.time && !item.finish">{{item.timeshow}}</p>
              <p style="font-size:18px;">{{item.name}}</p>
              <p style="font-size:14px;text-indent:1em">{{item.des}}</p>
              <div v-if="item.child.length" style="font-size:12px">
                <p>预计流程：</P>
                <p v-for="(citem,cindex) in item.child" :key="cindex">
                  {{cindex+1}}.{{citem}}
                </p>
              </div>
              
              <div class="thetaskbtn">
                <div class="btn" @click="closethetask(item,index)" style="margin-right:4px;">关闭</div>
                <div class="btn" @click="finishthetask(item)" v-if="item.time!=0">完成</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dateboxsmall">
          <div class="titlebox">
            <p>📝</p>
            <p class="title">日常记录</p>
            <button class="btn" @click="openrencordpanel">⏳</button>
          </div>
          <div class="content" v-if="nowrecord.length==0">
            现在没有记录捏... 
          </div>
          <div class="content" v-else>
            <div class="therecord" v-for="(item,index) in nowrecord" :key="index">
              <div v-if="item.type==1">✔️</div>
              <div v-if="item.type==2">📢</div>
              <div v-if="item.type==3">🚫</div>
              <div v-if="item.type==4">⚠️</div>
              <div v-if="item.type==5">❓</div>
              -{{item.content}}
            </div>
          </div>
        </div>
        <div class="dateboxsmall">
          <div class="titlebox">
            <p>🖨️</p>
            <p class="title">日常总结</p>
          </div>
          <p>施工中...</p>
        </div>
      </div>
      <div class="plan">
        <div class="planbox">
          <div class="titlebox">
            <p>🈵</p>
            <p class="title">当前任务栏</p>
          </div>
          <div class="content">
            <div class="item" v-for="(item,index) in goingtask" :key="index">
              <div class="taggoing">
                进行中
                <p class="going">
                  <p v-for="(item,index) in 4" class="point">.</p>
                </p>
              </div>
              <p class="task">{{item.name}}</p>
              <p class="date">{{item.date}}</p>
            </div>
          </div>
        </div>
        <div class="planbox">
          <div class="titlebox">
            <p>🉐</p>
            <p class="title">主线任务</p>
          </div>
          <div class="content">
            <div class="item">
              <div class="taggoing">
                进行中
                <p class="going">
                  <p v-for="(item,index) in 4" class="point" :key="index">.</p>
                </p>
              </div>
              <p class="task">活下去！stillwarter!</p>
              <p class="date">2022-xx-xx ~ ?</p>
            </div>
          <div class="item" v-for="(item,index) in mainlinetask" :key="index">
              <div class="tagpreparation">
                准备中
                <div class="loading">
                  <div class="in"></div>
                </div>
              </div>
              <p class="task">{{item.name}}</p>
              <p class="date">{{item.date}}</p>
            </div>
          </div>
        </div>
        <div class="planbox">
          <div class="titlebox">
            <p>🉑</p>
            <p class="title">支线任务</p>
          </div>
          <div class="content">
            <div class="item" v-for="(item,index) in otherlinetask" :key="index">
              <div class="tagdream">
                做梦中
                <div class="zzz">
                  <p>z</p>
                  <p>z</p>
                  <p>z</p>
                </div>
              </div>
              <p class="task">{{item.name}}</p>
              <p class="date">{{item.date}}</p>
            </div>
          </div>
        </div>
        <div class="planbox">
          <div class="titlebox">
            <p>💪</p>
            <p class="title">成就</p>
          </div>
          <div class="content">
            你的成就空空如也，小子再好好练练吧！
          </div>
        </div>
      </div>
    </div>
    

    <div class="editdatetask" ref="editdatetask">
      任务编辑
      <div class="task" v-for="(item, index) in form" :key="index">
        <div class="item">
          <p class="lable">任务标题:</p>
          <input type="text" placeholder="没想好可以先摸鱼" name="title" v-model="item.name" />
        </div>

        <div class="item">
          <p class="lable">任务描述:</p>
          <!-- <input type="" name="title" /> -->
          <textarea cols="50" rows="5" v-model="item.des" placeholder="没想好可以先摸鱼"> </textarea>
        </div>

        <div class="item">
          <p class="lable">任务时限:</p>
          <input type="text" placeholder="时间单位：分钟" name="tasktime" v-model="item.time" />
        </div>

        <div class="item">
          <p class="lable">预计流程:</p>
          <button class="addbtn" @click="addchildtask(item)">
            增加流程 (+)
          </button>
        </div>

        <div class="childitem" v-if="item.child.length">
          <div
            class="child"
            v-for="(citem, cindex) in item.child"
            :key="cindex"
          >
            <p class="lable">{{ cindex + 1 }}.</p>
            <textarea
              cols="40"
              rows="1"
              v-model="item.child[cindex]"
              placeholder="把容易变得更容易"
            ></textarea>
            <div class="del" @click="delchild(cindex, item.child)">➖</div>
          </div>
        </div>

        <div class="suretask">
          <div class="btn" @click="savetask(item)" style="margin-right:10px">保存</div>
          <div class="btn" @click="canceltask(item)">取消</div>
        </div>
      </div>
    </div>

    <div class="editrecord" ref="editrecord">
      日常记录
      <div class="item">
        <p class="lable">记录类型:</p>
        <select v-model="recordform.type">
          <option value="1">完成类 - 完成某项工作✔️</option>
          <option value="2">通知类 - 一些需要后续完成的事情📢</option>
          <option value="3">禁止类 - 错误的想法🚫</option>
          <option value="4">警告类 - 需要完善的东西⚠️</option>
          <option value="5">疑问类 - 需要明白的东西❓</option>
        </select>
      </div>
      <div class="item">
        <p class="lable">记录描述:</p>
        <textarea cols="50" rows="5" v-model="recordform.content"  placeholder="记录你的想法 问题或者？"> </textarea>
      </div>
      <div class="suretask">
        <div class="btn" @click="saverecord" style="margin-right:10px">保存</div>
        <div class="btn" @click="cancelrecordpanel">取消</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {goingtask,mainlinetask,otherlinetask,datetask} from "./data/task.js"
/*
* 参数说明
* shadow 全局模糊效果
* editdatetask 对应editdatetaskdom元素 （好吧 v3使用ref调用元素更快捷）
* nowtask 当前日常工作的任务内容
* form 编辑区绑定的form内容（所以打开需要置空）
* editrecord 对应editrecord dom元素
* nowrecord 当前日常记录的内容
*/

const shadow = ref(null);
const editdatetask=ref(null);
const editrecord=ref(null)
const nowtask=ref([])
const nowrecord=ref([])

let form = ref([
  {
    name: "",
    des: "",
    time: "",
    child: [],
    finish: "",
    isclose:0,
  },
]);

let recordform=ref({
  type:"1",
  content:""
})

/* 打开日常任务编辑栏 */
function opendatepanel(){
  shadow.value.style.zIndex = 0;
  editdatetask.value.style.transform= "scale(1)"
  cleareditdatetask()
}

/* 打开日常记录编辑栏 */
function openrencordpanel(){
  shadow.value.style.zIndex = 0;
  editrecord.value.style.transform= "scale(1)"
  clearrecordform()
}


/* 打开任务编辑栏后清理参数 */
function cleareditdatetask(){
  const demo={
    name: "",
    des: "",
    time: "",
    child: [],
    finish: "",  
    isclose:0,
  }
  form.value[0]=demo
}

/* 打开记录编辑栏后清理参数 */
function clearrecordform(){
  const demo={
    type:"1",
    content:""
  }
  recordform.value=demo
}

/* 增加子任务 */
function addchildtask(item) {
  if (item.child.length == 0 || item.child[item.child.length - 1] != "") {
    item.child.push("");
  } else {
    alert("请先编辑子任务内容");
  }
}

/* 删除子任务 */
function delchild(id, list) {
  console.log(id, list);
  list.splice(id, 1);
}

// let taskflag = ref(0);

/* 保存新增任务表单 */
function savetask(item) {
  if (item.name && item.des && item.time) {
    editdatetask.value.style.transform= "scale(0)"
    setTimeout(() => {
      shadow.value.style.zIndex = 10;
    }, 250);
    form.value[0].time *= 60
    nowtask.value.push(form.value[0])
    startitme(item);
  } else {
    alert("任务必须要有标题，描述，时限信息");
  }
}

/* 保存日常记录表单 */
function saverecord() {
  if (recordform.value.type && recordform.value.content) {
    nowrecord.value.push(recordform.value)
    editrecord.value.style.transform= "scale(0)"
    setTimeout(() => {
      shadow.value.style.zIndex = 10;
    }, 250);
  } else {
    alert("记录必须要内容");
  }
}



/* 任务栏关闭（取消编辑） */
function canceltask(){
  editdatetask.value.style.transform= "scale(0)"
  setTimeout(() => {
    shadow.value.style.zIndex = 10;
  }, 250);
}

/* record栏关闭（取消编辑） */
function cancelrecordpanel(){
  editrecord.value.style.transform= "scale(0)"
  setTimeout(() => {
    shadow.value.style.zIndex = 10;
  }, 250);
}

/* 任务计时器 */
function startitme(item) {
  item.timer = setInterval(()=>{
    showtime(item)
    item.time--
    if (item.time<=0) {
      clearInterval(item.timer)
      if (window.Notification.permission == "granted") { // 判断是否有权限
        sendNotification(item);
      } else if (window.Notification.permission != "denied") { 
        window.Notification.requestPermission(function (permission) { // 没有权限发起请求
          sendNotification(item);
        });
      }
    }
  }, 1000);
  // console.log(form.value[0]);
}

/* 时间计算 */
function showtime(item){
  // console.log(time);
  const m=parseInt(item.time / 60)
  const s=item.time % 60
  item.timeshow=`${m}分${s}秒`
  
}

/* 将日常工作导出为js文件 */
function export2Excel() {
  let code = JSON.stringify(nowtask.value);

  if (!nowtask.value.length) {
    return
  }
  
  
  //生成html字符串
  // const html = gethtml(code);
  // 创建一个a标签
  var a = document.createElement("a");
  // 创建一个包含blob对象的url
  var url = window.URL.createObjectURL(
    new Blob([code], {
      type: "",
    })
  );
  a.href = url;
  a.download = "stillwarter-dailytasks.txt";
  a.click();
  window.URL.revokeObjectURL(url);
}

/* 倒计时提示 */
// https://zhuanlan.zhihu.com/p/346800213
function sendNotification(item) {
  if (item.finish) {
    new Notification("stillwarter-blog：", {
      body: `${item.name}任务已完成`,
      icon: 'https://file.fishpi.cn/2022/07/MOSHED2022621164630-1b1ec532.gif?imageView2/1/w/210/h/210/interlace/0/q/100'
    })
  }
  else if(item.isclose){
    return
  }
  else{
    new Notification("stillwarter-blog：", {
      body: `${item.name}任务时限已到达`,
      icon: 'https://file.fishpi.cn/2022/07/MOSHED2022621164630-1b1ec532.gif?imageView2/1/w/210/h/210/interlace/0/q/100'
    })
  }
   
}
// if (window.Notification.permission == "granted") { // 判断是否有权限
//    sendNotification();
//  } else if (window.Notification.permission != "denied") { 
//    window.Notification.requestPermission(function (permission) { // 没有权限发起请求
//      sendNotification();
//    });
//  }


/* 任务卡关闭 */
function closethetask(item,id){
  item.time=0
  item.isclose=1
  nowtask.value.splice(id,1)
}

/* 任务卡完成 */
function finishthetask(item){
  item.finish=1
  item.time=0
}
</script>

<style lang="less" scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  
  .shodow{
    position:relative;
    z-index:10;
    min-height: 80vh;
    padding-bottom:100px;
    background:var(--vp-c-bg);
  }


    .date{
      width: 80vw;
      display:flex;
      justify-content: space-between;
      margin-bottom:40px;
      .datebox{
        width: 38.4vw;
        height:30vh;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 8px;
        box-shadow: 3px 3px 8px 1px rgba(203, 203, 203, 0.39);
        display:flex;
        flex-direction: column;
        align-items: center;     
        transition: all 0.3s linear;
        overflow:auto;
        .titlebox {
          width: 100%;
          padding: 20px;
          display: flex;
          position:relative;
          .btn{
            padding:5px;
            position:absolute;
            right:0px;
            padding-right:25px;
            cursor:pointer;
          }
        }
        .title {
          font-size: 16px;
          font-family: "catbite";
          position: relative;
          margin-left: 4px;
          top: 2px;
        }
        .content{
          display:flex;
          flex-wrap:wrap;
          justify-content: space-between;
          width:100%;
          overflow:auto;
          align-items: center;
          font-family: "catbite";
          padding:0 20px;
          .thetask{
            width:48%;
            height:200px;
            background: linear-gradient(317deg, #fddb92 0%,#d1fdff 100%);
            border-radius:12px;
            opacity:0;
            animation:showtask 0.5s linear 1s forwards;
            margin-bottom:18px;
            overflow:auto;
            padding:10px;
            position:relative;
            display:flex;
            flex-direction:column;
            justify-content: space-between;
            .tasktime{
              position:absolute;
              top:10px;
              right:10px;
            }

            .thetaskbtn{
              position:relative;
              bottom:10px;
              right:0px;
              display:flex;
              justify-content: flex-end;
              margin-top:10px;
              .btn{
                cursor:pointer;
              }
              .btn:hover{
                color:#888;
              }
            }
          }
        }
      }
      .datebox:hover {
        box-shadow: 0px 0px 3px 4px rgba(255, 255, 255, 1);
      }
      .dateboxsmall{
        width: 18vw;
        height:30vh;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 8px;
        box-shadow: 3px 3px 8px 1px rgba(203, 203, 203, 0.39);
        display:flex;
        flex-direction: column;
        align-items: center;     
        transition: all 0.3s linear;
        overflow:auto;
        .titlebox {
          width: 100%;
          padding: 20px;
          display: flex;
          position:relative;
          .btn{
            padding:5px;
            position:absolute;
            right:0px;
            padding-right:25px;
            cursor:pointer;
          }
        }
        .title {
          font-size: 16px;
          font-family: "catbite";
          position: relative;
          margin-left: 4px;
          top: 2px;
        }
        .content{
          display:flex;
          flex-direction:column;
          width:100%;
          overflow:auto;
          font-family: "catbite";
          padding:0 20px;
          .therecord{
            display:flex;
          }
        }
      }
      .dateboxsmall:hover {
        box-shadow: 0px 0px 3px 4px rgba(255, 255, 255, 1);
      }
    }    
    

  .plan {
    display: flex;
    flex-wrap: wrap;
    width: 80vw;
    justify-content: space-between;
    .titlebox {
      width: 100%;
      padding: 20px;
      display: flex;
    }
    .title {
      font-size: 16px;
      font-family: "catbite";
      position: relative;
      margin-left: 4px;
      top: 2px;
    }

    
    .planbox {
      width: 18vw;
      height: 80vh;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 8px;
      box-shadow: 3px 3px 8px 1px rgba(203, 203, 203, 0.39);
      transition: all 0.3s linear;
      display: flex;
      flex-direction: column;
      align-items: center;     
      overflow: auto;
      .content {
        width: 100%;
        padding: 20px;
        font-family: "catbite";
        .item {
          width: 100%;
          font-family: "liuhuan", Arial, "Microsoft YaHei";
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          border-bottom:1px dotted  rgb(221, 220, 220);
          margin:20px 0;
          .date {
            font-size: 8px;
            line-height: 20px;
            width: 100%;
            font-family: "catbite";
            display: flex;
            justify-content: flex-end;
            color: rgba(120, 120, 120, 0.5);
            margin-bottom:6px;
          }
        }
      }
    }
    .planbox:hover {
      box-shadow: 0px 0px 3px 4px rgba(255, 255, 255, 1);
    }
  }
}

.main::after {
  content: "";
  display: block;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
}


.maintitle {
  width: 80vw;
  display: flex;
  align-items: center;
  .img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  p {
    font-size: 18px;
    font-family: "catbite";
    display: flex;
    margin: 20px 0;
  }
}

.taggoing {
  font-size: 12px;
  background-color: rgba(255, 82, 2, 0.06);
  border-radius: 4px;
  color: #2d8cf0;
  width: 60px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  .going{
    display:flex;
    margin-left:2px;
    .point{
      position:relative;
    }
    .point:nth-child(1){
      animation:goingpoints 1s linear  infinite;
    }
    .point:nth-child(2){
      animation:goingpoints 1s linear 0.1s infinite;
    }
    .point:nth-child(3){
      animation:goingpoints 1s linear 0.2s infinite;
    }
    .point:nth-child(4){
      animation:goingpoints 1s linear 0.3s infinite;
    }
  }
}

.tagpreparation{
  font-size: 12px;
  background-color: rgba(255, 82, 2, 0.06);
  border-radius: 4px;
  color: #109f6f;
  width: 60px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "liuhuan", Arial, "Microsoft YaHei";
  .loading{
    border-radius:50%;
    background:black;
    margin-left:4px;
    animation:preparationloading 1s linear infinite forwards;
    .in{
      background: rgb(251 229 218);
      width:12px;
      height:12px;
      border-radius:50%;
    }
  }
}

.tagdream{
  font-size: 12px;
  background-color: rgba(255, 82, 2, 0.06);
  border-radius: 4px;
  color: #e22abd;
  width: 60px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "liuhuan", Arial, "Microsoft YaHei";
  .zzz{
    margin-left:2px;
    display:flex;

    p:nth-child(1){
      position:relative;
      transform:scale(0.8);
      top:2px;
      opacity: 0;
      animation:tagdreamz 3s ease-in-out infinite ;
    }
    p:nth-child(2){
      position:relative;
      margin-left:1px;
      margin-right:2px;
      transform:scale(1.1);
      animation:tagdreamz2 3s ease-in-out infinite;
      opacity: 0;

    }
    p:nth-child(3){
      position:relative;
      transform:scale(1.5);
      top:-2px;
      animation:tagdreamz3 3s ease-in-out infinite;
      opacity: 0;
    }
  }
  
}

.task {
  font-size: 14px;
  font-family: "catbite";
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.editdatetask{
  transform: scale(0);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 0 6px rgba(255, 255, 255);
  position: fixed;
  z-index: 10;
  display: flex;
  flex-direction:column;
  align-items: center;
  border-radius:12px;
  margin-top:60px;
  transition: all 0.25s linear;
  font-family: "catbite";
  padding: 20px;
  .task {
      margin-top: 20px;
      position: relative;
    .item {
      display: flex;
      margin-bottom: 22px;
      .lable {
        margin-right: 4px;
      }
      input {
        background: rgb(255, 255, 255);
        border-radius: 4px;
        color: #000;
        font-family: "catbite";
        padding-left: 5px;
      }
      textarea {
        background: rgb(255, 255, 255);
        border-radius: 4px;
        color: #000;
        font-family: "catbite";
        padding: 5px;
      }
      .addbtn {
        background: linear-gradient(270deg, #a8ff78 0%, #78ffd6 100%);
        padding: 5px;
        border-radius: 4px;
        color: palevioletred;
      }
    }
    .childitem {
      display: flex;
      flex-direction: column;
      position: relative;
      top: -10px;
      margin-left: 70px;
      .child {
        display: flex;
        margin-bottom: 10px;
        textarea {
          font-family: "catbite";
          padding: 5px;
          box-sizing: border-box;
          resize: none;
        }
        .del {
          margin-left: 5px;
          color: red;
          cursor: pointer;
        }
      }
    }
  }
  .suretask {
    display: flex;
    color: #fff;
    box-sizing: border-box;
    justify-content: flex-end;

    .btn {
      padding: 5px;
      border-radius: 4px;
      background: black;
      display: flex;
      align-items: center;
      cursor:pointer;
    }
  }
}

.editrecord{
  transform: scale(0);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 0 6px rgba(255, 255, 255);
  position: fixed;
  z-index: 10;
  display: flex;
  flex-direction:column;
  align-items: center;
  border-radius:12px;
  margin-top:60px;
  transition: all 0.25s linear;
  font-family: "catbite";
  padding: 20px;

 .item {
    width:100%;
    display: flex;
    flex-wrap:wrap;
    margin-bottom: 22px;
    .lable {
      margin-right: 4px;
    }
    textarea {
      font-family: "catbite";
      padding: 5px;
      box-sizing: border-box;
      resize: none;
    }
    select{
      padding-left:4px;
    }
  }

  .suretask {
    width:100%;
    display: flex;
    color: #fff;
    box-sizing: border-box;
    justify-content: flex-end;

    .btn {
      padding: 5px;
      border-radius: 4px;
      background: black;
      display: flex;
      align-items: center;
      cursor:pointer;
    }
  }
}

@media screen and (min-width: 750px) and (max-width: 1024px) {
}
@media screen and (min-width: 280px) and (max-width: 750px) {
}

@keyframes goingpoints{
  0%{
    color:#2d8cf0;
    top:0
  }
  100%{
    color:red;
    top:-1px;
  }
}


@keyframes preparationloading{
  0%{
    border-top: 2px solid var(--clr-4);
    border-right: 2px solid var(--clr-1);
    border-bottom: 2px solid var(--clr-2);
    border-left: 2px solid var(--clr-3);
  }
  25%{
    border-top: 2px solid var(--clr-1);
    border-right: 2px solid var(--clr-2);
    border-bottom:2px solid var(--clr-3);
    border-left: 2px solid var(--clr-4);    
  }
  50%{
    border-top: 2px solid var(--clr-2);
    border-right: 2px solid var(--clr-3);
    border-bottom: 2px solid var(--clr-4);
    border-left: 2px solid var(--clr-1);    
  }
  75%{
    border-top: 2px solid var(--clr-3);
    border-right: 2px solid var(--clr-4);
    border-bottom: 2px solid var(--clr-1);
    border-left: 2px solid var(--clr-2);    
  }
  100%{
    border-top: 2px solid var(--clr-4);
    border-right: 2px solid var(--clr-1);
    border-bottom: 2px solid var(--clr-2);
    border-left: 2px solid var(--clr-3);    
  }
}

@keyframes tagdreamz{
  0%{
    opacity: 0;
  }
  10%{
    opacity: 1;
  }
}

@keyframes tagdreamz2{
  0%{
    opacity: 0;
  }
 40%{
    opacity: 1;
  }
}

@keyframes tagdreamz3{
  0%{
    opacity: 0;
  }
  80%{
    opacity: 1;
  }
}

@keyframes showtask{
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
</style>
