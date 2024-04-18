//@ts-nocheck

import {t} from "../main"
let main = document.querySelector("#main")



let Box = () => {
  return t()
    .view((i) => {
      return i.style({
        margin:"1rem",
        padding:"1rem",
        background:"#eee",
        borderRadius:(i.vnode.params.isRound? "1rem":void 0),
        display:"inline-block",
        boxShadow:"0 0 1rem rgba(0,0,0,0.5)",
      })
  })
}

let num = 0
let arr = [1,2,3,4]
console.log(
t()
  .view((i) => {
    return i.children([
      Box()
        .inject((i) => {
          return i.tag("div")
          .style({
            background:(num % 2 === 0? "red" : null),
          })
          .children([
            num+"",
            arr.map((item) => {
              return Box()
                .inject((i) => {
                  return i.children(item+"")
              })
            }),
            Box()
              .inject((i) => {
                i.attr({
                  onclick: () => {
                    num++
                    console.log(num)
                    if (num < 5) {
                      arr.push(num)
                    }
                    else {
                      arr.pop()
                    }
                    return i.parent.redraw()
                  },
                  oncreate: (dom) => {
                    window.dom = dom
                    console.log(11,dom.parentNode)
                    return dom.onmouseover = () => {
                      return console.log("aaa")
                    }
                  },
                })
                .children("button"+num)
                if (num%2 === 0) {
                  return i.attr({
                    "data-hello":num,
                  })
                };return
            })
                
          ])
      })
        .param(() => {
          return ({isRound:true})
      })
    ])
})
  .mount(main)
)

