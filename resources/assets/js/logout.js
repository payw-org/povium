import AJAX from "./AJAX"

if (document.querySelector("#globalnav .sign-out")) {

	let signOutButton = document.querySelector("#globalnav .sign-out")

	signOutButton.addEventListener("click", function(e) {

		e.preventDefault()

		let ajax = new AJAX()
		ajax.chirp({
			type: "post",
			url: "/logout",
			success: function(response) {

				try {
					let result = JSON.parse(response)
					window.location.replace(result['redirect'])
				} catch(e) {
					alert(e + " " + response)
				}

			}
		})

	})

}
