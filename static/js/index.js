//如果浏览器中有Authrization，则不需要登录直接访问，否则强制登录
if (!localStorage.getItem('Authorization')) {
    location.href = '/static/page/login.html'
}

// 监控区域模块制作
auto_model();


//土地分布统计模块
function land_use(data) {
    // 1. 实例化对象
    let land_num = ``
    let land_area = 0
    let area = function () {
        for (let j = 0; j < data.length; j++) {
            land_area += data[j].value
        }
        return land_area
    }
    // console.log(typeof area());
    land_num += `<div class="item">
                        <h4 id="land_num">${data.length}</h4>
                            <span>
                    <i class="icon-dot" style="color: #ed3f35"></i>土地类型
                  </span>
                  </div>
                 <div class="item">
                            <h4>${area() * 900 / 1000000}</h4>
                            <span>
                    <i class="icon-dot" style="color: #eacf19"></i>流域总面积(Km2)
                  </span>
                        </div>
                        `;
    $("#land").html(land_num);
    let myChart = echarts.init(document.querySelector(".pie"));
    // 2. 指定配置项和数据
    let option = {
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: [
            "#ffce00",
            "#60cda0",
            "#46ff00",
            "#00c2ff",
            "#ff7000",
            // "#9fe6b8",
            // "#32c5e9",
            // "#1d9dff"
        ],
        // 注意颜色写的位置
        series: [
            {
                name: "土地类别",
                type: "pie",
                // 如果radius是百分比则必须加引号
                radius: ["30%", "70%"],
                center: ["50%", "50%"],
                roseType: "radius",
                data: data,
                // 修饰饼形图文字相关的样式 label对象
                label: {
                    fontSize: 14
                },
                // 修饰引导线样式
                labelLine: {
                    // 连接到图形的线长度
                    length: 4,
                    // 连接到文字的线长度
                    length2: 6
                }
            }
        ]
    };

    // 3. 配置项和数据给我们的实例化对象
    myChart.setOption(option, true);
    // 4. 当我们浏览器缩放的时候，图表也等比例缩放
    window.addEventListener("resize", function () {
        // 让我们的图表调用 resize这个方法
        myChart.resize();
    });
}

//点击其他页面时候直接跳转, 发送参数
function open_newlayer() {
    window.open(`/static/page/hot.html?id=${id}`)
}

$("#hot").click(function () {
    open_newlayer();
});

// 降雨柱形图模块
function Precipitation(rain_data) {
    let mouths = []
    let rain_mouths = []
    $.each(rain_data.data, function (i, info) {
        mouths.push(info.mouth + '月')
        rain_mouths.push(info.PRECIPmm)
    })
    // console.log(mouths)
    // 1. 实例化对象
    var myChart = echarts.init(document.querySelector(".bar"));
    // 2. 指定配置和数据
    var option = {
        color: new echarts.graphic.LinearGradient(
            // (x1,y2) 点到点 (x2,y2) 之间进行渐变
            0,
            0,
            0,
            1,
            [
                {offset: 0, color: "#00fffb"}, // 0 起始颜色
                {offset: 1, color: "#0061ce"} // 1 结束颜色
            ]
        ),
        tooltip: {
            trigger: "item"
        },
        grid: {
            left: "0%",
            right: "3%",
            bottom: "3%",
            top: "3%",
            //  图表位置紧贴画布边缘是否显示刻度以及label文字 防止坐标轴标签溢出跟grid 区域有关系
            containLabel: true,
            // 是否显示直角坐标系网格
            show: true,
            //grid 四条边框的颜色
            borderColor: "rgba(0, 240, 255, 0.3)"
        },
        xAxis: [
            {
                name: 'Precipitation',
                type: "category",
                data: mouths,
                axisTick: {
                    alignWithLabel: false,
                    // 把x轴的刻度隐藏起来
                    show: false
                },
                axisLabel: {
                    color: "#4c9bfd",
                },
                // x轴这条线的颜色样式
                axisLine: {
                    lineStyle: {
                        color: "rgba(0, 240, 255, 0.3)"
                        // width: 3
                    }
                }
            }
        ],
        yAxis: [
            {
                name: 'Precipitation',
                type: "value",
                axisTick: {
                    alignWithLabel: false,
                    // 把y轴的刻度隐藏起来
                    show: false
                },
                axisLabel: {
                    color: "#4c9bfd",
                    formatter: '{value} mm'
                },
                // y轴这条线的颜色样式
                axisLine: {
                    lineStyle: {
                        color: "rgba(0, 240, 255, 0.3)"
                        // width: 3
                    }
                },
                // y轴分割线的颜色样式
                splitLine: {
                    lineStyle: {
                        color: "rgba(0, 240, 255, 0.3)"
                    }
                }
            }
        ],
        series: [
            {
                name: "单月总降水",
                type: "bar",
                barWidth: "60%",
                data: rain_mouths
            }
        ]
    };
    // 3. 把配置给实例对象
    myChart.setOption(option, true);
    // 4. 当我们浏览器缩放的时候，图表也等比例缩放
    window.addEventListener("resize", function () {
        // 让我们的图表调用 resize这个方法
        myChart.resize();
    });
}


//实现地图加载
map_model("sha", [118.12, 32.40], 11);

function map_model(root, coordinate, zoom) {
    let menuData = ``;
    menuData += `<div class="map" id="main" style="height: 95%">
                </div>`
    $("#map_chzu").html(menuData);
    var layers = [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),

        new ol.layer.Vector({
            title: 'add Layer',
            source: new ol.source.Vector({
                projection: 'EPSG:4326',
                url: `./map/${root}.json`, //GeoJSON的文件路径，用户可以根据需求而改变
                format: new ol.format.GeoJSON(),
            }),
            style: function (feature, resolution) {
                var name = feature.get('name');
                var color = 'rgba(245,28,181,0.4)';
                var style = getStyle(name, color);
                return style;
            }
        })
    ];
    new ol.Map({
        target: 'main',
        layers: layers,
        view: new ol.View({
            center: ol.proj.fromLonLat(coordinate),
            zoom: zoom
        })
    });
