function PanelCtrl ($ct){

	this.$ct = $ct;
	this.init();
	this.bind();
}

PanelCtrl.prototype.init = function(){

	this.$audio = $('#music');
	this.audio = $('#music')[0];
	this.$panelmin = this.$ct.find('.panel-min');
	this.$panel = this.$ct.find('.panel');
	this.$back = this.$ct.find('.back');
	this.ismoveing = false;
}

PanelCtrl.prototype.bind = function(){
		this.musicisplay();
		this.open();
		this.close();
}

PanelCtrl.prototype.musicisplay = function(){
	var _this = this;
	this.$audio.on('play',function(){
		_this.ismoveing = true;
	})
	this.$audio.on('pause',function(){
		_this.ismoveing = false;
	})
}

PanelCtrl.prototype.open = function(){
	var _this = this;
	this.$panelmin.on('click',function(){
		_this.$panelmin.fadeToggle('200');
		_this.$panel.fadeToggle('200');		
	})
};

PanelCtrl.prototype.close = function(){
	var _this = this;
	this.$back.on('click',function(){
		_this.$panelmin.fadeToggle('200');
		_this.$panel.fadeToggle('200');
		if (_this.ismoveing) {
			_this.$panelmin.addClass('active');
			_this.$panelmin.css('color','#fff');
		}else{
			_this.$panelmin.removeClass('active');
			_this.$panelmin.css('color','#cdcdce');
		};
	})
}
