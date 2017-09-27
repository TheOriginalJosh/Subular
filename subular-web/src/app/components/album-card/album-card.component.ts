import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { SubsonicService, IAlbum } from '../../../shared-services/index';

@Component({
	selector: 'album-card',
	templateUrl: 'album-card.component.html',
	styleUrls: ['album-card.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class AlbumCardComponent implements OnInit {
	@Input() album: IAlbum;

	getCoverUrl(id) {
		if (id)
			return this.subsonic.subsonicGetCoverUrl(id);
	}

	constructor(private subsonic: SubsonicService) {

	}
	ngOnInit() { }
}