// 获取颜色
    // function getColor(name) {
    //     var color = 'Red';
    //     switch (name) {
    //         case '丽水市':
    //             color = 'Red';
    //             break;
    //         case '杭州市':
    //             color = 'Green';
    //             break;
    //         case '温州市':
    //             color = 'Yellow';
    //             break;
    //         case '宁波市':
    //             color = 'Blue';
    //             break;
    //         case '舟山市':
    //             color = 'Orange';
    //             break;
    //         case '台州市':
    //             color = 'Pink';
    //             break;
    //         case '金华市':
    //             color = 'DodgerBlue';
    //             break;
    //         case '衢州市':
    //             color = 'DarkGoldenRod';
    //             break;
    //         case '绍兴市':
    //             color = 'Plum';
    //             break;
    //         case '嘉兴市':
    //             color = 'Khaki';
    //             break;
    //         case '湖州市':
    //             color = 'Magenta';
    //             break;
    //         default:
    //             color = '#4e98f444';
    //             break;
    //     }
    //     return color;
    // }
    // // 获取样式
    function getStyle(name, color) {

        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({ // 边界样式
                color: color, // 边界颜色
                width: 1 // 边界宽度
            }),
            fill: new ol.style.Fill({ // 填充样式
                color: color // 填充颜色
            }),
            text: new ol.style.Text({ // 文字样式
                text: name, // 文字内容
                font: '15px Calibri,sans-serif', // 字体大小
                stroke: new ol.style.Stroke({ // 文字边界样式
                    color: 'blue', // 文字边界颜色
                    width: 1 // 文字边界宽度
                }),
                fill: new ol.style.Fill({ // 文字填充样式
                    color: 'black' // 文字填充颜色
                })
            })
        });
        return style;
    }

}

//设置雷达图
let data_mouth;
$("#mouth_rch").change(
    function () {
        f($(this).children('option:selected').val())
    }
)
Biomass("menu");

function f(mouth) {
    let data_name = JSON.parse(localStorage.getItem(mouth));
    let indicator_data = []
    let num_data = []
    for (let key in data_name) {
        let dict_data = {}
        dict_data["name"] = key
        dict_data["max"] = 50
        if (data_name[key] > 100) {
            dict_data["max"] = 500
        } else if (data_name[key] > 50) {
            dict_data["max"] = 100
        } else if (data_name[key] < 10) {
            dict_data["max"] = 10
        }
        num_data.push(data_name[key])
        indicator_data.push(dict_data)
    }
    // 1. 实例化对象
    let myChart = echarts.init(document.querySelector(".radar"));
    // 2.指定配置

    let option = {
        tooltip: {
            show: true,
            // 控制提示框组件的显示位置
            position: ["60%", "10%"]
        },
        radar: {
            indicator: indicator_data,
            // 修改雷达图的大小
            radius: "65%",
            shape: "circle",
            // 分割的圆圈个数
            splitNumber: 4,
            name: {
                // 修饰雷达图文字的颜色
                textStyle: {
                    color: "#4c9bfd"
                }
            },
            // 分割的圆圈线条的样式
            splitLine: {
                lineStyle: {
                    color: "rgba(255,255,255, 0.5)"
                }
            },
            splitArea: {
                show: false
            },
            // 坐标轴的线修改为白色半透明
            axisLine: {
                lineStyle: {
                    color: "rgb(255,219,0)"
                }
            }
        },
        series: [
            {
                name: "生化量",
                type: "radar",
                // 填充区域的线条颜色
                lineStyle: {
                    normal: {
                        color: "#fff",
                        width: 1,
                        opacity: 0.5
                    }
                },
                data: [num_data],
                // 设置图形标记 （拐点）
                symbol: "circle",
                // 这个是设置小圆点大小
                symbolSize: 5,
                // 设置小圆点颜色
                itemStyle: {
                    color: "#fff"
                },
                // 让小圆点显示数据
                label: {
                    show: true,
                    fontSize: 10
                },
                // 修饰我们区域填充的背景颜色
                areaStyle: {
                    color: "rgba(238, 197, 102, 0.6)"
                }
            }
        ]
    };
    // 3.把配置和数据给对象
    myChart.setOption(option);
    // 当我们浏览器缩放的时候，图表也等比例缩放
    window.addEventListener("resize", function () {
        // 让我们的图表调用 resize这个方法
        myChart.resize();
    });
}

