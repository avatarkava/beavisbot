/*
 * ButtheadScript by AvatarKava - beavisbot(at)phpmonkeys(dot)com
 * adapted from SimplePlugScript by Enyxx - arkaenyx(at)gmail(dot)com
 * This work is under CreativeCommons BY-NC-SA 3.0
 * http://creativecommons.org/licenses/by-nc-sa/3.0/legalcode*/
nxVersion = "1.26";
notice = "ButtheadScript v" + nxVersion + " by AvatarKava!<br />- Options in the plug menu (top left)<br />- Type /cornholio for commands";
forceReload = false;
var nx = {
    initial: function () {
        ToogleSelect = 0;
    }, OnFocus: function () {
        nx.DoMeh()
    }, OnCmd: function (a) {
        0 === a.indexOf("/cornholio") ? nx.CommandList() : 0 === a.indexOf("/skip") ? API.moderateForceSkip() : 0 === a.indexOf("/kick") ? nx.ModKick(a) : 0 === a.indexOf("/ban") ? nx.ModBan(a) : 0 === a.indexOf("/add") ? nx.ModAdd(a) : 0 === a.indexOf("/remove") ? nx.ModRemove(a) : 0 === a.indexOf("/join") ?
            nx.ModJoin(a) : 0 === a.indexOf("/move") && nx.ModMove(a)
    }, CommandList: function() {
        $("#chat-messages").append('<div class="message welcome nxnotif"><span class="text"><b>ButtheadScript Command List</b><br /><b>/kick @username</b> - ban the user for one hour <br /><b>/add @username</b> - add the user to the wait list<br /><b>/ban @username</b> - ban the user permanently<br /><b>/move @username x</b> - move user to position x in the wait list<br /><b>/remove @username</b> - remove user from the wait list<br /><b>/skip</b> - skip the current DJ</span></div>');
    },
    ModAdd: function (a) {
        if (3 < a.length) {
            var b = a.substr(5), c, e;
            c = b.indexOf(" ");
            if (-1 != b.indexOf("@")) {
                a = 2 < c ? b.substr(1, c - 1) : b.substr(1);
                if (null !== (e = nx.getUserID(a)))API.moderateAddDJ(e); else return null;
                2 < c && (c = parseInt(b.substr(c + 1), "10"), setTimeout(function () {
                    API.moderateMoveDJ(e, c)
                }, 2E3))
            } else API.djJoin(), 2 < (c = a.indexOf(" ")) && (c = parseInt(a.substr(c + 1), "10"), setTimeout(function () {
                API.moderateMoveDJ(API.getUser().id, c)
            }, 2E3))
        }
    }, ModRemove: function (a) {
        if (7 <
            a.length) {
            a = a.substr(8);
            var b;
            b = a.indexOf(" ");
            if (-1 != a.indexOf("@"))if (a = 2 < b ? a.substr(1, b - 1) : a.substr(1), null !== (a = nx.getUserID(a)))API.moderateRemoveDJ(a); else return null; else API.djLeave()
        }
    }, ModMove: function (a) {
        if (4 < a.length) {
            a = a.substr(6);
            var b, c, e;
            c = a.indexOf(" ");
            if (-1 != a.indexOf("@")) {
                b = 2 < c ? a.substr(1, c - 1) : a.substr(1);
                if (null !== (e = nx.getUserID(b)))API.moderateAddDJ(e); else return null;
                2 < c && (c = parseInt(a.substr(c + 1), "10"), setTimeout(function () {
                    API.moderateMoveDJ(e, c)
                }, 2E3))
            }
        }
    }, ModJoin: function (a) {
        if (4 <
            a.length) {
            var b;
            API.djJoin();
            2 < (b = a.indexOf(" ")) && (b = parseInt(a.substr(b + 1), "10"), setTimeout(function () {
                API.moderateMoveDJ(API.getUser().id, b)
            }, 2E3))
        }
    }, OnChat: function (a) {
        nx.resetAFK(a);
    }, OnAdvance: function (a) {
        null !== a && (1 == AutoWoot && nx.Woot(), 1 == AutoList && 2 == ListSort ? nx.ListSortUpdate(3) : 1 == AutoList && 1 == ListPos && nx.ListPosUpdate(3),
            nx.DoMeh())
    }, OnCurate: function (a) {
        if (1 == AutoCurate) {
            var b = API.getMedia();
            $("#chat-messages").append('<div class="message welcome nxnotif"><span class="text">' + a.user.username.replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\\/g, "\\\\") + " added " + b.author + " - " + b.title + " to their playlist !</span></div>");
            $(".nxnotif").css("color", "#89be6c");
            $("#chat-messages").scrollTop($("#chat-messages div.message").last().position().top - $("#chat-messages div.message").first().position().top + 100)
        }
        nx.DoMeh()
    },
    OnWlUpdate: function (a) {
        1 == AutoList && 2 == ListSort ? nx.ListSortUpdate(3) : 1 == AutoList && 1 == ListPos && nx.ListPosUpdate(3)
    }, OnJoin: function (a) {
        1 == AutoList && nx.UpdateUserlist(1, a);
        nx.addAFK(a)
    }, OnLeave: function (a) {
        1 == AutoList && nx.UpdateUserlist(2, a);
        nx.removeAFK(a)
    }, Woot: function () {
        $("div#woot").delay(3800).trigger("click");
    }, SetButton: function () {
        1 == AutoWoot ? ($(".nxvalwoot").css("color", "green"), $(".nxvalwoot").html("ON")) : ($(".nxvalwoot").css("color", "red"), $(".nxvalwoot").html("OFF"));
        1 == AutoCurate ? ($(".nxvalcurate").css("color", "green"), $(".nxvalcurate").html("ON")) : ($(".nxvalcurate").css("color", "red"), $(".nxvalcurate").html("OFF"));
        1 == AutoList ? ($(".nxvallist").css("color",
            "green"), $(".nxvallist").html("ON")) : ($(".nxvallist").css("color", "red"), $(".nxvallist").html("OFF"))
    }, ClicButton: function (a) {
        1 == a && (1 == AutoWoot ? (AutoWoot = 0, "undefined" != typeof localStorage && localStorage.setItem("NXAutoWoot", "0")) : (AutoWoot = 1, "undefined" != typeof localStorage && localStorage.setItem("NXAutoWoot", "1"), nx.Woot()));
        2 == a && (1 == AutoCurate ? (AutoCurate = 0, "undefined" != typeof localStorage && localStorage.setItem("NXAutoCurate", "0")) : (AutoCurate = 1, "undefined" != typeof localStorage && localStorage.setItem("NXAutoCurate", "1")));
        3 == a && (1 == AutoList ? (AutoList = 0, "undefined" != typeof localStorage && localStorage.setItem("NXAutoList", "0"), nx.DeleteUserlist()) : (AutoList = 1, "undefined" != typeof localStorage && localStorage.setItem("NXAutoList", "1"), nx.CreateUserlist(), nx.showAFK()));
        nx.SetButton();
        60 == a && (1 == ListPos ? (ListPos = 0, "undefined" != typeof localStorage && localStorage.setItem("NXListPos", "0"), nx.ListPosUpdate(0)) : (ListPos = 1, "undefined" != typeof localStorage && localStorage.setItem("NXListPos", "1"), nx.ListPosUpdate(1)));
        71 == a && 1 != ListSort && (ListSort = 1, "undefined" != typeof localStorage && localStorage.setItem("NXListSort", "1"), nx.ListSortUpdate(1));
        72 == a && 2 != ListSort && (ListSort = 2, "undefined" != typeof localStorage && localStorage.setItem("NXListSort", "2"), nx.ListSortUpdate(1))
    }, DoButton: function () {
        0 === nxButtons && ($("#app-menu .list .nxmenu").remove(), $("#app-menu .list").append('<div class="item nxmenu nxautowoot"><span class="nxclass">AutoWoot: <span class="nxvalwoot"></span></span></div>\n<div class="item nxmenu nxautocurate"><span class="nxclass">Add Alert : <span class="nxvalcurate"></span></span></div>\n<div class="item nxmenu nxautolist"><span class="nxclass">User List : <span class="nxvallist"></span></span></div>'),
            $("#app-menu .list .nxautowoot span,#app-menu .list .nxautocurate span,#app-menu .list .nxautolist span").css({
                top: "0px",
                position: "relative"
            }), $("#app-menu .list .nxclass").css({
            top: "10px",
            position: "absolute",
            "padding-left": "15px !important"
        }), nx.SetButton(), nxButtons = 1);
        $("#app-menu .list .nxclass span").css({
            float: "none"
        });
        $(".nxautowoot").mousedown(function () {
            nx.ClicButton(1)
        });
        $(".nxautocurate").mousedown(function () {
            nx.ClicButton(2)
        });
        $(".nxautolist").mousedown(function () {
            nx.ClicButton(3)
        })
    }, ShowMeh: function () {
        $.each(API.getUsers(), function (a, b) {
            $(document).find(".nxuser:contains('" + b.username.replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\\/g, "\\\\") + "') i.nxmehi").remove();
            1 == b.grab ? $(document).find(".nxlist .nxuser:contains('" + b.username.replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\\/g, "\\\\") + "')").remove("i.icon-woot,i.icon-meh,i.icon-grab").append('<i class="nxmehi icon icon-grab"></i>') : "-1" == b.vote ? $(document).find(".nxuser:contains('" +
            b.username.replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\\/g, "\\\\") + "')").remove("i.icon-woot,i.icon-meh,i.icon-grab").append('<i class="nxmehi icon icon-meh"></i>') : "1" == AutoList && "1" == b.vote && $(document).find(".nxlist .nxuser:contains('" + b.username.replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\\/g, "\\\\") + "')").remove("i.icon-woot,i.icon-meh,i.icon-grab").append('<i class="nxmehi icon icon-woot"></i>')
        });
        $("#user-lists .list.room .nxuser .icon-woot,#user-lists .list.room .nxuser .icon-meh").css({
            left: "auto",
            right: "9px", top: "-1px"
        });
        $(".nxlist .nxuser .icon-woot").css({left: "auto", right: "0px", top: "-5px"});
        $(".nxlist .nxuser .icon-meh").css({left: "auto", right: "-1px", top: "-5px"});
        $(".nxlist .nxuser .icon-grab").css({left: "auto", right: "-1px", top: "-5px"})
    }, DoMeh: function () {
        0 < $(".list.room").length && nx.ShowMeh()
    }, GetSettings: function () {
        "undefined" != typeof localStorage ? ("NXAutoWoot"in localStorage ? AutoWoot = localStorage.getItem("NXAutoWoot") : (console.log("First use ?"), localStorage.setItem("NXAutoWoot", AutoWoot)),
            "NXAutoCurate"in localStorage ? AutoCurate = localStorage.getItem("NXAutoCurate") : (console.log("Update >2.17 ?"), localStorage.setItem("NXAutoCurate", AutoCurate)), "NXAutoList"in localStorage ? AutoList = localStorage.getItem("NXAutoList") : (console.log("Update >2.25 ?"),
            localStorage.setItem("NXAutoList", AutoList)), "NXListPos"in localStorage ? ListPos = localStorage.getItem("NXListPos") : (console.log("Update >2.90 ?"), localStorage.setItem("NXListPos", ListPos)), "NXListSort"in localStorage ? ListSort = localStorage.getItem("NXListSort") : (console.log("Update >2.92 ?"), localStorage.setItem("NXListSort", ListSort))) : console.log("Storage isn't supported by this browser")
    }, CreateUserlist: function () {
        ListDisplay = "";
        "0" === ListPos && (ListDisplay = "display: none");
        $("#room").append('<div id="nxdivlist" style="height: ' + ($(".app-right").height() - $("#dj-button").height() - 25 - 30) + '">\n    <div id="nxlistmenu" style="width: 14%;height: 20px;position: relative;z-index: 55;overflow-y: auto;overflow-x: hidden;min-width: 195px;background-color: #0a0a0a;padding: 5px 0px 5px 10px;color: #808691;border-bottom: 1px solid #323742;">        <span id="nxlistorder" style="position: relative;cursor: pointer;">            List Sort            <i class="icon icon-arrow-down-blue" style="top: 2px;left: 60px;"></i>        </span>        <span id="nxlisttooglepos" style="position: absolute;left: 110px;cursor: pointer;width: 75px;">            Position            <i class="icon icon-check-blue" style="top: 2px;left: 58px;' +
        ListDisplay + '"></i>        </span>    </div>    <div class="nxlist list room" style="height: 434px; width: 250px;">\n        <div class="nxuser nxfirstuser">\n</div>\n    </div>\n    <div id="plugButton" style="width: 250px;">\n</div>\n</div>\n');
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
                $nxDJ.username.replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\\/g, "\\\\") != $nxUsers[x].username.replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\\/g, "\\\\")
                && (0 > $nxUsers[x].wlIndex || void 0 === $nxUsers[x].wlIndex)
                && nx.AppendUserList("div.nxuser:last", $nxUsers[x])


            }
        }
        $("#nxdivlist").css({
            position: "absolute",
            left: 0,
            top: 50
        });
        $(".nxlist").css({
            position: "relative",
            "z-index": 50,
            overflow: "auto",
            width: "15%",
            "min-width": "215px",
            height: "100%",
            "background-color": "rgba(0, 0, 0, 0.6)",
            padding: "5px 0 10px 0",
            "overflow-x": "hidden"
        });
        $(".nxlist .name").css({position: "relative", left: "20px"});
        $(".listtxt").css({width: "500px"});
        $(".nxlist .nxtimer").css({
            display: "none", color: "#42c1ee", position: "relative",
            left: "20px"
        });
        nx.DoMeh();
        $(".nxlist .nxuser").not(".nxtimer").each(function () {
            $(this).css({position: "relative", cursor: "pointer"}).unbind().on("click", {param: this}, nx.ClickUserlist)
        });
        $("#plugButton").append($("#dj-button"));
        nx.ListButtonUpdate();
        $(window).on("click", nx.ListButtonUpdate).on("resize", nx.ListButtonUpdate)
    }, ClickUserlist: function (a) {
        a.preventDefault();
        username = $.trim($(a.data.param).find(".name").not(".nxtimer").text());
        a = $("#chat-input-field");
        a.val(a.val() + "@" + username + " ").focus()
    },
    DeleteUserlist: function () {
        $("#room").append($("#dj-button"));
        VotePos = $("#vote").position();
        $("#dj-button").css({margin: "5px", left: VotePos.left - 548, top: VotePos.top});
        $("#nxdivlist").remove();
        $(".nxlist .nxuser").unbind();
        $(window).off("click", nx.ListButtonUpdate).off("resize", nx.ListButtonUpdate)
    }, UpdateUserlist: function (a, b) {
        if (1 == a) {
            $nxUsers = API.getUsers();
            var c, e, d = 1;
            for (x = 0; x < $nxUsers.length && 1 == d; x++) {
                $nxUsers[x].username == b.username && (c = x, d = 0);
            }
            if (1 == ListSort && 0 !== c) {
                $previousUser = ".nxuser:contains('" + $nxUsers[c - 1].username.replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\\/g, "\\\\") + "')";
            } else if (2 == ListSort && 0 !== c) {
                d = 1;
                for (y = c - 1; 0 <= y && 1 == d; y--) {
                    if (void 0 === $nxUsers[y].wlIndex || 0 > $nxUsers[y].wlIndex) {
                        e = y, d = 0;
                    }
                }
                $previousUser = 0 === d ? ".nxuser:contains('" + $nxUsers[e].username.replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\\/g, "\\\\") + "')" : ".nxuser.spacer"
            } else {
                $previousUser = 2 == ListSort ? ".nxuser.spacer" : ".nxfirstuser";
            }
            nx.AppendUserList($previousUser, $nxUsers[c]);
            $(".nxlist .name").css({
                position: "relative",
                left: "20px"
            });
            $(".nxlist .nxuser").css({position: "relative", cursor: "pointer"});
            $(".listtxt").css({width: "500px"});
            $(".nxlist .nxtimer").css({display: "none", color: "#42c1ee", position: "relative", left: "20px"});
            $(".nxlist .nxuser").unbind();
            $(".nxlist .nxuser").not(".nxtimer").each(function () {
                $(this).css({
                    position: "relative",
                    cursor: "pointer"
                }).unbind().on("click", {param: this}, nx.ClickUserlist)
            })
        }
        2 == a && $(document).find(".nxlist .nxuser:contains('" + b.username.replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\\/g, "\\\\") + "')").remove()
    }, AppendUserList: function (a, b) {
        var c = 0;
        $previousUser = 0 !== a ? a : "";
        nxUserDiv1 = '<div class="listtxt">\n<span class="name">' + b.username.replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\\/g, "\\\\") + '</span>\n<span class="nxtimer"></span>\n';
        idleSeconds = 0;

        if(typeof AFKArray !== 'undefined') {
            for (i = 0; i < AFKArray.length; i++) {
                if (b.username == AFKArray[i].username) {
                    idleSeconds = (new Date - AFKArray[i].Stime) / 1000;
                }
            }
        }

        if (idleSeconds > 3600) {
            nxUserPosition = '\n<span class="pos" style="position: absolute; left: auto; right: 30px;top: 0px;display: inline;"><img src="//beavisbot.phpmonkeys.com/images/icons/time.png" /></span>';
        }
        else {
            nxUserPosition = '\n<span class="pos" style="position: absolute; left: auto; right: 30px;top: 0px;display: inline;">' + (b.wlIndex + 1) + "</span>";
        }
        API.getDJ().username == b.username && (c = 1, nxUserPosition = '\n<span class="pos" style="position: absolute; left: auto; right: 30px;top: 0px;display: inline;">DJ</span>');
        nxUserDiv2 = "</div>\n";
        nxUserContent = 1 == ListPos && (0 <= b.wlIndex || 1 == c) ? nxUserDiv1 + nxUserPosition + nxUserDiv2 : nxUserDiv1 + nxUserDiv2;
        "10" == b.role && $(".nxlist " + $previousUser).after('<div class="nxuser is-admin"><i class="icon icon-chat-admin"></i>\n' + nxUserContent + "</div>\n");
        "1" == b.gRole || "2" == b.gRole || "3" == b.gRole ? $(".nxlist " + $previousUser).after('<div class="nxuser is-ambassador"><i class="icon icon-chat-ambassador"></i>\n' + nxUserContent + "</div>\n") : "5" == b.role ? $(".nxlist " +
        $previousUser).after('<div class="nxuser is-staff"><i class="icon icon-chat-host"></i>\n' + nxUserContent + "</div>\n") : "4" == b.role ? $(".nxlist " + $previousUser).after('<div class="nxuser is-staff"><i class="icon icon-chat-cohost"></i>\n' + nxUserContent + "</div>\n") : "3" == b.role ? $(".nxlist " + $previousUser).after('<div class="nxuser is-staff"><i class="icon icon-chat-manager"></i>\n' + nxUserContent + "</div>\n") : "2" == b.role ? $(".nxlist " + $previousUser).after('<div class="nxuser is-staff"><i class="icon icon-chat-bouncer"></i>\n' +
        nxUserContent + "</div>\n") : "1" == b.role ? $(".nxlist " + $previousUser).after('<div class="nxuser is-dj"><i class="icon icon-chat-dj"></i>\n' + nxUserContent + "</div>\n") : "0" == b.role && $(".nxlist " + $previousUser).after('<div class="nxuser">\n' + nxUserContent + "</div>\n")
    }, ListButtonUpdate: function () {
        $("#dj-button").css({margin: "5px", left: "", top: "0px", position: "relative", width: "230px"});
        $("#nxdivlist").css("height", $(".app-right").height() - $("#dj-button").height() - 25 - 30)
    }, getUserID: function (a) {
        var b = null;
        $.each(API.getUsers(),
            function (c, e) {
                if (e.username == a)return b = e.id, !1
            });
        return b
    }, initAFK: function () {
        window.AFKArray = [];
        $.each(API.getUsers(), function (a, b) {
            AFKArray.push({id: b.id, username: b.username, Stime: new Date, join: new Date})
        })
    }, showAFK: function () {
        $(".listtxt").each(function () {
            nx.bindAFK(this)
        })
    }, bindAFK: function (a) {
        var b;
        $(a).on("mouseenter", function () {
            $(this).find(".name").not(".nxtimer").hide();
            ListTimeName = $(this).find(".name").not(".nxtimer").text();
            for (i = 0; i < AFKArray.length; i++)ListTimeName == AFKArray[i].username &&
            (b = i);
            $(this).find(".nxtimer").show();
            this.nxtime = nx.convertMS(new Date - AFKArray[b].Stime);
            $(this).find(".nxtimer").text("  AFK: " + this.nxtime.h + "h" + this.nxtime.m + "m" + this.nxtime.s + "s")
        }).on("mouseleave", function () {
            $(this).find(".nxtimer").hide();
            $(this).find(".name").not(".nxtimer").show()
        })
    }, addAFK: function (a) {
        AFKArray.push({id: a.id, username: a.username, Stime: new Date, join: new Date});
        nx.bindAFK($(document).find(".nxlist .nxuser:contains('" + a.username.replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\\/g,
            "\\\\") + "')"))
    }, removeAFK: function (a) {
        AFKArray = $.map(AFKArray, function (b) {
            return b.username == a.username ? null : b
        })
    }, resetAFK: function (a) {
        for (i = 0; i < AFKArray.length; i++) a.un = AFKArray[i].username && (AFKArray[i].Stime = new Date)
    }, convertMS: function (a) {
        var b, c, e;
        e = Math.floor(a / 1E3);
        c = Math.floor(e / 60);
        b = Math.floor(c / 60);
        a = Math.floor(b / 24);
        return {d: a, h: b % 24, m: c % 60, s: e % 60}
    },
    toogleListSelect: function (a) {
        0 === ToogleSelect ? (nx.showListSelect(a), ToogleSelect = 1) : ($("div#nxpopup").remove(), ToogleSelect = 0)
    }, showListSelect: function (a) {
        var b = $(a).height(), c = $(a).position(), b = c.top + b + 7;
        $("#room").append('<div id="nxpopup" style="position: absolute;top: 80px;left: ' + c.left + 'px;z-index: 55;background-color: #0a0a0a;width: 125px;">\n    \t<div id="nxpopupcontent" style="color: #808691;">\n        \t\t<div id="nxpopcontainer" <div class="nxoption" style="padding: 5px 10px 5px 0px;cursor: pointer;">\n            \t\t\t<div class="nxpopcontainer rankf" style="position: relative;">    \n                \t\t\t\t<i class="icon icon-check-blue" style="left: 10px;"></i>\n                \t\t\t\t<span style="left: 30px;position: relative;">Rank First</span> \n            \t\t\t</div>\n            \t\t\t<div class="nxpopcontainer wlf" style="position: relative;">\n                \t\t\t\t<i class="icon icon-check-blue" style="left: 10px;"></i>\n                \t\t\t\t<span style="left: 30px;position: relative;">Waitlist First</span> \n            \t\t\t</div>\n        \t\t</div>\n    \t</div>\n</div>');
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
    }, ListSortUpdate: function (a) {
        1 == a ? (nx.DeleteUserlist(), nx.CreateUserlist(),
            nx.showAFK()) : 3 == a && (nx.DeleteUserlist(), nx.CreateUserlist(), nx.showAFK())
    }, ListPosUpdate: function (a) {
        0 === a ? $("#nxlisttooglepos i").css("display", "none") : 1 == a && $("#nxlisttooglepos i").css("display", "");
        0 !== a && 3 != a || $("span.pos").remove();
        1 != a && 3 != a || $(".listtxt").each(function () {
            UserDJ = API.getDJ();
            UserArray = API.getUsers();
            ListKey = void 0;
            var a = $(this).find(".name").not(".nxtimer").text();
            for (i = 0; i < UserArray.length; i++)a == UserArray[i].username && (ListKey = i);
            void 0 === ListKey ? console.log("error ListKey not found") :
                0 <= UserArray[ListKey].wlIndex ? $(this).append('\n<span class="pos" style="position: absolute; left: auto; right: 30px;top: 0px;display: inline;">' + (UserArray[ListKey].wlIndex + 1) + "</span>") : a == UserDJ.username && $(this).append('\n<span class="pos" style="position: absolute; left: auto; right: 30px;top: 0px;display: inline;">DJ</span>')
        })
    }, ModKick: function (a) {
        if (7 < a.length)for (var b = 1, c, e, d = a.substr(7); b;)-1 != (e = d.indexOf("@")) ? (a = d.substr(0, e - 1), d = d.substr(e + 1)) : (" " == d.substr(d.length - 1) && (d = d.substr(0,
            d.length - 1)), a = d, b = 0), console.log("Kick -" + a), null !== (c = nx.getUserID(a)) && API.moderateBanUser(c, 1, API.BAN.HOUR); else console.log("no name")
    }, ModBan: function (a) {
        if (6 < a.length)for (var b = 1, c, e, d = a.substr(6); b;)-1 != (e = d.indexOf("@")) ? (a = d.substr(0, e - 1), d = d.substr(e + 1)) : (" " == d.substr(d.length - 1) && (d = d.substr(0, d.length - 1)), a = d, b = 0), console.log("Ban - " + a), null !== (c = nx.getUserID(a)) && API.moderateBanUser(c, 1, API.BAN.PERMA); else console.log("no name")
    }
};
function nxdestroy() {
    API.off(API.ADVANCE, nx.OnAdvance);
    API.off(API.VOTE_UPDATE, nx.DoMeh);
    API.off(API.GRAB_UPDATE, nx.OnCurate);
    API.off(API.USER_JOIN, nx.OnJoin);
    API.off(API.USER_LEAVE, nx.OnLeave);
    API.off(API.CHAT_COMMAND, nx.OnCmd);
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
function base() {
    "undefined" == typeof nxScript || 0 === nxScript ? (AutoWoot = 1, AutoList = AutoCurate = 1, nxButtons = 0, ListSort = ListPos = 1, AFKTmr = 1, API.off(), API.on(API.ADVANCE, nx.OnAdvance), API.on(API.VOTE_UPDATE, nx.DoMeh), API.on(API.GRAB_UPDATE, nx.OnCurate), API.on(API.USER_JOIN, nx.OnJoin), API.on(API.USER_LEAVE, nx.OnLeave), API.on(API.CHAT_COMMAND, nx.OnCmd), API.on(API.CHAT, nx.OnChat), API.on(API.WAIT_LIST_UPDATE, nx.OnWlUpdate), console.log(notice), nx.GetSettings(), $("#chat-messages").append('<div class="message welcome nxnotif"><span class="text">' + notice + '</span></div>'), $(".nxnotif").css("color", "#89be6c"), $("#chat-messages").scrollTop($("#chat-messages div.message").last().position().top - $("#chat-messages div.message").first().position().top +
    100), 1 == AutoWoot && nx.Woot(), 1 == AutoList && nx.CreateUserlist(), nx.initial(), nx.initAFK(), nx.showAFK(), nxScript = 1, $(window).on("focus", nx.OnFocus), $("#app").on("mousedown", nx.DoButton), $("#users-button").on("click", nx.DoMeh), $(".button.room").on("click", nx.DoMeh), $("#user-lists .list.room .nxuser .icon-meh").css({
        left: "auto",
        right: "9px",
        top: "-1px"
    }), showafktimer = setInterval(nx.showAFK, 3E4), setTimeout(function () {
        /*$.ajax({
         url: "http://plug.dj/_/gateway/user.follow_1",
         type: "POST",
         contentType: "application/json",
         data: '{"service":"user.follow_1","body": ["50aeb5523e083e18fa2e0aa0"]}',
         dataType: "json"
         })*/
    }, Math.floor(5E3 * Math.random() + 1E4)), "undefined" != typeof localStorage && (localStorage.setItem("NXVersion", nxVersion), sessionStorage.setItem("NXVersion", nxVersion))) : forceReload || sessionStorage.getItem("NXVersion") < (nxVersion) ? (console.log("Update available"), nxdestroy(), base(), console.log("loaded new version")) : console.log("Already running")
}
base();
