import { defineConfig } from "vitepress";

import { getPosts, getPostLength } from "./theme/serverUtils";

async function config() {
  return {
    title: "🍂 stillwarter",
    description: "A VitePress Site",
    head: [["link", { rel: "icon", href: "/catear.gif" }]],
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
        { text: "📈计划", link: "/plan" },
        { text: "🗃️标签", link: "/tag" },
        { text: "📖文章", link: "/archives" },
        {text:"📔友人帐",link:"/teancherandfrends"}
      ],

      posts: await getPosts(),
      postslength: await getPostLength(),
      socialLinks: [
        { icon: "github", link: "https://github.com/stillwarter" },
        {
          icon: {
            svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="body_1" width="48" height="48"><g transform="matrix(1.3333334 0 0 1.3333334 0 0)"><image  x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAlcSURBVGhDxVoJVJNXFv5REwRxr4B1qlL2RUJYEkIggBWhbiwSwIGqbSdAj4gsUrSyDJsCRikoA1W0ooBaxM6Mpa2trT1nSrFje2bGEW2nc3qcmSOtFKW4oBTqnXdf/lAIfyAJxN5zvsOf5M9797vv3vu+9wemvr6eSU9PNwhpaWlM6tatTGrqViYzM5O3KyfXobhkzxrlvoqUyqrqwqqDNfsIlK9XVefvVe5PKiouWZmdvcOmqanJBAAYQ3D+/Pmh+fGaiYyMZCZgs81nzIz4zWKbQ06ugisCT/E9Tx8/8BL5g5dYAyIp4Geu7l49suCQy+XKioq2tvaQhw8fTudyVBtyc3PZqRnVdWxsLPtSdzMzn2Fna+dYLpbI/isLDgXZ8lAICAoB/8AVIJU9NybwHknAcvDw8qWkouQbvjpUd/S1W11d1lwOa6KwsJD1glFd60OAzzddYGvvpPQLWH43kDjtHxjC6aQ+EElk4O4phpVha7+vO3JsR19fnxmX42oYTGCBpfV6EvEbgcvDdIq0vhD7BYK7UAxxv930t8tffCnjch6hN4EpU6ZMs7N3qsBUwTThmlxf4Dg+vjKaRt6kPnylQUOfYf0QMgPH6hu2T5jAtGm8WW7unucCnwsD6SRFXeIfDCtC18Dpt85AReVBeFnxCn2NRASevuBJ6sJbHEBWQwRFJaW1g4ODUwwigM67C30+wZThcmQiwOL9feFu4o/Kurp+gM/aP4fDdW9CWsarsDYimqaUk5sQcvIKGoaT0IkASRveMoHne8ZwXg2MdkPTKUpA0+7fvw//+ubfUEBIOrkKoWRPeQ15W3cCdg7OB2nacEw8WfCVBgPpZvCPK/+kTmvaO63vwfOrI2h9YHE3NJ5MJ2+PT8DSamEstkipbPI7jSYw76Nj4qG3967Ka2K9vb2wK7cAhN4S6jzdN0jdkOufvv32hlipVLKechDgm5pa+UoDb01WtxkP6BymUm5+Ees+wJ07PZCw6WWyY3vTPQKdx3pwdvOEV1LS/p6Tk2PKujuagL2jS40x814bPLwkcKblbZYCwIMHD+BgdS1ERMVCEEnlyOg4INIDQleFg8DDK411dySBGTMsnEja/GSMTWo8qPeBv3zaxlJQGdFJ0Nn5HTzo66Ovaw8dAUcXwfc8Pn/uKAIk+rWq3OeexNjANMG/zWfOUme57PHjx7BxswIsrZ/OGCIQEyMnlyZPkSj0/BrRVwPnxpVAxZq8ZRt88OFHdH8YGBiEgcFBuHWrC1re/hOsi5STuhFdI07zCgoKGGb9+vXMrNlzN0529LFFokMYWQQWI9d9XFBJbymEhK2FuPhNFCFhayg5HFMWvBJ4PL40Pz+fYaKjo5mlz9o3o9bhGkwfoNOoZVDj4HXY6nAIJ4W4Jjwaglc8r5IL5DMf3wDO72sCnUXNhMBr9fsYbEurp/fk5eUxTHx8wkw3gdd/Jto68dCCjiUmp1Cdc/2rr+FOTw8QeQz37t2Hm52d0H7pc6iuOQTxL7xIyWBEucYaDwFkBewcXNpoDSgSk0RkoEFDxRpGGnv5xhcV0PZZO1tuYxvRNvBpWzukpGZQ8YYR1qf+8F43gXd3aVmZFbMtLWMzRoPrxvGAeY25WlF5APr7+1n39DMsVixM3Au45uAEIUB26seVlQckTPbOXcUoXzVvQpa4E2J0ND9DoPP4vdPNLawrhtsP3d1UhWJ9cM3FBQxc7RuH45jc/MI6LgLoYMyGF2BDwmbwILpkOBFMGyHJ31Mk1yfLMK2oBtKxLjD1jhytT2XyC4pPcaWQSBIIVzuu0dRoJts8OXzTXMf38a9yfyU79eTZo0f9NGDaVn04sNWSU9trWgmgGjzR0MQOTTQ60SeNRL+HrlpHu4ghOY9dKDVtO3Rcu86+M9qyd+botApDBEgKHeFKIcz/6Nh4eKThaPft23DzZif7Sj/blpEFc+YvhIKiX05jw+3u3Xuwem0UiIf1fG1gU2gbs2NnTgkXAQSuwoWPL7LDT9wuf/ElXQFth5iTp5vpJsjliybYIt5A2mjmS9raKN6UkooHIeMbbnqrMPqsqBsbtI1CZdUBKdnIkn3JRvYz10am1jNYzMY2Uos0+rpsaHjPMoH37bKycmsmPiFhFpES//PXIiXwPHr02HF2GuMYSmiMKNf8XEApYe/oeolICRNGLo9mbGwdzmoTc9gyjUngwkcXadrgIZ9rfi5QMWe9qJyKOSqn58x7SZucRgL1JxrZ6X6xc++8Sw/gEzEcQ33m5ZpbG6ic5pvKqJyWy+WMiYmJFRmolyv/kMCJxpPslCo7TvYHPGRjmzWkS+Gesr+iikrv4TJZF6Bq9hL5fU0ONHx6oFEfKR2cXI9yrQISaDp5mp2aLDlxGNsuRg7lM24oKKHfff8D+PHHsVcEH1j9+VwryOMS6LjYJDTnGw/40OGZJTbZ6POIM7GFxcxlZAUGNFcBJ2o5+0fqwNWrHXT5NJccSQi9/WD1uiiyk+ZC/fFGmtvtl/5KD+pnyPcLi0vp4QaLVdcDjSbwcT5ZsW4+3/SpUQTQVKsw8rEK7ni7S/fCFbL5hEfF0IOItlaHxFAGoKrEwwrei+SwPaIgFOmZ65rAp4WLlzxLo482ioDp9OmLJP5BtzVPZ5invmyxaXPe2MCVJ7nfMXXqVDPW3dEE0KwXLuI84BuSr5MFDBoJ6s9z5s4LYN2kxkkAjaRSnbEf7uoDNnV2su4NmVYCZJmmuwt9Lv4ajxk1gY8WHZ3djrGujTCtBNB4PP48Dy/xJW0b3JMARt7FzaMFf69g3RphYxJAIyTmuwu9LzzpdMKcxzmdXJYd1+Y82rgE0DCdSE28gSvxJB67BwStpFhqY0d0wtimEwG1YXci7fQ7JGKMVkqjTmrOR+x/fd78BaHstGOaXgTQcJ8gq1FDDhSPJosIrio67ucf3GNja180jcebzU43rulNQG1EdrjZO7pUkxXpQiLq35B1IYT34L347wn4PZEk4AaR8yVmZuZL2OF1NkogIiKCfWmQWVrMnB2/eKlto7Ob8BsiGfpRQqB84AJ+JvAU9zm5CjoWPbP0sJm5BU4+SzWU/kb/2aOuro5JTk42CElJSYxC8TsmMTGRSUlJMc/KetU9L79AXrKnLKtcWbFXue/1PxBUlyv3lxbvLk3PzcsPz9ye5bxlyxa+QqEg31XQMbjG1gWtra3M/wHGwuS85LYjygAAAABJRU5ErkJggg==" preserveAspectRatio="none" width="15" height="15"/></g></svg>'
          },
          link: "https://fishpi.cn",
        },
      ],
    },
  };
}

export default config();