function Biomass(menu) {
    $.ajax({
        url: `/${menu}/MouOutPut/`,
        type: 'GET',
        headers: {"Authorization": localStorage.getItem('Authorization')},
        success: function (data) {
            $.each(data.data, function (i, obj) {
                // console.log(Object.keys(obj)[0]);
                localStorage.setItem(Object.keys(obj)[0], JSON.stringify(obj[Object.keys(obj)[0]]));
                if (i === 3) {
                    data_mouth = obj;
                    let data_name = data_mouth["4"];
                    let indicator_data = []
                    let num_data = []
                    for (let key in data_name) {
                        let dict_data = {}
                        dict_data["name"] = key
                        dict_data["max"] = 50
                        if (data_name[key] > 100) {
                            dict_data["max"] = 500
                        } else if (data_name[key] > 50) {
                            dict_data["max"] = 100
                        } else if (data_name[key] < 10) {
                            dict_data["max"] = 10
                        }
                        num_data.push(data_name[key])
                        indicator_data.push(dict_data)
                    }
                    // 1. 实例化对象
                    let myChart = echarts.init(document.querySelector(".radar"));
                    // 2.指定配置
                    let option = {
                        tooltip: {
                            show: true,
                            // 控制提示框组件的显示位置
                            position: ["60%", "10%"]
                        },
                        radar: {
                            indicator: indicator_data,
                            // 修改雷达图的大小
                            radius: "65%",
                            shape: "circle",
                            // 分割的圆圈个数
                            splitNumber: 4,
                            name: {
                                // 修饰雷达图文字的颜色
                                textStyle: {
                                    color: "#4c9bfd"
                                }
                            },
                            // 分割的圆圈线条的样式
                            splitLine: {
                                lineStyle: {
                                    color: "rgba(255,255,255, 0.5)"
                                }
                            },
                            splitArea: {
                                show: false
                            },
                            // 坐标轴的线修改为白色半透明
                            axisLine: {
                                lineStyle: {
                                    color: "rgb(255,219,0)"
                                }
                            }
                        },
                        series: [
                            {
                                name: "生化量",
                                type: "radar",
                                // 填充区域的线条颜色
                                lineStyle: {
                                    normal: {
                                        color: "#fff",
                                        width: 1,
                                        opacity: 0.5
                                    }
                                },
                                data: [num_data],
                                // 设置图形标记 （拐点）
                                symbol: "circle",
                                // 这个是设置小圆点大小
                                symbolSize: 5,
                                // 设置小圆点颜色
                                itemStyle: {
                                    color: "#fff"
                                },
                                // 让小圆点显示数据
                                label: {
                                    show: true,
                                    fontSize: 10
                                },
                                // 修饰我们区域填充的背景颜色
                                areaStyle: {
                                    color: "rgba(238, 197, 102, 0.6)"
                                }
                            }
                        ]
                    };
                    // 3.把配置和数据给对象
                    myChart.setOption(option);
                    // 当我们浏览器缩放的时候，图表也等比例缩放
                    window.addEventListener("resize", function () {
                        // 让我们的图表调用 resize这个方法
                        myChart.resize();
                    });
                }

            })
        }
    })
}

//----结束

let data_SURQmm = []
let GW_Qmm = []
let data_pet = []
let data_et = []
let data_2020_cx = []
let data_2010_cx = []
let data_2000_cx = []
let data_2020_shj = []
let data_2010_shj = []
let data_2000_shj = []

$.ajax({
    type: "GET",
    url: `/menu/LandUseView/`,
    async: false,
    headers: {"Authorization": localStorage.getItem('Authorization')},
    success: function (data) {
        let index = 0
        for (let i = 0; i < data.data.length; i++) {
            if (index < 5) {
                data_2000_shj.push(data.data[i])
            } else if (index < 10) {
                data_2010_shj.push(data.data[i])
            } else {
                data_2020_shj.push(data.data[i])
            }
            index += 1
        }
    }
})

function auto_model() {
    $.ajax({
            type: "GET",
            url: "/menu/HruView/",
            headers: {"Authorization": localStorage.getItem('Authorization')},
            success: function (data) {
                if (data.code === 505) {
                    location.href = '/static/page/login.html'
                    return false
                }
                localStorage.setItem('data_sha', JSON.stringify(data.data));
                // 1. 实例化对象
                $.each(data.data, function (i, pet) {
                    data_pet[i] = pet.PETmm;
                    data_et[i] = pet.ETmm;
                    data_SURQmm[i] = pet.SURQmm;
                    GW_Qmm[i] = pet.GW_Qmm;
                });
                let myChart = echarts.init(document.getElementById("Reservoir_name"));
                // 2. 指定配置项和数据
                let option = {
                    title: {
                        // text: 'Rainfall vs Evaporation',
                        subtext: '蒸散发(mm H2O)'
                    },
                    color: [
                        // "#006cff",
                        // "#60cda0",
                        "#ed8884",
                        // "#ff9f7f",
                        // "#0096ff",
                        "#9fe6b8",
                        "#32c5e9",
                        "#1d9dff"
                    ],
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['潜在蒸散发', '实际蒸散发'],
                        textStyle: {
                            color: 'white'          // 图例文字颜色
                        }
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            // saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [

                        {
                            axisLabel: {
                                color: "#4c9bfd"
                            },
                            type: 'category',
                            // prettier-ignore
                            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                        }
                    ],
                    yAxis: [
                        {
                            axisLabel: {
                                color: "#4c9bfd"
                            },
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '潜在蒸散发',
                            type: 'bar',
                            data: data_pet,
                            // color: function (params) {
                            //     // build a color map as your need.
                            //     var colorList = [
                            //         '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                            //         '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                            //         '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                            //     ];
                            //     return colorList[params.dataIndex]
                            // },
                            markPoint: {
                                data: [
                                    {type: 'max', name: 'Max'},
                                    {type: 'min', name: 'Min'}
                                ]
                            },
                            markLine: {
                                data: [{type: 'average', name: 'Avg'}]
                            }
                        },
                        {
                            name: '实际蒸散发',
                            type: 'bar',
                            data: data_et,
                            markPoint: {
                                data: [
                                    {name: 'Max', value: 182.2, xAxis: 7, yAxis: 183},
                                    {name: 'Min', value: 2.3, xAxis: 11, yAxis: 3}
                                ]
                            },
                            markLine: {
                                data: [{type: 'average', name: 'Avg'}]
                            }
                        }
                    ],
                };
                // 3. 配置项和数据给我们的实例化对象
                myChart.setOption(option);
                let right_card = ``;
                // 4. 当我们浏览器缩放的时候，图表也等比例缩放
                right_card += `<div class="item">
                        <h4>${data.data[12].AREA}</h4>
                        <span>
                  <i class="icon-dot" style="color: #ed3f35;"></i>
                  子流域面积(km2)
                </span>
                    </div>
                    <div class="item">
                        <h4>${data.data[12].water_Area}</h4>
                        <span>
                  <i class="icon-dot" style="color: #eacf19;"></i>
                  HRU集水面积(km2)
                </span>
                    </div>`
                $("#water_hru").html(right_card);
            }
        }
    );
    //加载降水量数据Ajax
    $.ajax({
            type: "GET",
            url: "/menu/PrecipitationView/",
            headers: {"Authorization": localStorage.getItem('Authorization')},
            success: function (data) {
                Precipitation(data);
            }
        }
    )

}

