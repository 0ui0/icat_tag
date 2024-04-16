//@ts-nocheck

var hasProp = ({}.constructor).hasOwn;
const main = document.querySelector("#main")

const Tag = class {
  constructor() {
    this.initVnode()
    this.data = {}
    this.render = null
    this.dom = null
  }
  initVnode() {
    let ref;return ((ref = this).vnode = {
        tagName:"div",
        attrs:{},
        params:{},
        children:[],
    },ref)
  }
        
  view(fn) {
    let ref1;return ((ref1 = this).render = () => fn(this),ref1)
  }
  param(paramObj) {
    let ref2;return ((ref2 = this).vnode.params = {
        ...this.vnode.params,
        ...param
      },ref2)
  }
  to(fn) {
    fn(this)
    return this
  }
  tag(name) {
    let ref3;return ((ref3 = this).vnode.tagName = name,ref3)
  }
  attr(attrObj) {
    if (attrObj.style) {
      throw new Error("please use style replace attr")
    }
    let ref4;((ref4 = this).vnode.attrs = {
        ...this.vnode.attrs,
        ...attrObj
      },ref4)
    console.log(this.vnode.attrs)
    return this
  }
  style(styleObj) {
    let ref5;return ((ref5 = this).vnode.attrs.style = {
        ...this.vnode.attrs.style,
        ...styleObj
      },ref5)
  }
  child(tag) {
    let m;if(m = typeof tag,m === "string") {
        this.vnode.children.push(new Tag().view($ => $.text(tag)))}
else  {
        if (!(tag instanceof Tag)) {
          console.error(tag)
          throw new Error("tag not instance of Tag")
        }
        this.vnode.children.push(tag)
      }
    return this
  }
  text(str) {
    this.vnode.children = str
    return this
  }
  children(children) {
    for (const child of children) { this.child(child) }
    return this
  }
  draw() {
    let m1;if(m1 = typeof this.vnode.children,m1 === "string") {
        this.dom ??= document.createTextNode("")
        this.dom.data = this.vnode.children}
else  {
        this.dom ??= document.createElement(this.vnode.tagName)

        if (this.dom && this.dom.tagName.toLowerCase() !== this.vnode.tagName) {
          let parent = this.dom.parentNode
          parent.removeChild(this.dom) 
          this.dom = document.createElement(this.vnode.tagName)
          parent.appendChild(this.dom)
        }
          
        this.dom.innerHTML = ""
        let ref6;for (const key in ref6 = this.vnode.attrs) {
          if (!hasProp(ref6, key)) continue;
          const attr = ref6[key];
          if (key === "style") {
            for (const name in attr) {
              if (!hasProp(attr, name)) continue;
              const value = attr[name];
              this.dom.style[name] = value
            }
          }
          else {
            this.dom[key] = attr
          }
        }
        for (const child of this.vnode.children) { this.dom.appendChild(child.dom) }
      }
    return this
  }
  redraw() {
    this.initVnode()
    this.render()
    if (typeof this.vnode.children !== "string") {
      for (const child of this.vnode.children) {
        child.redraw()
      }
    }
    this.draw()
    return this
  }
  mount(dom) {
    this.redraw()
    dom.innerHTML = ""
    dom.appendChild(this.dom)
    return this
  }
}

let num = 0
let textVnode = null
let buttonVnode = null
let x1 = 0
let root = null
console.log(
  root = new Tag()
    .view((i) => {
      return i.tag("div")
        .style({
          background:"#eee",
          width:"100px",
          height:"100px",
          borderRadius:"10px",
          cursor:"pointer",
      })
        .children([
          new Tag()
            .view($1 => $1.text("我是一段文本"+num))
            .to(function(i) {
              return textVnode = i
          }),

          (x1?
            new Tag().view($2 => $2.text("x1"))
          :
            new Tag().view($3 => $3.text("x2"))),
            
          new Tag()
            .to(function(i) {
              return buttonVnode = i
          })
            .view(function(i) {
              return i.tag("button")
              .children("我是一个按钮"+num)
              .attr({
                onclick:function() {
                  num++
                  x1 = !x1
                  root.redraw()
                  console.log(num)
                  buttonVnode.redraw()
                  return textVnode.redraw()
                },
              })
          })
        ])
  })
    .mount(main)
)