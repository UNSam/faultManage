// 全局变量
var chartListMap = {};

var activeBtn = 'threeBtn',tabId = 'pie';

var pageIndex = 1, total = 0;

var isLoading = false, clockTimer = null,loadingTimer = null;
var isClick = false;

layui.use(['jquery','table','laydate','laytpl', 'form'], function(){
    var $ = layui.jquery,
        table = layui.table,
        layer = layui.layer,
        form = layui.form,
        laydate = layui.laydate,
        laytpl = layui.laytpl;

    var $userBtn = $('#jsUserBtn'),
        $userBox = $('.js-user-box'),
        $setBtn = $('#jsSetBtn'),
        $setBox = $('.js-set-box'),
        $navBar = $('#js-navBox'),
        $selectDialog = $('#jsSelectDialog'),
        $changeBtn = $('.btn-item');

    var navTpl = $('#navBox').html();

    var $fault = $('#faultChart'),
        $physics = $('#physicsChart'),
        $reason = $('#reasonChart'),
        $equipment = $('#equipmentChart'),
        $major = $('#majorChart'),
        $majorLabel = $('#labelList');

    var $threeWrap = $('#threeWrapper'),
        $twoWrap = $('#twoWrapper'),
        $menuBtn = $('#menuBtn'),
        $menuBox = $('#menuBox'),
        $menuWrap = $('#menuWrapper');

    var $dialog = $('#detailDialog'),
        $loadingBox = $('#loadingDialog'),
        $dialogMsk = $('#dialogMsk');

    // window宽高
    var wWidth = $(window).width(),
        wHeight =$(window).height();
    var navList = null;

    var typeIndex = null, projectIndex = null;
    var type = null, project = null, selectShips = null;
    var defaultOpt = null;

    var checkedNum = 0;

    var timeChartType = 'year',timeLen = 'all',endYear = new Date().getFullYear(),startYear, nowYear;

    var customWhereConfig = null,customTypeList=['flt_time'];
    var customSelectMap = {
        x:{
            typeName: 'flt_time',
            selected: []
        },
        y:{
            typeName: '',
            selected: []
        }
    };
    var selectedOption = [];
    var selectAll = false;

    var detailSearch = null;
    // 3d模型变量
    var modelData = {};
    var container, controls, timer;
    var camera, scene, renderer, light;
    var selfraycaster, selfmouse,INTERSECTED;
    var objects=[];
    var objInfo={"name":"","num":0};
    var indexNum=0;
    var currentScene=0;
    var gGroup=[];//模型分组索引
    var gGroupMesh=[];//存储模型分组Mesh
    var showAll=true;//是否显示全景
    var renderEnable=false;//控制渲染
    var timeOut = null;
    var INTERSECTEDFlag=false;
    var shipObject;
    var showShip=true;
    //renderLoading
    var showLoading = function (box) {
        if(box.find('.loading-box').length <= 0){
            var loadBox = $('<div>');
            loadBox.addClass('loading-box');
            var html = '<img src="'+baseConfig.fileCtx+'img/loading.gif" class="img-center" alt="">';
            loadBox.html(html);
            box.append(loadBox);
        }
        box.find('.loading-box').fadeIn(200);
    };
    // hideLoading
    var hideLoading = function (box) {
        if(!box) {
            box = $(document);
        }
        box.find('.loading-box').fadeOut(400);
    };
    /*
   * 获取数据
   * */
    var getData = function (config, success, error, complete) {
        // showLoading(true);
        $.ajax({
            url: config.url,
            type: config.type || 'GET',
            data: config.data,
            success: function (res) {
                if(res.code){
                    if(res.data){
                        success(res.data);
                    }else{
                        hideLoading();
                    }
                }else{
                    hideLoading();
                    layer.msg(res.msg,{icon:0});
                }
            },
            error: function (e) {
                console.log(e);
                hideLoading();
                error && error(e);
            },
            complete: function (e) {
                complete && complete(e);
            }
        })
    };
    // 时间
    var timeClock = function (time) {
        var milliSeconds = new Date(time) .getTime();
        if(clockTimer) {
            clearInterval(clockTimer);
            clockTimer = null;
        }
        clockTimer = setInterval(function(){
            milliSeconds += 1000;
            var date = new Date(milliSeconds);
            var timeStr = dateFormat(date, 'yyyy/MM/dd hh:mm:ss');
            $('#sysTime').html(timeStr);
        }, 1000);
    }
    // chart 选择时间范围
    var renderTimeSelect = function (opt,api,name,e) {
        $('.select-time').fadeIn();
        // laydate.render({
        //     elem: '#yearTime',
        //     type: 'year',
        //     range: true
        // })
    };
    // 渲染导航 绑定事件
    var renderMenu = function (navData) {
        navData.proTpl = $('#projectNav').html();
        navData.shipNav = $('#shipNav').html();
        var typeList = navList.typeList;
        var renderRemind = function (opt) {
            var text = '已选: ';
            if(opt.weaType) {
                text += opt.weaType.substr(0, 10);
            }

            if(opt.weaModelNum){
                text += ' > ' + opt.weaModelNum.substr(0, 10);
            }

            if(opt.flt_shipboardCode){
                text += ' > ' + opt.flt_shipboardCode;
            }

            $('.menu-tab').text(text);
        };
        laytpl($('#typeNav').html()).render(navData, function(html){
            $navBar.html(html);
            form.render();
        });
        typeIndex = navData.typeIndex;
        type = typeList[typeIndex].weaType;
        defaultOpt = getRequestData();
        renderRemind(defaultOpt);
        var $typeDialog = $('.type-dialog'),
            $navItem = $('.nav-item');
        $navItem.hover(function(e) {
            $typeDialog.fadeOut(200);
            $('#moreNavDialog').fadeOut(200);
            typeIndex = $(this).attr('index');
            laytpl.proDom = $(this).children('.type-dialog');
            laytpl.proDom.fadeIn(200);
            navData = JSON.parse(JSON.stringify(navList));
            var proList =  navData.typeList;
            if(!$(this).hasClass('nav-more')){
                var renderData = proList[typeIndex];
                if(renderData.weaType == defaultOpt.weaType){
                    renderData.isActive = true;
                    renderData.weaModelNum = defaultOpt.weaModelNum
                }else{
                    renderData.isActive = false;
                }
                laytpl($('#projectNav').html()).render(renderData,function (html) {
                    laytpl.proDom.html(html);
                    form.render();
                });
                $('.nav-item .tri-jiao').attr('class', 'tri-jiao tri-top');
            }else{
                $('#moreNavDialog').fadeIn(200);
            }
            // moreHover();
            shipHover();
            proClick();
            searchNav();
            stopEventUp(e);
        },function (e) {
            $typeDialog.hide();
            $('#moreNavDialog').hide();
        });

        $('.nav-more').hover(function (e) {
            $(this).children('.more-type').fadeIn(200);

            stopEventUp(e);
        },function () {
            $(this).children('.more-type').hide();
        });

        var moreHover = function () {
            $('.js-more').hover(function (e) {
                $typeDialog.fadeOut(200);
                typeIndex = $(this).attr('index');
                laytpl.proDom = $(this).find('.type-dialog');
                var top = $(this).position().top + 3;
                // laytpl.proDom.addClass('child-dialog');
                laytpl.proDom.css({top:top});
                laytpl.proDom.fadeIn(200);
                var proList =  navData.typeList;
                var renderData = proList[typeIndex];
                if(renderData.weaType == defaultOpt.weaType){
                    renderData.isActive = true;
                    renderData.weaModelNum = defaultOpt.weaModelNum
                }else{
                    renderData.isActive = false;
                }
                laytpl($('#projectNav').html()).render(renderData,function (html) {
                    laytpl.proDom.html(html);
                    form.render();
                });
                $('.nav-more .tri-jiao').attr('class', 'tri-jiao tri-left');
                shipHover(laytpl.proDom);
                proClick();
                searchNav();
                stopEventUp(e);
            },function () {
                $typeDialog.hide();
            });
        };
        moreHover();
        var shipHover = function (dom) {
            $('.childListItem').hover(function (e) {
                $('.children-dialog').fadeOut(200);
                var top = $(this).position().top + 3;
                projectIndex = $(this).attr('index');
                laytpl.shipDom = $(this).find('.children-dialog');
                laytpl.shipDom.css({top: top}).fadeIn(200);
                var shipList =  navData.typeList[typeIndex].shipList;
                var renderData = shipList[projectIndex];
                if(renderData.weaType == defaultOpt.weaType){
                    renderData.isActive = true;
                    renderData.weaModelNum = defaultOpt.weaModelNum
                }else{
                    renderData.isActive = false;
                }
                laytpl($('#shipNav').html()).render(shipList[projectIndex],function (html) {
                    laytpl.shipDom.html(html);
                    form.render();
                });
                $('.nav-item .tri-jiao').attr('class', 'tri-jiao tri-top');
                shipClick();
                searchNav();
                stopEventUp(e);
            },function (e) {
                $('.children-dialog').hide();
            });
        };

        // //一级
        bindClick($navItem, function (e) {
            stopEventUp(e);
            $navItem.removeClass('nav-active');
            $('.typeListItem').removeClass('more-nav-active');
            $(this).addClass('nav-active');
            typeIndex = $(this).attr('index');
            type = typeList[typeIndex].weaType;
            projectIndex = null;
            project = null;
            selectShips = null;
            defaultOpt = getRequestData();
            renderRemind(defaultOpt);
            if(!$(this).hasClass('nav-more')) {
                updatePage();
            }
        });
        // //更多 一级
        bindClick($('.js-more'), function (e) {
            stopEventUp(e);
            $navItem.removeClass('nav-active');
            $('.typeListItem').removeClass('more-nav-active');
            $(this).addClass('more-nav-active');
            typeIndex = $(this).attr('index');
            type = typeList[typeIndex].weaType;
            projectIndex = null;
            project = null;
            selectShips = null;
            defaultOpt = getRequestData();
            renderRemind(defaultOpt);
            updatePage();
        });

        var proClick = function () {
            bindClick($('.js-project'),function (e) {
                stopEventUp(e);
                $navItem.removeClass('nav-active');
                $('.typeListItem').removeClass('more-nav-active');
                var topDom = $(this).parents('.nav-item');
                if($(this).parents('.nav-more').length > 0) {
                    $(this).parents('.js-more').addClass('more-nav-active');
                }else{
                    topDom.addClass('nav-active')
                }
                $('.js-project').removeClass('more-nav-active');
                $(this).addClass('more-nav-active');
                type = typeList[typeIndex].weaType;
                projectIndex = $(this).attr('index');
                project = typeList[typeIndex].shipList[projectIndex].weaModelNum;
                selectShips = null;
                defaultOpt = getRequestData();
                renderRemind(defaultOpt);
                updatePage();
            });
        };
        // 船
        var shipClick = function () {
            bindClick($('.js-children-title'),function (e) {
                stopEventUp(e);
                $navItem.removeClass('nav-active');
                $('.typeListItem').removeClass('more-nav-active');
                var topDom = $(this).parents('.nav-item');
                if($(this).parents('.nav-more').length > 0) {
                    $(this).parents('.js-more').addClass('more-nav-active');
                }else{
                    topDom.addClass('nav-active')
                }
                $('.js-project').removeClass('more-nav-active');
                $(this).parents('.js-project').addClass('more-nav-active');
                // type = typeList[typeIndex].weaType;
                defaultOpt = getRequestData();
            });

            bindClick($('.confirm-checkBox'),function (e) {
                stopEventUp(e);
                typeIndex = $(this).parents('.nav-item').attr('index');
                type = typeList[typeIndex].weaType;
                projectIndex = $(this).parents('.js-project').attr('index');
                selectShips = getCheckedVal($(this).prev());
                project = typeList[typeIndex].shipList[projectIndex].weaModelNum;
                defaultOpt = getRequestData();
                renderRemind(defaultOpt);
                updatePage();
            });
        };
        //搜索
        var searchNav = function () {
            bindClick($('.search-nav-btn'),function (e) {
                var searchKey = $(this).prev('.search-nav-input').val();
                var typeList = navData.typeList;
                if($(this).hasClass('js-pro')) {
                    laytpl.proDom = $(this).parents('.type-dialog');
                    var renderData = typeList[typeIndex];
                    renderData.shipList = selectListByKey(renderData.shipList, 'weaModelNum',searchKey);
                    laytpl($('#projectNav').html()).render(renderData,function (html) {
                        // laytpl.shipDom.mouseleave();
                        laytpl.proDom.html(html);
                        // laytpl.shipDom.fadeIn(200)
                        form.render();
                    });
                }else if($(this).hasClass('js-ship')) {
                    laytpl.shipDom = $(this).parents('.project-dialog');
                    var renderData = typeList[typeIndex].shipList[projectIndex];
                    renderData.ships = selectListByKey(renderData.ships, 'flt_shipboardCode',searchKey);
                    laytpl($('#shipNav').html()).render(renderData,function (html) {
                        laytpl.shipDom.html(html);
                        laytpl.shipDom.mouseenter();
                        form.render();
                    });
                }else if($(this).hasClass('js-type')){

                };
                $('.search-nav-btn').hover(stopEventUp);
                shipHover();
                stopEventUp(e);
            });

            $('.search-nav-input').on('click',stopEventUp);
        };
        searchNav();
    };
    //获取导航数据
    var getNavData = function (data,config) {
        navList = {
            isTypeSearch: false,
            isProjectSearch: false,
            isShipSearch: false,
            typeIndex: 0,
            projectIndex: null,
            showMore: false,
            typeList: makeTypeList(3)
        };
        if(config && config.isTypeSearch){
            navList.typeIndex = null;
            navList.isTypeSearch = true;
            navList.projectIndex = null;
            navList.showMore = true;
        };
        if(config && config.isProSearch){
            navList.typeIndex = typeIndex;
            navList.isProjectSearch = true;
            navList.projectIndex = null;
            navList.showMore = false;
        };
        if(config && config.isShipSearch){
            navList.typeIndex = typeIndex;
            navList.isShipSearch = true;
            navList.showMore = false;
            navList.projectIndex = projectIndex;
        };
        // getModelData();
        renderMenu(JSON.parse(JSON.stringify(navList)));
        updatePage();
    };
    // 渲染pie 图例（小）
    var renderPieLabel = function (data, color) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<li class="label-item">'+
                '<div class="label-tag"><div style="border-color:'+color[i]+'"></div><span>'+data[i].name+'</span></div>'+
                '<div class="label-value">'+data[i].percent+'<span>%</span></div>'+
                '</li>';
        }
        $majorLabel.html(html);
    };
    // 获取 更改基础信息
    var renderBasicData = function (data) {
        var typeList = navList.typeList;
        if(!data.weaType){
            data.weaModelNum = typeList[0].weaType
        }
        timeClock(new Date());
        var faultNum = getNum(30);
        var resave = getNum(20);
        $("#shipNum").text(getNum(100));
        $("#faultNum").text(faultNum);
        $("#resave").text(resave);
        $("#percent").text((resave / faultNum).toFixed(1)+'%');
        // getData({
        //     url: 'getInfoByModelNum',
        //     data: data
        // },function (res) {
        //     timeClock(res.sysdate);
        //     $("#shipNum").text(res.shipNum);
        //     $("#faultNum").text(res.faultNum);
        //     $("#resave").text(res.resolvedNum);
        //     $("#percent").text(res.rate);
        // });
    };
    //渲染船信息
    var renderShipMsg = function (data) {
        var renderData = {
            activeIndex: 0,
            selectShip: data
        };
        laytpl($('#shipMsg').html()).render(renderData,function (html) {
            $('.ship-list-msg').html(html);
        })
    };
    // 获取 船舰信息
    var getShipInfo = function (data) {
        var res = makeShips()
        renderShipMsg(res);
        // getData({
        //     url: 'getInfoByModelAndShip',
        //     data:data,
        //     type: 'POST'
        // },function (res) {
        //     renderShipMsg(res);
        // });
    };
    // 初始化图表
    var initEchart = function (map, box, name, option, reqData) {
        var myEchart  = null;
        if (map[name]) {
            myEchart = map[name];
        } else {
            box.attr('name',name);
            myEchart = echarts.init(box[0]);
        }
        // console.log('init',reqData);
        var typeName = '';
        switch(name) {
            case 'physics':
                typeName = 'flt_type';
                break;
            case 'reason':
                typeName = 'flt_reasonType';
                break;
            case 'equipment':
                typeName = 'equ_name';
                break;
            case 'major':
                typeName = 'flt_majorType';
                break;
            // case 'custom':
            //     typeName = customType;
            //     break;
            default: typeName = name; break;
        }
        var option = option || chartConfig[name];
        myEchart.showLoading({
            text: '加载中...',
            color: '#ffffff',
            textColor: '#ffffff',
            maskColor: 'rgba(0,0,0,0)'
        });
        if (option && typeof option === "object") {
            myEchart.setOption(option, true);
        }
        myEchart.hideLoading();
        // $(myEchart).attr('reqData',reqData);
        myEchart.reqData = reqData;
        myEchart.typeName = typeName;
        if(typeName == 'timeChart'){
            myEchart.on('click',function (res) {
                if(!isClick && res.componentType == 'series'){
                    var reData = {
                        weaType: myEchart.reqData.weaType
                    };
                    if(myEchart.reqData.weaModelNum){
                        reData.weaModelNum = myEchart.reqData.weaModelNum;
                    };
                    if(myEchart.reqData.flt_shipboardCode){
                        reData.flt_shipboardCode = myEchart.reqData.flt_shipboardCode;
                    };
                    reData.type = timeChartType;
                    if(timeChartType == 'year'){
                        reData.year = res.name;
                    }else{
                        reData.year = nowYear || startYear;
                        if(timeChartType == 'month'){
                            var monthStr = ('00' + parseInt(res.name));
                            reData.month = monthStr.substr(monthStr.length-2, 2);
                        }else{
                            reData.month = res.name;
                        }
                    }
                    openDialog(reData,true);
                }else if(res.componentType == 'timeline') {
                    nowYear = res.name;
                }
            })
        }else{
            myEchart.on('click', 'series', function(res){
                if(!isClick){
                    if(myEchart.typeName == 'activePie'){
                        return false;
                    }
                    var reData = {
                        weaType: myEchart.reqData.weaType
                    };
                    if(myEchart.reqData.weaModelNum){
                        reData.weaModelNum = myEchart.reqData.weaModelNum;
                    };
                    if(myEchart.reqData.flt_shipboardCode){
                        reData.flt_shipboardCode = myEchart.reqData.flt_shipboardCode;
                    };
                    if(myEchart.typeName == 'custom'){
                        reData.value = res.name;
                        reData.field = customSelectMap.x.typeName;
                        if(customSelectMap.y.typeName){
                            reData.value2 = JSON.stringify([res.seriesName]);
                            reData.field2 = customSelectMap.y.typeName;
                        }
                    }else{
                        reData.value = res.name;
                        reData.field = myEchart.typeName;
                    }
                    openDialog(reData);
                }
            });
        }
        myEchart.resize();
        map[name] = myEchart;
    };
    // 渲染图表
    var  binEchart = function (data) {
//        initEchart(chartListMap, $fault, 'fault',null,data);
        initEchart(chartListMap, $physics, 'physics',null,data);
        initEchart(chartListMap, $physics, 'physics',null,data);
        initEchart(chartListMap, $reason, 'reason',null,data);
        initEchart(chartListMap, $equipment, 'equipment',null,data);
        initEchart(chartListMap, $major, 'major',null,data);
    };
    // 获取时间数据
    var getTimeChartData = function (){
        var requestData = getRequestData();
        var endYear = new Date().getFullYear(),startYear;
        if(!isNaN(timeLen)){
            startYear = Number(endYear) - Number(timeLen);
            requestData.years = startYear + '-' + endYear;
        }
        requestData.type = timeChartType;
        var res = makeTimeData(timeChartType);
        formatTimeChart(res);
        initEchart(timeChartConfig.timeMap, $fault, 'timeChart',timeChartConfig.timeOption,getRequestData());
        // getData({
        //     url: 'getTimeChart',
        //     type: 'POST',
        //     data: requestData
        // },function(res){
        //     formatTimeChart(res);
        //     initEchart(timeChartConfig.timeMap, $fault, 'timeChart',timeChartConfig.timeOption,getRequestData());
        // })
    }
    // 获取图表数据
    var getChartData = function (data, config) {
        if(!config) {
            config = {
                active : (activeBtn == "twoBtn"),
                slide:　true
            }
        }

        if(config.active) {
            switch(tabId) {
                case 'pie':
                    getActivePieData();
                    break;
                case 'bar':
                    getActiveBarData();
                    break;
                case 'custom':
                    renderActiveCustom();
                    break;
                default:　break;
            }
        }
        // timeChartConfig.timeData = res.flt_time;
        if(config.slide) {
//             for(var i in chartConfig){
//                 switch (i) {
//                     //                       case 'fault':
// //                            formatTimeChart(res.flt_time,chartConfig[i]);
// //                            break;
//                     case 'physics':
//                         formatBarChart(res.flt_type, chartConfig[i], 'flt_type', true, 6);
//                         break;
//                     case 'reason':
//                         formatBarChart(res.flt_reasonType, chartConfig[i], 'flt_reasonType', false, 9);
//                         break;
//                     case 'equipment':
//                         formatBarChart(res.equ_name, chartConfig[i],'equ_name', false, 9);
//                         break;
//                     case 'major':
//                         if(res.flt_majorType.yAxis && res.flt_majorType.yAxis.length >0) {
//                             chartConfig[i].series[0].data = formatPieData(res.flt_majorType);
//                         }
//                         break;
//                     default: break;
//                 }
//             }
            chartConfig['major'].series[0].data = makePieData(6);
            binEchart(data);
            renderPieLabel(makePieData(6), chartTheme.pieColor);
        }
        // getData({
        //     url: 'initChart',
        //     type: 'POST',
        //     data: data
        // },function (res) {
           
        // });
    };
    //格式化时间数据
    var formatTimeChart = function (data) {
        startYear = data.startTime;
        endYear = data.endTime;
        switch(timeChartType) {
            case 'year':
                timeChartConfig.timeOption = JSON.parse(JSON.stringify(timeChartConfig.baseOption));
                delete timeChartConfig.timeOption.timeline;
                timeChartConfig.timeOption.xAxis[0].data = getBetweenYearStr(startYear,endYear);
                var values = [], avgValues = [];
                for(var i in data) {
                    if(!isNaN(i)) {
                        values.push(parseInt(data[i].num));
                        avgValues.push(parseInt(data[i].avg));
                    }
                };
                timeChartConfig.timeOption.yAxis[0].min = 0;
                // timeChartConfig.timeOption.yAxis[0].max = Math.ceil(Math.max.apply(Math,values) * 1.1);
                timeChartConfig.timeOption.yAxis[1].min = 0;
                // timeChartConfig.timeOption.yAxis[1].max = Math.ceil(Math.max.apply(Math,avgValues) * 1.1);
                timeChartConfig.timeOption.grid.bottom = '10%';
                timeChartConfig.timeOption.toolbox.feature.myTool.onclick = renderTimeSelect;
                timeChartConfig.timeOption.series[0].data = values;
                timeChartConfig.timeOption.series[1].data = avgValues;
                break;
            case 'quarter':
                var quarterConfig = JSON.parse(JSON.stringify(timeChartConfig.baseOption));
                quarterConfig.xAxis[0].data = timeChartConfig.timeConfig.quarter;
                quarterConfig.timeline.data = getBetweenYearStr(startYear,endYear);
                quarterConfig.toolbox.feature.myTool.onclick = renderTimeSelect;
                quarterConfig.yAxis[0].min = 0;
                // quarterConfig.yAxis[0].max = Math.ceil(Math.max.apply(Math,values) * 1.1);
                quarterConfig.yAxis[1].min = 0;
                // quarterConfig.yAxis[1].max = Math.ceil(Math.max.apply(Math,avgValues) * 1.1);
                timeChartConfig.timeOption = {
                    baseOption: quarterConfig,
                    options: []
                };
                for(var i in data) {
                    if(!isNaN(i)) {
                        var seriesObj = quarterConfig.series;
                        var yAxisObj = quarterConfig.yAxis;
                        seriesObj[0].data = data[i].num;
                        seriesObj[1].data = data[i].avg;
                        yAxisObj[0].min = 0;
                        // yAxisObj[0].max = Math.ceil(Math.max.apply(Math,values) * 1.1);
                        yAxisObj[1].min = 0;
                        // yAxisObj[1].max = Math.ceil(Math.max.apply(Math,avgValues) * 1.1);
                        timeChartConfig.timeOption.options.push({
                            series: JSON.parse(JSON.stringify(seriesObj)),
                            yAxis: JSON.parse(JSON.stringify(yAxisObj)),
                        })
                    }
                }
                if(timeChartConfig.timeOption.options.length>0) {
                    timeChartConfig.timeOption.baseOption.series = timeChartConfig.timeOption.options[0].series;
                }
                break;
            case 'month':
                var monthConfig = JSON.parse(JSON.stringify(timeChartConfig.baseOption));
                monthConfig.xAxis[0].data = timeChartConfig.timeConfig.month;
                monthConfig.timeline.data = getBetweenYearStr(startYear,endYear);
                monthConfig.toolbox.feature.myTool.onclick = renderTimeSelect;
                timeChartConfig.timeOption = {
                    baseOption: monthConfig,
                    options: []
                };
                for(var i in data) {
                    if(!isNaN(i)) {
                        var seriesObj = monthConfig.series;
                        var yAxisObj = monthConfig.yAxis;
                        seriesObj[0].data = data[i].num;
                        seriesObj[1].data = data[i].avg;
                        yAxisObj[0].min = 0;
                        // yAxisObj[0].max = Math.ceil(Math.max.apply(Math,values) * 1.1);
                        yAxisObj[1].min = 0;
                        // yAxisObj[1].max = Math.ceil(Math.max.apply(Math,avgValues) * 1.1);
                        timeChartConfig.timeOption.options.push({
                            series: JSON.parse(JSON.stringify(seriesObj)),
                            yAxis: JSON.parse(JSON.stringify(yAxisObj))
                        })
                    }
                }
                if(timeChartConfig.timeOption.options.length>0) {
                    timeChartConfig.timeOption.baseOption.series = timeChartConfig.timeOption.options[0].series;
                }
                break;
            default: break;
        }
    };
    /*
     * 格式化柱状图数据
     * dir： true 横 false 竖
     * */
    var formatBarChart = function (data, config, type, dir, num) {
        if(data.yAxis && data.yAxis.length>0) {
            if(dir){
                var xData = data.xAxis.reverse();
                var yData = data.yAxis.reverse();
                config.yAxis[0].data = num ? data.xAxis.slice(xData.length - num, xData.length): data.xAxis;
                config.yAxis[0].name = getTypeName(type);
                config.xAxis[0].min = 0;
                // config.xAxis[0].max = Math.ceil(data.maxValue * 1.1);
                config.series[0].data =  num ? yData.slice(yData.length - num, yData.length): yData;
            }else{
                config.xAxis[0].data =  num ? data.xAxis.slice(0, num): data.xAxis;
                var strArr = getTypeName(type).split('');
                strArr.splice(2,0, '\n');
                config.xAxis[0].name = strArr.join('');
                config.yAxis[0].min = 0;
                // config.yAxis[0].max = Math.ceil(data.maxValue * 1.1);
                config.series[0].data = num ? data.yAxis.slice(0, num): data.yAxis;
            }
        }
    };
    //获取分类名称
    var getTypeName = function (type) {
        for(var i = 0; i < classType.length; i++) {
            if(classType[i].key == type){
                return classType[i].label;
            }
        }
    };
    // 格式化饼图数据
    var formatPieData = function (res) {
        var arr = [];
        for(var i = 0; i < res.xAxis.length; i++) {
            var obj = {
                name: res.xAxis[i],
                value: res.yAxis[i],
                percent: res.rates[i].replace('%','')
            };
            arr.push(obj);
        }
        return arr;
    };
    //更新图表数据
    var updatePage = function (config) {
        config =  config || {};
        var requestData = {};
        var typeList = navList.typeList;
        if(typeIndex != null) {
            requestData.weaType = typeList[typeIndex].weaType;
        }

        if(projectIndex != null) {
            requestData.weaModelNum = typeList[typeIndex].shipList[projectIndex].weaModelNum;
        }

        if(selectShips && selectShips.length > 0) {
            requestData.flt_shipboardCode = JSON.stringify(selectShips);
        }

        if (!config.noBasic) {
            renderBasicData(requestData);
        }

        if (!config.noChart) {
            var reData = {
                weaType:  requestData.weaType ? requestData.weaType : typeList[0].weaType,
                xAxisFields: JSON.stringify(['flt_time','flt_type','flt_reasonType','equ_name','flt_majorType'])
            };

            if(requestData.weaModelNum) {
                reData.weaModelNum = requestData.weaModelNum
            }

            if(requestData.flt_shipboardCode) {
                reData.flt_shipboardCode = requestData.flt_shipboardCode
            }
            getTimeChartData();
            getChartData(reData);
        }

        if(activeBtn == "threeBtn") {
            getShipInfo(requestData);
        }
    };
    var getRequestData = function () {
        var reData = {
            weaType: type,
        };

        if(project != null) {
            reData.weaModelNum = project
        }

        if(selectShips &&  selectShips.length > 0) {
            reData.flt_shipboardCode = JSON.stringify(selectShips)
        };
        return reData;
    };
    var addColorForData = function (data,color) {
        if(data.length > 0) {
            for(var i = 0; i < data.length; i++) {
                data[i].itemStyle = {};
                data[i].itemStyle.color = color[i % color.length];
                data[i].itemStyle.borderColor = 'rgba(77,148,255,1)';
                data[i].itemStyle.borderColor = 'rgba(0,0,0,0.2)';
                if(data[i].children && data[i].children.length > 0) {
                    addColorForData(data[i].children,color)
                };
            }
        }
    };
    // 渲染中央pie
    var renderActivePie = function (data) {
        $('#piePlane').fadeIn();

        if(data && data.length > 0) {
            addColorForData(data,chartTheme.activePie);
            activeChartConfig.pie.chartConfig.series[0].data = data;
        }

        initEchart(activeChartConfig.pie.chartMap, $('#js-pie'), 'activePie', activeChartConfig.pie.chartConfig, getRequestData());
        // renderActiveLabel($('#pieInner'), makeData(6));
        // renderActiveLabel($('#pieCenter'),  makeData(8));
        // renderActiveLabel($('#pieOuter'), makeData(10));

        // renderCheckBox($('#equipmentPlane'),mskeSelect(6));
        // renderCheckBox($('#postionPlane'),mskeSelect(12));
        // renderCheckBox($('#partPlane'),mskeSelect(16));
    };
    var getActivePieData = function () {
        var redata = getRequestData();
        redata.xAxisFields = JSON.stringify(['equ_name','flt_type','flt_appliance']);
        // showLoading(true);
        var res = makeCenterPIeData();
        renderActivePie(res);
        // getData({
        //     url: 'getPieCharts',
        //     type: 'POST',
        //     data: redata
        // },function (res) {
        //     // showLoading(false);
        //     renderActivePie(res);
        // });
    };
    // 渲染pie图例
    var renderActiveLabel = function (box, list) {
        var html = '';
        for (var i = 0; i < list.length; i++) {
            html += '<li class="label-li text-ellipsis">'+
                '<span>'+list[i].name+'</span>'+
                '</li>'
        }
        box.html(html);
    };
    // 渲染checkbox
    var renderCheckBox = function (box, list, selected,option) {
        
        var html = '';
        if(!selected) {
            selected = [];
        }
        var key = (option && option.key) ? option.key : 'key';
        var label = (option && option.label) ? option.label : 'label';
        
        for (var i = 0; i < list.length; i++) {
            list[i].checked = false;
            for (var j = 0; j < selected.length; j++) {
                if(selected[j] == list[i][key]) {
                    list[i].checked = true;
                }
            }
            if(list[i].checked){
                html += '<li class="layui-form-item">'+
                    '<input type="checkbox" name="'+list[i][key]+'" title="'+list[i][label]+'" checked lay-skin="primary">'+
                    '</li>'
            }else{
                html += '<li class="layui-form-item">'+
                    '<input type="checkbox" name="'+list[i][key]+'" title="'+list[i][label]+'" lay-skin="primary">'+
                    '</li>'
            }
        }
        box.html(html);
        form.render();
    };
    // 渲染audio
    var renderAudio = function (box, list, selected,option) {
        var html = '';
        if(!selected) {
            selected = '';
        }
        var key = (option && option.key) ? option.key : 'key';
        var label = (option && option.label) ? option.label : 'label';
        for (var i = 0; i < list.length; i++) {
            if(list[i][key] == selected){
                html += '<li class="layui-form-item">'+
                    '<input type="radio" name="type" key="'+list[i][key]+'" title="'+list[i][label]+'" checked lay-skin="primary">'+
                    '</li>'
            }else{
                html += '<li class="layui-form-item">'+
                    '<input type="radio"name="type"  key="'+list[i][key]+'" title="'+list[i][label]+'" lay-skin="primary">'+
                    '</li>'
            }
        }
        box.html(html);
        form.render();
    };
    // 渲染中央bar
    var renderActiveBar = function (data) {
        $('#barPlane').fadeIn();
        console.log( activeChartConfig.bar.chartConfig);
        activeChartConfig.bar.chartMap = {};
        var typeList = activeChartConfig.bar.typelist;
        var chartWrap = $('#chartWrapper');
        $('.plane-bar-item',chartWrap).show();
        chartWrap.attr('class', 'plane-content bar-plane clearfix');
        if(typeList.length > 4){
            typeList = typeList.slice(0,4);
        }
        switch(typeList.length) {
            case 1:
                chartWrap.addClass('one-chart');
                $('#barItem1').siblings().hide();
                // formatBarChart(data[typeList[0]], activeChartConfig.bar.chartConfig,typeList[0]);
                activeChartConfig.bar.chartConfig.series[0].type = 'bar';
                initEchart(activeChartConfig.bar.chartMap, $('#barItem1'), typeList[0], activeChartConfig.bar.chartConfig, getRequestData());
                break;
            case 2:
                chartWrap.addClass('two-chart');
                $('#barItem3,#barItem4').hide();
                // formatBarChart(data[typeList[0]], activeChartConfig.bar.chartConfig,typeList[0]);
                activeChartConfig.bar.chartConfig.series[0].type = 'line';
                initEchart(activeChartConfig.bar.chartMap, $('#barItem1'), typeList[0], activeChartConfig.bar.chartConfig, getRequestData());
                // formatBarChart(data[typeList[1]], activeChartConfig.bar.chartConfig,typeList[1]);
                activeChartConfig.bar.chartConfig.series[0].type = 'bar';
                initEchart(activeChartConfig.bar.chartMap, $('#barItem2'), typeList[1], activeChartConfig.bar.chartConfig, getRequestData());
                break;
            case 3:
                chartWrap.addClass('three-chart');
                $('#barItem4').hide();
                // formatBarChart(data[typeList[0]], activeChartConfig.bar.chartConfig,typeList[0]);
                activeChartConfig.bar.chartConfig.series[0].type = 'bar';
                initEchart(activeChartConfig.bar.chartMap, $('#barItem1'), typeList[0], activeChartConfig.bar.chartConfig, getRequestData());
                // formatBarChart(data[typeList[1]], activeChartConfig.bar.chartConfig,typeList[1]);
                activeChartConfig.bar.chartConfig.series[0].type = 'bar';
                initEchart(activeChartConfig.bar.chartMap, $('#barItem2'), typeList[1], activeChartConfig.bar.chartConfig, getRequestData());
                // formatBarChart(data[typeList[2]], activeChartConfig.bar.chartConfig,typeList[2]);
                activeChartConfig.bar.chartConfig.series[0].type = 'line';
                initEchart(activeChartConfig.bar.chartMap, $('#barItem3'), typeList[2], activeChartConfig.bar.chartConfig, getRequestData());
                break;
            case 4:
                chartWrap.addClass('four-chart');
                // formatBarChart(data[typeList[0]], activeChartConfig.bar.chartConfig,typeList[0]);
                activeChartConfig.bar.chartConfig.series[0].type = 'bar';
                initEchart(activeChartConfig.bar.chartMap, $('#barItem1'), typeList[0], activeChartConfig.bar.chartConfig, getRequestData());
                // formatBarChart(data[typeList[1]], activeChartConfig.bar.chartConfig,typeList[1]);
                activeChartConfig.bar.chartConfig.series[0].type = 'line';
                initEchart(activeChartConfig.bar.chartMap, $('#barItem2'), typeList[1], activeChartConfig.bar.chartConfig, getRequestData());
                // formatBarChart(data[typeList[2]], activeChartConfig.bar.chartConfig,typeList[2]);
                activeChartConfig.bar.chartConfig.series[0].type = 'line';
                initEchart(activeChartConfig.bar.chartMap, $('#barItem3'), typeList[2], activeChartConfig.bar.chartConfig, getRequestData());
                // formatBarChart(data[typeList[3]], activeChartConfig.bar.chartConfig,typeList[3]);
                activeChartConfig.bar.chartConfig.series[0].type = 'bar';
                initEchart(activeChartConfig.bar.chartMap, $('#barItem4'), typeList[3], activeChartConfig.bar.chartConfig, getRequestData());
                break;
            default: break;
        };
        bindClick($('#barPlane .plane-bar-handle'),function () {
            var that = this;
            var chartBox =  $('#barPlane .plane-content');
            var selectBox = $('#barPlane .plane-select-box');
            if($(this).children().hasClass('layui-icon-top')){
                chartBox.css({height: '68%'});
                selectBox.css({height: '32%'});
                for(var i in activeChartConfig.bar.chartMap) {
                    activeChartConfig.bar.chartMap[i].resize();
                }
                $(this).css({bottom: 250});
                $(this).next().fadeIn(500, function () {
                    $(that).children().removeClass('layui-icon-top').addClass('layui-icon-close');
                });
                renderCheckBox($('#countPlane'), classType, typeList);
            }else{
                chartBox.css({height: '100%'});
                selectBox.css({height: '0'});
                $(this).css({bottom: 20});
                $(this).next().fadeOut(500, function () {
                    $(that).children().removeClass('layui-icon-close').addClass('layui-icon-top');
                    for(var i in activeChartConfig.bar.chartMap) {
                        activeChartConfig.bar.chartMap[i].resize();
                    }
                });
            }
        });
    };
    var getActiveBarData = function () {
        var redata = getRequestData();
        var typeList = activeChartConfig.bar.typelist
        if(typeList.length <= 0) {
            typeList = ['flt_position'];
            renderCheckBox($('#countPlane'), classType, typeList);
        }

        if(typeList.length > 4) {
            layer.msg('最多可选4个统计项',{icon:0});
            if(typeList.length > 4){
                typeList = typeList.slice(0,4);
            }
            renderCheckBox($('#countPlane'), classType, typeList);
        }
        var length = typeList.length;
        typeList = ["flt_position","flt_testStage","equ_name","flt_component"].slice(0, length);
        redata.xAxisFields = JSON.stringify(typeList);
        var res = makeChartData()
        renderActiveBar(res);
        // getData({
        //     url: 'initChart',
        //     type: 'POST',
        //     data: redata
        // },function (res) {
        //     // showLoading(false);
        //     renderActiveBar(res);
        // });
    };
    // 渲染中央custom
    var renderActiveCustom = function () {
        $('#customPlane').fadeIn();
        if($('.custome-table').is(':hidden')){
            // renderDialogSelect($('#customType'), {
            //     placehold: '请选择展示数据类型',
            //     list: classType,
            //     label: 'label'
            // });
            renderCustomChart();
        }else{
            renderCustomeTable();
        }
    };
    // 自定义 表格
    var renderCustomeTable = function(config) {
        // var config = {};
        var redata = getRequestData();
        redata.columns = '[]';
        redata.keywords = 'null';
        $('#filterKey').val('');
        customWhereConfig = null;
        table.render({
            elem: '#customTable',
            height: 828,
            method: 'POST',
            url: './common/data/temp.json',
            request: {
                pageName: 'pageNumber',
                limitName: 'pageSize'
            },
            where: redata,
            response: {
                statusCode: '1',
                countName: 'total'
            },
            page: true,
            limit: 20,
            limits: [10,20,50,100],
            even:　true,
            id: 'customTable',
            cols: [
                [
                    {
                        field: 'flt_tecId',
                        title: '序号',
                        sort: true
                    },
                    {
                        field: 'wea_modelNum',
                        title: '项目代号'
                    },
                    {
                        field: 'wea_batchNum',
                        title: '产品编号'
                    },
                    {
                        field: 'flt_time',
                        width: 103,
                        templet: function (res) {
                            return res.flt_time ? res.flt_time.split(' ')[0] : '';
                        },
                        title: '故障时间'
                    },
                    {
                        title: '故障地点',
                        field: 'flt_position'
                    },
                    {
                        title: '试验阶段',
                        field: 'flt_testStage'
                    },
                    {
                        title: '故障现象',
                        field: 'flt_description'
                    },
                    {
                        title: '设备名称',
                        width1: 103,
                        field: 'equ_name'
                    },
                    {
                        title: '故障部位',
                        field: 'flt_component'
                    },
                    {
                        title: '故障器件',
                        field: 'flt_appliance'
                    },
                    {
                        title: '处理措施',
                        field: 'flt_sceneHandle'
                    }
                ]
            ]
        });
        renderAudio($('#filterList'), classType, activeChartConfig.custom.columns);
        table.on('row(customTable)',function(obj){
            renderCustomDetail(obj.data);
            // var data = makeDetailData(obj.data);
            // $(this).addClass('table-selected').siblings().removeClass('table-selected');
            // renderDetail(data);
        })
    };

    var renderCustomDetail = function (data) {
        laytpl($('#customDetailTpL').html()).render(data,function (html) {
            $('#customDetailBox').html(html);
        });
    };

    // 获取类型子列表
    var getChildByType = function (isXType, type) {
        var redata = getRequestData();
        redata.columns = (customWhereConfig && customWhereConfig.columns.length > 0 ) ? customWhereConfig.columns : '[]';
        redata.keywords = (customWhereConfig && customWhereConfig.keywords) ? customWhereConfig.keywords : 'null';
        // var type = isXType ? customSelectMap.x.typeName : customSelectMap.y.typeName;
        var remindText = isXType ? '请勾选x轴<em>'+ getTypeName(type) + '</em>项' : '请勾选内部<em>'+ getTypeName(type) + '</em>项';
        $('.select-remind-text span').attr('isXType',isXType).html(remindText);
        redata.type = type;
        if(type != 'flt_time' && type != 'flt_position' && type != 'flt_component') {
            type = 'flt_time';
        }
        getData({
            url: './common/data/'+type+'.json',
            type: 'POST',
            data: redata
        },function (res) {
            renderCheckBox($('#selectPlane'), res, selectedOption,{
                key: type,
                label: type
            });
        });
    };
    // 获取详情筛选类型
    var getDetailChildByType = function (box, type) {
        var redata = getRequestData();
        redata.columns = '[]';
        redata.keywords = 'null';
        redata.type = type;
        if(type != 'flt_time' && type != 'flt_position' && type != 'flt_component') {
            type = 'flt_time';
        }
        getData({
            url: './common/data/'+type+'.json',
            type: 'POST',
            data: redata
        },function (res) {
            renderDialogSelect(box, {
                placehold: '请选择数据类型',
                list: res,
                label: type,
                key: type
            });
        });
    };
    // 获取自定义图表数据
    var getCustomChartData = function (isShow) {
        var requestData = getRequestData();
        // customSelectMap.x.selected = getChildByType(true, customSelectMap.x.typeName);
        requestData.columns = (customWhereConfig && customWhereConfig.columns.length > 0 ) ? customWhereConfig.columns : '[]';
        requestData.keywords = (customWhereConfig && customWhereConfig.keywords) ? customWhereConfig.keywords : '';
        var columns = JSON.parse(requestData.columns);
        console.log(columns);
        if(!isShow && (columns.length > 0 || requestData.keywords)){
            $('.plane-custom-remind').show();
            if(!columns[0]) {
                columns[0] = customSelectMap.x.typeName;
            }
            var reminText = '<span id="delBlock"><i class="layui-icon layui-icon-close"></i></span><em>'
            reminText += getTypeName(columns[0]);
            if(requestData.keywords && requestData.keywords != 'null') {
                reminText += '（' +  requestData.keywords  + ')';
            }
            reminText += '</em>';
            $('.plane-custom-remind span').html(reminText);
        }else{
            $('.plane-custom-remind').hide();
        }
//        requestData
        requestData.type = customSelectMap.x.typeName;
        if(customSelectMap.x.selected.length>0){
        	requestData.values = JSON.stringify(customSelectMap.x.selected);
        }else{
        	requestData.values = '[]';
        };
        var hasInner = $('input[name=hasInnerType]').is(':checked');
        var url = '';
        if(hasInner && customSelectMap.y.typeName){
            requestData.type2 = customSelectMap.y.typeName;
            requestData.values2 = JSON.stringify(customSelectMap.y.selected);
            url = './common/data/custom2.json';
        }else{
        	requestData.type2 = 'null';
            requestData.values2 = '[]';
            url = './common/data/custom.json';
        }
        selectedOption = [];
       
        getData({
            url: url,
            type: 'POST',
            data: requestData
        },function (res) {
            // showLoading(false);
            // console.log(res);data
            var customConfig = copyObject(activeChartConfig.custom.chartConfig);
            customConfig.xAxis[0].data = res.xAxis;
            var strArr = getTypeName(requestData.type).split('');
            strArr.splice(2,0, '\n');
            customConfig.xAxis[0].name = strArr.join('');
            customConfig.yAxis[0].min = 0;
            // activeChartConfig.custom.chartConfig.yAxis[0].max = Math.ceil(res.maxValue * 1.1);
            if(res.series && res.series.length > 0) {
                customConfig.legend.data = res.legend;
                var tempObj = customConfig.series[0];
                customConfig.series = [];
                for(var i = 0; i < res.legend.length; i++) {
                    var obj = JSON.parse(JSON.stringify(tempObj));
                    obj.formatter = tempObj.formatter;
                    obj.label = tempObj.label;
                    var index = i % chartTheme.activeCustom.length;
                    obj.itemStyle.normal.color = chartTheme.activeCustom[index];
                    obj.name = res.legend[i];
                    obj.type = 'bar';
                    obj.stack = '故障数';
                    obj.data = res.series[i];
                    customConfig.series.push(obj);
                }
            }else{
                customConfig.legend.data = [];
                var tempObj = customConfig.series[0];
                tempObj.data = res.yAxis;
                // tempObj.itemStyle = activeChartConfig.custom.chartConfig
                console.log(tempObj);
                customConfig.series = [tempObj];
            }
            customSelectMap.x.selected = res.xAxis;
            customSelectTypeRender();
            // if(isFirst){
            //     customSelectTypeRender();
            // }
            initEchart(activeChartConfig.custom.chartMap, $('#customeChart'), 'custom', customConfig, getRequestData());
        });
    };
    // 自定义 图表
    var renderCustomChart = function () {
        var tempType = customSelectMap.x.typeName;
        console.log(tempType);
        getChildByType(true, tempType);
        renderDialogSelect($('#customType'), {
            placehold: '请选择展示数据类型',
            list: delItemForArr(classType, customSelectMap.x.typeName, 'key'),
            test: 'y',
            selected: customSelectMap.y.typeName,
            label: 'label'
        });
        renderDialogSelect($('#customXType'), {
            list: delItemForArr(classType, customSelectMap.y.typeName),
            selected: customSelectMap.x.typeName,
            test: 'x',
            label: 'label'
        });
        getCustomChartData();
        form.on('select(customXType)',function (res) {
            selectAll = false;
            tempType = res.value;
            getChildByType(true,res.value);
        });

        form.on('select(customType)',function (res) {
            selectAll = false;
            tempType = res.value;
            getChildByType(false,res.value);
        });

        bindClick($('#addCustomType'),function () {
            var selectedOption = getCheckedVal($('#selectPlane'));
            var isXType = $('.select-remind-text span').attr('isXType');
            if(isXType == 'true') {
                customSelectMap.x.typeName = tempType;
                customSelectMap.x.selected = selectedOption;
            }else{
                customSelectMap.y.typeName = tempType;
                customSelectMap.y.selected = selectedOption;
            }
            selectAll = false;
            customSelectTypeRender();
        });
        bindClick($('#selectAllType'),function () {
            var childs = $('#selectPlane').find('input[type=checkbox]');
            selectAll = !selectAll;
            for(var i = 0; i < childs.length; i++) {
                childs.eq(i).prop('checked',selectAll);
            }
            form.render();
        });
        
        $('.plane-custom-remind').on('click', '#delBlock', function(){
        	console.log(111);
            customWhereConfig.columns = '[]';
            customWhereConfig.keywords = 'null';
            $('.plane-custom-remind').hide();
            getCustomChartData(true);
        })
        
//        bindClick($('#delBlock'), function () {
//        	console.log(111);
//            customWhereConfig.columns = '[]';
//            customWhereConfig.keywords = 'null';
//            $('.plane-custom-remind').hide();
//            getCustomChartData(true);
//        })
    };
    //渲染3d 颜色图例
    var renderColorList = function () {
        var html = '';
        // modelColor.reverse();
        var maxFlt = getMaxFromObj(modelData);
        switch(maxFlt / 10) {
            case 0:
                setNumforColor(1);
                break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                setNumforColor(5);
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                setNumforColor(10);
                break;
            default:
                setNumforColor(100);
                break;
        }

        for(var i = 0; i < modelColor.length; i++) {
            html += '<li><span class="color-block" style="background: #'+modelColor[i].color+'"></span><span>'+modelColor[i].num+'</span></li>';
        }
        $('#rtBox ul').html(html);
    };
    var setNumforColor = function (split) {
        for(var i = 2; i < modelColor.length; i++) {
            modelColor[i].num = split * (i);
        }
    };
    // 渲染3d场景
    var init3D = function () {
        container = document.getElementById( 'jsThree' );
        camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 1, 20000 );
        camera.position.set( 200,80, 250 );

        controls = new THREE.OrbitControls( camera, container );
        controls.target.set( 0, 0, 0 );
        controls.update();
        controls.enablePan=true;
        controls.addEventListener('change',function(){timeRender();})
        scene = new THREE.Scene();
        scene.background =new THREE.Color( 0x001635 );
        // scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

        light = new THREE.HemisphereLight( 0xffffff, 0x000000 );
        light.position.set( 0, 200, 0 );
        scene.add( light );

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0, 200, 100 );
        light.castShadow = true;
        light.shadow.camera.top = 180;
        light.shadow.camera.bottom = -100;
        light.shadow.camera.left = -120;
        light.shadow.camera.right = 120;
        // scene.add( light );

        //scene.add( new THREE.CameraHelper( light.shadow.camera ) );

        // ground
        var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), new THREE.MeshPhongMaterial( { color: 0x001635, depthWrite: false } ) );
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        scene.add( mesh );

        var grid = new THREE.GridHelper( 20000, 200, 0x0F2441, 0x0F2441 );
        grid.material.opacity = 1.0;
        grid.material.transparent = true;
        grid.position.set( 0, -80, 0 );
        scene.add( grid );

        // model
        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
