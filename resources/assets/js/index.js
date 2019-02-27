import "../scss/globalstyle.scss"
// import "../scss/globalnav.scss"
import "../scss/globalnav-new.scss"
import "../scss/globalfooter.scss"
// import "../scss/home.scss"
import "../scss/home-new.scss"
import "../scss/post-view.scss"
import "../scss/login.scss"
import "../scss/register.scss"
import "../scss/http-error.scss"

require("./globalscript")
// require("./globalnav")
require("./globalnav-new")
// require("./home/homeController")
require("./home-new/home-new")
require("./profile/profile-home")
require("./login")
require("./register/register")
import Pjax from "pjax"
import topbar from "./topbar"

window.addEventListener("load", e => {
	let pjax = new Pjax({
		elements: "a:not(.full-load)",
		selectors: [
			"title", "#povium-app-view"
		],
		cacheBust: false
	})
	topbar.config({
		barThickness: 2,
		barColors: {
			"0": "#5f42ff",
			"1": "#5f42ff"
		},
		shadowColor: "rgba(0,0,0,0)"
	})
	document.addEventListener('pjax:send', topbar.show)
	document.addEventListener('pjax:complete', topbar.hide)
})
