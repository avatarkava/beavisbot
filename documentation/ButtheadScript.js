/*
 * ButtheadScript by AvatarKava - beavisbot(at)phpmonkeys(dot)com
 * adapted from SimplePlugScript by Enyxx - arkaenyx(at)gmail(dot)com
 * This work is under CreativeCommons BY-NC-SA 3.0
 * http://creativecommons.org/licenses/by-nc-sa/3.0/legalcode*/
// "use strict";
var nxVersion = "2.1.1";
var notice = "ButtheadScript v" + nxVersion + " by AvatarKava!\n - Options in the plug menu (top left)";
var forceReload = true;
var AFKArray = [];

var nx = {
    initial: function () {
        ToogleSelect = 0;
    },
    OnFocus: function () {
        nx.DoMeh();
    },
    OnChat: function (a) {
        nx.resetAFK(a);
    },
    OnAdvance: function (a) {
        null !== a && (1 == AutoWoot && nx.Woot(), 1 == AutoList && 2 == ListSort ? nx.ListSortUpdate(3) : 1 == AutoList && 1 == ListPos && nx.ListPosUpdate(3), nx.DoMeh())
        $('#discogs a').attr('href', 'https://www.discogs.com/search/?&sort=year%2Casc&type=release&q=' + encodeURI(a.media.author + ' - ' + a.media.title));
    },
    OnWlUpdate: function (a) {
        1 == AutoList && 2 == ListSort ? nx.ListSortUpdate(3) : 1 == AutoList && 1 == ListPos && nx.ListPosUpdate(3)
    },
    OnJoin: function (a) {
        1 == AutoList && nx.UpdateUserlist(1, a);
        nx.addAFK(a);
    },
    OnLeave: function (a) {
        1 == AutoList && nx.UpdateUserlist(2, a);
        nx.removeAFK(a);
    },
    Woot: function () {
        $("div#woot").delay(3800).trigger("click");
    },
    SetButton: function () {
        1 == AutoWoot ? ($(".nxvalwoot").css("color", "green"), $(".nxvalwoot").html("ON")) : ($(".nxvalwoot").css("color", "red"), $(".nxvalwoot").html("OFF"));
        1 == AutoList ? ($(".nxvallist").css("color", "green"), $(".nxvallist").html("ON")) : ($(".nxvallist").css("color", "red"), $(".nxvallist").html("OFF"));
    },
    ClicButton: function (a) {
        // Auto woot
        1 == a && (1 == AutoWoot ? (AutoWoot = 0, "undefined" != typeof localStorage && localStorage.setItem("NXAutoWoot", "0")) : (AutoWoot = 1, "undefined" != typeof localStorage && localStorage.setItem("NXAutoWoot", "1"), nx.Woot()));
        // Auto List
        3 == a && (1 == AutoList ? (AutoList = 0, "undefined" != typeof localStorage && localStorage.setItem("NXAutoList", "0"), nx.DeleteUserlist()) : (AutoList = 1, "undefined" != typeof localStorage && localStorage.setItem("NXAutoList", "1"), nx.CreateUserlist(), nx.showAFK()));
        nx.SetButton();
        // List position toggle
        60 == a && (1 == ListPos ? (ListPos = 0, "undefined" != typeof localStorage && localStorage.setItem("NXListPos", "0"), nx.ListPosUpdate(0)) : (ListPos = 1, "undefined" != typeof localStorage && localStorage.setItem("NXListPos", "1"), nx.ListPosUpdate(1)));
        71 == a && 1 != ListSort && (ListSort = 1, "undefined" != typeof localStorage && localStorage.setItem("NXListSort", "1"), nx.ListSortUpdate(1));
        72 == a && 2 != ListSort && (ListSort = 2, "undefined" != typeof localStorage && localStorage.setItem("NXListSort", "2"), nx.ListSortUpdate(1));
    },
    DoButton: function () {
        0 === nxButtons && ($("#app-menu .list .nxmenu").remove(), $("#app-menu .list").append('<div class="item nxmenu nxautowoot"><span class="nxclass">AutoWoot: <span class="nxvalwoot"></span></span></div>\n<div class="item nxmenu nxautolist"><span class="nxclass">User List : <span class="nxvallist"></span></span></div>'),
            $("#app-menu .list .nxautowoot span,#app-menu .list .nxautolist span").css({
                "top": "0px",
                "position": "relative"
            }), $("#app-menu .list .nxclass").css({
            "top": "10px",
            "position": "absolute",
            "padding-left": "15px !important"
        }), nx.SetButton(), nxButtons = 1);
        $("#app-menu .list .nxclass span").css({
            float: "none"
        });
        $(".nxautowoot").mousedown(function () {
            nx.ClicButton(1);
        });
        $(".nxautolist").mousedown(function () {
            nx.ClicButton(3);
        })
    },
    ShowMeh: function () {
        $.each(API.getUsers(), function (a, b) {
            if (b.username) {
                $(document).find(".nxuser:contains('" + nxEscape(b.username) + "') i.nxmehi").remove();
                1 == b.grab ? $(document).find(".nxlist .nxuser:contains('" + nxEscape(b.username) + "')").remove("i.icon-woot,i.icon-meh,i.icon-grab").append('<i class="nxmehi icon icon-grab"></i>') : "-1" == b.vote ? $(document).find(".nxuser:contains('" +
                            nxEscape(b.username) + "')").remove("i.icon-woot,i.icon-meh,i.icon-grab").append('<i class="nxmehi icon icon-meh"></i>') : "1" == AutoList && "1" == b.vote && $(document).find(".nxlist .nxuser:contains('" + nxEscape(b.username) + "')").remove("i.icon-woot,i.icon-meh,i.icon-grab").append('<i class="nxmehi icon icon-woot"></i>')
            }
        });
        $("#user-lists .list.room .nxuser .icon-woot,#user-lists .list.room .nxuser .icon-meh").css({
            "left": "auto",
            "right": "9px",
            "top": "-1px"
        });
        $(".nxlist .nxuser .icon-woot").css({left: "auto", right: "0px", top: "-5px"});
        $(".nxlist .nxuser .icon-meh").css({left: "auto", right: "-1px", top: "-5px"});
        $(".nxlist .nxuser .icon-grab").css({left: "auto", right: "-1px", top: "-5px"})
    },
    DoMeh: function () {
        0 < $(".list.room").length && nx.ShowMeh()
    },
    GetSettings: function () {
        "undefined" != typeof localStorage ? ("NXAutoWoot" in localStorage ? AutoWoot = localStorage.getItem("NXAutoWoot") : (console.log("First use ?"), localStorage.setItem("NXAutoWoot", AutoWoot)),
                "NXAutoList" in localStorage ? AutoList = localStorage.getItem("NXAutoList") : (console.log("Update >2.25 ?"), localStorage.setItem("NXAutoList", AutoList)), "NXListPos" in localStorage ? ListPos = localStorage.getItem("NXListPos") : (console.log("Update >2.90 ?"), localStorage.setItem("NXListPos", ListPos)), "NXListSort" in localStorage ? ListSort = localStorage.getItem("NXListSort") : (console.log("Update >2.92 ?"), localStorage.setItem("NXListSort", ListSort))) : console.log("Storage isn't supported by this browser")
    },
    CreateUserlist: function () {
        ListDisplay = "";
        "0" === ListPos && (ListDisplay = "display: none");
        $("#room").append('<div id="nxdivlist">\n<div id="nxlistmenu"><span id="nxlistorder" style="position: relative;cursor: pointer;">List Sort<i class="icon icon-arrow-down-blue" style="top: 2px;left: 60px;"></i>        </span>        <span id="nxlisttooglepos" style="position: absolute;left: 110px;cursor: pointer;width: 75px;">            Position            <i class="icon icon-check-blue" style="top: 2px;left: 58px;' +
            ListDisplay + '"></i></span></div><div id="discogs"><a href="#" target="_blank"><img height="20" src="https://s.discogs.com/images/discogs-white.png" /></a></div><div class="nxlist list room"><div class="nxuser nxfirstuser"></div></div></div>\n');
        $("#nxlisttooglepos").mousedown(function (a) {
            a.preventDefault();
            nx.ClicButton(60);
            return !1
        });
        $("#nxlistorder").mousedown(function (a) {
            a.preventDefault();
            nx.toogleListSelect(this)
        });
        $nxUsers = API.getUsers();
        $nxWL = API.getWaitList();
        $nxDJ = API.getDJ();
        if (1 == ListSort) {
            for (x = 0; x < $nxUsers.length; x++) {
                nx.AppendUserList("div.nxuser:last", $nxUsers[x]);
            }
        } else if (2 == ListSort) {
            nx.AppendUserList("div.nxuser:last", $nxDJ);
            for (x = 0; x < $nxWL.length; x++) {
                $nxWL[x].wlIndex = x;
                for (i = 0; i < $nxUsers.length; i++) {
                    if ($nxWL[x].username === $nxUsers[i].username) {
                        $nxUsers[i].wlIndex = x;
                    }
                }
                nx.AppendUserList("div.nxuser:last", $nxWL[x]);
            }
            $(".nxlist").append('<div class="nxuser spacer" style="margin: 10px;">\t<div class="divider" style="height: 1px;background-color: white;"></div></div>');
            for (x = 0; x < $nxUsers.length; x++) {
                nxEscape($nxDJ.username) != nxEscape($nxUsers[x].username) && (0 > $nxUsers[x].wlIndex || void 0 === $nxUsers[x].wlIndex) && nx.AppendUserList("div.nxuser:last", $nxUsers[x])
            }
        }

        $("#nxdivlist").css({
            "position": "absolute",
            "left": 0,
            "top": 50,
            "font-size": "0.8rem",
            "height": "100%",
            "z-index": 17,
            "background-color": "rgba(0, 0, 0, 0.7)",
            "width": "250px"
        });
        $("#nxlistmenu").css({
            "height": "20px",
            "position": "relative",
            "z-index": "17",
            "background-color": "#0a0a0a",
            "padding": "5px 0px 5px 10px",
            "color": "#808691",
            "border-bottom": "1px solid #323742"
        });
        $("#nxdivlist .nxlist").css({
            "position": "relative",
            "height": "calc(100% - 50)",
            "padding": "5px 0 10px 0",
            "overflow-y": "auto",
            "overflow-x": "hidden"
        });
        $("#discogs").css({
            "position": "absolute",
            "bottom": "0",
            "left": "97px",
            "margin": "5px auto",
            "text-align": "center"
        })
        $("#discogs img").css({
            "height": "20px",
            "width": "auto"
        });


        $(".nxlist .nxuser").mouseenter(function () {
            $(this).css({"background-color": "#282c35"});
        }).mouseleave(function () {
            $(this).css({"background-color": "transparent"});
        });
        $(".nxlist .name").css({position: "relative", left: "20px"});
        $(".nxlist .listtxt").css({width: "100%"});
        $(".nxlist .nxtimer").css({"display": "none", "color": "#42c1ee", "position": "relative", "left": "20px"});
        nx.DoMeh();
        $(".nxlist .nxuser").not(".nxtimer").each(function () {
            $(this).css({position: "relative", cursor: "pointer"}).unbind().on("click", {param: this}, nx.ClickUserlist)
        });
        //$("#plugButton").append($("#dj-button"));
        $('#discogs a').attr('href', 'https://www.discogs.com/search/?&sort=year%2Casc&type=release&q=' + encodeURI(API.getMedia().author + ' - ' + API.getMedia().title));
        nx.ListButtonUpdate();
        $(window).on("click", nx.ListButtonUpdate).on("resize", nx.ListButtonUpdate);
    },
    ClickUserlist: function (a) {
        a.preventDefault();
        uid = $.trim($(a.data.param).find(".uid").not(".nxtimer").text());
        // @TODO Replace with something that doesn't require RCS to be running
        //console.log('Clicking UID: ' + uid);            
        //require(['plug-modules!plug/core/Events'], function (Events) {Events.trigger('notify', 'icon-plug-dj', 'Clicking UID: ' + uid);});                
        _$context.dispatch(new _$userRolloverEvent(_$userRolloverEvent.SHOW, new _$userModel(API.getUser(uid)), {
            x: 550,
            y: a.pageY
        }));
        //username = $.trim($(a.data.param).find(".name").not(".nxtimer").text());        
        //a = $("#chat-input-field");
        //a.val(a.val() + "@" + username + " ").focus()
    },
    DeleteUserlist: function () {
        //$("#room").append($("#dj-button"));
        VotePos = $("#vote").position();
        //$("#dj-button").css({ margin: "5px", left: VotePos.left - 548, top: VotePos.top });
        $("#nxdivlist").remove();
        $(".nxlist .nxuser").unbind();
        $(window).off("click", nx.ListButtonUpdate).off("resize", nx.ListButtonUpdate);
    },
    UpdateUserlist: function (a, b) {
        if (1 == a) {
            $nxUsers = API.getUsers();
            var c, e, d = 1;
            for (x = 0; x < $nxUsers.length && 1 == d; x++) {
                $nxUsers[x].username == b.username && (c = x, d = 0);
            }
            if (1 == ListSort && 0 !== c) {
                $previousUser = ".nxuser:contains('" + nxEscape($nxUsers[c - 1].username) + "')";
            } else if (2 == ListSort && 0 !== c) {
                d = 1;
                for (y = c - 1; 0 <= y && 1 == d; y--) {
                    if (void 0 === $nxUsers[y].wlIndex || 0 > $nxUsers[y].wlIndex) {
                        e = y, d = 0;
                    }
                }
                $previousUser = 0 === d ? ".nxuser:contains('" + nxEscape($nxUsers[e].username) + "')" : ".nxuser.spacer"
            } else {
                $previousUser = 2 == ListSort ? ".nxuser.spacer" : ".nxfirstuser";
            }
            nx.AppendUserList($previousUser, $nxUsers[c]);
            $(".nxlist .name").css({
                position: "relative",
                left: "20px"
            });
            $(".nxlist .nxuser").css({position: "relative", cursor: "pointer"});
            $(".listtxt").css({width: "100%"});
            $(".nxlist .nxtimer").css({display: "none", color: "#42c1ee", position: "relative", left: "20px"});
            $(".nxlist .nxuser").unbind();
            $(".nxlist .nxuser").not(".nxtimer").each(function () {
                $(this).css({
                    position: "relative",
                    cursor: "pointer"
                }).unbind().on("click", {param: this}, nx.ClickUserlist)
            })
        }
        2 == a && $(document).find(".nxlist .nxuser:contains('" + nxEscape(b.username) + "')").remove()
    },
    AppendUserList: function (a, b) {
        var c = 0;
        $previousUser = 0 !== a ? a : "";
        //nxUserDiv1 = '<div class="listtxt">\n<span class="name">' + b.username.replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\\/g, "\\\\") + '</span>\n<span class="nxtimer"></span>\n<span class="uid" style="display:none;">' + b.id + '</span>\n';
        nxUserDiv1 = '<div class="listtxt">\n<span class="name">' + nxEscape(b.username) + '</span>\n<span class="nxtimer"></span>\n<span class="uid" style="display:none;">' + b.id + '</span>\n';
        idleSeconds = 0;
        if (typeof AFKArray !== 'undefined') {
            for (i = 0; i < AFKArray.length; i++) {
                if (b.username == AFKArray[i].username) {
                    idleSeconds = (new Date - AFKArray[i].Stime) / 1000;
                }
            }
        }
        if (idleSeconds > 3600) {
            nxUserPosition = '\n<span class="pos" style="position: absolute; left: auto; right: 30px;top: 0px;display: inline;"><img src="//ilove80sand90s.com/images/icons/time.png" /></span>';
        } else {
            nxUserPosition = '\n<span class="pos" style="position: absolute; left: auto; right: 30px;top: 0px;display: inline;">' + (b.wlIndex + 1) + "</span>";
        }
        API.getDJ().username == b.username && (c = 1, nxUserPosition = '\n<span class="pos" style="position: absolute; left: auto; right: 30px;top: 0px;display: inline;">DJ</span>');
        nxUserDiv2 = "</div>\n";
        nxUserContent = 1 == ListPos && (0 <= b.wlIndex || 1 == c) ? nxUserDiv1 + nxUserPosition + nxUserDiv2 : nxUserDiv1 + nxUserDiv2;
        "10" == b.role && $(".nxlist " + $previousUser).after('<div class="nxuser is-admin"><i class="icon icon-chat-admin"></i>\n' + nxUserContent + "</div>\n");
        "1" == b.gRole || "2" == b.gRole || "3" == b.gRole ? $(".nxlist " + $previousUser).after('<div class="nxuser is-ambassador"><i class="icon icon-chat-ambassador"></i>\n' + nxUserContent + "</div>\n") : "5" == b.role ? $(".nxlist " +
                    $previousUser).after('<div class="nxuser is-staff"><i class="icon icon-chat-host"></i>\n' + nxUserContent + "</div>\n") : "4" == b.role ? $(".nxlist " + $previousUser).after('<div class="nxuser is-staff"><i class="icon icon-chat-cohost"></i>\n' + nxUserContent + "</div>\n") : "3" == b.role ? $(".nxlist " + $previousUser).after('<div class="nxuser is-staff"><i class="icon icon-chat-manager"></i>\n' + nxUserContent + "</div>\n") : "2" == b.role ? $(".nxlist " + $previousUser).after('<div class="nxuser is-staff"><i class="icon icon-chat-bouncer"></i>\n' +
                                nxUserContent + "</div>\n") : "1" == b.role ? $(".nxlist " + $previousUser).after('<div class="nxuser is-dj"><i class="icon icon-chat-dj"></i>\n' + nxUserContent + "</div>\n") : "0" == b.role && $(".nxlist " + $previousUser).after('<div class="nxuser">\n' + nxUserContent + "</div>\n")
    },
    ListButtonUpdate: function () {
        //$("#dj-button").css({ margin: "5px", left: "0px", top: "0px", position: "relative", width: "230px" });        
        //$("#nxdivlist").css("height", $(".app-right").height() - $("#dj-button").height() - 25 - 30);
        $("#nxdivlist").css("height", $(".app-right").height());
    },
    getUserID: function (a) {
        var b = null;
        $.each(API.getUsers(),
            function (c, e) {
                if (e.username == a) return b = e.id, !1
            });
        return b
    },
    initAFK: function () {
        window.AFKArray = [];
        $.each(API.getUsers(), function (a, b) {
            AFKArray.push({id: b.id, username: b.username, Stime: new Date, join: new Date})
        });
    },
    showAFK: function () {
        $(".listtxt").each(function () {
            nx.bindAFK(this);
        });
    },
    bindAFK: function (a) {
        var b;
        $(a).on("mouseenter", function () {
            $(this).find(".name").not(".nxtimer").hide();
            ListTimeName = $(this).find(".name").not(".nxtimer").text();
            for (i = 0; i < AFKArray.length; i++) {
                ListTimeName == AFKArray[i].username && (b = i);
            }
            $(this).find(".nxtimer").show();
            this.nxtime = nx.convertMS(new Date() - AFKArray[b].Stime);
            $(this).find(".nxtimer").text("  AFK: " + this.nxtime.h + "h" + this.nxtime.m + "m" + this.nxtime.s + "s");
        }).on("mouseleave", function () {
            $(this).find(".nxtimer").hide();
            $(this).find(".name").not(".nxtimer").show();
        });
    },
    addAFK: function (a) {
        AFKArray.push({id: a.id, username: a.username, Stime: new Date(), join: new Date()});
        nx.bindAFK($(document).find(".nxlist .nxuser:contains('" + nxEscape(a.username) + "')"));
    },
    removeAFK: function (a) {
        AFKArray = $.map(AFKArray, function (b) {
            return b.username == a.username ? null : b
        })
    },
    resetAFK: function (a) {
        for (i = 0; i < AFKArray.length; i++) a.un == AFKArray[i].username && (AFKArray[i].Stime = new Date)
    },
    convertMS: function (a) {
        var b, c, e;
        e = Math.floor(a / 1E3);
        c = Math.floor(e / 60);
        b = Math.floor(c / 60);
        a = Math.floor(b / 24);
        return {d: a, h: b % 24, m: c % 60, s: e % 60}
    },
    toogleListSelect: function (a) {
        0 === ToogleSelect ? (nx.showListSelect(a), ToogleSelect = 1) : ($("div#nxpopup").remove(), ToogleSelect = 0)
    },
    showListSelect: function (a) {
        var b = $(a).height(),
            c = $(a).position(),
            b = c.top + b + 7;
        $("#room").append('<div id="nxpopup" style="position: absolute;top: 80px;left: ' + c.left + 'px;z-index: 17;background-color: #0a0a0a;width: 125px;">\n    \t<div id="nxpopupcontent" style="color: #808691;">\n        \t\t<div id="nxpopcontainer" <div class="nxoption" style="padding: 5px 10px 5px 0px;cursor: pointer;">\n            \t\t\t<div class="nxpopcontainer rankf" style="position: relative;">    \n                \t\t\t\t<i class="icon icon-check-blue" style="left: 10px;"></i>\n                \t\t\t\t<span style="left: 30px;position: relative;">Rank First</span> \n            \t\t\t</div>\n            \t\t\t<div class="nxpopcontainer wlf" style="position: relative;">\n                \t\t\t\t<i class="icon icon-check-blue" style="left: 10px;"></i>\n                \t\t\t\t<span style="left: 30px;position: relative;">Waitlist First</span> \n            \t\t\t</div>\n        \t\t</div>\n    \t</div>\n</div>');
        1 == ListSort ? ($(".nxpopcontainer.rankf i").css("display", ""), $(".nxpopcontainer.wlf i").css("display", "none")) : 2 == ListSort && ($(".nxpopcontainer.wlf i").css("display", ""), $(".nxpopcontainer.rankf i").css("display", "none"));
        $(".nxpopcontainer.rankf").mousedown(function (b) {
            b.preventDefault();
            nx.ClicButton(71);
            nx.toogleListSelect(a)
        });
        $(".nxpopcontainer.wlf").mousedown(function (b) {
            b.preventDefault();
            nx.ClicButton(72);
            nx.toogleListSelect(a)
        })
    },
    ListSortUpdate: function (a) {
        1 == a ? (nx.DeleteUserlist(), nx.CreateUserlist(),
                nx.showAFK()) : 3 == a && (nx.DeleteUserlist(), nx.CreateUserlist(), nx.showAFK())
    },
    ListPosUpdate: function (a) {
        0 === a ? $("#nxlisttooglepos i").css("display", "none") : 1 == a && $("#nxlisttooglepos i").css("display", "");
        0 !== a && 3 != a || $("span.pos").remove();
        1 != a && 3 != a || $(".listtxt").each(function () {
            UserDJ = API.getDJ();
            UserArray = API.getUsers();
            ListKey = void 0;
            var a = $(this).find(".name").not(".nxtimer").text();
            for (i = 0; i < UserArray.length; i++) a == UserArray[i].username && (ListKey = i);
            void 0 === ListKey ? console.log("error ListKey not found") :
                0 <= UserArray[ListKey].wlIndex ? $(this).append('\n<span class="pos" style="position: absolute; left: auto; right: 30px;top: 0px;display: inline;">' + (UserArray[ListKey].wlIndex + 1) + "</span>") : a == UserDJ.username && $(this).append('\n<span class="pos" style="position: absolute; left: auto; right: 30px;top: 0px;display: inline;">DJ</span>')
        })
    },
};

