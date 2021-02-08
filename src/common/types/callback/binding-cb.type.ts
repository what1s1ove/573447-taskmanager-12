type BindingCb = () => void;
type BindingCbWithOne<T> = (arg: T) => void;
type BindingCbWithTwo<T, P> = (argOne: T, argTwo: P) => void;
type BindingCbWithThree<T, P, U> = (argOne: T, argTwo: P, argThree: U) => void;

export {
  BindingCb, BindingCbWithOne, BindingCbWithTwo, BindingCbWithThree
};
