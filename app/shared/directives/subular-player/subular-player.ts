import {Component, OnChanges, OnInit, ElementRef, Inject } from 'angular2/core';
import {SubularService} from './../../services/subular-service';
import {SettingsService} from './../../services/settings-service';
import {HTTP_PROVIDERS}  from 'angular2/http';
import {IAlbum} from './../../models/album';
import {PlayerService, IAudioPlayingInfo} from '../../services/player-service';
import {ISong} from '../../models/song';
import {SubularListItem} from '../subular-list-item/subular-list-item';
import {path} from '../folder-info';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {IArtist} from '../../models/artist';

@Component({
	selector: 'subular-player',
	templateUrl: path + 'subular-player/subular-player.html',
	directives: [SubularListItem, ROUTER_DIRECTIVES],
	inputs: ['imgUrl', 'albums', 'nowPlayingSong', 'time', 'song', 'playingSongs'],
	styles: [`
	.card-dark{
			background:rgb(34, 34, 34);
		}
	.playing-footer{
				position:fixed;
				width:100%;
				height:65px;
				bottom:0;
				background:#ffffff;
				border-top:1px #101010;
				box-shadow: 5px -1px 5px #888888;
			}
			i.fa{
				color: #101010;
				line-height: 60px !important;
				font-size: 46px !important;
				margin-right:7px;
			}
			i.play-pause{
				margin-right:20px;
			}
			div.ff-rw i, div.heart i{
				font-size: 28px !important;
				margin-right:10px;
			}

			.gutter{
				background-color:#101010;
				margin:0 !important;
				height:4px;
				padding:0;
			}
			.gutter-progress{
				background: -webkit-linear-gradient(#4B0082,#EED2EE);
				height:4px;
    			display: inline-block;
			}
			.title, .album, .artist, .cover-img{
				cursor:hand;
			}
			.title{
				width: 100%;
				display: inline-block;
				font-size: 20px;
				margin-top:5px;
			}
			.album{
				font-size: 13px;
				margin-left: 10px;
			}
			.artist{
				font-weight:700;
			}
			i.fa:hover{
				color:#9d9d9d;
			}
			#now-playing-list{
				position:absolute;
				bottom:75px;
				top:75px;
				right:30px;
				background-color:#fff;
				width:79%;
				overflow-y:auto;
				border-radius:2px;
				z-index: 99;
				padding:5px 0px 10px;
				border:1px #4B0082 solid;
			}
			#now-playing-list h3{
				padding:1px 15px;
			}
			.cover-img{
				height:63px;
			}
	`]
})
export class SubularPlayer implements OnChanges, OnInit {
	public albums: IAlbum[];
	public imgUrl: string;
	private playerService: PlayerService;
	public currentSong: ISong;
	public currentArtist: IArtist;
	public playing: boolean = false;
	private gutterProgress: Element;
	private songs: ISong[];
	public playingSongs: boolean = false;

	constructor(private _dataService: SubularService, private _elementRef: ElementRef, @Inject(PlayerService) playerService: PlayerService) {
		this.playerService = playerService;
		this.songs = [];
		this.currentSong = {
			id: 0,
			title: '',
			artist: '',
			parent: 0,
		};
	}
	nextSong(): void {
		this.playerService.playSong(this.playerService.currentIndex + 1);
		this.currentSong = this.playerService.currentSong();
		this.songs = this.playerService.songList;
		this.getImgUrl();
	}

	previousSong(): void {
		this.playerService.playSong(this.playerService.currentIndex - 1);
		this.currentSong = this.playerService.currentSong();
		this.getImgUrl();
	}

	pauseSong(): void {
		this.playerService.pauseSong();
	}

	playSong(): void {
		this.playerService.resumeSong();
	}
	ngOnChanges(changes): void {
		this.getImgUrl();
	}

	getImgUrl(): string {
		if (this.currentSong != null && this.currentSong.id != 0) {
			this.imgUrl = this._dataService.getCoverUrl(this.currentSong.parent);
		}
		return this.imgUrl;
	}

	ngOnInit(): void {
		this.gutterProgress = (<HTMLElement>this._elementRef.nativeElement).getElementsByClassName("gutter-progress")[0];

		this.playerService.playingSong.subscribe((song) => {
			this.currentSong = song;
			this.songs = this.playerService.songList;
			this.getImgUrl();
			this.currentArtist = this._dataService.getArtist(this.currentSong.artist);
		});

		this.playerService.currentPosition.subscribe((info: IAudioPlayingInfo) => {
			this.gutterProgress.setAttribute('style', 'width:' + info.position + '%;');
		});

		this.playerService.currentlyPlaying.subscribe((playing: boolean) => {
			this.playing = playing;
		});
	}
}
