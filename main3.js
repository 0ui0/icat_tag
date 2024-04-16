var hasProp = ({}.constructor).hasOwn;
let main = document.querySelector("#main")

let Tag = class {
  constructor(tagName) {
    this.tagName = tagName || "div"
    this.attrs = {}
    this.events = {}
    this.children = []
    this.params = {}
    this.data = {}
  }

  view(fn) {
    this.render = function() {
      return fn(this)
    }
    return this
  }
  to(fn) {
    fn(this)
    return this
  }
  tag(tagName) {
    this.tagName = tagName
    return this
  }
  attr(key,value) {
    this.attrs[key] = value
    return this
  }
  send(obj) {
    this.params = obj
    return this
  }
  setData(obj) {
    this.data = obj
    return this
  }
  style(value) {
    this.attrs.style = value
    return this
  }
  event(key,value) {
    if(!(typeof value === "function")) {
      throw new Error("event must be a function")
    }
    this.events[key] = value
    return this
  }
  child(tag) {
    if (!(tag instanceof Tag)) {
      console.log(tag)
      throw new Error("tag is not instance of Tag")
    }
    this.children.push(tag)
    return this
  }
  text(text) {
    this.children = text
    return this
  }
  list(tags) {
    for (const tag of tags.flat()) {
      if (typeof tag === "string") {
        let tmp = new Tag()
          .view((m) => {
            return m.text(tag)
        })
        this.child(tmp)
      }
      else {
        this.child(tag)
      }
    } 
    return this
  }
  reset() {
    this.tagName = "div"
    this.attrs = {}
    this.children = []
    return this.render()
  }

  draw() {
    if (Object.prototype.toString.call(this.children) !== "[object Array]" || typeof this.children === "function") {
      this.dom ??= document.createTextNode("")
      if (typeof this.children === "function") {
        this.dom.data = this.children()
      }
      else {
        this.dom.data = this.children
      }
    }
    else {
      this.dom ??= document.createElement(this.tagName)
      this.dom.innerHTML = ""
      //复制属性
      let ref;for (const key in ref = this.attrs) {
        if (!hasProp(ref, key)) continue;
        const attr = ref[key];
        if (key === "style") {
          for (const key in attr) {
            if (!hasProp(attr, key)) continue;
            const value = attr[key];
            let ref1;if (typeof value === "function") {
              ref1 = value()
            }
            else {
              ref1 = value
            };this.dom.style[key] = ref1
          }
        }
        else {
          if (typeof attr === "function") {
            this.dom[key] = attr()
          }
          else {
            this.dom[key] = attr
          }
        }
      }
      //复制事件
      let ref2;for (const key in ref2 = this.events) {
        if (!hasProp(ref2, key)) continue;
        const event = ref2[key];
        this.dom[key] = event
      }
      //复制子节点
      for (const child of this.children) { this.dom.appendChild(child.dom) }
    }
    return this
  }
  redraw() {
    this.reset()
    if (typeof this.children === "object") {
      for (const child of this.children) {
        child.redraw()
      }
    }
    return this.draw()
  }
  mount(dom) {
    this.redraw()
    dom.innerHTML = ""
    dom.appendChild(this.dom)
    return this
  }
}

let num = 0
let btnTag = null
let arr = [1,2,3,4]
let arrTag = null

let Box = new Tag()
  .view((i) => {
    return i.style({
      background:"#eee",
      borderRadius:"10px",
      padding:"10px",
      margin:"10px",
      display:"inline-block",
      cursor:"pointer",
    })
    .list([
      i.params.name || "我是按钮"
    ])
})

Root = new Tag()
  .view((i) => {
    return i.list([
      Box.send({
        name:"呜啦啦啦" + num,
      })
      .event("onclick",function() {
        num++
        return i.redraw()
      }),
      new Tag()
        .view((i) => {
          return i.text(num)
      })
    ])
})
  .mount(main)

console.log(Root)

