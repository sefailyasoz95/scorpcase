// @ts-check

import { APIWrapper, API_EVENT_TYPE } from "./api.js";
import {
	addMessage,
	animateGift,
	isPossiblyAnimatingGift,
	isAnimatingGiftUI,
} from "./dom_updates.js";

const api = new APIWrapper();

var start = Date.now();
var array = [];
var animatedDiv = document.getElementById("animatedGift")
function sleep (time) {
	return new Promise((resolve) => setTimeout(resolve, time));
  }
api.setEventHandler((events) => {
	events.forEach((e) => {
		var mls = e.timestamp.getTime() - start;
		var time = Math.floor(mls / 1000);
		if (e.type === API_EVENT_TYPE.ANIMATED_GIFT) {
			setTimeout(() => {
				animateGift(e)
			}, 2000); // burada bir ag geldiğinde 2sn bekleyip sonra oynatsın
			animatedDiv.onanimationstart = () => {sleep(2000)} // başladığında da 2sn beklemeli diye düşündüm ancak o şekilde çalışmıyor..
		} else if (
			e.type === API_EVENT_TYPE.MESSAGE ||
			e.type === API_EVENT_TYPE.GIFT
		) {
			if (time >= 20) {
				start = Date.now();
				console.log("message timeout: ", e.data.message);
				return;
			} else {
				addMessage(e);
			}
		}
	});
});
// NOTE: UI helper methods from `dom_updates` are already imported above.
