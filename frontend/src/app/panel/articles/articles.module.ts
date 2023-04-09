import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../utils/utils.module';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesComponent } from './articles.component';
import { ListComponent } from './list/list.component';
import { BrandsComponent } from './brands/brands.component';
import { CategoriesComponent } from './categories/categories.component';
import { PricesComponent } from './prices/prices.component';
import { StockComponent } from './stock/stock.component';
import { ArticleComponent } from './article/article.component';

@NgModule({
    declarations: [
        ArticlesComponent,
        ListComponent,
        BrandsComponent,
        CategoriesComponent,
        PricesComponent,
        StockComponent,
        ArticleComponent,
    ],
    imports: [
        CommonModule,
        ArticlesRoutingModule,
        UtilsModule,
    ]
})
export class ArticlesModule { }
