/**
 * Created by shangkuikui on 2017/6/6.
 */
(function () {
    /**
     * 处理当前dom的对象
     * @type {{}}
     */
    let currentOperateObj = {};
    /**
     * 操作规则
     *
     * @type {{isSending: isSending, isMe: isMe, isSendSucess: isSendSucess, isDownloaded: isDownloaded, isUse: isUse}}
     */
    const OperateRules = {
        isSending: function (tar, operate) {//这一条规则不需要了
            return operate
        },
        isMe: function (tar, operate) {
            if (parseInt($(tar).attr('data-senderid')) === parseInt(myInfo.imUserid) || parseInt($(tar).attr('senderImId')) === parseInt(myInfo.imUserid)) {
                return operate
            } else {
                return false
            }
        },
        isSendFinish: function (tar, operate) {
            if ($(tar).attr('data-status') == 1 || $(tar).attr('status') == 2) {
                return operate
            } else {
                return false
            }
        },
        isLessTenMinus: function (tar, operate) {
            let tenMinus = 600000;
            if (Math.abs(parseInt($(tar).attr('data-sendtime')) - new Date().getTime()) < tenMinus) {
                return operate
            } else {
                return false
            }
        },
        isDownloaded: function (tar, operate) {
            if ($(tar).find('.icon-wrapper').attr('data-state') == 'finish' || $(tar).attr('status') == 2) {
                return operate
            } else {
                return false
            }
        },
        isUse: function (tar, operate) {
            let path = $(tar).find('.icon-wrapper').attr('data-file-path') || $(tar).attr('fpath');
            if (path) {
                return new Promise(resolve => {
                    qFileTransferObj.getFileActiveStates(path, function (data) {
                        //0 ok  -1  被占用  -2 不存在
                        data === 0 ? resolve(operate) : resolve(false);
                    })
                })
            } else {
                return false
            }

        },
        isFileChanged: function (tar, operate) {
            return new Promise(function (resolve, reject) {
                let msgId = $(currentOperateObj.currentDom).parent().attr('id') ? $(currentOperateObj.currentDom).parent().attr('id').replace('msg-', '') : $(currentOperateObj.currentDom).siblings('a.status-todo').attr('msgid');
                qFileTransferObj.isFileChanged(msgId, function (obj) {
                    if (obj.IsChanged) {
                        currentOperateObj.fSize = obj.fSize //文件大小
                        currentOperateObj.sendTime = obj.ModifyTime
                        resolve(operate)
                    }
                });
            })
        },
        isNotExpire: function (tar, operate) {
            let state = $(tar).find('.icon-wrapper').attr('data-state') || $(tar).attr('status')
            if (state == 'expire' || state == 3) {
                return false
            } else {
                return operate
            }
        },
        supportPreview: function (tar, operate) {
            let path = $(tar).find('.icon-wrapper').attr('data-file-path') || $(tar).attr('fpath');
            let fileType = getFileType(path);
            let arr = ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'txt', 'ppt', 'pptx'];
            if (true) {
                return operate
            } else {
                return false
            }
        }
    };
    const AbleRules = {
        isExist: function (tar, operate) {
            let path = $(tar).find('.icon-wrapper').attr('data-file-path') || $(tar).attr('fpath');
            return new Promise(function (resolve, reject) {
                qFileTransferObj.isFileExist(path, function (flag) {
                    console.log(flag);
                    operate['able'] = flag
                    resolve(operate);
                })
            })

        }
    }
    /**
     * 文件操作对象
     * @type {{copy: {fn: fn, rules: rules}, delete: {fn: fn, rules: rules}}}
     */
    const fileMsgOperate = {
        name: '文件操作对象',
        msgTypes: [6],
        currentType: '',
        fSize: 0,
        sendTime: '',
        currentDom: {},
        operates: [
            {
                copy: {
                    name: '复制',
                    able: true,
                    fn: () => {
                        filesListOpen = false;
                        let path = $(currentOperateObj.currentDom).find('.icon-wrapper').attr('data-file-path') || $(currentOperateObj.currentDom).attr('fpath');
                        console.log(path)
                        mainObject.setClipboardInfo(path);
                        console.log(fileMsgOperate.currentDom);
                        setTimeout(function () {
                            filesListOpen = true
                        },300)
                    },
                    rules: function (tar, operate) {
                        return OperateRules.isNotExpire(tar, operate) && OperateRules.isDownloaded(tar, operate)
                        ||  OperateRules.isMe(tar, operate) && OperateRules.isNotExpire(tar, operate)
                    },
                    ableRules: function (tar, operate) {
                        operate['able'] = true
                        return operate;
                    }
                }
            },
            {
                revoke: {
                    name: '撤回',
                    able: true,
                    fn: () => {
                        filesListOpen = false;
                        commonRevoke()
                    },
                    rules: function (tar, operate) {
                        return OperateRules.isLessTenMinus(tar, operate)
                            && OperateRules.isSendFinish(tar, operate)
                            && OperateRules.isMe(tar, operate)
                    },
                    ableRules: function (tar, operate) {
                        operate['able'] = true
                        return operate;
                    }
                }
            },
            {
                saveAs: {
                    name: '另存为',
                    able: true,
                    fn: () => {
                        //打开窗口  触发下载
                        let msgId = $(currentOperateObj.currentDom).find('.icon-wrapper').attr('data-icon-wrapper-id') || $(currentOperateObj.currentDom).siblings('a.status-todo').attr('msgid');
                        qFileTransferObj.saveFileToLocal(CHATOBJ.groupId, msgId);

                    },
                    rules: function (tar, operate) {
                        if (!OperateRules.isDownloaded(tar, operate) && !OperateRules.isMe(tar, operate) && OperateRules.isNotExpire(tar, operate)) {
                            return operate
                        } else {
                            return false
                        }
                    },
                    ableRules: function (tar, operate) {
                        operate['able'] = true
                        return operate;
                    }
                }
            },
            {
                sendReturn: {
                    name: '回发',
                    able: true,
                    fn: function () {
                        //回发  ,修改后文件大小改变，
                        let groupname = CHATOBJ.groupName;
                        if(groupname.length>13){
                            groupname = groupname.substring(0,13)+'...'
                        }
                        $('.fileSendReturn .title').html(`确认向"${groupname}"回发此文件?`);

                        let filename = $(currentOperateObj.currentDom).find('.icon-wrapper').attr('data-file-name') || $(currentOperateObj.currentDom).attr('fileName');
                        $('.fileSendReturn .filename').html(filename);

                        let localtion = $(currentOperateObj.currentDom).find('.icon-wrapper').attr('data-file-path') || $(currentOperateObj.currentDom).attr('fpath');
                        $('.fileSendReturn .localtion').html(`位置: ${localtion}`);

                        //修改时间
                        let time_ = currentOperateObj.sendTime*1000
                        let time = date_format(time_, 'yyyy-MM-dd HH:mm:ss');

                        $('.fileSendReturn .time').html(`修改时间: ${time}`);
                        //修改图片
                        let fileType = getFileType(filename);
                        let imgSrc = getFileThumbnailSrc(fileType);
                        let src = "../images/file/" + imgSrc + "56@2x.png";
                        $('.fileSendReturn .pic')[0].src = src;

                        $('.fileSendReturn').addClass('animateshow');


                    },
                    rules: function (tar, operate) {
                        return OperateRules.isDownloaded(tar, operate)
                            && !OperateRules.isMe(tar, operate)
                            && OperateRules.supportPreview(tar, operate)
                            && OperateRules.isFileChanged(tar, operate)
                            && AbleRules.isExist(tar, operate)
                    },
                    ableRules: function (tar, operate) {
                        operate['able'] = true
                        return operate;
                    }
                }
            },


            {
                showInFloder: {
                    name: '在文件夹中显示',
                    able: true,
                    fn: () => {
                        let path = $(currentOperateObj.currentDom).find('.icon-wrapper').attr('data-file-path') || $(currentOperateObj.currentDom).attr('fpath');
                        let msgId = $(currentOperateObj.currentDom).find('.icon-wrapper').attr('data-icon-wrapper-id') || $(currentOperateObj.currentDom).siblings('a.status-todo').attr('msgid');
                        qFileTransferObj.openDirOfFile(path);
                        //打开窗口
                        //console.log(fileMsgOperate.currentDom)
                    },
                    rules: function (tar, operate) {
                        return OperateRules.isDownloaded(tar, operate)
                            || OperateRules.isMe(tar, operate)
                    },
                    ableRules: function (tar, operate) {
                        //operate['able'] = true
                        return AbleRules.isExist(tar, operate);
                    }
                }
            },
            {
                delete: {
                    name: '删除',
                    able: true,
                    fn: function () {
                        filesListOpen = false;
                        commonDelete();
                    },
                    rules: function (tar, operate) {
                        if(OperateRules.isUse(tar, operate) || (!OperateRules.isNotExpire(tar, operate) && !OperateRules.isDownloaded(tar, operate))){
                            return operate
                        }else{
                            return false
                        }

                    },
                    ableRules: function (tar, operate) {
                        operate['able'] = true
                        return operate;
                    }
                }
            }
        ],
    };
    /**
     * 一般操作对象
     * @type {{copy: {fn: fn, rules: rules}, delete: {fn: fn, rules: rules}}}
     */
    const generalMsgOperate = {
        name: '一般操作对象',
        currentType: '',
        currentDom: {},
        msgTypes: [1, 100001, 100002, 100003],
        operates: [
            {
                copy: {
                    //复制操作做特殊处理，区分 普通文字和 图片
                    name: '复制',
                    able: true,
                    fn: () => {

                        console.log('普通消息复制')
                        // let selectedTxt = isSelected();
                        // if(selectedTxt){
                        //     document.execCommand("Copy", "false", null);
                        //     return;
                        // }
                        //_documentSelectElement(currentOperateObj.currentDom);
                        document.execCommand("Copy", "false", null);
                        _showToast({ReturnMsg: '已复制'});
                        _removeSelectElement()

                    },
                    rules: function (tar, operate) {
                        return operate
                    },
                    ableRules: function (tar, operate) {
                        operate['able'] = true
                        return operate;
                    }
                }
            },
            {
                revoke: {
                    name: '撤回',
                    able: true,
                    fn: () => {
                        commonRevoke();
                    },
                    rules: function (tar, operate) {
                        return OperateRules.isLessTenMinus(tar, operate)
                            && OperateRules.isSendFinish(tar, operate)
                            && OperateRules.isMe(tar, operate)
                    },
                    ableRules: function (tar, operate) {
                        operate['able'] = true
                        return operate;
                    }
                }
            },
            {
                delete: {
                    name: '删除',
                    able: true,
                    fn: function () {
                        commonDelete();
                    },
                    rules: function (tar, operate) {
                        return operate
                    },
                    ableRules: function (tar, operate) {
                        operate['able'] = true
                        return operate;
                    }
                }
            }
        ]
    };
    /**
     * 图片操作对象
     * @type {{copy: {fn: fn, rules: rules}, delete: {fn: fn, rules: rules}}}
     */
    const picMsgOperate = {
        name: '图片操作对象',
        currentType: '',
        currentDom: {},
        msgTypes: [3],
        operates: [
            {
                copy: {
                    //复制操作做特殊处理，区分 普通文字和 图片
                    name: '复制',
                    able: true,
                    fn: () => {
                        console.log('图片消息复制', '等待接口');

                        let path = $(currentOperateObj.currentDom).find('.pop-image').attr('src');
                        console.log(path)
                        mainObject.setClipboardInfo(path);

                    },
                    rules: function (tar, operate) {
                        return operate
                    },
                    ableRules: function (tar, operate) {
                        operate['able'] = true
                        return operate;
                    }
                }
            },
            {
                revoke: {
                    name: '撤回',
                    able: true,
                    fn: () => {
                        commonRevoke();
                    },
                    rules: function (tar, operate) {
                        return OperateRules.isLessTenMinus(tar, operate)
                            && OperateRules.isSendFinish(tar, operate)
                            && OperateRules.isMe(tar, operate)
                    },
                    ableRules: function (tar, operate) {
                        operate['able'] = true
                        return operate;
                    }
                }
            },
            {
                saveAs: {
                    name: '另存为',
                    able: true,
                    fn: () => {
                        let src = $(currentOperateObj.currentDom).find('img').attr('src')
                        //qFileTransferObj.saveFileToLocal(CHATOBJ.groupId, msgId);
                        //console.log('pic另存为:', src)
                       //let msgId =  $(currentOperateObj.currentDom).parent().attr('id').replace('msg-', '');
                        qFileTransferObj.saveImageToLocal(src);

                    },
                    rules: function (tar, operate) {
                        return operate
                    },
                    ableRules: function (tar, operate) {
                        operate['able'] = true
                        return operate;
                    }
                }
            },
            {
                delete: {
                    name: '删除',
                    able: true,
                    fn: function () {
                        commonDelete();
                    },
                    rules: function (tar, operate) {
                        return operate
                    },
                    ableRules: function (tar, operate) {
                        operate['able'] = true
                        return operate;
                    }
                }
            }

        ]
    };
    /**
     * 语音和位置操作对象
     * @type {{copy: {fn: fn, rules: rules}, delete: {fn: fn, rules: rules}}}
     */
    const voiceAndLocationMsgOperate = {
        name: '语音和位置操作对象',
        msgTypes: [2, 5],
        currentType: '',
        currentDom: {},
        operates: [
            {
                revoke: {
                    name: '撤回',
                    able: true,
                    fn: () => {
                        commonRevoke();
                    },
                    rules: function (tar, operate) {
                        return OperateRules.isLessTenMinus(tar, operate)
                            && OperateRules.isSendFinish(tar, operate)
                            && OperateRules.isMe(tar, operate)
                    },
                    ableRules: function (tar, operate) {
                        operate['able'] = true
                        return operate;
                    }
                }
            },
            {
                delete: {
                    name: '删除',
                    able: true,
                    fn: function () {
                        commonDelete();
                    },
                    rules: function (tar, operate) {
                        return operate
                    },
                    ableRules: function (tar, operate) {
                        operate['able'] = true
                        return operate;
                    }
                }
            }
        ]
    };
    function showRightMenu(tar, e) {
        const type = parseInt($(tar).attr('data-msgtype'));
        if (fileMsgOperate.msgTypes.includes(type)) {
            currentOperateObj = fileMsgOperate;
        }
        else if (voiceAndLocationMsgOperate.msgTypes.includes(type)) {
            currentOperateObj = voiceAndLocationMsgOperate;
        }
        else if (generalMsgOperate.msgTypes.includes(type)) {
            currentOperateObj = generalMsgOperate;
            _documentSelectElement(tar);
        }
        else if (picMsgOperate.msgTypes.includes(type)) {
            currentOperateObj = picMsgOperate;
        }
        else {
            throw new Error('文件类型不存在:' + type);
        }
        currentOperateObj.currentType = type;
        currentOperateObj.currentDom = tar;
        getRightMenu(currentOperateObj, tar, e);
    }
    /**-------------------------------一些工具类和公用方法----------------------------------**/
    /**
     * 公用方法：消息删除
     */
    function commonDelete() {
        //如果当前节点前一个兄弟和后一个兄弟节点都是时间线， 或者 前一个是时间线，后一个是空，也就是最后一条消息 时候，
        console.log($(currentOperateObj.currentDom).parent().hasClass('status-icon'))
        if (!$(currentOperateObj.currentDom).parent().hasClass('status-icon')) {

            let msgId;
            let $msgDom;
            let isGeneralMsg = $(currentOperateObj.currentDom).parent().attr('id');
            let isSendedAcknowledgeMsg = $(currentOperateObj.currentDom).parent().parent().attr('id');
            let isSessionAcknowledgeMsg = $(currentOperateObj.currentDom).parent().parent().parent().attr('id');
            if(isGeneralMsg){
                msgId = isGeneralMsg.replace('msg-', '')
                $msgDom= $(currentOperateObj.currentDom).parent()
            }else if(isSendedAcknowledgeMsg){
                msgId = isSendedAcknowledgeMsg.replace('msg-', '')
                $msgDom= $(currentOperateObj.currentDom).parent().parent()
            }else if(isSessionAcknowledgeMsg){
                msgId = isSessionAcknowledgeMsg.replace('msg-', '')
                $msgDom= $(currentOperateObj.currentDom).parent().parent().parent()
            }

            if (_preAndNextDomIsTimeLine($msgDom) || _preDomIsTimeLineAndNextDomIsNull($msgDom)) {
                let $prev = $msgDom.prev();
                $prev.remove();
            }
            $msgDom.remove();


            mainObject.deleteMsg(CHATOBJ.groupId, msgId, function (a) {
                console.log('消息删除:', a);
            });

            //console.log('消息删除', '等待接口');
        } else {
            let msgId = $(currentOperateObj.currentDom).siblings('a.status-todo').attr('msgid');
            mainObject.deleteMsg(CHATOBJ.groupId, msgId, function (a) {
                console.log('消息删除:', a);
            });
            $(currentOperateObj.currentDom).parent().parent().remove()
            setTimeout(function () {
                filesListOpen = true
            },300)
            //删除消息框的消息
            let $msgdom = $('msg-' + msgId);
            if (!$msgdom[0]) {
                return
            }
            if (_preAndNextDomIsTimeLine($msgdom) || _preDomIsTimeLineAndNextDomIsNull($msgdom)) {
                let $prev = $msgdom.prev();
                $prev.remove();
            }
            $msgdom.remove();

        }
    }

    function commonRevoke() {
        let msgId = $(currentOperateObj.currentDom).parent().attr('id') ? $(currentOperateObj.currentDom).parent().attr('id').replace('msg-', '') : $(currentOperateObj.currentDom).siblings('a.status-todo').attr('msgid');
        mainObject.revokeMsg(CHATOBJ.groupId, msgId);
        if($(currentOperateObj.currentDom).parent().hasClass('status-icon')){
            $(currentOperateObj.currentDom).parent().parent().remove()
        }
        console.log('触发消息撤回');
        setTimeout(function () {
            filesListOpen = true
        },300)
    }

    function _preAndNextDomIsTimeLine(tar) {
        let $prev = $(currentOperateObj.currentDom).parent().prev();
        let $next = $(currentOperateObj.currentDom).parent().next();
        if (tar) {
            $prev = tar.prev();
            $next = tar.next();
        }
        return $prev.attr('class') == $next.attr('class') && $next.attr('class') == 'list-time'
    }

    function _preDomIsTimeLineAndNextDomIsNull(tar) {
        let $prev = $(currentOperateObj.currentDom).parent().prev();
        let $next = $(currentOperateObj.currentDom).parent().next();
        if (tar) {
            $prev = tar.prev();
            $next = tar.next();
        }
        return $prev.attr('class') == 'list-time' && !$next.attr('class')
    }

    function _documentSelectElement(element) {
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNode(element);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function _removeSelectElement() {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }

    function getRightMenu(currentOperateObj, tar, e) {
        let passedRet = currentOperateObj.operates.filter(operate => {
            Object.keys(operate).forEach(key => {
                return new Promise((resolve, reject) => {
                    resolve(operate[key].rules(tar, operate[key]))
                }).then(OperateRules => {
                        if (OperateRules) {
                            return new Promise((resolve, reject) => {
                                resolve(OperateRules.ableRules(tar, OperateRules))
                            })
                        }
                    }
                ).then(passedOperate => {
                    if (!passedOperate) {
                        return
                    }
                    let isabled = passedOperate.able ? 'abled' : 'disabled';
                    $('.krightmenu').append($(`<li class="${isabled}">${passedOperate.name}</li>`));
                    if(!$('.btn-wrapper').hasClass('off')){
                        $('.krightmenu').css({
                            left: e.pageX-130 + 'px',
                        })
                        let scrollH=e.clientY
                        let rightH=$('.krightmenu')[0].offsetHeight
                        let clientH=$('.file-list-wrapper').height()
                        if(scrollH+rightH-120>clientH){
                            $('.krightmenu').addClass('hideList').css({
                                top: e.pageY-rightH + 'px'
                            }).removeClass('hideList')
                        }
                    }
                }).catch(value => {
                    console.error(value);
                })
            })
        });

        let domArray = document.querySelectorAll('.kright');
        [].forEach.call(domArray,dom => $(dom).addClass('hideList'));

        $('.krightmenu').removeClass('hideList').html('').css({
            left: e.pageX + 'px',
            top: e.pageY + 'px'
        });

        let ofl = document.querySelector('.krightmenu').offsetLeft
        //console.log(ofl)
        //console.log(document.body.clientWidth)
        if(ofl >= document.body.clientWidth-130){
            $('.krightmenu').css({
                left: e.pageX-130 + 'px',
                top: e.pageY + 'px'
            });
        }
    }

    function _showToast(config) {
        clearTimeout($('.global-toast2').timer);
        var config = config || {};
        var message = config.ReturnMsg || '请求失败';
        var duration = config.duration || 2000;
        if ($('.global-toast2').length === 0) {
            var ele = document.createElement('div');
            ele.className = 'global-toast2 hide';
            ele.innerHTML = '<span><img class="toast-icon" src="../images/icon/成功复制@2x.png" alt=""></span><span class="toast-body"></span>'
            document.querySelector('.opg').appendChild(ele);
        }
        $('.global-toast2').removeClass('hide');
        $('.global-toast2').find('.toast-body').text(message);
        $('.global-toast2').css({
            'margin-left': document.querySelector('.global-toast2').clientWidth / -2,
            'margin-top': document.querySelector('.global-toast2').clientHeight / -2
        })
        $('.global-toast2').timer = setTimeout(function () {
            $('.global-toast2').addClass('hide');
        }, duration);
    }

    function _getSendFileTemp(newMsgId) {
        var tempTime = '';
        if (lastMsgTimeMap.get(CHATOBJ.groupId) == undefined) {
            var now = new Date().getTime();
            tempTime = '<div class="list-time">' + formatMsgTime(now) + '</div>';
            lastMsgTimeMap.put(CHATOBJ.groupId, now);
        } else {
            var now = new Date().getTime();
            if (now - lastMsgTimeMap.get(CHATOBJ.groupId) >= 5 * 60 * 1000) {
                tempTime = '<div class="list-time">' + formatMsgTime(now) + '</div>';
                lastMsgTimeMap.put(CHATOBJ.groupId, now);
            } else {
                tempTime = '';
            }
        }

        let msgId = newMsgId;

        let path = $(currentOperateObj.currentDom).find('.icon-wrapper').attr('data-file-path');
        let fileAllName = getFileNameWidthType(path);
        let fileType = getFileType(path);
        let picPath = getFileThumbnailSrc(fileType);
        let fileBgColor = getFileBgColorClassName(fileType);
        let typeClass = '   file-wrapper padding-0 ' + fileBgColor;
        let fileSize = currentOperateObj.fSize;
        let nowTime = new Date().getTime();

        let temp = tempTime
            + '<div id="msg-' + msgId + '" status="1" class="list-right clearfix  file-box">'
            + '<div class="list-name" style="background:' + getNickNameColor(myInfo.myid) + ';" imId="' + myInfo.imUserid + '">我</div>'
            + '<div class="list-text ' + typeClass + '"  data-msgtype="6"  data-senderid="' + myInfo.imUserid + '"  data-status=""  data-sendtime="' + new Date().getTime() + '">'
            + '<div class="content clearfix" data-clickfilemsgid = ' + msgId + '  data-senderid= ' + myInfo.imUserid + '>'
            + '<div class="file-class">'
            + '<img src="../images/file/' + picPath + '56@2x.png" alt="">'
            + '<div class="shadow">'
            + '<canvas class="canvas" width="56" height="56">不支持canvas</canvas>'
            + '</div>'
            + '<div class="prompt-content file-pause hide">已暂停</div>'
            + '<div class="prompt-content file-overdue hide">已过期</div>'
            + '<div class="prompt-content file-deleted hide">已删除</div>'
            + '</div>'
            + '<p>' + fileAllName + '</p>'
            + '</div>'
            + '<div class="down">'
            + '<span class="data-size" data-total="' + bytesToSize(fileSize) + '">' + bytesToSize(fileSize) + '</span>'
            + '<span class="data-from">美办桌面端</span>'
            + '</div>'
            + '<div class="icon-wrapper" data-icon-wrapper-id=' + msgId + '  data-state=uploading data-file-path="' + path + '"  data-file-name="' + fileAllName + '"  data-sendtime=' + nowTime + '  data-type="2"  data-senderid= ' + myInfo.imUserid + ' >'
            + '<em class="iconn-icon-stop"></em>'
            + '</div>'
            + '</div>'
            + '</div>';
        return temp;
    }

    function _updateImList(msgid) {
        //以最后一条消息为准更新会话列表详情
        var last = {
            grouptype: CHATOBJ.groupType,
            groupid: CHATOBJ.groupId,
            msgid: msgid
        };

        if (last.grouptype == 1) {
            $('#session-' + last.groupid).find('p').find('.session-text').html('[文件]');
        } else if (last.grouptype == 2) {
            $('#session-' + last.groupid).find('p').find('.session-text').html(myInfo.myname + ': [文件]');
        }
        $('#session-' + last.groupid).find('.time').html(date_format(new Date().getTime(), 'HH:mm'));
        $('#session-' + last.groupid).attr('msgTime', new Date().getTime());

        var isTop = $('#session-' + CHATOBJ.groupId).attr('isTop');
        if (isTop == 0) {
            if (topNum == 0) {
                $('#session').children().first().before($('#session-' + CHATOBJ.groupId));
            } else {
                $('#session').children().eq(topNum - 1).after($('#session-' + CHATOBJ.groupId));
            }
        }
        //显示发送中的状态
        $('#session-' + last.groupid).attr('msgId', last.msgid);
        $('#session-' + last.groupid).find('p').find('em').removeClass('iconn-34').addClass('iconn-35').removeClass('hideList');
    }

    function isSelected() {
        let selectionObj = window.getSelection();
        let rangeObj = selectionObj.getRangeAt(0);
        let docFragment = rangeObj.cloneContents();
        let tempDiv = document.createElement("div");
        tempDiv.appendChild(docFragment);
        let s = tempDiv.innerHTML;
        return s
    }

    /**
     * 文件回发
     */
    $('.fileSendReturn .cancle').click(() => {
        $('.fileSendReturn').removeClass('animateshow');
    })
    $('.fileSendReturn .confirm').click(() => {
        //隐藏弹窗
        $('.fileSendReturn').removeClass('animateshow');
        //发送消息
        let msgId = $(currentOperateObj.currentDom).parent().attr('id') ? $(currentOperateObj.currentDom).parent().attr('id').replace('msg-', '') : $(currentOperateObj.currentDom).siblings('a.status-todo').attr('msgid');
        let newMsgId = Math.uuid();
        mainObject.resendMessage(msgId, newMsgId);
        //添加发送模板
        $('#msgArea-' + CHATOBJ.groupId + ' #msg').append(_getSendFileTemp(newMsgId));
        //更新左侧列表
        _updateImList(newMsgId)
        //滚动底部
        let msgHeight = $('#msgArea-' + CHATOBJ.groupId + ' #msg').height();
        $('#msgArea-' + CHATOBJ.groupId).scrollTop(msgHeight);
    })

    /**
     * -----------------------------入口------------------------
     */
    $('#msgArea').on('mousedown', '.list-text ', function (e) {
        if (3 == e.which) {
            showRightMenu(this, e);
            e.stopPropagation();
        }
    });
    $('.krightmenu').on('click', 'li', function (e) {
        let name = $(this).html();
        if ($(this).attr('class') == 'disabled') {
            e.stopPropagation()
            return
        }
        currentOperateObj.operates.forEach(operate => {
            Object.keys(operate).forEach(key => {
                if (operate[key].name === name) {
                    operate[key].fn();
                }
            })
        })
    })

    //点击窗口
    $(document).on('click', function () {
        if (!$('.krightmenu').hasClass('hideList')) {
            $('.krightmenu').addClass('hideList')
        }
    })

    //右键别的地方关闭菜单
    $(document).on('mousedown', function (e) {
        e.stopPropagation()
        if (3 == e.which) {
            if (!$('.krightmenu').hasClass('hideList')) {
                $('.krightmenu').addClass('hideList')
            }
        }
    });

    $('#file-list-ul').on('click', 'li a.status-more', function (e) {
        e.stopPropagation()
        showRightMenu(this, e);
    })

    $('#file-list-ul').on('click', 'li', function (e) {
        if (!$('.krightmenu').hasClass('hideList')) {
            $('.krightmenu').addClass('hideList')
        }
    })

    $('.file-list-wrapper').on('click', function (e) {
        e.stopPropagation()
        if (!$('.krightmenu').hasClass('hideList')) {
            $('.krightmenu').addClass('hideList')
        }
    })

    $('#file-list .title').on('click', function (e) {
        e.stopPropagation()
        if (!$('.krightmenu').hasClass('hideList')) {
            $('.krightmenu').addClass('hideList')
        }
    })

})()