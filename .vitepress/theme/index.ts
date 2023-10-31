// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import myLayout from "./components/myLayout.vue"
import './style.css'

import tags from './components/tags.vue'
import archives from './components/archives.vue'
import home from './components/home.vue'
import teancherandfrends from './components/teachersandfrends.vue'
import plan from './components/plan.vue'
import log from './components/log.vue'

import threeDemo from "./mycomponents/Demo/threeDemo.vue"
import gwycomDemo from "./mycomponents/Demo/gwycom.vue"
import tensorflowDemo from "./mycomponents/Demo/tensorflowDemo.vue"
import webgpuDemo from "./mycomponents/Demo/webgpudemo.vue"
import pixelDemo from "./mycomponents/Demo/pixelDemo.vue"
import resume from "./mycomponents/Demo/resume.vue"

import songs from "./mycomponents/Funny/songs.vue"

import basictriangle from "./mycomponents/Demo/webgpudemo/basictriangle.vue"

import pixeltool from "./mycomponents/Tool/pixeltool.vue"

import mycolorpicker from "./mycomponents/Tool/components/mycolorpicker.vue"

import littlejstart from "./mycomponents/Demo/littlejs/littlejstart.vue"


export default {
  ...Theme,
  
  Layout: myLayout,
 
  enhanceApp({ app, router, siteData }) {
    // nav vuecomponts
    app.component("tags",tags);
    app.component("archives",archives);
    app.component("home",home);
    app.component("teancherandfrends",teancherandfrends);
    app.component("plan",plan);
    app.component("log",log);

    // demo
    app.component("threeDemo",threeDemo);
    app.component("gwycomDemo",gwycomDemo);
    app.component("tensorflowDemo",tensorflowDemo);
    app.component("webgpudemo",webgpuDemo);
    app.component("littlejstart",littlejstart);
    app.component("resume",resume)

    // 整点没用的
    app.component("songs",songs)

    // webgpu
     app.component("basictriangle",basictriangle)

     // 像素探索
     app.component("pixelDemo",pixelDemo)

    // tool
    app.component("pixeltool",pixeltool);

    //
    app.component("mycolorpicker",mycolorpicker)
  }
}
