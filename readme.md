# basic useage
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
        .to (self)=> vdom = self
        .inject((self)=>{
          self
            .style({
              background:"#eee"
            })
            .attr({
              onclick:()=>{
                num++
                vdom.redraw() //update dom by hand
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