

import {t} from "../main"
main = document.querySelector "#main"

Box = ()=>
  t()
    .$style ()=>
      margin:"1rem"
      background:"#eee"
      border:"0.1rem solid #ccc"
      fontSize:"1.6rem"
    .$inner ()=> "hello"

num = 0
x = null


tmp = Box()
  .$inner ()=> [
    Box().$inner ()=>"呜啊拉拉"
    Box().$inner ()=>"呜啦啦啦"
    Box()
      .$inner ()=>"我是按钮"+num
      .$attr (i)=>
        onclick: =>
          num++
          i.redraw()
        oncreate: (dom)=>
          dom.onmouseover = =>
            console.log(111)
  ]
  .mount main

console.log tmp

