import PVMRange from "./PVMRange"
import PVMNode from "./PVMNode"

export interface Action {
	targetNode?: PVMNode
	targetNodes?: PVMNode[]
	previousRange: PVMRange
	nextRange: PVMRange
}