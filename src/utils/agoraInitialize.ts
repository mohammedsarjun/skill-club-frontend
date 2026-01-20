import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-sdk-ng";

let client: IAgoraRTCClient | null = null;
let localAudioTrack: IMicrophoneAudioTrack | null = null;
let localVideoTrack: ICameraVideoTrack | null = null;

export async function startAgora({ appId, token, channelName, uid }: { appId: string; token: string; channelName: string; uid: string }) {
  client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
 
if (!client) throw new Error("Agora client not initialized");
console.log("Joining uid:", uid);
await client.join(appId, channelName, token, null);

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

  return { 
    client, 
    localAudioTrack, 
    localVideoTrack,
    isAudioEnabled: localAudioTrack.enabled,
    isVideoEnabled: localVideoTrack.enabled
  };
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
    const newState = !localAudioTrack.enabled;
    localAudioTrack.setEnabled(newState);
    return newState;
  }
  return false;

  
}

export function toggleVideo() {
  if (localVideoTrack) {
    const newState = !localVideoTrack.enabled;
    localVideoTrack.setEnabled(newState);
    return newState;
  }
  return false;
}