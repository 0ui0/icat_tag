//@ts-nocheck

var hasProp = ({}.constructor).hasOwn;
import checkType from "icat_checkType"

const Tag = class {
  constructor() {
    this.initVnode()
    this.render = function() {}
    this.dom = null
    this.initParams = function() {}
    this.parent = null
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
    checkType(arguments,["function"],"Tag.view()")
    this.render = function() {
      this.initParams()
      return fn(this)
    }
    return this
  }
  inject(fn) {
    checkType(arguments,["function"],"Tag.inject()")
    let oldRender = this.render
    this.render = function() {
      oldRender.call(this)
      return fn(this)
    }
    return this
  }
  param(paramFn) {
    checkType(arguments,["function"],"Tag.param()")
    this.initParams = function() {
      return this.vnode.params = {
        ...this.vnode.params,
        ...paramFn()
      }
    }
    return this
  }
  to(fn) {
    checkType(arguments,["function"],"Tag.to()")
    fn(this)
    return this
  }
  tag(name) {
    checkType(arguments,["string"],"Tag.tag(name)")
    this.vnode.tagName = name
    return this
  }
  $tag(name) {
    this.inject((self) => {
      return self.tag(name)
    })
    return this
  }
  $attr(attrObj) {
    this.inject((self) => {
      return self.attr(attrObj)
    })
    return this
  }
  $style(styleObj) {
    this.inject((self) => {
      return self.style(styleObj)
    })
    return this
  }
  $children(tagArr) {
    this.inject((self) => {
      return self.children(tagArr)
    })
    return this
  }

  setParent(tag) {
    checkType(arguments,["object"],"Tag.setParent(tag)")
    this.parent = tag
    return this
  }
  attr(attrObj) {
    checkType(arguments,["object"],"Tag.attr(attrObj)")
    if (attrObj.style) {
      throw new Error("please use style replace attr")
    }
    let ref1;((ref1 = this).vnode.attrs = {
        ...this.vnode.attrs,
        ...attrObj
      },ref1)
    return this
  }
  style(styleObj) {
    checkType(arguments,["object"],"Tag.style(styleObj)")
    let ref2;return ((ref2 = this).vnode.attrs.style = {
        ...this.vnode.attrs.style,
        ...styleObj
      },ref2)
  }
  clone() {
    let clone = new Tag()
    clone.initParams = this.initParams
    clone.render = this.render
    clone.parent = this.parent
    clone.vnode = JSON.parse(JSON.stringify(this.vnode))
    return clone
  }


  child(tag) {
    checkType(arguments,[["object","string"]],"Tag.child(tag)")

    let m;if(m = typeof tag,m === "string" || m === "number") {
        return this.vnode.children.push(new Tag().view($ => $.text(tag).setParent(this)))}
else  {
        if (!(tag instanceof Tag)) {
          console.error(tag)
          throw new Error("tag not instance of Tag")
        }
        return this.vnode.children.push(tag.setParent(this))
      }
  }
  text(str) {
    checkType(arguments,["string"],"Tag.text(str)")
    this.vnode.children = str
    return this
  }
  children(children) {
    checkType(arguments,[["array","string"]],"Tag.children()")
    if (typeof children === "string" || typeof children === "number") {
      this.child(children)
    }
    else {
      for (const child of children.flat()) {
        this.child(child)
      }
    }
    return this
  }
  draw() {
    let m1;if(m1 = typeof this.vnode.children,m1 === "string") {
        this.dom ??= document.createTextNode("")
        if (this.dom) {
          let parent = this.dom.parentNode
          if (parent) {
            parent.removeChild(this.dom)
            this.dom = document.createTextNode("")
            this.dom.parentNode.appendChild(this.dom)
          }
        }
            
        this.dom.data = this.vnode.children}
else  {
        this.dom ??= document.createElement(this.vnode.tagName)
        if (this.dom && this.dom.tagName.toLowerCase() !== this.vnode.tagName) {
          let parent = this.dom.parentNode
          if (parent) {
            parent.removeChild(this.dom) 
            this.dom = document.createElement(this.vnode.tagName)
            parent.appendChild(this.dom)
          }
        }
        this.dom.innerHTML = ""
        
        let ref3;for (const key in ref3 = this.vnode.attrs) {
          if (!hasProp(ref3, key)) continue;
          const attr = ref3[key];
          if (key === "style") {
            if (typeof (attr) === "string") {
              this.dom.style = attr
            }
            else {
              for (const name in attr) {
                if (!hasProp(attr, name)) continue;
                const value = attr[name];
                this.dom.style[name] = value
              }
            }
          }
          else {
            if (key.match(/^data-/g)) {
              this.dom.setAttribute(key,attr)
            }
            else {
              this.dom[key] = attr
            }
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
    if (this.vnode.attrs.oncreate) {
      this.vnode.attrs.oncreate(this.dom)
    }
    return this
  }
  mount(dom) {
    checkType(arguments,[["htmldivelement","htmlhtmlelement"]],"Tag.mount()")
    this.redraw()
    dom.innerHTML = ""
    dom.appendChild(this.dom)
    return this
  }
}

const t = function() { return new Tag() }
t.Tag = Tag

Tag.prototype.视图 = Tag.prototype.view
Tag.prototype.注入 = Tag.prototype.inject
Tag.prototype.样式 = Tag.prototype.style
Tag.prototype.参数 = Tag.prototype.param
Tag.prototype.传递 = Tag.prototype.to
Tag.prototype.标签 = Tag.prototype.tag 
Tag.prototype.$标签 = Tag.prototype.$tag
Tag.prototype.属性 = Tag.prototype.attr 
Tag.prototype.$属性 = Tag.prototype.$attr
Tag.prototype.子树 = Tag.prototype.children
Tag.prototype.$子树 = Tag.prototype.$children
Tag.prototype.克隆 = Tag.prototype.clone
Tag.prototype.文本 = Tag.prototype.text
Tag.prototype.绘制 = Tag.prototype.draw
Tag.prototype.重绘 = Tag.prototype.redraw
Tag.prototype.挂载 = Tag.prototype.mount



export default t
export {Tag,t}



