import { Injectable } from '@angular/core';
import { ISong, SubsonicService, IPlaylist } from 'subular';
import { WorkerService } from './worker.service';
import * as fs from "file-system";
import * as utilModule from "utils/utils";
import { SubularMobileService } from './subularMobile.service';

interface ISongToDownload {
	song: ISong;
	onComplete?: Function;
}

@Injectable()
export class DownloadQueueService {
	downloadingPlaylists = false;
	downloadingSongs = false;
	private worker: Worker;
	private songs: ISongToDownload[] = [];
	private playlists: IPlaylist[] = [];

	constructor(private workers: WorkerService, private subular: SubularMobileService) {
		this.worker = this.workers.initDownloadWorker();

		this.worker.onerror = error => {
			console.error(error.message);
		};
	}

	addSongToTheQueue(song: ISongToDownload): boolean {
		let path = fs.path.join(fs.knownFolders.documents().path, song.song.id.toString() + '.mp3');
		if (!fs.File.exists(path)) {
			this.songs = [...this.songs, song];
			if (!this.downloadingSongs) {
				this.downloadingSongs = true;
				this.processSongsQueue();
			}
			return true;
		} else {
			this.subular.StoreCachedSong(song.song);
			return false;
		}
	}

	processSongsQueue() {
		if (this.songs && this.songs.length > 0) {
			const song = this.songs[0].song;
			const onComplete = this.songs[0].onComplete;

			let url = this.subular.getDownloadUrl(song.id);
			let path = fs.path.join(fs.knownFolders.documents().path, song.id.toString() + '.mp3');

			let coverPath = fs.path.join(fs.knownFolders.documents().path + '/images', song.albumId + '.png');
			let coverUrl = this.subular.subsonicGetSongCoverUrl(song, 600);

			this.worker.onmessage = m => {
				this.subular.StoreCachedSong(song);
				if (onComplete) {
					onComplete();
				}
				this.songs = [...this.songs.slice(1)];
				// process the next song in the queue
				this.processSongsQueue();
			}

			if (!fs.File.exists(coverPath)) {
				this.worker.postMessage({ url: coverUrl, path: coverPath })
			}
			this.worker.postMessage({ url, path })
		} else {
			this.downloadingSongs = false;
		}
	}

	downloadPlaylistCoverArt(playlist: IPlaylist) {
		this.playlists = [...this.playlists, playlist];
		if (!this.downloadingPlaylists) {
			this.downloadingPlaylists = true;
			this.processPlaylistQueue();
			return true;
		}
		return false;
	}

	processPlaylistQueue() {
		if (this.playlists && this.playlists.length > 0) {

			const playlist = this.playlists[0];
			let coverPath = fs.path.join(fs.knownFolders.documents().path + '/images', playlist.coverArt + '.png');
			let coverUrl = this.subular.subsonicGetPlaylistCoverUrl(playlist, 600);

			this.worker.onmessage = m => {
				this.playlists = [...this.playlists.slice(1)];
				// process the next song in the queue
				this.processPlaylistQueue();
			}

			if (!fs.File.exists(coverPath)) {
				this.worker.postMessage({ url: coverUrl, path: coverPath })
			} {
				this.playlists = [...this.playlists.slice(1)];
				this.processPlaylistQueue();
			}
		} else {
			this.downloadingPlaylists = false;
		}
	}
}
