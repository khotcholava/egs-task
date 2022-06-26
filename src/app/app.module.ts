import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSliderModule} from '@angular/material/slider';
import {LoginComponent} from './components/login/login.component';
import {MatCardModule} from '@angular/material/card';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {fakeBackendProvider} from './fake-server/fake-backend';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatListModule} from '@angular/material/list';
import {HomeComponent} from './components/home/home.component';
import {ErrorInterceptor, JwtInterceptor} from './interceptors';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {TodoTableComponent} from './components/todo-table/todo-table.component';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TodoAddComponent} from './components/dialog/todo-add/todo-add.component';
import {SharedModule} from './shared/shared.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TodoTableComponent,
    TodoAddComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    MatButtonModule,
    HttpClientModule,
    MatListModule,
    RouterModule.forRoot(routes),
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
  ],
  providers: [
    fakeBackendProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
