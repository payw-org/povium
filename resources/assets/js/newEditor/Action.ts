import PVMRange from "./PVMRange"
import PVMNode from "./PVMNode"

export interface Action {
	type               : string
	targetNode?        : PVMNode
	targetNodes?       : PVMNode[]
	nextNode?          : PVMNode
	previousRange      : PVMRange
	nextRange          : PVMRange
	finalAction?       : boolean
	previousHTML?      : string
	nextHTML?          : string
	debris?            : string
	key?               : string
	previousType?      : string
	previousParentType?: string
	nextType?          : string
	nextParentType?    : string
	previousDir?       : string
	nextDir?           : string
}