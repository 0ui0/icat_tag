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
      })
      .children("我是一个div")
  })
}

console.log(
t()
  .view((i) => {
    return i.children([
      Box()
        .inject((i) => {
          return i.tag("div")
      })
        .param(() => {
          return ({isRound:true})
      })
    ])
})
  .mount(main)
)
