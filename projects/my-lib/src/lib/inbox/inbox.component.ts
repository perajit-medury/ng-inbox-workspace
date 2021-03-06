import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { InboxService } from '../inbox.service';
import { Mail } from '../mail.model';

@Component({
  selector: 'my-lib-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss', '../styles.scss']
})
export class InboxComponent implements OnInit, OnDestroy {

  @Input() apiEndpoint: string;
  @Output() mailClick: EventEmitter<any> = new EventEmitter();
  @Output() mailSelectionChange: EventEmitter<any> = new EventEmitter();
  @Output() mailAction: EventEmitter<any> = new EventEmitter();
  @ViewChild('listHolder') listHolder;

  readonly listPlaceholders = {
    EMPTY: 'You have no inbox email.',
    ERROR: 'Unable to load your inbox email.'
  };

  mailList: Mail[];
  private mailListStatus: ResponseStatus;
  private mailListSubscription: Subscription;

  private _isFilterEnabled: boolean;
  inputFilter: string;
  appliedFilter: string;

  constructor(
    private inboxService: InboxService
  ) { }

  get listPlaceholder(): string {
    if (this.mailListStatus === 'SUCCESSS') {
      return this.listPlaceholders.EMPTY;
    }

    if (this.mailListStatus === 'ERROR') {
      return this.listPlaceholders.ERROR;
    }

    return null;
  }

  get isLoading(): boolean {
    return this.mailListStatus === 'LOADING';
  }

  get isFilterEnabled(): boolean {
    return this._isFilterEnabled;
  }

  set isFilterEnabled(value: boolean) {
    this._isFilterEnabled = value;

    if (!value) {
      this.inputFilter = null;
      this.appliedFilter = null;
    }
  }

  ngOnInit(): void {
    this.mailListStatus = 'LOADING';
    this.mailListSubscription = this.inboxService.fetchMailList(this.apiEndpoint).subscribe(
      (list) => {
        this.mailListStatus = 'SUCCESSS';
        this.mailList = list;
      },
      (error: Error) => {
        this.mailListStatus = 'ERROR';
      }
    );
  }

  ngOnDestroy(): void {
    this.mailListSubscription.unsubscribe();
  }

  filterMailList() {
    this.appliedFilter = this.inputFilter;
  }

}

type ResponseStatus = 'SUCCESSS' | 'ERROR' | 'LOADING';
