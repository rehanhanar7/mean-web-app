import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';

export const mainRoutes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    data: { title: 'AWS APP' },
    pathMatch: 'full'
  }
];

export const mainRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(mainRoutes);