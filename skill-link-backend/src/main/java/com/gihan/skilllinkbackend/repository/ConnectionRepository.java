package com.gihan.skilllinkbackend.repository;

import com.gihan.skilllinkbackend.model.Connection;
import com.gihan.skilllinkbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    // 1. Check if a connection already exists between two users (prevents spamming requests)
    Optional<Connection> findBySenderAndReceiver(User sender, User receiver);

    // 2. Find all incoming requests for a user (e.g., status = "PENDING")
    List<Connection> findByReceiverAndStatus(User receiver, String status);

    // 3. Find all outgoing requests sent by a user (e.g., status = "PENDING")
    List<Connection> findBySenderAndStatus(User sender, String status);

    // 4. Find all accepted friends (User could be the sender OR the receiver)
    List<Connection> findBySenderAndStatusOrReceiverAndStatus(
            User sender, String status1,
            User receiver, String status2
    );

}
