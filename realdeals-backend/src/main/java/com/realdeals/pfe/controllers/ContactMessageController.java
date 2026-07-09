package com.realdeals.pfe.controllers;

import com.realdeals.pfe.entities.ContactMessage;
import com.realdeals.pfe.repositories.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact-messages")
@CrossOrigin(origins = "*")
public class ContactMessageController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    // Public: client sends message
    @PostMapping
    public ResponseEntity<ContactMessage> createMessage(@RequestBody ContactMessage message) {
        message.setIdContactMessage(null);
        message.setLu(false);

        ContactMessage saved = contactMessageRepository.save(message);
        return ResponseEntity.ok(saved);
    }

    // Admin: get all messages
    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        List<ContactMessage> messages = contactMessageRepository.findAllByOrderByDateCreationDesc();
        return ResponseEntity.ok(messages);
    }

    // Admin: unread count
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount() {
        long count = contactMessageRepository.countByLuFalse();

        Map<String, Object> response = new HashMap<>();
        response.put("count", count);

        return ResponseEntity.ok(response);
    }

    // Admin: mark as read
    @PutMapping("/{id}/read")
    public ResponseEntity<ContactMessage> markAsRead(@PathVariable Long id) {
        return contactMessageRepository.findById(id)
                .map(message -> {
                    message.setLu(true);
                    ContactMessage updated = contactMessageRepository.save(message);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: delete message
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        if (!contactMessageRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        contactMessageRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}