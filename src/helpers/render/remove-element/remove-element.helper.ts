import Abstract from '~/view/abstract/abstract';

const removeElement = (component: Abstract | null) => {
  if (component === null) {
    return;
  }

  component.node.remove();

  component.removeElement();
};

export { removeElement };
