export interface Observer {
  onStateUpdate: () => void;
  onObserverWillDestroy: (() => void) | undefined;
}