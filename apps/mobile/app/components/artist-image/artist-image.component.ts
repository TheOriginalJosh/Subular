import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { of, Observable } from 'rxjs';
import { SubsonicService } from '@Subular/core';
import { tap, map, switchMap, concat, delay, catchError } from 'rxjs/operators';
import { getFile } from 'tns-core-modules/http/http';
import { knownFolders, path, File } from 'tns-core-modules/file-system';
import { CurrentConnectionService } from '~/services/currentConnection.service';
import { connectionType } from 'tns-core-modules/connectivity/connectivity';
import { fromPromise } from 'rxjs/observable/fromPromise';

export const PLACEHOLDER_IMAGE = '~/images/artist.png';

@Component({
  moduleId: module.id,
  selector: 'artist-image',
  templateUrl: './artist-image.component.html',
  styleUrls: ['./artist-image.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistImageComponent implements OnInit {
  @Input() row: number;
  @Input() col: number;
  @Input() artistId: number;
  @Input() name: string;
  constructor(
    private subsonic: SubsonicService,
    private connection: CurrentConnectionService
  ) {}

  ngOnInit() {}

  getArtistImage(artistId): Observable<string> {
    const placeholderImage$ = of(PLACEHOLDER_IMAGE);
    const fileName = artistId + '.png';
    if (artistId) {
      let coverPath = path.join(
        knownFolders.documents().path + '/artist-images',
        fileName
      );

      const exists = File.exists(coverPath);
      const fileSize = knownFolders
        .documents()
        .getFolder('artist-images')
        .getFile(fileName).size;

      if (exists && fileSize > 200) {
        return of(coverPath);
      }
      if (fileSize <= 200) {
        knownFolders
          .documents()
          .getFolder('artist-images')
          .getFile(fileName)
          .remove()
          .then();
      }

      const downloadImage$ = imageUrl =>
        fromPromise(
          getFile(
            {
              url: imageUrl,
              method: 'GET'
            },
            coverPath
          )
        ).pipe(
          catchError(() => {
            return placeholderImage$;
          }),
          map(value => (value != PLACEHOLDER_IMAGE ? coverPath : value))
        );

      return this.connection.connectionType$.pipe(
        switchMap(connection => {
          if (connection == connectionType.wifi) {
            return placeholderImage$.pipe(
              concat(
                this.subsonic
                  .getArtistInfo(artistId)
                  .pipe(
                    map(info => info.mediumImageUrl),
                    switchMap(downloadImage$)
                  )
              )
            ) as Observable<string>;
          }
          return placeholderImage$;
        })
      );
    }
    return placeholderImage$;
  }

  ngAfterViewInit() {
    // if (this.artistId) {
  }
}
