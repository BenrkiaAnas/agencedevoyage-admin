import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {LogModel} from '../../modeles/log.model';
import {LogService} from '../../service/log.service';


@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  roles = localStorage.getItem('roles');
  role: string;
  public loading = false;
  @ViewChild('filter') filter: ElementRef;

  paginator;

  @ViewChild(MatPaginator) set contentPag(content: ElementRef) {
    this.paginator = content;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  sort;

  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  displayedColumns: string[] = ['action', 'admin', 'date'];
  dataSource: MatTableDataSource<LogModel>;

  constructor(private logService: LogService) {
    this.loading = true;
    this.dataSource = new MatTableDataSource<LogModel>();
  }

  ngOnInit() {
    this.getroles();
    this.getAllLogs();
  }

  getroles() {
    if (this.roles === 'Super-Admin') {
      this.role = 'sa';
    } else {
      this.role = 'a';
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllLogs() {
    this.loading = true;
    this.logService.getLogs().subscribe((data) => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(data.data);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
      this.loading = false;
    });
  }
}
