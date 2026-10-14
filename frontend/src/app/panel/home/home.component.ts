import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_shared/service/auth.service';
import { MetricService } from '../../_shared/service/metric.service';
import { NavService } from '../../_shared/service/nav.service';
import { HeaderService } from '../../_shared/service/header.service';
import { LoadService } from '../../_shared/service/load.service';

/* AM Charts */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    standalone: false
})
export class HomeComponent implements OnInit {

    charts: any = {}
    metrics: any = {}
    access: any = {}

    constructor(
        private AuthService: AuthService,
        private MetricService: MetricService,
        private NavService: NavService,
        private HeaderService: HeaderService,
        private LoadService: LoadService,
    ) { }

    ngOnInit(): void {
        try {
            this.LoadService.change(true)
            setTimeout(() => {
                this.NavService.page({ page: "home", subpage: "home" })
            }, 0)
            this.access = this.AuthService.getUser();
            if (this.access.license && this.access.license.active) {
                this.getData();
            } else {
                this.LoadService.change(false)
            }
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    async getData() {
        try {
            const user = ["Super Administrador"].indexOf(this.access.role) == -1 ? this.access.username : ""
            await this.MetricService.getAll({ user: user }).then((res: any) => {
                if (res.status == "success") {
                    this.charts = res.data
                } else {
                    console.error("Response:", res.status)
                    this.HeaderService.showError("Error al encontrar las metricas!")
                    this.LoadService.change(false)
                }
            }).catch((e) => {
                console.error("Error", e)
                this.HeaderService.showError("Error en la conectividad")
                this.LoadService.change(false)
            })
            if (["Super Administrador", "Administrador"].indexOf(this.access.role) > -1) {
                await this.MetricService.getAllExtend().then((res: any) => {
                    if (res.status == "success") {
                        this.metrics = res.data
                    } else {
                        console.error("Response:", res.status)
                        this.HeaderService.showError("Error al encontrar las metricas!")
                        this.LoadService.change(false)
                    }
                }).catch((e) => {
                    console.error("Error", e)
                    this.HeaderService.showError("Error en la conectividad")
                    this.LoadService.change(false)
                })
            }
            this.LoadService.change(false)
            setTimeout(() => {
                if (this.charts.sales && this.charts.sales.length > 0) this.lineChart(this.charts.sales, "sales-chart")
                if (this.charts.payments && this.charts.payments.length > 0) this.lineChart(this.charts.payments, "payments-chart")
                if (this.charts.documents && this.charts.documents.length > 0) this.pieChart(this.charts.documents, "documents-chart")
                if (this.charts.methods && this.charts.methods.length > 0) this.pieChart(this.charts.methods, "methods-chart")
                if (this.metrics.articles && this.metrics.articles.length > 0) this.lineChart(this.metrics.articles, "articles-chart")
                if (this.metrics.brands && this.metrics.brands.length > 0) this.lineChart(this.metrics.brands, "brands-chart")
                if (this.metrics.categories && this.metrics.categories.length > 0) this.lineChart(this.metrics.categories, "categories-chart")
                if (this.metrics.customers && this.metrics.customers.length > 0) this.lineChart(this.metrics.customers, "customers-chart")
                if (this.metrics.providers && this.metrics.providers.length > 0) this.lineChart(this.metrics.providers, "providers-chart")
            }, 100)
        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    pieChart(data, id) {
        try {
            am4core.useTheme(am4themes_dataviz);
            am4core.useTheme(am4themes_animated);

            // Create chart instance
            let chart = am4core.create(id, am4charts.PieChart);
            chart.data = data;

            // Set inner radius
            chart.innerRadius = am4core.percent(35);

            // Add and configure Series
            let pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = "total";
            pieSeries.dataFields.category = "type";
            pieSeries.slices.template.stroke = am4core.color("#fff");

            // This creates initial animation
            pieSeries.hiddenState.properties.opacity = 1;
            pieSeries.hiddenState.properties.endAngle = -90;
            pieSeries.hiddenState.properties.startAngle = -90;

            pieSeries.labels.template.disabled = true;
            chart.legend = new am4charts.Legend();


        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

    lineChart(data, id) {
        try {
            am4core.useTheme(am4themes_dataviz);
            am4core.useTheme(am4themes_animated);

            // Create chart instance
            let chart = am4core.create(id, am4charts.XYChart);
            chart.data = data;

            // Create axes
            let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "item";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;
            categoryAxis.renderer.height = 150;
            categoryAxis.renderer.labels.template.horizontalCenter = "right";
            categoryAxis.renderer.labels.template.verticalCenter = "middle";
            categoryAxis.renderer.labels.template.rotation = 270;
            categoryAxis.renderer.labels.template.maxWidth = 150;
            categoryAxis.renderer.labels.template.wrap = true;
            categoryAxis.renderer.labels.template.textAlign = "end";

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

            // Create series
            let series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = "total";
            series.dataFields.categoryX = "item";
            series.columns.template.tooltipText = "{categoryX}: [bold]${valueY}[/]";
            series.columns.template.fillOpacity = .8;

            // value config
            let valueLabel = series.bullets.push(new am4charts.LabelBullet());
            valueLabel.label.text = "$ [bold]{valueY}[/]";
            valueLabel.label.dy = -8;
            chart.maskBullets = false;

        } catch (e) {
            console.error("Error", e)
            this.LoadService.change(false)
        }
    }

}
