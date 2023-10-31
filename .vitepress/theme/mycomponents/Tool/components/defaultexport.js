const scode = `

let drawdemoindex = 0;
let drawdemoindexdelay = 1;
console.log(framelist.value.length)
// 动画生成
function drawdemo() {
  // log.value = "渲染关键帧...";

  if (
    drawdemoindex <= framelist.value.length - 1 &&
    drawdemoindexdelay % 20 == 0
  ) {
    clearcanvas();
    drawframe();
    drawdemoindex++;
    requestAnimationFrame(drawdemo);
  } else if (drawdemoindexdelay % 20 == 0) {
    drawdemoindex = 0;

    clearcanvas();
    drawframe();
    requestAnimationFrame(drawdemo);
  } else {
    requestAnimationFrame(drawdemo);
  }

  drawdemoindexdelay++;
}

/* 像素数据去重 */
function uniqueFunc(arr, uniId) {
  const res = new Map();
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
}

function drawframe() {
  const mypixel = document.getElementById("pixel");
  let tools = mypixel.getContext("2d");

  // const list = framelist.value[drawdemoindex].point;
  const list = JSON.parse(JSON.stringify(framelist.value[drawdemoindex].point));
  const endlist = uniqueFunc(list, "sort");

  for (const index in endlist) {
    console.log(endlist[index].color)
    if(endlist[index].color=="null"){
      tools.fillStyle="rgba(0,0,0,0)"
    }else{
      tools.fillStyle = endlist[index].color;
    }
    tools.fillRect(endlist[index].x * 10, endlist[index].y * 10, 10, 10);
  }
}

function clearcanvas() {
  const mypixel = document.getElementById("pixel");
  const width = parseInt(window.innerWidth / 2);
  mypixel.width = width;
}
drawdemo();
</script>
`;

function setscode(list) {
  console.log(list);
  let jsonlist = JSON.stringify(list);
  const value = `<script> 
  let framelist={
    value:""
  }
  framelist.value=${jsonlist}
  `;
  console.log(value);
  return value + scode;
}

export { setscode };
