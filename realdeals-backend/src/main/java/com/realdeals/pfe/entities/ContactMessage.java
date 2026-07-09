package com.realdeals.pfe.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "CONTACT_MESSAGES")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_CONTACT_MESSAGE")
    private Long idContactMessage;

    @Column(name = "FULL_NAME", nullable = false, length = 100)
    private String fullName;

    @Column(name = "EMAIL", nullable = false, length = 150)
    private String email;

    @Column(name = "SUBJECT", nullable = false, length = 100)
    private String subject;

    @Column(name = "MESSAGE", nullable = false, length = 1000)
    private String message;

    @Column(name = "LU", nullable = false)
    private Boolean lu = false;

    @Column(name = "DATE_CREATION", nullable = false)
    private LocalDateTime dateCreation;

    @PrePersist
    protected void onCreate() {
        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }

        if (lu == null) {
            lu = false;
        }
    }
}