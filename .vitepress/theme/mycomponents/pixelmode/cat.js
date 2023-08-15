/* 
    根据动画效果，我们将轮廓分为静态和动态两种，静态就是不参与动画的部分，动态就是要参与动画的部分 
    各个部分的轮廓坐标可以用二维数组来表示，用pointstype记录点集合对应的方向，有纵横两种状态。
    记录方式要么是从上到下，要么是从左到右;
    渲染方式由记录方式而定，若是从上到下记录，也就是pointstype为vertically，那么渲染则是纵向渲染，反之横向渲染。
    具体说来：
    若是pointstype为vertically，那么记录方式是从左到右，从上到下的记录每条纵向的点数据；
    若是pointstype为horizontally，那么记录方式是从上到下，从左往右的记录每条横向的点数据；
    前者的渲染方式则是遍历points数据，将每个子数组的数据渲染到对应坐标，比如[1,2,3,4]这个数据，就是从尾部的最左边开始，这个纵坐标上存在轮廓的点是1，2，3，4；
    后者的渲染方式则是遍历points数据，将每个子数组的数据渲染到对应坐标，比如catear中的[1, 4],表示从耳部的最上边开始，这个横坐标存在轮廓的点是1，4

    由于每个部分都是从左到右，从上到下的，所以我们需要部分的起始点位。比如耳部是catoutline的最上边，所以它的起始y坐标是0；
    而尾部是catoutline的最左边，所以这个部分的起始x坐标是0;
*/

