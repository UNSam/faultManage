//基础配置
var baseConfig = {
    ctx: 'http://10.126.16.41:8080/FaultManagement/situation/',
    // ctx: 'http://10.126.16.52:8080/FaultManagement/situation/',
//    ctx: 'http://10.126.16.43:8088/FaultManagement/situation/',
//    fileCtx: 'http://localhost:63342/faultManage/',
    // ctx: 'http://localhost:8080/FaultManagement/situation/',
    fileCtx: './'
};
//echart图表颜色配置
var chartTheme = {
    textColor: 'rgba(255,255,255,0.5)',
    bgLineColor: 'rgba(255,255,255,0.05)',
    physicsList: ['#ab0101','#087c76','#938300','#c85a00','#007be4','#0039a2'],
    reasonList: ['#6114ef','#1e4273','#007be4','#0039a2','#c85a00','#ab0101','#0a6600','#087c76','#938300'],
    equipmentList: ['#007be4','#938300','#0a6600','#ab0101','#087c76','#6114ef','#0039a2'],
    lineColor1: '#d41b1b',
    lineColor2: '#007be4',
    imgBg: '#001635',
    pieColor: ['#1e4273', '#746800', '#009337','#007be4','#ab0101','#2663d3','#0039a2','#c85a00','#087c76','#af0062','#6114ef'],
    activePie: ['#6114ef','#1e4273','#007be4','#0039a2','#c85a00','#ab0101','#0a6600','#087c76','#938300'],
    activeBar: [],
    activeCustom: ['#007be4','#938300','#0a6600','#ab0101','#087c76','#6114ef','#0039a2']
};
//模型 颜色分布
var modelColor = [
	{
		color:'6f716f',
		num:'0',
	},
    {
        color: '6b8b13',
        num: '1',
    },
    {
        color: '18c465',
        num: '20',
    },
    {
        color: '12d1e2',
        num: '30',
    },
    {
        color: '304cc7',
        num: '40',
    },
    {
        color: '523478',
        num: '50',
    },
    {
        color: 'd8ff00',
        num: '60',
    },
    {
        color: 'fd5e08',
        num: '70',
    },
    {
        color: 'ff51f9',
        num: '80',
    },
    {
        color: 'ff0066',
        num: '90',
    },
    {
        color: 'ff0000',
        num: '100'
    }
];

var chartIcon = {
    download: 'image://./img/download.png',
    select: 'image://./img/select.png',
};

