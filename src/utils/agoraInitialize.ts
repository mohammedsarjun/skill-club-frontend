import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-sdk-ng";

let client: IAgoraRTCClient | null = null;
let localAudioTrack: IMicrophoneAudioTrack | null = null;
let localVideoTrack: ICameraVideoTrack | null = null;

export async function startAgora({ appId, token, channelName, uid }: { appId: string; token: string; channelName: string; uid: string }) {
  client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
 

  await client.join(appId, channelName, token, uid);

  localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  localVideoTrack = await AgoraRTC.createCameraVideoTrack();

  await client.publish([localAudioTrack, localVideoTrack]);

  localVideoTrack.play("local-player");

  client.on("user-published", async (user, mediaType) => {
    await client!.subscribe(user, mediaType);
    if (mediaType === "video") {
      const remoteContainer = document.getElementById("remote-player");
      if (remoteContainer) {
        user.videoTrack?.play(remoteContainer);
      }
    }
    if (mediaType === "audio") {
      user.audioTrack?.play();
    }
  });

  return { client, localAudioTrack, localVideoTrack };
}

export async function leaveMeeting() {
  if (client) {
    await client.leave();
  }
  if (localAudioTrack) {
    localAudioTrack.close();
  }
  if (localVideoTrack) {
    localVideoTrack.close();
  }
  
  client = null;
  localAudioTrack = null;
  localVideoTrack = null;
}

export function toggleMute() {
  if (localAudioTrack) {
    localAudioTrack.setEnabled(!localAudioTrack.enabled);
    return localAudioTrack.enabled;
  }
  return false;
}

export function toggleVideo() {
  if (localVideoTrack) {
    
    localVideoTrack.setEnabled(!localVideoTrack.enabled);
    
    return localVideoTrack.enabled;
  }
  return false;
}