package com.gihan.skilllinkbackend.controller;

import com.gihan.skilllinkbackend.model.Connection;
import com.gihan.skilllinkbackend.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "http://localhost:4200")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    // 1. Send a new connection request
    @PostMapping("/request")
    public ResponseEntity<Connection> sendRequest(@RequestParam Long senderId, @RequestParam Long receiverId){
        return ResponseEntity.ok(connectionService.sendRequest(senderId, receiverId));
    }

    // 2. Accept or Decline a request
    @PutMapping("/{connectionId}/status")
    public ResponseEntity<Connection> updateStatus(@PathVariable Long connectionId, @RequestParam String status){
        return ResponseEntity.ok(connectionService.updateConnectionStatus(connectionId, status));
    }

    // 3. Withdraw/Cancel a sent request
    @DeleteMapping("/{connectionId}")
    public ResponseEntity<Void> withdrawRequest(@PathVariable Long connectionId){
        connectionService.deleteConnection(connectionId);
        return ResponseEntity.ok().build();
    }

    // 4. Get all incoming requests (For the "Incoming" tab)
    @GetMapping("/incoming/{userId}")
    public ResponseEntity<List<Connection>> getIncomingRequests(@PathVariable Long userId){
        return ResponseEntity.ok(connectionService.getIncomingRequests(userId));
    }

    // 5. Get all sent requests (For the "Sent" tab)
    @GetMapping("/sent/{userId}")
    public ResponseEntity<List<Connection>> getSentRequests(@PathVariable Long userId){
        return ResponseEntity.ok(connectionService.getSentRequests(userId));
    }

    // 6. Get all accepted connections (For the "My Connections" tab)
    @GetMapping("/accepted/{userId}")
    public ResponseEntity<List<Connection>> getAcceptedConnections(@PathVariable Long userId){
        return ResponseEntity.ok(connectionService.getAcceptedConnections(userId));
    }

    // 7. Get the exact number of incoming requests (For the UI Notification Dot!)
    @GetMapping("/pending-count/{userId}")
    public ResponseEntity<Integer> getPendingCount(@PathVariable Long userId){
        List<Connection> incoming = connectionService.getIncomingRequests(userId);
        return ResponseEntity.ok(incoming.size());
    }

}
