import { globalscript } from "./globalscript"
import { globalnav } from "./globalnav"
// import { home } from "./home"
import { homeController } from "./home/homeController"
import { profile } from "./profile/profile-home"
import { login } from "./login"
import { register } from "./register/register"
import Pjax from "pjax"
import topbar from "./topbar"

let pjax = new Pjax({
	elements: "a:not(.full-load)",
	selectors: [
		"title", "povium-app"
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
