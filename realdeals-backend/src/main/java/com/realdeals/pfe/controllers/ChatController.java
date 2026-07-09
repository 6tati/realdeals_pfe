package com.realdeals.pfe.controllers;

import com.realdeals.pfe.entities.ChatConversations;
import com.realdeals.pfe.entities.ChatMessage;
import com.realdeals.pfe.repositories.ChatConversationsRepository;
import com.realdeals.pfe.repositories.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatConversationsRepository chatConversationsRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    // GET all conversations for a user
    @GetMapping("/conversations/{idUtilisateur}")
    public ResponseEntity<List<ChatConversations>> getConversationsByUser(@PathVariable Long idUtilisateur) {
        List<ChatConversations> conversations = chatConversationsRepository.findByUtilisateur_IdUtilisateur(idUtilisateur);
        return ResponseEntity.ok(conversations);
    }

    // GET messages in a conversation
    @GetMapping("/messages/{idConversation}")
    public ResponseEntity<List<ChatMessage>> getMessagesByConversation(@PathVariable Long idConversation) {
        List<ChatMessage> messages = chatMessageRepository.findByConversation_IdConversation(idConversation);
        return ResponseEntity.ok(messages);
    }

    // POST create new conversation
    @PostMapping("/conversations")
    public ResponseEntity<ChatConversations> createConversation(@RequestBody ChatConversations conversation) {
        ChatConversations saved = chatConversationsRepository.save(conversation);
        return ResponseEntity.ok(saved);
    }

    // POST send message (user or bot)
    @PostMapping("/messages")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        ChatMessage saved = chatMessageRepository.save(message);
        return ResponseEntity.ok(saved);
    }

    // GET conversation by ID
    @GetMapping("/conversations/{id}")
    public ResponseEntity<ChatConversations> getConversationById(@PathVariable Long id) {
        Optional<ChatConversations> conversation = chatConversationsRepository.findById(id);
        return conversation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE conversation
    @DeleteMapping("/conversations/{id}")
    public ResponseEntity<Void> deleteConversation(@PathVariable Long id) {
        if (chatConversationsRepository.existsById(id)) {
            chatConversationsRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE message
    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        if (chatMessageRepository.existsById(id)) {
            chatMessageRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
