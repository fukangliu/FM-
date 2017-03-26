function progress ($ct){

	this.$ct = $ct;
	this.init();
	this.bind();
}

progress.prototype.init = function(){

	this.$audio = $('#music');
	this.audio = $('#music')[0];
	this.$progresshandle = this.$ct.find('.progress-handle');
	this.$progresspathway = this.$ct.find('.progress-pathway');
	this.$progressline = this.$ct.find('.progress-line');
	this.$progressbar = this.$ct.find('.progress-bar');
	this.$currenttime = this.$ct.find('.current-time');
	this.$fulltime = this.$ct.find('.full-time');
	this.$currenttime = this.$ct.find('.current-time');
	this.$fulltime = this.$ct.find('.full-time');
	this.drag = this.$progresshandle.draggabilly({
		axis: 'x',
        containment: true
	});
}

progress.prototype.bind = function(){
		this.dragMove();
		this.clickCtrl();
		this.timeText();
}


progress.prototype.dragMove = function(){
	var _this = this;
	this.drag.on('dragMove',function(){
		var draggie = $(this).data('draggabilly');
		var width = draggie.position.x + 'px';
		_this.$progressline.css('width',width);
	})
	this.drag.on('dragStart',function(){
		_this.audio.pause();
	})
	this.drag.on('dragEnd',function(){
		_this.audio.play();
		var draggie = $(this).data('draggabilly');
		_this.audio.currentTime = draggie.position.x / 198 *_this.audio.duration;
	})
}

progress.prototype.clickCtrl = function(){
	var _this = this;
	this.$progresspathway.on('click',function(e){
		var clickX = e.clientX;
		var progressbarleft = _this.$progressbar.offset().left;
		var left = clickX - progressbarleft;
		_this.$progressline.css('width',left);
		_this.$progresshandle.css('left',left);
		_this.audio.currentTime = left / 198 * _this.audio.duration;

	});
}

progress.prototype.timeText = function(){
	var _this = this;
	this.$audio.on('play',function(){
		var fullTime = _this.audio.duration;

		_this.clock1 = setInterval(function(){
			var currentTime = _this.audio.currentTime;
			var currentWidth = parseInt(currentTime/fullTime*198) + 'px';

			_this.$currenttime.text(_this.timeFormat(currentTime));
			_this.$progressline.css('width',currentWidth);
			_this.$progresshandle.css('left',currentWidth);
		},1000)

		_this.$fulltime.text(_this.timeFormat(fullTime));
	})
	this.$audio.on('pause',function(){
		clearInterval(_this.clock1);
	});
}

progress.prototype.timeFormat = function(num){

	var fullSec = parseInt(num);
	var min = parseInt(fullSec/60) + '';

	var sec = (fullSec%60);

	if (sec < 10) {
		sec = '0'+sec
	}else{
		sec = sec+'';
	};
	var timeStr = min+':'+sec;
	
	return timeStr;
}