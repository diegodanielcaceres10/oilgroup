import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
        path: "", component: ArticlesComponent, children: [
            {
                path: ":page", canActivate: [AdminAuthGuard], component: ListComponent,
            },
            {
                path: "marcas/:page", canActivate: [AdminAuthGuard], component: BrandsComponent,
            },
            {
                path: "categorias/:page", canActivate: [AdminAuthGuard], component: CategoriesComponent,
            },
            {
                path: "precios/:page", component: PricesComponent,
            },
            {
                path: "stock/:page", component: StockComponent,
            },
            {
                path: "nuevo/1", canActivate: [AdminAuthGuard], component: ArticleComponent,
            },
            {
                path: ":id/:page", canActivate: [AdminAuthGuard], component: ArticleComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArticlesRoutingModule { }
