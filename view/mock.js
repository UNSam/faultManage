function getNum(m) {
    return Math.floor(Math.random() * m)
}

function getData(n, max, label) {
    var res = [];
    for (var i = 0; i < n; i++) {
        res.push(getNum(max) + label);
    }
    return res;
}

function makeTypeList(n) {
    var res = []
    for (var i = 0; i < getNum(n) + 1; i++) {
        var obj = {
            weaType: '型号' + i,
            shipList: []
        }
        for (var j = 0; j < getNum(4) + 1; j++) {
            var o = {
                weaModelNum: '二级型号' + i,
                ships: []
            }
            for (var k = 0; k < getNum(3) + 1; k++) {
                var s = {
                    flt_shipboardCode: '船' + i,
                }
                o.ships.push(s);
            }
            obj.shipList.push(o);
        }
        res.push(obj);
    }
    return res;
}

function makeTimeData(type) {
    switch (type) {
        case 'quarter':
            return {
                "2017": {
                    "avg": [
                        1,
                        0,
                        0,
                        8
                    ],
                    "num": [
                        1,
                        0,
                        0,
                        32
                    ]
                },
                "2018": {
                    "avg": [
                        13,
                        0,
                        0,
                        0
                    ],
                    "num": [
                        66,
                        0,
                        0,
                        0
                    ]
                },
                "startTime": "2017",
                "endTime": "2018"
            };
        case 'month':
            return {
                "2017": {
                    "avg": [
                        1,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        7
                    ],
                    "num": [
                        1,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        5,
                        27
                    ]
                },
                "2018": {
                    "avg": [
                        8,
                        1,
                        4,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "num": [
                        41,
                        5,
                        20,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                "startTime": "2017",
                "endTime": "2018"
            };
        case 'year':
            return {
                "2017": {
                    "avg": 9,
                    "num": 33
                },
                "2018": {
                    "avg": 13,
                    "num": 66
                },
                "startTime": "2017",
                "endTime": "2018"
            }
    }
}

function makeShips() {
    return [{
            "sysdate": "2019-04-18 14:02:32",
            "flt_shipboardCode": "789船",
            "faultNum": 30,
            "flt_position": "宁德",
            "flt_testStage": "交付使用"
        },
        {
            "sysdate": "2019-04-18 14:02:32",
            "flt_shipboardCode": "345船",
            "faultNum": 5,
            "flt_position": "舟山",
            "flt_testStage": "交付使用"
        },
        {
            "sysdate": "2019-04-18 14:02:32",
            "flt_shipboardCode": "空白",
            "faultNum": 17,
            "flt_position": "舟山",
            "flt_testStage": "交付使用"
        },
        {
            "sysdate": "2019-04-18 14:02:32",
            "flt_shipboardCode": "456船",
            "faultNum": 37,
            "flt_position": "三亚",
            "flt_testStage": "交付使用"
        },
        {
            "sysdate": "2019-04-18 14:02:32",
            "flt_shipboardCode": "123船",
            "faultNum": 10,
            "flt_position": "上海",
            "flt_testStage": "交付使用"
        }
    ]
}

function makePieData(n) {
    var arr = [];
    for (var i = 0; i < n; i++) {
        var obj = {
            name: '类型' + (i + 1),
            value: getNum(30),
            percent: getNum(10)
        };
        arr.push(obj);
    }
    return arr;
}

function makeCenterPIeData() {
    return [{
            "rate": "1.010101%",
            "children": [{
                "rate": "1.010101%",
                "children": [{
                    "rate": "1.010101%",
                    "name": "接线盒航插",
                    "value": 1
                }],
                "name": "航插故障",
                "value": 1
            }],
            "name": "空白",
            "value": 1
        },
        {
            "rate": "60.60606%",
            "children": [{
                    "rate": "22.222221%",
                    "children": [{
                            "rate": "4.040404%",
                            "name": "传感器-压力类",
                            "value": 4
                        },
                        {
                            "rate": "1.010101%",
                            "name": "传感器-发讯器类",
                            "value": 1
                        },
                        {
                            "rate": "1.010101%",
                            "name": "倾角传感器",
                            "value": 1
                        },
                        {
                            "rate": "1.010101%",
                            "name": "压力表",
                            "value": 1
                        },
                        {
                            "rate": "15.151515%",
                            "name": "接近开关",
                            "value": 15
                        }
                    ],
                    "name": "传感器故障",
                    "value": 22
                },
                {
                    "rate": "2.020202%",
                    "children": [{
                            "rate": "1.010101%",
                            "name": "空白",
                            "value": 1
                        },
                        {
                            "rate": "1.010101%",
                            "name": "使用不当",
                            "value": 1
                        }
                    ],
                    "name": "使用不当",
                    "value": 2
                },
                {
                    "rate": "2.020202%",
                    "children": [{
                        "rate": "2.020202%",
                        "name": "液压缸",
                        "value": 2
                    }],
                    "name": "执行机构故障",
                    "value": 2
                },
                {
                    "rate": "2.020202%",
                    "children": [{
                        "rate": "2.020202%",
                        "name": "接线盒",
                        "value": 2
                    }],
                    "name": "接线盒",
                    "value": 2
                },
                {
                    "rate": "6.060606%",
                    "children": [{
                            "rate": "1.010101%",
                            "name": "液压阀块",
                            "value": 1
                        },
                        {
                            "rate": "1.010101%",
                            "name": "阀-单向阀类",
                            "value": 1
                        },
                        {
                            "rate": "2.020202%",
                            "name": "阀-换向阀",
                            "value": 2
                        },
                        {
                            "rate": "2.020202%",
                            "name": "阀-比例方向阀",
                            "value": 2
                        }
                    ],
                    "name": "液压阀故障",
                    "value": 6
                },
                {
                    "rate": "7.070707%",
                    "children": [{
                            "rate": "3.030303%",
                            "name": "接头堵头",
                            "value": 3
                        },
                        {
                            "rate": "4.040404%",
                            "name": "液压管路",
                            "value": 4
                        }
                    ],
                    "name": "管路堵头",
                    "value": 7
                },
                {
                    "rate": "3.030303%",
                    "children": [{
                            "rate": "1.010101%",
                            "name": "空白",
                            "value": 1
                        },
                        {
                            "rate": "2.020202%",
                            "name": "电缆",
                            "value": 2
                        }
                    ],
                    "name": "线缆故障",
                    "value": 3
                },
                {
                    "rate": "15.151515%",
                    "children": [{
                            "rate": "8.080808%",
                            "name": "空白",
                            "value": 8
                        },
                        {
                            "rate": "1.010101%",
                            "name": "插销",
                            "value": 1
                        },
                        {
                            "rate": "3.030303%",
                            "name": "螺纹传动件",
                            "value": 3
                        },
                        {
                            "rate": "2.020202%",
                            "name": "轴",
                            "value": 2
                        },
                        {
                            "rate": "1.010101%",
                            "name": "齿轮传动件",
                            "value": 1
                        }
                    ],
                    "name": "结构件故障",
                    "value": 15
                },
                {
                    "rate": "1.010101%",
                    "children": [{
                        "rate": "1.010101%",
                        "name": "接线盒航插",
                        "value": 1
                    }],
                    "name": "航插故障",
                    "value": 1
                }
            ],
            "name": "设备1",
            "value": 60
        },
        {
            "rate": "9.090909%",
            "children": [{
                    "rate": "5.050505%",
                    "children": [{
                            "rate": "2.020202%",
                            "name": "控制板",
                            "value": 2
                        },
                        {
                            "rate": "3.030303%",
                            "name": "触摸屏",
                            "value": 3
                        }
                    ],
                    "name": "控制模块故障",
                    "value": 5
                },
                {
                    "rate": "2.020202%",
                    "children": [{
                        "rate": "2.020202%",
                        "name": "指示灯",
                        "value": 2
                    }],
                    "name": "电气件故障",
                    "value": 2
                },
                {
                    "rate": "2.020202%",
                    "children": [{
                        "rate": "2.020202%",
                        "name": "机柜航插",
                        "value": 2
                    }],
                    "name": "航插故障",
                    "value": 2
                }
            ],
            "name": "设备2",
            "value": 9
        },
        {
            "rate": "7.070707%",
            "children": [{
                    "rate": "2.020202%",
                    "children": [{
                        "rate": "2.020202%",
                        "name": "热交换器",
                        "value": 2
                    }],
                    "name": "冷却器",
                    "value": 2
                },
                {
                    "rate": "4.040404%",
                    "children": [{
                        "rate": "4.040404%",
                        "name": "液压泵",
                        "value": 4
                    }],
                    "name": "动力器件故障",
                    "value": 4
                },
                {
                    "rate": "1.010101%",
                    "children": [{
                        "rate": "1.010101%",
                        "name": "液压管路",
                        "value": 1
                    }],
                    "name": "管路堵头",
                    "value": 1
                }
            ],
            "name": "设备3",
            "value": 7
        },
        {
            "rate": "2.020202%",
            "children": [{
                "rate": "2.020202%",
                "children": [{
                        "rate": "1.010101%",
                        "name": "空白",
                        "value": 1
                    },
                    {
                        "rate": "1.010101%",
                        "name": "滚轮",
                        "value": 1
                    }
                ],
                "name": "结构件故障",
                "value": 2
            }],
            "name": "设备4",
            "value": 2
        },
        {
            "rate": "20.20202%",
            "children": [{
                    "rate": "4.040404%",
                    "children": [{
                            "rate": "2.020202%",
                            "name": "压力表",
                            "value": 2
                        },
                        {
                            "rate": "1.010101%",
                            "name": "接近开关",
                            "value": 1
                        },
                        {
                            "rate": "1.010101%",
                            "name": "编码器",
                            "value": 1
                        }
                    ],
                    "name": "传感器故障",
                    "value": 4
                },
                {
                    "rate": "2.020202%",
                    "children": [{
                            "rate": "1.010101%",
                            "name": "液压刹车",
                            "value": 1
                        },
                        {
                            "rate": "1.010101%",
                            "name": "液压马达",
                            "value": 1
                        }
                    ],
                    "name": "执行机构故障",
                    "value": 2
                },
                {
                    "rate": "1.010101%",
                    "children": [{
                        "rate": "1.010101%",
                        "name": "按钮",
                        "value": 1
                    }],
                    "name": "按键面板",
                    "value": 1
                },
                {
                    "rate": "1.010101%",
                    "children": [{
                        "rate": "1.010101%",
                        "name": "接线盒",
                        "value": 1
                    }],
                    "name": "接线盒",
                    "value": 1
                },
                {
                    "rate": "3.030303%",
                    "children": [{
                            "rate": "1.010101%",
                            "name": "液压阀块",
                            "value": 1
                        },
                        {
                            "rate": "1.010101%",
                            "name": "阀-换向阀",
                            "value": 1
                        },
                        {
                            "rate": "1.010101%",
                            "name": "阀-比例方向阀",
                            "value": 1
                        }
                    ],
                    "name": "液压阀故障",
                    "value": 3
                },
                {
                    "rate": "9.090909%",
                    "children": [{
                            "rate": "1.010101%",
                            "name": "插销",
                            "value": 1
                        },
                        {
                            "rate": "1.010101%",
                            "name": "滚轮",
                            "value": 1
                        },
                        {
                            "rate": "1.010101%",
                            "name": "结构辅件",
                            "value": 1
                        },
                        {
                            "rate": "2.020202%",
                            "name": "轴",
                            "value": 2
                        },
                        {
                            "rate": "4.040404%",
                            "name": "轴承",
                            "value": 4
                        }
                    ],
                    "name": "结构件故障",
                    "value": 9
                }
            ],
            "name": "设备5",
            "value": 20
        }
    ]
}

function makeChartData() {
    return {
        "sysdate": "2019-04-18 03:36:48",
        "flt_position": {
            "yAxis": [
                "27",
                "25",
                "13",
                "7",
                "6",
                "4",
                "4",
                "4",
                "4",
                "2"
            ],
            "minValue": 2,
            "xAxis": [
                "舟山",
                "三亚",
                "广州",
                "宁德",
                "上海",
                "汕头",
                "山东威海",
                "湛江",
                "青岛",
                "旅顺"
            ],
            "maxValue": 27,
            "rates": [
                "27",
                "25",
                "13",
                "7",
                "6",
                "4",
                "4",
                "4",
                "4",
                "2"
            ],
            "yAxisAvg": []
        },
        "flt_component": {
            "yAxis": [
                "20",
                "15",
                "13",
                "9",
                "2",
                "2",
                "2",
                "2",
                "2",
                "2"
            ],
            "minValue": 2,
            "xAxis": [
                "部位1",
                "部位3",
                "部位2",
                "空白",
                "部位18",
                "部位13",
                "部位14",
                "部位15",
                "部位16",
                "部位17"
            ],
            "maxValue": 20,
            "rates": [
                "20",
                "15",
                "13",
                "9",
                "2",
                "2",
                "2",
                "2",
                "2",
                "2"
            ],
            "yAxisAvg": []
        },
        "flt_testStage": {
            "yAxis": [
                "98",
                "1"
            ],
            "minValue": 1,
            "xAxis": [
                "交付使用",
                "空白"
            ],
            "maxValue": 98,
            "rates": [
                "99",
                "1"
            ],
            "yAxisAvg": []
        },
        "equ_name": {
            "yAxis": [
                "60",
                "20",
                "9",
                "7",
                "2",
                "1"
            ],
            "minValue": 1,
            "xAxis": [
                "设备1",
                "设备5",
                "设备2",
                "设备3",
                "设备4",
                "空白"
            ],
            "maxValue": 60,
            "rates": [
                "61",
                "20",
                "9",
                "7",
                "2",
                "1"
            ],
            "yAxisAvg": []
        }
    }
}