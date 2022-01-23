//如果浏览器中有Authrization，则不需要登录直接访问，否则强制登录
if (!localStorage.getItem('Authorization')) {
    location.href = '/static/page/login.html'
}
//获取参数的方法， 实现本地跳转

parame_get();

function parame_get() {
    let request = {
        QueryString: function (val) {
            let reg = new RegExp("(^|&)" + val + "=([^&]*)(&|$)");
            let result = window.location.search.substr(1).match(reg);
            return result ? decodeURIComponent(result[2]) : null;
        }
    };
    let id = request.QueryString("id");
    $("#hot_href").click(function () {
        $("#hot_href").attr("href", `/static/page/hot.html?id=${id}`)
    })
    if (id == '1') {
        shj();
    } else if (id == '3') {
        cx();
    }
}

function shj() {
    //实现流入河段的平均每日径流和流出河段的平均每日径流
// FLOW_function();
//设置打开json文件路径
    let url = ""
    let dt = []
    let area_sub = []
    let name_sub = []

//实现沙河集子流域划分，自动化加载地图

    Auto_maps();

    function Auto_maps() {
        $.ajax({
                type: "GET",
                url: '/menu/SubViewJuly/',
                headers: {"Authorization": localStorage.getItem('Authorization')},
                success: function (data) {
                    if (data.code === 505) {
                        location.href = '/static/page/login.html'
                        return false
                    }
                    $.each(data.data, function (i, obj) {
                        dt[i] = obj;
                        area_sub.push(obj.value);
                        name_sub.push(obj.name);
                    })
                    console.log(dt);
                    Area_statistics();
                }
            }
        )
    }


    let SUB_Array = []
    let FLOW_IN = []
    let FLOW_OUT = []
    let ORGN_IN = []
    let ORGN_OUTkg = []
    let MONS = []

//获取不同化学物质函数

    function auto_flow() {
        $.ajax({
                type: "GET",
                url: '/menu/RchView/',
                headers: {"Authorization": localStorage.getItem('Authorization')},
                success: function (data) {
                    $.each(data.data, function (i, flow_obj) {
                        // 1. 实例化对象
                        SUB_Array.push(flow_obj.SUB);
                        FLOW_IN.push(flow_obj.FLOW_INcms);
                        FLOW_OUT.push(flow_obj.FLOW_OUTcms);
                        ORGN_IN.push(flow_obj.ORGN_INkg);
                        ORGN_OUTkg.push(flow_obj.ORGN_OUTkg);
                    })
                }
            }
        );
    }

    auto_flow();

//面积统计雨量图图
    function Area_statistics() {
        let option1 = {
            title: {
                textStyle: {
                    color: 'red'          // 图例文字颜色
                },
                text: '子流域范围',
                // subtext: '子流域',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                type: 'cross',
                // backgroundColor:"#ff7f50",//提示标签背景颜色
                //  textStyle:{color:"#fff"}, //提示标签字体颜色
                //  formatter:function(param){
                //     return dt[param.dataIndex].name + "<br />" +dt[param.dataIndex].text;
                // }
                alwaysShowContent: false,
                bordeRadius: 4,
                borderWidth: 2,
                borderColor: 'rgba(0,0,0,0.2)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: 0,
                // position: "top",
                textStyle: {
                    fontSize: 14,
                    color: '#333'
                },
                formatter: function (params) {
                    // console.log(params);
                    var color = "#f30505";
                    var a = "<div style='background-color:" + color + ";padding: 5px 10px;text-align:center;color:white;font-size: 16px;'>" + dt[params.dataIndex].name + "</div>";
                    // var num = Math.ceil(params.data.name.length*10[0] / 10);
                    // console.log(params.data.name);
                    a += "<div style='padding:3px;'>";
                    for (var i = 0; i < 1; i++) {
                        a += dt[params.dataIndex].text + "<br>";
                        // console.log(dt[params.dataIndex].text);
                    }
                    a += "</div>";
                    return a;
                }
            },
            visualMap: {
                textStyle: {
                    color: 'white'          // 图例文字颜色
                },
                min: 1,
                max: 11,
                text: ['High', 'Low'],
                x: 'left',
                y: 'center',
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['lightskyblue', 'yellow', 'orangered'],
                    symbolSize: [30, 100]
                }
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                borderColor: '#FFF',       // 工具箱边框颜色
                borderWidth: 0,            // 工具箱边框线宽，单位px，默认为0（无边框）
                padding: 5,                // 工具箱内边距，单位px，默认各方向内边距为5，
                showTitle: false,
                feature: {
                    saveAsImage: {
                        show: true,
                        title: '保存为图片',
                        type: 'jpeg'
                    },
                    restore: {show: true},
                }
            },
            series: [{
                name: '长三角',
                type: 'map',
                map: 'cs',
                // symbol:'../images/shine.jpg',
                //  symbolSize: 41,
                roam: true,
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },

                layoutCenter: ['50%', '50%'],   //属性定义地图中心在屏幕中的位置，一般结合layoutSize 定义地图的大小
                //            layoutSize: 11200,
                itemStyle: {
                    normal: {label: {show: true}},
                    emphasis: {label: {show: true}}
                },
                data: dt
            }]
        };
        $.get('../map/Watershed_sha.json', function (csJson) {
            echarts.registerMap('cs', csJson);
            let chart1 = echarts.init(document.getElementById('map'));
            chart1.setOption(option1);

        });
        let myChart = echarts.init(document.getElementById("RCH1"));
        // 2.指定配置
        let option = {
            color: [
                // "#006cff",
                // "#60cda0",
                // "#e301f5",
                // "#ff9f7f",
                // "#0096ff",
                // "#00fa5c",
                "#ffdc00",
                "#1d9dff"
            ],
            title: {
                text: '子流域面积',
                left: 'center',
                textStyle: {
                    color: '#1d9dff'          // 图例文字颜色
                }
            },
            grid: {
                bottom: 80
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#505765'
                    }
                }
            },
            legend: {
                data: ['Area'],
                left: 10,
                textStyle: {
                    color: 'red'          // 图例文字颜色
                }
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 85
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 0,
                    end: 85
                }
            ],
            xAxis: [
                {
                    axisLabel: {
                        color: "#4c9bfd"
                    },
                    type: 'category',
                    boundaryGap: false,
                    // axisLine: {onZero: false},
                    // prettier-ignore
                    data: name_sub,
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff' //更改坐标轴颜色
                        }
                    }
                }
            ],
            yAxis: [
                {
                    axisLabel: {
                        color: "#4c9bfd"
                    },
                    name: 'Area(km^2)',
                    type: 'value',
                    max: 30,
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff' //更改坐标轴颜色
                        }
                    }
                }
            ],
            series: [
                {
                    name: '面积',
                    type: 'line',
                    areaStyle: {},
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            opacity: 0.3
                        }
                    },
                    // prettier-ignore
                    data: area_sub
                }
            ]
        };
        // 3.把配置和数据给对象
        myChart.setOption(option, true);
        // 当我们浏览器缩放的时候，图表也等比例缩放
        window.addEventListener("resize", function () {
            // 让我们的图表调用 resize这个方法
            myChart.resize();
        });
    }

    function FLOW_function() {
        let myChart = echarts.init(document.getElementById("RCH1"));
        // 2.指定配置
        let option = {
            color: [
                // "#006cff",
                // "#60cda0",
                "#e301f5",
                // "#ff9f7f",
                // "#0096ff",
                "#00fa5c",
                "#32c5e9",
                "#1d9dff"
            ],
            grid: {
                bottom: 80
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#505765'
                    }
                }
            },
            legend: {
                data: ['流入每日径流', '流出每日径流'],
                // left: 10,
                textStyle: {
                    color: 'red'          // 图例文字颜色
                }
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 20,
                    end: 85
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 20,
                    end: 85
                }
            ],
            xAxis: [
                {
                    axisLabel: {
                        color: "#4c9bfd"
                    },
                    show: true,
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {onZero: false},
                    // prettier-ignore
                    data: SUB_Array
                }
            ],
            yAxis: [
                {
                    axisLabel: {
                        textStyle: {
                            // color: '#c3dbff',  //更改坐标轴文字颜色
                            fontSize: 14      //更改坐标轴文字大小
                        },
                        color: "#4c9bfd"
                    },
                    name: 'Flow in(m^3/s)',
                    type: 'value',
                    max: 15,
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff' //更改坐标轴颜色
                        }
                    }
                },
                {
                    axisLabel: {

                        color: "#4c9bfd"
                    },
                    name: 'Flow out(m^3/s)',
                    nameLocation: 'start',
                    max: 15,
                    type: 'value',
                    inverse: true,
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff' //更改坐标轴颜色
                        }
                    },
                }
            ],
            series: [
                {
                    name: '流入河段的平均每日径流',
                    type: 'line',
                    areaStyle: {},
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            opacity: 0.3
                        },
                    },
                    // prettier-ignore
                    data: FLOW_IN
                },
                {
                    name: '流出河段的平均每日径流',
                    type: 'line',
                    yAxisIndex: 1,
                    areaStyle: {},
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            opacity: 0.3
                        },
                    },
                    // prettier-ignore
                    data: FLOW_OUT
                }
            ]
        };
        // 3.把配置和数据给对象
        myChart.setOption(option, true);
        // 当我们浏览器缩放的时候，图表也等比例缩放
        window.addEventListener("resize", function () {
            // 让我们的图表调用 resize这个方法
            myChart.resize();
        });
    }

    $("#three").change(function () {
        // alert($(this).children('option:selected').val());
        if ($(this).children('option:selected').val() === 'watershed_area') {
            Area_statistics();
        } else if ($(this).children('option:selected').val() === 'watershed_flow') {
            Thermodynamic_chart();
        } else if ($(this).children('option:selected').val() === 'Nitrogen_phosphorus') {
            Nitrogen_output();
        }
    });


//热力图统计
    function Thermodynamic_chart() {
        url = "../map/kongzhidian.json"
        FLOW_function();
        let chart = ``
        chart += `
                <h3>热力图分析</h3>
                <div class="chart" id="map" style="width: 600px; height:550px;">
                <form style="position: absolute;left: 200px;z-index: 999;color: blue;" id="form_data">
                                                <label>半径大小</label>
                                                <input id="radius" type="range" min="1" max="50" step="1" value="20"/>
                                                <label>模糊大小</label>
                                                <input id="blur" type="range" min="1" max="50" step="1" value="25"/>
                                            </form>
                                            <script type="text/javascript">
                                        map(url);
                            </script>
                </div>`
        $("#reli").html(chart);
    }

//设置氮磷输出
//氮磷热力图显示
    function Nitrogen_output() {
        url = "../map/NP_points.json"
        let myChart = echarts.init(document.getElementById("RCH1"));
        // 2.指定配置
        let option = {
            color: [
                // "#006cff",
                "#60cda0",
                // "#e301f5",
                "#ff9f7f",
                // "#0096ff",
                // "#00fa5c",
                // "#32c5e9",
                // "#1d9dff"
            ],
            grid: {
                bottom: 80
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#505765'
                    }
                }
            },
            legend: {
                data: ['进入河段的有机氮', '流出河段的有机氮'],
                // left: 10,
                textStyle: {
                    color: 'red'          // 图例文字颜色
                }
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 20,
                    end: 85
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 20,
                    end: 85
                }
            ],
            xAxis: [
                {
                    axisLabel: {
                        color: "#4c9bfd"
                    },
                    show: true,
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {onZero: false},
                    // prettier-ignore
                    data: SUB_Array
                }
            ],
            yAxis: [
                {
                    axisLabel: {
                        textStyle: {
                            // color: '#c3dbff',  //更改坐标轴文字颜色
                            fontSize: 14      //更改坐标轴文字大小
                        },
                        color: "#4c9bfd"
                    },
                    name: 'ORGN_IN(kg N)',
                    type: 'value',
                    max: 100000,
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff' //更改坐标轴颜色
                        }
                    }
                },
                {
                    axisLabel: {

                        color: "#4c9bfd"
                    },
                    name: 'ORGN_OUT(kg N)',
                    nameLocation: 'start',
                    max: 100000,
                    type: 'value',
                    inverse: true,
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff' //更改坐标轴颜色
                        }
                    },
                }
            ],
            series: [
                {
                    name: '流入河段的平均每日径流',
                    type: 'line',
                    areaStyle: {},
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            opacity: 0.3
                        },
                    },
                    // prettier-ignore
                    data: ORGN_IN
                },
                {
                    name: '流出河段的平均每日径流',
                    type: 'line',
                    yAxisIndex: 1,
                    areaStyle: {},
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            opacity: 0.3
                        },
                    },
                    // prettier-ignore
                    data: ORGN_OUTkg
                }
            ]
        };
        // 3.把配置和数据给对象
        myChart.setOption(option, true);
        // 当我们浏览器缩放的时候，图表也等比例缩放
        window.addEventListener("resize", function () {
            // 让我们的图表调用 resize这个方法
            myChart.resize();
        });
        let chart = ``
        chart += `
                <h3>热力图分析</h3>
                <div class="chart" id="map" style="width: 600px; height:550px;">
                <form style="position: absolute;left: 200px;z-index: 999;color: blue;" id="form_data">
                                                <label>半径大小</label>
                                                <input id="radius" type="range" min="1" max="50" step="1" value="20"/>
                                                <label>模糊大小</label>
                                                <input id="blur" type="range" min="1" max="50" step="1" value="25"/>
                                            </form>
                                            <script type="text/javascript">
                                        map(url);
                            </script>
                </div>`
        $("#reli").html(chart);
    }
}

