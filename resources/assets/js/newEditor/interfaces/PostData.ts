import PVMNode from "../PVMNode"
import { AT } from "../AvailableTypes"

export interface Block {
	type: string
}

export interface TextBlock extends Block {
	data: TextFragment[]
	align?: string
	mode?: string // For blockquotes
	parentType?: string // For list items
}

export interface TextFragment {
	type: string
	data: string
	style?: string
}

export interface ImageBlock extends Block {
	size: string
	url: string
	caption: {
		data: TextFragment[]
		align?: string
	}
}

export interface Frame {
	title: string
	subtitle: string
	body: string
	contents: Block[]
	isPremium: boolean
	seriesID?: number
	thumbnail?: any
}

export function isTextOnlyBlock(block: Block): block is TextBlock {
	if (AT.textOnly.includes((<TextBlock> block).type)) {
		return true
	}
}

export function isImageBlock(block: Block): block is ImageBlock {
	if ((<TextBlock>block).type.toLowerCase() === "image") {
		return true
	}
}
