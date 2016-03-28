import * as model from "../model/model";

var dom = {
	"makeEl":(tag)=>document.createElement(tag),
	"makeText":(text)=>document.createTextNode(text),
	"query":(query)=>document.querySelector(query)
}

export function showMainMenu(){
	var menuNode = dom.makeEl("div");
	model.view.menuEl = menuNode.id = "menu";

	var menuLabel = dom.makeEl("div");
	menuNode.appendChild(menuLabel);
	var menuText = dom.makeText("Main Menu");	
	menuLabel.appendChild(menuText);
	menuNode.appendChild(menuLabel);

	var playButton = dom.makeEl("button");
	var playText = dom.makeText("Play");
	playButton.appendChild(playText);
	menuNode.appendChild(playButton);

	var viewRoot = dom.query("#"+model.view.rootEl);
	viewRoot.appendChild(menuNode);

	return {
		menuNode:menuNode,
		playButton:playButton
	}
}

