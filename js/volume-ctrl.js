function volume($ct){

	this.$ct = $ct;
	this.init();
	this.bind();

}

volume.prototype.init = function(){
	this.$audio = $('#music');
	this.audio = $('#music')[0];
	this.$fm = $('#fm');
	this.$volume = this.$ct;
	this.$volumebutton = this.$ct.find('.volume-button');
	this.$volumepathway = this.$ct.find('.volume-pathway');
	this.$volumeline = this.$ct.find('.volume-line');
	this.$volumehandle = this.$ct.find('.volume-handle');
	this.$volumebar = this.$ct.find('.volume-bar');
	this.volumeOn = true;
	this.audioVolume;	
	this.dragVolume = this.$volumehandle.draggabilly({
        axis: 'x',
        containment: true
    });

}
volume.prototype.bind = function(){

	this.volumeChange();
	this.mute();
	this.dragMove();
	this.volumeBarClick();

}


// 音量变化时触发:
volume.prototype.volumeChange = function(){
	var _this = this;
	this.$audio.on('volumechange',function(){
		var audioChanged = _this.audio.volume * 100;
		var width = audioChanged + 'px';
		_this.$volumeline.css('width',width);
		if (audioChanged ===0 ) {
			_this.volumeOn = false;
			_this.$volumebutton.removeClass('icon-volume-on').addClass('icon-volume-off')
		}else{			
			if (_this.$volumebutton.hasClass('icon-volume-off')) {
				_this.volumeOn = true;
				_this.$volumebutton.removeClass('icon-volume-off').addClass('icon-volume-on')
			};
		};
	})
};


// 点击静音按钮:

volume.prototype.mute = function(){
	var _this = this;
	this.$volumebutton.on('click',function(){
		if (_this.volumeOn) {
			_this.audioVolume = _this.audio.volume;
			_this.audio.volume = 0;
			_this.$volumehandle.css('left','-100px');
		}else{
			_this.audio.volume = _this.audioVolume;
			var left = _this.audioVolume * 100 - 100 + 'px';
			_this.$volumehandle.css('left',left);
		};
	})	
};

// 音量进度（圆点）拖拽:

volume.prototype.dragMove = function(){
	var _this = this;
	this.dragVolume.on('dragMove',function(){
		var draggie = $(this).data('draggabilly');
		var width = 100 + draggie.position.x;
		if (width>0) {
			_this.audio.volume = width / 100;
		}else{
			_this.audio.volume = 0;
		};
	})
};

// 音量进度条点击
volume.prototype.volumeBarClick = function(){
	var _this = this ;
	this.$volumebar.on('click',function(e){
		var clickX = e.clientX;
		var barLeft = _this.$volumebar.offset().left;
		var clickVolume = clickX - barLeft;
		if (clickVolume<=100) {
			var left = clickVolume - 100 + 'px';
			_this.audio.volume = clickVolume / 100;
			_this.$volumehandle.css('left',left);
		}else{
			_this.audio.volume = 1;
			_this.$volumehandle.css('left','0px');
		};
	});	
};


