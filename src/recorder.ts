interface IDataAvailableEvent extends Event {
  data: Blob;
}

class Recorder {
  mediaRecorder: MediaRecorder | null = null;
  chunks: Blob[] = [];

  startRecording() {
    const constraints = { audio: true };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        const config = { mimeType: 'audio/webm' };
        this.mediaRecorder = new MediaRecorder(stream, config);
        this.mediaRecorder.addEventListener(
          'dataavailable',
          (event: IDataAvailableEvent) => {
            this.chunks.push(event.data);
          }
        );
        this.mediaRecorder.start();
      })
      .catch(error => console.error(error));
  }

  async stopRecording(): Promise<Blob> {
    return new Promise(resolve => {
      this.mediaRecorder?.addEventListener('stop', () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' });
        this.chunks = [];
        resolve(blob);
      });
      this.mediaRecorder?.stop();
    });
  }
}

export { Recorder };
