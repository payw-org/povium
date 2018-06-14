document.querySelectorAll(".input-wrapper").forEach(function(self, index) {
	// self.addEventListener("focusin", function() {
	// 	this.classList.add("focused");
	// });

	self.addEventListener("focusout", function() {
		this.classList.remove("focused");
		if (this.querySelector("input").value !== "") {
			this.querySelector(".placeholder").classList.add("fixed");
		} else {
			this.querySelector(".placeholder").classList.remove("fixed");
		}
	});
});
