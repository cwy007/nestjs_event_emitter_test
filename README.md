# nestjs + @nestjs/event-emitter

## 1. 使用场景 (Use Cases)

- **模块解耦**：当一个业务操作（如用户注册）需要触发多个其他模块的逻辑（如发送欢迎邮件、发放新手优惠券、添加系统日志等）时，使用事件可以避免模块间的强依赖。
- **异步处理/非阻塞操作**：对于不需要即时返回给用户的耗时操作，可以通过触发异步事件在后台处理，显著提升接口响应速度。
- **日志与审计**：在不干扰核心业务逻辑的前提下，通过事件监听器集中收集、记录用户操作行为，用于日后的审计和分析。

## 2. 注意事项 (Precautions)

- **单机内存限制**：`@nestjs/event-emitter` 基于 Node.js 的 `EventEmitter2` 库，事件及其分发完全发生于**当前内存/进程**中。不适用于集群多节点部署时的跨节点通信（若需跨节点通信，请考虑引入微服务机制或 Redis、RabbitMQ、Kafka 等消息队列引擎）。
- **异常捕获机制**：事件监听器内部抛出的异常如果不被捕获，可能会导致不可预测的行为甚至进程崩溃。强烈建议在每个监听器逻辑的内部都包好 `try-catch`。
- **执行顺序**：同步情况按挂载顺序执行，但如果存在异步回调（I/O 操作或数据库读写），其完成的先后顺序是无法保证的。
- **死循环隐患**：在复杂的事件流转中，要极力避免 “监听事件 A -> 触发事件 B -> 监听事件 B -> 再次触发事件 A” 导致的事件死循环甚至栈溢出。
- **内存泄漏**：尽可能使用装饰器模式静态挂载监听器。在特殊场景下若有动态绑定（`on` / `addListener`）的行为，务必确保适时解绑（`off` / `removeListener`），否则高频次调用会引发内存泄漏。

## 3. 最佳实践 (Best Practices)

- **使用类（Class）定义 Payload（事件载荷）**：不要使用松散的对象字面量或 `any` 触发事件。定义具体的类进行数据传递，借用 TypeScript 强类型特性，不仅能在开发阶段有良好的代码提示，在重构与维护时也能规避漏改问题。
  ```typescript
  export class UserCreatedEvent {
    constructor(
      public readonly userId: number,
      public readonly email: string,
    ) {}
  }
  ```
- **使用常量/枚举定义事件名称**：统一管理事件名，避免到处散落着魔法字符串（Magic Strings），降低拼写错误的风险。

  ```typescript
  export enum EventName {
    USER_CREATED = 'user.created',
    USER_DELETED = 'user.deleted',
  }

  // 触发事件
  this.eventEmitter.emit(
    EventName.USER_CREATED,
    new UserCreatedEvent(1, 't@test.com'),
  );
  ```

- **保持监听器（Listener）的单一职责**：一个 `@OnEvent()` 装饰的方法应该只专注于做好一件事（解耦最大化）。例如发邮件、发短信、写日志，应该分别交由对应模块下的三个不同的监听器方法去响应同一个事件。
- **灵活运用通配符特性**：由于底层是 `EventEmitter2`，它天然支持类似 `user.*` 甚至 `user.**` 这样的通配符事件绑定。专门用于那些需要批量处理行为（例如给 `order.**` 所有订单级变动统一添加审计日志）时非常便捷。
- **依需选择同步和异步分发**：当你实际上并不关心后续事件的处理结果，只需让它在后台默默执行即可时，使用普通的 `.emit()` 即可；如果你需要确保所有监听器都执行成功后，才往前端返回结果，那么记得要用 `await this.eventEmitter.emitAsync(...)`。