function cx() {
    //实现流入河段的平均每日径流和流出河段的平均每日径流
// FLOW_function();
//设置打开json文件路径
    let url_cx = ""
    let dt_cx = []
    let area_sub_cx = []
    let name_sub_cx = []

//实现沙河集子流域划分，自动化加载地图

    Auto_maps();

    function Auto_maps() {
        $.ajax({
                type: "GET",
                url: '/west/SubViewJuly/',
                headers: {"Authorization": localStorage.getItem('Authorization')},
                success: function (data) {
                    if (data.code === 505) {
                        location.href = '/static/page/login.html'
                        return false
                    }
                    $.each(data.data, function (i, obj) {
                        dt_cx[i] = obj;
                        area_sub_cx.push(obj.value);
                        name_sub_cx.push(obj.name);
                    })
                    console.log(dt_cx);
                    Area_statistics();
                }
            }
        )
    }

    //面积统计雨量图图
    function Area_statistics() {
        let option1 = {
            title: {
                textStyle: {
                    color: 'red'          // 图例文字颜色
                },
                text: '子流域范围',
                // subtext: '子流域',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                type: 'cross',
                // backgroundColor:"#ff7f50",//提示标签背景颜色
                //  textStyle:{color:"#fff"}, //提示标签字体颜色
                //  formatter:function(param){
                //     return dt[param.dataIndex].name + "<br />" +dt[param.dataIndex].text;
                // }
                alwaysShowContent: false,
                bordeRadius: 4,
                borderWidth: 2,
                borderColor: 'rgba(0,0,0,0.2)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: 0,
                // position: "top",
                textStyle: {
                    fontSize: 14,
                    color: '#333'
                },
                formatter: function (params) {
                    // console.log(params);
                    var color = "#f30505";
                    var a = "<div style='background-color:" + color + ";padding: 5px 10px;text-align:center;color:white;font-size: 16px;'>" + dt[params.dataIndex].name + "</div>";
                    // var num = Math.ceil(params.data.name.length*10[0] / 10);
                    // console.log(params.data.name);
                    a += "<div style='padding:3px;'>";
                    for (var i = 0; i < 1; i++) {
                        a += dt[params.dataIndex].text + "<br>";
                        // console.log(dt[params.dataIndex].text);
                    }
                    a += "</div>";
                    return a;
                }
            },
            visualMap: {
                textStyle: {
                    color: 'white'          // 图例文字颜色
                },
                min: 1,
                max: 11,
                text: ['High', 'Low'],
                x: 'left',
                y: 'center',
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['lightskyblue', 'yellow', 'orangered'],
                    symbolSize: [30, 100]
                }
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                borderColor: '#FFF',       // 工具箱边框颜色
                borderWidth: 0,            // 工具箱边框线宽，单位px，默认为0（无边框）
                padding: 5,                // 工具箱内边距，单位px，默认各方向内边距为5，
                showTitle: false,
                feature: {
                    saveAsImage: {
                        show: true,
                        title: '保存为图片',
                        type: 'jpeg'
                    },
                    restore: {show: true},
                }
            },
            series: [{
                name: '长三角',
                type: 'map',
                map: 'cs',
                // symbol:'../images/shine.jpg',
                //  symbolSize: 41,
                roam: true,
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },

                layoutCenter: ['50%', '50%'],   //属性定义地图中心在屏幕中的位置，一般结合layoutSize 定义地图的大小
                //            layoutSize: 11200,
                itemStyle: {
                    normal: {label: {show: true}},
                    emphasis: {label: {show: true}}
                },
                data: dt_cx
            }]
        };
        $.get('../map/cx_watershed.json', function (csJson) {
            echarts.registerMap('cs', csJson);
            let chart1 = echarts.init(document.getElementById('map'));
            chart1.setOption(option1);

        });
        let myChart = echarts.init(document.getElementById("RCH1"));
        // 2.指定配置
        let option = {
            color: [
                // "#006cff",
                // "#60cda0",
                // "#e301f5",
                // "#ff9f7f",
                // "#0096ff",
                // "#00fa5c",
                "#ffdc00",
                "#1d9dff"
            ],
            title: {
                text: '子流域面积',
                left: 'center',
                textStyle: {
                    color: '#1d9dff'          // 图例文字颜色
                }
            },
            grid: {
                bottom: 80
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#505765'
                    }
                }
            },
            legend: {
                data: ['Area'],
                left: 10,
                textStyle: {
                    color: 'red'          // 图例文字颜色
                }
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 85
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 0,
                    end: 85
                }
            ],
            xAxis: [
                {
                    axisLabel: {
                        color: "#4c9bfd"
                    },
                    type: 'category',
                    boundaryGap: false,
                    // axisLine: {onZero: false},
                    // prettier-ignore
                    data: name_sub_cx,
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff' //更改坐标轴颜色
                        }
                    }
                }
            ],
            yAxis: [
                {
                    axisLabel: {
                        color: "#4c9bfd"
                    },
                    name: 'Area(km^2)',
                    type: 'value',
                    max: 30,
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff' //更改坐标轴颜色
                        }
                    }
                }
            ],
            series: [
                {
                    name: '面积',
                    type: 'line',
                    areaStyle: {},
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            opacity: 0.3
                        }
                    },
                    // prettier-ignore
                    data: area_sub_cx
                }
            ]
        };
        // 3.把配置和数据给对象
        myChart.setOption(option, true);
        // 当我们浏览器缩放的时候，图表也等比例缩放
        window.addEventListener("resize", function () {
            // 让我们的图表调用 resize这个方法
            myChart.resize();
        });
    }
}