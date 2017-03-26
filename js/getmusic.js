
function getmusic($ct){

	this.$ct = $ct;
	this.init();
	this.bind();

}

getmusic.prototype.init = function(){

	
	this.$audio = $('#music');
	this.audio = $('#music')[0];
	this.$channels = this.$ct.find('.channels');
	this.$channelslist = this.$ct.find('.channels-list');
	this.$channelswrap = this.$ct.find('.channels-wrap')
	this.channelId = 'public_tuijian_spring';
	this.$songName = this.$ct.find('.music-name');
	this.$Singer = this.$ct.find('.singer');
	this.$currentcover = this.$ct.find('.current-cover');
	this.$lyricbox = this.$ct.find('.lyric-box');
	this.$needle = this.$ct.find('.needle');
	this.$disco = this.$ct.find('.disco');
	this.$prev = this.$ct.find('.prev');
	this.$onoff = this.$ct.find('.on-off');
	this.$next = this.$ct.find('.next');
	this.$lyricbtn = this.$ct.find('.lyric-btn');
	this.$lyric = this.$ct.find('.lyric');
	this.$rotate = this.$ct.find('.rotate');
	this.currentTimeSec = 0;
	this.song = {};
	this.SongArr = [];
	this.lyricTimeArr = [];
	this.letsPlay = false;
	this.islyricShow = false;

	

}

getmusic.prototype.bind = function(){

	this.channelsIconChange();
	this.channelSelect();
	this.panelReady();
	this.rotateCtrl();
	this.canPlay();
	this.autoplay();
	this.prevmusic();
	this.nextmusic();
	this.onoff();
	this.needleChange();	
	this.lyricShow();
	this.timeUpdate();


}



// 频道列表的显示与隐藏
getmusic.prototype.channelsIconChange = function(){
	var _this = this ;
	this.$channelswrap.on('mouseover',function(){
		_this.$channelslist.fadeIn(200);
		_this.$channels.removeClass('icon-menu').addClass('icon-minus');
	})
	this.$channelswrap.on('mouseleave',function(){
		_this.$channelslist.fadeOut(200);
		_this.$channels.removeClass('icon-minus').addClass('icon-menu')
	})
}

// 频道列表点击动画
getmusic.prototype.channelSelect = function(){
	var _this = this;
	this.$channelslist.on('click','li',function(){
		_this.audio.pause();
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
		_this.channelId = $(this).attr('channel-id');
		_this.letsPlay = true;
		_this.getAndReset(_this.channelId);

	})
}


// 初始化频道列表,以及歌曲名，歌手，图片，等
getmusic.prototype.panelReady = function(){
	var _this = this;
	this.$ct.ready(function(){
		$.get('http://api.jirengu.com/fm/getChannels.php')
			.done(function(channelsStr){
				var channelsArr = JSON.parse(channelsStr).channels;
				for (var i = 0; i <channelsArr.length; i++) {
					var channelName = channelsArr[i].name;
					var channelID = channelsArr[i].channel_id;
					var html = '<li channel-id ='+channelID+'>'+channelName+'</li>'
					_this.$channelslist.append(html);
				};
				$('.channels-list li').first().addClass('active');
				_this.getAndReset(_this.channelID);
				_this.$disco.toggleClass('active');
				_this.$disco.css('animation-play-state','paused')
		})
	})
}

// 黑胶唱片旋转动画
getmusic.prototype.rotateCtrl = function(){
	var _this = this ;
	this.$audio.on('play',function(){
		_this.$disco.css('animation-play-state','running');
	})
	this.$audio.on('pause',function(){
		_this.$disco.css('animation-play-state','paused');
	})
}
// 判断是否能播放
getmusic.prototype.canPlay = function(){
	var _this = this ;
	this.$audio.on('canplay',function(){
		if (_this.letsPlay) {
			_this.audio.play();
		};
		_this.letsPlay = false;
	})
}

// 自动播放

getmusic.prototype.autoplay = function(){
	var _this = this;
	this.$audio.on('ended',function(){
		_this.letsPlay = true;
		_this.getAndReset(_this.channelId);
	})
}

// 上一曲

getmusic.prototype.prevmusic = function(){

	var _this = this;
	this.$prev.on('click',function(){

		if (_this.SongArr.length > 1) {
			_this.SongArr.pop();
			_this.songReset(_this.SongArr[_this.SongArr.length - 1]);
			_this.letsPlay = true;
		};
	})
}

// 下一曲

getmusic.prototype.nextmusic = function(){
	var _this = this ;
	this.$next.on('click',function(){
		_this.letsPlay = true;
		_this.getAndReset(_this.channelID);
	})
	this.$next.on('mousedown',function(){
		_this.audio.pause();
	})
}
// 获取和重置音乐

