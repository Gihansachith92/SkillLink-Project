package com.gihan.skilllinkbackend.service;

import com.gihan.skilllinkbackend.model.Connection;
import com.gihan.skilllinkbackend.model.User;
import com.gihan.skilllinkbackend.repository.ConnectionRepository;
import com.gihan.skilllinkbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. SEND A REQUEST
    public Connection sendRequest(Long senderId, Long receiverId){
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if(senderId.equals(receiverId)){
            throw new RuntimeException("You cannot send a request to yourself.");
        }

        Optional<Connection> existing1 = connectionRepository.findBySenderAndReceiver(sender,receiver);
        Optional<Connection> existing2 = connectionRepository.findBySenderAndReceiver(receiver,sender);

        if(existing1.isPresent() || existing2.isPresent()){
            throw  new RuntimeException("A connection request already exists between these users.");
        }

        Connection newConnection = new Connection(sender,receiver,"PENDING");
        return  connectionRepository.save(newConnection);

    }

    // 2. ACCEPT OR DECLINE A REQUEST
    public Connection updateConnectionStatus(Long connectionId, String newStatus){
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection request not found"));

        connection.setStatus(newStatus);
        return connectionRepository.save(connection);
    }

    // 3. WITHDRAW A SENT REQUEST (Deletes it completely from the database)
    public void deleteConnection(Long connectionId){
        connectionRepository.deleteById(connectionId);
    }

    // 4. GET INCOMING REQUESTS (For the "Incoming" tab)
    public List<Connection> getIncomingRequests(Long userId){
        User receiver = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return connectionRepository.findByReceiverAndStatus(receiver, "PENDING");
    }

    // 5. GET SENT REQUESTS (For the "Sent" tab)
    public List<Connection> getSentRequests(Long userId){
        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return connectionRepository.findBySenderAndStatus(sender, "PENDING");
    }

    // 6. GET ALL ESTABLISHED CONNECTIONS (For the "My Connections" tab)
    public List<Connection> getAcceptedConnections(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return connectionRepository.findBySenderAndStatusOrReceiverAndStatus(
                user, "ACCEPTED",
                user, "ACCEPTED"
        );
    }

}
