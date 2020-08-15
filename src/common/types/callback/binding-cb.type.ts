type BindingCb = () => void;
type BindingCbWithOne<T> = (arg: T) => void;

export { BindingCb, BindingCbWithOne };
