package com.gihan.skilllinkbackend.controller;

import com.gihan.skilllinkbackend.model.Message;
import com.gihan.skilllinkbackend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class MessageController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @MessageMapping("/chat")
    public void processMessage(@Payload Message chatMessage){
        Message savedMessage = messageRepository.save(chatMessage);

        messagingTemplate.convertAndSendToUser(
                String.valueOf(chatMessage.getSenderId()),
                "/queue/messages",
                savedMessage
        );
    }

    @GetMapping("/api/messages/{user1Id}/{user2Id}")
    public ResponseEntity<List<Message>> getChatHistory(
            @PathVariable Long user1Id,
            @PathVariable Long user2Id) {
        List<Message> history = messageRepository.findConversation(user1Id,user2Id);
        return ResponseEntity.ok(history);
    }


}
