package com.realdeals.pfe.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "CHATMESSAGE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_CHATMESSAGE")
    private Long idChatMessage;

    @Column(name = "EXPEDITEUR", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private Expediteur expediteur;

    @Column(name = "CONTENU", nullable = false, columnDefinition = "TEXT")
    private String contenu;

    @Column(name = "DATE_D_ENVOI", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dateDEnvoi;

    // Relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CONVERSATION", referencedColumnName = "ID_CONVERSATION", nullable = false)
    private ChatConversations conversation;

    public enum Expediteur {
        USER, BOT
    }

    @PrePersist
    protected void onCreate() {
        if (dateDEnvoi == null) {
            dateDEnvoi = LocalDateTime.now();
        }
    }
}