//中央二维图形配置
var activeChartConfig = {
    bar: {
        typelist: ['flt_position','flt_testStage','equ_name','flt_component'],
        chartMap: {},
        chartConfig:{
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                showTitle: false,
                left: 'right',
                top: 8,
                feature: {
                    magicType: {
                        type: ['bar', 'line']
                    },
                    saveAsImage: {
                        backgroundColor: chartTheme.imgBg,
                        icon: chartIcon.download
                    }
                },
                iconStyle: {
                    borderColor: chartTheme.textColor
                }
            },
            grid: {
                top: '18%',
                bottom: '12%',
                right: '12%'
            },
            dataZoom: {
                show: true,
                type: 'inside',
                start: 0,
                end: 100
            },
            xAxis: [
                {
                    splitLine: {show: true},
                    type: 'category',
                    name: '时间\/周',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: chartTheme.bgLineColor
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: chartTheme.textColor
                        }
                    },
                    boundaryGap: true,
                    data:  (function (){
                        var res = [];
                        var len = 1;
                        while (len < 4) {
                            res.push(len++);
                        }
                        return res;
                    })()
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    name: '故障数/个',
                    max: 200,/**/
                    min: 0,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: chartTheme.bgLineColor
                        }
                    },
                    splitNumber: 11,
                    minInterval: 1,
                    axisLine: {
                        lineStyle: {
                            color: chartTheme.textColor
                        }
                    },
                    boundaryGap: [0.2, 0.2]
                }
            ],
            series: [
                {
                    name:'故障数',
                    type:'bar',
                    label:　{
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    barMinHeight: 3,
                    barMaxWidth: '30px',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var index = params.dataIndex % chartTheme.equipmentList.length;
                                return chartTheme.equipmentList[index]
                            }
                        }
                    },
                    data:(function (){
                        var res = [];
                        var len = 0;
                        while (len < 7) {
                            res.push((Math.random()*200).toFixed(1) - 0);
                            len++;
                        }
                        return res;
                    })()
                }
            ]
        }
    },
    pie: {
        chartMap: {},
        chartConfig: {
            grid: {
                top: '16%',
                bottom: '20%',
                right: '12%'
            },
            toolbox: {
                show: true,
                showTitle: false,
                left: 'right',
                top: 0,
                feature: {
                    saveAsImage: {
                        backgroundColor: chartTheme.imgBg,
                        icon: chartIcon.download
                    }
                },
                iconStyle: {
                    borderColor: chartTheme.textColor
                }
            },
            title: {
                text: '设备 - 物理类别 - 器件类别',
                left: 'center',
                bottom: '4%',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#fff'
                }
            },
            //信息提示
            tooltip: {
                trigger: 'item',   //触发元素  数据点触发
                formatter: function (obj) {
                	var str = obj.seriesName + '<br/>' + obj.data.name + ': ' + obj.data.value;
                	if(obj.data.rate){
                		str += '(' + parseFloat(obj.data.rate).toFixed(2) + '% )';
                	}
                    return str;
                }
            },
            color: chartTheme.pieColor,
            series: [
                {
                    name:'故障数',
                    type:'sunburst',
                    sort: true,
                    // radius: ['10%', '60%'],   //半径
                    // highlightPolicy: 'descendant',
                    center: ['50%', '46%'],   //中心点
                    levels: [
                        {},
                        {
                            r0: '30',
                            r: '120',
                            label: {
                                position: 'insideRight',
                                // slient: false
                            }
                        },
                        {
                            r0: '120',
                            r: '250',
                            label: {
                                position: 'insideRight',
                                // padding: 3,
                                // slient: false
                            }
                        },
                        {
                            r0: '250',
                            r: '260',
                            label: {
                                position: 'outside',
                                // padding: 3,
                                slient: false
                            }
                        }
                    ]
                }
            ]
        }
    },
    custom: {
        selectType: '',
        typeList: ['flt_position'],
        columns: {},
        chartMap: {},
        chartConfig:{
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
			     	var ret = 0;
			     	var str = "";
			         for(var i=0;i<params.length;i++){
			        	 if(params[i].value != 0){
			        		 str += params[i].seriesName + ": " +　params[i].value + '<br/>';
			        	 }
			             ret += Number(params[i].value);
			         }
			         return  "合计: " +　ret + '<br/>' + str; //params[0].name +
			    }
            },
            legend: {
                data:['故障数'],
                type: 'scroll',
                orient: 'vertical',
                align: 'left',
                top: 40,
                right: 8,
                textStyle: {
                    color: chartTheme.textColor
                }
            },
            toolbox: {
                show: true,
                showTitle: false,
                left: 'right',
                top: 8,
                feature: {
                    magicType: {
                        type: ['bar', 'line']
                    },
                    saveAsImage: {
                        backgroundColor: chartTheme.imgBg,
                        icon: chartIcon.download
                    }
                },
                iconStyle: {
                    borderColor: chartTheme.textColor
                }
            },
            grid: {
                top: '18%',
                bottom: '12%',
                right: '18%'
            },
            dataZoom: {
                show: true,
                type: 'inside',
                start: 0,
                end: 100
            },
            xAxis: [
                {
                    splitLine: {show: true},
                    type: 'category',
                    name: '时间\/周',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: chartTheme.bgLineColor
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: chartTheme.textColor
                        }
                    },
                    boundaryGap: true,
                    data:  (function (){
                        var res = [];
                        var len = 1;
                        while (len < 4) {
                            res.push(len++);
                        }
                        return res;
                    })()
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    name: '故障数/个',
                    max: 200,
                    min: 0,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: chartTheme.bgLineColor
                        }
                    },
                    splitNumber: 11,
                    minInterval:1,
                    axisLine: {
                        lineStyle: {
                            color: chartTheme.textColor
                        }
                    },
                    boundaryGap: [0.2, 0.2]
                }
            ],
            series: [
                {
                    name:'故障数',
                    type:'bar',
                    label:　{
                        normal: {
                            show: false,
                            position: 'inside',
                            formatter: function (params) {
                                console.log(params);
                                if(Number(params.value) > 0){
                                    return params.value;
                                }else{
                                    return '';
                                }
                            }
                        }
                    },
                    barMaxWidth: '30px',
                    // barMinHeight: 5,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var index = params.dataIndex % chartTheme.activeCustom.length;
                                return chartTheme.activeCustom[index]
                            }
                        }
                    },
                    data:(function (){
                        var res = [];
                        var len = 0;
                        while (len < 7) {
                            res.push((Math.random()*200).toFixed(1) - 0);
                            len++;
                        }
                        return res;
                    })()
                }
            ]
        },
    }
};
var timeChartConfig = {
    timeMap: {},
    timeData: '',
    timeOption: {},
    baseOption: {
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            showTitle: false,
            orient: 'vertical',
            left: 'right',
            top: 'top',
            feature: {
                saveAsImage: {
                    backgroundColor: chartTheme.imgBg,
                    title: '保存',
                    icon: chartIcon.download
                },
                myTool: {
                    show: true,
                    title: '筛选',
                    icon: chartIcon.select,
                    onclick: function (res) {
                        console.log(res);
                    }
                }
            },
            iconStyle: {
                borderColor: chartTheme.textColor
            }
        },
        legend: {
            data:['故障数', '故障平均数'],
            backgroundColor: '#001635',
            textStyle: {
                color: chartTheme.textColor
            }
        },
        grid: {
            top: '16%',
            bottom: '28%',
            right: '15%'
        },
        timeline: {
            axisType: 'category',
            realtime: true,
            symbolSize: 8,
            lineStyle: {
                color: chartTheme.textColor,
            },
            label: {
                color: chartTheme.textColor,
            },
            controlStyle: {
                showPlayBtn: false,
                color: chartTheme.textColor,
                itemSize: 14
            },
            checkpointStyle: {
                symbolSize: 10
            },
            data: ['2018']
        },
        dataZoom: {
            show: true,
            type: 'inside',
            start: 0,
            end: 100
        },
        xAxis: [
            {
                type: 'category',
                name: '时间',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: chartTheme.bgLineColor
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: chartTheme.textColor
                    }
                },
                axisLabel: {
                    rotate: 10
                },
                boundaryGap: true,

            }
        ],
        yAxis: [
            {
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: chartTheme.bgLineColor
                    }
                },
                scale: true,
                splitNumber: 11,
                minInterval:1,
                name: '故障数/个',
                axisLine: {
                    lineStyle: {
                        color: chartTheme.lineColor1
                    }
                },
                boundaryGap: [0.2, 0.2]
            },
            {
                type: 'value',
                scale: true,
                name: '故障平均数',
                splitNumber: 11,
                minInterval:1,
                splitLine: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: chartTheme.lineColor2
                    }
                },
                boundaryGap: [0.2, 0.2]
            }
        ],
        series: [
            {
                name:'故障数',
                type:'line',
                lineStyle: {
                    color: chartTheme.lineColor1
                },
                label:　{
                    normal: {
                        show: true,
                        position: 'top'
                    }
                }
            },
            {
                name:'故障平均数',
                type:'line',
                yAxisIndex: 1,
                minInterval:1,
                label:　{
                    normal: {
                        show: true,
                        position: 'bottom'
                    }
                },
                lineStyle: {
                    color: chartTheme.lineColor2
                }
            }
        ]
    },
    timeConfig: {
        quarter: ['春季','夏季','秋季','冬季'],
        month: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
    },
};
//分类
var classType = [
    {
        label: '故障信息号',
        key: 'flt_code'
    },
    {
        label: '产品编号',
        key: 'wea_batchNum'
    },
    {
        label: '故障时间',
        key: 'flt_time'
    },
    {
        label: '故障地点',
        key: 'flt_position'
    },
    {
        label: '试验阶段',
        key: 'flt_testStage'
    },
    {
        label: '专业类别',
        key: 'flt_majorType'
    },
    {
        label: '设备名称',
        key: 'equ_name'
    },
    {
        label: '故障部位',
        key: 'flt_component'
    },
    {
        label: '故障器件',
        key: 'flt_appliance'
    },
    {
        label: '器件类别',
        key: 'flt_applianceType'
    },
    {
        label: '器件编号',
        key: 'flt_applianceCode'
    },
    {
        label: '物理类别',
        key: 'flt_type'
    },
    {
        label: '原因类别',
        key: 'flt_reasonType'
    },
    {
        label: '故障模式',
        key: 'flt_mode'
    }
];


