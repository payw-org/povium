import { globalscript } from "./globalscript"
import { globalnav } from "./globalnav"
// import { home } from "./home"
import { homeController } from "./home/homeController"
import { logout } from "./logout"
import { profile } from "./profile/profile-home"
import { login } from "./login"
import { register } from "./register"
import Pjax from "pjax"

let pjax = new Pjax({
	elements: "a",
	selectors: [
		"title", "body"
	],
	cacheBust: false,
	// currentUrlFullReload: true
})