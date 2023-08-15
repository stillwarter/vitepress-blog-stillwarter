/**
 * 超级玛丽的像素数据
 * 按行去画 12*16的规格
 *
 * 以0，0为边界
 */

const bodypixel = [
  {
    start: [7, 0],
    len: 5,
    transparent: false,
  },
  {
    start: [6, 1],
    len: 8,
    transparent: false,
  },
  {
    start: [6, 2],
    len: 6,
    transparent: false,
  },
  {
    start: [5, 3],
    len: 9,
    transparent: false,
  },
  {
    start: [5, 4],
    len: 10,
    transparent: false,
  },
  {
    start: [5, 5],
    len: 9,
    transparent: false,
  },
  {
    start: [7, 6],
    len: 6,
    transparent: false,
  },
  {
    start: [6, 7],
    len: 5,
    transparent: false,
  },
  {
    start: [5, 8],
    len: 9,
    transparent: false,
  },
  {
    start: [4, 9],
    len: 11,
    transparent: false,
  },
  {
    start: [4, 10],
    len: 11,
    transparent: false,
  },
  {
    start: [4, 11],
    len: 11,
    transparent: false,
  },
  {
    start: [4, 12],
    len: 11,
    transparent: false,
  },
  {
    start: [6, 13],
    len: 7,
    transparent: {
      start: [9, 13],
      len: 1,
    },
  },
  {
    start: [5, 14],
    len: 9,
    transparent: {
      start: [8, 13],
      len: 3,
    },
  },
  {
    start: [4, 15],
    len: 11,
    transparent: {
      start: [8, 13],
      len: 3,
    },
  },
];

const cap = [
  {
    start: [7, 0],
    len: 5,
    transparent: false,
  },
  {
    start: [6, 1],
    len: 8,
    transparent: false,
  },
];

const eyes = [
  {
    point: [11],
    row: 2,
  },
  {
    point: [11],
    row: 3,
  },
];

const beardhair = [
  {
    point: [6, 7, 8],
    row: 2,
  },
  {
    point: [5, 8],
    row: 3,
  },
  {
    point: [5, 7, 8, 9],
    row: 4,
  },
  {
    point: [5, 6, 11, 12, 13, 14],
    row: 5,
  },
];

const upclothing = [
  {
    start: [6, 7],
    len: 5,
    transparent: false,
  },
  {
    start: [5, 8],
    len: 10,
    transparent: false,
  },
  {
    start: [4, 9],
    len: 11,
    transparent: false,
  },
  {
    start: [6, 10],
    len: 7,
    transparent: false,
  },
];

const straps = [
  {
    point: [8],
    row: 7,
  },
  {
    point: [8, 11],
    row: 8,
  },
  {
    point: [8, 9, 10, 11],
    row: 9,
  },
  {
    point: [7, 9, 10, 12],
    row: 10,
  },
  {
    point: [7, 8, 9, 10, 11, 12],
    row: 11,
  },
  {
    point: [6, 7, 8, 9, 10, 11, 12, 13],
    row: 12,
  },
  {
    point: [6, 7, 8, 11, 12, 13],
    row: 13,
  },
];

const shoes = [


  {
    start: [5, 14],
    len: 9,
    transparent: {
      start: [8, 13],
      len: 3,
    },
  },
  {
    start: [4, 15],
    len: 11,
    transparent: {
      start: [8, 13],
      len: 3,
    },
  },
];



export { bodypixel, cap, eyes, beardhair, upclothing, straps, shoes };
