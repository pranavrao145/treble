import { ISong } from "./types";

export async function addToQueue(song: ISong, serverQueue: ISong[]) {
  serverQueue.push(song); // add the song to the queue
}
