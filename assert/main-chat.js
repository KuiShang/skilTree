/*
 *  Created by Li Xiangkai
 *  Date:2017-01-13
 *  Instructions:
 *  	PC主窗口聊天功能结构，包括会话列表，收发消息等
 */

/**
 * 初始化会话列表
 */
function initSession(sessionList){
	console.log('本地会话列表',sessionList);
	
	//绑定click事件
	$('#session').on('click','li',function(){
		openSession(this);
	});
	
	//绑定邮件菜单
	$('#session').on('mousedown','li',function(){
		showMenu(this);
	});
	
	if(sessionList.length != 0){
		var totalNum = 0;
		for(var i = 0; i < sessionList.length; i ++){
			var avatarColor;
			var avatarContent;
			var name;
			var msgContent;
			var statusIcon = '<em id="send-status" class="iconn-34" style="display:none;"></em>';
			if(sessionList[i].Status == 0){
				statusIcon = '<em id="send-status" class="iconn-34"></em>';
			}
			if(sessionList[i].MsgType == 1 || sessionList[i].MsgType == 100001 || sessionList[i].MsgType == 100002){
				$('#decode').text(sessionList[i].MsgContent);
				msgContent = $('#decode').html();
			}else if(sessionList[i].MsgType == 2){
				msgContent = '[语音]';
			}else if(sessionList[i].MsgType == 3){
				msgContent = '[图片]';
			}else if(sessionList[i].MsgType == 5){
				msgContent = '[位置]';
			}
			var numberTemp = '<span class="num" style="display:none;"></span>';
			if(sessionList[i].UnreadmsgCount > 0 && sessionList[i].UnreadmsgCount <= 99){
				numberTemp = '<span class="num">'+sessionList[i].UnreadmsgCount+'</span>';
				totalNum += parseInt(sessionList[i].UnreadmsgCount);
			}
			if(sessionList[i].UnreadmsgCount > 99){
				numberTemp = '<span class="num">99+</span>';
				totalNum += parseInt(sessionList[i].UnreadmsgCount);
			}
			if(sessionList[i].GroupType == 1){
				if(sessionList[i].SessionTopmark == 1){
					var temp = '<li id="session-'+sessionList[i].GroupId+'" '
						+ ' number="'+sessionList[i].UnreadmsgCount+'" topTime="'+sessionList[i].SessionTopTime+'" isTop="'+sessionList[i].SessionTopmark+'"'
						+ ' msgTime="'+sessionList[i].MsgTimellong+'" msgId="'+sessionList[i].MsgId+'">'
						+ '<span class="top"></span>' + numberTemp + '<div class="list-name" style="background:'+getNickNameColor(sessionList[i].oaId)+';">'
						+ getNickName(sessionList[i].MsgSendName)
						+ '</div><div class="list-text">'
						+ '<h2><span class="session-name">'+codeStr(sessionList[i].MsgSendName)+'</span><span class="time">'+sessionList[i].MsgTime+'</span></h2>'
						//+ '<h2>'+sessionList[i].MsgSendName+'<span class="time">'+sessionList[i].MsgTime+'</span></h2>'
						+ '<p>' + statusIcon + '<span class="red" style="display:none;">[草稿]</span><span class="session-text">' + msgContent + '</span></p></div></li>';
					if(topNum == 0){
						$('#session').prepend(temp);
					}else{
						$('#session').children().eq(topNum - 1).after(temp);
					}
					topNum += 1;
				}else{
					var temp = '<li id="session-'+sessionList[i].GroupId+'" '
						+ ' number="'+sessionList[i].UnreadmsgCount+'" msgTime="'+sessionList[i].MsgTimellong+'" topTime="0"'
						+ ' isTop="'+sessionList[i].SessionTopmark+'" msgId="'+sessionList[i].MsgId+'">'
						+ numberTemp + '<div class="list-name" style="background:'+getNickNameColor(sessionList[i].oaId)+';">'
						+ getNickName(sessionList[i].MsgSendName)
						+ '</div><div class="list-text">'
						+ '<h2><span class="session-name">'+codeStr(sessionList[i].MsgSendName)+'</span><span class="time">'+sessionList[i].MsgTime+'</span></h2>'
						//+ '<h2>'+sessionList[i].MsgSendName+'<span class="time">'+sessionList[i].MsgTime+'</span></h2>'
						+ '<p>' + statusIcon + '<span class="red" style="display:none;">[草稿]</span><span class="session-text">' + msgContent + '</span></p></div></li>';
					$('#session').append(temp);
				}
				$('#session-'+sessionList[i].GroupId).data(sessionList[i]);
			}else if(sessionList[i].GroupType == 2){
				if(sessionList[i].SessionTopmark == 1){
					var temp = '<li id="session-'+sessionList[i].GroupId+'" '
						+ ' number="'+sessionList[i].UnreadmsgCount+'" topTime="'+sessionList[i].SessionTopTime+'"'
						+ ' msgTime="'+sessionList[i].MsgTimellong+'" isTop="'+sessionList[i].SessionTopmark+'" msgId="'+sessionList[i].MsgId+'">'
						+ '<span class="top"></span>' + numberTemp
						+ '<div class="list-name" style="background:'+getNickNameColor(Math.abs(hashCode(sessionList[i].GroupId)))+';">'
						+ '<em class="iconn-46"></em></div><div class="list-text">'
						+ '<h2><span class="session-name">'+codeStr(sessionList[i].GroupName)+'</span><span class="time">'+sessionList[i].MsgTime+'</span></h2>'
						//+ '<h2>'+sessionList[i].GroupName+'<span class="time">'+sessionList[i].MsgTime+'</span></h2>' 
						+ '<p>' + statusIcon + '<span class="red" style="display:none;">[草稿]</span><span class="session-text">' + sessionList[i].MsgSendName+': '+msgContent+'</span></p></div></li>';
					if(topNum == 0){
						$('#session').prepend(temp);
					}else{
						$('#session').children().eq(topNum - 1).after(temp);
					}
					topNum += 1;
				}else{
					var temp = '<li id="session-'+sessionList[i].GroupId+'" '
						+ ' number="'+sessionList[i].UnreadmsgCount+'" msgTime="'+sessionList[i].MsgTimellong+'" topTime="0"'
						+ ' isTop="'+sessionList[i].SessionTopmark+'" msgId="'+sessionList[i].MsgId+'">'
						+ numberTemp
						+ '<div class="list-name" style="background:'+getNickNameColor(Math.abs(hashCode(sessionList[i].GroupId)))+';">'
						+ '<em class="iconn-46"></em></div><div class="list-text">'
						+ '<h2><span class="session-name">'+codeStr(sessionList[i].GroupName)+'</span><span class="time">'+sessionList[i].MsgTime+'</span></h2>'
						//+ '<h2>'+sessionList[i].GroupName+'<span class="time">'+sessionList[i].MsgTime+'</span></h2>' 
						+ '<p>' + statusIcon + '<span class="red" style="display:none;">[草稿]</span><span class="session-text">' + sessionList[i].MsgSendName+': '+msgContent+'</span></p></div></li>';
					$('#session').append(temp);
				}
				$('#session-'+sessionList[i].GroupId).data(sessionList[i]);
			}
		}
		//更新左侧菜单未读消息数
		$('#im-chat').attr('number',totalNum);
		if(totalNum > 0 && totalNum <= 999){
			$('#im-chat').find('span').html(totalNum).removeAttr('style');
		}
		if(totalNum > 999){
			$('#im-chat').find('span').html('999').removeAttr('style');
		}
	}else{
		$('#session-no-record').show();
	}
}

/**
 * 显示右键菜单
 */
function showMenu(session){
	var data = $(session).data();
	var top = data.SessionTopmark == 0 ? false : true;
	var event = window.event;
	if(event.which == 3){
		mainObject.showMenu(top,data.GroupId);
	}
	
}

/**
 * 设置置顶状态通知
 * @param data
 */
function setSesseionTop(data){
	console.log('设置置顶状态',data);
	if(data.ResponseErrcode == 0){
		if(data.bTopSession == true){
			publicObject.getSessionInfo(data.GroupId,function(info){
				$('#session-'+data.GroupId).prepend('<span class="top"></span>');
				var data_ = $('#session-'+data.GroupId).data();
				data_.SessionTopmark = 1;
				$('#session-'+data.GroupId).data(data_);
				$('#session').children().first().before($('#session-'+data.GroupId));
				topNum += 1;
				$('#session-'+data.GroupId).attr('topTime',info.sessionTopTime);
				$('#session-'+data.GroupId).attr('isTop',1);
			});
		}else{
			$('#session-'+data.GroupId).attr('isTop',0);
			$('#session-'+data.GroupId).children().remove('.top');
			var data_ = $('#session-'+data.GroupId).data();
			data_.SessionTopmark = 0;
			$('#session-'+data.GroupId).data(data_);
			var children = $('#session').children();
			children.splice(0,topNum);
			var thisMsgTime = $('#session-'+data.GroupId).attr('msgTime');
			if(thisMsgTime == undefined){
				children.first().before($('#session-'+data.GroupId));
			}else{
				for(var i = 0; i < children.length; i ++){
					var msgTime = $(children[i]).attr('msgTime');
					if(thisMsgTime >= msgTime){
						$(children[i]).before($('#session-'+data.GroupId));
						break;
					}
					$(children[i]).after($('#session-'+data.GroupId));
				}
			}
			topNum -= 1;
		}
		
	}
}

/**
 * 删除会话
 */
function deleteSession(data){
	console.log('删除会话',data);
	var _num_ = parseInt($('#session-'+data.GroupId).attr('number'));
	var total = parseInt($('#im-chat').attr('number')) - _num_;
	$('#im-chat').attr('number',total);
	if(total == 0){
		$('#im-chat').find('span').html('0').hide();
	}
	if(total > 0 && total <= 999){
		$('#im-chat').find('span').html(total);
	}
	if(total > 999){
		$('#im-chat').find('span').html('999');
	}
	if(data.ResponseErrcode == 0){
		var top = $('#session-'+data.GroupId).data().SessionTopmark;
		if(top == 1){
			topNum -= 1;
		}
		$('#session').children().remove('#session-'+data.GroupId);
		$('#msgArea').children().remove('#msgArea-'+data.GroupId);
		if($('#session').children().length == 0){
			$('#session-no-record').show();
		}
		$('#msg-no-record').show();
		$('#chatArea').hide();
	}
}

/**
 * 点击某个会话开始聊天
 * @param session
 */