const catoutline = {
  info: {
    name: "catdemo",
    isoutline: true,
    type: "animal",
    length: 32,
    height: 19,
    pointsize: 15,
    innercolor: "#fed9d0",
  },

  catail: {
    name: "catail",
    length: 8,
    height: 8,
    startx: 0,
    starty: 4,
    pointstype: "vertically",
    points: [
      [2, 3, 4, 5],
      [1, 6],
      [1, 6],
      [1, 7],
      [2, 7],
      [3, 8],
      [3, 8],
      [4, 8],
    ],
    join: "catbody",
    outlinecolor: "#835e1d",
    innercolor: "#fed9d0",
  },

  catail2: {
    name: "catail2",
    length: 8,
    height: 8,
    startx: 0,
    starty: 4,
    pointstype: "vertically",
    points: [
      [1, 2, 3,4],
      [0, 5],
      [0, 5],
      [0, 6],
      [1, 6],
      [2, 7],
      [2, 7],
      [3, 7],
    ],
    join: "catbody",
    outlinecolor: "#835e1d",
    innercolor: "#fed9d0",
  },

  catfoot1: {
    name: "catfoot1",
    length: 19,
    height: 3,
    startx: 8,
    starty: 15,
    pointstype: "horizontally",
    pointsrule: [
      [
        { s: 0, e: 7 },
        { s: 12, e: 16 },
        { s: 16, e: 18 },
      ],
      [
        { s: 0, e: 2 },
        { s: 3, e: 6 },
        { s: 12, e: 15 },
        { s: 15, e: 18 },
      ],
      [
        { s: 0, e: 3 },
        { s: 3, e: 6 },
        { s: 12, e: 15 },
        { s: 15, e: 18 },
      ],
    ],
    points: [
      [0, 7, 8, 9, 10, 11, 12, 16, 18],
      [0, 2, 3, 6, 12, 15, 18],
      [0, 3, 6, 12, 15, 18],
      [1, 2, 4, 5, 13, 14, 16, 17],
    ],
    join: "catbody",
    outlinecolor: "#835e1d",
    innercolor: "#fed9d0",
  },

  catfoot2: {
    name: "catfoot2",
    length: 20,
    height: 4,
    startx: 8,
    starty: 15,
    pointstype: "horizontally",
    pointsrule: [
      [
        { s: 1, e: 6 },
        { s: 13, e: 18 },
      ],
      [
        { s: 0, e: 2 },
        { s: 2, e: 5 },
        { s: 11, e: 14 },
        { s: 15, e: 19 },
      ],
      [
        { s: 0, e: 2 },
        { s: 2, e: 5 },
        { s: 16, e: 19 },
      ],
    ],
    points: [
      [1, 6, 7, 8, 9, 10, 11, 12, 13, 18],
      [0, 2, 5, 11, 14, 15, 19],
      [0, 2, 5, 12, 13, 16, 19],
      [1, 4, 3, 17, 18],
    ],
    join: "catbody",
    outlinecolor: "#835e1d",
    innercolor: "#fed9d0",
  },

  catfoot3: {
    name: "catfoot3",
    length: 20,
    height: 4,
    startx: 8,
    starty: 15,
    pointstype: "horizontally",
    pointsrule: [
      [
        { s: 2, e: 6 },
        { s: 13, e: 18 },
      ],
      [
        { s: 3, e: 7 },
        { s: 7, e: 9 },
        { s: 14, e: 17 },
      ],
      [
        { s: 3, e: 6 },
        { s: 6, e: 9 },
        { s: 11, e: 14 },
        { s: 14, e: 17 },
      ],
    ],
    points: [
      [2, 6, 7, 8, 9, 10, 11, 12, 13, 18],
      [3, 7, 9, 12, 13, 14, 17],
      [3, 6, 9, 11, 14, 16, 17],
      [4, 5, 7, 8, 12, 13, 15, 16],
    ],
    join: "catbody",
    outlinecolor: "#835e1d",
    innercolor: "#fed9d0",
  },

  catfoot4: {
    name: "catfoot4",
    length: 20,
    height: 4,
    startx: 8,
    starty: 15,
    pointstype: "horizontally",
    pointsrule: [
      [
        { s: 2, e: 12 },
        { s: 13, e: 15 },
        { s: 16, e: 19 },
      ],
      [
        { s: 3, e: 7 },
        { s: 8, e: 11 },
        { s: 14, e: 17 },
        { s: 17, e: 20 },
      ],
      [
        { s: 4, e: 7 },
        { s: 14, e: 16 },
      ],
    ],
    points: [
      [2, 12, 13, 15, 16, 19],
      [3, 8, 7, 11, 14, 17, 20],
      [4, 7, 9, 10, 14, 16, 18, 19],
      [5, 6, 15, 16],
    ],
    join: "catbody",
    outlinecolor: "#835e1d",
    innercolor: "#fed9d0",
  },

  catfoot5: {
    name: "catfoot5",
    length: 20,
    height: 4,
    startx: 8,
    starty: 15,
    pointstype: "horizontally",
    pointsrule: [
      [
        { s: 2, e: 9 },
        { s: 12, e: 17 },
        { s: 17, e: 19 },
      ],
      [
        { s: 3, e: 5 },
        { s: 5, e: 9 },
        { s: 11, e: 16 },
        { s: 17, e: 20 },
      ],
      [
        { s: 2, e: 5 },
        { s: 6, e: 9 },
        { s: 17, e: 20 },
      ],
    ],
    points: [
      [2, 9, 10, 11, 12, 17, 19],
      [2, 3, 5, 9, 11, 16, 17, 20],
      [2, 5, 6, 9, 12, 13, 14, 15, 17, 20],
      [3, 4, 7, 8, 18, 19],
    ],
    join: "catbody",
    outlinecolor: "#835e1d",
    innercolor: "#fed9d0",
  },

  catfoot6: {
    name: "catfoot6",
    length: 20,
    height: 4,
    startx: 8,
    starty: 15,
    pointstype: "horizontally",
    pointsrule: [
      [
        { s: 2, e: 7 },
        { s: 14, e: 17 },
      ],
      [
        { s: 4, e: 7 },
        { s: 12, e: 16 },
      ],
      [
        { s: 4, e: 7 },
        { s: 14, e: 17 },
      ],
    ],
    points: [
      [2, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18],
      [3, 4, 7, 12, 16, 17],
      [3, 4, 7, 13, 14, 17],
      [4, 5, 6, 15, 16],
    ],
    join: "catbody",
    outlinecolor: "#835e1d",
    innercolor: "#fed9d0",
  },

  catfoot7: {
    name: "catfoot7",
    length: 20,
    height: 4,
    startx: 8,
    starty: 15,
    pointstype: "horizontally",
    pointsrule: [
      [
        { s: 1, e: 7 },
        { s: 15, e: 19 },
      ],
      [
        { s: 2, e: 6 },
        { s: 6, e: 9 },
        { s: 12, e: 16 },
        { s: 17, e: 19 },
      ],
      [
        { s: 2, e: 5 },
        { s: 12, e: 15 },
      ],
    ],
    points: [
      [1, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19],
      [1, 2, 6, 9, 12, 16, 17, 19],
      [2, 5, 7, 8, 12, 15, 17, 18],
      [3, 4, 13, 14],
    ],
    join: "catbody",
    outlinecolor: "#835e1d",
    innercolor: "#fed9d0",
  },

  catear: {
    name: "catear",
    length: 6,
    height: 2,
    startx: 23,
    starty: 0,
    pointstype: "horizontally",
    pointsrule: [
      null,
      [
        { s: 0, e: 2 },
        { s: 3, e: 5 },
      ],
    ],
    points: [
      [1, 4],
      [0, 2, 3, 5],
    ],
    join: "catbody",
    outlinecolor: "#835e1d",
    innercolor: "#fed9d0",
  },

  catbody: {
    name: "catbody",
    length: 24,
    height: 14,
    startx: 8,
    starty: 2,
    pointstype: "horizontally",
    pointsrule: 0,
    points: [
      [15, 20, 21],
      [15, 22],
      [14, 23],
      [6, 7, 8, 9, 10, 11, 12, 13, 23],
      [2, 3, 4, 5, 23],
      [1, 23],
      [0, 22],
      [0, 21],
      [0, 20],
      [0, 20],
      [0, 20],
      [1, 19],
      [1, 18],
      // [1, 8, 9, 10, 11, 12, 13],
    ],
    join: ["catail", "catfoot", "catear"],
    outlinecolor: "#835e1d",
    innercolor: "#fed9d0",
  },
  cateyes: {
    name: "cateyes",
    length: 1,
    height: 2,
    startx: 20,
    starty: 4,
    pointstype: "horizontally",
    points: [[8], [8]],
  },
  cateyes2: {
    name: "cateyes",
    length: 1,
    height: 2,
    startx: 20,
    starty: 4,
    pointstype: "horizontally",
    points: [[8,7],[8]],
  },
  catface: {
    name: "catface",
    length: 1,
    height: 1,
    startx: 20,
    starty: 6,
    pointstype: "horizontally",
    partcolor:'red',
    points: [[7]],
  },
};

export { catoutline };

