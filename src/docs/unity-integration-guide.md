# Ludo Magic Savannah - Unity Game Engine Integration Guide

## 1. Architectural Overview
For high-performance 3D cross-platform deployments (iOS, Android, Steam, WebGL), Unity connects to the **same Supabase Realtime & Edge Functions backend** used by the React web client.

```
┌──────────────────────────────────────────────────────────┐
│                   Unity 3D Engine Client                 │
│  - Universal Render Pipeline (URP) Custom Shaders        │
│  - Cinemachine Dynamic Orbit Camera                      │
│  - DOTween Animation Pathfinding & 3D Animal Avatars     │
│  - Native FMOD / Unity Audio Spatial Soundscapes         │
└────────────────────────────┬─────────────────────────────┘
                             │ WebSocket / Realtime Channels
                             ▼
┌──────────────────────────────────────────────────────────┐
│                Supabase Backend & Edge API               │
│  - Edge Functions (Authoritative Dice & Anti-Cheat)      │
│  - Realtime Channels (Room Broadcast & State Sync)       │
│  - PostgreSQL + Row Level Security (RLS)                 │
└──────────────────────────────────────────────────────────┘
```

## 2. Unity C# State Synchronizer (Supabase C# SDK)

```csharp
using System.Threading.Tasks;
using UnityEngine;
using Supabase;
using Supabase.Realtime;

public class LudoRealtimeController : MonoBehaviour
{
    private Client supabaseClient;
    private RealtimeChannel activeChannel;

    public async void InitializeSession(string supabaseUrl, string anonKey, string roomCode)
    {
        var options = new SupabaseOptions { AutoRefreshToken = true };
        supabaseClient = new Client(supabaseUrl, anonKey, options);
        await supabaseClient.InitializeAsync();

        // Subscribe to Room Realtime Channel
        activeChannel = supabaseClient.Realtime.Channel($"ludo_room_{roomCode}");
        
        activeChannel.OnBroadcast("dice_rolled", (response) => {
            int diceValue = response.Payload.GetValue<int>("diceValue");
            Play3DDicePhysics(diceValue);
        });

        activeChannel.OnBroadcast("piece_moved", (response) => {
            int pieceId = response.Payload.GetValue<int>("pieceId");
            int toPos = response.Payload.GetValue<int>("toPosition");
            AnimatePieceStep(pieceId, toPos);
        });

        await activeChannel.Subscribe();
    }

    public async Task RequestDiceRoll(string gameId)
    {
        // Call Server Edge Function for authoritative roll
        var result = await supabaseClient.Functions.Invoke("roll-dice", new { gameId });
    }
}
```

## 3. WebGL <-> React Hybrid Bridge (`.jslib`)

For embedded WebGL inside React containers:

```javascript
mergeInto(LibraryManager.library, {
  SendActionToReact: function (actionTypeStr, jsonPayloadStr) {
    var type = UTF8ToString(actionTypeStr);
    var payload = UTF8ToString(jsonPayloadStr);
    window.dispatchEvent(new CustomEvent('unity_game_event', {
      detail: { type: type, data: JSON.parse(payload) }
    }));
  }
});
```
