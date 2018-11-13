export const AT = {
	"topTags": [
		"p", "h1", "h2", "h3", "blockquote", "li", "figure"
	],
	"topTypes": [
		"p", "h1", "h2", "h3", "blockquote", "li", "image", "video"
	],
	"transformable": [
		"p", "h1", "h2", "h3", "blockquote", "li"
	],
	"mergeable": [
		"p", "h1", "h2", "h3", "li", "blockquote"
	],
	"splittable": [
		"p", "h1", "h2", "h3", "li", "blockquote"
	],
	"textOnly": [
		"p", "h1", "h2", "h3", "blockquote", "li" 
	],
	"textContained": [
		"p", "h1", "h2", "h3", "blockquote", "li", "image"
	],
	"alignable": [
		"p", "h1", "h2", "h3"
	],
	"textStyle": [
		"b", "strong", "em", "i", "strikethrough"
	],
	"headings": [
		"h1", "h2", "h3"
	],
	/**
	 * @param {string} type
	 */
	isHeading: function(type) {
		type = type.toLowerCase()
		if (this.headings.includes(type)) {
			return true
		} else {
			return false
		}
	},
	/**
	 * @param {string} type
	 */
	isParagraph: function(type) {
		type = type.toLowerCase()
		return type === "p"
	},
	/**
	 * @param {string} type
	 */
	isListItem: function(type) {
		type = type.toLowerCase()
		return type === "li"
	}
}