//                hideLoading();
//                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        var onError = function ( xhr ) {
        };
        var colorforfiles = new THREE.Color();
        var loader = new THREE.FBXLoader();
        loader.load(baseConfig.fileCtx + 'common/three/models/fbx/5.fbx', function ( object ) {
//            console.log(object);
//            createGroup(object);
        	var index = 0;
        	var children = object.children;
        	var testStr=["0104+ssst","002ssdg"];
        	children.forEach(function(item){
        		var oi = 0;
        		if(item.isGroup && item.children.length > 0){
	         		 gGroupMesh[index]=[];
	         		 item.traverse(function (child) {
	         			 if (child.isMesh) {
	     	            	oi++;
	     	            	indexNum++;
	     	            	child["num"]=oi;//分组模型材质组中标识
	     	                child["gnum"]=indexNum;//全部模型材质组中标识
	     	                // if(child.parent.name.indexOf('+')>-1)
	     	                // {
	     	                // 	var eqNum=child.parent.name.split('+')[0];//testStr[ii].split('+')[0];
	     	                // 	child.fltNum=modelData[eqNum] ? modelData[eqNum]: 0;
	     	                // }
	     	                // else child.fltNum=0;
	     	                child.fltNum = Math.floor(Math.random()*10 + 1);
	     	                //console.log(child);
	     	                child.colorIndex = Math.ceil(child.fltNum)%10;
	     	                child.colorItem = '0x' + modelColor[child.colorIndex].color;
	     	                //0!
	     	                //1!为每个模型单独创建新材质球
	     	                child.material = new THREE.MeshBasicMaterial({color:colorforfiles.setHex(child.colorItem),transparent:true,opacity:.8,depthTest:true});
	     	                //1！
	     	                gGroupMesh[index].push(child);//分组模型材质组
	     	                objects.push(child);//全部模型材质组
	     	            }
	         	     });
	         		 gGroup[index]=item;
	         		 // console.log(item);
	         		 index++;
        		}
        	});
        	
        	 object.scale.set(0.1,0.1,0.1);
             // object.rotateX(Math.PI/2);
             // object.rotateZ(Math.PI/2);
            scene.add( object );
            hideLoading();
        } ,onProgress,onError);
        loader.load(baseConfig.fileCtx + 'common/three/models/fbx/file4.fbx', function ( object ) {
        	object.traverse(function(child){
        		if (child.isMesh) {
        			child.material = new THREE.MeshBasicMaterial({color:colorforfiles.setHex(Math.random()*0xffffff),transparent:true,opacity:.6});
        		}
        	});
        	object.scale.set(0.05,0.05,0.05);
        	object.position.set(0,-20,-100);
//        	object.rotateY(Math.PI/4);
        	shipObject=object;
        	scene.add(object);
//        	controls.target.set(shipObject.position.x,shipObject.position.y,shipObject.position.z);
        });
        //鼠标拾取
        selfraycaster = new THREE.Raycaster();
        selfmouse = new THREE.Vector2();

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( container.clientWidth, container.clientHeight );
        renderer.shadowMap.enabled = true;
        container.appendChild( renderer.domElement );
        container.addEventListener( 'mousemove', onContainerMouseMove, false );
        document.addEventListener('keydown',onContainerKeyDown,false);
        timeRender();
    };
    function timeRender(){
        renderEnable=true;
        if(timeOut){clearTimeout(timeOut);}
        timeOut = setTimeout(function(){renderEnable=false;},3000);
    };
    //设置模型材质纹理
    function setMaterial(object,objArray)
    {
        var i=0;
        var colorforfiles = new THREE.Color();
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                i++;
                indexNum++;
                child["num"]=i;//分组模型材质组中标识
                child["gnum"]=indexNum;//全部模型材质组中标识
                child.fltNum = parseInt(Math.random()*100 - 1);
                child.colorIndex = parseInt(child.fltNum / 10);
                child.colorItem = '0x' + modelColor[child.colorIndex].color;
                child.castShadow = true;
                child.receiveShadow = true;
                child.eqNum = getEquipmenuNum(child);
                //0！设置各个模型坐标为世界坐标
                child.geometry.computeBoundingBox();
                var centroid = new THREE.Vector3();
                centroid.addVectors(child.geometry.boundingBox.min,child.geometry.boundingBox.max);
                centroid.multiplyScalar(0.5);
                centroid.applyMatrix4(child.matrixWorld);
                //0!
                //1!为每个模型单独创建新材质球
                child.material = new THREE.MeshBasicMaterial({color:colorforfiles.setHex(child.colorItem),transparent:true,opacity:.6});
                //1！
                objArray.push(child);//分组模型材质组
                objects.push(child);//全部模型材质组
            }
        } );
    }
    //创建模型分组
    function createGroup(object)
    {
        var index=0;
        var children = object.children;
        for(var i=0;i<children.length;i++)
        {
            if(children[i].isGroup)
            {
                gGroupMesh[index]=[];
                setMaterial(children[i],gGroupMesh[index]);
                gGroup[index]=children[i];
                // console.log(gGroup[index]);
                // console.log(gGroupMesh);
                index++;
            }
        }
    }
    // 鼠标移动
    function onContainerMouseMove( event ) {
    	
        event.preventDefault();

        selfmouse.x = ( event.offsetX / container.clientWidth) * 2 - 1;
        selfmouse.y = - ( event.offsetY / container.clientHeight ) * 2 + 1;

        //console.log(event.offsetX,event.offsetY,container.clientWidth,container.clientHeight,selfmouse);
        selfraycaster.setFromCamera( selfmouse, camera );
        if(showAll)
        {//显示所有模型
            var intersects = selfraycaster.intersectObjects( objects );
            if ( INTERSECTED != null ) {
                if(INTERSECTED-1>=0) {
                    //objects[INTERSECTED-1].material.opacity = .6;
                	objects[INTERSECTED-1].material.color.setHex(objects[INTERSECTED-1].oldColor);
                    objects[INTERSECTED-1].material.needsUpdate=true;
                    INTERSECTEDColor= null;
                    INTERSECTED = null;
                    objInfo.name="";
                    objInfo.num="";
                    render3dInfo(objInfo);
                    timeRender();
                }
            }
            if ( intersects.length > 0 ) {
                if ( INTERSECTED != intersects[ 0 ].object.gnum ) {

//                    if(INTERSECTED-1>=0) {
//                        objects[INTERSECTED - 1].material.opacity = .6;
//                    }
                    INTERSECTED = intersects[ 0 ].object.gnum;
                    //--修改选中颜色
                    intersects[ 0 ].object.oldColor=intersects[ 0 ].object.material.color.getHex();
                    intersects[ 0 ].object.material.color.setHex(0x16f906);
                    //--
                    //intersects[ 0 ].object.material.opacity=1;
                    intersects[ 0 ].object.material.needsUpdate = true;
                    objInfo.name=intersects[ 0 ].object.parent.name.split('+')[1] + '>'+intersects[ 0 ].object.name;
                    objInfo.num=intersects[ 0 ].object.fltNum;
                    render3dInfo(objInfo);
                    timeRender();
                }
            }
//            else if ( INTERSECTED !== null ) {
//                if(INTERSECTED-1>=0) {
//                    //objects[INTERSECTED-1].material.opacity = .6;
//                	objects[INTERSECTED-1].material.color.setHex(objects[INTERSECTED-1].oldColor);
//                    objects[INTERSECTED-1].material.needsUpdate=true;
//                    INTERSECTEDColor= null;
//                    INTERSECTED = null;
//                    objInfo.name="";
//                    objInfo.num="";
//                    render3dInfo(objInfo);
//                    timeRender();
//                }
//            }
        }
        else {//显示分组模型
            var intersects = selfraycaster.intersectObjects( gGroupMesh[currentScene] );
            if ( INTERSECTED != null ) {
                if(INTERSECTED-1>=0) {
                    //gGroupMesh[currentScene][INTERSECTED-1].material.opacity = .6;
                	gGroupMesh[currentScene][INTERSECTED-1].material.color.setHex(gGroupMesh[currentScene][INTERSECTED-1].oldColor);
                    gGroupMesh[currentScene][INTERSECTED-1].material.needsUpdate=true;
                    INTERSECTED = null;
                    objInfo.name="";
                    objInfo.num="";
                    render3dInfo(objInfo);
                    timeRender();
                }
            }
            if ( intersects.length > 0 ) {
                if ( INTERSECTED != intersects[ 0 ].object.num ) {

//                    if(INTERSECTED-1>=0) {
//                        gGroupMesh[currentScene][INTERSECTED - 1].material.opacity = .6;
//                    }
                    INTERSECTED = intersects[ 0 ].object.num;
                  //--修改选中颜色
                    intersects[ 0 ].object.oldColor=intersects[ 0 ].object.material.color.getHex();
                    intersects[ 0 ].object.material.color.setHex(0x16f906);
                    //--
                    //intersects[ 0 ].object.material.opacity=1;
                    intersects[ 0 ].object.material.needsUpdate = true;
                    objInfo.name=intersects[ 0 ].object.parent.name.split('+')[1] + '>'+intersects[ 0 ].object.name;
                    objInfo.num=intersects[ 0 ].object.fltNum;
                    render3dInfo(objInfo);
                    timeRender();
                }
            }
//            else if ( INTERSECTED !== null ) {
//                if(INTERSECTED-1>=0) {
//                    //gGroupMesh[currentScene][INTERSECTED-1].material.opacity = .6;
//                	gGroupMesh[currentScene][INTERSECTED-1].material.color.setHex(gGroupMesh[currentScene][INTERSECTED-1].oldColor);
//                    gGroupMesh[currentScene][INTERSECTED-1].material.needsUpdate=true;
//                    INTERSECTED = null;
//                    objInfo.name="";
//                    objInfo.num="";
//                    render3dInfo(objInfo);
//                    timeRender();
//                }
//            }
        }
    }
    //重置选中状态
    function resetINTERSECTED()
    {
        if(showAll)
        {
            if ( INTERSECTED !== null ) {
                if(INTERSECTED-1>=0) {
//                    objects[INTERSECTED-1].material.opacity = .6;
                	objects[INTERSECTED-1].material.color.setHex(objects[INTERSECTED-1].oldColor);
                    objects[INTERSECTED-1].material.needsUpdate=true;
                    INTERSECTED = null;
                    objInfo.name="";
                    objInfo.num="";
                    render3dInfo(objInfo);
                }
            }
        }
        else {
            if ( INTERSECTED !== null ) {
                if(INTERSECTED-1>=0) {
//                    gGroupMesh[currentScene][INTERSECTED-1].material.opacity = .6;
                	gGroupMesh[currentScene][INTERSECTED-1].material.color.setHex(gGroupMesh[currentScene][INTERSECTED-1].oldColor);
                    gGroupMesh[currentScene][INTERSECTED-1].material.needsUpdate=true;
                    INTERSECTED = null;
                    objInfo.name="";
                    objInfo.num="";
                    render3dInfo(objInfo);
                }
            }
        }
    }
    //处理键盘消息
    function onContainerKeyDown( event ) {
        resetINTERSECTED();
        if (event.keyCode === 48){//切换全景
            showAll=true;
            gGroup.forEach(function (e){
                e.visible=true;
            });
        }
        if(event.keyCode>=49&&event.keyCode<=58)
        {//切换分组（1~9）
            var i=event.keyCode-49;
            if(i>=gGroup.length) return;
            showAll=false;
            currentScene=i;
            gGroup.forEach(function (e){
                e.visible=false;
            });
            gGroup[currentScene].visible=true;
        }
        if(event.keyCode == 82){//重置镜头
            controls.reset();
            controls.update();
        }
        if(event.keyCode==83)//切换船模显示
        {
        	showShip=!showShip;
        	shipObject.visible=showShip;
        	if(showShip){
        		controls.target.set(shipObject.position.x,shipObject.position.y,shipObject.position.z);
        	}
        	else controls.reset();
        	//else controls.target.set(jiaocheObject.position.x,jiaocheObject.position.y,jiaocheObject.position.z);
        	controls.update();
        }
        timeRender();
    }

    function getEquipmenuNum(node) {
    	var name = node.name;
    	while(!(name.indexOf('+') > -1)){
    		name = node.parent.name;
    	};
    	return name.split('+')[0];
    }
    
    // 3D动画
    var animate = function () {
        timer = requestAnimationFrame( animate );
        render();
        // renderer.render( scene, camera );
    };
    var animate = function () {
        if(renderEnable)
        {
            render();
        }
        requestAnimationFrame( animate );
        //renderer.render( scene, camera );
    };
    
    // 3D渲染
    var render =function() {
        controls.update();
        renderer.render( scene, camera );
    };
    //3d信息
    var render3dInfo = function (data) {
        var html = '';
        if(data.name){
            html += '<li>' +
                '<div class="ship-icon">' +
                '<img src="'+baseConfig.fileCtx +'img/icon1.png" alt="" class="img-center">' +
                '</div>' +
                '<span class="ship-label">名称</span>' +
                '<span class="ship-value">'+data.name+'</span>' +
                '</li>';
        };
        if(data.num){
            html += '<li>' +
                '<div class="ship-icon">' +
                '<img src="'+baseConfig.fileCtx +'img/icon2.png" alt="" class="img-center">' +
                '</div>' +
                '<span class="ship-label">故障数</span>' +
                '<span class="ship-value msg-color">'+data.num+'</span>' +
                '</li>';
        }
        $('#threeInfoBox').html(html);
    };
    // 获取模型数据
    var getModelData = function () {
        // var requestData = getRequestData();
        var requestData = {
            weaType: 'JTC'
        }
        // getData({
        //     url: 'getApplianceCode',
        //     data: requestData,
        //     type: "POST"
        // },function (res) {
        //     modelData = res;
        // });
    };
    // open dialog
    var openDialog = function (config,isTime) {
        isClick = true;
        $dialog.fadeIn();
        $dialogMsk.fadeIn();
        $('body').addClass('no-scroll');
        var bWidth = $dialog.width();
        var bHeight = $dialog.height();
        $dialog.css({
            left: (wWidth - bWidth) / 2 + 'px',
            top:　(wHeight - bHeight) / 2 + 'px'
        });
        laydate.render({
            elem: '.select-date',
            max: 0,
            range: true
        });
        renderTable(config,isTime);
        getDetailChildByType($('#model'),'equ_name');
        getDetailChildByType($('#ship'),'flt_appliance');
        bindClick($('#filterBtn'), function(){
            var project = $('#model').val();
            var ship = $('#ship').val();
            var time = $('#dateTime').val();
            var whereData = {
                equName: project ? project : 'null',
                appliance: ship ? ship : 'null',
                fltTime: time ? time : 'null'
            };
            detailSearch = whereData;
            table.reload('detailTable',{
                where: whereData
            })
        });
    }
    // 渲染表格
    var renderTable = function (config,isTime) {
        // console.log(config);
        showLoading($('.dialog-table'));
        // $('#tableLoad').fadeIn(200);
        var url = '';
        // if(isTime) {
        //     url = 'getDetailByTime';
        // }else{
        //     url = 'detail';
        // }
        var hasInner = $('input[name=hasInnerType]').is(':checked');
        if(!hasInner) {
        	config.field2 = 'null';
        	config.value2 = '[]';
        }
        table.render({
            elem: '#detailTable',
            height: 490,
            method: 'POST',
            url: './common/data/detail.json',
            request: {
                pageName: 'pageNumber',
                limitName: 'pageSize'
            },
            where: config,
            response: {
                statusCode: '1',
                countName: 'total'
            },
            page: true,
            limits: [10,20,50,100],
            even:　true,
            id: 'detailTable',
            cols: [
                [
//                    {
//                        field: 'flt_tecId',
//                        title: '序号',
//                        sort: true
//                    },
                    {
                        field: 'wea_batchNum',
                        title: '产品编号'
                    },
//                    {
//                        field: 'flt_time',
//                        templet: function (res) {
//                            return res.flt_time ? res.flt_time.split(' ')[0] : '';
//                        },
//                        title: '故障时间'
//                    },
//                    {
//                        field: 'flt_testStage',
//                        title: '试验阶段'
//                    },
                    {
                        field: 'equ_name',
                        title: '设备名称'
                    },
//                    {
//                        field: 'flt_component',
//                        title: '故障部位'
//                    },
                    {
                        field: 'flt_appliance',
                        title: '故障器件'
                    },
                    {
                    	title: '原因类别',
                    	field: 'flt_reasonType'
                    },
                    {
                    	title: '故障模式',
                        field: 'flt_mode'
                    }
                ]
            ],
            done: function (res, curr, count) {
                if(res.code){
                    var item = (res.data && res.data.length>0 )? res.data[0] : null;
                }else{
                    hideLoading();
                }
                bindClick($('#dialogSave'), function () {
                    console.log(table);
                    // console.log(table.GET)
                    var reqData = JSON.parse(JSON.stringify(config));
                    for(var i in detailSearch){
                        reqData[i] = detailSearch[i];
                    }
                    // getData({
                    //     url: 'export',
                    //     data: reqData,
                    //     type: "POST"
                    // },function (res) {
                    //     $('#dialogSave').blur();
                    //     window.location.href = baseConfig.ctx + res;
                    // });
                });
                var timer = setInterval(function () {
                    var trs = $('#detailDialog .dialog-table .layui-table-body tr');
                    if(trs.length > 0) {
                        trs.first().addClass('table-selected');
                        var data = makeDetailData(item);
                        $('#tableLoad').fadeOut(400);
                        hideLoading();
                        renderDetail(data);
                        clearInterval(timer);
                        timer = null;
                    }else{
                        $('#msgContent').html('无数据');
                        hideLoading();
                    }
                }, 1000);
                isClick = false;
            }
        });
        table.on('row(lookAt)',function(obj){
            var data = makeDetailData(obj.data);
            $(this).addClass('table-selected').siblings().removeClass('table-selected');
            renderDetail(data);
        })
    };
    //生成详情数据
    var makeDetailData = function (item) {
        if(!item) return false;
        return {
            list: [
                {
                    label: '型号:',
                    value: item.wea_type
                },
                {
                    label: '项目代号:',
                    value: item.wea_modelNum
                },
                {
                    label: '故障信息号:',
                    value: item.flt_code
                },
                {
                    label: '船舷号:',
                    value: item.flt_shipboardCode
                },
                {
                    label: '产品编号:',
                    value: item.wea_batchNum
                },
                {
                    label: '试验阶段:',
                    value: item.flt_testStage
                },
                {
                    label: '故障时间: ',
                    value: item.flt_time ? item.flt_time.split(' ')[0] : ''
                },
                {
                    label: '故障地点:',
                    value: item.flt_position
                },
                {
                    label: '专业类别:',
                    value: item.flt_majorType
                },
                {
                    label: '设备名称:',
                    value: item.equ_name
                },
                {
                    label: '故障部位:',
                    value: item.flt_component
                },
                {
                    label: '故障器件:',
                    value: item.flt_appliance
                },
                {
                    label: '器件类别:',
                    value: item.flt_applianceType
                },
                {
                    label: '器件编号:',
                    value: item.flt_applianceCode
                },
                {
                    label: '物理类别:',
                    value: item.flt_type
                },
                {
                    label: '原因类别:',
                    value: item.flt_reasonType
                },
                {
                    label: '故障模式:',
                    value: item.flt_mode
                },
                {
                    label: '处理措施:',
                    value: item.flt_sceneHandle
                }
            ],
            flt_description: item.flt_description,
            flt_reasonAnalysis: item.flt_reasonAnalysis,
            flt_reason: item.flt_reason
        }
    };
    // 渲染select
    var renderDialogSelect = function (box, config) {
        var html = '';
        if(config.placehold) {
            html = '<option value="">'+ config.placehold +'</option>';
        }
        if(!config.label){
            config.label = 'label';
        };
        if(!config.key){
            config.key = 'key';
        };
        if(config.list && config.list.length > 0){
            for(var i = 0; i < config.list.length; i++) {
                var item = config.list[i];
                if(config.selected == item[config.key]) {
                    html += '<option value="'+item[config.key]+'" selected>'+item[config.label]+'</option>'
                }else{
                    html += '<option value="'+item[config.key]+'">'+item[config.label]+'</option>'
                }
            }
        }
        box.html(html);
        form.render();
    };
    // 渲染详情
    var renderDetail = function (data) {
        var html = '';
        var boxWidth = ($('#msgContent').width() - 4) / 2 - 85;
        if(!data){
            $('#msgContent').html('<span class="empty-msg">无信息！</span>');
            return false;
        }
        if(data.list && data.list.length > 0) {
            html = '<ul class="detail-msg-list clearfix">';
            for(var i=0; i<data.list.length; i++) {
                var item = data.list[i];
                if(item.value){
                    html += '<li class="flex">'+
                        '<span class="detail-label">' + item.label + '</span>'+
                        '<span class="detail-value flex-1 text-ellipsis">' + item.value + '</span>';
                }
                var strLen = item.value ? stringLength(item.value) : 4;
                if(strLen * 6 > boxWidth) {
                    html += '<i class="layui-icon layui-icon-down"></i>' +
                        '<div class="work-all"><i class="layui-icon layui-icon-close"></i>'+ item.value +'</div>'
                }
                html +=  '</li>';
            }
            html += '</ul>';
        }
        if(data.flt_description){
            html += '<div class="detail-item flex">'+
                '<span class="detail-label">故障现象:</span>'+
                '<span class="detail-value flex-1">' + (data.flt_description || '') + '</span>'+
                '</div>';
        }
        if(data.flt_reasonAnalysis){
            html += '<div class="detail-item flex">'+
                '<span class="detail-label">故障原因分析:</span>'+
                '<span class="detail-value flex-1">' + (data.flt_reasonAnalysis || '')  + '</span>'+
                '</div>';
        }
        if(data.flt_remark) {
            html += '<div class="detail-item flex">'+
                '<span class="detail-label">备注: </span>'+
                '<span class="detail-value flex-1">' + data.flt_remark + '</span>'+
                '</div>';
        }
        $('#msgContent').html(html);
        bindClick($('#msgContent .layui-icon-down'),function () {
            $(this).next().fadeIn(200);
        });

        bindClick($('#msgContent .work-all .layui-icon-close'),function () {
            $(this).parent().fadeOut(200);
        });
    };
    // 渲染自定义类型选择
    var customSelectTypeRender = function () {
        var xhtml = '', yhtml = '';
        var xList = customSelectMap.x.selected;
        var yList = customSelectMap.y.selected;
        if(xList.length > 0) {
            for(var i = 0; i < xList.length; i++) {
                xhtml += '<span>' + xList[i] + '</span>';
            }
        };
        if(yList.length > 0) {
            for(var j = 0; j < yList.length; j++) {
                yhtml += '<span>' + yList[j] + '</span>';
            }
        }
        $('.selectType').html(yhtml);
        $('.selectXType').html(xhtml);
    };
    // 绑定事件
    var bindEvent = function () {
        //用户
        bindClick($userBtn, function (e) {
            $userBox.fadeIn();
            $selectDialog.fadeOut();
            $setBox.fadeOut();
            stopEventUp(e);
        });
        //设置
        bindClick($setBtn, function (e) {
            $setBox.fadeIn();
            $selectDialog.fadeOut();
            $userBox.fadeOut();
            stopEventUp(e);
        });
        //取消
        bindClick($(document), function (e) {
            $selectDialog.fadeOut();
            $userBox.fadeOut();
            $setBox.fadeOut();
        });
        //时间
        $('.select-time').hover(function(){
        },function (res) {
            $(this).fadeOut();
        });
        $('#selectYear').hover(function () {
            $(this).find('.time-range').fadeIn();
        },function () {
            $(this).find('.time-range').fadeOut();
        });
        bindClick($('.select-type li'),function(){
            if($(this).attr('id') != 'selectYear'){
                $(this).addClass('more-nav-active').siblings().removeClass('more-nav-active');
                timeChartType = $(this).attr('dataType');
                getTimeChartData();
            };
        });

        bindClick($('#selectYear .time-item'),function(e){
            timeLen = $(this).attr('dataTime');
            getTimeChartData();
            stopEventUp(e)
        });
        // 二维切换
        bindClick($changeBtn, function () {
            if($(this).hasClass('btn-no-active')) {
                $(this).siblings('.btn-active').removeClass('btn-active').addClass('btn-no-active');
                $(this).removeClass('btn-no-active').addClass('btn-active');
            }
            $('.layui-layer-tips ').hide();
            activeBtn = this.id;
            if (activeBtn == 'threeBtn') {
                $threeWrap.fadeIn();
                $twoWrap.fadeOut();
                // showLoading($('.three-wrapper'));
            } else {
                $threeWrap.fadeOut();
                $twoWrap.fadeIn();
                tabId = 'pie';
                $('.item-tab').first().addClass('tab-active').siblings().removeClass('tab-active');
                getActivePieData();
            }
        });
        // 二维Tab
        bindClick($('.item-tab'), function(){
            $(this).addClass('tab-active').siblings().removeClass('tab-active');
            $('.plane-box').hide();
            tabId = $(this).attr('id');
            switch(tabId) {
                case 'pie':
                    getActivePieData();
                    break;
                case 'bar':
                    getActiveBarData();
                    break;
                case 'custom':
                    renderActiveCustom();
                    break;
                default: break;
            }
            $('.layui-layer-tips ').hide();
        });
        //发光按钮
        bindClick($menuBtn, function() {
            $menuBox.fadeIn('normal', function () {
                $menuWrap.hover(function(){
                },function(e){
                    $menuBox.fadeOut('normal');
                })
            });
        });
        // 详情筛选
        bindClick($('#filterType'),function () {
            $('.filter-type-wrapper').toggleClass('hide');

        });
        //关闭弹框
        bindClick($('#dialogClose'), function () {
            $dialog.fadeOut();
            $dialogMsk.fadeOut();
            $('body').removeClass('no-scroll');
            $('.layui-layer-tips ').hide();
            $('#diallogSearch').slideUp();
        });

        bindClick($dialogMsk, function () {
            $dialog.fadeOut();
            $dialogMsk.fadeOut();
            $('body').removeClass('no-scroll');
            $('.layui-layer-tips ').hide();
            $('#diallogSearch').slideUp();
        });
        // 详情搜索
        bindClick($('#dialogSearch'), function () {
            var that = this;
            $('#diallogSearch').slideToggle(function () {
                if($('#diallogSearch').is(':hidden')){
                    $(that).blur();
                }
            });
        });

        // 画 bar 图
        bindClick($('#drawBarChart'), function (res) {
            var checked = getCheckedVal($('#countPlane'));
            activeChartConfig.bar.typelist = checked;
            getActiveBarData();
        });
        // 自定义切换
        bindClick($('#drawCustomChart'), function () {
            $('.custome-table').fadeOut();
            $('.custome-chart').fadeIn();
            $('.layui-layer-tips ').hide();
            renderCustomChart();
        });
        bindClick($('#customPlane .plane-bar-handle'),function () {
            var that = this;
            var chartBox =  $('#customPlane .plane-content');
            var selectBox = $('#customPlane .plane-select-box');
            if($(this).children().hasClass('layui-icon-top')){
                chartBox.css({height: '68%'});
                selectBox.css({height: '32%'});
                for(var i in activeChartConfig.custom.chartMap) {
                    activeChartConfig.custom.chartMap[i].resize();
                }
                $(this).css({bottom: 250});
                $(this).next().fadeIn(500, function () {
                    $(that).children().removeClass('layui-icon-top').addClass('layui-icon-close');
                });
            }else{
                chartBox.css({height: '100%'});
                selectBox.css({height: '0'});
                $(this).css({bottom: 20});
                $(this).next().fadeOut(500, function () {
                    $(that).children().removeClass('layui-icon-close').addClass('layui-icon-top');
                    for(var i in activeChartConfig.custom.chartMap) {
                        activeChartConfig.custom.chartMap[i].resize();
                    }
                });
            }
        });
        // 自定义筛选
        bindClick($('#searchData'), function () {
        	customWhereConfig = null;
            var key = $('#filterList input:checked').attr('key');
            if(key){
            	 customSelectMap.x.typeName = key;
            	 customSelectMap.x.selected = [key];
                 var columns = [key];
            }else{
//            	customSelectMap.x.typeName = key;
            	customSelectMap.x.selected = []
                var columns = [];
            }
            var keywords = $('#filterKey').val();
            // for(var i in activeChartConfig.custom.columns){
            //     if(activeChartConfig.custom.columns[i]){
            //         columns.push(i);
            //     }
            // }
            var wereData = {};
            if(columns.length >0 ) wereData.columns = JSON.stringify(columns)
            else wereData.columns = '[]';
            if(keywords.replace(/\s/g,'')){
                wereData.keywords = keywords
            }else{
                wereData.keywords = 'null'
            }
            table.reload('customTable',{
                where: wereData,
                done: function() {
                    // $('#filterKey').val('');
                    // columns = [];
                }
            });
            customWhereConfig = wereData;
            $('#resetType').click();
            $('.filter-type-wrapper').addClass('hide');
        });
        //返回
        bindClick($('#returnBtn'), function () {
            $('.custome-table').fadeIn();
            $('.custome-chart').fadeOut();
//            customWhereConfig = null;
        });
        bindClick($('#drawSimpleChart'),function () {
            getCustomChartData(true);
        })
    };
    var init = function () {
        showLoading($('.three-wrapper'));
        chartListMap = {};
        
        renderColorList();
        // renderBasicData();
        getNavData();
        // renderNavBar(navData);
        // render3dInfo();
        bindEvent ();
        // binEchart();
        init3D();
        animate();
        $(window).resize(function () {
            wWidth = $(window).width();
            wHeight = $(window).height();
            // 横向滚动条居中
            var docWidth = $(document).width();
            if(wWidth < 1652) {
                $(document).scrollLeft((docWidth - (wWidth- 4)) / 2);
            }
            // 3d
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( container.clientWidth, container.clientHeight );
            if(!$dialog.is(':hidden')){
                var bWidth = $dialog.width();
                var bHeight = $dialog.height();
                $dialog.css({
                    left: (wWidth - bWidth) / 2 + 'px',
                    top:　(wHeight - bHeight) / 2 + 'px'
                });
            }
            if(activeBtn == 'twoBtn'){
                switch(tabId) {
                    case 'pie':
                        if(activeChartConfig.pie.chartMap.activePie) {
                            activeChartConfig.pie.chartMap.activePie.resize();
                        }
                        break;
                    case 'custom':
                        if(activeChartConfig.custom.chartMap.custom) {
                            activeChartConfig.custom.chartMap.custom.resize();
                        }
                        break;
                    case 'bar':
                        for(var i in activeChartConfig.bar.chartMap) {
                            activeChartConfig.bar.chartMap[i].resize();
                        }
                        break;
                    default: break;
                }
            }
        });
    };
    init();
});
//获取checkbox选中
function getCheckedVal(box) {
    var checked = [];
    var elems = box.find('.layui-form-checked');
    for(var i = 0; i < elems.length; i++) {
        var elem = elems.eq(i);
        var input = elem.prev('input');
        checked.push(input.attr('name'));
    }
    return checked;
}
// 绑定点击事件
function bindClick(el, fun) {
    el.off('click').on('click', fun);
}
// 时间格式化
function dateFormat (date, fmt) {
    var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth()+3) / 3),  //季度
        "S": date.getMilliseconds()
    };
    if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)? (o[k]): (("00" + o[k]).substr((""+o[k]).length)));
    return fmt;
}