let id = 0
$.ajax(
    {
        type: "GET",
        url: '/menu/indexview/',
        data: {"id": 1},
        headers: {"Authorization": localStorage.getItem('Authorization')},
        success: function (data) {
            let information = ``;
            $.each(data.data, function (i, info) {
                id = info.id
                information += `<li>
                        <h4>${info.fields.storage_area}万</h4>
                        <span>
                  <i class="icon-dot" style="color: #006cff"></i>
                  蓄水面积
                </span>
                    </li>
                    <li class="item">
                        <h4>${info.fields.water_level}米</h4>
                        <span>
                  <i class="icon-dot" style="color: #6acca3"></i>
                  水库水位
                </span>
                    </li>
                    <li>
                        <h4>${info.fields.watershed_area}万</h4>
                        <span>
                  <i class="icon-dot" style="color: #6acca3"></i>
                  流域面积
                </span>
                    </li>
                    <li>
                        <h4>${info.fields.irrigation_area}万</h4>
                        <span>
                  <i class="icon-dot" style="color: #ed3f35"></i>
                  灌溉面积
                </span>
                    </li>`
            })
            $("#information").html(information);
            // console.log(id)
        }
    }
)
$("#hls").click(function () {
    $.ajax({
            type: "GET",
            url: '/menu/indexview/',
            data: {"id": 2},
            headers: {"Authorization": localStorage.getItem('Authorization')},
            success: function (data) {
                let information = ``;
                $.each(data.data, function (i, info) {
                    id = info.id

                    information += `<li>
                        <h4>${info.fields.storage_area}万</h4>
                        <span>
                  <i class="icon-dot" style="color: #006cff"></i>
                  蓄水面积
                </span>
                    </li>
                    <li class="item">
                        <h4>${info.fields.water_level}米</h4>
                        <span>
                  <i class="icon-dot" style="color: #6acca3"></i>
                  水库水位
                </span>
                    </li>
                    <li>
                        <h4>${info.fields.watershed_area}万</h4>
                        <span>
                  <i class="icon-dot" style="color: #6acca3"></i>
                  流域面积
                </span>
                    </li>
                    <li>
                        <h4>${info.fields.irrigation_area}万</h4>
                        <span>
                  <i class="icon-dot" style="color: #ed3f35"></i>
                  灌溉面积
                </span>
                    </li>`
                })
                $("#information").html(information);
            }
        }
    )
});
//当切换水库时候动态实现数据切换
$("#name").change(function () {
    // alert($(this).children('option:selected').val());
    if ($(this).children('option:selected').val() === 'shj') {
        location.reload();
        // map_model("sha", [118.12, 32.40], 11);
        // $.ajax({
        //         type: "GET",
        //         url: '/menu/indexview/',
        //         data: {"id": 1},
        //         headers: {"Authorization": localStorage.getItem('Authorization')},
        //         success: function (data) {
        //             let information = ``;
        //             $.each(data.data, function (i, info) {
        //                 id = info.id
        //                 information += `<li>
        //                 <h4>${info.fields.storage_area}万</h4>
        //                 <span>
        //           <i class="icon-dot" style="color: #006cff"></i>
        //           蓄水面积
        //         </span>
        //             </li>
        //             <li class="item">
        //                 <h4>${info.fields.water_level}米</h4>
        //                 <span>
        //           <i class="icon-dot" style="color: #6acca3"></i>
        //           水库水位
        //         </span>
        //             </li>
        //             <li>
        //                 <h4>${info.fields.watershed_area}万</h4>
        //                 <span>
        //           <i class="icon-dot" style="color: #6acca3"></i>
        //           流域面积
        //         </span>
        //             </li>
        //             <li>
        //                 <h4>${info.fields.irrigation_area}万</h4>
        //                 <span>
        //           <i class="icon-dot" style="color: #ed3f35"></i>
        //           灌溉面积
        //         </span>
        //             </li>`
        //             })
        //             $("#information").html(information);
        //         }
        //     }
        // )
        // land_use(data_2000_shj);
        // auto_model();
        // $("#sumyear").change(function () {
        //     // alert($(this).children('option:selected').val());
        //     if ($(this).children('option:selected').val() === '2000') {
        //         land_use(data_2000_shj);
        //     } else if ($(this).children('option:selected').val() === '2010') {
        //         land_use(data_2010_shj);
        //     } else {
        //         land_use(data_2020_shj);
        //     }
        // });
        // Biomass();
        // f("4");
    } else if ($(this).children('option:selected').val() === 'cx') {

        //实现基础信息展示
        //实现地图加载
        map_model("cx", [118.22, 32.30], 12);
        auto_model_cx();
        $.ajax({
                type: "GET",
                url: '/menu/indexview/',
                data: {"id": 3},
                headers: {"Authorization": localStorage.getItem('Authorization')},
                success: function (data) {
                    let information = ``;
                    $.each(data.data, function (i, info) {
                        id = info.id

                        information += `<li>
                        <h4>${info.fields.storage_area}万</h4>
                        <span>
                  <i class="icon-dot" style="color: #006cff"></i>
                  蓄水面积
                </span>
                    </li>
                    <li class="item">
                        <h4>${info.fields.water_level}米</h4>
                        <span>
                  <i class="icon-dot" style="color: #6acca3"></i>
                  水库水位
                </span>
                    </li>
                    <li>
                        <h4>${info.fields.watershed_area}万</h4>
                        <span>
                  <i class="icon-dot" style="color: #6acca3"></i>
                  流域面积
                </span>
                    </li>
                    <li>
                        <h4>${info.fields.irrigation_area}万</h4>
                        <span>
                  <i class="icon-dot" style="color: #ed3f35"></i>
                  灌溉面积
                </span>
                    </li>`
                    })
                    $("#information").html(information);
                }
            }
        )

        function auto_model_cx() {
            $.ajax({
                    type: "GET",
                    url: "/west/HruView/",
                    headers: {"Authorization": localStorage.getItem('Authorization')},
                    success: function (data) {
                        if (data.code === 505) {
                            location.href = '/static/page/login.html'
                            return false
                        }
                        localStorage.setItem('data_cx', JSON.stringify(data.data));
                        // 1. 实例化对象
                        $.each(data.data, function (i, pet) {
                            data_pet[i] = pet.PETmm;
                            data_et[i] = pet.ETmm;
                            data_SURQmm[i] = pet.SURQmm;
                            GW_Qmm[i] = pet.GW_Qmm;
                        });
                        let myChart = echarts.init(document.getElementById("Reservoir_name"));
                        // 2. 指定配置项和数据
                        let option = {
                            title: {
                                // text: 'Rainfall vs Evaporation',
                                subtext: '蒸散发(mm H2O)'
                            },
                            color: [
                                // "#006cff",
                                // "#60cda0",
                                "#ed8884",
                                // "#ff9f7f",
                                // "#0096ff",
                                "#9fe6b8",
                                "#32c5e9",
                                "#1d9dff"
                            ],
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['潜在蒸散发', '实际蒸散发'],
                                textStyle: {
                                    color: 'white'          // 图例文字颜色
                                }
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    dataView: {show: true, readOnly: false},
                                    magicType: {show: true, type: ['line', 'bar']},
                                    restore: {show: true},
                                    // saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            xAxis: [

                                {
                                    axisLabel: {
                                        color: "#4c9bfd"
                                    },
                                    type: 'category',
                                    // prettier-ignore
                                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                                }
                            ],
                            yAxis: [
                                {
                                    axisLabel: {
                                        color: "#4c9bfd"
                                    },
                                    type: 'value'
                                }
                            ],
                            series: [
                                {
                                    name: '潜在蒸散发',
                                    type: 'bar',
                                    data: data_pet,
                                    // color: function (params) {
                                    //     // build a color map as your need.
                                    //     var colorList = [
                                    //         '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                    //         '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                    //         '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                    //     ];
                                    //     return colorList[params.dataIndex]
                                    // },
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: 'Max'},
                                            {type: 'min', name: 'Min'}
                                        ]
                                    },
                                    markLine: {
                                        data: [{type: 'average', name: 'Avg'}]
                                    }
                                },
                                {
                                    name: '实际蒸散发',
                                    type: 'bar',
                                    data: data_et,
                                    markPoint: {
                                        data: [
                                            {name: 'Max', value: 182.2, xAxis: 7, yAxis: 183},
                                            {name: 'Min', value: 2.3, xAxis: 11, yAxis: 3}
                                        ]
                                    },
                                    markLine: {
                                        data: [{type: 'average', name: 'Avg'}]
                                    }
                                }
                            ],
                        };
                        // 3. 配置项和数据给我们的实例化对象
                        myChart.setOption(option);
                        let right_card = ``;
                        // 4. 当我们浏览器缩放的时候，图表也等比例缩放
                        right_card += `<div class="item">
                                <h4>${data.data[12].AREA}</h4>
                                <span>
                          <i class="icon-dot" style="color: #ed3f35;"></i>
                          子流域面积(km2)
                        </span>
                            </div>
                            <div class="item">
                                <h4>${data.data[12].water_Area}</h4>
                                <span>
                          <i class="icon-dot" style="color: #eacf19;"></i>
                          HRU集水面积(km2)
                        </span>
                            </div>`
                        $("#water_hru").html(right_card);
                    }
                }
            );
        }


        let data_sha = JSON.parse(localStorage.getItem("data_cx"));
        right_corner();

        //实现面积等对比
        function right_corner() {
            $("#sub_watershed").click(
                function () {
                    let right_card = ``;
                    $("#sub_watershed").addClass('active');
                    $("#area_sub").removeClass('active');
                    $("#salinity").removeClass('active');
                    $("#Solar").removeClass('active');
                    right_card += `<div class="item">
                        <h4>${data_sha[12].Sub_watershed}</h4>
                        <span>
                  <i class="icon-dot" style="color: #ed3f35;"></i>
                  响应单元数量
                </span>
                    </div>
                    <div class="item">
                        <h4>${data_sha[12].max_Sub_watershed}</h4>
                        <span>
                  <i class="icon-dot" style="color: #eacf19;"></i>
                  最大HRU面积(km2)
                </span>
                    </div>`
                    $("#water_hru").html(right_card);
                }
            );
            $("#area_sub").click(
                function () {
                    let right_card = ``;
                    $("#area_sub").addClass('active');
                    $("#sub_watershed").removeClass('active');
                    $("#Solar").removeClass('active');
                    $("#salinity").removeClass('active');
                    // $.get();
                    right_card += `<div class="item">
                        <h4>${data_sha[12].AREA}</h4>
                        <span>
                  <i class="icon-dot" style="color: #ed3f35;"></i>
                  子流域面积(km2)
                </span>
                    </div>
                    <div class="item">
                        <h4>${data_sha[12].water_Area}</h4>
                        <span>
                  <i class="icon-dot" style="color: #eacf19;"></i>
                  HRU集水面积(km2)
                </span>
                    </div>`
                    $("#water_hru").html(right_card);
                }
            );
            $("#Solar").click(function () {
                let right_card = ``;
                $("#Solar").addClass('active');
                $("#sub_watershed").removeClass('active');
                $("#area_sub").removeClass('active');
                $("#salinity").removeClass('active');
                // $.get();
                right_card += `<div class="item">
                        <h4>${data_sha[12].SOLARmj_m2}</h4>
                        <span>
                  <i class="icon-dot" style="color: #ed3f35;"></i>
                  土壤的平均温度
                </span>
                    </div>
                    <div class="item">
                        <h4>${data_sha[12].SOL_TMP}</h4>
                        <span>
                  <i class="icon-dot" style="color: #eacf19;"></i>
                  太阳辐射值
                </span>
                    </div>`
                $("#water_hru").html(right_card);
            });
            $("#salinity").click(function () {
                let right_card = ``;
                $("#salinity").addClass('active');
                $("#sub_watershed").removeClass('active');
                $("#area_sub").removeClass('active');
                $("#Solar").removeClass('active');
                // $.get();
                right_card += `<div class="item">
                        <h4>${data_sha[12].SOLPkg_ha}</h4>
                        <span>
                  <i class="icon-dot" style="color: #ed3f35;"></i>
                  可溶磷总量
                </span>
                    </div>
                    <div class="item">
                        <h4>${data_sha[12].SEDPkg_ha}</h4>
                        <span>
                  <i class="icon-dot" style="color: #eacf19;"></i>
                  矿物质磷总量
                </span>
                    </div>`
                $("#water_hru").html(right_card);
            });
        }

        //实现土地利用数据动态加载
        land_use(data_2000_cx);
        $("#sumyear").change(function () {
            // alert($(this).children('option:selected').val());
            if ($(this).children('option:selected').val() === '2000') {
                land_use(data_2000_cx);
            } else if ($(this).children('option:selected').val() === '2010') {
                land_use(data_2010_cx);
            } else {
                land_use(data_2020_cx);
            }
        });
        $.ajax({
                type: "GET",
                url: "/west/PrecipitationView/",
                headers: {"Authorization": localStorage.getItem('Authorization')},
                success: function (data) {
                    Precipitation(data);
                }
            }
        )
        NP_model('west');
        Biomass('west');

        //实现雷达图
        $("#mouth_rch").change(
            function () {
                f($(this).children('option:selected').val())
            }
        );
    }
});

