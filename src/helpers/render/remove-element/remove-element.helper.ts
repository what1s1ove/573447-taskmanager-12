import Abstract from '~/view/abstract/abstract';

const removeElement = (component: Abstract) => {
  component.node.remove();

  component.removeElement();
};

export { removeElement };
