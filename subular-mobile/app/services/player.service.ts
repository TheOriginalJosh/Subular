import { Injectable } from '@angular/core';
import { ISong, SubsonicService } from 'subular';
import { Observable } from 'rxjs/Observable';
import { TNSPlayer } from 'nativescript-audio';

export enum PlayingStatus {
	loading,
	paused,
	playing
}

export interface IAudioPlayingInfo {
	song: ISong;
	playing: PlayingStatus;
	remainingTime?: number;
	position?: number;
	mins?: number;
	secs?: number;
}

@Injectable()
export class PlayerService {
	songList: ISong[] = [];
	playHistory: ISong[] = [];
	nowPlaying$: Observable<IAudioPlayingInfo>;
	private _player: TNSPlayer;
	private currentSong: IAudioPlayingInfo;
	private currentIndex: number;


	constructor(private subularService: SubsonicService) {
		this.setupAudio();
	}

	clearSongs(): void {
		this.songList = [];
	}

	addSong(song: ISong): void {
		this.songList = [...this.songList, song];
	}

	addAndPlaySong(song: ISong): void {
		this.addSong(song);
		this.playSong(this.songList.indexOf(song));
	}

	addSongs(songs: ISong[]): void {
		this.songList = [...this.songList, ...songs];
	}

	addSongsAndPlaySong(songs: ISong[], song: ISong) {
		this.addSongs(songs);
		this.playSong(this.songList.indexOf(song));
	}

	shuffleSongs(): void {
		const songList = this.songList;

		let currentIndex = songList.length, temporaryValue, randomIndex;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = songList[currentIndex];
			songList[currentIndex] = songList[randomIndex];
			songList[randomIndex] = temporaryValue;
		}
		this.songList = songList;
	}


	playSong(index?: number): void {
		if (this.songList.length > 0) {
			this.currentIndex = (!index ? 0 : index);

			const playingSong = this.songList[this.currentIndex];

			this.playHistory = [...this.playHistory, playingSong];
			this.currentSong = { song: playingSong, playing: PlayingStatus.loading, position: 0, remainingTime: 0 };

			const streamUrl = this.subularService.getStreamUrl(playingSong.id) + '&maxBitRate=128';

			if (this._player.isAudioPlaying()) {
				console.log('another song playing')
				this._player.pause().then();
				this._player.dispose();
			}

			this._player.playFromUrl({
				audioFile: streamUrl,

				loop: false,
			}).then(() => {
				console.log('then done...')
			});
		}
	}

	private setupAudio() {
		this._player = new TNSPlayer();

		// const timeUpdate$ = Observable.fromEvent(this.audio, 'timeupdate')
		// 	.map(() => {
		// 		const remainder = this.audio.duration - this.audio.currentTime;
		// 		const position = (this.audio.currentTime / this.audio.duration) * 100;
		// 		const mins = Math.floor(remainder / 60);
		// 		const secs = remainder - mins * 60;
		// 		return {
		// 			song: this.currentSong.song,
		// 			playing: PlayingStatus.playing,
		// 			remainingTime: remainder,
		// 			position: position,
		// 			mins,
		// 			secs
		// 		};
		// 	});
		// const trackPaused$ = Observable.fromEvent(this.audio, 'pause')
		// 	.map(() => {
		// 		return { ...this.currentSong, playing: PlayingStatus.paused };
		// 	});
		// const trackPlay$ = Observable.fromEvent(this.audio, 'play')
		// 	.map(() => {
		// 		return { ...this.currentSong, playing: PlayingStatus.playing };
		// 	});
		// const trackDone$ = Observable.fromEvent(this.audio, 'ended')
		// 	.do(() => {
		// 		if ((this.currentIndex + 1) < this.songList.length) {
		// 			this.playSong(this.currentIndex + 1);
		// 		}
		// 	})
		// 	.map(() => null);

		// this.nowPlaying$ = Observable.merge(timeUpdate$, trackDone$, trackPaused$, trackPlay$);
	}

	pauseSong(): void {
		this._player.pause();
	}

	resumeSong(): void {
		this._player.play();
	}

	playNextSong() {
		const nextIndex = (this.currentIndex + 1) >= this.songList.length ? 0 : (this.currentIndex + 1);
		this.playSong(nextIndex);
	}

	playPreviousSong() {
		const previousIndex = (this.currentIndex - 1) < 0 ? (this.songList.length - 1) : (this.currentIndex - 1);
		this.playSong(previousIndex);
	}

	songUpdated(song: ISong) {
		this.songList = this.songList.map(previousSong => {
			if (song.id === previousSong.id) {
				return song;
			}
			return previousSong;
		});
		this.playHistory = this.playHistory.map(previousSong => {
			if (song.id === previousSong.id) {
				return song;
			}
			return previousSong;
		});
	}
}