//实现城西水库的土地利用变化

//土地类型年份选择异步加载
land_use(data_2000_shj);
$("#sumyear").change(function () {
    // alert($(this).children('option:selected').val());
    if ($(this).children('option:selected').val() === '2000') {
        land_use(data_2000_shj);
    } else if ($(this).children('option:selected').val() === '2010') {
        land_use(data_2010_shj);
    } else {
        land_use(data_2020_shj);
    }
});
landuse_cx();

function landuse_cx() {
    $.ajax({
        type: "GET",
        url: '/west/LandUseView/',
        headers: {"Authorization": localStorage.getItem('Authorization')},
        success: function (data) {
            let index = 0
            for (let i = 0; i < data.data.length; i++) {
                if (index < 5) {
                    data_2000_cx.push(data.data[i])
                } else if (index < 10) {
                    data_2010_cx.push(data.data[i])
                } else {
                    data_2020_cx.push(data.data[i])
                }
                index += 1
            }
        }
    })
}

//结束
//------------

$("#run-off").click(function () {
    console.log(data_SURQmm, GW_Qmm);
    $("#run-off").addClass('active');
    $("#evapotranspiration").removeClass('active');
    let myChart2 = echarts.init(document.getElementById("Reservoir_name"));
    let option2 = {
        title: {
            // text: 'Rainfall vs Evaporation',
            subtext: '蒸散发(mm H2O)'
        },
        color: [
            // "#006cff",
            // "#60cda0",
            "#ed8884",
            // "#ff9f7f",
            // "#0096ff",
            "#9fe6b8",
            "#32c5e9",
            "#1d9dff"
        ],
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['潜在蒸散发', '实际蒸散发'],
            textStyle: {
                color: 'white'          // 图例文字颜色
            }
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                // saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: [

            {
                axisLabel: {
                    color: "#4c9bfd"
                },
                type: 'category',
                // prettier-ignore
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
        ],
        yAxis: [
            {
                axisLabel: {
                    color: "#4c9bfd"
                },
                type: 'value'
            }
        ],
        series: [
            {
                name: '潜在蒸散发',
                type: 'bar',
                data: data_SURQmm,
                // color: function (params) {
                //     // build a color map as your need.
                //     var colorList = [
                //         '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                //         '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                //         '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                //     ];
                //     return colorList[params.dataIndex]
                // },
                markPoint: {
                    data: [
                        {type: 'max', name: 'Max'},
                        {type: 'min', name: 'Min'}
                    ]
                },
                markLine: {
                    data: [{type: 'average', name: 'Avg'}]
                }
            },
            {
                name: '实际蒸散发',
                type: 'bar',
                data: GW_Qmm,
                markPoint: {
                    data: [
                        {name: 'Max', value: 182.2, xAxis: 7, yAxis: 183},
                        {name: 'Min', value: 2.3, xAxis: 11, yAxis: 3}
                    ]
                },
                markLine: {
                    data: [{type: 'average', name: 'Avg'}]
                }
            }
        ],
    };
    myChart2.setOption(option2);
    window.addEventListener("resize", function () {
        // 让我们的图表调用 resize这个方法
        myChart2.resize();
    });
})
$("#evapotranspiration").click(function () {
    console.log(data_SURQmm, GW_Qmm);
    $("#run-off").removeClass('active');
    $("#evapotranspiration").addClass('active');
    let myChart3 = echarts.init(document.getElementById("Reservoir_name"));
    let option3 = {
        title: {
            // text: 'Rainfall vs Evaporation',
            subtext: '蒸散发(mm H2O)'
        },
        color: [
            // "#006cff",
            // "#60cda0",
            "#ed8884",
            // "#ff9f7f",
            // "#0096ff",
            "#9fe6b8",
            "#32c5e9",
            "#1d9dff"
        ],
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['潜在蒸散发', '实际蒸散发'],
            textStyle: {
                color: 'white'          // 图例文字颜色
            }
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                // saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: [

            {
                axisLabel: {
                    color: "#4c9bfd"
                },
                type: 'category',
                // prettier-ignore
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
        ],
        yAxis: [
            {
                axisLabel: {
                    color: "#4c9bfd"
                },
                type: 'value'
            }
        ],
        series: [
            {
                name: '潜在蒸散发',
                type: 'bar',
                data: data_pet,
                // color: function (params) {
                //     // build a color map as your need.
                //     var colorList = [
                //         '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                //         '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                //         '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                //     ];
                //     return colorList[params.dataIndex]
                // },
                markPoint: {
                    data: [
                        {type: 'max', name: 'Max'},
                        {type: 'min', name: 'Min'}
                    ]
                },
                markLine: {
                    data: [{type: 'average', name: 'Avg'}]
                }
            },
            {
                name: '实际蒸散发',
                type: 'bar',
                data: data_et,
                markPoint: {
                    data: [
                        {name: 'Max', value: 182.2, xAxis: 7, yAxis: 183},
                        {name: 'Min', value: 2.3, xAxis: 11, yAxis: 3}
                    ]
                },
                markLine: {
                    data: [{type: 'average', name: 'Avg'}]
                }
            }
        ],
    };
    myChart3.setOption(option3);
    window.addEventListener("resize", function () {
        // 让我们的图表调用 resize这个方法
        myChart3.resize();
    });
})


