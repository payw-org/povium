window.addEventListener('scroll', function() {

	let profileInfo = document.querySelector('#profile-main #info')
	let historyElm = document.querySelector('#profile-main #history')

	if (!profileInfo || !historyElm) {
		return
	}

	let offset = historyElm.getBoundingClientRect().top - 60

	if (offset <= 0) {
		offset = 0
	}

	let scrollTop = document.documentElement.scrollTop

	let historyElmDistance = scrollTop + historyElm.getBoundingClientRect().top - 60

	let afterTransform = (historyElmDistance - offset) / 1.8
	let afterOpacity = (offset) / (historyElmDistance)

	profileInfo.style.transform = 'translateY(' + afterTransform + 'px) scale(' + (offset + 720) / (historyElmDistance + 720) + ')'
	profileInfo.style.opacity = afterOpacity
	profileInfo.style.filter = 'blur(' + afterTransform / 6 + 'px)'

	

})