function nxdestroy() {
    API.off(API.ADVANCE, nx.OnAdvance);
    API.off(API.VOTE_UPDATE, nx.DoMeh);
    API.off(API.USER_JOIN, nx.OnJoin);
    API.off(API.USER_LEAVE, nx.OnLeave);
    API.off(API.CHAT, nx.OnChat);
    API.off(API.WAIT_LIST_UPDATE, nx.OnWlUpdate);
    $("#app").off("mousedown", nx.DoButton);
    $("#users-button").off("click", nx.DoMeh);
    $(".button.room").off("click", nx.DoMeh);
    nxButtons = nxScript = 0;
    window.AFKArray = [];
    $("#app").one("mousedown", function () {
        $(".nxmenu").remove()
    }).mousedown().mouseup().mousedown().mouseup();
    "undefined" != typeof nx && (nx.DeleteUserlist(), $(window).off("click", nx.ListButtonUpdate).off("resize", nx.ListButtonUpdate));
    clearInterval(showafktimer);
    console.log("Unloaded old version")
}

function nxEscape(a) {
    a.replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\\/g, "\\\\");
    return a;
}

function init() {
    nxButtons = AutoWoot = 0;
    AutoList = ListPos = AFKTmr = 1;
    ListSort = 2;
    API.on(API.ADVANCE, nx.OnAdvance);
    API.on(API.VOTE_UPDATE, nx.DoMeh);
    API.on(API.USER_JOIN, nx.OnJoin);
    API.on(API.USER_LEAVE, nx.OnLeave);
    API.on(API.CHAT, nx.OnChat);
    API.on(API.WAIT_LIST_UPDATE, nx.OnWlUpdate);
    nx.GetSettings();
    console.log(notice);
    $("#chat-messages").append('<div class="cm log"><div class="msg nxnotif"><div class="text cid-undefined">' + notice + '</div></div></div>');
    $("#chat-messages").scrollTop($("#chat-messages div.message").last().position().top - $("#chat-messages div.message").first().position().top + 100);
    $(window).bind('beforeunload', function () {
        return "You are about to navigate away from this plug.dj community!"
    });
    $(".nxnotif").css("color", "#89be6c");
}

