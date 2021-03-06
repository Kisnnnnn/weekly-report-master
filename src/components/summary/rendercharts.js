// import echarts from 'echarts';
import echarts from 'echarts/lib/echarts';
/* global require */
require('echarts/lib/chart/bar');
require('echarts/lib/component/grid');
require('echarts/lib/component/title');
require('echarts/lib/component/tooltip');
// 处理为需要的数据格式
let prepareDataForCharts = function (data) {
  // 个人数据
  let person = {
      name: [],
      rate: []
    },
    _group = {},
    // 小组
    group = {
      name: [],
      rate: [],
      num: []
    };

  // 小组统计数据
  let grouparr = [],
    groupvalarr = [];

  data.forEach(item => {
    if (!item.show) return;
    // 得到个人数据
    person.name.push(item.username + (item.extInfo ? '(' + item.extInfo + ')' : ''));
    person.rate.push(item.saturation);

    // 分离出小组
    if (item.groupName) {
      if (!_group[item.groupName]) {
        _group[item.groupName] = [item.saturation];
      } else {
        _group[item.groupName].push(item.saturation);
      }
    }
  });

  // 统计小组数据
  for (let key in _group) {
    if (_group.hasOwnProperty(key)) {
      group.name.push(key);
      group.num.push(_group[key].length);
      // 求和并处以数组长度
      group.rate.push(
        _group[key].reduce(function (pre, cur) {
          return pre + cur;
        }) / _group[key].length
      );
    }
  }

  console.log(JSON.stringify(group));

  // 排序
  for (let i = 0; i < group.name.length; i++) {
    switch (group.name[i]) {
      case '项目一组':
        grouparr[0] = (group.name[i] + '(' + (group.num[i] + 1) + '人)');
        groupvalarr[0] = group.rate[i];
        break;
      case '项目二组':
        grouparr[1] = (group.name[i] + '(' + (group.num[i] + 1) + '人)');
        groupvalarr[1] = group.rate[i];
        break;
      case '项目三组':
        grouparr[2] = (group.name[i] + '(' + (group.num[i] + 1) + '人)');
        groupvalarr[2] = group.rate[i];
        break;
      case '项目四组':
        grouparr[3] = (group.name[i] + '(' +( group.num[i] + 1) + '人)');
        groupvalarr[3] = group.rate[i];
        break;
      default:
        break;
    }
  }

  return {
    person: person,
    group: group,
    grouparr: grouparr,
    groupvalarr: groupvalarr
  };
};
// 渲染表格
// chart dom
let comomOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  grid: {
    left: 50,
    right: 20,
    bottom: 80
  },
  toolbox: {},
  xAxis: {
    type: 'category',
    // name: '姓名',
    nameRotate: 10,
    axisTick: {
      alignWithLabel: true //坐标轴刻度与标签对齐
    }
  }
};
// person charts
function renderPerson(person) {
  //按照升序排列数据
  console.log(JSON.stringify(person));
  let personArr = [],
    personRateArr = person.rate,
    personNameArr = person.name;

  for (let i = 0; i < personRateArr.length; i++) {
    personArr.push({
      name: personNameArr[i],
      rate: personRateArr[i]
    });
  }

  personArr.sort(function (x, y) {
    return y.rate - x.rate;
  });

  for (let i = 0; i < personArr.length; i++) {
    personRateArr[i] = personArr[i].rate;
    personNameArr[i] = personArr[i].name;
  }

  let p_opt = Object.assign(JSON.parse(JSON.stringify(comomOptions)), {
    title: {
      text: '成员工作饱和度',
      show: true,
      textStyle: {
        color: '#333',
        fontWeight: 'normal',
        fontSize: 16,
        // fontFamily:'"Helvetica Neue",Helvetica,Tahoma,Arial,"Microsoft Yahei","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif;'
        fontFamily: 'Microsoft Yahei'
      }
    },
    tooltip: {
      formatter: function (data) {
        let item = data instanceof Array ? data[0] : data;
        return (
          item.name +
          '<br/>' +
          item.marker +
          item.seriesName +
          ':' +
          (item.data * 100).toFixed(0) +
          '%'
        );
      }
      // formatter: '{b} <br/> {a} : {c}'
    },
    xAxis: {
      data: person.name,
      axisLabel: {
        interval: 0,
        rotate: 60
      }
    },
    yAxis: {
      axisLabel: {
        // formatter: '{value * 100} %'
        formatter: function (value) {
          return (value * 100).toFixed(0) + '%';
        }
      }
    },
    series: [{
      name: '工作饱和度',
      type: 'bar',
      data: person.rate,
      barMinHeight: 10,
      barMaxWidth: 50,
      label: {
        normal: {
          show: true,
          position: 'top',
          formatter: function (item) {
            return (item.data * 100).toFixed(0) + '%';
          }
        }

        // emphasis: { show: true }
      },
      itemStyle: {
        normal: {
          color: function name(item) {
            let rate = item.data * 100;
            if (rate >= 140) {
              return '#ea644a';
            }
            if (rate > 120) {
              return '#f1a325';
            }
            if (rate > 90) {
              return '#38b03f';
            }
            if (rate >= 70) {
              return '#f1a325';
            } else {
              return '#ea644a';
            }
          }
        }
      }
    }]
  });

  personChart.setOption(p_opt);
}
// group charts
function renderGroup(group, grouparr, groupvalarr) {

  let g_opt = Object.assign(JSON.parse(JSON.stringify(comomOptions)), {
    title: {
      text: '小组平均工作饱和度',
      show: true,
      textStyle: {
        color: '#333',
        fontWeight: 'normal',
        fontSize: 16,
        // fontFamily:'"Helvetica Neue",Helvetica,Tahoma,Arial,"Microsoft Yahei","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif;'
        fontFamily: 'Microsoft Yahei'
      }
    },
    xAxis: {
      data: grouparr
      // name: '小组名称'
    },
    yAxis: {
      axisLabel: {
        // formatter: '{value * 100} %'
        formatter: function (value) {
          return (value * 100).toFixed(0) + '%';
        }
      }
    },
    tooltip: {
      formatter: function (data) {
        // console.log(item);
        let item = data instanceof Array ? data[0] : data;
        return (
          item.name +
          '<br/>' +
          item.marker +
          item.seriesName +
          ':' +
          (item.data * 100).toFixed(0) +
          '%'
        );
      }
      // formatter: '{b} <br/> {a} : {c}'
    },
    series: [{
      name: '小组平均工作饱和度',
      type: 'bar',
      label: {
        normal: {
          show: true,
          position: 'top',
          formatter: function (item) {
            return (item.data * 100).toFixed(0) + '%';
          }
        }
      },
      data: groupvalarr,
      barMinHeight: 10,
      barMaxWidth: 50,
      itemStyle: {
        normal: {
          color: function name(item) {
            let rate = item.data * 100;
            if (rate >= 140) {
              return '#ea644a';
            }
            if (rate > 120) {
              return '#f1a325';
            }
            if (rate > 90) {
              return '#38b03f';
            }
            if (rate >= 70) {
              return '#f1a325';
            } else {
              return '#ea644a';
            }
          }
        }
      }
    }]
  });

  groupChart.setOption(g_opt);
}

// chart
let personChart, groupChart;

export default function (reports, personEl, groupEl) {
  if (!personEl || !groupEl) return;
  let data = prepareDataForCharts(reports);

  personChart = echarts.getInstanceByDom(personEl) || echarts.init(personEl);
  groupChart = echarts.getInstanceByDom(groupEl) || echarts.init(groupEl);
  renderPerson(data.person);
  renderGroup(data.group, data.grouparr, data.groupvalarr);
}
