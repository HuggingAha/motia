import { Position } from '@xyflow/react'
import { Eye, Send } from 'lucide-react'
import { BaseNodeData } from './nodes.types'
import { Handle } from '../Handle'

export const BaseNode = ({ data }: { data: BaseNodeData }) => {
  return (
    <div className="bg-white rounded-md p-2 px-3 text-black">
      <div className="flex flex-col ">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-semibold">{data.label}</div>
          <div className="text-xs">{data.description}</div>
        </div>
        <div className="flex flex-col mt-2">
          {data.subscribes.length > 0 && (
            <div className="flex gap-1 items-center">
              <Eye className="w-3 h-3 text-muted-foreground" />
              <div className="text-xs font-mono">{data.subscribes.join(', ')}</div>
            </div>
          )}
          {data.emits.length > 0 && (
            <div className="flex gap-1 items-center">
              <Send className="w-3 h-3 text-muted-foreground" />
              <div className="text-xs font-mono">{data.emits.join(', ')}</div>
            </div>
          )}
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
      {data.emits.length > 0 && <Handle type="source" position={Position.Bottom} />}
    </div>
  )
}