var columns = ['flt_code','flt_time','flt_position','flt_testStage','flt_majorType','equ_name','flt_component','flt_appliance','flt_type','flt_reasonType','flt_state'];
//左右echart图表配置
var chartConfig = {
    physics: {
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            showTitle: false,
            orient: 'vertical',
            left: 'right',
            top: 'top',
            feature: {
                saveAsImage: {
                    backgroundColor: chartTheme.imgBg,
                    icon: chartIcon.download
                }
            },
            iconStyle: {
                borderColor: chartTheme.textColor
            }
        },
        grid: {
            top: '16%',
            left: '12%',
            bottom: '12%',
            right: '15%'
        },
        dataZoom: {
            show: true,
            type: 'inside',
            start: 0,
            end: 100
        },
        yAxis: [
            {
                splitLine: {show: true},
                type: 'category',
                name: '物理类别',
                scale: true,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: chartTheme.bgLineColor
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: chartTheme.textColor
                    }
                },
                axisLabel: {
                    show: true,
                    formatter: function (params) {
                        var newParams = [];
                        var screenNum = 3;
                        var rowNum = Math.ceil(params.length / screenNum);
                        if(params.length > screenNum) {
                            for(var i = 0; i < rowNum; i++) {
                                var tempStr = '';
                                var start = i * screenNum;
                                var end = start + screenNum;
                                if(i == rowNum - 1){
                                    tempStr = params.substring(start, params.length);
                                }else{
                                    tempStr = params.substring(start, end) + '\n';
                                }
                                newParams += tempStr;
                            }
                        }else{
                            newParams = params;
                        }
                        return newParams;
                    }
                },
                boundaryGap: true,
                data:  ['A','B','C','D','E','F','G']
            }
        ],
        xAxis: [
            {
                type: 'value',
                scale: true,
                name: '故障数',
                max: 200,
                min: 0,
                minInterval:1,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: chartTheme.bgLineColor
                    }
                },
                splitNumber: 11,
                axisLine: {
                    lineStyle: {
                        color: chartTheme.textColor
                    }
                },
                boundaryGap: [0.2, 0.2]
            }
        ],
        series: [
            {
                name:'故障数',
                type:'bar',
                label:　{
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: '{b}-{c}'
                    }
                },
                barMinHeight: 1,
                barMaxWidth: '30px',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var index = params.dataIndex % chartTheme.physicsList.length;
                            return chartTheme.physicsList[index]
                        }
                    }
                },
                data:(function (){
                    var res = [];
                    var len = 0;
                    while (len < 7) {
                        res.push((Math.random()*200).toFixed(1) - 0);
                        len++;
                    }
                    return res;
                })()
            }
        ]
    },
    reason: {
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            showTitle: false,
            orient: 'vertical',
            left: 'right',
            top: 'top',
            feature: {
                saveAsImage: {
                    backgroundColor: chartTheme.imgBg,
                    icon: chartIcon.download
                }
            },
            iconStyle: {
                borderColor: chartTheme.textColor
            }
        },
        grid: {
            top: '14%',
            bottom: '18%',
            right: '12%'
        },
        dataZoom: {
            show: true,
            type: 'inside',
            start: 0,
            end: 100
        },
        xAxis: [
            {
                splitLine: {show: true},
                type: 'category',
                name: '原因\n类别',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: chartTheme.bgLineColor
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: chartTheme.textColor
                    }
                },
                axisLabel: {
                    formatter: function (params) {
                        var newParams = [];
                        var screenNum = 2;
                        var rowNum = Math.ceil(params.length / screenNum);
                        if(params.length > screenNum) {
                            for(var i = 0; i < rowNum; i++) {
                                var tempStr = '';
                                var start = i * screenNum;
                                var end = start + screenNum;
                                params = params.replace(/\s/g, '');
                                if(i == rowNum - 1){
                                    tempStr = params.substring(start, params.length);
                                }else{
                                    tempStr = params.substring(start, end) + '\n';
                                }
                                newParams += tempStr;
                            }
                        }else{
                            newParams = params;
                        }
                        return newParams;
                    }
                },
                boundaryGap: true,
                data:  (function (){
                    var res = [];
                    var len = 1;
                    while (len < 15) {
                        res.push(len++);
                    }
                    return res;
                })()
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                name: '故障数/个',
                max: 200,
                min: 0,
                minInterval:1,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: chartTheme.bgLineColor
                    }
                },
                splitNumber: 11,
                axisLine: {
                    lineStyle: {
                        color: chartTheme.textColor
                    }
                },
                boundaryGap: [0.2, 0.2]
            }
        ],
        series: [
            {
                name:'故障数',
                type:'bar',
                label:　{
                    normal: {
                        show: true,
                        position: 'top',
                        // formatter: function (parame) {
                        //     var tempStr = '';
                        //     var n = 0, end;
                        //     var split = 2;
                        //     parame.name = parame.name.replace(/\s/g,'');
                        //     while (n <= parame.name.length){
                        //         end = n + split;
                        //         if(end >= parame.name.length){
                        //             tempStr += parame.name.substring(n,parame.name.length);
                        //         }else{
                        //             tempStr += parame.name.substring(n,end) + '\n';
                        //         }
                        //         n += split;
                        //     };
                        //     return tempStr + '\n' + parame.value;
                        // }
                    }
                },
                barMaxWidth: '30px',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var index = params.dataIndex % chartTheme.reasonList.length;
                            return chartTheme.reasonList[index]
                        }
                    }
                },
                data:(function (){
                    var res = [];
                    var len = 0;
                    while (len < 15) {
                        res.push((Math.random()*200).toFixed(1) - 0);
                        len++;
                    }
                    return res;
                })()
            }
        ]
    },
    equipment: {
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            showTitle: false,
            orient: 'vertical',
            left: 'right',
            top: 'top',
            feature: {
                saveAsImage: {
                    backgroundColor: chartTheme.imgBg,
                    icon: chartIcon.download
                }
            },
            iconStyle: {
                borderColor: chartTheme.textColor
            }
        },
        grid: {
            top: '14%',
            bottom: '18%',
            right: '12%'
        },
        dataZoom: {
            show: true,
            type: 'inside',
            start: 0,
            end: 100
        },
        xAxis: [
            {
                splitLine: {show: true},
                type: 'category',
                name: '设备',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: chartTheme.bgLineColor
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: chartTheme.textColor
                    }
                },
                axisLabel: {
                    formatter: function (params) {
                        var newParams = [];
                        var screenNum = 2;
                        var rowNum = Math.ceil(params.length / screenNum);
                        if(params.length > screenNum) {
                            for(var i = 0; i < rowNum; i++) {
                                var tempStr = '';
                                var start = i * screenNum;
                                var end = start + screenNum;
                                if(i == rowNum - 1){
                                    tempStr = params.substring(start, params.length);
                                }else{
                                    tempStr = params.substring(start, end) + '\n';
                                }
                                newParams += tempStr;
                            }
                        }else{
                            newParams = params;
                        }
                        return newParams;
                    }
                },
                boundaryGap: true,
                data: ['电动机','油缸','液压马达','液压附件','控件结构件','轴承','传感器']
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                name: '故障数/个',
                max: 200,
                min: 0,
                minInterval:1,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: chartTheme.bgLineColor
                    }
                },
                splitNumber: 11,
                axisLine: {
                    lineStyle: {
                        color: chartTheme.textColor
                    }
                },
                boundaryGap: [0.2, 0.2]
            }
        ],
        series: [
            {
                name:'故障数',
                type:'bar',
                label:　{
                    normal: {
                        show: true,
                        position: 'top',
                        // formatter: function (parame) {
                        //     var tempStr = '';
                        //     var n = 0, end;
                        //     var split = 2;
                        //     parame.name = parame.name.replace(/\s/g,'');
                        //     while (n <= parame.name.length){
                        //         end = n + split;
                        //         if(end >= parame.name.length){
                        //             tempStr += parame.name.substring(n,parame.name.length);
                        //         }else{
                        //             tempStr += parame.name.substring(n,end) + '\n';
                        //         }
                        //         n += split;
                        //     };
                        //     return tempStr + '\n' + parame.value;
                        // }
                    }
                },
                barMaxWidth: '30px',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var index = params.dataIndex % chartTheme.equipmentList.length;
                            return chartTheme.equipmentList[index]
                        }
                    }
                },
                data:(function (){
                    var res = [];
                    var len = 0;
                    while (len < 15) {
                        res.push((Math.random()*200).toFixed(1) - 0);
                        len++;
                    }
                    return res;
                })()
            }
        ]
    },
    major: {
        grid: {
            top: '14%',
            bottom: '20%',
            right: '12%',
            containLabel: false
        },
        toolbox: {
            show: true,
            showTitle: false,
            orient: 'vertical',
            left: 'right',
            top: 'top',
            feature: {
                saveAsImage: {
                    backgroundColor: chartTheme.imgBg,
                    icon: chartIcon.download
                }
            },
            iconStyle: {
                borderColor: chartTheme.textColor
            }
        },
        //信息提示
        tooltip: {
            trigger: 'item',   //触发元素  数据点触发
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: chartTheme.pieColor,
        series: [
            {
                name:'故障数',
                type:'pie',
                radius: [0, '80%'],   //半径
                center: ['50%', '50%'],   //中心点
                label: {
                    normal: {
                        position: 'inner',
                        // formatter: '{b}: {@c}({d}%)',
                    }
                },
                // //标签线
                // labelLine: {
                //     normal: {
                //         show: true
                //     }
                // },
                // data: pieData.slice(0, 10)
            }
        ]
    }
};
