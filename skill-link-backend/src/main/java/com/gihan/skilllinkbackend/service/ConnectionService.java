package com.gihan.skilllinkbackend.service;

import com.gihan.skilllinkbackend.model.Connection;
import com.gihan.skilllinkbackend.model.User;
import com.gihan.skilllinkbackend.repository.ConnectionRepository;
import com.gihan.skilllinkbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

}
