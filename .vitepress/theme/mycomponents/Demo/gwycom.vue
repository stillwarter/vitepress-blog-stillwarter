<template>
  <div class="main">
    <div class="box_bg">
      <div class="bgcontain">
        <div class="left">
          <div class="title">
            <div class="logo"></div>
            <ul>
              <li>首页</li>
              <li>职位库</li>
              <li>备考资料</li>
              <li>热门好课</li>
              <li>师资介绍</li>
              <li>关于我们</li>
            </ul>
          </div>
        </div>
        <div class="right">
          <div class="phone"></div>
        </div>
        <div class="center">
          <div class="centerleft">
            <ul>
              <li>国家公务员</li>
              <li>地方公务员</li>
              <li>事业单位</li>
              <li>教师资格</li>
              <li>银行招聘</li>
              <li>国企招聘</li>
            </ul>
          </div>
          <div class="centeright">
            <Swiper
              :modules="modules"
              :slides-per-view="1"
              :loop="true"
              :speed="1200"
              effect="fade"
              :pagination="{
                clickable: true,
              }"
              :autoplay="{
                delay: 2500,
                disableOnInteraction: false,
              }"
              :grabCursor="true"
            >
              <SwiperSlide>
                <img
                  src="https://attachment.gwy.com/img/202301131620460177838.jpg"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://stark-attachment.pxo.cn/img/202211151020530183082.jpg"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://stark-attachment.pxo.cn/img/202211102012580108891.jpg"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://attachment.gwy.com/img/202303150846260135328.jpg"
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        <div class="bottom">
          <div class="left">
            <div class="top">
              <div class="logo"></div>
              <div class="words">职位搜索表</div>
              <div>
                <input type="text" id="typeId" placeholder="请选择省份" />
              </div>
              <div>
                <input type="text" id="typeId" placeholder="请选择时间" />
              </div>
              <div class="btn">查询</div>
            </div>
            <div class="bottom">
              <span>热门推荐：</span>
              <ul>
                <li>
                  <a
                    target="_blank"
                    href="https://www.gwy.com/gjgwy/248726.html"
                    >国家公务员成绩已发布</a
                  >
                  <div class="hotIcon"></div>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://www.gwy.com/gjgwy/249333.html"
                    >国考调剂公告|名单</a
                  >
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://www.gwy.com/lngwy/249083.html"
                    >辽宁成绩查询</a
                  >
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://www.gwy.com/hljgwy/248775.html"
                    >黑龙江成绩查询入口</a
                  >
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://www.gwy.com/xjgwy/249766.html"
                    >新疆兵团成绩</a
                  >
                </li>
              </ul>
            </div>
          </div>
          <div class="right">
            <div>
              <div>微信扫一扫</div>
              <div>咨询老师获取</div>
              <div>获取2023省考院长私教营优惠</div>
            </div>
            <div class="shareCode"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Autoplay, EffectFade, Pagination, A11y, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

import "swiper/css/bundle";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const onSwiper = (swiper) => {};
    const onSlideChange = () => {};
    return {
      onSwiper,
      onSlideChange,
      // 返回模块
      modules: [Autoplay, Pagination, A11y, Navigation],
    };
  },
};
</script>

<style lang="less" scoped>
.swiper {
  height: 100%;
  border-radius: 8px;
  .swiper-slide {
    background: yellow;
  }
}

img {
  height: 369px;
}

canvas{
  
  border-radius:10px;
}

.main {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  .box_bg {
    width: 100%;
    height: 693px;
    background-image: url("./img/bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    .bgcontain {
      width: 1200px;
      min-width: 1200px;
      margin: 0px auto;
      padding-top: 24px;
      padding-bottom: 133px;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-wrap: wrap;
      .left {
        width: 75%;
        display: flex;
        .title {
          display: flex;
          .logo {
            width: 136px;
            height: 46px;
            background-image: url("./img/logo.png");
            background-size: 100% 100%;
          }
          ul {
            margin-left: 60px;
            display: flex;
            font-size: 18px;
            font-weight: 400;
            font-family: PingFangSC-Semibold, PingFang SC;
            color: #ffffff;
            margin-top: 8px;
            width: 700px;
            justify-content: space-between;
            list-style: none;
            position: relative;
            li {
              cursor: pointer;
              position: relative;
            }
            li::after {
              transition: all 0.5s ease;
              content: "";
              width: 0px;
              height: 4px;
              background: #ffffff;
              border-radius: 2px;
              display: block;
              position: absolute;
              left: 6px;
              top: 32px;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            li:hover:after {
              width: 32px;
            }
          }
        }
      }
      .right {
        width: 25%;
        display: flex;
        justify-content: center;
        margin-top: 8px;
        .phone {
          width: 132px;
          height: 46px;
          margin-left: 50px;
          background-image: url("./img/phone.png");
          background-repeat: no-repeat;
        }
      }
      .center {
        margin-left: 4px;
        margin-top: 16px;
        width: 1468px;
        display: flex;
        .centerleft {
          min-width: 136px;
          width: 136px;
          background-color: #ffffff;
          background: #ffffff;
          border-radius: 8px;
          height: 369px;
          padding: 30px 0px;
          box-sizing: border-box;
          position: relative;
          ul li {
            cursor: pointer;
            height: 58px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            padding-bottom: 40px;
            box-sizing: border-box;
            text-align: center;
            color: #ff7007;
            font-size: 16px;
            font-weight: 100;
          }
        }
        .centeright {
          width: 1027px;
          margin-left: 12px;
          height: 369px;
          border-radius: 8px;
        }
      }
      .bottom {
        margin: 0px 4px;
        margin-top: 24px;
        border-radius: 8px;
        width: 98%;
        display: flex;
        padding: 15px 28px;
        box-sizing: border-box;
        background-color: #ffffff;
        justify-content: space-between;
        .left {
          width: 770px;
          height: 138px;
          display: flex;
          flex-direction: column;
          .top {
            width: 770px;
            height: 72px;
            display: flex;
            align-items: center;
            .logo {
              width: 40px;
              height: 31px;
              background-image: url(./img/work.png);
              background-size: 100% 100%;
            }
            .words {
              font-size: 22px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #ff7007;
              white-space: nowrap;
              margin: 0px 10px;
              padding: 27px 0px;
            }
            #typeId {
              width: 200px;
              height: 39px;
              margin: 0 20px;
              border-radius: 20px;
              border: 1px solid #999999;
              text-indent: 2em;
              font-size: 12px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              cursor: pointer;
            }
            .btn {
              width: 106px;
              height: 39px;
              cursor: pointer;
              background: #fff1da;
              border-radius: 20px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ff7007;
              text-align: center;
              line-height: 39px;
            }
          }
          .bottom {
            width: 770px;
            height: 32px;
            display: flex;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            align-items: center;
            span:first-child {
              width: 80px;
              font-size: 14px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #ff7007;
            }
            ul {
              display: flex;
              li {
                margin-right: 32px;
                position: relative;
              }
            }
          }
        }
        .right {
          width:350px;
          display: flex;
          align-items: center;
          font-size: 17px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          line-height: 1.5em;
          color: #999999;
          .shareCode {
            width: 120px;
            height: 120px;
            background-image: url(./img/shareCode.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            margin-left: 12px;
          }
        }
      }
    }
  }
}
</style>
