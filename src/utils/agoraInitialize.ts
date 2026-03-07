import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-sdk-ng";

let client: IAgoraRTCClient | null = null;
let localAudioTrack: IMicrophoneAudioTrack | null = null;
let localVideoTrack: ICameraVideoTrack | null = null;

export async function startAgora({ appId, token, channelName, uid }: { appId: string; token: string; channelName: string; uid: string }) {
  // If there's already an active client, leave the previous meeting first.
  if (client) {
    await leaveMeeting();
  }

  const currentClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  client = currentClient;

  if (!client) throw new Error("Agora client not initialized");

  client.on("user-published", async (user, mediaType) => {
    if (!client) return; // Prevent subscribing if meeting was left
    await client.subscribe(user, mediaType);
    if (mediaType === "video") {
      const remoteContainer = document.getElementById("remote-player");
      if (remoteContainer) {
        // Clear any previous child nodes to prevent duplicate frames
        remoteContainer.innerHTML = '';
        user.videoTrack?.play(remoteContainer);
      }
    }
    if (mediaType === "audio") {
      user.audioTrack?.play();
    }
  });

  client.on("user-unpublished", (user, mediaType) => {
    if (mediaType === "video") {
      const remoteContainer = document.getElementById("remote-player");
      if (remoteContainer) {
        // Restore the "Waiting for participant" generic UI when video is unpublished
        remoteContainer.innerHTML = `
          <div class="text-center">
            <div class="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <p class="text-gray-400">Waiting for participant...</p>
          </div>
        `;
      }
    }
  });

  // Pass null to let Agora securely generate a valid Integer UID that matches the primitive token type
  const assignedUid = await client.join(appId, channelName, token, null);
  console.log("Joined with assigned UID:", assignedUid);

  const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  const videoTrack = await AgoraRTC.createCameraVideoTrack();

  // Handle case where leaveMeeting was called during the async operations (e.g., React Strict Mode unmount)
  if (client !== currentClient || !client) {
    audioTrack.close();
    videoTrack.close();
    // CRITICAL: We successfully joined above, but the component already unmounted mid-flight. 
    // We must manually close the ghost connection to prevent duplicating ourselves in the room!
    currentClient.leave().catch(console.error);

    console.warn("Agora initialization aborted due to unmount");
    return {
      client: null,
      localAudioTrack: null,
      localVideoTrack: null,
      isAudioEnabled: false,
      isVideoEnabled: false
    };
  }

  localAudioTrack = audioTrack;
  localVideoTrack = videoTrack;

  await client.publish([localAudioTrack, localVideoTrack]);

  // Clean up any stray existing video elements inside the container before forcing a new Local Player
  const localContainer = document.getElementById("local-player");
  if (localContainer) {
    localContainer.innerHTML = '';
  }

  localVideoTrack.play("local-player");

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