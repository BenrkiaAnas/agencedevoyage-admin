import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthenticationService} from './service/authentication.service';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './modules/login/login/login.component';
import {NavbarComponent} from './share/navbar/navbar.component';
import {SidebarComponent} from './share/sidebar/sidebar.component';
import {NgxLoadingModule} from 'ngx-loading';
import {PasswordService} from './service/password.service';
import {AvatarModule} from 'ngx-avatar';
import {ToastrModule} from 'ngx-toastr';
import {SnackBarAjoutComponent} from './dialogues/snack-bar-ajout/snack-bar-ajout.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoginModule} from './modules/login/login.module';
import 'hammerjs';
import {NgxSpinnerModule} from 'ngx-spinner';
import { LogComponent } from './modules/log/log.component';
import {MaterialModule} from './material/material.module';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import {FooterComponent} from './share/footer/footer.component';

const avatarColors = ['rgb(4, 153, 151)', 'rgb(246, 103, 106)', 'rgb(78, 87, 98)'];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    LoginComponent,
    SnackBarAjoutComponent,
    LogComponent,
    DateAgoPipe,

  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    NoopAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgbModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    AvatarModule.forRoot({
      colors: avatarColors
    }),
    LoginModule,
    RouterModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
    NgxSpinnerModule,
    MaterialModule,
  ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  entryComponents: [SnackBarAjoutComponent],
  providers: [AuthenticationService, PasswordService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
