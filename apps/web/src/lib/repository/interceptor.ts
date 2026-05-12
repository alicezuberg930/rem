type InterceptorAction<T> = {
  onFulfilled?: (value: T) => T | Promise<T>
  onRejected?: (error: unknown) => unknown
}

export class InterceptorManager<T> {
  private handlers: InterceptorAction<T>[] = []

  use(
    onFulfilled?: InterceptorAction<T>['onFulfilled'],
    onRejected?: InterceptorAction<T>['onRejected']
  ) {
    this.handlers.push({ onFulfilled, onRejected })
    return this.handlers.length - 1
  }

  getHandlers() {
    return this.handlers
  }
}
