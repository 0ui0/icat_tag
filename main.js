// Generated by CoffeeScript 2.6.1
var Tag, t,
  hasProp = {}.hasOwnProperty;

import checkType from "icat_checkType";

Tag = class {
  constructor() {
    this.initVnode();
    this.render = function() {};
    this.dom = null;
    this.html = "";
    this.initParams = function() {};
    this.parent = null;
  }

  initVnode() {
    this.vnode = {
      tagName: "div",
      attrs: {},
      params: {},
      children: []
    };
    return this;
  }

  view(fn) {
    checkType(arguments, ["function"], "Tag.view()");
    this.render = function() {
      this.initParams();
      return fn(this);
    };
    return this;
  }

  inject(fn) {
    var oldRender;
    checkType(arguments, ["function"], "Tag.inject()");
    oldRender = this.render;
    this.render = function() {
      oldRender.call(this);
      return fn(this);
    };
    return this;
  }

  param(paramFn) {
    checkType(arguments, ["function"], "Tag.param()");
    this.initParams = function() {
      return this.vnode.params = {...this.vnode.params, ...paramFn()};
    };
    return this;
  }

  to(fn) {
    checkType(arguments, ["function"], "Tag.to()");
    fn(this);
    return this;
  }

  tag(name) {
    checkType(arguments, ["string"], "Tag.tag(name)");
    this.vnode.tagName = name;
    return this;
  }

  $tag(nameFn) {
    checkType(arguments, ["function"], "Tag.$tag()");
    this.inject((self) => {
      return self.tag(nameFn(this));
    });
    return this;
  }

  $attr(attrObjFn) {
    checkType(arguments, ["function"], "Tag.$attr()");
    this.inject((self) => {
      return self.attr(attrObjFn(this));
    });
    return this;
  }

  $style(styleObjFn) {
    checkType(arguments, ["function"], "Tag.$style()");
    this.inject((self) => {
      return self.style(styleObjFn(this));
    });
    return this;
  }

  $children(tagArrFn) {
    checkType(arguments, ["function"], "Tag.$children()");
    this.inject((self) => {
      return self.children(tagArrFn(this));
    });
    return this;
  }

  $inner(tagArrFn) {
    return this.$children(tagArrFn);
  }

  setParent(tag) {
    checkType(arguments, ["object"], "Tag.setParent(tag)");
    this.parent = tag;
    return this;
  }

  attr(attrObj) {
    checkType(arguments, ["object"], "Tag.attr(attrObj)");
    if (attrObj.style) {
      throw new Error("please use style replace attr");
    }
    this.vnode.attrs = {...this.vnode.attrs, ...attrObj};
    return this;
  }

  style(styleObj) {
    checkType(arguments, ["object"], "Tag.style(styleObj)");
    this.vnode.attrs.style = {...this.vnode.attrs.style, ...styleObj};
    return this;
  }

  clone() {
    var clone;
    clone = new Tag();
    clone.initParams = this.initParams;
    clone.render = this.render;
    clone.parent = this.parent;
    clone.vnode = JSON.parse(JSON.stringify(this.vnode));
    return clone;
  }

  child(tag) {
    checkType(arguments, [["object", "string", "number", "null"]], "Tag.child(tag)");
    if (!Tag) {
      return;
    }
    switch (typeof tag) {
      case "string":
      case "number":
        this.vnode.children.push(new Tag().view((self) => {
          return self.text(tag).setParent(this);
        }));
        break;
      default:
        if (!(tag instanceof Tag)) {
          console.error(tag);
          throw new Error("tag not instance of Tag");
        }
        this.vnode.children.push(tag.setParent(this));
    }
    return this;
  }

  text(str) {
    checkType(arguments, [["string", "number"]], "Tag.text(str)");
    this.vnode.children = str;
    return this;
  }

  children(children) {
    var child, i, len, ref;
    checkType(arguments, [["array", "string", "number", "null"]], "Tag.children()");
    if (typeof children === "string" || typeof children === "number") {
      this.child(children);
    } else {
      ref = children.flat();
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        this.child(child);
      }
    }
    return this;
  }

  draw() {
    var attr, key, parent, ref;
    switch (typeof this.vnode.children) {
      case "string":
      case "number":
        if (this.dom == null) {
          this.dom = document.createTextNode("");
        }
        if (this.dom) {
          parent = this.dom.parentNode;
          if (parent) {
            parent.removeChild(this.dom);
            this.dom = document.createTextNode("");
            this.dom.parentNode.appendChild(this.dom);
          }
        }
        this.dom.data = String(this.vnode.children);
        this.html = String(this.vnode.children);
        break;
      default:
        if (this.dom == null) {
          this.dom = document.createElement(this.vnode.tagName);
        }
        if (this.dom && this.dom.tagName.toLowerCase() !== this.vnode.tagName) {
          parent = this.dom.parentNode;
          if (parent) {
            parent.removeChild(this.dom);
            this.dom = document.createElement(this.vnode.tagName);
            parent.appendChild(this.dom);
          }
        }
        ref = this.vnode.attrs;
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          attr = ref[key];
          ((key, attr) => {
            var name, results, value;
            if (key === "style") {
              if (typeof attr === "string") {
                return this.dom.style = attr;
              } else {
                results = [];
                for (name in attr) {
                  if (!hasProp.call(attr, name)) continue;
                  value = attr[name];
                  results.push(((name, value) => {
                    return this.dom.style[name] = value;
                  })(name, value));
                }
                return results;
              }
            } else {
              if (key.match(/^data-/g)) {
                return this.dom.setAttribute(key, attr);
              } else {
                return this.dom[key] = attr;
              }
            }
          })(key, attr);
        }
    }
    return this;
  }

  drawChildren() {
    var child, i, len, ref;
    if (typeof this.vnode.children !== "string" && typeof this.vnode.children !== "number") {
      this.dom.innerHTML = "";
      ref = this.vnode.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        this.dom.appendChild(child.dom);
      }
    }
    return this;
  }

  redraw() {
    var child, i, len, ref;
    this.initVnode();
    this.render();
    if (typeof this.vnode.children !== "string" && typeof this.vnode.children !== "number") {
      ref = this.vnode.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        ((child) => {
          return child.redraw();
        })(child);
      }
    }
    this.draw();
    this.drawChildren();
    if (this.vnode.attrs.oncreate) {
      this.vnode.attrs.oncreate(this.dom, this);
    }
    return this;
  }

  mount(dom) {
    checkType(arguments, [["htmldivelement", "htmlhtmlelement"]], "Tag.mount()");
    this.redraw();
    dom.innerHTML = "";
    dom.appendChild(this.dom);
    return this;
  }

};

t = function() {
  return new Tag();
};

t.Tag = Tag;

Tag.prototype.视图 = Tag.prototype.view;

Tag.prototype.注入 = Tag.prototype.inject;

Tag.prototype.样式 = Tag.prototype.style;

Tag.prototype.参数 = Tag.prototype.param;

Tag.prototype.传递 = Tag.prototype.to;

Tag.prototype.标签 = Tag.prototype.tag;

Tag.prototype.$标签 = Tag.prototype.$tag;

Tag.prototype.属性 = Tag.prototype.attr;

Tag.prototype.$属性 = Tag.prototype.$attr;

Tag.prototype.子树 = Tag.prototype.children;

Tag.prototype.$子树 = Tag.prototype.$children;

Tag.prototype.克隆 = Tag.prototype.clone;

Tag.prototype.文本 = Tag.prototype.text;

Tag.prototype.绘制 = Tag.prototype.draw;

Tag.prototype.重绘 = Tag.prototype.redraw;

Tag.prototype.挂载 = Tag.prototype.mount;

export default t;

export {
  Tag,
  t
};