getmusic.prototype.getAndReset = function(str){
		var _this = this ;
		$.get('http://api.jirengu.com/fm/getSong.php',{
			channel: str
		})
		.done(function(song){
			var songset = song.substring(song.indexOf('{'));
			_this.Song = JSON.parse(songset).song[0];
			_this.songReset(_this.Song);
			_this.SongArr.push(_this.Song);
		})
}
// 初始化歌曲名字，歌手，初始时间，url
getmusic.prototype.songReset = function(Song){
	this.audio.src = Song.url;
	this.audio.load();	
	this.audio.currentTime = 0;
	this.lyricReset(Song.sid);
	this.$Singer.text(Song.artist);
	this.$songName.text(Song.title);
	this.$currentcover.css('background-image','url('+Song.picture+')');	
}

// 暂停/播放
getmusic.prototype.onoff = function(){
	var _this = this ;
	this.$onoff.on('click',function(){
		if (_this.audio.paused) {
			_this.audio.play()
			if (_this.$onoff.hasClass('icon-start1')) {
				_this.$onoff.removeClass('icon-start1');
			};
			_this.$onoff.addClass('icon-stop');
		}else{
			_this.audio.pause();
			if (_this.$onoff.hasClass('icon-stop')) {
				_this.$onoff.removeClass('icon-stop');
			};
			_this.$onoff.addClass('icon-start1');
		};
	})

	this.$audio.on('play',function(){
		if (_this.$onoff.hasClass('icon-start1')) {
			_this.$onoff.removeClass('icon-start1');
		};
		_this.$onoff.addClass('icon-stop');
	})

	this.$audio.on('pause',function(){

		if (_this.$onoff.hasClass('icon-stop')) {
			_this.$onoff.removeClass('icon-stop');
		};
		_this.$onoff.addClass('icon-start1');
	})
};


// 指针动画添加与移除
getmusic.prototype.needleChange = function(){
	var _this = this;
	this.$audio.on('play',function(){
		_this.$needle.addClass('needle-play');
	})
	this.$audio.on('pause',function(){
		_this.$needle.removeClass('needle-play');
	})
}
// 歌词滚动

getmusic.prototype.lyricShow = function(){
	var _this = this;
	this.$lyricbtn.on('click',function(){
		if (!_this.islyricShow) {
			_this.$lyricbtn.css('color','#db4437');
			_this.$lyric.fadeIn(500);
			_this.$rotate.fadeOut(500);
			_this.islyricShow = true;
		}else{
			_this.$lyricbtn.css('color','#8b8d8f');
			_this.$rotate.fadeIn(500);
			_this.$lyric.fadeOut(500);
			_this.islyricShow = false;
		};
	})
}
// 初始化歌词获取
getmusic.prototype.lyricReset = function(sidstr) {
    var _this = this;
    $.post('http://api.jirengu.com/fm/getLyric.php', {
            sid:sidstr
        })
        .done(function(lyric) {
        	var lyricset = lyric.substring(lyric.indexOf('{'));
            var Lyric = JSON.parse(lyricset).lyric;
            $('.lyric-box>p').remove();           
            _this.lyricTimeArr = [];         
            _this.lyricFormat(Lyric);
        })
}

// 初始化每句歌词获取
getmusic.prototype.lyricFormat = function(str){
	var html = '';
	var lyricArr = str.split('\n');
	for (var i = 0; i<lyricArr.length; i++) {
		var lyric = lyricArr[i].slice(10,48);		
		if (!lyric) {
			lyric = '-';
		};
		html += '<p class=' + '\"lyric' + i + '\">' + lyric + '</p>';
		this.lyricTimeFormat(lyricArr[i]);
	};	  
	this.$lyricbox.append(html);
}

// 初始化歌曲每句歌词时间获取
getmusic.prototype.lyricTimeFormat = function(str){
	var min = parseFloat(str.slice(1,3));
	var sec = Math.round(min*60+parseFloat(str.slice(4,9)));
	this.lyricTimeArr.push(sec);
}
// 时间更新
getmusic.prototype.timeUpdate = function(){
	var _this = this;
	this.$audio.on('timeupdate',function(){
		if (_this.currentTimeSec != Math.round(_this.audio.currentTime)) {
			_this.currentTimeSec = Math.round(_this.audio.currentTime);
			_this.lyricBoxMove(_this.currentTimeSec);
		};
	})

}
// 歌词盒子移动
getmusic.prototype.lyricBoxMove = function(num){
	for (var i = 0; i < this.lyricTimeArr.length; i++) {
		if (num === this.lyricTimeArr[i]) {
			var Top = 80 - i*40 +'px';
			var lightclass = '.lyric'+i;
			$(lightclass).siblings().removeClass('light-lyric');
			$(lightclass).addClass('light-lyric');
			this.$lyricbox.animate({
				top:Top
			},300);
		};		
	};
};