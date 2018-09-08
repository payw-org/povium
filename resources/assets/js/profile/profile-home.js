window.addEventListener('scroll', function() {

	let profileInfo = document.querySelector('#profile-main #info')
	let historyElm = document.querySelector('#profile-main #history')

	if (!profileInfo || !historyElm) {
		return
	}

	let offset = historyElm.getBoundingClientRect().top - 60

	let scrollTop = document.documentElement.scrollTop

	let historyElmDistance = scrollTop + historyElm.getBoundingClientRect().top - 60

	let afterTransform = (historyElmDistance - offset) / 2
	let afterOpacity = (offset - 60) / (historyElmDistance - 60)

	if (afterOpacity >= 0) {
		profileInfo.style.transform = 'translateY(' + afterTransform + 'px)'
		profileInfo.style.opacity = afterOpacity
		profileInfo.style.filter = 'blur(' + afterTransform / 6 + 'px)'
	} else {
		afterTransform = (historyElmDistance - 60) / 2
		afterOpacity = 0
		profileInfo.style.filter = 'blur(' + afterTransform / 6 + 'px)'
		profileInfo.style.transform = 'translateY(' + afterTransform + 'px)'
		profileInfo.style.opacity = afterOpacity
	}

	

})