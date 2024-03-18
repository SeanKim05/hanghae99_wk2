export function jsx(type, props, ...children) {
  return { type, props, children };
}

export function createElement(node) {
  if (typeof node === "string") {
    return document.createTextNode(node);
  }
  const $el = document.createElement(node.type);
  if (node.props) {
    Object.keys(node.props).forEach((key) => {
      $el.setAttribute(key, node.props[key]);
    });
  }
  if (node.children) {
    node.children.map(createElement).forEach($el.appendChild.bind($el));
  }
  return $el;
}

export function render(parent, newNode, oldNode = null) {
  if (!newNode && oldNode) {
    parent.removeChild(oldNode);
    return;
  }

  if (newNode && !oldNode) {
    const domElement = createElement(newNode);
    parent.appendChild(domElement);
    return;
  }

  if (
    typeof newNode === "string" &&
    typeof oldNode === "string" &&
    newNode !== oldNode
  ) {
    parent.replaceChild(document.createTextNode(newNode), oldNode);
    return;
  }

  if (
    newNode.type !== oldNode.type ||
    JSON.stringify(newNode.props) !== JSON.stringify(oldNode.props)
  ) {
    const domElement = createElement(newNode);
    parent.replaceChild(domElement, oldNode);
    return;
  }

  if (typeof newNode !== "string") {
    updateAttributes(oldNode, newNode.props, oldNode.props);

    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    for (let i = 0; i < Math.max(newLength, oldLength); i++) {
      render(oldNode, newNode.children[i], oldNode.children[i]);
    }
  }
}
