import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from '../Spinner'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {
  tokenSelector,
  depthChartSelector
} from '../../store/selectors'

am4core.useTheme(am4themes_animated);

class DepthChart extends Component {
  componentDidMount() {
      this.chart = this.props.showChart ? buildChart(this.props) : null;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  componentDidUpdate(oldProps) {
    if (!this.props.showChart) {
        return;
    }

    if ((oldProps.token === null && this.props.token !== null)
        || ( oldProps.token !== null && this.props.token !== null && JSON.stringify(oldProps.token.symbol) !== JSON.stringify(this.props.token.symbol))) {
        if (this.chart) {
          this.chart.dispose();
        }
        this.chart = buildChart(this.props);
        return;
    }

    if(JSON.stringify(oldProps.data) !== JSON.stringify(this.props.data)) {
        this.chart.data = this.props.data;
        return;
    }
  }

  render() {
    return (
        <div>
            { this.props.showChart ? <div id="chartdiv" style={{ width: "100%", height: "300px" }} /> : <Spinner type="div" /> }
        </div>
    )
  }
}

function buildChart(props) {
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.data = props.data;

    // Set up precision for numbers
    chart.numberFormatter.numberFormat = "#,###.####";

    // Create axes
    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = "value";
    xAxis.renderer.minGridDistance = 50;
    xAxis.title.text = `Price (ETH/${props.token.symbol})`;
    xAxis.renderer.labels.template.fill = am4core.color("#111");
    xAxis.title.fill = am4core.color("#111");

    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.title.text = `${props.token.symbol} Volume`;
    yAxis.renderer.labels.template.fill = am4core.color("#111");
    yAxis.title.fill = am4core.color("#111");

    // Create bid value series
    let bidValueSeries = chart.series.push(new am4charts.StepLineSeries());
    bidValueSeries.dataFields.categoryX = "value";
    bidValueSeries.dataFields.valueY = "bidtotalvolume";
    bidValueSeries.strokeWidth = 2;
    bidValueSeries.stroke = am4core.color("#0f0");
    bidValueSeries.fill = bidValueSeries.stroke;
    bidValueSeries.fillOpacity = 0.1;
    bidValueSeries.tooltipText = "Bid: [bold]{categoryX}[/]\nTotal volume: [bold]{valueY}[/]\nVolume: [bold]{bidvolume}[/]"

    // Create ask value series
    let askValueSeries = chart.series.push(new am4charts.StepLineSeries());
    askValueSeries.dataFields.categoryX = "value";
    askValueSeries.dataFields.valueY = "asktotalvolume";
    askValueSeries.strokeWidth = 2;
    askValueSeries.stroke = am4core.color("#f00");
    askValueSeries.fill = askValueSeries.stroke;
    askValueSeries.fillOpacity = 0.1;
    askValueSeries.tooltipText = "Ask: [bold]{categoryX}[/]\nTotal volume: [bold]{valueY}[/]\nVolume: [bold]{askvolume}[/]"

    // Create bid volume series
    let bidVolumeSeries = chart.series.push(new am4charts.ColumnSeries());
    bidVolumeSeries.dataFields.categoryX = "value";
    bidVolumeSeries.dataFields.valueY = "bidvolume";
    bidVolumeSeries.strokeWidth = 0;
    bidVolumeSeries.fill = am4core.color("#aaa");
    bidVolumeSeries.fillOpacity = 0.2;

    // Create ask volume series
    let askVolumeSeries = chart.series.push(new am4charts.ColumnSeries());
    askVolumeSeries.dataFields.categoryX = "value";
    askVolumeSeries.dataFields.valueY = "askvolume";
    askVolumeSeries.strokeWidth = 0;
    askVolumeSeries.fill = am4core.color("#aaa");
    askVolumeSeries.fillOpacity = 0.2;

    // Add cursor
    chart.cursor = new am4charts.XYCursor();

    return chart;
}

function mapStateToProps(state) {
    const token = tokenSelector(state)
    const depthChart = depthChartSelector(state)
    const showChart = token !== null && depthChart !== null && depthChart.orders !== undefined

  return {
    showChart: showChart,
    token: token,
    data: showChart ? depthChart.orders : []
  }
}

export default connect(mapStateToProps)(DepthChart)
