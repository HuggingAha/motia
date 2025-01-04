import { Edge, Node, useEdgesState, useNodesState } from '@xyflow/react'
import { useEffect } from 'react'
import type { EdgeData, NodeData } from '../nodes/nodes.types'

type Emit = string | { type: string; label?: string; conditional?: boolean }

type WorkflowStep = {
  id: string
  name: string
  type: 'base' | 'trigger'
  description?: string
  subscribes?: string[]
  emits: Emit[]
  action?: 'webhook' | 'cron'
  webhookUrl?: string
  cron?: string
}

export type WorkflowResponse = {
  id: string
  name: string
  steps: WorkflowStep[]
}

export const useGetWorkflowState = (workflow: WorkflowResponse) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<EdgeData>>([])

  useEffect(() => {
    if (!workflow) return

    // we need to check all subscribes and emits to connect the nodes using edges
    const nodes: Node<NodeData>[] = workflow.steps.map((step) => ({
      id: step.id,
      type: step.type,
      position: { x: 0, y: 0 },
      data: step,
    }))

    const edges: Edge<EdgeData>[] = []

    // For each node that emits events
    workflow.steps.forEach((sourceNode) => {
      const emits = sourceNode.emits || []

      // Check all other nodes that subscribe to those events
      workflow.steps.forEach((targetNode) => {
        const subscribes = targetNode.subscribes || []

        // For each matching emit->subscribe, create an edge
        emits.forEach((emit) => {
          const emitType = typeof emit === 'string' ? emit : emit.type

          if (subscribes.includes(emitType)) {
            const label = typeof emit !== 'string' ? emit.label : undefined
            const variant = typeof emit !== 'string' && emit.conditional ? 'conditional' : 'default'
            const data: EdgeData = { variant, label }

            edges.push({
              id: `${sourceNode.id}-${targetNode.id}`,
              type: 'base',
              source: sourceNode.id,
              target: targetNode.id,
              label,
              data,
            })
          }
        })
      })
    })

    setNodes(nodes)
    setEdges(edges)
  }, [workflow])

  return { nodes, edges, onNodesChange, onEdgesChange }
}
