import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { ItemsComponent } from "./item/items.component";
import { LoginComponent } from "./views/login/login.component";
import { SubularAppComponent } from "./views/subular-app/subular-app.component";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    {
		path: 'app',
		component: SubularAppComponent,
		// children: [
		// 	{ path: '', redirectTo: 'random', pathMatch: 'full', canActivate: [SubsonicGuard] },
		// 	{ path: 'random', component: RandomAlbumsComponent },
		// 	{
		// 		path: 'albums/:artistId', component: AlbumsComponent,
		// 		resolve: {
		// 			albums: AlbumResolver
		// 		}
		// 	},
		// 	{ path: 'artist/:id', component: RandomAlbumsComponent },
		// 	{ path: 'playlists', component: RandomAlbumsComponent },
		// 	{ path: 'playlist/:id', component: RandomAlbumsComponent }
		// ]
	},
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }