import crypto from 'crypto'

export class RpcSender {
  private readonly pendingRequests: Record<
    string,
    { resolve: (result: any) => void; reject: (error: any) => void; method: string; args: any }
  > = {}

  constructor(private readonly process: NodeJS.Process) {}

  send<T>(method: string, args: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID()
      this.pendingRequests[id] = { resolve, reject, method, args }

      process.send?.({ type: 'rpc_request', id, method, args })
    })
  }

  init() {
    this.process.on('message', (msg: any) => {
      if (msg.type === 'rpc_response') {
        const { id, result, error } = msg
        const callbacks = this.pendingRequests[id]

        if (!callbacks) {
          return
        } else if (error) {
          callbacks.reject(error)
        } else {
          callbacks.resolve(result)
        }

        delete this.pendingRequests[id]
      }
    })
  }
}
