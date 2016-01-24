function GUI(opt){
	var {
		skillBarLength = 4;	
	} = opt;
	this.render(){
		let guiStyle = document.createElement('style');
		guiStyle.type = 'text/css';
		guiStyle.innerHtml = `
				.gui {
						position:absolute;
						width:98vw;
						height:98vh;
						top:0;
						left:0;
				}	
				`;

		let guiEl = document.createELement('div');
		guiEl.className = 'gui';
		document.querySelector('body').appendChild(guiEl);
	}

	let skillBar = [];
}
