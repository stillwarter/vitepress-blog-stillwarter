---
title: songs
date: 2023-05-12
outline: deep
tags:
  - Stu
  - 整点没用的
  - 半成品
---

# 整点没用的--歌词渲染器

在博客骨架构建好之后,想做些元素去装饰,比如做一个诗词渲染器,放到页面以示b格。后面碰巧又碰在jq库看到一个好看的色彩样式,所以就趁摸鱼的空挡coding...

演示demo--在我成为仅仅有条的大人之前:

ps:没做好暂停功能,暂停播放会导致歌词渲染无法对应歌词播放;在隐藏该窗口页的时候,动画渲染也会停止,所以会导致歌词无法对应...
<songs/>

源码后续更新... 

我的内容里可能有许多描述错误或不严谨的地方，请见谅，若有错误可以在[鱼排](https://fishpi.cn/member/stillwarter)指出！


## 1.字体极光

效果地址:<a style="cursor: pointer;" href="https://www.jq22.com/code4537"> 文字极光动画 </a>

效果通过四个移动的div实现,有趣的是,颜色并不会生硬的叠加或者改变,了解一下出现的陌生的css样式属性。

```css
.aurora__item {
  overflow: hidden;
  position: absolute;
  width: 60vw;
  height: 60vw;
  background-color: var(--clr-1);
  border-radius: 37% 29% 27% 27% / 28% 25% 41% 37%;
  filter: blur(var(--blur));
  mix-blend-mode: overlay;
}

.aurora__item:nth-of-type(1) {
  top: -50%;
  animation: aurora-border 6s ease-in-out infinite,
    aurora-1 12s ease-in-out infinite alternate;
}
```

- filter

滤镜属性,该属性可用将模糊或者颜色偏移等效果用于元素,这里的blur()是用于模糊图像。此外该属性还有很多其他的函数用法...
filter属性说明:<a style="cursor: pointer;" href="https://juejin.cn/post/7004379703255498759"> 彻底弄懂css filter滤镜 </a>

- mix-blend-mode

该属性描述了元素内容该与元素的直系父元素的内容和元素背景如何混合(有点像ps的图层叠加效果)。
mix-blend-mode属性说明:<a style="cursor: pointer;" href="https://juejin.cn/post/6902297128773779469"> CSS 之 mix-blend-mode</a>


## 2.文字动画

现在我们有了漂亮的文字颜色,该处理如何让文字动起来了。在很早的时候,我写过一个根据长度来显示文字的动画,不过效果很单薄,所以我想着换一种方式渲染文字--打字效果(感觉比较有质感?我觉得这样的效果好看)。

实现逻辑很简单,就是更新我们文字的最后一个字,然后操作dom重绘。

早先我用的settimeout,感觉不够顺滑,所以后来改用了requestAnimationFrame函数,这个函数可用根据当前显示器的刷新率进行高效的渲染绘制。有兴趣可以谷歌或百度自行了解。

```js
 /* 歌词渲染 */
function renderlyric() {
  let delay = 0;
  let lyricwordindex = 0;

  // 获取渲染时间
  let rendertime1 = new Date().getTime();

  // 渲染函数
  renderfn = () => {
    // 配合audio进行暂停
    if (audioflag == 1) {
      cancelAnimationFrame(render);
    } else {
      // 若当前歌词小于接口歌词，则word进行更新
      if (word.length < lyricword.length && delay % 6== 0 && !flag) {
        console.log("文字渲染");
        word.push(lyricword[lyricwordindex]);
        lyricwordindex++;
        title[0].childNodes[0].textContent = word.join("");
        // 若歌词长度等于歌词长度，则根据时间戳进行暂停（歌词停顿效果）
        if (word.length == lyricword.length) {
          flag = 1;
          cancelAnimationFrame(render);
          let rendertime2 = new Date().getTime();
          timer = getrenderlength() * 1000 - (rendertime2 - rendertime1) - 110;
          setTimeout(() => {
            delay++;
            requestAnimationFrame(renderfn);
          }, timer);
        } else {
          delay++;
          requestAnimationFrame(renderfn);
        }
      } 
      // 停顿后,由于flag状态改变,对歌词进行退步更新
      else if (flag && delay % 4 == 0) {
        word.pop();
        title[0].childNodes[0].textContent = word.join("");
        nextflag = 1;
        delay++;
        requestAnimationFrame(renderfn);
      } 
      // 歌词退完后,渲染下一条歌词
      else if (word.length == 0 && nextflag) {
        nextflag = 0;
        lyricwordindex = 0;
        lyriarrindex++;
        flag = 0;
        splicelyric(lyricarr[lyriarrindex], lyricarr[lyriarrindex + 1]);
        rendertime1 = new Date().getTime();
        delay++;
        requestAnimationFrame(renderfn);
      } else {
        delay++;
        requestAnimationFrame(renderfn);
      }
    }
  };
  render = requestAnimationFrame(renderfn);
}
```
偷懒直接将整个绘制函数复制下来...写的很臃肿很烂,很惭愧,我的代码功底很差,lecode懒得刷;OOP或者FP都看过,嗯现在还不会,还是等我先多啃几本书吧,现在还是用最简单的命令式。

希望有朝一日我的code能变得像哪些传道者一样简单又优雅吧。

## 3.获取资源

其实最开始的目标就是写一个文字渲染的脚本,这周五摸鱼的时候把写好的脚本给他看,他说你这个是酷我音乐歌词显示功能吗?

其实还真能试试,不过需要找找可以白嫖的api。

这里就一直百度和网易云api相关的内容,找了蛮久还是让我找到了能用的api,主要用于获取歌曲的歌词。

再稍微扩展一下就可以渲染不同歌曲的不同歌词力。

## 4.音频设置

最开始是使用的网易云的外链播放器,但是我不会如何去监听它。所以后面改为了原始的audio标签。

```html
<audio
    preload="auto"
    src="http://music.163.com/song/media/outer/url?id=416892104.mp3"
    controls
    @pause="onPause"
    @play="onPlay"
/>
```

## 5.待解决问题

- 歌词的渲染时间无法准确的对应歌曲
- 歌词渲染函数十分臃肿,应该进行优化或重构以便更好操作
- 无法根据音频播放器做到渲染的暂停和继续

不过我似乎有解决问题的思路,后面有时间改改吧。

## 附录

引用链接和资料查询:

- <a style="cursor: pointer;" href="https://www.jq22.com/code4537"> 文字极光动画 </a>


- <a style="cursor: pointer;" href="https://juejin.cn/post/7004379703255498759"> 彻底弄懂css filter滤镜 </a>

- <a style="cursor: pointer;" href="https://juejin.cn/post/6902297128773779469"> CSS 之 mix-blend-mode</a>

- <a style="cursor: pointer;" href="https://blog.csdn.net/qq_47703624/article/details/107556369?ydreferer=aHR0cHM6Ly9jbi5iaW5nLmNvbS8%3D?ydreferer=aHR0cHM6Ly9jbi5iaW5nLmNvbS8%3D">js获取audio进度时间</a>