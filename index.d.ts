export interface IObserver {
  onStateUpdate: () => void;
  onObserverWillDestroy: (() => void) | undefined;
}