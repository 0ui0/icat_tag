//@ts-nocheck

import {t} from "../main"
let main = document.querySelector("#main")

let Box = () => {
  return t()
    .$style({
      margin:"1rem",
      background:"#eee",
      border:"0.1rem solid #ccc"
    })
}

Box()
  .$children([
    Box().$children("呜啦啦啦"),
    Box().$children("呜啦啦啦"),
    24
  ])
  .mount(main)