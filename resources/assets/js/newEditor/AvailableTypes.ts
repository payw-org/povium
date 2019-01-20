export const AT = {
	topTags: ["p", "h1", "h2", "h3", "blockquote", "li", "figure", "code"],
	textContainedTags: ["p", "h1", "h2", "h3", "blockquote", "li", "figcaption", "code"],
	topTypes: ["p", "h1", "h2", "h3", "blockquote", "li", "image", "video"],
	transformable: ["p", "h1", "h2", "h3", "blockquote", "li"],
	mergeable: ["p", "h1", "h2", "h3", "li", "blockquote"],
	splittable: ["p", "h1", "h2", "h3", "li", "blockquote"],
	textOnly: ["p", "h1", "h2", "h3", "blockquote", "li"],
	textContained: ["p", "h1", "h2", "h3", "blockquote", "li", "image", "code"],
	alignable: ["p", "h1", "h2", "h3"],
	textStyle: ["b", "strong", "em", "i", "u", "strike", "a"],
	headings: ["h1", "h2", "h3"],
	availableTags: [
		"p", "h1", "h2", "h3", "li", "blockquote",
		"b", "strong", "i", "em", "u", "strike", "a",
		"img"
	]
}