//查询
function selectListByKey(list, key, value) {
    var newList = [];
    var lowValue = value.toLowerCase();
    var upValue = value.toUpperCase();
    if(list && list.length > 0) {
        for(var i = 0; i < list.length; i++) {
            if(list[i][key].indexOf(value) > -1 || list[i][key].indexOf(lowValue) > -1 || list[i][key].indexOf(upValue) > -1) {
                newList.push(list[i]);
            }
        }
    }else{
        newList = list;
    }
    return newList;
}

// 获取两个日期间所有日期
function getBetweenDateStr (star, end) {
    var res = [];
    var sArr = star.split('-');
    var eArr = end.split('-');
    var sDate = new Date();
    sDate.setUTCFullYear(sArr[0], sArr[1] - 1, sArr[2]);
    var eDate = new Date();
    eDate.setUTCFullYear(eArr[0], eArr[1] - 1, eArr[2]);
    var unixStar = sDate.getTime();
    var unixEnd = eDate.getTime();
    for(var k = unixStar; k <= unixEnd;){
        res.push(dateFormat(new Date(parseInt(k)), 'yyyy/MM/dd'));
        k += 24*60*60*1000;
    }
    return res;
};
// 获取两个日期间所有年
function getBetweenYearStr (star, end) {
    var  res = [];
    var temp = Number(star);
    while (temp <= Number(end)){
        res.push(temp++);
    }
    return res;
};

// 阻止事件流
function stopEventUp (e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}
// 计算字符串长度
function stringLength(str) {
    var tempStr = str;
    return tempStr.replace(/[\u0391-\uFFE5]/g, 'aa').length;
};
//数组去重
function distinctArr(arr) {
    var obj = {}, res = [], len = arr.length;
    for(var i = 0; i < len; i++) {
        if(!obj[arr[i]]){
            obj[arr[i]] = 1;
            res.push(arr[i]);
        }
    };
    return res;
}
// 数组去除某个特定元素
function delItemForArr(arr,del,key) {
    var res = [];
    if(arr && arr.length > 0) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i][key] != del) {
                res.push(arr[i]);
            }
        }
    }
    return res;
};
// 复制对象
function copyObject(obj) {
    var newObj = {};
    for(var i in obj) {
        newObj[i] = obj[i];
    };
    return newObj;
};

function getMaxFromObj(obj) {
    var max = 0;
    for(var i in obj) {
        if(obj[i] > max){
            max = obj[i];
        }
    }
    return max;
}