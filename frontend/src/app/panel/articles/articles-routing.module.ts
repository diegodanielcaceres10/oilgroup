import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../_shared/auth/auth.guard';
import { AdminAuthGuard } from '../../_shared/auth/admin-auth.guard';

import { ArticlesComponent } from './articles.component';
import { ListComponent } from './list/list.component';
import { BrandsComponent } from './brands/brands.component';
import { CategoriesComponent } from './categories/categories.component';
import { PricesComponent } from './prices/prices.component';
import { StockComponent } from './stock/stock.component';
import { ArticleComponent } from './article/article.component';

const routes: Routes = [
    {
        path: "", component: ArticlesComponent, canActivate: [AuthGuard], children: [
            {
                path: ":page", component: ListComponent, canActivate: [AdminAuthGuard],
            },
            {
                path: "marcas/:page", component: BrandsComponent, canActivate: [AdminAuthGuard],
            },
            {
                path: "categorias/:page", component: CategoriesComponent, canActivate: [AdminAuthGuard],
            },
            {
                path: "precios/:page", component: PricesComponent, canActivate: [AuthGuard],
            },
            {
                path: "stock/:page", component: StockComponent, canActivate: [AuthGuard],
            },
            {
                path: "nuevo/1", component: ArticleComponent, canActivate: [AdminAuthGuard],
            },
            {
                path: ":id/:page", component: ArticleComponent, canActivate: [AdminAuthGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArticlesRoutingModule { }
