/**
 * 超级玛丽的像素数据
 * 按行去画 12*16的规格
 *
 * 以0，0为边界
 */

const bodypixel = [
  {
    start: [3, 0],
    len: 5,
    transparent: false,
  },
  {
    start: [2, 1],
    len: 8,
    transparent: false,
  },
  {
    start: [2, 2],
    len: 6,
    transparent: false,
  },
  {
    start: [1, 3],
    len: 9,
    transparent: false,
  },
  {
    start: [1, 4],
    len: 10,
    transparent: false,
  },
  {
    start: [1, 5],
    len: 9,
    transparent: false,
  },
  {
    start: [3, 6],
    len: 6,
    transparent: false,
  },
  {
    start: [2, 7],
    len: 5,
    transparent: false,
  },
  {
    start: [1, 8],
    len: 9,
    transparent: false,
  },
  {
    start: [0, 9],
    len: 11,
    transparent: false,
  },
  {
    start: [0, 10],
    len: 11,
    transparent: false,
  },
  {
    start: [0, 11],
    len: 11,
    transparent: false,
  },
  {
    start: [0, 12],
    len: 11,
    transparent: false,
  },
  {
    start: [2, 13],
    len: 7,
    transparent: {
      start: [5, 13],
      len: 1,
    },
  },
  {
    start: [1, 14],
    len: 9,
    transparent: {
      start: [4, 13],
      len: 3,
    },
  },
  {
    start: [0, 15],
    len: 11,
    transparent: {
      start: [4, 13],
      len: 3,
    },
  },
];

const cap = [
  {
    start: [3, 0],
    len: 5,
    transparent: false,
  },
  {
    start: [2, 1],
    len: 8,
    transparent: false,
  },
];

const eyes = [
  {
    point: [7],
    row: 2,
  },
  {
    point: [7],
    row: 3,
  },
];

const beardhair = [
  {
    point: [2, 3, 4],
    row: 2,
  },
  {
    point: [1, 3],
    row: 3,
  },
  {
    point: [1, 3, 4, 8],
    row: 4,
  },
  {
    point: [1, 2, 7, 8, 9, 10],
    row: 5,
  },
];

const upclothing = [
  {
    start: [2, 7],
    len: 5,
    transparent: false,
  },
  {
    start: [1, 8],
    len: 10,
    transparent: false,
  },
  {
    start: [0, 9],
    len: 11,
    transparent: false,
  },
  {
    start: [2, 10],
    len: 7,
    transparent: false,
  },
];

const straps = [
  {
    point: [4],
    row: 7,
  },
  {
    point: [4, 7],
    row: 8,
  },
  {
    point: [4, 5, 6, 7],
    row: 9,
  },
  {
    point: [3, 5, 6, 8],
    row: 10,
  },
  {
    point: [3, 4, 5, 6, 7, 8],
    row: 11,
  },
  {
    point: [2, 3, 4, 5, 6, 7, 8, 9],
    row: 12,
  },
  {
    point: [2, 3, 4, 7, 8, 9],
    row: 13,
  },
];

const shoes = [
  {
    start: [1, 14],
    len: 9,
    transparent: {
      start: [4, 13],
      len: 3,
    },
  },
  {
    start: [0, 15],
    len: 11,
    transparent: {
      start: [4, 13],
      len: 3,
    },
  },
];
export { bodypixel, cap, eyes, beardhair, upclothing, straps, shoes };
