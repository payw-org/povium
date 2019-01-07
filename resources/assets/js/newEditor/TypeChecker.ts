import { AT } from "./AvailableTypes"

export default class TypeChecker {
	constructor() {}

	static isParagraph(type: string) {
		type = type.toLowerCase()
		return type === "p"
	}

	static isHeading(type: string) {
		type = type.toLowerCase()
		return AT.headings.includes(type)
	}

	static isImage(type: string) {
		type = type.toLowerCase()
		return type === "image"
	}

	static isBlockquote(type: string) {
		type = type.toLowerCase()
		return type === "blockquote"
	}

	static isTransformable(type: string) {
		type = type.toLowerCase()
		return AT.transformable.includes(type)
	}

	static isMergeable(type: string) {
		type = type.toLowerCase()
		return AT.mergeable.includes(type)
	}

	static isSplittable(type: string) {
		type = type.toLowerCase()
		return AT.splittable.includes(type)
	}

	static isTextOnly(type: string) {
		type = type.toLowerCase()
		return AT.textOnly.includes(type)
	}

	static isTextContained(type: string) {
		type = type.toLowerCase()
		return AT.textContained.includes(type)
	}

	static isAlignable(type: string) {
		type = type.toLowerCase()
		return AT.alignable.includes(type)
	}

	static isOrderedList(type: string) {
		type = type.toLowerCase()
		return type === "ol"
	}

	static isUnorderedList(type: string) {
		type = type.toLowerCase()
		return type === "ul"
	}

	static isListItem(type: string) {
		type = type.toLowerCase()
		return type === "li"
	}
}