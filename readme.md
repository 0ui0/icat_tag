# basic useage

## 方法介绍
### 方法总览
t().to()
t().view()
t().tag()
t().attr()
t().child()
t().children()
t().param()
t().style()
t().inject()
t().draw()
t().redraw()
t().mount()
### t()
创建一个虚拟节点，调用new Tag()
### t().to((self)=>{})
通过回调函数的self将自己暴露给外部，可以卸载渲染函数外，也可以写在渲染函数里
### t().view((self)=>{})
渲染函数，控制内部的render方法，每次重绘都会从新构建虚拟节点（内部的vnode属性）
### t().tag(tagName)
定义虚拟标签的tagName 例如 div button input等
√必须写在渲染函数里
### t().style({margin:"10px"})
定义虚拟标签的style属性
√必须写在渲染函数里
### t().attr({onclick:=>})
定义虚拟标签的attribute，即属性，例如 class,onclick,onmouseover,type
对应标签的`<div class="" type="" onclick="" onmouseover=""></div>`
√必须写在渲染函数里
### t().children([tag1,tag2,t(),t(),"text"])
定义虚拟标签的子节点，是一个数组，每个元素必须是字符串，或者是Tag的实例
√必须写在渲染函数里
### t().child
内部方法
√必须写在渲染函数里
### t().param(()=>{return {a:12,b:5}})
当t()作为组件的时候，通过该方法给组件传参数
x 必须写在渲染函数外部
### t().inject()
用法类似t().view()，在调用组件的时候使用，顾名思义，在组件原有view的基础上，给组件注入新的view
和view不同的是，view会直接覆盖内部的render方法，而inject是在原有的基础上追加
范例里通过该方法修改了comp1的background
x 必须写在渲染函数外部，约等于渲染函数
### t().draw()
内部方法 立即通过虚拟dom重新生成新的真实dom
x 必须写在渲染函数外
### t().redraw()
递归根据自身及其子节点的渲染函数重绘画面
会重新生成虚拟dom
会根据生成的虚拟dom调用其draw()方法生成真实dom
x必须写在渲染函数外
### t().mount(dom)
将组件挂载到html的dom标签里
x必须写在渲染函数外



```javascript
import {t} from icat_tag

let comp1 = ()=>{
  let num = 0
  return t()
    .view((self)=>{
      self
        .tag("div")
        .style({
          width:"100px",
          height:"100px",
          background:"red"
        })
        .children([
          self.params.content || "comp1"
        ])
    })
}

let root = document.quertSelecotr("#root")

let num = 0
let vdom = null


t()
  .view((self)=>{
    self.children([
      comp1()
      comp1()
        .to((self)=> vdom = self)
        .inject((self)=>{
          self
            .style({
              background:"#eee"
            })
            .attr({
              onclick:()=>{
                num++
                vdom.redraw() //update dom by hand
              },
              oncreate:(dom)=>{
                //dom operation
              }
            })
        .param ()=>{
          content:"click"+num
        }
          
        })
    ])
  })
  .mount(root)



```