right_corner();

//子流域展示

let data_sha = JSON.parse(localStorage.getItem("data_sha"));

//实现面积等对比
function right_corner() {
    $("#sub_watershed").click(
        function () {
            let right_card = ``;
            $("#sub_watershed").addClass('active');
            $("#area_sub").removeClass('active');
            $("#salinity").removeClass('active');
            $("#Solar").removeClass('active');
            right_card += `<div class="item">
                        <h4>${data_sha[12].Sub_watershed}</h4>
                        <span>
                  <i class="icon-dot" style="color: #ed3f35;"></i>
                   响应单元数量
                </span>
                    </div>
                    <div class="item">
                        <h4>${data_sha[12].max_Sub_watershed}</h4>
                        <span>
                  <i class="icon-dot" style="color: #eacf19;"></i>
                  最大HRU面积(km2)
                </span>
                    </div>`
            $("#water_hru").html(right_card);
        }
    );
    $("#area_sub").click(
        function () {
            let right_card = ``;
            $("#area_sub").addClass('active');
            $("#sub_watershed").removeClass('active');
            $("#Solar").removeClass('active');
            $("#salinity").removeClass('active');
            // $.get();
            right_card += `<div class="item">
                        <h4>${data_sha[12].AREA}</h4>
                        <span>
                  <i class="icon-dot" style="color: #ed3f35;"></i>
                  子流域面积(km2)
                </span>
                    </div>
                    <div class="item">
                        <h4>${data_sha[12].water_Area}</h4>
                        <span>
                  <i class="icon-dot" style="color: #eacf19;"></i>
                  HRU集水面积(km2)
                </span>
                    </div>`
            $("#water_hru").html(right_card);
        }
    );
    $("#Solar").click(function () {
        let right_card = ``;
        $("#Solar").addClass('active');
        $("#sub_watershed").removeClass('active');
        $("#area_sub").removeClass('active');
        $("#salinity").removeClass('active');
        // $.get();
        right_card += `<div class="item">
                        <h4>${data_sha[12].SOLARmj_m2}</h4>
                        <span>
                  <i class="icon-dot" style="color: #ed3f35;"></i>
                  土壤的平均温度
                </span>
                    </div>
                    <div class="item">
                        <h4>${data_sha[12].SOL_TMP}</h4>
                        <span>
                  <i class="icon-dot" style="color: #eacf19;"></i>
                  太阳辐射值
                </span>
                    </div>`
        $("#water_hru").html(right_card);
    });
    $("#salinity").click(function () {
        let right_card = ``;
        $("#salinity").addClass('active');
        $("#sub_watershed").removeClass('active');
        $("#area_sub").removeClass('active');
        $("#Solar").removeClass('active');
        // $.get();
        right_card += `<div class="item">
                        <h4>${data_sha[12].SOLPkg_ha}</h4>
                        <span>
                  <i class="icon-dot" style="color: #ed3f35;"></i>
                  可溶磷总量
                </span>
                    </div>
                    <div class="item">
                        <h4>${data_sha[12].SEDPkg_ha}</h4>
                        <span>
                  <i class="icon-dot" style="color: #eacf19;"></i>
                  矿物质磷总量
                </span>
                    </div>`
        $("#water_hru").html(right_card);
    });
}

