import { Component, ViewEncapsulation, ViewChild ,OnInit} from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
} from 'ng-apexcharts';

import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DashboardService } from 'src/app/services/DashboardService/Dashboard-Service';

interface month {
  value: string;
  viewValue: string;
}

export interface salesOverviewChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}




export interface productsData {
  id: number;
  imagePath: string;
  uname: string;
  position: string;
  productName: string;
  budget: number;
  priority: string;
}



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppDashboardComponent implements OnInit {

  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public salesOverviewChart: salesOverviewChart ;
  
  TotalProducts : any;
  TotalEmployees : any;
  TotalCustomers : any;
  TotalDepartments : any;

  displayedColumns: string[] = ['assigned', 'name', 'priority', 'budget'];
  dataSource: MatTableDataSource<any>;
  dataObs$: Observable<any>;

  tableData = [
    {
      id: 1,
      imagePath: 'assets/images/profile/user-1.jpg',
      uname: 'Sunil Joshi',
      position: 'Web Designer',
      productName: 'Elite Admin',
      budget: 3.9,
      priority: 'low',
    },
    {
      id: 2,
      imagePath: 'assets/images/profile/user-2.jpg',
      uname: 'Andrew McDownland',
      position: 'Project Manager',
      productName: 'Real Homes Theme',
      budget: 24.5,
      priority: 'medium',
    },
    {
      id: 3,
      imagePath: 'assets/images/profile/user-3.jpg',
      uname: 'Christopher Jamil',
      position: 'Project Manager',
      productName: 'MedicalPro Theme',
      budget: 12.8,
      priority: 'high',
    },
    {
      id: 4,
      imagePath: 'assets/images/profile/user-4.jpg',
      uname: 'Nirav Joshi',
      position: 'Frontend Engineer',
      productName: 'Hosting Press HTML',
      budget: 2.4,
      priority: 'critical',
    },
    {
      id: 5,
      imagePath: 'assets/images/profile/user-4.jpg',
      uname: 'Nirav Joshi',
      position: 'Frontend Engineer',
      productName: 'Hosting Press HTML',
      budget: 2.4,
      priority: 'critical',
    },
    {
      id: 6,
      imagePath: 'assets/images/profile/user-4.jpg',
      uname: 'Nirav Joshi',
      position: 'Frontend Engineer',
      productName: 'Hosting Press HTML',
      budget: 2.4,
      priority: 'critical',
    },
  ];

  constructor(private DasboardService : DashboardService) {

    this.salesOverviewChart = {
      series: [
        {
          name: 'Employees',
          data: [],
          color: '#5D87FF',
        },
        {
          name: 'Customers',
          data: [],
          color: '#49BEFF',
        },
        {
          name: 'ProductRevenue',
          data: [],
          color: '#49BEFF',
        },
      ],

      grid: {
        borderColor: 'rgba(0,0,0,0.1)',
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      plotOptions: {
        bar: { horizontal: false, columnWidth: '35%', borderRadius: 4 },
      },
      chart: {
        type: 'bar',
        height: 390,
        offsetX: -15,
        toolbar: { show: true },
        foreColor: '#adb0bb',
        fontFamily: 'inherit',
        sparkline: { enabled: false },
      },
      dataLabels: { enabled: false },
      marker: { size: 0 },
      legend: { show: false },
      xaxis: {
        type: 'category',
        categories: [],
        labels: {
          style: { cssClass: 'grey--text lighten-2--text fill-color' },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        tickAmount: 4,
        labels: {
          style: {
            cssClass: 'grey--text lighten-2--text fill-color',
          },
        },
      },
      stroke: {
        show: true,
        width: 3,
        lineCap: 'butt',
        colors: ['transparent'],
      },
      tooltip: { theme: 'light' },

    };
   }

  ngOnInit() 
  {
    this.TotalCount(); 
    this.loadData();
    this.setPagination(this.tableData);
  } 

  TotalCount() 
  {
    this.DasboardService.getAllCount().subscribe(
      {
        next: (response : any) => {
          const responseData = response.data;
          this.TotalProducts = responseData.Products;
          this.TotalEmployees = responseData.Employees;
          this.TotalCustomers = responseData.Customers;
          this.TotalDepartments = responseData.Departments;
        },
        error: (error : any) => {
          console.error(error);
        }
      }
    );
  }
  
 
  loadData()
   {
    this.DasboardService.getChartDetails().subscribe(
      {
      next : (response: any) => {
        
        const data = response.data;
        console.log(this.salesOverviewChart.xaxis.categories);
        const productNames = data.map((product: any) => product.productName);
        const employeeCounts = data.map((product: any) => product.employeeCount);
        const customerCounts = data.map((product: any) => product.customerCount);
        const productRevenue = data.map((product: any) => product.productRevenue);

        // console.log(productNames);
        // console.log(employeeCounts);
        // console.log(customerCounts);
        // console.log(productRevenue);
        
        this.salesOverviewChart.xaxis.categories = productNames;
        this.salesOverviewChart.series[0].data = employeeCounts;
        this.salesOverviewChart.series[1].data = customerCounts;
        this.salesOverviewChart.series[2].data = productRevenue;
        
        console.log(this.salesOverviewChart.xaxis.categories);

      },
      error: (error : any) => {
        console.error(error);
      }
    });
  }

  setPagination(tableData : any) 
  {
    this.dataSource = new MatTableDataSource<any>(tableData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
  }  
}
