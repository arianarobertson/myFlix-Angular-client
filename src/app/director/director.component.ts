import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.scss']
})
/**
 * Component to display director details in a dialog
 */
export class DirectorComponent implements OnInit {

  /**
   * Creates an instance of DirectorComponent
   * @param data The data passed to the dialog, containing director details such as name, bio, birth date, and death date
   * @param dialog The MatDialog instance to manage the dialog
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { name: string, bio: string, birth: any, death: any },
    public dialogRef: MatDialogRef<DirectorComponent>) { }

  ngOnInit(): void {

  }

  closeMessageBox(): void {
    this.dialogRef.close();
  }

}