NP_model('menu');

function NP_model(name) {
    let SA_STmm = []
    let SW_ENDmm = []
    let mouths = [];
    let Nitrogen_son = []
    let phosphorus_son = []
    let WYLDmm = []
    let SYLDt_ha = []
    $.ajax({
            type: "GET",
            url: `/${name}/NutrientOut/`,
            headers: {"Authorization": localStorage.getItem('Authorization')},
            success: function (data) {
                $.each(data.data, function (i, obj) {
                    mouths.push(obj.mons + '月')
                    Nitrogen_son.push(obj.ORGNkg_ha);
                    phosphorus_son.push(obj.ORGPkg_ha);
                    SA_STmm.push(obj.SA_STmm);
                    SW_ENDmm.push(obj.SW_ENDmm);
                    WYLDmm.push(obj.WYLDmm);
                    SYLDt_ha.push(obj.SYLDt_ha * 1000);
                })
                Nitrogen_phosphorus();
            }
        }
    )
    $("#np").click(
        function () {
            $("#np").addClass('active');
            $("#water").removeClass('active');
            $("#Sediment_volume").removeClass('active');
            Nitrogen_phosphorus()
        }
    )
    $("#water").click(
        function () {
            $("#np").removeClass('active');
            $("#water").addClass('active');
            $("#Sediment_volume").removeClass('active');
            Water_reserves()
        }
    )
    $("#Sediment_volume").click(
        function () {
            $("#np").removeClass('active');
            $("#water").removeClass('active');
            $("#Sediment_volume").addClass('active');
            Sediment_volume();
        }
    )


// 氮磷输出模块
    function Nitrogen_phosphorus() {
        var output_data = {
            np_data: [
                Nitrogen_son,
                phosphorus_son
            ],
        };
        // 1. 实例化对象
        var myChart = echarts.init(document.querySelector(".line"));
        // 2. 指定配置和数据
        var option = {
            color: ["#00f2f1", "#ed3f35"],
            tooltip: {
                // 通过坐标轴来触发
                trigger: "axis"
            },
            legend: {
                // 距离容器10%
                right: "10%",
                // 修饰图例文字的颜色
                textStyle: {
                    color: "#4c9bfd"
                }
                // 如果series 里面设置了name，此时图例组件的data可以省略
            },
            grid: {
                top: "20%",
                left: "3%",
                right: "4%",
                bottom: "3%",
                show: true,
                borderColor: "#012f4a",
                containLabel: true
            },

            xAxis: {
                type: "category",
                boundaryGap: false,
                data: mouths,
                // 去除刻度
                axisTick: {
                    show: false
                },
                // 修饰刻度标签的颜色
                axisLabel: {
                    color: "#4c9bfd"
                },
                // 去除x坐标轴的颜色
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: "value",
                // 去除刻度
                axisTick: {
                    show: false
                },
                // 修饰刻度标签的颜色
                axisLabel: {
                    color: "#4c9bfd"
                },
                // 修改y轴分割线的颜色
                splitLine: {
                    lineStyle: {
                        color: "#012f4a"
                    }
                }
            },
            series: [
                {
                    name: "有机氮总量(kg)",
                    type: "line",
                    stack: "总量",
                    // 是否让线条圆滑显示
                    smooth: true,
                    data: output_data.np_data[0]
                },
                {
                    name: "有机磷总量(kg)",
                    type: "line",
                    stack: "总量",
                    smooth: true,
                    data: output_data.np_data[1]
                }
            ]
        };
        // 3. 把配置和数据给实例对象
        myChart.setOption(option);
        // 当我们浏览器缩放的时候，图表也等比例缩放
        window.addEventListener("resize", function () {
            // 让我们的图表调用 resize这个方法
            myChart.resize();
        });
    }

//水分输出模块
    function Water_reserves() {
        var output_data2 = {
            Water: [
                SA_STmm,
                SW_ENDmm
            ],
        };
        // 1. 实例化对象
        var myChart2 = echarts.init(document.querySelector(".line"));
        // 2. 指定配置和数据
        var option2 = {
            color: ["#00f2f1", "#ed3f35"],
            tooltip: {
                // 通过坐标轴来触发
                trigger: "axis"
            },
            legend: {
                // 距离容器10%
                right: "10%",
                // 修饰图例文字的颜色
                textStyle: {
                    color: "#4c9bfd"
                }
                // 如果series 里面设置了name，此时图例组件的data可以省略
            },
            grid: {
                top: "20%",
                left: "3%",
                right: "4%",
                bottom: "3%",
                show: true,
                borderColor: "#012f4a",
                containLabel: true
            },

            xAxis: {
                type: "category",
                boundaryGap: false,
                data: mouths,
                // 去除刻度
                axisTick: {
                    show: false
                },
                // 修饰刻度标签的颜色
                axisLabel: {
                    color: "#4c9bfd"
                },
                // 去除x坐标轴的颜色
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: "value",
                // 去除刻度
                axisTick: {
                    show: false
                },
                // 修饰刻度标签的颜色
                axisLabel: {
                    color: "#4c9bfd"
                },
                // 修改y轴分割线的颜色
                splitLine: {
                    lineStyle: {
                        color: "#012f4a"
                    }
                }
            },
            series: [
                {
                    name: "土壤水含量(mm)",
                    type: "line",
                    stack: "总量",
                    // 是否让线条圆滑显示
                    smooth: true,
                    data: output_data2.Water[0]
                },
                {
                    name: "潜水层水储量(mm)",
                    type: "line",
                    stack: "总量",
                    smooth: true,
                    data: output_data2.Water[1]
                }
            ]
        };
        // 3. 把配置和数据给实例对象
        myChart2.setOption(option2);
        // 当我们浏览器缩放的时候，图表也等比例缩放
        window.addEventListener("resize", function () {
            // 让我们的图表调用 resize这个方法
            myChart2.resize();
        });
    }

//总水量和泥沙量
    function Sediment_volume() {
        var output_data2 = {
            Sediment: [
                WYLDmm,
                SYLDt_ha
            ],
        };
        // 1. 实例化对象
        var myChart = echarts.init(document.querySelector(".line"));
        // 2. 指定配置和数据
        var option = {
            color: ["#00f2f1", "#ed3f35"],
            tooltip: {
                // 通过坐标轴来触发
                trigger: "axis"
            },
            legend: {
                // 距离容器10%
                right: "10%",
                // 修饰图例文字的颜色
                textStyle: {
                    color: "#4c9bfd"
                }
                // 如果series 里面设置了name，此时图例组件的data可以省略
            },
            grid: {
                top: "20%",
                left: "3%",
                right: "4%",
                bottom: "3%",
                show: true,
                borderColor: "#012f4a",
                containLabel: true
            },

            xAxis: {
                type: "category",
                boundaryGap: false,
                data: mouths,
                // 去除刻度
                axisTick: {
                    show: false
                },
                // 修饰刻度标签的颜色
                axisLabel: {
                    color: "#4c9bfd"
                },
                // 去除x坐标轴的颜色
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: "value",
                // 去除刻度
                axisTick: {
                    show: false
                },
                // 修饰刻度标签的颜色
                axisLabel: {
                    color: "#4c9bfd"
                },
                // 修改y轴分割线的颜色
                splitLine: {
                    lineStyle: {
                        color: "#012f4a"
                    }
                }
            },
            series: [
                {
                    name: "进入主河道的总水量(mm)",
                    type: "line",
                    stack: "总量",
                    // 是否让线条圆滑显示
                    smooth: true,
                    data: output_data2.Sediment[0]
                },
                {
                    name: "进入主河道的总泥沙量(kg)",
                    type: "line",
                    stack: "总量",
                    smooth: true,
                    data: output_data2.Sediment[1]
                }
            ]
        };
        // 3. 把配置和数据给实例对象
        myChart.setOption(option);
        // 当我们浏览器缩放的时候，图表也等比例缩放
        window.addEventListener("resize", function () {
            // 让我们的图表调用 resize这个方法
            myChart.resize();
        });
    }
}