function openSession(session){
	
	/*publicObject.setTip('提示');*/
	
	//关闭正在播放的 语音
	mainObject.StopVoiceMsg('','');
	
	var sessionData = $(session).data();
	$('#chatArea').removeAttr('style');
	$('#msg-no-record').attr('style','display:none;');
	$('#input-content').focus();
	
	if(CHATOBJ.groupId != undefined){
		//草稿
		var html = $('#input-content').html().trim();
		if(html != ''){
			console.log('草稿',html);
			var msgArr = formatMsg();
			console.log('草稿数据',msgArr);
			var draftHtml = '';
			var draftTrueHtml = '';
			for(var i = 0; i < msgArr.length; i ++) {
				draftHtml += msgArr[i].draft;
				draftTrueHtml += msgArr[i].html;
			}
			var oldHtml = $('#session-'+CHATOBJ.groupId).find('p').find('.session-text').html();
			draftMap.put(CHATOBJ.groupId,{'draft':draftHtml,'html':draftTrueHtml,'oldHtml':oldHtml});
			$('#session-'+CHATOBJ.groupId).find('p').find('.red').show();
			$('#session-'+CHATOBJ.groupId).find('p').find('.session-text').html(codeStr(draftHtml));
			$('#input-content').html('');
		}else{
			//$('#session-'+CHATOBJ.groupId).find('p').html('');
			draftMap.put(CHATOBJ.groupId,undefined);
		}
		
		//记录位置
		if($('#msgArea-'+CHATOBJ.groupId)[0]){
			var newMsgObj = newMsgTipMap.get(CHATOBJ.groupId);
			var oldScrollHeight = $('#msgArea-'+CHATOBJ.groupId)[0].scrollHeight;
			if(newMsgObj == undefined){
				newMsgTipMap.put(CHATOBJ.groupId,{
					'oldPosition':oldScrollHeight
				})
			}else{
				newMsgObj.oldPosition = oldScrollHeight;
				newMsgTipMap.put(CHATOBJ.groupId,newMsgObj);
			}
		}
	
	}
	//console.log('first click',rangeMap);
	var draft_ = draftMap.get(sessionData.GroupId);
	if(draft_ != undefined){
		var oldHtml = draft_.oldHtml;
		if(oldHtml != undefined){
			$('#session-'+sessionData.GroupId).find('p').find('.session-text').html(codeStr(oldHtml));
			$('#session-'+sessionData.GroupId).find('p').find('.red').hide();
		}
		$('#input-content').focus();
		$('#input-content').html(draft_.html);
		/*var inputContent = $('#input-content');
		range.selectNodeContents(inputContent);*/
		//console.log('get',rangeMap);
		var sel_ = rangeMap.get(sessionData.GroupId).sel;
		console.log('rel',sel_);
		var range_ = rangeMap.get(sessionData.GroupId).range;
		console.log('range',range_);
		range_.collapse(false);
		sel_.removeAllRanges();
		sel_.addRange(range_);
	}
	
	//对全局聊天变量进行赋值存储
	CHATOBJ = {
		'groupId':sessionData.GroupId,
		'groupType':sessionData.GroupType,
		'groupName':sessionData.GroupName
	}
	if(CHATOBJ.groupType == 1){
		CHATOBJ.staffId = sessionData.oaId;
	}else{
		CHATOBJ.staffId = undefined;
	}
	
	//上报已读和最大seqId
	if(sessionData.MsgSeqId != undefined){
		mainObject.readedSeqIDReport(sessionData.GroupId,sessionData.MsgSeqId);
		mainObject.setMsgReaded(sessionData.GroupId);
	}
	
	//页面样式
	var siblings = $(session).siblings();
	$(siblings).removeClass('active');
	$(session).addClass('active');
	console.log('会话列表数据',sessionData);
	if(sessionData.GroupType == 1){
		$('#chat-title').html(sessionData.MsgSendName);
	}else if(sessionData.GroupType == 2){
		$('#chat-title').html(codeStr(sessionData.GroupName));
	}
	var children = $('#msgArea').children();
	$(children).attr('style','display:none;');
	if($('#msgArea-'+sessionData.GroupId).length == 0){
		var temp = '<div id="msgArea-'+sessionData.GroupId+'"class="con-list" onscroll="sendReceiptAndHideTip(this)" onmousewheel="loadMore_(this)"><div id="msg"></div></div>';
		$('#msgArea').append(temp);
		
		//默认加载20条历史消息
		mainObject.GetMsglist(sessionData.GroupId,0,20,function(data){
			console.log('本地历史消息',data);
			if(data.length == 20){
				var temp = '<div class="list-more"><a href="javascript:;" onclick="loadMore()">查看更多消息</a></div>';
				$('#msgArea-'+sessionData.GroupId+' #msg').append(temp);
				firstMsgTimeMap.put(sessionData.GroupId,data[data.length - 1].sendtime);
			}
			if(data != null && data.length != 0){
				var hisLastMsgTime = data[data.length - 1].sendtime;
				for(var i = data.length -1; i >= 0; i --){
					var tempTime = '';
					//是否为第一条时间
					if(data[i].sendtime == hisLastMsgTime){
						//第一条时间
						tempTime = '<div class="list-time">'+formatMsgTime(hisLastMsgTime)+'</div>';
					}else{
						//不是第一条时间，大于5分钟显示一条
						if(data[i].sendtime - hisLastMsgTime >= 5 * 60 * 1000){
							tempTime = '<div class="list-time">'+formatMsgTime(data[i].sendtime)+'</div>';
							hisLastMsgTime = data[i].sendtime;
						}else{
							var tempTime = '';
						}
					}
					var avatarName;
					var avatarColor;
					var senderClass;
					var msgContent;
					var typeClass = '';
					var newSound = '';
					if(data[i].senderId == myInfo.imUserid){
						avatarName = '我';
						senderClass = 'list-right';
						avatarColor = getNickNameColor(myInfo.myid);
					}else{
						avatarName = getNickName(data[i].staffName);
						senderClass = 'list-left';
						avatarColor = getNickNameColor(data[i].id);
						if(data[i].VoiceBePlayed == 0){
							//未播放过的语音
							newSound = '<div class="new-m"></div>';
						}
					}
					//文本表情和@消息
					if(data[i].msgtype == 1 || data[i].msgtype == 100002){
						$('#decode').text(data[i].msgbody);
						var _msgBody_ = $('#decode').html();
						var msgBody_ = _msgBody_.replace(/(((ht|f)tps?):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?/,function(s, $1, index){
							if(s.indexOf('http://') != -1 || s.indexOf('https://') != -1){
								return '<a class="url-link" onclick="publicObject.openUrl(0,\''+s+'\')">' + s + '</a>';
							}else{
								return '<a class="url-link" onclick="publicObject.openUrl(0,\'http://'+s+'\')">' + s + '</a>';
							}
						});
						var msgBody = msgBody_.replace(/(\[[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z]+\]?)/g,function(s, $1, index){
							if(faces.indexOf($1.replace('[','').replace(']','')) != -1){
								return '<img class="input-face" src="../images/face/'+$1.replace('[','').replace(']','')+'.gif">';
							}else{
								return $1;
							}
							
						});
						
						msgContent = '<p>'+msgBody+'</p>';
						
						//将发送失败的消息放进重发map中
						if(data[i].status == 0){
							var msg = {
									"msgid": data[i].msgId, // 类型string
									"msgbody": data[i].msgbody,//类型string
									"msgtype" :1, //类型 int 1:文本 type2:表情 type3:图片
									"groupid": data[i].groupid, //类型stringa
									"grouptype": data[i].grouptype, //类型int
									"senderid": myInfo.imUserid //类型int
								}
								resendMsgMap.put(data[i].msgId,msg);
						}
					
					}else if(data[i].msgtype == 2){
						//语音消息
						typeClass = ' voice';
						var msgNew = '';
						var width;
						if(data[i].playTime <= 20){
							width = 80;
						}else{
							width = 80 + (data[i] - 20);
						}
						msgContent = '<div time="'+data[i].playTime+'" style="width:'+width+'px" class="clearfix" onclick="playSound(this)"><div class="voice-con" id="voice-con">'
							+'<em class="iconn-2"></em><div class="voice-box hide"></div></div><span>'+data[i].playTime+'"</span>'
							+ '</div>' + newSound;
					}else if(data[i].msgtype == 3){
						//图片消息
						//图片消息
						var width;
						var heigth;
						if(data[i].picwidth / data[i].picheight > 1){
							if(data[i].picwidth > 150){
								width = 150;
								heigth = 150 * data[i].picheight / data[i].picwidth;
							}else{
								width = data[i].picwidth;
								heigth = data[i].picheight;
							}
						}else if(data[i].picwidth / data[i].picheight < 1){
							if(data[i].picheight > 150){
								width = 150 * data[i].picwidth / data[i].picheight;
								heigth = 150;
							}else{
								width = data[i].picwidth;
								heigth = data[i].picheight;
							}
						}else{
							width = 150;
							heigth = 150;
						}
						var url;
						if(data[i].status == 0){
							url = data[i].sourPath;
						}else{
							if(data[i].SPicLocalPath == ''){
								url = data[i].picurl;
							}else{
								url = data[i].SPicLocalPath;
							}
						}
						msgContent = '<p><img class="pop-image" imgType="1" msgId="'+data[i].msgId+'"' 
							+ 'fileName="'+data[i].SerFileName+'"' 
							+ 'fileExt="'+data[i].fileExt+'" src="'+url+'"' 
							//+ ' style="max-width: 300px;" onclick="viewImg(this)"/></p>';
							//+ 'style="width:'+width+'px;height:'+height+'px;" onclick="viewImg(this)"/></p>';
							+ 'style="width:'+width+'px;height:'+heigth+'px;" onclick="viewImg(this)"/></p>';
						
						//将发送失败的消息放进重发集合中
						if(data[i].status == 0){
							var msg = {
								"msgid": data[i].msgId, // 类型string
								"msgbody": data[i].msgbody,//类型string
								"msgtype" :3, //类型 int 1:文本 type2:表情 type3:图片
								"groupid": data[i].groupid, //类型string
								"grouptype": data[i].grouptype, //类型int
								"senderid": myInfo.imUserid, //类型int
								"picpath":data[i].sourPath//
							}
							resendMsgMap.put(data[i].msgId,msg);
						}
						
					}else if(data[i].msgtype == 5){
						//位置
						msgContent = '<div class="map" x="'+data[i].LocaltionLongitude+'" y="'+data[i].LocaltionLatitude+'" positionName="'
							+ data[i].LocaltionContent+'"><img src="'+data[i].LocaltionPicUrl+'" width="150">'
							+ '<p>'+data[i].LocaltionContent+'</p></div>';
					}else if(data[i].msgtype == 100001){
						//回执消息
						$('#decode').text(data[i].msgbody);
						var _msgBody_ = $('#decode').html();
						var msgBody_ = _msgBody_.replace(/(((ht|f)tps?):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?/,function(s, $1, index){
							if(s.indexOf('http://') != -1 || s.indexOf('https://') != -1){
								return '<a class="url-link" onclick="publicObject.openUrl(0,\''+s+'\')">' + s + '</a>';
							}else{
								return '<a class="url-link" onclick="publicObject.openUrl(0,\'http://'+s+'\')">' + s + '</a>';
							}
						});
						var msgBody = msgBody_.replace(/(\[[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z]+\]?)/g,function(s, $1, index){
							if(faces.indexOf($1.replace('[','').replace(']','')) != -1){
								return '<img class="input-face" src="../images/face/'+$1.replace('[','').replace(']','')+'.gif">';
							}else{
								return $1;
							}
							
						});
						msgContent = '<p>'+msgBody+'</p>';
						var list = receiptMap.get(data[i].groupid);
						if(list == undefined){
							var arr = [];
							receiptObj = {
									'senderId':data[i].senderId,
									'seqId':data[i].msgSeqId,
									'msgId':data[i].msgId
							}
							arr.push(receiptObj);
							
							receiptMap.put(data[i].groupid,arr);
						}else{
							receiptObj = {
									'senderId':data[i].senderId,
									'seqId':data[i].msgSeqId,
									'msgId':data[i].msgId
							}
							list.push(receiptObj);
							receiptMap.put(data[i].groupid,list);
						}
					}
					//消息状态是否为发送成功
					var resendIcon = '';
					if(data[i].status == 0){
						resendIcon = '<em class="iconn-34" msgId="'+data[i].msgId+'" onclick="resendMsg(this)"></em>';
					}
					var temp = tempTime + '<div id="msg-'+data[i].msgId+'" class="'+senderClass+' clearfix">'
						+ '<div oaId="'+data[i].id+'" class="list-name" style="background:'+avatarColor+';">'+avatarName+'</div>'
						+ '<pre class="list-text'+typeClass+'">' + msgContent + resendIcon + '</pre></div>';
					$('#msgArea-'+sessionData.GroupId+' #msg').append(temp);
					
				}
				
				//判断回执可见
				var list = receiptMap.get(CHATOBJ.groupId);
				if(list != undefined && list.length != 0){
					for(var i = 0;i < list.length; i ++){
						var offsetTop = document.getElementById('msg-'+list[i].msgId).offsetTop;
						var scrollTop = $('#msgArea-'+CHATOBJ.groupId).scrollTop();
						var clientHeight = $('#msgArea-'+CHATOBJ.groupId).height();
						if(offsetTop >= scrollTop && offsetTop <= scrollTop + clientHeight){
							console.log('回执: ' + list[i].msgId + ' 已经查看');
							mainObject.readedReport(CHATOBJ.groupId,list[i].msgId,list[i].senderId,list[i].seqId);
							list.splice(i,1);
							i = i - 1;
						}
					}
				}
				
				var msgHeight = $('#msgArea-'+sessionData.GroupId+' #msg').height();
				$('#msgArea-'+sessionData.GroupId).scrollTop(msgHeight);

				var _num_ = parseInt($(session).attr('number'));
				if(data != undefined && data.length != 0){
					
					if(_num_ != 0){
						if(_num_ <= 20){
							var firstMsg_ = data[_num_ - 1];
							var msgId = firstMsg_.msgId;
							var thisOffsetTop = document.getElementById('msg-'+msgId).offsetTop;
							var thisScrollHeight = $('#msgArea-' + firstMsg_.groupid)[0].scrollHeight;
							var clientHeight = $('#msgArea-' + firstMsg_.groupid).height();
							if(thisScrollHeight - thisOffsetTop > clientHeight){
								$('#newMsgTip').html(_num_ + '条新消息').show();
							}
							var obj = {
								'type':0,
								'msgId':msgId,
								'position':thisOffsetTop,
					 			'unreadNum':_num_
							}
							newMsgTipMap.put(firstMsg_.groupid,obj);
						}else{
							$('#newMsgTip').html(_num_ + '条新消息').show();
							var obj = {
								'type':0,
					 			'unreadNum':_num_
							}
							newMsgTipMap.put(CHATOBJ.groupId,obj);
						}
					}else{
						$('#newMsgTip').hide();
					}
				}
				//未读消息数
				$(session).attr('number','0');
				$(session).find('.num').html('0').attr('style','display:none;');
				var total = parseInt($('#im-chat').attr('number')) - _num_;
				$('#im-chat').attr('number',total);
				if(total == 0){
					$('#im-chat').find('span').html('0').attr('style','display:none;');
				}
				if(total > 0 && total <= 999){
					$('#im-chat').find('span').html(total);
				}
				if(total > 999){
					$('#im-chat').find('span').html('999');
				}
			}
		});
		
		//新消息提示
		/*
		if(_num_ != 0){
			$('#newMsgTip').html(_num_ + '条新消息').attr('isFirst',1).show();
		}*/
		
	}else{
		$('#msgArea-'+sessionData.GroupId).removeAttr('style');
		var msgHeight = $('#msgArea-'+sessionData.GroupId+' #msg').height();
		$('#msgArea-'+sessionData.GroupId).scrollTop(msgHeight);
		var _num_ = parseInt($(session).attr('number'));
		var newMsgObj = newMsgTipMap.get(sessionData.GroupId);
		if(newMsgObj != undefined){
			var oldPosition = newMsgObj.oldPosition;
			var newPosition = $('#msgArea-'+sessionData.GroupId)[0].scrollHeight;
			var clientHeight = $('#msgArea-'+sessionData.GroupId).height();
			if(newPosition - oldPosition > clientHeight){
				$('#newMsgTip').html(_num_ + '条新消息').show();
				newMsgObj.type = 1;
				newMsgObj.position = oldPosition;
				newMsgTipMap.put(sessionData.GroupId,newMsgObj);
			}
		}
		if(_num_  == 0){
			$('#newMsgTip').hide();
		}
		//未读消息数
		$(session).attr('number','0');
		$(session).find('.num').html('0').attr('style','display:none;');
		var total = parseInt($('#im-chat').attr('number')) - _num_;
		$('#im-chat').attr('number',total);
		if(total == 0){
			$('#im-chat').find('span').html('0').attr('style','display:none;');
		}
		if(total > 0 && total <= 999){
			$('#im-chat').find('span').html(total);
		}
		if(total > 999){
			$('#im-chat').find('span').html('999');
		}
	}
	
}

function sendReceiptAndHideTip(){
	
	//判断并隐藏新消息提示
	var newMsgObj = newMsgTipMap.get(CHATOBJ.groupId);
	if(newMsgObj != undefined){
		//第一次打开
		if(newMsgObj.type == 0){
			if(newMsgObj.unreadNum <= 20){
				var scrollTop = $('#msgArea-'+CHATOBJ.groupId).scrollTop();
				if(scrollTop < newMsgObj.position){
					$('#newMsgTip').hide();
				}
			}else{
				
			}
		}
		if(newMsgObj.type == 1){
			var scrollTop = $('#msgArea-'+CHATOBJ.groupId).scrollTop();
			if(scrollTop < newMsgObj.position){
				$('#newMsgTip').hide();
			}
		}
	}
	
	//发送回执
	var list = receiptMap.get(CHATOBJ.groupId);
	if(list != undefined && list.length != 0){
		for(var i = 0;i < list.length; i ++){
			var offsetTop = document.getElementById('msg-'+list[i].msgId).offsetTop;
			var scrollTop = $('#msgArea-'+CHATOBJ.groupId).scrollTop();
			var clientHeight = $('#msgArea-'+CHATOBJ.groupId).height();
			if(offsetTop >= scrollTop && offsetTop <= scrollTop + clientHeight){
				console.log('回执: ' + list[i].msgId + ' 已经查看');
				mainObject.readedReport(CHATOBJ.groupId,list[i].msgId,list[i].senderId,list[i].seqId);
				list.splice(i,1);
				i = i - 1;
			}
		}
	}
}

function topFirstNew(){
	
	$('#newMsgTip').hide();
	var newMsgObj = newMsgTipMap.get(CHATOBJ.groupId);
	
	if(newMsgObj != undefined){
		//第一次打开
		if(newMsgObj.type == 0){
			if(newMsgObj.unreadNum <= 20){
				$('#msgArea-'+CHATOBJ.groupId).scrollTop(newMsgObj.position);
			}else{
				var pageSize = newMsgObj.unreadNum - 20;
				loadMoreMsg(CHATOBJ.groupId,pageSize,false);
			}
		}
		//不是第一次打开
		if(newMsgObj.type == 1){
			$('#msgArea-'+CHATOBJ.groupId).scrollTop(newMsgObj.position);
		}
	}
}

function loadMore_(msgArea){
	var SH = $(msgArea)[0].scrollHeight;
	var ST = $(msgArea).scrollTop();
	var CH = $(msgArea).height();
	if(SH > ST + CH){
		$(msgArea).find('.list-new').hide();
	}
	var event = window.event;
	var scrollTop = $(msgArea).scrollTop();
	var wheelDelta = event.wheelDelta;
	if(scrollTop == 0 && wheelDelta > 0){
		var more = $(msgArea).find('.list-more');
		if(more.length != 0 && more.css('display') != 'none'){
			loadMoreMsg(CHATOBJ.groupId,20,true);
		}
	}
}

function loadMore(){
	loadMoreMsg(CHATOBJ.groupId,20,true);
}

/**
 * 加载更多历史消息
 * @param groupId
 * @param pageSize
 * @param changeScroll
 */
function loadMoreMsg(groupId,pageSize,changeScroll){
	$('#msgArea-'+groupId).find('.list-more').attr('style','display:none;');
	var firstTime = firstMsgTimeMap.get(groupId);
	var insertPosition = 0;
	//加载更多记录之前记录滚动条高度
	var oldScrollHeight = $('#msgArea-'+groupId)[0].scrollHeight;
	mainObject.GetMsglist(groupId,firstTime,pageSize,function(data){
		
		firstMsgTimeMap.put(groupId,data[data.length - 1].sendtime);
		if(data != undefined && data.length != 0){
			if(data.length == pageSize){
				$('#msgArea-'+groupId).find('.list-more').removeAttr('style');
			}
			var hisLastMsgTime = data[data.length - 1].sendtime;
			for(var i = data.length -1; i >= 0; i --){
				var tempTime = '';
				//是否为第一条时间
				if(data[i].sendtime == hisLastMsgTime){
					//第一条时间
					tempTime = '<div class="list-time">'+formatMsgTime(hisLastMsgTime)+'</div>';
					$('#msgArea-'+groupId+' #msg').children().eq(insertPosition).after(tempTime);
					insertPosition += 1;
				}else{
					//不是第一条时间，大于5分钟显示一条
					if(data[i].sendtime - hisLastMsgTime >= 5 * 60 * 1000){
						tempTime = '<div class="list-time">'+formatMsgTime(data[i].sendtime)+'</div>';
						hisLastMsgTime = data[i].sendtime;
						$('#msgArea-'+groupId+' #msg').children().eq(insertPosition).after(tempTime);
						insertPosition += 1;
					}
				}
				var avatarName;
				var avatarColor;
				var senderClass;
				var msgContent;
				var typeClass = '';
				var newSound = '';
				if(data[i].senderId == myInfo.imUserid){
					avatarName = '我';
					senderClass = 'list-right';
					avatarColor = getNickNameColor(myInfo.myid);
				}else{
					avatarName = getNickName(data[i].staffName);
					senderClass = 'list-left';
					avatarColor = getNickNameColor(data[i].id);
					if(data[i].VoiceBePlayed == 0){
						//未播放过的语音
						newSound = '<div class="new-m"></div>';
					}
				}
				if(data[i].msgtype == 1 || data[i].msgtype == 100002){
					$('#decode').text(data[i].msgbody);
					var _msgBody_ = $('#decode').html();
					var msgBody_ = _msgBody_.replace(/(((ht|f)tps?):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?/,function(s, $1, index){
						if(s.indexOf('http://') != -1 || s.indexOf('https://') != -1){
							return '<a class="url-link" onclick="publicObject.openUrl(0,\''+s+'\')">' + s + '</a>';
						}else{
							return '<a class="url-link" onclick="publicObject.openUrl(0,\'http://'+s+'\')">' + s + '</a>';
						}
					});
					var msgBody = msgBody_.replace(/(\[[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z]+\]?)/g,function(s, $1, index){
						if(faces.indexOf($1.replace('[','').replace(']','')) != -1){
							return '<img class="input-face" src="../images/face/'+$1.replace('[','').replace(']','')+'.gif">';
						}else{
							return $1;
						}
						
					});
					
					msgContent = '<p>'+msgBody+'</p>';
					
					//将发送失败的消息放进重发map中
					if(data[i].status == 0){
						var msg = {
								"msgid": data[i].msgId, // 类型string
								"msgbody": data[i].msgbody,//类型string
								"msgtype" :1, //类型 int 1:文本 type2:表情 type3:图片
								"groupid": data[i].groupid, //类型stringa
								"grouptype": data[i].grouptype, //类型int
								"senderid": myInfo.imUserid //类型int
							}
							resendMsgMap.put(data[i].msgId,msg);
					}
					
				}else if(data[i].msgtype == 2){
					//语音消息
					typeClass = ' voice';
					var msgNew = '';
					var width;
					if(data[i].playTime <= 20){
						width = 80;
					}else{
						width = 80 + (data[i] - 20);
					}
					msgContent = '<div time="'+data[i].playTime+'" style="width:'+width+'px" class="clearfix" onclick="playSound(this)"><div class="voice-con" id="voice-con">'
						+ '<em class="iconn-2"></em><div class="voice-box hide"></div></div><span>'+data[i].playTime+'"</span>'
						+ '</div>' + newSound;
				}else if(data[i].msgtype == 3){
					//图片消息
					var width;
					var heigth;
					if(data[i].picwidth / data[i].picheight > 1){
						if(data[i].picwidth > 150){
							width = 150;
							heigth = 150 * data[i].picheight / data[i].picwidth;
						}else{
							width = data[i].picwidth;
							heigth = data[i].picheight;
						}
					}else if(data[i].picwidth / data[i].picheight < 1){
						if(data[i].picheight > 150){
							width = 150 * data[i].picwidth / data[i].picheight;
							heigth = 150;
						}else{
							width = data[i].picwidth;
							heigth = data[i].picheight;
						}
					}else{
						width = 150;
						heigth = 150;
					}
					var url;
					if(data[i].status == 0){
						url = data[i].sourPath;
					}else{
						if(data[i].SPicLocalPath == ''){
							url = data[i].picurl;
						}else{
							url = data[i].SPicLocalPath;
						}
					}
					msgContent = '<p><img class="pop-image" imgType="1" msgId="'+data[i].msgId+'"' 
						+ 'fileName="'+data[i].SerFileName+'"' 
						+ 'fileExt="'+data[i].fileExt+'" src="'+url+'"' 
						+ 'style="width:'+width+'px;height:'+heigth+'px;" onclick="viewImg(this)"/></p>';
					
					//将发送失败的消息放进重发集合中
					if(data[i].status == 0){
						var msg = {
							"msgid": data[i].msgId, // 类型string
							"msgbody": data[i].msgbody,//类型string
							"msgtype" :3, //类型 int 1:文本 type2:表情 type3:图片
							"groupid": data[i].groupid, //类型string
							"grouptype": data[i].grouptype, //类型int
							"senderid": myInfo.imUserid, //类型int
							"picpath":data[i].sourPath//
						}
						resendMsgMap.put(data[i].msgId,msg);
					}
					
				}else if(data[i].msgtype == 5){
					//位置
					msgContent = '<div class="map" x="'+data[i].LocaltionLongitude+'" y="'+data[i].LocaltionLatitude+'" positionName="'
						+ data[i].LocaltionContent+'"><img src="'+data[i].LocaltionPicUrl+'" width="150">'
						+ '<p>'+data[i].LocaltionContent+'</p></div>';
				}else if(data[i].msgtype == 100001){
					//回执消息
					$('#decode').text(data[i].msgbody);
					var _msgBody_ = $('#decode').html();
					var msgBody_ = _msgBody_.replace(/(((ht|f)tps?):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?/,function(s, $1, index){
						if(s.indexOf('http://') != -1 || s.indexOf('https://') != -1){
							return '<a class="url-link" onclick="publicObject.openUrl(0,\''+s+'\')">' + s + '</a>';
						}else{
							return '<a class="url-link" onclick="publicObject.openUrl(0,\'http://'+s+'\')">' + s + '</a>';
						}
					});
					var msgBody = msgBody_.replace(/(\[[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z]+\]?)/g,function(s, $1, index){
						if(faces.indexOf($1.replace('[','').replace(']','')) != -1){
							return '<img class="input-face" src="../images/face/'+$1.replace('[','').replace(']','')+'.gif">';
						}else{
							return $1;
						}
						
					});
					msgContent = '<p>'+msgBody+'</p>';
					var list = receiptMap.get(data[i].groupid);
					if(list == undefined){
						var arr = [];
						receiptObj = {
								'senderId':data[i].senderId,
								'seqId':data[i].msgSeqId,
								'msgId':data[i].msgId
						}
						arr.push(receiptObj);
						
						receiptMap.put(data[i].groupid,arr);
					}else{
						receiptObj = {
								'senderId':data[i].senderId,
								'seqId':data[i].msgSeqId,
								'msgId':data[i].msgId
						}
						list.push(receiptObj);
						receiptMap.put(data[i].groupid,list);
					}
				}
				
				//消息状态是否为发送成功
				var resendIcon = '';
				if(data[i].status == 0){
					resendIcon = '<em class="iconn-34" msgId="'+data[i].msgId+'" onclick="resendMsg(this)"></em>';
				}
				
				var temp = '<div id="msg-'+data[i].msgId+'" class="'+senderClass+' clearfix">'
					+ '<div class="list-name" style="background:'+avatarColor+';" oaId="'+data[i].id+'">'+avatarName+'</div>'
					+ '<pre class="list-text'+typeClass+'">' + msgContent + resendIcon + '</pre></div>';
				$('#msgArea-'+groupId+' #msg').children().eq(insertPosition).after(temp);
				insertPosition += 1;
			}
			if(changeScroll){
				var newScrollHeight = $('#msgArea-'+groupId)[0].scrollHeight;
				$('#msgArea-'+groupId).scrollTop(newScrollHeight - oldScrollHeight);
			}else{
				if($('#msgArea-'+groupId).find('.list-more').css('display') == 'none'){
					$('#msgArea-'+groupId).scrollTop(0);
				}else{
					$('#msgArea-'+groupId).scrollTop(40);
				}
				
			}
			//判断回执可见
			var list = receiptMap.get(CHATOBJ.groupId);
			if(list != undefined && list.length != 0){
				for(var i = 0;i < list.length; i ++){
					var offsetTop = document.getElementById('msg-'+list[i].msgId).offsetTop;
					var scrollTop = $('#msgArea-'+CHATOBJ.groupId).scrollTop();
					var clientHeight = $('#msgArea-'+CHATOBJ.groupId).height();
					if(offsetTop >= scrollTop && offsetTop <= scrollTop + clientHeight){
						console.log('回执: ' + list[i].msgId + ' 已经查看');
						mainObject.readedReport(CHATOBJ.groupId,list[i].msgId,list[i].senderId,list[i].seqId);
						list.splice(i,1);
						i = i - 1;
					}
				}
			}
			
			//修改新消息未读条数容器
			var newMsgObj = newMsgTipMap.get(CHATOBJ.groupId);
			if(newMsgObj != undefined){
				if(newMsgObj.unreadNum > 20){
					newMsgObj.unreadNum = newMsgObj.unreadNum - data.length;
				}
				if(newMsgObj.unreadNum <= 20){
					var firstMsg = data[newMsgObj.unreadNum - 1];
					var msgId = firstMsg.msgId;
					var offsetTop = document.getElementById('msg-'+msgId).offsetTop;
					newMsgObj.msgId = msgId;
					newMsgObj.position = offsetTop;
					newMsgTipMap.put(CHATOBJ.groupId,newMsgObj);
				}
			}
		}
	});
}

/**
 * 接收消息
 * @param msg
 */
function receiveMsg(msg){
	var draft = draftMap.get(msg.groupid);
	if(draft != undefined){
		draft.oldHtml = undefined;
	}
	draftMap.put(msg.groupid,draft);
	if(CHATOBJ != undefined && msg.groupid == CHATOBJ.groupId){
		mainObject.readedSeqIDReport(CHATOBJ.groupId,msg.msgSeqId);
		mainObject.setMsgReaded(CHATOBJ.groupId);
	}
	console.log("收到消息",msg); 
	//播放消息提示音
	if(soundOpen && msg.senderId != myInfo.imUserid){
		mainObject.playMsgSound();
	}
	
	$('#session-no-record').hide();
	if($('#session-' + msg.groupid).length == 0){
		publicObject.getSessionInfo(msg.groupid,function(info){
			var msgBody = '';
			var topMark = '';
			if(info.sessionTop == 1){
				topMark = '<span class="top"></span>';
				topTime = info.sessionTopTime;
			}else{
				topTime = '0';
			}
			if(msg.msgtype == 1 || msg.msgtype == 100001 || msg.msgtype == 100002){
				$('#decode').text(msg.msgbody);
				msgBody = $('#decode').html();
			}else if(msg.msgtype == 2){
				msgBody = '[语音]';
			}else if(msg.msgtype == 3){
				msgBody = '[图片]';
			}else if(msg.msgtype == 5){
				msgBody = '[位置]';
			}
			var newNumber  = '<span class="num" style="display:none;">0</span>';
			var newNumber_ = 0;
			if(msg.senderId != myInfo.imUserid){
				newNumber = '<span class="num">1</span>';
				newNumber_ = 1;
			}
			if(msg.grouptype == 1){
				var temp = '<li id="session-'+msg.groupid+'"'
					+ ' number="'+newNumber_+'" msgTime="'+msg.sendtime+'"'
					+ 'topTime="'+topTime+'" isTop="'+info.sessionTop+'" msgId="'+msg.msgId+'">'
					+ topMark + newNumber + '<div class="list-name">'
					+ '</div><div class="list-text">'
					+ '<h2><span class="session-name"></span><span class="time">'+date_format(msg.sendtime,'HH:mm')+'</span></h2>'
					+ '<p><em id="send-status" class="iconn-35" style="display: none;"></em>'
					+ '<span class="red" style="display:none;">[草稿]</span><span class="session-text">'+msgBody+'</span></p></div></li>';
				if(info.sessionTop == 0){
					if(topNum == 0){
						$('#session').prepend(temp);
					}else{
						$('#session').children().eq(topNum - 1).after(temp);
					}
				}else{
					var children = $('#session').children();
					for(var i = 0; i < children.length; i ++){
						var topTime = $(children[i]).attr('topTime');
						if(info.sessionTopTime > topTime){
							$(children[i]).before(temp);
							break;
						}
					}
				}
				var sessionData = {
					'GroupId':msg.groupid,
					'GroupType':1,
					'MsgSeqId':msg.msgSeqId,
					'GroupName':msg.groupname,
					'oaId':msg.id,
					'MsgSendName':msg.senderName,
					'SessionTopmark':info.sessionTop
				}
					//$('#session-'+msg.groupid).data(sessionData);
				var receiveId = parseInt(msg.groupid.replace(myInfo.imUserid,'').replace('_',''));
				publicObject.getMemberInfoFromImId(receiveId,function(data){
					$('#session-'+sessionData.GroupId).find('.list-name').css('background',getNickNameColor(data.id)).html(getNickName(data.staffName));
					$('#session-'+sessionData.GroupId).find('.session-name').html(data.staffName);
					sessionData.MsgSendName = data.staffName;
					sessionData.oaId = data.id;
					sessionData.GroupName = data.staffName;
					$('#session-'+msg.groupid).data(sessionData);
				});
			}
			if(msg.grouptype == 2){
				publicObject.getGroupInfo(msg.groupid,function(data){
					var temp = '<li id="session-'+msg.groupid+'"'
						+ ' number="'+newNumber_+'" msgTime="'+msg.sendtime+'"'
						+ 'topTime="'+topTime+'" isTop="'+info.sessionTop+'" msgId="'+msg.msgId+'">'
						+ topMark + newNumber+'<div class="list-name" style="background:'+getNickNameColor(Math.abs(hashCode(msg.groupid)))+';">'
						+ '<em class="iconn-46"></em>'
						+ '</div><div class="list-text">'
						+ '<h2><span class="session-name">'+codeStr(data.groupName)+'</span><span class="time">'+date_format(msg.sendtime,'HH:mm')+'</span></h2>'
						+ '<p><em id="send-status" class="iconn-35" style="display: none;"></em>'
						+ '<span class="red" style="display:none;">[草稿]</span><span class="session-text">'+msg.staffName+': '+msgBody+'</span></p></div></li>';
					if(info.sessionTop == 0){
						if(topNum == 0){
							$('#session').prepend(temp);
						}else{
							$('#session').children().eq(topNum - 1).after(temp);
						}
					}else{
						var children = $('#session').children();
						for(var i = 0; i < children.length; i ++){
							var topTime = $(children[i]).attr('topTime');
							if(info.sessionTopTime > topTime){
								$(children[i]).before(temp);
								break;
							}
						}
					}
					var sessionData = {
						'GroupId':msg.groupid,
						'GroupType':2,
						'MsgSeqId':msg.msgSeqId,
						'MsgSendName':msg.staffName,
						'GroupName':data.groupName,
						'SessionTopmark':info.sessionTop
					}
					$('#session-'+msg.groupid).data(sessionData);
				})
				
			}
			if(msg.senderId != myInfo.imUserid){
				var total = parseInt($('#im-chat').attr('number')) + 1;
				$('#im-chat').attr('number',total);
				if(total > 0 && total <= 999){
					$('#im-chat').find('span').html(total).removeAttr('style');
				}
				if(total > 999){
					$('#im-chat').find('span').html('999').removeAttr('style');
				}
			}
			
			if(info.sessionTop == 0){
				if(topNum == 0){
					
				}
			}
		});
	}else{
		
		//更新seqId
		var sData = $('#session-'+msg.groupid).data();
		sData.MsgSeqId = msg.msgSeqId;
		$('#session-'+msg.groupid).data(sData);
		
		var msgBody = '';
		if(msg.msgtype == 1 || msg.msgtype == 100001 ||  msg.msgtype == 100002){
			$('#decode').text(msg.msgbody);
			msgBody = $('#decode').html();
		}else if(msg.msgtype == 2){
			msgBody = '[语音]';
		}else if(msg.msgtype == 3){
			msgBody = '[图片]';
		}else if(msg.msgtype == 5){
			msgBody = '[位置]';
		}
		
		//更新msgId并移除发送中和失败的的icon
		$('#session-'+msg.groupid).attr('msgId',msg.msgId);
		$('#session-'+msg.groupid).find('p').find('em').hide();
		$('#session-'+msg.groupid).find('p').find('.red').hide();
		//更新消息内容，消息消息时间
		if(msg.grouptype == 1){
			$('#session-'+msg.groupid).find('p').find('.session-text').html(msgBody);
		}else if(msg.grouptype == 2){
			$('#session-'+msg.groupid).find('p').find('.session-text').html(msg.staffName+': '+msgBody);
		}
		$('#session-'+msg.groupid).attr('msgTime',msg.sendtime);
		$('#session-'+msg.groupid).find('.time').html(date_format(msg.sendtime,'HH:mm'));
		//改变顺序
		var isTop = $('#session-'+msg.groupid).attr('isTop');
		if(isTop == 0){
			if(topNum == 0){
				$('#session').children().first().before($('#session-'+msg.groupid));
			}else{
				$('#session').children().eq(topNum - 1).after($('#session-'+msg.groupid));
			}
		}
		//更新消息未读数量
		if(CHATOBJ.groupId != msg.groupid &&  msg.senderId != myInfo.imUserid){
			var num_ = parseInt($('#session-'+msg.groupid).attr('number')) + 1;
			$('#session-'+msg.groupid).attr('number',num_);
			if(num_ > 0 && num_ <= 99){
				$('#session-'+msg.groupid).find('.num').html(num_).show();
			}else if(num_ > 99){
				$('#session-'+msg.groupid).find('.num').html('99+').show();
			}
			var total = parseInt($('#im-chat').attr('number')) + 1;
			$('#im-chat').attr('number',total);
			if(total > 0 && total <= 999){
				$('#im-chat').find('.num').html(total).show();
			}else if(total > 999){
				$('#im-chat').find('.num').html('999').show();
			}
		}
		
		if($('#msgArea-'+msg.groupid).length != 0){
			var tempTime = '';
			if(lastMsgTimeMap.get(msg.groupid) == undefined){
				lastMsgTimeMap.put(msg.groupid,msg.sendtime);
				tempTime = '<div class="list-time">'+formatMsgTime(msg.sendtime)+'</div>';
			}else{
				if(msg.sendtime - lastMsgTimeMap.get(msg.groupid) >= 5 * 60 * 1000){
					tempTime = '<div class="list-time">'+formatMsgTime(msg.sendtime)+'</div>';
					lastMsgTimeMap.put(msg.groupid,msg.sendtime);
				}else{
					tempTime = '';
				}
			}
			var avatarName;
			//var avatarColor = getNickNameColor();
			var senderClass;
			var msgContent;
			var avatarColor;
			var typeClass = '';
			var newSound = '';
			if(msg.senderId ==myInfo.imUserid){
				avatarName = '我';
				senderClass = 'list-right';
				avatarColor = getNickNameColor(myInfo.myid);
			}else{
				avatarName = getNickName(msg.staffName);
				senderClass = 'list-left';
				avatarColor = getNickNameColor(msg.id);
				newSound = '<div class="new-m"></div>';
			}
			if(msg.msgtype == 1 || msg.msgtype == 100002){
				//文本消息
				/*var msgBody = msg.msgbody.replace(/(\[[\u4E00-\u9FA5\uF900-\uFA2D]+\]?)/g,function(s, $1, index){
					if(faces.indexOf($1.replace('[','').replace(']','')) != -1){
						return '<img class="input-face" src="../images/face/'+$1.replace('[','').replace(']','')+'.png">';
					}else{
						return $1;
					}
				});*/
				$('#decode').text(msg.msgbody);
				var _msgBody_ = $('#decode').html();
				var msgBody_ = _msgBody_.replace(/(((ht|f)tps?):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?/g,function(s, $1, index){
					if(s.indexOf('http://') != -1 || s.indexOf('https://') != -1){
						return '<a class="url-link" onclick="publicObject.openUrl(0,\''+s+'\')">' + s + '</a>';
					}else{
						return '<a class="url-link" onclick="publicObject.openUrl(0,\'http://'+s+'\')">' + s + '</a>';
					}
				});
				var msgBody = msgBody_.replace(/(\[[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z]+\]?)/g,function(s, $1, index){
					if(faces.indexOf($1.replace('[','').replace(']','')) != -1){
						return '<img class="input-face" src="../images/face/'+$1.replace('[','').replace(']','')+'.gif">';
					}else{
						return $1;
					}
				});
				
				msgContent = '<p>'+msgBody+'</p>';
			}else if(msg.msgtype == 2){
				//语音消息
				typeClass = ' voice';
				var width;
				if(msg.playTime <= 20){
					width = 80;
				}else{
					width = 80 + (msg.playTime - 20);
				}
				msgContent = '<div time="'+msg.playTime+'" style="width:'+width+'px" class="clearfix" onclick="playSound(this)"><div class="voice-con" id="voice-con">'
					+ '<em class="iconn-2"></em><div class="voice-box hide"></div></div><span>'+msg.playTime+'"</span>'
					+ '</div>' + newSound;
			}else if(msg.msgtype == 3){
				//图片消息
				var width;
				var heigth;
				if(msg.picwidth / msg.picheight > 1){
					if(msg.picwidth > 150){
						width = 150;
						heigth = 150 * msg.picheight / msg.picwidth;
					}else{
						width = msg.picwidth;
						heigth = msg.picheight;
					}
				}else if(msg.picwidth / msg.picheight < 1){
					if(msg.picheight > 150){
						width = 150 * msg.picwidth / msg.picheight;
						heigth = 150;
					}else{
						width = msg.picwidth;
						heigth = msg.picheight;
					}
				}else{
					width = 150;
					heigth = 150;
				}
				//msgContent = '<p><img src="'+msg.picurl+'" style="width:'+width+'px;height:'+height+'px;"/></p>';
				msgContent = '<p><img class="pop-image" imgType="1" msgId="'+msg.msgId+'"' 
					+ 'fileName="'+msg.SerFileName+'"' 
					+ 'fileExt="'+msg.fileExt+'" src="'+msg.picurl+'"' 
					+ 'style="width:'+width+'px;height:'+heigth+'px;" onclick="viewImg(this)"/></p>';
			}else if(msg.msgtype == 5){
				//位置
				msgContent = '<div class="map" x="'+msg.LocaltionLongitude+'" y="'+msg.LocaltionLatitude+'" positionName="'
					+ msg.LocaltionContent + '"><img src="'+msg.LocaltionPicUrl+'" width="150">'
					+ '<p>'+msg.LocaltionContent+'</p></div>';
			}else if(msg.msgtype = 100001){
				//回执消息
				$('#decode').text(msg.msgbody);
				var _msgBody_ = $('#decode').html();
				var msgBody_ = _msgBody_.replace(/(((ht|f)tps?):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?/,function(s, $1, index){
					if(s.indexOf('http://') != -1 || s.indexOf('https://') != -1){
						return '<a class="url-link" onclick="publicObject.openUrl(0,\''+s+'\')">' + s + '</a>';
					}else{
						return '<a class="url-link" onclick="publicObject.openUrl(0,\'http://'+s+'\')">' + s + '</a>';
					}
				});
				var msgBody = msgBody_.replace(/(\[[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z]+\]?)/g,function(s, $1, index){
					if(faces.indexOf($1.replace('[','').replace(']','')) != -1){
						return '<img class="input-face" src="../images/face/'+$1.replace('[','').replace(']','')+'.gif">';
					}else{
						return $1;
					}
				});
				
				msgContent = '<p>'+msgBody+'</p>';
				var list = receiptMap.get(msg.groupid);
				if(list == undefined){
					var arr = [];
					receiptObj = {
							'senderId':msg.senderId,
							'seqId':msg.msgSeqId,
							'msgId':msg.msgId
					}
					arr.push(receiptObj);
					
					receiptMap.put(msg.groupid,arr);
				}else{
					receiptObj = {
							'senderId':msg.senderId,
							'seqId':msg.msgSeqId,
							'msgId':msg.msgId
					}
					list.push(receiptObj);
					receiptMap.put(msg.groupid,list);
				}
			}
			var temp = tempTime + '<div id="msg-'+msg.msgId+'" class="'+senderClass+' clearfix">'
				+ '<div class="list-name" style="background:'+avatarColor+';" oaId="'+msg.id+'">'+avatarName+'</div>'
				+ '<pre class="list-text'+typeClass+'">'+msgContent+'</pre></div>';
			//var scrollTop = $('#msgArea-'+msg.groupid).scrollTop();
			
			$('#msgArea-'+msg.groupid+' #msg').append(temp);
			var msgHeight = $('#msgArea-'+msg.groupid)[0].scrollHeight;
			var st = $('#msgArea-'+msg.groupid).scrollTop();
			if(msgHeight - st < 800){
				$('#msgArea-'+msg.groupid).scrollTop(msgHeight);
			}
			
			//判断可见并发送回执消息
			if(msg.groupid == CHATOBJ.groupId){
				var list = receiptMap.get(msg.groupid);
				if(list != undefined && list.length != 0){
					for(var i = 0;i < list.length; i ++){
						var offsetTop = document.getElementById('msg-'+list[i].msgId).offsetTop;
						var scrollTop = $('#msgArea-'+msg.groupid).scrollTop();
						var clientHeight = $('#msgArea-'+msg.groupid).height();
						if(offsetTop >= scrollTop && offsetTop <= scrollTop + clientHeight){
							console.log('回执: ' + list[i].msgId + ' 已经查看');
							mainObject.readedReport(msg.groupid,list[i].msgId,list[i].senderId,list[i].seqId);
							list.splice(i,1);
							i = i - 1;
						}
					}
				}
			}
		}
	}
	
}

/**
 * 播放语音消息
 * @param node
 */
function playSound(node){
	//移除消息未播放过的样式
	$(node).siblings().attr('style','display:none;');

	var msgId = $(node).parent().parent().attr('id').replace('msg-','');
	
	//判断消息状态是否为播放中，如果播放中停止播放
	if($(node).find('.iconn-2').css('display') != 'none'){
		$(node).find('.iconn-2').hide();
		$(node).find('.voice-box').removeClass('hide');
		mainObject.PlayVoiceMsg(CHATOBJ.groupId,msgId);
	}else{
		mainObject.StopVoiceMsg(CHATOBJ.groupId,msgId);
	}
}

//语音播放完成
function soundPlayFinish(groupId,msgId){
	console.log('语音播放完成',groupId,msgId);
	$('#msgArea-'+groupId).find('#msg-'+msgId).find('.iconn-2').show();
	$('#msgArea-'+groupId).find('#msg-'+msgId).find('.voice-box').addClass('hide');
}
	

/**
 * 将图片插入到输入框
 * @param img
 */
function insertPic(img){
	var oldScrollHeight = $('#input-content')[0].scrollHeight;
	var oldScrollTop = $('#input-content').scrollTop();
	for (var i = 0; i < img.length; i++) {
		var html = '<img class="input-img" src="' + img[i].path + '">';
		insertImg(html);
	}
	setTimeout(function(){
		var newScrollHeight = $('#input-content')[0].scrollHeight;
		$('#input-content').scrollTop(newScrollHeight - oldScrollHeight + oldScrollTop);
	},10);
}

/**
 * 将表情插入到输入框
 * @param face
 */
function insertFace(face){
	var html = '<img class="input-face" src="'+$(face).attr('src')+'">';
	insertImg(html);
}

//输入框ctrl+v
function pasteToInput(data){
	//粘贴图片
	if(data.ClipboardType == 2){
		var img = [{
			'path':data.ClipboardInfo
		}];
		$('#input-content').blur();
		insertPic(img);
	}
}

/**
 * 在输入区插入img通用
 * @param html
 */
function insertImg(html){
	var dthis = $("#input-content")[0];
	var sel;
	if (window.getSelection) {
		// IE9 and non-IE
		sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			//range = sel.getRangeAt(0);
			range.deleteContents();
			var el = document.createElement('div');
			el.innerHTML = html;
			var frag = document.createDocumentFragment(), node, lastNode;
			while ((node = el.firstChild)) {
				lastNode = frag.appendChild(node);
			}

			range.insertNode(frag);
			if (lastNode) {
				range = range.cloneRange();
				range.setStartAfter(lastNode);
				range.collapse(true);
				sel.removeAllRanges();
				
				sel.addRange(range);
			}
		}
	} else if (document.selection && document.selection.type != 'Control') {
		$(dthis).focus(); // 在非标准浏览器中 要先让你需要插入html的div 获得焦点
		ierange = document.selection.createRange();// 获取光标位置
		ierange.pasteHTML(html); // 在光标位置插入html 如果只是插入text 则就是fus.text="..."
		$(dthis).focus();
	}
}

/**
 * 发送消息
 */
function sendMsg(){
	clearTimeout(picTip);
	var msgArr = formatMsg();
	var picCount = 0;
	for(var i = 0;i < msgArr.length; i ++){
		if(msgArr[i].msgType == 3){
			picCount += 1;
		}
	}
	if(picCount > 10){
		$('#too-much-pic').show();
		var picTip = setTimeout(function(){
			$('#too-much-pic').hide();
		},2000);
	}else{
		$('#too-much-pic').hide();
		var msgs = [];
		if(msgArr.length != 0){
			//进行消息发送
			var result = '';
			for(var i = 0;i < msgArr.length; i ++ ){
				var tempTime = '';
				if(lastMsgTimeMap.get(CHATOBJ.groupId) == undefined){
					var now = new Date().getTime();
					tempTime = '<div class="list-time">'+formatMsgTime(now)+'</div>';
					lastMsgTimeMap.put(CHATOBJ.groupId,now);
				}else{
					var now = new Date().getTime();
					if(now - lastMsgTimeMap.get(CHATOBJ.groupId) >= 5 * 60 * 1000){
						tempTime = '<div class="list-time">'+formatMsgTime(now)+'</div>';
						lastMsgTimeMap.put(CHATOBJ.groupId,now);
					}else{
						tempTime = '';
					}
				}
				if(msgArr[i].msgType == 1){
					/*<div class="list-right clearfix">
		              <div class="list-name">韵脚</div>
		              <div class="list-text">
		                <p>韵脚韵脚韵脚韵脚韵脚韵脚韵脚韵脚韵脚韵脚韵脚韵脚韵脚韵脚韵脚韵脚韵脚韵脚韵脚韵脚韵脚</p>
		              </div>
		            </div>*/
					var msgId = Math.uuid();
					//status 0---发送成功         1---发送中        2---发送失败
					var temp = tempTime+'<pre id="msg-'+msgId+'" status="1" class="list-right clearfix">'
						+ '<div class="list-name" style="background:'+getNickNameColor(myInfo.myid)+';" oaId="'+myInfo.myid+'">我</div>'
						+ '<div class="list-text"><p>'+msgArr[i].html+'</p>'
						+ '<em class="loading" msgId="'+msgId+'" onclick="resendMsg(this)"><img src="../images/public/loading-ms.gif"></em></div></pre>';
					result += temp;
					var msg = {
						"msgid": msgId, // 类型string
						"msgbody": msgArr[i].msgBody,//类型string
						"msgtype" :1, //类型 int 1:文本 type2:表情 type3:图片
						"groupid": CHATOBJ.groupId, //类型stringa
						"grouptype": CHATOBJ.groupType, //类型int
						"senderid": myInfo.imUserid //类型int
					}
					msgs.push(msg);
				}else if(msgArr[i].msgType == 3){
					var msgId = Math.uuid();
					var temp = tempTime+'<div id="msg-'+msgId+'" status="1" class="list-right clearfix">'
						+ '<div class="list-name" style="background:'+getNickNameColor(myInfo.myid)+';" oaId="'+myInfo.myid+'">我</div>'
						+ '<div class="list-text"><p><img class="pop-image" imgType="2" msgId="'+msgId+'" src="'+msgArr[i].picPath+'" style="max-width:150px;max-height:150px;"'
						+ ' onclick="viewImg(this)"></p>'
						+ '<em class="loading" msgId="'+msgId+'" onclick="resendMsg(this)"><img src="../images/public/loading-ms.gif"></em></div></div>';
					result += temp;
					var msg = {
						"msgid": msgId, // 类型string
						"msgbody": msgArr[i].msgBody,//类型string
						"msgtype" :3, //类型 int 1:文本 type2:表情 type3:图片
						"groupid": CHATOBJ.groupId, //类型string
						"grouptype": CHATOBJ.groupType, //类型int
						"senderid": myInfo.imUserid, //类型int
						"picpath":msgArr[i].picPath//
					}
					msgs.push(msg);
					
				}
			}
			
			$('#msgArea-' + CHATOBJ.groupId + ' #msg').append(result);
			var msgHeight = $('#msgArea-'+CHATOBJ.groupId+' #msg').height();
			var a = document.getElementById('msgArea-'+CHATOBJ.groupId);
			a.scrollTop = msgHeight;
			
			//以最后一条消息为准更新会话列表详情
			var last = msgs[msgs.length - 1];
			if(last.msgtype == 1){
				if(last.grouptype == 1){
					$('#session-'+last.groupid).find('p').find('.session-text').html(codeStr(last.msgbody));
				}else if(last.grouptype == 2){
					$('#session-'+last.groupid).find('p').find('.session-text').html(myInfo.myname+': '+codeStr(last.msgbody));
				}
				$('#session-'+last.groupid).find('.time').html(date_format(new Date().getTime(),'HH:mm'));
				$('#session-'+last.groupid).attr('msgTime',new Date().getTime());
			}else if(last.msgtype == 3){
				if(last.grouptype == 1){
					$('#session-'+last.groupid).find('p').find('.session-text').html('[图片]');
				}else if(last.grouptype == 2){
					$('#session-'+last.groupid).find('p').find('.session-text').html(myInfo.myname+': [图片]');
				}
				$('#session-'+last.groupid).find('.time').html(date_format(new Date().getTime(),'HH:mm'));
				$('#session-'+last.groupid).attr('msgTime',new Date().getTime());
			}
			var isTop = $('#session-'+CHATOBJ.groupId).attr('isTop');
			if(isTop == 0){
				if(topNum == 0){
					$('#session').children().first().before($('#session-'+CHATOBJ.groupId));
				}else{
					$('#session').children().eq(topNum - 1).after($('#session-'+CHATOBJ.groupId));
				}
			}
			//显示发送中的状态
			$('#session-'+last.groupid).attr('msgId',last.msgid);
			$('#session-'+last.groupid).find('p').find('em').removeClass('iconn-34').addClass('iconn-35').show();

			mainObject.sendMessageList(msgs);
			
			for(var i = 0; i < msgs.length; i ++){
				var msgId = msgs[i].msgid;
				
				function sendFailed(_msgId_,_msg_){
					if($('#msg-' + _msgId_).attr('status') == 1){
						$('#msg-' + _msgId_).attr('status','2');
						$('#msg-' + _msgId_).find('em').html('').removeClass('loading')
						.addClass('iconn-34');
						if($('#session-'+_msg_.groupid).attr('msgId') == _msgId_){
							$('#session-'+_msg_.groupid).find('p').find('em').removeClass('iconn-35').addClass('iconn-34').show();
						}
						resendMsgMap.put(_msgId_,_msg_);
						console.log(_msgId_);
					}
				}
				function sendFailed_(msgId_,msg_){
					return function(){
						sendFailed(msgId_,msg_);
					}
				}
				timer[msgId] = setTimeout(sendFailed_(msgId,msgs[i]),1000 * 60);
				console.log(timer);
			}
			draftMap.remove(CHATOBJ.groupId);
			$('#input-content').html('').focus();
			var msgHeight = $('#msgArea-'+CHATOBJ.groupId+' #msg').height();
			//$('#msgArea-'+CHATOBJ.groupId).scrollTop(msgHeight);
		}else{
			$('#input-content').html('').focus();
		}
	}
}

/**
 * 重发消息
 * @param msgId
 */
function resendMsg(msg){
	if($(msg).hasClass('iconn-34')){
		
		var msgId = $(msg).attr('msgId');
		$('#msg-' + msgId).attr('status','1');
		$('#msg-' + msgId).find('em').html('<img src="../images/public/loading-ms.gif">')
			.removeClass('iconn-34').addClass('loading');
		var msg = resendMsgMap.get(msgId);
		if($('#session-'+msg.groupid).attr('msgId') == msg.msgid){
			$('#session-'+msg.groupid).find('p').find('em').removeClass('iconn-34').addClass('iconn-35').show();
		}
		var msgList = [];
		msgList.push(msg);
		mainObject.sendMessageList(msgList);
		resendMsgMap.remove(msgId);
		
		function sendFailed(_msgId_,_msg_){
			if($('#msg-' + _msgId_).attr('status') == 1){
				$('#msg-' + _msgId_).attr('status','2');
				$('#msg-' + _msgId_).find('em').html('').removeClass('loading')
				.addClass('iconn-34');
				if($('#session-'+_msg_.groupid).attr('msgId') == _msgId_){
					$('#session-'+_msg_.groupid).find('p').find('em').removeClass('iconn-35').addClass('iconn-34').show();
				}
				resendMsgMap.put(_msgId_,_msg_);
			}
		}
		function sendFailed_(msgId_,msg_){
			return function(){
				sendFailed(msgId_,msg_);
			}
		}
		timer[msgId] = setTimeout(sendFailed_(msgId,msg),1000 * 60);
	}
}

/**
 * 消息回包
 * @param msg
 */
function ackMsg(msg){
	window.clearTimeout(timer[msg.msgid]);
	console.log('消息回包',msg);
	
	if($('#msg-' + msg.msgid).attr('status') == 1){
		$('#msg-' + msg.msgid).attr('status',0);
		$('#msg-' + msg.msgid).find('em').html('').removeClass('loading')
		.removeClass('iconn-34');
		
		//更改会话列表的发送中和发送失败的icon
		if($('#session-'+msg.groupid).attr('msgId') == msg.msgid){
			$('#session-'+msg.groupid).find('p').find('em').hide();
		}
	}
	if(msg.msgType == 3){
		$('#msgArea-' + msg.groupid + ' #msg #' + msg.msgid + 
				' img[msgId="'+msg.msgid+'"]').attr('fileName',msg.SerFileName)
				.attr('fileExt',msg.fileExt).attr('imgType',1);
	}
	
}

/**
 * 格式化输入区消息
 * @returns {Array}
 */
function formatMsg(){
	var msgArr = new Array();
	
	//判断是否为空消息
	var html_ = replaceAll($('#input-content').html(),'<br>','').trim();
	if(html_ == ''){
		return [];
	}
	
	var html = replaceAll($('#input-content').html(),'<br>','\n');
	var temp = html.replace(/(<img class="input-img".*?>)/g, function(s, $1, index) {
	    //选用(<>)作为分割符是因为获取到的html中所包含的(<>)均不可能是用户输入的，因为<>会被转义
	    return '(<>)'+$1 + '(<>)'
	});
	var htmlArr = temp.split('(<>)');
	for(var i = 0; i < htmlArr.length; i ++){
		if(htmlArr[i] == ''){
			//split在元素首尾分割产生的空元素
			continue;
		}
		//图片<img class="input_img" src="'+data.filepath+'">
		if(htmlArr[i].indexOf('<img class="input-img"') != -1){
			var msg = {
				'html':htmlArr[i],
				'msgType':3,
				'picPath':decodeStr(htmlArr[i].replace('<img class="input-img" src="','').replace('">','')),
				'msgBody':'你收到一张图片',
				'draft':'[图片]'
			}
			msgArr.push(msg);
		}else{
			//文本加表情<img class="input_face" src="images/default_face/'+$(node).attr('face_name')+'@2x.png">
			if(htmlArr[i].indexOf('<img class="input-face"') != -1){
				var msg = {
					'html':htmlArr[i],
					'msgType':1
				}
				var msgBody_ = '';
				var temp_ = htmlArr[i].replace(/(<img class="input-face".*?>)/g, function(s, $1, index) {
				    //选用(<>)作为分割符是因为获取到的html中所包含的(<>)均不可能是用户输入的，因为<>会被转义
				    return '(<>)'+$1 + '(<>)'
				});
				var faceArr = temp_.split('(<>)');
				for(var j = 0; j < faceArr.length; j++){
					if(faceArr[j] == ''){
						continue;
					}
					if(faceArr[j].indexOf('<img') != -1){
						msgBody_ += '[' + faceArr[j].replace('<img class="input-face" src="../images/face/','').replace('.gif">','') + ']';
					}else{
						msgBody_ += faceArr[j];
					}
				}
				msg.msgBody = decodeStr(msgBody_);
				msg.draft = msgBody_;
				msgArr.push(msg);
			}else{
				var html_ = htmlArr[i].replace(/(((ht|f)tps?):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?/,function(s, $1, index){
					if(s.indexOf('http://') != -1 || s.indexOf('https://') != -1){
						return '<a class="url-link" onclick="publicObject.openUrl(0,\''+s+'\')">' + s + '</a>';
					}else{
						return '<a class="url-link" onclick="publicObject.openUrl(0,\'http://'+s+'\')">' + s + '</a>';
					}
				});
				var msg = {
					'html':html_,
					'msgType':1,
					'msgBody':decodeStr(htmlArr[i]),
					'draft':decodeStr(htmlArr[i])
				}
				msgArr.push(msg);
			}
		}
	}
	console.log('切分后的消息内容：',msgArr);
	return msgArr;
}

/**
 * 发起新会话
 * @param data
 */
function newConversation(data,flag){
	console.log('发起会话',data);
	$('#session-no-record').hide();
	var groupId;
	var avatar;
	var groupName = '';
	if(data.groupType == 1){
		if(data.imid > myInfo.imUserid){
			groupId = myInfo.imUserid + "_" + data.imid;
		}else if(data.imid < myInfo.imUserid){
			groupId = data.imid + "_" + myInfo.imUserid;
		}else{
			groupId = data.imid + "_" + myInfo.imUserid;
		}
		avatar = '<div class="list-name" style="background:'+getNickNameColor(data.id)+';">'
			+ getNickName(data.staffName)
			+ '</div>';
		groupName = data.staffName;
	}else if(data.groupType = 2){
		groupId = data.groupId;
		avatar = '<div class="list-name" style="background:'
			+ getNickNameColor(Math.abs(hashCode(groupId))) +';"><em class="iconn-46"></em></div>';
		groupName = data.groupName;
	}
	
	var session = $('#session-' + groupId);
	//不存在当前会话
	if(session.length == 0){
		publicObject.getSessionInfo(groupId,function(info){
			if(info.sessionTop == 1){
				var temp = '<li id="session-'+groupId+'" onclick="openSession(this)" onmousedown="showMenu(this)"'
					+ ' number="0" toptime="'+info.sessionTopTime+'" isTop="1">'
					+ '<span class="top"></span><span class="num" style="display:none;">0</span>'+avatar+'<div class="list-text">'
					+ '<h2><span class="session-name">'+codeStr(groupName)+'</span><span class="time"></span></h2>'
					+ '<p><em class="iconn-35" style="display:none;"></em><span class="red" style="display:none;">[草稿]</span>'
					+ '<span class="session-text"></span></p></div></li>';
				if(topNum == 0){
					$('#session').prepend(temp);
				}else{
					var children = $('#session').children();
					for(var i = 0; i < children.length; i ++){
						var topTime = parseInt($(children[i]).attr('topTime'));
						if(info.sessionTopTime > topTime){
							$(children[i]).before(temp);
							break;
						}
					}
				}
				topNum += 1;
			}else if(info.sessionTop == 0){
				var temp = '<li id="session-'+groupId+'" onclick="openSession(this)" onmousedown="showMenu(this)"'
					+ ' number="0" isTop="0">'
					+ '<span class="num" style="display:none;">0</span>'+avatar+'<div class="list-text">'
					+ '<h2><span class="session-name">'+codeStr(groupName)+'</span><span class="time"></span></h2>'
					+ '<p><em class="iconn-35" style="display:none;"></em><span class="red" style="display:none;">[草稿]</span>'
					+ '<span class="session-text"></span></p></div></li>';
				if(topNum == 0){
					$('#session').prepend(temp);
				}else{
					$('#session').children().eq(topNum - 1).after(temp);
				}
			}
			data.GroupId = groupId;
			data.GroupType = data.groupType;
			data.MsgSendName = data.staffName;
			data.GroupName = data.groupName;
			data.SessionTopmark = info.sessionTop;
			data.oaId = data.id;
			$('#session-'+groupId).data(data);
			if(flag){
				$('#im-chat').click();
				$('#session-'+groupId).click();
			}
		});
	}else{
		if(flag){
			$('#im-chat').click();
			$('#session-'+groupId).click();
		}
	}
	
}

/**
 * 预览图片
 * @param img
 */
function viewImg(img){
	//imgtype 1-历史或接受或已发送成功       2-发送未成功
	var imgType = $(img).attr('imgType');
	var imgObj;
	if(imgType == 1){
		imgObj = {
			'groupId':CHATOBJ.groupId,
			'msgId':$(img).attr('msgId'),
			'serFileName':$(img).attr('fileName'),
			'fileExt':$(img).attr('fileExt')
		}
	}else{
		imgObj = {
			'groupId':CHATOBJ.groupId,
			'msgId':$(img).attr('msgId'),
			'sendPicPath':$(img).attr('src')
		}
	}
	mainObject.StartViewPic(imgObj);
}

function initOfflineMsgNum(number){
	console.log(number);
}

/**
 * 被邀请加入群
 * @param msg
 */
function beInvitedIntoGroup(msg){
	console.log('被邀请加入群',msg);
	publicObject.getSessionInfo(msg.groupId,function(info){
		var group = {
			'groupId':msg.groupId,
			'groupName':info.groupName,
			'groupType':2
		}
		newConversation(group,false);
		var color = getNickNameColor(Math.abs(hashCode(msg.groupId)));
		var temp = '<li id="group-'+msg.groupId+'" onclick="showGroupDetail(this)"><a href="javascript:;">'
			+ '<div class="im-name" style="background:'+color+';">'
			+ '<span class="iconn-46"></span></div>'
			+ '<p>'+codeStr(info.groupName)+'</p></a></li>';
		$('#myGroup-content').append(temp);
		$('#group-' + msg.groupId).data(group);
		$('#myGroup').find('.num').html($('#myGroup-content').children().length);
	});
}

/**
 * 解散群通知
 * @param msg
 */
function disbandGroup(msg){
	console.log('解散群通知',msg);
	var groupId = msg.groupId;
	//删除会话
	/*if($('#session-'+groupId).length != 0){
		$('#session').children().remove('#session-'+groupId);
	}*/
	//删除消息区
	/*if($('#msgArea-'+groupId).length != 0){
		$('#msgArea').children().remove('#msgArea-'+groupId);
	}*/
	//删除我的群组
	if($('#group-'+groupId).length != 0){
		$('#myGroup-content').children().remove('#group-'+groupId);
	}
	/*if(groupId = CHATOBJ.groupId){
		$('#msg-no-record').show();
		$('#chatArea').hide();
	}*/
	if(groupDetailObj != undefined && groupId == groupDetailObj.groupId){
		$('#members-no-record').siblings().hide();
		$('#members-no-record').show();
	}
	$('#myGroup').find('.num').html($('#myGroup-content').children().length);
}

/**
 * 退出群或踢出群
 * @param msg
 */
function quitOrKickoutGroup(msg){
	console.log('退出或者踢出群',msg);
	//用户被踢出群
	if(msg.quitType == 1){
		publicObject.getGroupInfo(msg.groupId,function(groupInfo){
			console.log(groupInfo);
			$('#session-'+msg.groupId).find('.session-name').html(codeStr(groupInfo.groupName));
			var data_ = $('#session-'+msg.groupId).data();
			data_.GroupName = groupInfo.groupName;
			var data = $('#session-'+msg.groupId).data(data_);
			if(CHATOBJ != undefined && CHATOBJ.groupId == msg.groupId){
				$('#chat-title').html(codeStr(groupInfo.groupName));
				CHATOBJ.groupName = groupInfo.groupName;
			}
			var ids = msg.kickedUids.split(',');
			if(ids.indexOf('' + myInfo.imUserid) != -1){
				if($('#group-'+msg.groupId).length != 0){
					$('#myGroup-content').children().remove('#group-'+msg.groupId);
					$('#myGroup').find('.num').html($('#myGroup-content').children().length);
				}
				if(groupDetailObj != undefined && msg.groupId == groupDetailObj.groupId){
					$('#members-no-record').siblings().hide();
					$('#members-no-record').show();
				}
			}else{
				if($('#group-'+msg.groupId).length != 0){
					$('#group-'+msg.groupId).find('p').html(codeStr(groupInfo.groupName));
				}
				if(groupDetailObj != undefined && msg.groupId == groupDetailObj.groupId){
					$('#group-detail-title').find('p').html(codeStr(groupInfo.groupName) + '(' + JSON.parse(msg.extra).size + '人)');
					$('#group-detail-info #group-name').html(codeStr(groupInfo.groupName));
					for(var i = 0; i < ids.length; i ++){
						$('#group-detail-members').find('ul').children().remove('#groupMember-'+ids[i]);
					}
				}
			}
		});
	}
	//用户主动退出群
	if(msg.quitType == 2){
		publicObject.getGroupInfo(msg.groupId,function(groupInfo){
			console.log(groupInfo);
			$('#session-'+msg.groupId).find('.session-name').html(codeStr(groupInfo.groupName));
			var data_ = $('#session-'+msg.groupId).data();
			data_.GroupName = groupInfo.groupName;
			var data = $('#session-'+msg.groupId).data(data_);
			if(CHATOBJ != undefined && CHATOBJ.groupId == msg.groupId){
				$('#chat-title').html(codeStr(groupInfo.groupName));
				CHATOBJ.groupName = groupInfo.groupName;
			}
			if(msg.fromUid == myInfo.imUserid){
				if($('#group-'+msg.groupId).length != 0){
					$('#myGroup-content').children().remove('#group-'+msg.groupId);
					$('#myGroup').find('.num').html($('#myGroup-content').children().length);
				}
				if(groupDetailObj != undefined && msg.groupId == groupDetailObj.groupId){
					$('#members-no-record').siblings().hide();
					$('#members-no-record').show();
				}
			}else{
				if($('#group-'+msg.groupId).length != 0){
					$('#group-'+msg.groupId).find('p').html(codeStr(groupInfo.groupName));
				}
				if(groupDetailObj != undefined && msg.groupId == groupDetailObj.groupId){
					$('#group-detail-title').find('p').html(codeStr(groupInfo.groupName) + '(' + JSON.parse(msg.extra).size + '人)');
					$('#group-detail-info #group-name').html(codeStr(groupInfo.groupName));
					$('#group-detail-members').find('ul').children().remove('#groupMember-'+msg.fromUid);
				}
			}
		});
	}
}

/**
 * 修改群信息
 * @param msg
 */
function editGroupInfoNotify(msg){
	console.log('修改群信息通知',msg);
	if($('#session-'+msg.groupId).length != 0){
		if(JSON.parse(msg.extra).groupName != undefined){
			$('#session-'+msg.groupId).find('.session-name').html(codeStr(JSON.parse(msg.extra).groupName));
			var data = $('#session-'+msg.groupId).data();
			data.GroupName = JSON.parse(msg.extra).groupName;
			$('#session-'+msg.groupId).data(data);
			if(CHATOBJ != undefined && CHATOBJ.groupId == msg.groupId){
				CHATOBJ.groupName = JSON.parse(msg.extra).groupName;
			}
		}
	}
	if(CHATOBJ != undefined && msg.groupId == CHATOBJ.groupId){
		if(JSON.parse(msg.extra).groupName != undefined){
			$('#chat-title').html(codeStr(JSON.parse(msg.extra).groupName));
		}
	}
	if($('#group-'+msg.groupId).length != 0){
		if(JSON.parse(msg.extra).groupName != undefined){
			$('#group-'+msg.groupId).find('p').html(codeStr(JSON.parse(msg.extra).groupName));
			var data = $('#group-'+msg.groupId).data();
			data.groupName = JSON.parse(msg.extra).groupName;
			$('#group-'+msg.groupId).data(data);
		}
	}
	if(groupDetailObj != undefined && msg.groupId == groupDetailObj.groupId){
		if(JSON.parse(msg.extra).groupName != undefined){
			var total = $('#group-detail-members').find('ul').children().length;
			$('#group-detail-title').find('p').html(codeStr(JSON.parse(msg.extra).groupName) + '(' + total + '人)');
			$('#group-detail-info #group-name').html(codeStr(JSON.parse(msg.extra).groupName));
		}
	}
}


/**
 * 初始化表情包
 */
function initEmoji(){
	for(var i = 0; i < faces.length; i ++){
		var temp = '<li><img src="../images/face/'+faces[i]+'.gif" onclick="insertFace(this)"></li>';
		$('#faces').append(temp);
	}
}

function openChat(){
	$('#im-chat').click();
	var children = $('#session').children();
	for(var i = 0; i < children.length; i ++){
		var num = $(children[i]).attr('number');
		if(num != 0){
			$(children[i]).click();
			break;
		}
	}
}