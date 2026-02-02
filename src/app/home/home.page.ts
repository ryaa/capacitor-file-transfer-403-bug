import { Component } from '@angular/core';
import { IonButton, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { FileTransfer } from '@capacitor/file-transfer';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  constructor() { }

public async emulateFileTransferDownloadFile403Errors(): Promise<void> {
  const filename = `test-${Date.now()}.bin`;
  const { uri } = await Filesystem.getUri({
    directory: Directory.Documents,
    path: filename,
  });

  const fileTransferConfig = {
    path: uri,
    url: 'https://httpbin.org/status/403',
  };

  try {
    const res = await FileTransfer.downloadFile(fileTransferConfig);
    console.info('downloadFile result:', res);
    console.info(`File downloaded to: ${uri}`);

    try {
      const stat = await Filesystem.stat({ path: uri });
      console.info('Downloaded file stat:', stat);
    } catch (e) {
      console.warn('Filesystem.stat failed:', e);
    }

    try {
      const data = await Filesystem.readFile({ path: uri });
      console.info('Downloaded file base64 prefix:', data.data.slice(0, 80));
    } catch (e) {
      console.warn('Filesystem.readFile failed:', e);
    }
  } catch (err) {
    console.error('Error during file transfer:', err);
  }
}


}