function base() {

    init();
    if (AutoWoot == 1) {
        nx.Woot();
    }
    if (AutoList == 1) {
        nx.CreateUserlist();
    }
    nx.initial();
    nx.initAFK();
    nx.showAFK();
    nxScript = 1;
    $(window).on("focus", nx.OnFocus);
    $("#app").on("mousedown", nx.DoButton);
    $("#users-button").on("click", nx.DoMeh);
    $(".button.room").on("click", nx.DoMeh);
    $("#user-lists .list.room .nxuser .icon-meh").css({left: "auto", right: "9px", top: "-1px"});
    showafktimer = setInterval(nx.showAFK, 150000);
    if ("undefined" != typeof localStorage) {
        localStorage.setItem("NXVersion", nxVersion);
    } else {
        sessionStorage.setItem("NXVersion", nxVersion);
    }

    requirejs.config({paths: {'plug-modules': 'https://unpkg.com/plug-modules/plug-modules'}});
    require(['plug-modules!plug/core/Events'], function (Events) {
        Events.trigger('notify', 'icon-plug-dj', notice);
    });

}

$.getScript('https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.2/require.min.js')
    .done(function (script, textStatus) {
        if ("undefined" == typeof nxScript || 0 === nxScript) {
            base();
        } else if (forceReload || sessionStorage.getItem("NXVersion") < (nxVersion)) {
            console.log("Update available");
            nxdestroy();
            base();
            console.log("loaded new version");
        } else {
            console.log("Already running");
        }
    }).fail(function (jqxhr, settings, exception) {
    console.log('Something did not work');
});