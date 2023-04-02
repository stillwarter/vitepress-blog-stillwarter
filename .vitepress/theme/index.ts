// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import myLayout from "./components/myLayout.vue";
import './style.css'

import tags from './components/tags.vue'
import archives from './components/archives.vue'
import home from './components/home.vue'

import threeDemo from "./mycomponents/Demo/threeDemo.vue";
import gwycomDemo from "./mycomponents/Demo/gwycom.vue";





export default {
  ...Theme,
  
  Layout: myLayout,
 
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component("tags",tags);
    app.component("archives",archives);
    app.component("home",home);

    // ...
    app.component("threeDemo",threeDemo);
    app.component("gwycomDemo",gwycomDemo);

  }
}
