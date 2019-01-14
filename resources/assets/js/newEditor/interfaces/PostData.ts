import PVMNode from "../PVMNode"
import { AT } from "../AvailableTypes"

export interface StyledText {
	type: "styledText"
	data: Array<StyledText | RawText>
	style: string
	url?: string
}

export interface RawText {
	type: "rawText"
	data: string
}

export interface Block extends Object {
	type: string
	role?: string
}

export interface TextBlock extends Block {
	data: Array<StyledText | RawText>
	align?: string
	kind?: string // For blockquotes and list items
}

export interface ImageBlock extends Block {
	kind: string
	url: string
	captionEnabled: boolean
	caption?: {
		data: Array<StyledText | RawText>
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
