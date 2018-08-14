export let StringDiff = {

	node: null,

	locked: false,
	
	prevTextOffset: 0,
	prevContent: "",

	nextTextOffset: 0,
	nextContent: "",

	getDiff: function(str1, str2) {

		let prevDiffStart = null
		let prevDiffEnd = null
		let prevDiffContent = null

		let nextDiffStart = null
		let nextDiffEnd = null
		let nextDiffContent = null

		let prev_i = 0, next_i = 0

		while (Math.max(prev_i, next_i) < Math.min(str1.length, str2.length)) {

			if (str1[prev_i] !== str2[next_i]) {

				prevDiffStart = prev_i
				nextDiffStart = next_i

				break

			}

			prev_i++
			next_i++

		}

		if (prevDiffStart === null) {

			prevDiffStart = prev_i
			nextDiffStart = next_i

		}

		prev_i = str1.length - 1
		next_i = str2.length - 1

		while (prev_i >= prevDiffStart && next_i >= nextDiffStart) {

			if (str1[prev_i] !== str2[next_i]) {

				prevDiffEnd = prev_i
				nextDiffEnd = next_i

				break

			}

			prev_i--
			next_i--

		}

		if (prevDiffEnd === null) {

			prevDiffEnd = prev_i
			nextDiffEnd = next_i

		}

		prevDiffContent = str1.slice(prevDiffStart, prevDiffEnd + 1)
		nextDiffContent = str2.slice(nextDiffStart, nextDiffEnd + 1)

		return {
			node: this.node,
			prevTextOffset: this.prevTextOffset,
			prevDiffStart: prevDiffStart,
			prevDiffEnd: prevDiffEnd,
			prevDiffContent: prevDiffContent,
			nextTextOffset: this.nextTextOffset,
			nextDiffStart: nextDiffStart,
			nextDiffEnd: nextDiffEnd,
			nextDiffContent: nextDiffContent
		}

	},

	reset: function() {
		this.node = null
		this.prevContent = ""
		this.nextContent = ""
	}

}
