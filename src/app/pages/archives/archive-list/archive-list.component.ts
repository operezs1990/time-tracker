import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../@core/models/user';
import { Archive } from '../../../@core/models/archive';
import { ArchiveService } from '../../../@core/data/archive.service';
import { UserService } from '../../../@core/data/users.service';
import { ApiResponse } from '../../../@core/models/response';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceComponent } from '../invoice/invoice.component';

@Component({
  selector: 'ngx-archive-list',
  templateUrl: './archive-list.component.html',
  styleUrls: ['./archive-list.component.scss']
})
export class ArchiveListComponent implements OnInit {

  @Output() back = new EventEmitter();
  @Input() user: User;
  archives: Archive[];
  roleName: string;
  selectedOption: string;
  selectedMonth: number;
  selectedYear: number;

  constructor(private archiveService: ArchiveService,
    private userService: UserService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.roleName = this.userService.getDecodedAccessToken().roleName;
    let userId: string = this.userService.getDecodedAccessToken().id;
    if (this.roleName != 'Admin') {      
      this.userService.getUser(userId).subscribe((user: ApiResponse<User>) => {
        this.user = user.data;
      });
    } else {
      userId = this.user.id;
    }
    /*this.archiveService.getArchives(this.user.id).subscribe((archives: ApiResponse<Archive[]>) => {
      this.archives = archives.data;
    });*/
    this.archives = this.archiveService.getArchives(userId);
  }

  showReport(year: number, month: number) {
    this.selectedOption = "report";
    this.selectedYear = year;
    this.selectedMonth = month;
  }

  showInvoice(year: number, month: number) {
    // this.selectedOption = "invoice";
    this.selectedYear = year;
    this.selectedMonth = month;

    const modal: NgbModalRef = this.modalService.open(InvoiceComponent, { size: 'sm', container: 'nb-layout' });
    (<InvoiceComponent>modal.componentInstance).user = this.user;
    (<InvoiceComponent>modal.componentInstance).month = this.selectedMonth;
    (<InvoiceComponent>modal.componentInstance).year = this.selectedYear;
  }

  goBack() {
    if(this.selectedOption) {
      this.selectedOption = null;
    } else {
      this.back.emit();
    }
  }

}