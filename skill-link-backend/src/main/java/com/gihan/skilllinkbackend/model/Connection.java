package com.gihan.skilllinkbackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "connections")
@Getter
@Setter
@NoArgsConstructor
public class Connection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Connection(User sender, User receiver, String status) {
        this.sender = sender;
        this.receiver = receiver;
        this.status = status;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt =  LocalDateTime.now();
    }

}
