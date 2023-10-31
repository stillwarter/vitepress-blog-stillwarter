const worklog = [
  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 0,
    workcontent: [],
  },

  {
    iswork: 1,
    workcontent: [
      {
        name: "工作日志上线",
        des:
          "工作日志正式上线，将用于记录日常工作进展，遇到的疑惑，如何解决问题，需要改的的地方，等等...",
      },
    ],
  },

  {
    iswork: 1,
    workcontent: [
      {
        name: "动画流程预备优化",
        des: "准备一些动画上的逻辑进行复局，然后思考如何优化...",
        aim: "目标是解决当前动画无法实现交互的局限",
        status: [
          "目前的动画是使用animation的方式进行处理，在进行动画前，会由js取得当前滚动范围的高度，然后生成对应的animationcss代码，再添加到对应元素里，然后dom元素就会按照预设的走向动起来",
          "在动画切换的时候，函数会检索当前有动画属性的元素，脚本会判断当前元素是否有animation属性，有就清除，这样元素就会回到原来的状态，然后再加入新的css动画代码，再加入新的animation属性",
          "这样循环下去，就得到一组不断迭代的动画，在切换css代码的时候，就可以更新数据,现在遇到的问题就是，当我们手动去点击按钮，改变数据的时候，此时动画也必须随之改变。",
        ],
        todo: [
          "在数据改变后，当前的动画需要清空，然后用别的动画去替代新数据",
          "在数据更新前，可以加入一些提示",
          "思考如何减弱计时器与动画之间的耦合",
        ],
      },
      {
        name: "初建常用函数表",
        des: "存放一些常用的逻辑函数。",
        aim: "目标是提高开发效率...搬砖，也是有技巧的！",
        status: [" 建立常用date函数表，里面又一些日期相关的函数 "],
      },
      {
        name: "继续进行stillwarter-draw",
        des: "完善这个东西...",
      },
    ],
  },
];

export { worklog };
