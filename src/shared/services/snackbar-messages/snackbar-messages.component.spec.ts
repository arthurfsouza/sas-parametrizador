import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarMessagesComponent } from "./snackbar-messages.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('SnackbarMessagesComponent', () => {
    let component: SnackbarMessagesComponent;
    let fixture: ComponentFixture<SnackbarMessagesComponent>;

    const dialogMock = { close: () => { } };

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    SnackbarMessagesComponent
                ],
                imports: [
                    MatDialogModule,
                    BrowserAnimationsModule
                ],
                providers: [
                    { provide: MatDialogTitle, useValue: {} },
                    { provide: MatDialogRef, useValue: dialogMock },
                    { provide: MAT_DIALOG_DATA, useValue: [] }
                ]
            });    

            fixture = TestBed.createComponent(SnackbarMessagesComponent);
            component = fixture.componentInstance;
        })
    );

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('No calls onClose()', async(() => {
        spyOn(component, 'onClose');
        fixture.detectChanges();
        const button = fixture.debugElement.nativeElement.querySelector('#no');
        button.click();
        expect(component.onClose).toHaveBeenCalled();
    }));

    it('dialog should be closed after onClose()', () => {
        let spy = spyOn(component.dialogRef, 'close').and.callThrough();
        component.onClose();
        expect(spy).toHaveBeenCalled();    
    });
});